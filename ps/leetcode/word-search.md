---
layout: page
tags: [problem-solving, leetcode, python, string, matrix, backtracking]
title: Word Search
grand_parent: Problem Solving
parent: LeetCode
nav_exclude: true
---

# [Word Search](https://leetcode.com/problems/word-search/)

 `m x n` 크기의 글자 보드 `board`와 단어 `word`가 주어진다. 보드에 이
 단어가 있는지 없는지를 확인하자.

 단어는 인접한 칸에 있는 글자를 연결해서만 만들 수 있다. 인접한 칸이란
 어떤 칸을 기준으로 위, 아래, 오른쪽, 왼쪽에 있는 이웃 칸을
 뜻한다. 글자를 만들 때는 같은 칸을 두 번 이상 쓸 수 없다.

 m, n은 모두 1~6 사이의 값이고 단어의 길이는 15이다. 모두 알파벳
 소문자로 이루어져 있다.

## 백트래킹

 보드를 탐색하는 백트래킹 문제이다. 어디서 글자가 완성될지 모르기
 때문에 보드를 전부 다 훑긴 해야한다. 하지만 목표가 딱 정해져있기
 때문에, 즉 "단어"를 완성하는 것이기 때문에, 많은 탐색 공간을 프루닝할
 수 있다.

 백트래킹 함수 `backtrack(row, col, wid)`에 대해서, 베이스 케이스를
 생각해보자. `(row, col)`은 지금 상태에서 방문할 보드의 위치이고,
 `wid`는 지금까지 매칭된 단어의 인덱스이다.
 - 단어를 끝까지 다 훑었으면 당연히 `True`이다.
 - 보드 위치가 보드 사이즈를 벗어났으면 더 이상 단어를 매칭할 수
   없다는 의미이므로 `False`이다.
 - 이제 가능한 다음 칸을 모두 재귀적으로 찾을 것인데, 도중에 단어가
   매칭되었다면 더 이상 다른 공간을 탐색할 필요가 없다. 바로 `True`를
   리턴하면 된다.

 단, 한 가지 주의할 점은 조건에 따라 단어를 만들 때 **같은 칸을 두 번
 이상 쓸 수 없다**는 점이다. 이것은 까다롭게 구현할 필요없이,
 백트래킹을 시작하기 전 지금 방문한 칸의 글자를 다른 글자(`#` 같은)로
 잠깐 수정했다가, 백트래킹이 끝나고 나면 다시 원복하는 방법이 주로
 쓰인다.

 이 방법을 구현하면 다음과 같다.

```python
def exist(board, word):
    n, m = len(board), len(board[0])

    def backtrack(row, col, wid):
        if wid == len(word):
            return True

        if row < 0 or row >= n or col < 0 or col >= m:
            return False

        if board[row][col] != word[wid]:
            return False

        board[row][col] = '#'
        res = False
        for dx, dy in ((1, 0), (0, 1), (-1, 0), (0, -1)):
            res = backtrack(row + dx, col + dy, wid + 1)
            if res:
                break
        board[row][col] = word[wid]
        return res

    for row in range(n):
        for col in range(m):
            if backtrack(row, col, 0):
                return True
    return False
```

---

 여기서 보드가 엄청 커졌을 때 추가적인 프루닝을 할 수 있을까? 몇 가지
 떠오르는 방법은 다음과 같은 것들이 있다:
 - 사이즈 체크. `n * m` 보다 단어 길이가 크면 불가능하기 때문에 곧바로
   `False`이다. 그런데 이건 보드 사이즈가 커졌을 때에는 별로 소용이
   없을 것 같다.
 - 알파벳 체크. 보드에 있는 글자 집합에 단어에 있는 글자 집합이
   속하는지를 확인하면 곧바로 `False`인 경우를 알 수 있다. 즉, 단어에
   있는 글자 중 일부가 보드에 속하지 않는다면, 어차피 보드를
   탐색해봐도 소용없음을 알 수 있다.
 - 탐색하면서 알파벳 체크. 아무리 생각해도 보드가 커졌을 때 가능한
   프루닝은 이 방법 뿐이다. 어차피 보드 전체를 한번은 탐색해야
   한다. 그러면 보드 전체에 대해서 백트래킹을 하기 전에, 보드 전체에
   대해서 각 칸이 가망있는 칸인지, 즉 단어에 포함되는 글자인지를 미리
   계산해둘 수 있다. 그러면 다시 전체 보드 칸에 대해서 각각 백트래킹을
   할 때, 다음 칸이 가망있을 때에만 가면 된다.
