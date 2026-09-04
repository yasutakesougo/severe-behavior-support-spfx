# CTA-ROLE-CLARIFICATION-1 — Exact Implementation HEAD Fixation 1

```text
unit: SBS-MGMT-PLAN-ACTIVATION-C-CTA-ROLE-CLARIFICATION-1
kind: exact implementation HEAD fixation
date: 2026-09-04
Human Ready GO = HOLD
```

## Dual HEAD binding

| Role | SHA / meaning |
|---|---|
| Prior PRODUCT UNDER TEST (Staff Re-Check bind) | `11c8769b0769a842b5389379323c7ce821dcb6bd` |
| CTA-ROLE SupportPlan + B12 mutation tip | `9dacbeb15cae6f64b9692d9e00ab2ee2b849fcab` |
| Exact-head CI / Implementation HEAD | `9dacbeb15cae6f64b9692d9e00ab2ee2b849fcab` |

```text
Parent product basis = 11c8769b0769a842b5389379323c7ce821dcb6bd
Do not silently rebase onto origin/main.
Ready is not eligible until exact-head CI is GREEN and Actual Staff Re-Check PASSes.
```

## Scope applied

```text
MODIFY
- spfx/src/shell/users/SupportPlan.tsx
- spfx/smoke/sbs-mgmt-loop-b/run-smoke.mjs

a11y heading id
= IN SCOPE (minimal corrective)
  reason: hiding cold h2#review-new-version-next-heading while revisionDraft
  would break aria-labelledby for non-planner; PLANNER uses process heading;
  draft status receives id only when !plannerProcess
```

## Evidence at implementation HEAD

```text
typecheck PASS
check:a11y PASS (35 checks; blocking failures=0)
npm test 954/954 PASS
heft test 427/427 PASS (after prepare:b2-build-basis)
B12 6/6 PASS
  beforeApply PRESENT: 適用中: 版 3 / 下書き: 版 4 / 版 4 を適用開始する
  beforeApply ABSENT: 次の版の考え方 / 次に重ねる概念上の版は 4 / 次の版を作る（表示専用）
  afterApply SIMPLIFICATION-2 retained
  cold / no-change / historical blocked retained
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
exact-head CI GREEN on this bind / PR tip
↓
Ponytail / Minimality Implementation Review
↓
Independent Implementation Review
↓
Actual Staff Re-Check
↓
Human Ready GO / HOLD
```
