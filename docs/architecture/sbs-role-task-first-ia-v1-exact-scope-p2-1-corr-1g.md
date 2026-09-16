# SBS-ROLE-TASK-FIRST-IA-V1 — Exact Scope Definition (P2-1 / provisional CORR-1G)

Implementation Scope Scout and Exact Scope Definition for the Human-dispositioned **NEXT PRODUCT TRANCHE** residual P2-1 after CORR-1F COMPLETE / ARCHIVED.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: CORR-1G (PROVISIONAL name — Human Definition Lock required)
kind: Exact Scope Definition / Implementation Scope Scout
status: DRAFT — awaiting Fresh Independent Definition Review
date: 2026-09-16

Reviewed main at Kickoff: 40659c5b459548cc59803562122fdffd77fc0a23
CORR-1F: COMPLETE / ARCHIVED PRESERVED
Parent Carry-Forward Disposition GO: CONSUMED / LOCKED
  record blob: f242a28d8b43980ab349a0b57090ce6065dd1863
P2-1 disposition: NEXT PRODUCT TRANCHE
P2-2 / P2-3: SEPARATE (OUT of this Scope)
PLANNER / ADMIN_AUDIT Global: SEPARATE WORKSTREAM (OUT / fail-closed preserved)

Parent locked Definition (Correction-2):
  path: docs/architecture/sbs-role-task-first-ia-v1-correction-2-complete-controlled-packet.md
  blob: 5eeb8140772ebfefe050cff93361a6d81c470f81
CORR-1F Exact Scope (historical; not reopened):
  path: docs/architecture/sbs-role-task-first-ia-v1-implementation-scope-corr-1f.md
  blob: c3c6bd645b51e532227cba162b6a9eca81ee484c
CORR-1F Review-2 P2-1 finding:
  path: docs/architecture/sbs-role-task-first-ia-v1-corr-1f-independent-implementation-review-2.md
  blob: 699b132e930dfe5fc9bb9b32064a3c8c4451d2c3

Human P2-1 Exact Scope Definition Kickoff GO: RECEIVED / CONSUMED (2026-09-16)
Fresh Independent Definition Review: NOT STARTED / NOT AUTHORIZED by this document
Human Definition Lock: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
CORR-1F reopen: NOT AUTHORIZED
New unit ID finalization: PROVISIONAL only until Human Definition Lock
```

Creating or reviewing this Exact Scope does **not** authorize Product mutation, does **not** consume Human Definition Lock, and does **not** authorize Implementation Start.

```text
Kickoff GO ≠ Definition Review PASS ≠ Human Definition Lock ≠ Implementation Start
```

---

## Verdict (authoring)

```text
RESULT: Exact Scope Definition DRAFT authored for P2-1
Provisional unit: CORR-1G
Product surface: FIELD_STAFF sessionContext unfreeze / sufficient-path Product reachability
PLANNER / ADMIN_AUDIT Global: OUT
P2-2 / P2-3: OUT
Implementation Start: NOT AUTHORIZED
NEXT: Fresh Independent Definition Review
```

---

## 1. Scout summary (main @ 40659c5b)

### 1.1 Locked residual problem (P2-1)

```text
ScaffoldShell freezes sessionContext at
  { hasSupportObject: false, hasOccurrenceContext: false }
with no Product path to update it.

CORR-2A sufficient Destinations:
  手順 → D-PROCEDURE (when support object exists)
  記録する → D-RECORD-WRITE (when occurrence / procedure context exists)

