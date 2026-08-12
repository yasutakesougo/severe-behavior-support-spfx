# DEMO-UX-9 — Browser smoke evidence

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-9 — Daily record experience cleanup
Harness: spfx/smoke/demo-ux-9/
Port: 4191
Artifacts: /opt/cursor/artifacts/demo-ux-9-browser-smoke/
Result: PASS（8 / 8）
```

## Slice flags verified

```text
DEMO_UX_9_SLICE.id: DEMO-UX-9
incompleteSelectionAuthorized: true
localDraftEditAuthorized: true
draftPersistenceAuthorized: false
saveMutationAuthorized: false
sharePointWriteAuthorized: false
recordCreationAuthorized: false
```

## Cases

| Case | Expectation | Result |
|---|---|---|
| incomplete-default-selects-a | default incomplete-a / person=A / draft seed / create+save disabled / recent=3 | PASS |
| select-b-follows-input-image | select B → person=B / draft follows 要確認 | PASS |
| local-edit-then-discard-on-leave | edit marker → leave → return → marker gone / seed restored | PASS |
| preserve-today-action-a | Overview A → records | PASS |
| preserve-users-filter-counts | 未記録 filter count=2（DEMO-UX-8） | PASS |
| preserve-access-denied | fail-closed | PASS |
| preserve-unselected-stop | 未選択停止 | PASS |
| preserve-save-outcome-unknown | 保存結果不明 non-round | PASS |

## Non-claims

```text
No actual save / SharePoint write / live I/O
No persisted draft / autosave
No create/save enablement
```
