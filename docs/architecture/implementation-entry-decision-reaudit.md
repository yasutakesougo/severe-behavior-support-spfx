# Implementation Entry — Decision Re-audit（post GOV-RULE-05〜08）

この文書は、見直し運用 Human Decision（GOV-RULE-05〜08）が揃った後の
**Implementation Entry 充足に残る Decision 再監査**である。

Implementation Start ではない。値・Schema・実装・SharePoint 変更を開始しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Document: Implementation Entry Decision Re-audit
Status: REVIEWED / NOT IMPLEMENTATION START
main baseline: 232d62db62b60c3d2ed8d7be8fac79b459e427d1
PR #138 / GOV-RULE-08: MERGED
merged head: 3b555ec29c304e6fcbb611303ed648812c6950d6
GOV-RULE-05: Accepted
GOV-RULE-06: Accepted
GOV-RULE-07: Accepted / Option C
GOV-RULE-08: Accepted / Option A / NOT ADOPTED
hard due / overdue: OUT OF CURRENT SCOPE
duration_days = 90: NOT AUTHORIZED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Issue #24 Close: NO-GO
SharePoint / M365 / Deploy / real data: NO-GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)
- [`domain-reconstruction-foundation.md`](./domain-reconstruction-foundation.md)
- [`fc-decision-exit-review.md`](./fc-decision-exit-review.md)
- [`a-class-structure-acceptance.md`](./a-class-structure-acceptance.md)
- [`decision-gov-rule-08-due-overdue-acceptance.md`](./decision-gov-rule-08-due-overdue-acceptance.md)

## Purpose

1. 「Implementation Entry」と「Implementation Start」の意味を再固定する
2. Entry track 別に、Accepted / HOLD / NOT ADOPTED / DO NOT START を棚卸しする
3. Entry 充足を阻む残 Decision を列挙する（混ぜない）
4. 次の最小安全な Human Decision unit を推奨する（自動開始しない）

## Terms

| 用語 | 意味 | 正本 |
|---|---|---|
| **Implementation Entry / Entry Criteria** | Human Implementation Start の前に満たすべき checklist。DEFINED ≠ satisfied | 各 track の Entry Criteria 節 / [`fc-decision-exit-review.md`](./fc-decision-exit-review.md) |
| **Implementation Start** | 当該単位の code / Schema / UI 着手を許可する **別 Human GO** | backlog / 各 Acceptance |
| **Accepted logical contract** | 意味・境界の固定。実装許可ではない | GOV-RULE / FC / review-* contracts |
| **NOT ADOPTED** | 現行 scope で採択しない。再オープンは新 Human Decision | GOV-RULE-08 / SEV-2-VOCAB |

```text
Decision Accepted ≠ Entry satisfied ≠ Implementation Start
auto-start: FORBIDDEN
```

## decision-review Summary

```text
判定: READY（棚卸し完了。次工程前提は固定できる）
対象 Issue: #16 / #19 / #24 / #8 / #17 / #22（track 別）
対象リポジトリ: yasutakesougo/severe-behavior-support-spfx
Implementation Start: 依然 HOLD
```

意味:

- 残 Decision とブロッカーは識別済み
- どれか 1 つの Entry が自動的に MET になったわけではない
- Human が次 unit を選ぶまで実装に進まない

## Closed for current review-ops scope

| ID | Status | 意味 | 実装 |
|---|---|---|---|
| GOV-RULE-05 | Accepted | 初回=有効開始日 / 以降=前回見直し日 | Schema/物理列は別 |
| GOV-RULE-06 | Accepted | 「3ヶ月に1回程度」/ approximate month | 90日変換禁止 |
| GOV-RULE-07 | Accepted / Option C | 対象暦月に入ったら通知 | informational only |
| GOV-RULE-08 | Accepted / Option A / **NOT ADOPTED** | hard due/overdue 不採用 | **DO NOT START** |

```text
3ヶ月に1回程度 ≠ 90日
通知月に入った ≠ overdue
通知が出た ≠ 業務違反
evaluateReviewDueRelativeToAsOf: UNCHANGED technical helper
Next automatic from GOV-RULE line: NONE
```

## Implementation Entry tracks

### 1. FindingCode Implementation Entry

| 項目 | 状態 |
|---|---|
| FC-1〜FC-6 | Accepted（logical） |
| FC Decision Exit Review | ACCEPTED |
| A-class structure | ACCEPTED（Bundle A-1〜A-4 / Separate A-5） |
| A-1〜A-4 content | **UNDECIDED**（current single gate） |
| A-5 representation strategy | UNDECIDED / separate |
| Entry Criteria | **DEFINED** / satisfaction **NOT EVALUATED** |
| Implementation Start | **HOLD** |

