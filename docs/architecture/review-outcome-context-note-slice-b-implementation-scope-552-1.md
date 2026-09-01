# REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B — Implementation Scope Definition (#552)

```text
repository: yasutakesougo/severe-behavior-support-spfx
tracking issue: #552
unit: REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B-IMPLEMENTATION-SCOPE-552-1
kind: implementation scope / start-gate definition
status: CANDIDATE / AWAITING INDEPENDENT SCOPE REVIEW-1
parent unit: REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B
parent definition correction: Definition Correction-3 (#552)
parent status: HUMAN DEFINITION LOCKED
locked definition packet:
  docs/architecture/review-outcome-context-note-slice-b-definition-correction-3.md
locked definition HEAD: aff0f748a8b4fd997dac74fcc6be7397b37a21a4
Human Definition Lock GO: RECEIVED / CONSUMED
Human Definition Lock record: GitHub issuecomment-5489311067
Independent Definition Re-Review-1: PASS / REVIEW-CLEARED / P0=0 / P1=0 / P2=0
rebaseline main: 2c99d0c6d4dd8a4691ed64386650808d07525f38
rebaseline disposition: IDENTICAL to current main
Human Implementation Start GO: NOT RECEIVED
Implementation: NOT AUTHORIZED
Ready / Merge / Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
#553: NOT YET
```

This document records the Implementation Scope candidate for the Human-locked
Definition Correction-3 packet tracked by #552.

It is Scope-only and does **not** authorize Implementation Start, code mutation,
fixture mutation, branch mutation, Ready, Merge, Deploy, Production Binding, or
LIVE WRITE.

---

## 1. Purpose

Fix the smallest post-rebaseline implementation / verification surface that proves
conformance with the Human-locked current-capture-epoch semantics for Slice B:

```text
CurrentCaptureEpoch
MATCH / MISMATCH
A→B→A recurrence
canonical evidence snapshot binding
transient note/error epoch reset
focused regressions R8–R12
```

The rebaseline main at `2c99d0c…` already contains merged Slice B product and
correction lineage from PR #560 / #558. This Scope therefore defines:

```text
1. the exact conformance contract against locked Definition Correction-3
2. the bounded correction file surface if a later separate Human GO finds gaps
3. the mandatory focused regression set R8–R12
```

This Scope does **not** reopen Slice A semantics, Outcome v1.0.0 identity, note
contract basics, rendered browser acceptance history, or Actual Staff Value Check
history already consumed on main.

---

## 2. Locked Definition binding

Implementation, if separately authorized, must remain conformant with:

```text
docs/architecture/review-outcome-context-note-slice-b-definition-1.md
docs/architecture/review-outcome-context-note-slice-b-definition-correction-2.md
docs/architecture/review-outcome-context-note-slice-b-definition-correction-3.md
Human Definition Lock record: GitHub issuecomment-5489311067
Locked Definition Correction-3 exact HEAD: aff0f748a8b4fd997dac74fcc6be7397b37a21a4
```

The Human Lock applies to the exact Definition Correction-3 packet at `aff0f748…`.
Later docs-only scope / lock records do not rewrite that locked semantic packet.

This Scope does **not** reopen:

```text
NO_CHANGE / CHANGE_REQUIRED semantics
MonitoringPeriodReviewOutcome identity / OutcomeId mint material
CHANGE_REQUIRED != N+1
post-capture same-epoch edit / overwrite prohibition
MonitoringVersion
SharePoint / LIVE WRITE / Deploy
AI note authoring or inference
history / archive / seen-snapshot registry
SupportPlanVersion N+1 creation
```

---

## 3. Rebaseline disposition on main

At rebaseline main `2c99d0c…`, the following are already present and are treated
as the current Product baseline for this Scope:

```text
reviewOutcomeEvidenceSnapshot()
reviewOutcomeCurrentEpochBindingKey()
capturedReviewMatchesMaterials()
MonitoringView effectiveExisting capture lookup
ReviewOutcomeCaptureView epoch-binding reset effect
Slice B smoke harness with context-switch matrix
post-merge freeze record:
  docs/architecture/review-outcome-context-note-slice-b-post-merge-freeze-560.md
```

Therefore:

```text
This Scope is primarily a conformance / verification gate.
Any later correction implementation is authorized only within the bounded surface
below and only after separate Human Implementation Start GO.
If main already satisfies R8–R12, correction implementation may be a NO-OP and
the gate proceeds by verification evidence only.
```

