# Tenant confirmation evidence — DailyActivityRecords required fields

この文書は、Decision-AS-TENANT-CONFIRM-EXEC-1（ES-1 + TB-1 + EO-1 + FG-1）
Accepted / LOCKED 後に、実 SharePoint 画面から取得した **read-only 一次 evidence**
の記録である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Primary-evidence observation record（EO-1 / EV-1）
Status: OBSERVED / NOT ACCEPTED
Decision basis:
  Decision-AS-TENANT-CONFIRM-1 = Accepted / LOCKED / RO-1+EV-1+RB-1+XG-1
  Decision-AS-TENANT-CONFIRM-EXEC-1 = Accepted / LOCKED / ES-1+TB-1+EO-1+FG-1
  Decision-AS-SP-PLACEMENT-1 = Accepted / LOCKED / SV-1+LV-1+CN-1+SC-1

Tenant confirmation execution: IN PROGRESS / READ-ONLY
Mutation: NONE
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Schema / DTO code: HOLD / NOT STARTED
Deploy / real data: NO-GO
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```

**本記録は Value Acceptance ではない。**
観測値を新 SPFx 環境値として Accepted / LOCKED にする判断は、別 Human Decision
（Decision-AS-TENANT-CONFIRM-VALUES-1）で行う。

## 1. Observation summary

```text
Method: SharePoint UI read-only（必須設定画面 + 既存の列編集 URL 観測）
Scope: DailyActivityRecords の「必須」チェックがある列のみ
Mutation: NONE
Fail-closed: 必須チェックが無い列は本 evidence に含めない
```

| 対象 | 観測値 | 状態 |
|---|---|---|
| Site | `/sites/welfare` | **OBSERVED** |
| List | `DailyActivityRecords` | **OBSERVED** |
| List ID | `70ce9940-a50e-4a52-a3cf-97e2c83b2240` | **OBSERVED** |
| Required application fields | UserCode / RecordDate / TimeSlot / Observation / Behavior | **OBSERVED** |
| Internal Names（required 5） | 5 / 5 | **OBSERVED / CONFIRMED as observed** |
| Value Acceptance | — | **NOT ACCEPTED** |

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
Required application fields OBSERVED:
  UserCode
  RecordDate
  TimeSlot
  Observation
  Behavior

Internal Names for required fields:
  5 / 5 OBSERVED
```

## 3. Explicitly NOT in this required-evidence set

次は、今回の必須設定画面上で必須チェックが無い。
したがって **「今回確認した必須記録」には含めない**（未観測として必須 evidence に入れない）。

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

これらを環境値として扱うには、別途の一次 evidence と別 Human Decision が必要である。

## 4. Recording boundary（RB-1 / SC-1）

```text
This evidence record:
  records OBSERVED primary information only
  does NOT Accept environment values
  does NOT write environment values into repository logical mapping contracts
  does NOT invent missing Internal Names / types / required flags

Accepted environment values（if any）must go through:
  Decision-AS-TENANT-CONFIRM-VALUES-1
  and remain deployment configuration（SC-1）side
```

## 5. Explicit non-authorization

```text
This evidence does NOT authorize:
  Value Acceptance / LOCKED environment values
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
Evidence status: OBSERVED / NOT ACCEPTED
Next Human gate:
  Decision-AS-TENANT-CONFIRM-VALUES-1
  — Site / List / List ID / required 5 Internal Names・型・必須性を
    新 SPFx 環境値として Accepted / LOCKED にするか

Until Value Acceptance:
  Site / List / Internal Name environment values: OBSERVED / NOT ACCEPTED
  Tenant confirmation execution: IN PROGRESS / READ-ONLY
  Mutation: NONE
  Implementation Start: HOLD
```
