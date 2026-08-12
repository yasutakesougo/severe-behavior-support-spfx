# GOV-RULE-01〜04 — 観察・評価周期 residual bundle — Human Selection Packet

この文書は、GOV-STAFF-06〜12 COMPLETE（PR #281 MERGED）後の
**Human Decision** として **GOV-RULE-01〜04** を
**bundled Selection** する docs-only Selection Packet である。

既に Accepted / LOCKED の **GOV-RULE-05〜12 は再 Decision しない**
（CONFIRMED / UNCHANGED）。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-RULE-01-04-BUNDLE-1
Kind: Human Selection（#19 residual / GOV-RULE-01〜04 bundle）
Status: SELECTED / LOCKED（bundle GO boundary）
Human Decision: SELECT GOV-RULE-01〜04 bundle
Date: 2026-08-12
PR: #282（Selection / Packet / SELECT Acceptance / Option+HOLD Acceptance / IR）

Baseline:
  main tip = 7f4da32927392de3bc46b669016a73c404187756
  Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 = SELECTED / LOCKED（PR #255）
  GOV-STAFF-01〜12 = Accepted（該当分；#281 MERGED）
  GOV-RULE-05〜12 = Accepted / LOCKED（CONFIRMED / UNCHANGED）
  DEC-015 = NOT ACCEPTED（ledger sync 別）

Candidate origin:
  Issue #19 §B GOV-RULE-01〜04
  Human Decision — GOV-RULE-01〜04 residual bundle
  Binding before this Decision: 01〜04 OPEN / Proposed → now bundled SELECTED by Human

Option / HOLD Acceptance: 本 PR（02/03 Accepted；01/04 HOLD）
Implementation Start: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
GOV-RULE-05〜12 re-Decision: FORBIDDEN
周期・件数・集計方式の発明: FORBIDDEN
SharePoint / schema / UI / adapter: FORBIDDEN
next residual after this bundle: NOT SELECTED
```

## 1. Why this bundle now

```text
Human が未処理 GOV-RULE residual として GOV-RULE-01〜04 を
明示 bundled SELECT した。
02/03 は Option A Acceptance；01/04 は HOLD / VALUE NOT DETERMINED。
05〜12 は照合のみ（再 Decision しない）。
```

## 2. Selected units

| ID | Topic | Bundle result |
|---|---|---|
| GOV-RULE-01 | 行動関連点数の評価周期 | **SELECTED / LOCKED / HOLD**（VALUE NOT DETERMINED） |
| GOV-RULE-02 | 観察期間の起算日 | **SELECTED** + Option A Accepted |
| GOV-RULE-03 | 観察期間の終了日 | **SELECTED** + Option A Accepted |
| GOV-RULE-04 | 必要観察件数 | **SELECTED / LOCKED / HOLD**（VALUE NOT DETERMINED） |
| GOV-RULE-05〜12 | （既存） | **CONFIRMED / UNCHANGED** |

## 3. Authorized IN

```text
IN:
  GOV-RULE-01〜04 bundle を current residual Decision とする
  Decision Packet / Option+HOLD Acceptance の docs 固定
  GOV-RULE-05〜12 CONFIRMED / UNCHANGED 照合
  residual ledger / ownership / backlog 同期
  Independent Review
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  GOV-RULE-01 の周期・追加評価条件・根拠・決定者の発明
  GOV-RULE-04 の必要件数・対象期間・数え方・同日複数記録扱いの発明
  GOV-RULE-05〜12 の再 Decision / 書き換え / 再解釈
  HOLD 解除（別 Human Decision が必要）
  SharePoint mutation / schema / Internal Name 発明
  UI / adapter / Implementation Start / Deploy
  Issue #19 Close / next residual auto-select
  Ready / Merge（HUMAN-ONLY；本文書に書かない）
```

## 5. Stop condition

```text
Decision-GOV-RULE-01-04-BUNDLE-1 = SELECTED / LOCKED
GOV-RULE-01 = SELECTED / LOCKED / HOLD
GOV-RULE-02 = Accepted / LOCKED / Option A
GOV-RULE-03 = Accepted / LOCKED / Option A
GOV-RULE-04 = SELECTED / LOCKED / HOLD
GOV-RULE-05〜12 = CONFIRMED / UNCHANGED

HOLD:
  GOV-RULE-01 concrete values = NOT DETERMINED
  GOV-RULE-04 concrete values = NOT DETERMINED
  Implementation Start = NOT AUTHORIZED
  Issue #19 Close = NOT AUTHORIZED
  next residual = NOT SELECTED
```

## 6. Next（Human only）

```text
1. This PR Independent Review → Human Ready → Human Merge
2. After Merge: next residual SELECT = separate / Agent auto-advance FORBIDDEN
3. GOV-RULE-01 / 04 HOLD 解除 = separate Human Decision（根拠資料後）
```

## Reference

- SELECT Acceptance: `decision-gov-rule-01-04-observation-cycle-bundle-acceptance.md`
- Decision Packet: `decision-gov-rule-01-04-observation-cycle-bundle-decision-packet.md`
- Option+HOLD Acceptance: `decision-gov-rule-01-04-observation-cycle-bundle-option-acceptance.md`
- Independent Review: `decision-gov-rule-01-04-observation-cycle-bundle-independent-review.md`
- Parent track: `decision-issue-19-residual-governance-selection.md`
- Prior bundle: `decision-gov-staff-06-12-qualification-training-bundle-option-acceptance.md`
- Issue #19: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
