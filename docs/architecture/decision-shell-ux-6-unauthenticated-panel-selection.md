# SHELL-UX-6 — Unauthenticated Fail-Closed Presentation Panel — Human Selection Packet

この文書は、Issue #28 Close criteria reassessment-3 FAIL（PR #248）後の
**次 shell UX slice** として **C-A** を固定する docs-only Selection Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-SHELL-UX-6-UNAUTHENTICATED-PANEL-1
Kind: Human Selection（Issue #28 next slice / candidate C-A）
Status: SELECTED / LOCKED（GO boundary）
Human Decision: SELECT C-A / SHELL-UX-6
Date: 2026-08-11
PR: #249（Selection / Acceptance only）

Baseline:
  main tip = 8fb0ef22c2ba5e5be378410020597657d2af6fca
  SHELL-UX-5 = MERGED（PR #247）
  Close criteria reassessment-3 = FAIL / KEEP OPEN（PR #248）

Candidate origin:
  issue-28-close-criteria-reassessment-3.md → C-A
  Issue #28 必須tests「未認証画面」

Implementation Start: NOT AUTHORIZED（separate Human GO）
#28 Close: NOT AUTHORIZED
#21 authorization truth: OUT
#22 adapter continuation: NOT AUTHORIZED
Agent auto-select: FORBIDDEN（this Selection is Human）
```

## 1. Why this slice now

```text
Close criteria FAIL の残 candidate のうち、
C-A（未認証 fail-closed presentation panel）は
Issue #28 必須tests「未認証画面」と
担当範囲の安全な画面境界に直接対応する。

#21 の実際の認証判定・Entra / token / role には踏み込まず、
props / fixture 駆動の presentation だけを先に固定する。
未認証表示で個人情報・業務データを出さない境界を shell 側で先に固定する。
```

## 2. Selected unit

```text
C-A / SHELL-UX-6
Unauthenticated fail-closed presentation panel
```

## 3. Authorized IN（Selection scope）

```text
IN:
  未認証状態の共通 presentation
  fail-closed copy
  個人情報・業務データを表示しない
  props / fixture driven
  a11y
  keyboard / focus
  PC / tablet
  unit tests
  browser smoke
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  実際の認証判定
  Entra / token handling
  role resolution
  #21 authorization semantics
  REST
  binder
  live I/O
  redirect / sign-in orchestration
  liveTenantIoAuthorized = true
  #28 Issue Close
  Ready / Merge auto-progress
  Implementation Start（this Selection alone）
  他 residual candidate（C-F′ / C-G / C-H）の自動選択
```

## 5. Options considered

| ID | Unit | Result |
|---|---|---|
| **C-A** | Unauthenticated fail-closed presentation panel | **SELECTED** |
| C-F′ | Primary-nav keyboard traversal evidence | NOT SELECTED |
| C-G | Horizontal-scroll + 200% smoke | NOT SELECTED |
| C-H | Issue-body SoT refresh | NOT SELECTED |
| C-B / C-C | Multi-site / SITE-HOM | CONSUMED（SHELL-UX-3） |
| C-D | Partial-retrieval presentation boundary | CONSUMED（SHELL-UX-4） |
| C-E | Error-code + correlationId display | CONSUMED（SHELL-UX-5） |

## 6. Stop condition

```text
Decision-SHELL-UX-6-UNAUTHENTICATED-PANEL-1
= SELECTED / LOCKED

HOLD:
  Implementation Start = separate Human GO

Still NOT AUTHORIZED:
  code Implementation Start
  #28 Close
  #21 / #22 continuation
  live I/O / auth judgment / Entra / token / role / redirect
```

## Reference

- Acceptance: `decision-shell-ux-6-unauthenticated-panel-acceptance.md`
- Prior reassessment: `issue-28-close-criteria-reassessment-3.md`（PR #248）
- Prior: `shell-ux-5-implementation-start.md`, `shell-ux-5-browser-smoke.md`
- Issue #28 remains OPEN; Close = NOT AUTHORIZED
- Next gate after Selection: Human GO for Implementation Start（separate）
