# Issue #24 Decision Backlog（残Decision整理）

この文書は、PR #85（RSV後残責務再監査）完了後の Issue #24 残 Decision を
**Decision-first** で分類する正本である。

新しい domain 純関数実装は開始しない。
PR #85 の `Next pure unit: NONE` を上書きしない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main before this canonicalization: dd934f389411d23b882922dfc7933493cb1ae5f7
PR #99 / AuditEvent persistence technical contract: MERGED
PR #97 / AuditEvent persistence Entry Criteria: MERGED
PR #96 / Handoff AuditEvent candidate: MERGED
PR #88 / Decision-FLR-1: MERGED（Accepted・実装 NONE）
PR #85 / remaining audit post-RSV: MERGED
Issue #24: OPEN（Close しない）
Decision-HO-1: Accepted（Owner #17）
Decision-AUD-RET-1: Accepted（#19 / 5215844603）
Decision-AUD-WR-1: Accepted（#17 / 5215846338 / owner #22A）
Decision-AUD-ALIGN-1: Accepted
Decision-AUD-IDEM-1: Accepted
Decision-AUD-SAN-VALUE-1: Accepted
Decision-AUD-SAN-1: Accepted
Decision-AUD-REPLAY-1: Accepted
Decision-AUD-REPO-1: Accepted
AuditEvent contract hardening: MERGED（PR #102）
Logical AuditEvent persistence boundary: MERGED（PR #104）
Replay logical implementation: MERGED（PR #106）
Issue #29 physical definition / mapping alignment: Accepted
Canonicalization to main: MERGED（PR #108 / aa0e6fba7dd8abf32523c70232001b5ac78cfc1b）
Dependency blocker（#29 mapping）: CLEARED
Concrete Repository Entry Review: PASS（Issue #22 comment 5224544473）
Concrete repository / #22B synthetic: MERGED（PR #110 / 62a43d7fbb5b33f69e0f4adfbba405ab00c1fb81）
Ready: YES（consumed）
Merge: DONE
実 SharePoint adapter / tenant integration: 別 Gate / NO-GO
READY_FOR_HUMAN_GO: YES（consumed; #22B Human GO 5224579776）
#22B Human GO: CONFIRMED（Issue #22 comment 5224579776）
Decision-SEV-1: Accepted（Option A / Issue #8 新 DEC）
Decision-SEV-2-PURPOSE: RECORDED（MHLW-first）
Decision-SEV-2-CONCEPT-INV: COMPLETED / OFFICIAL_CONCEPT_EXISTS
Decision-SEV-2-VOCAB: Accepted / Option A / FindingSeverity NOT ADOPTED
Decision-SEV-2-VOCAB Canonical: COMPLETE（Issue #8 / DEC-018 / comment 5225426738）
Decision-SEV-2-ASSIGN: N/A / DO NOT START
Decision-FC-1: Accepted / Option B（Issue #8 new DEC / business DEC）/ Implementation HOLD
Decision-FC-2: Accepted / Option C（versioned immutable catalog snapshot input）/ Implementation HOLD
Decision-FC-3: Accepted / Option C（complete logical contract surface）/ Implementation HOLD
Decision-FC-4: Accepted / Option C（complete identifier logical contract）/ Implementation HOLD
Decision-FC-5: Accepted / Option C（split ownership with explicit syntax-validation ceiling）/ Implementation HOLD
Decision-FC-6: Accepted / Option C（complete businessOwnershipRef logical contract）/ Implementation HOLD
FC Decision Exit Review: ACCEPTED（[`fc-decision-exit-review.md`](./fc-decision-exit-review.md) / [`fc-decision-exit-review-acceptance.md`](./fc-decision-exit-review-acceptance.md)）。FC-7 NOT CREATED
A-class structure: ACCEPTED（[`a-class-structure-acceptance.md`](./a-class-structure-acceptance.md)）。Bundle A-1〜A-4 / Separate A-5。Content = DEC-019 EMPTY / NOT ADOPTED
Decision-RC-1 / GOV-RULE-06: **Accepted**（[`decision-gov-rule-06-review-cadence-acceptance.md`](./decision-gov-rule-06-review-cadence-acceptance.md)）。「3ヶ月に1回程度」/ calendar-month cadence / precision = approximate
Decision-RC-2 / GOV-RULE-05: **Accepted**（[`decision-gov-rule-05-review-anchor-acceptance.md`](./decision-gov-rule-05-review-anchor-acceptance.md)）。初回=支援計画有効開始日 / 以降=前回見直し日
PR #135 / GOV-RULE-06: MERGED
PR #136 / GOV-RULE-05: MERGED（merge `ed77f5e480ee8546c38809c60774fd5c512ab17e` / head `fb20d459fd25fca300fb5a3294632e89facd0d51`）
ReviewCadence contract: Accepted logical（[`review-cadence-contract.md`](./review-cadence-contract.md)）
ReviewAnchor contract: Accepted logical（[`review-anchor-contract.md`](./review-anchor-contract.md)）
Source review: PASS（[`decision-gov-rule-06-review-cadence-source-review.md`](./decision-gov-rule-06-review-cadence-source-review.md)）
GOV-RULE-07: **Accepted** / Option C（[`decision-gov-rule-07-notice-acceptance.md`](./decision-gov-rule-07-notice-acceptance.md)）。見直し対象暦月に入ったら通知 / precision = approximate
PR #137 / GOV-RULE-07: MERGED（merge `ba97f2df2cf369454dd6ab0670fca0bfbb1e1436` / head `3ed2159beb9cd71edf4db7b18b6cfdacd2a805ac`）
ReviewNotice contract: Accepted logical（[`review-notice-contract.md`](./review-notice-contract.md)）
Decision packet GOV-RULE-07: CONSUMED（[`decision-gov-rule-07-notice-decision-packet.md`](./decision-gov-rule-07-notice-decision-packet.md)）
GOV-RULE-08: **Accepted** / Option A / NOT ADOPTED（[`decision-gov-rule-08-due-overdue-acceptance.md`](./decision-gov-rule-08-due-overdue-acceptance.md)）
PR #138 / GOV-RULE-08: MERGED（merge `232d62db62b60c3d2ed8d7be8fac79b459e427d1` / head `3b555ec29c304e6fcbb611303ed648812c6950d6`）
ReviewDueOverdue contract: Accepted logical（[`review-due-overdue-contract.md`](./review-due-overdue-contract.md) / `kind: "not_adopted"`）
Decision packet GOV-RULE-08: CONSUMED（[`decision-gov-rule-08-due-overdue-decision-packet.md`](./decision-gov-rule-08-due-overdue-decision-packet.md)）
Implementation Entry Decision Re-audit: [`implementation-entry-decision-reaudit.md`](./implementation-entry-decision-reaudit.md)（post GOV-RULE-05〜08）
PR #139 / Implementation Entry Decision Re-audit: MERGED（merge `99c8b24f0fa22f502803f4ae772c976886aed261` / head `d58e947abdf97f011ac9054fec0058f143671b2f`）
Finding catalog DEC-019: **Accepted** / EMPTY / NOT ADOPTED（[`decision-findingcode-issue8-dec-body-acceptance.md`](./decision-findingcode-issue8-dec-body-acceptance.md)）
A-1: NONE / A-2: N/A / A-3: N/A / A-4: **DEC-019** / A-5: OUT
FindingCode 作成: DO NOT START
DEC-008: **Accepted / LOCKED**（[`decision-dec-008-acceptance.md`](./decision-dec-008-acceptance.md)）
  制度上の作成者: ACCEPTED = 実践研修修了者 = 支援計画シート等の制度上の作成者
  独立した最終承認者: **NOT ADOPTED** → アプリ独自の最終承認者を設定しない
  サービス管理責任者を最終承認者とする案: NOT ADOPTED / 不採用
PR #143 / DEC-008: MERGED（`713c40a…` / head `cfbbcd3…`）
DEC-008 Issue #8 ledger: [`decision-dec-008-issue8-ledger-registration.md`](./decision-dec-008-issue8-ledger-registration.md)（POSTED / comment `5229571943`）
DEC-008 consistency: [`decision-dec-008-canonicalization-consistency-check.md`](./decision-dec-008-canonicalization-consistency-check.md)（**CONSISTENT** / 最終確定）
Next substantive unit: **SELECTED / B / GOV-AUD-03**
  Selection: [`decision-next-substantive-unit-selection.md`](./decision-next-substantive-unit-selection.md)
  Scope: 判定スナップショット訂正の承認者
GOV-AUD-03: **Accepted** / Option E（[`decision-gov-aud-03-snapshot-correction-approver-acceptance.md`](./decision-gov-aud-03-snapshot-correction-approver-acceptance.md)）
  訂正承認者: 当面 application 層対象外
  具体的な承認ロール: NOT ADOPTED / NOT DEFINED
PR #145: MERGED（`f7448d2…` / head `ef738ed…`）
Decision-OP-3: **Accepted / LOCKED** / Option A（[`decision-op-3-observation-period-schema-acceptance.md`](./decision-op-3-observation-period-schema-acceptance.md)）
  periodFrom: REQUIRED / periodTo: REQUIRED
  Open-ended periodTo: NOT ADOPTED
  制度日数・既定観察窓の domain 埋め込み: NOT ADOPTED
  evaluateObservationPeriodMembership: UNCHANGED
  Logical contract: [`observation-period-schema-contract.md`](./observation-period-schema-contract.md)
  Consistency: [`decision-op-3-canonicalization-consistency-check.md`](./decision-op-3-canonicalization-consistency-check.md)（**FINAL CONSISTENT**）
