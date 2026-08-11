# SHELL-UX-4 — Partial-Retrieval Presentation Boundary — Human Selection Packet

この文書は、Issue #28 Close criteria reassessment FAIL（PR #242）後の
**次 shell UX slice** として **C-D** を固定する docs-only Selection Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-SHELL-UX-4-PARTIAL-RETRIEVAL-1
Kind: Human Selection（Issue #28 next slice / candidate C-D）
Status: SELECTED / LOCKED（GO boundary）
Human Decision: SELECT C-D / SHELL-UX-4
Date: 2026-08-11
PR: #243（Selection / Acceptance only）

Baseline:
  main tip = be2af7c22ceb3b28a6631196d69d3b5ba29214c7
  SHELL-UX-3 = MERGED（PR #241）
  Close criteria reassessment = FAIL / KEEP OPEN（PR #242；Decision-ISSUE-28-CLOSE-CRITERIA-REASSESSMENT-1）

Candidate origin:
  issue-28-close-criteria-reassessment.md → C-D

Implementation Start: NOT AUTHORIZED（separate Human GO）
#28 Close: NOT AUTHORIZED
#21 authorization truth: OUT
#22 adapter continuation: NOT AUTHORIZED
Agent auto-select: FORBIDDEN（this Selection is Human）
```

## 1. Why this slice now

```text
Close criteria FAIL の残 candidate のうち、
C-D（一部取得失敗の共通 presentation boundary）は
Issue #28 担当範囲「取得失敗・一部取得失敗の共通境界」と
必須tests「一部取得失敗を正常件数へ混ぜない」に直接対応する。

#22 の実取得・成否判定・件数集計には踏み込まず、
props 駆動の presentation だけを先に固定する。
全件正常と誤認させない表示を shell 側で先に固定する。
```

## 2. Selected unit

```text
C-D / SHELL-UX-4
Partial-retrieval presentation boundary
```

## 3. Authorized IN（Selection scope）

```text
IN:
  一部取得失敗状態の共通 presentation
  正常取得分と失敗分を視覚的に分離
  「全件正常」と誤認させない表示
  props による状態入力
  a11y
  keyboard / focus
  PC / tablet
  unit tests
  browser smoke
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  SharePoint REST
  SharePoint adapter
  実際の取得処理
  成否判定ロジック
  件数集計ロジック
  retry
  binder wiring
  #22 semantics
  #21 semantics
  live I/O
  liveTenantIoAuthorized = true
  #28 Issue Close
  Ready / Merge auto-progress
  Implementation Start（this Selection alone）
  他 residual candidate（C-A / C-E / C-F′ / C-G / C-H）の自動選択
```

## 5. Options considered

| ID | Unit | Result |
|---|---|---|
| **C-D** | Partial-retrieval presentation boundary | **SELECTED** |
| C-A | Unauthenticated fail-closed presentation panel | NOT SELECTED |
| C-E | Error-code + correlationId user-facing display | NOT SELECTED |
| C-F′ | Primary-nav keyboard traversal evidence | NOT SELECTED |
| C-G | Horizontal-scroll + 200% smoke | NOT SELECTED |
| C-H | Issue-body SoT refresh | NOT SELECTED |
| C-B / C-C | Multi-site / SITE-HOM | CONSUMED（SHELL-UX-3） |

## 6. Stop condition

```text
Decision-SHELL-UX-4-PARTIAL-RETRIEVAL-1
= SELECTED / LOCKED

HOLD:
  Implementation Start = separate Human GO

Still NOT AUTHORIZED:
  code Implementation Start
  #28 Close
  #21 / #22 continuation
  live I/O / adapter fetch / outcome judgment / count aggregation
```

## Reference

- Acceptance: `decision-shell-ux-4-partial-retrieval-acceptance.md`
- Prior reassessment: `issue-28-close-criteria-reassessment.md`（PR #242）
- Prior: `shell-ux-3-implementation-start.md`, `shell-ux-3-browser-smoke.md`
- Issue #28 remains OPEN; Close = NOT AUTHORIZED
- Next gate after Selection: Human GO for Implementation Start（separate）
