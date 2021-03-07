from click.testing import CliRunner

from deeptest import cli

pytest_plugins = "pytester"


def test_when_local_dir_then_success(testdir):
    runner = CliRunner()

    _ = runner.invoke(cli.run, catch_exceptions=False)


from pathlib import Path

path = Path("src/deeptest/cli.py")
text = path.read_text()


def test_asttokens():
    from asttokens import ASTTokens, LineNumbers

    ast = ASTTokens(text, filename=path.as_posix())
    ln = LineNumbers(text)
    o = ln.line_to_offset(7, 0)
    pass


def test_astroid():
    from astroid import parse

    module = parse(text)
    pass


def test_git():
    from git import Repo

    repo = Repo("/Users/a/git/treebeardtech/deeptest")
    b_blob = repo.head.commit.diff()[0].b_blob
    x = b_blob.data_stream.read()
    b_text = x.decode().split("\n")
    pass


def test_cov():
    import coverage

    cov = coverage.Coverage(context="test_cov")
    cov.start()
    runner = CliRunner()

    _ = runner.invoke(cli.run, catch_exceptions=False)

    cov.stop()
    cov.save()

    cov.html_report(show_contexts=True)
