# Decision Packet — GOV-AUD-10 重大障害時の連絡経路

この文書は、**GOV-AUD-10**（重大障害時の連絡経路）の
**Human Decision Packet** である。

Issue #19 所有の最小単位。
GOV-AUD-07 / 08 / 09 の再 Decision ではない。
Agent が連絡先・経路・個人名を発明しない。
Implementation Start ではない。

Selection:
[`decision-gov-aud-10-incident-contact-path-selection.md`](./decision-gov-aud-10-incident-contact-path-selection.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-AUD-10
Kind: Human Decision packet（narrow / fill-in）
Status: Accepted / LOCKED（fill-in / role names）
Owner: Issue #19
Selected via: Decision-GOV-AUD-10-SELECTION-1（PR #265 MERGED）
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation: NONE（Binding 推薦なし / 値の発明禁止）
Human Fill-in: Accepted（role names；Decision-GOV-AUD-10-FILL-IN-1）
Fill-in Acceptance: decision-gov-aud-10-incident-contact-path-fill-in-acceptance.md
Issue #19 design recommendation（non-binding）: prior role-name set（≠ Human Acceptance evidence）
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-aud-10-incident-contact-path-selection.md`](./decision-gov-aud-10-incident-contact-path-selection.md)
- [`decision-issue-19-residual-governance-selection.md`](./decision-issue-19-residual-governance-selection.md)
- Issue #19 §C GOV-AUD-10
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current canonical state

```text
GOV-AUD-01〜06（該当 Accepted 分）: LOCKED / unrelated
GOV-AUD-07 primary backup/restore owner: Accepted / LOCKED / Option A = Microsoft 365管理者
GOV-AUD-08 post-recovery confirmer: Accepted / LOCKED / Option B = 業務責任者または指定確認者
GOV-AUD-09 resume approver: Accepted / LOCKED / Option A = 事業所管理者
GOV-AUD-10 incident contact path: Accepted / LOCKED（fill-in / role names）
DEC-015: OPEN / ledger alignment pending separate sync（本 packet OUT）
SharePoint / M365 / Deploy: NO-GO
```

問い（本 packet）:

> 重大障害時の連絡経路を、Issue #19 原文の 5 項目で定めますか？

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| GOV-AUD-07 | バックアップ・復元の一次責任者 | **OUT**（Accepted / Option A） |
| GOV-AUD-08 | 復旧後の業務確認者 | **OUT**（Accepted / Option B） |
| GOV-AUD-09 | 再開承認者 | **OUT**（Accepted / Option A） |
| **GOV-AUD-10** | 重大障害時の連絡経路（5 項目） | **本 packet** |
| 障害対応手順書・SLA | 運用手順 | OUT |
| Implementation | code / tenant mutation | HOLD |

```text
連絡経路表 ≠ 技術復旧責任者（GOV-AUD-07）
連絡経路表 ≠ 業務確認者（GOV-AUD-08）
連絡経路表 ≠ 再開承認者ロール採択（GOV-AUD-09）
連絡経路を決める ≠ 通知実装 / オンコールシステム実装開始
```

## 3. Fill-in fields（Issue #19 原文）

Human が各項目を記入する。Agent は空欄を埋めない。

```text
第一報:
技術連絡:
業務連絡:
個人情報事故の連絡:
再開判断:
```

各項目の意味（枠のみ；値は Human 記入）:

| Field | Meaning（枠） | Does NOT mean |
|---|---|---|
| 第一報 | 重大障害を最初に上げる連絡先 / 経路 | 自動エスカレーション実装 GO |
| 技術連絡 | 技術面の連絡先 / 経路 | M365 tenant mutation GO |
| 業務連絡 | 業務面の連絡先 / 経路 | 業務確認者（GOV-AUD-08）の再 Decision |
| 個人情報事故の連絡 | 個人情報事故時の連絡先 / 経路 | 個人情報の実データ収集 |
| 再開判断 | 再開判断に関する連絡 / 判断経路 | 再開承認者（GOV-AUD-09）の再 Decision |

### Option H — まだ決めない / HOLD

```text
Meaning:
  GOV-AUD-10 fill-in は未決のまま
  unit Selection は維持してよい
```

## 4. Explicit non-options

```text
連絡先・個人名・電話番号・メール・チャット経路の Agent 発明
GOV-AUD-07 / 08 / 09 の再 Decision / 自動上書き
障害対応手順書の全文起草
SharePoint / M365 / Deploy / real data
Implementation Start
FindingCode / A-5
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason:
  GOV-AUD-10 は ORG_POLICY の fill-in。
  Issue #19 に設計上の推奨値は記載されていない。
  Agent は 5 項目のいずれも Binding 値として確定しない。
```

Agent recommendation の欠如は Human Acceptance evidence ではない。

## 6. Human Decision

```text
問:
  重大障害時の連絡経路（5 項目）を定めますか？

記入（Human Accepted）:
  第一報: 事業所管理者
  技術連絡: Microsoft 365管理者
  業務連絡: 業務責任者または指定確認者
  個人情報事故の連絡: 法人管理者
  再開判断: 事業所管理者

答え: Accepted / LOCKED（role names；Decision-GOV-AUD-10-FILL-IN-1）
```

## 7. After Decision

| Selected | Next |
|---|---|
| **5 項目 fill-in（role names）** | **Fill-in Acceptance LOCKED（本 Decision）**。個人連絡先/実装は別 GO |
| H | NOT SELECTED |

維持:

```text
GOV-AUD-07 / 08 / 09: UNCHANGED
DEC-015: NOT auto-Accepted
Implementation Start: DO NOT START
SharePoint / M365 / Deploy: NO-GO
next residual auto-select: FORBIDDEN
```

## Reference

- Selection: `decision-gov-aud-10-incident-contact-path-selection.md`
- SELECT Acceptance: `decision-gov-aud-10-incident-contact-path-acceptance.md`
- Fill-in Acceptance: `decision-gov-aud-10-incident-contact-path-fill-in-acceptance.md`
- Issue #19 GOV-AUD-10 source fill-in fields
