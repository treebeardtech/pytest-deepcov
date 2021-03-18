import shutil
from typing import Any

from _pytest.config import Config
from pytest import ExitCode

out_path = ".deeptest/junit.xml"


def pytest_configure(config):
    if config.option.xmlpath is None:
        config.option.xmlpath = out_path


def pytest_terminal_summary(
    terminalreporter: Any, exitstatus: ExitCode, config: Config
):
    if not config.option.xmlpath == out_path:
        print(f"Copying {config.option.xmlpath} to {out_path}")
        shutil.copy(config.option.xmlpath, out_path)
