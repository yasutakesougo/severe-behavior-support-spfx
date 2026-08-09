# DEC-008 — 支援計画シート役割の分離（制度上の作成者 / 独立最終承認者）

この文書は、**DEC-008** について、1 つの DEC 本文へ混ぜて断定しないための
**判断単位の分離正本** である。

現行 scope の Human Acceptance は完了している。
Agent が追加ロールを発明しない。
Implementation Start ではない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: DEC-008（Issue #8 台帳上の既存番号）
Kind: role / qualification separation framing
Status: Accepted scope closed
  制度上の作成者: Accepted = 実践研修修了者
  独立した最終承認者: NOT ADOPTED（設定しない）
Canonical ownership: Issue #8 / DEC-008
Related technical contract: support-plan-status-transition.md（role-free / UNCHANGED）
Finding catalog DEC-019: Accepted / EMPTY / NOT ADOPTED（別 track）
FindingCode 作成: DO NOT START
A-5: OUT
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

関連:

- DEC-008 要約 Acceptance:
  [`decision-dec-008-acceptance.md`](./decision-dec-008-acceptance.md)
- 制度上の作成者 Acceptance:
  [`decision-dec-008-authoring-center-acceptance.md`](./decision-dec-008-authoring-center-acceptance.md)
- 独立最終承認者 Acceptance（NOT ADOPTED）:
  [`decision-dec-008-final-approver-acceptance.md`](./decision-dec-008-final-approver-acceptance.md)
- packets（CONSUMED）:
  [`decision-dec-008-authoring-center-decision-packet.md`](./decision-dec-008-authoring-center-decision-packet.md)
  [`decision-dec-008-final-approver-decision-packet.md`](./decision-dec-008-final-approver-decision-packet.md)
- 支援計画状態遷移（ロール判定 OUT）:
  [`support-plan-status-transition.md`](./support-plan-status-transition.md)
- backlog: [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- ownership: [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Why separate

DEC-008 は「提出・差戻し・承認ロール、制度値」を含む広い表面として言及されてきた
（[`issue-24-remaining-audit-pr-i-selection.md`](./issue-24-remaining-audit-pr-i-selection.md)）。

ここで一度に全部を確定すると、次を混同しやすい。

```text
混同しやすいもの:
  制度上の作成者
  独立した最終承認者（作成者とは別の有効化ロール）
  提出・差戻しロール
  AI 要約・二次説明文
```

そのため DEC-008 は軸を分けて扱い、現行 scope では次を確定した。

## 2. DEC-008 分離表（Accepted 後）

| 軸 | 結果 | 意味 |
|---|---|---|
| **支援計画シート等の制度上の作成者** | **Accepted** = 強度行動障害支援者養成研修（**実践研修**）修了者 | 制度上の作成者として固定 |
| **独立した最終承認者** | **NOT ADOPTED**（設定しない） | 制度根拠が確認できないため置かないのが最も安全 |
| サービス管理責任者を最終承認者とする案 | **未採択 / 不採用** | 独立最終承認者自体を置かない |

```text
DEC-008:
  支援計画シート等の制度上の作成者:
    実践研修修了者
    → Accepted
  独立した最終承認者:
    設定しない
    → NOT ADOPTED（制度根拠未確認）
```

## 3. いま断定しないこと（安全境界）

```text
MUST NOT invent:
  独立した最終承認者ロール（本 scope では NOT ADOPTED）
  サービス管理責任者 = 最終承認者 としての実装
  提出・差戻しロールの一括確定
  FindingCode / Implementation
```

AI 要約だけを根拠に追加ロールを硬化しない。

## 4. 既存技術契約との関係

| 正本 | 関係 |
|---|---|
| [`support-plan-status-transition.md`](./support-plan-status-transition.md) | **UNCHANGED**。ロール判定は引き続き OUT |
| `createdBy` / `approvedBy` 等のフィールド形 | 形だけの契約。独立最終承認者ロールは置かない |
| GOV-RULE-05〜08 | 見直し周期・通知・due。作成ロールとは混ぜない |
| DEC-019 Finding catalog | EMPTY / NOT ADOPTED。本 DEC と混ぜない |

## 5. Current scope gate

```text
DEC-008 current scope: closed
制度上の作成者: Accepted / 実践研修修了者
独立した最終承認者: NOT ADOPTED
FindingCode 作成: DO NOT START
A-5: OUT
Implementation Start: HOLD
次 substantive unit: NOT SELECTED
```

将来、制度通知等で独立承認者が必要と確認された場合は別 Human Decision とする。
