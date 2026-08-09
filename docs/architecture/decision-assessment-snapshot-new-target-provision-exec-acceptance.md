# Decision-AS-NEW-TARGET-PROVISION-EXEC-1 — provisioning execution Human Acceptance

この文書は、**Decision-AS-NEW-TARGET-PROVISION-EXEC-1**（新 SPFx 用 Site / List の
実作成 authorization）についての **Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-new-target-provision-exec-packet.md`](./decision-assessment-snapshot-new-target-provision-exec-packet.md)

Selected via:
[`decision-ilb-1-twenty-second-residual-new-spfx-provision-exec-selection.md`](./decision-ilb-1-twenty-second-residual-new-spfx-provision-exec-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-new-target-names-acceptance.md`](./decision-assessment-snapshot-new-target-names-acceptance.md)
（Decision-AS-NEW-TARGET-NAMES-1 = SU-1+LN-1+IN-1+XB-1）
[`decision-assessment-snapshot-new-target-provisioning-acceptance.md`](./decision-assessment-snapshot-new-target-provisioning-acceptance.md)
（Decision-AS-NEW-TARGET-PROVISION-1 = ST-1+LT-1+NM-1+EX-1）
[`decision-assessment-snapshot-target-reuse-acceptance.md`](./decision-assessment-snapshot-target-reuse-acceptance.md)
（Decision-AS-TARGET-REUSE-1 = B）
[`decision-assessment-snapshot-sp-placement-acceptance.md`](./decision-assessment-snapshot-sp-placement-acceptance.md)
（Decision-AS-SP-PLACEMENT-1 = SV-1+LV-1+CN-1+SC-1）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-NEW-TARGET-PROVISION-EXEC-1
Status: Accepted / LOCKED
Human Decision: PX-1 + VR-1 + FG-1 + XB-1
Human Acceptance: Explicit Human Decision on 2026-08-09

Baseline（PR #185 MERGED）:
  merge commit: 1aef0d3971165f6504f7f13d6e68a51d7cfdaf61
  status: MERGED

LOCKED:

Provisioning execution authorization:
  PX-1 — LOCKED 済み intended Site + Lists の作成を許可する
         ただし Site / List のみ。custom columns は作らない

Verification boundary:
  VR-1 — 作成後に実 tenant から Site URL / Site name / List name(s) を
         read-back し、intended と一致した場合のみ SV-1 / LV-1 を CONFIRMED とする

Failure boundary:
  FG-1 — access denied / name conflict / object already exists /
         ambiguous result / partial failure / evidence 不足時は
         fail-closed で停止。代替名の発明・上書き・blind retry をしない

Scope boundary:
  XB-1 — この authorization は Site + Lists の creation のみ
         custom column creation、permissions/config、Deploy、real data、
         Implementation Start、SharePoint application/adapter code は別 gate

Intended values（再 Decision しない / NAMES-1 LOCKED）:
  New Site URL:  https://isogokatudouhome.sharepoint.com/sites/XXXXX
  New Site name: XXXXX
  New List names: XXXXX / YYYYY
  Status: HUMAN-PROVIDED / INTENDED

Execution state:
  Site / List creation: AUTHORIZED / NOT STARTED
  tenant mutation（Site+List only）: AUTHORIZED / NOT STARTED
  Acceptance ≠ execution completed

Internal Column Names:
  OPEN（IN-1 — post-creation CN-1）
custom column creation:
  NO-GO（XB-1）
permissions / config:
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
  Decision-AS-NEW-TARGET-PROVISION-EXEC-1 authorization（PX/VR/FG/XB）
Does NOT close:
  actual Site / List creation completion
  SV-1 / LV-1 CONFIRMED（requires post-creation read-back）
  Internal Column Names / CN-1
  custom column creation
  permissions / config changes
  Implementation Start
  SharePoint / adapter / application 実装
  Schema / DTO コード割当
  FindingCode / A-5
  post-retention deletion
Implementation auto-start: FORBIDDEN
Site / List creation auto-start: FORBIDDEN
Custom column creation: FORBIDDEN
Name invention / overwrite / blind retry: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: PX-1 + VR-1 + FG-1 + XB-1
Decision-AS-NEW-TARGET-PROVISION-EXEC-1: Accepted / LOCKED

