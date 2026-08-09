# GOV-RULE-06 — Review cadence source review

この文書は、支援計画の **見直し周期（GOV-RULE-06）** について、
国リハ資料群と現行の厚生労働省一次資料を突き合わせた **source review 結果正本** である。

本単位は **investigation / source review** である。
Human Acceptance の durable evidence は
[`decision-gov-rule-06-review-cadence-acceptance.md`](./decision-gov-rule-06-review-cadence-acceptance.md) である。
基準日・通知・期限超過判定の確定でも、`duration_days = 90` への変換実装でもない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit ID: GOV-RULE-06-SOURCE-REVIEW
Kind: source review result
Status: PASS（GOV-RULE-06 Human Accepted on 2026-08-09）
Related Issues: #16 / #19 / #24
Related Decision backlog: Decision-RD-3（接近窓・期限算出・超過後）とは分離
Related contract: review-cadence-contract.md（Accepted logical contract）
Human Acceptance: decision-gov-rule-06-review-cadence-acceptance.md
main baseline: f371f5e3c8b5ce48fe2ce0f5f27a8b5d820c9d05
Implementation: NOT STARTED
Canonical write: THIS UNIT（docs-only）+ acceptance write
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-rule-06-review-cadence-acceptance.md`](./decision-gov-rule-06-review-cadence-acceptance.md)
- [`review-cadence-contract.md`](./review-cadence-contract.md)
- [`review-due.md`](./review-due.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`domain-reconstruction-foundation.md`](./domain-reconstruction-foundation.md)

### Source review record（durable）

```text
Source review: PASS
Primary materials consulted (Human-provided synthesis):
  - 国立障害者リハビリテーションセンター 強度行動障害支援者養成研修資料
    （支援計画立案 / 支援手順書 / 行動記録 / 記録に基づく評価 / 振り返り・修正）
  - 現行 厚生労働省資料
    （障害特性のアセスメント / 環境調整 / 支援手順書による一貫支援）
「3ヶ月に1回程度」: SUPPORTED AS PRACTICE CADENCE
「90日」必須化: NOT AUTHORIZED
法令上の90日固定値: NOT ESTABLISHED
支援運用上の目安: SUPPORTED
Agent independent re-fetch of primary PDFs in this write: NOT CLAIMED
Agent execution evidence: NOT Human Decision evidence
```

## 調査結果

```text
GOV-RULE-06:
  Evidence:
    支援の定期的な評価・振り返り・修正を行う。
    運用目安は「3ヶ月に1回程度」。
  Classification:
    法令上の90日固定値: NOT ESTABLISHED
    支援運用上の目安: SUPPORTED
  Candidate:
    cadence = approximately_every_3_months
    representation = calendar-month cadence · approximate
```

### 禁止する変換（本 review の結論）

一次情報「3ヶ月に1回程度」を、次へ劣化させない。

```text
FORBIDDEN conversions:
  3ヶ月 = 90日
  91日目 = 自動的に違反
  3暦月経過 = 自動的に期限超過
  duration_days = 90 を正式な見直し周期として保存
```

現行の厚労省資料からは、強度行動障害支援について全国一律に
「90日以内」を必須とする根拠までは確認できなかった、という review 結論を維持する。

### Issue #19 判断単位への当てはめ

| ID | 問い | 本 review での扱い |
|---|---|---|
| **GOV-RULE-05** | 見直し周期を何の日から数えるか | **HOLD / 未決定** |
| **GOV-RULE-06** | 見直し周期 | **Accepted**（[`decision-gov-rule-06-review-cadence-acceptance.md`](./decision-gov-rule-06-review-cadence-acceptance.md)） |
| **GOV-RULE-07** | 何日前から注意を出すか | **HOLD / 未決定** |
| **GOV-RULE-08** | 「期限当日」「期限超過」をどう定義するか | **HOLD**。「3ヶ月に1回程度」だけでは決めない |

### Issue #16 / #24 への影響

```text
Issue #16 duration_days-only cadence design:
  REVISION CANDIDATE
  （90 を保存する設計は一次情報に忠実ではない）

Issue #24 89日 / 90日 / 91日 境界テスト:
  MUST NOT REPRESENT THE 3-MONTH PRACTICE RULE
  残すなら「日数ベース相対判定エンジンそのものの境界テスト」へ降格
  既存 evaluateReviewDueRelativeToAsOf 契約（review-due.md）とは分離維持可
