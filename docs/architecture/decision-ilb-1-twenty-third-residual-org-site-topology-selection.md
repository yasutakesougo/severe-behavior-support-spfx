# Decision-ILB-1 — Twenty-third residual selection

この文書は、Decision-AS-NEW-TARGET-NAMES-1 Accepted / LOCKED 後、
**事業所サイト分離（法人共通 + N 事業所）** を次 substantive unit として固定する
Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_TWENTY_THIRD_RESIDUAL_SELECTION
Status: SELECTED / CONSUMED（Decision-AS-ORG-SITE-TOPOLOGY-1 Accepted / LOCKED）
Selected unit: Multi-facility SharePoint org site topology
Follow-up Decision ID: Decision-AS-ORG-SITE-TOPOLOGY-1

Baseline（PR #185 MERGED）:
  merge commit: 1aef0d3971165f6504f7f13d6e68a51d7cfdaf61
  status: MERGED

Locked basis（再 Decision しない）:
  Decision-AS-TARGET-REUSE-1 = Accepted / LOCKED / B
  Decision-AS-NEW-TARGET-PROVISION-1 = Accepted / LOCKED / ST-1 + LT-1 + NM-1 + EX-1
  Decision-AS-NEW-TARGET-NAMES-1 = Accepted / LOCKED / SU-1 + LN-1 + IN-1 + XB-1
  Existing /sites/welfare + DailyActivityRecords = REFERENCE ONLY
  New SPFx per-site topology = dedicated new Site + dedicated new Lists（ST-1 + LT-1）
  Intended placeholder names = XXXXX / YYYYY（HUMAN-PROVIDED / INTENDED；実値ではない）

Related open work（本 Selection では再 Decision しない）:
  PR #186 / Decision-AS-NEW-TARGET-PROVISION-EXEC-1（OPEN / Draft）
  Execution GO = NOT GIVEN / NOT STARTED
  Placeholder への作成実行 = FORBIDDEN（本 Decision と整合）

Current state:
  Org site topology = SELECTED / Accepted（本 residual）
  Formal Site / List names = NOT SELECTED / OPEN（別 Human Decision）
  Site / List creation = NO-GO
  tenant mutation = NO-GO
  Implementation Start = HOLD
  SharePoint implementation = DO NOT START
  Schema / DTO code = HOLD / NOT STARTED
  Deploy / real data = NO-GO
```

## Selection meaning

この Selection は、**複数事業所運用時の SharePoint Site 配置（法人共通 + 事業所単位）**
だけを次 Human Decision として選ぶ。

```text
SELECTED / CONSUMED:
  Decision-AS-ORG-SITE-TOPOLOGY-1
  Human Decision: OT-1 + FS-1 + SP-1 + PP-1 + PH-1 + XB-1

Closes:
  OT-1 — 1法人 = 1共通管理サイト + N事業所サイト
  FS-1 — 事業所ごとに専用 Site + 専用 Lists（データ境界 = その事業所のみ）
  SP-1 — 1 SPFx コードを複数事業所サイトへ共通利用
  PP-1 — 第1サイト用途 = パイロット事業所専用（共通管理サイトではない）
  PH-1 — XXXXX / YYYYY は実値ではない；正式名称は別 Human Decision
  XB-1 — topology Acceptance ≠ Site/List creation GO

Still OPEN / NOT AUTHORIZED:
  第1パイロット事業所サイトの正式名称
  法人共通管理サイトの正式名称
  Site / List / column creation
  treating XXXXX / YYYYY as creatable / OBSERVED / CONFIRMED
  PROVISION-EXEC Execution GO
  Implementation Start
  SharePoint / adapter / application implementation
  Schema / DTO code assignment
  Deploy / real data
  FindingCode / A-5
  post-retention deletion
```

Selection ≠ Acceptance ≠ Site/List creation.
（Acceptance 後も正式名称 Decision と作成 execution gate は別）

## Options considered（selection-time）

| ID | unit | 結果 |
|---|---|---|
| **A** | Multi-facility org site topology（Decision-AS-ORG-SITE-TOPOLOGY-1） | **SELECTED** |
| B | Explicit Site/List creation execution（placeholder XXXXX/YYYYY） | NOT SELECTED（FORBIDDEN / STOP） |
| C | Formal pilot Site / List naming | NOT SELECTED（本 Decision の次） |
| D | HOLD（まだ決めない） | NOT SELECTED |

## Next

```text
Selection CONSUMED → Decision-AS-ORG-SITE-TOPOLOGY-1 Accepted / LOCKED
  decision-assessment-snapshot-org-site-topology-acceptance.md
  Org topology:     OT-1
  Facility sites:   FS-1
  SPFx reuse:       SP-1
  Pilot purpose:    PP-1
  Placeholder:      PH-1
  Execution:        XB-1

Next Human gate: FIXED
  FORMAL PILOT FACILITY SITE / LIST NAMING
  → decision-assessment-snapshot-org-site-topology-next-gate.md

Still HOLD / NO-GO:
  Site / List creation（含む placeholder 作成）
  PROVISION-EXEC Execution GO
  Implementation Start
  SharePoint / adapter / application code
  tenant mutation
  Schema / DTO code assignment
  FindingCode / A-5
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```
