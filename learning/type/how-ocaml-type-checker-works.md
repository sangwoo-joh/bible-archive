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
 $$) 양화로 빠져나가는(escape) 타입을 잡을 수 있게 스무스하게
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
 이 페이지는 원래 광범위하고, 복잡하고, 거의 문서화가 안된 OCaml 타입
 체커 코드를 이해하기 위해서 작성하던 노트로 시작했다. 코드를 파고
 들어가 보니 엄청난 보물이 발견되었다. 그 중 하나인 효율적이고 우아한
 타입 일반화 방법을 여기서 소개한다.

 OCaml의 타입 일반화는 이른바 타입의 *레벨(levels)* 추적
 기반이다. 완전히 같은 레벨은 모듈 안에 정의된 타입이 더 넓은 범위로
 빠져나가는(escape) 것을 막아준다. 따라서 레벨은 지역적으로 도입된
 타입 생성자에게 구역 규율(region discipline)을 강제한다. 일반화와
 구역이 아주 균일한 방법으로 처리되는 것은 굉장히 흥미롭다. OCaml 타입
 체커에서 레벨은 더 많은 쓰임새가 있는데, 폴리모픽 필드와 존재
 양화사(existential)를 가진 레코드에도 쓰인다. MetaOCaml은 미래에 쓰일
 (future-stage) 바인딩 범위를 추적하기 위해서 레벨에 간접적으로
 의존하고 있었다. 이런 모든 어플리케이션에는 공통적인 불평이 있었는데,
 의존성을 추적하는 일과 구역 억제 또는 데이터 의존 그래프의
 도미네이터를 계산하는 일이었다. 하나는 곧바로 Tofte와 Talpin의 구역
 기반의 메모리 관리를 떠올리게 한다. Fluet과 Morrisett이 보여줬듯이,
 구역을 위한 Tofte와 Taplin 타입 시스템은 할당된 데이터가 그 구역에서
 빠져나가는 것을 정적으로 막기 위해서 보편 양화사에 의존하여 System
 F에서 인코딩될 수 있다. 이것과 듀얼하게, 레벨 기반 일반화는 타입
 변수의 구역을 결정하기 위해서 타입 변수가 빠져나가는 것을 추적하는
 것에 의존하고, 따라서 보편 양화사를 위한 장소이다.

 OCaml의 일반화는 1988년에 디디어 레미에 의해 발견된 알고리즘의
 (부분적인) 구현이다. 이 아이디어는 타입이 명시된 AST 위에서 타입의
 공유를 명시적으로 표현하는 것이다. 타입 변수는 오직 그 변수의 모든
 발생(all occurrences)을 도미네이트하는 노드에서만 양화될 수
 있다. 타입 일반화는 그래프 도미네이터의 증분 계산에 해당한다. 레미의
 MLF는 이 아이디어의 자연스러운 결과물이다.

 아쉽게도, 레미의 일반화 알고리즘과 그 기저의 아이디어는 거의 알려져
 있지 않다. OCaml에 있는 것과 같은 구현은 OCaml 소스 코드에 아주 짧고
 헷갈리게 작성된 주석 외에는 전혀 문서화되어 있지 않는 것 같다. 이건
 널리 알려져야 한다. 이를 위해서, (1) 알고리즘에 대한 동기 부여와
 설명을 해서 그 직관과 뼈대 구현을 드러내고, (2) OCaml 타입 체커를
 해석한다.

 이 글의 두 번째 파트는 OCaml 타입 체커의 일부분에 주석을 다는 것이
 목적이고, 따라서, 꽤 기술적이다. OCaml 4.00.1 버전의 타입 체킹 코드를
 참조하고 있다. `typing/` 디렉토리 안에 있다. `typecore.ml` 파일이
 타입 체커의 핵심이다. AST의 노드를 타입과 타이핑 환경으로
 어노테이트한다. 정확히는, `parsing/parsetree.mli`에 정의된
 `Parsetree`를 `Typedtree`로 변환한다. `ctype.ml` 파일은 유니피케이션
 알고리즘과 레벨 조작 함수를 구현하고 있다.

