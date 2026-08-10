# Decision-AS-TRANSPORT-1 — CL-1-B Human Verification

この文書は、`supersedesSnapshotId` の present → absent clear mechanics に対する Human-only synthetic verification の証跡正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-TRANSPORT-1
Verification target: CL-1-B
Verification status: PASS
Date: 2026-08-11
Site: severe-support-isogo
List: AssessmentSnapshots
Synthetic item ID: 1
Agent SharePoint / M365 mutation: 0
Real data: 0
```

## Locked mechanics under test

```text
UPDATE present -> absent:
  SharePoint REST MERGE body includes:
  supersedesSnapshotId: null
```

The accepted implementation transport remains `SPFx SPHttpClient + SharePoint REST` (`TR-1-A`).
This Human verification exercised the SharePoint REST server behavior through PnP PowerShell `Invoke-PnPSPRestMethod`, not the SPHttpClient runtime path itself.
The raw REST request body and server endpoint mechanics are the same persistence contract being verified here; SPHttpClient request construction remains an adapter implementation test concern.

## Evidence

### Starting value

Synthetic item was created by Human with:

```text
supersedesSnapshotId = CL1B-SYNTH-PRIOR
```

Read-back:

```text
BEFORE = CL1B-SYNTH-PRIOR
ITEM ID = 1
```

### First attempt — excluded from PASS evidence

The first MERGE attempt failed with `InvalidClientQueryException` because the request body was interpreted as containing an unrelated `Members` property.

```text
AFTER = CL1B-SYNTH-PRIOR
```

Therefore no clear occurred and this attempt is not counted as verification success.

### Corrected raw REST MERGE

Human obtained:

```text
ENTITY = SP.Data.AssessmentSnapshotsListItem
```

Exact raw JSON body:

```json
{"__metadata":{"type":"SP.Data.AssessmentSnapshotsListItem"},"supersedesSnapshotId":null}
```

Request shape:

```text
Method: Merge
Endpoint: /_api/web/lists/GetByTitle('AssessmentSnapshots')/items(1)
Content-Type: application/json;odata=verbose
```

The MERGE completed without error.

Read-back:

```text
AFTER =
ITEM ID = 1
```

The previously non-empty Text field was cleared by the REST `null` MERGE mechanics.
No empty-string fallback or omit-on-update fallback was used.

## Cleanup evidence

Human deleted synthetic item ID 1.
Subsequent read-back returned:

```text
Get-PnPListItem: アイテムが存在しません。他のユーザーが削除した可能性があります。
```

Therefore:

```text
Synthetic residue = 0
Cleanup = PASS
```

## Verification verdict

```text
CL-1-B server-side SharePoint REST mechanics = VERIFIED / PASS
EC-4 = MET
P2-002 = CLOSED / VERIFIED
```

Scope note:

```text
Verified:
  SharePoint REST Text-column clear using JSON null in MERGE
  Human-only synthetic mutation + read-back
  cleanup

Not claimed by this evidence alone:
  adapter source implementation
  direct SPHttpClient runtime execution
  package dependency change
  production data write
  Deploy
```

Direct SPHttpClient request construction must preserve this exact accepted REST payload semantics and is to be covered by adapter implementation tests. It does not reopen the persistence-contract uncertainty resolved by P2-002.
