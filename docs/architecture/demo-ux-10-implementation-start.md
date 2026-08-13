# DEMO-UX-10 — Implementation Start

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-10 — KPI / review count correspondence
Status: Implementation COMPLETE + Verification PASS
Human Selection: SELECTED / LOCKED（Decision-DEMO-UX-10-KPI-REVIEW-COUNT-1 / PR #324）
Human Implementation Start: GO（2026-08-13）
Baseline main: 9dd43e285c09218531260ffb565cf906b2b09574
Branch: cursor/demo-ux-10-kpi-review-count-selection-3507
PR: #324 OPEN / Draft
Implementation verified HEAD: 59f54f6915802ac837a91ead63b296ff738d45a2
Selection: decision-demo-ux-10-kpi-review-count-selection.md
Browser smoke: PASS / VERIFIED（demo-ux-10-browser-smoke.md）
Heft test: 83 / 83 PASS
Root test: 554 / 554 PASS
Ready / Merge: NOT AUTHORIZED
#299 Close: NOT AUTHORIZED
SharePoint / Entra mutation: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
```

## Verification state

```text
format:check: PASS
lint: PASS（root）
typecheck: PASS（root）
root test: PASS（554 / 554）
SPFx Heft test: PASS（83 / 83）
browser smoke demo-ux-10: PASS（8 / 8）
```

Depends on（再 Decision しない）:
[`decision-demo-ux-10-kpi-review-count-selection.md`](./decision-demo-ux-10-kpi-review-count-selection.md)
[`decision-demo-ux-8-users-list-status-filter-selection.md`](./decision-demo-ux-8-users-list-status-filter-selection.md)
[`decision-demo-ux-7-terminology-today-actions-selection.md`](./decision-demo-ux-7-terminology-today-actions-selection.md)
[`responsible-person-demo-v1-flow-review-feedback-record.md`](./responsible-person-demo-v1-flow-review-feedback-record.md)

## Authority

Human instruction `DEMO-UX-10 Implementation Start GO` authorizes this presentation-only implementation slice（RPF-006）.

Implementation Start does not authorize Ready, Merge, Deploy, SharePoint write, or #299 Close.

## Authorized IN

```text
RPF-006 Overview KPI ↔ 見直し件数の対応明示
Family R: Overview 要確認/未記録/期限接近 ↔ Users filter counts（3/2/3）
Family A: Review summary ↔ attentionItems（要確認3 / 期限接近2）
Family R ≠ Family A 非同等注記（名称・単位・補足）
presentation helpers in kpi-review-count.ts
unit tests + browser smoke demo-ux-10
feedback ledger RPF-006 status update
implementation-specific documentation
```

## Explicit OUT

```text
live I/O / SharePoint write / save
business-rule calculation / GOV-RULE
Users / Review cast rewrite for justification
RPF-004 / RPF-005 / DUX7-P2-1
large visual redesign
Ready / Merge / Deploy / #299 Close
```

## Must preserve

```text
DEMO-UX-7 today-action navigation
DEMO-UX-8 users filters
DEMO-UX-9 daily-record experience
access_denied / retrieval_failed fail-closed
事業所未選択時の停止
保存結果不明を成功/失敗へ丸めない
DEMO / synthetic 明示
```

## Slice flags

```text
DEMO_UX_10_SLICE.id = DEMO-UX-10
presentationOnly = true
kpiReviewCountCorrespondenceAuthorized = true
businessRuleCalculationAuthorized = false
usersFixtureRewriteAuthorized = false
reviewAttentionCastRewriteAuthorized = false
saveMutationAuthorized = false
sharePointWriteAuthorized = false
```

## Gate state

```text
Selection = SELECTED / LOCKED
Implementation Start = GO / COMPLETE
Verification = PASS
Ready = NOT AUTHORIZED
Merge = NOT AUTHORIZED
Deploy = NOT AUTHORIZED
#299 Close = NOT AUTHORIZED
```
