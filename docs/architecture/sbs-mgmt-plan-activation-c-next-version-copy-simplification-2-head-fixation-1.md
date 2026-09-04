# NEXT-VERSION-COPY-SIMPLIFICATION-2 — Exact Implementation HEAD Fixation 1

```text
unit: SBS-MGMT-PLAN-ACTIVATION-C-NEXT-VERSION-COPY-SIMPLIFICATION-2
kind: exact implementation HEAD fixation
date: 2026-09-04
Human Ready GO = HOLD
```

## Dual HEAD binding

SupportPlan が変わったので、Proposal A の CI SHA は本実装の exact-head に使えない。

| Role | SHA / meaning |
|---|---|
| Historical reviewed product `#584` | `5437e64703db055eef2bf230f5a682cf0286dc1a` FROZEN |
| Proposal A product | `fed08fd49d12fccf323991fb95a4f5e58d6f9e55` |
| PR #589 tip / Proposal A CI | `f85ee757a9795b62ad5da475dc0aebc78e3ad6d3` **NOT this unit** |
| SIMPLIFICATION-2 SupportPlan mutation | `1cde2182ff1adbbd8414a0c6fca398169d29c7b8` |
| Copy-lock + implementation reviews | `aad5cbfd17d5bf7bc89e7c1f6af5f3d1f288a837` |
| Exact-head CI authority | **this bind commit (PR #593 tip after this file lands)** |

```text
#589 @ f85ee757 remains Proposal A historical CI only.
It is not the product under test and not CI authority for SIMPLIFICATION-2.
Do not add commits after this bind without re-fixation.
Ready is not eligible until exact-head CI is GREEN on the bound tip.
```

## Evidence at product HEAD (`1cde218`)

```text
npm test 954/954 PASS
typecheck PASS
heft test 427/427 PASS
B12 6/6 PASS
Human rendered visual check PASS
Ponytail implementation review PASS
Independent implementation review PASS (candidate)
Boundary copy lock: RETAIN 「本番には保存されていません」
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
exact-head CI GREEN on this bind / PR #593 tip
↓
Actual Staff Re-Check
↓
Human Ready GO / HOLD
```
