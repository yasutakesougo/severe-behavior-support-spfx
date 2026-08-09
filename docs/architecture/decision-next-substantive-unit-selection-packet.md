# Decision Packet — 次 substantive unit 選定（post GOV-AUD-04）

この文書は、GOV-AUD-04 が **FINAL CONSISTENT**（PR #149 / #150 MERGED）になったあとの
**次 substantive unit 選定** のための Human Decision Packet である。

FindingCode 値作成ではない。
A-5 ではない。
Implementation Start ではない。
Agent が次 unit を自動選定しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: NEXT_SUBSTANTIVE_UNIT_SELECTION
Kind: Human Decision packet
Status: CONSUMED（Human Selected Option F — Decision-ILB-1）
Selection record: decision-next-substantive-unit-selection.md
Depends on:
  GOV-AUD-04 Accepted / LOCKED / Option E
  Consistency: FINAL CONSISTENT
  PR #149 MERGED（cb14c13…）
  PR #150 MERGED（f97d072…）
Prior CONSUMED:
  prior-B — GOV-AUD-03 Accepted / Option E
  C — Decision-OP-3 Accepted / LOCKED / Option A
  E — DEC-008 提出・差戻し Accepted / LOCKED / Option C
  B — GOV-AUD-04 Accepted / LOCKED / Option E
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Next substantive unit: SELECTED / F — Decision-ILB-1
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-aud-04-canonicalization-consistency-check.md`](./decision-gov-aud-04-canonicalization-consistency-check.md)
- [`decision-ilb-1-institutional-local-boundary-decision-packet.md`](./decision-ilb-1-institutional-local-boundary-decision-packet.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current locked state

```text
GOV-AUD-04: Accepted / LOCKED / Option E / FINAL CONSISTENT
GOV-AUD-03: Accepted / Option E
GOV-AUD-05: OUT / DO NOT START unless newly selected
DEC-008 submit/return: FINAL CONSISTENT / Option C
Decision-OP-3: FINAL CONSISTENT
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
```

問い:

> 次に着手する substantive unit はどれですか？

## 2. Options（候補）

### Option A — DEC-009 — OUT for re-decision

```text
Status: OUT for re-decision（Human: already Accepted attested in some docs；AS-EC-1 表は未同期）
Do not re-open as next unit here
```

### Option B — Issue #19 最小 GOV-AUD 残件（例: GOV-AUD-05）

```text
Requires: Human が対象 GOV-AUD ID を明示
Note: GOV-AUD-04 だけでは GOV-AUD-05 を自動開始しない
```

### Option C — Decision-OP-3 — CONSUMED

### Option D — Decision-RD-3（接近窓 / 算出 / 超過後）

```text
Boundary: GOV-RULE-08 NOT ADOPTED を開始信号にしない；90日発明禁止
```

### Option E — DEC-008 提出・差戻し — CONSUMED

### Option F — 別単位（Human が明示）— SELECTED

```text
Selected unit name（Human）:
  制度要件とローカルルールの境界整理
Decision ID: Decision-ILB-1
```

### Option G — まだ決めない

## 3. Human Decision

```text
答え: F（2026-08-09）
Selected:
  F — 制度要件とローカルルールの境界整理
  Decision-ILB-1
Scope:
  生活介護・強度行動障害支援について、
  制度上必須のルールと、
  制度が要求していない application 独自ルールを分離する
Purpose:
  残存 Decision を
  「制度上必要か」→「法人 Human Decision か」→「現場裁量か」
  の順で判断できる状態にする
Selection record: decision-next-substantive-unit-selection.md
```

## 4. Gate

```text
NEXT_SUBSTANTIVE_UNIT_SELECTION: CONSUMED / Selected F
Selected unit: Decision-ILB-1
Packet: decision-ilb-1-institutional-local-boundary-decision-packet.md
Inventory: decision-ilb-1-residual-decision-inventory.md
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Classification Accepted: NOT YET
```
