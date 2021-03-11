# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import GenericRepr, Snapshot

snapshots = Snapshot()

snapshots["TestCli.test_when_src_file_then_success 1"] = {
    1: GenericRepr("Line(passed=['ran on startup'], failed=[])")
}

snapshots["TestCli.test_when_src_file_then_success 2"] = {
    2: GenericRepr(
        "Line(passed=['src.test_lib.TestLib.test_divide2[3.0]', 'src.test_lib.test_divide', 'src.test_lib.test_divide2[3.0]'], failed=['src.test_lib.TestLib.test_divide2[0]', 'src.test_lib.test_divide2[0]'])"
    )
}

snapshots["TestCli.test_when_src_file_then_success 3"] = {
    3: GenericRepr("Line(passed=[], failed=[])")
}

snapshots["TestCli.test_when_src_file_then_success 4"] = {
    5: GenericRepr(
        "Line(passed=['src.test_lib.TestLib.test_divide2[3.0]', 'src.test_lib.test_divide', 'src.test_lib.test_divide2[3.0]'], failed=['src.test_lib.TestLib.test_divide2[0]', 'src.test_lib.test_divide2[0]'])"
    )
}

snapshots["TestCli.test_when_test_file_then_success 1"] = {
    1: GenericRepr("Line(passed=['ran on startup'], failed=[])")
}

snapshots["TestCli.test_when_test_file_then_success 10"] = {
    17: GenericRepr("Line(passed=['src.test_lib.TestLib.test_hello'], failed=[])")
}

snapshots["TestCli.test_when_test_file_then_success 11"] = {
    19: GenericRepr("Line(passed=['ran on startup'], failed=[])")
}

snapshots["TestCli.test_when_test_file_then_success 12"] = {
    20: GenericRepr("Line(passed=['ran on startup'], failed=[])")
}

snapshots["TestCli.test_when_test_file_then_success 13"] = {
    21: GenericRepr(
        "Line(passed=['src.test_lib.TestLib.test_divide2[3.0]'], failed=['src.test_lib.TestLib.test_divide2[0]'])"
    )
}

snapshots["TestCli.test_when_test_file_then_success 2"] = {
    3: GenericRepr("Line(passed=['ran on startup'], failed=[])")
}

snapshots["TestCli.test_when_test_file_then_success 3"] = {
    6: GenericRepr("Line(passed=['ran on startup'], failed=[])")
}

snapshots["TestCli.test_when_test_file_then_success 4"] = {
    7: GenericRepr("Line(passed=['src.test_lib.test_divide'], failed=[])")
}

snapshots["TestCli.test_when_test_file_then_success 5"] = {
    10: GenericRepr("Line(passed=['ran on startup'], failed=[])")
}

snapshots["TestCli.test_when_test_file_then_success 6"] = {
    11: GenericRepr("Line(passed=['ran on startup'], failed=[])")
}

snapshots["TestCli.test_when_test_file_then_success 7"] = {
    12: GenericRepr(
        "Line(passed=['src.test_lib.test_divide2[3.0]'], failed=['src.test_lib.test_divide2[0]'])"
    )
}

snapshots["TestCli.test_when_test_file_then_success 8"] = {
    15: GenericRepr("Line(passed=['ran on startup'], failed=[])")
}

snapshots["TestCli.test_when_test_file_then_success 9"] = {
    16: GenericRepr("Line(passed=['ran on startup'], failed=[])")
}

snapshots["test_when_local_dir_then_success 1"] = GenericRepr(
    "File(lines={1: Line(passed=['ran on startup'], failed=[]), 3: Line(passed=['ran on startup'], failed=[]), 6: Line(passed=['ran on startup'], failed=[]), 10: Line(passed=['ran on startup'], failed=[]), 11: Line(passed=['ran on startup'], failed=[]), 15: Line(passed=['ran on startup'], failed=[]), 16: Line(passed=['ran on startup'], failed=[]), 19: Line(passed=['ran on startup'], failed=[]), 20: Line(passed=['ran on startup'], failed=[]), 7: Line(passed=['src.test_lib.test_divide'], failed=[]), 12: Line(passed=['src.test_lib.test_divide2[3.0]'], failed=['src.test_lib.test_divide2[0]']), 17: Line(passed=['src.test_lib.TestLib.test_hello'], failed=[]), 21: Line(passed=['src.test_lib.TestLib.test_divide2[3.0]'], failed=['src.test_lib.TestLib.test_divide2[0]'])})"
)

snapshots["test_when_local_dir_then_success2 1"] = GenericRepr(
    "File(lines={3: Line(passed=[], failed=[]), 1: Line(passed=['ran on startup'], failed=[]), 2: Line(passed=['src.test_lib.test_divide', 'src.test_lib.test_divide2[3.0]', 'src.test_lib.TestLib.test_divide2[3.0]'], failed=['src.test_lib.test_divide2[0]', 'src.test_lib.TestLib.test_divide2[0]']), 5: Line(passed=['src.test_lib.test_divide', 'src.test_lib.test_divide2[3.0]', 'src.test_lib.TestLib.test_divide2[3.0]'], failed=['src.test_lib.test_divide2[0]', 'src.test_lib.TestLib.test_divide2[0]'])})"
)
