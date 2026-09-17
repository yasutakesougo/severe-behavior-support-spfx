# SBS — PLANNING-PC-DEMO-1 PROCESS-VISIBILITY SECTION-NAV STALE-SMOKE Exact Slice Human Implementation Start GO (CONSUMED)

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: PLANNING-PC-DEMO-1-PROCESS-VISIBILITY-SECTION-NAV-STALE-SMOKE-EXPECTATION-IMPLEMENTATION-START-1
kind: Human Implementation Start GO consumption
date: 2026-09-17
receivedAt: 2026-09-17T12:39:00Z
baselineMain: 30f6019137d7e7b50a2dec02b038a285c9cf373c
PR: #662
branch: cursor/planning-pc-stale-smoke-exact-slice-4124
Definition:
  docs/architecture/planning-pc-demo-1-process-visibility-section-nav-stale-smoke-expectation-exact-slice-definition-1.md
  status: APPROVED / LOCKED
  approved §5–§6 bind this GO
Definition APPROVE:
  docs/architecture/planning-pc-demo-1-process-visibility-section-nav-stale-smoke-expectation-definition-approve-1.md

Implementation Start GO: RECEIVED / CONSUMED
Scope: planning-pc-demo-1 stale smoke expectation alignment ONLY
Authorized changed-area:
  spfx/smoke/planning-pc-demo-1/run-smoke.mjs
  (PLANNER section-nav expectation only)
Optional evidence:
  docs/architecture/planning-pc-demo-1-browser-smoke.md
  this Implementation Start / evidence note

Ready / Merge: HOLD (Fresh Independent Implementation Review required next)
Full Acceptance PRECHECK / re-execution: NOT AUTHORIZED
Issue #445 Close / body mutation: NOT AUTHORIZED
Product / domain / fixture / schema mutation: NOT AUTHORIZED
AC-4 / AC-7 reopen: NOT AUTHORIZED
Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
```

## Human speech-act (verbatim binding)

```text
Human Implementation Start GO — bind APPROVED Definition §5–§6
```

## Bound mutation (Definition §4 / §5)

```text
REPLACE in planner-section-navigation check:
  FROM: planning-pc-plan-records-heading
  TO:   planner-process-records-heading

PRESERVE:
  section-navigation root
  aria-pressed === "true"
  data-planning-pc="recent-records"
  other PLANNING-PC-DEMO-1 cases
  product behavior / planner-process-records-heading already on main
  #445 OPEN
  historical Full Acceptance result
```

## Explicit OUT (Definition §6)

```text
Product UI / PROCESS-VISIBILITY redesign
domain / fixture / schema (unless proven-necessary hygiene — none expected)
Other smoke runners
Acceptance runner / Full Acceptance rewrite / PRECHECK
AC-4 / AC-7 reopen
Issue #445 Close / body mutation
Ready / Merge automation
Deploy / LIVE WRITE / SharePoint / M365 / Entra
```

## NEXT

```text
correction (this GO)
↓ Fresh Independent Implementation Review
↓ Ready / Merge
↓ Full Acceptance PRECHECK GO (separate gate; new GO required)
  lock: docs/architecture/sp-lc-6-full-acceptance-precheck-gate-separation-1.md
↓ Full Acceptance PRECHECK execution (only after PRECHECK GO)
↓ separate Acceptance Execution GO (later; not automatic)
```

```text
Implementation Start GO: RECEIVED / CONSUMED
Smoke correction: EXECUTED / PASS (5 / 5)
CURRENT ACTION: STOP for Fresh Independent Implementation Review
Ready / Merge: HOLD
```
