# CANCEL-SLICE-D — FIELD_STAFF cancellation CTA / presentation

```text
Unit: CANCEL-SLICE-D
BASE: main@4191e2968de0d8f4f0edb766654c47e6d87a5175
Authority: CANCEL-SLICE-D-EXACT-SCOPE-1
Independent Definition Re-Review: PASS
Definition-Gate Reconciliation: PASS
Implementation Start: AUTHORIZED (this slice only)
```

## Delivered

- Slice-D-owned metadata `FIELD_STAFF_CANCELLATION_UI_SLICE` (correction `cancellationAuthorized:false` untouched)
- Named synthetic `AuthorizationContext` fixture → `semanticsInput.authorization` → Slice A
- Cancel presentation / reason+confirm / Shell 5-state save wiring to Slice C in-memory fake
- Session-local CANCEL lifecycle append → `buildTodaySupportReadModel` rebuild → existing resolver → `取消済み`
- FORBIDDEN path guarded: `saveState === "saved"` alone does not set `取消済み`
- `結果を確認` = exact frozen `submitCancellation` resubmit (no new identity)

## OUT (unchanged)

- Slice E / SharePoint adapter / LIVE WRITE / Production Binding / Deploy
- Entra real auth expansion
- ProcedureRecord UPDATE/DELETE
- #443 / #444 mutation
- Issue mutation / Ready / Merge

## Evidence commands

```bash
npx esbuild src/domain/procedure-record-cancellation-staff-save.ts \
  --bundle --format=cjs --target=es2015 --platform=neutral \
  --outfile=spfx/src/sbs-domain/cancellation-persist.bundle.js

npm test -- tests/domain/procedure-record-cancellation-staff-save.test.ts
cd spfx && npx heft test --clean
```

## Rollback

Revert this PR / branch. A/B/C domain contracts remain intact.
