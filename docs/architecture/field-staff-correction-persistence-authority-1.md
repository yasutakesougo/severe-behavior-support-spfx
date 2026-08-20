# FIELD-STAFF-CORRECTION-PERSISTENCE-AUTHORITY-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: FIELD-STAFF-CORRECTION-PERSISTENCE-AUTHORITY-1
Kind: read-only decision / contract slice
Date: 2026-08-20
Baseline main: 4bba5a7d73384ae8e9cf82834ab9c117cbd35fde
Parent residual: #448 / FIELD_STAFF TRACK A
Runtime evidence: RUNTIME_EVIDENCE_UNVERIFIED / SOURCE EVIDENCE PASS
Code mutation: 0
Decision status: SELECTED / LOCKED
Implementation Start: NOT AUTHORIZED
liveWriteAuthorized: false
SharePoint WRITE / schema mutation / lifecycle mutation: NOT AUTHORIZED
Deploy / Issue mutation / Ready / Merge: NOT AUTHORIZED
```

## 1. Objective and stop boundary

This packet determines the authority questions that must be answered before a
Correction save implementation can begin. It does not implement a save path,
change the existing ProcedureRecord contract, or authorize a SharePoint write.

The slice stops after recording:

- existing authority and contract evidence;
- unresolved decisions;
- recommended selections for Human review;
- the exact acceptance boundary;
- whether implementation may start.

## 2. Existing evidence

| Evidence | Finding | Consequence |
|---|---|---|
| `spfx/src/shell/procedure/procedure-correction.ts` | Correction entry and current-record reuse are presentation-authorized; save semantics, cancellation, live write, SharePoint write, and deploy are false | The UI is not a persistence authority |
| `spfx/src/shell/procedure/ProcedureRecordCorrection.tsx` | Displays the existing occurrence and record context; save CTA is disabled | No save request or write path exists |
| `src/domain/procedure-record.ts` | ProcedureRecord contains immutable execution identity/context and factual result values | Correction must not reinterpret `result` as save status or silently rebind historical context |
| `docs/architecture/decision-procedure-record-persistence-1-selection.md` D6 | v1 is CREATE-ONLY; update, delete, and correction/supersede are not adopted | A separate Decision and contract are required |
| same decision D5/D8/D9 | Dual identity lookup is required; `saved` requires GET-by-RecordId read-back; unknown is not collapsed | Any future correction write needs equivalent reconciliation rules |
| `docs/architecture/assessment-snapshot-save-timing-contract.md` | AssessmentSnapshot adopts retain-original-and-save-new-version | Reference pattern only; it does not authorize ProcedureRecord correction |
| `docs/architecture/field-staff-phase8-residual-reassessment-1.md` | Correction persistence remains open and outside the delivered presentation slice | #448 remains open |

## 3. Authority decisions required

The following are unresolved. None is closed by the existing presentation,
ProcedureRecord v1, or the current-main runtime evidence result.

| ID | Decision question | Current status |
|---|---|---|
| C-PA-01 | Is correction persistence allowed at all? | OPEN |
| C-PA-02 | Which logical role(s) may request and execute it? | OPEN; ordinary `SUPPORTER` create authority must not be assumed to include correction |
| C-PA-03 | Is the original record immutable, or may it be updated in place? | OPEN; existing v1 says update is not adopted |
| C-PA-04 | If not overwrite, is the model append-only correction / supersede? | OPEN; not represented by ProcedureRecord v1 |
| C-PA-05 | What exact identity binds the correction to the original? | OPEN; at minimum the original `RecordId` and site/user/context binding require decision |
| C-PA-06 | Which authority supplies correction reason, actor, and timestamp? | OPEN; client-provided values cannot be trusted as authorization evidence |
| C-PA-07 | Does correction create a lifecycle event or change occurrence state? | OPEN; no implicit cancellation or lifecycle mutation is allowed |
| C-PA-08 | What is the result for timeout, partial response, or uncertain commit? | OPEN for correction; existing `save_outcome_unknown` policy is the required baseline |
| C-PA-09 | Which gate first permits SharePoint WRITE? | OPEN; must be a later Human Gate after contract, schema, binding, and permission acceptance |
| C-PA-10 | Until that gate, when may `liveWriteAuthorized` become true? | LOCKED HOLD: it remains false |

## 4. Previous recommendations

These are recommendations, not accepted decisions.

| ID | Recommended selection | Rationale |
|---|---|---|
| R-PA-01 | Permit correction only after a dedicated correction policy and authority are accepted | Presentation entry alone cannot authorize a business write |
| R-PA-02 | Keep the original ProcedureRecord immutable; do not adopt in-place overwrite | Preserves the canonical execution fact and avoids destroying audit history |
| R-PA-03 | Use an append-only correction record or superseding version bound to `originalRecordId` | Matches the retain-history direction without changing v1 semantics implicitly |
| R-PA-04 | Require exact original identity and context binding: organization, site, user, RecordId, procedure, plan/version, and a new correction identity | Prevents cross-user, cross-site, or historical-version rebinding |
| R-PA-05 | Derive actor and timestamp from the authorized execution context/server authority; require a non-empty reason from the correction contract | A UI field is evidence of intent, not proof of authority or time |
| R-PA-06 | Keep correction persistence separate from cancellation and do not change lifecycle state implicitly | Cancellation is an independent residual and policy decision |
| R-PA-07 | Reuse fail-closed outcomes: definite failure -> `save_failed`; uncertain commit -> `save_outcome_unknown`; reconcile by lookup; no automatic create retry | Preserves the accepted D9 safety boundary |
| R-PA-08 | Permit SharePoint WRITE only after the correction contract, role binding, physical mapping/schema, adapter verification, and a scoped Human GO are all accepted | Prevents a source-level contract decision from becoming a production write authorization |
| R-PA-09 | Keep `liveWriteAuthorized=false` through all design, contract, synthetic, and local verification work | Current runtime evidence is unverified and does not alter the write gate |

## 5. Human Decision GO

The following Human Decision is recorded as selected and locked for this
authority slice. It supersedes the status of the recommendations above, while
preserving them as the prior recommendation record.

```text
FIELD-STAFF-CORRECTION-PERSISTENCE-AUTHORITY-1

