---
layout: page
tags: [problem-solving, leetcode, python, hash-table]
title: Two Sum
grand_parent: Problem Solving
parent: LeetCode
nav_exclude: true
---

# [Two Sum](https://leetcode.com/problems/two-sum/)
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


# [Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)

 만약 입력으로 들어온 배열이 **정렬**되어 있다면 어떻게 할 수 있을까?
 물론 위에서 했던 접근법을 그대로 사용해도 `O(n)`의 시간 복잡도를 얻을
 수 있다. 하지만 해시 테이블을 준비해야하기 때문에 공간 복잡도 역시
 여전히 `O(n)`이다. 정렬되어 있다는 성질을 활용하면 시간 복잡도는
 그대로 `O(n)`이지만 공간 복잡도 `O(1)`의 접근을 할 수 있다.

 일종의 이분 탐색을 한다고 생각해보자. 두 개의 포인터를 두고 하나는
 0부터, 다른 하나는 끝에서부터 출발한다. 만약 이 두 위치의 값의 합이
 구하고자 하는 값이라면 그냥 바로 리턴해도 된다. 만약 이 합이 더
 작다면? 둘 중 더 작은 값을 좀더 큰 값으로 바꾸는 방법만 존재하므로
 0에서 시작한 포인터를 옮긴다. 합이 더 크다면 반대로 더 큰 값을 좀더
 작은 값으로 바꾸는 방법만 존재하므로 이때는 끝에서 시작한 포인터를
 옮긴다.

 이 아이디어를 코드로 옮기면 다음과 같다.

```python
def twoSumII(numbers, target):
    low, high = 0, len(numbers)-1
    cand = 0
    while low < high:
        cand = numbers[low] + numbers[high]
        if cand == target:
            return [low+1, high+1]  # the problem is 1-indexed.
        elif cand < target:
            low += 1
        else:
            high -= 1

    raise ValueError
```
