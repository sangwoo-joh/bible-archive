---
layout: page
tags: [problem-solving, leetcode, python, hash-table]
title: Best Time to Buy and Sell Stock
parent: LeetCode
grand_parent: Problem Solving
---

# [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)

 주식 가격 리스트 `prices`가 주어진다. `i` 번째 날의 주식 가격이
 적혀있다.

 수익을 최대한으로 내기 위해서 주식을 살 날짜 하나와 그 날짜 이후에
 주식을 팔 날짜 하나를 고르고 싶다. 이때 가능한 *최대의 수익*을
 구해보자. 수익을 아예 못내는 경우는 `0`을 리턴한다.

## O(N) 솔루션

 최소한의 가격으로 사서 가장 비싼 가격에 팔면 최대의 수익이 남을 것
 같다. 하지만 최소한의 가격 **시점 이후**의 가격 중에서 가장 비싼
 가격을 찾아야 한다는 점이 문제다. 물론 모든 케이스를 다 구해서 그중
 가장 최고의 수익을 찾는 $$ O(N^2) $$ 도 가능하긴 하지만 좀더 빠른
 방법을 생각해보자.

 리스트를 훑으면서 이때까지 만난 가격 중 최소한의 가격
 `min_price_so_far`를 저장해둔다. 그와 동시에, 이때까지 얻은 최대한의
 수익 `max_profit_so_far`와 지금 현재 시점의 수익을 비교해서 최대값을
 업데이트하면 될 것 같다.

```python
def max_profit(prices):
    min_price_so_far = float('inf')
    max_profit_so_far = 0
    for p in prices:
        min_price_so_far = min(min_price_so_far, p)
        max_profit_so_far = max(max_profit_so_far, p - min_price_so_far)
    return max_profit_so_far
```
