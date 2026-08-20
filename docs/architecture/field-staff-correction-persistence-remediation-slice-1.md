# FIELD-STAFF-CORRECTION-PERSISTENCE-REMEDIATION-SLICE-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: FIELD-STAFF-CORRECTION-PERSISTENCE-REMEDIATION-SLICE-1
Kind: read-only exact remediation-slice definition
Parent:
  FIELD-STAFF-CORRECTION-PERSISTENCE-DOMAIN-CONTRACT-FAKE-PORT-1
  Independent Review-1 CONTROL OVERRIDE
  C3 CROSS-DATE POLICY Option A SELECTED / LOCKED
Binding: C1=A / C2=D / C3=D / C4=B / C5=E / C6=A / C7=A / C8=A / C9=B
C3 CROSS-DATE: Option A SAME-LOCAL-DATE ONLY
Implementation: COMPLETE (R1 / R2 only)
Schema mutation: FORBIDDEN
SharePoint WRITE: FORBIDDEN
Issue mutation: FORBIDDEN
Ready / Merge / Deploy / LIVE WRITE: FORBIDDEN
liveWriteAuthorized: FALSE
```

## 1. Objective

Close the two Control blockers on the uncommitted domain/contract/fake-port
implementation. This definition does not implement the changes.

```text
R1  same-local-date performedAt validation (C3 CROSS-DATE Option A)
R2  returned history must not mutate internal fake-port store
```

## 2. Locked Decision used by R1

```text
correction.performedAt allowed only when
  toAsiaTokyoCalendarDay(performedAt) === original ProcedureRecord.LocalDate
cross-date performedAt: REJECT
original LocalDate: IMMUTABLE
correction-owned LocalDate / effectiveLocalDate: FORBIDDEN
cross-date semantics: OUT OF v1
```

Reuse existing `toAsiaTokyoCalendarDay`. Do not invent a new calendar function.

## 3. Exact source area

```text
IN:
  src/domain/procedure-record-correction.ts
  src/domain/procedure-record-correction-persistence.ts
  tests/domain/procedure-record-correction.test.ts
  src/domain/index.ts (re-export only if already required; no new public surface beyond R1/R2)

HYGIENE (required before later Commit GO, not a third semantic item):
  Prettier on the three implementation files

OUT:
  ProcedureRecord UPDATE / DELETE / replacement
  Correction UPDATE / DELETE
  cancellation / lifecycle / ProcedureRecordLifecycleEvent
  UI save wiring
  SharePoint adapter / schema / WRITE
  correctedAtIso caller-contract documentation for UI (carry; not this slice)
  npm test quoted-glob tooling residual
  appendCalled rename
```

## 4. R1 — same-local-date validation

### Binding input

`ProcedureRecordCorrectionOriginalBinding` must include the original
`ProcedureRecord.LocalDate` as immutable original context (copy of the
original record's calendar day). Name it `originalLocalDate`.

```text
originalLocalDate:
  required
  immutable original context
  NOT a client-editable factual field
  NOT a correction-owned LocalDate
  NOT effectiveLocalDate
```

The correction entity may retain `originalLocalDate` as copied original
context, consistent with copied org/site/user/procedure/plan fields.
It must not become a second calendar identity for the correction.

Client objects that include `LocalDate` or `originalLocalDate` remain
forbidden client fields.

### Assemble rule

After `performedAt` is a valid ISO DateTime:

```text
tokyoDay = toAsiaTokyoCalendarDay(performedAt)
if tokyoDay is null OR tokyoDay !== originalLocalDate:
  REJECT (do not assemble, do not persist)
```

Same-day `performedAt` that differs in clock time from the original
`performedAt` remains allowed (C3=D). Only calendar-day mismatch is rejected.

Do not rewrite original `ProcedureRecord.LocalDate`.
Do not change identity namespaces, frozen-payload field order, or SHA-256
rules except as required to keep `originalLocalDate` out of client-editable
identity mutation. Frozen payload remains factual correction fields plus
correction metadata (`result`, `performedAt`, `reason`, `correctedAt`,
`correctedBy`). `originalLocalDate` is original context, not frozen
correction-payload identity material.

### Fail-closed mapping

Assemble rejection of cross-date is invalid input. Persistence port must not
append. Outcome remains `save_failed` for submit (same as other INVALID_INPUT).

## 5. R2 — returned list cannot mutate internal history

In-memory / fake storage must return values that cannot mutate the internal
Maps.

Required for:

- `findByCorrectionId`
- `findByIdempotencyKey`
- `listByOriginalRecordId`
- domain port `listCorrections`

```text
internal store keeps its own records
returned entities are copies (field-level copy of the frozen shape)
returned arrays are new arrays
mutating a returned object's fields must not change the store
mutating a returned array (push/splice) must not change the store
```

Do not add update/delete methods.
Do not expose a writable store as the public persistence-port surface.
Test-only `storage` inspection may remain for domain tests, but public
`listCorrections` / lookup results must still be copy-isolated.

## 6. Required tests

R1:

- same Asia/Tokyo calendar day as `originalLocalDate` with a different clock
  time is accepted
- `performedAt` whose Asia/Tokyo day differs from `originalLocalDate` is rejected
- original `LocalDate` is not rewritten
- client cannot supply `LocalDate` / `originalLocalDate` as editable input
- rejected cross-date does not append

R2:

- mutate a listed correction field; subsequent list/lookup still has original values
- mutate a listed array; internal history length unchanged

Existing Independent Review tests remain required (identity, replay, unknown
outcome, auth fail-closed, reason, append-only surface).

## 7. Acceptance criteria

- C3 CROSS-DATE Option A is represented by one assemble/validate rule
- original `LocalDate` remains immutable
- no new date vocabulary beyond copied `originalLocalDate`
- fake-port / list results cannot mutate internal history
- `liveWriteAuthorized` remains `false`
- no SharePoint / Graph / schema / UI / lifecycle change

## 8. Rollback

Source-only: revert the R1/R2 edits on the three files (and index if touched).

## 9. Stop

```text
C3 CROSS-DATE POLICY: SELECTED / LOCKED (Option A)
Exact remediation slice: FIXED / LOCKED
Remediation implementation: COMPLETE (R1 / R2)
Commit / Push / PR: NOT AUTHORIZED (await Human Commit GO)
liveWriteAuthorized: FALSE
```
