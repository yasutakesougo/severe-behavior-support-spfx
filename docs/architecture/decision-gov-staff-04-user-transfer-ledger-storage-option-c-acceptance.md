# GOV-STAFF-04 — 利用者異動台帳の保存先 Human Acceptance（Option C）

この文書は、**GOV-STAFF-04**（利用者異動台帳の保存先）についての
**Option C Human Acceptance evidence** である。

Decision packet:
[`decision-gov-staff-04-user-transfer-ledger-storage-decision-packet.md`](./decision-gov-staff-04-user-transfer-ledger-storage-decision-packet.md)

Unit Selection:
[`decision-gov-staff-04-user-transfer-ledger-storage-selection.md`](./decision-gov-staff-04-user-transfer-ledger-storage-selection.md)
（同一 Draft PR；Decision-GOV-STAFF-04-SELECTION-1）

Owner: Issue #19

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-STAFF-04
Status: Accepted / LOCKED
Human Acceptance: Explicit Human Option C on 2026-08-12
Selected Option: C
Meaning:
  利用者異動台帳の保存先 =
    専用の法人共通台帳。支援内容は保存しない
Baseline tip: 46160fc524d9b13eb37a680d29017545b81cfeea
PR: pending（Selection / Option C Acceptance / Packet sync / IR）

Does NOT mean:
  SharePoint サイト・リスト・台帳スキーマの発明
  支援記録・観察・計画本文を台帳へ保存することを許可した
  GOV-STAFF-05〜12 の同時 SELECT または Accepted
  SharePoint / Microsoft 365 / Entra mutation GO
  Implementation Start / Deploy / real data

FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
next residual auto-select: FORBIDDEN
GOV-STAFF-05〜12 auto-SELECT: FORBIDDEN
SharePoint / M365 mutation: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit Human Option C on 2026-08-12
GOV-STAFF-04: Accepted / LOCKED
Selected Option: C

利用者異動台帳の保存先:
  専用の法人共通台帳。支援内容は保存しない
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
GOV-STAFF-04: Accepted / LOCKED
Selected: Option C

User-transfer ledger storage:
  専用の法人共通台帳。支援内容は保存しない
```

日本語正本:

```text
利用者異動台帳の保存先:
  専用の法人共通台帳。支援内容は保存しない
```

意味:

- **利用者異動台帳は、専用の法人共通台帳に保存し、支援内容は保存しない**。
- 法人共通サイト一般（A）/ 異動元・異動先の両サイト（B）/ その他（D）は本 Decision では採択しない。
- 確定者（01）・Entra 削除実施者（02）・権限停止期限（03）・閲覧範囲（05）は再 Decision しない。
- 「専用の法人共通台帳」のサイト URL・リスト名・スキーマ・tenant 操作・実装は本 Acceptance だけでは開始しない。
- 支援内容（支援記録・観察・計画本文等）を当該台帳へ保存することは本 Decision では許可しない。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  SharePoint サイト / リスト / 台帳スキーマの発明
  支援内容の台帳保存
  GOV-STAFF-05〜12 SELECT または Accepted
  GOV-STAFF-01〜03 re-Decision
  SharePoint / M365 / Entra mutation
  FindingCode / A-5
  Issue #19 Close
  next residual auto-select
  Implementation Start / Deploy / real data
```

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| Decision-GOV-STAFF-04-SELECTION-1 | **UNCHANGED**（unit SELECTED / LOCKED；同一 PR） |
| GOV-STAFF-01 | **UNCHANGED**（Accepted / Option C） |
| GOV-STAFF-02 | **UNCHANGED**（Accepted / Option B） |
| GOV-STAFF-03 | **UNCHANGED**（Accepted / Option A） |
| GOV-AUD-01〜10 / GOV-RULE-05〜12 | **UNCHANGED** |
| GOV-STAFF-05〜12 | **OUT / NOT SELECTED** |
| Option A / B / D / H | **NOT SELECTED** |
| SharePoint / M365 mutation | **HOLD / NOT STARTED / FORBIDDEN** |
| FindingCode / A-5 / Implementation | **HOLD** |

## Next

```text
GOV-STAFF-04: Accepted / LOCKED / Option C
next residual SELECT（one item；Agent auto-advance FORBIDDEN）
Issue #19 Close: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
SharePoint / M365 mutation: NOT AUTHORIZED
GOV-STAFF-05〜12: NOT SELECTED
```

Agent は本 Acceptance を理由にサイト/リスト発明・支援内容保存・GOV-STAFF-05+ 自動 SELECT・次 residual 自動 SELECT へ進まない。
