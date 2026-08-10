# Decision-AS-CV-EXTENSION-1 — Mapping-complete impact matrix

この文書は、**Decision-AS-CV-EXTENSION-1** Accepted / LOCKED 後の
mapping-complete 影響整理表である。

Acceptance:
[`decision-assessment-snapshot-cv-extension-acceptance.md`](./decision-assessment-snapshot-cv-extension-acceptance.md)

Packet（compare history）:
[`decision-assessment-snapshot-cv-extension-packet.md`](./decision-assessment-snapshot-cv-extension-packet.md)

MAP-AS-010 create + VR-1 evidence:
[`decision-assessment-snapshot-map010-column-create-vr1-evidence.md`](./decision-assessment-snapshot-map010-column-create-vr1-evidence.md)

mapping-complete determination:
[`decision-assessment-snapshot-mapping-complete-determination.md`](./decision-assessment-snapshot-mapping-complete-determination.md)

```text
Status: ACCEPTED dispositions recorded / mapping-complete PASS / COMPLETE
Baseline main at closeout start:
  5ddb05950a2123a1fb609698b9673102a6190721
Human SharePoint create（MAP-AS-010）: COMPLETE
VR-1（MAP-AS-010）: PASS
column-ready（MAP-AS-010）: YES
```

## Mapping-complete disposition model（M-1-A LOCKED）

```text
mapping-complete requires every applicable MT-1 row to have
one explicit Accepted disposition ∈
  PERSISTED | DERIVED | EXPLICITLY OUT / 対象外

mapping-complete does NOT require every logical / DTO field
to have a physical SharePoint column.

Decision-AS-CV-EXTENSION-1 Accepted ≠ mapping-complete PASS
（PASS is recorded separately via mapping-complete determination）
```

## Impact matrix（post MAP-AS-010 VR-1 + determination）

| Field | Current status | Accepted disposition | Physical column required? | Conversion Decision required? | Human create required? | VR-1 required? | Blocks mapping-complete? | Authority |
|---|---|---|---|---|---|---|---|---|
| MAP-AS-009 findingIds | EXPLICITLY OUT / 対象外 | X-1-B ACCEPTED | NO（v1） | NO | NO | NO | NO（disposition complete） | Entry #5；CV-EXTENSION-1 |
| MAP-AS-010 supersedesSnapshotId | PERSISTED / PRESENT / OBSERVED / CONFIRMED / column-ready YES | X-2-A + MAP010-COLUMN-1 ACCEPTED | YES（done） | YES（done；R-1-A / W-1-A） | YES（COMPLETE） | YES（PASS） | **NO** | DEC-009；APP-SAVE；CV-EXTENSION-1；MAP010-COLUMN-1；VR-1 evidence |
| MAP-AS-ENV-001 schemaId | DERIVED | X-3-B ACCEPTED | NO | NO（no SP column） | NO | NO | NO（disposition complete） | SCHEMA-ID-1；CV-EXTENSION-1 |
| MAP-AS-ENV-002 schemaVersion | DERIVED / readable-set / 1.0.0 | X-4-B ACCEPTED | NO | NO（no SP column） | NO | NO | NO（disposition complete） | SCHEMA-VERSION-1；DEC-6 VR-1；CV-EXTENSION-1 |
| MAP-AS-ENV-003 dtoVersion | DERIVED / readable-set / 1.0.0 | X-5-B ACCEPTED | NO | NO（no SP column） | NO | NO | NO（disposition complete） | SCHEMA-VERSION-1；DEC-1；DEC-6 VR-1；CV-EXTENSION-1 |

```text
Fields requiring physical SharePoint columns eventually:
  MAP-AS-010 only — COMPLETE / PRESENT / VR-1 PASS

Fields with completed non-column dispositions:
  MAP-AS-009（EXPLICITLY OUT）
  MAP-AS-ENV-001 / 002 / 003（DERIVED）

mapping-complete: PASS / COMPLETE
Remaining principal blocker for mapping-complete: NONE
P2-002 clear/omit transport API: CLOSED
  Authority: Decision-AS-ADAPTER-EC3-EC4-1 / CO-1-A
  mapping-complete blocker: NO
Implementation Start: HOLD（AIS-1-B gate；EC-5..EC-8 + separate GO）
```

## Explicit non-claims

```text
This matrix / mapping-complete PASS does NOT:
  authorize SharePoint / M365 mutation
  authorize adapter / DTO / schema wiring
  authorize Implementation Start
  authorize Deploy / real data

P2-002 living: CLOSED by Decision-AS-ADAPTER-EC3-EC4-1（not by this matrix）
```
