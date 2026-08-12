# GOV-RULE-12 — 過去ルール版の訂正 Human Acceptance（Option B）

この文書は、**GOV-RULE-12**（過去ルール版の訂正）についての
**Option B Human Acceptance evidence** である。

Decision packet:
[`decision-gov-rule-12-version-correction-decision-packet.md`](./decision-gov-rule-12-version-correction-decision-packet.md)

Unit Selection:
[`decision-gov-rule-12-version-correction-selection.md`](./decision-gov-rule-12-version-correction-selection.md)
（PR #272 MERGED）

Owner: Issue #19

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-RULE-12
Status: Accepted / LOCKED
Human Acceptance: Explicit Human Option B on 2026-08-12
Selected Option: B
Meaning:
  過去ルール版の訂正 =
    訂正版を新規作成し、旧版を保持
Baseline tip: f74eb8e981230b7eb2679e33d450d25e22125940
PR: #273（Option B Acceptance / Packet sync / IR）

Does NOT mean:
  訂正 UI・版管理スキーマ・監査ログ実装の発明
  GOV-RULE-09 / 10 / 11 の再 Decision / 上書き
  SharePoint / Microsoft 365 / Entra mutation GO
  Implementation Start / Deploy / real data

FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
next residual auto-select: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit Human Option B on 2026-08-12
GOV-RULE-12: Accepted / LOCKED
Selected Option: B

過去ルール版の訂正:
  訂正版を新規作成し、旧版を保持
```

```text
Prior non-binding recommendation / tip: B
  （Issue #19 設計上の推奨 / SELECT-time SPECIFIED / NON-BINDING）
Agent recommendation = NONE（≠ Human Acceptance evidence）
This document records the Human Decision「B」only.
Coincidence of tip B and Human Option B ≠ tip-as-binding.
```

## Accepted 内容

```text
GOV-RULE-12: Accepted / LOCKED
Selected: Option B

Past rule-version correction:
  訂正版を新規作成し、旧版を保持
```

日本語正本:

```text
過去ルール版の訂正:
  訂正版を新規作成し、旧版を保持
```

意味:

- **過去ルール版を訂正するときは、訂正版を新規作成し、旧版を保持する**。
- 既存版を上書き（A）/ 過去版は訂正不可（C）/ その他（D）は本 Decision では採択しない。
- 内容責任者（GOV-RULE-09）・変更承認（GOV-RULE-10）・制度/運用境界（GOV-RULE-11）は再 Decision しない。
- 訂正 UI・版管理スキーマ・監査ログ・tenant 操作・実装は本 Acceptance だけでは開始しない。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  訂正 UI / 版管理スキーマ / 監査ログ実装の発明
  GOV-RULE-09 / 10 / 11 re-Decision
  SharePoint / M365 / Entra mutation
  FindingCode / A-5
  Issue #19 Close
  next residual auto-select
  Implementation Start / Deploy / real data
```

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| Decision-GOV-RULE-12-SELECTION-1 | **UNCHANGED**（unit SELECTED / LOCKED） |
| GOV-AUD-01〜10（該当 Accepted 分） | **UNCHANGED** |
| GOV-RULE-05〜08 | **UNCHANGED** |
| GOV-RULE-09 | **UNCHANGED**（Accepted / Option B） |
| GOV-RULE-10 | **UNCHANGED**（Accepted / Option C） |
| GOV-RULE-11 | **UNCHANGED**（Accepted / fill-in） |
| Option A / C / D / H | **NOT SELECTED** |
| 訂正 UI / tenant mutation | **HOLD / NOT STARTED** |
| FindingCode / A-5 / Implementation | **HOLD** |

## Next

```text
GOV-RULE-12: Accepted / LOCKED / Option B
next residual = GOV-STAFF-01 Accepted / LOCKED / Option C（別 Decision）
Issue #19 Close: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
```

Agent は本 Acceptance を理由に訂正 UI 発明・tenant mutation・次 residual 自動 SELECT へ進まない。
