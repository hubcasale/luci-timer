"""Base comune delle entità: un dispositivo per ogni luce con timer, più uno generale."""
from __future__ import annotations

from homeassistant.core import callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import DeviceInfo

from .const import DOMAIN
from .controller import LuciController
from .engine import LightTimer


class LuciEntity:
    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, controller: LuciController, unique: str, translation_key: str, device: DeviceInfo) -> None:
        self.controller = controller
        self._attr_unique_id = f"{controller.entry.entry_id}_{unique}"
        self._attr_translation_key = translation_key
        self._attr_device_info = device

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(async_dispatcher_connect(self.hass, self.controller.signal, self._refresh))

    @callback
    def _refresh(self) -> None:
        self.async_write_ha_state()


def general_device(controller: LuciController) -> DeviceInfo:
    return DeviceInfo(identifiers={(DOMAIN, controller.entry.entry_id)}, name=controller.entry.title, manufacturer="Timer luci", model="Riepilogo")


def light_device(controller: LuciController, timer: LightTimer) -> DeviceInfo:
    return DeviceInfo(
        identifiers={(DOMAIN, f"{controller.entry.entry_id}_{timer.cfg.key}")},
        name=f"Timer {timer.cfg.name}",
        manufacturer="Timer luci",
        model="Timer di una luce",
        via_device=(DOMAIN, controller.entry.entry_id),
    )
