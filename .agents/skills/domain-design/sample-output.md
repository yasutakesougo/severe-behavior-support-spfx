# domain-design sample

## Summary
- 判定: READY
- 対象 Domain: SupportPlan status transition
- 対象リポジトリ: severe-behavior-support-spfx

## Scope
- 対象範囲: ステータス遷移の純粋判定
- 対象外: 永続化、adapter、UI、承認者判定

## Design
- 入出力: 現状態 + 遷移要求 → 許可 / 拒否
- 不変条件: 許可遷移表以外は拒否
- 失敗表現: reasonCode

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
1. schema-design で DTO 表現を固定する
2. architecture-review へ進む
