# Decision-AS-TRANSPORT-1 — Human Acceptance

この文書は、AssessmentSnapshot adapter の transport と optional Text clear / omit mechanics についての Human Acceptance 正本である。

Compare packet:
[`decision-assessment-snapshot-transport-packet.md`](./decision-assessment-snapshot-transport-packet.md)

Verification evidence:
[`decision-assessment-snapshot-transport-verification.md`](./decision-assessment-snapshot-transport-verification.md)

IR:
[`decision-assessment-snapshot-transport-independent-review.md`](./decision-assessment-snapshot-transport-independent-review.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-adapter-start-acceptance.md`](./decision-assessment-snapshot-adapter-start-acceptance.md)
（AIS-1-B）
[`decision-assessment-snapshot-map010-column-acceptance.md`](./decision-assessment-snapshot-map010-column-acceptance.md)
（MAP-AS-010 logical absence = `undefined`）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-TRANSPORT-1
Status: ACCEPTED / LOCKED
Human Decision: TR-1-A + CL-1-A + CL-1-B（verification-required）+ XB-1
Human Acceptance: Explicit Human Decision on 2026-08-11
PR: #212
Baseline main: 5bbe912d0e5e127cf1846bb0edf5ddff24ca99a0

Transport:
  TR-1-A — SPFx SPHttpClient + SharePoint REST
           no additional transport runtime dependency

CREATE logical absence:
  CL-1-A — omit supersedesSnapshotId from REST request body

UPDATE present -> absent:
  CL-1-B — include supersedesSnapshotId: null in REST MERGE body
           VERIFIED / LOCKED
           Human-only synthetic SharePoint REST verification = PASS
           no fallback to empty string or omission

Entry Criteria:
  EC-3 = MET
  EC-4 = MET
P2-002:
  CLOSED / VERIFIED
SharePoint / M365 mutation by Agent:
  0 / FORBIDDEN
Deploy / real data:
  NO-GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Locked conclusion

```text
Decision-AS-TRANSPORT-1 = ACCEPTED / LOCKED
TR-1-A = ACCEPTED / LOCKED
CL-1-A = ACCEPTED / LOCKED
CL-1-B = VERIFIED / LOCKED
XB-1 = ACCEPTED / LOCKED

EC-3 = MET
EC-4 = MET
P2-002 = CLOSED / VERIFIED
```

### TR-1-A

AssessmentSnapshot adapter の SharePoint transport は `SPFx SPHttpClient + SharePoint REST` に固定する。
追加 transport runtime dependency は導入しない。

### CL-1-A

CREATE 時に `supersedesSnapshotId` が論理的 absence なら、REST request body から同 field を omit する。

### CL-1-B

UPDATE 時に `supersedesSnapshotId` が present → absent へ遷移する場合、REST MERGE body に `supersedesSnapshotId: null` を含める。

Human-only synthetic verification で、非空の開始値から raw SharePoint REST MERGE の JSON `null` によりText列がclearされることをread-backした。
検証では PnP PowerShell `Invoke-PnPSPRestMethod` をREST wrapperとして使用し、SPHttpClient runtime pathそのものは実行していない。
これはSharePoint REST server-side persistence mechanicsの検証であり、SPHttpClientが同じaccepted payload semanticsを構築することはadapter implementation testで検証する。

## Verification result

```text
Synthetic site: severe-support-isogo
List: AssessmentSnapshots
Synthetic item ID: 1
BEFORE: CL1B-SYNTH-PRIOR
MERGE body: {"__metadata":{"type":"SP.Data.AssessmentSnapshotsListItem"},"supersedesSnapshotId":null}
MERGE result: success
AFTER: blank / cleared in Human read-back
Cleanup: PASS / item no longer exists
Agent SharePoint mutation: 0
```

The first malformed MERGE attempt failed without changing the value and is excluded from PASS evidence.
The corrected raw REST MERGE is the verification basis.

## Boundary

```text
This Acceptance and verification DO NOT authorize:
  SharePoint / M365 / Entra mutation by Agent
  production data write
  Deploy
  runtime dependency addition
  implementation outside the limited AssessmentSnapshot adapter slice

Direct SPHttpClient request construction must preserve:
  CREATE absence => omit field
  UPDATE present -> absent => JSON null in MERGE body
  logical empty / whitespace / null input => fail-closed per existing contract
```

## Result for AIS-1-B entry criteria

```text
EC-1 mapping-complete = MET
EC-2 persistence contracts = MET
EC-3 transport selection = MET
EC-4 exact clear / omit mechanics = MET

Technical entry-criteria residual P2-002 = CLOSED / VERIFIED
```

The next live repository gate is handled outside canonical docs. Adapter code, Deploy, and Agent-side SharePoint mutation do not start from this document alone.
