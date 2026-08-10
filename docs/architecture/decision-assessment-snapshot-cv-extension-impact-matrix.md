# Decision-AS-CV-EXTENSION-1 — Mapping-complete impact matrix（Candidate）

この文書は、**Decision-AS-CV-EXTENSION-1** Candidate の
mapping-complete 影響整理表である。Human Acceptance ではない。

Packet:
[`decision-assessment-snapshot-cv-extension-packet.md`](./decision-assessment-snapshot-cv-extension-packet.md)

```text
Status: CANDIDATE / NOT ACCEPTED
Baseline main: 4fc919f63539466eced1a6f6213512e586583de5
mapping-complete: NOT YET
SharePoint create / VR-1 now: NOT YET DETERMINED（Acceptance 後）
```

## Critical question finding

```text
Question:
  mapping-complete に必要なのは、
  「logical fieldすべてに物理列が存在すること」か、
  Accepted contract によって
  PERSISTED / DERIVED / EXPLICITLY OUT のいずれかが一意に決まればよいか。

SoT finding:
  MT-1 Status vocabulary already includes 対象外
  MAP-AS-SYS-001 already uses 対象外 for app-field mapping
  DEC-6 VR-1 allows “明示 readable set” as alternative to per-item version storage
  Entry #5 does not force findingIds OPTIONAL persistence
  BUT: no Accepted document uniquely defines mapping-complete disposition model

Therefore:
  Mapping-complete definition = DECISION_REQUIRED（packet topic M-1）
  Agent recommendation（NOT Acceptance）: disposition model
    PERSISTED | DERIVED | EXPLICITLY OUT
  MUST NOT claim mapping-complete from unresolved NOT PRESENT rows
```

## Impact matrix

| Field | Current status | Candidate disposition | Physical column required? | Conversion Decision required? | Human create required? | VR-1 required? | Blocks mapping-complete? | Authority |
|---|---|---|---|---|---|---|---|---|
| MAP-AS-009 findingIds | NOT PRESENT；logical optional；NOT REQUIRED | X-1-B EXPLICITLY OUT / deferred（rec.） | NO if X-1-B Accepted；YES if X-1-A | YES only if X-1-A | YES only if X-1-A | YES only if X-1-A | YES while unresolved | Entry #5；complete-contract；MT-1 |
| MAP-AS-010 supersedesSnapshotId | NOT PRESENT；logical optional；lineage link | X-2-A persist slot（rec.） / X-2-B OUT | YES if X-2-A；NO if X-2-B | YES if X-2-A | YES if X-2-A | YES if X-2-A | YES while unresolved | DEC-009；APP-SAVE SC-1；complete-contract；MT-1 |
| MAP-AS-ENV-001 schemaId | NOT PRESENT；DTO envelope；logical constant Accepted | X-3-B derived/DTO constant（rec.） / X-3-A column | YES if X-3-A；NO if X-3-B | YES if X-3-A | YES if X-3-A | YES if X-3-A | YES while unresolved | SCHEMA-ID-1；MT-1；SupportPlan DTO envelope precedent；code assignment HOLD |
| MAP-AS-ENV-002 schemaVersion | NOT PRESENT；logical `1.0.0` | X-4-B explicit readable set / DTO constant（rec.） / X-4-A column | YES if X-4-A；NO if X-4-B | YES if X-4-A | YES if X-4-A | YES if X-4-A | YES while unresolved | SCHEMA-VERSION-1；DEC-6 VR-1；MT-1 |
| MAP-AS-ENV-003 dtoVersion | NOT PRESENT；logical `1.0.0`；≠ schemaVersion role | X-5-B explicit readable set / DTO constant（rec.） / X-5-A column | YES if X-5-A；NO if X-5-B | YES if X-5-A | YES if X-5-A | YES if X-5-A | YES while unresolved | SCHEMA-VERSION-1；DEC-1；DEC-6 VR-1；MT-1 |

```text
Fields requiring physical SharePoint columns:
  unresolved until Acceptance
  Agent recommendation set would require column for:
    MAP-AS-010 only
  （009 OUT；ENV derived/readable-set）

Fields eligible for derived/non-column representation（candidate only）:
  MAP-AS-ENV-001 / 002 / 003（if M-1 disposition model + X-3/4/5-B Accepted）
  MAP-AS-009（if X-1-B EXPLICITLY OUT Accepted）

Human SharePoint create required now: NOT YET DETERMINED
New VR-1 required now: NOT YET DETERMINED
```

## Explicit non-claims

```text
This matrix does NOT:
  Accept Decision-AS-CV-EXTENSION-1
  invent Internal Names / types / codecs
  authorize SharePoint create
  claim mapping-complete PASS
  authorize adapter / Implementation Start
```
