# Decision-AS-ORG-SITE-TOPOLOGY-1 — multi-facility org site topology Human Acceptance

この文書は、**Decision-AS-ORG-SITE-TOPOLOGY-1**（複数事業所運用時の
SharePoint Site 配置）についての **Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-org-site-topology-packet.md`](./decision-assessment-snapshot-org-site-topology-packet.md)

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
Status: Accepted / LOCKED
Human Decision: OT-1 + FS-1 + SP-1 + PP-1 + PH-1 + XB-1
Human Acceptance: Explicit Human Decision on 2026-08-09

Baseline（PR #185 MERGED）:
  merge commit: 1aef0d3971165f6504f7f13d6e68a51d7cfdaf61
  status: MERGED

LOCKED:

Org topology:
  OT-1 — 1法人 = 1共通管理サイト + N事業所サイト

Facility site pattern:
  FS-1 — 事業所ごとに専用 SharePoint Site と専用 Lists を持つ
         データ境界 = その事業所のみ

SPFx package reuse:
  SP-1 — 1 SPFx コード / 同一パッケージを複数事業所サイトへ共通利用する
         （1コード・複数サイト）

Pilot site purpose:
  PP-1 — 第1サイト用途 = パイロット事業所専用
         （法人共通管理サイトではない / その事業所データのみ）

Placeholder boundary:
  PH-1 — XXXXX / YYYYY は実値ではない
         正式 Site URL / Site name / List names は別 Human Decision
         placeholder への Site/List 作成 = FORBIDDEN

Execution boundary:
  XB-1 — topology Acceptance ≠ Site/List creation GO
         実 tenant mutation / provisioning は別 Human gate

Related open work:
  PR #186 / Decision-AS-NEW-TARGET-PROVISION-EXEC-1（OPEN / Draft の場合）
  Execution GO = NOT GIVEN / NOT STARTED
  Placeholder 作成実行 = FORBIDDEN（PH-1 + XB-1）

Formal names:
  Pilot facility Site URL / name: NOT SELECTED / OPEN
  Pilot facility List names: NOT SELECTED / OPEN
  Common management Site URL / name: NOT SELECTED / OPEN

Site / List / column creation:
  NO-GO
tenant mutation:
  NO-GO
Implementation Start:
  HOLD
SharePoint implementation:
  DO NOT START
Schema / DTO code:
  HOLD / NOT STARTED
Deploy / real data:
  NO-GO
FindingCode / A-5:
  HOLD
Post-retention deletion:
  OPEN / AUTO-START FORBIDDEN

Closes only:
  Decision-AS-ORG-SITE-TOPOLOGY-1 org pattern（OT/FS/SP/PP/PH/XB）
Does NOT close:
  第1パイロット事業所の正式 Site / List 名称
  法人共通管理サイトの正式名称
  Site / List / column creation
  PROVISION-EXEC Execution GO
  tenant mutation
  Implementation Start
  SharePoint / adapter / application 実装
  Schema / DTO コード割当
  FindingCode / A-5
  post-retention deletion
Implementation auto-start: FORBIDDEN
Site / List creation auto-start: FORBIDDEN
Placeholder creation: FORBIDDEN
Formal name invention by Agent: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: OT-1 + FS-1 + SP-1 + PP-1 + PH-1 + XB-1
Decision-AS-ORG-SITE-TOPOLOGY-1: Accepted / LOCKED

Org topology:           OT-1
Facility site pattern:  FS-1
SPFx package reuse:     SP-1
Pilot site purpose:     PP-1
Placeholder boundary:   PH-1
Execution boundary:     XB-1
```

日本語正本:

```text
OT-1:
  1法人につき、共通管理サイト 1 + 事業所サイト N。
FS-1:
  事業所ごとに専用 Site と専用 Lists。
  権限・利用者・記録を事業所単位で分離する。
  データ境界 = その事業所のみ。
SP-1:
  SPFx は 1 コードを共通利用する（事業所ごとの別開発はしない）。
PP-1:
  いま位置づける第1サイトはパイロット事業所専用。
  法人共通管理サイトではない。
PH-1:
  XXXXX / YYYYY は実値ではない。
  正式名称は別 Human Decision。
  placeholder への作成はしない。
XB-1:
  topology Acceptance だけでは Site / List を作成しない。
```

```text
LOCKED shape:

法人共通
└─ 共通管理サイト
   ├─ 共通設定
   ├─ JSON / マスタ
   └─ 法人横断の管理情報

事業所A / B / C ...
└─ 専用 SharePoint Site
   ├─ Lists（事業所専用）
   └─ SPFx アプリ（同一パッケージ）
```

