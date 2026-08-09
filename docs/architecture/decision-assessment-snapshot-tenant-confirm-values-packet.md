# Decision-AS-TENANT-CONFIRM-VALUES-1 — observed tenant values Acceptance

この文書は、DailyActivityRecords 必須列の一次 evidence（OBSERVED）を、
**新 SPFx 側の環境値として Accepted / LOCKED にしてよいか**を判断する
Human Decision Packet である。

Evidence 正本:
[`tenant-confirmation-daily-activity-records-required-fields-evidence.md`](./tenant-confirmation-daily-activity-records-required-fields-evidence.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-TENANT-CONFIRM-VALUES-1
Kind: Human Decision packet（compare only）
Status: OPEN / NOT ACCEPTED
Selected via:
  decision-ilb-1-nineteenth-residual-tenant-confirm-values-selection.md

Locked basis:
  Decision-AS-SP-PLACEMENT-1 = Accepted / LOCKED / SV-1+LV-1+CN-1+SC-1
  Decision-AS-TENANT-CONFIRM-1 = Accepted / LOCKED / RO-1+EV-1+RB-1+XG-1
  Decision-AS-TENANT-CONFIRM-EXEC-1 = Accepted / LOCKED / ES-1+TB-1+EO-1+FG-1

Evidence status:
  DailyActivityRecords required fields = OBSERVED / NOT ACCEPTED

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
  観測済みの Site / List / List ID / 必須 5 Internal Names・型・必須性を、
  新 SPFx の deployment configuration 環境値として Accepted / LOCKED にしてよいか。
```

本 Decision は **環境値 Acceptance だけ**を扱う。
tenant mutation、実装開始、非必須列の確定は扱わない。

## 2. Observed candidates（evidence only / NOT locked by this packet）

| 項目 | 観測値 | evidence 状態 |
|---|---|---|
| Site | `/sites/welfare` | OBSERVED |
| List | `DailyActivityRecords` | OBSERVED |
| List ID | `70ce9940-a50e-4a52-a3cf-97e2c83b2240` | OBSERVED |
| UserCode | 1行テキスト / REQUIRED | OBSERVED |
| RecordDate | 日付と時刻 / REQUIRED | OBSERVED |
| TimeSlot | 1行テキスト / REQUIRED | OBSERVED |
| Observation | 複数行テキスト / REQUIRED | OBSERVED |
| Behavior | 1行テキスト / REQUIRED | OBSERVED |

```text
NOT IN this candidate set（必須チェック無し / 本 evidence 外）:
  version / duration / PlanSlotKey / PlannedActivity /
  RecordedAtText / IsDeleted / DeletedAt / DeletedBy
```

## 3. Compare axes

### VS — value scope

| ID | 内容 | 判定上の意味 |
|---|---|---|
| **VS-1** | Site + List + List ID + 必須 5 Internal Names・型・必須性だけを環境値候補とする | evidence 範囲と一致 |
| VS-2 | 必須チェックの無い列も含めて環境値にする | evidence 超過 |
| VS-3 | Site / List だけで Internal Names は後回し | 必須列 evidence を捨てる |
| VS-HOLD | 値 Acceptance しない | 現状維持 |

### CF — config placement

| ID | 内容 | 判定上の意味 |
|---|---|---|
| **CF-1** | Accepted する場合も deployment configuration（SC-1 / RB-1）側のみ。repository logical mapping 正本へ環境値を直書き同一視しない | SC-1 / RB-1 と一致 |
| CF-2 | repository contract / TypeScript へ環境値を直書きして正本化する | SC-1 と衝突 |
| CF-HOLD | 配置先未決定 | Acceptance できない |

### RQ — required-set boundary

| ID | 内容 | 判定上の意味 |
|---|---|---|
| **RQ-1** | 「必須記録」は画面上必須チェックがあった 5 列のみ。他列は本 Acceptance に含めない | fail-closed / EO-1 |
| RQ-2 | 既存設計メモ上の列も必須扱いに含める | 推測混入 |
| RQ-HOLD | 必須境界未決定 | Acceptance できない |

### XG — exclusions

| ID | 内容 | 判定上の意味 |
|---|---|---|
| **XG-1** | Value Acceptance しても mutation / List・列作成 / Implementation Start / Schema·DTO code / Deploy / real data / FindingCode·A-5 は NO-GO または HOLD のまま | 既存 NO-GO 維持 |
| XG-2 | Value Acceptance を Implementation Start とみなす | 範囲拡大 |
| XG-3 | Value Acceptance を tenant 変更 GO とみなす | mutation 解禁 |
| XG-HOLD | 除外未決定 | Acceptance できない |

## 4. Agent recommendation（NOT Acceptance）

```text
Agent recommendation:
  VS-1 + CF-1 + RQ-1 + XG-1

Rationale:
  一次 evidence が揃った範囲だけを、SC-1 / RB-1 の deployment configuration 側へ
  Accept 可能にする。必須チェック外の列・実装開始・mutation は含めない。

This is NOT Human Acceptance evidence.
Human must explicitly Accept a VS / CF / RQ / XG combination.
```

## 5. Explicit non-authorization

```text
This packet does NOT authorize:
  treating OBSERVED evidence as already Accepted
  writing env values into repository logical mapping as contract truth
  accepting non-required columns without primary evidence
  tenant / Entra / M365 setting changes
  List / column creation or modification
  Implementation Start
  SharePoint / adapter / application implementation
  Schema / DTO code assignment
  Deploy / real data mutation
  FindingCode / A-5
  post-retention deletion
```

## 6. Next after Human Acceptance

```text
If Human accepts VS-1 + CF-1 + RQ-1 + XG-1:
  → observed Site / List / List ID / required 5 fields may become
    Accepted / LOCKED environment values（deployment configuration only）
  → non-required columns remain outside this Acceptance
  → mutation / Implementation Start remain NO-GO / HOLD

Until explicit Human Acceptance:
  Decision-AS-TENANT-CONFIRM-VALUES-1: OPEN / NOT ACCEPTED
  Observed values: OBSERVED / NOT ACCEPTED
  Tenant confirmation execution: IN PROGRESS / READ-ONLY
```
