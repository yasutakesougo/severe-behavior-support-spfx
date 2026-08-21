# AI-AUTONOMY-L1-EXECUTION-POLICY-EXACT-SLICE-DEFINITION-1

```text
AI-AUTONOMY-L1-EXECUTION-POLICY-EXACT-SLICE-DEFINITION-1

RECORD CLASS:
HISTORICAL SNAPSHOT / definition-time authority
This STATUS banner records Definition Correction-2 publication state only.
It is NOT the current combined PR #484 authorization / scope record.
Current combined state:
  docs/architecture/ai-autonomy-l1-execution-policy-combined-reconciliation-1.md

STATUS（definition-time）:
DEFINITION CORRECTION-2 COMPLETE
READY FOR INDEPENDENT DEFINITION RE-REVIEW-3
（or final confirmation after Re-Review-2 PASS + P2 typo closed）

BASE:
main@0123cb7b8e15fe897bfee80cdf4f9954d8575891

UNIT:
AI-AUTONOMY-L1-EXECUTION-POLICY-EXACT-SLICE-1

KIND（definition-time）:
read-only exact-slice definition（docs-only at publication）

PRIOR REVIEW:
AI-AUTONOMY-L1-EXECUTION-POLICY-INDEPENDENT-DEFINITION-RE-REVIEW-2
PR: #484
HEAD reviewed: 8bb3805e08962cfa64734c5cb7be7955716f3ad2
RESULT: PASS
P0: none
P1: none
P2: 1 non-blocking cross-reference typo（addressed in Correction-2）

Prior Review-1:
FAIL / CORRECTION REQUIRED（consumed by Correction-1）
P1: 2 CLOSED
P2: 2 CLOSED

Classifier / Gate Evaluator prerequisite:
MERGED via PR #482
HEAD consumed into main@0123cb7b8e15fe897bfee80cdf4f9954d8575891

Implementation Start（definition-time snapshot）:
NOT AUTHORIZED

Auto Ready（definition-time snapshot）:
NOT AUTHORIZED

Auto Merge（definition-time snapshot）:
NOT AUTHORIZED

GitHub mutation（definition-time snapshot）:
NOT AUTHORIZED / NOT RUN

Deploy / App Catalog / SharePoint / M365 / Entra /
LIVE WRITE / LIVE CREATE / Production Binding / Issue mutation:
FORBIDDEN
```

## 1. Objective

Define one exact implementation slice for an **L1 Execution Policy evaluator**:
a pure, fail-closed decision function that, given Classifier / Gate Evaluator
outputs plus freshly observed repository evidence, returns whether
`AUTO_READY_ALLOWED` and/or `AUTO_MERGE_ALLOWED` may be true.

This definition does **not** authorize Implementation Start, does **not**
enable autonomy policy, and does **not** authorize any GitHub Ready / Merge /
settings mutation.

```text
Classifier / Gate Evaluator（MERGED）
  → L1 + autonomyEligible
  → L1 Execution Policy evaluator（THIS SLICE — definition only）
  → AUTO_READY_ALLOWED / AUTO_MERGE_ALLOWED（booleans + reasons）
  → separate Human enablement + Implementation Start（NOT this doc）
  → separate executor（NOT this doc; currently ABSENT / HUMAN_ONLY）
```

## 2. Binding authority（non-relaxable）

| Authority | Binding effect on this slice |
|---|---|
| `docs/decisions/DEC-AI-ORG-003.md` | Human Ready / Merge / production boundaries remain Human-only unless a later Accepted authority explicitly changes them |
| `docs/decisions/DEC-AA-001.md` | Auto-Approval scope; no silent expansion |
| `docs/decisions/DEC-AA-003.md` | AUTO-UNTIL-GATE remains NOT ENABLED; Ready / Merge HUMAN-ONLY |
| `docs/process/autonomy-policy-v1.md` | AUTO-1 ACCEPTED / **NOT ENABLED**; `pull_request.ready` / `pull_request.merge` = `HUMAN_ONLY` |
| `src/governance/ai-autonomy-classifier-gate-evaluator.ts` | L1/L2/L3/UNKNOWN classifier + `autonomyEligible` gate（PR #482 MERGED） |
| `docs/process/self-referential-gate-policy.md` | Live Ready / Merge state is not durable repo-doc authority |

