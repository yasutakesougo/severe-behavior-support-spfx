# Next gate — Explicit Site/List creation execution

この文書は、**Decision-AS-PILOT-LIST-NAMES-1 Accepted / LOCKED / LN-1+XB-1** 後の
次 Human gate を固定する正本である。

List names 正本:
[`decision-assessment-snapshot-pilot-list-names-acceptance.md`](./decision-assessment-snapshot-pilot-list-names-acceptance.md)

Site identity 正本:
[`decision-assessment-snapshot-pilot-facility-identity-acceptance.md`](./decision-assessment-snapshot-pilot-facility-identity-acceptance.md)

Ownership 正本:
[`decision-assessment-snapshot-pilot-list-ownership-acceptance.md`](./decision-assessment-snapshot-pilot-list-ownership-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Next-gate definition（docs-only）
Status: FIXED / NOT STARTED
Authorization basis:
  Decision-AS-PILOT-LIST-NAMES-1 = Accepted / LOCKED / LN-1 + XB-1
  Decision-AS-PILOT-LIST-OWNERSHIP-1 = Accepted / LOCKED
  Decision-AS-PILOT-FACILITY-IDENTITY-1 = Accepted / LOCKED

Next gate:
  EXPLICIT SITE/LIST CREATION EXECUTION

Execution GO: NOT GIVEN / NOT STARTED / NO-GO
This document does NOT start tenant mutation.
Naming Acceptance ≠ creation GO.
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Fixed next gate

```text
Next gate:
  EXPLICIT SITE/LIST CREATION EXECUTION

Requires separate explicit Human GO before any:
  Site creation
  List creation
  tenant mutation
```

## 2. Intended creation targets（LOCKED INTENDED；not created）

```text
Pilot 1 Site:
  強度行動障害支援 - 磯子活動ホーム
  https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo

Pilot 2 Site:
  強度行動障害支援 - 本牧活動ホーム
  https://isogokatudouhome.sharepoint.com/sites/severe-support-honmoku

Lists on each facility Site:
  SupportPlans
    → SupportPlan 正本 + SupportPlanVersion 同居
  AssessmentSnapshots
    → AssessmentSnapshot 正本

Status: HUMAN-PROVIDED / INTENDED / NOT CREATED / NOT CONFIRMED
```

## 3. Out of scope（unchanged）

```text
custom columns: NO-GO until separate gate
Internal Column Names: OPEN / post-creation CN-1
permissions / config: NO-GO
Implementation Start: HOLD
SharePoint application/adapter code: DO NOT START
Deploy / real data: NO-GO
Schema / DTO code assignment: HOLD
FindingCode / A-5: HOLD
post-retention deletion: OPEN / AUTO-START FORBIDDEN
Common management site creation: 別 Human Decision
XXXXX / YYYYY creation: FORBIDDEN
```

## 4. Explicit non-start

```text
This next-gate definition alone does NOT:
  start Site / List creation
  perform tenant mutation
  mark SV-1 / LV-1 CONFIRMED
  invent alternate names
  create custom columns
  start Implementation / SharePoint code / Deploy

Requires separate explicit Human execution GO.
```

## 5. Current state

```text
Decision-AS-PILOT-LIST-NAMES-1: Accepted / LOCKED / LN-1 + XB-1
Next gate: FIXED = EXPLICIT SITE/LIST CREATION EXECUTION
Execution GO: NOT GIVEN / NOT STARTED / NO-GO
Site / List creation: NO-GO
Placeholder creation: FORBIDDEN
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Deploy / real data: NO-GO

Current stop:
  waiting for explicit Site/List creation execution GO
  auto-start: FORBIDDEN
```
