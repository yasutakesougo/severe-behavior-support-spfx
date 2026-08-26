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
definition status: DRAFT / REVIEW HOLD
implementation: NOT AUTHORIZED
implementation start: NOT AUTHORIZED
ready / merge / deploy / production binding / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
```

## 1. Purpose

Define one smallest local Product UI candidate that may translate the already-observed coss empty-state hierarchy pattern without importing external components, code, CSS, assets, dependencies, runtime, token authority, or interaction semantics.

This Definition is boundary work only. It does not change Product UI.

The selected local problem is limited to the `DailyRecords` **未完了確認 zero-result presentation**.

## 2. Why this local problem is selected

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

## 3. External evidence binding and revalidation

The recommendation basis is `KI-UI-007`.

Observed source identity:

```text
canonical repository: https://github.com/cosscom/coss
observed commit: 19620ae8cae81e30775f2cde03829326cb4916b2
exact source: apps/ui/registry/default/particles/p-empty-1.tsx
observed blob: 34e45e3e5524b6bba32213f5c14d6b943140d533
```

At Definition start, the exact observed commit/file remains retrievable and the current source file still expresses the same material pattern:

```text
primary statement
supporting description
optional bounded action area
```

Only that abstract relationship is admitted.

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

If external evidence is used again after this Definition and its source identity or material pattern cannot be proven equivalent, re-evaluation is required before Implementation Start.

## 4. Existing local authorities remain superior

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

## 5. Exact candidate objective

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

## 6. Exact future implementation surface

A later, separately authorized Human Implementation Start GO may modify only:

```text
spfx/src/shell/records/DailyRecords.tsx
spfx/src/shell/records/daily-record-copy.ts
spfx/src/shell/records/daily-record.test.ts
```

No other path is authorized by this Definition.

If implementation cannot be completed within these three paths, STOP and require a new scope decision.

## 7. Expected implementation shape — non-authoritative guidance

The exact code form is not locked by this Definition, but any implementation must satisfy the following deterministic presentation behavior:

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

## 8. Frozen behavior

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

## 9. Explicit OUT

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
fixture/domain schema expansion
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

## 10. Acceptance criteria for a later Implementation Start

A later implementation is acceptable only if all of the following hold:

### AC-1 — exact scope

Only the three authorized files are changed.

### AC-2 — contradictory hint removed only from zero-result path

When `incompleteItems.length === 0`, the ordinary selection instruction is not rendered.

When `incompleteItems.length > 0`, the ordinary selection instruction remains unchanged.

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

### AC-7 — verification

At minimum:

```text
focused daily-record tests PASS
existing accessibility gate PASS
existing UI semantic/catalog/template verification PASS where applicable
typecheck PASS
lint PASS
format check PASS
```

Any browser/rendered evidence, if used, must remain synthetic and must not require LIVE I/O.

## 11. Source revalidation gate before implementation

Before a later Human Implementation Start GO is consumed, verify:

```text
KI-UI-007 still exists as OBSERVED / PATTERN_REFERENCE
observed coss exact commit/file/blob remains retrievable
current material pattern is not materially incompatible with the observed recommendation
local EmptyNotice / DailyRecords / INV-17 authorities have not materially changed
```

If any required identity or local authority cannot be proven:

```text
HOLD_UNKNOWN
→ no implementation
```

If a new local contract conflicts with this Definition:

```text
local contract wins
→ this candidate is stale
→ new Definition or correction required
```

## 12. Definition status and stop condition

```text
Slice D Candidate Exact Slice Definition-1: DRAFT / REVIEW HOLD
Definition materialization: AUTHORIZED / CONSUMED
Implementation Start: NOT AUTHORIZED
Product code mutation: NOT AUTHORIZED
Ready: NOT AUTHORIZED
Merge: NOT AUTHORIZED
Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED

NEXT:
UI-EXTERNAL-INTELLIGENCE-V1
Slice D — Candidate Exact Slice Independent Definition Review-1
```
