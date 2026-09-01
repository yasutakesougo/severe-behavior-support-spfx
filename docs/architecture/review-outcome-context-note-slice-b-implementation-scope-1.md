# REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B — Implementation Scope Definition

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B-IMPLEMENTATION-SCOPE-1
kind: implementation scope / start-gate definition
status: SCOPE CORRECTION-2 APPLIED / AWAITING INDEPENDENT SCOPE RE-REVIEW-2
parent definition: REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B
parent correction: Correction-1
parent status: HUMAN DEFINITION LOCKED
parent durable path: docs/architecture/review-outcome-context-note-slice-b-definition-1.md
locked definition HEAD: 29c9941d87067e38d32a9b612911e66a0504332c
basis main at Scope Correction-2: 08492b65412053c78bcd976d7dde547b632dacfe
merged Product HEAD under review: b4bd4eb3e4b5cbfa2d3c4927b7d9a223f966c96f
post-merge reconciliation: docs/architecture/review-outcome-context-note-slice-b-post-merge-reconciliation-1.md
Independent Scope Review-1: CORRECTION REQUIRED / CONSUMED
P1-1 context-switch draft carry-over: CORRECTED
P2-1 character-count metric ambiguity: CORRECTED
Independent Scope Re-Review-1: PASS / REVIEW-CLEARED / CONSUMED
P0=0 / P1=0 / P2=0
exact reviewed Scope HEAD before Correction-2: 4044e4b0e8b3f3e41db90e9303d0eabd02886434
Independent Post-Merge Implementation Review-1: CORRECTION REQUIRED / CONSUMED
P1-1 evidence snapshot ↔ captured review binding: CORRECTED BY SCOPE CORRECTION-2
Scope Correction-2: APPLIED
Independent Scope Re-Review-2: REQUIRED / NOT STARTED
Human Definition Lock GO: RECEIVED / CONSUMED
Human Implementation Start GO (original Slice B): CONSUMED historically via #550
Human Implementation Start GO (Correction-2 only): NOT RECEIVED
prior PR comment GO (2026-08-31T22:45:40Z): INVALIDATED / NOT CONSUMED
unauthorized implementation drift ref: cursor/drift-slice-b-unauthorized-impl-bbe0 @ 4bfed955f008c2f7ea91f145aee16aaab0726881
Implementation Correction: NOT AUTHORIZED until Re-Review-2 PASS + Human GO
Ready / Merge / Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
```

## 1. Purpose

Fix the smallest implementation surface for the post-#549 Actual Staff observation:

```text
「見直しの補足事項などのメモ欄が必要に感じた」
```

The Slice adds one optional, human-authored review-context note to the existing
synthetic review decision capture/readback flow.

This Scope does **not** authorize Implementation Start.

## 2. Locked Definition binding

Implementation, if separately authorized, must remain conformant with:

```text
docs/architecture/review-outcome-context-note-slice-b-definition-1.md
Correction-1
Locked Definition HEAD: 29c9941d87067e38d32a9b612911e66a0504332c
```

This Scope does not reopen:

```text
NO_CHANGE / CHANGE_REQUIRED semantics
MonitoringPeriodReviewOutcome identity / OutcomeId mint material
CHANGE_REQUIRED != N+1
post-capture edit / overwrite prohibition
MonitoringVersion
SharePoint / LIVE WRITE / Deploy
AI note authoring or inference
```

## 3. Exact Scope decisions

### S1 — Physical representation family

```text
Decision: FAMILY B
narrow 0..1 MonitoringPeriodReviewOutcomeNote anchored 1:1 to OutcomeId
```

Reason:

- current `MonitoringPeriodReviewOutcome` is explicit schema `1.0.0`;
- adding a property to that object would require schema/DTO/validator compatibility work;
- the staff need is supplemental context, not a new Outcome identity;
- a narrow note contract preserves Outcome `v1.0.0` unchanged.

No additive field is added to `MonitoringPeriodReviewOutcome` in this Slice.

### S2 — Canonical note contract

Add a narrow canonical domain contract:

```text
MonitoringPeriodReviewOutcomeNote
  OutcomeId: string
  note: string
