# DASHBOARD-UX-1 — Browser smoke evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: DASHBOARD-UX-1 — Overview presentation skeleton
Kind: browser smoke
Status: PASS / VERIFIED
Date: 2026-08-12
Implementation Start: dashboard-ux-1-implementation-start.md
Baseline tip: 045e95d（dashboard-design-v1 merge）
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
Artifacts: /opt/cursor/artifacts/dashboard-ux-1-browser-smoke/
```

## Results

| Case | Assertion | Result |
|---|---|---|
| desktop-overview-dashboard | overview skeleton；KPI 4 / action 3 / recent 2；disabled actions；fail-closed note；demo + site；no placeholder | PASS |
| desktop-users-placeholder | users destination keeps SHELL-UX-7 placeholder；overview dashboard hidden | PASS |
| tablet-overview-dashboard | 768px keeps overview skeleton + demo/site；no overflow | PASS |
| desktop-200-percent-equivalent | 640 CSS px / DPR 2 keeps overview skeleton + primary ops；no overflow | PASS |
| keyboard-overview-to-users | keyboard Tab/Enter overview→users；focus to users heading；overview dashboard hidden | PASS |

```text
allPass: true
cases: 5 / 5
DASHBOARD_UX_SLICE.id: DASHBOARD-UX-1
Heft test: 41 / 41 PASS
```

## Boundary held

```text
No live overview data / adapter fetch
No KPI navigation / action execution
No auth judgment / authorized appearance
No usable connected business UI claim
users / records destinations remain SHELL-UX-7 placeholders
demo / current site indicators remain visible
synthetic presentation note remains visible
```
