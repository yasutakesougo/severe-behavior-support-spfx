# Decision-ILB-1 — 残存 Decision read-only 棚卸し

この文書は、**Decision-ILB-1** のための
残存 substantive Decision 候補の **read-only 棚卸し** である。

分類（A〜E）は **provisional** であり、Accepted ではない。
既存 Accepted Decision は再 Decision しない。
制度根拠が確認できない事項は **NOT CONFIRMED** として停止する。

Decision packet: [`decision-ilb-1-institutional-local-boundary-decision-packet.md`](./decision-ilb-1-institutional-local-boundary-decision-packet.md)

```text
Status: READ-ONLY INVENTORY / ROW CLASSIFICATIONS NOT ACCEPTED
Human Policy 1–6: ACCEPTED / FINAL CONSISTENT（decision-ilb-1-human-policy-acceptance.md）
  → 分類・判断の正本方針のみ Accepted
  → 本表の provisional 行は自動 Accepted しない
Consistency: decision-ilb-1-canonicalization-consistency-check.md
main baseline: e2bd25667b23274270755bbd42866e73c501f09d
PR #151: MERGED（e2bd256… / head 4f5a833…）
First residual Decision: SELECTED / C — Decision-RD-3（Accepted / LOCKED）
Fourth residual Decision: SELECTED / A — AS-EC-1 Entry #8（Accepted / LOCKED / FINAL CONSISTENT）
Fifth residual Decision: SELECTED / A — AS-EC-1 Entry #2（Accepted / LOCKED / PASS·MET / PR-J）
Sixth residual Decision: SELECTED / A — AS-EC-1 Entry #5（Accepted / LOCKED / PASS·MET / findingIds NOT REQUIRED）
Seventh residual Decision: SELECTED / A — AS-EC-1 Entry #6（Accepted / LOCKED / PASS·MET / NOT_APPLICABLE HOLD方針）
Eighth residual Decision: SELECTED / A — AS-EC-1 Entry #7（Accepted / LOCKED / PASS·MET / DEC-1 versioning）
Ninth residual Decision: SELECTED / A — Decision-AS-EC-1 overall（MET / Accepted / LOCKED）
Tenth residual Decision: SELECTED / A — Implementation Start（PR-J domain GO after Preflight C→A）
Eleventh residual Decision: SELECTED / C — Schema ID（Decision-AS-SCHEMA-ID-1 naming+value Accepted / LOCKED）
Twelfth residual Decision: SELECTED / A — schemaVersion / dtoVersion（Decision-AS-SCHEMA-VERSION-1 Accepted / LOCKED / 1.0.0）
Thirteenth residual Decision: SELECTED / A — application save（Decision-AS-APP-SAVE-1 Accepted / LOCKED / SC-1 + FR-1）
Fourteenth residual Decision: SELECTED / A — SharePoint / adapter（Decision-AS-SP-ADAPTER-1 Accepted / LOCKED / PB-1+EM-1+CV-1+D6-1+UP-1；IR PASS）
Fifteenth residual Decision: SELECTED / A — DEC-6 concrete mapping（Decision-AS-DEC6-MAPPING-1 Accepted / LOCKED / LF-1+RW-1+MF-1+VR-1）
Sixteenth residual Decision: SELECTED / A — Site / List / Internal Column Name（Decision-AS-SP-PLACEMENT-1 Accepted / LOCKED / SV-1+LV-1+CN-1+SC-1）
Seventeenth residual Decision: SELECTED / A — Tenant confirmation GO（Decision-AS-TENANT-CONFIRM-1 Accepted / LOCKED / RO-1+EV-1+RB-1+XG-1）
Eighteenth residual Decision: SELECTED — Tenant confirmation execution authorization（Decision-AS-TENANT-CONFIRM-EXEC-1 Accepted / LOCKED / ES-1+TB-1+EO-1+FG-1）
Nineteenth residual Decision: SELECTED / CONSUMED — New SPFx deployment target reuse（Decision-AS-TARGET-REUSE-1 Accepted / LOCKED / B）
Twentieth residual Decision: SELECTED / CONSUMED — New SPFx target provisioning（Decision-AS-NEW-TARGET-PROVISION-1 Accepted / LOCKED / ST-1+LT-1+NM-1+EX-1）
Twenty-first residual Decision: SELECTED / CONSUMED — New SPFx Site / List naming（Decision-AS-NEW-TARGET-NAMES-1 Accepted / LOCKED / SU-1+LN-1+IN-1+XB-1；intended values HUMAN-PROVIDED / PLACEHOLDER）
Twenty-third residual Decision: SELECTED / CONSUMED — Multi-facility org site topology（Decision-AS-ORG-SITE-TOPOLOGY-1 Accepted / LOCKED / OT-1+FS-1+SP-1+PP-1+PH-1+XB-1）
Twenty-fourth residual Decision: SELECTED / CONSUMED — Pilot facility identity / Site naming（Decision-AS-PILOT-FACILITY-IDENTITY-1 Accepted / LOCKED / PO-1+FK-1+SN-1+LN-D+XB-1；List names DEFERRED）
Twenty-fifth residual Decision: SELECTED / CONSUMED — Pilot List ownership / 正本責務（Decision-AS-PILOT-LIST-OWNERSHIP-1 Accepted / LOCKED / LO-1+VP-1+EX-1+NB-1+XB-1）
Twenty-sixth residual Decision: SELECTED / CONSUMED — Pilot List names（Decision-AS-PILOT-LIST-NAMES-1 Accepted / LOCKED / LN-1+XB-1；SupportPlans / AssessmentSnapshots）
Twenty-seventh residual Decision: SELECTED / CONSUMED — Pilot Site/List creation execution（Decision-AS-PILOT-PROVISION-EXEC-1 Accepted / LOCKED / PX-1+VR-1+FG-1+XB-1+EG-1+AP-1；Execution GO GIVEN；AI mutation FORBIDDEN）
Twenty-eighth residual Decision: SELECTED / CONSUMED — CN-1 Internal Column Names observation（Decision-AS-CN1-OBSERVATION-1 CLOSED / CONSUMED；DEFAULT_COLUMNS_ONLY；custom = 0）
Twenty-ninth residual Decision: SELECTED / OPEN — Post-CN-1 schema mapping / column path / Implementation Start gate（Decision-AS-SCHEMA-MAPPING-NEXT-1 packet pending）
Issue Status Reconciliation: ASSESSED / independent candidate（#6/#8/#22 Current·Gate·Dependency resync；close ≠ body sync）
FindingCode: HOLD
A-5: HOLD
PR-J SharePoint / DTO / Schema code assignment: DO NOT START
schemaVersion / dtoVersion: Accepted / LOCKED = 1.0.0 / 1.0.0
Application save boundary: Accepted / LOCKED（SC-1 + FR-1）；implementation DO NOT START
SharePoint / adapter boundary: Accepted / LOCKED（PB-1+EM-1+CV-1+D6-1+UP-1）；implementation DO NOT START
Decision-AS-SP-ADAPTER-1 Independent Review: PASS（P0=0 / P1=0 / P2=0）
DEC-6 mapping rules: Accepted / LOCKED（LF-1+RW-1+MF-1+VR-1）
Placement confirmation rules: Accepted / LOCKED（SV-1+LV-1+CN-1+SC-1）
Tenant confirmation GO boundary: Accepted / LOCKED（RO-1+EV-1+RB-1+XG-1）
Tenant confirmation execution authorization: Accepted / LOCKED（ES-1+TB-1+EO-1+FG-1）
Decision-AS-TARGET-REUSE-1: Accepted / LOCKED / B（existing = reference only）
Decision-AS-NEW-TARGET-PROVISION-1: Accepted / LOCKED / ST-1+LT-1+NM-1+EX-1
Decision-AS-NEW-TARGET-NAMES-1: Accepted / LOCKED / SU-1+LN-1+IN-1+XB-1
  Site URL: https://isogokatudouhome.sharepoint.com/sites/XXXXX
  Site name: XXXXX
  Lists: XXXXX / YYYYY
  Status: HUMAN-PROVIDED / INTENDED / PLACEHOLDER / NOT CREATED / NOT CONFIRMED
Decision-AS-ORG-SITE-TOPOLOGY-1: Accepted / LOCKED / OT-1+FS-1+SP-1+PP-1+PH-1+XB-1
  1法人 = 1共通管理サイト + N事業所サイト
  1 SPFx コード共通利用
  第1サイト = パイロット事業所専用
  placeholder 作成 = FORBIDDEN
Independent Re-review #185: PASS（P0=0 / P1=0 / P2=0；HEAD b37e3e6d0d3f925e8686f2e2805094b55479b024）
PR #184: MERGED（expected head 84745355929c7e43dcc6c89dd00d29935f79034c / merge 0be50a12e3699d187bce0f27caa732f3e7ccea24）
PR #185: MERGED（merge 1aef0d3971165f6504f7f13d6e68a51d7cfdaf61）
DailyActivityRecords required-fields evidence: OBSERVED / CONFIRMED AS EXISTING-APP EVIDENCE / REFERENCE ONLY
Observed existing environment: /sites/welfare + DailyActivityRecords（required 5）REFERENCE ONLY
New SPFx deployment target: ORG TOPOLOGY LOCKED / Sites CREATED / Lists CREATED / CN-1 observation CLOSED
Concrete Site strings: LOCKED / OBSERVED / CONFIRMED（isogo / honmoku）
List names: LOCKED / OBSERVED / CONFIRMED（SupportPlans / AssessmentSnapshots）
Internal Column Names: CLOSED observation / DEFAULT_COLUMNS_ONLY / custom = 0
Reuse existing /sites/welfare for new SPFx: NOT ADOPTED（B）
Value Acceptance for /sites/welfare as new-SPFx target: NOT APPLICABLE
Site / List creation: COMPLETED（pilot Sites + Lists）
Placeholder creation: FORBIDDEN
SV-1 / LV-1: CONFIRMED（VR-1 PASS）
Decision-AS-CN1-OBSERVATION-1: CLOSED / CONSUMED
  Stop point: HUMAN_CN1_INTERNAL_NAME_READ_ONLY_OBSERVATION = COMPLETE
  Result: DEFAULT_COLUMNS_ONLY
  Custom application columns: 0 / NOT PRESENT
  Match-existing-app-Internal-Names premise: NOT APPLICABLE / INVALIDATED
  evidence: decision-assessment-snapshot-cn1-readonly-observation-evidence.md
  closure: decision-assessment-snapshot-cn1-closure-determination.md
Decision-AS-PILOT-FACILITY-IDENTITY-1: Accepted / LOCKED / PO-1+FK-1+SN-1+LN-D+XB-1
  磯子=isogo → /sites/severe-support-isogo
  本牧=honmoku → /sites/severe-support-honmoku
Decision-AS-PILOT-LIST-OWNERSHIP-1: Accepted / LOCKED / LO-1+VP-1+EX-1+NB-1+XB-1
  List A = SupportPlan + SupportPlanVersion
  List B = AssessmentSnapshot
Decision-AS-PILOT-LIST-NAMES-1: Accepted / LOCKED / LN-1+XB-1
  List A name = SupportPlans
  List B name = AssessmentSnapshots
Decision-AS-PILOT-PROVISION-EXEC-1: Accepted / LOCKED / PX-1+VR-1+FG-1+XB-1+EG-1+AP-1
  Execution GO: GIVEN
  AI SharePoint mutation: FORBIDDEN（DEC-AI-ORG-003）
  Separate Human creation: COMPLETED（Site + List only）
  Intent = Observed / Mismatch = 0
  Site count = 2 / 2
  List count = 4 / 4
  SV-1: CONFIRMED
  LV-1: CONFIRMED
  VR-1: PASS
  CN-1 observation: CLOSED / CONSUMED
  evidence: decision-assessment-snapshot-pilot-provision-vr1-evidence.md
  Independent Review: decision-assessment-snapshot-pr-187-independent-review.md（PASS）
Independent Review #187: PASS
Independent Review #188: PASS
PR #188: MERGED
PR #187: MERGED / Current SoT
PR #186: CLOSED / NOT MERGED / SUPERSEDED by PR #187
PR #189: SUPERSEDED for observation SoT（PARTIAL / UNOBSERVED）
Next gate: schema mapping / column path / Implementation Start boundary
  selection: decision-ilb-1-twenty-ninth-residual-schema-mapping-selection.md
  next-gate: decision-assessment-snapshot-cn1-next-gate.md
  prior CN-1 packet: decision-assessment-snapshot-cn1-observation-packet.md（CLOSED）
Issue Status Reconciliation: ASSESSED / independent next-unit candidate
  assessment: issue-status-reconciliation-assessment.md
SharePoint adapter / schema mapping impl: HOLD（≠ mapping-complete）
Implementation Start: HOLD
SharePoint schema/list/column change: FORBIDDEN
GitHub Issue mutation / 一括 Close / 一括本文更新: FORBIDDEN
Deploy / real data: NO-GO
Tenant confirmation execution: IN PROGRESS / READ-ONLY
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```


