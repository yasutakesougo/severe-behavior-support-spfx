# SHELL-UX-1 — Implementation Start

```text
Issue: #28
Unit: SHELL-UX-1
Status: Implementation Start COMPLETE（presentation）+ browser smoke PASS
Human Selection: SELECTED（exact IN/OUT）
Independence: PASS
Human Implementation Start: GO
Code merge: 30a1656416e83917b5bad08b0278037c02b8e0fe（PR #235）
Browser smoke / IR P2: PASS / VERIFIED
  evidence: shell-ux-1-browser-smoke-p2-closeout.md
Branch（historical）: cursor/shell-ux-1-presentation-aafe
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
browser smoke closeout（Human Selection A）
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
next shell UX slice（SHELL-UX-2 SELECTED；Implementation Start GO recorded separately）
  see decision-shell-ux-2-save-state-presentation-acceptance.md
  see shell-ux-2-implementation-start.md
New Implementation Start for SHELL-UX-2（authorized only via shell-ux-2-implementation-start.md）
#28 Issue Close（NOT AUTHORIZED）
```

## Delivered surface（code）

```text
spfx/src/shell/ux/*
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.tsx
fixture-driven props from SHELL_UX_DEFAULT_FIXTURE
spfx/smoke/shell-ux-1/*（browser smoke harness）
```

## Boundary markers

```text
SHELL_UX_SLICE.liveTenantIoAuthorized = false
SHELL_UX_SLICE.sharePointRestAuthorized = false
SHELL_UX_SLICE.binderHostWiringAuthorized = false
```

## IR P2 closeout

```text
PR #235 Independent Review P2（browser smoke 未実施 / F-001）
= CLOSED / VERIFIED
See: shell-ux-1-browser-smoke-p2-closeout.md
```
