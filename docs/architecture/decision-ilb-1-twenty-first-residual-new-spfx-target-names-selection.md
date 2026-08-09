# Decision-ILB-1 — Twenty-first residual selection

この文書は、Decision-AS-NEW-TARGET-PROVISION-1 Accepted / LOCKED / ST-1+LT-1+NM-1+EX-1 後の
次 substantive unit を固定する Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_TWENTY_FIRST_RESIDUAL_SELECTION
Status: SELECTED / CONSUMED（Decision-AS-NEW-TARGET-NAMES-1 Accepted / LOCKED on axes；values OPEN）
Selected unit: New SPFx Site / List concrete naming / value Decision
Follow-up Decision ID: Decision-AS-NEW-TARGET-NAMES-1

Baseline（PR #184 MERGED）:
  expected head: 84745355929c7e43dcc6c89dd00d29935f79034c
  merge commit:  0be50a12e3699d187bce0f27caa732f3e7ccea24
  status: MERGED

Locked basis:
  Decision-AS-TARGET-REUSE-1 = Accepted / LOCKED / B
  Decision-AS-NEW-TARGET-PROVISION-1 = Accepted / LOCKED / ST-1 + LT-1 + NM-1 + EX-1
  Existing /sites/welfare + DailyActivityRecords = REFERENCE ONLY
  Reuse existing /sites/welfare = NOT ADOPTED
  New SPFx topology = dedicated new Site + dedicated new Lists

Naming axes:
  Accepted / LOCKED / SU-1 + LN-1 + IN-1 + XB-1

Current state:
  New SPFx deployment target = TOPOLOGY LOCKED / NOT CREATED / HOLD
  Naming axes = LOCKED（SU-1 + LN-1 + IN-1 + XB-1）
  Concrete Site URL / Site name = OPEN / NOT SELECTED（SU-1 payload pending）
  Concrete List names = OPEN / NOT SELECTED（LN-1 payload pending）
  Internal Column Names = OPEN（IN-1 — post-creation CN-1）
  Site / List / column creation = NO-GO
  tenant mutation = NO-GO
  Implementation Start = HOLD
  SharePoint implementation = DO NOT START
  Schema / DTO code = HOLD / NOT STARTED
  Deploy / real data = NO-GO
```

## Selection meaning

この Selection は、**新 SPFx 用 Site / List の concrete naming / value** だけを
次 Human Decision として選ぶ。

```text
SELECTED / CONSUMED:
  Decision-AS-NEW-TARGET-NAMES-1
  Human Decision: SU-1 + LN-1 + IN-1 + XB-1

Axes closed:
  SU-1 — Human 明示で Site URL / Site name を採択
  LN-1 — Human 明示で List name(s) を採択
  IN-1 — Internal Names は本 Decision で固定しない（作成後 CN-1）
  XB-1 — naming ≠ creation GO

Still OPEN / NOT AUTHORIZED:
  concrete Site URL / Site name / List name(s) 文字列
  Internal Column Names CONFIRMED
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

Selection ≠ Acceptance ≠ Site/List creation.
（axes Acceptance 後も SU-1/LN-1 文字列と XB-1 作成 gate は別）

## Options considered（selection-time）

| ID | unit | 結果 |
|---|---|---|
| **A** | New SPFx Site / List concrete naming / value（Decision-AS-NEW-TARGET-NAMES-1） | **SELECTED** |
| B | Site / List creation / provisioning execution | NOT SELECTED（別 Human gate / NO-GO 維持） |
| C | post-retention deletion | NOT SELECTED（OPEN / AUTO-START FORBIDDEN 維持） |
| D | HOLD（まだ決めない） | NOT SELECTED |

## Next

```text
Selection CONSUMED → Decision-AS-NEW-TARGET-NAMES-1 Accepted / LOCKED（axes）
  decision-assessment-snapshot-new-target-names-acceptance.md
  Site URL / Site name mode:  SU-1
  List names mode:            LN-1
  Internal Column Names:      IN-1
  Execution boundary:         XB-1

Still OPEN / HOLD / NO-GO:
  Concrete Site URL / Site name / List name(s)（SU-1 / LN-1 payload）
  Internal Column Names（IN-1）
  Site / List creation
  Implementation Start
  SharePoint / adapter / application code
  tenant mutation
  Schema / DTO code assignment
  FindingCode / A-5
Post-retention deletion: OPEN / AUTO-START FORBIDDEN

Next Human fill:
  SU-1 / LN-1 concrete strings
Creation / provisioning execution: NOT SELECTED（別 Human gate）
```
