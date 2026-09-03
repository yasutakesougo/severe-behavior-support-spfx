# SBS-MGMT-PLAN-ACTIVATION-C-STAFF-ARRIVAL-1 — PHASE 4 wait lock

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-PLAN-ACTIVATION-C-STAFF-ARRIVAL-1
kind: Human-confirmed PHASE 4 wait lock
date: 2026-09-03
Human confirmation: CURRENT board accepted; Correction-1 boundary accepted
Human Verification Correction Start GO = NOT RECEIVED
path correction = NOT STARTED
```

## CURRENT (Human-confirmed)

```text
#584 product HEAD
= 5437e64703db055eef2bf230f5a682cf0286dc1a
= FROZEN / NO CHANGE

Staff Arrival Scope
= DEFINED
= CORRECTION-1 APPLIED
= Ponytail PASS
= Independent Scope Review PASS / SCOPE-CLEARED

Human Verification Correction Start GO
= NOT RECEIVED

verification harness HEAD
= NOT CREATED

path correction
= NOT STARTED

Actual Staff Check
= HOLD

Human Ready GO
= NOT ELIGIBLE
```

## Dual HEAD (unchanged)

```text
PRODUCT UNDER TEST
= #584 @ 5437e64
= do not change

VERIFICATION HARNESS
= separate HEAD
= smoke-entry / serve-smoke only
= drive public #584 DOM as a human-equivalent sequence
= reach Draft v4 + Apply CTA
```

Harness work does not re-open #584 product Implementation Review.

## Sole current gate

```text
Human Verification Correction Start GO
or
Human Verification Correction Start HOLD
```

After GO only:

```text
verification-only path correction
↓
Focused Verification
↓
exact verification HEAD fixation
↓
default cold path regression
↓
beforeApply staff-arrival confirmation
↓
Actual Staff Plan-Transition Re-Test
```

## Forbidden now

```text
path correction
SupportPlan.tsx / session contract / activation domain edit
#584 product HEAD movement
Staff Check resume
Ready / Merge / Deploy / LIVE WRITE
```

## GATE

```text
PHASE 4 = WAIT / Human GO or HOLD
#584 Post-GREEN Revalidation = VALID
Implementation Review-Cleared = YES
Actual Staff Check = HOLD
Human Ready GO = NOT ELIGIBLE
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
Agent NEXT = STOP
```