## Generalization

 이 배경 설명에서는 힌들리 밀너 타입 시스템의 타입 일반화를 설명하고
 나이브한 구현의 미묘한 점과 비효율적인 점을 강조한다. 이 비효율은
 레미가 레벨 기반 일반화 알고리즘을 발견하는 동기가 되었다.

 타입 환경 `G`에 대한 타입 `t`의 *일반화(generalization)* `GEN(G,
 t)`가 `G`에서 자유로 나타나지 않는 `t`의 자유 타입 변수를 양화하는
 것임을 떠올려보자. 즉, `GET(G, t) = ` $$ \forall \alpha_1
 ... \alpha_n .$$ `t` where $$ { \alpha_1, ..., \alpha_n} = $$
 `FV(t) - FV(G)`. 힌들리 밀너 식으로 얘기하면, 이 양화는 타입을 이른바
 타입 스키마(type schema)로 바꾼다. 일반화는 `let` 표현식의 타입
 체킹에 쓰인다.

```
G ㅏ e : t     G, (x: GEN(G, t)) ㅏ e2 : t2
---------------------------------------------
G ㅏ let x = e in e2 : t2
```

 즉, `let`에 묶인 변수에 추론된 타입은 `let` 표현식의 바디를 타입
 체킹할 때 일반화된다. ML은 일반화에 조건을 추가하는데, 이른바 값
 제약(value restriction)이다. `let`에 묶인 표현식 `e`는 겉보기에는
 반드시 눈에 보이는 사이드 이펙트가 없어야 한다. 기술적으로는, `e`는
 반드시 *비확장성(nonexpansive)*이라는 문법 테스트를 통과해야
 한다. OCaml은 이 값 제약을 완화하는데, 뒤에서 나온다.

 일반화의 단순한 예시는 다음과 같다.

```ocaml
fun x -> let y = fun z -> z in y
(* 'a -> ('b -> 'b) *)
```

 타입 체커는 `fun z -> z`에 대해서 새로운, 그래서 유니크한 타입 변수
 $$ \beta $$를 도입하여 $$ \beta \to \beta $$ 타입을 추론한다. 표현식
 `fun z -> z`는 문법적으로는 값이고, 일반화가 진행되고, 그래서 `y`는
 타입 $$ \forall \beta. \beta \to \beta$$를 갖는다. 폴리모픽 타입이기
 때문에, `y`는 다른 타입 문맥에서 등장할 수도 있다. 즉, 다른 타입의
 아규먼트에 적용될 수도 있다. 예를 들면 다음과 같다.

```ocaml
fun x ->
  let y = fun z -> z in
  (y 1, y true)
(* 'a -> int * bool *)
```

 일반화 `GEN(G, t)`는 `G`에 나타나지 않는 `t`의 자유 타입 변수에
 대해서*만* 양화한다. 이 조건은 미묘하지만 아주 중요하다. 이게 없으면,
 $$ \alpha \to \beta $$ 같은 불안전한 타입이 다음 함수에 대해서 추론될
 수 있다.

```ocaml
fun x -> let y = x in y
```

 함수 타입을 추론하려면, 먼저 함수의 바디 `let y = x in y`의 타입을
 새로운 타입 변수 `'a`($$\alpha$$)가 도입된 타입 환경 `x:'a`에서
 추론한다. 위의 `let` 규칙에 의해서 `y`에 타입이 추론되는데,
 결과적으로 타입 `GEN(x:'a, 'a)`를 추론한다. 분명히 `'a`는 타입 환경
 `x:'a`에서 나타난다. 그럼에도 불구하고 여기에 양화를 해버리면, `y`는
 폴리모픽 타입 $$ \forall \alpha. \alpha$$를 받게 되고, 따라서 어떤
 타입으로든 인스턴스화 될 수 있다. 그 결과 함수는 표면적으로
 아규먼트를 그 어떤 타입으로 바꿀 수 있게 된다.

 따라서, 양화할 각각의 타입 변수에 대해서 우리는 반드시 **타입 환경에
 나타나지 않음**을 확인해야 한다. 나이브하게 생각하면, 그냥 타입
 환경을 다 스캔해서 모든 바인딩의 타입을 살펴볼 수 있다. 사실, 원래
 Caml이 정확히 이걸 구현했었다. 하지만 타입 환경은 엄청나게 커질 수
 있다. 일반적으로 ML 함수들은 아주 긴 `let` 표현식 시퀀스를 담고
 있다. 일반적인 `let`은 이전에 나타난 모든 `let`들의 바인딩을 타입
 환경에 갖고 있다. 재귀적인 `let`의 환경은 모든 `let` 형제(sibling)의
 바인딩을 갖고 있다. 하나의 `let`에 대한 일반화의 일부로 이 환경을
 스캔하면 함수 크기에 대해 선형 시간이 걸린다. 그러면 전체 프로그램의
 타입 체킹은 제곱이 된다. 레미가 회상하기로 비효율적인 일반화는 Caml
 컴파일의 느린 속도의 주된 이유 중 하나였다. 컴파일러를
 부트스트래핑하면서 패턴과 표현식을 컴파일하기 위해서 두 개의 상호
 재귀 함수를 타입 체킹하는 일은 거의 20분 걸렸다.

 타입 환경을 스캔하지 않는 방법이 있어야 한다.

