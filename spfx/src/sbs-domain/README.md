# sbs-domain SPFx bridge

Isolated SPFx `rootDir` cannot compile `src/domain` (es5 + TS6059).

These esbuild bundles exist so SPFx can import canonical domain code without
compiling `src/domain` as es5. Do not edit bundle logic by hand.
Keep canonical implementation in `src/domain`.

Do not use these bundles for LIVE WRITE / Production Binding / Deploy authorization.

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
