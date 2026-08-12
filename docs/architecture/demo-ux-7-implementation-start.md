# DEMO-UX-7 — Implementation Start

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-7 — Terminology canon + Today-actions navigation
Status: Implementation Start COMPLETE（presentation）+ browser smoke PASS
Human Selection: SELECTED / LOCKED（Decision-DEMO-UX-7-TERMINOLOGY-TODAY-ACTIONS-1 / PR #320）
Human Implementation Start: GO（2026-08-12）
Baseline main: 677d35922d6ebc761a5977e861a2e8e4eff8e4a6
Branch: cursor/demo-ux-7-terminology-today-actions-selection-3507
Browser smoke: PASS / VERIFIED（demo-ux-7-browser-smoke.md）
Heft test: 70 / 70 PASS
Root test: 554 / 554 PASS
#299 Close: NOT AUTHORIZED
SharePoint / Entra mutation: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
Ready / Merge: NOT AUTHORIZED
```

Depends on（再 Decision しない）:
[`decision-demo-ux-7-terminology-today-actions-selection.md`](./decision-demo-ux-7-terminology-today-actions-selection.md)
[`responsible-person-demo-v1-flow-review-feedback-record.md`](./responsible-person-demo-v1-flow-review-feedback-record.md)

## Authority

Human instruction `DEMO-UX-7 Implementation Start GO` authorizes this presentation-only implementation slice.

Selection and Implementation Start do not authorize Ready, Merge, live I/O, save mutation, filter execution (RPF-003), record-flow redesign (RPF-002), visual redesign, or Production deploy.

## Authorized IN

```text
RPF-Q01 terminology canon: 要確認 / 期限接近 / 未記録
deprecate primary labels: 確認待ち / 確認対象 / 期限間近
RPF-001 Overview 今日やること navigation:
  A「記録する」→ 記録
  B「確認する」→ 見直し
  C「見る」→ 利用者詳細（user-c synthetic）
fixture / unit / component test updates
browser smoke harness demo-ux-7 + related smoke label updates
implementation-specific documentation
```

## Explicit OUT

```text
save implementation / SharePoint write
live business data
RPF-003 filter implementation
RPF-002 record-flow redesign
large visual redesign
fail-closed semantics changes
unselected-state relaxation
save-outcome-unknown normalization
Ready / Merge / Deploy / #299 Close
```

## Must preserve

```text
access_denied / retrieval_failed fail-closed
事業所未選択時の停止
保存結果不明を成功/失敗へ丸めない
DEMO / synthetic 明示
```

## Slice flags

```text
DEMO_UX_7_SLICE.id = DEMO-UX-7
presentationOnly = true
terminologyCanonAuthorized = true
todayActionNavigationAuthorized = true
saveMutationAuthorized = false
sharePointWriteAuthorized = false
filterExecutionAuthorized = false
recordFlowRedesignAuthorized = false
visualRedesignAuthorized = false
failClosedSemanticsChangeAuthorized = false
unselectedStateRelaxationAuthorized = false
saveOutcomeUnknownNormalizationAuthorized = false
```

## Verification state

```text
format:check: PASS
lint: PASS
typecheck: PASS
root test: PASS（554 / 554）
SPFx Heft test: PASS（70 / 70）
browser smoke demo-ux-7: PASS（7 / 7）
```

## Non-claims

```text
This completion ≠ Ready GO
This completion ≠ Merge GO
This completion ≠ #299 Close
This completion ≠ RPF-003 / RPF-002 authorization
```
