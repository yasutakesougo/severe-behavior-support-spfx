# Decision-ILB-1 — Twenty-ninth residual selection

この文書は、CN-1 observation CLOSED（DEFAULT_COLUMNS_ONLY / custom=0）後の
次 substantive unit を固定する Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_TWENTY_NINTH_RESIDUAL_SELECTION
Status: SELECTED / CONSUMED
Selected unit: Post-CN-1 schema mapping / column path / Implementation Start gate
Follow-up Decision / Packet ID: Decision-AS-SCHEMA-MAPPING-NEXT-1
  packet: decision-assessment-snapshot-schema-mapping-next-packet.md
  acceptance: decision-assessment-snapshot-schema-mapping-next-acceptance.md
  Status: Accepted / LOCKED / MT-1 + IN-A + CP-1 + XB-1

Locked basis（再 Decision しない）:
  Decision-AS-SP-PLACEMENT-1 = Accepted / LOCKED / SV-1 + LV-1 + CN-1 + SC-1
  Decision-AS-DEC6-MAPPING-1 = Accepted / LOCKED / LF-1 + RW-1 + MF-1 + VR-1
  Decision-AS-SP-ADAPTER-1 = Accepted / LOCKED
  Decision-AS-CN1-OBSERVATION-1 = CLOSED / CONSUMED
    result = DEFAULT_COLUMNS_ONLY / custom application columns = 0
  HUMAN_CN1_INTERNAL_NAME_READ_ONLY_OBSERVATION = COMPLETE

Current state:
  Site / List creation = COMPLETED
  SV-1 / LV-1 = CONFIRMED
  VR-1 = PASS
  CN-1 observation = CLOSED / CONSUMED
  Custom application Internal Names = NOT PRESENT
  Match-existing-app-Internal-Names premise = NOT APPLICABLE / INVALIDATED
  Decision-AS-SCHEMA-MAPPING-NEXT-1 = Accepted / LOCKED / MT-1 + IN-A + CP-1 + XB-1
  SharePoint adapter / schema mapping impl = HOLD（XB-1）
  Implementation Start = HOLD（XB-1）
  SharePoint column creation = FORBIDDEN（CP-1）
```

## Selection meaning

この Selection は、CN-1 閉鎖後の次 substantive unit として
**schema mapping / column path / Implementation Start 境界**だけを選ぶ。

```text
SELECTED / CONSUMED:
  Decision-AS-SCHEMA-MAPPING-NEXT-1
  packet: decision-assessment-snapshot-schema-mapping-next-packet.md
  acceptance: decision-assessment-snapshot-schema-mapping-next-acceptance.md
  Status: Accepted / LOCKED / MT-1 + IN-A + CP-1 + XB-1
  Human Decision:
    MT-1 — mapping 表更新可；Internal Name = 未確認 / NOT PRESENT
    IN-A — intended Internal Names 不採択
    CP-1 — column provisioning GO は別 gate
    XB-1 — Implementation / adapter / Deploy 開始しない

Facts that MUST remain visible:
  custom application columns = 0
  no existing app Internal Names to match
  inventing Internal Names = FORBIDDEN under CN-1 / IN-A
  DEFAULT_COLUMNS_ONLY ≠ mapping-complete
  MF-1 fail-closed still applies if required columns missing

Still NOT authorized / FORBIDDEN now:
  Implementation Start（HOLD / XB-1）
  SharePoint adapter / schema mapping code start（XB-1）
  Internal Name invention（IN-A）
  SharePoint schema / list / column change（CP-1）
  Deploy / real data
  GitHub Issue mutation / 一括 Close / 一括本文更新
```

Selection CONSUMED ≠ Implementation Start ≠ column creation ≠ mapping-complete。

## Options considered（selection-time）

| ID | unit | 結果 |
|---|---|---|
| **A** | Post-CN-1 schema mapping / column path Decision packet | **SELECTED** |
| B | Immediate Implementation Start | NOT SELECTED（HOLD；columns NOT PRESENT） |
| C | Immediate adapter code start with invented Internal Names | NOT SELECTED（FORBIDDEN） |
| D | Issue Status Reconciliation only | NOT SELECTED as sole next（independent candidate） |
| E | HOLD / no selection | NOT SELECTED |

## Compare axes（Accepted）

正本 Acceptance:
[`decision-assessment-snapshot-schema-mapping-next-acceptance.md`](./decision-assessment-snapshot-schema-mapping-next-acceptance.md)

| Axis | Accepted | Note |
|---|---|---|
| MT | **MT-1** | mapping 表更新可；Internal Name = 未確認 / NOT PRESENT |
| IN | **IN-A** | intended Internal Names 不採択 |
| CP | **CP-1** | column provisioning GO は別 Human gate |
| XB | **XB-1** | Implementation / adapter / Deploy 開始しない |

```text
Packet MUST keep（and now LOCKED）:
  XB — Implementation Start / adapter code / Deploy = separate
  CN-1 — created columns は再観測で確定；推論禁止
  SC-1 — logical mapping vs deployment config 分離
```

## Process debt（explicitly deferred）

```text
Issue Status Reconciliation:
  Status: ASSESSED / independent next-unit candidate
  Assessment: issue-status-reconciliation-assessment.md
  Target Issues: #6 / #8 / #22（and other OPEN STALE bodies）
  Rule: Issue close ≠ body Current/Gate/Dependency resync
  Timing: may run after / beside schema-mapping packet；not a substitute for SM path
  GitHub Issue mutation in this Selection: NONE
```

## Next

```text
Twenty-eighth residual: CONSUMED（CN-1 observation CLOSED）
Twenty-ninth residual: CONSUMED
  Decision-AS-SCHEMA-MAPPING-NEXT-1: Accepted / LOCKED / MT-1 + IN-A + CP-1 + XB-1
  acceptance: decision-assessment-snapshot-schema-mapping-next-acceptance.md
  next-gate: decision-assessment-snapshot-schema-mapping-next-next-gate.md

Still HOLD:
  SharePoint adapter / schema mapping impl = HOLD
  Implementation Start = HOLD
  Deploy / real data = NO-GO
  SharePoint schema/list/column change = FORBIDDEN（CP-1）
  Internal Name invention = FORBIDDEN（IN-A）

Next substantive residual: NOT SELECTED by this Acceptance
Candidates（separate units）:
  MT-1 mapping-table docs update
  Column provisioning Decision / Execution GO
  Issue Status Reconciliation
```
