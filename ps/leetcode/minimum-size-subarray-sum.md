---
layout: page
tags: [problem-solving, leetcode, python, two-pointers]
title: Minimum Size Subarray Sum
parent: LeetCode
grand_parent: Problem Solving
nav_exclude: true
---

# [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/)
 *양수*만 담은 배열 `nums`와 양수 `target`이 주어졌을 때, 합이
 `target`보다 크거나 같게 되는 **연속되는 부분 배열** `[nums_(l),
 nums_(l+1), ..., nums_(r)]`의 최소 길이를 구하는 문제이다. 없으면
 `0`을 리턴.

## 문제 설명
 부분 배열 문제는 보통 아래 세 가지 방법이 주로 쓰이는데:
  - 투 포인터
  - 부분합을 저장한 해시맵
  - 스택

 여기서는 가변 길이 윈도우를 유지하는 투 포인터로 문제를 풀어보려고
 한다.

 예를 들어 `nums = [2, 3, 1, 2, 4, 3, 1]` 이고 `target = 7` 일 때,
 합이 최소 7이 되는 가장 작은 부분 배열은 마지막 바로 앞 부분인 `[4,
 3]`이 되고 따라서 이때의 답은 `2`가 된다.

## 가변 길이 투 포인터
 윈도우의 시작과 끝을 나타내기 위해서 `start`, `end` 인덱스를 유지할
 때, 아래 상황을 생각해 보자.

```
 0  1  2  3  4  5  6
[2, 3, 1, 2, 4, 3, 1]
 s              e
```

 즉 `start = 0`, `end = 5` 이고 이때 부분합은 `2+3+1+2+4+3=15`가
 된다. 여기서 우리는 **최소** 길이를 구해야 하기 때문에, "더 잘 할 수
 있나?" "만약 더 잘할 수 있다면, 그 다음 가능한 상태는 뭘까?" 를
 고민해야 한다. 즉,
  - 더 잘할 수 있나? -> 현재(`start` ~ `end`)까지 구한 부분 합이
    여전히 `target`보다 크거나 같은가? 이 경우에만 우리는 윈도우
    사이즈를 줄여서 최소 길이를 구하려고 시도할 수 있다. 여기서 현재
    부분합은 `15` 로 `7`보다 작기 때문에, 사이즈를 줄일 수 있다.
  - 더 잘하려면 그 다음 가능한 상태는 뭘까? -> 만약 `end` 포인터가
    먼저 `nums` 전체를 훑고 간다면 (= 윈도우 크기가 증가), 윈도우
    사이즈를 줄이기 위해서는 `start` 포인터를 증가시켜야 한다(= 윈도우
    크기가 감소). 그리고 우리는 *최소*를 원하기 때문에, 가능한 경우
    계속 윈도우 사이즈를 줄여 나가야 한다. 여기서는 부분합이 `7`보다
    큰 경우, 계속해서 `start`를 증가시켜 윈도우 사이즈를 줄이는 시도를
    해볼 수 있다.

 이 두 가지 조건을 고려하면 아래와 같이 구현할 수 있다.

```python
def min_sub_array_sum(nums, target):
    n = len(nums)
    min_len = float('inf')
    cur_sum = 0
    start, end = 0, 0

    for end in range(n):
        cur_sum += nums[end]

        # Can I do better?
        while cur_sum >= target:
            min_len = min(min_len, end - start + 1)
            cur_sum -= nums[start]
            start += 1

    return min_len if min_len != float('inf') else 0
```

 - 최소 값을 구해야 하므로 최소 길이 값을 `float('inf')`로 초기화했다.
 - `end` 포인터가 전체 배열을 훑으면서 항상 윈도우 사이즈가 큰
   방향으로 진행한다.
 - 조건인 "현재 합이 `target` 보다 크거나 같은지?"를 만족한다면,
   `start` 포인터를 계속 증가시키면서 윈도우 사이즈를 줄이고 현재 합을
   업데이트하면서 계속 이 조건을 만족하는지 확인한다. 이때, 우리는
   인덱스를 유지하고 있기 때문에 배열의 크기는 `end - start + 1` 으로
   쉽게 구할 수 있다.
 - 마지막에 조건을 한번도 만족하지 않는 경우(=여전히 `float('inf')`)
   처리해주면 된다.


# 번외: Dual
 이 문제와 Dual이 되는 문제도 생각해볼 수 있다: "`nums`와 `target`에
 대해서, 합이 `target`보다 작거나 같게되는 부분 배열의 최대 길이를
 구하라".

 이 경우는 위의 투 포인터를 조금 변형하면 다음과 같이 구현할 수 있다.

