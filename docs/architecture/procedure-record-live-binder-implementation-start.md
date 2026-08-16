# ProcedureRecord live binder — Implementation Start

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: PROCEDURE-RECORD-LIVE-BINDER-1
Kind: Human Implementation Start GO（live binder / no item write）
Human Implementation Start: GO（2026-08-16）
Provisioning: COMPLETE（test-only List）
```

This Human GO authorizes binder implementation that connects the ProcedureRecord
adapter to the already provisioned test-only List. It does not authorize item
create, LIVE WRITE, Deploy, or M365 / Entra mutation.

## Binding

```text
LOOKUP-B:
  logical SiteId  →  adapter configuration  →  provisioned List GUID
  → transport.targetListGuid  →  observed list.Id
Observed List GUID:
  {b971ff03-799e-41ac-b037-8becb9f4ff4b}
Display Name 支援手順実施記録 = label only
web URL /sites/severe-support-procedurerecord-test = operational path only
physical SharePoint Site ID ≠ logical SiteId
logical SiteId remains caller-supplied at bind time
binding.listGuid must equal transport.targetListGuid
  mismatch → LIST_BINDING_MISMATCH / transport-target-mismatch
  lookup and schema GET do not proceed
```

## Authorized IN

```text
src/adapters/sharepoint/procedure-record/ list-binding / schema / live-write gate
src/adapters/sharepoint/procedure-record/read-only-repository.ts
spfx/src/adapters/procedure-record/ SPHttpClient GUID transport
unit / contract tests with synthetic doubles
read-only schema verification against the observed physical catalog
```

## Explicit OUT

```text
ProcedureRecord item create against the live list
CREATE adapter execution on the live list
LIVE WRITE smoke / retry-create experiment
production site binding（SITE-ISG or facility business SiteId）
Deploy / App Catalog
Entra / M365 mutation
Ready / Merge auto-progress
```

## Live write gate

```text
PROCEDURE_RECORD_LIVE_WRITE_GATE.itemCreateAuthorized = false
SPFX_SPHTTPCLIENT_HOST_SEAM.liveWriteAuthorized = false
read-only repository create() → DEFINITE_FAILURE
SPHttpClient transport has no createItem / updateItem
ItemCount must remain 0
prResult EditFormat / Dropdown = provisioning-time selection
runtime physical invariant = Choice tokens + FillInChoice=false + DefaultValue empty
FIELD_SELECT does not include EditFormat
```

## Next gates（separate Human GO each）

```text
Independent Review / Human Ready / Human Merge
LIVE WRITE precondition review
Human LIVE WRITE GO
  → first ProcedureRecord item create
```
