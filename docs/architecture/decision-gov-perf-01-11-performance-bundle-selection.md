# GOV-PERF-01〜11 — 性能目標・測定条件 residual bundle — Human Selection Packet

この文書は、post-retention deletion COMPLETE（PR #284 MERGED）後の
**Human Decision** として **GOV-PERF-01〜11** を
**bundled Selection** する docs-only Selection Packet である。

Human が明示した Option / HOLD 以外を Agent が補完してはならない。
性能試験実行・Implementation Start ではない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-PERF-01-11-BUNDLE-1
Kind: Human Selection（#19 residual / GOV-PERF-01〜11 bundle）
Status: SELECTED / LOCKED（bundle GO boundary）
Human Decision: SELECT GOV-PERF-01〜11 bundle（Selection + Options/HOLD）
Date: 2026-08-12
PR: pending（Selection / Packet / SELECT Acceptance / Option+HOLD Acceptance / IR）

Baseline:
  main tip = f8202e6eb3731652a76b8af818d32c31b8ee9a5f
  Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 = SELECTED / LOCKED（PR #255）
  post-retention deletion = Accepted / LOCKED / Option C（PR #284 MERGED）
  GOV-RULE-01 / 04 = SELECTED / LOCKED / HOLD（解除は別）
  DEC-015 = NOT ACCEPTED（ledger sync 別）

Candidate origin:
  Issue #19 §D GOV-PERF-01〜11
  Human Decision — GOV-PERF-01〜11 bundled selection / acceptance
  Binding before this Decision: OPEN / NOT SELECTED → now bundled SELECTED by Human

Option / HOLD Acceptance: 本 PR（01A / 02 HOLD / 03C / 04C / 05D / 06 HOLD / 07 HOLD / 08 HOLD / 09 HOLD / 10A / 11D）
Implementation Start: NOT AUTHORIZED
Performance test execution: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
HOLD value invention: FORBIDDEN
GOV-RULE-01 / 04 HOLD 解除: FORBIDDEN（別 Decision）
SharePoint / M365 / Entra mutation: FORBIDDEN
next residual after this bundle: NOT SELECTED
```

## 1. Why this bundle now

```text
Human が残存 GOV-PERF track を効率重視で一括 SELECT した。
Accepted: 01A / 03C / 04C / 05D / 10A / 11D
HOLD: 02 / 06 / 07 / 08 / 09
性能試験・端末購入・ネットワーク変更・実装は含まない。
```

## 2. Selected units

| ID | Topic | Bundle result |
|---|---|---|
| GOV-PERF-01 | 通常規模の合成利用者数 | **Accepted / LOCKED / Option A**（30件） |
| GOV-PERF-02 | 合成記録量 | **SELECTED / LOCKED / HOLD** |
| GOV-PERF-03 | 正式受入のキャッシュ条件 | **Accepted / LOCKED / Option C** |
| GOV-PERF-04 | 測定回数 | **Accepted / LOCKED / Option C**（20回以上） |
| GOV-PERF-05 | 合否に使う統計値 | **Accepted / LOCKED / Option D** |
| GOV-PERF-06 | 3秒・5秒目標の適用条件 | **SELECTED / LOCKED / HOLD** |
| GOV-PERF-07 | 基準端末 | **SELECTED / LOCKED / HOLD** |
| GOV-PERF-08 | 対象ブラウザ | **SELECTED / LOCKED / HOLD** |
| GOV-PERF-09 | 基準ネットワーク | **SELECTED / LOCKED / HOLD** |
| GOV-PERF-10 | 拡張・ストレス条件 | **Accepted / LOCKED / Option A** |
| GOV-PERF-11 | 目標超過時の判断者 | **Accepted / LOCKED / Option D** |

## 3. Authorized IN

```text
IN:
  GOV-PERF-01〜11 bundle を current residual Decision とする
  Decision Packet / Option+HOLD Acceptance の docs 固定
  residual ledger / ownership / backlog 同期
  conflict check（docs）
  Independent Review
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  HOLD 項目（02/06/07/08/09）の具体値発明
  PERF-02 記録件数・年数発明
  PERF-06 合否マトリクス発明（全項目必須等の推測含む）
  PERF-07 端末仕様発明 / 端末購入・設定変更
  PERF-08 ブラウザ自動採択
  PERF-09 ネットワーク値発明 / 一時障害 recommendation の Acceptance 昇格
  PERF-05 から max 超過 = 自動 FAIL ルール発明
  性能試験実行 / synthetic data generation（既存認可を超えるもの）
  SharePoint / M365 / Entra mutation / UI / adapter
  Implementation Start / Deploy / Production
  GOV-RULE-01 / 04 HOLD 解除
  Issue #19 Close / next residual auto-select
  Ready / Merge（HUMAN-ONLY；本文書に書かない）
```

## 5. Stop condition

```text
Decision-GOV-PERF-01-11-BUNDLE-1 = SELECTED / LOCKED
GOV-PERF-01 = Accepted / LOCKED / A
GOV-PERF-02 = SELECTED / LOCKED / HOLD
GOV-PERF-03 = Accepted / LOCKED / C
GOV-PERF-04 = Accepted / LOCKED / C
GOV-PERF-05 = Accepted / LOCKED / D
GOV-PERF-06 = SELECTED / LOCKED / HOLD
GOV-PERF-07 = SELECTED / LOCKED / HOLD
GOV-PERF-08 = SELECTED / LOCKED / HOLD
GOV-PERF-09 = SELECTED / LOCKED / HOLD
GOV-PERF-10 = Accepted / LOCKED / A
GOV-PERF-11 = Accepted / LOCKED / D

HOLD:
  02/06/07/08/09 concrete values = NOT DETERMINED
  Performance test execution = NOT AUTHORIZED
  Implementation Start = NOT AUTHORIZED
  Issue #19 Close = NOT AUTHORIZED
  next residual = NOT SELECTED
```

## 6. Next（Human only）

```text
1. This PR Independent Review → Human Ready → Human Merge
2. After Merge: next residual SELECT = separate / Agent auto-advance FORBIDDEN
3. GOV-PERF-02/06/07/08/09 HOLD 解除 = separate Human Decision（evidence 後）
4. GOV-RULE-01 / 04 HOLD 解除 = separate（NOT auto）
```

## Reference

- SELECT Acceptance: `decision-gov-perf-01-11-performance-bundle-acceptance.md`
- Decision Packet: `decision-gov-perf-01-11-performance-bundle-decision-packet.md`
- Option+HOLD Acceptance: `decision-gov-perf-01-11-performance-bundle-option-acceptance.md`
- Independent Review: `decision-gov-perf-01-11-performance-bundle-independent-review.md`
- Parent track: `decision-issue-19-residual-governance-selection.md`
- Prior: `decision-gov-aud-05-dec-012-post-retention-deletion-option-c-acceptance.md`
- Issue #19 §D: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
