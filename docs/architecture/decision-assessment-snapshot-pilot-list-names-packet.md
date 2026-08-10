# Decision-AS-PILOT-LIST-NAMES-1 — pilot List names

この文書は、Decision-AS-PILOT-LIST-OWNERSHIP-1 Accepted / LOCKED を前提に、
**facility List A / List B の concrete List names** を判断する Human Decision Packet である。

Accepted 正本:
[`decision-assessment-snapshot-pilot-list-names-acceptance.md`](./decision-assessment-snapshot-pilot-list-names-acceptance.md)

Selected via:
[`decision-ilb-1-twenty-sixth-residual-pilot-list-names-selection.md`](./decision-ilb-1-twenty-sixth-residual-pilot-list-names-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-pilot-list-ownership-acceptance.md`](./decision-assessment-snapshot-pilot-list-ownership-acceptance.md)
（Decision-AS-PILOT-LIST-OWNERSHIP-1 = LO-1+VP-1+EX-1+NB-1+XB-1）
[`decision-assessment-snapshot-pilot-facility-identity-acceptance.md`](./decision-assessment-snapshot-pilot-facility-identity-acceptance.md)
（Decision-AS-PILOT-FACILITY-IDENTITY-1 = PO-1+FK-1+SN-1+LN-D+XB-1）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-PILOT-LIST-NAMES-1
Kind: Human Decision packet（compare → CONSUMED）
Status: CONSUMED（Human Decision Accepted / LOCKED）
Human Decision: LN-1 + XB-1
Human Selected:
  List names mode:     LN-1
  Execution boundary:  XB-1
Human Accept phrase:
  「SupportPlans / AssessmentSnapshots でいく」
Human-provided intended values:
  List A: SupportPlans
  List B: AssessmentSnapshots
Selected via:
  decision-ilb-1-twenty-sixth-residual-pilot-list-names-selection.md

Current state:
  List names = HUMAN-PROVIDED / OBSERVED / CONFIRMED（VR-1 PASS）
  Site / List creation = NO-GO
  Placeholder creation = FORBIDDEN
  Implementation Start = HOLD
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Question

```text
List A（SupportPlan + SupportPlanVersion 正本）と
List B（AssessmentSnapshot 正本）の concrete List name を何か。

naming Acceptance ≠ Site/List creation GO。
Schema ID ≠ List name。
XXXXX / YYYYY は使わない。
```

## 2. Compare axes（比較履歴）

### LN — List names

| ID | 内容 | 結果 |
|---|---|---|
| **LN-1** | Human Acceptance で具体 List names を明示採択する。Agent は Accepted 値を発明しない | **Accepted** |
| LN-2 | Agent が具体 List names を発明して採択する | NOT SELECTED |
| LN-HOLD | List names をまだ決めない | NOT SELECTED |

### XB — Execution boundary

| ID | 内容 | 結果 |
|---|---|---|
| **XB-1** | List naming Acceptance ≠ Site/List creation GO | **Accepted** |
| XB-2 | naming Acceptance と同時に Site/List を作成する | NOT SELECTED |
| XB-HOLD | execution boundary 未決定 | NOT SELECTED |

## 3. Accepted naming payload（LOCKED as INTENDED）

```text
Status: HUMAN-PROVIDED / OBSERVED / CONFIRMED（VR-1 PASS）
≠ OBSERVED / CONFIRMED / CREATED
```

```text
List A:
  Name: SupportPlans
  Ownership: SupportPlan 正本 + SupportPlanVersion 同居

List B:
  Name: AssessmentSnapshots
  Ownership: AssessmentSnapshot 正本

Excluded:
  AuditEvent
  DailyActivityRecords
```

## 4. Agent recommendation（historical / NOT Acceptance）

```text
Agent / design recommendation:
  LN-1 + XB-1
  SupportPlans / AssessmentSnapshots

Human Accept phrase:
  「SupportPlans / AssessmentSnapshots でいく」

This recommendation was NOT Human Acceptance evidence by itself.
Human Acceptance is recorded in the Acceptance 正本 only.
```

## 5. Explicit non-authorization

```text
This packet / Acceptance does NOT authorize:
  Site / List / column creation
  treating INTENDED as OBSERVED / CONFIRMED / CREATED
  creating with XXXXX / YYYYY
  Internal Column Name invention as CONFIRMED
  Implementation Start
  SharePoint / adapter / application implementation
  Deploy / real data
```

## 6. Next after Human Acceptance

```text
Decision-AS-PILOT-LIST-NAMES-1: Accepted / LOCKED / LN-1 + XB-1
  → decision-assessment-snapshot-pilot-list-names-acceptance.md
Decision-AS-PILOT-PROVISION-EXEC-1: Accepted / LOCKED / PX-1 + VR-1 + FG-1 + XB-1 + EG-1 + AP-1
Execution GO: GIVEN
AI SharePoint mutation: FORBIDDEN
SV-1: CONFIRMED / LV-1: CONFIRMED / VR-1: PASS
CN-1: OPEN
Independent Review #187: PASS（P0=0 / P1=0 / P2=0）
  → decision-assessment-snapshot-pr-187-independent-review.md
Next gate: FIXED
  Ready gate（Human）
  → decision-assessment-snapshot-pilot-provision-exec-next-gate.md
  evidence: decision-assessment-snapshot-pilot-provision-vr1-evidence.md
Site / List creation: AUTHORIZED for Human separate process / NOT CREATED / Agent NO-GO
Implementation Start: HOLD
```
