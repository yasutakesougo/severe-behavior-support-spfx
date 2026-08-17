# KIOSK-SPFX-SCHEMA-COMPATIBILITY-DECISION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: KIOSK-SPFX-SCHEMA-COMPATIBILITY-DECISION-1
Kind: Decision analysis only (not Human Selection)
Date: 2026-08-17

Implementation Start: HOLD
Source / schema / DTO mutation: NONE
SharePoint mutation: NONE
Authenticated GET: NONE
LIVE WRITE: NONE
Cleanup: NONE
Git commit / push / PR: NONE
Deploy: NONE
Self-authorization of schema choice: FORBIDDEN
```

SSOT analysis recording. Human Selection is recorded in
[`kiosk-spfx-schema-compatibility-human-decision-1.md`](./kiosk-spfx-schema-compatibility-human-decision-1.md)
(CLOSED / ADOPTED, 2026-08-17). This analysis is not rewritten.

Authoritative main: `442e26112a51c055f13141c7db2ba038c51ec56c`
KGAP-025: FULLY CLOSED
ProcedureRecord persistence: CREATE path verified
Default runtime: CLOSED
Previous Human LIVE WRITE GO: CONSUMED / CLOSED / NOT REUSABLE

Legacy basis: RECONSTRUCTED LEGACY BASELINE
`audit-management-system-mvp` `1c8f4505ca27cb538aa722b1117c1eafcdf58880`

Principle: DO NOT COPY OLD CODE. REPRODUCE OLD UX.

---

## 0. Exact references (do not invent IDs)

### Daily slot

| Kind | ID / name | Source |
|---|---|---|
| Gap | **KGAP-006** Day procedure list (time-ordered day board + status) | `kiosk-spfx-gap-analysis-1.md` |
| Gap | **KGAP-028** Recorded slot re-browse | same |
| Schema register | **SCH-03** Day time/activity slot catalog | `kiosk-spfx-convergence-plan-1.md` §11 |
| Human decision (open) | Day-slot catalog source for live SLICE 2 | convergence §20 item 9 |
| Legacy route | `/kiosk/users/:userId/procedures/:slotKey` | AMS ADR-022 |

`slotKey` in the URL is **not** listed as a ProcedureRecord field. ADR-022 treats `:slotKey` as kiosk path control. Durable match uses `scheduleItemId` / `rowNo`, and explicitly warns not to persist route-index keys.

### Observation chips

| Kind | ID / name | Source |
|---|---|---|
| Gap | **KGAP-010** Observation chips 様子 / 対応 / 変化 | gap analysis |
| Gap | **KGAP-012** Memo persistence (serialized execution memo) | gap analysis |
| Schema register | **SCH-04** 様子 / 対応 / 変化 / メモ persist | convergence §11 |
| Acceptance | **KF-05** do not confuse chips with 3-value result | convergence §19 |
| Human decision (open) | Observation chip persistence for SLICE 4 | convergence §20 item 10 |

### D6

| Kind | ID / name | Source |
|---|---|---|
| **This unit's D6** | Decision-PROCEDURE-RECORD-PERSISTENCE-1 **D6 Mutation policy (CREATE-ONLY)** | `decision-procedure-record-persistence-1-selection.md` |
| Gap | **KGAP-014** Record cancel (記録を取り消す + delete) | gap analysis |
| Gap | **KGAP-015** Existing record update (overwrite restored chips) | gap analysis |
| Schema register | **SCH-02** ProcedureRecord update / delete / 取消 | convergence §11 |
| Conflict | D6 CREATE-ONLY vs 取消/上書き | convergence §12 / §20 item 8 |

**Not this unit's D6** (same token, different documents):

- Field-workflow packet candidate **D6** = RecordId / IdempotencyKey / PayloadFingerprint alignment (`decision-field-workflow-contract-b-domain-selection.md`)
- Assessment Snapshot **D6-1** = DEC-6 mapping relation on adapter boundary

Those are not ProcedureRecord mutation policy.

### D6 exact meaning (repository authority)

Source: Decision-PROCEDURE-RECORD-PERSISTENCE-1, section D6 (ACCEPTED / LOCKED):

```text
ProcedureRecord v1 = CREATE-ONLY
update: NOT ADOPTED
delete: NOT ADOPTED
correction / supersede contract: NOT INVENTED in v1
```

A fact record is not overwritten. Unknown-outcome reconciliation is GET, not UPDATE.
If correction is needed later, that is a separate Decision and a schema change.
Adapter v1 has no update method and no delete method.

This analysis does **not** reopen or weaken that LOCK. It only classifies what a later Human Decision would have to add.

---

## 1. Layers (kept separate)

| Topic | Legacy UX | Domain | Persistence | UI / read-model |
|---|---|---|---|---|
| Daily slot | time-ordered day board; tap a step; 記録済み re-browse | planned occurrence vs execution fact | Legacy ExecutionRecord keyed by date+user+scheduleItemId | URL `:slotKey` is 0-based list index |
| Chips | 様子 / 対応 / 変化 (+ メモ) on the record screen | observation dimensions ≠ ProcedureRecord.result | serialized into ExecutionRecord.memo | single-select chips; restore from memo |
| D6 | 保存 overwrites same slot; 取消 deletes with confirm | current LOCK = CREATE-ONLY; no supersede | no PATCH/DELETE on ProcedureRecord | familiar 訂正/取消 can be presentation |

Forbidden inferences:

- UI field ≠ ProcedureRecord column
- route `:slotKey` ≠ persisted slot identity
- 職員が訂正できる ≠ in-place UPDATE

---

## SC-1 — Daily procedure slot

### Legacy requirement

Staff see **今日この人の一日の流れ**: time-ordered steps (`step.time`, `step.activity`), per-slot 未実施/記録済み, tap into detail, re-browse recorded slots (KGAP-006 / KGAP-028).

Route identity:

```text
/kiosk/users/:userId/procedures/:slotKey
slotKey = array index (parseInt)
date = YYYY-MM-DD query
```

Durable identity (ADR-022 invariant 4):

```text
normalizeScheduleItemId(procedure.rowNo || procedure.id || slotKey)
  ===
