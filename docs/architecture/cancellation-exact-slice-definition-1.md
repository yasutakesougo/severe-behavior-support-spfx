# CANCELLATION-EXACT-SLICE-DEFINITION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: CANCELLATION-EXACT-SLICE-DEFINITION-1
Kind: read-only exact-slice definition
Parent: #448 FIELD_STAFF Today / Tablet UX remaining owner
Governing sequence: #392
Authority basis: main @ a76848909376df78f8afc1acc5a03cff9a860ac4
#448: OPEN / KEEP OPEN
#443: D6 = OPEN / NOT CONSUMED
#444: Planning-PC separate scope
Current authority: kiosk-spfx-schema-contract-design-1.md
Definition status: DRAFT / REVIEW HOLD
Boundary: PROPOSED BOUNDARY / REVIEW CANDIDATE
Implementation: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
Schema mutation: FORBIDDEN
SharePoint WRITE: FORBIDDEN
Issue mutation: FORBIDDEN
Ready / Merge / Deploy / LIVE WRITE: FORBIDDEN
```

## 1. Purpose

Define the smallest future slice for cancellation without inferring a
FIELD_STAFF cancellation policy from the existing correction or read-model
work. The definition is evidence and boundary work only. It does not add a
cancel button, create a lifecycle event, or change the effective resolver.

## 2. Current state

The repository already contains the following read-side contract:

- `ProcedureRecord` is immutable; UPDATE and hard DELETE are not lifecycle operations.
- `ProcedureRecordLifecycleEvent@1.0.0` permits `CANCEL` with a target `RecordId` and no replacement.
- Cancellation preserves the target record and must not rewrite `result`.
- The effective resolver exposes `CANCELLED`, and the staff read model presents it as `取消済み`.
- `取消済み` is not eligible for a new `ProcedureRecord` create flow.
- Synthetic kiosk fixtures and unit tests evidence the cancelled read state.
- FIELD_STAFF correction and correction-save-wiring slices explicitly keep cancellation and lifecycle mutation disabled.
- FIELD_STAFF save 5-state semantics remain authoritative and unchanged.

These facts establish read-side compatibility only. They do not establish
who may cancel, when cancellation is allowed, whether a reason is required,
how confirmation works, or where an event may be persisted.

### Authorization semantics (locked)

```text
Authorization semantics: UNCHANGED
```

The cancellation exact-slice definition MUST NOT:

- expand authorization;
- reduce authorization requirements;
- infer cancellation authority from presentation availability;
- infer persistence authority from UI state;
- alter existing role/permission semantics.

Any authorization semantic change requires a separate authority decision and
separate Human GO.

## 3. Save state contract (locked)

```text
FIELD_STAFF save 5-state semantics: UNCHANGED
```

The existing distinction remains authoritative:

- `idle`
- `saving`
- `saved`
- `save_failed`
- `save_outcome_unknown`

save_outcome_unknown MUST NOT be treated as saved.

The cancellation definition and every cancellation slice must not redefine
this contract.

## 4. Exact future objective

After a separate Human policy/lifecycle Decision, the independently defined
slices may implement one append-only cancellation flow for an already existing
`ProcedureRecord`, with the
following fixed compatibility requirements:

- preserve the original record and its `result`;
- identify the target by `RecordId` or the established occurrence binding, never by route index;
- create a `CANCEL` lifecycle event rather than UPDATE or DELETE;
- derive lifecycle identity from the established lifecycle identity contract;
- distinguish `saved`, `save_failed`, and `save_outcome_unknown`;
- reconcile an uncertain outcome before any retry and never mint an automatic new event identity;
- render the resulting effective state as `取消済み` and prevent a new-record create action.

The future slices must not combine cancellation with correction, supersede,
observation persistence, SharePoint provisioning, or live deployment.

### Required policy decisions before Implementation Start

The following are unresolved and require separate decisions. No default may
be inferred from legacy `deleteRecord` behavior:

- authorized actor and role boundary for FIELD_STAFF;
- allowed target states and whether an already corrected record may be cancelled;
- whether a human-entered reason is optional or required;
- confirmation and interruption behavior on tablet;
- duplicate/replay behavior for the same cancellation submission;
- authorization and site/organization isolation checks;
- physical persistence owner and adapter boundary;
- whether cancellation is available only for the current occurrence or from history.

No unresolved item above is decided by this correction. No policy or semantic
default may be inferred from this definition.

## 5. FUTURE IMPLEMENTATION SCOPE (DEFINITION ONLY)

The following are independent future slices. Their presence defines boundaries
and dependencies only; none of these slices receives Implementation Start in
this document.

### CANCEL-SLICE-A — Lifecycle semantics / policy

Purpose:

- fix the existing cancellation semantic authority as an implementable contract;
- cancel ≠ delete;
- historical binding remains unchanged;
- correction semantics remain unchanged.

OUT:

- UI;
- persist port;
- SharePoint adapter;
- LIVE WRITE;
- #443 D6;
- #444 Planning-PC.

### CANCEL-SLICE-B — Lifecycle event creation

Purpose:

- create a lifecycle event based on approved cancellation semantics.

OUT:

- UI presentation;
- physical persistence;
- SharePoint adapter;
- Production Binding.

### CANCEL-SLICE-C — Persistence port / fake port

Purpose:

- pass a cancellation lifecycle event to an append-only persistence boundary;
- provide a test / synthetic fake implementation.

OUT:

- SharePoint physical WRITE;
- LIVE WRITE;
- UI redesign.

### CANCEL-SLICE-D — FIELD_STAFF cancellation CTA / presentation

Purpose:

- launch the existing cancellation capability from FIELD_STAFF UI;
- provide save-state and interaction evidence.

OUT:

- domain semantic re-decision;
- SharePoint physical WRITE;
- Production Binding;
- #443 D6;
- #444 Planning-PC.

### CANCEL-SLICE-E — SharePoint adapter / physical persistence

Purpose:

- a separately authorized later slice only.

STATUS:

```text
NOT AUTHORIZED / FUTURE
```

OUT:

- LIVE WRITE activation;
- Production Binding;
- Deploy / Redeploy unless separately authorized.

D and E are separate slices and must not be combined.

## 6. Dependency order

Recommended dependency:

```text
CANCEL-SLICE-A lifecycle semantics / policy
  → CANCEL-SLICE-B lifecycle event creation
  → CANCEL-SLICE-C persist port / fake
  → CANCEL-SLICE-D FIELD_STAFF CTA / presentation
