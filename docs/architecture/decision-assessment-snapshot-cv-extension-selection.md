# Decision-ILB-1 — AssessmentSnapshots CV Extension Decision selection

この文書は、AssessmentSnapshots column path の次 substantive unit として
**Decision-AS-CV-EXTENSION-1** を選ぶ Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_ASSESSMENTSNAPSHOT_CV_EXTENSION_SELECTION
Status: SELECTED / CONSUMED
Selected unit: AssessmentSnapshots CV Extension Decision
Follow-up Decision / Packet ID: Decision-AS-CV-EXTENSION-1
  packet: decision-assessment-snapshot-cv-extension-packet.md
  acceptance: decision-assessment-snapshot-cv-extension-acceptance.md
  matrix: decision-assessment-snapshot-cv-extension-impact-matrix.md
  IR: decision-assessment-snapshot-cv-extension-independent-review.md
  Status: Accepted / LOCKED
        / M-1-A + X-1-B + X-2-A + X-3-B + X-4-B + X-5-B + XB-1

Baseline main:
  4fc919f63539466eced1a6f6213512e586583de5

Human Selection:
  AssessmentSnapshots CV Extension Decision — SELECT
  Explicit Human Decision on 2026-08-10

Human Acceptance:
  Explicit Human Decision on 2026-08-10
  PR: #208

Targets（placement Decision Accepted；column-ready ではない）:
  MAP-AS-009 findingIds → EXPLICITLY OUT
  MAP-AS-010 supersedesSnapshotId → PERSISTED / NOT YET COLUMN-READY
  MAP-AS-ENV-001 schemaId → DERIVED
  MAP-AS-ENV-002 schemaVersion → DERIVED / readable-set
  MAP-AS-ENV-003 dtoVersion → DERIVED / readable-set
```

## Locked basis（再 Decision しない）

```text
Decision-AS-CONVERSION-1: Accepted / LOCKED / C-1-A+C-2-DERIVED+C-3-A+C-4-A+XB-1
MAP-AS-001〜008:
  Internal Name / Type = OBSERVED / CONFIRMED
  Read / Write Conversion = ACCEPTED / LOCKED
AssessmentSnapshots Human Column Create: COMPLETE（CV-REQ 8）
VR-1（CV-REQ 8）: PASS
Decision-AS-COLUMN-NAMES-1: Accepted / LOCKED / NM-1+CV-REQ+XB-1
Entry #5 findingIds: NOT REQUIRED
DEC-009 / Decision-AS-APP-SAVE-1 / DEC6 VR-1: LOCKED
Decision-AS-CV-EXTENSION-1: Accepted / LOCKED
MT-1 table: NOT mapping-complete（MAP-AS-010 not column-ready）
```

## Selection meaning

```text
SELECTED / CONSUMED:
  Decision-AS-CV-EXTENSION-1
  Status = Accepted / LOCKED

This Selection / Acceptance does NOT mean:
  MAP-AS-010 column-ready
  Internal Name / Display Name / Column Type Acceptance
  SharePoint column creation
  conversion codecs for MAP-AS-010
  adapter / schema / DTO wiring
  mapping-complete PASS
  Implementation Start
  Deploy
```

## Options considered

| ID | unit | 結果 |
|---|---|---|
| **A** | AssessmentSnapshots CV Extension Decision（009/010/ENV） | **SELECTED / CONSUMED** |
| B | mapping-complete determination without placement Decision | NOT SELECTED |
| C | adapter Implementation Start | NOT SELECTABLE（HOLD） |
| HOLD | NO UNIQUE NEXT UNIT | NOT SELECTED |

## Explicit OUT

```text
MAP-AS-001〜008 re-Decision
Internal Name / Display Name / Column Type invention（MAP-AS-010）
SharePoint column create / mutation（this Acceptance）
adapter / DTO / schema wiring
mapping-complete PASS claim
Issue mutation
Deploy / real data
```

## Next

```text
Selection: SELECTED / CONSUMED
Decision-AS-CV-EXTENSION-1: Accepted / LOCKED
  / M-1-A + X-1-B + X-2-A + X-3-B + X-4-B + X-5-B + XB-1
mapping-complete: NOT YET
Remaining principal blocker: MAP-AS-010 column contract / create / VR-1
Next gate: HUMAN READY DECISION FOR PR #208
Still HOLD / FORBIDDEN:
  Implementation Start / adapter / schema wiring
  SharePoint / M365 mutation by Agent
  mapping-complete PASS
  Deploy / real data
```
