# severe-behavior-cycle-review

## 目的

強度行動障害支援の閉ループが、安全かつ一貫して運用できるかを実操作と契約正本で判定する。

対象は次に限る。

```text
アセスメント
→ 支援計画シート等
→ 支援手順
→ 支援実施
→ 実施結果記録
→ 観察・フィードバック
→ 支援計画・支援手順の見直し
```

生活介護事業所向け総合業務システムとしては採点しない。貼り付け用の全文は同ディレクトリ `master-prompt.md` を正とする。

根拠の4視点（法令上必要 / 制度運用上望ましい / UX上望ましい / セキュリティ上の推奨）は、この閉ループにだけ適用する。国保連・家族ポータル等へ広げない。

## 使用する場面

- 合成スモークまたは指定ビルドのサイクル実操作レビュー
- FIELD-WORKFLOW / SupportPlan / ProcedureRecord の UI 到達性確認
- 「記録機能がない」と「synthetic harness では永続保存を検証できない」を分離したいとき
- 生活介護総合監査プロンプトを誤って使わないための再実行

`review-pr` の必須観点ではない。Contracts / テスト確認とは別に、直接実行する。

## 入力

- 対象ビルドまたはスモーク URL（未指定なら `NOT SPECIFIED`）
- 操作可能な端末（未検証端末は「未検証」）
- 合成テストデータのみ（完全合成 / 架空 fixture。production-derived の匿名化データは使わない）
- Accepted / LOCKED Decision と architecture 正本
- ハーネス境界（`presentationOnly`、live I/O 可否）

## 前提条件

- Skill 正本パス `.agents/skills/severe-behavior-cycle-review/SKILL.md` を参照する
- 貼り付け実行時は `master-prompt.md` を冒頭固定文として使う
- 判定語は `.agents/skills/_shared/judgement-rules.md` を参照する
- `SupportPlan == 生活介護計画` と推論しない（HD-RA-04）。`SupportPlan == 支援計画シート等` とも同一視しない
- 利用者分類の入口は `docs/process/ai-role.md`（管理者 / サービス管理責任者 / 支援員）
- 明示 Human GO なしの SharePoint / 本番 mutation は行わない

## 実行手順

1. スコープ固定文を出力の冒頭に再掲し、総合業務システムとして採点しないことを宣言する
2. 対象 URL / ビルド / 端末 / ロールが未指定なら `NOT SPECIFIED` とし、推測で埋めない
3. 合成データで代表経路を操作する（利用者 → 計画 → 現在の支援手順 → 実施結果記録 → Review 材料）
4. 各項目に証跡クラスを付ける（`UI_PATH` / `SYNTHETIC_SAVE` / `LIVE_PERSISTENCE` / `DOMAIN_CONTRACT` / `DECISION`）
5. サイクル P0 を先に判定する。OUT OF SCOPE の欠如は P0 にしない
6. 6 領域を採点する。分母は in-scope かつ assessed の項目だけにする
7. `NOT ASSESSED` / `OUT OF SCOPE` / `NOT SPECIFIED` / `UNKNOWN` を `FAIL` へ変換しない。根拠は4視点をサイクル内に限定する
8. CYCLE 要約を総合点より先に出す
9. Skill 判定（PASS / HOLD / FAIL / NOT APPLICABLE）を付ける

## 確認項目

- アセスメントから支援計画へのつながり
- 支援計画シート等の有効版、作成者（DEC-008: 実践研修修了者）、適用期間、見直し目安
- 支援前に現在の支援手順（場面→実施→避ける）へ到達できるか
- 実施結果が planId / planVersion / 手順参照に結び付くか
- 実施事実を三値（手順どおり / 一部変更 / 実施できなかった）で区別できるか
- 合成保存とライブ永続化を混同していないか
- 実施記録が計画作成・見直し担当へフィードバックされるか（Review 材料として辿れるか）。自動「変更すべき」判定をしていないか
- 公式の「原則として週に1回以上」観察について、履歴（時刻・観察者・最新・履歴）を追跡できるか。自動「週1回未達 = 違反」は HD-RA-01 で NOT ADOPTED
- 「3ヶ月に1回程度」の見直し目安を追跡できるか。90日変換や hard overdue を発明していないか
- 古い版の黙った最新版付け替えが起きないか
- fail-closed: 取得失敗・欠損・未認証を「問題なし」と出していないか
- 各項目の根拠が4視点のどれか（または Accepted Decision）として区別されているか。Accepted Decision を、制度要件明示なしに「法令上必要」へ昇格していないか。fail-closed は SECURITY / SAFETY / APP_SPEC

## 停止条件

