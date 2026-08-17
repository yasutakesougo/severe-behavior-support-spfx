# KIOSK-SPFX-SCHEMA-CONTRACT-HUMAN-DECISION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-KIOSK-SPFX-SCHEMA-CONTRACT-1
Unit: KIOSK-SPFX-SCHEMA-CONTRACT-HUMAN-DECISION-1
Kind: Human Decision recording
Status: CLOSED / ADOPTED
Human Selection: 2026-08-17
Basis main: 442e26112a51c055f13141c7db2ba038c51ec56c

Input design:
  docs/architecture/kiosk-spfx-schema-contract-design-1.md

Prior compatibility Decision (not reopened):
  docs/architecture/kiosk-spfx-schema-compatibility-human-decision-1.md
  D1=C  D2=B  D3=B APPEND-ONLY  CONFIRMED

This recording
  ≠ Implementation Start
  ≠ TypeScript / SPFx
  ≠ ProcedureRecord v1 mutation
  ≠ physical List / column design
  ≠ new SharePoint List
  ≠ provisioning / migration / backfill
  ≠ UPDATE / PATCH / MERGE / DELETE
  ≠ LIVE WRITE GO
  ≠ production binding
  ≠ Deploy / App Catalog
  ≠ git commit / push / PR
```

---

## 1. Authority

```text
Decision authority:          Human
Implementation:              NOT GIVEN
Physical schema:             NOT GIVEN
SharePoint mutation:         NOT GIVEN
LIVE WRITE:                  NOT GIVEN
New LIVE WRITE GO:           NOT GIVEN
Consumed LIVE WRITE GO:      NOT REUSABLE
Default runtime:             CLOSED
ProcedureRecord CREATE:      existing verified capability only
Cleanup:                     NO
Production binding:          NO
Deploy / App Catalog:        NO
Git mutation:                NOT GIVEN
```

ProcedureRecord v1 CREATE-ONLY remains authoritative. This Decision
does not open write APIs and does not authorize physical schema work.

---

## 2. Status confirmation (not reopened)

```text
D1: C — SEPARATE SCHEDULED-OCCURRENCE / CATALOG     CONFIRMED
D2: B — DEDICATED OBSERVATION DIMENSION             CONFIRMED
D3: B — EXPLICIT SUPERSEDE / CANCEL, APPEND-ONLY    CONFIRMED
ProcedureRecord v1:                                 UNCHANGED
```

---

## 3. HD-C1 — ScheduleItemId — ADOPTED / STABLE CATALOG ID

```text
DECISION: ADOPT STABLE CATALOG ID
```

ScheduleItemId is:

```text
assigned once to one schedule/catalog item
immutable for the lifetime of that catalog item
independent of presentation order
independent of route :slotKey
independent of rowNo
independent of displayed time
independent of ProcedureId alone
```

The same Procedure may have multiple ScheduleItemIds when it appears
multiple times in a schedule/day.

Forbidden identity sources:

```text
:slotKey
array index
current sort position
rowNo alone
scheduled time alone
ProcedureId alone
ProcedureId + LocalDate alone
```

`rowNo` may remain **PROVENANCE / DISPLAY ORDER INPUT**. It is **not**
ScheduleItemId.

Imported Legacy schedule data: assign or preserve one stable
ScheduleItemId per imported catalog row during canonicalization/import.
After assignment it remains stable even if row order, display time,
neighboring rows, or UI routing change.

```text
Exact physical storage:                 NOT DECIDED
Exact ScheduleItemId generation mechanism:
  implementation detail, provided stability/invariants are preserved
