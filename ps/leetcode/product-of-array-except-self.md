---
layout: page
tags: [problem-solving, leetcode, python, array]
title: Product of Array Except Self
grand_parent: Problem Solving
parent: LeetCode
nav_exclude: false
---

# [Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/)

 정수 배열이 주어졌을 때, 다음 조건을 만족하는 새로운 배열을 만들자:
 - i 번째 원소는 i 번째 원소 자신을 제외한 모든 수의 곱과 같은 값

 모든 곱은 32비트 정수 안에 표현되는 것이 보장된다.

 알고리즘의 복잡도는 O(N)이어야 하고, 나누기 연산을 사용하면 안된다.

 정수 배열의 크기는 2~100,000 이고 정수의 값은 -30~30이다.

## 나누기 연산을 쓰는 버전

 처음에 이 문제를 읽었을 때는 "나누기 연산을 쓰면 안된다"는 조건을
 보지 못했다. 그래서 일단 나누기 연산이 있는 버전을 먼저 소개한다.

 나누기를 사용하는 방법은 쉽다. 전체 배열을 돌면서 모든 수를 일단
 곱해둔다. 이 수를 `all_product`라고 하자. 그러면 `i` 번째의 값은
 `all_product`를 `nums[i]`로 나눈 값이 된다.

 여기서 관건은 0이다. `nums[i]`가 0이면 `i` 위치를 제외한 나머지 모든
 원소는 0을 곱하기 때문에 0이 된다. 그런데 `i`가 아닌 다른 위치에도
 0이 있다면 `i` 위치 역시 0으로 곱해지므로 0이 될 것이다. 즉, 0의
 개수를 함께 알아야 한다. 0의 개수에 따라 다음 세 가지 케이스가 있다.
 1. 0이 하나도 없을 때: 그냥 `all_product // nums[i]` 하면 된다.
 2. 0이 1개일 때: 0인 위치를 제외한 나머지는 전부 0이된다.
 3. 0이 2개일 때: 전부 0이다.

 단, 0이 스페셜 케이스이기 때문에 `all_product`를 누적해서 곱할 때에도
 0인 경우는 곱하면 안된다. 따라서, 정확하게는
 `all_product_except_zero`가 될 것이다.

 이 아이디어를 구현하면 다음과 같다.

```python
def productExceptSelf(nums):
    all_product_except_zero = 1
    zero_count = 0
    for n in nums:
        if n != 0:
            all_product_except_zero *= n
        else:
            zero_count += 1
    answer = []
    if zero_count == 0:
        for n in nums:
            answer.append(all_product_except_zero // n)
    elif zero_count == 1:
        for n in nums:
            if n != 0:
                answer.append(0)
            else:
                answer.append(all_product_except_zero)
    else:
        answer = [0] * len(nums)
    return answer
```


## 나누기 연산을 안쓰는 버전

 그러면 문제의 조건에 따라 **나누기 연산 없이** 이 문제를 푸는 방법을
 생각해보자.

 공간을 좀 희생한다고 생각하고 뭔가 도움이 될만한 보조 정보를 만들 수
 있을지 고민해보자. 어떤 위치 `i`에서 자기 자신을 제외한 나머지 값들의
 곱이란 것은 결국 `i`를 기준으로 왼쪽에 있는 모든 원소의 곱과 오른쪽에
 있는 모든 원소의 곱을 곱한 것과 같다. 그러면 이 정보를 미리 계산해둘
 수 있으면, 이 값을 이용해서 그냥 곱하기만 하면 쉽게 구해질 것 같다.

 예를 들면 아래 그림과 같다.

```
[1, 2, 3, 4] 가 있을 때 ->

left:  [1, 1, 2, 6]
right: [24, 12, 4, 1]
answer:[24, 12, 8, 6]
```

 즉, `answer[i] = left[i] * right[i]`가 된다.

 `i`를 기준으로 왼쪽에 있는 모든 값의 곱을 `left`, 오른쪽에 있는 모든
 값의 곱을 `right`라고 해보자. 곰곰이 생각해보면 `left`는 정방향으로,
 `right`는 역방향으로 배열을 훑으면 만들 수 있을 것 같다. 다음과 같이
 말이다.

```python
# there is nums
left = [1]
for n in nums[:len(nums)-1]:
    left.append(left[-1] * n)

right = [1]
for n in list(reversed(nums))[:len(nums)-1]:
    right.append(right[-1] * n)
right = reversed(right)
```

 - `left`를 만드는 방법은 straightforward하다. 0번째의 왼쪽에는 아무런
   값도 없으므로 null이 맞겠지만, 계산의 편의를 위해 1로 준다. 그러면
   그 이후 `i` 번째의 값은 이전의 `i-1` 번째의 값에 `i`번째 값을
   곱해서 누적해 나아가면 된다. 단, 제일 마지막 원소는 곱할 일이
   없으므로 스킵한다.
 - `right`는 `left`를 만드는 방법을 거꾸로 하면 된다. 여기서는 배열을
   뒤집어서 차례대로 누적 곱을 구한 뒤에 이것을 한번 더
   뒤집었다. 그래야 정상적으로 오른쪽에 있는 원소의 순서가 된다.

 이 아이디어를 구현하면 다음과 같다.

```python
def productExceptSelf(nums):
    left = [1]
    for n in nums[:len(nums)-1]:
        left.append(left[-1] * n)

    right = [1]
    for n in list(reversed(nums))[:len(nums)-1]:
        right.append(right[-1] * n)
    right = reversed(right)

    answer = []
    for l, r in zip(left, right):
        answer.append(l * r)
    return answer
```

 - `left`와 `right`를 구해서 `i` 번째 원소의 값을 구하는 데에는 간단히
   파이썬의 `zip` 연산을 사용해서 두 개의 배열을 묶었다.
