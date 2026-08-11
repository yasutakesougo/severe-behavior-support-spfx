# Decision Packet — GOV-AUD-08 復旧後の業務確認者

この文書は、**GOV-AUD-08**（復旧後の業務確認者）の
**Human Decision Packet** である。

Issue #19 所有の最小単位。
GOV-AUD-07（バックアップ・復元の一次責任者）の再 Decision ではない。
GOV-AUD-09（再開承認）/ 10（連絡経路）ではない。
Agent が確認手順・再開条件を発明しない。
Implementation Start ではない。

Selection:
[`decision-gov-aud-08-post-recovery-confirmer-selection.md`](./decision-gov-aud-08-post-recovery-confirmer-selection.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-AUD-08
Kind: Human Decision packet（narrow）
Status: Accepted / LOCKED / Option B
Owner: Issue #19
Selected via: Decision-GOV-AUD-08-SELECTION-1（PR #261 MERGED）
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation: NONE（Binding 推薦なし）
Human Selected Option: B（業務責任者または指定確認者）
Option Acceptance: decision-gov-aud-08-post-recovery-confirmer-option-b-acceptance.md
Issue #19 design recommendation（non-binding）: B または C（≠ Human Acceptance evidence）
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-aud-08-post-recovery-confirmer-selection.md`](./decision-gov-aud-08-post-recovery-confirmer-selection.md)
- [`decision-issue-19-residual-governance-selection.md`](./decision-issue-19-residual-governance-selection.md)
- Issue #19 §C GOV-AUD-08
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current canonical state

```text
GOV-AUD-01〜06（該当 Accepted 分）: LOCKED / unrelated
GOV-AUD-07 primary backup/restore owner: Accepted / LOCKED / Option A = Microsoft 365管理者
GOV-AUD-08 post-recovery confirmer: Accepted / LOCKED / Option B = 業務責任者または指定確認者
GOV-AUD-09 resume approver: OPEN / OUT
GOV-AUD-10 incident contact path: OPEN / OUT
DEC-015: OPEN / ledger alignment pending separate sync（本 packet OUT）
SharePoint / M365 / Deploy: NO-GO
```

問い（本 packet）:

> 復旧後の業務確認者は誰ですか？

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| GOV-AUD-07 | バックアップ・復元の一次責任者 | **OUT**（Accepted / Option A） |
| **GOV-AUD-08** | 復旧後の業務確認者 | **本 packet** |
| GOV-AUD-09 | 再開承認者 | **OUT** |
| GOV-AUD-10 | 重大障害時の連絡経路 | **OUT** |
| 確認手順・チェックリスト | 運用手順 | OUT |
| Implementation | code / tenant mutation | HOLD |

```text
復旧後の業務確認者 ≠ バックアップ・復元の一次責任者（GOV-AUD-07）
復旧後の業務確認者 ≠ 再開承認者（GOV-AUD-09）
確認者を決める ≠ 復旧 / 再開手順の実装開始
確認者 ≠ 重大障害時の連絡経路（GOV-AUD-10）
```

## 3. Options（Issue #19 原文）

### Option A — 復旧実施者と同一人物

```text
Meaning:
  復旧後の業務確認者 = 復旧実施者と同一人物

Does NOT mean:
  GOV-AUD-09 再開承認者を同時に決めた
  復旧自動化の実装 GO
  分離原則の法人規程を本 Decision で上書きした
```

### Option B — 業務責任者または指定確認者

```text
Meaning:
  復旧後の業務確認者 = 業務責任者または指定確認者

Does NOT mean:
  「指定確認者」の個人名を Agent が発明した
  GOV-AUD-09 を同時に決めた
```

### Option C — 事業所管理者

```text
Meaning:
  復旧後の業務確認者 = 事業所管理者

Does NOT mean:
  事業所ごとに異なる確認手順を本 Decision で設計した
  GOV-AUD-09 を同時に決めた
```

### Option D — その他（Human が明示）

```text
Requires:
  確認者の役割名または規則を Human が記入
Agent MUST NOT invent the role name
```

### Option H — まだ決めない / HOLD

```text
Meaning:
  GOV-AUD-08 Option は未決のまま
  unit Selection は維持してよい
```

## 4. Explicit non-options

```text
GOV-AUD-09 / 10 の同時採択
GOV-AUD-07 の再 Decision / 自動上書き
DEC-015 の自動 Accepted
復旧確認手順・チェックリスト・再開条件の発明
SharePoint / M365 / Deploy / real data
Implementation Start
FindingCode / A-5
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason:
  GOV-AUD-08 は ORG_POLICY。
  Issue #19 の「設計上の推奨: BまたはC。復旧実施者とは分離する。」は Binding ではない。
  Agent は B/C を Binding 推薦値として確定しない。
```

Agent recommendation の欠如 / Issue 設計推奨は Human Acceptance evidence ではない。

## 6. Human Decision

```text
問:
  復旧後の業務確認者は誰ですか？

A. 復旧実施者と同一人物
B. 業務責任者または指定確認者
C. 事業所管理者
D. その他（Human が明示）
H. まだ決めない / HOLD

答え: B（Accepted / LOCKED）
```

## 7. After Decision

| Selected | Next |
|---|---|
| **B** | **Option Acceptance LOCKED（本 Decision）**。手順/実装は別 GO |
| A / C / D / H | NOT SELECTED |

維持:

```text
GOV-AUD-09/10: OUT / DO NOT START from this Decision alone
GOV-AUD-07: UNCHANGED（Accepted / Option A）
DEC-015: NOT auto-Accepted
Implementation Start: DO NOT START
SharePoint / M365 / Deploy: NO-GO
next residual auto-select: FORBIDDEN
```

## Reference

- Selection: `decision-gov-aud-08-post-recovery-confirmer-selection.md`
- SELECT Acceptance: `decision-gov-aud-08-post-recovery-confirmer-acceptance.md`
- Option B Acceptance: `decision-gov-aud-08-post-recovery-confirmer-option-b-acceptance.md`
- Issue #19 GOV-AUD-08 source options A–D
