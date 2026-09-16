# SBS-MGMT-E — Actual Staff Value Check Slice GO (G1 + G2)

Human Slice GO consumption after `#556` Human Acceptance Disposition = PARTIAL.

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-E-ACTUAL-STAFF-VALUE-CHECK-G1-G2
parent: #556 SBS-MGMT-E
kind: Human Slice GO record
date: 2026-09-16
mode: docs-only / GO consumption

Human speech-act (verbatim):
  SBS-MGMT-E Actual Staff Value Check Slice GO
  — G1 Observed live navigation + G2 Timed task evidence only.
    G3 Production / live workplace value remains separate HOLD.

Human Slice GO: RECEIVED / CONSUMED
Authorized gaps: G1 + G2 only
G3: HOLD / NOT AUTHORIZED / SEPARATE LANE

Parent disposition:
  docs/architecture/sbs-mgmt-e-human-acceptance-disposition-partial-1.md
  Human Acceptance Disposition = PARTIAL / CONSUMED
  CORE LOOP VALUE CONFIRMED = NOT DECLARED

Exact Scope:
  docs/architecture/sbs-mgmt-e-actual-staff-value-check-g1-g2-exact-scope-1.md

Issue #556 close: NOT AUTHORIZED
Ready / Merge (any PR): NOT AUTHORIZED BY THIS GO
Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
G3 Production / live workplace value: HOLD
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
Product / SPFx / domain mutation by this GO: NOT AUTHORIZED
  (observation / procedure / Exact Scope docs only;
   harness reuse of existing Loop-B serve-smoke;
   no CORR-1 reopen; no new Correction unit ID)
New large roadmap: NOT AUTHORIZED
Simulation / RBA / Path A snapshot substitution for G1/G2: FORBIDDEN
```

This Decision consumes Slice GO for **G1 + G2 only**. It authorizes Exact Scope / procedure authorship and Human Actual Staff session collection under that scope. It does **not** authorize G3, product mutation, Ready / Merge / Deploy / LIVE WRITE, `#556` close, or CORE LOOP VALUE CONFIRMED.

```text
Slice GO ≠ Exact Scope Lock ≠ Staff session PASS
Staff PASS ≠ CORE LOOP VALUE CONFIRMED
G1+G2 ≠ G3
Synthetic RBA ≠ observed navigation
Path A snapshot answers ≠ G1/G2 evidence
```

---

## AUTHORIZED

```text
1. Exact Scope / procedure for
   SBS-MGMT-E-ACTUAL-STAFF-VALUE-CHECK-G1-G2
2. Head fixation to a product+harness checkout that includes
   CORR-1A/1B/1C presentation (PR #634 product HEAD lane)
3. Human Actual Staff session under Exact Scope:
   - G1 observed live navigation / Apply transition execution
   - G2 timed task evidence (duration / hesitation / backtracking)
4. Observer scoring sheet + session record template (docs)
5. Docs-only PR for this GO + Exact Scope
   (Ready / Merge remain separate Human gates)
```

---

## NOT AUTHORIZED

```text
G3 Production / live workplace value collection or claims
Deploy / App Catalog / Production Binding / LIVE WRITE
SharePoint / M365 / Entra mutation
src/domain/** or activation CAS rewrite
CORR-1 reopen / Progressive Disclosure / Causal Linking / Diff viewer
Issue #556 close
CORE LOOP VALUE CONFIRMED declaration
Ready / Merge of #633 / #634 / this docs PR without separate Human GO
Agent / Simulation / RBA substitution for Staff G1/G2 answers
New Correction unit ID beyond this named Exact Scope unit
```

---

## Gate state after GO

```text
Human Acceptance Disposition (#556)     = PARTIAL / CONSUMED
Slice GO G1+G2                          = RECEIVED / CONSUMED
Exact Scope G1+G2                       = AUTHORIZED / see companion doc
Independent Definition/Scope Review     = OPTIONAL / Human may require before staff session
Human Staff session G1+G2               = HOLD / AWAITING REAL STAFF
G3                                      = HOLD / SEPARATE
CORE LOOP VALUE CONFIRMED                = NOT DECLARED
Ready / Merge / Deploy / LIVE WRITE     = NOT AUTHORIZED
```

---

## NEXT

```text
Exact Scope (companion) = authored with this GO
↓
(optional) Independent Definition/Scope Review if Human requires
↓
Head fixation to CORR-1-capable checkout
↓
Arrival gate YES
↓
Human Actual Staff Value Check (G1+G2)
↓
PASS / ACCEPTABLE / HOLD
↓
PASS / ACCEPTABLE → Human reconsiders #556 disposition
   (PARTIAL remain | upgrade path | further gap)
≠ auto CORE LOOP VALUE CONFIRMED
≠ auto Ready / Merge / Deploy
```
