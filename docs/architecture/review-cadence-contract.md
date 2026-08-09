# 見直し周期（Review Cadence）論理契約

## 目的

Issue #16 / #19 / #24 にまたがる **支援運用上の見直し周期** を、
一次情報「3ヶ月に1回程度」を劣化させずに保持する論理契約として固定する。

本単位は **Accepted logical contract** である（GOV-RULE-06）。
実装開始・Schema 変更・通知・期限超過判定は含めない。
基準日（GOV-RULE-05）は別契約 [`review-anchor-contract.md`](./review-anchor-contract.md)。
既存の `evaluateReviewDueRelativeToAsOf`（[`review-due.md`](./review-due.md)）を変更しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Contract ID: ReviewCadence
Kind: logical contract（Implementation Start ではない）
Status: Accepted（GOV-RULE-06 Human Acceptance）
Human Acceptance: decision-gov-rule-06-review-cadence-acceptance.md
Source review: decision-gov-rule-06-review-cadence-source-review.md（PASS）
Related Issues: #16 / #19 / #24
Related: Decision-RD-3 HOLD（接近窓・算出・超過後。本 cadence と混ぜない）
main baseline（candidate write）: f371f5e3c8b5ce48fe2ce0f5f27a8b5d820c9d05
Acceptance baseline: 5cc03cffcdfbdd5c5a6e1ca9e1d9fbbaa4718a52
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-rule-06-review-cadence-acceptance.md`](./decision-gov-rule-06-review-cadence-acceptance.md)
- [`decision-gov-rule-06-review-cadence-source-review.md`](./decision-gov-rule-06-review-cadence-source-review.md)
- [`decision-gov-rule-05-review-anchor-acceptance.md`](./decision-gov-rule-05-review-anchor-acceptance.md)
- [`review-anchor-contract.md`](./review-anchor-contract.md)
- [`review-due.md`](./review-due.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

## 背景

Issue #16 系で想定され得る `duration_days` 単独表現は、
「3ヶ月に1回程度」を `90` へ丸める危険がある。

source review（[`decision-gov-rule-06-review-cadence-source-review.md`](./decision-gov-rule-06-review-cadence-source-review.md)）および
Human Acceptance（[`decision-gov-rule-06-review-cadence-acceptance.md`](./decision-gov-rule-06-review-cadence-acceptance.md)）:

```text
「3ヶ月に1回程度」: SUPPORTED AS PRACTICE CADENCE / Accepted
「90日」: NOT AUTHORIZED as nationwide mandatory statutory value
GOV-RULE-06: Accepted
GOV-RULE-05: Accepted（別正本）
GOV-RULE-07 / 08: HOLD
```

したがって本契約は **近似の暦月周期** を保持し、日数固定値へ変換しない。

## Decision 単位（混ぜない）

| ID | 決める内容 | 決めない内容 | 状態 |
|---|---|---|---|
| **GOV-RULE-06** | 見直し周期の practice cadence 表現 | 基準日・通知・超過定義 | **Accepted** |
| GOV-RULE-05 | 何の日から数えるか | cadence 本体 | **Accepted**（[`review-anchor-contract.md`](./review-anchor-contract.md)） |
| GOV-RULE-07 | 何日前から注意を出すか | cadence 本体 | HOLD |
| GOV-RULE-08 | 期限当日・期限超過の定義 | cadence 本体 | HOLD |
| Decision-RD-1/RD-2 | caller-supplied due の asOf 相対判定所有・境界 | cadence / 制度窓 | Accepted（既存） |
| Decision-RD-3 | 接近窓・期限算出・超過後ポリシー | practice cadence の一次表現 | HOLD |

## Accepted 型

一次情報を劣化させない保持面:

```ts
type ReviewCadence = {
  unit: "month";
  interval: 3;
  precision: "approximate";
};
```

意味:

| フィールド | 値 | 意味 |
|---|---|---|
| `unit` | `"month"` | 暦月単位の周期概念。日数単位ではない |
| `interval` | `3` | 3 単位ごと |
| `precision` | `"approximate"` | 「程度」を保持する。厳密期限エンジンではない |

同等の論理ラベル:

```text
cadence = approximately_every_3_months
representation = calendar-month cadence · approximate
```

### 禁止表現（Accepted 契約の不変条件）

GOV-RULE-06 Accepted から次は導出しない。

```text
MUST NOT store as sole canonical cadence:
  duration_days: 90

