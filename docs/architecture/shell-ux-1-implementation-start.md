# SHELL-UX-1 — Implementation Start

```text
Issue: #28
Unit: SHELL-UX-1
Status: Implementation Start AUTHORIZED / IN PROGRESS
Human Selection: SELECTED（exact IN/OUT）
Independence: PASS
Human Implementation Start: GO
Branch: cursor/shell-ux-1-presentation-aafe
```

## Authorized IN

```text
presentation chrome
demo banner
保存5状態 presentation components
loading / access-denied / retrieval-failed panels
PC / tablet basic layout
keyboard / focus affordances
current-site label（display-only；props / fixture）
synthetic/local UI tests
```

## Explicit OUT

```text
SharePoint REST
list schema / Internal Name mapping
tenant observation
live R/W
binder host wiring
liveTenantIoAuthorized = true
#21 authorization truth
Entra group resolution
#19 unresolved governance
ABC / Observation / SupportPlan / Finding business screens
未Acceptedの業務意味
Ready / Merge auto-progress
#22 adapter continuation
```

## Delivered surface（code）

```text
spfx/src/shell/ux/*
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.tsx
fixture-driven props from SHELL_UX_DEFAULT_FIXTURE
```

## Boundary markers

```text
SHELL_UX_SLICE.liveTenantIoAuthorized = false
SHELL_UX_SLICE.sharePointRestAuthorized = false
SHELL_UX_SLICE.binderHostWiringAuthorized = false
```
