# Decision-ILB-1 — Thirty-fifth residual selection

この文書は、Decision-AS-COLUMN-PX-1 Accepted（PX-1+XB-1+AP-1；EG-HOLD）後の
次 substantive unit を固定する Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_THIRTY_FIFTH_RESIDUAL_SELECTION
Status: SELECTED / OPEN
Selected unit: EG-1 Explicit Column Creation Execution GO path
Follow-up Decision / Packet ID: Decision-AS-COLUMN-EG-1
  packet: decision-assessment-snapshot-column-eg-packet.md
  Status: OPEN / NOT ACCEPTED

Locked basis（再 Decision しない）:
  Decision-AS-COLUMN-PX-1 = Accepted / LOCKED / PX-1 + XB-1 + AP-1
  Decision-AS-CHOICE-OPTIONS-1 = Accepted / LOCKED / CO-1 + CV-CHOICE-BOTH + XB-1
  Decision-AS-COLUMN-NAMES-1 = Accepted / LOCKED / NM-1 + CV-REQ + XB-1
  Decision-AS-COLUMN-PROVISION-1 = Accepted / LOCKED
    / SC-AS + VR-1 + FG-1（EG 軸は本 residual で進める候補；現 EG-HOLD）

Current state:
  Column creation authorization = PX-1
  Explicit Execution GO = EG-HOLD / NOT GIVEN
  Column creation = FORBIDDEN until EG-1 + Human create
  Implementation Start = HOLD（XB-1）
  Agent mutation = FORBIDDEN（AP-1）
  INTENDED ≠ CONFIRMED
```

## Selection meaning

この Selection は、COLUMN-PROVISION-1 / COLUMN-PX-1 後に残る
**EG-HOLD** を進めるための **EG-1 Explicit Column Creation Execution GO path**
だけを次 unit として選ぶ。

```text
SELECTED / OPEN:
  Decision-AS-COLUMN-EG-1
  Question:
    PX-1 許可済みの Accepted INTENDED columns について、
    Human は Explicit Column Creation Execution GO（EG-1）を付与するか。

Facts that MUST remain visible:
  EG-1 requires PX-1（MET）
  EG-1 ≠ Agent may create（AP-1）
  EG-1 ≠ Implementation Start（XB-1）
  EG-1 GIVEN ≠ columns already CONFIRMED（VR-1 still required post-create）
  EG-2（docs/Agent Acceptance だけで作成開始）= NOT SELECTABLE

Still NOT authorized / FORBIDDEN now:
  treating packet OPEN as Execution GO
  Agent tenant mutation
  Implementation Start
  adapter / schema mapping code start
  Deploy / real data
  auto-starting Human create without Acceptance
```

```text
Packet purpose when OPEN:
  Human が EG-1（Explicit Execution GO）を採択するための比較材料
Agent: 候補整理のみ
EG-1 closes only after Human Acceptance
EG-1 Accepted ≠ Agent creates columns
  （Human process create；then VR-1 CN-1 re-observation）
```

Selection ≠ Acceptance of EG-1 ≠ Agent mutation ≠ Implementation Start。

## Options considered（selection-time）

| ID | unit | 結果 |
|---|---|---|
| **A** | EG-1 Explicit Execution GO path | **SELECTED** |
| B | EG-HOLD continue / no GO | NOT SELECTED as current selection（still candidate inside packet） |
| C | EG-2 Agent/docs-only create start | NOT SELECTED（NOT SELECTABLE） |
| D | CV extension（MAP-AS-009/010 / ENV） | NOT SELECTED as current |
| E | Issue Status Reconciliation only | NOT SELECTED as current（independent） |
| F | HOLD / no selection | NOT SELECTED |

## Next

```text
Thirty-fifth residual: SELECTED / OPEN
  → Decision-AS-COLUMN-EG-1 packet OPEN
  decision-assessment-snapshot-column-eg-packet.md
Awaiting: Human Decision（EG-1 or EG-HOLD continue）
Until Accepted as EG-1:
  SharePoint column creation = FORBIDDEN
  Execution GO = NOT GIVEN
  Implementation Start = HOLD
  Agent mutation = FORBIDDEN
Even if EG-1 Accepted later:
  Agent mutation remains FORBIDDEN（AP-1）
  Implementation / adapter remain HOLD（XB-1）unless separately changed
  CONFIRMED still requires Human create + VR-1
```
