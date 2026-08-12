# Decision Packet — GOV-RULE-01〜04 観察・評価周期 residual bundle

この文書は、**GOV-RULE-01〜04**（評価周期 / 観察期間起算・終了 / 必要件数）の
**Human Decision Packet** である。

Issue #19 所有。Human 明示 bundle。
GOV-RULE-05〜12 の再 Decision ではない。
Agent が周期・件数・集計方式・日付計算規則を発明しない。
Implementation Start ではない。

Selection:
[`decision-gov-rule-01-04-observation-cycle-bundle-selection.md`](./decision-gov-rule-01-04-observation-cycle-bundle-selection.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-RULE-01〜04（bundle）
Kind: Human Decision packet（bundle）
Status: Accepted / LOCKED（02/03）；HOLD（01/04）
Owner: Issue #19
Selected via: Decision-GOV-RULE-01-04-BUNDLE-1
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation: NONE
Option+HOLD Acceptance: decision-gov-rule-01-04-observation-cycle-bundle-option-acceptance.md
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Bundle decisions（Human）

| ID | Topic | Result | Meaning（正本要約） |
|---|---|---|---|
| GOV-RULE-01 | 行動関連点数の評価周期 | **SELECTED / HOLD** | 周期・追加評価条件・根拠・決定者 = VALUE NOT DETERMINED |
| GOV-RULE-02 | 観察期間の起算日 | **Accepted / Option A** | 支援計画の有効開始日 |
| GOV-RULE-03 | 観察期間の終了日 | **Accepted / Option A** | 見直し実施日の前日 |
| GOV-RULE-04 | 必要観察件数 | **SELECTED / HOLD** | 必要件数・対象期間・数え方・同日複数 = VALUE NOT DETERMINED |
| GOV-RULE-05〜12 | （既存） | **CONFIRMED / UNCHANGED** | 再 Decision しない |

## 2. 判断単位の分離（混ぜない）

```text
評価周期（01）≠ 観察期間起算（02）≠ 終了（03）≠ 必要件数（04）
02/03 を決める ≠ 01/04 の具体値を発明した
02/03 を決める ≠ GOV-RULE-05 等の日付計算規則を新規発明した
HOLD ≠ Accepted concrete value
時刻境界・TZ・SharePoint列型 ≠ 本 packet の決定対象
```

## 3. Options / HOLD（Issue #19 + Human）

### GOV-RULE-01 — HOLD / VALUE NOT DETERMINED

```text
Status: SELECTED / LOCKED / HOLD
未確定:
  周期
  追加評価が必要な条件
  根拠
  決定者
Reason:
  現 Decision Packet から制度上の根拠値を確定できない
  Agent は日数・月数・条件を発明しない
解除: 制度資料または法人の正式決定確認後の別 Human Decision
```

### GOV-RULE-02 — Option A

```text
Meaning:
  観察期間の起算日 = 支援計画の有効開始日
補足:
  初回の観察期間は支援計画の有効開始日を起点とする
  前回見直し後の次期間は Accepted GOV-RULE-05 等との整合を保つ
  本 Decision から新たな日付計算規則を発明しない
```

Issue #19 原文 Options:

- A. 支援計画の有効開始日 ← **SELECTED**
- B. 前回見直し日
- C. 月初・週初などの暦日
- D. その他

### GOV-RULE-03 — Option A

```text
Meaning:
  観察期間の終了日 = 見直し実施日の前日
補足:
  見直し実施日そのものを、見直し判断の材料となる観察期間へ後付けで含めない
  観察 → 見直し判断 の時間順序を維持する
  時刻境界・タイムゾーン・SharePoint列型等は本 Decision では決定しない
```

Issue #19 原文 Options:

- A. 見直し実施日の前日 ← **SELECTED**
- B. 見直し実施日を含む
- C. 固定期間の末日
- D. その他

### GOV-RULE-04 — HOLD / VALUE NOT DETERMINED

```text
Status: SELECTED / LOCKED / HOLD
未確定:
  必要件数
  対象期間
  数え方
  同日に複数記録がある場合の扱い
Reason:
  必要観察件数は業務・制度上の意味を持つ
  根拠なしに Agent が件数や集計方式を発明してはならない
解除: 制度資料または法人の正式運用決定確認後の別 Human Decision
```

### GOV-RULE-05〜12 — CONFIRMED / UNCHANGED

```text
GOV-RULE-05〜12 = CONFIRMED / UNCHANGED
再 Decision / 書き換え / 再解釈: FORBIDDEN
本 bundle はこれらを上書きしない
```

## 4. Explicit non-options / FORBIDDEN

```text
GOV-RULE-01 / 04 の具体値発明
GOV-RULE-05〜12 re-Decision
HOLD 解除（本 PR では不可）
SharePoint / schema / Internal Name / UI / adapter
Implementation Start / Deploy
Issue #19 Close
next residual auto-select
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason: 01/04 は EVIDENCE_REQUIRED / HOLD。日数・件数を Binding 推薦しない。
```

## 6. After Decision

```text
GOV-RULE-01 / 04: HOLD（解除は別 Human Decision）
GOV-RULE-02 / 03: Accepted / LOCKED / Option A
GOV-RULE-05〜12: UNCHANGED
Implementation Start: DO NOT START
next residual auto-select: FORBIDDEN
```

## Reference

- Selection: `decision-gov-rule-01-04-observation-cycle-bundle-selection.md`
- SELECT Acceptance: `decision-gov-rule-01-04-observation-cycle-bundle-acceptance.md`
- Option+HOLD Acceptance: `decision-gov-rule-01-04-observation-cycle-bundle-option-acceptance.md`
- Issue #19 §B GOV-RULE-01〜04
- GOV-RULE-05: `decision-gov-rule-05-review-anchor-acceptance.md`
