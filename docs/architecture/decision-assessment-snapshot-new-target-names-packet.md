# Decision-AS-NEW-TARGET-NAMES-1 — new SPFx Site / List concrete naming / value

この文書は、Decision-AS-NEW-TARGET-PROVISION-1 Accepted / LOCKED / ST-1+LT-1+NM-1+EX-1 を前提に、
**新 SPFx 用 Site / List の concrete naming / value** を判断する Human Decision Packet である。

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
Kind: Human Decision packet（compare only）
Status: OPEN / NOT ACCEPTED
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

## 2. Compare axes

### SU — Site URL / Site name

| ID | 内容 | 判定上の意味 |
|---|---|---|
| **SU-1** | Human Acceptance で具体 Site URL + Site name を明示採択する。Agent は候補を Accepted 値として発明しない | NM-1 の「別 Human Decision」を満たす |
| SU-2 | Agent が具体 Site URL / Site name を発明し、そのまま採択する | 値発明。SV-1 / SC-1 と衝突しやすい |
| SU-HOLD | Site 具体値をまだ決めない | 現状維持 |

### LN — List names

| ID | 内容 | 判定上の意味 |
|---|---|---|
| **LN-1** | Human Acceptance で具体 List name(s) を明示採択する。Agent は Accepted 値を発明しない | NM-1 の「別 Human Decision」を満たす |
| LN-2 | Agent が具体 List name(s) を発明し、そのまま採択する | 値発明。LV-1 / SC-1 と衝突しやすい |
| LN-HOLD | List 具体値をまだ決めない | 現状維持 |

### IN — Internal Column Names

| ID | 内容 | 判定上の意味 |
|---|---|---|
| **IN-1** | 本 Decision では Internal Column Names を発明・固定しない。作成後に CN-1（実 SharePoint 確認）で確定 | CN-1 と最も整合 |
| IN-2 | Human が intended Internal Column Names を本 Decision で採択する。作成後も CN-1 確認は必須。未確認値を CONFIRMED 扱いしない | 作成前の意図値のみ。確認は別 |
| IN-3 | Agent が Internal Column Names を発明して固定する | CN-1 違反 |
| IN-HOLD | Internal Name 方針未決定 | Acceptance 不可にしやすい |

### XB — execution boundary

| ID | 内容 | 判定上の意味 |
|---|---|---|
| **XB-1** | naming Acceptance ≠ Site/List creation GO。実 tenant mutation / provisioning は別 Human gate | EX-1 を維持 |
| XB-2 | naming Acceptance と同時に Site/List を作成する | mutation auto-start |
| XB-HOLD | execution boundary 未決定 | Acceptance 不可 |

## 3. Agent recommendation（NOT Acceptance）

```text
Agent recommendation:
  SU-1 + LN-1 + IN-1 + XB-1

Rationale:
  NM-1 が要求した concrete naming Decision を開き、
  具体文字列は Human が Acceptance で明示する（Agent 発明禁止）。
  Internal Names は未作成 Site 上で確認できないため IN-1 で CN-1 後段へ残す。
  EX-1 を XB-1 で維持し、作成実行は別 Human gate に残す。

This is NOT Human Acceptance evidence.
Human must explicitly Accept an SU / LN / IN / XB combination
and, for SU-1 / LN-1, write the concrete strings in the Acceptance 正本.
```

## 4. Concrete value slots（Acceptance 時のみ埋める）

```text
Until Human Acceptance, leave EMPTY / NOT SELECTED:

  New Site URL:        ________
  New Site name:       ________
  New List name(s):    ________
  Internal Names:      N/A under IN-1 recommendation
                       （IN-2 を選ぶ場合のみ Human が intended 値を明示）

FORBIDDEN now:
  Agent inventing or hard-coding the blanks above as Accepted values
  Treating blanks as OBSERVED / CONFIRMED
  Treating naming Acceptance as Site/List creation GO
```

## 5. Explicit non-authorization

```text
This packet does NOT authorize:
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
If Human accepts SU-1 + LN-1 + IN-1 + XB-1
  and writes concrete Site URL / Site name / List name(s):
  → Decision-AS-NEW-TARGET-NAMES-1 becomes Accepted / LOCKED
  → intended deployment-config names LOCKED（SC-1 env values）
  → Internal Column Names remain OPEN until post-creation CN-1
  → Site / List creation remains NO-GO until separate Human execution gate
  → Implementation Start remains HOLD

Until explicit Human Acceptance:
  Decision-AS-NEW-TARGET-NAMES-1 = OPEN / NOT ACCEPTED
  Concrete Site / List / Internal Names = OPEN / NOT SELECTED
  Site / List creation = NO-GO
  New SPFx deployment target = TOPOLOGY LOCKED / NOT CREATED / HOLD
```
