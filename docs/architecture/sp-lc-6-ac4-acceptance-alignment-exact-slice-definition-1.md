# SP-LC-6 AC-4 ACCEPTANCE-ALIGNMENT EXACT-SLICE-DEFINITION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Issue: #445 (parent acceptance residual; no Issue mutation / no Close)
Unit: SP-LC-6-AC-4-ACCEPTANCE-ALIGNMENT-EXACT-SLICE-DEFINITION-1
Kind: exact-slice definition / scope fixation only (docs preparation)
Date: 2026-09-17
Baseline main: a17a231e7ddeea0e55c00ac77a4e71a91993ec50
  (#659 AC-9 write-count telemetry Exact Slice MERGED tip)
Authority inputs:
  SP-LC-6 Full Acceptance Re-Execution Preflight (READ ONLY)
    PRECHECK FAIL / HOLD
    blocking residual = AC-4 acceptance-layer runner bind drift
    exact main a17a231e7ddeea0e55c00ac77a4e71a91993ec50
  sp-lc-6-synthetic-lifecycle-acceptance-definition-1.md
    AC-4 = Observation -> Review
    Unresolved と successful-empty を同一表示にしない
    future Implementation Start default envelope = acceptance layer files
  sp-lc-6-ac4-successful-empty-observation-association-exact-slice-definition-1.md
    product Exact Slice APPROVED / LOCKED / MERGED via PR #654
    Explicit OUT: acceptance runner re-execution / acceptance-report.json rewrite
  sp-lc-6-ac4-successful-empty-observation-association-implementation-evidence-1.md
    product semantics delivered: RESOLVED + evidence=[] → ASSOCIATED []
    local contract AC-4 PASS recorded; runner rebind not performed
  sp-lc-6-synthetic-lifecycle-acceptance-evidence.md
    historical AC-4 GAP_FOUND PRESERVED
    §13 AC-7 / §14 AC-9 alignment recorded; no AC-4 runner-alignment section yet
  tip acceptance detector (post-#659 main):
    tests/contracts/sp-lc-6-synthetic-lifecycle-acceptance.test.ts
      AC-4 asserts successful-empty ASSOCIATED [] distinct from UNRESOLVED → PASS
    scripts/acceptance/run-sp-lc-6-synthetic-lifecycle-acceptance.mjs
      AC-4 still:
        result = gapUnlessEnvironmentBlocked(mergeResults([focused, heft, reviewSmoke]))
        note = "no successful-empty association status exists"
  tip product (do not re-implement):
    spfx/src/shell/procedure/review-observation-association.ts
      evidence.length === 0 → ASSOCIATED observations: []
    spfx/src/shell/review/ReviewDueState.tsx
      data-field-workflow="review-observation-successful-empty"
  PR #654 Merge COMPLETE (AC-4 product):
    merge commit cd8949d7323efaefc3987451f3b2ed3bb20c84cc
    ancestor of baseline tip a17a231e
  PR #657 / #659:
    AC-7 / AC-9 acceptance alignment MERGED / CONSUMED (OUT of this slice)
  #419 / Decision-SUPPORT-PLAN-LIFECYCLE-SEMANTICS-1
    D1=B / D2=B / D3=B / D4=A / D5=B / D6=A LOCKED

Exact Slice Definition status: PREPARED / AWAITING HUMAN DEFINITION APPROVE
Residual classification Decision: NOT LOCKED
  proposed: B / STALE ACCEPTANCE / EVIDENCE GAP
  (Human may lock with Definition APPROVE or a separate classification Decision)
Human Definition APPROVE: NOT RECEIVED / NOT CONSUMED
Human Implementation Start GO: NOT AUTHORIZED / NOT CONSUMED
Acceptance contract / runner rewrite: NOT AUTHORIZED by this document alone
Product / domain / fixture / schema mutation: NOT AUTHORIZED
Issue #445 mutation / Close: NOT AUTHORIZED
Ready / Merge: HOLD
Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
Acceptance re-execution / Full Acceptance re-run: NOT AUTHORIZED
historical GAP_FOUND rewrite: NOT AUTHORIZED
AC-7 / AC-9: OUT OF SCOPE (MERGED / CONSUMED; do not reopen)
```

## 1. Exact objective

Re-bind SP-LC-6 **AC-4** acceptance runner (and evidence interpretation) to
current-main successful-empty Observation association capability that already
exists on tip, without adding product behavior and without rewriting historical
Full Acceptance results.

```text
Purpose:
  close the AC-4 acceptance/evidence drift
  by aligning the AC-4 runner checkpoint with existing current-main behavior

MUST establish:
  1. AC-4 meaning remains successful-empty ASSOCIATED [] ≠ UNRESOLVED
  2. product + local contract already deliver that meaning on tip
  3. current residual = stale runner forced GAP + stale runner note
  4. exact PASS bind targets for a later alignment Implementation Start
  5. historical Full Acceptance GAP_FOUND remains preserved
  6. no product / AC-7 / AC-9 / #445 Close / Full Acceptance work in this slice
```

This Exact Slice remediates **AC-4 acceptance alignment only**. It does not
claim Full Acceptance PASS, does not rewrite historical `GAP_FOUND`, and does
not close `#445`.

This document does **not** approve itself. Human `Definition APPROVE` is a
separate speech-act. Alignment implementation is a third, later GO.

## 2. Authority / do not redecide

```text
Parent acceptance Definition:
  docs/architecture/sp-lc-6-synthetic-lifecycle-acceptance-definition-1.md
  AC-4 Observation -> Review:
    Review surface / projection shows associated Observation in historical context
    Unresolved と successful-empty を同一表示にしない

Prior product Exact Slice (consumed; do not redo):
  docs/architecture/sp-lc-6-ac4-successful-empty-observation-association-exact-slice-definition-1.md
  PR #654 MERGED
  RESOLVED + evidence=[] → ASSOCIATED []
  UNRESOLVED branches preserved
  Explicit OUT included acceptance runner rewrite

Proposed residual classification (awaiting Human lock):
  B / STALE ACCEPTANCE / EVIDENCE GAP
  AC-4 product gap is NOT ESTABLISHED on baseline tip
  AC-4 residual is acceptance-layer runner / evidence drift

Locked lifecycle selections (unchanged):
  D1=B / D2=B / D3=B / D4=A / D5=B / D6=A
```

```text
OUT of authority for this slice:
  AC-4 product re-implementation (association branch / Review UI)
  reopening AC-7 / AC-9 Exact Slices
  persistence / LIVE WRITE / Deploy
  Acceptance re-execution / Full Acceptance re-run
  historical GAP_FOUND rewrite
  #445 Close / Issue body mutation
```

## 3. Exact current tip semantics (drift, not product absence)

### 3.1 Current-main capability (CONFIRMED; do not re-implement)

On baseline `a17a231e7ddeea0e55c00ac77a4e71a91993ec50`:

```text
product:
  spfx/src/shell/procedure/review-observation-association.ts
    historicalLookupStatus === RESOLVED
      evidence.length === 0 → ASSOCIATED / observations: []
      non-empty zero exact matches → UNRESOLVED / NO_EXACT_CONTEXT_MATCH
      non-empty exact matches → ASSOCIATED / ordered observations
    historical not RESOLVED → UNRESOLVED / HISTORICAL_LOOKUP_UNRESOLVED

presentation:
  spfx/src/shell/review/ReviewDueState.tsx
    successful-empty marker:
      data-field-workflow="review-observation-successful-empty"
    unresolved remains distinct

local contract (already aligned):
  tests/contracts/sp-lc-6-synthetic-lifecycle-acceptance.test.ts
    AC-4 distinguishes successful-empty ASSOCIATED [] from unresolved
    local checkpoint result asserts PASS

prior product slice evidence:
  docs/architecture/sp-lc-6-ac4-successful-empty-observation-association-implementation-evidence-1.md
  docs/architecture/sp-lc-6-ac4-successful-empty-observation-association-fresh-independent-re-review-1.md
    REVIEW-CLEARED / MERGED via PR #654
```

### 3.2 Stale AC-4 detector (CONFIRMED drift)

```text
scripts/acceptance/run-sp-lc-6-synthetic-lifecycle-acceptance.mjs
  AC-4 still:
    result = gapUnlessEnvironmentBlocked(
              mergeResults([focused, heft, reviewSmoke])
            )
    → forces GAP_FOUND whenever sources are not ENVIRONMENT_BLOCKED
    note = "Current main maps zero exact Observation matches to
            UNRESOLVED / NO_EXACT_CONTEXT_MATCH;
            no successful-empty association status exists."

Contrast:
  focused contract AC-4 already PASS on the same tip
  product successful-empty already exists on the same tip
```

```text
DRIFT:
  product + contract already prove successful-empty on current main
  acceptance runner still encodes the pre-#654 GAP detector
  → GAP_FOUND from a future Full Acceptance run would be acceptance/evidence drift
  → not an established missing product path on baseline tip
```

Historical Full Acceptance recorded AC-4 `GAP_FOUND` against then-authorized
main. That executed result stays **PRESERVED**. This slice does not rewrite it.

The prior AC-4 product Exact Slice intentionally OUT'd runner rewrite; that was
correct scope for product delivery. This separate alignment slice closes the
remaining acceptance-layer residual.

## 4. Exact target semantics (alignment)

### 4.1 AC-4 PASS meaning (normative for this slice)

After a later Human Implementation Start GO binds this **APPROVED / LOCKED**
definition, AC-4 PASS requires all of:

```text
1. Existing association path yields successful-empty
   RESOLVED historical material + evidence=[]
   → ASSOCIATED && observations.length === 0

2. UNRESOLVED remains distinct
   HISTORICAL_LOOKUP_UNRESOLVED and NO_EXACT_CONTEXT_MATCH
   are not collapsed into successful-empty

3. Local contract AC-4 remains PASS for the successful-empty distinction

4. Acceptance runner AC-4 no longer uses gapUnlessEnvironmentBlocked
   as a forced residual
   result authority = existing focused (+ optional heft / reviewSmoke merge)
   without manufacturing GAP when sources PASS

5. Runner note no longer claims successful-empty is absent on current main

6. Historical Full Acceptance evidence tables remain labeled historical /
   preserved
```

```text
NOT required for AC-4 PASS in this slice:
  new product association code
  new Review UI copy beyond what #654 already delivered
  Full Acceptance overallResult PASS
  AC-7 / AC-9 rework
  LIVE WRITE / Deploy
```

### 4.2 Relation to prior AC-4 product Exact Slice

```text
KEEP / CONSUMED:
  PR #654 successful-empty product semantics
  ReviewDueState successful-empty observability
  local contract AC-4 PASS asserts

Meaning:
  Product Exact Slice closed the product residual
  This alignment Exact Slice closes the remaining runner/evidence residual
  They are separate Human gates and must not be collapsed
```

### 4.3 Forbidden inferences

```text
FORBIDDEN:
  re-implementing association successful-empty as if product were missing
  treating local contract PASS alone as Full Acceptance PASS
  rewriting historical acceptance-report GAP_FOUND to PASS
  authorizing Full Acceptance re-execution from this definition alone
  reopening AC-7 / AC-9
  closing #445 because AC-4 detector would locally PASS
  flipping LIVE WRITE / Deploy / Production Binding
```

## 5. Changed-area (bound by a later Implementation Start GO)

Parent SP-LC-6 acceptance layer bound the implementation publication surface to
the acceptance-layer envelope. Alignment stays inside that envelope and is
minimal.

```text
IN (acceptance alignment only):
  scripts/acceptance/run-sp-lc-6-synthetic-lifecycle-acceptance.mjs
    AC-4 result/note re-bind
    remove forced GAP via gapUnlessEnvironmentBlocked for AC-4
    keep source set compatible with focused (+ heft / reviewSmoke if retained)
  docs/architecture/sp-lc-6-synthetic-lifecycle-acceptance-evidence.md
    record AC-4 alignment interpretation / current-main bind
    do NOT rewrite historical executed GAP_FOUND tables as PASS

OPTIONAL IN (only if Implementation Start finds residual text drift):
  tests/contracts/sp-lc-6-synthetic-lifecycle-acceptance.test.ts
    commentary / naming hygiene only
    do NOT reopen successful-empty PASS semantics already on tip
```

```text
READ-ONLY inputs (do not mutate in this slice):
  spfx/src/shell/procedure/review-observation-association.ts
  spfx/src/shell/procedure/procedure-copy.ts
  spfx/src/shell/review/ReviewDueState.tsx
  spfx/src/shell/review/review-due.test.ts
  docs/architecture/sp-lc-6-ac4-successful-empty-observation-association-*.md
  spfx/smoke/demo-ux-6/**
  AC-7 / AC-9 aligned runner/contract/smoke surfaces
```

```text
NOT candidates (explicit):
  new association / Review product code
  AC-7 / AC-9 reopen
  acceptance-report.json historical rewrite / Full Acceptance re-run
  schema / DTO / SharePoint / M365 / Entra / Deploy paths
  Issue #445 body / Close / labels
  Draft docs PR Close/Merge automation
```

## 6. Acceptance criteria (bound by a later Implementation Start GO)

When a later Human `Implementation Start GO` binds this **APPROVED / LOCKED**
definition:

### Semantics

- Runner AC-4 no longer forces `GAP_FOUND` via `gapUnlessEnvironmentBlocked`
  when focused (and retained sources) PASS.
- Runner AC-4 note states successful-empty `ASSOCIATED []` is present on
  current main and remains distinct from `UNRESOLVED`.
- Local contract AC-4 successful-empty PASS remains true.
- Product association / Review UI files are unchanged by this slice.

### Observability

- AC-4 GAP detector is no longer “forced runner GAP despite product PASS”.
- Evidence gains an AC-4 acceptance-alignment interpretation section.
- Historical Full Acceptance evidence sections remain labeled historical /
  preserved.

### Scope discipline

- Diff stays inside the Implementation Start GO changed-area list derived from
  §5.
- No product/domain/SPFx association/UI mutation.
- No persistence / LIVE WRITE / Deploy / App Catalog.
- No Issue `#445` Close / body mutation.
- Historical Full Acceptance `overallResult = GAP_FOUND` is **not**
  retroactively rewritten.
- Full Acceptance re-execution remains **NOT AUTHORIZED** without a separate
  Human Acceptance Execution GO.
- Local AC-4 runner checkpoint may flip to the aligned PASS condition as slice
  evidence; that is **not** Full Acceptance re-execution and does **not** close
  `#445`.

## 7. Explicit OUT / MUST NOT

```text
treat this PREPARED definition as Definition APPROVE
treat Definition APPROVE as Implementation Start
AC-4 product re-implementation
AC-7 / AC-9 reopen
authorize persistence
authorize LIVE WRITE
authorize Deploy / App Catalog / Production Binding
authorize Acceptance re-execution / Full Acceptance re-run
rewrite historical GAP_FOUND checkpoints to PASS in acceptance-report
close #445
schema / SharePoint column / DTO redesign
Ready / Merge automation from this definition alone
```

## 8. Why this Exact Slice is minimal

```text
CONFIRMED residual:
  AC-4 runner still forces GAP_FOUND
  runner note still denies successful-empty
  while product + contract already PASS on tip

CONFIRMED already delivered (do not redo):
  successful-empty ASSOCIATED [] product path (#654)
  ReviewDueState successful-empty observability
  local contract AC-4 PASS
  AC-7 / AC-9 acceptance alignment on tip

Scope discipline:
  AC-4 acceptance alignment only
  runner + evidence (+ optional contract hygiene)
  product / AC-7 / AC-9 / Full Acceptance parked
```

## 9. Relation to Full Acceptance / #445 disposition

```text
This Exact Slice (after future Definition APPROVE + Implementation Start
+ evidence):
  may remediate the AC-4 acceptance/evidence drift
  may clear the PRECHECK FAIL blocking residual found on a17a231e

It does NOT by itself:
  flip Full Acceptance overallResult
  authorize Full Acceptance re-execution
  make #445 close-eligible
  authorize persistence / Deploy

#445 remains KEEP OPEN until Human decides residual disposition after
AC-4 alignment and a separately authorized Full Acceptance re-execution /
Fresh Independent Acceptance Review / Close decision sequence.
```

## 10. Rollback boundary

If a later Implementation Start is authorized and then rolled back, rollback is
limited to restoring the acceptance-layer files changed under §5.

Rollback must not:

- mutate product association / Review UI code;
- enable persistence / LIVE WRITE / Deploy;
- rewrite SP-LC-6 acceptance-report.json historical results;
- mutate AC-7 / AC-9 surfaces;
- Close or edit Issue `#445`.

Safe rollback state = current baseline AC-4 runner detector
(`gapUnlessEnvironmentBlocked` + stale “no successful-empty” note).

## 11. Gate

```text
Residual classification:
  proposed B / STALE ACCEPTANCE / EVIDENCE GAP
  NOT LOCKED until Human Definition APPROVE
    or a separate Human classification Decision

Exact Slice Definition / scope fixation:
  PREPARED / AWAITING HUMAN DEFINITION APPROVE

Human gate 1 (NEXT):
  Exact Slice Definition APPROVE = NOT RECEIVED
  required speech-act form:
    AC-4 acceptance-alignment Exact Slice
    Human Definition APPROVE
    Scope: AC-4 acceptance alignment ONLY
    Basis: this document
    optional: lock residual classification B with the same speech-act
  Until received: do not rewrite runner / evidence body
                  beyond this definition packet

Human gate 2 (later, separate):
  Implementation Start GO = NOT AUTHORIZED
  Bound when issued:
    this Unit (must be APPROVED / LOCKED first)
    baseline main a17a231e7ddeea0e55c00ac77a4e71a91993ec50
      (re-bind if main has moved)
    changed-area from §5
    acceptance criteria from §6
    OUT / MUST NOT from §7

Still forbidden without separate Human GO:
  AC-4 product re-implementation
  AC-7 / AC-9 reopen
  persistence
  LIVE WRITE
  Deploy / App Catalog / Production Binding
  Acceptance re-execution / Full Acceptance re-run
  historical GAP_FOUND rewrite
  Issue #445 Close / body mutation
  Ready / Merge
```

## 12. Stop condition

```text
SP-LC-6-AC-4-ACCEPTANCE-ALIGNMENT-EXACT-SLICE-DEFINITION-1
= PREPARED / AWAITING HUMAN DEFINITION APPROVE

Definition APPROVE: NOT CONSUMED
Implementation Start: NOT CONSUMED
Acceptance contract / runner rewrite: NOT PERFORMED
#445: OPEN / KEEP OPEN
AC-4 product gap: NOT ESTABLISHED on baseline tip
AC-4 acceptance/evidence drift: PROPOSED as classification B
AC-7 / AC-9: MERGED / CONSUMED / OUT OF SCOPE
Ready / Merge: HOLD
Full Acceptance re-execution: NOT AUTHORIZED
Await: Human Definition APPROVE for this document
```

## 13. Gate sequence (this lane)

```text
1. PREPARE AC-4 acceptance-alignment Exact Slice Definition  ← THIS DOCUMENT
2. Human Definition APPROVE (+ optional classification B lock) ← NEXT
3. Human Implementation Start GO                              ← separate
4. Implementation + Fresh Independent Review
5. Human Ready / Merge
6. Optional: Full Acceptance Re-Execution Preflight again
7. Separate Human Acceptance Execution GO (if PRECHECK PASS)
8. #445 Close                                                 ← separate later
```

```text
Definition PREPARED ≠ Definition APPROVE
Definition APPROVE ≠ Implementation Start
Implementation Start ≠ Ready / Merge
Ready / Merge ≠ Full Acceptance re-run
Full Acceptance local AC-4 PASS ≠ #445 Close
```
