# Decision-AS-PILOT-LIST-OWNERSHIP-1 — pilot List ownership / 正本責務

この文書は、Decision-AS-PILOT-FACILITY-IDENTITY-1 Accepted / LOCKED を前提に、
**事業所サイト内 2 List slot の正本責務**を判断する Human Decision Packet である。

Accepted 正本:
[`decision-assessment-snapshot-pilot-list-ownership-acceptance.md`](./decision-assessment-snapshot-pilot-list-ownership-acceptance.md)

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

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-PILOT-LIST-OWNERSHIP-1
Kind: Human Decision packet（compare → CONSUMED）
Status: CONSUMED（Human Decision Accepted / LOCKED）
Human Decision: LO-1 + VP-1 + EX-1 + NB-1 + XB-1
Human Selected:
  List ownership pairing:       LO-1
  SupportPlanVersion placement: VP-1
  Exclusion boundary:           EX-1
  Naming boundary:              NB-1
  Execution boundary:           XB-1
Human Accept phrase:
  「LO-1 + VP-1 + EX-1 + NB-1 + XB-1 でいく」
Selected via:
  decision-ilb-1-twenty-fifth-residual-pilot-list-ownership-selection.md

Current state:
  List ownership pairing = Accepted / LOCKED
  List names = DEFERRED
  Site / List creation = NO-GO
  Placeholder creation = FORBIDDEN
  Implementation Start = HOLD
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Question

```text
事業所サイト内の 2 つの List slot は、それぞれ何の正本か。

- SupportPlan 正本を facility List に置くか
- AssessmentSnapshot 正本を別 facility List に置くか
- SupportPlanVersion は SupportPlan と同じ List か
- AuditEvent / DailyActivityRecords をこの 2 slot に入れないことを維持するか
- ownership Acceptance で List names / 作成まで進めてよいか
```

```text
Historical note:
  候補・Agent recommendation は比較用。
  採択は Acceptance 正本のみが LOCKED である。
  Schema ID ≠ List name。
```

## 2. Compare axes（比較履歴）

### LO — List ownership pairing

| ID | 内容 | 結果 |
|---|---|---|
| **LO-1** | List A = SupportPlan 正本（facility）／ List B = AssessmentSnapshot 正本（facility） | **Accepted** |
| LO-2 | List A / B を別 entity 組合せにする（Human が明示） | NOT SELECTED |
| LO-HOLD | 正本責務をまだ決めない | NOT SELECTED |

### VP — SupportPlanVersion placement

| ID | 内容 | 結果 |
|---|---|---|
| **VP-1** | SupportPlanVersion は SupportPlan 正本 List（List A）に同居させる | **Accepted** |
| VP-2 | SupportPlanVersion を第3 List にする | NOT SELECTED |
| VP-HOLD | Version 配置をまだ決めない | NOT SELECTED |

### EX — Exclusion boundary

| ID | 内容 | 結果 |
|---|---|---|
| **EX-1** | AuditEvent（`SBS_AUDIT_EVENTS`）と DailyActivityRecords は本 2 slot に入れない | **Accepted** |
| EX-2 | どちらかを facility 2 slot に入れる | NOT SELECTED |
| EX-HOLD | 除外境界未決定 | NOT SELECTED |

### NB — Naming boundary

| ID | 内容 | 結果 |
|---|---|---|
| **NB-1** | 本 Decision では具体 List names を発明・固定しない。names は ownership LOCK 後の別 Human Decision | **Accepted** |
| NB-2 | ownership と同時に List names も Agent が決める | NOT SELECTED |
| NB-HOLD | naming boundary 未決定 | NOT SELECTED |

### XB — Execution boundary

| ID | 内容 | 結果 |
|---|---|---|
| **XB-1** | ownership Acceptance ≠ List name Acceptance ≠ Site/List creation GO | **Accepted** |
| XB-2 | ownership Acceptance と同時に作成する | NOT SELECTED |
| XB-HOLD | execution boundary 未決定 | NOT SELECTED |

## 3. Accepted ownership（LOCKED）

```text
Status: Accepted / LOCKED
Human Decision: LO-1 + VP-1 + EX-1 + NB-1 + XB-1
```

```text
List A（facility）:
  正本責務 = SupportPlan
  Version   = SupportPlanVersion を同一 List に同居（VP-1）

List B（facility）:
  正本責務 = AssessmentSnapshot
  （LV-3: SupportPlan List と同一視しない）

Excluded from these 2 slots:
  AuditEvent → SBS_AUDIT_EVENTS（法人共通）
  DailyActivityRecords → REFERENCE ONLY
```

## 4. Contingent List name candidates（still NOT this Decision）

| Role | Candidate display | Candidate English name | Status |
|---|---|---|---|
| List A | 支援計画 | `SupportPlans` | CONTINGENT / NOT LOCKED |
| List B | アセスメントスナップショット | `AssessmentSnapshots` | CONTINGENT / NOT LOCKED |

```text
List names は別 Decision（NB-1）。
```

## 5. Explicit non-authorization

```text
This packet / Acceptance does NOT authorize:
  Accepting List names
  creating Site / List / columns
  creating with XXXXX / YYYYY
  treating Schema ID as List name
  reopening AuditEvent store mapping
  Implementation Start
  SharePoint / adapter / application implementation
  Deploy / real data
```

## 6. Next after Human Acceptance

```text
Decision-AS-PILOT-LIST-OWNERSHIP-1: Accepted / LOCKED / LO-1 + VP-1 + EX-1 + NB-1 + XB-1
  → decision-assessment-snapshot-pilot-list-ownership-acceptance.md
Decision-AS-PILOT-LIST-NAMES-1: Accepted / LOCKED / LN-1 + XB-1
  SupportPlans / AssessmentSnapshots
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
```
