# ProcedureRecord Persistence v1 — Human Selection + Acceptance

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-PROCEDURE-RECORD-PERSISTENCE-1
Kind: Human Selection + scoped Acceptance（ProcedureRecord persistence v1）
Status: ACCEPTED / LOCKED（scoped；DEFERRED items are NOT LOCKED）
Human Selection: SELECT PR-PERS-PKG-1 + D4 = A（2026-08-16）
Human Acceptance: ACCEPT / LOCK PR-PERS-PKG-1 + D4 = A（2026-08-16）
Acceptance unit: PROCEDURE-RECORD-PERSISTENCE-ACCEPTANCE-1
PR: #380
reviewed HEAD（Fresh Review PASS；expired by this Acceptance recording）:
  d50db082fc47f9cb6241169eb925c56924988166
Unit: PROCEDURE-RECORD-PERSISTENCE-DECISION-1

Canonical on GitHub main:
  YES
  main since 406a2c3cf16f03b57884fd33e495756eacaff86b
  scoped ACCEPTED / LOCKED policy is canonical on origin/main
  DEFERRED items remain NOT LOCKED

Related later Decision:
  Decision-PROCEDURE-RECORD-MAPPING-1
  ACCEPTED / LOCKED（scoped）
  canonical on main since eaa517ea3ee28fe4797f51259331aa1ee8c947cd
  Internal Names / Display Names / Types are no longer deferred here

Requested basis:
  main @ 487bb2ac1d8eb20aff5f30111d5c64facfa1cdb9
Design basis:
  PROCEDURE-RECORD-PERSISTENCE-DESIGN-1（read-only design；not a Decision）
Logical contract（do not redesign）:
  Decision-FIELD-WORKFLOW-CONTRACT-B-PKG-1 = SELECTED / LOCKED
  src/domain/procedure-record.ts
  schema: severe-behavior-support.procedure-record.record @ 1.0.0

Acceptance / LOCK of this scoped policy
  ≠ Implementation Start
  ≠ SharePoint List / column / site create GO
  ≠ adapter code GO
  ≠ SPFx change GO
  ≠ LIVE WRITE GO
  ≠ Deploy / App Catalog / M365 / Entra mutation
  ≠ Ready / Merge GO
Agent auto-accept: FORBIDDEN（this Acceptance is Human GO）
```

## Human Selection record

```text
HUMAN SELECTION
Decision:
  Decision-PROCEDURE-RECORD-PERSISTENCE-1
Package:
  PR-PERS-PKG-1 → SELECT
D4 Clock representation:
  A → SELECT
  B → NOT SELECTED

A:
  persist performedAt / recordedAt as ISO DateTime strings
B:
  SharePoint DateTime columns → NOT SELECTED
```

Human reason for D4=A（v1 choice, not a judgement that B is false）:

```text
round-trip the contract values as written
do not import SharePoint DateTime timezone normalization
into the persistence adapter
GET-by-RecordId can compare performedAt / recordedAt
to the same ISO strings
```

Selected now:

```text
PR-PERS-PKG-1
D4 = A / ISO DateTime string
```

Still OPEN / DEFERRED（must not be closed by Selection or this scoped Acceptance）:

```text
SUPPORTER read scope
  assigned users only vs all users on the selected site
ProcedureRecord statutory retention years
SharePoint group / Role binding
test-only site identity（name / URL）
```

Later closed outside this Decision:
  Internal Names / Display Names / Types
  → Decision-PROCEDURE-RECORD-MAPPING-1 ACCEPTED / LOCKED（scoped）
    canonical on main since eaa517ea3ee28fe4797f51259331aa1ee8c947cd

## Human Acceptance record

```text
PROCEDURE-RECORD-PERSISTENCE-ACCEPTANCE-1

repository:
  yasutakesougo/severe-behavior-support-spfx
PR:
  #380
reviewed HEAD:
  d50db082fc47f9cb6241169eb925c56924988166
Human Decision:
  ACCEPT / LOCK PR-PERS-PKG-1
  D4 = A / ISO DateTime string
```

ACCEPTED / LOCKED scope:

```text
D1 Storage topology
D2 Procedure representation
D3 Physical mapping policy
D4 = A / ISO DateTime string
D5 Identity / idempotency
D6 Mutation policy（CREATE-ONLY）
D7 create + selected-site boundary only
D8 Read-back / persistence success
D9 Save outcome
D10:
  v1 adapter deleteなし
  facility business Listへのtest write禁止