PR #146: MERGED（`42b251b…` / head `974d083…`）
DEC-008 submit/return: **Accepted / LOCKED / Option C**（[`decision-dec-008-submit-return-roles-acceptance.md`](./decision-dec-008-submit-return-roles-acceptance.md)）
  提出/差戻しロール: application contract に固定しない（NOT ADOPTED）
  Independent Review: PASS（[`decision-dec-008-submit-return-roles-independent-review.md`](./decision-dec-008-submit-return-roles-independent-review.md)）
  Consistency: [`decision-dec-008-submit-return-roles-canonicalization-consistency-check.md`](./decision-dec-008-submit-return-roles-canonicalization-consistency-check.md)（**FINAL CONSISTENT**）
PR #147: MERGED（`ce05cd0…` / head `31e1df0…`）
GOV-AUD-04: **Accepted / LOCKED / Option E**（[`decision-gov-aud-04-logical-delete-role-acceptance.md`](./decision-gov-aud-04-logical-delete-role-acceptance.md)）
  論理削除を許可するロール: 当面 application 層対象外
  具体的な許可ロール: NOT ADOPTED / NOT DEFINED
  Consistency: [`decision-gov-aud-04-canonicalization-consistency-check.md`](./decision-gov-aud-04-canonicalization-consistency-check.md)（**FINAL CONSISTENT**）
PR #149: MERGED（`cb14c13…` / head `55112f4…`）
Decision-ILB-1: **Human Policy 1–6 Accepted / LOCKED / Option A / FINAL CONSISTENT**（[`decision-ilb-1-human-policy-acceptance.md`](./decision-ilb-1-human-policy-acceptance.md)）
  用途: 残存 Decision を分類・判断する正本方針
  分類 A–E: 判断フレームとして採用
  inventory provisional 行: **自動 Accepted しない**
  Consistency: [`decision-ilb-1-canonicalization-consistency-check.md`](./decision-ilb-1-canonicalization-consistency-check.md)（**FINAL CONSISTENT**）
  Packet: [`decision-ilb-1-institutional-local-boundary-decision-packet.md`](./decision-ilb-1-institutional-local-boundary-decision-packet.md)
  Inventory: [`decision-ilb-1-residual-decision-inventory.md`](./decision-ilb-1-residual-decision-inventory.md)
PR #151: MERGED（`e2bd256…` / head `4f5a833…`）
Decision-RD-3: **Accepted / LOCKED**（[`decision-rd-3-monitoring-guidance-acceptance.md`](./decision-rd-3-monitoring-guidance-acceptance.md)）
  モニタリング時期「3か月に1回程度」を目安として表示・通知 / informational only
  制度・業務上の見直しは維持（モニタリング不要ではない）
  採用しない: 期限超過状態 / 超過警告 / 業務制限 / 90日固定 / hard due·overdue
  Logical contract: [`review-monitoring-guidance-contract.md`](./review-monitoring-guidance-contract.md)
  Consistency: [`decision-rd-3-canonicalization-consistency-check.md`](./decision-rd-3-canonicalization-consistency-check.md)（**FINAL CONSISTENT**）
  Independent Review: [`decision-rd-3-independent-review.md`](./decision-rd-3-independent-review.md)（**PASS**）
  Selected via: ILB-1 residual Option C（[`decision-ilb-1-next-residual-decision-selection.md`](./decision-ilb-1-next-residual-decision-selection.md)）
PR #153 / #154: MERGED（RD-3 Acceptance / FINAL CONSISTENT）
GOV-AUD-05 / DEC-012: **Accepted / LOCKED / Option A**（[`decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md`](./decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md)）
  法定保存期間中: 完全削除を禁止する / 保存期間: 5年間
  5年経過後の削除可否: **別 Decision（OPEN）**
  5年経過後の自動完全削除 / 物理削除の自動実行: NOT ADOPTED
  Logical contract: [`retention-complete-deletion-prohibition-contract.md`](./retention-complete-deletion-prohibition-contract.md)
  Selected via: ILB-1 second residual Option A（[`decision-ilb-1-second-residual-decision-selection.md`](./decision-ilb-1-second-residual-decision-selection.md)）
DEC-009: **Accepted / LOCKED / Option A**（[`decision-dec-009-snapshot-save-timing-acceptance.md`](./decision-dec-009-snapshot-save-timing-acceptance.md)）
  アセスメント作成途中: 下書き扱い
  正式記録: 確定時に保存
  確定後の修正: 元の確定記録を残す / 新しい版として保存
  既存確定記録の上書き: NOT ADOPTED / 履歴: 保持する
  Logical contract: [`assessment-snapshot-save-timing-contract.md`](./assessment-snapshot-save-timing-contract.md)
  Consistency: [`decision-dec-009-canonicalization-consistency-check.md`](./decision-dec-009-canonicalization-consistency-check.md)（**FINAL CONSISTENT**）
  Selected via: ILB-1 third residual Option A（[`decision-ilb-1-third-residual-decision-selection.md`](./decision-ilb-1-third-residual-decision-selection.md)）
PR #157 / #158: MERGED（DEC-009 Acceptance / FINAL CONSISTENT）
AS-EC-1 Entry #8: **Accepted / LOCKED / Option A / FINAL CONSISTENT**（[`decision-as-ec-1-entry-8-technical-plan-acceptance.md`](./decision-as-ec-1-entry-8-technical-plan-acceptance.md)）
  Plan: [`assessment-snapshot-complete-contract-technical-plan.md`](./assessment-snapshot-complete-contract-technical-plan.md)
  Consistency: [`decision-as-ec-1-entry-8-canonicalization-consistency-check.md`](./decision-as-ec-1-entry-8-canonicalization-consistency-check.md)（**FINAL CONSISTENT**）
  Independent Review（Acceptance #159）: [`decision-as-ec-1-entry-8-independent-review.md`](./decision-as-ec-1-entry-8-independent-review.md)（**PASS**）
  Independent Review（FINAL CONSISTENT）: [`decision-as-ec-1-entry-8-final-consistent-independent-review.md`](./decision-as-ec-1-entry-8-final-consistent-independent-review.md)（**PASS**）
  Selected via: ILB-1 fourth residual Option A（[`decision-ilb-1-fourth-residual-decision-selection.md`](./decision-ilb-1-fourth-residual-decision-selection.md)）
PR #159: MERGED（Entry #8 Acceptance + Entry #1/#2 audit）
AS-EC-1 Entry #1/#2 audit: [`decision-as-ec-1-entry-1-2-read-only-consistency-audit.md`](./decision-as-ec-1-entry-1-2-read-only-consistency-audit.md)
  #1 PASS / MET · #2 PASS / MET（Option A / PR-J；監査時点履歴は PARTIAL）
AS-EC-1 Entry #2 Acceptance: [`decision-as-ec-1-entry-2-ownership-pr-boundary-acceptance.md`](./decision-as-ec-1-entry-2-ownership-pr-boundary-acceptance.md)
  Boundary: [`assessment-snapshot-complete-contract-pr-boundary.md`](./assessment-snapshot-complete-contract-pr-boundary.md)
