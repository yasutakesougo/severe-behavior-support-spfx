# Decision Packet — GOV-RULE-08 due / overdue 定義

この文書は、**GOV-RULE-08**（見直しの期限当日 / 期限超過の定義）の
**Human Decision Packet** である。

値の採択・Accepted ではない。
Agent が due / overdue 規則を発明しない。
Implementation Start ではない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-RC-4 / GOV-RULE-08
Kind: Human Decision packet
Status: CONSUMED（Human Decision Accepted / Option A / NOT ADOPTED）
Accepted 正本: decision-gov-rule-08-due-overdue-acceptance.md
Logical contract: review-due-overdue-contract.md
PR #135 / GOV-RULE-06: MERGED（Accepted）
PR #136 / GOV-RULE-05: MERGED（Accepted）
PR #137 / GOV-RULE-07: MERGED（Accepted / Option C）
  merge commit: ba97f2df2cf369454dd6ab0670fca0bfbb1e1436
  merged head: 3ed2159beb9cd71edf4db7b18b6cfdacd2a805ac
main baseline: ba97f2df2cf369454dd6ab0670fca0bfbb1e1436
GOV-RULE-05: Accepted（main）
GOV-RULE-06: Accepted（main）
GOV-RULE-07: Accepted / Option C（main）
GOV-RULE-08: Accepted / Option A / NOT ADOPTED
duration_days = 90: NOT AUTHORIZED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-rule-05-review-anchor-acceptance.md`](./decision-gov-rule-05-review-anchor-acceptance.md)
- [`decision-gov-rule-06-review-cadence-acceptance.md`](./decision-gov-rule-06-review-cadence-acceptance.md)
- [`decision-gov-rule-07-notice-acceptance.md`](./decision-gov-rule-07-notice-acceptance.md)
- [`review-anchor-contract.md`](./review-anchor-contract.md)
- [`review-cadence-contract.md`](./review-cadence-contract.md)
- [`review-notice-contract.md`](./review-notice-contract.md)
- [`review-due.md`](./review-due.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

## 1. Current canonical state

```text
GOV-RULE-05 Accepted:
  初回基準日 = 支援計画の有効開始日
  2回目以降 = 前回見直し日

GOV-RULE-06 Accepted:
  「3ヶ月に1回程度」
  / calendar-month cadence
  / precision = approximate

GOV-RULE-07 Accepted / Option C:
  見直し対象となる暦月に入ったら通知する
  意味 = 「見直し時期です」と職員へ知らせる
  precision = approximate

Existing technical pure function（業務 due 定義ではない）:
  evaluateReviewDueRelativeToAsOf(reviewDueDate, asOf)
  → BEFORE_DUE | DUE | OVERDUE | MALFORMED_INPUT
  （caller-supplied reviewDueDate の東京暦日相対判定のみ）
```

問い（GOV-RULE-08）:

> 「期限当日」「期限超過」を、支援運用上どう定義するか。
> あるいは、hard due / overdue を当面採択しないか。

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| GOV-RULE-05 | 基準日 | Accepted / 触らない |
| GOV-RULE-06 | practice cadence | Accepted / 触らない |
| GOV-RULE-07 | 通知開始 | Accepted / 触らない |
| **GOV-RULE-08** | due / overdue 定義 | **Accepted / Option A / NOT ADOPTED**（本 packet 消費） |
| Decision-RD-3 | 接近窓・算出・超過後の技術ポリシー | HOLD / 混ぜない |
| `evaluateReviewDueRelativeToAsOf` | caller-supplied due の相対判定 | UNCHANGED / 再定義しない |
| Implementation | Schema / UI / 違反判定実装 | HOLD / 混ぜない |

```text
GOV-RULE-08 ≠ GOV-RULE-07
通知月に入った ≠ overdue
通知が出た ≠ 業務違反

GOV-RULE-08 ≠ GOV-RULE-06 day conversion
3ヶ月に1回程度 ≠ 90日
91日目 ≠ 自動 overdue

GOV-RULE-08 ≠ evaluateReviewDueRelativeToAsOf の再発明
技術相対判定は既存契約のまま。本 packet は業務意味の due/overdue を決める。
```

## 3. 依存関係上の注意

GOV-RULE-06 は **approximate**、GOV-RULE-07 は **calendar-month notice** である。
したがって hard due を日数で切ると、一次情報を硬化させる危険がある。

```text
If overdue = day-count from anchor（例: 91日）:
  conflicts with NOT AUTHORIZED duration_days=90 posture unless Human explicitly adopts another day rule
  FORBIDDEN for Agent to invent

