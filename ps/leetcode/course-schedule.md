---
layout: page
tags: [problem-solving, leetcode, python, graph]
title: Course Schedule
grand_parent: Problem Solving
parent: LeetCode
nav_exclude: true
---

# [Course Schedule](https://leetcode.com/problems/course-schedule/)

 총 `numCourses` 개의 수업을 들어야 한다. 배열 `prerequisites`이
 주어지는데 `prerequisites[i] = (ai, bi)`는 수업 `bi`를 듣기 전에
 **반드시** 들어야 하는 선행 과목 `ai`를 나타낸다. 예를 들어 `(0, 1)`
 튜플은 수업 `0`을 들어야만 수업 `1`을 들을 수 있다는 뜻이다.

 수업을 다 끝낼 수 있는지를 확인하자.

 수업의 개수는 1~100,000 이고, 입력으로 들어오는 선행 과목은 0~5,000
 사이이다. 선행 과목 정보의 쌍은 모두 `[0, numCourses)` 범위의
 값이다. 모든 선행 과목 정보 쌍은 유니크하다.

## 위상 정렬

 샘플 케이스를 보면서 감을 잡자.

```
numCourses = 2
prerequisites = [(1,0)]
```

 위의 경우, `1 -> 0` 순으로 수업을 들으면 수업을 모두 끝마칠 수 있다.

```
numCourses = 2
prerequisites = [(1,0), (0,1)]
```

 위의 경우, `1 -> 0`과 `0 -> 1`을 동시에 만족시키는 것은 불가능하기
 때문에, 수업을 모두 들을 수 없다.

---

 즉, 이 문제는 그래프와 관련이 있다. `numCourses`는 그래프의 노드
 수이고, `prerequisites`는 그래프의 엣지를 나타낸다. 이로부터 그래프를
 그렸을 때, **싸이클**이 있다면, 어떤 수업을 듣기 위해서 선행해야 하는
 과목이 무한 루프를 이루므로 수업을 끝마치는 것(=모든 노드를 방문하는
 것)이 불가능하다. 따라서, 이 문제는 [그래프에서 싸이클을 찾는
 방법](../../theory/topological-ordering)을 적용하면 된다.

 그래프 탐색은 보통 방문 여부를 배열이나 집합으로 기록하면서
 진행된다. 만약 모든 엣지를 따라 나가다가 이전에 방문한 노드를 또
 방문하게 되었다면, 이는 싸이클이 있는 것이다.

 그 외의 엣지 케이스는 없을까? 만약 선행 과목 정보에 아무것도 없으면
 어떻게 될까? 이때는 어떤 과목을 듣기 위해서 필수적으로 들어야 할 게
 아무것도 없으므로 그냥 아무거나 들으면 된다. 즉, 위의 싸이클만
 확인하면 된다.

 파이썬에서 그래프를 표현하기 위한 가장 쉬운 방법은 그래프를 **집합의
 딕셔너리**로 만드는 것이다. 즉, 말하자면 엣지 정보만 담은 일종의
 Adjacency List라고 볼 수 있다. Matrix로 표현하는 것도 가능하지만
 파이썬은 이게 훨씬 편하다.

 싸이클을 찾기 위한 탐색은 DFS가 좋다. BFS로도 할 수 있는데, 구현이
 까다롭다.

```python
from collections import set

def canFinish(numCourses, prerequisites):
    graph = defaultdict(set)
    for (src, snk) in prerequisites:
        graph[src].add(snk)

    stack = []
    visited = set()

    for node in graph:
        stack.append(node)
        while stack:
            n = stack.pop()
```
