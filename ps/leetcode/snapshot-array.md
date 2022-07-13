---
layout: page
tags: [problem-solving, leetcode, python, array, binary-search]
title: Snapshot Array
grand_parent: Problem Solving
parent: LeetCode
nav_exclude: true
---

# [Snapshot Array](https://leetcode.com/problems/snapshot-array/)

 다음 인터페이스를 지원하는 스냅샷 배열 클래스를 구현하자.
 - `SnapshotArray(int length)`: 주어진 길이 만큼의 스냅샷 배열을
   초기화 한다. 모든 원소의 값은 0이다.
 - `void set(int index, int val)`: `index` 위치의 원소의 값을 `val`로
   업데이트한다.
 - `int snap()`: 지금 배열의 스냅샷을 찍고 `snap_id`를
   리턴한다. `snap_id`는 배열이 생성되고 나서 `snap()` 함수가 호출된
   총 횟수에서 1을 뺀 값이다.
 - `int get(int index, int snap_id)`: 주어진 `snap_id`에서의 `index`
   위치의 원소 값을 돌려주자.


 길이는 1 ~ 50,000 사이이고 최대 50,000번의 `set`, `snap`, `get` 함수
 호출이 이루어진다. 모든 `index`는 $$ 0 \leq index \leq length $$임이
 보장되고 `snap_id` 역시 이때까지 호출한 `snap()` 수를 넘지 않는
 유효한 아이디임이 보장된다. 각각의 값은 0부터 $$10^9$$ 사이이다.

## 해시 테이블..? 이분 탐색!
 가장 무식하게는 스냅샷이 찍힐 때마다 배열을 통째로 복사하는 방법이
 있지만, 당연하게도 메모리 초과 에러가 난다.

 그 다음 아이디어는 스냅샷 아이디를 키 값으로 해서 거기에 스냅샷의
 값을 매달아두는, 해시 테이블의 배열을 만들려고 했다. 파이썬 타입으로
 치자면 `List[Dict[int, int]]`쯤 되겠다. 하지만 이렇게하면 `get()`에서
 `index`로 해시 테이블을 찾아가더라도 `snap_id`를 곧바로 찾을 수 없는
 경우가 있다. 예를 들어 길이가 2인 경우 초기 상태는 `[{-1:0},
 {-1:0}]`일텐데, 곧바로 `snap()` 후 `get(0, 0)`을 하면 해시 테이블
 키에 쿼리로 주어진 `snap_id` 0이 없기 때문에 O(1)만에 찾을 수
 없다. 일일이 키 값을 거꾸로 찾아가면서 `snap_id`보다 작은 것 중에서
 가장 큰 값을 찾아야 한다. 이렇게 하니 타임아웃이 난다.

 여기서는 이분 탐색의 아이디어를 활용한다. 일단 스냅샷 배열의 타입은
 배열의 배열로, `List[List[Tuple[int, int]]]`가 된다. 바깥 배열은
 `index`로 접근 가능하다. 안쪽 배열은 `(스냅샷 아이디, 값)`의 튜플을
 가진 배열로, `set()`이 호출될 때마다 끝부분에 추가된다. 이렇게하면
 [이분 탐색](../../theory/bisect)의 아이디어를 빌려, 가장 최근
 스냅샷의 가장 최근에 추가된 값은 `snap_id`를 이용해서 찾은 Upper
 Bound 바로 직전 위치에 있게 된다.

 예를 들어, 길이가 5인 배열에 차례로 `set(1, 10)`, `snap()`, `set (1,
 100)`, `set(1, 999)`, `snap()`, `snap()`, `set(1, 10)`를 했다고 하면
 다음과 같은 상태가 된다.

```python
[
 [(-1,0)],                                     # index 0
 [(-1,0), (0,10), (1,100), (1,999), (3,10)],   # index 1
 [(-1,0)],                                     # index 2
 [(-1,0)],                                     # index 3
 [(-1,0)],                                     # index 4
]
```

 즉, 안쪽 배열의 원소는 스냅샷 아이디를 기준으로 *증가하는 순서*로
 정렬되어 있게 된다. 이 상태에서 `get(1, 1)`을 해보자. `(1,100)`과
 `(1,999)` 두 개중 더 뒤에 있는 것이 진짜 스냅샷이다. 즉, 스냅샷
 아이디 1의 Upper Bound 바로 직전 위치이다. 비슷하게 `get(1, 2)`도
 마찬가지이다. 실제로는 스냅샷 2에는 아무런 값도 추가되지 않았기
 때문에 2보다 작은것 중에서 가장 큰 스냅샷 아이디를 찾아야 하는데,
 이게 바로 2의 Upper Bound 바로 직전 위치가 된다.

 이 아이디어를 구현하면 다음과 같다.