## Unsound generalization as memory mismanagement

 여기서는 먼저 레미의 알고리즘 뒤에 있는 아이디어를 구역 기반 메모리
 관리와 관련지어 소개한다. 구체성을 위해서 토이 힌들리 밀너 타입
 추론기를 쓸 것이다. 여기서 추론기는 타입 환경을 고려하지 않고 타입의
 자유 타입 변수를 양화하는 *불안전한(unsound)* 일반화 함수를 갖고
 있다. 세 가지 간단한 예시를 타입 체크할 것이고, 불안전한 타입을
 추론하는 일을 수동 메모리 관리에서의 일반적인 문제와 연관지을 것이다:
 여전히 사용 중인 메모리를 해제하는 일이다. 불안전한 일반화는 이 다음
 섹션에서 수정되는데, 자원의 성급한 해제를 막는 표준적인 방법에서
 영감을 얻었다.

 우리의 힌들리 밀너 타입 추론기가 장난감이긴 하지만, 진짜 OCaml 타입
 체커의 많은 구현적인 결정(그리고 몇몇 함수 이름)을 공유한다. 이걸
 이해하면 나중에 OCaml 내부를 살펴볼 때 많은 도움이 된다.

 우리의 토이 언어는 표준적인 순수 람다 대수에 `let`을 추가한 것이다.

```ocaml
type exp =
    | Var of varname
    | App of exp * exp
    | Lam of varname * exp
    | Let of varname * exp * exp
```

 타입은 (자유 또는 묶인) 타입 변수, 양화된 타입 변수, 함수 타입으로
 구성된다.

```ocaml
type qname = string
type typ =
    | TVar of tv ref
    | QVar of qname
    | TArrow of typ * typ
and tv = Unbound of string | Link of typ
```

 `QVar` 타입은 타입 스키마이다. 즉, 단순 타입이 아니다. 힌들리 밀너
 시스템에서의 타입 스키마, 또는 양화된 타입은 전치형(prenex form), 즉
 보편 양화사가 모두 바깥에 붙는데, 그래서 양화사를 명시적으로
 표현해주지 않아도 된다.

 프롤로그 언어로부터 내려온 전통에 따라, 타입 변수는 레퍼런스 쎌로
 표현된다. 안묶인 변수(자유 변수)는 널 또는 셀프 포인터를 담고
 있다. 또는, 우리의 경우, 쉬운 출력을 위해서 변수 이름을 담고
 있다. 자유 타입 변수가 다른 타입 `t'`과 합쳐질 때(unified), 레퍼런스
 쎌은 `t'` 포인터로 덮어 써진다. 원형 타입(즉, 불안전한 타입)을 막기
 위해서, "나타나는지 체크(occur check)"를 먼저 수행한다. `occurs tv
 t'`는 `t'`를 탐색하면서 만약 타입 변수 `tv`를 만나면 예외를
 발생시킨다.

