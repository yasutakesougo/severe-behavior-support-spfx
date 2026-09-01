# REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B — Definition Correction-3

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B
kind: definition amendment / recurrence semantics correction
correction: DEFINITION CORRECTION-3
status: APPLIED / AWAITING INDEPENDENT DEFINITION RE-REVIEW-3
basis main: 08492b65412053c78bcd976d7dde547b632dacfe
parent definition: docs/architecture/review-outcome-context-note-slice-b-definition-1.md
parent correction: docs/architecture/review-outcome-context-note-slice-b-definition-correction-2.md
Correction-2 candidate HEAD reviewed: 0523e2db1999a9248efa4d67f73704df1b70de57
Independent Definition Re-Review-2: CORRECTION REQUIRED / CONSUMED
P1-1: evidence snapshot recurrence A→B→A vs current-only storage
Human Definition Lock GO for Correction-3: NOT RECEIVED
Implementation Correction: NOT AUTHORIZED
Ready / Merge / Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
```

This amendment is Definition-only.

It does not authorize Product / SPFx / domain mutation.

It resolves one lifecycle ambiguity left by Definition Correction-2 while keeping
the Slice presentation-only and history-free.

---

## 1. Re-Review-2 finding

Definition Correction-2 described a captured review instance as:

```text
base review context
+ evidence snapshot identity
```

while downstream Scope Correction-3 keeps only:

```text
one current SyntheticCapturedReview per base review-context key
```

and explicitly keeps prior mismatch history OUT.

That combination is incomplete for recurrence:

```text
A captured
→ evidence changes to B
→ B captured and replaces A
→ evidence later returns to A
```

If `base + snapshot A` were a durable/global captured-review identity, the runtime
would need history to know that A had already been captured and was immutable.
Current-only storage intentionally has no such history.

Correction-3 therefore fixes the Definition to the actual minimal Slice semantic:
immutability is attached to the **current capture epoch**, not to every historical
occurrence of the same evidence fingerprint.

---

## 2. Current capture epoch

For this synthetic Slice, the operative lifecycle unit is:

```text
CurrentCaptureEpoch =
  current base review context
  + current evidence snapshot
  + current stored SyntheticCapturedReview, if one exists
```

The evidence snapshot is a binding condition for whether the stored capture belongs
to the **current epoch**.

It is not a durable global identifier that requires remembering every prior
snapshot ever seen in the session.

Definition Correction-2 wording that described `base review context + evidence
snapshot identity` as a captured review instance is superseded by this more precise
rule:

```text
base review context + evidence snapshot
= binding characteristics of the current capture epoch
!= durable historical identity requiring archive/seen-set retention
```

---

## 3. MATCH / MISMATCH semantics after Correction-3

### MATCH

```text
stored current capture exists
+ current base review context matches
+ current evidence snapshot matches stored Outcome.sourceRecordIds
```

Then:

```text
stored capture belongs to current epoch
DUPLICATE / immutable
second decision capture blocked
note overwrite blocked
note edit OUT
same-epoch silent replacement forbidden
```

### MISMATCH

```text
stored current capture exists
+ base review context matches
+ current evidence snapshot differs from stored Outcome.sourceRecordIds
```

Then:

```text
stored capture does not belong to current epoch
current UI/capture state = undecided
new capture for the current epoch is allowed
successful new capture atomically becomes the one current capture for the base key
prior non-current capture need not be retained
```

The replacement remains:

```text
!= same-epoch note edit
!= same-epoch decision overwrite
!= correction/cancellation/supersede workflow
!= history mutation
```

---

## 4. Snapshot recurrence A→B→A

The recurrence case is now explicit:

```text
Epoch 1: snapshot A → capture A
Epoch 2: snapshot B → capture B replaces current A
Epoch 3: snapshot A reappears while current stored capture is B
```

For Epoch 3:

```text
current A != stored B
=> MISMATCH
=> prior historical A is not reconstructed or consulted
=> current epoch starts undecided
=> a new capture is allowed
```

This behavior is intentional for this Slice because:

```text
production persistence = OUT
history/archive = OUT
seen-snapshot registry = OUT
correction/supersede audit = OUT
session-current presentation only = IN
```

Therefore the Definition does **not** claim cross-epoch immutability for a
historically recurring snapshot fingerprint.

If future Product requirements need “snapshot A was ever captured before”
uniqueness, audit, or historical replay, that requires a separate Definition with
explicit persistence/history identity semantics.

---

## 5. Reconciliation with prior Definition wording

The following prior meanings remain:

```text
one current review interaction
one current captured decision
zero or one current supplemental note at initial capture
no same-epoch post-success mutation
```

The following are now explicitly NOT required:

```text
global uniqueness of base-context + sourceRecordIds across the whole session
remembering discarded mismatch captures
preventing recapture solely because the same snapshot fingerprint occurred earlier
multi-version capture history
seen-snapshot tombstones
```

Correction-1 statements such as:

```text
second decision capture = blocked
note overwrite = blocked
silent replacement = forbidden
```

apply when the stored capture belongs to the current epoch (MATCH).

They do not apply to a MISMATCH that establishes a new current epoch.

---

## 6. Definition invariants added / corrected

```text
INV-B20 Immutability is enforced for the current capture epoch when current
        materials MATCH the stored capture evidence snapshot.

