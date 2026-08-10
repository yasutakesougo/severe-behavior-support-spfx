# Decision-AS-PILOT-LIST-OWNERSHIP-1 — pilot List ownership / 正本責務 Human Acceptance

この文書は、**Decision-AS-PILOT-LIST-OWNERSHIP-1**（事業所サイト内 2 List slot の
正本責務）についての **Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-pilot-list-ownership-packet.md`](./decision-assessment-snapshot-pilot-list-ownership-packet.md)

Read-only ownership check:
[`decision-assessment-snapshot-pilot-list-ownership-check.md`](./decision-assessment-snapshot-pilot-list-ownership-check.md)

Selected via:
[`decision-ilb-1-twenty-fifth-residual-pilot-list-ownership-selection.md`](./decision-ilb-1-twenty-fifth-residual-pilot-list-ownership-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-pilot-facility-identity-acceptance.md`](./decision-assessment-snapshot-pilot-facility-identity-acceptance.md)
（Decision-AS-PILOT-FACILITY-IDENTITY-1 = PO-1+FK-1+SN-1+LN-D+XB-1）
[`decision-assessment-snapshot-sp-placement-acceptance.md`](./decision-assessment-snapshot-sp-placement-acceptance.md)
（Decision-AS-SP-PLACEMENT-1 = SV-1+LV-1+CN-1+SC-1；LV-3 NOT SELECTED）
[`decision-assessment-snapshot-org-site-topology-acceptance.md`](./decision-assessment-snapshot-org-site-topology-acceptance.md)
（Decision-AS-ORG-SITE-TOPOLOGY-1 = OT-1+FS-1+SP-1+PP-1+PH-1+XB-1）
[`decision-assessment-snapshot-target-reuse-acceptance.md`](./decision-assessment-snapshot-target-reuse-acceptance.md)
（Decision-AS-TARGET-REUSE-1 = B）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-PILOT-LIST-OWNERSHIP-1
Status: Accepted / LOCKED
Human Decision: LO-1 + VP-1 + EX-1 + NB-1 + XB-1
Human Acceptance: Explicit Human Decision on 2026-08-09
Human Accept phrase:
  「LO-1 + VP-1 + EX-1 + NB-1 + XB-1 でいく」

LOCKED（axes）:

List ownership pairing:
  LO-1 — List A = SupportPlan 正本（facility）
         List B = AssessmentSnapshot 正本（facility）

SupportPlanVersion placement:
  VP-1 — SupportPlanVersion は SupportPlan 正本 List（List A）に同居

Exclusion boundary:
  EX-1 — AuditEvent（SBS_AUDIT_EVENTS）と DailyActivityRecords は
         本 2 slot に入れない

Naming boundary:
  NB-1 — 本 Decision では具体 List names を発明・固定しない
         names は ownership LOCK 後の別 Human Decision

Execution boundary:
  XB-1 — ownership Acceptance ≠ List name Acceptance ≠ Site/List creation GO

LOCKED（ownership payload）:

  List A（facility）:
    正本責務 = SupportPlan
    同居     = SupportPlanVersion（VP-1）
    Schema   = severe-behavior-support.support-plan.plan @ 1.0.0
               severe-behavior-support.support-plan.plan-version @ 1.0.0
    List name = NOT SELECTED / DEFERRED（NB-1）

  List B（facility）:
    正本責務 = AssessmentSnapshot
    Schema   = severe-behavior-support.assessment-snapshot.snapshot @ 1.0.0
    List name = NOT SELECTED / DEFERRED（NB-1）
    ≠ SupportPlan List（LV-3 NOT SELECTED 維持）

  Excluded from these 2 slots:
    AuditEvent → SBS_AUDIT_EVENTS（法人共通；#29）
    DailyActivityRecords → REFERENCE ONLY（TARGET-REUSE-1 = B）

List names:
  DEFERRED / NOT SELECTED
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
  Decision-AS-PILOT-LIST-OWNERSHIP-1（LO/VP/EX/NB/XB）
  List A / List B 正本責務 pairing
Does NOT close:
  concrete List names
  live SV-1 / LV-1 confirmation
  Site / List / column creation
  tenant mutation
  Implementation Start
  SharePoint / adapter / application 実装
  Schema / DTO コード割当
  FindingCode / A-5
  post-retention deletion
Implementation auto-start: FORBIDDEN
Site / List creation auto-start: FORBIDDEN
List name invention: FORBIDDEN
Schema ID = List name: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: LO-1 + VP-1 + EX-1 + NB-1 + XB-1
Decision-AS-PILOT-LIST-OWNERSHIP-1: Accepted / LOCKED

List ownership pairing:      LO-1
SupportPlanVersion placement: VP-1
Exclusion boundary:          EX-1
Naming boundary:             NB-1
Execution boundary:          XB-1

