---
layout: page
title: Two Sum
parent: LeetCode
---

{: .no_toc }
## Table of Contents
{: .no_toc .text-delta }
- TOC
{:toc}

# Two Sum
 상징적인 리트코드 1번 문제다.

 정수 배열 `nums`와 어떤 정수 `target`이 주어졌을 때, 정수 배열의 두
 원소 중 합이 `target`이 되는 인덱스 두 개를 찾는 문제이다.

 이때, 입력은 항상 **정확히 하나**의 해를 가지며, **같은** 원소를 두
 번 쓸 수 없다. 인덱스 두 개의 순서는 상관없다.

## Brute Force
 완전 탐색으로 모든 가능한 두 개의 쌍을 다 시도해보면 찾을 수
 있다. 이렇게 하면 물론 `O(n^2)`의 복잡도가 되지만, 샘플을 통과하긴
 한다.

 ```python
def two_sum(nums, target):
    for i1, n1 in enumerate(nums):
        for i2 in range(i1 + 1, len(nums)):
            if n1 + nums[i2] == target:
                return (i1, i2)
```

## Hash Table
 문제에서 (1) 항상 유일한 답이 있고 (2) 같은 원소가 두 번 쓰이는
 경우는 없다고 했으므로, 이 조건을 이용해서 다음과 같은 해시 테이블을
 구성할 수 있다.

```
hash_table[number] = number 의 인덱스
```

 배열을 순차적으로 훑으면서, `target` 에서 현재 원소의 값을 뺀 값, 즉
 현재 원소의 *보수(complement)*를 이용해서 해시 테이블에 접근하면 바로
 답을 만들 수 있다. 다시 말해, 현재 원소의 값 `elt`에 대해서 `elt +
 (target - elt) = target` 이고 이때 `(target - elt)` 값이 `elt`의
 `target`에 대한 보수이다. 그리고 이렇게 구한 현재 원소의 인덱스와
 해시 테이블의 값이 바로 원하는 답인 두 원소 인덱스의 쌍이 된다. (이때
 같은 원소가 두 번 쓰이는 경우는 없다고 했으므로, 이 조건을 같이
 확인해줘야 한다)

```python
def two_sum(nums, target):
    comps = {}
    for i, n in enumerate(nums):
        comps[n] = i

    for i, n in enumerate(nums):
        comp = target - n
        if comp in comps and i != comps[comp]:
            return (i, comps[comp])
```

 이렇게 하면 `O(n)`의 해답을 얻을 수 있다.
