# SBS-PLANNER-PRODUCT-ROLE-BINDING-V1 — Exact Scope Definition-1

Docs-only Exact Scope for SBS-PLANNER-PRODUCT-ROLE-BINDING-V1. This record converts the Human-Locked Definition plus current-main evidence into a finite Product / verification surface. It does **not** implement the Product, does **not** consume Human Scope Lock, and does **not** authorize Implementation Start.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-PLANNER-PRODUCT-ROLE-BINDING-V1
unit: SBS-PLANNER-PRODUCT-ROLE-BINDING-V1
kind: Exact Scope Definition-1
mode: READ ONLY SCOUT → DOCS-ONLY EXACT SCOPE AUTHORSHIP
date: 2026-09-18
status: COMPLETE / AWAITING FRESH INDEPENDENT SCOPE REVIEW

basis main: f323c975e9969fd02a6a27352a90ec8eb37961f8
Issue: #669 OPEN
  url: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/669
  frozen issue body sha256: ab11548528d4ccb1cedb1826f26b703a508e2f2731e749021f92e58c6cc91707
  live issue body sha256 at scout: ab11548528d4ccb1cedb1826f26b703a508e2f2731e749021f92e58c6cc91707
  live issue updatedAt: 2026-09-18T04:45:41Z
  live lastEditedAt: null

locked packet path:
  docs/architecture/sbs-planner-product-role-binding-v1-complete-controlled-packet.md
locked packet blob: f0aa82f6edb5f8687baba6482c37d42c43dc605d
locked packet HEAD: 2000d9692e27caea93cd0c0199847dc4f84309ae
Definition Lock record:
  docs/architecture/sbs-planner-product-role-binding-v1-human-definition-lock.md
Definition Lock blob: 5bee146cc5c6dadc80156714b153d3876b828f6b
Definition Lock HEAD: 484a2ec723b5927e239c1d79667de88ca0f0b1d8
Independent Definition Review-1: PASS / REVIEW-CLEARED / CONSUMED
  record: docs/architecture/sbs-planner-product-role-binding-v1-independent-definition-review-1.md
  record blob: a50c0b4943c64956268bf7a9807caa9d46df2071
  P0 = 0
  P1 = 0
  P2 = 4 (Correction NOT REQUIRED; carry-forward)

parent PLANNER Destination packet (LOCKED; not rewritten):
  docs/architecture/sbs-planner-top-level-ia-v1-complete-controlled-packet.md
  locked blob: 4c80f67e0a05f6ff10036ee1f44f1be9e16bab73
parent PLANNER Destination Lock blob: 1324caa2445c4909164032da9623ba8e8deaca09

