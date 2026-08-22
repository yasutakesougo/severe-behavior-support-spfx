# VP-3 Exact Scope Definition — Control Family Unification

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: VP-3 — Shell / radio / tabs / buttons UI統一
Kind: read-only Exact Scope Definition
MODE: READ-ONLY DEFINITION
BASE: main@4937d1d9b9884ddeea6b50deae27218f0a9bd20b
Definition status: COMPLETE / AWAITING DEFINITION REVIEW
Code / fixture / schema mutation: NOT AUTHORIZED
Issue mutation: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
Deploy / SharePoint / Graph / Entra: FORBIDDEN
NEXT: VP-3 Definition Review
then, if accepted: VP-3 Implementation Start GO
Agent: STOP on implementation
```

## 1. Naming / series boundary

This VP-3 belongs to the **residual visual wave** after:

- VP-1 demo chrome separation (`#493`)
- VP-2 staff-visible technical copy cleanup (`#494` @ `4937d1d`)

It is **not** `docs/architecture/visual-polish-3-users-implementation-start.md`
(legacy Users polish / VISUAL-POLISH-3).

Canonical path for this definition:

```text
docs/architecture/vp-3-control-family-exact-scope-definition-1.md
```

## 2. Exact objective

Same role of control → same visual + interaction language across Shell chrome
and Record / Correction / Cancellation, without changing semantics.

```text
目標 = control family visual consistency
目標 ≠ CTA priority / information architecture redesign (VP-5)
目標 ≠ typography / max-width / spacing system (VP-4)
目標 ≠ copy / datetime (VP-6)
目標 ≠ domain / persistence / nav destinations / auth
```

## 3. Authority consumed (do not redefine)

| Authority | Role for VP-3 |
|---|---|
| `docs/architecture/ui-visual-hierarchy-contract-1.md` H-05 | `SBS_ACTION.primary/secondary/tertiary` = CTA visual weight only |
| `spfx/src/shell/tokens/semantic.ts` `SBS_ACTION` | weight notes; VP-3 applies visuals that match these weights |
| VP-1 tokens (`surface*`, `focus-ring`, `border-*`, `textDisabled`) | consume / lightly extend; no new design system |
| VP-1 demo demotion (`spfx/src/shell/ux/Vp1DemoSeparation.module.scss`) | keep demo fieldset demoted; only unify interaction language |
| Record Form button hierarchy (`ProcedureRecordFormUx.module.scss`) | **visual reference** for Primary / Secondary / Tertiary |

## 4. Current-state gap (evidence @ BASE)

```text
Shell chrome:
  siteOption / demoRoleOption = native radio, no selected chrome
  navButton = selected border + bold; no hover; disabled opacity 0.55

Record Form:
  resultOption card + selected token
  save filled / next bordered / back demoted (3-tier)

Correction / Cancellation (shared CorrectionUx):
  resultOption weaker twin
  save ≈ back (flat); Cancellation「結果を確認」also .saveButton
```

| Family | Today | Gap |
|---|---|---|
| Nav tabs | `.navButton` / `.navButtonSelected`; focus-ring; disabled opacity 0.55; **no hover** | Missing hover; disabled contrast weaker than Form |
| Site / Demo radios | bare labels; selected = native `checked` only; focus on input only | No selected surface/border/weight; no hover; not same language as result cards |
| Result radios | Form: selected border-strong + surface-selected + semibold; Correction: canvas/subtle, no radius/weight | Form vs Correction diverge |
| Buttons | Form has 3-tier; Correction/Cancellation flat (save ≈ back); Cancellation「結果を確認」also `.saveButton` | Hierarchy not shared |

## 5. Control hierarchy (fixed for VP-3)

Visual weight only. **Does not** choose which CTA is most important (that is VP-5).

