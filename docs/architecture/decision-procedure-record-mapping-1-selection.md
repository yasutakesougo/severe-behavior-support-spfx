# ProcedureRecord Physical Mapping v1 — Human Selection + Acceptance

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-PROCEDURE-RECORD-MAPPING-1
Unit: PROCEDURE-RECORD-MAPPING-DECISION-1
Kind: Human Selection + scoped Acceptance（physical mapping only）
Status: ACCEPTED / LOCKED（scoped；DEFERRED items are NOT LOCKED）
Human Selection: SELECT PR-MAP-PKG-1
  + LOOKUP-B / per-site List GUID
  + PR-MAP-NAMES-1
  + TITLE-NONE
  （2026-08-16）
Human Acceptance: ACCEPT / LOCK PR-MAP-PKG-1（2026-08-16）
Human Selection unit: PROCEDURE-RECORD-MAPPING-SELECTION-1
Acceptance unit: PROCEDURE-RECORD-MAPPING-ACCEPTANCE-1
PR: #382
reviewed HEAD（Fresh Review PASS；expired by this Acceptance recording）:
  cabe944425d19a0a282b1c35a220384817d05ae8

Upstream canonical:
  Decision-PROCEDURE-RECORD-PERSISTENCE-1
  ACCEPTED / LOCKED（scoped）on main
  main @ 406a2c3cf16f03b57884fd33e495756eacaff86b
  D4 = A / ISO DateTime string already LOCKED
  flatten Procedure reference already LOCKED
  Title is not identity already LOCKED as policy
  DERIVED envelope / TimeZone already allowed as policy

Acceptance / LOCK of this scoped mapping
  ≠ Implementation Start
  ≠ adapter code GO
  ≠ SPFx change GO
  ≠ List / column / site provisioning
  ≠ creation of actual List GUID
  ≠ SharePoint permissions mutation
  ≠ SharePoint item write
  ≠ LIVE WRITE
  ≠ Ready / Merge
  ≠ Deploy / App Catalog / M365 / Entra mutation
  ≠ #381 modification
This packet ≠ AssessmentSnapshot name copy
This packet ≠ invented concrete List GUID
This packet ≠ provisioned unique/index objects observed
Agent auto-accept: FORBIDDEN（this Acceptance is Human GO）
```

## Human Selection record

```text
PROCEDURE-RECORD-MAPPING-SELECTION-1

repository:
  yasutakesougo/severe-behavior-support-spfx
PR:
  #382
expected HEAD before this recording:
  3f591733cfa09c299a7e61f8e27b4b1c1756d3c4
Human Selection GO: YES

SELECT:
  PR-MAP-PKG-1
  M1 List Display Name = 支援手順実施記録
  M1 lookup = LOOKUP-B / per-site List GUID
  M2/M3/M4 = PR-MAP-NAMES-1
  M3 clocks = D4=A ISO DateTime string columns
  M4 Procedure flatten
  M5 DERIVED
  M6 TITLE-NONE
```

## Human Acceptance record

```text
PROCEDURE-RECORD-MAPPING-ACCEPTANCE-1

repository:
  yasutakesougo/severe-behavior-support-spfx
PR:
  #382
reviewed HEAD:
  cabe944425d19a0a282b1c35a220384817d05ae8
Fresh Review:
  PASS @ cabe944425d19a0a282b1c35a220384817d05ae8
Human Decision:
  ACCEPT / LOCK Decision-PROCEDURE-RECORD-MAPPING-1
  PR-MAP-PKG-1
```

ACCEPTED / LOCKED scope:

```text
M1 List Display Name = 支援手順実施記録
M1 LOOKUP-B
  stable identity = per-site provisioned List GUID
  adapter configuration boundary = SiteId → List GUID
  Display Name is NOT lookup key
  server-relative URL is NOT List identity
  concrete GUID values remain provisioning-time UNKNOWN
M2 PR-MAP-NAMES-1
  Display Names / Internal Names / Types / Required / conversions LOCKED
  RecordId unique requirement
  IdempotencyKey unique requirement
  PayloadFingerprint non-unique
  unique/index here = mapping requirement
  ≠ provisioned SharePoint unique constraints / indexes observed
M3 D4=A
  performedAt / recordedAt = 1行テキスト / ISO DateTime string
M4 Procedure flatten
  ProcedureId / ProcedureVersion / ApprovalState = separate columns
  Procedure body column = NOT ADOPTED
  Procedure JSON blob = NOT ADOPTED
