# SP-LC-1 — SupportPlan lifecycle semantics Selection

この文書は **Decision-SUPPORT-PLAN-LIFECYCLE-SEMANTICS-1**（Issue #419）の
Human Decision 記録である。

Decision packet:
[`decision-support-plan-lifecycle-semantics-packet.md`](./decision-support-plan-lifecycle-semantics-packet.md)

Issue:
https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/419

本 Selection は Implementation Start ではない。
code / fixture / SharePoint / LIVE WRITE / Deploy を許可しない。
DEC-008 を上書きしない。
#26 / #24 / #70 の実装を自動開始しない。
#347 / #352 の historical binding を変更しない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-SUPPORT-PLAN-LIFECYCLE-SEMANTICS-1
Issue: #419
Slice identity: SP-LC-1
Kind: Human Selection（SupportPlan lifecycle semantics）
Status: SELECTED / LOCKED
Human Decision: D1=B / D2=B / D3=B / D4=A / D5=B / D6=A
Date: 2026-08-18
Packet source: Issue #419 comment 5324211684
Observed main at packet: 68fcb7fdb845b006be51bb0c3542240445bbcdd1
Authoritative main at Selection: d55e3bc0bd7a92be0858bbc9edc8f2d8fde07df8
Agent auto-select: FORBIDDEN（this Selection is Human）

Implementation Start: NOT AUTHORIZED
LIVE WRITE: HOLD
Deploy: HOLD
Issue mutation: NOT AUTHORIZED
Issue #419 close: NOT AUTHORIZED
DEC-008: UNCHANGED / LOCKED
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Why this Decision now

```text
#419 は新しい型・UI・SharePoint の Primary Owner ではない。
既存 SupportPlan / SupportPlanVersion / Procedure / ProcedureRecord /
Review 契約の意味論を、Human が 6 軸で固定する。
```

## 2. Selected meaning

| ID | 問い | Selected | 意味 |
|---|---|---|---|
| D1 | `Active` の意味 | **B** | 現場支援への適用が開始されている。独立最終承認者による承認済みではない |
| D2 | `approvedBy / approvedAt` | **B** | Schema 1.0.0 は名称を互換維持する。制度上の最終承認者を意味しない。次 MAJOR で `activatedBy / activatedAt` 等へ rename する方針を今ロックする。即 rename / delete ではない |
| D3 | `PendingReview / Returned` | **B** | 法人が利用できる任意の内部ワークフロー。application contract は role-free を維持。制度上必須フローではない。状態廃止ではない |
| D4 | SupportPlanVersion 履歴 | **A** | 過去版を上書きしない。変更は新 version として作成する。Procedure / ProcedureRecord の historical binding を保持する |
| D5 | `reviewDueDate` / 約3か月 | **B** | 「3月に1回程度」は見直し支援の基準。起算点・due / overdue 表示は別 domain Decision。超過だけで計画を無効化しない。固定90日自動失効ではない |
| D6 | Observation / Review | **A** | 観察・ProcedureRecord を SupportPlanVersion の Review 材料として関連付ける。観察不足だけで計画を自動無効化しない |

## 3. Locked implications

### D1 = B — Active

```text
Active = 現場支援への適用開始
Active ≠ 独立した最終承認者による承認済み
DEC-008「独立した最終承認者: NOT ADOPTED」と整合
effectiveFrom は適用開始の metadata として読む
```

### D2 = B — approvedBy / approvedAt

```text
Schema 1.0.0:
  keep approvedBy / approvedAt
  do not treat them as 制度上の最終承認者
Next MAJOR candidate:
  rename toward activatedBy / activatedAt or equivalent
Immediate rename/delete: FORBIDDEN
#26 may later assess compatibility-preserving docs only,
  under a separate GO
```

### D3 = B — PendingReview / Returned

```text
Optional internal workflow for a corporation
Not a statutory required sheet flow
Do not embed submit / return roles in application contract
DEC-008 Option C remains LOCKED
Do not delete PendingReview / Returned from the status enum here
```

### D4 = A — immutable version

```text
Do not overwrite past SupportPlanVersion rows
Create a new version for changes
Keep planId + planVersion ↔ ProcedureId + ProcedureVersion (#347)
Keep ProcedureRecord bound to the version at execution time (#352 / FW-05)
Do not retarget historical records onto a later Active version
```

### D5 = B — review cadence

```text
「3月に1回程度」= review-support criterion
Not a fixed 90-day auto expiry
Overdue alone does not invalidate the plan
Origin / due / overdue presentation = separate #24 domain Decision
reviewDueDate field remains available
```

### D6 = A — Observation / Review association

```text
Associate Observation / ProcedureRecord as Review material
  for a SupportPlanVersion
Weekly observation is a statutory requirement, not an app force rule
Observation shortage does not auto-invalidate the plan
Do not manage SupportPlan and Observation as unrelated silos
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  Implementation Start（this Selection alone）
  SupportPlan / SupportPlanVersion code change
  status enum change
  approvedBy / approvedAt immediate rename or delete
  Draft → Active skip or other transition-table rewrite
  independent final approver reintroduction
  submit / return role embedding
  Schema 1.0.0 breaking change
  #347 / #352 historical binding change
  fixed 90-day auto-invalidation
  observation-shortage auto-invalidation
  #24 / #70 implementation auto-start
  SharePoint / Graph / Entra / M365
  LIVE WRITE
  Deploy / App Catalog / redeploy
  Issue #419 close
  Ready / Merge auto-progress
```

## 5. Primary Owner routing（not started here）

Human Decision 後の実装は既存 Primary Owner へ返す。本 Selection はその開始 GO ではない。

```text
SP-LC-1 Lifecycle semantics Decision  →  this Selection / #419
SP-LC-2 SupportPlan contract整合      →  #26（separate GO）
SP-LC-3 Version lifecycle             →  #26（separate GO）
SP-LC-4 / SP-LC-5 binding / trace     →  #347 / #352 keep; extra slice only if needed
SP-LC-6 Observation / Review          →  #24（separate GO; includes D5 origin/due/overdue）
SP-LC-7..10 Planning PC / demo        →  #70（separate GO）
SP-LC-11 Physical schema              →  #29 / #392 sequence
SP-LC-12 LIVE persistence             →  #22 / #29 / production binding gate
```

## 6. Stop condition

```text
Decision-SUPPORT-PLAN-LIFECYCLE-SEMANTICS-1
= SELECTED / LOCKED

Implementation Start: NOT AUTHORIZED

Still NOT AUTHORIZED:
  code / fixture / schema mutation
  approvedBy rename
  90-day auto-expiry
  observation auto-invalidation
  Issue close
  Ready / Merge auto-progress
  LIVE WRITE / Deploy
```

## 7. Next gate

```text
Next: Human or separately authorized #26 contract impact assessment
Bound to: compatibility-preserving reading of Schema 1.0.0
This Selection ≠ Implementation Start
This Selection ≠ #24 domain GO
This Selection ≠ #70 UI GO
```

## Reference

- Packet: [`decision-support-plan-lifecycle-semantics-packet.md`](./decision-support-plan-lifecycle-semantics-packet.md)
- Issue #419: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/419
- DEC-008: [`decision-dec-008-support-plan-role-separation.md`](./decision-dec-008-support-plan-role-separation.md)
- Status transition: [`support-plan-status-transition.md`](./support-plan-status-transition.md)
- Active uniqueness: [`active-plan-uniqueness.md`](./active-plan-uniqueness.md)
