# SBS-PLANNER-TOP-LEVEL-IA-V1 — Complete Controlled Packet

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: SBS-PLANNER-TOP-LEVEL-IA-V1
record type: Complete Controlled Packet
kind: Definition packet (single body)
status: DRAFT / KICKOFF APPLIED / AWAITING P1-1 DECISION (and/or Independent Definition Review)
normative surface: THIS PACKET BODY ONLY
attachment / sidecar: EXCLUDED / NON-NORMATIVE
parent Definition: Correction-2 Complete Controlled Packet (LOCKED; not rewritten)
  path: docs/architecture/sbs-role-task-first-ia-v1-correction-2-complete-controlled-packet.md
  locked blob: 5eeb8140772ebfefe050cff93361a6d81c470f81
parent Lock:
  docs/architecture/sbs-role-task-first-ia-v1-correction-2-human-definition-lock.md
  blob: 794d227a1e69c709e679337be6478b32de81d74a
parent disposition:
  docs/architecture/sbs-role-task-first-ia-v1-human-parent-carry-forward-disposition-decision.md
kickoff:
  docs/architecture/sbs-planner-top-level-ia-v1-human-definition-review-kickoff.md
reviewed main at Kickoff: 59b56411f93677826c74c62666a31912ea563d1f

Human P2-3 disposition (Correction-2 Open Question): CONSUMED = IN Scope residual
Definition Correction-1 GO: RECEIVED / NOT CONSUMABLE YET
Definition Correction-1 APPLIED: NO
Independent Definition Review: NOT YET / NOT CONSUMED
Human Definition Lock (this unit): NOT GENERATED / NOT CONSUMED
Human Implementation Start / Ready / Merge / Deploy: NOT AUTHORIZED
Implementation Authority: NONE
Repository Mutation (product / schema / persistence / SPFx): NONE at this gate
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
Notion production page update: NOT PERFORMED
```

This document is the complete Controlled Packet for **SBS-PLANNER-TOP-LEVEL-IA-V1**.

Reviewers must use this body only. Attachments, transcripts, and Notion sidecars are non-normative.

The locked Correction-2 packet remains the workstream IA SSOT. This packet does **not** replace CORR-2A / CORR-2B tables. It selects the Exact Slice for PLANNER Top-Level Global + Distinct D-HOME Orientation and records the Human P2-3 disposition as IN Scope residual **without** inventing the unique Primary Action bind when current cycle = ③.

Creating or reviewing this packet does not create Implementation Authority. Human Gate consumed for this unit so far: Kickoff GO only. Definition Correction-1 GO is received but **not consumable** until Human fixes P1-1.

---

## Packet identity

```text
Workstream = SBS-ROLE-TASK-FIRST-IA-V1
Unit = SBS-PLANNER-TOP-LEVEL-IA-V1
Record Type = Complete Controlled Packet
Parent Definition = Correction-2 Complete Controlled Packet (LOCKED blob 5eeb8140…)
Parent Product units = CORR-1F / CORR-1G COMPLETE / ARCHIVED PRESERVED
Kickoff GO = CONSUMED
Definition Correction-1 = NOT CONSUMABLE YET / NOT APPLIED
Independent Definition Review = NOT YET
Human Definition Lock (this unit) = NOT CONSUMED
Skeleton change = NOT REQUIRED / NOT PERFORMED
NEXT = Human P1-1 unique-close Decision
     and/or Fresh Independent Definition Review (packet body only)
