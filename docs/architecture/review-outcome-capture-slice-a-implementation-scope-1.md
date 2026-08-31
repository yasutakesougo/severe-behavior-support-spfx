# REVIEW-OUTCOME-CAPTURE-SLICE-A — Implementation Scope Definition

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: REVIEW-OUTCOME-CAPTURE-SLICE-A-IMPLEMENTATION-SCOPE-1
kind: implementation scope / start-gate definition
status: SCOPE REVIEW-CLEARED / AWAITING IMPLEMENTATION START GO
parent definition: REVIEW-OUTCOME-CAPTURE-SLICE-A
parent correction: Correction-1
parent status: HUMAN DEFINITION LOCKED
parent durable path: docs/architecture/review-outcome-capture-slice-a-definition-1.md
locked definition HEAD: 9c12b58076aefc4b6e514b1abb6aadc774b142dc
basis main: ea0963268c8ba86c546a2c251b4fd81a582c08a3
scope review: docs/architecture/review-outcome-capture-slice-a-implementation-scope-review-1.md
Independent Scope Review-1: PASS / REVIEW-CLEARED / P0=0 / P1=0 / P2=0
Human Definition Lock GO: RECEIVED / CONSUMED
Human Implementation Start GO: NOT RECEIVED
Implementation: NOT AUTHORIZED
Ready / Merge / Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
```

## 1. Purpose

Fix the smallest Product Implementation Scope that connects current-main
`HumanReviewMaterials` to synthetic `MonitoringPeriodReviewOutcome` capture and
same-screen readback, without redesigning the locked Definition and without
creating authoritative / SharePoint / LIVE WRITE persistence.

This document does **not** authorize Implementation Start.

## 2. Definition binding

Implementation (when separately authorized) must remain conformant with:

```text
docs/architecture/review-outcome-capture-slice-a-definition-1.md
Status: HUMAN DEFINITION LOCKED
Correction-1
Locked Definition HEAD: 9c12b58076aefc4b6e514b1abb6aadc774b142dc
basis main: ea0963268c8ba86c546a2c251b4fd81a582c08a3
```

If the locked Definition changes, this Scope must be re-evaluated before
Implementation Start.

This Scope does **not** reopen:

```text
Synthetic capture != authoritative Decision completion
MonitoringVersion
SharePoint / LIVE WRITE
N+1 creation / currentVersion mutation
Assessment → Plan / ServiceUser master
AI finalize
Duplicate Outcome contract logic in SPFx shell
```

## 3. Exact Scope decisions (Definition §16 Gate)

### S1 — Exact Product / verification files

```text
Decision: EXACT FILE SURFACE BELOW
```

Authorized Product change surface (after Implementation Start GO only):

```text
A src/domain/monitoring-period-review-outcome-spfx-entry.ts
A spfx/src/sbs-domain/monitoring-period-review-outcome.bundle.js
A spfx/src/sbs-domain/monitoring-period-review-outcome.bundle.d.ts
M spfx/src/sbs-domain/README.md
    # document regenerate command for the new narrow bridge only

A spfx/src/shell/monitoring/ReviewOutcomeCaptureView.tsx
A spfx/src/shell/monitoring/ReviewOutcomeCaptureView.module.scss
  (or share MonitoringViewUx.module.scss with additive classes only;
   if sharing SCSS, edit that one shared stylesheet instead of creating a new one)

M spfx/src/shell/monitoring/HumanReviewView.tsx
    # mount capture child after materials; preserve materials invariants
M spfx/src/shell/monitoring/MonitoringView.tsx
    # only if needed to pass already-resolved materials context / captured state
    # ownership: HumanReviewView owns capture mount; MonitoringView may hold
    # session state and pass props
A spfx/src/shell/monitoring/review-outcome-capture.ts
    # pure assembly + synthetic store helpers (no SharePoint)
A spfx/src/shell/monitoring/review-outcome-capture-copy.ts
    # Japanese labels + non-production boundary copy
