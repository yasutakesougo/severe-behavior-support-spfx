# sbs-domain SPFx bridge

Isolated SPFx `rootDir` cannot compile `src/domain` (es5 + TS6059).

`staff-persist.bundle.js` is an esbuild bundle of canonical:

`src/domain/procedure-record-staff-save.ts` → `persistStaffProcedureRecord` → `persistProcedureRecord`

Regenerate (no live I/O):

```bash
npx esbuild src/domain/procedure-record-staff-save.ts \
  --bundle --format=cjs --target=es2015 --platform=neutral \
  --outfile=spfx/src/sbs-domain/staff-persist.bundle.js
```

Do not edit the bundle by hand. Do not use it for LIVE WRITE.
