# FIELD-STAFF-MULTI-USER-UX-SIMULATION-1

この文書は **複数利用者記録 UX の synthetic harness 評価** の repository SSOT である。
本番ホスト受入ではない。UI 実装 GO ではない。

[`production-field-staff-acceptance-1.md`](./production-field-staff-acceptance-1.md)
の FIELD_STAFF 本番受入と意味を混ぜない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: FIELD-STAFF-MULTI-USER-UX-SIMULATION-1
Kind: browser / synthetic harness UX observation
Status: COMPLETE WITH UX GAPS
authoritative main: ba573ee9b04d780aae36acf31f67427d49ddb90c
Environment: browser / synthetic harness
Production host: NO
Production data: NOT USED
LIVE WRITE: HOLD
Artifact A fixture modification: NONE
Redeploy: NONE
This simulation: != production acceptance
This simulation: != LIVE WRITE verification
This simulation: != production data validation
This closeout: != UX Implementation GO
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Verdict

```text
FIELD-STAFF-MULTI-USER-UX-SIMULATION-1:
COMPLETE WITH UX GAPS

MULTI-USER SCALE ACCEPTANCE:
EVALUATED IN HARNESS ONLY

Production acceptance:
NOT CLAIMED

4 / 6 / 18 user production-host PASS/FAIL:
NOT CLAIMED
```

These observations **!= production-scale PASS**.

## 2. Scenarios

| Scenario | Roster | Result |
|---|---|---|
| A | 4 users / Isogo current | OBSERVED |
| B | 6 users / Honmoku current | OBSERVED |
| C | 18 users / Isogo maximum | OBSERVED |

Harness 上では 4 / 6 / 18 人の連続記録ループはいずれも可能だった。18 人は操作量が過剰である。

## 3. Positive evidence (harness only)

- 4-user loop possible
- 6-user loop possible
- 18-user loop possible, but interaction cost excessive
- current user identity remained visible/consistent
- unrecorded filter works
- 768px horizontal overflow not observed
- 18-user vertical scroll burden is substantial

Observed operational cost in the current harness flow is approximately:

```text
detail → procedure → record → save → back navigation
~8 operations per user
```

Do not treat this approximate count as a formal performance metric.

## 4. UX gaps (UI improvement requirements, not production defects)

### UX-P1 (3)

1. Fixed-user copy remains:
   - A / C-oriented list copy
   - Overview today-support assumption tied to A
2. User card does not reflect record completion state.
3. No "next unrecorded user" action.

### UX-P2 (4)

4. List scroll position is not preserved after returning.
5. 18-user layout creates excessive vertical/interaction burden.
6. Interruption/resume behavior is insufficient; draft continuity across user switching is not established.
7. Saving temporarily blocks moving efficiently to another user.

## 5. Next gate

```text
Next gate: FIELD-STAFF-MULTI-USER-UX-POLISH-1
Status: IMPLEMENTATION COMPLETE / ACCEPT / PASS
SSOT: field-staff-multi-user-ux-polish-1.md
Human confirmation: Human Acceptance GO 2026-08-18
authoritative implementation main:
  acaae9d3ac0bb261a9dee42590138fdba04805c0
closeout merge:
  8a060213bd0291fea9ecd305f36087b8d23acdbb
Implementation in this simulation closeout: NO
Unit 7: NOT STARTED
Human-selected next slice: FIELD-STAFF-NEXT-UNRECORDED-USER-1
Selection: B / UX-P1-3
Selection SSOT:
  decision-field-staff-ux-p1-3-next-unrecorded-user-selection.md
Implementation Start: recorded separately
Start SSOT:
  field-staff-next-unrecorded-user-1-implementation-start.md
Successor closeout SSOT:
  field-staff-next-unrecorded-user-1.md
Successor status: IMPLEMENTATION COMPLETE / MERGED
PR #414: MERGED / CLOSED
authoritative successor main:
  5b5496c9e31cd0c57ca12c5b0464b315e7f7f62b
This simulation closeout: != Implementation Start
This simulation closeout: != UX-P1-3 residual CLOSED
Human-selected remaining-gap slice: FIELD-STAFF-COMPLETION-ON-CARDS-1
Selection: A / UX-P1-2
Remaining-gap selection SSOT:
  decision-field-staff-ux-p1-2-completion-on-cards-selection.md
This simulation closeout: != that Implementation Start
This simulation closeout: != UX-P1-2 residual CLOSED
```

Historical design targets recorded here remain observations.
Which gaps this polish slice addressed vs left out of scope is recorded in
[`field-staff-multi-user-ux-polish-1.md`](./field-staff-multi-user-ux-polish-1.md).
Do not rewrite §4 UX gaps as if they were never observed.
UX-P1-3 is Human-selected as the next exact-slice identity
([`decision-field-staff-ux-p1-3-next-unrecorded-user-selection.md`](./decision-field-staff-ux-p1-3-next-unrecorded-user-selection.md)).
Implementation Start is recorded in
[`field-staff-next-unrecorded-user-1-implementation-start.md`](./field-staff-next-unrecorded-user-1-implementation-start.md).
Successor IMPLEMENTED / MERGED is recorded in
[`field-staff-next-unrecorded-user-1.md`](./field-staff-next-unrecorded-user-1.md).
Remaining-gap A / UX-P1-2 is recorded in
[`decision-field-staff-ux-p1-2-completion-on-cards-selection.md`](./decision-field-staff-ux-p1-2-completion-on-cards-selection.md).
Do not treat this simulation closeout as that Start or as residual CLOSED.
Do not rewrite §4 UX-P1-2 or UX-P1-3 as if they were never observed.

Expected future design targets (design only; not authorized here):

P1:

- remove fixed A/C user assumptions
- reflect record state on user cards
- next-unrecorded-user flow
- reduce wrong-user risk

P2:

- preserve list scroll/focus
- compact 18-user presentation
- define interruption/resume behavior
