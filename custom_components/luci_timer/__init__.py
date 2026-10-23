"""Timer luci: ogni luce o presa accesa si spegne da sola dopo il tempo scelto, con scheda, statistiche e comandi."""
from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

import voluptuous as vol

from homeassistant.components import frontend, websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.typing import ConfigType

from .const import CARD_FILE, CARD_URL, CONF_ENABLED, CONF_LIGHTS, DOMAIN, PLATFORMS
from .controller import LuciController, signature
from .engine import MAX_MINUTES, parse_lights

_LOGGER = logging.getLogger(__name__)
CONFIG_SCHEMA = vol.Schema({DOMAIN: vol.Schema({})}, extra=vol.ALLOW_EXTRA)
LIGHT_SUFFIXES = ("stato", "scadenza", "durata", "attivo")
GENERAL_KEYS = ("in_corso", "generale")


def _version() -> str:
    try:
        return json.loads((Path(__file__).parent / "manifest.json").read_text())["version"]
    except (OSError, ValueError, KeyError):
        return "0"


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Registra la scheda (servita dall'integrazione), i comandi per la scheda e i servizi."""
    hass.data.setdefault(DOMAIN, {})
    card_path = Path(__file__).parent / CARD_FILE
    if await hass.async_add_executor_job(card_path.is_file):
        version = await hass.async_add_executor_job(_version)
        await hass.http.async_register_static_paths([StaticPathConfig(CARD_URL, str(card_path), cache_headers=False)])
        frontend.add_extra_js_url(hass, f"{CARD_URL}?v={version}")
    else:
        _LOGGER.warning("Scheda non trovata in %s: costruiscila con npm run build", card_path)
    for command in (ws_info, ws_update, ws_action, ws_stats):
        websocket_api.async_register_command(hass, command)
    _register_services(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    controller = LuciController(hass, entry)
    hass.data[DOMAIN][entry.entry_id] = controller
    await controller.async_start()
    _prune_registry(hass, entry, controller)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_async_options_updated))
    return True