正本: [`fc-decision-exit-review.md`](./fc-decision-exit-review.md) / [`a-class-structure-acceptance.md`](./a-class-structure-acceptance.md)

Entry を阻む残 Decision:

| ID | 状態 | Entry 阻害 |
|---|---|---|
| A-1 values | UNDECIDED | Yes |
| A-2 numbering | UNDECIDED | Yes |
| A-3 criterionId mapping | UNDECIDED | Yes |
| A-4 Issue #8 DEC number | UNASSIGNED | Yes |
| A-5 strategy | UNDECIDED | Yes（または当該 slice 対象外の Human 明示） |

```text
Current single gate (canonical):
  HUMAN_FINDINGCODE_BUSINESS_CATALOG_BUNDLE_CONTENT_DECISION
  = A-1〜A-4 bundle content
FC-7: NOT CREATED
FindingCode value invention: FORBIDDEN
```

### 2. Review cadence / anchor / notice Implementation Entry

| 項目 | 状態 |
|---|---|
| GOV-RULE-05/06/07 logical | Accepted（Entry 前提の一部は充足） |
| GOV-RULE-08 | NOT ADOPTED（hard due Entry は閉じる） |
| previous_review_date 物理列 / Schema | UNDECIDED |
| notice algorithm / UI / job | NOT STARTED |
| Decision-RD-3 | **Accepted / LOCKED**（informational monitoring guidance；hard due/overdue NOT ADOPTED） |
| Human Implementation Start | **HOLD** |

正本: [`review-cadence-contract.md`](./review-cadence-contract.md) / [`review-anchor-contract.md`](./review-anchor-contract.md) / [`review-notice-contract.md`](./review-notice-contract.md)

```text
Logical Accepted ≠ Schema / UI Start
hard due/overdue: DO NOT START（08 NOT ADOPTED）
RD-3: Accepted / LOCKED（informational only；Implementation HOLD）
90日必須化: FORBIDDEN
```

### 3. AssessmentSnapshot Entry Criteria（Decision-AS-EC-1）

| # | 条件 | 現状 |
|---|---|---|
| 1 | Result 技術設計が main | **PASS / MET**（監査 [`decision-as-ec-1-entry-1-2-read-only-consistency-audit.md`](./decision-as-ec-1-entry-1-2-read-only-consistency-audit.md)） |
| 2 | 所有 Issue / PR 境界 | **PASS / MET**（所有 #24 / **PR-J** 専用独立。正本 [`decision-as-ec-1-entry-2-ownership-pr-boundary-acceptance.md`](./decision-as-ec-1-entry-2-ownership-pr-boundary-acceptance.md)） |
| 3 | `DEC-009` 保存タイミング | **Accepted / LOCKED / Option A** |
| 4 | `GOV-AUD-03` 訂正承認境界 | **Accepted / Option E**（application 対象外明示） |
| 5 | Finding / findingIds 境界 | **未 / NOT MET**（監査 [`decision-as-ec-1-entry-5-6-7-read-only-canonicalization-audit.md`](./decision-as-ec-1-entry-5-6-7-read-only-canonicalization-audit.md)） |
| 6 | `NOT_APPLICABLE` reason 正本 | **未 / NOT MET**（同監査） |
| 7 | Schema / DTO versioning | **未 / NOT MET**（同監査） |
| 8 | 型・validator・fixture 計画 | **Accepted / LOCKED / Option A / FINAL CONSISTENT**（[`decision-as-ec-1-entry-8-technical-plan-acceptance.md`](./decision-as-ec-1-entry-8-technical-plan-acceptance.md) / 整合 [`decision-as-ec-1-entry-8-canonicalization-consistency-check.md`](./decision-as-ec-1-entry-8-canonicalization-consistency-check.md)。実装 DO NOT START） |

正本: [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md) Snapshot 表 / [`assessment-snapshot-result-design.md`](./assessment-snapshot-result-design.md) / [`decision-dec-009-snapshot-save-timing-acceptance.md`](./decision-dec-009-snapshot-save-timing-acceptance.md) / [`decision-as-ec-1-entry-8-technical-plan-acceptance.md`](./decision-as-ec-1-entry-8-technical-plan-acceptance.md) / [`decision-as-ec-1-entry-2-ownership-pr-boundary-acceptance.md`](./decision-as-ec-1-entry-2-ownership-pr-boundary-acceptance.md)

