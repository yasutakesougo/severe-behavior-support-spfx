# Decision-AS-COLUMN-PROVISION-1 — custom column provisioning packet

この文書は、Thirty-first residual（SELECTED / A）後の
**pilot Lists 向け custom column provisioning / Execution GO 境界**についての
比較用 Human Decision Packet である。

Selected via:
[`decision-ilb-1-thirty-first-residual-column-provision-selection.md`](./decision-ilb-1-thirty-first-residual-column-provision-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-schema-mapping-next-acceptance.md`](./decision-assessment-snapshot-schema-mapping-next-acceptance.md)
（MT-1 + IN-A + CP-1 + XB-1；column GO は別）
[`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)
[`decision-assessment-snapshot-cn1-closure-determination.md`](./decision-assessment-snapshot-cn1-closure-determination.md)
[`decision-assessment-snapshot-pilot-provision-exec-acceptance.md`](./decision-assessment-snapshot-pilot-provision-exec-acceptance.md)
（Site/List only；columns were OUT）
[`decision-assessment-snapshot-sp-placement-acceptance.md`](./decision-assessment-snapshot-sp-placement-acceptance.md)
（CN-1 / SC-1）
[`../decisions/DEC-AI-ORG-003.md`](../decisions/DEC-AI-ORG-003.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-COLUMN-PROVISION-1
Kind: Human Decision packet（compare → CONSUMED）
Status: CONSUMED（Human Decision Accepted / LOCKED）
Human Decision: NM-HOLD + SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + XB-1 + AP-1
Human Selected:
  Intended column naming:        NM-HOLD
  Scope:                         SC-AS
  Column creation authorization: PX-HOLD
  Explicit Execution GO:         EG-HOLD
  Post-create verification:      VR-1
  Failure:                       FG-1
  Implementation boundary:       XB-1
  AI / Agent mutation:           AP-1
Accepted 正本:
  decision-assessment-snapshot-column-provision-acceptance.md

Locked facts（再 Decision しない）:
  CN-1 observation = CLOSED / DEFAULT_COLUMNS_ONLY / custom = 0
  SCHEMA-MAPPING-NEXT-1 = MT-1 + IN-A + CP-1 + XB-1
  IN-A = intended Internal Names NOT adopted there
  MT-1 table = UPDATED / NOT mapping-complete
  Site / List = OBSERVED / CONFIRMED（isogo/honmoku；SupportPlans/AssessmentSnapshots）
  Agent SharePoint mutation = FORBIDDEN（DEC-AI-ORG-003 / AP precedent）

Current boundary（Accepted / LOCKED）:
  Implementation Start = HOLD（XB-1）
  adapter / schema mapping implementation = HOLD（XB-1）
  SharePoint column creation = FORBIDDEN（NM-HOLD + PX-HOLD + EG-HOLD）
  Intended Internal Names = NOT ADOPTED / HOLD（NM-HOLD）
  Scope = AssessmentSnapshots only（SC-AS）
  Agent SharePoint mutation = FORBIDDEN（AP-1）
  Deploy / real data = NO-GO
  GitHub Issue mutation = FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Question

```text
custom columns = 0 のパイロット Lists に対し、
アプリ固有列をどう provisioning するか。

固定する判断単位:
  1. intended Internal Names / Display Names / Column Types（NM）
  2. 対象 List / Site 範囲（SC）
  3. column creation authorization（PX）
  4. Explicit Execution GO（EG）
  5. 作成後 verification / CN-1 再観測（VR）
  6. failure 時 fail-closed（FG）
  7. Implementation / adapter / Deploy 境界（XB）
  8. AI / Agent mutation 境界（AP）

本 packet ≠ Internal Name 発明
本 packet OPEN ≠ column 作成実行
本 packet ≠ Implementation Start
```

```text
Historical note:
  候補・Agent recommendation は比較用。
  採択は Human Acceptance 正本のみが LOCKED。
  axes Accepted ≠ concrete Internal Names invented by Agent
  axes Accepted ≠ columns created
  Execution GO GIVEN ≠ Agent may mutate tenant
```

## 2. 再 Decision しない前提（LOCKED）

| 項目 | 固定値 | 正本 |
|---|---|---|
| CN-1 result | DEFAULT_COLUMNS_ONLY / custom = 0 | Decision-AS-CN1-OBSERVATION-1 |
| CN-1 rule | 実 Internal Name のみ CONFIRMED；推論禁止 | Decision-AS-SP-PLACEMENT-1 |
| SCHEMA-MAPPING-NEXT | MT-1 + IN-A + CP-1 + XB-1 | Decision-AS-SCHEMA-MAPPING-NEXT-1 |
| Site/List creation | COMPLETED；columns were OUT | Decision-AS-PILOT-PROVISION-EXEC-1 |
| Mapping table | slots exist；Internal Name NOT PRESENT | assessment-snapshot-sharepoint-mapping.md |
| AI SharePoint mutation | 禁止 / 別プロセス | DEC-AI-ORG-003 |

```text
MUST NOT re-open:
  Site / List names
  CN-1 observation evidence
  DEC-6 rules（LF/RW/MF/VR）
  SCHEMA-MAPPING-NEXT axes themselves
```

## 3. Compare axes

### NM — intended column naming

| ID | 内容 | 結果 |
|---|---|---|
| **NM-1** | Human Acceptance で intended Display Name / Internal Name / Column Type を明示採択する。状態 = HUMAN-PROVIDED / INTENDED。≠ OBSERVED / CONFIRMED。Agent は値を発明しない | NOT SELECTED |
| NM-2 | Agent が Domain / TS 名から Internal Name を発明して採択する | NOT SELECTED（was NOT SELECTABLE） |
| **NM-HOLD** | intended naming をまだ決めない（列作成 GO も出せない） | **Accepted** |
| NM-X | Human 明示 | NOT SELECTED |

```text
NOT candidates:
  INTENDED を CONFIRMED と同一視
  Title を app fields の代替にする
  MT-1 表の 未確認 行を勝手に埋める
```

### SC — scope

| ID | 内容 | 結果 |
|---|---|---|
| **SC-AS** | AssessmentSnapshots（isogo + honmoku）のみを本 Decision の対象にする | **Accepted** |
| SC-BOTH | AssessmentSnapshots + SupportPlans（両 Sites）を同時対象にする | NOT SELECTED |
| SC-HOLD | 対象 List 未決定 | NOT SELECTED |
| SC-X | Human 明示 | NOT SELECTED |

### PX — column creation authorization

| ID | 内容 | 結果 |
|---|---|---|
| **PX-1** | Accepted INTENDED columns の作成を許可する（Human process；Agent 不可） | NOT SELECTED |
| **PX-HOLD** | まだ作成を許可しない | **Accepted** |
| PX-X | Human 明示 | NOT SELECTED |

### EG — Explicit Execution GO

| ID | 内容 | 結果 |
|---|---|---|
| **EG-1** | Human が Explicit Column Creation Execution GO を付与する | NOT SELECTED |
| EG-2 | Agent / docs Acceptance だけで作成開始する | NOT SELECTED（was NOT SELECTABLE） |
| **EG-HOLD** | Execution GO をまだ付けない | **Accepted** |
| EG-X | Human 明示 | NOT SELECTED |

```text
EG-1 requires:
  NM-1 Human-provided intended names present
  PX-1 authorization Accepted
  AP-1 remains（Agent still FORBIDDEN）
```

### VR — post-create verification

| ID | 内容 | 結果 |
|---|---|---|
| **VR-1** | 作成後 Human read-only CN-1 再観測。Intent=Observed の Internal Names のみ CONFIRMED | **Accepted** |
| VR-HOLD | 確認方針未決定 | NOT SELECTED |
| VR-X | Human 明示 | NOT SELECTED |

### FG — failure

| ID | 内容 | 結果 |
|---|---|---|
| **FG-1** | fail-closed（代替名発明・既存列上書き・blind retry 禁止） | **Accepted** |
| FG-HOLD | 未決定 | NOT SELECTED |
| FG-X | Human 明示 | NOT SELECTED |

### XB — Implementation / adapter / Deploy boundary

| ID | 内容 | 結果 |
|---|---|---|
| **XB-1** | 本 Decision / even Execution GO ≠ Implementation Start ≠ adapter code start ≠ Deploy | **Accepted** |
| XB-2 | column creation と同時に adapter 実装開始を許可 | NOT SELECTED（was NOT SELECTABLE） |
| XB-X | Human 明示 | NOT SELECTED |

### AP — AI / Agent mutation boundary

| ID | 内容 | 結果 |
|---|---|---|
| **AP-1** | SharePoint column mutation は本 AI foundation 手順では禁止。実作成は別 Human process | **Accepted** |
| AP-2 | Agent がこの chat / repo 手順で直接 tenant mutation する | NOT SELECTED（was NOT SELECTABLE） |
| AP-X | Human 明示 | NOT SELECTED |

## 4. Agent recommendation（比較履歴）

```text
Agent recommendation:
  NM-HOLD + SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + XB-1 + AP-1
Human Decision:
  NM-HOLD + SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + XB-1 + AP-1
  （Accepted / LOCKED）
Acceptance 正本:
  decision-assessment-snapshot-column-provision-acceptance.md
```

## 5. Explicit non-authorization

```text
This CONSUMED packet / Acceptance does NOT authorize:
  Internal Name invention
  SharePoint column create / rename / delete / overwrite
  treating INTENDED as CONFIRMED
  Agent tenant / M365 / Entra mutation
  Implementation Start
  adapter / schema mapping code start
  Deploy / real data
  GitHub Issue mutation
  Issue Status Reconciliation as substitute
```

## 6. Related process debt（not this packet）

```text
Issue Status Reconciliation:
  assessed in issue-status-reconciliation-assessment.md
  independent candidate
  NOT a substitute for column provisioning Decision
```

## 7. Next

```text
Decision-AS-COLUMN-PROVISION-1: Accepted / LOCKED
  / NM-HOLD + SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + XB-1 + AP-1
Thirty-first residual: CONSUMED
Acceptance: decision-assessment-snapshot-column-provision-acceptance.md
Next gate: decision-assessment-snapshot-column-provision-next-gate.md

Still FORBIDDEN / HOLD:
  SharePoint column creation = FORBIDDEN
  Intended Internal Names = NOT ADOPTED / HOLD
  Agent mutation = FORBIDDEN
  Implementation Start = HOLD
  adapter impl = HOLD
Next residual: NOT SELECTED
```
