# DADS-UX-6 — Support Plan Convergence

```text
Issue / program: DADS
Unit: DADS-UX-6 — Support Plan Convergence
Status: Implementation Start（this PR）
Authority:
  docs/architecture/decision-dads-adoption-v1.md
  docs/architecture/dads-existing-ui-inventory.md
  docs/architecture/dads-application-style-guide-v1.md
  docs/architecture/dads-04-design-tokens.md
  docs/architecture/dads-05-shared-ui-primitives.md
  docs/architecture/dads-06-accessibility-gate.md
  docs/architecture/dads-ux-1-shell-host-convergence.md
  docs/architecture/dads-ux-2-overview-convergence.md
  docs/architecture/dads-ux-3-users-convergence.md
  docs/architecture/dads-ux-4-records-convergence.md
  docs/architecture/dads-ux-5-review-convergence.md
Baseline main: ca372f8bd9e9dc51344ee97982630fa57ed3e975
Kind: SupportPlan presentation-only convergence
DADS-UX-7+ / DADS-VERIFY / Deploy / SharePoint write / #299 Close: NOT AUTHORIZED
```

## 1. Purpose

SupportPlan nested surface を業務意味・status vocabulary・mutation fail-closed・UserDetail 戻り navigation を変えず、DADS-03〜06 へ presentation-only 収束する（INV-08）。

## 2. Inventory disposition（this slice）

| INV | Class | Disposition here |
|---|---|---|
| INV-08 | ADAPT | **ADDRESSED** — SupportPlan spacing/border/surface/focus via DADS-04；IA KEEP |
| INV-12 | PASS | **KEEP** — 要確認 text channel in reviewStatus |
| INV-14 / 15 | PASS | **KEEP** — mutation disabled + aria-disabled；fail-closed |
| INV-19 | RESOLVED | **KEEP RESOLVED** — A11Y-HD-01 unchanged |
| INV-20 | ADAPT | **ADDRESSED（SupportPlan）** — heading/back/mutation focus-visible |
| INV-22 | ADAPT | **ADDRESSED（SupportPlan SCSS）** — rem/theme/hex → token refs |
| INV-03 | PASS | **KEEP** — programmatic heading focus（`:focus` + `:focus-visible`） |
| Users list/detail / Records / Review | — | **OUT**（KEEP from prior slices） |

## 3. Before / after presentation summary

### Before

```text
SupportPlanUx.module.scss: raw rem / theme strings / warning hex
planHeading:focus only；mutationButton no focus outline
no SupportPlan-specific a11y blocking gates
```

### After

```text
@use DADS-04 sbs-tokens
spacing / border / surface / focus / warning → tokens
planHeading:focus + :focus-visible（INV-03 KEEP）
back/mutation:focus + :focus-visible
dashed synthetic panel kept
React fixture labels / mutation notes UNCHANGED
```

## 4. Accessibility gate

| ID | Change |
|---|---|
| A11Y-HD-07 | NEW blocking — SupportPlan single h1 + section h2 |
| A11Y-SP-01 | NEW blocking — SupportPlan SCSS tokens + heading/mutation focus-visible |
| A11Y-DIS-04 | NEW blocking — SupportPlan disabled + aria-disabled |

## 5. KEEP / OUT

KEEP:

```text
SupportPlan IA / goals / actions / review content meaning
status vocabulary（要確認）
mutation disabled / fail-closed
back → UserDetail navigation
data-demo-ux hooks / DEMO-UX-4 / 11 smoke expectations
```

OUT:

```text
DADS-UX-7+ / DADS-VERIFY
Domain / Contracts / SharePoint / Deploy / #299 Close
Users list/detail / Records / Review rework
```

## 6. Verification (this PR)

```text
format:check: (recorded after run)
root lint / typecheck / unit: (recorded after run)
check:a11y: (recorded after run；new SupportPlan gates)
SPFx Heft test: (recorded after run)
SPFx production build: (recorded after run)
browser smoke: (recorded after run)
Smoke expectations: NOT weakened
```
