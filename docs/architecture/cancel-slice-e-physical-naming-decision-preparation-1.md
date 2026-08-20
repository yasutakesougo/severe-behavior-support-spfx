# CANCEL-SLICE-E-PHYSICAL-NAMING-DECISION-PREPARATION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: CANCEL-SLICE-E-PHYSICAL-NAMING-DECISION-PREPARATION-1
Kind: read-only Human Decision preparation（candidates only）
MODE: READ-ONLY
BASE: main@c6235bfd3b9e4d066058ce61459773eafc500633
OWNER: #448
Upstream authority:
  CANCEL-SLICE-E-PHYSICAL-CONTRACT-DEFINITION-1
  ProcedureRecordLifecycleEvent@1.0.0（logical UNCHANGED）
  Decision-PROCEDURE-RECORD-MAPPING-1（PR-MAP-NAMES-1 / LOOKUP-B / TITLE-NONE）
  Accepted AuditEvent physical mapping #29（naming family reference only）
Status: CONSUMED（Human Selection recorded）
Selection authority:
  docs/architecture/cancel-slice-e-physical-naming-selection-1.md
  Decision: SELECTED / LOCKED（scoped）
  E-P1=A→LN-1 / E-P2=A→Package A / E-P3=TP-1 / E-P4=C→PG-3
Implementation Start: NOT AUTHORIZED
Physical hard-code: FORBIDDEN until Implementation Start GO
Schema mutation / SharePoint WRITE / LIVE WRITE: HOLD
Production Binding / Deploy: HOLD
Issue mutation: FORBIDDEN
```

## 0. How to read this packet

This packet **narrows candidates** for E-P1..E-P4. It does **not** select,
accept, or lock names.

```text
recommendation ≠ Human Selection
OBSERVED test-only names ≠ ACCEPTED / LOCKED Slice E mapping
Decision Accepted ≠ Implementation Start
```

Next Human unit after this packet:

```text
CANCEL-SLICE-E-PHYSICAL-NAMING-SELECTION-1
  → Human SELECT one package for E-P1..E-P4
CANCEL-SLICE-E-PHYSICAL-NAMING-ACCEPTANCE-1
  → Human ACCEPT / LOCK scoped mapping only
