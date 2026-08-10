# Decision-ILB-1 — Thirty-fourth residual selection

この文書は、Decision-AS-CHOICE-OPTIONS-1 Accepted（CO-1+CV-CHOICE-BOTH+XB-1）後の
次 substantive unit を固定する Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_THIRTY_FOURTH_RESIDUAL_SELECTION
Status: SELECTED / OPEN
Selected unit: PX-1 column creation authorization path
Follow-up Decision / Packet ID: Decision-AS-COLUMN-PX-1
  packet: decision-assessment-snapshot-column-px-packet.md
  Status: OPEN / NOT ACCEPTED

Locked basis（再 Decision しない）:
  Decision-AS-CHOICE-OPTIONS-1 = Accepted / LOCKED / CO-1 + CV-CHOICE-BOTH + XB-1
  Decision-AS-COLUMN-NAMES-1 = Accepted / LOCKED / NM-1 + CV-REQ + XB-1
  Decision-AS-COLUMN-PROVISION-1 = Accepted / LOCKED
    / SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + XB-1 + AP-1
    （本 residual は PX 軸のみを進める候補；EG-HOLD は別）

Current state:
  CV-REQ intended names = ADOPTED / INTENDED
  Choice options（recordStatus / result）= ADOPTED / INTENDED
  Column creation authorization = PX-HOLD
  Explicit Execution GO = EG-HOLD / NOT GIVEN
  Column creation = FORBIDDEN
  Implementation Start = HOLD
  Agent mutation = FORBIDDEN
```

## Selection meaning

この Selection は、COLUMN-PROVISION-1 の **PX-HOLD** を進めるための
**PX-1 column creation authorization path** だけを次 unit として選ぶ。

```text
SELECTED / OPEN:
  Decision-AS-COLUMN-PX-1
  Question:
    Accepted INTENDED columns（CV-REQ + Choice options）について、
    Human は column creation authorization（PX-1）を付与するか。

Facts that MUST remain visible:
  PX-1 ≠ Execution GO（EG-1 は別 unit）
  PX-1 ≠ Agent may create（AP-1）
  PX-1 ≠ Implementation Start（XB-1）
  INTENDED ≠ CONFIRMED（VR-1 still required post-create）
  EG-HOLD remains unless separately selected later

Still NOT authorized / FORBIDDEN now:
  SharePoint column create / rename / delete
  treating packet OPEN as Execution GO
  Agent tenant mutation
  Implementation Start
  adapter / schema mapping code start
  Deploy / real data
  EG-1 auto-start
```

```text
Packet purpose when OPEN:
  Human が PX-1（作成許可）を採択するための比較材料
Agent: 候補整理のみ
PX-1 closes only after Human Acceptance
PX-1 Accepted alone ≠ columns created
```

Selection ≠ Acceptance of PX-1 ≠ Execution GO ≠ column creation。

## Options considered（selection-time）

| ID | unit | 結果 |
|---|---|---|
| **A** | PX-1 authorization path | **SELECTED** |
| B | EG-1 Execution GO（without / before PX-1） | NOT SELECTED（EG-1 requires PX-1） |
| C | PX-1 + EG-1 combined in one unit | NOT SELECTED（分離維持） |
| D | CV extension（MAP-AS-009/010 / ENV） | NOT SELECTED as current |
| E | Issue Status Reconciliation only | NOT SELECTED as current（independent） |
| F | HOLD / no selection | NOT SELECTED |

## Next

```text
Thirty-fourth residual: SELECTED / OPEN
  → Decision-AS-COLUMN-PX-1 packet OPEN
  decision-assessment-snapshot-column-px-packet.md
Awaiting: Human Decision（PX-1 or PX-HOLD continue）
Until Accepted as PX-1:
  SharePoint column creation = FORBIDDEN
  Execution GO = NOT GIVEN
  Implementation Start = HOLD
Even if PX-1 Accepted later:
  EG-HOLD remains until separate EG residual
  Agent mutation remains FORBIDDEN（AP-1）
```
