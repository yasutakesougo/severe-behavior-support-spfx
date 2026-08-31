# REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B — Definition

```text
Definition ID = REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B
Mode = DEFINITION ONLY
Status = DEFINITION CANDIDATE / AWAITING INDEPENDENT REVIEW
basis main = 47145948b337d7e7f9d923bbf01ec962daafef08
parent = REVIEW-OUTCOME-CAPTURE-SLICE-A
parent PR = #549 MERGED
parent exact implementation HEAD = 4731e4d855c289d90a35eb2b4a8b68e43e462952
parent merge commit = 47145948b337d7e7f9d923bbf01ec962daafef08
Human Definition Lock GO = NOT RECEIVED
Implementation = NOT AUTHORIZED
Ready / Merge / Deploy / Production Binding / LIVE WRITE = NOT AUTHORIZED
SharePoint / M365 / Entra mutation = NOT AUTHORIZED
```

This document defines the smallest next Product Slice after Slice A.
It does not authorize Implementation Start.

---

## 1. Product evidence and reason for this Slice

Slice A completed the following product/value gates at exact implementation HEAD
`4731e4d855c289d90a35eb2b4a8b68e43e462952`:

```text
Focused Verification = PASS
Rendered Browser Acceptance = PASS / VERIFIED
Actual Staff Value Check = PASS / VALUE CONFIRMED
Independent Implementation Review-1 = PASS / REVIEW-CLEARED
PR #549 = MERGED
```

Actual Staff Value Check participant: Staff 1.

Required value questions:

```text
Q1 誰の・どの期間・どの計画を見直しているか分かるか？
Answer: わかりやすい

Q2 「変更なし」と「変更が必要」の意味が迷わず分かるか？
Answer: わかる

Q3 「変更が必要」でも、まだ次の計画版が作られていないことが分かるか？
Answer: わかる
```

Additional staff observation:

```text
「見直しの補足事項などのメモ欄が必要に感じた」
```

This observation was non-blocking for Slice A and is the direct evidence for this
new Slice B candidate.

This Slice is therefore not justified by AI simulation or speculative redesign.
It is justified by one concrete Actual Staff product-use observation after Slice A
passed its required value questions.

---

## 2. Current-main baseline

Current main after #549 contains:

```text
HumanReviewMaterials display
explicit human review decision capture
NO_CHANGE / CHANGE_REQUIRED
synthetic / presentation-only MonitoringPeriodReviewOutcome assembly
same-screen non-production readback
CHANGE_REQUIRED -> next plan version not yet created meaning
duplicate capture fail-closed within session
canonical OutcomeId mint + validator bridge
LIVE WRITE = false
```

Current canonical `MonitoringPeriodReviewOutcome` v1.0.0 contains:

```text
OutcomeId
OrganizationId
SiteId
UserId
planId
planVersion
periodStart
periodEnd
sourceRecordIds[]
decision
reviewedAt
reviewedBy
```

It does not currently contain a review-note / memo field.

---

## 3. Primary Product Gap

The primary gap is:

```text
Staff can record the decision
        ↓
but cannot attach a short human-authored contextual note
        ↓
the reason / supplemental context may be lost outside the review flow
```

Target concept:

```text
HumanReviewMaterials
        ↓
human chooses NO_CHANGE or CHANGE_REQUIRED
        ↓
optional human-authored review context note
        ↓
synthetic outcome capture/readback
```

The note is supplementary context. It is not a third decision value.

---

## 4. Semantic ownership of the note

The note belongs semantically to the **review outcome context**.

It does not belong to:

```text
individual ProcedureRecord
Monitoring derived view
SupportPlanVersion N+1 content
Assessment
ServiceUser master
Staff master
AI recommendation
```

Required meaning:

```text
review context note
= optional human-authored context accompanying this review decision
```

Examples of intended content include:

```text
- what the reviewer especially noticed when deciding
- short contextual reason for NO_CHANGE / CHANGE_REQUIRED
- a reminder that should be considered in the later revision workflow
```

The note must not itself mean:

```text
N+1 exists
revision is complete
plan text has been changed
authoritative production Outcome has been saved
```

---

## 5. Optionality and decision independence

The note is optional.

```text
blank note + NO_CHANGE = valid Slice B interaction
blank note + CHANGE_REQUIRED = valid Slice B interaction
non-blank note + NO_CHANGE = valid Slice B interaction
non-blank note + CHANGE_REQUIRED = valid Slice B interaction
```