AS-EC-1 overall: **MET / Accepted / LOCKED**（[`decision-as-ec-1-overall-entry-acceptance.md`](./decision-as-ec-1-overall-entry-acceptance.md)；Basis = Entry #1〜#8）
Ninth residual: SELECTED / A — AS-EC-1 overall（CONSUMED / [`decision-ilb-1-ninth-residual-decision-selection.md`](./decision-ilb-1-ninth-residual-decision-selection.md)）
Fifth residual: SELECTED / A — Entry #2（CONSUMED / [`decision-ilb-1-fifth-residual-decision-selection.md`](./decision-ilb-1-fifth-residual-decision-selection.md)）
Current single gate: **他残存 Decision を一件ずつ選定・判定**（PR-J domain Implementation Start GO / RD-3 / retention / DEC-009 / Entry #8 / Entry #2 / #5/#6/#7 / overall / Schema ID naming+value / schemaVersion+dtoVersion（1.0.0）/ application save 境界 / SharePoint·adapter 境界 / DEC-6 mapping rules / placement confirmation rules / tenant confirmation GO 境界（Decision-AS-TENANT-CONFIRM-1 = RO-1+EV-1+RB-1+XG-1）/ tenant confirmation execution authorization（Decision-AS-TENANT-CONFIRM-EXEC-1 = ES-1+TB-1+EO-1+FG-1）/ new SPFx target reuse（Decision-AS-TARGET-REUSE-1 = B）/ new SPFx target provisioning（Decision-AS-NEW-TARGET-PROVISION-1 = ST-1+LT-1+NM-1+EX-1）/ new SPFx naming（Decision-AS-NEW-TARGET-NAMES-1 = SU-1+LN-1+IN-1+XB-1；intended Site=/sites/XXXXX Lists=XXXXX+YYYYY PLACEHOLDER）/ multi-facility org site topology（Decision-AS-ORG-SITE-TOPOLOGY-1 = OT-1+FS-1+SP-1+PP-1+PH-1+XB-1）は CONSUMED。PR #184 MERGED（8474535… / 0be50a1…）。PR #185 MERGED（1aef0d3…）。既存 /sites/welfare = REFERENCE ONLY。New SPFx deployment target = ORG TOPOLOGY LOCKED / NOT CREATED / HOLD。Placeholder intended names = NOT CREATABLE。Formal pilot Site/List names = LOCKED / OBSERVED / CONFIRMED（isogo/honmoku；SupportPlans/AssessmentSnapshots）。CN-1 observation = CLOSED / CONSUMED（DEFAULT_COLUMNS_ONLY；custom application columns = 0；match-existing premise NOT APPLICABLE）。Site/List creation = COMPLETED（pilot）。Placeholder creation = FORBIDDEN。Decision-AS-SCHEMA-MAPPING-NEXT-1 = Accepted / LOCKED / MT-1+IN-A+CP-1+XB-1（twenty-ninth CONSUMED）。Next residual = NOT SELECTED。PR #191 = MERGED（0738ea79…）。Implementation Start / adapter / column creation = HOLD/FORBIDDEN。Issue Status Reconciliation = ASSESSED / independent candidate（#6/#8/#22；close≠body sync）。PR #188 = MERGED / Independent Review PASS。PR #187 = MERGED / Current SoT。PR #186 = CLOSED / NOT MERGED / SUPERSEDED。PR #189 = SUPERSEDED for observation SoT。Independent Review #187 = PASS（P0=0/P1=0/P2=0）。SharePoint adapter / schema mapping impl = HOLD（≠ mapping-complete）。Decision-AS-PILOT-PROVISION-EXEC-1 = Accepted / LOCKED / PX-1+VR-1+FG-1+XB-1+EG-1+AP-1（Execution GO = GIVEN；AI mutation FORBIDDEN；VR-1 PASS；SV-1/LV-1 CONFIRMED；Intent=Observed；Mismatch=0；Sites 2/2；Lists 4/4；CN-1 observation CLOSED）。Decision-AS-PILOT-LIST-NAMES-1 = Accepted / LOCKED / LN-1+XB-1（SupportPlans / AssessmentSnapshots；OBSERVED / CONFIRMED）。Decision-AS-PILOT-LIST-OWNERSHIP-1 = Accepted / LOCKED / LO-1+VP-1+EX-1+NB-1+XB-1（List A=SupportPlan+Version；List B=AssessmentSnapshot）。Decision-AS-PILOT-FACILITY-IDENTITY-1 = Accepted / LOCKED / PO-1+FK-1+SN-1+LN-D+XB-1（磯子=isogo → /sites/severe-support-isogo；本牧=honmoku → /sites/severe-support-honmoku）。Value Acceptance for /sites/welfare as new-SPFx target = NOT APPLICABLE。FindingCode / A-5 / Schema·DTO code assignment / application・SharePoint 実装 = HOLD。Tenant confirmation execution = IN PROGRESS / READ-ONLY。Mutation = NONE。tenant changes / Deploy / real data = NO-GO。Post-retention = OPEN / AUTO-START FORBIDDEN）
OUT: FindingCode / A-5 / Implementation Start / PR-J implementation / SharePoint・Deploy・real data
  post-retention deletion 自動 Accepted / overall MET を実装開始とみなすこと / 日数・ロール・承認発明 / tenant 変更・List列作成 / EXISTING-APP REFERENCE を新SPFx環境値 Accepted 扱い / TARGET-REUSE B を Site・List 作成 GO 扱い / NEW-TARGET-PROVISION Acceptance を具体名発明・作成実行扱い / NEW-TARGET-NAMES Acceptance を作成 GO・SV-1/LV-1 CONFIRMED 扱い / INTENDED を OBSERVED/CONFIRMED/CREATED 扱い / Agent による Site URL・List name・facilityKey 再発明 / ORG-SITE-TOPOLOGY Acceptance を作成 GO 扱い / PILOT-FACILITY-IDENTITY Acceptance を作成 GO・List names 確定扱い / PILOT-LIST-OWNERSHIP Acceptance を List names 確定・作成 GO 扱い / PILOT-LIST-NAMES Acceptance を作成 GO・SV-1/LV-1 CONFIRMED 扱い / PILOT-PROVISION-EXEC Execution GO を Agent SharePoint mutation 許可・SV-1/LV-1 CONFIRMED・Implementation Start 扱い / VR-1 PASS を CN-1 CONFIRMED・Implementation Start・Deploy 扱い / CN-1 CLOSED を mapping-complete・Implementation Start 扱い / DEFAULT_COLUMNS_ONLY を adapter mapping CONFIRMED 扱い / Internal Name 発明 / CN-1 OPEN のまま SharePoint adapter・schema mapping 実装開始扱い
日数・期限の発明: FORBIDDEN
AI 要約を DEC-008 根拠に硬化: FORBIDDEN
制度資料が支持しない承認フロー追加: FORBIDDEN
根拠のない承認権限をアプリに作る: FORBIDDEN
3ヶ月 → 90日 conversion: FORBIDDEN
通知月 ≠ overdue / 通知 ≠ 業務違反
hard due / overdue: OUT OF CURRENT SCOPE
Finding catalog: EMPTY / NOT ADOPTED（A-1 NONE / A-2・A-3 N/A / A-4 DEC-019）
A-5: OUT（DEC-019 scope）/ separate Decision は未開始
Implementation Start: HOLD
Issue #24 Close: NO-GO
deploy: NO-GO
SharePoint / M365: 変更なし
```









上位入口:

- [`issue-24-remaining-audit-post-rsv.md`](./issue-24-remaining-audit-post-rsv.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)
- [`domain-reconstruction-foundation.md`](./domain-reconstruction-foundation.md)
- [`decision-fc-1-finding-code-catalog-ownership.md`](./decision-fc-1-finding-code-catalog-ownership.md)
- [`decision-fc-2-finding-code-catalog-delivery-boundary.md`](./decision-fc-2-finding-code-catalog-delivery-boundary.md)
- [`decision-fc-3-finding-code-catalog-snapshot-logical-contract.md`](./decision-fc-3-finding-code-catalog-snapshot-logical-contract.md)
- [`decision-fc-4-catalog-version-identifier-contract.md`](./decision-fc-4-catalog-version-identifier-contract.md)
- [`decision-fc-5-catalog-version-identifier-representation-ownership.md`](./decision-fc-5-catalog-version-identifier-representation-ownership.md)
- [`decision-fc-6-business-ownership-ref-logical-contract.md`](./decision-fc-6-business-ownership-ref-logical-contract.md)
- [`fc-decision-exit-review.md`](./fc-decision-exit-review.md)
- [`fc-decision-exit-review-acceptance.md`](./fc-decision-exit-review-acceptance.md)
- [`a-class-structure-acceptance.md`](./a-class-structure-acceptance.md)
- [`decision-sev-2-purpose-source.md`](./decision-sev-2-purpose-source.md)
- [`decision-sev-2-concept-inv.md`](./decision-sev-2-concept-inv.md)
- [`decision-sev-2-vocab-not-adopted.md`](./decision-sev-2-vocab-not-adopted.md)
- [`decision-gov-rule-06-review-cadence-acceptance.md`](./decision-gov-rule-06-review-cadence-acceptance.md)
- [`decision-gov-rule-06-review-cadence-source-review.md`](./decision-gov-rule-06-review-cadence-source-review.md)
- [`decision-gov-rule-05-review-anchor-acceptance.md`](./decision-gov-rule-05-review-anchor-acceptance.md)
- [`decision-gov-rule-07-notice-decision-packet.md`](./decision-gov-rule-07-notice-decision-packet.md)
- [`decision-gov-rule-07-notice-acceptance.md`](./decision-gov-rule-07-notice-acceptance.md)
- [`decision-gov-rule-08-due-overdue-decision-packet.md`](./decision-gov-rule-08-due-overdue-decision-packet.md)
- [`decision-gov-rule-08-due-overdue-acceptance.md`](./decision-gov-rule-08-due-overdue-acceptance.md)
- [`review-cadence-contract.md`](./review-cadence-contract.md)
- [`review-anchor-contract.md`](./review-anchor-contract.md)
- [`review-notice-contract.md`](./review-notice-contract.md)
- [`review-due-overdue-contract.md`](./review-due-overdue-contract.md)
- [`review-due.md`](./review-due.md)
- [`implementation-entry-decision-reaudit.md`](./implementation-entry-decision-reaudit.md)
- [`decision-findingcode-a14-bundle-content-decision-packet.md`](./decision-findingcode-a14-bundle-content-decision-packet.md)
- [`decision-findingcode-option-c-selection.md`](./decision-findingcode-option-c-selection.md)
- [`findingcode-issue8-dec-body-prep.md`](./findingcode-issue8-dec-body-prep.md)
- [`decision-findingcode-issue8-dec-body-acceptance-packet.md`](./decision-findingcode-issue8-dec-body-acceptance-packet.md)
- [`decision-findingcode-issue8-dec-body-acceptance.md`](./decision-findingcode-issue8-dec-body-acceptance.md)
- [`decision-findingcode-a4-dec-number-review.md`](./decision-findingcode-a4-dec-number-review.md)

## Phase 1 — read-only 再監査結果

### 基準 SHA

| 項目 | 値 |
|---|---|
| 要求 main | `199217ce2aaf2fec3d47cb7cb1f312c7e9c444d6` |
| 実測 `origin/main` / `HEAD` | `199217ce2aaf2fec3d47cb7cb1f312c7e9c444d6` |
| 一致 | **YES** |
| PR #88 | MERGED（Decision-FLR-1 Accepted） |
| PR #96 | MERGED（Handoff AuditEvent candidate） |
| PR #97 | MERGED（AuditEvent persistence Entry Criteria） |
| PR #99 | MERGED（AuditEvent persistence technical contract） |
| Decision-HO-1 | Accepted（Owner #17） |
| Decision-AUD-RET-1 | Accepted（#19 / 5215844603） |
| Decision-AUD-WR-1 | Accepted（#17 / 5215846338 / `#22A`） |

### Issue / Decision comment 参照

本環境の GitHub Issues API は 403（`Resource not accessible by integration`）のため、
Issue 本文・コメント全文の再取得は未実施。
所有・Accepted 証跡は **main 上の docs 正本に記録された comment ID** を用いる
（先行監査 `issue-24-remaining-audit-pr-i-selection.md` と同方針）。