```ocaml
let rec unify : typ -> typ -> unit = fun t1 t2 ->
    if t1 == t2 then ()  (* t1 and t2 are physically the same *)
    else match (t1, t2) with
    | (TVar ({contents= Unbound _} as tv), t')
    | (t', TVar ({contents= Unbound _} as tv)) ->
        occurs tv t' ;
        tv := Link t'
    | (TVar {contents= Link t1}, t2) | (t1, TVar {contents= Link t2}) ->
        unify t1 t2
    | (TArrow (tyl1, tyl2), TArrow (tyr1, tyr2)) ->
        unify tyl1 tyr1 ;
        unify tyl2 tyr2
    (* everything else is error *)
```

 타입 체커는 완전히 표준적인 구현이다. 타입 환경 `env`에서의 표현식
 `exp`의 타입을 추론한다.

```ocaml
type env = (varname * typ) list
let rec typeof : env -> exp -> typ = fun env -> function
    | Var x -> inst (List.assoc x env)
    | Lam (x, e) ->
        let ty_x = newvar () in
        let ty_e = typeof ((x, ty_x) :: env) e in
        TArrow (ty_x, ty_e)
    | App (e1, e2) ->
        let ty_fun = typeof env e1 in
        let ty_arg = typeof env e2 in
        let ty_res = newvar () in
        unify ty_fun (TArrow (ty_arg, ty_res)) ;
        ty_res
    | Let (x, e, e2) ->
        let ty_e = typeof env e in
        typeof ((x, gen ty_e) :: env) e2
```

 `newvar` 함수는 새로운 `TVar`를 유니크한 이름으로 할당한다. `inst`
 함수는 타입 스키마를 인스턴스화하는데, 즉 모든 `QVar`를 새로운
 `TVar`로 대체한다. 이것도 표준적 구현이다. 일반화 함수는
 불안전(unsound)하다: 타입 환경과 상관없이 타입에 있는 모든 자유
 변수를 양화해버린다.

```ocaml
let rec gen : typ -> typ = function (* unsound! *)
    | TVar {contents= Unbound name} -> QVar name
    | TVar {contents= Link ty} -> gen ty
    | TArrow (ty1, ty2) -> TArrow (gen ty1, gen ty2)
    | ty -> ty
```

 양화는 `TVar`를 해당하는 `QVar`로 대체한다. 따라서 원래의 `TVar`는
 암묵적으로 해제(deallocated)된다: 자유 변수가 묶일 때, 말 그대로
 "사라지고(disappears)", 바인더를 가리키는 포인터로 대체된다. 즉,
 - `TVar`를 할당 (`newvar ()`) <-> 메모리 할당
 - `TVar`를 `QVar`로 대체 (양화, 즉 일반화) <-> 메모리 해제

 의 비유가 성립한다.

 타입 변수의 관점에서 보면, `typeof`는 자유 변수를 할당하고, 이것들을
 합친 다음, 양화를 한 다음 다시 해제한다. 자유 타입 변수에 영향을 주는
 이 세 가지 메인 연산의 시퀀스를 관찰할 수 있는 단순한 예시를 타입
 체크해보자. 첫 번째 예시는 아무 문제가 없어야 하는 예이다.

```ocaml
fun x -> let y = fun z -> z in y
```

 타입 체킹의 트레이스에서 타입 변수와 관계된 연산만 보여주면 다음과
 같다.

```ocaml
1 ty_x = newvar ()         (* fun x -> .... *)
2   ty_e =                 (* let y = fun z -> z in y *)
3     ty_z = newvar ();    (* fun z -> ... *)
3     TArrow (ty_z, ty_z)  (* inferred for: fun z -> z *)
2   ty_y = gen ty_e        (* ty_z remains free, and so *)
2   deallocate ty_z        (* quantified and disposed of *)
1 TArrow (ty_x, inst ty_y) (* inferred for: fun x -> ...*)
```

 각 줄에 있는 번호는 `typeof` 재귀 함수의 호출 깊이이다. `typeof`가
 AST의 리프가 아닌 각 노드에 대해서 재귀하기 때문에, 재귀 호출의
 깊이는 곧 아직 타입 체킹되지 않은 AST 노드의 깊이와 같다. 추론된
 타입은 예상대로 `'a -> 'b -> 'b` 이다. 아무 문제가 없다.

 두 번째 예시는 앞에서 본 것인데, 불안전한 일반화가 불안전한 타입 `'a
 -> 'b`를 추론하는 것이다.

