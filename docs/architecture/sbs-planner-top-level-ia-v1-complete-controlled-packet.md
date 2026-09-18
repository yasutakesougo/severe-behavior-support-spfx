# SBS-PLANNER-TOP-LEVEL-IA-V1 — Complete Controlled Packet

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: SBS-PLANNER-TOP-LEVEL-IA-V1
record type: Complete Controlled Packet
kind: Definition packet (single body)
status: COMPLETE / CORRECTION-1 APPLIED / AWAITING FRESH INDEPENDENT DEFINITION RE-REVIEW
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
pre-Correction-1 packet HEAD: 869bf9b8274becb3ffeeab793f79b2e272ecd15e

Human P2-3 disposition (Correction-2 Open Question): CONSUMED = IN Scope residual
Human P1-1 unique-close Decision: SELECTED / HUMAN FIXED / CONSUMED
  bind = D-FIND-RECORD
  then = selected record → D-RECORD-READ
Definition Correction-1 GO: RECEIVED / CONSUMED
  GO record: docs/architecture/sbs-planner-top-level-ia-v1-human-definition-correction-1-go.md
Definition Correction-1 APPLIED: YES (P1-1 only)
Independent Definition Re-Review: NOT YET / NOT CONSUMED
Human Definition Lock (this unit): NOT GENERATED / NOT CONSUMED
Human Implementation Start / Ready / Merge / Deploy: NOT AUTHORIZED
Implementation Authority: NONE
Repository Mutation (product / schema / persistence / SPFx): NONE at this gate
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
Notion production page update: NOT PERFORMED
```

This document is the complete Controlled Packet for **SBS-PLANNER-TOP-LEVEL-IA-V1**, including Definition Correction-1 (P1-1 only).

Reviewers must use this body only. Attachments, transcripts, and Notion sidecars are non-normative.

The locked Correction-2 packet remains the workstream IA SSOT. This packet does **not** replace CORR-2A / CORR-2B tables. It selects the Exact Slice for PLANNER Top-Level Global + Distinct D-HOME Orientation and uniquely closes Correction-2 Open Question P2-3 / P1-1 (cycle=③ Primary Action) per Human Decision.

Creating or reviewing this packet does not create Implementation Authority. Human Gates consumed for this unit so far: Kickoff GO and Definition Correction-1 GO, each recorded separately.

---

## Packet identity

```text
Workstream = SBS-ROLE-TASK-FIRST-IA-V1
Unit = SBS-PLANNER-TOP-LEVEL-IA-V1
Record Type = Complete Controlled Packet
Parent Definition = Correction-2 Complete Controlled Packet (LOCKED blob 5eeb8140…)
Parent Product units = CORR-1F / CORR-1G COMPLETE / ARCHIVED PRESERVED
Kickoff GO = CONSUMED
Definition Correction-1 = APPLIED / CONSUMED (P1-1 only)
Independent Definition Re-Review = NOT YET
Human Definition Lock (this unit) = NOT CONSUMED
Skeleton change = NOT REQUIRED / NOT PERFORMED
NEXT = Fresh Independent Definition Re-Review (packet body only)
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

This-unit addition (Correction-1 / P1-1 only):

```text
current cycle = ③
  D-HOME Primary Action → D-FIND-RECORD (in-flow)
  selected record → D-RECORD-READ
```

---

## 0. Why this unit exists

Parent Carry-Forward Disposition locked:

```text
PLANNER Global（今の工程 · 探す）/ Distinct D-HOME
  and ADMIN_AUDIT Global / D-HOME alias D-OPS
= SEPARATE WORKSTREAM
```

CORR-1F / CORR-1G closed FIELD_STAFF Product reachability only. PLANNER Top-Level entry and Distinct D-HOME Orientation remain unproven on Product; fail-closed preserved.

Human disposed Correction-2 Open Question **P2-3** as **IN Scope residual**, then Human-fixed P1-1:

