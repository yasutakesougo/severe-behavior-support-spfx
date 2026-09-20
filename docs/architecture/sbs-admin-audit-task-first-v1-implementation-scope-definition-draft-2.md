# ADMIN-AUDIT-TASK-FIRST-V1 — Implementation Scope Definition Draft-2

Implementation Scope Definition Draft-2 for ADMIN-AUDIT-TASK-FIRST-V1.

This document is the first repository-visible exact Implementation Scope available for independent review.

```text
repository: yasutakesougo/severe-behavior-support-spfx
parent workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: ADMIN-AUDIT-TASK-FIRST-V1
kind: implementation scope definition draft-2
status: COMPLETE / AWAITING FRESH INDEPENDENT IMPLEMENTATION SCOPE RE-REVIEW-2
date: 2026-09-20
mode: DEFINITION / DOCS ONLY
Product / test / smoke mutation by this document: NONE

Current Main Basis
  = d19f85a58703e78788cfe852e37a0853fcd4c090

Prior described Draft-1
  = unavailable as repository evidence
  = not reconstructed

Earlier Draft-2 preparation
  = not established as repository-visible evidence

This Draft-2
  = first repository-visible exact Implementation Scope available for independent review

Locked Definition
  = PRESERVED

Definition Modification
  = NONE

Locked Definition Basis (parent; PRESERVED):
  docs/architecture/sbs-role-task-first-ia-v1-correction-2-complete-controlled-packet.md
  blob: 5eeb8140772ebfefe050cff93361a6d81c470f81

human-definition-lock.md:
  docs/architecture/sbs-role-task-first-ia-v1-correction-2-human-definition-lock.md
  blob: 794d227a1e69c709e679337be6478b32de81d74a

independent-definition-re-review-2.md:
  docs/architecture/sbs-role-task-first-ia-v1-correction-2-independent-definition-re-review-2.md
  blob: 72ee81ec92aea6c1558f25232961259504affab9

Human Definition Lock GO: RECEIVED / CONSUMED (parent packet)
Implementation Scope approval: NOT CONSUMED
Human Implementation Start GO: NOT AUTHORIZED
Human Scope Lock: NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
SHELL-UX-7 Decision ledger repeal: NOT AUTHORIZED
Notion production page update: NOT AUTHORIZED
AA-HTA PASS: NOT CLAIMED / NOT CONSUMED
```

Creating or reviewing this Draft-2 does **not** authorize Product mutation and does **not** consume Human Gates.

Independent Scope Re-Review PASS ≠ Human Scope Lock ≠ Human Implementation Start GO ≠ Ready ≠ Merge.

---

## 0. Provenance (normative for this correction cycle)

```text
Prior described Draft-1
  = unavailable as repository evidence
  = not locatable as a current-main or historical-main blob at this path
  = NOT REVIEWABLE
  = NOT A VALID REVIEW BASIS
  = not reconstructed

Earlier Draft-2 preparation
  = not established as repository-visible evidence
  = not a review basis
  = not claimed as a previously committed current-main artifact

This Draft-2
  = first repository-visible exact Implementation Scope available for independent review

Current Main Basis
  = d19f85a58703e78788cfe852e37a0853fcd4c090

Previous Required Main (historical only)
  = 35cf211aaef9d30975775b531947ac93283d6d5e

Previous Re-Review-1
  = HOLD / STOP
  = current-main mismatch + Draft-2 not repository-visible
  = historical trigger for this reconciliation only
  ≠ review basis for this body
  ≠ substitute for Fresh Independent Implementation Scope Re-Review-2

Locked Definition
  = PRESERVED

Definition Modification
  = NONE
```

This document does **not** retroactively claim that Draft-1 existed as repository evidence.

This document does **not** backdate or reconstruct Draft-1.

This document does **not** claim that an earlier Draft-2 body was committed to current main.

Draft-2 is the sole target of the next Fresh Independent Implementation Scope Re-Review-2.

This is a scope-document persistence / basis-refresh only.

```text
Locked Definition packet blob must remain 5eeb8140772ebfefe050cff93361a6d81c470f81
Human Definition Lock blob must remain 794d227a1e69c709e679337be6478b32de81d74a
Independent Definition Re-Review-2 blob must remain 72ee81ec92aea6c1558f25232961259504affab9
```

Verified on Current Main Basis `d19f85a58703e78788cfe852e37a0853fcd4c090`: those three blobs are identical to the same paths on historical `35cf211aaef9d30975775b531947ac93283d6d5e`.

---

## 1. Purpose

Prove the smallest Product change that makes an ADMIN_AUDIT usable session satisfy the locked parent ADMIN_AUDIT Task-First Global / Destination / identity contract:

```text
CORR-2A §2.4  ADMIN_AUDIT Global unique
              ordered: 運用確認 · 証跡 · 探す
              運用確認 → D-OPS
              証跡     → D-EVIDENCE
              探す     → D-FIND-PERSON

CORR-2B §3.4  D-HOME == D-OPS
              literal identity for ADMIN_AUDIT
              First paint = D-OPS
              Global「運用確認」= D-OPS
              no second Product / Home place

CORR-1A §7.3  SHELL-UX-7 概要 / 利用者 / 記録
              are NOT concurrent V1 Global
              dual-run = REJECTED as product target

C5 §7.1       ADMIN_AUDIT first paint = D-OPS
C6            今どこ / どこから / 何ができる / 次はどこ
              ADMIN_AUDIT: being on D-HOME and being on D-OPS
              are the same location identity
              Deep link restores role + Destination + object
              where supported, or fail-closes

C4 ADMIN_AUDIT Destinations used by this slice:
              D-OPS / D-EVIDENCE / D-FIND-PERSON
```

This slice closes FE-F001 (ADMIN_AUDIT chrome-local leftover) and FE-F003 (ADMIN_AUDIT dual-nav leftover) **only as far as the authorized file surface and acceptance set below**. It does **not** claim AA-HTA PASS, three-Role completion, or SHELL-UX-7 Decision ledger repeal.

---

## 2. Review basis (verified read-only on current main)

Verified on `main` @ `d19f85a58703e78788cfe852e37a0853fcd4c090` before writing this Draft-2.

Live main identity:

```text
refs/heads/main
  = d19f85a58703e78788cfe852e37a0853fcd4c090

parent 1
  = 35cf211aaef9d30975775b531947ac93283d6d5e

parent 2
  = b2bfe689db0bb3b1076700d002793a81ad2a61e2

subject
  = Merge pull request #688 from yasutakesougo/cursor/pl-hta-capture-07-docs-0375
```

Product / test / smoke / SPFx tree vs historical `35cf211aaef9d30975775b531947ac93283d6d5e`:

```text
diff --name-only 35cf211… d19f85a
  = docs/architecture/sbs-planner-pl-hta-correction-1-browser-smoke.md
```

That is a docs-only PLANNER smoke-matrix relabel. It does not change ADMIN_AUDIT Product architecture, Locked Definition blobs, or this-unit file surface.

