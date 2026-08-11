# SHELL-UX-4 — Implementation Start

```text
Issue: #28
Unit: SHELL-UX-4 / C-D — Partial-Retrieval Presentation Boundary
Status: Implementation Start COMPLETE（presentation）+ browser smoke PASS
Human Selection: Decision-SHELL-UX-4-PARTIAL-RETRIEVAL-1 = SELECTED / LOCKED
Selection merge: 23735d1a828068c6037d42222a27a80081e7f370（PR #243）
Human Implementation Start: GO（2026-08-11）
Independence: PASS（presentation-only；adapter fetch / judgment OUT）
PR: #244
Browser smoke: PASS / VERIFIED（shell-ux-4-browser-smoke.md）
Heft test: 23 / 23 PASS
#28 Close: NOT AUTHORIZED
#21 authorization truth: OUT
#22 adapter continuation: NOT AUTHORIZED
```

Depends on（再 Decision しない）:
[`decision-shell-ux-4-partial-retrieval-selection.md`](./decision-shell-ux-4-partial-retrieval-selection.md)
[`decision-shell-ux-4-partial-retrieval-acceptance.md`](./decision-shell-ux-4-partial-retrieval-acceptance.md)

## Authority

```text
#243 Merge = Selection boundary only
#243 merge ≠ Implementation Start

This document records the separate Human GO for Implementation Start.
```

## Authorized IN

```text
一部取得失敗状態の共通 presentation
正常取得分と失敗分を視覚的に分離
「全件正常」と誤認させない表示
props による状態入力
a11y / keyboard / focus
PC / tablet
unit tests / browser smoke
```

## Explicit OUT

```text
REST / SharePoint adapter / 実際の取得処理
成否判定ロジック / 件数集計ロジック / retry
binder wiring
#22 / #21 semantics
live I/O
liveTenantIoAuthorized = true
#28 Issue Close
Ready / Merge auto-progress
```

## Boundary markers

```text
SHELL_UX_SLICE.id = SHELL-UX-4
SHELL_UX_SLICE.liveTenantIoAuthorized = false
SHELL_UX_SLICE.sharePointRestAuthorized = false
SHELL_UX_SLICE.binderHostWiringAuthorized = false
SHELL_UX_SLICE.membershipLookupAuthorized = false
SHELL_UX_SLICE.adapterFetchAuthorized = false
SHELL_UX_SLICE.outcomeJudgmentAuthorized = false
partial_retrieval_failed ≠ retrieval_failed ≠ ready
```

## Delivered surface

```text
spfx/src/shell/ux/partial-retrieval.ts
spfx/src/shell/ux/PartialRetrievalPanel.tsx
spfx/src/shell/ux/shell-view-mode.ts（partial_retrieval_failed）
spfx/src/shell/ux/AppShellChrome.tsx
spfx/src/shell/ux/*.test.ts
spfx/smoke/shell-ux-4/*
docs/architecture/shell-ux-4-browser-smoke.md
```

## Stop / HOLD

```text
Do not Close #28
Do not continue #21 / #22
Do not implement fetch / judgment / count aggregation / retry
Do not auto-select other residual candidates
next shell UX slice（SHELL-UX-5 / C-E Implementation Start GO；see shell-ux-5-implementation-start.md）
```
