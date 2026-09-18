# SBS-PLANNER-TOP-LEVEL-IA-V1 — Implementation Correction-3

Evidence Environment Correction-3 for P1-EVIDENCE-1 (Japanese glyph rendering in CI headless Chrome).

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: SBS-PLANNER-TOP-LEVEL-IA-V1
kind: implementation correction-3 (rendered evidence environment only)
status: APPLIED / AWAITING FRESH INDEPENDENT IMPLEMENTATION RE-REVIEW-4
date: 2026-09-18

Human Correction-3 Scope: P1-EVIDENCE-1 ONLY
Product behavior mutation: NONE
Definition mutation: NONE
Exact Scope mutation: NONE
Product Ready GO: NOT CONSUMED
Merge GO: NOT CONSUMED
Deploy / LIVE WRITE: NOT AUTHORIZED
```

## Bound change

| Surface | Change |
|---|---|
| `.github/workflows/sbs-planner-top-level-ia-v1-browser-smoke.yml` | Install `fonts-noto-cjk`, refresh font cache, verify `fc-list :lang=ja` before smoke |

## Preserved (Correction-2 / AC-PL-TL-15)

| Surface | Unchanged behavior |
|---|---|
| same workflow | `actions/checkout` `ref: ${{ github.event.pull_request.head.sha }}` |
| same workflow | verify `git rev-parse HEAD` equals PR exact head |
| same workflow | `SBS_PLANNER_TL_IA_IMPLEMENTATION_HEAD` = PR exact head |

## Why

Semantic / DOM acceptance and exact-head binding already PASS. Human-readable rendered screenshots on `ubuntu-latest` showed tofu boxes because the runner lacked Japanese-capable fonts. This tranche remediates the **evidence environment only**.

## Parent evidence HEAD

```text
Correction-2 exact-head bind HEAD: 3491a0352f61e669a9698f3b6c4c46abbe6266c9
Correction-3 evidence env HEAD:   this commit (descendant of 3491a035…)
```

## Explicit OUT

```text
Product UI / ScaffoldShell / planner-task-navigation behavior change
Definition / Exact Scope Amendment
Vendored / binary font files in repository
Product CSS changes to hide CI font defect
Japanese copy replacement with English
Weakened screenshot assertions
Product Ready GO / Merge GO / Deploy / LIVE WRITE
Self-PASS of Fresh Independent Implementation Re-Review-4
```

## Next gate

```text
corrected evidence HEAD
  → CI SUCCESS (planner smoke screenshots human-readable Japanese)
  → exact_head / checked_out / implementationHead = PR exact HEAD
  → Fresh Independent Implementation Re-Review-4
  → (later) Human Task Acceptance / Product Ready / Merge — separate Human GOs
```
