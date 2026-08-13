# FIELD-WORKFLOW Contract Issue B — ProcedureRecord implementation boundary

Status: GO-SLICE / HUMAN AUTHORIZED (Issue #352 契約実装 GO)

Human decision date: 2026-08-13

Source:

- Issue #352
- Decision-FIELD-WORKFLOW-CONTRACT-B-PKG-1 = SELECTED / LOCKED

## Implemented contract shape

```text
OrganizationId
SiteId
UserId
TimeZone = Asia/Tokyo
RecordId
IdempotencyKey
PayloadFingerprint
Procedure: ApprovedProcedureReference
LocalDate                 // = performedAt Asia/Tokyo calendar day
planId
planVersion
result                    // PERFORMED_AS_PLANNED | PERFORMED_WITH_ADAPTATION | NOT_PERFORMED
performedAt
recordedAt                // >= performedAt
recordedBy
```

Schema (DEC-1):

```text
severe-behavior-support.procedure-record.record @ 1.0.0
dtoVersion = schemaVersion = 1.0.0
```

## Helpers

- `procedureRecordMatchesBinding` — Issue A seven-value alignment
- `deriveSupportRecordTraceRefFromProcedureRecord` — TraceRef derivation (not dual canonical)
- `procedureRecordFingerprintMaterial` — B-PKG-1 fingerprint constraint fields
- `resolveHistoricalPlanVersionForProcedureRecord` — FW05-HIST-02 fail-closed
- `projectProcedureRecordSupportContent` — A2 projection only from matching historical planVersion

## Explicitly not implemented

```text
FIELD-WORKFLOW UI
SharePoint columns / adapter / persistence
ExecutionRecord / AbcRecord / Observation mutation
A1 procedure body schema
Deploy / real data
Issue #352 / #347 / #299 Close
```

## Gate

```text
Implementation Start: AUTHORIZED for ProcedureRecord contract slice only
Synthetic data only: REQUIRED
SharePoint / M365 / Entra: NO-GO
Deploy / real data: NO-GO
FIELD-WORKFLOW UI: NOT AUTHORIZED
Ready / Merge: HUMAN-ONLY
```
