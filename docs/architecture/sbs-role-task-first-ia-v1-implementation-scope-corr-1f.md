# SBS-ROLE-TASK-FIRST-IA-V1 — Implementation Scope Scout / Exact Scope (CORR-1F)

Implementation Scope Scout and Exact Scope Definition for the first authorized Product implementation tranche after Human Definition Lock GO.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: CORR-1F
kind: implementation scope scout / exact scope definition
status: COMPLETE / AWAITING FRESH INDEPENDENT SCOPE REVIEW
parent definition: Correction-2 Complete Controlled Packet
parent path: docs/architecture/sbs-role-task-first-ia-v1-correction-2-complete-controlled-packet.md
parent blob: 5eeb8140772ebfefe050cff93361a6d81c470f81
Human Definition Lock GO: RECEIVED / CONSUMED
lock record: docs/architecture/sbs-role-task-first-ia-v1-correction-2-human-definition-lock.md
Independent Definition Re-Review-2: PASS / REVIEW-CLEARED / CONSUMED
  record: docs/architecture/sbs-role-task-first-ia-v1-correction-2-independent-definition-re-review-2.md
Human Correction Implementation GO: NOT RECEIVED
Implementation Start: NOT AUTHORIZED
Ready / Merge / Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
SHELL-UX-7 Decision ledger repeal: NOT AUTHORIZED
Notion production page update: NOT AUTHORIZED
```

This document scouts the repository against the locked Definition and fixes the **CORR-1F** exact implementation surface only.

Creating or reviewing this Scope does **not** authorize Product mutation or consume Human Correction Implementation GO.

---

## 1. Scout summary (main @ 5b777001)

### 1.1 Locked Definition requires

```text
CORR-2A  each Top-Level Global item → Entry / Destination / context不足時の意味
CORR-2B  D-HOME identity per Role (FIELD_STAFF alias D-TODAY; PLANNER distinct; ADMIN_AUDIT alias D-OPS)
CORR-1A  SHELL-UX-7 dual-run REJECTED as product target
C1–C10   Role → Task → Destination IA (all three presentation Roles)
```

### 1.2 Observed Product state (read-only scout)

| Area | Observation | CORR-1F impact |
|---|---|---|
| Primary navigation | `spfx/src/shell/ux/primary-navigation.ts` exposes SHELL-UX-7 ids `overview / users / records` with labels `概要 / 利用者 / 記録` | Legacy adapter only in CORR-1F; not V1 Global |
| App shell chrome | `AppShellChrome.tsx` renders SHELL-UX-7 nav; supports `presentationRole` prop | CORR-1F may pass `presentationRole="FIELD_STAFF"`; must not retire global nav for other Roles in this tranche |
| Product entry | `ScaffoldShell.tsx` is placeholder copy only; no Role/Task Global | CORR-1F primary Product surface |
| Presentation roles | `presentation-role.ts` already defines FIELD_STAFF / PLANNER / ADMIN_AUDIT synthetic roles | Reuse; no auth-role invention |
| Destinations / workflow | Users, procedure, records, dashboard modules exist behind legacy nav | Adapter targets only; no domain meaning change |
| Prior exploratory branch | `codex/sbs-role-task-first-ia-impl-slice-1` contains FIELD_STAFF task nav module + smoke | Informative only; not authority; must re-bind to this Scope before merge |

### 1.3 Scout verdict

Full three-Role CORR-2A/B cannot be proven in one tranche without cross-cutting `AppShellChrome` retirement. CORR-1F therefore scopes **FIELD_STAFF only** while preserving fail-closed regression for PLANNER / ADMIN_AUDIT on existing SHELL-UX-7 surfaces.

Later tranches (not CORR-1F) must carry PLANNER Distinct D-HOME and ADMIN_AUDIT alias D-OPS before Definition HTA suites are claimable end-to-end.

---

## 2. CORR-1F goal

Prove the smallest Product change that makes a FIELD_STAFF usable session satisfy:

```text
CORR-2A §2.2  FIELD_STAFF Global resolution (今日 · 手順 · 記録する · 未記録 · 探す)
CORR-2B §3.2  D-HOME == D-TODAY (alias; no second Product place)
C5 §7.1       First paint = D-TODAY after usable session
C6            Orientation copy: 今どこ / context hint without router invention
C9 FS-HTA-1   Today object + Primary Action visible without dev selectors
```

CORR-1F does **not** claim PL-HTA / AA-HTA PASS.

---

## 3. Exact authorized Product surface

Only the following Product runtime files may change behavior / presentation in CORR-1F:

```text
spfx/src/shell/ux/field-staff-task-navigation.ts          (new)
spfx/src/shell/ux/field-staff-task-navigation.test.ts       (new)
spfx/src/shell/ux/index.ts                                  (export wiring only)
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.tsx
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.module.scss
```

`AppShellChrome.tsx`, `primary-navigation.ts`, domain modules, SharePoint adapters, and other shell destinations are **OUT** unless a later Scope explicitly authorizes them.

### 3.1 Legacy shell adapter rule (CORR-1F)

CORR-1F may treat `overview / users` as **temporary implementation adapters** behind D-* identities:

```text
D-TODAY        → overview adapter (first paint)
D-PROCEDURE    → users adapter when person context required
D-RECORD-WRITE → users adapter when occurrence context required
D-UNRECORDED   → users adapter (+ existing 未記録 filter chip when present)
D-FIND-PERSON  → users adapter (person index)
```

Rules:

```text
1. Product Destination identity exposed in UI/state MUST remain the D-* id.
2. Missing context MUST NOT redirect to a different D-* identity.
3. Fallback destinations MUST match §2.2 (e.g. 手順 missing object → acquire via D-TODAY path, not empty D-PROCEDURE).
4. 記録する missing occurrence → D-UNRECORDED path, not empty D-RECORD-WRITE.
5. Global 探す MUST NOT expose D-FIND-RECORD.
6. SHELL-UX-7 nav may remain visible as legacy chrome in CORR-1F only if Task-First Global is primary and dual-run is not presented as concurrent V1 Global.
```

---

## 4. CORR-2A FIELD_STAFF binding (normative for implementers)

| Global | Destination (context sufficient) | context不足時の意味 |
|---|---|---|
| 今日 | D-TODAY | N/A |
| 手順 | D-PROCEDURE (object exists) | D-TODAY acquisition; do not open empty D-PROCEDURE |
| 記録する | D-RECORD-WRITE (occurrence exists) | D-UNRECORDED; do not open empty D-RECORD-WRITE |
| 未記録 | D-UNRECORDED | N/A |
| 探す | D-FIND-PERSON | N/A |

Global order MUST remain: `今日 · 手順 · 記録する · 未記録 · 探す`.

---

## 5. CORR-2B FIELD_STAFF binding

```text
D-HOME identity = D-TODAY
Location identity = 今日の支援
First paint after usable session = D-TODAY
Global「今日」= D-TODAY
No second Product place beside D-TODAY for this Role.
```

---

## 6. Verification surface (authorized)

```text
spfx/src/shell/ux/field-staff-task-navigation.test.ts
spfx/smoke/sbs-role-task-first-ia-1/run-smoke.mjs
spfx/smoke/sbs-role-task-first-ia-1/smoke-entry.tsx
.github/workflows/sbs-role-task-first-ia-1-browser-smoke.yml
```

Verification changes must prove CORR-1F only. They must not expand Product scope or introduce LIVE I/O.

Existing gates must remain PASS where touched:

```text
npx heft test --clean (spfx)
existing a11y / format / lint / typecheck expectations for modified files
```

---

## 7. Explicit OUT (CORR-1F)

```text
PLANNER Global (今の工程 · 探す) and Distinct D-HOME
ADMIN_AUDIT Global (運用確認 · 証跡 · 探す) and D-HOME alias D-OPS
Retiring SHELL-UX-7 Global rows globally in AppShellChrome
New Destinations (Search Hub, context-resolver place)
Domain / schema / persistence / SharePoint mutation
LIVE WRITE / Deploy / Entra / App Catalog
SHELL-UX-7 Decision ledger supersede record
Notion production mutation
P2 Open Questions (quiet 合成 badge; AA-T1 cadence; PLANNER cycle-③ Primary Action)
Human Task Acceptance sign-off (FS-HTA-2 state-meaning depth; PL/AA HTA)
Visual polish unrelated to CORR-2A/B FIELD_STAFF proof
unrelated refactor
```

---

## 8. Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1F-1 | FIELD_STAFF Global items match §2.2 labels and order. |
| AC-1F-2 | Each Global item maps to exactly one D-* Destination identity (no dual bind). |
| AC-1F-3 | 手順 without object fails over to D-TODAY acquisition without empty D-PROCEDURE. |
| AC-1F-4 | 記録する without occurrence fails over to D-UNRECORDED without empty D-RECORD-WRITE. |
| AC-1F-5 | Global 探す resolves to D-FIND-PERSON only; D-FIND-RECORD is not Global. |
| AC-1F-6 | First paint after usable session presents D-TODAY / 今日の支援. |
| AC-1F-7 | D-HOME is not a second Product place; alias semantics = D-TODAY. |
| AC-1F-8 | presentationRole remains synthetic; no authorization-role invention. |
| AC-1F-9 | No domain / schema / persistence contract change. |
| AC-1F-10 | Reproducible unit + browser smoke evidence for FIELD_STAFF Global resolution. |
| AC-1F-11 | PLANNER / ADMIN_AUDIT existing surfaces regress fail-closed (no accidental Global rewrite). |

---

## 9. HOLD conditions

```text
HOLD if locked Definition blob ≠ 5eeb8140772ebfefe050cff93361a6d81c470f81
HOLD if Human Definition Lock record does not match consumed lock path/HEAD
HOLD if implementer must touch files outside §3 to satisfy AC-1F-1..11
HOLD if CORR-1F work requires PLANNER or ADMIN_AUDIT Global change to pass FIELD_STAFF AC
HOLD if legacy adapter cannot satisfy §2.2 without AppShellChrome change → escalate to new Scope doc, do not expand silently
```

---

## 10. Fresh Independent Scope Review questions

| ID | Question |
|---|---|
| Q1 | Is CORR-1F limited to FIELD_STAFF CORR-2A/B proof without PLANNER/ADMIN_AUDIT Global change? |
| Q2 | Are authorized Product files closed under §3? |
| Q3 | Does §4–§5 restate locked Definition without new state rules? |
| Q4 | Does legacy adapter rule prevent D-* identity drift and dual-run Global? |
| Q5 | Do AC-1F-* criteria verify the scout findings without HTA over-claim? |
| Q6 | Are domain/schema/persistence/LIVE WRITE exclusions sufficient? |
| Q7 | Is SHELL-UX-7 ledger mutation still excluded? |
| Q8 | Does this Scope avoid fixing P2 Open Questions by implementation side-effect? |

---

## 11. Review gate

```text
PASS CONDITION = P0 0 = P1 0
P2 = non-blocking suggestions only
```

If P0 or P1 exists:

```text
Human Correction Implementation GO eligibility = NOT ELIGIBLE
```

---

## 12. Deferred tranches (scout note; not authorized)

| Tranche | Scope hint | Blocked until |
|---|---|---|
| CORR-2F (name TBD) | PLANNER CORR-2A §2.3 + Distinct D-HOME §3.3 | CORR-1F merged + Scope doc |
| CORR-3F (name TBD) | ADMIN_AUDIT CORR-2A §2.4 + alias D-OPS §3.4 | prior tranche |
| CORR-4F (name TBD) | Retire SHELL-UX-7 dual-run in AppShellChrome globally | all Roles bound + separate Scope |

Names are placeholders. Each tranche requires its own Exact Scope Definition and Scope Review.

---

## 13. Gate chain (this packet)

```text
Fresh Independent Definition Re-Review-2 = PASS / REVIEW-CLEARED / CONSUMED
Human Definition Lock GO = RECEIVED / CONSUMED
Implementation Scope Scout / Exact Scope (CORR-1F) = COMPLETE (this document)
Independent Scope Review = REQUIRED / NOT STARTED
Human Correction Implementation GO = NOT RECEIVED
Product mutation = NOT AUTHORIZED
```

```text
ALLOWED NEXT (docs-only until Scope Review PASS):
  Fresh Independent Scope Review against this document

ALLOWED NEXT (after Scope Review PASS + Human Correction Implementation GO):
  CORR-1F Product implementation within §3–§6 only

NOT AUTHORIZED:
  Human Correction Implementation GO by this document
  Ready / Merge / Deploy / LIVE WRITE
```

---

## 14. Exact identity check (this record)

| Item | Value |
|---|---|
| Path | `docs/architecture/sbs-role-task-first-ia-v1-implementation-scope-corr-1f.md` |
| Parent Definition blob | `5eeb8140772ebfefe050cff93361a6d81c470f81` |
| Lock record HEAD | `c8f59a08c7dce36c485de6e40ea86a6fa93e6f94` |
| Re-Review-2 record | `docs/architecture/sbs-role-task-first-ia-v1-correction-2-independent-definition-re-review-2.md` |
| Scout basis main | `5b777001027af8b3b0e75f8031a65a248f0fd189` |

```text
Human Correction Implementation GO = NOT RECEIVED
Implementation Start = NOT AUTHORIZED
STOP = await Independent Scope Review, then Human Correction Implementation GO
```
