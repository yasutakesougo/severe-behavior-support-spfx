# GOV-RULE-11 — 制度値と法人運用値の境界 Human Acceptance（Fill-in）

この文書は、**GOV-RULE-11**（制度値と法人運用値の境界）についての
**3 分類 Fill-in Human Acceptance evidence** である。

Decision packet:
[`decision-gov-rule-11-value-boundary-decision-packet.md`](./decision-gov-rule-11-value-boundary-decision-packet.md)

Unit Selection:
[`decision-gov-rule-11-value-boundary-selection.md`](./decision-gov-rule-11-value-boundary-selection.md)
（PR #270 MERGED）

Owner: Issue #19

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-RULE-11-FILL-IN-1
Status: Accepted / LOCKED（fill-in）
Human Acceptance: Explicit ACCEPT GOV-RULE-11 fill-in on 2026-08-11
Parent unit Selection: Decision-GOV-RULE-11-SELECTION-1（UNCHANGED）
Baseline tip: 1b03264ad8d109f05a93e3e4b02ba8c5b774fef4
PR: pending（Fill-in Acceptance / Packet sync / IR）

Accepted classification（from Accepted GOV-RULE-05〜10 evidence only）:
  制度上固定し事業所変更不可: 現時点では確定なし
  法人運用として変更可能:
    - GOV-RULE-05 見直し基準日のルール
    - GOV-RULE-06 見直し周期の論理表現
    - GOV-RULE-07 通知開始ルール
    - GOV-RULE-08 due / overdue 採否
    - GOV-RULE-09 ルール内容の責任者
    - GOV-RULE-10 ルール変更の承認方式
  事業所設定として変更可能: 現時点では確定なし

Hard constraints（UNCHANGED / FORBIDDEN）:
  GOV-RULE-06「3ヶ月に1回程度」≠ 90日（変換禁止）
  GOV-RULE-07 notice ≠ N日前への日数変換（例: 30日前発明禁止）
  GOV-RULE-06 を「制度上固定」へ格上げしない（本 Acceptance でも断定しない）

Does NOT mean:
  新規制度値・日数・ルール本文の発明
  GOV-RULE-05〜10 の再 Decision / 上書き
  GOV-RULE-12 の同時 SELECT または Accepted
  設定画面 / ワークフロー実装 GO
  SharePoint / Microsoft 365 / Entra mutation GO
  Implementation Start / Deploy / real data

FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
next residual auto-select: FORBIDDEN
GOV-RULE-12 auto-SELECT: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit ACCEPT GOV-RULE-11 fill-in on 2026-08-11
Decision-GOV-RULE-11-FILL-IN-1: Accepted / LOCKED
GOV-RULE-11 unit Selection: UNCHANGED / REDECIDE しない

制度上固定し事業所変更不可:
  現時点では確定なし
  （GOV-RULE-06「3ヶ月に1回程度」は外部資料支持があるが、
   「制度上固定」とまでは既存正本から断定しない）

法人運用として変更可能:
  GOV-RULE-05 見直し基準日のルール
  GOV-RULE-06 見直し周期の論理表現
  GOV-RULE-07 通知開始ルール
  GOV-RULE-08 due / overdue 採否
  GOV-RULE-09 ルール内容の責任者
  GOV-RULE-10 ルール変更の承認方式

事業所設定として変更可能:
  現時点では確定なし
```

```text
Prior non-binding candidate: same 3-bucket classification
  （Candidate Fill-in = PREPARED / NON-BINDING → now Human Accepted）
Agent recommendation ≠ Human Acceptance evidence
This document records the Human Decision only.
No new institutional values / day counts invented.
```

## Accepted 内容

```text
GOV-RULE-11: Accepted / LOCKED（fill-in）
Decision-GOV-RULE-11-FILL-IN-1: Accepted / LOCKED

Value boundary:
  制度上固定し事業所変更不可 = 現時点では確定なし
  法人運用として変更可能 = GOV-RULE-05〜10 Accepted 論理（下記）
  事業所設定として変更可能 = 現時点では確定なし
```

日本語正本:

```text
制度値と法人運用値の境界:

制度上固定し事業所変更不可:
  現時点では確定なし

法人運用として変更可能:
  - GOV-RULE-05 見直し基準日のルール
    （初回 = 支援計画の有効開始日 / 2回目以降 = 前回見直し日）
  - GOV-RULE-06 見直し周期の論理表現
    （「3ヶ月に1回程度」/ calendar-month cadence / precision = approximate）
    ※ 90日への変換は禁止（UNCHANGED）
  - GOV-RULE-07 通知開始ルール
    （見直し対象となる暦月に入ったら通知 / informational only）
    ※ 30日前等への日数変換は禁止（UNCHANGED）
  - GOV-RULE-08 due / overdue 採否
    （hard due / overdue = NOT ADOPTED；現行 scope）
  - GOV-RULE-09 ルール内容の責任者
    （法人業務責任者）
  - GOV-RULE-10 ルール変更の承認方式
    （業務責任者が内容確認し、法人管理者が承認）

事業所設定として変更可能:
  現時点では確定なし
```

意味:

- 境界は **既存 Accepted GOV-RULE-05〜10 の棚卸し** に基づく分類であり、新規値の発明ではない。
- 「制度上固定」「事業所設定変更可」は **現時点で確定なし**（空欄を Agent が埋めない）。
- GOV-RULE-06 の approximate calendar-month cadence を 90 日へ硬化しない。
- GOV-RULE-07 の calendar-month informational notice を相対日数通知へ硬化しない。
- GOV-RULE-05〜10 自体は再 Decision しない（分類参照のみ）。
- 設定 UI・ワークフロー・tenant 操作・実装は本 Acceptance だけでは開始しない。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  90日規則 / 30日前通知 / 新規制度値・日数の発明
  GOV-RULE-06 を制度上固定へ格上げ
  GOV-RULE-05〜10 re-Decision
  GOV-RULE-12 SELECT または Accepted
  設定画面 / ワークフロー実装
  SharePoint / M365 / Entra mutation
  FindingCode / A-5
  Issue #19 Close
  next residual auto-select
  Implementation Start / Deploy / real data
```

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| Decision-GOV-RULE-11-SELECTION-1 | **UNCHANGED**（unit SELECTED / LOCKED） |
| GOV-RULE-05〜08 | **UNCHANGED**（参照のみ；08 = NOT ADOPTED） |
| GOV-RULE-09 | **UNCHANGED**（Accepted / Option B） |
| GOV-RULE-10 | **UNCHANGED**（Accepted / Option C） |
| GOV-AUD-01〜10 | **UNCHANGED** |
| GOV-RULE-12 | **OUT / NOT SELECTED** |
| 制度上固定 / 事業所設定 buckets | **EMPTY / 確定なし**（発明禁止） |
| 設定 UI / tenant mutation | **HOLD / NOT STARTED** |
| FindingCode / A-5 / Implementation | **HOLD** |

## Next

```text
GOV-RULE-11: Accepted / LOCKED（fill-in）
next residual SELECT（one item；Agent auto-advance FORBIDDEN）
Issue #19 Close: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
```

Agent は本 Acceptance を理由に 90日/日数通知発明・制度値発明・tenant mutation・GOV-RULE-12 自動 SELECT・次 residual 自動 SELECT へ進まない。
