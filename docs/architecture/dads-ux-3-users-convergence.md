# DADS-UX-3 — Users Convergence

```text
Issue / program: DADS
Unit: DADS-UX-3 — Users Convergence
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
Baseline main: 5775c55be0a9d9d9f76b30be236fdcb4fd9cb105
Kind: Users presentation-only convergence
DADS-UX-4+ / Deploy / SharePoint write / #299 Close: NOT AUTHORIZED
```

## 1. Purpose

Users surface を業務意味・status vocabulary・navigation を変えず、DADS-03〜06 へ presentation-only 収束する。

## 2. Inventory disposition（this slice）

| INV | Class | Disposition here |
|---|---|---|
| INV-05 | ADAPT | **ADDRESSED** — Users list spacing/typography/border/focus via DADS-04；IA/filter 意味 KEEP |
| INV-06 | ADAPT | **ADDRESSED** — User detail surfaces tokenized；section IA KEEP |
| INV-07 | GAP→FIX | **ADDRESSED / KEEP semantics** — SectionLabelStrip retained；no tablist/tab reintroduction；plan action separate；A11Y-INV-07 blocking |
| INV-12 | PASS | **KEEP** — 要確認/未記録/期限接近 text channel unchanged |
| INV-13 | ADAPT | **KEEP adoption** — StatusBadge already on Users list（DADS-05）；shape square retained |
| INV-15 | PASS | **KEEP** — disabled + aria-disabled；fail-closed |
| INV-17 | GAP→FIX | **ADDRESSED** — EmptyNotice for filter zero-result only；announce status；copy does not imply facility-empty；A11Y-INV-17 blocking |
| INV-19 | GAP→RESOLVED | **KEEP RESOLVED** — no host heading pollution；A11Y-HD-01 unchanged |
| INV-20 | ADAPT | **ADDRESSED（Users）** — Users/Detail interactive + heading focus-visible |
| INV-22 | ADAPT | **ADDRESSED（Users SCSS）** — rem/theme/hex literals → token refs |
| INV-03 | PASS | **KEEP** — programmatic heading focus outline（`:focus` + `:focus-visible`） |
| Records/Review | — | **OUT** |

## 3. Before / after presentation summary

### Before

```text
UsersUx.module.scss: raw rem / theme strings / hardcoded #fff / warning hex / :focus only
UserDetailUx.module.scss: raw rem / theme / warning hex；sectionTabs duplicate of primitive
dead local .statusBadge / .sectionTab* after DADS-05 adoption
detailButton lacked focus outline
EmptyNotice adopted but announce not explicit
```

### After

```text
@use DADS-04 sbs-tokens on Users + UserDetail SCSS
spacing / typography / border / surface / focus / warning → tokens
dashed synthetic panel kept（既存方言；DADS差のみでの削除はしない）
heading:focus + :focus-visible（INV-03 KEEP）
filter/detail/back:focus + :focus-visible
StatusBadge / EmptyNotice / SectionLabelStrip retained（DADS-05）
sectionTabs host duplicate removed — primitive owns strip chrome
React: no raw DADS literals；fixture labels / filter chips / empty copy UNCHANGED
```

## 4. Accessibility gate

| ID | Change |
|---|---|
| A11Y-HD-03 | NEW blocking — UsersList single h1 |
| A11Y-HD-04 | NEW blocking — UserDetail single h1 + section h2 |
| A11Y-US-01 | NEW blocking — Users SCSS tokens + focus-visible + no raw hex outside theme strings |
| A11Y-UD-01 | NEW blocking — UserDetail SCSS tokens + focus-visible + no raw hex outside theme strings |
| A11Y-INV-07 | NEW blocking — SectionLabelStrip + no tab roles + separate plan action |
| A11Y-INV-17 | NEW blocking — EmptyNotice announce on filter empty |

## 5. KEEP / OUT

KEEP:

```text
Users IA / navigation / destination semantics
status vocabulary（要確認 / 未記録 / 期限接近）
synthetic fixture meaning
fail-closed / disabled / save 5-state
INV-19 resolved host chrome
smoke invariants / data-demo-ux hooks
```

OUT:

```text
Records / Review migration
Domain / Contracts / SharePoint / Deploy / #299 Close
DADS-UX-4+
SupportPlan nested restyle（optional later；not required for Users entry）
```

## 6. Verification (this PR)

```text
format:check: (recorded after run)
root lint / typecheck / unit: (recorded after run)
check:a11y: (recorded after run；new Users gates)
SPFx Heft test: (recorded after run)
SPFx production build: (recorded after run)
browser smoke: (recorded after run)
Smoke expectations: NOT weakened
```
