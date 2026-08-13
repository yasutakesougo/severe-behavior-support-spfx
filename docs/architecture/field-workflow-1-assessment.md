# FIELD-WORKFLOW-1 — Assessment (read-only)

Status: **HOLD — CONTRACT GAP**

Assessment date: 2026-08-13

Baseline (VISUAL-ACCEPTANCE-1 ACCEPT/COMPLETE): `709804548a42fc7bf3e3e6da3f24cfd57d4677f0`

Observed live `origin/main`: `709804548a42fc7bf3e3e6da3f24cfd57d4677f0`

Reconciliation: **match** — no rewind; assessment against current main = supplied SHA.

Scope: 強度行動障害の支援計画シート → 支援手順 → 支援手順記録 → Review 材料。

Out of scope: 生活介護個別支援計画、出欠、稼働率、請求、服薬、一般ケース記録、事故/ヒヤリハット、加算、計画相談、サービス等利用計画。

Implementation in this slice: **STOP** (Human GO required for contract/domain).

No Deploy / SharePoint / App Catalog / live schema / production write.

---

## 1. Observed main

| Item | Value |
|---|---|
| Local HEAD at start | `709804548a42fc7bf3e3e6da3f24cfd57d4677f0` |
| `git fetch origin main` → `origin/main` | `709804548a42fc7bf3e3e6da3f24cfd57d4677f0` |
| Tip subject | Merge PR #344 (DADS verify final consistency) |
| Ahead of supplied SHA | **0 commits** |

---

## 2. Assessment result (FW-01 … FW-09)

| ID | Intent | Classification | Evidence (abbrev.) |
|---|---|---|---|
| **FW-01** | 現場用に現在の支援手順を即時確認 | **PRESENTATION GAP** (+ soft **CONTRACT GAP**) | User Detail `現在の支援` is category/body (`環境調整` / `コミュニケーション` / `行動発生時`), not 場面→実施→避ける→補足. Support Plan `actionItems` is free prose. No `支援手順` surface. Domain plan body uses `supportMethods: string[]`, not procedure entities. |
| **FW-02** | 「この手順を記録」導線 + preselect | **FLOW GAP** | No CTA. Records is primary-nav sibling; leaving `users` clears detail/plan. Person seed from incomplete list only (`DEMO-UX-9`). Mutations disabled. |
| **FW-03** | 記録を作文にしない（結果選択中心） | **PRESENTATION GAP** (+ **CONTRACT GAP** for result enum) | DailyRecords centered on free-text textarea. No 手順どおり / 一部変更 / 実施できなかった UI. `ExecutionRecord` has fingerprint only — no result vocabulary. |
| **FW-04** | Plan → Procedure → Record binding | **CONTRACT GAP** | See §3. No unified ProcedureRecord binding both plan version and procedure version. |
| **FW-05** | 過去記録を新計画へ付け替えない | **CONTRACT GAP** / **DOMAIN DECISION REQUIRED** for shell wiring | `SupportPlanVersion` + `SupportRecordTraceRef.{planId,planVersion}` can preserve plan binding **if used**. Shell fixtures are label-only; `ExecutionRecord` has no plan fields; `AbcRecord.planId` optional without `planVersion`. No invariant test that old records stay on old version after v3 activation. |
| **FW-06** | performedAt ≠ recordedAt | **CONTRACT GAP** | `SupportRecordTraceRef.recordedAt` exists. `performedAt` absent. Nearby: `AbcRecord.occurredAt`, `Observation.observedAt`, `ExecutionRecord.LocalDate` (calendar day). Dual clock not defined as a pair. |
| **FW-07** | Review = 見直し材料入口 | **FLOW GAP** | Review shows attention counts + static cards. No drill-down to source record or support plan. No result breakdown (手順どおり/一部変更/実施できず). Correctly does **not** auto-judge「変更すべき」. |
| **FW-08** | ~390px field flow | **PRESENTATION GAP** | Shell has 768px (+ overview 480px). VA1 tablet/200% PASS is prior. No dedicated ~390 field-flow smoke for Users→手順→記録→保存. |
| **FW-09** | 保存失敗で入力保持 | **FLOW GAP** (vocab **PASS**) | Shell 5-state exists (`unsaved`/`saving`/`saved`/`save_failed`/`save_outcome_unknown`). Records: save disabled; `draftPersistenceAuthorized: false`; leave discards draft. No fail-retain path on procedure record form. |

