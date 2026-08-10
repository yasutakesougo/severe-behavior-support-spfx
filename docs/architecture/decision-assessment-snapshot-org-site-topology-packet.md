# Decision-AS-ORG-SITE-TOPOLOGY-1 — multi-facility org site topology

この文書は、Decision-AS-NEW-TARGET-PROVISION-1 / NAMES-1 を前提に、
**複数事業所運用時の SharePoint Site 配置（法人共通 + 事業所単位）** を判断する
Human Decision Packet である。

Accepted 正本:
[`decision-assessment-snapshot-org-site-topology-acceptance.md`](./decision-assessment-snapshot-org-site-topology-acceptance.md)

Selected via:
[`decision-ilb-1-twenty-third-residual-org-site-topology-selection.md`](./decision-ilb-1-twenty-third-residual-org-site-topology-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-new-target-provisioning-acceptance.md`](./decision-assessment-snapshot-new-target-provisioning-acceptance.md)
（Decision-AS-NEW-TARGET-PROVISION-1 = ST-1+LT-1+NM-1+EX-1）
[`decision-assessment-snapshot-new-target-names-acceptance.md`](./decision-assessment-snapshot-new-target-names-acceptance.md)
（Decision-AS-NEW-TARGET-NAMES-1 = SU-1+LN-1+IN-1+XB-1）
[`decision-assessment-snapshot-target-reuse-acceptance.md`](./decision-assessment-snapshot-target-reuse-acceptance.md)
（Decision-AS-TARGET-REUSE-1 = B）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ORG-SITE-TOPOLOGY-1
Kind: Human Decision packet（compare → CONSUMED）
Status: CONSUMED（Human Decision Accepted / LOCKED）
Human Decision: OT-1 + FS-1 + SP-1 + PP-1 + PH-1 + XB-1
Human Selected:
  Org topology:           OT-1
  Facility site pattern:  FS-1
  SPFx package reuse:     SP-1
  Pilot site purpose:     PP-1
  Placeholder boundary:   PH-1
  Execution boundary:     XB-1
Selected via:
  decision-ilb-1-twenty-third-residual-org-site-topology-selection.md

Baseline（PR #185 MERGED）:
  merge commit: 1aef0d3971165f6504f7f13d6e68a51d7cfdaf61
  status: MERGED

Locked basis:
  Decision-AS-TARGET-REUSE-1 = Accepted / LOCKED / B
  Decision-AS-NEW-TARGET-PROVISION-1 = Accepted / LOCKED / ST-1 + LT-1 + NM-1 + EX-1
  Decision-AS-NEW-TARGET-NAMES-1 = Accepted / LOCKED / SU-1 + LN-1 + IN-1 + XB-1
  Existing /sites/welfare = REFERENCE ONLY
  Per-app target = dedicated new Site + dedicated new Lists
  Placeholder intended names = XXXXX / YYYYY（実値ではない）

Current state:
  Org site topology = LOCKED（本 Decision）
  Formal Site / List names = NOT SELECTED / OPEN
  Site / List creation = NO-GO
  Placeholder creation = FORBIDDEN
  Implementation Start = HOLD
  SharePoint implementation = DO NOT START
  Schema / DTO code = HOLD / NOT STARTED
  Deploy / real data = NO-GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Question

```text
複数事業所で運用する前提で、SharePoint Site をどう分けるか。

- 法人共通管理サイトを持つか
- 事業所ごとに専用 Site / Lists を持つか
- SPFx を事業所ごとに別開発するか、1コード共通利用か
- いま作ろうとしている第1サイトの用途は何か
- XXXXX / YYYYY を実値として作成してよいか
- topology Acceptance で Site/List 作成まで進めてよいか
```

```text
Historical note:
  候補・Agent recommendation は比較用。採択は Acceptance 正本のみが LOCKED である。
  org topology Accepted ≠ 正式名称確定 ≠ Site/List 作成。
  ST-1 + LT-1（dedicated Site + Lists）は再 Decision しない。
  本 Decision はそれを複数事業所へどう複製・分離するかの org pattern を固定する。
```

## 2. Compare axes（比較履歴）

### OT — Org topology

| ID | 内容 | 結果 |
|---|---|---|
| **OT-1** | 1法人 = 1共通管理サイト + N事業所サイト | **Accepted** |
| OT-2 | 全事業所を 1 Site に同居させ、List / 権限だけで分離する | NOT SELECTED |
| OT-HOLD | org topology をまだ決めない | NOT SELECTED |

### FS — Facility site pattern

| ID | 内容 | 結果 |
|---|---|---|
| **FS-1** | 事業所ごとに専用 SharePoint Site と専用 Lists を持つ。データ境界はその事業所のみ | **Accepted** |
| FS-2 | 事業所横断の共有 Lists を主データとする | NOT SELECTED |
| FS-HOLD | facility site pattern 未決定 | NOT SELECTED |

### SP — SPFx package reuse

| ID | 内容 | 結果 |
|---|---|---|
| **SP-1** | SPFx は 1 コード / 同一パッケージを複数事業所サイトへ共通利用する | **Accepted** |
| SP-2 | 事業所ごとに別 SPFx パッケージを開発する | NOT SELECTED |
| SP-HOLD | package reuse 未決定 | NOT SELECTED |

### PP — Pilot site purpose

| ID | 内容 | 結果 |
|---|---|---|
| **PP-1** | 第1サイト用途 = パイロット事業所専用（その事業所データのみ）。法人共通管理サイトではない | **Accepted** |
| PP-2 | 第1サイト用途 = 法人共通管理サイト | NOT SELECTED |
| PP-HOLD | 第1サイト用途未決定 | NOT SELECTED |

### PH — Placeholder boundary

| ID | 内容 | 結果 |
|---|---|---|
| **PH-1** | `XXXXX` / `YYYYY` は実値ではない。正式 Site URL / Site name / List names は別 Human Decision。placeholder への作成は FORBIDDEN | **Accepted** |
| PH-2 | `XXXXX` / `YYYYY` をそのまま作成対象として扱う | NOT SELECTED |
| PH-HOLD | placeholder 扱い未決定 | NOT SELECTED |

### XB — Execution boundary

| ID | 内容 | 結果 |
|---|---|---|
| **XB-1** | topology Acceptance ≠ Site/List creation GO。実 tenant mutation / provisioning は別 Human gate | **Accepted** |
| XB-2 | topology Acceptance と同時に Site/List を作成する | NOT SELECTED |
| XB-HOLD | execution boundary 未決定 | NOT SELECTED |

## 3. Recommended shape（historical / NOT Acceptance by itself）

```text
Topology recommendation（比較用）:

1法人
├─ 1 共通管理サイト
│   ├─ 共通設定
│   ├─ JSON / マスタ
│   └─ 法人横断の管理情報
└─ N 事業所サイト
     ├─ List 1 / List 2 / ...
     └─ SPFx アプリ（同一パッケージ）

SPFx code: 1
SharePoint Site: 事業所ごと + 共通管理 1
Lists: 事業所ごと
法人共通設定: 共通管理サイト

Agent recommendation / human-authored design prose:
  NOT Human Acceptance evidence by itself.
Human Acceptance is recorded in the Acceptance 正本 only.
```

## 4. Explicit non-authorization

```text
This packet / Acceptance does NOT authorize:
  inventing formal Site URL / Site name / List names
  creating Site / List / columns with XXXXX / YYYYY
  treating placeholder INTENDED as OBSERVED / CONFIRMED / CREATED
  PROVISION-EXEC Execution GO
  tenant / Entra / M365 mutation
  Implementation Start
  SharePoint / adapter / application implementation
  Schema / DTO code assignment
  Deploy / real data
  FindingCode / A-5
  post-retention deletion
```

## 5. Next after Human Acceptance

```text
Decision-AS-ORG-SITE-TOPOLOGY-1: Accepted / LOCKED / OT-1 + FS-1 + SP-1 + PP-1 + PH-1 + XB-1
  → decision-assessment-snapshot-org-site-topology-acceptance.md
Next gate: FIXED
  FORMAL PILOT FACILITY SITE / LIST NAMING
  → decision-assessment-snapshot-org-site-topology-next-gate.md
Site / List creation: NO-GO
Placeholder creation: FORBIDDEN
Implementation Start: HOLD
Ready / Merge: NOT RUN by this Decision
```
