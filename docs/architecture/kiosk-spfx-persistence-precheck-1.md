# KIOSK-SPFX-PERSISTENCE-PRECHECK-1

Status: **READ-ONLY PRECHECK**
Date: 2026-08-17
Kind: ProcedureRecord CREATE sufficiency against existing domain + existing schema
Mutation: **NONE**
Implementation: **NONE**
Live write this unit: **NONE**

```text
NO implementation
NO source / test / schema modification
NO live write
NO commit / push / PR / deploy
NO SharePoint / M365 / Entra mutation
```

Upstream plan: [`kiosk-spfx-convergence-plan-1.md`](./kiosk-spfx-convergence-plan-1.md)
P0 in scope: KGAP-025 (kiosk replacement blocker — staff save synthetic)

OUT of this precheck: daily slot schema, Legacy chips, D6 cancel/update/delete, ABC, kiosk UI, navigation, history, auto-refresh.

---

## 0. Authority / revisions

```text
SPFx repository:
/Users/yasutakesougo/severe-behavior-support-spfx

Planning basis SHA:
643a0d9d8b5c2ddd971b62f1d6fde4aba46ae34c

Planning artifact:
docs/architecture/kiosk-spfx-convergence-plan-1.md

Legacy reference SHA:
1c8f4505ca27cb538aa722b1117c1eafcdf58880

Current origin/main (this precheck start):
643a0d9d8b5c2ddd971b62f1d6fde4aba46ae34c

origin/main == planning basis:
YES (0 commits either side)

Local HEAD:
5508dcd008010ea7539113a6f5721c5158d9f7d2
(1 merge-commit behind origin/main; tracked tree equivalent)

Investigation basis:
current origin/main = planning basis
no later CREATE-path delta to prefer
```

Fixed domain (unchanged):

```text
PERFORMED_AS_PLANNED
PERFORMED_WITH_ADAPTATION
NOT_PERFORMED
```

Legacy chips (様子 / 対応 / 変化 / メモ) are independent dimensions and **not** in this CREATE precheck.

---

## 1. Current CREATE path

Two paths exist. They are **not** connected.

### CREATE-PATH-01 — Staff UI (current kiosk-adjacent form)

```text
Source:
ProcedureRecordForm.handleSave
spfx/src/shell/procedure/ProcedureRecordForm.tsx 98–113
requires FIELD_WORKFLOW_UI_SLICE.syntheticProcedureRecordSaveAuthorized
draft: result + performedAtLocal + note
never constructs domain ProcedureRecord
never calls persistProcedureRecord

Domain:
not reached

Repository:
not reached

Adapter:
not reached

Sink:
none (in-memory saveState only)

Current state:
SYNTHETIC

Evidence:
ProcedureRecordForm.tsx 98–113
procedure-record-draft.ts applySyntheticProcedureRecordSave 65–84
procedure-fixture.ts FIELD_WORKFLOW_UI_SLICE.recordMutationAuthorized = false
spfx/src/webparts: no ProcedureRecord adapter import
AppShellChrome.tsx wires ProcedureRecordForm only
```

Synthetic success display: `defaultSaveOutcome = "saved"` and on-screen「合成: 成功」can set chrome to **保存済み** with no SharePoint POST. This is a **P0 staff-path blocker** if that UI is treated as live save (see §5).

### CREATE-PATH-02 — Domain persist + GO-gated adapter (not staff-wired)

