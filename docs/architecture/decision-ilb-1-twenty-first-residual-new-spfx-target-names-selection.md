# Decision-ILB-1 — Twenty-first residual selection

この文書は、Decision-AS-NEW-TARGET-PROVISION-1 Accepted / LOCKED / ST-1+LT-1+NM-1+EX-1 後の
次 substantive unit を固定する Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_TWENTY_FIRST_RESIDUAL_SELECTION
Status: SELECTED
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

Current state:
  New SPFx deployment target = TOPOLOGY LOCKED / NOT CREATED / HOLD
  Concrete Site URL / Site name = OPEN / NOT SELECTED
  Concrete List names = OPEN / NOT SELECTED
  Internal Column Names = OPEN / NOT SELECTED
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
SELECTED:
  Decision-AS-NEW-TARGET-NAMES-1

Closes only when later Accepted:
  concrete Site URL / Site name（Human 明示）
  concrete List name(s)（Human 明示）
  Internal Name 方針（発明禁止 or 作成後 CN-1 等）
  naming Acceptance ≠ creation GO の再確認

NOT SELECTED / NOT AUTHORIZED by this selection:
  Agent による具体 Site URL / List name / Internal Name 発明
  Site creation
  List / column creation
  tenant / Entra / M365 mutation
  Implementation Start
  SharePoint / adapter / application implementation
  Schema / DTO code assignment
  Deploy / real data
  FindingCode / A-5
  post-retention deletion
  Decision-AS-NEW-TARGET-PROVISION-1 再 Decision
```

Selection ≠ Acceptance ≠ Site/List creation.
（NM-1 が要求した concrete naming Decision を開くだけ。EX-1 の作成 gate は別）

## Options considered（selection-time）

| ID | unit | 結果 |
|---|---|---|
| **A** | New SPFx Site / List concrete naming / value（Decision-AS-NEW-TARGET-NAMES-1） | **SELECTED** |
| B | Site / List creation / provisioning execution | NOT SELECTED（別 Human gate / NO-GO 維持） |
| C | post-retention deletion | NOT SELECTED（OPEN / AUTO-START FORBIDDEN 維持） |
| D | HOLD（まだ決めない） | NOT SELECTED |

## Next

```text
Selection SELECTED → open Decision-AS-NEW-TARGET-NAMES-1 compare packet
  decision-assessment-snapshot-new-target-names-packet.md
  Status: OPEN / NOT ACCEPTED

Until Human Acceptance:
  Concrete Site URL / Site name = OPEN / NOT SELECTED
  Concrete List names = OPEN / NOT SELECTED
  Internal Column Names = OPEN / NOT SELECTED
  Site / List creation = NO-GO
  tenant mutation = NO-GO
  Implementation Start = HOLD
  SharePoint implementation = DO NOT START
  Schema / DTO code = HOLD
  FindingCode / A-5 = HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```
