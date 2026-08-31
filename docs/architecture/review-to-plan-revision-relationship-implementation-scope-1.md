# REVIEW-TO-PLAN-REVISION-RELATIONSHIP-IMPLEMENTATION-SCOPE-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: REVIEW-TO-PLAN-REVISION-RELATIONSHIP-IMPLEMENTATION-SCOPE-1
kind: implementation scope / start-gate definition
status: CANDIDATE / NOT LOCKED
parent definition: REVIEW-TO-PLAN-REVISION-RELATIONSHIP-DEFINITION-1
parent correction: Correction-1
parent status: HUMAN DEFINITION LOCKED
parent durable path: docs/architecture/review-to-plan-revision-relationship-definition-1.md
basis main: 697c8d920d278b723cf2efbd289d1694f18e7c1a
Human Definition Lock GO: RECEIVED / CONSUMED
Human Implementation Start GO: NOT RECEIVED
Implementation: NOT AUTHORIZED
Ready / Merge / Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
```

## 1. Purpose

Fix the smallest Implementation Scope that can realize the locked Definition’s
domain relationship for `MonitoringPeriodReviewOutcome` without redesigning the
Definition, and without absorbing Secondary Gaps (Assessment→Plan, ServiceUser master).

This document does **not** authorize Implementation Start.

## 2. Definition binding

Implementation (when separately authorized) must remain conformant with:

```text
docs/architecture/review-to-plan-revision-relationship-definition-1.md
Status: HUMAN DEFINITION LOCKED
Correction-1
basis main: 697c8d920d278b723cf2efbd289d1694f18e7c1a
```

If the locked parent Definition changes, this Scope must be re-evaluated before
Implementation Start.

This Scope does **not** reopen Definition decisions:

```text
Monitoring remains Derived
MonitoringVersion = NOT DEFINED
Materials != Outcome
PendingReview terminology remains separate
CHANGE_REQUIRED may precede N+1
Decision complete != Revision complete
N non-destructive
Human authority required
UI / AI are not Outcome SoR
```

## 3. Exact Scope decisions (Definition §23 Gate)

### S1 — MonitoringPeriodReviewOutcome domain representation

```text
Decision: NEW domain aggregate type + validators + DTO envelope
Module (authorized when Implementation Start): src/domain/monitoring-period-review-outcome.ts
```

Conceptual shape (not storage schema):

```text
MonitoringPeriodReviewOutcome = {
  OutcomeId
  OrganizationId
  SiteId
  UserId
  planId
  planVersion          // reviewed Plan Version N
  periodStart
  periodEnd
  sourceRecordIds[]    // ProcedureRecord.RecordId set fixed at decision time
  decision             // "NO_CHANGE" | "CHANGE_REQUIRED"
  reviewedAt
  reviewedBy
}
```

```text
schemaId: severe-behavior-support.monitoring-period-review.outcome
schemaVersion / dtoVersion: 1.0.0
LIVE_WRITE_AUTHORIZED constant: false
```

Follow existing domain patterns (`ProcedureRecord` / correction): pure types,
validators, fail-closed malformed handling, SharePoint-free module.

### S2 — Review Context representation

```text
Decision: EMBEDDED in MonitoringPeriodReviewOutcome
```

Context is not a separately persisted entity in this Slice.

Required embedded context fields are exactly those listed in S1 identity /
period / source set fields.

### S3 — Outcome identifier

```text
Decision: OutcomeId = required opaque non-empty string
Provide deterministic mint helper (SHA-256 + unit-separator namespace)
namespace example: monitoring-period-review.outcome-id.v1
```

Mint material must include reviewed context + decision + reviewedAt + reviewedBy
so retries of the same decision payload can reuse the same OutcomeId.

Optional `IdempotencyKey` is **OUT** of this Slice (defer to persistence Slice).

### S4 — reviewedAt / reviewedBy

```text
Decision: BOTH REQUIRED
reviewedAt: ISO date-time string (validate via existing isValidIsoDateTime)
reviewedBy: non-empty actor string
```

This Slice does **not** introduce staff-save assemble / auth-context ports.
`reviewedBy` authenticity enforcement remains a later assemble/persistence concern.
Domain validators only require non-empty string + valid timestamp.

### S5 / S6 — NO_CHANGE / CHANGE_REQUIRED persistence representation

```text
Decision: SAME aggregate; discriminant field `decision`
Values: "NO_CHANGE" | "CHANGE_REQUIRED" only
```

Both values are first-class persistable decision records at the domain contract
level. This Slice defines representation + validation only; physical persistence
is OUT (see S14).

### S7 — CHANGE_REQUIRED → N+1 lineage representation

```text
Decision: SEPARATE binding type (append-only relationship)
Module (authorized when Implementation Start):
  src/domain/support-plan-version-monitoring-period-review-binding.ts
  (or colocated export from the outcome module if file split is unnecessary)
