# SBS-ROLE-TASK-FIRST-IA-V1 — CORR-1G Human Implementation Correction-2 GO

Human Implementation Correction-2 GO consumption for CORR-1G Product PR #631. This record authorizes the two post-Ready unresolved P1 uniqueness closes only. It does **not** self-PASS Independent Implementation Review, Human Task reconfirmation, Ready re-judgment, or Merge.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: CORR-1G
kind: Human Implementation Correction-2 GO record
date: 2026-09-16
Docs/Product PR: #631
  url: https://github.com/yasutakesougo/severe-behavior-support-spfx/pull/631
branch: cursor/corr-1g-product-implementation-fe8f
HOLD HEAD (Merge not executed): b3ea6c70e14d14ca64cdcdf9501b0d982c84433f
Codex review commit: f3d32e23d83dfc7b9bb0d3c32c2349917d76a79f
f3d32e23..b3ea6c70 product code change: NONE (Ready decision docs only)

Human CORR-1G Implementation Correction-2 GO: RECEIVED / CONSUMED
Human Merge GO @ b3ea6c70: RECEIVED / merge mutation NOT EXECUTED / VOID for any new HEAD
MERGE RESULT: HOLD / NOT EXECUTED (post-Ready unresolved P1)
Human Ready GO @ prior HEAD: VOID for any new HEAD (Ready re-judgment required later)
HTA PASS @ 99f0a85c: historical record remains; does not authorize merging known P1
Independent Implementation Review: NOT SELF-PASSED
Deploy / LIVE WRITE: NOT AUTHORIZED

locked packet blob: 9718231d93c572b93cefcd2a54bb8234c3407941
Lock blob: 2577a5f1b03d6355318c83b8f29b070a051752fe
Scope blob: 83e9a9e6b0d724038f830ea5e6b4c8e6ce732592
```

CI GREEN does not override unresolved P1. Human Merge GO does not carry to a future HEAD.

Human Implementation Correction-2 GO ≠ Independent Implementation Re-Review PASS ≠ Human Task reconfirmation ≠ Ready re-judgment ≠ Merge.

---

## P1-2 (post-Ready Codex; sufficient-path Product-reachable)

```text
After object/occurrence acquire, Global 今日 clears AppShellChrome
selectedUserDetailId / currentProcedureOpen / record-form.
Subsequent Global 手順 / 記録する with sufficient context sets Task-First
D-PROCEDURE / D-RECORD-WRITE, but requestLegacyShellDestination only clicks
the generic users adapter. UsersList remains visible.
CORR-1G-A/B sufficient-path Product-reachable is not satisfied.
```

Decision: RESTORE HOST SURFACE. When Task-First identity is already D-PROCEDURE or D-RECORD-WRITE with a chosen occurrence, the users adapter must reconstruct CurrentProcedure / ProcedureRecordForm. Hidden users-nav click must not collapse that host to UsersList.

---

## P1-3 (post-Ready Codex; object replacement occurrence carry)

```text
D-TODAY SELECT_OCCURRENCE (and PERSON_OPEN with a day’s occurrence) copied
hasOccurrenceContext from the previous object. Replacing object A→B could
leave occurrence-true for A, so Global 記録する treated stale context as sufficient.
```

Decision: DO NOT CARRY. Replacement object acquisition sets occurrence false unless the same episode also acquires the new occurrence (D-UNRECORDED SELECT / PROCEDURE_COMPLETE). D-TODAY Primary Action and D-PERSON open do not acquire occurrence (locked packet §3.2 rule 6).

---

## Authorized mutation (minimum)

```text
docs/architecture/sbs-role-task-first-ia-v1-corr-1g-human-implementation-correction-2-go.md
spfx/src/shell/ux/field-staff-task-navigation.ts
spfx/src/shell/ux/field-staff-task-navigation.test.ts
spfx/src/shell/ux/AppShellChrome.tsx
spfx/smoke/sbs-role-task-first-ia-1/run-smoke.mjs
```

UsersList / UserDetail / CurrentProcedure / ProcedureRecordForm source files remain OUT (bind already-exposed hosts from AppShellChrome only). Packet / Lock / Scope bodies remain UNCHANGED.

---

## NOT AUTHORIZED

```text
Merge of PR #631
Carry of Human Merge GO @ b3ea6c70 to a new HEAD
Ready re-judgment (separate later GO)
Human Task reconfirmation (separate later gate)
Independent Implementation Re-Review self-PASS
Deploy / LIVE WRITE
Scope / packet / Lock rewrite
CORR-1F reopen
P2 Codex items (unperformed CTA restriction; adapter role gate;
  back-from-procedure destination; chrome occurrence clear on PERSON_BACK;
  D-UNRECORDED CTA label) — not this Correction-2 minimum
P2-2 / P2-3 / PLANNER / ADMIN_AUDIT
```

---

## Next gate (after this correction lands)

```text
1. Apply P1-2 / P1-3 uniqueness close
2. Re-run role-task smoke / navigation unit tests
3. Fresh Independent Implementation Re-Review (separate; no self-PASS)
4. Human Task reconfirmation if required
5. Ready re-judgment (separate GO)
6. new-head Human Merge GO (does not inherit b3ea6c70 Merge GO)
```
