# FIELD-STAFF-CORRECTION-UI-SAVE-WIRING-EXACT-SLICE-DEFINITION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: FIELD-STAFF-CORRECTION-UI-SAVE-WIRING-SLICE-1
Kind: read-only exact-slice definition
Parent: #448 / FIELD_STAFF TRACK A
Date: 2026-08-20
Baseline main: 0cc1bd7b4c5b3198b53db6e3b942aee98059b133
Upstream slices:
  #455 / FIELD-STAFF-PHASE8-CORRECTION-1 (presentation + disabled save boundary) — MERGED
  #461 / FIELD-STAFF-CORRECTION-PERSISTENCE-DOMAIN-CONTRACT-FAKE-PORT-1 — MERGED
Binding authority:
  field-staff-correction-persistence-authority-1.md (D1=B / D2=A / D3=B / D4=B)
  field-staff-correction-persistence-exact-slice-definition-1.md (C1–C9)
  field-staff-correction-persistence-c3-cross-date-policy-1.md (Option A — SAME-LOCAL-DATE ONLY)
Code mutation: NOT AUTHORIZED by this document
Issue mutation: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
SharePoint WRITE / schema mutation / Deploy / LIVE WRITE: NOT AUTHORIZED
```

## 1. Exact objective

Wire the FIELD_STAFF correction UI save path from the existing read-only
presentation surface (#455) through a presentation-layer application service
into the accepted domain contract and fake append-only persistence port (#461).

The slice closes the gap explicitly marked OUT in both upstream slices:

```text
#455: save CTA disabled / save semantics not connected
#461: UI save-button connection explicitly OUT
```

Success means a FIELD_STAFF actor can edit the v1 correction factual fields,
submit through `submitCorrection`, observe the existing 5-state save vocabulary,
and reach `saved` against the in-memory fake port — without mutating the
original ProcedureRecord, without SharePoint I/O, and with
`liveWriteAuthorized = false`.

## 2. Binding authority (unchanged)

```text
ProcedureRecord: CREATE-ONLY / IMMUTABLE
Correction: APPEND-ONLY / originalRecordId-bound
Correction UPDATE / DELETE: FORBIDDEN
ProcedureRecord UPDATE / DELETE / replacement: FORBIDDEN
C3 factual allowlist: result + performedAt (same-local-date only)
C4 reason: required non-empty free text
C5 actor/timestamp: system-derived (FieldStaffCorrectionAuthContext)
C6 history: read projection only
C7 lifecycle / cancellation: UNCHANGED / OUT
C9 liveWriteAuthorized: FALSE
SharePoint WRITE: NOT AUTHORIZED
```

## 3. React / hook / application-service surface

### 3.1 Primary UI component

| Surface | Role |
|---|---|
| `spfx/src/shell/procedure/ProcedureRecordCorrection.tsx` | Extend from read-only context display to editable correction form + wired save CTA. Remains the single correction screen component. |

Pattern reference: `ProcedureRecordForm.tsx` (save state machine, disabled
inputs while saving/saved/unknown, SaveStateBadge, duplicate-click guard).

The disabled-only button
`data-field-workflow="procedure-correction-save-disabled"` is replaced by a
wired save control
`data-field-workflow="procedure-correction-save"`.

### 3.2 Draft + guard module (new)

| Surface | Role |
|---|---|
| `spfx/src/shell/procedure/procedure-correction-draft.ts` | Correction-specific draft type, readiness validation, retry rules, draft retention on failure, in-flight guard. |

Draft shape (presentation layer):

```text
ProcedureCorrectionDraft {
  result: ProcedureRecordResultValue | undefined
  performedAtLocal: string          // datetime-local, Asia/Tokyo wall clock
  reason: string                    // required on save; trim before validate
}
```

Reuse the guard pattern from `procedure-record-draft.ts`
(`createProcedureRecordSaveInFlightGuard` may be reused verbatim or re-exported;
persistence idempotency remains domain-owned).

Initial draft seeding (from bound original record, not from free text):

```text
result            ← boundRecord.result
performedAtLocal  ← boundRecord.performedAt converted to datetime-local
reason            ← ""
```

### 3.3 Application service / persist wiring (new)

| Surface | Role |
|---|---|
| `src/domain/procedure-record-correction-staff-save.ts` | Canonical staff UI → domain mapping: datetime-local → ISO, assemble client input + auth, call persistence port. |
| `spfx/src/shell/procedure/procedure-correction-persist.ts` | SPFx wiring layer mirroring `procedure-record-persist.ts`. Builds `ProcedureRecordCorrectionOriginalBinding`, invokes staff-save helper. |
| `spfx/src/sbs-domain/correction-persist.bundle.js` (+ `.d.ts`) | esbuild bridge for SPFx isolated `rootDir`. Entry: `procedure-record-correction-staff-save.ts`. |

Do **not** import correction persistence through `kiosk-read-model.bundle`
(read-only). Do **not** hand-edit bundle logic.

### 3.4 Binding helper (new)

| Surface | Role |
|---|---|
| `spfx/src/shell/procedure/procedure-correction-binding.ts` | Pure helper: `ProcedureBindingContext` + kiosk `ProcedureRecord` → `ProcedureRecordCorrectionOriginalBinding`. Fail-closed when binding fields missing. |

### 3.5 Slice metadata (extend)

| Surface | Role |
|---|---|
| `spfx/src/shell/procedure/procedure-correction.ts` | Add `FIELD_STAFF_CORRECTION_UI_SAVE_WIRING_1_SLICE` metadata adjacent to existing `FIELD_STAFF_PHASE8_CORRECTION_1_SLICE`. Do not mutate #455 slice flags retroactively. |

Required new slice flags:

```text
id: "FIELD-STAFF-CORRECTION-UI-SAVE-WIRING-SLICE-1"
correctionSaveWiringAuthorized: true
correctionPersistAuthorized: true          // in-memory fake port only
liveWriteAuthorized: false
sharePointWriteAuthorized: false
cancellationAuthorized: false
lifecycleMutationAuthorized: false
deployAuthorized: false
```

### 3.6 Chrome integration (minimal)

| Surface | Role |
|---|---|
| `spfx/src/shell/ux/AppShellChrome.tsx` | Pass `originalBinding`, optional injectable port, and `onSaveStateChange` into `ProcedureRecordCorrection`. Reuse existing `handleProcedureFlowSaveStateChange` so saving pause matches ProcedureRecord form behavior. |

AppShellChrome remains a **prop assembler**, not a save orchestrator. It must
not call `submitCorrection` directly.

### 3.7 Copy updates (bounded)

| Surface | Role |
|---|---|
| `spfx/src/shell/procedure/procedure-copy.ts` | Replace `FIELD_WORKFLOW_CORRECTION_SAVE_BOUNDARY_NOTE` stale "未接続" wording with wired-boundary copy that states fake-port / no live write. |

## 4. #461 caller contract — where props originate

### 4.1 `ProcedureRecordCorrectionOriginalBinding`

Built in AppShellChrome via `buildProcedureCorrectionOriginalBinding(context, boundRecord)`:

| Field | Source |
|---|---|
| `originalRecordId` | `boundRecord.RecordId` |
| `OrganizationId` | `context.organizationId` |
| `SiteId` | `context.siteId` |
| `UserId` | `context.userId` |
| `Procedure` | `{ ProcedureId: context.procedureId, ProcedureVersion: context.procedureVersion, ApprovalState: "APPROVED" }` |
| `planId` / `planVersion` | `context.planId` / `context.planVersion` |
| `originalRecordedAt` | `boundRecord.recordedAt` |
| `originalRecordedBy` | `boundRecord.recordedBy` |
| `originalLocalDate` | `boundRecord.LocalDate` |

Sources already available at correction entry:

```text
selectedCurrentProcedure.context          → ProcedureBindingContext
selectedOccurrenceItem.boundRecord        → kiosk ProcedureRecord (Today Support path)
```

Fail-closed: if `boundRecord` or any required binding field is absent, save wiring
must not activate (save CTA stays disabled; no partial submit).

### 4.2 `ProcedureRecordCorrectionClientInput`

Built inside `ProcedureRecordCorrection` / staff-save helper from draft at save time:

```text
originalRecordId ← originalBinding.originalRecordId (must match)
result           ← draft.result
performedAt      ← asiaTokyoDateTimeLocalToIso(draft.performedAtLocal)
reason           ← draft.reason.trim()
```

Forbidden client fields remain rejected by domain `rejectForbiddenCorrectionClientFields`.

### 4.3 `FieldStaffCorrectionAuthContext`

```text
{ status: "AUTHORIZED", correctedBy: FIELD_WORKFLOW_RECORDER_SUBJECT_ID }
```

Synthetic FIELD_STAFF demo only. Real Entra / token-derived auth is OUT of this
slice. Auth failure paths (`NOT_AUTHENTICATED`, `NOT_AUTHORIZED`, `INDETERMINATE`)
are test-covered via injectable auth override in unit tests only; default demo
path uses AUTHORIZED synthetic actor.

### 4.4 `correctedAtIso` freeze + `nowIso`

Mirror `ProcedureRecordForm` freeze semantics:

```text
first save attempt:
  correctedAtIso ← nowIso() (Asia/Tokyo ISO)
