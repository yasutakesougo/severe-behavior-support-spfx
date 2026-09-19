# AI-AUTONOMY-L1-READY-EXECUTOR-EXACT-SLICE-DEFINITION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: AI-AUTONOMY-L1-READY-EXECUTOR-EXACT-SLICE-1
Kind: exact-slice definition + Implementation Start consumption（Ready executor only）
Base: main@99cd48971d96937973f3cfd9a6fadf9e796f6d12

STATUS:
  EXACT-SLICE LOCKED UNDER HUMAN IMPLEMENTATION START GO
  Implementation Start: AUTHORIZED / CONSUMED（this unit）
  Auto Merge: NOT AUTHORIZED（Selection A / HUMAN_ONLY）
  workflow / GitHub settings mutation: NOT AUTHORIZED
  Deploy / LIVE WRITE / LIVE CREATE / Production Binding: FORBIDDEN
  Live Auto Ready execution against production PRs in this GO: NOT AUTHORIZED
    （code + injected-port tests only；no workflow wiring；no live draft→ready）

authorityRef:
  cursor-cloud-agent:bc-01a0247c-c027-73ed-a571-05581bc45bf1
  Human message: Ready Executor Implementation Start GO
  Agent plan: exact-slice固定 → executor実装 → tests → independent review → STOP

Prerequisites CONFIRMED on main:
  L1 Execution Policy evaluator（#484）
  Ready-only enablement Selection A + designated-list closure（#487）
  Ready-only Policy Mutation（#488）→ pull_request.ready=AUTO_ALLOWED；
    L1_AUTO_READY=ENABLED；merge=HUMAN_ONLY；L1_AUTO_MERGE=DISABLED
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`../process/self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Objective

Lock and implement one exact slice for the **L1 Ready executor**:
a fail-closed Action Gateway–style adapter for capability `pull_request.ready`
that may invoke an **injected** draft→ready mutation port only when:

1. `evaluateL1ExecutionPolicy` returns `autoReadyAllowed = true` on fresh evidence
2. a **fresh** kill-switch observation still shows `L1_AUTO_READY = ENABLED`
3. audit sink accepts durable PREPARED audit before side effect
4. mode is explicitly `execute`（`dry_run` never mutates）

```text
Classifier / Gate Evaluator
  → L1 Execution Policy evaluator（booleans + reasons）
  → THIS Ready executor（orchestration + injected mutation port）
  → draft→ready side effect ONLY when all gates pass
```

This unit does **not** authorize Auto Merge, workflow mutation, GitHub settings
mutation, Deploy, LIVE WRITE / LIVE CREATE, or Production Binding.

## 2. Binding authority（non-relaxable）

| Authority | Binding effect |
|---|---|
| Human Ready Executor Implementation Start GO（this run） | Authorizes this exact-slice definition + Ready executor code/tests |
| Durable Selection A | Ready-only；Merge stays HUMAN_ONLY |
| `docs/process/autonomy-policy-v1.md` | Primary policy + kill-switch source；Ready AUTO_ALLOWED under L1_AUTO_READY |
| `docs/architecture/ai-autonomy-l1-enablement-exact-slice-definition-1.md` | Enablement / executor boundary / audit / kill-switch rules |
| `docs/architecture/ai-autonomy-l1-execution-policy-exact-slice-definition-1.md` | Evaluator predicates remain |
| `src/governance/ai-autonomy-l1-execution-policy.ts` | Pure decision function；does not execute Ready |
| `docs/decisions/DEC-AI-ORG-003.md` | Human boundaries unless Accepted authority changes them |
| `docs/decisions/DEC-AA-001.md` / `DEC-AA-003.md` | Auto-Approval / AUTO-UNTIL-GATE scope；no silent expansion |

```text
Policy Accepted ≠ Implementation Start
Ready-only enablement ≠ Ready executed
AUTO_READY_ALLOWED true ≠ Ready executed
Implementation Start ≠ workflow wiring ≠ live production Ready runs
This slice ≠ Auto Merge enablement
```

## 3. Exact scope（LOCKED）

### In scope

```text
docs/architecture/ai-autonomy-l1-ready-executor-exact-slice-definition-1.md
src/governance/ai-autonomy-l1-ready-executor.ts
tests/governance/ai-autonomy-l1-ready-executor.test.ts
DESIGNATED_AUTONOMY_POLICY_FILES / definition designated-list add of this path
docs/process/autonomy-policy-v1.md consistency:
  readyExecutor binding → L1_READY_EXECUTOR_V1
  Implementation line for Ready executor consumed（workflow/settings still HOLD）
adjacent Selection / enablement status lines only if required for consistency
```

Executor behavior（LOCKED）:

```text
backendId = L1_READY_EXECUTOR_V1
capability = pull_request.ready ONLY
modes = dry_run | execute（missing/unknown mode → DENY）
inputs = L1ExecutionPolicyInput + fresh KillSwitchEvidence + PR identity
  + AuditSink + ReadyMutationPort