```text
Policy Accepted ≠ policy enabled
Policy enabled ≠ Auto Ready authorized
Auto Ready allowed by evaluator ≠ Ready executed
Auto Merge allowed by evaluator ≠ Merge executed
This definition ≠ Implementation Start
This definition ≠ capability enablement
```

## 3. Relationship to Classifier（Correction-1 / P1-1）

Classifier path risk and Gate Evaluator `autonomyEligible` are **inputs**, not
sufficient authority for Auto Ready / Auto Merge.

Observed Classifier behavior on current main（must not be contradicted by
assuming path-only L2/L3 for all governance tests）:

```text
src/**            → path risk L2（includes src/governance/**）
tests/**          → path risk L1（includes tests/governance/**）
.github/workflows/** → path risk L3
```

Therefore `tests/governance/**` alone can classify as L1 under the current
Classifier. Execution Policy MUST NOT rely on Classifier L-level alone to
block self-governance changes.

### SELF-GOVERNANCE OVERRIDE（LOCKED）

If **any** changed path matches the self-governance surface below, then:

```text
AUTO_READY_ALLOWED = false
AUTO_MERGE_ALLOWED = false
reason += SELF_GOVERNANCE_CHANGE
```

This override applies **regardless of Classifier result**（including L1）and
regardless of Gate Evaluator `autonomyEligible`.

Self-governance surface（any match → override）:

```text
src/governance/**
tests/governance/**
.github/workflows/**
designated autonomy-policy files（below / this section）
```

Designated autonomy-policy files（initial fixed list; this section）:

```text
docs/process/autonomy-policy-v1.md
docs/architecture/decision-autonomy-policy-v1-selection.md
docs/architecture/ai-autonomy-l1-execution-policy-exact-slice-definition-1.md
docs/decisions/DEC-AA-001.md
docs/decisions/DEC-AA-003.md
docs/decisions/DEC-AI-ORG-003.md
docs/process/low-auto-pilot-v1.md
docs/process/routine-aug-v1.md
docs/process/fast-lane-v1.md
docs/process/process-optimization-v1.md
docs/process/self-referential-gate-policy.md
```

Expanding this list is itself a self-governance change and remains under this
override.

## 4. Outputs

```text
AUTO_READY_ALLOWED: boolean
AUTO_MERGE_ALLOWED: boolean
reasons: ordered unique reason codes（deny-closed）
```

Default / fail-closed:

```text
missing input → both false
indeterminate evidence → both false
UNKNOWN classification → both false
autonomyEligible = false → both false
SELF_GOVERNANCE_CHANGE → both false
repository autonomy policy not enabled for the capability → both false
```

`AUTO_MERGE_ALLOWED` additionally requires every Pre-Merge Revalidation check
（§9）to PASS on freshly observed evidence.

## 5. Approved integration branch（Correction-1 / P2-1）

Initial implementation **hard-allowlists** a single integration branch:

```text
APPROVED_INTEGRATION_BRANCHES = { "main" }
```

```text
base branch ∉ APPROVED_INTEGRATION_BRANCHES
  → AUTO_READY_ALLOWED = false
  → AUTO_MERGE_ALLOWED = false
  → reason += INTEGRATION_BRANCH_NOT_ALLOWED
```

No other branch name may be accepted from PR body, caller input, labels, or
agent prompt. A future expansion of the allowlist requires an Accepted /
LOCKED definition correction and remains a self-governance change.

## 6. Repository autonomy policy authority（Correction-1 / P2-2）

The claim
`repository policy explicitly allows autonomous Ready / Merge`
has **one primary authority source**:

```text
PRIMARY AUTHORITY（required）:
  Git-managed fixed policy file
  docs/process/autonomy-policy-v1.md
  as committed on the repository default branch（main）
```

