# AI-AUTONOMY-L1-ENABLEMENT-EXACT-SLICE-DEFINITION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: AI-AUTONOMY-L1-ENABLEMENT-EXACT-SLICE-DEFINITION-1
Kind: read-only exact-slice definition（docs-only）
Base: main@b5f7097c1213939a41b857bcdce52b0daecd2091

STATUS:
  DEFINITION CORRECTION-1 COMPLETE
  READY FOR INDEPENDENT DEFINITION RE-REVIEW-1

Independent Definition Review-1:
  PR: #487
  HEAD reviewed: 4acd2b355fd777ce289aa7da7cf228fd5bfd36d6
  RESULT: FAIL / CORRECTION REQUIRED
  P0: none
  P1: 2（addressed below）
  P2: 1（addressed below）

Human Enablement Selection:
  BINDING STATUS: NOT ESTABLISHED / WAITING FOR HUMAN SELECTION
  Prior “A RECEIVED” claim: WITHDRAWN as durable authority
  Candidate intent（non-binding）: A — Auto Ready のみ / Merge HUMAN_ONLY
  Agent recommendation ≠ Human Selection

Authorization effect of THIS document:
  NONE

Implementation Start:
  NOT AUTHORIZED

Policy mutation（autonomy-policy-v1）:
  NOT AUTHORIZED / BLOCKED（see §2 / §8 eligibility）

Executor / workflow / GitHub settings mutation:
  NOT AUTHORIZED

Auto Ready / Auto Merge execution:
  NOT AUTHORIZED / NOT RUN

Deploy / App Catalog / SharePoint / M365 / Entra /
LIVE WRITE / LIVE CREATE / Production Binding / Issue mutation:
  FORBIDDEN
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`../process/self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Objective

Define one exact enablement slice for **L1 Auto Ready only**, contingent on a
**durable Human Enablement Selection A**.

Correction-1 keeps the Ready-only / Merge-HUMAN_ONLY shape, but removes the
false binding that Selection A was already durable authority.

This packet does **not** mutate `docs/process/autonomy-policy-v1.md`, does
**not** start implementation, and does **not** authorize any Ready execution.

```text
WAITING FOR HUMAN SELECTION（durable）
  → IF Selection A is recorded with durable provenance
  → THIS exact-slice definition（docs-only；candidate shape already drafted）
  → Independent Definition Re-Review PASS
  → designated-list closure on main（§8；Policy Mutation eligibility）
  → separate Human Policy Mutation GO（autonomy-policy-v1 text）
  → separate Human Implementation Start（executor / observer if any）
  → separate workflow / GitHub settings GO（if ever required）
  → Auto Ready execution only after executor exists + policy enabled
```

## 2. Human Selection provenance（Correction-1 / P1-1）

### 2.1 Binding rule（LOCKED）

```text
Agent recommendation ≠ Human Selection
PR text ≠ Human Selection
This definition alone ≠ Human Selection
Chat paraphrase without durable reference ≠ Human Selection
```

`Human Enablement Selection: A RECEIVED` is **not** a binding fact unless a
durable authority reference is present and Human-attributable.

### 2.2 Prior claim — WITHDRAWN

PR #487 HEAD `4acd2b3…` treated Selection A as RECEIVED / CONFIRMED without a
durable authority reference. Independent Definition Review-1 P1-1 correctly
rejected that.

```text
Prior binding claim: WITHDRAWN
Selection gate: reopened
Policy Mutation GO: remains BLOCKED until Selection is durably established
  AND other eligibility gates in §8 / §16 pass
```

### 2.3 Non-binding candidate evidence（NOT authority）

The following is recorded only as **candidate / non-durable** context from
Cursor Cloud Agent run
`https://cursor.com/agents/bc-01a02449-561f-7bd2-99ac-2f7c162fd984`
（bcId `bc-01a02449-561f-7bd2-99ac-2f7c162fd984`）.

A Human-attributed message in that run used the wording:

```text
Human Enablement Selection:
A — Auto Ready のみ有効化

Auto Merge:
HUMAN_ONLY 継続
```

