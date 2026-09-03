# SBS-MGMT-LOOP-B — B12 / Rendered Browser Acceptance matrix

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: SBS-MGMT-LOOP-B (#553)
Kind: B12 browser smoke / Rendered Browser Acceptance (RBA)
Harness: spfx/smoke/sbs-mgmt-loop-b/
presentationOnly: true
LIVE WRITE / Deploy / SharePoint: NOT AUTHORIZED
source SupportPlanVersion N mutation: NOT AUTHORIZED
```

## Exact acceptance matrix

| ID | Viewport | Assertion | Owner |
|---|---|---|---|
| B12-R1 | 1280×900 + 390×844 | CHANGE_REQUIRED + human decisionReason → start-revision enabled | B12 |
| B12-R2 | both | C2: exactly one `data-sbs-action="primary"` while start-revision is forward CTA | B12 / H-05 |
| B12-R3 | both | review-materials predecessor demoted (`tertiary` + `data-sbs-mgmt-loop-b-predecessor="demoted"`) | B12 / P1-1 |
| B12-R4 | both | `[data-review-new-version="create-cta"]` remains present and disabled (Scope Correction-1 retain) | B12 / P1-1 |
| B12-R5 | both | #553 executable CTA uses `data-sbs-mgmt-loop-b-action="start-revision"` only (no create-cta) | B12 / P1-1 |
| B12-R6 | both | explicit CTA `変更内容の作成を始める` creates session-only N+1 draft | B12 |
| B12-R7 | both | draft readback: `変更内容の下書き: 版 4` | B12 |
| B12-R8 | both | source N immutable: `元の版: 3（変更しない）` + current version control still 版 3 | B12 |
| B12-R9 | both | session-only: `下書き / 本番未保存` + boundary `本番には保存されていません` | B12 |
| B12-R10 | both | decision + reason readback remain visible | B12 |
| B12-R11 | both | after draft: start-revision cleared; draft count remains 1 under repeated action | B12 |
| B12-R12 | both | NO_CHANGE capture does not enable start-revision / does not create draft | B12 |
| B12-R13 | both | historical v2 selection blocks start-revision / forbids N+2 draft | B12 |
| B12-R14 | both | `data-sbs-mgmt-loop-b-live-write="false"` | B12 |
| B12-R15 | both | external requests = 0 | B12 / RBA |
| B12-R16 | both | pageerror = 0 | B12 |
| B12-R17 | both | horizontal overflow = 0 | RBA |
| RBA-V1 | 1280×900 | desktop rendered acceptance exercised | RBA |
| RBA-V2 | 390×844 | mobile rendered acceptance exercised | RBA |

```text
Rendered Browser Acceptance ≠ Actual Staff Value Check
Actual Staff Value Check remains a separate Human gate after Independent Review
```

## Boundary held

```text
synthetic / session-only Planning-PC path
canonical fixture authority = current SupportPlan + source SupportPlanVersion v3 + existingVersions
display presentation identity-only match (no provenance rebuild from presentation)
LIVE_WRITE = false
SharePoint / M365 / Entra / Deploy = 0
source version N not mutated
SupportPlan.currentVersion not advanced
Ready / Merge = NOT AUTHORIZED by this matrix
```
