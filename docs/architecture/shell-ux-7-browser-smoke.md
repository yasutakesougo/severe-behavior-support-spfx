# SHELL-UX-7 — Browser smoke evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: SHELL-UX-7 — Safe Navigation Destination Placeholders
Kind: browser smoke
Status: PASS / VERIFIED
Date: 2026-08-12
PR: #291
Implementation Start: shell-ux-7-implementation-start.md
Selection merge: b69740d04abcc5b21601e928b0b90980dbe5439b（PR #290）
Baseline tip: b69740d04abcc5b21601e928b0b90980dbe5439b

#28 Close: NOT AUTHORIZED
#21 auth judgment: OUT
#22 adapter: OUT
#68〜#71 business UI: OUT
Plans / Administration primary-nav expansion: OUT
liveTenantIoAuthorized: false
sharePointRestAuthorized: false
binderHostWiringAuthorized: false
businessDestinationAuthorized: false
plansAdministrationNavExpansionAuthorized: false
```

## Method

```text
Harness: spfx/smoke/shell-ux-7/
Runner: node spfx/smoke/shell-ux-7/run-smoke.mjs
Artifacts: /opt/cursor/artifacts/shell-ux-7-browser-smoke/
```

## Results

| Case | Assertion | Result |
|---|---|---|
| desktop-overview | heading 概要；未接続 copy；demo + current site；aria-current；nav = 概要/利用者/記録；no overflow；slice SHELL-UX-7 | PASS |
| desktop-users | heading 利用者；selected users only；fail-closed copy；demo/site maintained | PASS |
| desktop-records | heading 記録；selected records only；fail-closed copy；demo/site maintained | PASS |
| keyboard-destination-traversal | keyboard Tab/Enter overview→users→records；focus moves to destination heading | PASS |
| tablet-users | 768px keeps users destination + demo/site；no horizontal overflow | PASS |
| desktop-200-percent-equivalent | 640 CSS px / DPR 2 keeps overview destination + primary ops；no overflow | PASS |

```text
allPass: true
cases: 6 / 6
SHELL_UX_SLICE.id: SHELL-UX-7
```

## Boundary held

```text
No Plans / Administration primary-nav items
No live I/O / REST / binder
No auth judgment / authorized appearance
No usable business UI claim
current site / demo indicators remain visible
未接続 destination remains presentation-only placeholder
```
