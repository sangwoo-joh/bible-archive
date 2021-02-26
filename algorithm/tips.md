---
layout: default
title: Tips
permalink: /algorithm/tips
parent: Algorithm
---


{: .no_toc }
# Tips
## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}

## Bisection

### Upper Bound and Lower Bound

 정렬된 리스트 `arr`과 찾고자 하는 키 값 `x`가 있을 때,
 - Upper Bound: `x` 보다 큰 값이 처음 나오는 위치
 - Lower Bound: `x` 보다 크거나 같은 값이 처음 나오는 위치

 예를 들어, `arr = [1, 3, 3, 5, 7]` 이 있고 `x = 3` 을 키 값으로 하면,
 - Upper Bound: 처음으로 커지는 값(`5`)이 나오는 위치인 `3`
 - Lower Bound: 처음으로 크거나 같은 값(첫번째 `3`)이 나오는 위치인
   `1`

 가 되고, 이렇게 찾은 위치에 값을 삽입하면 한 칸씩 뒤로 쭉 밀리면서
 삽입된다. 그러니까, Upper Bound에는 `x` 보다 크거나 같은 값을 넣을 수
 있고, Lower Bound에는 `x` 보다 작거나 같은 값을 넣을 수 있다.

 Pythonic 하게 설명하면,
 - Upper Bound를 ub(index)라고 한다면, `arr[:ub] <= x < arr[ub:]` 를
   만족한다.
 - Lower Bound를 lb(index)라고 한다면, `arr[:lb] < x <= arr[lb:]` 를
   만족한다.

 이걸 코드로 옮기면 다음과 같다.

``` python
def bisect_right(arr, x, low=0, high=None):
    """
    The return value idx is such that all element in arr[:idx] have elt <= x,
    and all elt in arr[idx:] have x < elt.
    So if x already appears in the list, arr.insert(x) will insert just after the rightmost
    x already there.
    """

    if low < 0:
        raise ValueError('low must be positive')

    if high is None:
        high = len(arr)

    # [low, high)
    while low < high:
        mid = (low + high) // 2

        if arr[mid] <= x:
            low = mid + 1
        else:
            high = mid
    return low

```

``` python
def bisect_left(arr, x, low=0, high=None):
    """
    Return the index where to insert item x in a list arr, assuming arr is sorted.

    The return value idx is such that all element in arr[:idx] have elt < x,
    and all elt in arr[idx:] have x <= elt.
    So if x already appears in the list, arr.insert(x) will insert just after the leftmost
    x already there.
    """

    if low < 0:
        raise ValueError('low must be positive')

    if high is None:
        high = len(arr)

    # [low, high)
    while low < high:
        mid = (low + high) // 2

        if arr[mid] < x:
            low = mid + 1
        else:
            high = mid
    return low
```


## How to generate all possible substrings with specific length

``` python
def all_substrings(text: str, k: int):
    return set(text[i:i + k] for i in range(0, len(text) - k + 1))
```

 - Use slice operator. `list[start:end:stride]` means from `start` to
   `end` with each step `stride` (not including `end` because it is a
   right half-open interval). Thus, `text[i:i + k]` means a substring
   in `[i, i + k)` and this is a substring that has length `k`.
 - `range(start, end, stride)` is similar to slice. It generates a
   range `[start, end)` with step `stride`. Thus, `range(0,
   len(text) - k + 1)` will generate `[0, 1, ..., len(text) - k]`. We
   only need at most `len(text) - k` index because otherwise it
   overflows.
 - Accumulate those substrings as a set to remove duplcations.


## Comprehensions

``` python
[exp for x in sequences if ...]  # list
{exp for x in sequences if ...}  # set
{key:value for x in sequences if ...}  # dict
```

## Index of Sequences

 Python can have a negative index.
 - If an index is positive, it starts from `0` at the left most of the
   sequences.
 - If an index is negative, is starts from `-1` at the right most of
   the sequences.

``` python
sequences = ['a', 'b', 'c']
#             0    1    2    # positive
#            -3   -2   -1    # negative
```

## PowerSet

``` python
def powerset(nums):
    """
    e.g. nums = [1,2] then returns
    [[1,2],
     [1],
     [2],
     []
    ]
    """
    result = []
    partial = []

    def recurse(idx):
        if idx == len(nums):
            # finish
            result.append(partial[:])  # must be copied
            return

        partial.append(nums[idx])  # pick this item
        recurse(idx + 1)
        partial.pop()  # not pick this item
        recurse(idx + 1)

    recurse(0)
    return result
```

 - Simply use `seq[:]` to deepcopy a sequence.
