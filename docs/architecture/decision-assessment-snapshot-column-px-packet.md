# Decision-AS-COLUMN-PX-1 — column creation authorization packet（PX-1 path）

この文書は、Thirty-fourth residual（SELECTED / A — PX-1 path）後の
**AssessmentSnapshots 向け custom column creation authorization（PX）**
についての比較用 Human Decision Packet である。

```text
Packet purpose:
  Accepted INTENDED columns（CV-REQ names + Choice options）について、
  Human が column creation authorization（PX-1）を
  明示採択するための比較材料を出す。

Agent role:
  候補整理のみ
  PX-1 / Execution GO の自動採択 = FORBIDDEN
  SharePoint mutation = FORBIDDEN

Closing rule:
  次の Human 判断で PX-1（または PX-HOLD 継続）を採択して初めて閉じられる
  packet OPEN alone ≠ PX-1
  PX-1 Accepted alone ≠ Execution GO ≠ columns created
```

Selected via:
[`decision-ilb-1-thirty-fourth-residual-column-px-selection.md`](./decision-ilb-1-thirty-fourth-residual-column-px-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-column-provision-acceptance.md`](./decision-assessment-snapshot-column-provision-acceptance.md)
（SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + XB-1 + AP-1）
[`decision-assessment-snapshot-column-names-acceptance.md`](./decision-assessment-snapshot-column-names-acceptance.md)
（NM-1 + CV-REQ + XB-1）
[`decision-assessment-snapshot-choice-options-acceptance.md`](./decision-assessment-snapshot-choice-options-acceptance.md)
（CO-1 + CV-CHOICE-BOTH + XB-1）
[`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-COLUMN-PX-1
Kind: Human Decision packet（compare → Acceptance）
Status: OPEN / NOT ACCEPTED
Human Decision: NOT YET
Stop point: HUMAN_AS_COLUMN_PX_DECISION

Locked basis:
  COLUMN-PROVISION-1 = SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + XB-1 + AP-1
  COLUMN-NAMES-1 = NM-1 + CV-REQ intended names ADOPTED / INTENDED
  CHOICE-OPTIONS-1 = CO-1 + CV-CHOICE-BOTH ADOPTED / INTENDED
  Scope = AssessmentSnapshots（isogo + honmoku）only
  Agent SharePoint mutation = FORBIDDEN（AP-1）
  INTENDED ≠ OBSERVED / CONFIRMED

Current boundary（unchanged by opening this packet）:
  SharePoint column creation = FORBIDDEN
  Execution GO = NOT GIVEN（EG-HOLD）
  Implementation Start = HOLD
  adapter / schema mapping implementation = HOLD
  Agent SharePoint mutation = FORBIDDEN
  Deploy / real data = NO-GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Question

```text
Accepted INTENDED columns（CV-REQ + Choice options）について、
Human は column creation authorization（PX）を付与するか。

PX-1 = 作成を許可する（Human process；Agent 不可）
PX-HOLD = まだ許可しない

PX-1 ≠ Explicit Execution GO（EG-1 は別）
PX-1 ≠ Agent may create
PX-1 ≠ Implementation Start
PX-1 ≠ CONFIRMED Internal Names
```

## 2. Compare axes

### PX — column creation authorization

| ID | 内容 | 結果 |
|---|---|---|
| **PX-1** | Accepted INTENDED columns の作成を許可する（Human process；Agent 不可） | OPEN candidate |
| PX-HOLD | まだ作成を許可しない（COLUMN-PROVISION-1 PX-HOLD 維持） | OPEN candidate |
| PX-X | Human 明示 | OPEN candidate |

### SC — scope reminder（再 Decision しない；LOCKED）

| ID | 内容 | 結果 |
|---|---|---|
| **SC-AS** | AssessmentSnapshots（isogo + honmoku）のみ | LOCKED（COLUMN-PROVISION-1） |
| SC-BOTH | SupportPlans を含む | NOT SELECTED（再 Decision しない） |

### EG — Explicit Execution GO（本 packet では採択しない）

| ID | 内容 | 結果 |
|---|---|---|
| EG-1 | Explicit Column Creation Execution GO | OUT OF THIS PACKET（別 residual） |
| **EG-HOLD** | Execution GO をまだ付けない | LOCKED until separate unit |
| EG-2 | Agent / docs Acceptance だけで作成開始 | NOT SELECTABLE |

```text
EG-1 requires（COLUMN-PROVISION-1；再掲）:
  NM-1 Human-provided intended names present（MET / INTENDED）
  Choice options present for 選択肢 fields（MET / INTENDED）
  PX-1 authorization Accepted
  AP-1 remains（Agent still FORBIDDEN）
```

### XB / AP / VR / FG — boundaries（must keep）

| ID | 内容 | 結果 |
|---|---|---|
| **XB-1** | 本 Decision ≠ Implementation Start ≠ adapter start ≠ Deploy | OPEN candidate（必須維持候補） |
| **AP-1** | Agent SharePoint mutation FORBIDDEN；実作成は Human process | OPEN candidate（必須維持候補） |
| **VR-1** | 作成後 Human read-only CN-1 再観測でだけ CONFIRMED | LOCKED（COLUMN-PROVISION-1） |
| **FG-1** | fail-closed | LOCKED（COLUMN-PROVISION-1） |

## 3. Agent 候補整理（比較材料のみ；採択ではない）

### Preconditions checklist（facts；not GO）

| Precondition | Status |
|---|---|
| CV-REQ intended Display / Internal / Type Accepted | MET（COLUMN-NAMES-1；INTENDED） |
| Choice options for recordStatus / result Accepted | MET（CHOICE-OPTIONS-1；INTENDED） |
| Scope AssessmentSnapshots only（SC-AS） | LOCKED |
| Agent mutation FORBIDDEN（AP-1） | LOCKED |
| Explicit Execution GO | NOT GIVEN（EG-HOLD） |
| CONFIRMED Internal Names | NOT YET |

### In-scope INTENDED columns（reference；再 Decision しない）

| Mapping ID | Internal Name | Column Type | Notes |
|---|---|---|---|
| MAP-AS-001 | snapshotId | 1行テキスト | INTENDED |
| MAP-AS-002 | recordStatus | 選択肢 | INTENDED + Choice options |
| MAP-AS-003 | result | 選択肢 | INTENDED + Choice options |
| MAP-AS-004 | reasonCodes | 複数行テキスト | Representation=JSON；INTENDED |
| MAP-AS-005 | ruleSetVersion | 1行テキスト | INTENDED |
| MAP-AS-006 | periodStart | 日付のみ | INTENDED |
| MAP-AS-007 | periodEnd | 日付のみ | INTENDED |
| MAP-AS-008 | inputFingerprint | 1行テキスト | INTENDED |

```text
候補整理 rules:
  Agent does not grant PX-1
  Agent does not create columns
  Agent does not grant EG-1
  PX-1 candidate ≠ Execution GO
```

## 4. Agent recommendation（比較用；Acceptance ではない）

```text
Agent recommendation:
  If Human is ready to authorize creation path: PX-1 + XB-1 + AP-1
    （EG-HOLD remains；EG-1 = separate later residual）
  If Human is not ready: PX-HOLD + XB-1 + AP-1

NOT Human Acceptance evidence.
NOT Execution GO.
NOT column creation start.
NOT Implementation Start.
```

## 5. Explicit non-authorization

```text
This OPEN packet does NOT authorize:
  SharePoint column create / rename / delete
  Explicit Execution GO（EG-1）
  treating PX discussion as columns created
  treating INTENDED as CONFIRMED
  Implementation Start
  adapter / schema mapping code start
  Deploy / real data
  Agent tenant mutation
  SupportPlans column creation
```

## 6. Next

```text
Decision-AS-COLUMN-PX-1: OPEN / NOT ACCEPTED
Stop point: HUMAN_AS_COLUMN_PX_DECISION
Awaiting: Human Decision — PX-1 or PX-HOLD
Until PX-1 Accepted:
  SharePoint column creation = FORBIDDEN
  Execution GO = NOT GIVEN
  Implementation Start = HOLD
After PX-1 Accepted（if selected）:
  EG-1 still requires separate residual / Acceptance
  Agent mutation still FORBIDDEN
  columns still not created until EG-1 + Human create
```
