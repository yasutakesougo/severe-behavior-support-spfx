# SBS-ROLE-TASK-FIRST-IA-V1 — CORR-1G Human Correction Implementation GO

Human Correction Implementation GO consumption for CORR-1G after docs PR #630 Merge and Independent Scope Re-Review REVIEW-CLEARED. This record authorizes Exact Scope Product mutation only. It does **not** authorize Ready, Merge, Deploy, LIVE WRITE, or Human Task Acceptance.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: CORR-1G
kind: Human Correction Implementation GO record
date: 2026-09-16

Human CORR-1G Correction Implementation GO: RECEIVED / CONSUMED
Implementation Start: AUTHORIZED (Exact Scope §3 / §6 only)
implementation base: origin/main e53eafe5c3b50d115e02bcb55c913de8547e6729
  (docs PR #630 merge commit; expected head dc1ec9f7 is ancestor)

locked packet blob: 9718231d93c572b93cefcd2a54bb8234c3407941
Lock blob: 2577a5f1b03d6355318c83b8f29b070a051752fe
Scope blob: 83e9a9e6b0d724038f830ea5e6b4c8e6ce732592
Independent Definition Re-Review-2: present on base
Independent Scope Re-Review: REVIEW-CLEARED / P0=0 / P1=0 / P2-1 NON-BLOCKING
H-9 durable lineage bind: SATISFIED on this base

Human Ready / Merge of the Product PR: NOT AUTHORIZED
Human Task Acceptance: NOT AUTHORIZED
Deploy / LIVE WRITE: NOT AUTHORIZED
CORR-1F reopen: NOT AUTHORIZED
Rewrite locked packet / Lock / Scope body: NOT AUTHORIZED
P2-2 / P2-3 / PLANNER / ADMIN_AUDIT: OUT
```

This Decision consumes Human CORR-1G Correction Implementation GO. In this workstream that GO is the Exact-slice Implementation Start authorization (KI-GOV-003). It does **not** consume Product Ready or Merge.

Human Correction Implementation GO ≠ Product Ready ≠ Product Merge ≠ Human Task Acceptance ≠ Deploy.

---

## Authorized mutation

```text
spfx/src/shell/ux/field-staff-task-navigation.ts
spfx/src/shell/ux/field-staff-task-navigation.test.ts
spfx/src/shell/ux/index.ts
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.tsx
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.module.scss
spfx/src/shell/ux/AppShellChrome.tsx
spfx/src/shell/dashboard/TodaySupportDayBoard.tsx
spfx/src/shell/dashboard/today-support.test.ts
spfx/smoke/sbs-role-task-first-ia-1/run-smoke.mjs
spfx/smoke/sbs-role-task-first-ia-1/smoke-entry.tsx
docs/architecture/sbs-role-task-first-ia-v1-corr-1g-human-correction-implementation-go.md
```

UsersList / UserDetail / CurrentProcedure / ProcedureRecordForm / DailyRecords / primary-navigation / domain / schema remain OUT (H-3).

---

## NOT AUTHORIZED

```text
Ready / Merge of the Product PR (separate Human GOs)
Human Task Acceptance
Deploy / App Catalog / LIVE WRITE / SharePoint / M365 / Entra
Issue close
SHELL-UX-7 Decision ledger repeal
Notion production page update
CORR-1F reopen / Global labels-order rewrite
Rewrite locked CORR-1G packet / Lock / reviewed Scope
P2-2 / P2-3 closure
PLANNER / ADMIN_AUDIT Global completion
```

---

## H-9 readback (implementation bind)

```text
origin/main @ e53eafe5
packet blob 9718231d = YES
Lock blob   2577a5f1 = YES
Independent Definition Re-Review-2 present = YES
H-9 = SATISFIED for this bind
```

---

## Next gate after Product work

```text
1. Implement AC-1G-1..22 inside authorized files
2. Independent Implementation Review (separate; no self-PASS)
3. Human Task Acceptance (separate)
4. Product PR Human Ready GO (separate)
5. Product PR Human Merge GO (separate)
```
