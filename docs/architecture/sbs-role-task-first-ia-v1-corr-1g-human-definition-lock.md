# SBS-ROLE-TASK-FIRST-IA-V1 — CORR-1G Human Definition Lock

Human Definition Lock GO consumption for CORR-1G. This record locks the reviewed packet body. It does **not** authorize Exact Scope as complete, Implementation Start, Ready, Merge, or Product mutation.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: CORR-1G
kind: Human Definition Lock GO record
mode: READ ONLY boundary record + GO consumption
date: 2026-09-16

Human CORR-1G Definition Lock GO: RECEIVED / CONSUMED
Lock status: HUMAN DEFINITION LOCKED
Scope of this GO: CORR-1G Complete Controlled Packet body only

locked packet path:
  docs/architecture/sbs-role-task-first-ia-v1-corr-1g-complete-controlled-packet.md
locked exact packet HEAD: ba956429bfa9721e411dc7257ce79f265e0fe29e
locked packet blob: 9718231d93c572b93cefcd2a54bb8234c3407941

Independent Definition Re-Review-2: REVIEW-CLEARED / CONSUMED
  record: docs/architecture/sbs-role-task-first-ia-v1-corr-1g-independent-definition-re-review-2.md
  record HEAD: 3f3531e651e63690a218b5c6168330557a5c6840
  P0 = 0
  P1 = 0
  P2 = 0

parent Definition: Correction-2 Complete Controlled Packet (LOCKED; not rewritten)
  path: docs/architecture/sbs-role-task-first-ia-v1-correction-2-complete-controlled-packet.md
  locked blob: 5eeb8140772ebfefe050cff93361a6d81c470f81
parent Lock:
  docs/architecture/sbs-role-task-first-ia-v1-correction-2-human-definition-lock.md
  blob: 794d227a1e69c709e679337be6478b32de81d74a

Exact Scope Scout / Implementation Scope: ELIGIBLE (docs-only; not started by this record)
Human Correction Implementation GO: NOT RECEIVED
Implementation Start: NOT AUTHORIZED
Ready / Merge / Deploy: NOT AUTHORIZED
LIVE WRITE / SharePoint / M365 / Entra: NOT AUTHORIZED
Notion production page update: NOT AUTHORIZED
SHELL-UX-7 Decision ledger repeal: NOT AUTHORIZED
Product / SPFx / domain / schema mutation: NONE
CORR-1F reopen: NOT AUTHORIZED
Rewrite locked Correction-2 packet body / blob: NOT AUTHORIZED
Rewrite locked CORR-1G packet body / blob: NOT AUTHORIZED
P2-2 / P2-3 / PLANNER / ADMIN_AUDIT: OUT
```

This Decision consumes Human CORR-1G Definition Lock GO only. The locked packet body is not rewritten after the GO. Attachments, transcripts, and Notion sidecars stay non-normative.

Human Definition Lock ≠ Exact Scope complete ≠ Implementation Start ≠ Ready ≠ Merge ≠ Deploy.

---

## Locked semantics

The Human Lock consumes the reviewed CORR-1G Complete Controlled Packet at blob `9718231d93c572b93cefcd2a54bb8234c3407941` (packet HEAD `ba956429bfa9721e411dc7257ce79f265e0fe29e`).

Locked meaning (not restated as a new Definition):

```text
CORR-1G-A  FIELD_STAFF current support object
           acquisition / release is unique
           → Product-reachable D-PROCEDURE

CORR-1G-B  FIELD_STAFF current occurrence / procedure context
           acquisition / release is unique
           → Product-reachable D-RECORD-WRITE

CORR-1G-C  C6 location identity for newly reachable Destinations
           is unique; D-PERSON location identity is unique
           when that Destination is the post-acquisition place
```

Correction-2 uniqueness closes remain locked as reviewed:

```text
P1-1 RELEASE     D-PERSON open without current day’s occurrence
                 releases sticky object + coupled occurrence;
                 stay D-PERSON; Global fallbacks restored