retries of same payload:
  reuse frozen correctedAtIso ref
```

Passed into `ProcedureRecordCorrectionSubmitRequest.correctedAtIso` and
`nowIso` on every attempt.

## 5. Fake append-only port — call site

Default production-of-record for this slice:

```text
createInMemoryProcedureRecordCorrectionPersistencePort()
```

Call chain:

```text
ProcedureRecordCorrection.handleSave
  → persistStaffProcedureRecordCorrectionFromForm(input, port)
    → persistStaffProcedureRecordCorrection(input, port)
      → port.submitCorrection(request, auth)
        → assembleProcedureRecordCorrection (domain)
        → persistProcedureRecordCorrection (domain)
        → storage.append (in-memory fake)
```

Port instance scope:

```text
module singleton STAFF_PROCEDURE_RECORD_CORRECTION_IN_MEMORY_PORT
  created once per page load
  session-local append history only
  no SharePoint adapter
  liveWriteAuthorized: false
```

Injectable override via component prop `persistPort?` for tests.

Do **not** use `createLiveWriteHoldProcedureRecordCorrectionStoragePort` as the
default UI port. That port exists for HOLD/evidence of write denial; this slice
must demonstrate end-to-end `saved` against the fake append-only store.

## 6. Save state boundaries

Reuse existing `ShellSaveState` vocabulary unchanged:

| State | UI meaning | Input controls | Save CTA | Retry |
|---|---|---|---|---|
| `unsaved` | Draft editable, not yet submitted | enabled | enabled when draft ready | yes |
| `saving` | Submit in flight | disabled | disabled | no |
| `saved` | Fake port returned `saved` | disabled | disabled | no |
| `save_failed` | Definite failure | enabled (draft retained) | enabled after edit | yes |
| `save_outcome_unknown` | Uncertain outcome | disabled | disabled (no immediate resubmit) | no |

Mapping from domain:

```text
ProcedureRecordCorrectionSaveOutcome → ShellSaveState
  saved                 → saved
  save_failed           → save_failed
  save_outcome_unknown  → save_outcome_unknown
