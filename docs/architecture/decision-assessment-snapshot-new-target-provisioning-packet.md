# Decision-AS-NEW-TARGET-PROVISION-1 — new SPFx target provisioning policy

この文書は、Decision-AS-TARGET-REUSE-1 Accepted / LOCKED / B を前提に、**新 SPFx 用 Site / List をどの provisioning topology で用意するか**を判断する Human Decision Packet である。

Accepted 正本:
[`decision-assessment-snapshot-new-target-provisioning-acceptance.md`](./decision-assessment-snapshot-new-target-provisioning-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-NEW-TARGET-PROVISION-1
Kind: Human Decision packet（compare → CONSUMED）
Status: CONSUMED（Human Decision Accepted / LOCKED）
Human Decision: ST-1 + LT-1 + NM-1 + EX-1
Human Selected:
  Site topology:            ST-1
  List topology:            LT-1
  Naming / value boundary:  NM-1
  Execution boundary:       EX-1
Selected via:
  decision-ilb-1-twentieth-residual-new-spfx-target-provisioning-selection.md

Locked basis:
  Decision-AS-TARGET-REUSE-1 = Accepted / LOCKED / B
  Existing /sites/welfare + DailyActivityRecords = REFERENCE ONLY
  Reuse existing /sites/welfare = NOT ADOPTED

Current state:
  New SPFx deployment target = TOPOLOGY LOCKED（ST-1 + LT-1）/ NOT CREATED / HOLD
  Concrete Site / List / Internal Names = NOT SELECTED / OPEN
  Site / List creation = NO-GO
  tenant mutation = NO-GO
  Implementation Start = HOLD
  SharePoint implementation = DO NOT START
  Schema / DTO code = HOLD / NOT STARTED
  Deploy / real data = NO-GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Question

```text
新 SPFx 用の deployment target を、
既存運用環境と分離した dedicated Site + dedicated Lists として設計するか。
具体名称・URL・作成実行は、この Decision では決めない。
```

```text
Historical note:
  候補・Agent recommendation は比較用。採択は Acceptance 正本のみが LOCKED である。
  topology Accepted ≠ 具体値確定 ≠ Site/List 作成。
```

## 2. Compare axes（比較履歴）

### ST — Site topology

| ID | 内容 | 結果 |
|---|---|---|
| **ST-1** | 新 SPFx 専用の新 SharePoint Site を用意する | **Accepted** |
| ST-2 | `/sites/welfare` 以外の既存 Site を後から選び、その中に配置する | NOT SELECTED |
| ST-HOLD | Site topology をまだ決めない | NOT SELECTED |

### LT — List topology

| ID | 内容 | 結果 |
|---|---|---|
| **LT-1** | 新 SPFx 専用 Site 内に、新 SPFx 専用 Lists を用意する | **Accepted** |
| LT-2 | 新 Site を作るが、既存 List を参照・共有利用する | NOT SELECTED |
| LT-HOLD | List topology をまだ決めない | NOT SELECTED |

### NM — naming/value boundary

| ID | 内容 | 結果 |
|---|---|---|
| **NM-1** | この Decision では Site URL / Site name / List names / Internal Names を発明・固定しない。具体値は別 Human Decision | **Accepted** |
| NM-2 | topology Acceptance と同時に具体名称も Agent が決める | NOT SELECTED |
| NM-HOLD | naming boundary 未決定 | NOT SELECTED |

### EX — execution boundary

| ID | 内容 | 結果 |
|---|---|---|
| **EX-1** | topology Acceptance ≠ Site/List creation GO。実際の tenant mutation / provisioning は別 Human gate | **Accepted** |
| EX-2 | topology Acceptance と同時に Site/List を作成する | NOT SELECTED |
| EX-HOLD | execution boundary 未決定 | NOT SELECTED |

## 3. Agent recommendation（historical / NOT Acceptance）

```text
Agent recommendation:
  ST-1 + LT-1 + NM-1 + EX-1

This was NOT Human Acceptance evidence.
Human Acceptance is recorded in the Acceptance 正本 only.
```

## 4. Explicit non-authorization（unchanged）

```text
This packet / Acceptance does NOT authorize:
  concrete Site URL / Site name invention
  concrete List name invention
  Internal Column Name invention
  Site creation
  List / column creation
  tenant / Entra / M365 mutation
  Value Acceptance of /sites/welfare
  Implementation Start
  SharePoint / adapter / application implementation
  Schema / DTO code assignment
  Deploy / real data
  FindingCode / A-5
  post-retention deletion
```

## 5. Next after Human Acceptance

```text
Decision-AS-NEW-TARGET-PROVISION-1: Accepted / LOCKED / ST-1 + LT-1 + NM-1 + EX-1
  → decision-assessment-snapshot-new-target-provisioning-acceptance.md
New SPFx deployment target: TOPOLOGY LOCKED / NOT CREATED / HOLD
Concrete Site / List / Internal Names: NOT SELECTED / OPEN
Site / List creation: NO-GO until separate Human execution gate
Implementation Start: HOLD
Ready / Merge: NOT RUN by this Decision
```
