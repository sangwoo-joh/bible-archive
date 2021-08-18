---
layout: page
title: Palindrome
parent: Python for PS
---

{: .no_toc }
## Table of Contents
{: .no_toc .text-delta }
- TOC
{:toc}

# Palindrome

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
