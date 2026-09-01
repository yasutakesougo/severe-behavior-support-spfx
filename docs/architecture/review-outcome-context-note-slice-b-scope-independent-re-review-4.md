# REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B — Independent Scope Re-Review-4

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B
review: INDEPENDENT SCOPE RE-REVIEW-4
exact Scope packet candidate HEAD: af6475f75b27f97e3fbcd23a07ba0334c6d3bc8d
mode: READ-ONLY REVIEW
verdict: CORRECTION REQUIRED
P0=0 / P1=1 / P2=0
Human Implementation Start GO eligibility: NO
```

## Reviewed packet

```text
Human-locked Definition Correction-3
= aff0f748a8b4fd997dac74fcc6be7397b37a21a4

Human Definition Lock GO
= RECEIVED / CONSUMED

Scope Correction-2/3
= base scope semantics

Scope Lineage Reconciliation-1
= applied @ af6475f75b27f97e3fbcd23a07ba0334c6d3bc8d
```

## P1-1 — Captured-epoch local input residue is not explicitly reset

Scope Lineage Reconciliation-1 correctly added an evidence-snapshot reset rule for
an **uncommitted** memo under the same base review-context key.

However the current implementation keeps `draftNoteText` in React local state after
a successful capture. Capture success clears only `error`; it does not clear the
local textarea value.

Current implementation also resets draft/error only when the base
`reviewOutcomeContextKey(materials)` changes.

Therefore this transition is possible:

```text
Epoch A
  snapshot A
  enter memo A
  capture succeeds
  local draftNoteText still contains memo A
  controls disabled

same base review-context key
snapshot changes A → B
  stored capture A becomes MISMATCH / non-current
  controls become available for B
  base contextKey is unchanged
  existing useEffect does not reset

=> memo A can remain in the B textarea
=> B can accidentally capture A's memo
```

This violates the Human-locked current-capture-epoch boundary even though the
prior memo was once successfully captured.

The reset requirement must therefore apply to the **local input buffer regardless
of whether the previous epoch was captured or uncaptured**.

Required correction:

```text
On any current-epoch binding change
(base review-context key OR evidence snapshot):

- reset local draftNoteText to empty
- clear local capture error
- do so regardless of prior epoch capture status
```

Required regressions must cover both:

```text
R4a uncaptured A draft → B snapshot => draft cleared
R4b captured A with note → B snapshot => local textarea buffer cleared before B capture
```

This is P1 because without the rule an old epoch's human-authored note may be
submitted as context for a different evidence snapshot.

## Other review results

No P0/P1 was found in:

```text
- MATCH / MISMATCH current-capture-epoch semantics
- A→B→A recurrence semantics
- current-only session storage
- history/archive exclusion
- same-epoch immutability
- Outcome v1.0.0 / OutcomeId boundary
- SharePoint / LIVE WRITE / Deploy prohibition
```

## Gate

```text
Independent Scope Re-Review-4
= CORRECTION REQUIRED / CONSUMED

P0=0 / P1=1 / P2=0

Implementation Correction
= NOT AUTHORIZED

NEXT
= Scope Lineage Correction-1
  → exact Scope packet re-read
  → Independent Scope Re-Review-5
  → PASSなら separate Human Implementation Start GO（correction-only）
```
