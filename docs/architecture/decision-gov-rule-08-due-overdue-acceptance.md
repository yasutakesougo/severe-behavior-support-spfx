# GOV-RULE-08 — due / overdue Human Acceptance（Option A / NOT ADOPTED）

この文書は、**GOV-RULE-08**（見直しの期限当日 / 期限超過の定義）についての
**Human Acceptance evidence** である。

Decision packet: [`decision-gov-rule-08-due-overdue-decision-packet.md`](./decision-gov-rule-08-due-overdue-decision-packet.md)

論理契約: [`review-due-overdue-contract.md`](./review-due-overdue-contract.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-RC-4 / GOV-RULE-08
Status: Accepted
Selected: Option A
Human Acceptance: Explicit Human GOV-RULE-08 acceptance on 2026-08-09
Meaning: hard due / overdue NOT ADOPTED for current scope
Independent Review (packet HEAD a18cd15…): PASS
main baseline: ba97f2df2cf369454dd6ab0670fca0bfbb1e1436
Depends on:
  GOV-RULE-05 Accepted
  GOV-RULE-06 Accepted
  GOV-RULE-07 Accepted / Option C
duration_days = 90: NOT AUTHORIZED
business overdue / violation: DO NOT START
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit Human GOV-RULE-08 acceptance on 2026-08-09
Decision-RC-4 / GOV-RULE-08: Accepted
Selected Option: A
hard due / overdue: NOT ADOPTED for current scope
business overdue / violation semantics: DO NOT START
GOV-RULE-07 notice: remains informational only
```

```text
Agent recommendation / Independent Review: NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
GOV-RULE-08: Accepted / Option A / NOT ADOPTED
hard due definition: NOT ADOPTED
hard overdue definition: NOT ADOPTED
violationMeaning: NONE / DO NOT START
```

論理表現（schema / 違反エンジン実装ではない）:

```ts
type ReviewDueOverduePolicy = {
  kind: "not_adopted";
};
```

意味:

- 現行 scope では、支援運用上の **hard な期限当日 / 期限超過** を採択しない。
- GOV-RULE-07 の通知（見直し対象暦月に入ったら知らせる）は **情報提供** に留まる。
- 通知月に入ったこと、通知が出たことを overdue や業務違反にしない。
- 既存の技術純関数 `evaluateReviewDueRelativeToAsOf` は、
  caller-supplied `reviewDueDate` の相対判定ヘルパーとして残してよい。
  ただし GOV-RULE-05/06/07 から due を自動導出する業務規則にはしない。

### この決定からは導出しない / 境界維持

```text
NOT derived / MUST NOT equate:
  3ヶ月に1回程度 = 90日
  91日目 = overdue
  3暦月経過 = 自動違反
  通知月に入った = overdue
  通知が出た = 業務違反
  duration_days = 90
```

GOV-RULE-05 / 06 / 07 再掲（変更しない）:

```text
GOV-RULE-05: Accepted
  初回 = 支援計画の有効開始日
  2回目以降 = 前回見直し日

GOV-RULE-06: Accepted
  「3ヶ月に1回程度」
  / calendar-month cadence
  / precision = approximate

GOV-RULE-07: Accepted / Option C
  見直し対象となる暦月に入ったら通知する
  意味 = 「見直し時期です」と職員へ知らせる
  precision = approximate
```

## Acceptance boundary

```text
hard due/overdue business rule: NOT ADOPTED
business violation engine: DO NOT START
reviewDueDate auto-derivation from cadence/anchor: DO NOT START
evaluateReviewDueRelativeToAsOf: UNCHANGED（technical helper only）
Decision-RD-3: HOLD（接近窓等の別技術単位。本 NOT ADOPTED を理由に開始しない）
SupportPlan Schema / SharePoint 変更: NOT STARTED
TypeScript business overdue type beyond logical not_adopted: NOT STARTED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
FindingCode values / numbering / mapping / DEC / A-5: DO NOT START
SharePoint / M365 / Entra / Deploy: NO-GO
real data: PROHIBITED
```

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| GOV-RULE-08 due / overdue | **Accepted / Option A / NOT ADOPTED** |
| GOV-RULE-05 / 06 / 07 | Accepted（UNCHANGED） |
| [`review-due-overdue-contract.md`](./review-due-overdue-contract.md) | Accepted logical（`kind: "not_adopted"`） |
| [`review-due.md`](./review-due.md) / `evaluateReviewDueRelativeToAsOf` | UNCHANGED（業務 due 定義ではない） |

## Next

```text
Next automatic: NONE
GOV-RULE-05 / 06 / 07 / 08 line: closed for current scope
  （08 = NOT ADOPTED; re-open only by new Human Decision）
Still HOLD / separate:
  Decision-RD-3
  Implementation Entry / Start for notice UI etc.（別 Gate）
```

Agent は本 Acceptance を理由に overdue 実装・90日規則・FindingCode / A-5 へ自動進行しない。

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** / tests/**: 本 Acceptance 記録では変更しない
evaluateReviewDueRelativeToAsOf: UNCHANGED
90/91-day overdue invention: FORBIDDEN
notice-month = overdue: FORBIDDEN
Implementation auto-start: FORBIDDEN
```