## 1. Classification legend（provisional）

| Code | Meaning |
|---|---|
| A | 制度上必須（候補） |
| B | 法人として Human Decision が必要（候補） |
| C | 制度上固定されず現場裁量候補 |
| D | application に埋め込まない候補 |
| E | 根拠不足 / 要追加確認（NOT CONFIRMED） |

## 2. Residual Decision table

| ID | 何を決めようとしているか | 制度根拠が必要か | repo に制度根拠があるか | 法人ローカルになり得るか | 現場裁量の余地 | Human Decision 要否 | Provisional class |
|---|---|---|---|---|---|---|---|
| **GOV-AUD-05** | 物理削除方針 | はい（個人情報・監査・保存との関係） | Decision-AUD-RET-1（最低5年）+ 本 Acceptance | — | — | **Accepted / LOCKED（Option A）** のうち **保存期間中の完全削除禁止**（[`decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md`](./decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md)）。自動物理削除 **NOT ADOPTED**。経過後の可否は別 Decision | **partial closed**（post-retention OPEN） |
| **DEC-012** | 論理削除データの完全削除方針 | はい | 同上 | — | — | **Accepted / LOCKED（Option A）** のうち **保存期間中の完全削除禁止**（GOV-AUD-05 と同一 Acceptance）。経過後の可否は別 Decision | **partial closed**（post-retention OPEN） |
| **Decision-RD-3** | 見直し接近窓・期限算出・超過後 | 部分（cadence は Accepted だが窓日数は別） | GOV-RULE-06 Accepted；08 = NOT ADOPTED | — | — | **Accepted / LOCKED**（[`decision-rd-3-monitoring-guidance-acceptance.md`](./decision-rd-3-monitoring-guidance-acceptance.md)）。informational only。期限超過・警告・業務制限・90日・hard due **NOT ADOPTED** | **closed** |
| **Decision-AS-EC-1** | AssessmentSnapshot 完全契約 Entry Criteria | 部分（業務保存・監査） | Entry #1〜#8 個別閉鎖／Accepted；**overall = MET / Accepted**（[`decision-as-ec-1-overall-entry-acceptance.md`](./decision-as-ec-1-overall-entry-acceptance.md)） | 実装開始は別 | 低 | **Tenth residual CONSUMED** — PR-J domain Implementation Start GO（[`assessment-snapshot-complete-contract.md`](./assessment-snapshot-complete-contract.md)）。**Decision-AS-SCHEMA-ID-1 Accepted**（[`decision-assessment-snapshot-schema-id-value-naming-acceptance.md`](./decision-assessment-snapshot-schema-id-value-naming-acceptance.md)）。**Decision-AS-SCHEMA-VERSION-1 Accepted**（[`decision-assessment-snapshot-schema-version-acceptance.md`](./decision-assessment-snapshot-schema-version-acceptance.md) = 1.0.0）。FindingCode / A-5 / SharePoint / DTO code = HOLD | **closed（overall）** / PR-J domain GO / Schema ID+Version LOCKED / 他 HOLD |
| **DEC-009** | Snapshot 保存タイミング | 業務上必要になり得る | Human Acceptance LOCKED | — | — | **Accepted / LOCKED / Option A / FINAL CONSISTENT**（[`decision-dec-009-snapshot-save-timing-acceptance.md`](./decision-dec-009-snapshot-save-timing-acceptance.md) / [`decision-dec-009-canonicalization-consistency-check.md`](./decision-dec-009-canonicalization-consistency-check.md)）。下書き / 確定時保存 / 元保持＋新版 / 上書き NOT ADOPTED / 履歴保持 | **closed** |
| **DEC-015** | バックアップ・復元責任者 | 運用・監査 | 所有表のみ | はい | 低〜中 | 要 | **E** |
| **DEC-6** | SharePoint 列変換 | 技術/adapter | adapter Entry 前提 | 技術契約寄り | N/A | **Decision-AS-DEC6-MAPPING-1 Accepted / LOCKED**（LF-1+RW-1+MF-1+VR-1；[`decision-assessment-snapshot-dec6-mapping-acceptance.md`](./decision-assessment-snapshot-dec6-mapping-acceptance.md)）。具体 Site/List/Internal Name = NOT DECIDED；実装 DO NOT START | **partial closed**（rules LOCKED / values OPEN） |
| **FindingCode / A-5** | catalog 値・representation | 業務カタログ | DEC-019 EMPTY Accepted | はい（値を作るなら） | なし（発明禁止） | 現状 **HOLD / DO NOT CREATE** | **D**（再開しない） |
| **GOV-AUD-03/04** | 訂正承認 / 論理削除ロール | — | Accepted / Option E | — | — | **再 Decision しない** | closed |
| **DEC-008** | 作成者 / 最終承認 / 提出差戻し | — | Accepted / LOCKED | — | — | **再 Decision しない** | closed |
| **GOV-RULE-05〜08 / OP-3** | 見直し・観察 Schema | — | Accepted | — | — | **再 Decision しない** | closed |

