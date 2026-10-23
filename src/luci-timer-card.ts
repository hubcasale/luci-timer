import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { summaryText, tileModel, type TileModel } from "./card-logic";
import "./settings-dialog";
import "./stats-dialog";
import type { HomeAssistant, LuciInfo } from "./types";

interface CardConfig {
  type: string;
  title?: string;
  entry_id?: string;
}

/** Scheda dei timer luci: una tessera per luce con conto alla rovescia e pulsanti grandi, pensata per il tablet (tocco). */
export class LuciTimerCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config: CardConfig = { type: "custom:luci-timer-card" };
  @state() private _info: LuciInfo | null = null;
  @state() private _error = "";
  @state() private _now = Date.now();
  private _loadedAt = 0;
  private _loading = false;
  private _tick?: number;
  private _syncers = new Set<() => void>();

  setConfig(config: CardConfig): void {
    this._config = { ...config };
    this._info = null;
    this._loadedAt = 0;
  }
  getCardSize(): number {
    return 6;
  }
  static getStubConfig(): CardConfig {
    return { type: "custom:luci-timer-card" };
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._tick = window.setInterval(() => (this._now = Date.now()), 1000);
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._tick) window.clearInterval(this._tick);
  }

  protected willUpdate(): void {
    for (const s of this._syncers) s();
  }
  protected updated(): void {
    if (this.hass && !this._loading && (!this._info || Date.now() - this._loadedAt > 5 * 60000)) void this._loadInfo();
  }

  private async _loadInfo(): Promise<void> {
    this._loading = true;
    try {
      const msg: Record<string, unknown> = { type: "luci_timer/info" };
      if (this._config.entry_id) msg.entry_id = this._config.entry_id;
      this._info = await this.hass.callWS<LuciInfo>(msg);
      this._error = "";
    } catch (err) {
      const m = err instanceof Error ? err.message : (err as { message?: string })?.message ?? String(err);
      this._error = `Timer luci non configurato o integrazione non caricata (${m}).`;
    } finally {
      this._loadedAt = Date.now();
      this._loading = false;
    }
  }

  private async _open(tag: "luci-settings-dialog" | "luci-stats-dialog", openKey = ""): Promise<void> {
    if (!this._info) return;
    while (this._loading) await new Promise((r) => setTimeout(r, 50));
    await this._loadInfo();
    if (!this._info) return;
    const el = document.createElement(tag) as HTMLElement & { hass: HomeAssistant; info: LuciInfo; openKey?: string };
    el.hass = this.hass;
    el.info = this._info;
    if (openKey) el.openKey = openKey;
    el.addEventListener("saved", () => {
      this._loadedAt = 0;
      void this._loadInfo();
    });
    document.body.appendChild(el);
    const sync = () => {
      if (el.isConnected) el.hass = this.hass;
    };
    this._syncers.add(sync);
    el.addEventListener("closed", () => this._syncers.delete(sync));
  }

  private _act(entity: string, action: string, minutes = 5): void {
    void this.hass.callWS({ type: "luci_timer/action", entry_id: this._info?.entry_id, entity, action, minutes });
  }
  private _toggle(entity: string): void {
    void this.hass.callService("homeassistant", "toggle", { entity_id: entity });
  }
  private _toggleMaster(on: boolean): void {
    const eid = this._info?.entities.generale;
    if (eid) void this.hass.callService("switch", on ? "turn_off" : "turn_on", { entity_id: eid });
  }

  private _tile(t: TileModel) {
    return html`
      <div class="tile ${t.tone}">
        <div class="top">
          <button class="power" aria-label=${t.on ? `Spegni ${t.name}` : `Accendi ${t.name}`} aria-pressed=${t.on ? "true" : "false"} @click=${() => this._toggle(t.entity)}>
            <ha-icon icon=${t.on ? "mdi:lightbulb-on" : "mdi:lightbulb-outline"}></ha-icon>
          </button>
          <button class="name" @click=${() => void this._open("luci-settings-dialog", t.entity)} aria-label=${`Impostazioni di ${t.name}`}>
            <span class="n">${t.name}</span>
            <span class="s">${t.subtitle}</span>
          </button>
        </div>
        ${t.progress !== null ? html`<div class="bar"><i style="width:${(t.progress * 100).toFixed(1)}%"></i></div>` : nothing}
        ${t.on
          ? html`<div class="acts">
              ${t.running || t.held
                ? html`<button class="a" @click=${() => this._act(t.entity, "extend", 5)}>+5 min</button>`
                : nothing}
              ${t.held
                ? html`<button class="a" @click=${() => this._act(t.entity, "release")}>Riprendi timer</button>`
                : t.running
                  ? html`<button class="a" @click=${() => this._act(t.entity, "hold")}>Tieni accesa</button>`
                  : nothing}
              <button class="a off" @click=${() => this._act(t.entity, "off_now")}>Spegni</button>
            </div>`
          : nothing}
      </div>`;
  }

  render() {
    if (!this.hass) return nothing;
    const title = this._config.title ?? this._info?.title ?? "Timer luci";
    if (this._error && !this._info)
      return html`<ha-card><div class="pad"><div class="title">${title}</div><div class="errbox">${this._error}</div></div></ha-card>`;
    if (!this._info) return html`<ha-card><div class="pad"><div class="title">${title}</div><div class="muted">Carico…</div></div></ha-card>`;

    const master = this.hass.states[this._info.entities.generale ?? ""]?.state !== "off";
    const tiles = this._info.lights.map((l) => tileModel(l, this.hass.states, this._now));
    // prima le luci accese, quelle con il timer più vicino in cima
    const order = [...tiles].sort((a, b) => Number(b.on) - Number(a.on));
    return html`
      <ha-card>
        <div class="pad">
          <div class="head">
            <div>
              <div class="title">${title}</div>
              <div class="sum">${summaryText(tiles, master)}</div>
            </div>
            <div class="tools">
              <button class=${master ? "mst on" : "mst"} role="switch" aria-checked=${master ? "true" : "false"} @click=${() => this._toggleMaster(master)}>
                <ha-icon icon=${master ? "mdi:timer-check-outline" : "mdi:timer-off-outline"}></ha-icon>${master ? "Timer attivi" : "Timer spenti"}
              </button>
              <button class="ib" aria-label="Statistiche" @click=${() => void this._open("luci-stats-dialog")}><ha-icon icon="mdi:chart-box-outline"></ha-icon></button>
              <button class="ib" aria-label="Preferenze" @click=${() => void this._open("luci-settings-dialog")}><ha-icon icon="mdi:cog"></ha-icon></button>
            </div>
          </div>
          <div class="grid">${order.map((t) => this._tile(t))}</div>
        </div>
      </ha-card>`;
  }

  static styles = css`
    :host { display: block; color: var(--primary-text-color, #212121); }
    ha-card { overflow: hidden; }
    .pad { padding: 14px 16px 16px; }
    .head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
    .title { font-size: 1.15rem; font-weight: 600; }
    .sum { font-size: 0.85rem; color: var(--secondary-text-color, #727272); margin-top: 2px; }
    .muted { color: var(--secondary-text-color, #727272); font-size: 0.85rem; }
    .errbox { margin-top: 8px; padding: 10px; border-radius: 10px; background: rgba(220, 38, 38, 0.1); color: #b91c1c; font-size: 0.9rem; }
    .tools { display: flex; gap: 8px; align-items: center; }
    .mst { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; padding: 0 14px; border-radius: 22px; border: 1px solid var(--divider-color, #ccc); background: var(--secondary-background-color, #f4f4f4); color: inherit; font-size: 0.88rem; cursor: pointer; }
    .mst.on { background: rgba(22, 163, 74, 0.16); border-color: #16a34a; color: #166534; }
    .ib { width: 44px; height: 44px; border-radius: 22px; border: 1px solid var(--divider-color, #ccc); background: var(--secondary-background-color, #f4f4f4); color: inherit; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
    ha-icon { --mdc-icon-size: 22px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 10px; }
    .tile { padding: 10px 12px; border-radius: 14px; background: var(--secondary-background-color, #f2f2f2); border: 1px solid transparent; }
    .tile.running { border-color: rgba(245, 158, 11, 0.7); background: rgba(245, 158, 11, 0.12); }
    .tile.held { border-color: rgba(96, 165, 250, 0.8); background: rgba(96, 165, 250, 0.13); }
    .tile.idle { border-color: rgba(127, 127, 127, 0.4); }
    .tile.bad { opacity: 0.6; }
    .top { display: flex; gap: 10px; align-items: center; }
    .power { flex: none; width: 48px; height: 48px; border-radius: 24px; border: 0; background: rgba(127, 127, 127, 0.2); color: var(--secondary-text-color, #727272); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
    .tile.running .power, .tile.held .power, .tile.idle .power { background: #f59e0b; color: #fff; }
    .name { flex: 1; min-width: 0; text-align: left; background: transparent; border: 0; padding: 4px 0; color: inherit; cursor: pointer; display: flex; flex-direction: column; min-height: 44px; justify-content: center; }
    .n { font-size: 0.98rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .s { font-size: 0.82rem; color: var(--secondary-text-color, #727272); }
    .tile.running .s { color: var(--primary-text-color, #212121); font-weight: 500; font-variant-numeric: tabular-nums; }
    .bar { height: 6px; border-radius: 3px; background: rgba(127, 127, 127, 0.25); margin: 8px 0 2px; overflow: hidden; }
    .bar i { display: block; height: 100%; background: #f59e0b; transition: width 1s linear; }
    .acts { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
    .a { flex: 1; min-width: 70px; min-height: 44px; border-radius: 12px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color, #fff); color: inherit; font-size: 0.85rem; cursor: pointer; }
    .a.off { color: #b91c1c; }
  `;
}

if (!customElements.get("luci-timer-card")) customElements.define("luci-timer-card", LuciTimerCard);

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}
window.customCards = window.customCards || [];
window.customCards.push({
  type: "luci-timer-card",
  name: "Timer luci",
  description: "Luci con timer di spegnimento: conto alla rovescia, +5 minuti, tieni accesa, statistiche e preferenze.",
});

// eslint-disable-next-line no-console
console.info("%c LUCI-TIMER %c v0.2.0 ", "color: white; background: #b45309; font-weight: 700;", "color: #b45309; background: white; font-weight: 700;");
