# SBS-ROLE-TASK-FIRST-IA-V1 — CORR-1G Human Implementation Correction-1 GO

Human Implementation Correction-1 GO consumption for CORR-1G Product PR #631. This record authorizes uniqueness correction of the exact-head smoke P1 only. It does **not** self-PASS Independent Implementation Review, Ready, Merge, or Human Task Acceptance.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: CORR-1G
kind: Human Implementation Correction-1 GO record
date: 2026-09-16
Docs/Product PR: #631
branch: cursor/corr-1g-product-implementation-fe8f
reviewed implementation HEAD: 8c1c73c40c4d2a68f567788e1a4543f84d5de71a

Human CORR-1G Implementation Correction-1 GO: RECEIVED / CONSUMED
P1-1 Decision: PRESERVE CLEAR
  D-TODAY onClearChosenOccurrence must not be overwritten by adapter
  overview → GLOBAL-TODAY using stale sessionContext

locked packet blob: 9718231d93c572b93cefcd2a54bb8234c3407941
Lock blob: 2577a5f1b03d6355318c83b8f29b070a051752fe
Scope blob: 83e9a9e6b0d724038f830ea5e6b4c8e6ce732592
Human Correction Implementation GO: RECEIVED / CONSUMED
Independent Implementation Review: NOT SELF-PASSED
Human Task Acceptance / Ready / Merge / Deploy: NOT AUTHORIZED
```

Correction-1 closes **P1-1 only**. It does not expand Exact Scope files and does not rewrite locked packet / Scope bodies.

Human Implementation Correction-1 GO ≠ Independent Implementation Review PASS ≠ Human Task Acceptance ≠ Ready ≠ Merge.

---

## P1-1 (exact-head smoke)

```text
Evidence: role-task-first-browser-smoke FAIL @ 8c1c73c4
  today-pa-acquire waitForFunction object===false TimeoutError 30000ms
  (SELECT → D-PROCEDURE and GLOBAL 今日 sticky object-true both succeeded)
```

Cause: `TodaySupportDayBoard.onClearChosenOccurrence` reports CLEAR, then chrome `onSelectedDestinationChange("overview")` runs `handleTaskGlobalChange("GLOBAL-TODAY")` against **stale** `this.state` (object still true). That setState overwrites CLEAR. AC-1G-22 fails. AC-1G-18 (今日 does not release) is preserved when Destination is not already D-TODAY.

Decision: PRESERVE CLEAR. Adapter overview transport must not re-apply GLOBAL-TODAY when Task-First is already D-TODAY. Session events apply through functional `setState`.

---

## Authorized mutation

```text
docs/architecture/sbs-role-task-first-ia-v1-corr-1g-human-implementation-correction-1-go.md
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.tsx
spfx/src/shell/ux/AppShellChrome.tsx   (stop redundant overview notify on D-TODAY clear)
```

UsersList / UserDetail / CurrentProcedure / domain / Scope body / packet remain OUT.

---

## NOT AUTHORIZED

```text
Independent Implementation Review self-PASS
Human Task Acceptance
Product Ready / Merge
Deploy / LIVE WRITE
Scope / packet / Lock rewrite
CORR-1F reopen
P2-2 / P2-3 / PLANNER / ADMIN_AUDIT
```

---

## Next gate

```text
1. Apply P1-1 uniqueness close
2. Re-run role-task smoke / heft
3. Independent Implementation Re-Review (separate; no self-PASS)
4. Human Task Acceptance / Ready / Merge remain separate GOs
```
