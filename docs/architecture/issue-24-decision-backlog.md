# Issue #24 Decision Backlog（残Decision整理）

この文書は、PR #85（RSV後残責務再監査）完了後の Issue #24 残 Decision を
**Decision-first** で分類する正本である。

新しい domain 純関数実装は開始しない。
PR #85 の `Next pure unit: NONE` を上書きしない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main: 199217ce2aaf2fec3d47cb7cb1f312c7e9c444d6
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
AuditEvent contract hardening: MERGED（PR #102）
Next audit gate: Persistence Entry Review final rerun
Persistence implementation: HOLD pending final Entry Review PASS + human GO
Issue #24 Close: NO-GO
deploy: NO-GO
SharePoint / M365: 変更なし
```

上位入口:

- [`issue-24-remaining-audit-post-rsv.md`](./issue-24-remaining-audit-post-rsv.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)
- [`domain-reconstruction-foundation.md`](./domain-reconstruction-foundation.md)

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
| FindingIdentity 組立 | Accepted / Start | `5210065336` / `5210078985` |
| finding 再発 | Accepted / Start | `5210206944` / `5210210553` |
| Snapshot Result変換 | Selection / Decision / Start | `5210366943` / `5210389077` / `5210392317` |
| SupportPlan status transition | Accepted | `5211039927` |
| Active 一意性 | Accepted | `5212085136` |
| Observation OP-1/OP-2 | Accepted（ownership 表） | comment ID は ownership 表に未記載 |
| Review due RD-1/RD-2 | Accepted（ownership 表） | comment ID は ownership 表に未記載 |
| RuleSetVersion RSV-1〜4 | Accepted（ownership 表） | comment ID は ownership 表に未記載 |
| Issue #19 / GOV-AUD-01〜10 | 正式回答待ち | — |
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
| **Decision-AUD-ALIGN-1** | #22A write-result / idempotency と persistence contract の整合 | **Accepted**。正本: [`decision-aud-align-1-audit-event-write-result-alignment.md`](./decision-aud-align-1-audit-event-write-result-alignment.md) | Issue `#22A` | PR #99 契約 MERGED 前提 | Persistence 実装は final Entry Review PASS + human GO まで HOLD |
| **Decision-AUD-IDEM-1** | AuditEvent persistence identity / replay | **Accepted**。正本: [`decision-aud-idem-1-audit-event-idempotency.md`](./decision-aud-idem-1-audit-event-idempotency.md) | Issue `#22A` | ALIGN-1 | write envelope + FX-IDEM 表現 |
| **Decision-AUD-SAN-VALUE-1** | AuditEvent value safety（validate+reject） | **Accepted**。正本: [`decision-aud-san-value-1-audit-event-value-safety.md`](./decision-aud-san-value-1-audit-event-value-safety.md) | Issue `#22` / `#27` hardening | ALIGN-1 | hardening MERGED（PR #102）。SAN-1 Accepted |
| **Decision-AUD-SAN-1** | AuditEvent value sanitization / write-boundary 完了判定 | **Accepted**。hardening MERGED（PR #102） | Issue `#27` / `#22` | SAN-VALUE-1 | Persistence Entry Review final rerun → human GO |
| **Decision-SEV-1** | FindingSeverity vocabulary ownership（DEC方式 A/B） | HOLD。`DEC-001〜017` に Severity 正本なし | A: Issue #8 新DEC / B: Issue #27 technical decision | 方式選択前に値一覧を採択しない | 方式 Accepted 後に **Decision-SEV-2** へ進める |
| **Decision-SEV-2** | Severity assignment boundary（値・意味・判定主体） | HOLD。値一覧・domain算出/caller-supplied 未決 | SEV-1 の選択結果に従う | **SEV-1** | 完全 Finding 契約の Severity 欄定義候補（実装は別 Entry Criteria） |
| **Decision-FC-1** | FindingCode catalog ownership | HOLD。Identity 組立は完了。業務カタログ正本なし | Issue #24（部分・カタログは別 Decision）。確定は人の承認 | Identity 組立契約を再定義しない | 所有者確定後に **Decision-FC-2** |
| **Decision-FC-2** | Catalog delivery boundary（固定列挙 vs caller-supplied 外部カタログ） | HOLD。現行組立は caller-supplied `isReasonCode` のみ | FC-1 の所有者 | **FC-1**。採番・写像表の推測禁止 | カタログ契約 docs（domain固定 or 外部）→ 実装は別 Gate |
| **Decision-OP-3** | SupportPlan Schema / 観察期間フィールド・制度日数・開放終端 | HOLD。メンバシップ純関数は完了。フィールド追加・制度日数・`periodTo` 開放終端は未決 | 別 Decision（所有は OP-1 で #24 メンバシップのみ確定。Schema は #26 関連） | OP-1/OP-2 Accepted 済み前提。既存 `evaluateObservationPeriodMembership` を変更しない | Schema/フィールド Decision Accepted 後の契約・（必要なら）別純関数。既存関数への制度値混入禁止 |
| **Decision-RD-3** | 接近窓・制度日数・期限算出・超過後ポリシー | HOLD。asOf 相対判定は完了。接近窓・算出は未決 | 別 Decision（RD-1 で #24 相対判定所有。算出・窓は別） | RD-1/RD-2 Accepted 済み前提。既存 `evaluateReviewDueRelativeToAsOf` を変更しない | 接近判定など別単位の技術契約候補。既存相対判定への窓日数混入禁止 |
| **Decision-AS-EC-1** | AssessmentSnapshot 完全契約 Entry Criteria | HOLD。Result変換のみ完了。保存・DTO・findingIds・確定・訂正・handoff 未了 | Issue #24（完全契約候補）＋ `DEC-009` / `GOV-AUD`（#8/#19） | **DEC-009**、**GOV-AUD**（少なくとも保存・訂正境界）、完全 Finding / findingIds 境界、（必要なら）SEV・FC | Entry Criteria 充足の記録 → 完全契約 docs。**保存実装・Schema・SharePoint は含めない** |

