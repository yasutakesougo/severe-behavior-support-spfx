# SBS-PLANNER-TOP-LEVEL-IA-V1 — Implementation Scope Scout / Exact Scope

Implementation Scope Scout and Exact Scope Definition for SBS-PLANNER-TOP-LEVEL-IA-V1 after Human Definition Lock GO.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: SBS-PLANNER-TOP-LEVEL-IA-V1
kind: implementation scope scout / exact scope definition
status: COMPLETE / AWAITING FRESH INDEPENDENT SCOPE REVIEW
date: 2026-09-18

Human SBS-PLANNER-TOP-LEVEL-IA-V1 Exact Scope Scout GO: RECEIVED / CONSUMED

locked packet path:
  docs/architecture/sbs-planner-top-level-ia-v1-complete-controlled-packet.md
locked packet blob: 4c80f67e0a05f6ff10036ee1f44f1be9e16bab73
locked packet HEAD: b875a52b655f9c1faeba703b98aa437046fc512f
Human Definition Lock GO: RECEIVED / CONSUMED
lock record: docs/architecture/sbs-planner-top-level-ia-v1-human-definition-lock.md
lock blob: 1324caa2445c4909164032da9623ba8e8deaca09
Independent Definition Re-Review-1: PASS / REVIEW-CLEARED / CONSUMED
  record: docs/architecture/sbs-planner-top-level-ia-v1-independent-definition-re-review-1.md
  record HEAD: 885240ce9086504f63ba33b2e140028eab6ce548
  record blob: 45f13c1153d3e31b5432a08cea306ab99d13fd45
parent Correction-2 packet blob: 5eeb8140772ebfefe050cff93361a6d81c470f81
parent Lock blob: 794d227a1e69c709e679337be6478b32de81d74a
scout basis main: 59b56411f93677826c74c62666a31912ea563d1f

Independent Scope Review: NOT YET
Human Exact Scope Correction-1 GO: NOT RECEIVED
Human Correction Implementation GO: NOT RECEIVED
Implementation Start: NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
SHELL-UX-7 Decision ledger repeal: NOT AUTHORIZED
Notion production page update: NOT AUTHORIZED
Product / SPFx mutation by this document: NONE
CORR-1F / CORR-1G reopen: NOT AUTHORIZED
Rewrite locked this-unit packet blob: NOT AUTHORIZED
ADMIN_AUDIT Global / D-HOME alias D-OPS: OUT
```

This document scouts the repository against the locked SBS-PLANNER-TOP-LEVEL-IA-V1 packet and fixes the **this-unit** exact implementation surface only.

Creating or reviewing this Scope does **not** authorize Product mutation or consume Human Correction Implementation GO.

Human Exact Scope Scout GO ≠ Independent Scope Review PASS ≠ Exact Scope Correction-1 GO ≠ Independent Scope Re-Review PASS ≠ Human Correction Implementation GO ≠ Implementation Start ≠ Ready ≠ Merge.

---

## 1. Scout summary (main @ 59b56411)

### 1.1 Locked Definition requires

```text
PL-TL-A  PLANNER Top-Level Global unique
         ordered: 今の工程 · 探す
         今の工程 → D-HOME
         探す     → D-FIND-PERSON
         unknown cycle = fail-closed on D-HOME (not guessed as D-ASSESS)

PL-TL-B  PLANNER D-HOME Distinct
         D-HOME ≠ D-ASSESS / D-PLAN / D-MONITOR / D-REVIEW / D-NEXT
         First paint = D-HOME
         Global「今の工程」= D-HOME

PL-TL-C  C6 location identity unique for D-HOME vs Task Destinations
         / in-flow find places

PL-TL-D  cycle=③ Primary Action uniquely
         D-HOME → D-FIND-RECORD (in-flow)
         then selected record → D-RECORD-READ
         preserve: in-flow-only / Global 探す / no create CTA / no PLANNER WRITE
