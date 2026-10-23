"""Prove dentro un Home Assistant vero (pytest-homeassistant-custom-component)."""
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed

from custom_components.luci_timer.const import DOMAIN

SCALE = "light.luce_scale"
CAFFE = "switch.macchina_caffe"
PIR = "binary_sensor.pir_scale"

LIGHTS = [
    {"entity": SCALE, "name": "Luce scale", "minutes": 5},
    {"entity": CAFFE, "name": "Macchina caffè", "minutes": 10},
]


def _record(hass: HomeAssistant) -> list[tuple[str, str, dict]]:
    """Simula homeassistant.turn_on/off e light.turn_on, registrando le chiamate."""
    calls: list[tuple[str, str, dict]] = []

    async def _on(call):
        calls.append(("turn_on", call.data["entity_id"], dict(call.data)))
        hass.states.async_set(call.data["entity_id"], "on")

    async def _off(call):
        calls.append(("turn_off", call.data["entity_id"], dict(call.data)))
        hass.states.async_set(call.data["entity_id"], "off")

    async def _light_on(call):
        calls.append(("light_turn_on", call.data["entity_id"], dict(call.data)))
        hass.states.async_set(call.data["entity_id"], "on", {"brightness": call.data.get("brightness", 200)})

    hass.services.async_register("homeassistant", "turn_on", _on)
    hass.services.async_register("homeassistant", "turn_off", _off)
    hass.services.async_register("light", "turn_on", _light_on)
    return calls


async def _setup(hass: HomeAssistant, lights=None, enabled=True) -> MockConfigEntry:
    for light in lights or LIGHTS:
        if hass.states.get(light["entity"]) is None:
            hass.states.async_set(light["entity"], "off")
    entry = MockConfigEntry(domain=DOMAIN, title="Timer luci", data={}, options={"enabled": enabled, "lights": lights or LIGHTS}, unique_id=DOMAIN)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


def _eid(hass: HomeAssistant, entry, domain: str, light: str, suffix: str) -> str:
    key = light.replace(".", "_")
    eid = er.async_get(hass).async_get_entity_id(domain, DOMAIN, f"{entry.entry_id}_{key}_{suffix}")
    assert eid, (domain, light, suffix)
    return eid


