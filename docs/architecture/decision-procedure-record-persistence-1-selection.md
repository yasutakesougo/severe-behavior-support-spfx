# ProcedureRecord Persistence v1 — Human Selection Packet

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-PROCEDURE-RECORD-PERSISTENCE-1
Kind: Human Selection packet（ProcedureRecord persistence v1）
Status: SELECTED / NOT ACCEPTED / NOT LOCKED
Human Decision: SELECT PR-PERS-PKG-1 + D4 = A
Human Selection date: 2026-08-16
Unit: PROCEDURE-RECORD-PERSISTENCE-DECISION-1

Canonical on GitHub main:
  NOT CLAIMED
  this file is a Selection record only
  it is not the Accepted / LOCKED SoT on origin/main

Requested basis:
  main @ 487bb2ac1d8eb20aff5f30111d5c64facfa1cdb9
Design basis:
  PROCEDURE-RECORD-PERSISTENCE-DESIGN-1（read-only design；not a Decision）
Logical contract（do not redesign）:
  Decision-FIELD-WORKFLOW-CONTRACT-B-PKG-1 = SELECTED / LOCKED
  src/domain/procedure-record.ts
  schema: severe-behavior-support.procedure-record.record @ 1.0.0

Selection ≠ Acceptance
Selection ≠ LOCK
Selection ≠ Implementation Start
Selection ≠ SharePoint List / column / site create GO
Selection ≠ adapter code GO
Selection ≠ SPFx change GO
Selection ≠ LIVE WRITE GO
Selection ≠ Deploy / App Catalog / M365 / Entra mutation
Agent auto-select: FORBIDDEN（this Selection is Human GO）
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

Still OPEN / DEFERRED（must not be closed by this Selection）:

```text
SUPPORTER read scope
  assigned users only vs all users on the selected site
ProcedureRecord statutory retention years
concrete Internal Names / Display Names
SharePoint group / Role binding
test-only site identity（name / URL）
```

## 0. How to read this packet

This document records Human Selection of persistence **policy** for ProcedureRecord v1.
It does not invent Internal Names, List display names, site URLs, or Entra group IDs.
SELECTED here is not Accepted and not LOCKED.

A later Acceptance / LOCK, if given, must bind:

```text
Decision ID
selected package / clock option
head SHA of the Acceptance recording
what remains OPEN / DEFERRED
what remains OUT
```

This Selection still does **not** authorize tenant mutation,
adapter implementation, or live item create.

## 1. Decision units after Selection

| ID | Unit | After Human Selection |
|---|---|---|
| D1 | Storage topology | SELECTED in PR-PERS-PKG-1（NOT ACCEPTED / NOT LOCKED） |
| D2 | Procedure representation | SELECTED in PR-PERS-PKG-1（NOT ACCEPTED / NOT LOCKED） |
| D3 | Physical mapping policy | SELECTED in PR-PERS-PKG-1（NOT ACCEPTED / NOT LOCKED） |
| D4 | Clock representation | **A SELECTED** / B NOT SELECTED（NOT ACCEPTED / NOT LOCKED） |
| D5 | Identity / idempotency | SELECTED in PR-PERS-PKG-1（NOT ACCEPTED / NOT LOCKED） |
| D6 | Mutation policy | SELECTED in PR-PERS-PKG-1（NOT ACCEPTED / NOT LOCKED） |
| D7 | Permission model | Partial SELECT；caseload **OPEN** |
| D8 | Read-back / persistence success | SELECTED in PR-PERS-PKG-1（NOT ACCEPTED / NOT LOCKED） |
| D9 | Save outcome | SELECTED in PR-PERS-PKG-1（NOT ACCEPTED / NOT LOCKED） |
| D10 | Retention / test cleanup | Partial SELECT；retention years **DEFERRED** |
| D11 | LIVE validation boundary | SELECTED in PR-PERS-PKG-1（NOT ACCEPTED / NOT LOCKED） |

Judgement units **not** closed by this Selection:

```text
List display name / List internal identity
column Display Name / Internal Name / Column Type concrete values
  except D4 clock encoding policy = ISO string（A）
  concrete Internal Name strings remain unconfirmed
indexes as provisioned objects
Entra / SharePoint group object IDs
SUPPORTER read = assigned users only vs all users on site
ProcedureRecord statutory retention years
test-only site name / URL
list/column/site provisioning
adapter Implementation Start
LIVE WRITE
Acceptance / LOCK
```

## 2. Selected package — PR-PERS-PKG-1

Human SELECT. Not Accepted. Not LOCKED.

### D1 — Storage topology（SELECTED）

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

Concrete site URL / List name: **still not in this Decision**.

### D2 — Procedure representation（SELECTED）

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

### D3 — Physical mapping policy（SELECTED）

```text
SELECTED:
  Contract / Domain names ≠ SharePoint Internal Names
  Display Name / Internal Name / Column Type live in mapping SoT
    （sharepoint-contract-mapping family；Status 確定 only after later Decision）
  schemaId / schemaVersion / dtoVersion / TimeZone MAY be DERIVED
    （no per-item column required）
  Title is not identity canonical
    （optional operational copy of RecordId does not make Title = RecordId）
```

