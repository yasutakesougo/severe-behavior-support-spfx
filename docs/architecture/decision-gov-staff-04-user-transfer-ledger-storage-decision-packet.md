# Decision Packet — GOV-STAFF-04 利用者異動台帳の保存先

この文書は、**GOV-STAFF-04**（利用者異動台帳の保存先）の
**Human Decision Packet** である。

Issue #19 所有の最小単位。
GOV-STAFF-01〜03 / 05 の再 Decision ではない。
Agent が SharePoint サイト・リスト・スキーマ・支援内容保存を発明しない。
Implementation Start ではない。

Selection:
[`decision-gov-staff-04-user-transfer-ledger-storage-selection.md`](./decision-gov-staff-04-user-transfer-ledger-storage-selection.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-STAFF-04
Kind: Human Decision packet（narrow）
Status: Accepted / LOCKED / Option C
Owner: Issue #19
Selected via: Decision-GOV-STAFF-04-SELECTION-1
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation: NONE（Binding 推薦なし）
Human Selected Option: C
  （専用の法人共通台帳。支援内容は保存しない）
Option Acceptance: decision-gov-staff-04-user-transfer-ledger-storage-option-c-acceptance.md
Issue #19 design recommendation（non-binding）: C（≠ Human Acceptance evidence）
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-staff-04-user-transfer-ledger-storage-selection.md`](./decision-gov-staff-04-user-transfer-ledger-storage-selection.md)
- [`decision-issue-19-residual-governance-selection.md`](./decision-issue-19-residual-governance-selection.md)
- Issue #19 §A GOV-STAFF-04
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current canonical state

```text
GOV-STAFF-01 confirmer: Accepted / LOCKED / Option C
GOV-STAFF-02 Entra removal operator: Accepted / LOCKED / Option B
GOV-STAFF-03 access suspension deadline: Accepted / LOCKED / Option A
GOV-STAFF-04 user-transfer ledger storage: Accepted / LOCKED / Option C
  = 専用の法人共通台帳。支援内容は保存しない
GOV-STAFF-05〜12: OPEN / OUT
SharePoint / M365 / Entra / Deploy: NO-GO
```

問い（本 packet）:

> 利用者異動台帳の保存先はどこですか？

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| GOV-STAFF-01 | 異動・退職情報の確定者 | **OUT**（Accepted） |
| GOV-STAFF-02 | Entra IDグループから削除する実施者 | **OUT**（Accepted） |
| GOV-STAFF-03 | 権限停止期限 | **OUT**（Accepted） |
| **GOV-STAFF-04** | 利用者異動台帳の保存先 | **本 packet** |
| GOV-STAFF-05 | 異動後の過去記録の閲覧範囲 | **OUT** |
| GOV-STAFF-06〜12 | 資格・研修 等 | **OUT** |
| SharePoint site / list 実装 | tenant 操作 | OUT / FORBIDDEN |
| Implementation | code / automation | HOLD |

```text
台帳保存先 ≠ 確定者（GOV-STAFF-01）
台帳保存先 ≠ Entra 削除実施者（GOV-STAFF-02）
台帳保存先 ≠ 権限停止期限（GOV-STAFF-03）
台帳保存先 ≠ 過去記録の閲覧範囲（GOV-STAFF-05）
保存先を決める ≠ SharePoint サイト作成 / リスト実装開始
専用台帳 ≠ 支援内容の保存許可
```

## 3. Options（Issue #19 原文）

### Option A — 法人共通サイト

```text
Meaning:
  利用者異動台帳の保存先 = 法人共通サイト
```

### Option B — 異動元・異動先の両サイト

```text
Meaning:
  利用者異動台帳の保存先 = 異動元・異動先の両サイト
```

### Option C — 専用の法人共通台帳。支援内容は保存しない

```text
Meaning:
  利用者異動台帳の保存先 =
    専用の法人共通台帳。支援内容は保存しない

Does NOT mean:
  台帳スキーマ・SharePoint リスト・サイトの発明
  支援記録・観察・計画本文の保存を許可した
  GOV-STAFF-05〜12 を同時に決めた
```

### Option D — その他（Human が明示）

```text
Requires:
  保存先規則を Human が記入
Agent MUST NOT invent the storage location rule
```

### Option H — まだ決めない / HOLD

```text
Meaning:
  GOV-STAFF-04 Option は未決のまま
  unit Selection は維持してよい
```

## 4. Explicit non-options

```text
Option tip C の自動 Accepted（Human Decision 前）
GOV-STAFF-05〜12 の同時採択
SharePoint / M365 / Entra mutation 実行
台帳スキーマ・支援内容保存の発明
SharePoint / M365 / Deploy / real data
Implementation Start
FindingCode / A-5
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason:
  GOV-STAFF-04 は ORG_POLICY。
  Issue #19 の「設計上の推奨: C」は Binding ではない。
  Agent は専用法人共通台帳を Binding 推薦値として確定しない。
```

Agent recommendation の欠如 / Issue 設計推奨は Human Acceptance evidence ではない。

## 6. Human Decision

```text
問:
  利用者異動台帳の保存先はどこですか？

A. 法人共通サイト
B. 異動元・異動先の両サイト
C. 専用の法人共通台帳。支援内容は保存しない
D. その他（Human が明示）
H. まだ決めない / HOLD

答え: C（Accepted / LOCKED）
```

## 7. After Decision

| Selected | Next |
|---|---|
| **C** | **Option Acceptance LOCKED（本 Decision）**。サイト/リスト実装は別 GO |
| A / B / D / H | NOT SELECTED |

維持:

```text
GOV-STAFF-01〜03: UNCHANGED
GOV-STAFF-05〜12: OUT / DO NOT START from this Decision alone
SharePoint / M365 / Entra mutation: NO-GO
Implementation Start: DO NOT START
next residual auto-select: FORBIDDEN
```

## Reference

- Selection: `decision-gov-staff-04-user-transfer-ledger-storage-selection.md`
- SELECT Acceptance: `decision-gov-staff-04-user-transfer-ledger-storage-acceptance.md`
- Option C Acceptance: `decision-gov-staff-04-user-transfer-ledger-storage-option-c-acceptance.md`
- Issue #19 GOV-STAFF-04 source options A–D
