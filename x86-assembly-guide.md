---
layout: default
title: x86 Assembly Guide
nav_order: 1
---

# [x86 어셈블리 가이드](http://www.cs.virginia.edu/~evans/cs216/guides/x86.html)
 32비트 x86 어셈블리 언어의 프로그래밍 가이드이다. 전부는 아니고
 유용한 서브셋을 다룬다. x86 머신 코드를 생성하는 어셈블리는 몇 가지
 종류가 있는데, 여기서는 Microsoft Macro Assembler(MASM) 어셈블러를
 다룬다. MASM은 x86 어셈블리 코드를 쓰기 위해서 인텔의 표준 문법을
 사용한다.

 x86 명령어 전체 셋은 너무 크고 복잡해서 여기서는 다루지
 않는다. 인텔의 x86 명령어 셋 매뉴얼은 2900 여 페이지에 달한다. 예를
 들면 x86 명령어 셋의 16비트 서브셋이 있는데, 16비트 프로그래밍 모델을
 사용하는 일은 꽤 복잡하다. 분할된 메모리 모델을 갖고 있고, 레지스터
 사용에 좀더 제약이 많고, 등등. 그래서 여기에서는 x86 프로그래밍의
 좀더 현대적인 측면에만 집중해서 x86 프로그래밍에 대해서 기초적인
 부분만 다룰려고 한다.

{: .no_toc }
## Table of Contents
{: .no_toc .text-delta }
- TOC
{:toc}

## 레지스터
 현대적인 (즉, 386 이상) x86 프로세서는 여덟 개의 32비트 범용 목적
 레지스터를 갖고 있다. 레지스터의 이름은 주로 역사적인 배경이
 있다. 예를 들면, `EAX`는 *Accumulator*라고 불렸는데, 왜냐하면 여러
 산술 연산에 쓰였기 때문이다. 그리고 `ECX`는 *Counter*라고 알려졌는데,
 왜냐하면 주로 반복문에 쓰이는 인덱스 값을 갖고 있는데 쓰였기
 때문이다. 레지스터의 대부분은 현대적인 명령 셋에서 원래의 특별한
 목적을 잃어버린 반면, 관용적으로 딱 두 개의 레지스터는 특별한 목적을
 위해 예약되어 있는데 그게 바로 스택 포인터를 위한 `ESP`와 베이스
 포인터를 위한 `EBP`이다.

 `EAX`, `EBX`, `ECX`, 그리고 `EDX` 레지스터는 일부분만 사용될 수도
 있다. 예를 들면, `EAX`의 LSB 2바이트는 16비트 레지스터 `AX`로 취급될
 수 있다. `AX`의 LSB 1바이트는 하나의 8비트 레지스터 `AL`로, `AX`의
 MSB 1바이트는 하나의 8비트 레지스터 `AH`로 쓰일 수 있다. 이 이름들은
 모두 같은 물리적인 레지스터를 가리킨다. 2 바이트의 데이터가 `DX`에
 위치할 때, 이 데이터를 수정하면 `DH`, `DL`, `EDX` 모두에 영향을
 미친다. 이런 서브-레지스터는 주로 고대의 16비트 버전 명령 셋을
 지원하기 위해서 아직까지 유지되고 있다. 하지만, 32비트보다 작은
 1바이트 짜리 아스키 문자를 다루거나 할 때에는 가끔 편리하기도 하다.

 어셈블리 언어에서 레지스터를 참조할 때, 이름은 대소문자에 관계
 없다. 예를 들면, `EAX`와 `eax`는 같은 레지스터를 참조한다.

