# SBS-PLANNER-PL-HTA-CORRECTION-1 — Exact Scope Definition-1 (Draft)

Docs-only Exact Scope for SBS-PLANNER-PL-HTA-CORRECTION-1. This record converts the Human-Locked Definition plus current-main Product evidence into a finite Product / verification surface. It does **not** implement the Product, does **not** consume Human Scope Lock, and does **not** authorize Implementation Start.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-PLANNER
unit: SBS-PLANNER-PL-HTA-CORRECTION-1
kind: Exact Scope Definition-1 (Draft)
mode: READ ONLY SCOUT → DOCS-ONLY EXACT SCOPE AUTHORSHIP
date: 2026-09-18
status: COMPLETE / AWAITING FRESH INDEPENDENT SCOPE REVIEW

basis main: 7414f9d08f6fcf64829fad66c3df2355e94b0bc7
scout HEAD (this branch; docs lineage only): 4f3b4c73b58d48a92d654a03287b42d7ac65b7b9

locked packet path:
  docs/architecture/sbs-planner-pl-hta-correction-1-complete-controlled-packet.md
locked packet blob: 69843eeb3b4a50fe19c26391c4605d399ec95fd0
locked packet HEAD: d798ff626b52ccced2bc203f74c05dbe1b5fb4da
Definition Lock record:
  docs/architecture/sbs-planner-pl-hta-correction-1-human-definition-lock.md
Definition Lock blob: 182d57fc88867c4b8297800514e08e0d8fcade12
Definition Lock HEAD: 4f3b4c73b58d48a92d654a03287b42d7ac65b7b9
Independent Definition Review-1: PASS / REVIEW-CLEARED / CONSUMED
  record: docs/architecture/sbs-planner-pl-hta-correction-1-independent-definition-review-1.md
  record HEAD: a1546efcb2f4557976e340946b658921d56fc644
  record blob: 855d4c1400924b11c2bb93ff71df908ea7fbad07
  P0 = 0
  P1 = 0
  P2 = 2 (NON-BLOCKING at Definition; CLOSED OPERATIONALLY HERE)

historical PL-HTA FAIL identity (preserved; not rewritten to PASS):
  docs/architecture/sbs-planner-pl-hta-human-task-acceptance-decision.md
  blob: 7b40da2888edbba21a368db7f7c0cc72a94a6460
  Human Task Acceptance: FAIL / NOT CONFIRMED
  PL-HTA-1: FAIL
  PL-HTA-2: FAIL

GAP-A orientation Decision (CONSUMED; not a second Definition):
  docs/architecture/sbs-planner-pl-hta-correction-1-gap-a-human-semantic-decision.md
  blob: 1be24b2886d0ede64de348aac5de6df4c5c85b4e

parent Correction-2 packet blob: 5eeb8140772ebfefe050cff93361a6d81c470f81
parent PLANNER Top-Level packet blob: 4c80f67e0a05f6ff10036ee1f44f1be9e16bab73
FE-F002 packet blob: f0aa82f6edb5f8687baba6482c37d42c43dc605d

Human Definition Lock: RECEIVED / CONSUMED (prior Lock record; not consumed by this Scope)
Independent Scope Review: NOT YET
Human Scope Lock: NOT ELIGIBLE / NOT CONSUMED
Combined Definition / Scope Lock: NOT CONSUMABLE / NOT CONSUMED
Implementation Start: NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
Product / SPFx / domain / schema mutation by this document: NONE
New PL-HTA execution: NOT AUTHORIZED
Historical PL-HTA FAIL rewrite to PASS: FORBIDDEN
Rewrite locked this-unit packet blob 69843eeb…: NOT AUTHORIZED
Rewrite locked parent packets: NOT AUTHORIZED
ADMIN_AUDIT Task-First: OUT
```

Creating or reviewing this Scope does **not** authorize Product mutation and does **not** consume Human Scope Lock or Implementation Start.

Human Definition Lock ≠ Exact Scope complete ≠ Independent Scope Review PASS ≠ Human Scope Lock ≠ Implementation Start ≠ Ready ≠ Merge ≠ PL-HTA PASS.

If the this-unit packet blob is not `69843eeb3b4a50fe19c26391c4605d399ec95fd0`, this Scope does not apply.

---

## 1. Identity / authority

```text
TASK CLASS = SCOUT → DEFINITION AUTHORSHIP
RISK = MEDIUM
Product Mutation = FORBIDDEN (this record)
Human Gate Consumption = FORBIDDEN (this record)
```

Authority order for this Scope:

1. Locked Complete Controlled Packet blob `69843eeb3b4a50fe19c26391c4605d399ec95fd0`
2. Human Definition Lock record blob `182d57fc88867c4b8297800514e08e0d8fcade12`
3. Independent Definition Review-1 PASS / REVIEW-CLEARED (P0=0 / P1=0 / P2=2)
4. Current-main Product evidence at `7414f9d08f6fcf64829fad66c3df2355e94b0bc7`

This Scope restates locked meaning only as far as needed to close a finite implementation surface. It does not rewrite the packet.

---

## 2. Locked Definition bind (unrewritten)

Preserve CORR-A through CORR-F and A1–A14.

```text
CORR-A  no lawful person/plan context
        → cycle unknown / D-HOME fail-closed / Primary Action must not guess
