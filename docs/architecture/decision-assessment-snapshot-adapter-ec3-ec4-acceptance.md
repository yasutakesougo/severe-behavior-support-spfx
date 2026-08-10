# Decision-AS-ADAPTER-EC3-EC4-1 — Human Acceptance

この文書は、**Decision-AS-ADAPTER-EC3-EC4-1**
（AIS-1-B Entry Criteria EC-3 + EC-4）についての
**Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-adapter-ec3-ec4-packet.md`](./decision-assessment-snapshot-adapter-ec3-ec4-packet.md)

EC-3 comparison:
[`decision-assessment-snapshot-adapter-ec3-transport-comparison.md`](./decision-assessment-snapshot-adapter-ec3-transport-comparison.md)

EC-4 comparison:
[`decision-assessment-snapshot-adapter-ec4-clear-omit-comparison.md`](./decision-assessment-snapshot-adapter-ec4-clear-omit-comparison.md)

Selected via:
[`decision-assessment-snapshot-adapter-ec3-ec4-selection.md`](./decision-assessment-snapshot-adapter-ec3-ec4-selection.md)

IR（candidate）:
[`decision-assessment-snapshot-adapter-ec3-ec4-independent-review.md`](./decision-assessment-snapshot-adapter-ec3-ec4-independent-review.md)

Acceptance IR:
[`decision-assessment-snapshot-adapter-ec3-ec4-acceptance-independent-review.md`](./decision-assessment-snapshot-adapter-ec3-ec4-acceptance-independent-review.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-adapter-start-acceptance.md`](./decision-assessment-snapshot-adapter-start-acceptance.md)
（AIS-1-B）
[`decision-assessment-snapshot-sp-adapter-acceptance.md`](./decision-assessment-snapshot-sp-adapter-acceptance.md)
[`decision-assessment-snapshot-map010-column-acceptance.md`](./decision-assessment-snapshot-map010-column-acceptance.md)
（O-1-A / R-1-A / W-1-A）
[`assessment-snapshot-map010-column-contract.md`](./assessment-snapshot-map010-column-contract.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-EC3-EC4-1
Status: Accepted / LOCKED
Human Decision: ACCEPT-RECOMMENDED
Accepted / LOCKED set: TC-1-A + DP-1-A + CO-1-A + SV-1-A + XB-1
Human Acceptance: Explicit Human Decision on 2026-08-10
Baseline main: 5bbe912d0e5e127cf1846bb0edf5ddff24ca99a0
PR: #213

LOCKED:

TC-1 Transport / client:
  TC-1-A — SharePoint REST List Items API
           host = SPFx SPHttpClient when available

DP-1 Dependency posture:
  DP-1-A — No runtime dependency install authorized by this Acceptance

CO-1 Clear / omit mechanics（supersedesSnapshotId）:
  CO-1-A —
    Create + logical absence:
      omit supersedesSnapshotId from request body preferred
    Create / Update + valid non-empty string:
      send exact string without trim
    Update + logical absence / clear existing value:
      send "supersedesSnapshotId": null
    Update + omit:
      means leave existing persisted value unchanged
      MUST NOT represent logical absence when clearing is required
    Empty string: FAIL-CLOSED / no transport
    Whitespace-only: FAIL-CLOSED / no transport
    Logical null: FAIL-CLOSED / no transport

SV-1 Verification:
  SV-1-A — synthetic/local verification accepted
           No live tenant write required for this Decision

XB-1 Boundary:
  XB-1 — Acceptance ≠ Implementation Start
         Acceptance ≠ Deploy
         Acceptance ≠ runtime dependency install

Entry Criteria living（AIS-1-B）:
  EC-1 = MET
  EC-2 = MET
  EC-3 = MET（this Acceptance）
  EC-4 = MET（this Acceptance）
  EC-5..EC-8 = still required at Implementation Start gate

P2-002:
  CLOSED（this Acceptance）

Implementation Start:
  HOLD
adapter / DTO / schema wiring:
  HOLD
runtime dependency addition:
  NOT AUTHORIZED
SharePoint / M365 mutation by Agent:
  FORBIDDEN
Deploy / real data:
  NO-GO

Closes:
  Decision-AS-ADAPTER-EC3-EC4-1
  EC-3 selection residual
  EC-4 / P2-002 clear-omit residual
Does NOT close / authorize:
  Implementation Start
  adapter / DTO / schema wiring
  runtime dependency install
  SharePoint / M365 mutation
  Deploy / real data
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: ACCEPT-RECOMMENDED
Accepted / LOCKED set: TC-1-A + DP-1-A + CO-1-A + SV-1-A + XB-1
Decision-AS-ADAPTER-EC3-EC4-1: Accepted / LOCKED
Human Acceptance date: 2026-08-10
```

日本語正本:

```text
TC-1-A:
  Transport = SharePoint REST List Items API
  host = SPFx SPHttpClient when available
DP-1-A:
  本 Acceptance は runtime dependency の install を認可しない
CO-1-A:
  作成時の論理欠落は request body から supersedesSnapshotId を omit（preferred）
  作成 / 更新で有効な非空文字列は trim なしで exact 送信
  更新時の論理欠落 / 既存値 clear は "supersedesSnapshotId": null
  更新時の omit は既存永続値の維持であり、clear が必要な論理欠落の表現に使ってはならない
  空文字 / 空白のみ / 論理 null は FAIL-CLOSED / no transport
SV-1-A:
  合成 / ローカル検証を受理。本 Decision に live tenant write は不要
XB-1:
  本 Acceptance ≠ Implementation Start
  本 Acceptance ≠ Deploy
  本 Acceptance ≠ runtime dependency install
```

```text
Agent recommendation（同セット）:
  NOT Human Acceptance evidence by itself
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-AS-ADAPTER-EC3-EC4-1: Accepted / LOCKED

Transport / client:     TC-1-A
Dependency posture:     DP-1-A
Clear / omit mechanics: CO-1-A
Verification:           SV-1-A
Boundary:               XB-1

NOT SELECTED:
  TC-1-B / TC-1-C / TC-1-D / TC-1-HOLD
  DP-1-B / DP-1-C / DP-1-HOLD
  CO-1-B / CO-1-C / CO-1-D / CO-1-HOLD
  SV-1-B / SV-1-C
  ACCEPT-WITH-DELTA / HOLD / REJECT
```

### Accepted transport

```text
SharePoint REST List Items API
host = SPFx SPHttpClient when available
```

### Accepted dependency posture

```text
No runtime dependency install authorized by this Acceptance.
```

### Accepted clear / omit mechanics

| Case | Accepted mechanic |
|---|---|
| Create + logical absence | omit `supersedesSnapshotId` from request body preferred |
| Create / Update + valid non-empty string | send exact string without trim |
| Update + logical absence / clear existing value | send `"supersedesSnapshotId": null` |
| Update + omit | leave existing persisted value unchanged；MUST NOT represent logical absence when clearing is required |
| Empty string | FAIL-CLOSED / no transport |
| Whitespace-only | FAIL-CLOSED / no transport |
| Logical null | FAIL-CLOSED / no transport |

### Accepted verification

```text
SV-1-A synthetic/local verification accepted.
No live tenant write required for this Decision.
```

### Entry Criteria / P2 disposition after this Acceptance

| Item | Status |
|---|---|
| EC-3 | **MET** |
| EC-4 | **MET** |
| P2-002 | **CLOSED** |
| Implementation Start | **HOLD** |

失敗時 MUST NOT（LOCKED）:

```text
empty string → successful absence / clear
whitespace-only → successful absence / clear
logical null → successful transport
update omit → clear existing value
treating this Acceptance as Implementation Start
treating this Acceptance as runtime dependency install GO
treating this Acceptance as Deploy / real data GO
Agent による SharePoint / M365 / Entra mutation を許可する
Accepted set の再解釈・拡張
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-ADAPTER-EC3-EC4-1 Accepted = Implementation Start
  Decision-AS-ADAPTER-EC3-EC4-1 Accepted = adapter / DTO / schema wiring GO
  Decision-AS-ADAPTER-EC3-EC4-1 Accepted = runtime dependency install GO
  Decision-AS-ADAPTER-EC3-EC4-1 Accepted = Deploy / real data GO
  Decision-AS-ADAPTER-EC3-EC4-1 Accepted = live tenant write authorization
  Decision-AS-ADAPTER-EC3-EC4-1 Accepted = EC-5..EC-8 waived
```

## Acceptance boundary

```text
This Acceptance locks EC-3 + EC-4 / P2-002 clear-omit only.

MUST NOT start from this Acceptance alone:
  TypeScript / application / persistence port / adapter / DTO code
  npm install / runtime dependency addition
  SharePoint / M365 / Entra mutation
  Implementation Start
  Deploy / real data
  GitHub Issue mutation
  Ready / Merge without separate Human authorization
```

## Next

```text
Decision-AS-ADAPTER-EC3-EC4-1: Accepted / LOCKED
  / TC-1-A + DP-1-A + CO-1-A + SV-1-A + XB-1
EC-3: MET
EC-4: MET
P2-002: CLOSED
Implementation Start: HOLD
adapter / schema / DTO wiring: HOLD
runtime dependency addition: NOT AUTHORIZED
SharePoint / M365 mutation: FORBIDDEN
Deploy / real data: NO-GO

Next gate: AIS-1-B Implementation Start gate
  （EC-5..EC-8 preserved；separate Human GO required）
Ready: NOT RUN by this Acceptance
Merge: NOT RUN by this Acceptance
```
