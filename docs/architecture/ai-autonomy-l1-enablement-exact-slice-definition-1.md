# AI-AUTONOMY-L1-ENABLEMENT-EXACT-SLICE-DEFINITION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: AI-AUTONOMY-L1-ENABLEMENT-EXACT-SLICE-DEFINITION-1
Kind: read-only exact-slice definition（docs-only）
Base: main@b5f7097c1213939a41b857bcdce52b0daecd2091

Human Enablement Selection:
  RECEIVED — A（Auto Ready のみ有効化）
  Auto Merge: HUMAN_ONLY 継続

STATUS:
  DEFINITION PUBLISHED / READY FOR INDEPENDENT DEFINITION REVIEW

Authorization effect of THIS document:
  NONE

Implementation Start:
  NOT AUTHORIZED

Policy mutation（autonomy-policy-v1）:
  NOT AUTHORIZED by this definition

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

Fix one exact enablement slice for **L1 Auto Ready only**, after Human
Enablement Selection **A**.

This packet records:

1. that Selection A was received
2. what must change later for Ready enablement to become real
3. what must remain HUMAN_ONLY / ABSENT / FORBIDDEN
4. the acceptance and fail-closed rules for the later policy-mutation unit

This packet does **not** mutate `docs/process/autonomy-policy-v1.md`, does
**not** start implementation, and does **not** authorize any Ready execution.

```text
Human Enablement Selection A（RECEIVED）
  → THIS exact-slice definition（docs-only）
  → Independent Definition Review
  → separate Human Policy Mutation GO（autonomy-policy-v1 text）
  → separate Human Implementation Start（executor / observer if any）
  → separate workflow / GitHub settings GO（if ever required）
  → Auto Ready execution only after executor exists + policy enabled
```

## 2. Consumed Human Selection（CONFIRMED）

```text
Selection: A — Auto Ready のみ有効化
Auto Merge: HUMAN_ONLY 継続
Candidates not selected: B, C, D
Current default before Selection: D（state only; superseded as selection target）
```

Effect of Selection alone:

```text
Selection A
  ≠ policy enabled
  ≠ pull_request.ready already AUTO_ALLOWED on main
  ≠ executor present
  ≠ Ready may be executed
  ≠ Auto Merge enablement
  ≠ DEC-AI-ORG-003 / DEC-AA-001 / DEC-AA-003 superseded
```

## 3. Binding authority（non-relaxable）

| Authority | Binding effect on this slice |
|---|---|
| Human Enablement Selection A | Ready-only enablement target; Merge stays HUMAN_ONLY |
| `docs/decisions/DEC-AI-ORG-003.md` | Human Ready/Merge boundaries remain unless a later Accepted authority explicitly changes them |
| `docs/decisions/DEC-AA-001.md` | Auto-Approval scope; no silent expansion |
| `docs/decisions/DEC-AA-003.md` | AUTO-UNTIL-GATE NOT ENABLED; Merge HUMAN-ONLY retained by Selection A |
| `docs/process/autonomy-policy-v1.md` | PRIMARY policy authority; still ACCEPTED / NOT ENABLED until a later Policy Mutation GO |
| `docs/architecture/ai-autonomy-l1-execution-policy-exact-slice-definition-1.md` | Evaluator predicates remain; enablement only changes policy authority inputs |
| `src/governance/ai-autonomy-l1-execution-policy.ts` | Pure decision function; does not execute Ready/Merge |
| `docs/process/self-referential-gate-policy.md` | Live Ready/Merge state is not durable repo-doc authority |

```text
Policy Accepted ≠ policy enabled
Selection A ≠ policy mutation
Policy mutation ≠ Implementation Start
AUTO_READY_ALLOWED true ≠ Ready executed
AUTO_MERGE_ALLOWED must remain false while merge = HUMAN_ONLY
```

## 4. Exact enablement target（LOCKED by Selection A）

### In scope（later Policy Mutation GO only）

When a **separate** Human Policy Mutation GO is issued against this exact
slice, the intended durable policy outcome on main is:

```text
Capability: pull_request.ready
  from: HUMAN_ONLY (+ overall Policy NOT ENABLED for Ready automation)
  to:   enabled AUTO_ALLOWED for this repository/environment
        under L1 Execution Policy predicates

Capability: pull_request.merge
  remains: HUMAN_ONLY
  kill switch: L1_AUTO_MERGE_DISABLED（or equivalent）stays DISABLED / not enabled

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

### Out of scope / FORBIDDEN in this definition and in the later Ready
enablement unit unless a different exact-slice GO says otherwise

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
Issue body / comments
caller Task Packet free-text or unchecked boolean
agent prompt / chat instruction
labels alone
CI job name alone
evaluator AUTO_READY_ALLOWED alone
Human Selection recording alone（this doc）
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

Selection A / this definition:
  MUST NOT create either executor
  MUST NOT treat Human approval supplied to a Gateway as creating a route

Later units（each requires its own Human GO）:
  1. Policy Mutation（Ready AUTO_ALLOWED text）
  2. Ready executor Implementation Start（if automation is desired）
  3. workflow / settings（only if policy names them）

Until a Ready executor exists:
  AUTO_READY_ALLOWED may become true after policy mutation
  live draft→ready GitHub mutation remains non-executable by automation
```

## 7. Kill switch（LOCKED proposal for later Policy Mutation）

```text
L1_AUTO_READY:
  target after Policy Mutation GO under Selection A = ENABLED
  until that GO = DISABLED / not enabled

L1_AUTO_MERGE:
  remains DISABLED / not enabled
  Selection A forbids enabling this switch

Fail Closed:
  missing / unknown kill switch state → Ready not enabled
  Agent MUST NOT flip kill switches
```

