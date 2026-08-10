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
  Human が具体的な名前を採択して初めて NM-1 を閉じる
```

Selected via:
[`decision-ilb-1-thirty-second-residual-column-names-selection.md`](./decision-ilb-1-thirty-second-residual-column-names-selection.md)

Accepted 正本:
[`decision-assessment-snapshot-column-names-acceptance.md`](./decision-assessment-snapshot-column-names-acceptance.md)

IR:
[`decision-assessment-snapshot-column-names-independent-review.md`](./decision-assessment-snapshot-column-names-independent-review.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-column-provision-acceptance.md`](./decision-assessment-snapshot-column-provision-acceptance.md)
（SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + XB-1 + AP-1；naming は NM-1 へ）
[`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)
[`decision-assessment-snapshot-cn1-closure-determination.md`](./decision-assessment-snapshot-cn1-closure-determination.md)
[`decision-assessment-snapshot-sp-placement-acceptance.md`](./decision-assessment-snapshot-sp-placement-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-COLUMN-NAMES-1
Kind: Human Decision packet（compare → CONSUMED）
Status: CONSUMED（Human Decision Accepted / LOCKED）
Human Decision: NM-1 + CV-REQ + XB-1
Human Selected:
  Intended column naming: NM-1
  Coverage:               CV-REQ
  Boundary:               XB-1
Accepted 正本:
  decision-assessment-snapshot-column-names-acceptance.md

Locked basis:
  COLUMN-PROVISION-1 remains for SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + AP-1
  Scope = AssessmentSnapshots（isogo + honmoku）only
  Agent Internal Name invention = FORBIDDEN
  INTENDED ≠ OBSERVED / CONFIRMED（CN-1 / VR-1）

Current boundary（unchanged by names Acceptance）:
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
```

## 2. Compare axes（Acceptance 結果）

### NM — naming decision for this packet

| ID | 内容 | 結果 |
|---|---|---|
| **NM-1** | Human Acceptance で intended Display Name / Internal Name / Column Type を明示採択する。状態 = HUMAN-PROVIDED / INTENDED | **SELECTED / Accepted** |
| NM-HOLD | 本 packet でも intended naming をまだ決めない | NOT SELECTED |
| NM-2 | Agent が Domain / TS 名から発明して採択する | NOT SELECTABLE |
| NM-X | Human 明示 | NOT SELECTED |

### XB — boundary（must keep）

| ID | 内容 | 結果 |
|---|---|---|
| **XB-1** | 本 Decision ≠ column creation GO ≠ Implementation Start ≠ adapter start ≠ Deploy | **SELECTED / Accepted** |
| XB-2 | names Acceptance と同時に column creation / adapter start | NOT SELECTABLE |

### CV — coverage

| ID | 内容 | 結果 |
|---|---|---|
| **CV-REQ** | 必須 logical fields（MAP-AS-001〜008）の intended names を埋める | **SELECTED / Accepted** |
| CV-ALL | 必須 + 任意 + DTO envelope（MAP-AS-001〜010 + ENV-001〜003）を埋める | NOT SELECTED |
| CV-HOLD | coverage 未決定 | NOT SELECTED |
| CV-X | Human 明示 | NOT SELECTED |

```text
MAP-AS-SYS-001 Title:
  already OBSERVED / CONFIRMED as standard column
  NOT an app-field intended-name target
```

## 3. Accepted Human fill table（CV-REQ）

証跡列順 = Mapping ID → Logical Field → Display Name → Internal Name → Column Type → Representation → Status

| Mapping ID | Logical Field | Display Name | Internal Name | Column Type | Representation | Status |
|---|---|---|---|---|---|---|
| MAP-AS-001 | snapshotId | スナップショットID | snapshotId | 1行テキスト | — | HUMAN-PROVIDED / INTENDED |
| MAP-AS-002 | recordStatus | 記録状態 | recordStatus | 選択肢 | — | HUMAN-PROVIDED / INTENDED |
| MAP-AS-003 | result | 判定結果 | result | 選択肢 | — | HUMAN-PROVIDED / INTENDED |
| MAP-AS-004 | reasonCodes | 理由コード | reasonCodes | 複数行テキスト | JSON | HUMAN-PROVIDED / INTENDED |
| MAP-AS-005 | ruleSetVersion | ルールセットバージョン | ruleSetVersion | 1行テキスト | — | HUMAN-PROVIDED / INTENDED |
| MAP-AS-006 | periodStart | 対象期間開始日 | periodStart | 日付のみ | — | HUMAN-PROVIDED / INTENDED |
| MAP-AS-007 | periodEnd | 対象期間終了日 | periodEnd | 日付のみ | — | HUMAN-PROVIDED / INTENDED |
| MAP-AS-008 | inputFingerprint | 入力フィンガープリント | inputFingerprint | 1行テキスト | — | HUMAN-PROVIDED / INTENDED |
| MAP-AS-009 | findingIds | — | — | — | — | OUT OF THIS Acceptance（CV-REQ） |
| MAP-AS-010 | supersedesSnapshotId | — | — | — | — | OUT OF THIS Acceptance（CV-REQ） |
| MAP-AS-ENV-001 | schemaId（DTO envelope） | — | — | — | — | OUT OF THIS Acceptance（CV-REQ） |
| MAP-AS-ENV-002 | schemaVersion（DTO envelope） | — | — | — | — | OUT OF THIS Acceptance（CV-REQ） |
| MAP-AS-ENV-003 | dtoVersion（DTO envelope） | — | — | — | — | OUT OF THIS Acceptance（CV-REQ） |

```text
INTENDED ≠ OBSERVED / CONFIRMED
Choice option values（recordStatus / result）= NOT locked by this Acceptance
```

## 4. Explicit non-authorization

```text
This Accepted packet does NOT authorize:
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

## 5. Next

```text
Decision-AS-COLUMN-NAMES-1: Accepted / LOCKED / NM-1 + CV-REQ + XB-1
Thirty-second residual: CONSUMED
Next substantive residual: NOT SELECTED
Still FORBIDDEN / HOLD:
  column creation / Execution GO / Implementation / adapter / Agent mutation
After later PX-1 / EG-1 + Human create + VR-1:
  INTENDED may become CONFIRMED
```
