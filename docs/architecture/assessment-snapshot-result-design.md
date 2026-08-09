# AssessmentSnapshot Result 技術設計

この文書は、`AssessmentSnapshot`の永続Resultに関する技術設計を固定する。

保存タイミング、保存・確定ロール、訂正承認、handoff連携は法人・運用Decisionとして分離し、本書では決定しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
base main: 7513b21cf0bcac855a25a24f90668881df04b46a
ownership: docs/architecture/finding-audit-ownership.md
contract parent: Issue #27
snapshot candidate owner: Issue #24
save timing: DEC-009 / Issue #19
correction approval: GOV-AUD-03 / Issue #19
```

## 現行EvaluationDecision

現行domainの評価結果は次である。

```text
NO_FINDINGS
FINDINGS_PRESENT
INDETERMINATE
NOT_APPLICABLE
SOURCE_UNAVAILABLE
```

`EvaluationDecision`は評価実行時の判定結果であり、永続化可能性を表す型ではない。

- `INDETERMINATE`は、入力不足、確認待ち、期限切れ、未承認等を含む。
- `SOURCE_UNAVAILABLE`は、実行失敗またはsource取得不能を含む。
- これらを確定済みAssessmentSnapshotとして保存すると、未確定状態や障害状態を正式な判定履歴と誤認する危険がある。

## 決定概要

```text
Q1. EvaluationDecisionと永続Resultは別型とする。
Q2. 変換責任はdomain純粋関数へ置く。
Q3. SOURCE_UNAVAILABLEはAssessmentSnapshotへ保存しない。
Q4. INDETERMINATEは保存しない。NOT_APPLICABLEは条件付きで保存できる。
Q5. NOT_APPLICABLEではreasonCodesを1件以上必須とする。
Q6. demo / retrieval_failedは正式Resultへ含めず、validatorと書込境界で拒否する。
Q7. 訂正は元Snapshotを変更せず、完全な置換SnapshotとSnapshotCorrectionで表す。
```

## Q1. EvaluationDecisionと永続Result

永続Resultは`EvaluationDecision`を直接再利用せず、別の正本型とする。

後続コード実装では、次の値だけを候補とする。

```text
AssessmentSnapshotResult:
NO_FINDINGS
FINDINGS_PRESENT
NOT_APPLICABLE
```

同じ文字列値を含む場合でも、`EvaluationDecision`と`AssessmentSnapshotResult`は別の責務を持つ。

```text
EvaluationDecision:
評価実行の結果を表す。
未確定・障害状態を含む。

AssessmentSnapshotResult:
確定履歴として永続化できる結果だけを表す。
未確定・障害状態を含めない。
```

この分離により、`EvaluationDecision`へ将来値を追加しても、自動的に永続Resultへ流入しない。

## Q2. 変換責任

`EvaluationDecision`から永続Result候補への変換は、domain純粋関数が所有する。

```text
推奨所有:
src/domain配下の純粋関数

含めないもの:
業務ロール判定
保存タイミング
SharePoint通信
DTO変換
監査ログ書込み
```

後続実装の概念形は次とする。

```text
EvaluationDecision
    ↓ domain純粋変換