D11 LIVE validation boundary
```

DEFERRED / NOT LOCKED:

```text
SUPPORTER read:
  assigned users only vs site-wide
ProcedureRecord retention years
SharePoint group / Role binding
test-only site identity
concrete provisioned List GUID values
actual physical provisioning state
provisioned unique/index objects
```

Later closed outside this Decision:
  Internal Names / Display Names / Types
  → Decision-PROCEDURE-RECORD-MAPPING-1

Explicit OUT（unchanged by Acceptance）:

```text
adapter implementation
List / column / site provisioning
SharePoint item create/update/delete
SPFx modification
LIVE WRITE
Deploy / App Catalog
M365 / Entra mutation
Ready / Merge
```

This Acceptance recording creates a new commit. The Fresh Review bound to
`d50db082fc47f9cb6241169eb925c56924988166` is therefore expired.

## 0. How to read this packet

This document records Human Selection and scoped Acceptance of persistence
**policy** for ProcedureRecord v1.
It does not invent site URLs, Entra group IDs, or provisioned List GUIDs.
Internal Names / Display Names / Types were later LOCKED by
Decision-PROCEDURE-RECORD-MAPPING-1.
ACCEPTED / LOCKED applies only to the scope listed above.
DEFERRED items are not LOCKED.

This Acceptance still does **not** authorize tenant mutation,
adapter implementation, live item create, Ready, or Merge.

## 1. Decision units after scoped Acceptance

| ID | Unit | After Human Acceptance |
|---|---|---|
| D1 | Storage topology | ACCEPTED / LOCKED |
| D2 | Procedure representation | ACCEPTED / LOCKED |
| D3 | Physical mapping policy | ACCEPTED / LOCKED |
| D4 | Clock representation | **A ACCEPTED / LOCKED** / B NOT SELECTED |
| D5 | Identity / idempotency | ACCEPTED / LOCKED |
| D6 | Mutation policy | ACCEPTED / LOCKED |
| D7 | Permission model | Partial LOCK：create + site boundary **LOCKED**；caseload **NOT LOCKED** |
| D8 | Read-back / persistence success | ACCEPTED / LOCKED |
| D9 | Save outcome | ACCEPTED / LOCKED |
| D10 | Retention / test cleanup | Partial LOCK：no adapter delete + no facility-list test write **LOCKED**；years **NOT LOCKED** |
| D11 | LIVE validation boundary | ACCEPTED / LOCKED |

Judgement units **not** closed by this Acceptance:

```text
concrete provisioned List GUID values
indexes as provisioned objects
Entra / SharePoint group object IDs
SUPPORTER read = assigned users only vs all users on site
ProcedureRecord statutory retention years
test-only site name / URL
list/column/site provisioning
adapter Implementation Start
LIVE WRITE
```

Later closed outside this Decision:
  List Display Name / Internal Names / column Types
  → Decision-PROCEDURE-RECORD-MAPPING-1 ACCEPTED / LOCKED（scoped）
    canonical on main since eaa517ea3ee28fe4797f51259331aa1ee8c947cd

## 2. Accepted package — PR-PERS-PKG-1

Human SELECT then ACCEPT / LOCK（scoped）.
DEFERRED items below are not LOCKED.

### D1 — Storage topology（ACCEPTED / LOCKED）

```text
SELECTED:
  ProcedureRecord dedicated List
  place that List on each facility-dedicated site
  mixing into AssessmentSnapshots / SupportPlans / AuditEvent
    / AbcRecord / ExecutionRecord lists = FORBIDDEN
```

Why:

- B-PKG-1 already forbids treating ProcedureRecord as an extension of those aggregates.
- Decision-AS-ORG-SITE-TOPOLOGY-1 FS-1 is the existing facility-site pattern
  （dedicated site + dedicated lists；data boundary = that facility）.
  Applying the **pattern** to ProcedureRecord is selected here.
  The AS topology Acceptance does **not** automatically cover this aggregate.
- OrganizationId / SiteId fields alone are not isolation.

Not selected:

| ID | Meaning | Result |
|---|---|---|
| PR-TOPO-HUB | one List on the common management site | NOT SELECTED |
| PR-TOPO-MIX | columns on AssessmentSnapshots or other live lists | NOT SELECTED |

Concrete site URL: **still not in this Decision**.
List Display Name / Internal Names / Types: later LOCKED by
Decision-PROCEDURE-RECORD-MAPPING-1.

### D2 — Procedure representation（ACCEPTED / LOCKED）

```text
SELECTED flatten columns:
  ProcedureId
  ProcedureVersion
  ApprovalState