Provisioning execution:  PX-1
Verification boundary:   VR-1
Failure boundary:        FG-1
Scope boundary:          XB-1
```

日本語正本:

```text
PX-1:
  LOCKED 済み intended Site + Lists の作成を許可する。
  Site / List のみ。custom columns は作らない。
VR-1:
  作成後に実 tenant から read-back し、
  intended と一致した場合のみ SV-1 / LV-1 を CONFIRMED とする。
FG-1:
  conflict / partial failure / ambiguity / evidence 不足は fail-closed。
  代替名発明・上書き・blind retry をしない。
XB-1:
  本 authorization は Site + Lists creation のみ。
  columns / permissions / Deploy / implementation は別 gate。
```

```text
Agent recommendation（PX-1 + VR-1 + FG-1 + XB-1）:
  NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-AS-NEW-TARGET-PROVISION-EXEC-1: Accepted / LOCKED

Provisioning execution:  PX-1
Verification boundary:   VR-1
Failure boundary:        FG-1
Scope boundary:          XB-1

NOT SELECTED:
  PX-HOLD
  VR-HOLD
  FG-HOLD
  XB-HOLD
```

### Execution state（Acceptance 時点）

```text
Site / List creation: AUTHORIZED / NOT STARTED
tenant mutation（Site+List only）: AUTHORIZED / NOT STARTED
SV-1 / LV-1: NOT CONFIRMED（read-back pending）
Internal Names: OPEN（IN-1）
custom columns / permissions / config: NO-GO
Implementation Start: HOLD
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-NEW-TARGET-PROVISION-EXEC-1 Accepted = Site / List 作成完了
  Decision-AS-NEW-TARGET-PROVISION-EXEC-1 Accepted = SV-1 / LV-1 CONFIRMED
  Decision-AS-NEW-TARGET-PROVISION-EXEC-1 Accepted = Internal Names CONFIRMED
  Decision-AS-NEW-TARGET-PROVISION-EXEC-1 Accepted = custom column creation GO
  Decision-AS-NEW-TARGET-PROVISION-EXEC-1 Accepted = Implementation Start
  Decision-AS-NEW-TARGET-PROVISION-EXEC-1 Accepted = SharePoint / adapter コード開始
  Decision-AS-NEW-TARGET-PROVISION-EXEC-1 Accepted = Schema / DTO コード割当
  Decision-AS-NEW-TARGET-PROVISION-EXEC-1 Accepted = Deploy / real data GO
  Decision-AS-NEW-TARGET-PROVISION-EXEC-1 Accepted = FindingCode / A-5 再開
  Decision-AS-NEW-TARGET-PROVISION-EXEC-1 Accepted = post-retention 開始
```

## Acceptance boundary

```text
This Acceptance authorizes Site + Lists creation only under PX-1 + VR-1 + FG-1 + XB-1.

MUST NOT start from this Acceptance alone:
  auto-running tenant mutation without an explicit execution step
  inventing alternate Site / List names on conflict
  creating custom columns
  confirming SV-1 / LV-1 without read-back
  inventing Internal Names
  permissions / config / Entra / M365 changes beyond exact Site+List creation
  TypeScript / application / adapter / DTO code
  Schema / DTO code assignment
  FindingCode / A-5
  post-retention deletion
  Implementation Start
  Deploy / real data
```

## Next

```text
Decision-AS-NEW-TARGET-PROVISION-EXEC-1: Accepted / LOCKED / PX-1 + VR-1 + FG-1 + XB-1
Next gate: FIXED
  EXPLICIT SITE/LIST CREATION EXECUTION + VR-1 READ-BACK
  → decision-assessment-snapshot-new-target-provision-exec-next-gate.md
Execution GO: NOT GIVEN / NOT STARTED
Site / List creation: AUTHORIZED / NOT STARTED
Current stop: waiting for explicit execution GO（auto-start FORBIDDEN）

After explicit GO only:
  1. Site/List 作成実行（intended LOCKED values only）
  2. VR-1 read-back（Site URL / Site name / List names）
  3. intended 一致時のみ SV-1 / LV-1 = CONFIRMED
  4. STOP
fail-closed STOP:
  access denied / name conflict / already exists /
  ambiguous result / partial failure / evidence不足
  → 代替名発明 / overwrite / blind retry FORBIDDEN

SV-1 / LV-1: NOT CONFIRMED
Internal Column Names: OPEN（IN-1 — post-creation CN-1）
custom columns / permissions / config: NO-GO
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Deploy / real data: NO-GO
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```
