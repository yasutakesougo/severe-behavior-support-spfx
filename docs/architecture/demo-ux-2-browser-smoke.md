# DEMO-UX-2 — Browser smoke evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: DEMO-UX-2 — Users list presentation
Kind: browser smoke
Status: PASS / VERIFIED
Date: 2026-08-12
Implementation Start: demo-ux-2-implementation-start.md
Baseline tip: 6e66830（DASHBOARD-UX-1 merge）

Parent: #299 RESPONSIBLE-PERSON-DEMO-V1

#299 Close: NOT AUTHORIZED
#28 Close: NOT AUTHORIZED
#71 admin-ui: NOT AUTHORIZED
liveUsersDataAuthorized: false
userDetailNavigationAuthorized: false
filterExecutionAuthorized: true（DEMO-UX-8 synthetic filter）
sharePointRestAuthorized: false
binderHostWiringAuthorized: false
authJudgmentAuthorized: false
```

## Method

```text
Harness: spfx/smoke/demo-ux-2/
Runner: node spfx/smoke/demo-ux-2/run-smoke.mjs
CSS: sass compile of ShellUx.module.scss + DashboardUx.module.scss + UsersUx.module.scss
     → SPFx theme tokens normalized to CSS defaults
     → served as smoke-production.css (linked from index.html)
JS modules: scss-module-stub assigns literal class names matching compiled CSS
Artifacts: /opt/cursor/artifacts/demo-ux-2-browser-smoke/
```

## Production CSS checks（source）

| Check | Result |
|---|---|
| usersList width safety | PASS |
| userRow desktop 3 columns | PASS |
| userRow tablet stack @768px | PASS |

## Browser results

| Case | Assertion | Result |
|---|---|---|
| desktop-users-list | 8 synthetic rows；disabled filter/detail；fail-closed copy；no overflow | PASS |
| desktop-overview-unchanged | DASHBOARD-UX-1 overview preserved | PASS |
| desktop-records-placeholder | records remains SHELL-UX-7 placeholder | PASS |
| tablet-users-list | 768px single-column rows；no overflow | PASS |
| keyboard-overview-to-users | keyboard Tab/Enter overview→users；focus + users list | PASS |

```text
allPass: true
cases: 5 / 5
DEMO_UX_SLICE.id: DEMO-UX-2
Heft test: 45 / 45 PASS
cssApplied verification: computed display flex/grid + smoke-production.css link
```

## Boundary held

```text
No live users data / adapter fetch
No filter execution / user detail navigation
No auth judgment / authorized appearance
No usable connected business UI claim
overview destination remains DASHBOARD-UX-1 skeleton
records destination remains SHELL-UX-7 placeholder
demo / current site indicators remain visible
768px overflow claims backed by real UsersUx.module.scss in browser
```
