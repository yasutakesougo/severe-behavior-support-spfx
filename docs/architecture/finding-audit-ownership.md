# Finding・監査関連の所有境界

この文書は、Finding、AssessmentSnapshot、Handoff、AuditEvent、訂正・削除に関する
所有IssueとDecision分類の正本入口である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main before this canonicalization: 2751f421e1ced3bd28b4734eb964e49f1eff95c6
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
AuditEvent persistence contract（PR #99 MERGED）: docs/architecture/audit-event-persistence-contract.md
Alignment / next gate: docs/architecture/audit-event-persistence-22a-alignment-gate.md
Next: Persistence Entry Review final rerun
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
| Handoff AuditEvent candidate | Issue #17 / `5215557663` | PR #96 MERGED。正本 `handoff-audit-event.md` | 候補完了。実保存は HOLD |
| AuditEvent 実保存 | #22A（AUD-WR-1 Accepted） | 技術契約 MERGED（PR #99）。ALIGN/IDEM/SAN-VALUE/SAN-1 Accepted。hardening MERGED（PR #102）。次: Persistence Entry Review final rerun | final Entry Review PASS + human GO まで実装 HOLD |
| Finding lifecycle transition | Issue #24 | C0 `5209785751` / 技術契約 `finding-lifecycle-transition.md` | PR-D完了（PR #64） |
| finding生成条件 | Issue #24 | 技術契約 `finding-generation-conditions.md`（eligibility only） | PR-E完了（PR #65） |
| finding安定ID生成 | Issue #24 | 技術契約 `finding-stable-id.md` / CONDITIONAL GO `5205731811` | PR-C完了（PR #55） |
| FindingCode写像・Identity組立（狭域） | Issue #24 | Decision `5210065336` / Implementation Start `5210078985` / 技術契約 `finding-identity-assembly.md` | PR-F完了（PR #66） |
| finding再発判定 | Issue #24 | Decision `5210206944`（Q1-C/Q2-A/Q3-A/Q4-A） / 技術契約 `finding-recurrence.md` | PR-G完了（PR #67） |
| AssessmentSnapshot Result変換（狭域・永続なし） | Issue #24 | Selection `5210366943` / Decision `5210389077` / Implementation Start `5210392317` / 技術契約 `assessment-snapshot-result-conversion.md` | PR-H完了（PR #72） |
| AssessmentSnapshot候補生成・完全契約 | Issue #24 | Result変換（永続なし）は上記。保存・findingIds・DTOは未了 | 完全契約までHOLD（DEC-009 / GOV-AUD） |
| SupportPlan status transition（狭域・ロールなし） | Issue #24 | Accepted `5211039927` / 技術契約 `support-plan-status-transition.md` / 許可5辺 | PR-I完了（PR #73 / #74） |
| Active計画一意性 | Issue #24 | Accepted `5212085136` / 技術契約 `active-plan-uniqueness.md` | 完了（PR #76 / #78） |
| 観察期間メンバシップ | Issue #24 | OP-1/OP-2 Accepted / 技術契約 `observation-period.md` | 完了（PR #79 / #80）。OP-3フィールド追加はHOLD |
| 見直し期限 asOf 相対判定 | Issue #24 | RD-1/RD-2 Accepted / 技術契約 `review-due.md` | 完了（PR #81 / #82）。RD-3接近窓はHOLD |
| RuleSetVersion選択 | Issue #24 | RSV-1〜4 Accepted / 技術契約 `ruleset-version-selection.md` | 完了（PR #83 / #84） |
| 訂正・削除・監査ログ・復旧の運用設計 | Issue #17 | 設計案あり | `GOV-AUD`回答待ち |
| `GOV-AUD-01〜10`回答 | Issue #19 | 回答正本 | 正式回答待ち |
| DEC正本台帳 | Issue #8 | `DEC-001〜017` | Deferred項目はHOLD |
| 許可フィールド値のサニタイズ | Issue #22または新規audit-write-boundary / Decision-AUD-SAN-VALUE-1 | 値契約 Accepted（[`decision-aud-san-value-1-audit-event-value-safety.md`](./decision-aud-san-value-1-audit-event-value-safety.md)）。`validateAuditEvent` hardening MERGED（PR #102） | Decision-AUD-SAN-1 Accepted。Persistence は final Entry Review + human GO まで HOLD |

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
| `DEC-009` | AssessmentSnapshotの保存タイミング | Issue #8 / Issue #19 |
| `GOV-AUD-01` | handoffの正本 | Issue #19 |
| `GOV-AUD-02` | handoff状態変更ロール | Issue #19 |
| `GOV-AUD-03` | Snapshot訂正承認者 | Issue #19 |
| `GOV-AUD-04` | 論理削除を許可するロール | Issue #19 |
| `GOV-AUD-05` | 物理削除方針 | Issue #19 |
| `GOV-AUD-06` / `DEC-011` | AuditLog・業務データの保存期間 | Issue #19 / Issue #8 |
| `DEC-012` | 論理削除データの完全削除方針 | Issue #8 |
| `DEC-015` | バックアップ・復元責任者 | Issue #8 |

