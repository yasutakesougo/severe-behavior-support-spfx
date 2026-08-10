# Decision-AS-CV-EXTENSION-1 — CV Extension Decision packet（009 / 010 / ENV）

この文書は、AssessmentSnapshots CV Extension selection 後の
**MAP-AS-009 / 010 / ENV-001〜003 persistence placement** についての
比較用 Human Decision Packet である。

Selected via:
[`decision-assessment-snapshot-cv-extension-selection.md`](./decision-assessment-snapshot-cv-extension-selection.md)

Accepted 正本:
[`decision-assessment-snapshot-cv-extension-acceptance.md`](./decision-assessment-snapshot-cv-extension-acceptance.md)

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
[`sharepoint-contract-mapping.md`](./sharepoint-contract-mapping.md)（DTO envelope precedent）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-CV-EXTENSION-1
Kind: Human Decision packet（compare → CONSUMED）
Status: CONSUMED（Human Decision Accepted / LOCKED）
Baseline main: 4fc919f63539466eced1a6f6213512e586583de5
Human Selection of unit: CV Extension Decision（SELECTED / CONSUMED）
Human Decision: M-1-A + X-1-B + X-2-A + X-3-B + X-4-B + X-5-B + XB-1
Human Selected:
  M-1 disposition model:     M-1-A
  X-1 findingIds:            X-1-B
  X-2 supersedesSnapshotId:  X-2-A
  X-3 schemaId:              X-3-B
  X-4 schemaVersion:         X-4-B
  X-5 dtoVersion:            X-5-B
  Boundary:                  XB-1
Accepted 正本:
  decision-assessment-snapshot-cv-extension-acceptance.md

Agent recommendation（historical / NOT Acceptance）:
  M-1-A + X-1-B + X-2-A + X-3-B + X-4-B + X-5-B + XB-1

Current boundary（unchanged by Acceptance for implementation / create）:
  Implementation Start = HOLD
  adapter / schema / DTO wiring = HOLD
  SharePoint column create / mutation = FORBIDDEN
  mapping-complete = NOT YET
  Deploy / real data = NO-GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Question

```text
mapping-complete に向けて、MAP-AS-009 / 010 / ENV-001〜003 の
persistence placement をどう Dispositionするか。

各 field について:
  PERSISTED（物理列が必要） /
  DERIVED（列なし表現が Accepted authority で足りる） /
  EXPLICITLY OUT（v1 対象外） /
  HOLD

本 Decision ≠ column naming Acceptance
本 Decision ≠ SharePoint create GO
本 Decision ≠ conversion codec lock for new columns
本 Decision ≠ adapter Implementation Start
本 Decision ≠ mapping-complete PASS
```

## 2. Re-Decision しない前提（LOCKED）

| 項目 | 固定値 | 正本 |
|---|---|---|
| MAP-AS-001〜008 names/types | OBSERVED / CONFIRMED | COLUMN-NAMES-1 + VR-1 |
| MAP-AS-001〜008 conversion | ACCEPTED / LOCKED | CONVERSION-1 |
| findingIds requiredness | NOT REQUIRED | Entry #5 |
| Schema ID string | `severe-behavior-support.assessment-snapshot.snapshot` | SCHEMA-ID-1 |
| schemaVersion / dtoVersion logical | `1.0.0` / `1.0.0` | SCHEMA-VERSION-1 |
| DEC-009 correction | retain original + new version；overwrite NOT ADOPTED | DEC-009 |
| APP-SAVE intents | draft / finalize / correct-as-new-version | APP-SAVE-1 |
| DEC-6 version rule | VR-1（1.0.0/1.0.0 or explicit readable set） | DEC6-MAPPING-1 |
| domain envelope fields | domain AssessmentSnapshot は schemaId/version を持たない | complete-contract |

```text
FORBIDDEN in this packet:
  invent Internal Name / Display Name / Column Type
  invent JSON / delimiter codecs
  invent default / null coercion / version fallback
  authorize SharePoint create
  claim mapping-complete PASS
  start adapter / DTO / schema wiring
```

## 3. Compare axes

### M-1 — mapping-complete disposition model

| ID | 内容 | 結果 |
|---|---|---|
| **M-1-A** | mapping-complete は各 MT-1 row が Accepted disposition ∈ {PERSISTED, DERIVED, EXPLICITLY OUT/対象外} で一意に決まること。物理列必須ではない | **SELECTED / Accepted** |
| M-1-B | mapping-complete は logical/DTO field すべてに物理 SharePoint 列が存在すること | NOT recommended（MT-1 に 対象外 vocabulary あり；SYS-001 先例；VR-1 readable set と衝突しやすい） |
| M-1-HOLD | disposition model 未決定 | available |
| M-1-X | Human 明示 | available |

