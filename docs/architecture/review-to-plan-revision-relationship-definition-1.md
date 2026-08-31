# REVIEW-TO-PLAN-REVISION-RELATIONSHIP-DEFINITION-1

```text
Definition ID = REVIEW-TO-PLAN-REVISION-RELATIONSHIP-DEFINITION-1
Correction = 1
Mode = DEFINITION ONLY
Status = HUMAN DEFINITION LOCKED
Human Definition Lock GO = CONSUMED
Independent Definition Review-1 = CORRECTION REQUIRED / CONSUMED
Definition Correction-1 = APPLIED / CONSUMED
Independent Definition Re-Review-1 = PASS / REVIEW-CLEARED / P0=0 / P1=0 / P2=0 / CONSUMED
basis main at Lock = 697c8d920d278b723cf2efbd289d1694f18e7c1a
Implementation = NOT AUTHORIZED
SharePoint Write = NOT AUTHORIZED
Production Write = NOT AUTHORIZED
Issue mutation = NOT AUTHORIZED by this Definition
```

This durable document records the Human-locked Definition (Correction-1).
It does not authorize Implementation Start.

---

## 1. Correction Summary

Independent Definition Review-1 findings were reflected as follows:

```text
P1-1 = RESOLVED
  Existing SupportPlan.status = PendingReview terminology collision removed.
  Monitoring-period business review result is named
  MonitoringPeriodReviewOutcome.

P1-2 = RESOLVED
  CHANGE_REQUIRED may be persisted before SupportPlanVersion N+1 exists.
  CHANGE_REQUIRED and Plan Version N+1 creation are not the same
  business completion unit.

P2-1 = DISPOSITIONED
  currentVersion update and Active / effective activation relationship
  are decided in Implementation Scope Gate.

P2-2 = DISPOSITIONED
  Review Context field names in this Definition are conceptual keys.
  Canonical casing is decided in Implementation Scope.
```

---

## 2. Purpose

Define the relationship between a human Monitoring Period Review result and
SupportPlanVersion change.

In scope conceptually:

```text
SupportPlanVersion N
        ↓
ProcedureRecord[]
        ↓
MonitoringReadModel
        ↓
HumanReviewMaterials
        ↓
Monitoring Period Review
        ↓
MonitoringPeriodReviewOutcome
        ↓
NO_CHANGE / CHANGE_REQUIRED
```

UI, SharePoint schema, storage destination, and API are out of Definition scope.

---

## 3. Existing `PendingReview` terminology boundary

```text
SupportPlan.status = PendingReview
!=
Monitoring Period Review
```

```text
SupportPlan.status = PendingReview
!=
MonitoringPeriodReviewOutcome
```

### SupportPlan `PendingReview`

Existing SupportPlan lifecycle state related to submit / confirm / activate.

### Monitoring Period Review

Human business act that uses a period of ProcedureRecords and Monitoring results
to decide whether the current plan version should continue or change.

### MonitoringPeriodReviewOutcome

Business decision record finalized by a Monitoring Period Review.

This Definition does **not** adopt bare `ReviewOutcome` as the canonical domain concept name.

---

## 4. Core Data Flow

```text
SupportPlan
    ↓
SupportPlanVersion N
    ↓
ProcedureRecord[]
    ↓
MonitoringReadModel
    ↓
HumanReviewMaterials
    ↓
Monitoring Period Review
    ↓
MonitoringPeriodReviewOutcome
```

Outcome branch:

```text
MonitoringPeriodReviewOutcome
        │
        ├─ NO_CHANGE
        │      ↓
        │  Plan Version N remains current
        │
        └─ CHANGE_REQUIRED
               ↓
          Revision Pending
               ↓
          SupportPlanVersion N+1
```

---

## 5. Monitoring remains Derived

```text
Monitoring = Re-computable Derived View
MonitoringVersion = NOT DEFINED
```

Monitoring snapshot persistence / Monitoring version entity are not adopted.

---

## 6. HumanReviewMaterials are not the decision record

```text
HumanReviewMaterials != MonitoringPeriodReviewOutcome
Materials generated != Review completed
```

---

## 7. Monitoring Period Review Context

