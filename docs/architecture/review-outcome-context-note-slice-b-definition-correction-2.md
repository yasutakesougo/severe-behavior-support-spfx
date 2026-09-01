# REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B — Definition Correction-2

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B
kind: definition amendment / post-merge correction
correction: DEFINITION CORRECTION-2
status: APPLIED / CONSUMED BY DEFINITION CORRECTION-3
basis main: 08492b65412053c78bcd976d7dde547b632dacfe
parent durable definition: docs/architecture/review-outcome-context-note-slice-b-definition-1.md
locked definition HEAD before this amendment: 29c9941d87067e38d32a9b612911e66a0504332c
triggering Scope candidate HEAD: 34483cf7edc56adaab3a96d201b40be2d85224bc
trigger: Independent Scope Re-Review-3 P1-1
Independent Definition Re-Review-2: CORRECTION REQUIRED / CONSUMED
P1-1: evidence snapshot recurrence A→B→A vs current-only storage
successor: docs/architecture/review-outcome-context-note-slice-b-definition-correction-3.md
Human Definition Lock GO for Correction-2 alone: SUPERSEDED BY CORRECTION-3 PACKET LOCK
Implementation Correction: NOT AUTHORIZED
Ready / Merge / Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
```

This amendment is **Definition-only**.

It corrects one ambiguity discovered after PR #550 merged and after Scope
Correction-3 made the evidence-snapshot lifecycle explicit.

It does not authorize Product / SPFx / domain code mutation.

It does not reopen Slice A acceptance or implementation.

---

## 1. Triggering finding

Independent Scope Re-Review-3 found that Scope Correction-3 was internally
consistent but exceeded the wording of the locked Definition.

The locked Definition Correction-1 states, for the same review-context key:

```text
second decision capture = blocked
note overwrite = blocked
note edit = OUT
silent replacement = forbidden
```

Scope Correction-3 correctly identified a different runtime condition:

```text
same review-context key
+ evidence snapshot changed
```

The existing Definition did not state whether that condition is the same captured
review instance or a different captured review instance.

Without this Definition amendment, Implementation Scope cannot safely distinguish:

```text
same evidence snapshot
from
different evidence snapshot under the same base review-context key
```

---

## 2. Corrected Definition-level identity boundary

The existing review-context key remains the **base review context**:

```text
OrganizationId
+ SiteId
+ UserId
+ planId
+ planVersion
+ periodStart
+ periodEnd
```

For Slice B capture lifecycle semantics, a **captured review instance** is bound to:

```text
base review context
+ evidence snapshot identity
```

Evidence snapshot identity is the deterministic identity of the
`sourceRecordIds` represented by the current `HumanReviewMaterials` and captured
`MonitoringPeriodReviewOutcome`.

This amendment does **not** change `MonitoringPeriodReviewOutcome` v1.0.0 and does
not change OutcomeId mint material.

It only clarifies which successful capture the Definition's immutability rule
applies to.

---

## 3. MATCH / MISMATCH lifecycle — corrected immutability meaning

### Case MATCH — same captured review instance

```text
same base review context
+ successful capture exists
+ current evidence snapshot matches captured Outcome evidence snapshot
```

Required behavior:

```text
existing capture is current
second decision capture = blocked
note overwrite = blocked
note edit = OUT
silent replacement = forbidden
decision + optional note remain immutable
```

This is the original Correction-1 post-success immutability rule.

### Case MISMATCH — different captured review instance candidate

```text
same base review context
+ successful prior capture exists
+ current evidence snapshot differs from captured Outcome evidence snapshot
```

Required meaning:

```text
prior capture is not the current captured review instance for current materials
current materials may return to undecided state
new synthetic capture for the new evidence snapshot may be allowed
```

If a new capture succeeds, session-current presentation state may replace the
prior non-current value for that base review-context key.

That replacement is Definitionally classified as:

```text
new capture for a different evidence-bound review instance
```

and **not** as:

```text
post-capture note edit
same-instance decision overwrite
correction of the prior capture
cancellation
supersede workflow
history mutation
```

The prior capture must not be presented as current when its evidence snapshot no
longer matches current materials.

---

## 4. Explicit reconciliation of Correction-1 wording

Correction-2 supersedes only the ambiguous breadth of the following
Correction-1 phrases. All other Correction-1 semantics remain in force.

### Original phrase: one review context / one captured decision

The original Definition requires:

```text
one review context
one captured decision
one optional supplemental note value at initial capture
```

For this amended Definition, that means:

```text
one evidence-bound captured review instance
→ one captured decision
→ zero or one supplemental note value at initial capture
```

It does **not** mean that one base review-context key is permanently limited to
one capture after the underlying evidence snapshot changes.

### Original phrase: after first successful capture for the same review-context key

The original duplicate/immutability rule is now read as:

```text
after first successful capture for the same base review-context key
AND the same evidence snapshot
→ second capture blocked / immutable
```

When the evidence snapshot is MISMATCH, the prior capture is not the current
captured review instance and the MATCH duplicate rule does not apply.

### Original phrase: a different person / planVersion / review period is different context

That statement remains true but is non-exhaustive.

A different person / planVersion / review period changes the **base review
context**. An evidence-snapshot change can instead create a different
**evidence-bound captured review instance** while the base review-context key
remains unchanged.

No note-edit, correction, cancellation, supersede, or history semantics are
introduced by this distinction.

---

## 5. Boundaries preserved from Correction-1

Correction-2 does not authorize any of the following:

```text
editing note text after capture for the same evidence snapshot
changing a captured decision for the same evidence snapshot
correction / cancellation / supersede workflow
multi-version capture history UI
generic timeline / comments architecture
production persistence
MonitoringVersion
SupportPlanVersion N+1 creation
SharePoint schema changes
Deploy / LIVE WRITE
AI-authored note or decision
```

The note remains optional and human-authored.

The note remains excluded from Outcome identity / OutcomeId mint material.

`NO_CHANGE` / `CHANGE_REQUIRED` semantics remain unchanged.

`CHANGE_REQUIRED` still does not mean that N+1 exists.

---

## 6. Definition invariants added by Correction-2

```text
INV-B15 A successful capture is immutable for the same evidence-bound review
        instance.

