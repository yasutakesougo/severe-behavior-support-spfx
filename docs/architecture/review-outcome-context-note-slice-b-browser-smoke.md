# REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B — Browser smoke evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B
Kind: browser smoke / rendered acceptance
Status: PASS / VERIFIED
Date: 2026-09-01
Product basis HEAD: 3e4a035c3e70474e28dd26fbdfb49ab794c23090 (#558 correction)
Harness: spfx/smoke/review-outcome-context-note-slice-b/
presentationOnly: true
LIVE WRITE / Deploy / SharePoint: NOT AUTHORIZED
```

## Method

```text
Runner: node spfx/smoke/review-outcome-context-note-slice-b/run-smoke.mjs
Product basis: #558 corrected HEAD (capturedReviewMatchesMaterials / current-only epoch)
Viewports: 1280×900 (desktop) + 390×844 (mobile)
Evidence snapshot A: RecordId record-a
Evidence snapshot B: RecordId record-b
Same review-context key: org / site / user / plan / planVersion / period unchanged
Artifacts: /opt/cursor/artifacts/review-outcome-context-note-slice-b-browser-smoke
```

## Context-switch acceptance matrix

| Case | Assertion | Result |
|---|---|---|
| R1 | capture snapshot A → same-key snapshot B → undecided · A decision/note absent · controls enabled · textarea empty | PASS |
| R2 | capture snapshot B → B readback only · controls disabled · A cannot reappear | PASS |
| R3 | B → A recurrence → MISMATCH → undecided · B readback absent · recapture allowed as new epoch | PASS |
| R4a | uncaptured A draft → snapshot B → draft reset | PASS |
| R4b | captured A note → snapshot B → buffer reset · no A readback on B | PASS |
| boundary | 255 UTF-16 code units · counter 255/255 · no horizontal overflow | PASS |
| viewport | 1280×900 + 390×844 both exercised | PASS |
| page errors | 0 | PASS |
| external requests | 0 | PASS |
| horizontal overflow | 0 | PASS |

```text
allPass: true
viewports: 2 / 2
pageerror: 0
externalRequests: 0
horizontalOverflow: 0
productBasisHead: 3e4a035c3e70474e28dd26fbdfb49ab794c23090
```

## Boundary held

```text
Synthetic / presentation-only capture
current-only epoch semantics (MISMATCH hides non-current stored capture)
No SharePoint / LIVE WRITE / Deploy
Post-capture same-epoch decision + note controls disabled
Uncommitted memo does not cross evidence-snapshot epoch
CHANGE_REQUIRED still states next plan version is not yet created
```