DO NOT persist procedure body（A2 maintained）
DO NOT persist Procedure as JSON blob
DO NOT dual-write flatten + blob
```

Why:

- Binding / FW-05 / GET-by-RecordId need the three reference values, not body.
- JSON identity hides missing fields and invites body leakage.
- Dual write would create a second canonical body.

`ApprovalState` remains `APPROVED` only. Other values on read = malformed / fail-closed.

### D3 — Physical mapping policy（ACCEPTED / LOCKED）

```text
SELECTED:
  Contract / Domain names ≠ SharePoint Internal Names
  Display Name / Internal Name / Column Type live in mapping SoT
    （sharepoint-contract-mapping family）
  schemaId / schemaVersion / dtoVersion / TimeZone MAY be DERIVED
    （no per-item column required）
  Title is not identity canonical
    （optional operational copy of RecordId does not make Title = RecordId）
```

Concrete Internal Name / Display Name / Type strings are not invented here.
They were later LOCKED by Decision-PROCEDURE-RECORD-MAPPING-1
（canonical on main since eaa517ea3ee28fe4797f51259331aa1ee8c947cd）.

TimeZone derived value, if used, remains `Asia/Tokyo` as in the logical contract.

### D4 — Clock representation（A ACCEPTED / LOCKED）

| Option | Meaning | Result |
|---|---|---|
| **A** | `performedAt` / `recordedAt` = ISO DateTime **string** columns | **ACCEPTED / LOCKED** |
| **B** | SharePoint DateTime columns | **NOT SELECTED**（v1 non-choice；not judged false） |

Human reason（v1 choice）:

```text
keep contract ISO values round-trippable
do not bring SharePoint DateTime timezone normalization
into the persistence adapter
B is not judged false；it is not the v1 selection
```

LocalDate remains the Asia/Tokyo calendar day of `performedAt` and must match on read.
That rule is already LOCKED in B-PKG-1；this unit only chose persistence encoding of the two clocks.

Clock column Internal Names / Display Names were later LOCKED by
Decision-PROCEDURE-RECORD-MAPPING-1（D4=A remains ISO string encoding）.

### D5 — Identity / idempotency（ACCEPTED / LOCKED）

```text
SELECTED:
  RecordId unique within the facility site List
  IdempotencyKey unique within the facility site List
  PayloadFingerprint non-unique
  findByRecordId AND findByIdempotencyKey required before create
  both EMPTY → create allowed
  both FOUND + same record + same immutable context + same fingerprint
    → replay（no new item）→ may become saved after GET-by-RecordId
  mismatch / diverged lookups / RECORD_CONTEXT_MISMATCH → conflict → save_failed
  either lookup UNKNOWN or FETCH_FAILED → create forbidden
    → save_outcome_unknown（do not guess EMPTY）
```

Reuse ExecutionRecord / contracts-v1 submission meaning. Do not invent a second idempotency system.

Do **not** copy AuditEvent uniqueness（OrganizationId space；SiteId excluded from uniqueness key）.
ProcedureRecord uniqueness space = **that facility List**.

SharePoint unique columns, if later provisioned, are defense in depth only.
They do not replace dual lookup.

### D6 — Mutation policy（ACCEPTED / LOCKED）

```text
ProcedureRecord v1 = CREATE-ONLY
update: NOT ADOPTED
delete: NOT ADOPTED
correction / supersede contract: NOT INVENTED in v1
```

A fact record is not overwritten. Unknown-outcome reconciliation is GET, not UPDATE.
If correction is needed later, that is a separate Decision and a schema change.

Adapter v1 has no update method and no delete method.

### D7 — Permission model（partial LOCK）

ACCEPTED / LOCKED:

```text
create:
  SUPPORTER with selected-site membership
read:
  must not cross site boundary
  adapter site bind + item OrganizationId/SiteId match
  UI filter is not the isolation control
management read candidates:
  SITE_ADMIN
  SERVICE_MANAGER
  PLANNER
  （role names are candidates；group binding is NOT LOCKED）
```

DEFERRED / NOT LOCKED:

```text
SUPPORTER read =
  assigned users only
  OR all users on the selected site