| 対象 | docs上の位置づけ | 記録された comment / Decision ID |
|---|---|---|
| Issue #24 ownership | 所有入口 | `5204768249` |
| Issue #27 ownership | 型契約 | `5204763504` |
| Issue #17 ownership | 運用設計案 | `5204771950` |
| Finding lifecycle C0 | #24 所有確定 | `5209785751` |
| Decision-FLR-1 | Finding reopen policy Accepted（不許可・実装 NONE） | docs 正本（PR #88 MERGED）。Issue comment ID は API 403 のため未取得 |
| Decision-HO-1 | Handoff transition ownership Accepted（Owner #17） | [`decision-ho-1-handoff-transition-ownership.md`](./decision-ho-1-handoff-transition-ownership.md) |
| HANDOFF_STATUS_CHANGED | Issue #17 Accepted | `5215557663` |
| AuditEvent 実保存 Entry Criteria | MERGED（PR #97） | [`audit-event-persistence-entry-criteria.md`](./audit-event-persistence-entry-criteria.md) |
| Decision-AUD-RET-1 | Accepted（最低5年 / occurredAt / 自動削除しない） | [`decision-aud-ret-1-auditlog-retention.md`](./decision-aud-ret-1-auditlog-retention.md) / #19 `5215844603` |
| Decision-AUD-WR-1 | Accepted（technical owner `#22A`） | [`decision-aud-wr-1-audit-write-ownership.md`](./decision-aud-wr-1-audit-write-ownership.md) / #17 `5215846338` |
| Persistence technical contract | MERGED（PR #99） | [`audit-event-persistence-contract.md`](./audit-event-persistence-contract.md) |
| Decision-AUD-ALIGN-1 | Accepted（#22A write-result / idempotency 整合） | [`decision-aud-align-1-audit-event-write-result-alignment.md`](./decision-aud-align-1-audit-event-write-result-alignment.md) |
| Decision-AUD-IDEM-1 | Accepted（RecordId=auditEventId / Key=write metadata） | [`decision-aud-idem-1-audit-event-idempotency.md`](./decision-aud-idem-1-audit-event-idempotency.md) |
| Decision-AUD-SAN-VALUE-1 | Accepted（validate+reject / FINITE_ENUM targetType） | [`decision-aud-san-value-1-audit-event-value-safety.md`](./decision-aud-san-value-1-audit-event-value-safety.md) |
| Decision-AUD-SAN-1 | Accepted（hardening MERGED / PR #102） | validateAuditEvent は SAN-VALUE 適合 |
| Decision-AUD-REPLAY-1 | Accepted（safe replay / dual lookup） | [`decision-aud-replay-1-audit-event-safe-replay.md`](./decision-aud-replay-1-audit-event-safe-replay.md) |
| Decision-AUD-REPO-1 | Accepted（uniqueness / multi-match / race） | [`decision-aud-repo-1-audit-event-repository-uniqueness.md`](./decision-aud-repo-1-audit-event-repository-uniqueness.md) / #22 `5219980098` / `5220288044` / `5220303406` |
| Issue #29 physical mapping | Accepted / MERGED（PR #108） | [`audit-event-physical-mapping-29.md`](./audit-event-physical-mapping-29.md) |
| FindingIdentity 組立 | Accepted / Start | `5210065336` / `5210078985` |
| finding 再発 | Accepted / Start | `5210206944` / `5210210553` |
| Snapshot Result変換 | Selection / Decision / Start | `5210366943` / `5210389077` / `5210392317` |
| SupportPlan status transition | Accepted | `5211039927` |
| Active 一意性 | Accepted | `5212085136` |
| Observation OP-1/OP-2 | Accepted（ownership 表） | comment ID は ownership 表に未記載 |
| Review due RD-1/RD-2 | Accepted（ownership 表） | comment ID は ownership 表に未記載 |
| RuleSetVersion RSV-1〜4 | Accepted（ownership 表） | comment ID は ownership 表に未記載 |
| Issue #19 / GOV-AUD-01〜10 | 正式回答待ち | — |
| Issue #16 / #19 / GOV-RULE-06 | 見直し周期 practice cadence | **Accepted** [`decision-gov-rule-06-review-cadence-acceptance.md`](./decision-gov-rule-06-review-cadence-acceptance.md) / source review PASS / contract Accepted |
| Issue #16 / #19 / GOV-RULE-05 | 見直し周期の基準日 | **Accepted** [`decision-gov-rule-05-review-anchor-acceptance.md`](./decision-gov-rule-05-review-anchor-acceptance.md) / [`review-anchor-contract.md`](./review-anchor-contract.md) |
| Issue #8 / DEC-009 等 | Deferred 含む | — |

### 完了済み純関数（再オープンしない）

| 単位 | 正本 | 状態 |
|---|---|---|
| Finding lifecycle 許可3辺 | `finding-lifecycle-transition.md` | DONE（PR #64）。`Resolved` 終端 |
| Finding reopen policy（Decision-FLR-1） | `decision-flr-1-finding-reopen-policy.md` | **Accepted**。再オープン不許可。実装 NONE |
| FindingCode Identity 組立（caller-supplied） | `finding-identity-assembly.md` | DONE（PR #66） |
| AssessmentSnapshot Result変換（永続なし） | `assessment-snapshot-result-conversion.md` | DONE（PR #72） |
| 観察期間メンバシップ | `observation-period.md` | DONE（PR #79/#80）。`evaluateObservationPeriodMembership` |
| 見直し期限 asOf 相対 | `review-due.md` | DONE（PR #81/#82）。`evaluateReviewDueRelativeToAsOf` |
| RuleSetVersion 選択 | `ruleset-version-selection.md` | DONE（PR #83/#84） |

## Decision Matrix

各行は **独立承認可能** とする。一括 Accepted 前提にしない。

