# ProcedureRecord write-capable binder — Implementation Start

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: PROCEDURE-RECORD-WRITE-CAPABLE-BINDER-1
Kind: Human Implementation Start GO（write-capable binder / no live POST）
Human Implementation Start: GO（2026-08-16）
LIVE WRITE PRECONDITION REVIEW: PASS
Decision state: FIRST_LIVE_WRITE_COMPLETE
Human LIVE WRITE GO: CONSUMED（2026-08-17；one synthetic CREATE → saved）
Evidence: procedure-record-first-live-write-execution-evidence.md
Closeout: procedure-record-first-live-write-closeout.md
```

This Human GO authorizes making the ProcedureRecord binder **write-capable in
code**, with synthetic tests only. It does not authorize SharePoint POST, first
item create, LIVE WRITE smoke, Deploy, or M365 / Entra mutation.

Write-capable implementation GO ≠ Human LIVE WRITE GO.

## Binding（unchanged LOOKUP-B）

```text
logical SiteId  →  binding.listGuid  →  transport.targetListGuid
Observed List GUID:
  {b971ff03-799e-41ac-b037-8becb9f4ff4b}
Observed ListItemEntityTypeFullName（write-time fact, not identity）:
  SP.Data.ListListItem
Display Name / web URL are not identity
physical SharePoint Site ID ≠ logical SiteId
```

## Authorized IN

```text
CREATE-ONLY createItem on ProcedureRecordLiveListTransport
reviewed SPHttpClient POST against lists(guid'...')/items
execution gate: GO 前は POST 不可能 / GO 後は追加コード変更なしで到達可能
gate-aware repository create()
ItemCount=0 is LIVE WRITE execution precheck only（not generic create()）
unit / heft tests with synthetic doubles
```

## Explicit OUT

```text
SharePoint POST against the live test-only List
ProcedureRecord item create（live）
LIVE WRITE smoke / retry-create
flipping production gates to true
production site binding
updateItem / MERGE / delete
Deploy / App Catalog
Entra / M365 mutation
Ready / Merge auto-progress
re-exporting test-only write seams from production index
```

## Production execution gate（remain closed for normal runtime）

```text
createProcedureRecordLiveWriteAuthorization() → null
isProcedureRecordLiveWriteAuthorized() → false
createProcedureRecordRepository → create() DEFINITE_FAILURE（createItem I/O = 0）
createProcedureRecordSpHttpClientTransport / FromHost
  → createItem FORBIDDEN（POST = 0）
postProcedureRecordCreateItem is module-private and requires a runtime-valid token
updateItem remains absent
SPFX_SPHTTPCLIENT_HOST_SEAM.liveWriteAuthorized = false
```

Human GO 後は、追加の POST 実装なしで、LIVE WRITE execution runner が
exact GO packet から run-scoped capability を mint する。

```text
normal application runtime
  → no packet
  → POST impossible

LIVE WRITE execution runner
  → purpose = procedure-record-first-create
  → humanLiveWriteGo = true
  → packet.expectedMainSha == runner-confirmed authoritative main SHA
  → normalize(packet.listGuid)
     == normalize(transport options.listGuid)
     == binding.listGuid
     == b971ff03-799e-41ac-b037-8becb9f4ff4b
  → packet.organizationId == binding.organizationId
  → packet.logicalSiteId == binding.siteId
  → itemCount = 0（precheck evidence; not generic create()）
  → createProcedureRecordLiveWriteSpHttpClientTransport
  → createProcedureRecordLiveWriteExecutionRepository
  → reviewed create path
```

Caller booleans (`itemCreateAuthorized`) cannot mint a token.
Invalid or unbound packets return null / stay FORBIDDEN（POST = 0）.
A 40-hex SHA that is not the runner-confirmed main SHA does not mint.

Production write-related entry points are:

```text
createProcedureRecordRepository
createProcedureRecordLiveWriteExecutionRepository
createProcedureRecordSpHttpClientTransport
createProcedureRecordLiveWriteSpHttpClientTransport
createProcedureRecordSpHttpClientTransportFromHost
createProcedureRecordLiveWriteAuthorization
createProcedureRecordLiveWriteAuthorizationFromGoPacket
isProcedureRecordLiveWriteAuthorized
```

`createSyntheticAuthorizedProcedureRecordRepository` remains under `tests/`
only. `postProcedureRecordCreateItem` is not a module export.
`createProcedureRecordSpHttpClientTransportFromHost` does not accept a packet.

## Next gates（separate Human GO each）

```text
Independent Review / Human Ready / Human Merge
  CONSUMED（PR #386 MERGED）
LIVE WRITE execution precheck
  CONSUMED
Human LIVE WRITE GO
  CONSUMED / CLOSED
  first synthetic ProcedureRecord create → GET-by-RecordId → saved

This unit does not authorize:
  second CREATE / retry POST / update / delete
  production binding / Deploy / App Catalog
```
