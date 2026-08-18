# DEC-003 — 点数根拠の登録・最終確認ロール Human Acceptance

この文書は、**DEC-003 org roles**（点数根拠の登録・転記と点数状態の最終確認・有効化）についての
**Human Acceptance evidence** である。

Decision packet:
[`decision-dec-003-org-roles-decision-packet.md`](./decision-dec-003-org-roles-decision-packet.md)

Unit Selection:
[`decision-dec-003-org-roles-selection.md`](./decision-dec-003-org-roles-selection.md)
（同一 Draft PR；Decision-DEC-003-ORG-ROLE-SELECTION-1）

Owner: Issue #8 / Issue #19

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: DEC-003（org-role part）
Status: Accepted / LOCKED
Human Acceptance: Explicit Human Selection on 2026-08-19
Selected:
  Registration / transcription = PLANNER
  Final confirmation / activation = SERVICE_MANAGER
Baseline tip: cf0d45d4ae740cdb5d3c65c262569b7012574db4

Does NOT mean:
  DEC-007 の同時 Accepted
  DEC-006 の catalog 採択または変更
  DEC-008 の再 Decision
  SITE_ADMIN / ORG_ADMIN を 003 の登録・確認パスへ追加
  実装権限・画面・ワークフローの発明
  SharePoint / M365 / Entra mutation GO
  Implementation Start / Deploy / real data / LIVE WRITE

FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
next residual auto-select: FORBIDDEN
DEC-007 auto-SELECT: FORBIDDEN
DEC-006 auto-sync: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit Human Decision on 2026-08-19
DEC-003 org roles: Accepted / LOCKED

Registration / transcription:
  PLANNER
  点数根拠情報の登録・転記を担当する

Final confirmation / activation:
  SERVICE_MANAGER
  登録された点数根拠を最終確認する
  点数状態を有効化する
```

```text
Prior non-binding proposal: PLANNER / SERVICE_MANAGER
  （Issue #8 Organization policy Proposed / Recommended ≠ Binding）
Agent recommendation = NONE（≠ Human Acceptance evidence）
This document records the Human Decision only.
Coincidence of ledger proposal and Human pair ≠ tip-as-binding.
```

## Accepted 内容

```text
DEC-003 org roles: Accepted / LOCKED

PLANNER:
  点数根拠情報の登録・転記を担当する

SERVICE_MANAGER:
  登録された点数根拠を最終確認する
  点数状態を有効化する
```

日本語正本:

```text
登録・転記:
  PLANNER が点数根拠情報を登録・転記する

最終確認・有効化:
  SERVICE_MANAGER が登録された点数根拠を最終確認し、点数状態を有効化する
```

意味:

- **公式点数根拠の登録・転記は PLANNER、最終確認と点数状態の有効化は SERVICE_MANAGER** とする。
- この `SERVICE_MANAGER` は支援計画シートの作成者でも、支援計画の独立最終承認者でもない（DEC-008 UNCHANGED）。
- この `SERVICE_MANAGER` は AssessmentSnapshot 訂正の承認者でもない（GOV-AUD-03 Option E UNCHANGED）。
- この `SERVICE_MANAGER` の意味を DEC-007 の算定不能「最終確認」へ流用しない。
- SITE_ADMIN / ORG_ADMIN は本 Acceptance の登録・確認パスに追加しない。
- 実装権限・UI・tenant 操作は本 Acceptance だけでは開始しない。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  DEC-007 SELECT または Accepted
  DEC-006 catalog 採択 / ledger sync
  DEC-008 再 Decision
  SITE_ADMIN / ORG_ADMIN 追加
  実装権限マトリクス / UI / ワークフロー発明
  SharePoint / M365 / Entra mutation
  FindingCode / A-5
  Issue #19 Close
  next residual auto-select
  Implementation Start / Deploy / real data / LIVE WRITE
```

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| Decision-DEC-003-ORG-ROLE-SELECTION-1 | **UNCHANGED**（unit SELECTED / LOCKED；同一 PR） |
| DEC-003 technical | **UNCHANGED**（Accepted） |
| DEC-008 | **UNCHANGED** |
| GOV-AUD-03 | **UNCHANGED** / Option E |
| DEC-007 | **OUT / NOT SELECTED** |
| DEC-006 | **OUT / UNCHANGED**（Entry #6 HOLD） |
| GOV-PERF HOLD | **OUT / UNCHANGED** |
| UI / tenant mutation / Implementation | **HOLD / NOT STARTED** |

## Next

```text
DEC-003 org roles: Accepted / LOCKED
  PLANNER register / transcribe
  SERVICE_MANAGER confirm / activate
DEC-007: NOT SELECTED（conflict check は 003 Merge 後の別 GO）
DEC-006: UNCHANGED
Issue #19 Close: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
```

Agent は本 Acceptance を理由に DEC-007 / DEC-006 自動 SELECT、DEC-008 変更、UI 発明、tenant mutation へ進まない。
