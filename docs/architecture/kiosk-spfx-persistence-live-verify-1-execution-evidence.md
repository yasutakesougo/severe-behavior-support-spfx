# KIOSK-SPFX-PERSISTENCE-LIVE-VERIFY-1 — Execution Evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: KIOSK-SPFX-PERSISTENCE-LIVE-VERIFY-1
Kind: Human LIVE WRITE execution evidence
      (Staff-path synthetic CREATE + GET-by-RecordId)
Human LIVE WRITE GO: CONFIRMED / CONSUMED / CLOSED
Execution date: 2026-08-17 JST
authoritativeMainSha: f7fd1994ffe25f996059cac1c4c3b19dcaa0c31e
Kiosk gate: PR #389 MERGED
Kiosk execution binder: PR #390 MERGED
  Merge commit f7fd1994ffe25f996059cac1c4c3b19dcaa0c31e
targetWeb:
  https://isogokatudouhome.sharepoint.com/sites/severe-support-procedurerecord-test
listGuid: b971ff03-799e-41ac-b037-8becb9f4ff4b
targetClassification: TEST-ONLY
Mode: CREATE-ONLY
Deploy performed: 0
real business data writes: 0
```

This document records the executed LIVE VERIFY. It does not rewrite earlier
PREP / gate / binder documents.

## Required execution facts

```text
Human LIVE WRITE GO: CONFIRMED / CONSUMED / CLOSED
authoritativeMainSha: f7fd1994ffe25f996059cac1c4c3b19dcaa0c31e
targetWeb: https://isogokatudouhome.sharepoint.com/sites/severe-support-procedurerecord-test
listGuid: b971ff03-799e-41ac-b037-8becb9f4ff4b
targetClassification: TEST-ONLY
preItemCount: 1
postItemCount: 2
preRecordIdLookup: EMPTY
preIdempotencyKeyLookup: EMPTY
physicalSchema: PASS
RecordId: a850964e3b78dc7f2917701b344fa2401a2dde9625073fad8e164c66bc826fcd
IdempotencyKey: faa67e9b0403a4185dfa7776626186d2798c9b232810f71029e0821cdbdd34a8
PayloadFingerprint: 69aecf49d46fcd97614d3c3e79cfe50a4ebde1bb5b4d3c84decfa183ca1e58af
CREATE attempts: 1
created listItemId: 2
retry POST: 0
GET-by-RecordId: 1 row / MATCH
persist final saveState: saved
```

## Authority

```text
Human LIVE WRITE GO bound to exact packet:
  purpose=kiosk-spfx-persistence-live-verify-1
  expectedMainSha=f7fd1994ffe25f996059cac1c4c3b19dcaa0c31e
  listGuid=b971ff03-799e-41ac-b037-8becb9f4ff4b
  logicalSiteId=SITE-ISG
  organizationId=synthetic-org-001
  recordId=a850964e3b78dc7f2917701b344fa2401a2dde9625073fad8e164c66bc826fcd
  idempotencyKey=faa67e9b0403a4185dfa7776626186d2798c9b232810f71029e0821cdbdd34a8
  payloadFingerprint=69aecf49d46fcd97614d3c3e79cfe50a4ebde1bb5b4d3c84decfa183ca1e58af
  mutationBudget={ create:1, update:0, delete:0, retryPost:0 }

Authorized:
  exactly 1 synthetic ProcedureRecord CREATE
  through merged Staff-path persistence flow
  GET-by-RecordId reconciliation
  unknown outcome → no retry POST

Not authorized by this gate:
  second CREATE / retry POST
  PATCH / MERGE / DELETE / update
  cleanup of listItemId=1
  production List / production binding
  schema mutation
  Deploy / App Catalog
  M365 / Entra mutation
```

This gate does not inherit to additional writes.

## Pre-POST reconfirm

```text
current authoritative main
  == f7fd1994ffe25f996059cac1c4c3b19dcaa0c31e
  CONFIRMED

target List GUID
  == b971ff03-799e-41ac-b037-8becb9f4ff4b
  LIVE CONFIRMED

preItemCount
  == 1
  LIVE CONFIRMED (also immediately before POST)

