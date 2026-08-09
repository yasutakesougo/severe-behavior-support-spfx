# Decision-ILB-1 — Fifteenth residual Decision selection: DEC-6 concrete mapping

```text
repository: yasutakesougo/severe-behavior-support-spfx
baseline main: c668d820708010fd1c3e6223b1e46bd69c486ed7
Decision kind: residual substantive-unit selection only
Selected: A — DEC-6 concrete mapping
Status: SELECTED / NOT IMPLEMENTATION START
Human Selection: Explicit A on 2026-08-09
```

## Selected scope

```text
Fifteenth residual Decision:
  SELECTED — A / DEC-6 concrete mapping

Meaning:
  次に扱う substantive unit を AssessmentSnapshot 向け
  DEC-6 concrete mapping（Decision-AS-DEC6-MAPPING-1）とする。
  本記録は選定のみであり、具体列値・Site/List・実装を決めない。
```

## Explicit non-authorization

```text
Decision-AS-DEC6-MAPPING-1: OPEN via compare packet / NOT ACCEPTED
DEC-6 concrete mapping values: HOLD / NOT DECIDED
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Site URL / List name / Internal Column Name: NOT DECIDED
Schema / DTO code assignment: HOLD / NOT STARTED
Schema / DTO code: HOLD
FindingCode: HOLD
A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
Deploy / real data / real tenant: NO-GO
```

本 Selection から Implementation Start を導出しない。
本 Selection から SharePoint 実装を導出しない。
本 Selection から Site URL / List name / Internal Column Name を発明・確定しない。
DEC-009 / Decision-AS-APP-SAVE-1 / Decision-AS-SP-ADAPTER-1 は再 Decision しない。

## Prior state preserved

- AssessmentSnapshot domain contract CLOSED（PR-J）
- Schema ID LOCKED（Decision-AS-SCHEMA-ID-1）
- schemaVersion / dtoVersion LOCKED = 1.0.0 / 1.0.0
- application save boundary CLOSED（Decision-AS-APP-SAVE-1 = SC-1 + FR-1）
- SharePoint / adapter boundary CLOSED（Decision-AS-SP-ADAPTER-1 = PB-1+EM-1+CV-1+D6-1+UP-1）
- DEC-009 save semantics LOCKED
- Schema / DTO / SharePoint code assignment remains NOT STARTED
- FindingCode / A-5 remain HOLD
- Post-retention deletion remains OPEN / AUTO-START FORBIDDEN

## Options considered（selection-time）

| ID | unit | 結果 |
|---|---|---|
| **A** | DEC-6 concrete mapping（Decision-AS-DEC6-MAPPING-1） | **SELECTED** |
| **B** | post-retention deletion | NOT SELECTED（OPEN / AUTO-START FORBIDDEN 維持） |
| **C** | HOLD（まだ決めない） | NOT SELECTED |

## Next gate

```text
Next action:
  DEC-6 concrete mapping read-only Decision packet / compare
  → decision-assessment-snapshot-dec6-mapping-packet.md
  Focus（Decision-AS-DEC6-MAPPING-1）:
    logical field ↔ persistence field
    read / write conversion
    missing / malformed column の fail-closed
    version（schemaVersion / dtoVersion）の扱い

Not allowed from this document alone:
  accepting mapping options as LOCKED
  inventing Site URL / List name / Internal Column Name
  modifying TypeScript / application / adapter / SharePoint code
  Schema / DTO code assignment
  FindingCode / A-5
  post-retention deletion
  Implementation Start
  Deploy / real data
```
