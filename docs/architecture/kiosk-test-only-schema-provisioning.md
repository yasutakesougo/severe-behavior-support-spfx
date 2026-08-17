# KIOSK TEST-ONLY SCHEMA PROVISIONING EVIDENCE

```text
repository: yasutakesougo/severe-behavior-support-spfx
Basis main SHA: 2e5155b2ec2a491ba685bc15c2b014f42547d625
Human Scope GO: CONFIRMED / CONSUMED / CLOSED
Execution Date: 2026-08-17 JST
Target URL: https://isogokatudouhome.sharepoint.com/sites/severe-support-procedurerecord-test
Resolved Physical Site ID: isogokatudouhome.sharepoint.com,47e55669-18ac-4143-bc91-f68fd528c6f1,bdd60214-1295-4c83-bae6-3d1a77583b5b
Display Name: ProcedureRecord Test
Target Classification: TEST-ONLY
```

---

## 1. Authentication & Preflight

```text
Authentication: CLI (connectedAs: isogo_06@isogokatudouhome.onmicrosoft.com)
Live preflight status: PASS

Pre-existing Lists:
- SBS_PROCEDURE_RECORDS (GUID: b971ff03-799e-41ac-b037-8becb9f4ff4b, ItemCount: 2) -> UNTOUCHED / REFERENCED READ-ONLY

Target Kiosk Lists pre-state:
- SBS_SCHEDULE_ITEMS: MISSING -> CREATED
- SBS_SCHEDULED_OCCURRENCES: MISSING -> CREATED
- SBS_PROCEDURE_RECORD_OCCURRENCE_BINDINGS: MISSING -> CREATED
- SBS_PROCEDURE_OBSERVATIONS: MISSING -> CREATED
- SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS: MISSING -> CREATED
```

---

## 2. Provisioned Kiosk Lists & Physical Schema Details

### A. `SBS_SCHEDULE_ITEMS` (Logical: `ScheduleItem@1.0.0`)
- **List GUID**: `b871f297-c2fa-46bf-95d2-69650d8ca45f`
- **Columns**:
  - `schScheduleItemId` (Text, Required: true, Indexed: true, Unique: true)
  - `schOrganizationId` (Text, Required: true)
  - `schSiteId` (Text, Required: true)
  - `schProcedureId` (Text, Required: true)
  - `schProcedureVersion` (Text, Required: true)
  - `schApprovalState` (Text, Required: true)
  - `schPlanId` (Text, Required: true)
  - `schPlanVersion` (Number, Required: true)
  - `schScheduledTime` (Text, Required: true)
  - `schActivityLabel` (Text, Required: true)
  - `schCatalogOrder` (Number, Required: true)

### B. `SBS_SCHEDULED_OCCURRENCES` (Logical: `ScheduledOccurrence@1.0.0`)
- **List GUID**: `dda71fa1-af29-4ced-9a12-5105591e7b62`
- **Columns**:
  - `occOccurrenceId` (Text, Required: true, Indexed: true, Unique: true)
  - `occOrganizationId` (Text, Required: true)
  - `occSiteId` (Text, Required: true)
  - `occUserId` (Text, Required: true)
  - `occLocalDate` (Text, Required: true)
  - `occTimeZone` (Text, Required: true)
  - `occScheduleItemId` (Text, Required: true)
  - `occProcedureId` (Text, Required: true)
  - `occProcedureVersion` (Text, Required: true)
  - `occApprovalState` (Text, Required: true)
  - `occPlanId` (Text, Required: true)
  - `occPlanVersion` (Number, Required: true)

### C. `SBS_PROCEDURE_RECORD_OCCURRENCE_BINDINGS` (Logical: `ProcedureRecordOccurrenceBinding@1.0.0`)
- **List GUID**: `1870efa8-ade2-45f8-bcaf-76370564f63d`
- **Columns**:
  - `bindOccurrenceId` (Text, Required: true, Indexed: true)
  - `bindRecordId` (Text, Required: true, Indexed: true)

### D. `SBS_PROCEDURE_OBSERVATIONS` (Logical: `ProcedureObservation@1.0.0`)
- **List GUID**: `4cc7fbd2-badf-4579-aec9-aa88d28a8fa6`
- **Columns**:
  - `obsRecordId` (Text, Required: true, Indexed: true)
  - `obsOccurrenceId` (Text, Required: false)
  - `obsCondition` (Text, Required: false)
  - `obsResponse` (Text, Required: false)
  - `obsChange` (Text, Required: false)
  - `obsMemo` (Note, Required: false)

