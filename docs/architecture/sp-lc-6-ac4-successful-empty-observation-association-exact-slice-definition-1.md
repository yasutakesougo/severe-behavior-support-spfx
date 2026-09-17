# SP-LC-6 AC-4 SUCCESSFUL-EMPTY OBSERVATION ASSOCIATION EXACT-SLICE-DEFINITION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Issue: #445 (parent acceptance residual; no Issue mutation / no Close)
Unit: SP-LC-6-AC-4-SUCCESSFUL-EMPTY-OBSERVATION-ASSOCIATION-EXACT-SLICE-DEFINITION-1
Kind: exact-slice definition / scope fixation only (READ ONLY preparation)
Date: 2026-09-17
Baseline main: 2bfc10fa192c39cf737816bcf2f0a8ccfe09a14f
Authority inputs:
  sp-lc-6-synthetic-lifecycle-acceptance-definition-1.md
    Gate NEXT = AC-4 successful-empty Observation association Exact Slice
    AC-4 / AC-7 / AC-9 = OPEN / separate residuals
  sp-lc-6-synthetic-lifecycle-acceptance-evidence.md §12.3
  sbs-445-blocked-residual-exact-repin-1.md (AC-4 ACTIVE on tip)
  #419 / Decision-SUPPORT-PLAN-LIFECYCLE-SEMANTICS-1 / D6=A LOCKED
  sp-lc-4-d6-exact-slice-definition-1.md (association + unresolved delivered;
    successful-empty distinction still open)

Exact Slice Definition status: APPROVED / LOCKED
Definition APPROVE: RECEIVED / LOCKED
  Human: AC-4 successful-empty Observation association Exact Slice
         Human Definition APPROVE
  ReceivedAt: 2026-09-17T05:48:54Z
  Basis: this document
  Scope: AC-4 ONLY
Human Implementation Start GO: NOT AUTHORIZED / NOT CONSUMED
Acceptance re-execution: NOT AUTHORIZED
Product / domain / fixture / schema mutation: NOT AUTHORIZED
  (Repository product mutation = HOLD until separate Implementation Start GO)
Issue #445 mutation / Close: NOT AUTHORIZED
Ready / Merge automation: NOT AUTHORIZED
Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
G3: HOLD
AC-7 / AC-9: OUT OF SCOPE (remain ACTIVE / OPEN; not consumed by this slice)
```


## 1. Exact objective

Establish an exact, observable **successful-empty** Observation→Review association
state that is distinct from **unresolved** / **no exact context match**, without
changing lifecycle Decision locks, without inventing persistence, and without
touching AC-7 / AC-9.

```text
Purpose:
  distinguish successful-empty Observation association
  from unresolved / no exact context match

MUST establish:
  1. exact current tip semantics (defect)
  2. exact successful-empty state
  3. exact unresolved state
  4. observable distinction between the two
  5. preservation of historical binding semantics
  6. no automatic inference from zero-match / mismatched evidence
```

This Exact Slice remediates **AC-4 only**. It does not claim Full Acceptance PASS,
does not rewrite historical `GAP_FOUND`, and does not close `#445`.

## 2. Authority / do not redecide

```text
Parent acceptance Definition:
  docs/architecture/sp-lc-6-synthetic-lifecycle-acceptance-definition-1.md
  AC-4 Observation -> Review:
    Review surface/projection shows associated Observations with historical context
    Unresolved と successful-empty を同一表示にしない

Parent residual re-pin:
  docs/architecture/sbs-445-blocked-residual-exact-repin-1.md
  AC-4 = ACTIVE on tip 2bfc10fa

D6 association already delivered (#443 / PR path; #443 now CLOSED):
  associateReviewObservations exists
  ASSOCIATED (non-empty) + UNRESOLVED fail-closed exist
  historical planId / planVersion binding retained
  no Active-version fallback

Locked lifecycle selections (unchanged):
  D1=B / D2=B / D3=B / D4=A / D5=B / D6=A
```

