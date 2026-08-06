# Domain Reconstruction Foundation

この文書は、`severe-behavior-support-spfx`におけるDomain基礎型・純粋関数の責務境界を記録する。

## 基準

```text
main: d5369d1a944a3f8b9f926c54bbc138863109b877
entry criteria: Issue #25 CONDITIONAL GO
assessment contract: Issue #20 (MERGED)
ABC / Observation contract: Issue #25
Decision Ledger: Issue #8
```

本実装は、行動関連点数の検証、点数帯分類、条件結果の集約、評価実行状態とFindingの分離、ならびにABC記録・観察記録・連携失敗記録の型契約と状態遷移純粋関数だけを扱う。

加算・請求・サービス適格性の最終判定および具体ロール権限判定は行わない。

## 許可範囲

1. 行動関連点数0〜24の整数検証
2. 10点・18点の点数帯分類
3. 点数入力状態のfail-closed分類
4. 条件結果`PASS`・`FAIL`・`UNKNOWN`・`NOT_APPLICABLE`の集約
5. 評価実行状態・評価結果・Findingの分離
6. `FacilityType`の基礎型
7. ABC記録 (`AbcRecord`)、観察記録 (`Observation`)、連携失敗記録 (`LinkFailure`) の契約とバリデータ
8. 保存状態 (`SaveState`)、連携状態 (`LinkState`)、連携失敗状態 (`LinkFailureStatus`) の状態遷移純粋関数
9. 完全合成fixtureと単体テスト

## 3層の責務分離

### 点数入力状態

`BehaviorScoreInput`は次だけを持つ。

```text
VALUE
EMPTY
INVALID
UNKNOWN
FETCH_FAILED
```

- `VALUE: 0`は正式な有効値である。
- 未入力、不正値、不明、取得失敗を0へ変換しない。
- `NOT_APPLICABLE`を点数入力状態へ追加しない。
- 不正status、理由欠損、空の取得失敗コードは`MALFORMED_STATE`として拒否する。

### 点数根拠資料の有効性

`AssessmentScoreSourceRecord` (`sourceReferenceId`, `score`, `validFrom`, `validTo`, `confirmedAt`, `confirmedBy`) および純粋選択関数 `selectAssessmentScoreSource` をIssue #20で実装。

- `score: 0` は正式な有効値として扱う。
- `validFrom` / `validTo` 欠落および `validFrom > validTo` は `MALFORMED` として拒否する。
- 判定日時点で有効な資料が0件の場合は確定判定せず `MISSING` / `UNCONFIRMED` / `EXPIRED` へ失敗クローズする。
- 有効な資料が複数件ある場合は `CONFLICT` を返す。
- `UNCONFIRMED` を `VALID` へ倒さない。
- `EXPIRED` を `MISSING` へ倒さない。
- `FETCH_FAILED` を `MISSING`、`UNKNOWN`、0点へ変換しない。
- 3年固定をハードコードしない（有効期間は `validFrom` / `validTo` に従う）。
- 更新後の点数は新しい `validFrom` から適用される。

### ABC・観察・連携失敗契約 (Issue #25)

`src/domain/abc-observation.ts` で定義し、共通ID (`OrganizationId`, `SiteId`, `UserId`, `RecordId`, `IdempotencyKey`, `PayloadFingerprint`) は `src/contracts/types.ts` から再利用する。

- `SaveState` は `Saved` と `Deleted` の discriminated union とし、`Deleted` 時は `deletedBy`, `deletedAt`, `deletionReason` を必須とする。
- `LinkState` は `NotRequired` (sourceContext なし) と `Pending` / `Linked` / `Failed` (sourceContext 必須) の union とし、不正な組合せを型およびバリデータで拒否する。
- `Saved` と `Failed` を同時に表現可能とする。
- `Observation` の訂正情報は `correctionOf` と `correctionReason` の両方が揃っている場合のみ受理する。
- `LinkFailure` はプロパティの allowlist 検査を行い、個人情報（氏名等）、支援本文、ABC本文、Secrets/Token の混入を失敗クローズして拒否する。
- 状態遷移純粋関数 (`transitionSaveState`, `transitionLinkState`, `transitionLinkFailureStatus`) は例外を投げず、判別可能な `TransitionResult<T>` を返す。具体ロール判定は含めず、ID一致・version一致・不変条件・必須理由の検証を行う。

