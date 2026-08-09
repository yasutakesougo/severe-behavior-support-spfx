# DEC-008 — 独立した最終承認者 Human Acceptance（NOT ADOPTED）

この文書は、**DEC-008** のうち
**「作成した支援計画シートを誰が確認・承認して有効化するか」** についての
**Human Acceptance evidence** である。

Decision packet: [`decision-dec-008-final-approver-decision-packet.md`](./decision-dec-008-final-approver-decision-packet.md)

分離正本: [`decision-dec-008-support-plan-role-separation.md`](./decision-dec-008-support-plan-role-separation.md)

制度上の作成者 Acceptance:
[`decision-dec-008-authoring-center-acceptance.md`](./decision-dec-008-authoring-center-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: DEC-008 / FINAL_APPROVER
Status: Accepted
Selected: NOT ADOPTED — 独立した最終承認者は設定しない
Human Acceptance: Explicit Human conclusion on 2026-08-09
Reason:
  独立した最終承認者を置く制度根拠が確認できない
  そのため設定しないのが最も安全
制度上の作成者:
  実践研修修了者 = Accepted（支援計画シート等）
サービス管理責任者を最終承認者とする案: 未採択 / 不採用（独立最終承認者自体を置かない）
FindingCode 作成: DO NOT START
A-5: OUT
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit Human conclusion on 2026-08-09
DEC-008 FINAL_APPROVER: Accepted / NOT ADOPTED
Meaning:
  独立した最終承認者ロールは設定しない
Reason:
  制度根拠が確認できないため
```

```text
Agent-authored Option A/B/C labels: NOT required as Human Acceptance form
This document records the Human Decision conclusion only.
```

## Accepted 内容

```text
DEC-008 / FINAL_APPROVER: Accepted
Selected: NOT ADOPTED

独立した最終承認者:
  設定しない

意味:
  「作成者」とは別に、確認・承認して有効化する専用ロールを
  いまの DEC-008 では置かない。
  制度上の作成者（実践研修修了者）Acceptance と矛盾させない。
```

日本語正本:

```text
独立した最終承認者:
  設定しない（制度根拠未確認のため NOT ADOPTED）
```

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  サービス管理責任者を最終承認者として実装すること
  別ロールの最終承認者を Agent が発明すること
  制度上の作成者 Acceptance の取り消し
  提出・差戻しロールの一括確定
  SupportPlan 遷移へのロール検査埋め込み
  FindingCode 作成
  A-5
  Implementation Start
  SharePoint / M365 / Deploy / real data
```

将来、制度通知等で独立承認者が必要と確認された場合は、
**別 Human Decision** として再評価する。

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| 制度上の作成者（実践研修修了者） | Accepted / 維持 |
| 独立した最終承認者 | **NOT ADOPTED / 設定しない** |
| `support-plan-status-transition.md` | UNCHANGED（role-free） |
| FindingCode / A-5 / Implementation | HOLD |

## Next

```text
DEC-008 creator + final-approver axes: closed for current scope
制度上の作成者: 実践研修修了者（Accepted）
独立した最終承認者: NOT ADOPTED
FindingCode / A-5 / Implementation: HOLD
次 substantive unit: NOT SELECTED（Human が新たに選ぶ）
```

Agent は本 Acceptance を理由に Implementation や FindingCode へ自動進行しない。
