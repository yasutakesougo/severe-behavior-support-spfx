# SP-LC-6 SYNTHETIC LIFECYCLE ACCEPTANCE — Implementation Evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: SP-LC-6-SYNTHETIC-LIFECYCLE-ACCEPTANCE-IMPLEMENTATION-1
Authority: #445 / Decision-SUPPORT-PLAN-LIFECYCLE-SEMANTICS-1
Locked semantics: D1=B / D2=B / D3=B / D4=A / D5=B / D6=A
Definition: SP-LC-6-SYNTHETIC-LIFECYCLE-ACCEPTANCE-DEFINITION-1
Definition baseline main: 4dd41c4ff27265dba09b6872727cc782244715b6
Implementation Start GO: CONSUMED
Implementation execution basis: e8261761e4cff29babfa49c59c4f7de89373e48c
PR #510: MERGED / CONSUMED
PR #510 merge commit: be1faaf5e401f3e1fb54c0f23a79b63baa7d7833
Implementation Correction-1: APPLIED
Independent Implementation Re-Review-2: PASS / LOCKABLE
CI run #1378 / 32828078295: SUCCESS
Post-merge reconciliation: CORRECTION REQUIRED / P1=1 / P2=1
Execution-authority Correction-1 Implementation Start GO: CONSUMED
Execution-authority Correction-1 basis main: be1faaf5e401f3e1fb54c0f23a79b63baa7d7833
Execution-authority functional HEAD: 8f9c9dd5e88787bf5695b81ff8ba34018b8c1b47
Execution-authority CI run #1383 / 32831592375: SUCCESS
Execution-authority Correction-1 status: MERGED / CONSUMED
PR #511 merge commit: 29653bfcc9e0169beeabc2a13a3978eadfdc2e5f
Independent Correction Re-Review: PASS / LOCKABLE
Acceptance Evidence Recording-1 Implementation Start GO: CONSUMED
Acceptance Evidence Recording-1 basis main: 29653bfcc9e0169beeabc2a13a3978eadfdc2e5f
Acceptance Execution GO: CONSUMED
Acceptance execution preflight: PRECHECK_BASE_MATCH
Full acceptance execution: EXECUTED / overallResult = GAP_FOUND
DEMO-UX-6 REVIEW-DUE GAP CLASSIFICATION-1: RECORDED
Issue #445 mutation / close: NOT AUTHORIZED
Deploy / Production Binding / LIVE WRITE: FORBIDDEN
```

## 1. Exact changed-area

The original acceptance implementation and this execution-authority correction remain limited to the same three files:

```text
tests/contracts/sp-lc-6-synthetic-lifecycle-acceptance.test.ts
scripts/acceptance/run-sp-lc-6-synthetic-lifecycle-acceptance.mjs
docs/architecture/sp-lc-6-synthetic-lifecycle-acceptance-evidence.md
```

Existing product, domain, fixture, SPFx presentation, and smoke runners remain read-only inputs.

## 2. Acceptance checkpoint shape

The harness keeps the nine Definition checkpoints without adding product capability:

| Checkpoint | Read-only evidence / current behavior |
|---|---|
| AC-1 | existing synthetic SupportPlanVersion v2/v3 + version/procedure binding contracts |
| AC-2 | existing historical ProcedureRecord v2 projection and no-v3-fallback contract |
| AC-3 | existing D6 exact ProcedureRecord/planId/planVersion Observation association |
| AC-4 | current main has no successful-empty association status distinct from unresolved, so `GAP_FOUND` |
| AC-5 | existing D5 review anchor / caller-supplied due / calendar-month semantics |
| AC-6 | no-mutation continuation invariant over the existing Active/historical graph |
| AC-7 | concept-only next-version path; executable new-version capability absent, so `GAP_FOUND` |
| AC-8 | existing fail-closed identity/version mismatch paths |
| AC-9 | current smoke reports expose authorization flags but not write-count telemetry, so `GAP_FOUND` |

The locked overall precedence remains:

```text
ENVIRONMENT_BLOCKED > GAP_FOUND > PASS
```

Known gaps remain evidence, not reasons to manufacture fixture-only or acceptance-only product behavior.

## 3. Implementation review closure

Independent Implementation Review-1 identified two P1 findings on the original harness.

```text
P1-1 AC-4:
Current main maps a RESOLVED historical material with zero exact Observation matches
into UNRESOLVED / NO_EXACT_CONTEXT_MATCH. The acceptance layer now records this as
GAP_FOUND and does not create a successful-empty fixture-only PASS.

