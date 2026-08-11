# SHELL-UX-5 — Error-code + correlationId User-Facing Display — Human Selection Packet

この文書は、SHELL-UX-4 / C-D MERGED（PR #244）後の
**次 shell UX slice** として **C-E** を固定する docs-only Selection Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-SHELL-UX-5-ERROR-CODE-CORRELATION-1
Kind: Human Selection（Issue #28 next slice / candidate C-E）
Status: SELECTED / LOCKED（GO boundary）
Human Decision: SELECT C-E / SHELL-UX-5
Date: 2026-08-11
PR: （Selection / Acceptance only；number at create）

Baseline:
  main tip = cc37cf0d7b71f9f5a8db57720e93f88a62050cad
  SHELL-UX-4 = MERGED（PR #244）
  Prior residual inventory = C-E STILL OPEN（correlationId only today）

Candidate origin:
  Issue #28 担当範囲「エラーコード・相関IDの利用者向け表示」
  residual candidate C-E（post SHELL-UX-3 reassessment / C-D selection table）

Implementation Start: NOT AUTHORIZED（separate Human GO）
#28 Close: NOT AUTHORIZED
#21 authorization truth: OUT
#22 adapter continuation: NOT AUTHORIZED
Agent auto-select: FORBIDDEN（this Selection is Human）
```

## 1. Why this slice now

```text
Close criteria 残 candidate のうち、
C-E（error-code + correlationId の利用者向け表示）は
Issue #28 担当範囲「エラーコード・相関IDの利用者向け表示」に直接対応する。

現状は fail panel 等に correlationId 文字列があるだけで、
error code 表示・コピーしやすい問い合わせ情報・専用 a11y 境界は未固定。

#22 の error code 生成・adapter failure classification・telemetry には踏み込まず、
props 駆動の presentation だけを先に固定する。
問い合わせ時に利用者が伝えやすい表示を shell 側で先に固定する。
```

## 2. Selected unit

```text
C-E / SHELL-UX-5
Error-code + correlationId user-facing display
```

## 3. Authorized IN（Selection scope）

```text
IN:
  error code の利用者向け表示
  correlationId の表示
  コピーしやすい問い合わせ情報
  a11y
  keyboard / focus
  PC / tablet
  unit tests
  browser smoke
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  error code の生成ロジック
  adapter failure classification
  REST
  binder wiring
  retry
  telemetry backend
  #22 semantics
  #21 semantics
  live I/O
  liveTenantIoAuthorized = true
  #28 Issue Close
  Ready / Merge auto-progress
  Implementation Start（this Selection alone）
  他 residual candidate（C-A / C-F′ / C-G / C-H）の自動選択
```

## 5. Options considered

| ID | Unit | Result |
|---|---|---|
| **C-E** | Error-code + correlationId user-facing display | **SELECTED** |
| C-A | Unauthenticated fail-closed presentation panel | NOT SELECTED |
| C-F′ | Primary-nav keyboard traversal evidence | NOT SELECTED |
| C-G | Horizontal-scroll + 200% smoke | NOT SELECTED |
| C-H | Issue-body SoT refresh | NOT SELECTED |
| C-B / C-C | Multi-site / SITE-HOM | CONSUMED（SHELL-UX-3） |
| C-D | Partial-retrieval presentation boundary | CONSUMED（SHELL-UX-4） |

## 6. Stop condition

```text
Decision-SHELL-UX-5-ERROR-CODE-CORRELATION-1
= SELECTED / LOCKED

HOLD:
  Implementation Start = separate Human GO

Still NOT AUTHORIZED:
  code Implementation Start
  #28 Close
  #21 / #22 continuation
  live I/O / error-code generation / failure classification / telemetry
```

## Reference

- Acceptance: `decision-shell-ux-5-error-code-correlation-acceptance.md`
- Prior: `shell-ux-4-implementation-start.md`, `shell-ux-4-browser-smoke.md`
- Prior selection: `decision-shell-ux-4-partial-retrieval-selection.md`
- Issue #28 remains OPEN; Close = NOT AUTHORIZED
- Next gate after Selection: Human GO for Implementation Start（separate）
