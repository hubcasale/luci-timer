import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))


@pytest.fixture(autouse=True)
def _enable(enable_custom_integrations):
    yield
