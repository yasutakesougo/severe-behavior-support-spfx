# DADS-05 — Shared UI Primitives

```text
Issue / program: DADS
Unit: DADS-05 — Shared UI Primitives
Status: Implementation Start（this PR）
Authority:
  docs/architecture/decision-dads-adoption-v1.md
  docs/architecture/dads-existing-ui-inventory.md
  docs/architecture/dads-application-style-guide-v1.md
  docs/architecture/dads-04-design-tokens.md
Baseline main: 00b00e123404f3f44b415edc059748781cde8842
Kind: shared primitives + minimal adoption
DADS-06 / DADS-UX-* / INV-19 / Deploy / SharePoint write / #299 Close: NOT AUTHORIZED
```

## 1. Purpose

DADS-04 tokens の上に、法人アプリ共有 UI primitives を導入する。

```text
KEEP / ADAPT / FIX / CONSOLIDATE
既存で問題なし → 置換しない
業務意味・fail-closed・save 5-state・status vocabulary = UNCHANGED
```

## 2. Disposition registry

| Primitive | Disposition | Inventory | Notes |
|---|---|---|---|
| StatusBadge | CONSOLIDATE | INV-13 / INV-12 | label text = meaning channel |
| EmptyNotice | FIX | INV-17 | `role=status`；illustrated EmptyState 非必須 |
| SingleSelectListbox | FIX | INV-10 | proper listbox/option + keyboard |
| SectionLabelStrip | FIX | INV-07 | 非タブ表示順ラベル；操作は分離 |
| StatusPanel family | KEEP | INV-15/16/24 | fail-closed パネルは置換しない |

## 3. Code layout

```text
spfx/src/shell/primitives/
  disposition.ts
  StatusBadge.tsx
  EmptyNotice.tsx
  SingleSelectListbox.tsx
  SectionLabelStrip.tsx
  Primitives.module.scss  (@use tokens)
  index.ts
  primitives.test.ts
```

## 4. Minimal adoption（not full DADS-UX migration）

| Surface | Change |
|---|---|
| UsersList | StatusBadge + EmptyNotice |
| DailyRecords incomplete select | SingleSelectListbox + StatusBadge(pill) |
| UserDetail section chrome | SectionLabelStrip（支援計画操作は既存「支援計画を表示」ボタン） |

OUT of this slice:

```text
INV-19 Scaffold heading fix
Full screen migration (DADS-UX-*)
Accessibility Gate CI (DADS-06)
StatusPanel rewrite
Domain / Contracts / schema / permission / adapter
Deploy / SharePoint write / #299 Close
```

## 5. Smoke / invariant policy

```text
Do not weaken smoke expectations to fit primitives
Preserve data-demo-ux hooks used by DEMO-UX smokes
fail-closed / save 5-state / status labels unchanged
```

## 6. Acceptance

1. Primitives registry + components exist and use DADS-04 tokens
2. INV-07 / INV-10 / INV-17 addressed via FIX primitives + minimal adoption
3. StatusPanel family remains KEEP
4. INV-19 / DADS-06 / DADS-UX-* still NOT AUTHORIZED
5. Verification PASS；no test weakening

## 7. Verification (this PR)

```text
HEAD: 4794db7a5567abbf2e93b2cea0034eb3e5144a91
Baseline main: 00b00e123404f3f44b415edc059748781cde8842
format:check: PASS
git diff --check origin/main...HEAD: PASS
  (prior HOLD tip 1866e0b: trailing whitespace on Acceptance L80–84;
   format-only fix in 4794db7 — no implementation change)
GitHub CI (Contracts and Process CI): PASS
  https://github.com/yasutakesougo/severe-behavior-support-spfx/actions/runs/31668992236
root lint / typecheck / unit: PASS (554/554)
SPFx Heft test: PASS (115/115)
SPFx production build: PASS
browser smoke PASS:
  DEMO-UX-14 / 13 / 9 / 8 / 7 / 5 / 3
  SHELL-UX-1
Smoke expectations: NOT weakened
```

## 8. Fresh Review

```text
Prior: HOLD @ 1866e0b — P1 CI FAILURE (git diff --check trailing whitespace)
Updated: PASS @ 4794db7 — P0=0 / P1=0
Ready = NOT AUTHORIZED
Merge = NOT AUTHORIZED
Deploy / SharePoint write / #299 Close = NOT AUTHORIZED
```
