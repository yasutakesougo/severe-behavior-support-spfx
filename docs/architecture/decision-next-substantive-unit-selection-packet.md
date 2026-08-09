# Decision Packet — 次 substantive unit 選定（post Decision-OP-3）

この文書は、Decision-OP-3 が **Accepted / LOCKED**（docs DOCS CONSISTENT）になったあとの
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
Status: OPEN / READY_FOR_HUMAN_DECISION
Selection record: decision-next-substantive-unit-selection.md
Depends on:
  Decision-OP-3 Accepted / LOCKED / Option A
  Acceptance: decision-op-3-observation-period-schema-acceptance.md
  Logical contract: observation-period-schema-contract.md
  Consistency: decision-op-3-canonicalization-consistency-check.md
    （DOCS CONSISTENT / PR #146 Merge → Final CONSISTENT）
Prior CONSUMED:
  B — GOV-AUD-03 Accepted / Option E（PR #145）
  C — Decision-OP-3 Accepted / LOCKED / Option A（PR #146）
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Next substantive unit: NOT SELECTED
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
Decision-OP-3: Accepted / LOCKED / Option A
  periodFrom: REQUIRED
  periodTo: REQUIRED
  Open-ended periodTo: NOT ADOPTED
  制度日数・既定観察窓の domain 埋め込み: NOT ADOPTED
  evaluateObservationPeriodMembership: UNCHANGED
GOV-AUD-03: Accepted / Option E
DEC-008: Accepted / LOCKED / CONSISTENT
Finding catalog DEC-019: Accepted / EMPTY / NOT ADOPTED
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Next substantive unit: NOT SELECTED
```

問い:

> 次に着手する substantive unit はどれですか？

## 2. 判断単位の分離（混ぜない）

| ID | 扱い |
|---|---|
| Decision-OP-3 | **closed / LOCKED** — 再開しない |
| GOV-AUD-03 | **closed / Option E** — 再開しない |
| FindingCode 値作成 | **OUT / HOLD** |
| A-5 | **OUT / HOLD** |
| Implementation Start | **OUT / HOLD** |
| SharePoint / Deploy / real data | **NO-GO** |
| 日数・期限 invention | **FORBIDDEN** |
| 次 substantive unit | **本 packet** |

## 3. Options（候補）

### Option A — DEC-009（AssessmentSnapshot 保存タイミング）

```text
Meaning:
  AS-EC-1 unlock 向けに、Snapshot 保存タイミングを Human Decision する
Does NOT start:
  Schema / SharePoint / 保存実装
```

### Option B — Issue #19 最小 GOV-AUD 残件（01 / 04 / 05 等）

```text
Meaning:
  GOV-AUD-03 は CONSUMED。別の最小 GOV-AUD 単位を選ぶ
Requires:
  Human が対象 GOV-AUD ID を明示する
```

### Option C — Decision-OP-3（観察期間 Schema）— CONSUMED

```text
Status: CONSUMED / Accepted / LOCKED / Option A
Do not re-select as next unit
```

### Option D — Decision-RD-3（接近窓 / 算出 / 超過後）

```text
Meaning:
  見直し接近窓等を扱う
Boundary:
  GOV-RULE-08 NOT ADOPTED を開始信号にしない
  90日 / overdue を発明しない
```

### Option E — DEC-008 残面（提出・差戻しロール）のみ

```text
Meaning:
  制度上の作成者 / 独立最終承認者は触らず、
  提出・差戻しロールだけを狭域 Decision する
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
FC-7
SEV-2-ASSIGN / FindingSeverity restart
hard due / overdue implementation
Decision-OP-3 re-open / day-count invention
SharePoint / M365 / Deploy / real data
```

## 5. Agent recommendation

```text
Recommended: NONE（自動選定しない）
Note:
  OP-3 Acceptance / 整合確認の正本化が先。
  PR #146 Merge 後に Human が選ぶのが安全。
  FindingCode / A-5 / Implementation は HOLD 維持。
  安全な候補の例: A（DEC-009）/ B（明示 GOV-AUD ID）/ E。
  D は GOV-RULE-08 NOT ADOPTED 境界を厳守する場合のみ。
```

## 6. Human Decision

```text
問:
  次に着手する substantive unit はどれですか？

A. DEC-009（AssessmentSnapshot 保存タイミング）
B. Issue #19 最小 GOV-AUD 残件（対象 ID を明示）
C. Decision-OP-3 — CONSUMED（選ばない）
D. Decision-RD-3（接近窓等）
E. DEC-008 残面（提出・差戻しロール）のみ
F. 別単位（単位名を明示）
G. まだ決めない

答え: （Human 記入）
Scope: （Human 記入）
```

## 7. Gate

```text
Decision-OP-3: Accepted / LOCKED / DOCS CONSISTENT
PR #146: Merge → Final CONSISTENT
NEXT_SUBSTANTIVE_UNIT_SELECTION: OPEN / NOT SELECTED
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Agent auto-select: FORBIDDEN
```
