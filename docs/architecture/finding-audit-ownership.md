# Finding・監査関連の所有境界

この文書は、Finding、AssessmentSnapshot、Handoff、AuditEvent、訂正・削除に関する
所有IssueとDecision分類の正本入口である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main before this canonicalization: b28bfee5beea9d6eac3f239a88693c949b6e54a3
PR #106 / AuditEvent replay logical: MERGED
PR #104 / AuditEvent logical persistence: MERGED
PR #97 / AuditEvent persistence Entry Criteria: MERGED
PR #96 / Handoff AuditEvent candidate: MERGED
PR #93 / Handoff state mutation: MERGED
PR #91 / Handoff role policy: MERGED
PR #90 / Handoff transition: MERGED
PR #88 / Decision-FLR-1: MERGED
PR #85 / remaining audit post-RSV: MERGED
PR #84 / RuleSetVersion selection: MERGED
PR #72 / PR-H: MERGED
PR #41: MERGED
Issue #27 ownership comment: 5204763504
Issue #24 ownership comment: 5204768249
Issue #17 ownership comment: 5204771950
HANDOFF_STATUS_CHANGED Accepted comment: 5215557663
Issue #24 残責務再監査 / PR-I 選定: docs/architecture/issue-24-remaining-audit-pr-i-selection.md
Issue #24 残責務再監査（RSV後）: docs/architecture/issue-24-remaining-audit-post-rsv.md
Issue #24 Decision backlog: docs/architecture/issue-24-decision-backlog.md
Decision-HO-1（Accepted #17）: docs/architecture/decision-ho-1-handoff-transition-ownership.md
AuditEvent 実保存 Entry Criteria: docs/architecture/audit-event-persistence-entry-criteria.md
Decision-AUD-RET-1（Accepted）: docs/architecture/decision-aud-ret-1-auditlog-retention.md
Decision-AUD-WR-1（Accepted / #22A）: docs/architecture/decision-aud-wr-1-audit-write-ownership.md
Decision-AUD-ALIGN-1（Accepted）: docs/architecture/decision-aud-align-1-audit-event-write-result-alignment.md
Decision-AUD-IDEM-1（Accepted）: docs/architecture/decision-aud-idem-1-audit-event-idempotency.md
Decision-AUD-SAN-VALUE-1（Accepted）: docs/architecture/decision-aud-san-value-1-audit-event-value-safety.md
Decision-AUD-SAN-1（Accepted）: AuditEvent contract hardening MERGED（PR #102）
Decision-AUD-REPLAY-1（Accepted）: docs/architecture/decision-aud-replay-1-audit-event-safe-replay.md
Decision-AUD-REPO-1（Accepted）: docs/architecture/decision-aud-repo-1-audit-event-repository-uniqueness.md
Decision-SEV-1（Accepted / Option A）: docs/architecture/decision-sev-1-finding-severity-vocabulary-ownership.md
Decision-SEV-2-PURPOSE（RECORDED / MHLW-first）: docs/architecture/decision-sev-2-purpose-source.md
Decision-SEV-2-CONCEPT-INV（COMPLETED）: docs/architecture/decision-sev-2-concept-inv.md
Decision-SEV-2-VOCAB（Accepted / Option A / NOT ADOPTED；Canonical COMPLETE / DEC-018）: docs/architecture/decision-sev-2-vocab-not-adopted.md
Decision-SEV-2-VOCAB HOLD（historical）: docs/architecture/decision-sev-2-vocab-hold.md
Decision-SEV-2 packet（ASSIGN は N/A / DO NOT START）: docs/architecture/decision-sev-2-finding-severity-boundary.md
Decision-FC-1（Accepted / Option B / Issue #8 new DEC / Implementation HOLD）: docs/architecture/decision-fc-1-finding-code-catalog-ownership.md
Decision-FC-2（Accepted / Option C / versioned immutable catalog snapshot input / Implementation HOLD）: docs/architecture/decision-fc-2-finding-code-catalog-delivery-boundary.md
Decision-FC-3（Accepted / Option C / complete logical contract surface / Implementation HOLD）: docs/architecture/decision-fc-3-finding-code-catalog-snapshot-logical-contract.md
Decision-FC-4（Accepted / Option C / complete identifier logical contract / Implementation HOLD）: docs/architecture/decision-fc-4-catalog-version-identifier-contract.md
Decision-FC-5（Accepted / Option C / split ownership with explicit syntax-validation ceiling / Implementation HOLD）: docs/architecture/decision-fc-5-catalog-version-identifier-representation-ownership.md
Decision-FC-6（Accepted / Option C / complete businessOwnershipRef logical contract / Implementation HOLD）: docs/architecture/decision-fc-6-business-ownership-ref-logical-contract.md
FC Decision Exit Review（ACCEPTED / FC-7 NOT CREATED）: docs/architecture/fc-decision-exit-review.md
A-class structure acceptance（Bundle A-1〜A-4 / Separate A-5；content は DEC-019 EMPTY / NOT ADOPTED で消費済み）: docs/architecture/a-class-structure-acceptance.md
Implementation Entry Decision Re-audit（post GOV-RULE-05〜08）: docs/architecture/implementation-entry-decision-reaudit.md
FindingCode A-1〜A-4 bundle content Decision packet: docs/architecture/decision-findingcode-a14-bundle-content-decision-packet.md
FindingCode Option C selection: docs/architecture/decision-findingcode-option-c-selection.md
FindingCode Issue #8 DEC body prep（BS-001〜007 PAUSED / Finding ADOPTED = 0）: docs/architecture/findingcode-issue8-dec-body-prep.md
FindingCode Issue #8 DEC body Acceptance packet（EMPTY catalog）: docs/architecture/decision-findingcode-issue8-dec-body-acceptance-packet.md
FindingCode Issue #8 DEC body Acceptance（Accepted / Option A / EMPTY）: docs/architecture/decision-findingcode-issue8-dec-body-acceptance.md
FindingCode A-4 DEC number review（SELECTED / DEC-019）: docs/architecture/decision-findingcode-a4-dec-number-review.md
DEC-008 Acceptance（LOCKED）: docs/architecture/decision-dec-008-acceptance.md
DEC-008 Issue #8 ledger registration（POSTED / comment 5229571943）: docs/architecture/decision-dec-008-issue8-ledger-registration.md
DEC-008 canonicalization consistency check（CONSISTENT / 最終確定）: docs/architecture/decision-dec-008-canonicalization-consistency-check.md
Next substantive unit selection（SELECTED / B / GOV-AUD-03）: docs/architecture/decision-next-substantive-unit-selection.md
GOV-AUD-03 Acceptance（Accepted / Option E / application 対象外）: docs/architecture/decision-gov-aud-03-snapshot-correction-approver-acceptance.md
Next substantive unit selection（SELECTED / C / Decision-OP-3）: docs/architecture/decision-next-substantive-unit-selection.md
Decision-OP-3 Acceptance（Accepted / LOCKED / Option A）: docs/architecture/decision-op-3-observation-period-schema-acceptance.md
Observation period logical Schema contract: docs/architecture/observation-period-schema-contract.md
Decision-OP-3 canonicalization consistency check（FINAL CONSISTENT / PR #146）: docs/architecture/decision-op-3-canonicalization-consistency-check.md
Next substantive unit selection（SELECTED / E / DEC-008 submit-return）: docs/architecture/decision-next-substantive-unit-selection.md
Next substantive unit selection packet（CONSUMED / E）: docs/architecture/decision-next-substantive-unit-selection-packet.md
DEC-008 submit/return roles Acceptance（Accepted / LOCKED / Option C）: docs/architecture/decision-dec-008-submit-return-roles-acceptance.md
DEC-008 submit/return roles Independent Review（PASS / P0=0 / P1=0 / P2=0 / d1b5d544…）: docs/architecture/decision-dec-008-submit-return-roles-independent-review.md
DEC-008 submit/return roles consistency（FINAL CONSISTENT / PR #147）: docs/architecture/decision-dec-008-submit-return-roles-canonicalization-consistency-check.md
DEC-008 submit/return roles open-points（CONSUMED）: docs/architecture/decision-dec-008-submit-return-roles-open-points.md
DEC-008 submit/return roles Decision packet（CONSUMED / Option C）: docs/architecture/decision-dec-008-submit-return-roles-decision-packet.md
GOV-AUD-04 logical-delete role Acceptance（Accepted / LOCKED / Option E）: docs/architecture/decision-gov-aud-04-logical-delete-role-acceptance.md
GOV-AUD-04 canonicalization consistency check（FINAL CONSISTENT / PR #149）: docs/architecture/decision-gov-aud-04-canonicalization-consistency-check.md
GOV-AUD-04 logical-delete role open-points（CONSUMED）: docs/architecture/decision-gov-aud-04-logical-delete-role-open-points.md
GOV-AUD-04 logical-delete role Decision packet（CONSUMED / Option E）: docs/architecture/decision-gov-aud-04-logical-delete-role-decision-packet.md
Next substantive unit selection（SELECTED / F / Decision-ILB-1）: docs/architecture/decision-next-substantive-unit-selection.md
Next substantive unit selection packet（CONSUMED / F）: docs/architecture/decision-next-substantive-unit-selection-packet.md
Decision-ILB-1 Human Policy Acceptance（Accepted / LOCKED / Option A / FINAL CONSISTENT）: docs/architecture/decision-ilb-1-human-policy-acceptance.md
Decision-ILB-1 canonicalization consistency check（FINAL CONSISTENT / PR #151）: docs/architecture/decision-ilb-1-canonicalization-consistency-check.md
Decision-ILB-1 institutional/local boundary packet（CONSUMED / Policy Accepted / FINAL CONSISTENT）: docs/architecture/decision-ilb-1-institutional-local-boundary-decision-packet.md
Decision-ILB-1 residual Decision inventory（read-only / row classifications provisional）: docs/architecture/decision-ilb-1-residual-decision-inventory.md
Decision-ILB-1 next residual Decision selection（SELECTED / C / Decision-RD-3）: docs/architecture/decision-ilb-1-next-residual-decision-selection.md
Decision-ILB-1 next residual Decision selection packet（CONSUMED / C）: docs/architecture/decision-ilb-1-next-residual-decision-selection-packet.md
Decision-RD-3 monitoring guidance Acceptance（Accepted / LOCKED）: docs/architecture/decision-rd-3-monitoring-guidance-acceptance.md
Decision-RD-3 canonicalization consistency check（FINAL CONSISTENT / PR #153 / #154）: docs/architecture/decision-rd-3-canonicalization-consistency-check.md
Decision-RD-3 Independent Review（PASS / P0=0 / P1=0 / P2=0 / PR #153）: docs/architecture/decision-rd-3-independent-review.md
Review monitoring guidance logical contract: docs/architecture/review-monitoring-guidance-contract.md
Decision-ILB-1 second residual Decision selection（SELECTED / A / GOV-AUD-05·DEC-012）: docs/architecture/decision-ilb-1-second-residual-decision-selection.md
Decision-ILB-1 second residual Decision selection packet（CONSUMED / A）: docs/architecture/decision-ilb-1-second-residual-decision-selection-packet.md
GOV-AUD-05 / DEC-012 retention complete-deletion prohibition Acceptance（Accepted / LOCKED / Option A）: docs/architecture/decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md
Retention complete-deletion prohibition logical contract: docs/architecture/retention-complete-deletion-prohibition-contract.md
Decision-ILB-1 third residual Decision selection（SELECTED / A / DEC-009）: docs/architecture/decision-ilb-1-third-residual-decision-selection.md
Decision-ILB-1 third residual Decision selection packet（CONSUMED / A）: docs/architecture/decision-ilb-1-third-residual-decision-selection-packet.md
DEC-009 AssessmentSnapshot save-timing Acceptance（Accepted / LOCKED / Option A）: docs/architecture/decision-dec-009-snapshot-save-timing-acceptance.md
AssessmentSnapshot save-timing logical contract: docs/architecture/assessment-snapshot-save-timing-contract.md
DEC-009 canonicalization consistency check（FINAL CONSISTENT / PR #157）: docs/architecture/decision-dec-009-canonicalization-consistency-check.md
Decision-ILB-1 fourth residual Decision selection（SELECTED / A / AS-EC-1 Entry #8）: docs/architecture/decision-ilb-1-fourth-residual-decision-selection.md
Decision-ILB-1 fourth residual Decision selection packet（CONSUMED / A）: docs/architecture/decision-ilb-1-fourth-residual-decision-selection-packet.md
AS-EC-1 Entry #8 technical plan Acceptance（Accepted / LOCKED / Option A / FINAL CONSISTENT）: docs/architecture/decision-as-ec-1-entry-8-technical-plan-acceptance.md
AssessmentSnapshot complete-contract technical plan: docs/architecture/assessment-snapshot-complete-contract-technical-plan.md
AS-EC-1 Entry #8 canonicalization consistency check（FINAL CONSISTENT / PR #159）: docs/architecture/decision-as-ec-1-entry-8-canonicalization-consistency-check.md
AS-EC-1 Entry #8 Independent Review（PASS / P0=0 / P1=0 / P2=0 / PR #159）: docs/architecture/decision-as-ec-1-entry-8-independent-review.md
AS-EC-1 Entry #8 FINAL CONSISTENT Independent Review（PASS / P0=0 / P1=0 / P2=0 / PR #160）: docs/architecture/decision-as-ec-1-entry-8-final-consistent-independent-review.md
AS-EC-1 Entry #1/#2 read-only consistency audit（#1 PASS / #2 PASS·MET after Option A）: docs/architecture/decision-as-ec-1-entry-1-2-read-only-consistency-audit.md
Decision-ILB-1 fifth residual Decision selection（SELECTED / A / AS-EC-1 Entry #2）: docs/architecture/decision-ilb-1-fifth-residual-decision-selection.md
Decision-ILB-1 fifth residual Decision selection packet（CONSUMED / A）: docs/architecture/decision-ilb-1-fifth-residual-decision-selection-packet.md
AS-EC-1 Entry #2 ownership / PR-boundary Acceptance（Accepted / LOCKED / Option A / PASS·MET）: docs/architecture/decision-as-ec-1-entry-2-ownership-pr-boundary-acceptance.md
AssessmentSnapshot complete-contract PR boundary（PR-J / Issue #24）: docs/architecture/assessment-snapshot-complete-contract-pr-boundary.md
AssessmentSnapshot complete-contract technical contract（PR-J / Implementation Start GO）: docs/architecture/assessment-snapshot-complete-contract.md
AssessmentSnapshot complete-contract Independent Review（PR #168 / PASS）: docs/architecture/assessment-snapshot-complete-contract-independent-review.md
Decision-ILB-1 tenth residual Decision selection（SELECTED / A / Implementation Start GO）: docs/architecture/decision-ilb-1-tenth-residual-decision-selection.md
AS-EC-1 Entry #2 canonicalization consistency check: docs/architecture/decision-as-ec-1-entry-2-canonicalization-consistency-check.md
AS-EC-1 Entry #2 Independent Review（PASS / P0=0 / P1=0 / P2=0）: docs/architecture/decision-as-ec-1-entry-2-independent-review.md
Decision-ILB-1 sixth residual Decision selection（SELECTED / A / AS-EC-1 Entry #5）: docs/architecture/decision-ilb-1-sixth-residual-decision-selection.md
Decision-ILB-1 sixth residual Decision selection packet（CONSUMED / A）: docs/architecture/decision-ilb-1-sixth-residual-decision-selection-packet.md
AS-EC-1 Entry #5 findingIds boundary Acceptance（Accepted / LOCKED / Option A / PASS·MET）: docs/architecture/decision-as-ec-1-entry-5-finding-ids-boundary-acceptance.md
AssessmentSnapshot findingIds boundary（NOT REQUIRED）: docs/architecture/assessment-snapshot-finding-ids-boundary.md
AS-EC-1 Entry #5 canonicalization consistency check（CONSISTENT / #5 PASS·MET）: docs/architecture/decision-as-ec-1-entry-5-canonicalization-consistency-check.md
AS-EC-1 Entry #5 Independent Review（PASS / P0=0 / P1=0 / P2=0）: docs/architecture/decision-as-ec-1-entry-5-independent-review.md
Decision-ILB-1 seventh residual Decision selection（SELECTED / A / AS-EC-1 Entry #6）: docs/architecture/decision-ilb-1-seventh-residual-decision-selection.md
Decision-ILB-1 seventh residual Decision selection packet（CONSUMED / A）: docs/architecture/decision-ilb-1-seventh-residual-decision-selection-packet.md
AS-EC-1 Entry #6 NOT_APPLICABLE reason Acceptance（Accepted / LOCKED / Option A / PASS·MET）: docs/architecture/decision-as-ec-1-entry-6-not-applicable-reason-acceptance.md
AssessmentSnapshot NOT_APPLICABLE reason HOLD policy: docs/architecture/assessment-snapshot-not-applicable-reason-hold.md
AS-EC-1 Entry #6 canonicalization consistency check（CONSISTENT / #6 PASS·MET）: docs/architecture/decision-as-ec-1-entry-6-canonicalization-consistency-check.md
AS-EC-1 Entry #6 Independent Review（PASS / P0=0 / P1=0 / P2=0）: docs/architecture/decision-as-ec-1-entry-6-independent-review.md
Decision-ILB-1 eighth residual Decision selection（SELECTED / A / AS-EC-1 Entry #7）: docs/architecture/decision-ilb-1-eighth-residual-decision-selection.md
Decision-ILB-1 eighth residual Decision selection packet（CONSUMED / A）: docs/architecture/decision-ilb-1-eighth-residual-decision-selection-packet.md
AS-EC-1 Entry #7 Schema / DTO versioning Acceptance（Accepted / LOCKED / Option A / PASS·MET）: docs/architecture/decision-as-ec-1-entry-7-schema-dto-versioning-acceptance.md
AssessmentSnapshot Schema / DTO versioning policy（DEC-1）: docs/architecture/assessment-snapshot-schema-dto-versioning.md
AS-EC-1 Entry #7 canonicalization consistency check（CONSISTENT / #7 PASS·MET）: docs/architecture/decision-as-ec-1-entry-7-canonicalization-consistency-check.md
AS-EC-1 Entry #7 Independent Review（PASS / P0=0 / P1=0 / P2=0）: docs/architecture/decision-as-ec-1-entry-7-independent-review.md
Decision-ILB-1 ninth residual Decision selection（SELECTED / A / AS-EC-1 overall）: docs/architecture/decision-ilb-1-ninth-residual-decision-selection.md
Decision-ILB-1 ninth residual Decision selection packet（CONSUMED / A）: docs/architecture/decision-ilb-1-ninth-residual-decision-selection-packet.md
Decision-AS-EC-1 overall Entry Acceptance（Accepted / LOCKED / MET / Option A）: docs/architecture/decision-as-ec-1-overall-entry-acceptance.md
AS-EC-1 overall canonicalization consistency check（CONSISTENT / overall MET）: docs/architecture/decision-as-ec-1-overall-canonicalization-consistency-check.md
AS-EC-1 overall Independent Review（PASS / P0=0 / P1=0 / P2=0）: docs/architecture/decision-as-ec-1-overall-independent-review.md
Decision-ILB-1 fourteenth residual Decision selection（SELECTED / A / SharePoint·adapter / CONSUMED）: docs/architecture/decision-ilb-1-fourteenth-residual-sharepoint-adapter-selection.md
Decision-AS-SP-ADAPTER-1 Acceptance（Accepted / LOCKED / PB-1+EM-1+CV-1+D6-1+UP-1）: docs/architecture/decision-assessment-snapshot-sp-adapter-acceptance.md
Decision-AS-SP-ADAPTER-1 compare packet（CONSUMED）: docs/architecture/decision-assessment-snapshot-sp-adapter-packet.md
Decision-AS-SP-ADAPTER-1 Independent Review（PR #175 / PASS / P0=0 / P1=0 / P2=0）: docs/architecture/decision-assessment-snapshot-sp-adapter-independent-review.md
DEC-008 support-plan role separation: docs/architecture/decision-dec-008-support-plan-role-separation.md





