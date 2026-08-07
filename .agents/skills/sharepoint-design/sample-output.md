# sharepoint-design sample

## Summary
- 判定: HOLD
- 対象: SupportPlan 永続化設計
- 対象リポジトリ: severe-behavior-support-spfx

## Mapping
- List / 列対応: 未作成
- 権限: 未確定
- 事業所分離: OrganizationId + SiteId 前提（Domain 側は確定）

## Failure Behavior
- 取得失敗: 未定義
- 保存失敗: 未定義
- 競合: 未定義

## Out of Scope
- SharePoint本番変更: 禁止
- App Catalog: 禁止
- Entra ID / Microsoft 365: 禁止

## Findings
| ID | 重大度 | 状態 | 内容 | 根拠 | 対応 |
|---|---|---|---|---|---|
| F-001 | P1 | OPEN | 永続化対応表が未作成 | 設計正本なし | HOLD |

## HOLD
- SharePoint 永続化は別承認・別 Issue

## Approvals
- 必要な承認: 設計着手承認（永続化）
- 承認状態: 未取得

## Next Actions
1. 永続化 Issue を分離する
2. 本番変更を含めないことを再確認する
