---
layout: page
tags: [problem-solving, leetcode, python, linked-list]
title: Linked List Cycle
grand_parent: Problem Solving
parent: LeetCode
nav_exclude: false
---


# [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)

 링크드 리스트의 헤드 노드가 주어졌을 때, 해당 리스트에 싸이클이
 있는지를 확인하자.

 노드 개수는 최대 10000개 이다.

## 방문 확인하면서 DFS 하기

 싸이클 여부를 "확인"만 하는 데에는 DFS 만한 것이 없다. 깊이 우선
 탐색으로 노드를 쭉 방문하다가, 이미 방문한 노드를 다시 만났다면 해당
 그래프에는 싸이클이 있는 것이다.


```python
"""
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None
"""
def hasCycle(head):
    if not head:
        return False
    stack = []
    visited = set()
    stack.append(head)
    while stack:
        node = stack.pop()
        if node in visited:
            return True
        visited.add(node)
        if node.next:
            stack.append(node.next)

    return False
```


 - 이전에 방문한 거 확인하자마자 리턴하면 된다.
 - 입력으로 빈 리스트가 들어올 수 있으므로 함수 초입에서 체크해준다.
 - 노드를 방문한 후에 다음 노드를 스택에 쌓을 때 널 체크를 해주면 스택
   크기를 좀 덜 크게 가져갈 수 있다.
