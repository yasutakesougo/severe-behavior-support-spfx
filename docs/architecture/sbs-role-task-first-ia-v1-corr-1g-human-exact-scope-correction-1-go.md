# SBS-ROLE-TASK-FIRST-IA-V1 — CORR-1G Human Exact Scope Correction-1 GO

Human Exact Scope Correction-1 GO consumption for CORR-1G. This record authorizes docs-only uniqueness correction of Independent Scope Review-1 P1-1 / P1-2 / P1-3 only. It does **not** PASS Independent Scope Re-Review or authorize Implementation Start.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: CORR-1G
kind: Human Exact Scope Correction-1 GO record
mode: READ ONLY boundary record + GO consumption + docs-only Scope correction
date: 2026-09-16

Human CORR-1G Exact Scope Correction-1 GO: RECEIVED / CONSUMED

Independent Scope Review-1: CORRECTION REQUIRED / CONSUMED
  record: docs/architecture/sbs-role-task-first-ia-v1-implementation-scope-corr-1g-independent-scope-review-1.md
  reviewed scope HEAD: 9363e81327dadf1de1f337e27f0260765fb8b6bc
  reviewed scope blob: bee42303b67346a0fe9c5a6b49cd51b8c358a593

Correction-1 Scope path:
  docs/architecture/sbs-role-task-first-ia-v1-implementation-scope-corr-1g.md

locked packet blob: 9718231d93c572b93cefcd2a54bb8234c3407941
Human Definition Lock blob: 2577a5f1b03d6355318c83b8f29b070a051752fe

Scope: Independent Scope Review-1 P1-1 / P1-2 / P1-3 only
P1-1 Decision: EXISTING CALLBACK bind
  TodaySupportDayBoard.onSelectOccurrence(occurrenceId)
  when Task-First Destination is D-UNRECORDED
  payload occurrenceId; object = todaySupportItems.userId for that id
  UsersList.onUserDetailRequest(userId) is NOT this event
P1-2 Decision: AUTHORIZE CLEAR CONTROL
  TodaySupportDayBoard.onClearChosenOccurrence()
  when Task-First Destination is D-UNRECORDED
P1-3 Decision: SAME CLEAR CONTROL
  TodaySupportDayBoard.onClearChosenOccurrence()
  when Task-First Destination is D-TODAY

Independent Scope Re-Review: NOT YET
Human Correction Implementation GO: NOT RECEIVED
Implementation Start: NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
Product / tenant mutation by this document: 0
CORR-1F reopen: NOT AUTHORIZED
Rewrite locked CORR-1G packet blob: NOT AUTHORIZED
P2-1 / P2-2 / P2-3 / PLANNER / ADMIN_AUDIT: OUT
```

This Decision consumes Human CORR-1G Exact Scope Correction-1 GO only. It authorizes rewriting the CORR-1G Exact Scope so Independent Scope Review-1 P1 leftovers are uniquely closed as decided below. It does **not** self-PASS Fresh Independent Scope Re-Review and does **not** consume Human Correction Implementation GO.

Exact Scope Correction-1 GO ≠ Independent Scope Re-Review PASS ≠ Human Correction Implementation GO ≠ Implementation Start ≠ Ready ≠ Merge ≠ Deploy.

---

## Verdict

```text
RESULT: Human CORR-1G Exact Scope Correction-1 GO = GO / CONSUMED
CORR-1G Scope Correction-1 = AUTHORIZED / APPLIED in the Scope body
Independent Scope Re-Review = NOT YET (await corrected Scope body)
Human Correction Implementation GO = NOT RECEIVED / NOT CONSUMED
Implementation Start = NOT AUTHORIZED
Deploy / LIVE WRITE = NOT AUTHORIZED
```

---

## Bound unique decisions (Human / this GO)

| ID | Decision | Unique close |
|---|---|---|
| P1-1 | EXISTING CALLBACK | D-UNRECORDED occurrence choice = `TodaySupportDayBoard.onSelectOccurrence(occurrenceId: string)` while Task-First Destination is **D-UNRECORDED**. Object identity = `todaySupportItems` row for that `occurrenceId` (`userId`). `UsersList.onUserDetailRequest(userId)` remains person-open only and is **not** OPTION A. |
| P1-2 | CLEAR CONTROL | D-UNRECORDED explicit occurrence deselect = `TodaySupportDayBoard.onClearChosenOccurrence()` while Destination is **D-UNRECORDED**. Occurrence false; stay D-UNRECORDED; 記録する fallback restored; object unchanged. |
| P1-3 | SAME CLEAR CONTROL | D-TODAY explicit object deselect = the same `onClearChosenOccurrence()` while Destination is **D-TODAY**. Object RELEASE (coupled occurrence false); stay D-TODAY; fallbacks restored. |

No existing Product-visible deselect callback was found on scout (`onSelectOccurrence` always passes an id; UsersList has no occurrence id). Correction-1 therefore authorizes one new control on the already-listed `TodaySupportDayBoard.tsx` file, purpose-limited as above. UsersList.tsx remains OUT. H-3 is **not** fired for UsersList.

---

## Authorized by this GO

```text
Docs-only rewrite of the CORR-1G Exact Scope for P1-1 / P1-2 / P1-3 only
Mark corrected Scope AWAITING Fresh Independent Scope Re-Review
Record this GO document on a docs-only PR (Ready / Merge remain separate Human gates)
```

---

## Explicit non-actions

```text
Independent Scope Re-Review PASS by this GO = NOT CLAIMED
Human Correction Implementation GO = NOT CONSUMED
Implementation Start / Product code mutation = NOT AUTHORIZED
CORR-1F reopen = NOT AUTHORIZED
Rewrite locked CORR-1G packet body / blob = NOT AUTHORIZED
P2-1 Back-persistence unit mapping inside Correction-1 = NOT REQUIRED
P2-2 / P2-3 closure inside CORR-1G = NOT AUTHORIZED
PLANNER / ADMIN_AUDIT Global completion claim = NOT AUTHORIZED
Ready / Merge / Issue close of unrelated PRs/Issues = NOT AUTHORIZED
Deploy / App Catalog / LIVE WRITE / SharePoint / M365 / Entra = NOT AUTHORIZED
Scope expansion beyond Independent Scope Review-1 P1-1 / P1-2 / P1-3 = NOT AUTHORIZED
UsersList.tsx / UserDetail.tsx / CurrentProcedure.tsx / DailyRecords.tsx mutation = NOT AUTHORIZED
```

---

```text
STOP = no Product implementation from this GO
     = no self-PASS of Independent Scope Re-Review
     = no Ready / Merge / Deploy / LIVE WRITE
     = no PLANNER / ADMIN_AUDIT completion claim
     = no CORR-1F reopen
     = after Correction-1 Scope preparation
```
