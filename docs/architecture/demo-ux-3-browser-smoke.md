# DEMO-UX-3 — Browser smoke evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: DEMO-UX-3 — User detail presentation
Kind: browser smoke
Status: PASS / VERIFIED
Date: 2026-08-12
Implementation Start: demo-ux-3-implementation-start.md
Baseline tip: 76b5fff（DEMO-UX-2 merge）
PR: #306

Parent: #299 RESPONSIBLE-PERSON-DEMO-V1

#299 Close: NOT AUTHORIZED
#28 Close: NOT AUTHORIZED
#71 admin-ui: NOT AUTHORIZED
presentationOnly: true
syntheticUserDetailNavigationAuthorized: true
liveUserDetailNavigationAuthorized: false
liveUsersDataAuthorized: false
planMutationAuthorized: false
recordMutationAuthorized: false
evaluationMutationAuthorized: false
sharePointRestAuthorized: false
binderHostWiringAuthorized: false
authJudgmentAuthorized: false
```

## Method

```text
Harness: spfx/smoke/demo-ux-3/
Runner: node spfx/smoke/demo-ux-3/run-smoke.mjs
CSS: sass compile of ShellUx.module.scss
     + DashboardUx.module.scss
     + UsersUx.module.scss
     + UserDetailUx.module.scss
     → SPFx theme tokens normalized to CSS defaults
     → served as smoke-production.css (linked from index.html)
JS modules: scss-module-stub assigns literal class names matching compiled CSS
Artifacts: /opt/cursor/artifacts/demo-ux-3-browser-smoke/
```

## Production CSS checks（source）

| Check | Result |
|---|---|
| userDetail width safety | PASS |
| supportList desktop 3 columns | PASS |
| supportList / stateGrid tablet stack @768px | PASS |
| stateGrid desktop 2 columns | PASS |

## Browser results

| Case | Assertion | Result |
|---|---|---|
| desktop-users-list-preview | Aさん detail preview enabled；B–H disabled；DEMO-UX-3 slice；no overflow | PASS |
| desktop-user-detail | current-support first；plan→records→evaluation→history；business/system separated | PASS |
| desktop-back-to-users | back returns to users list；focus moves to users heading | PASS |
| tablet-user-detail | 768px single-column support/state；no overflow | PASS |
| keyboard-users-to-detail | Enter on Aさん preview；focus on user-detail heading | PASS |

```text
allPass: true
cases: 5 / 5
DEMO_UX_3_SLICE.id: DEMO-UX-3
Heft test: 48 / 48 PASS
cssApplied verification: computed display flex/grid + smoke-production.css link
```

## Boundary held

```text
No live users data / adapter fetch
No live user detail route / deep link
No plan / record / evaluation mutation
No auth judgment / authorized appearance
No usable connected business UI claim
Aさん only = synthetic local preview via React state
overview destination remains DASHBOARD-UX-1 skeleton
records destination remains SHELL-UX-7 placeholder
demo / current site indicators remain visible
768px overflow claims backed by real UserDetailUx.module.scss in browser
```