```

### 1.2 Observed Product state (read-only scout)

| Area | Observation | This-unit impact |
|---|---|---|
| Product entry | `ScaffoldShell.tsx` hardcodes `presentationRole="FIELD_STAFF"` and mounts only FIELD_STAFF Task-First Global | Primary Product owner for PLANNER Task-First proof; must gain PLANNER path without reopening CORR-1F/1G |
| FIELD_STAFF Task-First | `field-staff-task-navigation.ts` + CORR-1G session events COMPLETE / ARCHIVED PRESERVED | Regression-only; OUT of rewrite |
| PLANNER Task-First module | **absent** (no `planner-task-navigation.ts`) | New authorized module |
| SHELL-UX-7 Global | `primary-navigation.ts` still `概要 / 利用者 / 記録`; FIELD_STAFF CSS hides it in ScaffoldShell styles | PLANNER must not present SHELL-UX-7 as V1 Global; hide/suppress similarly; do not retire ledger |
| Demo role entry | `DemoPresentationRoleEntry` exists in `AppShellChrome`; FIELD_STAFF styles hide it | Smoke may set PLANNER at entry without inventing auth roles |
| SupportPlan process-nav | `PLANNER_SUPPORT_PLAN_PROCESS_NAVIGATION` = ①計画…⑥次版準備 (in-page section scroll; not progress) | **OUT** reimplementation; not Top-Level Global; vocabulary ≠ locked cycle ①アセスメント… |
| Overview / lists / KPI | VP-G presentationRole reorders emphasis only | OUT of rewrite; adapter transport only if needed |
| D-FIND-RECORD / D-RECORD-READ Product Task-First | not present as PLANNER Destinations | Prove Destination identity in Task-First layer; do not promote to Global「探す」 |
| ADMIN_AUDIT | unchanged SHELL-UX-7 / VP-G surfaces | Regression-only; OUT |

### 1.3 Scout verdict

CORR-1F / CORR-1G proved FIELD_STAFF Task-First only. PLANNER Top-Level Global and Distinct D-HOME remain unproven on Product; fail-closed preserved.

This unit therefore introduces a PLANNER Task-First layer parallel to FIELD_STAFF, scoped to locked PL-TL-A..D only. It does **not** rewrite locked CORR-2A/B tables, reopen CORR-1F/1G, reimplement SupportPlan / Process Visibility / list·KPI, or complete ADMIN_AUDIT Global.

`AppShellChrome.tsx` remains **OUT** of behavioral/presentation mutation for this tranche (CORR-1F-style). Legacy chrome may remain an unchanged host/adapter surface. If satisfying AC-PL-TL-* requires AppShellChrome mutation, HOLD (H-6) — do not widen silently.

---

## 2. This-unit goal

Prove the smallest Product change that makes a PLANNER usable session satisfy locked packet PL-TL-A..D:

```text
Top-Level Global uniquely 今の工程 · 探す
今の工程 → D-HOME ; 探す → D-FIND-PERSON
First paint = D-HOME (Distinct)
Primary Action map unique for ①②③④⑤⑥ + unknown fail-closed
cycle=③ → D-FIND-RECORD → selected → D-RECORD-READ
C6 location identity unique for D-HOME vs other Destinations in §5
FIELD_STAFF CORR-1F/1G unchanged (regression)
```

This unit does **not** claim PL-HTA PASS, ADMIN_AUDIT Global completion, SupportPlan section-nav rewrite, or three-Role completion.

---

## 3. Exact authorized Product surface

Only the following Product runtime files may change behavior / presentation in this unit:

```text
spfx/src/shell/ux/planner-task-navigation.ts             (new)
spfx/src/shell/ux/planner-task-navigation.test.ts        (new)
spfx/src/shell/ux/index.ts                               (export wiring only)
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.tsx
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.module.scss
```

`AppShellChrome.tsx`, `primary-navigation.ts`, `field-staff-task-navigation.ts`, `SupportPlan.tsx`, `support-plan-copy.ts`, UsersList / UserDetail / DailyRecords / OverviewDashboard, domain modules, and SharePoint adapters are **OUT** unless a HOLD in §9 fires.

### 3.1 Legacy shell adapter rule (this unit)

```text
D-HOME         → Task-First orientation surface owned by ScaffoldShell PLANNER path
                 (not a SHELL-UX-7 Global row; not SupportPlan section-nav)
