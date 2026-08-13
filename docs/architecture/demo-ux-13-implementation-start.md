# DEMO-UX-13 — Implementation Start

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-13 — Users list detail-preview expansion
Status: Implementation IN PROGRESS
Human Selection: SELECTED / LOCKED（Decision-DEMO-UX-13-DETAIL-PREVIEW-EXPANSION-1 / PR #328）
Human Implementation Start: GO（2026-08-13）
Baseline main: 59c4a89b6378f6c9219fe351bfbdb795e11f65fb
Branch: cursor/demo-ux-13-detail-preview-expansion-selection-3507
PR: #328 OPEN / Draft
Selection: decision-demo-ux-13-detail-preview-expansion-selection.md
Ready / Merge: NOT AUTHORIZED
#299 Close: NOT AUTHORIZED
SharePoint / Entra mutation: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
```

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

## Gate state

```text
Selection = SELECTED / LOCKED
Implementation Start = GO
Verification = PENDING
Ready = NOT AUTHORIZED
Merge = NOT AUTHORIZED
Deploy = NOT AUTHORIZED
#299 Close = NOT AUTHORIZED
```
