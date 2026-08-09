# Decision-ILB-1 — Sixteenth residual Decision selection: Site / List / Internal Column Name

```text
repository: yasutakesougo/severe-behavior-support-spfx
baseline main: 52474cb5993b0d4b24fbdaeccf934a5e96d3d1b1
Decision kind: residual substantive-unit selection only
Selected: A — Site / List / Internal Column Name
Status: SELECTED / NOT IMPLEMENTATION START
Human Selection: Explicit A on 2026-08-09
```

## Selected scope

```text
Sixteenth residual Decision:
  SELECTED — A / Site / List / Internal Column Name

Meaning:
  次に扱う substantive unit を AssessmentSnapshot 向け
  Site / List / Internal Column Name の確定根拠
  （Decision-AS-SP-PLACEMENT-1）とする。
  本記録は選定のみであり、具体 Site/List/Internal Name 値・実装を決めない。
```

## Explicit non-authorization

```text
Decision-AS-SP-PLACEMENT-1: OPEN via compare packet / NOT ACCEPTED
Site value: NOT CONFIRMED / HOLD
List value: NOT CONFIRMED / HOLD
Internal Column Name: NOT CONFIRMED / HOLD
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Schema / DTO code assignment: HOLD / NOT STARTED
Schema / DTO code: HOLD
tenant changes: NO-GO
Deploy / real data / real tenant: NO-GO
FindingCode: HOLD
A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```

本 Selection から Implementation Start を導出しない。
本 Selection から SharePoint 実装を導出しない。
本 Selection から Site / List / Internal Column Name 具体値を発明・確定しない。
DEC-009 / Decision-AS-APP-SAVE-1 / Decision-AS-SP-ADAPTER-1 / Decision-AS-DEC6-MAPPING-1 は再 Decision しない。

## Prior state preserved

- AssessmentSnapshot domain contract CLOSED（PR-J）
- Schema ID LOCKED；schemaVersion / dtoVersion LOCKED = 1.0.0 / 1.0.0
- application save boundary CLOSED（SC-1 + FR-1）
- SharePoint / adapter boundary CLOSED（PB-1+EM-1+CV-1+D6-1+UP-1）
- DEC-6 mapping rules CLOSED（LF-1+RW-1+MF-1+VR-1）
- Site / List / Internal Column Name remain NOT DECIDED / NOT CONFIRMED
- Schema / DTO / SharePoint code assignment remains NOT STARTED
- FindingCode / A-5 remain HOLD
- Post-retention deletion remains OPEN / AUTO-START FORBIDDEN

## Options considered（selection-time）

| ID | unit | 結果 |
|---|---|---|
| **A** | Site / List / Internal Column Name（Decision-AS-SP-PLACEMENT-1） | **SELECTED** |
| **B** | post-retention deletion | NOT SELECTED（OPEN / AUTO-START FORBIDDEN 維持） |
| **C** | HOLD（まだ決めない） | NOT SELECTED |

## Next gate

```text
Next action:
  Site / List / Internal Column Name read-only Decision packet / compare
  → decision-assessment-snapshot-sp-placement-packet.md
  Focus（Decision-AS-SP-PLACEMENT-1）:
    SV — Site value confirmation
    LV — List value confirmation
    CN — Internal Column Name confirmation
    SC — source-of-truth / configuration boundary

Not allowed from this document alone:
  accepting placement options as LOCKED
  inventing Site URL / List name / Internal Column Name
  tenant confirmation / SharePoint changes
  modifying TypeScript / application / adapter / SharePoint code
  Schema / DTO code assignment
  FindingCode / A-5
  post-retention deletion
  Implementation Start
  Deploy / real data
```