```

## 資料からアプリへ採用してよい構造（流れ）

本 review が支持する業務プロセスと、現行アプリ構造の対応:

```text
本人の状態・障害特性の把握
  ↓
行動・環境の観察
  ↓
支援仮説
  ↓
支援手順書
  ↓
手順に沿ったチーム支援
  ↓
行動記録
  ↓
記録に基づく評価
  ↓
おおむね3ヶ月単位で振り返り
  ↓
必要に応じて支援手順を修正
  ↓
旧版を保持して次版へ
```

```text
App alignment (conceptual, not schema change):
  SupportPlan → Observation / ABC → Review → Version
```

国リハ資料が支援手順書・行動記録・支援振り返り・修正版支援手順書を
別教材として扱う点とも整合する、という整理である。

## Human Acceptance（完了）

```text
Human Acceptance: Explicit Human GOV-RULE-06 acceptance on 2026-08-09
Accepted:
  「3ヶ月に1回程度」
  / calendar-month cadence
  / precision = approximate
Durable evidence: decision-gov-rule-06-review-cadence-acceptance.md
Logical contract: review-cadence-contract.md（Accepted）
```

Keep as separate Decisions (HOLD):

```text
GOV-RULE-05  基準日
GOV-RULE-07  通知開始
GOV-RULE-08  期限当日・期限超過の定義
Decision-RD-3 接近窓・期限算出・超過後ポリシー（技術側）
```

## 次の substantive unit

```text
Next automatic substantive unit: NONE
Do not start automatically:
  duration_days = 90 実装
  91日目違反判定
  接近窓・通知 UI
  SupportPlan Schema 変更
  SharePoint / M365 / Deploy
  FindingCode / A-5 / Implementation Start
```

論理契約正本: [`review-cadence-contract.md`](./review-cadence-contract.md)

Acceptance 正本: [`decision-gov-rule-06-review-cadence-acceptance.md`](./decision-gov-rule-06-review-cadence-acceptance.md)

## 現時点の判定

```text
Source review: PASS
「3ヶ月に1回程度」: SUPPORTED AS PRACTICE CADENCE / Accepted
「90日」: NOT AUTHORIZED
GOV-RULE-06: Accepted
GOV-RULE-05 / 07 / 08: HOLD
Issue #24 89/90/91 tests: MUST NOT REPRESENT THE 3-MONTH PRACTICE RULE
Repository / Canonical write: THIS DOCS UNIT + acceptance write
Implementation Start: HOLD
```

## 分離（維持）

| 単位 | 状態 |
|---|---|
| `evaluateReviewDueRelativeToAsOf`（[`review-due.md`](./review-due.md)） | DONE / UNCHANGED。caller-supplied due の asOf 相対判定のみ |
| **GOV-RULE-06 source review**（本単位） | **PASS** |
| **GOV-RULE-06 Human Acceptance** | **Accepted**（[`decision-gov-rule-06-review-cadence-acceptance.md`](./decision-gov-rule-06-review-cadence-acceptance.md)） |
| Review Cadence Contract | Accepted（[`review-cadence-contract.md`](./review-cadence-contract.md)） |
| GOV-RULE-05 基準日 | HOLD |
| GOV-RULE-07 通知開始 | HOLD |
| GOV-RULE-08 期限当日・超過定義 | HOLD |
| Decision-RD-3 接近窓・算出・超過後 | HOLD（90日必須化を cadence 根拠にしない） |
| TypeScript / validator / Schema 実装 | NOT STARTED |
| SharePoint / tenant / M365 / Entra / Deploy | NO-GO |
| real data | PROHIBITED |

## 対象外

- 基準日・通知・超過判定の確定
- `reviewDueDate` 算出アルゴリズム
- SupportPlan / SharePoint Schema 変更
- `src/**` / `tests/**` 変更
- Issue #16 / #19 / #24 Close
- 90日規則の実装または再導入

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
tenant changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** / tests/**: 本単位では変更しない
evaluateReviewDueRelativeToAsOf: UNCHANGED
3ヶ月 → 90日 conversion: FORBIDDEN
AI invention of statutory 90-day mandate: FORBIDDEN
```
