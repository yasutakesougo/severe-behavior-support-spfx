# PLANNING-PC-DEMO-1 — Browser smoke evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: PLANNING-PC-DEMO-1 — Planning PC Synthetic Demo Slice
Kind: browser smoke
Status: PASS / VERIFIED
Date: 2026-08-18
Implementation Start: planning-pc-demo-1-implementation-start.md
Baseline main: dfb580bb71ebd4ffb5cdbe7733b3005e8fc3082c

Issue owner: #70
Issue #419 close: NOT AUTHORIZED
Schema change: NOT AUTHORIZED
LIVE WRITE / Deploy: NOT AUTHORIZED
presentationOnly: true
syntheticPlanningPcNavigationAuthorized: true
```

## Method

```text
Harness: spfx/smoke/planning-pc-demo-1/
Runner: node spfx/smoke/planning-pc-demo-1/run-smoke.mjs
CSS: ShellUx + DashboardUx + UsersUx + UserDetailUx + SupportPlanUx + ReviewDueStateUx
Artifacts (local): spfx/smoke/planning-pc-demo-1/artifacts/
presentationRole: PLANNER (primary), FIELD_STAFF (regression)
```

## Browser results

| Case | Assertion | Result |
|---|---|---|
| planner-support-plan-graph | 適用中 / 版3 / 手順 / 記録 / 過去版 / 見直しCTA / 禁止トークンなし | PASS |
| planner-review-materials-nested | SupportPlan → ReviewDueState under users | PASS |
| planner-back-to-support-plan | ReviewDueState → SupportPlan back | PASS |
| field-staff-demo-ux-4-regression | goals/actions preserved; planner blocks hidden | PASS |

```text
allPass: true
cases: 4 / 4
PLANNING_PC_DEMO_1_SLICE.id: PLANNING-PC-DEMO-1
SPFx Heft test: 268 / 268 PASS（support-plan.test 11 cases）
Root contract test: planning-pc-demo-graph-contract.test.ts 4 / 4 PASS
check:a11y: PASS（A11Y-HD-07 / A11Y-SP-01 / A11Y-DIS-04）
```

## PROCESS-VISIBILITY section-nav stale smoke realignment (PR #662)

```text
Unit: PLANNING-PC-DEMO-1-PROCESS-VISIBILITY-SECTION-NAV-STALE-SMOKE-EXPECTATION-EXACT-SLICE-DEFINITION-1
Definition: APPROVED / LOCKED
Implementation Start GO: RECEIVED / CONSUMED
  docs/architecture/planning-pc-demo-1-process-visibility-section-nav-stale-smoke-expectation-implementation-start-1.md
Changed path: spfx/smoke/planning-pc-demo-1/run-smoke.mjs only
Section-nav expectation:
  FROM: planning-pc-plan-records-heading
  TO:   planner-process-records-heading  (PROCESS-VISIBILITY ③ 記録)
Product / SupportPlan / process-nav copy: UNCHANGED
Issue #445 Close: NOT AUTHORIZED
Full Acceptance PRECHECK / re-execution: NOT AUTHORIZED
historical Full Acceptance rewrite: NOT AUTHORIZED
Baseline main at GO: 30f6019137d7e7b50a2dec02b038a285c9cf373c
Date: 2026-09-17
```

| Case | Assertion | Result |
|---|---|---|
| planner-support-plan-graph | 適用中 / 版3 / 手順 / 記録 / 過去版 / 見直しCTA / 禁止トークンなし | PASS |
| planner-section-navigation | PROCESS-VISIBILITY ③ 記録 (`planner-process-records-heading`) + `aria-current=location` + recent-records | PASS |
| planner-review-materials-nested | SupportPlan → ReviewDueState under users | PASS |
| planner-back-to-support-plan | ReviewDueState → SupportPlan back | PASS |
| field-staff-demo-ux-4-regression | goals/actions preserved; planner blocks hidden | PASS |

```text
allPass: true
cases: 5 / 5
head: b24e9f85+ (Implementation Start correction; see PR #662)
Artifacts: /opt/cursor/artifacts/planning-pc-demo-1-browser-smoke/
  smoke-report.json
  planner-section-navigation.png
Selected-state note:
  PROCESS-VISIBILITY PLANNER nav uses aria-current="location"
  (not aria-pressed). Smoke assert matches product; product UNCHANGED.
```
