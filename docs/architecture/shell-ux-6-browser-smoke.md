# SHELL-UX-6 — Browser smoke evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: SHELL-UX-6 / C-A — Unauthenticated Fail-Closed Presentation Panel
Kind: browser smoke
Status: PASS / VERIFIED
Date: 2026-08-11
PR: #250
Implementation Start: shell-ux-6-implementation-start.md
Selection merge: 2f749b706e1b6730623981a1b5510b75c866ce01（PR #249）

#28 Close: NOT AUTHORIZED
#21 auth judgment / Entra / token / role: OUT
redirect / sign-in orchestration: OUT
liveTenantIoAuthorized: false
sharePointRestAuthorized: false
binderHostWiringAuthorized: false
membershipLookupAuthorized: false
authJudgmentAuthorized: false
entraTokenHandlingAuthorized: false
roleResolutionAuthorized: false
redirectSignInOrchestrationAuthorized: false
```

## Method

```text
Harness: spfx/smoke/shell-ux-6/
Runner: node spfx/smoke/shell-ux-6/run-smoke.mjs
Artifacts: /opt/cursor/artifacts/shell-ux-6-browser-smoke/
```

## Results

| Case | Assertion | Result |
|---|---|---|
| unauthenticated-panel | panel + fail-closed copy；user/site/ready hidden；no sensitive display name；slice SHELL-UX-6 | PASS |
| ready-still-works | ready region + user display；unauthenticated panel absent | PASS |
| nav-disabled-when-unauthenticated | 概要/利用者/記録 disabled | PASS |
| keyboard-skip-focus | skip link focusable | PASS |
| tablet-unauthenticated | 768px keeps panel；no sensitive name；ready absent | PASS |

```text
allPass: true
cases: 5 / 5
SHELL_UX_SLICE.id: SHELL-UX-6
```

## Boundary held

```text
No auth judgment / Entra / token / role / redirect
No REST / binder / live I/O
unauthenticated remains independent presentation state
個人情報・業務データ非表示
```
