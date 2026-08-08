# Issue #24 残責務再監査（RuleSetVersion選択完了後）

この文書は、PR #84（RuleSetVersion選択純関数）完了後の Issue #24 残責務再監査と、
次実装単位の選定結果正本である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main before this canonicalization: dd934f389411d23b882922dfc7933493cb1ae5f7
PR #84 / RuleSetVersion selection: MERGED
merged head: 706b8f1004070b196249a48d1d996be1210295c3
expected pre-squash head: 21355ab39b91dce7774bf478d6440b2b06230f3c
Issue #24: OPEN
Next pure unit: NONE
Implementation Start (next domain PR): HOLD
Issue #24 Close: NO-GO
deploy: NO-GO
SharePoint / M365: 変更なし
```

上位入口:

- [`finding-audit-ownership.md`](./finding-audit-ownership.md)
- 先行選定: [`issue-24-remaining-audit-pr-i-selection.md`](./issue-24-remaining-audit-pr-i-selection.md)
- 直前完了契約: [`ruleset-version-selection.md`](./ruleset-version-selection.md)
- 残 Decision 分類: [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

## 監査手順結果

### 1. main 反映済み（Issue #24 系列）

| 単位 | 証跡 | 状態 |
|---|---|---|
| Finding 安定ID | PR #55 / `finding-stable-id.md` | DONE |
| Finding lifecycle transition（許可3辺・Resolved終端） | PR #64 / `finding-lifecycle-transition.md` | DONE |
| finding 生成条件（eligibility） | PR #65 / `finding-generation-conditions.md` | DONE |
| FindingIdentity 組立（狭域） | PR #66 / `finding-identity-assembly.md` | DONE |
| finding 再発判定 | PR #67 / `finding-recurrence.md` | DONE |
| AssessmentSnapshot Result変換（永続なし） | PR #72 / `assessment-snapshot-result-conversion.md` | DONE |
| SupportPlan status transition（許可5辺） | PR #73 / #74 / `support-plan-status-transition.md` | DONE |
| Active 計画一意性 | PR #76 / #78 / `active-plan-uniqueness.md` | DONE |
| 観察期間メンバシップ | PR #79 / #80 / `observation-period.md` | DONE |
| 見直し期限 asOf 相対判定 | PR #81 / #82 / `review-due.md` | DONE |
| RuleSetVersion 選択 | PR #83 / #84 / `ruleset-version-selection.md` | DONE |

PR-I 選定時点で「後続候補」だった支援計画系純粋ルール
（Active一意性・観察期間・見直し期限・RuleSetVersion選択）は、
いずれも契約 → Decision → 小PR → 独立レビュー → 人の Gate を経て main 反映済み。

### 2. 残候補の分類

| 単位 | 所有 | 分類 | 独立実装可否 | 備考 |
|---|---|---|---|---|
| Handoff 状態遷移純関数 | Issue #17 | **Accepted / MERGED**（HO-1 + PR #90〜#96） | 候補まで完了 | logical/replay DONE（PR #104/#106）。`#29` MERGED。`#22B` PR #110 MERGED（synthetic）。SharePoint 実環境 NO-GO |
| Finding 再オープン（Resolved から） | Issue #24（lifecycle） | **Accepted**（Decision-FLR-1） | **実装不要** | 再オープン不許可・`Resolved` 終端維持。impact NONE。正本: [`decision-flr-1-finding-reopen-policy.md`](./decision-flr-1-finding-reopen-policy.md) |
| FindingSeverity / 完全 Finding | Decision-SEV-1 Accepted（Option A）。PURPOSE RECORDED。CONCEPT-INV COMPLETED。VOCAB Accepted / Option A / NOT ADOPTED；Canonical COMPLETE（Issue #8 / DEC-018） | Severity 不採用完了。完全 Finding は別 | **不可**（Severity 型は作らない） | ASSIGN N/A。代替概念は別 Entry |
| FindingCode 業務カタログ | Decision-FC-1 Accepted / Option B（Issue #8 new DEC） | ownership COMPLETE。FC-2〜FC-6 Accepted / Option C。値一覧未決 | **不可**（実装 HOLD） | Issue #8 FindingCode DEC 番号 UNASSIGNED。値一覧・UUID/hash/semver・schema / storage / provider は後続 |
| AssessmentSnapshot 完全契約・保存・DTO・findingIds | Issue #24 | HOLD（`DEC-009` / `GOV-AUD`） | **不可** | Result変換のみ完了 |
| AssessmentSnapshot 候補生成（Result変換超） | Issue #24 | HOLD（Entry Criteria） | **不可** | Finding 本体境界と混線しやすい |
| Decision-OP-3（観察期間フィールド追加） | 別 Decision | HOLD（制度/Schema） | **不可** | メンバシップ純関数は完了 |
| Decision-RD-3（接近窓・超過後ポリシー） | 別 Decision | HOLD（制度日数） | **不可** | asOf 相対判定は完了 |
| 開放終端（observation `periodTo` / RSV `effectiveTo`） | 新 Decision 要 | HOLD | **不可** | 現行契約は終端必須 |
| Audit 値安全性 / hardening | #22 / SAN-VALUE-1 / SAN-1 | **DONE**（Accepted + PR #102） | **完了** | Issue #24 純関数単位ではない |
| AuditEvent logical persistence boundary | #22A | **DONE**（PR #104） | **完了** | 6-value write result / port |
| AuditEvent Replay implementation | #22A / REPLAY-1 | **DONE**（PR #106） | **完了** | Entry PASS + Human GO 消費済み |
| Decision-AUD-REPO-1 | #22A | **Accepted** | **完了** | uniqueness / multi-match / race |
| AuditEvent physical mapping | #29 | **Accepted**（MERGED（PR #108）） | **不可（今は #22B）** | docs-only。実変更 NO-GO |
| AuditEvent concrete repository / SharePoint | #22B | **MERGED（synthetic）**（PR #110 / 62a43d7f…） | **synthetic のみ完了** | 実 SharePoint adapter は別 Gate / NO-GO |
| 訂正・削除・復旧運用 | Issue #17 | HOLD（`GOV-AUD`） | **不可** | #19 回答待ち |

