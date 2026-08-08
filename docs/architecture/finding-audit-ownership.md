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
Decision-SEV-2-CONCEPT-INV（COMPLETED / OFFICIAL_CONCEPT_EXISTS）: docs/architecture/decision-sev-2-concept-inv.md
Decision-SEV-2-VOCAB（HOLD / V-C）: docs/architecture/decision-sev-2-vocab-hold.md
Decision-SEV-2 packet（ASSIGN は CANDIDATE）: docs/architecture/decision-sev-2-finding-severity-boundary.md
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
| AssessmentSnapshot候補生成・完全契約 | Issue #24 | Result変換（永続なし）は上記。保存・findingIds・DTOは未了 | 完全契約までHOLD（DEC-009 / GOV-AUD） |
| SupportPlan status transition（狭域・ロールなし） | Issue #24 | Accepted `5211039927` / 技術契約 `support-plan-status-transition.md` / 許可5辺 | PR-I完了（PR #73 / #74） |
| Active計画一意性 | Issue #24 | Accepted `5212085136` / 技術契約 `active-plan-uniqueness.md` | 完了（PR #76 / #78） |
| 観察期間メンバシップ | Issue #24 | OP-1/OP-2 Accepted / 技術契約 `observation-period.md` | 完了（PR #79 / #80）。OP-3フィールド追加はHOLD |
| 見直し期限 asOf 相対判定 | Issue #24 | RD-1/RD-2 Accepted / 技術契約 `review-due.md` | 完了（PR #81 / #82）。RD-3接近窓はHOLD |
| RuleSetVersion選択 | Issue #24 | RSV-1〜4 Accepted / 技術契約 `ruleset-version-selection.md` | 完了（PR #83 / #84） |
| 訂正・削除・監査ログ・復旧の運用設計 | Issue #17 | 設計案あり | `GOV-AUD`回答待ち |
| `GOV-AUD-01〜10`回答 | Issue #19 | 回答正本 | 正式回答待ち |
| DEC正本台帳 | Issue #8 | `DEC-001〜017` + FindingSeverity ownership は Decision-SEV-1 Accepted（Option A / 新 DEC・番号 UNASSIGNED）。PURPOSE は MHLW-first RECORDED。値は SEV-2-VOCAB HOLD |
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

`DEC-001〜017` に Severity 値正本は未だ無い。Issue #8 新規 DEC 番号は **UNASSIGNED**。
値一覧・意味・assignment は Decision-SEV-2 packet（Candidate）で **分離**して扱う。

```text
Decision-SEV-2 packet: OPEN（単位別）
SEV-2-PURPOSE: RECORDED（MHLW-first / decision-sev-2-purpose-source.md）
SEV-2-CONCEPT-INV: COMPLETED / OFFICIAL_CONCEPT_EXISTS（decision-sev-2-concept-inv.md）
  Official concept: 行動関連項目合計点数
  Generic severity taxonomy: NOT FOUND
SEV-2-VOCAB: HOLD / V-C（decision-sev-2-vocab-hold.md）
  Formal values / Meanings / Ordering: NOT DEFINED
SEV-2-ASSIGN: CANDIDATE / NOT ACCEPTED
Implementation: NOT STARTED
正本: decision-sev-2-finding-severity-boundary.md
```

方式 Accepted 後も、値一覧の暗黙採択は禁止する。
`low`、`medium`、`high`等を暗黙の正本として使用しない。
ローカル発明の severity taxonomy は FORBIDDEN。
`"10+"` / `"18+"` を FindingSeverity 値として即時採択しない。
次は Human SEV-2-VOCAB 再評価（Option A 不採用が強い候補・未 Accepted）。
正式概念が無い場合ではなく、汎用 Severity として採択する根拠が無い場合も
FindingSeverity 自体の削除・不採用候補とする。

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
Decision-SEV-2-ASSIGN（CANDIDATE）、完全Finding、
AssessmentSnapshot完全契約、
FindingCode 業務カタログ、
Decision-OP-3 / Decision-RD-3。
Decision-SEV-1（FindingSeverity ownership）は Accepted（Option A / Issue #8 新 DEC）。
Decision-SEV-2-PURPOSE は RECORDED（MHLW-first）。
Decision-SEV-2-CONCEPT-INV は COMPLETED / OFFICIAL_CONCEPT_EXISTS。
Decision-SEV-2-VOCAB は HOLD / V-C（値 NOT DEFINED）。
Decision-FLR-1（Finding 再オープン）は Accepted（不許可・実装 NONE）。
AUD-RET-1 / AUD-WR-1 / value safety / hardening / REPLAY-1 / REPO-1 Decision は Accepted（DONE）。
Replay logical は MERGED（PR #106）。
`#22B` synthetic MERGED（PR #110 / 62a43d7f…）。SharePoint 実環境 / M365 / Deploy は継続 NO-GO（別 Gate）。
正本: [`decision-sev-1-finding-severity-vocabulary-ownership.md`](./decision-sev-1-finding-severity-vocabulary-ownership.md)、
[`decision-sev-2-purpose-source.md`](./decision-sev-2-purpose-source.md)、
[`decision-sev-2-concept-inv.md`](./decision-sev-2-concept-inv.md)、
[`decision-sev-2-vocab-hold.md`](./decision-sev-2-vocab-hold.md)、
[`decision-sev-2-finding-severity-boundary.md`](./decision-sev-2-finding-severity-boundary.md)、
[`decision-flr-1-finding-reopen-policy.md`](./decision-flr-1-finding-reopen-policy.md)。
残 Decision 分類正本: [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
（Issue #24 系 Next pure unit は別。SEV Implementation NOT STARTED）
```

注: AssessmentSnapshot 完全契約の Entry Criteria 文書上の古い「PR-G」表記は、
本所有表の PR 字母とずれる。完全契約実装は別 Entry Criteria に従う。

PR-BはPR-Aマージ後を推奨する。
PR-C以降は、それぞれの所有Issue、Decision、Entry Criteriaを記録してから開始する。
PR-I候補の支援計画遷移は、Issue #24所有表への自動割当を行わず Decision を待つ。

## 継続HOLD

- FindingSeverity 正式値・意味は SEV-2-VOCAB **HOLD / V-C**（NOT DEFINED）。purpose source は SEV-2-PURPOSE RECORDED（MHLW-first）。CONCEPT-INV は COMPLETED（行動関連項目合計点数。汎用 Severity NOT FOUND）。assignment 境界（SEV-2-ASSIGN）は CANDIDATE。ownership は Decision-SEV-1 Accepted
- 完全なFinding契約
- FindingCode 業務カタログ
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
