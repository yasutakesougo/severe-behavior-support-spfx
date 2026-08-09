# GOV-RULE-07 — Review notice start Human Acceptance

この文書は、**GOV-RULE-07**（見直し通知開始時期）についての
**Human Acceptance evidence** である。

Decision packet: [`decision-gov-rule-07-notice-decision-packet.md`](./decision-gov-rule-07-notice-decision-packet.md)

論理契約: [`review-notice-contract.md`](./review-notice-contract.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-RC-3 / GOV-RULE-07
Status: Accepted
Human Acceptance: Explicit Human GOV-RULE-07 acceptance on 2026-08-09
Selected Option: C — 暦月ベース
Notice start:
  見直し対象となる暦月に入ったら通知する
Meaning:
  「見直し時期です」と職員へ知らせる
precision: approximate
Independent Review (packet HEAD 10969be…): PASS
main baseline: ed77f5e480ee8546c38809c60774fd5c512ab17e
Depends on:
  GOV-RULE-05 Accepted
  GOV-RULE-06 Accepted
GOV-RULE-08: Accepted / Option A / NOT ADOPTED（別正本）
duration_days = 90: NOT AUTHORIZED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit Human GOV-RULE-07 acceptance on 2026-08-09
Decision-RC-3 / GOV-RULE-07: Accepted
Selected Option: C — 暦月ベース
通知開始:
  見直し対象となる暦月に入ったら通知する
意味:
  「見直し時期です」と職員へ知らせる
precision: approximate
GOV-RULE-08: Accepted / Option A / NOT ADOPTED（別正本・通知は informational）
```

```text
Agent recommendation / Independent Review: NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
GOV-RULE-07: Accepted
Selected Option: C
notice:
  kind = calendar_month
  trigger = enter target review calendar month
  audience purpose = notify staff that review period has arrived
  precision = approximate
```

論理表現（schema / UI 実装ではない）:

```ts
type ReviewNoticePolicy = {
  kind: "calendar_month";
  trigger: "enter_target_review_month";
  purpose: "notify_staff_review_period";
  precision: "approximate";
};
```

意味:

- 通知は日数カウント（例: 30日前）ではなく、**見直し対象の暦月に入ったこと**を契機とする。
- 目的は職員への「見直し時期です」という知らせであり、業務違反判定ではない。
- precision は approximate であり、GOV-RULE-06 の approximate cadence と整合する。

### この決定からは導出しない / 境界維持

```text
NOT derived / MUST NOT equate:
  通知開始 → 30日前 等の日数変換
  3ヶ月に1回程度 = 90日
  通知月に入った = overdue
  通知が出た = 業務違反
  duration_days = 90
```

GOV-RULE-05 / 06 再掲（変更しない）:

```text
GOV-RULE-05: Accepted
  初回 = 支援計画の有効開始日
  2回目以降 = 前回見直し日

GOV-RULE-06: Accepted
  「3ヶ月に1回程度」
  / calendar-month cadence
  / precision = approximate
```

## Acceptance boundary

```text
GOV-RULE-08 due / overdue 定義: Accepted / Option A / NOT ADOPTED（別正本）
Decision-RD-3: Accepted / LOCKED（別正本 decision-rd-3-monitoring-guidance-acceptance.md）
「見直し対象となる暦月」の算出アルゴリズム実装: NOT STARTED
通知 UI / job / SharePoint: NOT STARTED
evaluateReviewDueRelativeToAsOf: UNCHANGED
SupportPlan Schema 変更: NOT STARTED
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
| GOV-RULE-07 通知開始 | **Accepted**（Option C） |
| GOV-RULE-05 / 06 | Accepted（UNCHANGED） |
| GOV-RULE-08 | Accepted / Option A / NOT ADOPTED（別正本） |
| [`review-notice-contract.md`](./review-notice-contract.md) | Accepted logical contract（実装は別 Entry） |
| [`review-due.md`](./review-due.md) / `evaluateReviewDueRelativeToAsOf` | UNCHANGED |

## Next

```text
Next automatic: NONE
Still HOLD / separate:
  Decision-RD-3
  Implementation Entry / Start
GOV-RULE-08: Accepted / Option A / NOT ADOPTED（別正本）
```

Agent は本 Acceptance を理由に通知実装・90日規則・GOV-RULE-08・FindingCode / A-5 へ自動進行しない。

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** / tests/**: 本 Acceptance 記録では変更しない
evaluateReviewDueRelativeToAsOf: UNCHANGED
notice → day-count conversion: FORBIDDEN
Implementation auto-start: FORBIDDEN
```
