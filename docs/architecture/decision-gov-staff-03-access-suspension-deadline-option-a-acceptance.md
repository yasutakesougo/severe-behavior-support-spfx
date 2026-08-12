# GOV-STAFF-03 — 権限停止期限 Human Acceptance（Option A）

この文書は、**GOV-STAFF-03**（権限停止期限）についての
**Option A Human Acceptance evidence** である。

Decision packet:
[`decision-gov-staff-03-access-suspension-deadline-decision-packet.md`](./decision-gov-staff-03-access-suspension-deadline-decision-packet.md)

Unit Selection:
[`decision-gov-staff-03-access-suspension-deadline-selection.md`](./decision-gov-staff-03-access-suspension-deadline-selection.md)
（PR #276 MERGED）

Owner: Issue #19

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-STAFF-03
Status: Accepted / LOCKED
Human Acceptance: Explicit Human Option A on 2026-08-12
Selected Option: A
Meaning:
  権限停止期限 =
    異動・退職の発効日時までに権限停止
Baseline tip: 2f439bf6a8e72296ceafc5c0fc9340e3de918b29
PR: pending（Option A Acceptance / Packet sync / IR）
main mirror: NOT YET

Does NOT mean:
  権限停止自動化・ジョブ・日数変換の発明
  Entra ID / Microsoft 365 / SharePoint mutation GO
  GOV-STAFF-01 / 02 の再 Decision / 上書き
  GOV-STAFF-04〜12 の同時 SELECT または Accepted
  Implementation Start / Deploy / real data
  Issue #19 Close

FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD / NOT AUTHORIZED
Implementation auto-start: FORBIDDEN
next residual auto-select: FORBIDDEN
GOV-STAFF-04〜12: NOT SELECTED
Entra / M365 mutation: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit Human Option A on 2026-08-12
GOV-STAFF-03: Accepted / LOCKED
Selected Option: A

権限停止期限:
  異動・退職の発効日時までに権限停止
```

```text
Prior non-binding recommendation / tip: A
  （Issue #19 設計上の推奨 / SELECT-time SPECIFIED / NON-BINDING）
Agent recommendation = NONE（≠ Human Acceptance evidence）
This document records the Human Decision「A」only.
Coincidence of tip A and Human Option A ≠ tip-as-binding.
```

## Accepted 内容

```text
GOV-STAFF-03: Accepted / LOCKED
Selected: Option A

Access suspension deadline:
  異動・退職の発効日時までに権限停止
```

日本語正本:

```text
権限停止期限:
  異動・退職の発効日時までに権限停止
```

意味:

- **権限停止期限は、異動・退職の発効日時まで**とする。
- 発効日の当日中（B）/ 翌営業日まで（C）/ その他（D）は本 Decision では採択しない。
- 確定者（GOV-STAFF-01）・Entra 削除実施者（GOV-STAFF-02）は再 Decision しない。
- 権限停止自動化・Entra mutation・日数発明・実装は本 Acceptance だけでは開始しない。
- GOV-STAFF-04〜12 = NOT SELECTED。Issue #19 Close / Implementation Start = NOT AUTHORIZED。
- main mirror = NOT YET（本 Acceptance PR の Human Merge 後）。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  権限停止自動化 / ジョブ / 日数変換の発明
  Entra / M365 / SharePoint mutation
  GOV-STAFF-04〜12 SELECT または Accepted
  GOV-STAFF-01 / 02 re-Decision
  FindingCode / A-5
  Issue #19 Close
  next residual auto-select
  Implementation Start / Deploy / real data
```

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| Decision-GOV-STAFF-03-SELECTION-1 | **UNCHANGED**（unit SELECTED / LOCKED；PR #276 MERGED） |
| GOV-STAFF-01 | **UNCHANGED**（Accepted / Option C） |
| GOV-STAFF-02 | **UNCHANGED**（Accepted / Option B） |
| GOV-AUD-01〜10 / GOV-RULE-05〜12 | **UNCHANGED** |
| GOV-STAFF-04〜12 | **OUT / NOT SELECTED** |
| Option B / C / D / H | **NOT SELECTED** |
| Entra / M365 mutation | **HOLD / NOT STARTED / FORBIDDEN** |
| FindingCode / A-5 / Implementation | **HOLD** |

## Next

```text
GOV-STAFF-03: Accepted / LOCKED / Option A
main mirror: NOT YET（this Option A Acceptance PR）
next residual SELECT（one item；Agent auto-advance FORBIDDEN）
Issue #19 Close: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
Entra / M365 mutation: NOT AUTHORIZED
GOV-STAFF-04〜12: NOT SELECTED
```

Agent は本 Acceptance を理由に権限停止自動化・Entra mutation・GOV-STAFF-04+ 自動 SELECT・次 residual 自動 SELECT へ進まない。