## 3. Local-rule candidates（provisional・未 Accepted）

「制度必須と確認できないが、アプリに入れたくなりやすい」候補。

| Candidate | Why it looks local | Risk if embedded without evidence | Provisional |
|---|---|---|---|
| hard due / overdue（GOV-RULE-08） | 便利な期限表示 | 制度根拠なく違反扱い化しうる | **D**（現行 NOT ADOPTED 維持） |
| 接近窓の固定日数（RD-3） | 通知 UX | 90日等の発明に degenerate しうる | **D**（RD-3 Accepted: 90日固定 NOT ADOPTED） |
| 物理削除の自動実行（GOV-AUD-05） | ストレージ整理 | 監査・保存義務と衝突しうる | **D**（Accepted: 自動実行 NOT ADOPTED） |
| 提出・差戻しロール Binding | ワークフロー完成度 | DEC-008 Option C と矛盾 | **D**（Accepted 維持） |
| FindingCode 値の仮埋め | 画面表示 | DEC-019 EMPTY と矛盾 | **D**（HOLD） |

## 4. NOT CONFIRMED items

| Item | Why NOT CONFIRMED | Action |
|---|---|---|
| 生活介護「少なくとも6か月に1回以上見直し」を、本アプリの HARD GATE として GOV-RULE-06（3ヶ月に1回程度）へ統合すべきか | 外部一次資料候補（例: 生活介護計画の確認項目 PDF）と、repo 正本の GOV-RULE-06（強度行動障害支援の practice cadence）は論点が異なり、統合結論を本 Work Order で確定できない | 分類 E。Human Policy Accepted 後に別問いへ |
| DEC-009 保存タイミングの実装細部（物理キー / Schema） | Acceptance は業務意味のみ | Schema / storage は別 Entry。自動実装禁止 |
| 5年経過後の完全削除・物理削除の可否 | 本 Acceptance は保存期間中禁止のみを閉じた | 別 Human Decision（OPEN）。自動開始禁止 |
| RD-3 接近窓の全国一律日数 | Decision-RD-3 Accepted: 90日固定 NOT ADOPTED | 再開しない（新 Human Decision が必要） |
| 「現場裁量」へ自動落下してよいか | 安全性・算定・監査との衝突未確認 | Decision rule 遵守。自動 C 分類禁止 |

