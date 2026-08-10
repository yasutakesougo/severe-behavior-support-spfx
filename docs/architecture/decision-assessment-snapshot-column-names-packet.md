# Decision-AS-COLUMN-NAMES-1 — intended column names packet（NM-1 path）

この文書は、Thirty-second residual（SELECTED / A — NM-1 path）後の
**AssessmentSnapshots 向け intended Display Name / Internal Name / Column Type**
についての比較用 Human Decision Packet である。

```text
Packet purpose:
  AssessmentSnapshots の各 logical field について、
  Human が Display Name / intended Internal Name / Column Type を
  明示採択するための比較材料を出す。

Agent role:
  候補整理のみ
  Internal Name の発明・自動採択 = FORBIDDEN
  Display Name / Column Type の自動採択 = FORBIDDEN

Closing rule:
  次の Human 判断で具体的な名前を採択して初めて NM-1 を閉じられる
  packet OPEN alone ≠ NM-1 closed
```

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
Human Decision: PARTIAL FILL（CV-REQ Display Name + Column Type）；Internal Name NOT YET
Stop point: HUMAN_AS_COLUMN_INTENDED_INTERNAL_NAMES_FILL

Human evidence recorded（verbatim；INTENDED only）:
  Coverage direction = CV-REQ（MAP-AS-001〜008）
  Display Name = filled for CV-REQ
  Column Type = filled for CV-REQ
  Internal Name = NOT FILLED（Agent invention FORBIDDEN）
  MAP-AS-009/010 / ENV-001〜003 = OUT OF THIS FILL（CV-REQ）

Locked basis:
  COLUMN-PROVISION-1 = NM-HOLD + SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + XB-1 + AP-1
  Scope = AssessmentSnapshots（isogo + honmoku）only
  PX-HOLD / EG-HOLD remain unless separately changed later
  Agent Internal Name invention = FORBIDDEN
  INTENDED ≠ OBSERVED / CONFIRMED（CN-1 / VR-1）

Current boundary（unchanged by this partial fill）:
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
AssessmentSnapshots の app-field persistence slots について、
Human は intended Display Name / Internal Name / Column Type を
明示採択するか。

採択値の状態 = HUMAN-PROVIDED / INTENDED
≠ OBSERVED / CONFIRMED
≠ column creation GO
≠ Execution GO
≠ Implementation Start

Agent は concrete 値を発明・自動採択しない。
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
| **CV-REQ** | 必須 logical fields（MAP-AS-001〜008）の intended names を埋める | **Human direction recorded**（Display/Type partial；Internal Name pending） |
| CV-ALL | 必須 + 任意 + DTO envelope（MAP-AS-001〜010 + ENV-001〜003）を埋める | NOT SELECTED for this fill |
| CV-HOLD | coverage 未決定 | NOT SELECTED |
| CV-X | Human 明示 | NOT SELECTED |

```text
MAP-AS-SYS-001 Title:
  already OBSERVED / CONFIRMED as standard column
  NOT an app-field intended-name target
  Do not redefine Title as AssessmentSnapshot logical field
```

## 3. Agent 候補整理（比較材料のみ；採択ではない）

MT-1 から既知の logical facts だけを並べる。
ここにあるのは **判断材料** であり、Display Name / Internal Name / Column Type の採択ではない。

| Mapping ID | Logical Field | Logical Type（MT-1） | Required | Agent notes（比較用） | Display / Internal / Type |
|---|---|---|---|---|---|
| MAP-AS-001 | snapshotId | string | 必須 | single scalar id slot | Display+Type Human PARTIAL；Internal NOT SELECTED |
| MAP-AS-002 | recordStatus | enum `draft`\|`finalized` | 必須 | enum 表現は Human 明示（Choice / Text 等） | Display+Type Human PARTIAL；Internal NOT SELECTED |
| MAP-AS-003 | result | enum `NO_FINDINGS`\|`FINDINGS_PRESENT`\|`NOT_APPLICABLE` | 必須 | enum 表現は Human 明示 | Display+Type Human PARTIAL；Internal NOT SELECTED |
| MAP-AS-004 | reasonCodes | readonly string[] | 条件付必須 | 配列物理表現は Human 明示（multi / JSON / 複数列） | Display+Type Human PARTIAL；Internal NOT SELECTED |
| MAP-AS-005 | ruleSetVersion | string | 必須 | version string slot | Display+Type Human PARTIAL；Internal NOT SELECTED |
| MAP-AS-006 | periodStart | ISO date | 必須 | date/datetime 表現は Human 明示 | Display+Type Human PARTIAL；Internal NOT SELECTED |
| MAP-AS-007 | periodEnd | ISO date | 必須 | date/datetime 表現は Human 明示 | Display+Type Human PARTIAL；Internal NOT SELECTED |
| MAP-AS-008 | inputFingerprint | string | 必須 | fingerprint string slot | Display+Type Human PARTIAL；Internal NOT SELECTED |
| MAP-AS-009 | findingIds | readonly string[]? | 任意 | 配列物理表現は Human 明示 | OUT OF THIS FILL（CV-REQ） |
| MAP-AS-010 | supersedesSnapshotId | string? | 任意 | optional id slot | OUT OF THIS FILL（CV-REQ） |
| MAP-AS-ENV-001 | schemaId（DTO envelope） | string | DTO必須予定 | DTO envelope；CV 範囲は Human | OUT OF THIS FILL（CV-REQ） |
| MAP-AS-ENV-002 | schemaVersion（DTO envelope） | `1.0.0` | DTO必須予定 | DTO envelope；CV 範囲は Human | OUT OF THIS FILL（CV-REQ） |
| MAP-AS-ENV-003 | dtoVersion（DTO envelope） | `1.0.0` | DTO必須予定 | DTO envelope；CV 範囲は Human | OUT OF THIS FILL（CV-REQ） |

