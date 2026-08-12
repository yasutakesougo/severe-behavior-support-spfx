# GOV-RULE-01 / 04 — Evidence Bundle — Human Selection Packet

この文書は、PR #286 MERGED 後の **次 residual** として
**GOV-RULE-01 / GOV-RULE-04 Evidence Bundle** を
SELECTED / LOCKED する docs-only Selection Packet である。

厚生労働省一次資料を Evidence として Decision Packet を正本化する。
**GOV-RULE-01 の自動 Acceptance / GOV-RULE-04 の件数発明はしない。**

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-RULE-01-04-EVIDENCE-1
Kind: Human Selection（#19 residual / RULE-01/04 Evidence Bundle）
Status: SELECTED / LOCKED（bundle GO boundary）
Human Decision: SELECT GOV-RULE-01 / 04 Evidence Bundle
Date: 2026-08-12
PR: #287（Selection / Evidence Packets / traceability / IR）

Baseline:
  main tip = 9588805ba3b9683efb4a2db5472e5a595c3c0f6e
  GOV-RULE-01〜04 Options/HOLD = PR #282 MERGED
  GOV-RULE-01 / 04 = SELECTED / LOCKED / HOLD（prior）
  GOV-PERF HOLD Resolution = PR #286 MERGED

This bundle outcomes（NOT Option Acceptance）:
  GOV-RULE-01 = HOLD LIFT CANDIDATE（Accepted / LOCKED へ変更しない）
  GOV-RULE-04 = HOLD / UNCHANGED（ORG_POLICY）

NOT AUTHORIZED:
  GOV-RULE-01 自動 Acceptance
  GOV-RULE-04 件数・期間・数え方発明
  3年固定再採点の実装 / ハードコード
  支援計画・観察記録の実装変更
  SharePoint / M365 / Entra mutation
  Implementation Start / performance testing
  Issue #19 Close / next residual auto-select
  Ready / Merge（HUMAN-ONLY）
```

## 1. Selected units

| ID | Topic | This bundle |
|---|---|---|
| GOV-RULE-01 | 行動関連点数の評価周期 | Evidence Packet + **HOLD LIFT CANDIDATE** |
| GOV-RULE-04 | 必要観察件数 | Evidence Packet + **HOLD / UNCHANGED** |

```text
GOV-RULE-01 / 04 Evidence Bundle = SELECTED / LOCKED
```

## 2. Authorized IN

```text
IN:
  MHLW primary-source framed Evidence Packets（docs-only）
  Evidence → Decision traceability
  HOLD lift assessment（01 = candidate only；04 = unchanged）
  Independent Review / Draft PR 1件
```

## 3. Explicit OUT

```text
OUT:
  GOV-RULE-01 Accepted / LOCKED（要 Human Option Acceptance）
  GOV-RULE-04 固定件数の導出
  3年をアプリ固定再評価周期として確定・実装
  入力日・確認日・経過日数 alone での点数切替規則の実装
  GOV-RULE-02 / 03 / 05〜12 re-Decision
  PERF HOLD解除 / Implementation Start
```

## 4. Next（Human only）

```text
1. This PR IR → Human Ready → Human Merge
2. After Merge: Human Option Acceptance for GOV-RULE-01（if lifting）
3. GOV-RULE-04 remains HOLD until corporate ORG_POLICY Decision
4. next residual auto-select = FORBIDDEN
```

## Reference

- SELECT Acceptance: `decision-gov-rule-01-04-evidence-bundle-acceptance.md`
- RULE-01 Evidence: `decision-gov-rule-01-evaluation-cycle-evidence-packet.md`
- RULE-04 Evidence: `decision-gov-rule-04-observation-count-evidence-packet.md`
- Traceability: `decision-gov-rule-01-04-evidence-decision-traceability.md`
- IR: `decision-gov-rule-01-04-evidence-bundle-independent-review.md`
- Prior HOLD: `decision-gov-rule-01-04-observation-cycle-bundle-option-acceptance.md`
- Issue #19: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
