# SBS-ROLE-TASK-FIRST-IA-V1 — Implementation Scope Scout / Exact Scope (CORR-1F)

Implementation Scope Scout and Exact Scope Definition for the first authorized Product implementation tranche after Human Definition Lock GO.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: CORR-1F
kind: implementation scope scout / exact scope definition
status: COMPLETE / INDEPENDENT SCOPE REVIEW-1 PASS
parent definition: Correction-2 Complete Controlled Packet
parent path: docs/architecture/sbs-role-task-first-ia-v1-correction-2-complete-controlled-packet.md
parent blob: 5eeb8140772ebfefe050cff93361a6d81c470f81
locked definition lineage commit: c8f59a08c7dce36c485de6e40ea86a6fa93e6f94
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
| App shell chrome | `AppShellChrome.tsx` renders SHELL-UX-7 nav; supports `presentationRole` prop | CORR-1F does not authorize AppShellChrome mutation; see §3.2 adapter contract |
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
spfx/src/shell/ux/field-staff-task-navigation.ts             (new)
spfx/src/shell/ux/field-staff-task-navigation.test.ts        (new)
spfx/src/shell/ux/index.ts                                   (export wiring only)
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
1. Product Destination identity exposed in FIELD_STAFF Task-First UI/state MUST remain the D-* id.
2. Missing context MUST resolve according to locked CORR-2A fallback destination identity; it MUST NOT open an empty destination surface.
3. 手順 with missing object → D-TODAY acquisition. This is a Destination identity fallback, not an empty D-PROCEDURE state.
4. 記録する with missing occurrence → D-UNRECORDED. This is a Destination identity fallback, not an empty D-RECORD-WRITE state.
5. Global 探す MUST resolve to D-FIND-PERSON only; D-FIND-RECORD is in-flow only and MUST NOT become Global.
6. SHELL-UX-7 adapter ids are implementation details only; they MUST NOT become V1 Destination identity, selected Task identity, or acceptance evidence by themselves.
```

### 3.2 AppShellChrome adapter contract (normative)

`AppShellChrome.tsx` is **not authorized for modification in CORR-1F**. Its existing SHELL-UX-7 chrome may remain only as an unchanged legacy host/adapter surface while CORR-1F proves the FIELD_STAFF Task-First layer in the authorized files in §3.

The following contract is mandatory:

```text
A. AppShellChrome overview/users/records ids are never normative D-* identity.
B. FIELD_STAFF Task-First Global state, selected Task, and destination resolution are owned by the CORR-1F layer, not by AppShellChrome legacy nav ids.
C. A legacy overview/users transition may be used only as an adapter transport behind the already-resolved D-* identity.
D. The legacy chrome MUST NOT be presented or interpreted as a second concurrent V1 Global truth.
E. If satisfying AC-1F-1..11 requires AppShellChrome behavior/presentation change, CORR-1F MUST HOLD. Do not widen scope silently.
F. PLANNER / ADMIN_AUDIT behavior through AppShellChrome remains unchanged and is regression-only evidence in CORR-1F.
```

---

## 4. CORR-2A FIELD_STAFF binding (normative for implementers)

| Global | Destination (context sufficient) | context不足時の意味 / fallback destination identity |
|---|---|---|
| 今日 | D-TODAY | N/A |
| 手順 | D-PROCEDURE (object exists) | **D-TODAY** acquisition; do not open empty D-PROCEDURE |
| 記録する | D-RECORD-WRITE (occurrence exists) | **D-UNRECORDED**; do not open empty D-RECORD-WRITE |
| 未記録 | D-UNRECORDED | N/A |
| 探す | D-FIND-PERSON | N/A |

Global order MUST remain: `今日 · 手順 · 記録する · 未記録 · 探す`.

The two fallback identities above are normative CORR-2A bindings for CORR-1F. They are not implementation hints and must not be replaced by a different D-* identity during implementation.

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

Only the following CORR-1F-specific verification files may be added/changed for this tranche:

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

### 6.1 AC-1F verification mapping (normative)

| AC | Required evidence | Unit test mapping | Browser smoke mapping |
|---|---|---|---|
| AC-1F-1 | FIELD_STAFF five Global labels + exact order | `field-staff-task-navigation.test.ts`: exact ordered list | smoke asserts rendered ordered labels |
| AC-1F-2 | one Global item → one D-* identity | unit table asserts exactly one resolved destination per item | smoke exercises each Global item and records resolved D-* identity |
| AC-1F-3 | 手順 missing object → D-TODAY | unit missing-object case | smoke starts without object and observes D-TODAY acquisition orientation |
| AC-1F-4 | 記録する missing occurrence → D-UNRECORDED | unit missing-occurrence case | smoke starts without occurrence and observes D-UNRECORDED orientation |
| AC-1F-5 | 探す → D-FIND-PERSON only; no Global D-FIND-RECORD | unit exact binding + negative assertion | smoke checks 探す orientation and absence of Global record-search destination |
| AC-1F-6 | usable-session first paint = D-TODAY / 今日の支援 | unit default/first-resolution assertion where applicable | smoke first-paint assertion |
| AC-1F-7 | D-HOME aliases D-TODAY; no second place | unit identity/alias assertion | smoke asserts first paint and 今日 return to the same D-TODAY identity |
| AC-1F-8 | presentationRole remains synthetic; no auth-role invention | unit/compile evidence; no new auth role in CORR-1F diff | smoke runs synthetic FIELD_STAFF fixture only; no auth claim |
| AC-1F-9 | no domain/schema/persistence contract change | scope-diff invariant + existing test suite | smoke has no LIVE I/O; no persistence assertion is invented |
| AC-1F-10 | reproducible unit + browser evidence | required unit file PASS | required browser smoke PASS with exact implementation HEAD |
| AC-1F-11 | PLANNER / ADMIN_AUDIT fail-closed regression | existing tests / explicit regression assertion if touched indirectly | smoke must not claim PL/AA V1 Global; unchanged-role regression evidence only |

`AC-1F-9` and the non-expansion part of `AC-1F-11` are scope/diff invariants in addition to test evidence. Passing a smoke alone cannot prove that unauthorized Product files were not changed.

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
| AC-1F-1 | FIELD_STAFF Global items match §4 labels and order. |
| AC-1F-2 | Each Global item maps to exactly one D-* Destination identity (no dual bind). |
| AC-1F-3 | 手順 without object falls back to **D-TODAY** acquisition without empty D-PROCEDURE. |
| AC-1F-4 | 記録する without occurrence falls back to **D-UNRECORDED** without empty D-RECORD-WRITE. |
| AC-1F-5 | Global 探す resolves to D-FIND-PERSON only; D-FIND-RECORD is not Global. |
| AC-1F-6 | First paint after usable session presents D-TODAY / 今日の支援. |
| AC-1F-7 | D-HOME is not a second Product place; alias semantics = D-TODAY. |
| AC-1F-8 | presentationRole remains synthetic; no authorization-role invention. |
| AC-1F-9 | No domain / schema / persistence contract change and no Product file outside §3. |
| AC-1F-10 | Reproducible unit + browser smoke evidence for FIELD_STAFF Global resolution at exact implementation HEAD. |
| AC-1F-11 | PLANNER / ADMIN_AUDIT existing surfaces regress fail-closed; no accidental Global rewrite. |

---

## 9. HOLD conditions

| ID | HOLD condition | Required disposition |
|---|---|---|
| H-1 | Locked Definition blob is not `5eeb8140772ebfefe050cff93361a6d81c470f81` | Stop; recover exact locked Definition lineage |
| H-2 | Human Definition Lock record does not match the consumed lock lineage | Stop; recover lock evidence |
| H-3 | Implementer must touch any Product runtime file outside §3 to satisfy AC-1F-1..11 | Stop; issue new Exact Scope; do not expand silently |
| H-4 | Implementer must touch any CORR-1F-specific verification file outside §6 | Stop; amend Scope and re-review before implementation |
| H-5 | FIELD_STAFF AC requires PLANNER / ADMIN_AUDIT Global change | Stop; separate tranche required |
| H-6 | Legacy adapter cannot satisfy §4 fallback identities without `AppShellChrome.tsx` change | Stop; new Scope required |
| H-7 | AppShellChrome legacy chrome would become a second concurrent V1 Global truth | Stop; CORR-1F is insufficient; do not claim dual-run acceptance |
| H-8 | Any work requires domain/schema/persistence/LIVE WRITE/Auth/Entra change | Stop; outside CORR-1F authority |
| H-9 | Implementation base does not contain durable locked Definition + Human Definition Lock evidence before Implementation Start bind | Stop; merge/bind durable Definition lineage first |

---

## 10. Fresh Independent Scope Review questions

| ID | Question |
|---|---|
| Q1 | Is CORR-1F limited to FIELD_STAFF CORR-2A/B proof without PLANNER/ADMIN_AUDIT Global change? |
| Q2 | Are authorized Product files closed under §3 and verification files closed under §6? |
| Q3 | Does §4–§5 restate locked Definition without new state rules? |
| Q4 | Are 手順→D-TODAY and 記録する→D-UNRECORDED fallback identities normative and unambiguous? |
| Q5 | Does §3.2 AppShellChrome adapter contract prevent D-* identity drift and dual-run Global? |
| Q6 | Do AC-1F-1..11 map to reproducible unit/smoke/diff evidence without HTA over-claim? |
| Q7 | Are domain/schema/persistence/LIVE WRITE exclusions sufficient? |
| Q8 | Is SHELL-UX-7 ledger mutation still excluded? |
| Q9 | Does this Scope avoid fixing P2 Open Questions by implementation side-effect? |
| Q10 | Is durable locked Definition lineage required before Implementation Start bind (§9 H-9)? |

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

A Scope Review PASS does not itself consume Human Correction Implementation GO.

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
Independent Scope Review = PASS / REVIEW-CLEARED / CONSUMED
  record: docs/architecture/sbs-role-task-first-ia-v1-implementation-scope-corr-1f-independent-scope-review-1.md
Human Correction Implementation GO = NOT RECEIVED
Product mutation = NOT AUTHORIZED
```

