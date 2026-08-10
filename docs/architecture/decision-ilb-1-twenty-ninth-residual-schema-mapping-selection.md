# Decision-ILB-1 — Twenty-ninth residual selection

この文書は、CN-1 observation CLOSED（DEFAULT_COLUMNS_ONLY / custom=0）後の
次 substantive unit を固定する Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_TWENTY_NINTH_RESIDUAL_SELECTION
Status: SELECTED / OPEN
Selected unit: Post-CN-1 schema mapping / column path / Implementation Start gate
Follow-up Decision / Packet ID: Decision-AS-SCHEMA-MAPPING-NEXT-1
  packet: decision-assessment-snapshot-schema-mapping-next-packet.md
  Status: OPEN / NOT ACCEPTED

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
  SharePoint adapter / schema mapping impl = HOLD
  Implementation Start = HOLD
```

## Selection meaning

この Selection は、CN-1 閉鎖後の次 substantive unit として
**schema mapping / column path / Implementation Start 境界**だけを選ぶ。

```text
SELECTED / OPEN:
  Decision-AS-SCHEMA-MAPPING-NEXT-1
  packet: decision-assessment-snapshot-schema-mapping-next-packet.md
  Status: OPEN / NOT ACCEPTED
  Question:
    カスタム列 0 の実テナントに対し、
    schema mapping / column provisioning / Implementation Start を
    どの順序・境界で進めるか。
  Compare axes:
    MT — mapping table now
    IN — intended Internal Names
    CP — column provisioning path
    XB — Implementation / adapter / Deploy boundary

Facts that MUST remain visible:
  custom application columns = 0
  no existing app Internal Names to match
  inventing Internal Names = FORBIDDEN under CN-1
  DEFAULT_COLUMNS_ONLY ≠ mapping-complete
  MF-1 fail-closed still applies if required columns missing

Still NOT authorized / FORBIDDEN now:
  Implementation Start（HOLD）
  SharePoint adapter / schema mapping code start
  Internal Name invention
  SharePoint schema / list / column change without separate Human GO
  Deploy / real data
  GitHub Issue mutation / 一括 Close / 一括本文更新
```

Selection ≠ Acceptance ≠ Implementation Start。

## Options considered（selection-time）

| ID | unit | 結果 |
|---|---|---|
| **A** | Post-CN-1 schema mapping / column path Decision packet | **SELECTED** |
| B | Immediate Implementation Start | NOT SELECTED（HOLD；columns NOT PRESENT） |
| C | Immediate adapter code start with invented Internal Names | NOT SELECTED（FORBIDDEN） |
| D | Issue Status Reconciliation only | NOT SELECTED as sole next（independent candidate） |
| E | HOLD / no selection | NOT SELECTED |

## Compare axes for the OPEN packet（not Accepted here）

正本 packet:
[`decision-assessment-snapshot-schema-mapping-next-packet.md`](./decision-assessment-snapshot-schema-mapping-next-packet.md)

| Axis | Candidate IDs | Note |
|---|---|---|
| MT | MT-1 / MT-2 / MT-HOLD / MT-X | mapping 表を今どう扱うか |
| IN | IN-A / IN-B / IN-HOLD / IN-X | intended Internal Names を採択するか |
| CP | CP-1 / CP-2 / CP-HOLD / CP-X | column provisioning GO を含めるか |
| XB | XB-1（必須候補）/ XB-2 / XB-3 NOT selectable now | Implementation / adapter / Deploy 境界 |

```text
Agent recommendation（比較用）:
  MT-1 + IN-A + CP-1 + XB-1
Packet MUST keep:
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
Twenty-ninth residual: SELECTED / OPEN
  Decision-AS-SCHEMA-MAPPING-NEXT-1: OPEN / NOT ACCEPTED
  packet: decision-assessment-snapshot-schema-mapping-next-packet.md
  theme: schema mapping / column path / Implementation Start boundary
  fact: custom columns = 0；match-existing premise INVALIDATED
  Agent recommendation（比較用）: MT-1 + IN-A + CP-1 + XB-1

Until packet Accepted + prerequisites met:
  SharePoint adapter / schema mapping impl = HOLD
  Implementation Start = HOLD
  Deploy / real data = NO-GO
  SharePoint schema/list/column change = FORBIDDEN without separate GO
  Internal Name invention = FORBIDDEN
```
