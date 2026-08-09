# Decision-ILB-1 — Twentieth residual selection

この文書は、Decision-AS-TARGET-REUSE-1 Accepted / LOCKED / B 後の次 substantive unit を固定する Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_TWENTIETH_RESIDUAL_SELECTION
Status: SELECTED
Selected unit: New SPFx target provisioning policy
Follow-up Decision ID: Decision-AS-NEW-TARGET-PROVISION-1

Locked basis:
  Decision-AS-TARGET-REUSE-1 = Accepted / LOCKED / B
  Existing /sites/welfare + DailyActivityRecords = REFERENCE ONLY
  Reuse existing /sites/welfare = NOT ADOPTED

Current state:
  New SPFx deployment target = NOT SELECTED / NOT CREATED / HOLD
  Site / List creation = NO-GO
  tenant mutation = NO-GO
  Implementation Start = HOLD
  SharePoint implementation = DO NOT START
  Schema / DTO code = HOLD / NOT STARTED
  Deploy / real data = NO-GO
```

## Selection meaning

この Selection は、**新 SPFx 用 Site / List をどの provisioning topology で用意するか**だけを次 Human Decision として選ぶ。

```text
SELECTED:
  Decision-AS-NEW-TARGET-PROVISION-1

NOT SELECTED / NOT AUTHORIZED:
  concrete Site URL / site name invention
  concrete List name invention
  Site creation
  List / column creation
  tenant / Entra / M365 mutation
  Implementation Start
  SharePoint / adapter / application implementation
  Schema / DTO code assignment
  Deploy / real data
  FindingCode / A-5
  post-retention deletion
```

Selection ≠ Acceptance ≠ provisioning execution.
