# GOV-RULE-06 — Review cadence Human Acceptance

この文書は、**GOV-RULE-06**（見直し周期 practice cadence）についての
**Human Acceptance evidence** である。

source review 正本: [`decision-gov-rule-06-review-cadence-source-review.md`](./decision-gov-rule-06-review-cadence-source-review.md)

論理契約正本: [`review-cadence-contract.md`](./review-cadence-contract.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-RC-1 / GOV-RULE-06
Status: Accepted
Human Acceptance: Explicit Human GOV-RULE-06 acceptance on 2026-08-09
Accepted cadence:
  「3ヶ月に1回程度」
  / calendar-month cadence
  / precision = approximate
Source review: PASS
Independent Review (PR #135): PASS
main baseline before acceptance write: 5cc03cffcdfbdd5c5a6e1ca9e1d9fbbaa4718a52
GOV-RULE-05 基準日: Accepted（別正本 decision-gov-rule-05-review-anchor-acceptance.md）
GOV-RULE-07 通知開始: Accepted（別正本 decision-gov-rule-07-notice-acceptance.md / Option C）
GOV-RULE-08 due / overdue 定義: Accepted / Option A / NOT ADOPTED（別正本 decision-gov-rule-08-due-overdue-acceptance.md）
duration_days = 90: NOT AUTHORIZED
Decision-RD-3: HOLD（接近窓・算出・超過後。本 Acceptance に含めない）
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
NOT derived: 90日 / 91日目 overdue / 3暦月自動違反
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit Human GOV-RULE-06 acceptance on 2026-08-09
Decision-RC-1 / GOV-RULE-06: Accepted
Selected meaning:
  「3ヶ月に1回程度」
  calendar-month cadence
  precision = approximate
Logical representation:
  ReviewCadence = { unit: "month"; interval: 3; precision: "approximate" }
```

```text
Agent recommendation / Independent Review: NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
GOV-RULE-06: Accepted
Human decision:
  「3ヶ月に1回程度」
  / calendar-month cadence
  / precision = approximate
ReviewCadence = {
  unit: "month";
  interval: 3;
  precision: "approximate";
}
```

意味:

- 支援運用上の見直し周期として「3ヶ月に1回程度」を採択する。
- 表現は暦月 cadence かつ approximate であり、厳密な日数期限エンジンではない。
- 法令上の全国一律「90日以内」必須値としては採択しない。

### この決定からは導出しない

```text
NOT derived from GOV-RULE-06 Accepted:
  90日
  91日目から overdue
  3暦月経過で自動違反
  duration_days = 90（NOT AUTHORIZED as canonical cadence）
```

## Acceptance boundary

今回の Human Acceptance は次を意味しない。境界は維持する。

```text
GOV-RULE-05 基準日: Accepted（別 Decision / [`decision-gov-rule-05-review-anchor-acceptance.md`](./decision-gov-rule-05-review-anchor-acceptance.md)）
GOV-RULE-07 通知開始: Accepted（別正本 decision-gov-rule-07-notice-acceptance.md / Option C）
GOV-RULE-08 due / overdue 定義: Accepted / Option A / NOT ADOPTED（別正本 decision-gov-rule-08-due-overdue-acceptance.md）
duration_days = 90: NOT AUTHORIZED
Decision-RD-3 接近窓・期限算出・超過後ポリシー: HOLD
reviewDueDate 自動算出: NOT STARTED
evaluateReviewDueRelativeToAsOf: UNCHANGED
SupportPlan Schema / SharePoint 変更: NOT STARTED
TypeScript / validator / fixture 実装: NOT STARTED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
FindingCode values / numbering / mapping / DEC / A-5: DO NOT START from this Acceptance
SharePoint / M365 / Entra / Deploy: NO-GO
real data: PROHIBITED
```

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| GOV-RULE-06 practice cadence | **Accepted** |
| GOV-RULE-05 基準日 | **Accepted**（別正本） |
| [`review-cadence-contract.md`](./review-cadence-contract.md) | Accepted logical contract（実装は別 Entry） |
| [`review-anchor-contract.md`](./review-anchor-contract.md) | Accepted logical contract（実装は別 Entry） |
| [`review-due.md`](./review-due.md) / `evaluateReviewDueRelativeToAsOf` | UNCHANGED |
| Issue #24 89/90/91 境界 | practice cadence の根拠にしない（技術エンジン境界として分離可） |

## Next

```text
Next automatic: NONE
Human may separately decide:
  GOV-RULE-07 / 08
  Decision-RD-3
  Implementation Entry / Start（別 Gate）
```

Agent は本 Acceptance を理由に Implementation・Schema・90日規則・FindingCode / A-5 へ自動進行しない。

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
