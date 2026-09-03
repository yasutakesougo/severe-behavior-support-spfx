# NEXT-VERSION-COPY-SIMPLIFICATION-1 — Exact UI-Correction HEAD Fixation 1

```text
unit: SBS-MGMT-PLAN-ACTIVATION-C-NEXT-VERSION-COPY-SIMPLIFICATION-1
kind: exact implementation HEAD fixation
date: 2026-09-03
```

## Dual HEAD binding

| Role | SHA / meaning |
|---|---|
| Historical reviewed product | `#584 @ 5437e64703db055eef2bf230f5a682cf0286dc1a` FROZEN / REVIEW-CLEARED |
| Proposal A product candidate | `fed08fd49d12fccf323991fb95a4f5e58d6f9e55` |
| Staff Check PRODUCT UNDER TEST | `fed08fd49d12fccf323991fb95a4f5e58d6f9e55`（not 5437e64） |

```text
#584 @ 5437e64 remains the historical reviewed basis.
It is not the product under test for the next Actual Staff Check.
```

## Evidence at candidate (pre-fixation local)

```text
npm test 954/954 PASS
typecheck PASS
verify:ci PASS
verify-staff-arrival PASS
B12 RBA 6/6 PASS（1280 + 390; Apply 後 v4 active / v3 history; cold Apply absent）
Ponytail PASS
Independent Implementation Review PASS（candidate）
```

## Explicit non-authorization

```text
HEAD fixation
≠ Human arrival gate 5/5
≠ Actual Staff Plan-Transition Re-Test PASS
≠ Human Ready GO
≠ Merge / Deploy / LIVE WRITE
≠ #584 historical review withdrawn
```

## NEXT

```text
Exact-head CI GREEN on Proposal A candidate
↓
Human arrival gate 5/5 on Proposal A HEAD
↓
Actual Staff Plan-Transition Re-Test
↓
Human Ready GO / HOLD
```
