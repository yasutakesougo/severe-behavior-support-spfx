# Decision-RD-3 — モニタリング時期表示・通知 Human Acceptance

この文書は、**Decision-RD-3**（見直し接近窓・期限算出・超過後ポリシー）についての
**Human Acceptance 正本（LOCKED）** である。

論理契約: [`review-monitoring-guidance-contract.md`](./review-monitoring-guidance-contract.md)

Selected via: [`decision-ilb-1-next-residual-decision-selection.md`](./decision-ilb-1-next-residual-decision-selection.md)
（ILB-1 residual Option C）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-RD-3
Status: Accepted / LOCKED
Human Acceptance: Explicit Human Decision-RD-3 on 2026-08-09
Selected via: ILB1_NEXT_RESIDUAL_DECISION_SELECTION Option C

LOCKED:

モニタリング時期:
  「3か月に1回程度」を目安として表示・通知する
扱い:
  informational only
採用しない:
  期限超過という状態
  期限超過警告
  期限超過による業務制限
  90日固定
  hard due / overdue
FindingCode:
  HOLD
A-5:
  HOLD
Implementation Start:
  HOLD

Design intent（固定）:
  「モニタリングをしなくてよい」ではない
  制度・業務上の「3か月に1回程度の見直し」は維持する
  アプリが独自に「期限切れ」「違反」と判定して現場業務を止めない

Implementation auto-start: FORBIDDEN
evaluateReviewDueRelativeToAsOf: UNCHANGED
日数接近窓の domain 埋め込み: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Acceptance: Explicit Human Decision-RD-3 on 2026-08-09
Decision-RD-3: Accepted / LOCKED

モニタリング時期:
  「3か月に1回程度」を目安として表示・通知する
扱い:
  informational only
採用しない:
  期限超過という状態
  期限超過警告
  期限超過による業務制限
  90日固定
  hard due / overdue
```

理由（Human / 設計意図）:

```text
「モニタリングをしなくてよい」という意味ではない。
制度・業務上の「3か月に1回程度の見直し」は維持しつつ、
アプリが独自に「期限切れ」「違反」と判定して現場業務を止めない。
```

```text
Agent recommendation: NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-RD-3: Accepted / LOCKED

Monitoring guidance:
  display / notify 「3か月に1回程度」 as a guide
  meaning = informational only
  aligns with GOV-RULE-06 practice cadence（「3ヶ月に1回程度」）
  institutional / operational review cadence: MAINTAINED
  does NOT mean monitoring is optional or unnecessary
  does NOT create a hard day-count approach window
  does NOT let the app stop field work via overdue / violation

NOT ADOPTED:
  期限超過という状態
  期限超過警告
  期限超過による業務制限
  90日固定
  hard due / overdue（GOV-RULE-08 と整合）
```

論理表現（schema / UI 実装ではない）:

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

意味:

- 制度・業務上の「3か月に1回程度の見直し」は **維持**する。
- アプリ上の扱いは、GOV-RULE-06 の practice cadence を
  **目安として表示・通知**する情報提供に留める。
- 「モニタリング不要」や「見直ししなくてよい」を意味しない。
- アプリが独自に「期限切れ」「違反」と判定して現場業務を止めない。
- 日数固定の接近窓エンジン、期限超過状態、超過警告、業務制限を採択しない。
- `90日` への変換、hard due / overdue を採択しない（GOV-RULE-08 と整合）。

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  informational only = モニタリング不要
  informational only = 見直ししなくてよい
  3か月に1回程度 = 90日
  3ヶ月に1回程度 = 90日
  目安表示 = hard due
  通知 = 業務違反 / 現場業務停止
  過ぎた = overdue 状態 / 業務制限
  duration_days = 90
  day-count approach window in domain
```

既存契約との関係（変更しない）:

```text
GOV-RULE-05: Accepted（基準日）
GOV-RULE-06: Accepted（「3ヶ月に1回程度」/ approximate）
GOV-RULE-07: Accepted / Option C（対象暦月通知 / informational）
GOV-RULE-08: Accepted / Option A / NOT ADOPTED（hard due/overdue）
evaluateReviewDueRelativeToAsOf: UNCHANGED（technical helper only）
```

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  FindingCode 作成
  A-5
  Implementation Start
  Schema / SharePoint / UI / job 実装
  reviewDueDate 自動算出
  日数接近窓定数の domain 埋め込み
  hard due / overdue 再採択
  業務制限・違反エンジン
  GOV-AUD-05 / 他 inventory 行の Accepted
  SharePoint / M365 / Deploy / real data
```

## ILB-1 との関係

```text
Decision-ILB-1 Human Policy: FINAL CONSISTENT（上位方針）
本 Acceptance: 個別 Decision（RD-3）を一件判定した結果
他 inventory provisional 行: NOT Accepted by this document
```

## Consistency / Independent Review

正本整合: [`decision-rd-3-canonicalization-consistency-check.md`](./decision-rd-3-canonicalization-consistency-check.md)

Independent Review: [`decision-rd-3-independent-review.md`](./decision-rd-3-independent-review.md)

```text
Docs-internal consistency: CONSISTENT
Independent Review: PASS（P0=0 / P1=0 / P2=0）
FINAL CONSISTENT: after PR Merge attestation
```

## Next

```text
Decision-RD-3: Accepted / LOCKED
Consistency: CONSISTENT（docs-internal）
Next:
  Review / Merge → FINAL CONSISTENT 同期
  他残存 Decision は一件ずつ（自動選定しない）
FindingCode / A-5 / Implementation: HOLD
```
