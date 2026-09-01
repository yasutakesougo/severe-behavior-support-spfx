# SBS-MGMT-LOOP-A — Implementation Scope Correction-2 (#552)

```text
repository: yasutakesougo/severe-behavior-support-spfx
tracking issue: #552
unit: SBS-MGMT-LOOP-A-IMPLEMENTATION-SCOPE-CORRECTION-2
kind: docs-only implementation scope correction
rebaseline main: 2c99d0c6d4dd8a4691ed64386650808d07525f38
exact product implementation basis under correction: bfa7eaa2821197d68c284735ce5a6b355c3e5687
prior implementation scope: PR #562 / docs/architecture/sbs-mgmt-loop-a-implementation-scope-552-1.md
locked original Definition: issuecomment-5489293623
prior Human Definition Lock: issuecomment-5489311067
Actual Staff evidence: issuecomment-5490598734
Actual Staff Value Check: HOLD / Q4 BLOCKING
locked amendment: Actual Staff Finding Disposition Definition-1 @ PR #564 HEAD 3cebbdcd8807695ca527123afec9e4126ce26f11
Independent Definition Review-1: PASS / issuecomment-5490626009
Human Definition Amendment Lock GO: RECEIVED / CONSUMED / issuecomment-5490638884
Implementation Scope Correction GO: RECEIVED / CONSUMED
Human Implementation Correction GO: NOT RECEIVED
```

## 1. Purpose

Reflect only the Human-locked Actual Staff finding disposition into the existing #552 implementation scope.

This packet does not reopen the decisionReason domain contract, Outcome identity, CurrentCaptureEpoch semantics, or #553. It does not authorize Product, fixture, test, smoke, Ready, Merge, Deploy, Production Binding, SharePoint/M365/Entra mutation, or LIVE WRITE.

## 2. Exact read-back of current product basis

At exact product basis `bfa7eaa2821197d68c284735ce5a6b355c3e5687`:

- `SyntheticCapturedReview` already contains `decisionReason` and nullable `note`.
- `assembleSyntheticCapturedReview(..., draftNoteText)` normalizes the note; blank input produces `note = null` under the existing Note v1 contract.
- `ReviewOutcomeCaptureView.tsx` currently owns both `draftDecisionReason` and `draftNoteText`, renders both textareas, validates note length, and passes both values to `onCapture`.
- the same view currently renders NO_CHANGE and CHANGE_REQUIRED with the same action class.
- current-epoch reset already binds transient reason/note/error state to `reviewOutcomeCurrentEpochBindingKey(materials)`.

Therefore the locked amendment can be implemented without changing `MonitoringPeriodReviewOutcomeNote` v1, `SyntheticCapturedReview` shape, OutcomeId minting, decisionReason domain contract, or current-epoch helpers.

## 3. Scope delta from prior Scope (#562)

### 3.1 Human-facing writable input

Supersede prior S10 text that required two staff-facing text inputs.

Corrected rule:

```text
#552 staff-facing writable text input
= decisionReason only
```

The supplemental note input is removed from the corrected #552 staff-facing surface.

### 3.2 Note handling

Preserve the existing aggregate and Note v1 contract:

```text
SyntheticCapturedReview = {
  outcome,
  decisionReason,
  note: MonitoringPeriodReviewOutcomeNote | null
}
```

For new capture through the corrected #552 UI:

```text
onCapture(decision, draftDecisionReason, "")
→ existing note normalization
→ note = null
```

No Note domain/DTO/validator/bundle/schema changes are authorized.

### 3.3 Q2 minimal visual distinction

Allow only a narrow visual distinction between the existing actions:

```text
NO_CHANGE label = unchanged
CHANGE_REQUIRED label = unchanged
vocabulary = unchanged
color-only distinction = forbidden
```

Permitted changes are limited to existing control-family styling such as border, weight, emphasis hierarchy, and optional color as a secondary cue. No new decision semantics, warning state, failure state, or redesign.

