# REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B — Scope Lineage Reconciliation-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B
kind: implementation-scope lineage reconciliation / docs-only
status: APPLIED / AWAITING INDEPENDENT SCOPE RE-REVIEW-4
basis main: 08492b65412053c78bcd976d7dde547b632dacfe
base Scope durable path:
  docs/architecture/review-outcome-context-note-slice-b-implementation-scope-1.md
Scope Correction-3 candidate HEAD:
  34483cf7edc56adaab3a96d201b40be2d85224bc
Independent Scope Re-Review-3: CORRECTION REQUIRED / CONSUMED
P1-1: Scope mismatch-recapture semantics exceeded locked Definition wording
locked Definition packet:
  Definition Correction-3 @ aff0f748a8b4fd997dac74fcc6be7397b37a21a4
Independent Definition Re-Review-3: PASS / REVIEW-CLEARED
Human Definition Lock GO (Correction-3): RECEIVED / CONSUMED
Human Definition Lock record:
  docs/architecture/review-outcome-context-note-slice-b-definition-correction-3-human-lock.md
Human Implementation Start GO (correction-only): NOT RECEIVED
Implementation Correction: NOT AUTHORIZED
Ready / Merge / Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
```

This reconciliation is Scope-only and docs-only.

It binds the existing Scope Correction-2/3 design to the Human-locked Definition
Correction-3 packet without changing Product / SPFx / domain code.

The existing scope remains authoritative except where this reconciliation
explicitly narrows, supersedes, or adds requirements below.

---

## 1. Locked Definition binding

The complete Definition authority for downstream correction work is:

```text
base Definition / Correction-1:
  docs/architecture/review-outcome-context-note-slice-b-definition-1.md
  locked historical HEAD: 29c9941d87067e38d32a9b612911e66a0504332c

post-merge Definition Correction-2:
  docs/architecture/review-outcome-context-note-slice-b-definition-correction-2.md

Human-locked Definition Correction-3:
  docs/architecture/review-outcome-context-note-slice-b-definition-correction-3.md
  exact locked packet HEAD: aff0f748a8b4fd997dac74fcc6be7397b37a21a4
```

The Human Lock applies to the exact Definition Correction-3 packet at `aff0f748…`.
Later docs-only lock/scope records do not rewrite that locked semantic packet.

The Scope must therefore use the Definition's **CurrentCaptureEpoch** concept:

```text
CurrentCaptureEpoch
= current base review context
+ current evidence snapshot
+ current stored SyntheticCapturedReview, if one exists
```

The evidence snapshot is a current-epoch binding condition.
It is not a durable historical identity and does not require archive/seen-set state.

---

## 2. Reconciliation of Scope S6.1 / S6.2 / S9

Existing Scope Correction-2/3 MATCH/MISMATCH behavior remains valid when read with
current-epoch terminology.

### MATCH

```text
same base review-context key
+ stored current capture exists
+ current evidence snapshot matches stored Outcome.sourceRecordIds
```

Then:

```text
stored capture belongs to current epoch
current capture = stored
DUPLICATE / immutable
second decision capture = blocked
note overwrite = blocked
same-epoch silent replacement = forbidden
```

### MISMATCH

```text
same base review-context key
+ stored current capture exists
+ current evidence snapshot differs from stored Outcome.sourceRecordIds
```

Then:

```text
stored capture does not belong to current epoch
current capture = null / undecided
prior decision/note must not be shown as current committed readback
new synthetic capture for current epoch is allowed
successful new capture atomically becomes capturedReviews[contextKey]
prior non-current capture need not be retained
```

The MISMATCH replacement remains:

```text
!= same-epoch note edit
!= same-epoch decision overwrite
!= correction / cancellation / supersede workflow
!= history mutation
```

No multi-version capture history, seen-snapshot set, localStorage, SharePoint
persistence, or other durable store is introduced.

---

## 3. Evidence snapshot equality

The existing Scope Correction-2 equality rule remains:

```text
currentIds = current HumanReviewMaterials.records[*].RecordId
capturedIds = stored captured.outcome.sourceRecordIds

canonicalize(currentIds) == canonicalize(capturedIds)
  => MATCH

canonicalize(currentIds) != canonicalize(capturedIds)
  => MISMATCH
```

Canonicalization must be deterministic and consistent with the canonical Outcome
sourceRecordIds materialization semantics.

The implementation must not rely only on the base `reviewOutcomeContextKey()` to
decide whether a stored capture is current.

---

## 4. Transient draft binding — current-epoch reconciliation

The prior Scope S8 reset rule bound `draftNoteText` only to the base
`reviewOutcomeContextKey(materials)`.

That is insufficient after Definition Correction-3 because the current evidence
snapshot can change while the base review-context key remains unchanged.

Required observable rule:

```text
Uncommitted draftNoteText and local capture error state
MUST be bound to the current epoch binding:

base review-context key
+ current evidence snapshot
```

Therefore a change in either of these must clear uncommitted note/error state:

```text
A. base review-context key changes
or
B. evidence snapshot changes while base key stays the same
```

A deterministic implementation may use an internal key equivalent to:

```text
currentEpochBindingKey(materials)
= reviewOutcomeContextKey(materials)
  + separator
  + canonicalize(materials.records[*].RecordId)