```

Unchanged in meaning from locked Correction-2 unless a later section marks a this-unit addition:

- CORR-2A Global tuples for PLANNER (§2.3) and rejected resolutions (§2.5)
- CORR-2B PLANNER Distinct D-HOME (§3.3) and shared D-HOME row (§3.5)
- C1 / C2 / C3 PLANNER Task inventory (PL-T1..PL-T5)
- C4 PLANNER Destinations D-ASSESS / D-PLAN / D-MONITOR / D-REVIEW / D-NEXT
- C5 first paint = D-HOME (Distinct); Global ordered `今の工程 · 探す`
- C6 orientation meaning; PLANNER D-HOME vs Task Destination = different location identities
- C7 / C8 / C9 state-meaning non-collapse rules (0件 / Draft / Current / Next)
- presentation Role ≠ authorization Role
- Browser Smoke ≠ Human Task PASS
- SHELL-UX-7 dual-run REJECTED as product target
- FIELD_STAFF / ADMIN_AUDIT Global and Destination contracts (not this unit)

---

## 0. Why this unit exists

Parent Carry-Forward Disposition locked:

```text
PLANNER Global（今の工程 · 探す）/ Distinct D-HOME
  and ADMIN_AUDIT Global / D-HOME alias D-OPS
= SEPARATE WORKSTREAM
```

CORR-1F / CORR-1G closed FIELD_STAFF Product reachability only. PLANNER Top-Level entry and Distinct D-HOME Orientation remain unproven on Product; fail-closed preserved.

Human disposed Correction-2 Open Question **P2-3** as **IN Scope residual**:

```text
P2-3  PLANNER D-HOME Primary Action when current cycle = ③
```

Locked Correction-2 already states:

```text
PROCESS-VISIBILITY ③記録
  = PLANNER read/search (D-FIND-RECORD / D-RECORD-READ)
  ≠ D-RECORD-WRITE

D-HOME Primary Action maps are defined for
  ① → D-ASSESS
  ② → D-PLAN
  ④ → D-MONITOR
  ⑤ → D-REVIEW
  ⑥ → D-NEXT
```

No unique Primary Action Destination is locked for current cycle = ③. This packet **must not invent** that bind. Human P1-1 Decision is required before Definition Correction-1 can close it.

---

## 1. Exact Slice

```text
IN
  PL-TL-A  PLANNER Top-Level Global resolution is unique
           Global items (ordered): 今の工程 · 探す
           今の工程 → D-HOME (cycle orientation; CORR-2A §2.3)
           探す     → D-FIND-PERSON
           Unknown cycle position = fail-closed orientation on D-HOME
             (not guessed as D-ASSESS)
           Primary Action does not enter a Task Destination
             until the current cycle place is known
             OR until Human P1-1 Decision uniquely closes cycle=③

  PL-TL-B  PLANNER D-HOME identity is Distinct (CORR-2B §3.3)
           D-HOME ≠ D-ASSESS / D-PLAN / D-MONITOR / D-REVIEW / D-NEXT
           Purpose = 今の工程の所在と次の一手（orientation）
           First paint = D-HOME
           Global「今の工程」= D-HOME
           Completion = 今どの工程にいるかと次の一手が分かる

  PL-TL-C  C6 location identity unique for D-HOME vs Task Destinations
           Leaving D-HOME for a Task Destination changes location identity
           Orientation copy on a Task Destination = in-flow PROCESS-VISIBILITY
             ≠ a second Global row
           Not a router invention

  PL-TL-D  P2-3 IN Scope residual (Human disposition CONSUMED)
           subject = Primary Action when current cycle = ③
           unique bind = NOT YET (await Human P1-1 Decision)
           Candidate binds (examples only; not selected):
             STAY D-HOME fail-closed
             | D-FIND-RECORD
             | D-RECORD-READ
             | another explicit Human-fixed unique bind
           Agent invent / default = FORBIDDEN

