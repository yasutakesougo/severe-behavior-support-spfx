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
| BS-001 | 有効な支援計画がないため、支援手順記録へ進めない | HARD GATE | **NOT ADOPTED** | **NONE** | Findingとしては行わない | **DECIDED** |
| BS-REF-01 | 見直し対象月に入った | NOTICE | NOT ADOPTED | NONE | 情報通知のみ | REFERENCE |
| （次） | （Human が1件提示） | | | | | OPEN |

## 未決（次の1件）

```text
Next: Human が次の Business State を同じ形式で1件提示する
Agent: 候補を発明しない / FindingCode を命名しない
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

3. Finding にしない業務状態
   - BS-001: 有効な支援計画がないため手順記録へ進めない
     （HARD GATE / Finding NOT ADOPTED / FindingCode NONE）
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
BS-001: DECIDED（HARD GATE / Finding NOT ADOPTED / FindingCode NONE）
A-1: PENDING
A-2: PENDING
A-3: PENDING
A-4: PENDING
Acceptance: NOT STARTED
A-5: HOLD
Implementation Start: HOLD
```

## Human への次の依頼（わかりやすく）

1. **次の業務状態を1件**、上と同じ形式で書いてください
2. Finding にする / しない をその1件で決めてください
3. 必要件数がそろったら Issue #8 の DEC 本文案を Human が承認します
4. そのあとで初めて A-1〜A-4（コード名・採番など）を決めます

Agent は FindingCode 名を付けません。次の候補を勝手に増やしません。
