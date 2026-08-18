# SUPPORT-PLAN-REVIEW-NEW-VERSION-DEMO-1 — Browser smoke evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: SUPPORT-PLAN-REVIEW-NEW-VERSION-DEMO-1
Kind: browser smoke
Status: PASS / VERIFIED
Date: 2026-08-18
Implementation Start: support-plan-review-new-version-demo-1-implementation-start.md
Feature basis: main 8cc90d978c710b624732cd9e427a46247db13535 (PR #423)
Branch base: origin/main at start of this GO

Issue #419 / #70 mutation: NOT AUTHORIZED
Schema change: NOT AUTHORIZED
LIVE WRITE / Deploy: NOT AUTHORIZED
presentationOnly: true
syntheticNextVersionConceptAuthorized: true
versionPersistenceAuthorized: false
draftWorkflowAuthorized: false
```

## Method

```text
Harness: spfx/smoke/support-plan-review-new-version-demo-1/
Runner: node spfx/smoke/support-plan-review-new-version-demo-1/run-smoke.mjs
CSS: ShellUx + DashboardUx + UsersUx + UserDetailUx + SupportPlanUx + ReviewDueStateUx
Artifacts (local): spfx/smoke/support-plan-review-new-version-demo-1/artifacts/
presentationRole: PLANNER (primary), ADMIN_AUDIT (read), FIELD_STAFF (regression)
```

## Browser results

| Case | Assertion | Result |
|---|---|---|
| planner-next-version-concept | 適用中 / 次の版の考え方 / 概念上の版 4 / 作成 CTA disabled / 無効化しない copy | PASS |
| planner-version-compare-v2 | v2 vs v3 比較。v2 記録は計画版 2。record id を本文に出さない | PASS |
| planner-review-materials-next-version-cta | 見直し材料で plan v2 を開き、付け替えない投影 + 「次の版の考え方を見る」 | PASS |
| planner-review-to-next-version-concept | 支援計画へ戻り next-version を highlight | PASS |
| admin-audit-next-version-concept | 次版ブロックあり・作成 CTA なし・適用中・禁止トークンなし | PASS |
| field-staff-next-version-hidden | FIELD_STAFF に次版ブロック・比較なし | PASS |

```text
allPass: true
cases: 6 / 6
SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.id: SUPPORT-PLAN-REVIEW-NEW-VERSION-DEMO-1
SPFx Heft test: 270 / 270 PASS（support-plan.test 13 cases）
Root contract test: planning-pc-demo-graph-contract.test.ts 4 / 4 PASS
check:a11y: PASS（A11Y-HD-07 / A11Y-SP-01 / A11Y-DIS-04）
```

## Boundary held

```text
No Schema 1.0.0 change
No SupportPlanVersion persistence / Draft workflow
No approvedBy rename / 最終承認者 presentation
No review-due origin / approaching calculation
No Observation ↔ planVersion contract addition
No live plan mutation / adapter fetch
No SharePoint / Deploy / production write
Aさん only = synthetic local preview via React state
```
