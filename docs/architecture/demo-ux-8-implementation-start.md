# DEMO-UX-8 — Implementation Start

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-8 — Users list status filter
Status: Implementation COMPLETE + Verification PASS
Human Selection: SELECTED / LOCKED（Decision-DEMO-UX-8-USERS-LIST-STATUS-FILTER-1 / PR #321）
Human Implementation Start: GO（2026-08-12）
Baseline main: 5655fc750ef9f4dfde37fdf12bf99b7e138d855e
Branch: cursor/demo-ux-8-users-filter-selection-3507
PR: #321 OPEN / Draft
Selection: decision-demo-ux-8-users-list-status-filter-selection.md
Browser smoke: demo-ux-8-browser-smoke.md
Ready / Merge: NOT AUTHORIZED
#299 Close: NOT AUTHORIZED
SharePoint / Entra mutation: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
```

Depends on（再 Decision しない）:
[`decision-demo-ux-8-users-list-status-filter-selection.md`](./decision-demo-ux-8-users-list-status-filter-selection.md)
[`decision-demo-ux-7-terminology-today-actions-selection.md`](./decision-demo-ux-7-terminology-today-actions-selection.md)
[`responsible-person-demo-v1-flow-review-feedback-record.md`](./responsible-person-demo-v1-flow-review-feedback-record.md)

## Authority

Human instruction `DEMO-UX-8 Implementation Start GO` authorizes this presentation-only implementation slice（RPF-003）.

Implementation Start does not authorize Ready, Merge, Deploy, SharePoint write, RPF-002, or #299 Close.

## Authorized IN

```text
RPF-003 users list status filter（synthetic client-side）
chips: すべて / 要確認 / 未記録 / 期限接近
single-select / default=すべて
match = ANY badge.id
fixture row set unchanged（8）
selected chip visual + aria-pressed
summary count update on filter
filter note / hint copy update
unit tests + browser smoke demo-ux-8
related smoke updates（demo-ux-2 enabled chips）
implementation-specific documentation
```

## Explicit OUT

```text
save implementation / SharePoint write
live user directory I/O
multi-select chips
detail preview expansion beyond user-a
RPF-002 record-flow redesign
large visual redesign
business-rule / GOV-RULE calculation changes
deadline_near internal id rename
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
DEMO-UX-7 A/B/C today-action navigation
DEMO-UX-7 terminology canon
```

## Slice flags

```text
DEMO_UX_8_SLICE.id = DEMO-UX-8
presentationOnly = true
filterExecutionAuthorized = true
saveMutationAuthorized = false
sharePointWriteAuthorized = false
multiSelectFilterAuthorized = false
detailPreviewExpansionAuthorized = false
recordFlowRedesignAuthorized = false
businessRuleCalculationAuthorized = false
failClosedSemanticsChangeAuthorized = false
```

## Expected fixture anchors

| Chip | Count |
|---|---|
| すべて | 8 |
| 要確認 | 3 |
| 未記録 | 2 |
| 期限接近 | 3 |

## Verification state

```text
format:check: （pending run）
lint: （pending run）
typecheck: （pending run）
root test: （pending run）
SPFx Heft test: （pending run）
browser smoke demo-ux-8: （pending run）
```

## Gate state

```text
DEMO-UX-8 Implementation = COMPLETE（pending verification fill）
Verification = pending
Human Ready = HOLD
Human Merge = HOLD
```

## Non-claims

```text
Implementation COMPLETE ≠ Ready GO
Verification PASS ≠ Review PASS
This completion ≠ Merge GO
This completion ≠ #299 Close
This completion ≠ RPF-002 authorization
This completion ≠ Deploy / SharePoint write
```