```

## 1. Locked inputs（do not re-decide）

From
[`cancel-slice-e-physical-contract-definition-1.md`](./cancel-slice-e-physical-contract-definition-1.md):

```text
Storage model:     DEDICATED LIFECYCLE EVENT LIST
Isolation model:   SITE + LIST BINDING
Append model:      CREATE ONLY
Lookup model:      DUAL LOOKUP（LifecycleEventId + LifecycleIdempotencyKey）
Readback:          REQUIRED
schemaVersion:     required physical text; accepted value 1.0.0
OrganizationId / SiteId / UserId as event payload fields: NOT INVENTED
```

Required logical columns remain fixed. Only **display / internal names /
SharePoint types / GUID provisioning authority** are open.

## 2. Existing naming families（evidence）

### 2.1 ProcedureRecord — ACCEPTED / LOCKED（closest aggregate）

Authority:
[`decision-procedure-record-mapping-1-selection.md`](./decision-procedure-record-mapping-1-selection.md),
[`procedure-record-provisioning-design-runbook.md`](./procedure-record-provisioning-design-runbook.md),
`src/adapters/sharepoint/procedure-record/physical-columns.ts`.

| Aspect | Locked pattern |
|---|---|
| List Display Name | Japanese operational label `支援手順実施記録` |
| Internal Names | short prefix `pr*` + logical camelCase leaf |
| Types | mostly 1行テキスト MaxLength 255; result = Choice; clocks = ISO DateTime **text** |
| Unique | `prRecordId` + `prIdempotencyKey` unique+indexed |
| Envelope | `schemaId` / `schemaVersion` / `dtoVersion` / `TimeZone` = **DERIVED（no columns）** |
| Title | TITLE-NONE |
| List identity | LOOKUP-B: per-site List GUID; Display Name ≠ identity |

### 2.2 AuditEvent — Accepted #29（different aggregate）

Authority:
[`audit-event-physical-mapping-29.md`](./audit-event-physical-mapping-29.md),
`src/adapters/sharepoint/audit-event/physical-columns.ts`.

| Aspect | Pattern |
|---|---|
| List | English `SBS Audit Events` / provisioning key `SBS_AUDIT_EVENTS` |
| Internal Names | `SbsAud*` Pascal-ish |
| Identity keys | Single line text (64) unique; many ids UTF16BE_HEX encoded multiline |
| Enums | Choice |
| Time | dual: lexical text + derived DateTime column |

Do **not** copy Audit encoding or dual-clock pattern into Slice E unless Human
explicitly selects that family. Lifecycle logical contract already uses plain
ISO DateTime strings and SHA-256 hex digests.

### 2.3 AssessmentSnapshot — OBSERVED / Accepted naming elsewhere

| Aspect | Pattern |
|---|---|
| List | English `AssessmentSnapshots` |
| Internal Names | logical field names（no prefix） |

Weak fit for lifecycle: no dual unique identity pair pattern matching Slice E.

### 2.4 Kiosk TEST-ONLY lifecycle list — OBSERVED（not Slice E LOCK）

Authority:
[`kiosk-test-only-schema-provisioning.md`](./kiosk-test-only-schema-provisioning.md)
（BASE evidence SHA older than current main; test-only site only）.

| Aspect | OBSERVED value |
|---|---|
| List title / key | `SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS` |
| List GUID（test-only） | `41274293-18d0-4f57-8a45-4f063522bcc7` |
| Internal Names | `life*` prefix |
| Types | Text; unique on EventId + IdempotencyKey; indexed targetRecordId |
| schemaVersion column | **ABSENT** |
| eventType | Text（not Choice） |

```text
Classification: OBSERVED / TEST-ONLY CANDIDATE MATERIAL
≠ ACCEPTED Slice E production mapping
≠ Production Binding authority
≠ Implementation Start
```

Delta vs Slice E contract definition:

```text
OBSERVED list lacks schemaVersion physical column.
Slice E definition requires schemaVersion as required text.
Adopting OBSERVED names still needs an explicit schemaVersion column decision.
```

## 3. Decision questions（E-P1..E-P4）

### E-P1 — List display name

| ID | Candidate | Family | Notes |
|---|---|---|---|
| **LN-1** | `SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS` | Kiosk OBSERVED | Matches test-only title; English/SBS style |
| **LN-2** | `支援手順ライフサイクルイベント` | ProcedureRecord Japanese | Operational JP label; parallel to `支援手順実施記録` |
| **LN-3** | `実施記録ライフサイクルイベント` | ProcedureRecord Japanese（shorter） | Emphasizes record lifecycle |
| **LN-4** | `SBS Procedure Record Lifecycle Events` | Audit-like English display | Separates display from provisioning key |
| **LN-X** | Human-supplied exact string | Custom | Write full string in Selection |

```text
LOCKED already: Display Name is NOT List identity（LOOKUP-B）.
LN-* chooses the operational label / title invariant only.
```

**Recommendation（not selection）:** `LN-1` if Human wants continuity with the
already-provisioned test-only list; otherwise `LN-2` if Human wants the
ProcedureRecord Japanese operational family.

### E-P2 — Internal column name package

Required logical → physical mapping slots（names open）:

| Logical field | Required / optional | Unique / index（contract） |
|---|---|---|
| schemaVersion | required | non-unique |
| LifecycleEventId | required | unique + indexed |
| LifecycleIdempotencyKey | required | unique + indexed |
| LifecyclePayloadFingerprint | required | non-unique |
| eventType | required | non-unique |
| targetRecordId | required | indexed |
| replacementRecordId | optional | non-unique |
| recordedAt | required | non-unique |
| recordedBy | required | non-unique |
| reason | optional | non-unique |

#### Package A — `LE-MAP-NAMES-LIFE-1`（extend OBSERVED `life*`）

| Logical | Candidate Internal Name |
|---|---|
| schemaVersion | `lifeSchemaVersion`（**new vs OBSERVED**） |
| LifecycleEventId | `lifeLifecycleEventId` |
| LifecycleIdempotencyKey | `lifeLifecycleIdempotencyKey` |
| LifecyclePayloadFingerprint | `lifeLifecyclePayloadFingerprint` |
| eventType | `lifeEventType` |
| targetRecordId | `lifeTargetRecordId` |
| replacementRecordId | `lifeReplacementRecordId` |
| recordedAt | `lifeRecordedAt` |
| recordedBy | `lifeRecordedBy` |
| reason | `lifeReason` |

Pros: matches test-only evidence; lowest rename risk for test site.
Cons: `lifeLifecycle*` is redundant; schemaVersion was missing and must be added.

#### Package B — `LE-MAP-NAMES-PR-FAMILY-1`（ProcedureRecord `pr*` family）

| Logical | Candidate Internal Name |
|---|---|
| schemaVersion | `prLifeSchemaVersion` |
| LifecycleEventId | `prLifeEventId` |
| LifecycleIdempotencyKey | `prLifeIdempotencyKey` |
| LifecyclePayloadFingerprint | `prLifePayloadFingerprint` |
| eventType | `prLifeEventType` |
| targetRecordId | `prLifeTargetRecordId` |
| replacementRecordId | `prLifeReplacementRecordId` |
| recordedAt | `prLifeRecordedAt` |
| recordedBy | `prLifeRecordedBy` |
| reason | `prLifeReason` |

Pros: same aggregate family as ProcedureRecord; short unique leaves.
Cons: new names; does not equal OBSERVED test list; must not collide with
ProcedureRecord fact columns（dedicated list mitigates）.

#### Package C — `LE-MAP-NAMES-CONTRACT-1`（logical PascalCase as Internal Name）

| Logical | Candidate Internal Name |
|---|---|
| schemaVersion | `schemaVersion` |
| LifecycleEventId | `LifecycleEventId` |
| … | same as logical |

Pros: trivial mapper.
Cons: rejects established `pr*` / `life*` prefix discipline; Title/system
collision risk for `schemaVersion` naming clarity; NOT SELECTED historically
for ProcedureRecord（`PR-MAP-NAMES-CONTRACT`）.

#### Package D — `LE-MAP-NAMES-SBS-AUD-STYLE-1`

`SbsLife*` / encoded columns patterned after AuditEvent.

Pros: consistent with Audit ops naming.
Cons: pulls in encoding/dual-clock pressure; wrong aggregate; high cost.

#### Package X — Human-supplied complete table

Human writes the full Internal Name table.

**Recommendation（not selection）:** `Package A` when test-only continuity
matters; `Package B` when aligning to ProcedureRecord production mapping
discipline matters more than the OBSERVED kiosk list.

```text
FORBIDDEN until Selection:
  hard-coding any Internal Name into adapter expected schema
  treating OBSERVED test GUID + names as Production Binding
