# Decision-AS-ADAPTER-SPHTTPCLIENT-LIVE-READ-1 — Human Decision Packet

この文書は、synthetic SPHttpClient binder（PR #229）完了後の次 gate として、
**live read-only verification** の境界を固定する docs-only Decision Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-SPHTTPCLIENT-LIVE-READ-1
Status: GO RECEIVED / EXECUTION BLOCKED（no authenticated tenant session）
Human Decision: GO（live read-only first）
Baseline binder HEAD: e52ad05cd5d8e2ec705034bb98cb22e9673dbf55
Kind: live read-only verification gate

live write: NOT AUTHORIZED
Deploy: NOT AUTHORIZED
Ready / Merge: HUMAN-ONLY
```

## 1. Locked inputs（再 Decision しない）

```text
Decision-AS-TRANSPORT-1 = ACCEPTED / LOCKED
  TR-1-A = SPFx SPHttpClient + SharePoint REST
  CL-1-A / CL-1-B = VERIFIED / LOCKED

Decision-AS-ADAPTER-SPHTTPCLIENT-BINDING-1 =
  ACCEPTED / LOCKED / B1 PREREQUISITE-FIRST

Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1 =
  ACCEPTED / LOCKED / V-1 + A + D-HOLD

Binder Implementation Start = PASS（PR #229）
Synthetic/local verification = PASS
IR-P2-002 = CLOSED / VERIFIED（synthetic/local）

Pilot site（OBSERVED / CONFIRMED）:
  https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo
List:
  AssessmentSnapshots
Entity:
  SP.Data.AssessmentSnapshotsListItem
```

## 2. Human Decision meaning（this GO）

```text
GO = authorize live read-only verification only

Minimum-risk order retained:
  1. live read-only verification  ← this GO
  2. live write verification      ← NOT authorized
  3. Deploy                       ← NOT authorized
```

```text
synthetic VERIFIED ≠ live tenant VERIFIED
This GO starts only the read-only live gate.
```

## 3. Authorized IN

```text
IN:
  authenticated GET against pilot AssessmentSnapshots
  read list metadata / item count / optional synthetic item fields
  confirm binder URL shape matches live REST surface:
    /_api/web/lists/GetByTitle('AssessmentSnapshots')/items
    optional $filter=snapshotId eq '...'
  record evidence in repository docs
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  POST / MERGE / MERGE create
  MERGE / PATCH update
  item delete
  column / list / site mutation
  App Catalog / Deploy
  real business data use as fixture
  Ready / Merge auto-progress
```

## 5. Exact live-read procedure（Human or credentialed environment）

Target:

```text
Site: https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo
List: AssessmentSnapshots
Mode: GET only
```

### 5.1 List existence / metadata（required）

```powershell
Connect-PnPOnline -Url "https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo" -Interactive
Get-PnPList -Identity "AssessmentSnapshots" | Select-Object Title, ItemCount, Id
Invoke-PnPSPRestMethod -Method Get -Url "/_api/web/lists/GetByTitle('AssessmentSnapshots')?`$select=Title,ItemCount,ListItemEntityTypeFullName"
```

Expected:

```text
Title = AssessmentSnapshots
ListItemEntityTypeFullName = SP.Data.AssessmentSnapshotsListItem
```

### 5.2 Binder-compatible items GET（required）

```powershell
Invoke-PnPSPRestMethod -Method Get -Url "/_api/web/lists/GetByTitle('AssessmentSnapshots')/items?`$top=1&`$select=Id,snapshotId,recordStatus,result,reasonCodes,ruleSetVersion,periodStart,periodEnd,inputFingerprint,supersedesSnapshotId"
```

Record:

```text
HTTP status
whether results array is present
field Internal Names observed（no write）
```

### 5.3 Optional filtered read（only if a known synthetic snapshotId exists）

```powershell
# Replace SYNTHETIC-SNAPSHOT-ID only with an already-known synthetic id.
# Do NOT create an item in this gate.
Invoke-PnPSPRestMethod -Method Get -Url "/_api/web/lists/GetByTitle('AssessmentSnapshots')/items?`$filter=snapshotId eq 'SYNTHETIC-SNAPSHOT-ID'&`$select=Id,snapshotId,supersedesSnapshotId&`$top=1"
```

If no synthetic id exists, skip 5.3 and mark as NOT APPLICABLE（list metadata + items GET still suffice for read-gate PASS）.

## 6. Agent execution attempt（this environment）

```text
Authenticated SharePoint session: ABSENT
pwsh / PnP.PowerShell / m365 CLI: ABSENT
Tenant secrets in environment: ABSENT

Unauthenticated probe:
  GET https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo/_api/web/lists/GetByTitle('AssessmentSnapshots')
  HTTP 403
  System.UnauthorizedAccessException

Therefore:
  live read execution by Agent = NOT RUN / ENVIRONMENT BLOCKED
  live read verification = NOT PASS（pending Human or credentialed execution）
```

## 7. Pass criteria（when executed）

```text
PASS requires all:
  1. authenticated GET succeeds（HTTP 200）
  2. AssessmentSnapshots list is readable
  3. ListItemEntityTypeFullName = SP.Data.AssessmentSnapshotsListItem
  4. items GET using binder-compatible $select succeeds
  5. no write/Deploy performed
  6. evidence recorded in verification doc
```

## 8. Stop condition

```text
Decision-AS-ADAPTER-SPHTTPCLIENT-LIVE-READ-1
= GO RECEIVED / EXECUTION HOLD

HOLD:
  authenticated live-read execution evidence
  Human or credentialed environment completion of §5

Still NOT AUTHORIZED:
  live write
  Deploy
  Ready / Merge
```
