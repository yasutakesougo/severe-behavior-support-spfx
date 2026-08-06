# handoff-builder

## 目的

現在状態を、次の作業者または次のチャットへ引き継げる形に整理します。

SHA、Issue、PR、HOLD、禁止操作、検証結果を欠落させず、作業状態を再現できることを目的とします。

## 使用する場面

- 作業終了時
- 担当者交代時
- 長い Issue を中断するとき
- マージ待ちまたは承認待ちへ移るとき

## 入力

- 対象リポジトリ
- 現在の main SHA
- 作業ブランチ SHA
- 対象 Issue
- 対象 PR
- 完了事項
- 未完了事項
- HOLD
- 禁止操作
- 検証結果
- 正本資料のリンク

## 前提条件

- 現在の git 状態を確認できる
- 対象 Issue または PR を特定できる
- 検証結果を列挙できる

## 実行手順

1. 対象リポジトリ名を記録する
2. 現在の main SHA を記録する
3. 対象 Issue と PR を記録する
4. 完了事項を列挙する
5. 未完了事項を列挙する
6. HOLD を列挙する
7. 禁止操作を列挙する
8. 検証結果を列挙する
9. 次の推奨作業を列挙する
10. 正本リンクを添える

## 確認項目

- main SHA がある
- Issue / PR が識別できる
- 完了と未完了が混同していない
- HOLD が省略されていない
- 禁止操作が記録されている
- 検証結果がある
- 次の作業者が再開に必要な正本へ到達できる

## 停止条件

- 現在の SHA が不明
- 対象 Issue / PR が不明
- HOLD を列挙できない
- 検証結果が不明

## 判定基準

- `PASS`: この Skill では原則使用しない。Gate 通過の意味ではなく、引き継ぎ完了の補助表現にも使わない
- `READY`: 引き継ぎ文面だけで現状態を再現できる
- `HOLD`: SHA、Issue、PR、HOLD、検証結果のいずれかが不足
- `FAIL`: 誤った SHA や誤った対象を引き継ぐ恐れが高い。P0 は誤対象への継続作業、P1 は重要な証跡欠落、P2 は補足不足として扱う
- `NOT APPLICABLE`: 引き継ぎが不要な単発作業

## 成果物

- 対象リポジトリ
- 現在の main SHA
- 対象 Issue
- 対象 PR
- 完了事項
- 未完了事項
- HOLD
- 禁止操作
- 検証結果
- 次の推奨作業
- 正本リンク

## 禁止事項

- 未確認の SHA を書くこと
- HOLD を省略すること
- 承認なしで merge / push / deploy 済みと記録すること
- 本番変更を次作業者への既定手順として書くこと
- SharePoint変更、Microsoft 365変更、Entra ID変更を承認不要として書くこと
- 本番データ変更や物理削除を通常手順として書くこと

## 出力形式

```md
# handoff-builder

## Summary
- 判定: READY / HOLD / FAIL / NOT APPLICABLE
- 対象リポジトリ:
- main SHA:
- 作業ブランチ SHA:

## References
- Issue:
- PR:
- 正本リンク:

## Completed
- 完了事項:

## Remaining
- 未完了事項:

## HOLD
- なし / または列挙

## Forbidden Actions
- merge
- push
- deploy
- 本番変更
- SharePoint変更
- Microsoft 365変更
- Entra ID変更
- 本番データ変更
- 物理削除

## Verification
- typecheck:
- test:
- audit:

## Next Actions
1.
2.
```
