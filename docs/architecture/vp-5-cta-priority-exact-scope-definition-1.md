# VP-5 Exact Scope Definition — Status Presentation Priority / CTA Priority

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: VP-5 — status presentation priority + CTA visual priority
Kind: read-only Exact Scope Definition
MODE: READ-ONLY DEFINITION
BASE: main@1b3b59f4b64cfb4ee600ac9885944de6f1c5eb5b
Definition Correction-1: APPLIED (P1-1 + P1-2 + P2-1)
Definition status: CORRECTED / AWAITING FOCUSED RE-REVIEW
Code / fixture / schema mutation: NOT AUTHORIZED
Issue mutation: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED / NOT ELIGIBLE YET
Deploy / SharePoint / Graph / Entra: FORBIDDEN
NEXT: VP-5 Definition focused Re-Review
then, if accepted: VP-5 Implementation Start GO
Agent: STOP on implementation
```

## 0. Correction-1 (closes Definition Review HOLD)

Consumed Human Definition Review against BASE `1b3b59f`
(draft Definition reviewed off-tree; this file is the first repository-canonical Exact Scope Definition,
with Correction-1 already applied):

| ID | Severity | Status | Correction |
|---|---|---|---|
| P1-1 | P1 | **CLOSED** | **Option A selected.** Shared Shell save-state presentation hierarchy is explicit **IN** for VP-5. Role-cross-cutting refinement of the existing 5-state presentation (QUIET / EMPHASIZED + per-state feedback colors) is authorized. FIELD_STAFF-only scope with role-scoped selectors is **not** the selected path. |
| P1-2 | P1 | **CLOSED** | VP-5 status categories (`STATUS-NEUTRAL` / `STATUS-ATTENTION` / `STATUS-CRITICAL`) are **presentation priority labels only**. They MUST NOT replace, rename, or collapse the authoritative 5-state vocabulary. Required mapping is locked in §6. |
| P2-1 | P2 | **CLOSED** | Primary CTA rule is decision-state qualified: *At any given decision state within one business surface, there should ordinarily be no more than one visually dominant forward CTA.* Not “one primary for the entire screen lifetime.” |

Prior Definition Review items that remain PASS (unchanged by Correction-1):

```text
PLANNER Primary / Secondary / Tertiary visual separation strengthen-only: PASS
VP-3 interaction-state freeze: PASS
VP-4 desktop measure freeze: PASS
handlers / disabled predicates freeze: PASS
navigation semantics freeze: PASS
KPI derivation freeze: PASS
today-action derivation freeze: PASS
VP-6 wording/datetime OUT: PASS
SharePoint / Graph / Entra / Deploy OUT: PASS
```

## 1. Naming / series boundary

Residual visual wave after:

- VP-1 demo chrome separation
- VP-2 staff-visible technical copy cleanup
- VP-3 control-family unification (`#496`)
- VP-4 desktop measure / typography / spacing (`#498` @ `1b3b59f`)

Not legacy `docs/architecture/visual-polish-*` series numbering collisions.

Canonical path:

```text
docs/architecture/vp-5-cta-priority-exact-scope-definition-1.md
```

## 2. Exact objective

Strengthen **presentation priority** so staff can see:

1. which save/status feedback deserves attention (without changing 5-state meaning)
2. which forward CTA is visually dominant at the current decision state

without redesigning control interaction language (VP-3), desktop measure (VP-4), or copy/datetime (VP-6).

```text
目標 = status presentation priority + CTA visual priority on named surfaces
目標 ≠ new save-state vocabulary / collapse of 5-state meaning
目標 ≠ new CTA business actions / handler / disabled predicate changes
目標 ≠ VP-3 selected/hover/focus/disabled redesign
目標 ≠ VP-4 measure / type / spacing redesign
目標 ≠ VP-6 日本語日時・文言
目標 ≠ domain / persistence / nav destinations / KPI / today-action derivation
目標 ≠ SharePoint / Graph / Entra / Deploy
```

## 3. Authority consumed (do not redefine)

