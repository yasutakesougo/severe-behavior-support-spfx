# Decision-AS-SCHEMA-MAPPING-NEXT-1 — Next Gate（after Acceptance）

Status: SCHEMA-MAPPING-NEXT-1 Accepted；COLUMN-PROVISION-1 Accepted；next residual NOT SELECTED
Date: 2026-08-10
Acceptance: [`decision-assessment-snapshot-schema-mapping-next-acceptance.md`](./decision-assessment-snapshot-schema-mapping-next-acceptance.md)
Column Acceptance: [`decision-assessment-snapshot-column-provision-acceptance.md`](./decision-assessment-snapshot-column-provision-acceptance.md)
MT-1 table: [`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)

---

## 1. Locked current state（SoT）

| Item | Status |
|---|---|
| Decision-AS-SCHEMA-MAPPING-NEXT-1 | Accepted / LOCKED / MT-1+IN-A+CP-1+XB-1 |
| Decision-AS-COLUMN-PROVISION-1 | **Accepted / LOCKED / NM-HOLD+SC-AS+PX-HOLD+EG-HOLD+VR-1+FG-1+XB-1+AP-1** |
| Twenty-ninth / thirtieth / thirty-first | **CONSUMED** |
| AssessmentSnapshot mapping table | UPDATED / NOT mapping-complete |
| Custom application columns | 0 / NOT PRESENT |
| Intended Internal Names | NOT ADOPTED / HOLD（NM-HOLD） |
| Scope for future columns | AssessmentSnapshots only（SC-AS） |
| SharePoint column creation | **FORBIDDEN**（PX-HOLD + EG-HOLD） |
| Implementation Start | HOLD |
| adapter / schema mapping implementation | HOLD |
| Agent SharePoint mutation | FORBIDDEN（AP-1） |
| Deploy / real data | NO-GO |

---

## 2. Immediate candidates（NOT SELECTED）

| Order | Candidate | Why |
|---|---|---|
| 1 | NM-1 Human-provided intended names path | required before PX-1 / EG-1 |
| 2 | Issue Status Reconciliation（#6 / #8 / #22） | independent process debt |
| 3 | SupportPlans column scope | SC-BOTH NOT SELECTED |

```text
Next substantive residual: NOT SELECTED
column-provision next-gate:
  decision-assessment-snapshot-column-provision-next-gate.md
```

---

## 3. Explicit non-claims

- COLUMN-PROVISION-1 Accepted does **not** authorize column creation.
- Ready / Merge live progress is not recorded here
  （[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）.
