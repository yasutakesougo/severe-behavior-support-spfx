# REVIEW-OUTCOME-CAPTURE-SLICE-A — Definition

```text
Definition ID = REVIEW-OUTCOME-CAPTURE-SLICE-A
Mode = DEFINITION ONLY
Status = CANDIDATE / NOT LOCKED
basis main = ea0963268c8ba86c546a2c251b4fd81a582c08a3
parent relationship definition = REVIEW-TO-PLAN-REVISION-RELATIONSHIP-DEFINITION-1
parent relationship status = HUMAN DEFINITION LOCKED / merged via PR #548
Human Definition Lock GO = NOT RECEIVED
Implementation = NOT AUTHORIZED
SharePoint Write = NOT AUTHORIZED
Production Write = NOT AUTHORIZED
LIVE WRITE = NOT AUTHORIZED
Ready / Merge = NOT AUTHORIZED by this Definition
Issue mutation = NOT AUTHORIZED by this Definition
```

This Definition does **not** authorize Implementation Start.

---

## 1. Purpose

Define the smallest Product Slice that connects **current-main Human Review**
to **MonitoringPeriodReviewOutcome capture and readback**, using the domain
relationship already implemented on main via PR #548.

This Slice closes the direct current-main Product Gap:

```text
HumanReviewMaterials
= displayable

Human judgment ownership
= stated in UI

MonitoringPeriodReviewOutcome
= domain-implemented

NO_CHANGE / CHANGE_REQUIRED
= domain-implemented

Revision Pending
= domain-derived

however

Human judgment
        ↓
Outcome input
        ↓
Outcome readback
= NOT CONNECTED
```

This Definition is **not** a pre-#547 UI friction correction Slice.
It is **not** a Monitoring versioning Slice.
It is **not** an Assessment→Plan or ServiceUser master Slice.

---

## 2. Background — current main freeze

```text
main = ea0963268c8ba86c546a2c251b4fd81a582c08a3
latest merge = PR #548 (Review → Revision domain relationship)
prior merge = PR #547 (Human Review IA clarity A1/A2)
```

### Already on main

| Capability | Status | Evidence |
|---|---|---|
| `MonitoringPeriodReviewOutcome` domain type | IMPLEMENTED | `src/domain/monitoring-period-review-outcome.ts` |
| `NO_CHANGE` / `CHANGE_REQUIRED` | IMPLEMENTED | domain validators + tests |
| `isRevisionPending()` | IMPLEMENTED | derived; no SupportPlan status added |
| N→N+1 binding type | IMPLEMENTED | domain only; not product-connected |
| `HumanReviewView` materials display | IMPLEMENTED | fact materials + human-ownership copy |
| `MonitoringView` composition | IMPLEMENTED | summary + materials on same page |
| #547 identity / role cues | MERGED | person identity primary; summary vs materials cues |
| `LIVE_WRITE_AUTHORIZED` | false | domain constant |

### Not on main

| Capability | Status |
|---|---|
| Human Review outcome input UI | NOT CONNECTED |
| Outcome capture from reviewed materials context | NOT CONNECTED |
| Outcome readback on same screen | NOT CONNECTED |
| Outcome persistence (even synthetic) in Product | NOT CONNECTED |
| SupportPlanVersion N+1 creation UI | NOT CONNECTED |
| SharePoint Outcome persistence | NOT CONNECTED |

Current `HumanReviewView` states that humans own judgment, but provides no
operation to record `NO_CHANGE` or `CHANGE_REQUIRED`.

---

## 3. Evidence boundaries (do not conflate)

### Pre-#547 Actual Staff Evidence (#539)

```text
Actual Staff Evidence = ESTABLISHED
Staff count = 1
Overall = PARTIAL
Actual Staff Value PASS = NOT ESTABLISHED
Evidence target UI = pre-#547
Further AI persona evaluation = STOP
```

This evidence remains valid as **pre-#547 observation**.
It must **not** be reinterpreted as proof that current-main Q1/Q2/Q5 remain
unresolved after #547.

### Current-main Actual Staff revalidation

```text
Current-main Actual Staff revalidation = NOT PERFORMED
Current-main Actual Staff Value PASS = UNKNOWN / NOT ESTABLISHED
```

This Slice does **not** require current-main staff revalidation before Definition.
It does **not** claim staff friction is fully resolved.

### Primary justification for this Slice

The Slice is justified by a **current-main structural Product Gap** that exists
independently of pre-#547 staff evidence:

```text
Domain contract exists
        ↓
Human judgment responsibility is displayed
        ↓
Human cannot yet record that judgment
```

---

## 4. Problem Statement

After a staff member reviews `HumanReviewMaterials`, the product must allow
them to record one of two business decisions already defined in domain:

```text
NO_CHANGE
CHANGE_REQUIRED
```

Without this connection:

```text
「見直したが変更なし」
```

and

```text
「変更が必要」
```

cannot be distinguished from

```text
「まだ見直していない」
```

even though domain types for the first two already exist.

Monitoring remains Derived.
This Slice does **not** introduce MonitoringVersion.

---

## 5. Parent Definition binding

