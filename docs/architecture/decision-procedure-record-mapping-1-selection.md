# ProcedureRecord Physical Mapping v1 — Human Selection Packet

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-PROCEDURE-RECORD-MAPPING-1
Unit: PROCEDURE-RECORD-MAPPING-DECISION-1
Kind: Human Selection packet（physical mapping only）
Status: DRAFT / NOT SELECTED / NOT ACCEPTED / NOT LOCKED
Human Decision: NOT GIVEN
Date: 2026-08-16

Upstream canonical:
  Decision-PROCEDURE-RECORD-PERSISTENCE-1
  ACCEPTED / LOCKED（scoped）on main
  main @ 406a2c3cf16f03b57884fd33e495756eacaff86b
  D4 = A / ISO DateTime string already LOCKED
  flatten Procedure reference already LOCKED
  Title is not identity already LOCKED as policy
  DERIVED envelope / TimeZone already allowed as policy

This packet ≠ Internal Name 確定 until Human SELECT
This packet ≠ AssessmentSnapshot name copy
This packet ≠ contract field auto-generated as 確定
This packet ≠ provisioning GO
This packet ≠ adapter Implementation Start
This packet ≠ LIVE WRITE
This packet ≠ Deploy / App Catalog / M365 / Entra
Agent auto-select: FORBIDDEN
```

## 0. How to read this packet

This Decision, if later SELECTED / ACCEPTED, closes **physical mapping policy and Human-selected names/types** for ProcedureRecord v1.

It does not close:

```text
SUPPORTER read scope
Role / group binding
test-only site identity
ProcedureRecord retention years
List / column / site provisioning
adapter implementation
LIVE WRITE
```

Internal Name / Display Name / List identity strings in this file are
**candidates for Human Selection**. They are not confirmed, not observed,
and not copied from AssessmentSnapshots.

Human Selection must bind:

```text
Decision ID
name package and/or amended per-row names
list lookup strategy（GUID vs Title vs URL）
Title option including Required / adapter write
DERIVED reconstruction
head SHA of the Selection recording
```

## 1. Units to SELECT

| ID | Unit |
|---|---|
| M1 | ProcedureRecord List Display Name + adapter lookup strategy |
| M2 | Physical columns: Display Name, Internal Name, Type, Required, unique/index, conversions |
| M3 | D4=A assignment: performedAt / recordedAt as ISO DateTime **string** columns |
| M4 | Flatten: ProcedureId / ProcedureVersion / ApprovalState as separate columns |
| M5 | DERIVED reconstruction: schemaId / schemaVersion / dtoVersion / TimeZone |
| M6 | Title: not identity；whether to copy RecordId |

## 2. Recommended package — PR-MAP-PKG-1

First candidate package. Human has not selected it.

### M1 — List identity（CANDIDATE）

```text
List Display Name first candidate:
  支援手順実施記録

stable list identity / adapter lookup first candidate:
  LOOKUP-B — per-site provisioned List GUID
             stored / resolved from adapter configuration
             SiteId → List GUID

List Display Name:
  not the lookup key

server-relative List URL:
  NOT first as identity
  may be used later only as endpoint-construction information
  that is a separate concern from List identity

Concrete GUID values:
  provisioning-time
  UNKNOWN in this Decision
  this packet does not invent or confirm a GUID
