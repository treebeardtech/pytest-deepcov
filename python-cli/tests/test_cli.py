import json
import os

import pytest
from click.testing import CliRunner
from deeptest.cli import File
from snapshottest.pytest import PyTestSnapshotTest
from tests.util import RESOURCES

from deeptest import cli

pytest_plugins = "pytester"
import shutil
import sys
from subprocess import CalledProcessError, check_output


@pytest.fixture
def tested_dir():
    try:
        check_output(f"{sys.executable} -m pytest", cwd="tests/resources", shell=True)
    except CalledProcessError as err:
        assert err.returncode == 1
    os.chdir(RESOURCES / ".deeptest")


class TestCli:
    def test_when_test_file_then_success(
        self, tested_dir: object, snapshot: PyTestSnapshotTest
    ):
        runner = CliRunner()
        source = RESOURCES / "src" / "test_lib.py"
        assert source.exists()
        print(f"Running {source}")
        result = runner.invoke(cli.run, source.as_posix(), catch_exceptions=False)

        print(result.stdout)
        f = File(**json.loads(result.stdout))
        [snapshot.assert_match({line: f.lines[line]}) for line in sorted(f.lines)]

    def test_when_src_file_then_success(
        self, tested_dir: object, snapshot: PyTestSnapshotTest
    ):
        runner = CliRunner()
        source = RESOURCES / "src" / "lib.py"
        assert source.exists()
        print(f"Running {source}")
        result = runner.invoke(cli.run, source.as_posix(), catch_exceptions=False)

        print(result.stdout)
        f = File(**json.loads(result.stdout))
        [snapshot.assert_match({line: f.lines[line]}) for line in sorted(f.lines)]

    def test_when_no_junit_then_error(
        self,
        tested_dir: object,
        testdir: pytest.Testdir,
    ):
        shutil.copyfile(RESOURCES / ".deeptest" / ".coverage", ".coverage")
        runner = CliRunner()
        source = RESOURCES / "src" / "lib.py"
        assert source.exists()
        print(f"Running {source}")
        result = runner.invoke(cli.run, source.as_posix(), catch_exceptions=False)
        assert "error" in json.loads(result.stdout)

    def test_when_no_cov_then_error(self, tested_dir: object, testdir: pytest.Testdir):
        shutil.copyfile(RESOURCES / ".deeptest" / "junit.xml", "junit.xml")
        runner = CliRunner()
        source = RESOURCES / "src" / "lib.py"
        assert source.exists()
        print(f"Running {source}")
        result = runner.invoke(cli.run, source.as_posix(), catch_exceptions=False)
        assert "error" in json.loads(result.stdout)

    def test_when_unknown_file_then_error(self, tested_dir: object):
        runner = CliRunner()
        source = RESOURCES / "src" / "asdf.py"
        assert not source.exists()
        print(f"Running {source}")
        result = runner.invoke(cli.run, source.as_posix(), catch_exceptions=False)
        assert json.loads(result.stdout)["error"].startswith("No cov")

    def test_when_out_of_cov_scope_then_error(self, tested_dir: object):
        runner = CliRunner()
        source = RESOURCES / "out_of_cov_scope.py"
        assert source.exists()
        print(f"Running {source}")
        result = runner.invoke(cli.run, source.as_posix(), catch_exceptions=False)
        assert json.loads(result.stdout)["error"].startswith("No cov")

    def test_when_status_then_time_given(self, tested_dir: object):
        runner = CliRunner()
        result = runner.invoke(cli.run, catch_exceptions=False)
        assert json.loads(result.stdout)["time_since_run"] == "just now"

    def test_when_status_no_data_then_null(self, testdir: pytest.Testdir):
        runner = CliRunner()
        result = runner.invoke(cli.run, catch_exceptions=False)
        assert json.loads(result.stdout)["time_since_run"] == None