M5 DERIVED reconstruction
M6 TITLE-NONE
```

DEFERRED / NOT LOCKED:

```text
concrete provisioned List GUID values
SUPPORTER read scope
SharePoint group / Role binding
test-only site identity
ProcedureRecord retention years
actual physical provisioning state
provisioned unique/index objects
```

This Acceptance recording creates a new commit. The Fresh Review bound to
`cabe944425d19a0a282b1c35a220384817d05ae8` is therefore expired.

### M1 ACCEPTED / LOCKED

```text
List Display Name:
  支援手順実施記録

LOOKUP-B:
  stable identity = per-site provisioned List GUID
  adapter config: SiteId → List GUID
  Display Name is not the lookup key
  server-relative URL is not List identity
  concrete GUID values remain provisioning-time UNKNOWN
  this Selection does not invent a GUID
```

NOT SELECTED:

| ID | Meaning | Result |
|---|---|---|
| LOOKUP-A | lookup by List Title / Display Name | NOT SELECTED |
| LOOKUP-B-URL | List identity = server-relative URL | NOT SELECTED |
| LOOKUP-AS | reuse AssessmentSnapshots list | NOT SELECTED |

### M2 / M3 / M4 ACCEPTED / LOCKED — PR-MAP-NAMES-1

Human-selected Internal Names:

```text
prRecordId
prIdempotencyKey
prPayloadFingerprint
prOrganizationId
prSiteId
prUserId
prProcedureId
prProcedureVersion
prApprovalState
prLocalDate
prPlanId
prPlanVersion
prResult
prPerformedAt
prRecordedAt
prRecordedBy
```

Display Names / Type / Required / unique-index / read-write conversion:
current packet table → ACCEPT / LOCK as mapping requirements.

RecordId unique. IdempotencyKey unique. PayloadFingerprint non-unique.

D4=A:

```text
performedAt / recordedAt = 1行テキスト / ISO DateTime string
```

Procedure flatten:

```text
ProcedureId / ProcedureVersion / ApprovalState = separate columns
Procedure body column = NOT ADOPTED
Procedure JSON blob = NOT ADOPTED
```

| Mapping ID | Contract field | Display Name | Internal Name | Type | Required | Unique / index | Read | Write |
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
| MAP-PR-SYS-001 | Title | タイトル（標準列） | `Title` | タイトル | optional / non-required | 対象外 | 契約値として読まない | 書かない（TITLE-NONE） |

These names/types/conversions are **ACCEPTED / LOCKED** as mapping requirements.
They do **not** claim that physical SharePoint indexes or unique constraints
have been provisioned or observed.

Missing required field / unknown result token / non-APPROVED ApprovalState /
non-integer planVersion / clock order violation / conversion failure:
fail-closed. Do not convert ERROR into successful empty.

Choice values for `result` must equal:

```text
PERFORMED_AS_PLANNED
PERFORMED_WITH_ADAPTATION
NOT_PERFORMED
```

Do not map these to FAILED / error / save_failed.

Name-package alternatives:

| ID | Meaning | Result |
|---|---|---|
| PR-MAP-NAMES-1 | `pr*` Internal Names + Japanese Display Names above | **ACCEPTED / LOCKED** |
| PR-MAP-NAMES-CONTRACT | Internal Name = contract field string | NOT SELECTED |
| PR-MAP-NAMES-AS-COPY | copy AssessmentSnapshot names | NOT SELECTED |
| PR-MAP-NAMES-CUSTOM | Human-supplied complete table | NOT SELECTED |

### M5 ACCEPTED / LOCKED — DERIVED

```text
no per-item columns:
  schemaId
  schemaVersion
  dtoVersion
  TimeZone

read reconstruction:
  schemaId      = severe-behavior-support.procedure-record.record
  schemaVersion = 1.0.0
  dtoVersion    = 1.0.0
  TimeZone      = Asia/Tokyo

Write:
  do not persist these four as columns

If a later physical column exists and disagrees with the constants:
  fail-closed（do not ignore mismatch）