```

OUT of this Decision:

```text
Entra group object IDs
SharePoint group object IDs
role → group binding tables
reuse of AssessmentSnapshots / AuditEvent permissions
```

Logical roles remain the contracts-v1 seven roles.
`docs/process/ai-role.md` user labels are not the authorization SoT.

GOV-AUD-04（logical-delete role = application OUT）is not reopened.
This packet does not invent a ProcedureRecord delete role.

### D8 — Read-back / persistence success（ACCEPTED / LOCKED）

`saved` requires all of:

```text
create attempt completed without a definite failure
GET-by-RecordId
DTO / validateProcedureRecord validation
same RecordId
planId / planVersion unchanged
ProcedureId / ProcedureVersion / ApprovalState unchanged
result unchanged
performedAt / recordedAt unchanged
```

SharePoint HTTP create success alone MUST NOT be mapped to `saved`.

`findByIdempotencyKey` is also required（create gate and unknown reconciliation）.
SharePoint item numeric Id is not RecordId.

Without GET-by-RecordId, LIVE persistence is not READY.
This Acceptance does not implement that path.

Review trace（policy only）:

```text
ProcedureRecord is canonical
SupportRecordTraceRef is derived（not a second stored body）
Review reaches the original record by RecordId
historical planVersion is not rebound to Active
```

### D9 — Save outcome（ACCEPTED / LOCKED）

Persistence adapter results:

```text
saved
save_failed
save_outcome_unknown
```

These are **not** ProcedureRecord.result:

```text
PERFORMED_AS_PLANNED
PERFORMED_WITH_ADAPTATION
NOT_PERFORMED
```

`NOT_PERFORMED` may coexist with `saved`.
`save_failed` is not a factual performance result.

Shell `unsaved` / `saving` remain UI progression states, not adapter results.

`save_outcome_unknown`:

```text
automatic create retry = FORBIDDEN
guess-collapse to saved or save_failed = FORBIDDEN
next step = dual lookup reconciliation only
```

Definite failures（permission denied, schema mismatch, list not found, validation, conflict）
map to `save_failed`, not to `save_outcome_unknown`.
Timeout / partial response / indeterminate HTTP map to `save_outcome_unknown`, not to `save_failed`.

ERROR must not become a successful empty result（DEC-7）.

### D10 — Retention / test cleanup（partial LOCK）

ACCEPTED / LOCKED:

```text
v1 adapter has no delete
automatic physical deletion of production items = NOT ADOPTED
LIVE validation MUST NOT write a test item onto a facility business List
```

Recommended candidate（not a site-create GO；site identity remains OPEN）:

```text
test-only site + dedicated ProcedureRecord List
cleanup = Human-controlled disposal of that test site as a whole
item Recycle / Delete on facility lists = not the cleanup procedure
```

DEFERRED / NOT LOCKED:

```text
statutory retention years for ProcedureRecord itself
```

Do **not** auto-apply AuditLog Decision-AUD-RET-1 or GOV-AUD-05 / DEC-012
to ProcedureRecord. Those remain Audit-scoped until a separate Decision
says otherwise.

Until that Decision exists, do not design item purge jobs for ProcedureRecord.

### D11 — LIVE validation boundary（ACCEPTED / LOCKED）

```text
fully synthetic / fictional data only
test-only site
exactly 1 ProcedureRecord item
schema/list mutation GO ≠ record write GO（never the same Human GO）
LIVE WRITE = separate later Human GO
read-back must include Review trace to the same RecordId
production-derived anonymized persons = FORBIDDEN
```

This unit describes the **future** live-test fence.
It does not authorize the test.
test-only site identity remains OPEN.

## 3. Options matrix after scoped Acceptance

| Unit | Selected | Not selected / still open |
|---|---|---|
| D1 | dedicated List on facility site | hub List；mix into existing lists |
| D2 | flatten 3 Procedure fields | JSON blob；flatten+blob |
| D3 | mapping SoT；DERIVED envelope/TimeZone；Title ≠ identity | names/types later LOCKED by Decision-PROCEDURE-RECORD-MAPPING-1 |
| D4 | **A ISO string** | B SharePoint DateTime |
| D5 | site-List unique RecordId + IdempotencyKey；dual lookup | AuditEvent uniqueness copy；fingerprint unique；skip lookup |
| D6 | CREATE-ONLY | update-in-place；logical delete；supersede in v1 |
| D7 | site-bound SUPPORTER create；admin-class read candidates | cross-site read；reuse AS ACLs；caseload **OPEN** |
| D8 | saved only after GET-by-RecordId identity/clock/result match | HTTP 201 = saved |
| D9 | saved / save_failed / save_outcome_unknown | collapse unknown；confuse with result tri-state |
| D10 | no adapter delete；no facility-list test write；test-site disposal candidate | item physical delete cleanup；copy AuditLog years；years **DEFERRED** |
| D11 | synthetic + test-only site + 1 item + separate WRITE GO | live facility write；schema+write same GO；site identity **OPEN** |

## 4. Explicit OUT

```text
ProcedureRecord logical 1.0.0 redesign
procedure body persistence（A1）
AssessmentSnapshots / SupportPlans / AuditEvent / AbcRecord / ExecutionRecord reuse
List / column / site create or rename
Internal Name invention in this persistence packet
  （names/types later LOCKED by Decision-PROCEDURE-RECORD-MAPPING-1）
