# schema-design sample

## Summary
- 判定: READY
- 対象 Schema/DTO: SupportPlanStatusTransitionResult
- 対象リポジトリ: severe-behavior-support-spfx

## Design
- 必須/任意: planId / from / to / outcome 必須
- 未入力表現: 未使用（遷移結果は完全）
- 列挙値: outcome = allowed | rejected
- 互換性: 新規契約。既存破壊なし

## Findings
| ID | 重大度 | 状態 | 内容 | 根拠 | 対応 |
|---|---|---|---|---|---|
| — | — | — | なし |  |  |

## HOLD
- なし

## Approvals
- 必要な承認: なし
- 承認状態: N/A

## Next Actions
1. contracts-review で互換性を再確認する
2. 契約テストを追加する
