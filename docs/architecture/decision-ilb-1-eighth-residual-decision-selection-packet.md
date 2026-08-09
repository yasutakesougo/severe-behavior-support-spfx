# Decision Packet — Decision-ILB-1 後の第8残存 Decision 選定

この文書は、AS-EC-1 Entry #6 が PASS / MET（NOT_APPLICABLE HOLD方針）になったあとの
**次に判定する残存 Decision** を選ぶための Human Decision Packet である。

主問い: **AS-EC-1 Entry #7（Schema / DTO versioning）を今閉じるか。**

FindingCode / A-5 / Implementation Start / PR-J 実装ではない。
Agent が次 Decision を自動選定・自動 Accepted しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_EIGHTH_RESIDUAL_DECISION_SELECTION
Kind: Human Decision packet
Status: CONSUMED / SELECTED
Selection record: decision-ilb-1-eighth-residual-decision-selection.md
Depends on:
  AS-EC-1 Entry #6 PASS / MET（NOT_APPLICABLE HOLD方針）
  AS-EC-1 Entry #5 PASS / MET（findingIds NOT REQUIRED）
  DEC-1 / contracts-v1.md
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
PR-J implementation: DO NOT START
Eighth residual Decision: SELECTED / A — AS-EC-1 Entry #7
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Options（要約）

### Option A — Entry #7 を DEC-1 方針で今閉じる

```text
Meaning:
  Schema / DTO versioning = DEC-1
  AssessmentSnapshot 固有 Schema ID 採番は今行わない
Closes only: Entry #7
Does NOT close: overall / Schema ID 具体値 / Implementation / PR-J
```

### Option B — Entry #7 で AssessmentSnapshot Schema ID を今採番する

```text
Note: 値発明・実装前採番になりうる。本選定では選ばない。
```

### Option C — overall leave-HOLD を先に選ぶ（#7 は触らない）

### Option D — まだ決めない

## 2. Human Decision

```text
答え: A
Selected: A — Entry #7 DEC-1 versioning 方針
Selected meaning:
  Schema / DTO versioning は DEC-1 に従う
  固有 Schema ID 採番は今行わない
Selection record: decision-ilb-1-eighth-residual-decision-selection.md
Acceptance: decision-as-ec-1-entry-7-schema-dto-versioning-acceptance.md
Policy: assessment-snapshot-schema-dto-versioning.md
```

```text
Agent auto-select: FORBIDDEN
AS-EC-1 overall auto-satisfied: FORBIDDEN
Implementation auto-start: FORBIDDEN
PR-J implementation: DO NOT START
Schema ID 発明: FORBIDDEN now
```