```text
OUT of authority for this slice:
  AC-7 executable new-version
  AC-9 write-count telemetry
  Acceptance re-execution
  #445 Close
  persistence / Draft creation / LIVE WRITE / Deploy
```

## 3. Exact current tip semantics (defect)

Current implementation:
`spfx/src/shell/procedure/review-observation-association.ts` on `2bfc10fa`.

```text
CURRENT association result union:
  ASSOCIATED { observations: non-empty implied by branch }
  UNRESOLVED {
    reason: HISTORICAL_LOOKUP_UNRESOLVED | NO_EXACT_CONTEXT_MATCH
    observations: []
  }

CURRENT branch rule (after historicalLookupStatus === RESOLVED):
  filtered = exact RecordId + planId + planVersion matches
  filtered.length > 0  → ASSOCIATED
  filtered.length == 0 → UNRESOLVED / NO_EXACT_CONTEXT_MATCH
```

```text
DEFECT (AC-4 GAP_FOUND basis):
  Empty evidence [] for a RESOLVED historical material
  collapses to UNRESOLVED / NO_EXACT_CONTEXT_MATCH

  Therefore tip has no successful-empty state:
    ASSOCIATED && observations.length === 0
  does not exist.

Acceptance harness already encodes the missing state:
  tests/contracts/sp-lc-6-synthetic-lifecycle-acceptance.test.ts
  AC-4 asserts successfulEmptyExists === false → GAP_FOUND
```

```text
CURRENT presentation (ReviewDueState):
  ASSOCIATED → evidence <ul> (empty list would render blank list only)
  UNRESOLVED → “観察記録の関連付けは未解決です（理由: …）”

  Even if ASSOCIATED+empty were introduced without explicit empty-success copy,
  blank <ul> would not be a reliable observable distinction.
```

```text
CURRENT fail-closed cases that MUST remain UNRESOLVED (not successful-empty):
  historicalLookupStatus !== RESOLVED
    → UNRESOLVED / HISTORICAL_LOOKUP_UNRESOLVED
  non-empty evidence where zero items match exact context
    → UNRESOLVED / NO_EXACT_CONTEXT_MATCH
      (identity / version mismatch; AC-8 adjacency preserved)
```

## 4. Exact target semantics (successful-empty vs unresolved)

### 4.1 State definitions (normative for this slice)

| State | When | Result shape |
|---|---|---|
| **ASSOCIATED (non-empty)** | `historicalLookupStatus === RESOLVED` and ≥1 exact-context Observation | `status: "ASSOCIATED"`, `observations.length ≥ 1` |
| **ASSOCIATED (successful-empty)** | `historicalLookupStatus === RESOLVED` and caller evidence array length is **0** | `status: "ASSOCIATED"`, `observations: []` |
| **UNRESOLVED / HISTORICAL_LOOKUP_UNRESOLVED** | historical lookup not `RESOLVED` | `status: "UNRESOLVED"`, reason as today, `observations: []` |
| **UNRESOLVED / NO_EXACT_CONTEXT_MATCH** | historical lookup `RESOLVED` and evidence length **≥ 1** but zero exact-context matches | `status: "UNRESOLVED"`, `reason: "NO_EXACT_CONTEXT_MATCH"`, `observations: []` |

```text
successful-empty means:
  association completed against a resolved historical ProcedureRecord context
  and the caller-supplied evidence set for that evaluation is empty
  → empty success, not “could not associate”

unresolved / no exact context match means:
  association could not be established for the supplied non-empty evidence
  under exact RecordId + planId + planVersion binding
  → fail-closed; do NOT infer success from zero matches
```

### 4.2 Forbidden inferences

```text
FORBIDDEN:
  treating non-empty mismatched evidence as successful-empty
  inventing Observations to avoid empty
  falling back to Active / later planVersion to find matches
  guessing association when historical lookup is unresolved
  collapsing successful-empty and unresolved into one UI string
  fixture-only PASS that leaves product projection unchanged
```

### 4.3 Historical binding preservation (unchanged)

```text
PRESERVE:
  exact ProcedureRecord identity
  historical planId + planVersion
  no rebinding to later Active
  chronological Observation ordering + RecordId tie-break (non-empty path)
  D6=A lock / #419 semantics
  CREATE-ONLY / no Observation mutation
```

