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
