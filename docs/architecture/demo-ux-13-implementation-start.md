# DEMO-UX-13 — Implementation Start

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-13 — Users list detail-preview expansion
Status: Implementation COMPLETE + Verification PASS
Implementation verified HEAD: 7b8fa0b8a935415ddc1cd41c086c3148d2c8d9d8
Human Selection: SELECTED / LOCKED（Decision-DEMO-UX-13-DETAIL-PREVIEW-EXPANSION-1 / PR #328）
Human Implementation Start: GO（2026-08-13）
Baseline main: 59c4a89b6378f6c9219fe351bfbdb795e11f65fb
Branch: cursor/demo-ux-13-detail-preview-expansion-selection-3507
PR: #328 MERGED
Selection: decision-demo-ux-13-detail-preview-expansion-selection.md
Browser smoke: PASS / VERIFIED（demo-ux-13-browser-smoke.md）
Heft test: 98 / 98 PASS
Root test: 554 / 554 PASS
Ready / Merge: SUCCESS（PR #328 / c92ca6c7d6ac67b68b0227738e8ce6df34d20297；see demo-ux-13-ready.md）
#299 Close: NOT AUTHORIZED
SharePoint / Entra mutation: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
```

## Verification state

```text
format:check: PASS
lint: PASS（root）
typecheck: PASS（root）
root test: PASS（554 / 554）
SPFx Heft test: PASS（98 / 98）
browser smoke demo-ux-13: PASS（7 / 7）
```

Depends on（再 Decision しない）:
[`decision-demo-ux-13-detail-preview-expansion-selection.md`](./decision-demo-ux-13-detail-preview-expansion-selection.md)
[`decision-demo-ux-12-save-badge-hierarchy-selection.md`](./decision-demo-ux-12-save-badge-hierarchy-selection.md)
[`demo-ux-7-fresh-review.md`](./demo-ux-7-fresh-review.md)

## Authority

Human instruction `DEMO-UX-13 Implementation Start GO` authorizes this presentation-only Users list detail-preview expansion（DUX7-P2-1）.

Implementation Start does not authorize Ready, Merge, Deploy, SharePoint write, or #299 Close.

## Authorized IN

```text
DUX7-P2-1 fixture-backed detail preview enablement
A + C list「詳細を見る」enabled
B / D–H remain disabled
detail boundary note update
support-plan remains A-only（regression）
unit tests + browser smoke demo-ux-13
legacy smoke assertion updates（demo-ux-3 / demo-ux-11）
```

## Explicit OUT

```text
new 8-user detail fixtures
support-plan expansion beyond A
live user detail / SharePoint read/write / save
RPF-007
large visual redesign
Ready / Merge / Deploy / #299 Close
```

## Slice flags

```text
DEMO_UX_13_SLICE.id = DEMO-UX-13
presentationOnly = true
detailPreviewExpansionAuthorized = true
fixtureBackedDetailPreviewOnly = true
supportPlanExpansionAuthorized = false
newEightUserDetailCatalogAuthorized = false
saveMutationAuthorized = false
sharePointWriteAuthorized = false
```

## Delivered

```text
spfx/src/shell/users/detail-preview.ts
spfx/src/shell/users/UsersList.tsx（detailPreviewUserIds）
spfx/src/shell/ux/AppShellChrome.tsx（fixture-derived ids）
spfx/src/shell/users/users-copy.ts（boundary note）
spfx/smoke/demo-ux-13/
```

## Gate state

```text
Selection = SELECTED / LOCKED
Implementation Start = GO / COMPLETE
Verification = PASS
Ready / Merge = SUCCESS / MERGED COMPLETE
Deploy = NOT AUTHORIZED
#299 Close = NOT AUTHORIZED
```

## Predecessor merge confirmation（this slice）

```text
PR #328 Merge = SUCCESS
Merge commit = c92ca6c7d6ac67b68b0227738e8ce6df34d20297
Expected HEAD guard tip = cf64104592131e7eae0610569e4208ac03e8d794（ancestor match confirmed）
DEMO-UX-13 / DUX7-P2-1 = MERGED / COMPLETE
```