## 4. Exact correction implementation surface

After separate Human Implementation Correction GO only, Product mutation is limited to:

```text
M spfx/src/shell/monitoring/ReviewOutcomeCaptureView.tsx
  - remove note field import/state/helper/counter/textarea from staff-facing UI
  - keep decisionReason input and requiredness
  - pass empty draftNoteText to existing onCapture contract
  - preserve current-epoch reason/error reset behavior
  - preserve committed readback compatibility for a non-null historical/session note if such a captured aggregate is supplied; do not add a new writable note input

M spfx/src/shell/monitoring/ReviewOutcomeCaptureView.module.scss
  - remove or leave unreachable note-input-only styling as implementation hygiene permits
  - add minimal non-color-only action distinction
  - no layout redesign
```

No other Product/domain file is authorized by default.

Conformance-only / no Product mutation expected:

```text
spfx/src/shell/monitoring/review-outcome-capture.ts
spfx/src/shell/monitoring/review-outcome-capture-copy.ts
spfx/src/shell/monitoring/HumanReviewView.tsx
spfx/src/shell/monitoring/MonitoringView.tsx
src/domain/**
spfx/src/sbs-domain/**
```

If Product correction requires changing any conformance-only/domain path, STOP for Scope Correction before mutation.

## 5. Exact verification surface

After separate Human Implementation Correction GO only:

```text
M spfx/src/shell/monitoring/ReviewOutcomeCaptureView.test.tsx
  - F1/F2/F3/F4/F7/F8
  - epoch reset regression where applicable

M spfx/src/shell/monitoring/review-outcome-capture.test.ts
  - F5 note=null capture conformance
  - F6 Note v1 compatibility conformance
  - R1-R12 regression as applicable; implementation logic change is not expected

M spfx/src/shell/monitoring/MonitoringView.test.tsx
  - R8-R12/current-epoch regression only if existing test fixtures require updated UI expectations

M spfx/smoke/sbs-mgmt-loop-a-review-completion/**
  - corrected staff-facing single-input surface
  - Q2 visual distinction assertion
  - corrected rendered acceptance matrix
```

Existing domain/contract tests for DecisionReason and OutcomeNote remain regression inputs but are not mutation-authorized unless a test expectation alone must be adjusted without changing contract semantics. If a contract semantic change appears necessary, STOP / Definition reopen.

## 6. Required regression matrix

R1-R12 remain mandatory and unchanged.

```text
R1  NO_CHANGE + blank reason = PASS
R2  CHANGE_REQUIRED + reason = PASS
R3  CHANGE_REQUIRED + blank reason = INVALID / partial 0
R4  zero-record + NO_CHANGE + blank = PASS
R5  zero-record + CHANGE_REQUIRED + reason = PASS
R6  PERFORMED_WITH_ADAPTATION != automatic CHANGE_REQUIRED
R7  context mismatch = fail closed
R8  MATCH snapshot = DUPLICATE / immutable
R9  A→B MISMATCH = undecided / recapture allowed
R10 B→A = mismatch vs current B / historical A not restored / new capture allowed
R11 uncommitted current-epoch draft/error reset
R12 captured-epoch local buffer reset / prior committed epoch not current readback
```

Note-specific interpretation for corrected UI:

- R11/R12 no longer require a user-editable note draft on the corrected staff-facing surface.
- They continue to require no stale decisionReason/error carry-over and no prior committed note/reason being treated as current after epoch mismatch.
- Existing aggregate note compatibility remains intact.

## 7. Finding-specific acceptance F1-F10

