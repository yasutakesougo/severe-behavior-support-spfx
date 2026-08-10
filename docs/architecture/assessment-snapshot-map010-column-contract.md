# AssessmentSnapshot — MAP-AS-010 Column Contract（Candidate）

この文書は、**Decision-AS-MAP010-COLUMN-1** の
`supersedesSnapshotId` SharePoint persistence slot 向け
**column contract 候補**である。Human Acceptance 前のため ACCEPTED ではない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-MAP010-COLUMN-1
Kind: Column contract candidate（docs-only）
Status: CANDIDATE / NOT ACCEPTED
Baseline main: 6124127ad306848ac890a673cc8b5c0dd4c57710

Packet:
  decision-assessment-snapshot-map010-column-packet.md
Selection:
  decision-assessment-snapshot-map010-column-selection.md
IR:
  decision-assessment-snapshot-map010-column-independent-review.md

Prior disposition（LOCKED；再 Decision しない）:
  MAP-AS-010 = PERSISTED（Decision-AS-CV-EXTENSION-1 / X-2-A）
  Column-ready = NO
  Physical column = NOT PRESENT
  VR-1 = NOT RUN

SharePoint create: FORBIDDEN（this candidate）
mapping-complete: NOT YET
adapter / Implementation Start: HOLD
Deploy / real data: NO-GO
```

## 1. Candidate contract summary

| Axis | Candidate | Decision Status |
|---|---|---|
| Mapping ID | MAP-AS-010 | LOCKED prior（PERSISTED） |
| Logical Field | `supersedesSnapshotId?: string` | LOCKED prior |
| Logical requiredness | OPTIONAL | LOCKED prior / CANDIDATE persistence rules |
| Internal Name | `supersedesSnapshotId` | CANDIDATE（N-1-A） |
| Display Name | 訂正元スナップショットID | CANDIDATE（N-2-A） |
| Column Type | 1行テキスト | CANDIDATE（T-1-A） |
| Representation | —（plain text id） | CANDIDATE |
| Read Conversion | R-1-A | CANDIDATE |
| Write Conversion | W-1-A | CANDIDATE |
| Failure Behavior | RW-1 + MF-1 fail-closed；optional absence OK | CANDIDATE（O-1-A） |

## 2. Optional / absence semantics（O-1-A candidate）

```text
Logical optional absence:
  OK → persistence blank/null/missing
  Read result = undefined

Present valid value:
  non-empty string（trim() !== "" for predicate only；value not trimmed）

Invalid present:
  empty string → fail-closed
  whitespace-only → fail-closed
  null-as-present / unexpected non-string → fail-closed

FORBIDDEN:
  null → default id
  empty → synthetic value
  trim-to-accept
  optional → required escalation
```

## 3. Read Conversion（R-1-A candidate）

| Persistence input | Logical output |
|---|---|
| null / missing | `undefined`（absent） |
| valid non-empty string | same string（pass-through；no trim） |
| empty `""` | fail-closed |
| whitespace-only | fail-closed |
| unexpected non-string | fail-closed |

```text
Self-reference（value === snapshotId）:
  NOT owned by column read conversion alone
  Domain validateAssessmentSnapshot owns !== snapshotId / finalized rules
```

## 4. Write Conversion（W-1-A candidate）

| Logical input | Persistence output |
|---|---|
| `undefined` / absent | blank/null（clear/omit） |
| valid non-empty string | Text pass-through（no trim） |
| empty / whitespace-only | fail-closed |
| `null` | fail-closed |

```text
Validated domain snapshot is the write source for present values.
Exact SharePoint client clear/omit mechanics = adapter impl gate
under this semantic（not invented REST details here）.
```

## 5. Failure behavior

```text
RW-1: conversion failure must not become success
MF-1: malformed / unexpected type fail-closed
Optional absence is success（not a missing-required failure）
EM-1 / FR-1 mapping remains adapter responsibility at impl gate
```

## 6. Layered validation ownership

| Concern | Layer |
|---|---|
| blank vs present string shape | column conversion（this Decision） |
| non-empty when present | domain（and mirrored in conversion fail-closed） |
| `!== snapshotId` | domain |
| `recordStatus === finalized` when present | domain |
| correct-as-new-version intent / overwrite forbidden | application save（APP-SAVE / DEC-009） |
| SP transport / clear API | adapter（later） |

## 7. Explicitly NOT complete

```text
NOT claimed by this candidate:
  Human Acceptance
  physical column presence
  VR-1 PASS
  mapping-complete PASS
  SharePoint create authorization
  adapter Implementation Start
```

## 8. Next

```text
Candidate status: READY for Human Acceptance compare
Next gate: HUMAN ACCEPTANCE OF MAP-AS-010 COLUMN CONTRACT
After Acceptance（future；not auto-started）:
  Human SharePoint create becomes next candidate gate
  mapping-complete still NOT YET until create + VR-1
```