| Decision | 対象 | 現状 | 所有候補 | 依存 | Accepted後に可能になる作業 |
|---|---|---|---|---|---|
| **Decision-FLR-1** | Finding reopen policy（`Resolved`→?、再オープン可否と遷移先） | **Accepted**。再オープン不許可。`Resolved` 終端維持。`Resolved → *` 禁止。実装 impact **NONE**（既存 `transitionFindingStatus` UNCHANGED）。正本: [`decision-flr-1-finding-reopen-policy.md`](./decision-flr-1-finding-reopen-policy.md) | Issue #24（lifecycle 所有は C0 `5209785751`） | 既存3辺契約を変更しないこと | **実装作業なし**。lifecycle 契約へ Accepted 追記のみ。新問題は生成・再発契約で扱う |
| **Decision-HO-1** | Handoff transition ownership | **Accepted**（Owner **#17**）。遷移 / ロール / mutation / AuditEvent candidate まで MERGED。正本: [`decision-ho-1-handoff-transition-ownership.md`](./decision-ho-1-handoff-transition-ownership.md) | Issue #17 | `GOV-AUD-02` と分離維持 | 実保存は別ゲート（[`audit-event-persistence-entry-criteria.md`](./audit-event-persistence-entry-criteria.md)） |
| **Decision-AUD-RET-1** | AuditLog 保存期間（`GOV-AUD-06` / `DEC-011`） | **Accepted**。最低5年 / `occurredAt` / 5年経過だけでは自動削除しない。証跡 #19 `5215844603`。正本: [`decision-aud-ret-1-auditlog-retention.md`](./decision-aud-ret-1-auditlog-retention.md) | Issue #19 / #8 | 書込先所有と分離 | Entry Criteria #4 充足済み |
| **Decision-AUD-WR-1** | AuditEvent 書込先所有 | **Accepted**。technical owner = Issue `#22A`。証跡 #17 `5215846338`。正本: [`decision-aud-wr-1-audit-write-ownership.md`](./decision-aud-wr-1-audit-write-ownership.md) | Issue `#22A` | 保存期間と分離 | 技術契約 MERGED（PR #99）。実装は ALIGN-1 後 |
| **Decision-AUD-ALIGN-1** | #22A write-result / idempotency と persistence contract の整合 | **Accepted**。正本: [`decision-aud-align-1-audit-event-write-result-alignment.md`](./decision-aud-align-1-audit-event-write-result-alignment.md) | Issue `#22A` | PR #99 契約 MERGED 前提 | Logical boundary MERGED（PR #104）。Replay は Entry + separate GO まで HOLD |
| **Decision-AUD-IDEM-1** | AuditEvent persistence identity / replay | **Accepted**。正本: [`decision-aud-idem-1-audit-event-idempotency.md`](./decision-aud-idem-1-audit-event-idempotency.md) | Issue `#22A` | ALIGN-1 | write envelope + FX-IDEM 表現 |
| **Decision-AUD-SAN-VALUE-1** | AuditEvent value safety（validate+reject） | **Accepted**。正本: [`decision-aud-san-value-1-audit-event-value-safety.md`](./decision-aud-san-value-1-audit-event-value-safety.md) | Issue `#22` / `#27` hardening | ALIGN-1 | hardening MERGED（PR #102）。SAN-1 Accepted |
| **Decision-AUD-SAN-1** | AuditEvent value sanitization / write-boundary 完了判定 | **Accepted**。hardening MERGED（PR #102） | Issue `#27` / `#22` | SAN-VALUE-1 | Logical boundary MERGED（PR #104） |
| **Decision-AUD-REPLAY-1** | existing-result verification / safe replay | **Accepted**。正本: [`decision-aud-replay-1-audit-event-safe-replay.md`](./decision-aud-replay-1-audit-event-safe-replay.md) | Issue `#22A` | IDEM-1 / ALIGN-1 / PR #104 | Replay MERGED（PR #106） |
| **Decision-AUD-REPO-1** | repository uniqueness / multi-match / race | **Accepted**。正本: [`decision-aud-repo-1-audit-event-repository-uniqueness.md`](./decision-aud-repo-1-audit-event-repository-uniqueness.md)。証跡 #22 `5219980098` / `5220288044` / `5220303406` | Issue `#22A` | REPLAY-1 / IDEM-1 | `#29` mapping MERGED（PR #108）→ Entry PASS（5224544473）→ `#22B` Human GO（5224579776）→ PR #110 MERGED（62a43d7f…） |
| **Decision-SEV-1** | FindingSeverity vocabulary ownership（DEC方式 A/B） | **Accepted**（Option A）。Issue #8 に新しい DEC を追加する方式。Contract break NO。FindingIdentity / stable Finding ID UNCHANGED。正本: [`decision-sev-1-finding-severity-vocabulary-ownership.md`](./decision-sev-1-finding-severity-vocabulary-ownership.md) | Issue #8（**DEC-018** で不採用本文を記録済み） | 方式選択前に値一覧を採択しない（維持） | **Decision-SEV-2** packet へ進める（実装は開始しない） |
| **Decision-SEV-2** | FindingSeverity boundary packet（PURPOSE / CONCEPT-INV / VOCAB / ASSIGN を分離） | packet: [`decision-sev-2-finding-severity-boundary.md`](./decision-sev-2-finding-severity-boundary.md)。**PURPOSE = RECORDED**（[`decision-sev-2-purpose-source.md`](./decision-sev-2-purpose-source.md)。MHLW-first）。**CONCEPT-INV = COMPLETED**（[`decision-sev-2-concept-inv.md`](./decision-sev-2-concept-inv.md)。公式概念=行動関連項目合計点数。汎用 Severity taxonomy NOT FOUND）。**SEV-2-VOCAB = Accepted / Option A / NOT ADOPTED**；**Canonical = COMPLETE（Issue #8 / DEC-018）**（[`decision-sev-2-vocab-not-adopted.md`](./decision-sev-2-vocab-not-adopted.md)）。**SEV-2-ASSIGN = N/A / DO NOT START** | Issue #8 / **DEC-018**（comment `5225426738`） | **SEV-1 Accepted** | SEV line 完了。代替概念モデルは別 Entry Criteria。実装 NOT STARTED |
| **Decision-FC-1** | FindingCode catalog ownership | **Accepted / Option B**。Issue #8 に新しい DEC を追加する方式。後続 **DEC-019 = EMPTY / NOT ADOPTED**。Identity 組立 UNCHANGED。Implementation Start **HOLD**。正本: [`decision-fc-1-finding-code-catalog-ownership.md`](./decision-fc-1-finding-code-catalog-ownership.md) | Issue #8 / **DEC-019** | A-1 NONE / A-2・A-3 N/A / A-4 DEC-019 / A-5 OUT | **Decision-FC-2〜FC-6** Accepted logical |
| **Decision-FC-2** | Catalog delivery boundary | **Accepted / Option C**。delivery = versioned immutable catalog snapshot input。repository は catalog 値を ownership しない。正本: [`decision-fc-2-finding-code-catalog-delivery-boundary.md`](./decision-fc-2-finding-code-catalog-delivery-boundary.md) | FC-1 Accepted（Option B / Issue #8） | **FC-1 Accepted**。採番・写像表の推測禁止 | **Decision-FC-3** Accepted |
| **Decision-FC-3** | Catalog snapshot logical contract | **Accepted / Option C**。Complete logical contract surface（必須情報・version 一意識別責務・immutable・selected 整合・fail-closed）。正本: [`decision-fc-3-finding-code-catalog-snapshot-logical-contract.md`](./decision-fc-3-finding-code-catalog-snapshot-logical-contract.md) | FC-2 Accepted（Option C） | version 文字列・schema・storage・provider・値一覧は決めない | **Decision-FC-4** Accepted |
| **Decision-FC-4** | Catalog version identifier contract | **Accepted / Option C**。Complete identifier logical contract（一意性・opaque・edition対応・reuse禁止・fail-closed）。正本: [`decision-fc-4-catalog-version-identifier-contract.md`](./decision-fc-4-catalog-version-identifier-contract.md) | FC-3 Accepted（Option C） | UUID/hash/semver/DEC番号・schema・storage・provider・値一覧は決めない | **Decision-FC-5** Accepted |
| **Decision-FC-5** | Catalog version identifier representation ownership | **Accepted / Option C**。Split ownership with explicit syntax-validation ceiling（business = Issue #8 change control / technical = Accepted profile 後の non-semantic syntax validation のみ）。正本: [`decision-fc-5-catalog-version-identifier-representation-ownership.md`](./decision-fc-5-catalog-version-identifier-representation-ownership.md) | FC-4 Accepted（Option C） | UUID/hash/semver 採択・値・schema・provider・実装は決めない | **Decision-FC-6** Accepted |
| **Decision-FC-6** | businessOwnershipRef logical contract | **Accepted / Option C**。Complete businessOwnershipRef logical contract（ownershipLedgerRef / catalogEditionRef・1:1 identifier 対応・immutable・fail-closed）。正本: [`decision-fc-6-business-ownership-ref-logical-contract.md`](./decision-fc-6-business-ownership-ref-logical-contract.md) | FC-3 / FC-5 Accepted | DEC 番号・値一覧・representation strategy・schema・provider・実装は決めない | DEC 本文 / strategy / materialization は別 Human Start。Implementation HOLD。Stale PR #126 は Merge しない |
| **Decision-OP-3** | SupportPlan Schema / 観察期間フィールド・制度日数・開放終端 | **Accepted / LOCKED / Option A**。periodFrom/periodTo REQUIRED。開放終端 NOT ADOPTED。制度日数・既定窓 domain 埋め込み NOT ADOPTED。純関数 UNCHANGED。正本: [`decision-op-3-observation-period-schema-acceptance.md`](./decision-op-3-observation-period-schema-acceptance.md) / [`observation-period-schema-contract.md`](./observation-period-schema-contract.md) / 整合 [`decision-op-3-canonicalization-consistency-check.md`](./decision-op-3-canonicalization-consistency-check.md) | Issue #24（メンバシップ）/ #26（Schema 関連） | OP-1/OP-2 Accepted。GOV-RULE-06 と混ぜない。日数発明禁止 | PR #146 Merge 後、次 substantive unit 選定（OPEN / NOT SELECTED）。Implementation は別 Human GO |
| **Decision-RC-1 / GOV-RULE-06** | 見直し周期 practice cadence（「3ヶ月に1回程度」） | **Accepted**（2026-08-09）。calendar-month cadence · approximate。正本: [`decision-gov-rule-06-review-cadence-acceptance.md`](./decision-gov-rule-06-review-cadence-acceptance.md) / [`review-cadence-contract.md`](./review-cadence-contract.md) / source review [`decision-gov-rule-06-review-cadence-source-review.md`](./decision-gov-rule-06-review-cadence-source-review.md) | Issue #16 / #19（判断）・#24（相対判定との分離維持） | `duration_days=90` へ変換しない。GOV-RULE-07/08 と混ぜない | Schema/実装は別 Entry + Human Implementation Start。既存 `evaluateReviewDueRelativeToAsOf` UNCHANGED |
| **Decision-RC-2 / GOV-RULE-05** | 見直し周期の基準日 | **Accepted**（2026-08-09）。初回=支援計画の有効開始日 / 2回目以降=前回見直し日。正本: [`decision-gov-rule-05-review-anchor-acceptance.md`](./decision-gov-rule-05-review-anchor-acceptance.md) / [`review-anchor-contract.md`](./review-anchor-contract.md) | Issue #16 / #19（判断）・#24（相対判定との分離維持） | GOV-RULE-06 と分離維持。due/overdue・通知・物理列は決めない | Schema/算出実装は別 Entry。`evaluateReviewDueRelativeToAsOf` UNCHANGED |
| **Decision-RC-3 / GOV-RULE-07** | 通知開始時期 | **Accepted**（2026-08-09）/ Option C。見直し対象暦月に入ったら通知 / precision = approximate。正本: [`decision-gov-rule-07-notice-acceptance.md`](./decision-gov-rule-07-notice-acceptance.md) / [`review-notice-contract.md`](./review-notice-contract.md) / packet [`decision-gov-rule-07-notice-decision-packet.md`](./decision-gov-rule-07-notice-decision-packet.md) | Issue #16 / #19（判断） | GOV-RULE-05/06 Accepted 前提。GOV-RULE-08 / RD-3 と混ぜない。日数変換禁止 | 通知実装は別 Entry + Human Implementation Start。`evaluateReviewDueRelativeToAsOf` UNCHANGED |
| **Decision-RC-4 / GOV-RULE-08** | 期限当日・期限超過の定義 | **Accepted**（2026-08-09）/ Option A / **NOT ADOPTED**。正本: [`decision-gov-rule-08-due-overdue-acceptance.md`](./decision-gov-rule-08-due-overdue-acceptance.md) / [`review-due-overdue-contract.md`](./review-due-overdue-contract.md) / packet [`decision-gov-rule-08-due-overdue-decision-packet.md`](./decision-gov-rule-08-due-overdue-decision-packet.md) | Issue #16 / #19（判断） | GOV-RULE-05/06/07 Accepted 前提。通知 ≠ overdue。`evaluateReviewDueRelativeToAsOf` UNCHANGED | hard due/overdue 実装 DO NOT START。再採択は新 Human Decision |
| **Decision-RD-3** | 接近窓・期限算出・超過後ポリシー | **Accepted / LOCKED**（2026-08-09）。モニタリング時期「3か月に1回程度」を目安として表示・通知 / informational only。期限超過・警告・業務制限・90日固定: 採用しない。hard due/overdue: NOT ADOPTED。正本: [`decision-rd-3-monitoring-guidance-acceptance.md`](./decision-rd-3-monitoring-guidance-acceptance.md) / [`review-monitoring-guidance-contract.md`](./review-monitoring-guidance-contract.md) | 別 Decision（RD-1 で #24 相対判定所有。算出・窓は別） | RD-1/RD-2 Accepted。GOV-RULE-05〜08 と整合。`evaluateReviewDueRelativeToAsOf` UNCHANGED | Implementation は別 Human GO。日数接近窓 domain 埋め込み禁止。89/90/91 は practice rule とみなさない |
| **Decision-AS-EC-1** | AssessmentSnapshot 完全契約 Entry Criteria | **MET / Accepted / LOCKED**（overall）。Entry #1〜#8 個別閉鎖済み / Accepted。正本 [`decision-as-ec-1-overall-entry-acceptance.md`](./decision-as-ec-1-overall-entry-acceptance.md)。**PR-J domain Implementation Start GO**（[`assessment-snapshot-complete-contract.md`](./assessment-snapshot-complete-contract.md)）。**FindingCode / A-5 / SharePoint / DTO = HOLD**。**Schema ID naming+value = Accepted**（[`decision-assessment-snapshot-schema-id-value-naming-acceptance.md`](./decision-assessment-snapshot-schema-id-value-naming-acceptance.md)）。**schemaVersion/dtoVersion = 1.0.0 Accepted**（[`decision-assessment-snapshot-schema-version-acceptance.md`](./decision-assessment-snapshot-schema-version-acceptance.md)）；**code assignment = HOLD** | Issue #24（完全契約）＋ `DEC-009` / `GOV-AUD`（#8/#19） | Entry Criteria 充足 + domain 実装 GO | **保存実装・Schema/DTO コード・SharePoint は含めない** |
| **DEC-009** | AssessmentSnapshot 保存タイミング | **Accepted / LOCKED / Option A / FINAL CONSISTENT**。下書き / 確定時保存 / 元確定保持＋新版 / 上書き NOT ADOPTED / 履歴保持。正本: [`decision-dec-009-snapshot-save-timing-acceptance.md`](./decision-dec-009-snapshot-save-timing-acceptance.md) / [`assessment-snapshot-save-timing-contract.md`](./assessment-snapshot-save-timing-contract.md) / 整合 [`decision-dec-009-canonicalization-consistency-check.md`](./decision-dec-009-canonicalization-consistency-check.md) | Issue #8 / #19 / #24 | AS-EC-1 overall・Schema・FindingCode と混ぜない | AS-EC-1 #3 unlock。実装は別 Human Implementation Start |
| **DEC-008** | 支援計画シート役割（制度上の作成者 / 独立最終承認者 / 提出・差戻し） | **Accepted / LOCKED**。制度上の作成者=実践研修修了者 / 独立最終承認者=**NOT ADOPTED** / 提出・差戻し=**NOT ADOPTED（app 非埋め込み / Option C）**。正本: [`decision-dec-008-acceptance.md`](./decision-dec-008-acceptance.md) / [`decision-dec-008-submit-return-roles-acceptance.md`](./decision-dec-008-submit-return-roles-acceptance.md) / 整合 [`decision-dec-008-submit-return-roles-canonicalization-consistency-check.md`](./decision-dec-008-submit-return-roles-canonicalization-consistency-check.md) | Issue #8 / DEC-008 | アプリ独自最終承認・提出/差戻し Binding を再導入しない。role-free 遷移維持 | PR #147 Independent Review → Merge → Final CONSISTENT。次 unit は Merge 後 |

