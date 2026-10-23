"""Configurazione guidata: una sola voce; le luci si gestiscono dalla scheda (o dal comando luci_timer/update)."""
from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult

from .const import CONF_ENABLED, CONF_LIGHTS, DOMAIN


class LuciTimerConfigFlow(ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()
        if user_input is not None:
            return self.async_create_entry(title="Timer luci", data={}, options={CONF_ENABLED: True, CONF_LIGHTS: []})
        return self.async_show_form(step_id="user")