If overdue = after target review calendar month ends:
  can align with Option C notice without requiring 90-day rule
  still needs Human to say whether month-end is "due day" or only soft guidance

If hard due / overdue = NOT ADOPTED:
  notice remains informational only
  evaluateReviewDueRelativeToAsOf may still exist for caller-supplied dates
  business violation semantics stay OUT
```

## 4. Human が決める最小セット

1. **hard due / overdue を採択するか**（採択 / 当面不採用）
2. 採択する場合の **due の定義**（何をもって期限当日とするか）
3. 採択する場合の **overdue の定義**（何をもって期限超過とするか）
4. **業務違反との関係**（overdue = 違反か / 運用上の遅れ表示に留めるか）
5. GOV-RULE-07 通知との関係（通知開始後・対象月中・翌月以降のどこで overdue になり得るか）
6. 既存 `reviewDueDate` / `evaluateReviewDueRelativeToAsOf` をどう使うか（再利用 / 別概念 / 当面使わない）

Agent は具体日数や「翌月1日=overdue」等を Binding 推薦しない。

## 5. Option 骨格（値は Human が埋める）

### Option A — hard due / overdue を当面採択しない — **Selected**

```text
Selected by Human Decision on 2026-08-09:
  GOV-RULE-08: NOT ADOPTED for current scope
  business overdue / violation: DO NOT START
  GOV-RULE-07 notice remains informational
  evaluateReviewDueRelativeToAsOf: technical helper for caller-supplied dates only
Accepted 正本: decision-gov-rule-08-due-overdue-acceptance.md
```

### Option B — 暦月ベースの due / overdue（GOV-RULE-07 と整合しやすい）

```text
Not selected
```

### Option C — caller-supplied `reviewDueDate` のみを due とし、業務規則は持たない

```text
Not selected
```

### Option D — anchor + cadence から due を導出（硬化リスク高）

```text
Not selected
```

### Option E — その他（Human 明示）

```text
Not selected
```

## 6. 禁止事項

```text
FORBIDDEN:
  Agent が 90日 / 91日目 overdue / 3暦月自動違反 を発明して Accepted 扱いすること
  通知月に入った = overdue とみなすこと
  通知が出た = 業務違反 とみなすこと
  GOV-RULE-08 と GOV-RULE-07 を一括 Accepted して曖昧にすること
  evaluateReviewDueRelativeToAsOf へ制度接近窓・cadence 定数を埋め込むこと
  Implementation / UI / SharePoint / FindingCode を本 packet で開始すること
  NOT ADOPTED を黙って hard due 実装へ進めること
```

## 7. Accepted 論理面

正本:

- [`decision-gov-rule-08-due-overdue-acceptance.md`](./decision-gov-rule-08-due-overdue-acceptance.md)
- [`review-due-overdue-contract.md`](./review-due-overdue-contract.md)

```ts
type ReviewDueOverduePolicy = {
  kind: "not_adopted";
};
```

## 8. Human Decision 記録欄

```text
Human Decision: Explicit Human GOV-RULE-08 acceptance on 2026-08-09
GOV-RULE-08: Accepted
Selected Option: A
hard due/overdue adopted: NO / NOT ADOPTED
due definition: N/A（不採択）
overdue definition: N/A（不採択）
violationMeaning: NONE / DO NOT START
relation to GOV-RULE-07 notice: informational only（≠ overdue / ≠ 違反）
relation to evaluateReviewDueRelativeToAsOf: UNCHANGED technical helper
Implementation Start: HOLD
```

## 9. Gate

```text
Packet: CONSUMED
GOV-RULE-05 / 06 / 07: Accepted（main）
GOV-RULE-08: Accepted / Option A / NOT ADOPTED
duration_days = 90: NOT AUTHORIZED
Implementation Start: HOLD
SharePoint / M365 / Deploy: NO-GO
src/** / tests/**: 本 packet / acceptance では変更しない
evaluateReviewDueRelativeToAsOf: UNCHANGED
```

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** / tests/**: 本 packet では変更しない
evaluateReviewDueRelativeToAsOf: UNCHANGED
AI invention of 90/91-day overdue rules: FORBIDDEN
notice-month = overdue invention: FORBIDDEN
```
