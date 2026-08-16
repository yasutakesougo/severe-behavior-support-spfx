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
SPHttpClient POST shape against lists(guid'...')/items（synthetic doubles only）
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
```

## Production gates（remain closed）

```text
PROCEDURE_RECORD_LIVE_WRITE_GATE.itemCreateAuthorized = false
PROCEDURE_RECORD_LIVE_WRITE_GATE.liveTenantIoAuthorized = false
SPFX_SPHTTPCLIENT_HOST_SEAM.liveWriteAuthorized = false
unauthorized create() → DEFINITE_FAILURE（createItem I/O = 0）
updateItem remains absent
```

Tests use an internal **synthetic-test-only** write seam. Callers cannot pass
`itemCreateAuthorized: true` into production repository or SPFx host factory.
`itemCreateAuthorized` alone never authorizes live POST; production
`liveTenantIoAuthorized` stays false.

```text
production path: closed gate → POST impossible
synthetic tests: createSyntheticAuthorizedProcedureRecordRepository
  / createSyntheticProcedureRecordSpHttpClientTransport
```

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
