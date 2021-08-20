---
layout: page
title: Jump Game
parent: Jongman Book Training
---

{: .no_toc }
## Table of Contents
{: .no_toc .text-delta }
- TOC
{:toc}

# Description

 `n` x `n` 격자(`2 <= n <= 100`)에 1부터 9까지 숫자가 있는 게임판이
 있고, 맨 왼쪽 위에서 출발해서 맨 오른쪽 아래까지 가는 게 게임의
 목표다. 말이 어떤 위치 `(x, y)`에 있으면 그 위치의 값만큼 아래쪽이나
 오른쪽으로 이동할 수 있다. 밖으로 벗어나면 안된다. 이때 목표 지점까지
 가는 경로가 있으면 `YES`, 없으면 `NO`를 출력하자.

# Solution
 `(x, y)` 위치에서 부터 목표 지점까지 도달할 수 있는지를 알려주는
 `jumpable(x, y)` 함수를 재귀적으로 구현해볼 수 있다. `(x, y)` 위치에
 있는 값을 `k` 라고 하면, 아래쪽으로 가는 걸 `(x, y+k)`로, 오른쪽으로
 가는 걸 `(x+k, y)`로 나타낼 수 있기 때문에, 다음과 같은 재귀적인
 점화식이 성립한다.

``` python
jumpable(x, y) = jumpable(x + k, y) || jumpable(x, y + k)
```

 이때 완전탐색으로 찾아가는 경로는 `n` 값에 대해 지수적으로
 증가하는데, 입력으로 주어지는 `(x, y)`의 개수가 최대 100 x 100 =
 10000개 밖에 안된다. 따라서 비둘기집 원리에 의해 탐색 경로에 무조건
 중복 문제가 있다. 따라서 이 부분을 메모아이제이션 하면 된다.


## Code

```python
import sys
from functools import lru_cache
input = sys.stdin.readline  # 빠른 입력

def readints():
    return [int(x) for x in input().split()]  # 빠른 입력

def jumpgame(n):
    grid = []
    for _ in range(n):
        grid.append(readints())

    @lru_cache(maxsize=None)  # 특별히 2차원 배열을 만들지 않아도 된다.
    def jumpable(x, y):
        # base case
        if x >= n or y >= n:
            return False
        if (x, y) == (n-1, n-1):
            return True

        return jumpable(x + grid[x][y], y) or jumpable(x, y + grid[x][y])

    if jumpable(0, 0):  # 시작점이 0, 0
        print('YES')
    else:
        print('NO')

def solve():
    c = int(input())
    for _ in range(c):
        jumpgame(int(input()))

solve()
```

 참고로 입력을 한 줄씩, 즉 특정 높이(y 좌표)에 대한 가로 값(x 좌표)을
 먼저 받기 때문에, 엄밀히 말하면 이렇게 받은 입력은 `(y, x)` 형태로
 접근해야 옳다. 하지만 여기서는 갈 수 있는 방향이 아래쪽 또는
 오른쪽으로 `x` 나 `y` 값 중 하나가 증가하는 형태로만 정해지기 때문에
 굳이 구분하지 않아도 된다. 대각선을 기준으로 뒤집은 모습이 되겠지만,
 어차피 시작점이 `(0, 0)`이고 목표 지점이 `(n-1, n-1)` 인건 변하지
 않기 때문이다.
