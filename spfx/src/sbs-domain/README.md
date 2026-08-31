# sbs-domain SPFx bridge

Isolated SPFx `rootDir` cannot compile `src/domain` (es5 + TS6059).

These esbuild bundles exist so SPFx can import canonical domain code without
compiling `src/domain` as es5. Do not edit bundle logic by hand.
Keep canonical implementation in `src/domain`.

Do not use these bundles for LIVE WRITE / Production Binding / Deploy authorization.

## REVIEW-OUTCOME-CAPTURE-SLICE-A — outcome capture narrow bridge

`monitoring-period-review-outcome.bundle.js` is the narrow synthetic-capture bridge for:

`src/domain/monitoring-period-review-outcome-spfx-entry.ts`

It exposes only the canonical `MonitoringPeriodReviewOutcome` decision contract,
validators, deterministic OutcomeId mint, schema constants, and
`MONITORING_PERIOD_REVIEW_OUTCOME_LIVE_WRITE_AUTHORIZED=false`.

It does **not** expose N+1 binding helpers, persistence ports, SharePoint adapters,
or AI helpers. It does not authorize authoritative business Outcome completion.

Regenerate (no live I/O):

```bash
npx esbuild src/domain/monitoring-period-review-outcome-spfx-entry.ts \
  --bundle \
  --format=cjs \
  --target=es2015 \
  --platform=neutral \
  --outfile=spfx/src/sbs-domain/monitoring-period-review-outcome.bundle.js
```

The checked-in `.d.ts` is the narrow allowlisted declaration surface.

## REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B — outcome note narrow bridge

`monitoring-period-review-outcome-note.bundle.js` is the narrow synthetic note bridge for:

`src/domain/monitoring-period-review-outcome-note-spfx-entry.ts`

It exposes only the optional `MonitoringPeriodReviewOutcomeNote` contract,
raw 255 UTF-16-code-unit validation/normalization helpers, DTO validators,
schema constants, and `MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_LIVE_WRITE_AUTHORIZED=false`.

The note is anchored to an existing `OutcomeId`. It has no `NoteId`, does not
change `MonitoringPeriodReviewOutcome` v1.0.0, and note text is never OutcomeId
mint material.

Regenerate (no live I/O):

```bash
npx esbuild src/domain/monitoring-period-review-outcome-note-spfx-entry.ts \
  --bundle \
  --format=cjs \
  --target=es2015 \
  --platform=neutral \
  --outfile=spfx/src/sbs-domain/monitoring-period-review-outcome-note.bundle.js
```

The checked-in `.d.ts` is the narrow allowlisted declaration surface. This bridge
does not authorize SharePoint persistence, Deploy, Production Binding, or LIVE WRITE.

## lifecycle-cancellation-storage.bundle — Slice E narrow SPFx bridge (B2)

Named canonical entrypoint:

`src/adapters/sharepoint/procedure-record-lifecycle-event/spfx-test-harness-entry.ts`

Generated outputs:

- `spfx/src/sbs-domain/lifecycle-cancellation-storage.bundle.js`
- `spfx/src/sbs-domain/lifecycle-cancellation-storage.bundle.d.ts`

Exports only: `bindProcedureRecordLifecycleEventList`,
`createProcedureRecordCancellationSharePointStoragePort`, and minimum required types.
Does not copy Slice E logic. Does not authorize LIVE WRITE by itself.

### JS generation command (locked)

```bash
npx esbuild \
  src/adapters/sharepoint/procedure-record-lifecycle-event/spfx-test-harness-entry.ts \
  --bundle --format=cjs --target=es2015 --platform=neutral \
  --outfile=spfx/src/sbs-domain/lifecycle-cancellation-storage.bundle.js
```

### Declaration production / check command (repository-supported)

`.d.ts` is the checked-in allowlisted declaration surface for the generated `.js`.
Hand-edit of generated outputs is forbidden.

```bash
node scripts/ci/check-lifecycle-cancellation-storage-bridge.mjs
```

Acceptance: generation/check commands → committed `.js` bytes match regeneration;
`.d.ts` export surface equals allowed exports only.

## B2 receipt correction

`SignedReceiptArtifact` is verified with the pinned P-256 SPKI key before payload
and runtime-host validation. The localStorage store is consume-only: it stores
only the receipt handle, `consumed`, and `consumedAtIso`. The handle is burned
before Slice C composition, so a timeout or reconciliation result cannot cause
a second CREATE attempt. No issuer or private signing key is shipped in SPFx.

