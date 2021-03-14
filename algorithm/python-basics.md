---
layout: default
title: Python Basics
permalink: /algorithm/python-basics
parent: Algorithm
---

{: .no_toc }
# Tips
## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}

Can't put off anymore.

# Built-in Functions

- `all(iterable)`: 전부다 `True` 이거나 시퀀스가 비었으면 `True`
- `any(iterable)`: 하나라도 `True` 이면 `True`
- `chr(i)`: 정수 `->` 유니코드 캐릭터
- `ord(c)`: 유니코드 캐릭터 `->` 정수
- `filter(function, iterable)`: `(item for item in iterable if
  function(item))` or `(item for item in iterable if item)` (if
  `function` is `None`)
- `float([x])`: `Infinity`, `inf` 로 최대값 설정 가능, `nan` 으로 NaN
  설정 가능
- `map(function, iterable, ...)`: `(function(item) for item in
  iterable)`. 뒤에 iterable이 여러개 나오면 `(function(item1, item2,
  ..) for item1, item2, .. in zip(iterable1, iterable2, ..))`과 같음.
- `max(iterable)` or `max(x1, x2, ...)`: 최대값. 빈 시퀀스가 들어오면
  ValueError. `min` 도 동일함.
- `pow(base, exp)`: `base ** exp`와 동일. `pow(base, exp, mod)` 는
  `pow(base, exp) % mod` 와 동일 (더 효율적).
- `sorted(iterable, key=None, reverse=False)`: 오름차순으로 정렬해서
  *시퀀스*를 직접 돌려줌. iterator가 아님!
- `reversed(seq)`: 시퀀스를 뒤집어서 iterator를 반환함. 쓸려면
  `list()`로 변환해야 됨.
- `range(start, stop[, step])` or `range(stop)`: `[start, stop)` 또는
  `[0, stop)` 범위의 불변 시퀀스를 리턴함.
- `zip(*iterables)`: 여러 시퀀스의 같은 인덱스 원소를 튜플로 묶어주는
  제너레이터를 만들어줌. 길이가 가장 짧은 애한테 맞춰짐.


# Built-in Types

 - `False` 로 해석되는 애들: `None`, `0`, `0.0`, `0j`, `Decimal(0)`,
   `Fraction(0, 1)`, `''`, `()`, `[]`, `{}`, `set()`,
   `range(0)`. 얘네말곤 전부 `True` 임.
 - `not`은 연산자 우선순위가 낮아서 `not a == b` 는 `not (a == b)`랑
   같고, `a == not b`는 문법적으로 틀리다.