```

Authorized verification surface:

```text
A/M spfx/src/shell/monitoring/ReviewOutcomeCaptureView.test.tsx
A/M spfx/src/shell/monitoring/review-outcome-capture.test.ts
M spfx/src/shell/monitoring/HumanReviewView.test.tsx
M spfx/src/shell/monitoring/MonitoringView.test.tsx
A spfx/smoke/review-outcome-capture-slice-a/**
  (index.html, smoke-entry.tsx, run-smoke.mjs, README.md, .gitignore)
```

No other Product / adapter / SharePoint / governance / domain redesign file is
authorized. Domain outcome contract files under `src/domain/monitoring-period-review-outcome.ts`
remain **read-only reuse** (no redesign). Binding module remains unused by this Slice.

If Implementation discovers an unavoidable missing export from an already-
authorized path, stop and request Scope Correction; do not expand silently.

### S2 — Canonical domain → SPFx bridge / export path

```text
Decision: NEW NARROW BUNDLE
  entry: src/domain/monitoring-period-review-outcome-spfx-entry.ts
  bundle: spfx/src/sbs-domain/monitoring-period-review-outcome.bundle.js
  typings: spfx/src/sbs-domain/monitoring-period-review-outcome.bundle.d.ts
```

Do **not** extend `monitoring-read-model.bundle` (READ-ONLY projection bridge;
review decision exposure is forbidden there).

Do **not** import root `src/domain/index.ts` from SPFx shell.

Bridge may re-export only:

```text
types: MonitoringPeriodReviewOutcome, MonitoringPeriodReviewDecision,
       MonitoringPeriodReviewOutcomeDto (if needed)
validators: validateMonitoringPeriodReviewOutcome,
            validateMonitoringPeriodReviewOutcomeDto (optional)
mint: mintMonitoringPeriodReviewOutcomeId
constants: MONITORING_PERIOD_REVIEW_DECISIONS,
           MONITORING_PERIOD_REVIEW_OUTCOME_LIVE_WRITE_AUTHORIZED,
           schema id/version constants as needed for assertions
```

Bridge must **not** export:

```text
binding / N+1 lineage helpers (unused this Slice)
persistence ports
SharePoint adapters
AI helpers
```

Regenerate with esbuild using the same pattern as monitoring-read-model.bundle
(documented in `spfx/src/sbs-domain/README.md`).

### S3 — Synthetic persistence mechanism

```text
Decision: COMPONENT / SESSION STATE OWNED BY MonitoringView COMPOSITION
  presentationOnly = true
  liveWriteAuthorized = false
```

Mechanism:

```text
React state (or equivalent session-scoped map) keyed by review-context key:
  OrganizationId + SiteId + UserId + planId + planVersion + periodStart + periodEnd
```

Stored value is a domain-valid `MonitoringPeriodReviewOutcome` object assembled
via canonical validators.

Classification:

```text
SYNTHETIC CAPTURE EVIDENCE
PRESENTATION ONLY
NON-PRODUCTION
!= authoritative MonitoringPeriodReviewOutcome business record
!= parent Definition Decision completion
```

No SharePoint, no domain persistence port, no localStorage required.
If Implementation prefers in-memory module singleton for smoke isolation,
that is allowed only with the same presentationOnly classification and no
cross-tenant durable claim.

### S4 — reviewedBy source

```text
Decision: SYNTHETIC FIXED ACTOR STRING
  reviewedBy = "synthetic-reviewer-slice-a"
```

Non-authoritative classification must remain visible in code comments / slice
flag / UI boundary note.

Do **not** claim Entra / staff authenticity.
Do **not** introduce Staff master.

Optional later Scope may switch to shell displayName; not this Slice.

### S5 — reviewedAt source

```text
Decision: INJECTABLE TIMESTAMP
  production-path default: new Date().toISOString() at capture click
  tests / smoke: frozen reviewedAtIso injected by caller
```

Fail closed if resulting Outcome fails domain datetime validation.

### S6 — OutcomeId mint call path

```text
Decision: ALWAYS call mintMonitoringPeriodReviewOutcomeId from canonical bridge
```

Shell must not reimplement hashing / namespace / separator logic.
Mint input uses assembled context + decision + reviewedAt + reviewedBy +
sourceRecordIds from displayed materials.

### S7 — Duplicate capture handling

```text
Decision: FAIL-CLOSED DISABLE AFTER FIRST SUCCESSFUL CAPTURE FOR SAME CONTEXT KEY
```

After a successful synthetic capture for a review-context key:

```text
decision buttons become unavailable / disabled
no silent overwrite
no second Outcome for the same context in this Slice
```

No correction / cancel / supersede UI.
If materials context identity changes (different planVersion/period/user),
treat as a different key (new undecided state).

### S8 — Disabled state after capture

```text
Decision: BOTH actions disabled; readback remains visible
```

Undecided controls must not remain clickable after success.
Copy may include a short note that the demo result is already recorded for this
period/plan context (non-production).

### S9 — Readback structure and exact non-production copy

```text
Decision: READBACK SECTION BELOW MATERIALS / CAPTURE CONTROLS
```

Required visible meaning (exact Japanese copy locked here):

Undecided:

```text
見直し結果: 未判断
```

NO_CHANGE success:

```text
デモ上の見直し結果: 変更なし
本番には保存されていません
```

CHANGE_REQUIRED success:

```text
デモ上の見直し結果: 変更が必要
次の計画版はまだ作成されていません
本番には保存されていません
```

Optional secondary technical detail (tertiary):

```text
計画版 {planVersion} · 対象期間 {periodStart}〜{periodEnd}
```

Must not show production save badge / SharePoint success semantics.
Must not imply N+1 exists when CHANGE_REQUIRED.

### S10 — Error / malformed assembly fail-closed behavior

```text
Decision: FAIL CLOSED / NO PARTIAL SUCCESS
```

If context is unresolved (`MALFORMED_INPUT` / `CONTEXT_MISMATCH` materials),
capture controls are not offered.

If assembly / validation fails after click:

```text
見直し結果を安全に記録できません。入力内容を確認してください。
```

Do not show success readback.
Do not store invalid values.
Do not retry automatically.

### S11 — Focused test surface

```text
Decision:
  unit/component tests for assembly, disable-after-capture, copy, fail-closed
  MonitoringView / HumanReviewView regression for materials invariants
  contract/smoke assertions that LIVE_WRITE remains false and bridge exports exist
```

Minimum cases:

```text
undecided → NO_CHANGE → readback
undecided → CHANGE_REQUIRED → readback + next-version-not-created
duplicate click after success does not overwrite
malformed materials → no capture controls
canonical mint/validate used (spy or exported helper path)
presentationOnly / liveWriteAuthorized false constants
#547 identity / role cues remain present
```

### S12 — Rendered browser acceptance

```text
Decision: NEW smoke under spfx/smoke/review-outcome-capture-slice-a/**
Viewports: 1280×900 and 390×844
```

Must prove on synthetic fixtures:

```text
undecided visible
NO_CHANGE capture + non-production readback
CHANGE_REQUIRED capture + Revision Pending meaning + non-production note
no N+1 creation control
materials section still present
```

Artifacts under `/opt/cursor/artifacts` or smoke output path; no live tenant I/O.

### S13 — Capture UI ownership

```text
Decision:
  HumanReviewView mounts ReviewOutcomeCaptureView after materials content
  MonitoringView may own synthetic session state and pass:
    materials model / build result
    capturedOutcome | null
    onCapture(decision)
  ReviewOutcomeCaptureView is a narrow child component
```

Monitoring summary section remains summary-only (no capture buttons there).

## 4. Assembly algorithm (authorized)

On explicit human click of `NO_CHANGE` or `CHANGE_REQUIRED`:

```text
1. Require HumanReviewMaterials status === RESOLVED
2. sourceRecordIds = materials.records.map(r => r.RecordId)  // may be empty
3. reviewedAt = injected or now ISO
4. reviewedBy = "synthetic-reviewer-slice-a"
5. Build MonitoringPeriodReviewOutcome fields from materials context + decision
6. OutcomeId = mintMonitoringPeriodReviewOutcomeId(...)
7. validateMonitoringPeriodReviewOutcome(outcome) must be true
8. Store in synthetic session state under context key
9. Render readback from stored Outcome only
```

Do not invent OrganizationId / SiteId / UserId / plan / period outside materials.

## 5. Slice flag

```text
REVIEW_OUTCOME_CAPTURE_SLICE_A = {
  id: "REVIEW-OUTCOME-CAPTURE-SLICE-A"
  presentationOnly: true
  liveWriteAuthorized: false
  sharePointWriteAuthorized: false
  planVersionMutationAuthorized: false
  monitoringVersionAuthorized: false
  authoritativeDecisionCompletionAuthorized: false
}
```

## 6. Required invariants

```text
INV-S1  Canonical #548 domain validators/mint are used; no SPFx duplicate logic
INV-S2  Synthetic capture != authoritative Decision completion
INV-S3  LIVE_WRITE / SharePoint paths absent
INV-S4  Monitoring read-model bundle remains free of decision capture exports
INV-S5  CHANGE_REQUIRED readback does not imply N+1
INV-S6  NO_CHANGE readback distinguishes from 未判断
INV-S7  Duplicate capture for same context is blocked
INV-S8  #547 materials/identity/role cues remain
INV-S9  MonitoringVersion not introduced
INV-S10 Secondary Gaps not absorbed
```

## 7. Explicit OUT

```text
SharePoint Outcome persistence / adapters
domain persistence port
SupportPlanVersion N+1 creation UI
SupportPlan.currentVersion mutation
SupportPlan.status changes
MonitoringVersion
Assessment → Plan
ServiceUser / Staff master
binding creation UI
AI recommendation / auto-decision
Deploy / Production Binding / LIVE WRITE
Ready / Merge
Actual Staff Value Check execution (post-impl gate; not this Scope doc)
```

## 8. Exact implementation sequence (only after Human Implementation Start GO)

```text
1. Re-read locked Definition + this Scope
2. Confirm locked Definition HEAD still 9c12b58 (or re-bind if Lock amended)
3. Add narrow domain SPFx entry + generate bundle + README note
4. Add review-outcome-capture helpers + copy
5. Add ReviewOutcomeCaptureView and wire through HumanReviewView / MonitoringView
6. Focused tests
7. Rendered smoke 1280×900 and 390×844
8. Exact implementation HEAD fixation
9. Independent Implementation Review
10. STOP before Actual Staff Value Check / Ready unless separately authorized
```

Implementation Start GO does not authorize Ready, Merge, Deploy, LIVE WRITE,
SharePoint, or Actual Staff Value Check execution by itself.

Per locked Definition §17, after Rendered Browser Acceptance, Actual Staff
Value Check is a **required Product Value Gate before Human Ready eligibility**.
That gate is separate from Implementation Start.

## 9. Verification minimum

```text
focused shell/domain-bridge tests: PASS
rendered smoke NO_CHANGE path: PASS
rendered smoke CHANGE_REQUIRED path: PASS
viewports 1280×900 and 390×844: PASS
LIVE_WRITE_AUTHORIZED false asserted: PASS
no SharePoint path: PASS
materials invariants / #547 cues: PASS
typecheck / lint / format: PASS where applicable
```

## 10. Acceptance Criteria (Scope)

```text
SAC-1  Definition §16 items 1–13 are decided (IN or explicit OUT)
SAC-2  Canonical domain → SPFx path is a new narrow outcome bundle
SAC-3  monitoring-read-model.bundle is not extended for decisions
SAC-4  Synthetic persistence is presentation-only / non-authoritative
SAC-5  Exact Japanese non-production readback copy is locked
SAC-6  Duplicate capture is fail-closed disable
SAC-7  Capture mounts under HumanReviewView; summary remains summary-only
SAC-8  Authorized file surface is exact and minimal
SAC-9  Implementation remains NOT AUTHORIZED until Human Implementation Start GO
SAC-10 Definition is not redesigned
```

## 11. Stop conditions

```text
Independent Scope Review-1 required before Human Implementation Start GO
Scope Correction only if Independent Scope Review finds P0/P1
No Implementation Start from this document alone
No SharePoint / LIVE WRITE / N+1 work from this document
If parent Definition Lock is revoked or materially amended → HOLD + re-scope
```

## 12. Next gate

```text
Independent Scope Review-1 = PASS / REVIEW-CLEARED / CONSUMED
Scope Correction-1 = NOT REQUIRED
NEXT = Human Implementation Start GO / HOLD
Implementation = NOT AUTHORIZED
Mutation by implementation = 0 until Start GO
```
