# LIVE-SP-2 — AssessmentSnapshots Read Integration — Human Acceptance（SELECT）

この文書は、**LIVE-SP-2 — AssessmentSnapshots Read Integration** に対する
Human Selection の Acceptance 正本である。

Packet:
[`decision-live-sp-2-assessment-snapshots-read-integration-selection.md`](./decision-live-sp-2-assessment-snapshots-read-integration-selection.md)

Depends on（再 Decision しない）:

- [`decision-live-sp-1-readonly-reconciliation-verification.md`](./decision-live-sp-1-readonly-reconciliation-verification.md)
- [`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)
- [`assessment-snapshot-conversion-contract.md`](./assessment-snapshot-conversion-contract.md)
- [`decision-assessment-snapshot-adapter-sphttpclient-live-read-verification.md`](./decision-assessment-snapshot-adapter-sphttpclient-live-read-verification.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-LIVE-SP-2-ASSESSMENTSNAPSHOTS-READ-INTEGRATION-1
Status: Accepted / LOCKED（Selection boundary）
Human Decision: SELECT LIVE-SP-2 as #300 second slice
Human Acceptance date: 2026-08-13
Issue: #300
Baseline main: e8684ae7efebdaff05693808d9bba5ca87c91079

Selected:
  LIVE-SP-2 — AssessmentSnapshots Read Integration
  Parent: #300 LIVE-SHAREPOINT-V1

Implementation Start: NOT AUTHORIZED
Authenticated live GET execution: NOT AUTHORIZED
SharePoint write / mutation: NOT AUTHORIZED
Entra mutation: NOT AUTHORIZED
Deploy / Production: NOT AUTHORIZED
#300 Close: NOT AUTHORIZED
```

Live gate（Ready / Merge / review 進行）は repository docs に自己参照的に固定しない。

## Human Acceptance（固定結論）

```text
Human Decision: SELECT LIVE-SP-2
Decision-LIVE-SP-2-ASSESSMENTSNAPSHOTS-READ-INTEGRATION-1: Accepted / LOCKED

Meaning:
  authorize the second #300 Phase 2 slice boundary only
  reuse the existing AssessmentSnapshots SPHttpClient read adapter path
  preserve Accepted / LOCKED mapping and conversion contracts
  select narrow application runtime read integration with fail-closed result separation
  Implementation Start and authenticated live execution remain separate Human GOs
```

## Accepted responsibility boundary

```text
IN as selected responsibility:
  existing spfx/src/adapters/assessment-snapshot/ read path
  severe-support-isogo / AssessmentSnapshots target boundary
  Accepted / LOCKED mapping reuse
  read-only runtime integration boundary
  success vs successful empty vs not_found / forbidden / retrieval_failed separation
  malformed / missing data fail-closed behavior
  focused synthetic/local tests after separate Implementation Start GO

OUT:
  schema redesign
  duplicate adapter implementation
  live write
  SharePoint create / update / delete
  Entra / Graph / membership / role mutation
  authorization policy re-decision
  SITE-HOM / cross-site expansion
  other lists / aggregates
  real user data
  Deploy / Production
  #300 Close
```

## Preserved decisions and evidence

```text
LIVE-SP-1 = PASS / COMPLETE
LIVE-SP-1 DIFFERENCE = 0
LIVE-SP-1 UNKNOWN = 0
AssessmentSnapshots mapping-complete = PASS / COMPLETE
historical AssessmentSnapshots live-read evidence = PASS / VERIFIED
Issue #22 = OPEN / PARTIAL
Decision-AS-TARGET-REUSE-1 = B
Production = NO-GO
```

The historical live-read PASS does not itself authorize LIVE-SP-2 implementation or a new live GET
execution. LIVE-SP-2 exists to integrate the already-established read adapter and mapping into the
current application runtime boundary without silently broadening into write or authorization work.

## Boundary equations

```text
SELECT LIVE-SP-2 ≠ Implementation Start
SELECT LIVE-SP-2 ≠ authenticated live GET execution
SELECT LIVE-SP-2 ≠ SharePoint write
SELECT LIVE-SP-2 ≠ column / list / site mutation
SELECT LIVE-SP-2 ≠ Entra / Graph / auth / role mutation
SELECT LIVE-SP-2 ≠ cross-site integration
SELECT LIVE-SP-2 ≠ Deploy / Production
SELECT LIVE-SP-2 ≠ #300 Close
```

## Current execution snapshot

```text
LIVE-SP-1 = PASS / COMPLETE / merged to main
LIVE-SP-2 Selection = SELECTED / LOCKED
LIVE-SP-2 Implementation Start = NOT AUTHORIZED
LIVE-SP-2 authenticated live GET execution = NOT AUTHORIZED
SharePoint write = NOT AUTHORIZED
Entra mutation = NOT AUTHORIZED
Deploy / Production = NOT AUTHORIZED
#300 = OPEN
```

## Stop / HOLD

```text
Do not start code mutation without LIVE-SP-2 Implementation Start GO
Do not perform authenticated live GET without a separate LIVE-SP-2 execution GO
Do not write to SharePoint
Do not create or change SharePoint schema
Do not mutate Entra
Do not Deploy
Do not Close #300
Do not broaden to SITE-HOM or other lists
Do not introduce real user data
```

## Next Human gate

```text
LIVE-SP-2 Implementation Start GO
```
