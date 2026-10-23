// Logica pura della scheda dei timer luci: conto alla rovescia, tessere, riepilogo, controlli delle preferenze.
// Nessuna dipendenza da Lit o da Home Assistant: si prova con node:test.
import type { HassEntity, LightCfg, LightInfo, LightStats, Status } from "./types";

export const DURATION_CHIPS = [1, 3, 5, 10, 15, 30, 60, 120];
export const WARN_CHOICES = [0, 10, 20, 30, 60];
export const DOMAINS = ["light", "switch", "fan", "input_boolean"];
export const STATUSES: Status[] = ["non_disponibile", "spenta", "in_corso", "tenuta", "timer_disattivato"];

export type Tone = "off" | "running" | "held" | "idle" | "bad";

export function asStatus(v: unknown): Status {
  return (STATUSES as string[]).includes(String(v)) ? (v as Status) : "non_disponibile";
}

/** "03:12" sotto l'ora, "1:02:10" oltre. */
export function countdown(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function fmtMinutes(m: number): string {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r === 0 ? `${h} h` : `${h} h ${r} min`;
}

export function parseTime(v: unknown): number | null {
  if (typeof v !== "string" || v === "unknown" || v === "unavailable" || v === "") return null;
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : t;
}

export interface TileModel {
  key: string;
  entity: string;
  name: string;
  on: boolean;
  tone: Tone;
  subtitle: string;
  progress: number | null;      // 0..1, quota di tempo rimasto
  running: boolean;
  held: boolean;
  timerOn: boolean;
  minutes: number;
}

/** Stato mostrato per una luce, dalle entità vive (se mancano si usa quanto ha detto il server). */
export function tileModel(light: LightInfo, states: Record<string, HassEntity>, now: number): TileModel {
  const ent = light.entities;
  const lightState = states[light.entity]?.state;
  const statoEntity = ent.stato ? states[ent.stato] : undefined;
  const status = asStatus(statoEntity?.state ?? light.status);
  const minutes = Number(ent.durata ? states[ent.durata]?.state : NaN);
  const duration = Number.isFinite(minutes) && minutes > 0 ? Math.round(minutes) : light.minutes;
  const endMs = parseTime(ent.scadenza ? states[ent.scadenza]?.state : light.end);
  const timerOn = (ent.attivo ? states[ent.attivo]?.state : light.enabled ? "on" : "off") === "on";
  const on = lightState === "on";
  let tone: Tone = "off";
  let subtitle = `Spenta · timer ${fmtMinutes(duration)}${timerOn ? "" : " (disattivato)"}`;
  let progress: number | null = null;
  if (lightState === "unavailable" || lightState === undefined || status === "non_disponibile") {
    tone = "bad";
    subtitle = "Non disponibile";
  } else if (on) {
    if (status === "in_corso" && endMs !== null) {
      const left = Math.max(0, endMs - now);
      tone = "running";
      subtitle = left > 0 ? `Spegne tra ${countdown(left)}` : "Sta per spegnersi";
      progress = Math.min(1, left / (duration * 60000));
    } else if (status === "tenuta") {
      tone = "held";
      subtitle = "Tenuta accesa";
    } else {
      tone = "idle";
      subtitle = "Accesa · timer disattivato";
    }
  }
  return {
    key: light.key, entity: light.entity, name: light.name, on, tone, subtitle, progress,
    running: status === "in_corso", held: status === "tenuta", timerOn, minutes: duration,
  };
}

export function summaryText(tiles: TileModel[], master: boolean): string {
  if (tiles.length === 0) return "Nessuna luce: aggiungine una con l'ingranaggio.";
  const on = tiles.filter((t) => t.on).length;
  const running = tiles.filter((t) => t.running).length;
  const held = tiles.filter((t) => t.held).length;
  const parts: string[] = [on === 0 ? "Tutte spente" : `${on} ${on === 1 ? "accesa" : "accese"}`];
  if (running) parts.push(`${running} ${running === 1 ? "timer in corso" : "timer in corso"}`);
  if (held) parts.push(`${held} ${held === 1 ? "tenuta accesa" : "tenute accese"}`);
  if (!master) parts.push("timer disattivati");
  return parts.join(" · ");
}

// ---- preferenze
export function entityDomain(id: string): string {
  return id.split(".", 1)[0];
}

export function validLightEntity(id: string): boolean {
  return /^[a-z_]+\.[a-z0-9_]+$/.test(id) && DOMAINS.includes(entityDomain(id));
}

export function lightError(l: LightCfg, all: LightCfg[]): string | null {
  if (!validLightEntity(l.entity)) return "Scegli una luce, presa o ventola valida.";
  if (all.filter((x) => x.entity === l.entity).length > 1) return "Questa luce è già nell'elenco.";
  if (!Number.isInteger(l.minutes) || l.minutes < 1 || l.minutes > 720) return "La durata deve essere tra 1 minuto e 12 ore.";
  if (l.motion && !/^(binary_sensor|input_boolean)\.[a-z0-9_]+$/.test(l.motion)) return "Il sensore di movimento non è valido.";
  return null;
}

export function lightsError(lights: LightCfg[]): string | null {
  for (const l of lights) {
    const e = lightError(l, lights);
    if (e) return `${l.name || l.entity}: ${e}`;
  }
  return null;
}

export function newLight(entity: string, friendly?: string): LightCfg {
  const name = friendly?.trim() || entity.split(".")[1].replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
  return { entity, name, minutes: 5, enabled: true, motion: "", warn_seconds: 0 };
}

/** Entità che si possono ancora aggiungere (luci, prese, ventole), in ordine di nome. */
export function addableEntities(states: Record<string, HassEntity>, taken: string[]): { id: string; name: string }[] {
  return Object.values(states)
    .filter((s) => DOMAINS.includes(entityDomain(s.entity_id)) && !taken.includes(s.entity_id))
    .map((s) => ({ id: s.entity_id, name: String(s.attributes.friendly_name ?? s.entity_id) }))
    .sort((a, b) => a.name.localeCompare(b.name, "it"));
}

export function motionEntities(states: Record<string, HassEntity>): { id: string; name: string }[] {
  return Object.values(states)
    .filter((s) => entityDomain(s.entity_id) === "binary_sensor" && ["motion", "occupancy", "presence"].includes(String(s.attributes.device_class)))
    .map((s) => ({ id: s.entity_id, name: String(s.attributes.friendly_name ?? s.entity_id) }))
    .sort((a, b) => a.name.localeCompare(b.name, "it"));
}

// ---- statistiche
export function statsLine(s: LightStats): string {
  if (s.runs === 0) return "Nessuna accensione negli ultimi giorni.";
  const parts = [`${s.runs} ${s.runs === 1 ? "accensione" : "accensioni"}`, `${s.expired} spente dal timer`, `${s.manual} a mano`];
  if (s.avg_minutes !== null) parts.push(`durata media ${String(s.avg_minutes).replace(".", ",")} min`);
  return parts.join(" · ");
}

export function clampMinutes(v: number): number {
  return Math.min(720, Math.max(1, Math.round(v)));
}
