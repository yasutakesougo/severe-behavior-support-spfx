# DEMO-UX-10 — Fresh Review

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Fresh Review（implementation PR）
Unit: DEMO-UX-10 — KPI / review count correspondence
PR: #324
Implementation verified HEAD: 59f54f6915802ac837a91ead63b296ff738d45a2
PR tip HEAD: e67336b4844a7e5303aa40ec1794052777002c13
Selection: Decision-DEMO-UX-10-KPI-REVIEW-COUNT-1
Implementation Start: demo-ux-10-implementation-start.md
Browser smoke: demo-ux-10-browser-smoke.md
Status: PASS
Findings: P0 = 0 / P1 = 0 / P2 = 2 OPEN（non-blocking）
Human Ready: NOT AUTHORIZED（separate Human gate）
Merge / Deploy / SharePoint write / #299 Close: NOT AUTHORIZED
```

## Authority

Human instruction `DEMO-UX-10 Fresh Review GO` authorizes this review only.

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
| R1 | Scope = RPF-006 KPI ↔ review count correspondence only | **PASS** |
| R2 | Overview / Users / Review counts are explainable（何を数える / 範囲 / 対応先） | **PASS** |
| R3 | Same-metric alignment only: Overview KPI ↔ Users filter = Family R（3/2/3） | **PASS** |
| R4 | Different metrics distinguished: Family A Review summary/list（3件/2件）≠ Family R | **PASS** |
| R5 | Units/notes distinguish families（名 vs 件；非同等注記） | **PASS** |
| R6 | Numbers not force-aligned across unequal populations（R={A,C,F} vs A={A,B,C}） | **PASS** |
| R7 | No new business-rule / GOV-RULE / due calculation | **PASS** |
| R8 | Users rows unchanged；Review attention cast A/B/C unchanged（summary derived only） | **PASS** |
| R9 | Overview `deadline_near` 2→3 is Family R definition bind, not Review cast rewrite | **PASS** |
| R10 | Review summary 要確認 2→3 is attentionItems consistency, not Roster force-fit | **PASS** |
| R11 | DEMO-UX-7 today-actions present；smoke preserves B→review + records incomplete | **PASS** |
| R12 | DEMO-UX-8 filter counts preserved（smoke Users 3/2/3） | **PASS** |
| R13 | DEMO-UX-9 daily-record surface preserved（smoke incomplete list） | **PASS** |
| R14 | fail-closed `access_denied` preserved in smoke | **PASS** |
| R15 | `siteSelection=unselected` stop preserved in smoke | **PASS** |
| R16 | `save_outcome_unknown` remains non-normalized in smoke | **PASS** |
| R17 | No RPF-004 / RPF-005 / DUX7-P2-1 implementation leakage | **PASS** |
| R18 | No adapter / REST / AppShellChrome / save-state / live I/O / write path changes | **PASS** |
| R19 | Verification evidence present（root 554 / Heft 83 / smoke 8/8） | **PASS** |
| R20 | Tip after verified HEAD is docs-only pin sync | **PASS** |
| R21 | Review PASS ≠ Ready / Merge / Deploy / #299 Close | **PASS** |

## Evidence inspected

```text
Tip: e67336b4844a7e5303aa40ec1794052777002c13
Verified code family: 59f54f6915802ac837a91ead63b296ff738d45a2
Core code:
  spfx/src/shell/ux/kpi-review-count.ts
  spfx/src/shell/ux/kpi-review-count.test.ts
  spfx/src/shell/dashboard/overview-fixture.ts
  spfx/src/shell/dashboard/OverviewDashboard.tsx
  spfx/src/shell/users/UsersList.tsx
  spfx/src/shell/users/users-fixture.ts（filterHint only）
  spfx/src/shell/review/review-due-fixture.ts
  spfx/src/shell/review/ReviewDueState.tsx
Smoke:
  spfx/smoke/demo-ux-10/run-smoke.mjs
  /opt/cursor/artifacts/demo-ux-10-browser-smoke/smoke-report.json（allPass: true, 8/8）
  screenshots: overview-family-r / users-family-r / review-family-a
Docs:
  decision-demo-ux-10-kpi-review-count-selection.md
  demo-ux-10-implementation-start.md
  demo-ux-10-browser-smoke.md
Scope negative:
  no AppShellChrome / adapters / daily-record logic / save-state changes
```

## Findings

| Sev | ID | Status | Note |
|---|---|---|---|
| P2 | DUX10-P2-1 | OPEN | Correspondence notes add DEMO copy density on Overview / Users / Review. Selection-authorized; feeds deferred RPF-004. Non-blocking. |
| P2 | DUX10-P2-2 | OPEN | Browser smoke reasserts today-action **B** and records incomplete; full **C** detail path is not re-smoked here. Non-blocking because AppShellChrome / today-action wiring is untouched. |

```text
P0 = 0
P1 = 0
P2 OPEN = 2
Independent Review / Fresh Review: PASS
```

Deferred OUT（not new defects）:

```text
RPF-004 DEMO注記集約 remains OUT
RPF-005 保存バッジ階層 remains OUT
DUX7-P2-1 detail-preview A-only remains OUT
```

## Strict progression

```text
1. This Fresh Review = PASS
2. Human Ready Decision（HUMAN-ONLY）— HOLD until Human decides
3. Human Merge（HUMAN-ONLY）— only after Ready GO
4. Ready / Merge / Deploy / SharePoint write / #299 Close remain NOT AUTHORIZED by this review
```

## Non-claims

```text
This review does not authorize Ready
This review does not authorize Merge
This review does not authorize Deploy
This review does not authorize SharePoint mutation
This review does not close #299
```
