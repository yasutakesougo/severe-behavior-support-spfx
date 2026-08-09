# SupportPlan status transition 技術契約

この文書は、Issue #24 / SupportPlan status transition（狭域・ロールなし）に関する技術契約正本である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Owner: Issue #24
Decision: Accepted comment 5211039927
SupportPlanStatus 型正本: Issue #26 / PR #39
Schema / DTO: Issue #42
Implementation GO: GO（承認範囲のみ・PR-I）
選定ゲート PR: #73（docs-only）
```

上位入口: [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 目的

`SupportPlanStatus` の許可遷移だけを、例外を投げない domain 純粋関数として契約化する。

本契約は「現在状態＋要求遷移 → 許可/拒否」境界だけを固定する。

## 状態集合（再定義しない）

Issue #26 で確定済みの値のみを用いる。

```text
Draft
PendingReview
Returned
Active
Closed
```

`SupportPlanStatus` 型・値一覧・状態別必須メタデータ validator の再定義は行わない。

## 許可遷移表

本単位で許可する辺は次の 5 辺のみとする（Accepted `5211039927`）。

| from | to |
|---|---|
| Draft | PendingReview |
| PendingReview | Returned |
| Returned | Draft |
| PendingReview | Active |
| Active | Closed |

次はすべて `INVALID_TRANSITION` とする。

- 自己遷移
- Draft → Active
- Closed → Active
- Active → Draft
- Active → PendingReview
- Returned → Active
- Closed からの任意遷移
- 上記以外のスキップ・逆行

## 関数契約

```ts
transitionSupportPlanStatus(
  currentStatus: unknown,
  targetStatus: unknown
): SupportPlanStatusTransitionResult

SupportPlanStatusTransitionResult =
  | { ok: true; status: SupportPlanStatus }
  | { ok: false; code: "MALFORMED_INPUT" | "INVALID_TRANSITION" }
```

規則:

1. 例外を投げない。
2. `currentStatus` / `targetStatus` のいずれかが `SupportPlanStatus` でなければ `MALFORMED_INPUT`。
3. 両方合法でも許可表外なら `INVALID_TRANSITION`。
4. 成功時 `status` は `targetStatus` と一致する。
5. ロール判定・承認者判定・Active一意性・観察期間・見直し期限・RuleSetVersion・永続化・adapter・時刻生成を含めない。
6. SupportPlan レコード全体の書き換えや履歴メタデータ付与は本単位の対象外とする。

定数: `SUPPORT_PLAN_STATUS_ALLOWED_TRANSITIONS`

## 実装配置

- `src/domain/support-plan.ts` — `transitionSupportPlanStatus` / Result 型 / 許可表定数 / `isSupportPlanStatus`
- `tests/contracts/support-plan-status-transition-contract.test.ts` — 許可・拒否・不正入力

## 対象外 / HOLD

- SupportPlanStatus / SupportPlan 契約の再定義
- ロール・権限・approvedBy 等の業務承認者判定
- 提出・差戻しロール Binding（DEC-008 Option C: application に固定しない / NOT ADOPTED）
- Active 計画一意性
- 観察期間
- 見直し期限の算出・接近/超過
- RuleSetVersion 選択
- Repository / SharePoint 永続化
- SPFx / UI
- Issue #19 未決定事項
- Handoff / Finding / AssessmentSnapshot
- Entra ID / Microsoft 365 / deploy / 実データ
- Issue #24 Close

DEC-008 提出・差戻し Acceptance: [`decision-dec-008-submit-return-roles-acceptance.md`](./decision-dec-008-submit-return-roles-acceptance.md)（Option C）。本契約の role-free 境界と整合。

## レビュー・テスト・完了判定基準（正本）

PR #74 および本技術契約のレビュー・テスト・完了判定は、次の境界だけを正本とする。

### IN（実装対象）

```text
Draft -> PendingReview
PendingReview -> Returned
Returned -> Draft
PendingReview -> Active
Active -> Closed
上記以外の fail-closed 拒否（INVALID_TRANSITION / MALFORMED_INPUT）
技術契約
domain 純関数
unit / contract tests
```

### 混入禁止（差分に入った時点でスコープ逸脱）

```text
ロール判定
Active 一意性
観察期間
見直し期限
RuleSetVersion
SharePoint
repository 永続化
SPFx / UI
```

判定規則:

1. IN 以外の業務ロジック・永続化・UI・ロール判定が差分へ入ったら **スコープ逸脱** とする。
2. テストは許可5辺と fail-closed 拒否（禁止辺・malformed）の充足だけで完了判定する。
3. 混入禁止対象の未実装は欠陥ではなく、本単位の正常な OUT とする。

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
```
