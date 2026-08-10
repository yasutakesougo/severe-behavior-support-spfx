# Decision-AS-SCHEMA-MAPPING-NEXT-1 — Human Acceptance

この文書は、**Decision-AS-SCHEMA-MAPPING-NEXT-1**（post-CN-1 schema mapping /
column path / Implementation Start 境界）についての
**Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-schema-mapping-next-packet.md`](./decision-assessment-snapshot-schema-mapping-next-packet.md)

Selected via:
[`decision-ilb-1-twenty-ninth-residual-schema-mapping-selection.md`](./decision-ilb-1-twenty-ninth-residual-schema-mapping-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-cn1-closure-determination.md`](./decision-assessment-snapshot-cn1-closure-determination.md)
（Decision-AS-CN1-OBSERVATION-1 = CLOSED / CONSUMED / DEFAULT_COLUMNS_ONLY）
[`decision-assessment-snapshot-dec6-mapping-acceptance.md`](./decision-assessment-snapshot-dec6-mapping-acceptance.md)
（Decision-AS-DEC6-MAPPING-1 = LF-1+RW-1+MF-1+VR-1）
[`decision-assessment-snapshot-sp-adapter-acceptance.md`](./decision-assessment-snapshot-sp-adapter-acceptance.md)
[`decision-assessment-snapshot-sp-placement-acceptance.md`](./decision-assessment-snapshot-sp-placement-acceptance.md)
（Decision-AS-SP-PLACEMENT-1 = SV-1+LV-1+CN-1+SC-1）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-SCHEMA-MAPPING-NEXT-1
Status: Accepted / LOCKED
Human Decision: MT-1 + IN-A + CP-1 + XB-1
Human Acceptance: Explicit Human Decision on 2026-08-10

Baseline:
  PR #191 MERGED（CN-1 observation CLOSED on main）
  merge commit: 0738ea79e159e0bc9a60dc6c1bdccfd9784681ad
  custom application columns = 0 / NOT PRESENT
  Result class = DEFAULT_COLUMNS_ONLY
  Match-existing-app-Internal-Names premise = NOT APPLICABLE / INVALIDATED

LOCKED:

Mapping table now:
  MT-1 — logical mapping 表を更新してよい
         ただし app Internal Name は `未確認` / `NOT PRESENT` のまま
         CONFIRMED 値を書かない
         DEFAULT_COLUMNS_ONLY を mapping-complete と書かない

Intended Internal Names:
  IN-A — 本 Decision では intended Internal Names を採択しない
         NOT PRESENT のまま残す
         Agent による concrete Internal Name 発明禁止

Column provisioning path:
  CP-1 — column provisioning Execution GO は本 Acceptance に含めない
         別 Human gate
         Agent SharePoint mutation FORBIDDEN 維持

Implementation / adapter / Deploy boundary:
  XB-1 — 本 Decision ≠ Implementation Start
         ≠ adapter / schema mapping code start
         ≠ Deploy / real data

DEC-6 / SP-ADAPTER / SP-PLACEMENT / CN-1 closure:
  UNCHANGED / LOCKED（再 Decision しない）

Implementation Start:
  HOLD
SharePoint adapter / schema mapping implementation:
  HOLD
SharePoint column creation:
  FORBIDDEN（別 Human GO まで）
Deploy / real data:
  NO-GO
FindingCode / A-5:
  HOLD
Post-retention deletion:
  OPEN / AUTO-START FORBIDDEN

Closes only:
  Decision-AS-SCHEMA-MAPPING-NEXT-1 境界（MT/IN/CP/XB）
Does NOT close:
  concrete Internal Names（INTENDED or CONFIRMED）
  column provisioning Execution
  SharePoint / adapter / application 実装
  Schema / DTO コード割当
  FindingCode / A-5
  Implementation Start
  post-retention deletion
Implementation auto-start: FORBIDDEN
Column creation auto-start: FORBIDDEN
Internal Name invention: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: MT-1 + IN-A + CP-1 + XB-1
Decision-AS-SCHEMA-MAPPING-NEXT-1: Accepted / LOCKED

