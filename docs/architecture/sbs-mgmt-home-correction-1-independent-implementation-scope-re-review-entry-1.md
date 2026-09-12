# SBS-MGMT-HOME-CORRECTION-1 — Independent Implementation Scope Re-Review Entry-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-HOME-CORRECTION-1
kind: Fresh Independent Implementation Scope Re-Review ENTRY
status: READY FOR FRESH INDEPENDENT RUNTIME / NOT STARTED
date: 2026-09-12
PR: #604（Draft）
branch: cursor/sbs-mgmt-home-5-persona-sim-c53a
This Project runtime: MUST NOT perform the Re-Review
This packet: entry / basis pin only
!= Re-Review PASS
!= Implementation Start
!= Ready / Merge / Deploy
```

## 1. Why this entry exists

Implementation Scope Correction-1 closed ISR1-P1-1 and ISR1-P1-2 in the
Implementation Scope candidate. Historical Review-1 verdict remains CORRECTION.
A **Fresh Independent** Implementation Scope Re-Review is now required before
Human Implementation Start GO can become eligible.

## 2. Basis to review（pin these）

| Artifact | Path | Role |
|---|---|---|
| Corrected Implementation Scope candidate | `docs/architecture/sbs-mgmt-home-correction-1-implementation-scope-1.md` | Review target |
| Scope Correction-1 packet | `docs/architecture/sbs-mgmt-home-correction-1-implementation-scope-correction-1.md` | What changed / P1 close evidence |
| Historical Review-1 | `docs/architecture/sbs-mgmt-home-correction-1-independent-implementation-scope-review-1.md` | Prior CORRECTION record（not a PASS） |
| LOCKED Definition Correction-1 | `docs/architecture/sbs-mgmt-home-correction-1-definition-correction-1.md` | C1–C6 meaning（do not reopen） |
| LOCKED Correction Scope | `docs/architecture/sbs-mgmt-home-correction-1-scope-definition-1.md` | IN/OUT（do not reopen） |
| Definition / Scope Lock | `docs/architecture/sbs-mgmt-home-correction-1-definition-scope-lock-1.md` | Lock consumed |
| Simulation 2 | `docs/architecture/sbs-mgmt-home-5-persona-real-browser-simulation-2.md` | CORRECTION evidence（do not re-judge） |

At entry creation, tip SHA / blob SHAs must be re-pinned by the Fresh Runtime
from the live PR #604 head at review start（do not trust stale SHAs from this packet alone）.

## 3. Mandatory checks for Fresh Re-Review

```text
1. ISR1-P1-1 closed uniquely?
   Draft N+1 iff draft.candidate.version exists
   conceptualNextVersion alone must not imply Draft exists
2. ISR1-P1-2 closed uniquely?
   MODE_UNAVAILABLE vs MODE_RESOLVED exact
   OverviewKpiCard.count: number preserved without faking UNAVAILABLE as 0/12
3. C1–C6 semantic preservation vs LOCKED Definition / Correction Scope
4. No product / SPFx mutation in the candidate PR diff
5. No Implementation Start authorization smuggled into docs
6. P2 findings: may remain OPEN / NON-BLOCKING unless they become P1
```

## 4. Forbidden to the Fresh Runtime（same as project rules）

```text
Do not treat this entry as PASS
Do not consume Human Implementation Start GO
Do not Ready / Merge / Deploy
Do not mutate SharePoint / production / cloud
Do not use implementer self-judgment as Independent PASS
```

## 5. Eligibility reminder

```text
Re-Review PASS
  → Human may then decide Implementation Start GO / HOLD
Re-Review CORRECTION / FAIL
  → further Scope Correction or HOLD
This entry alone
  → NOT Start eligibility
```

## 6. STOP（this Project）

```text
Entry prepared.
Fresh Independent Implementation Scope Re-Review = REQUIRED
Do not perform it in the Project Coordinator / implementer runtime that authored Correction-1.
```
