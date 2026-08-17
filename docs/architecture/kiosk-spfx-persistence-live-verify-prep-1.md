# KIOSK-SPFX-PERSISTENCE-LIVE-VERIFY-PREP-1

Status: **READ-ONLY PREP**
Date: 2026-08-17
Kind: Human LIVE WRITE GO packet preparation for Staff-path CREATE verification
Mutation: **NONE**
Live write this unit: **NONE**
Human LIVE WRITE GO: **NOT GIVEN**

```text
PREP ONLY
LIVE WRITE: HOLD
SharePoint mutation: NONE
Schema mutation: NONE
Deploy: NONE
Production binding: NONE
Self-authorization: FORBIDDEN
```

Authoritative main: `a8049a20550554ef5a87704060db228953ccae3a`
Merged PR: [#388](https://github.com/yasutakesougo/severe-behavior-support-spfx/pull/388)
Merged feature HEAD: `9a05addd31bfd0afd89e2c2cee33b353c5497f4c`

KGAP-025: **CODE PATH CLOSED / LIVE VERIFICATION OPEN**

Follow-on Decision (docs-only; **not implemented** on main):
[`kiosk-spfx-persistence-live-gate-decision-1.md`](./kiosk-spfx-persistence-live-gate-decision-1.md)
SELECTED OPTION B. Executable gate on `a8049a20` is unchanged. This PREP remains **BLOCKED_BY_GATE**.

---

## 1. Current main (read-only)

```text
origin/main
  == a8049a20550554ef5a87704060db228953ccae3a
  CONFIRMED (git fetch origin main)

9a05addd31bfd0afd89e2c2cee33b353c5497f4c is ancestor of origin/main
  CONFIRMED

PR #388 merge commit message:
  Merge pull request #388 from yasutakesougo/kiosk-spfx-persistence-1
```

Staff path on that main:

```text
ProcedureRecordForm.handleSave
  → persistStaffProcedureRecordFromForm
  → persistStaffProcedureRecord
  → persistProcedureRecord

Synthetic helper applySyntheticProcedureRecordSave
  ABSENT on origin/main

Default persistPort
  STAFF_PROCEDURE_RECORD_LIVE_WRITE_HOLD_PORT
  = createLiveWriteHoldProcedureRecordPersistencePort()
  lookups EMPTY / create DEFINITE_FAILURE / no HTTP
```

AppShellChrome does not pass `persistPort`. Production Staff UI therefore stays on HOLD unless a harness injects a port.

---

## 2. Exact LIVE VERIFY objective

Not generic adapter POST.

Required source-to-sink:

```text
Staff draft + FIELD-WORKFLOW binding context
→ buildStaffProcedureRecordCreateInput
→ assembleProcedureRecordForCreate
→ persistStaffProcedureRecord
→ persistProcedureRecord
→ authenticated live ProcedureRecordPersistencePort
→ SharePoint CREATE (exactly 1)
→ GET-by-RecordId (exactly 1 matching row)
→ persist final state saved
```

POST 201 alone is not PASS. Direct adapter POST that bypasses `assembleProcedureRecordForCreate` is not this gate.

---

## 3. Live port injection (no wiring written)

Existing seams (do not change production default):

```text
ProcedureRecordForm.persistPort?: ProcedureRecordPersistencePort
persistStaffProcedureRecord(input, port)
createProcedureRecordLiveWriteExecutionRepository(binding, transport, packet, execution)
createProcedureRecordLiveWriteSpHttpClientTransport(options, packet, execution)
```

Classification: **B. TEST/HARNESS INJECTION READY**

```text
A EXISTING INJECTION PATH READY
  NO — AppShell production path does not inject a live port.
      Changing the default HOLD port is FORBIDDEN.

B TEST/HARNESS INJECTION READY
  YES — Staff save already accepts an injected ProcedureRecordPersistencePort.
      The write-capable repository/transport factories already exist.
      Same pattern as the consumed first-create runner, but the port must
      be passed into persistStaffProcedureRecord (not a raw adapter POST).

C CODE GAP REQUIRED
  NO for the persistPort seam itself.

D UNKNOWN
  NO
```

Harness mint of the live port still requires a packet that
`isProcedureRecordLiveWriteGoPacket` accepts. That is a **gate** block, not
an injection-seam gap. This PREP does not write injection code.

---

## 4. Target List candidate

Priority 1 candidate (only observed test-only ProcedureRecord List):

```text
kind: test-only-provisioned-list
listGuid: b971ff03-799e-41ac-b037-8becb9f4ff4b
webServerRelativeUrl: /sites/severe-support-procedurerecord-test
listItemEntityTypeFullName: SP.Data.ListListItem
logicalSiteId: caller-supplied (not the List GUID, not physical Site ID)
```

Target classification: **TEST-ONLY**

Fresh live GET this PREP: **NOT PERFORMED**

```text
SharePoint / Graph / M365 credentials in this agent environment: ABSENT
Authenticated GET lists(guid'...') : NOT EXECUTED
Fresh ItemCount: UNKNOWN
Fresh schema: UNKNOWN (last live observation: first-write PASS)
Fresh unique columns: UNKNOWN (last live observation: unique prRecordId + prIdempotencyKey)
```

Do not copy the consumed packet's `itemCount=0`.

Last live write closeout (historical, not a fresh GET):

```text
PROCEDURE-RECORD-FIRST-LIVE-WRITE-EXECUTION-1 CONSUMED
same List GUID
CREATE 1 / listItemId=1 / GET-by-RecordId MATCH / saved
residue remains (cleanup NOT AUTHORIZED)
ItemCount=0 precheck from that gate is INVALID for a later write
```

Priority 2 non-production other List: **none observed in repository identity modules**.

Priority 3 production facility List: **NOT ADOPTED** (separate Human Decision Required).

New List / new columns: **NOT CREATED**. If a new empty List were required,
that would be SCHEMA / SHAREPOINT MUTATION DECISION REQUIRED. This PREP stops
instead of provisioning.

---

## 5. Current live-gate contract

Executable contract on `a8049a20` (`src/adapters/sharepoint/procedure-record/live-write-gate.ts`
and SPFx copy):

```text
purpose must equal "procedure-record-first-create"
humanLiveWriteGo must be true
expectedMainSha must be 40-hex
listGuid must equal b971ff03-799e-41ac-b037-8becb9f4ff4b
itemCount must be the literal 0
logicalSiteId non-empty and not a GUID
organizationId non-empty
packet SHA / GUID / org / SiteId must equal execution binding
```

Local confirmation (no SharePoint I/O):

```text
purpose = kiosk-spfx-persistence-live-verify-1  → packet REJECTED
itemCount = 1                                   → packet REJECTED
purpose = procedure-record-first-create
  + itemCount = 0
  + expectedMainSha = a8049a20...
  + test-only GUID                              → packet ACCEPTED by validator
```

The last shape is **exactly the consumed first-create purpose**. Reuse is
FORBIDDEN even if the validator would accept a dishonest `itemCount: 0`.

`itemCount === 0` classification:

```text
A first-write-only condition
  Comments / verifyProcedureRecordPreWriteEmpty describe first-write precheck.

B currently required on every CREATE packet
  YES in executable gate types + validators (itemCount: 0).

C replaceable without code change
  NO.

D UNKNOWN
  NO.
```

Current executable answer: **B**.

`verifyProcedureRecordPreWriteEmpty` fails with `item-count-not-zero` when
`ItemCount !== 0`. Combined with residue on the only allowed GUID:

```text
LIVE VERIFY BLOCKED BY GATE
```

This PREP does not change the gate contract.

Default runtime remains closed:

```text
createProcedureRecordLiveWriteAuthorization() → null
isProcedureRecordLiveWriteAuthorized() → false
createProcedureRecordRepository create() → DEFINITE_FAILURE
FromHost / default SPHttpClient createItem → FORBIDDEN
```

---

## 6. No new List

No SharePoint List or column was created.

---

## 7. Locked synthetic payload (construction only)

Built with current-main helpers only:

```text
assembleProcedureRecordForCreate
mintProcedureRecordIdentity
computeProcedureRecordPayloadFingerprint
```

Source context = merged Staff fixture (`FIELD_WORKFLOW_CURRENT_USER_A` +
`FIELD_WORKFLOW_RECORDER_SUBJECT_ID`). Result = one of the three domain
values. No chips / slot / D6. No personal data.

```text
OrganizationId:     synthetic-org-001
SiteId:             SITE-ISG
UserId:             user-a
recordedBy:         synthetic-subject-001
planId:             synthetic-plan-001
planVersion:        3
ProcedureId:        synthetic-procedure-p3
ProcedureVersion:   synthetic-procedure-p3-v1
result:             PERFORMED_AS_PLANNED
performedAtLocal:   2026-08-17T14:05
performedAt:        2026-08-17T14:05:00+09:00
recordedAt:         2026-08-17T14:10:00+09:00
LocalDate:          2026-08-17
TimeZone:           Asia/Tokyo
RecordId:           a850964e3b78dc7f2917701b344fa2401a2dde9625073fad8e164c66bc826fcd
IdempotencyKey:     faa67e9b0403a4185dfa7776626186d2798c9b232810f71029e0821cdbdd34a8
PayloadFingerprint: 69aecf49d46fcd97614d3c3e79cfe50a4ebde1bb5b4d3c84decfa183ca1e58af
```

Hand-written RecordId / IdempotencyKey / fingerprint were not used.
Consumed first-create identities (`synth-pr-livewrite-prep1-*`) were not reused.

Construction: **READY**. Live prelookup of these keys: **UNKNOWN** (no authenticated GET).

---

## 8. Pre-write lookups

```text
GET-by-RecordId      a850964e3b78dc7f2917701b344fa2401a2dde9625073fad8e164c66bc826fcd
GET-by-IdempotencyKey faa67e9b0403a4185dfa7776626186d2798c9b232810f71029e0821cdbdd34a8

this PREP: NOT EXECUTED
RecordId rows: UNKNOWN
IdempotencyKey rows: UNKNOWN
```

If a later authenticated GET finds either key, CREATE is forbidden (REPLAY / CONFLICT).
This PREP does not CREATE.

---

## 9. Proposed mutation budget (future GO only)

```text
CREATE attempts: 1
Expected SharePoint mutation: CREATE = 1
UPDATE: 0
DELETE: 0
PATCH / MERGE: 0
Retry POST: 0
Unknown outcome: NO AUTOMATIC RETRY
Reconciliation: GET-by-RecordId required
```

Not authorized by this PREP.

---

## 10–11. Success / failure (future execution)

PASS requires all of: CREATE attempt = 1, expected CREATE, GET-by-RecordId
exactly 1 matching row on RecordId / IdempotencyKey / PayloadFingerprint /
OrganizationId / SiteId / UserId / ProcedureId / ProcedureVersion / result,
final `saved`, synthetic success NONE, retry POST 0.

DEFINITE_FAILURE → `save_failed`. INDETERMINATE → existing persist reconcile.
Unknown → `save_outcome_unknown`, no second POST, Human STOP.

---

## 12. GO packet

**NOT ISSUED.**

A truthful packet for this Staff-path verify would need:

```text
purpose: kiosk-spfx-persistence-live-verify-1
expectedMainSha: a8049a20550554ef5a87704060db228953ccae3a
itemCount: fresh live GET (not copied 0)
```

Current validators reject that purpose and reject `itemCount !== 0`.
Issuing a packet with `purpose=procedure-record-first-create` and `itemCount=0`
would be reuse of the consumed first-create GO. FORBIDDEN.

Human LIVE WRITE GO: **NOT YET GIVEN**. This document does not mint it.

---

## 13. What would unblock LIVE VERIFY

Separate Human Decisions (not this PREP, not self-authorized):

1. Gate contract change: OPTION B is **SELECTED** in
   [`kiosk-spfx-persistence-live-gate-decision-1.md`](./kiosk-spfx-persistence-live-gate-decision-1.md)
   (new purpose `kiosk-spfx-persistence-live-verify-1`; first-create `itemCount===0` unchanged).
   **Implementation is not this PREP** (`KIOSK-SPFX-PERSISTENCE-LIVE-GATE-IMPLEMENTATION-1`).
2. After that: authenticated fresh GET of the test-only List (ItemCount, schema,
   RecordId / IdempotencyKey emptiness for the locked payload).
3. Then a new Human LIVE WRITE GO bound to the new purpose and fresh evidence.
4. Execution harness injects the live repository into `persistStaffProcedureRecord`
   (or `ProcedureRecordForm.persistPort`). Do not flip production default HOLD.

Do not delete first-create residue in this PREP.

---

## HOLD

```text
Authenticated LIVE WRITE: NOT AUTHORIZED
Consumed first-create GO reuse: FORBIDDEN
Gate contract mutation: NOT THIS UNIT
New List / schema mutation: NOT THIS UNIT
Deploy: NOT THIS UNIT
Production facility List: NOT ADOPTED
```

Decision: **BLOCKED_BY_GATE**
