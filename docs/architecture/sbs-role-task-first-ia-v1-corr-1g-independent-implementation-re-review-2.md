# SBS-ROLE-TASK-FIRST-IA-V1 — CORR-1G Independent Implementation Re-Review-2

Fresh Independent Implementation Re-Review-2 against Product PR #631 exact HEAD after Correction-2. This record is **not** a self-PASS. It does **not** authorize Human Task reconfirmation, Ready re-judgment, or Merge.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: CORR-1G
kind: independent implementation re-review-2
date: 2026-09-16
Review Basis: PR #631
Exact HEAD: 3451f0f92c613f8a282bf71f77d683a4d3e49a2d
Base: e53eafe5c3b50d115e02bcb55c913de8547e6729
PR: OPEN / NOT MERGED
Prior Merge GO @ b3ea6c70: VOID / NOT CARRIED
verdict: CORRECTION REQUIRED
P0 = 0
P1 = 3
P2 = 3 / NON-BLOCKING
P1-2 = CLOSED
P1-3 = CLOSED
Human Task Reconfirmation: NOT ELIGIBLE YET
Ready Re-Judgment: NOT ELIGIBLE
Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
```

Correction-2 itself succeeded on its two target findings. This Re-Review looks at the whole exact HEAD, so locked-Scope mismatches that were previously Codex P2 are reclassified as P1.

Independent Implementation Re-Review-2 ≠ Correction-3 GO ≠ Re-Review-3 PASS ≠ HTA ≠ Ready ≠ Merge.

---

## Correction-2 target findings

| ID | Finding | Status |
|---|---|---|
| P1-2 | sufficient Global host restore | **CLOSED** |
| P1-3 | object replacement occurrence non-carry | **CLOSED** |

---

## P0

```text
P0 = 0
```

---

## P1

```text
P1 = 3
```

### P1-4 — Exact-head required CI is not green

Contracts and Process CI FAILURE at `format:check` on `spfx/smoke/sbs-role-task-first-ia-1/run-smoke.mjs`. Downstream Typecheck / Test / contract-boundary / Scope / a11y were skipped. Exact Scope §6 requires format/lint/typecheck PASS on modified files.

Disposition: format-only correction in the already-authorized smoke file; rerun exact-head CI.

### P1-5 — D-TODAY acquisition is not restricted to the locked Primary Action episode

Locked Scope binds acquisition to FIELD_STAFF 未実施 CTA `対象の支援を始める`. `TodaySupportDayBoard` invokes `onSelectOccurrence` for every status; chrome reports `SELECT_OCCURRENCE` without checking 未実施. Non-PA rows can set object true and land D-PROCEDURE.

Required: report Task-First `SELECT_OCCURRENCE` on D-TODAY only for the locked 未実施 Primary Action episode.

### P1-6 — FIELD_STAFF adapter leaks into PLANNER / ADMIN_AUDIT presentation

`fieldStaffAdapterActive = Boolean(onFieldStaffSessionEvent)` is not gated on `activePresentationRole`. Demo role switch leaves PLANNER / ADMIN_AUDIT under the FIELD_STAFF bridge (AC-1G-17).

Required: adapter semantics only when `activePresentationRole === "FIELD_STAFF"`.

---

## P2

```text
P2 = 3 / NON-BLOCKING AT THIS REVIEW
```

- procedure → UserDetail back can leave Task-First Destination at D-PROCEDURE
- released person context can leave stale chrome `selectedOccurrenceId`
- D-UNRECORDED CTA copy does not precisely describe direct D-RECORD-WRITE

These do not override P1-4 / P1-5 / P1-6.

---

## Verdict

```text
Independent Implementation Re-Review-2 = CORRECTION REQUIRED
NEXT = CORR-1G Implementation Correction-3 GO
STOP = no Merge / no Ready re-judgment / no HTA reconfirmation / no Deploy
```
