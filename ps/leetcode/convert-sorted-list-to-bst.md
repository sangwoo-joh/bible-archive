---
layout: page
tags: [problem-solving, leetcode, python, tree, wip]
title: Convert Sorted List to Binary Search Tree (WIP)
parent: LeetCode
grand_parent: Problem Solving
---

# [Convert Sorted List to Binary Search Tree](https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/)

 *오름차순으로 정렬*된 링크드 리스트의 헤드 노드가 입력으로 들어왔을
 때, 이걸 *밸런스가 맞춰진* 바이너리 서치 트리로 바꾸는
 문제이다. 여기서 *밸런스*는 모든 노드의 양 쪽 서브트리 높이의 차이가
 최대 1만큼 나는 친구다.

## Inorder Traverse
 BST를 inorder traverse 하면 정렬된 결과가 나온다. 이 성질을
 거꾸로 활용해보자.

 BST를 inorder traverse 하는 "척" 하면서, 바이너리 서치 비슷하게 현재
 내가 전체 정렬된 리스트의 어디 쯤을 방문하고 있는지를 알면 트리를
 거꾸로 만들 수 있지 않을까?

```python
def inorder(left, right):
  if left > right:
    return None

  mid = (left + right) // 2

  inorder(left, mid - 1)

  # 요 시점에서 inorder 순서가 지켜진다.
  # 따라서, 여기서 뭔가를 하면 할 수 있지 않을까?

  inorder(mid + 1, right)
```

 기본 아이디어는 이렇고, 실제 구현을 하면 아래와 같다.

```python
def convert(head):
    def length(node):
        l = 0
        while node:
            node = node.next
            l += 1
        return l

    def inorder(l:int , r:int) -> TreeNode:
        if l > r:
            return None

        mid = (l + r) // 2
        ln = inorder(l, mid - 1)

        # inorder here
        node = TreeNode(head.val)
        head = head.next  # ascending order
        node.left = ln

        node.right = inorder(mid + 1, r)
        return node

    return inorder(0, length(head) - 1)
```
