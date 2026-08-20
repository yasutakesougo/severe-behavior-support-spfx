# FIELD-STAFF-CORRECTION-PERSISTENCE C3 CROSS-DATE POLICY

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: FIELD-STAFF-CORRECTION-PERSISTENCE-C3-CROSS-DATE-POLICY-1
Kind: Human Decision
Parent: FIELD-STAFF-CORRECTION-PERSISTENCE C3=D
Independent Review-1 Control: DECISION REQUIRED
Date: 2026-08-20
Implementation: FORBIDDEN
Schema mutation: FORBIDDEN
SharePoint WRITE: FORBIDDEN
Issue mutation: FORBIDDEN
Ready / Merge / Deploy / LIVE WRITE: FORBIDDEN
```

## 1. Decision

```text
FIELD-STAFF-CORRECTION-PERSISTENCE
C3 CROSS-DATE POLICY

Human Decision:
Option A — SAME-LOCAL-DATE ONLY
SELECT

Status: SELECTED / LOCKED
```

## 2. Locked semantics

```text
v1 correction performedAt:
  allowed only when Asia/Tokyo calendar day equals
  original ProcedureRecord.LocalDate

cross-date performedAt:
  REJECT

original ProcedureRecord.LocalDate:
  IMMUTABLE

cross-date correction semantics:
  OUT OF v1

future cross-date permission:
  requires a separate Contract Decision covering
  effective date / projection / presentation semantics
```

This Decision does **not** change C3=D (v1 factual allowlist remains
`result` and `performedAt`). It closes the residual calendar-day meaning
that C3=D left undefined.

This Decision does **not** introduce:

- correction-owned `LocalDate`
- `effectiveLocalDate`
- original `LocalDate` rewrite
- projection/search/UI calendar reinterpretation

## 3. Relation to C3=D

C3=D remains: client-editable factual fields are `result` and `performedAt`;
original binding/context is immutable.

Option A adds one validation invariant:

```text
toAsiaTokyoCalendarDay(correction.performedAt)
  === original ProcedureRecord.LocalDate
```

Mismatch is invalid input and must not assemble or persist a correction.

## 4. Packet disposition

```text
Decision status: SELECTED / LOCKED
Implementation: FORBIDDEN until separate Implementation Start GO
Next: exact remediation slice (Control)
```
