# Decision-AS-TRANSPORT-1 — Selection

AssessmentSnapshot adapter Implementation Start の Entry Criteria `EC-3 / EC-4` を解く substantive unit として、transport / clear mechanics Decision を選択した記録である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-TRANSPORT-1
Selection status: CONSUMED
Baseline main: 5bbe912d0e5e127cf1846bb0edf5ddff24ca99a0
Human Selection: 2026-08-11

Selected unit:
  AssessmentSnapshot adapter transport + optional Text clear mechanics

Decision:
  ACCEPTED / LOCKED
Human Decision:
  TR-1-A + CL-1-A + CL-1-B（verification-required）+ XB-1
Verification:
  CL-1-B = PASS / VERIFIED

EC-3 = MET
EC-4 = MET
P2-002 = CLOSED / VERIFIED
SharePoint / M365 mutation by Agent = 0 / FORBIDDEN
Deploy / real data = NO-GO
```

## Locked basis

```text
Decision-AS-ADAPTER-START-1 = ACCEPTED / LOCKED as AIS-1-B
EC-1 mapping-complete = MET
EC-2 persistence contracts = MET
TR-1-A = SPFx SPHttpClient + SharePoint REST
CL-1-A = CREATE absence => omit field
CL-1-B = UPDATE present -> absent => JSON null in REST MERGE
```

Human-only synthetic verification demonstrated the SharePoint REST server-side null-clear behavior and cleanup completed with no synthetic residue.
The verification evidence used PnP PowerShell as a REST wrapper; direct SPHttpClient request construction remains an adapter implementation test concern and must preserve the locked payload semantics.

This Selection does not authorize SharePoint mutation by Agent, production data, Deploy, or implementation outside the limited AssessmentSnapshot adapter slice.

## References

- `decision-assessment-snapshot-transport-packet.md`
- `decision-assessment-snapshot-transport-acceptance.md`
- `decision-assessment-snapshot-transport-verification.md`
- `decision-assessment-snapshot-transport-independent-review.md`
