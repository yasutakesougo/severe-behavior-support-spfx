# DEMO-UX-7 — Browser smoke evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: DEMO-UX-7 — Terminology canon + Today-actions navigation
Kind: browser smoke
Status: PASS / VERIFIED
Date: 2026-08-12
Implementation Start: demo-ux-7-implementation-start.md
Selection: decision-demo-ux-7-terminology-today-actions-selection.md（PR #320）
Baseline tip: 677d359（main at Implementation Start）

Parent: #299 RESPONSIBLE-PERSON-DEMO-V1

#299 Close: NOT AUTHORIZED
Ready / Merge: NOT AUTHORIZED
saveMutationAuthorized: false
sharePointWriteAuthorized: false
filterExecutionAuthorized: false
recordFlowRedesignAuthorized: false
visualRedesignAuthorized: false
failClosedSemanticsChangeAuthorized: false
unselectedStateRelaxationAuthorized: false
saveOutcomeUnknownNormalizationAuthorized: false
```

## Method

```text
Harness: spfx/smoke/demo-ux-7/
Runner: node spfx/smoke/demo-ux-7/run-smoke.mjs
Port: 4189
CSS: sass compile of ShellUx + DashboardUx + UsersUx + UserDetailUx
     + SupportPlanUx + DailyRecordsUx + ReviewDueStateUx
Artifacts: /opt/cursor/artifacts/demo-ux-7-browser-smoke/
```

## Browser results

| Case | Assertion | Result |
|---|---|---|
| overview-terminology-canon | 要確認 / 未記録 / 期限接近 present；確認待ち / 確認対象 / 期限間近 absent；3 today-actions enabled | PASS |
| today-action-a-to-records | A「記録する」→ 日々の記録 | PASS |
| today-action-b-to-review-due | B「確認する」→ 見直し；status=要確認；due=期限接近 | PASS |
| today-action-c-to-user-detail | C「見る」→ user-c 詳細 | PASS |
| preserve-access-denied | アクセス不可；overview hidden | PASS |
| preserve-unselected-stop | 事業所未選択で ready-region 停止 | PASS |
| preserve-save-outcome-unknown | 保存結果不明；成功/失敗へ丸めない | PASS |

```text
allPass: true
cases: 7 / 7
DEMO_UX_7_SLICE.id: DEMO-UX-7
Heft test: 70 / 70 PASS
```

## Boundary held

```text
No save mutation / SharePoint write
No RPF-003 filter execution
No RPF-002 record-flow redesign
No visual redesign
No fail-closed / unselected / save-outcome-unknown semantics change
Synthetic / DEMO indicators remain visible
```
