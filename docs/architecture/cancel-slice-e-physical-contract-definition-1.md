# CANCEL-SLICE-E-PHYSICAL-CONTRACT-DEFINITION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: CANCEL-SLICE-E-PHYSICAL-CONTRACT-DEFINITION-1
Kind: read-only physical persistence boundary definition
MODE: READ-ONLY
BASE: main@c6235bfd3b9e4d066058ce61459773eafc500633
OWNER: #448
CURRENT:
  Slice A — COMPLETE / CONSUMED
  Slice B — COMPLETE / CONSUMED
  Slice C — COMPLETE / CONSUMED
  Slice D — COMPLETE / CONSUMED
  Slice E — NOT STARTED
Implementation Start: NOT AUTHORIZED
Physical names: NOT YET LOCKED
Schema mutation / SharePoint WRITE / LIVE WRITE: HOLD
Production Binding / Deploy: HOLD
Issue mutation: FORBIDDEN
```

## 1. Objective

Define the SharePoint physical persistence boundary that stores
`ProcedureRecordLifecycleEvent@1.0.0` CANCEL lifecycle events **without**
changing the existing logical contract.

Slice E does **not** own:

- cancellation semantics
- authorization semantics
- lifecycle identity generation
- idempotency semantics
- final save-state semantics
- FIELD_STAFF presentation

Those remain Slice A–D authority.

## 2. Physical storage model

```text
SELECTED DIRECTION: DEDICATED LIFECYCLE EVENT LIST
```

Reasons:

- ProcedureRecord remains an immutable execution fact
- CANCEL / SUPERSEDE are lifecycle entities distinct from fact rows
- append-only constraints are easier to keep at List scope
- LifecycleEventId / LifecycleIdempotencyKey can hold independent unique constraints
- `targetRecordId` history query stays separated
- lifecycle items are not mixed into the ProcedureRecord List

```text
List display name: NOT YET SELECTED
Internal physical names: NOT YET SELECTED
```

Implementation must not invent names. Naming is owned by
`CANCEL-SLICE-E-PHYSICAL-NAMING-DECISION-PREPARATION-1` → Human Decision.

## 3. Logical → physical required mapping

The physical schema must be able to store the full
`ProcedureRecordLifecycleEvent@1.0.0` shape:

| Logical field | Required physical presence |
|---|---|
| `schemaVersion` | required |
| `LifecycleEventId` | required |
| `LifecycleIdempotencyKey` | required |
| `LifecyclePayloadFingerprint` | required |
| `eventType` | required |
| `targetRecordId` | required |
| `replacementRecordId` | optional |
| `recordedAt` | required |
| `recordedBy` | required |
| `reason` | optional |

CANCEL constraint:

```text
eventType = CANCEL
replacementRecordId = ABSENT
```

SUPERSEDE compatibility:

```text
Physical schema MUST be able to store SUPERSEDE-shaped rows.
This slice's implementation target is CANCEL adapter path only.
SUPERSEDE persistence wiring = OUT
```

## 4. Required physical semantics

| Field | Semantics |
|---|---|
| LifecycleEventId | required; text; unique; indexed |
| LifecycleIdempotencyKey | required; text; unique; indexed |
| LifecyclePayloadFingerprint | required; text |
| eventType | required; Choice or equivalent validated text; vocabulary `SUPERSEDE` \| `CANCEL` |
| targetRecordId | required; text; indexed（`listByTargetRecordId`） |
| replacementRecordId | optional; text; CANCEL absent; SUPERSEDE required |
| recordedAt | required; canonical round-tripable datetime representation |
| recordedBy | required; text; Slice B actor semantics unchanged |
| reason | optional; text |
| schemaVersion | required; text; accepted value `1.0.0` |

## 5. Append-only rule

```text
Allowed:   GET / QUERY / CREATE
Forbidden: UPDATE / DELETE
```

Also forbidden:

```text
ProcedureRecord UPDATE
ProcedureRecord DELETE
Lifecycle event UPDATE
Lifecycle event DELETE
```

## 6. Adapter surface

Implement existing `ProcedureRecordCancellationStoragePort` only:

- `findByLifecycleEventId`
- `findByLifecycleIdempotencyKey`
- `append`
- `listByTargetRecordId`

Do not change the port interface.

Lookup / query / append / CREATE result mapping / readback / idempotency
follow the locked Slice E contract definition in the Human packet that
authorized this unit（dual lookup, fail-closed multi-match / malformed /
wrong binding, CREATE → CREATED / DEFINITE_FAILURE / INDETERMINATE,
readback required for `saved`, no new retry semantics）.

## 7. Site / organization isolation

```text
CURRENT LOGICAL CONTRACT OBSERVATION:
  ProcedureRecordLifecycleEvent@1.0.0 does not contain OrganizationId / SiteId.
```

Slice E must **not** invent `OrganizationId` / `SiteId` / `UserId` as
lifecycle-event payload fields.

```text
PHYSICAL ISOLATION DECISION:
  Use site / list binding as the physical isolation boundary
  unless a separate contract decision expands ProcedureRecordLifecycleEvent.
```

Consequences:

- adapter bound to one expected SharePoint Site
- adapter bound to one expected lifecycle-event List
- fail closed on binding mismatch
- cross-site aggregate querying = OUT

Binding object minimum:

```text
expected Site identity
expected List GUID
```

Display name alone is insufficient authority. List title may be an
additional invariant only.

## 8. Expected implementation area（future）

Candidate path only（not authorized now）:

```text
src/adapters/sharepoint/procedure-record-lifecycle-event/
```

Exact file names are implementation detail.

## 9. Unresolved before Implementation Start

| ID | Item |
|---|---|
| E-P1 | Lifecycle-event List display name |
| E-P2 | Lifecycle-event internal column names |
| E-P3 | Exact SharePoint field types / max lengths |
| E-P4 | Provisioning source for List GUID / field schema |

These are physical naming / provisioning decisions. They must be locked
before implementation may hard-code or verify them.

## 10. Definition result

```text
Logical physical boundary: PASS
Storage model:             DEDICATED LIFECYCLE EVENT LIST
Isolation model:           SITE + LIST BINDING（no new org/site event fields）
Append model:              CREATE ONLY
Lookup model:              DUAL LOOKUP
Readback:                  REQUIRED
Implementation exact scope: DEFINED
Physical names:            NOT YET LOCKED
Implementation Start:      NOT AUTHORIZED
SharePoint mutation:       NONE
LIVE WRITE:                HOLD
Production Binding:        HOLD
Deploy:                    HOLD
```

## 11. OUT

- Slice A–D changes
- correction changes
- ProcedureRecord mutation
- SUPERSEDE UI / SUPERSEDE persistence orchestration
- lifecycle UPDATE / DELETE
- schema provisioning
- tenant mutation
- SharePoint LIVE WRITE
- Production Binding activation
- Deploy
- #443 / #444 mutation
- #448 close
