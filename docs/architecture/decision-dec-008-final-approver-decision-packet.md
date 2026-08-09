# Decision Packet — DEC-008 支援計画シート最終承認者（確認・有効化）

この文書は、**DEC-008** のうち
**「作成した支援計画シートを誰が確認・承認して有効化するか」** だけを問う
**Human Decision Packet** である。

制度上の作成者（Accepted）の再定義ではない。
Agent が最終承認者を発明しない。
Implementation Start ではない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: DEC-008 / FINAL_APPROVER
Kind: Human Decision packet（narrow）
Status: CONSUMED（Human Decision Accepted / NOT ADOPTED）
Accepted 正本: decision-dec-008-final-approver-acceptance.md
Separation authority: decision-dec-008-support-plan-role-separation.md
Authoring center Accepted: decision-dec-008-authoring-center-acceptance.md
Canonical ownership: Issue #8 / DEC-008
制度上の作成者: 実践研修修了者（Accepted）
独立した最終承認者: NOT ADOPTED（設定しない）
サービス管理責任者を最終承認者とする案: 未採択 / 不採用
FindingCode 作成: DO NOT START
A-5: OUT
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```


Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-dec-008-support-plan-role-separation.md`](./decision-dec-008-support-plan-role-separation.md)
- [`decision-dec-008-authoring-center-acceptance.md`](./decision-dec-008-authoring-center-acceptance.md)
- [`decision-dec-008-authoring-center-decision-packet.md`](./decision-dec-008-authoring-center-decision-packet.md)
- [`support-plan-status-transition.md`](./support-plan-status-transition.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current canonical state

```text
DEC-008 separation:
  制度上の資格要件: 未確定
  支援計画シート作成の実務中心者: Accepted = 実践研修修了者
  最終承認者: 未決定

作成者 ≠ 最終的に有効化する人（分離維持）
SupportPlan status transition: role-free / UNCHANGED
制度資格要件とは分離したまま進める
```

問い（本 packet）:

> 作成した支援計画シートを、誰が確認・承認して有効化しますか？

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| 実務中心者 | 実際に作成する中心者 | Accepted / 触らない |
| **最終承認者** | 確認・承認して有効化する人 | **本 packet** |
| 制度上の資格要件 | 加算・通知に基づく必須資格 | OUT / 未確定のまま |
| 提出・差戻しロール | submit / return の担当 | OUT / 後続でも可 |
| 「確認」と「有効化」の別人化 | さらに分割するか | 本 packet では同一役割として問う。分割が必要なら Human が明示 |
| FindingCode / A-5 | catalog | OUT / DO NOT START |
| Implementation | code / 権限実装 | HOLD / 混ぜない |

```text
最終承認者 ≠ 実務中心者（自動同一視しない）
最終承認者 ≠ 制度上の資格要件
有効化ロールの採択 ≠ 加算算定資格の確定
```

## 3. Options

### Option A — サービス管理責任者

```text
Meaning:
  作成した支援計画シートを確認・承認して有効化する人 =
  サービス管理責任者

Does NOT mean:
  制度上の資格要件が確定した
  実務中心者（実践研修修了者）の再定義
  サービス管理責任者だけが作成できる
```

### Option B — 別の役割（Human が明示）

```text
Meaning:
  最終承認者をサービス管理責任者以外にする
  Human が役割名を明示する（Agent は発明しない）

Requires:
  役割名の Human 記入
```

### Option C — まだ決めない / 追加一次情報を確認してから決める

```text
Meaning:
  最終承認者を未決定のまま残す
  追加の Human 一次情報または制度運用確認の後に再問する

Keeps:
  制度上の資格要件: 未確定
  サービス管理責任者案: 未採択のまま
```

## 4. Agent recommendation

```text
Recommended: NONE
Reason:
  最終承認者は Human 一次情報で決める。
  Agent は役割名を発明しない。
  以前の「サービス管理責任者」案は候補として Option A に置くが、
  採択は本 Human Decision まで行わない。
```

Agent recommendation の欠如は Human Acceptance evidence ではない。

## 5. Human Decision

```text
問:
  作成した支援計画シートを、誰が確認・承認して有効化しますか？

A. サービス管理責任者
B. 別の役割（役割名を明示）
C. まだ決めない / 追加一次情報を確認してから決める

答え: Human conclusion（2026-08-09）
  独立した最終承認者は制度根拠が確認できないため設定しない
  → Accepted / NOT ADOPTED
Acceptance: decision-dec-008-final-approver-acceptance.md
```

## 6. After Decision

| Selected | Next |
|---|---|
| A | 最終承認者 = サービス管理責任者 を Acceptance 記録 |
| B | Human 明示ロールを Acceptance 記録 |
| C | 最終承認者は未決定のまま |
| **NOT ADOPTED（SELECTED）** | 独立した最終承認者を設定しない。制度上の作成者 Acceptance を維持 |

維持:

```text
制度上の作成者: 実践研修修了者（Accepted）
独立した最終承認者: NOT ADOPTED
FindingCode 作成: DO NOT START
A-5: OUT
Implementation Start: HOLD
SupportPlan へのロール検査埋め込み: DO NOT START
次 substantive unit: NOT SELECTED
```

## 7. Gate

```text
DEC-008 AUTHORING_CENTER: Accepted / 実践研修修了者 = 制度上の作成者
FINAL_APPROVER packet: CONSUMED / Accepted / NOT ADOPTED
DEC-008 current scope: closed
Implementation Start: HOLD
```