DEC-008 authoring-center Acceptance: docs/architecture/decision-dec-008-authoring-center-acceptance.md
DEC-008 final-approver Acceptance（NOT ADOPTED）: docs/architecture/decision-dec-008-final-approver-acceptance.md
Issue #29 physical mapping: docs/architecture/audit-event-physical-mapping-29.md
AuditEvent persistence contract（PR #99 MERGED）: docs/architecture/audit-event-persistence-contract.md
Logical persistence boundary（PR #104 MERGED）: src/domain/audit-event-persistence.ts
Replay logical（PR #106 MERGED）: src/domain/audit-event-persistence.ts
Alignment / next gate: docs/architecture/audit-event-persistence-22a-alignment-gate.md
Issue #29 physical definition / mapping alignment: Accepted
Canonicalization to main: MERGED（PR #108 / aa0e6fba7dd8abf32523c70232001b5ac78cfc1b）
Dependency blocker（#29 mapping）: CLEARED
Next: PR #111 の明示的 Merge GO（Ready YES / Merge NOT RUN）。実 SharePoint adapter は別 Gate / NO-GO
```

この文書は所有境界と実装ゲートを固定する。
型、validator、純粋関数、adapter、SharePoint列、業務ロールの実装を行わない。

## 所有Issue対応表

| 対象 | 所有・正本 | 現在状態 | 実装ゲート |
|---|---|---|---|
| `FindingStatus`型 | Issue #27 | PR #41で確定 | 完了 |
| `FindingIdentity` | Issue #27 | PR #41で確定 | 完了 |
| `HandoffState`型 | Issue #27 | PR #41で確定 | 完了 |
| `SnapshotCorrection`構造 | Issue #27 | PR #41で確定 | 完了 |
| `AuditEvent`構造・strict allowlist | Issue #27 | PR #41で確定 | 完了 |
| handoff運用設計・状態グラフ案 | Issue #17 | 案あり。遷移所有は Accepted | 運用正式化の残は HOLD |
| Handoff状態遷移関数 | Issue #17 | Decision-HO-1 Accepted。PR #90 MERGED | 完了 |
| Handoff ロールポリシー | Issue #17 / `GOV-AUD-02` 分離 | PR #91 MERGED | 完了（ロール値の法人最終確定は #19） |
| HandoffState mutation | Issue #17 | PR #93 MERGED | 完了 |
| Handoff AuditEvent candidate | Issue #17 / `5215557663` | PR #96 MERGED。正本 `handoff-audit-event.md` | 候補完了。logical/replay MERGED（PR #104/#106）。`#29` MERGED。`#22B` synthetic MERGED（PR #110 / 62a43d7f…）。実 SharePoint adapter 別 Gate / NO-GO |
| AuditEvent 実保存 | #22A（AUD-WR-1 Accepted） | 技術契約 MERGED（PR #99）。logical MERGED（PR #104）。Replay MERGED（PR #106）。ALIGN/IDEM/SAN-VALUE/SAN-1/REPLAY-1/REPO-1 Accepted。`#29` mapping MERGED（PR #108）。Entry Review PASS（5224544473） | `#22B` MERGED（PR #110 / 62a43d7f…）。synthetic only。SharePoint 実環境 / M365 / Deploy NO-GO |
| Finding lifecycle transition | Issue #24 | C0 `5209785751` / 技術契約 `finding-lifecycle-transition.md` | PR-D完了（PR #64） |
| finding生成条件 | Issue #24 | 技術契約 `finding-generation-conditions.md`（eligibility only） | PR-E完了（PR #65） |
| finding安定ID生成 | Issue #24 | 技術契約 `finding-stable-id.md` / CONDITIONAL GO `5205731811` | PR-C完了（PR #55） |
| FindingCode写像・Identity組立（狭域） | Issue #24 | Decision `5210065336` / Implementation Start `5210078985` / 技術契約 `finding-identity-assembly.md` | PR-F完了（PR #66） |
| finding再発判定 | Issue #24 | Decision `5210206944`（Q1-C/Q2-A/Q3-A/Q4-A） / 技術契約 `finding-recurrence.md` | PR-G完了（PR #67） |
| AssessmentSnapshot Result変換（狭域・永続なし） | Issue #24 | Selection `5210366943` / Decision `5210389077` / Implementation Start `5210392317` / 技術契約 `assessment-snapshot-result-conversion.md` | PR-H完了（PR #72） |
| AssessmentSnapshot候補生成・完全契約 | Issue #24 | Result変換（永続なし）は上記。Entry #1〜#8 個別閉鎖／Accepted。**Decision-AS-EC-1 overall = MET / Accepted**。**PR-J Implementation Start GO**（domain 型 / validator / fixture / contract tests；正本 [`assessment-snapshot-complete-contract.md`](./assessment-snapshot-complete-contract.md)）。Entry #5 findingIds NOT REQUIRED / #6 NOT_APPLICABLE HOLD方針 / #7 DEC-1 versioning（固有 Schema ID 未採番）/ #8 plan FINAL CONSISTENT。SharePoint / DTO / Schema ID / application 保存は未了。訂正承認は GOV-AUD-03 Accepted / Option E（application 対象外） | **FindingCode / A-5 = HOLD**。SharePoint / DTO / Schema ID = DO NOT START。PR-J 字母割当済・domain 実装中 |
| SupportPlan status transition（狭域・ロールなし） | Issue #24 | Accepted `5211039927` / 技術契約 `support-plan-status-transition.md` / 許可5辺 | PR-I完了（PR #73 / #74） |
| 支援計画シート役割（DEC-008） | Issue #8 / DEC-008 | **Accepted / LOCKED / FINAL CONSISTENT**（comment `5229571943` + Option C / PR #147）。制度上の作成者=実践研修修了者 / 独立最終承認者=**NOT ADOPTED** / 提出・差戻し=**NOT ADOPTED（app 非埋め込み）**。正本 [`decision-dec-008-acceptance.md`](./decision-dec-008-acceptance.md) / [`decision-dec-008-submit-return-roles-acceptance.md`](./decision-dec-008-submit-return-roles-acceptance.md) | ロール実装 DO NOT START。最終承認者・提出/差戻し Binding 再導入禁止。role-free 遷移維持 |
| Active計画一意性 | Issue #24 | Accepted `5212085136` / 技術契約 `active-plan-uniqueness.md` | 完了（PR #76 / #78） |
| 観察期間メンバシップ | Issue #24 | OP-1/OP-2 Accepted / 技術契約 `observation-period.md` | 完了（PR #79 / #80）。OP-3 **Accepted / Option A**（[`decision-op-3-observation-period-schema-acceptance.md`](./decision-op-3-observation-period-schema-acceptance.md)）。純関数 UNCHANGED。実装は別 GO |
| 見直し期限 asOf 相対判定 | Issue #24 | RD-1/RD-2 Accepted / 技術契約 `review-due.md` | 完了（PR #81 / #82）。RD-3 **Accepted / LOCKED**（informational only / 90日・hard due NOT ADOPTED）。89/90/91日境界は practice cadence とみなさない |
| 見直しモニタリング時期表示・通知（Decision-RD-3） | Issue #16 / #19（判断）・#24（相対判定分離） | **Accepted / LOCKED**（2026-08-09）。「3か月に1回程度」を目安として表示・通知 / informational only。制度・業務上の見直しは維持（モニタリング不要ではない）。正本 [`decision-rd-3-monitoring-guidance-acceptance.md`](./decision-rd-3-monitoring-guidance-acceptance.md) / [`review-monitoring-guidance-contract.md`](./review-monitoring-guidance-contract.md) / 整合 [`decision-rd-3-canonicalization-consistency-check.md`](./decision-rd-3-canonicalization-consistency-check.md) | 期限超過状態・超過警告・業務制限・90日・hard due NOT ADOPTED。アプリが違反判定で業務を止めない。`evaluateReviewDueRelativeToAsOf` UNCHANGED。Implementation HOLD |
| 見直し周期 practice cadence（GOV-RULE-06） | Issue #16 / #19（判断）・契約 docs | **Accepted**（2026-08-09）。正本 [`decision-gov-rule-06-review-cadence-acceptance.md`](./decision-gov-rule-06-review-cadence-acceptance.md) / [`review-cadence-contract.md`](./review-cadence-contract.md) / source review [`decision-gov-rule-06-review-cadence-source-review.md`](./decision-gov-rule-06-review-cadence-source-review.md) | `duration_days=90` 変換禁止。07/08 Accepted（08 NOT ADOPTED）。Implementation HOLD |
| 見直し周期の基準日（GOV-RULE-05） | Issue #16 / #19（判断）・契約 docs | **Accepted**（2026-08-09）。初回=支援計画有効開始日 / 以降=前回見直し日。正本 [`decision-gov-rule-05-review-anchor-acceptance.md`](./decision-gov-rule-05-review-anchor-acceptance.md) / [`review-anchor-contract.md`](./review-anchor-contract.md) | 物理列は未決。GOV-RULE-08 Accepted / NOT ADOPTED。Implementation HOLD |
| 見直し通知開始（GOV-RULE-07） | Issue #16 / #19（判断）・契約 docs | **Accepted**（2026-08-09）/ Option C。対象暦月に入ったら通知 / precision = approximate。正本 [`decision-gov-rule-07-notice-acceptance.md`](./decision-gov-rule-07-notice-acceptance.md) / [`review-notice-contract.md`](./review-notice-contract.md) | 日数変換禁止。通知 ≠ overdue / 違反。Implementation HOLD |
| 見直し due / overdue（GOV-RULE-08） | Issue #16 / #19（判断）・契約 docs | **Accepted**（2026-08-09）/ Option A / **NOT ADOPTED**。正本 [`decision-gov-rule-08-due-overdue-acceptance.md`](./decision-gov-rule-08-due-overdue-acceptance.md) / [`review-due-overdue-contract.md`](./review-due-overdue-contract.md) | hard due/overdue 実装 DO NOT START。通知は informational。`evaluateReviewDueRelativeToAsOf` UNCHANGED。Implementation HOLD |
| RuleSetVersion選択 | Issue #24 | RSV-1〜4 Accepted / 技術契約 `ruleset-version-selection.md` | 完了（PR #83 / #84） |
| 訂正・削除・監査ログ・復旧の運用設計 | Issue #17 | 設計案あり | `GOV-AUD`回答待ち |
| `GOV-AUD-01〜10`回答 | Issue #19 | 回答正本 | **track SELECTED**（[`decision-issue-19-residual-governance-selection.md`](./decision-issue-19-residual-governance-selection.md)）。**01 = Accepted / Option C + identity fill-in LOCKED**（[`decision-gov-aud-01-handoff-canonical-source-option-c-acceptance.md`](./decision-gov-aud-01-handoff-canonical-source-option-c-acceptance.md) / [`decision-gov-aud-01-identity-fill-in-acceptance.md`](./decision-gov-aud-01-identity-fill-in-acceptance.md)）。02 / 03 / 04 / 05(retention) / 06 = Accepted。**07 = Accepted / Option A**（[`decision-gov-aud-07-backup-restore-owner-option-a-acceptance.md`](./decision-gov-aud-07-backup-restore-owner-option-a-acceptance.md)；DEC-015 NOT ACCEPTED）。**current residual = GOV-AUD-08 unit SELECTED**（[`decision-gov-aud-08-post-recovery-confirmer-selection.md`](./decision-gov-aud-08-post-recovery-confirmer-selection.md)；Option NOT SELECTED）。09〜10 / post-retention deletion = OPEN |
| DEC正本台帳 | Issue #8 | `DEC-001〜018` + Finding catalog **DEC-019**（EMPTY / NOT ADOPTED；A-4 Selected）。FindingSeverity 不採用は **DEC-018**（comment `5225426738`）。**DEC-008 Accepted**（comment `5229571943`）：制度上の作成者=実践研修修了者 / 独立最終承認者 NOT ADOPTED。VOCAB Canonical COMPLETE。FindingCode catalog ownership は Decision-FC-1 Accepted（Option B）。delivery は Decision-FC-2 Accepted（Option C）。FC-3〜FC-6 Accepted / Option C。PURPOSE は MHLW-first RECORDED |
| 許可フィールド値のサニタイズ | Issue #22または新規audit-write-boundary / Decision-AUD-SAN-VALUE-1 | 値契約 Accepted（[`decision-aud-san-value-1-audit-event-value-safety.md`](./decision-aud-san-value-1-audit-event-value-safety.md)）。`validateAuditEvent` hardening MERGED（PR #102） | Decision-AUD-SAN-1 Accepted。Replay logical MERGED（PR #106）。`#22B` synthetic MERGED（PR #110）。実 SharePoint adapter / tenant integration は別 Gate / NO-GO |

