# GOV-STAFF-05 — 異動後の過去記録の閲覧範囲 Human Acceptance（Option C）

この文書は、**GOV-STAFF-05**（異動後の過去記録の閲覧範囲）についての
**Option C Human Acceptance evidence** である。

Decision packet:
[`decision-gov-staff-05-post-transfer-past-record-access-decision-packet.md`](./decision-gov-staff-05-post-transfer-past-record-access-decision-packet.md)

Unit Selection:
[`decision-gov-staff-05-post-transfer-past-record-access-selection.md`](./decision-gov-staff-05-post-transfer-past-record-access-selection.md)
（同一 Draft PR；Decision-GOV-STAFF-05-SELECTION-1）

Owner: Issue #19

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-STAFF-05
Status: Accepted / LOCKED
Human Acceptance: Explicit Human Option C on 2026-08-12
Selected Option: C
Meaning:
  異動後の過去記録の閲覧範囲 =
    記録時点の SiteId を維持し、
    異動先の閲覧は明示権限がある範囲だけ
Baseline tip: 4c014dd696e5dbdc38d75f7e601e551cafcdd635
PR: #279（Selection / Option C Acceptance / Packet sync / IR）

Does NOT mean:
  ACL / 権限付与 UI / SiteId マイグレーションの発明
  異動先への常時・包括閲覧許可
  GOV-STAFF-06〜12 の同時 SELECT または Accepted
  SharePoint / Microsoft 365 / Entra mutation GO
  Implementation Start / Deploy / real data

FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
next residual auto-select: FORBIDDEN
GOV-STAFF-06〜12 auto-SELECT: FORBIDDEN
SharePoint / M365 mutation: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit Human Option C on 2026-08-12
GOV-STAFF-05: Accepted / LOCKED
Selected Option: C

異動後の過去記録の閲覧範囲:
  記録時点の SiteId を維持し、
  異動先の閲覧は明示権限がある範囲だけ
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
GOV-STAFF-05: Accepted / LOCKED
Selected: Option C

Post-transfer past-record access:
  記録時点の SiteId を維持し、
  異動先の閲覧は明示権限がある範囲だけ
```

日本語正本:

```text
異動後の過去記録の閲覧範囲:
  記録時点の SiteId を維持し、
  異動先の閲覧は明示権限がある範囲だけ
```

意味:

- **過去記録は記録時点の `SiteId` を維持する**。
- **異動先による過去記録の閲覧は、明示権限がある範囲に限る**（常時閲覧ではない）。
- 異動元だけ（A）/ 異動先も常時閲覧（B）/ その他（D）は本 Decision では採択しない。
- 台帳保存先（GOV-STAFF-04）・資格関連（06+）は再 Decision しない。
- ACL・権限付与 UI・SiteId マイグレーション・tenant 操作・実装は本 Acceptance だけでは開始しない。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  ACL / 権限付与 UI / SiteId マイグレーションの発明
  異動先への常時・包括閲覧
  GOV-STAFF-06〜12 SELECT または Accepted
  GOV-STAFF-01〜04 re-Decision
  SharePoint / M365 / Entra mutation
  FindingCode / A-5
  Issue #19 Close
  next residual auto-select
  Implementation Start / Deploy / real data
```

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| Decision-GOV-STAFF-05-SELECTION-1 | **UNCHANGED**（unit SELECTED / LOCKED；同一 PR） |
| GOV-STAFF-01〜03 | **UNCHANGED** |
| GOV-STAFF-04 | **UNCHANGED**（Accepted / Option C） |
| GOV-AUD-01〜10 / GOV-RULE-05〜12 | **UNCHANGED** |
| GOV-STAFF-06 | **Accepted / LOCKED / Option B**（別 Decision；法人業務責任者） |
| GOV-STAFF-07〜12 | **OUT / NOT SELECTED** |
| Option A / B / D / H | **NOT SELECTED** |
| SharePoint / M365 mutation | **HOLD / NOT STARTED / FORBIDDEN** |
| FindingCode / A-5 / Implementation | **HOLD** |

## Next

```text
GOV-STAFF-05: Accepted / LOCKED / Option C
next residual = GOV-STAFF-06 Accepted / LOCKED / Option B（別 Decision）
Issue #19 Close: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
SharePoint / M365 mutation: NOT AUTHORIZED
GOV-STAFF-07〜12: NOT SELECTED
```

Agent は本 Acceptance を理由に ACL/SiteId 発明・包括閲覧許可・GOV-STAFF-06+ 自動 SELECT・次 residual 自動 SELECT へ進まない。
