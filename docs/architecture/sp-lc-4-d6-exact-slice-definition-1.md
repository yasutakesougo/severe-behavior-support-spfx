# SP-LC-4 D6 EXACT-SLICE-DEFINITION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Slice: SP-LC-4 / #443
Kind: exact-slice definition only
Baseline main: ed2213d973cd68e464d7463f665d5bd517b218e0
Code / fixture / schema mutation: NOT AUTHORIZED
Issue mutation: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
```

## 1. Exact objective

Add read-only, synthetic evidence that an Observation can be presented as
Review material for the same historical SupportPlanVersion / ProcedureRecord
context, without changing any existing contract.

The slice must make the association traceable and fail-closed:

```text
Review material
  -> original ProcedureRecord identity
  -> historical planId + planVersion
  -> reviewable Observation evidence
```

The slice does not calculate compliance, decide whether a plan remains valid,
or infer a new relationship when the existing identity/version context is not
available.

## 2. Authority / existing semantics

```text
Parent authority:
  #419 / Decision-SUPPORT-PLAN-LIFECYCLE-SEMANTICS-1
  D6=A / SELECTED / LOCKED

Owner:
  #443 / SP-LC-4 Observation -> Review association

Historical binding:
  #347: planId + planVersion <-> ProcedureId + ProcedureVersion
  #352: ProcedureRecord remains bound to the version used at execution time
        and is never rebound to a later Active version (FW-05)

Observation evidence:
  src/domain/observation-evidence.ts
  preserve RecordId / observedAt / observedBy
  chronological history, deterministic RecordId tie-breaker
  no weekly compliance, required count, violation, or overdue derivation

ProcedureRecord persistence:
  ProcedureRecord is canonical
  Review reaches the original record by RecordId
  CREATE-ONLY; correction / supersede is not invented in v1
  save_outcome_unknown is reconciled by lookup, not guessed

Existing UI boundary:
  ShellProcedureReviewMaterial already carries historical plan/version context
  unresolved historical lookup remains unresolved; no Active fallback
```

## 3. Changed-area candidate

Candidate paths only; selecting paths is not Implementation Start authorization.

```text
src/domain/observation-evidence.ts
  or an adjacent domain projection module, only if a reusable association
  helper is required without changing Observation or DTO shape

spfx/src/shell/procedure/procedure-projection.ts
  historical Review projection boundary and fail-closed handling

spfx/src/shell/review/
  a separate read-only Review association presentation/projection module,
  without changing persisted or transport contracts

spfx/src/shell/procedure/procedure-fixture.ts
  synthetic v2 ProcedureRecord + Observation evidence pair and an unresolved
  or mismatched pair for negative evidence

spfx/src/shell/review/*.test.ts
spfx/smoke/<single-review-surface>/run-smoke.mjs
  focused unit and browser evidence only
```

No path above is authorized for mutation by this definition document.

## 4. Acceptance criteria

- Review material links to the original ProcedureRecord by stable identity.
- Associated Observation evidence preserves `RecordId`, `observedAt`, and `observedBy`.
- Evidence is ordered chronologically; equal instants use `RecordId` only as a technical tie-breaker.
- Historical `planId` and `planVersion` remain unchanged from the ProcedureRecord context.
- A later Active plan version never replaces the historical Review material or its Observation context.
- Missing, unknown, failed, or mismatched association context is shown as unresolved and is not guessed.
- Observation input is not mutated.
- Observation evidence remains informational and reviewable only.
- `PERFORMED_WITH_ADAPTATION` and `NOT_PERFORMED` remain factual ProcedureRecord results, not failure states.
- Existing DADS navigation, save-state, and fail-closed invariants remain unchanged.
- The implementation remains synthetic / presentation or pure-domain only and does not authorize live persistence.

## 5. Required tests / evidence

Unit / contract evidence:

- exact RecordId association is retained
- planId / planVersion association is retained
- historical v2 material remains v2 when v3 is Active
- missing, unknown, fetch-failed, and version-mismatch cases fail closed
- mismatched RecordId or plan/version is not silently associated
- chronological ordering and equal-timestamp RecordId tie-break are deterministic
- input Observation array remains unchanged
- no weekly minimum count, compliance result, violation, overdue, or invalidation is derived
- all three ProcedureRecord factual result values remain non-failure facts

Browser / presentation evidence:

- synthetic Review surface exposes the original ProcedureRecord and associated Observation evidence
- unresolved association is visibly distinct from an empty successful result
- no Active-version fallback is displayed
- keyboard / responsive behavior of the touched Review surface remains intact
- no page errors and no horizontal overflow in the focused smoke path
- evidence records remain synthetic and `liveWriteAuthorized` remains false

Verification output must identify changed paths, test counts, smoke result, and
the absence of schema, live-write, auth, and deploy changes.

## 6. Explicit OUT

```text
Observation schema / DTO / SharePoint column changes
ProcedureRecord schema or SupportPlanVersion contract changes
planId / planVersion / ProcedureId / ProcedureVersion binding redesign
historical record rebinding to Active
Observation correction / cancellation / supersede semantics
ProcedureRecord update / delete / correction persistence
weekly observation minimum or compliance PASS / FAIL
observation-period enforcement or week-boundary invention
overdue / violation / hard due / fixed 90-day rules
automatic plan invalidation or status transition
new auth or permission judgment
live SharePoint / M365 / Entra access or write
production data, tenant data, deploy, or App Catalog work
Issue comment / label / close / reopen mutation
Ready / Merge
```

## 7. Rollback boundary

Rollback, if later authorized, is limited to the exact slice's newly added
projection, synthetic fixtures, focused tests, smoke assertions, and its
definition/evidence records.

Rollback must not:

- alter existing Observation or ProcedureRecord contracts;
- remove or rewrite #347 / #352 historical binding semantics;
- change existing Review due / D5 behavior;
- delete or modify live data; or
- trigger Issue, Ready, Merge, Deploy, SharePoint, M365, or Entra mutation.

The safe rollback state is the current `main` baseline with the pre-slice
Review materials and existing observation-evidence behavior unchanged.

## 8. Next Human gate

```text
Human gate 1:
  approve or reject this exact slice definition

Human gate 2, only after approval:
  Implementation Start GO
  bound to:
    #443 / D6
    SP-LC-4 exact slice
    approved base SHA
    approved changed paths
    acceptance criteria above

Until both gates are explicit:
  code / fixture mutation = NO-GO
  schema / DTO mutation = NO-GO
  Issue mutation = NO-GO
  Ready / Merge = NO-GO
  LIVE WRITE = HOLD
  SharePoint / M365 / Entra mutation = NO-GO
  Deploy = HOLD
```

```text
EXACT-SLICE-DEFINITION-1: COMPLETE
Implementation Start: NOT AUTHORIZED
CURRENT ACTION: STOP
```
