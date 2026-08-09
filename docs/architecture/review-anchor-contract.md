# 見直し基準日（Review Anchor）論理契約

## 目的

見直し周期を数える **基準日（GOV-RULE-05）** を、
一次情報を日数固定値へ劣化させずに保持する論理契約として固定する。

本単位は **Accepted logical contract** である（GOV-RULE-05）。
due / overdue 定義、通知開始、`reviewDueDate` 算出実装、Schema 変更は含めない。
既存の `evaluateReviewDueRelativeToAsOf`（[`review-due.md`](./review-due.md)）を変更しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Contract ID: ReviewAnchorPolicy
Kind: logical contract（Implementation Start ではない）
Status: Accepted（GOV-RULE-05 Human Acceptance）
Human Acceptance: decision-gov-rule-05-review-anchor-acceptance.md
Depends on: GOV-RULE-06 Accepted（review-cadence-contract.md）
Related Issues: #16 / #19 / #24
main baseline: fc67f70016e09341f7b3155d934f9b80658e006d
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-rule-05-review-anchor-acceptance.md`](./decision-gov-rule-05-review-anchor-acceptance.md)
- [`decision-gov-rule-06-review-cadence-acceptance.md`](./decision-gov-rule-06-review-cadence-acceptance.md)
- [`review-cadence-contract.md`](./review-cadence-contract.md)
- [`review-due.md`](./review-due.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

## Decision 単位（混ぜない）

| ID | 決める内容 | 決めない内容 | 状態 |
|---|---|---|---|
| **GOV-RULE-05** | 見直し周期の基準日 | cadence・通知・due/overdue | **Accepted** |
| GOV-RULE-06 | practice cadence | 基準日 | **Accepted** |
| GOV-RULE-07 | 通知開始時期 | 基準日 | **Accepted**（Option C / [`review-notice-contract.md`](./review-notice-contract.md)） |
| GOV-RULE-08 | 期限当日・期限超過の定義 | 基準日 | **Accepted** / Option A / NOT ADOPTED |
| Decision-RD-3 | 接近窓・期限算出・超過後ポリシー | 基準日の一次表現 | HOLD |

## Accepted 型

```ts
type ReviewAnchorPolicy = {
  first: "support_plan_effective_from";
  subsequent: "previous_review_date";
};
```

| フィールド | 値 | 意味 |
|---|---|---|
| `first` | `"support_plan_effective_from"` | 初回基準日 = 支援計画の有効開始日 |
| `subsequent` | `"previous_review_date"` | 2回目以降基準日 = 前回見直し日 |

日本語正本:

```text
見直し周期の基準日:
  初回: 支援計画の有効開始日
  2回目以降: 前回見直し日
```

GOV-RULE-06 との合成意味（算出実装ではない）:

```text
anchor = first ? support_plan_effective_from : previous_review_date
cadence = approximately every 3 calendar months（precision = approximate）
```

### 禁止表現

```text
MUST NOT derive from this contract alone:
  90日
  91日目から overdue
  3暦月経過で自動違反
  duration_days = 90 as canonical cadence
  concrete reviewDueDate auto-calculation implementation
```

`previous_review_date` の物理フィールド・SharePoint 列・必須/任意は本契約では決めない。

## 既存 review-due 純関数との関係

| 契約 | 役割 |
|---|---|
| 本 Review Anchor | 周期を数える起点の意味 |
| [`review-cadence-contract.md`](./review-cadence-contract.md) | およそ3ヶ月の practice cadence |
| [`review-due.md`](./review-due.md) | caller-supplied `reviewDueDate` と `asOf` の相対判定 |

```text
evaluateReviewDueRelativeToAsOf: UNCHANGED
Anchor + Cadence → reviewDueDate 自動算出: OUT / HOLD（GOV-RULE-08・RD-3 / Implementation Entry）
```

## IN

- 基準日ポリシーの論理表現（初回 / 2回目以降）
- GOV-RULE-05 Accepted との対応
- GOV-RULE-06 / 07 / 08 / RD-3 との分離明示
- docs-only 論理契約の固定

## OUT

- GOV-RULE-08 の確定
- `reviewDueDate` 算出・既定付与の実装
- SupportPlan Schema / DTO / SharePoint 列変更
- `previous_review_date` 物理表現の採択
- `evaluateReviewDueRelativeToAsOf` の変更
- 90日規則の実装
- 通知 UI / job 実装（GOV-RULE-07 意味は別契約）
- Issue Close / Deploy / M365 変更

## Entry Criteria（実装・Schema 反映の前）

- GOV-RULE-05 / GOV-RULE-06 が Human Accepted — **充足**
- 本契約と Accepted 内容が一致する — **充足**
- GOV-RULE-08 hard due/overdue を本実装へ混ぜない（Accepted / Option A / NOT ADOPTED）
- `duration_days = 90` を正式 cadence として導入しない
- 既存 `review-due` 相対判定へ制度値を埋め込まない
- Schema / SharePoint 変更が必要なら別 Decision / 別 PR
- Human Implementation Start（別 Gate）

## Gate

```text
GOV-RULE-05: Accepted
GOV-RULE-06: Accepted
GOV-RULE-07: Accepted（Option C / 別正本）
GOV-RULE-08: Accepted / Option A / NOT ADOPTED（別正本）
ReviewAnchorPolicy contract: Accepted（logical only）
Decision-RD-3: HOLD
3ヶ月 → 90日 conversion: FORBIDDEN
Implementation Start: HOLD
SharePoint / Entra ID / Microsoft 365: NO-GO
Deploy: NO-GO
```

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** / tests/**: 本単位では変更しない
evaluateReviewDueRelativeToAsOf: UNCHANGED
statutory 90-day mandate invention: FORBIDDEN
```
