# Decision Packet — Decision-ILB-1 後の第6残存 Decision 選定

この文書は、AS-EC-1 Entry #2 が **FINAL CONSISTENT**（PR #161 MERGED）になったあとの
**次に判定する残存 Decision** を選ぶための Human Decision Packet である。

主問い: **AS-EC-1 残件 Entry #5 / #6 / #7 をどう扱うか。**

FindingCode / A-5 / Implementation Start / PR-J 実装ではない。
Agent が次 Decision を自動選定・自動 Accepted しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_SIXTH_RESIDUAL_DECISION_SELECTION
Kind: Human Decision packet
Status: OPEN / NOT SELECTED
Selection record: NOT YET（Human 選定後に作成）
Depends on:
  AS-EC-1 Entry #2 FINAL CONSISTENT（PR #161 MERGED）
  AS-EC-1 Entry #8 FINAL CONSISTENT（PR #159 / #160）
  Decision-ILB-1 HUMAN_POLICY FINAL CONSISTENT
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
PR-J implementation: DO NOT START
Sixth residual Decision: NOT SELECTED
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-as-ec-1-entry-2-canonicalization-consistency-check.md`](./decision-as-ec-1-entry-2-canonicalization-consistency-check.md)
- [`assessment-snapshot-result-design.md`](./assessment-snapshot-result-design.md) Entry Criteria #5/#6/#7
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md) Snapshot Entry 表
- [`decision-ilb-1-residual-decision-inventory.md`](./decision-ilb-1-residual-decision-inventory.md)

## 1. Current locked state

```text
AS-EC-1 Entry #1: PASS / MET
AS-EC-1 Entry #2: PASS / MET / FINAL CONSISTENT（Issue #24 / PR-J）
AS-EC-1 Entry #3（DEC-009）: Accepted / LOCKED / FINAL CONSISTENT
AS-EC-1 Entry #4（GOV-AUD-03）: Accepted / Option E
AS-EC-1 Entry #8: Accepted / LOCKED / Option A / FINAL CONSISTENT（plan only）
AS-EC-1 Entry #5 / #6 / #7: 未
AS-EC-1 overall: HOLD
FindingCode / A-5 / Implementation / PR-J impl: HOLD
```

残件（Entry Criteria 正本より）:

| # | 条件 | 現状 |
|---|---|---|
| 5 | 完全 Finding または findingIds 参照境界 | **未**（SEV / FC / 完全 Finding 依存） |
| 6 | サービス別 `NOT_APPLICABLE` reason 正本または HOLD 方針 | **未** |
| 7 | Schema ID / schemaVersion / DTO versioning | **未** |

問い:

> 次に一件判定する残存 Decision はどれですか？
> （特に Entry #5 / #6 / #7 を今どう扱うか）

## 2. Options

### Option A — Entry #5 を今判定する（Finding / findingIds）

```text
Meaning:
  完全 Finding 契約または findingIds 参照境界を Human Decision する
Closes only: Entry #5（またはその HOLD 方針の明示）
Does NOT close:
  Entry #6 / #7
  AS-EC-1 overall Entry satisfied
  FindingCode 値発明 / A-5 / Implementation Start / PR-J 実装
Note: FindingCode catalog は DEC-019 EMPTY / FC HOLD と衝突しうる。
  値発明禁止を維持したまま「参照境界のみ」に限定できるかが論点。
```

### Option B — Entry #6 を今判定する（NOT_APPLICABLE reason）

```text
Meaning:
  サービス別 NOT_APPLICABLE reason code の正本、または HOLD 方針を固定する
Closes only: Entry #6
Does NOT close: Entry #5 / #7 / overall / Implementation / PR-J 実装
```

### Option C — Entry #7 を今判定する（Schema / DTO versioning）

```text
Meaning:
  Schema ID / schemaVersion / DTO versioning 方針を固定する
Closes only: Entry #7（方針のみ。物理列・SharePoint 実装は含めない）
Does NOT close: Entry #5 / #6 / overall / SharePoint / DTO 実装 / PR-J 実装
```

### Option D — #5 / #6 / #7 をまとめて延期する

```text
Meaning:
  三件とも 未 のまま維持し、別タイミングまで判定しない
  overall は HOLD のまま
Does NOT authorize: overall leave-HOLD / Implementation Start / PR-J 実装
```

### Option E — post-retention deletion / 別 residual（#5/#6/#7 は触らない）

### Option F — まだ決めない

```text
Next residual Decision: NOT SELECTED を維持
```

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
答え: （未記入 — Human が A〜F を選ぶ）
Selected: NOT SELECTED
```

```text
Agent auto-select: FORBIDDEN
AS-EC-1 overall auto-satisfied: FORBIDDEN
Implementation auto-start: FORBIDDEN
PR-J implementation: DO NOT START
```