PERSISTABLE(result)
または
NOT_PERSISTABLE(reason)
```

application層はDEC-009と業務フローに基づき、変換済み候補を保存するか判断する。

adapter層は、保存を許可された完全なSnapshotだけをシリアライズする。

adapterが`INDETERMINATE`や`SOURCE_UNAVAILABLE`を別のResultへ変換してはならない。

## Q3. SOURCE_UNAVAILABLEの永続可否

`SOURCE_UNAVAILABLE`はAssessmentSnapshotへ保存しない。

理由:

- source取得失敗・実行失敗は確定した支援判定ではない。
- Issue #24は取得失敗・算定不能時にSnapshot候補生成を停止する責務を持つ。
- 障害状態を正式な判定履歴へ保存すると、再取得後の正式結果と同列に見える。
- 障害証跡は`AuditEvent`、correlation ID、実行エラー情報で追跡する。

```text
EvaluationDecision = SOURCE_UNAVAILABLE
→ Snapshot candidate: NOT_PERSISTABLE
→ Audit / operation evidence: 記録対象
```

`SOURCE_UNAVAILABLE`を`NO_FINDINGS`、`NOT_APPLICABLE`、`INDETERMINATE`へ変換しない。

## Q4. INDETERMINATE / NOT_APPLICABLEの永続可否

### INDETERMINATE

`INDETERMINATE`はAssessmentSnapshotへ保存しない。

`INDETERMINATE`には次のような未確定状態が含まれる。

```text
入力不足
資料未確認
資料期限切れ
承認待ち
criteria不正
矛盾状態
```

これらは修正・確認後に新しい評価を実行し、確定可能なResultを得る。

```text
EvaluationDecision = INDETERMINATE
→ Snapshot candidate: NOT_PERSISTABLE
```

### NOT_APPLICABLE

`NOT_APPLICABLE`は、規則・サービス・判定そのものが正式に適用外である場合に限り保存できる。

次を`NOT_APPLICABLE`へ変換してはならない。

```text
点数未確認
根拠資料欠損
取得失敗
期限切れ
算定不能
承認待ち
```

保存する場合は、適用外の根拠を`reasonCodes`で保持する。

サービス別の正式reason code enumは別Decisionであり、本書では値一覧を採択しない。

## Q5. reasonCodes必須条件

後続契約では、`reasonCodes`を配列として保持する設計を推奨する。

| Result | reasonCodes | 補足 |
|---|---|---|
| `NO_FINDINGS` | 0件以上 | 通常は空。結果根拠はinput snapshotとruleSetVersionで追跡する |
| `FINDINGS_PRESENT` | 0件以上 | finding IDsが主要な結果証跡。追加理由がある場合だけ保持する |
| `NOT_APPLICABLE` | **1件以上必須** | 適用外理由を欠損させない |

共通条件:

- 各reason codeは非空の大文字コード形式とする。
- 重複reason codeは正規化時に除外する。
- 自由記述本文をreason codeへ格納しない。
- サービス別reason code正本が未確定な間は、完全契約実装をHOLDする。

## Q6. demo / retrieval_failedの扱い

### demo

`demo`は評価結果ではなく、データの出所・環境区分である。

- 正式Result enumへ含めない。
- production用AssessmentSnapshotのResultとして拒否する。
- 完全合成fixtureでもResultは正式な3値を使用する。
- demo・syntheticの判定が必要な場合は、Resultとは別のprovenance境界で扱う。

### retrieval_failed

`retrieval_failed`はtransport・source取得の失敗状態であり、確定結果ではない。

- 正式Result enumへ含めない。
- `EvaluationDecision`では`SOURCE_UNAVAILABLE`として扱う。
- AssessmentSnapshot候補を生成しない。
- `AuditEvent`等へcorrelation IDとreason codeを記録する。

### 拒否境界

後続実装では、少なくとも次で拒否する。

```text
domain validator:
未知Result、demo、retrieval_failedを拒否

DTO / adapter write boundary:
validator未通過のSnapshotを書き込まない

read boundary:
保存済みデータの未知Resultを正常値へ補正せず、malformedとして扱う
```

未知値を`INDETERMINATE`や`NOT_APPLICABLE`へ自動変換しない。

## Q7. SnapshotCorrectionとの関係

保存済みAssessmentSnapshotは不変とする。

Result、reasonCodes、input snapshot、finding IDs等を訂正する場合は、元Snapshotを更新せず、完全な置換Snapshotを新規作成する。

```text
original AssessmentSnapshot
    ↓ 保持
replacement AssessmentSnapshot
    ↓ 新規作成
SnapshotCorrection
    ↓ original / replacement / reason / actor / timestampを関連付け
