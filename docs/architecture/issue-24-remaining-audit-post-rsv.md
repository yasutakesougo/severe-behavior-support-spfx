# Issue #24 残責務再監査（RuleSetVersion選択完了後）

この文書は、PR #84（RuleSetVersion選択純関数）完了後の Issue #24 残責務再監査と、
次実装単位の選定結果正本である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main: 706b8f1004070b196249a48d1d996be1210295c3
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
| Handoff 状態遷移純関数 | Issue #17 | **Accepted / MERGED**（HO-1 + PR #90〜#96） | 候補まで完了 | 実保存は [`audit-event-persistence-entry-criteria.md`](./audit-event-persistence-entry-criteria.md) HOLD |
| Finding 再オープン（Resolved から） | Issue #24（lifecycle） | **Accepted**（Decision-FLR-1） | **実装不要** | 再オープン不許可・`Resolved` 終端維持。impact NONE。正本: [`decision-flr-1-finding-reopen-policy.md`](./decision-flr-1-finding-reopen-policy.md) |
| FindingSeverity / 完全 Finding | DEC 方式 A/B 未選択 | HOLD（Decision 未） | **不可** | 値一覧の暗黙採用禁止 |
| FindingCode 業務カタログ | Issue #24（部分） | HOLD（カタログ Decision） | **不可** | Identity 組立は完了。カタログは別 |
| AssessmentSnapshot 完全契約・保存・DTO・findingIds | Issue #24 | HOLD（`DEC-009` / `GOV-AUD`） | **不可** | Result変換のみ完了 |
| AssessmentSnapshot 候補生成（Result変換超） | Issue #24 | HOLD（Entry Criteria） | **不可** | Finding 本体境界と混線しやすい |
| Decision-OP-3（観察期間フィールド追加） | 別 Decision | HOLD（制度/Schema） | **不可** | メンバシップ純関数は完了 |
| Decision-RD-3（接近窓・超過後ポリシー） | 別 Decision | HOLD（制度日数） | **不可** | asOf 相対判定は完了 |
| 開放終端（observation `periodTo` / RSV `effectiveTo`） | 新 Decision 要 | HOLD | **不可** | 現行契約は終端必須 |
| Audit 値サニタイズ / write boundary | #22 または新規 | HOLD | **不可** | Issue #24 純関数単位ではない |
| 訂正・削除・復旧運用 | Issue #17 | HOLD（`GOV-AUD`） | **不可** | #19 回答待ち |

### 3. Approval Dependency

| 依存 | 影響 | 本監査での扱い |
|---|---|---|
| Issue #19 / `GOV-AUD-01〜10` | Handoff・Snapshot保存・削除・保存期間 | 次単位へ入れない |
| `DEC-009` | Snapshot 保存タイミング | 次単位へ入れない |
| FindingSeverity DEC 方式 A/B | 完全 Finding | 次単位へ入れない |
| Finding 再オープン Decision | lifecycle（Decision-FLR-1 Accepted・実装 NONE） | 次単位へ入れない（変更不要） |
| Handoff 所有指定 | transition 純関数 | Decision-HO-1 Accepted（#17）。実保存は別 |
| FindingCode カタログ Decision | 写像表・採番 | 次単位へ入れない |

## 選定結果

```text
次の安全な純関数実装単位: NONE
```

選定理由:

1. Issue #19 非依存かつ所有確定済みの狭域 fail-closed 単位は、RuleSetVersion選択まで消化済み
2. 残候補はいずれも所有未確定、または制度/DEC/`GOV-AUD`、またはカタログ Decision が先
3. 未決の許可辺・制度日数・Severity 値を推測で埋めない（HOLD 優先）

### 次に人が進める候補（実装PRではない・順位）

残 Decision 分類正本: [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

1. Decision-FLR-1 Finding 再オープン — **Accepted**（不許可・実装 NONE）。正本: [`decision-flr-1-finding-reopen-policy.md`](./decision-flr-1-finding-reopen-policy.md)
2. AuditEvent 実保存前提（Decision-AUD-RET-1 / AUD-WR-1。**候補作成済み / 人 Accepted 待ち**。正本: [`decision-aud-ret-1-auditlog-retention.md`](./decision-aud-ret-1-auditlog-retention.md) / [`decision-aud-wr-1-audit-write-ownership.md`](./decision-aud-wr-1-audit-write-ownership.md)）
3. FindingSeverity DEC 方式 A/B 選択（Decision-SEV-1。値一覧は SEV-2）
4. FindingCode 業務カタログ Decision（Decision-FC-1 / FC-2）
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
- AuditEvent 実保存 / SharePoint adapter（Entry Criteria 未充足）
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
- FindingSeverity / 完全 Finding が未了
- AuditEvent 実保存 Entry Criteria（AUD-RET-1 / AUD-WR-1 人 Accepted）が未充足

Decision-FLR-1 / Decision-HO-1 / Handoff 候補生成 / PR #97 Entry Criteria 初版は完了扱い。
Close ブロッカーから外す。本当のブロッカーは AUD-RET-1 / AUD-WR-1 の人 Accepted。

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
