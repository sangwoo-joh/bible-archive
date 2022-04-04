---
layout: page
tags: [problem-solving, python, tips]
title: Short Tips
parent: Problem Solving
---

{: .no_toc }
## Table of Contents
{: .no_toc .text-delta }
- TOC
{:toc}


# 어떤 문자열의 길이 `k`인 모든 부분 문자열 생성하기

``` python
def all_substrings(text: str, k: int):
    return set(text[i:i + k] for i in range(0, len(text) - k + 1))
```

 - 파이썬의 슬라이스를 이용해서 특정 인덱스 `i`부터 길이 `k` 만큼의
   부분 문자열을 `str[i:i + k]`로 표현할 수 있다. 인터벌 `[i, i+k)`를
   의미하므로 `i+k` 인덱스는 포함하지 않는다.
 - 시작 인덱스 범위를 계산하기 위해서 `range`를 이용하는데 이때
   `range(start, end)` 역시 `[start, end)` 인터벌을 의미하기 때문에
   `end`를 포함하지 않는다. 따라서 `end`를 `len(text)-k+1`로 해야
   `len(text) - k` 까지의 인덱스를 생성해내고, 따라서 `str[i:i+k]`에서
   `str[len(text)-k:len(text)-k+k]`가 되고 슬라이스의 `end`가
   `len(text)`가 되어 오버플로우가 나지 않는다.
 - 이렇게 생성한 부분 문자열 시퀀스를 다시 집합으로 감싸서 중복을
   제거한다.