The presence or absence of a note must not change decision semantics.

```text
note != decision
note != approval
note != revision completion
```

No minimum explanatory text is required by this Slice.

No AI-generated default note is allowed.

---

## 6. Domain contract boundary

Current `MonitoringPeriodReviewOutcome` schema is v1.0.0 and has no note field.

This Slice must not silently mutate that v1.0.0 contract.

Before Implementation Start, Implementation Scope must make an explicit domain
compatibility decision for representing the note.

Allowed semantic implementation families are limited to:

```text
A. additive review-note field owned by MonitoringPeriodReviewOutcome,
   with explicit schema / DTO / validator / compatibility treatment

or

B. narrow 1:1 review-outcome note record anchored to OutcomeId,
   used only if preserving the existing Outcome schema requires it
```

The implementation mechanism is not chosen by this Definition.

Whichever family is chosen, it must preserve:

```text
one review context
one captured decision
optional supplemental note
no general-purpose notes subsystem
```

Forbidden shortcuts:

```text
UI-only text with no defined semantic owner
silent extra property on v1.0.0 Outcome object
reuse of SupportPlan free text as the review note
new generic comment/activity-feed architecture
```

---

## 7. Note content rules

The note is plain text only for this Slice.

```text
rich text = OUT
attachments = OUT
mentions = OUT
reactions = OUT
threaded comments = OUT
multiple note entries / timeline = OUT
```

Implementation Scope must set a finite maximum length and visible character-count
or equivalent fail-closed behavior.

Definition-level constraints:

```text
leading/trailing whitespace may be normalized
all-whitespace input is equivalent to blank
note must not be required
note must not accept hidden HTML semantics
note validation failure must not create partial success
```

Exact maximum length is deferred to Implementation Scope after checking repository
contract conventions.

---

## 8. UI target

The smallest target UI is one optional memo field colocated with Slice A capture.

Required human meaning:

```text
見直しの補足メモ（任意）
```

Equivalent wording is acceptable if usability review finds a clearer label.

The UI must make clear that the memo is associated with the current:

```text
person
planVersion
review period
review decision
```

The memo field must not appear as a plan-editing form.

For CHANGE_REQUIRED, the existing message remains required:

```text
次の計画版はまだ作成されていません
```

The existing non-production boundary remains required while Slice B uses synthetic
capture:

```text
本番には保存されていません
```

---

## 9. Capture timing

Preferred interaction concept:

```text
optional note entry
        ↓
explicit NO_CHANGE or CHANGE_REQUIRED action
        ↓
atomic synthetic capture of decision + associated note representation
        ↓
same-screen readback
```

The note must not be silently saved before the explicit decision action.

If capture validation fails:

```text
no decision success readback
no note success readback
no partial synthetic store
```

Duplicate handling from Slice A remains fail-closed unless Implementation Scope
explicitly defines a bounded note-edit behavior.

Note editing after successful capture is NOT automatically authorized by this
Definition.

---

## 10. Readback

After successful synthetic capture, readback must show the note when non-blank.

Example meaning:

```text
デモ上の見直し結果: 変更が必要
補足メモ: <human-entered text>
次の計画版はまだ作成されていません
本番には保存されていません
```

For blank note, the UI should not invent placeholder content as if a note exists.

The note readback must be visually secondary to the decision.

---

## 11. Human / AI authority boundary

Only the human user may author the note in this Slice.

```text
AI generated note = OUT
AI summary inserted as note = OUT
AI auto-completion = OUT
AI decision from note = OUT
```

The note may later become evidence for a separately defined AI-support feature,
but this Slice does not authorize that use.

Synthetic actor boundaries from Slice A remain unchanged unless separately scoped.

---

## 12. Persistence boundary

This Slice does not authorize production persistence.

```text
SharePoint Outcome persistence = OUT
SharePoint note persistence = OUT
Production Binding = OUT
LIVE WRITE = OUT
Deploy = OUT
```

Initial implementation, if later authorized, remains synthetic / presentation-only
unless a separate production-persistence Definition and Human authority are created.

A note textarea does not create permission to add SharePoint columns or Lists.

---

## 13. Required invariants