CORR-B  lawful context AND Destination = D-PLAN
        → existing SupportPlan for that person/plan
        Current vs Draft/次版 not collapsed into 適用中
CORR-C  lawful context AND Destination = D-MONITOR
        → existing MonitoringView for that person/plan
        0件 ≠ 実施できなかった
CORR-D  after lawful context, cycle source
        = that plan’s PROCESS-VISIBILITY-UI-V1 in-flow current section
        else remain unknown
CORR-E  Global 探す remains D-FIND-PERSON
CORR-F  ③ remains D-FIND-RECORD → selected → D-RECORD-READ
```

Locked Primary Action map (unchanged identities):

```text
① D-ASSESS
② D-PLAN
③ D-FIND-RECORD → selected → D-RECORD-READ
④ D-MONITOR
⑤ D-REVIEW
⑥ D-NEXT
unknown → Primary Action disabled
```

React / reducer / store ownership is **not** locked. This Scope names the minimum parent/child contracts required for context + Destination bind.

---

## 3. Current-main evidence (informative; not a code Lock)

Observed on basis main `7414f9d08f6fcf64829fad66c3df2355e94b0bc7` (historical HTA FAIL facts; not re-executed here).

| Surface | Observation | Scope impact |
|---|---|---|
| `planner-task-navigation.ts` | Global 今の工程 / 探す; Destination ids locked; `shellAdapterForPlannerDestination` sends D-PLAN / D-MONITOR to `overview`; default cycle `unknown`; smoke may inject cycle via `SET_CYCLE` / `initialPlannerCycle`. | Destination **ids** REGRESSION. Adapter + context/cycle **events** IN as needed. |
| `ScaffoldShell.tsx` `renderPlannerTaskLayer` | D-PLAN / D-MONITOR = heading + generic hint + 戻る. Does not mount SupportPlan / MonitoringView. | **IN.** Must bind Destination bodies when context exists; fail-closed when not. |
| `AppShellChrome.tsx` | PLANNER `users` adapter shows `SupportPlanManagementList`. `existing-plan` (Aさん / `user-a`) opens `SupportPlan`. Other rows → synthetic-detail / create. Overview remains under Task-First when adapter = `overview`. | **IN** for Destination host bind + notifying lawful context. List/KPI redesign OUT. |
| `SupportPlan.tsx` | Existing business surface. PLANNER PROCESS-VISIBILITY ①計画…⑥次版準備. `activePlannerSectionId` is local. Default first section = `planner-process-plan-heading`. Current = 「現行版」「適用中」; Draft = 「下書き」. `MonitoringView` nested in ④. | **IN** only for a minimum active-section report. Copy / layout / version semantics OUT. |
| `support-plan-copy.ts` | `PLANNER_SUPPORT_PLAN_PROCESS_NAVIGATION` labels. Current/Draft copy. | **OUT / REGRESSION.** Do not rewrite vocabulary. |
| `MonitoringView.tsx` | `data-monitoring-zero-not-not-performed` copy: 0件 ≠ 実施できなかった. | **OUT / REUSE.** Do not clone a second monitoring UI. |
| `support-plan-management-list-nav.ts` | `existing-plan` iff row.userId === existing fixture user. | **OUT / REUSE.** Lawful list acquisition uses this function as-is. |
| `support-plan-fixture.ts` | Only existing-plan identity: `userId=user-a`, `planId=synthetic-plan-001`. | Context identity for Demo. Do not invent additional live plans. |
| `ScaffoldShell.module.scss` | Hides SHELL-UX-7 primary-nav for PLANNER. | **OUT** unless H-8 fires. |
| Smoke `?cycle=` | Role-binding / Top-Level harnesses inject cycle. Product Demo first paint without injection = `unknown`. | A2: not Product truth. This-unit proof MUST NOT use `?cycle=` to bind D-PLAN / D-MONITOR. Parent smokes remain regression. |
| FIELD_STAFF / ADMIN_AUDIT | Task-First FIELD_STAFF unchanged. ADMIN_AUDIT chrome-local leftover. | **OUT / REGRESSION.** |

Historical FAIL (must remain FAIL until a later Human PL-HTA, not this Scope): D-PLAN / D-MONITOR headings over Overview「今日の支援」.

---

## 4. P2 operational close

### 4.1 P2-1 — first SupportPlan acquisition / Global 探す

**CLOSED for this Scope.**

```text
First acquisition of lawful person/plan context in the Demo PLANNER usable session
  = Global「探す」(D-FIND-PERSON)
    → chrome users adapter
    → existing SupportPlanManagementList
    → row action that resolves to kind = existing-plan
    → existing SupportPlan opens
    → context { userId, planId } becomes live

