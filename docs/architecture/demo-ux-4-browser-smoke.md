# DEMO-UX-4 — Browser smoke evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: DEMO-UX-4 — Support plan presentation
Kind: browser smoke
Status: PASS / VERIFIED
Date: 2026-08-12
Implementation Start: demo-ux-4-implementation-start.md
Baseline tip: 506d522（DEMO-UX-3 merge）

Parent: #299 RESPONSIBLE-PERSON-DEMO-V1

#299 Close: NOT AUTHORIZED
#28 Close: NOT AUTHORIZED
presentationOnly: true
syntheticSupportPlanNavigationAuthorized: true
liveSupportPlanNavigationAuthorized: false
planMutationAuthorized: false
liveUsersDataAuthorized: false
sharePointRestAuthorized: false
binderHostWiringAuthorized: false
authJudgmentAuthorized: false
```

## Method

```text
Harness: spfx/smoke/demo-ux-4/
Runner: node spfx/smoke/demo-ux-4/run-smoke.mjs
CSS: sass compile of ShellUx + DashboardUx + UsersUx + UserDetailUx + SupportPlanUx
Artifacts: /opt/cursor/artifacts/demo-ux-4-browser-smoke/
```

## Production CSS checks（source）

| Check | Result |
|---|---|
| supportPlan width safety | PASS |
| stateGrid desktop 2 columns | PASS |
| stateGrid tablet stack @768px | PASS |

## Browser results

| Case | Assertion | Result |
|---|---|---|
| desktop-support-plan | goals/actions/review；mutation disabled；business/system separated | PASS |
| desktop-back-to-user-detail | back returns to Aさん detail；focus on heading | PASS |
| tablet-support-plan | 768px single-column state grid；no overflow | PASS |
| keyboard-detail-to-plan | Enter opens plan；focus on support-plan heading | PASS |
| desktop-users-list-baseline | users list preserved when plan closed | PASS |

```text
allPass: true
cases: 5 / 5
DEMO_UX_4_SLICE.id: DEMO-UX-4
Heft test: 52 / 52 PASS
```

## Boundary held

```text
No live plan mutation / adapter fetch
No live support plan route / deep link
No auth judgment / authorized appearance
Aさん only = synthetic local preview via React state
users list / user detail / overview / records placeholders preserved
demo / current site indicators remain visible
```