D-ASSESS       → Destination identity change + unique C6 heading in Task-First layer
D-PLAN         → same
D-MONITOR      → same
D-REVIEW       → same
D-NEXT         → same
D-FIND-PERSON  → Destination identity + unique C6 heading (person-find meaning)
D-FIND-RECORD  → Destination identity + unique C6 heading (in-flow record index)
D-RECORD-READ  → Destination identity + unique C6 heading (read-only; no create CTA)
```

Rules:

```text
1. Product Destination identity exposed in PLANNER Task-First UI/state MUST remain the D-* id.
2. SHELL-UX-7 adapter ids (overview/users/records) are never normative D-* identity.
3. Global「探す」 MUST resolve to D-FIND-PERSON only; D-FIND-RECORD is in-flow only.
4. PLANNER MUST NOT use D-RECORD-WRITE; D-RECORD-READ MUST NOT present a record-create CTA.
5. SupportPlan in-page PROCESS-VISIBILITY (①計画…⑥次版準備) remains unchanged and is NOT
   Top-Level Global and NOT the cycle vocabulary owner for this unit.
6. FIELD_STAFF Task-First path remains CORR-1F/1G behavior when presentationRole is FIELD_STAFF.
7. Rich hosting of SupportPlan / DailyRecords / Overview content behind Task Destinations is OUT.
   This tranche proves Destination identity + orientation + Primary Action resolution.
   Placeholder / orientation copy inside authorized ScaffoldShell PLANNER path is sufficient.
8. If satisfying AC-PL-TL-* requires editing any OUT file in this section, HOLD (H-3).
```

### 3.2 AppShellChrome adapter contract (normative)

`AppShellChrome.tsx` is **not authorized for modification** in this unit. Its existing chrome may remain only as an unchanged legacy host while ScaffoldShell proves the PLANNER Task-First layer in §3 files.

```text
A. AppShellChrome overview/users/records ids are never normative D-* identity.
B. PLANNER Task-First Global, currentCycle, and D-* identity are owned by
   ScaffoldShell + planner-task-navigation, not by legacy nav ids.
C. The legacy chrome MUST NOT be presented or interpreted as a second concurrent V1 Global.
D. FIELD_STAFF CORR-1F/1G behavior through existing paths remains unchanged (regression-only).
E. ADMIN_AUDIT behavior through AppShellChrome remains unchanged (regression-only).
F. No SHELL-UX-7 Global row add/remove/reorder.
G. If satisfying AC-PL-TL-* requires AppShellChrome behavior/presentation change, HOLD (H-6).
```

### 3.3 Cycle context binding (normative; not React lock)

```text
PlannerCyclePosition =
  ① | ② | ③ | ④ | ⑤ | ⑥ | unknown

Owned by: PLANNER Task-First layer (planner-task-navigation + ScaffoldShell PLANNER path)
Meaning: locked Definition cycle place for D-HOME orientation / Primary Action
NOT owned by: SupportPlan process-nav scroll position / section ids
NOT owned by: implementer-invented router state outside this module
```

Normative Primary Action map (locked PL-TL-D + parent rows):

| currentCycle | D-HOME Primary Action → |
|---|---|
| ① | D-ASSESS |
| ② | D-PLAN |
| ③ | D-FIND-RECORD (then selected record → D-RECORD-READ) |
| ④ | D-MONITOR |
| ⑤ | D-REVIEW |
| ⑥ | D-NEXT |
| unknown | do not leave D-HOME / fail-closed orientation |

```text
REJECTED:
  guessing unknown → D-ASSESS
  promoting D-FIND-RECORD to Global「探す」
  PLANNER D-RECORD-WRITE
  record-create CTA on D-RECORD-READ
  treating SupportPlan ①計画… as Top-Level Global or as this unit’s cycle SSOT
```

How `currentCycle` becomes known in this tranche (unique close):

```text
1. First paint default = unknown (fail-closed Primary Action; stay D-HOME)
   unless a synthetic demo/smoke fixture supplies a known cycle for proof cases.