```text
ALLOWED NEXT (after durable Definition lineage bind + Human Correction Implementation GO):
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
| Locked Definition packet path | `docs/architecture/sbs-role-task-first-ia-v1-correction-2-complete-controlled-packet.md` |
| Locked Definition packet blob | `5eeb8140772ebfefe050cff93361a6d81c470f81` |
| Locked Definition lineage commit containing reviewed packet + lock evidence | `c8f59a08c7dce36c485de6e40ea86a6fa93e6f94` |
| Human Definition Lock record blob | `794d227a1e69c709e679337be6478b32de81d74a` |
| Re-Review-2 record path | `docs/architecture/sbs-role-task-first-ia-v1-correction-2-independent-definition-re-review-2.md` |
| Scout basis main | `5b777001027af8b3b0e75f8031a65a248f0fd189` |

The locked Definition authority for this Scope is the **packet blob `5eeb8140…` on the consumed locked lineage**, not the mutable name `main`. `main @ 5b777001…` is scout evidence only.

---

## 15. Durable Definition lineage precondition (P1 before Implementation Start bind)

The Scope may be reviewed while it lives on this docs-only scope branch. However, **before any Implementation Start / Human Correction Implementation bind**, the implementation base must include or descend from a durable repository lineage containing:

```text
Correction-2 Complete Controlled Packet blob
= 5eeb8140772ebfefe050cff93361a6d81c470f81