```text
Source:
No staff UI. Callers today: tests + consumed LIVE WRITE execution runner.

Domain:
validateProcedureRecord (src/domain/procedure-record.ts 126–165)
persistProcedureRecord (src/domain/procedure-record-persistence.ts 236–269)
outcomes: saved | save_failed | save_outcome_unknown
CREATE-ONLY; GET-by-RecordId required before saved
unknown never auto-retries create

Repository:
ProcedureRecordPersistencePort
  findByRecordId / findByIdempotencyKey / create
createProcedureRecordRepository (default):
  createProcedureRecordLiveWriteAuthorization() → always null
  create() → refuseUnauthorizedLiveCreate() = DEFINITE_FAILURE
createProcedureRecordLiveWriteExecutionRepository:
  mints run-scoped auth from Human GO packet only

Adapter:
encodePhysicalRow + buildCreateItemFields
SPFx createProcedureRecordSpHttpClientTransportFromHost:
  no write flags / no GO packet → createItem FORBIDDEN
createProcedureRecordLiveWriteSpHttpClientTransport:
  POST lists(guid'...')/items only with runtime-valid authorization

Sink:
List display name 支援手順実施記録
List GUID (test-only proven): b971ff03-799e-41ac-b037-8becb9f4ff4b
Internal names prRecordId … prRecordedBy + prResult
TITLE-NONE (Title omitted on write)

Current state:
PARTIAL
  REAL: mapping + persist orchestration + GO-gated POST (one CREATE CONSUMED)
  CLOSED: default runtime / FromHost / staff form

Evidence:
procedure-record-persistence.ts 236–269
read-only-repository.ts 174–214, 237–249
live-write-gate.ts 45–54, 145–149, 95–97 (itemCount === 0)
rest-body.ts 23–50
sphttpclient-list-transport.ts 135–168, 273–290, 337–341
sphttpclient-list-transport.factory.ts 23–34
procedure-record-first-live-write-closeout.md
procedure-record-first-live-write-execution-evidence.md
tests/domain/procedure-record-persistence.test.ts
tests/adapters/sharepoint/procedure-record/read-only-repository.test.ts
```

```text
KGAP-025 update:
NOT obsolete.
Staff form remains SYNTHETIC.
A real CREATE path exists below the UI and is GO-gated / consumed / not host-wired.
```

---

## 2. Existing schema sufficiency

Required CREATE fields = `ProcedureRecord` (no slot, no chips). All map to existing physical columns except derived `TimeZone` / schema envelope (forbidden as List columns; reconstituted on decode).

| Domain field | SP internal name | Required? | Mapping | Existing? | Write-supported? | Evidence |
|---|---|---|---|---|---|---|
| OrganizationId | prOrganizationId | yes | text | yes | yes | physical-columns.ts; rest-body.ts 33 |
| SiteId | prSiteId | yes | text | yes | yes | rest-body.ts 34 |
| UserId | prUserId | yes | text | yes | yes | rest-body.ts 35 |
| TimeZone | (none; Asia/Tokyo derived) | yes in domain | DERIVED; column forbidden | N/A | must not write | derived-envelope; physical-schema FORBIDDEN names |
| RecordId | prRecordId | yes | unique text | yes | yes | UNIQUE_TEXT; rest-body.ts 30 |
| IdempotencyKey | prIdempotencyKey | yes | unique text | yes | yes | UNIQUE_TEXT; rest-body.ts 31 |
| PayloadFingerprint | prPayloadFingerprint | yes | text | yes | yes | rest-body.ts 32 |
| Procedure.ProcedureId | prProcedureId | yes | text | yes | yes | rest-body.ts 36 |
| Procedure.ProcedureVersion | prProcedureVersion | yes | text | yes | yes | rest-body.ts 37 |
| Procedure.ApprovalState | prApprovalState | yes (= APPROVED) | text | yes | yes | encodeApprovalState |
| LocalDate | prLocalDate | yes YYYY-MM-DD | text | yes | yes | encodeLocalDate; must equal Tokyo day of performedAt |
| planId | prPlanId | yes | text | yes | yes | rest-body.ts 40 |
| planVersion | prPlanVersion | yes integer ≥1 | text of integer | yes | yes | encodePlanVersion |
| result | prResult | yes 3-value | Choice, FillIn=false | yes | yes | physical-schema.ts 158–185 |
| performedAt | prPerformedAt | yes ISO datetime | text (D4=A) | yes | yes | conversion.ts 54–58 |
| recordedAt | prRecordedAt | yes ISO; ≥ performedAt | text (D4=A) | yes | yes | conversion.ts |
| recordedBy | prRecordedBy | yes | text | yes | yes | rest-body.ts 45 |
| daily slot | — | **no** | not on type | N/A | N/A | procedure-record.ts 37–53; grep slot = none |
| 様子/対応/変化/メモ | — | **no** | not on type | N/A | UI `note` is not persisted | ProcedureRecordForm note; no prMemo |