2. Synthetic fixture / unit-test / smoke may set currentCycle to a known value
   through the PLANNER Task-First module API only (authorized test/smoke entry).
3. Product MUST NOT silently derive currentCycle from SupportPlan section-nav
   or from SHELL-UX-7 destination ids in this tranche.
4. Changing currentCycle is not a Top-Level Global item and does not add Global rows.
```

Selected-record step when cycle=③:

```text
On D-FIND-RECORD:
  Primary information = 記録の一覧・期間 (orientation copy; no LIVE list required)
  Selecting a synthetic record id → Destination D-RECORD-READ
  Cancel / Back → previous Destination (D-HOME when arrived via D-HOME PA)
  No record-create CTA
```

---

## 4. Locked PL-TL-A Global binding (restated, not replaced)

| Global | Destination (context sufficient) | context不足時の意味 |
|---|---|---|
| 今の工程 | D-HOME | Still D-HOME. Unknown cycle = fail-closed orientation; PA does not enter Task Destination until cycle known. |
| 探す | D-FIND-PERSON | Context not required. D-FIND-RECORD is not this item. |

Global order MUST remain: `今の工程 · 探す`.

---

## 5. Locked PL-TL-B / C6 binding

```text
D-HOME
  Purpose = 今の工程の所在と次の一手（orientation）
  First paint = D-HOME
  Global「今の工程」= D-HOME
  Distinct vs D-ASSESS / D-PLAN / D-MONITOR / D-REVIEW / D-NEXT
