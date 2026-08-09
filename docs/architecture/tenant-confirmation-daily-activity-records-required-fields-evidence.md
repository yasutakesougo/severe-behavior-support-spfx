# Tenant confirmation evidence — DailyActivityRecords required fields

この文書は、Decision-AS-TENANT-CONFIRM-EXEC-1（ES-1 + TB-1 + EO-1 + FG-1）
Accepted / LOCKED 後に、実 SharePoint 画面から取得した **read-only 一次 evidence**
の記録である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Primary-evidence observation record（EO-1 / EV-1）
Status: OBSERVED / CONFIRMED AS EXISTING-APP EVIDENCE / REFERENCE ONLY
Decision basis:
  Decision-AS-TENANT-CONFIRM-1 = Accepted / LOCKED / RO-1+EV-1+RB-1+XG-1
  Decision-AS-TENANT-CONFIRM-EXEC-1 = Accepted / LOCKED / ES-1+TB-1+EO-1+FG-1
  Decision-AS-SP-PLACEMENT-1 = Accepted / LOCKED / SV-1+LV-1+CN-1+SC-1
  Decision-AS-TARGET-REUSE-1 = Accepted / LOCKED / B

Environment meaning:
  Observed existing environment = 現在運用中の強度行動障害支援アプリ環境（reference only）
  New SPFx deployment target = NOT SELECTED / NOT CREATED / HOLD
  Reuse existing /sites/welfare for new SPFx = NOT ADOPTED（B）
  Value Acceptance for /sites/welfare as new-SPFx target = NOT APPLICABLE

Tenant confirmation execution: IN PROGRESS / READ-ONLY
Mutation: NONE
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Schema / DTO code: HOLD / NOT STARTED
Deploy / real data: NO-GO
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```

**本記録は既存アプリ環境の一次 evidence（reference）である。**
新 SPFx の deployment target / 環境値 Acceptance ではない。
Decision-AS-TARGET-REUSE-1 = **Accepted / LOCKED / B** により、
既存 `/sites/welfare` は新 SPFx で再利用しない（reference only）。

## 1. Observation summary

```text
Method: SharePoint UI read-only（必須設定画面 + 既存の列編集 URL 観測）
Scope: DailyActivityRecords の「必須」チェックがある列のみ
Environment class: EXISTING-APP（現行運用環境）
Mutation: NONE
Fail-closed: 必須チェックが無い列は本 evidence に含めない
```

| 対象 | 観測値 | 状態 |
|---|---|---|
| Site | `/sites/welfare` | **OBSERVED / EXISTING-APP** |
| List | `DailyActivityRecords` | **OBSERVED / EXISTING-APP** |
| List ID | `70ce9940-a50e-4a52-a3cf-97e2c83b2240` | **OBSERVED / EXISTING-APP** |
| Required application fields | UserCode / RecordDate / TimeSlot / Observation / Behavior | **OBSERVED / EXISTING-APP** |
| Internal Names（required 5） | 5 / 5 | **OBSERVED / CONFIRMED AS EXISTING-APP EVIDENCE** |
| New SPFx deployment target | — | **NOT SELECTED / NOT CREATED / HOLD** |
| Reuse for new SPFx | — | **NOT ADOPTED（B）** |
| Value Acceptance for /sites/welfare as new-SPFx target | — | **NOT APPLICABLE** |

## 2. Required fields（画面上「必須」チェックあり）

画像上で「必須」にチェックがあるのは次の 5 列のみ。
列編集 URL 観測と合わせ、表示名・Internal Name・型・必須性まで観測済みとして扱う。

| Internal Name | 型（観測） | 必須 |
|---|---|---|
| `UserCode` | 1行テキスト | YES |
| `RecordDate` | 日付と時刻 | YES |
| `TimeSlot` | 1行テキスト | YES |
| `Observation` | 複数行テキスト | YES |
| `Behavior` | 1行テキスト | YES |

```text
Required application fields OBSERVED（existing-app）:
  UserCode
  RecordDate
  TimeSlot
  Observation
  Behavior

Internal Names for required fields:
  5 / 5 OBSERVED / CONFIRMED AS EXISTING-APP EVIDENCE
```

## 3. Explicitly NOT in this required-evidence set

次は、今回の必須設定画面上で必須チェックが無い。
したがって **「今回確認した必須記録」には含めない**。

```text
NOT INCLUDED in this required-fields evidence:
  version
  duration
  PlanSlotKey
  PlannedActivity
  RecordedAtText
  IsDeleted
  DeletedAt
  DeletedBy
```

## 4. Recording boundary（RB-1 / SC-1）

```text
This evidence record:
  records OBSERVED primary information for the EXISTING welfare app environment only
  does NOT select new SPFx deployment target
  does NOT Accept /sites/welfare as new SPFx environment values
  does NOT write environment values into repository logical mapping contracts
  does NOT invent missing Internal Names / types / required flags

Before any new-SPFx deployment target values:
  Decision-AS-TARGET-REUSE-1 = Accepted / LOCKED / B
  → existing welfare env is reference only
  → new Site / List must be separately prepared（NOT CREATED / HOLD）
  → Value Acceptance for /sites/welfare as new-SPFx target = NOT APPLICABLE
```

## 5. Explicit non-authorization

```text
This evidence does NOT authorize:
  treating EXISTING-APP OBSERVED values as new SPFx deployment configuration
  Value Acceptance / LOCKED environment values for new SPFx
  Site / List creation for new SPFx
  tenant / Entra / M365 setting changes
  List / column creation or modification
  permissions changes
  Implementation Start
  SharePoint / adapter / application implementation
  Schema / DTO code assignment
  Deploy / real data mutation
  FindingCode / A-5
  post-retention deletion
  treating non-required columns as confirmed required
```

## 6. Next

```text
Evidence status: OBSERVED / CONFIRMED AS EXISTING-APP EVIDENCE / REFERENCE ONLY
Decision-AS-TARGET-REUSE-1: Accepted / LOCKED / B
New SPFx deployment target: NOT SELECTED / NOT CREATED / HOLD
Reuse existing /sites/welfare for new SPFx: NOT ADOPTED
Value Acceptance for /sites/welfare as new-SPFx target: NOT APPLICABLE

Still NO-GO / HOLD:
  new SPFx Site / List creation
  Implementation Start
  Mutation
  Deploy / real data
```
