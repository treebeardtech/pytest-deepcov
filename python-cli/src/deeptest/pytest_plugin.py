import shutil
from typing import Any, List, cast

from _pytest.config import Config
from _pytest.config.argparsing import Parser
from pytest import ExitCode, hookimpl

out_path = ".deeptest/junit.xml"
import sys


def is_enabled(config: Config) -> bool:
    return not cast(bool, config.option.no_cov) and cast(bool, config.option.cov_source)


@hookimpl(hookwrapper=True)
def pytest_load_initial_conftests(
    early_config: Config, parser: Parser, args: List[str]
):
    #     raise Exception()
    if sys.gettrace():
        early_config.known_args_namespace.cov_source = None
        # early_config.pluginmanager.set_blocked('pytest_cov')
        early_config.option.no_cov = True
        # args=["--no-cov"]

    yield


# def pytest_sessionstart(session):
#     pass
def pytest_configure(config: Config):
    if is_enabled(config) and config.option.xmlpath is None:
        # 1/0
        config.option.xmlpath = out_path


def pytest_terminal_summary(
    terminalreporter: Any, exitstatus: ExitCode, config: Config
):
    if is_enabled(config) and config.option.xmlpath != out_path:
        print(f"Copying {config.option.xmlpath} to {out_path}")
        shutil.copy(config.option.xmlpath, out_path)
