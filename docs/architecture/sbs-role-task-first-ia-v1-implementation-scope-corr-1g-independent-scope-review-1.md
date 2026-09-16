# SBS-ROLE-TASK-FIRST-IA-V1 — CORR-1G Independent Scope Review-1

Fresh Independent Scope Review against the Exact Scope body only. This record does **not** rewrite the reviewed Scope, does **not** consume Exact Scope Correction-1 GO, and does **not** authorize Implementation Start.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: CORR-1G
kind: independent scope review-1
date: 2026-09-16
reviewed scope path:
  docs/architecture/sbs-role-task-first-ia-v1-implementation-scope-corr-1g.md
reviewed exact HEAD: 9363e81327dadf1de1f337e27f0260765fb8b6bc
reviewed exact scope blob: bee42303b67346a0fe9c5a6b49cd51b8c358a593
normative surface: Scope body only
implementation / prior conversations / Scout sidecars: EXCLUDED / NON-NORMATIVE
locked packet blob: 9718231d93c572b93cefcd2a54bb8234c3407941
Human Definition Lock blob: 2577a5f1b03d6355318c83b8f29b070a051752fe
verdict: CORRECTION REQUIRED
P0 = 0
P1 = 3
P2 = 1
Human Correction Implementation GO Eligibility: NOT ELIGIBLE
Human Correction Implementation GO: NOT AUTHORIZED / NOT CONSUMED
Exact Scope Correction-1 GO: NOT RECEIVED / NOT CONSUMED
Implementation Start: NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
Product / SPFx mutation: NONE / NOT AUTHORIZED
```

This record captures the Independent Scope Review verdict. It does not rewrite the reviewed Scope. Changing the Scope body would change blob `bee42303…` and is Exact Scope Correction-1, which requires a separate Human GO plus unique closure of the leftover choices below.

---

## Review Basis Sufficiency

```text
Review Basis Sufficiency = PASS
Reviewed Basis = docs/architecture/sbs-role-task-first-ia-v1-implementation-scope-corr-1g.md
Reviewed ref = 9363e813
Exact scope blob = bee42303b67346a0fe9c5a6b49cd51b8c358a593
Normative Surface = Scope body only
Scope rewrite by this record = NONE
```

---

## P0

```text
P0 = 0
```

No P0. CORR-1G remains limited to FIELD_STAFF sufficient-path reachability, preserves CORR-1F fallbacks, keeps PLANNER / ADMIN_AUDIT / P2-2 / P2-3 / domain / LIVE WRITE OUT, and explicitly withholds Implementation Start.

---

## P1

```text
P1 = 3
```

### P1-1 — D-UNRECORDED OPTION A is not closed to an existing authorized Product interaction

The Scope requires:

```text
D-UNRECORDED occurrence choice
  → acquire/replace support object
  → acquire occurrence
  → D-RECORD-WRITE
```

The Scope’s own Scout observation says the current unrecorded-row path goes to `UserDetail`, while §3 keeps `UsersList.tsx` and `UserDetail.tsx` OUT and permits AppShellChrome to bind only already-exposed callbacks.

§3.3 then introduces `users + 未記録 chip + choosing that unrecorded occurrence (not a person-index open)` without identifying the exact existing callback and payload that represents that occurrence choice.

Leftovers an implementer could pick:

- reinterpret existing person-open as occurrence choice
- intercept another callback in AppShellChrome
- add a new occurrence selector
- touch UsersList/UserDetail and trigger H-3

The Exact Scope therefore does not yet prove that AC-1G-5 is implementable inside its closed file set.

Required Correction: identify the exact existing Product callback/event and the occurrence/object identity it carries. If no such existing callback exists, `H-3 = FIRED` and the Scope must be amended and independently re-reviewed rather than inferred during implementation.

This record does **not** pick that callback.

### P1-2 — D-UNRECORDED occurrence release is omitted from Exact Scope binding and ACs

The locked CORR-1G meaning includes occurrence false→true→false. The Exact Scope maps occurrence acquisition from D-UNRECORDED, but §3.3 has no binding for:

```text
Explicit deselect / no remaining chosen occurrence on D-UNRECORDED
  → occurrence false
  → remain D-UNRECORDED
  → 記録する fallback restored
