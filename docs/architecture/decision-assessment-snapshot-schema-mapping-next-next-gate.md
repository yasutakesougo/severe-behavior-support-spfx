# Decision-AS-SCHEMA-MAPPING-NEXT-1 — Next Gate（after Acceptance）

Status: SCHEMA-MAPPING-NEXT-1 Accepted；MT-1 docs CONSUMED；column provisioning SELECTED / OPEN
Date: 2026-08-10
Acceptance: [`decision-assessment-snapshot-schema-mapping-next-acceptance.md`](./decision-assessment-snapshot-schema-mapping-next-acceptance.md)
MT-1 table: [`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)
Column packet: [`decision-assessment-snapshot-column-provision-packet.md`](./decision-assessment-snapshot-column-provision-packet.md)

---

## 1. Locked current state（SoT）

| Item | Status |
|---|---|
| PR #191 | MERGED（CN-1 observation CLOSED） |
| Decision-AS-CN1-OBSERVATION-1 | CLOSED / CONSUMED / DEFAULT_COLUMNS_ONLY |
| Decision-AS-SCHEMA-MAPPING-NEXT-1 | **Accepted / LOCKED / MT-1 + IN-A + CP-1 + XB-1** |
| Twenty-ninth residual | **CONSUMED** |
| Thirtieth residual | **CONSUMED**（MT-1 mapping-table docs update） |
| Thirty-first residual | **SELECTED / OPEN**（column provisioning） |
| Decision-AS-COLUMN-PROVISION-1 | **OPEN / NOT ACCEPTED** |
| AssessmentSnapshot mapping table | **UPDATED** under MT-1 / **NOT mapping-complete** |
| Custom application columns | 0 / NOT PRESENT |
| Intended Internal Names | NOT ADOPTED（IN-A）；NM still OPEN in column packet |
| Implementation Start | HOLD（XB-1） |
| adapter / schema mapping implementation | HOLD（XB-1） |
| SharePoint column creation | FORBIDDEN（until Accepted + Execution GO） |
| Deploy / real data | NO-GO |
| Agent SharePoint mutation | FORBIDDEN |
| GitHub Issue mutation / 一括 Close / 一括本文更新 | FORBIDDEN |

---

## 2. Immediate next OPEN residual（substantive）

| Order | Residual | Why next |
|---|---|---|
| 1 | Decision-AS-COLUMN-PROVISION-1（NM/SC/PX/EG/VR/FG/XB/AP） | CP-1 separate gate；custom columns = 0 |
| 2 | Issue Status Reconciliation（#6 / #8 / #22） | independent process debt |

```text
Active next substantive unit:
  Decision-AS-COLUMN-PROVISION-1
  selection: decision-ilb-1-thirty-first-residual-column-provision-selection.md
  packet: decision-assessment-snapshot-column-provision-packet.md
  Status: OPEN / NOT ACCEPTED
  Agent recommendation（比較用）:
    NM-HOLD + SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + XB-1 + AP-1

NOT auto-started:
  SharePoint column creation
  Internal Name invention
  Implementation Start
  adapter / schema mapping code
```

---

## 3. Still NO-GO / HOLD

| Item | Status |
|---|---|
| App-field Internal Names as CONFIRMED | NOT PRESENT / HOLD |
| Intended Internal Names | NOT ADOPTED yet（await NM-1 Human values） |
| SharePoint adapter / schema mapping impl | HOLD |
| Implementation Start | HOLD |
| SharePoint column creation | FORBIDDEN |
| Deploy / real data write | HOLD |
| Agent SharePoint mutation | FORBIDDEN |
| Treating MT-1 table as mapping-complete | FORBIDDEN |

---

## 4. Explicit non-claims

- Opening COLUMN-PROVISION-1 does **not** Accept NM/SC/PX/EG.
- Packet OPEN does **not** authorize column creation or Agent mutation.
- Ready / Merge live progress is not recorded here
  （[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）.
