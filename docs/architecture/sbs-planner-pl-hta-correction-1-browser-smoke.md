# SBS-PLANNER-PL-HTA-CORRECTION-1 — Browser smoke evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-PLANNER-PL-HTA-CORRECTION-1
kind: dedicated Class V browser smoke
status: PASS (harness). Smoke PASS ≠ Product business completion ≠ PL-HTA PASS ≠ Human Ready
date: 2026-09-19
implementation base: 7493803500438bb01ac41324a889bf40d40f75c5
harness: spfx/smoke/sbs-planner-pl-hta-correction-1/
presentationOnly: true
LIVE WRITE / Deploy / SharePoint: NOT AUTHORIZED
Human Ready / Merge / PL-HTA: NOT CONSUMED
```

## Method

```text
Do NOT inject presentationRole: "PLANNER" as the acceptance path.
Do NOT use ?cycle= / initialPlannerCycle as D-PLAN / D-MONITOR bind proof.
Role selection = Demo presentation-role entrance（計画担当）.
Person/plan acquisition = Global 探す → user-a existing-plan.
Synthetic-detail (user-b) is NOT lawful context.
Viewports: 1280×900 and 390×844
Artifacts:
  /opt/cursor/artifacts/sbs-planner-pl-hta-correction-1-browser-smoke
```

## Matrix

Rows follow runtime order in `spfx/smoke/sbs-planner-pl-hta-correction-1/run-smoke.mjs`, not capture-id order.

| Capture | Destination / surface | Observable | Result |
|---|---|---|---|
| 01-no-context-unknown-fail-closed | D-HOME | cycle unknown / Primary Action disabled | PASS |
| 02-find-person-list-not-d-plan | D-FIND-PERSON | 探す = D-FIND-PERSON; list is not D-PLAN | PASS |
| 03-synthetic-detail-not-context | D-FIND-PERSON | user-b does not establish context | PASS |
| 04-existing-plan-establishes-context | D-FIND-PERSON | user-a existing-plan → context live | PASS |
| 05-d-plan-bound-support-plan | D-PLAN | body = existing SupportPlan; Current vs 次版 | PASS |
| 08-no-overview-as-d-plan | D-PLAN | Overview dashboard not D-PLAN meaning | PASS |
| 07-zero-not-not-performed | D-PLAN / SupportPlan selected v1 / in-plan MonitoringView | 0件 copy present; not business “実施できなかった”. NOT D-MONITOR zero-count evidence | PASS |
| 06-d-monitor-bound-monitoring-view | D-MONITOR | body = existing MonitoringView for currentVersion 3 (recordCount 1); not Overview; not a 0-record capture | PASS |

```text
Capture 07 bound:
  destination = D-PLAN
  surface = SupportPlan in-plan MonitoringView
  selected plan version = 1
  recordCount = 0
Capture 07 is not:
  D-MONITOR zero-count evidence
  PL-HTA-2 consumption
D-MONITOR bind (capture 06):
  currentVersion = 3
  recordCount = 1
```

`smoke-results.json` records `allPass=true` and `smokePassIsNotBusinessCompletion=true`. That smoke-PASS string is not rendered on D-MONITOR (capture 06 / sc14). That fact is not capture 07.

## Boundary held

```text
synthetic fixture only
no LIVE WRITE / Deploy / schema / Entra / M365
A1–A14 / SC-1–SC-14 ≠ PL-HTA PASS
historical PL-HTA FAIL identity unrewritten
```