| Authority | Role for VP-5 |
|---|---|
| `spfx/src/shell/ux/save-state.ts` | **5-state vocabulary + QUIET/EMPHASIZED emphasis is SSOT.** Labels, descriptions, aria-live, non-rounding of `save_outcome_unknown` are frozen. |
| DEMO-UX-12 / SHELL-UX-2 save-badge hierarchy | QUIET vs EMPHASIZED hierarchy already shared; VP-5 may refine visual priority **within** that contract |
| `ui-visual-hierarchy-contract-1.md` H-05 | `SBS_ACTION.primary/secondary/tertiary` = CTA visual weight only; not EMPHASIS ranks |
| VP-3 control-family | selected / hover / focus / disabled / button family **interaction language frozen**; VP-5 may only adjust relative visual dominance among already-classified actions |
| VP-4 desktop measure | measure / type / spacing on in-scope surfaces **frozen** |
| Record Form button hierarchy | Save = primary visual; Next = secondary; Back = tertiary — semantic wiring frozen |

## 4. In-scope surfaces (explicit)

| Surface | What VP-5 may adjust | Primary style / presentation module |
|---|---|---|
| Shared Shell save-state presentation | Visual priority within existing 5-state + QUIET/EMPHASIZED (Correction-1 / P1-1 Option A) | `ShellUx.module.scss` (`.saveStateBadge*`, `.saveState_*`), `SaveStateBadge.tsx` / `SaveStatePresentation.tsx` (className / presentation-only) |
| Procedure Record Form CTAs | Relative visual dominance among existing Save / Next / Back families | `ProcedureRecordFormUx.module.scss` |
| Procedure Record Correction / Cancellation CTAs | Same: strengthen existing Primary / Secondary / Tertiary (or Back) separation | `ProcedureRecordCorrectionUx.module.scss` |
| Support Plan Management (PLANNER) action family | Strengthen existing Primary / Secondary / Tertiary visual separation only | `SupportPlanManagementListUx.module.scss` (+ related PLANNER action classNames if already present) |

JSX changes are conditional and minimal (className / `data-sbs-action` alignment only). No new business actions.

## 5. Save-state scope authority (Correction-1 / P1-1 — Option A)

### Selected path

```text
Shared Shell save-state hierarchy = explicit IN for VP-5
Role横断: FIELD_STAFF + PLANNER + other roles that consume SaveStatePresentation
get the same refined 5-state presentation priority
```

Rationale at BASE `1b3b59f`:

- `SaveStatePresentation` / `SaveStateBadge` are shared Shell chrome
- DEMO-UX-12 QUIET / EMPHASIZED mapping is already role-cross-cutting
- A FIELD_STAFF-only rewrite would fight the shared surface and invite divergent badge languages

### Forbidden alternatives (not selected)

```text
DO NOT treat save-state as FIELD_STAFF-only while listing ShellUx .saveStateBadge* as PRIMARY
DO NOT invent role-private badge vocabularies that diverge from ShellSaveState
```

Option B (FIELD_STAFF-only + role/surface-scoped selectors + ban on global `.saveStateBadge*` rewrite) is **explicitly not selected**.

### ShellUx.module.scss

```text
ShellUx .saveStateBadge* / .saveState_* changes:
  AUTHORIZED for VP-5 under Option A
  MUST preserve 5-state meaning and required mapping in §6
  MUST NOT change label / description / aria-live contracts in save-state.ts
    unless a later separate Decision authorizes copy (that is VP-6 / OUT here)
```

## 6. Status categories vs 5-state authority (Correction-1 / P1-2)

### Authority order

```text
1. ShellSaveState 5-state vocabulary = AUTHORITY
   unsaved | saving | saved | save_failed | save_outcome_unknown

2. Existing emphasisForShellSaveState QUIET / EMPHASIZED = AUTHORITY

3. VP-5 STATUS-* categories = presentation priority shorthand ONLY
   MUST NOT replace or collapse (1) or (2)
```

### Required mapping (LOCKED)

| ShellSaveState | VP-5 presentation shorthand | Visual intent (must preserve distinction) |
|---|---|---|
| `unsaved` | STATUS-NEUTRAL | quiet / neutral |
| `saving` | STATUS-ATTENTION *(informational progress)* | observable-progress / informational — **NOT** attention-as-failure |
| `saved` | STATUS-NEUTRAL | quiet / neutral |
| `save_failed` | STATUS-CRITICAL *(danger)* | emphasized / danger |
| `save_outcome_unknown` | STATUS-CRITICAL *(warning)* | emphasized / warning |