Mapping table now:           MT-1
Intended Internal Names:     IN-A
Column provisioning path:    CP-1
Implementation boundary:     XB-1
```

日本語正本:

```text
MT-1:
  logical mapping 表は更新してよい。
  app Internal Name は未確認 / NOT PRESENT のまま残す。
  CONFIRMED 値や mapping-complete を偽らない。
IN-A:
  本 Decision では intended Internal Names を採択しない。
  Agent は concrete Internal Name を発明しない。
CP-1:
  column provisioning Execution GO は本 Acceptance に含めない。
  列作成は別 Human gate。Agent mutation は禁止のまま。
XB-1:
  本 Decision だけでは Implementation Start /
  adapter・schema mapping 実装 / Deploy を開始しない。
```

```text
Agent recommendation（MT-1 + IN-A + CP-1 + XB-1）:
  NOT Human Acceptance evidence by itself
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-AS-SCHEMA-MAPPING-NEXT-1: Accepted / LOCKED

Mapping table now:           MT-1
Intended Internal Names:     IN-A
Column provisioning path:    CP-1
Implementation boundary:     XB-1

NOT SELECTED:
  MT-2 / MT-HOLD / MT-X
  IN-B / IN-HOLD / IN-X
  CP-2 / CP-HOLD / CP-X
  XB-2 / XB-3 / XB-X
```

失敗時 MUST NOT（LOCKED）:

```text
未確認 / NOT PRESENT の Internal Name を CONFIRMED として書く
Display Name / TypeScript / Domain 名から Internal Name を推論して埋める
INTENDED を採択したかのように扱う（IN-A）
本 Acceptance を column creation GO と同一視する
本 Acceptance を Implementation Start / adapter 実装開始と同一視する
DEFAULT_COLUMNS_ONLY を mapping-complete と書く
Agent による SharePoint column mutation を許可する
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-SCHEMA-MAPPING-NEXT-1 Accepted = Implementation Start
  Decision-AS-SCHEMA-MAPPING-NEXT-1 Accepted = adapter / schema mapping code start
  Decision-AS-SCHEMA-MAPPING-NEXT-1 Accepted = column provisioning Execution GO
  Decision-AS-SCHEMA-MAPPING-NEXT-1 Accepted = Internal Names CONFIRMED
  Decision-AS-SCHEMA-MAPPING-NEXT-1 Accepted = intended Internal Names Accepted
  Decision-AS-SCHEMA-MAPPING-NEXT-1 Accepted = mapping-complete
  Decision-AS-SCHEMA-MAPPING-NEXT-1 Accepted = Deploy / real data GO
  Decision-AS-SCHEMA-MAPPING-NEXT-1 Accepted = FindingCode / A-5 再開
  Decision-AS-SCHEMA-MAPPING-NEXT-1 Accepted = DEC-6 / CN-1 rule 再定義
```

## Acceptance boundary

```text
This Acceptance locks MT/IN/CP/XB boundary only.

MUST NOT start from this Acceptance alone:
  inventing Internal Column Names
  SharePoint column create / rename / delete
  TypeScript / application / persistence port / adapter code
  Schema / DTO implementation
  Implementation Start
  Deploy / real data
  GitHub Issue mutation
```

## Next

```text
Decision-AS-SCHEMA-MAPPING-NEXT-1: Accepted / LOCKED / MT-1 + IN-A + CP-1 + XB-1
Twenty-ninth residual: CONSUMED
Implementation Start: HOLD
SharePoint adapter / schema mapping implementation: HOLD
SharePoint column creation: FORBIDDEN（CP-1 → separate Human gate）
Internal Name invention: FORBIDDEN（IN-A）
Deploy / real data: NO-GO

Authorized later（separate units; not auto-started）:
  MT-1 docs update: logical mapping 表へ Status=未確認 / NOT PRESENT を反映
    → CONSUMED via assessment-snapshot-sharepoint-mapping.md
  Column provisioning Decision / Execution GO（CP-1 separate）
  Issue Status Reconciliation（independent process debt）

Next substantive residual: NOT SELECTED by this Acceptance
Ready: NOT RUN
Merge: NOT RUN
```
