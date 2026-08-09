# Decision-AS-PILOT-FACILITY-IDENTITY-1 — formal pilot facility identity / Site naming Human Acceptance

この文書は、**Decision-AS-PILOT-FACILITY-IDENTITY-1**（パイロット事業所の
identity と Site 命名）についての **Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-pilot-facility-identity-packet.md`](./decision-assessment-snapshot-pilot-facility-identity-packet.md)

Selected via:
[`decision-ilb-1-twenty-fourth-residual-pilot-facility-identity-selection.md`](./decision-ilb-1-twenty-fourth-residual-pilot-facility-identity-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-org-site-topology-acceptance.md`](./decision-assessment-snapshot-org-site-topology-acceptance.md)
（Decision-AS-ORG-SITE-TOPOLOGY-1 = OT-1+FS-1+SP-1+PP-1+PH-1+XB-1）
[`decision-assessment-snapshot-new-target-names-acceptance.md`](./decision-assessment-snapshot-new-target-names-acceptance.md)
（Decision-AS-NEW-TARGET-NAMES-1 = SU-1+LN-1+IN-1+XB-1；XXXXX/YYYYY = PLACEHOLDER）
[`decision-assessment-snapshot-new-target-provisioning-acceptance.md`](./decision-assessment-snapshot-new-target-provisioning-acceptance.md)
（Decision-AS-NEW-TARGET-PROVISION-1 = ST-1+LT-1+NM-1+EX-1）
[`decision-assessment-snapshot-target-reuse-acceptance.md`](./decision-assessment-snapshot-target-reuse-acceptance.md)
（Decision-AS-TARGET-REUSE-1 = B）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-PILOT-FACILITY-IDENTITY-1
Status: Accepted / LOCKED
Human Decision: PO-1 + FK-1 + SN-1 + LN-D + XB-1
Human Acceptance: Explicit Human Decision on 2026-08-09
Human Accept phrase:
  「磯子=isogo / 本牧=honmoku、この Site 名・URL でいく」

Baseline（PR #185 MERGED）:
  merge commit: 1aef0d3971165f6504f7f13d6e68a51d7cfdaf61
  status: MERGED

LOCKED（axes）:

Pilot facility order:
  PO-1 — Pilot 1 = 磯子活動ホーム / Pilot 2 = 本牧活動ホーム

facilityKey:
  FK-1 — 磯子活動ホーム → isogo / 本牧活動ホーム → honmoku

Site naming:
  SN-1 — display name = 強度行動障害支援 - {事業所名}
         URL = /sites/severe-support-{facilityKey}

List names:
  LN-D — 本 Decision 対象外。List 正本責務確認後に別 Human Decision

Execution boundary:
  XB-1 — identity / Site naming Acceptance ≠ Site/List creation GO

LOCKED（Human-provided naming payload）:

  Pilot 1:
    Facility:           磯子活動ホーム
    facilityKey:        isogo
    Site display name:  強度行動障害支援 - 磯子活動ホーム
    Site URL:           https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo
    Site URL suffix:    /sites/severe-support-isogo
    Status: HUMAN-PROVIDED / INTENDED / NOT CREATED / NOT CONFIRMED

  Pilot 2:
    Facility:           本牧活動ホーム
    facilityKey:        honmoku
    Site display name:  強度行動障害支援 - 本牧活動ホーム
    Site URL:           https://isogokatudouhome.sharepoint.com/sites/severe-support-honmoku
    Site URL suffix:    /sites/severe-support-honmoku
    Status: HUMAN-PROVIDED / INTENDED / NOT CREATED / NOT CONFIRMED

Supersedes as creatable target:
  NAMES-1 placeholders XXXXX / YYYYY = PLACEHOLDER / SUPERSEDED FOR CREATION
  （axes of NAMES-1 remain；placeholder strings are not creatable targets）

List names:
  DEFERRED / NOT SELECTED
Common management Site name:
  NOT SELECTED / OPEN

Site / List / column creation:
  NO-GO（XB-1）
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
  Decision-AS-PILOT-FACILITY-IDENTITY-1（PO/FK/SN/LN-D/XB）
  Human-provided pilot facilityKeys + Site display names / URLs
Does NOT close:
  List names
  live SV-1 / LV-1 confirmation
  Site / List / column creation
  tenant mutation
  Implementation Start
  SharePoint / adapter / application 実装
  Schema / DTO コード割当
  FindingCode / A-5
  post-retention deletion
  法人共通管理サイト命名
Implementation auto-start: FORBIDDEN
Site / List creation auto-start: FORBIDDEN
List name invention: FORBIDDEN
Treating INTENDED as OBSERVED / CONFIRMED / CREATED: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: PO-1 + FK-1 + SN-1 + LN-D + XB-1
Decision-AS-PILOT-FACILITY-IDENTITY-1: Accepted / LOCKED

Pilot facility order:  PO-1
facilityKey:           FK-1
Site naming:           SN-1
List names:            LN-D（DEFERRED）
Execution boundary:    XB-1

Human Accept phrase:
  「磯子=isogo / 本牧=honmoku、この Site 名・URL でいく」
