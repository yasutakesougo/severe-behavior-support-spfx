# Decision Packet — GOV-STAFF-02 Entra IDグループから削除する実施者

この文書は、**GOV-STAFF-02**（Entra IDグループから削除する実施者）の
**Human Decision Packet** である。

Issue #19 所有の最小単位。
GOV-STAFF-01（異動・退職情報の確定者）の再 Decision ではない。
Agent が Entra mutation・削除手順・個人名を発明しない。
Implementation Start ではない。

Selection:
[`decision-gov-staff-02-entra-group-removal-operator-selection.md`](./decision-gov-staff-02-entra-group-removal-operator-selection.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-STAFF-02
Kind: Human Decision packet（narrow）
Status: Accepted / LOCKED / Option B
Owner: Issue #19
Selected via: Decision-GOV-STAFF-02-SELECTION-1
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation: NONE（Binding 推薦なし）
Human Selected Option: B（Microsoft 365管理者）
Option Acceptance: decision-gov-staff-02-entra-group-removal-operator-option-b-acceptance.md
Issue #19 design recommendation（non-binding）: B（≠ Human Acceptance evidence）
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-staff-02-entra-group-removal-operator-selection.md`](./decision-gov-staff-02-entra-group-removal-operator-selection.md)
- [`decision-issue-19-residual-governance-selection.md`](./decision-issue-19-residual-governance-selection.md)
- Issue #19 §A GOV-STAFF-02
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current canonical state

```text
GOV-AUD-01〜10 / GOV-RULE-05〜12: Accepted（該当分）
GOV-STAFF-01 confirmer: Accepted / LOCKED / Option C
  = 事業所管理者が起票し、法人担当が確定
GOV-STAFF-02 Entra group removal operator: Accepted / LOCKED / Option B
  = Microsoft 365管理者
GOV-STAFF-03〜12: OPEN / OUT
GOV-PERF: OPEN / OUT
SharePoint / M365 / Entra / Deploy: NO-GO
```

問い（本 packet）:

> Entra IDグループから削除する実施者は誰ですか？

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| GOV-STAFF-01 | 異動・退職情報の確定者 | **OUT**（Accepted / Option C） |
| **GOV-STAFF-02** | Entra IDグループから削除する実施者 | **本 packet** |
| GOV-STAFF-03 | 権限停止期限 | **OUT** |
| GOV-STAFF-04〜12 | 異動台帳・閲覧・資格 等 | **OUT** |
| Entra mutation 実行 | tenant 操作 | OUT / FORBIDDEN |
| Implementation | code / automation | HOLD |

```text
Entra 削除実施者 ≠ 異動・退職確定者（GOV-STAFF-01）
Entra 削除実施者 ≠ 権限停止期限（GOV-STAFF-03）
実施者を決める ≠ Entra mutation 実行認可
実施者を決める ≠ 削除手順 / 自動化の発明
```

## 3. Options（Issue #19 原文）

### Option A — 事業所管理者

```text
Meaning:
  Entra IDグループから削除する実施者 = 事業所管理者
```

### Option B — Microsoft 365管理者

```text
Meaning:
  Entra IDグループから削除する実施者 = Microsoft 365管理者

Does NOT mean:
  Entra / M365 mutation GO
  個人名確定
  GOV-STAFF-03〜12 を同時に決めた
```

### Option C — 開発担当

```text
Meaning:
  Entra IDグループから削除する実施者 = 開発担当
```

### Option D — その他（Human が明示）

```text
Requires:
  実施者の役割名または規則を Human が記入
Agent MUST NOT invent the role name
```

### Option H — まだ決めない / HOLD

```text
Meaning:
  GOV-STAFF-02 Option は未決のまま
  unit Selection は維持してよい
```

## 4. Explicit non-options

```text
GOV-STAFF-03〜12 の同時採択
Entra / M365 / SharePoint mutation 実行
削除手順・自動化・個人名の発明
GOV-STAFF-01 re-Decision
Implementation Start
FindingCode / A-5
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason:
  GOV-STAFF-02 は ORG_POLICY。
  Issue #19 の「設計上の推奨: B」は Binding ではない。
  Agent は Microsoft 365管理者を Binding 推薦値として確定しない。
```

Agent recommendation の欠如 / Issue 設計推奨は Human Acceptance evidence ではない。

## 6. Human Decision

```text
問:
  Entra IDグループから削除する実施者は誰ですか？

A. 事業所管理者
B. Microsoft 365管理者
C. 開発担当
D. その他（Human が明示）
H. まだ決めない / HOLD

答え: B（Accepted / LOCKED）
```

## 7. After Decision

| Selected | Next |
|---|---|
| **B** | **Option Acceptance LOCKED（本 Decision）**。Entra mutation / 実装は別 GO |
| A / C / D / H | NOT SELECTED |

維持:

```text
GOV-STAFF-03〜12: OUT / DO NOT START from this Decision alone
GOV-STAFF-01 / GOV-RULE-* / GOV-AUD-*: UNCHANGED
Entra / M365 mutation: NO-GO
Implementation Start: DO NOT START
next residual auto-select: FORBIDDEN
```

## Reference

- Selection: `decision-gov-staff-02-entra-group-removal-operator-selection.md`
- SELECT Acceptance: `decision-gov-staff-02-entra-group-removal-operator-acceptance.md`
- Option B Acceptance: `decision-gov-staff-02-entra-group-removal-operator-option-b-acceptance.md`
- Issue #19 GOV-STAFF-02 source options A–D
