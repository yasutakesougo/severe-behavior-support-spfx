# SBS-PLANNER-PRODUCT-ROLE-BINDING-V1 — Complete Controlled Packet

Durable repo freeze of GitHub Issue #669 Definition Draft-1. This packet does **not** change Draft-1 meaning. It does **not** consume Human Definition Lock, Human Scope Lock, or Implementation Start.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-PLANNER-PRODUCT-ROLE-BINDING-V1
unit: SBS-PLANNER-PRODUCT-ROLE-BINDING-V1
record type: Complete Controlled Packet
kind: Definition packet (single body) — freeze of Issue #669 Draft-1
status: FROZEN FROM ISSUE #669 / AWAITING HUMAN DEFINITION LOCK RECORD
normative surface: THIS PACKET BODY (frozen Draft-1 meaning)
attachment / sidecar / Notion hub / assessment page: EXCLUDED / NON-NORMATIVE
basis main: f323c975e9969fd02a6a27352a90ec8eb37961f8
frozen GitHub Issue: #669 OPEN
  url: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/669
  title: SBS-PLANNER-PRODUCT-ROLE-BINDING-V1 — Definition Draft-1
  issue updatedAt: 2026-09-18T04:45:41Z
  issue body sha256: ab11548528d4ccb1cedb1826f26b703a508e2f2731e749021f92e58c6cc91707
cited Notion source (non-normative sidecar):
  https://app.notion.com/p/3df128e1229d81789e93d0da3c68ddc8
source finding (non-normative correspondence):
  SBS-FRONT-END-COMPLETION-ASSESSMENT-1 / FE-F002

Independent Definition Review-1: PASS / REVIEW-CLEARED / CONSUMED
  record: docs/architecture/sbs-planner-product-role-binding-v1-independent-definition-review-1.md
  record blob: a50c0b4943c64956268bf7a9807caa9d46df2071
  P0 = 0
  P1 = 0
  P2 = 4 (Correction NOT REQUIRED)

parent PLANNER Destination unit (LOCKED; not rewritten):
  docs/architecture/sbs-planner-top-level-ia-v1-complete-controlled-packet.md
  locked blob: 4c80f67e0a05f6ff10036ee1f44f1be9e16bab73
parent PLANNER Destination Lock:
  docs/architecture/sbs-planner-top-level-ia-v1-human-definition-lock.md
  blob: 1324caa2445c4909164032da9623ba8e8deaca09

