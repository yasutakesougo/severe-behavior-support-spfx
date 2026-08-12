# DEMO-UX-8 — Browser smoke evidence

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-8 — Users list status filter
Harness: spfx/smoke/demo-ux-8/
Port: 4190
Artifacts: /opt/cursor/artifacts/demo-ux-8-browser-smoke/
Result: PASS（8 / 8）
```

## Slice flags verified

```text
DEMO_UX_8_SLICE.id: DEMO-UX-8
filterExecutionAuthorized: true
saveMutationAuthorized: false
sharePointWriteAuthorized: false
multiSelectFilterAuthorized: false
detailPreviewExpansionAuthorized: false
recordFlowRedesignAuthorized: false
businessRuleCalculationAuthorized: false
```

## Cases

| Case | Expectation | Result |
|---|---|---|
| users-filter-all-8 | default すべて / 8 rows / 全8名 | PASS |
| users-filter-needs-review-3 | 要確認 / 3 rows / aria-pressed | PASS |
| users-filter-unrecorded-2 | 未記録 / 2 rows | PASS |
| users-filter-due-soon-3 | 期限接近 / 3 rows | PASS |
| preserve-today-action-a | Overview A → 記録（DEMO-UX-7） | PASS |
| preserve-access-denied | fail-closed | PASS |
| preserve-unselected-stop | 未選択停止 | PASS |
| preserve-save-outcome-unknown | 保存結果不明 non-round | PASS |

## Non-claims

```text
No save / SharePoint write / live I/O
No multi-select
No detail-preview expansion
No RPF-002
```
