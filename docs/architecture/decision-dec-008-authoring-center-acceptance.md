# DEC-008 — 支援計画シート作成の実務中心者 Human Acceptance

この文書は、**DEC-008** のうち
**「支援計画シートを実際に作成する中心者」** についての
**Human Acceptance evidence** である。

Decision packet: [`decision-dec-008-authoring-center-decision-packet.md`](./decision-dec-008-authoring-center-decision-packet.md)

分離正本: [`decision-dec-008-support-plan-role-separation.md`](./decision-dec-008-support-plan-role-separation.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: DEC-008 / AUTHORING_CENTER
Status: Accepted
Human Acceptance: Explicit Human Option A on 2026-08-09
Selected Option: A — はい
実務中心者:
  強度行動障害支援者養成研修（実践研修）修了者
Meaning:
  実務上の作成中心者のみを確定する
Does NOT mean:
  制度上の資格要件の確定
  最終承認者の確定
  修了者以外が作成できないことの制度断定
制度上の資格要件: 未確定のまま
最終承認者: 未決定のまま
サービス管理責任者を最終承認者とする案: 未採択
FindingCode 作成: DO NOT START
A-5: OUT
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit Human Option A on 2026-08-09
DEC-008 AUTHORING_CENTER: Accepted
Selected Option: A
支援計画シートを実際に作成する中心者:
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

実務上の作成中心者:
  強度行動障害支援者養成研修（実践研修）修了者
```

日本語正本:

```text
支援計画シートを実際に作成する中心者:
  実践研修修了者
```

意味:

- 確定したのは **実務上の作成中心者** だけである。
- 制度上の資格要件（生活介護・重度障害者支援加算の現行通知に基づく必須資格）は **未確定のまま**。
- 作成した支援計画シートを確認・承認して有効化する人（最終承認者）は **未決定のまま**。
- サービス管理責任者を最終承認者とする案は **未採択**。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  制度上の資格要件の断定
  「修了者だけが作成できる」の制度断定
  最終承認者の採択
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
| DEC-008 分離 framing | 維持（3 軸） |
| 実務中心者 | **Accepted / 実践研修修了者** |
| 制度上の資格要件 | 未確定 |
| 最終承認者 | 未決定 |
| `support-plan-status-transition.md` | UNCHANGED（role-free） |
| FindingCode / A-5 / Implementation | HOLD |

## Next

```text
Accepted: 実務上の作成中心者 = 実践研修修了者
Next natural unit:
  作成した支援計画シートを誰が確認・承認して有効化するか
  → decision-dec-008-final-approver-decision-packet.md
制度上の資格要件: 未確定のまま分離維持
FindingCode / A-5 / Implementation: HOLD
```

Agent は本 Acceptance を理由に最終承認者・制度資格・Implementation へ自動進行しない。
最終承認者 packet は別 Human Decision である。
