# DEMO-UX-7 — Implementation Start

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-7 — Terminology canon + Today-actions navigation
Status: MERGED / COMPLETE（PR #320 / 5655fc750ef9f4dfde37fdf12bf99b7e138d855e）
Human Selection: SELECTED / LOCKED（Decision-DEMO-UX-7-TERMINOLOGY-TODAY-ACTIONS-1 / PR #320）
Human Implementation Start: GO（2026-08-12）
Human Ready: GO（2026-08-12）
Human Merge: GO（2026-08-12）
Baseline main at start: 677d35922d6ebc761a5977e861a2e8e4eff8e4a6
Merge commit: 5655fc750ef9f4dfde37fdf12bf99b7e138d855e
Expected tip in merge: 1d7e9a733e03b1f8bffead2353b2209bd423f3df
Branch: cursor/demo-ux-7-terminology-today-actions-selection-3507
PR: #320 MERGED
Implementation verified HEAD: 5747af43d705b647d6b23fb91f337e396896a365
Fresh Review: demo-ux-7-fresh-review.md
Ready: demo-ux-7-ready.md
Browser smoke: PASS / VERIFIED（demo-ux-7-browser-smoke.md）
Heft test: 70 / 70 PASS
Root test: 554 / 554 PASS
Review PASS: PASS（P0=0 / P1=0）
Next: DEMO-UX-8 / RPF-003 Selection
#299 Close: NOT AUTHORIZED
SharePoint / Entra mutation: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
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

## Gate state（updated after Human Ready GO）

```text
DEMO-UX-7 Implementation = COMPLETE
Verification = PASS
Fresh Review = PASS（P0=0 / P1=0）
Human Ready = GO
PR #320 = OPEN / Ready for Review（draft=false）
Implementation verified HEAD = 5747af43d705b647d6b23fb91f337e396896a365
PR tip HEAD = d6b9b19801a78b79fc67872e7672bfedcb8310f4
Note: tip contains docs-only commits after implementation HEAD; 5747af4 is ancestor
mergeable = MERGEABLE
mergeStateStatus = CLEAN
CI = SUCCESS（Verify contracts, skills, and scope）
submitted GitHub review objects = 0（Fresh Review evidence is docs artifact）
Human Merge = HOLD
```

Next:

```text
1. Ready = GO（complete）
2. Human Merge Decision（GO / HOLD）— separate
```

Still NOT AUTHORIZED:

```text
Merge
Deploy
SharePoint write
#299 Close
RPF-003 Implementation Start
RPF-002 Implementation Start
```

Next queue（after Merge of this slice, separately authorized）:

```text
RPF-003 → RPF-002
```

## Non-claims

```text
Implementation COMPLETE ≠ Ready GO
Verification PASS ≠ Review PASS
This completion ≠ Merge GO
This completion ≠ #299 Close
This completion ≠ RPF-003 / RPF-002 authorization
DEMO-UX-7 is at the review gate, not blocked by missing implementation
```
