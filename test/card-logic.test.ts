import { test } from "node:test";
import assert from "node:assert/strict";
import {
  friendlyName, addableEntities, asStatus, clampMinutes, countdown, fmtMinutes, lightError, lightsError, motionEntities, newLight, statsLine, summaryText, tileModel,
} from "../src/card-logic";
import type { HassEntity, LightInfo } from "../src/types";

const NOW = Date.UTC(2026, 10, 2, 20, 0, 0);
const st = (entity_id: string, state: string, attributes: Record<string, unknown> = {}): HassEntity => ({ entity_id, state, attributes });

function light(over: Partial<LightInfo> = {}): LightInfo {
  return {
    entity: "light.scale", name: "Scale", minutes: 5, enabled: true, motions: [], warn_seconds: 0, key: "light_scale",
    status: "spenta", end: null, remaining: null,
    entities: { stato: "sensor.t_stato", scadenza: "sensor.t_scad", durata: "number.t_durata", attivo: "switch.t_attivo" }, ...over,
  };
}
const world = (lightState: string, stato: string, end: string, minutes = "5", attivo = "on") => ({
  "light.scale": st("light.scale", lightState),
  "sensor.t_stato": st("sensor.t_stato", stato),
  "sensor.t_scad": st("sensor.t_scad", end),
  "number.t_durata": st("number.t_durata", minutes),
  "switch.t_attivo": st("switch.t_attivo", attivo),
});

test("countdown e fmtMinutes", () => {
  assert.equal(countdown(192000), "03:12");
  assert.equal(countdown(3730000), "1:02:10");
  assert.equal(countdown(-5), "00:00");
  assert.equal(countdown(1), "00:01");
  assert.equal(fmtMinutes(5), "5 min");
  assert.equal(fmtMinutes(60), "1 h");
  assert.equal(fmtMinutes(90), "1 h 30 min");
  assert.equal(asStatus("boh"), "non_disponibile");
  assert.equal(asStatus("tenuta"), "tenuta");
});

test("tileModel: timer in corso con conto alla rovescia e barra", () => {
  const end = new Date(NOW + 150000).toISOString();
  const t = tileModel(light(), world("on", "in_corso", end), NOW);
  assert.equal(t.tone, "running");
  assert.equal(t.subtitle, "Spegne tra 02:30");
  assert.equal(t.progress, 0.5);
  assert.equal(t.running, true);
  assert.equal(t.on, true);
});

test("tileModel: prolungata oltre la durata la barra non supera 1", () => {
  const t = tileModel(light(), world("on", "in_corso", new Date(NOW + 20 * 60000).toISOString()), NOW);
  assert.equal(t.progress, 1);
});

test("tileModel: tenuta, disattivato, spenta, non disponibile", () => {
  assert.equal(tileModel(light(), world("on", "tenuta", "unknown"), NOW).subtitle, "Tenuta accesa");
  assert.equal(tileModel(light(), world("on", "timer_disattivato", "unknown", "5", "off"), NOW).subtitle, "Accesa · timer disattivato");
  const off = tileModel(light(), world("off", "spenta", "unknown", "10"), NOW);
  assert.equal(off.subtitle, "Spenta · timer 10 min");
  assert.equal(off.tone, "off");
  assert.equal(tileModel(light(), world("off", "spenta", "unknown", "5", "off"), NOW).subtitle, "Spenta · timer 5 min (disattivato)");
  assert.equal(tileModel(light(), world("unavailable", "non_disponibile", "unknown"), NOW).tone, "bad");
  assert.equal(tileModel(light(), {}, NOW).tone, "bad");
});

test("tileModel: scaduta da un attimo", () => {
  const t = tileModel(light(), world("on", "in_corso", new Date(NOW - 1000).toISOString()), NOW);
  assert.equal(t.subtitle, "Sta per spegnersi");
});

test("tileModel: senza entità vive usa il server", () => {
  const l = light({ entities: {}, status: "in_corso", end: new Date(NOW + 60000).toISOString() });
  const t = tileModel(l, { "light.scale": st("light.scale", "on") }, NOW);
  assert.equal(t.subtitle, "Spegne tra 01:00");
});

