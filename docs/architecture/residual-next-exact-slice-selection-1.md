# RESIDUAL-NEXT-EXACT-SLICE-SELECTION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: RESIDUAL-NEXT-EXACT-SLICE-SELECTION-1
Kind: comparison + exact-slice selection（read-only）
Date: 2026-08-19
Baseline main: db4adf8c7d83a401a9225a0a625ef34848ebac7b
Inputs:
  field-staff-phase8-residual-reassessment-1.md
  planner-support-plan-residual-reassessment-1.md
  sp-lc-3-d5-residual-reassessment-1.md
Implementation Start: NOT AUTHORIZED
Issue close / Deploy / LIVE WRITE / SharePoint mutation: NOT AUTHORIZED
```

## 1. Candidate comparison

| Candidate family | Current evidence | Governing authority | Dependency / HOLD | Implementation independence | Rejudgment |
|---|---|---|---|---|---|
| `#448` FIELD_STAFF residual | correction presentation merged; runtime residuals still broad | `#448` + TRACK A framing | correction save / cancellation / ABC / scale remain open | low | NOT SELECTED |
| `#444` PLANNER residual | list, KPI, detail, section navigation all substantially delivered | `#444` Visual Decision | mostly evidence/process lag only | medium, but low remaining substance | NOT SELECTED |
| `#442` D5 residual | accepted anchor/notice docs + main UI/test/smoke basis already exist | D5 lock + GOV-RULE-05/07 Accepted | no new Decision required for evidence-tightening slice | high | SELECTED |

## 2. Selection result（1 item）

```text
Selected next exact slice:
  SP-LC-3-REVIEW-DUE-SEMANTIC-EVIDENCE-1

Selection type:
  presentation/test/evidence tightening only

Why this one:
  1. It uses already locked / accepted authority without requiring a new Decision.
  2. It has the smallest unresolved dependency surface among the 3 reassessed areas.
  3. It stays inside presentation/test/evidence boundaries and avoids schema/live-write.
  4. It fixes a real residual: current evidence is weaker than the accepted semantics.
  5. The competing #448 residual is broader and policy-adjacent; #444 residual is mostly consumed.
```

## 3. Scope（fixed for future Implementation Start request）

### Objective

`reviewDueDate` D5 semantics on the review surfaces must be evidenced precisely enough that accepted anchor / notice meaning cannot be mistaken for fixed 90-day or day-count logic.

### In scope

- strengthen unit assertions around `presentReviewDueSemanticBasis`
- tighten smoke assertions for semantic-basis copy on review surfaces
- preserve current presentation-only boundaries
- align implementation evidence with:
  - initial anchor = support plan effective-from
  - subsequent anchor = previous review date
  - notice = target review month / approximate / not fixed day-count

### Out of scope

- target review month calculation engine
- overdue / hard due implementation
- schema / SharePoint / DTO change
- observation association contract
- live review mutation
- deploy / live write / issue mutation

## 4. Likely change surface

```text
spfx/src/shell/review/review-due.test.ts
spfx/smoke/demo-ux-6/run-smoke.mjs
spfx/src/shell/review/review-due-semantics.ts（only if wording adjustment is truly required）
docs/architecture/* implementation-start or evidence doc for this exact slice（future GO）
```

## 5. Acceptance checks（future Implementation Start GO bind targets）

- unit test asserts:
  - first-review anchor mentions support-plan effective-from
  - subsequent-review anchor mentions previous review date
  - approaching semantics assert calendar-month notice
  - approaching semantics do not rely on positive day-count-window meaning
- smoke asserts semantic-basis block remains visible and aligned with accepted copy
- no 90-day / hard overdue / invalidation semantics are introduced
- no schema / live write / SharePoint / deploy paths are touched

## 6. Why the other two are not selected now

### `#448`

```text
Still valid as a residual family, but the remaining work is broader:
  correction persistence
  cancellation policy
  ABC adjacency
  scale/runtime evidence

These are less exact and more dependency-heavy than the selected D5 evidence slice.
```

### `#444`

```text
Most named residuals have already been consumed on main:
  KPI strip
  action queue
  support-plan detail
  section navigation

Remaining gaps are mainly evidence/process deepening, not the strongest next substantive slice.
```

## 7. HOLD / boundary

```text
This selection ≠ Implementation Start
This selection ≠ Human GO
This selection ≠ branch / commit / push / PR authorization

Next required Human step:
  Exact-slice Implementation Start GO
  bound to:
    SP-LC-3-REVIEW-DUE-SEMANTIC-EVIDENCE-1
    base SHA
    allowed paths
    acceptance checks
```

## 8. Final stop

```text
Residual comparison: COMPLETE
Exact slice selection: COMPLETE
Implementation Start: HOLD / separate Human GO required
CURRENT ACTION: STOP
```