```text
INV-B1  Note is optional human-authored supplemental review context.
INV-B2  NO_CHANGE / CHANGE_REQUIRED remain the only decisions.
INV-B3  Note presence does not change decision semantics.
INV-B4  Note != N+1 plan content and does not create N+1.
INV-B5  Note has an explicit domain semantic owner before implementation.
INV-B6  Existing Outcome v1.0.0 is not silently mutated.
INV-B7  UI-only orphan note state is forbidden.
INV-B8  Synthetic capture remains non-authoritative / non-production.
INV-B9  No SharePoint / LIVE WRITE / Deploy authority is introduced.
INV-B10 AI cannot author or infer the note.
INV-B11 No generic comments/timeline subsystem is introduced.
INV-B12 Existing Slice A identity / period / plan context and readback remain visible.
```

---

## 14. Explicit OUT

```text
SupportPlanVersion N+1 creation
SupportPlan.currentVersion mutation
SupportPlan.status changes
plan editor
MonitoringVersion
Monitoring snapshot persistence
Assessment -> Plan redesign
ServiceUser / Staff master redesign
SharePoint persistence
Production Binding
Deploy / LIVE WRITE
AI note generation / summarization
AI decision support
attachments
rich text
comment threads
note history / edit history
correction / cancellation / supersede workflow
generic notes architecture
```

---

## 15. Definition acceptance criteria

```text
AC-B1  Slice is directly grounded in Staff 1 post-Slice-A observation.
AC-B2  Note is optional and subordinate to the decision.
AC-B3  Note semantic ownership is review outcome context.
AC-B4  Current Outcome v1.0.0 absence of note is explicitly recognized.
AC-B5  Schema representation must be explicitly decided before Implementation Start.
AC-B6  UI target is one bounded plain-text optional field + readback.
AC-B7  CHANGE_REQUIRED still states next plan version is not yet created.
AC-B8  Synthetic / non-production boundary remains visible.
AC-B9  No generic comment architecture or production persistence is absorbed.
AC-B10 No Implementation / Ready / Merge / Deploy / LIVE WRITE is authorized here.
```

---

## 16. Required Implementation Scope decisions after Definition Lock

If this Definition is independently review-cleared and later Human-locked,
Implementation Scope must decide at minimum:

```text
1. exact representation family: Outcome additive field vs narrow 1:1 OutcomeNote
2. schema / DTO / validator compatibility treatment
3. whether OutcomeId identity material includes or excludes note content
4. exact note field name / type / maximum length / whitespace normalization
5. exact canonical domain -> SPFx export path
6. synthetic state shape and atomic capture behavior
7. duplicate behavior and whether post-capture note edit remains OUT
8. UI label, helper copy, character-limit UX, error copy
9. readback rendering for blank and non-blank note
10. focused contract/component tests
11. rendered browser acceptance at 1280x900 and 390x844
12. Actual Staff Value Check after rendered acceptance
```

If item 1 or 2 cannot be resolved without materially changing the parent Outcome
semantics, stop for Definition Correction rather than implementing ad hoc.

---

## 17. Verification / Staff Value Gate

Implementation verification, if later authorized, must prove at minimum:

```text
blank note + NO_CHANGE
non-blank note + NO_CHANGE
blank note + CHANGE_REQUIRED
non-blank note + CHANGE_REQUIRED
note readback matches human-entered text
note does not create N+1 semantics
invalid/over-limit note fails closed
no partial success
non-production boundary visible
no SharePoint / LIVE WRITE path
```

Rendered Browser Acceptance remains required at:

```text
1280x900
390x844
```

After rendered acceptance, Actual Staff Value Check is required before Human Ready.

Minimum Slice B staff questions:

```text
1. 補足メモが「見直し結果に添える任意のメモ」だと分かるか？
2. メモを書かなくても見直し結果を記録できることが分かるか？
3. 「変更が必要」のメモを書いても、次の計画版が作成済みとは見えないか？
4. メモ欄は実際の見直し場面で役に立ちそうか？
```

One staff participant is sufficient for the first Slice B check unless broader
confirmation is separately requested.

---

## 18. Gate

```text
Definition = CANDIDATE
Independent Definition Review-1 = REQUIRED
Human Definition Lock GO = NOT AUTHORIZED YET
Implementation Scope = NOT AUTHORIZED YET
Implementation Start = NOT AUTHORIZED
Ready / Merge / Deploy / Production Binding / LIVE WRITE = NOT AUTHORIZED
```

NEXT:

```text
Independent Definition Review-1
        ↓
Definition Correction if required
        ↓
Independent Definition Re-Review
        ↓
Human Definition Lock GO / HOLD
```