normalizeScheduleItemId(record.scheduleItemId)
```

`rowNo` is preferred. Route index is fallback only and is **not** to be used as a persist key (detail screen comment: 0-based index can collide with rowNo).

Legacy ExecutionRecord.id = `${date}-${userId}-${scheduleItemId}`.
The **slot/schedule item exists without a record** (unrecorded steps still appear). That is an independent lifecycle from the execution fact.

### Current source of slot semantics

| Store | Slot / time / order |
|---|---|
| ProcedureRecord | none (precheck: daily slot not on type) |
| SupportPlan / SupportPlanVersion | no day catalog |
| SupportPlanVersionProcedureBinding (A2) | ProcedureId + version on a plan; **no** time, activity, rowNo, slotKey |
| CurrentProcedure UI | one Active fixture; `sceneLabel` only; no day board |
| DailyRecords | different UI (KGAP-023 / 024); not this catalog |

A2: procedure body stays outside the binding contract. Slot body must not be smuggled into ProcedureRecord (convergence §12).

### Deterministically derivable?

**NO** from currently locked ProcedureRecord + SupportPlan + A2 binding.

A time-ordered day board cannot be assembled without a catalog of scheduled occurrences (time / activity / order / stable occurrence id). That catalog is **not** on the locked CREATE schema.

ProcedureId + LocalDate is **not** proven equivalent to Legacy scheduleItemId:

- Legacy allows multiple rows (`rowNo`) in one day.
- A2 uniqueness is one ProcedureId per plan version, which is plan binding, not daily occurrence.
- URL index is unstable across catalog reorder.

Collision/ambiguity: **PRESENT** if route-index or ProcedureId+LocalDate is treated as slot identity.
Historical stability of `:slotKey`: **RISK**.

### Options

**OPTION A — DERIVE-ONLY**
Preferred only if derivation is deterministic. **Not available now**: no authoritative schedule/time catalog to derive from. Do not pretend CurrentProcedure's single `sceneLabel` is a day board.

**OPTION B — PERSIST SLOT IDENTITY ON ProcedureRecord**
Would add occurrence identity to the execution fact. Requires semantic definition first (what is a slot vs ProcedureId). Would affect uniqueness / likely fingerprint material. **Not justified by URL `:slotKey` alone.** Do not design columns in this unit.

**OPTION C — SEPARATE DAILY-SLOT ENTITY**
Matches Legacy: ScheduleItem / procedure step vs ExecutionRecord. Slot has lifecycle without a record (未実施 still listed). Catalog can feed read-model; ProcedureRecord CREATE schema can stay unchanged until a later link Decision.

### Schema change

**CONDITIONAL** — a catalog source is required for chronological UX. That is **not** automatically a ProcedureRecord column add. SCH-03 remains SCHEMA DECISION REQUIRED.

### Migration / backfill

**NONE** for existing CREATE residues if ProcedureRecord stays unchanged.
If a later Decision adds a required slot field onto ProcedureRecord, residues listItemId=1 and listItemId=2 cannot satisfy it without backfill (cleanup still NOT AUTHORIZED).

### Recommended option

**HUMAN DECISION**

Analyst recommendation (not authorized): **C** as the semantic fit for the day board; **do not choose B** from route `slotKey`; **A is not currently derivable**.

UX: staff cannot retain daily chronological procedures until a catalog source exists. Presentation can still use familiar time/activity labels **after** that source is decided. Muscle memory of「今日の手順一覧」is the requirement; storing array indexes is not.

---

## SC-2 — Legacy observation chips

### Legacy chip semantics (from frozen SHA, not invented)

Single-select per group (click toggles off). Optional as a group: save requires **at least one** of mood / action / result / memo (serialized non-empty). Execution `status` is written `'completed'` — **not** the chip vocabulary.

```text
本人の様子:
  落ち着いていた / 不安そう / 拒否あり / 興奮あり / 切り替え困難
  stored as memo part 【様子】

