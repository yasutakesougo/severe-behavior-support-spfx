# AssessmentSnapshot — MAP-AS-010 Column Contract

この文書は、**Decision-AS-MAP010-COLUMN-1** Accepted / LOCKED に基づく
`supersedesSnapshotId` SharePoint persistence slot 向け
**column contract 正本**である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-MAP010-COLUMN-1
Kind: Column contract（docs-only）
Status: ACCEPTED / LOCKED
Human Acceptance: Explicit Human Decision on 2026-08-10
Baseline main: 6124127ad306848ac890a673cc8b5c0dd4c57710
PR: #209

Acceptance:
  decision-assessment-snapshot-map010-column-acceptance.md
Packet（compare history）:
  decision-assessment-snapshot-map010-column-packet.md
Selection:
  decision-assessment-snapshot-map010-column-selection.md
IR:
  decision-assessment-snapshot-map010-column-independent-review.md

Prior disposition（LOCKED；再 Decision しない）:
  MAP-AS-010 = PERSISTED（Decision-AS-CV-EXTENSION-1 / X-2-A）

Column contract: ACCEPTED / LOCKED
Column-ready: NO
Physical column: NOT PRESENT
VR-1: NOT RUN
SharePoint create: FORBIDDEN（this Acceptance）
mapping-complete: NOT YET
adapter / Implementation Start: HOLD
Deploy / real data: NO-GO
```

## 1. Accepted contract summary

| Axis | Value | Decision Status |
|---|---|---|
| Mapping ID | MAP-AS-010 | LOCKED prior（PERSISTED） |
| Logical Field | `supersedesSnapshotId?: string` | LOCKED prior |
| Logical requiredness | OPTIONAL | ACCEPTED / LOCKED |
| Internal Name | `supersedesSnapshotId` | ACCEPTED / LOCKED（N-1-A） |
| Display Name | 訂正元スナップショットID | ACCEPTED / LOCKED（N-2-A） |
| Column Type | 1行テキスト | ACCEPTED / LOCKED（T-1-A） |
| Representation | —（plain text id） | ACCEPTED / LOCKED |
| Read Conversion | R-1-A | ACCEPTED / LOCKED |
| Write Conversion | W-1-A | ACCEPTED / LOCKED |
| Failure Behavior | RW-1 + MF-1 fail-closed；optional absence OK | ACCEPTED / LOCKED（O-1-A） |

## 2. Optional / absence semantics（O-1-A LOCKED）

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

## 3. Read Conversion（R-1-A LOCKED）

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

## 4. Write Conversion（W-1-A LOCKED）

| Logical input | Persistence output |
|---|---|
| `undefined` / absent | persistence absence semantic（blank/null/omit） |
| valid non-empty string | Text pass-through（no trim） |
| empty / whitespace-only | fail-closed |
| `null` | fail-closed |

```text
Validated domain snapshot is the write source for present values.
Exact SharePoint client clear/omit/null transport mechanics
= adapter impl gate（P2-002 OPEN / CARRY-FORWARD；Decision blocker NO）
REST/PnP/client API mechanic is NOT locked by this Decision.
```

## 5. Failure behavior

```text
RW-1: conversion failure must not become success
MF-1: malformed / unexpected type fail-closed
Optional absence is success（not a missing-required failure）
EM-1 / FR-1 mapping remains adapter responsibility at impl gate
```

## 6. Layered validation ownership（LOCKED）

| Concern | Layer |
|---|---|
| blank vs present string shape | column conversion（this Decision） |
| non-empty when present | domain（and mirrored in conversion fail-closed） |
| `!== snapshotId` | domain |
| `recordStatus === finalized` when present | domain |
| correct-as-new-version intent / overwrite forbidden | application save（APP-SAVE / DEC-009） |
| SP transport / exact clear-or-omit API | adapter（later） |

## 7. Explicitly NOT complete

```text
NOT claimed by this Acceptance:
  physical column presence
  VR-1 PASS
  mapping-complete PASS
  SharePoint create authorization
  adapter Implementation Start
  P2-002 closure
```

## 8. Next

```text
Decision-AS-MAP010-COLUMN-1: Accepted / LOCKED
MAP-AS-010 column contract: ACCEPTED / LOCKED
MAP-AS-010 column-ready: NO
mapping-complete: NOT YET
Next gate（PR process）: HUMAN READY DECISION FOR PR #209
After merge（future；not auto-started）:
  Human SharePoint create becomes next candidate gate
  then VR-1；then mapping-complete determination
```