Independent Definition Review-1 treated available conversational material as
insufficient to prove durable Human Selection（recommendation / chat ambiguity
risk）. Therefore this run citation is **NOT** accepted here as binding
Selection authority.

```text
Candidate intent: A（Ready-only；Merge HUMAN_ONLY）
Authority class: NON-BINDING / INSUFFICIENT ALONE
Required next Human action: durable Selection（§2.4）
```

### 2.4 What counts as durable Human Selection（LOCKED）

Exactly one of the following, Human-attributable, with explicit A/B/C/D:

1. GitHub Issue or PR comment on this repository that states
   `Human Enablement Selection: A`（or B/C/D）and Auto Merge disposition
2. Accepted / LOCKED Decision or architecture recording on `main` that cites
   the Selection and its issuer/date
3. Other Human-signed durable artifact named by an Accepted authority and
   referenced by repository path or immutable URL

After durable Selection lands, this definition’s banner may record:

```text
Human Enablement Selection: A RECEIVED
authorityRef: <Issue/PR comment URL | Decision path@SHA | artifact ref>
issuer: <Human identity>
recordedAt: <timestamp>
```

Until then:

```text
BINDING STATUS: NOT ESTABLISHED / WAITING FOR HUMAN SELECTION
```

### 2.5 Contingent exact-slice shape

Sections §3–§15 describe the **contingent** Ready-only enablement slice that
applies **if and only if** durable Selection **A** is established. If Human
selects B/C/D instead, this contingent shape is not authorized and a new
definition correction is required.

## 3. Binding authority（non-relaxable）

| Authority | Binding effect on this slice |
|---|---|
| Durable Human Enablement Selection（when established） | Chooses A/B/C/D；contingent A shape below applies only for A |
| `docs/decisions/DEC-AI-ORG-003.md` | Human Ready/Merge boundaries remain unless a later Accepted authority explicitly changes them |
| `docs/decisions/DEC-AA-001.md` | Auto-Approval scope; no silent expansion |
| `docs/decisions/DEC-AA-003.md` | AUTO-UNTIL-GATE NOT ENABLED；Merge HUMAN-ONLY unless a later Selection ≠ A |
| `docs/process/autonomy-policy-v1.md` | PRIMARY policy + kill-switch source（§7）；still ACCEPTED / NOT ENABLED until Policy Mutation GO |
| `docs/architecture/ai-autonomy-l1-execution-policy-exact-slice-definition-1.md` | Evaluator predicates remain |
| `src/governance/ai-autonomy-l1-execution-policy.ts` | Pure decision function; does not execute Ready/Merge |
| `docs/process/self-referential-gate-policy.md` | Live Ready/Merge state is not durable repo-doc authority |

```text
Policy Accepted ≠ policy enabled
Durable Selection A ≠ policy mutation
Policy mutation ≠ Implementation Start
AUTO_READY_ALLOWED true ≠ Ready executed
AUTO_MERGE_ALLOWED must remain false while merge = HUMAN_ONLY
```

## 4. Exact enablement target（CONTINGENT on durable Selection A）

### In scope（later Policy Mutation GO only；after Selection A + §8 closure）

When a **separate** Human Policy Mutation GO is issued against this exact
slice, the intended durable policy outcome on main is:

```text
Capability: pull_request.ready
  from: HUMAN_ONLY (+ overall Policy NOT ENABLED for Ready automation)
  to:   enabled AUTO_ALLOWED for this repository/environment
        under L1 Execution Policy predicates

Capability: pull_request.merge
  remains: HUMAN_ONLY
  kill switch: L1_AUTO_MERGE stays DISABLED / not enabled

Policy enablement scope:
  Ready-only
  L1 classifier path only（via existing evaluator; not redefined here）
  production capability delta must remain NONE for allowance
```

The Policy Mutation unit MUST edit only the Git-managed primary authority
file (and any explicitly named adjacent docs required for consistency):

