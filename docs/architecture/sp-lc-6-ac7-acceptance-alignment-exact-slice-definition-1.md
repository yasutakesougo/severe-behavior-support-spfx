# SP-LC-6 AC-7 ACCEPTANCE-ALIGNMENT EXACT-SLICE-DEFINITION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Issue: #445 (parent acceptance residual; no Issue mutation / no Close)
Unit: SP-LC-6-AC-7-ACCEPTANCE-ALIGNMENT-EXACT-SLICE-DEFINITION-1
Kind: exact-slice definition / scope fixation only
Date: 2026-09-17
Baseline main: cd8949d7323efaefc3987451f3b2ed3bb20c84cc
Authority inputs:
  Human AC-7 Exact Residual Classification Decision
    B / STALE ACCEPTANCE / EVIDENCE GAP
    ACCEPTED / LOCKED / CONSUMED
    docs/architecture/sbs-445-ac7-exact-residual-classification-lock-1.md
  READ ONLY AC-7 Exact Residual Re-pin
    current main cd8949d7323efaefc3987451f3b2ed3bb20c84cc
  sp-lc-6-synthetic-lifecycle-acceptance-definition-1.md
    AC-7 = executable new-version behavior on existing product/domain path
    concept-only display / test-only v4 fixture ≠ PASS
    future implementation changed-area = acceptance layer 3 files
  sp-lc-6-synthetic-lifecycle-acceptance-evidence.md
    historical AC-7 GAP_FOUND PRESERVED
  SUPPORT-PLAN-REVIEW-NEW-VERSION-DEMO-1
    draftWorkflowAuthorized=false remains DEMO-1 presentation-only
  SBS-MGMT-LOOP-B (#553 / PR #576) + activation session path
    CHANGE_REQUIRED → RevisionIntent → Draft vN+1 → explicit Human Apply
  #419 / Decision-SUPPORT-PLAN-LIFECYCLE-SEMANTICS-1
    D1=B / D2=B / D3=B / D4=A / D5=B / D6=A LOCKED

Exact Slice Definition status: APPROVED / LOCKED
Classification lock: CONSUMED / LOCKED (B)
Definition APPROVE: RECEIVED / LOCKED
  Human: AC-7 acceptance-alignment Exact Slice
         Human Definition APPROVE
  ReceivedAt: 2026-09-17T06:21:00Z
  Basis: this document
  Scope: AC-7 acceptance alignment ONLY
  Consumption: docs/architecture/sbs-445-ac7-exact-slice-definition-approve-1.md
Human Implementation Start GO: RECEIVED / CONSUMED
  Human: AC-7 acceptance alignment ONLY に明示的に紐づく
         別個の Human Implementation Start GO
  ReceivedAt: 2026-09-17T06:29:00Z
  Bound: approved §5–§7
  Consumption: docs/architecture/sbs-445-ac7-exact-slice-implementation-start-1.md
Acceptance contract rewrite: AUTHORIZED for §5 three files only
Product / domain / fixture / schema mutation: NOT AUTHORIZED
Issue #445 mutation / Close: NOT AUTHORIZED
Ready / Merge: HOLD
Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
Acceptance re-execution: NOT AUTHORIZED
historical GAP_FOUND rewrite: NOT AUTHORIZED
AC-9: OUT OF SCOPE (remain ACTIVE / OPEN)
```

## 1. Exact objective

Re-bind SP-LC-6 **AC-7** to current-main executable synthetic new-version
capability, without adding product behavior and without treating DEMO-1
presentation-only flags as AC-7 capability authority.

```text
Purpose:
  close the AC-7 acceptance/evidence drift
  by aligning the AC-7 checkpoint with existing current-main behavior

MUST establish:
  1. AC-7 meaning remains executable synthetic new-version (not LIVE persistence)
  2. DEMO-1 draftWorkflowAuthorized=false stays valid for DEMO-1 only
  3. current AC-7 capability authority is the LOOP-B / domain revision path
  4. exact PASS bind targets for a later alignment Implementation Start
  5. historical Full Acceptance GAP_FOUND remains preserved
  6. no product / persistence / AC-9 / #445 Close work in this slice
```

This Exact Slice remediates **AC-7 acceptance alignment only**. It does not
claim Full Acceptance PASS, does not rewrite historical `GAP_FOUND`, and does
not close `#445`.

Human `Definition APPROVE` for this document is **RECEIVED / LOCKED /
CONSUMED**. Human `Implementation Start GO` for AC-7 acceptance
alignment ONLY is **RECEIVED / CONSUMED** and is bound to §5–§7.

## 2. Authority / do not redecide

```text
Parent acceptance Definition:
  docs/architecture/sp-lc-6-synthetic-lifecycle-acceptance-definition-1.md
  AC-7 New-version outcome:
    Review後に「変更」を選ぶ場合、旧SupportPlanVersionを保持したまま
    新versionへ進むbehaviorを既存product/domain pathで証明できること
    次版の概念表示だけでは PASS としない
    テスト専用 v4 fixture 追加だけでは PASS としない

Classification lock (consumed):
  docs/architecture/sbs-445-ac7-exact-residual-classification-lock-1.md
  B = STALE ACCEPTANCE / EVIDENCE GAP
  AC-7 does not require LIVE persistence
  DEMO-1 flags ≠ current AC-7 capability authority

Locked lifecycle selections (unchanged):
  D1=B / D2=B / D3=B / D4=A / D5=B / D6=A
```

```text
OUT of authority for this slice:
  AC-7 product implementation (new revision/draft/apply capability)
  enabling DEMO-1 create-cta
  flipping DEMO-1 draftWorkflowAuthorized / versionPersistenceAuthorized
  AC-9 write-count telemetry
  persistence / LIVE WRITE / Deploy
  Acceptance re-execution
  historical GAP_FOUND rewrite
  #445 Close
```

## 3. Exact current tip semantics (drift, not product absence)

### 3.1 Current-main capability (CONFIRMED; do not re-implement)

On baseline `cd8949d7323efaefc3987451f3b2ed3bb20c84cc`:

```text
domain:
  src/domain/support-plan-revision.ts
    SUPPORT_PLAN_REVISION_LIVE_WRITE_AUTHORIZED = false
    startSupportPlanRevision
      CHANGE_REQUIRED → RevisionIntent → Draft candidate version N+1
    fail-closed:
      SOURCE_BINDING_MISMATCH
      REVISION_ALREADY_STARTED / ALREADY_STARTED
      TARGET_VERSION_CONFLICT
      DUPLICATE_INTENT_STATE
    source SupportPlan.currentVersion is not advanced by draft start

Planning-PC adapter:
  spfx/src/shell/users/support-plan-revision-start.ts
    startSyntheticPlanningPcRevision
    session-only existingIntents / existingDrafts
    LIVE WRITE remains false

UI:
  spfx/src/shell/users/SupportPlan.tsx
    CHANGE_REQUIRED + reason → handleRevisionStart
    Draft held in session
    explicit handleActivationApply (no auto-apply)

Evidence already on main:
  tests/domain/support-plan-revision.test.ts
    v3 currentVersion untouched; composed start → Draft v4 STARTED
  spfx/src/shell/users/support-plan-revision-start.test.ts
    v3 → Draft v4 = STARTED / Synthetic / session-only / No LIVE WRITE
  docs/architecture/sbs-mgmt-loop-b-browser-smoke.md
    start-revision CTA executable
    DEMO-1 create-cta remains present and disabled (B12-R4 / B12-R5)
```

### 3.2 Stale AC-7 detector (CONFIRMED drift)

```text
tests/contracts/sp-lc-6-synthetic-lifecycle-acceptance.test.ts
  AC-7 still:
    SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.versionPersistenceAuthorized
    OR draftWorkflowAuthorized
    → else GAP_FOUND

scripts/acceptance/run-sp-lc-6-synthetic-lifecycle-acceptance.mjs
  AC-7 still:
    source = support-plan-review-new-version-demo-1-smoke
    forced GAP via gapUnlessEnvironmentBlocked
    note = concept-only; persistence/draft workflow unauthorized

DEMO-1 slice flags (still true as DEMO-1 boundaries):
  presentationOnly = true
  draftWorkflowAuthorized = false
  versionPersistenceAuthorized = false
```

```text
DRIFT:
  DEMO-1 remains a valid concept-only presentation slice
  LOOP-B / domain already supplies executable Draft N+1
  AC-7 harness still treats DEMO-1 flags as the only capability detector
  → GAP_FOUND is acceptance/evidence drift on current main
  → not an established missing product path
```

Historical Full Acceptance recorded that GAP against then-authorized main.
That executed result stays **PRESERVED**. This slice does not rewrite it.

## 4. Exact target semantics (alignment)

### 4.1 AC-7 PASS meaning (normative for this slice)

After this consumed Human Implementation Start GO binds this **APPROVED /
LOCKED** definition, AC-7 PASS requires all of:

```text
1. Existing product/domain path executes new-version start
   CHANGE_REQUIRED → RevisionIntent → Draft vN+1
   status STARTED or ALREADY_STARTED

2. Source SupportPlanVersion / SupportPlan.currentVersion remain unmutated
   by draft start (old version kept)

3. Historical versions are not overwritten; N+1 is a separate draft candidate

4. Synthetic / session-only boundary held
   SUPPORT_PLAN_REVISION_LIVE_WRITE_AUTHORIZED = false
   no SharePoint / M365 / Entra write

5. Explicit Human Apply remains a separate step
   auto-apply is not introduced

6. DEMO-1 presentation-only flags remain false
   they are not flipped to manufacture PASS
```

```text
NOT required for AC-7 PASS in this slice:
  LIVE SupportPlanVersion persistence
  DEMO-1 create-cta enablement
  draftWorkflowAuthorized = true on DEMO-1
  Full Acceptance overallResult PASS
  AC-9 telemetry keys
```

### 4.2 DEMO-1 relationship (unchanged slice)

```text
KEEP:
  SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.draftWorkflowAuthorized = false
  versionPersistenceAuthorized = false
  DEMO-1 create-cta disabled

Meaning:
  DEMO-1 continues to prove concept presentation only
  It is evidence that concept-only ≠ AC-7 capability
  It is not the AC-7 capability authority after classification lock B
```

### 4.3 Forbidden inferences

```text
FORBIDDEN:
  treating conceptualNextVersion fixture as executable new-version
  adding a test-only v4 fixture to hide missing start
  flipping DEMO-1 authorization flags to force PASS
  implementing new product revision/draft/apply behavior
  requiring LIVE WRITE to satisfy AC-7
  rewriting historical acceptance-report GAP_FOUND to PASS
  consuming AC-9 in this slice
  closing #445 because AC-7 detector would locally PASS
```

## 5. Changed-area (bound by consumed Implementation Start GO)

Parent SP-LC-6 acceptance layer bound the implementation publication surface
to these three files; alignment stays inside that envelope.

```text
IN (acceptance alignment only):
  tests/contracts/sp-lc-6-synthetic-lifecycle-acceptance.test.ts
    AC-7 checkpoint re-bind to current-main executable path
    DEMO-1 flags asserted still false (slice boundary, not GAP detector)
  scripts/acceptance/run-sp-lc-6-synthetic-lifecycle-acceptance.mjs
    AC-7 source/note re-bind
    DEMO-1 smoke may remain as concept-only observation
    existing LOOP-B / domain evidence may be read-only inputs
  docs/architecture/sp-lc-6-synthetic-lifecycle-acceptance-evidence.md
    record alignment interpretation / current-main bind
    do NOT rewrite historical executed GAP_FOUND tables as PASS
```

```text
READ-ONLY inputs (do not mutate in this slice):
  src/domain/support-plan-revision.ts
  src/domain/support-plan-activation.ts
  spfx/src/shell/users/support-plan-revision-start.ts
  spfx/src/shell/users/SupportPlan.tsx
  spfx/src/shell/users/support-plan-fixture.ts
    SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE flags
  spfx/smoke/support-plan-review-new-version-demo-1/**
  spfx/smoke/sbs-mgmt-loop-b/**
  existing domain / SPFx unit tests for revision start
```

```text
NOT candidates (explicit):
  new revision/draft/apply product code
  DEMO-1 create-cta enablement / draftWorkflowAuthorized flip
  AC-9 write-count / liveWriteCount telemetry
  acceptance-report.json historical rewrite / Full Acceptance re-run
  schema / DTO / SharePoint / M365 / Entra / Deploy paths
  Issue #445 body / Close / labels
```

## 6. Acceptance criteria (bound by consumed Implementation Start GO)

This consumed Human `Implementation Start GO` binds this **APPROVED / LOCKED**
definition:

### Semantics

- AC-7 contract checkpoint observes executable Draft N+1 start on current-main
  domain/Planning-PC path (`STARTED` / `ALREADY_STARTED`, candidate version =
  source + 1).
- Source `currentVersion` is unchanged by start.
- `SUPPORT_PLAN_REVISION_LIVE_WRITE_AUTHORIZED` remains `false`.
- DEMO-1 `draftWorkflowAuthorized` / `versionPersistenceAuthorized` remain
  `false`.
- Explicit Apply remains a separate existing session path; this slice does not
  add auto-apply.

### Observability

- AC-7 GAP detector is no longer “DEMO-1 flags false ⇒ GAP_FOUND”.
- Runner AC-7 note no longer claims executable draft workflow is absent on
  current main.
- Historical Full Acceptance evidence sections remain labeled historical /
  preserved.

### Scope discipline

- Diff stays inside the Implementation Start GO changed-area list derived from
  §5 (the three acceptance-layer files).
- No product/domain/SPFx/smoke-harness mutation.
- No persistence / LIVE WRITE / Deploy / App Catalog.
- No Issue `#445` Close / body mutation.
- Historical Full Acceptance `overallResult = GAP_FOUND` is **not**
  retroactively rewritten.
- Full Acceptance re-execution remains **NOT AUTHORIZED** without a separate
  Human Acceptance Execution GO.
- Local AC-7 contract checkpoint may flip to the aligned PASS condition as
  slice evidence; that is **not** Full Acceptance re-execution and does **not**
  close `#445`.

## 7. Explicit OUT / MUST NOT

```text
AC-7 product implementation
AC-9 work
authorize persistence
authorize LIVE WRITE
authorize Deploy / App Catalog / Production Binding
authorize Acceptance re-execution
rewrite historical GAP_FOUND checkpoints to PASS in acceptance-report
close #445
flip DEMO-1 draftWorkflowAuthorized / versionPersistenceAuthorized
enable DEMO-1 create-cta
treat conceptualNextVersion as executable new-version
schema / SharePoint column / DTO redesign
Ready / Merge automation from this definition alone
treat this Definition APPROVE as Implementation Start
```

## 8. Why this Exact Slice is minimal

```text
CONFIRMED residual:
  AC-7 harness bound to stale DEMO-1 flags
  while executable Draft N+1 already exists on current main

CONFIRMED already delivered (do not redo):
  RevisionIntent / Draft N+1 domain start
  Planning-PC startSyntheticPlanningPcRevision
  UI start + explicit Apply
  LIVE WRITE false
  LOOP-B B12 start-revision evidence

Scope discipline:
  AC-7 acceptance alignment only
  three acceptance-layer files
  product / DEMO-1 / AC-9 parked
```

## 9. Relation to Full Acceptance / #445 disposition

```text
This Exact Slice (after this Implementation Start + evidence):
  may remediate the AC-7 acceptance/evidence drift

It does NOT by itself:
  flip Full Acceptance overallResult
  remediate AC-9
  make #445 close-eligible
  authorize Acceptance re-execution
  authorize persistence

#445 remains KEEP OPEN until Human decides residual disposition
after AC-7 alignment (and remaining AC-9) handling.
```

## 10. Rollback boundary

If a later Implementation Start is authorized and then rolled back, rollback
is limited to restoring the three acceptance-layer files in §5.

Rollback must not:

- enable persistence / LIVE WRITE / Deploy;
- rewrite SP-LC-6 acceptance-report.json historical results;
- mutate product revision/draft/apply code;
- flip DEMO-1 slice flags;
- mutate AC-9 surfaces;
- Close or edit Issue `#445`.

Safe rollback state = current baseline AC-7 detector
(DEMO-1 flags false ⇒ `GAP_FOUND`).

## 11. Gate

```text
Classification lock:
  CONSUMED / LOCKED
  B / STALE ACCEPTANCE / EVIDENCE GAP
  docs/architecture/sbs-445-ac7-exact-residual-classification-lock-1.md

Exact Slice Definition / scope fixation:
  COMPLETE / APPROVED / LOCKED

Human gate 1:
  Exact Slice Definition APPROVE = RECEIVED / LOCKED
  Human speech-act:
    AC-7 acceptance-alignment Exact Slice
    Human Definition APPROVE
  Scope locked: AC-7 acceptance alignment ONLY
  Bind targets locked: §1–§7 of this document
  Consumption:
    docs/architecture/sbs-445-ac7-exact-slice-definition-approve-1.md

Human gate 2:
  Implementation Start GO = RECEIVED / CONSUMED
  Scope locked: AC-7 acceptance alignment ONLY
  Bound changed-area: §5 three acceptance-layer files
  Product / domain / SPFx / DEMO-1 mutation = NOT AUTHORIZED

Still forbidden without separate Human GO:
  AC-7 product implementation
  AC-9 work
  persistence
  LIVE WRITE
  Deploy / App Catalog / Production Binding
  Acceptance re-execution
  historical GAP_FOUND rewrite
  Issue #445 Close / body mutation
  Ready / Merge
  flipping DEMO-1 draftWorkflowAuthorized / create-cta

NEXT:
  Fresh Independent Implementation Review for this alignment slice
  Ready / Merge = HOLD
  Full Acceptance re-execution = NOT AUTHORIZED
  #445 Close = NOT AUTHORIZED
```

## 12. Stop condition

```text
SP-LC-6-AC-7-ACCEPTANCE-ALIGNMENT-EXACT-SLICE-DEFINITION-1
= APPROVED / LOCKED

Classification lock: CONSUMED / LOCKED
Definition APPROVE: RECEIVED / CONSUMED / LOCKED
Implementation Start: RECEIVED / CONSUMED
Acceptance contract rewrite: AUTHORIZED for §5 three files only
  (not Full Acceptance re-execution)
Repository product mutation: NOT AUTHORIZED
#445: OPEN / KEEP OPEN
historical Full Acceptance GAP_FOUND: PRESERVED
DEMO-1 draftWorkflowAuthorized=false: PRESERVED (DEMO-1 presentation-only)
AC-7 product gap: NOT ESTABLISHED
AC-7 acceptance/evidence drift: LOCKED as classification B
AC-9: ACTIVE / OPEN / OUT OF SCOPE
Ready / Merge: HOLD
Await: Fresh Independent Implementation Review
  then separate Human Ready / Merge GO
```
