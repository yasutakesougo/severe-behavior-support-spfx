# DADS-04 — Design Tokens（法人アプリ中間層）

```text
Issue / program: DADS
Unit: DADS-04 — Design Tokens
Status: Implementation Start（this PR）
Authority:
  docs/architecture/decision-dads-adoption-v1.md
  docs/architecture/dads-existing-ui-inventory.md
  docs/architecture/dads-application-style-guide-v1.md
Baseline main: db539f684843eef1fd41127a60c95ec6d54d63c6
Kind: token definition + minimal shell wiring
GAP remediation (INV-07/10/17/19): OUT
DADS-05 / DADS-06 / DADS-UX-*: NOT AUTHORIZED
Deploy / SharePoint write / #299 Close: NOT AUTHORIZED
```

## 1. Purpose

DADS-03 Application Style Guide を実装へ接続する **法人アプリ Design Tokens 中間層** を導入する。

```text
React / components に DADS 値を直接埋め込まない
既存 DEMO-UX 見た目を全面置換しない
PASS = KEEP / ADAPT = presentation-only / GAP 是正は混ぜない
```

## 2. Architecture summary

```text
DADS (reference)
    ↓ informs
DADS-03 Style Guide (presentation principles)
    ↓ implemented by
Corporate tokens (this unit)
  raw.ts          — literal baselines (current shell)
  semantic.ts     — semantic names + cssVar / SPFx theme refs
  sbs-tokens.scss — SCSS variables + focus-ring / emit-css-vars
    ↓ consumed by
Shell SCSS (minimal wire: ShellUx.module.scss)
    ↓ later
DADS-05 primitives / DADS-UX-* (separate GO)
```

Rules:

1. **Semantic names first** — components/styles reference `feedbackInfo*` / `focus.ringColor` / `space.3`, not ad-hoc hex in React.
2. **Raw vs semantic separation** — literals live in `raw.ts` / SCSS vars; usage goes through semantic ids.
3. **No business meaning in token ids** — no `recordStatus`, `要確認`, etc. in token names. Labels stay in DEMO-UX vocabulary modules.
4. **Color-only meaning forbidden** — feedback colors are presentation chrome; text labels remain the meaning channel.
5. **focus-visible ready** — `sbs.focus-ring` / `SBS_FOCUS` express ring width/offset/color; selector migration (`:focus` → `:focus-visible`) is later ADAPT (INV-20), not this slice.
6. **SPFx theme strings preserved** — theme-slot colors are not stuffed into CSS variables (keeps SharePoint theme rewrite working).
7. **Future DADS updates** — change raw/semantic layer once; avoid mass component edits.

## 3. Token categories

| Category | Examples |
|---|---|
| spacing | `space.1` … `space.5` |
| typography | `font-size.100` … `500` |
| radius | `none` / `sm` / `md` / `lg` / `pill` (catalog only; dialect migration OUT) |
| border | `thin` / `thick` |
| surface | `surfaceMuted` / `surfaceSubtle` / `surfaceCanvas` |
| text | `textPrimary` / `textInk` |
| focus | `outlineWidth` / `outlineOffset` / `ringColor` |
| status-presentation | feedback info / danger / warning chrome |
| state-presentation | save-state → feedback map (unknown ≠ failed) |

## 4. Mapping to DADS-03

| DADS-03 topic | Token handling |
|---|---|
| §6.2 Typography / Spacing | `SBS_FONT_SIZE` / `SBS_SPACE` + SCSS vars |
| §6.3 Focus | `SBS_FOCUS` + `focus-ring` mixin |
| §4.2 Save 5-state KEEP | `SBS_SAVE_STATE_PRESENTATION_TOKEN_MAP`; unknown stays warning feedback |
| §4.4 Fail-closed KEEP | danger feedback tokens for panels; semantics unchanged |
| §4.1 Status labels KEEP | labels remain in `status-labels.ts`; tokens do not rename them |
| INV-22 dialect ADAPT | radius catalog present; no forced unification |
| INV-07/10/17/19 GAP | **OUT** of this PR |
| DADS-05 primitives | tokens only; no shared components |

## 5. Code layout

```text
spfx/src/shell/tokens/
  raw.ts
  semantic.ts
  sbs-tokens.scss
  index.ts
  tokens.test.ts
spfx/src/shell/ux/ShellUx.module.scss  — @use tokens; emit CSS vars on .appShell
docs/architecture/dads-04-design-tokens.md
```

Other surface SCSS modules are **not** migrated in this slice (no wholesale UI rewrite).

## 6. Exact OUT

```text
INV-07 / INV-10 / INV-17 / INV-19 implementation
Shared UI Primitives (DADS-05)
Accessibility Gate (DADS-06)
Screen migration (DADS-UX-*)
Domain / Contracts / schema / permission / adapter mutation
Deploy / SharePoint write / #299 Close
New npm dependencies
Visual redesign / radius dialect forced unification
:focus → :focus-visible mass change
```

## 7. Compatibility

```text
SPFx 1.23.2
React 17.0.1
Existing Heft toolchain
No new dependencies
```

## 8. Acceptance

```text
existing behavior unchanged (token values = current baselines)
fail-closed unchanged
save 5-state unchanged
status vocabulary unchanged
no test weakening
no DADS-05/06/UX leakage
```

## 9. Verification (this PR)

```text
format:check: PASS
root lint / typecheck / unit tests: PASS
SPFx Heft test: PASS (110/110; includes tokens.test)
SPFx production build + package-solution: PASS
browser smoke PASS (current DEMO-UX / shell invariants):
  DEMO-UX-14 PASS
  DEMO-UX-7 PASS
  DEMO-UX-5 PASS
  SHELL-UX-1 PASS
browser smoke KNOWN stale (pre-existing vs later DEMO-UX business destinations /
  enabled today-actions; not introduced by token values):
  SHELL-UX-7 expects DestinationPlaceholder
  DASHBOARD-UX-1 expects all today-action buttons disabled
  DEMO-UX-2 placeholder destination cases
Smoke runners / expectations: NOT modified (no test weakening)
```