Human Definition Lock: RECEIVED / CONSUMED (prior Lock record; not consumed by this Scope)
Human Scope Lock Eligibility: NOT YET (await Independent Scope Review PASS)
Human Scope Lock: NOT ELIGIBLE / NOT CONSUMED
Combined Definition / Scope Lock: NOT CONSUMABLE / NOT CONSUMED
Implementation Start: NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
Product / SPFx / domain / schema mutation by this document: NONE
Issue #669 mutation / close: NOT AUTHORIZED
Rewrite locked this-unit packet blob f0aa82f6…: NOT AUTHORIZED
Rewrite locked SBS-PLANNER-TOP-LEVEL-IA-V1 packet blob 4c80f67e…: NOT AUTHORIZED
CORR-1F / CORR-1G reopen: NOT AUTHORIZED
ADMIN_AUDIT Task-First / FE-F001 / FE-F003: OUT
```

Creating or reviewing this Scope does **not** authorize Product mutation and does **not** consume Human Scope Lock or Implementation Start.

Human Definition Lock ≠ Exact Scope complete ≠ Independent Scope Review PASS ≠ Human Scope Lock ≠ Implementation Start ≠ Ready ≠ Merge.

---

## 1. Identity / authority

```text
TASK CLASS = SCOUT → DEFINITION AUTHORSHIP
RISK = MEDIUM
Product Mutation = FORBIDDEN (this record)
Human Gate Consumption = FORBIDDEN (this record)
```

Authority order for this Scope:

1. Locked Complete Controlled Packet blob `f0aa82f6edb5f8687baba6482c37d42c43dc605d`
2. Human Definition Lock record blob `5bee146cc5c6dadc80156714b153d3876b828f6b`
3. Independent Definition Review-1 PASS / REVIEW-CLEARED (P0=0 / P1=0 / P2=4)
4. Frozen Issue #669 body sha256 `ab11548528d4ccb1cedb1826f26b703a508e2f2731e749021f92e58c6cc91707`
5. Current-main Product evidence at `f323c975e9969fd02a6a27352a90ec8eb37961f8`

The locked packet is the durable freeze of Issue #669 Draft-1. This Scope restates locked meaning only as far as needed to close a finite implementation surface. It does not rewrite the packet.

Scout note (non-normative lineage): at Exact Scope authorship time the locked packet / Lock record files are present on draft PR #671 (`cursor/sbs-planner-product-role-binding-lock-340e`, HEAD `484a2ec7…`) and are **absent from main**. The bind is the git blob, not main-tree presence. This Scope does not copy those files.

If the this-unit packet blob is not `f0aa82f6edb5f8687baba6482c37d42c43dc605d`, this Scope does not apply.

If Issue #669 body sha256 is not `ab11548528d4ccb1cedb1826f26b703a508e2f2731e749021f92e58c6cc91707`, this Scope does not apply.

---

## 2. Locked Definition bind

Preserve RB-A through RB-J. Observable Product meaning (locked; not redesigned here):

```text
RB-A  Product / Demo PLANNER selection → existing PLANNER Task-First Global
RB-B  今の工程 → D-HOME
RB-C  探す → D-FIND-PERSON
RB-D  ① D-ASSESS
      ② D-PLAN
      ③ D-FIND-RECORD → selected record → D-RECORD-READ
      ④ D-MONITOR
      ⑤ D-REVIEW
      ⑥ D-NEXT
