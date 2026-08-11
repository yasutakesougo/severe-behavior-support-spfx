# Decision Packet — GOV-AUD-07 バックアップ・復元の一次責任者

この文書は、**GOV-AUD-07**（バックアップ・復元の一次責任者）の
**Human Decision Packet** である。

Issue #19 所有の最小単位。
GOV-AUD-08（復旧後確認）/ 09（再開承認）/ 10（連絡経路）ではない。
DEC-015（ledger ラベル）の自動 Accepted ではない。
Accepted（Option）ではない。
Agent が手順・ツール・保持期間を発明しない。
Implementation Start ではない。

Selection:
[`decision-gov-aud-07-backup-restore-owner-selection.md`](./decision-gov-aud-07-backup-restore-owner-selection.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-AUD-07
Kind: Human Decision packet（narrow）
Status: OPEN / Option NOT SELECTED
Owner: Issue #19
Selected via: Decision-GOV-AUD-07-SELECTION-1
Related ledger label: DEC-015（整合要；自動 Accepted しない）
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation: NONE（Binding 推薦なし）
Human Selected Option: NOT SELECTED
Issue #19 design recommendation（non-binding）: A
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-aud-07-backup-restore-owner-selection.md`](./decision-gov-aud-07-backup-restore-owner-selection.md)
- [`decision-issue-19-residual-governance-selection.md`](./decision-issue-19-residual-governance-selection.md)
- Issue #19 §C GOV-AUD-07
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current canonical state

```text
GOV-AUD-01〜06（該当 Accepted 分）: LOCKED / unrelated
GOV-AUD-07 primary backup/restore owner: UNDECIDED（本 packet）
GOV-AUD-08 post-recovery confirmer: OPEN / OUT
GOV-AUD-09 resume approver: OPEN / OUT
GOV-AUD-10 incident contact path: OPEN / OUT
DEC-015: OPEN / ledger alignment pending separate sync
SharePoint / M365 / Deploy: NO-GO
```

問い（本 packet）:

> バックアップ・復元の一次責任者は誰ですか？

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| **GOV-AUD-07** | バックアップ・復元の一次責任者 | **本 packet** |
| GOV-AUD-08 | 復旧後の業務確認者 | **OUT** |
| GOV-AUD-09 | 再開承認者 | **OUT** |
| GOV-AUD-10 | 重大障害時の連絡経路 | **OUT** |
| DEC-015 | ledger 上のバックアップ・復元責任者 | 整合要 / 自動 Accepted しない |
| バックアップ手順・頻度・保持 | 運用手順 | OUT |
| Implementation | code / tenant mutation | HOLD |

```text
一次責任者 ≠ 復旧後の業務確認者（GOV-AUD-08）
一次責任者 ≠ 再開承認者（GOV-AUD-09）
一次責任者を決める ≠ バックアップ機能の実装開始
一次責任者 ≠ 保持期間・完全削除方針（GOV-AUD-05/06）
```

## 3. Options（Issue #19 原文）

### Option A — Microsoft 365管理者

```text
Meaning:
  バックアップ・復元の一次責任者 = Microsoft 365管理者

Does NOT mean:
  GOV-AUD-08/09 を同時に決めた
  バックアップ自動化の実装 GO
  Entra / tenant mutation GO
```

### Option B — 開発担当

```text
Meaning:
  バックアップ・復元の一次責任者 = 開発担当

Does NOT mean:
  開発担当が業務再開承認者になる（GOV-AUD-09 OUT）
```

### Option C — 事業所管理者

```text
Meaning:
  バックアップ・復元の一次責任者 = 事業所管理者

Does NOT mean:
  事業所ごとに異なる技術バックアップ手順を本 Decision で設計した
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
  GOV-AUD-07 Option は未決のまま
  unit Selection は維持してよい
```

## 4. Explicit non-options

```text
GOV-AUD-08 / 09 / 10 の同時採択
DEC-015 の自動 Accepted
バックアップ手順・ツール・頻度・保持期間の発明
SharePoint / M365 / Deploy / real data
Implementation Start
FindingCode / A-5
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason:
  GOV-AUD-07 は ORG_POLICY。
  Issue #19 の「設計上の推奨: A」は Binding ではない。
  Agent は Microsoft 365管理者等を Binding 推薦値として確定しない。
```

Agent recommendation の欠如 / Issue 設計推奨は Human Acceptance evidence ではない。

## 6. Human Decision

```text
問:
  バックアップ・復元の一次責任者は誰ですか？

A. Microsoft 365管理者
B. 開発担当
C. 事業所管理者
D. その他（Human が明示）
H. まだ決めない / HOLD

答え: NOT SELECTED
```

## 7. After Decision

| Selected | Next |
|---|---|
| A–D | Option Acceptance → owner LOCKED。手順/実装は別 GO。DEC-015 sync は別 |
| H | Option HOLD。unit Selection は維持可 |

維持:

```text
GOV-AUD-08/09/10: OUT / DO NOT START from this Decision alone
DEC-015: NOT auto-Accepted
Implementation Start: DO NOT START
SharePoint / M365 / Deploy: NO-GO
next residual auto-select: FORBIDDEN
```

## Reference

- Selection: `decision-gov-aud-07-backup-restore-owner-selection.md`
- SELECT Acceptance: `decision-gov-aud-07-backup-restore-owner-acceptance.md`
- Issue #19 GOV-AUD-07 source options A–D