Global「探す」 remains D-FIND-PERSON.
Global「探す」 is NOT D-PLAN.
The list is NOT D-PLAN.
Only the opened existing SupportPlan identity is lawful context (A3).
```

Demo exclusive existing-plan row (current fixture; not a new store):

```text
userId = user-a
planId = synthetic-plan-001
selector (verification):
  button[data-demo-ux="support-plan-mgmt-action"][data-support-plan-mgmt-user-id="user-a"]
```

Not lawful context (unique):

```text
presentationRole = PLANNER alone
Global「今の工程」alone
smoke-only initialPlannerCycle / ?cycle=
kind = synthetic-detail (including Bさん / user-b)
kind = create
UserDetail without SupportPlan open
organization-wide / session-global lifecycle without that identity
```

Secondary existing path: chrome UserDetail `onSupportPlanRequest` for the same `user-a` fixture may also open the same existing SupportPlan and therefore **may** establish the same context. It is not a new Global and must not replace 探す → D-FIND-PERSON.

Context lifetime (unique):

```text
LIVE while that existing SupportPlan identity is open
ENDED when that SupportPlan is left (back to list / preview cleared / role leaves PLANNER)
On end: currentCycle = unknown; Primary Action fail-closed;
        Destination must not keep impersonating SupportPlan / MonitoringView for a guessed person
        (return to D-HOME fail-closed)
```

### 4.2 P2-2 — rendered screenshot / evidence paths

**CLOSED for this Scope.**

Two disjoint evidence classes. Do not mix.

**Class H — historical PL-HTA FAIL (correspondence only; not this-unit acceptance; not repository SSOT):**

| Filename | Path |
|---|---|
| `pl-hta-01-home-unknown-cycle.png` | `/opt/cursor/artifacts/pl-hta-01-home-unknown-cycle.png` |
| `pl-hta-02-find-person-list.png` | `/opt/cursor/artifacts/pl-hta-02-find-person-list.png` |
| `pl-hta-05-d-plan-destination.png` | `/opt/cursor/artifacts/pl-hta-05-d-plan-destination.png` |
| `pl-hta-06-d-monitor-destination.png` | `/opt/cursor/artifacts/pl-hta-06-d-monitor-destination.png` |
| `pl-hta-08-existing-support-plan-off-path.png` | `/opt/cursor/artifacts/pl-hta-08-existing-support-plan-off-path.png` |
| `hta-eval.json` | `/opt/cursor/artifacts/sbs-planner-pl-hta-evaluation/hta-eval.json` |

Class H proves the historical FAIL. It must not be cited as post-implementation PASS.

**Class V — this-unit rendered acceptance (implementation HEAD only; created by §6 harness):**

```text
directory (default):
  /opt/cursor/artifacts/sbs-planner-pl-hta-correction-1-browser-smoke
env override:
  SBS_PLANNER_PL_HTA_CORR_1_ARTIFACTS_DIR

required captures:
  01-no-context-unknown-fail-closed.png
  02-find-person-list-not-d-plan.png
  03-synthetic-detail-not-context.png
  04-existing-plan-establishes-context.png
  05-d-plan-bound-support-plan.png
  06-d-monitor-bound-monitoring-view.png
  07-zero-not-not-performed.png
  08-no-overview-as-d-plan.png

required machine log:
  smoke-results.json
