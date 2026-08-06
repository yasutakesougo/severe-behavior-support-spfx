# merge-audit sample

## Summary
- 判定: HOLD
- 対象PR: draft skill process rollout
- head SHA: abcdef1
- base SHA: 1234567
- マージ可否: 不可

## Scope Audit
- 変更範囲: docs/process、.agents/skills、scripts/verify-skills.mjs、package.json
- 対象外変更: なし

## CI and Tests
- CI 結果: verify:skills / typecheck / test は成功
- テスト結果: 成功
- 未実行テスト: verify:contracts は任意実施
- 既知失敗: なし
- 新規失敗: なし

## Findings
| ID | 重大度 | 状態 | 内容 | 根拠 | 対応 |
|---|---|---|---|---|---|
| F-001 | P1 | OPEN | 人による merge 承認が未取得 | 承認証跡がない | 承認取得まで HOLD |

## Unresolved Reviews
- なし

## HOLD
- merge 承認待ち

## Approvals
- merge 承認要否: 必須
- 承認状態: 未取得