are unit-proven only and unreachable from Product UI.
```

Product tip anchors:

```text
ScaffoldShell.tsx blob: 1c4dfd8358a5a3845a2ac0a9d85d37475bf3775a
field-staff-task-navigation.ts blob: 2864497120d2a7fe7b5eb02f386115c160b56280
```

### 1.2 Observed Product state

| Area | Observation | This Scope impact |
|---|---|---|
| Task-First Global / Destination resolve | `field-staff-task-navigation.ts` already implements sufficient vs fallback rules | **Keep resolve rules**; do not rewrite CORR-2A identities |
| Product sessionContext owner | `ScaffoldShell.tsx` initializes frozen false/false; no setter | **Primary mutation surface** |
| Unit sufficient-path | `field-staff-task-navigation.test.ts` proves fullContext → D-PROCEDURE / D-RECORD-WRITE | Retain; extend only if acquisition helpers add cases |
| Browser smoke | proves fallback only (`procedure-fallback`, `record-write-fallback`); no sufficient-path paint | May extend under §6 to prove Product-reachable sufficient paths |
| Legacy selection | `AppShellChrome` holds `selectedOccurrenceId` / `selectedUserDetailId` locally; does not notify Task-First layer | Narrow bridge may be required (§3.2); no Global rewrite |
| PLANNER / ADMIN_AUDIT | unchanged SHELL-UX-7 surfaces; ScaffoldShell hardcodes FIELD_STAFF | **OUT / fail-closed** |

### 1.3 Scout verdict

P2-1 is a **FIELD_STAFF Product-depth** tranche. It does not reopen CORR-1F, does not claim three-Role completion, and does not absorb P2-2 / P2-3 / PLANNER·ADMIN_AUDIT Global.

Provisional unit name **CORR-1G** = FIELD_STAFF sessionContext / sufficient-path Product reachability. Final unit name is a **Human Definition Lock** decision (rename allowed; CORR-2F / CORR-3F must not be used — those remain PLANNER / ADMIN_AUDIT placeholders).

---

## 2. Goal (CORR-1G / P2-1)

Prove the smallest Product change that makes a FIELD_STAFF usable session satisfy:

```text
C-1G-1  sessionContext is Product-owned and updateable (not permanently frozen false/false)
C-1G-2  When hasSupportObject=true, Global「手順」resolves to Destination identity D-PROCEDURE in Product UI
C-1G-3  When hasOccurrenceContext=true, Global「記録する」resolves to Destination identity D-RECORD-WRITE in Product UI
C-1G-4  Missing-context fallbacks remain CORR-2A normative:
          手順 → D-TODAY acquisition
          記録する → D-UNRECORDED
C-1G-5  Context flags become true only from CORR-2A-listed acquisition sources
          (Global items do not mint support objects or blank records)
C-1G-6  PLANNER / ADMIN_AUDIT Global / D-HOME semantics remain untouched (fail-closed)
```

This tranche does **not** claim PL-HTA / AA-HTA / full Role/Task IA V1 completion / SHELL-UX-7 retirement.

---

## 3. Exact authorized Product surface

Only the following Product runtime files may change behavior / presentation in CORR-1G:

```text
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.tsx
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.module.scss   (only if Task-First layer needs presentation for context/orientation; no marketing chrome)
spfx/src/shell/ux/field-staff-task-navigation.ts
  — pure helpers for immutable sessionContext apply/clear/derive ONLY
  — MUST NOT change Global→Destination identity table / fallback identities
spfx/src/shell/ux/index.ts                                                   (export wiring only)
spfx/src/shell/ux/AppShellChrome.tsx                                         (NARROW bridge only; see §3.2)
```

`primary-navigation.ts`, domain modules, SharePoint adapters, PLANNER/ADMIN_AUDIT presentation branches, and other shell destinations remain **OUT** unless a later Scope authorizes them.

### 3.1 sessionContext ownership (normative)

```text
1. FieldStaffSessionContext remains the CORR-2A boolean pair:
     hasSupportObject / hasOccurrenceContext
2. ScaffoldShell owns Product sessionContext state for FIELD_STAFF Task-First.
3. Initial state may remain false/false (missing context) at first paint.
4. A Product path MUST exist to set each flag true when CORR-2A acquisition sources are identified.
5. A Product path MUST exist to clear/reset flags when the identified object/occurrence context is lost (fail-closed; do not leave stale sufficient Destination).
6. Global「手順」/「記録する」MUST continue to call resolveFieldStaffTaskSelection with the current sessionContext.
7. Empty D-PROCEDURE / empty D-RECORD-WRITE remain forbidden Destination meanings (locked Definition standing rule).
```

### 3.2 AppShellChrome narrow bridge contract (normative)

`AppShellChrome.tsx` is authorized **only** for a narrow FIELD_STAFF session-context notification bridge so Task-First can observe already-identified adapter selections without inventing a second Global.

Mandatory:

```text
A. No change to SHELL-UX-7 Global labels / ids as Product V1 Global truth.
B. No PLANNER / ADMIN_AUDIT behavior or presentation change.
C. No primary-navigation.ts mutation.
D. Bridge may expose optional callbacks / read-only identity notifications for:
     - support object identified / cleared
     - occurrence / procedure context identified / cleared
   Mapping to hasSupportObject / hasOccurrenceContext is owned by ScaffoldShell / pure helpers.