```

AC-1G-1..20 likewise contain no explicit acceptance criterion for this independent occurrence release. An implementation can satisfy every listed AC while keeping occurrence sticky until the support object itself is released.

Required Correction: add the D-UNRECORDED explicit occurrence-deselect event to §3.3 and add corresponding unit/smoke acceptance evidence.

### P1-3 — D-TODAY explicit object deselect lacks a closed Product surface

§3.3 requires `Explicit deselect / no remaining chosen object on D-TODAY` → RELEASE, described only as `Product-visible clear of the D-TODAY chosen object` without identifying the actual control/callback.

`TodaySupportDayBoard.tsx` is authorized narrowly for `D-TODAY Primary Action bind / FIELD_STAFF 未実施 CTA only`. The Scope does not make clear whether an existing deselect control already exists, ScaffoldShell owns a visible clear action, TodaySupportDayBoard may add a new clear control, or another surface would be required.

Required Correction: bind object deselect to an exact existing Product-visible callback/control. If a new minimal clear control is required, explicitly authorize its file and exact purpose in §3 before Implementation Start.

This record does **not** pick that control.

---

## P2

```text
P2 = 1
```

### P2-1 — Explicit persistence events could receive targeted regression evidence

The Scope correctly states that Global 今日 does not release sticky object and AC-1G-18 verifies it. Other locked non-release Back cases are primarily protected through the generic H-6 / AC-1G-20 invariant rather than individually mapped. Non-blocking. Targeted unit coverage for Back persistence would reduce regression risk.

Correction-1 minimum scope does **not** require closing P2-1.

---

## Question results (Scope §10)

| ID | Question | Result |
|---|---|---|
| Q1 | FIELD_STAFF-only boundary | **PASS** |
| Q2 | Product / verification surface closed | **FAIL — P1-1 / P1-3** |
| Q3 | Locked Definition restated without new Destination | **PASS** |
| Q4 | Acquisition / release bindings unique and implementation-closed | **FAIL — P1-1 / P1-2 / P1-3** |
| Q5 | AppShellChrome remains adapter, not second V1 Global | **PASS** |
| Q6 | AC-1G-1..20 fully prove locked Scope | **FAIL — P1-2** |
| Q7 | domain / schema / LIVE / P2-2 / P2-3 exclusions | **PASS** |
| Q8 | D-PERSON is identity addition, not new Destination | **PASS** |
| Q9 | Deferred items not closed by side effect | **PASS** |
| Q10 | durable Definition lineage required before Implementation Start | **PASS** |
| Q11 | CORR-1F insufficient-context fallbacks preserved | **PASS** |
| Q12 | Implementation Start remains unauthorized | **PASS** |

H-9 remains independently applicable: the eventual implementation base must contain or descend from the durable CORR-1G packet + Definition Lock + Re-Review-2 lineage before Implementation Start can be bound.

---

## Verdict

```text
Independent Scope Review-1 = CORRECTION REQUIRED / CONSUMED by this record
Human Correction Implementation GO Eligibility = NOT ELIGIBLE
Human Correction Implementation GO = NOT AUTHORIZED / NOT CONSUMED
Exact Scope Correction-1 GO = NOT RECEIVED / NOT CONSUMED
Implementation Start = NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
Product / SPFx mutation = NONE / NOT AUTHORIZED
```

---

## NEXT / STOP

```text
NEXT = CORR-1G Exact Scope Correction-1
       (requires separate Human Exact Scope Correction-1 GO)
Correction-1 minimum scope (after GO; this record does not apply it):
  1. bind D-UNRECORDED occurrence choice to an exact existing authorized
     callback/payload, or fire H-3
  2. bind and verify D-UNRECORDED explicit occurrence deselect
  3. bind D-TODAY object deselect to an exact authorized Product-visible
     control/callback
  4. do not widen any other CORR-1G scope
After Correction-1:
  Fresh Independent Scope Re-Review
STOP = no Human Correction Implementation GO
     = no Implementation Start
     = no Product mutation
     = no Scope rewrite from this record (blob bee42303 remains the reviewed body)
     = no Ready / Merge / Deploy / LIVE WRITE
```