## Decision分類

### 技術設計としてdocs-onlyで先行できる事項

- AssessmentSnapshotの永続Resultを`EvaluationDecision`と同一にするか、別enumとするか
- Result変換責任をdomain純粋関数、application、adapterのどこに置くか
- `SOURCE_UNAVAILABLE`、`INDETERMINATE`、`NOT_APPLICABLE`の永続可否
- Resultごとの`reasonCodes`必須条件
- `demo`と`retrieval_failed`を正式Resultへ含めない理由と拒否境界
- `SnapshotCorrection`とResult訂正の関係

これらは保存タイミングや実行ロールを決めない。

### 法人・運用Decisionを必要とする事項

| Decision | 内容 | 正本 |
|---|---|---|
| `DEC-009` | AssessmentSnapshotの保存タイミング | Issue #8 / Issue #19（**Accepted / LOCKED / Option A / FINAL CONSISTENT** — 下書き / 確定時保存 / 元確定保持＋新版 / 上書き NOT ADOPTED / 履歴保持。正本 [`decision-dec-009-snapshot-save-timing-acceptance.md`](./decision-dec-009-snapshot-save-timing-acceptance.md) / [`assessment-snapshot-save-timing-contract.md`](./assessment-snapshot-save-timing-contract.md) / 整合 [`decision-dec-009-canonicalization-consistency-check.md`](./decision-dec-009-canonicalization-consistency-check.md)） |
| `GOV-AUD-01` | handoffの正本 | Issue #19（**Accepted / LOCKED / Option C** — 会議・議事録側が業務正本 / アプリは参照 ID + 状態。identity: 支援計画アセスメント会議・支援計画モニタリング会議 / `会議種別 + 開催日 + 利用者ID`。正本 [`decision-gov-aud-01-handoff-canonical-source-option-c-acceptance.md`](./decision-gov-aud-01-handoff-canonical-source-option-c-acceptance.md) / identity [`decision-gov-aud-01-identity-fill-in-acceptance.md`](./decision-gov-aud-01-identity-fill-in-acceptance.md)） |
| `GOV-AUD-02` | handoff状態変更ロール | Issue #19（**Accepted** — comment `5215209914` / [`handoff-transition-role-policy.md`](./handoff-transition-role-policy.md)） |
| `GOV-AUD-03` | Snapshot訂正承認者 | Issue #19（**Accepted / Option E** — application 対象外 / ロール NOT DEFINED。正本 [`decision-gov-aud-03-snapshot-correction-approver-acceptance.md`](./decision-gov-aud-03-snapshot-correction-approver-acceptance.md)） |
| `GOV-AUD-04` | 論理削除を許可するロール | Issue #19（**Accepted / Option E / FINAL CONSISTENT** — application 対象外 / ロール NOT DEFINED。PR #149 MERGED。正本 [`decision-gov-aud-04-logical-delete-role-acceptance.md`](./decision-gov-aud-04-logical-delete-role-acceptance.md) / 整合 [`decision-gov-aud-04-canonicalization-consistency-check.md`](./decision-gov-aud-04-canonicalization-consistency-check.md)） |
| `GOV-AUD-05` | 物理削除方針 | Issue #19（**Accepted / LOCKED / Option A** — 法定保存期間中の完全削除禁止 / 5年。自動物理削除 NOT ADOPTED。経過後の可否は別 Decision。正本 [`decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md`](./decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md)） |
| `GOV-AUD-06` / `DEC-011` | AuditLog・業務データの保存期間 | Issue #19 / Issue #8（Decision-AUD-RET-1 **Accepted**） |
| `DEC-012` | 論理削除データの完全削除方針 | Issue #8（**Accepted / LOCKED / Option A** — GOV-AUD-05 と同一 Acceptance で保存期間中禁止。経過後は別 Decision。正本同上） |
| `GOV-AUD-07` | バックアップ・復元の一次責任者 | Issue #19（**Accepted / LOCKED / Option A** — Microsoft 365管理者。正本 [`decision-gov-aud-07-backup-restore-owner-option-a-acceptance.md`](./decision-gov-aud-07-backup-restore-owner-option-a-acceptance.md) / packet [`decision-gov-aud-07-backup-restore-owner-decision-packet.md`](./decision-gov-aud-07-backup-restore-owner-decision-packet.md)。手順/実装/GOV-AUD-08+ は別。DEC-015 自動 Accepted しない） |
| `GOV-AUD-08` | 復旧後の業務確認者 | Issue #19（**unit SELECTED** / Option NOT SELECTED。正本 [`decision-gov-aud-08-post-recovery-confirmer-selection.md`](./decision-gov-aud-08-post-recovery-confirmer-selection.md) / packet [`decision-gov-aud-08-post-recovery-confirmer-decision-packet.md`](./decision-gov-aud-08-post-recovery-confirmer-decision-packet.md)。09/10 同時 SELECT しない） |
| `DEC-015` | バックアップ・復元責任者 | Issue #8（整合要；GOV-AUD-07 Option A Accepted でも自動 Accepted しない / 別 sync） |