```

Conceptual shape:

```text
SupportPlanVersionMonitoringPeriodReviewBinding = {
  OrganizationId
  SiteId
  UserId
  planId
  planVersion                 // N+1 (the created version)
  reviewedPlanVersion         // N (must match source Outcome.planVersion)
  sourceOutcomeId             // MonitoringPeriodReviewOutcome.OutcomeId
  boundAt
  boundBy
}
```

```text
schemaId: severe-behavior-support.monitoring-period-review.version-outcome-binding
schemaVersion / dtoVersion: 1.0.0
```

Uniqueness (domain validation helpers):

```text
U1: one sourceOutcomeId → at most one binding
U2: one (OrganizationId, SiteId, planId, planVersion=N+1) → at most one binding
U3: binding.planVersion must be > reviewedPlanVersion
U4: binding only allowed when source Outcome.decision === CHANGE_REQUIRED
U5: NO_CHANGE Outcome must not have a binding
```

This Slice defines binding type + validators + pure linkage helpers.
It does **not** create SupportPlanVersion N+1 content or mutate SupportPlan.

### S8 — Revision Pending expression

```text
Decision: DERIVED relationship state (not SupportPlan.status enum; not stored enum)
```

Pure helper semantics:

```text
isRevisionPending(outcome, bindings) =
  outcome.decision === "CHANGE_REQUIRED"
  AND no binding exists with sourceOutcomeId === outcome.OutcomeId
```

```text
Revision Pending != SupportPlan.status = PendingReview
```

No new SupportPlan status member is authorized.

### S9 — SupportPlan.currentVersion update timing

```text
Decision: OUT OF THIS SLICE / NOT AUTHORIZED
```

This Slice must not mutate `SupportPlan.currentVersion`.
When a later Slice authorizes N+1 creation, it must decide update timing
explicitly and must not treat it as implied by Outcome or Binding alone.

### S10 — N+1 creation vs Active / effective start

```text
Decision: OUT OF THIS SLICE / SEPARATE CONCERNS REAFFIRMED
```

Do not treat as synonymous in this Slice:

```text
N+1 exists
currentVersion = N+1
N+1 becomes effective / Active
```

No Active / effectiveFrom mutation is authorized here.

### S11 — Bidirectional traceability

```text
Decision:
  Forward: OutcomeId → binding lookup by sourceOutcomeId → planVersion N+1
  Reverse: (planId, planVersion N+1) → binding → sourceOutcomeId → Outcome
```

Helpers (pure):

```text
findBindingForOutcome(outcomeId, bindings)
findBindingForPlanVersion(planId, planVersion, bindings)
```

Outcome aggregate itself does **not** store `nextPlanVersion` (avoids mutating
a finalized decision record when Revision later completes).

### S12 — Canonical field naming / casing

```text
Decision: Match ProcedureRecord convention
  OrganizationId / SiteId / UserId / OutcomeId = PascalCase identity fields
  planId / planVersion / periodStart / periodEnd / sourceRecordIds /
  decision / reviewedAt / reviewedBy = camelCase payload fields
  Binding: planVersion = N+1; reviewedPlanVersion = N; sourceOutcomeId;
           boundAt / boundBy
