# merge-audit

## 目的

実装者とは別視点で、PR のマージ可否を監査します。

`HOLD` や証跡不足を `PASS` 扱いせず、`P0` または `P1` が 1 件でもある場合はマージ不可にします。

## 使用する場面

- Draft PR からレビュー候補へ進める前
- 最終レビュー前の独立監査
- CI 完了後のマージ判断

## 入力

- 対象 PR
- head SHA
- base SHA
- 変更範囲
- 対象外変更
- CI 結果
- テスト結果
- 未解決レビュー
- 既知失敗一覧
- 人による承認状態

## 前提条件

- 監査対象の PR が特定されている
- head SHA と base SHA が取得できる
- CI とテスト結果の証跡がある

## 実行手順

1. 対象 PR、head SHA、base SHA を固定する
2. 変更範囲と対象外変更を確認する
3. CI 結果を確認する
4. テスト結果を確認する
5. 未実行テストの有無と理由を確認する
6. 既知失敗と新規失敗を区別する
7. P0 / P1 / P2 / HOLD を整理する
8. 未解決レビューを確認する
9. 人による承認要否を記録する
10. Merge Gate の判定を出す

## 確認項目

- 対象 PR が正しい
- head SHA / base SHA が正しい
- 変更範囲が計画と一致する
- 対象外変更が混入していない
- CI が完了している
- テスト結果が記録されている
- 既知失敗と新規失敗を区別している
- 未解決レビューがない、または HOLD 扱いされている
- 人による merge 承認要否が明示されている

## 停止条件

- 監査対象 SHA が不明
- CI 結果が不明
- テスト結果が不明
- 既知失敗と新規失敗を区別できない
- 未解決レビューの扱いが未定義

## 判定基準

- `PASS`: Merge Gate の通過条件を満たし、`P0` が 0 件、`P1` が 0 件、新規失敗が 0 件、Fresh Review PASS、CI SUCCESS、mergeable=clean、必要な証跡が揃い、明示 Human Merge GO がある。Solo development 既定では submitted GitHub Review PASS は非必須（`DEC-AI-ORG-003.md`）
- `READY`: この Skill では原則使用しない。マージ候補の準備完了を補足する語としてのみ扱う
- `HOLD`: Human Merge GO 待ち、CI 未完了、Fresh Review 未完了、証跡不足、（複数人レビュー要求時）未解決レビューあり
- `FAIL`: `P0` または `P1` が 1 件以上ある、または新規重大不具合によりマージ不可
- `NOT APPLICABLE`: PR を対象としない作業

## 成果物

- 対象 PR
- head SHA
- base SHA
- 変更範囲
- 対象外変更
- CI 結果
- テスト結果
- P0
- P1
- P2
- HOLD
- 未解決レビュー
- マージ可否
- 人による承認要否

## 禁止事項

- `HOLD` を `PASS` として記録すること
- `P0` が残ったままマージ可とすること
- `P1` が残ったままマージ可とすること
- 承認なしで merge や push を実行すること
- deploy や本番変更を後続手順として自動化すること
- SharePoint変更、Microsoft 365変更、Entra ID変更を監査対象外として扱うこと
- 本番データ変更や物理削除を許可済みとして扱うこと

## 出力形式

```md
# merge-audit

## Summary
- 判定: PASS / HOLD / FAIL / NOT APPLICABLE
- 対象PR:
- head SHA:
- base SHA:
- マージ可否:

## Scope Audit
- 変更範囲:
- 対象外変更:

## CI and Tests
- CI 結果:
- テスト結果:
- 未実行テスト:
- 既知失敗:
- 新規失敗:

## Findings
| ID | 重大度 | 状態 | 内容 | 根拠 | 対応 |
|---|---|---|---|---|---|
| F-001 | P0 | OPEN |  |  |  |

## Unresolved Reviews
- なし / または列挙

## HOLD
- なし / または列挙

## Approvals
- merge 承認要否:
- 承認状態:
```
