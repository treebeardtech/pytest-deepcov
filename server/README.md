# Deeptest

Identify the most relevant testcases for your code change using coverage data.

Lots of time is spent running tests and triaging failures without knowing if and how the testcase relates to the code being changed.

Deeptest lets you prioritise running and debugging test cases most affected by your change, rather than waste time investigating flaky tests or env issues

```shell
pip install -U deeptest pytest

pytest
...
deeptest captured 946 testcases
deeptest.db created, you can source control this file

# see most relevant test cases
> deeptest status
...

# run most relevant tests first
pytest --dt-threshold=5

Your current diff touches 21 test cases, running those first.

executablebooks/jupyter-book/x.py:
...

# identify relevance of failure
> deeptest testcase x.y.test.py --open
see _deeptest/index.html...
```

## Discussion

Deeptest works by identifying which tests touch areas of the abstract syntax tree (AST) that have been changed.

If we were only to look at the program as lines of code, it would be difficult to determine if adding lines of code affects a function, class, or whole module.

## MVP

1. (line, col) => ASTNode # identify nodes touched when tracing
2. (test_case) => List[ASTNode] # identify all nodes touched by a test case

Using these functions we can
- identify which tests a given line change may affect
- identiify if a failing test case ran a changed line
- identify if a


# revision

1. emit per-test coverage by default

pip install pytest pytest-cov
pytest --cov=src --cov-context=test

2. install the deeptest vscode extension

3. browse coverage of failing tests

## limitations

This initial version is specifically for pytest and vs code users