RB-E  AppShellChrome = PLANNER AND ScaffoldShell = FIELD_STAFF  FORBIDDEN
RB-F  PLANNER → FIELD_STAFF restores FIELD_STAFF Task-First; no stale PLANNER nav
RB-G  ADMIN_AUDIT Task-First / new Destinations  OUT
RB-H  authorization / persistence / SharePoint / schema  OUT
RB-I  presentationRole remains synthetic  KEEP
RB-J  PL-HTA / Ready / Merge / Deploy  NOT this Scope
```

Forbidden mapping (locked):

```text
Global 探す → D-FIND-RECORD   FORBIDDEN
Global 探す remains D-FIND-PERSON
```

Locked acceptance A1–A12 remain the observable requirements. React state ownership architecture is **not** locked. This Scope may name the minimum parent/child role-change contract required for RB-E. It must not pre-select context / reducer / store / hook architecture beyond that minimum.

This workstream is **entrance / role-binding only**. PLANNER Destination identities stay owned by `planner-task-navigation.ts` (parent unit; not rewritten).

Definition P2 carry-forward (Correction NOT REQUIRED; this Scope must not “close” them by Product expansion):

| ID | Carry-forward into this Scope |
|---|---|
| P2-1 | Mobile / FE-F008 = verification of existing PLANNER Global once reachable. CSS / card redesign OUT. |
| P2-2 | Real paths: chrome/demo modules live under `spfx/src/shell/ux/`. Draft-1 candidate directories are not a locked surface. |
| P2-3 | ADMIN_AUDIT chrome-local leftover remains OUT. Do not “fix” dual-nav here. |
| P2-4 | No Entra / property-pane authorization role picker. Product entrance is existing Demo presentation-role control. |

---

## 3. Current-main evidence

Observed on basis main `f323c975e9969fd02a6a27352a90ec8eb37961f8`. Informative for Scope close. Not a Lock of code.

| Surface | Observation | Scope impact |
|---|---|---|
| `ScaffoldShellWebPart.ts` | Builds `IScaffoldShellProps` from `DEMO_1_FIELD_STAFF_FIXTURE` (`demoMode` included). Does **not** pass `presentationRole`. | **OUT.** Locked behavior is reachable without a WebPart prop. Expanding the public Product prop merely to reuse smoke injection would violate A3. |
| `IScaffoldShellProps.ts` | No Product `presentationRole` field. | **OUT.** Smoke injection remains a private extra on `ScaffoldShell` (`ScaffoldShellSmokeInjection`). Do not promote it to the public Product contract. |
| `ScaffoldShell.tsx` | Owns Task-First role state. Initial role = smoke `presentationRole` **or** `FIELD_STAFF`. PLANNER Task-First already renders when role is PLANNER. Passes `presentationRole={this.state.role}` into `AppShellChrome`. Has no handler that updates Task-First role from Demo entrance. Comment still says AppShellChrome is OUT of PLANNER mutation (parent-unit leftover). | **IN.** Must accept Demo-driven FIELD_STAFF ↔ PLANNER role changes and remount the matching Task-First layer. |
| `AppShellChrome.tsx` | Owns `activePresentationRole` local state. `DemoPresentationRoleEntry.onRoleChange` calls `setActivePresentationRole(next)` only. Does not notify `ScaffoldShell`. | **IN.** Minimum parent notify contract only. No chrome architecture redesign. |
| `DemoPresentationRoleEntry.tsx` | Already has `visible`, `role`, `onRoleChange`. Renders when `demoMode` is true. | **OUT.** Existing contract is sufficient. |
| `ScaffoldShell.module.scss` | `display: none` for `[data-shell-ux="demo-presentation-role-entry"]` under both `FIELD_STAFF` and `PLANNER` presentation-role selectors, together with primary-navigation / demo-banner / site-selector. | **IN** for **role-entrance visibility only**. Must not unhide SHELL-UX-7 primary-navigation or otherwise redesign Task-First chrome. |
| `planner-task-navigation.ts` | Locked PLANNER Global / Destination map already implemented. | **OUT / REGRESSION ONLY.** |
| `field-staff-task-navigation.ts` | Locked FIELD_STAFF CORR-1F / CORR-1G navigation. | **OUT / REGRESSION ONLY.** |
| `presentation-role.ts` | Synthetic roles FIELD_STAFF / PLANNER / ADMIN_AUDIT. Default FIELD_STAFF. | **OUT.** |
| `primary-navigation.ts` | SHELL-UX-7 Global rows. Task-First CSS continues to hide them for FIELD_STAFF / PLANNER. | **OUT / REGRESSION ONLY.** |
| Existing PLANNER smoke | `spfx/smoke/sbs-planner-top-level-ia-v1/smoke-entry.tsx` injects `presentationRole: "PLANNER"` plus query-string cycle. Dedicated workflow exists. | Regression evidence only. **Not** FE-F002 / A3 / A10 proof. |
| Existing FIELD_STAFF smoke | `spfx/smoke/sbs-role-task-first-ia-1/**` + workflow. Does not assert Demo role-entry remains hidden. | Regression. Unhiding the Demo entrance is not a silent CORR-1F reopen **if** other CORR-1F hides remain. |
| CI pattern | Dedicated Task-First / PLANNER smoke units have path-filtered GitHub workflows that run that unit’s `run-smoke.mjs`. Existing PLANNER workflow does not execute a new smoke directory. `553-b12-browser-smoke.yml` is unrelated Loop-B. | New dedicated workflow = **REQUIRED** if the dedicated harness is IN. |

No repository evidence requires changing `ScaffoldShellWebPart.ts` to achieve locked behavior. Therefore that file stays OUT. If later implementation cannot satisfy A1–A12 without it: **STOP = SCOPE EXPANSION REQUIRED**. Do not add it silently.

---

## 4. Exact Product IN surface

Only the following Product runtime files may change behavior / presentation in this unit:

```text
spfx/src/shell/ux/AppShellChrome.tsx
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.tsx
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.module.scss
```

### 4.1 Authorized change per file

**`AppShellChrome.tsx`**

Authorized:

```text
Minimum parent/child role-change contract so Demo entrance updates are
observable to ScaffoldShell.

Example shape (not architecture lock):
  optional callback on Demo onRoleChange
  still update local activePresentationRole for chrome attributes
```

Forbidden inside this file:

```text
chrome architecture redesign
new Destinations
authorization / Entra / property-pane role picker
ADMIN_AUDIT Task-First UI
unhiding or rewriting SHELL-UX-7 as V1 Global
card / form / SupportPlan / list·KPI redesign
```

**`ScaffoldShell.tsx`**

Authorized:

```text
Keep normal Product / Demo initial Task-First role = FIELD_STAFF
  (no presentationRole Product prop; smoke injection may remain for old smoke)

Consume Demo-driven role changes:
  FIELD_STAFF → PLANNER
    AppShellChrome presentation role = PLANNER
    ScaffoldShell Task-First role = PLANNER
    first PLANNER Destination = D-HOME
    (locked Definition does not authorize retained PLANNER workflow state)

  PLANNER → FIELD_STAFF
    Task-First role = FIELD_STAFF
    initial FIELD_STAFF Task-First restoration (no stale PLANNER Global / Destination)

Do not use smoke presentationRole: "PLANNER" as the Product proof path.
```

Forbidden inside this file:

```text
new PLANNER Destinations
cycle selector in Product UI
ADMIN_AUDIT Task-First layer
CORR-1F / CORR-1G semantic rewrite
promoting smoke injection into IScaffoldShellProps
```

**`ScaffoldShell.module.scss`**

Authorized:

```text
Stop hiding [data-shell-ux="demo-presentation-role-entry"]
for FIELD_STAFF and PLANNER Task-First surfaces
so demoMode = true Demo entrance is operable.

Bounded layout correction only if unhiding that control
requires it to remain usable (tap target / wrap / overflow).
```

Forbidden inside this file:

```text
visual redesign
unhiding primary-navigation / demo-banner / site-selector
as a side-effect of role-entrance visibility
mobile CSS redesign to force FE-F008
```

### 4.2 Minimum role-change contract (observable, not architecture)

Required rendered consistency:

```text
After Demo selects PLANNER:
  [data-shell-ux-presentation-role] = PLANNER
  [data-role-task-ia] = PLANNER

After Demo selects FIELD_STAFF:
  [data-shell-ux-presentation-role] = FIELD_STAFF
  [data-role-task-ia] = FIELD_STAFF
```

No transient or stable split-brain of the locked PLANNER/FIELD_STAFF pair may remain after the selection handler completes.

ADMIN_AUDIT (Definition P2-3):

```text
Do not implement ADMIN_AUDIT Task-First.
If Demo selects ADMIN_AUDIT, preserve current leftover
(chrome-local ADMIN_AUDIT + ScaffoldShell FIELD_STAFF)
rather than “fixing” it.
The parent contract MUST NOT collapse ADMIN_AUDIT chrome
into FIELD_STAFF as a false cleanup of FE-F001 / FE-F003.
```

---

## 5. Exact verification IN surface

### 5.1 Dedicated FE-F002 proof harness (IN)

```text
spfx/smoke/sbs-planner-product-role-binding-v1/smoke-entry.tsx     (new)
spfx/smoke/sbs-planner-product-role-binding-v1/run-smoke.mjs       (new)
```

Harness rules:

```text
Mount normal Product ScaffoldShell / Demo fixture.
Do NOT pass presentationRole: "PLANNER" into ScaffoldShell
as the acceptance path.

Role selection = operate [data-shell-ux="demo-presentation-role-entry"]
Cycle fixture = query-string / smoke-only synthetic context
  (reuse parent-unit cycle injection API if needed for Primary Action)
  MUST NOT appear as a Product cycle selector
  MUST NOT replace the Demo role-selection path
```

Required sequence (A3 / A10 / A11 / FE-F002):

```text
FIELD_STAFF initial
→ select PLANNER using Demo entrance
→ verify PLANNER chrome state
→ verify PLANNER Task-First state (今の工程 · 探す)
→ exercise required PLANNER navigation (SC-4 / SC-5)
→ select FIELD_STAFF using Demo entrance
→ verify FIELD_STAFF Task-First restoration
```

Desktop and 390×844-class evidence are both required in this harness (or the same runner with two viewports). Mobile checks are verification of the already implemented PLANNER Global once reachable (P2-1). They do not authorize CSS redesign.

Existing PLANNER smoke injection may remain for old regression evidence. It must **not** be cited as FE-F002 closure.

### 5.2 Workflow decision (evidence, not preference)

```text
.github/workflows/sbs-planner-product-role-binding-v1-browser-smoke.yml
= REQUIRED
```

Evidence:

- `sbs-planner-top-level-ia-v1-browser-smoke.yml` path-filters the parent smoke directory and runs that `run-smoke.mjs` only.
- `sbs-role-task-first-ia-1-browser-smoke.yml` is the FIELD_STAFF CORR-1F/1G counterpart.
- Adding a new smoke directory without a dedicated workflow would leave the FE-F002 proof unexecuted in CI.
- Extending the parent PLANNER workflow would mix injection-based regression with the forbidden-as-proof injection path.

The new workflow MUST checkout the PR exact head (same pattern as the parent PLANNER smoke), remain synthetic / presentation-only, and must not perform LIVE WRITE / tenant I/O / Deploy.

Optional generated smoke artifacts (html/css/js/gitignore) may be created by `run-smoke.mjs` as in the parent harness. They are not additional Product surface.

### 5.3 Verification OUT / not this-unit proof

```text
spfx/smoke/sbs-planner-top-level-ia-v1/**     REGRESSION ONLY (injection)
spfx/smoke/sbs-role-task-first-ia-1/**        REGRESSION ONLY
spfx/src/shell/ux/planner-task-navigation.test.ts     REGRESSION ONLY
spfx/src/shell/ux/field-staff-task-navigation.test.ts REGRESSION ONLY
spfx/src/shell/ux/presentation-role.test.ts           OUT / REGRESSION ONLY
553-b12 / other unrelated smokes                      OUT
```

A new ScaffoldShell unit test file is **not required**. If later implementation needs one, **STOP = SCOPE EXPANSION REQUIRED** for verification files and amend this Scope before adding it.

---

## 6. OUT / regression-only surface

| Path | Class | Reasoning |
|---|---|---|
| `spfx/src/webparts/scaffoldShellWebPart/ScaffoldShellWebPart.ts` | **OUT** | Does not pass `presentationRole`. Already supplies `demoMode`. Locked A1 is the in-shell Demo entrance, not a WebPart prop. |
| `spfx/src/webparts/scaffoldShellWebPart/components/IScaffoldShellProps.ts` | **OUT** | Public Product prop contract must not gain `presentationRole` merely to reuse smoke injection (A3). |
| `spfx/src/shell/ux/DemoPresentationRoleEntry.tsx` | **OUT** | `role` / `onRoleChange` already exist and are sufficient. |
| `spfx/src/shell/ux/planner-task-navigation.ts` | **REGRESSION ONLY** | Locked Destination identities. Do not alter. Do not add Destinations. |
| `spfx/src/shell/ux/field-staff-task-navigation.ts` | **REGRESSION ONLY** | CORR-1F / CORR-1G keep. Do not reopen. |
| `spfx/src/shell/ux/presentation-role.ts` | **OUT** | Synthetic vocabulary already includes PLANNER. No authorization semantics change. |
| `spfx/src/shell/ux/primary-navigation.ts` | **OUT / REGRESSION ONLY** | SHELL-UX-7 rows stay hidden for Task-First FIELD_STAFF / PLANNER. Not V1 Global. |
| domain / schema / adapters / Entra / property pane | **OUT** | RB-H. |
| SupportPlan / PROCESS-VISIBILITY-UI-V1 / list·KPI / cards / forms | **OUT** | Entrance / role-binding only. |

---

## 7. Observable acceptance requirements

Map locked A1–A12 to this-unit Scope criteria. Evidence must be reproducible at the implementation HEAD.

| ID | Requirement | Evidence |
|---|---|---|
| SC-1 | Normal Product / Demo initial Task-First role = FIELD_STAFF. Existing FIELD_STAFF behavior unchanged. | Dedicated harness first paint; FIELD_STAFF regression smoke / tests PASS |
| SC-2 | When `demoMode = true`, Demo presentation-role entrance is operable (not an authorization selector). | Dedicated harness: role-entry visible, enabled, clickable at desktop and 390×844 |
| SC-3 | Selecting PLANNER yields one consistent state: chrome = PLANNER **and** ScaffoldShell Task-First = PLANNER. First PLANNER Destination = D-HOME. No split-brain. No invented retained PLANNER workflow. | Dedicated harness after Demo PLANNER select: attributes + D-HOME |
| SC-4 | PLANNER Global: 今の工程 → D-HOME; 探す → D-FIND-PERSON | Dedicated harness Global clicks |
| SC-5 | Cycle map unchanged: ① D-ASSESS; ② D-PLAN; ③ D-FIND-RECORD → D-RECORD-READ; ④ D-MONITOR; ⑤ D-REVIEW; ⑥ D-NEXT. Assert Global 探す ≠ D-FIND-RECORD. | Dedicated harness + existing `planner-task-navigation.test.ts` regression |
| SC-6 | PLANNER → FIELD_STAFF restores Task-First = FIELD_STAFF. No stale PLANNER Task-First navigation. Do not reopen CORR-1F / CORR-1G. | Dedicated harness reverse bind; FIELD_STAFF tests PASS |
| SC-7 | ADMIN_AUDIT Task-First not implemented. FE-F001 OUT. FE-F003 OUT. No ADMIN_AUDIT Destination change. | Diff invariant + no new ADMIN_AUDIT Task-First UI |
| SC-8 | 390×844-class rendered verification (see §8). | Dedicated harness mobile viewport |
| A3 / FE-F002 | Proof must not depend on dedicated smoke-only `presentationRole: "PLANNER"` injection. | Dedicated harness sequence in §5.1 |
| A7 | FIELD_STAFF regression tests PASS | existing unit + FIELD_STAFF browser smoke |
| A8 | Existing PLANNER unit tests PASS | `planner-task-navigation.test.ts` |
| A9 | Existing PLANNER desktop smoke PASS | parent PLANNER smoke (injection allowed **only** as regression) |
| A12 | ADMIN_AUDIT Task-First not introduced | diff + SC-7 |

Primary Action under a known planner cycle may use a bounded synthetic cycle fixture. That fixture is validation context only.

---

## 8. Mobile acceptance

FE-F008 may be closed in the same validation cycle **as verification of the already implemented PLANNER Global once reachable**. It does not authorize a CSS redesign.

Viewport: 390×844-class.

Minimum checks after Demo PLANNER selection:

```text
role entrance is operable
今の工程 is visible
探す is visible
Primary Action is operable under bounded synthetic cycle context
labels retain meaning (wrap allowed; meaning not lost)
no material horizontal overflow
Task-First targets remain usable (existing 44px-class controls)
```

If existing PLANNER Global fails mobile checks after role-binding only:

```text
HOLD for FE-F008 closure
Do not expand this unit into CSS / card / chrome redesign
Record evidence; later unit if needed
```

---

## 9. Regression requirements

Implementation (when separately authorized) MUST keep:

```text
FIELD_STAFF Task-First navigation
FIELD_STAFF CORR-1F semantics (except the bounded Demo role-entrance unhide)
FIELD_STAFF CORR-1G semantics
existing PLANNER task-navigation tests
existing PLANNER desktop smoke (injection path remains regression)
existing FIELD_STAFF browser smoke
SPFx build / Product artifact verification as applicable
  (npx heft test --clean; production package-solution when the
   implementation PR changes Product runtime — not this docs PR)
root verify:ci / typecheck / lint / check:contracts-boundaries / check:scope / check:a11y
  as applicable to the implementation PR
```

Do not reopen previously locked semantics. Do not treat dedicated-harness PASS as PL-HTA PASS.

---

## 10. Scope invariants

```text
I-1  Product IN files are exactly the three paths in §4.
I-2  Verification IN files are exactly the dedicated harness + REQUIRED workflow in §5.
I-3  Global 探す = D-FIND-PERSON; never D-FIND-RECORD.
I-4  PLANNER first Destination after Demo selection = D-HOME.
I-5  FE-F002 proof = Demo entrance sequence; injection is not the proof.
I-6  presentationRole remains synthetic Demo presentation.
I-7  ADMIN_AUDIT Task-First leftover is preserved, not completed.
I-8  CORR-1F / CORR-1G Destination / session / person-context semantics stay frozen.
I-9  Unhide is limited to demo-presentation-role-entry.
I-10 Locked packets f0aa82f6… and 4c80f67e… are not rewritten.
I-11 This Scope does not consume Human Scope Lock or Implementation Start.
```

HOLD (implementation-time; not consumed now):

| ID | HOLD | Disposition |
|---|---|---|
| H-1 | Locked this-unit packet blob ≠ `f0aa82f6…` | Stop; recover Definition lineage |
| H-2 | Issue #669 body sha256 ≠ `ab115485…` | Stop; Re-freeze / Re-Review |
| H-3 | Parent TOP-LEVEL-IA packet blob ≠ `4c80f67e…` | Stop; re-bind |
| H-4 | Product file outside §4 required | STOP = SCOPE EXPANSION REQUIRED |
| H-5 | Verification file outside §5 required | STOP = SCOPE EXPANSION REQUIRED |
| H-6 | Locked behavior needs `ScaffoldShellWebPart.ts` or `IScaffoldShellProps.ts` change | STOP = SCOPE EXPANSION REQUIRED (explain why first) |
| H-7 | `DemoPresentationRoleEntry.tsx` contract insufficient | STOP = SCOPE EXPANSION REQUIRED |
| H-8 | `planner-task-navigation.ts` Destination change required | STOP = DEFINITION CONFLICT |
| H-9 | Implementation base lacks durable locked packet + Lock + Review evidence | Stop; bind lineage before Implementation Start |
| H-10 | Mobile failure used to authorize CSS / card redesign | Stop; FE-F008 HOLD; do not expand |
| H-11 | ADMIN_AUDIT Task-First or FE-F001 / FE-F003 claimed | Stop |
| H-12 | Global 探す mapped to D-FIND-RECORD | Stop; locked violation |
| H-13 | Architecture redesign of AppShellChrome beyond minimum role-change contract | Stop |

If repository reality requires behavior outside the locked Definition: **STOP = DEFINITION CONFLICT**.

---

## 11. Forbidden changes

```text
ADMIN_AUDIT Task-First implementation
FE-F001
FE-F003
AA-HTA
FS-HTA-2
whole-app UI-REVIEW-8 closure
production deployment
SharePoint catalog mutation
LIVE WRITE
SharePoint data mutation
M365 mutation
Entra mutation
authorization semantics change
schema change
persistence change
business-rule change
new PLANNER Destination
card redesign
form redesign
deep workflow rewrite
Global 探す → D-FIND-RECORD
CORR-1F reopen (beyond bounded Demo role-entrance unhide)
CORR-1G reopen
locked packet rewrite
Product / Demo presentationRole Product prop expansion
smoke injection as FE-F002 proof
Product-visible cycle selector
Issue #669 mutation / close
Human Scope Lock consumption by this record
Implementation Start / Ready / Merge / Deploy consumption by this record
```

---

## 12. Scope review questions

| ID | Question |
|---|---|
| Q1 | Does this Scope stay inside entrance / role-binding (RB-A..J) without Destination redesign? |
| Q2 | Are Product IN files closed under §4 (exactly three paths) with evidence-based OUT for WebPart / props / Demo entry / navigation modules? |
| Q3 | Is the AppShellChrome change limited to a minimum parent/child role-change contract (no architecture redesign)? |
| Q4 | Is CSS IN limited to Demo role-entrance visibility / bounded layout, without unhiding SHELL-UX-7? |
| Q5 | Does dedicated smoke prove FIELD_STAFF → PLANNER → FIELD_STAFF via Demo entrance without `presentationRole: "PLANNER"` injection? |
| Q6 | Is the dedicated GitHub workflow REQUIRED by current CI pattern (not preference)? |
| Q7 | Are SC-1..SC-8 equivalent to locked A1–A12 plus mobile P2-1 verification? |
| Q8 | Is ADMIN_AUDIT leftover explicitly preserved (FE-F001 / FE-F003 OUT)? |
| Q9 | Are CORR-1F / CORR-1G unreopened except the bounded Demo entrance unhide? |
| Q10 | Does this record avoid consuming Human Scope Lock / Implementation Start / Ready / Merge / Deploy? |
| Q11 | Is Global 探す uniquely D-FIND-PERSON and explicitly not D-FIND-RECORD? |
| Q12 | If any extra Product file is required, does the Scope fail closed (H-4 / H-6) instead of silent expansion? |

---

## 13. Gate state

```text
Independent Definition Review-1     = PASS / REVIEW-CLEARED / CONSUMED
Human Definition Lock               = RECEIVED / CONSUMED (Lock record; not this file)
Exact Scope Definition-1            = AUTHORED / AWAITING FRESH INDEPENDENT SCOPE REVIEW
Human Scope Lock Eligibility        = NOT YET
  (Exact Scope body now exists; Eligibility requires Independent Scope Review PASS)
Human Scope Lock                    = NOT ELIGIBLE / NOT CONSUMED
Combined Definition / Scope Lock    = NOT CONSUMABLE / NOT CONSUMED
Implementation Start                = NOT AUTHORIZED
Ready / Merge / Deploy              = NOT AUTHORIZED
LIVE WRITE / SharePoint / M365 / Entra = NOT AUTHORIZED
Issue #669 close                    = NOT AUTHORIZED
PL-HTA                              = NOT THIS GATE
```

```text
PASS CONDITION for later Independent Scope Review
  = P0 0 and P1 0 on the Scope body
P2 = non-blocking / carry-forward only
```

Independent Scope Review PASS ≠ Human Scope Lock ≠ Implementation Start.

---

## 14. NEXT

```text
NEXT = Fresh Independent Scope Review
       against this Exact Scope body only

NOT NEXT
= Human Scope Lock
= Implementation Start
= Product implementation
= Ready
= Merge
= Deploy
= Issue #669 mutation
= locked packet rewrite
= ADMIN_AUDIT Task-First
= FE-F001 / FE-F003 closure claim
```

```text
STOP = Exact Scope authored
     = self-verification complete
     = no Product mutation
     = no Human Scope Lock consumed
     = no Implementation Start consumed
     = no Ready / Merge / Deploy consumed
```