### サービス・規則の適用可否

`NOT_APPLICABLE`は`CriterionResult`等の条件結果だけで使用する。

- 点数未確認、資料欠損、有効期間外、取得失敗を`NOT_APPLICABLE`へ変換しない。
- `UNKNOWN`と`NOT_APPLICABLE`には非空の`reasonCode`を必須とする。
- 正式なサービス別reasonCode enumは未決定のため、本PRでは文字列値を固定しない。

## 行動関連点数

- 12項目×各0〜2点の合計として、有効範囲は0〜24の整数である。
- 小数、負数、25以上、`NaN`、`Infinity`、非number型は拒否する。

## 点数帯分類

```text
0..9: BELOW_BASE_THRESHOLD
10..17: BASE_SUPPORT_TARGET
18..24: HIGH_INTENSITY_TARGET
```

点数帯は点数条件だけを表し、最終的な加算・請求・サービス適格性を表さない。

## 条件集約

集約前にすべてのcriterionを検証する。不正criterionを、先行する`FAIL`等で隠さない。

1. criterionId・status・必須reasonCodeに不備があれば`INDETERMINATE`
2. `FAIL`が1件以上なら`INELIGIBLE`
3. `FAIL`はないが`UNKNOWN`が1件以上なら`INDETERMINATE`
4. すべて`NOT_APPLICABLE`なら`NOT_APPLICABLE`
5. `PASS`が1件以上あり、残りが`PASS`または`NOT_APPLICABLE`なら`ELIGIBLE`
6. criteriaが空なら`INDETERMINATE`

ここでの`ELIGIBLE`は、入力された技術的条件が通過したことだけを意味する。

## Findingと判定の分離

`findings.length === 0`だけで`NO_FINDINGS`にしない。

`NO_FINDINGS`には次をすべて要求する。

- 実行状態が`COMPLETED`
- criteriaが空でない
- criteriaが有効なstatusと必須reasonCodeを持つ
- `FAIL`・`UNKNOWN`がない
- findingsが0件
- 欠損・確認待ち・期限切れ・システムエラーが0件
- 必要な承認が完了している

null、不正配列、不正count、不正boolean等の壊れた入力は例外にせず`INDETERMINATE`へ倒す。

すべての条件が`NOT_APPLICABLE`なのにFindingがある場合は矛盾として`INDETERMINATE`にする。

## Requirement IDトレーサビリティ

