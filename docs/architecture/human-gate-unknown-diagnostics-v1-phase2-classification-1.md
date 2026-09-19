# HUMAN-GATE-UNKNOWN-DIAGNOSTICS-V1 — PHASE 2 UNKNOWN Root-Cause Classification

```text
Unit: HUMAN-GATE-UNKNOWN-DIAGNOSTICS-V1-PHASE2-CLASSIFICATION-1
Kind: UNKNOWN root-cause candidate classification (NON-FINAL)
Mode: READ ONLY / NO EXECUTION AUTHORITY
Parent inventory: docs/architecture/human-gate-unknown-diagnostics-v1-phase1-inventory-1.md
Parent freeze: docs/architecture/human-gate-unknown-diagnostics-v1-phase0-freeze-1.md
Status: CANDIDATES RECORDED / NOT LOCKED AS VERIFIED ROOT CAUSE
Implementation = NOT AUTHORIZED
```

This document applies the A–F taxonomy to Source PR #557 and to collateral
pilot #552. Labels are **candidates**. They are **not** verified production
root-cause locks and must not be used as mutation authority.

---

## 1. Taxonomy (closed candidate codes)

```text
A. OBSERVATION_MISSING
   Required GitHub-side information itself cannot be obtained

B. LINEAGE_AMBIGUOUS
   Definition / Scope / Implementation canonical identity cannot be uniquely fixed

C. HUMAN_AUTHORITY_UNRESOLVED
   Human GO presence / target / consumed state cannot be machine-decided

D. FRESHNESS_UNRESOLVED
   GO exists but validity against current HEAD cannot be decided

E. MULTIPLE_GATE_CANDIDATES
   More than one next Human Action candidate remains

F. UNSUPPORTED_GATE_PATTERN
   Resolver has no defined engineering pattern for this PR / Issue shape
```

---

## 2. Source PR #557 — candidate ranking

### Primary candidate: **F. UNSUPPORTED_GATE_PATTERN**

Mechanical facts (CONFIRMED):

```text
getPilot(557) === null
no linked Issue for gate-packet:read bind
deriveNextHumanAction never invoked for #557 via Option B CLI
packet schema does not index draft / CI / review for next_human_action
```

Interpretation (candidate, not lock):

```text
The current machine Human Gate pattern is Issue-pilot + evidence formal tokens.
PR #557 is a Draft docs-only freeze PR with no pilot bind.
That pattern is unsupported by the resolver path → bare operational UNKNOWN /
Decision Candidate NOT_PRESENT without diagnostic payload.
```

### Secondary candidates (not eliminated)

| Code | Why still possible | Why not primary |
|---|---|---|
| A. OBSERVATION_MISSING | Issue live state may be token-limited in some environments | Core PR #557 GitHub fields **were** obtained |
| B. LINEAGE_AMBIGUOUS | Slice A lineage appears only as free-text in PR body | Primary blocker is missing pilot bind before lineage parse |
| C. HUMAN_AUTHORITY_UNRESOLVED | No formal GO tokens for #557 Ready/Merge | Authority parse never reached; pattern unsupported first |
| D. FRESHNESS_UNRESOLVED | No GO-to-HEAD bind exists to freshness-check | No GO object to test for staleness |
| E. MULTIPLE_GATE_CANDIDATES | Human might debate Ready vs leave Draft vs close | Machine never produced multiple enum candidates; it produced no packet |

```text
Status for #557 classification = CANDIDATE_PRIMARY_F
Verified production root cause = NOT LOCKED
```

---

## 3. Collateral pilot #552 — candidate ranking

Mechanical facts (CONFIRMED via `gate-packet:read -- 552`):

```text
pilot bind exists
locked_heads populated
live.pr_state = MERGED
gates.implementation_start = UNKNOWN
gates.ready = UNKNOWN
gates.merge = NOT_RECEIVED
gates.actual_staff_value = UNKNOWN
next_human_action = UNKNOWN
resolution.* fields absent
```

Evidence prose uses non-formal phrases such as:

```text
HOLD / REQUIRED AFTER BROWSER ACCEPTANCE
NOT RECEIVED / NOT ELIGIBLE
```

`normalizeGateState` maps non-exact formal tokens → `UNKNOWN`, after which
`deriveNextHumanAction` fails closed to `UNKNOWN`.

### Primary candidates: **B and/or C**

| Code | Candidate rationale |
|---|---|
| B. LINEAGE_AMBIGUOUS | Formal gate identity for next action cannot be uniquely derived from indexed tokens (several gates UNKNOWN) |
| C. HUMAN_AUTHORITY_UNRESOLVED | Ready / staff-value / implementation_start authority not machine-decidable from formal tokens |

Not primary for #552:

| Code | Why not primary |
|---|---|
| A | GitHub live PR was AVAILABLE |
| D | No ELIGIBLE/CONSUMED GO shown as stale-vs-fresh conflict; tokens already UNKNOWN |
| E | derive returned single UNKNOWN, not multiple concrete actions |
| F | Pilot pattern **is** registered; pattern exists but inputs do not resolve |

```text
Status for #552 classification = CANDIDATE_PRIMARY_B_OR_C
Verified production root cause = NOT LOCKED
```

---

## 4. Shared diagnostic gap (both subjects)

Regardless of A–F winner:

```text
CONFIRMED observation + Human Action UNKNOWN
currently yields no machine fields for:
  resolution.code
  missingInputs[]
  ambiguousInputs[]
  resolvedInputs{}
  decisionCandidate.status
```

PHASE 3 Definition success condition:

```text
Keep Human Action = UNKNOWN when unresolved.
Make the why mechanically observable.
Do NOT convert UNKNOWN into ASK_HUMAN / GO / Ready.
```

---

## 5. Explicit non-decisions

- Do not treat candidate F/B/C as Implementation Start authority
- Do not edit PR #557 to invent formal tokens
- Do not “fix” #552 UNKNOWN by rewriting evidence into ELIGIBLE in this unit

---

## 6. Next

```text
PHASE 3 — Diagnostic Readback Definition (contract only)
```
