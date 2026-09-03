# SBS-MGMT-PLAN-ACTIVATION-C-STAFF-ARRIVAL-1 — Independent Scope Review-1

```text
review targets:
  PHASE 0 Freeze
    = docs/architecture/sbs-mgmt-plan-activation-c-584-product-head-freeze-1.md
  Scope Definition 1 + Correction-1
    = docs/architecture/sbs-mgmt-plan-activation-c-staff-arrival-1-scope-definition-1.md
  Ponytail / Minimality
    = docs/architecture/sbs-mgmt-plan-activation-c-staff-arrival-1-ponytail-1.md
product HEAD under test
  = 5437e64703db055eef2bf230f5a682cf0286dc1a
verdict = PASS / SCOPE-CLEARED
P0 = 0
P1 = 0
P2 = 0
Human Verification Correction Start GO eligibility = YES
Human Verification Correction Start GO = NOT RECEIVED
product/code mutation = NONE
```

## Correction closure

```text
IN/OUT contradiction
  (initializer → SupportPlan props vs SupportPlan.tsx OUT)
= CLOSED by Correction-1
  smoke-entry drives public #584 DOM until Apply mounts

#584 product HEAD freeze
= HELD @ 5437e64
= Review-Cleared not rebound
```

## Review matrix

```text
R1 Dual HEAD (product vs harness) is explicit = PASS
R2 SupportPlan.tsx / activation domain / session contract OUT = PASS
R3 Apply CTA design / schema / repository / SharePoint / LIVE WRITE OUT = PASS
R4 Arrival uses only already-public #584 actions = PASS
R5 serve-smoke rebuild bound to verification HEAD = PASS
R6 cold/default URL must stay empty session = PASS
R7 Focused Verification includes product source unchanged = PASS
R8 #586 SupportPlan prop path rejected = PASS
R9 Start GO is a separate Human gate = PASS
R10 Minimality rejects fake staff UI and generic frameworks = PASS
```

## Authorized implementation boundary (repeat)

```text
MODIFY  spfx/smoke/support-plan-review-new-version-demo-1/smoke-entry.tsx
MODIFY or NEW  spfx/smoke/sbs-mgmt-loop-b/serve-smoke.mjs
               (harness HEAD only)
OPTIONAL/MINIMAL  run-smoke.mjs / README / smoke-only helper
NEW     staff-arrival docs / procedure
```

Any `src/shell/users/SupportPlan.tsx` or `src/domain/support-plan-activation*` edit = STOP.

## Gate

```text
PHASE 0 Product HEAD Freeze = APPLIED
PHASE 1 Scope + Correction-1 = APPLIED / REVIEW-CLEARED
PHASE 2 Ponytail = PASS
PHASE 3 Independent Scope Review-1 = PASS / SCOPE-CLEARED
Human Verification Correction Start GO eligibility = YES
Human Verification Correction Start GO = NOT RECEIVED
PHASE 5 path correction = HOLD
Actual Staff Re-Test = NOT STARTED
#584 Human Ready GO = NOT ELIGIBLE
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
```

NEXT:

```text
Human Verification Correction Start GO / HOLD
```

This review does not authorize path correction, Staff Check resume, Ready, Merge, Deploy, or LIVE WRITE.
