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

 - `ord(c)` returns the ASCII code of the character `c`

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

 - `__getitem__` 랑 `__setitem__` 를 오버라이딩해서 `children`에 바로
   접근하지 않고 인덱스처럼 쓸 수 있음
