# Decision-AS-PILOT-LIST-OWNERSHIP-1 — pilot List ownership / 正本責務

この文書は、Decision-AS-PILOT-FACILITY-IDENTITY-1 Accepted / LOCKED を前提に、
**事業所サイト内 2 List slot の正本責務**を判断する Human Decision Packet である。

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
Kind: Human Decision packet（compare → OPEN）
Status: OPEN / NOT ACCEPTED
Human Decision: NOT SELECTED
Acceptance 正本: NOT CREATED

Selected via:
  decision-ilb-1-twenty-fifth-residual-pilot-list-ownership-selection.md

Current state:
  List ownership pairing = OPEN / NOT ACCEPTED
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
  本 packet は OPEN / NOT ACCEPTED。
```

## 2. Compare axes

### LO — List ownership pairing

| ID | 内容 | 結果 |
|---|---|---|
| **LO-1** | List A = SupportPlan 正本（facility）／ List B = AssessmentSnapshot 正本（facility） | CANDIDATE（recommended） |
| LO-2 | List A / B を別 entity 組合せにする（Human が明示） | NOT SELECTED |
| LO-HOLD | 正本責務をまだ決めない | NOT SELECTED |

### VP — SupportPlanVersion placement

| ID | 内容 | 結果 |
|---|---|---|
| **VP-1** | SupportPlanVersion は SupportPlan 正本 List（List A）に同居させる | CANDIDATE（recommended） |
| VP-2 | SupportPlanVersion を第3 List にする | NOT SELECTED（2-slot 前提と衝突しやすい） |
| VP-HOLD | Version 配置をまだ決めない | NOT SELECTED |

### EX — Exclusion boundary

| ID | 内容 | 結果 |
|---|---|---|
| **EX-1** | AuditEvent（`SBS_AUDIT_EVENTS`）と DailyActivityRecords は本 2 slot に入れない | CANDIDATE（required with Accept） |
| EX-2 | どちらかを facility 2 slot に入れる | NOT SELECTED |
| EX-HOLD | 除外境界未決定 | NOT SELECTED |

### NB — Naming boundary

| ID | 内容 | 結果 |
|---|---|---|
| **NB-1** | 本 Decision では具体 List names を発明・固定しない。names は ownership LOCK 後の別 Human Decision | CANDIDATE（required with Accept） |
| NB-2 | ownership と同時に List names も Agent が決める | NOT SELECTED |
| NB-HOLD | naming boundary 未決定 | NOT SELECTED |

### XB — Execution boundary

| ID | 内容 | 結果 |
|---|---|---|
| **XB-1** | ownership Acceptance ≠ List name Acceptance ≠ Site/List creation GO | CANDIDATE（required with Accept） |
| XB-2 | ownership Acceptance と同時に作成する | NOT SELECTED |
| XB-HOLD | execution boundary 未決定 | NOT SELECTED |

## 3. Recommended ownership（CANDIDATE / NOT LOCKED）

```text
Status: CANDIDATE / NOT ACCEPTED / NOT LOCKED
Agent recommendation: LO-1 + VP-1 + EX-1 + NB-1 + XB-1
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

根拠（read-only check より）:

```text
- sharepoint-contract-mapping Scope = SupportPlan / SupportPlanVersion
- AssessmentSnapshot は独立 Schema ID + SP adapter / save 境界を持つ
- SP-PLACEMENT LV-3 = SupportPlan List 同一視 NOT SELECTED
- NAMES-1 = ちょうど 2 List slots
- AuditEvent #29 = 法人共通 store role
- TARGET-REUSE B = DailyActivityRecords を新 SPFx List にしない
```

## 4. Contingent List name candidates（still NOT this Decision）

ownership が LO-1 で LOCK された後の **別 Decision** 用の比較候補。

| Role | Candidate display | Candidate English name | Status |
|---|---|---|---|
| List A | 支援計画 | `SupportPlans` | CONTINGENT / NOT LOCKED |
| List B | アセスメントスナップショット | `AssessmentSnapshots` | CONTINGENT / NOT LOCKED |

```text
本 packet では List names を Accepted にしない（NB-1）。
```

## 5. Explicit non-authorization

```text
This OPEN packet does NOT authorize:
  treating LO-1 as Accepted / LOCKED
  Accepting List names
  creating Site / List / columns
  creating with XXXXX / YYYYY
  reopening AuditEvent store mapping
  Implementation Start
  SharePoint / adapter / application implementation
  Deploy / real data
```

## 6. Next

```text
Decision-AS-PILOT-LIST-OWNERSHIP-1: OPEN / NOT ACCEPTED
Waiting for Human Accept such as:
  「LO-1 + VP-1 + EX-1 + NB-1 + XB-1 でいく」
  （List A=SupportPlan / List B=AssessmentSnapshot /
    Version 同居 / names は後続 / 作成しない）

Until then:
  List names = DEFERRED
  Site / List creation = NO-GO
  Acceptance 正本 = NOT CREATED
```