```ocaml
fun x -> let y = x in y
```

 마찬가지로 `TVar` 연산 트레이스를 살펴보면 문제점이 드러난다.

```ocaml
1 ty_x = newvar ()         (* fun x -> .... *)
2   ty_e =                 (* let y = x in y *)
3     inst ty_x            (* inferred for x, same as ty_x *)
2   ty_y = gen ty_e        (* ty_x remains free, and is *)
2   deallocate ty_x        (* quantified and disposed of *)
1 TArrow (ty_x, inst ty_y) (* inferred for: fun x -> ...*)
```

 타입 변수 `ty_x`가 깊이 1에서 쓰였고 리턴 타입의 일부이다. 그런데
 양화되고 나서 깊이 2에서 버려진다. 여전히 쓰이고 있는 변수가 버려진
 것이다!

 세 번째 예시도 문제가 있다. 불안전한 일반화가 또 불안전한 타입 `('a
 -> 'b) -> ('c -> 'd)`를 추론해버린다.

```ocaml
fun x -> let y = fun z -> x z in y
```

 이 트레이스는 메모리 관리 문제를 또 보여준다.

```ocaml
1 ty_x = newvar ()           (* fun x -> .... *)
2   ty_e =                   (* let y = ... *)
3     ty_z = newvar ()       (* fun z -> ... *)
4       ty_res = newvar ()   (* typechecking: x z *)
4       ty_x :=              (* as the result of unify *)
4         TArrow (ty_z, ty_res)
4       ty_res               (* inferred for: x z *)
3     TArrow (ty_z, ty_res)  (* inferred for: fun z -> x z*)
2   ty_y = gen ty_e          (* ty_z, ty_res remain free *)
2   deallocate ty_z          (* quantified and disposed of *)
2   deallocate ty_res        (* quantified and disposed of *)
1 TArrow (ty_x, inst ty_y)   (* inferred for: fun x -> ... *)
```

 타입 변수 `ty_z`와 `ty_res`가 양화되고 난 후 깊이 2에서 버려지는데,
 여전히 `TArrow (ty_z, ty_res)` 타입의 일부로 할당되어 있는 채로
 `ty_x`에 할당되고 결과의 일부로 리턴된다.

 모든 불안전한 예시는 여전히 사용 중인 메모리(`TVar`)를 해제하는
 이른바 "메모리 관리 문제"를 보여준다. 타입 변수가 양화될 때, 나중에
 그 어떤 타입이든 간에 이것과 함께 인스턴스화 될 수 있다. 하지만, 타입
 환경에 나타나는 타입 변수는 나머지 타입 체킹에 영향을 주지 않고서는
 어떤 타입으로도 대체될 수 없다. 비슷하게, 우리가 메모리를 해제할 때,
 우리는 런타임에 그 메모리를 재할당해서 임의의 데이터로 덮어쓸 수 있는
 권한을 준다. 프로그램의 나머지 부분은 해제된 메모리에 어떤 식으로든
 의존해서는 안된다. 마치 정말로 해제된 것처럼 가정해서, 프로그램에서
 더 이상 필요하지 않은 것처럼 다뤄야 한다. 사실, "사용하지 않는
 메모리"는 프로그램의 나머지 부분에 영향을 미치지 않는 메모리에 대한
 임의의 변경으로 정의할 수 있다. 여전히 사용 중인 메모리를 해제하는
 것은 프로그램의 나머지 부분에 영향을 미쳐서, 크래시를 내기도
 한다. 덧붙여서, 위의 예시에서 추론된 불안전한 타입은 종종 동일한
 결과를 초래하기도 한다 (즉, 크래시 난다).

### 참조: 불안전한 타입 체커 전체 코드