支援者の対応:
  見守り / 声かけ / 環境調整 / 活動変更 / 距離を取る / クールダウン
  stored as memo part 【対応】

変化:
  改善した / 変化なし / 悪化した / 途中で落ち着いた
  stored as memo part 【変化】

メモ:
  free text → 【メモ】
```

Restore-from-record: parse memo into chip state; save again overwrites memo (KGAP-015).

### Durably persisted in Legacy?

**YES** — `ExecutionRecord.memo` via `serializeKioskProcedureMemo`.

### Used in history?

**YES** — history panel aggregates `parseKioskProcedureMemo(r.memo).mood` as「様子の分布」(KGAP-019). List summary shows 様子 / 対応 text.

### Used by ABC?

Chip **values**: **NO** evidence that ABC stores 様子/対応/変化.
ABC context uses user/date/slot (`slotId` from time|activity on the list). That is slot context, not chip vocabulary (KGAP-017).

### Separate from result?

**CONFIRMED**

Legacy: chips in memo; status `completed`.
SPFx: `PERFORMED_AS_PLANNED | PERFORMED_WITH_ADAPTATION | NOT_PERFORMED` is LOCKED and was not a kiosk field (KGAP-011 additional dimension).
KF-05 / convergence §5 forbid merging chips into result.

### Current capability

ProcedureRecord has **no** chip/memo fields. Staff form「補足」is UI-only and is not persisted (KGAP-012 / precheck). Observation.content as a chip store is called **DOMAIN CONFLICT** if attempted (convergence §12).

### Persistence requirement

**YES** if in-shift history / 様子 distribution must be reproduced.
**NO** only if Human accepts ephemeral UI with no durable observation (OPTION A). Legacy evidence does **not** support “chips were merely transient.”

### Options

**OPTION A — UI-ONLY / EPHEMERAL**
Does not match Legacy durable memo + history. Only if Human explicitly drops history-of-chips.

**OPTION B — DEDICATED OBSERVATION DIMENSION**
Separate from `result`. Domain/storage Decision later. **No physical columns designed here.**

**OPTION C — SEPARATE OBSERVATION RECORD**
Chips share the execution's date/slot/save lifecycle; no separate timestamp per chip in Legacy. Embedding as a dimension of the execution fact matches Legacy memo parts better than a second aggregate — unless later evidence needs independent correction of chips vs result.

**OPTION D — OVERLOAD RESULT / NOTES**
**REJECT** (default). No authoritative equivalence. `PERFORMED_WITH_ADAPTATION` is not「興奮あり」or「クールダウン」.

### Schema change

**CONDITIONAL / YES** if OPTION B or C is selected. **NO** if OPTION A.
Not a ProcedureRecord.result change.

### Migration / backfill

Residues listItemId=1 / 2 have no chip payload. New required chip fields would need optional-or-separate storage; **do not backfill or cleanup residues**. Mixed-version records: possible if new dimension is optional.

### Recommended option

**HUMAN DECISION**

Analyst recommendation (not authorized): **B**. Reject D. Do not treat KGAP-012 UI note as the chip store.

UX: same placement / labels / single-select touch can be reproduced in UI without copying MUI. Persistence is required for history, not for drawing chips.

---

## SC-3 — D6 (overwrite / cancel / update / delete)

### Exact requirement

D6 = ProcedureRecord **v1 CREATE-ONLY**. Update, delete, and a correction/supersede contract are **not adopted / not invented**. This unit does not authorize UPDATE/DELETE.

KGAP-014 / KGAP-015 describe Legacy UX that **collides** with D6. That collision is already registered as DOMAIN CONFLICT. This packet does not resolve it by opening write APIs.

### Legacy behavior

Same composite key `date + userId + scheduleItemId`:

- `saveRecord('completed', memo)` → **upsert overwrite** (`memoMode: 'overwrite'`)
- `deleteRecord()` → **remove** that execution row after confirm「取り消す」

No append-only supersede pointer in that ExecutionRecord type.

### Current behavior

CREATE-ONLY. Dual lookup + GET-by-RecordId. `saved` locks the staff form. No update/delete methods.

RecordId / IdempotencyKey / PayloadFingerprint include result, performedAt, recordedAt, recordedBy (and plan/procedure ids). A later CREATE with different `recordedAt` is a **new** identity, not a REPLAY of the first. Two facts for the same person/procedure/day can coexist with **no** current field saying which supersedes which.

Therefore OPTION A (append-only correction) **cannot be expressed on the current schema**. That is exactly D6's "correction / supersede contract: NOT INVENTED."

### Need classification

| Need | Classification | Notes |
|---|---|---|
| Correction | **YES** (UX) | Legacy restore + save overwrite |
| Cancellation | **YES** (UX) | 記録を取り消す |
| Destructive in-place UPDATE | **NO** (not required) | UX can be append/supersede |
| Hard DELETE | **NO** (not required) | UX 取消 ≠ physical delete; D6 forbids delete |

Audit: fact records should remain reconstructable. In-place overwrite (Legacy) **loses** prior memo/chips. Append-only would preserve them **if** a supersede relation exists.

### Options

**OPTION A — APPEND-ONLY CORRECTION**
Policy-aligned with current CREATE-ONLY. Needs a later relation (which record is current). Without it, read-model is ambiguous. Fingerprint/RecordId stay per-payload; do not silently drop them from identity.

**OPTION B — EXPLICIT CANCEL / SUPERSEDE**
Original row remains; dedicated metadata/event marks cancelled/superseded. Schema/domain extension. Still no in-place rewrite of the original fact.

**OPTION C — IN-PLACE UPDATE**
Do not authorize. Audit loss; fights unique RecordId/IdempotencyKey/fingerprint; would reopen D6 LOCK.

**OPTION D — HARD DELETE**
Do not authorize. Assessed only because Legacy `deleteRecord` exists. Staff 取消 can be cancel/supersede UX.

### Schema change

**CONDITIONAL** — any real correction/cancel **policy** beyond "first CREATE only" needs a new Decision and almost certainly schema/domain addition. **Write API implication: NONE NOW / FUTURE DECISION.**

### Migration / backfill

**NONE** until a supersede/cancel model exists. Residues stay as CREATE facts. Do not DELETE them to emulate 取消.

### Identity / save-state impact

| Contract | This analysis |
|---|---|
| Result vocabulary | UNCHANGED |
| RecordId | UNCHANGED now; IMPACT IDENTIFIED if correction fields enter mint material or if two CREATEs are treated as one slot without a relation |
| IdempotencyKey | same |
| PayloadFingerprint | same; must not absorb chips by overloading result |
| save 5-state / save_outcome_unknown | UNCHANGED; unknown still no auto-retry CREATE |
| Dual lookup | UNCHANGED; do not treat a new correction payload as REPLAY of the original |

### Recommended policy

**HUMAN DECISION**

Analyst recommendation (not authorized): **A or B** (append-only fact + explicit current/cancel meaning). **Reject C and D.** Do not mint UPDATE/DELETE. Staff may still see familiar「訂正」「取消」later as presentation over A/B.

---

## Cross-cutting

Result vocabulary: **UNCHANGED**
Default runtime: **CLOSED**
Consumed LIVE WRITE GO: **not reusable**
listItemId=1 first-create residue: UNTOUCHED, cleanup NOT AUTHORIZED
listItemId=2 Kiosk verify residue: UNTOUCHED, cleanup NOT AUTHORIZED

Old records remain readable if new observation/slot/cancel data is optional or a separate entity. Required new ProcedureRecord columns would make mixed-version **fail-closed** unless a backfill Decision exists — that backfill is **not** authorized here.

---

## Recommended Human Schema Compatibility Decision Packet

Implementation authority for all three: **NOT GIVEN**

### D1 DAILY SLOT

```text
OPTION: HUMAN DECISION
Analyst lean: C (separate scheduled-occurrence / catalog)
Not: persist URL slotKey onto ProcedureRecord (B from route alone)
Not currently: A derive-only (no catalog on locked contracts)

