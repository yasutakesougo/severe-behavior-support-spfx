# GOV-AUD-10 — 重大障害時の連絡経路 Human Acceptance（Fill-in）

この文書は、**GOV-AUD-10**（重大障害時の連絡経路）についての
**5 項目 Fill-in Human Acceptance evidence** である。

Decision packet:
[`decision-gov-aud-10-incident-contact-path-decision-packet.md`](./decision-gov-aud-10-incident-contact-path-decision-packet.md)

Unit Selection:
[`decision-gov-aud-10-incident-contact-path-selection.md`](./decision-gov-aud-10-incident-contact-path-selection.md)
（PR #265 MERGED）

Owner: Issue #19

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-AUD-10-FILL-IN-1
Status: Accepted / LOCKED（fill-in）
Human Acceptance: Explicit ACCEPT GOV-AUD-10 fill-in on 2026-08-11
Parent unit Selection: Decision-GOV-AUD-10-SELECTION-1（UNCHANGED）
Baseline tip: 09a5da2f220bc747f7d99f08db3c214c24f2ba96
PR: pending（Fill-in Acceptance / Packet sync / IR）

Accepted values（role names only）:
  第一報: 事業所管理者
  技術連絡: Microsoft 365管理者
  業務連絡: 業務責任者または指定確認者
  個人情報事故の連絡: 法人管理者
  再開判断: 事業所管理者

Does NOT mean:
  個人名・電話番号・メール・Teams channel・distribution list の確定
  障害対応手順・チェックリストの発明
  GOV-AUD-07 / 08 / 09 の再 Decision / 上書き
  SharePoint / Microsoft 365 / Entra mutation GO
  Implementation Start / Deploy / real data

FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
next residual auto-select: FORBIDDEN
DEC-015 auto-Accepted: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit ACCEPT GOV-AUD-10 fill-in on 2026-08-11
Decision-GOV-AUD-10-FILL-IN-1: Accepted / LOCKED
GOV-AUD-10 unit Selection: UNCHANGED / REDECIDE しない

第一報: 事業所管理者
技術連絡: Microsoft 365管理者
業務連絡: 業務責任者または指定確認者
個人情報事故の連絡: 法人管理者
再開判断: 事業所管理者
```

```text
Prior non-binding recommendation: same 5 role-name values
  （Recommended / Binding = NONE → now Human Accepted）
Agent recommendation / design tip ≠ Human Acceptance evidence
This document records the Human Decision only.
Values are role names only — no personal contact details.
```

## Accepted 内容

```text
GOV-AUD-10: Accepted / LOCKED（fill-in）
Decision-GOV-AUD-10-FILL-IN-1: Accepted / LOCKED

Incident contact path（role names）:
  第一報 = 事業所管理者
  技術連絡 = Microsoft 365管理者
  業務連絡 = 業務責任者または指定確認者
  個人情報事故の連絡 = 法人管理者
  再開判断 = 事業所管理者
```

日本語正本:

```text
重大障害時の連絡経路:
  第一報: 事業所管理者
  技術連絡: Microsoft 365管理者
  業務連絡: 業務責任者または指定確認者
  個人情報事故の連絡: 法人管理者
  再開判断: 事業所管理者
```

意味:

- 連絡経路は **役割名** で固定する（個人名・電話・メールは本 Acceptance では定めない）。
- 既存 Accepted 役割との対応を維持する（再 Decision ではない）:
  - 技術連絡 ↔ GOV-AUD-07 Option A（Microsoft 365管理者）
  - 業務連絡 ↔ GOV-AUD-08 Option B（業務責任者または指定確認者）
  - 再開判断 ↔ GOV-AUD-09 Option A（事業所管理者）
- 第一報 = 事業所管理者、個人情報事故の連絡 = 法人管理者。
- 障害対応手順・通知実装・tenant 操作は本 Acceptance だけでは開始しない。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  個人名 / 電話 / メール / Teams / DL の確定
  障害対応手順 / チェックリストの発明
  GOV-AUD-07 / 08 / 09 re-Decision
  DEC-015 ledger Accepted
  SharePoint / M365 / Entra mutation
  FindingCode / A-5
  Issue #19 Close
  next residual auto-select
  Implementation Start / Deploy / real data
```

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| Decision-GOV-AUD-10-SELECTION-1 | **UNCHANGED**（unit SELECTED / LOCKED） |
| GOV-AUD-01〜06（該当 Accepted 分） | **UNCHANGED** |
| GOV-AUD-07 | **UNCHANGED**（Accepted / Option A） |
| GOV-AUD-08 | **UNCHANGED**（Accepted / Option B） |
| GOV-AUD-09 | **UNCHANGED**（Accepted / Option A） |
| DEC-015 | **NOT ACCEPTED** |
| 個人連絡先 / 手順書 / tenant mutation | **HOLD / NOT STARTED** |
| FindingCode / A-5 / Implementation | **HOLD** |
| next residual | **NOT SELECTED** |

## Next

```text
GOV-AUD-10: Accepted / LOCKED（fill-in / role names）
next residual SELECT（one item；Agent auto-advance FORBIDDEN）
Issue #19 Close: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
```

Agent は本 Acceptance を理由に個人連絡先発明・手順発明・tenant mutation・次 residual 自動 SELECT へ進まない。