```

Pre-submit guard:

```text
isCorrectionDraftReadyToSave(draft):
  result defined
  performedAtLocal non-empty
  reason.trim().length > 0
  performedAt converts to ISO
  toAsiaTokyoCalendarDay(performedAt) === originalBinding.originalLocalDate   // C3 Option A

canRetryCorrectionSave(saveState):
  same rules as canRetryProcedureRecordSave
```

Status copy on failure / unknown reuses existing FIELD_WORKFLOW save notes
(`FIELD_WORKFLOW_SAVE_FAILED_RETAIN_NOTE`,
`FIELD_WORKFLOW_SAVE_OUTCOME_UNKNOWN_NOTE`).

## 7. Duplicate save prevention

Two layers (both required):

```text
Layer 1 — UI in-flight guard:
  createProcedureRecordSaveInFlightGuard().tryBegin() before async save
  end() in finally

Layer 2 — domain idempotency:
  frozen payload → deterministic CorrectionId + IdempotencyKey
  persistProcedureRecordCorrection dual-lookup before append
  replay of identical submit returns saved without second append
```

UI must not auto-retry on `save_outcome_unknown`.

## 8. Correction append-only invariant

Must remain true after wiring:

```text
- Original ProcedureRecord fixture / boundRecord is never mutated
- append-only: port has no update/delete for corrections or records
- success does not rewrite presentation.original record section
- success may append a read-only "submitted correction" summary block sourced
  from returned correction entity (copy only)
