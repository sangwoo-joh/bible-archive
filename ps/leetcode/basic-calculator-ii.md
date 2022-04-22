---
layout: page
tags: [problem-solving, leetcode, python, stack]
title: Basic Calculator II
grand_parent: Problem Solving
parent: LeetCode
nav_exclude: true
---

# [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii/)

 어떤 수식을 표현하는 문자열이 주어진다. 이 수식을 평가하고 결과 값을
 계산하자.

 정수 나눗셈은 버림하여 정수로 계산한다.

 모든 수식이 유효한 수식이라고 가정해도 된다. 수식을 계산하는 과정에서
 생기는 모든 중간 결과와 최종 결과 값은 32비트 정수 범위 안에 포함됨이
 보장된다.

 문자열 수식을 곧바로 평가할 수 있는 파이썬의 `eval()`같은거 쓰지말고
 정정당당하게 계산하자.

 문자열의 길이는 $$ 1 \sim 3 \times 10^5$$ 이고, 정수와 사칙연산(`+`,
 `-`, `*`, `/`), 그리고 공백만 포함한다.

## 역폴란드 표기법, 또는 후위 표기법 - Reverse Polish Notation, or Postifx Notation

 이런 일종의 파서를 짜는 문제는 [후위
 표기법](https://en.wikipedia.org/wiki/Reverse_Polish_notation)으로
 만들어서 계산하는 것이 훨씬 이해하기 쉽다. `3 + 4`를 후위 표기법으로
 바꾸면 `3 4 +`가 된다. 후위 표기법은 중위 표기법과는 달리 괄호가
 필요없다는 장점이 있다. 예를 들어 `3 - 4 * 5`는 `3 - (4 * 5)` 또는
 `(3 - 4) * 5` 로 해석할 수 있는데, 후위 표기법으로 첫 번째는 `3 4 5 *
 -`로, 두 번째는 `3 4 - 5 *`로 각각 유니크하게 표현할 수 있기 때문에,
 모호함이 사라진다. 다만 중위 표기법에서는 연산자 우선순위를 통해 이런
 모호함을 제거하기도 한다.

 중위 표기법을 후위 표기법으로 바꾸는 작업은 [차량기지
 알고리즘(Shunting yard
 algorithm)](https://en.wikipedia.org/wiki/Shunting_yard_algorithm)을
 통해 가능하다. 이것도 킹갓 다익스트라님께서 만드셨다. 알고리즘이
 동작하는 방식이 차량기지를 닮아서 명명했다고 하는데 살펴보자.

 후위 표기법을 계산하는 데에도 스택이 쓰이고 중위 표기법을 후위
 표기법으로 바꾸는 데에도 스택이 쓰인다.
