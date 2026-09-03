# SBS-MGMT-PLAN-ACTIVATION-C-STAFF-ARRIVAL-1 — Ponytail / Minimality Scope Check

```text
unit: SBS-MGMT-PLAN-ACTIVATION-C-STAFF-ARRIVAL-1
scope sources:
  Scope Definition 1 + Correction-1
    = docs/architecture/sbs-mgmt-plan-activation-c-staff-arrival-1-scope-definition-1.md
  Product HEAD Freeze
    = docs/architecture/sbs-mgmt-plan-activation-c-584-product-head-freeze-1.md
verdict: PASS / STILL MINIMAL
P0 = 0
P1 = 0
P2 = 0
product/code mutation by this check: NONE
```

## Kept

```text
#584 product HEAD frozen @ 5437e64
verification HEAD separate
smoke-entry beforeApply branch only
public #584 DOM actions as the arrival driver
serve-smoke rebuild from verification HEAD
manual procedure + dual SHA
no SupportPlan.tsx
no activation domain / session contract
no Apply CTA redesign
```

## Rejected

```text
PR #586 SupportPlan initialRevisionSession props
createBeforeApplyStaffTransitionArrival() in src/shell/users
fake staff Apply screen
rebasing or amending #584 product commits
new repository / schema / LIVE WRITE
```

## Ponytail

```text
no architecture extraction
no generic “fixture arrival framework”
one query → one driver → existing Apply mount
no speculative multi-snapshot switcher
```

`run-smoke.mjs` landing case is last-resort proof only. Do not turn B12 into a second product suite.

## Gate

```text
Ponytail / Minimality Scope Check = PASS
NEXT = Independent Scope Review
Human Verification Correction Start GO = NOT RECEIVED
```
