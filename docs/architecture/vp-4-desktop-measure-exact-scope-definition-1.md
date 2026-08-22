# VP-4 Exact Scope Definition — Desktop Measure / Typography / Spacing

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: VP-4 — Desktop typography / max-width / spacing convergence
Kind: read-only Exact Scope Definition
MODE: READ-ONLY DEFINITION
BASE: main@c7b9bbdc886fabdd53382a932bc49f1564b3e94c
Definition Correction-1: APPLIED (P1-1 + P2-1)
Definition status: CORRECTED / AWAITING FOCUSED RE-REVIEW
Code / fixture / schema mutation: NOT AUTHORIZED
Issue mutation: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED / NOT ELIGIBLE YET
Deploy / SharePoint / Graph / Entra: FORBIDDEN
NEXT: VP-4 Definition focused Re-Review
then, if accepted: VP-4 Implementation Start GO
Agent: STOP on implementation
```

## 0. Correction-1 (closes Definition Review HOLD)

Consumed review against BASE `c7b9bbd`:

| ID | Severity | Status | Correction |
|---|---|---|---|
| P1-1 | P1 | **CLOSED** | Do not apply 72rem (or any desktop measure) to shared `.shellMain` / `.readyRegion`. Apply measure only to explicitly in-scope surfaces. `ShellUx.module.scss` is allowed only with role/surface-scoped selectors that cannot change OUT surfaces; otherwise ShellUx is not required. |
| P2-1 | P2 | **CLOSED** | 72rem is an **upper bound**, not a mandatory fixed width. Desktop primary work-surface uses `width: 100%` and `max-width: ≤ 72rem`. Exact value per surface from existing tokens / visual evidence, never exceeding 72rem. |

Prior Definition Review items that remain PASS (unchanged by Correction-1):

```text
Typography token reuse (page-title / section-title / body / meta): PASS
Spacing hierarchy (space-6 / 4 / 2-3 / 1): PASS
Tablet <=768px preservation: PASS
390px preservation: PASS
VP-3 control-state freeze: PASS
VP-5 CTA priority OUT: PASS
VP-6 copy/date OUT: PASS
Domain / persistence / handler freeze: PASS
200% zoom / keyboard / console / no-live-I/O evidence requirements: PASS
```

## 1. Naming / series boundary

Residual visual wave after:

- VP-1 demo chrome separation
- VP-2 staff-visible technical copy cleanup
- VP-3 control-family unification (`#496` @ `c7b9bbd`)

Not the legacy `docs/architecture/visual-polish-4-workflow-*` Users/Workflow polish series.

Canonical path:

```text
docs/architecture/vp-4-desktop-measure-exact-scope-definition-1.md
```

## 2. Exact objective

Converge **Desktop** presentation for in-scope work surfaces on:

- typography roles (existing tokens)
- spacing hierarchy (existing tokens)
- primary work-surface measure (`width: 100%`; `max-width ≤ 72rem`)

without redesigning controls (VP-3), CTA priority (VP-5), or copy/datetime (VP-6).

```text
目標 = Desktop measure / type / spacing convergence on named surfaces
目標 ≠ new visual design system
目標 ≠ global Shell chrome width rewrite
目標 ≠ ADMIN/AUDIT surface redesign
目標 ≠ CTA priority / status badge redesign (VP-5)
目標 ≠ 日本語日時・文言 (VP-6)
目標 ≠ domain / persistence / handlers / nav destinations
```

## 3. Authority consumed (do not redefine)

| Authority | Role for VP-4 |
|---|---|
| VP-1 foundations tokens | page-title / section-title / body / meta; space-1..6; surface/border |
| VP-3 control-family | selected / hover / focus / disabled / button hierarchy **frozen** |
| `ui-visual-hierarchy-contract-1.md` | EMPHASIS vs `SBS_ACTION` namespaces unchanged |
| FIELD_STAFF Form existing responsive rules | Tablet / 390px patterns preserved; Desktop converges onto them |

## 4. In-scope surfaces (explicit)

