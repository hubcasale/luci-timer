"""Durata del timer di ogni luce, in minuti."""
from __future__ import annotations

from homeassistant.components.number import NumberEntity, NumberMode
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import UnitOfTime
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN
from .controller import LuciController
from .engine import MAX_MINUTES, MIN_MINUTES, LightTimer
from .entity import LuciEntity, light_device


class DurationNumber(LuciEntity, NumberEntity):
    _attr_native_min_value = MIN_MINUTES
    _attr_native_max_value = MAX_MINUTES
    _attr_native_step = 1
    _attr_mode = NumberMode.BOX
    _attr_native_unit_of_measurement = UnitOfTime.MINUTES
    _attr_icon = "mdi:timer-cog-outline"

    def __init__(self, controller: LuciController, timer: LightTimer) -> None:
        super().__init__(controller, f"{timer.cfg.key}_durata", "durata", light_device(controller, timer))
        self._key = timer.cfg.key

    @property
    def native_value(self) -> float:
        return self.controller.timers[self._key].cfg.minutes

    async def async_set_native_value(self, value: float) -> None:
        self.controller.set_light(self._key, minutes=int(value))


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback) -> None:
    controller: LuciController = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([DurationNumber(controller, t) for t in controller.timers.values()])
