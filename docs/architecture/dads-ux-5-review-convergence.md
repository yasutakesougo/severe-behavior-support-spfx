# DADS-UX-5 — Review Convergence

```text
Issue / program: DADS
Unit: DADS-UX-5 — Review Convergence
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
Baseline main: 0cd8a5710ac5748bce96cce310e2815cefe8f517
Kind: Review presentation-only convergence
DADS-UX-6+ / Deploy / SharePoint write / #299 Close: NOT AUTHORIZED
```

## 1. Purpose

Review surface を業務意味・status vocabulary・Family A 母集団説明・navigation を変えず、DADS-03〜06 へ presentation-only 収束する。

## 2. Inventory disposition（this slice）

| INV | Class | Disposition here |
|---|---|---|
| INV-11 | ADAPT | **ADDRESSED** — ReviewDueState spacing/typography/border/focus via DADS-04；IA/語彙 KEEP |
| INV-12 | PASS | **KEEP** — 要確認 / 期限接近 text channel unchanged |
| INV-13 | ADAPT | **ADDRESSED（Review）** — StatusBadge soft（prior 4px dialect）；label = meaning |
| INV-14 | PASS | **KEEP** — save / mutation disabled boundary |
| INV-15 | PASS | **KEEP** — disabled + aria-disabled；fail-closed |
| INV-17 | GAP→FIX | **ADDRESSED（Review）** — EmptyNotice for attention zero-result only；A11Y-INV-17-RV |
| INV-19 | GAP→RESOLVED | **KEEP RESOLVED** — A11Y-HD-01 unchanged |
| INV-20 | ADAPT | **ADDRESSED（Review）** — heading/back/action focus-visible |
| INV-22 | ADAPT | **ADDRESSED（Review SCSS）** — px/theme literals → token refs where catalogued |
| INV-03 | PASS | **KEEP** — programmatic heading focus（`:focus` + `:focus-visible`） |
| Users/Records | — | **OUT**（KEEP from prior slices） |

## 3. Before / after presentation summary

### Before

```text
ReviewDueStateUx.module.scss: raw px / theme strings；no focus-visible
inline .statusBadge / .dueBadge（radius 4px）
heading lacked focus class
EmptyNotice not wired for attention empty
```

### After

```text
@use DADS-04 sbs-tokens on Review SCSS
spacing / border / surface / radius / focus → tokens（20px panel padding kept as dialect）
reviewHeading / back / actions:focus + :focus-visible
StatusBadge soft for review + due labels（INV-13）；data-demo-ux hooks retained
EmptyNotice for attention zero-result only（default fixture remains non-empty）
React: no raw DADS literals；Family A notes / status vocabulary UNCHANGED
```

## 4. Accessibility gate

| ID | Change |
|---|---|
| A11Y-HD-06 | NEW blocking — ReviewDueState single h1 + section h2 |
| A11Y-RV-01 | NEW blocking — Review SCSS tokens + focus-visible |
| A11Y-INV-13-RV | NEW blocking — StatusBadge soft + label hooks |
| A11Y-INV-17-RV | NEW blocking — EmptyNotice attention empty |
| A11Y-DIS-03 | NEW blocking — Review disabled + aria-disabled |

## 5. KEEP / OUT

KEEP:

```text
Review IA / Family A summary vs attention list meaning
status vocabulary（要確認 / 期限接近）
calculation-disabled / mutation fail-closed
navigation / data-demo-ux hooks / smoke invariants
制度にない業務ルールをアプリ側で追加しない（empty copy は zero-result のみ）
```

OUT:

```text
Users / Records rework
Domain / Contracts / SharePoint schema / permission / adapter
Deploy / #299 Close
DADS-UX-6+ / DADS-VERIFY
```

## 6. Verification (this PR)

```text
HEAD: bd492b592a08e545649d0b9193cb63fd9470b752
Baseline main: 0cd8a5710ac5748bce96cce310e2815cefe8f517
format:check: PASS
root lint / typecheck / unit: PASS (557/557)
check:contracts-boundaries / check:scope: PASS
check:a11y: PASS（30 checks；A11Y-HD-06 / A11Y-RV-01 / A11Y-INV-13-RV / A11Y-INV-17-RV / A11Y-DIS-03 added）
SPFx Heft test: PASS (127/127)
SPFx production build + package-solution: PASS
browser smoke PASS:
  DEMO-UX-6（Review）
  DEMO-UX-7 / DEMO-UX-11 / SHELL-UX-1
  DEMO-UX-10 review-family-a + overview-family-r PASS
browser smoke KNOWN stale（pre-existing；Review token 起因ではない）:
  DEMO-UX-10 users-family-r note phrase drift（expects older copy；counts PASS）
Smoke expectations: NOT weakened
```
