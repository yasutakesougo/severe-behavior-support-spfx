# SBS-ROLE-TASK-FIRST-IA-V1 — Implementation Scope Scout / Exact Scope (CORR-1G)

Implementation Scope Scout and Exact Scope Definition for CORR-1G after Human Definition Lock GO.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: CORR-1G
kind: implementation scope scout / exact scope definition
status: COMPLETE / AWAITING INDEPENDENT SCOPE REVIEW
date: 2026-09-16

Human CORR-1G Exact Scope Scout GO: RECEIVED / CONSUMED

locked packet path:
  docs/architecture/sbs-role-task-first-ia-v1-corr-1g-complete-controlled-packet.md
locked packet blob: 9718231d93c572b93cefcd2a54bb8234c3407941
locked packet HEAD: ba956429bfa9721e411dc7257ce79f265e0fe29e
Human Definition Lock GO: RECEIVED / CONSUMED
lock record: docs/architecture/sbs-role-task-first-ia-v1-corr-1g-human-definition-lock.md
lock blob: 2577a5f1b03d6355318c83b8f29b070a051752fe
Independent Definition Re-Review-2: REVIEW-CLEARED / CONSUMED
  record: docs/architecture/sbs-role-task-first-ia-v1-corr-1g-independent-definition-re-review-2.md
  record HEAD: 3f3531e651e63690a218b5c6168330557a5c6840
parent Correction-2 packet blob: 5eeb8140772ebfefe050cff93361a6d81c470f81
parent Lock blob: 794d227a1e69c709e679337be6478b32de81d74a
scout basis main: 40659c5b459548cc59803562122fdffd77fc0a23

Independent Scope Review: NOT YET
Human Correction Implementation GO: NOT RECEIVED
Implementation Start: NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
SHELL-UX-7 Decision ledger repeal: NOT AUTHORIZED
Notion production page update: NOT AUTHORIZED
Product / SPFx mutation by this document: NONE
CORR-1F reopen: NOT AUTHORIZED
Rewrite locked CORR-1G packet blob: NOT AUTHORIZED
P2-2 / P2-3 / PLANNER / ADMIN_AUDIT: OUT
```

This document scouts the repository against the locked CORR-1G packet and fixes the **CORR-1G** exact implementation surface only.

Creating or reviewing this Scope does **not** authorize Product mutation or consume Human Correction Implementation GO.

Human Exact Scope Scout GO ≠ Independent Scope Review PASS ≠ Human Correction Implementation GO ≠ Implementation Start ≠ Ready ≠ Merge.

---

## 1. Scout summary (main @ 40659c5b)

### 1.1 Locked Definition requires

```text
CORR-1G-A  FIELD_STAFF current support object
           acquisition / release unique → Product-reachable D-PROCEDURE
CORR-1G-B  FIELD_STAFF current occurrence / procedure context
           acquisition / release unique → Product-reachable D-RECORD-WRITE
CORR-1G-C  unique C6 location identity for D-TODAY / D-PROCEDURE /
           D-RECORD-WRITE / D-UNRECORDED / D-FIND-PERSON / D-PERSON
CORR-1F    insufficient-context fallbacks preserved
           手順 → D-TODAY ; 記録する → D-UNRECORDED
