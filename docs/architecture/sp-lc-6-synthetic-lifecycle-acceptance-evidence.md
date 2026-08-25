# SP-LC-6 SYNTHETIC LIFECYCLE ACCEPTANCE — Implementation Evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: SP-LC-6-SYNTHETIC-LIFECYCLE-ACCEPTANCE-IMPLEMENTATION-1
Authority: #445 / Decision-SUPPORT-PLAN-LIFECYCLE-SEMANTICS-1
Locked semantics: D1=B / D2=B / D3=B / D4=A / D5=B / D6=A
Definition: SP-LC-6-SYNTHETIC-LIFECYCLE-ACCEPTANCE-DEFINITION-1
Implementation Start GO: RECEIVED
expectedMainSha: e8261761e4cff29babfa49c59c4f7de89373e48c
observedMainSha at Implementation Start preflight: e8261761e4cff29babfa49c59c4f7de89373e48c
preflightState at Implementation Start: PRECHECK_BASE_MATCH
Implementation status: IMPLEMENTED / EXECUTION EVIDENCE PENDING
Acceptance execution result: NOT YET RECORDED
Ready / Merge: NOT AUTHORIZED
Deploy / Production Binding / LIVE WRITE: FORBIDDEN
```

## 1. Exact changed-area

Implementation is limited to the three files authorized by the Human GO:

```text
tests/contracts/sp-lc-6-synthetic-lifecycle-acceptance.test.ts
scripts/acceptance/run-sp-lc-6-synthetic-lifecycle-acceptance.mjs
docs/architecture/sp-lc-6-synthetic-lifecycle-acceptance-evidence.md
```

Existing product, domain, fixture, SPFx presentation, and smoke runners remain read-only inputs.

## 2. Implementation shape

The focused contract test covers the nine Definition checkpoints without adding product capability:

| Checkpoint | Read-only evidence used by the implementation |
|---|---|
| AC-1 | existing synthetic SupportPlanVersion v2/v3 + version/procedure binding contracts |
| AC-2 | existing historical ProcedureRecord v2 projection and no-v3-fallback contract |
| AC-3 | existing D6 exact ProcedureRecord/planId/planVersion Observation association |
| AC-4 | existing unresolved historical Review material fail-closed behavior |
| AC-5 | existing D5 review anchor / caller-supplied due / calendar-month semantics |
| AC-6 | no-mutation continuation invariant over the existing Active/historical graph |
| AC-7 | existing concept-only next-version slice flags; missing executable capability remains a gap |
| AC-8 | existing fail-closed identity/version mismatch paths |
| AC-9 | existing synthetic/live-write-disabled slice boundaries plus runner no-mutation boundary |

The test also asserts the locked overall precedence:

```text
ENVIRONMENT_BLOCKED > GAP_FOUND > PASS
```

Root `tsx --test` (CI `npm test`) loads `spfx/` as CJS because the nested package.json has no `"type": "module"`. The focused test therefore unwraps CJS default exports at runtime and does not change any SPFx source.

## 3. Runner preflight

The runner records both historical Definition provenance and execution authority separately.

```text
definitionBaselineMainSha:
4dd41c4ff27265dba09b6872727cc782244715b6

expectedMainSha:
e8261761e4cff29babfa49c59c4f7de89373e48c

shaMatch:
expectedMainSha === observedMainSha
```

`definitionBaselineMainSha` is never used to decide `shaMatch`.

Observed main is resolved from, in order:

1. explicit `SP_LC_6_OBSERVED_MAIN_SHA`, when supplied by the execution environment;
2. `refs/remotes/origin/main`;
3. local `main`.

If the observed main differs from the Human-approved `expectedMainSha`, the runner returns:

```text
PRECHECK_BASE_MISMATCH_NOT_STARTED
```

and does not execute AC-1 through AC-9.

## 4. Required verification execution encoded by the runner

After `PRECHECK_BASE_MATCH`, the runner attempts all required verification inputs rather than stopping after the first failure:

```text
root focused acceptance test
root PLANNING-PC graph contract tests
root SupportPlanVersion -> Procedure binding contract tests
root ProcedureRecord contract tests
SPFx Heft test phase
spfx/smoke/planning-pc-demo-1/run-smoke.mjs
spfx/smoke/demo-ux-6/run-smoke.mjs
spfx/smoke/support-plan-review-new-version-demo-1/run-smoke.mjs
```

Missing local executables, browser tooling, or equivalent runner-environment failures are classified as `ENVIRONMENT_BLOCKED`. A verification failure that is not an environment/tool availability failure is classified as `GAP_FOUND`.

The runner emits a machine-readable JSON report containing:

```text
definitionBaselineMainSha
expectedMainSha
observedMainSha
shaMatch
preflightState
implementationStartAuthority
checkpoint id / result / source
execution command / status / result / testCount
browserSmokeResult
mutationAttempted
liveWriteAuthorized
knownGaps
overallResult
```

## 5. AC-7 is intentionally not filled by the acceptance layer

At the authorized current-main basis, the existing synthetic SupportPlan fixture exposes:

```text
conceptualNextVersion: 4
versionPersistenceAuthorized: false
draftWorkflowAuthorized: false
planMutationAuthorized: false
```

Therefore this implementation does not create a v4 fixture, enable the disabled CTA, add a persistence path, or otherwise manufacture a PASS.

When the focused acceptance evidence is executable, AC-7 is emitted as `GAP_FOUND` unless the accepted current-main capability itself changes under a later separately authorized basis.

This is the expected fail-closed behavior of the Definition, not an acceptance-harness failure.

## 6. Mutation boundary

The implementation does not authorize or perform:

```text
product/domain/fixture/schema mutation
existing smoke runner mutation
new-version implementation
continue implementation
Issue #445 mutation or close
SharePoint / M365 / Entra mutation
LIVE WRITE
Production Binding
Deploy / App Catalog
```

The runner itself only invokes local tests and the existing synthetic browser smoke runners. It records:

```text
mutationAttempted: false
liveWriteAuthorized: false
```

## 7. Execution evidence state

Implementation publication and acceptance execution are distinct evidence states.

At creation of this document:

```text
Implementation Start preflight: PASS
Harness files: IMPLEMENTED
GitHub CI on implementation HEAD: PENDING
Full acceptance runner execution: NOT YET RECORDED
Overall acceptance result: NOT YET RECORDED
```

Do not copy prior smoke PASS documents into this section as current execution evidence. The runner must be executed against the Human-authorized current-main basis, and this document must only be updated with the resulting current execution evidence.

## 8. Gate

```text
Implementation: IMPLEMENTED
Independent Implementation Review: NOT YET COMPLETE
Acceptance execution evidence: PENDING
Issue #445 mutation / close: NOT AUTHORIZED
Ready / Merge: NOT AUTHORIZED
Deploy / Production Binding / LIVE WRITE: FORBIDDEN
```
