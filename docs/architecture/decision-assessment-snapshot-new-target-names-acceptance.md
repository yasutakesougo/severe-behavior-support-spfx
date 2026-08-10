# Decision-AS-NEW-TARGET-NAMES-1 — new SPFx Site / List naming Human Acceptance

この文書は、**Decision-AS-NEW-TARGET-NAMES-1**（新 SPFx 用 Site / List の
concrete naming / value）についての **Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-new-target-names-packet.md`](./decision-assessment-snapshot-new-target-names-packet.md)

Selected via:
[`decision-ilb-1-twenty-first-residual-new-spfx-target-names-selection.md`](./decision-ilb-1-twenty-first-residual-new-spfx-target-names-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-new-target-provisioning-acceptance.md`](./decision-assessment-snapshot-new-target-provisioning-acceptance.md)
（Decision-AS-NEW-TARGET-PROVISION-1 = ST-1+LT-1+NM-1+EX-1）
[`decision-assessment-snapshot-target-reuse-acceptance.md`](./decision-assessment-snapshot-target-reuse-acceptance.md)
（Decision-AS-TARGET-REUSE-1 = B）
[`decision-assessment-snapshot-sp-placement-acceptance.md`](./decision-assessment-snapshot-sp-placement-acceptance.md)
（Decision-AS-SP-PLACEMENT-1 = SV-1+LV-1+CN-1+SC-1）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-NEW-TARGET-NAMES-1
Status: Accepted / LOCKED
Human Decision: SU-1 + LN-1 + IN-1 + XB-1
Human Acceptance: Explicit Human Decision on 2026-08-09
Human value fill: Explicit Human-provided SU-1 / LN-1 strings on 2026-08-09

Baseline（PR #184 MERGED）:
  expected head: 84745355929c7e43dcc6c89dd00d29935f79034c
  merge commit:  0be50a12e3699d187bce0f27caa732f3e7ccea24
  status: MERGED

LOCKED（axes）:

Site URL / Site name mode:
  SU-1 — Human Acceptance で具体 Site URL + Site name を明示採択する
         Agent は Accepted 値を発明しない

List names mode:
  LN-1 — Human Acceptance で具体 List name(s) を明示採択する
         Agent は Accepted 値を発明しない

Internal Column Names:
  IN-1 — 本 Decision では Internal Column Names を発明・固定しない
         作成後に CN-1（実 SharePoint 確認）で確定

Execution boundary:
  XB-1 — naming Acceptance ≠ Site/List creation GO
         実 tenant mutation / provisioning は別 Human gate

LOCKED（SU-1 / LN-1 Human-provided intended values）:

  New Site URL:
    https://isogokatudouhome.sharepoint.com/sites/XXXXX
    Status: HUMAN-PROVIDED / INTENDED
            NOT CREATED / NOT CONFIRMED（SV-1 pending）

  New Site name:
    XXXXX
    Status: HUMAN-PROVIDED / INTENDED
            NOT CREATED / NOT CONFIRMED（SV-1 pending）

  New List name(s):
    XXXXX
    YYYYY
    Status: HUMAN-PROVIDED / INTENDED
            NOT CREATED / NOT CONFIRMED（LV-1 pending）

  Internal Names:
    OPEN（IN-1 — post-creation CN-1）

New SPFx deployment target:
  TOPOLOGY LOCKED（ST-1 + LT-1）/ NOT CREATED / HOLD
  Naming axes LOCKED（SU-1 + LN-1 + IN-1 + XB-1）
  Concrete Site / List strings: LOCKED as HUMAN-PROVIDED / INTENDED
  Live confirmation: NOT CONFIRMED
  Creation: NO-GO（XB-1）

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
  Decision-AS-NEW-TARGET-NAMES-1 naming axes（SU/LN/IN/XB）
  SU-1 / LN-1 Human-provided intended Site URL / Site name / List names
Does NOT close:
  live SV-1 / LV-1 confirmation
  Internal Column Names（IN-1）
  Site / List / column creation
  tenant mutation
  Implementation Start
  SharePoint / adapter / application 実装
  Schema / DTO コード割当
  FindingCode / A-5
  post-retention deletion
Implementation auto-start: FORBIDDEN
Site / List creation auto-start: FORBIDDEN
Concrete name invention by Agent: FORBIDDEN
Treating INTENDED values as OBSERVED / CONFIRMED: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: SU-1 + LN-1 + IN-1 + XB-1
Decision-AS-NEW-TARGET-NAMES-1: Accepted / LOCKED

Site URL / Site name mode:  SU-1
List names mode:            LN-1
Internal Column Names:      IN-1
Execution boundary:         XB-1

Human-provided intended values:
  New Site URL:  https://isogokatudouhome.sharepoint.com/sites/XXXXX
  New Site name: XXXXX
  New List names:
    - XXXXX
    - YYYYY
```

日本語正本:

```text
SU-1:
  具体 Site URL / Site name は Human が明示した。
  Agent は Accepted 値を発明しない。
LN-1:
  具体 List name(s) は Human が明示した。
  Agent は Accepted 値を発明しない。
IN-1:
  Internal Column Names は本 Decision で発明・固定しない。
  作成後に CN-1 で確定する。
XB-1:
  naming Acceptance だけでは Site / List を作成しない。
  実 provisioning / tenant mutation は別 Human gate。
```

```text
Agent recommendation（SU-1 + LN-1 + IN-1 + XB-1）:
  NOT Human Acceptance evidence