### Snapshot Entry Criteria（整理のみ・実装しない）

`assessment-snapshot-result-design.md` の後続 Entry Criteria を、残 Decision 観点で再掲する。

| # | 条件 | 現状 |
|---|---|---|
| 1 | Result 技術設計が main にある | **PASS / MET**（設計 PR #51 + Result変換 PR #72。監査 [`decision-as-ec-1-entry-1-2-read-only-consistency-audit.md`](./decision-as-ec-1-entry-1-2-read-only-consistency-audit.md)） |
| 2 | 所有 Issue と PR 境界が記録済み | **PASS / MET**（所有 #24 / 完全契約実装 **PR-J** 専用独立。正本 [`decision-as-ec-1-entry-2-ownership-pr-boundary-acceptance.md`](./decision-as-ec-1-entry-2-ownership-pr-boundary-acceptance.md) / [`assessment-snapshot-complete-contract-pr-boundary.md`](./assessment-snapshot-complete-contract-pr-boundary.md)。Result変換は #24 / PR #51·#72） |
| 3 | `DEC-009` 保存タイミング Accepted または対象外明示 | **Accepted / LOCKED / Option A**（[`decision-dec-009-snapshot-save-timing-acceptance.md`](./decision-dec-009-snapshot-save-timing-acceptance.md)） |
| 4 | `GOV-AUD-03` 訂正承認境界 Accepted または application 対象外明示 | **Accepted / Option E**（application 対象外明示 / [`decision-gov-aud-03-snapshot-correction-approver-acceptance.md`](./decision-gov-aud-03-snapshot-correction-approver-acceptance.md)） |
| 5 | 完全 Finding または findingIds 参照境界 | **PASS / MET**（findingIds **NOT REQUIRED**。正本 [`decision-as-ec-1-entry-5-finding-ids-boundary-acceptance.md`](./decision-as-ec-1-entry-5-finding-ids-boundary-acceptance.md) / [`assessment-snapshot-finding-ids-boundary.md`](./assessment-snapshot-finding-ids-boundary.md)。完全 Finding 実装は要求しない） |
| 6 | サービス別 `NOT_APPLICABLE` reason 正本または HOLD 方針 | **PASS / MET**（HOLD方針 = サービス別正本は今採択しない。正本 [`decision-as-ec-1-entry-6-not-applicable-reason-acceptance.md`](./decision-as-ec-1-entry-6-not-applicable-reason-acceptance.md) / [`assessment-snapshot-not-applicable-reason-hold.md`](./assessment-snapshot-not-applicable-reason-hold.md)。値一覧発明 FORBIDDEN） |
| 7 | Schema ID / schemaVersion / DTO versioning | **PASS / MET**（DEC-1 準拠。正本 [`decision-as-ec-1-entry-7-schema-dto-versioning-acceptance.md`](./decision-as-ec-1-entry-7-schema-dto-versioning-acceptance.md) / [`assessment-snapshot-schema-dto-versioning.md`](./assessment-snapshot-schema-dto-versioning.md)）。**後続**: Decision-AS-SCHEMA-ID-1 Schema ID Accepted；**Decision-AS-SCHEMA-VERSION-1** schemaVersion/dtoVersion = `1.0.0` Accepted；code assignment HOLD |
| 8 | 型・validator・合成 fixture・contract tests 計画 | **Accepted / LOCKED / Option A / FINAL CONSISTENT**（[`decision-as-ec-1-entry-8-technical-plan-acceptance.md`](./decision-as-ec-1-entry-8-technical-plan-acceptance.md) / [`assessment-snapshot-complete-contract-technical-plan.md`](./assessment-snapshot-complete-contract-technical-plan.md) / 整合 [`decision-as-ec-1-entry-8-canonicalization-consistency-check.md`](./decision-as-ec-1-entry-8-canonicalization-consistency-check.md)。実装 DO NOT START） |

Result変換純関数は完成済みとして扱い、拡張しない。

## Phase 2 — 領域別評価

### A. Finding lifecycle 再オープン（Decision-FLR-1）— Accepted

正本: [`decision-flr-1-finding-reopen-policy.md`](./decision-flr-1-finding-reopen-policy.md)

| 問い | 正本根拠 | 結論 |
|---|---|---|
| `Resolved` → ? | Decision-FLR-1 Accepted / lifecycle 契約 | **許可しない**（終端維持） |
| `Closed` → ? | `FindingStatus` = Open/Confirmed/InProgress/Resolved のみ（#27 / PR #41） | Finding に `Closed` は **存在しない**。SupportPlan/Handoff の Closed と混同しない |
| 再オープン許可するか | Decision-FLR-1 | **不許可** |
| 許可する場合の遷移先 | 不許可のため無し | N/A |
| 実装 | Decision-FLR-1: impact NONE | `transitionFindingStatus` **UNCHANGED** |
| 新しい問題 | Decision-FLR-1 | 再オープンせず、生成・再発の既存契約に従う |

既存3辺（Open→Confirmed→InProgress→Resolved）は変更しない。

### B. FindingSeverity（Decision-SEV-1 / SEV-2）

| 問い | 正本根拠 | 結論 |
|---|---|---|
| ownership / change control | Decision-SEV-1 Accepted / Option A | **Issue #8 に新しい DEC を追加** |
| Contract / Identity | Decision-SEV-1 | Contract break **NO**。FindingIdentity / stable Finding ID **UNCHANGED** |
| purpose source | SEV-2-PURPOSE RECORDED | **MHLW / statutory-regulatory source first**。ローカル severity taxonomy **FORBIDDEN** |
| 制度概念調査 | SEV-2-CONCEPT-INV COMPLETED | **OFFICIAL_CONCEPT_EXISTS**（行動関連項目合計点数）。汎用 Severity taxonomy **NOT FOUND** |
| 正式値・意味 / 採否 | SEV-2-VOCAB Accepted / Option A | **FindingSeverity NOT ADOPTED**。Canonical **COMPLETE（Issue #8 / DEC-018 / comment 5225426738）** |
| domain 算出 vs caller-supplied | SEV-2-ASSIGN | **N/A / DO NOT START**（不採用のため） |

### C. FindingCode 業務カタログ（Decision-FC-1〜FC-6）

| 問い | 正本根拠 | 結論 |
|---|---|---|
| ownership / change control | Decision-FC-1 Accepted / Option B | **Issue #8 に新しい DEC を追加**（business DEC） |
| コード一覧正本 | Identity 組立は UNCHANGED。カタログ無し | **DEC-019 EMPTY / NOT ADOPTED**（A-1 NONE / A-2・A-3 N/A / A-4 DEC-019） |
| 追加・廃止の所有者 | Decision-FC-1 Option B | **Issue #8 DEC の新規採択または改訂** |
| delivery boundary | Decision-FC-2 Accepted / Option C | **versioned immutable catalog snapshot input**。repository は catalog 値を ownership しない |
| snapshot logical contract | Decision-FC-3 Accepted / Option C | Complete logical contract surface（必須情報・version 一意識別責務・immutable・selected 整合・fail-closed） |
| catalog version identifier | Decision-FC-4 Accepted / Option C | Complete identifier logical contract（一意性・opaque・edition対応・reuse禁止・fail-closed） |
| identifier representation ownership | Decision-FC-5 Accepted / Option C | Split ownership with explicit syntax-validation ceiling。business = Issue #8 / technical = non-semantic syntax validation ceiling only |
| businessOwnershipRef logical contract | Decision-FC-6 Accepted / Option C | Complete businessOwnershipRef logical contract（ownershipLedgerRef / catalogEditionRef・1:1 identifier 対応・immutable・fail-closed） |
| UUID / hash / semver / concrete syntax profile / schema / storage / provider | FC-6 対象外 | **UNDECIDED / DO NOT START** |
| Implementation Start | FC-1〜FC-6 | **HOLD** |
### D. Handoff 所有（Decision-HO-1）— Accepted

