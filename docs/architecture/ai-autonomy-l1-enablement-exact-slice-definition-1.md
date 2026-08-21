# AI-AUTONOMY-L1-ENABLEMENT-EXACT-SLICE-DEFINITION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: AI-AUTONOMY-L1-ENABLEMENT-EXACT-SLICE-DEFINITION-1
Kind: read-only exact-slice definition（docs-only）
Base: main@b5f7097c1213939a41b857bcdce52b0daecd2091

STATUS:
  DEFINITION CORRECTION-1 COMPLETE
  DURABLE HUMAN ENABLEMENT SELECTION A RECORDED
  DESIGNATED-LIST CLOSURE: INCLUDED ON THIS PR（pending main merge）
  READY FOR INDEPENDENT DEFINITION RE-REVIEW-1

Independent Definition Review-1:
  PR: #487
  HEAD reviewed: 4acd2b355fd777ce289aa7da7cf228fd5bfd36d6
  RESULT: FAIL / CORRECTION REQUIRED
  P0: none
  P1: 2（addressed in Correction-1）
  P2: 1（addressed in Correction-1）

Human Enablement Selection:
  BINDING STATUS: A RECEIVED（durable）
  Selection: A — Auto Ready のみ有効化
  Auto Merge: HUMAN_ONLY 継続
  authorityRef:
    https://github.com/yasutakesougo/severe-behavior-support-spfx/pull/487#issuecomment-5369935508
  supportingRun:
    https://cursor.com/agents/bc-01a02449-561f-7bd2-99ac-2f7c162fd984
    bcId: bc-01a02449-561f-7bd2-99ac-2f7c162fd984
  recordedAt: 2026-08-21T12:42:48Z
  Prior premature “A RECEIVED” claim（HEAD 4acd2b3…）: remains WITHDRAWN;
    this record supersedes it via §2.4 durable authority
  Agent recommendation ≠ Human Selection

Authorization effect of THIS document:
  NONE（Selection A ≠ Policy Mutation ≠ Implementation Start）

Implementation Start:
  NOT AUTHORIZED

Policy mutation（autonomy-policy-v1）:
  NOT AUTHORIZED by Selection alone
  BLOCKED until designated-list closure is on main（§8）
    AND a separate Human Policy Mutation GO is issued

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

Define one exact enablement slice for **L1 Auto Ready only**, under durable
Human Enablement Selection **A**.

Correction-1 removed the premature binding claim. A later Human message
declared durable Selection A for PR #487; that Selection is now recorded via
§2.4 item 1（PR comment authorityRef）.

This packet still does **not** mutate `docs/process/autonomy-policy-v1.md`,
does **not** start Ready-executor implementation, and does **not** authorize
any Ready execution. Designated-list closure edits on this PR are limited to
self-governance allowlist paths（§8）and are not Policy Mutation.

```text
Durable Human Enablement Selection A（RECORDED）
  → THIS exact-slice definition + designated-list closure（this PR）
  → Independent Definition Re-Review PASS
  → designated-list closure MERGED to main（§8 eligibility）
  → separate Human Policy Mutation GO（autonomy-policy-v1 text）
  → separate Human Implementation Start（executor / observer if any）
  → separate workflow / GitHub settings GO（if ever required）
  → Auto Ready execution only after executor exists + policy enabled
```

## 2. Human Selection provenance（Correction-1 / P1-1；Selection recorded）

### 2.1 Binding rule（LOCKED）

```text
Agent recommendation ≠ Human Selection
PR text alone ≠ Human Selection
This definition alone ≠ Human Selection
Chat paraphrase without durable reference ≠ Human Selection
```

`Human Enablement Selection: A RECEIVED` is binding only when a durable
authority reference is present and Human-attributable.

### 2.2 Prior premature claim — WITHDRAWN（historical）

PR #487 HEAD `4acd2b3…` treated Selection A as RECEIVED without durable
authority. Independent Definition Review-1 P1-1 correctly rejected that.
That premature claim remains WITHDRAWN and is not revived.

### 2.3 Durable Selection A — RECORDED

Human Enablement Selection A was established with Auto Merge HUMAN_ONLY
継続, and with explicit non-authorization of Policy Mutation /
Implementation Start by Selection alone.

```text
Selection: A — Auto Ready のみ有効化
Auto Merge: HUMAN_ONLY 継続
authorityRef（§2.4 item 1）:
  https://github.com/yasutakesougo/severe-behavior-support-spfx/pull/487#issuecomment-5369935508
supportingRun:
  https://cursor.com/agents/bc-01a02449-561f-7bd2-99ac-2f7c162fd984
  bcId: bc-01a02449-561f-7bd2-99ac-2f7c162fd984
recordedAt: 2026-08-21T12:42:48Z
BINDING STATUS: A RECEIVED（durable）
```

```text
Selection A
  ≠ policy enabled
  ≠ Policy Mutation GO
  ≠ Implementation Start
  ≠ Ready / Merge execution
```

### 2.4 What counts as durable Human Selection（LOCKED）

Exactly one of the following, Human-attributable, with explicit A/B/C/D:

1. GitHub Issue or PR comment on this repository that states
   `Human Enablement Selection: A`（or B/C/D）and Auto Merge disposition
2. Accepted / LOCKED Decision or architecture recording on `main` that cites
   the Selection and its issuer/date
3. Other Human-signed durable artifact named by an Accepted authority and
   referenced by repository path or immutable URL

Current Selection A satisfies item 1 via `authorityRef` above.

### 2.5 Exact-slice shape under Selection A

Sections §3–§15 describe the Ready-only enablement slice authorized as the
**selected definition shape** by durable Selection A. They still do not
authorize Policy Mutation or Implementation Start.

