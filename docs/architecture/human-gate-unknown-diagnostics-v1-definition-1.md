# HUMAN-GATE-UNKNOWN-DIAGNOSTICS-V1 — Definition

```text
Definition ID = HUMAN-GATE-UNKNOWN-DIAGNOSTICS-V1-DEFINITION-1
Correction = 0
Mode = DEFINITION ONLY
Status = AWAITING INDEPENDENT DEFINITION REVIEW / HUMAN DEFINITION LOCK GO
Human Definition Lock GO = NOT RECEIVED
Independent Definition Review-1 = NOT RECEIVED
basis main at Definition draft = 919eeba5d061ba81fb05f536d4828301b3dcc212
Parent Option B Definition = ASANA-STYLE-DELEGATION-SLICE-A-DEFINITION-1
Parent Option B Scope = ASANA-STYLE-DELEGATION-SLICE-A-IMPLEMENTATION-SCOPE-1
Implementation Scope = NOT AUTHORIZED
Implementation = NOT AUTHORIZED
Ready / Merge / Deploy / Production Binding / LIVE WRITE = NOT AUTHORIZED
SharePoint / M365 / Entra mutation = NOT AUTHORIZED
Issue mutation = NOT AUTHORIZED by this Definition
PR #557 mutation = NOT AUTHORIZED by this Definition
Structured Gate Packet full redesign = NOT AUTHORIZED by this Definition
```

This durable Definition records the **Diagnostic Readback** contract for
`HUMAN-GATE-UNKNOWN-DIAGNOSTICS-V1` PHASE 0–5.

It does **not** authorize Implementation Start, Ready, Merge, Deploy, Human GO
automation, or any change to PR #557.

---

## 1. Goal

Make `Human Action = UNKNOWN` **diagnosable** without weakening Human Gate
fail-closed behavior.

Success is **not** “eliminate UNKNOWN”.

Success is:

```text
When Evidence / observation is CONFIRMED and Human Action remains UNKNOWN,
the machine readback MUST expose:
  - resolution.code
  - missingInputs
  - ambiguousInputs
  - resolvedInputs
  - decisionCandidate.status
so operators can investigate without free-text re-inference.
```

---

## 2. Problem

Current Option B Structured Gate Packet can return:

```text
next_human_action: "UNKNOWN"
```

with no reason payload.

PHASE 0 freeze for Source PR #557 records:

```text
Evidence State     = CONFIRMED
Human Action       = UNKNOWN
Decision Candidate = NOT_PRESENT
```

PHASE 1–2 show that bare UNKNOWN can arise from at least:

```text
F. unsupported gate pattern (no pilot bind) — Source #557 candidate
B/C. lineage / Human authority unresolved from formal tokens — collateral #552 candidate
```

Without diagnostic fields, CONFIRMED + UNKNOWN is an operational dead-end.

---

## 3. Relationship to parent Slice-A Option B

```text
Parent semantics (LOCKED):
  docs/architecture/asana-style-delegation-slice-a-definition-1.md
  docs/architecture/asana-style-delegation-slice-a-implementation-scope-1.md

This Definition:
  extends READ-ONLY readback when next_human_action === UNKNOWN
  does NOT replace Structured Gate Packet as a new Control Plane
  does NOT create new Human Gates
  does NOT authorize Option C persistent YAML
  does NOT introduce /api/status
```

Vocabulary map:

```text
User phrase              Repository machine surface
-----------------------  ------------------------------------------
resolveHumanAction()     deriveNextHumanAction(gates)
                         + deriveUnknownResolution(...)  (future impl)
/api/status              npm run gate-packet:read JSON extension
Decision Candidate       diagnostic field only (not authority)
ASK_HUMAN                FORBIDDEN as UNKNOWN substitute in this Definition
```

---

## 4. Diagnostic Readback Contract

### 4.1 When diagnostics MUST appear

Whenever the machine Human Gate path yields:

```text
humanAction.status = UNKNOWN
```

equivalent today to:

```text
next_human_action = "UNKNOWN"
```

the readback MUST include a `unknown_resolution` object (name may be finalized in
Implementation Scope; semantics below are normative for this Definition).

### 4.2 Required shape

```text
humanAction:
  status: UNKNOWN

unknown_resolution:
  code: <A..F closed enum>
  missingInputs: [<machine field id>, ...]
  ambiguousInputs:
    - field: <machine field id>
      why: <short machine reason token or bounded string>
  resolvedInputs:
    <machine field id>: <observed value or NOT_APPLICABLE>
  decisionCandidate:
    status: NOT_PRESENT | PRESENT
  sourceRefs:
    - <path or github live descriptor>
  freshness:
    evidence_checked_at: <ISO-8601>
    evidence_basis_sha: <sha or UNKNOWN>
```

