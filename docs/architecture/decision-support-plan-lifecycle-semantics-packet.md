# Decision Packet — SupportPlan lifecycle semantics（#419 / SP-LC-1）

この文書は **Issue #419** の Human Decision 用選択票である。
Human が D1=B / D2=B / D3=B / D4=A / D5=B / D6=A を選んだあとも、
本 packet は歴史的 ballot として残す。

Selection record:
[`decision-support-plan-lifecycle-semantics-selection.md`](./decision-support-plan-lifecycle-semantics-selection.md)

Issue comment ballot:
https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/419#issuecomment-5324211684

本 packet は Implementation Start ではない。
code / fixture / SharePoint / LIVE WRITE / Deploy を許可しない。
DEC-008 を上書きしない。
#26 / #24 / #70 / #347 / #352 の Primary Owner を奪わない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-SUPPORT-PLAN-LIFECYCLE-SEMANTICS-1
Issue: #419
Kind: Human Decision packet
Status: CONSUMED（Human Selected D1=B / D2=B / D3=B / D4=A / D5=B / D6=A）
Slice identity: SP-LC-1
Packet source: Issue #419 comment 5324211684
Observed main at packet: 68fcb7fdb845b006be51bb0c3542240445bbcdd1
Selection record:
  decision-support-plan-lifecycle-semantics-selection.md
Implementation Start: NOT AUTHORIZED
LIVE WRITE: HOLD
Deploy: HOLD
Issue mutation: NOT AUTHORIZED
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-support-plan-lifecycle-semantics-selection.md`](./decision-support-plan-lifecycle-semantics-selection.md)
- [`decision-dec-008-support-plan-role-separation.md`](./decision-dec-008-support-plan-role-separation.md)
- [`support-plan-status-transition.md`](./support-plan-status-transition.md)
- [`active-plan-uniqueness.md`](./active-plan-uniqueness.md)

## 1. 判断単位

#419 は新しい型・UI・SharePoint 実装の Primary Owner ではない。
既存契約の意味論を 6 軸で切る reconciliation / decision gate である。

```text
SupportPlan
  ↓
SupportPlanVersion
  ↓
Procedure
  ↓
ScheduledOccurrence
  ↓
ProcedureRecord
  ↓
Observation / Review
  ↓
継続 または 新しい SupportPlanVersion
```

## 2. Options（historical ballot）

Human GO が本 ballot を CONSUME する。Agent は自動選定しない。

### D1 — Active の意味 — SELECTED B

- A. 独立した最終承認者による承認済み — NOT SELECTED
- **B. 現場支援への適用が開始されている — SELECTED**
- C. その他 — NOT SELECTED

### D2 — approvedBy / approvedAt の扱い — SELECTED B

- A. Schema 1.0.0互換のため名称を維持し、制度上の最終承認者を意味しない application metadata として意味を限定する — NOT SELECTED
- **B. 次のMAJORで `activatedBy / activatedAt` 等へrenameする方針を今決め、1.0.0では互換維持する — SELECTED**
- C. 現行Schemaから即削除する — NOT SELECTED
- D. その他 — NOT SELECTED

B は 1.0.0 の名称維持を含む。即 rename / delete ではない。

### D3 — PendingReview / Returned の位置付け — SELECTED B

- A. 制度上必須の支援計画シート業務フロー — NOT SELECTED
- **B. 法人が利用できる任意の内部ワークフロー。application contractはrole-freeを維持 — SELECTED**
- C. 状態自体を廃止する — NOT SELECTED
- D. その他 — NOT SELECTED

### D4 — SupportPlanVersion の履歴方針 — SELECTED A

- **A. 過去版を上書きせず、新版を新versionとして作成する。Procedure / ProcedureRecordのhistorical bindingを保持する — SELECTED**
- B. Active版を直接上書き可能とする — NOT SELECTED
- C. その他 — NOT SELECTED

### D5 — reviewDueDate / 約3か月見直し — SELECTED B

- A. 固定90日を自動期限とし、超過で計画を無効化する — NOT SELECTED
- **B. 「3月に1回程度」を見直し支援の基準として扱い、起算点・due/overdue表示は別domain Decisionで固定する。超過だけで計画を無効化しない — SELECTED**
- C. reviewDueDateを使わない — NOT SELECTED
- D. その他 — NOT SELECTED

### D6 — Observation / Review との関係 — SELECTED A

- **A. 観察・ProcedureRecordをSupportPlanVersionのReview材料として関連付ける。観察不足だけで計画を自動無効化しない — SELECTED**
- B. SupportPlanとは独立管理する — NOT SELECTED
- C. 週次観察不足でSupportPlanを自動無効化する — NOT SELECTED
- D. その他 — NOT SELECTED

## 3. 明示的 OUT

```text
SupportPlan code implementation
status enum change
approvedBy / approvedAt rename/delete
#24 domain implementation
#70 UI implementation
SharePoint schema
LIVE WRITE
Deploy
Production mutation
Issue close
Ready / Merge auto-progress
DEC-008 override
#347 / #352 historical binding change
90-day auto-expiry
observation-shortage auto-invalidation
```

## 4. Stop condition

```text
This packet is CONSUMED by the selection record.
Do not auto-start Implementation.
Do not treat this packet as #26 / #24 / #70 GO.
Do not close Issue #419 from this packet alone.
```