OUT
  CORR-2A / CORR-2B table rewrite of locked parent blob
  new Destinations (no Search Hub; no context-resolver place;
    no fifth cycle step named D-HOME)
  ADMIN_AUDIT Global / D-HOME alias D-OPS
  FIELD_STAFF Global / D-TODAY alias work
  CORR-1F / CORR-1G reopen
  parent carry-forward P2-2 / P2-3 smoke hygiene closure
  SupportPlan section navigation reimplementation
  ①–⑥ Process Visibility in-page navigation reimplementation
    (in-flow on PLANNER Destinations remains parent meaning;
     not Top-Level Global; not invented here)
  list / KPI / action queue reimplementation
  Current / Draft / Next semantics re-solve
  0件 / 実施できなかった / 未記録 state-distinction re-solve
    (C9 non-collapse remains parent normative; not rewritten)
  C7 / C8 / C9 HTA rewrite (may later exercise PL-HTA; not this packet)
  React / CSS / router / schema / LIVE WRITE as Definition
  Entra / Deploy / App Catalog
  Human Lock / Start / Ready / Merge by this packet
  consuming a Gate to repeal SHELL-UX-7 in the Decision ledger
```

---

## 2. PL-TL-A — PLANNER Top-Level Global (unique)

### 2.1 Meaning (normative; bound to Correction-2 §2.3)

| Global item | Entry Condition | Destination when context sufficient | context不足時の意味 |
|---|---|---|---|
| 今の工程 | usable session + PLANNER | D-HOME (cycle orientation) | Still D-HOME. Unknown cycle position is fail-closed orientation, not guessed as D-ASSESS. Primary Action does not enter a Task Destination until the current cycle place is known (cycle=③ unique bind remains Human P1-1). |
| 探す | usable session + PLANNER | D-FIND-PERSON | Context is not required. D-FIND-RECORD is not this item. |

### 2.2 Rejected (normative; bound to Correction-2 §2.5 / §7.2)

```text
REJECTED: Global 今の工程 → five Destinations chosen by implementer
REJECTED: PLANNER six Global cycle tabs
REJECTED: Global 探す → D-FIND-PERSON and D-FIND-RECORD (dual)
REJECTED: dual-run SHELL-UX-7 Global with Role/Task-first Global
REJECTED: context resolver as its own Destination
```

### 2.3 In-flow (not Global)

```text
D-FIND-RECORD Entry = in-flow only
  PLANNER: D-MONITOR / PROCESS-VISIBILITY ③ / D-PERSON / D-RECORD-READ
≠ Global「探す」

PROCESS-VISIBILITY ①–⑥ on PLANNER Destinations
= in-flow orientation / section meaning
≠ Top-Level Global rows
≠ this unit’s Product Global implementation surface
```

---

## 3. PL-TL-B — Distinct D-HOME Orientation (unique)

### 3.1 Identity contract (bound to Correction-2 §3.3)

```text
D-HOME
  Purpose = 今の工程の所在と次の一手（orientation）
  Primary information = サイクル上の現在地、次の一手
  Primary action = 現在地の Task Destination へ進む
                   （現在地が不明なら進まない / fail-closed copy）
  First paint = D-HOME
  Global「今の工程」= D-HOME
  Completion = 今どの工程にいるかと次の一手が分かる
  Next = current-cycle Destination among
         D-ASSESS / D-PLAN / D-MONITOR / D-REVIEW / D-NEXT
         when current cycle ∈ {①,②,④,⑤,⑥} per locked C4 table
         when current cycle = ③ → NOT UNIQUELY CLOSED (PL-TL-D / P1-1)
```

### 3.2 Known-cycle Primary Action map (parent-locked; restated)

| current cycle | D-HOME Primary Action → |
|---|---|
| ① | D-ASSESS |
| ② | D-PLAN |
| ④ | D-MONITOR |
| ⑤ | D-REVIEW |
| ⑥ | D-NEXT |
| unknown | do not enter Task Destination / fail-closed orientation on D-HOME |
| ③ | **NOT UNIQUELY CLOSED** — see §4 |

D-ASSESS … D-NEXT remain Task Destinations. They are not D-HOME.

---

## 4. PL-TL-D — P2-3 IN Scope residual (not yet uniquely closed)

```text
Human disposition = IN Scope residual / CONSUMED
subject = PLANNER D-HOME Primary Action when current cycle = ③
parent meaning preserved:
  ③記録 = read/search (D-FIND-RECORD / D-RECORD-READ), not D-RECORD-WRITE
  D-RECORD-READ has no record-create CTA

