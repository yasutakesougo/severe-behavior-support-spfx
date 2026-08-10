# Decision-AS-PILOT-LIST-NAMES-1 — pilot List names Human Acceptance

この文書は、**Decision-AS-PILOT-LIST-NAMES-1**（facility List A / List B の
concrete List names）についての **Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-pilot-list-names-packet.md`](./decision-assessment-snapshot-pilot-list-names-packet.md)

Selected via:
[`decision-ilb-1-twenty-sixth-residual-pilot-list-names-selection.md`](./decision-ilb-1-twenty-sixth-residual-pilot-list-names-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-pilot-list-ownership-acceptance.md`](./decision-assessment-snapshot-pilot-list-ownership-acceptance.md)
（Decision-AS-PILOT-LIST-OWNERSHIP-1 = LO-1+VP-1+EX-1+NB-1+XB-1）
[`decision-assessment-snapshot-pilot-facility-identity-acceptance.md`](./decision-assessment-snapshot-pilot-facility-identity-acceptance.md)
（Decision-AS-PILOT-FACILITY-IDENTITY-1 = PO-1+FK-1+SN-1+LN-D+XB-1）
[`decision-assessment-snapshot-new-target-names-acceptance.md`](./decision-assessment-snapshot-new-target-names-acceptance.md)
（Decision-AS-NEW-TARGET-NAMES-1；XXXXX/YYYYY = PLACEHOLDER）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-PILOT-LIST-NAMES-1
Status: Accepted / LOCKED
Human Decision: LN-1 + XB-1
Human Acceptance: Explicit Human Decision on 2026-08-09
Human Accept phrase:
  「SupportPlans / AssessmentSnapshots でいく」

LOCKED（axes）:

List names mode:
  LN-1 — Human Acceptance で具体 List names を明示採択する
         Agent は Accepted 値を発明しない

Execution boundary:
  XB-1 — List naming Acceptance ≠ Site/List creation GO

LOCKED（Human-provided intended List names）:

  List A:
    Name: SupportPlans
    Ownership: SupportPlan 正本 + SupportPlanVersion 同居
    Status: HUMAN-PROVIDED / INTENDED / NOT CREATED / NOT CONFIRMED

  List B:
    Name: AssessmentSnapshots
    Ownership: AssessmentSnapshot 正本
    Status: HUMAN-PROVIDED / INTENDED / NOT CREATED / NOT CONFIRMED

  Excluded:
    AuditEvent
    DailyActivityRecords

Supersedes as creatable List-name targets:
  NAMES-1 placeholders XXXXX / YYYYY = PLACEHOLDER / SUPERSEDED FOR CREATION

Common across facilities:
  全事業所サイトで同一 List names を用いる（1 SPFx / 複数サイト）

Internal Column Names:
  OPEN（post-creation CN-1）
Site / List / column creation:
  NO-GO（XB-1）
tenant mutation:
  NO-GO
Implementation Start:
  HOLD
SharePoint implementation:
  DO NOT START
Schema / DTO code:
  HOLD / NOT STARTED
Deploy / real data:
  NO-GO
FindingCode / A-5:
  HOLD
Post-retention deletion:
  OPEN / AUTO-START FORBIDDEN

Closes only:
  Decision-AS-PILOT-LIST-NAMES-1（LN/XB）
  Human-provided intended List names SupportPlans / AssessmentSnapshots
Does NOT close:
  Site / List / column creation
  live SV-1 / LV-1 confirmation
  Internal Column Names / CN-1
  tenant mutation
  Implementation Start
  SharePoint / adapter / application 実装
  Schema / DTO コード割当
  FindingCode / A-5
  post-retention deletion
Implementation auto-start: FORBIDDEN
Site / List creation auto-start: FORBIDDEN
Treating INTENDED as OBSERVED / CONFIRMED / CREATED: FORBIDDEN
Schema ID = List name: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: LN-1 + XB-1
Decision-AS-PILOT-LIST-NAMES-1: Accepted / LOCKED

