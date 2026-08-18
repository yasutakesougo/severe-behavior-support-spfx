# SUPPORT-PLAN-REVIEW-NEW-VERSION-DEMO-1 — Implementation Start

```text
Unit: SUPPORT-PLAN-REVIEW-NEW-VERSION-DEMO-1
Status: Implementation Start（this PR）
Human GO: SUPPORT-PLAN-REVIEW-NEW-VERSION-DEMO-1 START GO
Feature basis: main 8cc90d978c710b624732cd9e427a46247db13535 (PR #423 PLANNING-PC-DEMO-1)
Branch base: origin/main at start (includes later UI-AGENT docs/hooks)
Schema: SupportPlan / SupportPlanVersion 1.0.0 reuse only
LIVE WRITE / Deploy / Issue #419 / #70 mutation: NOT AUTHORIZED
```

Depends on（再 Decision しない）:

- [`decision-support-plan-lifecycle-semantics-selection.md`](./decision-support-plan-lifecycle-semantics-selection.md) D4=A / D1=B / D5=B / D6=A
- [`planning-pc-demo-1-implementation-start.md`](./planning-pc-demo-1-implementation-start.md)
- [`planning-pc-demo-1-fixture-catalog.md`](./planning-pc-demo-1-fixture-catalog.md)

## Authorized IN

```text
現在版 / 過去版の比較（v2 vs v3）
見直し材料 → 次の版の考え方
「新しい版を作る」概念導線（表示専用・disabled）
version immutability presentation（上書きせず版を重ねる）
historical ProcedureRecord は planVersion 2 のまま
observation不足 / reviewDue overdue だけでは計画無効にしない copy
PLANNER / ADMIN_AUDIT PC presentation
FIELD_STAFF 回帰（次版ブロック非表示）
fixture-driven unit tests
既存 graph contract regression
browser smoke
implementation-specific documentation
```

## Explicit OUT

```text
SupportPlanVersion persistence
Draft / PendingReview / Returned production workflow
#24 reviewDueDate origin / approaching
Observation ↔ planVersion 新 contract
Schema 1.0.0 変更
approvedBy rename / delete
LIVE WRITE
SharePoint / M365 / Entra mutation
Deploy
Issue #419 / #70 mutation
Ready / Merge auto-progress
```

## Slice flags

```text
SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.id
syntheticNextVersionConceptAuthorized = true
versionComparisonAuthorized = true
versionPersistenceAuthorized = false
draftWorkflowAuthorized = false
planMutationAuthorized = false
```

## Stop / HOLD

```text
Do not Ready / Merge automatically
Do not persist a new SupportPlanVersion
Do not implement #24 / Observation contract
STOP after implementation + evidence
Draft PR requires separate Human GO unless already authorized as candidate only
```