### 3. Approval Dependency

| 依存 | 影響 | 本監査での扱い |
|---|---|---|
| Issue #19 / `GOV-AUD-01〜10` | Handoff・Snapshot保存・削除・保存期間 | 次単位へ入れない |
| `DEC-009` | Snapshot 保存タイミング | 次単位へ入れない |
| FindingSeverity DEC 方式 A/B | Decision-SEV-1 Accepted（Option A） | CONCEPT-INV COMPLETED。VOCAB Human Decision Option A 不採用 Accepted。Canonical COMPLETE（Issue #8 / DEC-018）。ASSIGN N/A |
| Finding 再オープン Decision | lifecycle（Decision-FLR-1 Accepted・実装 NONE） | 次単位へ入れない（変更不要） |
| Handoff 所有指定 | transition 純関数 | Decision-HO-1 Accepted（#17）。実保存は別 |
| FindingCode カタログ Decision | 写像表・採番 | FC-1〜FC-6 Accepted。representation strategy / 値一覧は後続。次単位へ値を入れない |

## 選定結果

```text
次の安全な純関数実装単位: NONE
```

選定理由:

1. Issue #19 非依存かつ所有確定済みの狭域 fail-closed 単位は、RuleSetVersion選択まで消化済み
2. 残候補はいずれも所有未確定、または制度/DEC/`GOV-AUD`、またはカタログ Decision が先
3. 未決の許可辺・制度日数・Severity 値を推測で埋めない（HOLD 優先。severity は MHLW-first）

### 次に人が進める候補（実装PRではない・順位）