```

Frozen-false `sessionContext` for the whole Product session is **REJECTED**.

### 1.2 Observed Product state (read-only scout)

| Area | Observation | CORR-1G impact |
|---|---|---|
| Task-First Global | `field-staff-task-navigation.ts` resolves sufficient vs fallback D-* from `FieldStaffSessionContext` | Keep; add D-PERSON identity + unique C6 headings + acquisition/release functions |
| Product entry | `ScaffoldShell.tsx` freezes `sessionContext` at `{hasSupportObject:false, hasOccurrenceContext:false}` and never sets it | Primary Product owner of session-context meaning |
| C6 headings | `locationHeadingForFieldStaffDestination` returns `今日の支援` only for D-TODAY; all other D-* share `業務ナビゲーション` | Generic non-place REJECTED; unique-ify in authorized navigation module |
| Destination union | `FieldStaffTaskDestinationId` omits `D-PERSON` | D-PERSON is not a new Destination; add identity only |
| Legacy chrome | `AppShellChrome.tsx` already hosts TodaySupportDayBoard, UsersList, UserDetail, CurrentProcedure, ProcedureRecordForm behind overview/users adapters | Allowed adapter surfaces; CORR-1F hid SHELL-UX-7 for FIELD_STAFF |
| D-TODAY list CTA | `TodaySupportDayBoard` FIELD_STAFF 未実施 label = `この予定を記録 / 手順表示`; click opens CurrentProcedure inside chrome, but Task-First D-* stays D-TODAY / object false | Bind as D-TODAY Primary Action episode; notify Task-First layer |
| D-PERSON | UserDetail opens via `handleUserDetailRequest`; Task-First identity stays D-FIND-PERSON | Stay D-PERSON after open; object true/false per day’s occurrence |
| D-UNRECORDED | users adapter + `未記録` chip; row open currently goes to UserDetail | OPTION A: occurrence choice → D-RECORD-WRITE in the same episode |
| D-PROCEDURE completion | CurrentProcedure CTA `この手順を記録` opens ProcedureRecordForm in chrome | Bind as D-PROCEDURE Completion → D-RECORD-WRITE + occurrence true |
| PLANNER / ADMIN_AUDIT | unchanged SHELL-UX-7 surfaces | Regression-only; OUT |
| P2-2 / P2-3 | smoke `.gitignore`; workflow `github.sha` | OUT; do not close inside CORR-1G |

### 1.3 Scout verdict

CORR-1F proved insufficient-context Global resolution only. Sufficient-path Destinations are unit-true and chrome-reachable, but Task-First `sessionContext` cannot become true in Product UI.

CORR-1G therefore unfreezes FIELD_STAFF session context on the existing overview/users adapter surfaces. It does **not** invent Destinations, rewrite CORR-2A/B, or reopen CORR-1F Global labels/order.

`AppShellChrome.tsx` remains forbidden as a second V1 Global. It **is** authorized in §3 for a closed FIELD_STAFF session-context adapter contract, because the Product-visible lists and CTAs already live there. If that contract would require SHELL-UX-7 Global rewrite or a new Destination, STOP (H-3 / H-6 / H-7).

---

## 2. CORR-1G goal

Prove the smallest Product change that makes a FIELD_STAFF usable session satisfy locked packet §2–§4:

```text
object false → true → false via listed events only
occurrence false → true → false via listed events only
occurrence-true requires object-true
D-PROCEDURE / D-RECORD-WRITE Product-reachable after those events
C6 location identity unique per Destination in the §4 table
CORR-1F fallbacks preserved when context is false
```

CORR-1G does **not** claim FS-HTA PASS, PL-HTA, AA-HTA, or three-Role completion.

---

## 3. Exact authorized Product surface

Only the following Product runtime files may change behavior / presentation in CORR-1G:

```text
spfx/src/shell/ux/field-staff-task-navigation.ts
spfx/src/shell/ux/field-staff-task-navigation.test.ts
spfx/src/shell/ux/index.ts                                   (export wiring only)
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.tsx
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.module.scss
spfx/src/shell/ux/AppShellChrome.tsx                         (FIELD_STAFF session-context adapter only; §3.2)
spfx/src/shell/dashboard/TodaySupportDayBoard.tsx            (D-TODAY Primary Action bind / FIELD_STAFF 未実施 CTA only)
spfx/src/shell/dashboard/today-support.test.ts               (label / CTA bind coverage only)
```

`primary-navigation.ts`, domain modules, SharePoint adapters, UsersList.tsx, UserDetail.tsx, CurrentProcedure.tsx, ProcedureRecordForm.tsx, DailyRecords.tsx, and other shell destinations are **OUT** unless a HOLD in §9 fires.

UsersList / UserDetail / CurrentProcedure remain the existing adapter surfaces. CORR-1G must bind their **already-exposed** callbacks from `AppShellChrome.tsx` (person open, back to list, procedure request, record request, day-board select). Do not silently expand into those component files.

### 3.1 Legacy shell adapter rule (CORR-1G; preserves CORR-1F)

```text
D-TODAY          → overview adapter (first paint / Global 今日)
D-PROCEDURE      → users adapter (CurrentProcedure host)
D-RECORD-WRITE   → users adapter (ProcedureRecordForm host)
D-UNRECORDED     → users adapter + existing 未記録 filter chip
D-FIND-PERSON    → users adapter (person index)
D-PERSON         → users adapter (UserDetail host)
```

Rules:

```text
1. Product Destination identity exposed in FIELD_STAFF Task-First UI/state MUST remain the D-* id.
2. Missing context MUST keep CORR-1F fallback identities (手順→D-TODAY, 記録する→D-UNRECORDED).
3. SHELL-UX-7 adapter ids remain implementation transport only.
4. D-PERSON is not a newly invented Destination. Adding it to FieldStaffTaskDestinationId is identity only.
5. Empty D-PROCEDURE / empty D-RECORD-WRITE remain not Destination meanings.
6. Global 探す remains D-FIND-PERSON only.
```

### 3.2 AppShellChrome adapter contract (normative)

`AppShellChrome.tsx` may change only to report FIELD_STAFF Product-visible session-context events to the Task-First owner (`ScaffoldShell`) and to align adapter host surfaces with the already-resolved D-* identity.

Mandatory:

```text
A. AppShellChrome overview/users/records ids are never normative D-* identity.
B. FIELD_STAFF Task-First Global, selected Task, sessionContext, and D-* identity
   are owned by ScaffoldShell + field-staff-task-navigation, not by legacy nav ids.
