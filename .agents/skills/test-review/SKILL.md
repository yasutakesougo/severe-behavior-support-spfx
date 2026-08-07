# test-review

## 目的

テスト結果と網羅範囲を監査し、未実行・既知失敗・新規失敗を区別してレビュー判断材料を作ります。

## 使用する場面

- 実装後 PR レビュー
- `review-pr` のテスト観点確認
- Merge Gate 前の証跡整理

## 入力

- 対象 PR / head SHA
- テスト計画
- 実行コマンドと結果
- 既知失敗一覧
- 未実行テストと理由

## 前提条件

- 対象 head SHA が固定できる
- 実行結果または不足理由を記録できる

## 実行手順

1. 実行したテストを列挙する
2. 未実行テストと理由を記録する
3. 失敗を NEW / KNOWN / FLAKY に分類する
4. 受入条件との対応を確認する
5. 証跡不足を HOLD にする
6. 判定を出す

## 確認項目

- 計画されたテストが実行されているか
- 新規失敗が 0 件か
- 既知失敗に Issue 番号があるか
- 削除や skip で通していないか
- 受入条件との対応が説明できるか

## 停止条件

- テスト結果不明
- 新規失敗と既知失敗を区別できない
- head SHA と結果の対応が不明
- 必須テスト未実行かつ理由なし

## 判定基準

- `PASS`: 必要テストの証跡が揃い、新規失敗 0、未解決 P0 / P1 なし
- `READY`: この Skill では原則使用しない
- `HOLD`: CI 未完了、証跡不足、分類不能
- `FAIL`: P0 / P1 のテスト欠陥または新規重大失敗。P2 は後続可
- `NOT APPLICABLE`: テスト対象変更がない文書のみ PR

## 成果物

- 実行一覧
- 未実行一覧
- 失敗分類
- Findings（P0 / P1 / P2）
- 次アクション

## 禁止事項

- merge、push、deploy を自動実行手順に含めること
- SharePoint変更、Microsoft 365変更、Entra ID変更を承認不要または自動実行として扱うこと
- 本番データ変更や物理削除を許可または手順化すること
- 未確認事項を推測で確定すること
- `HOLD` を `PASS` / `READY` と同義に扱うこと
- テスト削除や無根拠 skip で PASS 相当にすること
- 新規失敗を既知失敗として偽装すること

## 出力形式

```md
# test-review

## Summary
- 判定: PASS / HOLD / FAIL / NOT APPLICABLE
- 対象PR:
- head SHA:

## Executed
- typecheck:
- unit/contract tests:
- verify:skills:
- check:contracts-boundaries:
- check:scope:

## Not Executed
- 項目と理由:

## Failures
- NEW FAILURE:
- KNOWN FAILURE:
- FLAKY SUSPECTED:

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
