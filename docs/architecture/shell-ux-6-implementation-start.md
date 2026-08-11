# SHELL-UX-6 — Implementation Start

```text
Issue: #28
Unit: SHELL-UX-6 / C-A — Unauthenticated Fail-Closed Presentation Panel
Status: Implementation Start COMPLETE（presentation）+ browser smoke PASS
Human Selection: Decision-SHELL-UX-6-UNAUTHENTICATED-PANEL-1 = SELECTED / LOCKED
Selection merge: 2f749b706e1b6730623981a1b5510b75c866ce01（PR #249）
Human Implementation Start: GO（2026-08-11）
Independence: PASS（presentation-only；auth judgment / Entra / redirect OUT）
PR: #250
Browser smoke: PASS / VERIFIED（shell-ux-6-browser-smoke.md）
Heft test: 29 / 29 PASS
#28 Close: NOT AUTHORIZED
#21 authorization truth: OUT
#22 adapter continuation: NOT AUTHORIZED
```

Depends on（再 Decision しない）:
[`decision-shell-ux-6-unauthenticated-panel-selection.md`](./decision-shell-ux-6-unauthenticated-panel-selection.md)
[`decision-shell-ux-6-unauthenticated-panel-acceptance.md`](./decision-shell-ux-6-unauthenticated-panel-acceptance.md)

## Authority

```text
#249 Merge = Selection boundary only
#249 merge ≠ Implementation Start

This document records the separate Human GO for Implementation Start.
```

## Authorized IN

```text
未認証状態の共通 presentation
fail-closed copy
個人情報・業務データを表示しない
props / fixture driven
a11y / keyboard / focus
PC / tablet
unit tests / browser smoke
```

## Explicit OUT

```text
実際の認証判定
Entra / token handling
role resolution
#21 authorization semantics
REST / binder / live I/O
redirect / sign-in orchestration
liveTenantIoAuthorized = true
#28 Issue Close
Ready / Merge auto-progress
```

## Boundary markers

```text
SHELL_UX_SLICE.id = SHELL-UX-6
SHELL_UX_SLICE.liveTenantIoAuthorized = false
SHELL_UX_SLICE.sharePointRestAuthorized = false
SHELL_UX_SLICE.binderHostWiringAuthorized = false
SHELL_UX_SLICE.membershipLookupAuthorized = false
SHELL_UX_SLICE.authJudgmentAuthorized = false
SHELL_UX_SLICE.entraTokenHandlingAuthorized = false
SHELL_UX_SLICE.roleResolutionAuthorized = false
SHELL_UX_SLICE.redirectSignInOrchestrationAuthorized = false
unauthenticated = independent presentation state（props / fixture）
```

## Delivered surface

```text
spfx/src/shell/ux/unauthenticated.ts
spfx/src/shell/ux/UnauthenticatedPanel.tsx
spfx/src/shell/ux/shell-view-mode.ts（unauthenticated）
spfx/src/shell/ux/AppShellChrome.tsx
spfx/src/shell/ux/*.test.ts
spfx/smoke/shell-ux-6/*
docs/architecture/shell-ux-6-browser-smoke.md
```

## Stop / HOLD

```text
Do not Close #28
Do not continue #21 / #22
Do not implement auth judgment / Entra / token / role / redirect
Do not enable liveTenantIoAuthorized / REST / binder wiring
Do not auto-select other residual candidates
```
