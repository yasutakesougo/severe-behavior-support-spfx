# UI-EXTERNAL-INTELLIGENCE-V1 — Slice D Empty-State Exact Slice Definition-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: UI-EXTERNAL-INTELLIGENCE-V1-SLICE-D-EMPTY-STATE-EXACT-SLICE-DEFINITION-1
kind: candidate exact-slice definition
parent: Issue #518 UI-EXTERNAL-INTELLIGENCE-V1
basis main: 8071a4b339a8d9d9ec5ad2987b6735a499f55d74
external intelligence basis: KI-UI-007 / OBSERVED / PATTERN_REFERENCE
source evaluation intent: PATTERN_TRANSLATION
source terminal recommendation: REFERENCE_ACCEPTED_TRANSLATE_ONLY
human candidate selection: RECEIVED / CONSUMED
selected local problem: DailyRecords — 未完了確認 zero-result presentation
selected pattern: KI-UI-007 — empty-state primary statement + supporting description
independent definition review-1: CORRECTION REQUIRED / P0=0 / P1=3 / P2=0 / CONSUMED
definition correction-1: APPLIED / RE-REVIEW HOLD
definition status: CORRECTED / RE-REVIEW HOLD
implementation: NOT AUTHORIZED
implementation start: NOT AUTHORIZED
ready / merge / deploy / production binding / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
```

## 1. Purpose

Define one smallest local Product UI candidate that may translate the already-observed coss empty-state hierarchy pattern without importing external components, code, CSS, assets, dependencies, runtime, token authority, or interaction semantics.

This Definition is boundary work only. It does not change Product UI.

The selected local problem is limited to the `DailyRecords` **未完了確認 zero-result presentation**.

## 2. Human Candidate Selection

The Human explicitly selected the following candidate for Slice D:

```text
Human Candidate Selection:
DailyRecords — 未完了確認 zero-result presentation

Selected Pattern:
KI-UI-007 — empty-state primary statement + supporting description
```

This satisfies the parent Slice D prerequisite that one local problem / pattern be selected before an Exact Slice proceeds.

The Human selection means only that this candidate may be defined and independently reviewed. It does not grant any of the following:

```text
KI-UI-007 promotion
Product UI authority
Implementation Start
Product code mutation
external code / CSS / asset / copy reuse
new dependency authority
Ready / Merge authority
Deploy / Production Binding / LIVE WRITE authority
```

`KI-UI-007` remains `OBSERVED / PATTERN_REFERENCE / Authority NONE` unless separately promoted under its own governance path.

## 3. Local problem being solved

Current `DailyRecords` renders the ordinary non-empty instruction before branching on whether `incompleteItems` is empty:

```text
未完了確認から対象を選ぶと、下の記録入力イメージが追随します。
```

When `incompleteItems.length === 0`, the same screen then renders the existing zero-result message:

```text
表示する未完了確認はありません（合成データ）。
業務上の未完了が無いことを示すものではありません。
```

Therefore the zero-result path can simultaneously tell the user to select an item and tell the user that no selectable item exists.

This is a presentation hierarchy / copy-state mismatch only. It does not require a new domain state, workflow state, persistence behavior, status vocabulary, CTA, navigation route, or external dependency.

## 4. External evidence binding and Correction-1 revalidation

The recommendation basis is `KI-UI-007`.

### 4.1 Observed source identity

```text
canonical repository: https://github.com/cosscom/coss
observed ref / commit: 19620ae8cae81e30775f2cde03829326cb4916b2
observed exact file: apps/ui/registry/default/particles/p-empty-1.tsx
observed blob: 34e45e3e5524b6bba32213f5c14d6b943140d533
```

### 4.2 Current upstream identity at Correction-1

At Definition Correction-1, bounded read-only revalidation established:

```text
current upstream ref: refs/heads/main
current upstream commit: 19620ae8cae81e30775f2cde03829326cb4916b2
current exact file: apps/ui/registry/default/particles/p-empty-1.tsx
current blob: 34e45e3e5524b6bba32213f5c14d6b943140d533
comparisonResult: EXACT_IDENTITY_MATCH
```

The current upstream branch resolves to the same immutable commit used for the observation, and the exact file resolves to the same blob.

Only the following abstract relationship is admitted:

```text
primary statement
supporting description
optional bounded action area
```

This candidate uses only the first two elements because no local zero-result action is authorized.

The following external details are explicitly rejected for this candidate:

```text
coss component source
Empty / EmptyHeader / EmptyContent runtime
lucide icon use
Button composition
Tailwind classes
Base UI / shadcn architecture
exact source text
source spacing / token values
source two-button action composition
```

### 4.3 Implementation-time source revalidation

Immediately before any later Human Implementation Start GO may be consumed, capture and compare all of the following again:

```text
observed ref / commit
observed exact file
observed blob
current upstream ref
current upstream commit
current exact file
current blob
```

Deterministic routing is:

```text
current exact identity == observed exact identity
  → continue to local-contract revalidation

