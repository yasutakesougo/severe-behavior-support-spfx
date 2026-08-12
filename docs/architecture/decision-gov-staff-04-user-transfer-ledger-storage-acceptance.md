# GOV-STAFF-04 — 利用者異動台帳の保存先 — Human Acceptance（SELECT）

この文書は、**GOV-STAFF-04** に対する Human Selection（unit）の Acceptance 正本である。
Option A–D の採択本文は Option C Acceptance を正本とする。

Packet:
[`decision-gov-staff-04-user-transfer-ledger-storage-selection.md`](./decision-gov-staff-04-user-transfer-ledger-storage-selection.md)

Decision Packet:
[`decision-gov-staff-04-user-transfer-ledger-storage-decision-packet.md`](./decision-gov-staff-04-user-transfer-ledger-storage-decision-packet.md)

Depends on（再 Decision しない）:
- [`decision-issue-19-residual-governance-acceptance.md`](./decision-issue-19-residual-governance-acceptance.md)
- GOV-STAFF-03 Accepted / LOCKED / Option A（PR #277 MERGED）
- GOV-STAFF-01 / 02 Accepted（該当分）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-STAFF-04-SELECTION-1
Status: Accepted / LOCKED（Selection boundary / unit）
Human Decision: SELECT GOV-STAFF-04
Human Acceptance date: 2026-08-12
Issue: #19
Baseline tip: 46160fc524d9b13eb37a680d29017545b81cfeea
PR: pending（Selection / Packet / SELECT Acceptance / Option C Acceptance / IR）

Selected unit:
  GOV-STAFF-04 — 利用者異動台帳の保存先

Concrete Option A–D: Accepted / LOCKED / Option C
  （decision-gov-staff-04-user-transfer-ledger-storage-option-c-acceptance.md）
Implementation Start: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
Next residual auto-select: FORBIDDEN
GOV-STAFF-05〜12 auto-SELECT: FORBIDDEN
SharePoint / M365 mutation: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: SELECT GOV-STAFF-04
Decision-GOV-STAFF-04-SELECTION-1: Accepted / LOCKED

Meaning:
  authorize GOV-STAFF-04 as the current residual Decision unit
  record Option C Acceptance in the same Draft PR（Human Decision）
  keep Implementation Start / Issue Close / GOV-STAFF-05+ unauthorized
```

## Boundary

```text
SELECT GOV-STAFF-04 ≠ invent SharePoint list / site / schema
SELECT GOV-STAFF-04 ≠ store support content in the transfer ledger
SELECT GOV-STAFF-04 ≠ GOV-STAFF-05〜12 SELECT
SELECT GOV-STAFF-04 ≠ Issue #19 Close
SELECT GOV-STAFF-04 ≠ Implementation Start
```

## Current execution snapshot

```text
Parent track = SELECTED / LOCKED / MERGED
GOV-STAFF-03 = COMPLETE（Option A）
Current residual unit = SELECTED / LOCKED（GOV-STAFF-04）
Option Acceptance = Accepted / LOCKED / Option C
```

## Next

```text
1. This PR Independent Review
2. Human Ready（HUMAN-ONLY）
3. Human Merge（HUMAN-ONLY） → main mirror
4. After Merge: next residual SELECT = separate Human Decision
```

## Reference

- Selection: `decision-gov-staff-04-user-transfer-ledger-storage-selection.md`
- Decision Packet: `decision-gov-staff-04-user-transfer-ledger-storage-decision-packet.md`
- Option C Acceptance: `decision-gov-staff-04-user-transfer-ledger-storage-option-c-acceptance.md`
- Independent Review: `decision-gov-staff-04-user-transfer-ledger-storage-independent-review.md`
- Parent: `decision-issue-19-residual-governance-selection.md`
