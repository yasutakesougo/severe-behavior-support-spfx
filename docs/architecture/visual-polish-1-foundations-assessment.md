# VISUAL-POLISH-1 Foundations — Assessment / Plan

```text
Unit: VISUAL-POLISH-1 — Foundations（Assessment / Plan only）
Status: ASSESSMENT COMPLETE / Implementation NOT STARTED
Date: 2026-08-14
Mode: docs-only freeze + gap analysis
Application mutation: 0
External mutation: 0
Deploy: NO-GO
Implementation Start: NOT AUTHORIZED（requires separate Human GO）
```

## CURRENT

```text
BASE SHA: 72cad1b3ad126e00531b4726079f248f53412cd0
CURRENT MAIN: 72cad1b3ad126e00531b4726079f248f53412cd0
  tip: Merge pull request #365 (STAFF-CONFIDENCE V1 docs)
Open PRs at assessment:
  #366 draft — docs(architecture): MAINTENANCE-MCP-DIRECTION-V1（unrelated）
```

### Application RC vs repository main

```text
Application Release Candidate (VA-2 accepted / Deploy GO package):
  8173a4c18f6ce85254467c67ce81b481a537a35d
Repository main tip:
  72cad1b3ad126e00531b4726079f248f53412cd0
App delta 8173a4c… → main tip (spfx/src|src|tests): NONE（docs-only ahead）
```

Visual Polish must treat VA-2 accepted RC as the prior visual baseline and must **not** rewrite VA-1 / VA-2 Acceptance closeouts. VP work produces a **new** RC candidate after later slices.

## AUTHORITATIVE DOCS

| Doc | Role |
|---|---|
| `docs/architecture/visual-acceptance-2-closeout.md` | VA-2 PASS / ACCEPTED；RC `8173a4c…` pinned |
| `docs/architecture/release-readiness-1-review.md` | RELEASE-READINESS-1 A. DEPLOY READY（for RC `8173a4c…`） |
| `docs/architecture/release-readiness-1-deploy-go.md` | Human Deploy GO recorded；Agent upload HOLD |
| `docs/architecture/release-readiness-1-rollback-runbook.md` | Rollback CREDIBLE |
| `docs/architecture/dads-application-style-guide-v1.md` | Presentation style guide（KEEP vocabulary / fail-closed） |
| `docs/architecture/dads-04-design-tokens.md` | Existing corporate token layer |
| `docs/architecture/dads-05-shared-ui-primitives.md` | Existing primitives |
| `docs/architecture/dads-final-consistency-review.md` | DADS-VERIFY COMPLETE |
| `docs/architecture/dads-existing-ui-inventory.md` | Inventory / KEEP–ADAPT–GAP |

### Visual Acceptance state（CONFIRMED）

```text
VISUAL-ACCEPTANCE-1 = COMPLETE（baseline 7098045…）
VISUAL-ACCEPTANCE-2 = PASS / ACCEPTED（RC 8173a4c…）
UI-POLISH / VISUAL-POLISH = NOT STARTED（VA-2 residuals deferred）
```

### Release Readiness state（CONFIRMED for prior RC）

```text
RELEASE-READINESS-1 = A. DEPLOY READY for application RC 8173a4c…
Deploy GO = RECEIVED for Human operator（Agent execution HOLD）
Deploy / App Catalog / SharePoint mutation by this program = FORBIDDEN
```

## EXISTING VISUAL SYSTEM

### theme handling

- SPFx `supportsThemeVariants: true` on Scaffold Shell Web Part manifest
- `onThemeChanged` sets `--bodyText` / `--link` / `--linkHovered` CSS vars on host DOM
- SCSS uses SPFx theme strings (`[theme:…, default: …]`) for text / border / surface slots
- Fluent UI `ThemeProvider` is **not** used as the app shell theme root（native buttons + SCSS modules）
- DADS-04 emits non-theme CSS vars via `emit-css-vars` on `.appShell`

### tokens

Location: `spfx/src/shell/tokens/` (`raw.ts`, `semantic.ts`, `sbs-tokens.scss`, `index.ts`, `tokens.test.ts`)

Present today:

