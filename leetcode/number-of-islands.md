---
layout: default
title: Number of Islands
parent: LeetCode
---

# Number of Islands

 m x n 2D 그리드가 지도로 주어진다. `1`은 땅이고 `0`은 물일 때, 섬의
 개수를 세는 문제다.

 여기서 **섬**은 가로/세로로 인접해서 연결된 땅이 물로 둘러 쌓여 있는
 것을 의미하는데, 지도 바깥은 전부 물이라고 가정하면 된다.

## DFS
 전형적인 그래프 탐색 문제다. 파이썬으로 DFS는 특히 쉽게 구현할 수
 있어서 여기서는 DFS로 구현해본다.

 전체 지도를 돌다가 땅을 만나는 순간 섬의 개수를 하나 증가하고, 곧바로
 그 땅으로부터 DFS를 시작해서 모든 땅을 다 *탐색*하면 된다. 이후
 만나는 땅 중에서 이전 땅에서 이미 *탐색* 된 땅은 같은 섬에 속하게
 되고, 탐색 안된 땅은 *다른 섬*이기 때문에 또 DFS를 호출하게 된다.

```python
def numIslands(grid):
    visited = set()
    m, n = len(grid), len(grid[0])
    def dfs(x, y):
        visited.add((x, y))

        for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
            if 0 <= nx < m and 0 <= ny < n:
                if grid[nx][ny] == '1' and (nx, ny) not in visited:
                    dfs(nx, ny)

    num = 0
    for x in range(m):
        for y in range(n):
            if grid[x][y] == '1' and (x, y) not in visited:
                num += 1
                dfs(x, y)

    return num
```

 - 파이썬의 튜플은 해싱 가능하기 때문에 set에 곧바로 넣을 수
   있다. 해당 좌표가 이미 탐색이 끝났는지 여부를 쉽게 체크할 수 있다.
 - 범위 연산을 할 때 `x >= 0 and x < m`과 같이 `&&` 연산을 해도 되지만
   위에서 처럼 Pythonic 하게 적을 수도 있다. 더 잘 읽힌다.
 - 원래 DFS 재귀 함수 안에서 다음 노드를 방문하기 전에 방문 여부
   (visited) 를 체크해주면 된다. 여기서는 바깥에서 추가로 한번 더 방문
   여부를 체크하는데 그 이유는 섬의 개수를 세기 위해서다. 어떤 섬의
   땅에 첫 발을 내딛는 순간 섬의 개수가 하나 증가하고 그 섬에 속한
   모든 땅을 방문한 것으로 기록하기 때문에, 이후 노드 중 이미 방문
   기록된 노드는 이전 DFS 에서 섬으로 카운트 된 땅이다.