```text
PRIMARY mutation target（later GO）:
  docs/process/autonomy-policy-v1.md

Allowed companion docs（later GO, if needed for consistency only）:
  docs/architecture/decision-autonomy-policy-v1-selection.md
  this enablement definition（status / consumed GO recording）
  permission-matrix / DEC cross-refs ONLY if a separate Accepted Decision
  authorizes matrix alignment
```

### Out of scope / FORBIDDEN unless a different exact-slice GO says otherwise

```text
pull_request.merge → AUTO_ALLOWED
Auto Merge execution
Action Gateway merge executor creation
.github/workflows/** mutation “to make Ready work”
repository settings / branch protection / allow_auto_merge mutation
Deploy / App Catalog
SharePoint / M365 / Entra mutation
LIVE WRITE / LIVE CREATE / Production Binding
secret / permission expansion
Issue mutation / close
Decision Acceptance by Agent
weakening SELF_GOVERNANCE_OVERRIDE
Policy Mutation GO before designated-list closure（§8）
```

## 5. Enablement authority（LOCKED）

```text
PRIMARY AUTHORITY:
  docs/process/autonomy-policy-v1.md on main HEAD

Issuer:
  Human only（autonomy_policy.enable = HUMAN_ONLY）

Must bind:
  repository
  environment
  policyVersion
  enablement period / expiry if used
  exact capability set = { pull_request.ready }
  kill switch states（§7）
```

Forbidden authority sources（never sufficient）:

```text
PR body / title / description
Issue body / comments（except as durable Selection record under §2.4 item 1；
  comments still never enable policy by themselves）
caller Task Packet free-text or unchecked boolean
agent prompt / chat instruction
labels alone
CI job name alone
evaluator AUTO_READY_ALLOWED alone
this definition alone
Agent recommendation alone
```

Optional secondary observation of a trusted repository setting is allowed
**only if** the same Git-managed policy file explicitly names that setting
and the interpretation rule. Settings alone are never sufficient.

## 6. Executor boundary（LOCKED）

```text
CONFIRMED on current main:
  L1 Execution Policy evaluator = present（booleans + reasons only）
  Action Gateway Ready executor = ABSENT
  Action Gateway Merge executor = ABSENT

This definition:
  MUST NOT create either executor
  MUST NOT treat Human approval supplied to a Gateway as creating a route

Later units（each requires its own Human GO）:
  1. Policy Mutation（Ready AUTO_ALLOWED text）— after §8 closure
  2. Ready executor Implementation Start（if automation is desired）
  3. workflow / settings（only if policy names them）

Until a Ready executor exists:
  AUTO_READY_ALLOWED may become true after policy mutation
  live draft→ready GitHub mutation remains non-executable by automation
```

## 7. Kill switch authority / source / enforcement（Correction-1 / P2-1）

### 7.1 Canonical IDs

```text
L1_AUTO_READY   ∈ { ENABLED, DISABLED }
L1_AUTO_MERGE   ∈ { ENABLED, DISABLED }
```

Contingent on durable Selection A after Policy Mutation:

```text
L1_AUTO_READY  → ENABLED
L1_AUTO_MERGE  → DISABLED（must not be enabled by Selection A）
```

Until Policy Mutation GO:

```text
both treated as DISABLED / not enabled
missing or unknown → DISABLED（Fail Closed）
```

### 7.2 Source of truth（LOCKED）

```text
PRIMARY SOURCE（required）:
  Git-managed file: docs/process/autonomy-policy-v1.md
  as committed on the repository default branch（main）
  bound to the freshly observed base/main HEAD used for evaluation

Required representation inside that file（later Policy Mutation must add
if absent）:
  explicit machine-readable or unambiguously parseable fields for:
    L1_AUTO_READY = ENABLED | DISABLED
    L1_AUTO_MERGE = ENABLED | DISABLED
  plus policyVersion / enablement binding for Ready capability

SECONDARY SOURCE（optional; never sufficient alone）:
  a repository setting ONLY if the same autonomy-policy-v1.md text
  explicitly names:
    setting id
    interpretation rule
    conflict rule（policy file wins on conflict / unknown）
```