| Requirement ID | 対応内容 | 主な実装・テスト |
|---|---|---|
| USR-005 | 点数0と未入力の区別 | `BehaviorScoreInput`, `AssessmentScoreSourceRecord`, score tests |
| USR-006 | 点数状態と規則適用可否の分離 | `BehaviorScoreInput`, `CriterionResult`, `AssessmentSourceDecision` |
| CALC-001〜009 | 有効範囲、不正値、点数帯 | `parseBehaviorRelatedScore`, classification tests |
| ABC-001〜015 | ABC記録契約・保存/連携状態・状態遷移 | `AbcRecord`, `SaveState`, `LinkState`, `transitionSaveState`, `transitionLinkState` |
| OBS-001〜003, 007 | 観察記録契約・訂正履歴 | `Observation`, `validateObservation` |
| NFR-AVL-003, 004 | 連携失敗記録・個人情報排除 | `LinkFailure`, `validateLinkFailure`, `transitionLinkFailureStatus` |
| SAFE-001 | 必要データ不足時に確定成功へ倒さない | `deriveEvaluationDecision`, `selectAssessmentScoreSource` |
| SAFE-002 | 有効期間判定と不正範囲拒否 | `selectAssessmentScoreSource`, `validFrom > validTo` tests |
| SAFE-003 | 取得失敗を適合・対象外へ倒さない | `FETCH_FAILED`, `SOURCE_UNAVAILABLE`, contract tests |
| SAFE-004 | 算定不能・未確認時に確定判定しない | `UNKNOWN`, `UNCONFIRMED`, `EXPIRED`, evaluation tests |
| SAFE-005 | 複数有効資料の矛盾検出 | `selectAssessmentScoreSource`, `CONFLICT` tests |
| PLAN-001〜010 | 支援計画・版管理・承認状態契約 | `SupportPlan`, `SupportPlanState`, `validateSupportPlan`, `support-plan-contract.test.ts` |
| REV-001〜002 | 版本文分離・履歴参照ポート | `SupportPlanVersion`, `ISupportPlanVersionRepository`, `validateSupportPlanVersion` |
| AUD-001〜014 | contract-only設計証跡・部分実装（FindingIdentity / FindingStatus型正本 / HandoffState構造 / SnapshotCorrection構造 / AuditEvent構造 / strict allowlist）。HOLD: 完全なFinding・FindingSeverity・AssessmentSnapshot・状態遷移・ID生成・再発判定・削除権限・保存期間 | `FindingIdentity`, `FindingStatus`, `HandoffState`, `SnapshotCorrection`, `AuditEvent`, validators |
| SAFE-006〜009 | 監査イベントの禁止フィールド名・未知キー排除。許可フィールド内の値のサニタイズは後続adapterまたは監査ログ書込境界のHOLD | `validateAuditEvent` strict allowlist / forbidden key checks |
| NFR-SEC-008 | 重要操作監査ログ構造 | `AuditEvent`, `AUDIT_EVENT_RESULTS`, `validateAuditEvent` |
| NFR-MNT-001 | DomainをSharePoint APIから分離 | `src/domain/*` |
| NFR-MNT-003 | 純粋関数としてテスト可能にする | domain functions and tests |
| NFR-MNT-006 | ルール変更時に文書とテストを更新する | 本文書と`tests/domain/*`, `tests/contracts/*` |

### SupportPlan Schema（Issue #42 / DEC-1）

| Contract | Schema ID | Schema Version | DTO |
|---|---|---|---|
| SupportPlan | `severe-behavior-support.support-plan.plan` | `1.0.0` | `SupportPlanDto`（dtoVersion=schemaVersion） |
| SupportPlanVersion | `severe-behavior-support.support-plan.plan-version` | `1.0.0` | `SupportPlanVersionDto`（dtoVersion=schemaVersion） |
| Repository結果型 | Schema ID対象外（結果契約） | — | `RepositoryLookupResult` / `RepositoryListResult` / `SaveResult` |

- Schema IDはSharePoint List/列、TypeScript型名、リポジトリ名と同一視しない
- `PlanId`（SupportPlan）と `planId`（SupportPlanVersion）は既存表記を維持し、Mappingで明示する（統一は後続MAJOR候補）
- Contracts最小Mapping（Contract側）: `docs/architecture/sharepoint-contract-mapping.md`
- SharePoint列変換（DEC-6）はHOLD。Adapter Entry Criteria

この対応は設計トレーサビリティであり、要件を`Implemented`または`Verified`へ自動昇格させない。

要件正本（暫定案B）の基準SHA: `bb46c6a0caac862d9a9fbb2ce31399092400aa10`
将来の要件正本移行先: `docs/requirements/`


## 継続HOLD

- 完全なFinding契約、FindingSeverity、AssessmentSnapshot / AssessmentSnapshotResult
- Finding・Handoff状態遷移、安定ID生成・再発判定
- 削除を実行できる具体的業務ロール
- 再連携を実行できる具体的業務ロール
- AuditEvent.actionCode最終enum、AuditLog保存期間
- 許可フィールド内の値のサニタイズ（支援本文・個人情報の内容排除は後続adapterまたは監査ログ書込境界）
- サービス別`NOT_APPLICABLE`・`UNKNOWN` reasonCode enum
- 施設割合、職員研修割合
- 最終加算・請求判定
- 遡及請求・過誤申立て
- SharePoint接続、SPFx画面、provisioning
- 実データ利用、deploy、Microsoft 365変更

## 合成fixture境界

テストデータは`synthetic-*`だけを使用し、実在する人物、受給者証番号、事業所データ、現行システムfixtureを含めない。
