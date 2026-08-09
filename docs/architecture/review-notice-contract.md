# 見直し通知開始（Review Notice）論理契約

## 目的

見直しに関する **通知開始時期（GOV-RULE-07）** を、
日数固定値へ劣化させずに保持する論理契約として固定する。

本単位は **Accepted logical contract** である（GOV-RULE-07 Option C）。
due / overdue 定義、通知 UI / job 実装、Schema 変更は含めない。
既存の `evaluateReviewDueRelativeToAsOf`（[`review-due.md`](./review-due.md)）を変更しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Contract ID: ReviewNoticePolicy
Kind: logical contract（Implementation Start ではない）
Status: Accepted（GOV-RULE-07 Human Acceptance / Option C）
Human Acceptance: decision-gov-rule-07-notice-acceptance.md
Decision packet: decision-gov-rule-07-notice-decision-packet.md
Depends on:
  GOV-RULE-05 Accepted（review-anchor-contract.md）
  GOV-RULE-06 Accepted（review-cadence-contract.md）
Related Issues: #16 / #19 / #24
main baseline: ed77f5e480ee8546c38809c60774fd5c512ab17e
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-rule-07-notice-acceptance.md`](./decision-gov-rule-07-notice-acceptance.md)
- [`decision-gov-rule-07-notice-decision-packet.md`](./decision-gov-rule-07-notice-decision-packet.md)
- [`review-anchor-contract.md`](./review-anchor-contract.md)
- [`review-cadence-contract.md`](./review-cadence-contract.md)
- [`review-due.md`](./review-due.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

## Decision 単位（混ぜない）

| ID | 決める内容 | 決めない内容 | 状態 |
|---|---|---|---|
| GOV-RULE-05 | 基準日 | 通知 | **Accepted** |
| GOV-RULE-06 | practice cadence | 通知 | **Accepted** |
| **GOV-RULE-07** | 通知開始時期 | due / overdue | **Accepted（Option C）** |
| GOV-RULE-08 | due / overdue 定義 | 通知開始 | HOLD |
| Decision-RD-3 | 接近窓・算出・超過後の技術ポリシー | 通知の一次表現 | HOLD |

## Accepted 型

```ts
type ReviewNoticePolicy = {
  kind: "calendar_month";
  trigger: "enter_target_review_month";
  purpose: "notify_staff_review_period";
  precision: "approximate";
};
```

| フィールド | 値 | 意味 |
|---|---|---|
| `kind` | `"calendar_month"` | 暦月ベース（日数カウントではない） |
| `trigger` | `"enter_target_review_month"` | 見直し対象暦月に入ったら |
| `purpose` | `"notify_staff_review_period"` | 「見直し時期です」と職員へ知らせる |
| `precision` | `"approximate"` | 厳密な期限エンジンではない |

日本語正本:

```text
通知開始:
  見直し対象となる暦月に入ったら通知する
意味:
  「見直し時期です」と職員へ知らせる
precision: approximate
```

### 禁止表現

```text
MUST NOT convert this contract into:
  30日前 / その他の固定 day-count notice window

MUST NOT equate:
  3ヶ月に1回程度 = 90日
  通知月に入った = overdue
  通知が出た = 業務違反
```

「見直し対象となる暦月」の具体算出（anchor + cadence からの月決定）は
Implementation Entry / 別技術契約まで決めない。本契約は **通知契機の意味** だけを固定する。

## 既存純関数との関係

```text
evaluateReviewDueRelativeToAsOf: UNCHANGED
ReviewNoticePolicy を review-due 結果集合へ混ぜない
接近窓日数定数の domain 埋め込み: FORBIDDEN
```

## IN

- 暦月ベース通知開始の論理表現
- GOV-RULE-07 Option C Accepted との対応
- GOV-RULE-08 / RD-3 との分離明示
- docs-only 論理契約の固定

## OUT

- GOV-RULE-08 の確定
- 通知 UI / ジョブ / 配信チャネル
- 「対象暦月」算出アルゴリズムの実装
- SupportPlan Schema / SharePoint 列変更
- `evaluateReviewDueRelativeToAsOf` の変更
- 90日規則の実装
- Issue Close / Deploy / M365 変更

## Entry Criteria（実装前）

- GOV-RULE-05 / 06 / 07 Accepted — **充足**
- 本契約と Accepted 内容が一致 — **充足**
- GOV-RULE-08 を本実装へ混ぜない（HOLD）
- 通知を day-count へ変換しない
- Human Implementation Start（別 Gate）

## Gate

```text
GOV-RULE-07: Accepted / Option C
ReviewNoticePolicy contract: Accepted（logical only）
GOV-RULE-08: HOLD
Decision-RD-3: HOLD
notice → day-count conversion: FORBIDDEN
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
AI invention of notice-day constants: FORBIDDEN
```