```

Not selected as first:

| ID | Meaning | Why not first |
|---|---|---|
| LOOKUP-A | lookup by List Title / Display Name | rename breaks adapter |
| LOOKUP-B-URL | List identity = server-relative URL | leaves GUID vs URL open in the adapter |
| LOOKUP-AS | reuse AssessmentSnapshots list | FORBIDDEN by persistence Decision |

### M2 / M3 / M4 — Column mapping（CANDIDATE / NOT CONFIRMED）

Rules:

```text
Contract / Domain name ≠ Internal Name unless Human explicitly SELECTS that
Do not copy AssessmentSnapshot Internal Names
Do not treat agent-invented strings as 確定
Type for performedAt / recordedAt = 1行テキスト（D4=A LOCKED）
Procedure reference = flatten 3 columns（persistence Decision LOCKED）
No procedure body column
No JSON blob of Procedure
```

First-candidate **name package** `PR-MAP-NAMES-1`（NOT CONFIRMED）:

Display Names are Japanese operational labels.
Internal Names are `pr`-prefixed tokens so they are not Domain PascalCase
and not AssessmentSnapshot names. Human may SELECT this package, amend rows,
or replace the whole set. Until Human SELECT, every name cell remains
`HUMAN-SELECT / NOT CONFIRMED`.

| Mapping ID | Contract field | Display Name candidate | Internal Name candidate | Type candidate | Required | Unique / index candidate | Read | Write |
|---|---|---|---|---|---|---|---|---|
| MAP-PR-001 | RecordId | 実施記録ID | `prRecordId` | 1行テキスト | 必須 | unique | trim 後非空 | 非空のまま |
| MAP-PR-002 | IdempotencyKey | 冪等キー | `prIdempotencyKey` | 1行テキスト | 必須 | unique | 非空 | 非空のまま |
| MAP-PR-003 | PayloadFingerprint | ペイロード指紋 | `prPayloadFingerprint` | 1行テキスト | 必須 | 非 unique | 非空 | 非空のまま |
| MAP-PR-004 | OrganizationId | 組織ID | `prOrganizationId` | 1行テキスト | 必須 | 非 unique | site binding 一致 | 非空 |
| MAP-PR-005 | SiteId | 事業所ID | `prSiteId` | 1行テキスト | 必須 | 非 unique | SelectedSiteId 一致 | 非空 |
| MAP-PR-006 | UserId | 利用者ID | `prUserId` | 1行テキスト | 必須 | index 候補 | 非空；PII 属性を書かない | 非空 |
| MAP-PR-007 | TimeZone | DERIVED | 列なし | — | 論理必須 | — | 定数 `Asia/Tokyo` | 書かない |
| MAP-PR-008 | ProcedureId | 手順ID | `prProcedureId` | 1行テキスト | 必須 | 非 unique | 非空 | 非空 |
| MAP-PR-009 | ProcedureVersion | 手順版 | `prProcedureVersion` | 1行テキスト | 必須 | 非 unique | 非空 | 非空 |
| MAP-PR-010 | ApprovalState | 承認状態 | `prApprovalState` | 1行テキスト | 必須 | 非 unique | `APPROVED` のみ | `APPROVED` のみ |
| MAP-PR-011 | LocalDate | 実施暦日 | `prLocalDate` | 1行テキスト `YYYY-MM-DD` | 必須 | index 候補 | 暦日；performedAt 東京暦日と一致 | 暦日文字列 |
| MAP-PR-012 | planId | 計画ID | `prPlanId` | 1行テキスト | 必須 | index 候補 | 非空 | 非空 |
| MAP-PR-013 | planVersion | 計画版 | `prPlanVersion` | 1行テキスト（整数表記） | 必須 | 非 unique | 整数 `>=1` | 整数文字列 |
| MAP-PR-014 | result | 実施結果 | `prResult` | 選択肢（契約トークンと一致） | 必須 | 非 unique | 三値のみ | 三値のみ |
| MAP-PR-015 | performedAt | 実施日時 | `prPerformedAt` | 1行テキスト ISO DateTime | 必須 | 非 unique | ISO のまま | ISO のまま |
| MAP-PR-016 | recordedAt | 記録日時 | `prRecordedAt` | 1行テキスト ISO DateTime | 必須 | 非 unique | ISO；`>= performedAt` | ISO のまま |
| MAP-PR-017 | recordedBy | 記録者 | `prRecordedBy` | 1行テキスト | 必須 | 非 unique | 非空；UserId と同一視しない | 認証主体 |
| MAP-PR-ENV-001 | schemaId | DERIVED | 列なし | — | DTO必須 | — | 定数 | 書かない |
| MAP-PR-ENV-002 | schemaVersion | DERIVED | 列なし | — | DTO必須 | — | `1.0.0` | 書かない |
| MAP-PR-ENV-003 | dtoVersion | DERIVED | 列なし | — | DTO必須 | — | `1.0.0` | 書かない |
| MAP-PR-SYS-001 | Title | タイトル（標準列） | `Title` | タイトル | optional / non-required 候補 | 対象外 | 契約値として読まない | 書かない（M6） |

Missing required field / unknown result token / non-APPROVED ApprovalState /
non-integer planVersion / clock order violation / conversion failure:
fail-closed. Do not convert ERROR into successful empty.

Choice values for `result`（if Human SELECTS 選択肢）must equal:

```text
PERFORMED_AS_PLANNED
PERFORMED_WITH_ADAPTATION
NOT_PERFORMED
```

Do not map these to FAILED / error / save_failed.

Name-package alternatives（not first）:

| ID | Meaning | Result in this draft |
|---|---|---|
| PR-MAP-NAMES-1 | `pr*` Internal Names + Japanese Display Names above | **first candidate** |
| PR-MAP-NAMES-CONTRACT | Internal Name = contract field string | not first；Human may still SELECT |
| PR-MAP-NAMES-AS-COPY | copy AssessmentSnapshot names | **reject** |
| PR-MAP-NAMES-CUSTOM | Human-supplied complete table | acceptable if every row is filled |

### M5 — DERIVED reconstruction（CANDIDATE）

```text
No per-item columns for:
  schemaId
  schemaVersion
  dtoVersion
  TimeZone

