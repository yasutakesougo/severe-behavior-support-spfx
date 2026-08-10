# Decision-AS-TRANSPORT-1 — Human Acceptance

この文書は、AssessmentSnapshot adapter の transport と optional Text clear / omit mechanics についての Human Acceptance 正本である。

Compare packet:
[`decision-assessment-snapshot-transport-packet.md`](./decision-assessment-snapshot-transport-packet.md)

Selected via:
[`decision-assessment-snapshot-transport-selection.md`](./decision-assessment-snapshot-transport-selection.md)

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

LOCKED:

Transport:
  TR-1-A — SPFx SPHttpClient + SharePoint REST
           no additional transport runtime dependency

CREATE logical absence:
  CL-1-A — omit supersedesSnapshotId from the REST request body

UPDATE present -> absent:
  CL-1-B — include supersedesSnapshotId: null in the REST MERGE body
           ACCEPTED / LOCKED AS VERIFICATION-REQUIRED
           exact SharePoint Text-column clear behavior is NOT YET VERIFIED
           no fallback to empty string or omission

Boundary:
  XB-1 — 本 Decision ≠ adapter Implementation Start
         ≠ runtime dependency addition
         ≠ SharePoint write authorization
         ≠ Deploy GO
         ≠ P2-002 closure

Entry Criteria:
  EC-3 = MET（TR-1-A Accepted / LOCKED）
  EC-4 = NOT YET（CL-1-B synthetic verification + read-back required）
P2-002:
  OPEN / CARRY-FORWARD
Implementation Start:
  HOLD
SharePoint / M365 mutation by Agent:
  FORBIDDEN
Deploy / real data:
  NO-GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: TR-1-A + CL-1-A + CL-1-B（verification-required）+ XB-1
Decision-AS-TRANSPORT-1: ACCEPTED / LOCKED
```

日本語正本:

```text
TR-1-A:
  AssessmentSnapshot adapter の SharePoint transport は
  SPFx SPHttpClient + SharePoint REST に固定する。
CL-1-A:
  CREATE 時に supersedesSnapshotId が論理的 absence なら、
  REST request body から同 field を omit する。
CL-1-B（verification-required）:
  UPDATE 時に supersedesSnapshotId が present -> absent へ遷移する場合、
  REST MERGE body に supersedesSnapshotId: null を含める方式を
  verification-required mechanics として固定する。
  標準 SharePoint Text 列が実際に clear されることは未検証であり、
  合成データ write + read-back の Human verification が完了するまで
  EC-4 を MET としない。
XB-1:
  本 Acceptance だけでは adapter implementation、SharePoint write、
  runtime dependency addition、Deploy、P2-002 closure を開始・許可しない。
```

## Accepted 内容

```text
Decision-AS-TRANSPORT-1: ACCEPTED / LOCKED

Transport:              TR-1-A
CREATE absence:         CL-1-A
UPDATE clear mechanics: CL-1-B（verification-required）
Boundary:               XB-1

NOT SELECTED:
  TR-1-B / TR-1-C / TR-1-HOLD
  CL-1-C / CL-1-D / CL-1-HOLD
```

`CL-1-B` の Acceptance は null-clear の成功証跡ではない。固定したのは、検証対象 mechanics と、検証成功前は `EC-4 = NOT YET` を維持する境界である。

## CL-1-B Verification Gate（LOCKED）

Human-only verification は synthetic / non-production data に限定し、次をすべて示さなければならない。

```text
V-1: starting persisted supersedesSnapshotId = non-empty synthetic string
V-2: selected SPHttpClient + SharePoint REST transport sends JSON null in MERGE
V-3: HTTP operation succeeds
V-4: read-back shows persistence absence/null, not empty-string-as-value
V-5: logical conversion returns undefined
V-6: no unrelated fields change
V-7: Agent SharePoint / M365 mutation = 0
```

Verification が失敗または不明の場合:

```text
EC-4 = NOT YET
P2-002 = OPEN
Implementation Start = HOLD
empty-string fallback = FORBIDDEN
omit-on-update fallback = FORBIDDEN
silent success = FORBIDDEN
```

## Acceptance boundary

```text
This Acceptance locks TR-1-A + CL-1-A + CL-1-B（verification-required）+ XB-1 only.

MUST NOT start from this Acceptance alone:
  TypeScript / application / persistence port / adapter code
  package dependency mutation
  SharePoint item write or Human verification execution
  SharePoint / M365 / Entra mutation by Agent
  P2-002 closure
  EC-4 = MET
  Implementation Start
  Deploy / real data
  GitHub Issue mutation
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  CL-1-B Accepted = SharePoint null-clear behavior verified
  CL-1-B Accepted = EC-4 MET
  Decision-AS-TRANSPORT-1 Accepted = P2-002 CLOSED
  Decision-AS-TRANSPORT-1 Accepted = adapter Implementation Start
  Decision-AS-TRANSPORT-1 Accepted = SharePoint write authorization
  Decision-AS-TRANSPORT-1 Accepted = Deploy / real data GO
```

## Next

```text
Decision-AS-TRANSPORT-1:
  ACCEPTED / LOCKED
  TR-1-A + CL-1-A + CL-1-B（verification-required）+ XB-1
EC-3:
  MET
EC-4:
  NOT YET
P2-002:
  OPEN / CARRY-FORWARD
Implementation Start:
  HOLD

Next substantive unit:
  CL-1-B Human-only synthetic verification authorization + evidence
```