Reading rules（LOCKED）:

1. Observe the policy file content bound to **current main HEAD**（or the
   freshly observed base HEAD used for Pre-Merge Revalidation）.
2. `AUTO_READY_ALLOWED` requires the policy file to show that
   `pull_request.ready` is an enabled `AUTO_ALLOWED` capability for this
   repository/environment — not merely described as a future candidate.
3. `AUTO_MERGE_ALLOWED` requires the same for `pull_request.merge`.
4. Current Accepted state is **ACCEPTED / NOT ENABLED** and both capabilities
   are `HUMAN_ONLY`. While that remains true, both outputs MUST be `false`
   with `reason += REPOSITORY_AUTONOMY_POLICY_NOT_ENABLED`（and/or
   `REPOSITORY_AUTONOMY_POLICY_HUMAN_ONLY`）.
5. Optional secondary observation of a trusted repository setting is allowed
   **only if** the same Git-managed policy file explicitly names that setting
   and the interpretation rule. Settings alone are never sufficient.
6. **Forbidden authority sources**（never sufficient, never primary）:
   - PR body / title / description
   - Issue body / comments
   - caller Task Packet free-text or unchecked boolean
   - agent prompt / chat instruction
   - labels alone
   - CI job name alone

```text
PR text ≠ policy authority
caller input ≠ policy authority
Policy Accepted ≠ policy enabled
HUMAN_ONLY ≠ AUTO_ALLOWED
```

## 7. Auto Ready evaluation（definition only）

`AUTO_READY_ALLOWED = true` only when **all** are true:

1. Classifier result = `L1`
2. Gate Evaluator `autonomyEligible = true` for current PR HEAD
3. Self-governance override does **not** fire（§3）
4. Base branch ∈ `APPROVED_INTEGRATION_BRANCHES`（§5）
5. Repository autonomy policy authority allows autonomous Ready（§6）
6. Required evidence bundle is present, parseable, determinate, and bound to
   **current PR HEAD**
7. Required CI = PASS on current PR HEAD
8. Independent review cleared on current PR HEAD（P0 = 0, P1 = 0）
9. Unresolved review threads = 0（when the review surface exposes threads）
10. Production capability delta = `NONE`
11. Rollback evidence PASS and HEAD-bound
12. No reason code from the deny set below is present

Otherwise `AUTO_READY_ALLOWED = false`.

This boolean does **not** execute Ready.

## 8. Auto Merge evaluation（definition only）

`AUTO_MERGE_ALLOWED = true` only when **all** are true:

1. `AUTO_READY_ALLOWED` would evaluate true on the same fresh evidence set
2. Repository autonomy policy authority allows autonomous Merge（§6）
3. Pre-Merge Revalidation（§9）PASSes in full
4. No deny reason is present

Otherwise `AUTO_MERGE_ALLOWED = false`.

This boolean does **not** execute Merge.

## 9. PRE-MERGE REVALIDATION（Correction-1 / P1-2）

`base HEAD drift policy satisfied` is **not** a standalone predicate.
Before any Auto Merge allowance may be true, the evaluator MUST freshly
re-observe and bind the following evidence. Cached Ready-time evidence is
insufficient when base HEAD, PR HEAD, CI, review, mergeability, or policy
enablement may have changed.

### Required fresh observations（merge-imminent）

| Observation | Fail-closed rule |
|---|---|
| current PR HEAD SHA | Must equal the HEAD that all same-HEAD evidence claims; else deny |
| current base HEAD SHA（integration branch tip） | Must be freshly observed at revalidation time |
| mergeable == true | `false` / `unknown` / null → deny |
| required CI | Still PASS on current PR HEAD; missing/stale/unparseable/indeterminate → deny |
| review state | Still cleared on current PR HEAD; P0/P1 must remain 0 |
| unresolved review threads | Must be 0; unknown → deny |
| execution policy re-evaluation | Re-run full Auto Ready + Auto Merge predicates on the fresh set |
| repository autonomy policy still enabled | Re-read §6 authority on freshly observed base/main HEAD |

