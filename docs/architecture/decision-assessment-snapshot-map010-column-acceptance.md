# Decision-AS-MAP010-COLUMN-1 — Human Acceptance

この文書は、**Decision-AS-MAP010-COLUMN-1**（MAP-AS-010
`supersedesSnapshotId` Column Contract）についての
**Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-map010-column-packet.md`](./decision-assessment-snapshot-map010-column-packet.md)

Contract:
[`assessment-snapshot-map010-column-contract.md`](./assessment-snapshot-map010-column-contract.md)

Selected via:
[`decision-assessment-snapshot-map010-column-selection.md`](./decision-assessment-snapshot-map010-column-selection.md)

IR:
[`decision-assessment-snapshot-map010-column-independent-review.md`](./decision-assessment-snapshot-map010-column-independent-review.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-cv-extension-acceptance.md`](./decision-assessment-snapshot-cv-extension-acceptance.md)
（X-2-A PERSISTED）
[`decision-assessment-snapshot-column-names-acceptance.md`](./decision-assessment-snapshot-column-names-acceptance.md)
[`decision-assessment-snapshot-conversion-acceptance.md`](./decision-assessment-snapshot-conversion-acceptance.md)
[`assessment-snapshot-complete-contract.md`](./assessment-snapshot-complete-contract.md)
[`decision-dec-009-snapshot-save-timing-acceptance.md`](./decision-dec-009-snapshot-save-timing-acceptance.md)
[`decision-assessment-snapshot-application-save-acceptance.md`](./decision-assessment-snapshot-application-save-acceptance.md)
[`decision-assessment-snapshot-dec6-mapping-acceptance.md`](./decision-assessment-snapshot-dec6-mapping-acceptance.md)
[`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-MAP010-COLUMN-1
Status: Accepted / LOCKED
Human Decision: N-1-A + N-2-A + T-1-A + O-1-A + R-1-A + W-1-A + XB-1
Human Acceptance: Explicit Human Decision on 2026-08-10
PR: #209

LOCKED:

N-1 Internal Name:
  N-1-A — supersedesSnapshotId

N-2 Display Name:
  N-2-A — 訂正元スナップショットID

T-1 Column Type:
  T-1-A — 1行テキスト
  Logical requiredness remains OPTIONAL（not escalated to Required）

O-1 Optional / absence semantics:
  O-1-A — logical absence（undefined） ↔ persistence blank/null/missing
          Read absence → undefined
          empty string / whitespace-only = present-invalid → FAIL-CLOSED
          FORBIDDEN: null→default / empty→synthetic ID / trim-to-accept / optional→required

R-1 Read Conversion:
  R-1-A — null/missing → undefined
          valid non-empty string → exact pass-through（no trim）
          empty / whitespace-only / unexpected non-string → FAIL-CLOSED
          cross-record/domain validation NOT moved into this conversion

W-1 Write Conversion:
  W-1-A — undefined/absent → persistence absence semantic
          valid non-empty string → exact Text pass-through（no trim）
          empty / whitespace-only / null logical input → FAIL-CLOSED
          exact SharePoint client clear/omit/null transport mechanics
          = deferred to adapter implementation gate（NOT locked here）

Layer ownership:
  Column conversion — shape / presence / string validity
  Domain — !== snapshotId；finalized-state constraints
  Application save — correct-as-new-version；overwrite prohibition
  Adapter — SharePoint transport / exact clear-or-omit API mechanics

Implementation / create / Deploy boundary:
  XB-1 — 本 Decision ≠ physical column exists
         ≠ Human column create GO
         ≠ VR-1 PASS
         ≠ mapping-complete PASS
         ≠ adapter Implementation Start
         ≠ schema / DTO wiring GO
         ≠ Deploy GO

P2 disposition:
  P2-001 CLOSED — Internal Name Human-Accepted as supersedesSnapshotId
  P2-002 OPEN / CARRY-FORWARD — exact SharePoint clear/omit API
         Decision blocker: NO

Physical column（living；post-Acceptance Human path）:
  PRESENT（isogo + honmoku；OBSERVED / CONFIRMED）
VR-1 for MAP-AS-010（living）:
  PASS
MAP-AS-010 column-ready（living）:
  YES
mapping-complete（living）:
  PASS / COMPLETE
SharePoint column create / mutation by this Acceptance alone:
  FORBIDDEN（Acceptance-time boundary retained）
Human SharePoint create（separate physical path）:
  COMPLETE
Agent SharePoint mutation:
  0
Implementation Start:
  HOLD
adapter / schema / DTO wiring:
  HOLD
Deploy / real data:
  NO-GO

Closes only（Acceptance-time）:
  Decision-AS-MAP010-COLUMN-1
  （N-1-A + N-2-A + T-1-A + O-1-A + R-1-A + W-1-A + XB-1）
Post-Acceptance physical path（separate evidence / determination）:
  Human column create + VR-1 — COMPLETE / PASS
  mapping-complete — PASS / COMPLETE
Still NOT closed:
  adapter / schema / DTO wiring
  Implementation Start
  P2-002 clear/omit transport API
  Deploy / real data
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: N-1-A + N-2-A + T-1-A + O-1-A + R-1-A + W-1-A + XB-1
Decision-AS-MAP010-COLUMN-1: Accepted / LOCKED
MAP-AS-010 Column Contract: ACCEPTED / LOCKED
Human Acceptance date: 2026-08-10
```

日本語正本:

```text
N-1-A:
  Internal Name = supersedesSnapshotId
N-2-A:
  Display Name = 訂正元スナップショットID
T-1-A:
  Column Type = 1行テキスト（REQUIRED へ昇格しない；OPTIONAL）
O-1-A:
  任意欠落は blank/null/missing ↔ undefined。
  empty / whitespace-only は invalid present として fail-closed。
R-1-A / W-1-A:
  値があるときは無改変パススルー。trim-to-accept 禁止。
  Write の欠落表現の具体 API は adapter 実装ゲートへ延期。
XB-1:
  本 Acceptance だけでは列作成 / VR-1 / mapping-complete /
  adapter / Deploy を開始・確定しない。
```

```text
Agent recommendation（同セット）:
  NOT Human Acceptance evidence by itself
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-AS-MAP010-COLUMN-1: Accepted / LOCKED

Internal Name:      N-1-A = supersedesSnapshotId
Display Name:       N-2-A = 訂正元スナップショットID
Column Type:        T-1-A = 1行テキスト
Requiredness:       OPTIONAL
Optional semantics: O-1-A
Read Conversion:    R-1-A
Write Conversion:   W-1-A
Boundary:           XB-1

NOT SELECTED:
  N-1-HOLD / N-1-X
  N-2-B / N-2-HOLD / N-2-X
  T-1-B / T-1-HOLD / T-1-X
  O-1-B / O-1-HOLD / O-1-X
  R-1-B / R-1-HOLD / R-1-X
  W-1-B / W-1-HOLD / W-1-X
  XB-2
```

### Accepted column contract table

| Item | Value | Status |
|---|---|---|
| Mapping ID | MAP-AS-010 | LOCKED prior（PERSISTED） |
| Logical Field | supersedesSnapshotId | LOCKED prior |
| Internal Name | supersedesSnapshotId | ACCEPTED / LOCKED |
| Display Name | 訂正元スナップショットID | ACCEPTED / LOCKED |
| Column Type | 1行テキスト | ACCEPTED / LOCKED |
| Requiredness | OPTIONAL | ACCEPTED / LOCKED |
| Read Conversion | R-1-A | ACCEPTED / LOCKED |
| Write Conversion | W-1-A | ACCEPTED / LOCKED |
| Optional semantics | O-1-A | ACCEPTED / LOCKED |
| Physical column | PRESENT（isogo + honmoku） | living（Human create COMPLETE） |
| VR-1 | PASS | living |
| Column-ready | YES | living |
| mapping-complete | PASS / COMPLETE | living（M-1-A determination） |

失敗時 MUST NOT（LOCKED）:

```text
null → default
empty → synthetic ID
trim-to-accept
optional → required escalation
locking REST/PnP clear API mechanics in this Decision
treating this Acceptance as SharePoint create GO
treating this Acceptance as VR-1 PASS
treating this Acceptance as mapping-complete PASS
treating this Acceptance as adapter Implementation Start
Agent による SharePoint / M365 / Entra mutation を許可する
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-MAP010-COLUMN-1 Accepted = physical column exists
  Decision-AS-MAP010-COLUMN-1 Accepted = Human column create GO
  Decision-AS-MAP010-COLUMN-1 Accepted = VR-1 PASS
  Decision-AS-MAP010-COLUMN-1 Accepted = mapping-complete PASS
  Decision-AS-MAP010-COLUMN-1 Accepted = adapter / DTO / schema wiring GO
  Decision-AS-MAP010-COLUMN-1 Accepted = Implementation Start
  Decision-AS-MAP010-COLUMN-1 Accepted = Deploy / real data GO
  Decision-AS-MAP010-COLUMN-1 Accepted = P2-002 closed
```

## Acceptance boundary

```text
This Acceptance locks MAP-AS-010 Column Contract only.

MUST NOT start from this Acceptance alone:
  SharePoint column create / rename / delete
  VR-1 execution
  TypeScript / application / persistence port / adapter / DTO code
  Implementation Start
  Deploy / real data
  GitHub Issue mutation
  Ready / Merge without separate Human authorization
```

## Post-Acceptance physical path（living）

```text
MAP-AS-010 disposition: PERSISTED / ACCEPTED
MAP-AS-010 column contract: ACCEPTED / LOCKED
MAP-AS-010 column-ready: YES
Physical column: PRESENT
VR-1: PASS
mapping-complete: PASS / COMPLETE

Evidence:
  decision-assessment-snapshot-map010-column-create-vr1-evidence.md
Determination:
  decision-assessment-snapshot-mapping-complete-determination.md
```

## Next

```text
Decision-AS-MAP010-COLUMN-1: Accepted / LOCKED
  / N-1-A + N-2-A + T-1-A + O-1-A + R-1-A + W-1-A + XB-1
P2-001: CLOSED
P2-002: OPEN / CARRY-FORWARD（non-blocking；adapter impl gate）
mapping-complete: PASS / COMPLETE
Human SharePoint create: COMPLETE
VR-1: PASS
Implementation Start: HOLD
adapter / schema / DTO wiring: HOLD
SharePoint / M365 mutation by Agent: FORBIDDEN
Deploy / real data: NO-GO
```
