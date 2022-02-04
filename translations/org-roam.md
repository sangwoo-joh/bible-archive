---
layout: page
title: org-roam
parent: Translations
---

# [Org-roam](https://www.org-roam.com)

## Introduction
 Org-roam은 네트워크처럼 얽힌 생각을 위한 도구다. [Roam
 Research](https://roamresearch.com)의 몇몇 핵심 기능을
 [Org-mode](https://orgmode.org)에 다시 만든 것이다.

 Org-roam은 아주 쉬운 비계층적인 필기를 가능하게 해준다. Org-roam
 위에서 노트는 자연스럽게 떠다니고, 필기는 쉽고 재밌다.

 - **프라이버시와 보안**: 작성한 개인 위키는 온전히 나의 것이며,
   전적으로 오프라인이고 내 휘하에 있다. GPG로 노트를 암호화한다.
 - **오래 지속하는 순수 텍스트**: Roam Research 같은 웹 솔루션과는
   다르게, 노트는 항상 순수한 Org-mode 파일이며, Org-roam은 단순히
   이걸 가지고 보조 데이터베이스를 만들어서 개인 위키에 초능력을
   부여한다. 노트가 순수한 텍스트인 것은 위키가 오래 지속하는데 아주
   중요하다. 상업 웹 솔루션이 이 자리를 치고 들어올 걱정은 하지 않아도
   된다.

## A Brief Introduction to the Zettelkasten Method
 Org-roam은 디지털 슬립-박스를 유지하기 위한 유틸리티를 제공한다. 이
 섹션에서는 이 "슬립-박스", 또는 "Zettelkasten(제텔카스텐이라고
 읽는듯?)" 방법에 대한 간략한 소개를 할 것이다. 이 방법에 대한 약간의
 배경 지식을 제공함으로써, Org-roam의 디자인과 관련한 결정이 깔끔하게
 이해되고 Org-roam을 적절하게 사용하는데 도움이 되었으면
 한다. 여기서는 먼저 Zettelkasten 커뮤니티와 Org-roam 포럼에서
 통용되는 용어를 소개한다.

 Zettelkasten은 생각과 글쓰기를 위한 개인적인 도구이다. 생각을
 연결하는데 많은 초점을 두며, 생각의 웹을 구축한다. 따라서, 연구를
 하는 지식 노동자와 지적인 작업에 아주 적합하다. Zettelkasten은 대화를
 통해 새롭고 놀라운 일련의 생각을 만들어낼 수 있는 연구 파트너라고 볼
 수 있다.

 이 방법은 독일의 사회학자 Niklas Luhmann가 창시한 것으로, 이와
 관련해서 엄청난 양을 저작했다. Luhmann의 슬립-박스는 단순한 카드
 박스였다. 이 카드는 작아서, 하나의 개념만 담을 수 있었다. 이런 크기
 제약은 아이디어를 개별적인 개념으로 나누게끔 했다. 이 아이디어들은
 명시적으로 서로 연결되었다. 아이디어를 나누는 것은 또 별로 상관없는
 아이디어끼리의 탐색을 장려했고, 생각의 표현을 증가시킨다. 노트 사이에
 명시적인 링크를 만드는 것은 개념 사이의 연결에 대해서 생각하게
 만들었다.

 각 노트의 모서리에 Luhmann은 순서 있는 ID를 부여했고, 이를 통해서
 메모 사이를 연결하고 이동할 수 있었다. Org-roam에서는, 단순히
 하이퍼링크를 사용한다.

 Org-roam은 슬립-박스이고, Org-mode 안에서 디지털화 되어 있다. 모든
 zettel(카드)는 순수한 텍스트이고, Org-mode 파일이다. 종이로
 슬립-박스를 유지하는 것과 마찬가지로, Org-roam은 새로운 zettel을
 만들기 쉽고, 강력한 템플릿 시스템을 이용해 미리 보일러플레이트 내용을
 채워넣기도 한다.

### Fleeting notes
 슬립-박스는 아이디어를 빠르게 캡쳐하기 위한 방법이 필요하다. 이를
 **fleeting notes**라고 한다: 나중에 처리하거나 버려야 할 정보나
 아이디어에 대한 단순한 리마인더이다. 이는 org-capture를 이용하거나,
 아니면 Org-roam의 데일리 노트 기능을 이용하면 된다. 이는 생각을
 모으기 위한 중앙의 인박스를 제공하여, 나중에 영구적인 노트로 처리될
 수 있다.

### Permanent notes
 영구적인 노트는 또 두 개의 카테고리로 나뉜다: **literature notes**와
 **concept notes**이다. 문헌 노트는 나중에 접속하려는 책이나 웹사이트,
 논문같은 특정 소스에 대한 간략한 주석일 수 있다. 개념 노트는
 작성하는데 좀더 주의를 기울여야 한다. 충분히 설명되어야 하고 자세해야
 한다. Org-roam의 템플릿 시스템은 이런 노트를 만들 수 있게 하는 다양한
 템플릿을 제공한다.

## Getting Started
### Org-roam 노드

> 노드는 ID가 있는 헤드라인 또는 최상위 파일이다.

 예를 들어, 다음 파일에서,

```org
:PROPERTIES:
:ID: foo
:END:
#+title: Foo1

 * Bar
:PROPERTIES:
:ID: bar
:END:
```

 우리는 두 개의 노드를 만들었다:
 - `foo` ID를 가진 파일 노드 "Foo"
 - `bar` ID를 가진 헤드라인 노드 "Bar"

 ID가 없는 헤드라인은 Org-roam 노드가 아니다. Org ID는 `M-x
 org-id-get-create`로 파일 또는 헤드라인에 추가될 수 있다.

### 노드 사이의 연결
 `id:foo`와 같은 Org의 표준적인 ID 링크를 이용해서 노드 사이를 연결할
 수 있다. 노드 사이의 링크를 계산하는 동안은 ID 링크만 고려되지만,
 Org-roam은 대외적인 사용을 위해 문서의 모든 링크를 캐싱해둔다.

### Org-roam 셋업하기
 Org-roam의 능력은 공격적인 캐싱에 뿌리를 두고
 있다. `org-roam-directory` 안의 모든 파일을 크롤링해서 모든 링크와
 노드의 캐시를 유지한다.

 Org-roam을 시작하기 위해서는 먼저 Org-roam 파일을 저장할 위치를
 정해야 한다. `org-roam-directory` 변수로 지정되는 이 디렉토리에는
 노트를 보관하게 된다. Org-roam은 `org-roam-directory`를 재귀적으로
 검색해서 노트를 찾는다. 이 변수는 모든 Org-roam 함수가 호출되기 전에
 지정되어야 한다.

 다음과 같이 빈 디렉토리를 만들어서 `org-roam-directory`로 지정할 수
 있다.

```lisp
(make-directory "~/org-roam")
(setq org-roam-directory (file-truename "~/org-roam"))
```

 `file-truename` 함수는 `org-roam-directory` 안에 심볼릭 링크가 있을
 경우에만 필요하다. Org-roam은 심볼릭 링크를 자동으로 따라가지 않기
 때문이다.

 그 다음, 파일이 변경되면 Org-roam이 함수를 실행해서 캐시를 일관되게
 유지하도록 설정한다. `M-x org-roam-db-autosync-mode` 커맨드로 달성할
 수 있다. 이맥스가 시작됐을 때 Org-roam이 항상 이렇게 유지하도록
 보장하려면 다음 커맨드를 설정하면 된다.

```lisp
(org-roam-db-autosync-mode)
```

 캐시를 손수 만드려면 `M-x org-roam-db-sync` 커맨드를 날리자. 캐시는
 처음 만들 때에는 시간이 좀 걸릴 수도 있지만 그 이후에는 증분적으로
 캐싱하기 때문에 즉각적일 것이다.

### 노드를 만들고 연결하기
 Org-roam에서는 노드를 만들고 서로 연결하기 쉽다. 노드를 만드는 세
 가지 함수가 있다.

 - `org-roam-node-insert`: 노드가 없으면 만들고, 노드에 링크를
   삽입한다.
 - `org-roam-node-find`: 노드가 없으면 만들고, 노드를 방문한다.
 - `org-roam-capture`: 노드가 없으면 만들고, 완료되면 현재 윈도우
   설정을 복원한다.

 먼저 `org-roam-node-find`를 보자. 실행하면 `org-roam-directory` 안에
 있는 노드 제목 리스트를 보여준다. 처음엔 노트가 없으니 아무것도 없을
 것이다. 만들려는 노트의 제목을 입력하고 엔터를 입력하자. 그러면 노트
 생성 프로세스를 시작한다. 이 프로세스는 `org-capture`의 템플릿
 시스템을 사용하므로 커스터마이즈 가능하다. `C-c C-c`를 누르면 노트
 캡쳐가 완료된다.

 이제 노드가 하나 생겼으니, `M-x org-roam-node-insert` 커맨드로 이
 노드에 링크를 삽입할 수 있다. 역시 노드의 리스트를 보여주는데, 방금
 만든 노드가 있을 것이다. 이 노드를 선택하면 `id:` 링크를 노드에
 삽입한다. 존재하지 않는 제목을 입력하면 노드 생성 프로세스로 갈
 것이다.

 Org-roam이 제공하는 자동완성 기능을 통해서 링크를 편하게 삽입할 수도
 있다.

## Customizing Node Caching
 Org-roam은 sqlite 데이터베이스를 이용해서 캐싱하지만 다양한
 라이브러리가 사용될 수 있다. 기본은 `emacs-sqlite` 이다.

### emacs-sqlite
 가장 성숙하고 잘 지원되는 라이브러리로, Org-roam의 기본
 라이브러리이다.

### emacs-sqlite3
 시스템의 패키지 매니저를 통해 공식 sqlite3 바이너리를
 시용한다. 추천되지 않는데, 왜냐하면 이맥스랑 호환성에 약간의 이슈가
 있기 때문이다. 그래도 대부분의 경우에는 동작할 것이다.

### emacs-libsqlite3
 상대적으로 최신 패키지다. SQLite C API를 이맥스 리슾으로 포팅한
 것이다. emasc-sqlite보다 훨씬 성능면에서 좋을 것으로 기대한다.

 현 시점에서는 실험적인 기능이고 Org-roam에서 요구하는 SQL 쿼리랑 잘
 동작하지 않는 부분도 있지만 다음 커맨드로 시도해볼 수는 있다.

```lisp
(setq org-roam-database-connector 'libsqlite3)
```

### 캐싱 대상
 기본적으로는 모든 노드가 캐싱된다.

 특정 헤드라인을 제외하고 싶으면 `ROAM_EXCLUDE` 속성을 nil이 아닌
 값으로 설정하면 된다.

```org
 * FOO
   :PROPERTIES:
   :ID:  foo
   :ROAM_EXCLUDE: t
   :END:
```

 `org-roam-db-node-include-function`을 이용할 수도 있다. 예를 들어서
 `ATTACH` 태그가 있는 모든 헤드라인을 제외하고 싶다면, 아래와 같이 할
 수 있다.

```lisp
(setq org-roam-db-node-include-function
    (lambda ()
        (not (member "ATTACH" (org-get-tags)))))
```

### 캐싱 시점
 기본적으로는 적극적인 캐싱을 한다. 즉, Org-roam 파일이 수정되고
 저장될 때마다 해당하는 파일에 대한 데이터베이스를 업데이트 한다. 이를
 통해 데이터베이스를 항상 최신으로 유지하며, 상호작용 커맨드를 쓸 때
 덜 놀란다.

 하지만, Org 파일의 크기에 따라서 데이터베이스 업데이트하는 작업이
 느려질 수 있다. 그러면 `org-roam-db-update-on-save` 속성을 nil로
 설정해서 자동 캐싱을 끌 수 있다.

## The Org-roam Buffer
 Org-roam은 Org-roam 버퍼를 제공한다. 이 버퍼는 다른 노트와의 관계를
 보여주는 인터페이스이다. 예를 들면 백 링크, 레퍼런스 링크, 링크 안 된
 레퍼런스 등이다. 두 가지 주요 커맨드가 있다.

 - `org-roam-buffer-toggle`: 현재 포인트에 있는 노드를 추적하는
   Org-roam 버퍼를 시작한다. 이 말은 즉, 필요하다면, 포인트가 움직이면
   버퍼의 내용이 바뀐다는 뜻이다.
 - `org-roam-buffer-display-dedicated`: 파일을 방문하지 않고 특정
   노드에 대한 Org-roam 버퍼를 시작한다. `org-roam-buffer-toggle`와는
   달리, 여러 버퍼를 가질 수 있고, 내용이 자동으로 포인트에 있는
   새로운 노드로 바뀌진 않는다.

### Org-roam 버퍼 항해하기
 Org-roam 버퍼는 `magit-section`을 이용해서 얘네 키 바인딩을 그대로
 사용할 수 있다. 예를 들면
  - `M-{N}`: `magit-section-show-level-{N}-all`
  - `n`: `magit-section-forward`
  - `<TAB>`: `magit-section-toggle`
  - `<RET>`: `org-roam-buffer-visit-thing`, 플레이스홀더 커맨드로
    `org-roam-node-visit` 같은 특정 커맨드로 대체된다.

### 버퍼에 뭘 표시할지 설정하기
 3 가지 위젯 타입이 있다.
 - 백 링크 뷰 노드: 이 노드에 링크
 - 레퍼런스 링크 노드: 이 노드에 레퍼런스
 - 언링크 레퍼런스 뷰 노드: 노드 제목/별칭과 매칭되는 텍스트를
   담고있지만 링크는 안된 것

```lisp
(setq org-roam-mode-section-functions
    (list #'org-roam-backlinks-section
          #'org-roam-reflinks-section
          ;; #'org-roam-unlinked-references-section
          ))
```

## Node Properties
## Citations
## Completion
 `M-x completion-at-point`

 `org-roam-complete-link-at-point`

```lisp
(setq org-roam-completion-everywhere t)
```

## Encryption

```lisp
(setq org-roam-capture-templates '(("d" "default" plain "%?"
    :target (file+head "${slug}.org.gpg" "#+title: ${title}\n")
    :unnarrowed t)))
```

## Org-roam Protocol
## The Templating System

```lisp
(("d" "default" plain "%?"
  :target (file+head "%<%Y%m%d%H%M%s>-${slug}.org"
    "#+title: ${title}\n")
  :unnarrowed t))
```

 - 템플릿 단축키는 `"d"`이다. 템플릿이 하나 뿐이면 그냥 그걸 고른다.
 - 템플릿 설명은 `"default"`이다.
 - `plain` 텍스트가 추가된다. 다른 옵션은 `entry`를 통한 Org의 헤딩을
   포함한다.
 - Org-capture 템플릿에 주로 사용되는 `target`이 여기서는 생략되었다.
 - `"%?"`는 각각의 `org-roam-capture-` 호출에 추가되는 템플릿이다. 이
   템플릿은 어떤 내용도 삽입하지 않지만, 커서를 여기 둔다는 의미이다.
 - `:target`은 Org-roam capture 템플릿의 필수 명세이다. 첫번째 원소는
   타입을, 두번째 원소는 캡쳐된 노드의 위치를, 나머지 원소는 포인트
   위치에 삽입될 미리 채워진 템플릿이다.
 - `:unnarrowed t`는 org-capture가 전체 파일의 내용을 보여주도록 한다.


## Graphing


## Org-roam Dailies
## Performance Optimization
## The Org-mode Ecosystem
## FAQ