- 実在する利用者の個人情報をテスト目的で新規入力するよう求められている
- 本番 SharePoint write / Deploy / 個人情報の記録が次工程に含まれる
- 対象が生活介護総合システム監査であり、本 Skill への切替が拒否されている
- サイクル判定に必要な画面へ到達できず、かつ `NOT ASSESSED` と書けない圧力がある（未確認を FAIL にせよ、など）

## 判定基準

サイクル採点ラベル（分母計算用）:

- 項目 `PASS`（合格）: 係数 1.0
- 項目 `PARTIAL`（要改善）: 係数 0.5
- 項目 `FAIL`（不合格）: 係数 0
- `NOT ASSESSED` / `OUT OF SCOPE` / `NOT SPECIFIED`: 分母から除外

読み替え（`UNKNOWN ≠ FAIL`）:

- `UNKNOWN` / `確認不能` → `NOT ASSESSED`（FAIL にしない）
- `未指定` → `NOT SPECIFIED`（FAIL にしない）
- `OUT_OF_SCOPE` → `OUT OF SCOPE`（FAIL にしない、減点しない）
- 未検証端末 → `NOT ASSESSED`

Skill 判定語:

- `PASS`: unresolved P0 = 0、unresolved P1 = 0、必要な証跡がある。総合点は参考。P1 が残る状態を PASS にしない
- `READY`: この Skill では原則使用しない
- `HOLD`: ハーネス制約や未指定入力により、P0 / P1 を確定できない。証跡不足。`NOT ASSESSED` が中心
- `FAIL`: 製品スコープ内の unresolved P0 が 1 件以上、または unresolved P1 が 1 件以上。または取得失敗を問題なしと表示する
- `NOT APPLICABLE`: 強度行動障害支援サイクルのレビュー対象ではない

重大度:

- `P0`: サイクル P0 ゲートに該当する欠陥（スコープ内）
- `P1`: 閉ループは途切れるが、誤版使用や偽陰性までは至らない欠落
- `P2`: 到達性・文言・現場効率の改善。後続 Issue 可

合成ハーネスの読み替え:

- 支援手順 → 実施結果の導線がある → 経路は PASS 候補
- SharePoint 保存が無効、または `syntheticProcedureRecordSaveAuthorized` のみ → 永続保存は `NOT ASSESSED`
- `presentationOnly` の mutation 無効 → ライブ未接続と機能欠落を混同しない

## 成果物

- CYCLE 要約（導線 / 永続保存 / 週次観察 / 見直し閉ループ / P0）
- SCORE（in-scope assessed only）
- 6 領域チェック表
- Findings（P0 / P1 / P2）
- HOLD / OUT OF SCOPE / NOT ASSESSED の内訳
- 次の開発判断（Human / Agent）

## 禁止事項

- merge、push、deploy を自動実行手順に含めること
- SharePoint変更、Microsoft 365変更、Entra ID変更を承認不要または自動実行として扱うこと
- 本番データ変更や物理削除を許可または手順化すること
- 未確認事項を推測で確定すること
- `NOT ASSESSED` / `OUT OF SCOPE` / `NOT SPECIFIED` / `UNKNOWN` / `確認不能` / `未指定` を `FAIL` へ変換すること
- `HOLD` を `PASS` / `READY` と同義に扱うこと
- 生活介護全業務・国保連・家族ポータル・医療機関ログイン・BCP・バックアップ UI・一般の個別支援計画欠如を減点すること
- `SupportPlan` を生活介護計画、または支援計画シート等と同一視すること
- 週次観察の自動違反判定や「3ヶ月 = 90日」変換を発明すること
- 実在個人情報、または production-derived の匿名化データをテストデータとして使うこと
- トークン / Cookie / Secret / 個人情報を証跡へ転記すること

## 出力形式

```md
# severe-behavior-cycle-review

## CYCLE
- 導線:
- 永続保存:
- 週次観察の追跡:
- 見直しへの閉ループ:
- P0: なし / あり（ID）

## SCORE
- in-scope assessed only: xx / 100 (normalized; assessed weight yy)
- excluded: OUT OF SCOPE n, NOT ASSESSED n, NOT SPECIFIED n

## Summary
- 判定: PASS / HOLD / FAIL / NOT APPLICABLE
- 対象:
- 根拠:

## Findings
| ID | 重大度 | 状態 | 内容 | 根拠 | 対応 |
|---|---|---|---|---|---|
| F-001 | P1 | OPEN |  |  |  |

## HOLD
- なし / または列挙

## Approvals
- 必要な承認:
- 承認状態:

## Next Actions
1.
2.
```

詳細表とスコープ固定文は `master-prompt.md` に従う。出力例は `sample-output.md` を参照する。