## Sequence Types - list, tuple, range
 list는 가변 시퀀스다. 그래서 `list.foo()` 를 호출하면 원래 리스트가
 변한다. 그리고 가변 시퀀스라서 아래 연산이 가능함:
  - `s[i] = x`
  - `s[i:j] = t` (이때 t는 iterable)
  - `del s[i:j]` (`s[i:j] = []`)
  - `s.append(x)` (`s[len(s):len(s)] = [x]`)
  - `s.extend(t)` (`s += t`, `s[len(s):len(s)] = t`)
  - `s.insert(i, x)` (`s[i:i] = [x]`)
  - `s.pop()` (`del s[-1]`)
  - `s.pop(i)` (` del s[i]`)
  - `s.remove(x)`
  - `s.reverse()`
  - `s.clear()` (`del s[:])`
  - `s.copy()` (`s[:]`)

 추가로 아래 연산이 가능하다:
  - `s.sort()` (`s = sorted(s)`)

## Text Sequence Type - str
 str은 불변 시퀀스다. 그래서 위의 가변 시퀀스에 가능한 연산은 다
 안된다. 또한 `str.foo()` 를 호출하면 원래 문자열이 바뀌는게 아니라,
 새로운 문자열이 리턴되므로 함수 호출 결과 시퀀스를 유지하려면 다른
 변수에 저장해야한다. 아래 연산이 가능하고, 모두 새 문자열의 복사본을
 리턴한다:
  - `str.capitalize()`: 첫글자를 대문자로
  - `str.center(width[, fillchar])`: width 만큼 공백문자 또는
    `fillchar`로 채우면서 원래 문자를 중앙에 위치시킨다.
  - `str.count(sub[, start[, end]])`: sub 문자열 개수를 센다. `start`,
    `end`로 범위 지정도 가능함.
  - `str.endswith`, `str.startswith`: suffix / prefix를 체크한다. 역시 범위
    지정 가능.
  - `str.find(sub[, start[, end]])`: 처음으로 발견되는 sub 문자열의
    시작 인덱스를 리턴한다. 없으면 -1.
  - `str.isalnum()`: alpha-numeric 이면 `True`
  - `str.isalpha()`: alphabetic 이면 `True`
  - `str.isdecimal()`: decimal 이면 `True`
  - `str.isdigit()`: 숫자면 `True`
  - `str.islower()`, `str.isupper()`, `str.swapcase()`: trivial
  - `str.join(iterable)`: `str`을 구분자로 해서 iterable 안의 문자열을
    순서대로 합쳐서 하나로 만든다. 아주 유용함.
  - `str.lstrip()`, `str.rstrip()`, `str.strip()`: 순서대로
    앞/뒤/양쪽에서 문자열을 제거한다. 직접 특정 문자열 (e.g. `\t`)를
    제공할 수도 있고, 아니면 디폴트로 공백을 제거한다.
  - `str.partition(sep)`: `sep` 문자가 처음으로 나타나는 곳을 기준으로
    분할해서 3-tuple을 만든다. 중간이 `sep` 이다. `sep`이 없으면
    처음에 원래 문자가 담긴다.
  - `str.replace(old, new[, count])`: `old` 문자열을 `new`로
    바꾼다. `count`가 주어지면 앞에서 `count` 개수만큼만 바뀐다.
  - `str.rindex`, `str.rfind`, `str.rpartition`: 각각 reverse 버전
  - `str.ljust(width)`, `str.rjust(width)`: `center`의 앞/뒤 버전
  - `str.split(sep=None, maxsplit=-1)`: 문자를 `sep` 기준으로 쪼개서
    리스트로 반환한다. 디폴트 `sep`은 연속된 공백이다. `maxsplit`은
    앞에서부터 최대 몇개까지 쪼갤건지를 정해준다.
  - `str.splitlines()`: 뉴라인이나 캐리지리턴같은 줄바꿈 문자를
    기준으로 쪼개준다.
  - `str.title()`: 제목 형식으로 만들어준다. 이게 뭔 말이냐면, 공백을
    기준으로 단어가 분리되있으면 단어의 첫 단어를 대문자로 만들어준다.

## Mapping Types - dict
 가변 오브젝트다. 해시 테이블로 구현되어 있으므로 키 값은 해싱이
 가능해야 한다.
  - `list(d)`: 키의 리스트
  - `len(d)`: 아이템 개수
  - `d[key]`, `d[key] = value`, `del d[key]`: trivial
  - `key in d`, `key not in d`: 키가 있는지/없는지 검사
  - `d.items()`: `(key, value)` 튜플의 리스트를 반환
  - `d.setdefault(key[, default])`: `key`가 있으면 거기에 매칭되는
    `value`를 리턴하고, 없으면 `default` 밸류로 맵핑함과 동시에 이
    값을 돌려준다. 디폴트 값은 `None`
  - `d.update({key: value, ..})`, `d.update(**kwargs)`: `key: value`
    맵핑을 덮어쓴다. 없으면 추가한다. 참고로 `**kwargs`로 넘기면
    자동으로 문자열 키로 바꿔준다.

# Data Types

## collections - Container Data Types

### OrderedDict
 순서를 기억하는 해쉬 테이블. LRU 캐시만들 때 완벽한 솔루션이다 (공식
 문서에도 대놓고 LRU 캐시 예제가 링크되어 있다). 기본적으로 일반
 딕셔너리랑, 순서를 기억하는 더블 링크드 리스트랑, set/get 시에 더블
 링크드 리스트 노드를 빠르게 찾기 위한 키->노드 해시 테이블로
 구성된다. 링크드 리스트는 [Sentinel
 Node](https://en.wikipedia.org/wiki/Sentinel_node)로 구현해서 검사를
 쉽게 한다.

 기본적으로 dict가 제공하는 거랑 함수가 같다. 딱 두개 추가된다.

 - `od.move_to_end(key, last=True)`: `key` 값의 맵핑의 순서를 제일
   끝으로 옮긴다. `last=True`이면 제일 뒤로 옮기고 아니면 제일 앞으로
   옮긴다. 디폴트로 `od[key] = value` 하면 `last=True`와 동일하다.
 - `od.popitem(last=True)`: 가장 뒤에 있는 맵핑을
   삭제한다. `last=False` 이면 가장 앞을 삭제한다.

 따라서 LRU 캐시에서는 항상:
  - 키 값에 접근(get/set) 할 때마다 `move_to_end`를 호출해준다. 이러면
    최근에 사용한 아이템들은 항상 순서의 제일 마지막 근처에 위치하게
    된다.
  - 캐시 사이즈가 넘치면, `popitem(last=False)`를
    호출한다. `move_to_end`가 디폴트로 `last=True` 이므로 (즉 최근에
    사용한 애들은 제일 뒤로 가므로), 제일 앞쪽에 있는 아이템이 가장
    최근에 사용하지 않은 (Least Recently Used) 아이템이다.

### defaultdict
 dict 에서 맵핑이 없어도 초기값을 제공해준다. 정확히는, `KeyError`
 예외가 발생하면, `__missing__(key)` 함수를 호출해서 디폴트 값을
 지정하는 원리이다. 기본은 `None`으로 설정된다.

 그래프나 문자열 문제를 풀 때 `defaultdict([])` 혹은
 `defaultdict(set())` 로 지정하면 풀기 편하다.

### deque
 일반 리스트를 큐처럼 사용할 수 있긴 하다. 단, 효율적이지 못하다. 특히
 큐에서 아이템을 pop 하는 연산은 `list.pop(0)`이 될텐데, 이는 전체
 리스트(CPython 구현은 가변 배열)를 한칸 시프트 해야 하기 때문에
 `O(N)`이 걸린다. 바람직하지 않다.

 이런 경우에 사용할 수 있는게 바로 `deque`다. 참고로 CPython에는 C
 코드의 더블 링크드 리스트로 구현되어 있다. 그러니 맘편히 갖다 쓰면
 된다. 아래 함수를 제공한다.
 - `dq.append(x)`: right side
 - `dq.appendeft(x)`: left side
 - `dq.clear()`
 - `dq.copy()`: shallow copy
 - `dq.count(x)`
 - `dq.extend(iterable)`: right side
 - `dq.extendleft(iterable)`: left side
 - `dq.index(x)`
 - `dq.insert(i, x)`
 - `dq.pop()`: remove & return the right-most side
 - `dq.popleft()`: remove & return the left-most side
 - `dq.reverse()`: in-place reverse
 - `dq.rotate(n=1)`: 오른쪽으로 `n` 스텝만큼 회전한다. 음수면 왼쪽
   회전. 양수일 경우 `dq.appendleft(dq.pop())` 과 같다. 음수면
   `dq.append(dq.popleft())`
 - `dq.maxlen`: 큐의 최대 크기. 처음 생성할 때 `deque(maxlen=N)`으로
   설정할 수 있다. 이거 넘어가는 순간 다 삭제된다. 따라서 LRU 캐시를
   deque로 구현할 수도 있다.


# heapq
 힙을 구현하는 가장 쉬운 방법 중 하나인 배열을 이용한 최소 힙을 구현한
 것이다.

 아래 invariant를 유지한다:

```python
heap[k] <= heap[2*k + 1] and heap[k] <= heap[2*k + 2]
```

 - 이때 인덱스는 0부터 시작한다.
 - 부모 노드 인덱스는 `(k-1) // 2` 로 구할 수 있다.
 - 파이썬은 최소힙만 제공한다. 따라서 최대힙을 하려면 비교 연산 결과를
   뒤집어서 쓰면 된다.

  아래 함수들을 제공한다. 참고로 `heapq` 라는 타입을 따로 제공하는게
  아니라, 그냥 있는 리스트에서 힙 연산을 제공하는 것이다.
  - `heapq.heapify(x)`: 리스트 x를 힙으로 변환한다 (in-place).
  - `heapq.heappush(heap, item)`: heap에 item을 추가한다.
  - `heapq.heappop(heap)`: heap에서 최소 값 (`heap[0]`)을 반환하면서
    삭제한다.
  - `heapq.nlargest(n, iterable, key=None)`: n개의 가장 큰 원소를 담은
    리스트를 반환한다. key 함수는 비교할 때 쓰일 키를 *추출*하는
    용도로 쓰인다 (e.g. `key=str.lower`). 이 함수의 결과는
    `sotred(iterable, key=key, reverse=True)[:n]`과 동일하다.
  - `heapq.nsmallest(n, iterable, key=None)`: n개의 가장 작은 원소를
    담은 리스트를 반환한다. `sorted(iterable, key=key)[:n]`과
    동일하다.

 참고로 마지막 두 함수인 `nlargest`와 `nsmallest`는 n이 작아야 잘
 동작한다. n이 크면 (=거의 모든 정렬된 리스트를 가져 올 거면) 그냥
 정렬하는게 낫다. `n==1`이면 그냥 min/max를 쓰는게 낫다. 반복적으로
 쓸때만 iterable에 실제 힙을 넘기는게 좋다.
