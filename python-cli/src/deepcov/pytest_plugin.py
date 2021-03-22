import shutil
import sys
from pathlib import Path
from typing import Any, List, cast

from _pytest.config import Config
from _pytest.config.argparsing import Parser
from coverage import Coverage
from pytest import ExitCode, hookimpl

JUNIT_DEST = ".deepcov/junit.xml"
COV_DEST = ".deepcov/.coverage"


def is_enabled(config: Config) -> bool:
    return not cast(bool, config.option.no_cov) and bool(config.option.cov_source)


@hookimpl(hookwrapper=True)
def pytest_load_initial_conftests(
    early_config: Config, parser: Parser, args: List[str]
):
    if sys.gettrace() or "--co" in args or "--collect-only" in args:
        early_config.known_args_namespace.cov_source = None
        early_config.option.no_cov = True

    early_config.known_args_namespace.cov_context = "test"

    yield


def pytest_configure(config: Config):
    if is_enabled(config) and config.option.xmlpath is None:
        config.option.xmlpath = JUNIT_DEST


def pytest_terminal_summary(
    terminalreporter: Any, exitstatus: ExitCode, config: Config
):
    if is_enabled(config):
        Path(".deepcov").mkdir(exist_ok=True)

        if config.option.xmlpath != JUNIT_DEST:
            shutil.copy(config.option.xmlpath, JUNIT_DEST)

        cc = Coverage(config_file=config.option.cov_config)
        if cc.config.data_file != COV_DEST:
            shutil.copy(cc.config.data_file, COV_DEST)