正本: [`decision-ho-1-handoff-transition-ownership.md`](./decision-ho-1-handoff-transition-ownership.md)

| 問い | 正本根拠 | 結論 |
|---|---|---|
| transition 所有 Issue | Decision-HO-1 Accepted | **Issue #17** |
| #24 自動割当 | 禁止方針維持のまま #17 を明示 Accepted | 自動割当は行っていない |
| 許可辺 | Decision-HO-EDGE-1 | Accepted（#17） |
| 実装（遷移〜候補） | PR #90 / #91 / #93 / #96 | **MERGED** |
| AuditEvent 実保存 | Entry Criteria | **MET**（PR #97 系）。実 SharePoint adapter / tenant は **別 Gate / NO-GO** |

### E. OP-3 / RD-3 / Review Cadence（GOV-RULE-06）

| Decision | 完了済み（触らない） | 残 |
|---|---|---|
| OP-3 | `evaluateObservationPeriodMembership` | SupportPlan/SP 列、制度日数、開放終端（現行は `periodTo` 必須） |
| RD-3 | `evaluateReviewDueRelativeToAsOf` | **Accepted / LOCKED**: informational「3か月に1回程度」目安表示・通知。期限超過・警告・業務制限・90日・hard due NOT ADOPTED。実装は別 Entry |
| RC-1 / GOV-RULE-06 | **Accepted**（「3ヶ月に1回程度」/ approximate month cadence） | 実装・Schema は別 Entry |
| RC-2 / GOV-RULE-05 | **Accepted**（初回=有効開始日 / 以降=前回見直し日） | 物理列は別。RD-3 Accepted / LOCKED（informational）。07/08 Accepted（08 は NOT ADOPTED） |
| GOV-RULE-07 | **Accepted** / Option C（対象暦月に入ったら通知） | 日数変換禁止。08 と分離。実装は別 |
| GOV-RULE-08 | **Accepted** / Option A / NOT ADOPTED | hard due/overdue 実装 DO NOT START。通知は informational |

```text
Issue #16 duration_days-only design: REVISION CANDIDATE
Issue #24 89/90/91 tests: MUST NOT REPRESENT THE 3-MONTH PRACTICE RULE
  （残すなら day-based relative engine の技術境界テストへ降格）
```

### F. AssessmentSnapshot Entry Criteria（Decision-AS-EC-1）

Result変換は完了。Entry #1〜#8 個別は閉鎖／Accepted。**Decision-AS-EC-1 overall = MET / Accepted**（[`decision-as-ec-1-overall-entry-acceptance.md`](./decision-as-ec-1-overall-entry-acceptance.md)）。
Implementation Start / PR-J domain: **GO**（[`assessment-snapshot-complete-contract.md`](./assessment-snapshot-complete-contract.md)）。FindingCode / A-5 / SharePoint / Schema·DTO code = HOLD。
Schema ID naming+value: **Accepted / LOCKED**（Decision-AS-SCHEMA-ID-1 = `severe-behavior-support.assessment-snapshot.snapshot`）。schemaVersion / dtoVersion: **Accepted / LOCKED = 1.0.0**（Decision-AS-SCHEMA-VERSION-1）。保存・DTO・SharePoint / 型への schemaId 割当はしない。

## 推奨承認順

監査結果と矛盾しない推奨順（依存がある場合は依存を先）:

```text
1. Decision-FLR-1   Finding reopen policy — Accepted（実装 NONE / PR #88 MERGED）
2. Decision-HO-1    Handoff transition ownership — Accepted（#17）。実装系列 MERGED
3. Decision-AUD-ALIGN-1  #22A write-result / idempotency 整合 — Accepted
4. Decision-AUD-IDEM-1 / AUD-SAN-VALUE-1 / AUD-SAN-1 / AUD-REPLAY-1 / AUD-REPO-1 — Accepted。logical/replay MERGED（PR #104/#106）。`#29` mapping Accepted / MERGED（PR #108）
5. Decision-SEV-1   FindingSeverity vocabulary ownership（A/B）— **Accepted（Option A）**
6. Decision-SEV-2   FindingSeverity boundary — PURPOSE **RECORDED**；CONCEPT-INV **COMPLETED**；VOCAB **Accepted / Option A / NOT ADOPTED**；Canonical **COMPLETE（Issue #8 / DEC-018）**；ASSIGN **N/A / DO NOT START**
7. Decision-FC-1    FindingCode catalog ownership — **Accepted / Option B**（Issue #8 new DEC）。Implementation HOLD
8. Decision-FC-2    Catalog delivery boundary — **Accepted / Option C**（versioned immutable catalog snapshot input）。Implementation HOLD
9. Decision-FC-3    Catalog snapshot logical contract — **Accepted / Option C**（complete logical contract surface）。Implementation HOLD
10. Decision-FC-4    Catalog version identifier contract — **Accepted / Option C**（complete identifier logical contract）。Implementation HOLD
11. Decision-FC-5    Catalog version identifier representation ownership — **Accepted / Option C**（split ownership with explicit syntax-validation ceiling）。Implementation HOLD
12. Decision-FC-6    businessOwnershipRef logical contract — **Accepted / Option C**（complete businessOwnershipRef logical contract）。Implementation HOLD
13. Decision-RC-1 / GOV-RULE-06  Review practice cadence（「3ヶ月に1回程度」）— **Accepted**
14. Decision-RC-2 / GOV-RULE-05  Review anchor date（初回=有効開始日 / 以降=前回見直し日）— **Accepted**
15. Decision-RC-3 / GOV-RULE-07  通知開始時期 — **Accepted** / Option C
16. Decision-RC-4 / GOV-RULE-08  due / overdue 定義 — **Accepted** / Option A / NOT ADOPTED
17. Decision-OP-3    Observation period Schema / 制度 / 開放終端
18. Decision-RD-3    Review monitoring guidance — **Accepted / LOCKED**（informational「3か月に1回程度」；90日/hard due NOT ADOPTED）
19. Decision-AS-EC-1 AssessmentSnapshot Entry Criteria（DEC-009 / GOV-AUD / Finding 境界後）
```

post GOV-RULE-05〜08 の Entry 再監査正本: [`implementation-entry-decision-reaudit.md`](./implementation-entry-decision-reaudit.md)。

```text
Current single gate（canonical）:
  Decision-ILB-1 Human Policy FINAL CONSISTENT
  → Decision-RD-3 FINAL CONSISTENT
  → GOV-AUD-05 / DEC-012 retention prohibition Accepted / LOCKED
  → DEC-009 save timing FINAL CONSISTENT
  → AS-EC-1 Entry #8 technical plan FINAL CONSISTENT（Option A）
  → Entry #1/#2（#1 PASS / #2 PASS·MET / PR-J）
  → 他残存 Decision を一件ずつ判定（#5/#6/#7 / overall / post-retention 含む）
    Fifth residual: SELECTED / A — Entry #2（CONSUMED）
Decision-ILB-1 Human Policy 1–6: ACCEPTED / LOCKED / FINAL CONSISTENT
Decision-RD-3: Accepted / LOCKED / FINAL CONSISTENT
GOV-AUD-05 / DEC-012（retention prohibition）: Accepted / LOCKED / Option A
  Closes only: 5年間は完全削除しない
  post-retention deletion: OPEN / 別 Decision
DEC-009: Accepted / LOCKED / Option A / FINAL CONSISTENT
  Closes only: AssessmentSnapshot 保存タイミング業務意味
AS-EC-1 Entry #8: Accepted / LOCKED / Option A / FINAL CONSISTENT
  Closes only: 技術計画の存在（実装開始ではない）
AS-EC-1 Entry #1: PASS / MET
AS-EC-1 Entry #2: PASS / MET（所有 #24 / PR-J）
AS-EC-1 overall: MET / Accepted / LOCKED（Entry #1〜#8；≠ Implementation Start）
GOV-AUD-04: Accepted / LOCKED / Option E / FINAL CONSISTENT
GOV-AUD-03: Accepted / Option E
Decision-OP-3: Accepted / LOCKED / FINAL CONSISTENT
DEC-008 submit/return: Accepted / LOCKED / Option C / FINAL CONSISTENT
Finding catalog DEC-019: Accepted / EMPTY / NOT ADOPTED
Finding catalog: EMPTY / NOT ADOPTED
A-5: OUT（DEC-019 scope）/ separate Decision は未開始
日数・期限 invention: FORBIDDEN
Review GOV-RULE line: closed for current scope（08 = NOT ADOPTED；RD-3 LOCKED）
Implementation Start: HOLD
```










注: Persistence technical contract は MERGED（PR #99）。ALIGN/IDEM/SAN-VALUE/SAN-1/REPLAY-1/REPO-1 は Accepted。hardening MERGED（PR #102）。logical/replay MERGED（PR #104/#106）。
**Issue `#29` physical definition / mapping alignment は Accepted / MERGED（PR #108）**。`#22B` PR #110 MERGED（62a43d7f…）。次工程は実 SharePoint adapter 別 Gate。SharePoint 実環境操作は NO-GO。
SEV 系（FindingSeverity）の substantive line は DEC-018 不採用で区切り。Canonical は **COMPLETE（Issue #8 / DEC-018）**。ASSIGN / 型 / 実装は自動再開しない。
**Decision-FC-1 = Accepted / Option B**。**Decision-FC-2〜FC-6 = Accepted / Option C**。Finding catalog = DEC-019 EMPTY。値発明禁止。Stale PR #126 は Merge しない。Implementation HOLD。
**DEC-008** は 3 軸分離。制度資格・最終承認者は未決。AI 要約を根拠にしない。
AS-EC-1 は Entry #1〜#8 個別閉鎖／Accepted。**overall = MET / Accepted**。**PR-J domain Implementation Start GO**。FindingCode / A-5 / SharePoint = HOLD。**Decision-AS-SCHEMA-ID-1 Accepted**（naming+value）。**Decision-AS-SCHEMA-VERSION-1 Accepted**（1.0.0）；Schema·DTO code = HOLD。
`#22B` Human GO はコード実装開始のみ。SharePoint 実環境 / M365 / Deploy / Merge は別 GO。
## Phase 4 — 次の安全な純関数単位