This Slice must remain conformant with locked
`REVIEW-TO-PLAN-REVISION-RELATIONSHIP-DEFINITION-1`.

It must **not** reopen:

```text
MonitoringVersion
SupportPlan.status = PendingReview reinterpretation
Decision complete = Revision complete
UI / AI as Outcome System of Record
Assessment → Plan
ServiceUser master
```

It **uses** without redefining:

```text
MonitoringPeriodReviewOutcome
NO_CHANGE
CHANGE_REQUIRED
Revision Pending (derived)
Monitoring Period Review Context fields
Human authority required
```

---

## 6. Target Product Flow (Slice A)

```text
MonitoringReadModel
        ↓
HumanReviewMaterials
        ↓
Monitoring Period Review (human reads facts)
        ↓
[未判断]
        ↓
Human selects exactly one:
  「変更なし」  → NO_CHANGE
  「変更が必要」 → CHANGE_REQUIRED
        ↓
MonitoringPeriodReviewOutcome assembled
        ↓
Synthetic / fake persistence (presentation boundary)
        ↓
Same-screen readback of saved Outcome
```

If `CHANGE_REQUIRED`:

```text
表示:
  変更が必要

  次の計画版は
  まだ作成されていません
```

This readback must reflect **Revision Pending** semantics from the parent
Definition. It must **not** imply N+1 already exists.

If `NO_CHANGE`:

```text
表示:
  見直し結果: 変更なし
```

---

## 7. Core Principles

### 7.1 Human authority

Only an explicit human action may finalize Outcome capture.

```text
AI suggestion
≠
Outcome capture

Materials display
≠
Outcome capture

Default / implicit / timeout
≠
Outcome capture
```

### 7.2 Domain-first capture

Captured values must map to existing domain contract:

```text
MonitoringPeriodReviewOutcome.decision
= "NO_CHANGE" | "CHANGE_REQUIRED"
```

Review Context must be taken from the already-resolved
`HumanReviewMaterials` / Monitoring context on screen, not re-entered by staff.

At minimum:

```text
OrganizationId
SiteId
UserId
planId
planVersion
periodStart
periodEnd
sourceRecordIds[]
reviewedAt
reviewedBy
OutcomeId (minted deterministically from payload)
```

### 7.3 Synthetic persistence only

Slice A persistence is **presentation-only / synthetic**.

```text
Synthetic persistence
≠
SharePoint persistence
≠
Production Binding
≠
LIVE WRITE
```

Saved Outcome exists for demo/session readback and proof of connection only.
It must be clearly bounded as non-production data.

Follow existing demo boundary patterns (`presentationOnly`, hold copy, no live
write claims).

### 7.4 Same-screen readback

After capture, the same composition must show the saved Outcome without
navigation away from the Monitoring + Human Review surface.

Readback must show:

```text
decision label (human-readable)
reviewed plan version
reviewed period
Revision Pending state when CHANGE_REQUIRED and no binding exists
```

### 7.5 No automatic revision

Outcome capture does **not** create SupportPlanVersion N+1.
Outcome capture does **not** mutate `SupportPlan.currentVersion`.
Outcome capture does **not** complete Revision.

---

## 8. UI Boundary

### IN (conceptual)

```text
Undecided state indicator (before capture)
Two explicit human actions only:
  NO_CHANGE
  CHANGE_REQUIRED
Post-save readback panel / section
CHANGE_REQUIRED Revision Pending message
Synthetic/demo boundary note (non-production persistence)
Disabled / unavailable after successful capture for same review context
  (exact UX deferred to Implementation Scope; must not allow silent overwrite)
```

### OUT

```text
N+1 creation UI
Plan editing
MonitoringVersion display
Assessment linkage UI
AI recommendation / auto-decision
SharePoint save success semantics
Production save badge
Navigation to a separate Review outcome page (unless later Human GO)
Daily Records journey redesign
```

UI remains a projection of captured Outcome; UI state alone is not System of Record.

---

## 9. Persistence Boundary

Slice A may use one of (Implementation Scope decides):

```text
A. in-memory / session-scoped synthetic store keyed by review context
B. component-local state with explicit presentationOnly flag
C. existing demo fixture/session pattern consistent with shell boundaries
```

Slice A must **not** use:

```text
SharePoint list / REST / adapter
domain persistence port (deferred from #548 Scope)
Production repository
cross-tenant durable storage
```

Duplicate capture for the same review context should fail closed or be explicitly
handled (Implementation Scope). Silent overwrite of a finalized Outcome is forbidden.

---

## 10. Relationship to MonitoringVersion / Q6

Staff 1 Q6 asked whether Monitoring itself needs version management.
Parent Definition and PR #548 answered: **no MonitoringVersion**.

This Slice preserves:

```text
MonitoringVersion = NOT REQUIRED
Monitoring versioning decision = HOLD / OUT
```

Slice A captures **human review outcome**, not a Monitoring snapshot version.

---

## 11. Open PR / simulation entropy

PHASE 1 reconciliation (read-only):

