# SHELL-UX-5 — Implementation Start

```text
Issue: #28
Unit: SHELL-UX-5 / C-E — Error-code + correlationId User-Facing Display
Status: Implementation Start COMPLETE（presentation）+ browser smoke PASS
Human Selection: Decision-SHELL-UX-5-ERROR-CODE-CORRELATION-1 = SELECTED / LOCKED
Selection merge: 0e122228c9e47e398acc42cf0500b4a9fdb7e269（PR #246）
Human Implementation Start: GO（2026-08-11）
Independence: PASS（presentation-only；generation / classification / telemetry OUT）
PR: #247
Browser smoke: PASS / VERIFIED（shell-ux-5-browser-smoke.md）
Heft test: 27 / 27 PASS
#28 Close: NOT AUTHORIZED
#21 authorization truth: OUT
#22 adapter continuation: NOT AUTHORIZED
```

Depends on（再 Decision しない）:
[`decision-shell-ux-5-error-code-correlation-selection.md`](./decision-shell-ux-5-error-code-correlation-selection.md)
[`decision-shell-ux-5-error-code-correlation-acceptance.md`](./decision-shell-ux-5-error-code-correlation-acceptance.md)

## Authority

```text
#246 Merge = Selection boundary only
#246 merge ≠ Implementation Start

This document records the separate Human GO for Implementation Start.
```

## Authorized IN

```text
error code の利用者向け表示
correlationId の表示
コピーしやすい問い合わせ情報
a11y / keyboard / focus
PC / tablet
unit tests / browser smoke
props / fixture presentation-only state
```

## Explicit OUT

```text
error code の生成ロジック
adapter failure classification
REST / binder wiring / retry / telemetry backend
#22 / #21 semantics
live I/O
liveTenantIoAuthorized = true
#28 Issue Close
Ready / Merge auto-progress
```

## Boundary markers

```text
SHELL_UX_SLICE.id = SHELL-UX-5
SHELL_UX_SLICE.liveTenantIoAuthorized = false
SHELL_UX_SLICE.sharePointRestAuthorized = false
SHELL_UX_SLICE.binderHostWiringAuthorized = false
SHELL_UX_SLICE.membershipLookupAuthorized = false
SHELL_UX_SLICE.adapterFetchAuthorized = false
SHELL_UX_SLICE.outcomeJudgmentAuthorized = false
SHELL_UX_SLICE.errorCodeGenerationAuthorized = false
SHELL_UX_SLICE.adapterFailureClassificationAuthorized = false
SHELL_UX_SLICE.telemetryBackendAuthorized = false
errorCode + correlationId = presentation props only
```

## Delivered surface

```text
spfx/src/shell/ux/error-inquiry.ts
spfx/src/shell/ux/ErrorInquiryDisplay.tsx
spfx/src/shell/ux/StatusPanel.tsx
spfx/src/shell/ux/PartialRetrievalPanel.tsx
spfx/src/shell/ux/AppShellChrome.tsx
spfx/src/shell/ux/fixture.ts
spfx/src/shell/ux/*.test.ts
spfx/smoke/shell-ux-5/*
docs/architecture/shell-ux-5-browser-smoke.md
```

## Stop / HOLD

```text
Do not Close #28
Do not continue #21 / #22
Do not implement error-code generation / failure classification / telemetry / retry
Do not enable liveTenantIoAuthorized / REST / binder wiring
Do not auto-select other residual candidates
```