### 4.3 Closed enum for `unknown_resolution.code`

```text
OBSERVATION_MISSING
LINEAGE_AMBIGUOUS
HUMAN_AUTHORITY_UNRESOLVED
FRESHNESS_UNRESOLVED
MULTIPLE_GATE_CANDIDATES
UNSUPPORTED_GATE_PATTERN
```

Exactly one primary `code` MUST be returned per readback.

If multiple codes remain plausible and the implementation cannot pick one without
guessing, prefer:

```text
code = MULTIPLE_GATE_CANDIDATES
```

with the competing codes listed under `ambiguousInputs` (field id may be
`resolution.code` with why enumerating candidates), **or** remain on the most
specific code only when mechanical precedence is Implementation-Scope-defined.

This Definition does **not** invent free-text root causes outside the enum.

### 4.4 `decisionCandidate` rules

```text
decisionCandidate.status = NOT_PRESENT | PRESENT

NOT_PRESENT != HOLD
NOT_PRESENT != DENY
NOT_PRESENT != GO
PRESENT != GO
PRESENT != Ready
PRESENT != Merge
PRESENT != Deploy
```

`decisionCandidate` is diagnostic indexing only.

It MUST NOT grant execution authority.

It MUST NOT convert UNKNOWN into an executable Human Action.

### 4.5 Forbidden promotions

```text
UNKNOWN → ASK_HUMAN          FORBIDDEN
UNKNOWN → READY              FORBIDDEN
UNKNOWN → MERGE              FORBIDDEN
UNKNOWN → DEPLOY             FORBIDDEN
UNKNOWN → IMPLEMENTATION_START FORBIDDEN (by diagnostics alone)
CI GREEN → Ready             FORBIDDEN
Review PASS → Ready          FORBIDDEN
Ready GO → Merge GO          FORBIDDEN
Merge GO → Deploy GO         FORBIDDEN
free-text inference overrides formal tokens  FORBIDDEN
```

### 4.6 Minimum field id vocabulary (normative starter set)

Implementation Scope may extend this set; it MUST NOT silently drop these ids
when applicable:

```text
pilot.bind
pr.identity
pr.state
pr.draft
pr.head_sha
pr.base_sha
pr.mergeable
ci.state
review.state
locked_heads.definition
locked_heads.scope
locked_heads.implementation
gates.definition_lock
gates.implementation_start
gates.ready
gates.merge
gates.deploy
gates.production_write
gates.actual_staff_value
next_human_action
sources.primary
freshness.evidence_basis_sha
```

### 4.7 Example (illustrative only — not production lock)

Source-like unsupported pattern:

```yaml
humanAction:
  status: UNKNOWN
unknown_resolution:
  code: UNSUPPORTED_GATE_PATTERN
  missingInputs:
    - pilot.bind
    - gates.ready
    - locked_heads.definition
  ambiguousInputs: []
  resolvedInputs:
    pr.identity: 557
    pr.state: OPEN
    pr.draft: true
    pr.head_sha: d56bf66c1003fe86d2694fbcc55d3ec3033abdf4
    ci.state: SUCCESS
  decisionCandidate:
    status: NOT_PRESENT
```

Collateral-like authority/lineage unresolved:

```yaml
humanAction:
  status: UNKNOWN
unknown_resolution:
  code: HUMAN_AUTHORITY_UNRESOLVED
  missingInputs: []
  ambiguousInputs:
    - field: gates.ready
      why: NON_FORMAL_TOKEN_NORMALIZED_TO_UNKNOWN
    - field: gates.actual_staff_value
      why: NON_FORMAL_TOKEN_NORMALIZED_TO_UNKNOWN
  resolvedInputs:
    pilot.bind: 552
    pr.identity: 563
    live.pr_state: MERGED
    gates.merge: NOT_RECEIVED
  decisionCandidate:
    status: NOT_PRESENT
```

---

## 5. Safety invariants (Independent Definition Review MUST verify)

```text
1. UNKNOWN remains fail-closed
2. NOT_PRESENT != HOLD
3. NOT_PRESENT != DENY
4. NOT_PRESENT != GO
5. CI GREEN != Ready
6. Review PASS != Ready
7. Ready GO != Merge GO
8. Merge GO != Deploy GO
9. stale GO must not survive HEAD drift (diagnostics must surface FRESHNESS_UNRESOLVED when that is the blocker)
10. free-text inference must not override structured / formal authority
11. Diagnostic fields grant zero execution authority
12. This Definition does not mutate PR #557
13. This Definition does not authorize Structured Gate Packet full redesign
14. This Definition does not authorize Human GO auto-generation
```

