# Decision-AS-TRANSPORT-1 — Independent Review

対象:

- `decision-assessment-snapshot-transport-packet.md`
- `decision-assessment-snapshot-transport-acceptance.md`
- `decision-assessment-snapshot-transport-verification.md`

```text
Review status: PASS
P0: 0
P1: 0
P2: 0
Baseline main: 5bbe912d0e5e127cf1846bb0edf5ddff24ca99a0
```

## Review result

- Human Decision `TR-1-A + CL-1-A + CL-1-B（verification-required）+ XB-1` is recorded as ACCEPTED / LOCKED.
- EC-3 is correctly fixed to `SPFx SPHttpClient + SharePoint REST` without adding a transport runtime dependency.
- CL-1-A preserves logical absence on CREATE by omitting the field rather than inventing an empty-string value.
- Human-only synthetic verification demonstrated SharePoint REST Text-column clear with JSON `null` in MERGE from a non-empty starting value.
- The first malformed request failed without mutation and is explicitly excluded from success evidence.
- Corrected raw REST MERGE succeeded and read-back showed the previously populated field cleared.
- Synthetic item cleanup was read back as absent; residue = 0.
- Agent SharePoint / M365 mutation remained 0.

## Client-path scope calibration

The Human verification used PnP PowerShell `Invoke-PnPSPRestMethod` as the HTTP/REST wrapper, not direct SPFx `SPHttpClient` runtime execution.

This is sufficient to resolve P2-002 as the SharePoint REST server-side persistence-mechanics uncertainty because the exact accepted raw JSON null MERGE behavior was exercised against the target SharePoint list.

It does not prove adapter code already constructs the request correctly. That remains an implementation-test obligation:

```text
SPHttpClient adapter must preserve:
  CREATE absence => omit supersedesSnapshotId
  UPDATE present -> absent => JSON null in MERGE body
```

That implementation test obligation is not a remaining transport-decision blocker and does not reopen P2-002.

## Finding closeout

| ID | Previous | Current | Basis |
|---|---|---|---|
| P2-002 | OPEN / CARRY-FORWARD | **CLOSED / VERIFIED** | Human synthetic REST null-MERGE + read-back + cleanup |

No P0 / P1 / P2 finding remains for this Decision unit.

## Entry Criteria review

```text
EC-1 = MET
EC-2 = MET
EC-3 = MET
EC-4 = MET
P2-002 = CLOSED / VERIFIED
```

## Boundary check

```text
adapter code mutation in PR #212 = 0
runtime dependency addition = 0
SharePoint / M365 mutation by Agent = 0
production data = 0
Deploy = 0
```

Verdict:

```text
PASS
Decision-AS-TRANSPORT-1 = ACCEPTED / LOCKED
CL-1-B verification = PASS
EC-3 / EC-4 = MET
P2-002 = CLOSED / VERIFIED
READY FOR LIVE PR GATE EVALUATION
```
