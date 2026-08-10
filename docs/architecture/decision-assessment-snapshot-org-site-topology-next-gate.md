# Next gate — Formal pilot facility identity / Site naming

この文書は、**Decision-AS-ORG-SITE-TOPOLOGY-1 Accepted / LOCKED /
OT-1+FS-1+SP-1+PP-1+PH-1+XB-1** 後の次 Human gate を固定する正本である。

Authorization / topology 正本:
[`decision-assessment-snapshot-org-site-topology-acceptance.md`](./decision-assessment-snapshot-org-site-topology-acceptance.md)

Next Decision（CONSUMED → Accepted）:
[`decision-assessment-snapshot-pilot-facility-identity-acceptance.md`](./decision-assessment-snapshot-pilot-facility-identity-acceptance.md)

Placeholder names 正本:
[`decision-assessment-snapshot-new-target-names-acceptance.md`](./decision-assessment-snapshot-new-target-names-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Next-gate definition（docs-only）
Status: FIXED / OPEN PACKET
Authorization basis:
  Decision-AS-ORG-SITE-TOPOLOGY-1 = Accepted / LOCKED
    / OT-1 + FS-1 + SP-1 + PP-1 + PH-1 + XB-1

Next gate（historical for ORG-SITE-TOPOLOGY-1）:
  FORMAL PILOT FACILITY IDENTITY / SITE NAMING
  → Decision-AS-PILOT-FACILITY-IDENTITY-1 Accepted / LOCKED
    / PO-1 + FK-1 + SN-1 + LN-D + XB-1

Active next after identity Acceptance:
  PILOT LIST NAMES（after ownership check）
  → decision-assessment-snapshot-pilot-facility-identity-next-gate.md

Creation GO: NOT GIVEN / NO-GO
List names: DEFERRED
This document does NOT start tenant mutation.
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Fixed next gate

```text
Next gate:
  FORMAL PILOT FACILITY IDENTITY / SITE NAMING

In scope:
  1. Pilot facility order
  2. facilityKey
  3. Site display name
  4. Site URL suffix
  5. naming ≠ creation GO

Out of scope / DEFERRED:
  List names（List 正本責務確認後）
  Site / List creation
  法人共通管理サイト命名
```

## 2. Accepted identity payload（LOCKED as INTENDED）

```text
Status: HUMAN-PROVIDED / INTENDED / NOT CREATED / NOT CONFIRMED
Source: decision-assessment-snapshot-pilot-facility-identity-acceptance.md

Pilot 1:
  Facility: 磯子活動ホーム
  facilityKey: isogo
  Site name: 強度行動障害支援 - 磯子活動ホーム
  Site URL:  https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo

Pilot 2:
  Facility: 本牧活動ホーム
  facilityKey: honmoku
  Site name: 強度行動障害支援 - 本牧活動ホーム
  Site URL:  https://isogokatudouhome.sharepoint.com/sites/severe-support-honmoku

Human Accept phrase（recorded）:
  「磯子=isogo / 本牧=honmoku、この Site 名・URL でいく」
```

## 3. Pilot site purpose（LOCKED by ORG-SITE-TOPOLOGY-1）

```text
Site purpose:
  パイロット事業所の強度行動障害支援アプリ用

Data boundary:
  この事業所のデータのみ

Not this site:
  法人共通管理サイト
  他事業所データ
```

## 4. Placeholder status（FORBIDDEN as creation target）

```text
NAMES-1 placeholders:
  Site URL:  https://isogokatudouhome.sharepoint.com/sites/XXXXX
  Site name: XXXXX
  Lists:     XXXXX / YYYYY
  Status:    HUMAN-PROVIDED / INTENDED / PLACEHOLDER
             ≠ REAL / CREATABLE / OBSERVED / CONFIRMED

Under PH-1:
  placeholder への Site / List 作成 = FORBIDDEN
```

## 5. Out of scope（unchanged）

```text
List names: DEFERRED
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

## 6. Explicit non-start

```text
This next-gate definition alone does NOT:
  invent formal List names
  create Site / List / columns
  perform tenant mutation
  mark SV-1 / LV-1 CONFIRMED
  treat Execution GO as Agent SharePoint mutation permission
  start Implementation / SharePoint code / Deploy

Identity / List names / Provision Exec are Accepted / LOCKED.
Actual creation is a separate Human process；Agent mutation remains FORBIDDEN.
```

## 7. Current state

```text
Decision-AS-ORG-SITE-TOPOLOGY-1: Accepted / LOCKED / OT-1 + FS-1 + SP-1 + PP-1 + PH-1 + XB-1
Decision-AS-PILOT-FACILITY-IDENTITY-1: Accepted / LOCKED / PO-1 + FK-1 + SN-1 + LN-D + XB-1
Decision-AS-PILOT-LIST-NAMES-1: Accepted / LOCKED / LN-1 + XB-1
  SupportPlans / AssessmentSnapshots
Decision-AS-PILOT-PROVISION-EXEC-1: Accepted / LOCKED / PX-1 + VR-1 + FG-1 + XB-1 + EG-1 + AP-1
Execution GO: GIVEN
AI SharePoint mutation: FORBIDDEN
Active next gate: SEPARATE HUMAN SITE/LIST CREATION + VR-1 EVIDENCE RETURN
  → decision-assessment-snapshot-pilot-provision-exec-next-gate.md
Site / List creation: AUTHORIZED for Human separate process / NOT CREATED / Agent NO-GO
Placeholder creation: FORBIDDEN
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Deploy / real data: NO-GO

Current stop:
  waiting for separate Human creation + VR-1 evidence return
  Agent auto-start: FORBIDDEN
```
