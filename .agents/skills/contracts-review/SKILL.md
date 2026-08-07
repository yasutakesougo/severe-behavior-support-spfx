# contracts-review

## 目的

実装後または Contracts 変更時に、契約の互換性・境界・検証可能性を監査します。

## 使用する場面

- Contracts / Domain 変更を含む PR レビュー
- `review-pr` の契約観点確認
- 破壊的変更の有無確認

## 入力

- 対象 PR / head SHA
- Contracts / Domain 差分
- 契約テスト結果
- `check:contracts-boundaries` 結果
- 互換性方針

## 前提条件

- 対象 head SHA が固定できる
- 差分とテスト結果を取得できる、または不足を HOLD にできる

## 実行手順

1. 変更された契約面を列挙する
2. 破壊的変更と追加変更を区別する
3. Domain 境界（SharePoint / UI 非依存）を確認する
4. 契約テストと boundaries 検査の結果を確認する
5. 未入力・列挙・失敗表現の整合を確認する
6. Findings を P0 / P1 / P2 で整理する
7. 判定を出す

## 確認項目

- 契約変更がテストされているか
- boundaries 検査が通っているか
- 破壊的変更が明示され受容されているか
- Domain にインフラ依存が混入していないか
- 未実行テストに理由があるか

## 停止条件

- head SHA 不明
- 契約テスト結果不明
- boundaries 結果不明
- 破壊的変更の扱いが未定義

## 判定基準

- `PASS`: 契約整合と検証証跡が揃い、未解決 P0 / P1 がない
- `READY`: この Skill では原則使用しない
- `HOLD`: CI / テスト証跡不足、承認待ち、判断保留
- `FAIL`: P0 / P1 の契約欠陥または新規重大失敗がある。P2 は後続可
- `NOT APPLICABLE`: Contracts / Domain 契約面の変更がない

## 成果物

- 契約変更一覧
- 互換性判定
- CI / テスト証跡
- Findings（P0 / P1 / P2）
- 次アクション

## 禁止事項

- merge、push、deploy を自動実行手順に含めること
- SharePoint変更、Microsoft 365変更、Entra ID変更を承認不要または自動実行として扱うこと
- 本番データ変更や物理削除を許可または手順化すること
- 未確認事項を推測で確定すること
- `HOLD` を `PASS` / `READY` と同義に扱うこと
- 契約テスト失敗を無視して PASS にすること
- boundaries 違反を既知として黙認すること

## 出力形式

```md
# contracts-review

## Summary
- 判定: PASS / HOLD / FAIL / NOT APPLICABLE
- 対象PR:
- head SHA:

## Contract Changes
- 追加:
- 変更:
- 破壊的変更:

## Evidence
- typecheck:
- tests:
- check:contracts-boundaries:

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
