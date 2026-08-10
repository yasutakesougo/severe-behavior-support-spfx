# Decision-ILB-1 — Thirty-first residual selection

この文書は、MT-1 mapping-table docs update CONSUMED 後の
次 substantive unit を固定する Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_THIRTY_FIRST_RESIDUAL_SELECTION
Status: SELECTED / CONSUMED
Selected unit: Column provisioning Decision / Execution GO boundary
Follow-up Decision / Packet ID: Decision-AS-COLUMN-PROVISION-1
  packet: decision-assessment-snapshot-column-provision-packet.md
  acceptance: decision-assessment-snapshot-column-provision-acceptance.md
  Status: Accepted / LOCKED / NM-HOLD+SC-AS+PX-HOLD+EG-HOLD+VR-1+FG-1+XB-1+AP-1

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
SELECTED / CONSUMED:
  Decision-AS-COLUMN-PROVISION-1
  acceptance: decision-assessment-snapshot-column-provision-acceptance.md
  Status: Accepted / LOCKED
  Human Decision:
    NM-HOLD — intended names 未定
    SC-AS — AssessmentSnapshots only
    PX-HOLD — 作成未許可
    EG-HOLD — Execution GO なし
    VR-1 — 将来作成後 CN-1 再観測
    FG-1 — fail-closed
    XB-1 — Implementation / adapter / Deploy 別
    AP-1 — Agent mutation FORBIDDEN

Still NOT authorized / FORBIDDEN now:
  inventing Internal Names
  SharePoint column create / rename / delete
  Agent tenant mutation
  Implementation Start
  adapter / schema mapping code start
  Deploy / real data
  GitHub Issue mutation
```

Selection CONSUMED ≠ Execution GO ≠ column creation。

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
Thirty-first residual: CONSUMED
Decision-AS-COLUMN-PROVISION-1: Accepted / LOCKED
  / NM-HOLD + SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + XB-1 + AP-1
next-gate: decision-assessment-snapshot-column-provision-next-gate.md
SharePoint column creation = FORBIDDEN
Agent mutation = FORBIDDEN
Implementation Start = HOLD
adapter impl = HOLD
Next residual: NOT SELECTED
```