Proven live round-trip (consumed GO, synthetic item): POST 201 + GET-by-RecordId MATCH on RecordId, IdempotencyKey, PayloadFingerprint, OrganizationId, SiteId.

```text
EXISTING_SCHEMA_SUFFICIENT
SCHEMA BLOCKED: NO
```

No new columns designed.

Caveat (not schema insufficiency): the **proven** CREATE targeted the **test-only** List GUID, not a production facility List. Physical contract is the same. Facility binding remains a later Human GO.

---

## 3. Record identity

CREATE identity required by `validateProcedureRecord`:

```text
user identity:     UserId
site identity:     SiteId (+ OrganizationId; repository also requires record.SiteId === binding.siteId)
procedure identity: Procedure.{ProcedureId, ProcedureVersion, ApprovalState=APPROVED}
                    + planId + planVersion
date / timestamp:  LocalDate + performedAt + recordedAt
result:            ProcedureRecordResult
recordedBy:        recordedBy
created/recorded:  recordedAt (no separate created field)
also required:     RecordId, IdempotencyKey, PayloadFingerprint, TimeZone=Asia/Tokyo
```

Daily slot on the type / validator / physical row: **absent**.

```text
DAILY SLOT:
NOT REQUIRED FOR CREATE
CREATE BLOCKED BY SLOT SCHEMA: NO
```

Staff form draft currently has `result`, `performedAtLocal`, `note` plus binding context (`userId`, `planId`, `planVersion`, `procedureId`, `procedureVersion`). It does **not** mint RecordId / IdempotencyKey / PayloadFingerprint / ISO clocks / recordedBy. That is a **code mapping gap**, not a schema gap.

---

## 4. Save 5-state

Shell (`save-state.ts`; meaning not changed here):

```text
unsaved              idle / dirty
saving               in-flight
saved                confirmed persist
save_failed          definite failure
save_outcome_unknown indeterminate; never collapse to saved/failed
```

Domain persist outcomes: `saved | save_failed | save_outcome_unknown` (same tokens as three of five).

Connectability (not a semantics change):

| Moment | Intended transition | Current staff UI | Persist path |
|---|---|---|---|
| Request start | → saving | sets saving then immediately synthetic outcome | would stay saving until persist returns |
| Success | saving → saved only after GET-by-RecordId match | synthetic can jump to saved | persistProcedureRecord → saved |
| Failure | saving → save_failed | synthetic outcome control | DEFINITE_FAILURE / invalid / CONFLICT → save_failed |
| Indeterminate | saving → save_outcome_unknown; no auto-retry | synthetic outcome control | INDETERMINATE / LOOKUP_UNAVAILABLE |
| Retry | only from unsaved / save_failed (`canRetryProcedureRecordSave`) | same guard | persist never auto-retries unknown |

```text
Save-state compatibility:
PASS
(states align; staff UI not yet bound to persist)
```

---

## 5. Fail-closed

| Condition | Persist / adapter | Staff UI today |
|---|---|---|
| Site unselected | form not shown (`AppShellChrome` site stop); repository create DEFINITE_FAILURE if SiteId ≠ binding | never reaches form |
| User unknown | empty UserId → validateProcedureRecord false → save_failed | fixture personLabel only; no live user lookup |
| Procedure unknown | missing/non-APPROVED Procedure → save_failed | fixture procedureId; no live procedure fetch |
| Invalid result | encodeResult / validator fail → save_failed | radios only 3 values; save disabled if result undefined |
| Adapter unavailable | LOOKUP_UNAVAILABLE → save_outcome_unknown; create INDETERMINATE → reconcile, not saved | N/A |
| SharePoint error | TRANSPORT_ERROR → INDETERMINATE → unknown or failed after GET; not saved | N/A |
| Permission denied | HTTP 401/403 → FORBIDDEN → DEFINITE_FAILURE → save_failed | N/A |
| Unauthorized live create | refuseUnauthorizedLiveCreate DEFINITE_FAILURE → save_failed | N/A |