Inherited AUTO-1 kill-switch / POLICY_NOT_ENABLED semantics remain in force.

## 8. Self-governance exclusion（UNCHANGED）

Existing L1 Execution Policy override remains mandatory:

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

Selection A MUST NOT weaken this override. Expanding the designated file
list is itself a self-governance change and stays Human-only.

This definition file SHOULD be added to the designated autonomy-policy
files list in a later self-governance-aware correction（separate GO）; until
then, changes to this file remain Human Ready/Merge path by process, and
any PR that also touches `src/governance/**` / designated files is already
denied by the evaluator.

## 9. Base drift / stale evidence（UNCHANGED; reaffirmed）

Pre-Merge Revalidation rules stay as defined for Merge. Under Selection A,
Merge remains HUMAN_ONLY, so Auto Merge allowance must continue to fail on
`REPOSITORY_AUTONOMY_POLICY_HUMAN_ONLY` / NOT_ENABLED even when Ready would
pass.

For Ready enablement after Policy Mutation:

```text
Ready evidence must be bound to current PR HEAD
missing / stale / unparseable / indeterminate → AUTO_READY_ALLOWED = false
base/policy authority must be read from current main（or fresh base HEAD）
cached Selection text ≠ live policy authority
```

## 10. Audit evidence（required when Ready automation later executes）

Minimum durable fields（ALLOW and DENY）:

```text
auditId, timestamp
policyVersion, policyEnablementRef, killSwitchState（ready/merge）
repository, PR id, currentPrHeadSha, currentBaseHeadSha
classification, gateAutonomyEligible
autoReadyAllowed, autoMergeAllowed, reasons[]
capability = pull_request.ready
decision
executor backend ID or ABSENT
```

Record forbidden: secrets, tokens, credentials, personal data, production
payloads, unredacted sensitive command output.

If audit sink is unavailable before side effect: do not execute.

## 11. Failure mode（LOCKED）

| Failure | Required behavior |
|---|---|
| Policy still NOT_ENABLED / ready HUMAN_ONLY | `AUTO_READY_ALLOWED = false` |
| Merge path requested under Selection A | remain HUMAN_ONLY; no enablement |
| Self-governance path | both false |
| Evidence stale / HEAD mismatch | Ready false |
| Executor ABSENT | no GitHub Ready mutation |
| Audit unavailable | no execution |
| productionCapabilityDelta ≠ NONE | deny |
| Kill switch Ready not ENABLED | deny |
| Attempt to enable Merge via “A side effect” | FORBIDDEN / fail closed |

## 12. Production capability separation（LOCKED）

```text
Selection A / Ready enablement
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
| `docs/process/autonomy-policy-v1.md` | Ready → enabled AUTO_ALLOWED; Merge stays HUMAN_ONLY; Policy enablement for Ready | **NO** — needs Policy Mutation GO |
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
2. Human sets L1_AUTO_READY kill switch → DISABLED

Effect:
  next evaluator observation on fresh base/main HEAD denies Ready
  in-flight automation must fail closed on revalidation
  no cached Ready-time allow survives disable
```

Disable does **not** require deleting the classifier or L1 execution policy
code.

## 15. Acceptance criteria（this definition）

- Human Selection A is recorded as RECEIVED; B/C/D are not selected
- Ready-only enablement target is explicit; Merge remains HUMAN_ONLY
- Primary authority remains `docs/process/autonomy-policy-v1.md`
- Forbidden authority sources are listed
- Executor remains ABSENT / not created by this packet
- Self-governance exclusion is unchanged
- Production capability remains separated
- Rollback and kill switch paths are defined
- This definition alone causes **no** policy text change and **no** Ready execution
- Independent Definition Review can judge the packet without Implementation Start

## 16. Later unit sequence（not started）

```text
1. Independent Definition Review on this packet
2. Human Policy Mutation GO（exact Ready-only autonomy-policy-v1 edit）
3. Optional: Independent Review / Ready / Merge of that policy PR（Human）
4. Optional: Ready executor Implementation Start（separate exact slice）
5. Optional: workflow / settings GO only if policy names them
6. Auto Merge enablement: NOT in this sequence（requires new Selection ≠ A）
```

Each arrow is a separate Gate. Definition Review PASS ≠ Policy Mutation GO ≠
Implementation Start ≠ Ready execution.

## 17. Explicit non-claims

This definition does **not**:

- mutate `docs/process/autonomy-policy-v1.md`
- enable AUTO-1 globally
- authorize Auto Ready execution
- authorize Auto Merge enablement or execution
- create or register a Ready/Merge executor
- change GitHub settings or workflows
- authorize Deploy / LIVE WRITE / Production Binding
- close or mutate Issues
- accept or lock Decisions by Agent

## 18. CURRENT / GATE / NEXT（definition-time）

```text
CURRENT
  Human Enablement Selection: A RECEIVED
  Auto Merge: HUMAN_ONLY 継続
  Exact-slice definition: PUBLISHED（this document）
  Policy on main: still ACCEPTED / NOT ENABLED；ready/merge HUMAN_ONLY
  Executor: ABSENT

GATE
  Independent Definition Review: REQUIRED
  Policy Mutation GO: NOT YET
  Implementation Start: NOT AUTHORIZED

ALLOWED now
  docs-only definition review
  read-only observation of main policy / evaluator

FORBIDDEN now
  autonomy-policy-v1 mutation
  GitHub settings / workflow / executor mutation
  Auto Ready / Auto Merge execution
  Deploy / LIVE WRITE / Production Binding

NEXT
  Human / Independent Reviewer:
    Definition Review on this packet
  Agent:
    STOP on policy mutation / Implementation Start until explicit GO
```