List names mode:     LN-1
Execution boundary:  XB-1

Human Accept phrase:
  「SupportPlans / AssessmentSnapshots でいく」

Human-provided intended values:
  List A: SupportPlans
  List B: AssessmentSnapshots
```

日本語正本:

```text
LN-1:
  List A 名 = SupportPlans
  List B 名 = AssessmentSnapshots
  Agent は Accepted 値を発明しない
XB-1:
  List naming Acceptance だけでは Site / List を作成しない
```

```text
Agent recommendation（SupportPlans / AssessmentSnapshots）:
  NOT Human Acceptance evidence by itself
This document records the Human Decision only.
Human Accept phrase and payload are recorded verbatim.
```

## Accepted 内容

```text
Decision-AS-PILOT-LIST-NAMES-1: Accepted / LOCKED

List names mode:     LN-1
Execution boundary:  XB-1

NOT SELECTED:
  LN-2 / LN-HOLD
  XB-2 / XB-HOLD
```

### LOCKED naming payload

```text
List A:
  Name: SupportPlans
  Ownership: SupportPlan 正本 + SupportPlanVersion 同居
  = HUMAN-PROVIDED / INTENDED
  ≠ OBSERVED / CONFIRMED / CREATED

List B:
  Name: AssessmentSnapshots
  Ownership: AssessmentSnapshot 正本
  = HUMAN-PROVIDED / INTENDED
  ≠ OBSERVED / CONFIRMED / CREATED

Excluded:
  AuditEvent
  DailyActivityRecords

Site / List creation: NO-GO（XB-1）
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-PILOT-LIST-NAMES-1 Accepted = Site / List 作成 GO
  Decision-AS-PILOT-LIST-NAMES-1 Accepted = SV-1 / LV-1 CONFIRMED
  Decision-AS-PILOT-LIST-NAMES-1 Accepted = Internal Names CONFIRMED
  Decision-AS-PILOT-LIST-NAMES-1 Accepted = tenant mutation GO
  Decision-AS-PILOT-LIST-NAMES-1 Accepted = Implementation Start
  Decision-AS-PILOT-LIST-NAMES-1 Accepted = SharePoint / adapter コード開始
  HUMAN-PROVIDED / INTENDED = OBSERVED / CONFIRMED / CREATED
  Schema ID = List name
  XXXXX / YYYYY = 作成対象として復活
```

## Acceptance boundary

```text
This Acceptance locks concrete List names only.

MUST NOT start from this Acceptance alone:
  creating Site / List / columns
  treating INTENDED values as live OBSERVED / CONFIRMED
  inventing different List names
  tenant / SharePoint / Entra / M365 changes
  TypeScript / application / adapter / DTO code
  Schema / DTO code assignment
  FindingCode / A-5
  post-retention deletion
  Implementation Start
  Deploy / real data
```

## Relation to Sites / ownership

```text
Sites（LOCKED INTENDED）:
  /sites/severe-support-isogo
  /sites/severe-support-honmoku

Lists on each facility Site（LOCKED INTENDED）:
  SupportPlans
  AssessmentSnapshots

Ownership（LOCKED）:
  SupportPlans → SupportPlan + SupportPlanVersion
  AssessmentSnapshots → AssessmentSnapshot

Creation: NO-GO until separate Human execution gate
```

## Next

```text
Decision-AS-PILOT-LIST-NAMES-1: Accepted / LOCKED / LN-1 + XB-1
LOCKED INTENDED Lists:
  SupportPlans
  AssessmentSnapshots
Next gate: FIXED
  EXPLICIT SITE/LIST CREATION EXECUTION
  → decision-assessment-snapshot-pilot-provision-exec-next-gate.md
Execution GO: NOT GIVEN / NO-GO
Site / List creation: NO-GO
Placeholder creation: FORBIDDEN
Implementation Start: HOLD
SharePoint implementation: DO NOT START
tenant changes: NO-GO
Schema / DTO: HOLD
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```