```

Implementation evidence document (created only in the separately authorized implementation PR, not by this Draft):

```text
docs/architecture/sbs-planner-pl-hta-correction-1-browser-smoke.md
```

```text
P2-1 = CLOSED (acquisition path unique; 探す not promoted)
P2-2 = CLOSED (Class H vs Class V paths unique)
```

---

## 5. Exact Product IN surface

Only the following Product runtime files may change behavior / presentation in this unit:

```text
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.tsx
spfx/src/shell/ux/planner-task-navigation.ts
spfx/src/shell/ux/AppShellChrome.tsx
spfx/src/shell/users/SupportPlan.tsx
```

`planner-task-navigation.test.ts` is verification IN (see §6), not a Product runtime file.

### 5.1 Authorized change per file

**`planner-task-navigation.ts`**

Authorized:

```text
Keep locked Destination ids / Global labels / Primary Action map.
Add the minimum person/plan context + cycle-resolution helpers/events so that:
  no context → currentCycle unknown (Product meaning)
  context live → currentCycle from §5.4 map only
  context ended → unknown
Do not add Destinations.
Do not map Global 探す to D-FIND-RECORD or D-PLAN.
```

`shellAdapterForPlannerDestination` MAY change so D-PLAN / D-MONITOR with live context do not use `overview` as the Destination body host. Without context, D-PLAN / D-MONITOR MUST NOT use Overview「今日の支援」as Destination meaning (A7).

Forbidden inside this file:

```text
new D-* identities
Global row add/remove/reorder
D-RECORD-WRITE
Product-visible cycle selector
treating smoke cycle as lawful context
```

**`ScaffoldShell.tsx`**

Authorized:

```text
Own PLANNER Task-First Destination identity (already).
Apply context-ended / context-live rules.
When Destination = D-PLAN and context live: Destination meaning = existing SupportPlan.
When Destination = D-MONITOR and context live: Destination meaning = existing MonitoringView.
When no context: keep D-HOME fail-closed; do not let Primary Action invent a person/plan.
Do not mount Overview as D-PLAN / D-MONITOR meaning.
Notify / consume chrome events for existing-plan open / SupportPlan close / PV section.
Smoke injection initialPlannerCycle MAY remain for parent-unit regression only.
  This-unit Product meaning: injection ≠ lawful context.
  This-unit proof harness MUST NOT rely on injection to bind D-PLAN / D-MONITOR.
```

Forbidden inside this file:

```text
ADMIN_AUDIT Task-First
FIELD_STAFF semantic rewrite
new Destinations
promoting smoke injection into IScaffoldShellProps
Product cycle selector UI
```

**`AppShellChrome.tsx`**

Authorized:

```text
Minimum host bind so that:
  PLANNER D-FIND-PERSON continues to show SupportPlanManagementList
  existing-plan open is observable as lawful context to ScaffoldShell
  D-PLAN with context hosts existing SupportPlan (same component, same fixture identity)
  D-MONITOR with context hosts existing MonitoringView (same component as SupportPlan ④)
  Overview is not the D-PLAN / D-MONITOR Destination body
  synthetic-detail / create rows remain NOT context
FIELD_STAFF / ADMIN_AUDIT chrome behavior unchanged (regression).
```

Forbidden inside this file:

```text
chrome architecture redesign
SHELL-UX-7 Global unhide / rewrite
list·KPI / card / form redesign
ADMIN_AUDIT Task-First
Entra / authorization
new Destinations
```

**`SupportPlan.tsx`**

Authorized:

```text
Minimum report of the in-flow PROCESS-VISIBILITY active section id
  (already stored as activePlannerSectionId)
so the parent can apply §5.4.
No copy rewrite. No layout redesign. No version-semantics rewrite.
MonitoringView remains nested in ④ as today.
```

Forbidden inside this file:

```text
new process vocabulary
rewriting ①計画…⑥次版準備 labels
collapsing Current/Draft
removing MonitoringView from ④
CSS / card redesign
```

### 5.2 Person/plan context acquisition boundary

```text
Lawful context
  = PLANNER presentation session
    AND existing SupportPlan identity is open
    AND that identity is the Demo existing-plan fixture
        (user-a / synthetic-plan-001) or the same rule via
        resolveSupportPlanManagementListNext kind=existing-plan

Acquisition IN:
  1. D-FIND-PERSON → list → existing-plan row (P2-1 primary)
  2. existing UserDetail SupportPlan CTA for that same identity (secondary; not Global)

Acquisition OUT:
  smoke cycle, Demo role alone, synthetic-detail, create, guessed user
