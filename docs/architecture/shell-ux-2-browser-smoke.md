# SHELL-UX-2 — Browser smoke evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: SHELL-UX-2 — Save State Presentation
Kind: browser smoke
Status: PASS / VERIFIED
Date: 2026-08-11
PR: #238
Implementation Start: shell-ux-2-implementation-start.md
Selection merge: ec20c12cf4a897aa906faefd9da6515eaaf5a023（PR #237）

#28 Close: NOT AUTHORIZED
#22 adapter continuation: NOT AUTHORIZED
liveTenantIoAuthorized: false
sharePointRestAuthorized: false
binderHostWiringAuthorized: false
```

## Method

```text
Harness: spfx/smoke/shell-ux-2/
Runner: node spfx/smoke/shell-ux-2/run-smoke.mjs
Artifacts: /opt/cursor/artifacts/shell-ux-2-browser-smoke/
```

## Results

| Case | Assertion | Result |
|---|---|---|
| save-unsaved | presentation + badge + description + aria-live=polite | PASS |
| save-saving | presentation + badge + description + aria-live=polite | PASS |
| save-saved | presentation + badge + description + aria-live=polite | PASS |
| save-save_failed | presentation + badge + description + aria-live=assertive | PASS |
| save-save_outcome_unknown | independent label/description; not collapsed | PASS |
| tablet-save-outcome-unknown | 768px viewport keeps 保存結果不明 independent | PASS |
| keyboard-skip-focus | skip link still focusable | PASS |

```text
allPass: true
cases: 7 / 7
SHELL_UX_SLICE.id: SHELL-UX-2
```

## Boundary held

```text
No SharePoint REST
No live save
No binder host wiring
No save-outcome judgment logic
保存結果不明 remains independent
```