- occurrence resolver / effectiveStatus is NOT recomputed in this slice
- multiple corrections append to in-memory store; UI shows latest submitted
  correction from component state (not a live read-model refresh)
```

## 9. Presentation → domain command conversion

Single staff-save entry (canonical):

```text
persistStaffProcedureRecordCorrection(input, port)

input:
  originalBinding: ProcedureRecordCorrectionOriginalBinding
  result: ProcedureRecordResultValue
  performedAtLocal: string
  reason: string
  correctedBy: string                    // synthetic actor id
  correctedAtIso?: string
  nowIso: string
```

Conversion steps:

```text
1. performedAt = asiaTokyoDateTimeLocalToIso(performedAtLocal) — reuse staff-save helper
2. client = { originalRecordId, result, performedAt, reason }
3. auth = { status: "AUTHORIZED", correctedBy }
4. port.submitCorrection({ client, originalBinding, correctedAtIso, nowIso }, auth)
5. map saveState to ShellSaveState
```

Invalid conversion → `save_failed` without append (`appendCalled: false`).

## 10. Post-success UI update

On `saved`:

```text
- transition saveState → saved
- lock result / performedAt / reason inputs
- show SaveStateBadge + saved description
- render submitted correction summary (CorrectionId, correctedAt, correctedBy,
  result label, performedAt, reason) from returned correction object
