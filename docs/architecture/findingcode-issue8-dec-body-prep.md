# Issue #8 FindingCode DEC 本文準備 — 業務状態の洗い出し

この文書は、Option C 選択後の **次作業** である。

目的は FindingCode の命名ではない。
Issue #8 DEC 本文に入れる **「Finding として管理すべき業務状態」** を、
人の言葉で洗い出すことである。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: DEC body preparation / business-state inventory
Status: OPEN — continue one business state at a time
Selected Option: C（decision-findingcode-option-c-selection.md）
A-1〜A-4: PENDING（本文書では確定しない）
FindingCode naming: FORBIDDEN in this document
Implementation Start: HOLD
```

Live gate は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

関連:

- [`decision-findingcode-option-c-selection.md`](./decision-findingcode-option-c-selection.md)
- [`decision-findingcode-a14-bundle-content-decision-packet.md`](./decision-findingcode-a14-bundle-content-decision-packet.md)
- [`decision-fc-1-finding-code-catalog-ownership.md`](./decision-fc-1-finding-code-catalog-ownership.md)

## 進め方（守る順序）

```text
① 業務ルールを整理する（一次情報・運用の言葉）
② どの状態を継続管理すべきか決める
③ Finding にするもの／しないものを決める
④ Issue #8 DEC 本文を Human が承認する
⑤ その内容から A-1〜A-4 を確定する
⑥ Acceptance
```

いまやるのは **①〜③を1件ずつ**。
④ は Human 承認。⑤⑥ は後工程。

## 1件ずつの記録形式（必須）

次の形式でだけ確定する。Agent が空欄を補完しない。

```text
Business State:
  （人の言葉）
System behavior:
  HARD GATE | NOTICE | OTHER（Human が明示）
Finding:
  ADOPTED | NOT ADOPTED
FindingCode:
  NONE | PENDING（Finding ADOPTED のときだけ後で命名）
継続管理:
  Findingとしては行わない | Findingとして行う
```

## 確定済み（Human Decision）

### BS-001 — 有効な支援計画がないため手順記録へ進めない

```text
ID: BS-001
Status: DECIDED（Human primary information / 2026-08-09）
Finding catalog: OUT OF SCOPE（対象外）

Business State:
  有効な支援計画がないため、支援手順記録へ進めない

System behavior:
  HARD GATE
  → その場で進行を禁止する

Finding:
  NOT ADOPTED

FindingCode:
  NONE

継続管理:
  Findingとしては行わない

Catalog implication:
  本状態は Finding catalog（A-1 値一覧）の対象外
  Issue #8 DEC 本文では「Finding にしない業務状態」側に記載する
```

流れ:

```text
支援計画なし
  ↓
手順記録へ進めない
  ↓
その場で止める
  ↓
Finding は生成しない
  ↓
FindingCode も作らない
```

分岐メモ（記録用）:

```text
Human Selected: A（hard gate のみ）
B（Finding として継続管理）: 選ばない
```

### BS-REF-01 — 見直し対象月に入った（参考・既存 Accepted）

FindingCode catalog 候補ではない。見本として残す。

```text
ID: BS-REF-01
Status: REFERENCE（GOV-RULE-06/07/08 Accepted — catalog 候補外）

Business State:
  見直し対象月に入った（「3ヶ月に1回程度」の見直し時期）

System behavior:
  NOTICE
  → 職員へ「見直し時期です」と知らせる

Finding:
  NOT ADOPTED

FindingCode:
  NONE

継続管理:
  Findingとしては行わない（情報通知のみ）
```

## Business-state table（要約）

| ID | 業務状態（人の言葉） | System behavior | Finding | FindingCode | 継続管理 | 状態 |
|---|---|---|---|---|---|---|
| BS-001 | 有効な支援計画がないため、支援手順記録へ進めない | HARD GATE | **NOT ADOPTED** | **NONE**（catalog OUT） | Findingとしては行わない | **FIXED** |
| BS-002 | 支援手順記録時に適用すべき支援手順が確認できない | HARD GATE | NOT ADOPTED | NONE（catalog OUT） | Findingとしては行わない | **CANDIDATE** |
| BS-REF-01 | 見直し対象月に入った | NOTICE | NOT ADOPTED | NONE | 情報通知のみ | REFERENCE |

## 候補 — BS-002（FIXED にしない / 現場確認待ち）

```text
ID: BS-002
Status: CANDIDATE — NOT FIXED
Evidence status: Human一次情報として未確定
Source: Human Decision candidate（既存資料からの確定一次情報ではない）
Next needed: 現場運用として正しいかの Human 確認（下記 1問）
Agent invention: NO
推測で入れない例:
  「記録が計画・手順と食い違っている状態」等は、
  現場判断が曖昧になりやすいので BS-002 では採用候補にしない
