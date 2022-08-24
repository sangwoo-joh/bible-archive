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
 - 그냥 셈

```python
def containsDuplicate(nums):
    return len(nums) != len(set(nums))
```