### Snapshot Entry Criteria（整理のみ・実装しない）

`assessment-snapshot-result-design.md` の後続 Entry Criteria を、残 Decision 観点で再掲する。

| # | 条件 | 現状 |
|---|---|---|
| 1 | Result 技術設計が main にある | DONE（設計 + Result変換 PR #72） |
| 2 | 所有 Issue と PR 境界が記録済み | 部分（Result変換は #24。完全契約境界は未固定） |
| 3 | `DEC-009` 保存タイミング Accepted または対象外明示 | **未**（Issue #8/#19） |
| 4 | `GOV-AUD-03` 訂正承認境界 Accepted または application 対象外明示 | **未**（Issue #19） |
| 5 | 完全 Finding または findingIds 参照境界 | **未**（SEV / FC / 完全 Finding 依存） |
| 6 | サービス別 `NOT_APPLICABLE` reason 正本または HOLD 方針 | **未** |
| 7 | Schema ID / schemaVersion / DTO versioning | **未** |
| 8 | 型・validator・合成 fixture・contract tests 計画 | **未**（実装前） |

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
| 正式値 | DEC 台帳に無し。`low`/`medium`/`high` 暗黙採用禁止 | **未決** |
| A/B の意味 | ownership: 方式 A=#8新DEC / B=#27 technical | **方式未選択** |
| 判定主体 | 正本なし | **未決** |
| domain 算出 vs caller-supplied | 正本なし | **未決**（SEV-2） |

### C. FindingCode 業務カタログ（Decision-FC-1 / FC-2）

| 問い | 正本根拠 | 結論 |
|---|---|---|
| コード一覧正本 | Identity 組立は caller-supplied。カタログ無し | **未決** |
| 追加・廃止の所有者 | #24 部分。カタログは別 Decision | **FC-1 待ち** |
| domain 固定列挙 vs 外部 | 現行は caller-supplied | **FC-2 待ち**。現行組立を壊さない |

### D. Handoff 所有（Decision-HO-1）— Accepted

正本: [`decision-ho-1-handoff-transition-ownership.md`](./decision-ho-1-handoff-transition-ownership.md)

| 問い | 正本根拠 | 結論 |
|---|---|---|
| transition 所有 Issue | Decision-HO-1 Accepted | **Issue #17** |
| #24 自動割当 | 禁止方針維持のまま #17 を明示 Accepted | 自動割当は行っていない |
| 許可辺 | Decision-HO-EDGE-1 | Accepted（#17） |
| 実装（遷移〜候補） | PR #90 / #91 / #93 / #96 | **MERGED** |
| AuditEvent 実保存 | Entry Criteria | **HOLD**（`GOV-AUD-06` / `DEC-011` + 書込先所有） |

### E. OP-3 / RD-3

| Decision | 完了済み（触らない） | 残 |
|---|---|---|
| OP-3 | `evaluateObservationPeriodMembership` | SupportPlan/SP 列、制度日数、開放終端（現行は `periodTo` 必須） |
| RD-3 | `evaluateReviewDueRelativeToAsOf` | 接近窓、制度日数、期限算出、超過後ポリシー |

### F. AssessmentSnapshot Entry Criteria（Decision-AS-EC-1）

