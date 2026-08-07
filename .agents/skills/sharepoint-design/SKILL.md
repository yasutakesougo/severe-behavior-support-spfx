# sharepoint-design

## 目的

Lists / 列 / 権限 / 接続の設計を、本番変更を伴わずに文書化します。

設計草稿のみを扱い、SharePoint 実体変更は行いません。

## 使用する場面

- Domain / Contracts の意味が固まった後
- SharePoint 対応表を作るとき
- Architecture Gate 前の権限・保存先設計

## 入力

- Domain / Contracts 設計
- 既存 `docs/architecture/sharepoint-contract-mapping.md` 等
- 権限モデル
- 事業所分離要件
- 対象外（本番変更・App Catalog）

## 前提条件

- Domain が SharePoint 非依存で整理されている、または依存混入が検出できる
- 本番 SharePoint 変更を本 Skill の成果に含めない方針が共有されている

## 実行手順

1. 保存対象エンティティと List / 列候補を対応付ける
2. 権限と事業所分離を設計する
3. 取得失敗・保存失敗・競合の扱いを定義する
4. 手動設定と再現手順の要否を記録する
5. 本番変更・App Catalog・Entra / M365 変更を対象外として明示する
6. 設計草稿と HOLD を出力する

## 確認項目

- Contracts と列対応が説明できるか
- 権限が UI だけに依存していないか
- 事業所間混在を防げるか
- 失敗時挙動が定義されているか
- 本番変更手順が混入していないか

## 停止条件

- 事業所分離を説明できない
- 権限設計が SharePoint 構成と対応しない
- 本番変更が成果物に含まれている
- 取得 / 保存失敗が未定義

## 判定基準

- `PASS`: この Skill では原則使用しない
- `READY`: 対応表・権限・失敗時挙動・対象外が揃い、実装計画へ渡せる（実変更は含まない）
- `HOLD`: 情報不足、承認待ち、未決により設計固定できない
- `FAIL`: P0 / P1 の権限・分離・境界欠陥がある。P2 は後続可
- `NOT APPLICABLE`: SharePoint 保存を伴わない変更

## 成果物

- List / 列対応案
- 権限設計案
- 失敗時挙動
- 対象外（本番変更等）
- Findings（P0 / P1 / P2）

## 禁止事項

- merge、push、deploy を自動実行手順に含めること
- SharePoint変更、Microsoft 365変更、Entra ID変更を承認不要または自動実行として扱うこと
- 本番データ変更や物理削除を許可または手順化すること
- 未確認事項を推測で確定すること
- `HOLD` を `PASS` / `READY` と同義に扱うこと
- SharePoint 本番変更、App Catalog 登録・更新を手順に含めること
- 設計草稿を実施済み変更として記録すること

## 出力形式

```md
# sharepoint-design

## Summary
- 判定: READY / HOLD / FAIL / NOT APPLICABLE
- 対象:
- 対象リポジトリ:

## Mapping
- List / 列対応:
- 権限:
- 事業所分離:

## Failure Behavior
- 取得失敗:
- 保存失敗:
- 競合:

## Out of Scope
- SharePoint本番変更:
- App Catalog:
- Entra ID / Microsoft 365:

## Findings
| ID | 重大度 | 状態 | 内容 | 根拠 | 対応 |
|---|---|---|---|---|---|
| F-001 | P0 | OPEN |  |  |  |

## HOLD
- なし / または列挙

## Approvals
- 必要な承認:
- 承認状態:

## Next Actions
1.
2.
```