### Summary buckets

**PASS**

- DADS-converged App Shell IA (`概要` / `利用者` / `記録`)
- Status vocabulary surfaces (要確認 / 未記録 / 期限接近) as presentation labels
- Save **vocabulary** 5-state + fail-closed chrome patterns (not wired to field record save)
- Synthetic fixture safety flags (`presentationOnly`, mutation unauthorized)
- SupportPlan / SupportPlanVersion domain with status machine + `effectiveFrom`/`effectiveTo`
- `ApprovedProcedureReference` + `ExecutionRecord` idempotency / fail-closed submit decisions
- `SupportRecordTraceRef` plan-version traceability (plan side only; HD-RA-02)
- INV-07 / INV-10 / INV-17 presentation patterns on existing demo screens

**PRESENTATION GAP**

- Field-oriented procedure summary (場面→実施→避ける→補足)
- Non-essay record input layout
- ~390px field-flow presentation verification
- Review materials layout beyond counts (presentation portion)

**FLOW GAP**

- 「この手順を記録」and context handoff without re-select
- Users → 手順確認 → Record → Save chain
- Review → 元記録 → 支援計画 drill-down
- Save-failure input retention on an actual save path

**CONTRACT GAP**

- First-class SupportProcedure (body + identity linked to plan version)
- Unified ProcedureRecord (or equivalent) with plan **and** procedure version binding
- Procedure execution result vocabulary (手順どおり / 一部変更 / 実施できなかった)
- `performedAt` vs `recordedAt` dual timestamps on procedure records
- Fixture graph joining user ↔ plan version ↔ procedure version ↔ record

**DOMAIN DECISION REQUIRED**

- Whether field “支援手順記録” is `ExecutionRecord`, extension of ABC/Observation, new ProcedureRecord, or composition with `SupportRecordTraceRef`
- Whether procedure **body** lives in contracts (contradicts current `contracts-v1.md`: procedure = APPROVED id/version only) or remains presentation derived from plan `supportMethods`/`precautions`
- Authority for record correction / amendment history after save
- How Active plan uniqueness + procedure set versioning interact when plan advances

**N/A**

- Deploy / live SharePoint mutation / App Catalog (forbidden this slice)
- 生活介護個別支援計画 and other out-of-scope domains

---

## 3. SupportPlan → Procedure → Record binding result

### Verdict: **NOT JOINED** (PARTIAL fragments only)

```text
SupportPlan (PlanId, UserId, status, effectiveFrom/To, currentVersion)
    └── SupportPlanVersion (planId, version, goals[], supportMethods[], precautions[])
         ✗ no ProcedureId / procedure body entity

ApprovedProcedureReference (ProcedureId, ProcedureVersion, APPROVED)
    └── ExecutionRecord (UserId, Procedure, LocalDate, IdempotencyKey, PayloadFingerprint)
         ✗ no planId / planVersion

SupportRecordTraceRef (RecordId, planId, planVersion, recordedAt, recordedBy)
    ✗ no Procedure*
    ✗ no record body / result

AbcRecord / Observation
    optional planId only; ✗ planVersion; ✗ Procedure*; occurredAt/observedAt ≠ performedAt/recordedAt pair
```

| Required concept | Status |
|---|---|
| Support plan identity + version | **EXISTS** (`PlanId` / `planId` + `version`) |
| Procedure identity + version (ref) | **EXISTS** as `ApprovedProcedureReference` |
| SupportProcedure **entity** (場面/実施/避ける/補足) | **MISSING** |
| ProcedureRecord binding plan **and** procedure versions | **MISSING** |
| Immutable historical binding after plan change | **PARTIAL** at plan-trace contract; **NOT** enforced in shell/records |
| performedAt vs recordedAt | **MISSING** as defined pair |

### Stop conditions triggered

Per FIELD-WORKFLOW-1 §16:

1. **procedure identity as field procedure body** — not present (ref-only).
2. **record cannot fixed-reference both plan and procedure** — no single type.
3. **performedAt / recordedAt meanings** — dual clock undefined for procedure records.
4. **schema/contract change required** for success criteria binding — yes.
5. Inventing contracts in a presentation slice — **forbidden**; STOP.

### Why presentation alone cannot claim success

Success criteria require: 記録が正しい支援計画・手順に結び付く.

