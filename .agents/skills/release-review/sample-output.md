# release-review sample

## Summary
- 判定: HOLD
- Gate: Release Gate
- main SHA: 1234567
- artifact: 未作成

## Checklist
- 環境差分: 未整理
- 権限影響: なし（docs / skills のみ想定）
- ロールバック: git revert 想定
- 受入証跡: verify:skills 等
- deploy 承認: 不要（deploy しない） / 本番承認: 不要
- 本番承認: 未実施（不要だが確認待ち）

## Findings
| ID | 重大度 | 状態 | 内容 | 根拠 | 対応 |
|---|---|---|---|---|---|
| F-001 | P1 | OPEN | artifact 未定義のまま release-check 完了を求められている | Release Gate | HOLD |

## HOLD
- リリース成果物未定義
- deploy しない方針の再確認待ち

## Approvals
- 必要な承認: リリース方針確認
- 承認状態: 未取得

## Next Actions
1. handoff-builder で現状を引き継ぐ
2. deploy しないことを明示したまま停止する
