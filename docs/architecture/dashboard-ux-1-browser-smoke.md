# DASHBOARD-UX-1 — Browser smoke evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: DASHBOARD-UX-1 — Overview presentation skeleton
Kind: browser smoke
Status: PASS / VERIFIED
Date: 2026-08-12
Implementation Start: dashboard-ux-1-implementation-start.md
Baseline tip: 045e95d（dashboard-design-v1 merge）
Revision: production CSS applied（P1 Fresh Review fix）

Parent: #299 RESPONSIBLE-PERSON-DEMO-V1

#299 Close: NOT AUTHORIZED
#28 Close: NOT AUTHORIZED
#71 admin-ui: NOT AUTHORIZED
liveOverviewDataAuthorized: false
kpiNavigationAuthorized: false
actionExecutionAuthorized: false
sharePointRestAuthorized: false
binderHostWiringAuthorized: false
authJudgmentAuthorized: false
```

## Method

```text
Harness: spfx/smoke/dashboard-ux-1/
Runner: node spfx/smoke/dashboard-ux-1/run-smoke.mjs
CSS: sass compile of ShellUx.module.scss + DashboardUx.module.scss
     → SPFx theme tokens normalized to CSS defaults
     → served as smoke-production.css (linked from index.html)
JS modules: scss-module-stub assigns literal class names matching compiled CSS
Artifacts: /opt/cursor/artifacts/dashboard-ux-1-browser-smoke/
```

## Production CSS checks（source）

| Check | Result |
|---|---|
| kpiGrid desktop 4 columns | PASS |
| kpiGrid tablet 2 columns @768px | PASS |
| kpiGrid narrow 1 column @480px | PASS |
| overviewDashboard width safety | PASS |

## Browser results

| Case | Assertion | Result |
|---|---|---|
| desktop-overview-dashboard | real CSS loaded；computed grid 4 columns；no overflow | PASS |
| desktop-users-placeholder | users placeholder；real shell CSS；overview hidden | PASS |
| tablet-overview-dashboard | 768px；computed grid 2 columns；no overflow | PASS |
| desktop-200-percent-equivalent | 640 CSS px / DPR 2；computed grid 2 columns；no overflow | PASS |
| keyboard-overview-to-users | keyboard Tab/Enter overview→users；focus + placeholder；CSS loaded | PASS |

```text
allPass: true
cases: 5 / 5
DASHBOARD_UX_SLICE.id: DASHBOARD-UX-1
Heft test: 41 / 41 PASS
cssApplied verification: computed display grid/flex + smoke-production.css link
```

## Boundary held

```text
No live overview data / adapter fetch
No KPI navigation / action execution
No auth judgment / authorized appearance
No usable connected business UI claim
users / records destinations remain SHELL-UX-7 placeholders
demo / current site indicators remain visible
768px / 200% overflow claims backed by real DashboardUx.module.scss in browser
```