| Basis | Exact repository path | Current blob / SHA |
|---|---|---|
| Current main | `origin/main` | commit `d19f85a58703e78788cfe852e37a0853fcd4c090` |
| Locked Definition Basis | `docs/architecture/sbs-role-task-first-ia-v1-correction-2-complete-controlled-packet.md` | `5eeb8140772ebfefe050cff93361a6d81c470f81` |
| Human Definition Lock | `docs/architecture/sbs-role-task-first-ia-v1-correction-2-human-definition-lock.md` | `794d227a1e69c709e679337be6478b32de81d74a` |
| Independent Definition Re-Review-2 | `docs/architecture/sbs-role-task-first-ia-v1-correction-2-independent-definition-re-review-2.md` | `72ee81ec92aea6c1558f25232961259504affab9` |
| This Draft-2 | `docs/architecture/sbs-admin-audit-task-first-v1-implementation-scope-definition-draft-2.md` | this body |

If the Locked Definition packet blob at that path is not `5eeb8140772ebfefe050cff93361a6d81c470f81`, this Scope does not apply.

Normative surface for **Definition meaning** remains the locked packet body. This Draft-2 is the normative surface for **this-unit implementation scope** only. It restates locked ADMIN_AUDIT bindings; it does not replace CORR-2A / CORR-2B tables.

---

## 3. Scout summary (main @ d19f85a58703e78788cfe852e37a0853fcd4c090)

### 3.1 Observed Product state (read-only)

| Area | Exact path | Observation | This-unit impact |
|---|---|---|---|
| Presentation vocabulary | `spfx/src/shell/ux/presentation-role.ts` | Defines `FIELD_STAFF` / `PLANNER` / `ADMIN_AUDIT` synthetic roles, hints, Overview/UserDetail/SupportPlan order helpers. No ADMIN_AUDIT Global / D-\* destination contract. | **Reuse read-only.** Destination/navigation ownership MUST NOT be added here. |
| Presentation vocabulary tests | `spfx/src/shell/ux/presentation-role.test.ts` | Vocabulary / order / fail-closed parse tests. | OUT of destination-contract tests. |
| SHELL-UX-7 Global vocabulary | `spfx/src/shell/ux/primary-navigation.ts` | Locked labels `概要 / 利用者 / 記録` (`overview / users / records`). | Adapter ids only. Do not globally remove or rewrite. |
| App shell chrome | `spfx/src/shell/ux/AppShellChrome.tsx` | Unconditionally renders `SHELL_PRIMARY_NAV_ITEMS` as Global nav for **all** roles. `onPresentationRoleChange` notifies parent only for `FIELD_STAFF \| PLANNER`. ADMIN_AUDIT stays chrome-local (FE-F001 leftover). No dedicated AppShellChrome test file exists. | **REQUIRED.** ADMIN_AUDIT-only not-render of legacy Global. Parent notify must include ADMIN_AUDIT. |
| FIELD_STAFF Task-First | `spfx/src/shell/ux/field-staff-task-navigation.ts` + `.test.ts` | Dedicated navigation contract. `FIELD_STAFF_HOME_DESTINATION = "D-TODAY"`. ScaffoldShell imports this file by exact path. | Regression-only. OUT of rewrite. |
| PLANNER Task-First | `spfx/src/shell/ux/planner-task-navigation.ts` + `.test.ts` | Dedicated navigation contract. Distinct `D-HOME`. ScaffoldShell imports this file by exact path. | Regression-only. OUT of rewrite. Pattern source for ADMIN_AUDIT module. |
| ADMIN_AUDIT Task-First module | *(absent)* | No `admin-audit-task-navigation.ts`. | **REQUIRED new module.** |
| Product entry | `spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.tsx` | `ScaffoldShellState = FieldStaffShellState \| PlannerShellState` only. `createInitialState()`: `PLANNER` branch, else FIELD_STAFF. ADMIN_AUDIT injection falls through to FIELD_STAFF Task-First. Imports AppShellChrome from the ux barrel and both Role navigation modules by exact path. No dedicated ScaffoldShell test file exists. | **REQUIRED.** Explicit `AdminAuditShellState` + ADMIN_AUDIT render branch. |
| Task-First styles | `spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.module.scss` | Role-agnostic Task-First classes already exist (`.taskHeading`, `.taskNavigation`, `.taskButton`, `.contextHint`, `.srOnly`). CSS-hides SHELL-UX-7 primary-navigation for `FIELD_STAFF` and `PLANNER` only. ADMIN_AUDIT is not in that selector. | **REMOVE FROM AUTHORIZATION.** Reuse existing classes from `ScaffoldShell.tsx` without mutating this file. CSS hide MUST NOT become the ADMIN_AUDIT uniqueness mechanism. |
| Export barrel | `spfx/src/shell/ux/index.ts` | Exports FIELD_STAFF + PLANNER task-navigation. Product entry and AppShellChrome import those modules by exact path, not via the barrel. | **REMOVE FROM AUTHORIZATION.** Exact-path import is the current-main pattern and is sufficient. |
| Demo role entry | `spfx/src/shell/ux/DemoPresentationRoleEntry.tsx` | Already lists all three presentation roles. | OUT of mutation. Notify widening lives in AppShellChrome + ScaffoldShell. |
| Web part props | `spfx/src/webparts/scaffoldShellWebPart/components/IScaffoldShellProps.ts` | Product props only. PLANNER/ADMIN_AUDIT smoke injection is extra-interface (existing pattern). | OUT. Keep smoke/test injection off this interface. |
| Fixture helper | `spfx/src/shell/ux/fixture.ts` | `DEMO_1_FIELD_STAFF_FIXTURE` reused by PLANNER smoke for site/demo fields. | OUT. Reuse as-is. No new fixture file unless HOLD. |
| Existing ADMIN smoke | `spfx/smoke/admin-demo-ux-polish-1/run-smoke.mjs` | ADMIN-DEMO-UX-POLISH-1 synthetic polish smoke. Not ADMIN-AUDIT-TASK-FIRST-V1 evidence. | Insufficient. Dedicated smoke required. Do not repurpose. |
| FIELD_STAFF smoke | `spfx/smoke/sbs-role-task-first-ia-1/` | Labels / order / uniqueness / 390×844. Dedicated workflow exists. | Regression evidence for FIELD_STAFF. Do not rewrite. |
| PLANNER smoke | `spfx/smoke/sbs-planner-top-level-ia-v1/` | Labels / order / uniqueness. Dedicated workflow exists. | Regression evidence for PLANNER. Do not rewrite. |
| Sibling smoke CI | `.github/workflows/sbs-planner-top-level-ia-v1-browser-smoke.yml` and sibling Task-First workflows | Path-filtered. Exact PR head checkout + Noto CJK in the planner-top-level pattern. Existing workflows will not execute a new smoke directory. | Dedicated ADMIN_AUDIT workflow is **REQUIRED** if this-unit smoke must run in GitHub Actions. |

### 3.2 Scout verdict

CORR-1F / CORR-1G proved FIELD_STAFF Task-First. SBS-PLANNER-TOP-LEVEL-IA-V1 proved PLANNER Task-First. ADMIN_AUDIT Task-First remains unproven:

```text
ADMIN_AUDIT Global 運用確認 · 証跡 · 探す     = ABSENT as Product Global
D-HOME == D-OPS literal identity            = ABSENT
AppShellChrome legacy Global                = RENDERED for ADMIN_AUDIT
ScaffoldShell ADMIN_AUDIT branch            = ABSENT (falls through to FIELD_STAFF)
FE-F001 chrome-local leftover               = PRESENT
FE-F003 dual-nav leftover                   = PRESENT
admin-demo-ux-polish-1 smoke                = NOT this-unit evidence
```

