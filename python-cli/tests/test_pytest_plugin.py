from __future__ import print_function

from distutils.dir_util import copy_tree
from pathlib import Path

import pytest
from _pytest.pytester import Testdir
from pytest import ExitCode
from tests.util import RESOURCES

pytest_plugins = "pytester"
NB_VERSION = 4
import shutil


@pytest.fixture
def fake_repo(testdir: Testdir):
    copy_tree(RESOURCES.as_posix(), ".")


def test_when_no_xml_then_output_correctly(testdir: Testdir, fake_repo: object):
    shutil.rmtree(".deeptest", ignore_errors=True)
    hook_recorder = testdir.inline_run()

    assert hook_recorder.ret == ExitCode.TESTS_FAILED
    assert Path(".deeptest/junit.xml").exists()


def test_when_other_xml_then_output_correctly(testdir: Testdir, fake_repo: object):
    shutil.rmtree(".deeptest", ignore_errors=True)
    hook_recorder = testdir.inline_run("--junit-xml=junit.xml")

    assert hook_recorder.ret == ExitCode.TESTS_FAILED
    assert Path(".deeptest/junit.xml").exists()
    assert Path("junit.xml").exists()
