# Decision Packet — 次 substantive unit 選定（post Decision-OP-3）

この文書は、Decision-OP-3 が **FINAL CONSISTENT**（PR #146 MERGED）になったあとの
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
Status: CONSUMED（Human Selected Option E after OP-3 FINAL CONSISTENT）
Selection record: decision-next-substantive-unit-selection.md
Depends on:
  Decision-OP-3 Accepted / LOCKED / Option A
  Consistency: FINAL CONSISTENT
  PR #146 MERGED（42b251b… / head 974d083…）
Prior CONSUMED:
  B — GOV-AUD-03 Accepted / Option E（PR #145）
  C — Decision-OP-3 Accepted / LOCKED / Option A（PR #146）
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Next substantive unit: SELECTED / E — DEC-008 提出・差戻しロール
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-op-3-canonicalization-consistency-check.md`](./decision-op-3-canonicalization-consistency-check.md)
- [`decision-op-3-observation-period-schema-acceptance.md`](./decision-op-3-observation-period-schema-acceptance.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`implementation-entry-decision-reaudit.md`](./implementation-entry-decision-reaudit.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current locked state

```text
Decision-OP-3: Accepted / LOCKED / FINAL CONSISTENT
GOV-AUD-03: Accepted / Option E
DEC-008（制度上の作成者 / 独立最終承認者）: Accepted / LOCKED / CONSISTENT
Finding catalog DEC-019: Accepted / EMPTY / NOT ADOPTED
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
```

問い:

> 次に着手する substantive unit はどれですか？

## 2. 判断単位の分離（混ぜない）

| ID | 扱い |
|---|---|
| Decision-OP-3 | **closed / LOCKED** — 再開しない |
| GOV-AUD-03 | **closed / Option E** — 再開しない |
| DEC-009 | **再 Decision しない**（Human: 既存正本で Accepted 済み） |
| FindingCode 値作成 | **OUT / HOLD** |
| A-5 | **OUT / HOLD** |
| Implementation Start | **OUT / HOLD** |
| SharePoint / Deploy / real data | **NO-GO** |
| 日数・期限 invention | **FORBIDDEN** |
| 次 substantive unit | **本 packet** |

## 3. Options（候補）

### Option A — DEC-009（AssessmentSnapshot 保存タイミング）— OUT for re-decision

```text
Status: OUT for re-decision（Human reason: already Accepted in existing canonical docs）
Do not re-open as next unit
```

### Option B — Issue #19 最小 GOV-AUD 残件（01 / 04 / 05 等）

```text
Meaning:
  GOV-AUD-03 は CONSUMED。別の最小 GOV-AUD 単位を選ぶ
Requires:
  Human が対象 GOV-AUD ID を明示する
```

### Option C — Decision-OP-3 — CONSUMED

```text
Status: CONSUMED / FINAL CONSISTENT
Do not re-select
```

### Option D — Decision-RD-3（接近窓 / 算出 / 超過後）

```text
Boundary:
  GOV-RULE-08 NOT ADOPTED を開始信号にしない
  90日 / overdue を発明しない
```

### Option E — DEC-008 残面（提出・差戻しロール）のみ

```text
Meaning:
  制度上の作成者 / 独立最終承認者は触らず、
  提出・差戻しロールだけを狭域 Decision する
OUT:
  制度上の作成者の再決定
  独立最終承認者の再導入
```

### Option F — 別単位（Human が明示）

```text
Requires: 単位名を Human が記入
Agent MUST NOT invent the unit name
```

### Option G — まだ決めない

```text
Meaning: Next substantive unit は NOT SELECTED のまま
```

## 4. Explicit non-options（選ばない）

```text
FindingCode values invention / catalog fill
A-5 UUID/hash/semver invention
Implementation Start
DEC-009 re-decision
Decision-OP-3 / GOV-AUD-03 re-open
hard due / overdue implementation
SharePoint / M365 / Deploy / real data
```

## 5. Agent recommendation

```text
Recommended: NONE（自動選定しない）
```

## 6. Human Decision

```text
問:
  次に着手する substantive unit はどれですか？

答え: E（2026-08-09）— after OP-3 FINAL CONSISTENT
Scope:
  支援計画シートの提出ロール
  支援計画シートの差戻しロール
OUT:
  制度上の作成者の再決定
  独立最終承認者の再導入
  FindingCode / A-5 / Implementation Start
Selection record: decision-next-substantive-unit-selection.md
```

## 7. Gate

```text
Decision-OP-3: FINAL CONSISTENT
NEXT_SUBSTANTIVE_UNIT_SELECTION: CONSUMED / Selected E
Selected unit: DEC-008 submit / return roles
Acceptance: Option C / LOCKED
  → decision-dec-008-submit-return-roles-acceptance.md
Consistency: DOCS CONSISTENT / MERGE PENDING（PR #147）
Independent Review: PASS（d1b5d544… / P0=0 / P1=0 / P2=0）
Path: Ready 化 → Human Merge Decision
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
```