```text
P2-3 / P1-1  PLANNER D-HOME Primary Action when current cycle = ③
Human Decision = D-FIND-RECORD
then = selected record → D-RECORD-READ
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

Correction-1 uniquely closes the missing ③ row without rewriting the locked parent blob.

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

  PL-TL-B  PLANNER D-HOME identity is Distinct (CORR-2B §3.3)
           D-HOME ≠ D-ASSESS / D-PLAN / D-MONITOR / D-REVIEW / D-NEXT
           Purpose = 今の工程の所在と次の一手（orientation）
           First paint = D-HOME
           Global「今の工程」= D-HOME
           Completion = 今どの工程にいるかと次の一手が分かる

  PL-TL-C  C6 location identity unique for D-HOME vs Task Destinations
           Leaving D-HOME for a Task Destination / in-flow find place
             changes location identity
           Orientation copy on a Task Destination = in-flow PROCESS-VISIBILITY
             ≠ a second Global row
           Not a router invention

  PL-TL-D  P2-3 IN Scope residual CLOSED uniquely by Correction-1 / P1-1
           subject = Primary Action when current cycle = ③
           unique bind = D-FIND-RECORD (HUMAN FIXED)
           meaning = D-HOMEから③「記録」の仕事へ進むときは
                     記録を選ぶため D-FIND-RECORD へ進む
           then = selected record → D-RECORD-READ
           must preserve:
             D-FIND-RECORD is in-flow only
             Global「探す」 remains D-FIND-PERSON
             D-RECORD-READ has no record-create CTA
             D-RECORD-WRITE is NOT used by PLANNER

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
     not Top-Level Global; not reimplemented here)
  list / KPI / action queue reimplementation
  Current / Draft / Next semantics re-solve
  0件 / 実施できなかった / 未記録 state-distinction re-solve
    (C9 non-collapse remains parent normative; not rewritten)
  C7 / C8 / C9 HTA rewrite (may later exercise PL-HTA; not this packet)
  React / CSS / router / schema / LIVE WRITE as Definition
  Entra / Deploy / App Catalog
  Human Lock / Start / Ready / Merge by this packet
  consuming a Gate to repeal SHELL-UX-7 in the Decision ledger
  Promote D-FIND-RECORD to Global「探す」
  PLANNER use of D-RECORD-WRITE
  Record-create CTA on D-RECORD-READ
```

---

## 2. PL-TL-A — PLANNER Top-Level Global (unique)

### 2.1 Meaning (normative; bound to Correction-2 §2.3)

| Global item | Entry Condition | Destination when context sufficient | context不足時の意味 |
|---|---|---|---|
| 今の工程 | usable session + PLANNER | D-HOME (cycle orientation) | Still D-HOME. Unknown cycle position is fail-closed orientation, not guessed as D-ASSESS. Primary Action does not enter a Task Destination until the current cycle place is known. |
| 探す | usable session + PLANNER | D-FIND-PERSON | Context is not required. D-FIND-RECORD is not this item. |

### 2.2 Rejected (normative; bound to Correction-2 §2.5 / §7.2)

```text
REJECTED: Global 今の工程 → five Destinations chosen by implementer
REJECTED: PLANNER six Global cycle tabs
REJECTED: Global 探す → D-FIND-PERSON and D-FIND-RECORD (dual)
REJECTED: dual-run SHELL-UX-7 Global with Role/Task-first Global
REJECTED: context resolver as its own Destination
REJECTED: Global 探す → D-FIND-RECORD (Correction-1 must not promote)
```

### 2.3 In-flow (not Global)

```text
D-FIND-RECORD Entry = in-flow only
  PLANNER:
    D-HOME Primary Action when current cycle = ③  (Correction-1 / P1-1)
    D-MONITOR / PROCESS-VISIBILITY ③ / D-PERSON / D-RECORD-READ
≠ Global「探す」

selected record on D-FIND-RECORD
  → D-RECORD-READ
  D-RECORD-READ has no record-create CTA
  PLANNER does not use D-RECORD-WRITE

PROCESS-VISIBILITY ①–⑥ on PLANNER Destinations
= in-flow orientation / section meaning
≠ Top-Level Global rows
≠ this unit’s Product Global implementation surface
```

---

## 3. PL-TL-B — Distinct D-HOME Orientation (unique)

### 3.1 Identity contract (bound to Correction-2 §3.3 + Correction-1)

```text
D-HOME
  Purpose = 今の工程の所在と次の一手（orientation）
  Primary information = サイクル上の現在地、次の一手
  Primary action = 現在地の次の一手へ進む
                   （現在地が不明なら進まない / fail-closed copy）
  First paint = D-HOME
  Global「今の工程」= D-HOME
  Completion = 今どの工程にいるかと次の一手が分かる
  Next =
    when current cycle ∈ {①,②,④,⑤,⑥}
      → Task Destination per §3.2 (parent-locked map)
    when current cycle = ③
      → D-FIND-RECORD (in-flow; Correction-1 / P1-1)
         then selected record → D-RECORD-READ
    when current cycle unknown
      → do not leave D-HOME / fail-closed orientation
```

### 3.2 Primary Action map (parent-locked + Correction-1)

| current cycle | D-HOME Primary Action → |
|---|---|
| ① | D-ASSESS |
| ② | D-PLAN |
| ③ | **D-FIND-RECORD** (in-flow; then selected record → D-RECORD-READ) |
| ④ | D-MONITOR |
| ⑤ | D-REVIEW |
| ⑥ | D-NEXT |
| unknown | do not enter Task Destination / fail-closed orientation on D-HOME |

D-ASSESS … D-NEXT remain Task Destinations. They are not D-HOME.

