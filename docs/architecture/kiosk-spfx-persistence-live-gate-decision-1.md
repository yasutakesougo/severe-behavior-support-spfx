# KIOSK-SPFX-PERSISTENCE-LIVE-GATE-DECISION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-KIOSK-SPFX-PERSISTENCE-LIVE-GATE-1
Unit: KIOSK-SPFX-PERSISTENCE-LIVE-GATE-DECISION-1
Kind: Decision / planning only
Status: SELECTED (OPTION B)
Human Selection: OPTION B (2026-08-17)
Basis main: a8049a20550554ef5a87704060db228953ccae3a

This recording
  ≠ Implementation Start
  ≠ source / test modification
  ≠ LIVE WRITE GO
  ≠ SharePoint / schema / Deploy mutation
  ≠ production List binding
  ≠ consumed first-create GO reuse

Agent auto-accept of LIVE WRITE: FORBIDDEN
```

Related:

```text
PREP: docs/architecture/kiosk-spfx-persistence-live-verify-prep-1.md
      Decision: BLOCKED_BY_GATE
First-create closeout:
  docs/architecture/procedure-record-first-live-write-closeout.md
  CONSUMED / CLOSED
Current gate:
  src/adapters/sharepoint/procedure-record/live-write-gate.ts
  spfx/src/adapters/procedure-record/live-write-gate.ts (must stay aligned)
```

---

## 1. Problem

PR #388 closed the Staff save **code path** onto `persistProcedureRecord`.
KGAP-025 remains **LIVE VERIFICATION OPEN**.

The next verification is one synthetic Staff-path CREATE + GET-by-RecordId on
the existing test-only List. That is a **second** live CREATE on a List that
already holds first-create residue.

The current executable gate cannot authorize that write without either:

- reusing consumed purpose `procedure-record-first-create`, or
- asserting `itemCount === 0` on a List that is no longer empty.

Both are forbidden. The gate therefore blocks verification. This Decision
chooses how to unblock it without turning ProcedureRecord CREATE into a
general production capability.

---

## 2. Current first-create gate

Executable contract on `a8049a20`:

```text
purpose:        procedure-record-first-create
listGuid:       PROCEDURE_RECORD_TEST_ONLY_LIST_GUID
                = b971ff03-799e-41ac-b037-8becb9f4ff4b
itemCount:      literal 0 (type + validator)
humanLiveWriteGo: true
expectedMainSha: exact 40-hex
logicalSiteId / organizationId: exact bind
default mint:   createProcedureRecordLiveWriteAuthorization() → null
process flag:   isProcedureRecordLiveWriteAuthorized() → false
```

Comments and `verifyProcedureRecordPreWriteEmpty` describe ItemCount=0 as a
**first-write precheck**, not a generic `create()` invariant. The packet type
still requires `itemCount: 0` for every packet the current validator accepts.

Classification of the current gate: **FIRST-WRITE-SPECIFIC** (intent), with an
executable shape that currently admits **only** that first-write packet.

First-create Human GO: **CONSUMED / CLOSED**. Residue `listItemId=1` remains.
Cleanup is not authorized by this Decision.

---

## 3. Why current gate blocks verification

```text
New purpose kiosk-spfx-persistence-live-verify-1  → REJECTED
itemCount = 1 (truthful residue)                  → REJECTED
purpose = procedure-record-first-create
  + itemCount = 0                                 → ACCEPTED by validator
                                                  → FORBIDDEN as reuse
```

Empty-List-only is the right safety condition for proving the first item can
be written. It is the wrong identity condition for a later, distinct payload
on the same test-only List.

---

## 4. Option A — generalize the existing gate

```text
purpose → procedure-record-create (or keep one purpose for all CREATE)
itemCount → any non-negative integer
```

Weakens the consumed first-create contract. Scope is too wide: future CREATE
could inherit a general write capability. Production generalization risk.

**REJECT.**

---

## 5. Option B — keep first-create; add a verify-only purpose

```text
UNCHANGED:
  procedure-record-first-create
  + itemCount === 0
  + test-only GUID
  + default runtime CLOSED

NEW:
  PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_GO_PURPOSE
  = "kiosk-spfx-persistence-live-verify-1"