This unit introduces an ADMIN_AUDIT Task-First layer parallel to FIELD_STAFF / PLANNER, scoped to locked CORR-2A §2.4 + CORR-2B §3.4 + the acceptance set in §9. It does **not** rewrite locked CORR-2A/B tables, reopen CORR-1F/1G, rewrite PLANNER Task-First, globally retire SHELL-UX-7 rows, or consume AA-HTA.

Current-main evidence does **not** require mutating `ScaffoldShell.module.scss` or `spfx/src/shell/ux/index.ts` to meet AC-AA-TF-1..23. If later implementation cannot satisfy those ACs without either file: **STOP** (H-3 / H-14). Do not add them silently.

---

## 4. Requirement ownership in this Draft-2

These IDs are this-document requirement labels. They are **not** a reconstruction of an unavailable Draft-1 and are **not** a claim that a prior scope-review artifact exists on current main.

| ID | Required correction | Draft-2 location |
|---|---|---|
| **R-AA-1** ADMIN_AUDIT navigation contract ownership | Dedicated `admin-audit-task-navigation.ts` following FIELD_STAFF / PLANNER. Do not place destination semantics in `presentation-role.ts`. | §5.1, §6, §7.1 |
| **R-AA-2** legacy Global suppression | ADMIN_AUDIT-only: legacy Global **NOT RENDERED**. Task-First Global = single active Global. FIELD_STAFF / PLANNER regression unchanged. FE-F003 uniqueness directly testable. | §5.2, §7.2, AC-AA-TF-13/14/15/16 |
| **R-AA-3** ScaffoldShell ADMIN_AUDIT state | Explicit `AdminAuditShellState`. First paint `D-OPS`. `D-HOME == D-OPS` literal identity. Parent preserves first paint / navigation / role switch / restoration / deep link / fail-closed. | §5.3, §6.2, §6.4, AC-AA-TF-6..12 |
| **R-AA-4** dedicated ADMIN_AUDIT smoke | Dedicated smoke surface. Smoke PASS ≠ AA-HTA PASS. No FS/PL regression claim beyond gathered evidence. | §7.3, §10, AC-AA-TF-21/22/23 |
| **R-AA-5** acceptance set | Every listed requirement independently verifiable. | §9 (AC-AA-TF-1..23) + §10 mapping |

---

## 5. Architectural ownership (normative)

### 5.1 Dedicated ADMIN_AUDIT navigation module (R-AA-1)

Exact new Product module:

```text
spfx/src/shell/ux/admin-audit-task-navigation.ts
spfx/src/shell/ux/admin-audit-task-navigation.test.ts
```

Follow the established FIELD_STAFF / PLANNER pattern:

| Role | Contract module (current main) |
|---|---|
| FIELD_STAFF | `spfx/src/shell/ux/field-staff-task-navigation.ts` |
| PLANNER | `spfx/src/shell/ux/planner-task-navigation.ts` |
| ADMIN_AUDIT | `spfx/src/shell/ux/admin-audit-task-navigation.ts` (this unit) |

Responsibilities of `admin-audit-task-navigation.ts` — **only** the ADMIN_AUDIT Task-First presentation/navigation contract needed by the Locked Definition:

```text
1. Global item ordering (normative): 運用確認 · 証跡 · 探す
2. Global labels (exact strings above)
3. Destination resolution
4. C6 headings for Destinations in this slice
5. ADMIN_AUDIT adapter / navigation mapping (SHELL-UX-7 ids as transport only)
6. AdminAudit shell/session state shape + lawful session events
7. Literal D-HOME identity = D-OPS
8. Fail-closed restoration helpers for unsupported / invalid payloads
```

Required Global items and destination identities:

| Global label (order) | Global id (implementer-chosen, unique) | Destination when context sufficient | context不足時の意味 |
|---|---|---|---|
| 運用確認 | `GLOBAL-OPS` | `D-OPS` | Context is not required. D-OPS is the ops object list. |
| 証跡 | `GLOBAL-EVIDENCE` | `D-EVIDENCE` | Context is not required. D-EVIDENCE is the evidence index. Do not open a specific record until an object is chosen there or from D-PERSON (D-PERSON is OUT of this slice). |
| 探す | `GLOBAL-FIND-PERSON` | `D-FIND-PERSON` | Context is not required. D-FIND-RECORD is not this item. |

Global ids may use the tokens above. Labels and Destination identities may not.

```text
REJECTED in this module:
  destination semantics in presentation-role.ts
  presentation role treated as authorization role
  Approve / Publish / Deploy / Delete / LIVE WRITE authority
  Global 探す → D-FIND-RECORD
  second Product place named D-HOME beside D-OPS
  D-HOME "resolves to" D-OPS (weakened alias)
```

### 5.2 ADMIN_AUDIT-only legacy Global suppression (R-AA-2)

Current `AppShellChrome.tsx` renders legacy Global for all roles:

```text
概要
利用者
記録
```

from `SHELL_PRIMARY_NAV_ITEMS` at `spfx/src/shell/ux/primary-navigation.ts`.

Required behavior when **effective presentation role is ADMIN_AUDIT**:

```text
legacy Global navigation (data-shell-ux="primary-navigation")
  = NOT RENDERED
  ≠ CSS display:none of a still-mounted nav
  ≠ hidden attribute on a still-mounted nav that remains the Global

ADMIN_AUDIT Task-First Global navigation
  = SINGLE ACTIVE GLOBAL NAVIGATION
```

Directly testable FE-F003 uniqueness:

```text
PASS uniqueness
  = [data-shell-ux="primary-navigation"] is absent from the ADMIN_AUDIT Product tree
  AND exactly one Task-First Global nav is present
      ([data-role-task-ia="ADMIN_AUDIT"] nav with the three Global items)
  AND those three labels are the only Global labels

FAIL uniqueness
  = legacy nav present in DOM (even if CSS-hidden)
  OR two Global navs visible/active
  OR Task-First labels plus 概要 / 利用者 / 記録 as Global
```

FIELD_STAFF / PLANNER:

```text
existing behavior = REGRESSION UNCHANGED
current uniqueness mechanism (CSS hide in ScaffoldShell.module.scss)
  remains theirs; this unit does not globally rewrite it
Do not remove or reorder SHELL_PRIMARY_NAV_ITEMS for other roles
```

### 5.3 ScaffoldShell ADMIN_AUDIT state ownership (R-AA-3)

Current `ScaffoldShellState` has no ADMIN_AUDIT branch. Non-PLANNER falls through to FIELD_STAFF.

Required:

```text
type ScaffoldShellState
  = FieldStaffShellState
  | PlannerShellState
  | AdminAuditShellState
```

`AdminAuditShellState` owns the ADMIN_AUDIT destination state required for Task-First behavior:

```text
role: "ADMIN_AUDIT"
destination: AdminAuditTaskDestinationId   // D-OPS | D-EVIDENCE | D-FIND-PERSON
activeGlobalId
shellDestination                           // adapter transport only
plus any restore/fail-closed flags this slice needs
```

First paint:

```text
ADMIN_AUDIT usable session
  → D-OPS
  → Global 運用確認 selected
  → C6 heading 運用確認
```

Literal alias invariant:

```text
D-HOME == D-OPS
```

This is **literal identity** for ADMIN_AUDIT.

