# Decision Packet — GOV-STAFF-01 異動・退職情報の確定者

この文書は、**GOV-STAFF-01**（異動・退職情報の確定者）の
**Human Decision Packet** である。

Issue #19 所有の最小単位。
GOV-STAFF-02（Entra IDグループから削除する実施者）ではない。
Agent が異動フロー画面・Entra mutation・個人名を発明しない。
Implementation Start ではない。

Selection:
[`decision-gov-staff-01-transfer-retirement-confirmer-selection.md`](./decision-gov-staff-01-transfer-retirement-confirmer-selection.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-STAFF-01
Kind: Human Decision packet（narrow）
Status: Accepted / LOCKED / Option C
Owner: Issue #19
Selected via: Decision-GOV-STAFF-01-SELECTION-1
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation: NONE（Binding 推薦なし）
Human Selected Option: C
  （事業所管理者が起票し、法人担当が確定）
Option Acceptance: decision-gov-staff-01-transfer-retirement-confirmer-option-c-acceptance.md
Issue #19 design recommendation（non-binding）: C（≠ Human Acceptance evidence）
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-staff-01-transfer-retirement-confirmer-selection.md`](./decision-gov-staff-01-transfer-retirement-confirmer-selection.md)
- [`decision-issue-19-residual-governance-selection.md`](./decision-issue-19-residual-governance-selection.md)
- Issue #19 §A GOV-STAFF-01
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current canonical state

```text
GOV-AUD-01〜10: Accepted / LOCKED（cycle complete）
GOV-RULE-05〜12: Accepted（該当分）
GOV-STAFF-01 transfer/retirement confirmer: Accepted / LOCKED / Option C
  = 事業所管理者が起票し、法人担当が確定
GOV-STAFF-02〜12: OPEN / OUT
GOV-PERF: OPEN / OUT
SharePoint / M365 / Deploy: NO-GO
```

問い（本 packet）:

> 異動・退職情報の確定者は誰ですか？

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| **GOV-STAFF-01** | 異動・退職情報の確定者 | **本 packet** |
| GOV-STAFF-02 | Entra IDグループから削除する実施者 | **OUT** |
| GOV-STAFF-03 | 権限停止期限 | **OUT** |
| GOV-STAFF-04〜12 | 異動台帳・閲覧・資格 等 | **OUT** |
| 異動 UI / Entra mutation | 画面・tenant 操作 | OUT |
| Implementation | code / tenant mutation | HOLD |

```text
確定者 ≠ Entra 削除実施者（GOV-STAFF-02）
確定者 ≠ 権限停止期限（GOV-STAFF-03）
確定者を決める ≠ 異動画面・Entra mutation 実装開始
確定者を決める ≠ 個人名の発明
```

## 3. Options（Issue #19 原文）

### Option A — 事業所管理者

```text
Meaning:
  異動・退職情報の確定者 = 事業所管理者

Does NOT mean:
  GOV-STAFF-02 を同時に決めた
  Entra mutation GO
```

### Option B — 法人の人事・管理担当

```text
Meaning:
  異動・退職情報の確定者 = 法人の人事・管理担当

Does NOT mean:
  GOV-STAFF-02 を同時に決めた
```

### Option C — 事業所管理者が起票し、法人担当が確定

```text
Meaning:
  異動・退職情報の確定:
    事業所管理者が起票し、法人担当が確定

Does NOT mean:
  起票/確定 UI・ワークフローの発明
  事業所管理者・法人担当の個人名確定
  GOV-STAFF-02〜12 を同時に決めた
```

### Option D — その他（Human が明示）

```text
Requires:
  確定者の役割名または規則を Human が記入
Agent MUST NOT invent the role name
```

### Option H — まだ決めない / HOLD

```text
Meaning:
  GOV-STAFF-01 Option は未決のまま
  unit Selection は維持してよい
```

## 4. Explicit non-options

```text
GOV-STAFF-02〜12 の同時採択
GOV-PERF の同時採択
異動 UI / Entra mutation / ワークフロー実装の発明
個人名の確定
SharePoint / M365 / Deploy / real data
Implementation Start
FindingCode / A-5
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason:
  GOV-STAFF-01 は ORG_POLICY。
  Issue #19 の「設計上の推奨: C」は Binding ではない。
  Agent は Option C を Binding 推薦値として確定しない。
```

Agent recommendation の欠如 / Issue 設計推奨は Human Acceptance evidence ではない。

## 6. Human Decision

```text
問:
  異動・退職情報の確定者は誰ですか？

A. 事業所管理者
B. 法人の人事・管理担当
C. 事業所管理者が起票し、法人担当が確定
D. その他（Human が明示）
H. まだ決めない / HOLD

答え: C（Accepted / LOCKED）
```

## 7. After Decision

| Selected | Next |
|---|---|
| **C** | **Option Acceptance LOCKED（本 Decision）**。UI / 実装は別 GO |
| A / B / D / H | NOT SELECTED |

維持:

```text
GOV-STAFF-02〜12: OUT / DO NOT START from this Decision alone
GOV-RULE-* / GOV-AUD-*: UNCHANGED
Implementation Start: DO NOT START
SharePoint / M365 / Deploy: NO-GO
next residual auto-select: FORBIDDEN
```

## Reference

- Selection: `decision-gov-staff-01-transfer-retirement-confirmer-selection.md`
- SELECT Acceptance: `decision-gov-staff-01-transfer-retirement-confirmer-acceptance.md`
- Option C Acceptance: `decision-gov-staff-01-transfer-retirement-confirmer-option-c-acceptance.md`
- Issue #19 GOV-STAFF-01 source options A–D
