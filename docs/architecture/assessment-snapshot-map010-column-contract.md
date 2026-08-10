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
Column-ready: YES
Physical column: PRESENT（isogo + honmoku）
VR-1: PASS
Human SharePoint create: COMPLETE（post-Acceptance physical path）
Agent SharePoint mutation: 0
mapping-complete: PASS / COMPLETE（see determination）
adapter / Implementation Start: HOLD
P2-002 clear/omit transport API: CLOSED
  Authority: Decision-AS-ADAPTER-EC3-EC4-1 / CO-1-A
Deploy / real data: NO-GO

Post-create evidence:
  decision-assessment-snapshot-map010-column-create-vr1-evidence.md
mapping-complete determination:
  decision-assessment-snapshot-mapping-complete-determination.md
EC-3/EC-4 Acceptance:
  decision-assessment-snapshot-adapter-ec3-ec4-acceptance.md
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
= CLOSED by Decision-AS-ADAPTER-EC3-EC4-1（CO-1-A under TC-1-A）
This MAP010-COLUMN-1 Decision itself did not lock the transport API.
Living authority:
  decision-assessment-snapshot-adapter-ec3-ec4-acceptance.md
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

## 7. Post-Acceptance physical path（living）

```text
Human SharePoint create: COMPLETE
VR-1: PASS（Intent = Observed；Mismatch = 0；both sites）
Physical column: PRESENT
column-ready: YES
mapping-complete: PASS / COMPLETE（M-1-A determination）

Still NOT authorized by contract / evidence / determination alone:
  adapter Implementation Start
  DTO / schema wiring
  Deploy / real data
  Agent SharePoint mutation

P2-002 living: CLOSED（Decision-AS-ADAPTER-EC3-EC4-1）
```

## 8. Next

```text
Decision-AS-MAP010-COLUMN-1: Accepted / LOCKED
MAP-AS-010 column contract: ACCEPTED / LOCKED
MAP-AS-010 column-ready: YES
Physical column: PRESENT
VR-1: PASS
mapping-complete: PASS / COMPLETE
P2-002: CLOSED（Decision-AS-ADAPTER-EC3-EC4-1 / CO-1-A）
Still HOLD:
  Implementation Start / adapter / DTO / schema
  Deploy / real data
Next gate: AIS-1-B Implementation Start gate
```
