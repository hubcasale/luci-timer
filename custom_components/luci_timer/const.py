"""Costanti dell'integrazione Timer luci."""
from homeassistant.const import Platform

DOMAIN = "luci_timer"
PLATFORMS = [Platform.SENSOR, Platform.NUMBER, Platform.SWITCH]

CONF_ENABLED = "enabled"
CONF_LIGHTS = "lights"

STORAGE_VERSION = 1
CARD_URL = "/luci_timer_static/luci-timer-card.js"
CARD_FILE = "frontend/luci-timer-card.js"

SIGNAL_UPDATE = f"{DOMAIN}_update_{{}}"   # formato con l'id della voce di configurazione
TICK_SECONDS = 5
FLASH_PAUSE = 0.7
SUPPRESS_SECONDS = 4
SAVE_EVERY = 300
