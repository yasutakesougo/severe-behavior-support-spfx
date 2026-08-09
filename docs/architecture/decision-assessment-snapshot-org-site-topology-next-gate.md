# Next gate — Formal pilot facility Site / List naming

この文書は、**Decision-AS-ORG-SITE-TOPOLOGY-1 Accepted / LOCKED /
OT-1+FS-1+SP-1+PP-1+PH-1+XB-1** 後の次 Human gate を固定する正本である。

Authorization / topology 正本:
[`decision-assessment-snapshot-org-site-topology-acceptance.md`](./decision-assessment-snapshot-org-site-topology-acceptance.md)

Placeholder names 正本:
[`decision-assessment-snapshot-new-target-names-acceptance.md`](./decision-assessment-snapshot-new-target-names-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Next-gate definition（docs-only）
Status: FIXED / NOT STARTED
Authorization basis:
  Decision-AS-ORG-SITE-TOPOLOGY-1 = Accepted / LOCKED
    / OT-1 + FS-1 + SP-1 + PP-1 + PH-1 + XB-1

Next gate:
  FORMAL PILOT FACILITY SITE / LIST NAMING

Naming GO: NOT GIVEN / NOT STARTED
Creation GO: NOT GIVEN / NO-GO
This document does NOT invent names and does NOT start tenant mutation.
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Fixed next gate

```text
Next gate:
  FORMAL PILOT FACILITY SITE / LIST NAMING

Sequence after Human naming Decision:
  1. Human がパイロット事業所専用サイトの正式 Site URL / Site name を明示
  2. Human が専用 Lists の正式 List name(s) を明示
  3. Agent は Accepted 値を発明しない（NAMES-1 SU-1 / LN-1 と同型）
  4. STOP（作成はさらに別 Human execution gate）

NOT next:
  Site/List creation with XXXXX / YYYYY
  PROVISION-EXEC Execution GO against placeholders
  法人共通管理サイトの同時作成
```

## 2. Pilot site purpose（LOCKED）

```text
Site purpose:
  パイロット事業所の強度行動障害支援アプリ用

Site type（intended design；作成は別）:
  Team Site / 標準チーム（作成時に別確認）

Data boundary:
  この事業所のデータのみ

Not this site:
  法人共通管理サイト
  他事業所データ
```

## 3. Placeholder status（FORBIDDEN as creation target）

```text
NAMES-1 placeholders:
  Site URL:  https://isogokatudouhome.sharepoint.com/sites/XXXXX
  Site name: XXXXX
  Lists:     XXXXX / YYYYY
  Status:    HUMAN-PROVIDED / INTENDED / PLACEHOLDER
             ≠ REAL / CREATABLE / OBSERVED / CONFIRMED

Under PH-1:
  placeholder への Site / List 作成 = FORBIDDEN
  INTENDED placeholder を OBSERVED / CONFIRMED 扱い = FORBIDDEN
```

## 4. Out of scope（unchanged）

```text
Site / List creation: NO-GO
custom columns: NO-GO
Internal Column Names: OPEN / post-creation CN-1
permissions / config: NO-GO
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Deploy / real data: NO-GO
Schema / DTO code assignment: HOLD
FindingCode / A-5: HOLD
post-retention deletion: OPEN / AUTO-START FORBIDDEN
Common management site naming / creation: 別 Human Decision
```

## 5. Explicit non-start

```text
This next-gate definition alone does NOT:
  invent formal Site / List names
  create Site / List / columns
  perform tenant mutation
  mark SV-1 / LV-1 CONFIRMED
  authorize PROVISION-EXEC Execution GO
  start Implementation / SharePoint code / Deploy

Requires separate explicit Human Decision to fill formal pilot names.
Creation remains a later Human execution gate after real names exist.
```

## 6. Current state

```text
Decision-AS-ORG-SITE-TOPOLOGY-1: Accepted / LOCKED / OT-1 + FS-1 + SP-1 + PP-1 + PH-1 + XB-1
Next gate: FIXED = FORMAL PILOT FACILITY SITE / LIST NAMING
Naming GO: NOT GIVEN / NOT STARTED
Site / List creation: NO-GO
Placeholder creation: FORBIDDEN
PROVISION-EXEC Execution GO: NOT GIVEN / BLOCKED by PH-1
SV-1 / LV-1: NOT CONFIRMED
Internal Column Names: OPEN（IN-1）
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Deploy / real data: NO-GO

Current stop:
  waiting for Human formal pilot Site / List names
  auto-start: FORBIDDEN
```
