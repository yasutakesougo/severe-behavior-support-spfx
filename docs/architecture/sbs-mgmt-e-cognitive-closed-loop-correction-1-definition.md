# SBS-MGMT-E — Cognitive Closed-Loop Correction-1 Definition

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-E-COGNITIVE-CLOSED-LOOP-CORRECTION-1
parent: #556 SBS-MGMT-E
kind: Definition / Controlled Packet
mode: docs-only / Definition fixation
date: 2026-09-16
basis main (at Definition draft): ac6b3d665b0e514852775b5b58f5f9e254d107ae
Evidence-2 authority:
  docs/architecture/sbs-mgmt-e-current-main-acceptance-rebaseline-1.md
  docs/architecture/sbs-mgmt-e-5-persona-simulation-1.md
  (land via PR #633 if not yet on main)
Independent Definition/Scope Review: REQUIRED / NOT STARTED
Human Definition Lock: NOT RECEIVED
Human Implementation Start GO: NOT RECEIVED
Product / SPFx / domain mutation: NOT AUTHORIZED BY THIS DOC
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
```

## 1. Why this Correction exists

Evidence-2 rebaseline confirmed:

```text
Semantic closed-loop = PASS
RBA 1280/390 Loop-A / Loop-B / Home = PASS
5-persona simulation = PASS WITH MINOR FRICTION (SIM ONLY)
```

Cognitive (presentation) findings remain. They do **not** change domain semantics. They block clean Human Apply Path A / Disposition without inventing new business rules.

Authority findings (simulation P2, elevated to Correction):

```text
P2-1 Draft-create CTA ↔ Apply CTA 語対応の探索コスト
P2-2 Draft ≠ Applied の明示は操作後に強いが、初見スキムでは PARTIAL
```

Carry-forward friction already documented on Loop-B matrix:

```text
Review readback「支援内容を見直す」
  ↔ Draft-start CTA speech-act family
Home「次に必要な人の行動」vague「適用可否」
  ↔ explicit Human Apply
```

Prior PLAN-ACTIVATION-C slices (CTA-ROLE-CLARIFICATION, NEXT-VERSION-COPY-SIMPLIFICATION-1/2) did **not** close Review↔Draft cue continuity or Home next-action Apply binding.

## 2. Locked CORR split

Presentation / copy / visibility continuity only.

| ID | Cognitive defect | Exact IN | Exact OUT |
|---|---|---|---|
| **CORR-1A** | Review next-step cue does not speech-act-match Draft-start CTA | `ReviewOutcomeCaptureView.tsx` next-step (`次にすること` / `支援内容を見直す` / helper) aligned to Loop-B `data-sbs-mgmt-loop-b-action="start-revision"` family | domain review outcome; note input restore; FIELD_STAFF chrome |
| **CORR-1B** | Draft≠Applied weak on first scan; Draft-create vs Apply CTA family mismatch | Loop-B draft block in `SupportPlan.tsx` + `support-plan-copy.ts` draft labels; keep Apply label `版 N を適用開始する`; tighten adjacent Draft/未適用 framing so Apply is the only “start using next version” speech-act | activation handler / CAS; SIMPLIFICATION-2 after-apply rewrite; cold create-cta redesign |
| **CORR-1C** | Home `次に必要な人の行動` uses vague 適用可否 and does not bind to Human Apply | `management-home-read-model.ts` + `ManagementHome.tsx` next-action templates when Draft exists / post-Apply | `SupportPlan.currentVersion` authority; mismatch/unavailable fail-closed semantics |

```text
CORR-1A Review next-step
    → CORR-1B Draft start + Draft≠Applied framing
    → Apply CTA label UNCHANGED
    → CORR-1C Home next-action binds to Apply / applied confirmation
```

## 3. Success criteria（cognitive YES without domain change）

```text
L4 / C1-2  after CHANGE_REQUIRED, next action matches Draft-start CTA family
L5 / C2-4b Draft ≠ Applied understandable on first scan
T3         “what is required to start using next version” = explicit Human Apply
L7 / Home  next-action names Apply or confirms applied — not inventable「適用可否」
```

Domain / contract invariants from #556 Correction-2 checklist remain PASS without semantic edits.

## 4. Minimality boundary

IN (after Human Implementation Start GO only):

```text
presentation copy / labels on the four named surfaces
tests/smoke string asserts that track those labels
optional small copy centralization into existing *-copy.ts files
```

OUT:

```text
src/domain/** semantic changes
activation CAS / ALREADY_APPLIED / HOLD rules rewrite
SharePoint / M365 / Entra / LIVE WRITE
Deploy / App Catalog
FIELD_STAFF Task-First IA (CORR-1F/G)
new Gate type / new Foundation / closed-loop-evidence.json framework
AI substitution for Human Review / revision-start / Human Apply
Path A staff answers / CORE LOOP VALUE disposition (separate Human gates)
```

## 5. Gate state after this Definition draft

```text
Definition draft                         = READY FOR INDEPENDENT REVIEW
Exact Scope                              = see companion exact-scope doc
Independent Definition/Scope Review      = REQUIRED (P0=0 / P1=0)
Human Definition Lock                    = NOT RECEIVED
Human Implementation Start GO            = NOT RECEIVED
Product mutation                         = NOT AUTHORIZED
#556 Human Apply Path A                  = HOLD (deferred until after Correction)
CORE LOOP VALUE DISPOSITION              = HOLD
Deploy / LIVE WRITE                      = HOLD
```

## 6. NEXT

```text
Fresh Independent Definition/Scope Review
— this Definition + Exact Scope
— require P0=0 / P1=0
↓
PASSなら Human Implementation Start GO (CORR-1A/1B/1C only)
```
