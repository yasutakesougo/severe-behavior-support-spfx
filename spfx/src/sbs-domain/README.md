# sbs-domain SPFx bridge

Isolated SPFx `rootDir` cannot compile `src/domain` (es5 + TS6059).

These esbuild bundles exist so SPFx can import canonical domain code without
compiling `src/domain` as es5. Do not edit bundle logic by hand.
Keep canonical implementation in `src/domain`.

Do not use either bundle for LIVE WRITE.

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
