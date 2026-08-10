# Decision-AS-PILOT-PROVISION-EXEC-1 — pilot Site/List creation execution Human Acceptance

この文書は、**Decision-AS-PILOT-PROVISION-EXEC-1**（パイロット Site / List の
作成 authorization と Explicit Execution GO）についての
**Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-pilot-provision-exec-packet.md`](./decision-assessment-snapshot-pilot-provision-exec-packet.md)

Selected via:
[`decision-ilb-1-twenty-seventh-residual-pilot-provision-exec-selection.md`](./decision-ilb-1-twenty-seventh-residual-pilot-provision-exec-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-pilot-list-names-acceptance.md`](./decision-assessment-snapshot-pilot-list-names-acceptance.md)
[`decision-assessment-snapshot-pilot-list-ownership-acceptance.md`](./decision-assessment-snapshot-pilot-list-ownership-acceptance.md)
[`decision-assessment-snapshot-pilot-facility-identity-acceptance.md`](./decision-assessment-snapshot-pilot-facility-identity-acceptance.md)
[`../decisions/DEC-AI-ORG-003.md`](../decisions/DEC-AI-ORG-003.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-PILOT-PROVISION-EXEC-1
Status: Accepted / LOCKED
Human Decision: PX-1 + VR-1 + FG-1 + XB-1 + EG-1 + AP-1
Human Acceptance: Explicit Human Decision on 2026-08-10
Human Accept phrase:
  「Site/List creation Execution GO」

LOCKED:

Provisioning execution authorization:
  PX-1 — LOCKED INTENDED Site + Lists の作成を許可する
         Site / List のみ。custom columns は作らない

Verification boundary:
  VR-1 — 作成後に実 tenant から Site URL / Site name / List name(s) を
         read-back し、intended と一致した場合のみ SV-1 / LV-1 を CONFIRMED とする

Failure boundary:
  FG-1 — access denied / name conflict / already exists /
         ambiguous result / partial failure / evidence 不足時は
         fail-closed で停止。代替名発明・上書き・blind retry 禁止

Scope boundary:
  XB-1 — Site + Lists creation only
         columns / permissions / Deploy / Implementation Start / adapter code は別

Execution GO:
  EG-1 — Explicit Execution GO = GIVEN（2026-08-10）

AI procedure boundary（DEC-AI-ORG-003）:
  AP-1 — SharePoint 本番変更は本 AI foundation 手順では禁止
         実作成・tenant mutation は別 Human process で行う
         Agent はこの GO をもっても tenant を変更しない

Intended targets（再 Decision しない）:

  Pilot 1 Site:
    name: 強度行動障害支援 - 磯子活動ホーム
    URL:  https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo

  Pilot 2 Site:
    name: 強度行動障害支援 - 本牧活動ホーム
    URL:  https://isogokatudouhome.sharepoint.com/sites/severe-support-honmoku

  Lists on each facility Site:
    SupportPlans
      → SupportPlan 正本 + SupportPlanVersion 同居
    AssessmentSnapshots
      → AssessmentSnapshot 正本

  Status now:
    Site / List creation: COMPLETED
    SV-1 / LV-1: CONFIRMED（VR-1 PASS）
    Internal Column Names: OPEN / NOT OBSERVED
  Evidence:
    decision-assessment-snapshot-pilot-provision-vr1-evidence.md

Execution state:
  Execution GO: GIVEN
  AI SharePoint mutation: FORBIDDEN（DEC-AI-ORG-003 / AP-1）
  Separate Human process creation: COMPLETED（Site + List only）
  Intent = Observed / Mismatch = 0
  Site count = 2 / 2
  List count = 4 / 4
  SV-1: CONFIRMED
  LV-1: CONFIRMED
  VR-1: PASS
  Agent environment credentials: NONE（NO_SP_ENV）

Internal Column Names:
  OPEN（CN-1 — not observed in VR-1 screenshots）
custom column creation:
  NO-GO（XB-1）
permissions / config:
  NO-GO
Implementation Start:
  HOLD
SharePoint implementation:
  DO NOT START
Deploy / real data:
  NO-GO
FindingCode / A-5:
  HOLD
Post-retention deletion:
  OPEN / AUTO-START FORBIDDEN

Closes only:
  Decision-AS-PILOT-PROVISION-EXEC-1（PX/VR/FG/XB/EG/AP）
  Explicit Execution GO = GIVEN
  Site / List existence confirmation under VR-1（SV-1 / LV-1）
Does NOT close:
  Internal Column Names / CN-1
  custom columns / permissions
  Implementation Start
  SharePoint / adapter / application 実装
  AI-performed tenant mutation（forbidden）
AI Site/List creation auto-start: FORBIDDEN
Name invention / overwrite / blind retry: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: PX-1 + VR-1 + FG-1 + XB-1 + EG-1 + AP-1
Decision-AS-PILOT-PROVISION-EXEC-1: Accepted / LOCKED

Provisioning execution:  PX-1
Verification boundary:   VR-1
Failure boundary:        FG-1
Scope boundary:          XB-1
Execution GO:            EG-1 = GIVEN
AI procedure boundary:   AP-1 = FORBIDDEN for Agent mutation

Human Accept phrase:
  「Site/List creation Execution GO」
```

日本語正本:

```text
PX-1:
  LOCKED INTENDED の Site + Lists 作成を許可する（Site/List のみ）。
VR-1:
  作成後 read-back 一致時のみ SV-1 / LV-1 を CONFIRMED とする。
FG-1:
  失敗時は fail-closed。代替名発明・上書き・blind retry しない。
XB-1:
  対象は Site + Lists のみ。
EG-1:
  Explicit Execution GO は付与された。
AP-1:
  それでも AI foundation 手順での SharePoint 本番変更は禁止。
  実作成は別 Human process。
```

```text
Agent recommendation:
  NOT Human Acceptance evidence by itself
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-AS-PILOT-PROVISION-EXEC-1: Accepted / LOCKED

NOT SELECTED:
  PX-HOLD
  VR-HOLD
  FG-HOLD
  XB-HOLD
  EG-2 / EG-HOLD
  AP-2
```

### Intended creation payload（AUTHORIZED for separate Human process）

```text
Sites:
  https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo
    display: 強度行動障害支援 - 磯子活動ホーム
  https://isogokatudouhome.sharepoint.com/sites/severe-support-honmoku
    display: 強度行動障害支援 - 本牧活動ホーム

Lists（each facility Site）:
  SupportPlans
  AssessmentSnapshots

NOT created by this Acceptance / this Agent.
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Execution GO = Agent が SharePoint を変更してよい
  Execution GO = SV-1 / LV-1 CONFIRMED
  Execution GO = Implementation Start
  Execution GO = custom columns / permissions / Deploy
  DEC-AI-ORG-003 禁止の解除
```

## Acceptance boundary

```text
This Acceptance locks:
  creation authorization for LOCKED INTENDED targets
  Explicit Execution GO = GIVEN
  AI mutation remains FORBIDDEN under DEC-AI-ORG-003

MUST NOT be done by AI foundation procedure:
  Site / List / column creation in tenant
  Microsoft 365 / Entra changes
  treating INTENDED as CREATED without VR-1 evidence
```

## Separate Human process（creation — COMPLETED）

```text
Outside this AI foundation procedure, Human/admin completed:

  1. Create Pilot 1 Site（severe-support-isogo） — DONE
  2. Create Lists SupportPlans / AssessmentSnapshots on that Site — DONE
  3. Create Pilot 2 Site（severe-support-honmoku） — DONE
  4. Create the same Lists on Pilot 2 — DONE
  5. Read-back evidence → repo VR-1 / SV-1 / LV-1 update — DONE
     → decision-assessment-snapshot-pilot-provision-vr1-evidence.md

FG-1 fail-closed: not triggered（Mismatch = 0）
```

## Next

```text
Decision-AS-PILOT-PROVISION-EXEC-1: Accepted / LOCKED
  / PX-1 + VR-1 + FG-1 + XB-1 + EG-1 + AP-1
Execution GO: GIVEN
AI SharePoint mutation: FORBIDDEN
Separate Human creation: COMPLETED（Site + List only）
Intent = Observed / Mismatch = 0
Site count = 2 / 2
List count = 4 / 4
SV-1: CONFIRMED
LV-1: CONFIRMED
VR-1: PASS
CN-1: OPEN
Independent Review #187: PASS（P0=0 / P1=0 / P2=0）
  → decision-assessment-snapshot-pr-187-independent-review.md
Next gate: FIXED
  Ready gate（Human）
  → decision-assessment-snapshot-pilot-provision-exec-next-gate.md
  evidence: decision-assessment-snapshot-pilot-provision-vr1-evidence.md
Implementation Start: HOLD
SharePoint application/adapter code: DO NOT START
Deploy / real data: NO-GO
```
