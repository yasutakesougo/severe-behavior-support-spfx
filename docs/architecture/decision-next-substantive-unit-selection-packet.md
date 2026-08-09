# Decision Packet — 次 substantive unit 選定（post GOV-AUD-04）

この文書は、GOV-AUD-04 が **FINAL CONSISTENT**（PR #149 MERGED）になったあとの
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
  GOV-AUD-04 Accepted / LOCKED / Option E
  Consistency: FINAL CONSISTENT
  PR #149 MERGED（cb14c13… / head 55112f4…）
Prior CONSUMED:
  prior-B — GOV-AUD-03 Accepted / Option E
  C — Decision-OP-3 Accepted / LOCKED / Option A
  E — DEC-008 提出・差戻し Accepted / LOCKED / Option C
  B — GOV-AUD-04 Accepted / LOCKED / Option E
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Next substantive unit: NOT SELECTED
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-aud-04-canonicalization-consistency-check.md`](./decision-gov-aud-04-canonicalization-consistency-check.md)
- [`decision-gov-aud-04-logical-delete-role-acceptance.md`](./decision-gov-aud-04-logical-delete-role-acceptance.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`implementation-entry-decision-reaudit.md`](./implementation-entry-decision-reaudit.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current locked state

```text
GOV-AUD-04: Accepted / LOCKED / Option E / FINAL CONSISTENT
  論理削除許可ロール: application 層対象外
  具体ロール: NOT ADOPTED / NOT DEFINED
GOV-AUD-03: Accepted / Option E
GOV-AUD-05: OUT / DO NOT START unless newly selected
DEC-008 submit/return: FINAL CONSISTENT / Option C
Decision-OP-3: FINAL CONSISTENT
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
| GOV-AUD-04 | **closed / Option E** — 再開しない |
| GOV-AUD-03 | **closed / Option E** — 再開しない |
| DEC-008 submit/return | **closed / Option C** — 再開しない |
| Decision-OP-3 | **closed / LOCKED** — 再開しない |
| DEC-009 | **再 Decision しない**（Human: already Accepted） |
| FindingCode 値作成 | **OUT / HOLD** |
| A-5 | **OUT / HOLD** |
| Implementation Start | **OUT / HOLD** |
| SharePoint / Deploy / real data | **NO-GO** |
| 次 substantive unit | **本 packet** |

## 3. Options（候補）

### Option A — DEC-009 — OUT for re-decision

```text
Status: OUT for re-decision
Do not re-open as next unit
```

### Option B — Issue #19 最小 GOV-AUD 残件（例: GOV-AUD-05）

```text
Meaning:
  GOV-AUD-03 / 04 は CONSUMED。
  別の最小 GOV-AUD 単位を選ぶ（例: GOV-AUD-05 物理削除方針）
Requires:
  Human が対象 GOV-AUD ID を明示する
Note:
  GOV-AUD-04 Acceptance だけでは GOV-AUD-05 を自動開始しない
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

### Option E — DEC-008 提出・差戻し — CONSUMED

```text
Status: CONSUMED / Option C
Do not re-select
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
GOV-AUD-03 / GOV-AUD-04 / Decision-OP-3 / DEC-008 submit-return re-open
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

A. DEC-009 — OUT for re-decision
B. Issue #19 最小 GOV-AUD 残件（対象 ID を明示）
C. Decision-OP-3 — CONSUMED
D. Decision-RD-3（接近窓等）
E. DEC-008 提出・差戻し — CONSUMED
F. 別単位（単位名を明示）
G. まだ決めない

答え: （Human 記入）
Scope: （Human 記入）
```

## 7. Gate

```text
GOV-AUD-04: FINAL CONSISTENT
NEXT_SUBSTANTIVE_UNIT_SELECTION: OPEN / NOT SELECTED
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Agent auto-select: FORBIDDEN
```
