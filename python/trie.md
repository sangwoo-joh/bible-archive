---
layout: page
title: Trie
parent: Python for PS
---

{: .no_toc }
## Table of Contents
{: .no_toc .text-delta }
- TOC
{:toc}

# Trie
 대소문자를 구분한다면 52(26+26), 구분하지 않는다면 26 진 트리로 특정
 문자 사전을 파싱해서 캐싱해둔 후 이후 문자를 아주 빠른 속도로 검색할
 수 있게 해주는 자료구조이다.

 편의를 위해 대소문자 구분없는 26진 트리를 만들어보자. 어떤 노드는
 `a`부터 `z`까지 총 26개의 자식 노드를 가질 수 있다. 초기값은
 `None`이다.

``` python
class TrieNode:
    def __init__(self, c):
        self.c = c
        self.children = [None] * 26
        self.count = 0
        self.is_word = False

    def __getitem__(self, key):
        return self.children[ord(key) - ord('a')]

    def __setitem__(self, key, value):
        self.children[ord(key) - ord('a')] = value
```

 `ord` 함수는 문자의 아스키코드 값을 돌려준다. C/C++에서는 문자가
 implicit하게 정수형으로 타입 캐스팅 되어서 뺄셈을 할 수 있지만
 파이썬에서 이러면 `unsupported operand type` 에러가 뜬다. 따라서
 `ord` 함수를 통해 정수 타입으로 바꿔준 다음 인덱스로 사용해야
 한다. 그 후 __getitem__`이랑 `__setitem__`을 오버라이딩해주면 마치
 배열 인덱스처럼 트라이 노드의 자식 노드에 편하게 접근할 수 있다.

``` python
def build_trie(root, str):
    node = root
    for c in str:
        if node[c]:
            cur = node[c]
        else:
            cur = TrieNode(c)
            node[c] = cur
        cur.count += 1
        node = cur
    node.is_word = True
```

  그 후 사전의 문자열들을 가지고 트라이를 빌드해야 한다. 사전을 통째로
  트라이로 만들고 나면 하나의 트리가 나오므로, 이를 유지하기 위해서
  루트 노드 `root`는 항상 유지하고 있어야 한다.

## [14425번: 문자열 집합](https://www.acmicpc.net/problem/14425)
 사실 이 문제는 트라이로 풀면 터지기 때문에 더 간단하고 빠른 해시
 셋으로 푸는게 좋다. 복잡도가 대충 `O(10000 x 탐색 시간)` 인데, 해시
 셋은 탐색 시간이 대충 `O(1)`로 봐도 좋지만 트라이는 `O(500)`이고
 실제로는 파이썬의 제네릭한 오브젝트 리스트를 왔다갔다 해야해서
 오버헤드가 크다.

 하지만 PyPy3로 제출하면 7초라는 끔찍한 시간이 걸리긴 하지만
 통과하므로 연습삼아 풀어보았다.

```python3
import sys

load = lambda: sys.stdin.readline().rstrip()

class TrieNode:
    def __init__(self, char):
        self.char = char
        self.children = [None] * 26
        self.is_word = False

    def __getitem__(self, key):
        return self.children[ord(key) - ord('a')]

    def __setitem__(self, key, value):
        self.children[ord(key) - ord('a')] = value

def build(root, string):
    node = root
    for char in string:
        if node[char]:
            cur = node[char]
        else:
            cur = TrieNode(char)
            node[char] = cur

        node = cur
    node.is_word = True


def is_included(root, string) -> bool:
    node = root
    for char in string:
        if not node[char]:
            return False

        node = node[char]

    return node.is_word

n, m = map(int, load().split())
root = TrieNode(None)
for _ in range(n):
    build(root, load())

total = 0
for _ in range(m):
    if is_included(root, load()):
        total += 1

print(total)
```

 - 트라이를 빌드하고 트라이 위에서 검색하는 동작 모두 루트 노드가
   필요하므로 이를 유지해준다.
 - 조금이라도 빠른 검색을 위해서 Early Return 해준다.
 - 트라이의 마지막 노드에 도달했으면 반드시 `is_word` 체크를 해줘야
   한다.