```

C6 location identity (unique; generic shared heading REJECTED):

| Destination | Location identity (C6 今どこ) |
|---|---|
| D-HOME | 今の工程 |
| D-ASSESS | アセスメント |
| D-PLAN | 支援計画 |
| D-MONITOR | モニタリング |
| D-REVIEW | 見直し |
| D-NEXT | 次版準備 |
| D-FIND-PERSON | 利用者を探す |
| D-FIND-RECORD | 記録を探す |
| D-RECORD-READ | 記録を見る |

---

## 6. Verification surface (authorized)

Only the following this-unit-specific verification files may be added/changed:

```text
spfx/src/shell/ux/planner-task-navigation.test.ts
spfx/smoke/sbs-planner-top-level-ia-v1/run-smoke.mjs          (new)
spfx/smoke/sbs-planner-top-level-ia-v1/smoke-entry.tsx        (new)
.github/workflows/sbs-planner-top-level-ia-v1-browser-smoke.yml  (new; optional if CI pattern requires)
```

Verification must prove this unit only. No LIVE I/O. Smoke PASS ≠ Human Task PASS.

Existing FIELD_STAFF smoke / CORR-1F/1G tests must remain PASS (regression). Do not “fix” P2-2 / P2-3 smoke hygiene inside this unit.

Existing gates must remain PASS where touched:

```text
npx heft test --clean (spfx)
existing a11y / format / lint / typecheck expectations for modified files
```

### 6.1 AC-PL-TL verification mapping (normative)

| AC | Required evidence | Unit | Browser smoke |
|---|---|---|---|
| AC-PL-TL-1 | PLANNER Global labels + exact order `今の工程 · 探す` | ordered list | rendered ordered labels |
| AC-PL-TL-2 | 今の工程 → D-HOME only | resolve table | Global click → D-HOME |
| AC-PL-TL-3 | 探す → D-FIND-PERSON only; not D-FIND-RECORD | exact + negative | 探す identity; no Global record-find |
| AC-PL-TL-4 | usable-session first paint = D-HOME | default state | first-paint D-HOME |
| AC-PL-TL-5 | D-HOME Distinct vs Task Destinations | identity assertions | PA leaves D-HOME changes identity |
| AC-PL-TL-6 | unknown cycle PA fail-closed / stay D-HOME | unit unknown case | smoke default unknown |
| AC-PL-TL-7 | cycle ①②④⑤⑥ PA → unique Task Destination | unit map | smoke fixture per cycle (sample ok if all unit-covered) |
| AC-PL-TL-8 | cycle=③ PA → D-FIND-RECORD; selected → D-RECORD-READ | unit + then-step | smoke ③ path |
| AC-PL-TL-9 | D-RECORD-READ has no create CTA; no PLANNER D-RECORD-WRITE | negative assertions | smoke asserts absence |
| AC-PL-TL-10 | C6 headings unique per §5 | heading table | 今どこ copy per Destination |
| AC-PL-TL-11 | presentationRole synthetic PLANNER; no auth-role invention | compile/diff | synthetic fixture only |
| AC-PL-TL-12 | no Product file outside §3; no domain/schema/LIVE | scope-diff invariant | no LIVE I/O |
| AC-PL-TL-13 | FIELD_STAFF CORR-1F/1G regress fail-closed | existing tests PASS | must not claim FS rewrite |
| AC-PL-TL-14 | ADMIN_AUDIT / SupportPlan process-nav / list·KPI not rewritten | diff invariant | must not claim those completions |
| AC-PL-TL-15 | reproducible unit + browser evidence at exact implementation HEAD | required unit PASS | required smoke PASS |

`AC-PL-TL-12` / `AC-PL-TL-13` / `AC-PL-TL-14` are scope/diff invariants in addition to tests.

---

## 7. Explicit OUT (this unit)

```text
CORR-2A / CORR-2B locked parent blob rewrite
CORR-1F / CORR-1G reopen or FIELD_STAFF Global rewrite
ADMIN_AUDIT Global / D-HOME alias D-OPS
SupportPlan section navigation reimplementation
①–⑥ Process Visibility in-page navigation reimplementation
list / KPI / action queue reimplementation
Current / Draft / Next semantics re-solve
0件 / 実施できなかった / 未記録 state-distinction re-solve
AppShellChrome.tsx behavioral/presentation mutation
primary-navigation.ts SHELL-UX-7 row mutation
New Destinations (Search Hub; context-resolver place; fifth cycle step named D-HOME)
Domain / schema / persistence / SharePoint mutation
LIVE WRITE / Deploy / Entra / App Catalog
SHELL-UX-7 Decision ledger supersede record
Notion production mutation
Promote D-FIND-RECORD to Global「探す」
PLANNER D-RECORD-WRITE / record-create CTA on D-RECORD-READ
PL-HTA Human Task Acceptance PASS claim by smoke alone
P2-2 / P2-3 smoke hygiene closure
unrelated refactor
```

---

## 8. Acceptance criteria

| ID | Criterion |
|---|---|
| AC-PL-TL-1 | PLANNER Global items match §4 labels and order. |
| AC-PL-TL-2 | 今の工程 maps to exactly D-HOME. |
| AC-PL-TL-3 | 探す maps to exactly D-FIND-PERSON; D-FIND-RECORD is not Global. |
| AC-PL-TL-4 | First paint after usable PLANNER session presents D-HOME / 今の工程. |
| AC-PL-TL-5 | D-HOME is Distinct; not equal to D-ASSESS / D-PLAN / D-MONITOR / D-REVIEW / D-NEXT. |
| AC-PL-TL-6 | Unknown cycle Primary Action stays on D-HOME (fail-closed). |
| AC-PL-TL-7 | Known cycles ①②④⑤⑥ Primary Action map uniquely per §3.3. |
| AC-PL-TL-8 | Cycle=③ Primary Action → D-FIND-RECORD; selected record → D-RECORD-READ. |
| AC-PL-TL-9 | D-RECORD-READ has no record-create CTA; PLANNER does not use D-RECORD-WRITE. |
| AC-PL-TL-10 | C6 location headings are unique per §5. |
| AC-PL-TL-11 | presentationRole remains synthetic; no authorization-role invention. |
| AC-PL-TL-12 | No domain/schema/persistence contract change and no Product file outside §3. |
| AC-PL-TL-13 | FIELD_STAFF existing CORR-1F/1G surfaces regress fail-closed. |
| AC-PL-TL-14 | ADMIN_AUDIT / SupportPlan process-nav / list·KPI are not rewritten by this tranche. |
| AC-PL-TL-15 | Reproducible unit + browser smoke evidence at exact implementation HEAD. |

---

## 9. HOLD conditions

| ID | HOLD condition | Required disposition |
|---|---|---|
| H-1 | Locked this-unit packet blob is not `4c80f67e0a05f6ff10036ee1f44f1be9e16bab73` | Stop; recover exact locked Definition lineage |
| H-2 | Human Definition Lock record blob is not `1324caa2445c4909164032da9623ba8e8deaca09` | Stop; recover lock evidence |
| H-3 | Implementer must touch any Product runtime file outside §3 to satisfy AC-PL-TL-1..15 | Stop; issue new Exact Scope; do not expand silently |
| H-4 | Implementer must touch any this-unit verification file outside §6 | Stop; amend Scope and re-review before implementation |
| H-5 | PLANNER AC requires FIELD_STAFF / ADMIN_AUDIT Global change or CORR-1F/1G reopen | Stop; separate tranche required |
| H-6 | Legacy adapter / proof requires `AppShellChrome.tsx` behavior/presentation change | Stop; new Scope required |
| H-7 | AppShellChrome legacy chrome would become a second concurrent V1 Global truth | Stop; do not claim dual-run acceptance |
| H-8 | Any work requires domain/schema/persistence/LIVE WRITE/Auth/Entra change | Stop; outside this-unit authority |
| H-9 | Implementation base does not contain durable locked Definition + Lock + Re-Review evidence before Implementation Start bind | Stop; merge/bind durable Definition lineage first |
| H-10 | Implementer derives Top-Level currentCycle from SupportPlan process-nav or invents Global cycle tabs | Stop; violates §3.3 / locked Definition |
| H-11 | Implementer promotes D-FIND-RECORD to Global「探す」 or adds PLANNER WRITE / create CTA | Stop; locked must-preserve violation |

---

## 10. Fresh Independent Scope Review questions

| ID | Question |
|---|---|
| Q1 | Is this Scope limited to PLANNER Top-Level Global + Distinct D-HOME (PL-TL-A..D) without FIELD_STAFF/ADMIN_AUDIT Global change? |
| Q2 | Are authorized Product files closed under §3 and verification files closed under §6? |
| Q3 | Does §3.3 uniquely close currentCycle ownership and Primary Action map, including cycle=③ then-step? |
| Q4 | Are Global bindings §4 and C6 headings §5 restatements of locked Definition without new state rules beyond synthetic cycle context? |
| Q5 | Does §3.2 keep AppShellChrome OUT and prevent dual-run Global? |
| Q6 | Do AC-PL-TL-1..15 map to reproducible unit/smoke/diff evidence without HTA over-claim? |
| Q7 | Are SupportPlan / Process Visibility / list·KPI / WRITE exclusions sufficient? |
| Q8 | Is SHELL-UX-7 ledger mutation still excluded? |
| Q9 | Does this Scope avoid closing ADMIN_AUDIT or P2 smoke hygiene by side-effect? |
| Q10 | Is durable locked Definition lineage required before Implementation Start bind (§9 H-9)? |

---

## 11. Review gate

```text
PASS CONDITION = P0 0 = P1 0
P2 = non-blocking suggestions only
```

If P0 or P1 exists:

```text
Human Correction Implementation GO eligibility = NOT ELIGIBLE
```

A Scope Review PASS does not itself consume Human Correction Implementation GO.

---

## 12. Deferred (scout note; not authorized)

| Item | Scope hint | Blocked until |
|---|---|---|
| ADMIN_AUDIT Global / D-OPS | SEPARATE WORKSTREAM | own Kickoff / Definition / Lock / Scope |
| SupportPlan / Process Visibility Product bind behind Task Destinations | later Exact Scope | this unit PASS + separate Scope |
| SHELL-UX-7 global retirement in AppShellChrome | later | all Roles bound + separate Scope |
| PL-HTA Human Task Acceptance | later | Product-reachable Destinations + Human Task gate |

---

## 13. Gate chain (this packet)

```text
Human Kickoff GO = CONSUMED (prior)
Human P1-1 Decision / Definition Correction-1 = CONSUMED (prior)
Independent Definition Re-Review-1 = PASS / REVIEW-CLEARED / CONSUMED
Human Definition Lock GO = RECEIVED / CONSUMED
Implementation Scope Scout / Exact Scope (this unit) = COMPLETE (this document)
Independent Scope Review = NOT YET
Human Correction Implementation GO = NOT RECEIVED
Product mutation = NOT AUTHORIZED
```

```text
ALLOWED NEXT:
  Fresh Independent Scope Review against this Scope body only
  → Human Correction Implementation GO / HOLD