UI preselection without durable binding would create a demo that **looks** like the flow while failing audit/review explainability (FW-04/FW-05). That violates “UIだけを完成扱いにしない”.

---

## 4. Scope decision after assessment

| Class | Content | This slice |
|---|---|---|
| **A. Presentation-only** | Field summary layout from existing fixture strings; Review layout; 390 CSS; CTA **copy** without durable binding | Deferred — alone cannot meet success criteria; risk of false completion |
| **B. Existing contract wiring** | Show Active plan period; display TraceRef labels if fixtures added; reuse save-state chrome | Partial only; cannot bind procedure body/result |
| **C. Contract / domain change** | SupportProcedure entity; ProcedureRecord; result enum; performedAt; joined fixtures | **Required for success** — **STOP** pending Human GO |

**Recommendation: B. HOLD — CONTRACT GAP** (also touches DOMAIN DECISION REQUIRED).

---

## 5. Minimal next Issue candidates (do not implement here)

### Issue candidate A — `contracts: SupportProcedure + plan-version link`

- Define SupportProcedure (or DEC that procedure body stays outside contracts and is presentation-only projection).
- Link `planId` + `planVersion` ↔ `ProcedureId` + `ProcedureVersion`.
- Resolve tension with `contracts-v1.md` (“手順本文ではなく id/version のみ”).

### Issue candidate B — `contracts: ProcedureRecord binding + result + clocks`

- Record type carrying: UserId, planId, planVersion, ProcedureId, ProcedureVersion, performedAt?, recordedAt, recordedBy, result vocabulary.
- Or explicit DEC composing `ExecutionRecord` + `SupportRecordTraceRef` + new result fields.
- FW-05 invariant tests: after Active v3, records with performedAt/LocalDate in v2 window still resolve to v2.

### Issue candidate C — `ui: field-workflow presentation` (depends on A/B GO)

- FW-01 summary, FW-02 CTA + preselect, FW-03 result UI, FW-07 Review materials, FW-08 390 smoke, FW-09 fail-retain on real save path.
- Preserve DADS IA, status vocab, 5-state, fail-closed, INV-07/10/17.

Related open UI issues (intent overlap, not auto-close):

- #68 field-ui (利用者→時間順支援手順→詳細) — assumes #26 includes 支援手順; #26 delivered Plan/Version only.
- #69 recording-ui (ABC/観察 + save retain) — adjacent, not identical to 支援手順記録 result vocabulary.

---

## 6. Scenario readiness (current main)

| Scenario | Ready? | Notes |
|---|---|---|
| 1 支援前 — 現在有効な支援手順 | **NO** | Category support text only |
| 2 支援直後 — この手順を記録 | **NO** | No CTA / preselect chain |
| 3 一部変更 | **NO** | No result option |
| 4 実施できなかった | **NO** | No result option; must not style as staff failure when added |
| 5 計画 version binding | **NO** | TraceRef exists; not wired; no joined record type |
| 6 Review drill-down | **NO** | Counts/cards only |
| 7 mobile ~390 | **UNPROVEN** | 768/480 CSS; no field-flow 390 smoke |
| 8 save failure retain | **NO** | Vocab yes; path no |

---

## 7. Preserved invariants (must not break in future implementation)

- DADS App Shell IA and primary nav meanings
- 要確認 / 未記録 / 期限接近 vocabulary
- Save 5-state + fail-closed (do not weaken)
- INV-07 / INV-10 / INV-17
- Fixture / live-data boundary; synthetic safety flags
- Existing data hooks and navigation behavior
- Authority boundary; no auto Ready/Merge
- HD-RA-02: plan/version traceability intent (extend carefully; do not invent statutory workflow)

---

## 8. Repository / external mutations (this assessment)

| Kind | Result |
|---|---|
| Code / contract / schema | **None** (assessment-only) |
| Docs | This file |
| Deploy / SharePoint / App Catalog / Entra / live data | **None** |
| Issue #299 Close / automatic Ready / Merge | **None** |

---

## 9. Recommendation

```text
B. HOLD — CONTRACT GAP
```

Also flag **DOMAIN DECISION REQUIRED** for procedure-body ownership and which record type is the 支援手順記録正本.

Do **not** mark FIELD-WORKFLOW-1 UI-complete on presentation prototypes until binding contracts exist and FW-05 is test-enforced.
