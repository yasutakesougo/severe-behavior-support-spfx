# SBS-PLANNER-PL-HTA-CORRECTION-1 — Complete Controlled Packet

Definition packet for binding PLANNER Task-First Destinations D-PLAN / D-MONITOR to existing SupportPlan / MonitoringView under person/plan-scoped orientation. This packet does **not** consume Human Definition Lock, Human Scope Lock, Exact Scope, Implementation Start, Ready, Merge, or a new PL-HTA execution.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-PLANNER
unit: SBS-PLANNER-PL-HTA-CORRECTION-1
record type: Complete Controlled Packet
kind: Definition packet (single body)
status: COMPLETE / AWAITING FRESH INDEPENDENT DEFINITION REVIEW
normative surface: THIS PACKET BODY ONLY
attachment / sidecar / PR body / prior chat / smoke artifacts: EXCLUDED / NON-NORMATIVE
basis main (exact): 7414f9d08f6fcf64829fad66c3df2355e94b0bc7

parent Correction-2 (LOCKED; not rewritten):
  docs/architecture/sbs-role-task-first-ia-v1-correction-2-complete-controlled-packet.md
  blob: 5eeb8140772ebfefe050cff93361a6d81c470f81
parent PLANNER Top-Level (LOCKED; not rewritten):
  docs/architecture/sbs-planner-top-level-ia-v1-complete-controlled-packet.md
  blob: 4c80f67e0a05f6ff10036ee1f44f1be9e16bab73
FE-F002 role-binding packet (LOCKED; not rewritten):
  docs/architecture/sbs-planner-product-role-binding-v1-complete-controlled-packet.md
  blob: f0aa82f6edb5f8687baba6482c37d42c43dc605d

historical PL-HTA FAIL identity (Part A; not re-executed):
  docs/architecture/sbs-planner-pl-hta-human-task-acceptance-decision.md
  Human Task Acceptance: FAIL / NOT CONFIRMED
  PL-HTA-1: FAIL
  PL-HTA-2: FAIL
  bound main: 7414f9d08f6fcf64829fad66c3df2355e94b0bc7
GAP-A orientation Decision (Part B; CONSUMED; restated uniquely below):
  docs/architecture/sbs-planner-pl-hta-correction-1-gap-a-human-semantic-decision.md
  SELECT person/plan-scoped orientation

Independent Definition Review: NOT YET / NOT CONSUMED
Human Definition Lock: NOT CONSUMED
Human Scope Lock: NOT ELIGIBLE (no Exact Scope body)
Combined Definition / Scope Lock: NOT CONSUMABLE
Exact Scope: NOT AUTHORIZED by this packet
Implementation Start: NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
Product / SPFx / domain / schema mutation: NONE
ADMIN_AUDIT Task-First: OUT
Re-Review-4 reconstruction: FORBIDDEN
#674 Human Merge GO fabrication: FORBIDDEN
Rewrite locked parent packets: NOT AUTHORIZED
```

Reviewers must use this body only. Historical HTA / GAP-A records are cited identities, not a second Definition. This packet restates the unique closes required for later Exact Scope. It does not create Implementation Authority.

---

## 0. Packet identity

```text
Workstream = SBS-PLANNER
Unit = SBS-PLANNER-PL-HTA-CORRECTION-1
Record Type = Complete Controlled Packet
Historical HTA = FAIL / NOT CONFIRMED @ 7414f9d0 (PL-HTA-1 FAIL, PL-HTA-2 FAIL)
GAP-A Decision = SELECT person/plan-scoped orientation / CONSUMED
Independent Definition Review = NOT YET
Human Definition Lock = NOT CONSUMED
NEXT = Fresh Independent Definition Review (this body only)
```

Unchanged from locked parents unless a later section marks a this-unit addition:

- PLANNER Global 今の工程 · 探す
- 今の工程 → D-HOME ; 探す → D-FIND-PERSON
- ① D-ASSESS / ② D-PLAN / ③ D-FIND-RECORD → D-RECORD-READ / ④ D-MONITOR / ⑤ D-REVIEW / ⑥ D-NEXT
- Distinct D-HOME vs Task Destinations
- presentation Role ≠ authorization Role
- Browser Smoke ≠ Human Task PASS
- SHELL-UX-7 dual-run REJECTED as product target
- FIELD_STAFF / ADMIN_AUDIT Global contracts (not this unit)
- PROCESS-VISIBILITY-UI-V1 in-flow, not a second Global
- C7 / C8 / C9 Current / Draft / 0件 non-collapse (not rewritten; exercised here)

---

## 1. Purpose

Close the historical PL-HTA FAIL by making locked Destinations **D-PLAN** and **D-MONITOR** Human-readable as the existing SupportPlan and MonitoringView business surfaces, under person/plan-scoped orientation.

Do not redesign PLANNER Global.
Do not create new Destinations.
Do not invent session-global lifecycle.
Do not promote smoke-only cycle input to Product truth.

---

## 2. Historical PL-HTA FAIL identity (informative correspondence; not a new HTA)

```text
result = FAIL / NOT CONFIRMED
PL-HTA-1 = FAIL
PL-HTA-2 = FAIL
bound main = 7414f9d08f6fcf64829fad66c3df2355e94b0bc7
record = docs/architecture/sbs-planner-pl-hta-human-task-acceptance-decision.md
```

Observed on that bound main (already fixated; not re-run by this packet):

- Demo PLANNER first paint: cycle `unknown`; Primary Action disabled.
- Task-First D-PLAN / D-MONITOR: heading only over Overview「今日の支援」.
- Existing SupportPlan / MonitoringView remain reachable off-path (`探す` → person/plan detail), not as D-PLAN / D-MONITOR.

This packet must not treat those observations as Product ABSENT for Top-Level IA or FE-F002.

---

## 3. Locked HTA authority (unrewritten)

Correction-2 C9 remains authority. This unit **exercises** it on reachable Destinations; it does not rewrite the C9 text.

### PL-HTA-1

```text
Given: PLANNERが適用中の計画を確認する
When: 支援計画 Destination を開く
Then: Current がどれか分かり、Draft / 次版を適用中と誤認しない
And: 次の工程（モニタリングまたは見直し）が入口から辿れる
And: Global が 今の工程 と 探す のみでも、サイクル内の現在位置が分かる
```

### PL-HTA-2

```text
Given: PLANNERが期間の記録を見る
When: モニタリング Destination を開く
Then: 0件 と 実施できなかった を別意味として読める
And: Browser Smoke の PASS 表示を業務完了と取り違えない
```

---

## 4. Gap classification (this unit)

| ID | Classification | Meaning unique-close |
|---|---|---|
| **GAP-A** | ORIENTATION / CONTEXT | Person/plan-scoped orientation. No lawful person/plan context → cycle `unknown`, D-HOME fail-closed, Primary Action must not guess. |
| **GAP-B** | DESTINATION BINDING | D-PLAN → existing SupportPlan business surface. Current / Draft Human-readable. |
| **GAP-C** | DESTINATION BINDING | D-MONITOR → existing MonitoringView. 0件 ≠ 実施できなかった, Human-readable. |

```text
GAP-A ≠ GAP-B ≠ GAP-C
GAP-A is not “invent a global current-cycle store”
GAP-B is not a new plan screen
GAP-C is not a new monitoring screen
```

PL-HTA-B in the GAP-A Decision = GAP-B here.
PL-HTA-C in the GAP-A Decision = GAP-C here.

---

## 5. GAP-A — person/plan-scoped orientation (unique)

### 5.1 Lawful person/plan context

```text
Lawful context
  = PLANNER has an existing SupportPlan identity open for a specific person + plan
  = that identity already exists in Product (SupportPlan business surface)
