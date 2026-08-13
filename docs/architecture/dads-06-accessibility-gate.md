# DADS-06 — Accessibility Gate

```text
Issue / program: DADS
Unit: DADS-06 — Accessibility Gate
Status: Implementation Start（this PR）
Authority:
  docs/architecture/decision-dads-adoption-v1.md
  docs/architecture/dads-existing-ui-inventory.md
  docs/architecture/dads-application-style-guide-v1.md
  docs/architecture/dads-04-design-tokens.md
  docs/architecture/dads-05-shared-ui-primitives.md
Baseline main: a973318f6efee95b91ce1801c79749d50fdca6b2
Kind: test / CI gate（no screen migration）
DADS-UX-* / INV-19 fix / Deploy / SharePoint write / #299 Close: NOT AUTHORIZED
New runtime dependency (axe-core 等): NOT introduced
```

## 1. Purpose

DADS-03〜05 で固定した a11y / primitive 契約が、今後の UI 変更で退行しないよう **継続検証可能な Accessibility Gate** を追加する。

```text
画面全面改修 = OUT
業務意味変更で Gate を通す = OUT
fail-closed / save 5-state / status vocabulary = UNCHANGED
smoke expectation weakening = OUT
```

## 2. Architecture

```text
spfx/src/shell/a11y/
  disposition.ts     rule catalog + slice flags
  a11y-gate.test.ts  Heft unit coverage of catalog

scripts/a11y/accessibility-gate.mjs
  static source scanners（Node only；no new deps）

scripts/ci/check-accessibility-gate.mjs
  CI entry（exit non-zero on blocking / undetectable known_gap）

tests/a11y/accessibility-gate.test.ts
  root unit runner
```

Severities:

| Severity | CI effect |
|---|---|
| `blocking` | FAIL if check fails |
| `known_gap` | FAIL if finding is **not** detectable（detector regression） |
| `advisory` | reported；does not fail CI alone |

## 3. Checks covered / not covered

### Covered（blocking）

| ID | Focus | Target |
|---|---|---|
| A11Y-KB-01 | keyboard | SingleSelectListbox Arrow/Home/End/Enter/Space |
| A11Y-AN-01 | accessible name | listbox `ariaLabel` → `aria-label` |
| A11Y-PRIM-01 | primitive semantics | listbox/option；SectionLabelStrip ≠ tablist |
| A11Y-LIVE-01 | live/status | EmptyNotice announce → status + polite |
| A11Y-SC-01 | status not color-only | StatusBadge requires `label` |
| A11Y-FL-01 | form labels | DailyRecords `<label>` wraps inputs |
| A11Y-DIS-01 | disabled | UserDetail `disabled` + `aria-disabled` |
| A11Y-DESC-01 | description/error | StatusPanel alert/status KEEP |

### Detect-only

| ID | Focus | Notes |
|---|---|---|
| A11Y-HD-01 | heading / INV-19 | Scaffold host `bodyTitle` `<h2>` must remain **detectable**. Fix = NOT AUTHORIZED（DADS-UX / separate GO） |
| A11Y-FV-01 | focus-visible | Focus tokens present；`:focus` / `:focus-visible` mix counted（mass rewrite OUT） |

### Deferred（not automated here）

| ID | Focus | Notes |
|---|---|---|
| A11Y-MAN-01 | full keyboard traversal | Existing browser smokes / manual；no expectation weakening |

## 4. CI integration

```text
npm run check:a11y
→ node scripts/ci/check-accessibility-gate.mjs

Wired into:
  package.json verify:ci
  .github/workflows/contracts-ci.yml

Path triggers extended for:
  spfx/src/shell/**
  spfx/src/webparts/scaffoldShellWebPart/**
  scripts/a11y/**
  tests/a11y/**
```

## 5. Exact OUT

```text
DADS-UX-* screen migration
INV-19 heading fix implementation
broad visual redesign
Domain / Contracts / schema / permission / adapter
Deploy / SharePoint write / #299 Close
axe-core / new runtime a11y dependency
smoke expectation weakening
```

## 6. Acceptance

1. Rule catalog + static gate exist  
2. DADS-05 primitive a11y contracts are blocking regressions  
3. INV-19 is detectable as `known_gap`  
4. CI runs `check:a11y`  
5. Verification PASS；no smoke weakening  
6. Ready / Merge remain separate Human gates  

## 7. Verification (this PR)

```text
（filled after local verification）
```
