# Decision-AS-ADAPTER-EC3-EC4-1 — Selection

この文書は、Decision-AS-ADAPTER-START-1（AIS-1-B）Accepted / LOCKED 後の
次 substantive residual として **EC-3 + EC-4 Decision** を選ぶ Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-EC3-EC4-1
Selection status: SELECTED / OPEN FOR HUMAN DECISION
Baseline main: 5bbe912d0e5e127cf1846bb0edf5ddff24ca99a0
Human Selection of unit: 2026-08-10（this packet prep）
Human Acceptance of EC-3 / EC-4 options: NOT YET

Selected unit:
  AIS-1-B Entry Criteria residual — EC-3 + EC-4

Packet:
  decision-assessment-snapshot-adapter-ec3-ec4-packet.md
EC-3 comparison:
  decision-assessment-snapshot-adapter-ec3-transport-comparison.md
EC-4 comparison:
  decision-assessment-snapshot-adapter-ec4-clear-omit-comparison.md
IR:
  decision-assessment-snapshot-adapter-ec3-ec4-independent-review.md

Authority（再 Decision しない）:
  Decision-AS-ADAPTER-START-1 = ACCEPTED / LOCKED as AIS-1-B
  Decision-AS-SP-ADAPTER-1 = ACCEPTED / LOCKED / PB-1 + EM-1 + CV-1 + D6-1 + UP-1
  Decision-AS-MAP010-COLUMN-1 = ACCEPTED / LOCKED
    / N-1-A + N-2-A + T-1-A + O-1-A + R-1-A + W-1-A + XB-1

EC-1: MET
EC-2: MET
EC-3: NOT YET（this Decision required）
EC-4: NOT YET（this Decision required）
Implementation Start: HOLD
P2-002: OPEN / CARRY-FORWARD
adapter / DTO / schema wiring: HOLD
Deploy / real data: NO-GO
SharePoint / M365 mutation by Agent: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Locked basis

```text
mapping-complete = PASS / COMPLETE
MAP-AS-001〜008 = PERSISTED / OBSERVED / CONFIRMED + conversion ACCEPTED / LOCKED
MAP-AS-009 = EXPLICITLY OUT
MAP-AS-010 = PERSISTED / PRESENT / OBSERVED / CONFIRMED / column-ready YES
ENV-001〜003 = DERIVED
AIS-1-B Entry Criteria EC-3 / EC-4 = NOT YET
package.json runtime SharePoint client dependency = NONE
SPFx scaffold / @microsoft/sp-* packages = NOT PRESENT
```

## Selection meaning

```text
SELECTED:
  Prepare EC-3 adapter client / transport comparison + recommendation
  Prepare EC-4 P2-002 clear / omit mechanics comparison + recommendation
  Package as Human Decision packet
  Stop at Human Decision

This Selection does NOT:
  mark EC-3 / EC-4 MET
  close P2-002
  Accept TC-* / CO-* options
  authorize Implementation Start
  authorize runtime dependency installation
  authorize SharePoint / M365 mutation
  authorize Deploy / real data
```

## Options considered for unit selection

| ID | unit | 結果 |
|---|---|---|
| **A** | EC-3 + EC-4 Decision packet（docs-only） | **SELECTED** |
| B | Immediate adapter Implementation Start without EC-3/EC-4 | NOT SELECTABLE（AIS-1-B） |
| C | Add PnP / SPHttpClient runtime dependency now | NOT SELECTABLE（this unit forbids install） |
| HOLD | leave AIS-1-B residual unselected | NOT SELECTED |

## Explicit OUT

```text
adapter / DTO / schema code mutation
runtime dependency addition / npm install
SharePoint / M365 / Entra mutation
Deploy / real data
marking EC-3 / EC-4 MET from Agent recommendation alone
closing P2-002 without Human Acceptance
Ready / Merge auto-run
```

## Next

```text
Selection: SELECTED / OPEN FOR HUMAN DECISION
Next: Human Decision on Decision-AS-ADAPTER-EC3-EC4-1 packet
Until Human Acceptance:
  EC-3 = NOT YET
  EC-4 = NOT YET
  P2-002 = OPEN / CARRY-FORWARD
  Implementation Start = HOLD
```