Conceptual keys (casing not canonical here):

```text
organizationId
siteId
userId
planId
planVersion
periodStart
periodEnd
sourceRecordIds[]
```

Required traceability:

```text
MonitoringPeriodReviewOutcome
→ reviewed SupportPlanVersion
→ reviewed target period
→ source ProcedureRecord set
```

`sourceRecordIds` fix the evidence set for the decision. They do not create a
second Monitoring System of Record.

---

## 8. MonitoringPeriodReviewOutcome values

Minimum decision vocabulary:

```text
NO_CHANGE
CHANGE_REQUIRED
```

---

## 9. NO_CHANGE

```text
MonitoringPeriodReviewOutcome = NO_CHANGE
→ Plan Version N remains current
→ N+1 is not required
```

Distinguish explicitly:

```text
A. Monitoring Period Review performed / Outcome = NO_CHANGE
B. Monitoring Period Review not performed
```

`No new Plan Version` alone must not decide A vs B.

---

## 10. CHANGE_REQUIRED

### 10.1 May precede N+1

```text
Decision = B
CHANGE_REQUIRED may be persisted before SupportPlanVersion N+1 exists.
```

Valid intermediate state:

```text
Plan Version N
  → Monitoring Period Review
  → CHANGE_REQUIRED
  → Revision Pending
```

### 10.2 Not equal to N+1

```text
CHANGE_REQUIRED != SupportPlanVersion N+1
```

---

## 11. Revision Pending

Relationship-state wording only. Not a new `SupportPlan.status` enum value.

```text
MonitoringPeriodReviewOutcome = CHANGE_REQUIRED
AND linked next SupportPlanVersion does not yet exist
```

```text
Revision Pending != SupportPlan.status = PendingReview
```

This Definition does not require adding a SupportPlan status enum member.

---

## 12. SupportPlanVersion N+1 creation

When Revision completes:

```text
SupportPlanVersion N
  → MonitoringPeriodReviewOutcome = CHANGE_REQUIRED
  → Revision
  → SupportPlanVersion N+1
```

Minimum explainability:

```text
previousPlanVersion = N
nextPlanVersion = N+1
sourceMonitoringPeriodReviewOutcome = X
```

Reverse traceability from N+1 to source Outcome is required.

---

## 13. Completion conditions

### Decision completion

```text
MonitoringPeriodReviewOutcome persisted
Outcome = CHANGE_REQUIRED (or NO_CHANGE)
Human authority established
Reviewed context identified
```

### Revision completion

```text
SupportPlanVersion N+1 exists
AND N+1 is explicitly linked to the source MonitoringPeriodReviewOutcome
AND N remains historical
```

```text
Decision complete != Revision complete
```

---

## 14. Plan Version non-destructive rule

```text
Version N remains historical immutable business version
N → N+1 (no overwrite of N contents)
```

Aligns with SupportPlan lifecycle selection D4=A.

---

## 15. Persistence principle

```text
Monitoring = Derived Data
MonitoringPeriodReviewOutcome = Business Decision Record
```

Outcome persistence direction is a Definition principle.
Concrete store / port / SharePoint list / schema are Implementation Scope.

---

## 16. Outcome immutability principle

Prefer:

```text
MonitoringPeriodReviewOutcome A → later MonitoringPeriodReviewOutcome B
```

Do not use overwrite-as-basic-model.
Correction / cancellation / supersede detail contracts are out of this Definition.

---

## 17. Human Authority Boundary

```text
Monitoring result != MonitoringPeriodReviewOutcome
AI output != finalized MonitoringPeriodReviewOutcome
```

AI must not independently finalize `NO_CHANGE` / `CHANGE_REQUIRED` as business authority.

---

## 18. UI Boundary

```text
conceptualNextVersion != persisted SupportPlanVersion N+1
UI says CHANGE_REQUIRED != Outcome established
```

UI projects from authority records; UI is not System of Record.

---

## 19. Terminology

