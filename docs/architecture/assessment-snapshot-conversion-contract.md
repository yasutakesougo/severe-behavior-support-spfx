# AssessmentSnapshot — SharePoint Read/Write Conversion Contract（Candidate）

この文書は、**Decision-AS-CONVERSION-1** の
AssessmentSnapshots CV-REQ（MAP-AS-001〜008）向け
**Read Conversion / Write Conversion 候補契約**である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-CONVERSION-1
Kind: Conversion contract candidate（docs-only）
Status: CANDIDATE / NOT ACCEPTED
Baseline main: 632d28ae44e1b72929dc628caae183197a976477

Packet:
  decision-assessment-snapshot-conversion-packet.md
Selection:
  decision-assessment-snapshot-conversion-selection.md
IR:
  decision-assessment-snapshot-conversion-independent-review.md

Scope: MAP-AS-001〜008 only
OUT: MAP-AS-009 / 010 / ENV / Title app-mapping / adapter code

Implementation Start: HOLD
SharePoint adapter / schema mapping implementation: HOLD
SharePoint item write / column mutation: FORBIDDEN
mapping-complete: NOT YET
Deploy / real data: NO-GO
```

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-conversion-packet.md`](./decision-assessment-snapshot-conversion-packet.md)
[`decision-assessment-snapshot-column-names-acceptance.md`](./decision-assessment-snapshot-column-names-acceptance.md)
[`decision-assessment-snapshot-choice-options-acceptance.md`](./decision-assessment-snapshot-choice-options-acceptance.md)
[`decision-assessment-snapshot-dec6-mapping-acceptance.md`](./decision-assessment-snapshot-dec6-mapping-acceptance.md)
[`decision-assessment-snapshot-sp-adapter-acceptance.md`](./decision-assessment-snapshot-sp-adapter-acceptance.md)
[`assessment-snapshot-complete-contract.md`](./assessment-snapshot-complete-contract.md)
[`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)
[`decision-assessment-snapshot-column-create-vr1-evidence.md`](./decision-assessment-snapshot-column-create-vr1-evidence.md)
[`contracts-v1.md`](./contracts-v1.md)

## 1. Purpose

SharePoint persistence value ↔ logical/domain value の変換規則を明示する。
変換責務は adapter 内（CV-1）。本文書は実装開始を許可しない。

## 2. Global failure / conversion principles（candidate）

```text
RW-1: per-field read/write rules；変換失敗は成功へ倒さない
MF-1: 必須欠落・型不正・未知必須値は fail-closed
CV-1: conversion は adapter 内
EM-1 / FR-1: adapter 失敗語彙へ写像（具体 FR code 割当は adapter 実装ゲート）

FORBIDDEN in this candidate:
  null → default
  invalid → valid coerce
  unknown Choice → fallback / Display-label match success
  trim-to-accept for required Text
  CSV / delimiter for reasonCodes
  reasonCodes duplicate persistence → silent dedupe / coerce to unique
  DateOnly → UTC datetime semantic rewrite
  inventing MAP-AS-009 / 010 / ENV conversions
```

## 3. Topic rules（candidate）

### C-1 Required text（MAP-AS-001 / 005 / 008）— CANDIDATE C-1-A

| Edge | Read | Write |
|---|---|---|
| normal non-empty string | pass-through exact string | pass-through exact string |
| empty `""` | fail-closed | fail-closed（domain 不達） |
| whitespace-only | fail-closed | fail-closed |
| leading/trailing whitespace with non-empty body | pass-through（no trim） | pass-through（no trim） |
| null | fail-closed | fail-closed |
| undefined / missing field | fail-closed | fail-closed |
| unexpected non-string | fail-closed | fail-closed |
| trim-to-accept | FORBIDDEN | FORBIDDEN |

Acceptance predicate aligned to domain `isNonEmptyString`:
`typeof value === "string" && value.trim() !== ""`（判定のみ；値は改変しない）。

### C-2 Choice（MAP-AS-002 / 003）— CANDIDATE C-2-DERIVED

| Edge | Read | Write |
|---|---|---|
| known stored value | stored → domain enum | domain enum → stored |
| Display label | NOT used as persistence key | NOT written as stored key |
| unknown Choice | fail-closed | n/a（domain enum 外は不達） |
| missing / null / empty | fail-closed | fail-closed |
| unexpected non-string / wrong type | fail-closed | fail-closed |

Stored values（Accepted；再 Decision しない）:

| Field | Stored values |
|---|---|
| recordStatus | `draft`, `finalized` |
| result | `NO_FINDINGS`, `FINDINGS_PRESENT`, `NOT_APPLICABLE` |

### C-3 reasonCodes JSON（MAP-AS-004）— CANDIDATE C-3-A

Representation family = JSON（COLUMN-NAMES-1 Accepted；再 Decision しない）。

| Edge | Rule |
|---|---|
| encode form | `JSON.stringify(string[])` compact array |
| decode | `JSON.parse` → must be unique `string[]` of `isReasonCode` |
| ordering | preserve exactly |
| empty array | `"[]"` ↔ `[]` |
| missing / null | fail-closed |
| invalid JSON | fail-closed |
| non-array JSON | fail-closed |
| non-string member | fail-closed |
| member failing `isReasonCode` | fail-closed |
| duplicates | **FAIL-CLOSED**（no read-side dedupe / coerce） |
| unknown object/map structure | fail-closed |
| CSV / delimiter / multi-value | NOT ADOPTED |

```text
Lossless success only for unique string[] persistence values.
normalizeReasonCodes MUST NOT be used as read-side persistence repair.
Domain-internal normalizeReasonCodes behavior: UNCHANGED by this Decision.
Write source MUST be validated unique reasonCodes from domain snapshot.
```

### C-4 DateOnly（MAP-AS-006 / 007）— CANDIDATE C-4-A

| Edge | Rule |
|---|---|
| accepted ISO format | `YYYY-MM-DD` only |
| timezone | civil date preserved；contracts-v1 interpretation `Asia/Tokyo` as calendar basis |
| UTC conversion | FORBIDDEN as semantic rewrite |
| local-date preservation | REQUIRED |
| time component on logical value | reject |
| DateOnly read producing different civil day | FORBIDDEN |
| null / missing | fail-closed |
| invalid / impossible date | fail-closed |

Authority: contracts-v1 LocalDate + domain `isValidIsoDate` + VR-1 DateOnly OBSERVED。

## 4. Mapping table（MAP-AS-001〜008）

| Mapping ID | Logical Field | SP Internal Name | SP Column Type | Read Conversion | Write Conversion | Failure Behavior | Decision Status | Evidence / Authority |
|---|---|---|---|---|---|---|---|---|
| MAP-AS-001 | snapshotId | snapshotId | 1行テキスト | Text → non-empty string pass-through；empty/ws/null/missing/non-string fail-closed | non-empty string → Text pass-through | RW-1 + MF-1 fail-closed | CANDIDATE | C-1-A；complete-contract；VR-1 |
| MAP-AS-002 | recordStatus | recordStatus | 選択肢 | stored Choice → enum；label unused；unknown/missing/null/empty fail-closed | enum → stored Choice | RW-1 + MF-1 fail-closed | CANDIDATE（DERIVED） | C-2-DERIVED；CHOICE-OPTIONS-1；VR-1 |
| MAP-AS-003 | result | result | 選択肢 | stored Choice → enum；label unused；unknown/missing/null/empty fail-closed | enum → stored Choice | RW-1 + MF-1 fail-closed | CANDIDATE（DERIVED） | C-2-DERIVED；CHOICE-OPTIONS-1；VR-1 |
| MAP-AS-004 | reasonCodes | reasonCodes | 複数行テキスト | Note JSON → unique string[]（isReasonCode；order exact；duplicates fail-closed）；invalid/null/missing fail-closed | unique string[] → compact JSON array in Note | RW-1 + MF-1 fail-closed | CANDIDATE | C-3-A；COLUMN-NAMES-1 Representation=JSON；complete-contract |
| MAP-AS-005 | ruleSetVersion | ruleSetVersion | 1行テキスト | same as MAP-AS-001 | same as MAP-AS-001 | RW-1 + MF-1 fail-closed | CANDIDATE | C-1-A；complete-contract；VR-1 |
| MAP-AS-006 | periodStart | periodStart | 日付のみ | DateOnly → `YYYY-MM-DD` civil date；no TZ rewrite | `YYYY-MM-DD` → DateOnly civil date | RW-1 + MF-1 fail-closed | CANDIDATE | C-4-A；contracts-v1；isValidIsoDate；VR-1 |
| MAP-AS-007 | periodEnd | periodEnd | 日付のみ | same as MAP-AS-006 | same as MAP-AS-006 | RW-1 + MF-1 fail-closed | CANDIDATE | C-4-A；contracts-v1；isValidIsoDate；VR-1 |
| MAP-AS-008 | inputFingerprint | inputFingerprint | 1行テキスト | same as MAP-AS-001 | same as MAP-AS-001 | RW-1 + MF-1 fail-closed | CANDIDATE | C-1-A；complete-contract；VR-1 |

```text
Decision Status legend（this document）:
  DERIVED   = uniquely fixed by prior Accepted contract；still needs Acceptance to lock row
  CANDIDATE = proposed in Decision-AS-CONVERSION-1 packet；NOT ACCEPTED
  ACCEPTED  = Human Acceptance only（not used before Acceptance）
  HOLD      = insufficient primary evidence / deferred
```

## 5. Explicitly NOT complete

```text
NOT claimed by this candidate:
  Human Acceptance of Decision-AS-CONVERSION-1
  mapping-complete PASS
  MAP-AS-009 / 010 / ENV conversion or adoption
  adapter implementation
  schema / DTO wiring
  SharePoint item round-trip verification as Acceptance substitute
  Deploy / real data GO
```

## 6. Next

```text
Candidate status: READY for Human Acceptance compare
Next gate: HUMAN ACCEPTANCE OF Decision-AS-CONVERSION-1
After Acceptance（future；not auto-started）:
  conversion rows may become ACCEPTED
  MT-1 Read/Write Conversion cells may be updated
  mapping-complete still NOT automatic
  adapter / Implementation Start still require separate gates
```
