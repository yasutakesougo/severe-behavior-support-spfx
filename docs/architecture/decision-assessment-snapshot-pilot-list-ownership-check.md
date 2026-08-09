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
Status: READY FOR HUMAN OWNERSHIP DECISION
Acceptance: NOT CREATED / NOT STARTED
List names: NOT ACCEPTED
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
判定: READY FOR HUMAN OWNERSHIP DECISION
（ownership pairing はまだ Accepted / LOCKED ではない）

Repo が LOCK していること:
  - 事業所サイトごとに専用 Lists（FS-1 / LT-1）
  - NAMES-1 の List slot 数 = 2（XXXXX / YYYYY；placeholder）
  - AssessmentSnapshot List を SupportPlan List と同一視しない（LV-3 NOT SELECTED）

Repo がまだ LOCK していないこと:
  - 2 slot それぞれがどの entity の正本か
  - SupportPlanVersion を SupportPlan と同じ List に置くか
  - 具体 List names
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
| **List A** | SupportPlan の施設サイト正本（版本文 SupportPlanVersion の同居可否は別 OPEN） | Contract mapping Scope が SupportPlan / Version；facility Site に専用 Lists（FS-1/LT-1） | Version を同一 List に置くかは未記載 | **CANDIDATE** |
| **List B** | AssessmentSnapshot の施設サイト正本 | SP-ADAPTER / APP-SAVE / DEC-009 が AS 永続境界を持つ；**LV-3 = SupportPlan List 同一視 NOT SELECTED** | AS→具体 List 名は未記載 | **CANDIDATE** |

```text
NOT derived as LOCKED:
  XXXXX = SupportPlan
  YYYYY = AssessmentSnapshot
  Schema ID = List name
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
| List A / List B 正本責務 pairing | **OPEN** | Accept LO-1 or alternate |
| SupportPlanVersion same List as SupportPlan? | **OPEN** | ownership Decision 内で明示 or 別 Decision |
| Concrete List names | **DEFERRED** | ownership LOCK 後の List names Decision |
| List count ≠ 2 | **NOT REOPENED** by this check | 変更するなら別 Human Decision |
| AuditEvent facility List? | **NOT ADOPTED** by existing #29 mapping | 再 Decision しない（本 check） |

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
1. Human Decision: Decision-AS-PILOT-LIST-OWNERSHIP-1（OPEN packet）
   recommended candidate: LO-1
     List A = SupportPlan 正本（facility）
     List B = AssessmentSnapshot 正本（facility）
     SupportPlanVersion placement = OPEN axis inside that Decision
2. Only after ownership LOCKED → PILOT LIST NAMES Decision
3. Creation remains later execution gate / NO-GO
```