| Weight | Visual rule (reference = Record Form) | In-scope instances |
|---|---|---|
| PRIMARY | filled `$color-focus-ring`, canvas text, semibold; disabled = muted + disabled text + `opacity: 1` + `not-allowed` | 記録を保存 / 訂正を保存 / 取消を保存 |
| SECONDARY | surface + strong border + semibold; hover → surface-hover | 次の支援手順; Cancellation「結果を確認」(className may change to secondary class; **handler unchanged**) |
| TERTIARY / BACK | surface + subtle border + secondary text | ← 現在の支援手順 and equivalent back on Record / Correction / Cancellation |

## 6. Four families — visual rules to unify

### 6.1 Primary navigation tabs (概要 / 利用者 / 記録)

| State | Rule |
|---|---|
| unselected | neutral / muted surface + thin strong border |
| selected | selected surface + strong/focus border + semibold/bold (**not color-only**) |
| hover | `$color-surface-hover` (token exists; unused on chrome today) |
| focus | shared `focus-ring` on the control |
| disabled | muted + disabled text + `not-allowed` (prefer Form `opacity: 1` pattern over nav `0.55` for readability AC6) |
| touch | `min-height` ≥ `2.75rem` (~44px); Form may keep `3rem` |

**Unchanged:** destination ids, selected logic in `AppShellChrome.tsx`, enable/disable conditions.

### 6.2 Radio / selectable option cards

**Baseline:** Record Form `.resultOption` / `.resultOptionSelected`.

Apply the **same interaction language** to:

- Correction result radios
- Site selector options (compact; **not** full-width business cards)
- Demo role options (compact; keep VP-1 demoted fieldset chrome)

Shared language means: focus treatment, selected border + background + weight,
radio/control alignment, label hierarchy. Density/size may differ (compact
chrome vs procedure cards).

Cancellation confirm remains a **checkbox** (no result radiogroup) — out of
radio-family restyle except if it shares focus/disabled tokens incidentally.

### 6.3 Buttons (Primary / Secondary / Back / Disabled)

Lift Form’s four-state rules into Correction / Cancellation (and Shell only if
a matching button class appears). Minimum:

- Primary / Secondary / Tertiary(Back) / Disabled
- focus ring on **all** actionable buttons (Correction save currently missing focus rules)
- touch ≥ 44px
- disabled readable (no heavy opacity wash)

### 6.4 Demo settings controls

Site + Demo role: compact selectable options with shared radio language;
VP-1 demotion retained; no promotion of demo chrome into primary IA.

## 7. Changed-area candidate (mutation not authorized by this definition)

Selecting paths is **not** Implementation Start authorization.

**Primary (expected):**

```text
spfx/src/shell/ux/ShellUx.module.scss
spfx/src/shell/procedure/ProcedureRecordFormUx.module.scss
  (align/shared rules only if needed; do not redesign Form hierarchy)
spfx/src/shell/procedure/ProcedureRecordCorrectionUx.module.scss
  (shared by Cancellation)
```

**Allowed light extension:**

```text
spfx/src/shell/tokens/*
  shared mixins / semantic aliases only if duplication would otherwise diverge
spfx/src/shell/primitives/*
  reuse/extend only if already fitting; no large new design-system component set
```

**Conditional JSX (className / semantic grouping only):**

```text
spfx/src/shell/ux/AppShellChrome.tsx
spfx/src/shell/ux/SiteSelector.tsx
spfx/src/shell/ux/DemoPresentationRoleEntry.tsx
spfx/src/shell/procedure/ProcedureRecordForm.tsx
spfx/src/shell/procedure/ProcedureRecordCorrection.tsx
spfx/src/shell/procedure/ProcedureRecordCancellation.tsx
```

**Explicitly not primary targets:** `CurrentProcedure*`, `AbcObservation*`,
`ReviewDueState*`, Users back buttons — AC5 for VP-3 applies to **in-scope
surfaces**; adjacent back chrome is residual unless Implementation Start later
expands with Human GO.

## 8. Explicit OUT

