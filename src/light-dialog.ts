import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { dialogStyles } from "./dialog-style";
import { START_CHOICES, countdown, fmtMinutes, friendlyName, tileModel } from "./card-logic";
import type { HomeAssistant, LuciInfo } from "./types";

/** Popup di una luce: conto alla rovescia grande e tutti i comandi del timer, con i tasti grandi del tablet. */
export class LuciLightDialog extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) info!: LuciInfo;
  @property() openKey = "";
  @state() private _now = Date.now();
  private _tick?: number;
  private _onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") this._close();
  };

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this._onKey);
    this._tick = window.setInterval(() => (this._now = Date.now()), 1000);
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._onKey);
    if (this._tick) window.clearInterval(this._tick);
  }
  private _close(): void {
    this.dispatchEvent(new CustomEvent("closed"));
    this.remove();
  }
  private _act(action: string, minutes?: number): void {
    const msg: Record<string, unknown> = { type: "luci_timer/action", entry_id: this.info.entry_id, entity: this.openKey, action };
    if (minutes) msg.minutes = minutes;
    void this.hass.callWS(msg);
  }
  private _openSettings(): void {
    this.dispatchEvent(new CustomEvent("settings", { detail: this.openKey }));
    this._close();
  }

  render() {
    const light = this.info?.lights.find((l) => l.entity === this.openKey);
    if (!light) return nothing;
    const t = tileModel(light, this.hass.states, this._now);
    const endMs = t.running && light.entities.scadenza ? Date.parse(this.hass.states[light.entities.scadenza]?.state ?? "") : NaN;
    const left = Number.isFinite(endMs) ? Math.max(0, endMs - this._now) : null;
    const attivo = light.entities.attivo ? this.hass.states[light.entities.attivo]?.state === "on" : light.enabled;
    return html`
      <div class="backdrop" @click=${(e: Event) => e.target === e.currentTarget && this._close()}>
        <div class="panel" role="dialog" aria-modal="true" aria-label=${`Timer ${t.name}`}>
          <div class="head"><div class="title">${t.name}</div><button class="x" aria-label="Chiudi" @click=${() => this._close()}>✕</button></div>
          <div class="body">
            <div class="big ${t.tone}">
              ${t.running && left !== null
                ? html`<div class="num">${countdown(left)}</div><div class="cap">alla chiusura · timer da ${fmtMinutes(t.minutes)}</div>`
                : t.held
                  ? html`<div class="txt">Tenuta accesa</div><div class="cap">Non si spegne da sola finché non la spegni</div>`
                  : t.on
                    ? html`<div class="txt">Accesa</div><div class="cap">Timer disattivato</div>`
                    : html`<div class="txt">Spenta</div><div class="cap">Timer da ${fmtMinutes(t.minutes)} quando la accendi</div>`}
              ${t.progress !== null ? html`<div class="bar"><i style="width:${(t.progress * 100).toFixed(1)}%"></i></div>` : nothing}
            </div>

            ${t.on
              ? html`<div class="grid">
                  <button class="b" @click=${() => this._act("extend", 5)}>+5 min</button>
                  <button class="b" @click=${() => this._act("extend", 15)}>+15 min</button>
                  ${t.held
                    ? html`<button class="b" @click=${() => this._act("release")}>Riprendi timer</button>`
                    : html`<button class="b" @click=${() => this._act("hold")}>Tieni accesa</button>`}
                  <button class="b off" @click=${() => { this._act("off_now"); }}>Spegni ora</button>
                </div>
                <div class="sec">Spegni tra…</div>
                <div class="chips">${START_CHOICES.map((m) => html`<button class="chip" @click=${() => this._act("start", m)}>${fmtMinutes(m)}</button>`)}</div>`
              : html`<div class="grid one"><button class="b primary" @click=${() => this._act("on")}>Accendi con il timer</button></div>`}

            <div class="row">
              <div><div class="lab">Timer attivo</div><div class="hint">Collegato a ${friendlyName(this.hass.states, light.entity)} (${light.entity})</div></div>
              <button class=${attivo ? "sw on" : "sw"} role="switch" aria-checked=${attivo ? "true" : "false"} aria-label="Timer attivo"
                @click=${() => light.entities.attivo && void this.hass.callService("switch", attivo ? "turn_off" : "turn_on", { entity_id: light.entities.attivo })}><span class="knob"></span></button>
            </div>
            <button class="link" @click=${() => this._openSettings()}>Durata, sensori e avviso…</button>
          </div>
        </div>
      </div>`;
  }

  static styles = [
    dialogStyles,
    css`
      .panel { max-width: 460px; }
      .big { text-align: center; padding: 14px 10px 10px; border-radius: 16px; background: var(--secondary-background-color, #f2f2f2); }
      .big.running { background: rgba(245, 158, 11, 0.14); }
      .big.held { background: rgba(96, 165, 250, 0.15); }
      .num { font-size: 3.2rem; font-weight: 700; font-variant-numeric: tabular-nums; line-height: 1.1; }
      .txt { font-size: 1.6rem; font-weight: 600; }
      .cap { font-size: 0.85rem; color: var(--secondary-text-color, #727272); margin-top: 4px; }
      .bar { height: 8px; border-radius: 4px; background: rgba(127, 127, 127, 0.25); margin: 12px 4px 4px; overflow: hidden; }
      .bar i { display: block; height: 100%; background: #f59e0b; transition: width 1s linear; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; }
      .grid.one { grid-template-columns: 1fr; }
      .b { min-height: 56px; border-radius: 14px; border: 1px solid var(--divider-color, #ccc); background: var(--secondary-background-color, #f4f4f4); color: var(--primary-text-color, #212121); font-size: 1rem; cursor: pointer; }
      .b.off { color: #b91c1c; }
      .b.primary { background: var(--primary-color, #03a9f4); color: #fff; border-color: transparent; }
      .sec { font-weight: 600; font-size: 0.8rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--secondary-text-color, #727272); margin: 16px 0 8px; }
      .chips { display: flex; flex-wrap: wrap; gap: 8px; }
      .chip { min-height: 48px; padding: 0 16px; border-radius: 24px; border: 1px solid var(--divider-color, #ccc); background: transparent; color: var(--primary-text-color, #212121); font-size: 0.95rem; cursor: pointer; }
      .row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--divider-color, #eee); }
      .lab { font-size: 0.95rem; } .hint { font-size: 0.75rem; color: var(--secondary-text-color, #727272); margin-top: 2px; }
      .sw { flex: none; width: 56px; height: 32px; border-radius: 16px; border: 0; background: var(--disabled-color, #bdbdbd); position: relative; cursor: pointer; transition: background 0.2s; }
      .sw.on { background: var(--primary-color, #03a9f4); }
      .sw .knob { position: absolute; top: 4px; left: 4px; width: 24px; height: 24px; border-radius: 50%; background: #fff; transition: transform 0.2s; }
      .sw.on .knob { transform: translateX(24px); }
      .link { margin-top: 12px; min-height: 48px; width: 100%; border: 0; background: transparent; color: var(--primary-color, #03a9f4); font-size: 0.95rem; cursor: pointer; }
    `,
  ];
}

if (!customElements.get("luci-light-dialog")) customElements.define("luci-light-dialog", LuciLightDialog);