保存期間中の完全削除禁止は Accepted（GOV-AUD-05 / DEC-012）。経過後の削除可否・自動削除・cleanup 実装は別 Decision / HOLD。
DEC-009 保存タイミングは Accepted / LOCKED（Option A）。AS-EC-1 Entry #8 技術計画は FINAL CONSISTENT。AS-EC-1 Entry #2 は PASS / MET（PR-J 境界）。**AS-EC-1 overall = MET / Accepted**。**PR-J Implementation Start GO**（domain；[`assessment-snapshot-complete-contract.md`](./assessment-snapshot-complete-contract.md)）。固有 Snapshot Schema ID 未採番・SharePoint / DTO / application 保存実装は HOLD。
具体ロール Binding や物理削除手順をコードへ埋め込まない（Implementation HOLD）。

### 所有が未確定の事項

#### Finding lifecycle transition

```text
Open
Confirmed
InProgress
Resolved
```

`FindingStatus`型はIssue #27で確定した。
遷移純粋関数の所有者は **Issue #24**（C0 comment `5209785751`）。
技術契約: [`finding-lifecycle-transition.md`](./finding-lifecycle-transition.md)。
許可辺は Open→Confirmed→InProgress→Resolved の 3 辺のみ。Resolved 終端。
再オープンは **Decision-FLR-1 Accepted**（不許可・実装 NONE）。
正本: [`decision-flr-1-finding-reopen-policy.md`](./decision-flr-1-finding-reopen-policy.md)。
Severity、完全Finding、再発、Snapshot、Handoff は対象外。