残 Decision 分類正本: [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

1. Decision-FLR-1 Finding 再オープン — **Accepted**（不許可・実装 NONE）。正本: [`decision-flr-1-finding-reopen-policy.md`](./decision-flr-1-finding-reopen-policy.md)
2. AuditEvent 実保存の次工程 — ALIGN/IDEM/SAN-VALUE/SAN-1/REPLAY-1/REPO-1 **Accepted**。logical/replay MERGED（PR #104/#106）。`#29` mapping Accepted / MERGED（PR #108）。正本: [`audit-event-physical-mapping-29.md`](./audit-event-physical-mapping-29.md)。次は実 SharePoint adapter 別 Gate（PR #110 MERGED / SharePoint 実環境 NO-GO）
3. FindingSeverity Decision-SEV-2 — CONCEPT-INV **COMPLETED**。VOCAB **Accepted / Option A / NOT ADOPTED**。Canonical **COMPLETE（Issue #8 / DEC-018）**。ASSIGN **N/A**
4. FindingCode 業務カタログ Decision — **FC-1〜FC-6 Accepted**。残件は [`fc-decision-exit-review.md`](./fc-decision-exit-review.md) の A-class（値一覧・採番・mapping・DEC 番号・identifier strategy）。FC-7 NOT CREATED。実装 HOLD
5. Decision-OP-3 / Decision-RD-3（フィールド・制度窓。完了済み純関数の代替ではない）
6. AssessmentSnapshot 完全契約 Entry Criteria（Decision-AS-EC-1。`DEC-009` / `GOV-AUD` / Finding 境界）

注: Decision-HO-1 / Handoff 候補生成（PR #96）は完了。実保存・SharePoint は NO-GO。

```text
Next pure unit: NONE（PR #85 判定維持。Decision backlog でも再確認）
Implementation Start: HOLD
```

## OUT / 混ぜないもの

- 次の domain 実装 PR を本監査から自動起票すること
- Snapshot 保存・DTO・SharePoint 列
- FindingSeverity 値の暗黙採択
- FindingCode カタログの暗黙採択
- Decision-FLR-1 に反する再オープン辺の追加（Accepted: 不許可）
- AuditLog 保存期間・書込先の推測採択
- AuditEvent `#22B` SharePoint 実環境 adapter（PR #110 MERGED は synthetic のみ。実変更 NO-GO / 別 Gate）
- OP-3 / RD-3 の制度値埋め込み
- Entra ID / Microsoft 365 / deploy / 実データ
- Issue #24 Close

## Gate

```text
残責務再監査: READY
次純関数単位選定: NONE
Implementation Start (next domain PR): HOLD
Issue #24 Close: NO-GO
SharePoint / Entra ID / Microsoft 365: NO-GO
Deploy: NO-GO
```

### Issue #24 Close 判定理由（NO-GO）

- AssessmentSnapshot 完全契約・保存（`DEC-009` / `GOV-AUD`）が未了
- FindingCode 業務カタログが未了
- FindingSeverity / 完全 Finding（SEV-1 ownership Accepted。PURPOSE MHLW-first RECORDED。CONCEPT-INV COMPLETED。SEV-2-VOCAB Human Decision Accepted / Option A / NOT ADOPTED。Canonical COMPLETE（Issue #8 / DEC-018）。ASSIGN N/A。完全 Finding は別 HOLD）が未了
- AuditEvent 実 SharePoint adapter / tenant integration（`#22B` synthetic は MERGED）が未了

Decision-FLR-1 / Decision-HO-1 / Decision-SEV-1 / AUD-RET-1 / AUD-WR-1 / ALIGN-1 / IDEM-1 / SAN-VALUE-1 / SAN-1 / REPLAY-1 / REPO-1 / persistence technical contract（PR #99）/ contract hardening（PR #102）/ logical persistence（PR #104）/ replay logical（PR #106）は完了扱い。
Close ブロッカーから外す。FindingSeverity vocabulary（SEV-2-VOCAB / DEC-018）は完了。ASSIGN は N/A。代替概念モデルは次 unit 未選定。CONCEPT-INV は COMPLETED。Audit 系の本当の次ブロッカーは実 SharePoint adapter / tenant integration（`#29` mapping / `#22B` synthetic は MERGED。実環境は別 Gate / NO-GO）。

支援計画系純粋ルール系列の完了は、上記 HOLD を解消しない。

## 本 PR（docs-only）の役割

```text
1. PR #84 完了後の残責務を正本へ再記録する
2. 次の安全な純関数単位が無いことを固定する
3. ownership / foundation の陳腐化した HOLD 表記を更新する
4. src/** / tests/** は変更しない
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
