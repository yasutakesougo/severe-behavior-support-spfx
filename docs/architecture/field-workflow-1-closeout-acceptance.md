# FIELD-WORKFLOW-1 — Closeout / Acceptance Review

Status: **ACCEPT — SYNTHETIC PATH COMPLETE**

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: FIELD-WORKFLOW-1
Gate: Closeout / Acceptance Review（post #357 merge）
Date: 2026-08-13
observed origin/main: 8173a4c18f6ce85254467c67ce81b481a537a35d
tip subject: Merge pull request #357 (FIELD-WORKFLOW UI)
UI merge: PR #357 / head fa4714fa0a140f7f52b144bd52cae83c7ead4289
Contract A: PR #350 / Issue #347（OPEN — auto-close NO-GO）
Contract B: PR #354 / Issue #352（OPEN — auto-close NO-GO）
UI Issue C: #356（OPEN — close eligibility: YES / Human-only）
```

Assessment baseline（PR #345）: `docs/architecture/field-workflow-1-assessment.md`

UI Implementation Start: `docs/architecture/field-workflow-ui-implementation-start.md`

---

## 1. Scope of this closeout

### In scope（ACCEPT 判定対象）

```text
利用者 → 現在の支援手順 → ProcedureRecord 記録 → Review 材料
result 3値入力
FW-05 版固定 / historical fail-closed
~390px field flow
save 5-state 配線（synthetic）
FW-01 … FW-09 再評価（contracts A/B + UI #356）
Issue #356 close 可否判定（実行はしない）
```

### Explicit OUT / separate gates（この closeout では閉じない）

```text
Deploy / App Catalog
SharePoint / M365 / Entra mutation
production write
#68 / #69 / #299 / #347 / #352 auto-close
A1 procedure body schema promotion
ABC / Observation recording-ui（#69）
時間順支援手順閲覧全体の置き換え（#68）
```

---

## 2. Live state（Evidence priority）

| Item | Value | Evidence class |
|---|---|---|
| `origin/main` | `8173a4c18f6ce85254467c67ce81b481a537a35d` | CONFIRMED |
| PR #357 | MERGED 2026-08-13T22:42:45Z by @yasutakesougo | CONFIRMED |
| Issue #356 | OPEN | CONFIRMED |
| Issue #347 / #352 | OPEN | CONFIRMED |
| Issue #68 / #69 | OPEN | CONFIRMED |
| Issue #299 | CLOSED（completed）— reopen/close しない | CONFIRMED |
| Deploy / App Catalog / live SP | 未実施 | CONFIRMED（NO-GO 維持） |

---

## 3. FW-01 … FW-09 最終再評価

| ID | Intent | Prior（#345） | Post-#357 | Evidence |
|---|---|---|---|---|
| **FW-01** | 現在の支援手順を即時確認 | PRESENTATION GAP | **PASS（synthetic）** | `CurrentProcedure` 場面→実施→避ける→補足；smoke `fw01-current-procedure-visible` |
| **FW-02** | 「この手順を記録」+ preselect | FLOW GAP | **PASS（synthetic）** | CTA + users destination handoff；smoke `fw02-context-handoff-no-reselect` |
| **FW-03** | result 選択中心 | PRESENTATION/CONTRACT GAP | **PASS（synthetic + contract）** | result 3値 UI + `ProcedureRecord` vocabulary |
| **FW-04** | Plan→Procedure→Record binding | CONTRACT GAP | **PASS（contract）** | `SupportPlanVersionProcedureBinding`（#350）+ `ProcedureRecord` 四値（#354） |
| **FW-05** | 過去記録を新計画へ付け替えない | CONTRACT GAP | **PASS（contract + UI）** | FW05-HIST-01/02 contract tests；Review v2 projection / unresolved fail-closed smoke |
| **FW-06** | performedAt ≠ recordedAt | CONTRACT GAP | **PASS（contract）** | `ProcedureRecord` dual clocks LOCKED + validator |
| **FW-07** | Review = 見直し材料入口 | FLOW GAP | **PASS（synthetic）** | Review materials → 元 ProcedureRecord → plan/version；no auto-judge；smoke `fw07-review-v2-projection` |
| **FW-08** | ~390px field flow | PRESENTATION GAP | **PASS（smoke）** | `spfx/smoke/field-workflow-ui` viewport 390×844；`css-390-media` + keyboard focus |
| **FW-09** | 保存失敗で入力保持 | FLOW GAP | **PASS（synthetic）** | `save_failed` retain / `save_outcome_unknown` no immediate retry；smoke + unit |

### Summary buckets（post-closeout）

**PASS（synthetic / contract on main）**

- FW-01 … FW-09 for FIELD-WORKFLOW-1 success criteria on synthetic fixtures
- DADS IA / save 5-state vocabulary / INV-07/10/17 preserved in UI slice
- A2 presentation projection（手順本文は契約昇格しない）

**N/A / separate gate**

- Deploy / App Catalog / SharePoint / M365 / Entra / production write
- #68 / #69 completion
- live adapter persistence of ProcedureRecord

---

## 4. Scenario readiness（current main）

| Scenario | Ready? | Notes |
|---|---|---|
| 1 支援前 — 現在有効な支援手順 | **YES（synthetic）** | A2 projection on Active context |
| 2 支援直後 — この手順を記録 | **YES（synthetic）** | CTA + inherited binding context |
| 3 一部変更 | **YES（synthetic）** | `PERFORMED_WITH_ADAPTATION`（非失敗 copy） |
| 4 実施できなかった | **YES（synthetic）** | `NOT_PERFORMED`（非失敗 copy） |
| 5 計画 version binding | **YES（contract + UI）** | Record carries planVersion；FW-05 enforced |
| 6 Review drill-down | **YES（synthetic）** | materials → detail → historical projection |
| 7 mobile ~390 | **YES（smoke）** | closeout re-run PASS |
| 8 save failure retain | **YES（synthetic）** | 5-state wired on ProcedureRecord path |

---

## 5. Verification（closeout re-run on main tip）

| Check | Result | Note |
|---|---|---|
| root `npm test` | **PASS** | 578 / 0 |
| ProcedureRecord + binding contracts（included in root suite） | **PASS** | includes FW05-HIST-01/02 |
| FIELD-WORKFLOW UI unit (`procedure.test.ts`) | **PASS（#357 Heft）** | root `npm test` does **not** include `spfx/**`；unit covered by #357 SPFx Heft + closeout smoke/contracts re-run |
| FIELD-WORKFLOW ~390 browser smoke（re-run） | **PASS** | all checks true；report `/opt/cursor/artifacts/field_workflow_closeout_smoke_report.json` |

Smoke checks（re-run）：

```text
css-390-media
no-page-errors-initial
fw01-current-procedure-visible
fw02-context-handoff-no-reselect
fw09-save-failed-retains-input
fw09-save-outcome-unknown-blocks-retry
fw08-keyboard-focus-moves
fw07-review-v2-projection
fw05-historical-fail-closed
```

Artifacts:

```text
/opt/cursor/artifacts/field_workflow_390_procedure_record.png
/opt/cursor/artifacts/field_workflow_review_materials.png
/opt/cursor/artifacts/field_workflow_closeout_smoke_report.json
```

---

## 6. Issue #356 close eligibility

| Criterion（Issue C implementation stage） | Met? |
|---|---|
| Users → 現在の支援手順 → 「この手順を記録」→ result → save（synthetic） | **YES** |
| context 再選択なし / FW-05 付け替えなし / historical fail-closed | **YES** |
| Review → ProcedureRecord → plan/version 追跡 | **YES** |
| ~390px + keyboard-only 主要操作 | **YES** |
| save_failed 保持 / save_outcome_unknown 即時再送禁止 | **YES** |
| DADS IA / 5-state / INV-07/10/17 維持 | **YES** |
| Deploy / SharePoint / production write を含まない | **YES** |

```text
#356 Close eligibility: YES
#356 Close execution: HUMAN-ONLY（Agent mutation FORBIDDEN）
Closing #356 ≠ Deploy authorization
Closing #356 ≠ production write authorization
Closing #356 ≠ auto-close #68 / #69 / #347 / #352
#299: already CLOSED — do not reopen/close via this gate
```

---

## 7. Related Issue disposition（no mutation）

| Issue | Live state | This closeout |
|---|---|---|
| #356 UI Issue C | OPEN | **Close recommended（Human）** |
| #347 Contract A | OPEN | **Do not auto-close**（Human が契約完了条件で別判定） |
| #352 Contract B | OPEN | **Do not auto-close**（同上） |
| #68 field-ui | OPEN | **related only / leave open** |
| #69 recording-ui | OPEN | **related only / leave open** |
| #299 demo parent | CLOSED | **no reopen / no close action** |

---

## 8. Findings

| ID | 重大度 | 状態 | 内容 | 対応 |
|---|---|---|---|---|
| — | — | — | P0 / P1 none for synthetic FIELD-WORKFLOW-1 acceptance | — |

P2 / backlog（後続可・本 Gate 非ブロッカー）:

- live SharePoint persistence of ProcedureRecord（別 Deploy / adapter gate）
- #68 時間順支援手順閲覧 / #69 ABC・観察保存（別 UI Issue）
- #347 / #352 Human close hygiene（契約 MERGED 済みだが Issue OPEN のまま）

---

## 9. Verdict

```text
FIELD-WORKFLOW-1 Closeout / Acceptance: ACCEPT — SYNTHETIC PATH COMPLETE

FW-01…FW-09: PASS on main 8173a4c…（contracts + UI #357）
Issue #356: ELIGIBLE TO CLOSE（Human-only）

NOT AUTHORIZED by this closeout:
  Deploy / App Catalog
  SharePoint / M365 / Entra mutation
  production write
  #68 / #69 / #299 / #347 / #352 auto-close
  New Implementation Start for adjacent Issues
```

## 10. Next Actions

```text
Human:
  1. Review this closeout packet
  2. Close #356 if accepted（completed）
  3. Optionally decide #347 / #352 close hygiene separately
  4. Select next gate explicitly（Deploy / #68 / #69 / adapter write — NOT auto）

Agent:
  STOP after this docs closeout PR（Ready/Merge = HUMAN-ONLY）
  Do not Deploy / SharePoint mutate / Issue mutate
```