C. A legacy overview/users transition may be used only as adapter transport behind
   an already-resolved D-* identity.
D. The legacy chrome MUST NOT be presented or interpreted as a second concurrent V1 Global.
E. PLANNER / ADMIN_AUDIT behavior through AppShellChrome remains unchanged
   (regression-only).
F. No SHELL-UX-7 Global row add/remove/reorder.
G. If satisfying AC-1G-1..20 requires UsersList / UserDetail / CurrentProcedure /
   ProcedureRecordForm / DailyRecords / domain / schema file changes, CORR-1G MUST HOLD.
   Do not widen §3 silently.
H. Session-context events the chrome may report are exactly the locked packet events
   needed to apply §2.2 / §2.4 / §3.2 / §3.4. Unlisted chrome events MUST NOT flip flags (H-6).
```

### 3.3 Event binding (normative; not React lock)

| Locked event | Existing Product-visible surface (scout) | Task-First result |
|---|---|---|
| First paint | `ScaffoldShell` initial state | object false, occurrence false, D-TODAY |
| D-TODAY Primary Action episode | FIELD_STAFF TodaySupportDayBoard 未実施 CTA (bind as `対象の支援を始める`) | object true, Destination **D-PROCEDURE** |
| D-TODAY highlight / list visible without that CTA | day-board selected card without CTA | no acquire; no release of sticky true |
| D-PERSON open with current day’s occurrence | UserDetail open when chrome has a current procedure/occurrence for that person | object true, Destination **D-PERSON only** |
| D-PERSON open without current day’s occurrence | UserDetail open when chrome has no current day’s occurrence for that person | RELEASE object+occurrence, stay **D-PERSON**, fallbacks restored |
| D-UNRECORDED occurrence choice | users + 未記録 chip + choosing that unrecorded occurrence (not a person-index open) | OPTION A: object+occurrence true, **D-RECORD-WRITE** |
| D-PROCEDURE Completion | CurrentProcedure record/confirm CTA already hosted in chrome | occurrence true, **D-RECORD-WRITE** |
| Back D-PERSON → D-FIND-PERSON | existing UserDetail back-to-list | RELEASE, Destination **D-FIND-PERSON** |
| Explicit deselect / no remaining chosen object on D-TODAY | Product-visible clear of the D-TODAY chosen object | RELEASE, D-TODAY, fallbacks restored |
| Global 今日 | existing Task-First Global 今日 | D-TODAY; **not** release |
| C4 PA on D-PERSON object true | existing UserDetail `現在の支援手順を確認` when chrome supplies the handler | Destination identity **D-PROCEDURE** (same as Global 手順) |
| C4 PA on D-PERSON object false | withhold / disable that handler | **NOT ACTIONABLE / STAY D-PERSON** |

Replacement uses the Destination of the new acquisition event. Unlisted events do not change meaning.

---

## 4. Locked CORR-2A FIELD_STAFF binding (restated, not replaced)

| Global | Destination (context sufficient) | context不足時の意味 |
|---|---|---|
| 今日 | D-TODAY | N/A |
| 手順 | D-PROCEDURE (object exists via §3.3) | **D-TODAY** acquisition; do not open empty D-PROCEDURE |
| 記録する | D-RECORD-WRITE (occurrence exists via §3.3) | **D-UNRECORDED**; do not open empty D-RECORD-WRITE |
| 未記録 | D-UNRECORDED | N/A |
| 探す | D-FIND-PERSON | N/A |

Global order remains: `今日 · 手順 · 記録する · 未記録 · 探す`.

---

## 5. CORR-2B / C6 FIELD_STAFF binding

```text
D-HOME identity = D-TODAY only (no second Product place)
First paint after usable session = D-TODAY
```

C6 location identity (locked packet §4):

| Destination | Location identity (C6 今どこ) |
|---|---|
| D-TODAY | 今日の支援 |
| D-PROCEDURE | 手順 |
| D-RECORD-WRITE | 記録する |
| D-UNRECORDED | 未記録 |
| D-FIND-PERSON | 探す |
| D-PERSON | この人の支援コンテキスト |

Generic `業務ナビゲーション` for non-today Destinations is **REJECTED**.

---

## 6. Verification surface (authorized)

Only the following CORR-1G-specific verification files may be added/changed:

```text
spfx/src/shell/ux/field-staff-task-navigation.test.ts
spfx/src/shell/dashboard/today-support.test.ts
spfx/smoke/sbs-role-task-first-ia-1/run-smoke.mjs
spfx/smoke/sbs-role-task-first-ia-1/smoke-entry.tsx
```

`.github/workflows/sbs-role-task-first-ia-1-browser-smoke.yml` and `spfx/smoke/sbs-role-task-first-ia-1/.gitignore` are **OUT** (P2-3 / P2-2). Do not “fix” them in this tranche.

Verification must prove CORR-1G only. No LIVE I/O. Smoke PASS ≠ Human Task PASS.

Existing gates must remain PASS where touched:

```text
npx heft test --clean (spfx)
existing a11y / format / lint / typecheck expectations for modified files
```

### 6.1 AC-1G verification mapping (normative)

| AC | Required evidence | Unit | Browser smoke |
|---|---|---|---|
| AC-1G-1 | D-TODAY PA episode → object true, D-PROCEDURE | navigation apply-event table | smoke takes FIELD_STAFF day-board PA and records D-PROCEDURE |
| AC-1G-2 | list visible / highlight without PA does not acquire | unit | smoke highlight/select without PA keeps object false (unless sticky) |
| AC-1G-3 | D-PERSON open + day’s occurrence → object true, stay D-PERSON | unit | smoke person-open with occurrence; destination D-PERSON |
| AC-1G-4 | D-PERSON open − day’s occurrence → RELEASE, stay D-PERSON, fallbacks | unit | smoke person-open without occurrence; 手順→D-TODAY, 記録する→D-UNRECORDED |
| AC-1G-5 | D-UNRECORDED choice OPTION A → object+occurrence true, D-RECORD-WRITE | unit | smoke unrecorded occurrence choice |
| AC-1G-6 | D-PROCEDURE Completion → occurrence true, D-RECORD-WRITE | unit | smoke completion CTA |
| AC-1G-7 | CORR-1F fallbacks when false | existing + regression unit | smoke first-paint 手順/記録する fallbacks still hold |
| AC-1G-8 | Global 手順/記録する sufficient path when true | unit | smoke Global after acquire |
| AC-1G-9 | C6 headings unique per §5 | unit heading table | smoke records 今どこ copy per Destination |
| AC-1G-10 | D-HOME alias D-TODAY only | unit | smoke first paint / Global 今日 |
| AC-1G-11 | C4 PA object false = NOT ACTIONABLE / STAY D-PERSON | unit | smoke asserts no navigation / no mint |
| AC-1G-12 | object true C4 PA and Global 手順 share D-PROCEDURE identity | unit | smoke either control lands D-PROCEDURE |
| AC-1G-13 | first paint object false; no auto D-PROCEDURE | unit + ScaffoldShell initial | smoke first paint D-TODAY |
| AC-1G-14 | presentationRole synthetic FIELD_STAFF; no auth-role invention | compile/diff | smoke synthetic fixture only |
| AC-1G-15 | no Product file outside §3; no domain/schema/LIVE | scope-diff invariant | smoke no LIVE I/O |
| AC-1G-16 | reproducible unit + browser evidence at exact implementation HEAD | required unit PASS | required smoke PASS |
| AC-1G-17 | PLANNER / ADMIN_AUDIT unchanged; P2-2 / P2-3 not closed | diff invariant | smoke must not claim PL/AA V1 Global |
| AC-1G-18 | Global 今日 does not release sticky object | unit | smoke 今日 after acquire still object true |
| AC-1G-19 | occurrence-true requires object-true; D-UNRECORDED choice never leaves object-false | unit | smoke OPTION A episode |
| AC-1G-20 | unlisted events do not change sessionContext | unit H-6 table | smoke does not invent extra toggles |

`AC-1G-15` and `AC-1G-17` are scope/diff invariants in addition to tests.

---

## 7. Explicit OUT (CORR-1G)

```text
PLANNER Global (今の工程 · 探す) and Distinct D-HOME
ADMIN_AUDIT Global (運用確認 · 証跡 · 探す) and D-HOME alias D-OPS
P2-2 smoke .gitignore hygiene
P2-3 smoke evidence merge-ref SHA hygiene
Retiring SHELL-UX-7 Global rows globally in AppShellChrome
New Destinations (Search Hub, context-resolver place, fixture-toggle place)
UsersList.tsx / UserDetail.tsx / CurrentProcedure.tsx / ProcedureRecordForm.tsx
  / DailyRecords.tsx / primary-navigation.ts as authorized mutation
