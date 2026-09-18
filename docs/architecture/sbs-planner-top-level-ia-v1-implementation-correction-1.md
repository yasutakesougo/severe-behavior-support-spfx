# SBS-PLANNER-TOP-LEVEL-IA-V1 — Implementation Correction-1

Human Correction-1 apply record for Independent Implementation Review P1 findings on PR #667.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: SBS-PLANNER-TOP-LEVEL-IA-V1
kind: implementation correction-1 apply record
status: APPLIED / AWAITING FRESH INDEPENDENT IMPLEMENTATION RE-REVIEW-2
date: 2026-09-18

Human Correction-1 Scope: P1-1 / P1-2 / P1-3 ONLY
Exact Scope Amendment: NOT AUTHORIZED / NOT APPLIED
Independent Scope Re-Review: NOT REQUIRED (no silent expansion; props reverted)
Product Ready GO: NOT CONSUMED
Merge GO: NOT CONSUMED
Deploy / LIVE WRITE: NOT AUTHORIZED
```

## Bound P1 closures

| ID | Finding | Disposition |
|---|---|---|
| P1-1 | `IScaffoldShellProps.ts` changed outside Exact Scope §3 | **CLOSED** — file reverted to `origin/main`. PLANNER/cycle injection is smoke/test-only via private runtime cast inside `ScaffoldShell.tsx` + `smoke-entry.tsx` query. No Exact Scope Amendment. |
| P1-2 | `spfx/smoke/sbs-planner-top-level-ia-v1/.gitignore` outside §6 | **CLOSED** — removed from PR #667. Hygiene returns to SEPARATE smoke hygiene lane. |
| P1-3 | Product-visible 工程①–⑥ cycle selector | **CLOSED** — selector removed from Product UI. D-HOME displays `currentCycle` + next-hand orientation. Cycle seeding is smoke query / unit module API only. |

## Explicit OUT of Correction-1

```text
Exact Scope Amendment / Independent Scope Re-Review
AppShellChrome / SupportPlan / FIELD_STAFF CORR-1F/1G rewrite
Product Ready GO / Merge GO / Deploy / LIVE WRITE
Smoke hygiene lane closure beyond deleting this-unit .gitignore
Self-PASS of Fresh Independent Implementation Re-Review-2
```

## Next gate

```text
corrected HEAD
  → CI SUCCESS
  → rendered screenshots
  → Fresh Independent Implementation Re-Review-2
  → (later) Human Task Acceptance / Product Ready / Merge — separate Human GOs
```