```ocaml
type varname = string

type exp =
    | Var of varname
    | App of exp * exp
    | Lam of varname * exp
    | Let of varname * exp * exp

type qname = string
type typ =
    | TVar of tv ref
    | QVar of qname
    | TArrow of typ * typ
and tv = Unbound of string | Link of typ

let gensym_counter = ref 0
let reset_gensym : unit -> unit =
    fun () -> gensym_counter := 0

let gensym : unit -> string = fun () ->
    let n = !gensym_counter in
    let () = incr gensym_counter in
    if n < 26 then String.make 1 (Char.chr (Char.code 'a' + n))
        else "t" ^ string_of_int n

let newvar : unit -> typ =
    fun () -> TVar (ref (Unbound (gensym ())))

let rec occurs : tv ref -> typ -> unit = fun tvr -> function
    | TVar tvr' when tvr == tvr' -> failwith "occurs check"
    | TVar {contents= Link ty} -> occurs tvr ty
    | TTArrow (t1, t2) ->
        occurs tvr t1 ;
        occurs tvr t2
    | _ -> ()

let rec unify : typ -> typ -> unit = fun t1 t2 ->
    if t1 == t2 then ()
    else match (t1, t2) with
    | (TVar ({contents= Unbound _} as tv), t')
    | (t', TVar ({contents= Unbound _} as tv)) ->
        occurs tv t' ;
        tv := Link t'
    | (TVar {contents= Link t1}, t2) | (t1, TVar {contents= Link t2}) -> unify t1 t2
    | (TArrow (tyl1, tyl2), TArrow (tyr1, tyr2)) ->
        unify tyl1 tyr1 ;
        unify tyl2 tyr2
    (* everything else is error *)

type env = (varname * typ) list

let rec gen : typ -> typ = function
    | TVar {contents= Unbound name} -> QVar name
    | TVar {contents= Link ty} -> gen ty
    | TArrow (ty1, ty2) -> TArrow (gen ty1, gen ty2)
    | ty -> ty

let inst : typ -> typ =
    let rec loop subst = function
        | QVar name ->
            (try (List.assoc name subst, subst)
             with Not_found ->
                 let tv = newvar () in
                 (tv, (name, tv) :: subst))
        | TVar {contents= Link ty} -> loop subst ty
        | TArrow (ty1, ty2) ->
            let (ty1, subst) = loop subst ty1 in
            let (ty2, subst) = loop subst ty2 in
            (TArrow (ty1, ty2), subst)
        | ty -> (ty, subst)
    in
    fun ty -> fst (loop [] ty)

let rec typeof : env -> exp -> typ = fun env -> function
    | Var x -> inst (List.assoc x env)
    | Lam (x, e) ->
        let ty_x = newvar () in
        let ty_e = typeof ((x, ty_x)::env) e in
        TArrow (ty_x, ty_e)
    | App (e1, e2) ->
        let ty_fun = typeof env e1 in
        let ty_arg = typeof env e2 in
        let ty_res = newvar () in
        unify ty_fun (TArrow (ty_arg, ty_res)) ;
        ty_res
    | Let (x, e, e2) ->
        let ty_e = typeof env e in
        typeof ((x, gen ty_e)::env) e2
```