```text
save_failed ≠ save_outcome_unknown
  danger vs warning feedback tokens MUST remain distinct

saving ≠ failure
  saving MUST remain informational progress (EMPHASIZED + info),
  not STATUS-CRITICAL and not collapsed into save_failed

STATUS-CRITICAL is a shorthand bucket for “needs staff notice”,
NOT a license to unify save_failed and save_outcome_unknown visuals
```

### Forbidden

```text
DO NOT invent a 6th save state
DO NOT round save_outcome_unknown → save_failed or saved
DO NOT treat STATUS-* as domain / persistence / adapter vocabulary
DO NOT change emphasisForShellSaveState quiet/emphasized membership
  without a separate Decision that supersedes DEMO-UX-12
```

CSS color authority at BASE (preserve):

```text
save_failed           → feedback-danger
save_outcome_unknown  → feedback-warning
saving                → feedback-info
saved / unsaved       → quiet (transparent / subtle)
```

## 7. Primary CTA rule (Correction-1 / P2-1)

### Locked wording

```text
At any given decision state within one business surface,
there should ordinarily be no more than one visually dominant forward CTA.
```

### Implications

```text
ALLOWED:
  pre-save dominant CTA = Save
  post-save dominant CTA = Next (or equivalent forward)
  without changing which handlers / disabled predicates exist

FORBIDDEN interpretation:
  “the whole screen may only ever declare one primary for its entire lifetime”
  (that would force semantic rewiring when Save and Next both exist)
```

Aligns with H-05 (`SBS_ACTION.primary` weight) and Record Form evidence at BASE:
`saveButton` (primary visual) + `nextOccurrenceButton` (secondary) + `backButton` (tertiary).

Correction / Cancellation action families likewise keep Save / Secondary / Back separation;
VP-5 strengthens visual dominance per decision state, does not invent new actions.

## 8. PLANNER CTA family (PASS retained)

Existing PLANNER Primary / Secondary / Tertiary separation is already present.
VP-5 may **strengthen visual difference only**. It must not:

- add/remove row actions
- change `actionKind` / navigation targets
- change KPI or today-action derivation

## 9. Explicit OUT

```text
VP-3 control selected/hover/focus/disabled redesign
VP-4 desktop measure / typography / spacing redesign
VP-6 日本語日時・文言改善
new ShellSaveState values / meaning changes
collapsing save_failed with save_outcome_unknown
handlers / onClick / disabled predicates
navigation destination / selected-state logic
KPI derivation / today-action derivation
correction / cancellation authorization
domain / persistence / adapters
auth / Entra / fixture / SharePoint / Graph / Deploy
ADMIN/AUDIT-only chrome redesign beyond shared save-state (Option A applies shared badge only)
new large design system / Storybook SSOT
```

## 10. Hard boundary (semantics freeze)

Visual priority changes must **not** change:

- enabled / disabled conditions
- handlers / save-state transitions / persistence
- correction / cancellation authorization
- navigation destinations
- VP-3 control interaction language
- VP-4 measure / type / spacing
- 5-state vocabulary, labels, descriptions, aria-live, QUIET/EMPHASIZED membership

## 11. Changed-area candidate (mutation not authorized by this definition)

**Primary (expected):**

```text
spfx/src/shell/ux/ShellUx.module.scss
  (.saveStateBadge* / .saveState_* presentation priority only)
spfx/src/shell/procedure/ProcedureRecordFormUx.module.scss
spfx/src/shell/procedure/ProcedureRecordCorrectionUx.module.scss
spfx/src/shell/users/SupportPlanManagementListUx.module.scss
```

**Conditional:**

```text
spfx/src/shell/ux/SaveStateBadge.tsx
spfx/src/shell/ux/SaveStatePresentation.tsx
  className / presentation-only wiring; no save-state.ts meaning edits
ProcedureRecordForm.tsx / Correction.tsx / Cancellation.tsx
SupportPlanManagementList.tsx / NextSurface
  className / data-sbs-action alignment only
spfx/src/shell/tokens/*
  light aliases only if needed to express danger≠warning≠info without new systems
```

**Forbidden changed-area (without separate Decision):**