```

`SnapshotCorrection`は関係メタデータであり、元Snapshotへのfield patchではない。

- `originalSnapshotId`と`replacementSnapshotId`は異なる。
- replacementは単独でも完全なAssessmentSnapshotとして検証可能である。
- 通常表示で最新版を選択する責任はapplication・read model側に置く。
- 訂正承認者は`GOV-AUD-03` Accepted / Option E（当面 application 層対象外 / ロール NOT DEFINED）。本書の訂正モデル自体は維持する。正本: [`decision-gov-aud-03-snapshot-correction-approver-acceptance.md`](./decision-gov-aud-03-snapshot-correction-approver-acceptance.md)。
- 物理削除や元Snapshotの上書きを訂正として扱わない。

## Result変換表

| EvaluationDecision | Snapshot候補 | 永続Result | 必須条件・証跡 |
|---|---|---|---|
| `NO_FINDINGS` | `PERSISTABLE` | `NO_FINDINGS` | 完全なinput snapshot、ruleSetVersion、対象期間 |
| `FINDINGS_PRESENT` | `PERSISTABLE` | `FINDINGS_PRESENT` | finding IDs、完全なinput snapshot、ruleSetVersion |
| `NOT_APPLICABLE` | 条件付き`PERSISTABLE` | `NOT_APPLICABLE` | `reasonCodes` 1件以上 |
| `INDETERMINATE` | `NOT_PERSISTABLE` | なし | 不足・未確認・矛盾を解消後に再評価 |
| `SOURCE_UNAVAILABLE` | `NOT_PERSISTABLE` | なし | AuditEvent / correlation IDで障害証跡を保持 |

この表は保存タイミングを決めない。

`PERSISTABLE`は技術的にSnapshot候補を構成可能であることだけを意味し、実際に保存してよいことを意味しない。

## 技術設計と法人運用Decisionの分離

### 本書で固定する事項

- Resultを`EvaluationDecision`と別型にする。
- 永続可能Resultを3値に限定する。
- domain純粋変換を設ける。
- `INDETERMINATE`と`SOURCE_UNAVAILABLE`を保存しない。
- `NOT_APPLICABLE`へreasonCodesを必須化する。
- demo・retrieval_failedを正式Resultへ含めない。
- 訂正時に元Snapshotを不変保持する。

### 本書で決めない事項

| 項目 | Decision / 正本 |
|---|---|
| いつ保存するか | `DEC-009` / Issue #8・#19 |
| 誰が保存・確定するか | `GOV-AUD` / Issue #19 |
| 誰が訂正を承認するか | `GOV-AUD-03` Accepted / Option E（application 対象外 / ロール NOT DEFINED） |
| handoffへいつ渡すか | Issue #17・#19 |
| SharePoint列・DTO mapping | adapter設計 / DEC-6 |
| 保存期間・完全削除 | `DEC-011`・`DEC-012` |

## 後続 Entry Criteria（完全契約実装 / PR-J）

AssessmentSnapshot完全契約のコード実装へ進む前に、次を満たす。

```text
1. 本技術設計がmainへマージ済み（**PASS / MET** — PR #51 / #72。監査 [`decision-as-ec-1-entry-1-2-read-only-consistency-audit.md`](./decision-as-ec-1-entry-1-2-read-only-consistency-audit.md)）
2. AssessmentSnapshotの所有IssueとPR境界が記録済み（**PASS / MET** — 所有 Issue #24 / 完全契約実装 **PR-J** 専用独立。正本 [`decision-as-ec-1-entry-2-ownership-pr-boundary-acceptance.md`](./decision-as-ec-1-entry-2-ownership-pr-boundary-acceptance.md) / [`assessment-snapshot-complete-contract-pr-boundary.md`](./assessment-snapshot-complete-contract-pr-boundary.md)）
3. DEC-009の保存タイミングがAcceptedまたは実装対象外として明示済み（**DONE** — Option A / LOCKED）
4. GOV-AUD-03の訂正承認境界がAcceptedまたはapplication層対象外として明示済み（**DONE** — Option E / application 対象外）
5. 完全なFinding契約またはfindingIds参照境界が確定済み（**PASS / MET** — findingIds **NOT REQUIRED**。正本 [`decision-as-ec-1-entry-5-finding-ids-boundary-acceptance.md`](./decision-as-ec-1-entry-5-finding-ids-boundary-acceptance.md) / [`assessment-snapshot-finding-ids-boundary.md`](./assessment-snapshot-finding-ids-boundary.md)）
6. サービス別NOT_APPLICABLE reason codeの正本またはHOLD方針が確定済み（**PASS / MET** — HOLD方針 = サービス別正本は今採択しない。正本 [`decision-as-ec-1-entry-6-not-applicable-reason-acceptance.md`](./decision-as-ec-1-entry-6-not-applicable-reason-acceptance.md) / [`assessment-snapshot-not-applicable-reason-hold.md`](./assessment-snapshot-not-applicable-reason-hold.md)）
7. Schema ID・schemaVersion・DTO versioning方針が確定済み（**PASS / MET** — DEC-1 準拠；固有 Schema ID 採番は今しない。正本 [`decision-as-ec-1-entry-7-schema-dto-versioning-acceptance.md`](./decision-as-ec-1-entry-7-schema-dto-versioning-acceptance.md) / [`assessment-snapshot-schema-dto-versioning.md`](./assessment-snapshot-schema-dto-versioning.md)）
8. TypeScript型、runtime validator、合成fixture、contract testsの計画が存在（**DONE / FINAL CONSISTENT** — Entry #8 Accepted / LOCKED / Option A。実装は別 Human Implementation Start）
```

Entry Criteriaを満たす前に、代替型、暫定enum、SharePoint列を先行実装しない。

## 継続HOLD

- TypeScriptの`AssessmentSnapshotResult`・`AssessmentSnapshot`型（Entry #8 は計画 Accepted。実装 DO NOT START）
- Result変換純粋関数（狭域変換は完了。完全契約拡張は未）
- runtime validator
- fixture・contract tests
- `DEC-009`保存タイミング（**Accepted / LOCKED** — 実装は別 Human Implementation Start）
- 保存・確定ロール
- `GOV-AUD-03`訂正承認者（Accepted / Option E — application 対象外。ロール実装しない）
- handoff連携タイミング
- 完全なFinding契約（Entry #5 は findingIds NOT REQUIRED で閉じた。完全 Finding 実装は別 HOLD）
- サービス別`NOT_APPLICABLE` reason code enum（Entry #6 は HOLD方針で閉じた。値一覧・enum 採択は別 Decision / FORBIDDEN now）
- Schema / DTO / SharePoint mapping（Entry #7 は DEC-1 versioning 方針のみ。固有 Schema ID 採番・物理写像は別 HOLD）
- SharePoint、Entra ID、Microsoft 365、deploy
- Decision-AS-EC-1 overall Entry satisfied（Entry #1〜#8 個別は閉じた／Accepted。overall は別 Human Decision / HOLD）

## 変更禁止境界

```text
src/**: 変更しない
tests/**: 変更しない
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
```
