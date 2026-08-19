# SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1 — Implementation Start

```text
Issue owner: #444（OPEN。close は本 GO に含まれない）
Unit: SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1
Status: Implementation Start（this PR）
Human GO: SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1 IMPLEMENTATION START GO
Baseline main: ea6ec1c1671041c87b9bb0222e1d23370aadb806
Schema: SupportPlan / SupportPlanVersion 1.0.0 reuse only
LIVE WRITE / Deploy / Issue #444 close / #70 reopen: NOT AUTHORIZED
```

Depends on（再 Decision しない）:

- [`decision-support-plan-management-list-ui-1-selection.md`](./decision-support-plan-management-list-ui-1-selection.md)
- [`decision-support-plan-management-list-ui-1-acceptance.md`](./decision-support-plan-management-list-ui-1-acceptance.md)
- [`support-plan-management-list-demo-1-scope.md`](./support-plan-management-list-demo-1-scope.md)
- [`decision-support-plan-lifecycle-semantics-selection.md`](./decision-support-plan-lifecycle-semantics-selection.md)
- [`planning-pc-demo-1-implementation-start.md`](./planning-pc-demo-1-implementation-start.md)

## Authority

```text
Decision-SUPPORT-PLAN-MANAGEMENT-LIST-UI-1 ≠ Implementation Start
Scope Freeze ≠ Implementation Start

This document records the separate Human GO for the presentation-only list demo.
Human instruction: Implement the gated plan as specified（2026-08-19）
  including SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1 IMPLEMENTATION START GO
```

## Authorized IN

```text
synthetic Family P fixture（A〜E / 5 状態）
支援計画一覧 DestinationList（PLANNER × users 未選択）
compact KPI 導出（ハードコード禁止）
今日やること導出
Version / 最終観察日 / 見直し目安 / 要対応
詳細を見る → 既存 SupportPlan（Aさん）または temporary synthetic detail
新規作成 → demo-only 入口（disabled）
既存 AppShellChrome / DemoBanner / primary nav 維持
FIELD_STAFF UsersList 非変更
fixture-driven unit tests
browser smoke
a11y gate
implementation-specific documentation
PLANNING-PC-DEMO-1 / REVIEW-NEW-VERSION smoke の PLANNER 入口更新
  （UsersList 経由から一覧 1 操作へ）
```

## Explicit OUT

```text
SharePoint 列追加
LIVE WRITE
保存 API / 実データ
権限変更
状態遷移実装
Deploy / Redeploy
Schema 1.0.0 変更
approvedBy rename / delete
#24 reviewDueDate origin / approaching
FIELD_STAFF 画面 / save 5-state 変更
Plans / Administration primary-nav
詳細画面の完成
新規作成の永続化
Issue #444 close
#70 reopen
Ready / Merge auto-progress
```

## Slice flags

```text
SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE.id = SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1
presentationOnly = true
plannerUsersDestinationListAuthorized = true
syntheticFixtureAuthorized = true
demoNavigationAuthorized = true
liveTenantIoAuthorized = false
sharePointWriteAuthorized = false
planMutationAuthorized = false
schemaChangeAuthorized = false
approvedByRenameAuthorized = false
reviewDueOriginAuthorized = false
statusTransitionAuthorized = false
fieldStaffUsersListChangeAuthorized = false
saveStateSemanticsChangeAuthorized = false
primaryNavExpansionAuthorized = false
liveWriteAuthorized = false
deployAuthorized = false
```

## Presentation navigation boundary

```text
PLANNER / destination users / no nested surface
  → SupportPlanManagementList
詳細を見る（Aさん）
  → 既存 SupportPlan。戻る → 一覧（← 支援計画）
詳細を見る（B/C/D）
  → temporary synthetic detail。戻る → 一覧
新規作成（Eさん）
  → demo-only 入口。作成・保存は disabled
FIELD_STAFF / ADMIN_AUDIT
  → 既存 UsersList
```

## Stop / HOLD

```text
Do not Ready / Merge automatically
Do not close #444
Do not reopen #70
Do not change Schema 1.0.0
Do not enable live I/O / REST / binder / SharePoint write
Do not implement review-due origin / approaching (#24)
Do not change FIELD_STAFF save 5-state
STOP at Draft PR after evidence
Fresh Review / Ready / Merge remain Human GO
KPI lock: Family P counts are derived（fixture 5 rows → 要確認=2 / 見直し時期=1 / 観察待ち=1）
```
