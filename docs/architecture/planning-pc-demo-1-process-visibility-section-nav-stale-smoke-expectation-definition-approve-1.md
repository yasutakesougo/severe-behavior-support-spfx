# SBS — PLANNING-PC-DEMO-1 PROCESS-VISIBILITY SECTION-NAV STALE-SMOKE Exact Slice Human Definition APPROVE (CONSUMED)

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: PLANNING-PC-DEMO-1-PROCESS-VISIBILITY-SECTION-NAV-STALE-SMOKE-EXPECTATION-DEFINITION-APPROVE-1
kind: Human Exact Slice Definition APPROVE consumption (docs only)
date: 2026-09-17
receivedAt: 2026-09-17T12:35:16Z
observedMain: 30f6019137d7e7b50a2dec02b038a285c9cf373c
PR: #662
branch: cursor/planning-pc-stale-smoke-exact-slice-4124

Definition APPROVE: RECEIVED / CONSUMED / LOCKED
Basis:
  docs/architecture/planning-pc-demo-1-process-visibility-section-nav-stale-smoke-expectation-exact-slice-definition-1.md
Scope: planning-pc-demo-1 stale smoke expectation alignment ONLY
Human Implementation Start GO: NOT AUTHORIZED / NOT RECEIVED
Repository product / smoke / fixture mutation: NOT AUTHORIZED / NOT PERFORMED
Issue #445 Close / body mutation: NOT PERFORMED / NOT AUTHORIZED
Full Acceptance PRECHECK / re-execution: NOT AUTHORIZED
historical Full Acceptance rewrite: NOT AUTHORIZED
AC-4 / AC-7 reopen: NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
```

## Human speech-act (verbatim binding)

```text
PLANNING-PC-DEMO-1 PROCESS-VISIBILITY SECTION-NAV
STALE-SMOKE-EXPECTATION EXACT SLICE
Human Exact Slice Definition APPROVE

Basis
= planning-pc-demo-1-process-visibility-section-nav-stale-smoke-expectation-exact-slice-definition-1.md

Scope
= planning-pc-demo-1 stale smoke expectation alignment ONLY

APPROVE
= Definition APPROVED / LOCKED

Preserve
= current product behavior
= planner-process-records-heading
= #445 OPEN
= historical Full Acceptance result

Not authorized
= Implementation Start
= smoke / product / fixture mutation
= Full Acceptance PRECHECK / re-execution
= #445 Close / body mutation
= AC-4 / AC-7 reopen
= Ready / Merge / Deploy / LIVE WRITE

NEXT
= separate Human Implementation Start GO
```

## Consumption result

| Gate | Result |
|---|---|
| Exact Slice Definition | **APPROVED / LOCKED** |
| Definition APPROVE | **RECEIVED / CONSUMED / LOCKED** |
| Scope | **planning-pc-demo-1 stale smoke expectation alignment ONLY** |
| Implementation Start | **NOT AUTHORIZED / NOT RECEIVED** |
| Product / smoke / fixture mutation | **0 / NOT AUTHORIZED** |
| Full Acceptance PRECHECK / re-execution | **NOT AUTHORIZED** |
| Historical Full Acceptance | **PRESERVED** |
| Product behavior / `planner-process-records-heading` | **PRESERVED** |
| `#445` | **OPEN / KEEP OPEN** |
| AC-4 / AC-7 | **NOT REOPENED** |
| Ready / Merge / Deploy / LIVE WRITE | **NOT AUTHORIZED** |

Updated definition header/Gate:
`docs/architecture/planning-pc-demo-1-process-visibility-section-nav-stale-smoke-expectation-exact-slice-definition-1.md`

## Locked bind (do not reopen without a new Human Decision)

```text
planning-pc-demo-1 stale smoke expectation alignment ONLY

Future Implementation Start (when separately authorized) binds:
  Unit = PLANNING-PC-DEMO-1-PROCESS-VISIBILITY-SECTION-NAV-STALE-SMOKE-EXPECTATION-EXACT-SLICE-DEFINITION-1
  baseline main = 30f6019137d7e7b50a2dec02b038a285c9cf373c
    (or later Human-approved main SHA)
  changed-area = spfx/smoke/planning-pc-demo-1/run-smoke.mjs
    (PLANNER section-nav expectation only)
  FROM: planning-pc-plan-records-heading
  TO:   planner-process-records-heading
  acceptance criteria = definition §5
  OUT = definition §6

PRESERVE:
  current product behavior
  planner-process-records-heading (already on main)
  #445 OPEN
  historical Full Acceptance result

NOT THIS APPROVE:
  Implementation Start
  smoke / product / fixture mutation
  Full Acceptance PRECHECK / re-execution
  #445 Close / body mutation
  AC-4 / AC-7 reopen
  Ready / Merge / Deploy / LIVE WRITE
```

## NEXT

```text
Human:
  separate Human Implementation Start GO
  (must bind APPROVED definition §5–§7 / §3–§6)

Agent:
  STOP
  do not mutate smoke / product / fixtures
  do not Close #445
  do not run Full Acceptance PRECHECK / re-execution
```

```text
DEFINITION APPROVE: RECEIVED / CONSUMED / LOCKED
Implementation Start: NOT AUTHORIZED
CURRENT ACTION: STOP (await separate Human Implementation Start GO)
```