```

---

## 4. HD-C2 — Digest / identity algorithm — ADOPTED

```text
DECISION: ADOPT EXISTING REPOSITORY DIGEST CONVENTION
Algorithm:            SHA-256
Encoding:             canonical UTF-8 string material
Field framing:        U+001F unit separator
Namespace prefix:     REQUIRED
Identity-material ordering: VERSIONED / FIXED
```

This follows the current ProcedureRecord convention
(`PROCEDURE_RECORD_IDENTITY_SEPARATOR` = U+001F, `sha256Hex`,
namespace prefixes such as `procedure-record.record-id`).

**Do not reuse ProcedureRecord namespaces.**

Exact namespace strings and field order must be locked by contract
tests **before implementation**. Adopted candidates (Human recommended):

| Identity | Adopted candidate namespace |
|---|---|
| OccurrenceId | `scheduled-occurrence.occurrence-id` |
| LifecycleEventId | `procedure-record-lifecycle.event-id` |
| LifecycleIdempotencyKey | `procedure-record-lifecycle.idempotency-key` |
| LifecyclePayloadFingerprint | `procedure-record-lifecycle.payload-fingerprint` |

These candidates are not TypeScript constants in this unit.

### 4.1 OccurrenceId (`ScheduledOccurrence@1.0.0`)

Canonical semantic material (fixed order to freeze before implementation):

```text
OrganizationId
SiteId
UserId
LocalDate
ScheduleItemId
```

```text
OccurrenceId = SHA-256( namespace + U+001F + canonical material )
```

Required properties:

```text
same semantic occurrence → same OccurrenceId
same Procedure repeated with distinct ScheduleItemId → distinct OccurrenceId
sort-order change → OccurrenceId unchanged
route change → OccurrenceId unchanged
LocalDate = Asia/Tokyo local calendar day (current domain rules)
```

---

## 5. Schedule contracts — ADOPTED

```text
ScheduleItem@1.0.0
ScheduledOccurrence@1.0.0
ProcedureRecordOccurrenceBinding@1.0.0

Template/catalog entity: YES
Dated occurrence entity: YES
Binding entity:          YES

ProcedureRecord v1 change: NO
Existing ProcedureRecord backfill: NO
```

A ProcedureRecord without occurrence binding remains a
**VALID LEGACY/CURRENT RECORD**. Missing binding is not corruption.

---

## 6. Observation contract — ADOPTED

```text
ProcedureObservation@1.0.0
Primary binding: ProcedureRecord.RecordId
OccurrenceId:    optional join/context only
Observation absence: VALID
ABSENT distinct from a known chip value
Result overload: REJECTED
```

Frozen result vocabulary (unchanged):

```text
PERFORMED_AS_PLANNED
PERFORMED_WITH_ADAPTATION
NOT_PERFORMED
```

Structured Legacy vocabulary (recovered evidence; not invented):

様子:

```text
落ち着いていた
不安そう
拒否あり
興奮あり
切り替え困難
```

対応:

```text
見守り
声かけ
環境調整
活動変更
距離を取る
クールダウン
```

変化:

```text
改善した
変化なし
悪化した
途中で落ち着いた
```

```text
Cardinality: 0..1 value per category
toggle-off:  ALLOWED
memo:        separate optional free text
Canonical semantics: STRUCTURED
History distributions: not memo-parse authoritative
ProcedureRecord v1 change: NO
Backfill: NO
```

---

## 7. Lifecycle contract — ADOPTED

```text
ProcedureRecordLifecycleEvent@1.0.0
Event types: SUPERSEDE | CANCEL
Existing ProcedureRecord: IMMUTABLE
```

Correction:

```text
CREATE replacement ProcedureRecord
+ CREATE SUPERSEDE lifecycle event
```

Cancellation:

```text
CREATE CANCEL lifecycle event
```

```text
In-place UPDATE: REJECTED
Hard DELETE:     REJECTED
Result rewrite:  REJECTED
```

---

## 8. Lifecycle event identity — ADOPTED

Same digest convention as HD-C2. Independent keys:

```text
LifecycleEventId
LifecycleIdempotencyKey
LifecyclePayloadFingerprint
```

Do **not** reuse ProcedureRecord.RecordId / IdempotencyKey / PayloadFingerprint.

Canonical payload material (Human; includes org isolation):

```text
eventType
OrganizationId
SiteId
UserId
targetRecordId
replacementRecordId or explicit absence
recordedAt
recordedBy
```

If a later contract adds a semantic reason that affects event meaning,
fingerprint material must be revisited under a breaking/versioned
contract Decision. Cancel `reason` remains optional and is **not**
identity material unless that later Decision says so.

Critical retry invariant:

```text
The event payload, including recordedAt and recordedBy, is assembled ONCE.
A retry of the same lifecycle CREATE reuses:
  same recordedAt
  same recordedBy
  same LifecycleEventId
  same LifecycleIdempotencyKey
  same LifecyclePayloadFingerprint
