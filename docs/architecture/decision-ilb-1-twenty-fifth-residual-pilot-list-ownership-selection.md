# Decision-ILB-1 — Twenty-fifth residual selection

この文書は、Decision-AS-PILOT-FACILITY-IDENTITY-1 Accepted / LOCKED 後の
次 substantive unit を固定する Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_TWENTY_FIFTH_RESIDUAL_SELECTION
Status: SELECTED / CONSUMED
  （Decision-AS-PILOT-LIST-OWNERSHIP-1 Accepted / LOCKED）
Selected unit: Pilot List ownership / 正本責務
Follow-up Decision ID: Decision-AS-PILOT-LIST-OWNERSHIP-1

Ownership check（read-only）:
  decision-assessment-snapshot-pilot-list-ownership-check.md
  Status: CONSUMED（ownership Accepted）

Locked basis（再 Decision しない）:
  Decision-AS-PILOT-FACILITY-IDENTITY-1 = Accepted / LOCKED
    / PO-1 + FK-1 + SN-1 + LN-D + XB-1
  Decision-AS-ORG-SITE-TOPOLOGY-1 = Accepted / LOCKED
  Decision-AS-NEW-TARGET-NAMES-1 = 2 List slots PLACEHOLDER
  Decision-AS-SP-PLACEMENT-1 = SV-1 + LV-1 + CN-1 + SC-1
  LV-3 SupportPlan List 同一視 = NOT SELECTED

Ownership:
  Accepted / LOCKED / LO-1 + VP-1 + EX-1 + NB-1 + XB-1

Current state:
  Site identity = LOCKED（isogo / honmoku）
  List ownership pairing = Accepted / LOCKED
  List names = DEFERRED
  Site / List creation = NO-GO
```

## Selection meaning

この Selection は、**2つの facility List slot がそれぞれ何の正本か**だけを
次 Human Decision として選ぶ。

```text
SELECTED / CONSUMED:
  Decision-AS-PILOT-LIST-OWNERSHIP-1
  Human Decision: LO-1 + VP-1 + EX-1 + NB-1 + XB-1
  Human Accept phrase:
    「LO-1 + VP-1 + EX-1 + NB-1 + XB-1 でいく」

Closed:
  List A = SupportPlan 正本（Version 同居）
  List B = AssessmentSnapshot 正本
  AuditEvent / DailyActivityRecords exclusion
  naming / creation boundaries

Still OPEN / NOT AUTHORIZED:
  concrete List names
  Site / List creation
  Implementation Start
  SharePoint / adapter / application implementation
  Schema / DTO code assignment
  Deploy / real data
```

Selection ≠ Acceptance ≠ List naming ≠ Site/List creation.

## Options considered（selection-time）

| ID | unit | 結果 |
|---|---|---|
| **A** | Pilot List ownership / 正本責務（Decision-AS-PILOT-LIST-OWNERSHIP-1） | **SELECTED** |
| B | Pilot List names（skip ownership） | NOT SELECTED |
| C | Site / List creation | NOT SELECTED（NO-GO） |
| D | HOLD | NOT SELECTED |

## Next

```text
Selection CONSUMED → Decision-AS-PILOT-LIST-OWNERSHIP-1 Accepted / LOCKED
  decision-assessment-snapshot-pilot-list-ownership-acceptance.md
  List ownership pairing:       LO-1
  SupportPlanVersion placement: VP-1
  Exclusion boundary:           EX-1
  Naming boundary:              NB-1
  Execution boundary:           XB-1

LOCKED ownership:
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
