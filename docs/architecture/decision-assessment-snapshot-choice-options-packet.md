# Decision-AS-CHOICE-OPTIONS-1 — Choice options packet（recordStatus / result）

この文書は、Thirty-third residual（SELECTED / A — Choice options）後の
**AssessmentSnapshots `recordStatus` / `result`（Column Type=選択肢）向け
Choice option values** についての比較用 Human Decision Packet である。

```text
Packet purpose:
  recordStatus / result について、Human が
  Choice option の stored value / Display label を
  明示採択するための比較材料を出す。

Agent role:
  候補整理のみ
  Choice option value / label の発明・自動採択 = FORBIDDEN

Closing rule:
  次の Human 判断で具体 option 行を採択して初めて本 Decision を閉じられる
  packet OPEN alone ≠ Choice options closed
  packet OPEN ≠ column creation GO
```

Selected via:
[`decision-ilb-1-thirty-third-residual-choice-options-selection.md`](./decision-ilb-1-thirty-third-residual-choice-options-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-column-names-acceptance.md`](./decision-assessment-snapshot-column-names-acceptance.md)
（NM-1 + CV-REQ + XB-1；recordStatus/result Column Type=選択肢）
[`decision-assessment-snapshot-column-provision-acceptance.md`](./decision-assessment-snapshot-column-provision-acceptance.md)
（SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + XB-1 + AP-1）
[`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)
[`decision-assessment-snapshot-cn1-closure-determination.md`](./decision-assessment-snapshot-cn1-closure-determination.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-CHOICE-OPTIONS-1
Kind: Human Decision packet（compare → Acceptance）
Status: OPEN / NOT ACCEPTED
Human Decision: NOT YET
Stop point: HUMAN_AS_CHOICE_OPTIONS_FILL

Locked basis:
  COLUMN-NAMES-1 = NM-1 + CV-REQ + XB-1
  recordStatus Internal Name = recordStatus（INTENDED）
  result Internal Name = result（INTENDED）
  Column Type both = 選択肢（INTENDED）
  COLUMN-PROVISION-1 = SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + AP-1
  Scope = AssessmentSnapshots（isogo + honmoku）only
  Agent Choice option invention = FORBIDDEN
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
Column Type=選択肢 の recordStatus / result について、
Human は Choice option の stored value / Display label を
明示採択するか。

採択値の状態 = HUMAN-PROVIDED / INTENDED
≠ OBSERVED / CONFIRMED
≠ column creation GO
≠ Execution GO
≠ Implementation Start

Agent は concrete option 行を発明・自動採択しない。
空欄のまま Acceptance しない（CO-1 を採るなら Human が埋める）。
```

## 2. Compare axes

### CO — choice options decision for this packet

| ID | 内容 | 結果 |
|---|---|---|
| **CO-1** | Human Acceptance で recordStatus / result の Choice option rows を明示採択する。状態 = HUMAN-PROVIDED / INTENDED | OPEN candidate |
| CO-HOLD | 本 packet でも Choice options をまだ決めない | OPEN candidate |
| CO-2 | Agent が MT-1 / Domain enum から発明・自動採択する | NOT SELECTABLE |
| CO-X | Human 明示 | OPEN candidate |

### CV — coverage within Choice fields

| ID | 内容 | 結果 |
|---|---|---|
| **CV-CHOICE-BOTH** | recordStatus と result の両方 | OPEN candidate |
| CV-CHOICE-ONE | 片方のみ | OPEN candidate |
| CV-CHOICE-HOLD | coverage 未決定 | OPEN candidate |
| CV-X | Human 明示 | OPEN candidate |

### XB — boundary（must keep）

| ID | 内容 | 結果 |
|---|---|---|
| **XB-1** | 本 Decision ≠ column creation GO ≠ Execution GO ≠ Implementation Start ≠ adapter start ≠ Deploy | OPEN candidate（必須維持候補） |
| XB-2 | Choice options Acceptance と同時に column creation / adapter start | NOT SELECTABLE（PX-HOLD/EG-HOLD/AP-1） |

```text
OUT OF THIS packet:
  MAP-AS-001 / 004〜008 non-Choice fields（already named；no Choice options）
  MAP-AS-009/010 / ENV
  SupportPlans
```

## 3. Agent 候補整理（比較材料のみ；採択ではない）

MT-1 logical enum を判断材料として列挙する。
ここにあるのは **logical enum facts** であり、Choice option Display label / stored value の採択ではない。

### recordStatus（MAP-AS-002）

| Logical enum（MT-1） | Suggested as stored value? | Display label | Status |
|---|---|---|---|
| `draft` | NOT SELECTED by Agent | — | compare material only |
| `finalized` | NOT SELECTED by Agent | — | compare material only |

### result（MAP-AS-003）

| Logical enum（MT-1） | Suggested as stored value? | Display label | Status |
|---|---|---|---|
| `NO_FINDINGS` | NOT SELECTED by Agent | — | compare material only |
| `FINDINGS_PRESENT` | NOT SELECTED by Agent | — | compare material only |
| `NOT_APPLICABLE` | NOT SELECTED by Agent | — | compare material only |

```text
候補整理 rules:
  Logical enum sets = MT-1 既知（再 Decision しない）
  Agent does not adopt logical enum as SharePoint Choice stored value automatically
  Agent does not invent Japanese Display labels
  Human must state stored value + Display label per option row
  INTENDED ≠ OBSERVED / CONFIRMED
```

## 4. Human fill table（empty until Human evidence）

証跡列順 = Field → Option stored value → Display label → Status

Scope Lists: `AssessmentSnapshots` on `severe-support-isogo` / `severe-support-honmoku`

### recordStatus（Internal Name `recordStatus`；Column Type 選択肢）

| Option # | Stored value | Display label | Status |
|---|---|---|---|
| 1 | — | — | NOT FILLED |
| 2 | — | — | NOT FILLED |
| … | — | — | NOT FILLED |

### result（Internal Name `result`；Column Type 選択肢）

| Option # | Stored value | Display label | Status |
|---|---|---|---|
| 1 | — | — | NOT FILLED |
| 2 | — | — | NOT FILLED |
| 3 | — | — | NOT FILLED |
| … | — | — | NOT FILLED |

```text
Fill rules:
  Human provides values verbatim
  Agent does not invent or romanize Display labels
  Status after Human fill = HUMAN-PROVIDED / INTENDED only
  After create + VR-1 CN-1 re-observation → may become CONFIRMED
  Extra / fewer options than MT-1 enum count = Human-explicit only
```

## 5. Agent recommendation（比較用；Acceptance ではない）

```text
Agent recommendation:
  Await Human fill；候補整理のみ；do not invent option rows
  If Human is ready now: CO-1 + CV-CHOICE-BOTH + XB-1
  If Human is not ready: CO-HOLD + XB-1

NOT Human Acceptance evidence.
NOT column creation GO.
NOT Execution GO.
NOT Implementation Start.
```

## 6. Explicit non-authorization

```text
This OPEN packet does NOT authorize:
  Choice option invention / auto-adoption by Agent
  SharePoint column create / rename / delete
  treating INTENDED as OBSERVED / CONFIRMED
  PX-1 / EG-1 override of COLUMN-PROVISION-1 holds
  Execution GO
  Implementation Start
  adapter / schema mapping code start
  Deploy / real data
  Agent tenant mutation
  SupportPlans naming
```

## 7. Next

```text
Decision-AS-CHOICE-OPTIONS-1: OPEN / NOT ACCEPTED
Stop point: HUMAN_AS_CHOICE_OPTIONS_FILL
Awaiting: Human Decision + filled Choice option tables
  or CO-HOLD continue
Until Accepted with Human values（CO-1）:
  SharePoint column creation = FORBIDDEN
  Execution GO = NOT GIVEN
  Implementation Start = HOLD
  adapter impl = HOLD
After Choice options Accepted（separate later units still required）:
  PX-1 / EG-1 Decision or reopen path
  then Human create
  then VR-1 CN-1 re-observation
```
