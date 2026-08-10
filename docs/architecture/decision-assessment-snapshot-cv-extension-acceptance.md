# Decision-AS-CV-EXTENSION-1 — Human Acceptance

この文書は、**Decision-AS-CV-EXTENSION-1**（AssessmentSnapshots
MAP-AS-009 / 010 / ENV-001〜003 persistence placement +
mapping-complete disposition model）についての
**Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-cv-extension-packet.md`](./decision-assessment-snapshot-cv-extension-packet.md)

Selected via:
[`decision-assessment-snapshot-cv-extension-selection.md`](./decision-assessment-snapshot-cv-extension-selection.md)

Impact matrix:
[`decision-assessment-snapshot-cv-extension-impact-matrix.md`](./decision-assessment-snapshot-cv-extension-impact-matrix.md)

IR:
[`decision-assessment-snapshot-cv-extension-independent-review.md`](./decision-assessment-snapshot-cv-extension-independent-review.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-conversion-acceptance.md`](./decision-assessment-snapshot-conversion-acceptance.md)
[`decision-assessment-snapshot-column-names-acceptance.md`](./decision-assessment-snapshot-column-names-acceptance.md)
[`decision-as-ec-1-entry-5-finding-ids-boundary-acceptance.md`](./decision-as-ec-1-entry-5-finding-ids-boundary-acceptance.md)
[`assessment-snapshot-finding-ids-boundary.md`](./assessment-snapshot-finding-ids-boundary.md)
[`assessment-snapshot-complete-contract.md`](./assessment-snapshot-complete-contract.md)
[`decision-dec-009-snapshot-save-timing-acceptance.md`](./decision-dec-009-snapshot-save-timing-acceptance.md)
[`decision-assessment-snapshot-application-save-acceptance.md`](./decision-assessment-snapshot-application-save-acceptance.md)
[`decision-assessment-snapshot-dec6-mapping-acceptance.md`](./decision-assessment-snapshot-dec6-mapping-acceptance.md)
[`decision-assessment-snapshot-schema-id-value-naming-acceptance.md`](./decision-assessment-snapshot-schema-id-value-naming-acceptance.md)
[`decision-assessment-snapshot-schema-version-acceptance.md`](./decision-assessment-snapshot-schema-version-acceptance.md)
[`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-CV-EXTENSION-1
Status: Accepted / LOCKED
Human Decision: M-1-A + X-1-B + X-2-A + X-3-B + X-4-B + X-5-B + XB-1
Human Acceptance: Explicit Human Decision on 2026-08-10
PR: #208

LOCKED:

M-1 mapping-complete disposition model:
  M-1-A — mapping-complete requires every applicable MT-1 row to have
          one explicit Accepted disposition ∈
          {PERSISTED, DERIVED, EXPLICITLY OUT / 対象外}
          physical SharePoint column for every logical/DTO field
          is NOT required
          This Acceptance ≠ mapping-complete PASS

X-1 MAP-AS-009 findingIds:
  X-1-B — v1 = EXPLICITLY OUT / deferred
          MT-1 Status = 対象外
          Physical SharePoint column NOT REQUIRED for v1
          findingIds remains OPTIONAL / NOT REQUIRED（Entry #5）
          persistence representation / codec NOT invented

X-2 MAP-AS-010 supersedesSnapshotId:
  X-2-A — v1 persistence slot = REQUIRED / PERSISTED
          purpose = preserve correction lineage for correct-as-new-version
          NOT determined by this Acceptance:
            Internal Name / Display Name / Column Type
            Read / Write Conversion
            Human column create / VR-1
          Physical column: NOT PRESENT / NOT YET COLUMN-READY

X-3 MAP-AS-ENV-001 schemaId:
  X-3-B — Disposition = DERIVED
          Physical per-item SharePoint column NOT REQUIRED
          Accepted Schema ID constant supplied at DTO / adapter boundary:
            severe-behavior-support.assessment-snapshot.snapshot
          ≠ DTO / adapter implementation authorization

X-4 MAP-AS-ENV-002 schemaVersion:
  X-4-B — Disposition = DERIVED / explicit readable-set
          Physical per-item SharePoint column NOT REQUIRED
          Accepted logical value = 1.0.0
          DEC-6 VR-1 fail-closed compatibility preserved
          silent version fallback FORBIDDEN

X-5 MAP-AS-ENV-003 dtoVersion:
  X-5-B — Disposition = DERIVED / explicit readable-set
          Physical per-item SharePoint column NOT REQUIRED
          Accepted logical value = 1.0.0
          dtoVersion and schemaVersion remain separate semantic concepts
          （values may both equal 1.0.0 without conflation）

Implementation / create / Deploy boundary:
  XB-1 — 本 Decision ≠ Internal Name Acceptance
         ≠ Column Type Acceptance
         ≠ Conversion Contract for MAP-AS-010
         ≠ SharePoint column create GO
         ≠ VR-1 PASS
         ≠ mapping-complete PASS
         ≠ adapter Implementation Start
         ≠ Deploy

P2 disposition:
  P2-001 CLOSED — DERIVED / readable-set path Human-Accepted via X-3-B/X-4-B/X-5-B
  P2-002 OPEN / CARRY-FORWARD — MAP-AS-010 naming/type/conversion/create/VR-1
         Decision blocker: NO

Implementation Start:
  HOLD
SharePoint adapter / schema mapping / DTO wiring:
  HOLD
SharePoint column create / mutation:
  FORBIDDEN（this Acceptance）
mapping-complete:
  NOT YET
Deploy / real data:
  NO-GO
Agent SharePoint / M365 mutation:
  FORBIDDEN

Closes only:
  Decision-AS-CV-EXTENSION-1
  （M-1-A + X-1-B + X-2-A + X-3-B + X-4-B + X-5-B + XB-1）
Does NOT close:
  MAP-AS-010 column contract / create / VR-1
  mapping-complete PASS
  adapter / schema / DTO wiring
  Implementation Start
  Deploy / real data
Implementation auto-start: FORBIDDEN
Column create auto-start: FORBIDDEN
Internal Name invention: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: M-1-A + X-1-B + X-2-A + X-3-B + X-4-B + X-5-B + XB-1
Decision-AS-CV-EXTENSION-1: Accepted / LOCKED
Human Acceptance date: 2026-08-10
```

日本語正本:

```text
M-1-A:
  mapping-complete は各適用 MT-1 row が
  PERSISTED / DERIVED / EXPLICITLY OUT（対象外）の
  いずれかで明示 Disposition されること。
  全 logical/DTO field の物理列必須ではない。
  本 Acceptance 自体は mapping-complete PASS ではない。
X-1-B:
  findingIds は v1 EXPLICITLY OUT / deferred（対象外）。
  物理列不要。OPTIONAL / NOT REQUIRED を維持。
X-2-A:
  supersedesSnapshotId は v1 PERSISTED（lineage 保持）。
  ただし naming / type / conversion / create / VR-1 は未決定。
X-3-B / X-4-B / X-5-B:
  schemaId / schemaVersion / dtoVersion は DERIVED
  （ENV versions は explicit readable-set）。
  物理 per-item 列は不要。実装開始はしない。
XB-1:
  本 Acceptance だけでは create / conversion / mapping-complete /
  adapter / Deploy を開始・確定しない。
```

```text
Agent recommendation（同セット）:
  NOT Human Acceptance evidence by itself
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-AS-CV-EXTENSION-1: Accepted / LOCKED

M-1 disposition model: M-1-A
X-1 findingIds:         X-1-B（EXPLICITLY OUT）
X-2 supersedesSnapshotId: X-2-A（PERSISTED / not column-ready）
X-3 schemaId:           X-3-B（DERIVED）
X-4 schemaVersion:      X-4-B（DERIVED / readable-set / 1.0.0）
X-5 dtoVersion:         X-5-B（DERIVED / readable-set / 1.0.0）
Boundary:               XB-1

NOT SELECTED:
  M-1-B / M-1-HOLD / M-1-X
  X-1-A / X-1-HOLD / X-1-X
  X-2-B / X-2-HOLD / X-2-X
  X-3-A / X-3-HOLD / X-3-X
  X-4-A / X-4-HOLD / X-4-X
  X-5-A / X-5-HOLD / X-5-X
  XB-2
```

### Accepted disposition coverage

| Mapping ID | Logical Field | Disposition | Physical column | Status |
|---|---|---|---|---|
| MAP-AS-009 | findingIds | EXPLICITLY OUT / 対象外 | NOT REQUIRED（v1） | ACCEPTED / LOCKED |
| MAP-AS-010 | supersedesSnapshotId | PERSISTED | NOT PRESENT / NOT YET COLUMN-READY | ACCEPTED / LOCKED（placement only） |
| MAP-AS-ENV-001 | schemaId | DERIVED | NOT REQUIRED | ACCEPTED / LOCKED |
| MAP-AS-ENV-002 | schemaVersion | DERIVED / explicit readable-set | NOT REQUIRED | ACCEPTED / LOCKED |
| MAP-AS-ENV-003 | dtoVersion | DERIVED / explicit readable-set | NOT REQUIRED | ACCEPTED / LOCKED |

```text
MAP-AS-010 still NOT YET ACCEPTED:
  Internal Name
  Display Name
  Column Type
  Read Conversion
  Write Conversion
  Physical column presence
  VR-1 for MAP-AS-010
```

失敗時 MUST NOT（LOCKED）:

```text
treating this Acceptance as mapping-complete PASS
inventing MAP-AS-010 Internal Name / Display Name / Column Type / codec
creating SharePoint columns from this Acceptance alone
treating DERIVED ENV values as adapter / DTO code start
silent schemaVersion / dtoVersion fallback
conflating schemaVersion and dtoVersion semantic roles
forcing findingIds REQUIRED or inventing its persistence codec
Agent による SharePoint / M365 / Entra mutation を許可する
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-CV-EXTENSION-1 Accepted = mapping-complete PASS
  Decision-AS-CV-EXTENSION-1 Accepted = MAP-AS-010 column-ready
  Decision-AS-CV-EXTENSION-1 Accepted = Internal Name / type / conversion Accepted
  Decision-AS-CV-EXTENSION-1 Accepted = SharePoint column create GO
  Decision-AS-CV-EXTENSION-1 Accepted = VR-1 PASS for MAP-AS-010
  Decision-AS-CV-EXTENSION-1 Accepted = adapter / DTO / schema wiring GO
  Decision-AS-CV-EXTENSION-1 Accepted = Implementation Start
  Decision-AS-CV-EXTENSION-1 Accepted = Deploy / real data GO
  Decision-AS-CV-EXTENSION-1 Accepted = P2-002 closed
```

## Acceptance boundary

```text
This Acceptance locks placement dispositions + M-1 model only.

MUST NOT start from this Acceptance alone:
  inventing MAP-AS-010 column contract
  SharePoint column create / rename / delete
  TypeScript / application / persistence port / adapter / DTO code
  Implementation Start
  Deploy / real data
  GitHub Issue mutation
  Ready / Merge without separate Human authorization
```

## mapping-complete after this Acceptance

```text
MAP-AS-001〜008: disposition COMPLETE for current mapping
MAP-AS-009: EXPLICITLY OUT
ENV-001〜003: DERIVED
MAP-AS-010: PERSISTED disposition Accepted but NOT column-ready

mapping-complete: NOT YET
Remaining principal blocker:
  MAP-AS-010 column contract / Human create / VR-1
```

## Next

```text
Decision-AS-CV-EXTENSION-1: Accepted / LOCKED
  / M-1-A + X-1-B + X-2-A + X-3-B + X-4-B + X-5-B + XB-1
P2-001: CLOSED
P2-002: OPEN / CARRY-FORWARD（non-blocking）
mapping-complete: NOT YET
Human SharePoint create required now: NO
Human SharePoint create required eventually: YES（MAP-AS-010；separate gates）
Implementation Start: HOLD
adapter / schema / DTO wiring: HOLD
SharePoint / M365 mutation: FORBIDDEN
Deploy / real data: NO-GO

Next gate detail（PR process）: HUMAN READY DECISION FOR PR #208
Next substantive column-path residual after merge: NOT SELECTED by this Acceptance
  （expected later: MAP-AS-010 naming / type / conversion / create / VR-1）
Ready: NOT RUN by this Acceptance
Merge: NOT RUN by this Acceptance
```
