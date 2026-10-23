export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callService(domain: string, service: string, data?: Record<string, unknown>): Promise<unknown>;
  callWS<T = unknown>(msg: Record<string, unknown>): Promise<T>;
  [key: string]: unknown;
}

export type Status = "non_disponibile" | "spenta" | "in_corso" | "tenuta" | "timer_disattivato";

export interface LightCfg {
  entity: string;
  name: string;
  minutes: number;
  enabled: boolean;
  motion: string;
  warn_seconds: number;
}

export interface LightInfo extends LightCfg {
  key: string;
  status: Status;
  end: string | null;
  remaining: number | null;
  entities: { stato?: string; scadenza?: string; durata?: string; attivo?: string };
}

export interface LuciInfo {
  entry_id: string;
  title: string;
  enabled: boolean;
  lights: LightInfo[];
  entities: { generale?: string | null; in_corso?: string | null };
}

export interface LightStats {
  days: number;
  runs: number;
  expired: number;
  manual: number;
  reon: number;
  avg_minutes: number | null;
  manual_median_minutes: number | null;
  advice: string | null;
  suggested_minutes: number | null;
}
