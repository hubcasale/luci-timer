import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { dialogStyles } from "./dialog-style";
import { DURATION_CHIPS, WARN_CHOICES, addableEntities, clampMinutes, entityDomain, fmtMinutes, lightsError, motionEntities, newLight } from "./card-logic";
import type { HomeAssistant, LightCfg, LuciInfo } from "./types";

/** Preferenze: interruttore generale, elenco delle luci con durata, movimento e avviso; si aggiungono e si tolgono luci. */
export class LuciSettingsDialog extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) info!: LuciInfo;
  @property() openKey = "";
  @state() private _lights: LightCfg[] = [];
  @state() private _master = true;
  @state() private _open = "";
  @state() private _add = "";
  @state() private _busy = false;
  @state() private _error = "";
  private _onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") this._close();
  };

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this._onKey);
    this._lights = this.info.lights.map((l) => ({ entity: l.entity, name: l.name, minutes: l.minutes, enabled: l.enabled, motion: l.motion, warn_seconds: l.warn_seconds }));
    this._master = this.info.enabled;
    this._open = this.openKey;
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._onKey);
  }
  private _close(): void {
    this.dispatchEvent(new CustomEvent("closed"));
    this.remove();
  }

  private _patch(entity: string, p: Partial<LightCfg>): void {
    this._lights = this._lights.map((l) => (l.entity === entity ? { ...l, ...p } : l));
  }
  private _remove(entity: string): void {
    this._lights = this._lights.filter((l) => l.entity !== entity);
    if (this._open === entity) this._open = "";
  }
  private _addLight(): void {
    const id = this._add.trim();
    if (!id) return;
    if (this._lights.some((l) => l.entity === id)) {
      this._error = "Questa luce è già nell'elenco.";
      return;
    }
    if (!this.hass.states[id] && !/^[a-z_]+\.[a-z0-9_]+$/.test(id)) {
      this._error = "Scegli un'entità dall'elenco.";
      return;
    }
    const friendly = this.hass.states[id]?.attributes.friendly_name;
    this._lights = [...this._lights, newLight(id, typeof friendly === "string" ? friendly : undefined)];
    this._open = id;
    this._add = "";
    this._error = "";
  }

  private async _save(): Promise<void> {
    const err = lightsError(this._lights);
    if (err) {
      this._error = err;
      return;
    }
    this._busy = true;
    this._error = "";
    try {
      await this.hass.callWS({ type: "luci_timer/update", entry_id: this.info.entry_id, enabled: this._master, lights: this._lights });
      this.dispatchEvent(new CustomEvent("saved"));
      this._close();
    } catch (e) {
      const m = e instanceof Error ? e.message : (e as { message?: string })?.message ?? String(e);
      this._error = `Impossibile salvare: ${m}`;
    } finally {
      this._busy = false;
    }
  }

  private _editor(l: LightCfg) {
    const motions = motionEntities(this.hass.states);
    const isLight = entityDomain(l.entity) === "light";
    return html`
      <div class="ed">
        <label class="f">Nome<input class="txt" .value=${l.name} @change=${(e: Event) => this._patch(l.entity, { name: (e.target as HTMLInputElement).value.trim() || l.name })} /></label>
        <div class="f">Durata del timer
          <div class="chips">
            ${DURATION_CHIPS.map((m) => html`<button class=${l.minutes === m ? "chip on" : "chip"} @click=${() => this._patch(l.entity, { minutes: m })}>${fmtMinutes(m)}</button>`)}
          </div>
          <div class="step">
            <button class="st" aria-label="Meno" @click=${() => this._patch(l.entity, { minutes: clampMinutes(l.minutes - 1) })}>−</button>
            <input class="num" inputmode="numeric" .value=${String(l.minutes)} @change=${(e: Event) => {
              const n = Number((e.target as HTMLInputElement).value.replace(",", "."));
              this._patch(l.entity, { minutes: Number.isFinite(n) ? clampMinutes(n) : l.minutes });
            }} />
            <span class="u">min</span>
            <button class="st" aria-label="Più" @click=${() => this._patch(l.entity, { minutes: clampMinutes(l.minutes + 1) })}>+</button>
          </div>
        </div>
        <div class="row"><div class="t"><div class="lab">Timer attivo</div><div class="hint">Se è spento la luce resta accesa finché non la spegni.</div></div>
          <button class=${l.enabled ? "sw on" : "sw"} role="switch" aria-checked=${l.enabled ? "true" : "false"} aria-label="Timer attivo" @click=${() => this._patch(l.entity, { enabled: !l.enabled })}><span class="knob"></span></button></div>
        <label class="f">Sensore di movimento (facoltativo)
          <select class="txt" @change=${(e: Event) => this._patch(l.entity, { motion: (e.target as HTMLSelectElement).value })}>
            <option value="" ?selected=${!l.motion}>Nessuno</option>
            ${motions.map((m) => html`<option value=${m.id} ?selected=${l.motion === m.id}>${m.name}</option>`)}
            ${l.motion && !motions.some((m) => m.id === l.motion) ? html`<option value=${l.motion} selected>${l.motion}</option>` : nothing}
          </select>
          <span class="hint">Alla scadenza, se c'è ancora movimento, il timer riparte invece di spegnere.</span>
        </label>
        ${isLight
          ? html`<div class="f">Avviso prima dello spegnimento
              <div class="chips">${WARN_CHOICES.map((w) => html`<button class=${l.warn_seconds === w ? "chip on" : "chip"} @click=${() => this._patch(l.entity, { warn_seconds: w })}>${w === 0 ? "Nessuno" : `${w} s prima`}</button>`)}</div>
              <span class="hint">La luce si abbassa un istante per avvisare che sta per spegnersi.</span></div>`
          : nothing}
        <button class="btn del" @click=${() => this._remove(l.entity)}>Togli dall'elenco</button>
      </div>`;
  }

  render() {
    if (!this.info) return nothing;
    const err = lightsError(this._lights);
    const addable = addableEntities(this.hass.states, this._lights.map((l) => l.entity));
    return html`
      <div class="backdrop" @click=${(e: Event) => e.target === e.currentTarget && this._close()}>
        <div class="panel" role="dialog" aria-modal="true" aria-label="Preferenze timer luci">
          <div class="head"><div class="title">Preferenze dei timer</div><button class="x" aria-label="Chiudi" @click=${() => this._close()}>✕</button></div>
          <div class="body">
            <div class="row"><div class="t"><div class="lab">Timer attivi</div><div class="hint">Interruttore generale: spento, nessuna luce si spegne da sola.</div></div>
              <button class=${this._master ? "sw on" : "sw"} role="switch" aria-checked=${this._master ? "true" : "false"} aria-label="Timer attivi" @click=${() => (this._master = !this._master)}><span class="knob"></span></button></div>

            <div class="sec">Luci con timer</div>
            ${this._lights.length === 0 ? html`<div class="empty">Nessuna luce: aggiungine una qui sotto.</div>` : nothing}
            ${this._lights.map(
              (l) => html`
                <div class="item">
                  <button class="head2" aria-expanded=${this._open === l.entity ? "true" : "false"} @click=${() => (this._open = this._open === l.entity ? "" : l.entity)}>
                    <span class="nm">${l.name}</span>
                    <span class="meta">${l.enabled ? fmtMinutes(l.minutes) : "timer spento"}${l.motion ? " · movimento" : ""}</span>
                    <span class="chev">${this._open === l.entity ? "▾" : "▸"}</span>
                  </button>
                  ${this._open === l.entity ? this._editor(l) : nothing}
                </div>`,
            )}

            <div class="sec">Aggiungi una luce</div>
            <div class="addrow">
              <input class="txt" list="dl-add" placeholder="light.nome, switch.nome…" .value=${this._add} @input=${(e: Event) => (this._add = (e.target as HTMLInputElement).value)} />
              <datalist id="dl-add">${addable.map((a) => html`<option value=${a.id}>${a.name}</option>`)}</datalist>
              <button class="btn primary" ?disabled=${!this._add.trim()} @click=${() => this._addLight()}>Aggiungi</button>
            </div>

            ${err ? html`<div class="err">${err}</div>` : nothing}
            ${this._error ? html`<div class="err">${this._error}</div>` : nothing}
          </div>
          <div class="foot">
            <button class="btn" @click=${() => this._close()}>Annulla</button>
            <button class="btn primary" ?disabled=${this._busy || !!err} @click=${() => void this._save()}>Salva</button>
          </div>
        </div>
      </div>`;
  }

  static styles = [
    dialogStyles,
    css`
      .sec { font-weight: 600; font-size: 0.8rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--secondary-text-color, #727272); margin: 16px 0 6px; }
      .row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 0; }
      .t { flex: 1; min-width: 0; } .lab { font-size: 0.95rem; }
      .hint { font-size: 0.78rem; color: var(--secondary-text-color, #727272); margin-top: 2px; line-height: 1.3; }
      .sw { flex: none; width: 52px; height: 30px; border-radius: 15px; border: 0; background: var(--disabled-color, #bdbdbd); position: relative; cursor: pointer; transition: background 0.2s; }
      .sw.on { background: var(--primary-color, #03a9f4); }
      .sw .knob { position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; border-radius: 50%; background: #fff; transition: transform 0.2s; }
      .sw.on .knob { transform: translateX(22px); }
      .item { border: 1px solid var(--divider-color, #ddd); border-radius: 12px; margin-bottom: 8px; overflow: hidden; }
      .head2 { width: 100%; display: flex; align-items: center; gap: 10px; padding: 12px 14px; min-height: 48px; background: transparent; border: 0; color: inherit; cursor: pointer; text-align: left; font-size: 0.95rem; }
      .nm { flex: 1; font-weight: 500; } .meta { color: var(--secondary-text-color, #727272); font-size: 0.85rem; } .chev { color: var(--secondary-text-color, #727272); }
      .ed { padding: 4px 14px 14px; border-top: 1px solid var(--divider-color, #eee); }
      .f { display: flex; flex-direction: column; gap: 6px; margin-top: 12px; font-size: 0.85rem; color: var(--secondary-text-color, #727272); }
      .txt { box-sizing: border-box; width: 100%; padding: 11px 12px; border-radius: 10px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color, #fff); color: var(--primary-text-color, #212121); font-size: 0.95rem; min-height: 44px; }
      .chips { display: flex; gap: 8px; flex-wrap: wrap; }
      .chip { min-height: 44px; padding: 0 14px; border-radius: 22px; border: 1px solid var(--divider-color, #ccc); background: transparent; color: var(--primary-text-color, #212121); font-size: 0.9rem; cursor: pointer; }
      .chip.on { background: var(--primary-color, #03a9f4); color: #fff; border-color: transparent; }
      .step { display: flex; align-items: center; gap: 8px; }
      .st { width: 48px; height: 48px; border-radius: 12px; border: 1px solid var(--divider-color, #ccc); background: var(--secondary-background-color, #f4f4f4); color: var(--primary-text-color, #212121); font-size: 1.3rem; cursor: pointer; }
      .num { width: 76px; text-align: center; padding: 11px 6px; border-radius: 10px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color, #fff); color: var(--primary-text-color, #212121); font-size: 1rem; }
      .u { color: var(--secondary-text-color, #727272); }
      .del { margin-top: 14px; color: #b91c1c; }
      .addrow { display: flex; gap: 8px; } .addrow .txt { flex: 1; }
    `,
  ];
}

if (!customElements.get("luci-settings-dialog")) customElements.define("luci-settings-dialog", LuciSettingsDialog);