```

`CANCEL-SLICE-E` SharePoint adapter / physical persistence is separate and
later. D and E must not be treated as one implementation slice.

## 7. Explicit OUT

```text
ProcedureRecord UPDATE / overwrite
ProcedureRecord hard DELETE
SUPERSEDE implementation
Correction mutation or correction-policy change
unrelated Correction implementation
Observation persistence or Review mutation
Observation → Review association
new lifecycle event fields or schema major-version change
SharePoint list / column / adapter / provisioning
SharePoint WRITE
SharePoint physical WRITE
LIVE WRITE
Production Binding
production data, PII, token, cookie, or secret handling
Deploy / Redeploy / App Catalog / host verification
Issue mutation
Issue close, Ready, Merge, PR, or branch mutation
#443 D6
#444 Planning-PC
Entra / M365 mutation
existing authorization semantics change
Implementation Start for any slice
```

## 8. Slice-level acceptance criteria for a later, separately authorized GO

Acceptance is independent per slice. No acceptance criterion authorizes
Implementation Start, production binding, or any external mutation.

### CANCEL-SLICE-A acceptance

- cancel ≠ delete;
- no historical record rewrite;
- correction semantics remain unchanged;
- unresolved policy is not silently decided;
- the original `ProcedureRecord` remains byte-for-byte immutable at the domain boundary;
- a cancellation cannot carry `replacementRecordId` or rewrite `result`.

### CANCEL-SLICE-B acceptance

- lifecycle event identity is deterministically testable;
- duplicate and invalid transitions fail closed;
- unauthorized, cross-site, cross-organization, malformed, and ambiguous requests fail closed;
- the event is created only from the defined cancellation semantics;
- same-logical retry reuses the same lifecycle identities;
- uncertain outcome does not auto-create a second event.

### CANCEL-SLICE-C acceptance

- append-only fake persistence is testable;
- no SharePoint request is made;
- no live authorization escalation occurs;
- `saved`, `save_failed`, and `save_outcome_unknown` remain distinguishable.

### CANCEL-SLICE-D acceptance

- CTA visibility and enabled state are deterministic;
- keyboard, focus, and tablet behavior are testable;
- FIELD_STAFF save 5-state semantics remain unchanged;
- confirmation, cancellation, and return/focus behavior have synthetic read-model or browser-smoke evidence;
- the effective read model transitions only through the existing resolver to `取消済み`.

### CANCEL-SLICE-E acceptance

- DEFERRED;
- acceptance is not activated until a separate definition and Human GO.

## 9. Allowed change surface for a future GO

```text
src/domain/*cancellation* or the explicitly named lifecycle domain file
tests/domain/*cancellation*
spfx/src/shell/procedure/*cancellation* (only if presentation is authorized)
spfx/smoke/* (only for synthetic evidence)
docs/architecture/*cancellation* evidence / implementation-start record
```

Any path outside this list requires a new scope decision. In particular,
physical schema and live persistence are separate gates.

## 10. Status and stop condition

```text
CANCELLATION-EXACT-SLICE-DEFINITION-1: REVIEW HOLD
Definition: READ-ONLY / REVIEW CANDIDATE
Implementation: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
Required next step: Fresh Independent Review, followed only if it passes by
a separate Human policy/lifecycle Decision and an exact Implementation Start
GO bound to the defined decisions, authority SHA, paths, and tests.
```