Human Decision:
D1=B
D2=A
D3=B
D4=B

D1 Correction storage model:
  B — append-only correction bound to originalRecordId
D2 Original ProcedureRecord:
  A — immutable / CREATE-ONLYを維持
D3 Correction write implementation:
  B — authority決定後も別Implementation Start GOまでHOLD
D4 LIVE WRITE:
  B — implementation/test段階でも liveWriteAuthorized=false を維持し、
      SharePoint WRITEは別Human GOまでHOLD

Decision status: SELECTED / LOCKED
ProcedureRecord: CREATE-ONLY / IMMUTABLE
Correction model: APPEND-ONLY / originalRecordId-bound
liveWriteAuthorized: FALSE
Implementation: NOT AUTHORIZED
Schema: UNCHANGED
SharePoint WRITE: NOT AUTHORIZED
Deploy: NOT AUTHORIZED
Issue mutation: NOT AUTHORIZED
```

The selected decision also fixes these constraints:

- original ProcedureRecord UPDATE is not allowed;
- Correction does not replace the original record;
- cancellation semantics remain unchanged;
- schema mutation does not start;
- SharePoint WRITE does not start;
- Deploy does not start;
- Issue mutation does not start;
- Implementation Start does not start.

## 6. Remaining contract and schema questions

The Human Decision fixes the storage direction and authority hold, but does not
complete the implementation contract. The following remain unresolved and must
be decided before any Implementation Start:

| ID | Unresolved question | Required decision |
|---|---|---|
| C-PA-11 | Is the append-only correction a new ProcedureRecord-like entity or a separate Correction entity? | Exact logical contract owner and record shape |
| C-PA-12 | What is the correction identity and idempotency key? | Uniqueness scope, replay behavior, and collision handling |
| C-PA-13 | Which exact fields are copied from the original and which may change? | Immutable binding fields versus corrected factual fields |
| C-PA-14 | What is the complete `originalRecordId` binding? | Organization, site, user, procedure, plan/version, and cross-site rejection rules |
| C-PA-15 | What correction reason vocabulary and validation apply? | Required reason code/text contract and owner |
| C-PA-16 | Which actor/role and server-side authority issue `correctedBy` and `correctedAt`? | Role binding, authentication, authorization, and timestamp source |
| C-PA-17 | How is correction history read and presented? | Original-to-correction traversal and ordering contract |
| C-PA-18 | What is the lifecycle relationship? | Explicit no-op or named audit/lifecycle event; no cancellation reinterpretation |
| C-PA-19 | What are the physical schema and mapping requirements? | Deferred until a later schema decision; no mutation in this slice |
| C-PA-20 | What is the write and reconciliation gate? | Separate Human LIVE WRITE GO after implementation and verification evidence |

These unresolved questions keep implementation unauthorized. They do not
reopen D1-D4.

## 7. Exact acceptance boundary

This Human Decision accepts only D1-D4 and the listed constraints. It does
**not** authorize implementation or a write. The accepted boundary is:

```text
correction persistence: allowed / disallowed
authorized role(s): exact logical role and binding owner
mutation model: immutable original + append-only correction, or another explicit model
original binding: exact identity fields and site boundary
reason / actor / timestamp authority: exact source
lifecycle relation: explicit no-op or named event semantics
failure vocabulary: definite failure and outcome unknown handling
SharePoint WRITE gate: named later gate and required evidence
liveWriteAuthorized before that later gate: false
```

The following would exceed the acceptance boundary and require a separate
Human Gate:

- adding a correction save button or connecting its handler;
- changing `ProcedureRecord`, DTO, schema, or SharePoint mapping;
- creating, updating, or deleting any SharePoint item;
- changing cancellation or lifecycle semantics;
- Deploy or host mutation;
- changing `#448` state or posting Issue/PR mutations.

## 8. Next candidate: read-only only

The only next-stage candidate presented by this packet is:

```text
FIELD-STAFF-CORRECTION-PERSISTENCE-EXACT-SLICE-DEFINITION-1
Mode: READ-ONLY ONLY
Purpose: define the exact correction persistence contract boundary
Implementation Start: NOT AUTHORIZED
Schema mutation: NOT AUTHORIZED
SharePoint WRITE: NOT AUTHORIZED
LIVE WRITE: NOT AUTHORIZED
Deploy: NOT AUTHORIZED
Issue mutation: NOT AUTHORIZED
```

No alternative next slice is selected here.

## 9. Implementation disposition

```text
Implementation possible now: NO
Reason: correction persistence/supersede contract and authority binding are not accepted;
        ProcedureRecord v1 explicitly remains CREATE-ONLY.

Source implementation: HOLD
Schema / DTO / adapter implementation: HOLD
SharePoint WRITE: HOLD
liveWriteAuthorized: false
Next: FIELD-STAFF-CORRECTION-PERSISTENCE-EXACT-SLICE-DEFINITION-1 (READ-ONLY ONLY)
```

This slice does not close #448. Cancellation and runtime evidence remain
independent residuals. Runtime evidence stays PARKED under
`RUNTIME_EVIDENCE_UNVERIFIED / SOURCE EVIDENCE PASS`.