```

Definition conceptual keys (`organizationId`, etc.) map to the above canonical
names in domain code.

Time zone semantics for period membership remain Asia/Tokyo closed-day rules
already used by Monitoring (`evaluateObservationPeriodMembership` reuse where
period well-formedness is checked). This Slice does not re-filter ProcedureRecords;
it validates that `sourceRecordIds` is a non-empty unique string array for
CHANGE_REQUIRED and NO_CHANGE alike **or** allows empty array only when
explicitly valid for zero-record reviews.

```text
sourceRecordIds:
  Decision = ALLOW empty array
  Rationale = locked Monitoring/Human Review already treats 0件 as valid materials
  Empty array != NOT_PERFORMED and != missing review
  Duplicate RecordId in sourceRecordIds = MALFORMED
```

### S13 — correction / cancellation / supersede

```text
Decision: OUT OF THIS SLICE
```

Follow Definition immutability principle: later different judgment = new Outcome B.
No correction / cancellation / supersede contract in this Slice.

### S14 — persistence port

```text
Decision: OUT OF THIS SLICE
```

No repository port, no SharePoint adapter, no synthetic list store, no LIVE WRITE gate
work in this Slice.

Domain contract + focused tests only. Physical persistence remains a later Slice.

### S15 — UI integration

```text
Decision: OUT OF THIS SLICE
```

No SPFx / shell / MonitoringView / HumanReviewView changes.
`conceptualNextVersion` demo remains unrelated and must not be treated as Outcome/N+1.

## 4. Authorized change surface (after separate Implementation Start GO only)

```text
A src/domain/monitoring-period-review-outcome.ts
A src/domain/support-plan-version-monitoring-period-review-binding.ts
  (or single module if colocated; both type families required)