```

### 5.3 D-PLAN binding boundary

```text
WHEN lawful context AND destination = D-PLAN
THEN the Destination body is the existing SupportPlan for that person/plan
AND Current is Human-readable (現行版 / 適用中) using existing copy
AND Draft / 次版 / 下書き is not readable as 適用中
AND PROCESS-VISIBILITY in-flow ①–⑥ remains on that SupportPlan
AND 次の工程 ④ or ⑤ remains reachable in-flow (no new Global rows)
AND Overview「今日の支援」is not the Destination meaning

WHEN destination = D-PLAN AND NOT lawful context
THEN do not mount SupportPlan for a guessed person
AND do not present Overview as 支援計画
AND do not treat smoke cycle as making D-PLAN “done”
```

Reuse `spfx/src/shell/users/SupportPlan.tsx`. Do not create a second plan UI.

### 5.4 D-MONITOR binding boundary

```text
WHEN lawful context AND destination = D-MONITOR
THEN the Destination body is the existing MonitoringView for that person/plan
     (component: spfx/src/shell/monitoring/MonitoringView.tsx)
AND 0件 remains absence of matching records in the period/plan version
AND 実施できなかった remains a distinct recorded result
AND Browser Smoke PASS / allPass is not shown as business completion
AND Overview「今日の支援」is not the Destination meaning

WHEN destination = D-MONITOR AND NOT lawful context
THEN do not mount MonitoringView for a guessed person
AND do not present Overview as モニタリング
```

Reuse existing MonitoringView. Do not create a second monitoring UI. SupportPlan ④ may continue to nest the same component (in-flow). D-MONITOR Destination meaning is that component as the Task-First Destination body, not a clone.

### 5.5 Cycle source after context (CORR-D operational map)

PROCESS-VISIBILITY in-flow vocabulary (LOCKED; do not rewrite):

```text
planner-process-plan-heading          ① 計画
planner-process-support-heading       ② 支援
planner-process-records-heading       ③ 記録
planner-process-monitoring-heading    ④ モニタリング
planner-process-review-heading        ⑤ 見直し
planner-process-next-version-heading  ⑥ 次版準備
```

Task-First cycle vocabulary (LOCKED; do not rewrite):

```text
① D-ASSESS アセスメント
② D-PLAN 支援計画
③ D-FIND-RECORD
④ D-MONITOR モニタリング
⑤ D-REVIEW 見直し
⑥ D-NEXT 次版準備
```

**REJECTED:** glyph identity (PV「① 計画」= cycle ① D-ASSESS). That would send Primary Action to アセスメント after opening a plan.

Exclusive map after lawful context (implementers must not pick another):

| Active PV section id | PlannerCyclePosition | Primary Action Destination |
|---|---|---|
| `planner-process-plan-heading` | `②` | D-PLAN |
| `planner-process-support-heading` | `unknown` | none (no Task-First Destination for「支援」; do not invent D-SUPPORT; do not map to D-ASSESS) |
| `planner-process-records-heading` | `③` | D-FIND-RECORD |
| `planner-process-monitoring-heading` | `④` | D-MONITOR |
| `planner-process-review-heading` | `⑤` | D-REVIEW |
| `planner-process-next-version-heading` | `⑥` | D-NEXT |
| none / context ended / unknown section | `unknown` | none |

```text
D-ASSESS (cycle ①) is NOT sourced from PROCESS-VISIBILITY in this unit.
SupportPlan has no アセスメント section.
Do not invent an アセスメント surface here.
Default on first lawful open (active section = planner-process-plan-heading)
  → currentCycle = ②
  → Primary Action → D-PLAN
```

This map operationalizes CORR-D. It does not rewrite locked Destination identities or PV labels.

### 5.6 No-context fail-closed (preserve)

```text
Product Demo PLANNER first paint (no lawful context):
  currentCycle = unknown
  Destination = D-HOME
  Primary Action disabled
  no invented person/plan
  Overview is not D-PLAN / D-MONITOR meaning
