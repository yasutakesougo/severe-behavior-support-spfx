# KIOSK-SPFX-PERSISTENCE-LIVE-GATE-IMPLEMENTATION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: KIOSK-SPFX-PERSISTENCE-LIVE-GATE-IMPLEMENTATION-1
Kind: Implementation (gate contract only)
Human Implementation Start: GO (2026-08-17)
Selected Decision: OPTION B
Basis main: a8049a20550554ef5a87704060db228953ccae3a

LIVE WRITE: HOLD
Authenticated SharePoint GET: OUT
SharePoint mutation: NOT AUTHORIZED
Schema mutation: NOT AUTHORIZED
Production binding: NOT AUTHORIZED
Deploy: NOT AUTHORIZED

This recording
  ≠ Human LIVE WRITE GO
  ≠ KIOSK-SPFX-PERSISTENCE-LIVE-VERIFY-1 execution
  ≠ Merge GO
```

Related:

```text
Decision: docs/architecture/kiosk-spfx-persistence-live-gate-decision-1.md
PREP:     docs/architecture/kiosk-spfx-persistence-live-verify-prep-1.md
First-create closeout:
  docs/architecture/procedure-record-first-live-write-closeout.md
  CONSUMED / CLOSED
```

---

## 1. Basis

Authoritative main at Implementation Start:

```text
a8049a20550554ef5a87704060db228953ccae3a
```

Current executable blocker before this unit: first-create gate only
(`purpose = procedure-record-first-create` + `itemCount === 0`).
That gate cannot authorize a later one-shot synthetic CREATE on a List that
already holds first-create residue.

---

## 2. Option B

Implemented as a **separate** Kiosk verification contract.

```text
UNCHANGED:
  ProcedureRecordLiveWriteGoPacket
  isProcedureRecordLiveWriteGoPacket
  createProcedureRecordLiveWriteAuthorizationFromGoPacket
  purpose = procedure-record-first-create
  itemCount === 0
  test-only List GUID
  default mint null

NEW:
  ProcedureRecordKioskLiveVerifyGoPacket
  isProcedureRecordKioskLiveVerifyGoPacket
  createProcedureRecordKioskLiveVerifyAuthorizationFromGoPacket
  purpose = kiosk-spfx-persistence-live-verify-1
```

OPTION A (generic CREATE / itemCount any) is not implemented.
OPTION C (harness bypass) is not implemented.

Decision document meaning is unchanged.

---

## 3. Old gate preserved

```text
purpose:        procedure-record-first-create
itemCount:      literal 0
target:         PROCEDURE_RECORD_TEST_ONLY_LIST_GUID
consumed packet: not revived
```

Old validator semantics are not relaxed. Kiosk verification does not reuse
the first-create purpose.

---

## 4. New purpose

```text
PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_GO_PURPOSE
= "kiosk-spfx-persistence-live-verify-1"
```

Dedicated to KIOSK-SPFX-PERSISTENCE-LIVE-VERIFY-1.
Not for normal Staff runtime or generic ProcedureRecord CREATE.

---

## 5. Identity bindings

Authorization requires exact match of packet and
`ProcedureRecordKioskLiveVerifyExecutionBinding`:

```text
authoritativeMainSha
listGuid = PROCEDURE_RECORD_TEST_ONLY_LIST_GUID
organizationId
logicalSiteId   (non-empty, not a SharePoint GUID)
recordId        (64-hex digest)
idempotencyKey  (64-hex digest)
payloadFingerprint (64-hex digest)
```

Any mismatch → authorization `null`.

PREP locked payload values are **not** hardcoded in production source.
Later PREP / execution re-locks those values into a Human GO packet.

---

## 6. Mutation budget

Validator contract, not descriptive metadata:

```text
create:    1
update:    0
delete:    0
retryPost: 0
```

Any other combination, including extra mutation keys, is REJECT.
This unit does not add a runtime write counter or automatic retry.

---

## 7. itemCount===0

```text
FIRST-CREATE ONLY
```

The Kiosk packet type does not include `itemCount`.
Fresh ItemCount remains later PREP / execution evidence.
Duplicate safety for the later verify unit is GET-by-RecordId EMPTY and
GET-by-IdempotencyKey EMPTY. This unit does not perform those GETs.

---

## 8. Default runtime CLOSED

```text
createProcedureRecordLiveWriteAuthorization() → null
isProcedureRecordLiveWriteAuthorized() → false
ProcedureRecordForm default persistPort → LIVE WRITE HOLD
FromHost / default transport → no write capability
createProcedureRecordLiveWriteExecutionRepository
  does not accept a Kiosk packet
```

The new mint is run-scoped. Normal production runtime does not call it.
SPFx production index does not export the SPFx mint.

---

## 9. Tests

```text
LG-OLD-01..05  first-create preserved / default mint null
LG-NEW-01..10  exact Kiosk packet + identity + mutation budget
fail-closed    one-field mismatches, including mutation budget
cross-purpose  first-create ↔ Kiosk REJECT both ways
network        no SharePoint / _api / Graph in this unit
export surface Kiosk mint not on SPFx production index
```

---

## 10. LIVE WRITE HOLD

This unit implements the authorization contract only.

```text
authenticated GET:     NONE
SharePoint POST:       NONE
ProcedureRecord CREATE: NONE
schema mutation:       NONE
Deploy:                NONE
Human GO packet:       NOT ISSUED
```

---

## 11. Next gate

```text
FRESH REVIEW
```

Draft PR ≠ Merge GO.
LIVE WRITE remains HOLD until a later Human GO.

After review: fresh authenticated GET (PREP lookups still UNKNOWN), then a
new Human LIVE WRITE GO, then KIOSK-SPFX-PERSISTENCE-LIVE-VERIFY-1.