```text
REQUIRED:
  ADMIN_AUDIT_HOME_DESTINATION = "D-OPS"
  AdminAuditTaskDestinationId does not contain a separate "D-HOME" member
  C6 location identity of D-OPS = 運用確認
  being on D-HOME and being on D-OPS are the same location identity
  restore token "D-HOME" for ADMIN_AUDIT is the same identity as "D-OPS"
    (same place, same heading; not a different Product Home)

FORBIDDEN:
  D-HOME resolves to D-OPS
  a second Product / Home place
  storing both D-HOME and D-OPS as distinct destination ids
```

The parent shell (`ScaffoldShell`) must preserve enough state to support:

| Concern | Required semantics |
|---|---|
| First paint | ADMIN_AUDIT → D-OPS |
| Navigation | Global clicks resolve uniquely per §5.1 |
| Role switch into ADMIN_AUDIT | Parent is notified (FE-F001 close). Land D-OPS first paint. Do not leave FIELD_STAFF Task-First running under an ADMIN_AUDIT chrome role. |
| Role switch away from ADMIN_AUDIT | Restore FIELD_STAFF or PLANNER existing first-paint / existing Task-First layer. Do not keep ADMIN_AUDIT Global as a second nav. |
| Restoration / deep link | Restore role + Destination + object **where supported by this slice**. Supported Destinations = `D-OPS` / `D-EVIDENCE` / `D-FIND-PERSON`. Token `D-HOME` = `D-OPS` identity. |
| Fail-closed | Unsupported or invalid restoration does not mint the requested place and does not guess D-OPS as a successful restore of that place. Recovery copy only. |

`AppShellChrome` `onPresentationRoleChange` must notify the parent for ADMIN_AUDIT (currently typed `FIELD_STAFF | PLANNER` only). DemoPresentationRoleEntry already emits all three roles and is not rewritten.

---

## 6. Locked bindings restated for implementers (not a Definition rewrite)

### 6.1 CORR-2A ADMIN_AUDIT Global

Global order MUST remain: `運用確認 · 証跡 · 探す`.

Each item maps to exactly one Destination. Implementers do not pick leftovers.

`D-FIND-RECORD` remains in-flow only and is **OUT** of this slice’s Product Destination enum. Global 探す MUST NOT bind it.

### 6.2 CORR-2B / C6

```text
D-HOME identity = D-OPS
Location identity (C6) = 運用確認
Purpose = AA-T1
Primary information = 未記録・要確認・運用の穴
Primary action = 対象へ辿る
First paint = D-OPS
Global「運用確認」= D-OPS
There is no second Product place named 「今日 / 今やること」 beside D-OPS
```

C6 headings unique for this slice:

| Destination | Location identity (C6 今どこ) |
|---|---|
| D-OPS (D-HOME identity) | 運用確認 |
| D-EVIDENCE | 証跡 |
| D-FIND-PERSON | 利用者を探す |

Generic shared heading REJECTED.

### 6.3 Adapter transport (never identity)

SHELL-UX-7 ids remain implementation adapters behind already-resolved D-\* identity:

```text
D-OPS         → overview adapter
D-EVIDENCE    → records adapter
D-FIND-PERSON → users adapter
```

Rules:

```text
1. Product Destination identity in ADMIN_AUDIT Task-First UI/state MUST remain the D-* id.
2. overview / users / records MUST NOT become V1 Destination identity or acceptance evidence by themselves.
3. Adapter presence MUST NOT reintroduce legacy Global labels as V1 Global.
4. D-OPS does not grant approval authority.
5. D-EVIDENCE does not imply evidence acceptance.
6. Task-First UI does not grant publish / deploy / delete / LIVE WRITE authority.
```

### 6.4 Restoration / deep link / fail-closed

There is no Product router. Restoration is owned by the ADMIN_AUDIT Task-First layer (module + ScaffoldShell), the same way PLANNER cycle injection is owned by `planner-task-navigation` + ScaffoldShell smoke injection.

Supported restore tuples for this slice:

```text
role = ADMIN_AUDIT
Destination = D-OPS | D-EVIDENCE | D-FIND-PERSON | D-HOME
object = none required for these Global Destinations
```

```text
D-HOME restore for ADMIN_AUDIT
  = D-OPS identity
  ≠ resolve-from-home-to-ops
  ≠ a second restored place
```

Unsupported / invalid (fail-closed; not exhaustive of future slices, exact for this slice):

```text
unknown role token that is not a presentation role
  → existing parseShellPresentationRole fail-closed (FIELD_STAFF). Do not change presentation-role.ts.
unknown / unsupported Destination (including D-AUDIT, D-PERSON, D-FIND-RECORD, D-RECORD-READ, invented ids)
  → do not mint that Destination
  → do not claim successful restore to D-OPS as that Destination
  → fail-closed recovery copy
malformed object payload where this slice does not support object restore
  → fail-closed; do not invent D-PERSON / record context
```

Smoke/test may inject restore tuples through the ADMIN_AUDIT Task-First module API / extra-interface smoke injection only (same pattern as PLANNER `presentationRole` / `initialPlannerCycle` on ScaffoldShell). Do not add restore fields to `IScaffoldShellProps`.

### 6.5 Authority boundary (presentation ≠ authorization)

```text
ADMIN_AUDIT is a presentation Role
≠ authorization Role
≠ Entra / DEC-014 identity
≠ approval authority
≠ evidence-acceptance authority
≠ publish / deploy / delete / LIVE WRITE
```

`presentation-role.ts` remains the synthetic presentation vocabulary. This slice reuses `ADMIN_AUDIT` / `isAdminAuditPresentationRole` / `parseShellPresentationRole` read-only.

---

## 7. Exact authorized file surface

Classification uses current-main evidence at `d19f85a58703e78788cfe852e37a0853fcd4c090`.

| Path | Class | Reason |
|---|---|---|
| `spfx/src/shell/ux/admin-audit-task-navigation.ts` | **REQUIRED** (new) | Dedicated ADMIN_AUDIT destination / Global contract. |
| `spfx/src/shell/ux/AppShellChrome.tsx` | **REQUIRED** | ADMIN_AUDIT-only legacy Global not-render + parent notify for ADMIN_AUDIT. |
| `spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.tsx` | **REQUIRED** | `AdminAuditShellState`, first paint, role switch, restoration. |
| `spfx/src/shell/ux/admin-audit-task-navigation.test.ts` | **REQUIRED** (new) | Contract tests for labels / order / destinations / literal alias / fail-closed. |
| `spfx/src/shell/ux/AppShellChrome.test.tsx` | **REQUIRED** (new) | No current-main chrome test file. AC-AA-TF-13/14/15/16 chrome uniqueness. Follow `spfx/src/shell/users/ManagementHome.test.tsx` `renderToStaticMarkup` convention. |
| `spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.test.tsx` | **REQUIRED** (new) | No current-main ScaffoldShell test file. First paint / role switch / restore / fail-closed. |
| `spfx/smoke/sbs-admin-audit-task-first-v1/run-smoke.mjs` | **REQUIRED** (new) | Exact dedicated smoke invocation. |
| `spfx/smoke/sbs-admin-audit-task-first-v1/smoke-entry.tsx` | **REQUIRED** (new) | Synthetic ADMIN_AUDIT entry. |
| `spfx/smoke/sbs-admin-audit-task-first-v1/.gitignore` | **REQUIRED** (new) | Same generated-file ignore as `sbs-role-task-first-ia-1` / `sbs-planner-pl-hta-correction-1`. |
| `.github/workflows/sbs-admin-audit-task-first-v1-browser-smoke.yml` | **REQUIRED** (new) | Existing Task-First workflows are path-filtered and will not run a new directory. Follow planner-top-level exact-head + Noto CJK pattern. |
| `spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.module.scss` | **OPTIONAL / REMOVE FROM AUTHORIZATION** | Existing role-agnostic Task-First classes can be reused from `ScaffoldShell.tsx`. Uniqueness is AppShellChrome not-render, not CSS hide. Leftover chrome hides are not required by AC-AA-TF-1..23. |
| `spfx/src/shell/ux/index.ts` | **OPTIONAL / REMOVE FROM AUTHORIZATION** | Current-main Product entry imports Role navigation modules by exact path. Barrel export is not required to satisfy the ACs. |
| Any other Product / test / smoke / workflow path | **MISSING FROM SCOPE** unless a HOLD in §11 fires | Do not add silently. |