正式回答前に、具体ロール、保存期間、物理削除手順をコードへ埋め込まない。

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
実装前次工程: [`audit-event-persistence-22a-alignment-gate.md`](./audit-event-persistence-22a-alignment-gate.md)。

## FindingSeverity Decision

FindingSeverityの正本DecisionはIssue #8の`DEC-001〜017`に存在しない。
次のいずれかを明示的に選択する。

```text
A:
Issue #8へ新しいDECを追加する。

B:
Issue #27配下のtechnical decisionとして固定する。
```

方式の選択前に値一覧を採択しない。
`low`、`medium`、`high`等を暗黙の正本として使用しない。

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

次は完了扱いにしない。

- 許可済み文字列フィールドの値サニタイズ
- `actionCode`最終enum（`HANDOFF_STATUS_CHANGED` は Issue #17 / `5215557663` で Accepted。全体 enum は未了）
- AuditLog保存期間（`GOV-AUD-06` / `DEC-011`）
- adapter・SharePointへの書込み（実保存 Entry Criteria 未充足）

値サニタイズはIssue #22または新規audit-write-boundaryで扱う。
実保存前提: [`audit-event-persistence-entry-criteria.md`](./audit-event-persistence-entry-criteria.md)。

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

PR-I以降（支援計画系純粋ルール・完了）:
Active一意性（#76/#78）、観察期間（#79/#80）、見直し期限（#81/#82）、
RuleSetVersion選択（#83/#84）。再監査: [`issue-24-remaining-audit-post-rsv.md`](./issue-24-remaining-audit-post-rsv.md)。

PR-I以降（Handoff・完了）:
Decision-HO-1 Accepted（#17）、遷移 PR #90、ロール PR #91、mutation PR #93、
AuditEvent candidate PR #96（`HANDOFF_STATUS_CHANGED` / `5215557663`）。
実保存は技術契約 MERGED（PR #99）。実装前は
[`audit-event-persistence-22a-alignment-gate.md`](./audit-event-persistence-22a-alignment-gate.md)。

PR-I以降（未割当・HOLD）:
Severity、完全Finding、
AssessmentSnapshot完全契約、audit write boundary（保存期間・書込先所有）、
FindingCode 業務カタログ、
Decision-OP-3 / Decision-RD-3。
Decision-FLR-1（Finding 再オープン）は Accepted（不許可・実装 NONE）。
正本: [`decision-flr-1-finding-reopen-policy.md`](./decision-flr-1-finding-reopen-policy.md)。
残 Decision 分類正本: [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
（Issue #24 系 Next pure unit は別。Audit 実保存実装は #22A 整合 Gate HOLD）
```

注: AssessmentSnapshot 完全契約の Entry Criteria 文書上の古い「PR-G」表記は、
本所有表の PR 字母とずれる。完全契約実装は別 Entry Criteria に従う。

PR-BはPR-Aマージ後を推奨する。
PR-C以降は、それぞれの所有Issue、Decision、Entry Criteriaを記録してから開始する。
PR-I候補の支援計画遷移は、Issue #24所有表への自動割当を行わず Decision を待つ。

## 継続HOLD

- FindingSeverityのDecision方式と値一覧
- 完全なFinding契約
- FindingCode 業務カタログ
- AssessmentSnapshot完全契約と保存運用（Result変換・永続なしは `assessment-snapshot-result-conversion.md`）
- finding再発の複数prior探索・永続照会（単一 prior 受け取り判定は `finding-recurrence.md`）
- Decision-OP-3（観察期間フィールド追加） / Decision-RD-3（接近窓ポリシー）
- handoff実行ロールの法人最終確定（`GOV-AUD-02` / #19。ポリシー純関数は PR #91 MERGED）
- 訂正承認、論理削除、物理削除
- `AuditEvent.actionCode`最終enum（`HANDOFF_STATUS_CHANGED` は Accepted）
- AuditLog保存期間（Decision-AUD-RET-1 **Accepted**。cleanup / 物理削除は別）
- AuditEvent 実保存実装（契約 MERGED。次 Gate: [`audit-event-persistence-22a-alignment-gate.md`](./audit-event-persistence-22a-alignment-gate.md)）
- 許可フィールド値のサニタイズ
- SharePoint、Entra ID、Microsoft 365、deploy

Decision-HO-1（Handoff 遷移所有）は Accepted（#17）。
Decision-FLR-1（Finding 再オープン）は Accepted（不許可・実装 NONE）。
Decision-AUD-RET-1 / AUD-WR-1 は Accepted。
正本: [`decision-ho-1-handoff-transition-ownership.md`](./decision-ho-1-handoff-transition-ownership.md)、
[`decision-flr-1-finding-reopen-policy.md`](./decision-flr-1-finding-reopen-policy.md)、
[`decision-aud-ret-1-auditlog-retention.md`](./decision-aud-ret-1-auditlog-retention.md)、
[`decision-aud-wr-1-audit-write-ownership.md`](./decision-aud-wr-1-audit-write-ownership.md)。

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
```
