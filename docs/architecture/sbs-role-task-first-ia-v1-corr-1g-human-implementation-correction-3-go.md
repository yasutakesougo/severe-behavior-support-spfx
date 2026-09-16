# SBS-ROLE-TASK-FIRST-IA-V1 — CORR-1G Human Implementation Correction-3 GO

Human Implementation Correction-3 GO consumption for CORR-1G Product PR #631. This record authorizes the three Re-Review-2 P1 uniqueness closes only. It does **not** self-PASS Independent Implementation Re-Review-3, Human Task reconfirmation, Ready re-judgment, or Merge.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: CORR-1G
kind: Human Implementation Correction-3 GO record
date: 2026-09-16
Docs/Product PR: #631
branch: cursor/corr-1g-product-implementation-fe8f
reviewed implementation HEAD: 3451f0f92c613f8a282bf71f77d683a4d3e49a2d
Independent Implementation Re-Review-2: CORRECTION REQUIRED / CONSUMED
  record: docs/architecture/sbs-role-task-first-ia-v1-corr-1g-independent-implementation-re-review-2.md

Human CORR-1G Implementation Correction-3 GO: RECEIVED / CONSUMED
P1-2 / P1-3: CLOSED by Correction-2 (unchanged)
P1-4 / P1-5 / P1-6: authorized uniqueness close only

locked packet blob: 9718231d93c572b93cefcd2a54bb8234c3407941
Lock blob: 2577a5f1b03d6355318c83b8f29b070a051752fe
Scope blob: 83e9a9e6b0d724038f830ea5e6b4c8e6ce732592
Prior Merge GO @ b3ea6c70: VOID / NOT CARRIED
Human Task Reconfirmation / Ready / Merge / Deploy: NOT AUTHORIZED
Independent Implementation Re-Review-3: NOT SELF-PASSED
```

Human Implementation Correction-3 GO ≠ Independent Implementation Re-Review-3 PASS ≠ HTA ≠ Ready ≠ Merge.

---

## Authorized mutation (minimum)

```text
1. Prettier-fix spfx/smoke/sbs-role-task-first-ia-1/run-smoke.mjs
   → exact-head Contracts and Process CI GREEN
2. D-TODAY Task-First SELECT_OCCURRENCE only for 未実施 Primary Action
3. fieldStaffAdapterActive only when activePresentationRole === FIELD_STAFF
```

Authorized files:

```text
docs/architecture/sbs-role-task-first-ia-v1-corr-1g-independent-implementation-re-review-2.md
docs/architecture/sbs-role-task-first-ia-v1-corr-1g-human-implementation-correction-3-go.md
spfx/smoke/sbs-role-task-first-ia-1/run-smoke.mjs
spfx/src/shell/dashboard/TodaySupportDayBoard.tsx
spfx/src/shell/dashboard/today-support.test.ts
spfx/src/shell/ux/AppShellChrome.tsx
```

Packet / Lock / Scope bodies remain UNCHANGED. UsersList / UserDetail / CurrentProcedure / OverviewDashboard.tsx remain OUT.

---

## NOT AUTHORIZED

```text
Merge of PR #631
Carry of Human Merge GO @ b3ea6c70
Ready re-judgment
Human Task reconfirmation
Independent Implementation Re-Review-3 self-PASS
P2 remaining Codex items
Deploy / LIVE WRITE
Scope / packet / Lock rewrite
```

---

## Next gate

```text
1. Apply P1-4 / P1-5 / P1-6
2. Rerun format:check + heft + role-task smoke
3. Fresh Independent Implementation Re-Review-3 (separate; no self-PASS)
4. HTA / Ready / new-head Merge remain later GOs
```
