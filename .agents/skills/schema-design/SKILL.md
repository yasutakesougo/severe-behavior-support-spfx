# schema-design

## 目的

JSON Schema / DTO / 列挙値 / 未入力表現を、Contracts と Domain の意味に整合する形で設計します。

## 使用する場面

- Domain 設計後、Contracts 更新前
- DTO と永続化表現の境界を固定するとき
- Architecture Gate 前のスキーマ確認

## 入力

- Domain 設計
- 既存 Contracts / types
- 列挙値・未入力・失敗表現の要件
- 互換性方針

## 前提条件

- Domain の意味が参照できる
- 実データや現行列名を無断で正としない方針がある

## 実行手順

1. 対象 DTO / Schema を列挙する
2. 必須・任意・未入力表現を定義する
3. 列挙値と拒否理由コードを定義する
4. Domain 意味との対応を確認する
5. 後方互換・破壊的変更を識別する
6. 検証方法（契約テスト）を記録する
7. 設計草稿と HOLD を出力する

## 確認項目

- 未入力と 0 / 空文字を区別できるか
- Domain の失敗表現が DTO に落ちているか
- 破壊的変更が明示されているか
- 契約テストで検証可能か
- SharePoint 列名が Domain に逆流していないか

## 停止条件

- 未入力表現が未定義
- Domain と DTO の意味が不一致
- 破壊的変更の扱いが未定義
- 検証不能

## 判定基準

- `PASS`: この Skill では原則使用しない
- `READY`: Schema / DTO / 列挙 / 未入力表現 / 互換方針が揃っている
- `HOLD`: 情報不足、承認待ち、未決により固定できない
- `FAIL`: P0 / P1 の契約欠陥がある。P2 は後続可
- `NOT APPLICABLE`: Schema / DTO 変更を伴わない作業

## 成果物

- Schema / DTO 設計メモ
- 列挙値・未入力表現
- 互換性メモ
- 契約テスト方針
- Findings（P0 / P1 / P2）

## 禁止事項

- merge、push、deploy を自動実行手順に含めること
- SharePoint変更、Microsoft 365変更、Entra ID変更を承認不要または自動実行として扱うこと
- 本番データ変更や物理削除を許可または手順化すること
- 未確認事項を推測で確定すること
- `HOLD` を `PASS` / `READY` と同義に扱うこと
- 破壊的変更を黙って導入すること
- SharePoint 列名を Domain 型の正本にすること

## 出力形式

```md
# schema-design

## Summary
- 判定: READY / HOLD / FAIL / NOT APPLICABLE
- 対象 Schema/DTO:
- 対象リポジトリ:

## Design
- 必須/任意:
- 未入力表現:
- 列挙値:
- 互換性:

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