Desktop measure / typography / spacing may be applied **only** to:

| Surface | Primary style module |
|---|---|
| Procedure Record Form | `spfx/src/shell/procedure/ProcedureRecordFormUx.module.scss` |
| Procedure Record Correction | `spfx/src/shell/procedure/ProcedureRecordCorrectionUx.module.scss` |
| Procedure Record Cancellation | same CorrectionUx module (shared) |
| Support Plan Management List | `spfx/src/shell/users/SupportPlanManagementListUx.module.scss` |
| Support Plan Management Next Surface | same ListUx module (`.nextSurface`) |

JSX className / wrapper changes are conditional and minimal (semantic grouping only).

## 5. Max-width authority (Correction-1 / P1-1)

### Forbidden

```text
DO NOT apply 72rem (or any desktop measure) directly to shared:
  .shellMain
  .readyRegion
  other shared Shell chrome that hosts FIELD_STAFF + PLANNER + ADMIN/AUDIT
```

Shared Shell hosts multiple roles/destinations. A global measure on those wrappers **leaks** into OUT surfaces (ADMIN/AUDIT and other non-listed destinations).

### Required

```text
DO apply desktop measure to the explicitly in-scope surface roots only, e.g.:
  .procedureRecordForm
  .correction  (Correction + Cancellation host)
  .list / .nextSurface  (Support Plan Management)
  or equivalent surface-root selectors in those modules
```

### ShellUx.module.scss

```text
ShellUx modification:
  only if a role/surface-scoped selector can be proven not to change OUT surfaces
  otherwise ShellUx is NOT required for VP-4
```

Default expectation: **ShellUx unchanged**.

## 6. Desktop measure rule (Correction-1 / P2-1)

```text
Desktop primary work-surface:
  width: 100%
  max-width: <= 72rem   (upper bound)

Exact max-width value:
  choose per surface from existing token / visual evidence
  MUST NOT exceed 72rem
  MUST NOT force every surface to exactly 72rem
```

Rationale: PLANNER list/KPI rows and FIELD_STAFF Form currently use `max-width: 100%` and consume available width. Forcing every surface to a fixed 72rem prioritizes a number over Before/After acceptance.

## 7. Typography

Reuse existing tokens only (no new type scale):

```text
page-title
section-title
body
meta
```

Align in-scope surfaces to these roles where gaps remain. Do not invent off-scale font sizes.

## 8. Spacing

Reuse existing hierarchy:

```text
space-6   major section gap / page padding candidate
space-4   section internal
space-2..3  control / cluster gaps
space-1   tight meta / hint gaps
```

No mass remapping of unrelated screens. No new spacing tokens unless a single shared alias is required to avoid divergent hard-coded rem (prefer reuse).

## 9. Responsive preservation

```text
Tablet portrait / landscape and @media (max-width: 768px): PRESERVE
~390px field rules: PRESERVE
Desktop convergence must not regress tablet / 390 behavior
```

## 10. Explicit OUT

```text
ADMIN / AUDIT specific surfaces and role chrome
global .shellMain / .readyRegion measure
VP-3 control-state redesign (selected/hover/focus/disabled/button hierarchy)
VP-5 status badge / CTA priority information design
VP-6 日本語日時・文言改善
domain / persistence / save-state semantics
navigation destination / selected-state logic
correction / cancellation authorization
handlers / onClick / disabled predicates
auth / Entra / fixture / SharePoint / Graph / Deploy
new large design system / Storybook SSOT
```

## 11. Hard boundary (semantics freeze)

Visual measure/type/spacing changes must **not** change:

- enabled / disabled conditions
- handlers / save state transitions
- correction / cancellation authorization
- navigation destinations
- VP-3 control interaction language

## 12. Changed-area candidate (mutation not authorized by this definition)

**Primary (expected):**

```text
spfx/src/shell/procedure/ProcedureRecordFormUx.module.scss
spfx/src/shell/procedure/ProcedureRecordCorrectionUx.module.scss
spfx/src/shell/users/SupportPlanManagementListUx.module.scss
```

