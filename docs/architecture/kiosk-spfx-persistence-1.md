# KIOSK-SPFX-PERSISTENCE-1

Status: **IMPLEMENTATION START RECORDED**  
Date: 2026-08-17  
Kind: Staff ProcedureRecord CREATE wiring (no live SharePoint write)

```text
Implementation Start: GO
LIVE WRITE: HOLD
SharePoint mutation: NOT AUTHORIZED
Schema change: NOT AUTHORIZED
Domain vocabulary change: NOT AUTHORIZED
Deploy: NOT AUTHORIZED
```

Basis: `643a0d9d8b5c2ddd971b62f1d6fde4aba46ae34c`  
Precheck: [`kiosk-spfx-persistence-precheck-1.md`](./kiosk-spfx-persistence-precheck-1.md)  
Decision reused: CREATE_READY_WITH_CODE_GAP

---

## Source-to-sink (static; no SharePoint API execution)

```text
CREATE-PATH-01 (after this unit)

Source:
ProcedureRecordForm.handleSave
spfx/src/shell/procedure/ProcedureRecordForm.tsx
requires FIELD_WORKFLOW_UI_SLICE.procedureRecordPersistAuthorized
in-flight guard + canRetryProcedureRecordSave

Construction:
buildStaffProcedureRecordCreateInput
→ assembleProcedureRecordForCreate
  asiaTokyoDateTimeLocalToIso
  mintProcedureRecordIdentity
  computeProcedureRecordPayloadFingerprint
  validateProcedureRecord

Domain persist:
persistStaffProcedureRecord
→ persistProcedureRecord
  dual lookup RecordId + IdempotencyKey
  GET-by-RecordId before saved

Repository:
injected ProcedureRecordPersistencePort
default: createLiveWriteHoldProcedureRecordPersistencePort
  lookups EMPTY
  create DEFINITE_FAILURE
  → save_failed
  no HTTP

SPFx isolated compile:
spfx/src/sbs-domain/staff-persist.bundle.js
  esbuild CJS of src/domain/procedure-record-staff-save.ts
  (SPFx rootDir cannot compile ../src/domain; es5 + TS6059)
  regenerate: see spfx/src/sbs-domain/README.md

Adapter / sink:
not invoked on the default HOLD port
existing SharePoint adapter remains GO-gated
consumed first-create LIVE WRITE packet is not used

Current state:
CONNECTED (code path)
LIVE WRITE HOLD (no tenant CREATE)
```

Removed from staff save:

```text
applySyntheticProcedureRecordSave
defaultSaveOutcome = "saved"
合成: 成功 / 保存失敗 / 結果不明 controls
記録を保存（合成）
```

---

## Acceptance (this unit)

| ID | Result |
|---|---|
| KP-01 synthetic success removed from staff save | PASS |
| KP-02 staff save → persistProcedureRecord | PASS |
| KP-03 existing schema only | PASS |
| KP-04 existing ProcedureRecord domain only | PASS |
| KP-05 saved only after persist success | PASS |
| KP-06 persist failure → save_failed | PASS |
| KP-07 result 3-value unchanged | PASS |
| KP-08 RecordId / IdempotencyKey / PayloadFingerprint helpers | PASS |
| KP-09 no live SharePoint write in this unit | PASS |
| KP-10 tests | see FINAL REPORT |

KGAP-025: **CODE PATH CLOSED / LIVE VERIFICATION OPEN**

Identity helpers (`mintProcedureRecordIdentity`, `computeProcedureRecordPayloadFingerprint`) reuse existing `sha256Hex` + unit-separator framing. ProcedureRecord result vocabulary is unchanged (`PERFORMED_AS_PLANNED` / `PERFORMED_WITH_ADAPTATION` / `NOT_PERFORMED`). No List columns, chips, daily slot, or D6 fields were added.

---

## HOLD

```text
Authenticated LIVE WRITE verification: NOT AUTHORIZED
Reuse of consumed first-create GO packet: FORBIDDEN
Facility / production List binding: NOT THIS UNIT
Kiosk UI / chips / slot / D6: OUT
```

Recommended next gate: `KIOSK-SPFX-PERSISTENCE-LIVE-VERIFY-1` (separate Human GO)

---

## Local verification (no live I/O)

```text
Node: 22.23.1
npm run typecheck: PASS
npm run lint: PASS
npm test: 649 pass / 0 fail
npm run format:check: PASS
npm run check:contracts-boundaries: PASS
cd spfx && npx heft test --clean: 164 pass / 0 fail
  (pre-existing lint warning: assessment-snapshot read-integration @rushstack/no-new-null)
SharePoint REST: not executed
```
