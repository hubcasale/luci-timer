import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { applyCardForm, cardFormValues, type CardFormConfig } from "./card-logic";
import type { HomeAssistant, LuciInfo } from "./types";

interface FormSchema {
  name: string;
  selector: Record<string, unknown>;
}

const LABELS: Record<string, string> = {
  title: "Titolo",
  only_on: "All'inizio mostra solo le luci accese",
  header: "Mostra titolo e pulsanti",
  display: "Senza titolo: come si presenta la luce",
  color: "Colore della scheda",
  lights: "Luci da mostrare (nessuna = tutte)",
};
const HELP: Record<string, string> = {
  only_on: "Con il pulsante in alto si passa comunque a tutte le luci.",
  header: "Disattivalo per inserire una luce dentro un'altra scheda, senza intestazione.",
  display: "Vale solo senza titolo: il pulsante compare a luce accesa e apre un popup; la tessera resta sempre visibile.",
  color: "Tinge lo sfondo e il bordo della scheda, come un blocco colorato della plancia; le tessere delle luci restano come sono. Nessuno lascia l'aspetto del tema.",
  lights: "Per mostrare solo alcune luci in questa scheda. Durate, sensori e avvisi si regolano dall'ingranaggio della scheda.",
};

/** Editor della scheda (quello di Home Assistant: «Modifica scheda»): solo le opzioni di visualizzazione di questa scheda.
 *  Le preferenze dei timer (durate, sensori, avvisi) restano nell'ingranaggio e sono salvate nell'integrazione. */
export class LuciTimerCardEditor extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config: CardFormConfig = { type: "custom:luci-timer-card" };
  @state() private _info: LuciInfo | null = null;
  private _loading = false;
  private _failed = false;

  setConfig(config: CardFormConfig): void {
    this._config = { ...config };
  }

  protected updated(): void {
    if (this.hass && !this._info && !this._loading && !this._failed) void this._load();
  }

  /** L'elenco delle luci serve solo per sceglierle: se l'integrazione non risponde l'editor funziona lo stesso, senza quella voce. */
  private async _load(): Promise<void> {
    this._loading = true;
    try {
      const msg: Record<string, unknown> = { type: "luci_timer/info" };
      if (typeof this._config.entry_id === "string" && this._config.entry_id) msg.entry_id = this._config.entry_id;
      this._info = await this.hass.callWS<LuciInfo>(msg);
    } catch {
      this._failed = true;
    } finally {
      this._loading = false;
    }
  }

  private _onForm(ev: CustomEvent<{ value: Record<string, unknown> }>): void {
    ev.stopPropagation();
    const config = applyCardForm(this._config, ev.detail.value);
    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }

  private _schema(): FormSchema[] {
    const schema: FormSchema[] = [
      { name: "title", selector: { text: {} } },
      { name: "only_on", selector: { boolean: {} } },
      { name: "header", selector: { boolean: {} } },
      {
        name: "display",
        selector: { select: { mode: "dropdown", options: [{ value: "button", label: "Pulsante del timer (apre un popup)" }, { value: "tile", label: "Tessera compatta" }] } },
      },
      { name: "color", selector: { ui_color: { include_none: true } } },
    ];
    const lights = (this._info?.lights ?? []).map((l) => ({ value: l.entity, label: l.name }));
    if (lights.length > 0) schema.push({ name: "lights", selector: { select: { multiple: true, mode: "list", options: lights } } });
    return schema;
  }

  render() {
    if (!this.hass) return nothing;
    return html`<ha-form
      .hass=${this.hass}
      .data=${cardFormValues(this._config)}
      .schema=${this._schema()}
      .computeLabel=${(s: { name: string }) => LABELS[s.name] ?? s.name}
      .computeHelper=${(s: { name: string }) => HELP[s.name] ?? ""}
      @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) => this._onForm(e)}
    ></ha-form>`;
  }

  static styles = css`
    :host { display: block; }
  `;
}

if (!customElements.get("luci-timer-card-editor")) customElements.define("luci-timer-card-editor", LuciTimerCardEditor);