P1-2 OPTION A    D-UNRECORDED occurrence choice is one episode:
                 acquire/replace corresponding support object
                 and acquire occurrence; Destination D-RECORD-WRITE
P1-3 NOT ACTIONABLE / STAY D-PERSON
                 object-false C4 Primary Action does not navigate,
                 mint, or fall back to D-TODAY;
                 object-true C4 PA and Global 手順 share
                 Destination identity D-PROCEDURE
                 (not a unique control path)
```

Parent-locked CORR-2A / CORR-2B tables remain unreplaced. Insufficient-context fallbacks from CORR-1F remain preserved (`手順` → D-TODAY; `記録する` → D-UNRECORDED).

Items remaining OUT / Open (not locked as resolved by CORR-1G):

```text
P2-2  SEPARATE HYGIENE (smoke .gitignore)
P2-3  SEPARATE VERIFICATION HYGIENE (smoke github.sha binding)
PLANNER / ADMIN_AUDIT Global  SEPARATE WORKSTREAM
workstream Open Questions:
  quiet 合成 badge
  AA-T1 cadence
  PLANNER D-HOME Primary Action when current cycle = ③
```

---

## Authority boundary

```text
Human CORR-1G Definition Lock GO
  = CORR-1G Definition semantics locked
  != Exact Scope complete
  != Human Implementation Start GO
  != Human Correction Implementation GO
  != Ready / Merge / Deploy
  != SHELL-UX-7 Decision ledger mutation
```

ALLOWED NEXT:

```text
Implementation Scope Scout / Exact Scope (CORR-1G) = ELIGIBLE (docs-only)
  against this locked packet blob 9718231d…
  → Independent Scope Review
  → separate Human Correction Implementation GO / HOLD
```

This Lock record does **not** author Exact Scope and does **not** consume Implementation Start.

NOT AUTHORIZED:

```text
React / CSS / router / schema / LIVE WRITE
Entra / Deploy / App Catalog
SharePoint / M365 mutation
Notion production mutation
Ready / Merge / Issue close (unrelated)
Product / SPFx mutation
CORR-1F reopen
Rewrite locked parent Correction-2 packet
Rewrite locked CORR-1G packet (blob 9718231d…)
P2-2 / P2-3 closure inside CORR-1G
PLANNER / ADMIN_AUDIT Global completion claim
consuming a Gate to repeal SHELL-UX-7 in the Decision ledger
```

---

## Exact identity check (this record)

| Item | Value |
|---|---|
| Path | `docs/architecture/sbs-role-task-first-ia-v1-corr-1g-complete-controlled-packet.md` |
| Packet HEAD | `ba956429bfa9721e411dc7257ce79f265e0fe29e` |
| Packet blob | `9718231d93c572b93cefcd2a54bb8234c3407941` |
| Independent Definition Re-Review-2 | REVIEW-CLEARED / P0=0 / P1=0 / P2=0 |
| Re-Review-2 HEAD | `3f3531e651e63690a218b5c6168330557a5c6840` |
| Parent packet blob | `5eeb8140772ebfefe050cff93361a6d81c470f81` |
| Parent Lock blob | `794d227a1e69c709e679337be6478b32de81d74a` |

If the CORR-1G packet blob at that path is not `9718231d93c572b93cefcd2a54bb8234c3407941`, this Lock does not apply. Re-review is required.

```text
RESULT: Human CORR-1G Definition Lock GO = GO / CONSUMED
CORR-1G Definition = HUMAN DEFINITION LOCKED
Exact Scope Scout = ELIGIBLE / NOT STARTED
Implementation Start = NOT AUTHORIZED
Ready / Merge / Deploy = NOT AUTHORIZED
```

```text
STOP = no Product implementation from this Lock
     = no Exact Scope authorship by this record
     = no Ready / Merge / Deploy / LIVE WRITE
     = no PLANNER / ADMIN_AUDIT completion claim
     = no CORR-1F reopen
     = no locked packet rewrite
```
