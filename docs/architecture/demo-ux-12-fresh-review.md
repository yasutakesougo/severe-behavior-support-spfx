# DEMO-UX-12 — Fresh Review

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Fresh Review（implementation PR）
Unit: DEMO-UX-12 — Save badge hierarchy
PR: #326
Implementation verified HEAD: bf600e567664ef47bfc19bf521b94a39ef9ae305
PR tip HEAD: 0f54a8a89dc5ada2ba64a9d919c325852cb250f9
Selection: Decision-DEMO-UX-12-SAVE-BADGE-HIERARCHY-1
Implementation Start: demo-ux-12-implementation-start.md
Browser smoke: demo-ux-12-browser-smoke.md
Status: PASS
Findings: P0 = 0 / P1 = 0 / P2 = 2 OPEN（non-blocking）
Human Ready: COMPLETE（see demo-ux-12-ready.md；2026-08-13）
Merge: SUCCESS（PR #326 / ea12849；MERGED / COMPLETE）
Deploy / SharePoint write / #299 Close: NOT AUTHORIZED
```

## Authority

Human instruction `DEMO-UX-12 Fresh Review GO` authorized this review only.
Human subsequently Ready'd and Merged PR #326. Deploy / #299 Close remain unauthorized.

```text
Fresh Review PASS ≠ Human Ready GO（Ready later COMPLETE）
Fresh Review PASS ≠ Merge GO（Merge later SUCCESS）
Fresh Review PASS ≠ Deploy
Fresh Review PASS ≠ SharePoint write
Fresh Review PASS ≠ #299 Close
```

## Review matrix

| # | Check | Result |
|---|---|---|
| R1 | Scope = RPF-005 save badge hierarchy only | **PASS** |
| R2 | QUIET: `saved` / `unsaved` muted on ready（badge label remains；description hidden） | **PASS** |
| R3 | EMPHASIZED: `saving` / `save_failed` / `save_outcome_unknown` stronger chrome + description | **PASS** |
| R4 | `saving` not treated as `saved` success（distinct label/emphasis） | **PASS** |
| R5 | `save_outcome_unknown` not collapsed to success/failure（label + 丸めません description） | **PASS** |
| R6 | 5-state vocabulary unchanged vs main（labels/descriptions） | **PASS** |
| R7 | State identifiable by text, not color alone（badge label + aria-label） | **PASS** |
| R8 | QUIET description hide does not erase state text（未保存/保存済み remain） | **PASS** |
| R9 | EMPHASIZED keeps description strings | **PASS** |
| R10 | DEMO-UX-7〜11 surfaces unchanged（no file delta outside save chrome + smoke/docs） | **PASS** |
| R11 | DemoBanner / no-live / Overview action「保存…なし」 retained in smoke screenshots | **PASS** |
| R12 | fail-closed `access_denied` preserved（smoke） | **PASS** |
| R13 | `siteSelection=unselected` stop preserved（smoke） | **PASS** |
| R14 | No RPF-007 progress UI / DUX7-P2-1 / save / live I/O / adapter leakage | **PASS** |
| R15 | Slice flags forbid save/progress/write/semantics change | **PASS** |
| R16 | Verification evidence reconciles（format/lint/typecheck；root 554；Heft 92；smoke 9/9 + 7/7） | **PASS** |
| R17 | Tip after verified HEAD is docs-only | **PASS** |
| R18 | Review PASS ≠ Ready / Merge / Deploy / #299 Close | **PASS** |

## Evidence inspected

```text
Tip: 0f54a8a89dc5ada2ba64a9d919c325852cb250f9
Verified code family: bf600e567664ef47bfc19bf521b94a39ef9ae305
Core:
  spfx/src/shell/ux/save-badge-hierarchy.ts
  spfx/src/shell/ux/save-state.ts
  spfx/src/shell/ux/SaveStateBadge.tsx
  spfx/src/shell/ux/SaveStatePresentation.tsx
  spfx/src/shell/ux/ShellUx.module.scss（.saveStateBadgeQuiet / Emphasized）
  spfx/src/shell/ux/save-state.test.ts
  spfx/src/shell/ux/save-badge-hierarchy.test.ts
Unchanged safety / prior UX:
  DemoBanner.tsx / SiteUnselectedStop.tsx
  dashboard / users / records / review / adapters = empty diff vs main
Smoke:
  spfx/smoke/demo-ux-12/run-smoke.mjs
  /opt/cursor/artifacts/demo-ux-12-browser-smoke/smoke-report.json（allPass: true, 9/9）
  screenshots: save-unsaved / saving / saved / save_failed / save_outcome_unknown
               ready-saved-quiet / unselected / access_denied / unknown-non-collapse
  shell-ux-2 hierarchy-aware regression: 7/7 PASS
Docs:
  decision-demo-ux-12-save-badge-hierarchy-selection.md
  demo-ux-12-implementation-start.md
  demo-ux-12-browser-smoke.md
Post-verified tip commits（docs only）:
  4a536ee pin verified HEAD
  0f54a8a feedback mapping COMPLETE（Ready HOLD）
```

## Findings

| Sev | ID | Status | Note |
|---|---|---|---|
| P2 | DUX12-P2-1 | OPEN | demo-ux-12 smoke preserves unselected / access_denied / unknown / Overview Family R+action, but does not re-run full DEMO-UX-7〜11 harness suites. Non-blocking because those surfaces have **no** code delta vs main. |
| P2 | DUX12-P2-2 | OPEN | shell-ux-2 smoke no longer hard-asserts historical slice id `SHELL-UX-2`（fixture id is now `SHELL-UX-7`）. Hierarchy assertions remain. Non-blocking harness drift. |

```text
P0 = 0
P1 = 0
P2 OPEN = 2
Independent Review / Fresh Review: PASS
```

Deferred OUT（not new defects）:

```text
RPF-007 保存中進行表示 remains OUT
DUX7-P2-1 detail-preview A-only remains OUT
save / autosave / persisted draft / SharePoint write / live I/O remain OUT
```

## Strict progression

```text
1. This Fresh Review = PASS
2. Human Ready Decision = COMPLETE
3. Human Merge = SUCCESS（PR #326 / ea12849）
4. Deploy / SharePoint write / #299 Close remain NOT AUTHORIZED
5. Next Selection candidates（unauthorized）: DUX7-P2-1 → RPF-007
```

## Non-claims

```text
This review did not itself authorize Ready / Merge
This review does not authorize Deploy
This review does not authorize SharePoint mutation
This review does not close #299
Ready / Merge were authorized later by Human decisions（demo-ux-12-ready.md）
```
