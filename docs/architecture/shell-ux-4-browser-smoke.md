# SHELL-UX-4 — Browser smoke evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: SHELL-UX-4 / C-D — Partial-Retrieval Presentation Boundary
Kind: browser smoke
Status: PASS / VERIFIED
Date: 2026-08-11
PR: #244
Implementation Start: shell-ux-4-implementation-start.md
Selection merge: 23735d1a828068c6037d42222a27a80081e7f370（PR #243）

#28 Close: NOT AUTHORIZED
#22 adapter fetch / judgment: OUT
#21 membership / authorization truth: OUT
liveTenantIoAuthorized: false
sharePointRestAuthorized: false
binderHostWiringAuthorized: false
membershipLookupAuthorized: false
adapterFetchAuthorized: false
outcomeJudgmentAuthorized: false
```

## Method

```text
Harness: spfx/smoke/shell-ux-4/
Runner: node spfx/smoke/shell-ux-4/run-smoke.mjs
Artifacts: /opt/cursor/artifacts/shell-ux-4-browser-smoke/
```

## Results

| Case | Assertion | Result |
|---|---|---|
| partial-separated | panel + succeeded/failed sections；ready absent；warning rejects 全件正常 | PASS |
| not-collapsed-to-full-success | failed items present；no ready；no 「全件正常です」 | PASS |
| ready-still-works | ready mode still shows body；partial panel absent | PASS |
| keyboard-skip-focus | skip link focusable | PASS |
| tablet-partial | 768px keeps separated sections；ready absent | PASS |

```text
allPass: true
cases: 5 / 5
SHELL_UX_SLICE.id: SHELL-UX-4
```

## Boundary held

```text
No REST / adapter fetch
No outcome judgment / count aggregation / retry
No binder / live I/O
partial_retrieval_failed remains independent of ready / retrieval_failed
```