```

Contract identity:

```text
schemaId = severe-behavior-support.monitoring-period-review.outcome-note
schemaVersion = 1.0.0
dtoVersion = 1.0.0
LIVE_WRITE_AUTHORIZED = false
```

Rules:

```text
OutcomeId = existing captured MonitoringPeriodReviewOutcome.OutcomeId
NoteId = NOT INTRODUCED
note text = NOT OutcomeId mint material
blank note = no note record (null)
non-blank note = exactly one validated note record
```

The note record has no independent business identity in this Slice.

### S3 — Note length / normalization — Correction-1 / P2-1

```text
Decision: raw draft limit = 255 JavaScript UTF-16 code units
metric = draftNoteText.length
textarea maxLength = 255
counter = `${draftNoteText.length} / 255`
```

Basis: the repository's existing bounded SharePoint Text convention uses
`MaxLength: 255`; this Slice also defines the staff request as a short supplemental
memo. This is a domain/UI Slice limit only and does not authorize SharePoint schema.

Deterministic order:

```text
1. rawDraft = input
2. if rawDraft.length > 255 => INVALID / no partial capture
3. normalized = rawDraft.trim()
4. normalized.length === 0 => blank => null note record
5. otherwise { OutcomeId, note: normalized }
```

The UI uses the same raw `String.length` metric as the helper/tests. Native
`textarea maxLength=255` prevents ordinary UI entry beyond the limit; helper-level
validation remains fail-closed if a programmatic caller bypasses the DOM limit.

Line breaks remain plain text and count by JavaScript `String.length`.
HTML-like text is literal text only; `dangerouslySetInnerHTML` is forbidden.

### S4 — Canonical domain → SPFx export path

```text
Decision: NEW NARROW NOTE BUNDLE
```

Paths:

```text
src/domain/monitoring-period-review-outcome-note.ts
src/domain/monitoring-period-review-outcome-note-spfx-entry.ts
spfx/src/sbs-domain/monitoring-period-review-outcome-note.bundle.js
spfx/src/sbs-domain/monitoring-period-review-outcome-note.bundle.d.ts
```

The bundle may expose only the note type/DTO, normalization/validation helpers,
schema constants, max length constant, and LIVE_WRITE=false constant.

Do not modify the existing Outcome mint function or add note text to its input.
Do not extend `monitoring-read-model.bundle` with note semantics.

### S5 — Root domain export

`src/domain/index.ts` may add one export for the new canonical note contract.

No unrelated domain barrel changes are authorized.

### S6 — Synthetic capture state shape

The existing session state changes from Outcome-only to one atomic captured pair:

```text
SyntheticCapturedReview = {
  outcome: MonitoringPeriodReviewOutcome,
  note: MonitoringPeriodReviewOutcomeNote | null
}
```

Committed state remains keyed by the existing review-context key:

```text
OrganizationId + SiteId + UserId + planId + planVersion + periodStart + periodEnd
```

`MonitoringView` owns the captured pair map for the current React session.
No localStorage, SharePoint, repository port, or durable storage.

### S6.1 — Evidence snapshot binding — Scope Correction-2 / P1-1

The review-context key above is **not** a complete capture-identity for current
readback / “already captured” UI.

Canonical `MonitoringPeriodReviewOutcome` retains `sourceRecordIds`, and
`OutcomeId` mint material includes canonicalized `sourceRecordIds`.

Therefore the following divergence is possible while the review-context key is
unchanged:

```text
person / planId / planVersion / period = same
HumanReviewMaterials.sourceRecordIds A → B

reviewOutcomeContextKey = unchanged
canonical Outcome identity  = changed
```

Required invariant:

```text
INV-SB16
A stored SyntheticCapturedReview MUST NOT be treated as the current review
when the current HumanReviewMaterials evidence snapshot does not match the
captured Outcome evidence snapshot.
```

Evidence snapshot equality（deterministic）:

```text
canonicalize(ids) = unique non-empty RecordId strings, sorted ascending,
                    joined by the same separator used by OutcomeId mint
                    sourceRecordIds materialization

currentSnapshot = canonicalize(current materials.records[*].RecordId)
capturedSnapshot = canonicalize(captured.outcome.sourceRecordIds)

currentSnapshot == capturedSnapshot  => capture may be shown as current
currentSnapshot != capturedSnapshot  => capture is NOT current for these materials
```

Required resolve behavior when looking up `capturedReviews[contextKey]` for the
currently displayed RESOLVED materials:

```text
1. Read stored = capturedReviews[contextKey] | null
2. If stored is null => current capture = null（undecided）
3. If stored exists AND evidence snapshots match => current capture = stored
4. If stored exists AND evidence snapshots differ => current capture = null
   - do NOT show stored decision/note as committed for current materials
   - do NOT disable decision/note controls solely because of the mismatched store
   - do NOT silently overwrite or delete other context keys
   - optional: keep the mismatched map entry as non-current orphan data for the
     session; it must not be presented as the active capture