```text
Decision-AS-EC-1: HOLD（overall）
AS-EC-1 #1: PASS / MET
AS-EC-1 #2: PASS / MET（PR-J boundary）
AS-EC-1 #3（DEC-009）: Accepted / LOCKED
AS-EC-1 #8: Accepted / LOCKED / FINAL CONSISTENT（plan only）
Result conversion: DONE（永続なし）
save / Schema / SharePoint / type impl: NOT in Entry #2 / #8 alone
```

### 4. AuditEvent persistence / real adapter

| 項目 | 状態 |
|---|---|
| Persistence Entry Criteria | **MET**（PR #97 系） |
| synthetic / #22B | MERGED |
| 実 SharePoint adapter / tenant | **別 Gate / NO-GO** |
| GOV-AUD residual（01/03/04/05 等） | Snapshot・削除系 Entry を阻害しうる |

正本: [`audit-event-persistence-entry-criteria.md`](./audit-event-persistence-entry-criteria.md)

### 5. Other Schema / SupportPlan

| ID | 状態 | Entry |
|---|---|---|
| Decision-OP-3 | **Accepted / LOCKED / Option A** | periodFrom/periodTo REQUIRED；制度日数・既定窓 NOT ADOPTED；開放終端 NOT ADOPTED；純関数 UNCHANGED；実装 HOLD |
| DEC-6 SharePoint column conversion | HOLD | Adapter Entry |
| Open-end `periodTo` | **NOT ADOPTED**（OP-3） | 再開しない。RSV `effectiveTo` は別 |

## Remaining blockers（混在禁止）

| 領域 | 残 Decision / Gate | Entry track |
|---|---|---|
| FindingCode | A-1〜A-4 content → A-5 → Entry satisfaction → Start | FC |
| Review ops | Schema/物理列 / notice 実装 Entry（RD-3 logical Accepted；実装別 GO） | Review |
| Snapshot | Entry #2 PASS·MET / Finding 境界 / reasons / Schema（DEC-009・Entry #8 plan Accepted；GOV-AUD-03 = Option E 済；PR-J 境界 LOCKED） | AS-EC-1 |
| Audit real env | 実 adapter Gate | Audit（別） |
| SupportPlan Schema | OP-3 LOCKED → DEC-6 | Schema/Adapter |
| Closed | GOV-RULE-08 hard due / SEV-2-ASSIGN / FC-7 | DO NOT START |

## Conflicts / stale language（re-audit notes）

| 箇所 | 問題 | 扱い |
|---|---|---|
| `decision-gov-rule-07-notice-decision-packet.md` / `decision-gov-rule-06-review-cadence-source-review.md` | 歴史的に `GOV-RULE-08: HOLD` | **historical**。現行状態は本再監査と GOV-RULE-08 Acceptance |
| backlog §D「AuditEvent 実保存 Entry Criteria HOLD」 | Persistence Entry は MET 済みと矛盾 | 本 PR で **MET（実 adapter は別 Gate）** へ同期 |
| foundation の #22A「実装前次工程」表現 | #22A/#22B 後も残る古い言い回し | 本再監査を正とし、軽い同期を行う |

## Recommended next Human Decision unit

**Primary（canonical current single gate）:**

```text
HUMAN_FINDINGCODE_BUSINESS_CATALOG_BUNDLE_CONTENT_DECISION
= A-1〜A-4（values / numbering / criterionId mapping / Issue #8 DEC number）
```

理由:

- [`a-class-structure-acceptance.md`](./a-class-structure-acceptance.md) が current single gate と明示
- FC Implementation Entry checklist #2/#3 の前提
- 見直し運用 GOV-RULE 線は現行 scope で閉じている（08 = NOT ADOPTED）
- 90日 / overdue / notice=violation を発明しない
- Implementation Start を含まない（Entry satisfaction / A-5 / Start は別）

**Safe parallel alternatives（Human が明示選択した場合のみ）:**

1. Decision-AS-EC-1 overall Entry 充足判定（残条件明示のうえ）
2. Issue #19 最小 GOV-AUD 残件（対象 ID を Human が明示；post-retention deletion 含む）
3. 実 SharePoint Audit adapter Gate（明示 Human GO のみ）