semantic: day board is planned occurrences; ProcedureRecord is an execution fact
schema impact: CONDITIONAL (catalog source); ProcedureRecord CREATE schema need not change first
migration: NONE for residues if ProcedureRecord unchanged
audit: do not use unstable list indexes as identity
UX: chronological 今日の手順 cannot ship until catalog source exists
implementation authority: NOT GIVEN
```

### D2 OBSERVATION CHIPS

```text
OPTION: HUMAN DECISION
Analyst lean: B (dedicated observation dimension, separate from result)
Reject: D (overload result / notes)
Reject: treating chips as PERFORMED_WITH_ADAPTATION

semantic: 様子/対応/変化/メモ ≠ ProcedureRecord.result; Legacy persisted them in memo
schema impact: CONDITIONAL/YES if B or C; NO if A (ephemeral)
migration: NONE/optional; do not backfill residues
audit: history 様子分布 needs durable chips if that UX is kept
UX: same labels / single-select / placement can be UI; persist needed for history
implementation authority: NOT GIVEN
```

### D3 D6

```text
OPTION: HUMAN DECISION
Analyst lean: A or B (append-only and/or explicit cancel/supersede)
Reject: C in-place UPDATE
Reject: D hard DELETE
Current LOCK: CREATE-ONLY remains until Human selects otherwise

semantic: D6 = v1 CREATE-ONLY; correction contract not invented; Legacy UX collided
schema impact: CONDITIONAL for any correction/cancel model
write API: NONE NOW / FUTURE DECISION
migration: NONE now; do not delete residues
audit: do not destroy the original fact
UX: 訂正/取消 affordances ≠ PATCH/DELETE
implementation authority: NOT GIVEN
```

---

## Acceptance (this analysis)

| ID | Result |
|---|---|
| SC-01 Authoritative main exact | PASS (`442e261…`) |
| SC-02 KGAP/D6 references resolved | PASS |
| SC-03 Daily slot persistence not assumed | PASS |
| SC-04 Chips separate from result | PASS |
| SC-05 Result vocabulary unchanged | PASS |
| SC-06 D6 analysis does not open UPDATE/DELETE | PASS |
| SC-07 Independent schema classification | PASS |
| SC-08 Migration classified | PASS |
| SC-09 Audit/idempotency/fingerprint classified | PASS |
| SC-10 Legacy UX preservation assessed | PASS |
| SC-11 No code/schema/tenant mutation | PASS |
| SC-12 Human decision packet only | PASS |
