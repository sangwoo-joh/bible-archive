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

## Palindrome

 Palindrome Substring (Subsequence가 아님!) 을 찾는 방법: 중간에서부터
 확인한다.

``` python
def count_from_center(string, left, right):
    if not string or left > right:
        return 0

    num_of_palindrome = 0
    while left >= 0 and right < len(string) and string[left] == string[right]:
        left -= 1
        right += 1
        num_of_palindrome += 1
    return (right - left - 1)
    # or, return num_of_palindrome for the number of palindromes found
```

 단순한 투 포인터를 이용한 기법이다. `left`, `right` 둘 다
 인덱스임. 이 함수를 활용하면 다음과 같이 "가장 길이가 긴
 palindrome"을 찾을 수 있다.


``` python
def longest_palindrome(string):
    if not string or len(string) < 1:
        return ''

    start, end = 0, 0  # index
    for i in range(len(string)):
        len_cand = max(count_from_center(string, i, i),
                       count_from_center(string, i, i + 1))
        if len_cand > (end - start):
            start = i - (cand - 1 ) // 2
            end = i + cand // 2

    return string[start:end + 1]
```

 - 현재 인덱스를 *중간*으로 시작해서 `right`를 `i`와 `i + 1`로 두 번씩
   호출해줘야 `aba`와 `abba` 같은 palindrome을 모두 처리할 수 있다.
 - `start`, `end`는 인덱스고 `len_cand`는 찾아낸 길이이므로 `end -
   start` 보다 길이가 크면 최대값을 업데이트하면 된다.


## DFS

| | `visiting = False` | `visiting = True` |
| --- | --- | --- |
| `visited = False` | 아직 방문하지 않음 | **싸이클** |
| `visited = True` | 불가능한 경우 | 탐색이 끝남 |


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

### 뱀발) 코드에서 알 수 있는 것
 - 파이썬은 오른쪽으로 반쯤 열린 구간 (right half-open interval)을
   사용한다. 즉, 항상 `[low, high)` 로 구간을 표시하게 되고 `low` 부터
   `high - 1` 까지가 유효한 인덱스다.
 - `mid = (low + high) // 2` 를 계산함으로써, `mid`는 항상 버림 계산을
   하게 된다. 따라서, `[low, mid)` 와 `[mid+1, high)`로 구간이
   양분되면 항상 오른쪽 구간의 크기가 더 크거나 같게 된다.



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
