# GOV-STAFF-02 — Entra IDグループから削除する実施者 — Human Acceptance（SELECT）

この文書は、**GOV-STAFF-02** に対する Human Selection（unit）の Acceptance 正本である。
Option A–D の採択本文は Option B Acceptance を正本とする。

Packet:
[`decision-gov-staff-02-entra-group-removal-operator-selection.md`](./decision-gov-staff-02-entra-group-removal-operator-selection.md)

Decision Packet:
[`decision-gov-staff-02-entra-group-removal-operator-decision-packet.md`](./decision-gov-staff-02-entra-group-removal-operator-decision-packet.md)

Depends on（再 Decision しない）:
- [`decision-issue-19-residual-governance-acceptance.md`](./decision-issue-19-residual-governance-acceptance.md)
- GOV-STAFF-01 Accepted / LOCKED / Option C（PR #274 MERGED）
- GOV-RULE-09〜12 / GOV-AUD-01〜10 Accepted（該当分）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-STAFF-02-SELECTION-1
Status: Accepted / LOCKED（Selection boundary / unit）
Human Decision: SELECT GOV-STAFF-02
Human Acceptance date: 2026-08-12
Issue: #19
Baseline tip: 76563ce303c5ed4bd985c96d36d457257c18223f
PR: #275（Selection / Packet / SELECT Acceptance / Option B Acceptance / IR）

Selected unit:
  GOV-STAFF-02 — Entra IDグループから削除する実施者

Concrete Option A–D: Accepted / LOCKED / Option B
  （decision-gov-staff-02-entra-group-removal-operator-option-b-acceptance.md）
Implementation Start: NOT AUTHORIZED
Entra / M365 mutation: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
Next residual auto-select: FORBIDDEN
GOV-STAFF-03〜12 auto-SELECT: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: SELECT GOV-STAFF-02
Decision-GOV-STAFF-02-SELECTION-1: Accepted / LOCKED

Meaning:
  authorize GOV-STAFF-02 as the current residual Decision unit
  record Option B Acceptance in the same Draft PR（Human Decision）
  keep Implementation Start / Entra mutation / Issue Close / GOV-STAFF-03+ unauthorized
```

## Boundary

```text
SELECT GOV-STAFF-02 ≠ Entra / M365 mutation GO
SELECT GOV-STAFF-02 ≠ invent deletion runbook / automation
SELECT GOV-STAFF-02 ≠ designate named individuals
SELECT GOV-STAFF-02 ≠ GOV-STAFF-03〜12 SELECT
SELECT GOV-STAFF-02 ≠ Issue #19 Close
SELECT GOV-STAFF-02 ≠ Implementation Start
```

## Current execution snapshot

```text
Parent track = SELECTED / LOCKED / MERGED
GOV-STAFF-01 = COMPLETE（Option C）
Current residual unit = SELECTED / LOCKED（GOV-STAFF-02）
Option Acceptance = Accepted / LOCKED / Option B
```

## Next

```text
1. This PR Independent Review
2. Human Ready（HUMAN-ONLY）
3. Human Merge（HUMAN-ONLY） → main mirror
4. After Merge: next residual SELECT = separate Human Decision
```

## Reference

- Selection: `decision-gov-staff-02-entra-group-removal-operator-selection.md`
- Decision Packet: `decision-gov-staff-02-entra-group-removal-operator-decision-packet.md`
- Option B Acceptance: `decision-gov-staff-02-entra-group-removal-operator-option-b-acceptance.md`
- Independent Review: `decision-gov-staff-02-entra-group-removal-operator-independent-review.md`
- Parent: `decision-issue-19-residual-governance-selection.md`
