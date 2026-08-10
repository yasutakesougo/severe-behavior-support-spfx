# Decision-AS-PILOT-FACILITY-IDENTITY-1 — formal pilot facility identity / Site naming

この文書は、Decision-AS-ORG-SITE-TOPOLOGY-1 Accepted / LOCKED を前提に、
**パイロット事業所の identity と Site 命名**を判断する Human Decision Packet である。

Accepted 正本:
[`decision-assessment-snapshot-pilot-facility-identity-acceptance.md`](./decision-assessment-snapshot-pilot-facility-identity-acceptance.md)

Selected via:
[`decision-ilb-1-twenty-fourth-residual-pilot-facility-identity-selection.md`](./decision-ilb-1-twenty-fourth-residual-pilot-facility-identity-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-org-site-topology-acceptance.md`](./decision-assessment-snapshot-org-site-topology-acceptance.md)
（Decision-AS-ORG-SITE-TOPOLOGY-1 = OT-1+FS-1+SP-1+PP-1+PH-1+XB-1）
[`decision-assessment-snapshot-new-target-names-acceptance.md`](./decision-assessment-snapshot-new-target-names-acceptance.md)
（Decision-AS-NEW-TARGET-NAMES-1 = SU-1+LN-1+IN-1+XB-1；XXXXX/YYYYY = PLACEHOLDER）
[`decision-assessment-snapshot-new-target-provisioning-acceptance.md`](./decision-assessment-snapshot-new-target-provisioning-acceptance.md)
（Decision-AS-NEW-TARGET-PROVISION-1 = ST-1+LT-1+NM-1+EX-1）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-PILOT-FACILITY-IDENTITY-1
Kind: Human Decision packet（compare → CONSUMED）
Status: CONSUMED（Human Decision Accepted / LOCKED）
Human Decision: PO-1 + FK-1 + SN-1 + LN-D + XB-1
Human Selected:
  Pilot facility order:  PO-1
  facilityKey:           FK-1
  Site naming:           SN-1
  List names:            LN-D
  Execution boundary:    XB-1
Human Accept phrase:
  「磯子=isogo / 本牧=honmoku、この Site 名・URL でいく」
Selected via:
  decision-ilb-1-twenty-fourth-residual-pilot-facility-identity-selection.md

Locked basis:
  Decision-AS-ORG-SITE-TOPOLOGY-1 = Accepted / LOCKED
    / OT-1 + FS-1 + SP-1 + PP-1 + PH-1 + XB-1
  Decision-AS-NEW-TARGET-NAMES-1 placeholders = XXXXX / YYYYY
    = HUMAN-PROVIDED / INTENDED / PLACEHOLDER / NOT CREATABLE
  Per-facility Site + Lists topology = ST-1 + LT-1（再 Decision しない）

Current state:
  Pilot facility identity / Site naming = Accepted / LOCKED
  Naming payload = HUMAN-PROVIDED / INTENDED / NOT CREATED / NOT CONFIRMED
  List names = DEFERRED
  Site / List creation = NO-GO
  Placeholder creation = FORBIDDEN
  Implementation Start = HOLD
  SharePoint implementation = DO NOT START
  Deploy / real data = NO-GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Question

```text
パイロット事業所の順序、変更されにくい facilityKey、
および第1・第2パイロット Site の display name / URL をどう採択するか。

List names は本 Decision で決めない。
naming Acceptance ≠ Site/List creation GO。
XXXXX / YYYYY は実値として使わない。
```

```text
Historical note:
  候補・Agent recommendation は比較用。
  採択は Acceptance 正本のみが LOCKED である。
```

## 2. Compare axes（比較履歴）

### PO — Pilot facility order

| ID | 内容 | 結果 |
|---|---|---|
| **PO-1** | Pilot 1 = 磯子活動ホーム / Pilot 2 = 本牧活動ホーム | **Accepted** |
| PO-HOLD | 順序をまだ決めない | NOT SELECTED |

### FK — facilityKey

| ID | 内容 | 結果 |
|---|---|---|
| **FK-1** | 磯子活動ホーム → `isogo` / 本牧活動ホーム → `honmoku` | **Accepted** |
| FK-2 | Agent が別キーを発明して採択する | NOT SELECTED |
| FK-HOLD | facilityKey をまだ決めない | NOT SELECTED |

### SN — Site naming

| ID | 内容 | 結果 |
|---|---|---|
| **SN-1** | display name = `強度行動障害支援 - {事業所名}` / URL = `/sites/severe-support-{facilityKey}` | **Accepted** |
| SN-2 | Agent が別命名規則を発明して採択する | NOT SELECTED |
| SN-HOLD | Site naming をまだ決めない | NOT SELECTED |

### LN — List names

| ID | 内容 | 結果 |
|---|---|---|
| **LN-D** | List names は本 Decision 対象外。List 正本責務確認後に別 Human Decision | **Accepted（DEFERRED）** |
| LN-1 | 本 Decision で List names も同時採択する | NOT SELECTED |

### XB — Execution boundary

| ID | 内容 | 結果 |
|---|---|---|
| **XB-1** | identity / Site naming Acceptance ≠ Site/List creation GO | **Accepted** |
| XB-2 | naming Acceptance と同時に Site/List を作成する | NOT SELECTED |
| XB-HOLD | execution boundary 未決定 | NOT SELECTED |

## 3. Accepted naming payload（LOCKED as INTENDED）

```text
Status: HUMAN-PROVIDED / INTENDED / NOT CREATED / NOT CONFIRMED
≠ OBSERVED / CONFIRMED / CREATED
```

### Pilot facility 1

```text
Facility:           磯子活動ホーム
facilityKey:        isogo
Site display name:  強度行動障害支援 - 磯子活動ホーム
Site URL:           https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo
Site URL suffix:    /sites/severe-support-isogo
```

### Pilot facility 2

```text
Facility:           本牧活動ホーム
facilityKey:        honmoku
Site display name:  強度行動障害支援 - 本牧活動ホーム
Site URL:           https://isogokatudouhome.sharepoint.com/sites/severe-support-honmoku
Site URL suffix:    /sites/severe-support-honmoku
```

## 4. Agent recommendation（historical / NOT Acceptance）

```text
Agent / design recommendation:
  PO-1 + FK-1 + SN-1 + LN-D + XB-1

Human Accept phrase:
  「磯子=isogo / 本牧=honmoku、この Site 名・URL でいく」

This recommendation was NOT Human Acceptance evidence by itself.
Human Acceptance is recorded in the Acceptance 正本 only.
```

## 5. Explicit non-authorization

```text
This packet / Acceptance does NOT authorize:
  inventing List names
  creating Site / List / columns
  creating with XXXXX / YYYYY
  treating INTENDED as OBSERVED / CONFIRMED / CREATED
  PROVISION-EXEC Execution GO
  tenant / Entra / M365 mutation
  Implementation Start
  SharePoint / adapter / application implementation
  Schema / DTO code assignment
  Deploy / real data
  FindingCode / A-5
  post-retention deletion
```

## 6. Next after Human Acceptance

```text
Decision-AS-PILOT-FACILITY-IDENTITY-1: Accepted / LOCKED / PO-1 + FK-1 + SN-1 + LN-D + XB-1
  → decision-assessment-snapshot-pilot-facility-identity-acceptance.md
Next gate: FIXED
  PILOT LIST NAMES（after List ownership / responsibility check）
  → decision-assessment-snapshot-pilot-facility-identity-next-gate.md
List names: DEFERRED
Site / List creation: NO-GO
Placeholder creation: FORBIDDEN
Implementation Start: HOLD
```
