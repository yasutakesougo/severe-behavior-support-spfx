# SP-LC-3-D5-RESIDUAL-REASSESSMENT-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: SP-LC-3-D5-RESIDUAL-REASSESSMENT-1
Kind: read-only reassessment
Date: 2026-08-19
Baseline main: db4adf8c7d83a401a9225a0a625ef34848ebac7b
Scope owner: #442
Code mutation: 0
Issue close: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
LIVE WRITE / Deploy / SharePoint / M365 / Entra: NOT AUTHORIZED
```

## 1. Scope / ownership（unchanged）

```text
#442 is treated here as a D5 residual question only.

IN:
  D5 review-window residual reassessment
  accepted anchor / notice authority comparison
  current implementation and evidence quality on main

OUT:
  90-day auto-expiry
  overdue hard judgment invention
  observation association contract
  schema / SharePoint / live calculation / deploy
```

## 2. Evidence on tip `db4adf8`

| Unit | Evidence | Status |
|---|---|---|
| D5 lock | `decision-support-plan-lifecycle-semantics-selection.md` | CONFIRMED |
| review anchor contract | `review-anchor-contract.md` | ACCEPTED / LOCKED |
| notice contract | `review-notice-contract.md` + GOV-RULE-07 acceptance | ACCEPTED / LOCKED |
| semantic basis implementation | `spfx/src/shell/review/review-due-semantics.ts` | DELIVERED |
| semantic basis rendering | `spfx/src/shell/review/ReviewDueState.tsx` | DELIVERED |
| smoke evidence for semantic basis | `spfx/smoke/demo-ux-6/run-smoke.mjs` | PASS / VERIFIED |
| unit assertions for semantic basis | `spfx/src/shell/review/review-due.test.ts` | PASS but PARTIAL / weak |

## 3. Residual delta vs prior D5 framing

| Item | Prior | Now |
|---|---|---|
| `reviewDueDate` is caller-supplied only | LOCKED | **CONFIRMED / unchanged** |
| fixed 90-day / hard overdue not allowed | LOCKED | **CONFIRMED / unchanged** |
| initial anchor = support plan effective date | accepted in contracts, not on main UI | **PARTIALLY CONSUMED** — semantic basis now rendered |
| subsequent anchor = previous review date | accepted in contracts, not on main UI | **PARTIALLY CONSUMED** — semantic basis function now distinguishes it |
| notice = target review month / not day-count | accepted in contracts, weak evidence on tests | **STILL OPEN as evidence-quality residual** |
| target-month algorithm / due engine | HOLD | **STILL OUT OF SCOPE** |

## 4. Residual candidates rejudgment

| ID | Candidate | Rejudgment |
|---|---|---|
| D5-A | semantic basis presentation exists on review screen | **CONSUMED / DELIVERED** |
| D5-B | evidence that anchor/notice semantics are asserted strongly and unambiguously | **STILL OPEN** |
| D5-C | target review month calculation engine | **OUT OF SCOPE / separate implementation entry** |
| D5-D | hard due/overdue / 90-day semantics | **FORBIDDEN / not a candidate** |
| D5-E | observation association coupling | **OUT OF SCOPE / separate owner** |

## 5. Key reassessment finding

```text
Main already contains D5 semantic basis presentation:
  - first review uses support-plan effective-from wording
  - subsequent review uses previous-review wording
  - approaching copy says calendar-month notice, not fixed day-count

However, current evidence is still weaker than it could be:
  - unit test accepts the approaching label by matching the token "30日前"
    inside a negative sentence
  - this proves copy presence, but not the intended semantic distinction
    between "calendar-month notice" and forbidden fixed day-count windows
```

## 6. Verdict

```text
#442 residual reassessment = READY

The broad D5 semantics are no longer blocked by missing authority:
  GOV-RULE-05 / review-anchor = Accepted
  GOV-RULE-07 / review-notice = Accepted
  D5 = review-support, not 90-day invalidation, remains locked

The remaining residual is narrow:
  strengthen implementation evidence so accepted anchor / notice semantics
  are asserted precisely, without drifting back toward day-count language
```

## 7. Residual next-slice candidates（NOT SELECTED in this reassessment）

| ID | Candidate | Notes |
|---|---|---|
| D5-B1 | tighten unit and smoke evidence for anchor / notice semantics | narrowest candidate; presentation/test only |
| D5-C | target review month calculation engine | broader; still outside current allowed scope |

```text
D5-A = CONSUMED
D5-D = FORBIDDEN
D5-E = OUT OF SCOPE
Agent auto-select: FORBIDDEN
Next comparison step: compare against #448 / #444 reassessments
```

## 8. Stop condition

```text
SP-LC-3-D5-RESIDUAL-REASSESSMENT-1 COMPLETE
code mutation: 0
Implementation Start: NO
Await cross-reassessment selection before any exact slice is chosen
```
