# GOV-STAFF-02 — Entra IDグループから削除する実施者 Human Acceptance（Option B）

この文書は、**GOV-STAFF-02**（Entra IDグループから削除する実施者）についての
**Option B Human Acceptance evidence** である。

Decision packet:
[`decision-gov-staff-02-entra-group-removal-operator-decision-packet.md`](./decision-gov-staff-02-entra-group-removal-operator-decision-packet.md)

Unit Selection:
[`decision-gov-staff-02-entra-group-removal-operator-selection.md`](./decision-gov-staff-02-entra-group-removal-operator-selection.md)
（同一 Draft PR；Decision-GOV-STAFF-02-SELECTION-1）

Owner: Issue #19

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-STAFF-02
Status: Accepted / LOCKED
Human Acceptance: Explicit Human Option B on 2026-08-12
Selected Option: B
Meaning:
  Entra IDグループから削除する実施者 = Microsoft 365管理者
Baseline tip: 76563ce303c5ed4bd985c96d36d457257c18223f
PR: pending（Selection / Option B Acceptance / Packet sync / IR）

Does NOT mean:
  Entra ID / Microsoft 365 / SharePoint mutation GO
  削除手順・自動化・チェックリストの発明
  Microsoft 365管理者の個人名を Agent が確定した
  GOV-STAFF-01 の再 Decision / 上書き
  GOV-STAFF-03〜12 の同時 SELECT または Accepted
  Implementation Start / Deploy / real data

FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
next residual auto-select: FORBIDDEN
GOV-STAFF-03〜12 auto-SELECT: FORBIDDEN
Entra / M365 mutation: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit Human Option B on 2026-08-12
GOV-STAFF-02: Accepted / LOCKED
Selected Option: B

Entra IDグループから削除する実施者:
  Microsoft 365管理者
```

```text
Prior non-binding recommendation: B
  （Issue #19 設計上の推奨 / Recommended ≠ Binding）
Agent recommendation = NONE（≠ Human Acceptance evidence）
This document records the Human Decision「B」only.
Coincidence of design tip B and Human Option B ≠ tip-as-binding.
```

## Accepted 内容

```text
GOV-STAFF-02: Accepted / LOCKED
Selected: Option B

Entra ID group removal operator:
  Microsoft 365管理者
```

日本語正本:

```text
Entra IDグループから削除する実施者:
  Microsoft 365管理者
```

意味:

- **Entra IDグループからの削除実施者は Microsoft 365管理者**とする。
- 事業所管理者（A）/ 開発担当（C）/ その他（D）は本 Decision では採択しない。
- 役割分離: 異動・退職の確定（GOV-STAFF-01 Option C = 事業所管理者が起票し法人担当が確定）と、Entra 削除実施（本 Decision = Microsoft 365管理者）を混同しない。
- 権限停止期限（GOV-STAFF-03）以降は別残件。
- Entra / M365 mutation・削除手順・自動化・個人名・実装は本 Acceptance だけでは開始しない。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  Entra / M365 / SharePoint mutation
  削除手順 / 自動化 / チェックリストの発明
  Microsoft 365管理者の個人名確定
  GOV-STAFF-03〜12 SELECT または Accepted
  GOV-STAFF-01 re-Decision
  FindingCode / A-5
  Issue #19 Close
  next residual auto-select
  Implementation Start / Deploy / real data
```

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| Decision-GOV-STAFF-02-SELECTION-1 | **UNCHANGED**（unit SELECTED / LOCKED；同一 PR） |
| GOV-STAFF-01 | **UNCHANGED**（Accepted / Option C） |
| GOV-AUD-01〜10 / GOV-RULE-05〜12 | **UNCHANGED** |
| GOV-STAFF-03〜12 | **OUT / NOT SELECTED** |
| Option A / C / D / H | **NOT SELECTED** |
| Entra / M365 mutation | **HOLD / NOT STARTED / FORBIDDEN** |
| FindingCode / A-5 / Implementation | **HOLD** |

## Next

```text
GOV-STAFF-02: Accepted / LOCKED / Option B
next residual SELECT（one item；Agent auto-advance FORBIDDEN）
Issue #19 Close: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
Entra / M365 mutation: NOT AUTHORIZED
```

Agent は本 Acceptance を理由に Entra mutation・削除手順発明・GOV-STAFF-03+ 自動 SELECT・次 residual 自動 SELECT へ進まない。
