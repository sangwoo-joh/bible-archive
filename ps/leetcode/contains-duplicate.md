---
layout: page
tags: [problem-solving, leetcode, python, array]
title: Contains Duplicate
grand_parent: Problem Solving
parent: LeetCode
nav_exclude: false
---

# [Contains Duplicate](https://leetcode.com/problems/contains-duplicate/)

 정수 배열이 주어졌을 때, 최소 두 번 이상 나타나는 원소가 있는지를
 확인하자.

 배열 크기는 1~100,000 이다.

## 해시 셋

 꼼수가 통하지 않는 정통 문제다. 그냥 원소 개수를 세는 수 밖에
 없다. 여러가지 방법이 있겠지만 여기서는 해시 셋을 이용해서 개수를
 비교해보려고 한다.

```python
def containsDuplicate(nums):
    return len(nums) != len(set(nums))
```

 - 파이썬의 `len`은 O(1)이 보장되는 연산이라서 마음껏 사용하면 된다.
