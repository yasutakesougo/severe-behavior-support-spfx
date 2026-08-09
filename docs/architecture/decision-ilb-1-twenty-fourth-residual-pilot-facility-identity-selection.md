# Decision-ILB-1 — Twenty-fourth residual selection

この文書は、Decision-AS-ORG-SITE-TOPOLOGY-1 Accepted / LOCKED 後の
次 substantive unit を固定する Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_TWENTY_FOURTH_RESIDUAL_SELECTION
Status: SELECTED / OPEN
  （Decision-AS-PILOT-FACILITY-IDENTITY-1 = OPEN / NOT ACCEPTED）
Selected unit: Formal pilot facility identity / Site naming
Follow-up Decision ID: Decision-AS-PILOT-FACILITY-IDENTITY-1

Locked basis（再 Decision しない）:
  Decision-AS-TARGET-REUSE-1 = Accepted / LOCKED / B
  Decision-AS-NEW-TARGET-PROVISION-1 = Accepted / LOCKED / ST-1 + LT-1 + NM-1 + EX-1
  Decision-AS-NEW-TARGET-NAMES-1 = Accepted / LOCKED / SU-1 + LN-1 + IN-1 + XB-1
  Decision-AS-ORG-SITE-TOPOLOGY-1 = Accepted / LOCKED / OT-1 + FS-1 + SP-1 + PP-1 + PH-1 + XB-1
  Placeholder XXXXX / YYYYY = INTENDED / PLACEHOLDER / NOT CREATABLE

Current state:
  Org site topology = LOCKED
  Pilot facility identity / Site naming = OPEN / NOT ACCEPTED
  List names = DEFERRED（本 Decision 対象外）
  Site / List creation = NO-GO
  Placeholder creation = FORBIDDEN
  Implementation Start = HOLD
```

## Selection meaning

この Selection は、**パイロット事業所の順序・facilityKey・Site display name / URL**
だけを次 Human Decision として選ぶ。

```text
SELECTED / OPEN:
  Decision-AS-PILOT-FACILITY-IDENTITY-1
  Status: OPEN / NOT ACCEPTED

In scope:
  Pilot facility order
  facilityKey（変更されにくい識別子）
  Site display name
  Site URL suffix
  naming ≠ creation GO

Out of scope / DEFERRED:
  List names（List 正本責務確認後に別 Decision）
  法人共通管理サイト命名
  Site / List creation
  Internal Column Names
  Implementation Start
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
Selection SELECTED / OPEN
  → decision-assessment-snapshot-pilot-facility-identity-packet.md
Decision-AS-PILOT-FACILITY-IDENTITY-1: OPEN / NOT ACCEPTED

Human Acceptance requires explicit confirmation such as:
  「磯子=isogo / 本牧=honmoku、この Site 名・URL でいく」

Until that:
  recommended payload = CANDIDATE / NOT LOCKED
  Site / List creation = NO-GO
  Placeholder creation = FORBIDDEN
  List names = DEFERRED
```