Domain / schema / persistence / SharePoint mutation
LIVE WRITE / Deploy / Entra / App Catalog
SHELL-UX-7 Decision ledger supersede record
Notion production mutation
Workstream P2 Open Questions (quiet 合成 badge; AA-T1 cadence; PLANNER cycle-③)
Human Task Acceptance sign-off
Visual polish unrelated to sufficient-path reachability
unrelated refactor
CORR-1F archive rewrite
CORR-1F Global labels/order rewrite
```

---

## 8. Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1G-1 | D-TODAY chosen object + Primary Action episode sets object true and Destination D-PROCEDURE. |
| AC-1G-2 | D-TODAY list visibility / highlight without that episode does not acquire and does not release sticky true. |
| AC-1G-3 | D-PERSON open with a current day’s occurrence sets object true and stays D-PERSON (not auto D-PROCEDURE). |
| AC-1G-4 | D-PERSON open without a current day’s occurrence RELEASEs object and occurrence, stays D-PERSON, restores Global fallbacks. |
| AC-1G-5 | D-UNRECORDED occurrence choice is one episode: acquire/replace object and acquire occurrence; Destination D-RECORD-WRITE. |
| AC-1G-6 | D-PROCEDURE Completion sets occurrence true and Destination D-RECORD-WRITE. |
| AC-1G-7 | 手順 without object still falls back to D-TODAY; 記録する without occurrence still falls back to D-UNRECORDED. |
| AC-1G-8 | 手順 with object true → D-PROCEDURE; 記録する with occurrence true → D-RECORD-WRITE (same identities as C4 Next). |
| AC-1G-9 | C6 headings match §5; generic non-place label is absent for those Destinations. |
| AC-1G-10 | D-HOME is not a second place; alias = D-TODAY. |
| AC-1G-11 | D-PERSON C4 Primary Action when object false is NOT ACTIONABLE / STAY D-PERSON. |
| AC-1G-12 | When object true, C4 Primary Action and Global 手順 share Destination identity D-PROCEDURE (not a unique control path). |
| AC-1G-13 | Usable-session first paint is D-TODAY with object false; fixtures must not auto-enter D-PROCEDURE. |
| AC-1G-14 | presentationRole remains synthetic; no authorization-role invention. |
| AC-1G-15 | No domain/schema/persistence change and no Product file outside §3. |
| AC-1G-16 | Reproducible unit + browser smoke at exact implementation HEAD. Smoke ≠ Human Task PASS. |
| AC-1G-17 | PLANNER / ADMIN_AUDIT existing surfaces regress fail-closed; P2-2 / P2-3 remain unclosed. |
| AC-1G-18 | Global 今日 returns to D-TODAY without releasing sticky object. |
| AC-1G-19 | occurrence-true never holds while object-false. |
| AC-1G-20 | Unlisted Product-visible events do not change object or occurrence meaning. |

---

## 9. HOLD conditions

| ID | HOLD condition | Required disposition |
|---|---|---|
| H-1 | Locked CORR-1G packet blob is not `9718231d93c572b93cefcd2a54bb8234c3407941` | Stop; recover locked Definition lineage |
| H-2 | Human Definition Lock record blob is not `2577a5f1b03d6355318c83b8f29b070a051752fe` | Stop; recover lock evidence |
| H-3 | Implementer must touch any Product runtime file outside §3 to satisfy AC-1G-1..20 | Stop; issue new Exact Scope; do not expand silently |
| H-4 | Implementer must touch any CORR-1G-specific verification file outside §6 | Stop; amend Scope and re-review before implementation |
| H-5 | FIELD_STAFF AC requires PLANNER / ADMIN_AUDIT Global change | Stop; separate workstream |
| H-6 | Satisfying location identity would make AppShellChrome a second V1 Global | Stop; dual-run still REJECTED |
| H-7 | Satisfying CORR-1G-A/B would require a new Destination | Stop; do not invent; re-packet |
| H-8 | Any work requires domain/schema/persistence/LIVE WRITE/Auth/Entra change | Stop; outside CORR-1G authority |
| H-9 | Implementation base does not contain durable locked packet + Lock + Re-Review-2 before Implementation Start bind | Stop; merge/bind durable Definition lineage first |
| H-10 | A Product-visible event needed to complete the job is not listed in locked packet §2.2 / §2.4 / §3.2 / §3.4 | Stop; do not infer; re-packet |
| H-11 | This Scope is used as Implementation Start | Stop; Scout ≠ Start |

---

## 10. Fresh Independent Scope Review questions

| ID | Question |
|---|---|
| Q1 | Is CORR-1G limited to FIELD_STAFF session-context uniqueness / sufficient-path reachability without PLANNER/ADMIN_AUDIT Global change? |
| Q2 | Are authorized Product files closed under §3 and verification files closed under §6? |
| Q3 | Does §4–§5 restate locked Definition without new Destinations or CORR-2A/B rewrite? |
| Q4 | Are acquisition/release event bindings unique and mapped to existing adapter surfaces? |
| Q5 | Does §3.2 keep AppShellChrome from becoming a second V1 Global while still allowing session-context reporting? |
| Q6 | Do AC-1G-1..20 map to unit/smoke/diff evidence without HTA over-claim? |
| Q7 | Are domain/schema/persistence/LIVE WRITE and P2-2/P2-3 exclusions sufficient? |
| Q8 | Is D-PERSON treated as identity unique-ification, not a new Destination? |
| Q9 | Does this Scope avoid closing P2-2 / P2-3 or workstream Open Questions by side-effect? |
| Q10 | Is durable locked Definition lineage required before Implementation Start bind (§9 H-9)? |
| Q11 | Are CORR-1F fallbacks preserved when context is false? |
| Q12 | Is Implementation Start still NOT AUTHORIZED by this document? |

---

## 11. Review gate

```text
Independent Scope Review PASS CONDITION = P0 0 = P1 0
P2 = non-blocking suggestions only
```

If P0 or P1 exists:

```text
Human Correction Implementation GO eligibility = NOT ELIGIBLE
```

A Scope Review PASS does not itself consume Human Correction Implementation GO.

This Exact Scope document does **not** self-PASS Independent Scope Review.

---

## 12. Deferred / OUT notes (not authorized)

| Item | Disposition |
|---|---|
| P2-2 smoke `.gitignore` | SEPARATE HYGIENE |
| P2-3 smoke `github.sha` binding | SEPARATE VERIFICATION HYGIENE |
| PLANNER Distinct D-HOME | SEPARATE WORKSTREAM |
| ADMIN_AUDIT D-OPS | SEPARATE WORKSTREAM |
| SHELL-UX-7 AppShellChrome retirement | later Scope |
| FS-HTA-1 remainder Human Task | after implementation; not this Scope |
| UsersList / UserDetail / CurrentProcedure source edits | HOLD H-3 if required |

---

## 13. Gate chain (this packet)

```text
Independent Definition Re-Review-2 = REVIEW-CLEARED / CONSUMED
Human Definition Lock GO = RECEIVED / CONSUMED
Human Exact Scope Scout GO = RECEIVED / CONSUMED
Implementation Scope Scout / Exact Scope (CORR-1G) = COMPLETE (this document)
Independent Scope Review = NOT YET
Human Correction Implementation GO = NOT RECEIVED
Product mutation = NOT AUTHORIZED
```

```text
ALLOWED NEXT:
  Independent Scope Review against this Scope body only

