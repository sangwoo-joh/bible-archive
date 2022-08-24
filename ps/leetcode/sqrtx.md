---
layout: page
tags: [problem-solving, leetcode, python, binary-search]
title: Sqrt(x)
grand_parent: Problem Solving
parent: LeetCode
nav_exclude: false
---

# [Sqrt(x)](https://leetcode.com/problems/sqrtx/)

 음이 아닌 정수 `x`가 주어졌을 때, `x`의 제곱근을 구하자.

 제곱근이 실수일 때 정수값만 남기고 다 짤라서 리턴하자.

 당연하지만 내장함수 쓰면 안된다.

 $$ 0 \leq x \leq 2^{31} - 1 $$ 이다.

## 정직하게 제곱근 구하기

 제곱도 아니고 제곱근을 어떻게 구할 수 있을까? 다행히 구해야 하는
 제곱근이 **정수**라서 다음 성질을 이용할 수 있다: 어떤 수 `x`의
 제곱근 `y`에 대해서, $$ y ^ 2 = x $$ 이다. 너무 당연한 사실이지만
 이를 이용해서 다음과 같이 정직한 방법으로 구할 수 있다.

```python
def mySqrt(x):
    y = 0
    while y * y <= x:
        y += 1
    return y - 1
```

 `while` 루프를 빠져나가는 순간 `y * y > x`가 되기 때문에, 실제 원하는
 값은 `y - 1`인 것에만 주의하면 된다.

 단, `x`의 범위가 32비트 양의 정수이기 때문에, 이렇게 하면 겁나
 느리다.

## 좀더 빠르게 이분 탐색

 좀더 빠른 방법을 고민해보자. 먼저 $$\sqrt{0}$$은 0, $$ \sqrt{1} $$ 은
 1이므로 바로 리턴할 수 있다. 2 이상의 수 `x`에 대해서 고민해보자. 2와
 `x` 의 **범위**에 $$ \sqrt{x} $$가 있을 것이다. 따라서 이 사이의
 범위를 이분탐색할 수 있을 것 같다. 범위 사이에서 중간값 `mid`를
 꼽았다고 해보자. 이게 `x`의 제곱근인지 알려면, 앞의 정직한 방법에서
 썼던 것을 그대로 쓰면 된다: `mid * mid == x` 인지 체크해보면
 된다. 만약 더 크다면? `mid`를 기준으로 더 작은 범위를 봐야
 한다. 반대로 `mid * mid < x`라면 `mid`를 기준으로 더 큰 범위를 봐야
 한다.

```python
def mySqrt(x):
    if x <= 1:
        return x
    low, high = 2, x
    while low < high:
        mid = low + (high - low) // 2
        if mid*mid > x:
            high = mid
        elif mid * mid < x:
            low = mid + 1
        else:
            return mid
    return low - 1
```

 - `x`가 32비트 범위를 꽉 채우고 있어서 `mid`를 계산하는 도중에
   오버플로우가 날 수 있다. 따라서 `(low + high) // 2`가 아니라 `low +
   (high - low) // 2`를 계산하는 것이 더 좋다.
 - 보면 알겠지만 나는 `low`는 인덱스, `high`는 인덱스 **다음**인
   이른바 **half-open range**를 선호한다. 즉, 이분하는 범위는 `[low,
   high)`이다. 따라서 이를 업데이트할 때에도 이 성질을 유지하도록
   한다.
 - `mid * mid == x`일 때에는 당연히 `mid`가 답인 것을 알겠지만, 루프를
   빠져나왔을 때에는 어떻게 될까? 조건이 `low >= high`가 되므로, 아마
   `low == high`가 되는 순간 빠져나오게 될 것이다. 즉, `[0, 0)`과 같이
   빈 범위가 된다. 이때의 `low` (또는 `high`) 값은 우리가 원하는
   범위를 벗어난 정수 값이므로, 이전과 마찬가지로 1을 빼줘야 원하는
   값을 얻을수 있다.
