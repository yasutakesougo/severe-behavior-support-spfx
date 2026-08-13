# DADS-UX-4 — Records Convergence

```text
Issue / program: DADS
Unit: DADS-UX-4 — Records Convergence
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
Baseline main: 270400b964ff89543296be56265b8963ce0f5c64
Kind: Records presentation-only convergence
DADS-UX-5+ / Deploy / SharePoint write / #299 Close: NOT AUTHORIZED
```

## 1. Purpose

Records surface を業務意味・recordStatus / save 5-state / navigation を変えず、DADS-03〜06 へ presentation-only 収束する。

## 2. Inventory disposition（this slice）

| INV | Class | Disposition here |
|---|---|---|
| INV-09 | ADAPT | **ADDRESSED** — DailyRecords spacing/typography/border/focus via DADS-04；IA KEEP |
| INV-10 | GAP→FIX | **ADDRESSED / KEEP semantics** — SingleSelectListbox retained；no button+option hybrid；A11Y-INV-10 blocking |
| INV-12 | PASS | **KEEP** — 未記録 / 要確認 text channel on incomplete badges |
| INV-13 | ADAPT | **KEEP adoption** — StatusBadge pill already on incomplete items（DADS-05） |
| INV-14 | PASS | **KEEP** — save 5-state / mutation disabled boundary |
| INV-15 | PASS | **KEEP** — disabled + aria-disabled；fail-closed |
| INV-17 | GAP→FIX | **ADDRESSED（Records）** — EmptyNotice for incomplete/recent zero-result only；not failure/all-clear；A11Y-INV-17-RC |
| INV-18 | ADAPT | **KEEP** — native label+control；draft textarea meaning unchanged |
| INV-19 | GAP→RESOLVED | **KEEP RESOLVED** — A11Y-HD-01 unchanged |
| INV-20 | ADAPT | **ADDRESSED（Records）** — Records heading/input/action + listbox option focus-visible |
| INV-22 | ADAPT | **ADDRESSED（Records SCSS）** — px/theme literals → token refs where catalogued |
| INV-03 | PASS | **KEEP** — programmatic heading focus（`:focus` + `:focus-visible`） |
| Users/Review | — | **OUT**（Users KEEP from DADS-UX-3；Review = DADS-UX-5+） |

## 3. Before / after presentation summary

### Before

```text
DailyRecordsUx.module.scss: raw px / theme strings / :focus only on dead .card
dead local .card / .statusBadge after DADS-05 SingleSelectListbox + StatusBadge
heading lacked focus class
EmptyNotice not wired for Records empty paths
```

### After

```text
@use DADS-04 sbs-tokens on DailyRecords SCSS
spacing / border / surface / radius / focus → tokens（20px panel padding kept as dialect）
recordsHeading:focus + :focus-visible
input/textarea/action focus-visible
SingleSelectListbox / StatusBadge retained；primitive option :focus-visible
EmptyNotice for incomplete/recent zero-result only（default fixture remains non-empty）
React: no raw DADS literals；fixture labels / draft / mutation notes UNCHANGED
```

## 4. Accessibility gate

| ID | Change |
|---|---|
| A11Y-HD-05 | NEW blocking — DailyRecords single h1 + section h2 |
| A11Y-RC-01 | NEW blocking — Records SCSS tokens + focus-visible |
| A11Y-INV-10 | NEW blocking — SingleSelectListbox + no button+option hybrid |
| A11Y-INV-17-RC | NEW blocking — EmptyNotice incomplete/recent empty hooks |
| A11Y-DIS-02 | NEW blocking — DailyRecords disabled + aria-disabled |

## 5. KEEP / OUT

KEEP:

```text
Records IA / incomplete→draft selection meaning
status vocabulary（未記録 / 要確認）
save 5-state / mutation fail-closed
navigation / data-demo-ux hooks / smoke invariants
INV-19 resolved host chrome
制度にない業務ルールをアプリ側で追加しない（empty copy は zero-result のみ）
```

OUT:

```text
Users / Review migration
Domain / Contracts / SharePoint schema / permission / adapter
Deploy / #299 Close
DADS-UX-5+
```

## 6. Verification (this PR)

```text
HEAD: ce4be464288a10418fd34cc1a6e2ac51937c32a1
Baseline main: 270400b964ff89543296be56265b8963ce0f5c64
format:check: PASS
root lint / typecheck / unit: PASS (557/557)
check:contracts-boundaries / check:scope: PASS
check:a11y: PASS（25 checks；A11Y-HD-05 / A11Y-RC-01 / A11Y-INV-10 / A11Y-INV-17-RC / A11Y-DIS-02 added）
SPFx Heft test: PASS (125/125)
SPFx production build + package-solution: PASS
browser smoke PASS:
  DEMO-UX-5 / DEMO-UX-9（Records）
  DEMO-UX-7 / DEMO-UX-8 / DEMO-UX-11 / SHELL-UX-1
Smoke expectations: NOT weakened
```