### 7.1 Product runtime (behavior / presentation)

Only these Product runtime files may change behavior / presentation in this unit:

```text
spfx/src/shell/ux/admin-audit-task-navigation.ts             (new)
spfx/src/shell/ux/AppShellChrome.tsx                         (ADMIN_AUDIT-only suppression + parent notify + adapter props)
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.tsx
```

`ScaffoldShell.tsx` may reuse existing Task-First classes from `ScaffoldShell.module.scss` without mutating that file.

```text
OUT using display:none (or equivalent) of [data-shell-ux="primary-navigation"]
    as the ADMIN_AUDIT uniqueness mechanism
OUT changing FIELD_STAFF / PLANNER selectors in ScaffoldShell.module.scss
```

### 7.2 Product / unit tests

```text
spfx/src/shell/ux/admin-audit-task-navigation.test.ts        (new; contract tests)
spfx/src/shell/ux/AppShellChrome.test.tsx                    (new; ADMIN_AUDIT not-render + FS/PL still mount legacy nav)
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.test.tsx
                                                            (new; AdminAuditShellState / first paint / role switch / restore / fail-closed)
```

No `AppShellChrome` or `ScaffoldShell` test files exist on current main. These paths are authorized as new colocated tests. Component tests follow the existing `renderToStaticMarkup` convention (`spfx/src/shell/users/ManagementHome.test.tsx`). Do not add a new test runner or `@testing-library` dependency.

Existing tests that must remain PASS (regression; not rewritten unless a HOLD in §11 fires):

```text
spfx/src/shell/ux/field-staff-task-navigation.test.ts
spfx/src/shell/ux/planner-task-navigation.test.ts
spfx/src/shell/ux/presentation-role.test.ts
spfx/src/shell/ux/primary-navigation.test.ts
```

### 7.3 Dedicated smoke (R-AA-4)

```text
spfx/smoke/sbs-admin-audit-task-first-v1/run-smoke.mjs       (new)
spfx/smoke/sbs-admin-audit-task-first-v1/smoke-entry.tsx     (new)
spfx/smoke/sbs-admin-audit-task-first-v1/.gitignore          (new; same generated-file ignore as sbs-role-task-first-ia-1)
.github/workflows/sbs-admin-audit-task-first-v1-browser-smoke.yml
                                                            (new; follow planner-top-level exact-head + Noto CJK pattern)
```

Exact dedicated smoke invocation (local and CI job step):

```bash
node spfx/smoke/sbs-admin-audit-task-first-v1/run-smoke.mjs
```

Smoke must prove at minimum:

```text
ADMIN_AUDIT Global labels 運用確認 · 証跡 · 探す
exact Global order
one Global navigation only
legacy Global navigation suppressed (NOT RENDERED; not merely display:none)
D-OPS default destination
D-HOME literal alias behavior where observable
  (restore token D-HOME lands the same D-OPS place / same C6 運用確認)
D-EVIDENCE navigation
D-FIND-PERSON navigation
desktop rendered state
390×844 rendered state
```

Smoke MUST NOT:

```text
claim AA-HTA PASS / completion
encode AA-HTA completion from automated smoke
claim FIELD_STAFF regression beyond evidence actually gathered in this smoke
claim PLANNER regression beyond evidence actually gathered in this smoke
repurpose spfx/smoke/admin-demo-ux-polish-1/run-smoke.mjs as this-unit evidence
```

FIELD_STAFF / PLANNER regression evidence for this unit is:

```text
existing unit tests PASS
existing dedicated smokes remain authorized elsewhere
this-unit smoke may include FS/PL control pages only if those pages are actually run
  and recorded; otherwise do not claim those roles from ADMIN_AUDIT-only captures
```

```text
Smoke PASS != Human Task PASS
Smoke PASS != AA-HTA PASS
```

### 7.4 Explicit OUT of mutation

```text
spfx/src/shell/ux/presentation-role.ts
spfx/src/shell/ux/presentation-role.test.ts
spfx/src/shell/ux/primary-navigation.ts
spfx/src/shell/ux/primary-navigation.test.ts
spfx/src/shell/ux/index.ts
spfx/src/shell/ux/DemoPresentationRoleEntry.tsx
spfx/src/shell/ux/fixture.ts
spfx/src/shell/ux/field-staff-task-navigation.ts
spfx/src/shell/ux/planner-task-navigation.ts
spfx/src/webparts/scaffoldShellWebPart/components/IScaffoldShellProps.ts
spfx/src/webparts/scaffoldShellWebPart/ScaffoldShellWebPart.ts
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.module.scss
spfx/smoke/admin-demo-ux-polish-1/**
sbs-domain/**
SharePoint adapters
procedure implementation
domain / schema / persistence / auth / Entra
UsersList / UserDetail / OverviewDashboard / SupportPlan / DailyRecords reimplementation
```

`presentation-role.ts` is vocabulary-only for this slice. If satisfying AC-AA-TF-\* appears to require destination/Global semantics there, HOLD (H-6). Do not “just add” D-\* ids to presentation vocabulary.

If a file not listed in §7.1–§7.3 is required to satisfy AC-AA-TF-1..23, HOLD (H-3 / H-4 / H-14). Do not expand silently.

---

## 8. Explicit OUT (this unit)

```text
Locked Definition packet rewrite / blob change
CORR-2A / CORR-2B table modification
CORR-1F / CORR-1G reopen
FIELD_STAFF Task-First rewrite
PLANNER Task-First rewrite
Globally removing or rewriting SHELL-UX-7 概要 / 利用者 / 記録 for all roles
SHELL-UX-7 Decision ledger supersede / repeal
D-AUDIT / AA-T3 Product Destination in this slice
D-PERSON / D-FIND-RECORD / D-RECORD-READ Product Destination in this slice
Search Hub / context-resolver Destination
AA-T1 cadence (parent P2-2) resolution
quiet 合成 badge (parent P2-1)
AA-HTA-1 / AA-HTA-2 Human Task Acceptance PASS
Approve / Publish / Deploy / Delete / LIVE WRITE authority
authorization-role invention
Entra / App Catalog / SharePoint / M365 mutation
Tenant Deploy
domain / schema / persistence contract change
Notion production mutation
Ready / Merge / Deploy
Human Implementation Start GO consumption by this document
Human Scope Lock consumption by this document
reconstructing Draft-1 as repository evidence
claiming earlier Draft-2 preparation as current-main evidence
```

---

