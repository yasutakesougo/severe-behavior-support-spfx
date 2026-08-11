# SHELL-UX-2 — Implementation Start

```text
Issue: #28
Unit: SHELL-UX-2 — Save State Presentation
Status: Implementation Start COMPLETE（presentation）+ browser smoke PASS
Human Selection: Decision-SHELL-UX-2-SAVE-STATE-PRESENTATION-1 = SELECTED / LOCKED
Selection merge: ec20c12cf4a897aa906faefd9da6515eaaf5a023（PR #237）
Human Implementation Start: GO（2026-08-11）
Independence: PASS（presentation-only）
PR: #238
Browser smoke: PASS / VERIFIED（shell-ux-2-browser-smoke.md）
Heft test: 15 / 15 PASS
#28 Close: NOT AUTHORIZED
#22 adapter continuation: NOT AUTHORIZED
```

Depends on（再 Decision しない）:
[`decision-shell-ux-2-save-state-presentation-selection.md`](./decision-shell-ux-2-save-state-presentation-selection.md)
[`decision-shell-ux-2-save-state-presentation-acceptance.md`](./decision-shell-ux-2-save-state-presentation-acceptance.md)
[`shell-ux-1-implementation-start.md`](./shell-ux-1-implementation-start.md)

## Authority

```text
#237 Merge = Selection boundary only
#237 merge ≠ Implementation Start

This document records the separate Human GO for Implementation Start.
```

## Authorized IN

```text
未保存 / 保存中 / 保存済み / 保存失敗 / 保存結果不明
共通表示コンポーネント（SaveStateBadge + SaveStatePresentation）
props / enum による presentation-only 表示
presentation description（判定ロジックなし）
keyboard / accessibility（role / aria-live / labels）
PC / tablet layout for save-state surface
unit tests
browser smoke（SHELL-UX-2 harness）
```

## Explicit OUT

```text
SharePoint REST
live save
binder host wiring
liveTenantIoAuthorized = true
保存結果の判定ロジック
#22 adapter semantics
#21 authorization semantics
list schema / Internal Name mapping
business-specific screens
#28 Issue Close
Ready / Merge auto-progress
```

## Boundary markers

```text
SHELL_UX_SLICE.id = SHELL-UX-2
SHELL_UX_SLICE.liveTenantIoAuthorized = false
SHELL_UX_SLICE.sharePointRestAuthorized = false
SHELL_UX_SLICE.binderHostWiringAuthorized = false
保存結果不明 = independent presentation state（must not be collapsed）
```

## Delivered surface

```text
spfx/src/shell/ux/save-state.ts（descriptions + a11y helpers）
spfx/src/shell/ux/SaveStateBadge.tsx（a11y）
spfx/src/shell/ux/SaveStatePresentation.tsx（shared surface）
spfx/src/shell/ux/AppShellChrome.tsx（wire presentation）
spfx/src/shell/ux/*.test.ts
spfx/smoke/shell-ux-2/*
docs/architecture/shell-ux-2-browser-smoke.md
```

## Stop / HOLD

```text
Do not Close #28
Do not continue #22
Do not enable liveTenantIoAuthorized
Do not invent save-outcome judgment
```
