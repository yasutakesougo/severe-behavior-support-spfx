# Domain Reconstruction Foundation

この文書は、`severe-behavior-support-spfx`におけるDomain基礎型・純粋関数の責務境界を記録する。

## 基準

```text
main: 33a2064e037d56361c5bb93bddabd928ad756c3b
entry criteria: Issue #34 CONDITIONAL GO
assessment contract: Issue #20
Decision Ledger: Issue #8
```

本実装は、行動関連点数の検証、点数帯分類、条件結果の集約、評価実行状態とFindingの分離だけを扱う。

加算・請求・サービス適格性の最終判定は行わない。

## 許可範囲

1. 行動関連点数0〜24の整数検証
2. 10点・18点の点数帯分類
3. 点数入力状態のfail-closed分類
4. 条件結果`PASS`・`FAIL`・`UNKNOWN`・`NOT_APPLICABLE`の集約
5. 評価実行状態・評価結果・Findingの分離
6. `FacilityType`の基礎型
7. 完全合成fixtureと単体テスト

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

### 点数根拠資料の有効性

根拠資料、`validFrom`、`validTo`、確認日、取得失敗等の契約はIssue #20の後続assessment-contractsで実装する。

本PRでは保存・履歴・有効期間選択を実装しない。

### サービス・規則の適用可否

`NOT_APPLICABLE`は`CriterionResult`等の条件結果だけで使用する。

点数未確認、資料欠損、有効期間外、取得失敗を`NOT_APPLICABLE`へ変換しない。

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

1. `FAIL`が1件以上なら`INELIGIBLE`
2. `FAIL`はないが`UNKNOWN`が1件以上なら`INDETERMINATE`
3. すべて`NOT_APPLICABLE`なら`NOT_APPLICABLE`
4. `PASS`が1件以上あり、残りが`PASS`または`NOT_APPLICABLE`なら`ELIGIBLE`
5. criteriaが空、criterionIdが空、不正statusなら`INDETERMINATE`

ここでの`ELIGIBLE`は、入力された技術的条件が通過したことだけを意味する。

## Findingと判定の分離

`findings.length === 0`だけで`NO_FINDINGS`にしない。

`NO_FINDINGS`には次をすべて要求する。

- 実行状態が`COMPLETED`
- criteriaが空でない
- criteriaが有効なstatusだけを持つ
- `FAIL`・`UNKNOWN`がない
- findingsが0件
- 欠損・確認待ち・期限切れ・システムエラーが0件
- 必要な承認が完了している

すべての条件が`NOT_APPLICABLE`なのにFindingがある場合は矛盾として`INDETERMINATE`にする。

## Requirement IDトレーサビリティ

| Requirement ID | 対応内容 | 主な実装・テスト |
|---|---|---|
| USR-005 | 点数0と未入力の区別 | `BehaviorScoreInput`, score tests |
| USR-006 | 点数状態と規則適用可否の分離 | `BehaviorScoreInput`, `CriterionResult` |
| CALC-001〜009 | 有効範囲、不正値、点数帯 | `parseBehaviorRelatedScore`, classification tests |
| SAFE-001 | 必要データ不足時に確定成功へ倒さない | `deriveEvaluationDecision` |
| SAFE-003 | 取得失敗を適合・対象外へ倒さない | `FETCH_FAILED`, `SOURCE_UNAVAILABLE` |
| SAFE-004 | 算定不能時に適合・不適合findingを生成しない | `UNKNOWN`, evaluation tests |
| NFR-MNT-001 | DomainをSharePoint APIから分離 | `src/domain/*` |
| NFR-MNT-003 | 純粋関数としてテスト可能にする | domain functions and tests |
| NFR-MNT-006 | ルール変更時に文書とテストを更新する | 本文書と`tests/domain/*` |

この対応は設計トレーサビリティであり、要件を`Implemented`または`Verified`へ自動昇格させない。

## 継続HOLD

- 点数根拠資料の保存・履歴contract
- サービス別`NOT_APPLICABLE`理由コード
- 登録・確認ロール
- 施設割合、職員研修割合
- 最終加算・請求判定
- 遡及請求・過誤申立て
- SharePoint接続、SPFx画面、provisioning
- 実データ利用、deploy、Microsoft 365変更

## 合成fixture境界

テストデータは`synthetic-*`だけを使用し、実在する人物、受給者証番号、事業所データ、現行システムfixtureを含めない。
