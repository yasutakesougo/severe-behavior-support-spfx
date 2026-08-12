# LIVE-SP-2 — AssessmentSnapshots Read Integration — Implementation Start

```text
repository: yasutakesougo/severe-behavior-support-spfx
Slice: LIVE-SP-2 — AssessmentSnapshots Read Integration
Parent: #300 LIVE-SHAREPOINT-V1
Human authority: LIVE-SP-2 Implementation Start GO
Baseline main: 6e6053a460895087e812ca67a03370eb426db424
Date: 2026-08-13
Status: IMPLEMENTATION STARTED
```

Depends on（再 Decision しない）:

- `decision-live-sp-2-assessment-snapshots-read-integration-selection.md`
- `decision-live-sp-2-assessment-snapshots-read-integration-acceptance.md`
- `assessment-snapshot-conversion-contract.md`
- existing `spfx/src/adapters/assessment-snapshot/` SPHttpClient binder

## Implemented responsibility

```text
new read-only application facade:
  spfx/src/adapters/assessment-snapshot/read-integration.ts

SPFx host construction seam:
  spfx/src/adapters/assessment-snapshot/read-integration.factory.ts

focused synthetic tests:
  spfx/src/adapters/assessment-snapshot/read-integration.test.ts
```

The facade accepts only the existing `getBySnapshotId` transport capability. It does not expose
`createItem` or `updateItem` to LIVE-SP-2 callers.

## Read result mapping

```text
transport success + valid Accepted conversion -> success
NOT_FOUND                               -> not_found
FORBIDDEN                               -> forbidden
PERSISTENCE_UNAVAILABLE                 -> retrieval_failed
TRANSPORT_ERROR                         -> retrieval_failed
transport throw                         -> retrieval_failed
invalid / malformed persistence fields  -> retrieval_failed
```

No failure is converted to demo, zero, not-applicable, or successful empty data.

## Fail-closed conversion checks

The SPFx read seam mirrors the Accepted conversion semantics without importing root TypeScript
sources across the isolated SPFx package boundary:

- required Text is non-empty by predicate, preserving the original value without trimming
- stored Choice values are `draft|finalized` and
  `NO_FINDINGS|FINDINGS_PRESENT|NOT_APPLICABLE`
- `reasonCodes` is JSON unique `string[]`; malformed values and duplicates fail closed
- DateOnly preserves the civil day and accepts `YYYY-MM-DD` plus the previously accepted midnight-UTC wire form
- `supersedesSnapshotId` is optional; when present it must be non-empty Text
- returned `snapshotId` must exactly match the requested `snapshotId`
- invalid list item ID and `periodEnd < periodStart` fail closed

## Explicitly not executed by this implementation

```text
authenticated live GET = 0 / NOT AUTHORIZED
SharePoint POST/PATCH/MERGE/DELETE = 0 / NOT AUTHORIZED
SharePoint schema mutation = 0 / NOT AUTHORIZED
Entra / Graph mutation = 0 / NOT AUTHORIZED
SITE-HOM / cross-site expansion = NOT AUTHORIZED
real user data = 0
Deploy / Production = 0 / NOT AUTHORIZED
#300 Close = NOT AUTHORIZED
Ready / Merge = NOT AUTHORIZED
```

Constructing the host factory does not itself issue a request. A real tenant call remains behind a
separate Human execution gate.

## Verification boundary

Focused synthetic test source is included with this implementation. GitHub CI / SPFx build results
must be observed on the implementation PR before any Ready decision. A live GET smoke is not part of
this Implementation Start GO.
