# CANCEL-SLICE-E-PHYSICAL-NAMING-SELECTION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: CANCEL-SLICE-E-PHYSICAL-NAMING-SELECTION-1
Kind: Human Selection only（physical naming / types / GUID authority）
Decision ID: Decision-CANCEL-SLICE-E-PHYSICAL-NAMING-1
Status: SELECTED（scoped）
Acceptance unit: CANCEL-SLICE-E-PHYSICAL-NAMING-ACCEPTANCE-1 = NOT YET
BASE: main@c6235bfd3b9e4d066058ce61459773eafc500633
Upstream preparation:
  CANCEL-SLICE-E-PHYSICAL-NAMING-DECISION-PREPARATION-1
  CANCEL-SLICE-E-PHYSICAL-CONTRACT-DEFINITION-1
OWNER: #448
Human Selection GO: YES
Human ACCEPT / LOCK GO: NOT ESTABLISHED（separate unit；see Gate Reconciliation）
Implementation Start: NOT AUTHORIZED
Schema mutation / SharePoint WRITE / LIVE WRITE: HOLD
Production Binding activation / Deploy: HOLD
Issue mutation: FORBIDDEN
Agent auto-accept / auto-LOCK: FORBIDDEN
Gate Reconciliation: CANCEL-SLICE-E-PHYSICAL-NAMING-GATE-RECONCILIATION-1
```

## 0. How to read

This packet records Human Selection of E-P1..E-P4 only.

```text
SELECTED（scoped naming）
  ≠ ACCEPTED / LOCKED
  ≠ CANCEL-SLICE-E-PHYSICAL-NAMING-ACCEPTANCE-1
  ≠ Implementation Start
  ≠ adapter code GO
  ≠ SharePoint schema mutation GO
  ≠ LIVE WRITE GO
  ≠ Production Binding activation
  ≠ Deploy
```

Candidate comparison remains in
[`cancel-slice-e-physical-naming-decision-preparation-1.md`](./cancel-slice-e-physical-naming-decision-preparation-1.md)
（CONSUMED by this Selection for SELECT only）.

Gate collapse correction:
[`cancel-slice-e-physical-naming-gate-reconciliation-1.md`](./cancel-slice-e-physical-naming-gate-reconciliation-1.md).

## 1. Human Selection record

Verbatim Human Selection packet（Selection unit only）:

```text
CANCEL-SLICE-E-PHYSICAL-NAMING-SELECTION-1

E-P1: A
E-P2: A
E-P3: ADOPT RECOMMENDED
E-P4: C

Decision:
SELECTED / LOCKED

Implementation Start:
NOT AUTHORIZED
```

```text
CONFIRMED from that packet:
  Unit id = CANCEL-SLICE-E-PHYSICAL-NAMING-SELECTION-1
  Codes E-P1..E-P4 as above
  Implementation Start = NOT AUTHORIZED
  Human Selection GO = YES

NOT ESTABLISHED as a separate Human unit:
  CANCEL-SLICE-E-PHYSICAL-NAMING-ACCEPTANCE-1
  explicit ACCEPT / LOCK consuming Acceptance

Normalization（Gate Reconciliation P1-1）:
  Selection Decision recorded here = SELECTED
  LOCK language under Selection unit is NOT treated as Acceptance GO
  Acceptance = NOT YET
```

### ID mapping（preparation packet → Selection）

| Human code | Maps to preparation ID | Selected meaning（not LOCKED） |
|---|---|---|
| E-P1 **A** | **LN-1** | List display name / title = `SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS` |
| E-P2 **A** | **Package A / `LE-MAP-NAMES-LIFE-1`** | Internal Names = `life*` package（+ `lifeSchemaVersion`） |
| E-P3 **ADOPT RECOMMENDED** | **TP-1** | Types / max lengths / Choice / TITLE-NONE as recommended |
| E-P4 **C** | **PG-3** | OBSERVED test-only List GUID is the SELECTED List identity for that already-provisioned test-only list |

## 2. SELECTED scope（pending Acceptance）

### E-P1 — List display name（LN-1）

```text
List Display Name / Title invariant:
  SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS

Display Name is NOT List identity.
LOOKUP-B remains: stable identity = List GUID.
server-relative URL is NOT List identity.
```

### E-P2 — Internal Names（Package A / LE-MAP-NAMES-LIFE-1）

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
  It is REQUIRED by this SELECTED mapping（pending Acceptance）.
  Adding the column requires a separate Human Provisioning GO.
  This Selection does not authorize that provisioning.
```

Japanese column Display Names: **DEFERRED**（ops labels only; not identity）.

