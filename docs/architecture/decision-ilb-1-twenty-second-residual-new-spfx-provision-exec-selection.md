# Decision-ILB-1 — twenty-second residual selection

この文書は、Decision-AS-NEW-TARGET-NAMES-1 Accepted / LOCKED 後の
次 substantive unit を固定する Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_TWENTY_SECOND_RESIDUAL_SELECTION
Status: SELECTED / CONSUMED（Decision-AS-NEW-TARGET-PROVISION-EXEC-1 Accepted / LOCKED）
Selected unit: New SPFx Site / List provisioning execution authorization
Follow-up Decision ID: Decision-AS-NEW-TARGET-PROVISION-EXEC-1

Baseline（PR #185 MERGED）:
  merge commit: 1aef0d3971165f6504f7f13d6e68a51d7cfdaf61
  status: MERGED

Locked basis:
  Decision-AS-TARGET-REUSE-1 = Accepted / LOCKED / B
  Decision-AS-NEW-TARGET-PROVISION-1 = Accepted / LOCKED / ST-1 + LT-1 + NM-1 + EX-1
  Decision-AS-NEW-TARGET-NAMES-1 = Accepted / LOCKED / SU-1 + LN-1 + IN-1 + XB-1
  intended Site/List strings = HUMAN-PROVIDED / INTENDED
  Internal Column Names = OPEN / post-creation CN-1

Provisioning execution authorization:
  Accepted / LOCKED / PX-1 + VR-1 + FG-1 + XB-1

Current state:
  Site / List creation = AUTHORIZED / NOT STARTED
  tenant mutation（Site+List only）= AUTHORIZED / NOT STARTED
  SV-1 / LV-1 = NOT CONFIRMED
  Internal Column Names = OPEN（IN-1）
  custom column creation = NO-GO
  Implementation Start = HOLD
  SharePoint implementation = DO NOT START
  Deploy / real data = NO-GO
```

## Selection meaning

この Selection は、**新 SPFx 用 Site / List の実作成 authorization** だけを
次 Human Decision として選ぶ。

```text
SELECTED / CONSUMED:
  Decision-AS-NEW-TARGET-PROVISION-EXEC-1
  Human Decision: PX-1 + VR-1 + FG-1 + XB-1

Closes:
  PX-1 — intended Site + Lists creation authorization（Site/List only）
  VR-1 — post-creation read-back required for SV-1 / LV-1
  FG-1 — fail-closed on conflict / partial failure / ambiguity
  XB-1 — scope = Site + Lists only

Still OPEN / NOT AUTHORIZED / NOT COMPLETED:
  actual Site / List creation completion
  SV-1 / LV-1 CONFIRMED
  Internal Column Names / CN-1
  custom column creation
  permissions / config changes
  Implementation Start
  SharePoint / adapter / application implementation
  Schema / DTO code assignment
  Deploy / real data
  FindingCode / A-5
  post-retention deletion
```

Selection ≠ Acceptance ≠ execution completed.

## Next

```text
Selection CONSUMED → Decision-AS-NEW-TARGET-PROVISION-EXEC-1 Accepted / LOCKED
  decision-assessment-snapshot-new-target-provision-exec-acceptance.md
  Provisioning execution:  PX-1
  Verification boundary:   VR-1
  Failure boundary:        FG-1
  Scope boundary:          XB-1

Site / List creation: AUTHORIZED / NOT STARTED
  → next: explicit execution step + VR-1 read-back
SV-1 / LV-1: NOT CONFIRMED
Internal Column Names: OPEN（IN-1）
custom columns / Implementation Start: NO-GO / HOLD
```
