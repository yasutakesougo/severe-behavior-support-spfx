# Decision Packet — GOV-STAFF-03 権限停止期限

この文書は、**GOV-STAFF-03**（権限停止期限）の
**Human Decision Packet** である。

Issue #19 所有の最小単位。
GOV-STAFF-01 / 02 の再 Decision ではない。
Agent が権限停止自動化・Entra mutation・日数を発明しない。
Implementation Start ではない。

Selection:
[`decision-gov-staff-03-access-suspension-deadline-selection.md`](./decision-gov-staff-03-access-suspension-deadline-selection.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-STAFF-03
Kind: Human Decision packet（narrow）
Status: Accepted / LOCKED / Option A
Owner: Issue #19
Selected via: Decision-GOV-STAFF-03-SELECTION-1（PR #276 MERGED）
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation: NONE（Binding 推薦なし）
Human Selected Option: A（異動・退職の発効日時までに権限停止）
Option Acceptance: decision-gov-staff-03-access-suspension-deadline-option-a-acceptance.md
Issue #19 design recommendation（non-binding）: A（≠ Human Acceptance evidence）
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-staff-03-access-suspension-deadline-selection.md`](./decision-gov-staff-03-access-suspension-deadline-selection.md)
- [`decision-issue-19-residual-governance-selection.md`](./decision-issue-19-residual-governance-selection.md)
- Issue #19 §A GOV-STAFF-03
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current canonical state

```text
GOV-STAFF-01 confirmer: Accepted / LOCKED / Option C
GOV-STAFF-02 Entra removal operator: Accepted / LOCKED / Option B
GOV-STAFF-03 access suspension deadline: Accepted / LOCKED / Option A
  = 異動・退職の発効日時までに権限停止
GOV-STAFF-04〜12: OPEN / OUT
SharePoint / M365 / Entra / Deploy: NO-GO
```

問い（本 packet）:

> 権限停止期限はいつまでですか？

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| GOV-STAFF-01 | 異動・退職情報の確定者 | **OUT**（Accepted） |
| GOV-STAFF-02 | Entra IDグループから削除する実施者 | **OUT**（Accepted） |
| **GOV-STAFF-03** | 権限停止期限 | **本 packet** |
| GOV-STAFF-04〜12 | 異動台帳・閲覧・資格 等 | **OUT** |
| Entra mutation 実行 | tenant 操作 | OUT / FORBIDDEN |
| Implementation | code / automation | HOLD |

```text
権限停止期限 ≠ 確定者（GOV-STAFF-01）
権限停止期限 ≠ Entra 削除実施者（GOV-STAFF-02）
期限を決める ≠ Entra mutation 実行認可
期限を決める ≠ 自動化・ジョブ実装開始
```

## 3. Options（Issue #19 原文）

### Option A — 異動・退職の発効日時まで

```text
Meaning:
  権限停止期限 = 異動・退職の発効日時まで
```

### Option B — 発効日の当日中

```text
Meaning:
  権限停止期限 = 発効日の当日中
```

### Option C — 翌営業日まで

```text
Meaning:
  権限停止期限 = 翌営業日まで
```

### Option D — その他（Human が明示）

```text
Requires:
  期限規則を Human が記入
Agent MUST NOT invent the deadline rule
```

### Option H — まだ決めない / HOLD

```text
Meaning:
  GOV-STAFF-03 Option は未決のまま
  unit Selection は維持してよい
```

## 4. Explicit non-options

```text
Option tip A の自動 Accepted
GOV-STAFF-04〜12 の同時採択
Entra / M365 mutation 実行
権限停止自動化・日数の発明
SharePoint / M365 / Deploy / real data
Implementation Start
FindingCode / A-5
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason:
  GOV-STAFF-03 は ORG_POLICY。
  Issue #19 の「設計上の推奨: A」は Binding ではない。
  Agent は発効日時までを Binding 推薦値として確定しない。
```

Agent recommendation の欠如 / Issue 設計推奨は Human Acceptance evidence ではない。

## 6. Human Decision

```text
問:
  権限停止期限はいつまでですか？

A. 異動・退職の発効日時まで
B. 発効日の当日中
C. 翌営業日まで
D. その他（Human が明示）
H. まだ決めない / HOLD

答え: A（Accepted / LOCKED）
```

## 7. After Decision

| Selected | Next |
|---|---|
| **A** | **Option Acceptance LOCKED（本 Decision）**。実装 / Entra mutation は別 GO |
| B / C / D / H | NOT SELECTED |

維持:

```text
GOV-STAFF-01 / 02: UNCHANGED
GOV-STAFF-04〜12: OUT / DO NOT START from this Decision alone
Entra / M365 mutation: NO-GO
Implementation Start: DO NOT START
next residual auto-select: FORBIDDEN
```

## Reference

- Selection: `decision-gov-staff-03-access-suspension-deadline-selection.md`
- SELECT Acceptance: `decision-gov-staff-03-access-suspension-deadline-acceptance.md`
- Option A Acceptance: `decision-gov-staff-03-access-suspension-deadline-option-a-acceptance.md`
- Issue #19 GOV-STAFF-03 source options A–D
