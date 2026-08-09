# Decision-AS-TARGET-REUSE-1 — new SPFx deployment target reuse Human Acceptance

この文書は、**Decision-AS-TARGET-REUSE-1**（新 SPFx deployment target の
reuse / separate-target 選定）についての **Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-target-reuse-packet.md`](./decision-assessment-snapshot-target-reuse-packet.md)

Selected via:
[`decision-ilb-1-nineteenth-residual-target-reuse-selection.md`](./decision-ilb-1-nineteenth-residual-target-reuse-selection.md)

Evidence（EXISTING-APP only）:
[`tenant-confirmation-daily-activity-records-required-fields-evidence.md`](./tenant-confirmation-daily-activity-records-required-fields-evidence.md)

Independent Review:
[`decision-assessment-snapshot-pr-181-independent-review.md`](./decision-assessment-snapshot-pr-181-independent-review.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-TARGET-REUSE-1
Status: Accepted / LOCKED
Human Decision: B
Human Acceptance: Explicit Human Decision on 2026-08-09

LOCKED:

Option B:
  既存 /sites/welfare + DailyActivityRecords は reference evidence のみ。
  新 SPFx 用 Site / List は別途用意する。
  既存環境を新 SPFx deployment target として再利用しない。

Observed existing environment:
  OBSERVED / CONFIRMED AS EXISTING-APP EVIDENCE / REFERENCE ONLY
  Site = /sites/welfare
  List = DailyActivityRecords
  List ID = 70ce9940-a50e-4a52-a3cf-97e2c83b2240
  Required 5 =
    UserCode / RecordDate / TimeSlot / Observation / Behavior

New SPFx deployment target:
  NOT SELECTED / NOT CREATED / HOLD

Reuse existing /sites/welfare for new SPFx:
  NOT ADOPTED（B）

Value Acceptance for /sites/welfare as new-SPFx target:
  NOT APPLICABLE

Tenant confirmation execution: IN PROGRESS / READ-ONLY
Mutation: NONE
Implementation Start: HOLD
SharePoint implementation: DO NOT START
tenant changes / List / column creation: NO-GO
Schema / DTO code: HOLD / NOT STARTED
Deploy / real data: NO-GO
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN

Closes only:
  Decision-AS-TARGET-REUSE-1（A/B/HOLD のうち B）
Does NOT close:
  new SPFx Site / List 具体値
  new SPFx Site / List 作成
  Value Acceptance of existing welfare env as new-SPFx target
  Implementation Start
  SharePoint / adapter / application 実装
  Schema / DTO コード割当
  FindingCode / A-5
  post-retention deletion
Implementation auto-start: FORBIDDEN
Site / List creation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: B
Decision-AS-TARGET-REUSE-1: Accepted / LOCKED

B:
  既存環境は reference evidence のみ。
  新 SPFx 用 Site / List は別途用意する。
```

日本語正本:

```text
B:
  /sites/welfare + DailyActivityRecords は、
  現在運用中アプリ環境の一次 evidence（reference）としてのみ扱う。
  新 SPFx の deployment target としては採用しない。
  新 SPFx 用 Site / List は未作成のまま HOLD とし、別途用意する。
```

```text
Agent recommendation（HOLD）:
  NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-AS-TARGET-REUSE-1: Accepted / LOCKED
Human Selected: B

NOT SELECTED:
  A — reuse existing /sites/welfare + DailyActivityRecords as new SPFx target
  HOLD — defer decision
```

固定結果:

```text
Observed existing environment:
  OBSERVED / CONFIRMED AS EXISTING-APP EVIDENCE / REFERENCE ONLY

New SPFx deployment target:
  NOT SELECTED / NOT CREATED / HOLD

Reuse existing /sites/welfare for new SPFx:
  NOT ADOPTED

Value Acceptance for /sites/welfare as new-SPFx target:
  NOT APPLICABLE
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-TARGET-REUSE-1 B = new SPFx Site / List 作成 GO
  Decision-AS-TARGET-REUSE-1 B = /sites/welfare を新 SPFx 環境値として Accept
  Decision-AS-TARGET-REUSE-1 B = Implementation Start
  Decision-AS-TARGET-REUSE-1 B = SharePoint / adapter コード開始
  Decision-AS-TARGET-REUSE-1 B = Schema / DTO コード割当
  Decision-AS-TARGET-REUSE-1 B = tenant changes / List・列作成 GO
  Decision-AS-TARGET-REUSE-1 B = Deploy / real data GO
  Decision-AS-TARGET-REUSE-1 B = FindingCode / A-5 再開
  Decision-AS-TARGET-REUSE-1 B = post-retention 開始
```

## Acceptance boundary

```text
This Acceptance locks separate-target policy only（Option B）.

MAY keep:
  existing-app evidence as reference for schema/shape comparison

MUST NOT start from this Acceptance alone:
  creating new SPFx Site / List / columns
  Accepting /sites/welfare as new SPFx deployment configuration
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
Decision-AS-TARGET-REUSE-1: Accepted / LOCKED / B
Observed existing environment: REFERENCE ONLY
New SPFx deployment target: NOT SELECTED / NOT CREATED / HOLD
Value Acceptance for /sites/welfare as new-SPFx target: NOT APPLICABLE
Tenant confirmation execution: IN PROGRESS / READ-ONLY
Implementation Start: HOLD
SharePoint implementation: DO NOT START
tenant changes / List / column creation: NO-GO
Schema / DTO: HOLD
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
Next substantive unit: NOT SELECTED by this Acceptance
Ready: NOT RUN
Merge: NOT RUN
```
