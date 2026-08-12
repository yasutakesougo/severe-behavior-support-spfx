# GOV-STAFF-06 — 資格・研修マスターの正本管理者 Human Acceptance（Option B）

この文書は、**GOV-STAFF-06**（資格・研修マスターの正本管理者）についての
**Option B Human Acceptance evidence** である。

Decision packet:
[`decision-gov-staff-06-qualification-training-master-owner-decision-packet.md`](./decision-gov-staff-06-qualification-training-master-owner-decision-packet.md)

Unit Selection:
[`decision-gov-staff-06-qualification-training-master-owner-selection.md`](./decision-gov-staff-06-qualification-training-master-owner-selection.md)
（同一 Draft PR；Decision-GOV-STAFF-06-SELECTION-1）

Owner: Issue #19

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-STAFF-06
Status: Accepted / LOCKED
Human Acceptance: Explicit Human Option B on 2026-08-12
Selected Option: B
Meaning:
  資格・研修マスターの正本管理者 = 法人業務責任者
Baseline tip: 28ab6c089c2e6383014c788f63c19601c14dcf9a
PR: #280（Selection / Option B Acceptance / Packet sync / IR）

Does NOT mean:
  マスター UI・名簿・個人名の発明
  GOV-STAFF-07（確認者）の同時 Accepted
  GOV-STAFF-07〜12 の同時 SELECT または Accepted
  SharePoint / Microsoft 365 / Entra mutation GO
  Implementation Start / Deploy / real data

FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
next residual auto-select: FORBIDDEN
GOV-STAFF-07〜12 auto-SELECT: FORBIDDEN
SharePoint / M365 mutation: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit Human Option B on 2026-08-12
GOV-STAFF-06: Accepted / LOCKED
Selected Option: B

資格・研修マスターの正本管理者:
  法人業務責任者
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
GOV-STAFF-06: Accepted / LOCKED
Selected: Option B

Qualification/training master owner:
  法人業務責任者
```

日本語正本:

```text
資格・研修マスターの正本管理者:
  法人業務責任者
```

意味:

- **資格・研修マスターの正本管理者は法人業務責任者**とする。
- 事業所管理者（A）/ Microsoft 365管理者（C）/ その他（D）は本 Decision では採択しない。
- 確認者（GOV-STAFF-07）・分母（08）以降は別残件。正本管理者 ≠ 確認者。
- マスター UI・名簿・法人業務責任者の個人名・tenant 操作・実装は本 Acceptance だけでは開始しない。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  マスター UI / 名簿 / 個人名の発明
  GOV-STAFF-07〜12 SELECT または Accepted
  GOV-STAFF-01〜05 re-Decision
  SharePoint / M365 / Entra mutation
  FindingCode / A-5
  Issue #19 Close
  next residual auto-select
  Implementation Start / Deploy / real data
```

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| Decision-GOV-STAFF-06-SELECTION-1 | **UNCHANGED**（unit SELECTED / LOCKED；同一 PR） |
| GOV-STAFF-01〜05 | **UNCHANGED** |
| GOV-AUD-01〜10 / GOV-RULE-05〜12 | **UNCHANGED** |
| GOV-STAFF-07〜12 | **OUT / NOT SELECTED** |
| Option A / C / D / H | **NOT SELECTED** |
| SharePoint / M365 mutation | **HOLD / NOT STARTED / FORBIDDEN** |
| FindingCode / A-5 / Implementation | **HOLD** |

## Next

```text
GOV-STAFF-06: Accepted / LOCKED / Option B
next residual SELECT（one item；Agent auto-advance FORBIDDEN）
Issue #19 Close: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
SharePoint / M365 mutation: NOT AUTHORIZED
GOV-STAFF-07〜12: NOT SELECTED
```

Agent は本 Acceptance を理由にマスター UI 発明・個人名確定・GOV-STAFF-07+ 自動 SELECT・次 residual 自動 SELECT へ進まない。
