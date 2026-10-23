import importlib.util
import sys
from datetime import datetime, timedelta
from pathlib import Path

spec = importlib.util.spec_from_file_location("engine", Path(__file__).parent.parent / "custom_components/luci_timer/engine.py")
engine = importlib.util.module_from_spec(spec)
sys.modules["engine"] = engine
spec.loader.exec_module(engine)
from engine import Cycle, LightConfig, LightTimer, analyze, parse_lights, trim_cycles  # noqa: E402

T0 = datetime(2026, 10, 23, 20, 0, 0)


def mk(minutes=5, **kw):
    return LightTimer(LightConfig("light.scale", "Scale", minutes, **kw))


def test_config_validation():
    c = LightConfig.from_dict({"entity": "light.scale", "name": "", "minutes": "7.6", "motions": ["binary_sensor.pir"], "warn_seconds": 30})
    assert c and c.minutes == 8 and c.name == "Scale" and c.warn_seconds == 30 and c.motions == ("binary_sensor.pir",)
    legacy = LightConfig.from_dict({"entity": "light.scale", "motion": "binary_sensor.old"})
    assert legacy.motions == ("binary_sensor.old",)
    many = LightConfig.from_dict({"entity": "light.ingresso", "motions": ["binary_sensor.a", "binary_sensor.b", "binary_sensor.a", "sensor.no", 5]})
    assert many.motions == ("binary_sensor.a", "binary_sensor.b")
    assert LightConfig.from_dict({"entity": "climate.x"}) is None
    assert LightConfig.from_dict({"entity": "luce"}) is None
    assert LightConfig.from_dict("x") is None
    c = LightConfig.from_dict({"entity": "switch.caffe", "minutes": 99999, "warn_seconds": 30, "motions": ["sensor.no"]})
    assert c.minutes == 720 and c.warn_seconds == 0 and c.motions == ()       # niente lampeggio sugli interruttori
    assert LightConfig.from_dict({"entity": "light.a", "minutes": 0}).minutes == 1
    assert LightConfig.from_dict({"entity": "light.a", "enabled": False}).enabled is False
    assert LightConfig.from_dict(c.to_dict()) == c


def test_parse_lights_dedupes_and_skips():
    lights = parse_lights([{"entity": "light.a"}, {"entity": "light.a"}, {"entity": "x"}, 3, {"entity": "switch.b", "minutes": 3}])
    assert [l.entity for l in lights] == ["light.a", "switch.b"]
    assert parse_lights(None) == []


def test_turn_on_starts_timer_and_off_cancels():
    t = mk(5)
    assert t.light_changed(T0, True, True) is None
    assert t.end == T0 + timedelta(minutes=5) and t.status(True) == "in_corso"
    cycle = t.light_changed(T0 + timedelta(minutes=2), False, True)
    assert cycle and cycle.how == "manuale" and (cycle.end - cycle.start) == timedelta(minutes=2)
    assert t.end is None and t.status(True) == "spenta"


def test_start_from_unavailable_and_unknown():
    t = mk()
    t.light_changed(T0, None, True)
    assert t.status(True) == "non_disponibile" and t.end is None
    t.light_changed(T0, True, True)
    assert t.end is not None           # il caso che il vecchio package perdeva: unavailable -> on


def test_already_on_does_not_restart():
    t = mk(5)
    t.light_changed(T0, True, True)
    end = t.end
    t.light_changed(T0 + timedelta(minutes=1), True, True)      # cambio di luminosità, stesso stato
    assert t.end == end


def test_expire_turns_off_and_records_cycle():
    t = mk(5)
    t.light_changed(T0, True, True)
    assert t.tick(T0 + timedelta(minutes=4), False, True) is None
    assert t.tick(T0 + timedelta(minutes=5), False, True) == "expire"
    cycle = t.light_changed(T0 + timedelta(minutes=5, seconds=1), False, True)
    assert cycle and cycle.how == "scaduto"
    assert t.reon_check(T0 + timedelta(minutes=6)) is True
    assert t.reon_check(T0 + timedelta(minutes=9)) is False


def test_motion_renews():
    t = mk(5, motions=("binary_sensor.pir", "binary_sensor.porta"))
    t.light_changed(T0, True, True)
    assert t.tick(T0 + timedelta(minutes=5), True, True) == "renew"
    assert t.end == T0 + timedelta(minutes=10) and t.extended == 1
    assert t.tick(T0 + timedelta(minutes=10), False, True) == "expire"
    # senza sensore configurato il movimento non conta
    t2 = mk(5)
    t2.light_changed(T0, True, True)
    assert t2.tick(T0 + timedelta(minutes=5), True, True) == "expire"


def test_warning_once():
    t = mk(5, warn_seconds=30)
    t.light_changed(T0, True, True)
    assert t.tick(T0 + timedelta(minutes=4, seconds=20), False, True) is None
    assert t.tick(T0 + timedelta(minutes=4, seconds=31), False, True) == "warn"
    assert t.tick(T0 + timedelta(minutes=4, seconds=45), False, True) is None
    assert t.tick(T0 + timedelta(minutes=5), False, True) == "expire"


