# Decision-AS-NEW-TARGET-PROVISION-EXEC-1 — provisioning execution authorization

この文書は、新 SPFx deployment target の **Site / List 実作成 authorization** を判断する Human Decision Packet である。

Accepted 正本:
[`decision-assessment-snapshot-new-target-provision-exec-acceptance.md`](./decision-assessment-snapshot-new-target-provision-exec-acceptance.md)

Selected via:
[`decision-ilb-1-twenty-second-residual-new-spfx-provision-exec-selection.md`](./decision-ilb-1-twenty-second-residual-new-spfx-provision-exec-selection.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-NEW-TARGET-PROVISION-EXEC-1
Kind: Human Decision packet（compare → CONSUMED）
Status: CONSUMED（Human Decision Accepted / LOCKED）
Human Decision: PX-1 + VR-1 + FG-1 + XB-1
Human Selected:
  Provisioning execution:  PX-1
  Verification boundary:   VR-1
  Failure boundary:        FG-1
  Scope boundary:          XB-1
Selected via:
  decision-ilb-1-twenty-second-residual-new-spfx-provision-exec-selection.md

Site / List creation: AUTHORIZED / NOT STARTED
tenant mutation（Site+List only）: AUTHORIZED / NOT STARTED
Acceptance ≠ execution completed
Implementation Start: HOLD
custom column creation: NO-GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Locked basis（再 Decision しない）

```text
Decision-AS-TARGET-REUSE-1:
  Accepted / LOCKED / B

Decision-AS-NEW-TARGET-PROVISION-1:
  Accepted / LOCKED / ST-1 + LT-1 + NM-1 + EX-1

Decision-AS-NEW-TARGET-NAMES-1:
  Accepted / LOCKED / SU-1 + LN-1 + IN-1 + XB-1

Intended Site / List strings:
  HUMAN-PROVIDED / INTENDED
  Site URL:  https://isogokatudouhome.sharepoint.com/sites/XXXXX
  Site name: XXXXX
  Lists:     XXXXX / YYYYY
  NOT CREATED / NOT CONFIRMED（SV-1 / LV-1 pending read-back）

Internal Column Names:
  OPEN / IN-1 / post-creation CN-1
```

## Question

```text
Human-provided / intended として LOCKED 済みの新 SPFx 専用 Site と dedicated Lists について、
Site + List の作成だけを実行してよいか。

この Decision は custom columns を作成しない。
Site/List 作成後に SV-1 / LV-1 を read-back し、Internal Column Names は後続 CN-1 へ残す。
```

```text
Historical note:
  候補・Agent recommendation は比較用。採択は Acceptance 正本のみが LOCKED である。
  authorization Accepted ≠ execution completed ≠ SV-1/LV-1 CONFIRMED。
```

## Compare axes（比較履歴）

### PX — provisioning execution

| ID | 内容 | 結果 |
|---|---|---|
| **PX-1** | LOCKED 済み intended Site + Lists の作成を許可する。ただし Site/List のみ。custom columns は作らない | **Accepted** |
| PX-HOLD | 実作成をまだ許可しない | NOT SELECTED |

### VR — verification boundary

| ID | 内容 | 結果 |
|---|---|---|
| **VR-1** | 作成後に実 tenant から Site URL / Site name / List name(s) を read-back し、intended と一致した場合のみ SV-1 / LV-1 を CONFIRMED とする | **Accepted** |
| VR-HOLD | read-back 条件未確定のため実行しない | NOT SELECTED |

### FG — failure boundary

| ID | 内容 | 結果 |
|---|---|---|
| **FG-1** | access denied / name conflict / object already exists / ambiguous result / partial failure / evidence不足時は fail-closed で停止。代替名の発明、上書き、blind retry をしない | **Accepted** |
| FG-HOLD | failure handling 未確定のため実行しない | NOT SELECTED |

### XB — scope boundary

| ID | 内容 | 結果 |
|---|---|---|
| **XB-1** | この authorization は Site + Lists の creation のみ。custom column creation、permissions/config、Deploy、real data、Implementation Start、SharePoint application/adapter code は別 gate | **Accepted** |
| XB-HOLD | scope が固定されないため実行しない | NOT SELECTED |

## Agent recommendation（historical / NOT Acceptance）

```text
Agent recommendation:
  PX-1 + VR-1 + FG-1 + XB-1

This was NOT Human Acceptance evidence.
Human Acceptance is recorded in the Acceptance 正本 only.
```

## Explicit non-authorization（unchanged）

```text
This packet / Acceptance does NOT by itself complete:
  Site / List creation
  SV-1 / LV-1 confirmation without read-back

This packet / Acceptance does NOT authorize:
  custom column creation
  Internal Name invention / confirmation
  permissions / config changes
  tenant / Entra / M365 changes outside exact Site+List creation
  Implementation Start
  SharePoint / adapter / application implementation
  Schema / DTO code assignment
  Deploy / real data
  FindingCode / A-5
  post-retention deletion
  name invention / overwrite / blind retry on failure
```

## Next after Human Acceptance

```text
Decision-AS-NEW-TARGET-PROVISION-EXEC-1: Accepted / LOCKED / PX-1 + VR-1 + FG-1 + XB-1
  → decision-assessment-snapshot-new-target-provision-exec-acceptance.md
Next gate: FIXED
  EXPLICIT SITE/LIST CREATION EXECUTION + VR-1 READ-BACK
  → decision-assessment-snapshot-new-target-provision-exec-next-gate.md
Execution GO: NOT GIVEN / NOT STARTED
Site / List creation: AUTHORIZED / NOT STARTED
SV-1 / LV-1: NOT CONFIRMED
Internal Column Names: OPEN（IN-1）
custom columns / Implementation Start: NO-GO / HOLD
Ready / Merge: NOT RUN by this Decision
```
