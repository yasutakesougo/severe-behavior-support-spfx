# POST-RESEARCH Decision Reconciliation

Status: PASS
Date: 2026-08-11
Scope: HD-RA-01 / HD-RA-02 / HD-RA-03 / HD-RA-04
Research source: Issue #219

## Purpose

Mirror the four Human Decisions produced after Research Agent v1 into repository documentation without inventing new DEC numbers, changing application code, or mutating SharePoint / Microsoft 365 / Entra.

## Accepted / LOCKED Decisions

| Decision | Accepted boundary | Explicitly not adopted |
| --- | --- | --- |
| HD-RA-01 | Observation evidence and history remain reviewable | automatic weekly PASS/FAIL, violation, week-boundary invention, rolling-7-day substitution, hard gate |
| HD-RA-02 | Support-record to support-plan/version traceability; timestamp and recorder; practical-training completer can review progress | submit/receive/read/approve workflow, deadlines, automatic violation, HandoffState reuse |
| HD-RA-03 | Training / staffing requirements represented as evidence/reference | automatic statutory eligibility, billing eligibility, hard gate, automatic violation |
| HD-RA-04 | Only evidence-supported application-record to statutory-record mappings may be fixed | name-based equivalence, retention-based equivalence, AuditEvent statutory auto-equivalence |

## Reconciliation with existing repository / issue material

### Issue #15 — staff / qualification / staffing candidates

The existing Staff / StaffAssignment / StaffQualification candidate structures are not rejected by this reconciliation.

However, candidate qualification-ratio and eligibility logic MUST NOT be interpreted as an Accepted statutory compliance engine until its unresolved organization-policy dependencies are separately Accepted.

HD-RA-03 does not decide master ownership, confirmer roles, denominator population, concurrent assignments, leave / absence / temporary staff treatment, or qualification-code governance.

### Issue #16 — observation / review rule candidates

Historical candidate fields such as `requiredCount`, `actualCount`, automatic deadline status, and rule-based count comparison are not automatically Accepted by this reconciliation.

HD-RA-01 specifically prevents the official `原則として週に1回以上` wording from being converted into an invented week boundary, rolling-seven-day rule, automatic PASS/FAIL, violation, or hard gate.

Existing accepted observation-period membership contracts remain separate from weekly-observation compliance semantics.

Existing Accepted review-cadence decisions remain separate from unaccepted due/overdue calculation semantics.

### Issue #19 — governance questionnaire

The four HD-RA Decisions narrow the application boundary but do not auto-answer unrelated organization-policy questions in #19.

Unresolved governance items remain unresolved unless a separate Accepted / LOCKED Decision exists.

### Issue #8 — Decision Ledger

This reconciliation does not invent or assign a new DEC number.

The Decision Ledger remains the ledger for its defined DEC series. HD-RA-01 through HD-RA-04 are mirrored under their existing Human Decision IDs and may be reconciled into the ledger by a separately authorized ledger-sync action if desired.

## Implementation-start assessment

This docs-only mirror does not authorize a general implementation start.

The four Decisions do create design-safe implementation surfaces, but each concrete slice must still pass its own dependency and Entry Criteria review.

Potential future low-risk implementation candidates include:

- read-only observation-history presentation without automatic weekly compliance status
- support-record-to-plan/version traceability contract
- read-only qualification / staffing evidence presentation
- conservative statutory-record mapping metadata that preserves `NOT_CONFIRMED`

No candidate above is auto-selected or auto-started by this reconciliation.

## Mutation boundary

```text
POST-RA-CANONICAL-MIRROR-V1: docs-only
New DEC number: 0
Application code mutation: 0
SharePoint mutation: 0
M365 / Entra mutation: 0
Deploy / real data: 0
Implementation Start: NOT AUTHORIZED by this mirror alone
```