P1-2 AC-9:
Existing smoke reports do not expose sufficient SharePoint / M365 / Entra /
App Catalog / LIVE WRITE count telemetry. mutationAttempted is therefore not
hard-coded false. AC-9 remains GAP_FOUND unless current-main evidence exposes
sufficient write-count telemetry.
```

Correction-1 stayed inside the exact three-file boundary. Independent Implementation Re-Review-2 returned `PASS / LOCKABLE`, and CI run `32828078295` completed successfully before PR #510 was merged.

## 4. Post-merge execution authority residual

PR #510 merge advanced `main` from the implementation-start basis:

```text
implementation-start expectedMainSha:
e8261761e4cff29babfa49c59c4f7de89373e48c

post-merge main:
be1faaf5e401f3e1fb54c0f23a79b63baa7d7833
```

The merged runner still encoded the implementation-start SHA as a code constant. That was correct for the implementation-start preflight but could not accept a later Human Acceptance Execution GO bound to a newer post-merge current-main SHA.

Post-merge reconciliation therefore required a separate execution-authority correction before full acceptance execution.

## 5. Execution-authority Correction-1

The runner no longer treats an implementation-time SHA constant as future acceptance execution authority.

A later Human Acceptance Execution GO must provide both of these explicit inputs:

```text
SP_LC_6_EXPECTED_MAIN_SHA=<Human-approved current-main SHA>
SP_LC_6_ACCEPTANCE_EXECUTION_AUTHORITY=<non-empty Human Acceptance Execution GO reference>
```

The runner records these separately from historical implementation authority:

```text
implementationStartAuthority
acceptanceExecutionAuthority
```

The runner MUST NOT infer `SP_LC_6_EXPECTED_MAIN_SHA` from current `main`, the Definition baseline, the implementation-start basis, or any other repository state.

### 5.1 Missing execution authority

If either explicit execution-authority input is absent or empty, the runner returns:

```text
PRECHECK_EXECUTION_BASE_NOT_AUTHORIZED_NOT_STARTED
```

and records:

```text
checkpoints: []
overallResult: null
mutationAttempted: null
liveWriteAuthorized: null
```

AC-1 through AC-9 do not start.

### 5.2 SHA mismatch

Only after explicit execution authority exists does the runner compare:

```text
expectedMainSha === observedMainSha
```

If they differ, the runner returns:

```text
PRECHECK_BASE_MISMATCH_NOT_STARTED
```

with no acceptance checkpoint execution and no overall result.

### 5.3 SHA match

Only an explicitly authorized SHA match is eligible to proceed into AC-1 through AC-9.

This correction does not itself authorize or perform full acceptance execution.

## 6. Regression coverage

The focused contract suite includes preflight-only child-runner checks that terminate before any acceptance checkpoint execution:

```text
missing expectedMainSha
  -> PRECHECK_EXECUTION_BASE_NOT_AUTHORIZED_NOT_STARTED

missing acceptanceExecutionAuthority
  -> PRECHECK_EXECUTION_BASE_NOT_AUTHORIZED_NOT_STARTED

expectedMainSha != observedMainSha
  -> PRECHECK_BASE_MISMATCH_NOT_STARTED
```

The contract test passes only the synthetic preflight variables required for these checks; it does not inherit environment secrets. The repository contracts/domain boundary inspection therefore remains satisfied.

These tests intentionally do not exercise a matching execution authority, because a matching preflight would start the full acceptance runner and requires a separate Human Acceptance Execution GO.

## 7. Correction verification

Functional HEAD `8f9c9dd5e88787bf5695b81ff8ba34018b8c1b47` was verified by GitHub Actions run `#1383 / 32831592375`.

```text
Verify skills / UI catalog / UI templates: PASS
Semantic lint: PASS
Lint: PASS
Format: PASS
Typecheck: PASS
Root test: PASS
Contracts/domain boundaries: PASS
Scope check: PASS
Accessibility gate: PASS
Changed-lines check: PASS
SPFx production artifact exact-basis build: PASS
```

The evidence synchronization commit that records this run does not alter runner or test behavior. Its final PR HEAD is still required to pass the repository CI before Independent Correction Review.

