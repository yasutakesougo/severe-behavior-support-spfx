# REVIEW-OUTCOME-CAPTURE-SLICE-A — Definition

```text
Definition ID = REVIEW-OUTCOME-CAPTURE-SLICE-A
Correction = 1
Mode = DEFINITION ONLY
Status = CANDIDATE / CORRECTION-1 APPLIED / NOT LOCKED
basis main = ea0963268c8ba86c546a2c251b4fd81a582c08a3
parent = REVIEW-TO-PLAN-REVISION-RELATIONSHIP-DEFINITION-1
parent status = HUMAN DEFINITION LOCKED / merged via PR #548
Human Definition Lock GO = NOT RECEIVED
Implementation = NOT AUTHORIZED
Ready / Merge = NOT AUTHORIZED
SharePoint / Production / LIVE WRITE = NOT AUTHORIZED
```

This Definition does not authorize Implementation Start.

---

## 1. Purpose

Current main already displays `HumanReviewMaterials`, states that judgment belongs to humans, and implements the `MonitoringPeriodReviewOutcome` domain contract.

Current main does not connect human judgment to outcome input and same-screen readback.

This Slice defines the smallest Product Slice that proves that connection with synthetic, non-authoritative persistence only.

```text
HumanReviewMaterials
        ↓
人が事実を確認
        ↓
未判断
        ↓
「変更なし」 | 「変更が必要」
        ↓
canonical MonitoringPeriodReviewOutcome contract に適合する値を組み立てる
        ↓
synthetic / presentation-only state
        ↓
同一画面で非本番の結果を確認
```

This Slice does not create an authoritative business decision record.

---

## 2. Current-main baseline

```text
main = ea0963268c8ba86c546a2c251b4fd81a582c08a3
PR #547 = Human Review identity / role clarity merged
PR #548 = Review → Revision domain relationship merged
```

Already implemented:

```text
MonitoringPeriodReviewOutcome
NO_CHANGE / CHANGE_REQUIRED
isRevisionPending()
N→N+1 lineage contract
HumanReviewMaterials display
Human judgment ownership copy
```

Not connected:

```text
Human Review outcome input
canonical Outcome assembly from the displayed review context
synthetic readback on the same screen
SharePoint Outcome persistence
SupportPlanVersion N+1 creation
```

The direct current-main Product Gap is:

```text
Domain contract exists
        ↓
Human judgment responsibility is displayed
        ↓
Human cannot yet record and confirm a synthetic domain-valid result
```

---

## 3. Evidence boundary

Pre-#547 Actual Staff Evidence in #539 remains valid for the pre-#547 UI.

```text
Actual Staff Evidence = ESTABLISHED
Staff count = 1
Overall = PARTIAL
Evidence target = pre-#547 UI
```

It must not be treated as proof that Q1 / Q2 / Q5 remain unresolved on current main.

Current-main Actual Staff revalidation has not been performed.

```text
Current-main Actual Staff revalidation = NOT PERFORMED
Current-main Actual Staff Value PASS = NOT ESTABLISHED
```

This Slice is justified by the current-main structural gap, not by assuming that the pre-#547 UI findings still exist.

---

## 4. Parent Definition binding

This Slice consumes the locked parent relationship without reopening it.

```text
Monitoring = Derived
HumanReviewMaterials != MonitoringPeriodReviewOutcome
NO_CHANGE = reviewed, no change required
CHANGE_REQUIRED may exist before N+1
CHANGE_REQUIRED != Revision complete
Revision Pending = derived relationship state
UI / AI != Outcome System of Record
Human authority is required for authoritative Outcome completion
```

This Slice does not change `SupportPlan.status`.

This Slice does not create SupportPlanVersion N+1.

---

## 5. Decision vocabulary

The only selectable decisions are:

```text
NO_CHANGE
CHANGE_REQUIRED
```

Human-readable labels are:

```text
NO_CHANGE        → 変更なし
CHANGE_REQUIRED  → 変更が必要
```

No default decision is allowed.

No timeout decision is allowed.

AI must not select or finalize either value.

---

## 6. Synthetic authority boundary — Correction-1 / P1-1

An explicit human button action is necessary for Slice A capture, but it is not sufficient to establish authoritative business decision completion.

```text
Human button click
!= Human authority established for production record

canonical domain-valid value
!= authoritative MonitoringPeriodReviewOutcome business record

synthetic/session readback
!= parent Definition Decision completion
```

Slice A may assemble a value that validates against the canonical `MonitoringPeriodReviewOutcome` contract.

That value is classified only as:

```text
SYNTHETIC CAPTURE EVIDENCE
PRESENTATION ONLY
NON-PRODUCTION
```

`reviewedBy` may use a synthetic or shell-provided actor decided in Implementation Scope.

A non-empty `reviewedBy` value satisfies the domain shape only.

It does not prove actor authenticity or production authority.

The UI must not claim that the business Outcome has been durably or authoritatively saved.

The readback must make the boundary visible with equivalent meaning to:

```text
デモ上の見直し結果
本番には保存されていません
```

Exact wording is decided in Implementation Scope and rendered acceptance.

