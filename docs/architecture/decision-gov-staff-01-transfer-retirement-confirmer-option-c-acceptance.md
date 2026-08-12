# GOV-STAFF-01 — 異動・退職情報の確定者 Human Acceptance（Option C）

この文書は、**GOV-STAFF-01**（異動・退職情報の確定者）についての
**Option C Human Acceptance evidence** である。

Decision packet:
[`decision-gov-staff-01-transfer-retirement-confirmer-decision-packet.md`](./decision-gov-staff-01-transfer-retirement-confirmer-decision-packet.md)

Unit Selection:
[`decision-gov-staff-01-transfer-retirement-confirmer-selection.md`](./decision-gov-staff-01-transfer-retirement-confirmer-selection.md)
（同一 Draft PR；Decision-GOV-STAFF-01-SELECTION-1）

Owner: Issue #19

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-STAFF-01
Status: Accepted / LOCKED
Human Acceptance: Explicit Human Option C on 2026-08-12
Selected Option: C
Meaning:
  異動・退職情報の確定 =
    事業所管理者が起票し、法人担当が確定
Baseline tip: befd8460d03e2085583a328882d60f045916ea8f
PR: #274（Selection / Option C Acceptance / Packet sync / IR）

Does NOT mean:
  起票/確定 UI・ワークフロー・チェックリストの発明
  事業所管理者・法人担当の個人名を Agent が確定した
  GOV-STAFF-02〜12 の同時 SELECT または Accepted
  Entra ID / SharePoint / Microsoft 365 mutation GO
  Implementation Start / Deploy / real data

FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
next residual auto-select: FORBIDDEN
GOV-STAFF-02〜12 auto-SELECT: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit Human Option C on 2026-08-12
GOV-STAFF-01: Accepted / LOCKED
Selected Option: C

異動・退職情報の確定:
  事業所管理者が起票し、法人担当が確定
```

```text
Prior non-binding recommendation: C
  （Issue #19 設計上の推奨 / Recommended ≠ Binding）
Agent recommendation = NONE（≠ Human Acceptance evidence）
This document records the Human Decision「C」only.
Coincidence of design tip C and Human Option C ≠ tip-as-binding.
```

## Accepted 内容

```text
GOV-STAFF-01: Accepted / LOCKED
Selected: Option C

Transfer/retirement information confirmer:
  事業所管理者が起票し、法人担当が確定
```

日本語正本:

```text
異動・退職情報の確定:
  事業所管理者が起票し、法人担当が確定
```

意味:

- **異動・退職情報は、事業所管理者が起票し、法人担当が確定する**二段とする。
- 事業所管理者のみ（A）/ 法人の人事・管理担当のみ（B）/ その他（D）は本 Decision では採択しない。
- Entra 削除実施者（GOV-STAFF-02）・権限停止期限（GOV-STAFF-03）以降は別残件。
- 起票/確定 UI・ワークフロー・個人名・tenant 操作・実装は本 Acceptance だけでは開始しない。
- 「事業所管理者」「法人担当」の具体個人名・名簿は本 Acceptance では確定しない。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  起票/確定 UI / ワークフロー / チェックリストの発明
  事業所管理者・法人担当の個人名確定
  GOV-STAFF-02〜12 SELECT または Accepted
  Entra / SharePoint / M365 mutation
  FindingCode / A-5
  Issue #19 Close
  next residual auto-select
  Implementation Start / Deploy / real data
```

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| Decision-GOV-STAFF-01-SELECTION-1 | **UNCHANGED**（unit SELECTED / LOCKED；同一 PR） |
| GOV-AUD-01〜10 / GOV-RULE-05〜12 | **UNCHANGED** |
| GOV-STAFF-02〜12 | **OUT / NOT SELECTED** |
| Option A / B / D / H | **NOT SELECTED** |
| 異動 UI / Entra mutation | **HOLD / NOT STARTED** |
| FindingCode / A-5 / Implementation | **HOLD** |

## Next

```text
GOV-STAFF-01: Accepted / LOCKED / Option C
next residual SELECT（one item；Agent auto-advance FORBIDDEN）
Issue #19 Close: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
```

Agent は本 Acceptance を理由に UI 発明・Entra mutation・GOV-STAFF-02+ 自動 SELECT・次 residual 自動 SELECT へ進まない。