NOT AUTHORIZED:
  Human Correction Implementation GO by this document
  Implementation Start / Product mutation
  Ready / Merge / Deploy / LIVE WRITE
```

---

## 14. Exact identity check (this record)

| Item | Value |
|---|---|
| Path | `docs/architecture/sbs-role-task-first-ia-v1-implementation-scope-corr-1g.md` |
| Locked CORR-1G packet blob | `9718231d93c572b93cefcd2a54bb8234c3407941` |
| Human Definition Lock blob | `2577a5f1b03d6355318c83b8f29b070a051752fe` |
| Re-Review-2 HEAD | `3f3531e651e63690a218b5c6168330557a5c6840` |
| Parent packet blob | `5eeb8140772ebfefe050cff93361a6d81c470f81` |
| Scout basis main | `40659c5b459548cc59803562122fdffd77fc0a23` |

The locked Definition authority for this Scope is packet blob `9718231d…`, not the mutable name `main`. `main @ 40659c5b` is scout evidence only.

---

## 15. Durable Definition lineage precondition (P1 before Implementation Start bind)

Before any Implementation Start / Human Correction Implementation bind, the implementation base must include or descend from a durable repository lineage containing:

```text
CORR-1G Complete Controlled Packet blob
= 9718231d93c572b93cefcd2a54bb8234c3407941

