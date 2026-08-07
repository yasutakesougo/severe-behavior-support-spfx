# Finding・監査関連の所有境界

この文書は、Finding、AssessmentSnapshot、Handoff、AuditEvent、訂正・削除に関する
所有IssueとDecision分類の正本入口である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main: 1c97fe78b5dc653217fca4fec83f0666351f7f0e
PR #41: MERGED
Issue #27 ownership comment: 5204763504
Issue #24 ownership comment: 5204768249
Issue #17 ownership comment: 5204771950
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
| handoff運用設計・状態グラフ案 | Issue #17 | 案あり | 正式化までHOLD |
| Handoff状態遷移関数 | 未確定 | Issue #24へ自動割当しない | 所有指定までHOLD |
| Finding lifecycle transition | Issue #24 | C0 `5209785751` / 技術契約 `finding-lifecycle-transition.md` | Implementation Start GO（承認範囲のみ） |
| finding生成条件 | Issue #24 | 技術契約 `finding-generation-conditions.md`（eligibility only） | Implementation Start GO（承認範囲のみ） |
| finding安定ID生成 | Issue #24 | 技術契約 `finding-stable-id.md` / CONDITIONAL GO `5205731811` | PR-C完了 |
| FindingCode写像・Identity組立（狭域） | Issue #24 | Decision `5210065336` / Implementation Start `5210078985` / 技術契約 `finding-identity-assembly.md` | PR-F完了（PR #66） |
| finding再発判定 | Issue #24 | Decision `5210206944`（Q1-C/Q2-A/Q3-A/Q4-A） / Implementation Start `5210210553` / 技術契約 `finding-recurrence.md` | Implementation Start GO（承認範囲のみ） |
| AssessmentSnapshot候補生成 | Issue #24 | 本文で所有を明示 | 完全契約までHOLD |
| 訂正・削除・監査ログ・復旧の運用設計 | Issue #17 | 設計案あり | `GOV-AUD`回答待ち |
| `GOV-AUD-01〜10`回答 | Issue #19 | 回答正本 | 正式回答待ち |
| DEC正本台帳 | Issue #8 | `DEC-001〜017` | Deferred項目はHOLD |
| 許可フィールド値のサニタイズ | Issue #22または新規audit-write-boundary | 所有候補 | adapter・書込境界までHOLD |

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
再オープン、Severity、完全Finding、再発、Snapshot、Handoff は対象外。

#### Handoff状態遷移関数

```text
not_required
pending
included
acknowledged
closed
```

状態型はIssue #27、運用設計と状態グラフ案はIssue #17にある。
遷移関数をIssue #24へ自動割当しない。
純粋遷移と`GOV-AUD-02`に依存する権限判定を分離する。

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
- `actionCode`最終enum
- AuditLog保存期間
- adapter・SharePointへの書込み

値サニタイズはIssue #22または新規audit-write-boundaryで扱う。

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

PR-H以降:
Handoff transition、Severity、完全Finding、
AssessmentSnapshot契約、audit write boundary
```

注: AssessmentSnapshot 完全契約の Entry Criteria 文書上の「PR-G」表記は、
本所有表の PR 字母とずれる場合がある。AssessmentSnapshot 実装は別 Entry Criteria に従う。

PR-BはPR-Aマージ後を推奨する。
PR-C以降は、それぞれの所有Issue、Decision、Entry Criteriaを記録してから開始する。

## 継続HOLD

- Handoff状態遷移関数の所有Issue
- FindingSeverityのDecision方式と値一覧
- 完全なFinding契約
- AssessmentSnapshot完全契約と保存運用
- finding再発の複数prior探索・永続照会（単一 prior 受け取り判定は `finding-recurrence.md`）
- handoff実行ロール
- 訂正承認、論理削除、物理削除
- `AuditEvent.actionCode`最終enum
- AuditLog保存期間
- 許可フィールド値のサニタイズ
- SharePoint、Entra ID、Microsoft 365、deploy

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
```
