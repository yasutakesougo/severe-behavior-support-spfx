# 見直しモニタリング時期表示・通知（Review Monitoring Guidance）論理契約

## 目的

**Decision-RD-3** として、モニタリング時期を
「3か月に1回程度」の **目安表示・通知（informational only）** に留め、
期限超過状態・超過警告・業務制限・90日固定・hard due/overdue を採択しないことを
論理契約として固定する。

本契約は **「モニタリングをしなくてよい」を意味しない**。
制度・業務上の「3か月に1回程度の見直し」は維持し、
アプリが独自に「期限切れ」「違反」と判定して現場業務を止めない。

本単位は **Accepted logical contract** である。
UI / job / Schema 実装、`evaluateReviewDueRelativeToAsOf` の変更は含めない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Contract ID: ReviewMonitoringGuidancePolicy
Kind: logical contract（Implementation Start ではない）
Status: Accepted（Decision-RD-3 Human Acceptance）
Human Acceptance: decision-rd-3-monitoring-guidance-acceptance.md
Depends on:
  GOV-RULE-05 Accepted
  GOV-RULE-06 Accepted
  GOV-RULE-07 Accepted / Option C
  GOV-RULE-08 Accepted / Option A / NOT ADOPTED
  Decision-ILB-1 Human Policy FINAL CONSISTENT
Related Issues: #16 / #19 / #24
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-rd-3-monitoring-guidance-acceptance.md`](./decision-rd-3-monitoring-guidance-acceptance.md)
- [`decision-gov-rule-06-review-cadence-acceptance.md`](./decision-gov-rule-06-review-cadence-acceptance.md)
- [`review-cadence-contract.md`](./review-cadence-contract.md)
- [`review-notice-contract.md`](./review-notice-contract.md)
- [`review-due-overdue-contract.md`](./review-due-overdue-contract.md)
- [`review-due.md`](./review-due.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

## Decision 単位（混ぜない）

| ID | 決める内容 | 決めない内容 | 状態 |
|---|---|---|---|
| GOV-RULE-06 | practice cadence 一次表現 | 表示/超過ポリシー | **Accepted** |
| GOV-RULE-07 | 通知開始時期 | hard due | **Accepted / Option C** |
| GOV-RULE-08 | hard due / overdue | 表示ガイド | **Accepted / NOT ADOPTED** |
| **Decision-RD-3** | モニタリング目安の表示・通知扱い / 超過後 | Schema・実装 | **Accepted / LOCKED** |
| RD-1/RD-2 | caller-supplied 相対判定 | 本ガイド | Accepted / UNCHANGED |

## Accepted 型

```ts
type ReviewMonitoringGuidancePolicy = {
  kind: "informational_cadence_guide";
  guideText: "3か月に1回程度";
  purpose: "display_and_notify_as_guide";
  institutionalReviewCadence: "maintained";
  overdueState: "not_adopted";
  overdueWarning: "not_adopted";
  overdueBusinessRestriction: "not_adopted";
  fixedNinetyDays: "not_adopted";
  hardDueOverdue: "not_adopted";
};
```

| フィールド | 値 | 意味 |
|---|---|---|
| `kind` | `"informational_cadence_guide"` | 情報提供の目安表示・通知 |
| `guideText` | `"3か月に1回程度"` | 表示・通知に使う目安文言 |
| `purpose` | `"display_and_notify_as_guide"` | hard due ではない |
| `institutionalReviewCadence` | `"maintained"` | 制度・業務上の見直しは維持 |
| `overdueState` | `"not_adopted"` | 期限超過という状態を採択しない |
| `overdueWarning` | `"not_adopted"` | 期限超過警告を採択しない |
| `overdueBusinessRestriction` | `"not_adopted"` | 業務制限を採択しない |
| `fixedNinetyDays` | `"not_adopted"` | 90日固定を採択しない |
| `hardDueOverdue` | `"not_adopted"` | GOV-RULE-08 と整合 |

日本語正本:

```text
モニタリング時期:
  「3か月に1回程度」を目安として表示・通知する
扱い: informational only
採用しない:
  期限超過という状態
  期限超過警告
  期限超過による業務制限
  90日固定
  hard due / overdue
Design intent:
  モニタリング不要ではない
  制度・業務上の見直しは維持
  アプリが期限切れ/違反で現場業務を止めない
```

### 禁止表現

```text
MUST NOT convert this contract into:
  duration_days = 90
  day-count approach window constants in domain
  overdue / violation engine
  past-due business restriction that stops field work

MUST NOT equate:
  informational only = モニタリング不要
  3か月に1回程度 = 90日
  目安表示 / 通知 = hard due / 業務違反 / 現場業務停止
```

## 既存純関数との関係

```text
evaluateReviewDueRelativeToAsOf: UNCHANGED
  caller-supplied reviewDueDate の相対判定ヘルパーのまま
  本契約から due を自動導出しない
  接近窓日数を埋め込まない
```

## Explicit non-goals

```text
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Schema / SharePoint / UI / job: NOT STARTED
GOV-AUD-05 / 他残存 Decision: NOT Accepted here
```
