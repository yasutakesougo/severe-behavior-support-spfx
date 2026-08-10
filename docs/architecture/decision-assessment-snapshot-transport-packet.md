# Decision-AS-TRANSPORT-1 — Human Decision Packet

この文書は、Decision-AS-ADAPTER-START-1 / AIS-1-B の Entry Criteria `EC-3` と `EC-4` を比較し、Human Decisionとverification結果を同期したliving packetである。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-TRANSPORT-1
Status: ACCEPTED / LOCKED
Baseline main: 5bbe912d0e5e127cf1846bb0edf5ddff24ca99a0

Human Decision:
  TR-1-A + CL-1-A + CL-1-B（verification-required）+ XB-1

EC-3 = MET
EC-4 = MET
P2-002 = CLOSED / VERIFIED
```

## Accepted transport

```text
TR-1-A:
  SPFx SPHttpClient + SharePoint REST
  no additional transport runtime dependency
```

## Accepted absence mechanics

```text
CREATE logical absence:
  CL-1-A — omit supersedesSnapshotId from REST request body

UPDATE present -> absent:
  CL-1-B — include supersedesSnapshotId: null in REST MERGE body
```

Logical empty string / whitespace / null input remains invalid / fail-closed under the existing persistence contract. Empty-string fallback and omit-on-update fallback are not selected.

## Human verification result

Human-only synthetic verification on `severe-support-isogo / AssessmentSnapshots` demonstrated:

```text
starting value: CL1B-SYNTH-PRIOR
entity type: SP.Data.AssessmentSnapshotsListItem
corrected MERGE body:
  {"__metadata":{"type":"SP.Data.AssessmentSnapshotsListItem"},"supersedesSnapshotId":null}
MERGE: success
read-back AFTER: blank / cleared
cleanup: PASS
synthetic residue: 0
Agent SharePoint mutation: 0
```

The first malformed attempt failed without changing the field and is excluded from PASS evidence.

Verification used PnP PowerShell `Invoke-PnPSPRestMethod` as the REST wrapper, not direct SPHttpClient runtime execution. It verifies the SharePoint REST server-side persistence mechanics resolved by P2-002. Direct SPHttpClient request construction must preserve the same locked JSON semantics and is an implementation-test concern.

## Entry Criteria result

```text
EC-1 mapping-complete = MET
EC-2 persistence contracts = MET
EC-3 adapter client / transport = MET
EC-4 exact clear / omit mechanics = MET

P2-002 = CLOSED / VERIFIED
```

## Boundary

```text
SharePoint / M365 / Entra mutation by Agent = FORBIDDEN
production data = NO-GO
Deploy = NO-GO
runtime dependency addition = NOT REQUIRED for TR-1-A
implementation outside limited AssessmentSnapshot adapter slice = NOT AUTHORIZED
```

This packet does not encode live Ready / Merge status. Live repository gates remain outside canonical docs under the self-referential gate policy.

## References

- `decision-assessment-snapshot-transport-selection.md`
- `decision-assessment-snapshot-transport-acceptance.md`
- `decision-assessment-snapshot-transport-verification.md`
- `decision-assessment-snapshot-transport-independent-review.md`