```

```text
ID: BS-002
Status: CANDIDATE（2026-08-09）

Business State:
  支援手順記録を行う時点で、
  適用すべき支援手順が確認できない

Candidate behavior:
  HARD GATE
  → 支援手順記録を確定できない

Candidate Finding:
  NOT ADOPTED

Candidate FindingCode:
  NONE

Candidate catalog scope:
  OUT

継続管理（候補）:
  Findingとしては行わない
```

理由（候補提示時の Human 説明）:

```text
BS-001 と同じ境界を固める:
  その場で操作を止めれば解決する
  入力・前提条件の不足を、何でも Finding にしない

Finding: ADOPTED の検討は BS-003 以降で、
  「その場で止めるだけではなく、
   未解決状態として継続的に追跡する必要があるもの」
  が出たときに行う
```

### BS-002 確認問（1問）

```text
問:
  「適用すべき支援手順が確認できない場合、
   支援手順記録を確定させない」運用で合っていますか？

A. 合っている → BS-002 を FIXED 候補へ
B. 違う → 内容を修正
C. 現場確認が必要 → HOLD

答え: UNSELECTED（A / B / C 待ち）
FIXED: FORBIDDEN until A かつ明示採用
```

## Finding にする／しない の判断メモ（Human 用）

Finding にしやすいもの:

- あとから見返して、未解消のまま残す意味がある状態
- 誰かが対応し、状態が変わるまで追跡したいもの

Finding にしなくてよいもの:

- その場で止めれば足りる hard gate
- 単なるお知らせ（情報通知）
- すでに「採択しない」と決めたもの（例: hard due / overdue）

## Issue #8 DEC 本文に入れる骨子（下書き枠）

Human が必要件数の ①〜③ を埋めたあと、DEC 本文の骨子は次の形にする。
番号・コード名は **Human が後で** 付ける（A-1〜A-4）。

```text
Title: （Human — FindingCode business catalog DEC）
DEC number: PENDING — Human selection（A-4）

1. 目的
   Finding として継続管理する業務状態の正本

2. Finding にする業務状態
   - （Finding = ADOPTED の行を人の言葉で列挙）

3. Finding にしない業務状態（Finding catalog 対象外）
   - BS-001: 有効な支援計画がないため手順記録へ進めない
     （HARD GATE / Finding NOT ADOPTED / FindingCode NONE / catalog OUT OF SCOPE）
   - （その他 NOT ADOPTED 行）

4. 変更管理
   追加・廃止は本 DEC の改訂による（FC-1）

5. 本 DEC では決めないもの
   - FindingCode のシステム文字列（A-1 確定まで）
   - 採番（A-2）
   - criterionId mapping（A-3）
   - A-5 representation strategy
   - Implementation Start
```

## Gate

```text
Selected Option: C
Current work: business-state inventory（1件ずつ）
BS-001: FIXED（HARD GATE / Finding NOT ADOPTED / FindingCode NONE / catalog OUT）
BS-002: CANDIDATE — NOT FIXED（Evidence 未確定 / 確認問 UNSELECTED）
A-1: PENDING
A-2: PENDING
A-3: PENDING
A-4: PENDING
Acceptance: NOT STARTED
A-5: HOLD
Implementation Start: HOLD
```

## Human への次の依頼（わかりやすく）

BS-002 について、次の1問に **A / B / C** で答えてください。

```text
「適用すべき支援手順が確認できない場合、
 支援手順記録を確定させない」運用で合っていますか？
```

- **A** … 合っている → FIXED 候補へ  
- **B** … 違う → 内容を修正  
- **C** … 現場確認が必要 → HOLD  

Agent は FindingCode 名を付けません。確認前に BS-002 を FIXED にしません。
