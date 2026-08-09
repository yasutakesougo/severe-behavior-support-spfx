# Decision-AS-TARGET-REUSE-1 — new SPFx deployment target reuse

この文書は、既存運用環境（`/sites/welfare` + `DailyActivityRecords`）の一次 evidence を踏まえ、
**新 SPFx の deployment target をどうするか**を判断する Human Decision Packet である。

Accepted 正本:
[`decision-assessment-snapshot-target-reuse-acceptance.md`](./decision-assessment-snapshot-target-reuse-acceptance.md)

Evidence 正本:
[`tenant-confirmation-daily-activity-records-required-fields-evidence.md`](./tenant-confirmation-daily-activity-records-required-fields-evidence.md)

Independent Review:
[`decision-assessment-snapshot-pr-181-independent-review.md`](./decision-assessment-snapshot-pr-181-independent-review.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-TARGET-REUSE-1
Kind: Human Decision packet（compare → CONSUMED）
Status: CONSUMED（Human Decision Accepted / LOCKED）
Human Decision: B
Selected via:
  decision-ilb-1-nineteenth-residual-target-reuse-selection.md

Locked basis:
  Decision-AS-SP-PLACEMENT-1 = Accepted / LOCKED / SV-1+LV-1+CN-1+SC-1
  Decision-AS-TENANT-CONFIRM-1 = Accepted / LOCKED / RO-1+EV-1+RB-1+XG-1
  Decision-AS-TENANT-CONFIRM-EXEC-1 = Accepted / LOCKED / ES-1+TB-1+EO-1+FG-1

Evidence status:
  Observed existing environment =
    OBSERVED / CONFIRMED AS EXISTING-APP EVIDENCE / REFERENCE ONLY
  New SPFx deployment target = NOT SELECTED / NOT CREATED / HOLD
  Reuse existing /sites/welfare for new SPFx = NOT ADOPTED（B）
  Value Acceptance for /sites/welfare as new-SPFx target = NOT APPLICABLE

Tenant confirmation execution: IN PROGRESS / READ-ONLY
Mutation: NONE
tenant changes / List / column creation: NO-GO
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Schema / DTO code: HOLD / NOT STARTED
Deploy / real data mutation: NO-GO
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Question

```text
Question:
  既存 /sites/welfare + DailyActivityRecords を、
  新 SPFx の deployment target として再利用するか。
  それとも既存環境は reference evidence のみとし、
  新 SPFx 用 Site / List を別途用意するか。
```

本 Decision は **reuse / separate-target の選定だけ**を扱う。
Value Acceptance、Site/List 作成、実装開始は扱わない。

```text
Historical note:
  候補・Agent recommendation は比較用。採択は Acceptance 正本のみが LOCKED である。
```

## 2. Observed existing environment（evidence only）

| 項目 | 観測値 | 状態 |
|---|---|---|
| Site | `/sites/welfare` | OBSERVED / EXISTING-APP / REFERENCE ONLY |
| List | `DailyActivityRecords` | OBSERVED / EXISTING-APP / REFERENCE ONLY |
| List ID | `70ce9940-a50e-4a52-a3cf-97e2c83b2240` | OBSERVED / EXISTING-APP / REFERENCE ONLY |
| Required 5 Internal Names | UserCode / RecordDate / TimeSlot / Observation / Behavior | OBSERVED / EXISTING-APP / REFERENCE ONLY |

## 3. Options（比較履歴）

| ID | 内容 | 結果 |
|---|---|---|
| A | 既存 `/sites/welfare` + `DailyActivityRecords` を新 SPFx でも deployment target として再利用する | NOT SELECTED |
| **B** | 既存環境は reference evidence のみ。新 SPFx 用 Site / List は別途用意する | **Accepted** |
| HOLD | まだ決めない | NOT SELECTED |

## 4. Agent recommendation（historical / NOT Acceptance）

```text
Agent recommendation:
  HOLD（情報・運用方針の明示 Acceptance が先）

This was NOT Human Acceptance evidence.
Human Acceptance is recorded in the Acceptance 正本 only（B）.
```

## 5. Explicit non-authorization（unchanged）

```text
This packet / Acceptance does NOT authorize:
  creating Site / List / columns
  treating EXISTING-APP OBSERVED values as Accepted new-SPFx env values
  tenant / Entra / M365 setting changes
  Implementation Start
  SharePoint / adapter / application implementation
  Schema / DTO code assignment
  Deploy / real data mutation
  FindingCode / A-5
  post-retention deletion
```

## 6. Next after Human Decision

```text
Decision-AS-TARGET-REUSE-1: Accepted / LOCKED / B
  → decision-assessment-snapshot-target-reuse-acceptance.md
Observed existing environment: REFERENCE ONLY
New SPFx deployment target: NOT SELECTED / NOT CREATED / HOLD
Value Acceptance for /sites/welfare as new-SPFx target: NOT APPLICABLE
mutation / Implementation Start: NO-GO / HOLD
Ready / Merge: NOT RUN by this Decision
```