![x86 레지스터](http://www.cs.virginia.edu/~evans/cs216/guides/x86-registers.png)

## 메모리와 어드레싱 모드
### 정적 데이터 구역 선언하기
 x86 어셈블리에서는 특별한 어셈블러 지시자(directive)를 이용해서 마치
 전역 변수와 비슷한 *정적 데이터 구역(static data regions)*을 선언할
 수 있다. 데이터 선언은 `.DATA` 지시자 앞에 와야 한다. 이 지시자를
 따라 `DB`, `DW`, 그리고 `DD` 지시자가 각각 1, 2, 4바이트의 데이터
 위치를 선언하는데 사용될 수 있다. 선언된 위치는 나중에 참조할
 목적으로 이름으로 레이블링 할 수 있다. 이는 변수를 이름으로 선언하는
 것과 비슷하지만, 훨씬 더 저수준의 규칙을 따른다. 예를 들면, 차례차례
 선언된 위치는 실제 메모리에서도 차례차례 위치하게 된다.

 예시 선언을 보자.

```nasm
.DATA
var  DB  64         ; Declare a byte, referred to as location `var`, containing the value 64.
var2 DB  ?          ; Declare an uninitialized byte, referred to as location `var2`
     DB  10         ; Declare a byte with no label, containing the value 10. Its location is `var2 + 1`
X    DW  ?          ; Declare a 2-byte uninitialized value, referred to as location `X`
Y    DD  30000      ; Declare a 4-byte value, referred to as location `Y`, initialized to 30000.
```

 배열이 다차원을 가질 수 있고 인덱스로 접근할 수 있는 고수준의 언어와
 다르게, x86 어셈블리 언어의 배열은 단순히 메모리에서 연속적으로
 위치한 여러 개의 쎌이다. 배열은 예시처럼 그냥 값을 나열해서 선언할 수
 있다. 이 외에 배열을 선언하기 위한 다른 두 개의 일반적인 방법은 `DUP`
 지시자와 문자열 리터럴을 쓰는 것이다. `DUP` 지시자는 어셈블러가
 주어진 횟수만큼 식을 반복하게 해준다. 예를 들면, `4 DUP(2)`는 `2, 2,
 2, 2`와 같다.

 또 다른 예시를 보자.

```nasm
Z      DD 1, 2, 3      ; Declare three 4-byte values, initialized to 1, 2, and 3. The value of location `Z + 8` will be 3.
bytes  DB 10 DUP(?)    ; Declare 10 uninitialized bytes starting at location `bytes`
arr    DD 100 DUP(0)   ; Declare 100 4-byte words starting at location `arr`, all initialized to 0.
str    DB 'hello',0    ; Declare 6 bytes starting at the address `str`, initialized to the ASCII character values for `hello` and the null(0) byte.
```

### 메모리 주소 지정 (Addressing Memory)
 x86과 호환되는 현대 프로세서는 최대 `2^32` 바이트의 메모리에 대한
 주소를 지정할 수 있다: 메모리 주소는 32비트 값이다. 레이블을 이용해서
 메모리 구역을 참조한 앞의 예시에서, 이런 레이블은 실제로는 어셈블러에
 의해 메모리의 주소를 가리키는 32비트 값으로 바뀐다. 레이블(즉, 상수
 값)로 메모리 구역을 참조하는 것이 지원되는 것에 더하여, x86은 메모리
 주소를 계산하고 참조하기 위한 유연한 방법을 제공한다. 최대 두 개의
 32비트 레지스터와 32비트 부호있는 상수는 메모리 주소를 계산하기
 위해서 *더해질 수 있다*. 또, 레지스터 중 하나는 미리 2, 4, 8 중
 하나와 곱해질 수 있다. (정말 저수준이다...)

 주소 지정 모드는 많은 x86 명령에 사용될 수 있다. 여기서는 `mov`
 명령으로 레지스터와 메모리 사이에서 데이터를 옮기는 몇 가지 예시를
 살펴본다. 이 명령은 두 개의 피연산자를 갖는데, 첫 번째는
 목적지(destination)이고 두 번째는 출발지(source)를 명시한다.

 다음은 `mov` 연산으로 주소를 계산하는 예시이다.

```nasm
mov eax, [ebx]         ; Move the 4 bytes in *memory at the address* contained in ebx into eax
mov [var], ebx         ; Move the *contents* of ebx into the 4 bytes at memory address `var`. Note, var is a 32-bit constant.
mov eax, [esi-4]       ; Move 4 bytes at memory address `esi + (-4)` into eax.
mov [esi+eax], cl      ; Move the contents of CL into the byte at address `esi + eax`
mov edx, [esi+4*ebx]   ; Move the 4 bytes of data at address esi+4*ebx into edx
```

 다음은 잘못된 주소 계산의 예시이다.

```nasm
mov eax, [ebx-ecx]     ; Can only add register values
mov [eax+esi+edi], ebx ; At most 2 registers in adress computation
```

### 사이즈 지시자
 일반적으로, 주어진 메모리 주소에서 데이터 아이템의 의도된 사이즈는
 참조되는 어셈블리 코드 명령에서 추론할 수 있다. 예를 들어, 모든 위의
 예시에서, 메모리 구역의 사이즈는 피연산 레지스터의 크기에서 추론할 수
 있다. 32비트 레지스터를 로드할 때, 어셈블러는 참조할 메모리 구역이 4
 바이트 크기라는 것을 추론할 수 있다. 1 바이트 레지스터에 담긴 값을
 메모리에 저장할 때, 어셈블러는 메모리에서 1 바이트의 주소를 참조하고
 싶다는 것을 추론할 수 있다.

 하지만, 어떤 경우에는 메모리 구역을 참조하는 사이즈가 모호할 때가
 있다. `mov [ebx], 2`를 생각해보자. 이 명령은 2라는 값을 `ebx` 주소의
 1바이트에 옮겨야 할까? 아마 이 2라는 값은 32비트 정수 표현이라서
 `ebx` 주소의 4바이트에 옮기는 걸지 모른다. 둘 모두 유효한 해석이기
 때문에, 어셈블러에게 반드시 명확하게 올바른 방향을 제시해줘야
 한다. 사이즈 지시자 `BYTE PTR`, `WORD PTR`, `DWORD PTR`은 이 목적으로
 태어났고, 각각 1, 2, 4 바이트의 크기를 알려준다.

```nasm
mov BYTE PTR [ebx], 2  ; Move 2 into the single byte at the address sotred in ebx.
mov WORD PTR [ebx], 2  ; Move the 16-bit integer representation of 2 into the 2 bytes starting at the address in ebx.
mov DWORD PTR [ebx], 2 ; Move the 32-bit integer representation of 2 into the 4 bytes starting at the address in ebx.
```

## 명령
 기계 명령은 일반적으로 세 가지 카테고리로 나눠진다: 데이터 이동,
 산술/논리, 그리고 제어 흐름이다. 여기서는 각 카테고리의 x86 명령의
 아주 중요한 예시를 살펴본다. 여기 있는게 x86 명령의 빠뜨림 없는
 목록은 아니고 유용한 서브셋이다. 전체가 궁금하다면 인텔의 명령 셋을
 봐라.

 다음과 같은 표기법을 사용한다.

```
<reg32>     Any 32-bit register (eax, ebx, ecx, edx, esi, edi, esp, or ebp)
<reg16>     Any 16-bit register (ax, bx, cx, or dx)
<reg8>      Any 8-bit register (ah, bh, ch, dh, al, bl, cl, or dl)
<reg>       Any register
<mem>       A memory address (e.g. [eax], [var + 4], or dword ptr [eax+ebx])
<const32>   Any 32-bit constant
<const16>   Any 16-bit constant
<const8>    Any 8-bit constant
<const>     Any 8-, 16-, or 32-bit constant
```

### 데이터 이동 명령
#### `mov`
 Opcode: 88, 89, 8A, 8B, 8C, 8E, ...

 `mov` 명령은 두 번째 피연산자가 가리키는 데이터 아이템(즉 레지스터의
 내용물이나 메모리 내용물, 또는 상수 값)을 첫 번째 피연산자가 가리키는
 위치(즉 레지스터나 메모리)에 복사한다. 레지스터에서 레지스터로 값을
 복사하는 것은 가능하지만, 메모리에서 곧바로 메모리로 복사하는 것은
 불가능하다. 메모리 사이에서 데이터를 옮기고 싶다면, 먼저 옮기려는
 대상 메모리 내용물을 레지스터에 로드하고 그 다음 목적지 메모리 주소로
 복사해야 한다.

```nasm
mov <reg>, <reg>
mov <reg>, <mem>
mov <mem>, <reg>
mov <reg>, <const>
mov <mem>, <const>
```

```nasm
mov eax, ebx           ; Copy the value in ebx into eax
mov byte ptr [var], 5  ; Store the value 5 into the byte at location var
```

#### `push`
 Opcode: FF, 89, 8A, 8B, 8C, 8E, ...

 `push` 명령은 메모리에서 지원되는 하드웨어 스택에 피연산자를
 푸시한다. 구체적으로는, 먼저 `esp`를 4 만큼 빼고, 그 다음 피연산자를
 32비트 위치인 `[esp]` 주소의 내용물에 옮긴다. 스택 포인터 `esp`는
 푸시를 통해 값이 줄어드는데, 왜냐면 x86 스택이 밑으로 자라기
 때문이다. 즉, 높은 주소에서 낮은 주소로 자란다.

```nasm
push <reg32>
push <mem>
push <const32>
```

```nasm
push eax               ; Push eax onto the stack
push [var]             ; Push the 4 bytes at address var onto the stack
```

#### `pop`
 `pop` 명령은 하드웨어가 지원하는 스택의 꼭대기에서 4 바이트 크기의
 데이터 원소를 없애고 피연산자가 명시한 위치(즉, 레지스터 또는 메모리
 위치)로 옮긴다. 구체적으로는 먼저 메모리 위치 `[esp]`에 위치한 4
 바이트를 피연산 레지스터 또는 메모리 위치로 옮긴 다음, `esp`를 4만큼
 증가시킨다.

```nasm
pop <reg32>
pop <mem>
```

```nasm
pop edi                ; Pop the top element of the stack into edi.
pop [ebx]              ; Pop the top element of the stack into memory at the 4-bytes starting at location ebx.
```

#### `lea` - Load Effective Address
 `lea` 명령은 두 번째 피연산자가 명시한 *주소*를 첫 번째 피연산
 레지스터로 옮긴다. 주의할 점은 메모리 위치의 *내용물*은 로드되지
 않고, 오직 유효 주소(effective address)만 계산해서 레지스터로
 옮긴다는 점이다. 메모리 구역에 포인터를 얻을 때 유용한 방법이다.

```nasm
lea <reg32>, <mem>
```

```nasm
lea edi, [ebx+4*esi]   ; The quantity ebx+4*esi is placed into edi.
lea eax, [var]         ; The value in var is placed in eax.
lea eax, [val]         ; The value val is placed in eax.
```

### 산술과 논리 명령
### 제어 흐름 명령

## 호출 규약
### 호출자(콜러) 규칙
### 예시
### 피호출자(콜리) 규칙
### 예시
