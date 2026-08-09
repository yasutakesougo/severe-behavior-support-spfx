# Decision-AS-NEW-TARGET-NAMES-1 — new SPFx Site / List naming Human Acceptance

この文書は、**Decision-AS-NEW-TARGET-NAMES-1**（新 SPFx 用 Site / List の
concrete naming / value 方針）についての **Human Acceptance 正本（LOCKED）** である。

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
Status: Accepted / LOCKED（axes） / values OPEN
Human Decision: SU-1 + LN-1 + IN-1 + XB-1
Human Acceptance: Explicit Human Decision on 2026-08-09

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

Concrete value payload（SU-1 / LN-1 — 本 Acceptance 時点では未記入）:
  New Site URL:     NOT SELECTED / OPEN
  New Site name:    NOT SELECTED / OPEN
  New List name(s): NOT SELECTED / OPEN
  Internal Names:   OPEN（IN-1 — post-creation CN-1）

New SPFx deployment target:
  TOPOLOGY LOCKED（ST-1 + LT-1）/ NOT CREATED / HOLD
  Naming axes LOCKED（SU-1 + LN-1 + IN-1 + XB-1）
  Concrete strings: NOT SELECTED / OPEN

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
Does NOT close:
  concrete Site URL / Site name / List name(s) 文字列
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
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: SU-1 + LN-1 + IN-1 + XB-1
Decision-AS-NEW-TARGET-NAMES-1: Accepted / LOCKED（axes） / values OPEN

Site URL / Site name mode:  SU-1
List names mode:            LN-1
Internal Column Names:      IN-1
Execution boundary:         XB-1
```

日本語正本:

```text
SU-1:
  具体 Site URL / Site name は Human が Acceptance で明示する。
  Agent は Accepted 値を発明しない。
LN-1:
  具体 List name(s) は Human が Acceptance で明示する。
  Agent は Accepted 値を発明しない。
IN-1:
  Internal Column Names は本 Decision で発明・固定しない。
  作成後に CN-1 で確定する。
XB-1:
  naming axes Acceptance だけでは Site / List を作成しない。
  実 provisioning / tenant mutation は別 Human gate。
```

```text
Agent recommendation（SU-1 + LN-1 + IN-1 + XB-1）:
  NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-AS-NEW-TARGET-NAMES-1: Accepted / LOCKED（axes） / values OPEN

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

具体文字列（LOCKED として埋めない / Agent 発明しない）:

```text
New Site URL:     NOT SELECTED / OPEN（SU-1 payload pending Human fill）
New Site name:    NOT SELECTED / OPEN（SU-1 payload pending Human fill）
New List name(s): NOT SELECTED / OPEN（LN-1 payload pending Human fill）
Internal Names:   OPEN（IN-1 — post-creation CN-1）
Site / List creation: NO-GO
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-NEW-TARGET-NAMES-1 axes Accepted = concrete Site URL / List name 確定
  Decision-AS-NEW-TARGET-NAMES-1 axes Accepted = Site / List 作成 GO
  Decision-AS-NEW-TARGET-NAMES-1 axes Accepted = tenant mutation GO
  Decision-AS-NEW-TARGET-NAMES-1 axes Accepted = Implementation Start
  Decision-AS-NEW-TARGET-NAMES-1 axes Accepted = SharePoint / adapter コード開始
  Decision-AS-NEW-TARGET-NAMES-1 axes Accepted = Schema / DTO コード割当
  Decision-AS-NEW-TARGET-NAMES-1 axes Accepted = Internal Names CONFIRMED
  Decision-AS-NEW-TARGET-NAMES-1 axes Accepted = FindingCode / A-5 再開
  Decision-AS-NEW-TARGET-NAMES-1 axes Accepted = post-retention 開始
```

## Acceptance boundary

```text
This Acceptance locks naming axes only（SU-1 + LN-1 + IN-1 + XB-1）.

MUST NOT start from this Acceptance alone:
  inventing Site URL / Site name / List names / Internal Names
  filling SU-1 / LN-1 blanks without Human-provided strings
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
Decision-AS-NEW-TARGET-NAMES-1: Accepted / LOCKED（axes） / SU-1 + LN-1 + IN-1 + XB-1
Concrete Site URL / Site name / List names: NOT SELECTED / OPEN
  → next Human fill: SU-1 / LN-1 concrete strings
Internal Column Names: OPEN（IN-1 — post-creation CN-1）
Site / List creation: NO-GO（XB-1；別 Human gate）
New SPFx deployment target: TOPOLOGY LOCKED / NOT CREATED / HOLD
Implementation Start: HOLD
SharePoint implementation: DO NOT START
tenant changes: NO-GO
Schema / DTO: HOLD
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```
