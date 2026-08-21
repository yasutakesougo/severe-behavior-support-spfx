# CANCEL-SLICE-E-PHYSICAL-NAMING-ACCEPTANCE-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: CANCEL-SLICE-E-PHYSICAL-NAMING-ACCEPTANCE-1
Kind: Human Acceptance / LOCK（scoped physical naming / types / GUID authority only）
Decision ID: Decision-CANCEL-SLICE-E-PHYSICAL-NAMING-1
Status: ACCEPTED / LOCKED（scoped）
BASE: main@c6235bfd3b9e4d066058ce61459773eafc500633
PR: #474
Selection HEAD（reconciled）:
  705e90be4d0f96060a5fbd0e61a6983802a5f35d
Upstream Selection:
  CANCEL-SLICE-E-PHYSICAL-NAMING-SELECTION-1 = SELECTED / CONFIRMED
  docs/architecture/cancel-slice-e-physical-naming-selection-1.md
Gate Reconciliation:
  CANCEL-SLICE-E-PHYSICAL-NAMING-GATE-RECONCILIATION-1
  P1-1 normalized Selection=SELECTED；this unit now consumes ACCEPT / LOCK
OWNER: #448
Human Selection GO: YES（prior）
Human ACCEPT / LOCK GO: YES（this packet）
Human Decision: A. ACCEPT / LOCK
Implementation Start: NOT AUTHORIZED
Schema mutation / SharePoint WRITE / LIVE WRITE: HOLD
Production Binding activation / Deploy: HOLD
Ready / Merge: NOT AUTHORIZED / NOT RUN
#475: NOT AUTHORIZED by this unit
Provisioning: NOT AUTHORIZED by this unit
Issue mutation: FORBIDDEN
Agent auto-accept: N/A（this packet records Human Acceptance）
```

## 0. How to read

This packet records Human Acceptance / LOCK of the reconciled Selection
（E-P1..E-P4）as Slice E scoped physical authority.

```text
ACCEPTED / LOCKED（scoped naming）
  ≠ Ready
  ≠ Merge
  ≠ #475
  ≠ Provisioning
  ≠ SharePoint WRITE
  ≠ LIVE WRITE
  ≠ Production Binding
  ≠ Deploy
  ≠ Implementation Start
```

Selection record（SELECT only）remains in
[`cancel-slice-e-physical-naming-selection-1.md`](./cancel-slice-e-physical-naming-selection-1.md).
This Acceptance unit is the LOCK authority.

## 1. Human Acceptance record

```text
CANCEL-SLICE-E-PHYSICAL-NAMING-ACCEPTANCE-1

repository:
  yasutakesougo/severe-behavior-support-spfx
PR:
  #474
Selection HEAD:
  705e90be4d0f96060a5fbd0e61a6983802a5f35d
Selection: CONFIRMED
Human Decision: A. ACCEPT / LOCK

ACCEPTED / LOCKED:
  E-P1 = LN-1
  E-P2 = Package A / life*
  E-P3 = TP-1
  E-P4 = PG-3 test-only observed GUID
```

NOT CHOSEN:

```text
B. REJECT → Selection remains SELECTED / NOT LOCKED；再 Decision
```

## 2. ACCEPTED / LOCKED scope

### E-P1 — LN-1

```text
List Display Name / Title invariant:
  SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS

Display Name is NOT List identity.
LOOKUP-B remains: stable identity = List GUID.
server-relative URL is NOT List identity.
```

### E-P2 — Package A / `LE-MAP-NAMES-LIFE-1`

| Mapping ID | Logical field | Internal Name | Required | Unique / index |
|---|---|---|---|---|
| MAP-LE-000 | schemaVersion | `lifeSchemaVersion` | 必須 | 非 unique |
| MAP-LE-001 | LifecycleEventId | `lifeLifecycleEventId` | 必須 | unique + indexed |
| MAP-LE-002 | LifecycleIdempotencyKey | `lifeLifecycleIdempotencyKey` | 必須 | unique + indexed |
| MAP-LE-003 | LifecyclePayloadFingerprint | `lifeLifecyclePayloadFingerprint` | 必須 | 非 unique |
| MAP-LE-004 | eventType | `lifeEventType` | 必須 | 非 unique |
| MAP-LE-005 | targetRecordId | `lifeTargetRecordId` | 必須 | indexed |
| MAP-LE-006 | replacementRecordId | `lifeReplacementRecordId` | 任意 | 非 unique |
| MAP-LE-007 | recordedAt | `lifeRecordedAt` | 必須 | 非 unique |
| MAP-LE-008 | recordedBy | `lifeRecordedBy` | 必須 | 非 unique |
| MAP-LE-009 | reason | `lifeReason` | 任意 | 非 unique |

```text
DELTA vs OBSERVED kiosk test list:
  lifeSchemaVersion was ABSENT on the OBSERVED list.
  It is now REQUIRED by this LOCKED mapping.
  Adding the column requires a separate Human Provisioning GO.
  This Acceptance does not authorize that provisioning.
