# Decision Packet — DEC-008 支援計画シート作成の実務中心者

この文書は、**DEC-008** のうち
**「支援計画シートを実際に作成する中心者」** だけを問う
**Human Decision Packet** である。

制度上の資格要件の確定ではない。
最終承認者の採択ではない。
Accepted ではない。
Agent が役割・資格を発明しない。
Implementation Start ではない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: DEC-008 / AUTHORING_CENTER
Kind: Human Decision packet（narrow）
Status: CONSUMED（Human Decision Accepted / Option A）
Accepted 正本: decision-dec-008-authoring-center-acceptance.md
Separation authority: decision-dec-008-support-plan-role-separation.md
Canonical ownership: Issue #8 / DEC-008
main baseline: 9cc7829aabe6fc1fce027d068e339cc738d4beba
Finding catalog DEC-019: Accepted / EMPTY / NOT ADOPTED（別 track）
FindingCode 作成: DO NOT START
A-5: OUT
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation（historical）: Option C
Human Selected: Option A
```


Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-dec-008-support-plan-role-separation.md`](./decision-dec-008-support-plan-role-separation.md)
- [`support-plan-status-transition.md`](./support-plan-status-transition.md)
- [`decision-gov-rule-06-review-cadence-source-review.md`](./decision-gov-rule-06-review-cadence-source-review.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current canonical state

```text
DEC-008 separation（framed）:
  制度上の資格要件: 未確定
  支援計画シート作成の実務中心者: 実践研修修了者（候補）
  最終承認者: 未決定

SupportPlan status transition: role-free / UNCHANGED
サービス管理責任者 = 最終承認者: NOT ADOPTED（案としても未採択）
AI 要約を DEC-008 根拠にすること: FORBIDDEN
```

問い（本 packet）:

> 支援計画シートを実際に作成する中心者は、実践研修修了者でよいですか？

ここで言う「実践研修修了者」:

```text
強度行動障害支援者養成研修（実践研修）修了者
```

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| DEC-008 分離 framing | 3 軸に分けること | FRAMED / 触らない |
| **実務中心者** | 実際に作成する中心者 | **本 packet** |
| 制度上の資格要件 | 加算・通知に基づく必須資格 | OUT / 未確定のまま |
| 最終承認者 | 有効化する人 | OUT / 未決定のまま |
| 提出・差戻しロール | submit / return | OUT / 後続 |
| GOV-RULE-05〜08 | 見直し周期・通知・due | Accepted / 混ぜない |
| FindingCode / A-5 | catalog / representation | OUT / DO NOT START |
| Implementation | code / Schema / UI / 権限実装 | HOLD / 混ぜない |

```text
実務中心者 ≠ 制度上の資格要件
実務中心者 ≠ 最終承認者
作成する人 ≠ 最終的に有効化する人

Option A を選んでも:
  制度必須資格が確定したことにはならない
  最終承認者が決まったことにはならない
```

## 3. Options

### Option A — はい

```text
Meaning:
  支援計画シートを実際に作成する中心者 =
  強度行動障害支援者養成研修（実践研修）修了者

Does NOT mean:
  制度上その資格が必須と確定した
  修了者以外が作成できないと確定した
  最終承認者が決まった
```

### Option B — いいえ

```text
Meaning:
  実務中心者を実践研修修了者にはしない
  （別の中心者を Human が明示する必要がある）

Does NOT invent:
  Agent が別ロール名を勝手に置かない
```

### Option C — 制度資料をさらに確認してから決める（推奨）

```text
Meaning:
  実務中心者の採択を保留する
  生活介護・重度障害者支援加算の現行通知本文など、
  制度資料をさらに確認してから決める

Why recommended:
  今回参照された説明文は AI 要約を含み、
  加算算定に直接関わる資格要件は
  現行の厚労省通知本文まで確認してから固定した方が安全

Keeps:
  制度上の資格要件: 未確定
  最終承認者: 未決定
  サービス管理責任者案: 未採択
```

## 4. Agent recommendation

```text
Recommended: Option C
Reason:
  方向性（実践研修修了者が計画・評価の中核を担う理解）は近いが、
  AI 要約・未確認の公式ページ断片を DEC-008 根拠に硬化させないため。
```

Agent recommendation は Human Acceptance evidence ではない。

## 5. Human Decision

```text
問:
  支援計画シートを実際に作成する中心者は、実践研修修了者でよいですか？

A. はい
B. いいえ
C. 制度資料をさらに確認してから決める

答え: A（2026-08-09）
Acceptance: decision-dec-008-authoring-center-acceptance.md
```

## 6. After Decision

| Selected | Next |
|---|---|
| **A（SELECTED）** | 実務中心者 = 実践研修修了者 Acceptance 済み。制度資格・最終承認者は未決のまま → FINAL_APPROVER packet |
| B | Human が代替の実務中心者を明示するまで HOLD |
| C | 制度資料確認（生活介護・重度障害者支援加算の現行通知）へ。実務中心者は未採択のまま |

維持:

```text
FindingCode 作成: DO NOT START
A-5: OUT
Implementation Start: HOLD
制度資格の断定: DO NOT START（未確定のまま）
サービス管理責任者 = 最終承認者: 未採択（FINAL_APPROVER packet で問う）
Next: decision-dec-008-final-approver-decision-packet.md
```

## 7. Gate

```text
DEC-008 separation: FRAMED
AUTHORING_CENTER packet: CONSUMED / Accepted Option A
FINAL_APPROVER packet: READY_FOR_HUMAN_DECISION
制度上の資格要件: 未確定
Implementation Start: HOLD
```
