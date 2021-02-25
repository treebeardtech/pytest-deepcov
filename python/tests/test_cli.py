from click.testing import CliRunner

from deeptest import cli

pytest_plugins = "pytester"


def test_when_local_dir_then_success(testdir):
    runner = CliRunner()

    _ = runner.invoke(cli.run, catch_exceptions=False)
