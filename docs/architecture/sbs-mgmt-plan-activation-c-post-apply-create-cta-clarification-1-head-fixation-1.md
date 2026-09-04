# POST-APPLY-CREATE-CTA-CLARIFICATION-1 — Exact Implementation HEAD Fixation 1

```text
unit: SBS-MGMT-PLAN-ACTIVATION-C-POST-APPLY-CREATE-CTA-CLARIFICATION-1
kind: exact implementation HEAD fixation
date: 2026-09-04
Human Ready GO = HOLD
```

## Dual HEAD binding

| Role | SHA / meaning |
|---|---|
| Frozen parent (CTA-ROLE Staff Re-Check PASS / #594) | `0ba2c63415c85dcb7a3cefd8566202e7f4cd67cf` |
| SupportPlan + B12 mutation | `21f78aececa4e8bfef4e0fe6f45c00153399cfe6` |
| Exact-head CI / Implementation HEAD | **branch tip of `cursor/post-apply-create-cta-impl-bac2` (PR #596)** |

```text
Do not move #594 tip 0ba2c63….
Ready is not eligible until exact-head CI GREEN and Actual Staff Re-Check PASS.
```

## Scope applied

```text
MODIFY
- spfx/src/shell/users/SupportPlan.tsx
  create-cta gate: !adminRead && !revisionDraft && !activationReceipt
- spfx/smoke/sbs-mgmt-loop-b/run-smoke.mjs
  afterApply: createCtaAbsentAfterApply + createCtaCopyGoneAfterApply
```

## Evidence

```text
typecheck PASS
check:a11y PASS
npm test 954/954 PASS
heft test 427/427 PASS
B12 6/6 PASS
  afterApply create-cta ABSENT
  SIMPLIFICATION-2 RETAIN
  cold createCtaDisabled RETAIN
  beforeApply draft create-cta ABSENT RETAIN
```

## Explicit non-authorization

```text
HEAD fixation
≠ exact-head CI GREEN
≠ Actual Staff Re-Check PASS
≠ Human Ready GO
≠ Merge / Deploy / LIVE WRITE
```

## NEXT

```text
exact-head CI GREEN on PR #596 tip
↓
Actual Staff Re-Check (post-Apply: no「次の版を作る」)
↓
Human Ready GO / HOLD
```