### E-P3 — Types / max lengths（TP-1）

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
NOT SELECTED:
  UTF16BE encoding
  derived DateTime twin column for recordedAt
  Audit-style MaxLength 64-only identity columns（255 is SELECTED）
```

Unique / index rows above are **mapping requirements**. They do not claim
SharePoint unique constraints have been re-provisioned or re-observed after
`lifeSchemaVersion` addition.

### E-P4 — GUID / provisioning authority（PG-3）

```text
PG-3 SELECTED（scoped；NOT YET LOCKED）:

OBSERVED test-only List GUID
  41274293-18d0-4f57-8a45-4f063522bcc7
is the SELECTED List identity for the already-provisioned test-only list
  Title / display invariant = SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS
recorded in:
  docs/architecture/kiosk-test-only-schema-provisioning.md

Binding model remains LOOKUP-B shape:
  expected Site identity + expected List GUID
  Display Name alone is insufficient authority
  List title may be verified as an additional invariant

Schema-definition evidence source:
  PS-3 = kiosk-test-only-schema-provisioning.md（OBSERVED）
  plus this SELECTED mapping table（includes lifeSchemaVersion delta）
```

```text
PG-3 SELECTED does NOT mean:
  ACCEPTED / LOCKED（Acceptance unit still NOT YET）
  Production Binding activation for facility business sites
  LIVE WRITE authorization
  Implementation Start
  Deploy / App Catalog
  copying the test-only GUID onto a different Site without Human GO
  skipping lifeSchemaVersion provisioning delta
```

```text
Still HOLD / separate GO required:
  CANCEL-SLICE-E-PHYSICAL-NAMING-ACCEPTANCE-1（Human ACCEPT / LOCK）
  Human Provisioning GO（add lifeSchemaVersion; verify unique/index）
  Implementation Start（adapter）
  LIVE WRITE GO
  Production Binding activation for non-test sites
  Deploy
```

NOT SELECTED:

| ID | Meaning | Result |
|---|---|---|
| LN-2 / LN-3 / LN-4 / LN-X | other list display names | NOT SELECTED |
| Package B / C / D / X | other Internal Name packages | NOT SELECTED |
| T2 / T3 type families | alternate type packages | NOT SELECTED |
| PG-1+PG-4 as sole composition | recommended prep default | NOT SELECTED（Human chose PG-3） |
| PG-2 | Display Name lookup as identity | NOT SELECTED / remains FORBIDDEN |

## 3. Selected mapping summary（not authority until Acceptance）

After Acceptance LOCKs this mapping, and only after a later Implementation Start
GO, adapter expected schema would use exactly:

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

Hard-coding these names before Acceptance + Implementation Start remains
unauthorized for adapter delivery. This document only records SELECTED values.

## 4. Unchanged / OUT

```text
ProcedureRecordLifecycleEvent@1.0.0 logical contract: UNCHANGED
Slice A–D authority: UNCHANGED
OrganizationId / SiteId / UserId as event payload fields: NOT ADDED
SUPERSEDE persistence wiring: OUT
ProcedureRecord UPDATE / DELETE: FORBIDDEN
Lifecycle UPDATE / DELETE: FORBIDDEN
#443 / #444 / #448 close: OUT
#475 / adapter code: OUT（this Gate Reconciliation does not touch）
```

## 5. Selection result

```text
Decision:              SELECTED（scoped physical naming）
Acceptance:            NOT YET（CANCEL-SLICE-E-PHYSICAL-NAMING-ACCEPTANCE-1）
E-P1:                  LN-1 SELECTED
E-P2:                  LE-MAP-NAMES-LIFE-1 SELECTED
E-P3:                  TP-1 SELECTED
E-P4:                  PG-3 SELECTED（test-only OBSERVED GUID authority）
lifeSchemaVersion:     REQUIRED（provisioning delta vs OBSERVED；still HOLD）
LOCKED:                NO
Implementation Start:  NOT AUTHORIZED
SharePoint mutation:   HOLD
LIVE WRITE:            HOLD
Production Binding:    HOLD
Deploy:                HOLD
Ready:                 BLOCKED（Acceptance gate open）
```

## 6. NEXT

```text
Human:
  CANCEL-SLICE-E-PHYSICAL-NAMING-ACCEPTANCE-1
  → ACCEPT / LOCK scoped mapping only（or REJECT / revise Selection）
  do not treat Selection alone as LOCK authority

Agent:
  STOP after Gate Reconciliation unless Human Acceptance GO is explicit
  do not implement adapter / LIVE WRITE / Deploy from Selection alone
  do not Ready / Merge from this unit
```