def test_extend_hold_release():
    t = mk(5)
    assert t.extend(T0, 5) is False                 # luce spenta
    t.light_changed(T0, True, True)
    assert t.extend(T0 + timedelta(minutes=1), 5) is True
    assert t.end == T0 + timedelta(minutes=10)
    assert t.hold() is True and t.end is None and t.status(True) == "tenuta"
    assert t.tick(T0 + timedelta(hours=3), False, True) is None
    assert t.release(T0 + timedelta(hours=3), True) is True
    assert t.end == T0 + timedelta(hours=3, minutes=5)
    t.hold()
    assert t.extend(T0 + timedelta(hours=4), 10) is True and t.held is False     # prolungare riprende il timer
    assert t.end == T0 + timedelta(hours=4, minutes=10)


def test_disabled_and_master():
    t = mk(5, enabled=False)
    t.light_changed(T0, True, True)
    assert t.end is None and t.status(True) == "timer_disattivato"
    t = mk(5)
    t.light_changed(T0, True, False)                # master spento
    assert t.end is None
    t.master_changed(T0 + timedelta(minutes=1), True)
    assert t.end == T0 + timedelta(minutes=6)
    t.master_changed(T0 + timedelta(minutes=2), False)
    assert t.end is None


def test_reconfigure():
    t = mk(5)
    t.light_changed(T0, True, True)
    t.reconfigure(LightConfig("light.scale", "Scale", 10), T0 + timedelta(minutes=1), True)
    assert t.end == T0 + timedelta(minutes=5)       # il ciclo in corso non cambia
    t.reconfigure(LightConfig("light.scale", "Scale", 10, enabled=False), T0 + timedelta(minutes=1), True)
    assert t.end is None
    t.reconfigure(LightConfig("light.scale", "Scale", 10), T0 + timedelta(minutes=2), True)
    assert t.end == T0 + timedelta(minutes=12)


def test_restore_after_restart():
    t = mk(5)
    t.light_changed(T0, True, True)
    saved = t.to_saved()
    t2 = mk(5)
    t2.load_saved(saved)
    t2.light_changed(T0 + timedelta(minutes=3), True, True)       # primo stato noto dopo il riavvio: acceso
    assert t2.end == T0 + timedelta(minutes=5) and t2.started == T0
    assert t2.tick(T0 + timedelta(minutes=6), False, True) == "expire"      # scaduto durante il riavvio: spenta subito
    # luce spenta nel frattempo: il salvato si scarta
    t3 = mk(5)
    t3.load_saved(saved)
    t3.light_changed(T0 + timedelta(minutes=3), False, True)
    assert t3.saved is None
    # luce accesa ma nessun timer salvato: parte da adesso
    t4 = mk(5)
    t4.light_changed(T0, True, True)
    assert t4.end == T0 + timedelta(minutes=5)
    # tenuta accesa prima del riavvio: resta tenuta
    t5 = mk(5)
    t5.light_changed(T0, True, True)
    t5.hold()
    t6 = mk(5)
    t6.load_saved(t5.to_saved())
    t6.light_changed(T0 + timedelta(minutes=1), True, True)
    assert t6.held and t6.end is None


def test_cycle_roundtrip_and_trim():
    c = Cycle(T0, T0 + timedelta(minutes=4), "scaduto", 1, False, True)
    assert Cycle.from_dict(c.to_dict()) == c
    assert Cycle.from_dict({"s": "x"}) is None
    old = Cycle(T0 - timedelta(days=60), T0 - timedelta(days=60) + timedelta(minutes=1), "manuale")
    assert trim_cycles([old, c], T0 + timedelta(hours=1)) == [c]


def _cycles(n, how, minutes, reon=0, start=T0):
    out = []
    for i in range(n):
        s = start - timedelta(days=i % 20, hours=i % 5)
        out.append(Cycle(s, s + timedelta(minutes=minutes), how, reon=i < reon))
    return out


def test_analyze_advice():
    now = T0 + timedelta(days=1)
    assert "Pochi dati" in analyze(_cycles(3, "manuale", 2), 10, now)["advice"]
    a = analyze(_cycles(10, "scaduto", 5, reon=4), 5, now)
    assert a["suggested_minutes"] == 8 and "riaccendi subito" in a["advice"]
    assert "funziona" in analyze(_cycles(10, "scaduto", 5), 5, now)["advice"]
    a = analyze(_cycles(10, "manuale", 2), 10, now)
    assert "solo una sicurezza" in a["advice"] and a["manual_median_minutes"] == 2.0
    assert analyze(_cycles(5, "manuale", 8) + _cycles(5, "scaduto", 5), 10, now)["advice"].startswith("Uso misto")
    assert analyze([], 5, now)["runs"] == 0


def test_start_for_when_on_and_when_off():
    t = mk(10)
    assert t.start_for(T0, 5) is False                       # luce spenta: vale per la prossima accensione
    t.light_changed(T0 + timedelta(seconds=2), True, True)
    assert t.end == T0 + timedelta(seconds=2, minutes=5)
    t.light_changed(T0 + timedelta(minutes=1), False, True)
    t.light_changed(T0 + timedelta(minutes=2), True, True)   # il valore una tantum è già stato usato
    assert t.end == T0 + timedelta(minutes=12)
    t2 = mk(10)
    t2.start_for(T0, 5)
    t2.light_changed(T0 + timedelta(minutes=5), True, True)  # troppo tardi: scaduto il permesso di 30 secondi
    assert t2.end == T0 + timedelta(minutes=15)
    t3 = mk(10)
    t3.light_changed(T0, True, True)
    assert t3.start_for(T0 + timedelta(minutes=1), 3) is True
    assert t3.end == T0 + timedelta(minutes=4)