### E. `SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS` (Logical: `ProcedureRecordLifecycleEvent@1.0.0`)
- **List GUID**: `41274293-18d0-4f57-8a45-4f063522bcc7`
- **Columns**:
  - `lifeLifecycleEventId` (Text, Required: true, Indexed: true, Unique: true)
  - `lifeLifecycleIdempotencyKey` (Text, Required: true, Indexed: true, Unique: true)
  - `lifeLifecyclePayloadFingerprint` (Text, Required: true)
  - `lifeEventType` (Text, Required: true)
  - `lifeTargetRecordId` (Text, Required: true, Indexed: true)
  - `lifeReplacementRecordId` (Text, Required: false)
  - `lifeRecordedAt` (Text, Required: true)
  - `lifeRecordedBy` (Text, Required: true)
  - `lifeReason` (Text, Required: false)

---

## 3. Reference Field Physical Types & Logical Relationship Alignment

### Reference Field Physical Inspection Details
- `bindOccurrenceId`: TypeAsString=Text, LookupList=N/A, LookupField=N/A, Required=true, Indexed=true, EnforceUniqueValues=false
- `bindRecordId`: TypeAsString=Text, LookupList=N/A, LookupField=N/A, Required=true, Indexed=true, EnforceUniqueValues=false
- `obsRecordId`: TypeAsString=Text, LookupList=N/A, LookupField=N/A, Required=true, Indexed=true, EnforceUniqueValues=false
- `obsOccurrenceId`: TypeAsString=Text, LookupList=N/A, LookupField=N/A, Required=false, Indexed=false, EnforceUniqueValues=false
- `lifeTargetRecordId`: TypeAsString=Text, Required=true, Indexed=true, EnforceUniqueValues=false
- `lifeReplacementRecordId`: TypeAsString=Text, Required=false, Indexed=false, EnforceUniqueValues=false
- `occScheduleItemId`: TypeAsString=Text, Required=true, Indexed=false, EnforceUniqueValues=false

### Physical vs Logical Classification
- PHYSICAL LOOKUP: NO
- LOGICAL REFERENCE STORED AS TEXT: YES

### Lookups vs Logical References
Lookups:
NONE

Logical references:
- `bindOccurrenceId` -> `SBS_SCHEDULED_OCCURRENCES.occOccurrenceId` (Logical Text reference)
- `bindRecordId` -> `SBS_PROCEDURE_RECORDS.prRecordId` (Logical Text reference)
- `obsRecordId` -> `SBS_PROCEDURE_RECORDS.prRecordId` (Logical Text reference)
- `obsOccurrenceId` -> `SBS_SCHEDULED_OCCURRENCES.occOccurrenceId` (Logical Text reference)
- `lifeTargetRecordId` -> `SBS_PROCEDURE_RECORDS.prRecordId` (Logical Text reference)
- `lifeReplacementRecordId` -> `SBS_PROCEDURE_RECORDS.prRecordId` (Logical Text reference)
- `occScheduleItemId` -> `SBS_SCHEDULE_ITEMS.schScheduleItemId` (Logical Text reference)

---

## 4. Execution Provenance & Provisioner Capability Audit

### Execution Provenance
During provisioning, initial CLI attempts using simple CLI parameter flags (`--name`) failed because `m365 spo field get/add` requires schema XML definitions when creating custom fields with indexed/unique attributes. Provisioning was seamlessly completed by switching to `--xml` schema definitions `<Field Type="..." DisplayName="..." Name="..." StaticName="..." ... />`.

### Provisioner Safety & Reusability Audit
- Provisioning execution: SUCCESS
- Provisioner current-state rerun: PASS (existing lists and fields are checked via `m365 spo list get` / `m365 spo field get` and skipped without error).
- Reusable provisioner: NOT YET APPROVED
- Reason: existing incompatible schema detection not implemented (`scripts/provision-kiosk-test-lists.cjs` is classified as EXECUTION AID ONLY; it currently checks presence only and does not validate pre-existing column types, required flags, or index attributes).

---

## 5. Safety & Boundary Audit

```text
Production site touched: NO
Production data touched: NO
Destructive mutation: NONE
Physical Site ID / logical SiteId binding: NOT BOUND (Physical Site ID is NOT adopted as logical SiteId)
LIVE WRITE HOLD: MAINTAINED (Production default live write port remains HOLD)
Synthetic round-trip: NOT EXECUTED
Deploy / App Catalog operation: NONE
Entra / M365 permission mutation: NONE
```

---

## 6. Conclusion & Status

```text
Result: PASS
Final: CLOSED
```
