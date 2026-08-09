# GOV-RULE-05 — Review anchor date Human Acceptance

この文書は、**GOV-RULE-05**（見直し周期の基準日）についての
**Human Acceptance evidence** である。

関連:

- GOV-RULE-06 practice cadence: [`decision-gov-rule-06-review-cadence-acceptance.md`](./decision-gov-rule-06-review-cadence-acceptance.md)
- ReviewCadence 論理契約: [`review-cadence-contract.md`](./review-cadence-contract.md)
- 基準日論理契約: [`review-anchor-contract.md`](./review-anchor-contract.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-RC-2 / GOV-RULE-05
Status: Accepted
Human Acceptance: Explicit Human GOV-RULE-05 acceptance on 2026-08-09
Accepted anchor policy:
  初回: 支援計画の有効開始日
  2回目以降: 前回見直し日
Depends on: GOV-RULE-06 Accepted（practice cadence）
main baseline: fc67f70016e09341f7b3155d934f9b80658e006d
GOV-RULE-07 通知開始: Accepted（別正本 decision-gov-rule-07-notice-acceptance.md / Option C）
GOV-RULE-08 due / overdue 定義: HOLD
duration_days = 90: NOT AUTHORIZED
Decision-RD-3: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
NOT derived from this Acceptance alone:
  90日
  91日目から overdue
  3暦月経過で自動違反
  reviewDueDate 自動算出アルゴリズム完成
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit Human GOV-RULE-05 acceptance on 2026-08-09
Decision-RC-2 / GOV-RULE-05: Accepted
Selected meaning:
  見直し周期の基準日
  初回 = 支援計画の有効開始日
  2回目以降 = 前回見直し日
```

```text
Agent execution evidence: NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
GOV-RULE-05: Accepted
Review cycle anchor date:
  first: support plan effective start date
  subsequent: previous review date
```

日本語正本:

```text
見直し周期の基準日:
  初回: 支援計画の有効開始日
  2回目以降: 前回見直し日
```

論理表現（schema 実装ではない）:

```ts
type ReviewAnchorPolicy = {
  first: "support_plan_effective_from";
  subsequent: "previous_review_date";
};
```

意味:

- 初回の周期起算は、支援計画の **有効開始日** を用いる。
  既存 SupportPlan 契約の `effectiveFrom` に対応する業務意味である（本 Acceptance は Schema 変更を行わない）。
- 2回目以降の周期起算は、**前回見直し日** を用いる。
  「前回見直し日」の物理フィールド名・永続化は本 Acceptance では決めない。
- GOV-RULE-06（3ヶ月に1回程度 / calendar-month / approximate）と組み合わせて
  「何を起点に roughly 3 months を数えるか」を固定する。

### この決定からは導出しない

```text
NOT derived from GOV-RULE-05 Accepted alone:
  90日
  91日目から overdue
  3暦月経過で自動違反
  duration_days = 90
  GOV-RULE-08 due / overdue 判定規則
  reviewDueDate の確定算出式 / 自動付与実装
  通知開始の日数変換（GOV-RULE-07 は別正本 / 暦月ベース）
```

GOV-RULE-06 再掲（変更しない）:

```text
GOV-RULE-06: Accepted
  「3ヶ月に1回程度」
  / calendar-month cadence
  / precision = approximate
```

## Acceptance boundary

```text
GOV-RULE-07 通知開始: Accepted（別 Decision / Option C）
GOV-RULE-08 due / overdue 定義: HOLD
duration_days = 90: NOT AUTHORIZED
Decision-RD-3: HOLD
前回見直し日の物理列 / Schema: UNDECIDED
reviewDueDate 自動算出実装: NOT STARTED
evaluateReviewDueRelativeToAsOf: UNCHANGED
SupportPlan Schema / SharePoint 変更: NOT STARTED
TypeScript / validator / fixture 実装: NOT STARTED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
FindingCode values / numbering / mapping / DEC / A-5: DO NOT START
SharePoint / M365 / Entra / Deploy: NO-GO
real data: PROHIBITED
```

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| GOV-RULE-05 基準日 | **Accepted** |
| GOV-RULE-06 practice cadence | Accepted（UNCHANGED） |
| [`review-anchor-contract.md`](./review-anchor-contract.md) | Accepted logical contract（実装は別 Entry） |
| [`review-cadence-contract.md`](./review-cadence-contract.md) | Accepted（UNCHANGED meaning） |
| [`review-due.md`](./review-due.md) / `evaluateReviewDueRelativeToAsOf` | UNCHANGED |

## Next

```text
Next automatic: NONE
Still HOLD:
  GOV-RULE-08
  Decision-RD-3
  Implementation Entry / Start
GOV-RULE-07: Accepted（別正本 / Option C）
```

Agent は本 Acceptance を理由に due 算出実装・90日規則・FindingCode / A-5 へ自動進行しない。

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** / tests/**: 本 Acceptance 記録では変更しない
evaluateReviewDueRelativeToAsOf: UNCHANGED
3ヶ月 → 90日 conversion: FORBIDDEN
Implementation auto-start: FORBIDDEN
```