**Conditional:**

```text
spfx/src/shell/tokens/*          light aliases only if needed to avoid divergent rem
spfx/src/shell/ux/ShellUx.module.scss
  ONLY with role/surface-scoped selectors that exclude OUT surfaces
  default: do not change
ProcedureRecordForm.tsx / Correction.tsx / Cancellation.tsx
SupportPlanManagementList.tsx / SupportPlanManagementNextSurface.tsx
  className / wrapper only
```

## 13. Acceptance Criteria

| ID | Criterion |
|---|---|
| VP-4-AC1 | In-scope surfaces use page-title / section-title / body / meta roles consistently |
| VP-4-AC2 | In-scope surfaces follow space-6 / 4 / 2-3 / 1 hierarchy without off-scale invent |
| VP-4-AC3 | Desktop in-scope roots use `width: 100%` and `max-width ≤ 72rem` |
| VP-4-AC4 | Exact max-width may be surface-specific; not forced equal to 72rem on every surface |
| VP-4-AC5 | Shared `.shellMain` / `.readyRegion` desktop measure **unchanged** (no scope leakage) |
| VP-4-AC6 | ADMIN/AUDIT and other OUT surfaces show no intentional VP-4 measure/type/spacing delta |
| VP-4-AC7 | Tablet ≤768 and 390px rules preserved on touched surfaces |
| VP-4-AC8 | VP-3 control selected/hover/focus/disabled/button visuals unchanged |
| VP-4-AC9 | Handlers / disabled predicates / save semantics unchanged |
| VP-4-AC10 | Navigation destination semantics unchanged |
| VP-4-AC11 | Desktop / Tablet portrait / Tablet landscape regression none on in-scope paths |
| VP-4-AC12 | Keyboard-only flow PASS on touched surfaces |
| VP-4-AC13 | SharePoint / Graph requests = 0 (synthetic smoke) |
| VP-4-AC14 | console errors = 0 |

## 14. Required evidence (when Implementation Start is later authorized)

- Diff limited to changed-area candidate; prove no global `.shellMain` / `.readyRegion` measure change
- Root `format:check` / `typecheck` / `npm test` as applicable; `spfx` heft when SCSS touched
- Synthetic smokes covering Record Form, Correction/Cancellation, Support Plan Management List/Next
- Desktop + tablet + 390 evidence; keyboard + console 0 + no live I/O
- Explicit review that VP-3 control rules and handlers are untouched

## 15. Visual target

```text
BEFORE: Desktop in-scope surfaces stretch full shell width / uneven type+spacing density
AFTER:  same surfaces read as one Desktop work measure (≤72rem) with shared type/spacing roles
Not a goal: louder decoration, new component family, global Shell squeeze
```

## 16. Rollback boundary

Later implementation rollback is limited to presentation SCSS/className/token alias changes on in-scope modules. Must not alter domain, persistence, nav, auth, fixtures, SharePoint, Graph, Deploy, or Issue state.

This definition document alone has no runtime effect.

## 17. HOLD / STOP

| Item | Status |
|---|---|
| Exact Scope Definition | **CORRECTED** (Correction-1 applied) |
| Focused Definition Re-Review | **NEXT** (Human) |
| Implementation Start | **NOT AUTHORIZED / NOT ELIGIBLE** until Re-Review PASS + GO |
| Code / SCSS / TSX mutation | **STOP** |

## 18. Next Human gate

1. Human **VP-4 Definition focused Re-Review** (P1-1 / P2-1 closure only + regression of prior PASS items)
2. If accepted → Human **VP-4 Implementation Start GO**
3. Until GO: agents **STOP** — no SCSS/TSX/token edits, no smoke rewrites, no Issue close/Ready/Merge/Deploy

```text
VP-4 DEFINITION CORRECTION-1: COMPLETE
P1-1: CLOSED
P2-1: CLOSED
Repository mutation for implementation: NONE
Implementation Start: NOT AUTHORIZED
```
