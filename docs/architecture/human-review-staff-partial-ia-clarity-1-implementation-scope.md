# HUMAN-REVIEW-STAFF-PARTIAL-IA-CLARITY-1 — Implementation Scope Definition

```text
repository: yasutakesougo/severe-behavior-support-spfx
parent definition PR: #545
locked definition HEAD: 8b5c48b8d3e67e53dc9857bbc2b5fd67bb3b4416
unit: HUMAN-REVIEW-STAFF-PARTIAL-IA-CLARITY-1
kind: implementation scope / start-gate definition
status: CANDIDATE / NOT STARTED
Human Definition Lock GO: RECEIVED / CONSUMED on parent definition
Human Implementation Start GO: NOT RECEIVED
Implementation: NOT AUTHORIZED
Ready / Merge / Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
```

## 1. Purpose

Define the smallest implementation surface that may realize the locked Track A presentation / IA clarity definition without expanding into Track B domain questions or other workflow redesign.

This document does not authorize implementation.

## 2. Definition binding

Implementation must remain conformant with the locked definition at:

```text
PR #545
HEAD 8b5c48b8d3e67e53dc9857bbc2b5fd67bb3b4416
```

If the locked parent Definition changes, this Scope must be re-evaluated before Implementation Start.

## 3. Product change surface

Only the following Product files may be modified for behavior / presentation:

```text
spfx/src/shell/monitoring/MonitoringView.tsx
spfx/src/shell/monitoring/HumanReviewView.tsx
spfx/src/shell/monitoring/MonitoringViewUx.module.scss
```

No other Product runtime file is authorized by this Scope.

## 4. Verification surface

The following verification surfaces may change only to prove the locked acceptance criteria:

```text
focused tests under spfx/src/shell/monitoring/**
existing human-review / planning-pc / demo smoke assertions where directly required
existing snapshot / rendered-browser evidence helpers where directly required
```

Verification changes must not introduce new Product behavior or expand Product scope.

## 5. Allowed implementation outcomes

### A1 — Identity visibility

The implementation may change presentation hierarchy so that person identity is visually primary in both Monitoring overview and Human Review materials.

Plan version and period remain secondary.

Technical identifiers remain tertiary / detail-level.

No new identity source or domain mapping may be introduced.

### A2 — Overview vs Review role clarity

The implementation may strengthen at-a-glance role cues for the two existing sections.

The allowed meaning is limited to:

```text
期間モニタリング（概要）
= period summary / count
= system does not judge quality, effectiveness, approval, or plan-change necessity

見直し資料
= per-record factual materials
= humans own evaluation, approval, and plan-change-necessity judgment
```

The implementation may use hierarchy, labels, short role framing, spacing, grouping, or existing-style emphasis.

It must prefer concise presentation over new long explanatory essays.

## 6. Required invariants

The implementation must preserve all of the following:

```text
Monitoring remains summary-only
Human Review owns RecordId-bound detail
no RecordId full-detail duplication into Monitoring
sceneLabel remains exact-match fail-closed
0件 ≠ 実施できなかった
human decision ownership statements remain true and visible
no system-generated judgment
no effectiveness judgment
no automated plan-change recommendation
```

## 7. Explicit OUT

The following are not authorized:

```text
Track B / Q6 Monitoring versioning decision
MonitoringResult version identifier
Support Plan lifecycle change
schema / DTO / domain contract change
persistence change
review outcome write
post-review plan revision UI
Daily Records UI change
Daily → Monitoring → Review journey redesign
new route
new card family
new design system / dependency
new runtime package
AI score / recommendation / label
SharePoint / M365 / Entra mutation
Deploy / Production Binding / LIVE WRITE
automatic Slice C creation
```

## 8. Exact implementation sequence after separate Human GO

Only after a separate Human Implementation Start GO may the implementation proceed in this order:

```text
1. Re-read locked Definition + this Scope
2. Confirm parent Definition HEAD unchanged
3. Inspect current implementation files
4. Make smallest Product presentation diff within §3
5. Update only necessary verification surface within §4
6. Focused verification
7. Rendered browser acceptance on synthetic surface
8. Exact implementation HEAD fixation
9. Independent Implementation Review
10. 5-Persona Product Simulation if applicable under the locked process
11. Human Ready GO
12. separate Human Merge GO
```

Implementation Start GO does not authorize Ready, Merge, Deploy, Production Binding, or LIVE WRITE.

## 9. Verification minimum

At minimum, later implementation evidence must establish:

```text
focused monitoring / human-review tests: PASS
rendered synthetic evidence for identity hierarchy: PASS
rendered synthetic evidence for overview vs materials role distinction: PASS
Slice B invariants: PASS
Track B untouched: PASS
typecheck / lint / format: PASS where applicable
```

Existing browser acceptance or smoke harnesses should be extended only when required to prove the above.

## 10. Rendered acceptance states

Rendered acceptance must cover enough synthetic states to prove that the presentation hierarchy does not depend on one favorable fixture.

At minimum:

```text
current-plan / non-zero records
historical / fail-closed label path where applicable
zero-record state
```

The evidence must demonstrate both Monitoring overview and Human Review materials when the target composition is available.

## 11. Stop conditions

Stop and return to Definition / Scope if any of the following becomes necessary:

```text
new domain meaning
new versioning semantics
new data contract
new navigation journey
Daily Records changes
new persistence
new runtime dependency
removal of human decision ownership copy
expansion beyond the three Product files in §3 for Product behavior
```

Verification-only file additions do not trigger this stop when they remain strictly evidentiary and do not expand runtime behavior.

## 12. Authority state

```text
Parent Human Definition Lock GO: RECEIVED / CONSUMED
Implementation Scope: CANDIDATE
Independent Scope Review: NOT STARTED
Human Implementation Start GO: NOT RECEIVED
Implementation: NOT AUTHORIZED
Human Ready GO: NOT RECEIVED
Human Merge GO: NOT RECEIVED
Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
```

## 13. Next gate

```text
Implementation Scope Definition
↓
Independent Scope Review
↓
Correction if required
↓
Independent Scope Re-Review
↓
Human Implementation Start GO
```
