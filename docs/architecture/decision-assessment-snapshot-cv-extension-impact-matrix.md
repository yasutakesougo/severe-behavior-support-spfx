# Decision-AS-CV-EXTENSION-1 — Mapping-complete impact matrix

この文書は、**Decision-AS-CV-EXTENSION-1** Accepted / LOCKED 後の
mapping-complete 影響整理表である。

Acceptance:
[`decision-assessment-snapshot-cv-extension-acceptance.md`](./decision-assessment-snapshot-cv-extension-acceptance.md)

Packet（compare history）:
[`decision-assessment-snapshot-cv-extension-packet.md`](./decision-assessment-snapshot-cv-extension-packet.md)

```text
Status: ACCEPTED dispositions recorded / mapping-complete NOT YET
Baseline main: 4fc919f63539466eced1a6f6213512e586583de5
PR: #208
Human SharePoint create required now: NO
Human SharePoint create required eventually: YES（MAP-AS-010；separate gates）
```

## Mapping-complete disposition model（M-1-A LOCKED）

```text
mapping-complete requires every applicable MT-1 row to have
one explicit Accepted disposition ∈
  PERSISTED | DERIVED | EXPLICITLY OUT / 対象外

mapping-complete does NOT require every logical / DTO field
to have a physical SharePoint column.

Decision-AS-CV-EXTENSION-1 Accepted ≠ mapping-complete PASS
```

## Impact matrix（post-Acceptance）

| Field | Current status | Accepted disposition | Physical column required? | Conversion Decision required? | Human create required? | VR-1 required? | Blocks mapping-complete? | Authority |
|---|---|---|---|---|---|---|---|---|
| MAP-AS-009 findingIds | EXPLICITLY OUT / 対象外 | X-1-B ACCEPTED | NO（v1） | NO | NO | NO | NO（disposition complete） | Entry #5；CV-EXTENSION-1 |
| MAP-AS-010 supersedesSnapshotId | PERSISTED / NOT YET COLUMN-READY | X-2-A ACCEPTED（placement） | YES（eventually） | YES（later residual） | YES（later residual） | YES（later residual） | **YES**（not column-ready） | DEC-009；APP-SAVE；CV-EXTENSION-1 |
| MAP-AS-ENV-001 schemaId | DERIVED | X-3-B ACCEPTED | NO | NO（no SP column） | NO | NO | NO（disposition complete） | SCHEMA-ID-1；CV-EXTENSION-1 |
| MAP-AS-ENV-002 schemaVersion | DERIVED / readable-set / 1.0.0 | X-4-B ACCEPTED | NO | NO（no SP column） | NO | NO | NO（disposition complete） | SCHEMA-VERSION-1；DEC-6 VR-1；CV-EXTENSION-1 |
| MAP-AS-ENV-003 dtoVersion | DERIVED / readable-set / 1.0.0 | X-5-B ACCEPTED | NO | NO（no SP column） | NO | NO | NO（disposition complete） | SCHEMA-VERSION-1；DEC-1；DEC-6 VR-1；CV-EXTENSION-1 |

```text
Fields requiring physical SharePoint columns eventually:
  MAP-AS-010 only

Fields with completed non-column dispositions:
  MAP-AS-009（EXPLICITLY OUT）
  MAP-AS-ENV-001 / 002 / 003（DERIVED）

mapping-complete: NOT YET
Remaining principal blocker:
  MAP-AS-010 column contract / Human create / VR-1
```

## Explicit non-claims

```text
This matrix does NOT:
  invent MAP-AS-010 Internal Name / type / codec
  authorize SharePoint create now
  claim mapping-complete PASS
  authorize adapter / Implementation Start
```