```

The new purpose is bound to one verification unit, one locked payload, and
duplicate-identity preconditions (RecordId / IdempotencyKey EMPTY), not
whole-List emptiness.

**ACCEPT (this Decision).**

---

## 6. Option C — bypass the gate in a one-shot harness

Write via transport / harness without a Human GO packet mint.

Circumvents the capability model. Makes consumed-GO reuse and unaudited POST
easier. Not fail-closed.

**REJECT.**

---

## 7. Decision

```text
SELECT: OPTION B
REJECT: OPTION A
REJECT: OPTION C

itemCount === 0:
  FIRST-CREATE ONLY
  not a general CREATE authorization condition

new purpose:
  kiosk-spfx-persistence-live-verify-1
  KIOSK-SPFX-PERSISTENCE-LIVE-VERIFY-1 only

default runtime:
  remains CLOSED

production List / general CREATE authorization:
  OUT
```

This Decision does not open LIVE WRITE. Implementation is a later unit:
`KIOSK-SPFX-PERSISTENCE-LIVE-GATE-IMPLEMENTATION-1`.

---

## 8. First-create compatibility

```text
PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE
  remains "procedure-record-first-create"

ProcedureRecordLiveWriteGoPacket.itemCount
  remains literal 0

Consumed first-create packet
  remains invalid for a second CREATE

SPFx live-write-gate.ts
  stays aligned with root; first-create rules unchanged
```

GD-01 / GD-02: PASS under this Decision (implementation must preserve them).

---

## 9. New purpose

```text
Name:  PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_GO_PURPOSE
Value: "kiosk-spfx-persistence-live-verify-1"
```

Use:

- KIOSK-SPFX-PERSISTENCE-LIVE-VERIFY-1 execution runner only

Do not use for:

- normal Staff runtime
- production operation
- general CREATE authorization
- first-create replay

---

## 10. New packet contract

New packet type (name to be fixed at implementation). Distinct from
`ProcedureRecordLiveWriteGoPacket`. Authorization identity fields:

```text
purpose:              "kiosk-spfx-persistence-live-verify-1"
humanLiveWriteGo:     true
expectedMainSha:      exact 40-char SHA
listGuid:             exact PROCEDURE_RECORD_TEST_ONLY_LIST_GUID
logicalSiteId:        exact value
organizationId:       exact value
recordId:             exact locked RecordId
idempotencyKey:       exact locked IdempotencyKey
payloadFingerprint:   exact locked PayloadFingerprint
mutationBudgetCreate: 1
retryPost:            0
```

Mint only when packet fields equal the execution binding (SHA, List GUID,
organizationId, logicalSiteId) **and** the locked payload identities.

### itemCount: authorization vs evidence

| Placement | Effect |
|---|---|
| Keep `itemCount: 0` on the new packet | Re-imposes first-write emptiness; blocks residue List |
| Bind `itemCount: number >= 0` as identity | Expires the packet whenever any other item appears or disappears; couples verify CREATE to whole-List census |
| Exclude from authorization identity; record as PRE-WRITE EVIDENCE | Preserves first-create `itemCount===0`; duplicate safety stays on RecordId / IdempotencyKey EMPTY |

**SELECT:** exclude `itemCount` from the new purpose's authorization identity.
Record fresh ItemCount as execution evidence / unexpected-state detection.
Do not ignore List state: unexpected schema or lookup failures still STOP.

---

## 11. Pre-write checks

Human GO does not skip these. Any mismatch → **NO CREATE / STOP**.

```text
1. authoritative main == packet.expectedMainSha
2. List GUID == test-only List GUID
3. physical schema PASS
4. GET-by-RecordId EMPTY
5. GET-by-IdempotencyKey EMPTY
6. locked PayloadFingerprint MATCH
7. organizationId MATCH
8. logicalSiteId MATCH
```

Fresh ItemCount GET may run as evidence. It is not an authorization predicate
for this purpose.

Locked payload candidate (reconfirm with domain helpers before implementation
and before execution):

```text
result:             PERFORMED_AS_PLANNED
RecordId:           a850964e3b78dc7f2917701b344fa2401a2dde9625073fad8e164c66bc826fcd
IdempotencyKey:     faa67e9b0403a4185dfa7776626186d2798c9b232810f71029e0821cdbdd34a8
PayloadFingerprint: 69aecf49d46fcd97614d3c3e79cfe50a4ebde1bb5b4d3c84decfa183ca1e58af
OrganizationId:     synthetic-org-001
SiteId:             SITE-ISG
UserId:             user-a
recordedBy:         synthetic-subject-001
planId:             synthetic-plan-001
planVersion:        3
ProcedureId:        synthetic-procedure-p3
ProcedureVersion:   synthetic-procedure-p3-v1
performedAtLocal:   2026-08-17T14:05
recordedAt:         2026-08-17T14:10:00+09:00
```

If helper re-run diverges, STOP and do not CREATE.

---

## 12. Mutation budget

```text
CREATE attempts: 1
UPDATE: 0
DELETE: 0
PATCH / MERGE: 0
retry POST: 0
```

Unknown / INDETERMINATE: no second POST. Follow existing
`persistProcedureRecord` semantics (GET reconcile only). If still unconfirmed:
`save_outcome_unknown` and STOP.

---

## 13. Post-write reconciliation

POST 201 is not PASS.

```text
GET-by-RecordId
  → exactly one row
  → MATCH RecordId, IdempotencyKey, PayloadFingerprint,
    OrganizationId, SiteId, UserId, ProcedureId, ProcedureVersion, result
  → persist final saveState = saved
