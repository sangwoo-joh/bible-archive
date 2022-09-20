---
layout: page
title: 2. Combinator parsers
grand_parent: Work In Progress
parent: Monadic Parser Combinators
---

# 2. 컴비네이터 파서
 먼저 옛 현인들의 컴비네이터 파싱에 대한 기본 아이디어를 리뷰하는
 것부터 시작하자. 구체적으로는 일단 파서와 세 개의 원시 파서, 더 큰
 파서를 만들기 위한 두 개의 원시 컴비네이터에 대한 타입부터 정의한다.

## 2.1. 파서의 타입
 먼저 "파서"란 문자열을 입력으로 받아서 어떤 종류의 트리를 결과로
 내놓는 함수로 생각하는 것부터 시작하자. 트리는 문자열의 문법적 구조를
 명시적으로 드러낸다.

```ocaml
type parser = string -> tree
```

 첫 번째 아이디어는 바로 파서가 입력 문자열을 전부 소모(consume)하지
 않을 수도 있다는 것이다. 그러므로, 결과 트리만 리턴하기 보다는 입력
 문자열에서 **아직 소모되지 않은 접두사 부분**을 같이 리턴할 수
 있다. 따라서 파서의 타입은 다음과 같다.

```ocaml
type parser = string -> (string * tree)
```

 두 번째 아이디어는 바로 파서가 어떤 입력 문자열에 대해서는 *실패*할
 수도 있다는 것이다. 이럴 때 런타임 에러를 던지는 것보다는, 파서가
 어느 부분에서 왜 실패했는지를 알려주면 디버깅에 유용할
 것이다. `Result` 타입을 이용하면 좋을 것 같다.

```ocaml
type parser = string -> string * (tree, string) result
```

 명시적인 *실패* 표현을 가지며 입력 문자열에서 *소모되지 않은 부분*을
 리턴하는 일은 작은 파서로부터 더 큰 파서를 만들기 위한 컴비네이터를
 정의할 수 있게 해준다.

 서로 다른 파서는 서로 다른 종류의 트리를 리턴하기 마련인데, 따라서
 구체적인 트리의 타입을 추상화해서 파서의 타입을 파라미터화 하는 것이
 좋다.

```ocaml
type 'a parser = string -> string * ('a * string) result
```

 입력을 좀더 세분화해서 "어디까지"를 같이 기록하면 좋을 것 같다.

```ocaml
type input =
  { text : string
  ; pos : int
  }
```

 마지막으로, 우리는 파서가 항상 클로저를 갖고 있길 원한다. 따라서
 최종적인 우리의 파서 타입은 다음과 같다.

```ocaml
type 'a parser =
  { run : input -> input * ('a, string) result
  }
```

## 2.2. 원시(Primitive) 파서
 컴비네이터 파싱의 기본 구성 요소인 세 개의 원시 파서를 볼 것이다. 첫
 번째 파서는 `return v`로 입력 문자열을 아무것도 소모하지 않고
 성공하고 하나의 결과 `v`를 리턴한다.

```ocaml
let return (v: 'a) : 'a parser = { run = fun input -> input, Ok v }
```

 비슷하게 항상 실패하는 파서 `fail`도 정의할 수 있다. 디버깅을 위한
 에러 메시지를 함께 받는다.

```ocaml
let fail (err: string) : 'a parser = { run = fun input -> input, Error err }
```

 마지막 프리미티브는 `peek_char`으로, 입력 문자열에 대해서 첫 번째
 글자를 성공적으로 소모하거나, 문자열이 비어있으면 실패하는
 함수이다. 우리의 입력 타입인 `input`을 좀더 손쉽게 다루기 위해서 먼저
 입력에서 일부만 소모하는 함수 `consume_input`을
 만들자. `consume_input input pos len`은 주어진 입력 `input`의
 `text`의 `pos`부터 `len`만큼의 문자를 소모하고 남은 입력을 리턴한다.

```ocaml
let consume_input (input: input) (pos: int) (len: int) : input =
  { text = String.sub (input.text) pos len
  ; pos = input.pos + pos
  }
```

 이를 이용해 `peek_char`를 구현할 수 있다.

```ocaml
let peek_char : char parser = {
  run = fun input ->
    let n = String.length input.text in
    try
      consume_input 1 (n - 1) input, Ok (String.get input.text 0)
    with Invalid_argument _ -> input, Error "expected any character"
}
```

## 2.3. 파서 컴비네이터
 앞서 정의한 원시 파서들은 그 자체로는 그다지 쓸모있지는
 않다. 여기서는 이 파서를 어떻게 이어 붙여서(glue) 더 유용한 파서를
 만들 수 있을지 살펴본다. 먼저 문법을 지정하기 위한 BNF 표기법에서
 함수 적용과 유사한 *시퀀싱(sequencing; 여러 개의 함수를 연달아 적용)*
 연산자와 *선택(choice; 여러 개의 함수 중 성공한 것을 적용)* 연산자를
 이용해서 작은 문법으로부터 더 큰 문법을 만드는 것을 살펴볼
 것이다. 이렇게 정의된 연산자는 실제 문법의 구조와 밀접한 방식으로
 파서를 합치는 것을 도와준다.

 모나드 방식이 아닌 초창기의 컴비네이터 파싱에서, 파서의 시퀀싱 연산은
 보통 다음 타입을 가졌었다:

```ocaml
let seq : 'a parser -> 'b parser -> ('a * 'b) parser
```

 즉, 두 파서를 번갈아 적용해서 두 파서의 결과를 튜플로 묶는
 연산이다. 얼핏 보기에 `seq` 컴비네이터는 자연스러운 합성 연산으로
 보인다. 하지만 실제로는 `seq`을 계속 사용하다 보면 그 결과로 엄청나게
 중첩된 튜플을 갖게 되는데, 이를 다루는 것은 굉장히 지저분한 일이다.

 중첩된 튜플 문제는 *모나드식* 시퀀싱 컴비네이터를 적용해서 피할 수
 있다. 흔히 `바인드(bind)` 연산으로 알려진 것으로, 한 파서의 결과 값을
 처리해서 파서들을 시퀀싱하여 합치는 방식이다.

```ocaml
let bind (p: 'a parser) (f: 'a -> 'b parser) : 'b parser =
  { run = fun input ->
      match p.run input with
      | input', Ok x -> (f x).run input'
      | input', Error err -> input', Error err
  }
```

 `bind`의 정의는 다음과 같이 이해할 수 있다. 먼저, 파서 `p`를 입력
 문자열에 적용해서 결과로 소모되지 않은 입력과 결과 값을
 가져온다. 만약 실패했다면 (`match`의 `Error err` 케이스), 실패를
 그대로 리턴한다. 성공했다면 `'a` 타입의 값을 얻을텐데 (`match`의 `Ok
 x` 케이스), `f`가 `'a` 타입의 값을 받아 `'b` 타입의 파서를 리턴하는
 함수이므로 이제 `x`에 `f`를 적용해서 새로운 파서를 만들 수 있다. 이때
 남은 입력에 대해서 적용해야 함을 잊지말자.

 참고로 `bind` 컴비네이터는 `bind` 라는 함수 그 자체로 호출되기 보다는
 주로 다음과 같이 중위 연산자로 재정의 되어 쓰이는 것이 일반적이다.

```ocaml
let (>>=) = bind
```

 `bind` 컴비네이터는 결과의 중첩된 튜플 문제를 피하게 해준다. 왜냐하면
 첫 번째 파서의 결과가 나중에 처리될 결과와 튜플로 묶이지 않고 곧바로
 두 번째 파서에 의해서 처리될 수 있기 때문이다.
