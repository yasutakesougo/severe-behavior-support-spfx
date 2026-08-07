# release-review

## 目的

マージ後またはリリース候補時点で、Release Gate に向けたリリース可否判定材料を作ります。

deploy 自体は実行しません。

## 使用する場面

- Logical Command `release-check` 起動時
- main 反映後のリリース判定
- 検証環境 deploy 承認前の確認

## 入力

- main 基準 SHA
- 対象リリース / artifact
- 環境差分
- 権限影響
- ロールバック手順
- 受入条件の達成証跡
- deploy / 本番承認状態

## 前提条件

- Release Gate 定義を参照できる
- 対象 SHA / artifact を固定できる、または不足を HOLD にできる

## 実行手順

1. main 基準 SHA と成果物を固定する
2. 環境差分を列挙する
3. 権限影響を確認する
4. ロールバック手順を確認する
5. 受入証跡を確認する
6. deploy / 本番承認の要否と状態を記録する
7. Release Gate 判定を出す（実行はしない）

## 確認項目

- main 基準 SHA が固定されているか
- 対象リリースと成果物が定義されているか
- 環境差分が明示されているか
- 権限影響が確認されているか
- ロールバック手順があるか
- 受入条件の達成証跡があるか
- deploy 承認と本番承認の状態が明示されているか

## 停止条件

- SHA / artifact 不明
- deploy 承認がないまま実行を求められている
- ロールバック未確認
- 本番変更が工程に含まれる

## 判定基準

- `PASS`: Release Gate 通過条件を満たす（deploy 実行許可そのものではない。人の事前承認が別途必要）
- `READY`: この Skill では原則使用しない
- `HOLD`: 承認待ち、証跡不足、環境差分未整理
- `FAIL`: P0 / P1 のリリースブロッカーがある。P2 は後続可
- `NOT APPLICABLE`: リリース対象がない

## 成果物

- Release Gate 判定
- SHA / artifact
- 環境差分
- ロールバック
- 承認状態
- Findings（P0 / P1 / P2）

## 禁止事項

- merge、push、deploy を自動実行手順に含めること
- SharePoint変更、Microsoft 365変更、Entra ID変更を承認不要または自動実行として扱うこと
- 本番データ変更や物理削除を許可または手順化すること
- 未確認事項を推測で確定すること
- `HOLD` を `PASS` / `READY` と同義に扱うこと
- deploy を本 Skill の完了条件として実行すること
- 本番環境への deploy や SharePoint App Catalog 登録を手順化すること

## 出力形式

```md
# release-review

## Summary
- 判定: PASS / HOLD / FAIL / NOT APPLICABLE
- Gate: Release Gate
- main SHA:
- artifact:

## Checklist
- 環境差分:
- 権限影響:
- ロールバック:
- 受入証跡:
- deploy 承認:
- 本番承認:

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