Forbidden kill-switch authority sources:

```text
PR body / labels / agent prompt / Task Packet free-text
evaluator defaults invented at runtime
executor local env vars not named by policy
chat / Cloud Agent run text
```

### 7.3 Observation boundary（LOCKED）

```text
Observer: L1 Execution Policy evaluator（and any later Ready executor
          preflight that reuses the same evidence schema）

Observation rules:
  1. Read kill-switch state from RepositoryAutonomyPolicyEvidence
     （or a dedicated killSwitch evidence object）bound to current base HEAD
  2. sourcePath must be docs/process/autonomy-policy-v1.md
  3. evidence status PASS required; MISSING/STALE/UNPARSEABLE/INDETERMINATE
     → treat as DISABLED and deny
  4. baseHeadSha on the evidence must equal freshly observed base/main HEAD
```

### 7.4 Enforcement boundary（LOCKED）

| Layer | Responsibility |
|---|---|
| Evaluator（`evaluateL1ExecutionPolicy`） | Must set `AUTO_READY_ALLOWED = false` when `L1_AUTO_READY ≠ ENABLED` or unknown; must keep `AUTO_MERGE_ALLOWED = false` when `L1_AUTO_MERGE ≠ ENABLED` or unknown; emit policy / not-enabled reasons |
| Executor（ABSENT now; later Implementation Start） | Must not mutate GitHub Ready unless evaluator result is allow **and** a fresh kill-switch observation still shows `L1_AUTO_READY = ENABLED`; must not create Merge automation under Selection A; must not flip kill switches |
| Human | Sole issuer of kill-switch transitions via Policy Mutation / disable path on the Git-managed policy file |

```text
Evaluator denies ≠ side effect
Executor ABSENT ≠ kill switch ENABLED
Agent MUST NOT flip kill switches
```

## 8. Self-governance exclusion + designated-list closure
（Correction-1 / P1-2）

### 8.1 Existing override（UNCHANGED）

```text
any changed path matching:
  src/governance/**
  tests/governance/**
  .github/workflows/**
  designated autonomy-policy files
→ AUTO_READY_ALLOWED = false
→ AUTO_MERGE_ALLOWED = false
→ SELF_GOVERNANCE_CHANGE
```

Durable Selection A / this definition MUST NOT weaken this override.

### 8.2 Designated-list closure — Policy Mutation GO eligibility（LOCKED）

```text
Policy Mutation GO eligibility REQUIRES designated-list closure on main.
Soft “SHOULD add later” is insufficient.
```

Before any Human Policy Mutation GO for Ready enablement may be issued, the
following paths MUST already appear on **both**:

1. designated autonomy-policy files list in
   `docs/architecture/ai-autonomy-l1-execution-policy-exact-slice-definition-1.md`
2. `DESIGNATED_AUTONOMY_POLICY_FILES` in
   `src/governance/ai-autonomy-l1-execution-policy.ts`

Required additions（minimum）:

```text
docs/architecture/ai-autonomy-l1-enablement-exact-slice-definition-1.md
docs/architecture/ai-autonomy-l1-execution-policy-combined-reconciliation-1.md
docs/architecture/ai-autonomy-l1-execution-policy-post-merge-reconciliation-1.md
```

Closure unit:

```text
Kind: self-governance designated-list closure
Touches: definition doc list + evaluator allowlist（+ focused tests）
Ready / Merge path: HUMAN_ONLY（self-governance）
Must merge to main BEFORE Policy Mutation GO becomes eligible
This enablement definition PR alone does NOT close the list
```

If closure is incomplete:

```text
Policy Mutation GO: BLOCKED
reason: DESIGNATED_LIST_CLOSURE_INCOMPLETE
```

## 9. Base drift / stale evidence（UNCHANGED; reaffirmed）

Pre-Merge Revalidation rules stay as defined for Merge. While Merge remains
HUMAN_ONLY, Auto Merge allowance must continue to fail on
`REPOSITORY_AUTONOMY_POLICY_HUMAN_ONLY` / NOT_ENABLED even when Ready would
pass.

