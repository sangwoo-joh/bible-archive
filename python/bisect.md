---
layout: page
title: Bisection
parent: Python for PS
---

{: .no_toc }
## Table of Contents
{: .no_toc .text-delta }
- TOC
{:toc}

# Upper bound and lower bound
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

 참고로, 만약 `arr`에 없는 키 값으로 쿼리하면, upper bound와 lower
 bound 값이 같다. 즉, `x = 2` 이면 LB, UB 모두 1 (1과 첫번째 3 사이),
 `x = 0`일 때는 둘다 0(즉, 리스트의 첫번째 인덱스), `x = 999` 일 때는
 둘다 5 (즉, 리스트 인덱스 범위를 벗어남)가 된다.

 Pythonic 하게 설명하면,
 - Upper Bound를 ub(index)라고 한다면, `arr[:ub] <= x < arr[ub:]` 를
   만족한다.
 - Lower Bound를 lb(index)라고 한다면, `arr[:lb] < x <= arr[lb:]` 를
   만족한다.


# Bisection

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

        if x < arr[mid]:
            high = mid
        else:
            low = mid + 1
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

        if x <= arr[mid]:
            high = mid
        else:
            low = mid + 1
    return low
```