Human Definition Lock (this unit): NOT CONSUMED by this freeze
Human Scope Lock: NOT ELIGIBLE / NOT CONSUMED
Combined Definition / Scope Lock: NOT CONSUMABLE
Exact Scope Scout: NOT AUTHORIZED by this freeze
Implementation Start: NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
Product / SPFx / domain / schema mutation: NONE
CORR-1F / CORR-1G reopen: NOT AUTHORIZED
ADMIN_AUDIT Task-First / FE-F001 / FE-F003: OUT
Rewrite locked SBS-PLANNER-TOP-LEVEL-IA-V1 packet blob 4c80f67e…: NOT AUTHORIZED
```

This document freezes Issue #669 Definition Draft-1 into a durable repository packet so a later Human Definition Lock can bind an immutable blob. The frozen Draft-1 STOP block remains historical Draft text. Gate consumption lives in separate records.

Reviewers of this freeze must not treat wrapper metadata as a new Definition. Meaning is the frozen Draft-1 body below.

If Issue #669 body sha256 is not `ab11548528d4ccb1cedb1826f26b703a508e2f2731e749021f92e58c6cc91707`, this freeze does not apply. Re-freeze / Re-Review is required.

---

## Frozen Draft-1 body

The following is the GitHub Issue #669 body at `updatedAt` `2026-09-18T04:45:41Z` (sha256 `ab11548528d4ccb1cedb1826f26b703a508e2f2731e749021f92e58c6cc91707`). A trailing newline is added for repository file convention only.

# SBS-PLANNER-PRODUCT-ROLE-BINDING-V1 — Definition Draft-1

Source: https://app.notion.com/p/3df128e1229d81789e93d0da3c68ddc8?pvs=204
Basis main: `f323c975e9969fd02a6a27352a90ec8eb37961f8`
Source finding: SBS-FRONT-END-COMPLETION-ASSESSMENT-1 / FE-F002

```text
STATE = DEFINITION DRAFT-1
Repository Mutation = NONE
Implementation = HOLD
Human Definition / Scope Lock = NOT CONSUMED
Human Implementation Start = NOT CONSUMED
Ready / Merge / Deploy = HOLD
```

## Purpose

Make the already implemented PLANNER Task-First Top-Level IA reachable from the normal Product / Demo presentation-role entrance.

Do not redesign PLANNER navigation.
Do not change the existing Destination map.

## Established defect

The PLANNER Task-First implementation exists and works under dedicated smoke injection.

However:

- Product webpart does not pass the PLANNER presentation role into ScaffoldShell.
- DemoPresentationRoleEntry changes only the AppShellChrome-local presentation role.
- ScaffoldShell remains FIELD_STAFF.

Therefore, normal PLANNER / 計画担当 role selection does not render the PLANNER Task-First Global.

## Required behavior

When active presentation role = PLANNER, ScaffoldShell renders the existing PLANNER Task-First Global.

Preserve these Destination identities:

- 今の工程 → D-HOME
- 探す → D-FIND-PERSON
- ① → D-ASSESS
- ② → D-PLAN
- ③ → D-FIND-RECORD → D-RECORD-READ
- ④ → D-MONITOR
- ⑤ → D-REVIEW
- ⑥ → D-NEXT

## Role state requirement

Do not leave a rendered application state where:

```text
AppShellChrome = PLANNER
ScaffoldShell = FIELD_STAFF
```

The Definition does not prescribe React state ownership architecture.

Do not pre-select prop drilling, context, reducer, store, or hook architecture.

Required outcome = observable role state is consistent.

## FIELD_STAFF preservation

Preserve:

- FIELD_STAFF Task-First navigation.
- session event behavior.
- Person-context behavior.
- CORR-1F / CORR-1G semantics.
- FIELD_STAFF Destination identity.

## ADMIN_AUDIT boundary

```text
ADMIN_AUDIT Task-First Global implementation = OUT OF SCOPE
FE-F001 = NOT RESOLVED HERE
FE-F003 = ADMIN_AUDIT separate workstream
```

Do not design new ADMIN_AUDIT Destinations or Task-First UI in this workstream.

## PLANNER UI boundary

Preserve:

- `planner-task-navigation.ts` semantics.
- current PLANNER Destination identities.
- cycle numbering.
- PROCESS-VISIBILITY-UI-V1.
- SupportPlan deep process navigation.
- existing headings.
- existing Primary Action semantics.

This workstream is **entrance / role-binding only**.

Do not perform:

- card redesign.
- form redesign.
- deep workflow rewrite.
- business semantics change.
- authorization change.
- persistence change.
- SharePoint data change.
- new PLANNER Destination creation.

## Expected implementation surface

Investigation/change candidates are centered on:

- `spfx/src/webparts/scaffoldShellWebPart/ScaffoldShellWebPart.ts`
- `spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.tsx`
- `spfx/src/webparts/scaffoldShellWebPart/components/AppShellChrome.tsx`
- `spfx/src/webparts/scaffoldShellWebPart/components/DemoPresentationRoleEntry.tsx`

Only directly related tests are candidates for addition/modification.

If the implementation would need to cross this boundary, STOP and report.

## Acceptance requirements

- A1. Normal Product / Demo entrance can select PLANNER.
- A2. After PLANNER selection, ScaffoldShell renders 今の工程 and 探す.
- A3. Behavior does not depend on dedicated smoke-only `presentationRole` injection.
- A4. 今の工程 resolves to D-HOME.
- A5. 探す resolves to D-FIND-PERSON.
- A6. ①–⑥ Destination mapping remains unchanged.
- A7. FIELD_STAFF regression tests PASS.
- A8. Existing PLANNER unit tests PASS.
- A9. Existing PLANNER desktop smoke PASS.
- A10. Product / Demo role-selection test proves FIELD_STAFF → PLANNER changes the rendered Task-First Global.
- A11. PLANNER → FIELD_STAFF leaves no stale PLANNER state and returns to FIELD_STAFF navigation.
- A12. ADMIN_AUDIT Task-First implementation is not introduced.

## Mobile acceptance

FE-F008 is a candidate to close in the same validation cycle.

At approximately 390×844 verify:

- 今の工程 is visible.
- 探す is visible.
- Primary Action is operable.
- label wrapping does not lose meaning.
- no material horizontal overflow.
- task target remains usable.

## Review requirement

After implementation, run a Fresh Independent Implementation Review.

Reviewer checks:

- exact Definition compliance.
- FIELD_STAFF regression absence.
- no ADMIN_AUDIT scope expansion.
- Product / Demo reachability.
- desktop rendered evidence.
- mobile rendered evidence.
- test coverage.

Do not reconstruct missing historical Re-Review-4 evidence.
The new review must bind to the current implementation exact HEAD.

## Human Acceptance

PL-HTA occurs after:

```text
Implementation
→ Independent Review
→ desktop/mobile rendered verification
→ PL-HTA
```

Do not infer PL-HTA PASS from Implementation PASS.

## Out of scope

- ADMIN_AUDIT Task-First implementation.
- AA-HTA.
- FS-HTA-2.
- whole-app UI-REVIEW-8 closure.
- production deployment.
- SharePoint catalog update.
- version bump.
- new feature design.
- business rule change.
- authorization change.
- schema change.

## STOP

```text
Current step = Definition Draft-1 only
NEXT = Fresh Definition Review

Human Definition / Scope Lock = NOT CONSUMED
Human Implementation Start = NOT CONSUMED
Ready / Merge / Deploy = HOLD
Repository mutation = NOT AUTHORIZED by this Definition
```

This issue is a GitHub-native synchronization record of the cited Notion Definition Draft-1.
It does not consume or imply any Human GO.