## 9. Acceptance criteria

Every requirement below is independently verifiable. No unavailable Draft-1 acceptance set is restated.

| ID | Criterion | Locked / requirement trace |
|---|---|---|
| AC-AA-TF-1 | ADMIN_AUDIT Task-First Global labels are exactly `運用確認`, `証跡`, `探す`. | CORR-2A §2.4; R-AA-5 |
| AC-AA-TF-2 | Exact Global ordering is `運用確認 · 証跡 · 探す`. | CORR-2A §2.4 / C5 §7.2; R-AA-5 |
| AC-AA-TF-3 | Global 運用確認 navigates to Destination identity `D-OPS` only. | CORR-2A §2.4; R-AA-5 |
| AC-AA-TF-4 | Global 証跡 navigates to Destination identity `D-EVIDENCE` only. | CORR-2A §2.4; R-AA-5 |
| AC-AA-TF-5 | Global 探す navigates to Destination identity `D-FIND-PERSON` only; not `D-FIND-RECORD`. | CORR-2A §2.4 / §2.5; R-AA-5 |
| AC-AA-TF-6 | ADMIN_AUDIT first paint after usable session = `D-OPS` / C6 `運用確認`. | CORR-2B §3.4 / C5 §7.1; R-AA-3 |
| AC-AA-TF-7 | `D-HOME == D-OPS` is literal identity. No separate Home place. Restore token `D-HOME` is the same identity as `D-OPS`. | CORR-2B §3.4 / C6; R-AA-3 |
| AC-AA-TF-8 | Role switch **into** ADMIN_AUDIT notifies the parent shell and lands ADMIN_AUDIT Task-First at `D-OPS`. Chrome-local leftover (FE-F001) is closed. | C6; FE-F001; R-AA-3 |
| AC-AA-TF-9 | Role switch **away from** ADMIN_AUDIT restores FIELD_STAFF or PLANNER existing Task-First behavior and does not keep ADMIN_AUDIT Global as a second nav. | C6; R-AA-3 |
| AC-AA-TF-10 | Destination state restoration works for supported ADMIN_AUDIT Destinations in this slice (`D-OPS` / `D-EVIDENCE` / `D-FIND-PERSON`). | C6; R-AA-3 |
| AC-AA-TF-11 | Deep-link restoration of role + Destination + object succeeds where this slice supports it (`ADMIN_AUDIT` + Destinations in AC-AA-TF-10; object not required for these Global Destinations). | C6; R-AA-3 |
| AC-AA-TF-12 | Unsupported or invalid restoration fail-closes. It does not mint the requested place and does not guess `D-OPS` as a successful restore of that place. | C6; R-AA-3 |
| AC-AA-TF-13 | When effective presentation role is ADMIN_AUDIT, legacy Global `概要 / 利用者 / 記録` is **not rendered**. | CORR-1A; FE-F003; R-AA-2 |
| AC-AA-TF-14 | ADMIN_AUDIT Task-First Global is the single active Global navigation (FE-F003 uniqueness directly testable). | CORR-1A; R-AA-2 |
| AC-AA-TF-15 | FIELD_STAFF existing navigation behavior is preserved (labels, order, CSS-hide uniqueness, destinations). | CORR-1F/1G; R-AA-2 |
| AC-AA-TF-16 | PLANNER existing navigation behavior is preserved (labels, order, Distinct D-HOME). | PLANNER Top-Level IA; R-AA-2 |
| AC-AA-TF-17 | Presentation role remains distinct from authorization role. No Entra / DEC-014 / auth-role invention. | Packet §4; R-AA-5 |
| AC-AA-TF-18 | `D-OPS` does not grant approval authority. | Packet §4 / C4; R-AA-5 |
| AC-AA-TF-19 | `D-EVIDENCE` does not imply evidence acceptance. | Packet C4; R-AA-5 |
| AC-AA-TF-20 | Task-First UI does not grant publish / deploy / delete / LIVE WRITE authority. | Packet §4 / C10; R-AA-5 |
| AC-AA-TF-21 | Automated smoke does not consume AA-HTA. Smoke PASS ≠ AA-HTA PASS. | Packet C9; R-AA-4 |
| AC-AA-TF-22 | 390×844 ADMIN_AUDIT Task-First rendered evidence exists. | R-AA-4 |
| AC-AA-TF-23 | Desktop ADMIN_AUDIT Task-First rendered evidence exists. | R-AA-4 |

Additional scope invariants (not a substitute for AC-AA-TF-1..23):

| ID | Criterion |
|---|---|
| AC-AA-TF-24 | No Product runtime file outside §7.1. No verification file outside §7.2–§7.3. |
| AC-AA-TF-25 | `presentation-role.ts` has no ADMIN_AUDIT destination / Global contract added. |
| AC-AA-TF-26 | Reproducible unit + browser smoke evidence at the exact implementation HEAD. |

Current-main evidence did not invalidate any AC-AA-TF-1..23 item and did not require a new architectural surface beyond §7.1–§7.3.

---

## 10. Exact verification commands and evidence mapping

Commands below are the authorized verification set for a later implementation bind. This Draft-2 does **not** run Product tests and does **not** treat them as currently PASS.

Commands were verified against current-main `package.json`, `spfx/package.json`, and `.github/workflows/contracts-ci.yml` at `d19f85a58703e78788cfe852e37a0853fcd4c090`.

### 10.1 Identity / lock check (docs + later implementation bind)

```bash
git rev-parse HEAD
git rev-parse HEAD:docs/architecture/sbs-role-task-first-ia-v1-correction-2-complete-controlled-packet.md
# must equal 5eeb8140772ebfefe050cff93361a6d81c470f81

git rev-parse HEAD:docs/architecture/sbs-role-task-first-ia-v1-correction-2-human-definition-lock.md
# must equal 794d227a1e69c709e679337be6478b32de81d74a

git rev-parse HEAD:docs/architecture/sbs-role-task-first-ia-v1-correction-2-independent-definition-re-review-2.md
# must equal 72ee81ec92aea6c1558f25232961259504affab9
```

This Draft-2 binds to Current Main Basis `d19f85a58703e78788cfe852e37a0853fcd4c090`. A later implementation PR may sit on a descendant of that SHA. It must not rewrite the three locked blobs.

### 10.2 Root unit / typecheck / lint / contracts / scope / CI

Exact root scripts that exist on current main:

```bash
# from repository root
npm test
npm run typecheck
npm run lint
npm run check:contracts-boundaries
npm run check:scope
npm run verify:ci
```

Applicability:

```text
npm test
  = root contracts / domain tests (tests/**/*.test.ts). Not SPFx Heft.

npm run typecheck
  = root tsc --noEmit

npm run lint
  = root eslint src tests scripts --max-warnings 0

npm run check:contracts-boundaries
  = node scripts/ci/check-contracts-boundaries.mjs

npm run check:scope
  = node scripts/ci/check-scope.mjs

npm run verify:ci
  = verify:skills + verify:ui-catalog + verify:ui-templates + lint + lint:ui-sem
    + format:check + typecheck + test + check:contracts-boundaries
    + check:scope + check:a11y + check:lifecycle-cancellation-storage-bridge
```

Root `npm test` does not execute SPFx colocated tests. It remains required as repository CI regression when `docs/architecture/**` changes (`.github/workflows/contracts-ci.yml`).

### 10.3 SPFx verification (exact; not ambiguous)

