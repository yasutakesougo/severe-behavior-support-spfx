# DEC-008 — 支援計画シート等の制度上の作成者 Human Acceptance

この文書は、**DEC-008** のうち
**「支援計画シート等の制度上の作成者」** についての
**Human Acceptance evidence** である。

Decision packet: [`decision-dec-008-authoring-center-decision-packet.md`](./decision-dec-008-authoring-center-decision-packet.md)

分離正本: [`decision-dec-008-support-plan-role-separation.md`](./decision-dec-008-support-plan-role-separation.md)

DEC-008 要約: [`decision-dec-008-acceptance.md`](./decision-dec-008-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: DEC-008 / AUTHORING_CENTER（制度上の作成者）
Status: Accepted
Human Acceptance: Explicit Human Option A on 2026-08-09
  + Explicit Human conclusion clarifying institutional creator meaning on 2026-08-09
Selected Option: A — はい
制度上の作成者:
  強度行動障害支援者養成研修（実践研修）修了者
  = 支援計画シート等の制度上の作成者
独立した最終承認者: NOT ADOPTED（別正本）
サービス管理責任者を最終承認者とする案: 未採択 / 不採用
FindingCode: HOLD / DO NOT CREATE
A-5: HOLD
Implementation Start: HOLD
Next substantive unit: NOT SELECTED
Implementation auto-start: FORBIDDEN
```


Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit Human Option A on 2026-08-09
DEC-008 AUTHORING_CENTER: Accepted
Selected Option: A
支援計画シート等の制度上の作成者:
  強度行動障害支援者養成研修（実践研修）修了者
```

```text
Agent recommendation（当時 Option C）: NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
DEC-008 / AUTHORING_CENTER: Accepted
Selected: Option A

制度上の作成者:
  強度行動障害支援者養成研修（実践研修）修了者
  = 支援計画シート等の制度上の作成者
```

日本語正本:

```text
支援計画シート等の制度上の作成者:
  実践研修修了者
```

意味:

- **実践研修修了者＝支援計画シート等の制度上の作成者** を Accepted する。
- 独立した最終承認者は置かない（[`decision-dec-008-final-approver-acceptance.md`](./decision-dec-008-final-approver-acceptance.md)）。
- サービス管理責任者を最終承認者とする案は NOT ADOPTED / 不採用。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  アプリ独自の最終承認者ロールの発明
  サービス管理責任者 = 最終承認者
  提出・差戻しロールの確定
  SupportPlan 遷移契約へのロール検査埋め込み
  FindingCode 作成
  A-5
  Implementation Start
  SharePoint / M365 / Deploy / real data
```


## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| DEC-008 分離 framing | 維持 |
| 制度上の作成者 | **Accepted / 実践研修修了者** |
| 独立した最終承認者 | **NOT ADOPTED**（別正本） |
| `support-plan-status-transition.md` | UNCHANGED（role-free） |
| FindingCode / A-5 / Implementation | HOLD |

## Next

```text
Accepted: 制度上の作成者 = 実践研修修了者
独立した最終承認者: NOT ADOPTED → アプリ独自の最終承認者を設定しない
FindingCode: HOLD / DO NOT CREATE
A-5: HOLD
Implementation Start: HOLD
Next substantive unit: NOT SELECTED
Next: Issue #8 ledger post + consistency check
```

Agent は本 Acceptance を理由に Implementation や FindingCode へ自動進行しない。