```

This is intentionally **not** solved only by concatenating `sourceRecordIds`
into the session map key. The binding check against current materials is
mandatory even if an implementation also chooses a richer storage key.

Focused regression required before Correction-2 implementation acceptance:

```text
same OrganizationId/SiteId/UserId/planId/planVersion/period
capture CHANGE_REQUIRED + optional note under sourceRecordIds = [A]
rerender materials with sourceRecordIds = [A,B]（or [B]）
=> UI is undecided again for current materials
=> prior note/decision are not shown as current committed readback
=> new capture is allowed
=> newly captured Outcome.sourceRecordIds reflect the new materials snapshot
```

### S7 — Atomic capture algorithm

On explicit human click of `NO_CHANGE` or `CHANGE_REQUIRED`:

```text
1. Require RESOLVED HumanReviewMaterials.
2. Read transient draftNoteText from ReviewOutcomeCaptureView.
3. Reject raw draft length >255 before normalization.
4. Normalize with trim(); whitespace-only => null note.
5. Assemble Outcome exactly as Slice A already does.
6. Mint OutcomeId through existing canonical Outcome bundle.
7. Validate Outcome through existing canonical Outcome validator.
8. If note is non-blank, create { OutcomeId, note } and validate through new canonical note contract.
9. Only after all required validation succeeds, commit one SyntheticCapturedReview value to session state.
10. Render readback only from the committed captured pair.
```

No note success may exist without Outcome success.
No Outcome success may be committed if a non-blank note is invalid.

### S8 — Note draft ownership / context reset — Correction-1 / P1-1

Before capture, `ReviewOutcomeCaptureView` may hold:

```text
draftNoteText: string
error: string | null
```

This is transient uncommitted input only. It is not evidence, persistence, or
readback state.

The draft is bound to the **exact review-context key** returned by the existing
`reviewOutcomeContextKey(materials)` helper.

Required reset mechanism:

```text
const contextKey = reviewOutcomeContextKey(materials)

React.useEffect(() => {
  setDraftNoteText("")
  setError(null)
}, [contextKey])
```

Equivalent hook code is allowed only if it has the same observable behavior.
Do not retain an uncommitted memo across a change in person, planVersion, period,
OrganizationId, SiteId, or UserId.

A focused component test must prove:

```text
context A: type memo but do not capture
rerender with context B
=> memo field empty
=> error state cleared
=> no A memo can be captured into B
```

The note is semantically captured only when the explicit decision action succeeds.

### S9 — Duplicate and immutability behavior

After first successful capture for the same review-context key:

```text
decision buttons = disabled
note textarea = disabled
note draft mutation = unavailable
second decision capture = blocked
note overwrite = blocked
note edit = OUT
silent replacement = forbidden
```

No correction, cancel, supersede, or history UI is added.

### S10 — UI copy and interaction

Exact primary label:

```text
見直しの補足メモ（任意）
```

Helper meaning:

```text
見直し結果に添える短い補足です。次の計画内容ではありません。
```

Character limit display:

```text
{draftNoteText.length} / 255
```

Fail-closed fallback error:

```text
補足メモは255文字以内で入力してください。
```

Existing Slice A copy remains unchanged, including:

```text
デモ上の見直し結果: 変更なし
デモ上の見直し結果: 変更が必要
次の計画版はまだ作成されていません
本番には保存されていません
```

### S11 — Readback

For non-blank note:

```text
補足メモ: <human-entered normalized text>
```

The note readback is visually secondary to the decision.

For blank note:

```text
no invented memo text
no placeholder readback pretending that a memo exists
```

Readback must render text safely and must not interpret HTML.

### S12 — Exact Product/domain file surface

Authorized Product/domain surface after separate Human Implementation Start GO only:

```text
A src/domain/monitoring-period-review-outcome-note.ts
M src/domain/index.ts
A src/domain/monitoring-period-review-outcome-note-spfx-entry.ts

A spfx/src/sbs-domain/monitoring-period-review-outcome-note.bundle.js
A spfx/src/sbs-domain/monitoring-period-review-outcome-note.bundle.d.ts
M spfx/src/sbs-domain/README.md

M spfx/src/shell/monitoring/review-outcome-capture.ts
M spfx/src/shell/monitoring/review-outcome-capture-copy.ts
M spfx/src/shell/monitoring/ReviewOutcomeCaptureView.tsx
M spfx/src/shell/monitoring/ReviewOutcomeCaptureView.module.scss
M spfx/src/shell/monitoring/HumanReviewView.tsx
M spfx/src/shell/monitoring/MonitoringView.tsx
```

No change to:

```text
src/domain/monitoring-period-review-outcome.ts
src/domain/support-plan-version-monitoring-period-review-binding.ts
SharePoint adapters / physical schema
SupportPlanVersion persistence
Monitoring read-model contract
```

If implementation needs any additional Product/domain file, stop for Scope Correction.

### S13 — Verification file surface

Authorized verification surface after Start GO:

```text
A tests/domain/monitoring-period-review-outcome-note.test.ts
A tests/contracts/monitoring-period-review-outcome-note-contract.test.ts

