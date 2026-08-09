# Pilot List ownership / 正本責務 check（read-only）

この文書は、**PILOT LIST NAMES** に進む前の
**List 正本責務の read-only 棚卸し**である。

Next gate 正本:
[`decision-assessment-snapshot-pilot-facility-identity-next-gate.md`](./decision-assessment-snapshot-pilot-facility-identity-next-gate.md)

Follow-up Decision packet（OPEN）:
[`decision-assessment-snapshot-pilot-list-ownership-packet.md`](./decision-assessment-snapshot-pilot-list-ownership-packet.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: read-only ownership inventory
Status: CONSUMED（Decision-AS-PILOT-LIST-OWNERSHIP-1 Accepted / LOCKED）
Acceptance:
  decision-assessment-snapshot-pilot-list-ownership-acceptance.md
List names: NOT ACCEPTED（NB-1；別 Decision）
Site / List creation: NO-GO

Baseline:
  Decision-AS-PILOT-FACILITY-IDENTITY-1 = Accepted / LOCKED
    / PO-1 + FK-1 + SN-1 + LN-D + XB-1
  Decision-AS-ORG-SITE-TOPOLOGY-1 = Accepted / LOCKED
    / OT-1 + FS-1 + SP-1 + PP-1 + PH-1 + XB-1
  Decision-AS-NEW-TARGET-NAMES-1 = two List slots XXXXX / YYYYY
    = PLACEHOLDER / NOT CREATABLE
  Decision-AS-SP-PLACEMENT-1 = SV-1 + LV-1 + CN-1 + SC-1
    （確認方法のみ；具体 List 値は NOT CONFIRMED）
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Summary

```text
判定: CONSUMED
Decision-AS-PILOT-LIST-OWNERSHIP-1: Accepted / LOCKED / LO-1 + VP-1 + EX-1 + NB-1 + XB-1

LOCKED ownership:
  List A = SupportPlan 正本 + SupportPlanVersion 同居
  List B = AssessmentSnapshot 正本
  AuditEvent / DailyActivityRecords = 2 slot 外

Still OPEN:
  具体 List names（次 gate）
  Site / List creation = NO-GO
```

## 1. Locked prerequisites（再 Decision しない）

| Decision / doc | Locked fact | Path |
|---|---|---|
| TARGET-REUSE-1 = B | `/sites/welfare` + `DailyActivityRecords` = REFERENCE ONLY | `decision-assessment-snapshot-target-reuse-acceptance.md` |
| NEW-TARGET-PROVISION-1 | ST-1 + LT-1 dedicated Site + Lists | `decision-assessment-snapshot-new-target-provisioning-acceptance.md` |
| NEW-TARGET-NAMES-1 | 2 List slots = `XXXXX` / `YYYYY` PLACEHOLDER | `decision-assessment-snapshot-new-target-names-acceptance.md` |
| ORG-SITE-TOPOLOGY-1 | FS-1 per-facility Lists；PH-1 placeholder 作成 FORBIDDEN | `decision-assessment-snapshot-org-site-topology-acceptance.md` |
| PILOT-FACILITY-IDENTITY-1 | Site names LOCKED；List names LN-D | `decision-assessment-snapshot-pilot-facility-identity-acceptance.md` |
| SP-PLACEMENT-1 | LV-1 live confirm；**LV-3 SupportPlan List 同一視 NOT SELECTED** | `decision-assessment-snapshot-sp-placement-packet.md` / acceptance |
| SP-ADAPTER-1 / DEC6-MAPPING-1 / APP-SAVE-1 | AssessmentSnapshot adapter / mapping 境界のみ | 各 Acceptance |
| sharepoint-contract-mapping | SupportPlan / SupportPlanVersion Contract側；SP List 値 deferred | `sharepoint-contract-mapping.md` |
| audit-event-physical-mapping-29 | AuditEvent → `SBS_AUDIT_EVENTS`（法人共通 site role） | `audit-event-physical-mapping-29.md` |

## 2. Persistence inventory

| Entity | Schema / store ID | Needs facility Site List? | Needs org-common List? | Evidence | Status |
|---|---|---|---|---|---|
| SupportPlan | `severe-behavior-support.support-plan.plan` @ 1.0.0 | **Yes（候補）** | No | `contracts-v1.md` / `sharepoint-contract-mapping.md` Scope | OPEN for slot assignment |
| SupportPlanVersion | `severe-behavior-support.support-plan.plan-version` @ 1.0.0 | **Yes / maybe same List** | No | same mapping Scope | OPEN（same vs separate List） |
| AssessmentSnapshot | `severe-behavior-support.assessment-snapshot.snapshot` @ 1.0.0 | **Yes（候補）** | No | SCHEMA-ID-1；SP-ADAPTER-1；LV-3 NOT SELECTED | OPEN for slot assignment |
| AuditEvent | `SBS_AUDIT_EVENTS` / `Lists/SBSAuditEvents` | **No** | **Yes（mapped）** | `audit-event-physical-mapping-29.md` 法人共通 site role | Mapped elsewhere |
| DailyActivityRecords | existing-app List | **No** | No | TARGET-REUSE-1 = B | REFERENCE ONLY |
| ABC / Finding / ExecutionRecord | — | OUT / HOLD | OUT / HOLD | mapping「先回りしない」 | Not in current List-slot scope |

## 3. Two-slot matrix（XXXXX / YYYYY）

```text
Slot count: 2（NAMES-1 INTENDED placeholders only）
Slot entity assignment: NOT LOCKED in repo
```

| Slot | Candidate 正本責務 | Supporting evidence | Gaps / contradictions | Verdict |
|---|---|---|---|---|
| **List A** | SupportPlan の施設サイト正本 + SupportPlanVersion 同居 | Contract mapping Scope；FS-1/LT-1；VP-1 Accepted | 具体 List name は DEFERRED | **Accepted / LOCKED（LO-1 + VP-1）** |
| **List B** | AssessmentSnapshot の施設サイト正本 | SP-ADAPTER / APP-SAVE / DEC-009；LV-3 NOT SELECTED；LO-1 Accepted | 具体 List name は DEFERRED | **Accepted / LOCKED（LO-1）** |

```text
LOCKED via Decision-AS-PILOT-LIST-OWNERSHIP-1.
Still NOT derived:
  Schema ID = List name
  concrete List names Accepted
  XXXXX / YYYYY = creatable
```

## 4. Explicit non-claims

```text
This check does NOT:
  Accept / LOCK ownership pairing
  Accept / LOCK List names
  invent creatable List names as Accepted values
  treat logical Schema IDs as SharePoint List names（contracts-v1 / mapping rule）
  put AuditEvent into the two facility slots
  reuse DailyActivityRecords as new SPFx Lists
  authorize Site / List / column creation
  start Implementation / adapter / Deploy
```

## 5. Contingent List name candidates（NOT LOCKED）

ownership Candidate **LO-1**（List A = SupportPlan 正本 / List B = AssessmentSnapshot 正本）を
Human が採択した場合に限り、命名候補として比較できる。

```text
Status: CONTINGENT CANDIDATE / NOT ACCEPTED / NOT LOCKED
Depends on: ownership LO-1 Human Accept（未了）
Schema ID ≠ List name（再掲）
```

| Role | Candidate display name（例） | Candidate URL-safe / Internal-facing name（例） | Note |
|---|---|---|---|
| List A（SupportPlan 正本） | 支援計画 | `SupportPlans` | Version 同居なら Display は計画側に寄せる |
| List B（AssessmentSnapshot 正本） | アセスメントスナップショット | `AssessmentSnapshots` | LV-3 により SupportPlan List と別 |

代替候補（同じく NOT LOCKED）:

```text
List A: SBS_SupportPlans / SupportPlanRecords
List B: SBS_AssessmentSnapshots / AssessmentSnapshotRecords
```

```text
Do NOT Accept these names from this check alone.
Do NOT create Lists from these names.
```

## 6. HOLD / OPEN

| Item | Status | Needed Human action |
|---|---|---|
| List A / List B 正本責務 pairing | **Accepted / LOCKED（LO-1）** | — |
| SupportPlanVersion same List as SupportPlan? | **Accepted / LOCKED（VP-1）** | — |
| Concrete List names | **DEFERRED** | PILOT LIST NAMES Decision |
| List count ≠ 2 | **NOT REOPENED** by this check | 変更するなら別 Human Decision |
| AuditEvent facility List? | **NOT ADOPTED（EX-1）** | 再 Decision しない |

## 7. Out of scope

```text
List name Acceptance
Site / List / column creation
tenant / Entra / M365 mutation
Implementation Start
SharePoint / adapter / application code
Schema / DTO code assignment
FindingCode / A-5
post-retention deletion
```

## 8. Next

```text
Decision-AS-PILOT-LIST-OWNERSHIP-1: Accepted / LOCKED / LO-1 + VP-1 + EX-1 + NB-1 + XB-1
Next gate: FIXED
  PILOT LIST NAMES
  → decision-assessment-snapshot-pilot-list-names-next-gate.md
List names: DEFERRED / NOT SELECTED
Creation: NO-GO
```