```text
F1  undecided corrected surface has exactly one human-facing writable text input: 判断理由
F2  CHANGE_REQUIRED + blank reason = INVALID / partial capture 0
F3  CHANGE_REQUIRED + nonblank reason = CAPTURED
F4  NO_CHANGE + blank reason = CAPTURED
F5  corrected UI capture produces note = null
F6  MonitoringPeriodReviewOutcomeNote v1 contract / validator / DTO / bundle semantics unchanged
F7  captured decisionReason readback is understandable without a supplemental memo input
F8  NO_CHANGE / CHANGE_REQUIRED are more visually distinguishable and not color-only
F9  R8-R12 CurrentCaptureEpoch behavior unchanged
F10 no SharePoint / M365 / Entra / LIVE WRITE / N+1 / #553 mutation
```

## 8. Rendered Browser Acceptance

Prior PASS at `bfa7eaa…` becomes historical predecessor evidence only for the corrected surface. It does not close corrected-HEAD Rendered Browser Acceptance.

After implementation correction, rerun at exact corrected Product HEAD:

```text
1280 × 900
390 × 844
```

Minimum rendered checks:

- person / plan version / period cues retained
- only `判断理由` is writable text input
- no staff-facing supplemental memo textarea/counter/helper
- CHANGE_REQUIRED blank reason block
- CHANGE_REQUIRED + reason readback
- NO_CHANGE + blank reason
- Q2 action distinction visible without color-only dependency
- zero-record factual state retained
- current-epoch mismatch/reset behavior retained
- no horizontal overflow
- pageerror = 0
- external request = 0
- `本番には保存されていません` / LIVE_WRITE=false boundary retained
- next plan version not created

## 9. Actual Staff Re-Check

Real staff re-check is mandatory; simulation cannot substitute.

Primary questions:

```text
Q2-recheck: 「変更なし」と「変更が必要」は区別しやすいですか？
Q4-recheck: 判断した理由をどこに書けばよいか迷いませんか？
```

Regression confirmation:

```text
Q1 誰の・どの期間の見直しか
Q3 判断理由をどこへ書くか
Q5 この操作だけで次の計画版が作られないこと
```

Exit criteria:

```text
Q4 blocking finding = CLOSED
Q2 = PASS or explicitly accepted non-blocking minor
Q1/Q3/Q5 = PASS regression
```

Staff PASS does not itself grant Human Ready GO.

## 10. Explicit OUT

```text
MonitoringPeriodReviewOutcomeNote contract deletion or version change
historical note migration or cleanup
Outcome / OutcomeId changes
decisionReason contract changes
same-epoch post-capture edit/amendment
new memo taxonomy / handoff taxonomy
history/archive/seen-snapshot registry
AI-generated reason
automatic CHANGE_REQUIRED inference
RevisionIntent / Plan Draft vN+1 / #553
SupportPlan mutation
SharePoint / M365 / Entra mutation
Deploy / Production Binding / LIVE WRITE
Human Ready / Merge state change
```

## 11. Stop conditions

```text
If note = null cannot be obtained through existing normalization without domain change => STOP / Scope Correction
If UI correction needs a new Product path outside §4 => STOP / Scope Correction
If Note v1 semantics need changing => STOP / Definition reopen
If Outcome identity needs changing => STOP / Definition reopen
If Q2 improvement requires new decision semantics => STOP / Definition reopen
If corrected staff evidence still shows Q4 blocking => HOLD / further disposition
```

## 12. Gate

```text
Human Definition Amendment Lock GO
= RECEIVED / CONSUMED / issuecomment-5490638884

Implementation Scope Correction GO
= RECEIVED / CONSUMED

Implementation Scope Correction-2
= RECORDED / THIS DOCUMENT

Independent Scope Review-2
= REQUIRED

Human Implementation Correction GO
= NOT RECEIVED

Product / fixture / test / smoke mutation
= NOT AUTHORIZED

Actual Staff Value Check
= HOLD until corrected-HEAD real Staff Re-Check

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
→ Independent Scope Review-2
→ Scope Correction / Re-Review if required
→ PASSなら separate Human Implementation Correction GO / HOLD
```