```text
spfx/src/shell/ux/save-state.ts          meaning / mapping / labels / aria
domain / adapters / persistence
KPI / today-action / next-occurrence derivation logic
```

## 12. Acceptance Criteria

| ID | Criterion |
|---|---|
| VP-5-AC1 | Shared save-state presentation refined consistently across roles that consume `SaveStatePresentation` (Option A) |
| VP-5-AC2 | All five `ShellSaveState` values remain distinct in `data-save-state` / labels; no rounding |
| VP-5-AC3 | `unsaved` / `saved` remain quiet / STATUS-NEUTRAL |
| VP-5-AC4 | `saving` remains informational EMPHASIZED progress (not failure styling) |
| VP-5-AC5 | `save_failed` remains danger EMPHASIZED; `save_outcome_unknown` remains warning EMPHASIZED; visuals stay distinguishable |
| VP-5-AC6 | At each decision state on in-scope surfaces, ordinarily ≤1 visually dominant forward CTA |
| VP-5-AC7 | Record Form Save vs Next vs Back visual hierarchy preserved or strengthened; handlers unchanged |
| VP-5-AC8 | Correction / Cancellation action families preserve Save / Secondary / Back roles; handlers unchanged |
| VP-5-AC9 | PLANNER Primary / Secondary / Tertiary visual separation strengthened only; action set unchanged |
| VP-5-AC10 | VP-3 control selected/hover/focus/disabled language unchanged |
| VP-5-AC11 | VP-4 measure / type / spacing unchanged |
| VP-5-AC12 | Handlers / disabled predicates / nav destinations / KPI / today-action derivation unchanged |
| VP-5-AC13 | SharePoint / Graph requests = 0 (synthetic smoke) |
| VP-5-AC14 | console errors = 0; keyboard-only flow PASS on touched surfaces |

## 13. Required evidence (when Implementation Start is later authorized)

- Diff limited to changed-area candidate; prove `save-state.ts` meaning untouched
- Explicit Before/After for all five save states (danger ≠ warning ≠ info ≠ quiet)
- Decision-state CTA dominance evidence (e.g. unsaved → Save dominant; post-save → Next dominant) without handler diffs
- PLANNER action-family strengthen-only evidence
- Root `format:check` / `typecheck` / `npm test` as applicable; `spfx` heft when SCSS/TSX touched
- Synthetic smoke: no live I/O; keyboard + console 0
- Explicit review that VP-3 / VP-4 freezes hold

## 14. Visual target

```text
BEFORE: status / CTA priority sometimes ambiguous relative to business content;
        risk of reading STATUS-* as a new authority over 5-state
AFTER:  shared 5-state presentation priority is clear (quiet vs info vs danger vs warning);
        each decision state has one ordinary dominant forward CTA
Not a goal: new badge system, new actions, louder decoration, role-private save chrome
```

## 15. Rollback boundary

Later implementation rollback is limited to presentation SCSS/className/token alias changes on in-scope modules. Must not alter domain, persistence, nav, auth, fixtures, SharePoint, Graph, Deploy, Issue state, or `save-state.ts` meaning.

This definition document alone has no runtime effect.

## 16. HOLD / STOP

| Item | Status |
|---|---|
| Exact Scope Definition | **CORRECTED** (Correction-1 applied) |
| Focused Definition Re-Review | **NEXT** (Human) |
| Implementation Start | **NOT AUTHORIZED / NOT ELIGIBLE** until Re-Review PASS + GO |
| Code / SCSS / TSX mutation | **STOP** |

## 17. Next Human gate

1. Human **VP-5 Definition focused Re-Review** (P1-1 / P1-2 / P2-1 closure only + regression of prior PASS items)
2. If accepted → Human **VP-5 Implementation Start GO**
3. Until GO: agents **STOP** — no SCSS/TSX/token edits, no smoke rewrites, no Issue close/Ready/Merge/Deploy

```text
VP-5 DEFINITION CORRECTION-1: COMPLETE
P1-1: CLOSED (Option A — shared save-state IN)
P1-2: CLOSED (5-state authority; STATUS-* shorthand only)
P2-1: CLOSED (decision-state primary CTA qualification)
Repository mutation for implementation: NONE
Implementation Start: NOT AUTHORIZED
```