#### Handoff状態遷移関数

```text
not_required
pending
included
acknowledged
closed
```

状態型はIssue #27、所有は **Issue #17**（Decision-HO-1 Accepted）。
正本: [`decision-ho-1-handoff-transition-ownership.md`](./decision-ho-1-handoff-transition-ownership.md)。
純粋遷移と`GOV-AUD-02`に依存する権限判定を分離する（ロールポリシー PR #91 MERGED）。
AuditEvent 候補は PR #96 MERGED。実保存技術契約は PR #99 MERGED。
logical persistence boundary は PR #104 MERGED。Replay logical は PR #106 MERGED。
Decision-AUD-REPLAY-1 / Decision-AUD-REPO-1 Accepted。
次工程: 実 SharePoint adapter / tenant integration の別 Gate
（`#29` mapping / `#22B` synthetic は MERGED。SharePoint 実環境 / tenant / M365 / Deploy は NO-GO。
 [`audit-event-physical-mapping-29.md`](./audit-event-physical-mapping-29.md) /
 [`audit-event-persistence-22a-alignment-gate.md`](./audit-event-persistence-22a-alignment-gate.md)）。

## FindingSeverity Decision

```text
Decision-SEV-1: Accepted
Selected: Option A
Canonical ownership / change control: Issue #8 に新しい DEC を追加する方式
Contract break: NO
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
正本: decision-sev-1-finding-severity-vocabulary-ownership.md
```

