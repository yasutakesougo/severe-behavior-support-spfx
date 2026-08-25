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
| desktop-review-due | 要確認 / 期限接近 labels；semantic basis = 初回 anchor + caller-supplied due + 暦月 notice；mutation disabled；business/system separated | PASS |
| desktop-review-due-subsequent-anchor | semantic basis = 継続 anchor（前回見直し日）; due / notice semantics unchanged | PASS |
| desktop-review-observation-association | exact historical ProcedureRecord context；associated Observation evidence；no mutation | PASS |
| desktop-review-observation-unresolved | unresolved association；no Observation evidence；no Active fallback | PASS |
| desktop-back-to-overview | back returns to 概要；focus on overview heading | PASS |
| tablet-review-due | 768px single-column state grid；no overflow | PASS |
| keyboard-overview-to-review-due | Enter opens review due；focus on heading | PASS |
| desktop-overview-baseline | overview + preview entry preserved when closed | PASS |
| desktop-records-baseline | DEMO-UX-5 records destination preserved | PASS |

```text
allPass: true
cases: 9 / 9
DEMO_UX_6_SLICE.id: DEMO-UX-6
Heft test: 301 / 301 PASS
```

## Boundary held

```text
No live due calculation / review mutation / adapter fetch
No GOV-RULE decision / change
No auth judgment / authorized appearance
Overview / users / support plan / daily records presentation preserved
demo / current site indicators remain visible
要確認 / 期限接近 remain synthetic display labels
semantic basis distinguishes:
  初回 = 支援計画の有効開始日
  継続 = 前回見直し日
  notice = 見直し対象の暦月に入ったら
  Observation association = exact historical context only
  unresolved / mismatch = fail-closed; no Active fallback
```

## SP-LC-6 stale smoke expectation realignment (PR #515)

```text
Unit: SP-LC-6-DEMO-UX-6-STALE-SMOKE-EXPECTATION-EXACT-SLICE-DEFINITION-1
Implementation Start GO: RECEIVED / CONSUMED
Changed path: spfx/smoke/demo-ux-6/run-smoke.mjs only
Banner expectation: VP1_DEMO_SAFETY_NOTICE
  "デモ環境｜表示内容は合成データです。保存されません。"
Product / DemoBanner / VP-1 copy: UNCHANGED
Acceptance re-execution: NOT AUTHORIZED
```

| Case | Result |
|---|---|
| desktop-review-due-subsequent-anchor | PASS |
| desktop-review-due | PASS |
| tablet-review-due | PASS |
| remaining DEMO-UX-6 cases (6) | PASS |

```text
allPass: true
cases: 9 / 9
```
