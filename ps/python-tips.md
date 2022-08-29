---
layout: page
tags: [problem-solving, python, tips]
title: Python Tips
parent: Problem Solving
---

{: .no_toc }
## Table of Contents
{: .no_toc .text-delta }
- TOC
{:toc}


# `map`, `filter`
 적용할 함수가 먼저 온다. 어떻게 생각하면 되냐면 `map(f, x) --> f(x)`
 라고 생각하면 된다.

```python
map(lambda x: x, seq)
filter(lambda x: return True, seq)
```

# `pow`
 세 번째 파라미터 `mod`를 넘겨주는게 직접 계산하는 것보다 효율적임.

```python
pow(base, exp, mod) == pow(base, exp) % mod
```

# `sorted`, `.sort()`
 `sorted`는 새로운 시퀀스를 만들어서 정렬하고, `sort`는 제자리
 정렬이다.

```python
seq.sort()
seq = sorted(seq)
```

 둘 다 정렬 비교에 쓰일 `key` 함수를 named parameter로 넘겨줄 수 있다.

# `all`, `any`
 모든 시퀀스 안의 원소를 **전부 다** 평가한 다음, $$ \forall $$ 또는
 $$ \exists $$ 를 계산한다. 문제는 모든 원소를 전부 다 평가하기 때문에
 Short-Circuit 최적화의 혜택을 받지 못해서 `any`는 대부분의 경우 훨씬
 느리다. `all`이 필요한게 아니거나 모든 원소가 평가될 게 아니라면
 `any`는 되도록 쓰지말자.

```python
all([True, True]) == True
all([]) == True

any([True, False]) == True
any([]) == False
```

# String
 별의 별 희한한 것까지 다 표준 라이브러리 함수로 들어있어서 구현하긴 편하다.

```python
str.isalpha(), str.isdecimal(), str.isdigit(), str.isalnum(), str.isnumeric()
str.islower(), str.isupper()
str.lower(), str.upper(), str.swapcase()
str.lstrip(), str.rstrip(), str.strip()
"abc d asdf".partition('d') == ("abc ", "q", " asdf")
str.count(substring)
str.find(substring)
```

# collections

## defaultdict

```python
from collections import defaultdict

dl = defaultdict(list)
dl[0].append(1)  # not exception!
print(dl[1])  # also not exception! shows []

di = defaultdict(int)
di[0] += 1  # not exception!
print(di[100])  # also not exception! shows 0
```

## Counter

```python
from collections import Counter
s = "aabbcacaa"
c = Counter(s)  # Counter({'a':5, 'b':2, 'c':2})
c.get('a')  # get count of the element, None if not exists -> 5
c.elements()  # ['a', ..., 'b', .. 'c']
c.keys()  # ['a', 'b', 'c']
c.values()  # [5, 2, 2]
c.items()  # [('a', 5), ('b', 2), ('c', 2)]
c.most_common()  # return a list of n most common elements and their counts
c.most_common(1)  # top most common elements as list, so [('a', 5)]
```

## Deque

```python
from collections import deque
dq = deque()
dq.append(x)
dq.appendleft(y)
dq.pop()
dq.popleft()
dq.reverse()  # in-place reverse
dq.rotate(n=1) == dq.appendleft(dq.pop())
dq.count(x)
```

# Heapq

```python
import heapq
l = [ .... some list]
heapq.heapify(l)  # make l as heap in-place
heapq.heappush(l, item)
heapq.heappop(l)
heapq.nlargest(n, l, key=None) == sorted(l, key=None, reverse=True)[:n]
heapq.nsmallest(n, l, key=None) == sorted(l, key=None)[:n]
```

# Random

```python
import random

random.choice([1, 2, 3, ...])  # pick random item
random.shuffle(l)  # shuffle l in-place
random.uniform(a, b)  # pick random **float x** in a <= x <= b
```

# Bisect

```python
import bisect

bisect.bisect_left(l, x)
bisect.bisect_right(l, x) == bisect.bisect(l, x)
```

---

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