## 3. Binding authority（non-relaxable）

| Authority | Binding effect on this slice |
|---|---|
| Durable Human Enablement Selection A（RECORDED） | Ready-only enablement target; Merge stays HUMAN_ONLY |
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

## 4. Exact enablement target（LOCKED by durable Selection A）

### In scope（later Policy Mutation GO only；after §8 closure on main）

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

Closure unit（this PR includes the closure edits）:

```text
Kind: self-governance designated-list closure
Touches: definition doc list + evaluator allowlist（+ focused tests）
Ready / Merge path: HUMAN_ONLY（self-governance）
Must be MERGED to main BEFORE Policy Mutation GO becomes eligible
Closure on this branch ≠ closure on main until merge
```

Status:

```text
On this PR branch: CLOSURE EDITS INCLUDED
On main: INCOMPLETE until this PR（or equivalent）merges
If main lacks the required paths:
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
| Durable Selection not established | no Policy Mutation GO; Ready-only shape not selected |
| Policy still NOT_ENABLED / ready HUMAN_ONLY | `AUTO_READY_ALLOWED = false` |
| Designated-list closure incomplete on main | Policy Mutation GO BLOCKED |
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

| Layer | Selection A requirement | Authorized by this definition? |
|---|---|---|
| Durable Human Selection record | A + Merge HUMAN_ONLY | **YES — RECORDED**（§2.3 / PR comment） |
| Designated-list closure | §8 paths on main definition + evaluator | **PARTIAL** — edits on this PR; **main closure pending merge** |
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

## 15. Acceptance criteria（Selection recorded + closure edits）

- Durable Selection A is recorded with §2.4 authorityRef
- Prior premature A RECEIVED claim remains WITHDRAWN historically
- Ready-only / Merge-HUMAN_ONLY shape is explicit under Selection A
- Primary authority remains `docs/process/autonomy-policy-v1.md`
- Kill-switch source / observation / enforcement boundaries remain fixed（§7）
- Designated-list closure edits are included; main eligibility awaits merge（§8）
- Executor remains ABSENT / not created by this packet
- Production capability remains separated
- Selection alone causes **no** autonomy-policy-v1 enablement mutation and **no** Ready execution

## 16. Later unit sequence（eligibility ordered）

```text
0. Durable Human Enablement Selection A — RECORDED
1. Independent Definition Re-Review-1 on current HEAD
2. Designated-list closure MERGED to main（this PR’s closure edits）
3. Human Policy Mutation GO（Ready-only autonomy-policy-v1 + kill-switch fields）
   — BLOCKED until 2 is on main
4. Optional: Independent Review / Ready / Merge of that policy PR（Human）
5. Optional: Ready executor Implementation Start（separate exact slice）
6. Optional: workflow / settings GO only if policy names them
7. Auto Merge enablement: NOT in this sequence（requires Selection ≠ A）
```

Each arrow is a separate Gate. Definition Re-Review PASS ≠ designated-list
on main ≠ Policy Mutation GO ≠ Implementation Start ≠ Ready execution.

## 17. Explicit non-claims

This definition / Selection record does **not**:

- mutate `docs/process/autonomy-policy-v1.md` capability enablement
- authorize Auto Ready execution
- authorize Auto Merge enablement or execution
- create or register a Ready/Merge executor
- change GitHub settings or workflows（beyond recording Selection comment）
- authorize Deploy / LIVE WRITE / Production Binding
- close or mutate Issues
- accept or lock Decisions by Agent
- make Policy Mutation GO eligible before designated-list closure is on main

## 18. Correction closure map（Correction-1；unchanged findings）

| Finding | Severity | Correction-1 lock |
|---|---|---|
| P1-1 Selection A provenance | P1 | premature claim WITHDRAWN; durable §2.4 rule fixed; Selection A later recorded via PR comment authorityRef |
| P1-2 designated-list gap | P1 | §8 designated-list closure required on main before Policy Mutation GO; closure edits included on this PR |
| P2-1 kill-switch authority underspecified | P2 | §7 source = autonomy-policy-v1.md; observation = evaluator evidence bound to base HEAD; enforcement = evaluator deny + executor re-check; Agent cannot flip |

```text
P0 remaining: none
P1 remaining after Correction-1 text: none（pending Re-Review）
P2 remaining after Correction-1 text: none（pending Re-Review）
```

## 19. CURRENT / GATE / NEXT

```text
CURRENT
  Human Enablement Selection: A RECEIVED（durable）
  Auto Merge: HUMAN_ONLY 継続
  authorityRef: PR #487 comment 5369935508
  Exact-slice definition: CORRECTION-1 + Selection recorded
  Designated-list closure: INCLUDED ON PR / pending main merge
  Policy on main: still ACCEPTED / NOT ENABLED；ready/merge HUMAN_ONLY
  Executor: ABSENT

GATE
  Independent Definition Re-Review-1: REQUIRED
  Policy Mutation GO: BLOCKED（await designated-list on main + separate GO）
  Implementation Start: NOT AUTHORIZED
  Ready / Merge / Auto Ready / Auto Merge execution: NOT AUTHORIZED

ALLOWED now
  Definition / closure review on this PR
  read-only observation

FORBIDDEN now
  autonomy-policy-v1 enablement mutation
  GitHub settings / workflow / executor mutation
  Auto Ready / Auto Merge execution
  Deploy / LIVE WRITE / Production Binding

NEXT
  Human / Independent Reviewer:
    Re-Review-1 on current HEAD；then Human Ready/Merge of this PR
  Agent:
    STOP on Policy Mutation / Implementation Start
```