```

### E-P3 — Exact SharePoint field types / max lengths

| Logical field | Type candidate T1（align ProcedureRecord） | Type candidate T2（align OBSERVED kiosk Text） | Type candidate T3（Audit-like） |
|---|---|---|---|
| schemaVersion | Text / MaxLength 32（or 255） | Text | Text 255 |
| LifecycleEventId | Text / MaxLength 255（SHA-256 hex=64 fits） | Text unique indexed | Text 64 unique |
| LifecycleIdempotencyKey | Text / MaxLength 255 unique indexed | Text unique indexed | Text 64 unique |
| LifecyclePayloadFingerprint | Text / MaxLength 255 | Text | Text 64 |
| eventType | **Choice** `SUPERSEDE` \| `CANCEL`; FillIn=false | Text validated in adapter | Choice |
| targetRecordId | Text / MaxLength 255 indexed | Text indexed | encoded multiline（NOT recommended） |
| replacementRecordId | Text / MaxLength 255 optional | Text optional | encoded（NOT recommended） |
| recordedAt | **Text ISO DateTime**（D4=A / PR clocks） | Text | dual Raw+DateTime |
| recordedBy | Text / MaxLength 255 | Text | encoded（NOT recommended） |
| reason | Text / MaxLength 255 optional | Text optional | Text 64 optional |
| Title | TITLE-NONE（optional / non-required; adapter does not write） | same | same |

```text
Digest length evidence:
  mintLifecycleEventIdentity → sha256Hex → 64-char hex
  MaxLength 255 is sufficient under T1/T2
  MaxLength 64 is also sufficient if Human wants Audit-key sizing
```

**Recommendation（not selection）:**

```text
Types package TP-1:
  Text MaxLength 255 for identity / reference / actor / reason / schemaVersion
  Choice for eventType（SUPERSEDE|CANCEL, FillInChoice=false）
  recordedAt = Text ISO DateTime（ProcedureRecord D4=A）
  TITLE-NONE
  no UTF16BE encoding
  no derived DateTime twin column in v1
