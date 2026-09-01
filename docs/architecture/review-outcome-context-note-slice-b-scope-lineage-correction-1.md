# REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B — Scope Lineage Correction-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B
kind: implementation-scope lineage correction / docs-only
status: APPLIED / AWAITING INDEPENDENT SCOPE RE-REVIEW-5
basis Scope packet reviewed:
  af6475f75b27f97e3fbcd23a07ba0334c6d3bc8d
Independent Scope Re-Review-4:
  CORRECTION REQUIRED / CONSUMED
  P0=0 / P1=1 / P2=0
P1-1:
  captured-epoch local input residue not explicitly reset
locked Definition Correction-3:
  aff0f748a8b4fd997dac74fcc6be7397b37a21a4
Human Definition Lock GO:
  RECEIVED / CONSUMED
Human Implementation Start GO (correction-only):
  NOT RECEIVED
Implementation Correction:
  NOT AUTHORIZED
Ready / Merge / Deploy / Production Binding / LIVE WRITE:
  NOT AUTHORIZED
```

This correction narrows one requirement in Scope Lineage Reconciliation-1.

It does not change Product code and does not authorize implementation.

## 1. Corrected local-input lifecycle rule

The phrase "uncommitted draftNoteText" in Scope Lineage Reconciliation-1 is too
narrow because the React local input buffer can remain populated after a successful
capture.

The authoritative rule is therefore:

```text
The ReviewOutcomeCaptureView local input buffer and local capture error state are
owned by the CURRENT CAPTURE EPOCH.

Whenever the current-epoch binding changes because either:

A. the base review-context key changes
or
B. the evidence snapshot changes while the base review-context key remains the same

then:

- local draftNoteText MUST become ""
- local capture error MUST become null
- reset MUST occur regardless of whether the previous epoch was:
  - uncaptured / undecided
  - successfully captured
  - locally invalid/erroring
```

No value from a prior current capture epoch may remain editable/submittable merely
because the React component instance was reused.

## 2. Current-epoch binding dependency

A conforming implementation must have a deterministic dependency equivalent to:

```text
currentEpochBindingKey(materials)
= reviewOutcomeContextKey(materials)
  + separator
  + canonicalize(materials.records[*].RecordId)
```

The exact helper/function name is not fixed.

The observable requirement is fixed:

```text
same base key + changed evidence snapshot
=> local input/error reset
```

A component-remount solution, an effect dependency solution, or an equivalent
state-ownership solution is allowed only if it produces the same behavior.

## 3. Required focused regressions

The prior R4 is split into two mandatory cases.

```text
R4a — uncaptured draft isolation

same base review-context key
snapshot A
  → enter memo A
  → do not capture
snapshot changes to B
  → textarea value = empty
  → local capture error = null
  → memo A cannot be captured into B
```

```text
R4b — captured epoch buffer isolation

same base review-context key
snapshot A
  → enter memo A
  → capture A succeeds
  → A readback may show memo A
snapshot changes to B
  → A capture becomes non-current by MISMATCH
  → B UI becomes undecided
  → local textarea value = empty
  → local capture error = null
  → B capture cannot inherit memo A unless the human re-enters it
```

R4b is required even if capture success leaves `draftNoteText` populated while
controls are disabled during Epoch A.

## 4. Reconciliation with R1 / R2 / R3

The complete current-epoch regression set is now:

```text
R1 mismatch clears current committed readback
R2 mismatch recapture replaces session-current value; MATCH remains immutable
R3 A→B→A recurrence is deterministic with no historical lookup
R4a uncaptured local draft cannot cross snapshot epoch
R4b captured-epoch local input buffer cannot cross snapshot epoch
```

These cases must all pass before correction implementation acceptance.

## 5. Invariant correction

Scope Lineage Reconciliation-1 `INV-SB19` is interpreted as:

```text
INV-SB19
All ReviewOutcomeCaptureView local input/error state is current-epoch scoped.
An evidence-snapshot change MUST clear that local state even when the prior epoch
had already been successfully captured.
```

No history/archive state is introduced.

## 6. Acceptance criterion correction

Scope Lineage Reconciliation-1 `SAC-B18` is replaced by:

```text
SAC-B18
R4a and R4b both prove current-epoch local-state isolation across evidence-snapshot
changes under an unchanged base review-context key.
```

## 7. Gate

```text
Scope Lineage Reconciliation-1
= APPLIED / CONSUMED AS REVIEW BASIS

Independent Scope Re-Review-4
= CORRECTION REQUIRED / CONSUMED
P0=0 / P1=1 / P2=0

Scope Lineage Correction-1
= APPLIED

Independent Scope Re-Review-5
= REQUIRED / NOT STARTED

Human Implementation Start GO (correction-only)
= NOT ELIGIBLE until Re-Review-5 PASS

Implementation Correction
= NOT AUTHORIZED

Rendered Browser Acceptance / Actual Staff Value Check
= HOLD

Ready / Merge / Deploy / Production Binding / LIVE WRITE
= NOT AUTHORIZED
```

NEXT:

```text
exact Scope packet re-read
→ Independent Scope Re-Review-5
→ PASSなら separate Human Implementation Start GO（correction-only）
```
