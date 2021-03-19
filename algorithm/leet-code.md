---
layout: default
title: Leet Code
permalink: /algorithm/leet-code
parent: Algorithm
---

{: .no_toc }
# Tips
## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}

# Rotate Image

 n x n 2D 매트릭스를 시계 방향으로 90도 회전할껀데,
 *제자리에서(in-place)* 회전해야 한다.

```python
# input
[[1, 2, 3],
 [4, 5, 6],
 [7, 8, 9]]

# output
[[7, 4, 1],
 [8, 5, 2],
 [9, 6, 3]]
```

## O(N) Space의 경우
 *제자리에서* 라는 제약이 없는 경우에는 어떻게 할 수 있을까? 다음 한
 줄로 가능하다:

```python
matrix = list(zip(*matrix[::-1]))
```

 - `matrix[::-1]`: 원래 2차원 배열의 순서를 뒤집는다. 즉, `[[1,2,3],
   [4,5,6], [7,8,9]]` 가 `[[7,8,9], [4,5,6], [1,2,3]]`이 된다.
 - `*`: 리스트를 풀어서 다른 함수에 넘길 수 있게 한다. 즉 `[7,8,9]`,
   `[4,5,6]`, `[1,2,3]` 이렇게 풀려버린다.
 - `zip()`: 여러개의 리스트를 같은 인덱스에 있는 것끼리 묶어준다. 즉
   `(7, 4, 1)`, `(8, 5, 2)`, `(9, 6, 3)`으로 묶이게 되고 이게 곧 90도
   회전한 결과와 같다.

## O(1) Space의 경우
 제자리에서 하려면 어떻게 해야할까? 위의 O(N) Space의 힌트를
 활용해보자.

 일단 `matrix[::-1]`을 제자리에서 해보자. 이건 2차원 배열도 아니고
 1차원 배열을 뒤집는거나 다름 없기 때문에 다음과 같이 할 수 있다:

```python
def reverse(matrix):
  n = len(matrix)
  for i in range(n // 2):
    matrix[i], matrix[n-1-i] = matrix[n-1-i], matrix[i]
```

 즉, 반절 뚝 떼서 앞부분(i)이랑 끝부분(n-1-i)을 스왑하면
 된다. 인덱스기 때문에 `n-i`가 아니라 `n-1-i`인 점에 주의하면 된다.

 나머지 `zip(*)` 부분을 잘 살펴보면 이게 결국 행렬을 Transpose하는
 것과 같다는 것을 알 수 있다. 즉 이걸 제자리에서 하면 다음과 같다.

```python
def transpose(matrix):
  n = len(matrix)
  for i in range(n):
    for j in range(i, n):
      matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
```

 즉 단순히 (i, j) 랑 (j, i)를 스왑하면 되는데, 이때 j를 0부터
 시작해버리면 원본 그대로가 되므로 i부터 (즉, 대각선) 스왑해주기만
 하면 된다.

 이 두 가지를 이용하면 90도 회전은 곧 다음과 같다:

```python
def rotate(matrix):
  reverse(matrix)
  transpose(matrix)
```

 이 외에도 유사한 많은 알고리즘들이 있다. 예를 들면 여기서는 reverse를
 행 단위(i)로 했지만, 열 단위(j)로 하고 transpose를 먼저 해도
 된다. 혹은 다음과 같이 4각 꼭지점에 있는 애들의 인덱스를 각각 구해서
 원소 4개를 회전시켜도 된다.

```python
def rotate(matrix):
  n = len(matrix)
  for i in range(n//2 + n%2):
    for j in range(n//2):
      matrix[i][j], matrix[n-1-j][i], matrix[n-1-i][n-1-j], matrix[j][n-1-i] = \
        matrix[n-1-j][i], matrix[n-1-i][n-1-j], matrix[j][n-1-i], matrix[i][j]
```

 하지만 제일 덜 복잡해보이는 방법(...)이 이거라서 이걸로 풀어봤다.