## Efficient generalization with levels

 여기서는 레미의 알고리즘 뒤에 있는 아이디어를 계속해서 설명한다. 이제
 우리는 불안전한 일반화가 아직 사용 중인 메모리를 해제하는 것과 어떻게
 관련되는지 보았기 때문에, 성급한 해제에 대한 표준적인 해결책인
 소유권(또는 구역; owership or regions) 추적을 적용해서 많은 오버헤드
 없이 이를 해결하려고 한다. 레미의 알고리즘의 주요 특징을 포착한
 최적의 방법인 `sound_lazy`는 다음에 나온다.

 분명히, 메모리를 해제하기 전에 메모리가 여전히 사용 중인지 반드시
 확인해야 한다. 나이브하게 구현하면, 우리는 해제 후보의 참조를 찾기
 위해서 지금 사용 중인 모든 메모리를 스캔할 수도 있다. 즉, 일종의 GC의
 전체 마킹 페이즈를 수행해서 후보가 마킹됐는지 확인할 수 있다. 이런
 식으로 하면, 이 확인 방법은 엄청나게 비쌀 것이다. 최소한 우리는
 가비지가 쌓일 때까지는 기다려야 한번에 수집할 수 있다. 아, 힌들리
 밀너 타입 시스템에서 우리는 양화를 임의로 지연할 수 없는데, 왜냐하면
 일반화된 타입은 아마 곧바로 쓰일 수 있기 때문이다.

 좀더 괜찮은 방법은 이른바 소유권(ownership) 추적이다: 할당된 자원을
 소유자, 개체, 또는 함수 활성화(activation)과 연결한다. 오직
 소유자만이 자원을 해제할 수 있다. 이것과 유사한 전략은 이른바 구역,
 즉 `letregion` 프리미티브로 사전적 범위로 지정된 힙 메모리의
 영역이다(areas of heap memory created by a lexically-scoped so-called
 `letregion` primitive). `letregion`이 범위를 벗어나면, 그 전체 영역이
 즉시 해제된다. 이 아이디어는 일반화와도 잘 맞는다. 힌들리 밀너
 시스템에서 일반화는 항상 `let`의 일부이다. `let x = e in e2` 에서의
 `let` 표현식은 `e`의 타입을 추론할 때 할당되는 모든 타입 변수의
 자연스러운 소유자이다. `e`의 타입이 발견되면, `let` 표현식이 소유하고
 있는 모든 자유 타입 변수는 버려질 수 있다. 즉, 양화될 수 있다.

 이러한 직관은 안전하고 효율적인 일반화 알고리즘의 기초가 된다. 먼저
 `sound_eager`를 설명한다. 이 방법의 구현은 이전의 작은 힌들리 밀너
 추론기에서 조금만 다르지만, 굉장히 중요하다. 여기서는 이 차이점만
 설명한다. 전체 코드는 밑에 있다. 주요한 차이점은 자유 타입 변수가
 안묶여있을(자유) 지라도, 이제 소유자에게 소유되어 소유자를 참조한다는
 것이다. 소유자는 항상 `let` 표현식이고, 이는 `level` 이라고 불리는
 양의 정수로 식별된다. 이것은 드 브루인(De Bruijin) 레벨 또는 해당
 `let` 표현식의 중첩되는 깊이를 나타낸다. 레벨 1은 암묵적으로 최상위의
 `let`에 해당한다. 참고로, `(let x = e1 in eb1, let y = e2 in eb2)`에
 있는 두 `let`은 모두 레벨 2를 갖지만, 두 `let` 모두 서로의 범위에
 없으므로 구역이 분리되어 있기 때문에 혼동이 발생할 수 없다. `let`
 중첩 깊이는 `let` 표현식의 타입 체킹 재귀 깊이와 동일하고 이는 하나의
 레퍼런스 쎌만 있으면 알아내기 쉽다.

```ocaml
type level = int
let current_level = ref 1
let enter_level () = incr current_level
let leave_level () = decr current_level
```

 타입 추론기는 이제 `let` 표현식을 타입 체킹할 때 깊이를 유지한다.

```ocaml
let rec typeof : env -> exp -> typ = fun env -> function
    ... (* the other cases are the same as before *)
    | Let (x, e, e2) ->
        enter_level () ;
        let ty_e = typeof env e in
        leave_level () ;
        typeof ((x, gen ty_e) :: env) e2
```

 메인 타입 추론 함수에서 바뀐 점은 `enter_level`과 `leave_level`
 함수를 호출해서 레벨을 추적하는 것 뿐이다. 나머지 부분은 그대로다.

 자유 타입 변수는 이제 그 소유자를 확인할 수 있는 레벨과 같이
 간다. 새로 할당된 타입 변수는 `current_level`을 통해 가장 최근에 타입
 체킹된 `let` 표현식, 즉 소유자를 알 수 있다. 구역 기반 메모리
 관리에서, 모든 새로운 메모리는 가장 안쪽의 살아있는 구역에 할당되는
 것과 같다.

```ocaml
type typ =
    | TVar of tv ref
    | QVar of qname
    | TArrow of typ * typ
and tv = Unbound of string * level | Link of typ

let newvar = fun () -> TVar (ref (Unbound (gensym (), !current_level)))
```





## Even more efficient level-based generalization
## Type Regions
## Discovery of levels

## Inside the OCaml Type Checker
### Generalization with levels in OCaml
### Type Regions
### Creating fresh type variables
### True complexity of generalization
