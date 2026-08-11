# Decision Packet — GOV-AUD-09 再開承認者

この文書は、**GOV-AUD-09**（再開承認者）の
**Human Decision Packet** である。

Issue #19 所有の最小単位。
GOV-AUD-07（バックアップ・復元の一次責任者）/ GOV-AUD-08（復旧後の業務確認者）の再 Decision ではない。
GOV-AUD-10（連絡経路）ではない。
Agent が再開手順・承認フローを発明しない。
Implementation Start ではない。

Selection:
[`decision-gov-aud-09-resume-approver-selection.md`](./decision-gov-aud-09-resume-approver-selection.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-AUD-09
Kind: Human Decision packet（narrow）
Status: Accepted / LOCKED / Option A
Owner: Issue #19
Selected via: Decision-GOV-AUD-09-SELECTION-1（PR #263 MERGED）
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation: NONE（Binding 推薦なし）
Human Selected Option: A（事業所管理者）
Option Acceptance: decision-gov-aud-09-resume-approver-option-a-acceptance.md
Issue #19 design recommendation（non-binding）: NONE recorded（≠ Human Acceptance evidence）
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-aud-09-resume-approver-selection.md`](./decision-gov-aud-09-resume-approver-selection.md)
- [`decision-issue-19-residual-governance-selection.md`](./decision-issue-19-residual-governance-selection.md)
- Issue #19 §C GOV-AUD-09
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current canonical state

```text
GOV-AUD-01〜06（該当 Accepted 分）: LOCKED / unrelated
GOV-AUD-07 primary backup/restore owner: Accepted / LOCKED / Option A = Microsoft 365管理者
GOV-AUD-08 post-recovery confirmer: Accepted / LOCKED / Option B = 業務責任者または指定確認者
GOV-AUD-09 resume approver: Accepted / LOCKED / Option A = 事業所管理者
GOV-AUD-10 incident contact path: OPEN / OUT
DEC-015: OPEN / ledger alignment pending separate sync（本 packet OUT）
SharePoint / M365 / Deploy: NO-GO
```

問い（本 packet）:

> 再開承認者は誰ですか？

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| GOV-AUD-07 | バックアップ・復元の一次責任者 | **OUT**（Accepted / Option A） |
| GOV-AUD-08 | 復旧後の業務確認者 | **OUT**（Accepted / Option B） |
| **GOV-AUD-09** | 再開承認者 | **本 packet** |
| GOV-AUD-10 | 重大障害時の連絡経路 | **OUT** |
| 再開手順・承認フロー | 運用手順 | OUT |
| Implementation | code / tenant mutation | HOLD |

```text
再開承認者 ≠ バックアップ・復元の一次責任者（GOV-AUD-07）
再開承認者 ≠ 復旧後の業務確認者（GOV-AUD-08）
再開承認者を決める ≠ 再開手順 / 連絡経路の実装開始
再開承認者 ≠ 重大障害時の連絡経路（GOV-AUD-10）
```

## 3. Options（Issue #19 原文）

### Option A — 事業所管理者

```text
Meaning:
  再開承認者 = 事業所管理者

Does NOT mean:
  GOV-AUD-10 連絡経路を同時に決めた
  事業所ごとの再開手順を本 Decision で設計した
```

### Option B — 法人管理者

```text
Meaning:
  再開承認者 = 法人管理者

Does NOT mean:
  GOV-AUD-10 を同時に決めた
  法人規程の全文を本 Decision で起草した
```

### Option C — Microsoft 365管理者

```text
Meaning:
  再開承認者 = Microsoft 365管理者

Does NOT mean:
  GOV-AUD-07 技術復旧責任と再開承認を自動同一化した制度設計完了
  tenant mutation / 実装 GO
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
  GOV-AUD-09 Option は未決のまま
  unit Selection は維持してよい
```

## 4. Explicit non-options

```text
GOV-AUD-10 の同時採択
GOV-AUD-07 / 08 の再 Decision / 自動上書き
再開手順・承認フロー・連絡先の発明
SharePoint / M365 / Deploy / real data
Implementation Start
FindingCode / A-5
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason:
  GOV-AUD-09 は ORG_POLICY。
  Issue #19 に設計上の推奨は記載されていない。
  Agent は A/B/C を Binding 推薦値として確定しない。
```

Agent recommendation の欠如は Human Acceptance evidence ではない。

## 6. Human Decision

```text
問:
  再開承認者は誰ですか？

A. 事業所管理者
B. 法人管理者
C. Microsoft 365管理者
D. その他（Human が明示）
H. まだ決めない / HOLD

答え: A（Accepted / LOCKED）
```

## 7. After Decision

| Selected | Next |
|---|---|
| **A** | **Option Acceptance LOCKED（本 Decision）**。手順/実装は別 GO |
| B / C / D / H | NOT SELECTED |

維持:

```text
GOV-AUD-10: OUT / DO NOT START from this Decision alone
GOV-AUD-07 / 08: UNCHANGED
DEC-015: NOT auto-Accepted
Implementation Start: DO NOT START
SharePoint / M365 / Deploy: NO-GO
next residual auto-select: FORBIDDEN
```

## Reference

- Selection: `decision-gov-aud-09-resume-approver-selection.md`
- SELECT Acceptance: `decision-gov-aud-09-resume-approver-acceptance.md`
- Option A Acceptance: `decision-gov-aud-09-resume-approver-option-a-acceptance.md`
- Issue #19 GOV-AUD-09 source options A–D