## 8. Mutation boundary

This correction does not authorize or perform:

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
full acceptance execution
```

AC-4 / AC-7 / AC-9 remain fail-closed gaps on the currently known product/evidence basis. The correction changes only how future execution authority is supplied and recorded.

## 9. Evidence fields after correction

When a separately authorized full acceptance execution eventually occurs, the machine-readable report records at least:

```text
definitionBaselineMainSha
expectedMainSha
observedMainSha
shaMatch
preflightState
implementationStartAuthority
acceptanceExecutionAuthority
checkpoint id / result / source
execution command / status / result / testCount
browserSmokeResult
mutationAttempted
liveWriteAuthorized
knownGaps
overallResult
```

`definitionBaselineMainSha` is historical provenance only.

`implementationStartAuthority` is historical implementation provenance only.

`acceptanceExecutionAuthority` and `expectedMainSha` come from the later Human Acceptance Execution GO and are the only authority used to enter the acceptance checkpoints.

## 10. Gate

```text
PR #510 implementation: MERGED / CONSUMED
PR #511 execution-authority correction: MERGED / CONSUMED
Independent Correction Re-Review: PASS / LOCKABLE
Full acceptance execution: EXECUTED / overallResult = GAP_FOUND
DEMO-UX-6 REVIEW-DUE GAP CLASSIFICATION-1: RECORDED
Issue #445 mutation / close: NOT AUTHORIZED
Deploy / Production Binding / LIVE WRITE: FORBIDDEN
```

## 11. Full acceptance execution result

The separately authorized full acceptance execution ran under:

```text
acceptanceExecutionAuthority:
Human Acceptance Execution GO / SP-LC-6 / main 29653bfcc9e0169beeabc2a13a3978eadfdc2e5f

expectedMainSha:   29653bfcc9e0169beeabc2a13a3978eadfdc2e5f
observedMainSha:   29653bfcc9e0169beeabc2a13a3978eadfdc2e5f
shaMatch:          true
preflightState:    PRECHECK_BASE_MATCH
```

`definitionBaselineMainSha` (`4dd41c4ff27265dba09b6872727cc782244715b6`) and the consumed Implementation Start GO remain historical provenance only.

### 11.1 Checkpoint results

| Checkpoint | Result | Source |
|---|---|---|
| AC-1 | PASS | root-focused-acceptance / root-planning-graph |
| AC-2 | PASS | root-focused-acceptance / root-planning-graph |
| AC-3 | GAP_FOUND | root-focused-acceptance / spfx-heft / demo-ux-6-smoke |
| AC-4 | GAP_FOUND | root-focused-acceptance / spfx-heft / demo-ux-6-smoke |
| AC-5 | GAP_FOUND | root-focused-acceptance / spfx-heft / demo-ux-6-smoke |
| AC-6 | PASS | root-focused-acceptance / planning-pc-demo-1-smoke |
| AC-7 | GAP_FOUND | root-focused-acceptance / support-plan-review-new-version-demo-1-smoke |
| AC-8 | GAP_FOUND | root-focused-acceptance / root-planning-graph / demo-ux-6-smoke |
| AC-9 | GAP_FOUND | root-focused-acceptance / planning-pc-demo-1-smoke / demo-ux-6-smoke / support-plan-review-new-version-demo-1-smoke |

Overall result under the locked precedence `ENVIRONMENT_BLOCKED > GAP_FOUND > PASS`:

```text
ENVIRONMENT_BLOCKED count: 0
GAP_FOUND count: 6
overallResult: GAP_FOUND
```

### 11.2 Execution counts and smoke results

| Execution | Command | Exit | Result | Count |
|---|---|---|---|---|
| root-focused-acceptance | `tsx --test tests/contracts/sp-lc-6-synthetic-lifecycle-acceptance.test.ts` | 0 | PASS | 12 tests |
| root-planning-graph | `tsx --test tests/contracts/planning-pc-demo-graph-contract.test.ts tests/contracts/support-plan-version-procedure-binding-contract.test.ts tests/contracts/procedure-record-contract.test.ts` | 0 | PASS | 25 tests |
| spfx-heft | `npm run _phase:test` (cwd `spfx`) | 0 | PASS | — |
| planning-pc-demo-1-smoke | `node spfx/smoke/planning-pc-demo-1/run-smoke.mjs` | 0 | PASS | 5 cases |
| demo-ux-6-smoke | `node spfx/smoke/demo-ux-6/run-smoke.mjs` | 1 | GAP_FOUND | 9 cases |
| support-plan-review-new-version-demo-1-smoke | `node spfx/smoke/support-plan-review-new-version-demo-1/run-smoke.mjs` | 0 | PASS | 6 cases |

Browser smoke summary:

```text
planning-pc-demo-1-smoke: PASS
demo-ux-6-smoke: GAP_FOUND
support-plan-review-new-version-demo-1-smoke: PASS
```

demo-ux-6 detail: 6 of 9 checks PASS. The failing checks are `desktop-review-due-subsequent-anchor`, `desktop-review-due`, and `tablet-review-due`. All three production CSS checks (`reviewDueWidthSafety`, `stateGridDesktopColumns`, `stateGridTabletStack`) are `true`. The classification of these failures is recorded in §12.

### 11.3 Mutation boundary observations

```text
observedWriteCounts: []
mutationAttempted: null   (no write-count telemetry available)
liveWriteAuthorized: false
```

Mutation observations per smoke:

```text
planning-pc-demo-1-smoke:
  executionResult PASS / reportFound true / liveWriteAuthorized false