INV-B21 MISMATCH means the stored capture is non-current; a new current epoch may
        be captured without classifying the action as note edit or decision
        overwrite.

INV-B22 Snapshot fingerprint recurrence after an intervening successful mismatch
        capture does not require historical duplicate detection in this Slice.

INV-B23 Prior mismatch captures may be discarded from session-current state;
        history/archive/seen-set retention remains OUT.

INV-B24 No claim of durable or production review-instance identity is introduced
        by the current-capture-epoch concept.
```

Correction-2 INV-B15 through INV-B19 are read consistently with these rules.
Where Correction-2 used “same evidence-bound review instance,” Correction-3 narrows
that phrase to “same current capture epoch with MATCHing stored evidence.”

---

## 7. Acceptance criteria added / corrected

```text
AC-B18 MATCH against the one current stored capture remains DUPLICATE / immutable.

AC-B19 MISMATCH starts an undecided current epoch and permits a new synthetic
        capture whose success atomically becomes session-current.

AC-B20 A→B→A recurrence is deterministic: after B replaced A, reappearing A is
        MISMATCH against current B and may be captured as a new epoch.

AC-B21 No history/archive/seen-snapshot state is required to implement AC-B20.

AC-B22 Same-epoch decision/note editing remains forbidden.

AC-B23 No Implementation starts until Correction-3 receives Independent Definition
        Re-Review-3 PASS and separate Human Definition Lock GO, followed by Scope
        lineage reconciliation/re-review and separate Human Implementation Start GO.
```

---

## 8. Required downstream Scope reconciliation

After Correction-3 is independently review-cleared and Human-locked, downstream
Scope must use current-epoch terminology and prove at minimum:

```text
R1  A capture + B mismatch => A not current; B capture allowed
R2  B capture success => B current; unchanged B duplicate-blocked
R3  A→B→A recurrence => reappearing A is MISMATCH against current B;
    undecided then recapturable; no historical A lookup required
```

Scope must continue to forbid:

```text
same-epoch overwrite
post-capture note edit
history/archive UI
production persistence
SharePoint / LIVE WRITE
```

---

## 9. Gate

```text
Definition Correction-2 = APPLIED / CONSUMED
Independent Definition Re-Review-2 = CORRECTION REQUIRED / CONSUMED
Definition Correction-3 = APPLIED
Independent Definition Re-Review-3 = REQUIRED / NOT STARTED
Human Definition Lock GO（Correction-3 packet）= NOT RECEIVED
Scope lineage reconciliation = HOLD
Independent Scope Re-Review-4 = HOLD
Human Implementation Start GO（correction-only）= NOT ELIGIBLE
Implementation Correction = NOT AUTHORIZED
Rendered Browser Acceptance = HOLD
Actual Staff Value Check = HOLD
Ready / Merge / Deploy / Production Binding / LIVE WRITE = NOT AUTHORIZED
SharePoint / M365 / Entra mutation = NOT AUTHORIZED
```

NEXT:

```text
exact Definition packet re-read
→ Independent Definition Re-Review-3
→ PASSなら separate Human Definition Lock GO
→ Scope lineage reconciliation + R3
→ Independent Scope Re-Review-4
→ PASSなら separate Human Implementation Start GO（correction-only）
```