| Category | Existing | VP-1 gap |
|---|---|---|
| Surface | `surfaceCanvas`, `surfaceSubtle`, `surfaceMuted`, `surfaceSelected` | missing named `surface`, `surfaceHover` |
| Text | `textPrimary`, `textInk` | missing `textSecondary`, `textDisabled` |
| Border | `borderSubtle`, `borderStrong` (+ secondary) | OK for VP-1 minimum |
| Spacing | `space.1`…`space.5` = 4/8/12/16/24 | missing `space.6` = 32 |
| Radius | `none/sm/md/lg/pill` | alias `radiusSmall`/`radiusMedium` optional |
| Elevation | — | **missing** `elevationNone` / `elevationSubtle` |
| Typography | `font-size.100`…`500` | missing semantic `pageTitle` / `sectionTitle` / `body` / `meta` |
| Action | — | **missing** primary / secondary / tertiary weight tokens |
| Status presentation | `feedbackInfo*` / `feedbackWarning*` / `feedbackDanger*` | missing explicit `neutral` / `attention` / `success`（or documented aliases） |
| Save-state map | `SBS_SAVE_STATE_PRESENTATION_TOKEN_MAP` | KEEP（unknown ≠ failed） |

### primitives

`spfx/src/shell/primitives/`: StatusBadge, EmptyNotice, SingleSelectListbox, SectionLabelStrip（StatusPanel family KEEP）

### typography

- SharePoint / Fluent default stack（no custom webfont）
- Page titles often `font-size-500` or ad-hoc `1.5rem` + weight 600–700
- Meta often `font-size-100` / ad-hoc `0.7–0.85rem`
- Many screen SCSS modules still use **off-scale** rem/px values（INV-22 dialect residual）

### spacing

- Token scale fixed to 5 steps；many modules still use `0.35rem`, `0.65rem`, `20px`, `6px`, etc.
- VP-1 must **define** scale + discourage new off-scale values；mass remapping of screens = OUT（VP-2+）

### status presentation

- Labels canon: 要確認 / 未記録 / 期限接近（`status-labels.ts`）
- StatusBadge = label-first；color not sole meaning channel
- Save 5-state QUIET/EMPHASIZED preserved

### action hierarchy

- Native `<button>` + local SCSS classes（`primaryButton`, `backButton`, `detailButton`, `actionButton`, `navButton`, `saveButton`, `outcomeButton`）
- Fluent `PrimaryButton` / `DefaultButton` / `ActionButton` **not** used in shell screens
- Visual weight is **per-screen CSS**, not a shared action-token layer（VP-1 gap）

## VP-1 PROPOSED SCOPE（minimal）

```text
Purpose: establish / extend common Visual System tokens for Visual Polish
  without Overview / Users DOM restructure and without behavior change.
```

IN:

1. **Additive** semantic tokens on existing DADS-04 layer（do not fork a second token system）
2. Spacing: add `space.6` = 32px / 2rem；document scale 4–32 as authoritative for new CSS
3. Surface: add `surface` + `surfaceHover`（map to neutral theme slots；keep existing names）
4. Text: add `textSecondary` + `textDisabled`
5. Elevation: add `elevationNone` + `elevationSubtle`（subtle shadow token only；no mass cardization）
6. Typography semantic aliases: `pageTitle` / `sectionTitle` / `body` / `meta` → existing font-size + weight guidance（~20/16/14/12，weight 600 for titles）
7. Action weight tokens / SCSS mixins or shared classes: `primary` / `secondary` / `tertiary`（presentation chrome only）
8. Status presentation aliases: `neutral` / `attention` / `warning` / `danger` / `success` mapped to feedback tokens **without** renaming Domain / DEMO status labels
9. Docs: VP-1 foundations acceptance notes；pin BASE SHA；Explicit OUT
10. Tests: extend `tokens.test.ts`；re-run existing verify suite；no smoke expectation weakening

OUT of VP-1:

```text
Overview / Users / Workflow screen re-layout
DOM structure changes for list→card hybrids
navigation semantics changes
status vocabulary changes
save 5-state merge / rename
fail-closed / permission / schema / SharePoint / Deploy
React 18 / Fluent UI v9
Skeleton / animation system / new icon behavior
ThemeProvider mandatory rewrite（optional later ADAPT；not required for VP-1 GO）
Rewriting VA-1 / VA-2 closeouts
Mass off-scale spacing remapping across all SCSS modules
```

