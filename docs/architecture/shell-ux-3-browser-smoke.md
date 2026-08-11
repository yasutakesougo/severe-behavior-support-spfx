# SHELL-UX-3 — Browser smoke evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: SHELL-UX-3 / C-B — Display-only Multi-Site Selector
Kind: browser smoke
Status: PASS / VERIFIED
Date: 2026-08-11
PR: #241
Implementation Start: shell-ux-3-implementation-start.md
Selection merge: 205954111bf37c19e178bb2042864b86c176c270（PR #240）

#28 Close: NOT AUTHORIZED
#21 membership / authorization truth: OUT
#22 adapter continuation: NOT AUTHORIZED
liveTenantIoAuthorized: false
sharePointRestAuthorized: false
binderHostWiringAuthorized: false
membershipLookupAuthorized: false
```

## Method

```text
Harness: spfx/smoke/shell-ux-3/
Runner: node spfx/smoke/shell-ux-3/run-smoke.mjs
Artifacts: /opt/cursor/artifacts/shell-ux-3-browser-smoke/
```

## Results

| Case | Assertion | Result |
|---|---|---|
| unselected-stop | selector + stop chrome；ready absent；nav disabled | PASS |
| selected-isg-ready | SITE-ISG label + ready；stop absent；nav enabled | PASS |
| selected-hom-ready | SITE-HOM label + ready；stop absent | PASS |
| interactive-select-isg | unselected → click ISG clears stop | PASS |
| keyboard-site-selector | Tab reaches site radio group | PASS |
| tablet-unselected | 768px keeps stop / no ready | PASS |

```text
allPass: true
cases: 6 / 6
SHELL_UX_SLICE.id: SHELL-UX-3
```

## Boundary held

```text
No membership lookup
No Entra / SharePoint authorization truth
No REST / live save / binder wiring
未選択 remains independent stop state
```
