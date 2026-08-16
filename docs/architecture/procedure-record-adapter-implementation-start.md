# ProcedureRecord adapter — Implementation Start

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: PROCEDURE-RECORD-ADAPTER-SYNTHETIC-V1
Kind: Human Implementation Start GO（synthetic persistence slice）
Human Implementation Start: GO（2026-08-16）
Baseline main: 19b66a214e7c2400794840191a99e7a3d0792dc1

Authority（再 Decision しない）:
  Decision-PROCEDURE-RECORD-PERSISTENCE-1 = ACCEPTED / LOCKED（scoped）
  Decision-PROCEDURE-RECORD-MAPPING-1 = ACCEPTED / LOCKED（scoped）
  PROCEDURE-RECORD-POST-MERGE-PLANNING-1 = COMPLETE / PASS
  Implementation preconditions = READY
  Missing Decision before Implementation Start = NONE
```

This Human GO authorizes the synthetic adapter slice only.
It does not authorize provisioning, LIVE WRITE, Deploy, SPFx UI, or M365 / Entra mutation.

## Authorized IN

```text
src/domain/procedure-record-persistence.ts
src/adapters/sharepoint/procedure-record/
tests/domain/procedure-record-persistence.test.ts
tests/adapters/sharepoint/procedure-record/

CREATE-ONLY port
dual lookup RecordId + IdempotencyKey
GET-by-RecordId required before saved
save outcome saved / save_failed / save_outcome_unknown
save outcome ≠ ProcedureRecord.result
UNKNOWN / FETCH_FAILED ≠ EMPTY
no automatic create retry on save_outcome_unknown
LOOKUP-B runtime config: SiteId → List GUID
PR-MAP-NAMES-1 Internal Names / Types / conversions
D4=A ISO DateTime string round-trip
Procedure flatten
DERIVED envelope / TimeZone reconstruction
TITLE-NONE（do not write Title; do not read Title as contract）
site bind + OrganizationId / SiteId match
synthetic in-memory list store
unit / contract / fail-closed tests
```

## Explicit OUT

```text
caseload browse / SUPPORTER assigned-users-only filter
production SharePoint group / Role binding
concrete provisioned List GUID invention
test-only site identity invention
retention years
List / column / site provisioning
SharePoint item write against a tenant
LIVE WRITE
SPFx UI / FIELD-WORKFLOW UI
SPFx SPHttpClient live binder
adapter update / delete
Deploy / App Catalog
M365 / Entra mutation
Ready / Merge auto-progress
```

## Runtime List identity

```text
LOOKUP-B:
  adapter configuration boundary = SiteId → List GUID
  Display Name 支援手順実施記録 is NOT lookup identity
  server-relative URL is NOT List identity
  concrete GUID values remain provisioning-time UNKNOWN
  synthetic tests inject a labeled runtime config token only
```

## HOLD after this GO

```text
Provisioning = NO-GO
LIVE WRITE = NO-GO
Deploy / App Catalog / M365 / Entra = NO-GO
```
