# Decision Packet — Decision-ILB-1 後の第3残存 Decision 選定

この文書は、GOV-AUD-05 / DEC-012 retention prohibition が
**Accepted / LOCKED**（PR #155 / #156）になったあとの
**次に判定する残存 Decision** を選ぶための Human Decision Packet である。

FindingCode / A-5 / Implementation Start ではない。
Agent が次 Decision を自動選定・自動 Accepted しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_THIRD_RESIDUAL_DECISION_SELECTION
Kind: Human Decision packet
Status: CONSUMED（Human Selected Option A — DEC-009）
Selection record: decision-ilb-1-third-residual-decision-selection.md
Depends on:
  Decision-ILB-1 HUMAN_POLICY FINAL CONSISTENT
  Decision-RD-3 FINAL CONSISTENT
  GOV-AUD-05 / DEC-012 retention prohibition Accepted / LOCKED / FINAL CONSISTENT
  PR #155 MERGED / PR #156 MERGED
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Third residual Decision: SELECTED / A
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-aud-05-dec-012-canonicalization-consistency-check.md`](./decision-gov-aud-05-dec-012-canonicalization-consistency-check.md)
- [`decision-ilb-1-residual-decision-inventory.md`](./decision-ilb-1-residual-decision-inventory.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`assessment-snapshot-result-design.md`](./assessment-snapshot-result-design.md)

## 1. Current locked state

```text
Decision-RD-3: FINAL CONSISTENT
GOV-AUD-05 / DEC-012 retention prohibition: FINAL CONSISTENT
GOV-AUD-03: Accepted / Option E
AS-EC-1 Entry #3（DEC-009）: 未（本選定前）
FindingCode / A-5 / Implementation: HOLD
```

問い:

> 次に一件判定する残存 Decision はどれですか？

## 2. Options

### Option A — DEC-009（AssessmentSnapshot 保存タイミング）— SELECTED

```text
Selected: A（2026-08-09）
Acceptance: decision-dec-009-snapshot-save-timing-acceptance.md
Meaning:
  アセスメント作成途中: 下書き扱い
  正式記録: 確定時に保存
  確定後の修正: 元の確定記録を残す
  修正後: 新しい版として保存する
  既存確定記録の上書き: NOT ADOPTED
  履歴: 保持する
Closes only: 保存タイミングの業務意味
Does NOT close: AS-EC-1 overall / Schema / FindingCode / Implementation
```

### Option B — Decision-AS-EC-1 overall Entry satisfied 宣言

```text
Note: DEC-009 単独では overall Entry を閉じない。本選定では選ばない。
```

### Option C — post-retention deletion

### Option D — DEC-015

### Option E — 別残存 Decision（Human が ID を明示）

### Option F — まだ決めない

## 3. Human Decision

```text
答え: A（2026-08-09）
Selected:
  A — DEC-009 AssessmentSnapshot save timing
Acceptance: decision-dec-009-snapshot-save-timing-acceptance.md
Selection record: decision-ilb-1-third-residual-decision-selection.md
```

```text
Agent auto-select: FORBIDDEN
AS-EC-1 overall auto-satisfied: FORBIDDEN
他 inventory 行の一括 Accepted: FORBIDDEN
```

## 4. Gate

```text
ILB1_THIRD_RESIDUAL_DECISION_SELECTION: CONSUMED / Selected A
Selected: DEC-009 Accepted / LOCKED / Option A
Decision-AS-EC-1 overall: HOLD
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
```
