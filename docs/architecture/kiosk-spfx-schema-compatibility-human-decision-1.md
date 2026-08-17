# KIOSK-SPFX-SCHEMA-COMPATIBILITY-HUMAN-DECISION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-KIOSK-SPFX-SCHEMA-COMPATIBILITY-1
Unit: KIOSK-SPFX-SCHEMA-COMPATIBILITY-HUMAN-DECISION-1
Kind: Human Decision recording
Status: CLOSED / ADOPTED
Human Selection: 2026-08-17
Basis main: 442e26112a51c055f13141c7db2ba038c51ec56c

Input analysis:
  docs/architecture/kiosk-spfx-schema-compatibility-decision-1.md

This recording
  ≠ Implementation Start
  ≠ schema / DTO / physical column design
  ≠ new SharePoint List
  ≠ provisioning / migration / backfill
  ≠ UPDATE / PATCH / MERGE / DELETE
  ≠ LIVE WRITE GO
  ≠ production binding
  ≠ Deploy / App Catalog
  ≠ consumed LIVE WRITE GO reuse
  ≠ Staff default LIVE persistence
```

Related (not rewritten by this Decision):

```text
KGAP-006 / KGAP-028 / SCH-03     daily slot
KGAP-010 / KGAP-012 / SCH-04     observation chips
Decision-PROCEDURE-RECORD-PERSISTENCE-1 D6
KGAP-014 / KGAP-015 / SCH-02     cancel / overwrite UX vs CREATE-ONLY
```

---

## 1. Authority

```text
Decision authority:     Human
Implementation:         NOT GIVEN
Schema mutation:        NOT GIVEN
Tenant mutation:        NOT GIVEN
LIVE WRITE:             NOT GIVEN
New LIVE WRITE GO:      NOT GIVEN
Consumed LIVE WRITE GO: NOT REUSABLE
Default runtime:        CLOSED
ProcedureRecord CREATE: existing verified capability only
Cleanup:                NO
Production binding:     NO
Deploy / App Catalog:   NO
```

ProcedureRecord v1 CREATE-ONLY remains authoritative until a later contract
Decision changes write semantics. This Decision does not open write APIs.

---

## 2. D1 — Daily slot — OPTION C ADOPTED

```text
DECISION: OPTION C — ADOPT
Semantic model: separate scheduled-occurrence / daily-slot catalog
ProcedureRecord is NOT the authoritative daily-slot catalog
Legacy URL :slotKey: NOT PERSISTED AS IDENTITY
```

Reason: Legacy `:slotKey` is a 0-based presentation index and is not stable
durable identity.

Required property: daily chronological procedures must have stable,
authoritative occurrence identity independent of presentation order.

Expected Legacy UX — PRESERVE:

```text
time-ordered daily board
未実施 / 記録済み
tap into step
return and re-browse recorded slot
repeated procedures remain distinguishable
```

Not authorized by D1 itself:

```text
ProcedureRecord schema change: NOT AUTHORIZED NOW
New SharePoint List:           NOT DECIDED
Physical storage / source:     NOT DECIDED
Migration / backfill:          NONE AUTHORIZED
provisioning:                  NO
```

OPTION C is a semantic / domain decision only.

---

## 3. D2 — Observation chips — OPTION B ADOPTED

```text
DECISION: OPTION B — ADOPT
Semantic model: dedicated observation dimension
Separate from ProcedureRecord.result
Result overload: REJECTED
```

Frozen result vocabulary (unchanged):

```text
PERFORMED_AS_PLANNED
PERFORMED_WITH_ADAPTATION
NOT_PERFORMED
```

Do not encode 様子 / 対応 / 変化 as result values.

Legacy vocabulary: use only labels established from authoritative Legacy
evidence. Do not invent or modernize labels without a separate Decision.

```text
Persistence: REQUIRED if history「様子の分布」is retained
Physical representation: NOT DECIDED
ProcedureRecord schema change: NOT AUTHORIZED NOW
Migration / backfill: NONE AUTHORIZED
Existing synthetic residues: UNCHANGED
```

Any later storage design must preserve:

```text
observation semantics
memo semantics
historical readability
optionality for old records
separation from result
```

---

## 4. D3 — Correction / cancel / D6 — OPTION B ADOPTED

```text
DECISION: OPTION B — ADOPT
Policy: EXPLICIT SUPERSEDE / CANCEL MODEL
Implementation principle: APPEND-ONLY
Existing ProcedureRecord: IMMUTABLE
ProcedureRecord v1: CREATE-ONLY remains authoritative
```

UX required; destructive storage rejected:

```text
Correction UX:     REQUIRED
Cancellation UX:   REQUIRED
In-place UPDATE:   REJECTED
Hard DELETE:       REJECTED
```

Staff-facing actions may still be presented as「訂正」/「取消」.
Storage must not require destructive mutation. A correction or cancellation
must preserve the original record and create an auditable new state / event /
relation.

Exact future representation: **NOT DECIDED**. Later contract design must cover
at least:

```text
which record supersedes which
cancellation representation
current / effective record resolution
history ordering
reconciliation behavior
relationship to daily slot
relationship to observation dimension
```

Do not overload `ProcedureRecord.result` to represent cancellation.

```text
Write API:                 NO NEW AUTHORITY
UPDATE / DELETE / PATCH:   NO
Current CREATE capability: UNCHANGED
```

---

## 5. Identity / idempotency

```text
RecordId:           UNCHANGED FOR CURRENT CONTRACT
IdempotencyKey:     UNCHANGED FOR CURRENT CONTRACT
PayloadFingerprint: UNCHANGED FOR CURRENT CONTRACT
```

No current identity contract may be weakened to accommodate correction or
slots. If future supersede / cancel semantics need new identity or
relationship material, that requires a separate contract Decision before
implementation.

---

## 6. What this Decision does not do

```text
does not design daily-slot storage
does not design observation physical columns
does not design supersede/cancel contracts
does not add TypeScript / SPFx code
does not mutate SharePoint
does not cleanup listItemId=1 or listItemId=2
does not reopen consumed LIVE WRITE GO
does not change default runtime
```

---

## 7. Adopted packet (Human)

```text
D1 DAILY SLOT:
  C — SEPARATE SCHEDULED-OCCURRENCE / CATALOG
  ADOPTED

D2 OBSERVATION CHIPS:
  B — DEDICATED OBSERVATION DIMENSION
  ADOPTED

D3 D6:
  B — EXPLICIT SUPERSEDE / CANCEL
  WITH APPEND-ONLY IMPLEMENTATION PRINCIPLE
  ADOPTED

Implementation authority: NOT GIVEN
Schema authority:         NOT GIVEN
Tenant mutation authority: NOT GIVEN
LIVE WRITE authority:     NOT GIVEN

Decision: CLOSED / ADOPTED
```

Recommended next gate: **KIOSK-SPFX-SCHEMA-CONTRACT-DESIGN-1**
