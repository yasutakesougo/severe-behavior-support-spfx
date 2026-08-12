# DEMO-UX-5 — Browser smoke evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: DEMO-UX-5 — Daily record presentation
Kind: browser smoke
Status: PASS / VERIFIED
Date: 2026-08-12
Implementation Start: demo-ux-5-implementation-start.md
Baseline tip: 88e9711（DEMO-UX-4 merge）
PR: #310
HEAD: 4c86906907ad4d27f45269f44e014fa174ad9b7f
Contracts CI: SUCCESS（run 31593162681）
Evidence Refresh: GO（2026-08-12）

Parent: #299 RESPONSIBLE-PERSON-DEMO-V1

#299 Close: NOT AUTHORIZED
#28 Close: NOT AUTHORIZED
presentationOnly: true
syntheticDailyRecordPresentationAuthorized: true
liveDailyRecordNavigationAuthorized: false
liveTenantIoAuthorized: false
sharePointRestAuthorized: false
binderHostWiringAuthorized: false
adapterFetchAuthorized: false
authJudgmentAuthorized: false
liveRecordDataAuthorized: false
dailyActivityRecordsReuseAuthorized: false
recordMutationAuthorized: false
evaluationMutationAuthorized: false
```

## Method

```text
Harness: spfx/smoke/demo-ux-5/
Runner: node spfx/smoke/demo-ux-5/run-smoke.mjs
CSS: sass compile of ShellUx + DashboardUx + UsersUx + UserDetailUx
     + SupportPlanUx + DailyRecordsUx
Artifacts: /opt/cursor/artifacts/demo-ux-5-browser-smoke/
```

## Production CSS checks（source）

| Check | Result |
|---|---|
| dailyRecords width safety（min-width: 0） | PASS |
| stateGrid desktop 2 columns | PASS |
| stateGrid tablet stack @768px | PASS |

## Browser results

| Case | Assertion | Result |
|---|---|---|
| desktop-daily-records | 記録入力 / 未完了確認 / 最近の記録；mutation disabled；business/system separated；placeholder absent | PASS |
| tablet-daily-records | 768px single-column state grid；no overflow | PASS |
| keyboard-nav-to-records | Enter on 記録 nav；focus on daily-record heading | PASS |
| desktop-overview-baseline | overview preserved when records closed | PASS |
| desktop-users-list-baseline | users list preserved when records closed | PASS |

```text
allPass: true
cases: 5 / 5
DEMO_UX_5_SLICE.id: DEMO-UX-5
Heft test: 56 / 56 PASS
cssApplied verification: computed display flex + smoke-production.css link
```

## Boundary held

```text
No live record mutation / adapter fetch
No DailyActivityRecords reuse / schema mutation / live list wiring
No auth judgment / authorized appearance
records destination = DEMO-UX-5 synthetic presentation（not SHELL-UX-7 placeholder）
overview / users list / user detail / support plan presentation preserved
demo / current site indicators remain visible
768px overflow claims backed by real DailyRecordsUx.module.scss in browser
```
