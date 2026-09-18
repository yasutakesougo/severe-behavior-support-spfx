# SBS-PLANNER-TOP-LEVEL-IA-V1 — Implementation Correction-2

Evidence-only Correction-2 for AC-PL-TL-15 (exact implementation HEAD binding).

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: SBS-PLANNER-TOP-LEVEL-IA-V1
kind: implementation correction-2 (evidence-only)
status: APPLIED / AWAITING FRESH INDEPENDENT IMPLEMENTATION RE-REVIEW-3
date: 2026-09-18

Human Correction-2 Scope: AC-PL-TL-15 ONLY
Product UI / Exact Scope §3 Product files: UNCHANGED
Product Ready GO: NOT CONSUMED
Merge GO: NOT CONSUMED
Deploy / LIVE WRITE: NOT AUTHORIZED
```

## Bound change

| Surface | Change |
|---|---|
| `.github/workflows/sbs-planner-top-level-ia-v1-browser-smoke.yml` | `actions/checkout` uses `ref: ${{ github.event.pull_request.head.sha }}` |
| same workflow | `SBS_PLANNER_TL_IA_IMPLEMENTATION_HEAD` = that same `github.event.pull_request.head.sha` |
| same workflow | verify step asserts `git rev-parse HEAD` equals PR exact head |

## Why

On `pull_request`, default `github.sha` is the **merge ref**, not the PR head. AC-PL-TL-15 requires reproducible browser evidence at the **exact implementation HEAD**. Correction-1 Product tree remains; this tranche binds evidence only.

## Parent Product HEAD

```text
Correction-1 Product closed HEAD: 91ad30626f0a1524e0fba84f8a1b759e5e9340a2
Correction-2 evidence bind HEAD:  this commit (descendant of 91ad3062…)
```

## Explicit OUT

```text
Product UI / ScaffoldShell / planner-task-navigation behavior change
Exact Scope Amendment
IScaffoldShellProps re-expansion
Smoke hygiene lane beyond this AC-PL-TL-15 bind
Product Ready GO / Merge GO / Deploy / LIVE WRITE
Self-PASS of Fresh Independent Implementation Re-Review-3
```

## Next gate

```text
corrected evidence HEAD
  → CI SUCCESS (planner smoke artifact implementationHead = PR head.sha)
  → Fresh Independent Implementation Re-Review-3
  → (later) Human Task Acceptance / Product Ready / Merge — separate Human GOs
```
