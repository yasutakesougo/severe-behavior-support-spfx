# GOV-RULE-01 / 04 — Evidence → Decision Traceability

この文書は、**Decision-GOV-RULE-01-04-EVIDENCE-1** の
Evidence → Decision 追跡正本である。
Option Acceptance / HOLD解除 Acceptance ではない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Evidence → Decision traceability（docs-only）
Bundle: GOV-RULE-01 / 04 Evidence Bundle
Baseline tip: 9588805ba3b9683efb4a2db5472e5a595c3c0f6e
PR: #287
```

## Trace matrix

| Unit | Evidence conclusion | Decision status now | Next Human step |
|---|---|---|---|
| GOV-RULE-01 | アプリ独自固定周期で再採点しない。正式認定・更新・変更認定の有効期間に従う。3年は基本値であり固定再評価周期ではない | **Accepted / LOCKED** | HOLD LIFTED（Acceptance PR pending） |
| GOV-RULE-04 | MHLW 一次資料から固定観察件数・全国共通集計を確認できない。ORG_POLICY | **HOLD / UNCHANGED** | 法人運用 Decision |

## RULE-01 candidate fields → evidence link

| Candidate field | Evidence basis | Binding now? |
|---|---|---|
| 周期 = アプリ独自固定日数/月数を設定しない | Evidence + Human Acceptance | **YES（Accepted）** |
| 周期 = 正式認定・更新・変更認定の有効期間に従う | 同上 | **YES（Accepted）** |
| 追加評価 = 新正式認定 / 変更・更新認定時 | 同上 | **YES（Accepted）** |
| 決定境界 = 市町村が認定・有効期間を決定；アプリは参照・保持 | 同上 | **YES（Accepted）** |
| 3年ハードコード禁止 | 3年は基本値；短縮・変更認定あり | **YES（Accepted constraint）** |

## RULE-04 fields → evidence link

| Field | Evidence basis | Binding now? |
|---|---|---|
| 必要件数 | 固定値未確認 → ORG_POLICY | HOLD |
| 対象期間 | 同上 | HOLD |
| 数え方 | 同上 | HOLD |
| 同日複数記録 | 全国共通集計未確認 | HOLD |

## Non-claims

```text
Traceability records GOV-RULE-01 Accepted / LOCKED（Acceptance doc）
Traceability ≠ invent GOV-RULE-04 counts
Traceability ≠ authorize 3-year rescoring implementation
Traceability ≠ Implementation Start
```
