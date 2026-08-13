# FIELD-WORKFLOW Contract Issue A — SupportPlanVersionProcedureBinding implementation boundary

Status: GO-SLICE / HUMAN AUTHORIZED (Issue #347 契約実装 GO)  
Human decision date: 2026-08-13  
Source:
- Issue #347
- Decision-FIELD-WORKFLOW-CONTRACT-A-OPTION-A2-1 = SELECTED / LOCKED
- Design-FIELD-WORKFLOW-CONTRACT-A-MIN-SHAPE-1 = DESIGN LOCKED

## Implemented contract shape

```text
OrganizationId
SiteId
UserId
planId
planVersion
Procedure: ApprovedProcedureReference
  ProcedureId
  ProcedureVersion
  ApprovalState = APPROVED
```

Schema (DEC-1):

```text
severe-behavior-support.support-plan.version-procedure-binding @ 1.0.0
dtoVersion = schemaVersion = 1.0.0
```

## Existing contract alignment

- `planId` / `planVersion` align with `SupportPlanVersion` and `SupportRecordTraceRef`.
- `Procedure` **reuses** `ApprovedProcedureReference` (does not replace or body-extend it).
- `ExecutionRecord.Procedure` remains unchanged.
- Option A2: procedure body stays presentation projection outside this contract.
- Uniqueness key: OrganizationId + SiteId + (planId, planVersion, ProcedureId, ProcedureVersion).
- `bindingMatchesSupportPlanVersion` enforces UserId / plan identity alignment fail-closed.

## Explicitly not implemented

```text
SupportProcedure body schema (A1)
ProcedureRecord / result vocabulary / performedAt / recordedAt (Issue B)
FIELD-WORKFLOW UI
SharePoint columns / adapter / persistence
M365 / Entra mutation
Deploy / real data
Issue #347 Close / #299 Close
```

## Gate

```text
Implementation Start: AUTHORIZED for this binding contract slice only
Synthetic data only: REQUIRED
SharePoint / M365 / Entra: NO-GO
Deploy / real data: NO-GO
Issue B filing: NOT AUTHORIZED by this slice
FIELD-WORKFLOW UI: NOT AUTHORIZED
Ready / Merge: HUMAN-ONLY
```
