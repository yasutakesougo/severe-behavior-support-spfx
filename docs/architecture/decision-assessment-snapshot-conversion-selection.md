# Decision-ILB-1 — AssessmentSnapshots Conversion Contract selection

この文書は、AssessmentSnapshots column path の次 substantive unit として
**Decision-AS-CONVERSION-1（Conversion Contract）** を選ぶ Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_ASSESSMENTSNAPSHOT_CONVERSION_SELECTION
Status: SELECTED / OPEN
Selected unit: AssessmentSnapshots Conversion Contract
Follow-up Decision / Packet ID: Decision-AS-CONVERSION-1
  packet: decision-assessment-snapshot-conversion-packet.md
  contract candidate: assessment-snapshot-conversion-contract.md
  IR: decision-assessment-snapshot-conversion-independent-review.md
  Status: OPEN / NOT ACCEPTED（Human Acceptance 待ち）

Baseline main:
  632d28ae44e1b72929dc628caae183197a976477

Human Selection:
  Option A — SELECT
  Explicit Human Decision on 2026-08-10
```

## Locked basis（再 Decision しない）

```text
AssessmentSnapshots Human Column Create: COMPLETE
VR-1: PASS
Sites: severe-support-isogo / severe-support-honmoku
MAP-AS-001〜008 Internal Name / Display Name / Column Type:
  OBSERVED / CONFIRMED
recordStatus / result Choice mappings:
  OBSERVED / CONFIRMED
periodStart / periodEnd DateOnly:
  OBSERVED / CONFIRMED
Evidence: decision-assessment-snapshot-column-create-vr1-evidence.md

Decision-AS-COLUMN-NAMES-1: Accepted / LOCKED / NM-1+CV-REQ+XB-1
Decision-AS-CHOICE-OPTIONS-1: Accepted / LOCKED / CO-1+CV-CHOICE-BOTH+XB-1
Decision-AS-DEC6-MAPPING-1: Accepted / LOCKED / LF-1+RW-1+MF-1+VR-1
Decision-AS-SP-ADAPTER-1: Accepted / LOCKED / PB-1+EM-1+CV-1+D6-1+UP-1
MT-1 table: assessment-snapshot-sharepoint-mapping.md（NOT mapping-complete）
```

## Selection meaning

```text
SELECTED / OPEN:
  Decision-AS-CONVERSION-1
  Scope = MAP-AS-001〜008 Read / Write conversion contract determination

This Selection does NOT mean:
  mapping-complete PASS
  adapter implementation authorization
  schema wiring authorization
  SharePoint write authorization
  project-wide Implementation Start
  Deploy authorization
  MAP-AS-009 / 010 / ENV adoption
```

## Options considered

| ID | unit | 結果 |
|---|---|---|
| **A** | AssessmentSnapshots Conversion Contract（MAP-AS-001〜008） | **SELECTED** |
| B | CV extension（MAP-AS-009 / 010 / ENV） | NOT SELECTED as current |
| HOLD | NO UNIQUE NEXT UNIT | NOT SELECTED |

```text
Reason（Option A）:
  MAP-AS-001〜008 conversion can be determined independently.
  MAP-AS-009 / 010 / ENV do not block this bounded unit.
```

## Explicit OUT

```text
MAP-AS-009 findingIds adoption
MAP-AS-010 supersedesSnapshotId adoption
MAP-AS-ENV-001/002/003
full mapping-complete PASS
DTO / adapter / schema wiring
SharePoint item write / column mutation
M365 mutation / real data / Deploy
Issue mutation
LOW-AUTO-PILOT additional batch
```

## Next

```text
Selection: SELECTED / OPEN
Decision-AS-CONVERSION-1: OPEN / NOT ACCEPTED
Next gate: HUMAN ACCEPTANCE OF Decision-AS-CONVERSION-1
Still HOLD / FORBIDDEN:
  Implementation Start
  adapter / schema mapping implementation
  SharePoint / M365 mutation by Agent
  Deploy / real data
  mapping-complete PASS
```