```python
def max_sub_array_sum(nums, target):
    n = len(nums)
    max_len = 0
    cur_sum = 0
    start, end = 0, 0

    for end in range(n):
        if (cur_sum + nums[end]) <= target:
            # Can I do better?
            cur_sum += nums[end]
            max_len = max(max_len, end - start + 1)
        else:
            # Constraint not satisfied. move to the next.
            cur_sum = cur_sum - nums[start] + nums[end]
            start += 1

    return max_len
```

 - 최대 값을 구해야 하므로 최대 길이 값을 `0`으로 초기화 한다.
 - 마찬가지로 `start`와 `end`를 이용하여 가변 길이 윈도우의 투
   포인터를 활용한다.
 - 단, 이전처럼 곧바로 `cur_sum`을 누적하지 않는다. 예전에는 최소
   만족해야 하는 값이 `target`이었지만, 여기서는 *아무리 커봤자*
   `target`과 같아야 하므로, 루프 안에서 업데이트 하기 전에 미리
   계산하고 만족한 경우에만 업데이트 한다.
 - 또한, *최대 길이*를 구해야 하므로, 위 조건을 만족할 때에만
   `max_len`을 업데이트 할 수 있다. 길이를 `end - start + 1`로 구할 수
   있는 부분은 동일하다.
 - 만약 값이 `target` 보다 큰 경우, "그 다음"으로 진행하는 로직이 살짝
   다른데,
   - 최소 길이가 아니라 최대의 길이를 구하는 문제이므로, 이전처럼
     `while` 루프를 돌면 **안된다**. 대신, 윈도우 사이즈를 **하나씩**
     *앞에서 부터* 줄여나갈 수 있다.
   - `cur_sum`을 업데이트 하는 방식이 다르다. `start`를 하나 증가하게
     되면 당연히 `cur_sum`에서 `nums[start]`를 빼야 한다. 추가로
     여기서는 `target`과 비교하기 전에 `nums[end]`값을 `cur_sum`에
     누적하지 않았으므로, `start`를 움직이는 부분에서 이 값까지
     고려해줘야 한다.

# 번외 2: 합이 아니라 곱이면?
 이런 문제도 생각해볼 수 있다: "합이 아니라, `nums`의 부분 배열의
 **곱**이 `target`보다 작은 부분 배열의 **개수**는 몇개일까?"

 여기서 tricky한 부분은 (1) 합이 아니라 *곱*이고 (2) 최대/최소 길이가
 아니라 전체 **개수**를 구해야 한다는 점이다.

 다음과 같은 경우를 생각해보자.

```
[10, 5, 2, 6], target = 100
```

 이때 부분 배열의 곱이 `100`보다 작은 개수를, **윈도우** 안에서
 생각해보자. 만약 윈도우가 `[10, 5]` 라고 하면, 곱이 `100`보다 작은
 부분 배열의 개수는: `[10]`, `[5]`, `[10, 5]`로 총 3개이다. 그런데 잘
 살펴보면 이 개수는 윈도우가 `[10]`일 때의 개수도 포함하고 있다. 즉,
 `[10, 5]` 윈도우 안에서 가능한 개수만 센다면 `[10, 5]`와 `[5]`가
 되고, 이는 곧 **윈도우 크기**와 일치한다.

 그렇다면 이전의 가변 길이 투 포인터 접근을 조금 변형해서 아래와 같이
 구현할 수 있다.

```python
def num_sub_array_prod(nums, target):
    if target <= 1:
        return 0

    n = len(nums)
    count = 0
    cur_prod = 1
    start, end = 0, 0

    for end in range(n):
        cur_prod *= nums[end]

        # find minimum window
        while cur_prod >= target:
            cur_prod /= nums[start]
            start += 1

        count += (end - start + 1)

    return count
```
 - Base Case를 잘 생각해야 한다. 조건이 `target`보다 **작아야** 하기
   때문에, `target`이 `1` 또는 `0`이면 어떤 양수를 곱해도 이 값보다
   작을 수 없기 때문에 답은 `0`개 이다.
 - 누적 합이 아니라 누적 곱이므로 `cur_prod`의 초기값은 `1`이다.
 - 최소 부분 배열과 유사하게, 조건을 만족하는 최소 크기의 윈도우를
   구한다. 그러고 나면 이때 가능한 부분 배열의 개수가 곧 윈도우의 크기
   이므로, 이를 누적하면 된다.