```

Japanese column Display Names: **DEFERRED**（ops labels only; not identity）.

### E-P3 — TP-1

| Internal Name | Type | MaxLength / Choice | Notes |
|---|---|---|---|
| `lifeSchemaVersion` | Text | 255 | accepted value `1.0.0` |
| `lifeLifecycleEventId` | Text | 255 | unique + indexed（SHA-256 hex=64 fits） |
| `lifeLifecycleIdempotencyKey` | Text | 255 | unique + indexed |
| `lifeLifecyclePayloadFingerprint` | Text | 255 | non-unique |
| `lifeEventType` | Choice | `SUPERSEDE` \| `CANCEL` | FillInChoice=false; no other tokens |
| `lifeTargetRecordId` | Text | 255 | indexed |
| `lifeReplacementRecordId` | Text | 255 | optional; CANCEL → absent |
| `lifeRecordedAt` | Text | 255 | ISO DateTime string（ProcedureRecord D4=A） |
| `lifeRecordedBy` | Text | 255 | Slice B actor semantics unchanged |
| `lifeReason` | Text | 255 | optional |
| `Title` | Title（system） | — | **TITLE-NONE**: optional / non-required; adapter does not write; not contract identity |

```text
NOT ADOPTED:
  UTF16BE encoding
  derived DateTime twin column for recordedAt
  Audit-style MaxLength 64-only identity columns（255 is LOCKED）
```

### E-P4 — PG-3（test-only observed GUID）

```text
PG-3 ACCEPTED / LOCKED（scoped）:

OBSERVED test-only List GUID
  41274293-18d0-4f57-8a45-4f063522bcc7
is the LOCKED List identity for the already-provisioned test-only list
  Title / display invariant = SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS
recorded in:
  docs/architecture/kiosk-test-only-schema-provisioning.md

Binding model remains LOOKUP-B shape:
  expected Site identity + expected List GUID
  Display Name alone is insufficient authority
  List title may be verified as an additional invariant
```

```text
PG-3 scoped LOCK does NOT mean:
  Ready / Merge
  #475 authorization
  Provisioning GO
  SharePoint WRITE
  LIVE WRITE
  Production Binding activation for facility business sites
  Deploy / App Catalog
  Implementation Start
  copying the test-only GUID onto a different Site without Human GO
  skipping lifeSchemaVersion provisioning delta
```

## 3. Locked mapping summary（still NOT implementation-authorized）

When Implementation Start is later authorized by a **separate** Human GO,
adapter expected schema must use exactly:

```text
List title invariant: SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS
List GUID（test-only OBSERVED）: 41274293-18d0-4f57-8a45-4f063522bcc7
Internal Names: lifeSchemaVersion, lifeLifecycleEventId,
  lifeLifecycleIdempotencyKey, lifeLifecyclePayloadFingerprint,
  lifeEventType, lifeTargetRecordId, lifeReplacementRecordId,
  lifeRecordedAt, lifeRecordedBy, lifeReason
Types: TP-1 as table above
Title: TITLE-NONE
```

Hard-coding these names before Implementation Start remains unauthorized for
adapter delivery. This document only LOCKs the Human naming Decision.

## 4. Explicit non-goals（this Decision does NOT authorize）

```text
Ready
Merge
#475
Provisioning
SharePoint WRITE
LIVE WRITE
Production Binding
Deploy
Implementation Start
#448 / #443 / #444 mutation
ProcedureRecordLifecycleEvent@1.0.0 logical change
```

## 5. Acceptance result

```text
Decision:              ACCEPTED / LOCKED（scoped physical naming）
E-P1:                  LN-1 LOCKED
E-P2:                  LE-MAP-NAMES-LIFE-1 LOCKED
E-P3:                  TP-1 LOCKED
E-P4:                  PG-3 LOCKED（test-only OBSERVED GUID authority）
lifeSchemaVersion:     REQUIRED（provisioning delta vs OBSERVED；HOLD）
Implementation Start:  NOT AUTHORIZED
Ready:                 NOT AUTHORIZED / NOT RUN
Merge:                 NOT AUTHORIZED / NOT RUN
#475:                  NOT AUTHORIZED by this unit
Provisioning:          NOT AUTHORIZED / HOLD
SharePoint mutation:   HOLD
LIVE WRITE:            HOLD
Production Binding:    HOLD
Deploy:                HOLD
```

## 6. NEXT

```text
Human:
  optional later units（each separate GO）:
    Provisioning GO for lifeSchemaVersion delta
    Implementation Start GO for CANCEL adapter only
    Ready / Merge（separate；not this Acceptance）

Agent:
  STOP after recording this Acceptance unless a later unit explicitly authorizes
  do not Ready / Merge / implement / provision / LIVE WRITE / Deploy from this LOCK alone
```
