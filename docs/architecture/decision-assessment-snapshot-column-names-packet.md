# Decision-AS-COLUMN-NAMES-1 — intended column names packet（NM-1 path）

この文書は、Thirty-second residual（SELECTED / A — NM-1 path）後の
**AssessmentSnapshots 向け intended Display Name / Internal Name / Column Type**
についての比較用 Human Decision Packet である。

Selected via:
[`decision-ilb-1-thirty-second-residual-column-names-selection.md`](./decision-ilb-1-thirty-second-residual-column-names-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-column-provision-acceptance.md`](./decision-assessment-snapshot-column-provision-acceptance.md)
（NM-HOLD + SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + XB-1 + AP-1）
[`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)
[`decision-assessment-snapshot-cn1-closure-determination.md`](./decision-assessment-snapshot-cn1-closure-determination.md)
[`decision-assessment-snapshot-sp-placement-acceptance.md`](./decision-assessment-snapshot-sp-placement-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-COLUMN-NAMES-1
Kind: Human Decision packet（compare → Acceptance）
Status: OPEN / NOT ACCEPTED
Human Decision: NOT YET
Stop point: HUMAN_AS_COLUMN_INTENDED_NAMES_FILL

Locked basis:
  COLUMN-PROVISION-1 = NM-HOLD + SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + XB-1 + AP-1
  Scope = AssessmentSnapshots（isogo + honmoku）only
  PX-HOLD / EG-HOLD remain unless separately changed later
  Agent Internal Name invention = FORBIDDEN
  INTENDED ≠ CONFIRMED（CN-1 / VR-1）

Current boundary（unchanged by opening this packet）:
  SharePoint column creation = FORBIDDEN
  Implementation Start = HOLD
  adapter / schema mapping implementation = HOLD
  Agent SharePoint mutation = FORBIDDEN
  Deploy / real data = NO-GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Question

```text
AssessmentSnapshots の app-field persistence slots について、
Human は intended Display Name / Internal Name / Column Type を
明示採択するか。

採択値の状態 = HUMAN-PROVIDED / INTENDED
≠ OBSERVED / CONFIRMED
≠ column creation GO
≠ Implementation Start

Agent は concrete 値を発明しない。
空欄のまま Acceptance しない（NM-1 を採るなら Human が埋める）。
```

## 2. Compare axes

### NM — naming decision for this packet

| ID | 内容 | 結果 |
|---|---|---|
| **NM-1** | Human Acceptance で intended Display Name / Internal Name / Column Type を明示採択する。状態 = HUMAN-PROVIDED / INTENDED | OPEN candidate |
| NM-HOLD | 本 packet でも intended naming をまだ決めない（COLUMN-PROVISION-1 NM-HOLD 維持） | OPEN candidate |
| NM-2 | Agent が Domain / TS 名から発明して採択する | NOT SELECTABLE |
| NM-X | Human 明示 | OPEN candidate |

### XB — boundary（must keep）

| ID | 内容 | 結果 |
|---|---|---|
| **XB-1** | 本 Decision ≠ column creation GO ≠ Implementation Start ≠ adapter start ≠ Deploy | OPEN candidate（必須維持候補） |
| XB-2 | names Acceptance と同時に column creation / adapter start | NOT SELECTABLE（PX-HOLD/EG-HOLD/AP-1） |

### CV — coverage

| ID | 内容 | 結果 |
|---|---|---|
| **CV-REQ** | 必須 logical fields（MAP-AS-001〜008）の intended names を埋める | OPEN candidate |
| CV-ALL | 必須 + 任意 + DTO envelope（MAP-AS-001〜010 + ENV-001〜003）を埋める | OPEN candidate |
| CV-HOLD | coverage 未決定 | OPEN candidate |
| CV-X | Human 明示 | OPEN candidate |

```text
MAP-AS-SYS-001 Title:
  already OBSERVED / CONFIRMED as standard column
  NOT an app-field intended-name target
  Do not redefine Title as AssessmentSnapshot logical field
```

## 3. Human fill table（empty until Human evidence）

証跡列順 = Mapping ID → Logical Field → Display Name → Internal Name → Column Type → Status

Scope Lists: `AssessmentSnapshots` on `severe-support-isogo` / `severe-support-honmoku`

| Mapping ID | Logical Field | Display Name | Internal Name | Column Type | Status |
|---|---|---|---|---|---|
| MAP-AS-001 | snapshotId | — | — | — | NOT FILLED |
| MAP-AS-002 | recordStatus | — | — | — | NOT FILLED |
| MAP-AS-003 | result | — | — | — | NOT FILLED |
| MAP-AS-004 | reasonCodes | — | — | — | NOT FILLED |
| MAP-AS-005 | ruleSetVersion | — | — | — | NOT FILLED |
| MAP-AS-006 | periodStart | — | — | — | NOT FILLED |
| MAP-AS-007 | periodEnd | — | — | — | NOT FILLED |
| MAP-AS-008 | inputFingerprint | — | — | — | NOT FILLED |
| MAP-AS-009 | findingIds | — | — | — | NOT FILLED（optional） |
| MAP-AS-010 | supersedesSnapshotId | — | — | — | NOT FILLED（optional） |
| MAP-AS-ENV-001 | schemaId（DTO envelope） | — | — | — | NOT FILLED（optional / DTO） |
| MAP-AS-ENV-002 | schemaVersion（DTO envelope） | — | — | — | NOT FILLED（optional / DTO） |
| MAP-AS-ENV-003 | dtoVersion（DTO envelope） | — | — | — | NOT FILLED（optional / DTO） |

```text
Fill rules:
  Human provides values verbatim
  Agent does not invent or romanize from Japanese Display Names
  Status after Human fill = HUMAN-PROVIDED / INTENDED only
  After create + VR-1 CN-1 re-observation → may become CONFIRMED
  reasonCodes / findingIds physical representation must be Human-explicit
    （multi / JSON / multiple columns — do not guess）
```

## 4. Agent recommendation（比較用；Acceptance ではない）

```text
Agent recommendation:
  Await Human fill；do not invent rows
  If Human is ready to name now: NM-1 + CV-REQ（or CV-ALL）+ XB-1
  If Human is not ready: NM-HOLD + XB-1（remain deferred）

NOT Human Acceptance evidence.
NOT column creation GO.
NOT Implementation Start.
```

## 5. Explicit non-authorization

```text
This OPEN packet does NOT authorize:
  Internal Name invention by Agent
  SharePoint column create / rename / delete
  treating INTENDED as CONFIRMED
  PX-1 / EG-1 override of COLUMN-PROVISION-1 holds
  Implementation Start
  adapter / schema mapping code start
  Deploy / real data
  Agent tenant mutation
  SupportPlans naming
```

## 6. Next

```text
Decision-AS-COLUMN-NAMES-1: OPEN / NOT ACCEPTED
Stop point: HUMAN_AS_COLUMN_INTENDED_NAMES_FILL
Awaiting: Human Decision + filled intended names table
  or NM-HOLD continue
Until Accepted with Human values（NM-1）:
  column creation = FORBIDDEN
  Implementation Start = HOLD
  adapter impl = HOLD
After NM-1 Accepted（separate later units still required）:
  PX-1 / EG-1 Decision or reopen path
  then Human create
  then VR-1 CN-1 re-observation
```
