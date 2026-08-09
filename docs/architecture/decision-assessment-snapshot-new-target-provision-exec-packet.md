# Decision-AS-NEW-TARGET-PROVISION-EXEC-1 — provisioning execution authorization

この文書は、新 SPFx deployment target の **Site / List 実作成 authorization** を判断する Human Decision Packet である。

Selected via:
[`decision-ilb-1-twenty-second-residual-new-spfx-provision-exec-selection.md`](./decision-ilb-1-twenty-second-residual-new-spfx-provision-exec-selection.md)

```text
Status: OPEN / NOT ACCEPTED
Kind: Human Decision packet（compare only）
Implementation Start: HOLD
Tenant mutation: NO-GO
Site / List creation: NO-GO
```

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
  NOT CREATED / NOT CONFIRMED

Internal Column Names:
  OPEN / IN-1 / post-creation CN-1
```

## Question

Human-provided / intended として LOCKED 済みの新 SPFx 専用 Site と dedicated Lists について、**Site + List の作成だけを実行してよいか**。

この Decision は custom columns を作成しない。Site/List 作成後に SV-1 / LV-1 を read-back し、Internal Column Names は後続 CN-1 へ残す。

## Compare

| ID | 内容 | 結果 |
|---|---|---|
| **PX-1** | LOCKED 済み intended Site + Lists の作成を許可する。ただし Site/List のみ。custom columns は作らない | provisioning execution authorization |
| PX-HOLD | 実作成をまだ許可しない | 現行 NO-GO 維持 |

### Verification boundary

| ID | 内容 |
|---|---|
| **VR-1** | 作成後に実 tenant から Site URL / Site name / List name(s) を read-back し、intended と一致した場合のみ SV-1 / LV-1 を CONFIRMED とする |
| VR-HOLD | read-back 条件未確定のため実行しない |

### Failure boundary

| ID | 内容 |
|---|---|
| **FG-1** | access denied / name conflict / object already exists / ambiguous result / partial failure / evidence不足時は fail-closed で停止。代替名の発明、上書き、blind retry をしない |
| FG-HOLD | failure handling 未確定のため実行しない |

### Scope boundary

| ID | 内容 |
|---|---|
| **XB-1** | この authorization は Site + Lists の creation のみ。custom column creation、permissions/config、Deploy、real data、Implementation Start、SharePoint application/adapter code は別 gate |
| XB-HOLD | scope が固定されないため実行しない |

## Agent recommendation（NOT Human Acceptance）

```text
Agent recommendation:
  PX-1 + VR-1 + FG-1 + XB-1

Reason:
  intended naming は既に Human-provided / LOCKED。
  実行範囲を Site + Lists に限定し、作成後 read-back を必須とし、
  conflict / partial failure は fail-closed にする。

This recommendation is NOT Human Acceptance evidence.
```

## Explicit non-authorization

```text
Until explicit Human Acceptance:
  Site creation: NO-GO
  List creation: NO-GO
  tenant mutation: NO-GO

This packet never authorizes by itself:
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
```

## Human gate

```text
Accept one combination explicitly.
Recommended:
  PX-1 + VR-1 + FG-1 + XB-1

Acceptance ≠ execution completed.
After Acceptance, actual tenant mutation is a separate execution step and must be read-back verified.
```
