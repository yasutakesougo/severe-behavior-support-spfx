# SUPPORT-PLAN-CONTRACT-IMPACT-1 — SupportPlan contract impact assessment (read-only)

Status: **COMPLETE — CLASSIFICATION ONLY**

Assessment ID: `SUPPORT-PLAN-CONTRACT-IMPACT-1`  
Slice identity: `SP-LC-1` assessment  
Decision baseline: **Decision-SUPPORT-PLAN-LIFECYCLE-SEMANTICS-1** (SELECTED / LOCKED on main)  
Issue routing: #26 contract × #419 locked semantics  
Primary Owner preserved: #26 (closed), #24, #70, #347, #352

Assessment date: 2026-08-18

Authoritative main at assessment: `1d6a289d2631b9c3ddada7ba021b1b25ebec4e18`  
Decision SSOT merge: PR #421 (`dd91678b3c6acf632d8cc97b90aa3b48291da8b8` → main)

```text
Human GO: #26 SupportPlan Contract Impact Assessment GO — Decision-SUPPORT-PLAN-LIFECYCLE-SEMANTICS-1 only
Scope: read-only classification
Implementation Start: NOT AUTHORIZED
LIVE WRITE / Deploy / Schema change / approvedBy rename: FORBIDDEN
Issue #419 close: NOT AUTHORIZED
Issue #26 reopen: NOT AUTHORIZED
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Method

Locked #419 semantics（D1–D6）を、Issue #26 で確定済みの Schema 1.0.0 契約・純関数・port に照合する。
各行は **1 分類のみ**（主判定）。defer 可能な将来変更は **ADDITIVE** または **BREAKING CHANGE（deferred）** として分離する。

| Class | Meaning |
|---|---|
| **AS-IS REUSABLE** | Schema 1.0.0 / 現行関数をそのまま再利用可能 |
| **ADDITIVE CHANGE** | 互換維持の docs / comment / optional field / repository policy 追加（本 GO では未実装） |
| **BREAKING CHANGE** | Schema MAJOR / rename / transition 書き換え（本 GO では禁止・defer） |
| **DOMAIN DECISION GAP** | #24 等の別 Decision が必要。#26 contract 単体では閉じない |
| **UI-ONLY GAP** | 表示文言・フロー。owner #70 |
| **NO CHANGE** | 既存契約が Decision と矛盾せず、追加 contract も不要 |

## 2. Decision × contract matrix

| Focus | Decision | Primary contract evidence | Classification | Notes |
|---|---|---|---|---|
| `Active` 意味と現行型 | D1=B | `SupportPlanState` `status: "Active"` + `ApprovalHistory` + `effectiveFrom`（[`support-plan.ts`](../../src/domain/support-plan.ts) L129–148, L351–379）; uniqueness on Active + `effectiveFrom`/`effectiveTo`（[`active-plan-uniqueness.md`](./active-plan-uniqueness.md), `evaluateActivePlanUniqueness`） | **AS-IS REUSABLE** | enum・validator・一意性は D1=B（適用開始）と整合。`effectiveFrom` は適用開始 metadata として読める |
| `Active` 意味の明示 | D1=B | 型名・フィールド名は `Active` / `approvedBy` のまま | **ADDITIVE CHANGE** | architecture docs / field comments で「適用開始 ≠ 独立最終承認」を追記可能（Schema 1.0.0 互換） |
| `Active` 表示 | D1=B | DEC-008 NOT ADOPTED 独立最終承認者 | **UI-ONLY GAP** | 「承認済み」「最終承認者」等の誤読ラベルは #70 で修正。contract 変更不要 |
| `approvedBy / approvedAt` 1.0.0 維持 | D2=B | Schema 1.0.0; Active/Closed で required（[`support-plan.ts`](../../src/domain/support-plan.ts) L62–66, L355–358）; tests（[`support-plan-contract.test.ts`](../../tests/contracts/support-plan-contract.test.ts) L86–98） | **AS-IS REUSABLE** | 名称維持・必須 invariant は Decision と一致 |
| `approvedBy / approvedAt` 意味 | D2=B | フィールド名に制度意味を埋め込まない | **ADDITIVE CHANGE** | docs / JSDoc で「制度上の最終承認者を意味しない」を追記（互換） |
| `approvedBy → activatedBy` rename | D2=B | 次 MAJOR candidate locked in Selection | **BREAKING CHANGE** | deferred。本 assessment / demo slice では **禁止** |
| `PendingReview / Returned` enum | D3=B | `SUPPORT_PLAN_STATUSES` 5 値維持（[`support-plan.ts`](../../src/domain/support-plan.ts) L6–12） | **AS-IS REUSABLE** | 状態廃止不要 |
| `PendingReview / Returned` role-free | D3=B | `transitionSupportPlanStatus` は role 判定 OUT（[`support-plan-status-transition.md`](./support-plan-status-transition.md) L81–95）; DEC-008 Option C | **NO CHANGE** | 提出・差戻しロール非埋め込みは既存契約どおり |
| Draft→Active skip 禁止 | D3=B | 許可 5 辺のみ; Draft→Active = `INVALID_TRANSITION`（[`support-plan-status-transition.md`](./support-plan-status-transition.md) L41–60; tests L50） | **AS-IS REUSABLE** | Selection の skip 禁止と一致 |
| 任意内部 WF / 非制度必須 | D3=B | contract は状態名のみ; 制度フロー意味なし | **ADDITIVE CHANGE** | docs で「任意内部ワークフロー」を明示可能 |
| SupportPlanVersion 型 immutability | D4=A | `SupportPlanVersion` Readonly + `version` + `versionCreatedAt`（[`support-plan.ts`](../../src/domain/support-plan.ts) L175–187） | **AS-IS REUSABLE** | 版レコードは上書き前提の mutable 型ではない |
| `saveVersion` overwrite 防止 | D4=A | `ISupportPlanVersionRepository.saveVersion` port only（[`support-plan-repository.ts`](../../src/domain/support-plan-repository.ts) L47–51）; domain に overwrite guard なし | **ADDITIVE CHANGE** | repository adapter / policy docs / contract tests で「同一 `(planId, version)` 再 save = CONFLICT」を後追い可能。Schema 変更不要 |
| #347 planId+planVersion↔Procedure | D4=A | [`support-plan-version-procedure-binding.ts`](../../src/domain/support-plan-version-procedure-binding.ts); uniqueness + `bindingMatchesSupportPlanVersion` | **AS-IS REUSABLE** | historical binding キーは Decision と一致 |
| #352 / FW-05 ProcedureRecord frozen version | D4=A | `planVersionForProcedureRecordProjection`, `resolveHistoricalPlanVersionForProcedureRecord`, `projectProcedureRecordSupportContent`（[`procedure-record.ts`](../../src/domain/procedure-record.ts) L280–348）; tests FW05-HIST-01/02 | **AS-IS REUSABLE** | Active `currentVersion` への付け替え禁止は実装済み |
| `reviewDueDate` optional field | D5=B | `SupportPlanBase.reviewDueDate?` + ISO validator（[`support-plan.ts`](../../src/domain/support-plan.ts) L44, L256–258） | **AS-IS REUSABLE** | MAP-PLAN-010 確定を維持 |
| due/overdue 相対判定 | D5=B | `evaluateReviewDueRelativeToAsOf` → BEFORE_DUE/DUE/OVERDUE; 無効化しない（[`support-plan.ts`](../../src/domain/support-plan.ts) L827–859; [`review-due.md`](./review-due.md)） | **AS-IS REUSABLE** | 超過だけで計画無効化する関数は存在しない |
| 90日自動失効 | D5=B | 該当 contract なし | **NO CHANGE** | 固定 90 日 auto-expiry は未実装かつ Decision で禁止 |
| 起算点 / approaching window | D5=B | OUT of `evaluateReviewDueRelativeToAsOf`; Decision-RD-3 / GOV-RULE-05–08 | **DOMAIN DECISION GAP** | #24 owner。本 assessment では contract 変更しない |
| D6 ProcedureRecord as Review material | D6=A | `ProcedureRecord.{planId, planVersion}` + FW-05 projection | **AS-IS REUSABLE** | 記録は版固定で Review 材料に使える |
| D6 Observation as Review material | D6=A | `validateSupportPlanObservationPeriodLogical` は logical sub-schema; Observation↔planVersion 統合 contract なし | **DOMAIN DECISION GAP** | 関連付け方針は #24 / 別 unit。観察不足 auto-invalidate 禁止は既存（関数なし）= **NO CHANGE** on invalidation |
| #70 Planning PC 最小デモ contract | SP-LC-7..10 → #70 | SupportPlan + Version + transition + uniqueness + binding + ProcedureRecord 揃い | **AS-IS REUSABLE**（core） | 新 Schema 1.0.0 field は最小デモに **不要** |
| #70 demo fixture / presentation graph | #70 | shell synthetic は label-only 断片（[`field-workflow-1-assessment.md`](./field-workflow-1-assessment.md) 時点） | **UI-ONLY GAP** | fixture グラフ・文言・画面導線は #70 presentation slice |
| #70 demo optional additive | #70 | docs-only fixture catalog / demo seed 文書 | **ADDITIVE CHANGE** | synthetic data 定義の docs/fixture 追加は Schema 非変更で可能 |

## 3. Per-axis summary（D1–D6）

### D1 = B — Active

```text
Contract: AS-IS REUSABLE
Semantics docs: ADDITIVE CHANGE
UI labels: UI-ONLY GAP (#70)
BREAKING: none required
```

`Active` + `effectiveFrom` + Active uniqueness は「現場支援への適用開始」を表現する現行 1.0.0 として十分。
独立最終承認者モデル（DEC-008 NOT ADOPTED）とも矛盾しない。

### D2 = B — approvedBy / approvedAt

```text
Schema 1.0.0 names: AS-IS REUSABLE
Meaning clarification: ADDITIVE CHANGE
Presentation: UI-ONLY GAP (#70)
Deferred rename: BREAKING CHANGE (next MAJOR only — NOT this gate)
```

Active/Closed で `approvedBy`/`approvedAt` 必須は維持する。
即 rename / delete は **禁止**（Human GO 外）。

### D3 = B — PendingReview / Returned

```text
Enum + 5-edge transition: AS-IS REUSABLE
Role-free transition fn: NO CHANGE
Optional-workflow semantics: ADDITIVE CHANGE
BREAKING: none required
```

`submittedBy`/`returnedBy` は audit trail フィールドであり、DEC-008 Option C の role-free 遷移関数と両立する。

### D4 = A — SupportPlanVersion immutable + historical binding

```text
Version record shape: AS-IS REUSABLE
#347 binding: AS-IS REUSABLE
#352 / FW-05: AS-IS REUSABLE
Repository overwrite policy: ADDITIVE CHANGE (adapter/docs/tests — not Schema)
BREAKING: none required
```

Domain 型と #347/#352 は D4=A を満たす。
Port 層の overwrite 禁止は **policy/test 追加**で閉じる余地あり（ADDITIVE）。

### D5 = B — reviewDueDate / 約3か月

```text
Optional field + relative eval: AS-IS REUSABLE
90-day auto-expiry: NO CHANGE (absent + forbidden)
Origin / approaching / notice: DOMAIN DECISION GAP (#24)
BREAKING: none required
```

`evaluateReviewDueRelativeToAsOf` は caller-supplied due の相対判定のみ。
起算・接近窓は #24 Decision backlog（Decision-RD-3, GOV-RULE-05–08）。

### D6 = A — Observation / ProcedureRecord ↔ Review

```text
ProcedureRecord binding: AS-IS REUSABLE
Observation shortage auto-invalidate: NO CHANGE (no such function)
Observation↔planVersion association contract: DOMAIN DECISION GAP (#24)
Review UI drill-down: UI-ONLY GAP (#70)
```

観察不足で計画を無効化する contract は存在しない（Decision 整合）。

## 4. Classification roll-up

| Class | Count | Items |
|---|---:|---|
| **AS-IS REUSABLE** | 14 | Active type/uniqueness; approvedBy 1.0.0; PendingReview/Returned enum; 5-edge transition; SupportPlanVersion shape; #347 binding; #352 FW-05; reviewDueDate field; relative due eval; ProcedureRecord review material; #70 core contracts |
| **ADDITIVE CHANGE** | 6 | Active/approvedBy/PendingReview semantics docs; saveVersion overwrite policy; #70 fixture catalog docs |
| **BREAKING CHANGE** | 1 | deferred `approvedBy`→`activatedBy` MAJOR rename only |
| **DOMAIN DECISION GAP** | 3 | reviewDueDate origin/approaching (#24); Observation↔planVersion association (#24); （invalidation 系は NO CHANGE） |
| **UI-ONLY GAP** | 3 | Active/approvedBy presentation labels; #70 demo fixture graph / navigation |
| **NO CHANGE** | 3 | role-free transition; 90-day auto-expiry absent; observation-shortage auto-invalidate absent |

## 5. #70 Planning PC demo — minimum contract verdict

```text
Verdict: core Issue #26 contracts are sufficient for a minimal planning/support-plan demo slice.

Required for demo (reuse as-is):
  SupportPlan / SupportPlanVersion Schema 1.0.0
  status transition (5 edges)
  Active uniqueness evaluation
  SupportPlanVersionProcedureBinding (#347)
  ProcedureRecord + FW-05 historical lookup (#352)

Not required before demo slice (separate owners):
  approvedBy rename (BREAKING — deferred)
  reviewDueDate origin engine (#24 DOMAIN DECISION GAP)
  Observation association contract (#24 DOMAIN DECISION GAP)
  SharePoint / LIVE persistence (#22 / #29)

Demo slice likely work (Human #70 GO):
  synthetic fixture graph (UI-ONLY / ADDITIVE docs)
  presentation copy aligned to D1/D2 semantics (UI-ONLY GAP)
  no new Schema 1.0.0 fields for SP-LC-1 alone
```

## 6. Explicit OUT / FORBIDDEN（post-assessment）

```text
OUT of this assessment closure:
  SupportPlan / SupportPlanVersion code change
  Schema 1.0.0 MAJOR / approvedBy rename or delete
  status enum / transition table rewrite
  #24 review-due origin implementation
  #70 UI implementation auto-start
  #347 / #352 binding retarget
  SharePoint / Graph / LIVE WRITE / Deploy
  Issue #419 close
  Issue #26 reopen
```

## 7. Next gate

```text
Assessment: SUPPORT-PLAN-CONTRACT-IMPACT-1 = COMPLETE (classification only)

Next (Human only):
  支援計画デモ用の最小実装 slice GO — bound to this assessment + #70 owner
  Separate #24 GO for reviewDueDate origin / approaching window
  Separate MAJOR GO for approvedBy rename (if ever)

This assessment ≠ Implementation Start
This assessment ≠ Issue close
```

## Reference

- Decision Selection: [`decision-support-plan-lifecycle-semantics-selection.md`](./decision-support-plan-lifecycle-semantics-selection.md)
- DEC-008: [`decision-dec-008-support-plan-role-separation.md`](./decision-dec-008-support-plan-role-separation.md)
- Status transition: [`support-plan-status-transition.md`](./support-plan-status-transition.md)
- Active uniqueness: [`active-plan-uniqueness.md`](./active-plan-uniqueness.md)
- Review due: [`review-due.md`](./review-due.md)
- Prior field workflow assessment: [`field-workflow-1-assessment.md`](./field-workflow-1-assessment.md)
- Issue #419: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/419
