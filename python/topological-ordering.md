---
layout: page
title: Topological Ordering
parent: Python for PS
---

{: .no_toc }
## Table of Contents
{: .no_toc .text-delta }
- TOC
{:toc}

# Cycle Condition

| | `visiting = False` | `visiting = True` |
| --- | --- | --- |
| `visited = False` | 아직 방문하지 않음 | **싸이클** |
| `visited = True` | 불가능한 경우 | 탐색이 끝남 |

# Topological ordering
 DFS에서 노드에 대한 방문을 **완료** 했다는 의미는 즉 이 친구는
 Topological Ordering 에서 제일 나중에 방문해야 한다는 뜻이다. 따라서
 방문을 완료한 순서대로 리스트든 큐든 스택이든 차례로 넣으면 이게 곧
 거꾸로 된 Topological Ordering 이다. 그러므로,
  - 그래프를 만들 때부터 source와 sink를 거꾸로 한 다음 그냥 리턴하거나,
  - 리턴하기 직전에 뒤집어주면 된다.

``` python
class Graph:
    def __init__(self, n):
        self.node_map = {}
        self.node_set = set(range(n))  # edge가 없는 노드가 있을 수 있음

    def add_edge(self, src, snk):
        self.node_set.add(src)
        self.node_set.add(snk)

        sink_set = self.node_map.get(src, None)
        if sink_set:
            sink_set.add(snk)
        else:
            self.node_map[src] = {snk}

    def topological_ordering(self):
        visiting = set()
        visited = set()
        order = []

        def dfs(node):
            if node in visited:  # node_set 이 entry 이므로 진입하자마자 visited 체크를 해줘야 한다.
                return

            visiting.add(node)
            for succ in self.node_map.get(node, set()):
                if succ in visiting:  # 정확히 싸이클 케이스
                    raise TypeError("has cycle")
                if succ not in visited:  # 아직 방문 완료가 아닐 때에만 추가로 탐색한다
                    dfs(succ)

            # node 에 대한 방문을 완료했으므로, visiting/visited 처리를 완료하고 order에 넣는다.
            visiting.remove(node)
            visited.add(node)
            order.append(node)

        try:
            for node in self.node_set:
                dfs(node)
        except TypeError:
            return []

        order.reverse()
        return order
```
