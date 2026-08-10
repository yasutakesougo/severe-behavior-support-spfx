# Decision-ILB-1 — Thirtieth residual selection

この文書は、Decision-AS-SCHEMA-MAPPING-NEXT-1 Accepted（MT-1+IN-A+CP-1+XB-1）後の
次 substantive unit を固定する Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_THIRTIETH_RESIDUAL_SELECTION
Status: SELECTED / CONSUMED
Selected unit: MT-1 mapping-table docs update
Follow-up artifact:
  docs/architecture/assessment-snapshot-sharepoint-mapping.md
  Status: UPDATED under MT-1 / NOT mapping-complete

Locked basis（再 Decision しない）:
  Decision-AS-SCHEMA-MAPPING-NEXT-1 = Accepted / LOCKED / MT-1 + IN-A + CP-1 + XB-1
  Decision-AS-DEC6-MAPPING-1 = Accepted / LOCKED / LF-1 + RW-1 + MF-1 + VR-1
  Decision-AS-CN1-OBSERVATION-1 = CLOSED / CONSUMED / DEFAULT_COLUMNS_ONLY
  Decision-AS-SP-PLACEMENT-1 = Accepted / LOCKED / SV-1 + LV-1 + CN-1 + SC-1

Current state:
  Custom application columns = 0 / NOT PRESENT
  Intended Internal Names = NOT ADOPTED（IN-A）
  Implementation Start = HOLD（XB-1）
  adapter / schema mapping implementation = HOLD（XB-1）
  SharePoint column creation = FORBIDDEN（CP-1）
```

## Selection meaning

この Selection は、Accepted MT-1 に基づき
**logical mapping 表へ Status=`未確認` / `NOT PRESENT` を docs 反映する**
ことだけを次 unit として選ぶ。

```text
SELECTED / CONSUMED:
  MT-1 mapping-table docs update
  Delivered: assessment-snapshot-sharepoint-mapping.md
  Scope: AssessmentSnapshot logical field → persistence field slot
  Internal Name / Display Name / Column Type = 未確認 / NOT PRESENT
  Site / List identity = OBSERVED（再 Decision しない）
  ≠ CONFIRMED Internal Names
  ≠ mapping-complete
  ≠ Implementation Start
  ≠ column creation
  ≠ Internal Name invention

Still NOT authorized / FORBIDDEN:
  inventing Internal Names
  locking app Internal Names as CONFIRMED
  SharePoint column create / rename / delete
  adapter / schema mapping code start
  Implementation Start
  Deploy / real data
  GitHub Issue mutation
```

Selection CONSUMED（docs delivered）≠ Acceptance of Internal Names ≠ Implementation Start。

## Options considered（selection-time）

| ID | unit | 結果 |
|---|---|---|
| **A** | MT-1 mapping-table docs update | **SELECTED** |
| B | Column provisioning Decision / Execution GO | NOT SELECTED（CP-1 separate；later） |
| C | Issue Status Reconciliation（#6 / #8 / #22） | NOT SELECTED as current（independent） |
| D | Implementation Start / adapter code | NOT SELECTED（HOLD / XB-1） |
| E | HOLD / no selection | NOT SELECTED |

## Next

```text
Thirtieth residual: CONSUMED
Delivered:
  assessment-snapshot-sharepoint-mapping.md
  Status cells = 未確認 / NOT PRESENT for app Internal Names
Next residual: NOT SELECTED
Candidates:
  Column provisioning Decision / Execution GO（CP-1）
  Issue Status Reconciliation
Still HOLD / FORBIDDEN:
  Implementation Start / adapter impl / column creation / Deploy
  Internal Name invention
```
