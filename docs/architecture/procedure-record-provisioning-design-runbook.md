# ProcedureRecord provisioning design / runbook

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: PROCEDURE-RECORD-PROVISIONING-DESIGN-1
Kind: docs-only design / runbook planning
Human Planning GO: YES（2026-08-16）
Baseline main: ac9142294a32c62df9b68f5412d6b03dd07cec40

Authority（再 Decision しない）:
  Decision-PROCEDURE-RECORD-PERSISTENCE-1 = ACCEPTED / LOCKED（scoped）
  Decision-PROCEDURE-RECORD-MAPPING-1 = ACCEPTED / LOCKED（scoped）
  PROCEDURE-RECORD-POST-MERGE-PLANNING-1 = COMPLETE / PASS
  PROCEDURE-RECORD-ADAPTER-SYNTHETIC-V1 = CANONICAL ON MAIN（PR #383）
```

This Human GO authorizes **design / runbook planning only**.

```text
This packet ≠ Human Provisioning GO
This packet ≠ tenant mutation
This packet ≠ List / column / site create
This packet ≠ concrete List GUID
This packet ≠ LIVE WRITE
This packet ≠ Deploy / App Catalog / M365 / Entra
```

## 1. Separation of gates

| Gate | Status |
|---|---|
| Adapter Implementation Start | CONSUMED（synthetic adapter on main） |
| Provisioning design / runbook | THIS PACKET |
| Human Provisioning GO | NOT GIVEN |
| Physical provisioning execution | NO-GO |
| Physical provisioning verification | NO-GO until execution |
| LIVE WRITE GO | NOT GIVEN |
| Synthetic one-record live validation | NO-GO |

schema/list mutation GO ≠ record write GO. Never the same Human GO.

## 2. Invented values — FORBIDDEN here

Do **not** fill these in this packet:

```text
test-only site name / URL
concrete provisioned List GUID
SharePoint / Entra group object IDs
Role binding tables
statutory retention years
facility business site identity
```

Use slots only:

```text
<TEST_ONLY_SITE_IDENTITY>     UNKNOWN until Human Provisioning GO
<PROVISIONED_LIST_GUID>       OUTPUT of execution; observe later
<TEST_SITE_MEMBER_SUBJECT>    operational fence; not a production Role Decision
```

## 3. LOCKED inputs already sufficient for design

### Topology

```text
dedicated ProcedureRecord List
place on facility-dedicated site pattern
test-only site for first physical create
mixing into AssessmentSnapshots / SupportPlans / AuditEvent
  / AbcRecord / ExecutionRecord lists = FORBIDDEN
facility business List test write = FORBIDDEN
```

### List identity（LOOKUP-B）

```text
List Display Name = 支援手順実施記録
  operational label only
  NOT lookup identity
server-relative URL = NOT List identity
stable identity = per-site provisioned List GUID
adapter config = SiteId → List GUID
concrete GUID = provisioning-time UNKNOWN
```

### Columns — PR-MAP-NAMES-1（mapping requirements）

Must create as physical columns:

| Internal Name | Display Name | Type | Required | Unique / index |
|---|---|---|---|---|
| `prRecordId` | 実施記録ID | 1行テキスト | 必須 | unique **required** |
| `prIdempotencyKey` | 冪等キー | 1行テキスト | 必須 | unique **required** |
| `prPayloadFingerprint` | ペイロード指紋 | 1行テキスト | 必須 | 非 unique |
| `prOrganizationId` | 組織ID | 1行テキスト | 必須 | 非 unique |
| `prSiteId` | 事業所ID | 1行テキスト | 必須 | 非 unique |
| `prUserId` | 利用者ID | 1行テキスト | 必須 | index 候補（not LOCKED as must-create） |
| `prProcedureId` | 手順ID | 1行テキスト | 必須 | 非 unique |
| `prProcedureVersion` | 手順版 | 1行テキスト | 必須 | 非 unique |
| `prApprovalState` | 承認状態 | 1行テキスト | 必須 | 非 unique |
| `prLocalDate` | 実施暦日 | 1行テキスト `YYYY-MM-DD` | 必須 | index 候補（not LOCKED as must-create） |
| `prPlanId` | 計画ID | 1行テキスト | 必須 | index 候補（not LOCKED as must-create） |
| `prPlanVersion` | 計画版 | 1行テキスト（整数表記） | 必須 | 非 unique |
| `prResult` | 実施結果 | 選択肢 | 必須 | 非 unique |
| `prPerformedAt` | 実施日時 | 1行テキスト ISO DateTime | 必須 | 非 unique |
| `prRecordedAt` | 記録日時 | 1行テキスト ISO DateTime | 必須 | 非 unique |
| `prRecordedBy` | 記録者 | 1行テキスト | 必須 | 非 unique |

`prResult` choice values must equal exactly:

```text
PERFORMED_AS_PLANNED
PERFORMED_WITH_ADAPTATION
NOT_PERFORMED
```

Do not add FAILED / error / save_failed as choice values.

### Must NOT create as columns

```text
schemaId
schemaVersion
dtoVersion
TimeZone
Procedure body
Procedure JSON blob
```

### Title — TITLE-NONE

```text
Title is not app identity
provisioning sets Title optional / non-required
adapter does not write Title
normal app read does not treat Title as a contract value
```

### Unique vs dual lookup

```text
unique prRecordId + unique prIdempotencyKey
  = mapping requirements to provision
  = defense in depth