Severity 値正本は無い（FindingSeverity 不採用）。不採用 Decision の最終 canonical は **Issue #8 / DEC-018**（comment `5225426738`）。
repository docs は Accepted 正本 mirror（Decision-SEV-1 Option A）。

```text
Decision-SEV-2 packet: OPEN（単位別）
SEV-2-PURPOSE: RECORDED（MHLW-first / decision-sev-2-purpose-source.md）
SEV-2-CONCEPT-INV: COMPLETED / OFFICIAL_CONCEPT_EXISTS（decision-sev-2-concept-inv.md）
  Official concept: 行動関連項目合計点数
  Generic severity taxonomy: NOT FOUND
SEV-2-VOCAB Human Decision: Accepted / Option A / FindingSeverity NOT ADOPTED
SEV-2-VOCAB Canonical: COMPLETE（Issue #8 / DEC-018）
  Accepted 正本 mirror: decision-sev-2-vocab-not-adopted.md
  Issue #8 non-adoption DEC: DEC-018（comment 5225426738）
SEV-2-ASSIGN: N/A / DO NOT START
Implementation: NOT STARTED
正本: decision-sev-2-finding-severity-boundary.md
```

方式 Accepted 後も、値一覧の暗黙採択は禁止する。
`low`、`medium`、`high`等を暗黙の正本として使用しない。
ローカル発明の severity taxonomy は FORBIDDEN。
CONCEPT-INV により公式概念は **行動関連項目合計点数**（閾値 10 / 18 は Severity enum ではない）。
汎用 FindingSeverity taxonomy は **NOT FOUND**。
FindingSeverity Human Decision は **NOT ADOPTED**（SEV-2-VOCAB Option A）。
Canonical は **COMPLETE（Issue #8 / DEC-018）**。
FindingSeverity = "10+" / "18+" 直写は採択しない。
代替概念（合計点 / predicates / scheme / RuleSetVersion）は方向のみ。型・実装は別 Entry Criteria（次 unit 未選定）。

## AssessmentSnapshotの分離境界

AssessmentSnapshotは、技術設計と法人運用Decisionを分離する。

### 技術設計

