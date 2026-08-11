# Decision Packet — GOV-RULE-10 ルール変更の承認者

この文書は、**GOV-RULE-10**（ルール変更の承認者）の
**Human Decision Packet** である。

Issue #19 所有の最小単位。
GOV-RULE-09（内容責任者）の再 Decision ではない。
GOV-RULE-11（境界）/ 12（訂正）ではない。
Agent が承認フロー画面・ルール本文・制度値を発明しない。
Implementation Start ではない。

Selection:
[`decision-gov-rule-10-change-approver-selection.md`](./decision-gov-rule-10-change-approver-selection.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-RULE-10
Kind: Human Decision packet（narrow）
Status: Accepted / LOCKED / Option C
Owner: Issue #19
Selected via: Decision-GOV-RULE-10-SELECTION-1
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation: NONE（Binding 推薦なし）
Human Selected Option: C
  （業務責任者が内容確認し、法人管理者が承認）
Option Acceptance: decision-gov-rule-10-change-approver-option-c-acceptance.md
Issue #19 design recommendation（non-binding）: C（≠ Human Acceptance evidence）
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-rule-10-change-approver-selection.md`](./decision-gov-rule-10-change-approver-selection.md)
- [`decision-issue-19-residual-governance-selection.md`](./decision-issue-19-residual-governance-selection.md)
- Issue #19 §B GOV-RULE-10
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current canonical state

```text
GOV-AUD-01〜10: Accepted / LOCKED（cycle complete）
GOV-RULE-05〜08: Accepted（該当分；08 = NOT ADOPTED）
GOV-RULE-09 rule content owner: Accepted / LOCKED / Option B = 法人業務責任者
GOV-RULE-10 change approver: Accepted / LOCKED / Option C
  = 業務責任者が内容確認し、法人管理者が承認
GOV-RULE-11 / 12: OPEN / OUT
GOV-STAFF / GOV-PERF: OPEN / OUT
SharePoint / M365 / Deploy: NO-GO
```

問い（本 packet）:

> ルール変更の承認者は誰ですか？

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| GOV-RULE-09 | ルール内容の責任者 | **OUT**（Accepted / Option B） |
| **GOV-RULE-10** | ルール変更の承認者 | **本 packet** |
| GOV-RULE-11 | 制度値と法人運用値の境界 | **OUT** |
| GOV-RULE-12 | 過去ルール版の訂正 | **OUT** |
| GOV-RULE-05〜08 | 見直し基準日・周期・通知・due | **OUT**（Accepted） |
| 承認 UI / ワークフロー実装 | 画面・フロー | OUT |
| ルール本文 / 制度値 | 内容そのもの | OUT |
| Implementation | code / tenant mutation | HOLD |

```text
変更承認者 ≠ 内容責任者（GOV-RULE-09）
変更承認者 ≠ 制度/運用境界（GOV-RULE-11）
変更承認者を決める ≠ 承認画面・ワークフロー実装
変更承認者を決める ≠ ルール本文・日数・制度値の発明
```

## 3. Options（Issue #19 原文）

### Option A — 業務責任者のみ

```text
Meaning:
  ルール変更の承認者 = 業務責任者のみ

Does NOT mean:
  GOV-RULE-11 / 12 を同時に決めた
  承認 UI 実装 GO
```

### Option B — 法人管理者のみ

```text
Meaning:
  ルール変更の承認者 = 法人管理者のみ

Does NOT mean:
  GOV-RULE-11 / 12 を同時に決めた
  承認 UI 実装 GO
```

### Option C — 業務責任者が内容確認し、法人管理者が承認

```text
Meaning:
  ルール変更の承認:
    業務責任者が内容確認し、法人管理者が承認

Does NOT mean:
  承認フロー画面・ワークフローの発明
  業務責任者・法人管理者の個人名確定
  GOV-RULE-11 / 12 を同時に決めた
```

### Option D — その他（Human が明示）

```text
Requires:
  承認者の役割名または規則を Human が記入
Agent MUST NOT invent the role name
```

### Option H — まだ決めない / HOLD

```text
Meaning:
  GOV-RULE-10 Option は未決のまま
  unit Selection は維持してよい
```

## 4. Explicit non-options

```text
GOV-RULE-11 / 12 の同時採択
GOV-STAFF / GOV-PERF の同時採択
承認 UI / ワークフロー実装の発明
ルール本文・制度値・日数の発明
業務責任者・法人管理者の個人名確定
SharePoint / M365 / Deploy / real data
Implementation Start
FindingCode / A-5
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason:
  GOV-RULE-10 は ORG_POLICY。
  Issue #19 の「設計上の推奨: C」は Binding ではない。
  Agent は Option C を Binding 推薦値として確定しない。
```

Agent recommendation の欠如 / Issue 設計推奨は Human Acceptance evidence ではない。

## 6. Human Decision

```text
問:
  ルール変更の承認者は誰ですか？

A. 業務責任者のみ
B. 法人管理者のみ
C. 業務責任者が内容確認し、法人管理者が承認
D. その他（Human が明示）
H. まだ決めない / HOLD

答え: C（Accepted / LOCKED）
```

## 7. After Decision

| Selected | Next |
|---|---|
| **C** | **Option Acceptance LOCKED（本 Decision）**。承認 UI / 実装は別 GO |
| A / B / D / H | NOT SELECTED |

維持:

```text
GOV-RULE-11/12: OUT / DO NOT START from this Decision alone
GOV-RULE-05〜09 / GOV-AUD-01〜10: UNCHANGED
Implementation Start: DO NOT START
SharePoint / M365 / Deploy: NO-GO
next residual auto-select: FORBIDDEN
```

## Reference

- Selection: `decision-gov-rule-10-change-approver-selection.md`
- SELECT Acceptance: `decision-gov-rule-10-change-approver-acceptance.md`
- Option C Acceptance: `decision-gov-rule-10-change-approver-option-c-acceptance.md`
- Issue #19 GOV-RULE-10 source options A–D