Persist path does **not** map those failures to `saved`.

**P0 staff-UI blocker (synthetic success):**

```text
ProcedureRecordForm can display 保存済み via applySyntheticProcedureRecordSave
with outcome "saved" and no adapter call.
FIELD-WORKFLOW defaultSaveOutcome = "saved".
```

If that screen is used as the kiosk save CTA without removing the synthetic path, fail-closed is **violated**.

```text
Fail-closed:
PASS  — domain persist + adapter CREATE mapping
BLOCKED — staff synthetic success display (CODE GAP to remove when wiring live CREATE)
```

Overall for this CREATE precheck (can existing persist be fail-closed): **PASS**.
KGAP-025 remains because the staff path is the synthetic one.

---

## 6. Duplicate CREATE

Update/cancel out of scope.

| Layer | Behavior | Class |
|---|---|---|
| Staff UI | `canRetry` false while saving/saved/unknown; button disabled; region inert while saving | UI-GUARDED |
| Persist | dual lookup RecordId + IdempotencyKey; same payload REPLAY (GET, no second create); mismatch CONFLICT → save_failed; unknown no auto-retry | SERVER-GUARDED (orchestration) |
| SharePoint | prRecordId and prIdempotencyKey EnforceUniqueValues=true Indexed=true | SERVER-GUARDED |
| Default FromHost | createItem FORBIDDEN (no POST) | N/A until GO |

```text
Duplicate-create protection:
BOTH  (on persist + unique columns, once wired)
Staff UI today: UI-GUARDED only (never hits server)
```

No unique-column add in this precheck.

---

## 7. Existing live-write work

| Asset | Class | Notes |
|---|---|---|
| `persistProcedureRecord` + tests | REUSABLE | D5/D8/D9 orchestration |
| Physical mapping / rest-body / schema verify | REUSABLE | PR-MAP-NAMES-1 |
| SPHttpClient transport POST helper | REUSABLE | module-private; GO-gated |
| FromHost factory | REUSABLE for read; write flags forbidden (correct default) | must not pass GO into host factory without new Decision |
| `createProcedureRecordRepository` | REUSABLE closed default | create() DEFINITE_FAILURE |
| LIVE WRITE GO packet `procedure-record-first-create` itemCount=0 | SUPERSEDED for a second CREATE | CONSUMED; list residue ItemCount≥1; packet validator requires itemCount===0 |
| First live write closeout / evidence | REUSABLE as proof schema CREATE worked once | does not authorize second CREATE |
| Staff ProcedureRecordForm synthetic save | UNRELATED to live persist | must not be reused as “saved” |
| AssessmentSnapshot live transport | UNRELATED | different contract |

```text
Existing live-write assets:
PARTIAL

KGAP-025:
still current for staff UX.
Not updated to REAL.
```

A later staff CREATE gate needs a **new** Human LIVE WRITE GO (new purpose/packet). Reuse of consumed first-create packet is FORBIDDEN. `itemCount: 0` cannot apply to the list that already holds residue.

---

## 8. Testability (plan only; no tests run or changed)

| Layer | Existing | Later gate |
|---|---|---|
| Contract | `tests/contracts/procedure-record-contract.test.ts` | keep |
| Unit persist | `tests/domain/procedure-record-persistence.test.ts` | keep; add staff-mapping unit when wiring |
| Adapter | `read-only-repository.test.ts`, `sphttpclient-list-transport.test.ts` | keep FORBIDDEN default |
| Synthetic integration | `synthetic-repository.test.ts` | keep |
| Authenticated live CREATE | one-shot CONSUMED | **separate Human LIVE WRITE GO**; not this precheck |
| Post-write GET | required by persist before `saved` | same rule as closeout |

