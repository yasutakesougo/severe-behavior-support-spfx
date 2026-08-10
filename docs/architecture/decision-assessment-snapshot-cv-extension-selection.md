# Decision-ILB-1 — AssessmentSnapshots CV Extension Decision selection

この文書は、AssessmentSnapshots column path の次 substantive unit として
**Decision-AS-CV-EXTENSION-1** を選ぶ Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_ASSESSMENTSNAPSHOT_CV_EXTENSION_SELECTION
Status: SELECTED / OPEN
Selected unit: AssessmentSnapshots CV Extension Decision
Follow-up Decision / Packet ID: Decision-AS-CV-EXTENSION-1
  packet: decision-assessment-snapshot-cv-extension-packet.md
  matrix: decision-assessment-snapshot-cv-extension-impact-matrix.md
  IR: decision-assessment-snapshot-cv-extension-independent-review.md
  Status: OPEN / NOT ACCEPTED（Human Acceptance 待ち）

Baseline main:
  4fc919f63539466eced1a6f6213512e586583de5

Human Selection:
  AssessmentSnapshots CV Extension Decision — SELECT
  Explicit Human Decision on 2026-08-10

Targets（placement Decision only；採用確定ではない）:
  MAP-AS-009 findingIds
  MAP-AS-010 supersedesSnapshotId
  MAP-AS-ENV-001 schemaId
  MAP-AS-ENV-002 schemaVersion
  MAP-AS-ENV-003 dtoVersion
```

## Locked basis（再 Decision しない）

```text
Decision-AS-CONVERSION-1: Accepted / LOCKED / C-1-A+C-2-DERIVED+C-3-A+C-4-A+XB-1
MAP-AS-001〜008:
  Internal Name / Type = OBSERVED / CONFIRMED
  Read / Write Conversion = ACCEPTED / LOCKED
AssessmentSnapshots Human Column Create: COMPLETE
VR-1（CV-REQ 8）: PASS
Decision-AS-COLUMN-NAMES-1: Accepted / LOCKED / NM-1+CV-REQ+XB-1
  CV-REQ = MAP-AS-001〜008 only；009/010/ENV = OUT
Entry #5 findingIds: NOT REQUIRED
DEC-009 / Decision-AS-APP-SAVE-1 / DEC6 VR-1: LOCKED
MT-1 table: NOT mapping-complete
```

## Selection meaning

```text
SELECTED / OPEN:
  Decision-AS-CV-EXTENSION-1
  Purpose = make remaining persistence placement Decision-ready
            for mapping-complete disposition

This Selection does NOT Accept:
  field adoption as persisted columns
  Internal Name / Display Name / Column Type
  conversion codecs for 009/010/ENV
  SharePoint column creation
  adapter / schema / DTO wiring
  mapping-complete PASS
  Implementation Start
  Deploy
```

## Options considered

| ID | unit | 結果 |
|---|---|---|
| **A** | AssessmentSnapshots CV Extension Decision（009/010/ENV） | **SELECTED** |
| B | mapping-complete determination without placement Decision | NOT SELECTED（009/010/ENV still NOT PRESENT） |
| C | adapter Implementation Start | NOT SELECTABLE（HOLD） |
| HOLD | NO UNIQUE NEXT UNIT | NOT SELECTED |

## Explicit OUT

```text
MAP-AS-001〜008 re-Decision
Internal Name / Display Name / Column Type invention
SharePoint column create / mutation
adapter / DTO / schema wiring
mapping-complete PASS claim
Issue mutation
Deploy / real data
```

## Next

```text
Selection: SELECTED / OPEN
Decision-AS-CV-EXTENSION-1: OPEN / NOT ACCEPTED
Next gate: HUMAN ACCEPTANCE OF Decision-AS-CV-EXTENSION-1
Still HOLD / FORBIDDEN:
  Implementation Start / adapter / schema wiring
  SharePoint / M365 mutation
  mapping-complete PASS
  Deploy / real data
```
