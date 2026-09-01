# SBS-MGMT-LOOP-A — Implementation Scope Correction-4 (#552)

```text
repository: yasutakesougo/severe-behavior-support-spfx
tracking issue: #552
unit: SBS-MGMT-LOOP-A-IMPLEMENTATION-SCOPE-CORRECTION-4
kind: docs-only scope correction addendum
parent scope:
  Implementation Scope Correction-2 @ PR #565
  Implementation Scope Correction-3 @ PR #565
pre-mutation fixation: issuecomment-5490763776
P1-SCOPE-GAP-1: HumanReviewView.test.tsx missing from Correction Scope §5
Human Implementation Correction GO (prior): RECEIVED / CONSUMED / issuecomment-5490743725
Scope Correction-4 GO: RECEIVED / CONSUMED
Product / fixture / test / smoke mutation: NOT AUTHORIZED by this document alone
```

This addendum corrects only P1-SCOPE-GAP-1 from Implementation Correction Pre-Mutation Fixation. All other Scope Correction-2 / Correction-3 content remains unchanged unless this document explicitly supersedes §5 verification surface below.

## C4-1 — Verification surface gap closure

Scope Correction-2 §5 authorized verification mutation of:

```text
M spfx/src/shell/monitoring/ReviewOutcomeCaptureView.test.tsx
M spfx/src/shell/monitoring/review-outcome-capture.test.ts
M spfx/src/shell/monitoring/MonitoringView.test.tsx
M spfx/smoke/sbs-mgmt-loop-a-review-completion/**
```

Exact pre-mutation read-back of PR #563 lineage at `fff7cbb77a2669bedaebf49ee7e2e6954d41033a` shows:

```text
spfx/src/shell/monitoring/HumanReviewView.test.tsx
```

contains a context-switch test that directly queries:

```text
[data-review-outcome-note-input="true"]
```

and asserts memo draft reset on remount. The Human-locked correction removes the staff-facing supplemental memo textarea. This test must be updated under corrected single-input semantics or the SPFx test suite will fail after Product correction.

Scope Correction-2 §5 did not authorize mutation of this file. That omission is P1-SCOPE-GAP-1.

## C4-2 — Superseded §5 verification surface

Scope Correction-2 §5 is superseded for verification mutation authorization by the following exact surface.

After separate **revised-scope** Human Implementation Correction GO only:

```text
M spfx/src/shell/monitoring/ReviewOutcomeCaptureView.test.tsx
  - F1/F2/F3/F4/F7/F8
  - epoch reset regression where applicable

M spfx/src/shell/monitoring/review-outcome-capture.test.ts
  - F5 note=null capture conformance
  - F6 Note v1 compatibility conformance
  - R1-R12 regression as applicable; implementation logic change is not expected

M spfx/src/shell/monitoring/HumanReviewView.test.tsx
  - replace obsolete memo-input reset expectation with decisionReason/current-epoch reset regression
  - assert supplemental memo textarea is absent from corrected staff-facing surface (F1 / no note-input regression)
  - context-switch test must query decisionReason input, not data-review-outcome-note-input
  - R11/R12 epoch-bound draft reset at HumanReviewView integration boundary where applicable

M spfx/src/shell/monitoring/MonitoringView.test.tsx
  - R8-R12/current-epoch regression only if existing test fixtures require updated UI expectations

M spfx/smoke/sbs-mgmt-loop-a-review-completion/**
  - corrected staff-facing single-input surface
  - Q2 visual distinction assertion
  - corrected rendered acceptance matrix
```

No additional Product/domain/test/smoke path is authorized by this correction.

## C4-3 — Required HumanReviewView.test.tsx semantics

The obsolete test approximately named:

```text
remounts the capture view so a context switch clears the memo on the first B render
```

must be replaced or rewritten to assert corrected semantics:

```text
1. corrected staff-facing surface exposes decisionReason input
2. corrected staff-facing surface does NOT expose data-review-outcome-note-input
3. uncommitted decisionReason draft in context A is empty on first render after context switch to B
4. no supplemental memo textarea exists to carry stale draft state
5. epoch/current-context reset behavior remains consistent with Scope Correction-2 R11/R12
```

Forbidden test expectations after correction:

```text
querying data-review-outcome-note-input on undecided corrected surface
asserting memo draft reset via note textarea
introducing a second staff-facing writable text input
```

## C4-4 — Explicit non-expansion

This correction adds one verification file only.

```text
Product mutation surface (Scope Correction-2 §4) = UNCHANGED
domain / contract mutation authorization = UNCHANGED
MonitoringPeriodReviewOutcomeNote v1 = UNCHANGED
SyntheticCapturedReview shape = UNCHANGED
CurrentCaptureEpoch semantics = UNCHANGED
R1-R12 matrix = UNCHANGED
F1-F10 matrix = UNCHANGED
```

If Product correction requires changing `HumanReviewView.tsx` itself, STOP / Scope Correction before mutation. Current read-back expects conformance-only behavior via `ReviewOutcomeCaptureView` correction.

## C4-5 — Prior Human Implementation Correction GO disposition

The prior Human Implementation Correction GO at issuecomment-5490743725 was received against Scope Correction-2 §5 without this file. Pre-mutation fixation correctly stopped with mutation = 0.

After this Scope Correction-4:

```text
prior Human Implementation Correction GO
≠ authorization to mutate under incomplete Scope §5

revised-scope Human Implementation Correction GO
= REQUIRED before Product / test / smoke mutation
```

## Gate

```text
Scope Correction-4 GO
= RECEIVED / CONSUMED

Scope Correction-4
= RECORDED / THIS DOCUMENT

Independent Scope Re-Review
= REQUIRED

revised-scope Human Implementation Correction GO
= NOT RECEIVED

Product / fixture / test / smoke mutation
= NOT AUTHORIZED

Human Ready GO
= NOT ELIGIBLE

Merge / Deploy / Production Binding / LIVE WRITE
= NOT AUTHORIZED

SharePoint / M365 / Entra mutation
= NOT AUTHORIZED

#553
= NOT YET
```

NEXT:

```text
exact Scope re-read
→ Independent Scope Re-Review
→ revised-scope Human Implementation Correction GO / HOLD
→ only then implementation correction on PR #563 lineage
```