steps =
  1. validate mode / target / audit sink availability
  2. evaluateL1ExecutionPolicy(input)
  3. re-check kill switch evidence（fresh；sourcePath + baseHeadSha bind）
  4. if deny → durable DENY audit；return；no mutation
  5. if dry_run → durable DRY_RUN audit；return；no mutation
  6. if execute → durable PREPARED audit；then call ReadyMutationPort
  7. durable EXECUTED or EXECUTION_FAILED audit
idempotency = if PR already non-draft → NO_OP success；no second mutation
```

### Out of scope / FORBIDDEN

```text
pull_request.merge / Auto Merge executor / L1_AUTO_MERGE enablement
.github/workflows/** mutation
repository settings / branch protection / allow_auto_merge mutation
Deploy / App Catalog
SharePoint / M365 / Entra mutation
LIVE WRITE / LIVE CREATE / Production Binding
Issue mutation / close
Decision Acceptance by Agent
Ready / Merge of this self-governance PR by automation
full Action Gateway / Capability Registry / Task Packet Schema
flipping kill switches
calling live GitHub Ready APIs from agent CI without a separate live-execution GO
```

## 4. Kill-switch re-check（LOCKED）

```text
PRIMARY SOURCE:
  docs/process/autonomy-policy-v1.md on freshly observed base/main HEAD

Required KillSwitchEvidence:
  status = PASS
  sourcePath = docs/process/autonomy-policy-v1.md
  baseHeadSha = currentBaseHeadSha from the Ready evaluation evidence
  l1AutoReady = ENABLED
  l1AutoMerge observed but MUST NOT authorize Merge（Selection A）

Fail closed when:
  missing / stale / unparseable / indeterminate
  sourcePath mismatch
  baseHeadSha mismatch
  l1AutoReady ≠ ENABLED
```

```text
Evaluator allow ∧ kill switch ENABLED ∧ mode=execute ∧ audit OK
  → mutation port may run
Otherwise → no mutation
```

## 5. Audit evidence（LOCKED）

Minimum durable fields（ALLOW / DENY / DRY_RUN / EXECUTED / FAILED）:

```text
auditId, timestamp, decision
policyVersion / enablement binding refs when available
killSwitchState（L1_AUTO_READY / L1_AUTO_MERGE）+ sourcePath + baseHeadSha
repository, PR number, currentPrHeadSha, currentBaseHeadSha
autoReadyAllowed, autoMergeAllowed, reasons[]
capability = pull_request.ready
executor backend ID = L1_READY_EXECUTOR_V1
mode = dry_run | execute
mutationAttempted = boolean
```

Forbidden in audit: secrets, tokens, credentials, personal data, production
payloads, unredacted sensitive command output.

If audit sink is unavailable before side effect: do not execute.

## 6. Self-governance note

Paths under `src/governance/**`, `tests/governance/**`, designated autonomy-policy
files, and this definition remain **SELF_GOVERNANCE_CHANGE**. PRs that land this
slice stay Auto Ready / Auto Merge denied by the L1 Execution Policy evaluator.
Human Ready / Merge only.

## 7. Acceptance criteria

- Exact-slice IN/OUT locked as above
- Executor never mutates on `dry_run` or deny paths
- Executor never implements Merge
- Fresh kill-switch re-check is mandatory before `execute`
- Focused unit tests cover allow dry_run, deny paths, kill-switch fail-closed,
  already-ready NO_OP, audit-unavailable deny, and merge-port absence
- Policy binding `readyExecutor` becomes `L1_READY_EXECUTOR_V1`（present code）
- No `.github/workflows/**` or settings mutation in this PR
- Independent Review P0 = 0 / P1 = 0 before Human Ready consideration
- Agent STOP after review；no Auto Merge；no live production Ready runs under this GO

## 8. Required tests

| Case | Expected |
|---|---|
| all predicates pass + kill switch ENABLED + dry_run | decision DRY_RUN；mutationAttempted=false |
| all predicates pass + kill switch ENABLED + execute | PREPARED then mutation；EXECUTED |
| autoReadyAllowed false | DENY；no mutation |
| kill switch DISABLED / UNKNOWN / status≠PASS / sourcePath mismatch / base mismatch | DENY；no mutation |
| audit sink unavailable | DENY / AUDIT_UNAVAILABLE；no mutation |
| PR already ready（not draft） | NO_OP；no mutation |
| merge capability requested | DENY / FORBIDDEN_CAPABILITY（no merge port） |
| mode missing / unknown | DENY |
| execute without ReadyMutationPort | EXECUTION_FAILED；no mutation |

## 9. Authorization snapshot / NEXT

```text
Implementation Start GO: CONSUMED（Ready executor exact-slice）
readyExecutor: L1_READY_EXECUTOR_V1（code present after land）
mergeExecutor: ABSENT
Auto Merge: NOT AUTHORIZED
workflow / GitHub settings: NOT AUTHORIZED
live production Ready execution: NOT AUTHORIZED by this GO
Deploy / LIVE WRITE / Production Binding: FORBIDDEN

NEXT after this PR:
  Independent Review → Human Ready/Merge（self-governance）
  optional later: workflow wiring GO / live execution GO（separate）
  Auto Merge: requires Selection ≠ A + separate GOs
```