| Term | Meaning |
|---|---|
| SupportPlan `PendingReview` | Existing lifecycle state; not Monitoring Period Review |
| Monitoring | Derived View over ProcedureRecords for a Plan Version + period |
| HumanReviewMaterials | Presentation projection for human review |
| Monitoring Period Review | Human business act |
| MonitoringPeriodReviewOutcome | Finalized human decision record (`NO_CHANGE` / `CHANGE_REQUIRED`) |
| Revision Pending | CHANGE_REQUIRED without linked next version yet |
| Revision | Create N+1 and establish lineage to source Outcome |
| Plan Version | Versioned business object of plan content |

---

## 20. Required Lineage

```text
SupportPlan
  → SupportPlanVersion N
  → ProcedureRecord[]
  → MonitoringReadModel
  → HumanReviewMaterials
  → Monitoring Period Review
  → MonitoringPeriodReviewOutcome
       ├─ NO_CHANGE → Version N remains current
       └─ CHANGE_REQUIRED → Revision Pending → Revision → SupportPlanVersion N+1
```

---

## 21. Invariants

- INV-1 Monitoring remains derived / no MonitoringVersion required
- INV-2 Materials generation ≠ review completion
- INV-3 Human authority required for Outcome
- INV-4 No new Plan Version ≠ automatic NO_CHANGE
- INV-5 CHANGE_REQUIRED may exist without N+1
- INV-6 CHANGE_REQUIRED ≠ Revision complete
- INV-7 N is not overwritten to become N+1
- INV-8 N+1 from review is traceable to reviewed version + source Outcome
- INV-9 SupportPlan `PendingReview` remains separate terminology
- INV-10 UI is not System of Record
- INV-11 AI cannot finalize Outcome

---

## 22. Non-Goals

```text
MonitoringVersion / Monitoring snapshot persistence
Assessment → Plan relationship
ServiceUser master / Staff master
SupportPlan SharePoint adapter
SharePoint list schema / column names / REST
SPFx UI implementation
AI implementation / Vector DB / Data Lake / MDM
deployment / production write
SupportPlan.status = RevisionPending (or equivalent enum addition)
```

---

## 23. Implementation Scope Gate (decisions deferred to Scope)

```text
1. MonitoringPeriodReviewOutcome domain representation
2. Monitoring Period Review Context representation
3. MonitoringPeriodReviewOutcome identifier
4. reviewedAt / reviewedBy requirements
5. NO_CHANGE persistence representation
6. CHANGE_REQUIRED persistence representation
7. CHANGE_REQUIRED → N+1 linkage representation
8. Revision Pending expression (enum / derived / relationship query)
9. When SupportPlan.currentVersion updates on N+1
10. Whether N+1 creation and Active / effective start are simultaneous or separate
11. Bidirectional traceability representation
12. Canonical field casing / naming
13. correction / cancellation / supersede in this Slice?
14. persistence port in this Slice?
15. UI integration in this Slice?
```

Do not treat as synonymous without Scope decision:

```text
N+1 exists
currentVersion = N+1
N+1 becomes effective
```

---

## 24. Acceptance Criteria

AC-1 … AC-18 as fixed in Correction-1 (Monitoring derived; PendingReview distinct;
Materials ≠ Outcome; NO_CHANGE persistable; CHANGE_REQUIRED before N+1 allowed;
Revision Pending valid; CHANGE_REQUIRED ≠ Revision complete; N+1 linkage;
N historical; context identified; reverse trace; conceptualNextVersion not SoR;
human authority; Assessment/User-master/Monitoring persistence out of scope;
currentVersion/activation deferred; casing conceptual at Definition; no impl mutation).

---

## 25. Expected Staff Explanation

Monitoring summarizes period records by plan version.
Review is a human decision to change or not.
NO_CHANGE leaves an explicit “reviewed, no change” result.
CHANGE_REQUIRED records need-to-change before a new plan version exists.
Creating the next plan version is a separate later step.
No Monitoring version entity is required.

---

## 26. Stop Condition (Definition)

```text
REVIEW-TO-PLAN-REVISION-RELATIONSHIP-DEFINITION-1
Correction-1
= HUMAN DEFINITION LOCKED

Implementation
= NOT STARTED / NOT AUTHORIZED by this Definition

Next after Lock
= Implementation Scope Definition
```
