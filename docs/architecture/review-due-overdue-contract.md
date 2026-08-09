# 見直し due / overdue（Review Due-Overdue）論理契約

## 目的

見直しの **期限当日 / 期限超過（GOV-RULE-08）** について、
現行 scope では hard due / overdue を採択しないことを論理契約として固定する。

本単位は **Accepted logical contract** である（GOV-RULE-08 Option A / NOT ADOPTED）。
既存の `evaluateReviewDueRelativeToAsOf`（[`review-due.md`](./review-due.md)）を変更しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Contract ID: ReviewDueOverduePolicy
Kind: logical contract（Implementation Start ではない）
Status: Accepted（GOV-RULE-08 Human Acceptance / Option A / NOT ADOPTED）
Human Acceptance: decision-gov-rule-08-due-overdue-acceptance.md
Decision packet: decision-gov-rule-08-due-overdue-decision-packet.md
Depends on:
  GOV-RULE-05 Accepted
  GOV-RULE-06 Accepted
  GOV-RULE-07 Accepted / Option C
Related Issues: #16 / #19 / #24
main baseline: ba97f2df2cf369454dd6ab0670fca0bfbb1e1436
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-rule-08-due-overdue-acceptance.md`](./decision-gov-rule-08-due-overdue-acceptance.md)
- [`decision-gov-rule-08-due-overdue-decision-packet.md`](./decision-gov-rule-08-due-overdue-decision-packet.md)
- [`review-notice-contract.md`](./review-notice-contract.md)
- [`review-cadence-contract.md`](./review-cadence-contract.md)
- [`review-anchor-contract.md`](./review-anchor-contract.md)
- [`review-due.md`](./review-due.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

## Decision 単位（混ぜない）

| ID | 決める内容 | 決めない内容 | 状態 |
|---|---|---|---|
| GOV-RULE-05 | 基準日 | due/overdue | **Accepted** |
| GOV-RULE-06 | practice cadence | due/overdue | **Accepted** |
| GOV-RULE-07 | 通知開始 | due/overdue | **Accepted / Option C** |
| **GOV-RULE-08** | due / overdue 定義 | 通知・cadence | **Accepted / Option A / NOT ADOPTED** |
| Decision-RD-3 | モニタリング目安 / 超過後 | 本 NOT ADOPTED の再解釈 | **Accepted / LOCKED**（hard due 再採択せず；[`review-monitoring-guidance-contract.md`](./review-monitoring-guidance-contract.md)） |
| `evaluateReviewDueRelativeToAsOf` | caller-supplied 相対判定 | 業務 due 導出 | UNCHANGED |

## Accepted 型

```ts
type ReviewDueOverduePolicy = {
  kind: "not_adopted";
};
```

| フィールド | 値 | 意味 |
|---|---|---|
| `kind` | `"not_adopted"` | 現行 scope で hard due / overdue を採択しない |

日本語正本:

```text
GOV-RULE-08: Accepted / Option A
hard な期限当日・期限超過: 当面採択しない
GOV-RULE-07 通知: 情報提供に留める（overdue / 違反ではない）
```

### 禁止表現

```text
MUST NOT adopt under this contract:
  duration_days = 90 as due
  day 91 = overdue
  elapsed 3 calendar months = automatic violation
  enter notice month = overdue
  notice emitted = business violation
```

## 既存純関数との関係

```text
evaluateReviewDueRelativeToAsOf: UNCHANGED
role: technical helper for caller-supplied reviewDueDate only
NOT: business derivation from GOV-RULE-05/06/07
NOT: institutional approaching-window constants
```

## IN

- hard due/overdue NOT ADOPTED の論理表現
- GOV-RULE-08 Option A Accepted との対応
- 通知・cadence・90日規則との分離明示
- docs-only 論理契約の固定

## OUT

- hard due/overdue 業務規則の実装
- 業務違反判定エンジン
- cadence/anchor からの reviewDueDate 自動導出
- SupportPlan Schema / SharePoint 列変更
- `evaluateReviewDueRelativeToAsOf` の変更
- FindingCode / A-5 / Implementation Start
- Issue Close / Deploy / M365 変更

## Entry Criteria（将来 hard due を採択し直す場合）

- 新しい Human Decision で GOV-RULE-08 を再評価すること
- 本 NOT ADOPTED を黙って上書きしないこと
- 90日 / 通知=overdue を Agent が発明しないこと
- Human Implementation Start（別 Gate）

現行 Option A では実装 Entry を開かない。

## Gate

```text
GOV-RULE-08: Accepted / Option A / NOT ADOPTED
ReviewDueOverduePolicy contract: Accepted（logical only / not_adopted）
business overdue / violation: DO NOT START
duration_days = 90: NOT AUTHORIZED
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
AI invention of 90/91-day overdue rules: FORBIDDEN
notice-month = overdue: FORBIDDEN
```
