# domain-design

## 目的

業務ルールを Domain 純粋関数・型・不変条件として整理し、SharePoint 実装から分離した設計草稿を作ります。

## 使用する場面

- 要件と DEC が揃った後の設計工程
- Architecture Gate 前の Domain 境界固定
- Contracts / Schema 設計の前提固め

## 入力

- 要件レビュー結果
- DEC / ADR
- 既存 `docs/architecture/` / `src/domain/`
- 対象業務ルール
- 対象外（永続化・UI・adapter）

## 前提条件

- 要件の正本がある
- ブロッカーとなる未決 DEC がない、または HOLD 明示できる
- Domain が SharePoint に依存しない方針が共有されている

## 実行手順

1. 対象業務ルールを列挙する
2. 入出力と不変条件を定義する
3. 失敗・拒否の表現を定義する
4. SharePoint / UI / adapter 依存がないことを確認する
5. 既存 Domain / Contracts との整合を確認する
6. 対象外を明示する
7. 設計草稿と HOLD を出力する

## 確認項目

- 業務意味が Domain に閉じているか
- SharePoint 列名・REST・PnP 依存がないか
- 失敗時の表現が定義されているか
- 合成 fixture で検証可能か
- 対象外が明示されているか

## 停止条件

- 要件不足
- 未決 DEC が Domain 意味をブロック
- SharePoint 依存が混入している
- 失敗時挙動が未定義

## 判定基準

- `PASS`: この Skill では原則使用しない。Architecture Gate は architecture-review で扱う
- `READY`: Domain 境界・入出力・失敗表現・対象外が揃い、次の schema / SharePoint 設計へ渡せる
- `HOLD`: 情報不足、承認待ち、未決により Domain 設計を固定できない
- `FAIL`: P0 / P1 の境界破壊または意味矛盾がある。P2 は後続可
- `NOT APPLICABLE`: Domain 変更を伴わない作業

## 成果物

- Domain 対象範囲 / 対象外
- 型・関数・不変条件の設計メモ
- 失敗・拒否表現
- 検証方針（合成 fixture）
- Findings（P0 / P1 / P2）

## 禁止事項

- merge、push、deploy を自動実行手順に含めること
- SharePoint変更、Microsoft 365変更、Entra ID変更を承認不要または自動実行として扱うこと
- 本番データ変更や物理削除を許可または手順化すること
- 未確認事項を推測で確定すること
- `HOLD` を `PASS` / `READY` と同義に扱うこと
- Domain に SharePoint / SPFx / PnP 依存を持ち込むこと
- 実データや現行 fixture を設計根拠にそのまま使うこと

## 出力形式

```md
# domain-design

## Summary
- 判定: READY / HOLD / FAIL / NOT APPLICABLE
- 対象 Domain:
- 対象リポジトリ:

## Scope
- 対象範囲:
- 対象外:

## Design
- 入出力:
- 不変条件:
- 失敗表現:

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