D-FIND-RECORD is not a fifth cycle step and is not Global「探す」. It is the in-flow record-index place used when ③「記録」 is the current-cycle job from D-HOME.

---

## 4. PL-TL-D — P2-3 / P1-1 uniquely closed (Correction-1)

```text
Human disposition = IN Scope residual / CONSUMED
Human P1-1 unique-close Decision = SELECTED / HUMAN FIXED / CONSUMED
subject = PLANNER D-HOME Primary Action when current cycle = ③

unique bind = D-FIND-RECORD
meaning =
  D-HOMEから③「記録」の仕事へ進むときは
  記録を選ぶため D-FIND-RECORD へ進む
then = selected record → D-RECORD-READ

must preserve (CONFIRMED in this packet):
  D-FIND-RECORD is in-flow only
  Global「探す」 remains D-FIND-PERSON
  D-RECORD-READ has no record-create CTA
  D-RECORD-WRITE is NOT used by PLANNER

Definition Correction-1 GO = RECEIVED / CONSUMED
Definition Correction-1 APPLIED = YES (P1-1 only)
```

No leftover choice remains for implementers on cycle=③ Primary Action.

---

## 5. PL-TL-C — C6 location identity

```text
PLANNER: being on D-HOME and being on D-PLAN / D-FIND-RECORD / D-RECORD-READ
  (etc.) are different location identities.
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
Independent Definition Re-Review PASS = not claimed
Human Definition Lock (this unit) = not claimed
ADMIN_AUDIT Global completion = not claimed
SupportPlan section nav / Process Visibility / list·KPI·action queue
  / Current·Draft·Next / 0件 distinction reimplementation = not in this unit
Implementation Start = NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
```

---

## 7. Review gate (Fresh Independent Definition Re-Review)

```text
Independent Definition Re-Review PASS CONDITION = P0 0 = P1 0
P2 = non-blocking suggestions only
```

Correction-1 closed the expected P1 leftover:

```text
P1-1  PLANNER D-HOME Primary Action when current cycle = ③
      = CLOSED
      bind = D-FIND-RECORD
      then = selected record → D-RECORD-READ
      preserves in-flow-only / Global 探す / no create CTA / no PLANNER WRITE
```

A Re-Review PASS is **not** claimed by this packet. Fresh Independent Definition Re-Review is a later, independent pass against this corrected body only.

---

## 8. Gate chain (this packet)

```text
Human Parent Carry-Forward Disposition = LOCKED / CONSUMED (prior)
Human P2-3 disposition = CONSUMED = IN Scope residual
Human Kickoff GO = RECEIVED / CONSUMED
unit ID = SBS-PLANNER-TOP-LEVEL-IA-V1 ASSIGNED
Human P1-1 unique-close Decision = SELECTED / HUMAN FIXED / CONSUMED
Definition Correction-1 GO = RECEIVED / CONSUMED
Definition Correction-1 APPLIED = YES (P1-1 only)
Complete Controlled Packet = CORRECTION-1 APPLIED (this document)
Independent Definition Re-Review = NOT YET
Human Definition Lock (this unit) = NOT CONSUMED
Exact Scope / Implementation Start = NOT AUTHORIZED
```

```text
ALLOWED NEXT:
  Fresh Independent Definition Re-Review against this corrected packet body only
  → Human Definition Lock GO / HOLD

NOT AUTHORIZED:
  Human Definition Lock by this document
  Implementation Start / Product mutation
  Ready / Merge / Deploy / LIVE WRITE
  self-PASS of Independent Definition Re-Review
  Scope expansion beyond applied P1-1
  Global「探す」 → D-FIND-RECORD
  PLANNER D-RECORD-WRITE
```

---

## 9. Exact identity check (this record)

| Item | Value |
|---|---|
| Path | `docs/architecture/sbs-planner-top-level-ia-v1-complete-controlled-packet.md` |
| Kickoff | `docs/architecture/sbs-planner-top-level-ia-v1-human-definition-review-kickoff.md` |
| Correction-1 GO | `docs/architecture/sbs-planner-top-level-ia-v1-human-definition-correction-1-go.md` |
| Locked parent packet blob | `5eeb8140772ebfefe050cff93361a6d81c470f81` |
| Parent Lock blob | `794d227a1e69c709e679337be6478b32de81d74a` |
| Kickoff reviewed main | `59b56411f93677826c74c62666a31912ea563d1f` |
| Pre-Correction-1 packet HEAD | `869bf9b8274becb3ffeeab793f79b2e272ecd15e` |
| Unit ID | `SBS-PLANNER-TOP-LEVEL-IA-V1` |
| P1-1 bind | `D-FIND-RECORD` → selected → `D-RECORD-READ` |

If the locked Correction-2 packet blob at its path is not `5eeb8140772ebfefe050cff93361a6d81c470f81`, this packet does not apply. Re-bind is required.