```text
VP-4 desktop typography / max-width / spacing system
VP-5 status badge / CTA priority information design
VP-6 日本語日時・文言改善
VP-2 technical copy rework
domain / persistence / save-state semantics
navigation destination / selected-state logic
correction / cancellation authorization
next occurrence selection logic
auth / Entra / fixture / SharePoint / Graph / Deploy
new large design system / Storybook SSOT
making site/demo options full-size procedure cards
Issue close / Ready / Merge without Human GO
```

## 9. Hard boundary (semantics freeze)

Changing visuals must **not** change:

- enabled / disabled conditions
- `onClick` / handlers / save state transitions
- correction / cancellation authorization
- next occurrence selection
- nav destinations / `SHELL_PRIMARY_NAV_ITEMS` behavior

## 10. Acceptance Criteria

| ID | Criterion |
|---|---|
| VP-3-AC1 | 概要 / 利用者 / 記録 tabs consistent in selected / unselected / focus |
| VP-3-AC2 | Site selector + Demo role share radio interaction language |
| VP-3-AC3 | Record + Correction result radio cards share selected/focus language |
| VP-3-AC4 | Primary save actions share primary button visual |
| VP-3-AC5 | Back buttons on **in-scope** surfaces share tertiary visual |
| VP-3-AC6 | Disabled clearly non-interactive without losing contrast/readability |
| VP-3-AC7 | Interactive targets principally ≥ 44px |
| VP-3-AC8 | Keyboard focus visible on all in-scope controls |
| VP-3-AC9 | Selected not color-only (border and/or weight also) |
| VP-3-AC10 | Record save enable/disable semantics unchanged |
| VP-3-AC11 | Correction / Cancellation semantics unchanged |
| VP-3-AC12 | Navigation destination semantics unchanged |
| VP-3-AC13 | Desktop / Tablet portrait / Tablet landscape regression none |
| VP-3-AC14 | Keyboard-only flow PASS |
| VP-3-AC15 | SharePoint / Graph requests = 0 (synthetic smoke) |
| VP-3-AC16 | console errors = 0 |

## 11. Required evidence (when Implementation Start is later authorized)

- SCSS/token diff limited to changed-area candidate
- Root: `npm test` / `typecheck` / relevant a11y or existing procedure tests as applicable
- Synthetic browser smoke covering Shell chrome + field workflow (reuse existing `spfx/smoke/shell-ux-*` / `field-workflow-ui` patterns; no live tenant I/O)
- Keyboard focus pass on tabs, site/demo radios, result radios, primary/secondary/back
- Explicit check that save/nav/correction/cancellation handlers and disabled predicates are untouched (diff review)

## 12. Visual target

```text
BEFORE: per-screen button/radio/tab designs
AFTER:  same app, same control family
Priority on tablet: selected / enabled / primary / focus are immediately obvious
Not a goal: louder decoration
```

## 13. Rollback boundary

If a later Implementation Start PR is authorized and must be rolled back,
rollback is limited to presentation SCSS/className/token mixin changes in the
changed-area candidate. Rollback must not alter domain, persistence, nav
semantics, auth, fixtures, SharePoint, Graph, Deploy, or Issue state.

This definition document alone has no runtime effect; removing it restores the
pre-definition documentation set.

## 14. HOLD / STOP

| Item | Status |
|---|---|
| Exact Scope Definition | **COMPLETE** (this document) |
| Definition Review | **NEXT** (Human) |
| Implementation Start | **NOT AUTHORIZED** |
| Code / SCSS / TSX / smoke mutation | **STOP** until Implementation Start GO |

## 15. Next Human gate

1. Human **VP-3 Definition Review** against this Exact Scope
2. If accepted → Human **VP-3 Implementation Start GO** (scoped to §7 + §10)
3. Until GO: agents **STOP** — no SCSS/TSX/token edits, no smoke rewrites, no Issue close/Ready/Merge

```text
VP-3 EXACT SCOPE DEFINITION: COMPLETE
Repository mutation for implementation: NONE
Implementation Start: NOT AUTHORIZED
```
