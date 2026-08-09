# Decision-AS-NEW-TARGET-PROVISION-1 — new SPFx target provisioning Human Acceptance

この文書は、**Decision-AS-NEW-TARGET-PROVISION-1**（新 SPFx 用 Site / List の
provisioning topology）についての **Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-new-target-provisioning-packet.md`](./decision-assessment-snapshot-new-target-provisioning-packet.md)

Selected via:
[`decision-ilb-1-twentieth-residual-new-spfx-target-provisioning-selection.md`](./decision-ilb-1-twentieth-residual-new-spfx-target-provisioning-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-target-reuse-acceptance.md`](./decision-assessment-snapshot-target-reuse-acceptance.md)
（Decision-AS-TARGET-REUSE-1 = B）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-NEW-TARGET-PROVISION-1
Status: Accepted / LOCKED
Human Decision: ST-1 + LT-1 + NM-1 + EX-1
Human Acceptance: Explicit Human Decision on 2026-08-09

LOCKED:

Site topology:
  ST-1 — 新 SPFx 専用の新 SharePoint Site を用意する

List topology:
  LT-1 — 新 SPFx 専用 Site 内に、新 SPFx 専用 Lists を用意する

Naming / value boundary:
  NM-1 — 本 Decision では Site URL / Site name / List names / Internal Names を
         発明・固定しない。具体値は別 Human Decision

Execution boundary:
  EX-1 — topology Acceptance ≠ Site/List creation GO
         実際の tenant mutation / provisioning は別 Human gate

Existing environment:
  /sites/welfare + DailyActivityRecords = REFERENCE ONLY（TARGET-REUSE-1/B）
  Reuse existing /sites/welfare = NOT ADOPTED

Concrete values（本 Acceptance では埋めない）:
  New Site URL / name: NOT SELECTED / OPEN
  New List names: NOT SELECTED / OPEN
  Internal Column Names: NOT SELECTED / OPEN

Provisioning execution:
  NOT STARTED / NO-GO（EX-1）

New SPFx deployment target:
  TOPOLOGY LOCKED（ST-1 + LT-1）/ NOT CREATED / HOLD

Implementation Start:
  HOLD
SharePoint implementation:
  DO NOT START
tenant changes / Site / List / column creation:
  NO-GO
Schema / DTO code:
  HOLD / NOT STARTED
Deploy / real data:
  NO-GO
FindingCode / A-5:
  HOLD
Post-retention deletion:
  OPEN / AUTO-START FORBIDDEN

Closes only:
  Decision-AS-NEW-TARGET-PROVISION-1 provisioning topology（ST/LT/NM/EX）
Does NOT close:
  concrete Site URL / Site name / List names / Internal Names
  Site / List / column creation
  tenant mutation
  Implementation Start
  SharePoint / adapter / application 実装
  Schema / DTO コード割当
  FindingCode / A-5
  post-retention deletion
Implementation auto-start: FORBIDDEN
Site / List creation auto-start: FORBIDDEN
Concrete name invention: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: ST-1 + LT-1 + NM-1 + EX-1
Decision-AS-NEW-TARGET-PROVISION-1: Accepted / LOCKED

Site topology:            ST-1
List topology:            LT-1
Naming / value boundary:  NM-1
Execution boundary:       EX-1
```

日本語正本:

```text
ST-1:
  新 SPFx 専用の新 SharePoint Site を用意する。
LT-1:
  その専用 Site 内に、新 SPFx 専用 Lists を用意する。
NM-1:
  Site URL / Site name / List names / Internal Names は本 Decision で発明・固定しない。
EX-1:
  topology Acceptance だけでは Site / List を作成しない。
  実 provisioning / tenant mutation は別 Human gate。
```

```text
Agent recommendation（ST-1 + LT-1 + NM-1 + EX-1）:
  NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-AS-NEW-TARGET-PROVISION-1: Accepted / LOCKED

Site topology:            ST-1
List topology:            LT-1
Naming / value boundary:  NM-1
Execution boundary:       EX-1

NOT SELECTED:
  ST-2 / ST-HOLD
  LT-2 / LT-HOLD
  NM-2 / NM-HOLD
  EX-2 / EX-HOLD
```

具体値・作成（LOCKED として埋めない / 開始しない）:

```text
New Site URL / name: NOT SELECTED / OPEN
New List names: NOT SELECTED / OPEN
Internal Column Names: NOT SELECTED / OPEN
Site / List creation: NO-GO
Provisioning execution: NOT STARTED
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-NEW-TARGET-PROVISION-1 Accepted = Site URL / List name 確定
  Decision-AS-NEW-TARGET-PROVISION-1 Accepted = Site / List 作成 GO
  Decision-AS-NEW-TARGET-PROVISION-1 Accepted = tenant mutation GO
  Decision-AS-NEW-TARGET-PROVISION-1 Accepted = Implementation Start
  Decision-AS-NEW-TARGET-PROVISION-1 Accepted = SharePoint / adapter コード開始
  Decision-AS-NEW-TARGET-PROVISION-1 Accepted = Schema / DTO コード割当
  Decision-AS-NEW-TARGET-PROVISION-1 Accepted = /sites/welfare Value Acceptance
  Decision-AS-NEW-TARGET-PROVISION-1 Accepted = FindingCode / A-5 再開
  Decision-AS-NEW-TARGET-PROVISION-1 Accepted = post-retention 開始
```

## Acceptance boundary

```text
This Acceptance locks dedicated-new-Site + dedicated-new-Lists topology only.

MUST NOT start from this Acceptance alone:
  inventing Site URL / Site name / List names / Internal Names
  creating Site / List / columns
  tenant / SharePoint / Entra / M365 changes
  TypeScript / application / adapter / DTO code
  Schema / DTO code assignment
  FindingCode / A-5
  post-retention deletion
  Implementation Start
  Deploy / real data
```

## Next

```text
Decision-AS-NEW-TARGET-PROVISION-1: Accepted / LOCKED / ST-1 + LT-1 + NM-1 + EX-1
New SPFx deployment target: TOPOLOGY LOCKED / NOT CREATED / HOLD
Concrete Site / List / Internal Names: NOT SELECTED / OPEN
Site / List creation: NO-GO
Implementation Start: HOLD
SharePoint implementation: DO NOT START
tenant changes: NO-GO
Schema / DTO: HOLD
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
Next substantive unit: NOT SELECTED by this Acceptance
Human Ready Decision: A — Ready 化（Explicit Human Ready on 2026-08-09；PR #184）
Merge: NOT RUN
```