current identity or material changed
  → fresh bounded PATTERN_TRANSLATION re-evaluation required
  → stale recommendation does not carry forward automatically

required current identity cannot be proven
  → HOLD_UNKNOWN
  → no Implementation Start
```

No source code, CSS, icon, asset, copied text, package, or runtime material is approved for reuse by this Definition.

## 5. Existing local authorities remain superior

The following local contracts remain authoritative and unchanged:

```text
Domain / Contracts
DADS application / token contracts
UI Component Catalog
UI Screen Templates
UI Semantic Rules
UI Visual Hierarchy Contract
INV-17 empty-state separation
A11Y-LIVE-01 EmptyNotice live/status behavior
DailyRecords synthetic-only / presentation-only boundaries
existing save-state semantics
existing status vocabulary
existing CTA hierarchy
existing navigation semantics
```

In particular:

```text
EmptyNotice zero-result != retrieval failure
EmptyNotice zero-result != access denied
EmptyNotice zero-result != all-clear business completion
EmptyNotice zero-result != save failure
```

The existing shared `EmptyNotice` primitive remains authoritative and is not redesigned by this slice.

Before any later Implementation Start, the local `EmptyNotice`, `DailyRecords`, INV-17, UI Catalog, and applicable UI hierarchy authorities must also be revalidated against the then-current main. A conflicting newer local contract wins and makes this candidate stale.

## 6. Exact candidate objective

For the `DailyRecords` 未完了確認 section only:

1. Preserve the existing section heading `未完了確認`.
2. Preserve current non-empty behavior exactly when `incompleteItems.length > 0`:
   - show the current selection hint;
   - show the current `SingleSelectListbox`;
   - keep selection and local-draft behavior unchanged.
3. When `incompleteItems.length === 0`:
   - do **not** render the ordinary instruction that tells the user to select an item;
   - render the zero-result message through the existing `EmptyNotice` with `announce=true`;
   - preserve two distinct meanings in the copy:
     - primary zero-result statement: no synthetic incomplete target is displayed;
     - supporting boundary statement: this does not prove that business work has no incomplete items.
4. Do not add an empty-state CTA. There is no authorized local action for this zero-result path.
5. Do not add iconography, illustration, card family, new status badge, new primitive, or new motion.

The external pattern is translated as **information hierarchy only**.

## 7. Exact future implementation and evidence surface

A later, separately authorized Human Implementation Start GO may modify only the following five paths:

```text
spfx/src/shell/records/DailyRecords.tsx
spfx/src/shell/records/daily-record-copy.ts
spfx/src/shell/records/daily-record.test.ts
spfx/smoke/demo-ux-5/smoke-entry.tsx
spfx/smoke/demo-ux-5/run-smoke.mjs
```

The first three paths are the Product-local presentation/copy/test surface.

The two `spfx/smoke/demo-ux-5/*` paths are **synthetic verification harness only**. Their inclusion grants no runtime Product authority, fixture/domain expansion, LIVE I/O, SharePoint access, or deployment authority.

If implementation or deterministic evidence cannot be completed within these five paths, STOP and require a new scope decision.

## 8. Required deterministic rendered evidence

Unit/copy assertions alone are not sufficient to prove the core branch behavior in AC-2.

A later implementation must provide a synthetic rendered/browser-smoke path that deterministically observes both states of the same `DailyRecords` surface.

The smoke harness may introduce one bounded synthetic empty variant in `spfx/smoke/demo-ux-5/smoke-entry.tsx`, for example through a test-only query switch or equivalent local presentation clone where:

```text
incompleteItems: []
```

The exact internal test switch name is not locked by this Definition, but all of the following are mandatory:

```text
synthetic data only
no LIVE I/O
no SharePoint / Graph request
no Product domain/schema expansion
no persistent mutation
no production routing semantics change
```

`spfx/smoke/demo-ux-5/run-smoke.mjs` must directly verify at least:

### Non-empty synthetic state

```text
ordinary selection hint: PRESENT
incomplete selection list: PRESENT
zero-result note for incomplete items: ABSENT
```

### Empty synthetic state

```text
ordinary selection hint: ABSENT
incomplete selection list: ABSENT
zero-result note for incomplete items: PRESENT
primary zero-result statement: PRESENT
supporting synthetic/business-boundary statement: PRESENT
```

This rendered evidence is required to prove that the contradictory instruction is removed only from the zero-result path while the non-empty path remains intact.

## 9. Expected implementation shape — non-authoritative guidance

The exact code form is not locked by this Definition, but any implementation must satisfy:

```text
if incompleteItems.length > 0:
  render existing ordinary selection hint
  render existing SingleSelectListbox

if incompleteItems.length === 0:
  ordinary selection hint is absent
  render existing EmptyNotice(announce=true)
  preserve primary zero-result statement
  preserve supporting synthetic/business-boundary statement
```

The implementation may split the existing empty copy into separately named local copy constants if useful for verification, but must not change its fail-closed meaning.

## 10. Frozen behavior

The following are frozen:

```text
incompleteItems meaning and identity
selectedIncompleteId behavior
findIncompleteItemById behavior
seedLocalDraftForIncompleteItem behavior
SingleSelectListbox semantics
StatusBadge semantics
input/textarea behavior
local draft behavior
record creation/save disabled state
save-state semantics
recentRecords presentation
businessFacts/systemState semantics
INV-17 separation
A11Y-LIVE-01 role=status / aria-live=polite contract
all navigation behavior
all Domain / persistence behavior
all authorization behavior
```

## 11. Explicit OUT

```text
spfx/src/shell/primitives/EmptyNotice.tsx changes
Primitives.module.scss changes
DailyRecordsUx.module.scss changes
shared primitive redesign
new EmptyState component
new card family
new icon / illustration
new CTA or enabled action
new route / navigation
filter-state redesign
ReUI filter pattern implementation
TanStack Table
Tailwind / shadcn / Base UI
new package dependency
React migration
CSS architecture migration
design-token authority change
status semantics change
save-state semantics change
workflow/domain transition change
base fixture/domain schema expansion
SharePoint adapter or physical persistence
SharePoint WRITE
LIVE WRITE
Production Binding
Deploy / Redeploy
App Catalog mutation
M365 / Entra mutation
external code/material reuse
promotion of KI-UI-007 beyond OBSERVED
```

## 12. Acceptance criteria for a later Implementation Start

A later implementation is acceptable only if all of the following hold.

### AC-1 — exact scope

Only the five authorized Product/evidence paths in section 7 are changed.

### AC-2 — contradictory hint removed only from zero-result path

Rendered synthetic evidence proves:

```text
incompleteItems.length === 0
  → ordinary selection instruction is absent
  → incomplete list is absent
  → existing zero-result path is present

incompleteItems.length > 0
  → ordinary selection instruction remains present
  → existing selection list remains present
```

### AC-3 — zero-result semantics preserved

The empty presentation still communicates both:

```text
no synthetic incomplete target is displayed
!=
business work has no incomplete items
```

No `all clear`, success, retrieval-failure, access-denied, or save-failure meaning is introduced.

### AC-4 — EmptyNotice contract preserved

The existing `EmptyNotice announce` path remains the live/status channel.

`A11Y-LIVE-01` must continue to pass.

### AC-5 — no new action authority

No CTA, navigation, save, record creation, mutation, or retry action is added or enabled.

### AC-6 — non-empty behavior preserved

Selection, selected item identity, local draft seed/edit behavior, status labels, and disabled mutation controls remain unchanged.

### AC-7 — deterministic verification

At minimum:

```text
focused daily-record tests: PASS
synthetic demo-ux-5 rendered smoke, both non-empty and empty variants: PASS
existing accessibility gate: PASS
existing UI semantic/catalog/template verification: PASS where applicable
typecheck: PASS
lint: PASS
format check: PASS
```

Copy/unit-only evidence does not satisfy AC-2 by itself.

Any rendered evidence remains synthetic and must require no LIVE I/O.

## 13. Definition status and stop condition

```text
Slice D Candidate Exact Slice Definition-1: CORRECTED / RE-REVIEW HOLD
Human Candidate Selection: RECEIVED / CONSUMED
Independent Definition Review-1: CORRECTION REQUIRED / P0=0 / P1=3 / P2=0 / CONSUMED
Definition Correction-1: APPLIED / CONSUMED
Independent Definition Re-Review-2: REQUIRED / NOT PERFORMED
Definition ACCEPT / LOCK: HOLD
Implementation Start: NOT AUTHORIZED
Product code mutation: NOT AUTHORIZED
Ready: NOT AUTHORIZED
Merge: NOT AUTHORIZED
Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED

NEXT:
UI-EXTERNAL-INTELLIGENCE-V1
Slice D — Candidate Exact Slice Independent Definition Re-Review-2
```
