---
layout: page
tags: [problem-solving, leetcode, python, string, dynamic-programming]
title: Wildcard Matching
parent: LeetCode
grand_parent: Problem Solving
nav_exclude: false
---

# [Wildcard Matching](https://leetcode.com/problems/wildcard-matching/)

 입력 단어 `s`와 패턴 `p`가 주어진다. 패턴은 다음 와일드 카드를
 포함한다.
 - `?`는 모든 글자 하나랑 매칭된다.
 - `*`는 빈 글자를 포함한 모든 문자열과 매칭된다.

 주어진 패턴이 주어진 단어 전체를 매칭할 수 있는지 체크하는 함수를
 구현하자.

 단어와 패턴의 길이는 0~2,000 사이이다. 단어는 알파벳 소문자만
 포함한다. 패턴은 알파벳 소문자와 `?`, `*`만 포함한다.

## 접근 아이디어
 두 개의 인덱스를 가지고 패턴과 단어를 동시에 확인한다고 하자. 패턴에
 `?`가 있거나 혹은 현재 위치에서의 패턴과 단어의 글자가 같으면 계속
 진행한다. 그러다가 처음으로 이 조건을 만족하지 않는 위치에 도달하게
 될 것이다. 이때 가능한 경우는 네 가지이다.

 1. 패턴과 단어가 매칭되지 않는 경우. 단순하게 그냥 두 위치의 글자가
    다른 경우이다.
 2. 패턴의 끝에 도달한 경우. 패턴에 `*`가 하나도 없는 경우이다. 패턴의
    길이와 단어의 길이가 매칭된다.
 3. 단어의 끝에 먼저 도달한 경우. 패턴이 아직 남아 있고, 남은 패턴에
    `*`가 있다면 매칭될 수도 있기 때문에 살펴봐야 한다.
 4. 패턴 위치에 `*`가 있는 경우. `*`가 몇 글자에 대응할지 알 수 없기
    때문에, **가능한 모든 경우**를 일일이 시도해봐야 한다. 패턴
    인덱스는 `*` 만큼 하나 진행하고, 단어 인덱스는 다시 처음부터
    시도해봐야 한다.

## 오답 노트 - 완전 탐색
 - 네 가지 케이스를 일단 다 구현해본다.
 - 당연하지만 모든 상태 공간을 다 탐색하기 때문에 타임아웃이 뜬다.
 - 캐싱할 만한 부분 최적 구조도 없다.

```python
def isMatch(s, p):
    pos = 0
    while pos < len(p) and pos < len(s) and (p[pos] == '?' or p[pos] == s[pos]):
        pos += 1

    # case 2
    if pos == len(p):
        return pos == len(s)

    if p[pos] == '*':
        # case 3, 4
        skip = 0
        while pos + skip <= len(s):
            if isMatch(s[pos+skip:], p[pos+1:]):
                return True
            skip += 1

    return False # case 1, 3
```

## 접근 1 - 캐싱

 - 완전 탐색은 패턴에 `*`가 많을수록 기하 급수적으로 느려진다.
 - 완전 탐색 접근을 개선해보자.
 - 첫번째 반복에서 항상 앞부분을 확인하기 때문에 단어와 패턴은 모두
   접미사가 된다.
 - 문제의 조건에 따라 단어와 패턴 길이가 각각 최대 2,000 이므로
   접미사의 개수는 최대 $$ 2001 \times 2001 = 4004001 $$ 이 되고 재귀
   호출이 이 횟수 이상 호출되면 부분 문제가 반드시 존재한다는 뜻이다.
 - 예를 들어 패턴이 `****a` 이고 단어가 `aaaaaaaaab` 이면 접미사
   개수에 따라 $$ 6 \times 11 = 66$$ 번 이상 재귀 호출이 일어나면
   반복되는 부분 문제가 있다는 것이다. 그런데 첫번째 `*`를
   처리하는데(`skip = 0`)에만 해도 이미 같은 단어(`s[pos + 0:]`)에
   대해서 6번의 재귀 호출을 하고 각각의 재귀는 패턴의 접미사들에
   대해서 검사를 해야하기 때문에, 무조건 반복되는 부분 문제가 있다.
 - 서로 다른 인덱스를 가지고 재귀 호출을 타면 좀더 캐싱하기 좋다.
 - 단어와 패턴의 길이를 N이라고 하면 부분 문제의 최대 개수는 $$ N^2 $$
   이다. 이를 캐싱해두면 한번 호출될 때마다 최대 N번 재귀 호출하므로
   복잡도는 $$O(N^3)$$.

```python
def isMatch(s, p):
    @cache()
    def match(si, pi):
        while pi < len(p) and si < len(s) and (p[pi] == '?' or p[pi] == s[si]):
            si += 1
            pi += 1

        if pi == len(p):
            return si == len(si)

        if p[pi] == '*':
            skip = 0
            while si + skip <= len(s):
                if match(si + skip, pi + 1):
                    return True
                skip += 1
        return False
```

## 접근 2 - 똑똑한 캐싱
 - 패턴에서 처음으로 `*`를 찾았을 때, 여기에 몇 글자를 매칭할지 (=
   스킵할지) 반복으로 구하기 떄문에 추가적인 복잡도 N이 소요되고 있다.
 - 몇 글자가 매칭되던 결과는 변하지 않는다.
 - 따라서 이거도 캐싱해서 복잡도를 $$O(N^2)$$으로 낮출 수 있다.
 - 이렇게 부분 최적 구조를 활용할 때에는 재귀 함수 안에서 반복문을
   쓰지말고 되도록 귀납적으로 계산해서 메모아이제이션을 활용하자.


```python
def isMatch(s, p):
    @cache()
    def match(si, pi):
        if pi < len(p) and si < len(s) and (p[pi] == '?' or p[pi] == s[si]):
            # 스킵하지말고 결과를 모두 캐싱함
            return match(si + 1, pi + 1)

        if pi == len(p):
            return si == len(si)

        if p[pi] == '*':
            # 여기서도 스킵하지 말고 결과를 모두 캐싱함
            # (si, pi + 1): 매칭 안함
            # (si + 1, pi): 글자 하나 매칭. 이후 재귀에서 또 (매칭 안함, 하나 매칭) 하므로 모든 경우가 커버됨
            if match(si, pi + 1) or (si < len(s) and match(si + 1, pi)):
                return True

        return False
```