```

Not lawful context:

```text
Demo / presentationRole = PLANNER alone
Global「今の工程」alone
smoke-only initialPlannerCycle / ?cycle=
organization-wide or session-global lifecycle without that person/plan identity
```

### 5.2 Before lawful context

```text
current cycle = unknown
D-HOME remains fail-closed
Primary Action must not guess or advance
D-PLAN / D-MONITOR must not present Overview「今日の支援」as 支援計画 / モニタリング
D-PLAN / D-MONITOR must not invent a person/plan
```

### 5.3 After lawful context

```text
current cycle may be resolved only from that plan’s existing
PROCESS-VISIBILITY-UI-V1 in-flow current section (①–⑥)
If that plan has no resolved current section → remain unknown / fail-closed
Do not guess ①–⑥
```

Locked Primary Action map is unchanged: ① D-ASSESS, ② D-PLAN, ③ D-FIND-RECORD then D-RECORD-READ, ④ D-MONITOR, ⑤ D-REVIEW, ⑥ D-NEXT. Primary Action may advance **only** when cycle is resolved from §5.3, never from smoke.

### 5.4 REJECTED

```text
REJECTED: smoke-only initialPlannerCycle as Product truth
REJECTED: session-global current cycle that precedes person/plan context
REJECTED: organization-wide lifecycle store without person/plan authority
REJECTED: competing cycle sources (ManagementHome vs list vs SupportPlan) left for implementers
          unique source after context = that plan’s PROCESS-VISIBILITY-UI-V1 in-flow section
```

React / context / reducer / store ownership is **not** prescribed. Required outcome = observable context and cycle rules above.

---

## 6. GAP-B — D-PLAN → existing SupportPlan

```text
When: lawful person/plan context exists AND Destination = D-PLAN
Then: the Destination is the existing SupportPlan business surface for that person/plan
And: Current is Human-readable (現行 / 適用中)
And: Draft / 次版 is not readable as 適用中
And: 次の工程（モニタリングまたは見直し）is reachable as in-flow / Destination ④ or ⑤
      without adding Global rows
