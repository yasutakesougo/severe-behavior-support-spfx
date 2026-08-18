# PLANNING-PC-DEMO-1 — Synthetic fixture catalog

Status: **ADDITIVE**（Schema 1.0.0 非変更）

Slice: `PLANNING-PC-DEMO-1`
Human GO: existing Schema 1.0.0 only
Baseline main: `dfb580bb71ebd4ffb5cdbe7733b3005e8fc3082c`

SPFx isolated boundary: shell presentation fixtures do **not** import `src/domain`.
Root tests validate the same identity graph with existing Schema 1.0.0 validators.

## Identity join

Field-workflow (`FIELD-WORKFLOW-UI`) と同一キーで結合する。label-only 断片にしない。

| Key | Value |
|---|---|
| OrganizationId | `synthetic-org-001` |
| SiteId | `SITE-ISG` |
| UserId（shell） | `user-a` |
| Person | Aさん |
| PlanId | `synthetic-plan-001` |
| Current version | `3` |
| Current status | `Active`（表示: 適用中） |
| Past versions | `1`, `2`（読み取り専用） |
| Current procedure | `synthetic-procedure-p3` / `synthetic-procedure-p3-v1` |
| Historical procedure | `synthetic-procedure-p2` / `synthetic-procedure-p2-v1` |
| Historical record | `synthetic-proc-rec-v2-001` bound to planVersion **2** |

## Graph

```text
SupportPlan (Active, currentVersion=3)
  ├── SupportPlanVersion v1 (historical)
  ├── SupportPlanVersion v2 (historical)
  │     ├── Binding → Procedure p2
  │     └── ProcedureRecord synthetic-proc-rec-v2-001 (planVersion=2, frozen)
  └── SupportPlanVersion v3 (current)
        └── Binding → Procedure p3 (current A2 projection)
```

FW-05: v2 ProcedureRecord は v3 Active へ付け替えない。

## Presentation mapping

| UI | Source |
|---|---|
| 適用中 | D1=B. Schema status remains `Active` |
| 版 3 | `currentVersion` |
| 現在の支援手順 | `FIELD_WORKFLOW_CURRENT_USER_A` A2 projection |
| 最近の ProcedureRecord | `FIELD_WORKFLOW_REVIEW_MATERIAL_V2` |
| 過去版 | synthetic v1 / v2 labels |
| 見直し導線 | nested ReviewDueState materials（計算なし） |

`approvedBy` / `approvedAt` は Active 必須のため **domain fixture に保持**する。
画面には「最終承認者」「承認済み」を出さない。適用開始の意味だけを見せる。

## Files

| Layer | Path |
|---|---|
| Shell presentation | `spfx/src/shell/users/support-plan-fixture.ts` |
| Field procedure join | `spfx/src/shell/procedure/procedure-fixture.ts` |
| Domain graph | `tests/domain/planning-pc-demo-graph-fixtures.ts` |
| Domain/contract tests | `tests/contracts/planning-pc-demo-graph-contract.test.ts` |

## OUT of this catalog

```text
Schema 1.0.0 field add / rename
approvedBy → activatedBy
reviewDueDate origin / approaching window
Observation ↔ planVersion association
live / SharePoint persistence
```
