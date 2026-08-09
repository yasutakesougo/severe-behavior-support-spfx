# Decision Packet — Decision-ILB-1 後の最初の残存 Decision 選定

この文書は、Decision-ILB-1 Human Policy が
**FINAL CONSISTENT**（PR #151 MERGED）になったあとの
**最初に制度根拠確認・判定する残存 Decision** を選ぶための
Human Decision Packet である。

Human Policy の再 Decision ではない。
inventory 行の一括 Accepted ではない。
FindingCode / A-5 / Implementation Start ではない。
Agent が次 Decision を自動選定・自動 Accepted しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_NEXT_RESIDUAL_DECISION_SELECTION
Kind: Human Decision packet
Status: CONSUMED（Human Selected Option C — Decision-RD-3）
Selection record: decision-ilb-1-next-residual-decision-selection.md
Depends on:
  Decision-ILB-1 HUMAN_POLICY Accepted / LOCKED / Option A
  Consistency: FINAL CONSISTENT
  PR #151 MERGED（e2bd256… / head 4f5a833…）
Inventory: decision-ilb-1-residual-decision-inventory.md（other rows provisional）
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
First residual Decision: SELECTED / C — Decision-RD-3
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-ilb-1-canonicalization-consistency-check.md`](./decision-ilb-1-canonicalization-consistency-check.md)
- [`decision-ilb-1-human-policy-acceptance.md`](./decision-ilb-1-human-policy-acceptance.md)
- [`decision-ilb-1-residual-decision-inventory.md`](./decision-ilb-1-residual-decision-inventory.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current locked state

```text
Decision-ILB-1 Human Policy 1–6: ACCEPTED / LOCKED / Option A / FINAL CONSISTENT
Classification frame A–E: adopted（frame only）
Inventory provisional rows: NOT Accepted
GOV-AUD-04 / 03 / DEC-008 / OP-3 / GOV-RULE-05〜08: UNCHANGED
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
```

問い:

> Human Policy に従い、制度根拠を確認したうえで
> **最初に一件ずつ判定する残存 Decision** はどれですか？

## 2. Options（候補・いずれも未 Accepted）

Provisional class は inventory の参考であり、本 packet では硬化しない。

### Option A — GOV-AUD-05（物理削除方針）

```text
Provisional class（inventory）: E
Note: 自動開始禁止。採択するなら明示 Human Decision
```

### Option B — DEC-012（論理削除データの完全削除方針）

```text
Provisional class（inventory）: E
Note: GOV-AUD-05 と分離維持
```

### Option C — Decision-RD-3（見直し接近窓・期限算出・超過後）— SELECTED

```text
Selected: C（2026-08-09）
Acceptance: decision-rd-3-monitoring-guidance-acceptance.md（Accepted / LOCKED）
Meaning:
  モニタリング時期「3か月に1回程度」を目安として表示・通知
  informational only
  期限超過 / 警告・業務制限 / 90日固定: 採用しない
  hard due / overdue: NOT ADOPTED
Boundary: GOV-RULE-08 と整合；90日発明禁止；Implementation HOLD
```

### Option D — Decision-AS-EC-1 / DEC-009 証跡整合（再 Decision ではない）

```text
Provisional class（inventory）: E
Note: Entry 表と Accepted 記載の同期確認が先。casual re-decision OUT
```

### Option E — DEC-015（バックアップ・復元責任者）

```text
Provisional class（inventory）: E
```

### Option F — 別残存 Decision（Human が ID を明示）

```text
Requires: Human が Decision ID と判定範囲を明示
```

### Option G — まだ決めない

## 3. Human Decision

```text
答え: C（2026-08-09）
Selected:
  C — Decision-RD-3
Acceptance: decision-rd-3-monitoring-guidance-acceptance.md
Selection record: decision-ilb-1-next-residual-decision-selection.md
```

```text
Agent auto-select: FORBIDDEN
Agent recommendation: NOT Human Selection evidence
GOV-AUD-05 auto-Accepted: FORBIDDEN
他 inventory 行の一括 Accepted: FORBIDDEN
```

## 4. Gate

```text
ILB1_NEXT_RESIDUAL_DECISION_SELECTION: CONSUMED / Selected C
Selected residual Decision: Decision-RD-3
  → Accepted / LOCKED（informational monitoring guidance）
他行: provisional のまま
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
```