M spfx/src/shell/monitoring/review-outcome-capture.test.ts
M spfx/src/shell/monitoring/ReviewOutcomeCaptureView.test.tsx
M spfx/src/shell/monitoring/HumanReviewView.test.tsx
M spfx/src/shell/monitoring/MonitoringView.test.tsx

A spfx/smoke/review-outcome-context-note-slice-b/**
```

The Slice B smoke must be new; Slice A acceptance artifacts remain historical and
unchanged.

### S14 — Focused verification cases

Minimum domain/helper cases:

```text
blank note => null note record
whitespace-only => null note record
1 UTF-16 code unit => valid
255 UTF-16 code units => valid
256 UTF-16 code units => invalid before trim
leading/trailing spaces are trimmed only after raw-length validation
note OutcomeId must equal captured Outcome.OutcomeId
note text must not alter OutcomeId mint input/result
literal HTML-like text remains plain text
LIVE_WRITE_AUTHORIZED = false
```

Minimum capture/component cases:

```text
blank note + NO_CHANGE => captured pair(outcome, null)
non-blank note + NO_CHANGE => captured pair + readback
blank note + CHANGE_REQUIRED => captured pair(outcome, null)
non-blank note + CHANGE_REQUIRED => captured pair + pending-copy + memo readback
over-limit programmatic note => no partial success
duplicate after success => decision/note unchanged and controls disabled
context A uncommitted memo -> context B => draft/error reset, no carry-over
#549 person / planVersion / period / materials cues remain visible
```

### S15 — Rendered Browser Acceptance

New smoke path:

```text
spfx/smoke/review-outcome-context-note-slice-b/**
```

Viewports:

```text
1280x900
390x844
```

Rendered acceptance must prove at minimum:

```text
optional memo label/helper visible before capture
blank note remains optional
non-blank note readback visible after capture
NO_CHANGE and CHANGE_REQUIRED both supported
CHANGE_REQUIRED still says next plan version is not yet created
textarea + decision controls disabled after success
context switch does not carry uncommitted memo
255-length counter/textarea do not create horizontal overflow
pageerror = 0
LIVE WRITE / SharePoint side effect = none
```

### S16 — Actual Staff Value Gate

After Rendered Browser Acceptance, Actual Staff Value Check remains required before
Human Ready eligibility.

Use the locked Definition questions:

```text
1. 補足メモが「見直し結果に添える任意のメモ」だと分かるか？
2. メモを書かなくても見直し結果を記録できることが分かるか？
3. 「変更が必要」のメモを書いても、次の計画版が作成済みとは見えないか？
4. メモ欄は実際の見直し場面で役に立ちそうか？
```

One staff participant is sufficient for the first Slice B check unless separately
expanded by Human direction.

## 4. Slice flag

Implementation may add/extend a Slice B flag equivalent to:

```text
REVIEW_OUTCOME_CONTEXT_NOTE_SLICE_B = {
  id: "REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B",
  presentationOnly: true,
  liveWriteAuthorized: false,
  sharePointWriteAuthorized: false,
  planVersionMutationAuthorized: false,
  monitoringVersionAuthorized: false,
  noteEditAuthorized: false,
  aiNoteAuthoringAuthorized: false
}
```

## 5. Required invariants

```text
INV-SB1  Outcome v1.0.0 remains unchanged.
INV-SB2  Note is 0..1 and anchored to existing OutcomeId.
INV-SB3  Note content is excluded from Outcome identity / mint material.
INV-SB4  Blank note is valid and creates no note record.
INV-SB5  Raw draft uses one deterministic 255 UTF-16-code-unit limit across UI/helper/tests.
INV-SB6  Decision + note capture is atomic; no partial success.
INV-SB7  Uncommitted memo/error state resets on exact review-context-key change.
INV-SB8  After success, decision and note mutation controls are disabled.
INV-SB9  Note readback is secondary and plain text only.
INV-SB10 CHANGE_REQUIRED still does not imply N+1 exists.
INV-SB11 MonitoringVersion is not introduced.
INV-SB12 SharePoint / LIVE WRITE / Deploy are absent.
INV-SB13 AI cannot author or infer note content.
INV-SB14 Generic comments/timeline/history are not introduced.
INV-SB15 Slice A materials/identity/role cues remain intact.
INV-SB16 Current HumanReviewMaterials evidence snapshot must match captured
         Outcome.sourceRecordIds before a stored capture is treated as current.
         Mismatch => do not reuse old capture as current review.
```

## 6. Explicit OUT

```text
additive note property on MonitoringPeriodReviewOutcome v1.0.0
OutcomeId mint changes
NoteId / independent note identity
note edit / overwrite / correction / cancellation / supersede
multiple notes / timeline / threaded comments
rich text / attachments / mentions / reactions
AI generation / summarization / auto-completion
SupportPlanVersion N+1 creation or editing
SupportPlan.currentVersion / status mutation
MonitoringVersion / Monitoring snapshot persistence
Assessment / ServiceUser / Staff redesign
SharePoint list/column/schema/persistence work
Production Binding
Deploy / LIVE WRITE
Ready / Merge
```

## 7. Exact implementation sequence — only after Human Implementation Start GO

```text
1. Re-read locked Definition + this exact corrected Scope.
2. Add canonical OutcomeNote contract + domain tests.
3. Add narrow SPFx note bridge + generated bundle/typings.
4. Extend synthetic capture helper to atomic outcome + optional note pair.
5. Extend ReviewOutcomeCaptureView note draft/input/readback + context-key reset.
6. Wire captured pair through HumanReviewView / MonitoringView.
7. Focused tests and contract checks.
8. New Slice B rendered smoke at both viewports.
9. Exact implementation HEAD fixation.
10. Independent Implementation Review.
11. Actual Staff Value Check after rendered PASS.
12. STOP for separate Human Ready GO / HOLD.
```

Implementation Start does not authorize Ready, Merge, Deploy, SharePoint, Production
Binding, LIVE WRITE, or later note correction/edit semantics.

## 8. Scope acceptance criteria

```text
SAC-B1  Definition §16 decisions are all fixed or explicit OUT.
SAC-B2  Representation Family B preserves Outcome v1.0.0 unchanged.
SAC-B3  New note contract has explicit schema/validator semantics and no independent identity.
SAC-B4  One deterministic raw 255-code-unit metric is shared by UI/helper/tests.
SAC-B5  Uncommitted draft/error cannot cross review-context keys.
SAC-B6  Atomic capture and no-partial-success behavior are fixed.
SAC-B7  Exact Product/domain and verification file surfaces are bounded.
SAC-B8  Existing OutcomeId mint path remains untouched.
SAC-B9  Post-success note/decision mutation remains forbidden.
SAC-B10 Rendered acceptance + Actual Staff gate remain downstream prerequisites.
SAC-B11 MonitoringVersion / N+1 / SharePoint / LIVE WRITE remain OUT.
SAC-B12 Human Implementation Start is still a separate gate.
SAC-B13 Evidence-snapshot binding（INV-SB16 / S6.1）is fixed; mismatched
        sourceRecordIds cannot present a prior capture as current.
```

## 9. Stop conditions

```text
Independent Scope Re-Review-2 required before Human Implementation Start GO
for Correction-2.
If Re-Review-2 finds P0/P1 => further Scope Correction + exact re-review.
If representation Family B cannot be implemented without changing Outcome identity => HOLD / Definition re-open candidate.
If additional Product/domain paths are required => HOLD / Scope Correction.
If locked Definition changes => HOLD / re-scope.
Do not start Rendered Browser Acceptance while P1-1 remains open.
Do not treat #550 merge as Deploy / LIVE WRITE authority.
```

## 10. Next gate

```text
Scope Correction-1 = APPLIED / CONSUMED
Independent Scope Re-Review-1 = PASS / REVIEW-CLEARED / CONSUMED
Exact reviewed Scope HEAD before Correction-2
  = 4044e4b0e8b3f3e41db90e9303d0eabd02886434
Unauthorized implementation drift = RECONCILED historically
Prior PR comment Human Implementation Start GO (2026-08-31T22:45:40Z) = INVALIDATED
#550 merged Product HEAD = b4bd4eb3e4b5cbfa2d3c4927b7d9a223f966c96f
Independent Post-Merge Implementation Review-1 = CORRECTION REQUIRED / CONSUMED
Scope Correction-2 = APPLIED
Independent Scope Re-Review-2 = REQUIRED / NOT STARTED
Human Implementation Start GO（Correction-2 only）= AWAITING
  Re-Review-2 PASS + separate Human GO
Implementation Correction = NOT AUTHORIZED yet
Rendered Browser Acceptance = HOLD until Correction-2 lands
Actual Staff Value Check = HOLD
Ready / Merge / Deploy / Production Binding / LIVE WRITE = NOT AUTHORIZED
```
