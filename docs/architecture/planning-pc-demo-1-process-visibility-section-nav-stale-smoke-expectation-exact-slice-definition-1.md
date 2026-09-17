# PLANNING-PC-DEMO-1 PROCESS-VISIBILITY SECTION-NAV STALE-SMOKE-EXPECTATION EXACT-SLICE-DEFINITION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Issue: #445 (parent acceptance residual; KEEP OPEN; no Issue mutation / no Close)
Unit: PLANNING-PC-DEMO-1-PROCESS-VISIBILITY-SECTION-NAV-STALE-SMOKE-EXPECTATION-EXACT-SLICE-DEFINITION-1
Kind: exact-slice definition / scope fixation only
Date: 2026-09-17
Baseline main: 30f6019137d7e7b50a2dec02b038a285c9cf373c
Authority inputs:
  Human Acceptance disposition KEEP #445 OPEN
    docs/architecture/sbs-445-full-acceptance-reexecution-human-acceptance-disposition-keep-open-1.md
  Fresh Independent Acceptance Review 1 (PR #661 docs lane)
    residual LOCKED = STALE SMOKE EXPECTATION
    primary surface = spfx/smoke/planning-pc-demo-1/run-smoke.mjs
  PROCESS-VISIBILITY-UI-V1 COMPLETE on main (PR #580)
    PLANNER sectionNavigation = PLANNER_SUPPORT_PLAN_PROCESS_NAVIGATION
  Analogous prior slice (pattern only; not authority to mutate):
    docs/architecture/sp-lc-6-demo-ux-6-stale-smoke-expectation-exact-slice-definition-1.md

Exact Slice Definition status: APPROVED / LOCKED
Definition Start: CONSUMED
Exact Slice Definition APPROVE: RECEIVED / LOCKED
  Human: PLANNING-PC-DEMO-1 PROCESS-VISIBILITY SECTION-NAV
         STALE-SMOKE-EXPECTATION Exact Slice Definition APPROVE
  ReceivedAt: 2026-09-17T12:35:16Z
  Basis: this document
  Scope: planning-pc-demo-1 stale smoke expectation alignment ONLY
  Consumption: docs/architecture/planning-pc-demo-1-process-visibility-section-nav-stale-smoke-expectation-definition-approve-1.md
Human Implementation Start GO: RECEIVED / CONSUMED
  Human: Human Implementation Start GO — bind APPROVED Definition §5–§6
  ReceivedAt: 2026-09-17T12:39:00Z
  Bound: approved §5–§6
  Consumption: docs/architecture/planning-pc-demo-1-process-visibility-section-nav-stale-smoke-expectation-implementation-start-1.md
  Changed-area: spfx/smoke/planning-pc-demo-1/run-smoke.mjs
    (PLANNER section-nav expectation only)
Acceptance re-execution: NOT AUTHORIZED
Product / domain / fixture / schema mutation: NOT AUTHORIZED
Issue #445 mutation / Close: NOT AUTHORIZED
Ready / Merge: HOLD (Fresh Independent Implementation Review required next)
Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
AC-4 / AC-7 reopen: OUT
historical Full Acceptance rewrite: OUT
```

## 1. Exact objective

Align the PLANNING-PC-DEMO-1 browser smoke runner's PLANNER section-navigation
expectation with the PROCESS-VISIBILITY-UI-V1 process-nav IDs already shipped on
main, without changing product, domain, fixture, acceptance-runner semantics,
or historical Full Acceptance results.

```text
Problem (CONFIRMED on main 30f60191; Fresh Review R7 LOCKED):
  PLANNER SupportPlan uses
    PLANNER_SUPPORT_PLAN_PROCESS_NAVIGATION
    data-planning-pc-section-nav="planner-process-*-heading"
  planning-pc-demo-1 run-smoke.mjs still clicks / asserts
    [data-planning-pc-section-nav="planning-pc-plan-records-heading"]
    activeElement.id === "planning-pc-plan-records-heading"

Observed failure (Full Acceptance Re-Execution §16 / AC-6):
  Error: No element found for selector:
  [data-planning-pc-section-nav="planning-pc-plan-records-heading"]
  at spfx/smoke/planning-pc-demo-1/run-smoke.mjs:216

Machine class (runner pattern artifact):
  ENVIRONMENT_BLOCKED
  (failure stack under /tmp/node_modules/puppeteer-core/... matches "puppeteer")

Semantic class (LOCKED):
  STALE SMOKE EXPECTATION / UI navigation evolution
  affects AC-6 directly; AC-9 inherits via merge precedence while planning-pc blocked

Non-problem:
  PLANNER process-nav product surface already on main (PROCESS-VISIBILITY COMPLETE)
  AC-4 / AC-7 acceptance-layer drift (PASS on re-execution)
  true missing-chrome / missing-module environment gap
  lifecycle identity chain / D1–D6 semantics
```

This Exact Slice fixes the smoke expectation only. It does not invent new
PROCESS-VISIBILITY behavior and does not retroactively rewrite recorded
SP-LC-6 Full Acceptance results.

## 2. Authority / classification (do not redecide)

```text
Parent acceptance residual owner:
  Issue #445 — KEEP OPEN (Human Acceptance disposition CONSUMED)

Classification evidence:
  Fresh Independent Acceptance Review 1
    STALE SMOKE EXPECTATION / planning-pc-demo-1 PROCESS-VISIBILITY section-nav
  Full Acceptance Re-Execution on exact main 30f60191
    overallResult = ENVIRONMENT_BLOCKED
    AC-6 / AC-9 = ENVIRONMENT_BLOCKED (planning-pc-demo-1)

PROCESS-VISIBILITY product (already on main; do not reimplement):
  spfx/src/shell/users/support-plan-copy.ts
    PLANNER_SUPPORT_PLAN_PROCESS_NAVIGATION
      planner-process-plan-heading       ① 計画
      planner-process-support-heading    ② 支援
      planner-process-records-heading    ③ 記録
      planner-process-monitoring-heading ④ モニタリング
      planner-process-review-heading     ⑤ 見直し
      planner-process-next-version-heading ⑥ 次版準備
  spfx/src/shell/users/SupportPlan.tsx
    presentationRole === "PLANNER"
      → sectionNavigation = PLANNER_SUPPORT_PLAN_PROCESS_NAVIGATION
    planning-pc-plan-records-heading remains an inner detail heading id
      (not a PLANNER section-nav target)

ADMIN_AUDIT pre-V1 nav (unchanged; out of PLANNER smoke path):
  PLANNING_PC_SUPPORT_PLAN_SECTION_NAVIGATION
  still includes planning-pc-plan-records-heading
```

AC-4 / AC-7 remain separate residuals and are out of this slice. This slice does
not reopen them. Historical Full Acceptance `GAP_FOUND` rewrite is out.

## 3. Changed-area candidate (future Implementation Start only)

Candidate paths only. This definition does **not** authorize mutation.

```text
IN (exactly 1 primary mutation target):
  spfx/smoke/planning-pc-demo-1/run-smoke.mjs
    planner-section-navigation check only
    (selector + activeElement.id + aria-pressed target bind
     for PROCESS-VISIBILITY ③ 記録)

OPTIONAL evidence docs (future Implementation Start / closeout only):
  docs/architecture/planning-pc-demo-1-browser-smoke.md
    only if needed to record post-fix smoke PASS evidence
    and/or note PROCESS-VISIBILITY section-nav expectation
  docs/architecture/* implementation-start or evidence note for this slice
    only if required by publication process

OPTIONAL minimum contract/fixture hygiene (ONLY IF needed after smoke bind):
  none expected a priori
  planning-pc-demo-graph-contract / planning-pc-demo-graph-fixtures
    are domain graph contracts — NOT section-nav selectors
  authorize touch ONLY if Implementation Start discovery proves a
    selector/constant shared with the smoke check is required for fail-closed
    consistency; otherwise leave untouched

NOT candidates:
  spfx/src/shell/users/SupportPlan.tsx
  spfx/src/shell/users/support-plan-copy.ts
  spfx/src/shell/users/SupportPlanUx.module.scss
  spfx/src/shell/users/support-plan.test.ts
    (unit expectations already match PROCESS-VISIBILITY)
  other smoke runners (demo-ux-*, dashboard-ux-1, sbs-mgmt-loop-b, …)
  scripts/acceptance/*
  tests/contracts/sp-lc-6-synthetic-lifecycle-acceptance.test.ts
  product / domain / fixture / schema / SharePoint paths
  Issue #445 body / labels / close
```

## 4. Exact future mutation semantics

When a later Human `Implementation Start GO` binds this definition, the
authorized mutation is limited to:

```text
REPLACE in planner-section-navigation check:
  click / querySelector /
  waitForFunction activeElement.id /
  aria-pressed selected target:

  FROM:
    planning-pc-plan-records-heading

  TO:
    planner-process-records-heading

  (PROCESS-VISIBILITY ③ 記録 — already the PLANNER nav target on main)
```

Preserve fail-closed intent of the check:

```text
PRESERVE:
  data-planning-pc="section-navigation" root present
  selected nav control observable as selected
    PROCESS-VISIBILITY PLANNER: aria-current="location"
      (product already uses this; do NOT require pre-V1 aria-pressed)
  recent-records surface reachable after nav
    (data-planning-pc="recent-records" or equivalent already-asserted marker)
  other PLANNING-PC-DEMO-1 cases unchanged:
    planner-support-plan-graph
    planner-review-materials-nested
    planner-back-to-support-plan
    field-staff-demo-ux-4-regression
  PLANNING_PC_DEMO_1_SLICE flags / presentationOnly boundaries
```

Optional (same Implementation Start only; still smoke-runner scoped):

```text
MAY add minimal PROCESS-VISIBILITY presence asserts, e.g.:
  data-process-visibility-ui-v1="navigation" on the nav root
  selected control label includes "③" / "記録"
ONLY if needed to prevent silent regression to pre-V1 nav IDs.
MUST NOT expand into new product UX acceptance or persona matrix.
```

No product copy / nav / heading id change is authorized. The smoke expectation
moves to the already-shipped PROCESS-VISIBILITY PLANNER process-nav target.

## 5. Acceptance criteria (bind targets for future Implementation Start GO)

- `spfx/smoke/planning-pc-demo-1/run-smoke.mjs` no longer requires
  `data-planning-pc-section-nav="planning-pc-plan-records-heading"` for the
  PLANNER section-navigation check.
- Section-nav assertion binds to `planner-process-records-heading`
  (PROCESS-VISIBILITY ③ 記録) already rendered for `presentationRole=PLANNER`.
- Focused PLANNING-PC-DEMO-1 smoke re-run after Implementation Start shows PASS
  for `planner-section-navigation` (and does not regress the other four cases).
- Diff touches only the authorized smoke assertion path (plus optional
  evidence/docs explicitly listed in the Implementation Start GO; plus optional
  minimum contract/fixture hygiene only if proven necessary).
- No product / domain / schema / acceptance-runner / Full Acceptance rewrite.
- No Issue #445 mutation / close.
- No Deploy / Production Binding / LIVE WRITE / SharePoint / M365 / Entra.
- Recorded SP-LC-6 Full Acceptance results (historical §11 and re-execution §16)
  are not retroactively rewritten by this slice. Any future Full Acceptance
  PRECHECK / re-execution requires a separate Human GO after Ready / Merge.

## 6. Explicit OUT

```text
Product UI / PROCESS-VISIBILITY redesign or reimplementation
domain / fixture / schema changes (except optional minimum hygiene IF needed)
Other smoke runners
Acceptance runner / Full Acceptance contract-test mutation
historical Full Acceptance GAP_FOUND rewrite
Full Acceptance re-execution / PRECHECK without separate Human GO
AC-4 / AC-7 reopen or remediation
AC-9 acceptance-layer rewrite (AC-9 may clear after planning-pc PASS on a
  later Full Acceptance PRECHECK; that PRECHECK is a separate gate)
Issue #445 comment / label / close / reopen
Ready / Merge automation
Deploy / App Catalog / Production Binding
SharePoint / M365 / Entra / LIVE WRITE
```

## 7. Why this Exact Slice is minimal

```text
CONFIRMED root cause:
  one stale PLANNER section-nav selector family in planning-pc-demo-1
  (pre-V1 planning-pc-plan-records-heading vs PROCESS-VISIBILITY
   planner-process-records-heading)

CONFIRMED non-root-cause:
  PROCESS-VISIBILITY product surface
  AC-4 / AC-7 semantics
  domain graph fixtures
  true chrome/tool environment absence

Scope discipline:
  one runner
  one assertion family (PLANNER section-nav bind for ③ 記録)
  no product code
```

## 8. Rollback boundary

If a later Implementation Start is authorized and then rolled back, rollback is
limited to restoring the PLANNING-PC-DEMO-1 smoke section-nav assertion (and any
optional evidence docs / proven-necessary hygiene added for that slice).

Rollback must not:

- change PROCESS-VISIBILITY product nav or copy;
- rewrite SP-LC-6 Full Acceptance evidence sections;
- reopen AC-4 / AC-7;
- mutate Issue / Ready / Merge / Deploy / live systems.

Safe rollback state = current baseline main with the pre-slice
PLANNING-PC-DEMO-1 smoke assertion unchanged.

## 9. Gate

```text
Exact Slice Definition / scope fixation:
  COMPLETE / APPROVED / LOCKED

Human gate 0 (separate lane; already CONSUMED):
  Human Acceptance disposition = KEEP #445 OPEN
  docs/architecture/sbs-445-full-acceptance-reexecution-human-acceptance-disposition-keep-open-1.md

Human gate 1:
  Exact Slice Definition APPROVE = RECEIVED / LOCKED
  Human: PLANNING-PC-DEMO-1 PROCESS-VISIBILITY SECTION-NAV
         STALE-SMOKE-EXPECTATION Exact Slice Definition APPROVE
  ReceivedAt: 2026-09-17T12:35:16Z
  Consumption:
    docs/architecture/planning-pc-demo-1-process-visibility-section-nav-stale-smoke-expectation-definition-approve-1.md

Human gate 2:
  Implementation Start GO = RECEIVED / CONSUMED
  Human: Human Implementation Start GO — bind APPROVED Definition §5–§6
  ReceivedAt: 2026-09-17T12:39:00Z
  Bound:
    this Unit
    baseline main 30f6019137d7e7b50a2dec02b038a285c9cf373c
    changed-area = spfx/smoke/planning-pc-demo-1/run-smoke.mjs
      (PLANNER section-nav expectation only)
    acceptance criteria in §5
    OUT list in §6
  Consumption:
    docs/architecture/planning-pc-demo-1-process-visibility-section-nav-stale-smoke-expectation-implementation-start-1.md

Then (separate gates; do not collapse):
  correction (authorized by this GO)
  ↓ Fresh Independent Implementation Review
  ↓ Ready / Merge
  ↓ Full Acceptance PRECHECK again

Still forbidden without separate Human GO:
  product / domain / fixture / schema mutation
  Acceptance re-execution / Full Acceptance PRECHECK
  Issue mutation / Close
  Ready / Merge
  Deploy / Production Binding / LIVE WRITE
  AC-4 / AC-7 reopen

NEXT:
  Fresh Independent Implementation Review
  CURRENT ACTION: execute authorized smoke expectation alignment; then STOP for Review
```

```text
EXACT-SLICE-DEFINITION-1: APPROVED / LOCKED
Implementation Start: RECEIVED / CONSUMED
CURRENT ACTION: correction under §5–§6; then Fresh Independent Implementation Review
```

## 10. Implementation evidence (Implementation Start GO)

```text
Human GO:
  Human Implementation Start GO — bind APPROVED Definition §5–§6
  ReceivedAt: 2026-09-17T12:39:00Z
  Consumption:
    docs/architecture/planning-pc-demo-1-process-visibility-section-nav-stale-smoke-expectation-implementation-start-1.md

Authorized mutation:
  spfx/smoke/planning-pc-demo-1/run-smoke.mjs
  planner-section-navigation check
  FROM: planning-pc-plan-records-heading (+ pre-V1 aria-pressed selected assert)
  TO:   planner-process-records-heading
        + aria-current="location" selected assert
        + data-process-visibility-ui-v1="navigation"
        + label includes ③ / 記録
  Product / SupportPlan / process-nav: UNCHANGED
  (aria-current already on main for plannerProcess; smoke caught up)

Verification:
  node spfx/smoke/planning-pc-demo-1/run-smoke.mjs
  allPass: true
  cases: 5 / 5
  focus PASS: planner-section-navigation
  sibling PASS:
    planner-support-plan-graph
    planner-review-materials-nested
    planner-back-to-support-plan
    field-staff-demo-ux-4-regression
  artifacts:
    /opt/cursor/artifacts/planning-pc-demo-1-browser-smoke/smoke-report.json
    /opt/cursor/artifacts/planning-pc-demo-1-browser-smoke/planner-section-navigation.png

Not performed:
  product / domain / fixture / schema mutation
  other smoke runners
  Full Acceptance PRECHECK / re-execution
  historical Full Acceptance rewrite
  Issue #445 mutation / Close
  Deploy / Production Binding / LIVE WRITE
  Ready / Merge
```