adapter implementation
SPFx UI change
Deploy / App Catalog
M365 / Entra mutation
production item create / update / delete
physical deletion runbooks for facility data
LIVE WRITE
Issue auto-close
Ready / Merge
```

## 5. Upstream locks this packet must not reopen

```text
B-PKG-1 ProcedureRecord shape / result tri-state / dual clocks / FW-05
A2 procedure body stays outside contracts
TraceRef derived only
contracts-v1 dual lookup / replay / RECORD_CONTEXT_MISMATCH
save_outcome_unknown non-collapse / no immediate retry（FW-09 / DADS）
DEC-7 failure ≠ empty success
DEC-1 Schema ID ≠ List name ≠ TypeScript type name
```

## 6. Findings after scoped Acceptance

| ID | Severity | State | Content |
|---|---|---|---|
| F-001 | P2 | ACCEPTED RECORDED | D4=A ACCEPTED / LOCKED；B remains v1 not-selected |
| F-002 | P2 | OPEN | SUPPORTER read caseload vs site-wide remains NOT LOCKED |
| F-003 | P2 | OPEN | ProcedureRecord retention years remain DEFERRED |
| F-004 | P2 | CLOSED | merge-after metadata stale；canonical on main since 406a2c3cf16f03b57884fd33e495756eacaff86b |

P0 / P1: none.
These P2 rows are deferred / state-tracking items. They are not Acceptance blockers.
HOLD continues for implementation / provisioning / LIVE WRITE / Deploy.
F-004 is closed as merge-after state-sync only. It is not a mapping Decision.

## 7. HOLD

```text
Status = ACCEPTED / LOCKED（scoped）
DEFERRED items are NOT LOCKED
canonical on origin/main since 406a2c3cf16f03b57884fd33e495756eacaff86b
D7 caseload NOT LOCKED
D10 retention years DEFERRED
SharePoint group / Role binding unknown
test-only site identity unknown
concrete List GUID UNKNOWN
actual physical provisioning state NOT CLAIMED
provisioned unique/index objects NOT CLAIMED
Internal Names / Display Names:
  LOCKED by Decision-PROCEDURE-RECORD-MAPPING-1
  canonical on main since eaa517ea3ee28fe4797f51259331aa1ee8c947cd
Implementation Start = NOT AUTHORIZED
SharePoint provisioning = NOT AUTHORIZED
LIVE WRITE = NOT AUTHORIZED
Deploy = NOT AUTHORIZED
PR #380 Ready / Merge = DONE
```

## 8. Next gates（policy order only；not live PR gates）

```text
1. DONE — Human Selection: PR-PERS-PKG-1 + D4=A
2. DONE — Decision Fresh Review
3. DONE — Human Acceptance / LOCK
4. DONE — Final Decision Fresh Review
5. DONE — Ready Gate / PR #380
6. DONE — Merge PR #380
   canonical persistence Decision on main since
   406a2c3cf16f03b57884fd33e495756eacaff86b
7. DONE — physical mapping Decision
   Decision-PROCEDURE-RECORD-MAPPING-1
   canonical on main:
   eaa517ea3ee28fe4797f51259331aa1ee8c947cd
   status:
   ACCEPTED / LOCKED（scoped）
8. Separate Human Provisioning GO
   NOT GIVEN
9. Separate adapter Implementation Start GO
   NOT GIVEN
10. Separate Human LIVE WRITE GO
    NOT GIVEN
11. Only after LIVE validation:
    reassess LIVE_PERSISTENCE
```

PR #380 / #382 Merge does not start steps 8–10.
Acceptance / LOCK of scoped policy does not start provisioning, adapter, LIVE WRITE, or Deploy.
