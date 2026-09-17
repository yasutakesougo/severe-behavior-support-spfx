# SP-LC-6 Full Acceptance PRECHECK Gate Separation (LOCKED)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Issue: #445 (KEEP OPEN; no Issue mutation / no Close)
Unit: SP-LC-6-FULL-ACCEPTANCE-PRECHECK-GATE-SEPARATION-1
Kind: Human gate-separation lock (docs only)
Date: 2026-09-17
receivedAt: 2026-09-17T14:05:00Z
Baseline main: 4def6b8f564ffc80cb3122dd339f6f1509517554
  (#662 planning-pc stale smoke Exact Slice MERGED tip;
   ancestor includes #660 AC-4 acceptance alignment)

Gate separation: RECEIVED / CONSUMED / LOCKED
Full Acceptance PRECHECK GO: RECEIVED / CONSUMED / EXECUTED
  (later speech-act; not granted by this separation lock alone)
  Consumption: docs/architecture/sbs-445-sp-lc-6-full-acceptance-precheck-go-1.md
  Verdict: docs/architecture/sp-lc-6-full-acceptance-precheck-verdict-4def6b8f-1.md
  exactMainSha: 4def6b8f564ffc80cb3122dd339f6f1509517554
  PRECHECK: PASS
Acceptance Execution GO: NOT AUTHORIZED by this document / NOT YET
Full Acceptance re-execution: NOT AUTHORIZED by this document
Issue #445 Close / mutation: NOT AUTHORIZED
LIVE WRITE / Deploy / Production Binding: NOT AUTHORIZED
Product / smoke / acceptance-runner mutation: NOT AUTHORIZED
historical Full Acceptance rewrite: NOT AUTHORIZED
```

## Human speech-act (verbatim binding)

```text
Human:
  separate Full Acceptance PRECHECK gate (new GO required)
```

## Verdict

```text
RESULT: Full Acceptance PRECHECK = SEPARATE Human gate
PRECHECK GO: REQUIRED (new / not consumed here)
PRECHECK execution: NOT AUTHORIZED / NOT YET
Acceptance Execution GO: SEPARATE later gate (not this speech-act)
#445 Close / LIVE WRITE / Deploy: NOT YET
```

This record **separates and locks the PRECHECK gate**. It does **not** authorize
running Full Acceptance PRECHECK, and it does **not** consume a PRECHECK GO.

---

## 1. Why this separation exists

A prior Full Acceptance Re-Execution lane treated PRECHECK as free READ ONLY
with `NO HUMAN GATE CONSUMPTION`, then required only a separate Human
Acceptance Execution GO before AC-1..AC-9.

That framing is **superseded for future PRECHECKs**.

```text
SUPERSEDED (future PRECHECK only):
  Full Acceptance PRECHECK = free READ ONLY
  NO HUMAN GATE CONSUMPTION

LOCKED (this document):
  Full Acceptance PRECHECK = separate Human gate
  new Human Full Acceptance PRECHECK GO required
  PRECHECK GO ≠ Acceptance Execution GO
```

Historical PRECHECK artifacts / PASS|FAIL verdicts remain historical evidence.
They do not authorize a new PRECHECK on current main after `#662`.

---

## 2. Gate identity (do not collapse)

| Gate | Authority | Authorizes | Does not authorize |
|---|---|---|---|
| **Full Acceptance PRECHECK GO** | new Human GO (this gate) | READ ONLY readiness / residual preflight on an exact Human-bound main SHA; emit PASS / FAIL / HOLD; **STOP after verdict** | AC-1..AC-9 execution; Acceptance Execution GO consumption; `#445` Close; LIVE WRITE / Deploy; product mutation; historical rewrite |
| **Acceptance Execution GO** | separate later Human GO | Runner execution-base preflight (`PRECHECK_*` states) + AC-1..AC-9 on bound SHA; new execution evidence section | `#445` Close; LIVE WRITE / Deploy; historical GAP_FOUND rewrite; product mutation |
| **Runner `PRECHECK_*` states** | inside Acceptance Execution only | Machine SHA / authority match before checkpoints | Lane-level Full Acceptance PRECHECK gate |

```text
Full Acceptance PRECHECK GO
  ≠ Acceptance Execution GO
  ≠ runner PRECHECK_BASE_MATCH / MISMATCH / NOT_AUTHORIZED
  ≠ Fresh Independent Acceptance Review
  ≠ Human Acceptance disposition
  ≠ #445 Close
  ≠ planning-pc / AC-* Exact Slice Implementation Start
```

Naming note:

- **Full Acceptance PRECHECK** = lane-level Human-gated READ ONLY preflight.
- **Runner execution-base preflight** (`PRECHECK_EXECUTION_BASE_NOT_AUTHORIZED_NOT_STARTED` /
  `PRECHECK_BASE_MATCH` / `PRECHECK_BASE_MISMATCH_NOT_STARTED`) = Acceptance Execution
  machinery. It is not a substitute for the PRECHECK GO.

---

## 3. PRECHECK GO bind requirements (when later issued)

A future Human `Full Acceptance PRECHECK GO` must bind at least:

```text
Unit:
  SP-LC-6-FULL-ACCEPTANCE-PRECHECK-1
  (or explicit successor unit name)

Definition / parent:
  SP-LC-6-SYNTHETIC-LIFECYCLE-ACCEPTANCE-DEFINITION-1
  + this gate separation lock

expectedMainSha:
  <exact Human-approved current-main SHA at PRECHECK GO>

mode:
  READ ONLY
  NO ACCEPTANCE EXECUTION
  STOP = after PRECHECK verdict

authority:
  <non-empty Human Full Acceptance PRECHECK GO reference>
```

Do **not** infer `expectedMainSha` or PRECHECK authority from:

```text
Definition baseline main
consumed Implementation Start GO
consumed Acceptance Execution GO (prior)
observed current main alone
planning-pc Exact Slice Merge
AC-4 / AC-7 / AC-9 Merge
repository state
```

---

## 4. Authorized / forbidden under PRECHECK GO

### Authorized (only after PRECHECK GO is RECEIVED / CONSUMED)

```text
READ ONLY observation of exact bound main
Compare acceptance-layer / smoke / residual readiness against Definition
Emit machine-readable PRECHECK verdict: PASS | FAIL | HOLD
Record PRECHECK evidence (docs / artifacts) without rewriting historical tables
STOP
```

### Forbidden even with PRECHECK GO

```text
Start AC-1..AC-9 / Full Acceptance runner as execution
Set overallResult for a Full Acceptance run
Consume or imply Acceptance Execution GO
Rewrite historical GAP_FOUND / prior overallResult
Issue #445 Close / body mutation
LIVE WRITE / Deploy / Production Binding / App Catalog
Product / domain / fixture / schema / SharePoint / M365 / Entra mutation
Ready / Merge automation
```

### Forbidden without PRECHECK GO

```text
Run Full Acceptance PRECHECK (including "optional" / "free READ ONLY" framing)
Treat planning-pc Merge or AC-* Merge as PRECHECK authorization
Collapse PRECHECK into Acceptance Execution GO
```

---

## 5. Current lane position (post-#662 / post-PRECHECK / post-Execution)

```text
#660 AC-4 acceptance alignment: MERGED / CONSUMED
#662 planning-pc PROCESS-VISIBILITY stale smoke: MERGED on main 4def6b8f…
Full Acceptance PRECHECK GO @ 4def6b8f…: RECEIVED / CONSUMED / EXECUTED / PASS
Acceptance Execution GO @ 4def6b8f…: RECEIVED / CONSUMED / EXECUTED
  overallResult: PASS (evidence §16)
Fresh Independent Acceptance Review 2: REVIEW-CLEARED (execution integrity)
#445: OPEN / KEEP OPEN until separate Human Close decision

NEXT Human gate:
  1. Human Acceptance disposition     ← FIRST / NOT YET
  2. #445 Close GO                    ← SEPARATE later gate / NOT YET
PR #663 CI SUCCESS = evidence only (does not consume either gate)
  lock: docs/architecture/sbs-445-post-pass-human-gate-sequencing-lock-1.md
```

```text
planning-pc Merge ≠ Full Acceptance PRECHECK GO
PRECHECK PASS ≠ Acceptance Execution GO
Acceptance Execution PASS ≠ Human Acceptance disposition
Human Acceptance disposition ≠ #445 Close GO
PR #663 CI ≠ disposition / Close GO
```

---

## 6. Relation to existing docs

Canonical updates / readbacks that must follow this lock:

| Doc | Required reading under this lock |
|---|---|
| `sp-lc-6-synthetic-lifecycle-acceptance-definition-1.md` | PRECHECK GO is a distinct Human GO before Acceptance Execution |
| `sbs-445-ac4-*-human-merge-decision-1.md` / AC-4 Exact Slice Definition gate sequence | "Optional Preflight" is invalid; PRECHECK needs new GO |
| `sbs-445-full-acceptance-reexecution-human-acceptance-disposition-keep-open-1.md` | post-correction NEXT = PRECHECK GO, not free PRECHECK |
| `planning-pc-demo-1-process-visibility-*-exact-slice-definition-1.md` | "PRECHECK again" = separate PRECHECK GO |

---

## 7. Explicit non-claims

```text
This document does NOT:
  consume Full Acceptance PRECHECK GO
  run PRECHECK
  authorize Acceptance Execution
  declare Full Acceptance overall PASS
  clear ENVIRONMENT_BLOCKED / any residual by itself
  close or mutate #445
  Ready / Merge any PR
  Deploy / LIVE WRITE
```

---

## 8. Stop condition

```text
SP-LC-6-FULL-ACCEPTANCE-PRECHECK-GATE-SEPARATION-1
= LOCKED

PRECHECK gate: SEPARATED
PRECHECK GO @ 4def6b8f…: RECEIVED / CONSUMED / EXECUTED / PASS
Acceptance Execution GO @ 4def6b8f…: RECEIVED / CONSUMED / EXECUTED / PASS
  (separate record; not granted by this lock alone)
Fresh Independent Acceptance Review 2: REVIEW-CLEARED
Post-PASS sequencing lock: LOCKED
  docs/architecture/sbs-445-post-pass-human-gate-sequencing-lock-1.md
#445: OPEN / KEEP OPEN
Agent NEXT: STOP for Human Acceptance disposition (FIRST)
  then separate #445 Close GO (NOT automatic; CI does not consume)
```
