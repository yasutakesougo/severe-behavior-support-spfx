# SBS-ROLE-TASK-FIRST-IA-V1 — CORR-1G Independent Definition Review-1

Fresh Independent Definition Review-1 against the CORR-1G Complete Controlled Packet body only. Consumed by Definition Correction-1. This record is **not** a Human Definition Lock and does **not** authorize Implementation Start.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: CORR-1G
kind: independent definition review-1
date: 2026-09-16
reviewed packet HEAD: 6b070fd1ea844dfc1176cc9a1239f12e71e04701
reviewed packet path:
  docs/architecture/sbs-role-task-first-ia-v1-corr-1g-complete-controlled-packet.md
reviewed packet blob at that HEAD:
  f7389ce4d0a4b9287a909a142f33d04c15fcf312
parent Correction-2 packet blob: 5eeb8140772ebfefe050cff93361a6d81c470f81
parent Human Definition Lock blob: 794d227a1e69c709e679337be6478b32de81d74a
verdict: CORRECTION REQUIRED / CONSUMED
P0 = 0
P1 = 3
P2 = 2
Human Definition Lock Eligibility: NOT ELIGIBLE (pre-Correction-1)
Implementation Start: NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
```

Normative surface for this review was the packet body at `6b070fd1` only. Kickoff, PR body, implementation, and sidecars were non-normative.

---

## Verdict consumed

```text
Review Basis Sufficiency = PASS
P0 = 0
P1 = 3
P2 = 2
Verdict = CORRECTION REQUIRED / CONSUMED
Human Definition Lock Eligibility = NOT ELIGIBLE until Correction-1
Implementation Start = NOT AUTHORIZED
```

---

## P1 (consumed by Correction-1)

| ID | Finding |
|---|---|
| P1-1 | Support-object acquisition not unique: parent phrase “D-TODAY selection” restated while list-visible without Primary Action was false; D-PERSON Destination after open was “D-PERSON (or return to D-TODAY)”; tension with locked C4 D-PERSON Next = FS-T2 |
| P1-2 | Support-object release/persistence not unique after D-PROCEDURE when using Global 今日 or Back |
| P1-3 | Occurrence-context acquisition unique; release/persistence not unique except “Back without a selected occurrence” |

## P2 (consumed where Definition can close)

| ID | Finding |
|---|---|
| P2-1 | C6 table omitted D-PERSON while acquisition could land there |
| P2-2 | HOLD H-1–H-4 blocked new Destinations / LIVE WRITE / dual Global / Start-from-packet, but did not freeze acquisition/release leftovers |

---

```text
STOP = this record does not Lock CORR-1G
     = this record does not PASS a later Re-Review
     = this record does not authorize Implementation Start
```
