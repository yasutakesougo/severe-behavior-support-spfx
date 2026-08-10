# Decision-ILB-1 — Twenty-ninth residual selection

この文書は、CN-1 observation CLOSED（DEFAULT_COLUMNS_ONLY / custom=0）後の
次 substantive unit を固定する Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_TWENTY_NINTH_RESIDUAL_SELECTION
Status: SELECTED / OPEN
Selected unit: Post-CN-1 schema mapping / column path / Implementation Start gate
Follow-up Decision / Packet ID: Decision-AS-SCHEMA-MAPPING-NEXT-1（OPEN packet pending）

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
  Decision-AS-SCHEMA-MAPPING-NEXT-1（packet to open）
  Question:
    カスタム列 0 の実テナントに対し、
    schema mapping / column provisioning / Implementation Start を
    どの順序・境界で進めるか。

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

次 packet で Human が選ぶ候補（本 Selection では Accepted にしない）:

| Axis | Candidate meaning | Note |
|---|---|---|
| SM-1 | Logical mapping 表のみ更新（Internal Name = 未確認 / NOT PRESENT のまま） | LF-1 許容；Implementation は依然 HOLD |
| SM-2 | Human-provided intended Internal Names を採択（作成前 INTENDED） | CN-1 再観測が後続必須；CONFIRMED 扱い禁止 |
| SM-3 | Column provisioning Execution GO を先に置く | mutation は別 Human gate；Agent mutation FORBIDDEN |
| SM-X | Implementation Start を本 unit で GO | NOT selectable while required columns NOT PRESENT |

```text
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
  → open Decision-AS-SCHEMA-MAPPING-NEXT-1 packet
  theme: schema mapping / column path / Implementation Start boundary
  fact: custom columns = 0；match-existing premise INVALIDATED

Until packet Accepted + prerequisites met:
  SharePoint adapter / schema mapping impl = HOLD
  Implementation Start = HOLD
  Deploy / real data = NO-GO
  SharePoint schema/list/column change = FORBIDDEN without separate GO
  Internal Name invention = FORBIDDEN
```
