# Decision-ILB-1 — Thirty-second residual selection

この文書は、Decision-AS-COLUMN-PROVISION-1 Accepted（NM-HOLD…）後の
次 substantive unit を固定する Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_THIRTY_SECOND_RESIDUAL_SELECTION
Status: SELECTED / OPEN
Selected unit: NM-1 Human-provided intended names path
Follow-up Decision / Packet ID: Decision-AS-COLUMN-NAMES-1
  packet: decision-assessment-snapshot-column-names-packet.md
  Status: OPEN / NOT ACCEPTED

Locked basis（再 Decision しない）:
  Decision-AS-COLUMN-PROVISION-1 = Accepted / LOCKED
    / NM-HOLD + SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + XB-1 + AP-1
  Decision-AS-SCHEMA-MAPPING-NEXT-1 = Accepted / LOCKED / MT-1 + IN-A + CP-1 + XB-1
  Decision-AS-CN1-OBSERVATION-1 = CLOSED / CONSUMED / DEFAULT_COLUMNS_ONLY
  MT-1 table = assessment-snapshot-sharepoint-mapping.md（UPDATED / NOT mapping-complete）

Current state:
  Scope locked for this path = AssessmentSnapshots（isogo + honmoku）（SC-AS）
  Intended Internal Names = NOT ADOPTED / HOLD（NM-HOLD）
  Column creation = FORBIDDEN（PX-HOLD + EG-HOLD）
  Implementation Start = HOLD（XB-1）
  Agent mutation = FORBIDDEN（AP-1）
```

## Selection meaning

この Selection は、COLUMN-PROVISION-1 の NM-HOLD を進めるための
**NM-1 Human-provided intended names path** だけを次 unit として選ぶ。

```text
SELECTED / OPEN:
  Decision-AS-COLUMN-NAMES-1
  Question:
    AssessmentSnapshots 向け custom columns の
    intended Display Name / Internal Name / Column Type を
    Human が明示採択するか（NM-1）。

Facts that MUST remain visible:
  Agent invents no Internal Names
  INTENDED ≠ OBSERVED / CONFIRMED
  PX-HOLD + EG-HOLD remain until separate later Decision / GO
  VR-1 still requires post-create CN-1 re-observation
  SC-AS = AssessmentSnapshots only

Still NOT authorized / FORBIDDEN now:
  inventing / auto-adopting Internal Names
  SharePoint column create / rename / delete
  treating INTENDED as OBSERVED / CONFIRMED
  Execution GO（EG-HOLD）
  Implementation Start
  adapter / schema mapping code start
  Agent tenant mutation
  Deploy / real data
  SupportPlans column naming（SC-BOTH NOT SELECTED）
```

```text
Packet purpose when OPEN:
  Human が Display Name / intended Internal Name / Column Type を
  明示採択するための比較材料
Agent: 候補整理のみ（発明・自動採択禁止）
NM-1 closes only after Human adopts concrete names
```

Selection ≠ Acceptance of concrete names ≠ column creation GO ≠ Execution GO。

## Options considered（selection-time）

| ID | unit | 結果 |
|---|---|---|
| **A** | NM-1 Human-provided intended names path | **SELECTED** |
| B | Issue Status Reconciliation only | NOT SELECTED as current（independent） |
| C | PX-1 / EG-1 without names | NOT SELECTED（forbidden while NM-HOLD） |
| D | Agent-invented Internal Names | NOT SELECTED（FORBIDDEN） |
| E | HOLD / no selection | NOT SELECTED |

## Next

```text
Thirty-second residual: SELECTED / OPEN
  → Decision-AS-COLUMN-NAMES-1 packet OPEN
  decision-assessment-snapshot-column-names-packet.md
Awaiting: Human-provided intended names table（or NM-HOLD continue / decline）
Until Accepted with Human values:
  SharePoint column creation = FORBIDDEN
  Internal Name invention = FORBIDDEN
  Implementation Start = HOLD
```