```

日本語正本:

```text
PO-1:
  第1パイロット = 磯子活動ホーム
  第2パイロット = 本牧活動ホーム
FK-1:
  磯子活動ホーム = isogo
  本牧活動ホーム = honmoku
SN-1:
  Site 表示名は日本語、URL は英小文字の severe-support-{facilityKey}
LN-D:
  List names は本 Decision で決めない
XB-1:
  naming Acceptance だけでは Site / List を作成しない
```

```text
Agent recommendation（PO-1 + FK-1 + SN-1 + LN-D + XB-1）:
  NOT Human Acceptance evidence by itself
This document records the Human Decision only.
Human Accept phrase and payload are recorded verbatim.
```

## Accepted 内容

```text
Decision-AS-PILOT-FACILITY-IDENTITY-1: Accepted / LOCKED

Pilot facility order:  PO-1
facilityKey:           FK-1
Site naming:           SN-1
List names:            LN-D
Execution boundary:    XB-1

NOT SELECTED:
  PO-HOLD
  FK-2 / FK-HOLD
  SN-2 / SN-HOLD
  LN-1
  XB-2 / XB-HOLD
```

### LOCKED naming payload

```text
Pilot 1:
  Facility:           磯子活動ホーム
  facilityKey:        isogo
  Site display name:  強度行動障害支援 - 磯子活動ホーム
  Site URL:           https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo
  = HUMAN-PROVIDED / INTENDED
  ≠ OBSERVED / CONFIRMED / CREATED

Pilot 2:
  Facility:           本牧活動ホーム
  facilityKey:        honmoku
  Site display name:  強度行動障害支援 - 本牧活動ホーム
  Site URL:           https://isogokatudouhome.sharepoint.com/sites/severe-support-honmoku
  = HUMAN-PROVIDED / INTENDED
  ≠ OBSERVED / CONFIRMED / CREATED

List names: DEFERRED
Site / List creation: NO-GO（XB-1）
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-PILOT-FACILITY-IDENTITY-1 Accepted = Site / List 作成 GO
  Decision-AS-PILOT-FACILITY-IDENTITY-1 Accepted = List names 確定
  Decision-AS-PILOT-FACILITY-IDENTITY-1 Accepted = SV-1 / LV-1 CONFIRMED
  Decision-AS-PILOT-FACILITY-IDENTITY-1 Accepted = tenant mutation GO
  Decision-AS-PILOT-FACILITY-IDENTITY-1 Accepted = Implementation Start
  Decision-AS-PILOT-FACILITY-IDENTITY-1 Accepted = SharePoint / adapter コード開始
  Decision-AS-PILOT-FACILITY-IDENTITY-1 Accepted = Schema / DTO コード割当
  Decision-AS-PILOT-FACILITY-IDENTITY-1 Accepted = FindingCode / A-5 再開
  Decision-AS-PILOT-FACILITY-IDENTITY-1 Accepted = post-retention 開始
  HUMAN-PROVIDED / INTENDED = OBSERVED / CONFIRMED / CREATED
  XXXXX / YYYYY = 作成対象として復活
```

## Acceptance boundary

```text
This Acceptance locks pilot facility order, facilityKeys, and Site names/URLs.

MUST NOT start from this Acceptance alone:
  inventing List names
  inventing different facilityKey / Site URL / Site name
  treating INTENDED values as live OBSERVED / CONFIRMED
  creating Site / List / columns
  tenant / SharePoint / Entra / M365 changes
  TypeScript / application / adapter / DTO code
  Schema / DTO code assignment
  FindingCode / A-5
  post-retention deletion
  Implementation Start
  Deploy / real data
```

## Relation to NAMES-1 placeholders

```text
NAMES-1 axes remain Accepted / LOCKED（SU-1 + LN-1 + IN-1 + XB-1）.
NAMES-1 strings XXXXX / YYYYY remain PLACEHOLDER / NOT CREATABLE.

Creatable Site naming target for pilots is now this Acceptance payload:
  /sites/severe-support-isogo
  /sites/severe-support-honmoku

Creation itself remains NO-GO until a separate Human execution gate.
```

## Next

```text
Decision-AS-PILOT-FACILITY-IDENTITY-1: Accepted / LOCKED / PO-1 + FK-1 + SN-1 + LN-D + XB-1
LOCKED payload:
  磯子=isogo → /sites/severe-support-isogo
  本牧=honmoku → /sites/severe-support-honmoku
Decision-AS-PILOT-LIST-OWNERSHIP-1: Accepted / LOCKED / LO-1 + VP-1 + EX-1 + NB-1 + XB-1
  → decision-assessment-snapshot-pilot-list-ownership-acceptance.md
  List A = SupportPlan + SupportPlanVersion
  List B = AssessmentSnapshot
Next gate: FIXED
  PILOT LIST NAMES
  → decision-assessment-snapshot-pilot-list-names-next-gate.md
List names: DEFERRED / NOT SELECTED
Site / List creation: NO-GO（XB-1）
Placeholder creation: FORBIDDEN
Implementation Start: HOLD
SharePoint implementation: DO NOT START
tenant changes: NO-GO
Schema / DTO: HOLD
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```