For Ready enablement after Policy Mutation:

```text
Ready evidence must be bound to current PR HEAD
missing / stale / unparseable / indeterminate → AUTO_READY_ALLOWED = false
base/policy/kill-switch authority must be read from current main
  （or fresh base HEAD）
cached Selection text ≠ live policy authority
```

## 10. Audit evidence（required when Ready automation later executes）

Minimum durable fields（ALLOW and DENY）:

```text
auditId, timestamp
policyVersion, policyEnablementRef
killSwitchState（L1_AUTO_READY / L1_AUTO_MERGE）+ sourcePath + baseHeadSha
repository, PR id, currentPrHeadSha, currentBaseHeadSha
classification, gateAutonomyEligible
autoReadyAllowed, autoMergeAllowed, reasons[]
capability = pull_request.ready
decision
executor backend ID or ABSENT
selectionAuthorityRef（durable Selection record）
```

Record forbidden: secrets, tokens, credentials, personal data, production
payloads, unredacted sensitive command output.

If audit sink is unavailable before side effect: do not execute.

## 11. Failure mode（LOCKED）

| Failure | Required behavior |
|---|---|
| Durable Selection not established | no Policy Mutation GO; contingent A shape not authorized as selected |
| Policy still NOT_ENABLED / ready HUMAN_ONLY | `AUTO_READY_ALLOWED = false` |
| Designated-list closure incomplete | Policy Mutation GO BLOCKED |
| Merge path under contingent A | remain HUMAN_ONLY; no enablement |
| Self-governance path | both false |
| Kill switch source missing / unparseable | treat DISABLED; Ready false |
| Evidence stale / HEAD mismatch | Ready false |
| Executor ABSENT | no GitHub Ready mutation |
| Audit unavailable | no execution |
| productionCapabilityDelta ≠ NONE | deny |
| Attempt to enable Merge via “A side effect” | FORBIDDEN / fail closed |

## 12. Production capability separation（LOCKED）

```text
Contingent Selection A / Ready enablement
  ≠ Deploy / App Catalog
  ≠ SharePoint provision / schema / write
  ≠ LIVE WRITE / LIVE CREATE / Production Binding
  ≠ M365 / Entra mutation
  ≠ permission / secret / workflow permission expansion
  ≠ destructive operations

productionCapabilityDelta must be NONE for L1 Ready allowance
```

## 13. Required repository setting / policy changes（later GOs only）

| Layer | Contingent Selection A requirement | Authorized by this definition? |
|---|---|---|
| Durable Human Selection record | A + Merge HUMAN_ONLY | **NO** — Human Selection gate |
| Designated-list closure | §8 paths on main definition + evaluator | **NO** — separate self-governance PR |
| `docs/process/autonomy-policy-v1.md` | Ready → enabled AUTO_ALLOWED; Merge HUMAN_ONLY; kill-switch fields | **NO** — Policy Mutation GO |
| Kill switches | Ready ENABLED; Merge DISABLED | **NO** — with Policy Mutation GO |
| DEC / permission-matrix alignment | only if superseding Human Ready row | **NO** — separate Decision if needed |
| GitHub settings / `allow_auto_merge` | not required for Ready-only; never primary | **NO** |
| Branch protection / workflows | not implied | **NO** |
| Ready executor implementation | optional later | **NO** — Implementation Start |
| Merge executor | NOT in scope | **NO** |

## 14. Rollback / disable path（LOCKED）

Immediate disable after a future enablement:

```text
1. Human sets pull_request.ready → HUMAN_ONLY or NOT_ENABLED
   in docs/process/autonomy-policy-v1.md on main
OR
2. Human sets L1_AUTO_READY → DISABLED in the same policy file
   （primary kill-switch source）

Effect:
  evaluator observation on fresh base/main HEAD denies Ready
  executor（if present）must fail closed on re-check
  no cached Ready-time allow survives disable
```

Disable does **not** require deleting the classifier or L1 execution policy
code.

## 15. Acceptance criteria（Correction-1）

