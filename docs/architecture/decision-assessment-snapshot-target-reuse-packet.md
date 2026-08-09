# Decision-AS-TARGET-REUSE-1 — new SPFx deployment target reuse

この文書は、既存運用環境（`/sites/welfare` + `DailyActivityRecords`）の一次 evidence を踏まえ、
**新 SPFx の deployment target をどうするか**を判断する Human Decision Packet である。

Evidence 正本:
[`tenant-confirmation-daily-activity-records-required-fields-evidence.md`](./tenant-confirmation-daily-activity-records-required-fields-evidence.md)

Independent Review:
[`decision-assessment-snapshot-pr-181-independent-review.md`](./decision-assessment-snapshot-pr-181-independent-review.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-TARGET-REUSE-1
Kind: Human Decision packet（compare only）
Status: OPEN / NOT ACCEPTED
Selected via:
  decision-ilb-1-nineteenth-residual-target-reuse-selection.md

Locked basis:
  Decision-AS-SP-PLACEMENT-1 = Accepted / LOCKED / SV-1+LV-1+CN-1+SC-1
  Decision-AS-TENANT-CONFIRM-1 = Accepted / LOCKED / RO-1+EV-1+RB-1+XG-1
  Decision-AS-TENANT-CONFIRM-EXEC-1 = Accepted / LOCKED / ES-1+TB-1+EO-1+FG-1

Evidence status:
  Observed existing environment = OBSERVED / CONFIRMED AS EXISTING-APP EVIDENCE
  New SPFx deployment target = NOT SELECTED / NOT CREATED / HOLD
  Reuse existing /sites/welfare for new SPFx = NOT DECIDED

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

## 2. Observed existing environment（evidence only）

| 項目 | 観測値 | 状態 |
|---|---|---|
| Site | `/sites/welfare` | OBSERVED / EXISTING-APP |
| List | `DailyActivityRecords` | OBSERVED / EXISTING-APP |
| List ID | `70ce9940-a50e-4a52-a3cf-97e2c83b2240` | OBSERVED / EXISTING-APP |
| Required 5 Internal Names | UserCode / RecordDate / TimeSlot / Observation / Behavior | OBSERVED / EXISTING-APP |

```text
Meaning:
  現在運用中の強度行動障害支援アプリ環境として観測された一次 evidence。
  新 SPFx 用 Site は未作成。
  本表は reuse Decision の入力であり、新 SPFx 環境値 Acceptance ではない。
```

## 3. Options

| ID | 内容 | 判定上の意味 |
|---|---|---|
| **A** | 既存 `/sites/welfare` + `DailyActivityRecords` を新 SPFx でも deployment target として再利用する | reuse path。別途 Value Acceptance が必要 |
| **B** | 既存環境は reference evidence のみ。新 SPFx 用 Site / List は別途用意する | separate-target path。新 Site/List は未作成のまま HOLD |
| **HOLD** | まだ決めない | 現状維持。Value Acceptance も開かない |

## 4. Agent recommendation（NOT Acceptance）

```text
Agent recommendation:
  HOLD（情報・運用方針の明示 Acceptance が先）

Rationale:
  evidence は EXISTING-APP として PASS。
  しかし新 SPFx 用 Site は未作成であり、reuse（A）か separate（B）かは
  運用・移行・権限・既存データ影響を含む別 Human Decision である。
  Agent が A/B を自動選定しない。

This is NOT Human Acceptance evidence.
Human must explicitly select A, B, or HOLD.
```

## 5. Explicit non-authorization

```text
This packet does NOT authorize:
  new SPFx Value Acceptance
  treating EXISTING-APP OBSERVED values as already Accepted new-SPFx env values
  creating Site / List / columns
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
If Human selects A:
  → reuse path opens
  → then a separate Value Acceptance Decision may consider
    existing Site / List / required fields as new SPFx env candidates
  → mutation / Implementation Start remain NO-GO / HOLD

If Human selects B:
  → existing env remains reference evidence only
  → new SPFx Site / List = NOT CREATED / HOLD
  → Value Acceptance for /sites/welfare as new-SPFx target = NOT APPLICABLE

If Human selects HOLD:
  → Decision-AS-TARGET-REUSE-1 remains OPEN / NOT ACCEPTED
  → New SPFx deployment target = NOT SELECTED / NOT CREATED / HOLD
  → Value Acceptance remains NOT OPEN

Until explicit Human Decision:
  Decision-AS-TARGET-REUSE-1: OPEN / NOT ACCEPTED
  Reuse existing /sites/welfare for new SPFx: NOT DECIDED
```
