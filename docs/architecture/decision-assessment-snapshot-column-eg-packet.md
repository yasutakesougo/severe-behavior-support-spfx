# Decision-AS-COLUMN-EG-1 — Explicit Execution GO packet（EG-1 path）

この文書は、Thirty-fifth residual（SELECTED / A — EG-1 path）後の
**AssessmentSnapshots 向け Explicit Column Creation Execution GO（EG）**
についての比較用 Human Decision Packet である。

```text
Packet purpose:
  PX-1 許可済みの Accepted INTENDED columns について、
  Human が Explicit Column Creation Execution GO（EG-1）を
  明示採択するための比較材料を出す。

Agent role:
  候補整理のみ
  EG-1 の自動採択 = FORBIDDEN
  SharePoint mutation = FORBIDDEN（AP-1）

Closing rule:
  次の Human 判断で EG-1（または EG-HOLD 継続）を採択して初めて閉じられる
  packet OPEN alone ≠ Execution GO
  EG-1 Accepted ≠ Agent creates columns
  EG-1 Accepted ≠ Implementation Start
```

Selected via:
[`decision-ilb-1-thirty-fifth-residual-column-eg-selection.md`](./decision-ilb-1-thirty-fifth-residual-column-eg-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-column-px-acceptance.md`](./decision-assessment-snapshot-column-px-acceptance.md)
（PX-1 + XB-1 + AP-1；EG-HOLD was maintained there）
[`decision-assessment-snapshot-column-provision-acceptance.md`](./decision-assessment-snapshot-column-provision-acceptance.md)
（SC-AS + VR-1 + FG-1）
[`decision-assessment-snapshot-column-names-acceptance.md`](./decision-assessment-snapshot-column-names-acceptance.md)
（NM-1 + CV-REQ）
[`decision-assessment-snapshot-choice-options-acceptance.md`](./decision-assessment-snapshot-choice-options-acceptance.md)
（CO-1 + CV-CHOICE-BOTH）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-COLUMN-EG-1
Kind: Human Decision packet（compare → Acceptance）
Status: OPEN / NOT ACCEPTED
Human Decision: NOT YET
Stop point: HUMAN_AS_COLUMN_EG_DECISION

Locked basis:
  COLUMN-PX-1 = PX-1 + XB-1 + AP-1
  COLUMN-NAMES-1 = NM-1 + CV-REQ INTENDED
  CHOICE-OPTIONS-1 = CO-1 + CV-CHOICE-BOTH INTENDED
  COLUMN-PROVISION-1 = SC-AS + VR-1 + FG-1
  Scope = AssessmentSnapshots（isogo + honmoku）only
  Agent SharePoint mutation = FORBIDDEN（AP-1）
  INTENDED ≠ OBSERVED / CONFIRMED

Current boundary（unchanged by opening this packet）:
  SharePoint column creation = FORBIDDEN
  Execution GO = NOT GIVEN（EG-HOLD until Accepted otherwise）
  Implementation Start = HOLD
  adapter / schema mapping implementation = HOLD
  Agent SharePoint mutation = FORBIDDEN
  Deploy / real data = NO-GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Question

```text
PX-1 許可済みの Accepted INTENDED columns について、
Human は Explicit Column Creation Execution GO（EG）を付与するか。

EG-1 = Human が Explicit Column Creation Execution GO を付与する
       （Human process create；Agent 不可）
EG-HOLD = Execution GO をまだ付けない
EG-2 = Agent / docs Acceptance だけで作成開始する → NOT SELECTABLE

EG-1 ≠ Agent may create
EG-1 ≠ Implementation Start
EG-1 ≠ CONFIRMED Internal Names（VR-1 still required after create）
```

## 2. Compare axes

### EG — Explicit Execution GO

| ID | 内容 | 結果 |
|---|---|---|
| **EG-1** | Human が Explicit Column Creation Execution GO を付与する（Human process；Agent 不可） | OPEN candidate |
| EG-HOLD | Execution GO をまだ付けない | OPEN candidate |
| EG-2 | Agent / docs Acceptance だけで作成開始する | NOT SELECTABLE |
| EG-X | Human 明示 | OPEN candidate |

### PX / SC — locked reminders（再 Decision しない）

| ID | 内容 | 結果 |
|---|---|---|
| **PX-1** | column creation authorization | LOCKED（COLUMN-PX-1） |
| **SC-AS** | AssessmentSnapshots（isogo + honmoku）のみ | LOCKED |

### XB / AP / VR / FG — boundaries（must keep）

| ID | 内容 | 結果 |
|---|---|---|
| **XB-1** | 本 Decision ≠ Implementation Start ≠ adapter start ≠ Deploy | OPEN candidate（必須維持候補） |
| **AP-1** | Agent SharePoint mutation FORBIDDEN；実作成は Human process | OPEN candidate（必須維持候補） |
| **VR-1** | 作成後 Human read-only CN-1 再観測でだけ CONFIRMED | LOCKED |
| **FG-1** | fail-closed | LOCKED |

```text
EG-1 requires（COLUMN-PROVISION-1；再掲）:
  NM-1 Human-provided intended names present — MET / INTENDED
  Choice options for 選択肢 fields — MET / INTENDED
  PX-1 authorization Accepted — MET
  AP-1 remains（Agent still FORBIDDEN） — LOCKED
```

## 3. Agent 候補整理（比較材料のみ；採択ではない）

### Preconditions checklist（facts；not GO）

| Precondition | Status |
|---|---|
| CV-REQ intended names Accepted | MET（COLUMN-NAMES-1） |
| Choice options Accepted | MET（CHOICE-OPTIONS-1） |
| PX-1 authorization Accepted | MET（COLUMN-PX-1） |
| Scope SC-AS | LOCKED |
| Agent mutation FORBIDDEN（AP-1） | LOCKED |
| Explicit Execution GO | NOT GIVEN（current） |
| CONFIRMED Internal Names | NOT YET |

### In-scope INTENDED columns（reference；再 Decision しない）

| Mapping ID | Internal Name | Column Type | Notes |
|---|---|---|---|
| MAP-AS-001 | snapshotId | 1行テキスト | INTENDED |
| MAP-AS-002 | recordStatus | 選択肢 | + Choice options INTENDED |
| MAP-AS-003 | result | 選択肢 | + Choice options INTENDED |
| MAP-AS-004 | reasonCodes | 複数行テキスト | Representation=JSON |
| MAP-AS-005 | ruleSetVersion | 1行テキスト | INTENDED |
| MAP-AS-006 | periodStart | 日付のみ | INTENDED |
| MAP-AS-007 | periodEnd | 日付のみ | INTENDED |
| MAP-AS-008 | inputFingerprint | 1行テキスト | INTENDED |

```text
候補整理 rules:
  Agent does not grant EG-1
  Agent does not create columns
  EG-1 candidate ≠ Agent mutation permission
  Post-EG-1 create = Human process only；then VR-1
```

## 4. Agent recommendation（比較用；Acceptance ではない）

```text
Agent recommendation:
  If Human is ready to grant Execution GO for Human create:
    EG-1 + XB-1 + AP-1
  If Human is not ready:
    EG-HOLD + XB-1 + AP-1

NOT Human Acceptance evidence.
NOT Agent may create.
NOT Implementation Start.
NOT CONFIRMED names.
```

## 5. Explicit non-authorization

```text
This OPEN packet does NOT authorize:
  Explicit Execution GO（until Human Accepts EG-1）
  SharePoint column create / rename / delete by Agent
  treating packet OPEN as columns created
  treating INTENDED as CONFIRMED
  Implementation Start
  adapter / schema mapping code start
  Deploy / real data
  Agent tenant mutation
  SupportPlans column creation
```

## 6. Next

```text
Decision-AS-COLUMN-EG-1: OPEN / NOT ACCEPTED
Stop point: HUMAN_AS_COLUMN_EG_DECISION
Awaiting: Human Decision — EG-1 or EG-HOLD
Until EG-1 Accepted:
  SharePoint column creation = FORBIDDEN
  Execution GO = NOT GIVEN
  Implementation Start = HOLD
  Agent mutation = FORBIDDEN
After EG-1 Accepted（if selected）:
  Human create process may proceed（Agent still FORBIDDEN）
  then VR-1 CN-1 re-observation for CONFIRMED
  Implementation / adapter remain HOLD unless separately changed
```
