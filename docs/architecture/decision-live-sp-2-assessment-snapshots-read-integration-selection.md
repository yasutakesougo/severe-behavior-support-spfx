# LIVE-SP-2 — AssessmentSnapshots Read Integration — Human Selection Packet

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-LIVE-SP-2-ASSESSMENTSNAPSHOTS-READ-INTEGRATION-1
Kind: Human Selection Packet（#300 second slice）
Status: SELECTED / LOCKED
Human instruction: #300 Second Slice Selection GO — LIVE-SP-2
Date: 2026-08-13
Issue: #300（LIVE-SHAREPOINT-V1）
Parent roadmap: #298 / completion-roadmap.md Phase 2
Baseline main: e8684ae7efebdaff05693808d9bba5ca87c91079
Depends on: LIVE-SP-1 PASS / COMPLETE / merged via PR #316
```

Depends on（再 Decision しない）:

- [`decision-live-sp-1-readonly-reconciliation-verification.md`](./decision-live-sp-1-readonly-reconciliation-verification.md)
- [`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)
- [`assessment-snapshot-conversion-contract.md`](./assessment-snapshot-conversion-contract.md)
- [`decision-assessment-snapshot-adapter-sphttpclient-live-read-verification.md`](./decision-assessment-snapshot-adapter-sphttpclient-live-read-verification.md)
- Issue #22 AssessmentSnapshots SPHttpClient adapter path（partial progress only）

## Human Selection

```text
Human Decision: SELECT LIVE-SP-2 as #300 second slice
Selected slice:
  ID: LIVE-SP-2
  Name: AssessmentSnapshots Read Integration
  Parent: #300 LIVE-SHAREPOINT-V1
```

## Why this is next

LIVE-SP-1 confirmed the current `severe-support-isogo` / `AssessmentSnapshots`
physical schema against Accepted / LOCKED repository contracts:

```text
LIVE-SP-1 = PASS / COMPLETE
DIFFERENCE = 0
UNKNOWN = 0
```

The repository already contains the AssessmentSnapshots SPHttpClient transport/binder path under
`spfx/src/adapters/assessment-snapshot/`, with historical synthetic verification and historical
live-read PASS evidence. LIVE-SP-2 therefore does **not** redesign the schema or create another
parallel adapter. It selects the narrow responsibility of connecting the existing Accepted mapping
and existing AssessmentSnapshots read adapter path to an application runtime read-integration
boundary, while preserving fail-closed behavior.

```text
minimum-risk order:
  1. LIVE-SP-1 fresh schema reconciliation             = COMPLETE
  2. LIVE-SP-2 AssessmentSnapshots read integration    ← this Selection
  3. later write / broader fail-closed slices
  4. Entra / AuthorizationContext connection
  5. site / role boundary verification
  6. #300 completion review
```

## Selected responsibility

The following is the **future implementation responsibility selected by this gate**. Selection alone
does not authorize code mutation or live tenant execution.

```text
Target adapter path:
  spfx/src/adapters/assessment-snapshot/

Target live boundary:
  Site: severe-support-isogo
  List: AssessmentSnapshots

Read integration responsibility:
  reuse Accepted / LOCKED mapping and conversion contracts
  reuse existing AssessmentSnapshots SPHttpClient transport/binder path
  connect the read path to a narrow application runtime integration boundary
  keep SharePoint physical field names inside adapter/mapping boundaries
  distinguish successful empty reads from retrieval failure
  preserve fail-closed behavior for malformed / missing / unsupported data

Required result separation:
  success
  empty / no items as a successful read condition where applicable
  not_found where the selected lookup contract distinguishes it
  forbidden
  retrieval_failed

Forbidden conversions:
  retrieval_failed -> empty success
  retrieval_failed -> demo
  retrieval_failed -> score 0
  retrieval_failed -> not_applicable
  malformed / missing required data -> permissive success
```

## Implementation expectations after separate Start GO

```text
Code scope:
  smallest necessary AssessmentSnapshots read-integration wiring
  focused adapter / integration tests
  no duplicate schema or mapping contract

Test scope:
  synthetic/local tests first
  success path
  successful zero-item / empty-list behavior
  forbidden / retrieval failure behavior
  malformed response fail-closed behavior
  no demo fallback on retrieval failure

Live verification:
  authenticated GET-only smoke may be performed only under a separate Human execution gate
  if the execution environment has no SharePoint credential, record ENVIRONMENT BLOCKED and STOP
```

## Explicit OUT（Selection 時点）

```text
LIVE-SP-2 Implementation Start
code / SCSS mutation
SharePoint authenticated live GET execution
SharePoint POST / PATCH / MERGE / DELETE
SharePoint column / list / site create / update / delete
live write of any kind
new SharePoint columns or schema redesign
new parallel AssessmentSnapshots adapter
Entra / Graph / membership / role mutation
authentication / authorization policy re-decision
A/B cross-site expansion or SITE-HOM live integration
other SharePoint lists / business aggregates
real user data
App Catalog / Deploy / Production
#300 Close
Ready / Merge auto-progress
```

## Preserved boundaries

```text
LIVE-SP-1 verification remains PASS / COMPLETE and is not rerun by this Selection
Accepted / LOCKED AssessmentSnapshots mapping remains the repository SoT
mapping-complete remains PASS / COMPLETE
Decision-AS-TARGET-REUSE-1 = B remains unchanged
DailyActivityRecords /sites/welfare is not a new SPFx target
Issue #22 remains OPEN / PARTIAL; LIVE-SP-2 does not claim #22 completion
fail-closed remains mandatory
real business data remains forbidden
SharePoint write remains separately gated
Entra remains separately gated
Production remains NO-GO
```

## Selection acceptance criteria

- [x] second #300 slice has one explicit responsibility
- [x] existing AssessmentSnapshots adapter path is reused rather than duplicated
- [x] Accepted mapping/schema contracts are preserved
- [x] read result / failure-state separation is explicit
- [x] write, Entra, cross-site expansion, Deploy and Production are OUT
- [x] Implementation Start remains a separate Human gate
- [x] live authenticated execution remains a separate Human gate

## Gate

```text
LIVE-SP-2 = SELECTED / LOCKED as #300 second slice

This Selection does NOT authorize:
  Implementation Start
  code mutation
  authenticated live GET execution
  SharePoint write / mutation
  Entra mutation
  Deploy / Production
  #300 Close

Next Human gate:
  LIVE-SP-2 Implementation Start GO
```
