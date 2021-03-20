from __future__ import print_function

import os
import sys
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
    shutil.rmtree(".deeptest", ignore_errors=True)
    return testdir


def test_when_no_xml_then_output_correctly(testdir: Testdir, fake_repo: object):
    shutil.rmtree(".deeptest", ignore_errors=True)
    hook_recorder = testdir.inline_run()

    assert hook_recorder.ret == ExitCode.TESTS_FAILED
    assert Path(".deeptest/junit.xml").exists()
    assert Path(".deeptest/.coverage").exists()


def test_when_other_xml_then_output_correctly(testdir: Testdir, fake_repo: object):
    shutil.rmtree(".deeptest", ignore_errors=True)
    hook_recorder = testdir.inline_run("--junit-xml=junit.xml")

    assert hook_recorder.ret == ExitCode.TESTS_FAILED
    assert Path(".deeptest/junit.xml").exists()
    assert Path("junit.xml").exists()


def test_when_trace_present_then_disables_cov(testdir: Testdir, fake_repo: object):
    print(os.getcwd())
    shutil.rmtree(".deeptest", ignore_errors=True)
    assert not Path(".deeptest/junit.xml").exists()
    sys.settrace(lambda x, y, z: None)
    hook_recorder = testdir.inline_run()

    assert hook_recorder.ret == ExitCode.TESTS_FAILED
    assert not Path(".deeptest/junit.xml").exists()


def test_when_collect_only_then_no_output(fake_repo: Testdir):
    assert not Path(".deeptest/junit.xml").exists()
    hook_recorder = fake_repo.inline_run("--co")

    assert hook_recorder.ret == ExitCode.OK
    assert not Path(".deeptest/junit.xml").exists()