Human Definition Lock record blob
= 794d227a1e69c709e679337be6478b32de81d74a

Independent Definition Re-Review-2 record
= present and bound to the same locked packet
```

If the implementation base is still a `main` commit that does not contain these Definition Lock artifacts, this is **P1 / HOLD for Implementation Start bind**, not a non-blocking P2.

This section does not authorize merging any branch. Merge/branch advancement remains a separate repository decision.

---

## 16. FIELD_STAFF-only proof boundary (normative)

CORR-1F may claim only the following:

```text
FIELD_STAFF CORR-2A Global binding = in scope
FIELD_STAFF CORR-2B D-HOME == D-TODAY = in scope
FIELD_STAFF first paint D-TODAY = in scope
FIELD_STAFF exact fallback identities = in scope

PLANNER CORR-2A/B = not proven
ADMIN_AUDIT CORR-2A/B = not proven
Global SHELL-UX-7 retirement = not proven
Full Role/Task IA completion = not proven
Human Task Acceptance PASS = not proven by unit/smoke
```

Passing AC-1F-1..11 therefore proves the CORR-1F tranche only. It must not be reported as completion of the three-Role Definition.

---

```text
Human Correction Implementation GO = NOT RECEIVED
Implementation Start = NOT AUTHORIZED
Product mutation = NOT AUTHORIZED
NEXT = durable Definition lineage bind (§15 / H-9) + Human Correction Implementation GO
STOP = no Product implementation; no Human Correction Implementation GO consumption
```