Read reconstruction:
  schemaId     = severe-behavior-support.procedure-record.record
  schemaVersion = 1.0.0
  dtoVersion    = 1.0.0
  TimeZone      = Asia/Tokyo

Write:
  do not persist these four as columns

If a later physical column exists and disagrees with the constants:
  fail-closed（do not ignore mismatch）
```

### M6 — Title（Selection required）

| Option | Meaning | This packet |
|---|---|---|
| **TITLE-NONE** | Title is not app identity；adapter does not write Title；provisioning sets Title optional / non-required；normal app read does not treat Title as a contract value | **first candidate** |
| TITLE-COPY | write RecordId into Title for ops scan；Title still is not identity | alternative |

TITLE-NONE first-candidate detail:

```text
Title is not app identity
adapter does not write Title
provisioning: Title = optional / non-required
normal app read does not read Title as a contract value
MAP-PR-001 prRecordId remains the identity canonical
no dual representation of RecordId in Title
```

Either option keeps MAP-PR-001 as the identity canonical.
TITLE-COPY would still forbid treating Title as RecordId on read.

## 3. Explicit OUT

```text
SUPPORTER read scope
Role / group binding
test-only site identity
retention years
List / column / site create or rename
actual provisioned List GUID
server-relative List URL as identity
adapter implementation
SPFx change
LIVE WRITE
Deploy / App Catalog
M365 / Entra mutation
ProcedureRecord 1.0.0 redesign
procedure body persistence
mixing into AssessmentSnapshots / SupportPlans / AuditEvent lists
```

## 4. Upstream locks this packet must not reopen

```text
PR-PERS-PKG-1 scoped ACCEPTED / LOCKED
D4 = A ISO DateTime string
flatten ProcedureId / ProcedureVersion / ApprovalState
CREATE-ONLY
GET-by-RecordId required before saved
save outcome ≠ ProcedureRecord.result
save_outcome_unknown no automatic create retry
DEC-1 Schema ID ≠ List name ≠ TypeScript type name
DEC-7 failure ≠ empty success
```

## 5. Findings

| ID | Severity | State | Content |
|---|---|---|---|
| F-MAP-001 | P2 | OPEN | Internal Names are candidates only until Human SELECT |
| F-MAP-002 | P2 | OPEN | Concrete List GUID values remain provisioning-time UNKNOWN |
| F-MAP-003 | P2 | OPEN | TITLE-NONE vs TITLE-COPY still requires Human SELECT |

P0 / P1: none.
HOLD because Human Selection has not been given.

## 6. HOLD

```text
Status = DRAFT / NOT SELECTED / NOT ACCEPTED / NOT LOCKED
PR-MAP-NAMES-1 is a candidate set, not 確定
Implementation Start = NOT AUTHORIZED
Provisioning = NOT AUTHORIZED
LIVE WRITE = NOT AUTHORIZED
```

## 7. Next gates

```text
1. Human Selection on PR-MAP-PKG-1
   - SELECT List Display Name + LOOKUP-B（per-site List GUID）or an alternative
   - SELECT PR-MAP-NAMES-1 or a complete replacement table
   - SELECT TITLE-NONE（including Title required=false / no adapter write）or TITLE-COPY
2. Decision Fresh Review on the Selection recording HEAD
3. Human Acceptance / LOCK of mapping only
4. Separate provisioning GO
5. Separate adapter Implementation Start GO
6. Separate LIVE WRITE GO
2. Decision Fresh Review on the Selection recording HEAD
3. Human Acceptance / LOCK of mapping only
4. Separate provisioning GO
5. Separate adapter Implementation Start GO
6. Separate LIVE WRITE GO
```

Selecting step 1 does not start steps 4–6.