async def _async_options_updated(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Opzioni cambiate: se cambia l'elenco delle luci si ricarica la voce, altrimenti si applica subito."""
    controller: LuciController | None = hass.data[DOMAIN].get(entry.entry_id)
    if controller is None or signature(parse_lights(entry.options.get(CONF_LIGHTS))) != controller.signature:
        await hass.config_entries.async_reload(entry.entry_id)
        return
    controller.apply_options()


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if ok:
        controller: LuciController = hass.data[DOMAIN].pop(entry.entry_id)
        await controller.async_stop()
    return ok


@callback
def _prune_registry(hass: HomeAssistant, entry: ConfigEntry, controller: LuciController) -> None:
    """Toglie entità e dispositivi delle luci che non ci sono più."""
    keep = {f"{entry.entry_id}_{k}_{s}" for k in controller.timers for s in LIGHT_SUFFIXES}
    keep |= {f"{entry.entry_id}_{g}" for g in GENERAL_KEYS}
    reg = er.async_get(hass)
    for ent in er.async_entries_for_config_entry(reg, entry.entry_id):
        if ent.unique_id not in keep:
            reg.async_remove(ent.entity_id)
    dev_keep = {f"{entry.entry_id}_{k}" for k in controller.timers} | {entry.entry_id}
    dreg = dr.async_get(hass)
    for dev in dr.async_entries_for_config_entry(dreg, entry.entry_id):
        if not any(i[0] == DOMAIN and i[1] in dev_keep for i in dev.identifiers):
            dreg.async_remove_device(dev.id)


# ---------------------------------------------------------------------- servizi
def _controllers(hass: HomeAssistant) -> list[LuciController]:
    return [c for c in hass.data.get(DOMAIN, {}).values() if isinstance(c, LuciController)]


def _register_services(hass: HomeAssistant) -> None:
    base = {vol.Required("entity_id"): cv.entity_ids}

    def _handler(action: str):
        async def _run(call: ServiceCall) -> None:
            minutes = call.data.get("minutes", 5)
            for entity in call.data["entity_id"]:
                for c in _controllers(hass):
                    c.action(entity, action, minutes)

        return _run

    hass.services.async_register(DOMAIN, "extend", _handler("extend"), schema=vol.Schema({**base, vol.Optional("minutes", default=5): vol.All(int, vol.Range(min=1, max=MAX_MINUTES))}))
    hass.services.async_register(DOMAIN, "hold", _handler("hold"), schema=vol.Schema(base))
    hass.services.async_register(DOMAIN, "release", _handler("release"), schema=vol.Schema(base))


# ---------------------------------------------------------------------- comandi per la scheda
def _controller(hass: HomeAssistant, entry_id: str | None) -> LuciController | None:
    controllers = {k: v for k, v in hass.data.get(DOMAIN, {}).items() if isinstance(v, LuciController)}
    if entry_id:
        return controllers.get(entry_id)
    return next(iter(controllers.values()), None)


def _entities_of(hass: HomeAssistant, entry: ConfigEntry, controller: LuciController) -> dict[str, dict[str, str]]:
    reg = er.async_get(hass)
    out: dict[str, dict[str, str]] = {}
    for key in controller.timers:
        ents: dict[str, str] = {}
        for suffix, domain in (("stato", "sensor"), ("scadenza", "sensor"), ("durata", "number"), ("attivo", "switch")):
            eid = reg.async_get_entity_id(domain, DOMAIN, f"{entry.entry_id}_{key}_{suffix}")
            if eid:
                ents[suffix] = eid
        out[key] = ents
    return out


@websocket_api.websocket_command({vol.Required("type"): "luci_timer/info", vol.Optional("entry_id"): str})
@callback
def ws_info(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    c = _controller(hass, msg.get("entry_id"))
    if c is None:
        connection.send_error(msg["id"], "not_found", "Timer luci non configurato")
        return
    data = c.info()
    ents = _entities_of(hass, c.entry, c)
    for light in data["lights"]:
        light["entities"] = ents.get(light["key"], {})
    reg = er.async_get(hass)
    data["entities"] = {
        k: reg.async_get_entity_id(d, DOMAIN, f"{c.entry.entry_id}_{k}") for k, d in (("generale", "switch"), ("in_corso", "sensor"))
    }
    connection.send_result(msg["id"], data)


@websocket_api.websocket_command(
    {vol.Required("type"): "luci_timer/update", vol.Optional("entry_id"): str, vol.Optional("enabled"): bool, vol.Optional("lights"): list}
)
@websocket_api.require_admin
@callback
def ws_update(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Salva l'interruttore generale e/o l'elenco completo delle luci (voci non valide e doppioni si scartano)."""
    c = _controller(hass, msg.get("entry_id"))
    if c is None:
        connection.send_error(msg["id"], "not_found", "Timer luci non configurato")
        return
    options = dict(c.entry.options)
    if "enabled" in msg:
        options[CONF_ENABLED] = msg["enabled"]
    if "lights" in msg:
        options[CONF_LIGHTS] = [l.to_dict() for l in parse_lights(msg["lights"])]
    hass.config_entries.async_update_entry(c.entry, options=options)
    connection.send_result(msg["id"], {"enabled": options.get(CONF_ENABLED, True), "lights": options.get(CONF_LIGHTS, [])})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "luci_timer/action",
        vol.Optional("entry_id"): str,
        vol.Required("entity"): str,
        vol.Required("action"): vol.In(["extend", "hold", "release", "off_now", "on", "cancel"]),
        vol.Optional("minutes", default=5): vol.All(int, vol.Range(min=1, max=MAX_MINUTES)),
    }
)
@callback
def ws_action(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    c = _controller(hass, msg.get("entry_id"))
    if c is None:
        connection.send_error(msg["id"], "not_found", "Timer luci non configurato")
        return
    ok = c.action(msg["entity"], msg["action"], msg["minutes"])
    connection.send_result(msg["id"], {"ok": ok})


@websocket_api.websocket_command({vol.Required("type"): "luci_timer/stats", vol.Optional("entry_id"): str})
@callback
def ws_stats(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    c = _controller(hass, msg.get("entry_id"))
    if c is None:
        connection.send_error(msg["id"], "not_found", "Timer luci non configurato")
        return
    connection.send_result(msg["id"], c.stats())