dual lookup remains canonical
unique columns do not replace findByRecordId / findByIdempotencyKey
```

v1 first execution: provision the two unique requirements.
Index 候補（`prUserId` / `prLocalDate` / `prPlanId`）are **not** must-create unless a later Decision LOCKS them.

## 4. Permission fence for v1 test-only provisioning

LOCKED already:

```text
create: SUPPORTER with selected-site membership
read: must not cross site boundary
```

NOT LOCKED — do not invent here:

```text
SUPPORTER read = assigned users only vs site-wide
production SharePoint group / Role binding
Entra group object IDs
```

v1 physical fence:

```text
use <TEST_ONLY_SITE_IDENTITY> membership
do not copy AssessmentSnapshots / AuditEvent ACLs
do not provision production Role binding tables
```

## 5. Runbook — design steps only（execution blocked）

These steps are the intended order **after** a separate Human Provisioning GO.
They are **not** authorized now.

1. Human chooses `<TEST_ONLY_SITE_IDENTITY>`（class B）. Do not invent it here.
2. Confirm the site is test-only. Facility business sites are OUT.
3. Create dedicated List Display Name `支援手順実施記録` on that site.
4. Set Title optional / non-required.
5. Create PR-MAP-NAMES-1 columns above. No DERIVED / body / JSON columns.
6. Set `prResult` choices to the three contract tokens only.
7. Provision unique on `prRecordId` and `prIdempotencyKey`.
8. **Stop. Do not create a ProcedureRecord item.**
9. Observe and record:
   - `<PROVISIONED_LIST_GUID>`
   - actual physical provisioning state
   - provisioned unique objects
10. Bind adapter runtime config `SiteId → List GUID`. Display Name / URL are not identity.
11. Separate LIVE WRITE GO is still required before any item create.

Agent auto-execution of steps 3–7 is FORBIDDEN.

## 6. Post-execution verification（future；not this GO）

PASS only if all are observed, not invented:

```text
List exists on the Human-chosen test-only site
Display Name = 支援手順実施記録（label only）
List GUID observed and non-empty
Internal Names match PR-MAP-NAMES-1
Title is optional / non-required
prRecordId unique = observed
prIdempotencyKey unique = observed
no schemaId / schemaVersion / dtoVersion / TimeZone columns
no procedure body / JSON blob columns
item count for ProcedureRecord = 0
  （LIVE WRITE has not occurred）
```

FAIL-CLOSED if Display Name or URL is used as List identity.

## 7. Failure / cleanup

```text
v1 adapter has no delete
item Recycle / Delete on facility lists = not the cleanup procedure
cleanup candidate = Human-controlled disposal of the test-only site as a whole
retention years remain DEFERRED
do not design item purge jobs
do not write a test item onto a facility business List
```

Rollback of an unexecuted design packet: do not Merge / do not execute. Tenant impact = none.

## 8. Failure behavior once a List exists（adapter already LOCKED）

Not changed by this packet:

```text
UNKNOWN / FETCH_FAILED ≠ EMPTY ≠ saved
NOT_AUTHORIZED / NOT_AUTHENTICATED → save_failed
INDETERMINATE / TRANSPORT_ERROR → save_outcome_unknown
no automatic create retry
GET-by-RecordId required before saved
```

## 9. Explicit OUT

```text
Human Provisioning GO
actual SharePoint List / column / site create
concrete GUID invention
SharePoint item write
LIVE WRITE
SPFx UI / live binder
production group / Role binding
caseload Decision
retention years Decision
Deploy / App Catalog
M365 / Entra mutation
facility business List reuse
```

## 10. HOLD

```text
Provisioning execution = NO-GO
LIVE WRITE = NO-GO
Deploy / App Catalog / M365 / Entra = NO-GO
test-only site identity = UNKNOWN
List GUID = UNKNOWN
unique/index objects = not observed
```

## 11. Next Gate

```text
Human Provisioning GO
requires Human-chosen <TEST_ONLY_SITE_IDENTITY>
does not authorize LIVE WRITE
```

## Findings

| ID | Severity | State | Content |
|---|---|---|---|
| F-PRV-001 | P2 | OPEN | test-only site identity remains UNKNOWN（class B；needed before execution） |
| F-PRV-002 | P2 | OPEN | List GUID / unique objects remain unobserved（class C；needed before LIVE WRITE） |
| F-PRV-003 | P2 | OPEN | index 候補 are not must-create for v1 first execution |

P0 / P1: none.
