# FIELD-STAFF-CORRECTION-PERSISTENCE-EXACT-SLICE-DEFINITION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: FIELD-STAFF-CORRECTION-PERSISTENCE-EXACT-SLICE-DEFINITION-1
Kind: read-only exact-slice definition
Parent: FIELD-STAFF-CORRECTION-PERSISTENCE-AUTHORITY-1 / #448
Human Decision authority: D1=B / D2=A / D3=B / D4=B
Binding authority: C1=A / C2=D / C3=D / C4=B / C5=E / C6=A / C7=A / C8=A / C9=B
Human Acceptance status: ACCEPTED / LOCKED
Exact objective: DOMAIN / CONTRACT / FAKE-PORT ONLY
Implementation: COMPLETE (domain / contract / fake-port only)
Schema mutation: FORBIDDEN
SharePoint WRITE: FORBIDDEN
Issue mutation: FORBIDDEN
Ready / Merge / Deploy / LIVE WRITE: FORBIDDEN
```

## 1. Objective

Define one safe, source-only exact implementation slice from the locked C1-C9
contract. The slice is limited to domain types, validation/canonicalization
rules, a persistence-port boundary, and fake-port tests. It does not implement
the slice or authorize any write.

## 2. Binding authority

The following Human selections are binding for this definition:

```text
C1=A / C2=D / C3=D / C4=B / C5=E / C6=A / C7=A / C8=A / C9=B
```

The resulting invariants are unchanged:

```text
ProcedureRecord: CREATE-ONLY / IMMUTABLE
Correction: APPEND-ONLY / originalRecordId-bound
ProcedureRecord UPDATE: FORBIDDEN
Correction UPDATE / DELETE: FORBIDDEN
cancellation semantics: UNCHANGED
lifecycle semantics: UNCHANGED
liveWriteAuthorized: FALSE
SharePoint WRITE: NOT AUTHORIZED
```

## 3. Exact slice contract candidate

The candidate is an independent `ProcedureRecordCorrection` domain contract.
It contains one required `originalRecordId`, correction identity and
idempotency identity, the v1 factual fields `result` and `performedAt`, and the
required metadata `reason`, `correctedAt`, and `correctedBy`.

`correctedBy` and `correctedAt` are system-derived from the authenticated,
authorized FIELD_STAFF execution context. The client cannot supply an actor
identity string or derived/system fields. Authentication or authorization
uncertainty is rejected fail-closed.

The original organization, site, user, `originalRecordId`, Procedure binding,
`planId`, `planVersion`, original `recordedAt`, and original `recordedBy` are
immutable binding/context. The original ProcedureRecord is never copied into an
update or replacement operation.

`reason` is required, non-empty human-entered free text. No reason taxonomy is
introduced by this slice.

## 4. Identity and idempotency material

For one submitted correction, the payload is frozen before identity derivation.
Canonical material is versioned, uses the correction-specific namespace, includes
`originalRecordId`, and uses the reusable U+001F framing pattern. SHA-256 is the
digest algorithm.

```text
CorrectionId material:
  versioned correction namespace U+001F originalRecordId U+001F frozen correction payload

IdempotencyKey material:
  versioned correction-idempotency namespace U+001F originalRecordId U+001F frozen correction payload
```

`CorrectionId` and `IdempotencyKey` are separate deterministic identifiers and
are both reused for a retry of the same logical submit. A changed frozen payload
is not the same submit. An unknown outcome is reconciled using the existing
identities; it must not automatically create a correction with a new identity.
The correction namespaces are separate from the ProcedureRecord namespace.

## 5. History and persistence-port boundary

The domain port exposes an append-only correction submit and an original-bound
history read. It does not expose correction update/delete, ProcedureRecord
update/delete, replacement, cancellation, supersede, or lifecycle-event methods.

```text
submitCorrection(request, authenticatedFieldStaffContext)
  -> saved | save_failed | save_outcome_unknown

listCorrections(originalRecordId)
  -> append-only correction history