```text
Agent recommendation / design prose:
  NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-AS-ORG-SITE-TOPOLOGY-1: Accepted / LOCKED

Org topology:           OT-1
Facility site pattern:  FS-1
SPFx package reuse:     SP-1
Pilot site purpose:     PP-1
Placeholder boundary:   PH-1
Execution boundary:     XB-1

NOT SELECTED:
  OT-2 / OT-HOLD
  FS-2 / FS-HOLD
  SP-2 / SP-HOLD
  PP-2 / PP-HOLD
  PH-2 / PH-HOLD
  XB-2 / XB-HOLD
```

### Placeholder / naming status

```text
NAMES-1 intended placeholders（再 Decision しない / 実値ではない）:
  New Site URL:  https://isogokatudouhome.sharepoint.com/sites/XXXXX
  New Site name: XXXXX
  New List names: XXXXX / YYYYY
  Status: HUMAN-PROVIDED / INTENDED / PLACEHOLDER
          ≠ REAL / CREATABLE / OBSERVED / CONFIRMED

Formal pilot facility naming: NOT SELECTED / OPEN（次 Human Decision）
Common management site naming: NOT SELECTED / OPEN（別 Human Decision）
Site / List creation: NO-GO
Placeholder creation: FORBIDDEN
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-ORG-SITE-TOPOLOGY-1 Accepted = 正式 Site / List 名確定
  Decision-AS-ORG-SITE-TOPOLOGY-1 Accepted = Site / List 作成 GO
  Decision-AS-ORG-SITE-TOPOLOGY-1 Accepted = PROVISION-EXEC Execution GO
  Decision-AS-ORG-SITE-TOPOLOGY-1 Accepted = tenant mutation GO
  Decision-AS-ORG-SITE-TOPOLOGY-1 Accepted = Implementation Start
  Decision-AS-ORG-SITE-TOPOLOGY-1 Accepted = SharePoint / adapter コード開始
  Decision-AS-ORG-SITE-TOPOLOGY-1 Accepted = Schema / DTO コード割当
  Decision-AS-ORG-SITE-TOPOLOGY-1 Accepted = FindingCode / A-5 再開
  Decision-AS-ORG-SITE-TOPOLOGY-1 Accepted = post-retention 開始
  XXXXX / YYYYY = 作成してよい実値
  ST-1 + LT-1 の再 Decision
```

## Acceptance boundary

```text
This Acceptance locks multi-facility org site topology only.

MUST NOT start from this Acceptance alone:
  inventing formal Site URL / Site name / List names
  creating Site / List / columns（含む XXXXX / YYYYY）
  treating placeholders as live OBSERVED / CONFIRMED
  tenant / SharePoint / Entra / M365 changes
  TypeScript / application / adapter / DTO code
  Schema / DTO code assignment
  FindingCode / A-5
  post-retention deletion
  Implementation Start
  Deploy / real data
```

## Relation to PROVISION-1 / NAMES-1 / open EXEC

```text
Unchanged / not re-decided:
  ST-1 + LT-1 = dedicated new Site + dedicated new Lists（per facility site）
  TARGET-REUSE B = /sites/welfare REFERENCE ONLY
  NAMES-1 axes = SU-1 + LN-1 + IN-1 + XB-1
  NAMES-1 placeholders remain INTENDED / PLACEHOLDER

Clarified by this Acceptance:
  multi-facility pattern = 1 common + N facility sites
  first site purpose = pilot facility
  1 SPFx package across sites
  placeholder creation FORBIDDEN
  next = formal pilot naming（not creation）

Open PR #186（PROVISION-EXEC）if present:
  Execution GO remains NOT GIVEN
  creating XXXXX / YYYYY remains FORBIDDEN under PH-1
```

## Next

```text
Decision-AS-ORG-SITE-TOPOLOGY-1: Accepted / LOCKED / OT-1 + FS-1 + SP-1 + PP-1 + PH-1 + XB-1
Next gate: FIXED
  FORMAL PILOT FACILITY IDENTITY / SITE NAMING
  → decision-assessment-snapshot-org-site-topology-next-gate.md
Decision-AS-PILOT-FACILITY-IDENTITY-1: OPEN / NOT ACCEPTED
  → decision-assessment-snapshot-pilot-facility-identity-packet.md
  recommended: 磯子=isogo / 本牧=honmoku + Site names/URLs（CANDIDATE / NOT LOCKED）
List names: DEFERRED
Common management Site name: NOT SELECTED / OPEN
Site / List creation: NO-GO
Placeholder creation: FORBIDDEN
PROVISION-EXEC Execution GO: NOT GIVEN / BLOCKED by PH-1 until formal names
New SPFx deployment target: ORG TOPOLOGY LOCKED / NOT CREATED / HOLD
Implementation Start: HOLD
SharePoint implementation: DO NOT START
tenant changes: NO-GO
Schema / DTO: HOLD
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```
