---
layout: page
tags: [problem-solving, leetcode, python, array]
title: Non-decreasing Array
grand_parent: Problem Solving
parent: LeetCode
nav_exclude: true
---

# [Non-decreasing Array](https://leetcode.com/problems/non-decreasing-array/)

 정수 배열 `nums`가 주어진다. 여기서 딱 하나의 원소만 바꿔서 배열이
 오름차순(non-decreasing)이 되는지 확인하자.

 여기서의 오름차순은 모든 인덱스 `i`에 대해서 `nums[i] <= nums[i+1]`이
 성립함을 뜻한다.

 배열의 크기는 1~10,000 이고 배열의 값은 -100,000~100,000 사이이다.

 예를 들어, `[4, 2, 3]`의 경우 첫 번째 원소인 `4`를 `2`보다 작거나
 같은 값으로 바꾸면 전체 배열이 되므로 참이다.

## 스택...

 인접한 원소 사이에서 오더를 유지할 수 있는 방법 중 내가 떠올릴 수
 있는 가장 단순한 방법은 스택이라서, 스택으로 접근해보았다.

 일단 유지하려는 불변식은 **스택이 오름차순**이라는 것이다. 이 성질을
 유지하면서 배열 원소를 스택에 차례로 푸시한다. 그러다가 이 성질이
 처음으로 위겨지는 시점이 원소를 바꿔야 하는 시점(여기서는 단순히
 제거해도 된다)이다.

 어떤 원소를 제거해야 오름차순이 유지되는지 보려면 다음 세 가지
 케이스를 확인해야 한다. 일단 스택에서 꺼낸 탑을 `top`이라고 하자.

### 1) 스택이 빈 경우
 인덱스 (0, 1)에서만 발생한다. `nums[0] > nums[1]`인 경우이다. 이때는
 `top`(`nums[0]`)을 버리고 지금 값(`nums[1]`)을 취해야 한다. 따라서
 현재 값을 스택에 푸시한다.

 예를 들면 입력이 아래와 같을 때:

```
[4, 2, 3]
```

 `stack = [4] , i = 1`일때 `stack[-1] > nums[i]` (4 > 2) 라서 일단 4가
 pop 된다.  그러면 stack이 비게 되므로, 2를 stack에 푸시해야 한다.

### 2) `stack[-1] <= nums[i]`인 경우
 `top`을 빼면 오더가 유지된다는 의미이다. 현재 값을 푸시해야 오더가
 맞는다. 역시 현재 값을 푸시한다.

 예를 들어 다음과 같은 경우:

```
[2, 5, 3, 4]
```


 `stack = [2, 5], i = 2`일때 `stack[-1] > nums[i]` (5 > 3) 라서 일단
 5가 pop 된다. 그러면 남은 스택을 기준으로 `stack[-1] <= nums[i]` (2
 <= 3) 으로 오더가 유지되므로, pop된 5가 범인이다.

### 3) `stack[-1] > nums[i]`인 경우
 `top`을 넣어야 오더가 유지될지도 모른다는 의미이므로, `nums[i]`를
 버리고 `top`을 푸시해야 한다.

 예를 들어 다음 경우:

```
[3, 4, 2, 3]
```

 `stack = [3, 4], i = 2`일때 `stack[-1] > nums[i]` (4 > 2) 라서 일단
 4가 pop 된다. 그러면 남은 스택을 기준으로 `stack[-1] > nums[i]` (3 >
 2) 이므로, `nums[i]`가 후보가 아니다. 이럴 경우 명백히 후보가 아닌
 `nums[i]`를 버리고, 이전의 후보 `top`을 다시 복원(스택에 푸시)해서
 이후 범위를 살펴봐야 한다.

 (마지막에 `3`은 다시 위의 조건에 걸리기 때문에 최종적으로는
 `False`임을 알 수 있다.)

---

 결국 위의 아이디어를 정리하면, **꺾이는 구간**을 찾고 어디서부터
 연결해야 하는지를 살펴보는 것이다. 꺾이는 구간을 `[a, b, c]` (`a <=
 b, b > c`) 라고 한다면, `b`를 버릴지(케이스 1, 2) 아니면 `c`를
 버릴지(케이스 3)을 나눠서 생각하면 되는 것이다.

 이 아이디어를 구현하면 다음과 같다.

```python
def checkPossibility(nums):
    stack = [nums[0]]
    popcount = 0
    for num in nums[1:]:
        if stack[-1] <= num:
            stack.append(num)
        else:
            if popcount > 1:
                return False
            top = stack.pop()
            popcount += 1
            if not stack or stack[-1] <= num:
                # drop top
                stack.append(num)
            else:
                # drop num
                stack.append(top)
    return True
```

 이렇게 `O(N)`의 솔루션을 얻을 수 있다.
