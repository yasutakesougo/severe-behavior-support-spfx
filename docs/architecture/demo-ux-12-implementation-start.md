# DEMO-UX-12 — Implementation Start

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-12 — Save badge hierarchy
Status: Implementation IN PROGRESS
Human Selection: SELECTED / LOCKED（Decision-DEMO-UX-12-SAVE-BADGE-HIERARCHY-1 / PR #326）
Human Implementation Start: GO（2026-08-13）
Baseline main: 23bc67a7f2e0331146cb92d7ea27c63a02dcf122
Branch: cursor/demo-ux-12-save-badge-hierarchy-selection-3507
PR: #326 OPEN / Draft
Selection: decision-demo-ux-12-save-badge-hierarchy-selection.md
Ready / Merge: NOT AUTHORIZED
#299 Close: NOT AUTHORIZED
SharePoint / Entra mutation: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
```

## Authority

Human instruction `DEMO-UX-12 Implementation Start GO` authorizes this presentation-only save badge hierarchy slice（RPF-005）.

Implementation Start does not authorize Ready, Merge, Deploy, SharePoint write, or #299 Close.

## Authorized IN

```text
RPF-005 save badge hierarchy
QUIET: saved / unsaved
EMPHASIZED: saving / save_failed / save_outcome_unknown
description visible only when EMPHASIZED
unit tests + browser smoke demo-ux-12
shell-ux-2 smoke assertion updates for hierarchy
implementation-specific documentation
```

## Explicit OUT

```text
save / autosave / persisted draft
live I/O / SharePoint write
RPF-007 / DUX7-P2-1
large visual redesign
business-rule changes
Ready / Merge / Deploy / #299 Close
```

## Slice flags

```text
DEMO_UX_12_SLICE.id = DEMO-UX-12
presentationOnly = true
saveBadgeHierarchyAuthorized = true
saveStateSemanticsChangeAuthorized = false
saveOutcomeUnknownNormalizationAuthorized = false
saveProgressUiAuthorized = false
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