### 4.4 Observable distinction (required)

Future Implementation MUST make successful-empty and unresolved **visibly and
machine-readably distinct** on the Review association surface.

```text
Minimum observable requirements:
  1. association status attribute remains status-faithful
       e.g. data-field-workflow-association-state="ASSOCIATED" | "UNRESOLVED"
  2. successful-empty exposes an explicit empty-success affordance
       (dedicated note / empty-success marker; NOT a blank <ul> alone)
  3. unresolved continues to expose unresolved copy + reason
  4. smoke / unit can assert both branches without substring collision
```

Exact Japanese copy may be fixed at Implementation Start binding time, but must
not reuse the unresolved sentence for successful-empty.

## 5. Changed-area candidate (future Implementation Start only)

Candidate paths only. This definition does **not** authorize mutation.

```text
IN (primary semantics):
  spfx/src/shell/procedure/review-observation-association.ts
    branch rule for RESOLVED + evidence.length === 0 → ASSOCIATED []

IN (presentation distinction; required if association empty becomes possible):
  spfx/src/shell/review/ReviewDueState.tsx
  spfx/src/shell/procedure/procedure-copy.ts
    (only if a dedicated successful-empty note constant is needed)

IN (focused evidence):
  spfx/src/shell/review/review-due.test.ts
  spfx/src/shell/procedure/procedure.test.ts
    (only if association projection tests live there)
  tests/contracts/sp-lc-6-synthetic-lifecycle-acceptance.test.ts
    AC-4 checkpoint expectations for successful-empty only
  optional: one existing Review smoke runner assertion path
    only if needed to prove visible distinction

OPTIONAL docs (Implementation Start / closeout only):
  docs/architecture/* implementation-start / evidence / fresh-review for this slice
  docs/architecture/demo-ux-6-browser-smoke.md
    only if that runner is bound by Implementation Start GO
```

```text
NOT candidates (explicit):
  AC-7 new-version persistence / draft workflow / create CTA enablement
  AC-9 write-count / liveWriteCount telemetry on smoke slices
  acceptance runner re-execution / acceptance-report.json rewrite
  schema / DTO / SharePoint / M365 / Entra / Deploy paths
  Issue #445 body / Close / labels
  unrelated FIELD_STAFF / Planning-PC / SBS-MGMT slices
```

## 6. Acceptance criteria (bind targets for future Implementation Start GO)

When a later Human `Implementation Start GO` binds this definition:

### Semantics

- RESOLVED historical material + `evidence = []` → `ASSOCIATED` with `observations.length === 0`.
- RESOLVED historical material + non-empty evidence with zero exact matches → remains `UNRESOLVED` / `NO_EXACT_CONTEXT_MATCH`.
- Non-resolved historical lookup → remains `UNRESOLVED` / `HISTORICAL_LOOKUP_UNRESOLVED`.
- Non-empty exact matches → remains `ASSOCIATED` with preserved order / identities.
- No Active-version fallback; historical `planId` / `planVersion` unchanged.

### Observability

- Successful-empty and unresolved are distinct in UI copy and in testable attributes.
- Successful-empty is not represented solely by an empty list with no empty-success note.

### Scope discipline

- Diff stays inside the Implementation Start GO changed-area list derived from §5.
- AC-7 slice flags (`versionPersistenceAuthorized`, `draftWorkflowAuthorized`, etc.) unchanged.
- AC-9 mutation-count telemetry keys remain absent unless a **separate** AC-9 slice authorizes them.
- No persistence / Draft creation / LIVE WRITE / Deploy / App Catalog.
- No Issue `#445` Close / body mutation.
- Historical Full Acceptance `overallResult = GAP_FOUND` is **not** retroactively rewritten.
- Full Acceptance re-execution remains **NOT AUTHORIZED** without a separate Human Acceptance Execution GO.
- Local AC-4 contract checkpoint may flip to the successful-empty PASS condition as slice evidence; that is **not** Full Acceptance re-execution and does **not** close `#445`.