**Current selected substantive unit:** F — Decision-ILB-1
→ Human Policy **Accepted / Option A / FINAL CONSISTENT**（[`decision-ilb-1-human-policy-acceptance.md`](./decision-ilb-1-human-policy-acceptance.md) / [`decision-ilb-1-canonicalization-consistency-check.md`](./decision-ilb-1-canonicalization-consistency-check.md)）
First residual Decision: **SELECTED / C — Decision-RD-3 FINAL CONSISTENT**（[`decision-rd-3-monitoring-guidance-acceptance.md`](./decision-rd-3-monitoring-guidance-acceptance.md)）
Second residual Decision: **SELECTED / A — GOV-AUD-05 / DEC-012 retention prohibition Accepted / LOCKED**（[`decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md`](./decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md)）
Third residual Decision: **SELECTED / A — DEC-009 save timing FINAL CONSISTENT**（[`decision-dec-009-snapshot-save-timing-acceptance.md`](./decision-dec-009-snapshot-save-timing-acceptance.md) / [`decision-dec-009-canonicalization-consistency-check.md`](./decision-dec-009-canonicalization-consistency-check.md)）
Fourth residual Decision: **SELECTED / A — AS-EC-1 Entry #8 technical plan FINAL CONSISTENT**（[`decision-as-ec-1-entry-8-technical-plan-acceptance.md`](./decision-as-ec-1-entry-8-technical-plan-acceptance.md) / [`decision-as-ec-1-entry-8-canonicalization-consistency-check.md`](./decision-as-ec-1-entry-8-canonicalization-consistency-check.md)）
Fifth residual Decision: **SELECTED / A — AS-EC-1 Entry #2 ownership / PR-J boundary PASS / MET**（[`decision-as-ec-1-entry-2-ownership-pr-boundary-acceptance.md`](./decision-as-ec-1-entry-2-ownership-pr-boundary-acceptance.md) / [`assessment-snapshot-complete-contract-pr-boundary.md`](./assessment-snapshot-complete-contract-pr-boundary.md)）
Entry #1/#2: **#1 PASS / #2 PASS / MET**（[`decision-as-ec-1-entry-1-2-read-only-consistency-audit.md`](./decision-as-ec-1-entry-1-2-read-only-consistency-audit.md)）
Entry #5/#6/#7: **未 / NOT MET**（[`decision-as-ec-1-entry-5-6-7-read-only-canonicalization-audit.md`](./decision-as-ec-1-entry-5-6-7-read-only-canonicalization-audit.md)）
post-retention deletion: **OPEN / 別 Decision**
Decision-AS-EC-1 overall: **HOLD**（#5/#6/#7 NOT MET のため leave-HOLD 不可）
Next residual Decision: **NOT SELECTED**
Inventory provisional rows（上記以外）: **NOT Accepted**（一件ずつ判定）

**CONSUMED（次 unit として再選しない）:** Decision-OP-3 / GOV-AUD-03 / DEC-008 submit-return（Option C） / GOV-AUD-04（Option E） / Decision-ILB-1 HUMAN_POLICY（Option A） / Decision-RD-3 / GOV-AUD-05·DEC-012 retention prohibition（Option A） / DEC-009 save timing（Option A） / AS-EC-1 Entry #8 technical plan（Option A） / AS-EC-1 Entry #2 ownership·PR boundary（Option A）

**Do not next / DO NOT START:**

```text
hard due / overdue implementation
duration_days = 90 / day-91 overdue
notice-month = overdue / notice = violation
FC-7
SEV-2-ASSIGN / FindingSeverity restart
A-5 UUID/hash/semver invention without Human Decision
Implementation Start without Entry satisfaction
SharePoint / M365 / Deploy / real data
```

## Approvals

| 必要な承認 | 状態 |
|---|---|
| 本再監査の Independent Review | 本 PR で実施 |
| Human: 次 unit 選択（既定候補 = A-1〜A-4 bundle） | **opened** — Decision packet READY_FOR_HUMAN_DECISION |
| Human: A-1〜A-4 Option / content | **待ち**（[`decision-findingcode-a14-bundle-content-decision-packet.md`](./decision-findingcode-a14-bundle-content-decision-packet.md)） |
| Human: Implementation Entry satisfaction（各 track） | NOT EVALUATED |
| Human: Implementation Start | HOLD |

## Next Actions

1. 本再監査を main へ載せる（docs-only）— **DONE（PR #139）**
2. FindingCode A-1〜A-4 Decision packet を READY_FOR_HUMAN_DECISION で固定 — 後続 PR
3. Human が Option A–D を選び、内容を提示するか HOLD する
4. Acceptance / Entry satisfaction / Implementation Start は別 Gate

## 変更禁止境界

```text
src/** / tests/**: 本再監査では変更しない
SharePoint / Entra / M365 / deploy: NO-GO
real data: PROHIBITED
Implementation auto-start: FORBIDDEN
90/91-day invention: FORBIDDEN
GOV-RULE-08 re-open: new Human Decision only
```
