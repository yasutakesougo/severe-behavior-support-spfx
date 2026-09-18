# SBS-PLANNER-PL-HTA-CORRECTION-1 — GAP-A Human Semantic Decision

Human semantic / orientation Decision for GAP-A after historical PL-HTA FAIL / NOT CONFIRMED. This record consumes **Orientation Decision GO** only. It **SELECT**s person/plan-scoped orientation. It does **not** execute a new PL-HTA, rewrite locked Correction-2, author Exact Scope, start Implementation, reconstruct Re-Review-4, or fabricate `#674` Human Merge GO.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-PLANNER
unit: SBS-PLANNER-PL-HTA-CORRECTION-1
kind: Human semantic / orientation Decision
mode: docs-only Decision recording
date: 2026-09-18

Basis main (exact): 7414f9d08f6fcf64829fad66c3df2355e94b0bc7
Historical HTA record:
  docs/architecture/sbs-planner-pl-hta-human-task-acceptance-decision.md
  Human Task Acceptance: FAIL / NOT CONFIRMED
  PL-HTA-1: FAIL
  PL-HTA-2: FAIL

Parent Definition (LOCKED; not rewritten):
  docs/architecture/sbs-role-task-first-ia-v1-correction-2-complete-controlled-packet.md
  blob: 5eeb8140772ebfefe050cff93361a6d81c470f81
PLANNER Top-Level packet (LOCKED; not rewritten):
  docs/architecture/sbs-planner-top-level-ia-v1-complete-controlled-packet.md
  blob: 4c80f67e0a05f6ff10036ee1f44f1be9e16bab73

Human speech-act (verbatim this turn):
  SBS-PLANNER-PL-HTA-CORRECTION-1
  Human Acceptance Evidence Fixation + Orientation Decision GO
  Part B — GAP-A Human semantic decision
  Decision = SELECT person/plan-scoped orientation

Human Orientation Decision: GO / CONSUMED
Decision: SELECT person/plan-scoped orientation
Exact Scope: NOT AUTHORED / NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
Product / SPFx / domain / schema mutation: NONE
Ready / Merge / Issue close: NOT AUTHORIZED
ADMIN_AUDIT work: NOT AUTHORIZED
Deploy / LIVE WRITE / Production Binding: NOT AUTHORIZED
New PL-HTA execution: NOT AUTHORIZED
Re-Review-4 reconstruction: FORBIDDEN
#674 Human Merge GO fabrication: FORBIDDEN
```

Orientation Decision ≠ Exact Scope complete ≠ Implementation Start ≠ Ready ≠ Merge ≠ PL-HTA re-run.

---

## Verdict

```text
RESULT: SELECT person/plan-scoped orientation / CONSUMED
GAP-A cycle/orientation source = person/plan-scoped only
session-global / organization-wide lifecycle without person/plan authority = REJECTED
smoke-only initialPlannerCycle = verification input only / never Product truth
Exact Scope / Product implementation = NOT AUTHORIZED by this Decision
```

---

## SELECT (normative for later Exact Scope; not implemented here)

### Before lawful person/plan context

```text
current cycle = unknown
D-HOME remains fail-closed
Primary Action must not guess or advance
```

This preserves locked Correction-2 unknown fail-closed meaning and the observed first-paint fact on bound main (Primary Action disabled while cycle is unknown).

### After lawful person/plan context

```text
current cycle may be resolved only from an existing lawful per-plan Product source
examples of lawful source (reuse; do not invent a new lifecycle store):
  existing SupportPlan Current / Draft / work-state presentation
  SupportPlanManagementList per-row work-state
  ManagementHome read-model (currentPlan / draft / next-action labels)
```

Lawful context is a **person + plan** identity already present in Product. It is not Demo role selection alone, not Global「今の工程」alone, and not a smoke query string.

### Smoke / session-global REJECTED

```text
REJECTED: smoke-only initialPlannerCycle / ?cycle= as Product truth
REJECTED: organization-wide lifecycle state without a person/plan authority source
REJECTED: session-global current cycle that outlives or precedes person/plan context
REJECTED: guessing ①–⑥ so Primary Action can advance from D-HOME
```

---

## Correction targets (orientation only; not Exact Scope)

These names record **what later Exact Scope would bind**. This Decision does not specify files, CSS, or implementation steps.

| ID | Target meaning | Human-readable obligation |
|---|---|---|
| **PL-HTA-B** | D-PLAN → existing SupportPlan business surface | Current / Draft meaning Human-readable; Draft / 次版 must not be misread as 適用中 |
| **PL-HTA-C** | D-MONITOR → existing MonitoringView | 0件 and 実施できなかった Human-readable and distinct |

```text
PL-HTA-B / PL-HTA-C = orientation for a later Exact Scope unit
≠ Implementation Start
≠ permission to rewrite locked Correction-2 C9 wording
≠ new Destination identities
```

Reuse existing SupportPlan and MonitoringView. Do not create a second plan surface or a second monitoring meaning.

---

## Must preserve (LOCKED leftovers)

```text
Global 探す → D-FIND-PERSON
③ Primary Action → D-FIND-RECORD → selected → D-RECORD-READ
PROCESS-VISIBILITY-UI-V1 in-flow (not a second Global)
FIELD_STAFF Task-First unchanged
ADMIN_AUDIT unchanged (chrome-local leftover remains OUT)
unknown fail-closed on D-HOME without lawful person/plan context
Correction-2 locked semantics (packet blob 5eeb8140…)
```

---

## Relation to historical PL-HTA FAIL

Historical FAIL (Part A) observed:

- D-PLAN / D-MONITOR Task-First headings over Overview「今日の支援」
- Product cycle `unknown` until a smoke-only query
- SupportPlan / MonitoringView exist off-path (`探す` → Aさん詳細)

This SELECT explains why that FAIL must not be “fixed” by promoting `initialPlannerCycle` or a session-global cycle. A later Exact Scope, if separately authorized, must bind Destinations to existing per-plan surfaces after lawful person/plan context exists.

---

## Explicit OUT / NOT AUTHORIZED

```text
Product implementation
Exact Scope implementation / Scout as complete
Repository mutation outside docs-only Decision recording
Ready / Merge
Issue close
ADMIN_AUDIT Task-First
Deploy / LIVE WRITE / Production Binding
reconstruct #667 Re-Review-4
fabricate #674 Human Merge GO
new PL-HTA execution
rewrite Correction-2 / Top-Level locked packets
session-global lifecycle invention
```

---

## Next (not started)

```text
ALLOWED later (separate Human GOs only):
  Exact Scope Definition (docs-only) that restates this SELECT
  → Independent Scope Review
  → separate Human Implementation Start GO / HOLD

NOT NEXT from this record:
  implementation
  Ready / Merge
  PL-HTA re-run
```

```text
STOP = Orientation Decision recorded
     = no Exact Scope authored here
     = no Product mutation
     = no Ready / Merge / Deploy
     = GHC-1 / GHC-2 unchanged
```
