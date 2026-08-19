# FIELD-STAFF-PHASE8-MULTI-USER-SCALE-EVIDENCE-1

```text
Parent sequencing: #392
Remaining owner: #448
Exact slice: FIELD-STAFF-PHASE8-MULTI-USER-SCALE-EVIDENCE-1
Mode: synthetic presentation / evidence only
Implementation base HEAD: 5946269ed7b15ab88fae63408df6340032ce3d55
Evidence implementation commit: 874e43f39cd51a2def4ab4d0bb0cb571616a03f1
Implementation Start: Human GO received
Fresh Review: PASS
LIVE WRITE / SharePoint / M365 / Entra / Deploy: NOT AUTHORIZED
```

## Scope

This slice adds a separate synthetic 18-user roster projection and focused
browser evidence. It does not expand the existing eight-user fixture, change
save-state semantics, or add a ProcedureRecord persistence path.

```text
IN:
  synthetic 18-user roster
  unique user/context assertions
  tablet filter and detail-return smoke
  interaction-burden measurement

OUT:
  production host/runtime acceptance
  correction persistence
  cancellation / supersede
  ABC workflow
  schema / DTO / domain lifecycle semantics
  LIVE WRITE / Deploy
```

## Verification

```text
SPFx Heft test --clean: PASS
  43 suites
  304 tests passed
  0 failed

Focused browser smoke:
  FIELD-STAFF-PHASE8-MULTI-USER-SCALE-EVIDENCE-1
  1 / 1 PASS
  viewport: 768 x 1024
  page errors: 0
  horizontal overflow: false
  SharePoint / Graph requests: none
```

Focused assertions:

- 18 visible rows have unique user IDs and person labels.
- Every row retains non-empty user, plan, and record context labels.
- Existing Aさん / Cさん detail-preview boundary remains the only enabled detail preview.
- Unrecorded filter returns 7 rows, then restores all 18 rows.
- Aさん detail opens as Aさん and returns to an 18-row roster.
- Save-state, correction, cancellation, ABC, schema, live tenant, and deploy flags remain closed.

## Findings

```text
P0: 0
P1: 0
P2: 1
```

P2-1: At 768px, the 18-user roster has a document scroll height of 4276px
against a 1024px viewport. The 18-user loop is context-safe in this smoke,
but vertical interaction burden remains substantial. This is a presentation
residual, not a production defect or a runtime scalability claim.

Wrong-user / context risk:

- No duplicate synthetic identity or person label was observed.
- Detail preview is disabled for unsupported rows rather than guessing a
  detail context.
- Detail return preserved the full 18-row roster.
- No production-host or live-data inference was made.

## Disposition

```text
UI correction exact-slice needed: YES
Recommended direction: narrow roster-burden correction, separately selected
Current slice status: evidence delivered; Fresh Review PASS; STOP
```

The next UI correction must not include correction persistence, cancellation,
ABC, save 5-state changes, schema changes, or production/runtime claims.
