"""Sensori: stato e scadenza del timer di ogni luce, più il numero di timer in corso."""
from __future__ import annotations

from datetime import datetime
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity, SensorStateClass
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN
from .controller import LuciController
from .engine import LightTimer
from .entity import LuciEntity, general_device, light_device

STATUSES = ["non_disponibile", "spenta", "in_corso", "tenuta", "timer_disattivato"]


class StatusSensor(LuciEntity, SensorEntity):
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = STATUSES
    _attr_icon = "mdi:timer-outline"

    def __init__(self, controller: LuciController, timer: LightTimer) -> None:
        super().__init__(controller, f"{timer.cfg.key}_stato", "stato", light_device(controller, timer))
        self._key = timer.cfg.key

    @property
    def _timer(self) -> LightTimer:
        return self.controller.timers[self._key]

    @property
    def native_value(self) -> str:
        return self._timer.status(self.controller.master)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        t = self._timer
        return {"luce": t.cfg.entity, "durata_min": t.cfg.minutes, "movimento": list(t.cfg.motions)}


class ExpirySensor(LuciEntity, SensorEntity):
    _attr_device_class = SensorDeviceClass.TIMESTAMP
    _attr_icon = "mdi:timer-sand"

    def __init__(self, controller: LuciController, timer: LightTimer) -> None:
        super().__init__(controller, f"{timer.cfg.key}_scadenza", "scadenza", light_device(controller, timer))
        self._key = timer.cfg.key

    @property
    def native_value(self) -> datetime | None:
        return self.controller.timers[self._key].end

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        t = self.controller.timers[self._key]
        return {"durata_min": t.cfg.minutes, "tenuta": t.held}


class RunningSensor(LuciEntity, SensorEntity):
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_icon = "mdi:lightbulb-on-outline"

    def __init__(self, controller: LuciController) -> None:
        super().__init__(controller, "in_corso", "in_corso", general_device(controller))

    @property
    def native_value(self) -> int:
        return self.controller.running_count()


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback) -> None:
    controller: LuciController = hass.data[DOMAIN][entry.entry_id]
    entities: list[SensorEntity] = [RunningSensor(controller)]
    for timer in controller.timers.values():
        entities += [StatusSensor(controller, timer), ExpirySensor(controller, timer)]
    async_add_entities(entities)
