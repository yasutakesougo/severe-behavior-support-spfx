# LIVE-SP-1 — Read-only Reconciliation — Verification Evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-LIVE-SP-1-READONLY-RECONCILIATION-1
Issue: #300（LIVE-SHAREPOINT-V1）
Verification target: fresh read-only schema reconciliation
Verification status: PASS / HUMAN EXECUTED
Date: 2026-08-12
Site: severe-support-isogo
List: AssessmentSnapshots
Writes performed: 0
Entra mutations performed: 0
Deploys performed: 0
Real user data recorded: 0
```

## Authority

```text
Selection / Acceptance:
  decision-live-sp-1-readonly-reconciliation-selection.md
  decision-live-sp-1-readonly-reconciliation-acceptance.md
Human gate: LIVE-SP-1 Read-only Reconciliation Execution GO
Human gate: LIVE-SP-1 PASS Record GO
Mode: authenticated browser / GET only
```

## Evidence provenance

Human が対象 Site に認証済みのブラウザで SharePoint REST の GET-only
endpoint を実行し、観測結果を提示した。本記録は、その Human-provided
primary-source observation と照合判定を durable evidence として記録する。

```text
Target site:
  https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo
Target list:
  AssessmentSnapshots

GET 1:
  /_api/web/lists/GetByTitle('AssessmentSnapshots')
  ?$select=Title,ItemCount,ListItemEntityTypeFullName

GET 2:
  /_api/web/lists/GetByTitle('AssessmentSnapshots')/items
  ?$top=1
  &$select=Id,snapshotId,recordStatus,result,reasonCodes,ruleSetVersion,
           periodStart,periodEnd,inputFingerprint,supersedesSnapshotId

GET 3:
  /_api/web/lists/GetByTitle('AssessmentSnapshots')/fields
  ?$select=Title,InternalName,TypeAsString,Required,Choices

GET 4 / GET 5:
  /_api/web/lists/GetByTitle('AssessmentSnapshots')
  /fields/GetByInternalNameOrTitle('<periodStart|periodEnd>')
  ?$select=Title,InternalName,TypeAsString,Required,DisplayFormat
```

No response body containing a list item or real user data is copied into this
repository.

## List and read-surface observations

| Check | Fresh observation | Accepted expectation | Result |
|---|---|---|---|
| Site access | authenticated access succeeded | `severe-support-isogo` | MATCH |
| List existence | `AssessmentSnapshots` exists | `AssessmentSnapshots` | MATCH |
| List title | `AssessmentSnapshots` | `AssessmentSnapshots` | MATCH |
| List item entity type | `SP.Data.AssessmentSnapshotsListItem` | `SP.Data.AssessmentSnapshotsListItem` | MATCH |
| Binder-compatible GET | selected field set accepted by items GET | MAP-AS-001〜008 + MAP-AS-010 read surface | MATCH |

## Fresh field observations

All observed SharePoint physical fields reported `Required=false`.

| Internal Name | TypeAsString | Required | Choice values / format | Result |
|---|---|---:|---|---|
| `snapshotId` | `Text` | false | — | MATCH |
| `recordStatus` | `Choice` | false | `下書き`, `確定` | MATCH |
| `result` | `Choice` | false | `該当なし`, `該当あり`, `適用外` | MATCH |
| `reasonCodes` | `Note` | false | — | MATCH |
| `ruleSetVersion` | `Text` | false | — | MATCH |
| `periodStart` | `DateTime` | false | `DisplayFormat=0` (`DateOnly`) | MATCH |
| `periodEnd` | `DateTime` | false | `DisplayFormat=0` (`DateOnly`) | MATCH |
| `inputFingerprint` | `Text` | false | — | MATCH |
| `supersedesSnapshotId` | `Text` | false | — | MATCH |

Choice labels match
[`decision-assessment-snapshot-choice-options-acceptance.md`](./decision-assessment-snapshot-choice-options-acceptance.md).
Internal Names, physical types, physical required flags, and DateOnly semantics
match
[`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)
and
[`assessment-snapshot-conversion-contract.md`](./assessment-snapshot-conversion-contract.md).

## Reconciliation

```text
GET 1 list metadata        = PASS
GET 2 binder-compatible    = PASS
GET 3 fields schema        = PASS
GET 4 periodStart format   = PASS / DateOnly
GET 5 periodEnd format     = PASS / DateOnly

List existence             = MATCH
List title                 = MATCH
Entity type                = MATCH
Internal Names             = MATCH / OBSERVED
Column types               = MATCH
Physical Required flags    = MATCH / no contradiction
Choice mappings            = MATCH
periodStart                = MATCH / DateOnly
periodEnd                  = MATCH / DateOnly

DIFFERENCE = 0
UNKNOWN = 0
```

## Verdict

```text
LIVE-SP-1 — Read-only Reconciliation
= PASS / COMPLETE

Accepted contract ↔ severe-support-isogo live AssessmentSnapshots schema
= MATCH

#300 LIVE-SHAREPOINT-V1 = OPEN
```

This verdict completes only the selected GET-only reconciliation. It does not
authorize or establish implementation, write-path behavior, Entra integration,
deployment, production readiness, or completion of `#300`.

## Preserved boundaries

```text
SharePoint write / mutation = 0
Entra mutation = 0
Deploy = 0
Real user data recorded = 0

Implementation Start = NOT AUTHORIZED
SharePoint write / mutation = NOT AUTHORIZED
Entra mutation = NOT AUTHORIZED
Deploy / Production = NOT AUTHORIZED
#300 Close = NOT AUTHORIZED
```