MUST NOT imply from this contract / GOV-RULE-06 Accepted:
  90日
  91日目から overdue
  3暦月経過で自動違反
  due = anchor + 90 days
```

`duration_days` を技術エンジンの入力として使う場合でも、
それを **GOV-RULE-06 の正本表現** にしてはならない。

## 既存 review-due 純関数との関係

| 契約 | 役割 |
|---|---|
| 本 Review Cadence | practice cadence の意味保持（月・近似） |
| [`review-due.md`](./review-due.md) | 呼び出し側が与えた `reviewDueDate` と `asOf` の東京暦日相対判定 |

```text
evaluateReviewDueRelativeToAsOf: UNCHANGED
ReviewCadence + ReviewAnchor → reviewDueDate 自動算出: OUT / HOLD（GOV-RULE-08・RD-3 / Implementation Entry）
```

日数境界（例: 基準日から 89 / 90 / 91 日）のテストが残る、または将来追加される場合:

```text
Classification:
  technical boundary tests for a day-based relative engine
MUST NOT:
  represent the official 3-month practice cadence rule
```

## IN

- practice cadence の論理表現（month / interval / approximate）
- 「3ヶ月に1回程度」一次情報の保持
- GOV-RULE-06 Accepted との対応
- GOV-RULE-05 / 07 / 08 / RD-3 との分離明示
- docs-only 論理契約の固定

## OUT

- 通知窓・超過定義の確定（GOV-RULE-07 / 08）
- `reviewDueDate` 算出・既定付与
- SupportPlan Schema / DTO / SharePoint 列変更
- `evaluateReviewDueRelativeToAsOf` の変更
- 90日規則の実装
- UI 通知
- repository / SharePoint / Authorization / SPFx
- Entra ID / Microsoft 365 / deploy
- Issue #16 / #19 / #24 Close

## Entry Criteria（実装・Schema 反映の前）

次をすべて要求する。

- GOV-RULE-06 が Human Accepted（practice cadence のみ）— **充足**
- GOV-RULE-05 が Human Accepted（基準日）— **充足**（別正本）
- 本契約と Accepted 内容が一致する — **充足**
- GOV-RULE-07 / 08 を本実装へ混ぜない（未 Accepted なら HOLD）
- `duration_days = 90` を正式 cadence として導入しない
- 既存 `review-due` 相対判定へ制度 cadence を埋め込まない
- Schema / SharePoint 変更が必要なら別 Decision / 別 PR
- 完全合成データだけを使用する
- Human Implementation Start（別 Gate）

## Gate

```text
Source review: PASS
GOV-RULE-06: Accepted
GOV-RULE-05: Accepted（別正本）
ReviewCadence contract: Accepted（logical only）
GOV-RULE-07 / 08: HOLD
Decision-RD-3: HOLD
3ヶ月 → 90日 conversion: FORBIDDEN
Implementation Start: HOLD
Issue Close (#16 / #19 / #24): NO-GO
SharePoint / Entra ID / Microsoft 365: NO-GO
Deploy: NO-GO
```

## 実装配置（別 PR・別 Entry）

Acceptance 済みでも自動開始しない。別 Entry / Human Implementation Start が必要。

候補（未着手）:

- Domain 型として `ReviewCadence` を持つ場合: `src/domain/support-plan.ts` または隣接モジュール
- contracts tests: cadence 表現が日数へ潰されないこと
- Schema 反映は SupportPlan / mapping の別 Decision

本 docs-only 単位では `src/**` / `tests/**` を変更しない。

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** / tests/**: 本単位では変更しない
evaluateReviewDueRelativeToAsOf: UNCHANGED
statutory 90-day mandate invention: FORBIDDEN
```