unique-close Decision = NOT YET
Definition Correction-1 GO = RECEIVED / NOT CONSUMABLE YET
Definition Correction-1 APPLIED = NO

Agent MUST NOT select among:
  STAY D-HOME fail-closed
  D-FIND-RECORD
  D-RECORD-READ
  another bind
until Human P1-1 Decision names exactly one.
```

When Human P1-1 Decision arrives, Definition Correction-1 (P1-1 only) may close **only** this leftover. No Scope expansion beyond P1-1.

---

## 5. PL-TL-C — C6 location identity

```text
PLANNER: being on D-HOME and being on D-PLAN (etc.) are different location identities.
Always answer: 今どこ / どこから / 何ができる / 次はどこ.
Booleans must not impersonate a place.
Back names previous Destination.
Deep link restores role+Destination+object or fail-closes.
Orientation copy on Task Destinations = in-flow PROCESS-VISIBILITY, not a second Global row.
```

---

## 6. Explicit non-claims

```text
PL-HTA PASS = not claimed
PLANNER Global / Distinct D-HOME Product-proven = not claimed
cycle=③ Primary Action unique bind = not claimed
ADMIN_AUDIT Global completion = not claimed
SupportPlan section nav / Process Visibility / list·KPI·action queue
  / Current·Draft·Next / 0件 distinction reimplementation = not in this unit
Implementation Start = NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
```

---

## 7. Review gate (for later Independent Definition Review)

```text
Independent Definition Review PASS CONDITION = P0 0 = P1 0
P2 = non-blocking suggestions only
```

Expected P1 leftover until Human Decision B:

```text
P1-1  PLANNER D-HOME Primary Action when current cycle = ③
      is not uniquely closed (IN Scope residual; bind Decision missing)
```

A Review PASS is not claimed by this packet. Definition Correction-1 must not be consumed until Human names the unique bind.

---

## 8. Gate chain (this packet)

```text
Human Parent Carry-Forward Disposition = LOCKED / CONSUMED (prior)
Human P2-3 disposition = CONSUMED = IN Scope residual
Human Kickoff GO = RECEIVED / CONSUMED
unit ID = SBS-PLANNER-TOP-LEVEL-IA-V1 ASSIGNED
Complete Controlled Packet = AUTHORED (this document)
Definition Correction-1 GO = RECEIVED / NOT CONSUMABLE YET
Independent Definition Review = NOT YET
Human Definition Lock (this unit) = NOT CONSUMED
Exact Scope / Implementation Start = NOT AUTHORIZED
```

```text
ALLOWED NEXT:
  Human P1-1 unique-close Decision (cycle=③ Primary Action)
  and/or Fresh Independent Definition Review against this packet body only

NOT AUTHORIZED:
  Agent invent of P1-1 bind
  Definition Correction-1 consumption without Decision B
  Human Definition Lock by this document
  Implementation Start / Product mutation
  Ready / Merge / Deploy / LIVE WRITE
  self-PASS of Independent Definition Review
```

---

## 9. Exact identity check (this record)

| Item | Value |
|---|---|
| Path | `docs/architecture/sbs-planner-top-level-ia-v1-complete-controlled-packet.md` |
| Kickoff | `docs/architecture/sbs-planner-top-level-ia-v1-human-definition-review-kickoff.md` |
| Locked parent packet blob | `5eeb8140772ebfefe050cff93361a6d81c470f81` |
| Parent Lock blob | `794d227a1e69c709e679337be6478b32de81d74a` |
| Kickoff reviewed main | `59b56411f93677826c74c62666a31912ea563d1f` |
| Unit ID | `SBS-PLANNER-TOP-LEVEL-IA-V1` |

If the locked Correction-2 packet blob at its path is not `5eeb8140772ebfefe050cff93361a6d81c470f81`, this packet does not apply. Re-bind is required.