test("summaryText", () => {
  const mk = (on: boolean, running: boolean, held = false) => ({ key: "k", entity: "e", name: "n", on, tone: "off" as const, subtitle: "", progress: null, running, held, timerOn: true, minutes: 5 });
  assert.equal(summaryText([], true), "Nessuna luce: aggiungine una con l'ingranaggio.");
  assert.equal(summaryText([mk(false, false)], true), "Tutte spente");
  assert.equal(summaryText([mk(true, true), mk(true, false, true), mk(false, false)], true), "2 accese · 1 timer in corso · 1 tenuta accesa");
  assert.equal(summaryText([mk(true, false)], false), "1 accesa · timer disattivati");
});

test("controlli delle luci", () => {
  const ok = newLight("light.scale", "Scale");
  assert.equal(lightError(ok, [ok]), null);
  assert.match(lightError({ ...ok, entity: "climate.x" }, [ok])!, /valida/);
  assert.match(lightError(ok, [ok, ok])!, /già nell'elenco/);
  assert.match(lightError({ ...ok, minutes: 0 }, [ok])!, /durata/);
  assert.match(lightError({ ...ok, minutes: 721 }, [ok])!, /durata/);
  assert.match(lightError({ ...ok, motions: ["sensor.x"] }, [ok])!, /movimento/);
  assert.equal(lightError({ ...ok, motions: ["binary_sensor.pir", "binary_sensor.porta"] }, [ok]), null);
  assert.match(lightError({ ...ok, motions: Array.from({ length: 7 }, (_, i) => `binary_sensor.s${i}`) }, [ok])!, /Al massimo 6/);
  assert.match(lightsError([{ ...ok, name: "Scale", minutes: 0 }])!, /^Scale:/);
  assert.equal(lightsError([]), null);
  assert.equal(newLight("light.luce_garage").name, "Luce garage");
  assert.equal(clampMinutes(0), 1);
  assert.equal(clampMinutes(5000), 720);
  assert.equal(clampMinutes(7.6), 8);
});

test("elenchi di entità", () => {
  const states = {
    "light.b": st("light.b", "on", { friendly_name: "Bagno" }),
    "light.a": st("light.a", "off", { friendly_name: "Ambra" }),
    "sensor.x": st("sensor.x", "1"),
    "switch.c": st("switch.c", "on"),
    "binary_sensor.pir": st("binary_sensor.pir", "off", { device_class: "motion", friendly_name: "PIR scale" }),
    "binary_sensor.porta": st("binary_sensor.porta", "off", { device_class: "door", friendly_name: "Porta" }),
    "binary_sensor.batteria": st("binary_sensor.batteria", "off", { device_class: "battery" }),
  };
  assert.deepEqual(addableEntities(states, ["switch.c"]).map((e) => e.id), ["light.a", "light.b"]);
  assert.deepEqual(motionEntities(states).map((e) => e.id), ["binary_sensor.pir", "binary_sensor.porta"]);
  assert.deepEqual(motionEntities(states, ["binary_sensor.pir"]).map((e) => e.id), ["binary_sensor.porta"]);
  assert.equal(friendlyName(states, "binary_sensor.pir"), "PIR scale");
  assert.equal(friendlyName(states, "binary_sensor.boh"), "binary_sensor.boh");
});

test("statsLine", () => {
  assert.equal(statsLine({ days: 30, runs: 0, expired: 0, manual: 0, reon: 0, avg_minutes: null, manual_median_minutes: null, advice: null, suggested_minutes: null }), "Nessuna accensione negli ultimi giorni.");
  assert.equal(
    statsLine({ days: 30, runs: 10, expired: 7, manual: 3, reon: 0, avg_minutes: 4.2, manual_median_minutes: 2, advice: null, suggested_minutes: null }),
    "10 accensioni · 7 spente dal timer · 3 a mano · durata media 4,2 min",
  );
});
