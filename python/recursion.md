---
layout: page
title: Recursion
parent: Python for PS
---

{: .no_toc }
## Table of Contents
{: .no_toc .text-delta }
- TOC
{:toc}

# Recursion
 재귀는 곧 자연수, 귀납적인 정의와 동치다.

 기저 조건에 대해서 반드시 종료되어야 하고, 모든 입력은 최종적으로
 기저 조건에 수렴해야 한다.

 함수 파라미터로 뭘 받고, 어디까지 계산한 후 다시 재귀 호출을 할지를
 명확하게 정해야 한다. 함수 형태를 잘 잡아야 올바른 재귀 함수를 짤 수
 있다.

 모든 재귀 함수는 같은 의미의 반복문으로 바꿀 수 있다. 재귀 함수는
 함수 호출 로드가 있기 때문에 메모리와 성능에서 약간 손해를 보지만
 대신 코드가 아주 간결해진다.

 재귀 함수 호출을 두 번 이상하면 아주 비효율적일 수 있다. e.g)
 피보나치. 그런데 만약 함수 자체가 idempotent 하다면, 나중에 DP로
 최적화할 여지가 많다.

## [1629번: 곱셈](https://www.acmicpc.net/problem/1629)

```python
import sys
a, b, c = map(int, sys.stdin.readline().rstrip().split())

def my_power(a, b, m):
    if b == 1:
        return a % m

    val = my_power(a, b//2, m)  # val == a^(b/2)
    val = val * val % m  # val = a^b = a^(b/2) * a(b/2)
    if b % 2 == 0:
        return val
    else:
        return val * a % m  # in case of b is an odd number

print(my_power(a, b, c))
```

 이건 반복문으로도 풀 수 있지만 재귀적으로 생각하는 훈련에 좋은
 문제이기도 하다.

 Base Case로 `a ^ 1 = a`를 깔아두었다. `a ^ 0 = 1`을 깔아도
 상관없다. 그러고나면 다음 식을 이용할 수 있다: `a ^ b = a ^ (b/2) * a
 ^ (b/2)`

 여기서는 이 정의에 충실하게 먼저 `a ^ (b/2)`인 `val`을 구하고 이걸 두
 번 곱했다. 코너 케이스로 `b`가 홀수일 때에는 `b / 2`가 나누어
 떨이지지 않기 때문에 `a ^ b = a ^ (b/2) * a ^ (b/2) * a` 를
 처리해줘야 한다.

 거의 수학적인 정의를 그대로 써주면 되지만 따라가는 훈련을 해야한다.
