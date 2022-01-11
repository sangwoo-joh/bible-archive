---
layout: page
title: BFS
parent: Python for PS
---

{: .no_toc }
## Table of Contents
{: .no_toc .text-delta }
- TOC
{:toc}

# BFS
## Deque
 파이썬에는 `collections` 패키지 안에 `deque`가 있으므로 다음
 인터페이스를 숙지해야 한다.
 - `deque()`: 생성자
 - `deque.append(x)`: 끝
 - `deque.appendleft(x)`: 앞
 - `deque.pop()`: 끝
 - `deque.popleft()`: 앞

## 정석
 1. 큐, 집합 초기화
 2. 시작 지점을 하나 잡아서, 큐와 집합에 둘다 넣는다.
 3. 큐가 빌 때까지 다음을 반복한다:
    1. 앞에서 하나 pop 한다.
    2. pop한 원소에서 갈 수 있는 다음 지점을 전부 훑어본다.
    3. 다음 지점이 *집합에 없으면* (즉, 방문하지 않았으면), 큐와
       집합에 둘다 넣는다.

 BFS에서 주의해야 할 부분은 루프 안에서 큐에 다음 지점을 **넣기 전에**
 방문 체크를 해야한다는 점이다. 꺼내서 방문 체크 해도 말은 되지만
 이러면 시간 복잡도가 터진다.

## [1926번: 그림](https://www.acmicpc.net/problem/1926)

```python
import sys
from collections import deque
line = sys.stdin.readline

n, m = map(int, line().rstrip().split())
graph = []
for _ in range(n):
    graph.append(line().rstrip().split())

visited, max_area, total_count = set(), 0, 0
def bfs(y, x):
    q = deque()
    visited.add((y, x))
    q.append((y, x))
    area = 1
    while q:
        y, x = q.pop()
        for ny, nx in ((y+1, x), (y-1, x), (y, x+1), (y, x-1)):
            if 0 <= ny < n and 0 <= nx < m and graph[ny][nx] == '1' and (ny, nx) not in visited:
                visited.add((ny, nx))
                q.append((ny, nx))
                area += 1
    return area

# check all
for y in range(n):
    for x in range(m):
        if graph[y][x] == '1' and (y, x) not in visited:
            total_count += 1
            max_area = max(max_area, bfs(y, x))

print(total_count)
print(max_area)
```

 위의 클래식을 잘 고려해서 bfs를 짜면 된다. 파이써닉하게 짠 부분은 (1)
 방문 체크할 때 내장 해쉬셋과 내장 튜플을 곧바로 이용한 점, (2) 다음
 지점을 구할 때 상하좌우 다음 좌표를 곧바로 튜플로 계산한 것, 그리고
 (3) 다음 지점의 바운드 체크를 할 때 체인 비교 연산자를 쓴 것이다.

 한 그림의 어느 지점에서 시작하던지 간에 `bfs`가 호출되고 나면 그
 그림의 모든 좌표를 방문하게 되므로 처음 방문할 때 `total_count`를
 늘리면 된다.

 그림의 크기는 `bfs`에서 큐에 넣을 때마다, 혹은 방문했다고 기록할
 때마다 크기가 1씩 증가하므로 이 사실을 이용해서 계속 누적해 나아가면
 된다.