- Result enum
- `EvaluationDecision`からの変換
- 保存可能Result
- `reasonCodes`必須条件
- `demo`・`retrieval_failed`の拒否境界
- `SnapshotCorrection`との関係

### 法人運用Decision

- いつ保存するか
- 誰が保存・確定するか
- 誰が訂正を承認するか
- いつhandoffへ渡すか

技術設計はdocs-onlyで先行できる。
TypeScript型、validator、fixture、保存実装はDecisionとEntry Criteriaの確定までHOLDする。

## AuditEvent境界

Issue #27で完了した範囲は次である。

- 構造
- result値
- strict allowlist
- 禁止フィールド名と未知キーの拒否
- 基本的なruntime validation

値安全性 / sanitization 境界は完了扱い:

- Decision-AUD-SAN-VALUE-1: Accepted
- Decision-AUD-SAN-1: Accepted
- AuditEvent contract hardening: MERGED（PR #102）

Persistence 境界の現状:

- Persistence Entry Criteria: MET
- Persistence Entry Review: PASS
- Logical persistence boundary: MERGED（PR #104）
- Decision-AUD-REPLAY-1: Accepted
- Replay logical implementation: MERGED（PR #106）
- Decision-AUD-REPO-1: Accepted
- Issue #29 physical mapping: Accepted / MERGED（PR #108）
- Concrete Repository Entry Review: PASS（Issue #22 comment 5224544473）
- Concrete repository / #22B synthetic: MERGED（PR #110 / 62a43d7fbb5b33f69e0f4adfbba405ab00c1fb81）
- Ready: YES（consumed） / Merge: DONE
- 実 SharePoint adapter / tenant integration: 別 Gate / NO-GO
- READY_FOR_HUMAN_GO: YES（consumed; #22B Human GO 5224579776）
#22B Human GO: CONFIRMED（Issue #22 comment 5224579776）
- SharePoint adapter: NO-GO

なお完了扱いにしないもの:

- `actionCode`最終enum（`HANDOFF_STATUS_CHANGED` は Issue #17 / `5215557663` で Accepted。全体 enum は未了）
- AuditLog保存期間の cleanup / 物理削除運用（Decision-AUD-RET-1 Accepted。cleanup は別）
- SharePoint 実環境への書込み（実 tenant adapter / List 変更は NO-GO。`#22B` synthetic は別）

正本: [`decision-aud-san-value-1-audit-event-value-safety.md`](./decision-aud-san-value-1-audit-event-value-safety.md)、
[`decision-aud-replay-1-audit-event-safe-replay.md`](./decision-aud-replay-1-audit-event-safe-replay.md)、
[`audit-event-persistence-entry-criteria.md`](./audit-event-persistence-entry-criteria.md)。

## 後続PR境界