```text
Next Handoff domain unit: NONE（候補まで MERGED）
Persistence technical contract: MERGED（PR #99）
Decision-AUD-ALIGN-1 / IDEM-1 / SAN-VALUE-1 / SAN-1 / REPLAY-1 / REPO-1: Accepted
AuditEvent contract hardening: MERGED（PR #102）
Logical AuditEvent persistence boundary: MERGED（PR #104）
Replay logical implementation: MERGED（PR #106）
Issue #29 physical definition / mapping alignment: Accepted
Canonicalization to main: MERGED（PR #108 / aa0e6fba7dd8abf32523c70232001b5ac78cfc1b）
Dependency blocker（#29 mapping）: CLEARED
Concrete Repository Entry Review: PASS（Issue #22 comment 5224544473）
Concrete repository / #22B synthetic: MERGED（PR #110 / 62a43d7fbb5b33f69e0f4adfbba405ab00c1fb81）
Ready: YES（consumed）
Merge: DONE
実 SharePoint adapter / tenant integration: 別 Gate / NO-GO
READY_FOR_HUMAN_GO: YES（consumed; #22B Human GO 5224579776）
#22B Human GO: CONFIRMED（Issue #22 comment 5224579776）
```

判定理由:

1. AUD-RET-1 / AUD-WR-1 / ALIGN-1 / IDEM-1 / SAN-VALUE-1 / SAN-1 / REPLAY-1 / REPO-1 Accepted。技術契約 PR #99 MERGED。hardening PR #102 MERGED。logical/replay PR #104/#106 MERGED
2. `#22B` PR #110 MERGED。次は実 SharePoint adapter 別 Gate（SharePoint 実変更は NO-GO）
3. Decision Accepted / logical/replay MERGED / `#22B` synthetic MERGED ≠ 実 SharePoint adapter GO
4. PR #104 / #106 Human GO は logical / replay で消費済み
5. SharePoint / Microsoft 365 / deploy は NO-GO

正本: [`decision-aud-repo-1-audit-event-repository-uniqueness.md`](./decision-aud-repo-1-audit-event-repository-uniqueness.md)、
[`audit-event-physical-mapping-29.md`](./audit-event-physical-mapping-29.md)

## OUT / 混ぜないもの

- `src/**` / `tests/**` 変更
- 新しい domain 純関数実装（本 docs PR）
- 未承認の業務ルール推測
- AuditLog 保存期間・書込先の推測採択
- FindingSeverity 値の暗黙採択 / ローカル severity taxonomy 発明 / FindingCode 捏造
- 既存許可3辺・完了済み純関数の再オープン改変
- OP-3/RD-3 の制度値を既存メンバシップ/相対判定へ混入
- GOV-RULE-06 を `duration_days = 90` へ変換して正式周期とすること
- 89/90/91 日境界を「3ヶ月に1回程度」practice rule の根拠とすること
- GOV-RULE-08 を GOV-RULE-05/06/07 と一括 Accepted すること
- GOV-RULE-05/06/07 から 90日 / 91日 overdue / 3暦月自動違反を導出すること
- 通知開始を 30日前等の日数へ変換すること
- 通知月に入った = overdue / 通知が出た = 業務違反 とみなすこと
- Snapshot 保存・DTO・SharePoint / SPFx / Schema / M365 / Deploy
- Issue #24 Close
- Decision の一括 Accepted 前提
- AuditEvent `#22B` concrete repository / SharePoint adapter / M365 実変更

## Gate

```text
Decision backlog 整理: READY（docs-only）
PR #99: MERGED
PR #102: MERGED
PR #104: MERGED
PR #106: MERGED
Persistence technical contract: MERGED
Decision-AUD-ALIGN-1: Accepted
Decision-AUD-IDEM-1: Accepted
Decision-AUD-SAN-VALUE-1: Accepted
Decision-AUD-SAN-1: Accepted
Decision-AUD-REPLAY-1: Accepted
Decision-AUD-REPO-1: Accepted
AuditEvent contract hardening: MERGED（PR #102）
Logical AuditEvent persistence boundary: MERGED（PR #104）
Replay logical implementation: MERGED（PR #106）
Issue #29 physical definition / mapping alignment: Accepted
Canonicalization to main: MERGED（PR #108 / aa0e6fba7dd8abf32523c70232001b5ac78cfc1b）
Dependency blocker（#29 mapping）: CLEARED
Concrete Repository Entry Review: PASS（Issue #22 comment 5224544473）
Next: SEV-2-VOCAB Canonical COMPLETE（DEC-018）。FC-1〜FC-6 Accepted。Finding catalog DEC-019 EMPTY Accepted。次は DEC-008 実務中心者 Human Decision（A/B/C・推奨 C）。FC-7 NOT CREATED。実 SharePoint adapter は別 Gate / NO-GO
Concrete repository / #22B synthetic: MERGED（PR #110 / 62a43d7fbb5b33f69e0f4adfbba405ab00c1fb81）
Ready: YES（consumed）
Merge: DONE
実 SharePoint adapter / tenant integration: 別 Gate / NO-GO
READY_FOR_HUMAN_GO: YES（consumed; #22B Human GO 5224579776）
#22B Human GO: CONFIRMED（Issue #22 comment 5224579776）
Decision-SEV-1: Accepted（Option A）
Decision-SEV-2-PURPOSE: RECORDED（MHLW-first）
Decision-SEV-2-CONCEPT-INV: COMPLETED / OFFICIAL_CONCEPT_EXISTS
Decision-SEV-2-VOCAB: Accepted / Option A / FindingSeverity NOT ADOPTED
Decision-SEV-2-VOCAB Canonical: COMPLETE（Issue #8 / DEC-018 / comment 5225426738）
Decision-SEV-2-ASSIGN: N/A / DO NOT START
Decision-FC-1: Accepted / Option B（Issue #8 new DEC / business DEC）/ Implementation HOLD
Decision-FC-2: Accepted / Option C（versioned immutable catalog snapshot input）/ Implementation HOLD
Decision-FC-3: Accepted / Option C（complete logical contract surface）/ Implementation HOLD
Decision-FC-4: Accepted / Option C（complete identifier logical contract）/ Implementation HOLD
Decision-FC-5: Accepted / Option C（split ownership with explicit syntax-validation ceiling）/ Implementation HOLD
Decision-FC-6: Accepted / Option C（complete businessOwnershipRef logical contract）/ Implementation HOLD
FC Decision Exit Review: ACCEPTED（[`fc-decision-exit-review.md`](./fc-decision-exit-review.md) / [`fc-decision-exit-review-acceptance.md`](./fc-decision-exit-review-acceptance.md)）。FC-7 NOT CREATED
A-class structure: ACCEPTED（[`a-class-structure-acceptance.md`](./a-class-structure-acceptance.md)）。Bundle A-1〜A-4 / Separate A-5
Finding catalog DEC-019: Accepted / EMPTY / NOT ADOPTED
DEC-008: **Accepted**（[`decision-dec-008-acceptance.md`](./decision-dec-008-acceptance.md)）
  制度上の作成者 = 実践研修修了者
  独立した最終承認者 = NOT ADOPTED


Decision-RC-1 / GOV-RULE-06: **Accepted**（[`decision-gov-rule-06-review-cadence-acceptance.md`](./decision-gov-rule-06-review-cadence-acceptance.md)）
Decision-RC-2 / GOV-RULE-05: **Accepted**（[`decision-gov-rule-05-review-anchor-acceptance.md`](./decision-gov-rule-05-review-anchor-acceptance.md)）
GOV-RULE-07: **Accepted** / Option C（[`decision-gov-rule-07-notice-acceptance.md`](./decision-gov-rule-07-notice-acceptance.md)）
GOV-RULE-08: **Accepted** / Option A / NOT ADOPTED（[`decision-gov-rule-08-due-overdue-acceptance.md`](./decision-gov-rule-08-due-overdue-acceptance.md)）
ReviewCadence contract: Accepted logical（[`review-cadence-contract.md`](./review-cadence-contract.md)）
ReviewAnchor contract: Accepted logical（[`review-anchor-contract.md`](./review-anchor-contract.md)）
ReviewNotice contract: Accepted logical（[`review-notice-contract.md`](./review-notice-contract.md)）
ReviewDueOverdue contract: Accepted logical（[`review-due-overdue-contract.md`](./review-due-overdue-contract.md) / not_adopted）
3ヶ月 → 90日 conversion: FORBIDDEN
通知月 ≠ overdue / 通知 ≠ 業務違反
FindingCode 作成: DO NOT START
A-5: OUT
Implementation Start: HOLD
Issue #24 Close: NO-GO
SharePoint / Entra ID / Microsoft 365: NO-GO
Deploy: NO-GO
```

## 本 PR（docs-only）の役割

```text
1. Decision-AS-EC-1 overall を MET / Accepted として正本化する
2. Ninth residual Option A を CONSUMED とする（再選定しない）
3. PR-J / FindingCode / A-5 / Implementation Start は HOLD を維持する
4. overall MET ≠ 実装開始であることを明示する
5. Implementation Start は自動選定・自動開始しない
6. src/** / tests/** は変更しない
```





## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** / tests/**: 本 PR では変更しない
```