Result変換は完了。完全契約へ進める条件は上記 Entry Criteria 表。
`DEC-009` / `GOV-AUD` 回答、Finding 境界、Schema/DTO が揃うまで保存・DTO・SharePoint 実装はしない。

## 推奨承認順

監査結果と矛盾しない推奨順（依存がある場合は依存を先）:

```text
1. Decision-FLR-1   Finding reopen policy — Accepted（実装 NONE / PR #88 MERGED）
2. Decision-HO-1    Handoff transition ownership — Accepted（#17）。実装系列 MERGED
3. Decision-AUD-ALIGN-1  #22A write-result / idempotency 整合 — Accepted
4. Decision-AUD-IDEM-1 / AUD-SAN-VALUE-1 / AUD-SAN-1 — Accepted。hardening MERGED（PR #102）
5. Decision-SEV-1   FindingSeverity vocabulary ownership（A/B）
6. Decision-SEV-2   Severity assignment boundary（SEV-1 後）
7. Decision-FC-1    FindingCode catalog ownership
8. Decision-FC-2    Catalog delivery boundary（FC-1 後）
9. Decision-OP-3    Observation period Schema / 制度 / 開放終端
10. Decision-RD-3    Review due 接近窓 / 算出 / 超過後
11. Decision-AS-EC-1 AssessmentSnapshot Entry Criteria（DEC-009 / GOV-AUD / Finding 境界後）
```

注: Persistence technical contract は MERGED（PR #99）。ALIGN/IDEM/SAN-VALUE/SAN-1 は Accepted。hardening MERGED（PR #102）。
**次工程は Persistence Entry Review final rerun**。実保存コードはまだ開始しない。
SEV は SEV-1→SEV-2、FC は FC-1→FC-2 の順を崩さない。
AS-EC-1 は DEC-009 / GOV-AUD / Finding 境界が先。
final Entry Review PASS + human GO なしに persistence 実装を始めない。
## Phase 4 — 次の安全な純関数単位

```text
Next Handoff domain unit: NONE（候補まで MERGED）
Persistence technical contract: MERGED（PR #99）
Decision-AUD-ALIGN-1 / IDEM-1 / SAN-VALUE-1 / SAN-1: Accepted
AuditEvent contract hardening: MERGED（PR #102）
Next gate: Persistence Entry Review final rerun
Implementation Start (AuditEvent 実保存): HOLD pending final Entry Review PASS + human GO
```

判定理由:

1. AUD-RET-1 / AUD-WR-1 / ALIGN-1 / IDEM-1 / SAN-VALUE-1 / SAN-1 Accepted。技術契約 PR #99 MERGED。hardening PR #102 MERGED
2. 実装前の本当の次工程は **Persistence Entry Review final rerun**
3. Decision Accepted / hardening MERGED ≠ implementation GO
4. SharePoint / Microsoft 365 / deploy は NO-GO

正本: [`decision-aud-san-value-1-audit-event-value-safety.md`](./decision-aud-san-value-1-audit-event-value-safety.md)

## OUT / 混ぜないもの

- `src/**` / `tests/**` 変更
- 新しい domain 純関数実装（本 docs PR）
- 未承認の業務ルール推測
- AuditLog 保存期間・書込先の推測採択
- FindingSeverity 値の暗黙採択 / FindingCode 捏造
- 既存許可3辺・完了済み純関数の再オープン改変
- OP-3/RD-3 の制度値を既存メンバシップ/相対判定へ混入
- Snapshot 保存・DTO・SharePoint / SPFx / Schema / M365 / Deploy
- Issue #24 Close
- Decision の一括 Accepted 前提
- AuditEvent 実保存 / SharePoint adapter

## Gate

```text
Decision backlog 整理: READY（docs-only）
PR #99: MERGED
PR #102: MERGED
Persistence technical contract: MERGED
Decision-AUD-ALIGN-1: Accepted
Decision-AUD-IDEM-1: Accepted
Decision-AUD-SAN-VALUE-1: Accepted
Decision-AUD-SAN-1: Accepted
AuditEvent contract hardening: MERGED（PR #102）
Next: Persistence Entry Review final rerun
Implementation Start (AuditEvent 実保存): HOLD pending final Entry Review PASS + human GO
Issue #24 Close: NO-GO
SharePoint / Entra ID / Microsoft 365: NO-GO
Deploy: NO-GO
Ready / Merge（本PR）: 人の事前承認待ち（エージェントは実行しない）
```

## 本 PR（docs-only）の役割

```text
1. SAN-1 Accepted / hardening MERGED を current-state 正本へ反映する
2. 次工程を Persistence Entry Review final rerun として固定する
3. 実保存コードへ進まない
4. Persistence implementation GO を出さない
5. src/** / tests/** は変更しない
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