```

Optional index candidates（not must-create unless Human LOCKs）: none beyond
the contract-required unique pair + `targetRecordId` index.

### E-P4 — Provisioning source / List GUID authority

| ID | Authority model | Meaning |
|---|---|---|
| **PG-1** | LOOKUP-B / per-site List GUID（ProcedureRecord pattern） | Binding = expected Site identity + expected List GUID; Display Name / URL ≠ identity |
| **PG-2** | Display Name lookup | FORBIDDEN by Slice E contract（insufficient authority） |
| **PG-3** | Reuse OBSERVED test-only GUID as production | FORBIDDEN without separate Production Binding GO |
| **PG-4** | Human Provisioning GO runbook observes GUID after create | Concrete GUID remains UNKNOWN until observed |

Recommended composition（not selection）:

```text
PG-1 + PG-4
```

Provisioning source candidates for the **schema definition**（not execution）:

| Source ID | Path / artifact | Role |
|---|---|---|
| PS-1 | Future `docs/architecture/procedure-record-lifecycle-event-provisioning-design-runbook.md` | Design / runbook only（mirror ProcedureRecord） |
| PS-2 | `scripts/provision-kiosk-test-lists.cjs` | TEST-ONLY execution aid; **not** Production authority; presence-check only today |
| PS-3 | `kiosk-test-only-schema-provisioning.md` evidence | OBSERVED test-only proof; may inform names; does not lock production |
| PS-4 | Adapter runtime config `SiteId → List GUID` map | Runtime binding after Human Provisioning GO + observed GUID |

```text
Concrete List GUID invention in this packet: FORBIDDEN
test-only GUID copy into production binding: FORBIDDEN
Human Provisioning GO ≠ LIVE WRITE GO ≠ Implementation Start
```

## 4. Suggested Human Selection checklist

Human Selection packet should lock **exactly one** of each:

```text
E-P1  LN-?
E-P2  Package A | B | C | D | X（if X: attach full table）
E-P3  TP-1 or explicit type table
E-P4  PG-1 + PG-4（or Human alternative that still forbids PG-2/PG-3）
Title TITLE-NONE（recommend keep; already consistent with PR / Slice E）
Japanese Display Names for columns（optional ops labels）— supply table or DEFER
```

Optional column Display Names（JP）candidate set for Package A/B（ops only）:

| Logical | JP Display candidate |
|---|---|
| schemaVersion | スキーマ版 |
| LifecycleEventId | ライフサイクルイベントID |
| LifecycleIdempotencyKey | ライフサイクル冪等キー |
| LifecyclePayloadFingerprint | ライフサイクル指紋 |
| eventType | イベント種別 |
| targetRecordId | 対象実施記録ID |
| replacementRecordId | 置換実施記録ID |
| recordedAt | 記録日時 |
| recordedBy | 記録者 |
| reason | 理由 |

Display Names are not lookup identity.

## 5. Explicit non-goals

This preparation does **not**:

- accept / lock any name
- authorize adapter Implementation Start
- authorize schema provisioning or tenant mutation
- authorize SharePoint LIVE WRITE / Production Binding / Deploy
- change `ProcedureRecordLifecycleEvent@1.0.0`
- add OrganizationId / SiteId / UserId event fields
- invent concrete production List GUID
- mutate #448 / #443 / #444
- implement SUPERSEDE write orchestration

## 6. Preparation result

```text
E-P1 candidates:     LN-1..LN-4 + LN-X  READY FOR HUMAN SELECT
E-P2 candidates:     Packages A/B/C/D/X READY FOR HUMAN SELECT
E-P3 candidates:     TP-1 recommended; T2/T3 documented
E-P4 candidates:     PG-1+PG-4 recommended; PS-1..PS-4 roles fixed
Physical names:      NOT YET LOCKED
Implementation Start: NOT AUTHORIZED
Repository mutation this unit: docs-only preparation
SharePoint mutation: NONE
LIVE WRITE:          HOLD
Production Binding:  HOLD
Deploy:              HOLD
```

## 7. NEXT

```text
Human:
  CANCEL-SLICE-E-PHYSICAL-NAMING-SELECTION-1
  SELECT E-P1..E-P4（one package）
  then ACCEPT / LOCK scoped mapping only

Agent:
  STOP after this preparation unless Human Selection GO is explicit
  do not hard-code names
  do not start adapter implementation
```

## 8. Evidence index

| Claim | Evidence | Class |
|---|---|---|
| main BASE SHA | `c6235bfd3b9e4d066058ce61459773eafc500633` | CONFIRMED（git） |
| Slice A–D COMPLETE / Slice E NOT STARTED | Human SSOT for #448（Issue API inaccessible to this agent: 403） | INTENDED from Human packet; live Issue body UNKNOWN here |
| ProcedureRecord `pr*` + JP list name | Decision-PROCEDURE-RECORD-MAPPING-1 | CONFIRMED |
| Audit `SbsAud*` family | audit-event-physical-mapping-29 | CONFIRMED |
| Kiosk `life*` + `SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS` | kiosk-test-only-schema-provisioning.md | OBSERVED / TEST-ONLY |
| schemaVersion required physical | cancel-slice-e-physical-contract-definition-1 | INTENDED / definition LOCK for Slice E boundary |
| No org/site fields on lifecycle event | `src/domain/kiosk-contract.ts` type + Slice E definition | CONFIRMED |
