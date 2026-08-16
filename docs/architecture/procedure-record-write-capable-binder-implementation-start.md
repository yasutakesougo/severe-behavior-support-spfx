# ProcedureRecord write-capable binder — Implementation Start

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: PROCEDURE-RECORD-WRITE-CAPABLE-BINDER-1
Kind: Human Implementation Start GO（write-capable binder / no live POST）
Human Implementation Start: GO（2026-08-16）
LIVE WRITE PRECONDITION REVIEW: PASS
Decision state: READY_FOR_HUMAN_LIVE_WRITE_DECISION
Human LIVE WRITE GO: NOT GIVEN
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

## Production execution gate（remain closed）

```text
private ITEM_CREATE_AUTHORIZED = false
private LIVE_TENANT_IO_AUTHORIZED = false
（root live-write-gate.ts と SPFx live-write-gate.ts で同一。export しない）
SPFX_SPHTTPCLIENT_HOST_SEAM.liveWriteAuthorized = false
createProcedureRecordLiveWriteAuthorization() → null
isProcedureRecordLiveWriteAuthorized() → false
unauthorized create() → DEFINITE_FAILURE（createItem I/O = 0）
unauthorized transport.createItem() → FORBIDDEN（POST = 0）
postProcedureRecordCreateItem is module-private and requires a runtime-valid token
updateItem remains absent
```

Before Human LIVE WRITE GO, production POST is impossible. After explicit
Human LIVE WRITE GO, opening both private production flags mints run-scoped
authorization and the already-reviewed POST path becomes reachable. That
authorization change is not a new POST implementation. Callers cannot import
or assign the gate flags, and cannot call the POST helper without a minted
token.

Production write-related entry points are:

```text
createProcedureRecordRepository
createProcedureRecordSpHttpClientTransport
createProcedureRecordSpHttpClientTransportFromHost
createProcedureRecordLiveWriteAuthorization
isProcedureRecordLiveWriteAuthorized
```

`createSyntheticAuthorizedProcedureRecordRepository` remains under `tests/`
only. `postProcedureRecordCreateItem` is not a module export.

## Next gates（separate Human GO each）

```text
Independent Review / Human Ready / Human Merge
LIVE WRITE execution precheck
  main SHA / List GUID / ItemCount=0 re-observe
  logical SiteId / synthetic payload / gate state
Human LIVE WRITE GO
  → first synthetic ProcedureRecord create
    persistProcedureRecord: create → GET-by-RecordId → saved
```