There is **no** `spfx` npm script named `test`.

Current-main `spfx/package.json` evidence:

```text
_phase:test
  = heft run --only test -- --clean

build
  = npm run prepare:b2-build-basis
    && heft test --clean --production
    && heft package-solution --production
```

Exact commands for this unit:

```bash
# SPFx unit verification (this unit's authorized tests + existing FS/PL tests)
# Invoke directly. Not an npm script.
cd spfx
npx heft test --clean
```

```bash
# SPFx production package verification
# Use only on an implementation PR that changes Product runtime.
# Exact current-main script:
cd spfx
npm run build
# which invokes:
#   heft test --clean --production && heft package-solution --production
```

```text
npx heft test --clean
  = this-unit SPFx unit verification command

cd spfx && npm run build
  = production package verification
  = the only current-main npm script that invokes heft test --clean --production

Do not substitute one for the other.
Do not claim heft test --clean --production is the unit-test command.
Do not claim heft test --clean is the production package command.
```

### 10.4 Dedicated ADMIN_AUDIT Task-First smoke

```bash
# from repository root; synthetic only; no LIVE I/O
node spfx/smoke/sbs-admin-audit-task-first-v1/run-smoke.mjs
```

This is the exact invocation path. The file is authorized as new; it does not exist on current main yet. Existing Task-First smokes use the same `node spfx/smoke/<unit>/run-smoke.mjs` shape.

Required smoke viewports:

```text
desktop  = 1280 × 900  (same as sbs-role-task-first-ia-1 / planner-top-level first-paint desktop)
mobile   = 390 × 844   (same as sbs-role-task-first-ia-1 first-paint-mobile)
```

Required smoke assertions (minimum):

```text
labels.join("|") === "運用確認|証跡|探す"
data-role-task-ia === "ADMIN_AUDIT"
first paint data-role-task-destination === "D-OPS"
document.querySelector('[data-shell-ux="primary-navigation"]') === null
exactly one Task-First Global nav
click 証跡 → D-EVIDENCE
click 探す → D-FIND-PERSON
D-HOME restore / alias observable as D-OPS + heading 運用確認
desktop screenshot captured
390×844 screenshot captured
no AA-HTA completion string encoded as PASS
```

```text
Smoke PASS != Human Task PASS
Smoke PASS != AA-HTA PASS
```

### 10.5 AC → evidence mapping

| AC | Unit / static evidence | Browser smoke evidence |
|---|---|---|
| AC-AA-TF-1 | `admin-audit-task-navigation.test.ts` ordered labels | rendered ordered labels |
| AC-AA-TF-2 | same ordered list | same |
| AC-AA-TF-3 | resolve 運用確認 → `D-OPS` | Global click → `D-OPS` |
| AC-AA-TF-4 | resolve 証跡 → `D-EVIDENCE` | Global click → `D-EVIDENCE` |
| AC-AA-TF-5 | resolve 探す → `D-FIND-PERSON`; negative `D-FIND-RECORD` | 探す identity; no Global record-find |
| AC-AA-TF-6 | `initialAdminAuditTaskViewState().destination === "D-OPS"`; ScaffoldShell first paint | first-paint `D-OPS` / heading 運用確認 |
| AC-AA-TF-7 | `ADMIN_AUDIT_HOME_DESTINATION === "D-OPS"`; no `D-HOME` enum member; restore token identity | observable D-HOME token lands D-OPS / same heading |
| AC-AA-TF-8 | ScaffoldShell role-switch into ADMIN_AUDIT | demo role option `ADMIN_AUDIT` → parent layer `data-role-task-ia="ADMIN_AUDIT"` + `D-OPS` |
| AC-AA-TF-9 | ScaffoldShell role-switch away | switch to FIELD_STAFF or PLANNER restores that role’s Task-First layer |
| AC-AA-TF-10 | session events restore supported Destinations | smoke restore / in-session Global navigation |
| AC-AA-TF-11 | restore helper accepts role+Destination supported tuple | smoke query/injection restore |
| AC-AA-TF-12 | invalid Destination / unsupported object fail-closed | smoke invalid restore case |
| AC-AA-TF-13 | `AppShellChrome.test.tsx`: ADMIN_AUDIT markup has no `data-shell-ux="primary-navigation"` | smoke `querySelector` null |
| AC-AA-TF-14 | chrome + ScaffoldShell: one Task-First nav | smoke uniqueness |
| AC-AA-TF-15 | existing `field-staff-task-navigation.test.ts` PASS; AppShellChrome still mounts legacy nav for FIELD_STAFF | no FS rewrite claim unless FS control page actually run |
| AC-AA-TF-16 | existing `planner-task-navigation.test.ts` PASS; AppShellChrome still mounts legacy nav for PLANNER | no PLANNER rewrite claim unless PLANNER control page actually run |
| AC-AA-TF-17 | diff invariant + presentation-role.ts untouched | synthetic ADMIN_AUDIT fixture only |
| AC-AA-TF-18 | no approval CTA / authority flag in ADMIN_AUDIT contract | smoke asserts absence of approval CTA |
| AC-AA-TF-19 | no evidence-acceptance CTA / authority flag | smoke asserts absence of acceptance CTA |
| AC-AA-TF-20 | no publish / deploy / delete / LIVE WRITE authority | smoke asserts absence; no LIVE I/O |
| AC-AA-TF-21 | smoke summary must not contain AA-HTA PASS claim | same |
| AC-AA-TF-22 | n/a | 390×844 screenshot artifact |
| AC-AA-TF-23 | n/a | desktop screenshot artifact |
| AC-AA-TF-24 | `git diff --name-only` vs authorized §7 | n/a |
| AC-AA-TF-25 | `presentation-role.ts` not in Product diff | n/a |
| AC-AA-TF-26 | `npx heft test --clean` PASS at exact HEAD | smoke `implementationHead` recorded |

AC-AA-TF-15 / AC-AA-TF-16 / AC-AA-TF-24 / AC-AA-TF-25 are scope/diff invariants in addition to tests. Passing ADMIN_AUDIT smoke alone cannot prove unauthorized files were unchanged.

---

## 11. HOLD conditions

| ID | HOLD condition | Required disposition |
|---|---|---|
| H-1 | Locked Definition packet blob is not `5eeb8140772ebfefe050cff93361a6d81c470f81` | Stop; recover exact locked Definition lineage |
| H-2 | Human Definition Lock blob is not `794d227a1e69c709e679337be6478b32de81d74a` | Stop; recover lock evidence |
| H-3 | Implementer must touch any Product runtime file outside §7.1 to satisfy AC-AA-TF-1..26 | Stop; new Exact Scope; do not expand silently |
| H-4 | Implementer must touch any verification file outside §7.2–§7.3 | Stop; amend Scope and re-review before implementation |
| H-5 | ADMIN_AUDIT AC requires FIELD_STAFF or PLANNER Global rewrite, or CORR-1F/1G reopen | Stop; separate tranche |
| H-6 | Destination / Global contract is added to `presentation-role.ts` | Stop; violates R-AA-1 |
| H-7 | ADMIN_AUDIT uniqueness is implemented only as CSS hide of still-rendered legacy Global | Stop; violates R-AA-2 NOT RENDERED |
| H-8 | `D-HOME == D-OPS` is implemented as a resolver / second place | Stop; violates R-AA-3 literal identity |
| H-9 | Legacy 概要 / 利用者 / 記録 are removed or rewritten for FIELD_STAFF / PLANNER | Stop; ADMIN_AUDIT-only suppression violated |
| H-10 | Any work requires domain/schema/persistence/LIVE WRITE/Auth/Entra/Deploy change | Stop; outside this-unit authority |
| H-11 | Smoke or tests claim AA-HTA PASS | Stop; C9 boundary |
| H-12 | Implementation Start is attempted before Independent Scope Re-Review PASS **and** a separate Human Implementation Start GO | Stop |
| H-13 | Draft-1, or earlier unpersisted Draft-2 preparation, is cited as review basis | Stop; §0 provenance |
| H-14 | Implementer concludes `ScaffoldShell.module.scss` or `spfx/src/shell/ux/index.ts` must change | Stop; Excluded File Modification Requirement = PRESENT; do not expand silently |

