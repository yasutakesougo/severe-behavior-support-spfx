# DADS-UX-2 — Overview Convergence

```text
Issue / program: DADS
Unit: DADS-UX-2 — Overview Convergence
Status: Implementation Start（this PR）
Authority:
  docs/architecture/decision-dads-adoption-v1.md
  docs/architecture/dads-existing-ui-inventory.md
  docs/architecture/dads-application-style-guide-v1.md
  docs/architecture/dads-04-design-tokens.md
  docs/architecture/dads-05-shared-ui-primitives.md
  docs/architecture/dads-06-accessibility-gate.md
  docs/architecture/dads-ux-1-shell-host-convergence.md
Baseline main: 166fa07c04036280441cb68f864d3cce077363e3
Kind: Overview presentation-only convergence
DADS-UX-3+ / Deploy / SharePoint write / #299 Close: NOT AUTHORIZED
```

## 1. Purpose

Overview surface を業務意味・status vocabulary・IA を変えず、DADS-03〜06 へ presentation-only 収束する。

## 2. Inventory disposition（this slice）

| INV | Class | Disposition here |
|---|---|---|
| INV-04 | ADAPT | **ADDRESSED** — spacing/typography/border/focus via DADS-04 tokens；IA/KPI 語彙 KEEP |
| INV-03 | PASS | **KEEP** — programmatic heading focus outline retained（`:focus` + `:focus-visible`） |
| INV-12 / status labels | PASS | **KEEP** — 要確認/未記録/期限接近 text channel unchanged |
| INV-20 | ADAPT | **ADDRESSED（Overview）** — Overview interactive + heading focus-visible presentation |
| INV-22 | ADAPT | **ADDRESSED（Overview SCSS）** — rem/theme literals → token refs |
| INV-13 | ADAPT | **KEEP for now** — StatusBadge not forced onto KPI cards（label text already meaning channel） |
| INV-05+ | — | **OUT**（Users+） |

## 3. Before / after presentation summary

### Before

```text
DashboardUx.module.scss: raw rem / theme string / hardcoded #fff / #8a6116 / #fff4ce
overviewHeading:focus only
KPI / lists / buttons: untokenized borders & spacing
```

### After

```text
@use DADS-04 sbs-tokens
spacing / typography / border / surface / focus / warning feedback → tokens
dashed Overview panel kept（既存 synthetic panel 方言；DADS差のみでの削除はしない）
overviewHeading:focus + :focus-visible（INV-03 KEEP）
actionButton:focus + :focus-visible
KPI count 1.5rem retained（display emphasis；larger type token not in DADS-04 catalog）
React: no raw DADS literals；fixture labels UNCHANGED
```

## 4. Accessibility gate

| ID | Change |
|---|---|
| A11Y-HD-02 | NEW blocking — Overview single h1 + section h2 |
| A11Y-OV-01 | NEW blocking — Overview SCSS tokens + focus-visible + no raw hex outside theme strings |

## 5. KEEP / OUT

KEEP:

```text
Overview IA / navigation / destination semantics
status vocabulary（要確認 / 未記録 / 期限接近）
fail-closed / save 5-state
smoke invariants / data-dashboard-ux hooks
```

OUT:

```text
Users / Detail / Records / Review migration
Domain / Contracts / SharePoint / Deploy / #299 Close
DADS-UX-3+
```

## 6. Verification (this PR)

```text
format:check: PASS
root lint / typecheck / unit: PASS
check:a11y: PASS（A11Y-HD-02 / A11Y-OV-01 added）
SPFx Heft test: PASS (120/120)
SPFx production build: PASS
browser smoke PASS:
  DEMO-UX-7 / DEMO-UX-11 / SHELL-UX-1
  DEMO-UX-10 overview-family-r case PASS
browser smoke KNOWN stale（pre-existing；Overview token 起因ではない）:
  dashboard-ux-1（expects disabled actions / users placeholder；later DEMO-UX superseded）
  DEMO-UX-10 users-family-r note phrase drift on Users surface（OUT of DADS-UX-2）
Smoke expectations: NOT weakened
```