- Binding Selection A claim is WITHDRAWN until durable provenance exists
- Candidate chat/run evidence is explicitly NON-BINDING
- Contingent Ready-only / Merge-HUMAN_ONLY shape remains explicit
- Primary authority remains `docs/process/autonomy-policy-v1.md`
- Kill-switch source / observation / enforcement boundaries are fixed（§7）
- Designated-list closure is a hard Policy Mutation GO eligibility gate（§8）
- Executor remains ABSENT / not created by this packet
- Production capability remains separated
- This definition alone causes **no** policy text change and **no** Ready execution

## 16. Later unit sequence（not started；eligibility ordered）

```text
0. Durable Human Enablement Selection（A/B/C/D）— WAITING
1. Independent Definition Re-Review-1 on Correction-1
2. IF Selection A: self-governance designated-list closure PR → main
3. Human Policy Mutation GO（Ready-only autonomy-policy-v1 + kill-switch fields）
   — BLOCKED until 0=A and 2 complete
4. Optional: Independent Review / Ready / Merge of that policy PR（Human）
5. Optional: Ready executor Implementation Start（separate exact slice）
6. Optional: workflow / settings GO only if policy names them
7. Auto Merge enablement: NOT in this sequence（requires Selection ≠ A）
```

Each arrow is a separate Gate. Definition Re-Review PASS ≠ Selection ≠
designated-list closure ≠ Policy Mutation GO ≠ Implementation Start ≠
Ready execution.

## 17. Explicit non-claims

This definition does **not**:

- establish durable Human Enablement Selection A
- mutate `docs/process/autonomy-policy-v1.md`
- close the self-governance designated list by itself
- enable AUTO-1 globally
- authorize Auto Ready execution
- authorize Auto Merge enablement or execution
- create or register a Ready/Merge executor
- change GitHub settings or workflows
- authorize Deploy / LIVE WRITE / Production Binding
- close or mutate Issues
- accept or lock Decisions by Agent

## 18. Correction closure map（Correction-1）

| Finding | Severity | Correction-1 lock |
|---|---|---|
| P1-1 Selection A provenance | P1 | §2 binding claim WITHDRAWN; Selection gate reopened; durable authority rule fixed; candidate run evidence NON-BINDING |
| P1-2 designated-list gap | P1 | §8 designated-list closure required on main before Policy Mutation GO eligibility |
| P2-1 kill-switch authority underspecified | P2 | §7 source = autonomy-policy-v1.md; observation = evaluator evidence bound to base HEAD; enforcement = evaluator deny + executor re-check; Agent cannot flip |

```text
P0 remaining: none
P1 remaining after Correction-1 text: none（pending Re-Review）
P2 remaining after Correction-1 text: none（pending Re-Review）
```

## 19. CURRENT / GATE / NEXT（Correction-1）

```text
CURRENT
  Human Enablement Selection: WAITING（binding A WITHDRAWN）
  Candidate intent: A（NON-BINDING）
  Exact-slice definition: CORRECTION-1 COMPLETE
  Policy on main: still ACCEPTED / NOT ENABLED；ready/merge HUMAN_ONLY
  Designated-list closure: INCOMPLETE
  Executor: ABSENT

GATE
  Independent Definition Re-Review-1: REQUIRED
  Durable Human Selection: WAITING
  Policy Mutation GO: BLOCKED
  Implementation Start: NOT AUTHORIZED
  Ready / Merge / Auto Ready / Auto Merge execution: NOT AUTHORIZED

ALLOWED now
  docs-only Correction-1 review
  Human durable Selection recording
  read-only observation

FORBIDDEN now
  treating candidate chat as Selection A
  autonomy-policy-v1 mutation
  GitHub settings / workflow / executor mutation
  Auto Ready / Auto Merge execution
  Deploy / LIVE WRITE / Production Binding

NEXT
  Human:
    1. Durable Enablement Selection（A/B/C/D）per §2.4
    2. Independent Definition Re-Review-1 on Correction-1
  Agent:
    STOP on Policy Mutation / Implementation Start
```