This document records the Human Decision only.
Human-provided strings are recorded verbatim; Agent did not invent them.
```

## Accepted 内容

```text
Decision-AS-NEW-TARGET-NAMES-1: Accepted / LOCKED

Site URL / Site name mode:  SU-1
List names mode:            LN-1
Internal Column Names:      IN-1
Execution boundary:         XB-1

NOT SELECTED:
  SU-2 / SU-HOLD
  LN-2 / LN-HOLD
  IN-2 / IN-3 / IN-HOLD
  XB-2 / XB-HOLD
```

### SU-1 / LN-1 Human-provided intended values

```text
New Site URL:
  https://isogokatudouhome.sharepoint.com/sites/XXXXX
  = HUMAN-PROVIDED / INTENDED
  ≠ OBSERVED / CONFIRMED
  ≠ CREATED

New Site name:
  XXXXX
  = HUMAN-PROVIDED / INTENDED
  ≠ OBSERVED / CONFIRMED
  ≠ CREATED

New List name(s):
  XXXXX
  YYYYY
  = HUMAN-PROVIDED / INTENDED
  ≠ OBSERVED / CONFIRMED
  ≠ CREATED

Internal Names:
  OPEN（IN-1 — post-creation CN-1）

Site / List creation: NO-GO（XB-1）
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-NEW-TARGET-NAMES-1 Accepted = Site / List 作成 GO
  Decision-AS-NEW-TARGET-NAMES-1 Accepted = tenant mutation GO
  Decision-AS-NEW-TARGET-NAMES-1 Accepted = SV-1 / LV-1 CONFIRMED
  Decision-AS-NEW-TARGET-NAMES-1 Accepted = Internal Names CONFIRMED
  Decision-AS-NEW-TARGET-NAMES-1 Accepted = Implementation Start
  Decision-AS-NEW-TARGET-NAMES-1 Accepted = SharePoint / adapter コード開始
  Decision-AS-NEW-TARGET-NAMES-1 Accepted = Schema / DTO コード割当
  Decision-AS-NEW-TARGET-NAMES-1 Accepted = FindingCode / A-5 再開
  Decision-AS-NEW-TARGET-NAMES-1 Accepted = post-retention 開始
  HUMAN-PROVIDED / INTENDED = OBSERVED / CONFIRMED
```

## Acceptance boundary

```text
This Acceptance locks naming axes and Human-provided intended Site / List strings.

MUST NOT start from this Acceptance alone:
  inventing different Site URL / Site name / List names / Internal Names
  treating INTENDED values as live OBSERVED / CONFIRMED
  creating Site / List / columns
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
Decision-AS-NEW-TARGET-NAMES-1: Accepted / LOCKED / SU-1 + LN-1 + IN-1 + XB-1
Concrete Site / List strings: LOCKED as HUMAN-PROVIDED / INTENDED / PLACEHOLDER
  Site URL:  https://isogokatudouhome.sharepoint.com/sites/XXXXX
  Site name: XXXXX
  Lists:     XXXXX / YYYYY
  ≠ REAL / CREATABLE（Decision-AS-ORG-SITE-TOPOLOGY-1 / PH-1）
Live confirmation（SV-1 / LV-1）: NOT CONFIRMED
Internal Column Names: OPEN（IN-1 — post-creation CN-1）
Site / List creation: NO-GO（XB-1；placeholder 作成 FORBIDDEN）
PR #185: MERGED
  merge commit: 1aef0d3971165f6504f7f13d6e68a51d7cfdaf61
Decision-AS-ORG-SITE-TOPOLOGY-1: Accepted / LOCKED / OT-1 + FS-1 + SP-1 + PP-1 + PH-1 + XB-1
New SPFx deployment target: ORG TOPOLOGY LOCKED / NOT CREATED / HOLD
Implementation Start: HOLD
SharePoint implementation: DO NOT START
tenant changes: NO-GO
Schema / DTO: HOLD
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
Independent Re-review #185: PASS（P0=0 / P1=0 / P2=0）
  → decision-assessment-snapshot-pr-185-independent-review.md
  Reviewed HEAD: b37e3e6d0d3f925e8686f2e2805094b55479b024
Decision-AS-PILOT-FACILITY-IDENTITY-1: Accepted / LOCKED / PO-1 + FK-1 + SN-1 + LN-D + XB-1
  → decision-assessment-snapshot-pilot-facility-identity-acceptance.md
  磯子=isogo → /sites/severe-support-isogo
  本牧=honmoku → /sites/severe-support-honmoku
  （XXXXX / YYYYY = PLACEHOLDER / SUPERSEDED FOR CREATION）
Decision-AS-PILOT-LIST-OWNERSHIP-1: Accepted / LOCKED / LO-1 + VP-1 + EX-1 + NB-1 + XB-1
  List A = SupportPlan + SupportPlanVersion
  List B = AssessmentSnapshot
Decision-AS-PILOT-LIST-NAMES-1: Accepted / LOCKED / LN-1 + XB-1
  SupportPlans / AssessmentSnapshots
Decision-AS-PILOT-PROVISION-EXEC-1: Accepted / LOCKED / PX-1 + VR-1 + FG-1 + XB-1 + EG-1 + AP-1
Execution GO: GIVEN
AI SharePoint mutation: FORBIDDEN
Next Human gate: SEPARATE HUMAN SITE/LIST CREATION + VR-1 EVIDENCE RETURN
  → decision-assessment-snapshot-pilot-provision-exec-next-gate.md
Site / List creation: AUTHORIZED for Human separate process / NOT CREATED / Agent NO-GO
```
