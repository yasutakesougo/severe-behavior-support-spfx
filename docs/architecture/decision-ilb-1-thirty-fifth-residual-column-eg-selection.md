# Decision-ILB-1 — Thirty-fifth residual selection

この文書は、Decision-AS-COLUMN-PX-1 Accepted（PX-1+XB-1+AP-1；EG-HOLD）後の
次 substantive unit を固定する Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_THIRTY_FIFTH_RESIDUAL_SELECTION
Status: SELECTED / CONSUMED
Selected unit: EG-1 Explicit Column Creation Execution GO path
Follow-up Decision / Packet ID: Decision-AS-COLUMN-EG-1
  packet: decision-assessment-snapshot-column-eg-packet.md
  judgment: decision-assessment-snapshot-column-eg-judgment.md
  acceptance: decision-assessment-snapshot-column-eg-acceptance.md
  IR: decision-assessment-snapshot-column-eg-independent-review.md
  Status: Accepted / LOCKED / EG-1 + XB-1 + AP-1
  Execution GO: GIVEN（Human process only）
  EG-1 Acceptance ≠ Human create

Locked basis（再 Decision しない）:
  Decision-AS-COLUMN-PX-1 = Accepted / LOCKED / PX-1 + XB-1 + AP-1
  Decision-AS-CHOICE-OPTIONS-1 = Accepted / LOCKED / CO-1 + CV-CHOICE-BOTH + XB-1
  Decision-AS-COLUMN-NAMES-1 = Accepted / LOCKED / NM-1 + CV-REQ + XB-1
  Decision-AS-COLUMN-PROVISION-1 = Accepted / LOCKED / SC-AS + VR-1 + FG-1

Current state after CONSUMED:
  Explicit Execution GO = GIVEN（Human process only）
  Human create = AUTHORIZED / NOT STARTED by Acceptance
  Agent mutation = FORBIDDEN
  Implementation Start = HOLD
  INTENDED ≠ CONFIRMED
```

## Selection meaning

この Selection は、COLUMN-PROVISION-1 / COLUMN-PX-1 後に残る
**EG-HOLD** を進めるための **EG-1 Explicit Column Creation Execution GO path**
だけを次 unit として選ぶ。

```text
SELECTED / CONSUMED:
  Decision-AS-COLUMN-EG-1
  acceptance: decision-assessment-snapshot-column-eg-acceptance.md
  Status: Accepted / LOCKED
  Human Decision: EG-1 + XB-1 + AP-1

Still NOT authorized / FORBIDDEN now:
  Agent tenant mutation / Agent column create
  treating Acceptance as Human create completed
  treating INTENDED as CONFIRMED
  Implementation Start
  adapter / schema mapping code start
  Deploy / real data
```

Selection CONSUMED ≠ Human create completed ≠ CONFIRMED。

## Options considered（selection-time）

| ID | unit | 結果 |
|---|---|---|
| **A** | EG-1 Explicit Execution GO path | **SELECTED** |
| B | EG-HOLD continue / no GO | NOT SELECTED |
| C | EG-2 Agent/docs-only create start | NOT SELECTED（NOT SELECTABLE） |
| D | CV extension（MAP-AS-009/010 / ENV） | NOT SELECTED as current |
| E | Issue Status Reconciliation only | NOT SELECTED as current（independent） |
| F | HOLD / no selection | NOT SELECTED |

## Next

```text
Thirty-fifth residual: CONSUMED
Decision-AS-COLUMN-EG-1: Accepted / LOCKED / EG-1 + XB-1 + AP-1
Execution GO: GIVEN（Human process only）
Human create: separate next Human process
Next substantive residual: NOT SELECTED
Candidates（separate units）:
  Human create execution record / evidence
  VR-1 CN-1 re-observation after create
  CV extension / Issue Status Reconciliation
```
