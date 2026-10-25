# Timer luci

Integrazione per Home Assistant che **spegne da sola luci, prese e ventole** dopo il tempo scelto, con una **scheda Lovelace per il tablet** (tessere grandi da toccare, conto alla rovescia, niente hover) e le preferenze configurabili dalla scheda stessa.

Sostituisce un package YAML con un timer, tre automazioni e tre cursori per ogni luce: qui le luci si aggiungono dall'interfaccia e il timer sopravvive ai riavvii.

## Come funziona

- Quando una luce **si accende** parte il suo timer (anche se era "non disponibile" e torna accesa, e anche se era già accesa all'avvio di Home Assistant).
- Quando si **spegne**, per qualsiasi motivo, il timer finisce.
- Alla **scadenza** la luce si spegne, a meno che uno dei sensori associati (facoltativi: movimento, presenza, porte; fino a 6 per luce) sia ancora attivo: in quel caso il timer riparte.
- Prima dello spegnimento la luce può **abbassarsi un istante** per avvisare (facoltativo, solo luci).
- Le scadenze sono salvate: dopo un riavvio i timer riprendono, e una luce rimasta accesa oltre la scadenza si spegne subito.

## Installazione

**HACS** → Integrazioni → menu ⋮ → *Repository personalizzati* → `https://github.com/hubcasale/luci-timer`, categoria *Integrazione* → installa → riavvia Home Assistant. Poi *Impostazioni → Dispositivi e servizi → Aggiungi integrazione → Timer luci*.

Aggiungi alla dashboard una scheda manuale:

```yaml
type: custom:luci-timer-card
# facoltativi
title: Timer luci
lights: [light.luce_scale, light.luce_ingresso]   # mostra solo queste luci
header: false                                     # piccolo pulsante del timer (solo a luce accesa) con popup
only_on: true                                     # all'inizio solo le tessere delle luci accese
```

Con `only_on: true` la scheda mostra solo le luci accese (se non ce n'è nessuna, "Nessuna luce accesa"); il pulsante **Solo accese / Tutte** in alto permette di cambiare vista.

Con `lights` e `header: false` la scheda diventa un **piccolo pulsante con l'icona del timer**, visibile solo quando la luce è accesa (arancione con il timer in corso, azzurro se tenuta accesa, grigio se il timer è disattivato). Toccandolo si apre un popup con il conto alla rovescia grande, +5 / +15 minuti, Tieni accesa, Spegni ora, "Spegni tra…" e l'interruttore del timer. Con `display: tile` si ottiene invece la tessera compatta.

Il file della scheda lo serve l'integrazione. Dopo ogni aggiornamento ricarica la pagina senza cache (nel tablet con Fully Kiosk: svuota la cache).

## La scheda

Una tessera per luce, con le accese in cima:

- **Icona tonda**: accende o spegne la luce.
- **Conto alla rovescia** ("Spegne tra 03:12") e barra del tempo rimasto.
- **+5 min**, **Tieni accesa** (niente scadenza finché non la spegni; poi **Riprendi timer**) e **Spegni**.
- Toccando il nome si aprono le impostazioni di quella luce.

In alto il riepilogo ("5 accese · 3 timer in corso"), il pulsante **Timer attivi / Timer spenti** (interruttore generale), le **Statistiche** e l'ingranaggio delle **Preferenze**.

**Preferenze**: aggiungi e togli luci, e per ognuna scegli nome, durata (1 min–12 ore, con pulsanti rapidi), timer attivo o no, sensori di movimento e avviso prima dello spegnimento.

**Statistiche** (ultimi 30 giorni): accensioni, quante spente dal timer e quante a mano, durata media e un consiglio. Per esempio *«Spesso la riaccendi subito dopo la scadenza: prova 8 minuti»*, con il pulsante per applicarlo.

## Entità

Un dispositivo "Timer *nome*" per ogni luce:

| Entità | |
|---|---|
| `sensor.timer_<nome>_stato` | spenta, timer in corso, tenuta accesa, timer disattivato, non disponibile |
| `sensor.timer_<nome>_scadenza` | data e ora di spegnimento |
| `number.timer_<nome>_durata` | durata in minuti |
| `switch.timer_<nome>_timer_attivo` | abilita il timer di quella luce |

E nel dispositivo "Timer luci": `switch.timer_luci_timer_luci_attivi` (interruttore generale) e `sensor.timer_luci_timer_in_corso` (quanti timer in corso).

## Servizi

Per le automazioni (le luci sono indicate con il loro `entity_id`):

- `luci_timer.start`: accende la luce con un timer di `minutes` diversi da quelli normali, solo per questo ciclo (sostituisce `timer.change`); senza `minutes` usa la durata impostata;
- `luci_timer.extend`: prolunga di `minutes` (predefinito 5);
- `luci_timer.hold`: tieni accesa;
- `luci_timer.release`: riprende il timer normale.

## Migrare dal vecchio package `timer_luci`

1. Installa l'integrazione, aggiungila e inserisci le luci dalle Preferenze della scheda (nel vecchio package: `switch.macchina_caffe`, `light.faro_parcheggio`, `light.luce_ingresso`, `light.luce_scale`, `light.luci_parcheggio_l1`, `light.disimpegno_garage_l2`, `light.disimpegno_garage_l1`, `light.luce_garage`) con le stesse durate.
2. Tieni i due sistemi in parallelo per qualche giorno: spengono la stessa luce, quindi non si disturbano.
3. Sostituisci nelle dashboard le righe dei vecchi `timer.*`, `input_number` e `input_boolean` con la scheda.
4. Togli `packages/timer_luci/` e ricarica la configurazione.

## Sviluppo

```bash
npm ci
npm run build        # genera custom_components/luci_timer/frontend/luci-timer-card.js (da committare)
npm test             # test della logica della scheda
pip install pytest-homeassistant-custom-component home-assistant-frontend
python3 -m pytest -q tests   # motore dei timer e prove dentro un Home Assistant vero
```

`dev/index.html` (dopo `npm run build:dev`) mostra la scheda con un Home Assistant simulato; `?theme=dark` per il tema scuro.

## Licenza

MIT