physical schema
  == PASS (verifyProcedureRecordPhysicalSchema)
  LIVE CONFIRMED

preRecordIdLookup
  == EMPTY
  LIVE CONFIRMED

preIdempotencyKeyLookup
  == EMPTY
  LIVE CONFIRMED

locked payload identity
  == MATCH (assemble + mint + fingerprint on frozen main)
  CONFIRMED

default runtime gate
  remains CLOSED
```

## Source-to-sink

Verified execution path:

```text
Staff draft
  → persistStaffProcedureRecord
  → persistProcedureRecord
  → createProcedureRecordKioskLiveVerifyExecutionRepository
  → createProcedureRecordKioskLiveVerifySpHttpClientTransport
  → SharePoint List CREATE
  → GET-by-RecordId reconciliation
  → saved
```

```text
direct adapter-only POST: NO
synthetic save shortcut: NO
```

Direct adapter POST that bypasses `assembleProcedureRecordForCreate` was not used.
Production Staff UI persistPort was not flipped off HOLD.

## Locked synthetic payload identity

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
performedAt:        2026-08-17T14:05:00+09:00
recordedAt:         2026-08-17T14:10:00+09:00
RecordId:           a850964e3b78dc7f2917701b344fa2401a2dde9625073fad8e164c66bc826fcd
IdempotencyKey:     faa67e9b0403a4185dfa7776626186d2798c9b232810f71029e0821cdbdd34a8
PayloadFingerprint: 69aecf49d46fcd97614d3c3e79cfe50a4ebde1bb5b4d3c84decfa183ca1e58af
```

No personal data. Identities are synthetic.

## CREATE

```text
CREATE attempts: 1
SharePoint item created: YES
created listItemId: 2
retry POST: 0
UPDATE: 0
PATCH / MERGE: 0
DELETE: 0
cleanup: 0
Deploy: 0
Entra / M365 mutation: 0
```

CREATE-ONLY `lists(guid'b971ff03-799e-41ac-b037-8becb9f4ff4b')/items` with
entity type `SP.Data.ListListItem`. Title omitted（TITLE-NONE）.

m365 CLI reported process success for that single CREATE POST
(runner mapped CLI success to HTTP 200; item identity confirmed by GET).

## GET-by-RecordId reconciliation

POST success was not treated as completion. GET-by-RecordId followed
inside `persistProcedureRecord`, then an independent CLI GET.

```text
persist final saveState: saved
GET-by-RecordId: 1 row / MATCH
created listItemId: 2
```

MATCHED fields:

```text
RecordId
IdempotencyKey
PayloadFingerprint
OrganizationId
SiteId
UserId
ProcedureId
ProcedureVersion
result
```

Observed synthetic values on listItemId=2:

```text
prRecordId: a850964e3b78dc7f2917701b344fa2401a2dde9625073fad8e164c66bc826fcd
prIdempotencyKey: faa67e9b0403a4185dfa7776626186d2798c9b232810f71029e0821cdbdd34a8
prPayloadFingerprint: 69aecf49d46fcd97614d3c3e79cfe50a4ebde1bb5b4d3c84decfa183ca1e58af
prOrganizationId: synthetic-org-001
prSiteId: SITE-ISG
prUserId: user-a
prProcedureId: synthetic-procedure-p3
prProcedureVersion: synthetic-procedure-p3-v1
prResult: PERFORMED_AS_PLANNED
```

Independent GET-by-IdempotencyKey: exactly 1 row, same listItemId=2.

## Residue state

```text
listItemId=1
  first-create synthetic residue
  UNTOUCHED

listItemId=2
  Kiosk live-verify synthetic record
  CREATED / VERIFIED

Current ItemCount: 2
Cleanup: NOT AUTHORIZED / NONE
```

## Default runtime

```text
ProcedureRecordForm default runtime: CLOSED
STAFF_PROCEDURE_RECORD_LIVE_WRITE_HOLD_PORT: UNCHANGED
No production default LIVE wiring was performed.
The one-time Human GO does not persist as reusable authority.
```

## Verdict

```text
KIOSK-SPFX-PERSISTENCE-LIVE-VERIFY-1
  = PASS / saved / CONSUMED / CLOSED
```