If any P0/P1 against these invariants remains after Review, return to Definition
Correction — do not proceed to Implementation Scope.

---

## 6. Evidence lineage for this Definition draft

```text
PHASE 0 freeze:
  docs/architecture/human-gate-unknown-diagnostics-v1-phase0-freeze-1.md

PHASE 1 inventory:
  docs/architecture/human-gate-unknown-diagnostics-v1-phase1-inventory-1.md

PHASE 2 classification (candidates only):
  docs/architecture/human-gate-unknown-diagnostics-v1-phase2-classification-1.md

Parent Option B:
  docs/architecture/asana-style-delegation-slice-a-definition-1.md
  docs/architecture/asana-style-delegation-slice-a-implementation-scope-1.md
```

---

## 7. IN Scope (Definition)

```text
- Diagnostic readback contract for UNKNOWN
- Closed resolution.code enum A–F
- missingInputs / ambiguousInputs / resolvedInputs / decisionCandidate diagnostics
- Fail-closed safety invariants
- Explicit OUT of Implementation / Ready / Merge / Deploy / PR #557 edits
```

---

## 8. OUT of Scope (Definition)

```text
- Implementation code changes (PHASE 7+)
- Implementation Scope document authorization (PHASE 6; separate Human GO)
- Structured Gate Packet whole-schema redesign (user PHASE 4; separate unit)
- Ready / Merge / Deploy execution
- GitHub WRITE
- Human GO automatic generation or free-text inference to GO
- Approval Ledger mutation
- Cross-repo execution
- /api/status HTTP surface
- Changing next_human_action enum to add ASK_HUMAN
- Editing or merging PR #557
```

---

## 9. Future implementation binding (informative only)

After **separate** Human Definition Lock GO, Independent Scope Review, and Human
Implementation Start GO, Implementation is expected to be limited to:

```text
1. Readback of inputs used by the Human Gate resolver
2. Readback of UNKNOWN reason code / missing / ambiguous fields
```

Proposed future function name (non-binding until Scope Lock):

```text
deriveUnknownResolution(...)
```

called when `deriveNextHumanAction` returns `UNKNOWN`, or when pilot bind fails
in a diagnostics-enabled read path.

No auto-GO. No mutation. No new Human Action enum values required for V1.

---

## 10. Independent Definition Review checklist

Reviewers MUST score each item PASS / FAIL / NOT APPLICABLE.

| ID | Check | Required |
|---|---|---|
| DR-1 | UNKNOWN remains fail-closed; diagnostics do not execute gates | Yes |
| DR-2 | NOT_PRESENT ≠ HOLD ≠ DENY ≠ GO | Yes |
| DR-3 | CI GREEN ≠ Ready; Review PASS ≠ Ready | Yes |
| DR-4 | Ready GO ≠ Merge GO ≠ Deploy GO | Yes |
| DR-5 | FRESHNESS_UNRESOLVED exists for stale-GO / HEAD drift cases | Yes |
| DR-6 | free-text inference cannot override formal tokens | Yes |
| DR-7 | decisionCandidate grants zero execution authority | Yes |
| DR-8 | ASK_HUMAN is not introduced as UNKNOWN substitute | Yes |
| DR-9 | Parent Slice-A Option B semantics are not replaced | Yes |
| DR-10 | PR #557 mutation remains OUT | Yes |
| DR-11 | Full Structured Gate Packet redesign remains OUT | Yes |
| DR-12 | resolution.code is closed enum only | Yes |
| DR-13 | PHASE 0–2 evidence is referenced and not silently rewritten as verified root cause | Yes |
| DR-14 | Implementation / Ready / Merge / Deploy remain NOT AUTHORIZED by this Definition | Yes |

Review result durable path (when executed):

```text
docs/architecture/human-gate-unknown-diagnostics-v1-definition-review-1.md
```

Flow:

```text
Independent Definition Review
  → if P0/P1: Definition Correction
  → exact Definition re-read
  → Independent Definition Re-Review
  → Human Definition Lock GO
```

---

## 11. Stop condition for this unit (PHASE 0–5)

```text
STOP after Definition is reviewable.
Do NOT start Implementation Scope without Human Definition Lock GO.
Do NOT implement code in this unit.
Do NOT mark Ready / Merge / Deploy.
```

Human next action after Review PASS:

```text
Human Definition Lock GO (separate)
```
