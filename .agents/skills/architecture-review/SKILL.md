# architecture-review

## 目的

Domain / Contracts / SharePoint 設計 / UI 前提 / ADR の整合を確認し、Architecture Gate の判定材料を作ります。

## 使用する場面

- 設計一式が揃った後
- Implementation Gate 前の Architecture Gate 確認
- 設計大幅変更後の再判定

## 入力

- 要件・DEC / ADR
- domain-design / sharepoint-design / schema-design の結果
- 既存 architecture 文書
- Architecture Gate 定義

## 前提条件

- Gate 定義 `docs/process/gate-definitions.md` を参照できる
- 設計成果物または不足理由を列挙できる

## 実行手順

1. Domain の SharePoint 非依存を確認する
2. Contracts が Domain 意味を表現しているか確認する
3. SharePoint 対応と権限境界を確認する
4. UI が未確認情報を確定値表示しない前提を確認する
5. DEC / ADR が主要判断を記録しているか確認する
6. 失敗時挙動とデータ境界を確認する
7. Architecture Gate 判定を出す

## 確認項目

- Domain が SharePoint 実装に依存していない
- Contracts が Domain の意味を表現している
- SharePoint 列と Contracts の対応が定義されている、または対象外理由がある
- UI が未確認情報を確定値として表示しない
- 権限制御が UI だけに依存していない
- DEC / ADR が主要判断を記録している
- データ境界または権限境界が説明できる
- 失敗時挙動が定義されている

## 停止条件

- 未決 DEC が実装をブロック
- SharePoint 依存が Domain に混入
- データ境界または権限境界が説明できない
- 失敗時挙動が未定義

## 判定基準

- `PASS`: Architecture Gate の通過条件を満たす
- `READY`: この Skill では原則使用しない。準備完了の補助表現に限る
- `HOLD`: 情報不足、承認待ち、未決事項により Gate 判定を確定できない
- `FAIL`: P0 / P1 の設計欠陥がある。P2 は記録のうえで後続可
- `NOT APPLICABLE`: Architecture Gate 対象外の変更

## 成果物

- Architecture Gate 判定
- 整合チェック結果
- Findings（P0 / P1 / P2）
- 必要承認
- 次アクション

## 禁止事項

- merge、push、deploy を自動実行手順に含めること
- SharePoint変更、Microsoft 365変更、Entra ID変更を承認不要または自動実行として扱うこと
- 本番データ変更や物理削除を許可または手順化すること
- 未確認事項を推測で確定すること
- `HOLD` を `PASS` / `READY` と同義に扱うこと
- 設計不在のまま Architecture Gate を PASS にすること
- 現場運用・権限・障害時の不足を軽微扱いにすること

## 出力形式

```md
# architecture-review

## Summary
- 判定: PASS / HOLD / FAIL / NOT APPLICABLE
- Gate: Architecture Gate
- 対象:

## Checklist
- Domain 非依存:
- Contracts:
- SharePoint 対応:
- 権限:
- UI 未確定表示:
- DEC/ADR:
- 失敗時挙動:

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