```

### M6 ACCEPTED / LOCKED — TITLE-NONE

| Option | Meaning | Result |
|---|---|---|
| **TITLE-NONE** | Title is not app identity；adapter does not write Title；provisioning sets Title optional / non-required；normal app read does not treat Title as a contract value | **ACCEPTED / LOCKED** |
| TITLE-COPY | write RecordId into Title for ops scan | **NOT SELECTED**（v1 non-choice；not judged false） |

```text
Title is not app identity
adapter does not write Title
provisioning policy = optional / non-required
normal app read does not treat Title as a contract value
prRecordId remains identity canonical
no dual representation of RecordId in Title
```

## 0. How to read this packet

This document records Human Selection and scoped Acceptance of physical mapping
for ProcedureRecord v1.
ACCEPTED / LOCKED applies only to the mapping scope listed above.
DEFERRED items are not LOCKED.

Unique / index rows are **mapping requirements**. They do not mean SharePoint
unique constraints or indexes have been provisioned or observed.

This Acceptance still does **not** authorize tenant mutation,
adapter implementation, live item create, Ready, or Merge.

## 1. Decision units after scoped Acceptance

| ID | Unit | After Human Acceptance |
|---|---|---|
| M1 | List Display Name + lookup | ACCEPTED / LOCKED（LOOKUP-B / GUID；concrete GUID UNKNOWN） |
| M2 | Physical columns | ACCEPTED / LOCKED（PR-MAP-NAMES-1） |
| M3 | D4=A clock columns | ACCEPTED / LOCKED |
| M4 | Procedure flatten | ACCEPTED / LOCKED |
| M5 | DERIVED reconstruction | ACCEPTED / LOCKED |
| M6 | Title | TITLE-NONE ACCEPTED / LOCKED |

## 2. Accepted package — PR-MAP-PKG-1

Human SELECT then ACCEPT / LOCK（scoped mapping only）.
DEFERRED items below are not LOCKED.

Rules maintained:

```text
Contract / Domain name ≠ Internal Name unless Human SELECTS that
Do not copy AssessmentSnapshot Internal Names
Type for performedAt / recordedAt = 1行テキスト（D4=A）
Procedure reference = flatten 3 columns
No procedure body column
No JSON blob of Procedure
```

## 3. Explicit OUT

```text
SUPPORTER read scope
SharePoint group / Role binding
test-only site identity
retention years
List / column / site create or rename
actual provisioned List GUID
server-relative List URL as identity
adapter implementation
SPFx change
SharePoint item write
LIVE WRITE
Deploy / App Catalog
M365 / Entra mutation
Ready / Merge
Implementation Start
actual physical provisioning state
provisioned unique/index objects
ProcedureRecord 1.0.0 redesign
procedure body persistence
mixing into AssessmentSnapshots / SupportPlans / AuditEvent lists
#381 modification
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

## 5. Findings after scoped Acceptance

| ID | Severity | State | Content |
|---|---|---|---|
| F-MAP-001 | P2 | ACCEPTED RECORDED | PR-MAP-NAMES-1 mapping names/types LOCKED；not provisioned |
| F-MAP-002 | P2 | OPEN | Concrete List GUID values remain provisioning-time UNKNOWN |
| F-MAP-003 | P2 | ACCEPTED RECORDED | TITLE-NONE ACCEPTED / LOCKED；TITLE-COPY is v1 not-selected |
| F-MAP-004 | P2 | CLOSED | Next gates steps 2–6 duplicate removed at Selection recording |

P0 / P1: none.
These P2 rows are deferred / state-tracking items. They are not Acceptance blockers.
HOLD continues for Ready / Merge / implementation / provisioning / LIVE WRITE / Deploy.

## 6. HOLD

```text
Status = ACCEPTED / LOCKED（scoped mapping）
DEFERRED items are NOT LOCKED
concrete List GUID UNKNOWN
provisioned unique/index objects NOT CLAIMED
Implementation Start = NOT AUTHORIZED
Provisioning = NOT AUTHORIZED
LIVE WRITE = NOT AUTHORIZED
Ready / Merge = NOT AUTHORIZED
cabe944425d19a0a282b1c35a220384817d05ae8 Fresh Review = EXPIRED（this recording changes HEAD）
```

## 7. Next gates

```text
1. DONE — Human Selection on PR-MAP-PKG-1
2. DONE — Decision Fresh Review on cabe944425d19a0a282b1c35a220384817d05ae8（now expired）
3. DONE — Human Acceptance / LOCK of mapping only
4. Final Decision Fresh Review on the Acceptance recording HEAD
5. Ready Gate（separate Human GO；not given）
6. Separate provisioning GO
7. Separate adapter Implementation Start GO
8. Separate LIVE WRITE GO
```

Step 3 does not start steps 5–8.
Acceptance / LOCK of scoped mapping does not start provisioning, adapter, LIVE WRITE, Ready, or Merge.