- keep original record section unchanged (still the immutable source context)
- enable back navigation
- notify onSaveStateChange("saved") for chrome saving-pause release
```

On `save_failed`:

```text
- retain draft (including reason text)
- show failure note + retry-enabled save CTA
- do not alter original record section
```

On `save_outcome_unknown`:

```text
- retain draft but lock inputs + disable save CTA
- show unknown note (no success/failure collapse)
- do not mutate original record or append a synthetic success row
```

## 11. Error isolation — existing correction must not break

```text
- Errors during submit must not mutate boundRecord or fixture occurrence data
- Failed append must not clear the original-record presentation section
- In-memory port state is isolated from kiosk read-model fixtures
- Domain assemble failure returns save_failed with correction = null
- Component unmount during saving must not throw; guard ends in finally
```

## 12. Explicit OUT

```text
SharePoint WRITE / REST / Graph
SharePoint adapter / physical mapping / schema provisioning
createLiveWriteHoldProcedureRecordCorrectionStoragePort as default UI port
liveWriteAuthorized → true
cancellation / supersede / lifecycle event emission
occurrence effectiveStatus recomputation after correction save
ProcedureRecord CREATE / UPDATE / DELETE
correction UPDATE / DELETE
Entra / token / real auth integration
Deploy / App Catalog / tenant verification
Issue #448 body mutation / Issue close
cross-date performedAt (C3 Option A violation)
ABC workflow expansion
multi-user scale evidence deepening
```

## 13. Required unit / component tests

### Domain (existing — must remain passing)

```text
tests/domain/procedure-record-correction.test.ts
```

No domain contract changes authorized in this slice unless a separate Human GO
explicitly allows a bounded wiring-only export; prefer zero domain diff.

### SPFx unit tests (new / extended)

| File | Minimum coverage |
|---|---|
| `spfx/src/shell/procedure/procedure-correction-draft.test.ts` | readiness, retry rules, reason required, same-local-date rejection |
| `spfx/src/shell/procedure/procedure-correction-binding.test.ts` | binding builder fail-closed + happy path |
| `spfx/src/shell/procedure/procedure-correction-persist.test.ts` | staff-save mapping, saved/failed/unknown mapping, append called once |
| `spfx/src/shell/procedure/procedure.test.ts` (extend) | slice metadata flags; binding availability gating |
| `spfx/src/shell/procedure/ProcedureRecordCorrection.test.tsx` (new) | save state transitions, disabled/enabled CTA, duplicate click guard, draft retention on failure, success summary render |

Required scenarios:

```text
- happy path → saved against in-memory port
- blank reason → save CTA disabled
- cross-date performedAt → save_failed / not ready
- forbidden client field smuggling → save_failed without append
- duplicate click → single append
- identical retry → saved replay without second append (domain idempotency)
- save_outcome_unknown → inputs locked, no auto-retry
- save_failed → draft retained, original record section unchanged
- auth NOT_AUTHORIZED (injected) → save_failed
```

Run gate:

```text
cd spfx && npx heft test --clean
npm test (root domain tests)
```

## 14. Browser smoke — puppeteer-core 不在でも判定可能な受入条件

Three tiers. Tier 1–2 are mandatory for Implementation Start evidence.
Tier 3 is optional enhancement when puppeteer-core is available.

### Tier 1 — Source marker audit (puppeteer-free)

Add checks to `spfx/smoke/kiosk-ux-convergence/run-smoke.mjs` (or a sibling
`correction-save-wiring-source-smoke.mjs` invoked from CI) that read source
files only:

```text
PASS when all true:
  ProcedureRecordCorrection.tsx contains:
    data-field-workflow="procedure-correction-save"
    data-field-workflow-save-path="submitCorrection"
    FIELD-STAFF-CORRECTION-UI-SAVE-WIRING-SLICE-1
  procedure-correction-persist.ts exists and exports persistStaffProcedureRecordCorrectionFromForm
  correction-persist.bundle.js + .d.ts exist
  procedure-correction-draft.ts exists
  procedure-copy.ts no longer advertises save as "未接続" in CORRECTION_SAVE_BOUNDARY note
  FIELD_STAFF_CORRECTION_UI_SAVE_WIRING_1_SLICE.correctionSaveWiringAuthorized === true
FAIL if disabled-only save marker remains the sole save control
```

This tier runs with Node.js file reads only — no browser, no puppeteer-core.

### Tier 2 — Compile smoke (puppeteer-free)

Extend existing esbuild smoke bootstrap (same SCSS stub plugin pattern):

```text
PASS when:
  esbuild bundle of correction smoke entry succeeds
  bundled module exports renderable ProcedureRecordCorrection with injectable in-memory port
  production CSS compilation includes ProcedureRecordCorrectionUx.module.scss
