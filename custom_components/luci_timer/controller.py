"""Il "cervello" dei timer luci: segue le luci, fa partire e scadere i timer, tiene statistiche e riavvii."""
from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import async_track_state_change_event, async_track_time_interval
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import CONF_ENABLED, CONF_LIGHTS, DOMAIN, FLASH_PAUSE, SAVE_EVERY, SIGNAL_UPDATE, STORAGE_VERSION, SUPPRESS_SECONDS, TICK_SECONDS
from .engine import Cycle, LightConfig, LightTimer, analyze, parse_lights, trim_cycles

_LOGGER = logging.getLogger(__name__)


def signature(lights: list[LightConfig]) -> tuple:
    """Ciò che richiede di ricreare le entità: quali luci, con quale nome e sensore di movimento."""
    return tuple((l.entity, l.name, l.motions) for l in lights)


class LuciController:
    """Una voce di configurazione = tutte le luci con timer."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self.hass = hass
        self.entry = entry
        self.master = entry.options.get(CONF_ENABLED, True) is not False
        self.timers: dict[str, LightTimer] = {}
        self.cycles: dict[str, list[Cycle]] = {}
        self._suppress: dict[str, datetime] = {}
        self._store: Store = Store(hass, STORAGE_VERSION, f"{DOMAIN}.{entry.entry_id}")
        self._unsubs: list = []
        self._last_save = dt_util.utcnow()
        self.signature = signature(parse_lights(entry.options.get(CONF_LIGHTS)))

    @property
    def signal(self) -> str:
        return SIGNAL_UPDATE.format(self.entry.entry_id)

    def configs(self) -> list[LightConfig]:
        return parse_lights(self.entry.options.get(CONF_LIGHTS))

    # ------------------------------------------------------------------ ciclo di vita
    async def async_start(self) -> None:
        saved = await self._store.async_load() or {}
        now = dt_util.now()
        for cfg in self.configs():
            timer = LightTimer(cfg)
            timer.load_saved((saved.get("timers") or {}).get(cfg.key))
            self.timers[cfg.key] = timer
            self.cycles[cfg.key] = [c for c in (Cycle.from_dict(x) for x in (saved.get("cycles") or {}).get(cfg.key, [])) if c]
        entities = [t.cfg.entity for t in self.timers.values()]
        if entities:
            self._unsubs.append(async_track_state_change_event(self.hass, entities, self._on_light))
        self._unsubs.append(async_track_time_interval(self.hass, self._on_tick, timedelta(seconds=TICK_SECONDS)))
        for t in self.timers.values():
            st = self.hass.states.get(t.cfg.entity)
            t.light_changed(now, _is_on(st.state if st else None), self.master)

    async def async_stop(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        await self._async_save()

    async def _async_save(self) -> None:
        await self._store.async_save(
            {
                "timers": {k: t.to_saved() for k, t in self.timers.items()},
                "cycles": {k: [c.to_dict() for c in cs] for k, cs in self.cycles.items()},
            }
        )
        self._last_save = dt_util.utcnow()

    def _save_soon(self) -> None:
        self.hass.async_create_task(self._async_save())

    def _update(self) -> None:
        async_dispatcher_send(self.hass, self.signal)

    # ------------------------------------------------------------------ eventi
    @callback
    def _on_light(self, event: Event[EventStateChangedData]) -> None:
        key = event.data["entity_id"].replace(".", "_")
        timer = self.timers.get(key)
        if timer is None:
            return
        now = dt_util.now()
        until = self._suppress.get(key)
        if until is not None:
            if now < until:
                return                              # lampeggio di avviso: gli stati intermedi non contano
            del self._suppress[key]
        new = event.data["new_state"]
        is_on = _is_on(new.state if new else None)
        if is_on and timer.on is not True and timer.reon_check(now) and self.cycles.get(key):
            self.cycles[key][-1].reon = True
        cycle = timer.light_changed(now, is_on, self.master)
        if cycle is not None:
            self.cycles.setdefault(key, []).append(cycle)
            self.cycles[key] = trim_cycles(self.cycles[key], now)
        self._save_soon()
        self._update()

    @callback
    def _on_tick(self, _now: datetime) -> None:
        now = dt_util.now()
        changed = False
        for key, timer in self.timers.items():
            motion = any((m := self.hass.states.get(sid)) is not None and m.state == "on" for sid in timer.cfg.motions)
            effect = timer.tick(now, motion, self.master)
            if effect == "expire":
                self._call("homeassistant", "turn_off", {"entity_id": timer.cfg.entity})
            elif effect == "warn":
                self.hass.async_create_task(self._flash(key))
            if effect:
                changed = True
        if changed:
            self._save_soon()
            self._update()
        elif (dt_util.utcnow() - self._last_save).total_seconds() > SAVE_EVERY:
            self._save_soon()

    # ------------------------------------------------------------------ azioni sulla luce
    def _call(self, domain: str, service: str, data: dict[str, Any]) -> None:
        async def _run() -> None:
            try:
                await self.hass.services.async_call(domain, service, data, blocking=True)
            except HomeAssistantError as err:
                _LOGGER.warning("Servizio %s.%s non riuscito: %s", domain, service, err)

        self.hass.async_create_task(_run())

    async def _flash(self, key: str) -> None:
        """Avviso prima dello spegnimento: abbassa un attimo la luce (o la spegne e riaccende se non regola la luminosità)."""
        timer = self.timers[key]
        entity = timer.cfg.entity
        st = self.hass.states.get(entity)
        if st is None or st.state != "on" or timer.cfg.domain != "light":
            return
        self._suppress[key] = dt_util.now() + timedelta(seconds=SUPPRESS_SECONDS)
        brightness = st.attributes.get("brightness")
        try:
            if isinstance(brightness, (int, float)):
                await self.hass.services.async_call("light", "turn_on", {"entity_id": entity, "brightness": max(1, int(brightness * 0.25))}, blocking=True)
                await asyncio.sleep(FLASH_PAUSE)
                await self.hass.services.async_call("light", "turn_on", {"entity_id": entity, "brightness": int(brightness)}, blocking=True)
            else:
                await self.hass.services.async_call("homeassistant", "turn_off", {"entity_id": entity}, blocking=True)
                await asyncio.sleep(FLASH_PAUSE)
                await self.hass.services.async_call("homeassistant", "turn_on", {"entity_id": entity}, blocking=True)
        except HomeAssistantError as err:
            _LOGGER.warning("Avviso con lampeggio non riuscito su %s: %s", entity, err)
            self._suppress.pop(key, None)

    @callback
    def action(self, entity: str, action: str, minutes: int | None = 5) -> bool:
        """Comandi dalla scheda e dai servizi: extend, hold, release, start, off_now, on."""
        timer = self.timers.get(entity.replace(".", "_"))
        if timer is None:
            return False
        now = dt_util.now()
        ok = False
        if action == "extend":
            ok = timer.extend(now, minutes or 5)
        elif action == "start":
            wanted = minutes or timer.cfg.minutes
            if timer.start_for(now, wanted):
                ok = True
            else:
                self._call("homeassistant", "turn_on", {"entity_id": entity})
                ok = True
        elif action in ("hold", "cancel"):
            ok = timer.hold()
        elif action == "release":
            ok = timer.release(now, self.master)
        elif action == "off_now":
            self._call("homeassistant", "turn_off", {"entity_id": entity})
            ok = True
        elif action == "on":
            self._call("homeassistant", "turn_on", {"entity_id": entity})
            ok = True
        if ok:
            self._save_soon()
            self._update()
        return ok

    # ------------------------------------------------------------------ impostazioni
    @callback
    def apply_options(self) -> None:
        """Impostazioni cambiate senza cambiare l'elenco delle luci: si applicano subito."""
        now = dt_util.now()
        master = self.entry.options.get(CONF_ENABLED, True) is not False
        by_key = {c.key: c for c in self.configs()}
        master_changed = master != self.master
        self.master = master
        for key, timer in self.timers.items():
            cfg = by_key.get(key)
            if cfg is not None:
                timer.reconfigure(cfg, now, master)
            if master_changed:
                timer.master_changed(now, master)
        self._save_soon()
        self._update()

    @callback
    def set_light(self, key: str, **changes: Any) -> None:
        """Cambia durata o abilitazione di una luce: si scrive nelle opzioni della voce e il resto segue."""
        lights = []
        for cfg in self.configs():
            d = cfg.to_dict()
            if cfg.key == key:
                d.update(changes)
            lights.append(d)
        self.hass.config_entries.async_update_entry(self.entry, options={**self.entry.options, CONF_LIGHTS: lights})

    @callback
    def set_master(self, enabled: bool) -> None:
        self.hass.config_entries.async_update_entry(self.entry, options={**self.entry.options, CONF_ENABLED: enabled})

    # ------------------------------------------------------------------ dati per le entità e per la scheda
    def stats(self) -> dict[str, Any]:
        now = dt_util.now()
        return {k: analyze(self.cycles.get(k, []), t.cfg.minutes, now) for k, t in self.timers.items()}

    def running_count(self) -> int:
        return sum(1 for t in self.timers.values() if t.status(self.master) == "in_corso")

    def info(self) -> dict[str, Any]:
        now = dt_util.now()
        return {
            "entry_id": self.entry.entry_id,
            "title": self.entry.title,
            "enabled": self.master,
            "lights": [
                {
                    **t.cfg.to_dict(),
                    "key": k,
                    "status": t.status(self.master),
                    "end": t.end.isoformat() if t.end else None,
                    "remaining": t.remaining(now),
                }
                for k, t in self.timers.items()
            ],
        }


def _is_on(state: str | None) -> bool | None:
    if state == "on":
        return True
    if state == "off":
        return False
    return None
