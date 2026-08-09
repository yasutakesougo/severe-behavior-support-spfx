# Decision Packet — Decision-ILB-1 後の第5残存 Decision 選定

この文書は、AS-EC-1 Entry #8 が **FINAL CONSISTENT**（PR #159 MERGED）になったあとの
**次に判定する残存 Decision** を選ぶための Human Decision Packet である。

主問い: **Entry #2 の不足（完全契約 PR 境界）を今埋めるか。**

FindingCode / A-5 / Implementation Start ではない。
Agent が次 Decision を自動選定・自動 Accepted しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_FIFTH_RESIDUAL_DECISION_SELECTION
Kind: Human Decision packet
Status: OPEN / NOT SELECTED
Selection record: NOT YET（Human 選定後に作成）
Depends on:
  AS-EC-1 Entry #8 FINAL CONSISTENT（PR #159 MERGED）
  Entry #1/#2 read-only audit（#1 PASS / #2 PARTIAL）
  Decision-ILB-1 HUMAN_POLICY FINAL CONSISTENT
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Fifth residual Decision: NOT SELECTED
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-as-ec-1-entry-8-canonicalization-consistency-check.md`](./decision-as-ec-1-entry-8-canonicalization-consistency-check.md)
- [`decision-as-ec-1-entry-1-2-read-only-consistency-audit.md`](./decision-as-ec-1-entry-1-2-read-only-consistency-audit.md)
- [`decision-ilb-1-residual-decision-inventory.md`](./decision-ilb-1-residual-decision-inventory.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

## 1. Current locked state

```text
AS-EC-1 Entry #8: Accepted / LOCKED / Option A / FINAL CONSISTENT
AS-EC-1 Entry #1: PASS / MET
AS-EC-1 Entry #2: PARTIAL / NOT FULLY MET
AS-EC-1 Entry #3（DEC-009）: Accepted / LOCKED / FINAL CONSISTENT
AS-EC-1 Entry #4（GOV-AUD-03）: Accepted / Option E
AS-EC-1 Entry #5 / #6 / #7: 未
AS-EC-1 overall: HOLD
FindingCode / A-5 / Implementation: HOLD
```

Entry #2 残ギャップ（監査正本より）:

```text
完全契約実装の専用 PR 字母: 未割当
保存・DTO・findingIds・確定の PR 境界: 未固定
```

問い:

> 次に一件判定する残存 Decision はどれですか？
> （特に Entry #2 の不足を今埋めるか）

## 2. Options

### Option A — Entry #2 を今埋めて PASS 化する

```text
Meaning:
  AssessmentSnapshot 完全契約トラックの所有 Issue（#24 維持可）と
  実装前 PR 境界（字母または「実装 GO 前は未採番でよい」の明示）を記録し、
  Entry #2 を PASS / MET へ上げる
Closes only: Entry #2 ownership / PR-boundary gap
Does NOT close:
  AS-EC-1 overall Entry satisfied
  Entry #5 / #6 / #7
  TypeScript / validator / fixture / contract tests 実装
  Implementation Start
```

### Option B — Entry #2 は PARTIAL のまま延期する

```text
Meaning:
  完全契約 PR 境界の固定を後回しにする
  Entry #2 は PARTIAL / NOT FULLY MET を維持
  overall は HOLD のまま
Does NOT authorize: overall leave-HOLD / Implementation Start
```

### Option C — Entry #5 / #6 / #7 を一件選ぶ（Entry #2 は触らない）

```text
Note: Finding / findingIds・NOT_APPLICABLE reason・Schema/DTO のいずれか。
Entry #2 PARTIAL は残る。overall 自動充足禁止。
```

### Option D — post-retention deletion / 別 residual

### Option E — まだ決めない

```text
Next residual Decision: NOT SELECTED を維持
```

## 3. Explicit non-goals

```text
Agent auto-select: FORBIDDEN
AS-EC-1 overall auto-satisfied: FORBIDDEN
Implementation auto-start: FORBIDDEN
FindingCode / A-5: HOLD
TypeScript / validator / fixture / contract tests 実装: DO NOT START
SharePoint / M365 / Deploy / real data: NO-GO
```

## 4. Human Decision

```text
答え: （未記入 — Human が A〜E を選ぶ）
Selected: NOT SELECTED
```

```text
Agent auto-select: FORBIDDEN
AS-EC-1 overall auto-satisfied: FORBIDDEN
Implementation auto-start: FORBIDDEN
```