```text
SoT support for M-1-A（not unique lock without Human Decision）:
  MT-1 Status includes 対象外
  MAP-AS-SYS-001 already 対象外 for app mapping
  DEC-6 VR-1 allows explicit readable set without requiring columns
  Entry #5 does not force findingIds persistence

SoT gap:
  no Accepted sentence uniquely defines mapping-complete = disposition completeness
  → M-1 remains a Human Decision topic
```

### X-1 — MAP-AS-009 findingIds

Classification: **OPTIONAL_EXPLICIT_OUT_CANDIDATE** / **DECISION_REQUIRED**

| ID | 内容 | 結果 |
|---|---|---|
| X-1-A | v1 で persistence slot を採用する（naming/type は別 Decision） | available |
| **X-1-B** | v1 で EXPLICITLY OUT / deferred（MT-1 Status=対象外）。domain OPTIONAL / NOT REQUIRED を維持 | **SELECTED / Accepted** |
| X-1-HOLD | 情報不足 | NOT recommended as default（Entry #5 十分） |
| X-1-X | Human 明示 | available |

```text
Facts（LOCKED）:
  findingIds: NOT REQUIRED（Entry #5）
  OPTIONAL adoption is NOT forced by Entry #5
  domain may omit findingIds
  array physical representation: NOT invented here

Exclusion impact:
  does NOT lose an Accepted guarantee that findingIds must be persisted
  (no such persistence guarantee exists)

If X-1-A later selected:
  naming / type / codec / create / VR-1 = separate gates（not this Acceptance alone）
```

### X-2 — MAP-AS-010 supersedesSnapshotId

Classification: **DECISION_REQUIRED**（lineage persistence）

| ID | 内容 | 結果 |
|---|---|---|
| **X-2-A** | v1 persistence slot を採用する（naming/type は別 Decision）。correct-as-new-version の lineage link を SP に残す | **SELECTED / Accepted** |
| X-2-B | v1 で EXPLICITLY OUT / deferred。lineage link は SP 非永続（別表現または非対応） | available（明示トレードオフ必要） |
| X-2-HOLD | 情報不足 | available |
| X-2-X | Human 明示 | available |

```text
Facts（LOCKED）:
  logical optional；present ⇒ non-empty / !== snapshotId / finalized
  DEC-009: retain original + save new version；overwrite NOT ADOPTED
  APP-SAVE SC-1 intent includes correct-as-new-version
  domain expresses correction link via supersedesSnapshotId

Why not uniquely PERSISTENCE_REQUIRED yet:
  no Accepted sentence says “SharePoint column for supersedesSnapshotId is mandatory”
  BUT excluding it without explicit OUT would leave lineage unpersistable on SP path

X-2-B consequence（must be Human-visible）:
  correct-as-new-version cannot round-trip lineage via AssessmentSnapshots columns
```

### X-3 — MAP-AS-ENV-001 schemaId

Classification: **DECISION_REQUIRED**

| ID | 内容 | 結果 |
|---|---|---|
| X-3-A | per-item SharePoint column を採用（naming/type 別 Decision） | available |
| **X-3-B** | physical column なし。DTO/adapter boundary で Accepted Schema ID constant を供給（DERIVED） | **SELECTED / Accepted** |
| X-3-HOLD | 情報不足 | available |
| X-3-X | Human 明示 | available |

```text
Facts（LOCKED）:
  Schema ID string Accepted
  domain AssessmentSnapshot does not carry schemaId
  DTO/SP assignment HOLD / NOT STARTED
  SupportPlan mapping documents DTO envelope fields separately from SP columns

MUST NOT conclude “no storage needed” merely because value is a constant.
X-3-B requires Human Acceptance that DTO/adapter-supplied constant is the
explicit persistence/DTO responsibility for mapping disposition.

X-3-B does NOT invent a SharePoint column or code assignment.
```

### X-4 — MAP-AS-ENV-002 schemaVersion

Classification: **DECISION_REQUIRED**

| ID | 内容 | 結果 |
|---|---|---|
| X-4-A | per-item SharePoint column を採用（naming/type 別 Decision） | available |
| **X-4-B** | physical column なし。DEC-6 VR-1「明示 readable set」/ DTO・adapter 供給 constant = `1.0.0` | **SELECTED / Accepted** |
| X-4-HOLD | 情報不足 | available |
| X-4-X | Human 明示 | available |