---

## 7. Canonical domain → SPFx bridge invariant — Correction-1 / P1-2

The SPFx surface must consume the canonical #548 domain contract.

The SPFx shell must not independently redefine:

```text
MonitoringPeriodReviewOutcome
MonitoringPeriodReviewDecision
Outcome validator semantics
OutcomeId mint semantics
Revision Pending semantics
```

```text
Duplicate Outcome contract in SPFx shell = FORBIDDEN
Duplicate validator / mint logic in SPFx shell = FORBIDDEN
```

Current SPFx monitoring bridge exposes read-model and review-material contracts but does not expose `MonitoringPeriodReviewOutcome`.

Implementation Scope must explicitly decide the canonical domain → SPFx export path before Implementation Start GO.

Allowed design choices may include extending the existing narrow bridge or introducing another narrow generated bridge.

This Definition does not choose between those implementation mechanisms.

The resulting bridge must remain bounded to this synthetic Product Slice and must not create persistence or LIVE WRITE authority.

---

## 8. Review context assembly

Review context must come from the already-resolved `HumanReviewMaterials` / Monitoring context on screen.

Staff must not re-enter identity or period fields for this Slice.

The assembled canonical value includes the existing contract fields:

```text
OrganizationId
SiteId
UserId
planId
planVersion
periodStart
periodEnd
sourceRecordIds[]
decision
reviewedAt
reviewedBy
OutcomeId
```

`sourceRecordIds[]` must reflect the exact displayed review evidence set.

A valid zero-record review may therefore produce an empty source set according to the already-implemented domain contract.

---

## 9. Target Product Flow

Before capture:

```text
見直し結果 = 未判断
```

Human selects exactly one action:

```text
変更なし
変更が必要
```

After successful synthetic capture, the same Monitoring / Human Review composition shows the synthetic result.

For `NO_CHANGE`:

```text
デモ上の見直し結果: 変更なし
本番には保存されていません
```

For `CHANGE_REQUIRED`:

```text
デモ上の見直し結果: 変更が必要
次の計画版はまだ作成されていません
本番には保存されていません
```

`CHANGE_REQUIRED` readback must not imply that N+1 exists.

---

## 10. Synthetic persistence boundary

Implementation Scope may choose one bounded presentation mechanism:

```text
in-memory / session-scoped synthetic store
component-local state with explicit presentation-only classification
existing synthetic demo/session pattern
```

Slice A must not use:

```text
SharePoint list / REST / adapter
domain persistence port
production repository
cross-tenant durable storage
```

Silent overwrite of an already captured synthetic result for the same review context is forbidden.

Duplicate handling is decided in Implementation Scope and must fail closed or require an explicit separate action.

Outcome correction / cancellation / supersede is outside Slice A.

---

## 11. MonitoringVersion boundary — Correction-1 / P2-1

The current parent contract states:

```text
Monitoring = Re-computable Derived View
MonitoringVersion = NOT DEFINED / NOT ADOPTED
```

This Slice does not introduce `MonitoringVersion` or Monitoring snapshot persistence.

This Slice does not claim that every future Monitoring versioning question has been permanently decided.

```text
Future Monitoring versioning decision = OUT OF THIS SLICE
```

Staff 1 Q6 remains a separate domain observation and does not authorize MonitoringVersion work here.

---

## 12. Explicit OUT

```text
SharePoint Outcome persistence
SupportPlanVersion N+1 creation
SupportPlan.currentVersion mutation
SupportPlan.status changes
Active / effective state changes
MonitoringVersion / Monitoring snapshot persistence
Assessment → Plan relationship
ServiceUser / Staff master redesign
Production Binding
LIVE WRITE
Deploy
AI recommendation / automatic decision
Daily → Monitoring → Review journey redesign
Outcome correction / cancellation / supersede
N→N+1 binding creation UI
```

Secondary Gaps must not be absorbed into this Slice.

---

## 13. UI boundary

IN conceptually:

```text
未判断 state
NO_CHANGE explicit human action
CHANGE_REQUIRED explicit human action
synthetic non-production boundary note
same-screen synthetic readback
CHANGE_REQUIRED Revision Pending explanation
disabled / unavailable state after successful capture for the same context
```

OUT:

```text
N+1 creation UI
plan editing
MonitoringVersion UI
SharePoint save-success semantics
production save badge
AI decision control
```

UI state alone is not an authoritative Outcome System of Record.

---

## 14. Required invariants

```text
INV-A1  Explicit human action is required for synthetic capture.
INV-A2  Only NO_CHANGE or CHANGE_REQUIRED may be selected.
INV-A3  Synthetic capture must validate through the canonical #548 domain contract.
INV-A4  Review context comes from the displayed resolved materials context.
INV-A5  Synthetic persistence only; SharePoint / LIVE WRITE are forbidden.
INV-A6  Synthetic readback occurs on the same Monitoring / Human Review composition.
INV-A7  CHANGE_REQUIRED readback must not imply N+1 exists.
INV-A8  NO_CHANGE readback must distinguish reviewed-no-change from undecided.
INV-A9  MonitoringVersion is not introduced by this Slice.
INV-A10 UI-only state is not authoritative business Outcome persistence.
INV-A11 AI cannot select or finalize Outcome.
INV-A12 Parent relationship semantics must not be contradicted.
INV-A13 Synthetic domain-valid value != authoritative business Outcome.
INV-A14 SPFx must consume canonical domain semantics; duplicate contract logic is forbidden.
INV-A15 reviewedBy shape validity != actor authenticity / Human authority establishment.
```

