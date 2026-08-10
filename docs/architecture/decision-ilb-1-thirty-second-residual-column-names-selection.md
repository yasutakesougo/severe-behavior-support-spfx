# Decision-ILB-1 — Thirty-second residual selection

この文書は、Decision-AS-COLUMN-PROVISION-1 Accepted（NM-HOLD…）後の
次 substantive unit を固定する Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_THIRTY_SECOND_RESIDUAL_SELECTION
Status: SELECTED / CONSUMED
Selected unit: NM-1 Human-provided intended names path
Follow-up Decision / Packet ID: Decision-AS-COLUMN-NAMES-1
  packet: decision-assessment-snapshot-column-names-packet.md
  acceptance: decision-assessment-snapshot-column-names-acceptance.md
  IR: decision-assessment-snapshot-column-names-independent-review.md
  Status: Accepted / LOCKED / NM-1 + CV-REQ + XB-1

Locked basis（再 Decision しない）:
  Decision-AS-COLUMN-PROVISION-1 = Accepted / LOCKED
    / SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + XB-1 + AP-1
    （naming 軸は COLUMN-NAMES-1 で NM-1 へ）
  Decision-AS-SCHEMA-MAPPING-NEXT-1 = Accepted / LOCKED / MT-1 + IN-A + CP-1 + XB-1
  Decision-AS-CN1-OBSERVATION-1 = CLOSED / CONSUMED / DEFAULT_COLUMNS_ONLY
  MT-1 table = assessment-snapshot-sharepoint-mapping.md（UPDATED / NOT mapping-complete）

Current state after CONSUMED:
  CV-REQ intended names = ADOPTED / INTENDED
  CONFIRMED Internal Names = NOT YET
  Column creation = FORBIDDEN（PX-HOLD + EG-HOLD）
  Execution GO = NOT GIVEN
  Implementation Start = HOLD（XB-1）
  Agent mutation = FORBIDDEN（AP-1）
```

## Selection meaning

この Selection は、COLUMN-PROVISION-1 の NM-HOLD を進めるための
**NM-1 Human-provided intended names path** だけを次 unit として選ぶ。

```text
SELECTED / CONSUMED:
  Decision-AS-COLUMN-NAMES-1
  acceptance: decision-assessment-snapshot-column-names-acceptance.md
  Status: Accepted / LOCKED
  Human Decision: NM-1 + CV-REQ + XB-1

Still NOT authorized / FORBIDDEN now:
  treating INTENDED as OBSERVED / CONFIRMED
  SharePoint column create / rename / delete
  Execution GO（EG-HOLD）
  Implementation Start
  adapter / schema mapping code start
  Agent tenant mutation
  Deploy / real data
  SupportPlans column naming（SC-BOTH NOT SELECTED）
```

Selection CONSUMED ≠ column creation GO ≠ Execution GO ≠ CONFIRMED。

## Options considered（selection-time）

| ID | unit | 結果 |
|---|---|---|
| **A** | NM-1 Human-provided intended names path | **SELECTED** |
| B | Issue Status Reconciliation only | NOT SELECTED as current（independent） |
| C | PX-1 / EG-1 without names | NOT SELECTED（was forbidden while NM-HOLD） |
| D | Agent-invented Internal Names | NOT SELECTED（FORBIDDEN） |
| E | HOLD / no selection | NOT SELECTED |

## Next

```text
Thirty-second residual: CONSUMED
Decision-AS-COLUMN-NAMES-1: Accepted / LOCKED / NM-1 + CV-REQ + XB-1
Next substantive residual: NOT SELECTED
Candidates（separate units）:
  PX-1 / EG-1
  Choice option values
  CV extension（optional / DTO）
  Issue Status Reconciliation（#6 / #8 / #22）
```