E. Bridge MUST NOT mint domain records, enable LIVE WRITE, or alter persistence.
F. If satisfying AC-1G-* requires AppShellChrome changes beyond this bridge
   (layout rewrite, Global rewrite, cross-role behavior), CORR-1G MUST HOLD.
G. Adapter overview/users/records ids remain non-normative D-* identity (CORR-1F §3.2 A–D preserved).
```

### 3.3 CORR-2A acquisition sources (restatement only; no new semantics)

From locked Correction-2 §2.2 (blob `5eeb8140…`):

```text
current support object
  = person + support occurrence already in Role context
    (D-TODAY selection, D-PERSON, or in-progress procedure)
  Global「手順」does not mint that object.

current occurrence / procedure context
  = occurrence (and current procedure when relevant) already identified
    from D-PROCEDURE completion or from an unrecorded item
  Global「記録する」does not mint a blank record.
```

This Scope authorizes Product wiring of those existing meanings into `sessionContext`. It does **not** invent new Destination identities or new Global items.

### 3.4 Legacy adapter rule (unchanged identities)

CORR-1F adapter mapping remains:

```text
D-TODAY        → overview adapter
D-PROCEDURE    → users adapter when person context required
D-RECORD-WRITE → users adapter when occurrence context required
D-UNRECORDED   → users adapter (+ 未記録 filter when present)
D-FIND-PERSON  → users adapter
```

Product Destination identity exposed in FIELD_STAFF Task-First UI/state MUST remain the D-* id.

---

## 4. CORR-2A FIELD_STAFF binding (normative; unchanged)

| Global | Destination (context sufficient) | context不足時の意味 / fallback destination identity |
|---|---|---|
| 今日 | D-TODAY | N/A |
| 手順 | D-PROCEDURE (object exists) | **D-TODAY** acquisition; do not open empty D-PROCEDURE |
| 記録する | D-RECORD-WRITE (occurrence exists) | **D-UNRECORDED**; do not open empty D-RECORD-WRITE |
| 未記録 | D-UNRECORDED | N/A |
| 探す | D-FIND-PERSON | N/A |

Global order MUST remain: `今日 · 手順 · 記録する · 未記録 · 探す`.

---

## 5. CORR-2B FIELD_STAFF binding (unchanged)

```text
D-HOME identity = D-TODAY
First paint after usable session (missing context) = D-TODAY
No second Product place beside D-TODAY for this Role.
```

---

## 6. Verification surface (authorized)

Only the following CORR-1G-specific verification files may be added/changed for this tranche:

```text
spfx/src/shell/ux/field-staff-task-navigation.test.ts
spfx/smoke/sbs-role-task-first-ia-1/run-smoke.mjs
spfx/smoke/sbs-role-task-first-ia-1/smoke-entry.tsx
```

```text
OUT of this Scope verification mutation:
  spfx/smoke/sbs-role-task-first-ia-1/.gitignore          (P2-2 SEPARATE HYGIENE)
  .github/workflows/sbs-role-task-first-ia-1-browser-smoke.yml
    implementationHead / github.sha binding changes        (P2-3 SEPARATE VERIFICATION HYGIENE)
