# SP-LC-6 DEMO-UX-6 STALE-SMOKE-EXPECTATION EXACT-SLICE-DEFINITION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Issue: #445 (parent acceptance residual; no Issue mutation)
Unit: SP-LC-6-DEMO-UX-6-STALE-SMOKE-EXPECTATION-EXACT-SLICE-DEFINITION-1
Kind: exact-slice definition / scope fixation only
Baseline main: 1846e3645ae759b2c9999bdf361f107ab59f2bcd
Authority inputs:
  SP-LC-6-SYNTHETIC-LIFECYCLE-ACCEPTANCE-DEFINITION-1 Gate NEXT
  sp-lc-6-synthetic-lifecycle-acceptance-evidence.md §12
    DEMO-UX-6 REVIEW-DUE GAP CLASSIFICATION-1
    AC-3 / AC-5 / AC-8 = STALE SMOKE EXPECTATION
Prior consumed:
  PR #514 DEFINITION-STATUS-SYNC-1 MERGED / CONSUMED
Definition Start GO: CONSUMED (scope fixation published on PR #515)
Exact Slice Definition APPROVE: RECEIVED / LOCKED
  Human: PR #515 Exact Slice Definition APPROVE
  Approved HEAD at receipt: f78863ad2b5cba2b5afd7409f90f03ac5567021c
Implementation Start GO: RECEIVED / CONSUMED
  Human: SP-LC-6 STALE-SMOKE-EXPECTATION Implementation Start GO
  Bound changed-area: spfx/smoke/demo-ux-6/run-smoke.mjs
    (assertReviewDueState demo-banner expectation only)
Acceptance re-execution: NOT AUTHORIZED
Product / domain / fixture / schema mutation: NOT AUTHORIZED
Issue mutation: NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
```

## 1. Exact objective

Align the DEMO-UX-6 browser smoke runner's demo-banner text expectation with the
post-VP-1 product copy already shipped on main, without changing any product,
domain, fixture, acceptance runner, or acceptance result.

```text
Problem (CONFIRMED on main):
  DemoBanner renders VP1_DEMO_SAFETY_NOTICE
    "デモ環境｜表示内容は合成データです。保存されません。"
  demo-ux-6 assertReviewDueState still requires
    "live SharePoint 接続なし" (pre-VP-1)

Effect:
  desktop-review-due-subsequent-anchor
  desktop-review-due
  tablet-review-due
  fail solely on the stale banner substring

Non-problem:
  lifecycle identity chain for AC-3 / AC-5 / AC-8 is not the defect
  other assertReviewDueState conditions already passed in acceptance evidence
```

This Exact Slice fixes the smoke expectation only. It does not invent new
Review / D5 / D6 behavior and does not retroactively rewrite the recorded
SP-LC-6 acceptance result.

## 2. Authority / classification (do not redecide)

```text
Parent acceptance Definition:
  docs/architecture/sp-lc-6-synthetic-lifecycle-acceptance-definition-1.md
  Gate NEXT = AC-3 / AC-5 / AC-8 stale smoke expectation Exact Slice
  DEFINITION-STATUS-SYNC-1 = COMPLETE / CONSUMED (PR #514)

Classification evidence:
  docs/architecture/sp-lc-6-synthetic-lifecycle-acceptance-evidence.md §12
  DEMO-UX-6 REVIEW-DUE GAP CLASSIFICATION-1
  AC-3 / AC-5 / AC-8 = STALE SMOKE EXPECTATION
  root cause = PR #493 / VP-1 banner copy change

VP-1 product copy (already on main; do not reimplement):
  spfx/src/shell/ux/vp1-demo-separation.ts
  VP1_DEMO_SAFETY_NOTICE
  DemoBanner.tsx renders that constant

Locked lifecycle selections (unchanged):
  D1=B / D2=B / D3=B / D4=A / D5=B / D6=A
```

AC-4 / AC-7 / AC-9 remain separate residuals and are out of this slice.

## 3. Changed-area candidate (future Implementation Start only)

Candidate paths only. This definition does not authorize mutation.

```text
IN (exactly 1 primary mutation target):
  spfx/smoke/demo-ux-6/run-smoke.mjs
    assertReviewDueState demo-banner substring only

OPTIONAL evidence docs (future Implementation Start / closeout only):
  docs/architecture/demo-ux-6-browser-smoke.md
    only if needed to record post-fix smoke PASS evidence
  docs/architecture/* implementation-start or evidence note for this slice
    only if required by publication process

NOT candidates:
  spfx/src/shell/ux/DemoBanner.tsx
  spfx/src/shell/ux/vp1-demo-separation.ts
  spfx/src/shell/review/*
  scripts/acceptance/*
  tests/contracts/sp-lc-6-synthetic-lifecycle-acceptance.test.ts
  other smoke runners (demo-ux-2/3/4/5/11, dashboard-ux-1, …)
  product / domain / fixture / schema / SharePoint paths
```

## 4. Exact future mutation semantics

When a later Human `Implementation Start GO` binds this definition, the
authorized mutation is limited to:

```text
REPLACE in assertReviewDueState:
  (demo?.textContent ?? "").includes("live SharePoint 接続なし")

WITH a check that matches current VP1_DEMO_SAFETY_NOTICE, e.g.:
  (demo?.textContent ?? "").includes(
    "デモ環境｜表示内容は合成データです。保存されません。"
  )

OR an equivalent fail-closed substring set that still requires:
  デモ環境
  合成データ
  保存されません
```

All other assertions inside `assertReviewDueState` remain unchanged:

```text
PRESERVE:
  items / statusLabels / dueLabels / reviewMaterials counts
  review heading / calculation note / semantic basis copy
  mutation buttons disabled / back enabled
  DEMO-UX-6 slice flag
  cssApplied / stateColumns / no horizontal overflow / no page errors
  overview and records baseline checks that only assert demoPresent
```

No product copy change is authorized. The smoke expectation moves to the
already-shipped VP-1 banner text.

## 5. Acceptance criteria (bind targets for future Implementation Start GO)

- `spfx/smoke/demo-ux-6/run-smoke.mjs` no longer requires pre-VP-1
  `live SharePoint 接続なし` for the review-due presentation checks.
- Demo banner assertion matches `VP1_DEMO_SAFETY_NOTICE` semantics already
  rendered by `DemoBanner`.
- Focused DEMO-UX-6 smoke re-run after Implementation Start shows PASS for:
  - `desktop-review-due-subsequent-anchor`
  - `desktop-review-due`
  - `tablet-review-due`
  and does not regress other DEMO-UX-6 checks.
- Diff touches only the authorized smoke assertion path (plus optional
  evidence/docs explicitly listed in the Implementation Start GO).
- No product / domain / fixture / schema / acceptance-runner / contract-test
  mutation.
- No Issue #445 mutation / close.
- No Deploy / Production Binding / LIVE WRITE / SharePoint / M365 / Entra.
- Recorded SP-LC-6 acceptance-report.json is not retroactively rewritten by
  this slice. Any future acceptance re-execution requires a separate Human
  Acceptance Execution GO.

## 6. Explicit OUT

```text
Product UI / domain / fixture / schema changes
VP-1 copy redesign or DemoBanner behavior change
Other smoke runners still expecting "live SharePoint 接続なし"
  (separate residual / separate Exact Slice if ever selected)
Acceptance runner / contract test mutation
Acceptance result retroactive rewrite
Acceptance re-execution without separate Human GO
AC-4 / AC-7 / AC-9 remediation
D5 / D6 / lifecycle semantics redesign
Issue #445 comment / label / close / reopen
Ready / Merge automation
Deploy / App Catalog / Production Binding
SharePoint / M365 / Entra / LIVE WRITE
```

## 7. Why this Exact Slice is minimal

```text
CONFIRMED root cause:
  one stale substring in demo-ux-6 assertReviewDueState

CONFIRMED non-root-cause:
  review-due presentation body, D5 semantics, identity chain

Scope discipline:
  one runner
  one assertion family (demo banner text)
  three failing checks that share that assertion
  no product code
```

Other runners may still carry the pre-VP-1 banner substring. They are not part
of the SP-LC-6 AC-3 / AC-5 / AC-8 classification evidence path and stay OUT
unless separately selected.

## 8. Rollback boundary

If a later Implementation Start is authorized and then rolled back, rollback is
limited to restoring the DEMO-UX-6 smoke banner assertion (and any optional
evidence docs added for that slice).

Rollback must not:

- change `VP1_DEMO_SAFETY_NOTICE` or `DemoBanner`;
- rewrite SP-LC-6 acceptance-report.json;
- touch AC-4 / AC-7 / AC-9 residuals;
- mutate Issue / Ready / Merge / Deploy / live systems.

Safe rollback state = current baseline main with the pre-slice DEMO-UX-6 smoke
assertion unchanged.

## 9. Gate

```text
Exact Slice Definition / scope fixation:
  COMPLETE / APPROVED / LOCKED

Human gate 1:
  Exact Slice Definition APPROVE = RECEIVED / LOCKED
  (PR #515 Human instruction)

Human gate 2:
  Implementation Start GO = RECEIVED / CONSUMED
  Human: SP-LC-6 STALE-SMOKE-EXPECTATION Implementation Start GO
  bound:
    this Unit
    baseline main 1846e3645ae759b2c9999bdf361f107ab59f2bcd
      (or later approved main SHA)
    changed-area = spfx/smoke/demo-ux-6/run-smoke.mjs
      (demo banner expectation only)
    acceptance criteria in §5
    OUT list in §6

Still forbidden without separate Human GO:
  acceptance re-execution
  product / domain / fixture / schema mutation
  Issue mutation
  Ready / Merge
  Deploy / Production Binding / LIVE WRITE

NEXT:
  Implement authorized smoke assertion alignment
  → verify DEMO-UX-6 smoke PASS
  → Human Ready / Merge GO for PR #515
```

```text
EXACT-SLICE-DEFINITION-1: APPROVED / LOCKED
Implementation Start: RECEIVED / CONSUMED
CURRENT ACTION: authorized smoke expectation mutation only
```
