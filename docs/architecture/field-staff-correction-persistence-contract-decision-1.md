# FIELD-STAFF-CORRECTION-PERSISTENCE-CONTRACT-DECISION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: FIELD-STAFF-CORRECTION-PERSISTENCE-CONTRACT-DECISION-1
Kind: read-only decision preparation packet
Parent: FIELD-STAFF-CORRECTION-PERSISTENCE-AUTHORITY-1
Authority: D1=B / D2=A / D3=B / D4=B
ProcedureRecord: CREATE-ONLY / IMMUTABLE
Correction: APPEND-ONLY / originalRecordId-bound
liveWriteAuthorized: FALSE
Decision status: SELECTED / LOCKED
Implementation / tests / schema mutation / WRITE / Deploy: FORBIDDEN
```

## 1. Decision rule

This packet presents options and recommendations for C1-C9. A recommendation
is not a Human selection. No option is selected or locked by this packet.

Existing authority decisions remain fixed:

```text
D1=B: append-only correction bound to originalRecordId
D2=A: original ProcedureRecord remains immutable / CREATE-ONLY
D3=B: implementation needs a separate Implementation Start GO
D4=B: liveWriteAuthorized remains false; SharePoint WRITE needs a separate GO
```

## 2. C1 Entity shape

### Existing evidence

- `ProcedureRecord` is the canonical execution fact and v1 persistence is
  `CREATE-ONLY`; update, delete, and correction/supersede are not adopted.
- The existing correction UI only presents the original occurrence and record
  context; it does not expose a persistence contract.
- `SnapshotCorrection` and AssessmentSnapshot provide a correction-link
  pattern, but they are not ProcedureRecord authority.

### Options

| Option | Shape | Risks / tradeoffs |
|---|---|---|
| A | Separate `Correction` entity with `originalRecordId` | Clean immutability boundary; requires a new contract, identity, mapping, and read traversal |
| B | New ProcedureRecord-like append-only version with a correction link | Reuses record vocabulary; risks confusing a correction with a new execution fact and requires explicit version semantics |
| C | Add correction fields to the original ProcedureRecord | Small physical shape; violates D2 and creates update/overwrite pressure; not compatible with the locked authority |

### Recommended selection

`A — separate Correction entity`, with an explicit required
`originalRecordId`. This is a recommendation only.

### Dependencies

Blocks and is blocked by C2, C3, C6, C8. C1 must be selected before a stable
contract or physical mapping can be written.

## 3. C2 Identity / idempotency

### Existing evidence

- ProcedureRecord v1 requires `RecordId` and `IdempotencyKey` dual lookup
  before create.
- A lookup uncertainty must not be treated as EMPTY; uncertain outcomes remain
  `save_outcome_unknown` and require reconciliation.
- `originalRecordId` is required by D1 but is not itself a complete correction
  identity or idempotency rule.

### Options

| Option | Identity model | Risks / tradeoffs |
|---|---|---|
| A | Server-issued opaque `correctionId` plus client/request `idempotencyKey`; uniqueness scoped to site | Separates resource identity from retry identity; needs two-key lookup and server minting |
| B | Deterministic key from original record plus correction payload | Natural replay behavior; correction retries with changed reason or timestamp become conflicts and key material must be locked |
| C | `originalRecordId` alone identifies one correction | Simple; cannot represent multiple corrections or safely distinguish retries from a second correction |
| D | Deterministic `CorrectionId` plus separate `IdempotencyKey`, using a correction-specific namespace, versioned canonical material containing `originalRecordId`, SHA-256, and reusable U+001F framing; the submit payload is frozen for retries, which reuse both identifiers and never auto-create a new identity after an unknown outcome | Makes correction identity and retry identity deterministic and separate; requires the canonical material and payload-freeze rules to remain stable |

### Recommended selection

`D — deterministic correction identity plus separate idempotency key`, using a
correction-specific namespace and the stated canonicalization, hashing, framing,
payload-freeze, retry, and unknown-outcome rules. This is a recommendation only.

### Dependencies

Depends on C1 and C3. Must align with C6 history and C9 write/reconciliation
gates.

## 4. C3 Field policy

### Existing evidence

- ProcedureRecord identity/context includes organization, site, user, record,
  procedure, plan/version, clocks, actor, and factual result.
- Historical plan/version must not be rebound to the current Active version.
- D2 forbids replacing or updating the original record.

### Options

| Option | Field policy | Risks / tradeoffs |
|---|---|---|
| A | Copy the original binding/context; permit correction of factual result and selected execution fields; retain original snapshot | Useful correction scope; requires a precise allowlist and can affect factual meaning |
| B | Correct only a narrowly defined result field; all timestamps, actor, and context remain original | Lowest semantic surface; may not correct genuine recording errors outside result |
| C | Treat correction as a complete replacement payload linked to the original | Flexible; high risk of silent context rebinding and accidental overwrite semantics |
| D | Permit only v1 factual corrections to `result` and `performedAt`; retain `reason`, `correctedAt`, and `correctedBy` as correction metadata; keep the original organization, site, user, record, procedure, plan/version, recording time, and recording actor binding/context immutable; derived/system fields are not editable input | Explicitly bounds correction without rebinding historical context or allowing derived values to be supplied by the client |

### Recommended selection

`D — v1 factual allowlist of result and performedAt`, with correction metadata
separate and the original identity/context binding immutable. Derived/system
fields are not editable input. This is a recommendation only.

### Dependencies

Depends on C1 and C4. Must be fixed before validation, fingerprinting, and C2
idempotency material can be defined.

## 5. C4 Reason

### Existing evidence

- Existing contracts use reason codes as validated, non-empty tokens.
- `SnapshotCorrection` requires `reasonCode` and permits `reasonText`.
- A correction reason is not currently part of the ProcedureRecord v1 shape.

### Options

| Option | Reason model | Risks / tradeoffs |
|---|---|---|
| A | Required controlled `reasonCode` plus optional non-empty `reasonText` | Auditable and queryable; requires vocabulary owner and governance for new codes |
| B | Required free-text reason only | Easy to start; inconsistent, difficult to report, and weak for policy enforcement |
| C | Controlled `reasonCode` only | Consistent and compact; may not capture enough operational context |

### Recommended selection

`A — required reasonCode plus optional reasonText`, using the existing reason
code validation boundary and a separately owned vocabulary. This is a
recommendation only.

### Dependencies

Depends on C1 and C3. Reason authority and actor authority in C5 must be kept
distinct.

## 6. C5 Actor authority

### Existing evidence

- ProcedureRecord v1 permits create for a SUPPORTER with selected-site
  membership, but correction authority is not included in that decision.
- The UI cannot establish authorization merely by displaying `recordedBy` or
  accepting a client value.
- Governance is fail-closed for roles and unlisted operations.

### Options

| Option | Actor model | Risks / tradeoffs |
|---|---|---|
| A | Reuse ordinary SUPPORTER create authority for correction | Operationally simple; silently expands an existing role beyond its accepted scope |
| B | Dedicated correction role/permission, with server-derived actor and timestamp | Explicit and auditable; requires role binding and operational ownership |
| C | Original record actor only may correct | Strong attribution continuity; impractical for absence/transfer and requires identity lifecycle rules |
| D | Supervisor approval required before a permitted correction actor executes | Strong control; adds approval state, latency, and a separate approval contract |
| E | Derive `correctedBy` from the authenticated identity and use only the existing authorized FIELD_STAFF correction path; reject closed authorization/authentication with fail-closed behavior, add no role vocabulary, and do not reuse unrelated `SERVICE_MANAGER` semantics | Preserves the existing authority boundary without accepting an editable actor string or inventing a new role |

### Recommended selection

`E — existing authorized FIELD_STAFF correction path`, with `correctedBy`
derived from authenticated identity and fail-closed authentication/authorization.
No new role vocabulary or unrelated `SERVICE_MANAGER` semantics are introduced.
This is a recommendation only.

### Dependencies

Depends on C1 and C4. Must be accepted before C9 can define an operational
write gate.

## 7. C6 History semantics

### Existing evidence

- D1 requires append-only storage and D2 requires retaining the original.
- Review reaches the canonical ProcedureRecord by stable `RecordId`.
- AssessmentSnapshot history uses an original plus new version pattern, but
  ProcedureRecord correction history is not yet defined.

### Options

| Option | History model | Risks / tradeoffs |
|---|---|---|
| A | One original with an ordered list of append-only corrections; latest is a projection only | Clear lineage; requires ordering, multiple-correction, and supersession rules |
| B | Single correction maximum per original | Simple; blocks later correction or requires a new policy for correction-of-correction |
| C | Correction chain where each correction points to the immediately prior version | Detailed lineage; more complex traversal and potential chain corruption |

### Recommended selection

`A — original plus ordered append-only corrections`, with no mutation of the
original and no implicit replacement claim. Ordering should use authoritative
correction time plus a stable correction identity tie-breaker. This is a
recommendation only.

### Dependencies

Depends on C1, C2, and C5. Must be resolved before the read model and duplicate
handling are implementable.

## 8. C7 Lifecycle relationship

### Existing evidence

- Cancellation is an independent open residual and its semantics must not be
  changed by this slice.
- Existing ProcedureRecord persistence does not adopt update or delete.
- Audit/event persistence has separate contracts and must not be conflated with
  the factual ProcedureRecord result.

### Options

| Option | Lifecycle model | Risks / tradeoffs |
|---|---|---|
| A | Correction is a data-history event only; occurrence/lifecycle state is unchanged | Safest separation; consumers must explicitly read correction history |
| B | Correction emits a named audit event but does not mutate lifecycle state | Strong traceability; requires audit event ownership and correlation contract |
| C | Correction supersedes occurrence state or triggers cancellation/reopen | User-visible semantics; directly conflicts with the current cancellation hold |

### Recommended selection

`B — named audit event with no lifecycle mutation`, subject to a separate audit
contract decision. If that contract is not available, use A temporarily rather
than inventing event semantics. This is a recommendation only.

### Dependencies

Depends on C1 and C6. C must not be accepted without explicit cancellation
separation.

## 9. C8 Physical schema

### Existing evidence

- SharePoint mapping rules require confirmed site, list, internal names, types,
  and conversions; unknown values must not be guessed.
- ProcedureRecord v1 physical write requires a later gate and GET read-back.
- Current task forbids schema mutation and SharePoint WRITE.

### Options

| Option | Physical model | Risks / tradeoffs |
|---|---|---|
| A | Dedicated Correction list/table with original and correction identity columns | Best separation and queryability; requires new provisioning, mapping, permissions, and retention decisions |
| B | Same ProcedureRecord list with correction-specific columns/items | Easier co-location; risks mixing canonical facts with correction records and weakening list-level policy |
| C | Store correction data inside an existing free-text/JSON field | Minimal columns; poor validation/queryability and high corruption/size risk |
| D | No physical persistence; presentation-only correction | No write risk; does not satisfy a future persistence requirement |

### Recommended selection

`A — dedicated Correction list/table`, but only as a logical recommendation.
No list, column, internal name, or schema value is selected by this packet.

### Dependencies

Depends on C1-C7. Physical mapping must follow contract acceptance and requires
a separate schema/provisioning decision and Human GO.

## 10. C9 Write gate

### Existing evidence

- D3 requires a separate Implementation Start GO.
- D4 keeps `liveWriteAuthorized=false` through implementation and test work.
- Governance forbids SharePoint mutation and Deploy without the applicable Human
  authorization.
- `save_outcome_unknown` must not be collapsed or automatically retried.

### Options

| Option | Gate model | Risks / tradeoffs |
|---|---|---|
| A | One combined Implementation Start and SharePoint WRITE GO | Faster; collapses source readiness and production mutation authority |
| B | Separate gates: contract acceptance -> Implementation Start -> synthetic verification -> physical schema/mapping acceptance -> scoped SharePoint WRITE GO | Strong separation and auditability; slower and requires multiple evidence packets |
| C | Allow a test-tenant write under Implementation Start GO | Useful transport evidence; still a real mutation and needs explicit environment/resource authorization |

### Recommended selection

`B — separate gates`. Implementation/test authorization must never mint
`liveWriteAuthorized`; only a later, scoped Human SharePoint WRITE GO may do so.
This is a recommendation only.

### Dependencies

Depends on all C1-C8. C9 cannot be finalized while the correction contract and
physical mapping remain unresolved.

## 11. Human Selection

The Human Selection GO records and locks exactly one option for each C-item:

```text
C1=A
C2=D
C3=D
C4=B
C5=E
C6=A
C7=A
C8=A
C9=B
```

```text
Human selections: C1=A / C2=D / C3=D / C4=B / C5=E / C6=A / C7=A / C8=A / C9=B
Decision status: SELECTED / LOCKED
```

The selected semantics are fixed as follows:

- C1: independent append-only correction entity bound to `originalRecordId`.
- C2: deterministic `CorrectionId` plus separate `IdempotencyKey`; correction-specific namespace; same logical retry reuses both identities; unknown outcome does not create a new identity automatically.
- C3: v1 editable factual fields are `result` and `performedAt`; correction metadata is `reason`, `correctedAt`, and `correctedBy`; original binding/context is immutable. C3 CROSS-DATE POLICY Option A (SELECTED / LOCKED): `performedAt` Asia/Tokyo calendar day must equal original `ProcedureRecord.LocalDate`; cross-date REJECT; original `LocalDate` IMMUTABLE; cross-date semantics OUT OF v1. See `field-staff-correction-persistence-c3-cross-date-policy-1.md`.
- C4: required, non-empty human-entered free-text reason; no v1 reason taxonomy.
- C5: `correctedBy` derives from authenticated FIELD_STAFF identity; client actor text is forbidden; authorization uncertainty fails closed; no new role vocabulary.
- C6: multiple corrections are append-only; original and all correction history remain preserved; correction UPDATE/DELETE is forbidden.
- C7: correction does not mutate ProcedureRecord lifecycle; no automatic `ProcedureRecordLifecycleEvent`; cancellation and supersede semantics are unchanged.
- C8: dedicated `ProcedureRecordCorrection` physical schema/list; no correction rows mixed into the ProcedureRecord list; provisioning is a separate gate.
- C9: staged write authorization; every SharePoint WRITE stage requires its separate Human GO, with production binding/LIVE WRITE last.

## 12. Option realignment reassessment

The amendment adds one explicit option for each previously unrepresentable
semantic bundle without changing any existing option definition:

| Item | Exact option | Reassessment |
|---|---|---|
| C1 | A | Existing option unchanged; exact semantic match |
| C2 | D | New single option; deterministic correction identity and separate retry identity |
| C3 | D | New single option; v1 factual allowlist plus immutable original binding/context |
| C4 | B | Existing option unchanged; exact semantic match |
| C5 | E | New single option; authenticated FIELD_STAFF authority with fail-closed checks |
| C6 | A | Existing option unchanged; exact semantic match |
| C7 | A | Existing option unchanged; exact semantic match |
| C8 | A | Existing option unchanged; exact semantic match |
| C9 | B | Existing option unchanged; exact semantic match |

```text
All C1-C9 map to exactly one option: YES
Dependency conflict: NONE
D1=B / D2=A / D3=B / D4=B: CONSISTENT
ProcedureRecord CREATE-ONLY / IMMUTABLE: CONSISTENT
liveWriteAuthorized: FALSE: PRESERVED
Human selections: RECORDED IN SECTION 11
```

This reassessment establishes option availability only. It is not a Human
Selection evidence by itself; the Human Selection is recorded in the preceding
section. It does not authorize implementation or any mutation.

## 13. Locked invariants and next eligibility

```text
ProcedureRecord: CREATE-ONLY / IMMUTABLE
Correction: APPEND-ONLY / originalRecordId-bound
ProcedureRecord UPDATE: FORBIDDEN
Correction UPDATE / DELETE: FORBIDDEN
lifecycle semantics: UNCHANGED
cancellation semantics: UNCHANGED
liveWriteAuthorized: FALSE
SharePoint WRITE: NOT AUTHORIZED
Deploy: NOT AUTHORIZED
Implementation: NOT AUTHORIZED
Schema mutation: NOT AUTHORIZED
```

`FIELD-STAFF-CORRECTION-PERSISTENCE-EXACT-SLICE-DEFINITION-1` can now be safely
defined without further semantic invention. Its eligibility is `YES`, but that
successor remains a separate decision/reassessment and does not authorize an
Implementation Start.

## 14. Packet disposition

```text
C1-C9: SELECTED / LOCKED
Human selections: C1=A / C2=D / C3=D / C4=B / C5=E / C6=A / C7=A / C8=A / C9=B
Recommendations: EXPLICITLY LABELED, NOT SELECTED
Decision status: SELECTED / LOCKED
Implementation: FORBIDDEN
Tests implementation: FORBIDDEN
Schema mutation: FORBIDDEN
ProcedureRecord UPDATE: FORBIDDEN
Correction UPDATE / DELETE: FORBIDDEN
Correction persistence / WRITE: FORBIDDEN
SharePoint WRITE: FORBIDDEN
Issue mutation: FORBIDDEN
Ready / Merge / Deploy / LIVE WRITE: FORBIDDEN
liveWriteAuthorized: FALSE
Next: FIELD-STAFF-CORRECTION-PERSISTENCE-EXACT-SLICE-DEFINITION-1 / REASSESSMENT ONLY
```

This packet stops here. No source, test, schema, persistence, SharePoint,
Issue, Ready, Merge, Deploy, or LIVE WRITE action is performed.

## 15. C3 CROSS-DATE POLICY amendment

```text
Amendment: C3 CROSS-DATE POLICY
Option A — SAME-LOCAL-DATE ONLY
Status: SELECTED / LOCKED
C3=D: UNCHANGED
Does not authorize implementation
Canonical: field-staff-correction-persistence-c3-cross-date-policy-1.md
```