```

---

## 6. Exact verification IN surface

### 6.1 Dedicated this-unit proof harness (IN)

```text
spfx/smoke/sbs-planner-pl-hta-correction-1/smoke-entry.tsx     (new)
spfx/smoke/sbs-planner-pl-hta-correction-1/run-smoke.mjs       (new)
.github/workflows/sbs-planner-pl-hta-correction-1-browser-smoke.yml  (new / REQUIRED)
spfx/src/shell/ux/planner-task-navigation.test.ts             (extend)
```

Optional generated smoke artifacts (`index.html` / `smoke-bundle.js` / `smoke-production.css` / `.gitignore`) may be created by `run-smoke.mjs`. They are not additional Product surface.

Harness rules:

```text
Mount normal Product ScaffoldShell / Demo fixture (same as FE-F002).
Do NOT pass presentationRole: "PLANNER" as the acceptance path.
Do NOT use ?cycle= / initialPlannerCycle as the D-PLAN / D-MONITOR bind proof.
Role selection = Demo presentation-role entrance (計画担当).
Person/plan acquisition = Global 探す → user-a existing-plan action.
Synthetic-detail (user-b) must be asserted as NOT context.
Desktop required. 390×844-class required for Destination bind readability
  (verification of existing surfaces; CSS redesign OUT).