---

## 12. Fresh Independent Implementation Scope Re-Review-2 questions

Reviewers must use **this Draft-2 body only**. Prior described Draft-1 is not a review basis. Earlier Draft-2 preparation is not repository-visible evidence.

| ID | Question |
|---|---|
| Q1 | Is Draft-2 repository-visible on a concrete commit and the sole Re-Review target, without reconstructing Draft-1? |
| Q2 | Does Draft-2 preserve the Locked Definition packet blob `5eeb8140…` without Definition modification? |
| Q3 | Is ADMIN_AUDIT navigation contract owned by `admin-audit-task-navigation.ts`, not `presentation-role.ts`? |
| Q4 | Is legacy Global suppression ADMIN_AUDIT-only and specified as NOT RENDERED (FE-F003 directly testable)? |
| Q5 | Does `AdminAuditShellState` uniquely own first paint `D-OPS` and literal `D-HOME == D-OPS`? |
| Q6 | Are role switch into / away, restoration, deep-link, and fail-closed independently specified? |
| Q7 | Is dedicated smoke authorized, and is Smoke PASS ≠ AA-HTA PASS explicit? |
| Q8 | Do AC-AA-TF-1..23 cover labels, order, destinations, first paint, literal alias, role switch, restoration, fail-closed, uniqueness, FS/PL preservation, authority non-grants, dedicated smoke, desktop, 390×844, and AA-HTA separation? |
| Q9 | Are authorized files closed under §7, and are FIELD_STAFF / PLANNER / `presentation-role.ts` / `primary-navigation.ts` / `index.ts` / `ScaffoldShell.module.scss` OUT of destination-contract mutation? |
| Q10 | Does this Scope avoid consuming Human Implementation Start / Scope Lock / Ready / Merge / Deploy? |
| Q11 | Are approval / evidence-acceptance / publish authority explicitly not granted by D-OPS / D-EVIDENCE / Task-First UI? |
| Q12 | Are D-AUDIT / in-flow D-FIND-RECORD / D-PERSON / AA-HTA / SHELL-UX-7 ledger still OUT? |
| Q13 | Is Current Main Basis exactly `d19f85a58703e78788cfe852e37a0853fcd4c090` at authorship, and are SPFx commands pinned without `heft test --clean` vs `--production` ambiguity? |

---

## 13. Review gate

```text
PASS CONDITION for later Independent Scope Re-Review-2
  = P0 0 and P1 0 against THIS Draft-2 body
P2 = non-blocking; do not invent missing Draft-1 P2 texts
```

If P0 or P1 exists against Draft-2:

```text
Human Scope Lock eligibility = NOT ELIGIBLE
Human Implementation Start GO eligibility = NOT ELIGIBLE
```

A Scope Review PASS does not itself consume Human Scope Lock or Human Implementation Start GO.

---

## 14. Gate chain (this packet)

```text
Locked Definition (Correction-2 packet) = PRESERVED
Human Definition Lock GO = RECEIVED / CONSUMED (parent)
Independent Definition Re-Review-2 = PASS / REVIEW-CLEARED / CONSUMED (parent)
Prior described Draft-1 = unavailable as repository evidence
Earlier Draft-2 preparation = not established as repository-visible evidence
Previous Re-Review-1 = HOLD / STOP (historical trigger only)
Implementation Scope Definition Draft-2 (this document) = COMPLETE
Independent Scope Re-Review-2 against this Draft-2 = NOT YET
Human Implementation Start GO = NOT RECEIVED
Human Scope Lock = NOT RECEIVED
Product mutation = NOT AUTHORIZED
```

```text
ALLOWED NEXT:
  Fresh Independent Implementation Scope Re-Review-2 against this Draft-2 body only
  → Human Scope Lock GO / HOLD (separate)
  → Human Implementation Start GO / HOLD (separate)

NOT AUTHORIZED:
  Product / test / smoke implementation by this document
  Human Implementation Start GO by this document
  Human Scope Lock by this document
  Ready / Merge / Deploy / LIVE WRITE
  self-PASS of Independent Scope Re-Review
  AA-HTA consumption
  reconstructing Draft-1
```

---

## 15. Exact identity check (this record)

| Item | Value |
|---|---|
| Path | `docs/architecture/sbs-admin-audit-task-first-v1-implementation-scope-definition-draft-2.md` |
| Unit ID | `ADMIN-AUDIT-TASK-FIRST-V1` |
| Current Main Basis (scout / bind) | `d19f85a58703e78788cfe852e37a0853fcd4c090` |
| Locked Definition path | `docs/architecture/sbs-role-task-first-ia-v1-correction-2-complete-controlled-packet.md` |
| Locked Definition blob | `5eeb8140772ebfefe050cff93361a6d81c470f81` |
| Human Definition Lock path | `docs/architecture/sbs-role-task-first-ia-v1-correction-2-human-definition-lock.md` |
| Human Definition Lock blob | `794d227a1e69c709e679337be6478b32de81d74a` |
| Independent Definition Re-Review-2 path | `docs/architecture/sbs-role-task-first-ia-v1-correction-2-independent-definition-re-review-2.md` |
| Independent Definition Re-Review-2 blob | `72ee81ec92aea6c1558f25232961259504affab9` |
| Draft-1 | unavailable as repository evidence; not reconstructed |
| Earlier Draft-2 preparation | not established as repository-visible evidence |

If the locked packet blob at its path is not `5eeb8140772ebfefe050cff93361a6d81c470f81`, this Scope does not apply. Re-bind is required.

---

## 16. Non-claims

```text
This Draft-2
  ≠ Implementation Start
  ≠ Product mutation
  ≠ Human Scope Lock
  ≠ Ready / Merge / Deploy
  ≠ AA-HTA PASS
  ≠ FE-F001 / FE-F003 closed in Product (only scoped)
  ≠ three-Role completion
  ≠ SHELL-UX-7 Decision ledger repeal
  ≠ FIELD_STAFF / PLANNER rewrite
  ≠ Draft-1 reconstruction
  ≠ earlier Draft-2 current-main visibility
```

```text
Presentation Role != Authorization Role
D-OPS != Approval Authority
D-EVIDENCE != Evidence Acceptance
D-FIND-PERSON != unrestricted access authority
Task-First UI != Publish Authority
Implementation PASS != Human Approval
Smoke PASS != AA-HTA PASS
```

```text
Human Definition Lock GO = CONSUMED (parent packet only)
Implementation Start = NOT AUTHORIZED
Ready / Merge / Deploy = NOT AUTHORIZED
```