## EXPECTED FILES（Implementation Start candidate）

```text
spfx/src/shell/tokens/raw.ts
spfx/src/shell/tokens/semantic.ts
spfx/src/shell/tokens/sbs-tokens.scss
spfx/src/shell/tokens/index.ts
spfx/src/shell/tokens/tokens.test.ts
docs/architecture/visual-polish-1-foundations.md（implementation acceptance；separate from this assessment）
Optional minimal consumers only if needed to prove emit:
  spfx/src/shell/ux/ShellUx.module.scss（emit-css-vars only；no IA change）
Optional shared action classes:
  spfx/src/shell/primitives/… or tokens SCSS mixins（no screen DOM rewrite）
```

## PRESERVED INVARIANTS

```text
status labels: 要確認 / 未記録 / 期限接近
save 5-state: unsaved / saving / saved / save_failed / save_outcome_unknown
save_outcome_unknown ≠ save_failed（presentation + behavior）
fail-closed / unselected / access_denied
destination heading focus after navigation
data-demo-ux / data-dashboard-ux smoke hooks
permission / authorization / site isolation
SharePoint schema / data contracts
SPFx 1.23.2 / React 17 / Fluent UI v8
```

### Verification inventory（must re-run on Implementation）

```text
npm run format:check
npm run lint
npm run typecheck
npm test
npm run check:contracts-boundaries
npm run check:scope
npm run check:a11y
spfx: heft test
spfx: production build / package-solution
relevant browser smoke（no expectation weakening）:
  shell-ux-2（save 5-state）
  demo-ux-7（status labels）
  demo-ux-12（save emphasis）
  demo-ux-14（saving progress）
  field-workflow-ui（if package touches procedure form chrome）
```

## EXPLICIT OUT

```text
domain behavior / business meaning / navigation semantics
status vocabulary / permission / authorization / fail-closed
save behavior / save 5-state collapse
data contract / SharePoint schema / production data / site isolation
React upgrade / Fluent UI major upgrade
Deploy / App Catalog / SharePoint / M365 / Entra / Copilot Apps mutation
Issue close / unrelated Issue mutation
VP-2 Overview / VP-3 Users / VP-4 Workflow screen polish
VA closeout rewrite
```

## RISKS

### P0

```text
none identified for Assessment scope
```

### P1

```text
1. Token rename (breaking) instead of additive aliases → consumer / test churn; HOLD if rename proposed
2. Scope creep into Overview/Users DOM during Foundations → violates slice order
3. Collapsing save_failed and save_outcome_unknown chrome while “cleaning” status tokens
```

### P2

```text
1. Large residual off-scale spacing still in screen SCSS（INV-22）— document; remapping deferred
2. Action hierarchy remains class-name fragmented until later slices adopt tokens
3. dashboard-design-v1.md historically notes space.6=24 — conflicts with VP-1 space6=32; treat as stale docs residual
4. VA-2 P2/P3 residuals remain OPEN / non-blocking until later polish slices
5. Some browser smokes already KNOWN stale vs later DEMO-UX notes（pre-existing; do not weaken）
```

## RECOMMENDED IMPLEMENTATION SLICE

```text
Single Draft PR: VISUAL-POLISH-1 Foundations
Base: origin/main @ 72cad1b…（re-fetch at Implementation Start）
Kind: additive tokens + docs + token tests
DOM/IA: no Overview/Users restructure
Consumer change: emit-css-vars / optional shared action mixins only
Acceptance: VP-1 §11 checklist + existing verify suite green
Then: Fresh Review → only after PASS, Human GO for VP-2 Overview
```

## VERDICT

```text
READY FOR VP-1 IMPLEMENTATION START: YES

Conditions:
  - separate explicit Implementation Start GO required
  - additive-only on DADS-04（no parallel token system; no breaking renames）
  - no screen large re-layout in the same PR
  - Deploy = NO-GO
  - VA-2 closeout remains historical pin（do not rewrite）
```

## Non-claims

```text
This Assessment ≠ Implementation Start
This Assessment ≠ Visual Acceptance for a new RC
This Assessment ≠ Deploy GO
This Assessment ≠ permission to mutate SharePoint / App Catalog
This Assessment ≠ authorization to start VP-2 Overview
```
