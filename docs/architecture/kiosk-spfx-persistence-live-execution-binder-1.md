# KIOSK-SPFX-PERSISTENCE-LIVE-EXECUTION-BINDER-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: KIOSK-SPFX-PERSISTENCE-LIVE-EXECUTION-BINDER-1
Kind: Implementation (run-scoped binder only)
Human Implementation Start: GO (2026-08-17)
Basis main: 6b79b5f1ea6bed1b6babed4cb47347bb1dcab07b
Merged gate: PR #389

LIVE WRITE: HOLD
Authenticated SharePoint GET: NONE
SharePoint mutation: NONE
Human LIVE WRITE GO: NOT GIVEN
Schema mutation: NONE
Production binding: NONE
Deploy: NONE
```

Related:

```text
Gate: docs/architecture/kiosk-spfx-persistence-live-gate-implementation-1.md
Decision: docs/architecture/kiosk-spfx-persistence-live-gate-decision-1.md
```

---

## 1. Basis

Authoritative main at Implementation Start:

```text
6b79b5f1ea6bed1b6babed4cb47347bb1dcab07b
```

Kiosk purpose `kiosk-spfx-persistence-live-verify-1` is already on main.
This unit wires that purpose to a run-scoped repository and SPFx transport.

---

## 2. Kiosk-only binder

New factories:

```text
createProcedureRecordKioskLiveVerifyExecutionRepository
createProcedureRecordKioskLiveVerifySpHttpClientTransport
```

Root mint:

```text
createProcedureRecordKioskLiveVerifyAuthorizationFromGoPacket
```

SPFx mint:

```text
createSpfxProcedureRecordKioskLiveVerifyAuthorizationFromGoPacket
```

Invalid or mismatched packet → repository `null`; SPFx createItem `FORBIDDEN`.

---

## 3. First-create unchanged

```text
createProcedureRecordLiveWriteExecutionRepository
createProcedureRecordLiveWriteSpHttpClientTransport
```

remain first-create only. They do not accept a Kiosk packet.
Kiosk factories do not accept a first-create packet.

---

## 4. Identity enforcement

Before repository `create()` may call `transport.createItem`, the record must
match the locked packet:

```text
OrganizationId == packet.organizationId
SiteId         == packet.logicalSiteId
RecordId       == packet.recordId
IdempotencyKey == packet.idempotencyKey
PayloadFingerprint == packet.payloadFingerprint
```

Any mismatch → `DEFINITE_FAILURE`, createItem = 0.

---

## 5. Fingerprint recomputation

Canonical helpers:

```text
procedureRecordFingerprintMaterial(...)
computeProcedureRecordPayloadFingerprint(...)
```

Required:

```text
recomputed fingerprint
  == record.PayloadFingerprint
  == packet.payloadFingerprint
```

A content change that leaves the old fingerprint string is refused.

---

## 6. Record identity recomputation

Canonical helper:

```text
mintProcedureRecordIdentity(...)
```

Required:

```text
recomputed RecordId        == record.RecordId        == packet.recordId
recomputed IdempotencyKey  == record.IdempotencyKey  == packet.idempotencyKey
```

Digest-only substitution is refused. Changing `UserId` while keeping the old
RecordId / IdempotencyKey strings is refused.

---

## 7. Physical payload enforcement

SPFx Kiosk `createItem(fields)` checks, before POST:

```text
prRecordId            == locked recordId
prIdempotencyKey      == locked idempotencyKey
prPayloadFingerprint  == locked payloadFingerprint
prOrganizationId      == locked organizationId
prSiteId              == locked logicalSiteId
```

Mismatch → `FORBIDDEN`, POST = 0.

---

## 8. Default runtime CLOSED

```text
createProcedureRecordLiveWriteAuthorization() → null
isProcedureRecordLiveWriteAuthorized() → false
ProcedureRecordForm persistPort → STAFF_PROCEDURE_RECORD_LIVE_WRITE_HOLD_PORT
FromHost / default transport → no write capability
SPFx production index does not export the Kiosk transport factory
```

---

## 9. No network

This unit uses mock transport / mock SPHttpClient only.

```text
SharePoint GET:  NONE
SharePoint POST: NONE
Graph:           NONE
```

PREP locked payload values are not hardcoded in production source.

---

## 10. Next gate

```text
FRESH REVIEW
```

Draft PR ≠ Merge GO.
After Merge: authenticated read-only PREP (fresh ItemCount, schema,
RecordId EMPTY, IdempotencyKey EMPTY, payload regenerate), then an exact
Human GO packet. LIVE WRITE remains HOLD until that later GO.
