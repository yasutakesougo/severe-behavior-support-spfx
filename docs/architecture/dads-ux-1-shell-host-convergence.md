# DADS-UX-1 — Shell / Host Convergence

```text
Issue / program: DADS
Unit: DADS-UX-1 — Shell / Host Convergence
Status: Implementation Start（this PR）
Authority:
  docs/architecture/decision-dads-adoption-v1.md
  docs/architecture/dads-existing-ui-inventory.md
  docs/architecture/dads-application-style-guide-v1.md
  docs/architecture/dads-04-design-tokens.md
  docs/architecture/dads-05-shared-ui-primitives.md
  docs/architecture/dads-06-accessibility-gate.md
Baseline main: d748f21d65daf592bda32acbc43c327108e2de16
Kind: shell / host presentation convergence（INV-19）
DADS-UX-2+ / Deploy / SharePoint write / #299 Close: NOT AUTHORIZED
```

## 1. Purpose

既存 App Shell / Scaffold host を DADS-03〜06 基準へ **最小限** 収束する。

Primary: **INV-19 heading hierarchy**（host `bodyTitle` が destination 見出しを汚染しない）。

## 2. Before / after heading structure

### Before（INV-19 GAP）

```text
ready-region
  destination h1 （業務主見出し）
  destination h2… （業務セクション）
  ScaffoldShell children:
    h2.bodyTitle  ← host「Shell ready」系（見出し階層へ混入）
    p.bodyCopy
    p.bodyMeta…
```

### After（DADS-UX-1）

```text
ready-region
  destination h1 （業務主見出し）= UNCHANGED
  destination h2… = UNCHANGED
  ScaffoldShell children:
    p.bodyTitle[data-shell-ux=shell-host-status]  ← 非見出し
    p.bodyCopy
    p.bodyMeta…
```

Style Guide §8.4 是正方針 **1)**（補助文言を非見出しにする）を採用。

## 3. INV-19 disposition

| Field | Value |
|---|---|
| Inventory | INV-19 GAP |
| Style Guide | §8.4 SELECTED option 1 |
| This PR | **RESOLVED** |
| Gate | `A11Y-HD-01` `known_gap` → **blocking** regression |
| Screen migration | OUT（Users / Records / Review = DADS-UX-2+） |

## 4. Also in this PR

- ScaffoldShell SCSS → DADS-04 token `@use`（spacing / typography / text color）
- Accessibility Gate hardening co-located with INV-19:
  - HD-01 blocking
  - PRIM-01 hybrid window widened（DADS-06 Fresh Review P1）
  - KB-01 `case "..."` 拘束（substring FN 緩和）

## 5. KEEP / OUT

KEEP:

```text
App Shell IA / destination model / navigation
fail-closed / save 5-state / status vocabulary
keyboard behavior / smoke invariants
```

OUT:

```text
DADS-UX-2+
Users / Record / Review screen migration
Domain / Contracts / SharePoint schema / permissions / adapter
Deploy / SharePoint write / #299 Close
broad visual redesign
smoke expectation weakening
```

## 6. Verification (this PR)

```text
format:check: PASS
root lint / typecheck / unit: PASS (557/557)
check:a11y: PASS（A11Y-HD-01 blocking PASS — INV-19 resolved）
SPFx Heft test: PASS (119/119)
SPFx production build: PASS
browser smoke PASS:
  SHELL-UX-1
  DEMO-UX-7
  DEMO-UX-3
Smoke expectations: NOT weakened
Negative overlays: HD-01 h2 restore FAIL；PRIM-01 hybrid FAIL
```
