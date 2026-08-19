# SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1 — Browser smoke evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1
Kind: browser smoke
Status: PASS / VERIFIED
Date: 2026-08-19
Implementation Start: support-plan-management-list-demo-1-implementation-start.md
Baseline main: ea6ec1c1671041c87b9bb0222e1d23370aadb806

Issue owner: #444
Issue #444 close: NOT AUTHORIZED
Schema change: NOT AUTHORIZED
LIVE WRITE / Deploy: NOT AUTHORIZED
presentationOnly: true
plannerUsersDestinationListAuthorized: true
```

## Method

```text
Harness: spfx/smoke/support-plan-management-list-demo-1/
Runner: node spfx/smoke/support-plan-management-list-demo-1/run-smoke.mjs
CSS: ShellUx + DashboardUx + UsersUx + UserDetailUx + SupportPlanUx + SupportPlanManagementListUx + ReviewDueStateUx
Artifacts (local): /opt/cursor/artifacts/support-plan-management-list-demo-1-browser-smoke
presentationRole: PLANNER (primary), FIELD_STAFF / ADMIN_AUDIT (regression)
```

## Browser results

| Case | Assertion | Result |
|---|---|---|
| desktop-planner-list | h1 支援計画 / Family P 2-1-1 / 5 rows / 未作成 / 詳細と新規作成 / 禁止トークンなし | PASS |
| desktop-detail-one-click | Aさん 詳細を見る → SupportPlan 1 操作。戻るは ← 支援計画 | PASS |
| desktop-create-entrance | Eさん 新規作成 → disabled 作成する | PASS |
| desktop-synthetic-detail | Bさん temporary synthetic detail | PASS |
| field-staff-users-list-regression | FIELD_STAFF は UsersList のまま | PASS |
| admin-audit-users-list-unchanged | ADMIN_AUDIT は UsersList のまま | PASS |
| keyboard-detail-enter | Enter で Aさん詳細 | PASS |
| desktop-200-percent-equivalent | 640×900 / dsf 2 でも主要情報へ到達 | PASS |
| narrow-pc-width | 768px でも一覧が折り畳まれ到達可能 | PASS |

```text
allPass: true
cases: 9 / 9
SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE.id: SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1
SPFx Heft test: 285 / 285 PASS
Root tests: 732 PASS
check:a11y: PASS（35 checks；A11Y-HD-08 / A11Y-SPML-01 added）
PLANNING-PC-DEMO-1 smoke: 4 / 4 PASS
SUPPORT-PLAN-REVIEW-NEW-VERSION-DEMO-1 smoke: 6 / 6 PASS
```

## Boundary held

```text
No Schema 1.0.0 change
No approvedBy rename / 最終承認者 presentation
No 90-day expiry
No live plan mutation / adapter fetch
No SharePoint / Deploy / production write
FIELD_STAFF UsersList unchanged
```