---

## 4. Exact Scope decisions

### S1 — CurrentCaptureEpoch authority

The operative lifecycle unit is the locked Definition concept:

```text
CurrentCaptureEpoch =
  current base review context
  + current evidence snapshot
  + current stored SyntheticCapturedReview, if one exists
```

The evidence snapshot is a **current-epoch binding condition**.

It is **not** a durable historical identity and does not require archive,
seen-snapshot, or history retention.

### S2 — Canonical evidence snapshot

Canonical snapshot equality is deterministic and shared across helper, resolve,
and UI reset logic:

```text
currentIds = current HumanReviewMaterials.records[*].RecordId
capturedIds = stored captured.outcome.sourceRecordIds

canonicalize(ids) =
  unique non-empty RecordId strings
  sorted ascending
  joined by the same separator used by Outcome sourceRecordIds materialization

currentSnapshot = canonicalize(currentIds)
capturedSnapshot = canonicalize(capturedIds)

currentSnapshot == capturedSnapshot  => MATCH candidate
currentSnapshot != capturedSnapshot  => MISMATCH
```

Required helpers on rebaseline main:

```text
reviewOutcomeEvidenceSnapshot(sourceRecordIds)
capturedReviewMatchesMaterials(captured, materials)
```

The implementation must **not** decide current capture using only
`reviewOutcomeContextKey(materials)`.

### S3 — MATCH semantics

```text
same base review-context key
+ stored current capture exists
+ capturedReviewMatchesMaterials(stored, currentMaterials) == true
```

Then:

```text
stored capture belongs to current epoch
current capture = stored
DUPLICATE / immutable
second decision capture = blocked
note overwrite = blocked
same-epoch silent replacement = forbidden
decision/note controls disabled after success
```

### S4 — MISMATCH semantics

```text
same base review-context key
+ stored current capture exists
+ capturedReviewMatchesMaterials(stored, currentMaterials) == false
```

Then:

```text
stored capture does not belong to current epoch
current capture = null / undecided for UI and capture-path purposes
prior decision/note must not be shown as current committed readback
controls must not remain disabled solely because of the mismatched store
new synthetic capture for current epoch is allowed
successful new capture atomically replaces capturedReviews[contextKey]
prior non-current capture need not be retained
```

MISMATCH replacement remains:

```text
!= same-epoch note edit
!= same-epoch decision overwrite
!= correction / cancellation / supersede workflow
!= history mutation
```

### S5 — A→B→A recurrence

After a successful mismatch replacement, recurrence is deterministic without
historical lookup:

```text
Epoch 1: snapshot A → capture A succeeds → A current
Epoch 2: snapshot B → MISMATCH vs A → undecided → capture B succeeds → B current
Epoch 3: snapshot A reappears while stored current = B
  => MISMATCH vs B
  => historical A is not reconstructed or consulted
  => undecided
  => new A capture allowed
  => success makes new A the one session-current capture
```

No seen-snapshot registry, archive, or multi-version history is introduced.

### S6 — Transient note/error epoch reset

`ReviewOutcomeCaptureView` local state is owned by the **current capture epoch**.

Observable transient state on rebaseline main:

```text
draftNoteText: string
error: string | null
```

There is no separate persistent "reason" field in this Slice. The locked
`reason/note/error epoch reset` requirement is satisfied by resetting all
current-epoch-owned transient capture input state:

```text
note  => draftNoteText
error => local capture error
reason/context ownership => bound to currentEpochBindingKey, not base context key alone
```

Required reset trigger:

```text
currentEpochBindingKey(materials)
= reviewOutcomeContextKey(materials)
  + separator
  + canonicalize(materials.records[*].RecordId)
```

Whenever `currentEpochBindingKey` changes because either:

```text
A. base review-context key changes
or
B. evidence snapshot changes while base review-context key remains the same
```

then:

```text
draftNoteText MUST become ""
local capture error MUST become null
reset MUST occur regardless of whether the prior epoch was:
  - uncaptured / undecided
  - successfully captured
  - locally invalid / erroring
```

No prior-epoch memo or error may remain editable or submittable because the React
component instance was reused.

### S7 — Effective existing capture lookup

Capture path must use current-epoch binding, not raw store lookup:

```text
stored = capturedReviews[contextKey] | null

effectiveExistingForCapture(currentMaterials) =
  stored if stored exists AND capturedReviewMatchesMaterials(stored, currentMaterials)
  else null

captureSyntheticCapturedReview(effectiveExistingForCapture(...), ...)
  => if effectiveExisting != null: DUPLICATE
  => if effectiveExisting == null: assemble/commit new capture
     and on success set capturedReviews[contextKey] = newCapture
```

### S8 — Focused regressions R8–R12

The locked Definition requires these exact focused regressions before correction
implementation acceptance or conformance sign-off:

```text
R8 — canonical evidence snapshot binding
same base review-context key
materials snapshot A vs B differ only by RecordId set
=> reviewOutcomeCurrentEpochBindingKey(A) != reviewOutcomeCurrentEpochBindingKey(B)
=> capturedReviewMatchesMaterials(A-capture, B-materials) == false
=> canonicalize is deterministic for duplicates / empty ids

R9 — MATCH duplicate / immutable
capture under snapshot A
rerender with unchanged snapshot A
=> current capture remains A
=> second capture = DUPLICATE / blocked
=> note overwrite = blocked
=> controls remain disabled

R10 — MISMATCH clears current committed readback
capture A succeeds
rerender materials with snapshot B
=> UI undecided for current materials
=> A decision/note not shown as current committed readback
=> controls enabled for B
=> new B capture allowed

R11 — A→B→A recurrence without historical lookup
continue from R10 after B capture succeeds
rerender materials with snapshot A again
=> MISMATCH against current B
=> undecided
=> B readback absent
=> new A capture allowed
=> success makes new A session-current
=> unchanged A thereafter DUPLICATE / immutable

R12 — note/error epoch reset across evidence snapshots
same base review-context key

R12a uncaptured draft isolation
  snapshot A: enter memo, do not capture
  snapshot changes to B
  => textarea empty
  => local error null
  => A memo cannot be captured into B

R12b captured-epoch buffer isolation
  snapshot A: enter memo, capture succeeds
  snapshot changes to B
  => A becomes non-current
  => B undecided
  => textarea empty
  => local error null
  => B cannot inherit A memo unless human re-enters it
```

R12a and R12b are both mandatory sub-cases of R12.

Historical smoke matrix names `R1–R4b` remain valid evidence aliases; this Scope
maps them to the locked `#552` regression IDs as:

```text
R1  => R10
R2  => R9 (+ post-R10 B-current behavior)
R3  => R11
R4a => R12a
R4b => R12b
R8  => canonical evidence snapshot helper / binding semantics
```

### S9 — Exact Product / domain file surface

Authorized correction surface after separate Human Implementation Start GO only:

```text
M spfx/src/shell/monitoring/review-outcome-capture.ts
M spfx/src/shell/monitoring/ReviewOutcomeCaptureView.tsx
M spfx/src/shell/monitoring/HumanReviewView.tsx
M spfx/src/shell/monitoring/MonitoringView.tsx
```

No change authorized to:

```text
src/domain/monitoring-period-review-outcome.ts
src/domain/monitoring-period-review-outcome-note.ts
src/domain/support-plan-version-monitoring-period-review-binding.ts
SharePoint adapters / physical schema
SupportPlanVersion persistence
Monitoring read-model contract
OutcomeId mint path
```

If implementation needs any additional Product/domain file, stop for Scope
Correction.

A current-epoch binding helper must live within the already authorized surface.

### S10 — Verification file surface

Authorized verification surface after separate Human Implementation Start GO:

```text
M spfx/src/shell/monitoring/review-outcome-capture.test.ts
M spfx/src/shell/monitoring/ReviewOutcomeCaptureView.test.tsx
M spfx/src/shell/monitoring/HumanReviewView.test.tsx
M spfx/src/shell/monitoring/MonitoringView.test.tsx
M spfx/smoke/review-outcome-context-note-slice-b/**
```

No new smoke slice is authorized. Existing Slice B smoke remains the rendered
browser acceptance harness for epoch regressions.

### S11 — Verification minimum

Before correction implementation acceptance or conformance sign-off:

```text
domain/helper tests prove R8 canonicalization and capturedReviewMatchesMaterials
component tests prove R9–R12
MonitoringView proves effectiveExisting lookup and mismatch recapture replacement
Slice B smoke proves R10–R12 at 1280×900 and 390×844
pageerror = 0
externalRequests = 0
LIVE WRITE / SharePoint side effect = none
```

Rendered Browser Acceptance and Actual Staff Value Check history on main remain
valid historical evidence. This correction Scope does not reopen them unless a
future Scope Correction separately requires it.