```python
import bisect
class SnapshotArray:
    def __init__(self, length):
        self.snap_id = -1
        self.array = [[(-1, 0)] for _ in range(length)]

    def set(self, index, val):
        self.array[index].append((self.snap_id, val))

    def snap(self):
        self.snap_id += 1
        return self.snap_id

    def get(self, index, snap_id):
        snap_id = bisect.bisect_right(self.array[index], (snap_id, )) - 1
        return self.array[index][snap_id][1]
```

 - `snap_id`의 초기값은 `-1`이다. 문제의 정의에 따라 이 값은 `snap()`
   함수가 호출된 **횟수 빼기 1**이고, 따라서 처음에는 한번도 호출되지
   않았기 때문에 `0 - 1 = -1`이다. 따라서 `array`의 각 인덱스 배열에
   추가되는 튜플의 `snap_id` 역시 -1로 초기화해준다.
 - `set`, `snap`은 문제 정의를 그대로 구현했다.

 `get`이 바로 이 구현의 핵심이다. 위에서 설명한 것처럼 `snap_id`의
 Upper Bound의 바로 직전 위치가 우리가 찾고자 하는 스냅샷의
 위치이다. 여기에 굉장히 tricky한 부분이 있어서 추가로 설명을 하려고
 한다. 초기에는 `snap_id`가 `-1`이다. 이 상황에서 `set(0, 5)` ->
 `snap()` -> `set(0, 6)` -> `get(0, 0)` 순으로 호출되었다고
 하자. 그러면 인덱스 0은 다음 상태이다.

```
[(-1,0), (-1,5), (0,6)]
```

 이때 주의할 것은 `snap()`을 호출해서 리턴하는 스냅샷의 아이디는,
 **`snap()`이 호출되기 전 스냅샷에 대한 아이디**라는 것이다. 즉, 위의
 함수 호출에서 `snap()`은 딱 한번 호출되었으므로 `0`이 되고, 이 스냅샷
 아이디 `0`을 갖는 값들은 `(-1, 0)`과 `(-1, 5)`이다. 따라서, 문제의
 조건에 맞게 구현하려면 아래 두 가지 중 하나를 해야 한다:
 - 애초에 `set` 할 때 `self.snap_id + 1`을 스냅샷 아이디로 기록하기:
   이렇게하면 초기 스냅샷 아이디가 `-1`이므로 `set()` 될 때마다 `(0,
   value)`가 추가되고, `snap()` 하는 순간 `+1` 한 아이디인 `0`으로
   스냅샷이 찍히므로 올바르게 된다.
 - `get` 할 때의 쿼리 `snap_id` 보다 1 작은 값을 찾기: 쿼리에 쓰이는
   스냅샷 아이디와 저장에 쓰인 아이디가 1 차이 난다는 것을 알고 `get`
   할 때에만 처리해주는 방식이다.

 여기서는 두 번째 방법을 택했는데, 추가로 파이썬의 튜플 비교 시맨틱을
 활용했다. 파이썬에서 파이썬의 튜플은 Element-wise 하게 비교하는데,
 길이가 서로 다른 튜플을 비교하게 되면 **더 짧은 쪽이 항상 더
 작다**. 즉, `(1, 100)`을 `(1, )`와 비교하게 되면 항상 `(1, ) < (1,
 100)`이 성립한다. 즉, `(snap_id, )`라는 튜플의 위치가 항상
 `(snap_id - 1, some-value)`보다는 크지만 `(snap_id + 1,
 some-value)`보다는 작다는 것을 활용하면, `(snap_id, )`의 Upper
 Bound를 구하면 우리가 원하는 두 번째 방법을 만족한다는 것을 알 수
 있다. 즉, `get(0, 0)`은 `[(-1,0), (-1,5), (0,6)]` 에서 `(0, )`의
 Upper Bound인 `(0,6)`의 바로 직전 위치인 `(-1,5)`를 올바르게 찾을 수
 있다.