This unit still does **not** confirm any Internal Name string.

TimeZone derived value, if used, remains `Asia/Tokyo` as in the logical contract.

### D4 — Clock representation（A SELECTED）

| Option | Meaning | Result |
|---|---|---|
| **A** | `performedAt` / `recordedAt` = ISO DateTime **string** columns | **SELECTED**（NOT ACCEPTED / NOT LOCKED） |
| **B** | SharePoint DateTime columns | **NOT SELECTED** |

Human reason（v1 choice）:

```text
keep contract ISO values round-trippable
do not bring SharePoint DateTime timezone normalization
into the persistence adapter
B is not judged false；it is not the v1 selection
```

LocalDate remains the Asia/Tokyo calendar day of `performedAt` and must match on read.
That rule is already LOCKED in B-PKG-1；this unit only chose persistence encoding of the two clocks.

Concrete Internal Name / Display Name for those string columns remain unconfirmed.

### D5 — Identity / idempotency（SELECTED）

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

### D6 — Mutation policy（SELECTED）

```text
ProcedureRecord v1 = CREATE-ONLY
update: NOT ADOPTED
delete: NOT ADOPTED
correction / supersede contract: NOT INVENTED in v1
```

A fact record is not overwritten. Unknown-outcome reconciliation is GET, not UPDATE.
If correction is needed later, that is a separate Decision and a schema change.

Adapter v1 has no update method and no delete method.

### D7 — Permission model（partial SELECT）

SELECTED:

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
```

OPEN / not decided by this Selection:

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

### D8 — Read-back / persistence success（SELECTED）

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
This Selection does not implement that path.

Review trace（policy only）:

```text
ProcedureRecord is canonical
SupportRecordTraceRef is derived（not a second stored body）
Review reaches the original record by RecordId
historical planVersion is not rebound to Active
```

### D9 — Save outcome（SELECTED）

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

### D10 — Retention / test cleanup（partial SELECT）

SELECTED / operational prohibition:

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

DEFERRED / HOLD（not closed by this Selection）:

```text
statutory retention years for ProcedureRecord itself
```

Do **not** auto-apply AuditLog Decision-AUD-RET-1 or GOV-AUD-05 / DEC-012
to ProcedureRecord. Those remain Audit-scoped until a separate Decision
says otherwise.

Until that Decision exists, do not design item purge jobs for ProcedureRecord.

### D11 — LIVE validation boundary（SELECTED）

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

## 3. Options matrix after Selection

| Unit | Selected | Not selected / still open |
|---|---|---|
| D1 | dedicated List on facility site | hub List；mix into existing lists |
| D2 | flatten 3 Procedure fields | JSON blob；flatten+blob |
| D3 | mapping SoT；DERIVED envelope/TimeZone；Title ≠ identity | copy Domain names to Internal Names；concrete names still OPEN |
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
Internal Name invention as confirmed values
adapter implementation
SPFx UI change
Deploy / App Catalog
M365 / Entra mutation
production item create / update / delete
physical deletion runbooks for facility data
LIVE WRITE
Issue auto-close
Acceptance / LOCK by this recording alone
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

## 6. Findings after Selection

| ID | Severity | State | Content |
|---|---|---|---|
| F-001 | P2 | SELECTION RECORDED | D4=A selected；still NOT ACCEPTED / NOT LOCKED |
| F-002 | P2 | OPEN | SUPPORTER read caseload vs site-wide remains OPEN |
| F-003 | P2 | OPEN | ProcedureRecord retention years remain DEFERRED |
| F-004 | P2 | OPEN | this file is not Accepted SoT on GitHub main |

P0 / P1: none.
HOLD continues because Acceptance / LOCK has not been given.

## 7. HOLD

```text
Status = SELECTED / NOT ACCEPTED / NOT LOCKED
this working-tree file ≠ origin/main Accepted SoT
D7 caseload OPEN
D10 retention years DEFERRED
concrete Internal Names / Display Names unconfirmed
SharePoint group / Role binding unknown
test-only site identity unknown
Implementation Start = NOT AUTHORIZED
SharePoint provisioning = NOT AUTHORIZED
LIVE WRITE = NOT AUTHORIZED
Deploy = NOT AUTHORIZED
```

## 8. Next gates（policy order only；not live PR gates）

```text
1. DONE — Human Selection: PR-PERS-PKG-1 + D4=A
2. Decision Fresh Review of this Selection record
3. Human Acceptance / LOCK Gate（separate）
   still does not start List create / adapter / LIVE WRITE
4. Separate mapping Decision for concrete Display / Internal / Type
   （clock encoding policy already selected as ISO string）
5. Separate Human GO for List / column provisioning
6. Separate Human GO for adapter Implementation Start
   （create + dual lookup + GET-by-RecordId；no update/delete）
7. Separate Human LIVE WRITE GO
   （synthetic, test-only site, 1 item, Review read-back）
8. Only after 7: reassess LIVE_PERSISTENCE in severe-behavior-cycle-review
```

Step 1 does not start steps 3–7.
Step 3 Acceptance / LOCK, if given later, still does not start steps 5–7.