## 7. Explicit OUT / MUST NOT

```text
consume AC-7
consume AC-9
authorize persistence
authorize Draft creation
authorize LIVE WRITE
authorize Deploy / App Catalog / Production Binding
authorize Acceptance re-execution
close #445
rewrite historical GAP_FOUND checkpoints to PASS in acceptance-report
treat non-empty mismatched evidence as successful-empty
infer association from Active / later version
schema / SharePoint column / DTO redesign
Ready / Merge automation from this definition alone
G3 claim
```

## 8. Why this Exact Slice is minimal

```text
CONFIRMED residual:
  one missing association state (successful-empty)
  plus required visible distinction from unresolved

CONFIRMED already delivered (do not redo):
  D6 association helper
  non-empty ASSOCIATED path
  unresolved fail-closed reasons
  historical binding

Scope discipline:
  AC-4 only
  one primary semantics file
  presentation only as needed for distinction
  focused tests / optional one smoke path
  AC-7 / AC-9 explicitly parked
```

## 9. Relation to Full Acceptance / #445 disposition

```text
This Exact Slice (after future Implementation + evidence):
  may remediate the AC-4 product/projection gap

It does NOT by itself:
  flip Full Acceptance overallResult
  remediate AC-7 or AC-9
  make #445 close-eligible
  authorize Acceptance re-execution

#445 remains KEEP OPEN until Human decides residual disposition
after AC-4 (and any remaining AC-7 / AC-9) handling.
```

## 10. Rollback boundary

If a later Implementation Start is authorized and then rolled back, rollback is
limited to restoring the §5 touched association / presentation / focused test
(and optional evidence docs) files.

Rollback must not:

- enable persistence / Draft / LIVE WRITE / Deploy;
- rewrite SP-LC-6 acceptance-report.json;
- mutate AC-7 / AC-9 surfaces;
- Close or edit Issue `#445`.

Safe rollback state = current baseline main association rule
(`filtered.length == 0` → `UNRESOLVED` / `NO_EXACT_CONTEXT_MATCH` for all empty-filter cases).

## 11. Gate

```text
Exact Slice Definition / scope fixation:
  COMPLETE / APPROVED / LOCKED

Human gate 1:
  Exact Slice Definition APPROVE = RECEIVED / LOCKED
  Human speech-act:
    AC-4 successful-empty Observation association Exact Slice
    Human Definition APPROVE
  Scope locked: AC-4 ONLY
  Bind targets locked: §1–§7 of this document

Human gate 2:
  Implementation Start GO = NOT AUTHORIZED / NOT CONSUMED
  Repository product mutation = HOLD

Still forbidden without separate Human GO:
  product / association / presentation / test mutation
  AC-7 / AC-9 work
  persistence / Draft creation
  Acceptance re-execution
  Issue #445 Close / body mutation
  Ready / Merge automation
  Deploy / Production Binding / LIVE WRITE
  G3

NEXT Human speech-act:
  separate Human Implementation Start GO
  bound to:
    this Unit (APPROVED / LOCKED)
    baseline main SHA (explicit in that GO)
    changed-area derived from §5
    acceptance criteria in §6
    OUT / MUST NOT in §7
  OR STOP
```

## 12. Stop condition

```text
SP-LC-6-AC-4-SUCCESSFUL-EMPTY-OBSERVATION-ASSOCIATION-EXACT-SLICE-DEFINITION-1
= COMPLETE / APPROVED / LOCKED

Definition APPROVE: CONSUMED / LOCKED
Code / product mutation: 0
Implementation Start: NOT CONSUMED
Acceptance re-execution: NOT AUTHORIZED
#445: OPEN / KEEP OPEN
AC-4: ACTIVE (Definition APPROVED; Implementation not started)
AC-7 / AC-9: ACTIVE / OPEN / OUT OF SCOPE
#442 / #444: close-eligible candidates unchanged (no Close GO here)
#443: CLOSED unchanged
#392 / #419: OPEN
Await: separate Human Implementation Start GO (or STOP)
```