---

## 15. Definition acceptance criteria

```text
AC-A1  Slice targets the current-main Human Review → outcome input → readback structural gap.
AC-A2  Existing MonitoringPeriodReviewOutcome domain semantics are reused without redesign.
AC-A3  Only NO_CHANGE / CHANGE_REQUIRED are selectable.
AC-A4  Synthetic capture is explicit, presentation-only, and non-authoritative.
AC-A5  Same-screen readback is required.
AC-A6  CHANGE_REQUIRED shows next-version-not-created semantics.
AC-A7  MonitoringVersion is not introduced.
AC-A8  SharePoint / LIVE WRITE / N+1 / currentVersion / Assessment / master redesign remain OUT.
AC-A9  Pre-#547 staff evidence is not misrepresented as current-main evidence.
AC-A10 SPFx must consume canonical #548 outcome semantics through an explicitly scoped bridge/export path.
AC-A11 Synthetic readback must visibly state that it is not production persistence.
AC-A12 No Implementation, Ready, Merge, Deploy, or production mutation is authorized by this Definition.
```

---

## 16. Implementation Scope Gate

Only after Human Definition Lock GO, Implementation Scope must decide:

```text
1. Exact Product / verification files.
2. Canonical domain → SPFx bridge/export path.
3. Synthetic persistence mechanism.
4. reviewedBy source and its explicit non-authoritative classification.
5. reviewedAt source.
6. OutcomeId mint call path from canonical domain code.
7. Duplicate capture handling.
8. Disabled state after capture.
9. Readback structure and exact non-production copy.
10. Error / malformed assembly fail-closed behavior.
11. Focused test surface.
12. Rendered browser acceptance surface at 1280×900 and 390×844.
13. Capture UI ownership between MonitoringView / HumanReviewView / a narrow child component.
```

Implementation Scope must not authorize SharePoint persistence, N+1 creation, MonitoringVersion, Deploy, or LIVE WRITE.

---

## 17. Verification and Actual Staff Value Gate — Correction-1 / P1-3

Implementation verification must prove at minimum:

```text
undecided → NO_CHANGE → synthetic readback
undecided → CHANGE_REQUIRED → synthetic readback + next version not created
canonical domain validation is used
canonical OutcomeId mint semantics are used
non-production boundary is visible
no SharePoint / LIVE WRITE path exists
no N+1 creation UI exists
focused tests PASS
rendered browser acceptance PASS
```

Actual Staff Value Check is not required before Definition Lock.

Actual Staff Value Check is not required before Implementation Start GO.

After implementation and Rendered Browser Acceptance, Actual Staff Value Check is a required Product Value Gate before Human Ready eligibility.

Minimum questions:

```text
1. 誰の・どの期間・どの計画を見直しているか分かるか？
2. 「変更なし」と「変更が必要」の意味が迷わず分かるか？
3. 「変更が必要」でも、まだ次の計画版が作られていないことが分かるか？
```

One staff participant is sufficient for the first check unless broader confirmation is separately requested.

If the staff check causes Product code or copy changes, focused verification and rendered browser acceptance must be repeated before exact implementation HEAD fixation.

```text
Rendered Browser Acceptance
        ↓
Actual Staff Value Check = REQUIRED
        ↓
correction if needed
        ↓
re-verification if changed
        ↓
Exact Diff / HEAD Fixation
        ↓
Independent Implementation Review
        ↓
Human Ready GO / HOLD
```

---

## 18. Correction-1 disposition

Independent Definition Review-1 findings are dispositioned as follows:

```text
P1-1 synthetic authority ambiguity
= RESOLVED
Synthetic domain-valid capture is explicitly non-authoritative and not Decision completion.

P1-2 canonical domain → SPFx bridge ambiguity
= RESOLVED
Canonical #548 semantics are mandatory; duplicate SPFx contract logic is forbidden; exact bridge path is deferred to Scope.

P1-3 Actual Staff gate weakened to optional
= RESOLVED
Post-render implementation staff check is REQUIRED before Human Ready eligibility.

P2-1 MonitoringVersion wording too strong
= RESOLVED
Current state is NOT DEFINED / NOT ADOPTED; future decision remains OUT OF THIS SLICE.
```

---

## 19. Stop condition

```text
REVIEW-OUTCOME-CAPTURE-SLICE-A
= DEFINED / CORRECTION-1 APPLIED / CANDIDATE

Implementation
= NOT STARTED / NOT AUTHORIZED

Product code mutation
= 0

NEXT
= Independent Definition Re-Review-1
```

Human Definition Lock GO remains a separate gate after Independent Definition Re-Review-1.
