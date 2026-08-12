# Decision Packet — GOV-STAFF-06 資格・研修マスターの正本管理者

この文書は、**GOV-STAFF-06**（資格・研修マスターの正本管理者）の
**Human Decision Packet** である。

Issue #19 所有の最小単位。
GOV-STAFF-01〜05 / 07 の再 Decision ではない。
Agent がマスター UI・名簿・個人名を発明しない。
Implementation Start ではない。

Selection:
[`decision-gov-staff-06-qualification-training-master-owner-selection.md`](./decision-gov-staff-06-qualification-training-master-owner-selection.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-STAFF-06
Kind: Human Decision packet（narrow）
Status: Accepted / LOCKED / Option B
Owner: Issue #19
Selected via: Decision-GOV-STAFF-06-SELECTION-1
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation: NONE（Binding 推薦なし）
Human Selected Option: B（法人業務責任者）
Option Acceptance: decision-gov-staff-06-qualification-training-master-owner-option-b-acceptance.md
Issue #19 design recommendation（non-binding）: B（≠ Human Acceptance evidence）
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-staff-06-qualification-training-master-owner-selection.md`](./decision-gov-staff-06-qualification-training-master-owner-selection.md)
- [`decision-issue-19-residual-governance-selection.md`](./decision-issue-19-residual-governance-selection.md)
- Issue #19 §A GOV-STAFF-06
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current canonical state

```text
GOV-STAFF-01〜05: Accepted / LOCKED（該当 Option）
GOV-STAFF-06 qualification/training master owner: Accepted / LOCKED / Option B
  = 法人業務責任者
GOV-STAFF-07〜12: OPEN / OUT
SharePoint / M365 / Entra / Deploy: NO-GO
```

問い（本 packet）:

> 資格・研修マスターの正本管理者は誰ですか？

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| GOV-STAFF-01〜05 | 異動・台帳・閲覧 等 | **OUT**（Accepted） |
| **GOV-STAFF-06** | 資格・研修マスターの正本管理者 | **本 packet** |
| GOV-STAFF-07 | 資格・研修情報の確認者 | **OUT** |
| GOV-STAFF-08〜12 | 分母 / 資格扱い 等 | **OUT** |
| マスター UI / 名簿 | 画面・個人名 | OUT / FORBIDDEN |
| Implementation | code / tenant mutation | HOLD |

```text
正本管理者 ≠ 確認者（GOV-STAFF-07）
正本管理者 ≠ 研修割合の分母（GOV-STAFF-08）
正本管理者を決める ≠ マスター UI / 名簿実装開始
正本管理者を決める ≠ 個人名の発明
```

## 3. Options（Issue #19 原文）

### Option A — 事業所管理者

```text
Meaning:
  資格・研修マスターの正本管理者 = 事業所管理者
```

### Option B — 法人業務責任者

```text
Meaning:
  資格・研修マスターの正本管理者 = 法人業務責任者

Does NOT mean:
  マスター UI・名簿・個人名の発明
  GOV-STAFF-07〜12 を同時に決めた
```

### Option C — Microsoft 365管理者

```text
Meaning:
  資格・研修マスターの正本管理者 = Microsoft 365管理者
```

### Option D — その他（Human が明示）

```text
Requires:
  役割名または規則を Human が記入
Agent MUST NOT invent the role name
```

### Option H — まだ決めない / HOLD

```text
Meaning:
  GOV-STAFF-06 Option は未決のまま
  unit Selection は維持してよい
```

## 4. Explicit non-options

```text
Option tip B の自動 Accepted（Human Decision 前）
GOV-STAFF-07〜12 の同時採択
SharePoint / M365 / Entra mutation 実行
マスター UI・名簿・個人名の発明
SharePoint / M365 / Deploy / real data
Implementation Start
FindingCode / A-5
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason:
  GOV-STAFF-06 は ORG_POLICY。
  Issue #19 の「設計上の推奨: B」は Binding ではない。
  Agent は法人業務責任者を Binding 推薦値として確定しない。
```

Agent recommendation の欠如 / Issue 設計推奨は Human Acceptance evidence ではない。

## 6. Human Decision

```text
問:
  資格・研修マスターの正本管理者は誰ですか？

A. 事業所管理者
B. 法人業務責任者
C. Microsoft 365管理者
D. その他（Human が明示）
H. まだ決めない / HOLD

答え: B（Accepted / LOCKED）
```

## 7. After Decision

| Selected | Next |
|---|---|
| **B** | **Option Acceptance LOCKED（本 Decision）**。UI / 実装は別 GO |
| A / C / D / H | NOT SELECTED |

維持:

```text
GOV-STAFF-01〜05: UNCHANGED
GOV-STAFF-07〜12: OUT / DO NOT START from this Decision alone
SharePoint / M365 / Entra mutation: NO-GO
Implementation Start: DO NOT START
next residual auto-select: FORBIDDEN
```

## Reference

- Selection: `decision-gov-staff-06-qualification-training-master-owner-selection.md`
- SELECT Acceptance: `decision-gov-staff-06-qualification-training-master-owner-acceptance.md`
- Option B Acceptance: `decision-gov-staff-06-qualification-training-master-owner-option-b-acceptance.md`
- Issue #19 GOV-STAFF-06 source options A–D