```

The port contract requires duplicate/idempotency lookup before create and
read-back/reconciliation after a successful-looking persistence operation.
Definite failure remains `save_failed`. Timeout, partial response, or uncertain
commit remains `save_outcome_unknown`; no automatic new-create retry is allowed.

History preserves the original and every correction. Multiple corrections are
allowed. Effective presentation is a read projection only; it does not mutate
stored records. Ordering uses corrected time with stable `CorrectionId`
tie-breaking when timestamps are equal.

## 6. Changed-area candidates

Implementation review may consider only these source areas:

- correction domain/request/result types and validation
- deterministic identity and frozen-payload canonicalization helper
- correction persistence port interface and fail-closed result vocabulary
- in-memory/fake append-only port and original-bound history projection
- domain-level tests for the contract and fake port

No UI save CTA, SharePoint adapter, physical mapping, schema, or lifecycle code is
part of this slice.

## 7. Acceptance criteria

- Each C1-C9 rule is represented by exactly one domain/port rule above.
- A correction cannot alter or replace the original ProcedureRecord.
- Only `result` and `performedAt` are client-editable factual fields.
- `reason` is required and non-empty; actor and timestamp authority are system-derived.
- Identity derivation is deterministic, versioned, SHA-256, U+001F-framed, frozen-payload, and namespace-separated.
- Same logical retries reuse both identities; unknown outcomes never mint a new automatic create.
- History is append-only and retains the original lineage.
- The port has no mutation method other than append-only correction submit.
- `save_failed` and `save_outcome_unknown` remain distinguishable.
- `liveWriteAuthorized` remains `false`.

## 8. Required tests

- valid correction request with `result` and `performedAt`
- rejection of missing/blank `reason`
- rejection of editable original binding/context and derived/system fields
- rejection when authentication or FIELD_STAFF authorization is unavailable
- deterministic CorrectionId and separate IdempotencyKey derivation
- namespace, version, originalRecordId, SHA-256, and U+001F framing coverage
- frozen payload retry returns the same two identities
- changed payload does not reuse the prior submit identity
- unknown outcome does not trigger a new automatic create
- duplicate/idempotent submit behavior and reconciliation behavior
- append-only multiple-correction history and stable same-timestamp ordering
- absence of correction UPDATE/DELETE and ProcedureRecord mutation methods
- `save_failed` versus `save_outcome_unknown` result classification

## 9. Explicit OUT

```text
ProcedureRecord UPDATE / DELETE / replacement
Correction UPDATE / DELETE
cancellation, supersede, or lifecycle mutation
ProcedureRecordLifecycleEvent generation
UI save-button connection or presentation changes
SharePoint adapter and physical mapping
schema provisioning or mutation
authenticated SharePoint WRITE
production binding, LIVE WRITE, Deploy, and host verification
Issue mutation, Ready, Merge, and PR operations
```

## 10. Physical schema and rollback boundary

Physical schema decisions can remain OUT of this first implementation slice.
C8 fixes the dedicated `ProcedureRecordCorrection` physical direction, while
list/column/mapping/provisioning details remain a separate schema/provisioning
Human GO. No SharePoint provisioning or WRITE is needed for the domain/fake-port
slice.

Rollback is source-only: remove or revert the domain/contract/fake-port changes
and their tests. No persisted correction data, SharePoint schema, list item, or
production binding exists to roll back in this slice.

## 11. Human Acceptance and stop decision

```text
Exact slice: ACCEPTED / LOCKED
Binding authority: C1=A / C2=D / C3=D / C4=B / C5=E / C6=A / C7=A / C8=A / C9=B
Exact objective: DOMAIN / CONTRACT / FAKE-PORT ONLY
Physical schema: OUT / DECISION REQUIRED separately
SharePoint WRITE: FORBIDDEN
liveWriteAuthorized: FALSE
Implementation Start GO: COMPLETE (source present)
Independent Review-1: COMPLETE / Evidence ACCEPTED
Reviewer final label: PASS WITH NON-BLOCKING RESIDUAL
CONTROL OVERRIDE: DECISION REQUIRED / REMEDIATION REQUIRED
Commit eligibility: NOT ELIGIBLE
Schema mutation: FORBIDDEN
SharePoint provisioning: FORBIDDEN
Deploy / Issue mutation / Ready / Merge: FORBIDDEN
Sources (uncommitted / not Commit-eligible):
  - src/domain/procedure-record-correction.ts
  - src/domain/procedure-record-correction-persistence.ts
  - tests/domain/procedure-record-correction.test.ts
```

### Independent Review-1 Control disposition

Independent Review evidence is accepted. Control does **not** adopt the
Reviewer final label as Commit-eligible.

Blocking residuals:

1. **FIELD POLICY / cross-date — DECISION REQUIRED**  
   C3 permits correcting `performedAt` while original `LocalDate` remains
   immutable. Cross-date Asia/Tokyo meaning is undefined under the accepted
   contract. Do not invent `effectiveLocalDate` or correction-side `LocalDate`.

2. **Fake port shared reference — CONFORMANCE FAIL**  
   Accepted HISTORY requires that a returned list cannot mutate internal
   history. Shared entity references from the in-memory fake violate that
   exact-slice condition and require remediation after the cross-date Decision.

Non-blocking carry (not Commit stop alone after blockers close):

- `correctedAtIso` freeze remains a required caller contract for UI save wiring
- Prettier FAIL on the three implementation files must be fixed before Commit
- `appendCalled` naming is P3 carry
- `npm test` quoted-glob tooling residual is out of this slice

### C3 CROSS-DATE POLICY (SELECTED)

```text
Canonical: field-staff-correction-persistence-c3-cross-date-policy-1.md
Human Decision: Option A — SAME-LOCAL-DATE ONLY
Status: SELECTED / LOCKED
C3=D: UNCHANGED
```

### Exact remediation slice (FIXED)

```text
Canonical: field-staff-correction-persistence-remediation-slice-1.md
R1: same-local-date performedAt validation
R2: returned history must not mutate internal fake-port store
Remediation implementation: COMPLETE (R1 / R2)
Next: Human Commit GO (not authorized here)
Commit / Push / PR: NOT AUTHORIZED
```