The runner's code-basis value is generated into the ignored, build-only
`b2-build-basis.generated.ts` by `npm run prepare:b2-build-basis`. CI supplies
`B2_HARNESS_BUILD_BASIS_SHA=${GITHUB_SHA}`; a local reproducible build defaults
to `git rev-parse HEAD`. An absent or malformed value fails closed. It must be
the exact source/artifact basis used for the production package, not the
definition document's historical base SHA.

## cancellation-persist.bundle — cancellation persistence bridge

`cancellation-persist.bundle.js` is an esbuild bundle of canonical:

`src/domain/procedure-record-cancellation-staff-save.ts` → `persistStaffProcedureRecordCancellation` → `submitCancellation`

This is the CANCEL-SLICE-D / Slice C append-only bridge. LIVE WRITE remains HOLD.
B2 also re-exports `createProcedureRecordCancellationPersistencePort` for harness composition.

Regenerate (no live I/O):

```bash
npx esbuild src/domain/procedure-record-cancellation-staff-save.ts \
  --bundle --format=cjs --target=es2015 --platform=neutral \
  --outfile=spfx/src/sbs-domain/cancellation-persist.bundle.js
```

## correction-persist.bundle — correction persistence bridge

`correction-persist.bundle.js` is an esbuild bundle of canonical:

`src/domain/procedure-record-correction-staff-save.ts` → `persistStaffProcedureRecordCorrection` → `submitCorrection`

This is the correction append-only / write-authority bridge. LIVE WRITE remains HOLD.

Regenerate (no live I/O):

```bash
npx esbuild src/domain/procedure-record-correction-staff-save.ts \
  --bundle --format=cjs --target=es2015 --platform=neutral \
  --outfile=spfx/src/sbs-domain/correction-persist.bundle.js
```

## staff-persist.bundle — persistence bridge

`staff-persist.bundle.js` is an esbuild bundle of canonical:

`src/domain/procedure-record-staff-save.ts` → `persistStaffProcedureRecord` → `persistProcedureRecord`

This is the persistence / write-authority bridge. LIVE WRITE remains HOLD.

Regenerate (no live I/O):

```bash
npx esbuild src/domain/procedure-record-staff-save.ts \
  --bundle --format=cjs --target=es2015 --platform=neutral \
  --outfile=spfx/src/sbs-domain/staff-persist.bundle.js
```

## kiosk-read-model.bundle — READ-ONLY projection/read-model bridge

`kiosk-read-model.bundle.js` is an esbuild bundle of the narrow entry:

`src/domain/kiosk-today-support-spfx-entry.ts`

That entry re-exports only the Today Support projection/read-model surface
needed by `TodaySupportDayBoard`, `OverviewDashboard`, `CurrentProcedure`,
and the synthetic SPFx fixture.

Canonical implementation remains:

- `src/domain/kiosk-today-support-read-model.ts`
- `src/domain/kiosk-contract.ts`

**Kiosk read-model bundle has no write authority.**

It must not expose or import persistence / mutation surfaces such as:

- `persistProcedureRecord`
- `persistStaffProcedureRecord`
- `createLiveWriteHoldProcedureRecordPersistencePort`
- audit-event persistence
- handoff mutation

Do not use the root domain barrel (`src/domain/index.ts`) as this bundle's
entrypoint.

Regenerate (no live I/O):

```bash
npx esbuild src/domain/kiosk-today-support-spfx-entry.ts \
  --bundle \
  --format=cjs \
  --target=es2015 \
  --platform=neutral \
  --outfile=spfx/src/sbs-domain/kiosk-read-model.bundle.js
```

## monitoring-read-model.bundle — READ-ONLY monitoring projection bridge

`monitoring-read-model.bundle.js` is an esbuild bundle of the narrow entry:

`src/domain/monitoring-read-model-spfx-entry.ts`

That entry re-exports only the monitoring projection/read-model surface
needed by `MonitoringView`, `SupportPlan`, and the synthetic SPFx fixture.

Canonical implementation remains:

- `src/domain/monitoring-read-model.ts`

**Monitoring read-model bundle has no write authority.**

It must not expose or import persistence / mutation surfaces such as:

- `persistProcedureRecord`
- `persistStaffProcedureRecord`
- review decision / plan mutation
- SharePoint write / live tenant I/O

Do not use the root domain barrel (`src/domain/index.ts`) as this bundle's
entrypoint.

Regenerate (no live I/O):

```bash
npx esbuild src/domain/monitoring-read-model-spfx-entry.ts \
  --bundle \
  --format=cjs \
  --target=es2015 \
  --platform=neutral \
  --outfile=spfx/src/sbs-domain/monitoring-read-model.bundle.js
```
