---
layout: page
title: How OCaml Type Checker Works
grand_parent: Learning
parent: Type Theory
---

{: .no_toc }
# [How OCaml Type Checker Works - or What Polymorphism and Garbage Collection Have In Common](https://okmij.org/ftp/ML/generalization.html)

 힌들리-밀너 타입 추론에는 알고리즘 W 말고도 좀 더 많은 것이
 있다. 1988년에, 디디어 레미(Didier Remy)는 Caml의 타입 추론 속도를
 높일려고 하고 있었는데, 타입 일반화(type generalization)를 위한
 우아한 방법을 발견했다. 타입 환경(type environment)을 스캐닝하지
 않아도 되서 빠를 뿐만이 아니다. 이 방법은 로컬에 선언되었지만
 보편적(universal; $$ \forall $$) 또는 존재적(existential; $$ \exists
 $$)으로 이스케이프(escape)하려는 타입을 잡을 수 있게 스무스하게
 확장된다.

 OCaml 타입 체커의 알고리즘과 구현은 모두 거의 알려져있지 않고 또 거의
 문서화되어 있지 않다. 이 페이지는 레미의 알고리즘을 설명하고 널리
 알리려 한다. 또, OCaml 타입 체커의 일부를 해석하려는 시도다. 레미의
 알고리즘의 역사 또한 보존하고자 한다.

 레미의 알고리즘의 매력은 타입 일반화를 일종의 의존성 추적으로 바라본
 통찰력에 있다. 이는 (메모리) 구역과 세대별 가비지 콜렉션과 같은 자동
 메모리 관리에서 쓰이는 추적 방법과 같은 종류이다. (타입) 일반화는
 노드에는 타입을 어노테이트하고 엣지는 공유된 타입을 나타내도록 표현한
 AST에서 도미네이터를 찾는 일로 볼 수 있다.


## Table of Contents
{: .no_toc .text-delta }
- TOC
{:toc}

## Introduction
## Generalization
## Unsound generalization as memory mismanagement
## Efficient generalization with levels
## Even more efficient level-based generalization
## Type Regions
## Discovery of levels

## Inside the OCaml Type Checker
### Generalization with levels in OCaml
### Type Regions
### Creating fresh type variables
### True complexity of generalization
