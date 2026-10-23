"""Motore dei timer delle luci: logica pura, senza Home Assistant, provata con pytest.

Per ogni luce: quando si accende parte un timer, quando si spegne (a mano o per scadenza) il ciclo finisce.
Alla scadenza la luce si spegne, a meno che ci sia ancora movimento (il timer si rinnova).
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from statistics import median
from typing import Any

DOMAINS = ("light", "switch", "fan", "input_boolean")
MIN_MINUTES, MAX_MINUTES = 1, 720
MAX_WARN = 120
MAX_LIGHTS = 40
MAX_CYCLES = 400
KEEP_DAYS = 45
REON_SECONDS = 120          # riaccesa entro due minuti dalla scadenza: il timer era troppo corto
_ENTITY = re.compile(r"^([a-z_]+)\.([a-z0-9_]+)$")


@dataclass(frozen=True)
class LightConfig:
    entity: str
    name: str
    minutes: int = 5
    enabled: bool = True
    motion: str = ""          # binary_sensor che rinnova il timer finché c'è movimento (vuoto = nessuno)
    warn_seconds: int = 0     # lampeggio di avviso prima dello spegnimento, solo per le luci (0 = nessuno)

    @property
    def key(self) -> str:
        return self.entity.replace(".", "_")

    @property
    def domain(self) -> str:
        return self.entity.split(".", 1)[0]

    def to_dict(self) -> dict[str, Any]:
        return {
            "entity": self.entity, "name": self.name, "minutes": self.minutes, "enabled": self.enabled,
            "motion": self.motion, "warn_seconds": self.warn_seconds,
        }

    @staticmethod
    def from_dict(raw: Any) -> "LightConfig | None":
        if not isinstance(raw, dict):
            return None
        entity = str(raw.get("entity", "")).strip()
        m = _ENTITY.match(entity)
        if not m or m.group(1) not in DOMAINS:
            return None
        name = str(raw.get("name") or "").strip() or m.group(2).replace("_", " ").capitalize()
        minutes = _int(raw.get("minutes"), 5)
        warn = _int(raw.get("warn_seconds"), 0)
        motion = str(raw.get("motion") or "").strip()
        if motion and not motion.startswith(("binary_sensor.", "input_boolean.")):
            motion = ""
        return LightConfig(
            entity=entity,
            name=name[:60],
            minutes=min(MAX_MINUTES, max(MIN_MINUTES, minutes)),
            enabled=raw.get("enabled") is not False,
            motion=motion,
            warn_seconds=min(MAX_WARN, max(0, warn)) if m.group(1) == "light" else 0,
        )


def _int(v: Any, default: int) -> int:
    try:
        if isinstance(v, bool):
            return default
        return int(round(float(v)))
    except (TypeError, ValueError):
        return default


def parse_lights(raw: Any) -> list[LightConfig]:
    """Elenco di luci da dati qualsiasi: scarta le voci non valide e i doppioni."""
    out: list[LightConfig] = []
    seen: set[str] = set()
    for item in raw if isinstance(raw, list) else []:
        cfg = LightConfig.from_dict(item)
        if cfg is not None and cfg.entity not in seen:
            seen.add(cfg.entity)
            out.append(cfg)
    return out[:MAX_LIGHTS]


def _dt(value: Any) -> datetime | None:
    if not isinstance(value, str):
        return None
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None


@dataclass
class Cycle:
    """Un ciclo di accensione di una luce, per le statistiche."""

    start: datetime
    end: datetime
    how: str                  # "scaduto" | "manuale"
    extended: int = 0         # quante volte è stato prolungato o rinnovato
    held: bool = False
    reon: bool = False        # riaccesa subito dopo la scadenza

    def to_dict(self) -> dict[str, Any]:
        return {"s": self.start.isoformat(), "e": self.end.isoformat(), "h": self.how, "x": self.extended, "k": self.held, "r": self.reon}

    @staticmethod
    def from_dict(raw: Any) -> "Cycle | None":
        if not isinstance(raw, dict):
            return None
        s, e = _dt(raw.get("s")), _dt(raw.get("e"))
        if s is None or e is None or raw.get("h") not in ("scaduto", "manuale"):
            return None
        return Cycle(s, e, raw["h"], _int(raw.get("x"), 0), raw.get("k") is True, raw.get("r") is True)


@dataclass
class LightTimer:
    cfg: LightConfig
    on: bool | None = None            # stato noto della luce (None = sconosciuto o non disponibile)
    end: datetime | None = None       # scadenza del timer in corso
    held: bool = False                # "tieni accesa": nessuna scadenza finché la luce resta accesa
    warned: bool = False
    started: datetime | None = None
    extended: int = 0
    expected_off: bool = False        # lo spegnimento in arrivo lo ha chiesto il timer
    last_expired: datetime | None = None
    saved: dict[str, Any] | None = None   # timer salvato prima del riavvio, da ripristinare al primo stato noto

    # ------------------------------------------------------------------ stato
    def status(self, master: bool) -> str:
        """"non_disponibile", "spenta", "in_corso", "tenuta" o "timer_disattivato"."""
        if self.on is None:
            return "non_disponibile"
        if not self.on:
            return "spenta"
        if self.held:
            return "tenuta"
        if self.end is not None:
            return "in_corso"
        return "timer_disattivato"

    def remaining(self, now: datetime) -> float | None:
        return max(0.0, (self.end - now).total_seconds()) if self.end is not None else None

    def active(self, master: bool) -> bool:
        return master and self.cfg.enabled

    # ------------------------------------------------------------------ eventi della luce
    def light_changed(self, now: datetime, is_on: bool | None, master: bool) -> Cycle | None:
        """Aggiorna con il nuovo stato della luce; se è finito un ciclo lo ritorna per le statistiche."""
        prev = self.on
        if is_on is None:
            self.on = None
            return None
        self.on = is_on
        if is_on:
            if prev is True:
                return None
            if prev is None and self.saved:
                self._restore(now, master)
                return None
            self.saved = None
            self._begin(now, master)
            return None
        self.saved = None
        return self._finish(now)

    def _begin(self, now: datetime, master: bool) -> None:
        self.started = now
        self.held = False
        self.warned = False
        self.extended = 0
        self.expected_off = False
        self.end = now + timedelta(minutes=self.cfg.minutes) if self.active(master) else None

    def _finish(self, now: datetime) -> Cycle | None:
        cycle = None
        if self.started is not None:
            how = "scaduto" if self.expected_off else "manuale"
            cycle = Cycle(self.started, now, how, self.extended, self.held)
            if how == "scaduto":
                self.last_expired = now
        self.started = None
        self.end = None
        self.held = False
        self.warned = False
        self.extended = 0
        self.expected_off = False
        return cycle

    def reon_check(self, now: datetime) -> bool:
        """True se la luce è stata riaccesa subito dopo una scadenza (serve a segnare il ciclo precedente)."""
        return self.last_expired is not None and (now - self.last_expired).total_seconds() <= REON_SECONDS

    # ------------------------------------------------------------------ passo periodico
    def tick(self, now: datetime, motion: bool, master: bool) -> str | None:
        """Ritorna "expire" (spegni la luce), "renew" (c'è movimento: rinnovato) o "warn" (lampeggio), altrimenti None."""
        if self.on is not True or self.end is None or self.held:
            return None
        if not self.active(master):
            return None
        if now >= self.end:
            if motion and self.cfg.motion:
                self.end = now + timedelta(minutes=self.cfg.minutes)
                self.warned = False
                self.extended += 1
                return "renew"
            self.expected_off = True
            self.end = None
            return "expire"
        if self.cfg.warn_seconds and not self.warned and (self.end - now).total_seconds() <= self.cfg.warn_seconds:
            self.warned = True
            return "warn"
        return None

    # ------------------------------------------------------------------ comandi
    def extend(self, now: datetime, minutes: int) -> bool:
        """Prolunga di `minutes` (parte da adesso se non c'è un timer). Solo a luce accesa."""
        if self.on is not True or minutes <= 0:
            return False
        self.held = False
        base = self.end if self.end is not None and self.end > now else now
        self.end = base + timedelta(minutes=min(minutes, MAX_MINUTES))
        self.warned = False
        self.expected_off = False
        self.extended += 1
        return True

    def hold(self) -> bool:
        """Tieni accesa: niente scadenza finché la luce non viene spenta."""
        if self.on is not True:
            return False
        self.held = True
        self.end = None
        self.warned = False
        return True

    def release(self, now: datetime, master: bool) -> bool:
        """Riprende il timer normale partendo da adesso."""
        if self.on is not True:
            return False
        self.held = False
        self.end = now + timedelta(minutes=self.cfg.minutes) if self.active(master) else None
        self.warned = False
        return True

    def reconfigure(self, cfg: LightConfig, now: datetime, master: bool) -> None:
        """Nuove impostazioni a luce già gestita: la durata nuova vale dal prossimo ciclo, ma disattivare il timer lo ferma subito."""
        was_active = self.active(master)
        self.cfg = cfg
        if self.on is True and not self.held:
            if was_active and not self.active(master):
                self.end = None
            elif not was_active and self.active(master) and self.end is None:
                self.end = now + timedelta(minutes=cfg.minutes)

    def master_changed(self, now: datetime, master: bool) -> None:
        if self.on is True and not self.held:
            if not self.active(master):
                self.end = None
            elif self.end is None:
                self.end = now + timedelta(minutes=self.cfg.minutes)
                self.warned = False

    # ------------------------------------------------------------------ salvataggio
    def to_saved(self) -> dict[str, Any]:
        return {
            "end": self.end.isoformat() if self.end else None,
            "started": self.started.isoformat() if self.started else None,
            "held": self.held, "extended": self.extended,
        }

    def load_saved(self, raw: Any) -> None:
        if isinstance(raw, dict) and (raw.get("end") or raw.get("held")):
            self.saved = raw

    def _restore(self, now: datetime, master: bool) -> None:
        raw = self.saved or {}
        self.saved = None
        self.started = _dt(raw.get("started")) or now
        self.held = raw.get("held") is True
        self.extended = _int(raw.get("extended"), 0)
        self.warned = False
        self.expected_off = False
        end = _dt(raw.get("end"))
        if self.held:
            self.end = None
        elif end is not None:
            self.end = end if self.active(master) else None
        else:
            self.end = now + timedelta(minutes=self.cfg.minutes) if self.active(master) else None


# ---------------------------------------------------------------------- statistiche
def trim_cycles(cycles: list[Cycle], now: datetime) -> list[Cycle]:
    limit = now - timedelta(days=KEEP_DAYS)
    return [c for c in cycles if c.end >= limit][-MAX_CYCLES:]


def analyze(cycles: list[Cycle], minutes: int, now: datetime, days: int = 30) -> dict[str, Any]:
    """Numeri e un suggerimento sulla durata, dagli ultimi `days` giorni."""
    limit = now - timedelta(days=days)
    cs = [c for c in cycles if c.end >= limit]
    runs = len(cs)
    expired = [c for c in cs if c.how == "scaduto"]
    manual = [c for c in cs if c.how == "manuale"]
    reon = sum(1 for c in expired if c.reon)
    durations = [(c.end - c.start).total_seconds() / 60 for c in cs]
    manual_med = median([(c.end - c.start).total_seconds() / 60 for c in manual]) if manual else None
    out: dict[str, Any] = {
        "days": days, "runs": runs, "expired": len(expired), "manual": len(manual), "reon": reon,
        "avg_minutes": round(sum(durations) / runs, 1) if runs else None,
        "manual_median_minutes": round(manual_med, 1) if manual_med is not None else None,
        "advice": None, "suggested_minutes": None,
    }
    if runs < 5:
        out["advice"] = "Pochi dati: servono almeno 5 accensioni per un consiglio."
        return out
    if len(expired) >= 4 and reon / len(expired) >= 0.25:
        out["suggested_minutes"] = min(MAX_MINUTES, max(minutes + 1, int(round(minutes * 1.5))))
        out["advice"] = f"Spesso la riaccendi subito dopo la scadenza: prova {out['suggested_minutes']} minuti."
    elif len(expired) / runs >= 0.7:
        out["advice"] = "Il timer funziona: la luce si spegne da sola quasi sempre."
    elif manual and len(manual) / runs >= 0.8 and manual_med is not None and manual_med < minutes / 2:
        out["advice"] = f"La spegni quasi sempre a mano dopo circa {manual_med:.0f} min: il timer è solo una sicurezza."
    else:
        out["advice"] = "Uso misto: la durata attuale va bene."
    return out