async def test_entities_are_created(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    assert hass.states.get(_eid(hass, entry, "sensor", SCALE, "stato")).state == "spenta"
    assert float(hass.states.get(_eid(hass, entry, "number", SCALE, "durata")).state) == 5
    assert hass.states.get(_eid(hass, entry, "switch", CAFFE, "attivo")).state == "on"
    assert hass.states.get(_eid(hass, entry, "sensor", SCALE, "scadenza")).state == "unknown"


async def test_light_on_starts_timer_and_off_clears_it(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    stato = _eid(hass, entry, "sensor", SCALE, "stato")
    scad = _eid(hass, entry, "sensor", SCALE, "scadenza")
    hass.states.async_set(SCALE, "on")
    await hass.async_block_till_done()
    assert hass.states.get(stato).state == "in_corso"
    assert hass.states.get(scad).state not in ("unknown", "unavailable")
    hass.states.async_set(SCALE, "off")
    await hass.async_block_till_done()
    assert hass.states.get(stato).state == "spenta"
    assert hass.states.get(scad).state == "unknown"


async def test_unavailable_then_on_starts_timer(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    hass.states.async_set(SCALE, "unavailable")
    await hass.async_block_till_done()
    assert hass.states.get(_eid(hass, entry, "sensor", SCALE, "stato")).state == "non_disponibile"
    hass.states.async_set(SCALE, "on")
    await hass.async_block_till_done()
    assert hass.states.get(_eid(hass, entry, "sensor", SCALE, "stato")).state == "in_corso"


async def test_light_already_on_at_startup_gets_a_timer(hass: HomeAssistant) -> None:
    hass.states.async_set(SCALE, "on")
    entry = await _setup(hass)
    assert hass.states.get(_eid(hass, entry, "sensor", SCALE, "stato")).state == "in_corso"


async def _tick(hass: HomeAssistant, freezer, when: datetime) -> None:
    freezer.move_to(when)
    async_fire_time_changed(hass, when)
    await hass.async_block_till_done()


async def test_expiry_turns_light_off_and_records_stats(hass: HomeAssistant, freezer) -> None:
    await hass.config.async_set_time_zone("Europe/Rome")
    rome = ZoneInfo("Europe/Rome")
    calls = _record(hass)
    entry = await _setup(hass)
    t0 = datetime(2026, 11, 2, 20, 0, tzinfo=rome)
    freezer.move_to(t0)
    hass.states.async_set(SCALE, "on")
    await hass.async_block_till_done()
    await _tick(hass, freezer, t0 + timedelta(minutes=4))
    assert calls == []
    await _tick(hass, freezer, t0 + timedelta(minutes=5, seconds=6))
    assert [(c[0], c[1]) for c in calls] == [("turn_off", SCALE)]
    ctl = hass.data[DOMAIN][entry.entry_id]
    cycle = ctl.cycles[SCALE.replace(".", "_")][-1]
    assert cycle.how == "scaduto"
    assert hass.states.get(_eid(hass, entry, "sensor", SCALE, "stato")).state == "spenta"


async def test_manual_off_is_recorded_as_manual(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    hass.states.async_set(SCALE, "on")
    await hass.async_block_till_done()
    hass.states.async_set(SCALE, "off")
    await hass.async_block_till_done()
    ctl = hass.data[DOMAIN][entry.entry_id]
    assert [c.how for c in ctl.cycles[SCALE.replace(".", "_")]] == ["manuale"]


async def test_motion_renews_instead_of_turning_off(hass: HomeAssistant, freezer) -> None:
    await hass.config.async_set_time_zone("Europe/Rome")
    rome = ZoneInfo("Europe/Rome")
    calls = _record(hass)
    hass.states.async_set(PIR, "on")
    lights = [{"entity": SCALE, "name": "Luce scale", "minutes": 5, "motion": PIR}]
    await _setup(hass, lights)
    t0 = datetime(2026, 11, 2, 20, 0, tzinfo=rome)
    freezer.move_to(t0)
    hass.states.async_set(SCALE, "on")
    await hass.async_block_till_done()
    await _tick(hass, freezer, t0 + timedelta(minutes=5, seconds=6))
    assert calls == []                                               # rinnovato, non spenta
    hass.states.async_set(PIR, "off")
    await _tick(hass, freezer, t0 + timedelta(minutes=10, seconds=15))
    assert [(c[0], c[1]) for c in calls] == [("turn_off", SCALE)]


async def test_warning_flash_does_not_cancel_the_timer(hass: HomeAssistant, freezer, monkeypatch) -> None:
    import custom_components.luci_timer.controller as ctrl

    monkeypatch.setattr(ctrl, "FLASH_PAUSE", 0)
    await hass.config.async_set_time_zone("Europe/Rome")
    rome = ZoneInfo("Europe/Rome")
    calls = _record(hass)
    lights = [{"entity": SCALE, "name": "Luce scale", "minutes": 5, "warn_seconds": 30}]
    entry = await _setup(hass, lights)
    t0 = datetime(2026, 11, 2, 20, 0, tzinfo=rome)
    freezer.move_to(t0)
    hass.states.async_set(SCALE, "on", {"brightness": 200})
    await hass.async_block_till_done()
    await _tick(hass, freezer, t0 + timedelta(minutes=4, seconds=40))
    kinds = [c[0] for c in calls]
    assert kinds == ["light_turn_on", "light_turn_on"]
    assert calls[0][2]["brightness"] == 50 and calls[1][2]["brightness"] == 200
    assert hass.states.get(_eid(hass, entry, "sensor", SCALE, "stato")).state == "in_corso"


async def test_actions_extend_hold_release(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    ctl = hass.data[DOMAIN][entry.entry_id]
    stato = _eid(hass, entry, "sensor", SCALE, "stato")
    assert ctl.action(SCALE, "extend", 5) is False                   # luce spenta
    hass.states.async_set(SCALE, "on")
    await hass.async_block_till_done()
    before = ctl.timers[SCALE.replace(".", "_")].end
    assert ctl.action(SCALE, "extend", 5) is True
    assert ctl.timers[SCALE.replace(".", "_")].end == before + timedelta(minutes=5)
    assert ctl.action(SCALE, "hold") is True
    await hass.async_block_till_done()
    assert hass.states.get(stato).state == "tenuta"
    assert ctl.action(SCALE, "release") is True
    await hass.async_block_till_done()
    assert hass.states.get(stato).state == "in_corso"
    assert ctl.action("light.sconosciuta", "hold") is False


async def test_services(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    hass.states.async_set(SCALE, "on")
    await hass.async_block_till_done()
    stato = _eid(hass, entry, "sensor", SCALE, "stato")
    await hass.services.async_call(DOMAIN, "hold", {"entity_id": SCALE}, blocking=True)
    assert hass.states.get(stato).state == "tenuta"
    await hass.services.async_call(DOMAIN, "release", {"entity_id": SCALE}, blocking=True)
    await hass.services.async_call(DOMAIN, "extend", {"entity_id": [SCALE], "minutes": 15}, blocking=True)
    remaining = hass.data[DOMAIN][entry.entry_id].timers[SCALE.replace(".", "_")].remaining(dt_util.now())
    assert remaining > 19 * 60


async def test_duration_number_and_enabled_switch_write_options(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    await hass.services.async_call("number", "set_value", {"entity_id": _eid(hass, entry, "number", SCALE, "durata"), "value": 12}, blocking=True)
    await hass.async_block_till_done()
    assert entry.options["lights"][0]["minutes"] == 12
    assert float(hass.states.get(_eid(hass, entry, "number", SCALE, "durata")).state) == 12
    hass.states.async_set(SCALE, "on")
    await hass.async_block_till_done()
    await hass.services.async_call("switch", "turn_off", {"entity_id": _eid(hass, entry, "switch", SCALE, "attivo")}, blocking=True)
    await hass.async_block_till_done()
    assert hass.states.get(_eid(hass, entry, "sensor", SCALE, "stato")).state == "timer_disattivato"
    assert entry.state.value == "loaded"


async def test_master_switch(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    hass.states.async_set(SCALE, "on")
    await hass.async_block_till_done()
    master = er.async_get(hass).async_get_entity_id("switch", DOMAIN, f"{entry.entry_id}_generale")
    await hass.services.async_call("switch", "turn_off", {"entity_id": master}, blocking=True)
    await hass.async_block_till_done()
    assert hass.states.get(_eid(hass, entry, "sensor", SCALE, "stato")).state == "timer_disattivato"
    await hass.services.async_call("switch", "turn_on", {"entity_id": master}, blocking=True)
    await hass.async_block_till_done()
    assert hass.states.get(_eid(hass, entry, "sensor", SCALE, "stato")).state == "in_corso"


async def test_timer_survives_reload(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    hass.states.async_set(SCALE, "on")
    await hass.async_block_till_done()
    end = hass.data[DOMAIN][entry.entry_id].timers[SCALE.replace(".", "_")].end
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert hass.data[DOMAIN][entry.entry_id].timers[SCALE.replace(".", "_")].end == end


async def test_websocket_info_update_and_prune(hass: HomeAssistant, hass_ws_client) -> None:
    entry = await _setup(hass)
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "luci_timer/info"})
    res = await client.receive_json()
    assert res["success"]
    assert [l["entity"] for l in res["result"]["lights"]] == [SCALE, CAFFE]
    assert res["result"]["lights"][0]["entities"]["durata"].startswith("number.")
    assert res["result"]["entities"]["generale"].startswith("switch.")

    new = [{"entity": SCALE, "name": "Scale", "minutes": 7}, {"entity": "light.nuova", "name": "Nuova", "minutes": 3}, {"entity": "x"}, {"entity": SCALE}]
    await client.send_json({"id": 2, "type": "luci_timer/update", "lights": new, "enabled": True})
    res = await client.receive_json()
    assert res["success"] and [l["entity"] for l in res["result"]["lights"]] == [SCALE, "light.nuova"]
    await hass.async_block_till_done()
    reg = er.async_get(hass)
    assert reg.async_get_entity_id("number", DOMAIN, f"{entry.entry_id}_light_nuova_durata")
    assert reg.async_get_entity_id("switch", DOMAIN, f"{entry.entry_id}_switch_macchina_caffe_attivo") is None   # tolta dall'elenco
    await client.send_json({"id": 3, "type": "luci_timer/stats"})
    res = await client.receive_json()
    assert res["success"] and set(res["result"]) == {"light_luce_scale", "light_nuova"}
    await client.send_json({"id": 4, "type": "luci_timer/action", "entity": SCALE, "action": "hold"})
    assert (await client.receive_json())["result"]["ok"] is False
    await client.send_json({"id": 5, "type": "luci_timer/action", "entity": SCALE, "action": "extend", "minutes": 100000})
    assert not (await client.receive_json())["success"]


async def test_config_flow_single_instance(hass: HomeAssistant) -> None:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    assert result["type"] == "form"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {})
    assert result["type"] == "create_entry"
    assert result["options"] == {"enabled": True, "lights": []}
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    assert result["type"] == "abort"


async def test_card_is_served(hass: HomeAssistant, hass_client) -> None:
    await _setup(hass)
    client = await hass_client()
    resp = await client.get("/luci_timer_static/luci-timer-card.js")
    assert resp.status == 200
