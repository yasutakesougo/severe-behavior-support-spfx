# Decision Packet — GOV-RULE-09 ルール内容の責任者

この文書は、**GOV-RULE-09**（ルール内容の責任者）の
**Human Decision Packet** である。

Issue #19 所有の最小単位。
GOV-RULE-10（変更承認）/ 11（境界）/ 12（訂正）ではない。
Agent がルール本文・制度値を発明しない。
Implementation Start ではない。

Selection:
[`decision-gov-rule-09-rule-content-owner-selection.md`](./decision-gov-rule-09-rule-content-owner-selection.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-RULE-09
Kind: Human Decision packet（narrow）
Status: Accepted / LOCKED / Option B
Owner: Issue #19
Selected via: Decision-GOV-RULE-09-SELECTION-1（PR #267 MERGED）
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation: NONE（Binding 推薦なし）
Human Selected Option: B（法人業務責任者）
Option Acceptance: decision-gov-rule-09-rule-content-owner-option-b-acceptance.md
Issue #19 design recommendation（non-binding）: B（≠ Human Acceptance evidence）
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-rule-09-rule-content-owner-selection.md`](./decision-gov-rule-09-rule-content-owner-selection.md)
- [`decision-issue-19-residual-governance-selection.md`](./decision-issue-19-residual-governance-selection.md)
- Issue #19 §B GOV-RULE-09
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current canonical state

```text
GOV-AUD-01〜10: Accepted / LOCKED（cycle complete）
GOV-RULE-05〜08: Accepted（該当分；08 = NOT ADOPTED）
GOV-RULE-09 rule content owner: Accepted / LOCKED / Option B = 法人業務責任者
GOV-RULE-10 change approver: Accepted / LOCKED / Option C（別 Decision；本 packet OUT）
GOV-RULE-11 / 12: OPEN / OUT
GOV-STAFF / GOV-PERF: OPEN / OUT
SharePoint / M365 / Deploy: NO-GO
```

問い（本 packet）:

> ルール内容の責任者は誰ですか？

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| **GOV-RULE-09** | ルール内容の責任者 | **本 packet** |
| GOV-RULE-10 | ルール変更の承認者 | **OUT** |
| GOV-RULE-11 | 制度値と法人運用値の境界 | **OUT** |
| GOV-RULE-12 | 過去ルール版の訂正 | **OUT** |
| GOV-RULE-05〜08 | 見直し基準日・周期・通知・due | **OUT**（Accepted） |
| ルール本文 / 制度値 | 内容そのもの | OUT |
| Implementation | code / tenant mutation | HOLD |

```text
内容責任者 ≠ 変更承認者（GOV-RULE-10）
内容責任者 ≠ 制度/運用境界（GOV-RULE-11）
内容責任者を決める ≠ ルール本文・日数・通知の発明
内容責任者 ≠ 見直し due/overdue（GOV-RULE-08）
```

## 3. Options（Issue #19 原文）

### Option A — 各事業所管理者

```text
Meaning:
  ルール内容の責任者 = 各事業所管理者

Does NOT mean:
  GOV-RULE-10 を同時に決めた
  事業所ごとに異なる制度値を本 Decision で設計した
```

### Option B — 法人業務責任者

```text
Meaning:
  ルール内容の責任者 = 法人業務責任者

Does NOT mean:
  GOV-RULE-10 を同時に決めた
  ルール本文・制度値の発明
```

### Option C — 開発担当

```text
Meaning:
  ルール内容の責任者 = 開発担当

Does NOT mean:
  Implementation Start / code 埋め込み GO
  GOV-RULE-10 を同時に決めた
```

### Option D — その他（Human が明示）

```text
Requires:
  責任者の役割名または規則を Human が記入
Agent MUST NOT invent the role name
```

### Option H — まだ決めない / HOLD

```text
Meaning:
  GOV-RULE-09 Option は未決のまま
  unit Selection は維持してよい
```

## 4. Explicit non-options

```text
GOV-RULE-10 / 11 / 12 の同時採択
GOV-STAFF / GOV-PERF の同時採択
ルール本文・制度値・日数・通知経路の発明
SharePoint / M365 / Deploy / real data
Implementation Start
FindingCode / A-5
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason:
  GOV-RULE-09 は ORG_POLICY。
  Issue #19 の「設計上の推奨: B」は Binding ではない。
  Agent は法人業務責任者を Binding 推薦値として確定しない。
```

Agent recommendation の欠如 / Issue 設計推奨は Human Acceptance evidence ではない。

## 6. Human Decision

```text
問:
  ルール内容の責任者は誰ですか？

A. 各事業所管理者
B. 法人業務責任者
C. 開発担当
D. その他（Human が明示）
H. まだ決めない / HOLD

答え: B（Accepted / LOCKED）
```

## 7. After Decision

| Selected | Next |
|---|---|
| **B** | **Option Acceptance LOCKED（本 Decision）**。ルール本文/実装は別 GO |
| A / C / D / H | NOT SELECTED |

維持:

```text
GOV-RULE-10/11/12: OUT / DO NOT START from this Decision alone
GOV-RULE-05〜08 / GOV-AUD-01〜10: UNCHANGED
Implementation Start: DO NOT START
SharePoint / M365 / Deploy: NO-GO
next residual auto-select: FORBIDDEN
```

## Reference

- Selection: `decision-gov-rule-09-rule-content-owner-selection.md`
- SELECT Acceptance: `decision-gov-rule-09-rule-content-owner-acceptance.md`
- Option B Acceptance: `decision-gov-rule-09-rule-content-owner-option-b-acceptance.md`
- Issue #19 GOV-RULE-09 source options A–D
