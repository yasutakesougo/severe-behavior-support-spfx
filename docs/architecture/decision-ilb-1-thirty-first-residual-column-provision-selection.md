# Decision-ILB-1 — Thirty-first residual selection

この文書は、MT-1 mapping-table docs update CONSUMED 後の
次 substantive unit を固定する Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_THIRTY_FIRST_RESIDUAL_SELECTION
Status: SELECTED / OPEN
Selected unit: Column provisioning Decision / Execution GO boundary
Follow-up Decision / Packet ID: Decision-AS-COLUMN-PROVISION-1
  packet: decision-assessment-snapshot-column-provision-packet.md
  Status: OPEN / NOT ACCEPTED

Locked basis（再 Decision しない）:
  Decision-AS-SCHEMA-MAPPING-NEXT-1 = Accepted / LOCKED / MT-1 + IN-A + CP-1 + XB-1
  Decision-AS-DEC6-MAPPING-1 = Accepted / LOCKED / LF-1 + RW-1 + MF-1 + VR-1
  Decision-AS-CN1-OBSERVATION-1 = CLOSED / CONSUMED / DEFAULT_COLUMNS_ONLY
  Decision-AS-PILOT-PROVISION-EXEC-1 = Accepted / LOCKED（Site/List only；columns were OUT）
  Thirtieth residual = CONSUMED（MT-1 mapping table delivered）

Current state:
  Custom application columns = 0 / NOT PRESENT
  Intended Internal Names = NOT ADOPTED（IN-A）
  AssessmentSnapshot mapping table = UPDATED / NOT mapping-complete
  Implementation Start = HOLD
  adapter / schema mapping implementation = HOLD
  SharePoint column creation = FORBIDDEN until this Decision + Execution GO
  Agent SharePoint mutation = FORBIDDEN
```

## Selection meaning

この Selection は、CP-1 で分離された
**column provisioning の Decision / Execution GO 境界**だけを次 unit として選ぶ。

```text
SELECTED / OPEN:
  Decision-AS-COLUMN-PROVISION-1
  Question:
    AssessmentSnapshot（必要なら SupportPlan）向け custom columns について、
    intended naming / 作成許可 / Execution GO / 作成後 CN-1 再観測 /
    Implementation 境界をどう固定するか。

Facts that MUST remain visible:
  custom application columns = 0
  IN-A = intended names were NOT adopted in SCHEMA-MAPPING-NEXT-1
  Agent must NOT invent Internal Names
  CN-1 re-observation required after any creation
  Site/List creation Authorization ≠ column creation Authorization

Still NOT authorized / FORBIDDEN now:
  inventing Internal Names
  SharePoint column create / rename / delete（packet OPEN ≠ GO）
  Agent tenant mutation
  Implementation Start
  adapter / schema mapping code start
  Deploy / real data
  GitHub Issue mutation
```

Selection ≠ Acceptance ≠ Execution GO ≠ column creation。

## Options considered（selection-time）

| ID | unit | 結果 |
|---|---|---|
| **A** | Column provisioning Decision / Execution GO packet | **SELECTED** |
| B | Issue Status Reconciliation only | NOT SELECTED as current（independent） |
| C | Implementation Start / adapter code | NOT SELECTED（HOLD） |
| D | Invent Internal Names and create columns immediately | NOT SELECTED（FORBIDDEN） |
| E | HOLD / no selection | NOT SELECTED |

## Next

```text
Thirty-first residual: SELECTED / OPEN
  → Decision-AS-COLUMN-PROVISION-1 packet OPEN
  decision-assessment-snapshot-column-provision-packet.md

Until Accepted + Explicit Execution GO + Human-provided intended names:
  SharePoint column creation = FORBIDDEN
  Agent mutation = FORBIDDEN
  Implementation Start = HOLD
  adapter impl = HOLD
```
