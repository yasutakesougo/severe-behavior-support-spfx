# Decision-AS-ADAPTER-SPHTTPCLIENT-LIVE-WRITE-1 — Verification Evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-SPHTTPCLIENT-LIVE-WRITE-1
Verification target: synthetic live write against AssessmentSnapshots
Verification status: NOT PASS
Date: 2026-08-11
Site: severe-support-isogo
List: AssessmentSnapshots
Deploy performed: 0
real business data writes: 0
itemId: NONE
synthetic residue: 0
```

## Authority

```text
Human Decision: GO-LIVE-WRITE
Acceptance: decision-assessment-snapshot-adapter-sphttpclient-live-write-acceptance.md
Procedure: decision-assessment-snapshot-adapter-sphttpclient-live-write-packet.md §5
Prerequisite:
  Decision-AS-ADAPTER-SPHTTPCLIENT-LIVE-READ-1 = PASS / VERIFIED
Choice = A（LOCKED）
```

## Human interim execution（safe / residue 0）

```text
Choice A = LOCKED

live write = NOT PASS

attempt 1:
  verbose POST = FAILED
  reason = type metadata not recognized

attempt 2:
  nometadata POST = FAILED
  reason = unexpected property 'Members'

actual $body2:
  Members = ABSENT
  payload fields = EXPECTED

Hypothesis（not binder verdict）:
  PnP PowerShell -Content serialization may reshape hashtable/object
  into a different JSON shape than the intended $body2.
  Official Invoke-PnPSPRestMethod accepts object or string for -Content
  and supports -Accept.
  Microsoft REST verbose create expects ListItemEntityTypeFullName
  as __metadata.type.

itemId = NONE
synthetic residue = 0
Deploy = NOT AUTHORIZED
Ready / Merge = HUMAN-ONLY

Binder defect: NOT CONCLUDED
Further POST: HOLD until PnP version / syntax confirmed（read-only）
```

## Next Human step（read-only diagnostic — no POST）

Paste output of:

```powershell
Get-Module PnP.PowerShell |
  Select-Object Name, Version, Path

$PSVersionTable.PSVersion

Get-Command Invoke-PnPSPRestMethod -Syntax
```

```text
Agent VM: pwsh / PnP.PowerShell = ABSENT
→ Human must run locally and paste the three outputs
```

After PnP version/syntax is known: one create request shaped to that installed PnP surface（not a POST retry storm）.

## Required PASS evidence（after successful §5）

```text
Tool: PnP PowerShell（version = <from diagnostic>）
Mode: synthetic write + cleanup

5.1 Create:
  snapshotId =
  itemId =
  create HTTP / result =
  read-back supersedesSnapshotId before clear =

5.2 MERGE null clear:
  clear HTTP / result =
  read-back supersedesSnapshotId after clear =
  empty-string fallback used = NO

5.3 Cleanup:
  deleted itemId =
  residue = 0

Deploy performed: 0
real business data writes: 0
```

## Verdict（current）

```text
live write = NOT PASS
reason = §5 live-write evidence absent
         （create attempts failed; no item created; residue = 0）

Deploy = NOT AUTHORIZED
Ready / Merge = HUMAN-ONLY
```
