# Decision-AS-NEW-TARGET-NAMES-1 — new SPFx Site / List concrete naming / value

この文書は、Decision-AS-NEW-TARGET-PROVISION-1 Accepted / LOCKED / ST-1+LT-1+NM-1+EX-1 を前提に、
**新 SPFx 用 Site / List の concrete naming / value** を判断する Human Decision Packet である。

Accepted 正本:
[`decision-assessment-snapshot-new-target-names-acceptance.md`](./decision-assessment-snapshot-new-target-names-acceptance.md)

Selected via:
[`decision-ilb-1-twenty-first-residual-new-spfx-target-names-selection.md`](./decision-ilb-1-twenty-first-residual-new-spfx-target-names-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-new-target-provisioning-acceptance.md`](./decision-assessment-snapshot-new-target-provisioning-acceptance.md)
（Decision-AS-NEW-TARGET-PROVISION-1 = ST-1+LT-1+NM-1+EX-1）
[`decision-assessment-snapshot-target-reuse-acceptance.md`](./decision-assessment-snapshot-target-reuse-acceptance.md)
（Decision-AS-TARGET-REUSE-1 = B）
[`decision-assessment-snapshot-sp-placement-acceptance.md`](./decision-assessment-snapshot-sp-placement-acceptance.md)
（Decision-AS-SP-PLACEMENT-1 = SV-1+LV-1+CN-1+SC-1）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-NEW-TARGET-NAMES-1
Kind: Human Decision packet（compare → CONSUMED）
Status: CONSUMED（Human Decision Accepted / LOCKED on axes；values OPEN）
Human Decision: SU-1 + LN-1 + IN-1 + XB-1
Human Selected:
  Site URL / Site name mode:  SU-1
  List names mode:            LN-1
  Internal Column Names:      IN-1
  Execution boundary:         XB-1
Selected via:
  decision-ilb-1-twenty-first-residual-new-spfx-target-names-selection.md

Baseline（PR #184 MERGED）:
  expected head: 84745355929c7e43dcc6c89dd00d29935f79034c
  merge commit:  0be50a12e3699d187bce0f27caa732f3e7ccea24
  status: MERGED

Locked basis:
  Decision-AS-TARGET-REUSE-1 = Accepted / LOCKED / B
  Decision-AS-NEW-TARGET-PROVISION-1 = Accepted / LOCKED / ST-1 + LT-1 + NM-1 + EX-1
  Decision-AS-SP-PLACEMENT-1 = Accepted / LOCKED / SV-1 + LV-1 + CN-1 + SC-1
  Existing /sites/welfare + DailyActivityRecords = REFERENCE ONLY
  Reuse existing /sites/welfare = NOT ADOPTED
  Topology = dedicated new Site + dedicated new Lists

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

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Question

```text
新 SPFx 専用 Site の concrete Site URL / Site name と、
専用 Lists の concrete List name(s) を、どの方針で Human 採択するか。

Internal Column Names を本 Decision で扱うか、作成後 CN-1 確認に残すか。
naming Acceptance と Site/List 作成 GO を分離するか。

具体文字列は Agent が発明しない。Human Acceptance で明示する。
```

```text
Historical note:
  候補・Agent recommendation は比較用。採択は Acceptance 正本のみが LOCKED である。
  axes Accepted ≠ 具体文字列確定 ≠ Site/List 作成。
```

## 2. Compare axes（比較履歴）

### SU — Site URL / Site name

| ID | 内容 | 結果 |
|---|---|---|
| **SU-1** | Human Acceptance で具体 Site URL + Site name を明示採択する。Agent は候補を Accepted 値として発明しない | **Accepted** |
| SU-2 | Agent が具体 Site URL / Site name を発明し、そのまま採択する | NOT SELECTED |
| SU-HOLD | Site 具体値をまだ決めない | NOT SELECTED |

### LN — List names

| ID | 内容 | 結果 |
|---|---|---|
| **LN-1** | Human Acceptance で具体 List name(s) を明示採択する。Agent は Accepted 値を発明しない | **Accepted** |
| LN-2 | Agent が具体 List name(s) を発明し、そのまま採択する | NOT SELECTED |
| LN-HOLD | List 具体値をまだ決めない | NOT SELECTED |

### IN — Internal Column Names

| ID | 内容 | 結果 |
|---|---|---|
| **IN-1** | 本 Decision では Internal Column Names を発明・固定しない。作成後に CN-1（実 SharePoint 確認）で確定 | **Accepted** |
| IN-2 | Human が intended Internal Column Names を本 Decision で採択する。作成後も CN-1 確認は必須。未確認値を CONFIRMED 扱いしない | NOT SELECTED |
| IN-3 | Agent が Internal Column Names を発明して固定する | NOT SELECTED |
| IN-HOLD | Internal Name 方針未決定 | NOT SELECTED |

### XB — execution boundary

| ID | 内容 | 結果 |
|---|---|---|
| **XB-1** | naming Acceptance ≠ Site/List creation GO。実 tenant mutation / provisioning は別 Human gate | **Accepted** |
| XB-2 | naming Acceptance と同時に Site/List を作成する | NOT SELECTED |
| XB-HOLD | execution boundary 未決定 | NOT SELECTED |

## 3. Agent recommendation（historical / NOT Acceptance）

```text
Agent recommendation:
  SU-1 + LN-1 + IN-1 + XB-1

This was NOT Human Acceptance evidence.
Human Acceptance is recorded in the Acceptance 正本 only.
```

## 4. Concrete value slots（SU-1 / LN-1 payload）

```text
Axes Accepted / LOCKED. Concrete strings remain OPEN:

  New Site URL:        NOT SELECTED / OPEN
  New Site name:       NOT SELECTED / OPEN
  New List name(s):    NOT SELECTED / OPEN
  Internal Names:      OPEN under IN-1（post-creation CN-1）

FORBIDDEN:
  Agent inventing or hard-coding the blanks above as Accepted values
  Treating blanks as OBSERVED / CONFIRMED
  Treating axes Acceptance as Site/List creation GO
```

## 5. Explicit non-authorization（unchanged）

```text
This packet / Acceptance does NOT authorize:
  Agent invention of Site URL / Site name / List names / Internal Names
  treating EXISTING-APP /sites/welfare values as new-SPFx names
  Site creation
  List / column creation
  tenant / Entra / M365 mutation
  Implementation Start
  SharePoint / adapter / application implementation
  Schema / DTO code assignment
  Deploy / real data
  FindingCode / A-5
  post-retention deletion
  re-deciding TARGET-REUSE-1 / NEW-TARGET-PROVISION-1 / SP-PLACEMENT-1
```

## 6. Next after Human Acceptance

```text
Decision-AS-NEW-TARGET-NAMES-1: Accepted / LOCKED（axes） / SU-1 + LN-1 + IN-1 + XB-1
  → decision-assessment-snapshot-new-target-names-acceptance.md
Concrete Site URL / Site name / List names: NOT SELECTED / OPEN
  → next Human fill: SU-1 / LN-1 concrete strings
Internal Column Names: OPEN（IN-1）
Site / List creation: NO-GO until separate Human execution gate
Implementation Start: HOLD
Ready / Merge: NOT RUN by this Decision
```
