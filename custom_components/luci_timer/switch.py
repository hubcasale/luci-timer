"""Interruttori: timer attivo per ogni luce e interruttore generale di tutti i timer."""
from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN
from .controller import LuciController
from .engine import LightTimer
from .entity import LuciEntity, general_device, light_device


class EnabledSwitch(LuciEntity, SwitchEntity):
    _attr_icon = "mdi:timer-check-outline"

    def __init__(self, controller: LuciController, timer: LightTimer) -> None:
        super().__init__(controller, f"{timer.cfg.key}_attivo", "attivo", light_device(controller, timer))
        self._key = timer.cfg.key

    @property
    def is_on(self) -> bool:
        return self.controller.timers[self._key].cfg.enabled

    async def async_turn_on(self, **kwargs: Any) -> None:
        self.controller.set_light(self._key, enabled=True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        self.controller.set_light(self._key, enabled=False)


class MasterSwitch(LuciEntity, SwitchEntity):
    _attr_icon = "mdi:timer-cog"

    def __init__(self, controller: LuciController) -> None:
        super().__init__(controller, "generale", "generale", general_device(controller))

    @property
    def is_on(self) -> bool:
        return self.controller.master

    async def async_turn_on(self, **kwargs: Any) -> None:
        self.controller.set_master(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        self.controller.set_master(False)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback) -> None:
    controller: LuciController = hass.data[DOMAIN][entry.entry_id]
    entities: list[SwitchEntity] = [MasterSwitch(controller)]
    entities += [EnabledSwitch(controller, t) for t in controller.timers.values()]
    async_add_entities(entities)
