# Decision Packet — Decision-ILB-1 後の第2残存 Decision 選定

この文書は、Decision-RD-3 が **FINAL CONSISTENT**（PR #153 / #154 MERGED）になったあとの
**次に制度根拠確認・判定する残存 Decision** を選ぶための
Human Decision Packet である。

FindingCode / A-5 / Implementation Start ではない。
Agent が次 Decision を自動選定・自動 Accepted しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_SECOND_RESIDUAL_DECISION_SELECTION
Kind: Human Decision packet
Status: CONSUMED（Human Selected Option A — GOV-AUD-05 / DEC-012）
Selection record: decision-ilb-1-second-residual-decision-selection.md
Depends on:
  Decision-ILB-1 HUMAN_POLICY FINAL CONSISTENT
  Decision-RD-3 FINAL CONSISTENT
  PR #153 MERGED（7752002… / head 2a5da13…）
  PR #154 MERGED（f8f9f6a… / head ec33ef5…）
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Second residual Decision: SELECTED / A
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-rd-3-canonicalization-consistency-check.md`](./decision-rd-3-canonicalization-consistency-check.md)
- [`decision-ilb-1-residual-decision-inventory.md`](./decision-ilb-1-residual-decision-inventory.md)
- [`decision-aud-ret-1-auditlog-retention.md`](./decision-aud-ret-1-auditlog-retention.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current locked state

```text
Decision-RD-3: Accepted / LOCKED / FINAL CONSISTENT
Decision-ILB-1 Human Policy: FINAL CONSISTENT
Decision-AUD-RET-1: Accepted（最低5年 / 自動削除トリガにしない）
GOV-AUD-04: Accepted / Option E
FindingCode / A-5 / Implementation: HOLD
```

問い:

> 次に一件判定する残存 Decision はどれですか？

## 2. Options

### Option A — GOV-AUD-05 / DEC-012（法定保存期間中の完全削除禁止）— SELECTED

```text
Selected: A（2026-08-09）
Acceptance: decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md
Meaning:
  法定保存期間中: 完全削除を禁止する
  保存期間: 5年間
  5年経過後: 削除可否は別 Decision
  5年経過後の自動完全削除: NOT ADOPTED
  物理削除の自動実行: NOT ADOPTED
Closes only: 「5年間は完全削除しない」
```

### Option B — DEC-012 単独（本選定では A に包含）

```text
Note: 本 Human Decision では GOV-AUD-05 と同一 Acceptance 範囲で扱う。
post-retention deletion は別 Decision のまま分離。
```

### Option C — Decision-RD-3 — CONSUMED

### Option D — Decision-AS-EC-1 / DEC-009 証跡整合

### Option E — DEC-015

### Option F — 別残存 Decision（Human が ID を明示）

### Option G — まだ決めない

## 3. Human Decision

```text
答え: A（2026-08-09）
Selected:
  A — GOV-AUD-05 / DEC-012 retention-period complete-deletion prohibition
Acceptance: decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md
Selection record: decision-ilb-1-second-residual-decision-selection.md
```

```text
Agent auto-select: FORBIDDEN
post-retention deletion auto-Accepted: FORBIDDEN
他 inventory 行の一括 Accepted: FORBIDDEN
```

## 4. Gate

```text
ILB1_SECOND_RESIDUAL_DECISION_SELECTION: CONSUMED / Selected A
Selected: GOV-AUD-05 / DEC-012（retention prohibition）Accepted / LOCKED
post-retention deletion: OPEN / 別 Decision
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
```
