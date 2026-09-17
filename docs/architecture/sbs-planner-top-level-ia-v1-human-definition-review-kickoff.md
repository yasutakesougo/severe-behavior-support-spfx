# SBS-PLANNER-TOP-LEVEL-IA-V1 — Human Definition Review Kickoff

Human Kickoff GO consumption for the PLANNER Top-Level Role/Task entry + distinct D-HOME orientation unit.

```text
repository: yasutakesougo/severe-behavior-support-spfx
parent workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: SBS-PLANNER-TOP-LEVEL-IA-V1
kind: Human Definition Review Kickoff GO record
mode: docs-only Definition authorship boundary + GO consumption
date: 2026-09-18

reviewed main:
  59b56411f93677826c74c62666a31912ea563d1f

locked parent Definition packet:
  docs/architecture/sbs-role-task-first-ia-v1-correction-2-complete-controlled-packet.md
  blob: 5eeb8140772ebfefe050cff93361a6d81c470f81

parent Human Definition Lock record:
  docs/architecture/sbs-role-task-first-ia-v1-correction-2-human-definition-lock.md
  blob: 794d227a1e69c709e679337be6478b32de81d74a

CORR-1F:
  COMPLETE / ARCHIVED

CORR-1G:
  COMPLETE / ARCHIVED

parent locked disposition:
  PLANNER / ADMIN_AUDIT Global = SEPARATE WORKSTREAM

Human Kickoff GO:
  RECEIVED / CONSUMED

unit ID:
  SBS-PLANNER-TOP-LEVEL-IA-V1 = ASSIGNED BY THIS KICKOFF

Product / SPFx mutation:
  NONE

Human Definition Lock for this unit:
  NOT CONSUMED

Exact Scope:
  NOT AUTHORIZED YET

Implementation Start:
  NOT AUTHORIZED

Ready / Merge / Deploy / LIVE WRITE:
  NOT AUTHORIZED
```

This Kickoff authorizes docs-only Exact Slice Definition authorship for this unit only.
It does not authorize Product mutation, self-PASS an Independent Definition Review,
consume Human Definition Lock, authorize Exact Scope, or authorize Implementation Start.

Kickoff GO ≠ Definition Lock ≠ Scope Lock ≠ Implementation Start.

---

## 1. Exact unit

```text
IN
  PLANNER Top-Level Role/Task entry
  PLANNER Global = 今の工程 · 探す
  PLANNER first paint = distinct D-HOME
  D-HOME orientation = current cycle + next action
  D-HOME -> current-cycle Destination mapping
  PLANNER Top-Level entry relation to existing PROCESS-VISIBILITY ①–⑥

OUT
  FIELD_STAFF semantics / CORR-1F / CORR-1G reopen
  ADMIN_AUDIT Global
  SupportPlan list / KPI / action queue redesign
  SupportPlan detail hierarchy redesign
  PROCESS-VISIBILITY ①–⑥ redesign
  lifecycle semantic re-decision
  schema / persistence
  SharePoint / M365 / Entra
  Production Binding / Deploy / LIVE WRITE
```

---

## 2. Current-main evidence carried into Definition authorship

```text
current shell primary nav
= 概要 · 利用者 · 記録

current Product host task navigation
= FIELD_STAFF only

PLANNER in-flow process navigation
= ① 計画
  ② 支援
  ③ 記録
  ④ モニタリング
  ⑤ 見直し
  ⑥ 次版準備

PLANNER Top-Level Global
= NOT PRODUCT-PROVEN

PLANNER distinct D-HOME
= NOT PRODUCT-PROVEN
```

Existing Planning-PC list / detail / process-navigation work is consumed and must not be duplicated.

---

## 3. Human-disposition gap preserved

The parent Human Definition Lock explicitly preserves this Open Question:

```text
P2-3
= PLANNER D-HOME Primary Action when current cycle = ③
= unresolved
```

This Human Kickoff GO does **not** silently decide that behavior.

```text
P2-3 Human disposition
= NOT RECEIVED / NOT CONSUMED

Definition Candidate may frame the decision boundary
= YES

Definition Candidate may select a ③ destination/action on behalf of Human
= NO
```

---

## 4. Authorized by this Kickoff

```text
Create docs-only Exact Slice Definition Candidate-1
Bind it to:
  main 59b56411f93677826c74c62666a31912ea563d1f
  parent packet blob 5eeb8140772ebfefe050cff93361a6d81c470f81
  parent lock record blob 794d227a1e69c709e679337be6478b32de81d74a

Run a separate Independent Definition Review against that candidate body

If review is PASS / REVIEW-CLEARED:
  STOP for Human Definition Lock GO / HOLD

If review identifies a Definition blocker:
  HOLD
  no Scope Scout
  no Product mutation
```

---

## 5. Explicit non-actions

```text
Product code / React / CSS / router mutation = NOT AUTHORIZED
Definition Lock = NOT CONSUMED
Exact Scope Scout = NOT AUTHORIZED until Definition Lock
Independent Scope Review = NOT YET
Correction Implementation GO = NOT CONSUMED
Implementation Start = NOT AUTHORIZED
Ready / Merge = NOT AUTHORIZED
Deploy / App Catalog / LIVE WRITE = NOT AUTHORIZED
SharePoint / M365 / Entra mutation = NOT AUTHORIZED
Issue close = NOT AUTHORIZED
```

---

## NEXT

```text
NEXT
= docs-only Exact Slice Definition Candidate-1
→ Independent Definition Review
→ Human Definition Lock GO / HOLD

P2-3
= Human disposition still required before a lockable complete Definition
  if the Definition needs a unique D-HOME Primary Action for cycle ③

AGENT
= no Product mutation
```