| PR | Disposition relative to Slice A |
|---|---|
| #539 | Evidence container; pre-#547 staff observation |
| #543 | Historical simulation evidence; do not extend simulation |
| #544 | Separate LOCKED process Definition; no enforcement |
| #526,#506,#505,#504,#491,#489,#481 | Separate HOLD tracks |

No open PR blocks Slice A Definition.
No requirement to merge #543 / #544 before Slice A.

---

## 12. Non-Goals

```text
SharePoint persistence
SupportPlanVersion N+1 creation
SupportPlan.currentVersion mutation
SupportPlan.status enum changes
MonitoringVersion / Monitoring snapshot persistence
Assessment → Plan relationship
ServiceUser master / Staff master
Production Binding
LIVE WRITE
Deploy
AI automatic decision
Actual Staff revalidation on current main
Pre-#547 UI friction rework
Daily → Monitoring → Review journey redesign
Outcome correction / cancellation / supersede
Binding creation UI (N→N+1 linkage product flow)
```

Secondary Gaps remain separate.

---

## 13. Invariants

```text
INV-A1  Outcome capture requires explicit human action
INV-A2  Only NO_CHANGE or CHANGE_REQUIRED may be captured
INV-A3  Captured Outcome must validate against domain contract
INV-A4  Review Context comes from on-screen materials context
INV-A5  Synthetic persistence only; LIVE WRITE forbidden
INV-A6  Readback occurs on same Monitoring/Human Review composition
INV-A7  CHANGE_REQUIRED readback must not imply N+1 exists
INV-A8  NO_CHANGE readback must distinguish reviewed-no-change from undecided
INV-A9  MonitoringVersion must not be introduced
INV-A10 UI-only state must not substitute for captured Outcome
INV-A11 AI must not finalize Outcome
INV-A12 Parent Definition relationship semantics must not be contradicted
```

---

## 14. Acceptance Criteria (Definition)

```text
AC-A1
Slice closes Human Review → Outcome input → readback gap on current main.

AC-A2
Uses existing MonitoringPeriodReviewOutcome domain; no domain redesign.

AC-A3
Captures only NO_CHANGE or CHANGE_REQUIRED.

AC-A4
Synthetic / fake persistence is explicit and non-production.

AC-A5
Same-screen readback after capture is required.

AC-A6
CHANGE_REQUIRED shows Revision Pending message without N+1 creation.

AC-A7
MonitoringVersion is not introduced.

AC-A8
SharePoint / LIVE WRITE / N+1 / currentVersion / Assessment / User master remain OUT.

AC-A9
Justification is current-main structural gap, not pre-#547 staff evidence alone.

AC-A10
No Implementation or production mutation authorized by this Definition.
```

---

## 15. Expected Staff Explanation

```text
見直し資料を確認したあと、
「変更なし」か「変更が必要」かを選んで記録できます。

変更なしの場合は、
今の計画版をそのまま使い続けます。

変更が必要の場合は、
まず「変更が必要」という結果だけを残します。
次の計画版は、この画面ではまだ作りません。

モニタリング自体の版は作りません。
```

---

## 16. Implementation Scope Gate (after Definition Lock)

Definition Lock后、Implementation Scope では最低限決定する:

```text
1. Exact Product files (MonitoringView / HumanReviewView / new module?)
2. Synthetic persistence mechanism (session / in-memory / component state)
3. reviewedBy source in demo (synthetic actor string vs shell context)
4. reviewedAt source (client clock vs injected frozen timestamp)
5. Duplicate capture handling for same review context
6. Disabled state after capture UX
7. Readback presentation structure and copy
8. Slice flag constant (presentationOnly / liveWriteAuthorized false)
9. Focused tests + rendered smoke scope
10. Whether capture attaches below materials or adjacent section
11. Error / malformed domain assembly handling (fail-closed copy)
12. Whether MonitoringView or HumanReviewView owns capture UI
```

---

## 17. Verification intent (Definition level)

Later implementation evidence should prove at minimum:

```text
undecided → capture NO_CHANGE → readback shows 変更なし
undecided → capture CHANGE_REQUIRED → readback shows 変更が必要 + Revision Pending
captured Outcome validates against domain contract
synthetic boundary note visible
no SharePoint / LIVE WRITE path
no N+1 creation UI
focused tests + rendered smoke PASS
```

Actual Staff revalidation on current main remains a **separate optional gate**
after implementation; not required for Definition Lock.

---

## 18. Independent Definition Review targets

```text
Parent Definition conformance
No MonitoringVersion creep
No SharePoint / LIVE WRITE authorization
Synthetic persistence boundary explicit
Human authority explicit
NO_CHANGE vs undecided distinction preserved
CHANGE_REQUIRED Revision Pending message without N+1
Evidence boundary (pre-#547 vs current-main) respected
Secondary Gap firewall maintained
Scope minimalism (Outcome capture/readback only)
```

---

## 19. Stop Condition

```text
REVIEW-OUTCOME-CAPTURE-SLICE-A
= DEFINED (candidate)

Implementation
= NOT STARTED

Mutation of Product code
= 0

NEXT
= Independent Definition Review-1
```

Human Definition Lock GO is required before Implementation Scope or Implementation.