Privacy: automated tests stay synthetic. Live evidence must not copy personal data to GitHub.

```text
Live test requires a separate Human GO.
This precheck executed no tests and changed none.
```

---

## 9. Privacy

- This unit used CODE and existing synthetic/closeout docs only.
- No tenant I/O.
- Future live verification: synthetic identifiers only in GitHub; no 個人情報.

---

## 10. Decision

```text
EXISTING_SCHEMA_SUFFICIENT
DAILY SLOT NOT REQUIRED FOR CREATE
Legacy chips NOT REQUIRED FOR CREATE
D6 update/delete NOT REQUIRED FOR CREATE
Domain ProcedureRecord UNCHANGED / no collision for CREATE
Staff UI not wired; synthetic saved display remains
Default runtime CREATE closed
Adapter CREATE exists but GO-gated; first-create packet CONSUMED
```

**Decision: CREATE_READY_WITH_CODE_GAP**

Not A (`EXISTING_SCHEMA_CREATE_READY`) because staff CREATE is not startable by flipping a flag: form mapping, persist wiring, synthetic-success removal, and a **new** LIVE WRITE GO (not `itemCount=0` first-create) are still missing.

Not C: no missing List column for ProcedureRecord CREATE.

Not D: CREATE does not require changing result 3-value or adding slot/chips to the domain record.

Not E: mapping, persist, transport, and one consumed live CREATE are evidenced.

Code gaps (not authorized here):

1. Draft → `ProcedureRecord` mint (RecordId, IdempotencyKey, PayloadFingerprint, ISO clocks, recordedBy)
2. `handleSave` → `persistProcedureRecord` (remove synthetic outcome as live success)
3. Host/runtime still closed until a **new** Human LIVE WRITE GO
4. Facility List binding vs test-only GUID (GO/config, not new columns)

---

## 11. Human decisions (explicitly not taken)

Not decided in this packet:

- KGAP-001 / 003 / 008 / 013 / 022 / 023 / 024 Option C
- Slot schema
- Chip schema
- D6 cancel / update schema
- New LIVE WRITE GO for staff CREATE
- Production vs test-only List binding

Those remain later Decisions. CREATE P0 (schema/domain sufficiency) is answered without them.

---

## 12. Evidence index

| Ref | Path |
|---|---|
| E-MAIN | origin/main `643a0d9d8b5c2ddd971b62f1d6fde4aba46ae34c` |
| E-DOM | `src/domain/procedure-record.ts` |
| E-PERS | `src/domain/procedure-record-persistence.ts` |
| E-COLS | `src/adapters/sharepoint/procedure-record/physical-columns.ts` |
| E-MAP | `conversion.ts` / `rest-body.ts` / `physical-schema.ts` |
| E-REPO | `read-only-repository.ts` |
| E-GATE | `live-write-gate.ts` |
| E-XPORT | `spfx/src/adapters/procedure-record/sphttpclient-list-transport.ts` |
| E-HOST | `sphttpclient-list-transport.factory.ts` |
| E-UI | `spfx/src/shell/procedure/ProcedureRecordForm.tsx` |
| E-SYN | `procedure-record-draft.ts` |
| E-SAVE5 | `spfx/src/shell/ux/save-state.ts` |
| E-CLOSE | `docs/architecture/procedure-record-first-live-write-closeout.md` |
| E-EVID | `docs/architecture/procedure-record-first-live-write-execution-evidence.md` |

```text
CODE = this precheck
RUNTIME this unit = NO
Live write this unit = NONE
```

---

## STOP

```text
KIOSK-SPFX-PERSISTENCE-PRECHECK-1: RECORDED

Implementation: NONE
Live write: NONE
Mutation: NONE

Recommended next gate:
KIOSK-SPFX-PERSISTENCE-1 Implementation Start
(separate Human GO; new LIVE WRITE packet; do not reuse consumed first-create GO)

Do not start:
UI coding, schema columns, domain vocabulary, D6 update/delete, chips, slots, deploy
```
