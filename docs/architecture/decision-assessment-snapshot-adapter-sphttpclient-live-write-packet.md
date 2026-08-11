# Decision-AS-ADAPTER-SPHTTPCLIENT-LIVE-WRITE-1 — Human Decision Packet

この文書は、live read-only PASS（PR #230）後の次 gate として、
**live write verification** の境界を固定する docs-only Decision Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-SPHTTPCLIENT-LIVE-WRITE-1
Status: GO RECEIVED / EXECUTION BLOCKED（no authenticated tenant session）
Human Decision: GO（live write verification）
Live-read HEAD: 4a76db5490ce223e22b01abf67f253566ab90487
Kind: live write verification gate（synthetic item only）

Deploy: NOT AUTHORIZED
Ready / Merge: HUMAN-ONLY
real business data: FORBIDDEN
```

## 1. Locked inputs（再 Decision しない）

```text
Decision-AS-TRANSPORT-1 = ACCEPTED / LOCKED
  TR-1-A / CL-1-A / CL-1-B

Decision-AS-ADAPTER-SPHTTPCLIENT-LIVE-READ-1
= PASS / VERIFIED（live read-only）

Binder Implementation Start = PASS（PR #229）
Synthetic/local binder tests = PASS

Pilot site:
  https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo
List:
  AssessmentSnapshots
Entity:
  SP.Data.AssessmentSnapshotsListItem
```

## 2. Human Decision meaning（this GO）

```text
GO = authorize live write verification on synthetic AssessmentSnapshots items only

Still separate later:
  Deploy / App Catalog
  Ready / Merge
```

## 3. Authorized IN

```text
IN:
  create one synthetic list item via REST POST（verbose + __metadata）
  MERGE update with supersedesSnapshotId: null（CL-1-B）
  read-back after create / clear
  delete the synthetic item（cleanup）
  record evidence
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  Deploy / App Catalog upload
  package-solution publish to tenant
  real business / production data writes
  column / list / site schema mutation
  Ready / Merge auto-progress
  treating write PASS as Deploy GO
```

## 5. Exact live-write procedure（Human or credentialed environment）

Target:

```text
Site: https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo
List: AssessmentSnapshots
Mode: synthetic item only；cleanup required
```

Use a unique synthetic snapshotId, for example:

```text
snapshotId = LIVEWRITE-SYNTH-YYYYMMDD-HHMMSS
```

### 5.1 Create（binder-compatible verbose POST）

```powershell
Connect-PnPOnline -Url "https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo" -Interactive

$body = @{
  __metadata = @{ type = "SP.Data.AssessmentSnapshotsListItem" }
  snapshotId = "LIVEWRITE-SYNTH-REPLACE"
  recordStatus = "draft"
  result = "NO_FINDINGS"
  reasonCodes = "[]"
  ruleSetVersion = "1.0.0"
  periodStart = "2026-01-01"
  periodEnd = "2026-01-31"
  inputFingerprint = "livewrite-synth-fp"
  supersedesSnapshotId = "LIVEWRITE-SYNTH-PRIOR"
} | ConvertTo-Json -Depth 5

$create = Invoke-PnPSPRestMethod -Method Post `
  -Url "/_api/web/lists/GetByTitle('AssessmentSnapshots')/items" `
  -ContentType "application/json;odata=verbose" `
  -Content $body

$itemId = $create.d.Id
$itemId
```

Read-back:

```powershell
Invoke-PnPSPRestMethod -Method Get -Url "/_api/web/lists/GetByTitle('AssessmentSnapshots')/items($itemId)?`$select=Id,snapshotId,supersedesSnapshotId"
```

Expected:

```text
snapshotId = LIVEWRITE-SYNTH-REPLACE
supersedesSnapshotId = LIVEWRITE-SYNTH-PRIOR
```

### 5.2 MERGE clear（CL-1-B / binder-compatible null）

```powershell
$clear = '{"__metadata":{"type":"SP.Data.AssessmentSnapshotsListItem"},"supersedesSnapshotId":null}'

Invoke-PnPSPRestMethod -Method Post `
  -Url "/_api/web/lists/GetByTitle('AssessmentSnapshots')/items($itemId)" `
  -ContentType "application/json;odata=verbose" `
  -Headers @{ "X-HTTP-Method" = "MERGE"; "IF-MATCH" = "*" } `
  -Content $clear

Invoke-PnPSPRestMethod -Method Get -Url "/_api/web/lists/GetByTitle('AssessmentSnapshots')/items($itemId)?`$select=Id,snapshotId,supersedesSnapshotId"
```

Expected:

```text
supersedesSnapshotId = <empty / null>
no empty-string fallback used
```

### 5.3 Cleanup（required）

```powershell
Remove-PnPListItem -List "AssessmentSnapshots" -Identity $itemId -Force
# confirm absence
try {
  Get-PnPListItem -List "AssessmentSnapshots" -Id $itemId -ErrorAction Stop
  "UNEXPECTED: item still present"
} catch {
  "cleanup confirmed absent"
}
```

Expected:

```text
Synthetic residue = 0
Cleanup = PASS
```

## 6. Agent execution attempt（this environment）

```text
Authenticated SharePoint session: ABSENT
pwsh / PnP.PowerShell / m365 CLI: ABSENT

Unauthenticated probe after live-read PASS recording:
  GET .../AssessmentSnapshots -> HTTP 403 UnauthorizedAccessException

Therefore:
  live write execution by Agent = NOT RUN / ENVIRONMENT BLOCKED
  live write verification = NOT PASS（pending Human or credentialed execution）
```

## 7. Pass criteria（when executed）

```text
PASS requires all:
  1. synthetic create succeeds and read-back shows supersedes present
  2. MERGE null clear succeeds and read-back shows supersedes cleared
  3. cleanup deletes the synthetic item（residue = 0）
  4. no Deploy / App Catalog action
  5. no real business data written
  6. evidence recorded in verification doc
```

## 8. Stop condition

```text
Decision-AS-ADAPTER-SPHTTPCLIENT-LIVE-WRITE-1
= GO RECEIVED / EXECUTION HOLD

HOLD:
  authenticated live-write execution evidence

Still NOT AUTHORIZED:
  Deploy
  Ready / Merge
```