```text
PR-A:
所有境界・Decision分類（本書とfoundation）

PR-B:
AssessmentSnapshot Result技術設計（docs-only）

PR-C:
Issue #24 Finding安定ID（`docs/architecture/finding-stable-id.md`）

PR-D:
Issue #24 Finding lifecycle transition（`docs/architecture/finding-lifecycle-transition.md`）

PR-E:
Issue #24 finding 生成条件（`docs/architecture/finding-generation-conditions.md`）

PR-F:
Issue #24 FindingCode写像・Identity組立（狭域）（`docs/architecture/finding-identity-assembly.md`）

PR-G:
Issue #24 finding再発判定（`docs/architecture/finding-recurrence.md`）

PR-H:
Issue #24 AssessmentSnapshot Result変換（狭域・永続なし）（`docs/architecture/assessment-snapshot-result-conversion.md`）— 完了（PR #72）

PR-I（選定・Decision Accepted・Implementation GO）:
SupportPlan status transition（狭域・ロールなし・allow/deny only）。
選定正本: [`issue-24-remaining-audit-pr-i-selection.md`](./issue-24-remaining-audit-pr-i-selection.md)。
Decision: Accepted comment `5211039927`（ownership=#24 / 許可5辺）。
技術契約: [`support-plan-status-transition.md`](./support-plan-status-transition.md)。
Role / Active一意 / 観察・見直し / RuleSetVersion / SharePoint / UI / repository永続化 は OUT OF SCOPE。
選定ゲート: PR #73（docs-only）。実装: PR #74（domain 純関数 + contract tests）。
PR #73 を実装 PR へ変質させない。

PR-J（Entry #2 Accepted / LOCKED / PASS·MET — 実装 GO）:
AssessmentSnapshot 完全契約実装の専用独立 PR 単位。
所有 Issue: #24。
正本: [`assessment-snapshot-complete-contract-pr-boundary.md`](./assessment-snapshot-complete-contract-pr-boundary.md) /
[`assessment-snapshot-complete-contract.md`](./assessment-snapshot-complete-contract.md) /
[`decision-ilb-1-tenth-residual-decision-selection.md`](./decision-ilb-1-tenth-residual-decision-selection.md)。
Implementation Start: GO（domain 型 / validator / fixture / contract tests）。
SharePoint / DTO / Schema ID / FindingCode / A-5: DO NOT START / HOLD。
他実装単位と混在させない。

PR-I以降（支援計画系純粋ルール・完了）:
Active一意性（#76/#78）、観察期間（#79/#80）、見直し期限（#81/#82）、
RuleSetVersion選択（#83/#84）。再監査: [`issue-24-remaining-audit-post-rsv.md`](./issue-24-remaining-audit-post-rsv.md)。

PR-I以降（Handoff・完了）:
Decision-HO-1 Accepted（#17）、遷移 PR #90、ロール PR #91、mutation PR #93、
AuditEvent candidate PR #96（`HANDOFF_STATUS_CHANGED` / `5215557663`）。
実保存技術契約 MERGED（PR #99）。logical persistence boundary MERGED（PR #104）。
Replay logical MERGED（PR #106）。ALIGN/IDEM/SAN-VALUE/SAN-1/REPLAY-1/REPO-1 Accepted。
次は PR #111 の明示的 Merge GO（Independent Re-review PASS 4888290222 / Ready YES）。実 SharePoint adapter は別 Gate / NO-GO
（[`audit-event-physical-mapping-29.md`](./audit-event-physical-mapping-29.md) /
 [`audit-event-persistence-22a-alignment-gate.md`](./audit-event-persistence-22a-alignment-gate.md)）。

PR-I以降（未割当・HOLD）:
Decision-SEV-2-ASSIGN（N/A）、完全Finding、
AssessmentSnapshot SharePoint / DTO / Schema ID / application 保存（**PR-J domain GO 済**；永続は別）、
FindingCode 値一覧 / identifier 物理方式、
Decision-OP-3 / Decision-RD-3。
Decision-SEV-1（FindingSeverity ownership）は Accepted（Option A / Issue #8 新 DEC）。
Decision-SEV-2-PURPOSE は RECORDED（MHLW-first）。
Decision-SEV-2-CONCEPT-INV は COMPLETED（行動関連項目合計点数。汎用 Severity NOT FOUND）。
Decision-SEV-2-VOCAB は Accepted / Option A（FindingSeverity NOT ADOPTED）。
Decision-SEV-2-VOCAB Canonical は COMPLETE（Issue #8 / DEC-018 / comment 5225426738）。
Decision-SEV-2-ASSIGN は N/A / DO NOT START。
Decision-FC-1 は Accepted / Option B（Issue #8 new DEC / business DEC）。Implementation HOLD。
Decision-FC-2 は Accepted / Option C（versioned immutable catalog snapshot input）。Implementation HOLD。
Decision-FC-3 は Accepted / Option C（complete logical contract surface）。Implementation HOLD。
Decision-FC-4 は Accepted / Option C（complete identifier logical contract）。Implementation HOLD。
Decision-FC-5 は Accepted / Option C（split ownership with explicit syntax-validation ceiling）。Implementation HOLD。
Decision-FC-6 は Accepted / Option C（complete businessOwnershipRef logical contract）。Implementation HOLD。
Decision-FLR-1（Finding 再オープン）は Accepted（不許可・実装 NONE）。
AUD-RET-1 / AUD-WR-1 / value safety / hardening / REPLAY-1 / REPO-1 Decision は Accepted（DONE）。
Replay logical は MERGED（PR #106）。
`#22B` synthetic MERGED（PR #110 / 62a43d7f…）。SharePoint 実環境 / M365 / Deploy は継続 NO-GO（別 Gate）。
正本: [`decision-sev-1-finding-severity-vocabulary-ownership.md`](./decision-sev-1-finding-severity-vocabulary-ownership.md)、
[`decision-sev-2-purpose-source.md`](./decision-sev-2-purpose-source.md)、
[`decision-sev-2-vocab-hold.md`](./decision-sev-2-vocab-hold.md)、
[`decision-sev-2-finding-severity-boundary.md`](./decision-sev-2-finding-severity-boundary.md)、
[`decision-flr-1-finding-reopen-policy.md`](./decision-flr-1-finding-reopen-policy.md)。
残 Decision 分類正本: [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
（Issue #24 系 Next pure unit は別。SEV Implementation NOT STARTED）
```

注: AssessmentSnapshot 完全契約の Entry Criteria 文書上の古い「PR-G」表記は廃止。
完全契約実装の字母は **PR-J**（[`assessment-snapshot-complete-contract-pr-boundary.md`](./assessment-snapshot-complete-contract-pr-boundary.md)）。
GitHub PR # は Implementation GO 時に採番する。

PR-BはPR-Aマージ後を推奨する。
PR-C以降は、それぞれの所有Issue、Decision、Entry Criteriaを記録してから開始する。
PR-I候補の支援計画遷移は、Issue #24所有表への自動割当を行わず Decision を待つ。

## 継続HOLD

- FindingSeverity は SEV-2-VOCAB **Accepted / Option A / NOT ADOPTED**。Canonical は **COMPLETE（Issue #8 / DEC-018 / comment 5225426738）**。purpose source は SEV-2-PURPOSE RECORDED（MHLW-first）。CONCEPT-INV は COMPLETED。assignment 境界（SEV-2-ASSIGN）は **N/A / DO NOT START**。ownership は Decision-SEV-1 Accepted。完全なFinding契約
- FindingCode 業務カタログ ownership は Decision-FC-1 **Accepted / Option B**（Issue #8 new DEC / business DEC）。delivery は Decision-FC-2 **Accepted / Option C**。snapshot logical contract は Decision-FC-3 **Accepted / Option C**。catalog version identifier は Decision-FC-4 **Accepted / Option C**。representation ownership は Decision-FC-5 **Accepted / Option C**。businessOwnershipRef は Decision-FC-6 **Accepted / Option C**。値一覧・UUID/hash/semver・schema / storage / provider・実装は開始しない（[`decision-fc-1-finding-code-catalog-ownership.md`](./decision-fc-1-finding-code-catalog-ownership.md)、[`decision-fc-2-finding-code-catalog-delivery-boundary.md`](./decision-fc-2-finding-code-catalog-delivery-boundary.md)、[`decision-fc-3-finding-code-catalog-snapshot-logical-contract.md`](./decision-fc-3-finding-code-catalog-snapshot-logical-contract.md)、[`decision-fc-4-catalog-version-identifier-contract.md`](./decision-fc-4-catalog-version-identifier-contract.md)、[`decision-fc-5-catalog-version-identifier-representation-ownership.md`](./decision-fc-5-catalog-version-identifier-representation-ownership.md)、[`decision-fc-6-business-ownership-ref-logical-contract.md`](./decision-fc-6-business-ownership-ref-logical-contract.md)）
- AssessmentSnapshot完全契約と保存運用（Result変換・永続なしは `assessment-snapshot-result-conversion.md`）
- finding再発の複数prior探索・永続照会（単一 prior 受け取り判定は `finding-recurrence.md`）
- Decision-OP-3（観察期間フィールド追加） / Decision-RD-3（接近窓ポリシー）
- handoff実行ロールの法人最終確定（`GOV-AUD-02` / #19。ポリシー純関数は PR #91 MERGED）
- 訂正承認、論理削除、物理削除
- `AuditEvent.actionCode`最終enum（`HANDOFF_STATUS_CHANGED` は Accepted）
- AuditLog cleanup / 物理削除運用（Decision-AUD-RET-1 **Accepted**。cleanup は別）
- Issue `#29` physical definition / mapping alignment（docs-only。実変更 NO-GO）
- Concrete repository / #22B synthetic: MERGED（PR #110 / 62a43d7fbb5b33f69e0f4adfbba405ab00c1fb81）
実 SharePoint adapter / tenant integration: 別 Gate / NO-GO（`#29` + Entry PASS + 別 human GO 後）
- SharePoint adapter / Entra ID / Microsoft 365 / deploy: NO-GO

DONE（継続HOLDから外す）:

- Decision-AUD-SAN-VALUE-1 / Decision-AUD-SAN-1（値サニタイズ）
- AuditEvent contract hardening（PR #102）
- Persistence Entry Criteria / Persistence Entry Review
- Logical AuditEvent persistence boundary（PR #104）
- Decision-AUD-REPLAY-1 / Replay logical implementation（PR #106）
- Decision-AUD-REPO-1（意味契約 Accepted。物理 `#29` / `#22B` は別）

Decision-HO-1（Handoff 遷移所有）は Accepted（#17）。
Decision-FLR-1（Finding 再オープン）は Accepted（不許可・実装 NONE）。
Decision-AUD-RET-1 / AUD-WR-1 / ALIGN-1 / IDEM-1 / SAN-VALUE-1 / SAN-1 / REPLAY-1 / REPO-1 は Accepted。
正本: [`decision-ho-1-handoff-transition-ownership.md`](./decision-ho-1-handoff-transition-ownership.md)、
[`decision-flr-1-finding-reopen-policy.md`](./decision-flr-1-finding-reopen-policy.md)、
[`decision-aud-ret-1-auditlog-retention.md`](./decision-aud-ret-1-auditlog-retention.md)、
[`decision-aud-wr-1-audit-write-ownership.md`](./decision-aud-wr-1-audit-write-ownership.md)、
[`decision-aud-replay-1-audit-event-safe-replay.md`](./decision-aud-replay-1-audit-event-safe-replay.md)、
[`decision-aud-repo-1-audit-event-repository-uniqueness.md`](./decision-aud-repo-1-audit-event-repository-uniqueness.md)、
[`audit-event-physical-mapping-29.md`](./audit-event-physical-mapping-29.md)。

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
```