### Base drift meaning change（LOCKED）

If base HEAD advanced after Ready-time evidence was collected:

```text
same-HEAD evidence that is only meaningful relative to a prior base
  → STALE or INDETERMINATE
  → AUTO_MERGE_ALLOWED = false
  → reason += BASE_HEAD_DRIFTED and/or EVIDENCE_STALE
```

Required response:

1. Re-acquire PR HEAD, base HEAD, mergeability, CI, review, threads, and
   policy enablement; then
2. Re-evaluate execution policy; or
3. Fail closed（do not allow Auto Merge）.

Any stale / missing / unparseable / indeterminate evidence at Pre-Merge
Revalidation:

```text
AUTO_MERGE_ALLOWED = false
```

## 10. Reason codes（initial closed union）

Deny / annotation codes the slice may emit（implementation must use a fixed
union; unknown → deny）:

```text
CLASS_NOT_L1
GATE_NOT_ELIGIBLE
SELF_GOVERNANCE_CHANGE
INTEGRATION_BRANCH_NOT_ALLOWED
REPOSITORY_AUTONOMY_POLICY_NOT_ENABLED
REPOSITORY_AUTONOMY_POLICY_HUMAN_ONLY
REPOSITORY_AUTONOMY_POLICY_AUTHORITY_UNAVAILABLE
CI_NOT_GREEN
REVIEW_NOT_CLEARED
UNRESOLVED_THREADS_PRESENT
HEAD_EVIDENCE_MISMATCH
EVIDENCE_MISSING
EVIDENCE_STALE
EVIDENCE_UNPARSEABLE
EVIDENCE_INDETERMINATE
BASE_HEAD_DRIFTED
MERGEABILITY_NOT_TRUE
PRE_MERGE_REVALIDATION_FAILED
PRODUCTION_CAPABILITY_DELTA_PRESENT
PRODUCTION_CAPABILITY_DELTA_UNKNOWN
ROLLBACK_UNAVAILABLE
```

## 11. Changed-area candidates（Implementation Start later）

Candidate paths only. This definition does **not** authorize mutation.

```text
src/governance/
  L1 execution-policy evaluator module（pure functions / types）
  or additive exports adjacent to the existing classifier/gate evaluator

tests/governance/
  focused unit tests for override, authority source, branch allowlist,
  and pre-merge revalidation fail-closed cases
```

Forbidden in this slice even after a future Implementation Start unless a
separate exact-slice GO says otherwise:

```text
.github/workflows/** mutation as part of “making Auto Merge work”
repository settings / branch protection / allow_auto_merge mutation
GitHub Ready / Merge execution
Issue mutation
Deploy / App Catalog / SharePoint / M365 / Entra / LIVE WRITE /
LIVE CREATE / Production Binding
```

Note: implementing under `src/governance/**` or `tests/governance/**` means
PRs that change those paths are themselves self-governance changes and must
remain Auto Ready / Auto Merge denied by §3.

## 12. Acceptance criteria

- SELF_GOVERNANCE_OVERRIDE fires on any matching path independent of Classifier L-level.
- `tests/governance/**`-only changes cannot become Auto Ready / Auto Merge allowed via L1 classification alone.
- Approved integration branch is exactly `main` unless a later Accepted correction expands the allowlist.
- Autonomous Ready / Merge enablement is read only from the Git-managed policy file（§6）; PR/caller text never authorizes it.
- While AUTO-1 remains NOT ENABLED / HUMAN_ONLY for Ready/Merge, both outputs remain false.
- Pre-Merge Revalidation re-fetches PR HEAD, base HEAD, mergeability, CI, review, threads, re-evaluates policy, and fail-closes on stale/missing/indeterminate evidence.
- Base HEAD advance after Ready-time evidence invalidates merge allowance until revalidation PASSes.
- Evaluator returns booleans + reason codes only; it does not perform GitHub mutation.
- Definition ≠ Implementation Start ≠ policy enablement ≠ Auto Ready/Merge execution.

