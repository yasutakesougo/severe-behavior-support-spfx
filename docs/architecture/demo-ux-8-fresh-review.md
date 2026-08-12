# DEMO-UX-8 — Fresh Review

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Fresh Review（implementation PR）
Unit: DEMO-UX-8 — Users list status filter
PR: #321
Implementation verified HEAD: 6e82e1eef106cfbd7743d39eec1ee4380f69db76
PR tip HEAD: d248ea1f76d5f689e19ef993544336e0c6639772
Selection: Decision-DEMO-UX-8-USERS-LIST-STATUS-FILTER-1
Implementation Start: demo-ux-8-implementation-start.md
Browser smoke: demo-ux-8-browser-smoke.md
Status: PASS → predecessor MERGED / COMPLETE（PR #321 / aed5b05）
Findings: P0 = 0 / P1 = 0 / P2 = 1 OPEN（non-blocking）
Human Ready: GO（merged）
Merge: SUCCESS（aed5b05d16b8ae6c5733cbb2cf1163c502a70ee9）
Deploy / SharePoint write / #299 Close: NOT AUTHORIZED
RPF-002 Implementation Start: NOT AUTHORIZED
```

## Authority

Human instruction `DEMO-UX-8 Fresh Review GO` authorizes this review only.

```text
Fresh Review PASS ≠ Human Ready GO
Fresh Review PASS ≠ Merge GO
Fresh Review PASS ≠ Deploy
Fresh Review PASS ≠ SharePoint write
Fresh Review PASS ≠ #299 Close
Fresh Review PASS ≠ RPF-002 start
```

## Review matrix

| # | Check | Result |
|---|---|---|
| R1 | Scope = RPF-003 users list status filter only | **PASS** |
| R2 | Chips locked: すべて / 要確認 / 未記録 / 期限接近 | **PASS** |
| R3 | single-select；default = すべて；`aria-pressed` on selected chip | **PASS** |
| R4 | match = ANY `badge.id`（needs_review / unrecorded / deadline_near） | **PASS** |
| R5 | Expected counts 8 / 3 / 2 / 3 on unchanged 8-row fixture | **PASS** |
| R6 | Fixture rows unchanged；only `filterHint` + `filterExecutionAuthorized` delta | **PASS** |
| R7 | Filter is view-local React state；no URL / live I/O / SharePoint write | **PASS** |
| R8 | Selected chip has visual selected style + keyboard-focusable native `<button>` | **PASS** |
| R9 | Empty-result copy does not claim「事業所に利用者がいない」 | **PASS** |
| R10 | Detail preview remains A-only（no expansion） | **PASS** |
| R11 | DEMO-UX-7 surfaces untouched（no AppShellChrome / overview / records code delta） | **PASS** |
| R12 | fail-closed `access_denied` preserved in smoke | **PASS** |
| R13 | `siteSelection=unselected` stop preserved in smoke | **PASS** |
| R14 | `save_outcome_unknown` remains non-normalized in smoke | **PASS** |
| R15 | RPF-002 / multi-select / business-rule calculation NOT introduced | **PASS** |
| R16 | No adapter / REST / auth / Deploy surface in commit | **PASS** |
| R17 | Verification evidence present（root 554 / Heft 74 / smoke 8/8） | **PASS** |
| R18 | Tip after verified HEAD is docs-only gate/ledger updates | **PASS** |
| R19 | Review PASS ≠ Ready / Merge / Deploy / #299 Close | **PASS** |

## Evidence inspected

```text
Verified HEAD: 6e82e1eef106cfbd7743d39eec1ee4380f69db76
Tip: d248ea1f76d5f689e19ef993544336e0c6639772
Core code:
  spfx/src/shell/users/users-filter.ts
  spfx/src/shell/users/UsersList.tsx
  spfx/src/shell/users/users-fixture.ts
  spfx/src/shell/users/users-copy.ts
  spfx/src/shell/users/UsersUx.module.scss
  spfx/src/shell/users/users.test.ts
Smoke:
  spfx/smoke/demo-ux-8/run-smoke.mjs
  /opt/cursor/artifacts/demo-ux-8-browser-smoke/smoke-report.json（allPass: true, 8/8）
Docs:
  decision-demo-ux-8-users-list-status-filter-selection.md
  demo-ux-8-implementation-start.md
  demo-ux-8-browser-smoke.md
Scope negative:
  no AppShellChrome / overview / daily-record / adapter path changes
```

## Findings

| Sev | ID | Status | Note |
|---|---|---|---|
| P2 | DUX8-P2-1 | OPEN | Browser smoke reasserts DEMO-UX-7 today-action **A** only. B/C are not re-smoked here. Non-blocking because AppShellChrome / Overview / records code paths are untouched in this PR. |

```text
P0 = 0
P1 = 0
P2 OPEN = 1
Independent Review / Fresh Review: PASS
```

Deferred OUT（not new defects）:

```text
DUX7-P2-1 detail-preview A-only remains OUT
DUX7-P2-2 internal id deadline_near rename remains OUT
RPF-002 remains OUT
```

## Strict progression

```text
1. This Fresh Review = PASS
2. Human Ready Decision（HUMAN-ONLY）— HOLD until Human decides
3. Human Merge（HUMAN-ONLY）— only after Ready GO
4. After Merge: separately authorize RPF-002
5. Ready / Merge / Deploy / SharePoint write / #299 Close remain NOT AUTHORIZED by this review
```

## Non-claims

```text
This review does not authorize Ready
This review does not authorize Merge
This review does not authorize Deploy
This review does not authorize SharePoint mutation
This review does not close #299
This review does not start RPF-002
```