```

Reuse existing SupportPlan. Do not create a second plan UI. Do not rewrite PROCESS-VISIBILITY-UI-V1 as Global.

Without lawful context, D-PLAN is not “done” and must not impersonate SupportPlan with Overview.

---

## 7. GAP-C — D-MONITOR → existing MonitoringView

```text
When: lawful person/plan context exists AND Destination = D-MONITOR
Then: the Destination is the existing MonitoringView for that person/plan
And: 0件 is Human-readable as absence of matching records in the period/plan version
And: 実施できなかった is a distinct recorded result meaning
And: those two must not collapse
And: Browser Smoke PASS must not appear as business completion
```

Reuse existing MonitoringView (including existing 0件 ≠ 実施できなかった copy). Do not create a second monitoring UI.

Without lawful context, D-MONITOR is not “done” and must not impersonate MonitoringView with Overview.

---

## 8. Preservation boundaries

```text
Global 探す → D-FIND-PERSON
③ → D-FIND-RECORD → selected → D-RECORD-READ
PROCESS-VISIBILITY-UI-V1 in-flow (not a second Global)
FIELD_STAFF Task-First / CORR-1F / CORR-1G unchanged
ADMIN_AUDIT unchanged (Task-First OUT; chrome-local leftover not “fixed” here)
unknown fail-closed without lawful person/plan context
locked Correction-2 semantics (blob 5eeb8140…)
locked Top-Level Destination identities (blob 4c80f67e…)
FE-F002 Demo / Product PLANNER entrance (do not reopen as absent)
GHC-1 / GHC-2 historical evidence gaps (do not reconstruct)
```

---

## 9. Human-observable Acceptance Contract

These are PASS/FAIL observable. They are **not** PL-HTA PASS by themselves. Later PL-HTA remains a separate Human gate after implementation + independent implementation review + rendered verification.

| ID | Observable |
|---|---|
| A1 | Without lawful person/plan context, cycle is unknown and Primary Action does not advance. |
| A2 | Product does not treat smoke-only cycle input as current-cycle truth. |
| A3 | Opening an existing SupportPlan for a person establishes lawful person/plan context. |
| A4 | After that context, D-PLAN shows that SupportPlan; Current vs Draft/次版 is not collapsed into 適用中. |
| A5 | After that context, D-MONITOR shows existing MonitoringView. |
| A6 | On D-MONITOR, 0件 and 実施できなかった remain distinct Human-readable meanings. |
| A7 | D-PLAN / D-MONITOR do not present Overview「今日の支援」as the Destination meaning. |
| A8 | Global 探す remains D-FIND-PERSON (not D-FIND-RECORD). |
| A9 | Cycle ③ remains D-FIND-RECORD then selected → D-RECORD-READ. |
| A10 | PROCESS-VISIBILITY-UI-V1 remains in-flow, not additional Global items. |
| A11 | FIELD_STAFF Task-First is unchanged. |
| A12 | ADMIN_AUDIT Task-First is not introduced. |
| A13 | No new Destination identities. |
| A14 | Browser Smoke PASS is not shown as business completion on D-MONITOR. |

```text
A1–A14 ≠ PL-HTA PASS
PL-HTA-1 / PL-HTA-2 remain Human Acceptance after a later implementation
```

---

## 10. Explicit OUT

```text
ADMIN_AUDIT Task-First / FE-F001 / FE-F003
AA-HTA / FS-HTA-2
new Destinations / Search Hub / session-global lifecycle store
SupportPlan visual redesign / card redesign / CSS-as-Definition
MonitoringView redesign beyond binding the existing surface
rewrite of locked Correction-2 / Top-Level / FE-F002 packets
reconstruct #667 Re-Review-4
fabricate #674 Human Merge GO
Exact Scope / Implementation Start / Ready / Merge
Deploy / LIVE WRITE / Production Binding / SharePoint / Entra
Issue close
new PL-HTA execution by this packet
SHELL-UX-7 dual-run as the Product target
organization-wide current-cycle without person/plan authority
```

---

## 11. Architecture / files

This Definition does **not** name implementation files, React ownership, or Exact Scope lists. Exact Scope is a later gate after Human Definition Lock.

Required outcome is observable Destination meaning, not a prescribed component tree.

---

## 12. Review / Lock / later gates

```text
this packet
  → Fresh Independent Definition Review (packet body only)
  → only if PASS / REVIEW-CLEARED: separate Human Definition Lock
  → only after Definition Lock: Exact Scope (separate)
  → only after Scope Review + Human Scope Lock: Human Implementation Start GO
  → implementation
  → Independent Implementation Review
  → rendered verification
  → later PL-HTA (separate Human gate; not inferred)
```

```text
Independent Definition Review PASS ≠ Human Definition Lock
Human Definition Lock ≠ Human Scope Lock
Human Scope Lock ≠ Implementation Start
Implementation PASS ≠ PL-HTA PASS
```

---

## 13. STOP

```text
STOP = Definition packet complete
     = Independent Definition Review NOT YET
     = Human Definition Lock NOT CONSUMED
     = Exact Scope NOT AUTHORIZED
     = Implementation NOT STARTED
     = Ready / Merge / Deploy NOT AUTHORIZED
     = historical PL-HTA FAIL not rewritten into PASS
     = GHC-1 / GHC-2 not reconstructed
```
