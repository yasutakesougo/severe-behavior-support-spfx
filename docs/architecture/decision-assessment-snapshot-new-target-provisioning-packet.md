# Decision-AS-NEW-TARGET-PROVISION-1 — new SPFx target provisioning policy

この文書は、Decision-AS-TARGET-REUSE-1 Accepted / LOCKED / B を前提に、**新 SPFx 用 Site / List をどの provisioning topology で用意するか**を判断する Human Decision Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-NEW-TARGET-PROVISION-1
Kind: Human Decision packet（compare only）
Status: OPEN / NOT ACCEPTED
Selected via:
  decision-ilb-1-twentieth-residual-new-spfx-target-provisioning-selection.md

Locked basis:
  Decision-AS-TARGET-REUSE-1 = Accepted / LOCKED / B
  Existing /sites/welfare + DailyActivityRecords = REFERENCE ONLY
  Reuse existing /sites/welfare = NOT ADOPTED

Current state:
  New SPFx deployment target = NOT SELECTED / NOT CREATED / HOLD
  Site / List creation = NO-GO
  tenant mutation = NO-GO
  Implementation Start = HOLD
  SharePoint implementation = DO NOT START
  Schema / DTO code = HOLD / NOT STARTED
  Deploy / real data = NO-GO
```

## 1. Question

```text
新 SPFx 用の deployment target を、
既存運用環境と分離した dedicated Site + dedicated Lists として設計するか。
具体名称・URL・作成実行は、この Decision では決めない。
```

## 2. Compare axes

### ST — Site topology

| ID | 内容 | 判定上の意味 |
|---|---|---|
| **ST-1** | 新 SPFx 専用の新 SharePoint Site を用意する | TARGET-REUSE-1/B と最も明確に分離 |
| ST-2 | `/sites/welfare` 以外の既存 Site を後から選び、その中に配置する | existing-site dependency が残る |
| ST-HOLD | Site topology をまだ決めない | 現状維持 |

### LT — List topology

| ID | 内容 | 判定上の意味 |
|---|---|---|
| **LT-1** | 新 SPFx 専用 Site 内に、新 SPFx 専用 Lists を用意する | 既存 List と実データから分離 |
| LT-2 | 新 Site を作るが、既存 List を参照・共有利用する | TARGET-REUSE-1/B の reference-only 境界を弱める |
| LT-HOLD | List topology をまだ決めない | 現状維持 |

### NM — naming/value boundary

| ID | 内容 | 判定上の意味 |
|---|---|---|
| **NM-1** | この Decision では Site URL / Site name / List names / Internal Names を発明・固定しない。具体値は別 Human Decision | LF-1 / SV-1 / LV-1 / CN-1 と整合 |
| NM-2 | topology Acceptance と同時に具体名称も Agent が決める | 値発明につながる |
| NM-HOLD | naming boundary 未決定 | Acceptance 不可 |

### EX — execution boundary

| ID | 内容 | 判定上の意味 |
|---|---|---|
| **EX-1** | topology Acceptance ≠ Site/List creation GO。実際の tenant mutation / provisioning は別 Human gate | 既存 NO-GO 維持 |
| EX-2 | topology Acceptance と同時に Site/List を作成する | mutation auto-start |
| EX-HOLD | execution boundary 未決定 | Acceptance 不可 |

## 3. Agent recommendation（NOT Acceptance）

```text
Agent recommendation:
  ST-1 + LT-1 + NM-1 + EX-1

Rationale:
  TARGET-REUSE-1/B を最も明確に保ち、既存運用データ・権限・変更影響から分離できる。
  ただし具体 Site/List 名は一次情報または別 Human Decision まで発明せず、
  実作成も別 Human gate に残す。

This is NOT Human Acceptance evidence.
Human must explicitly Accept an ST / LT / NM / EX combination.
```

## 4. Explicit non-authorization

```text
This packet does NOT authorize:
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
If Human accepts ST-1 + LT-1 + NM-1 + EX-1:
  → dedicated new Site + dedicated new Lists becomes the LOCKED provisioning topology
  → concrete Site/List naming remains OPEN
  → Site/List creation remains NO-GO until a separate Human execution gate
  → Implementation Start remains HOLD

Until explicit Human Acceptance:
  Decision-AS-NEW-TARGET-PROVISION-1 = OPEN / NOT ACCEPTED
  New SPFx deployment target = NOT SELECTED / NOT CREATED / HOLD
```