```

Workflow file may be touched **only** if required to run existing smoke entry without changing `implementationHead` binding semantics. Prefer zero workflow mutation. If workflow mutation beyond that is required → HOLD and amend Scope.

Verification must remain synthetic / presentation-bound. No LIVE I/O. No production data.

Existing gates must remain PASS where touched:

```text
npx heft test --clean (spfx)
existing a11y / format / lint / typecheck expectations for modified files
```

### 6.1 AC-1G verification mapping (normative)

| AC | Required evidence | Unit | Browser smoke |
|---|---|---|---|
| AC-1G-1 | sessionContext not permanently frozen; Product can set support-object true | helper/state tests as applicable | smoke acquires support object then observes context/orientation change |
| AC-1G-2 | 手順 + hasSupportObject → Destination identity **D-PROCEDURE** in Product UI | resolve table (existing) + Product wiring evidence | smoke paints/asserts `data-role-task-destination="D-PROCEDURE"` after acquisition |
| AC-1G-3 | 記録する + hasOccurrenceContext → Destination identity **D-RECORD-WRITE** in Product UI | resolve table (existing) + Product wiring evidence | smoke paints/asserts `data-role-task-destination="D-RECORD-WRITE"` after acquisition |
| AC-1G-4 | Missing object still → D-TODAY; missing occurrence still → D-UNRECORDED | existing AC-1F-3/4 unit cases remain PASS | existing fallback smokes remain PASS |
| AC-1G-5 | Global items do not mint object/record; flags only from §3.3 sources | diff/invariant + tests for apply helpers | smoke does not claim Global click alone creates domain object |
| AC-1G-6 | No PLANNER/ADMIN_AUDIT Global rewrite; FIELD_STAFF-only entry preserved | diff invariant on chrome role branches / ScaffoldShell presentationRole | smoke must not claim PL/AA V1 Global |
| AC-1G-7 | No domain/schema/persistence contract change | scope-diff invariant | smoke has no LIVE I/O |
| AC-1G-8 | Reproducible unit + browser evidence at exact implementation HEAD | unit PASS | smoke PASS (P2-3 binding hygiene remains OUT; do not “fix” HEAD binding here) |

---

## 7. Explicit OUT (CORR-1G)

```text
CORR-1F reopen / rewrite of COMPLETE / ARCHIVED authority
PLANNER Global (今の工程 · 探す) and Distinct D-HOME
ADMIN_AUDIT Global (運用確認 · 証跡 · 探す) and D-HOME alias D-OPS
Retiring SHELL-UX-7 Global rows globally in AppShellChrome
primary-navigation.ts mutation
P2-2 smoke .gitignore vs historical Scope §6 hygiene
P2-3 smoke implementationHead / github.sha verification binding hygiene
New Destinations (Search Hub, context-resolver place)
Domain / schema / persistence / SharePoint mutation
LIVE WRITE / Deploy / Entra / App Catalog
SHELL-UX-7 Decision ledger supersede record
Notion production mutation
Definition Open Questions (quiet 合成 badge; AA-T1 cadence; PLANNER cycle-③ Primary Action)
Human Task Acceptance sign-off expansion beyond this tranche’s AC map
Visual polish unrelated to sufficient-path Product reachability
unrelated refactor
```

---

## 8. Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1G-1 | Product sessionContext is updateable; not permanently frozen at false/false. |
| AC-1G-2 | With support object identified, Global「手順」resolves to **D-PROCEDURE** in Product UI (not merely unit table). |
| AC-1G-3 | With occurrence/procedure context identified, Global「記録する」resolves to **D-RECORD-WRITE** in Product UI. |
| AC-1G-4 | Missing-context fallbacks remain D-TODAY / D-UNRECORDED per §4; empty sufficient Destinations remain forbidden. |
| AC-1G-5 | Context flags derive only from §3.3 CORR-2A acquisition sources; Globals do not mint objects/records. |
| AC-1G-6 | PLANNER / ADMIN_AUDIT surfaces regress fail-closed; no accidental Global rewrite. |
| AC-1G-7 | No domain / schema / persistence contract change; no Product file outside §3. |
| AC-1G-8 | Reproducible unit + browser smoke evidence for sufficient-path Product reachability. |

---

## 9. HOLD conditions

| ID | HOLD condition | Required disposition |
|---|---|---|
| H-1 | Parent Disposition P2-1 is no longer NEXT PRODUCT TRANCHE | Stop; recover Human disposition |
| H-2 | Implementer must touch any Product runtime file outside §3 | Stop; amend Exact Scope; do not expand silently |
| H-3 | Implementer must change Global→Destination identities / fallbacks in `field-staff-task-navigation.ts` | Stop; Definition conflict; do not rewrite CORR-2A |
| H-4 | AppShellChrome changes exceed §3.2 narrow bridge | Stop; amend Scope or split tranche |
| H-5 | Satisfying AC requires PLANNER / ADMIN_AUDIT Global change | Stop; separate workstream |
| H-6 | Satisfying AC requires P2-2 / P2-3 mutation | Stop; keep hygiene separate |
| H-7 | Any work requires domain/schema/persistence/LIVE WRITE/Auth/Entra/Deploy | Stop; outside authority |
| H-8 | Provisional unit name CORR-1G is rejected and no replacement is locked | Stop at Human Definition Lock; do not Implement |
| H-9 | Fresh Independent Definition Review finds P0/P1 against this Scope | Stop; revise Scope before Lock / Implementation |

---

## 10. Fresh Independent Definition Review questions

| ID | Question |
|---|---|
| Q1 | Is this Scope limited to FIELD_STAFF P2-1 sessionContext / sufficient-path Product reachability? |
| Q2 | Are authorized Product files closed under §3 and verification files closed under §6? |
| Q3 | Does §3.3 / §4 restate locked Correction-2 CORR-2A without new Destination/Global semantics? |
| Q4 | Are AC-1G-2 / AC-1G-3 Product-UI reachability criteria unambiguous vs unit-only proof? |
| Q5 | Does §3.2 keep AppShellChrome to a narrow bridge without V1 Global dual-run? |
| Q6 | Are P2-2 / P2-3 / PLANNER·ADMIN_AUDIT explicitly OUT and non-absorbed? |
| Q7 | Are domain/schema/persistence/LIVE WRITE exclusions sufficient? |
| Q8 | Is CORR-1F COMPLETE / ARCHIVED preserved (no reopen)? |
| Q9 | Is provisional unit CORR-1G clearly non-final until Human Definition Lock? |
| Q10 | Does the gate chain forbid Implementation Start before Review + Lock + Implementation GO? |

---

## 11. Review gate

```text
PASS CONDITION = P0 0 = P1 0
P2 = non-blocking suggestions only
```

If P0 or P1 exists:

```text
Human Definition Lock eligibility = NOT ELIGIBLE
Implementation Start eligibility = NOT ELIGIBLE
```

A Definition Review PASS does not itself consume Human Definition Lock or Implementation Start.

---

## 12. Deferred / separate (not authorized here)

| Item | Disposition (parent-locked) |
|---|---|
| P2-2 smoke `.gitignore` hygiene | SEPARATE HYGIENE |
| P2-3 smoke `implementationHead` binding | SEPARATE VERIFICATION HYGIENE |
| PLANNER Global + Distinct D-HOME | SEPARATE WORKSTREAM (placeholder CORR-2F name TBD elsewhere) |
| ADMIN_AUDIT Global + D-HOME alias D-OPS | SEPARATE WORKSTREAM (placeholder CORR-3F name TBD elsewhere) |
| SHELL-UX-7 global retirement | later tranche; not this Scope |

---

## 13. Gate chain (this packet)

```text
CORR-1F COMPLETE / ARCHIVED                         PRESERVED
Parent Carry-Forward Disposition GO                  CONSUMED / LOCKED
P2-1 Exact Scope Definition Kickoff GO               RECEIVED / CONSUMED
Exact Scope Definition (this document)               DRAFT authored
Fresh Independent Definition Review                  NOT STARTED
Human Definition Lock                                NOT AUTHORIZED
Implementation Start                                 NOT AUTHORIZED
Product mutation                                     NOT AUTHORIZED
Deploy / LIVE WRITE                                  NOT AUTHORIZED
```

```text
ALLOWED NEXT:
  Fresh Independent Definition Review against this Exact Scope only