```

### Tier 3 — Browser interaction (optional / puppeteer-core present)

When puppeteer-core is available, extend kiosk convergence correction path:

```text
navigate → 記録済み occurrence → 訂正 → fill reason → save
expect data-field-workflow-save-state="saved"
expect data-field-workflow="procedure-correction-save" disabled
expect no SharePoint/Graph network requests
```

Tier 3 failure must not block slice acceptance if Tier 1–2 pass and unit tests
pass (document puppeteer absence explicitly in evidence).

## 15. Changed-area candidate summary

```text
src/domain/procedure-record-correction-staff-save.ts          NEW (canonical mapping)
spfx/src/shell/procedure/procedure-correction-draft.ts       NEW
spfx/src/shell/procedure/procedure-correction-binding.ts     NEW
spfx/src/shell/procedure/procedure-correction-persist.ts     NEW
spfx/src/shell/procedure/ProcedureRecordCorrection.tsx       EDIT
spfx/src/shell/procedure/procedure-correction.ts             EDIT (slice metadata)
spfx/src/shell/procedure/procedure-copy.ts                   EDIT (boundary note)
spfx/src/shell/procedure/index.ts                            EDIT (exports)
spfx/src/shell/ux/AppShellChrome.tsx                         EDIT (props wiring)
spfx/src/sbs-domain/correction-persist.bundle.js             NEW (generated)
spfx/src/sbs-domain/correction-persist.bundle.d.ts           NEW
spfx/src/sbs-domain/README.md                                EDIT (bundle regen docs)
spfx/smoke/kiosk-ux-convergence/run-smoke.mjs                EDIT (Tier 1 markers)
+ *.test.ts / ProcedureRecordCorrection.test.tsx             NEW / EDIT
```

No path above is authorized for mutation by this definition document alone.

## 16. Acceptance criteria (Implementation Start GO bind targets)

- Correction screen exposes editable `result`, `performedAt`, and required `reason`.
- Save CTA calls `submitCorrection` through the staff-save wiring layer.
- Default port is in-memory fake append-only; `liveWriteAuthorized` remains false.
- Saved outcome is reachable in unit tests and synthetic demo.
- Original ProcedureRecord presentation remains immutable on success and all failures.
- 5-state save vocabulary matches existing shell semantics without extension.
- Duplicate UI clicks and domain idempotent replay do not double-append.
- `save_outcome_unknown` disables retry and does not fabricate success.
- C3 same-local-date policy enforced before submit.
- Cancellation / lifecycle / SharePoint paths untouched.
- Tier 1 + Tier 2 smoke checks pass without puppeteer-core.
- `cd spfx && npx heft test --clean` and root `npm test` pass.

## 17. Rollback boundary

Source-only rollback: revert UI wiring modules, bundle, tests, smoke markers,
and slice metadata. No persisted SharePoint data or schema exists for this slice.

## 18. CURRENT / GATE (Control consumption)

```text
CURRENT
main: 0cc1bd7b4c5b3198b53db6e3b942aee98059b133
#455: MERGED — presentation + disabled save
#461: MERGED — domain contract + fake append-only port
#448: OPEN / KEEP OPEN — body STALE (not mutated here)
Correction UI save wiring: NOT DELIVERED
Exact slice definition: THIS DOCUMENT

GATE
HumanAction: Exact-slice definition approval → Implementation Start GO
             (separate commits; neither implied by the other)

ALLOWED (now)
- read-only review of this definition
- Control selection of this slice as next candidate

FORBIDDEN (now)
- implementation / branch code for wiring
- #448 Issue mutation
- SharePoint / Deploy / LIVE WRITE
- Ready / Merge

NEXT
Human:
  Approve or revise FIELD-STAFF-CORRECTION-UI-SAVE-WIRING-SLICE-1 definition
  If approved, issue Implementation Start GO bound to:
    base SHA
    allowed paths (§15)
    acceptance checks (§16)

Agent:
  STOP after this definition unless explicit Implementation Start GO is received
```

## 19. Stop decision

```text
Exact slice definition: COMPLETE (read-only)
Implementation Start: HOLD / separate Human GO required
Issue mutation: NOT RUN
CURRENT ACTION: STOP
```