INV-B16 Evidence-snapshot mismatch under the same base review context means the
        prior capture is not current for the newly displayed materials.

INV-B17 A new capture after evidence-snapshot mismatch is a new evidence-bound
        review instance, not a post-capture edit/overwrite of the prior instance.

INV-B18 Evidence-snapshot mismatch must not cause an old decision/note to be
        presented as current committed readback.

INV-B19 Correction-2 introduces no history/archive requirement; only the current
        session presentation/capture lifecycle is in scope.
```

Existing INV-B1 through INV-B14 remain unchanged except that INV-B14
"Post-success note editing / overwrite is forbidden" is interpreted as applying
to the **same evidence-bound review instance**.

---

## 7. Acceptance criteria added by Correction-2

```text
AC-B13 Same base review context + matching evidence snapshot preserves the
        original duplicate/immutability rule.

AC-B14 Same base review context + mismatching evidence snapshot must not reuse
        the prior capture as current.

AC-B15 Mismatch may permit a new synthetic capture for the new evidence-bound
        review instance without introducing note edit/correction/supersede
        semantics.

AC-B16 After successful mismatch recapture, current readback reflects only the
        new evidence-bound review instance; an unchanged snapshot remains
        duplicate-blocked and immutable.

AC-B17 No Product/domain implementation starts until this Correction-2 receives
        Independent Definition Re-Review-2 PASS and separate Human Definition
        Lock GO, followed by Scope lineage reconciliation/re-review and separate
        Human Implementation Start GO.
```

---

## 8. Required downstream Scope reconciliation

After this Definition Correction-2 is independently review-cleared and separately
Human-locked, the existing Scope Correction-3 may be reconciled against it.

The downstream Scope must preserve at minimum:

```text
MATCH
  => DUPLICATE / immutable / no same-instance replacement

MISMATCH
  => prior capture non-current
  => new capture allowed for new evidence-bound review instance
  => successful new capture may atomically replace session-current value

mandatory evidence-snapshot binding check
focused R1/R2 regression
no history/archive requirement
```

If Scope requires a change to Outcome identity, persistence, history, or note edit
semantics, stop for another Definition correction instead of implementing ad hoc.

---

## 9. Gate

```text
Definition Correction-2 = APPLIED / CONSUMED
Independent Definition Re-Review-2 = CORRECTION REQUIRED / CONSUMED
Definition Correction-3 = APPLIED / REVIEW-CLEARED
Independent Definition Re-Review-3 = PASS / REVIEW-CLEARED
  @ aff0f748a8b4fd997dac74fcc6be7397b37a21a4
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
separate Human Definition Lock GO（Correction-3 packet）
→ Scope lineage reconciliation + R3
→ Independent Scope Re-Review-4
→ PASSなら separate Human Implementation Start GO（correction-only）
```