FORBIDDEN NOW:
  Human Definition Lock consumption by Agent
  Implementation Start / Product code mutation
  Absorbing P2-2 / P2-3 / PLANNER·ADMIN_AUDIT into this tranche
  Finalizing unit ID without Human Definition Lock
```

---

## 14. Proof boundary / non-claims

Passing AC-1G-1..8 proves only FIELD_STAFF sufficient-path Product reachability for this tranche.

```text
PLANNER CORR-2A/B = not proven
ADMIN_AUDIT CORR-2A/B = not proven
Global SHELL-UX-7 retirement = not proven
Full Role/Task IA completion = not proven
Human Task Acceptance PASS = not proven / not claimed by Scope authorship
P2-2 / P2-3 closure = not claimed
```

---

## 15. Authority boundary

```text
P2-1 Exact Scope Definition Kickoff GO = CONSUMED
Exact Scope Definition = DRAFT (this document)
Fresh Independent Definition Review = NEXT
Human Definition Lock = NOT AUTHORIZED
Implementation Start = NOT AUTHORIZED
Deploy / LIVE WRITE = NOT AUTHORIZED
Repository Product mutation by this document = 0
```

```text
STOP after Definition作成
     = await Fresh Independent Definition Review
     = no Implementation Start
     = no Human Definition Lock claim
     = no CORR-1F reopen
     = no PLANNER / ADMIN_AUDIT Global completion claim
     = no silent discard of P2-2 / P2-3
```