CORR-1G Human Definition Lock record blob
= 2577a5f1b03d6355318c83b8f29b070a051752fe

Independent Definition Re-Review-2 record
= present and bound to the same locked packet
```

If the implementation base is still a `main` commit that does not contain these artifacts, this is **P1 / HOLD for Implementation Start bind**, not a non-blocking P2.

This section does not authorize merging any branch.

---

## 16. FIELD_STAFF-only proof boundary (normative)

CORR-1G may claim only the following after implementation (still requiring later Implementation Review + Human Task as separate gates):

```text
FIELD_STAFF session-context false→true→false via listed events = in scope
FIELD_STAFF Product-reachable D-PROCEDURE / D-RECORD-WRITE = in scope
FIELD_STAFF unique C6 identities in §5 = in scope
FIELD_STAFF CORR-1F fallbacks preserved = in scope

PLANNER CORR-2A/B = not proven
ADMIN_AUDIT CORR-2A/B = not proven
Global SHELL-UX-7 retirement = not proven
Human Task Acceptance PASS = not proven by unit/smoke
P2-2 / P2-3 = not closed
```

Passing AC-1G-1..20 therefore proves the CORR-1G tranche only.

```text
Human Correction Implementation GO = NOT RECEIVED
Implementation Start = NOT AUTHORIZED
Product mutation = NOT AUTHORIZED
NEXT = Independent Scope Review
STOP = no Product implementation; no Human Correction Implementation GO consumption
     = no Ready / Merge / Deploy / LIVE WRITE
     = no locked packet rewrite
     = no self-PASS of Independent Scope Review
```