## 5. Institutional evidence note（repo-first）

| Source in repo | Use |
|---|---|
| [`decision-gov-rule-06-review-cadence-source-review.md`](./decision-gov-rule-06-review-cadence-source-review.md) | 「3ヶ月に1回程度」≠90日。Accepted cadence の根拠整理 |
| DEC-008 / GOV-AUD-03/04 Acceptances | 制度根拠未確認ロールを app に埋め込まない先例 |
| OP-3 Acceptance | 制度日数の domain 埋め込み NOT ADOPTED |

外部一次情報（検索で到達した候補。本 inventory では要件として Accepted しない）:

- 厚労省系 PDF（生活介護計画の確認項目・ガイドライン案等）への参照は、Human Policy Accepted 後の個別確認で行う。
- 本 Work Order では外部要約を制度正本にしない。

## 6. Explicit non-actions

```text
Do NOT:
  Accept individual A/B/C/D/E rows from this inventory alone
    （Human Policy Accepted 後も一件ずつ判定）
  Auto-start post-retention deletion Decision
  Re-decide Accepted Decisions（含む Decision-RD-3 / retention prohibition）
  Invent FindingCode / days / roles / approvers / notice rules
  Implementation Start
```

## 7. Next after RD-3 / retention prohibition / DEC-009 / Entry #8 / Entry #2