A retry must NOT regenerate recordedAt.
```

---

## 9. Lifecycle resolution — ADOPTED

Deterministic resolver. **latest timestamp wins: REJECTED.**

| Rule | Input | Outcome |
|---|---|---|
| R1 | A, no lifecycle event | effective A |
| R2 | A SUPERSEDED BY B | effective B |
| R3 | A → B → C | effective C |
| R4 | effective record CANCELLED | no effective completed ProcedureRecord; lifecycle state = CANCELLED |
| R5 | A has multiple independent SUPERSEDE successors | CONFLICT / FAIL-CLOSED |
| R6 | cycle | INVALID / FAIL-CLOSED |
| R7 | missing referenced record | INCOMPLETE / FAIL-CLOSED |

Staff-facing wording remains a later UX decision. This contract does
not invent a new visible staff status.

---

## 10. SUPERSEDE compatibility — ADOPTED

```text
originalRecordId != replacementRecordId
Both records must match OrganizationId, SiteId, UserId
```

If both have `ProcedureRecordOccurrenceBinding`: OccurrenceId **MUST MATCH**.

If only one or neither has occurrence binding: **do not fabricate**
the missing binding. Resolution remains possible by RecordId, but the
occurrence-level read model must surface **INSUFFICIENT_RELATION /**
fail-closed where occurrence equivalence cannot be proven and it matters.

---

## 11. Observation on correction — ADOPTED

```text
Old ProcedureObservation: IMMUTABLE
Replacement ProcedureRecord: may receive a NEW ProcedureObservation
Do not transfer/mutate the old observation automatically
```

UI may later prefill old values for staff convenience. Persistence
must create new observation semantics. That UI behavior is
**NOT authorized here**.

---

## 12. Current contract protection

```text
ProcedureRecord RecordId:            UNCHANGED
ProcedureRecord IdempotencyKey:      UNCHANGED
ProcedureRecord PayloadFingerprint:  UNCHANGED
ProcedureRecord result vocabulary:   UNCHANGED
ProcedureRecord CREATE-ONLY:         UNCHANGED
save 5-state:                        UNCHANGED
save_outcome_unknown:                UNCHANGED
Existing listItemId=1:               VALID / UNCHANGED
Existing listItemId=2:               VALID / UNCHANGED
Existing rows require backfill:      NO
```

---

## 13. Physical requirements only (not a physical design)

Future physical design must be able to enforce/support:

1. stable ScheduleItemId
2. unique/deterministic OccurrenceId
3. occurrence lookup by user/local date
4. occurrence chronological ordering
5. ProcedureRecord ↔ Occurrence binding lookup
6. structured observation lookup/aggregation
7. lifecycle target lookup
8. lifecycle replacement lookup
9. lifecycle idempotency
10. append-only mutation model
11. coexistence with unbound existing ProcedureRecords

This Decision does **not** determine:

```text
number of SharePoint Lists
exact columns
lookup vs text columns
JSON storage
indexes
unique constraints
provisioning
REST/API design
```

---

## 14. What this Decision does not do

```text
does not start TypeScript / SPFx implementation
does not mutate ProcedureRecord v1
does not freeze namespace strings as executable code
does not choose SharePoint List/column mapping
does not authorize UPDATE / DELETE / PATCH
does not authorize backfill
does not mutate SharePoint
does not cleanup listItemId=1 or listItemId=2
does not reopen consumed LIVE WRITE GO
does not change default runtime
does not commit / push / PR / Deploy
```

---

## 15. Adopted packet (Human)

```text
Contract design:              ADOPTED

HD-C1 ScheduleItemId:         ADOPTED / STABLE CATALOG ID
HD-C2 digest:                 ADOPTED /
                              SHA-256
                              + U+001F canonical framing
                              + entity-specific namespace
                              + fixed versioned material

Schedule contracts:           ADOPTED
Observation contract:         ADOPTED
Lifecycle contract:           ADOPTED
Append-only:                  ADOPTED
UPDATE:                       REJECTED
DELETE:                       REJECTED
ProcedureRecord v1 modification: REJECTED FOR THIS CONTRACT
Backfill:                     NONE

Implementation authority:     NOT GIVEN
Physical schema authority:    NOT GIVEN
Git mutation:                 NOT GIVEN
SharePoint mutation:          NOT GIVEN
LIVE WRITE:                   NOT GIVEN
Deploy:                       NOT GIVEN

Decision: CLOSED / ADOPTED
```

Recommended next gate: **KIOSK-SPFX-PHYSICAL-SCHEMA-DESIGN-1**