```text
候補整理 rules:
  Logical Field / Logical Type / Required = MT-1 既知（再 Decision しない）
  Agent notes = 判断論点の列挙のみ
  Agent は Display Name / Internal Name / Column Type を埋めない
  Domain / TS 名の romanize・転記による Internal Name 自動採択 = FORBIDDEN
  INTENDED ≠ OBSERVED / CONFIRMED
```

## 4. Human fill table（Human evidence；Internal Name still open）

証跡列順 = Mapping ID → Logical Field → Display Name → Internal Name → Column Type → Status

Scope Lists: `AssessmentSnapshots` on `severe-support-isogo` / `severe-support-honmoku`
Coverage for this fill: **CV-REQ**（MAP-AS-001〜008）

| Mapping ID | Logical Field | Display Name | Internal Name | Column Type | Status |
|---|---|---|---|---|---|
| MAP-AS-001 | snapshotId | スナップショットID | — | 1行テキスト | PARTIAL / INTENDED（Internal Name NOT FILLED） |
| MAP-AS-002 | recordStatus | 記録状態 | — | 選択肢 | PARTIAL / INTENDED（Internal Name NOT FILLED） |
| MAP-AS-003 | result | 判定結果 | — | 選択肢 | PARTIAL / INTENDED（Internal Name NOT FILLED） |
| MAP-AS-004 | reasonCodes | 理由コード | — | 複数行テキスト（JSON） | PARTIAL / INTENDED（Internal Name NOT FILLED） |
| MAP-AS-005 | ruleSetVersion | ルールセットバージョン | — | 1行テキスト | PARTIAL / INTENDED（Internal Name NOT FILLED） |
| MAP-AS-006 | periodStart | 対象期間開始日 | — | 日付のみ | PARTIAL / INTENDED（Internal Name NOT FILLED） |
| MAP-AS-007 | periodEnd | 対象期間終了日 | — | 日付のみ | PARTIAL / INTENDED（Internal Name NOT FILLED） |
| MAP-AS-008 | inputFingerprint | 入力フィンガープリント | — | 1行テキスト | PARTIAL / INTENDED（Internal Name NOT FILLED） |
| MAP-AS-009 | findingIds | — | — | — | OUT OF THIS FILL（CV-REQ） |
| MAP-AS-010 | supersedesSnapshotId | — | — | — | OUT OF THIS FILL（CV-REQ） |
| MAP-AS-ENV-001 | schemaId（DTO envelope） | — | — | — | OUT OF THIS FILL（CV-REQ） |
| MAP-AS-ENV-002 | schemaVersion（DTO envelope） | — | — | — | OUT OF THIS FILL（CV-REQ） |
| MAP-AS-ENV-003 | dtoVersion（DTO envelope） | — | — | — | OUT OF THIS FILL（CV-REQ） |

```text
Fill evidence note:
  Source = Human message（CV-REQ + Display Names + Column Types）
  Values above = HUMAN-PROVIDED / INTENDED only
  ≠ OBSERVED / CONFIRMED
  Internal Name still NOT FILLED for all CV-REQ rows
  Agent must not invent / romanize / auto-adopt Internal Names
  Choice option values（recordStatus / result）not yet Human-listed in this fill
  reasonCodes physical representation = 複数行テキスト（JSON） per Human
  NM-1 Acceptance still blocked until Internal Names filled（or Human declines NM-1）
```

## 5. Agent recommendation（比較用；Acceptance ではない）

```text
Agent recommendation:
  Recorded Human CV-REQ Display Name + Column Type verbatim
  Do not invent Internal Names from Display Names or Logical Field names
  Next Human step for NM-1 close:
    provide intended Internal Name for MAP-AS-001〜008
    optionally confirm Choice option values for recordStatus / result
  Until then: packet remains OPEN / NOT ACCEPTED

NOT Human Acceptance evidence for full NM-1.
NOT column creation GO.
NOT Execution GO.
NOT Implementation Start.
```

## 6. Explicit non-authorization

```text
This OPEN packet / partial fill does NOT authorize:
  Internal Name invention / auto-adoption by Agent
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
Decision-AS-COLUMN-NAMES-1: OPEN / NOT ACCEPTED
Stop point: HUMAN_AS_COLUMN_INTENDED_INTERNAL_NAMES_FILL
Recorded: CV-REQ Display Name + Column Type（PARTIAL / INTENDED）
Awaiting: Human intended Internal Name for MAP-AS-001〜008
  （optional: Choice option values for recordStatus / result）
NM-1 closes only when Human completes required name triad for CV-REQ
  （Display Name + Internal Name + Column Type）
Until Accepted with Human Internal Names（NM-1）:
  SharePoint column creation = FORBIDDEN
  Execution GO = NOT GIVEN
  Implementation Start = HOLD
  adapter impl = HOLD
  SharePoint touch = NOT REQUIRED yet
After NM-1 Accepted（separate later units still required）:
  PX-1 / EG-1 Decision or reopen path
  then Human create
  then VR-1 CN-1 re-observation
```
