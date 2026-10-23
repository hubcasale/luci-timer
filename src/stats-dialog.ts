import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { dialogStyles } from "./dialog-style";
import { statsLine } from "./card-logic";
import type { HomeAssistant, LightStats, LuciInfo } from "./types";

/** Statistiche degli ultimi 30 giorni per ogni luce, con un consiglio sulla durata. */
export class LuciStatsDialog extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) info!: LuciInfo;
  @state() private _stats: Record<string, LightStats> | null = null;
  @state() private _error = "";
  @state() private _applied = new Set<string>();
  private _onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") this._close();
  };

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this._onKey);
    void this._load();
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._onKey);
  }
  private _close(): void {
    this.dispatchEvent(new CustomEvent("closed"));
    this.remove();
  }

  private async _load(): Promise<void> {
    try {
      this._stats = await this.hass.callWS<Record<string, LightStats>>({ type: "luci_timer/stats", entry_id: this.info.entry_id });
    } catch (e) {
      this._error = `Impossibile leggere le statistiche: ${e instanceof Error ? e.message : (e as { message?: string })?.message ?? String(e)}`;
    }
  }

  private async _apply(key: string, entity: string | undefined, minutes: number): Promise<void> {
    if (!entity) return;
    try {
      await this.hass.callService("number", "set_value", { entity_id: entity, value: minutes });
      this._applied = new Set([...this._applied, key]);
      this.dispatchEvent(new CustomEvent("saved"));
    } catch (e) {
      this._error = `Impossibile cambiare la durata: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  render() {
    return html`
      <div class="backdrop" @click=${(e: Event) => e.target === e.currentTarget && this._close()}>
        <div class="panel" role="dialog" aria-modal="true" aria-label="Statistiche timer luci">
          <div class="head"><div class="title">Statistiche (30 giorni)</div><button class="x" aria-label="Chiudi" @click=${() => this._close()}>✕</button></div>
          <div class="body">
            ${this._stats === null && !this._error ? html`<div class="empty">Carico…</div>` : nothing}
            ${this._stats
              ? this.info.lights.map((l) => {
                  const s = this._stats![l.key];
                  if (!s) return nothing;
                  return html`
                    <div class="card">
                      <div class="nm">${l.name}</div>
                      <div class="ln">${statsLine(s)}</div>
                      ${s.advice ? html`<div class="adv">${s.advice}</div>` : nothing}
                      ${s.suggested_minutes && !this._applied.has(l.key)
                        ? html`<button class="btn primary" @click=${() => void this._apply(l.key, l.entities.durata, s.suggested_minutes!)}>Usa ${s.suggested_minutes} minuti</button>`
                        : nothing}
                      ${this._applied.has(l.key) ? html`<div class="okbox">Durata aggiornata.</div>` : nothing}
                    </div>`;
                })
              : nothing}
            ${this._error ? html`<div class="err">${this._error}</div>` : nothing}
          </div>
        </div>
      </div>`;
  }

  static styles = [
    dialogStyles,
    css`
      .card { padding: 12px 14px; margin-bottom: 10px; border: 1px solid var(--divider-color, #ddd); border-radius: 12px; }
      .nm { font-weight: 600; } .ln { font-size: 0.85rem; color: var(--secondary-text-color, #727272); margin-top: 3px; }
      .adv { margin-top: 6px; font-size: 0.9rem; } .card .btn { margin-top: 8px; min-height: 44px; }
      .okbox { margin-top: 8px; font-size: 0.85rem; color: #166534; }
    `,
  ];
}

if (!customElements.get("luci-stats-dialog")) customElements.define("luci-stats-dialog", LuciStatsDialog);
