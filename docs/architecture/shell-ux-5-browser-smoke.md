# SHELL-UX-5 — Browser smoke evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: SHELL-UX-5 / C-E — Error-code + correlationId User-Facing Display
Kind: browser smoke
Status: PASS / VERIFIED
Date: 2026-08-11
PR: #247
Implementation Start: shell-ux-5-implementation-start.md
Selection merge: 0e122228c9e47e398acc42cf0500b4a9fdb7e269（PR #246）

#28 Close: NOT AUTHORIZED
#22 error-code generation / failure classification: OUT
#21 membership / authorization truth: OUT
liveTenantIoAuthorized: false
sharePointRestAuthorized: false
binderHostWiringAuthorized: false
membershipLookupAuthorized: false
adapterFetchAuthorized: false
outcomeJudgmentAuthorized: false
errorCodeGenerationAuthorized: false
adapterFailureClassificationAuthorized: false
telemetryBackendAuthorized: false
```

## Method

```text
Harness: spfx/smoke/shell-ux-5/
Runner: node spfx/smoke/shell-ux-5/run-smoke.mjs
Artifacts: /opt/cursor/artifacts/shell-ux-5-browser-smoke/
```

## Results

| Case | Assertion | Result |
|---|---|---|
| inquiry-on-retrieval-failed | panel + error code + correlationId + copy text/button；ready absent；slice SHELL-UX-5 | PASS |
| inquiry-on-access-denied | access-denied panel + inquiry display | PASS |
| ready-hides-inquiry | ready region；inquiry / fail panel absent | PASS |
| keyboard-copy-focus | Tab reaches copy button | PASS |
| tablet-inquiry | 768px keeps inquiry fields；ready absent | PASS |

```text
allPass: true
cases: 5 / 5
SHELL_UX_SLICE.id: SHELL-UX-5
```

## Boundary held

```text
No REST / binder / live I/O
No error-code generation / failure classification / telemetry / retry
errorCode + correlationId remain presentation props only
```
