# DEMO-UX-14 — Fresh Review

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Fresh Review（implementation PR）
Unit: DEMO-UX-14 — Saving progress observability（RPF-007 / Option C）
PR: #330
Implementation verified HEAD: 7bdcd6b779ba485ca14c65423bfda1d0c0f201ab
PR tip HEAD: a77a9e6ba0ff619c35160f09c797189ae8ce5275
Selection tip: de4bb7a20614a39826a25120d6301af9d2e2d335（ancestor）
Selection: Decision-DEMO-UX-14-SAVING-PROGRESS-OBSERVABILITY-1
Implementation Start: demo-ux-14-implementation-start.md
Browser smoke: demo-ux-14-browser-smoke.md
Status: PASS
Findings: P0 = 0 / P1 = 0 / P2 = 2 OPEN（non-blocking）
Human Ready: NOT AUTHORIZED（separate Human Ready Decision）
Merge: NOT AUTHORIZED
Deploy / SharePoint write / #299 Close: NOT AUTHORIZED
```

## Authority

Human instruction `DEMO-UX-14 Fresh Review GO` authorizes this review only.

```text
Fresh Review PASS ≠ Human Ready GO
Fresh Review PASS ≠ Merge GO
Fresh Review PASS ≠ Deploy
Fresh Review PASS ≠ SharePoint write
Fresh Review PASS ≠ #299 Close
```

## Review matrix

| # | Check | Result |
|---|---|---|
| R1 | Scope = RPF-007 Option C（progress cue + pause appearance）only | **PASS** |
| R2 | Progress cue only when `saveState === "saving"` | **PASS** |
| R3 | No progress cue on `saved` / `unsaved` | **PASS** |
| R4 | No progress cue on `save_failed` / `save_outcome_unknown` | **PASS** |
| R5 | `aria-busy` only while saving（presentation + ready-region） | **PASS** |
| R6 | `prefers-reduced-motion: reduce` disables progress animation（static bar remains） | **PASS** |
| R7 | Primary nav disable while saving is presentation/chrome pause only（no mutation enablement） | **PASS** |
| R8 | Ready-region pause note / inert only while saving | **PASS** |
| R9 | `saving` not treated as `saved` success（label「保存中」；description 実保存なし；≠ 保存済み） | **PASS** |
| R10 | No saving → saved auto-complete（no timer；`savingAutoCompleteAuthorized: false`） | **PASS** |
| R11 | DEMO-UX-12 QUIET/EMPHASIZED hierarchy unchanged | **PASS** |
| R12 | 5-state vocabulary labels unchanged | **PASS** |
| R13 | `save_outcome_unknown` non-collapse（丸めません；no progress/pause） | **PASS** |
| R14 | DEMO-UX-7〜13 surface packages have **zero** code delta vs main | **PASS** |
| R15 | fail-closed `access_denied` / `unselected` stop preserved（smoke） | **PASS** |
| R16 | No actual save / autosave / persisted draft / live I/O / SharePoint write leakage | **PASS** |
| R17 | Slice flags forbid write / mutation / auto-complete / unknown normalization | **PASS** |
| R18 | Verification evidence reconciles（format/lint/typecheck；root 554；Heft 104；smoke 10/10 + regressions） | **PASS** |
| R19 | Tip after verified implementation commit is docs/format-only | **PASS** |
| R20 | Review PASS ≠ Ready / Merge / Deploy / #299 Close | **PASS** |

## Evidence inspected

```text
Tip: a77a9e6ba0ff619c35160f09c797189ae8ce5275
Verified implementation family: 7bdcd6b779ba485ca14c65423bfda1d0c0f201ab
Selection ancestor: de4bb7a20614a39826a25120d6301af9d2e2d335
Core:
  spfx/src/shell/ux/saving-progress-observability.ts
  spfx/src/shell/ux/saving-progress-observability.test.ts
  spfx/src/shell/ux/SaveStatePresentation.tsx
  spfx/src/shell/ux/AppShellChrome.tsx
  spfx/src/shell/ux/save-state.ts（saving description only）
  spfx/src/shell/ux/ShellUx.module.scss（progress cue + reduced-motion + pause styles）
  spfx/src/shell/ux/save-state.test.ts
  spfx/src/shell/ux/save-badge-hierarchy.ts（comment only）
Unchanged safety / prior UX packages vs main（empty diff）:
  spfx/src/shell/dashboard/**
  spfx/src/shell/users/**
  spfx/src/shell/records/**
  spfx/src/shell/review/**
  spfx/src/adapters/**
  src/**
Smoke:
  spfx/smoke/demo-ux-14/run-smoke.mjs
  /opt/cursor/artifacts/demo-ux-14-browser-smoke/smoke-report.json（allPass: true, 10/10）
  cases: save-unsaved / saving / saved / save_failed / save_outcome_unknown
         saving-nav-stays-disabled / unselected / access_denied
         unknown-non-collapse / hierarchy-quiet-saved-no-progress
  companion regressions already recorded: shell-ux-2 7/7；demo-ux-12 9/9
Docs:
  decision-demo-ux-14-saving-progress-observability-selection.md
  demo-ux-14-implementation-start.md
  demo-ux-14-browser-smoke.md
Post-verified tip commits（docs / prettier only）:
  56ee25c docs evidence + format
  cdb3e78 ledger finalize
  a77a9e6 pin browser-smoke verified HEAD
```

## Findings

| Sev | ID | Status | Note |
|---|---|---|---|
| P2 | DUX14-P2-1 | OPEN | demo-ux-14 smoke asserts progress cue presence/absence and 「進行中」text, but does not emulate `prefers-reduced-motion: reduce` to assert `animation: none`. Non-blocking: CSS media query is present and text cue remains when motion is off. |
| P2 | DUX14-P2-2 | OPEN | demo-ux-14 smoke does not re-run full DEMO-UX-7〜13 harness suites. Non-blocking: those surface packages have **no** code delta vs main; chrome wrap is inert when not saving；shell-ux-2 / demo-ux-12 regressions PASS. |

```text
P0 = 0
P1 = 0
P2 OPEN = 2
Independent Review / Fresh Review: PASS
```

Deferred OUT（not new defects）:

```text
actual save / autosave / timer saving→saved = OUT
persisted draft / SharePoint write / live I/O = OUT
mutation enablement = OUT
Ready / Merge / Deploy / #299 Close = NOT AUTHORIZED
```

## Strict progression

```text
1. This Fresh Review = PASS
2. Human Ready Decision = NOT AUTHORIZED（separate）
3. Merge = NOT AUTHORIZED
4. Deploy / SharePoint write / #299 Close remain NOT AUTHORIZED
```

## Non-claims

```text
This review does not authorize Ready
This review does not authorize Merge
This review does not authorize Deploy
This review does not authorize SharePoint mutation
This review does not close #299
```