NOT AUTHORIZED:
  Human Correction Implementation GO by this document
  Implementation Start / Product mutation
  Ready / Merge / Deploy / LIVE WRITE
  self-PASS of Independent Scope Review
  Scope expansion beyond §3–§6
```

---

## 14. Exact identity check (this record)

| Item | Value |
|---|---|
| Path | `docs/architecture/sbs-planner-top-level-ia-v1-implementation-scope.md` |
| Locked Definition packet path | `docs/architecture/sbs-planner-top-level-ia-v1-complete-controlled-packet.md` |
| Locked Definition packet blob | `4c80f67e0a05f6ff10036ee1f44f1be9e16bab73` |
| Human Definition Lock record blob | `1324caa2445c4909164032da9623ba8e8deaca09` |
| Independent Definition Re-Review-1 blob | `45f13c1153d3e31b5432a08cea306ab99d13fd45` |
| Parent Correction-2 packet blob | `5eeb8140772ebfefe050cff93361a6d81c470f81` |
| Parent Lock blob | `794d227a1e69c709e679337be6478b32de81d74a` |
| Scout basis main | `59b56411f93677826c74c62666a31912ea563d1f` |
| Unit ID | `SBS-PLANNER-TOP-LEVEL-IA-V1` |

If the locked this-unit packet blob at its path is not `4c80f67e0a05f6ff10036ee1f44f1be9e16bab73`, this Scope does not apply. Re-bind is required.

---

## 15. Durable Definition lineage precondition (P1 before Implementation Start bind)

The Scope may be reviewed while it lives on this docs-only branch. However, **before any Implementation Start / Human Correction Implementation bind**, the implementation base must include or descend from a durable repository lineage containing:

```text
SBS-PLANNER-TOP-LEVEL-IA-V1 Complete Controlled Packet blob
= 4c80f67e0a05f6ff10036ee1f44f1be9e16bab73

