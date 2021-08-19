---
layout: page
title: Generate All Possible Substrings
parent: Python for PS
---

{: .no_toc }
## Table of Contents
{: .no_toc .text-delta }
- TOC
{:toc}


# Generate all possible substrings with specific length

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
