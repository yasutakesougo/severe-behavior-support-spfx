# Next gate — Pilot List names

この文書は、**Decision-AS-PILOT-LIST-OWNERSHIP-1 Accepted / LOCKED /
LO-1+VP-1+EX-1+NB-1+XB-1** 後の次 Human gate を固定する正本である。

Ownership 正本:
[`decision-assessment-snapshot-pilot-list-ownership-acceptance.md`](./decision-assessment-snapshot-pilot-list-ownership-acceptance.md)

Site identity 正本:
[`decision-assessment-snapshot-pilot-facility-identity-acceptance.md`](./decision-assessment-snapshot-pilot-facility-identity-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Next-gate definition（docs-only）
Status: FIXED / NOT STARTED
Authorization basis:
  Decision-AS-PILOT-LIST-OWNERSHIP-1 = Accepted / LOCKED
    / LO-1 + VP-1 + EX-1 + NB-1 + XB-1

Next gate:
  PILOT LIST NAMES

List naming GO: NOT GIVEN / NOT STARTED
Creation GO: NOT GIVEN / NO-GO
This document does NOT invent Accepted List names and does NOT start tenant mutation.
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Fixed next gate

```text
Next gate:
  PILOT LIST NAMES

Sequence after Human naming Decision:
  1. Human が List A / List B の正式 List name(s) を明示採択する
  2. Agent は Accepted 値を発明しない
  3. STOP（作成はさらに別 Human execution gate）

NOT next:
  Site/List creation
  inventing List names without Human Accept
  creating with XXXXX / YYYYY
```

## 2. Locked ownership（do not re-decide）

```text
List A（facility）:
  正本責務 = SupportPlan
  同居     = SupportPlanVersion
  List name = NOT SELECTED

List B（facility）:
  正本責務 = AssessmentSnapshot
  List name = NOT SELECTED

Excluded:
  AuditEvent → SBS_AUDIT_EVENTS（法人共通）
  DailyActivityRecords → REFERENCE ONLY
```

## 3. Contingent name candidates（NOT LOCKED）

```text
Status: CONTINGENT CANDIDATE / NOT ACCEPTED / NOT LOCKED
Schema ID ≠ List name

List A candidates:
  display: 支援計画
  english: SupportPlans
  alternates: SBS_SupportPlans / SupportPlanRecords

List B candidates:
  display: アセスメントスナップショット
  english: AssessmentSnapshots
  alternates: SBS_AssessmentSnapshots / AssessmentSnapshotRecords
```

```text
These remain candidates until a separate Human List-names Decision Accepts them
（or an explicit alternate payload）.
```

## 4. Locked Site identity（do not re-decide）

```text
Pilot 1:
  磯子活動ホーム / isogo
  https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo

Pilot 2:
  本牧活動ホーム / honmoku
  https://isogokatudouhome.sharepoint.com/sites/severe-support-honmoku

Status: HUMAN-PROVIDED / INTENDED / NOT CREATED / NOT CONFIRMED
```

## 5. Out of scope（unchanged）

```text
Site / List creation: NO-GO
custom columns: NO-GO
Internal Column Names: OPEN / post-creation CN-1
permissions / config: NO-GO
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Deploy / real data: NO-GO
Schema / DTO code assignment: HOLD
FindingCode / A-5: HOLD
post-retention deletion: OPEN / AUTO-START FORBIDDEN
Common management site naming / creation: 別 Human Decision
```

## 6. Explicit non-start

```text
This next-gate definition alone does NOT:
  Accept / LOCK List names
  create Site / List / columns
  perform tenant mutation
  mark SV-1 / LV-1 CONFIRMED
  authorize PROVISION-EXEC Execution GO
  start Implementation / SharePoint code / Deploy

Requires separate explicit Human Decision for List names.
Creation remains a later Human execution gate after List names exist.
```

## 7. Current state

```text
Decision-AS-PILOT-LIST-OWNERSHIP-1: Accepted / LOCKED / LO-1 + VP-1 + EX-1 + NB-1 + XB-1
Next gate: FIXED = PILOT LIST NAMES
List names: DEFERRED / NOT SELECTED
Site / List creation: NO-GO
Placeholder creation: FORBIDDEN
PROVISION-EXEC Execution GO: NOT GIVEN
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Deploy / real data: NO-GO

Current stop:
  waiting for Human Accept of concrete List names
  auto-start: FORBIDDEN
```