```

Synthetic success remains forbidden.

---

## 14. Default-runtime invariants

Must remain true after any later implementation of OPTION B:

```text
createProcedureRecordLiveWriteAuthorization() → null
isProcedureRecordLiveWriteAuthorized() → false
Staff UI default persistPort → LIVE WRITE HOLD
new mint → exact Human GO packet + exact execution binding only
FromHost / default transport createItem → FORBIDDEN without that mint
```

---

## 15. Production explicit OUT

```text
production facility List
production binding
general procedure-record-create purpose
Staff runtime default LIVE
Deploy / App Catalog
schema / List / column create
cleanup / delete of first-create residue
M365 / Entra mutation
```

Target restriction for this Decision: **TEST-ONLY LIST ONLY**.

---

## 16. Implementation gate

Not authorized by this document.

```text
Next: KIOSK-SPFX-PERSISTENCE-LIVE-GATE-IMPLEMENTATION-1
Then:  fresh authenticated GET (PREP lookups still UNKNOWN)
Then:  new Human LIVE WRITE GO
Then:  KIOSK-SPFX-PERSISTENCE-LIVE-VERIFY-1
```

Implementation, if later GO'd, must add a **new** packet/validator/mint path
and must not rewrite first-create validators to accept `itemCount !== 0` or a
generic CREATE purpose.

Root and SPFx gate copies stay aligned.

---

## 17. Evidence

```text
main:                 a8049a20550554ef5a87704060db228953ccae3a
PR #388:              MERGED (Staff path CONNECTED, HOLD default)
PREP:                 BLOCKED_BY_GATE
first-create GO:      CONSUMED / CLOSED
fresh ItemCount GET:  not performed in PREP (UNKNOWN)
this unit:            docs-only Decision recording
source diff:          NONE
SharePoint:           NONE
```

---

## Acceptance (this Decision)

| ID | Result |
|---|---|
| GD-01 first-create meaning unchanged | SELECTED |
| GD-02 consumed GO not reused | SELECTED |
| GD-03 new purpose Kiosk verification only | SELECTED |
| GD-04 itemCount===0 not a general CREATE condition | SELECTED |
| GD-05 RecordId / IdempotencyKey EMPTY as new CREATE precondition | SELECTED |
| GD-06 payloadFingerprint bound on packet | SELECTED |
| GD-07 main SHA / List GUID / org / site bound | SELECTED |
| GD-08 CREATE budget = 1 | SELECTED |
| GD-09 retry POST = 0 | SELECTED |
| GD-10 default runtime CLOSED | SELECTED |
| GD-11 test-only target only | SELECTED |
| GD-12 production write not authorized | SELECTED |
