# DEMO-UX-6 — Browser smoke evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: DEMO-UX-6 — Review status & due-state presentation
Kind: browser smoke
Status: PASS / VERIFIED
Date: 2026-08-12
Implementation Start: demo-ux-6-implementation-start.md
Baseline tip: 6eeb188（DEMO-UX-5 merge）
Branch: cursor/demo-ux-6-review-due-state-21d0

Parent: #299 RESPONSIBLE-PERSON-DEMO-V1

#299 Close: NOT AUTHORIZED
presentationOnly: true
syntheticReviewDuePresentationAuthorized: true
liveReviewStatusReadAuthorized: false
liveDueStateCalculationAuthorized: false
liveTenantIoAuthorized: false
sharePointRestAuthorized: false
binderHostWiringAuthorized: false
adapterFetchAuthorized: false
authJudgmentAuthorized: false
liveReviewDataAuthorized: false
reviewMutationAuthorized: false
evaluationMutationAuthorized: false
govRuleDecisionAuthorized: false
```

## Method

```text
Harness: spfx/smoke/demo-ux-6/
Runner: node spfx/smoke/demo-ux-6/run-smoke.mjs
CSS: sass compile of ShellUx + DashboardUx + UsersUx + UserDetailUx
     + SupportPlanUx + DailyRecordsUx + ReviewDueStateUx
Artifacts: /opt/cursor/artifacts/demo-ux-6-browser-smoke/
```

## Production CSS checks（source）

| Check | Result |
|---|---|
| reviewDueState width safety | PASS |
| stateGrid desktop 2 columns | PASS |
| stateGrid tablet stack @768px | PASS |

## Browser results

| Case | Assertion | Result |
|---|---|---|
| desktop-review-due | 確認待ち / 期限接近 labels；mutation disabled；business/system separated | PASS |
| desktop-back-to-overview | back returns to 概要；focus on overview heading | PASS |
| tablet-review-due | 768px single-column state grid；no overflow | PASS |
| keyboard-overview-to-review-due | Enter opens review due；focus on heading | PASS |
| desktop-overview-baseline | overview + preview entry preserved when closed | PASS |
| desktop-records-baseline | DEMO-UX-5 records destination preserved | PASS |

```text
allPass: true
cases: 6 / 6
DEMO_UX_6_SLICE.id: DEMO-UX-6
Heft test: 60 / 60 PASS
```

## Boundary held

```text
No live due calculation / review mutation / adapter fetch
No GOV-RULE decision / change
No auth judgment / authorized appearance
Overview / users / support plan / daily records presentation preserved
demo / current site indicators remain visible
期限接近 / 確認待ち remain synthetic display labels
```
