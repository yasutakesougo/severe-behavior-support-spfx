# Decision-ILB-1 — Nineteenth residual selection

この文書は、Eighteenth residual（Decision-AS-TENANT-CONFIRM-EXEC-1 Accepted / LOCKED）後、
DailyActivityRecords 必須列の一次 evidence（既存アプリ環境）が揃った時点の
次 substantive unit を記録する Human Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_NINETEENTH_RESIDUAL_SELECTION
Status: SELECTED
Selected unit: New SPFx deployment target reuse Decision
Follow-up Decision ID: Decision-AS-TARGET-REUSE-1

Basis:
  Decision-AS-TENANT-CONFIRM-1: Accepted / LOCKED / RO-1+EV-1+RB-1+XG-1
  Decision-AS-TENANT-CONFIRM-EXEC-1: Accepted / LOCKED / ES-1+TB-1+EO-1+FG-1
  Evidence:
    tenant-confirmation-daily-activity-records-required-fields-evidence.md
    Status: OBSERVED / CONFIRMED AS EXISTING-APP EVIDENCE

Independent Review（PR #181）:
  HOLD / P0=0 / P1=1 / P2=0
  F-001: Value Acceptance を reuse Decision より先に開いていた

Tenant confirmation execution: IN PROGRESS / READ-ONLY
Observed existing environment: OBSERVED / CONFIRMED AS EXISTING-APP EVIDENCE
New SPFx deployment target: NOT SELECTED / NOT CREATED / HOLD
Reuse existing /sites/welfare for new SPFx: NOT DECIDED
Mutation: NONE
tenant changes / List / column creation: NO-GO
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Schema / DTO code: HOLD / NOT STARTED
Deploy / real data mutation: NO-GO
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```

## Selection meaning

この Selection は、次の Human Decision を
**既存 `/sites/welfare` + `DailyActivityRecords` を新 SPFx の deployment target として
再利用するか／reference evidence のみとするか**に限定する。

```text
SELECTED:
  Decision-AS-TARGET-REUSE-1

Evidence already recorded（EXISTING-APP only / NOT new-SPFx Acceptance）:
  Site = /sites/welfare
  List = DailyActivityRecords
  List ID = 70ce9940-a50e-4a52-a3cf-97e2c83b2240
  Required Internal Names =
    UserCode / RecordDate / TimeSlot / Observation / Behavior

NOT SELECTED / NOT AUTHORIZED by this selection:
  new SPFx Value Acceptance
  treating EXISTING-APP OBSERVED as new SPFx env values
  Site / List creation
  tenant changes
  Implementation Start
  SharePoint / adapter / application implementation
  Schema / DTO code assignment
  Deploy / real data mutation
  FindingCode / A-5
  post-retention deletion
```

## Revision note（F-001）

```text
Superseded framing:
  Decision-AS-TENANT-CONFIRM-VALUES-1
  （observed values → new SPFx deployment configuration Acceptance）

Reason:
  /sites/welfare は現行運用アプリ環境の一次 evidence であり、
  新 SPFx 用 Site は未作成。reuse 判断なしに Value Acceptance へ進めるのは不安全。
```

## Next

`decision-assessment-snapshot-target-reuse-packet.md` の A / B / HOLD を Human が判定する。
TARGET-REUSE 決定まで、新 SPFx Value Acceptance は開かない。
