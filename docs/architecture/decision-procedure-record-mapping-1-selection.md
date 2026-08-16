# ProcedureRecord Physical Mapping v1 — Human Selection Packet

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-PROCEDURE-RECORD-MAPPING-1
Unit: PROCEDURE-RECORD-MAPPING-DECISION-1
Kind: Human Selection packet（physical mapping only）
Status: SELECTED / NOT ACCEPTED / NOT LOCKED
Human Selection: SELECT PR-MAP-PKG-1
  + LOOKUP-B / per-site List GUID
  + PR-MAP-NAMES-1
  + TITLE-NONE
Human Selection date: 2026-08-16
Human Selection unit: PROCEDURE-RECORD-MAPPING-SELECTION-1
PR: #382
reviewed HEAD（pre-recording；expired by this commit）:
  3f591733cfa09c299a7e61f8e27b4b1c1756d3c4

Upstream canonical:
  Decision-PROCEDURE-RECORD-PERSISTENCE-1
  ACCEPTED / LOCKED（scoped）on main
  main @ 406a2c3cf16f03b57884fd33e495756eacaff86b
  D4 = A / ISO DateTime string already LOCKED
  flatten Procedure reference already LOCKED
  Title is not identity already LOCKED as policy
  DERIVED envelope / TimeZone already allowed as policy

Selection ≠ Acceptance
Selection ≠ LOCK
Selection ≠ provisioning GO
Selection ≠ adapter Implementation Start
Selection ≠ LIVE WRITE
Selection ≠ Deploy / App Catalog / M365 / Entra
Selection ≠ Ready / Merge
This packet ≠ AssessmentSnapshot name copy
This packet ≠ invented concrete List GUID
Agent auto-select: FORBIDDEN（this Selection is Human GO）
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

### M1 SELECTED

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

### M2 / M3 / M4 SELECTED — PR-MAP-NAMES-1

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
current packet table → SELECT.

RecordId unique. IdempotencyKey unique. PayloadFingerprint non-unique.

D4=A:

```text
performedAt / recordedAt = 1行テキスト / ISO DateTime string
```

Procedure flatten:

```text
ProcedureId / ProcedureVersion / ApprovalState = separate columns
Procedure body column = NOT SELECTED
Procedure JSON blob = NOT SELECTED
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

These names/types are **SELECTED**, not ACCEPTED / LOCKED.

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
| PR-MAP-NAMES-1 | `pr*` Internal Names + Japanese Display Names above | **SELECTED** |
| PR-MAP-NAMES-CONTRACT | Internal Name = contract field string | NOT SELECTED |
| PR-MAP-NAMES-AS-COPY | copy AssessmentSnapshot names | NOT SELECTED |
| PR-MAP-NAMES-CUSTOM | Human-supplied complete table | NOT SELECTED |

### M5 SELECTED — DERIVED

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

### M6 SELECTED — TITLE-NONE

| Option | Meaning | Result |
|---|---|---|
| **TITLE-NONE** | Title is not app identity；adapter does not write Title；provisioning sets Title optional / non-required；normal app read does not treat Title as a contract value | **SELECTED** |
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

This document records Human Selection of physical mapping for ProcedureRecord v1.
SELECTED here is not Accepted and not LOCKED.

It does not close:

```text
SUPPORTER read scope
SharePoint group / Role binding
test-only site identity
ProcedureRecord retention years
concrete provisioned List GUID values
provisioning execution
adapter implementation
LIVE WRITE
```

This Selection still does **not** authorize tenant mutation,
adapter implementation, live item create, Ready, or Merge.

## 1. Decision units after Selection

| ID | Unit | After Human Selection |
|---|---|---|
| M1 | List Display Name + lookup | SELECTED（LOOKUP-B / GUID；concrete GUID UNKNOWN） |
| M2 | Physical columns | SELECTED（PR-MAP-NAMES-1） |
| M3 | D4=A clock columns | SELECTED |
| M4 | Procedure flatten | SELECTED |
| M5 | DERIVED reconstruction | SELECTED |
| M6 | Title | TITLE-NONE SELECTED |

## 2. Selected package — PR-MAP-PKG-1

Human SELECT. Not Accepted. Not LOCKED.

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
Acceptance / LOCK by this recording alone
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

## 5. Findings after Selection

| ID | Severity | State | Content |
|---|---|---|---|
| F-MAP-001 | P2 | SELECTION RECORDED | PR-MAP-NAMES-1 Internal Names SELECTED；still NOT ACCEPTED / NOT LOCKED |
| F-MAP-002 | P2 | OPEN | Concrete List GUID values remain provisioning-time UNKNOWN |
| F-MAP-003 | P2 | SELECTION RECORDED | TITLE-NONE SELECTED；TITLE-COPY is v1 not-selected |
| F-MAP-004 | P2 | CLOSED | Next gates steps 2–6 duplicate removed at Selection recording |

P0 / P1: none.
HOLD continues because Acceptance / LOCK has not been given.

## 6. HOLD

```text
Status = SELECTED / NOT ACCEPTED / NOT LOCKED
concrete List GUID UNKNOWN
Implementation Start = NOT AUTHORIZED
Provisioning = NOT AUTHORIZED
LIVE WRITE = NOT AUTHORIZED
Ready / Merge = NOT AUTHORIZED
Acceptance / LOCK = NOT AUTHORIZED
3f591733… candidate HEAD = EXPIRED by this recording
```

## 7. Next gates

```text
1. DONE — Human Selection on PR-MAP-PKG-1
2. Decision Fresh Review on the Selection recording HEAD
3. Human Acceptance / LOCK of mapping only
4. Separate provisioning GO
5. Separate adapter Implementation Start GO
6. Separate LIVE WRITE GO
```

Selecting step 1 does not start steps 3–6.
Acceptance / LOCK, if given later, still does not start steps 4–6.
