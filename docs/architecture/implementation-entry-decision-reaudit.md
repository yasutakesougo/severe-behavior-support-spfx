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
| Decision-RD-3 | **HOLD** |
| Human Implementation Start | **HOLD** |

正本: [`review-cadence-contract.md`](./review-cadence-contract.md) / [`review-anchor-contract.md`](./review-anchor-contract.md) / [`review-notice-contract.md`](./review-notice-contract.md)

```text
Logical Accepted ≠ Schema / UI Start
hard due/overdue: DO NOT START（08 NOT ADOPTED）
RD-3: HOLD（08 NOT ADOPTED を理由に自動開始しない）
90日必須化: FORBIDDEN
```

### 3. AssessmentSnapshot Entry Criteria（Decision-AS-EC-1）

| # | 条件 | 現状 |
|---|---|---|
| 1 | Result 技術設計が main | DONE |
| 2 | 所有 Issue / PR 境界 | 部分 |
| 3 | `DEC-009` 保存タイミング | **未** |
| 4 | `GOV-AUD-03` 訂正承認境界 | **Accepted / Option E**（application 対象外明示） |
| 5 | Finding / findingIds 境界 | **未**（FC 内容依存） |
| 6 | `NOT_APPLICABLE` reason 正本 | **未** |
| 7 | Schema / DTO versioning | **未** |
| 8 | 型・validator・fixture 計画 | **未** |

正本: [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md) Snapshot 表 / [`assessment-snapshot-result-design.md`](./assessment-snapshot-result-design.md)

```text
Decision-AS-EC-1: HOLD
Result conversion: DONE（永続なし）
save / Schema / SharePoint: NOT in this re-audit start
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
| Review ops | Schema/物理列 / notice 実装 Entry / RD-3（任意） | Review |
| Snapshot | DEC-009 / Finding 境界 / reasons / Schema（GOV-AUD-03 = Option E 済） | AS-EC-1 |
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

1. `DEC-009`（AS-EC-1 向け最小 unlock；GOV-AUD-03 は Option E 済）
2. Issue #19 最小 GOV-AUD 残件（対象 ID を Human が明示）
3. Decision-RD-3（接近窓等。08 NOT ADOPTED を開始信号にしない）
4. 実 SharePoint Audit adapter Gate（明示 Human GO のみ）

**Current selected substantive unit:** E — DEC-008 提出・差戻しロール  
（[`decision-dec-008-submit-return-roles-decision-packet.md`](./decision-dec-008-submit-return-roles-decision-packet.md)）

**CONSUMED（次 unit として再選しない）:** Decision-OP-3 / GOV-AUD-03 / DEC-009 re-decision

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
