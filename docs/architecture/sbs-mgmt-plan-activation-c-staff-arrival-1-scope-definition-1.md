# SBS-MGMT-PLAN-ACTIVATION-C-STAFF-ARRIVAL-1 — Verification Scope Definition 1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-PLAN-ACTIVATION-C-STAFF-ARRIVAL-1
kind: verification-only scope definition
parent: SBS-MGMT-PLAN-ACTIVATION-C / #583
product PR: #584 @ 5437e64703db055eef2bf230f5a682cf0286dc1a (FROZEN)
basis: docs/architecture/sbs-mgmt-plan-activation-c-584-product-head-freeze-1.md
path-compare: docs/architecture/sbs-mgmt-plan-activation-c-beforeapply-path-compare-1.md
date: 2026-09-03
Implementation / Verification Correction Start = NOT AUTHORIZED
Human Verification Correction Start GO = NOT RECEIVED
```

## 1. Purpose

Give Actual Staff Plan-Transition Check a **manual arrival** that mounts the frozen #584 Apply CTA (v3 applied + v4 Draft) without changing #584 product source.

```text
This Scope
!= #584 product re-implementation
!= Implementation Review re-open of 5437e64
!= Human Ready GO
!= Staff Check resume until Focused Verification PASS
```

## 2. Problem this scope owns

```text
staffPlanTransition=beforeApply
= may appear in the address bar
= does not imply initializer / Draft v4 / Apply mounted

Observed manual ⑥
= conceptual v3/v4 + disabled 「次の版を作る（表示専用）」
= Apply NOT MOUNTED
= ENVIRONMENT-PATH MISMATCH
```

#584 Apply implementation remains Review-Cleared. This scope owns the **verification harness path only**.

## 3. Dual HEAD (mandatory)

```text
PRODUCT UNDER TEST
= PR #584
= 5437e64703db055eef2bf230f5a682cf0286dc1a

VERIFICATION HARNESS
= separate exact verification HEAD
= this unit only
```

Staff Check evidence must record both SHAs. Harness HEAD movement does not move product HEAD.

## 4. Human-stated IN (parent intent)

```text
smoke-entry.tsx staffPlanTransition=beforeApply branch
connection toward createBeforeApplyStaffTransitionArrival()
serve-smoke uses the rebuilt bundle from the verification HEAD
manual confirmation procedure as authority doc
```

## 5. Human-stated OUT (binding)

```text
SupportPlan.tsx
activation domain
session contract
Apply CTA design
SupportPlan schema
repository
SharePoint
LIVE WRITE
```

Also OUT:

```text
#584 product HEAD mutation
App Catalog / Deploy
Ready / Merge of #584 by this unit
re-review of 5437e64 product as if it changed
```

## 6. Compile / runtime gap (must close before Start GO)

Stated IN + OUT as written cannot both be literal.

```text
createBeforeApplyStaffTransitionArrival()
  + pass session into SupportPlan
= requires SupportPlan.tsx props / session contract
= OUT

Frozen SupportPlan @ 5437e64
= empty revision session on first paint
= Apply mounts only after in-component start-revision
```

This is the same class of blocker as the earlier SPFx bridge preflight: do not silently broaden into `SupportPlan.tsx`.

## 7. Scope Correction-1 (closes §6)

Supersedes only the *mechanism* in §4. Parent intent (manual before-Apply on frozen product) remains.

Authorized verification mechanism:

```text
smoke-entry (verification HEAD) renders the same #584 SupportPlan surface
  via existing Chrome / PLANNER path (no SupportPlan.tsx edit)

when staffPlanTransition === "beforeApply":
  after SupportPlan is in the DOM, the harness drives the
  already-public #584 actions only:

    [data-review-outcome-reason-input]
    [data-review-outcome-action="CHANGE_REQUIRED"]
    [data-sbs-mgmt-loop-b-action="start-revision"]

  until

    [data-sbs-mgmt-loop-b-draft="true"]
    [data-sbs-mgmt-plan-activation-c-action="apply"]

  are present

serve-smoke / equivalent always esbuilds smoke-entry from THIS
verification HEAD (no stale #584-only bundle)

manual procedure doc binds both SHAs and the arrival marker
```

`createBeforeApplyStaffTransitionArrival()` is **not** authorized if it lives in `src/shell/users` and requires SupportPlan props.

If a helper is needed, it is smoke-only (under `spfx/smoke/**`) and must not change session contract files.

Forbidden workarounds:

```text
SupportPlan.tsx initialRevisionSession / URL read
duplicating Apply UI in a fake staff screen
editing activation domain / session modules
rebasing #584 product HEAD
```

## 8. Exact authorized surfaces (after Correction-1)

```text
MODIFY  spfx/smoke/support-plan-review-new-version-demo-1/smoke-entry.tsx
MODIFY  spfx/smoke/sbs-mgmt-loop-b/serve-smoke.mjs
        (or NEW serve-staff-arrival.mjs if serve-smoke is not on 5437e64)
OPTIONAL/MINIMAL
        spfx/smoke/sbs-mgmt-loop-b/run-smoke.mjs
        (arrival recognition only; do not expand product assertions)
        spfx/smoke/sbs-mgmt-loop-b/README.md
        spfx/smoke/** helper used only by smoke-entry
NEW     docs/architecture/sbs-mgmt-plan-activation-c-staff-arrival-1-*
```

`serve-smoke.mjs` exists on `f2f48587`, not on frozen product `5437e64`. Adding or restoring it on the **verification HEAD** is harness work, not a #584 product change.

## 9. Focused Verification (PHASE 6)

Must prove:

```text
beforeApply query recognized
initializer / DOM driver executed
Draft v4 present
Apply CTA mounted
cold / default URL remains empty session
#584 product source unchanged
  (SupportPlan.tsx / activation domain / session contract
   byte-identical to 5437e64703db055eef2bf230f5a682cf0286dc1a)
```

Prefer: SPFx production artifact product surface matches #584 @ `5437e64`.

## 10. Stop conditions

STOP for another Scope Correction if any of:

```text
need to edit SupportPlan.tsx
need to edit src/domain/support-plan-activation.ts
need to edit support-plan-activation-session.ts
need CTA / copy redesign
need SharePoint / LIVE WRITE
need to move #584 product HEAD
```

## 11. Gate

```text
PHASE 0 Product HEAD Freeze = APPLIED
PHASE 1 Scope Definition + Correction-1 = APPLIED
Human Verification Correction Start GO = NOT RECEIVED
verification-only path correction = NOT STARTED
Actual Staff Re-Test = NOT STARTED
#584 Human Ready GO = NOT ELIGIBLE
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
```

NEXT:

```text
Ponytail / Minimality Scope Check
→ Independent Scope Review
→ Human Verification Correction Start GO / HOLD
```