Human Accept phrase:
  「LO-1 + VP-1 + EX-1 + NB-1 + XB-1 でいく」
```

日本語正本:

```text
LO-1:
  List A = SupportPlan の施設サイト正本
  List B = AssessmentSnapshot の施設サイト正本
VP-1:
  SupportPlanVersion は List A（SupportPlan 正本）に同居する
EX-1:
  AuditEvent と DailyActivityRecords は本 2 slot に入れない
NB-1:
  具体 List names は本 Decision で決めない
XB-1:
  ownership Acceptance だけでは List names 確定にも作成にも進まない
```

```text
Agent recommendation（LO-1 + VP-1 + EX-1 + NB-1 + XB-1）:
  NOT Human Acceptance evidence by itself
This document records the Human Decision only.
Human Accept phrase is recorded verbatim.
```

## Accepted 内容

```text
Decision-AS-PILOT-LIST-OWNERSHIP-1: Accepted / LOCKED

List ownership pairing:       LO-1
SupportPlanVersion placement: VP-1
Exclusion boundary:           EX-1
Naming boundary:              NB-1
Execution boundary:           XB-1

NOT SELECTED:
  LO-2 / LO-HOLD
  VP-2 / VP-HOLD
  EX-2 / EX-HOLD
  NB-2 / NB-HOLD
  XB-2 / XB-HOLD
```

### LOCKED ownership payload

```text
List A（facility）:
  正本責務 = SupportPlan
  同居     = SupportPlanVersion
  List name = DEFERRED（NB-1）

List B（facility）:
  正本責務 = AssessmentSnapshot
  List name = DEFERRED（NB-1）
  ≠ List A

Excluded:
  AuditEvent（SBS_AUDIT_EVENTS / 法人共通）
  DailyActivityRecords（REFERENCE ONLY）

Site / List creation: NO-GO（XB-1）
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-PILOT-LIST-OWNERSHIP-1 Accepted = List names 確定
  Decision-AS-PILOT-LIST-OWNERSHIP-1 Accepted = Site / List 作成 GO
  Decision-AS-PILOT-LIST-OWNERSHIP-1 Accepted = SV-1 / LV-1 CONFIRMED
  Decision-AS-PILOT-LIST-OWNERSHIP-1 Accepted = tenant mutation GO
  Decision-AS-PILOT-LIST-OWNERSHIP-1 Accepted = Implementation Start
  Decision-AS-PILOT-LIST-OWNERSHIP-1 Accepted = SharePoint / adapter コード開始
  Decision-AS-PILOT-LIST-OWNERSHIP-1 Accepted = Schema / DTO コード割当
  Schema ID = List name
  SupportPlans / AssessmentSnapshots = Accepted names（まだ CANDIDATE）
  XXXXX / YYYYY = 作成対象として復活
```

## Acceptance boundary

```text
This Acceptance locks List A / List B 正本責務 pairing only.

MUST NOT start from this Acceptance alone:
  inventing or Accepting concrete List names
  creating Site / List / columns
  treating Schema IDs as List names
  treating INTENDED Site URLs as CREATED
  tenant / SharePoint / Entra / M365 changes
  TypeScript / application / adapter / DTO code
  Schema / DTO code assignment
  FindingCode / A-5
  post-retention deletion
  Implementation Start
  Deploy / real data
```

## Next

```text
Decision-AS-PILOT-LIST-OWNERSHIP-1: Accepted / LOCKED / LO-1 + VP-1 + EX-1 + NB-1 + XB-1
LOCKED ownership:
  List A = SupportPlan + SupportPlanVersion
  List B = AssessmentSnapshot
Decision-AS-PILOT-LIST-NAMES-1: Accepted / LOCKED / LN-1 + XB-1
  List A = SupportPlans
  List B = AssessmentSnapshots
Decision-AS-PILOT-PROVISION-EXEC-1: Accepted / LOCKED / PX-1 + VR-1 + FG-1 + XB-1 + EG-1 + AP-1
Execution GO: GIVEN
AI SharePoint mutation: FORBIDDEN（DEC-AI-ORG-003）
Separate Human creation: COMPLETED（Site + List only）
Intent = Observed / Mismatch = 0
Site count = 2 / 2
List count = 4 / 4
SV-1: CONFIRMED
LV-1: CONFIRMED
VR-1: PASS
CN-1: OPEN
Independent Review #187: PASS（P0=0 / P1=0 / P2=0）
  → decision-assessment-snapshot-pr-187-independent-review.md
Next gate: FIXED
  Ready gate（Human）
  → decision-assessment-snapshot-pilot-provision-exec-next-gate.md
  evidence: decision-assessment-snapshot-pilot-provision-vr1-evidence.md
Site / List creation: COMPLETED
Placeholder creation: FORBIDDEN
Implementation Start: HOLD
SharePoint implementation: DO NOT START
tenant changes: NO-GO
Schema / DTO: HOLD
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```
