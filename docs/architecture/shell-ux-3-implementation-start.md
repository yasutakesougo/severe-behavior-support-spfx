# SHELL-UX-3 — Implementation Start

```text
Issue: #28
Unit: SHELL-UX-3 / C-B — Display-only Multi-Site Selector
Status: Implementation Start COMPLETE（presentation）+ browser smoke PASS
Human Selection: Decision-SHELL-UX-3-MULTI-SITE-SELECTOR-1 = SELECTED / LOCKED
Selection merge: 205954111bf37c19e178bb2042864b86c176c270（PR #240）
Human Implementation Start: GO（2026-08-11）
Independence: PASS（presentation-only；membership OUT）
PR: #241
Browser smoke: PASS / VERIFIED（shell-ux-3-browser-smoke.md）
Heft test: 19 / 19 PASS
#28 Close: NOT AUTHORIZED
#21 authorization truth: OUT
#22 adapter continuation: NOT AUTHORIZED
```

Depends on（再 Decision しない）:
[`decision-shell-ux-3-multi-site-selector-selection.md`](./decision-shell-ux-3-multi-site-selector-selection.md)
[`decision-shell-ux-3-multi-site-selector-acceptance.md`](./decision-shell-ux-3-multi-site-selector-acceptance.md)

## Authority

```text
#240 Merge = Selection boundary only
#240 merge ≠ Implementation Start

This document records the separate Human GO for Implementation Start.
```

## Authorized IN

```text
複数事業所を選択する presentation UI
SITE-ISG / SITE-HOM の表示選択肢
未選択状態
未選択時の shell-level stop chrome
keyboard / focus / a11y
PC / tablet layout
unit tests / browser smoke
props / fixture presentation-only state
```

## Explicit OUT

```text
実際の所属事業所判定
Entra / SharePoint membership lookup
authorization truth / #21 semantics
REST / binder / live I/O
liveTenantIoAuthorized = true
business data / #22 semantics
#28 Issue Close
Ready / Merge auto-progress
```

## Boundary markers

```text
SHELL_UX_SLICE.id = SHELL-UX-3
SHELL_UX_SLICE.liveTenantIoAuthorized = false
SHELL_UX_SLICE.sharePointRestAuthorized = false
SHELL_UX_SLICE.binderHostWiringAuthorized = false
SHELL_UX_SLICE.membershipLookupAuthorized = false
未選択 = independent presentation state → stop chrome
```

## Delivered surface

```text
spfx/src/shell/ux/site-selection.ts
spfx/src/shell/ux/SiteSelector.tsx
spfx/src/shell/ux/SiteUnselectedStop.tsx
spfx/src/shell/ux/AppShellChrome.tsx
spfx/src/shell/ux/*.test.ts
spfx/smoke/shell-ux-3/*
docs/architecture/shell-ux-3-browser-smoke.md
```

## Stop / HOLD

```text
Do not Close #28
Do not continue #21 / #22
Do not enable membership lookup or liveTenantIoAuthorized
Do not auto-select other residual candidates
next shell UX slice（SHELL-UX-4 / C-D SELECTED / Implementation Start NOT AUTHORIZED）
  see decision-shell-ux-4-partial-retrieval-acceptance.md
```
