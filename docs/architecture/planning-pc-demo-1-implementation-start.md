# PLANNING-PC-DEMO-1 — Implementation Start

```text
Issue owner: #70（CLOSED。reopen は本 GO に含まれない）
Unit: PLANNING-PC-DEMO-1 — Planning PC Synthetic Demo Slice
Status: Implementation Start（this PR）
Human GO: #70 Planning PC Synthetic Demo Slice Implementation Start GO — existing Schema 1.0.0 only
Baseline main: dfb580bb71ebd4ffb5cdbe7733b3005e8fc3082c
Browser smoke: PASS / VERIFIED（planning-pc-demo-1-browser-smoke.md）
SPFx Heft: 268 / 268 PASS
Root contract: planning-pc-demo-graph-contract.test.ts PASS
Depends on:
  Decision-SUPPORT-PLAN-LIFECYCLE-SEMANTICS-1 (SELECTED / LOCKED)
  SUPPORT-PLAN-CONTRACT-IMPACT-1 COMPLETE on main (PR #422)
Schema: SupportPlan / SupportPlanVersion 1.0.0 reuse only
LIVE WRITE / Deploy / Issue #419 close / #70 reopen: NOT AUTHORIZED
```

Depends on（再 Decision しない）:

- [`decision-support-plan-lifecycle-semantics-selection.md`](./decision-support-plan-lifecycle-semantics-selection.md)
- [`support-plan-contract-impact-assessment-sp-lc-1.md`](./support-plan-contract-impact-assessment-sp-lc-1.md)
- [`demo-ux-4-implementation-start.md`](./demo-ux-4-implementation-start.md)
- [`field-workflow-ui-implementation-start.md`](./field-workflow-ui-implementation-start.md)
- [`decision-shell-ux-7-navigation-destination-placeholders-selection.md`](./decision-shell-ux-7-navigation-destination-placeholders-selection.md)

Fixture catalog:

- [`planning-pc-demo-1-fixture-catalog.md`](./planning-pc-demo-1-fixture-catalog.md)

## Authority

```text
SUPPORT-PLAN-CONTRACT-IMPACT-1 ≠ Implementation Start
Decision-SUPPORT-PLAN-LIFECYCLE-SEMANTICS-1 ≠ #70 UI GO

This document records the separate Human GO for the Planning PC synthetic demo slice.
```

## Authorized IN

```text
現在の SupportPlan 表示（Aさん / synthetic-plan-001 / Active）
Version 表示（現行 v3）
Active を「適用中」と表示
approvedBy / approvedAt を制度上の最終承認として見せない
現在の支援手順（既存 A2 projection）
最近の ProcedureRecord（v2 固定。最新 Active へ付け替えない）
過去 version 一覧（読み取り専用）
見直し導線（材料確認。due 起算 / approaching は計算しない）
完全合成 fixture グラフ
Planning PC 向け presentation（presentationRole=PLANNER）
users 配下の SupportPlan → ReviewDueState 入れ子戻し
fixture-driven unit tests / root graph contract tests
browser smoke evidence
implementation-specific documentation
```

## Explicit OUT

```text
Schema 1.0.0 変更
src/domain/support-plan.ts 型 / validator 変更
approvedBy rename / delete
#24 reviewDueDate 起算 / approaching
Observation ↔ planVersion 新 contract
LIVE WRITE
SharePoint write
Deploy / App Catalog
Issue #419 close
Issue #70 reopen
Issue #26 reopen
Plans / Administration primary-nav expansion
Draft → Active skip
作成・編集・保存の実操作
FIELD_STAFF 記録フロー改変
Ready / Merge auto-progress
```

## Presentation navigation boundary

```text
PLANNING_PC_DEMO_1_SLICE.id = PLANNING-PC-DEMO-1
syntheticPlanningPcNavigationAuthorized = true
liveSupportPlanNavigationAuthorized = false
planMutationAuthorized = false
schemaChangeAuthorized = false
approvedByRenameAuthorized = false
reviewDueOriginAuthorized = false
liveWriteAuthorized = false
deployAuthorized = false
```

入れ子:

```text
利用者詳細（Aさん）
  → 支援計画（既存 DEMO-UX-4 nested preview）
       PLANNER / ADMIN_AUDIT: 適用中 + v3 + 手順 + 最近の記録 + 過去版 + 見直し導線
       FIELD_STAFF: 既存 DEMO-UX-4 骨格 + 適用中ラベル
  → 見直し材料（ReviewDueState、users 配下。概要の review_due とは別）
       戻る → 支援計画
```

## Stop / HOLD

```text
Do not Ready / Merge automatically
Do not reopen #70
Do not close #419
Do not change Schema 1.0.0
Do not enable live I/O / REST / binder / SharePoint write
Do not implement review-due origin / approaching (#24)
STOP at Draft PR after evidence
```