demo-ux-6-smoke:
  executionResult GAP_FOUND / reportFound false

support-plan-review-new-version-demo-1-smoke:
  executionResult PASS / reportFound true / liveWriteAuthorized false
```

AC-9 remains `GAP_FOUND` because no smoke report exposes SharePoint / M365 / Entra / App Catalog / LIVE WRITE count telemetry.

## 12. DEMO-UX-6 REVIEW-DUE GAP CLASSIFICATION-1

### 12.1 Classification

```text
AC-3 / AC-5 / AC-8: STALE SMOKE EXPECTATION
root cause: PR #493 / VP-1 banner copy change
AC-4 / AC-7 / AC-9: separate residuals (unchanged)
```

The AC-3 / AC-5 / AC-8 `GAP_FOUND` results derive from the demo-ux-6 smoke exit, not from a lifecycle identity-chain defect:

```text
PR #493 (feat/vp-1-demo-ui-separation-1, merge 860a15a)
  -> VP-1 compact demo safety notice (4bf1f34)
  -> VP-1 centralized demo safety copy (554085a)
  -> demo banner copy is now VP1_DEMO_SAFETY_NOTICE:
     "デモ環境｜表示内容は合成データです。保存されません。"
```

The demo-ux-6 runner's `assertReviewDueState` still requires the demo banner text to include the pre-VP-1 copy `live SharePoint 接続なし` (`spfx/smoke/demo-ux-6/run-smoke.mjs`). This stale expectation fails the three review-due presentation checks:

```text
desktop-review-due-subsequent-anchor
desktop-review-due
tablet-review-due
```

Every other observed condition in those three checks passed: items=3, reviewMaterials=2, expected state columns, `cssApplied=true`, no horizontal overflow, DEMO-UX-6 slice flag, origin/due/approaching basis copy, and zero page errors.

### 12.2 No retroactive change

The original acceptance result is not retroactively changed by this classification:

```text
acceptance-report.json (machine-readable execution result): unchanged
acceptance runner: unchanged
contract test: unchanged
demo-ux-6 smoke runner: unchanged
product/domain/fixture/schema: unchanged
```

The recorded AC-3 / AC-5 / AC-8 `GAP_FOUND` results stand as executed. This section records interpretation only. Correcting the stale smoke expectation would require mutating an existing smoke runner, which remains forbidden without a separate authorization.

### 12.3 Separate residuals

AC-4 / AC-7 / AC-9 are independent of the banner copy change and remain `GAP_FOUND` as separate residuals on the currently known product/evidence basis:

```text
AC-4:
Current main maps zero exact Observation matches to
UNRESOLVED / NO_EXACT_CONTEXT_MATCH; no successful-empty
association status exists.

AC-7:
Current authorized main exposes concept-only next-version
presentation; persistence/draft workflow remain unauthorized.

AC-9:
Existing smoke reports expose slice authorization flags but no
SharePoint / M365 / Entra / App Catalog / LIVE WRITE count telemetry.
```

These residuals are not reclassified by §12.1 and remain candidates for separate Exact Slice separation.
