---
layout: page
tags: [problem-solving, leetcode, python, math]
title: Ugly Number
parent: LeetCode
grand_parent: Problem Solving
nav_exclude: false
---

# [Ugly Number](https://leetcode.com/problems/ugly-number/)

 **못생긴 숫자**란 소인수가 오직 2, 3, 5로 한정되는 양의 정수를
 뜻한다.

 어떤 수 `n`이 주어졌을 때 이게 못생긴 숫자인지 판단하자.

 예를 들어, 6은 소인수가 2와 3 뿐이므로 못생긴 숫자이다. 1은 소인수가
 없으므로 그 자체로 못생긴 숫자이다. 반면 14는 소인수 7을 포함하므로
 못생긴 숫자가 아니다.

 입력의 범위는 32비트 정수 전체이다.

## 정직하게 구현하기
 - 문제의 조건을 잘 읽고 정직하게 잘 구현하면 되는 문제다.
 - 일단 조건에 따라 *양의 정수*이므로 0보다 작거나 같은 모든 수는
   초장에 제외해버릴 수 있다.
 - 소인수 목록 2, 3, 5에 대해서 이제 `n`이 나누어 떨어지는 동안 계속
   그 수로 나눠준다.
 - 최종적으로 남은 수 `n`이 1이면 2, 3, 5로만 모두 나누어떨어졌다는
   의미이고 1이 아니면 다른 소인수가 있다는 의미이다.

```python
def isUgly(n):
    if n <= 0:
        return False
    for p in [2, 3, 5]:
        while n % p == 0:
            n = n // p
    return n == 1
```