## 13. Required tests（when Implementation Start is later authorized）

- self-governance path matrix: `src/governance/**`, `tests/governance/**`,
  `.github/workflows/**`, each designated policy file → both false +
  `SELF_GOVERNANCE_CHANGE`
- Classifier L1 + `tests/governance/**` → still both false
- base branch not `main` → `INTEGRATION_BRANCH_NOT_ALLOWED`
- policy file NOT ENABLED / HUMAN_ONLY → both false with policy reasons
- forbidden authority sources（PR body / caller boolean）ignored
- Pre-Merge: PR HEAD mismatch / base drift / mergeable≠true / CI not PASS /
  review not cleared / unresolved threads / stale evidence →
  `AUTO_MERGE_ALLOWED = false`
- happy-path fixture may return true **only** when synthetic policy enablement
  + all predicates are explicitly satisfied in-test（does not enable live policy）

## 14. Explicitly out of scope / FORBIDDEN now

```text
Implementation Start
code / test mutation under this PR（definition publication only）
policy enablement
AUTO_UNTIL_GATE enablement
automatic Ready execution
automatic Merge execution
branch protection / repository settings / allow_auto_merge changes
Deploy / App Catalog
SharePoint / M365 / Entra mutation
LIVE WRITE / LIVE CREATE
Production Binding
Issue mutation
Decision Acceptance by Agent
```

## 15. Correction closure map

### Correction-1（consumed by Re-Review-2 PASS）

| Finding | Severity | Correction-1 lock |
|---|---|---|
| P1-1 self-governance vs Classifier mismatch | P1 | §3 SELF-GOVERNANCE OVERRIDE independent of Classifier |
| P1-2 Auto Merge base drift underspecified | P1 | §9 PRE-MERGE REVALIDATION + base-drift stale rule |
| P2-1 approved integration branch undefined | P2 | §5 `main`-only allowlist |
| P2-2 autonomy policy authority undefined | P2 | §6 Git-managed `docs/process/autonomy-policy-v1.md` primary authority; PR/caller forbidden |

### Correction-2（Re-Review-2 P2 typo）

| Finding | Severity | Correction-2 lock |
|---|---|---|
| P2 cross-reference typo: self-governance list pointed at §7 | P2 | §3 list now says `（below / this section）`; designated-files heading clarifies `this section` |

```text
P0 remaining: none
P1 remaining: none
P2 remaining after Correction-2 text: none（pending final confirmation）
```

## 16. Authorization status / NEXT

```text
CURRENT
L1 Execution Policy Definition:
CORRECTION-2 APPLIED / AWAITING FINAL DEFINITION CONFIRMATION
（Re-Review-2 PASS; P2 typo closed in Correction-2）
P0: none
P1: none
P2: typo addressed in text / pending confirmation
Implementation Start eligibility: READY FOR HUMAN GO
  （after Correction-2 confirmation; GO itself remains Human-only）
Implementation Start: NOT AUTHORIZED
Auto Ready: NOT AUTHORIZED / NOT ENABLED
Auto Merge: NOT AUTHORIZED / NOT ENABLED
Ready / Merge: NOT AUTHORIZED
GitHub mutation: NOT RUN

NEXT
Human / Independent Reviewer:
  confirm Correction-2 closes the Re-Review-2 P2 typo on this PR HEAD
  then Human may issue Implementation Start GO separately

Agent:
  no Implementation Start without explicit Human GO
  no GitHub Ready / Merge
  no policy enablement
  STOP after publishing Correction-2
```

## 17. Review target identity

```text
path:
  docs/architecture/ai-autonomy-l1-execution-policy-exact-slice-definition-1.md
unit:
  AI-AUTONOMY-L1-EXECUTION-POLICY-EXACT-SLICE-1
correction:
  DEFINITION CORRECTION-2
purpose:
  close Re-Review-2 non-blocking cross-reference typo（docs-only）
```