```text
Facts（LOCKED）:
  schemaVersion logical = 1.0.0
  VR-1: persistence でも 1.0.0/1.0.0（または明示 readable set）と照合；不一致 fail-closed
  VR-2（ignore versions）NOT SELECTED

X-4-B authority basis:
  DEC-6 VR-1 explicit alternate path（readable set）
  NOT a silent fallback
  MUST remain fail-closed on mismatch when a persisted/declared version exists later
```

### X-5 — MAP-AS-ENV-003 dtoVersion

Classification: **DECISION_REQUIRED**

| ID | 内容 | 結果 |
|---|---|---|
| X-5-A | per-item SharePoint column を採用（naming/type 別 Decision） | available |
| **X-5-B** | physical column なし。DEC-1 dtoVersion=schemaVersion；VR-1 readable set / DTO・adapter 供給 constant = `1.0.0` | **SELECTED / Accepted** |
| X-5-HOLD | 情報不足 | available |
| X-5-X | Human 明示 | available |

```text
Facts（LOCKED）:
  dtoVersion logical = 1.0.0
  DEC-1: dtoVersion = Schema Version
  MUST NOT conflate schemaVersion and dtoVersion roles
  both may share value 1.0.0 without becoming the same concept

X-5-B pairs with X-4-B under VR-1 readable set；still a separate Decision axis.
```

### XB — Implementation boundary

| ID | 内容 | 結果 |
|---|---|---|
| **XB-1** | 本 Decision ≠ naming Acceptance ≠ column create GO ≠ conversion codec lock ≠ adapter Implementation Start ≠ mapping-complete PASS ≠ Deploy | **SELECTED / Accepted** |
| XB-2 | placement Acceptance と同時に create / adapter start | NOT SELECTABLE |

## 4. Agent recommendation（NOT Acceptance）

```text
Agent recommendation:
  M-1-A + X-1-B + X-2-A + X-3-B + X-4-B + X-5-B + XB-1

Meaning（candidate only）:
  mapping-complete = disposition completeness（not universal physical columns）
  findingIds = EXPLICITLY OUT for v1
  supersedesSnapshotId = persist slot later（naming/create separate）
  ENV schemaId/schemaVersion/dtoVersion = derived / explicit readable-set
    without per-item SharePoint columns
  no create / adapter / mapping-complete PASS from this packet alone

Agent recommendation alone is NOT Human Acceptance evidence.
```

## 5. Per-field classification summary（post-Acceptance）

| Mapping ID | Classification | Accepted option | Living disposition |
|---|---|---|---|
| MAP-AS-009 | EXPLICITLY OUT | X-1-B | 対象外 |
| MAP-AS-010 | PERSISTED / NOT YET COLUMN-READY | X-2-A | PERSISTED placement only |
| MAP-AS-ENV-001 | DERIVED | X-3-B | DTO/adapter constant |
| MAP-AS-ENV-002 | DERIVED / readable-set | X-4-B | 1.0.0 |
| MAP-AS-ENV-003 | DERIVED / readable-set | X-5-B | 1.0.0 |
| M-1 model | LOCKED | M-1-A | disposition completeness |

```text
Acceptance 正本: decision-assessment-snapshot-cv-extension-acceptance.md
No Internal Name / Column Type invented for MAP-AS-010.
```

## 6. Explicit OUT / non-authorization

```text
This CONSUMED packet / Acceptance does NOT authorize:
  Internal Name / Display Name / Column Type invention
  SharePoint column create / rename / delete
  conversion codec invention for MAP-AS-010
  mapping-complete PASS
  adapter / schema / DTO wiring
  Issue mutation
  Ready / Merge
  Deploy / real data
```

## 7. Next

```text
Decision-AS-CV-EXTENSION-1: Accepted / LOCKED
  / M-1-A + X-1-B + X-2-A + X-3-B + X-4-B + X-5-B + XB-1
  → decision-assessment-snapshot-cv-extension-acceptance.md
mapping-complete: NOT YET
Remaining principal blocker: MAP-AS-010 column contract / create / VR-1
Next gate: HUMAN READY DECISION FOR PR #208
Still HOLD / FORBIDDEN:
  Implementation Start / adapter / schema wiring
  SharePoint / M365 mutation
  mapping-complete PASS
  Deploy / real data
```
