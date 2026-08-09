# Decision-ILB-1 — Fourteenth residual Decision selection: SharePoint / adapter

```text
repository: yasutakesougo/severe-behavior-support-spfx
baseline main: bb3f65dc9a2d87052cbdbaccd0bedfa618106f57
Decision kind: residual substantive-unit selection only
Selected: A — SharePoint / adapter
Status: SELECTED / CONSUMED（Decision-AS-SP-ADAPTER-1 Accepted / LOCKED）
Human Selection: Explicit A on 2026-08-09
```

## Selected scope

```text
Fourteenth residual Decision:
  SELECTED — A / SharePoint / adapter

Meaning:
  次に扱う substantive unit を AssessmentSnapshot の
  application save contract と SharePoint persistence adapter
  の責務境界（Decision-AS-SP-ADAPTER-1）とする。
  本記録は選定のみであり、具体設計・実装・列写像を決めない。
  （境界は後続 Decision-AS-SP-ADAPTER-1 で Accepted）
```

## Explicit non-authorization（selection 時点 / 実装は継続 HOLD）

```text
Implementation Start: HOLD
SharePoint implementation: DO NOT START
DEC-6 concrete mapping: NOT DECIDED
Schema ID / schemaVersion / dtoVersion code assignment: HOLD / NOT STARTED
Schema / DTO code: HOLD
FindingCode: HOLD
A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
Site URL / List name / Internal Column Name: NOT DECIDED
Deploy / real data / real tenant: NO-GO
```

本 Selection から Implementation Start を導出しない。
本 Selection から SharePoint 実装を導出しない。
本 Selection から DEC-6 具体列写像を導出しない。
DEC-009 / Decision-AS-APP-SAVE-1（SC-1 + FR-1）は再 Decision しない。

## Prior state preserved

- AssessmentSnapshot domain contract CLOSED（PR-J）
- Schema ID LOCKED（Decision-AS-SCHEMA-ID-1）
- schemaVersion / dtoVersion LOCKED = 1.0.0 / 1.0.0
- application save boundary CLOSED（Decision-AS-APP-SAVE-1 = SC-1 + FR-1）
- DEC-009 save semantics LOCKED
- Schema / DTO / SharePoint code assignment remains NOT STARTED
- FindingCode / A-5 remain HOLD
- Post-retention deletion remains OPEN / AUTO-START FORBIDDEN

## Options considered（selection-time）

| ID | unit | 結果 |
|---|---|---|
| **A** | SharePoint / adapter boundary（Decision-AS-SP-ADAPTER-1） | **SELECTED** |
| **B** | post-retention deletion | NOT SELECTED（OPEN / AUTO-START FORBIDDEN 維持） |
| **C** | HOLD（まだ決めない） | NOT SELECTED |

## Next gate

```text
Selection CONSUMED → Decision-AS-SP-ADAPTER-1 Accepted / LOCKED
  decision-assessment-snapshot-sp-adapter-acceptance.md
  Port I/O                 = PB-1
  Error mapping            = EM-1
  Conversion location      = CV-1
  DEC-6 relation           = D6-1
  Persistence unavailable  = UP-1

Still HOLD:
  Implementation Start
  SharePoint / adapter / application code
  DEC-6 concrete mapping
  Schema ID / schemaVersion / dtoVersion code assignment
  FindingCode / A-5
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```
