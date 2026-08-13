# DEMO-UX-11 — Fresh Review

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Fresh Review（implementation PR）
Unit: DEMO-UX-11 — DEMO note consolidation
PR: #325
Implementation verified HEAD: 73ee88a8c43c7afab828ca99ef7a47cd37d91a46
PR tip HEAD: c7f49c25237f5079120c6b587e6d04807d1e07af
Selection: Decision-DEMO-UX-11-DEMO-NOTE-CONSOLIDATION-1
Implementation Start: demo-ux-11-implementation-start.md
Browser smoke: demo-ux-11-browser-smoke.md
Status: PASS
Findings: P0 = 0 / P1 = 0 / P2 = 2 OPEN（non-blocking）
Human Ready: NOT AUTHORIZED（separate Human gate）
Merge / Deploy / SharePoint write / #299 Close: NOT AUTHORIZED
```

## Authority

Human instruction `DEMO-UX-11 Fresh Review GO` authorizes this review only.

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
| R1 | Scope = RPF-004 DEMO note consolidation only | **PASS** |
| R2 | Global DemoBanner kept（文言 unchanged vs main） | **PASS** |
| R3 | Ready screen-level synthetic bands removed（OV/US/REC/REV/SP/UD） | **PASS** |
| R4 | Overview KPI / review-entry duplicate notes removed；Family R + action note kept | **PASS** |
| R5 | Users filter hint consolidated to one system；bottom FILTER_NOTE removed | **PASS** |
| R6 | SharePoint live I/O なし明示 remains（banner + remaining boundaries） | **PASS** |
| R7 | 実保存不可 remains（Records draft/mutation；Overview action；Review/SP mutation） | **PASS** |
| R8 | `access_denied` / unselected / `save_outcome_unknown` not weakened（smoke + save-state untouched） | **PASS** |
| R9 | No live/persisted-data misread introduced（mutation disabled；「として表示」/「実保存なし」残存） | **PASS** |
| R10 | DEMO-UX-7 today-actions surface retained on Overview | **PASS** |
| R11 | DEMO-UX-8 filter counts preserved（smoke 期限接近=3） | **PASS** |
| R12 | DEMO-UX-9 records incomplete/draft/mutation preserved | **PASS** |
| R13 | DEMO-UX-10 Family R / Family A notes preserved | **PASS** |
| R14 | No RPF-005 / DUX7-P2-1 / RPF-007 / adapter / write leakage | **PASS** |
| R15 | DemoBanner / save-state / SiteUnselectedStop files have **no** content delta | **PASS** |
| R16 | Verification evidence present（root 554 / Heft 86 / smoke 8/8） | **PASS** |
| R17 | Tip after verified HEAD is docs-only pin sync | **PASS** |
| R18 | Review PASS ≠ Ready / Merge / Deploy / #299 Close | **PASS** |

## Evidence inspected

```text
Tip: c7f49c25237f5079120c6b587e6d04807d1e07af
Verified code family: 73ee88a8c43c7afab828ca99ef7a47cd37d91a46
Core:
  spfx/src/shell/ux/demo-note-consolidation.ts
  OverviewDashboard.tsx / UsersList.tsx / DailyRecords.tsx
  ReviewDueState.tsx / SupportPlan.tsx / UserDetail.tsx
  DemoBanner.tsx / save-state.ts / SiteUnselectedStop.tsx（unchanged）
Smoke:
  spfx/smoke/demo-ux-11/run-smoke.mjs
  /opt/cursor/artifacts/demo-ux-11-browser-smoke/smoke-report.json（allPass: true, 8/8）
  screenshots: overview / users / records / review / fail-closed
Docs:
  decision-demo-ux-11-demo-note-consolidation-selection.md
  demo-ux-11-implementation-start.md
  demo-ux-11-browser-smoke.md
Scope negative:
  no AppShellChrome / adapters / users-filter.ts / daily-record-draft / save-state changes
```

## Findings

| Sev | ID | Status | Note |
|---|---|---|---|
| P2 | DUX11-P2-1 | OPEN | `UsersList` renders `DEMO_USERS_FILTER_HINT_CONSOLIDATED` and no longer uses `presentation.filterHint` for display. Fixture field remains for type/compat. Non-blocking. |
| P2 | DUX11-P2-2 | OPEN | Browser smoke covers `access_denied` / unselected / `save_outcome_unknown` but not a dedicated `retrieval_failed` case. Non-blocking because fail-closed copy/paths are untouched. |

```text
P0 = 0
P1 = 0
P2 OPEN = 2
Independent Review / Fresh Review: PASS
```

Deferred OUT（not new defects）:

```text
RPF-005 保存バッジ階層 remains OUT
DUX7-P2-1 detail-preview A-only remains OUT
RPF-007 保存中進行表示 remains OUT
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