M src/domain/index.ts                    # exports only for new symbols
A tests/domain/monitoring-period-review-outcome*.ts
A tests/domain/support-plan-version-monitoring-period-review-binding*.ts
A tests/contracts/monitoring-period-review-outcome-contract.test.ts
A tests/contracts/support-plan-version-monitoring-period-review-binding-contract.test.ts
A tests/domain/*fixture* only if required for the above
```

No other Product / adapter / SPFx / governance / workflow file is authorized.

## 5. Authorized implementation outcomes

When Implementation Start is later granted, implementation may only:

```text
1. Add MonitoringPeriodReviewOutcome types, schema constants, validators, DTO helpers, OutcomeId mint
2. Add SupportPlanVersionMonitoringPeriodReviewBinding types, validators, DTO helpers
3. Add pure helpers:
     isRevisionPending
     findBindingForOutcome
     findBindingForPlanVersion
     uniqueness / malformation fail-closed checks (U1–U5)
4. Export via src/domain/index.ts
5. Add focused domain + contract tests with synthetic fixtures only
```

## 6. Required invariants (must preserve)

```text
INV-D1  Monitoring remains Derived; no MonitoringVersion type
INV-D2  SupportPlan.status enum unchanged (no RevisionPending member)
INV-D3  PendingReview terminology remains lifecycle-only
INV-D4  HumanReviewMaterials module behavior unchanged
INV-D5  NO_CHANGE and CHANGE_REQUIRED both valid Outcome.decision values
INV-D6  CHANGE_REQUIRED Outcome valid with zero bindings (Revision Pending)
INV-D7  Binding requires CHANGE_REQUIRED source Outcome
INV-D8  Binding does not overwrite SupportPlanVersion N
INV-D9  Outcome does not store nextPlanVersion
INV-D10 LIVE_WRITE_AUTHORIZED remains false
INV-D11 Assessment / ServiceUser / Staff master untouched
INV-D12 No SharePoint / UI / persistence port code
```

## 7. Explicit OUT

```text
SupportPlan / SupportPlanVersion create or mutate
SupportPlan.currentVersion update
Active / effectiveFrom / effectiveTo changes
SupportPlan.status enum expansion
MonitoringReadModel persistence / MonitoringVersion
HumanReviewMaterials changes
AssessmentSnapshot / Assessment→Plan link
ServiceUser master / Staff master / personLabel SoR
SharePoint adapters / list schema / REST / PnP
persistence repository port / synthetic SP store
UI / SPFx shell / conceptualNextVersion wiring
AI finalize / recommendation fields
correction / cancellation / supersede contracts
IdempotencyKey / staff-save assemble auth ports
Deploy / Production Binding / LIVE WRITE
Ready / Merge
Issue close
```

## 8. Secondary Gap firewall

From the data-management diagnostic Primary/Secondary split:

```text
IN (Primary Gap slice): Review → Revision relationship domain types
OUT (Secondary; must not absorb):
  Assessment → Plan relationship
  ServiceUser master / display-label SoR
```

## 9. Exact implementation sequence (only after Human Implementation Start GO)

```text
1. Re-read locked Definition + this Scope
2. Confirm parent Definition still HUMAN DEFINITION LOCKED / unchanged intent
3. Implement domain modules within §4
4. Add focused domain + contract tests
5. Run focused tests + root typecheck/lint as applicable
6. Independent Implementation Review
7. STOP — no Ready / Merge without separate Human GO
```

Implementation Start GO does not authorize Ready, Merge, Deploy, Production Binding,
LIVE WRITE, UI work, or persistence ports.

## 10. Verification minimum (later implementation evidence)

```text
Outcome validator accepts NO_CHANGE and CHANGE_REQUIRED with required context
Outcome rejects missing reviewedAt/reviewedBy/context/malformed period
sourceRecordIds: unique; empty array allowed; duplicates fail closed
isRevisionPending true iff CHANGE_REQUIRED && no binding
Binding rejects NO_CHANGE source / non-increasing version / duplicate OutcomeId
Forward + reverse lookup helpers behave deterministically
No MonitoringVersion symbol introduced
SupportPlan status transition contract unchanged
typecheck / lint / focused tests PASS
```

## 11. Staff-facing meaning preserved (no UI this Slice)

Domain naming and comments/tests must remain consistent with locked staff explanation:

```text
Monitoring = period aggregate (derived)
Monitoring Period Review = human judgment act
NO_CHANGE = reviewed, no plan change
CHANGE_REQUIRED = need change recorded; next version may come later
Revision complete only when N+1 is linked
```

## 12. Acceptance Criteria (Scope)

```text
SAC-1  All Definition §23 gate items S1–S15 are decided (IN or explicit OUT)
SAC-2  MonitoringPeriodReviewOutcome domain representation is fixed
SAC-3  Context is embedded; casing canonicalized to ProcedureRecord convention
SAC-4  Revision Pending is derived, not a SupportPlan status
SAC-5  N+1 lineage uses separate binding with bidirectional helpers
SAC-6  currentVersion / Active-effective are OUT and not implied
SAC-7  persistence port / UI / correction / Assessment / User-master are OUT
SAC-8  Authorized file surface is exact and minimal
SAC-9  Implementation remains NOT AUTHORIZED until Human Implementation Start GO
SAC-10 Definition is not redesigned by this Scope
```

## 13. Stop conditions

```text
Independent Scope Review-1 required before Human Implementation Start GO
Scope Correction only if Independent Scope Review finds P0/P1
No Implementation Start from this document alone
No SharePoint / UI / persistence work from this document
If parent Definition Lock is revoked or materially amended → HOLD + re-scope
```

## 14. Next gate

```text
NEXT = Independent Scope Review-1
THEN = Human Implementation Start GO / HOLD
Implementation = NOT AUTHORIZED
Mutation by implementation = 0 until Start GO
```