---

## 5. Required invariants

```text
INV-SB18 CurrentCaptureEpoch terminology from locked Definition Correction-3 is
         authoritative for MATCH/MISMATCH lifecycle interpretation.

INV-SB19 Transient note/error state cannot cross an evidence-snapshot change,
         even when reviewOutcomeContextKey is unchanged.

INV-SB20 A→B→A recurrence uses only the one current stored capture; historical
         duplicate detection / archive / seen-set state is not required.

INV-SB21 Same-epoch immutability remains strict after a MATCHing successful
         capture.

INV-SB22 MISMATCH replacement changes session-current capture only and must not be
         implemented as note edit, decision overwrite, correction, cancellation,
         supersede, or history mutation.

INV-SB23 Canonical evidence snapshot equality is the sole current-epoch binding
         check for stored capture reuse; base context key alone is insufficient.

INV-SB24 Transient note/error reset is keyed to currentEpochBindingKey, not base
         reviewOutcomeContextKey alone.
```

Existing INV-SB1 through INV-SB17 from the parent Slice B Scope remain in force,
interpreted consistently with the Human-locked Definition Correction-3 packet.

---

## 6. Explicit OUT

```text
Outcome v1.0.0 changes
OutcomeId mint changes
NoteId / independent note identity
same-epoch note edit / decision overwrite after success
history / archive / seen-snapshot registry
multi-version capture history under one review-context key
production persistence
SharePoint / M365 / Entra mutation
Deploy / LIVE WRITE
Ready / Merge backfill
#553 work
generic comments / timeline / threaded comments
AI generation / summarization
SupportPlanVersion N+1 creation or editing
```

---

## 7. Scope acceptance criteria

```text
SAC-B15 Scope is bound to Definition Correction-3 @ aff0f748… and Human Lock
        record issuecomment-5489311067.

SAC-B16 MATCH/MISMATCH behavior is expressed as current-capture-epoch behavior,
        not durable historical review-instance identity.

SAC-B17 R11 A→B→A recurrence is mandatory and requires no historical lookup.

SAC-B18 R12a and R12b prove transient note/error reset when evidence snapshot
        changes under an unchanged base review-context key.

SAC-B19 R8 canonical evidence snapshot binding is mandatory and shared across
        helper, resolve, and UI reset logic.

SAC-B20 No new Product/domain file is authorized by this Scope.

SAC-B21 Human Implementation Start remains a separate gate after Independent
        Scope Review PASS.

SAC-B22 Rebaseline main disposition is recorded; conformance may be proven by
        verification-only NO-OP when main already satisfies R8–R12.
```

---

## 8. Stop conditions

```text
Independent Scope Review-1 is REQUIRED before Human Implementation Start GO.
If Scope Review finds P0/P1 => Scope Correction + exact re-review.
If implementation requires Outcome identity change => HOLD / Definition re-open.
If implementation requires history/archive state => HOLD / Definition re-open.
If additional Product/domain paths are required => HOLD / Scope Correction.
If locked Definition changes => HOLD / re-scope.
CI / tests do not grant Implementation authority.
#553 must not start until this Scope gate is separately closed.
```

---

## 9. Gate

```text
Human Definition Lock GO (#552 Correction-3)
= RECEIVED / CONSUMED

Human Definition Lock record
= GitHub issuecomment-5489311067

Independent Definition Re-Review-1
= PASS / REVIEW-CLEARED / CONSUMED

Locked Definition Correction-3 exact HEAD
= aff0f748a8b4fd997dac74fcc6be7397b37a21a4

Rebaseline main
= 2c99d0c6d4dd8a4691ed64386650808d07525f38
= IDENTICAL to current main

Implementation Scope Definition (#552)
= CANDIDATE / THIS DOCUMENT

Independent Scope Review-1
= REQUIRED / NOT STARTED

Human Implementation Start GO
= NOT RECEIVED / NOT ELIGIBLE until Scope Review PASS

Implementation
= NOT AUTHORIZED

Code / fixture / branch mutation
= NOT AUTHORIZED

Ready / Merge / Deploy / Production Binding / LIVE WRITE
= NOT AUTHORIZED

SharePoint / M365 / Entra mutation
= NOT AUTHORIZED

#553
= NOT YET
```

NEXT:

```text
exact Scope packet re-read
→ Independent Scope Review-1
→ Scope Correction / Re-Review if required
→ PASSなら separate Human Implementation Start GO / HOLD
```
