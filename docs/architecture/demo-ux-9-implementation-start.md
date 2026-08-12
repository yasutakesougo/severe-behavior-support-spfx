# DEMO-UX-9 — Implementation Start

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-9 — Daily record experience cleanup
Status: Implementation COMPLETE + Verification PASS
Human Selection: SELECTED / LOCKED（Decision-DEMO-UX-9-DAILY-RECORD-EXPERIENCE-1 / PR #322）
Human Implementation Start: GO（2026-08-12）
Baseline main: aed5b05d16b8ae6c5733cbb2cf1163c502a70ee9
Branch: cursor/demo-ux-9-daily-record-experience-selection-3507
PR: #322 OPEN / Draft
Implementation verified HEAD: 564c1b731307d256c32b4eb86794939139f90e6e
Selection: decision-demo-ux-9-daily-record-experience-selection.md
Browser smoke: PASS / VERIFIED（demo-ux-9-browser-smoke.md）
Heft test: 77 / 77 PASS
Root test: 554 / 554 PASS
Ready / Merge: NOT AUTHORIZED
#299 Close: NOT AUTHORIZED
SharePoint / Entra mutation: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
```

Depends on（再 Decision しない）:
[`decision-demo-ux-9-daily-record-experience-selection.md`](./decision-demo-ux-9-daily-record-experience-selection.md)
[`decision-demo-ux-8-users-list-status-filter-selection.md`](./decision-demo-ux-8-users-list-status-filter-selection.md)
[`decision-demo-ux-7-terminology-today-actions-selection.md`](./decision-demo-ux-7-terminology-today-actions-selection.md)
[`responsible-person-demo-v1-flow-review-feedback-record.md`](./responsible-person-demo-v1-flow-review-feedback-record.md)

## Authority

Human instruction `DEMO-UX-9 Implementation Start GO` authorizes this presentation-only implementation slice（RPF-002）.

Implementation Start does not authorize Ready, Merge, Deploy, SharePoint write, or #299 Close.

## Authorized IN

```text
RPF-002 daily record experience cleanup
incomplete list selectable（single-select）
selection updates input image person + seed draft
local draft edit（client-side only）
draft discarded on leave（unmount）
create / save remain disabled
recent records remain browse-only sample
role separation copy（入力イメージ ≠ 保存）
unit tests + browser smoke demo-ux-9
related smoke order update（demo-ux-5）
implementation-specific documentation
```

## Explicit OUT

```text
actual save / create mutation
SharePoint write / live I/O
persisted draft / autosave
adapter changes
business-rule calculation changes
large visual redesign
RPF-004 / RPF-005 / RPF-006
Ready / Merge / Deploy / #299 Close
```

## Must preserve

```text
access_denied / retrieval_failed fail-closed
事業所未選択時の停止
保存結果不明を成功/失敗へ丸めない
DEMO-UX-7 A/B/C today-action navigation
DEMO-UX-8 users list status filter
DEMO / synthetic 明示
```

## Slice flags

```text
DEMO_UX_9_SLICE.id = DEMO-UX-9
presentationOnly = true
incompleteSelectionAuthorized = true
localDraftEditAuthorized = true
draftPersistenceAuthorized = false
autosaveAuthorized = false
saveMutationAuthorized = false
sharePointWriteAuthorized = false
recordCreationAuthorized = false
```

## Verification state

```text
format:check: PASS
lint: PASS（root）
typecheck: PASS（root）
root test: PASS（554 / 554）
SPFx Heft test: PASS（77 / 77）
browser smoke demo-ux-9: PASS（8 / 8）
```

## Gate state

```text
DEMO-UX-9 Implementation = COMPLETE
Verification = PASS
Human Ready = HOLD
Human Merge = HOLD
PR #322 = OPEN / Draft
```

Next:

```text
1. Fresh Review / Human Ready Decision（separate）
```

Still NOT AUTHORIZED:

```text
Ready
Merge
Deploy
SharePoint write
#299 Close
```

## Non-claims

```text
Implementation COMPLETE ≠ Ready GO
Verification PASS ≠ Review PASS
This completion ≠ Merge GO
This completion ≠ #299 Close
This completion ≠ Deploy / SharePoint write
```
