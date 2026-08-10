# Decision-AS-TRANSPORT-1 — Human Decision Packet

この文書は、Decision-AS-ADAPTER-START-1 / AIS-1-B の Entry Criteria `EC-3` と `EC-4` を比較するHuman Decision Packetである。

Selected via:
[`decision-assessment-snapshot-transport-selection.md`](./decision-assessment-snapshot-transport-selection.md)

Depends on:
[`decision-assessment-snapshot-adapter-start-acceptance.md`](./decision-assessment-snapshot-adapter-start-acceptance.md)
[`decision-assessment-snapshot-map010-column-acceptance.md`](./decision-assessment-snapshot-map010-column-acceptance.md)
[`decision-assessment-snapshot-mapping-complete-determination.md`](./decision-assessment-snapshot-mapping-complete-determination.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-TRANSPORT-1
Status: CANDIDATE / NOT ACCEPTED
Baseline main: 5bbe912d0e5e127cf1846bb0edf5ddff24ca99a0
Implementation Start: HOLD
P2-002: OPEN / CARRY-FORWARD
```

## Question

AssessmentSnapshot adapterについて、

1. SharePointとのtransport clientを何に固定するか（EC-3）
2. optional `supersedesSnapshotId` の論理的absenceを、create/updateでどのtransport表現にするか（EC-4）

を決定する。

## Authority / external basis

Microsoft Learn:

- SPHttpClient is the SPFx client for SharePoint REST and manages write request digests:
  https://learn.microsoft.com/javascript/api/sp-http-base/sphttpclient
- SPFx SharePoint API guidance: SPHttpClient is available from context and needs no additional dependency; PnPjs is an alternative library:
  https://learn.microsoft.com/sharepoint/dev/spfx/connect-to-sharepoint
- SharePoint REST list item update uses item endpoint + MERGE semantics:
  https://learn.microsoft.com/sharepoint/dev/sp-add-ins/working-with-lists-and-list-items-with-rest

Current repository `package.json` contains no SharePoint adapter runtime dependency. This packet does not add one.

## EC-3 — transport client

| ID | Candidate | Assessment |
|---|---|---|
| **TR-1-A** | **SPFx `SPHttpClient` + SharePoint REST** | **RECOMMENDED** — SPFx-native, SharePoint auth context, digest management, no extra runtime dependency |
| TR-1-B | PnPjs | Valid alternative, but adds a community runtime dependency and abstraction not currently present |
| TR-1-C | Microsoft Graph listItem fields | Not preferred for this adapter: introduces Graph permission/client path where native SharePoint context already exists |
| TR-1-HOLD | No transport selection | Safe HOLD |

### Agent recommendation for EC-3

```text
TR-1-A — SPHttpClient + SharePoint REST
```

Reason:

- The target persistence system is SharePoint itself.
- SPHttpClient is designed for SharePoint REST in SPFx.
- It is available from SPFx context and manages request digest for writes.
- No new runtime dependency is required for the transport abstraction itself.

This recommendation is not Human Acceptance.

## EC-4 — optional absence transport semantics

Locked logical semantics from MAP-AS-010:

```text
logical absence = undefined
logical empty string = INVALID / FAIL-CLOSED
logical whitespace-only = INVALID / FAIL-CLOSED
logical null input = INVALID / FAIL-CLOSED
```

Therefore logical absence MUST NOT be implemented by accepting empty string as a domain value.

### Create path

Candidate `CL-1-A`:

```text
When supersedesSnapshotId is logically absent on CREATE:
  omit supersedesSnapshotId from the SharePoint REST request body.
```

Rationale: absence does not need a synthetic persisted value.

### Update path

The remaining uncertainty is clearing an already-populated optional Text field.

Candidate `CL-1-B`:

```text
When supersedesSnapshotId transitions present -> absent on UPDATE:
  include supersedesSnapshotId: null in the SharePoint REST MERGE body.
```

Expected postcondition:

```text
read-back supersedesSnapshotId = null / absent persistence value
logical conversion => undefined
```

However, the Microsoft SharePoint REST list-item update documentation confirms MERGE updates but does not explicitly document the standard-list Text-column clear-by-null case in the cited page.

For that reason `CL-1-B` is a **verification-required candidate**, not Accepted here.

### Alternatives not selected automatically

| ID | Mechanics | Status |
|---|---|---|
| CL-1-B | MERGE body includes `supersedesSnapshotId: null` | RECOMMENDED CANDIDATE / NEEDS HUMAN VERIFICATION |
| CL-1-C | MERGE body includes empty string | NOT RECOMMENDED — risks collapsing transport clear with invalid logical empty-string semantics |
| CL-1-D | omit field on UPDATE | NOT A CLEAR — omission means this packet must not assume an existing value is removed |
| CL-1-HOLD | keep EC-4 unresolved | SAFE HOLD |

## Verification Gate for CL-1-B

Before `EC-4 = MET`, Human-only verification must demonstrate the exact SharePoint REST behavior with synthetic/non-production data and read-back evidence:

```text
V-1: starting persisted supersedesSnapshotId = non-empty synthetic string
V-2: update through the selected SharePoint REST transport with JSON null
V-3: HTTP operation succeeds
V-4: read-back shows persistence absence/null, not empty-string-as-value
V-5: logical conversion returns undefined
V-6: no unrelated fields change
V-7: Agent SharePoint mutation = 0
```

This packet does NOT authorize that SharePoint write by itself. Human mutation requires a separate explicit execution step.

## Proposed Human Decision

Recommended set:

```text
TR-1-A
+ CL-1-A
+ CL-1-B as verification-required candidate
+ XB-1
```

Meaning:

```text
EC-3 may become MET after Human Acceptance of TR-1-A.
EC-4 remains NOT YET until CL-1-B Human verification passes and its exact behavior is then Accepted / LOCKED.
Implementation Start remains HOLD until EC-3 + EC-4 are both MET.
```

## XB-1 — boundary

```text
This Decision Packet ≠ adapter Implementation Start
This Decision Packet ≠ runtime dependency addition
This Decision Packet ≠ SharePoint write authorization
This Decision Packet ≠ Deploy GO
This Decision Packet ≠ P2-002 closure
```

## Explicit OUT

```text
adapter source mutation
package dependency mutation
SharePoint / M365 / Entra mutation by Agent
real data
Deploy
Issue mutation
silent fallback from null-clear to empty-string
silent fallback from clear to omit
```

## Next gate

Human Decision on the recommended set. If accepted, EC-3 is locked to SPHttpClient + SharePoint REST, while EC-4 proceeds to a separate Human-only verification before Implementation Start can become GO.