```text
Order:
  1. Human Policy Accepted / FINAL CONSISTENT（DONE）
  2. First residual: Decision-RD-3 FINAL CONSISTENT（DONE）
  3. Second residual: GOV-AUD-05 / DEC-012 retention prohibition Accepted / LOCKED（DONE）
  4. Third residual: DEC-009 save timing FINAL CONSISTENT（DONE）
  5. Fourth residual: AS-EC-1 Entry #8 technical plan FINAL CONSISTENT（DONE）
     + Entry #1/#2 read-only audit（#1 PASS；#2 was PARTIAL at audit）
  6. Fifth residual: AS-EC-1 Entry #2 ownership / PR-J PASS / MET（DONE / CONSUMED）
  7. Sixth residual: AS-EC-1 Entry #5 findingIds NOT REQUIRED PASS / MET（DONE / CONSUMED）
  8. Seventh residual: AS-EC-1 Entry #6 NOT_APPLICABLE HOLD方針 PASS / MET（DONE / CONSUMED）
  9. Eighth residual: AS-EC-1 Entry #7 DEC-1 versioning PASS / MET（DONE / CONSUMED）
 10. Ninth residual: Decision-AS-EC-1 overall MET / Accepted（DONE / CONSUMED）
 11. Tenth residual: Implementation Start / PR-J domain GO（DONE / CONSUMED；Preflight C → GO A）
 12. Eleventh residual: Schema ID naming+value（DONE / CONSUMED；Decision-AS-SCHEMA-ID-1 Accepted / LOCKED）
 13. Twelfth residual: schemaVersion / dtoVersion（DONE / CONSUMED；Decision-AS-SCHEMA-VERSION-1 Accepted / LOCKED / A = 1.0.0）
 14. Thirteenth residual: application save（DONE / CONSUMED；Decision-AS-APP-SAVE-1 Accepted / LOCKED / SC-1 + FR-1）
 15. Fourteenth residual: SharePoint / adapter（DONE / CONSUMED；Decision-AS-SP-ADAPTER-1 Accepted / LOCKED / PB-1+EM-1+CV-1+D6-1+UP-1）
     Independent Review: PASS（decision-assessment-snapshot-sp-adapter-independent-review.md；P0=0 / P1=0 / P2=0）
 16. Fifteenth residual: DEC-6 concrete mapping（DONE / CONSUMED；Decision-AS-DEC6-MAPPING-1 Accepted / LOCKED / LF-1+RW-1+MF-1+VR-1）
 17. Sixteenth residual: Site / List / Internal Column Name（DONE / CONSUMED；Decision-AS-SP-PLACEMENT-1 Accepted / LOCKED / SV-1+LV-1+CN-1+SC-1）
     values: NOT CONFIRMED / HOLD
 18. Seventeenth residual: Tenant confirmation GO（DONE / CONSUMED；Decision-AS-TENANT-CONFIRM-1 Accepted / LOCKED / RO-1+EV-1+RB-1+XG-1）
 19. Eighteenth residual: Tenant confirmation execution authorization（DONE / CONSUMED；Decision-AS-TENANT-CONFIRM-EXEC-1 Accepted / LOCKED / ES-1+TB-1+EO-1+FG-1）
 20. Nineteenth residual: New SPFx deployment target reuse（DONE / CONSUMED；Decision-AS-TARGET-REUSE-1 Accepted / LOCKED / B）
     evidence: tenant-confirmation-daily-activity-records-required-fields-evidence.md
       （OBSERVED / CONFIRMED AS EXISTING-APP EVIDENCE / REFERENCE ONLY）
     IR: decision-assessment-snapshot-pr-181-independent-review.md（F-001 ADDRESSED）
     New SPFx deployment target: NOT SELECTED / NOT CREATED / HOLD（pre-twentieth）
     Reuse existing /sites/welfare for new SPFx: NOT ADOPTED（B）
     Value Acceptance for /sites/welfare as new-SPFx target: NOT APPLICABLE
 21. Twentieth residual: New SPFx target provisioning（DONE / CONSUMED；Decision-AS-NEW-TARGET-PROVISION-1 Accepted / LOCKED / ST-1+LT-1+NM-1+EX-1）
     topology: dedicated new Site + dedicated new Lists
     concrete names: NOT SELECTED / OPEN
     Site / List creation: NO-GO
     PR #184: MERGED（8474535… / 0be50a1…）
 22. Twenty-first residual: New SPFx Site / List naming（DONE / CONSUMED；Decision-AS-NEW-TARGET-NAMES-1 Accepted / LOCKED / SU-1+LN-1+IN-1+XB-1）
     acceptance: decision-assessment-snapshot-new-target-names-acceptance.md
     intended Site URL: https://isogokatudouhome.sharepoint.com/sites/XXXXX
     intended Site name: XXXXX
     intended Lists: XXXXX / YYYYY
     status: HUMAN-PROVIDED / INTENDED / PLACEHOLDER / NOT CREATED / NOT CONFIRMED
     Internal Names: OPEN（IN-1 — post-creation CN-1）
     IR: decision-assessment-snapshot-pr-185-independent-review.md（PASS；P0=0 / P1=0 / P2=0）
     PR #185: MERGED（merge 1aef0d3971165f6504f7f13d6e68a51d7cfdaf61）
     creation / provisioning execution: NO-GO（placeholder 作成 FORBIDDEN）
 23. Twenty-third residual: Multi-facility org site topology（DONE / CONSUMED；Decision-AS-ORG-SITE-TOPOLOGY-1 Accepted / LOCKED / OT-1+FS-1+SP-1+PP-1+PH-1+XB-1）
     acceptance: decision-assessment-snapshot-org-site-topology-acceptance.md
     packet: decision-assessment-snapshot-org-site-topology-packet.md
     selection: decision-ilb-1-twenty-third-residual-org-site-topology-selection.md
     next gate: decision-assessment-snapshot-org-site-topology-next-gate.md
       = FORMAL PILOT FACILITY IDENTITY / SITE NAMING
 24. Twenty-fourth residual: Pilot facility identity / Site naming（DONE / CONSUMED；Decision-AS-PILOT-FACILITY-IDENTITY-1 Accepted / LOCKED / PO-1+FK-1+SN-1+LN-D+XB-1）
     acceptance: decision-assessment-snapshot-pilot-facility-identity-acceptance.md
     packet: decision-assessment-snapshot-pilot-facility-identity-packet.md
     selection: decision-ilb-1-twenty-fourth-residual-pilot-facility-identity-selection.md
     next gate: decision-assessment-snapshot-pilot-facility-identity-next-gate.md
       = PILOT LIST NAMES（after ownership check）
     LOCKED payload:
       Pilot1 磯子活動ホーム / facilityKey=isogo
         Site=強度行動障害支援 - 磯子活動ホーム
         URL=/sites/severe-support-isogo
       Pilot2 本牧活動ホーム / facilityKey=honmoku
         Site=強度行動障害支援 - 本牧活動ホーム
         URL=/sites/severe-support-honmoku
     List names: DEFERRED
     remaining examples: List ownership / List names / common-management naming / post-retention / DEC-015 / SV-1·LV-1·CN-1 after real creation
     FindingCode / A-5: HOLD
     Note: PR #186 CLOSED / NOT MERGED / SUPERSEDED by PR #187；placeholder 作成 FORBIDDEN
 25. Twenty-fifth residual: Pilot List ownership（DONE / CONSUMED；Decision-AS-PILOT-LIST-OWNERSHIP-1 Accepted / LOCKED / LO-1+VP-1+EX-1+NB-1+XB-1）
     acceptance: decision-assessment-snapshot-pilot-list-ownership-acceptance.md
     ownership check: decision-assessment-snapshot-pilot-list-ownership-check.md（CONSUMED）
     packet: decision-assessment-snapshot-pilot-list-ownership-packet.md
     selection: decision-ilb-1-twenty-fifth-residual-pilot-list-ownership-selection.md
     next gate: decision-assessment-snapshot-pilot-list-names-next-gate.md
       = PILOT LIST NAMES
     LOCKED ownership:
       List A = SupportPlan + SupportPlanVersion
       List B = AssessmentSnapshot
       EX-1 AuditEvent / DailyActivityRecords 除外
     List names: LOCKED via twenty-sixth
 26. Twenty-sixth residual: Pilot List names（DONE / CONSUMED；Decision-AS-PILOT-LIST-NAMES-1 Accepted / LOCKED / LN-1+XB-1）
     acceptance: decision-assessment-snapshot-pilot-list-names-acceptance.md
     packet: decision-assessment-snapshot-pilot-list-names-packet.md
     selection: decision-ilb-1-twenty-sixth-residual-pilot-list-names-selection.md
     next gate: decision-assessment-snapshot-pilot-provision-exec-next-gate.md
       = EXPLICIT SITE/LIST CREATION EXECUTION（CONSUMED via twenty-seventh）
     LOCKED INTENDED Lists:
       SupportPlans
       AssessmentSnapshots
     Creation: authorized via twenty-seventh；NOT CREATED
 27. Twenty-seventh residual: Pilot Site/List creation execution（DONE / CONSUMED；Decision-AS-PILOT-PROVISION-EXEC-1 Accepted / LOCKED / PX-1+VR-1+FG-1+XB-1+EG-1+AP-1）
     acceptance: decision-assessment-snapshot-pilot-provision-exec-acceptance.md
     packet: decision-assessment-snapshot-pilot-provision-exec-packet.md
     selection: decision-ilb-1-twenty-seventh-residual-pilot-provision-exec-selection.md
     next gate: decision-assessment-snapshot-pilot-provision-exec-next-gate.md
       = CN-1（Internal Column Names）；PR #187 MERGED；PR #186 SUPERSEDED/CLOSED
     evidence: decision-assessment-snapshot-pilot-provision-vr1-evidence.md
  Independent Review: decision-assessment-snapshot-pr-187-independent-review.md（PASS）
     Execution GO: GIVEN
     AI SharePoint mutation: FORBIDDEN（DEC-AI-ORG-003 / AP-1）
     Separate Human creation: COMPLETED（Site + List only）
     Intent = Observed / Mismatch = 0
     Site count = 2 / 2
     List count = 4 / 4
     SV-1: CONFIRMED
     LV-1: CONFIRMED
     VR-1: PASS
     CN-1 observation: CLOSED / CONSUMED（twenty-eighth）
     remaining examples: schema mapping / column path / common-management naming / post-retention / DEC-015
 28. Twenty-eighth residual: CN-1 Internal Column Names observation（DONE / CONSUMED；Decision-AS-CN1-OBSERVATION-1 CLOSED / CONSUMED）
     selection: decision-ilb-1-twenty-eighth-residual-cn1-selection.md
     packet: decision-assessment-snapshot-cn1-observation-packet.md
     evidence: decision-assessment-snapshot-cn1-readonly-observation-evidence.md
     closure: decision-assessment-snapshot-cn1-closure-determination.md
     next gate: decision-assessment-snapshot-cn1-next-gate.md
       = schema mapping / column path / Implementation Start boundary
     Stop point: HUMAN_CN1_INTERNAL_NAME_READ_ONLY_OBSERVATION = COMPLETE
     Result: DEFAULT_COLUMNS_ONLY / custom application columns = 0
     Match-existing premise: NOT APPLICABLE / INVALIDATED
 29. Twenty-ninth residual: Post-CN-1 schema mapping / column path（SELECTED / OPEN）
     selection: decision-ilb-1-twenty-ninth-residual-schema-mapping-selection.md
     packet: Decision-AS-SCHEMA-MAPPING-NEXT-1（pending open）
     Implementation Start: HOLD
     adapter / schema mapping impl: HOLD（≠ mapping-complete）
AS-EC-1 overall: MET / Accepted
PR-J domain: IN PROGRESS（technical contract locked）
Schema ID string: LOCKED = severe-behavior-support.assessment-snapshot.snapshot
schemaVersion / dtoVersion: LOCKED = 1.0.0 / 1.0.0
Schema / DTO code assignment: HOLD / NOT STARTED
Application save boundary: LOCKED（SC-1 + FR-1）
SharePoint / adapter boundary: LOCKED（PB-1+EM-1+CV-1+D6-1+UP-1）
DEC-6 mapping rules: LOCKED（LF-1+RW-1+MF-1+VR-1）
Placement confirmation rules: LOCKED（SV-1+LV-1+CN-1+SC-1）
Tenant confirmation GO boundary: LOCKED（RO-1+EV-1+RB-1+XG-1）
Tenant confirmation execution authorization: LOCKED（ES-1+TB-1+EO-1+FG-1）
Decision-AS-TARGET-REUSE-1: LOCKED / B
Decision-AS-NEW-TARGET-PROVISION-1: LOCKED / ST-1+LT-1+NM-1+EX-1
Decision-AS-NEW-TARGET-NAMES-1: LOCKED / SU-1+LN-1+IN-1+XB-1
  intended values: HUMAN-PROVIDED / INTENDED / PLACEHOLDER / NOT CREATED / NOT CONFIRMED
Decision-AS-ORG-SITE-TOPOLOGY-1: LOCKED / OT-1+FS-1+SP-1+PP-1+PH-1+XB-1
Decision-AS-PILOT-FACILITY-IDENTITY-1: LOCKED / PO-1+FK-1+SN-1+LN-D+XB-1
  磯子=isogo → /sites/severe-support-isogo
  本牧=honmoku → /sites/severe-support-honmoku
Application / adapter implementation: HOLD / DO NOT START
SharePoint implementation: DO NOT START
Observed existing environment: /sites/welfare + DailyActivityRecords required 5 = REFERENCE ONLY
New SPFx deployment target: ORG TOPOLOGY LOCKED / Sites CREATED / Lists CREATED / CN-1 observation CLOSED
Concrete Site strings: HUMAN-PROVIDED / OBSERVED / CONFIRMED（isogo / honmoku）
List names: HUMAN-PROVIDED / OBSERVED / CONFIRMED（SupportPlans / AssessmentSnapshots）
Reuse existing /sites/welfare for new SPFx: NOT ADOPTED
Site / List creation: COMPLETED
Placeholder creation: FORBIDDEN
SV-1 / LV-1: CONFIRMED（VR-1 PASS）
Internal Column Names: CLOSED observation / DEFAULT_COLUMNS_ONLY / custom = 0
Decision-AS-CN1-OBSERVATION-1: CLOSED / CONSUMED
Decision-AS-PILOT-LIST-OWNERSHIP-1: LOCKED / LO-1+VP-1+EX-1+NB-1+XB-1
  List A = SupportPlan + SupportPlanVersion
  List B = AssessmentSnapshot
Decision-AS-PILOT-LIST-NAMES-1: LOCKED / LN-1+XB-1
  SupportPlans / AssessmentSnapshots
Decision-AS-PILOT-PROVISION-EXEC-1: LOCKED / PX-1+VR-1+FG-1+XB-1+EG-1+AP-1
  Execution GO: GIVEN
  AI SharePoint mutation: FORBIDDEN
  Separate Human creation: COMPLETED（Site + List only）
  Intent = Observed / Mismatch = 0
  Site count = 2 / 2
  List count = 4 / 4
  SV-1: CONFIRMED
  LV-1: CONFIRMED
  VR-1: PASS
  CN-1 observation: CLOSED / CONSUMED
  evidence: decision-assessment-snapshot-pilot-provision-vr1-evidence.md
  Independent Review: decision-assessment-snapshot-pr-187-independent-review.md（PASS）
Independent Review #187: PASS
Independent Review #188: PASS
PR #188: MERGED
PR #187: MERGED / Current SoT
PR #186: CLOSED / NOT MERGED / SUPERSEDED by PR #187
PR #189: SUPERSEDED for observation SoT（PARTIAL / UNOBSERVED）
Next gate: schema mapping / column path / Implementation Start boundary
  selection: decision-ilb-1-twenty-ninth-residual-schema-mapping-selection.md
  next-gate: decision-assessment-snapshot-cn1-next-gate.md
Issue Status Reconciliation: ASSESSED / independent next-unit candidate
  assessment: issue-status-reconciliation-assessment.md
SharePoint adapter / schema mapping impl: HOLD（≠ mapping-complete）
Implementation Start: HOLD
SharePoint schema/list/column change: FORBIDDEN
GitHub Issue mutation / 一括 Close / 一括本文更新: FORBIDDEN
Deploy / real data: NO-GO
List names: HUMAN-PROVIDED / OBSERVED / CONFIRMED
Tenant confirmation execution: IN PROGRESS / READ-ONLY
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```
