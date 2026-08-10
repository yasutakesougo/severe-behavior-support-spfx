# Decision-AS-MAP010-COLUMN-1 — MAP-AS-010 Column Contract packet

この文書は、MAP-AS-010 Column Contract selection 後の
**supersedesSnapshotId persistence slot contract**（naming / type / optional /
Read / Write conversion）についての比較用 Human Decision Packet である。

Selected via:
[`decision-assessment-snapshot-map010-column-selection.md`](./decision-assessment-snapshot-map010-column-selection.md)

Acceptance 正本:
[`decision-assessment-snapshot-map010-column-acceptance.md`](./decision-assessment-snapshot-map010-column-acceptance.md)

Contract:
[`assessment-snapshot-map010-column-contract.md`](./assessment-snapshot-map010-column-contract.md)

IR:
[`decision-assessment-snapshot-map010-column-independent-review.md`](./decision-assessment-snapshot-map010-column-independent-review.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-cv-extension-acceptance.md`](./decision-assessment-snapshot-cv-extension-acceptance.md)
（X-2-A PERSISTED）
[`decision-assessment-snapshot-column-names-acceptance.md`](./decision-assessment-snapshot-column-names-acceptance.md)
（NM-1 pattern for CV-REQ；010 OUT of that Acceptance）
[`decision-assessment-snapshot-conversion-acceptance.md`](./decision-assessment-snapshot-conversion-acceptance.md)
（C-1-A text conversion precedent；010 OUT）
[`assessment-snapshot-complete-contract.md`](./assessment-snapshot-complete-contract.md)
[`decision-dec-009-snapshot-save-timing-acceptance.md`](./decision-dec-009-snapshot-save-timing-acceptance.md)
[`decision-assessment-snapshot-application-save-acceptance.md`](./decision-assessment-snapshot-application-save-acceptance.md)
[`decision-assessment-snapshot-dec6-mapping-acceptance.md`](./decision-assessment-snapshot-dec6-mapping-acceptance.md)
[`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-MAP010-COLUMN-1
Kind: Human Decision packet（compare → CONSUMED）
Status: CONSUMED（Human Decision Accepted / LOCKED）
Baseline main: 6124127ad306848ac890a673cc8b5c0dd4c57710
Human Selection of unit: MAP-AS-010 Column Contract（SELECTED / CONSUMED）
Human Decision: N-1-A + N-2-A + T-1-A + O-1-A + R-1-A + W-1-A + XB-1
Human Selected:
  N-1 Internal Name:         N-1-A = supersedesSnapshotId
  N-2 Display Name:          N-2-A = 訂正元スナップショットID
  T-1 Column Type:           T-1-A = 1行テキスト（OPTIONAL）
  O-1 Optional semantics:    O-1-A
  R-1 Read Conversion:       R-1-A
  W-1 Write Conversion:      W-1-A
  Boundary:                  XB-1
Accepted 正本:
  decision-assessment-snapshot-map010-column-acceptance.md

Agent recommendation（historical / NOT Acceptance）:
  N-1-A + N-2-A + T-1-A + O-1-A + R-1-A + W-1-A + XB-1

Current boundary（unchanged by Acceptance for create / impl）:
  SharePoint column create = FORBIDDEN
  VR-1 for MAP-AS-010 = NOT RUN
  MAP-AS-010 column-ready = NO
  mapping-complete = NOT YET
  adapter / Implementation Start = HOLD
  Deploy / real data = NO-GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Question

```text
MAP-AS-010 supersedesSnapshotId（PERSISTED disposition Accepted）について、
Internal Name / Display Name / Column Type / optional persistence /
Read Conversion / Write Conversion / failure behavior をどう固定するか。

本 Decision ≠ SharePoint create GO
本 Decision ≠ VR-1 PASS
本 Decision ≠ mapping-complete PASS
本 Decision ≠ adapter Implementation Start
```

## 2. Re-Decision しない前提（LOCKED）

| 項目 | 固定値 | 正本 |
|---|---|---|
| MAP-AS-010 disposition | PERSISTED | CV-EXTENSION-1 / X-2-A |
| Logical field | `supersedesSnapshotId?: string` | complete-contract |
| Correction semantics | retain original + new version；overwrite NOT ADOPTED | DEC-009 |
| Save intent | includes `correct-as-new-version` | APP-SAVE-1 |
| Domain present-rules | non-empty；`!== snapshotId`；`recordStatus === finalized` | complete-contract |
| CV-REQ naming pattern | Internal Name = logical field id（Human-provided） | COLUMN-NAMES-1 |
| Required Text conversion precedent | C-1-A strict identity + fail-closed | CONVERSION-1 |
| MAP-AS-009 / ENV | OUT / DERIVED | CV-EXTENSION-1 |

```text
FORBIDDEN in this packet:
  Accepting Internal Name without Human Decision
  SharePoint create
  inventing complex multi-value / JSON representation without need
  null → default coercion
  treating optional absence as invalid
  claiming mapping-complete PASS
```

## 3. Compare axes

### N-1 — Internal Name

Classification: **DECISION_REQUIRED**（pattern-aligned；not uniquely Accepted）

| ID | Internal Name | 結果 |
|---|---|---|
| **N-1-A** | `supersedesSnapshotId` | **SELECTED / Accepted** |
| N-1-HOLD | Internal Name 未決定 | NOT SELECTED |
| N-1-X | Human 明示の別値 | NOT SELECTED |

```text
Why N-1-A is a valid candidate（not auto-Accepted）:
  COLUMN-NAMES-1 CV-REQ pattern used Internal Name = logical field id
    （snapshotId / recordStatus / reasonCodes / …）
  logical field id is already supersedesSnapshotId in complete-contract
  NM-1 requires Human-provided intended names；Agent invention FORBIDDEN

MUST NOT Accept solely because logical name matches.
Human must still Accept N-1-A（or N-1-X）.
```

### N-2 — Display Name

Classification: **DECISION_REQUIRED**

| ID | Display Name | 根拠 / パターン | 結果 |
|---|---|---|---|
| **N-2-A** | 訂正元スナップショットID | CV-REQ Japanese descriptive labels；DEC-009「訂正」語彙；points to superseded prior snapshot | **SELECTED / Accepted** |
| N-2-B | 上位スナップショットID | shorter；weaker correction-semantics signal | NOT SELECTED |
| N-2-HOLD | Display Name 未決定 | — | NOT SELECTED |
| N-2-X | Human 明示 | — | NOT SELECTED |

```text
Pattern authority:
  COLUMN-NAMES-1 Display Names are Human Japanese labels describing the field
  （例: snapshotId → スナップショットID）
N-2-A uses the same style and correction vocabulary from DEC-009 / complete-contract.
Still requires Human Acceptance（not derived uniquely）.
```

### T-1 — Column Type

Classification: **CANDIDATE**（strongly patterned on snapshotId）

| ID | Column Type | 結果 |
|---|---|---|
| **T-1-A** | 1行テキスト | **SELECTED / Accepted** |
| T-1-B | 複数行テキスト / Note | NOT SELECTED（oversized；no array/JSON need） |
| T-1-HOLD | type 未決定 | NOT SELECTED |
| T-1-X | Human 明示 | NOT SELECTED |

```text
Logical type = string?（optional single string id）
Lossless minimum = single-line text（same family as snapshotId / MAP-AS-001）
No complex representation required for a single opaque id string.
```

### O-1 — Optional persistence semantics

Classification: **CANDIDATE**

Logical requiredness: **OPTIONAL**

| ID | absence / invalid semantics | 結果 |
|---|---|---|
| **O-1-A** | logical absence ↔ persistence blank/null/missing = success absent。present value must be non-empty string。empty/whitespace/null-as-present/non-string = fail-closed。no default synthesis | **SELECTED / Accepted** |
| O-1-B | empty string also treated as absence | NOT SELECTED（collapses invalid present with absence；ambiguity） |
| O-1-HOLD | optional semantics 未決定 | NOT SELECTED |
| O-1-X | Human 明示 | NOT SELECTED |

```text
Critical distinction（O-1-A）:
  logical optional absence ≠ invalid persisted value
  absent → OK（undefined）
  empty / whitespace-only → FAIL-CLOSED（invalid present）
  null as present / unexpected non-string → FAIL-CLOSED
  no null→default / empty→synthetic id
```

### R-1 — Read Conversion

Classification: **CANDIDATE**（aligned to C-1-A + O-1-A）

| ID | Read rule | 結果 |
|---|---|---|
| **R-1-A** | null/missing → undefined（absent）。valid non-empty string → string pass-through（no trim）。empty/whitespace/non-string → fail-closed。self-reference vs snapshotId NOT decided in column read alone | **SELECTED / Accepted** |
| R-1-B | empty → absent | NOT SELECTED with O-1-A |
| R-1-HOLD | read 未決定 | NOT SELECTED |
| R-1-X | Human 明示 | NOT SELECTED |

### W-1 — Write Conversion

Classification: **CANDIDATE**

| ID | Write rule | 結果 |
|---|---|---|
| **W-1-A** | undefined/absent → persistence absence semantic（clear/omit/null deferred to adapter）。valid non-empty string → Text pass-through（no trim）。empty/whitespace/null → fail-closed（validated domain should not emit） | **SELECTED / Accepted** |
| W-1-B | absent → omit only；never clear existing | NOT SELECTED |
| W-1-HOLD | write 未決定 | NOT SELECTED |
| W-1-X | Human 明示 | NOT SELECTED |

```text
Write-clear representation（W-1-A）:
  blank/null used to represent optional absence on update paths
  NOT a default value invention
  exact SharePoint client clear API remains adapter-impl concern under this semantic
```

### Cross-record / lineage validation boundary

```text
Column conversion（this Decision）owns:
  type / presence / empty-vs-absent / string pass-through

Domain validation（complete-contract；UNCHANGED）owns:
  if present: non-empty
  !== snapshotId
  recordStatus === finalized
  → INVALID_CORRECTION_LINK / MALFORMED_INPUT

Application / save（APP-SAVE / DEC-009；UNCHANGED）owns:
  correct-as-new-version intent
  overwrite forbidden
  new snapshot id assignment

Adapter / persistence（later gate）owns:
  transport of blank/null vs Text
  NOT inventing lineage semantics

MUST NOT move cross-record existence checks into column conversion
unless a later Accepted architecture explicitly requires it.
```

### XB — boundary

| ID | 内容 | 結果 |
|---|---|---|
| **XB-1** | 本 Decision ≠ SharePoint create GO ≠ VR-1 PASS ≠ mapping-complete PASS ≠ adapter Implementation Start ≠ Deploy | **SELECTED / Accepted** |
| XB-2 | Column contract Acceptance と同時に create / adapter start | NOT SELECTABLE |

## 4. Agent recommendation（historical；NOT Acceptance）

```text
Agent recommendation（historical）:
  N-1-A + N-2-A + T-1-A + O-1-A + R-1-A + W-1-A + XB-1

Human Decision（Accepted / LOCKED）:
  same set — see Acceptance 正本

Agent recommendation alone is NOT Human Acceptance evidence.
```

## 5. Mapping-complete impact

```text
Decision Accepted:
  MAP-AS-010 disposition = PERSISTED（already）
  column contract = ACCEPTED / LOCKED
  physical column = still NOT PRESENT
  VR-1 = NOT RUN
  column-ready = NO

Therefore:
  mapping-complete = NOT YET
  Human SharePoint create = next candidate gate after PR Ready/Merge
  （not authorized by this Acceptance）
```

## 6. Explicit OUT / non-authorization

```text
This CONSUMED packet / Acceptance does NOT authorize:
  SharePoint column create / rename / delete
  VR-1 execution
  mapping-complete PASS
  adapter / DTO / schema wiring
  Issue mutation
  Ready / Merge without separate Human authorization
  Deploy / real data
  P2-002 closure
```

## 7. Next

```text
Decision-AS-MAP010-COLUMN-1: Accepted / LOCKED
  / N-1-A + N-2-A + T-1-A + O-1-A + R-1-A + W-1-A + XB-1
Packet: CONSUMED
MAP-AS-010 column contract: ACCEPTED / LOCKED
MAP-AS-010 column-ready: NO
mapping-complete: NOT YET
Next gate: HUMAN READY DECISION FOR PR #209
Still HOLD / FORBIDDEN:
  SharePoint create / VR-1
  Implementation Start / adapter
  mapping-complete PASS
  Deploy / real data
```
