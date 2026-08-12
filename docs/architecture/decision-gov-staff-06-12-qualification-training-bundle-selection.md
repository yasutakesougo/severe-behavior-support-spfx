# GOV-STAFF-06〜12 — 資格・研修 residual bundle — Human Selection Packet

この文書は、GOV-STAFF-06 COMPLETE（PR #280 MERGED）後の
**Human Decision** として **GOV-STAFF-06〜12** を
**bundled Selection** する docs-only Selection Packet である。

Human が明示した bundle SELECT / ACCEPT。
GOV-STAFF-06 は既に Accepted / Option B（PR #280）であり、
本 bundle では **CONFIRMED / UNCHANGED**（再 Decision しない）。
GOV-STAFF-07〜12 を本 PR で SELECT + Option Acceptance する。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-STAFF-06-12-BUNDLE-1
Kind: Human Selection（#19 residual / GOV-STAFF-06〜12 bundle）
Status: SELECTED / LOCKED（bundle GO boundary）
Human Decision: SELECT GOV-STAFF-06〜12 bundle
Date: 2026-08-12
PR: #281（Selection / Packet / SELECT Acceptance / Option Acceptance / IR）

Baseline:
  main tip = 48dd920ea8dbb740db68709e8139b519f554b042
  Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 = SELECTED / LOCKED（PR #255）
  GOV-STAFF-01〜05 = Accepted（該当 Option）
  GOV-STAFF-06 = Accepted / LOCKED / Option B（PR #280 MERGED）
  DEC-015 = NOT ACCEPTED（ledger sync 別）

Candidate origin:
  Issue #19 §A GOV-STAFF-06〜12
  Human Decision — GOV-STAFF-06〜12 bundled selection / acceptance
  Binding before this Decision: GOV-STAFF-06 LOCKED；07〜12 OPEN → now bundled SELECTED by Human

Option Acceptance: Accepted / LOCKED（本 PR；unit 別 Option）
Implementation Start: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: FORBIDDEN
分母・閾値・schema / Internal Name の発明: FORBIDDEN
GOV-PERF auto-SELECT: FORBIDDEN
next residual after this bundle: NOT SELECTED
```

## 1. Why this bundle now

```text
Human が GOV-STAFF-06〜12 を明示 bundled SELECT / ACCEPT した。
職員・資格・研修の残件を一件ずつではなく、
Human 指定の bundle として docs-only 正本化する。
閾値・UI・schema・tenant mutation は発明しない。
```

## 2. Selected units

| ID | Topic | Bundle result |
|---|---|---|
| GOV-STAFF-06 | 資格・研修マスターの正本管理者 | **CONFIRMED / UNCHANGED**（Accepted / Option B；PR #280） |
| GOV-STAFF-07 | 資格・研修情報の確認者 | **SELECTED** + Option C |
| GOV-STAFF-08 | 研修割合の分母 | **SELECTED** + Option C |
| GOV-STAFF-09 | 兼務者の集計 | **SELECTED** + Option C（二重計上防止方針付き） |
| GOV-STAFF-10 | 休職・長期不在・短期応援者 | **SELECTED** + Option C-based（全区分 C） |
| GOV-STAFF-11 | 期限のない資格・研修 | **SELECTED** + Option B |
| GOV-STAFF-12 | 証跡欠損時の扱い | **SELECTED** + Option C |

## 3. Authorized IN

```text
IN:
  GOV-STAFF-06〜12 bundle を current residual Decision とする
  Decision Packet / Option Acceptance の docs 固定
  GOV-STAFF-06 Option B の CONFIRMED / UNCHANGED 記録
  residual ledger / ownership / backlog 同期
  Independent Review
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  SharePoint / Entra / Microsoft 365 mutation
  資格・研修マスター実装 / ACL / group 変更
  schema / Internal Name の発明
  分母条件・配置時間・勤務割合・確認周期の具体的閾値の発明
  UI / adapter 実装
  Implementation Start / Deploy / Production
  Issue #19 Close
  次 residual auto-select
  Ready / Merge（HUMAN-ONLY；本文書に書かない）
  GOV-PERF の自動 SELECT
  GOV-STAFF-01〜05 の再 Decision
```

## 5. Stop condition

```text
Decision-GOV-STAFF-06-12-BUNDLE-1 = SELECTED / LOCKED
GOV-STAFF-06 = CONFIRMED / UNCHANGED / Option B
GOV-STAFF-07〜12 = Accepted / LOCKED（各 Option；本 PR）

HOLD:
  Implementation Start = NOT AUTHORIZED
  Issue #19 Close = NOT AUTHORIZED
  next residual = NOT SELECTED
  concrete thresholds / schema / UI = NOT INVENTED
```

## 6. Next（Human only）

```text
1. This PR Independent Review → Human Ready → Human Merge
2. After Merge: next residual SELECT = separate / Agent auto-advance FORBIDDEN
```

## Reference

- SELECT Acceptance: `decision-gov-staff-06-12-qualification-training-bundle-acceptance.md`
- Decision Packet: `decision-gov-staff-06-12-qualification-training-bundle-decision-packet.md`
- Option Acceptance: `decision-gov-staff-06-12-qualification-training-bundle-option-acceptance.md`
- Independent Review: `decision-gov-staff-06-12-qualification-training-bundle-independent-review.md`
- Prior unit: `decision-gov-staff-06-qualification-training-master-owner-option-b-acceptance.md`
- Parent track: `decision-issue-19-residual-governance-selection.md`
- Issue #19: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
