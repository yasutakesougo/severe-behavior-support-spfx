# Decision Packet — Decision-ILB-1 後の第6残存 Decision 選定

この文書は、AS-EC-1 Entry #2 が PASS / MET（PR-J）になったあとの
**次に判定する残存 Decision** を選ぶための Human Decision Packet である。

主問い: **AS-EC-1 残件 Entry #5 / #6 / #7 をどう扱うか。**

FindingCode / A-5 / Implementation Start / PR-J 実装ではない。
Agent が次 Decision を自動選定・自動 Accepted しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_SIXTH_RESIDUAL_DECISION_SELECTION
Kind: Human Decision packet
Status: CONSUMED / SELECTED
Selection record: decision-ilb-1-sixth-residual-decision-selection.md
Depends on:
  AS-EC-1 Entry #2 PASS / MET（PR #161 MERGED；FINAL CONSISTENT 扱い）
  AS-EC-1 Entry #8 FINAL CONSISTENT（PR #159 / #160）
  Decision-ILB-1 HUMAN_POLICY FINAL CONSISTENT
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
PR-J implementation: DO NOT START
Sixth residual Decision: SELECTED / A — AS-EC-1 Entry #5
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`assessment-snapshot-result-design.md`](./assessment-snapshot-result-design.md) Entry Criteria #5/#6/#7
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md) Snapshot Entry 表
- [`decision-ilb-1-residual-decision-inventory.md`](./decision-ilb-1-residual-decision-inventory.md)

## 1. Current locked state

```text
AS-EC-1 Entry #1: PASS / MET
AS-EC-1 Entry #2: PASS / MET（Issue #24 / PR-J）
AS-EC-1 Entry #3（DEC-009）: Accepted / LOCKED / FINAL CONSISTENT
AS-EC-1 Entry #4（GOV-AUD-03）: Accepted / Option E
AS-EC-1 Entry #8: Accepted / LOCKED / Option A / FINAL CONSISTENT（plan only）
AS-EC-1 Entry #5: PASS / MET（本選定 Option A 後）
AS-EC-1 Entry #6 / #7: 未
AS-EC-1 overall: HOLD
FindingCode / A-5 / Implementation / PR-J impl: HOLD
```

残件（選定前）:

| # | 条件 | 選定前 |
|---|---|---|
| 5 | 完全 Finding または findingIds 参照境界 | **未** |
| 6 | サービス別 `NOT_APPLICABLE` reason 正本または HOLD 方針 | **未** |
| 7 | Schema ID / schemaVersion / DTO versioning | **未** |

## 2. Options

### Option A — Entry #5 を今判定する（Finding / findingIds）

```text
Meaning:
  AssessmentSnapshot の findingIds 参照境界を固定する
  Human 固定意味: AssessmentSnapshot は Finding / findingIds を必須参照しない
Closes only: Entry #5（findingIds = NOT REQUIRED）
Does NOT close:
  Entry #6 / #7
  AS-EC-1 overall Entry satisfied
  FindingCode 値発明 / A-5 / Implementation Start / PR-J 実装
  完全 Finding 実装
```

### Option B — Entry #6 を今判定する（NOT_APPLICABLE reason）

### Option C — Entry #7 を今判定する（Schema / DTO versioning）

### Option D — #5 / #6 / #7 をまとめて延期する

### Option E — post-retention deletion / 別 residual（#5/#6/#7 は触らない）

### Option F — まだ決めない

## 3. Explicit non-goals

```text
Agent auto-select: FORBIDDEN
AS-EC-1 overall auto-satisfied: FORBIDDEN
Implementation auto-start: FORBIDDEN
PR-J implementation: DO NOT START
FindingCode 値発明: FORBIDDEN
A-5: HOLD
TypeScript / validator / fixture / contract tests 実装: DO NOT START
SharePoint / M365 / Deploy / real data: NO-GO
```

## 4. Human Decision

```text
答え: A
Selected: A — Entry #5
Selected meaning:
  AssessmentSnapshot は Finding / findingIds を必須参照しない
Selection record: decision-ilb-1-sixth-residual-decision-selection.md
Acceptance: decision-as-ec-1-entry-5-finding-ids-boundary-acceptance.md
Boundary: assessment-snapshot-finding-ids-boundary.md
```

```text
Agent auto-select: FORBIDDEN
AS-EC-1 overall auto-satisfied: FORBIDDEN
Implementation auto-start: FORBIDDEN
PR-J implementation: DO NOT START
```
