---
layout: default
title: LRU Cache
parent: LeetCode
---

{: .no_toc }
# LRU Cache
## Table of Contents
{: .no_toc .text-delta }

 - TOC
{:toc}

 말 그대로 LRU Cache를 만드는 문제다.

 LRU 캐시는 아래 성질을 만족한다:
  - `capacity` 만큼의 캐시 사이즈를 유지한다.
  - `get(key)`, `put(key, value)` 메소드가 호출될 때 마다 `key` 값에
    해당하는 캐시는 가장 최근에 사용한 친구로 기록된다.
  - `put`이 호출될 때 캐시 사이즈가 넘치게 되면, 가장 안쓰이는 친구가
    방출되어야 한다.

## Pythonic Way
 파이썬에는 순서를 유지하는 해시맵인 `OrderedDict`가
 제공된다. 내부적으로는 key-value 쌍을 유지하는 일반적인 해시맵과,
 맵핑의 순서를 기록하기 위한 더블 링크드 리스트, 그리고 빠른 검색을
 위해서 key-노드 해시맵을 갖고 있다.

 이를 이용하면 다음과 같이 쉽고 빠르게 LRU Cache를 구현할 수 있다.

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key, last=False)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        self.cache[key] = value
        self.cache.move_to_end(key, last=False)
        if len(self.cache) > self.cap:
            self.cache.popitem(last=True)
```

 - 캐시의 최대 크기 `cap`과 순서를 기록하는 해시맵 `cache`을 초기화
   한다.
 - `get`, `put`이 호출될 때 마다 `move_to_end(key, last=False)`를
   호출해서 `key` 값을 가장 앞(최근) 순서로 업데이트 한다.
 - `put` 하고 나서 캐시 최대 크기를 초과했으면, `popitem(last=True)`를
   호출해서 가장 뒤(안쓰이던) 아이템을 방출한다.