```

The exact helper name is not fixed.
The observable reset behavior is fixed.

Required behavior:

```text
snapshot A: type memo but do not capture
same base context rerenders with snapshot B
=> memo field empty
=> local error cleared
=> no A draft may be captured into B
```

This does not create persistence or evidence history.
It only prevents transient input from crossing current capture epochs.

---

## 5. Snapshot recurrence A→B→A — R3

Definition Correction-3 requires deterministic recurrence without historical
lookup.

Focused regression R3 is mandatory:

```text
R3 — A→B→A current-epoch recurrence

same OrganizationId/SiteId/UserId/planId/planVersion/period

Epoch 1:
  materials snapshot = [A]
  capture A succeeds
  => A is current

Epoch 2:
  materials snapshot = [B] (or [A,B])
  => MISMATCH against stored A
  => current UI undecided
  capture B succeeds
  => B atomically replaces session-current A
  => unchanged B is DUPLICATE / immutable

Epoch 3:
  materials snapshot returns to [A]
  while stored current capture = B
  => MISMATCH against current B
  => historical A is not reconstructed or consulted
  => current UI undecided
  => a new A capture is allowed
  => success makes new A the one session-current capture
```

R3 must prove that no archive / seen-snapshot registry is needed.

---

## 6. Additional focused regression — R4 transient draft isolation

Because current epoch includes the evidence snapshot, focused regression R4 is
mandatory:

```text
R4 — uncommitted memo cannot cross evidence snapshots

same base review-context key
snapshot A
  → enter optional memo, do not capture
snapshot changes to B
  → draft memo = empty
  → local capture error = cleared
  → A memo cannot be submitted with B decision
```

R4 complements the existing context-switch reset test; it does not replace it.

---

## 7. Scope invariants added by lineage reconciliation

```text
INV-SB18 CurrentCaptureEpoch terminology from locked Definition Correction-3 is
         authoritative for MATCH/MISMATCH lifecycle interpretation.

INV-SB19 Uncommitted memo/error state cannot cross an evidence-snapshot change,
         even when reviewOutcomeContextKey is unchanged.

INV-SB20 A→B→A recurrence uses only the one current stored capture; historical
         duplicate detection / archive / seen-set state is not required.

INV-SB21 Same-epoch immutability remains strict after a MATCHing successful
         capture.

INV-SB22 MISMATCH replacement changes session-current capture only and must not be
         implemented as note edit, decision overwrite, correction, cancellation,
         supersede, or history mutation.
```

Existing INV-SB1 through INV-SB17 remain in force, interpreted consistently with
the Human-locked Definition Correction-3 packet.

---

## 8. Scope acceptance criteria added by lineage reconciliation

```text
SAC-B15 Scope is bound to Definition Correction-3 @ aff0f748... and its Human
        Definition Lock record.

SAC-B16 MATCH/MISMATCH behavior is expressed as current-capture-epoch behavior,
        not durable historical review-instance identity.

SAC-B17 R3 A→B→A recurrence is mandatory and requires no historical lookup.

SAC-B18 R4 proves transient memo/error reset when evidence snapshot changes under
        the same base review-context key.

SAC-B19 No new Product/domain file is required solely by this reconciliation;
        implementation must remain inside the already authorized correction file
        surface unless a future Scope Correction is separately reviewed.
```

---

## 9. Exact implementation surface disposition

The existing Product/domain and verification file surface remains the maximum
allowed surface after a separate Human Implementation Start GO.

No new Product/domain file is authorized by this lineage reconciliation.

In particular:

```text
allowed existing correction paths include:
  spfx/src/shell/monitoring/review-outcome-capture.ts
  spfx/src/shell/monitoring/ReviewOutcomeCaptureView.tsx
  spfx/src/shell/monitoring/HumanReviewView.tsx
  spfx/src/shell/monitoring/MonitoringView.tsx
  corresponding existing authorized test files
  Slice B smoke files
```

A current-epoch binding helper, if needed, must live within the already authorized
surface. If implementation requires another Product/domain path, STOP for Scope
Correction rather than expanding silently.

---

## 10. Stop conditions

```text
Independent Scope Re-Review-4 is REQUIRED before correction-only Implementation
Start eligibility.

If Re-Review-4 finds P0/P1
=> further Scope Correction / lineage correction + exact re-review.

If implementation requires:
- Outcome identity change
- note edit/correction semantics
- history/archive/seen-set state
- production persistence
- new Product/domain file outside authorized surface
=> STOP / re-scope or Definition correction as appropriate.
```

CI / tests do not grant Implementation authority.

---

## 11. Gate

```text
Definition Correction-3
= HUMAN DEFINITION LOCKED
exact locked packet HEAD
= aff0f748a8b4fd997dac74fcc6be7397b37a21a4

Human Definition Lock GO
= RECEIVED / CONSUMED

Scope Correction-2/3
= historical inputs / consumed

Scope Lineage Reconciliation-1
= APPLIED

Independent Scope Re-Review-4
= REQUIRED / NOT STARTED

Human Implementation Start GO (correction-only)
= NOT RECEIVED / NOT ELIGIBLE until Re-Review-4 PASS

Implementation Correction
= NOT AUTHORIZED

Rendered Browser Acceptance / Actual Staff Value Check
= HOLD

Ready / Merge / Deploy / Production Binding / LIVE WRITE
= NOT AUTHORIZED

SharePoint / M365 / Entra mutation
= NOT AUTHORIZED
```

NEXT:

```text
exact Scope packet re-read
→ Independent Scope Re-Review-4
→ PASSなら separate Human Implementation Start GO（correction-only）
```