Human Definition Lock record blob
= 1324caa2445c4909164032da9623ba8e8deaca09

Independent Definition Re-Review-1 record
= present and bound to the same locked packet

Parent Correction-2 packet blob
= 5eeb8140772ebfefe050cff93361a6d81c470f81
```

If the implementation base is still a `main` commit that does not contain these Definition Lock artifacts, this is **P1 / HOLD for Implementation Start bind**, not a non-blocking P2.

This section does not authorize merging any branch. Merge/branch advancement remains a separate repository decision.

---

## 16. PLANNER Top-Level-only proof boundary (normative)

This unit may claim only the following:

```text
PLANNER Top-Level Global binding = in scope
PLANNER Distinct D-HOME = in scope
PLANNER cycle Primary Action map including ③ = in scope
PLANNER C6 location identity for listed Destinations = in scope

FIELD_STAFF CORR-1F/1G = preserved / not rewritten
ADMIN_AUDIT CORR-2A/B = not proven
SupportPlan / Process Visibility rewrite = not in scope
Global SHELL-UX-7 retirement = not proven
Full Role/Task IA completion = not proven
Human Task Acceptance PASS = not proven by unit/smoke
```

Passing AC-PL-TL-1..15 therefore proves this tranche only. It must not be reported as completion of the three-Role Definition or as PLANNER Destination deep Product hosting.

```text
STOP = no Product implementation from this Scope document
     = no self-PASS of Independent Scope Review
     = no Ready / Merge / Deploy / LIVE WRITE
     = no AppShellChrome / SupportPlan / FIELD_STAFF rewrite
     = no Global「探す」 → D-FIND-RECORD
     = no PLANNER D-RECORD-WRITE
```
