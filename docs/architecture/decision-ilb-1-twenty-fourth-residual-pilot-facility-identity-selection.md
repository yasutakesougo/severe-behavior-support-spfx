# Decision-ILB-1 — Twenty-fourth residual selection

この文書は、Decision-AS-ORG-SITE-TOPOLOGY-1 Accepted / LOCKED 後の
次 substantive unit を固定する Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_TWENTY_FOURTH_RESIDUAL_SELECTION
Status: SELECTED / CONSUMED
  （Decision-AS-PILOT-FACILITY-IDENTITY-1 Accepted / LOCKED）
Selected unit: Formal pilot facility identity / Site naming
Follow-up Decision ID: Decision-AS-PILOT-FACILITY-IDENTITY-1

Locked basis（再 Decision しない）:
  Decision-AS-TARGET-REUSE-1 = Accepted / LOCKED / B
  Decision-AS-NEW-TARGET-PROVISION-1 = Accepted / LOCKED / ST-1 + LT-1 + NM-1 + EX-1
  Decision-AS-NEW-TARGET-NAMES-1 = Accepted / LOCKED / SU-1 + LN-1 + IN-1 + XB-1
  Decision-AS-ORG-SITE-TOPOLOGY-1 = Accepted / LOCKED / OT-1 + FS-1 + SP-1 + PP-1 + PH-1 + XB-1
  Placeholder XXXXX / YYYYY = INTENDED / PLACEHOLDER / NOT CREATABLE

Identity / Site naming:
  Accepted / LOCKED / PO-1 + FK-1 + SN-1 + LN-D + XB-1

Current state:
  Org site topology = LOCKED
  Pilot facility identity / Site naming = Accepted / LOCKED
  List names = DEFERRED（本 Decision 対象外）
  Site / List creation = NO-GO
  Placeholder creation = FORBIDDEN
  Implementation Start = HOLD
```

## Selection meaning

この Selection は、**パイロット事業所の順序・facilityKey・Site display name / URL**
だけを次 Human Decision として選ぶ。

```text
SELECTED / CONSUMED:
  Decision-AS-PILOT-FACILITY-IDENTITY-1
  Human Decision: PO-1 + FK-1 + SN-1 + LN-D + XB-1
  Human Accept phrase:
    「磯子=isogo / 本牧=honmoku、この Site 名・URL でいく」

Closed:
  Pilot facility order
  facilityKey（isogo / honmoku）
  Site display name / URL
  naming ≠ creation GO
  List names deferred（LN-D）

Still OPEN / NOT AUTHORIZED:
  List names
  Site / List creation
  treating INTENDED as OBSERVED / CONFIRMED / CREATED
  Implementation Start
  SharePoint / adapter / application implementation
  Schema / DTO code assignment
  Deploy / real data
  FindingCode / A-5
  post-retention deletion
```

Selection ≠ Acceptance ≠ Site/List creation.

## Options considered（selection-time）

| ID | unit | 結果 |
|---|---|---|
| **A** | Formal pilot facility identity / Site naming（Decision-AS-PILOT-FACILITY-IDENTITY-1） | **SELECTED** |
| B | List names for pilot Sites | NOT SELECTED（DEFERRED） |
| C | Site / List creation execution | NOT SELECTED（NO-GO） |
| D | HOLD（まだ決めない） | NOT SELECTED |

## Next

```text
Selection CONSUMED → Decision-AS-PILOT-FACILITY-IDENTITY-1 Accepted / LOCKED
  decision-assessment-snapshot-pilot-facility-identity-acceptance.md
  Pilot facility order:  PO-1
  facilityKey:           FK-1
  Site naming:           SN-1
  List names:            LN-D
  Execution boundary:    XB-1

LOCKED payload:
  磯子=isogo → /sites/severe-support-isogo
  本牧=honmoku → /sites/severe-support-honmoku

Decision-AS-PILOT-LIST-OWNERSHIP-1: Accepted / LOCKED / LO-1 + VP-1 + EX-1 + NB-1 + XB-1
  List A = SupportPlan + SupportPlanVersion
  List B = AssessmentSnapshot
Decision-AS-PILOT-LIST-NAMES-1: Accepted / LOCKED / LN-1 + XB-1
  SupportPlans / AssessmentSnapshots
Decision-AS-PILOT-PROVISION-EXEC-1: Accepted / LOCKED / PX-1 + VR-1 + FG-1 + XB-1 + EG-1 + AP-1
Execution GO: GIVEN
AI SharePoint mutation: FORBIDDEN
SV-1: CONFIRMED / LV-1: CONFIRMED / VR-1: PASS
CN-1: OPEN
Independent Review #187: PASS（P0=0 / P1=0 / P2=0）
  → decision-assessment-snapshot-pr-187-independent-review.md
Next gate: FIXED
  Ready gate（Human）
  → decision-assessment-snapshot-pilot-provision-exec-next-gate.md
  evidence: decision-assessment-snapshot-pilot-provision-vr1-evidence.md

Still HOLD / NO-GO for Agent / AI procedure:
  SharePoint tenant mutation by Agent
  Placeholder creation
  Implementation Start
```
