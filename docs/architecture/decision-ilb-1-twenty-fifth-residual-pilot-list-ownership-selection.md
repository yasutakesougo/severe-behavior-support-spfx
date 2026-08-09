# Decision-ILB-1 — Twenty-fifth residual selection

この文書は、Decision-AS-PILOT-FACILITY-IDENTITY-1 Accepted / LOCKED 後の
次 substantive unit を固定する Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_TWENTY_FIFTH_RESIDUAL_SELECTION
Status: SELECTED / OPEN
  （Decision-AS-PILOT-LIST-OWNERSHIP-1 = OPEN / NOT ACCEPTED）
Selected unit: Pilot List ownership / 正本責務
Follow-up Decision ID: Decision-AS-PILOT-LIST-OWNERSHIP-1

Ownership check（read-only）:
  decision-assessment-snapshot-pilot-list-ownership-check.md
  Status: READY FOR HUMAN OWNERSHIP DECISION

Locked basis（再 Decision しない）:
  Decision-AS-PILOT-FACILITY-IDENTITY-1 = Accepted / LOCKED
    / PO-1 + FK-1 + SN-1 + LN-D + XB-1
  Decision-AS-ORG-SITE-TOPOLOGY-1 = Accepted / LOCKED
  Decision-AS-NEW-TARGET-NAMES-1 = 2 List slots PLACEHOLDER
  Decision-AS-SP-PLACEMENT-1 = SV-1 + LV-1 + CN-1 + SC-1
  LV-3 SupportPlan List 同一視 = NOT SELECTED

Current state:
  Site identity = LOCKED（isogo / honmoku）
  List ownership pairing = OPEN / NOT ACCEPTED
  List names = DEFERRED
  Site / List creation = NO-GO
```

## Selection meaning

この Selection は、**2つの facility List slot がそれぞれ何の正本か**だけを
次 Human Decision として選ぶ。

```text
SELECTED / OPEN:
  Decision-AS-PILOT-LIST-OWNERSHIP-1

In scope:
  List A / List B 正本責務 pairing
  SupportPlanVersion の同居可否（axis）
  ownership ≠ List name Acceptance ≠ creation GO

Out of scope:
  concrete List names（ownership LOCK 後）
  Site / List creation
  AuditEvent / DailyActivityRecords reassignment
  Implementation Start
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
Selection SELECTED / OPEN
  → decision-assessment-snapshot-pilot-list-ownership-packet.md
Decision-AS-PILOT-LIST-OWNERSHIP-1: OPEN / NOT ACCEPTED

Recommended candidate（NOT LOCKED）:
  LO-1 — List A = SupportPlan 正本 / List B = AssessmentSnapshot 正本

Until Human Accept:
  List names remain DEFERRED
  Site / List creation = NO-GO
```