Synthetic / presentation only. No LIVE WRITE / tenant I/O / Deploy.
Class V screenshots + smoke-results.json as in §4.2.
```

Required sequence:

```text
FIELD_STAFF or Demo first paint
→ Demo select PLANNER
→ assert cycle unknown, Primary Action disabled (A1)
→ Global 探す → D-FIND-PERSON list (A8) (capture 02)
→ user-b / synthetic-detail → NOT SupportPlan Current/Draft context (capture 03)
→ back / list
→ user-a existing-plan → SupportPlan open = lawful context (A3) (capture 04)
→ Destination D-PLAN = that SupportPlan; Current vs Draft not collapsed (A4) (capture 05 / 08)
→ Destination D-MONITOR = MonitoringView; 0件 copy present (A5 / A6) (capture 06 / 07)
→ leave SupportPlan → cycle unknown again
→ Browser Smoke PASS string not shown as business completion on D-MONITOR (A14)
```

### 6.2 Unit tests (IN)

Extend `planner-task-navigation.test.ts` for:

```text
no context → unknown / PA undefined
§5.4 map uniqueness
探す still D-FIND-PERSON
no new Destinations
context-ended → unknown
```

Do not weaken existing AC-PL-TL-* cases. Parent `SET_CYCLE` tests may remain as module-level map tests; they are not Product context proof.

If `SupportPlan.tsx` gains a section-report callback, existing `support-plan.test.ts` MAY gain one assertion that the callback fires with `planner-process-plan-heading` on PLANNER. If a new SupportPlan test file is required: **STOP = SCOPE EXPANSION REQUIRED** (H-5).

### 6.3 Verification OUT / regression-only

```text
spfx/smoke/sbs-planner-top-level-ia-v1/**              REGRESSION ONLY
spfx/smoke/sbs-planner-product-role-binding-v1/**      REGRESSION ONLY
spfx/smoke/sbs-role-task-first-ia-1/**                 REGRESSION ONLY
spfx/src/shell/ux/field-staff-task-navigation.test.ts  REGRESSION ONLY
spfx/src/shell/users/support-plan.test.ts              REGRESSION (Current/Draft / PV labels)
spfx/src/shell/monitoring/MonitoringView.test.tsx      REGRESSION (0件 copy)
spfx/src/shell/monitoring/HumanReviewView.test.tsx     REGRESSION
Class H historical PNGs                               NOT this-unit acceptance
```

Parent PLANNER smokes MAY continue to inject `?cycle=` for Destination-identity regression. They must **not** be cited as this-unit D-PLAN / D-MONITOR business bind. If parent smoke asserts Overview as the D-PLAN body, **HOLD H-10** — do not silently keep Overview to protect an old assertion.

---

## 7. OUT / regression-only Product surface

| Path | Class | Reasoning |
|---|---|---|
| `ScaffoldShellWebPart.ts` / `IScaffoldShellProps.ts` | **OUT** | No Product `presentationRole` / cycle prop expansion. |
| `ScaffoldShell.module.scss` | **OUT** unless H-8 | Do not unhide SHELL-UX-7; no visual redesign. |
| `DemoPresentationRoleEntry.tsx` | **OUT** | FE-F002 already sufficient. |
| `field-staff-task-navigation.ts` | **REGRESSION** | FIELD_STAFF unchanged. |
| `presentation-role.ts` | **OUT** | Synthetic roles already include PLANNER. |
| `primary-navigation.ts` | **OUT / REGRESSION** | SHELL-UX-7 not V1 Global. |
| `support-plan-copy.ts` | **OUT / REGRESSION** | PV labels / Current-Draft copy stay. |
| `MonitoringView.tsx` / `MonitoringViewUx.module.scss` | **OUT / REUSE** | Bind existing; no redesign. |
| `HumanReviewView.tsx` | **OUT** | Nested in MonitoringView; not this Destination rewrite. |
| `SupportPlanManagementList.tsx` / list copy / KPI / fixture / nav | **OUT / REUSE** | 探す list stays D-FIND-PERSON host. |
| `SupportPlanManagementNextSurface.tsx` | **OUT / REUSE** | synthetic-detail remains NOT context. |
| domain / schema / SharePoint adapters / Entra / property pane | **OUT** | persistence OUT. |
| D-ASSESS / D-REVIEW / D-NEXT rich bind | **OUT** | This unit binds D-PLAN and D-MONITOR only. Placeholders may remain. |
| ADMIN_AUDIT Task-First / FE-F001 / FE-F003 | **OUT** | |

---

## 8. Observable acceptance (A1–A14 → this-unit SC)

Evidence must be reproducible at the implementation HEAD via §6. A1–A14 ≠ PL-HTA PASS.

| ID | Locked A | This-unit observable | Evidence |
|---|---|---|---|
| SC-1 | A1 | No context → cycle unknown; Primary Action disabled | capture 01 + harness |
| SC-2 | A2 | Smoke `?cycle=` is not the bind proof; Product context is SupportPlan identity | harness must not use cycle query for SC-5/SC-6 |
| SC-3 | A3 | user-a existing-plan open establishes context; user-b does not | captures 03 / 04 |
| SC-4 | A4 / GAP-B | D-PLAN body = existing SupportPlan; Current vs Draft not collapsed | capture 05; `data-demo-ux="support-plan"` |
| SC-5 | A5 / GAP-C | D-MONITOR body = existing MonitoringView | capture 06 |
| SC-6 | A6 | 0件 copy `data-monitoring-zero-not-not-performed` present and distinct from 実施できなかった | capture 07; MonitoringView tests still PASS |
| SC-7 | A7 | D-PLAN / D-MONITOR do not present Overview「今日の支援」as Destination meaning | capture 08 |
| SC-8 | A8 | 探す = D-FIND-PERSON; list is not D-PLAN | capture 02 |
| SC-9 | A9 | ③ still D-FIND-RECORD → D-RECORD-READ | existing planner-task-navigation tests |
| SC-10 | A10 | PV remains in-flow on SupportPlan; no new Global rows | SupportPlan still has ①–⑥ process nav; Global still 2 items |
| SC-11 | A11 | FIELD_STAFF Task-First unchanged | FIELD_STAFF smoke / tests |
| SC-12 | A12 | ADMIN_AUDIT Task-First not introduced | diff invariant |
| SC-13 | A13 | No new Destination identities | diff + planner-task-navigation tests |
| SC-14 | A14 | Smoke PASS not shown as business completion on D-MONITOR | harness D-MONITOR text |

---

## 9. Regression surfaces

Implementation (when separately authorized) MUST keep:

```text
FIELD_STAFF Task-First / CORR-1F / CORR-1G
existing PLANNER Global 今の工程 · 探す
existing Destination ids
existing SupportPlan Current / Draft / 下書き copy
existing PROCESS-VISIBILITY ①計画…⑥次版準備 labels
existing MonitoringView 0件 copy
existing 探す → SupportPlanManagementList
FE-F002 Demo role-binding
parent PLANNER smokes as regression (injection allowed only as regression)
ADMIN_AUDIT leftover unrestored as completion
historical PL-HTA FAIL record unrewritten
root verify applicable on implementation PR
spfx heft test --clean on implementation PR (Product runtime)
```

Dedicated-harness PASS ≠ PL-HTA PASS. Later PL-HTA remains a separate Human gate.

---

## 10. Scope invariants

```text
I-1  Product IN files are exactly the four paths in §5.
I-2  Verification IN files are exactly §6.1 + §6.2.
I-3  Packet blob remains 69843eeb3b4a50fe19c26391c4605d399ec95fd0.
I-4  探す = D-FIND-PERSON; never D-PLAN; never D-FIND-RECORD.
I-5  D-PLAN = existing SupportPlan; D-MONITOR = existing MonitoringView.
I-6  No context → unknown / fail-closed.
I-7  Cycle after context = §5.4 map only.
I-8  FIELD_STAFF unchanged; ADMIN_AUDIT unchanged.
I-9  Historical PL-HTA FAIL identity unchanged.
I-10 This Scope does not consume Human Scope Lock or Implementation Start.
I-11 Class H screenshots are not Class V acceptance.
```

HOLD (implementation-time; not consumed now):

| ID | HOLD | Disposition |
|---|---|---|
| H-1 | Locked packet blob ≠ `69843eeb…` | Stop; recover Definition lineage |
| H-2 | Definition Lock blob ≠ `182d57fc…` or Review-1 not PASS | Stop; recover Lock lineage |
| H-3 | Parent Correction-2 blob ≠ `5eeb8140…` or Top-Level ≠ `4c80f67e…` | Stop; re-bind |
| H-4 | Product file outside §5 required | STOP = SCOPE EXPANSION REQUIRED |
| H-5 | Verification file outside §6 required | STOP = SCOPE EXPANSION REQUIRED |
| H-6 | Binding requires persistence / SharePoint / schema / Entra | STOP = DEFINITION CONFLICT |
| H-7 | Binding requires new Destinations or Global rows | STOP = DEFINITION CONFLICT |
| H-8 | Binding requires CSS / card / SupportPlan visual redesign | STOP = SCOPE EXPANSION REQUIRED; do not silent-expand |
| H-9 | Implementation base lacks durable packet + Lock + Review | Stop; bind lineage before Implementation Start |
| H-10 | Parent smoke requires Overview as D-PLAN / D-MONITOR body | Stop; do not keep Overview to protect regression |
| H-11 | 探す mapped to D-PLAN or D-FIND-RECORD | Stop; locked violation |
| H-12 | synthetic-detail treated as lawful context | Stop; locked violation |
| H-13 | smoke `?cycle=` used as this-unit bind proof | Stop; A2 violation |
| H-14 | PV「① 計画」mapped to cycle ① D-ASSESS | Stop; §5.4 unique map |
| H-15 | ADMIN_AUDIT Task-First or FIELD_STAFF rewrite claimed | Stop |
| H-16 | This Scope treated as PL-HTA PASS | Stop |
| H-17 | Combined Definition / Scope Lock consumed | Stop |

If repository reality requires behavior outside the locked Definition: **STOP = DEFINITION CONFLICT**.

---

## 11. Forbidden changes

```text
ADMIN_AUDIT Task-First / FE-F001 / FE-F003
AA-HTA / FS-HTA-2
new Destinations / Search Hub / session-global lifecycle store
SupportPlan / MonitoringView visual redesign
rewrite locked Correction-2 / Top-Level / FE-F002 / this-unit packet
reconstruct #667 Re-Review-4
fabricate #674 Human Merge GO
Global 探す → D-FIND-RECORD or D-PLAN
promote smoke cycle to Product truth
Product-visible cycle selector
LIVE WRITE / Deploy / Entra / SharePoint / schema
Ready / Merge / Issue close
Human Scope Lock consumption by this record
Implementation Start consumption by this record
historical PL-HTA FAIL rewritten to PASS
SHELL-UX-7 dual-run as Product target
```

---

## 12. Implementation order (docs-only plan; not Start GO)

```text
1. Context + §5.4 helpers in planner-task-navigation.ts + tests
2. SupportPlan minimum section report
3. AppShellChrome existing-plan / close notify + Destination host bind
4. ScaffoldShell consume context; D-PLAN / D-MONITOR bodies; fail-closed
5. Dedicated smoke harness + workflow + Class V captures
6. Regression: FIELD_STAFF / parent PLANNER / SupportPlan / MonitoringView tests
```

Single implementation PR is sufficient. Do not split Destination bind from context acquisition (A3 without A4/A5 is incomplete).

Issue breakdown: none to open in this Draft. Issue close remains unauthorized.

---

## 13. STOP / NEXT

```text
RESULT: Exact Scope Definition-1 DRAFT COMPLETE
Independent Scope Review = NOT YET
Human Scope Lock = NOT CONSUMED
Implementation Start = NOT AUTHORIZED
PL-HTA = FAIL identity preserved
P2-1 = CLOSED operationally
P2-2 = CLOSED operationally
```

```text
STOP = no Product implementation from this Draft
     = no Human Scope Lock
     = no Implementation Start
     = no Ready / Merge / Deploy
     = no PL-HTA re-run
     = no locked packet rewrite
NEXT = Fresh Independent Scope Review (this body only)
     → only if PASS / REVIEW-CLEARED: separate Human Scope Lock
     → only after Scope Lock: Human Implementation Start GO
```
