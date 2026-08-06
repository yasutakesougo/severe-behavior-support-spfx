# handoff-builder sample

## Summary
- 引き継ぎ文書判定: READY
- プロジェクト進行判定: HOLD
- 対象リポジトリ: severe-behavior-support-spfx
- main SHA: 1234567
- 作業ブランチ SHA: abcdef1

## References
- Issue: 開発プロセスSkillの共通規約と最小実用セットを追加する
- PR: draft skill minimum set
- 正本リンク: docs/process/development-process.md

## Completed
- 完了事項: 共通規約、4 Skill、verify:skills、npm script を追加

## Remaining
- 未完了事項: 匿名化した既存 Issue による試行

## HOLD
- merge 承認待ち

## Forbidden Actions
- merge
- push
- deploy
- 本番変更
- SharePoint変更
- Microsoft 365変更
- Entra ID変更
- 本番データ変更
- 物理削除

## Verification
- typecheck: 成功
- test: 成功
- audit: verify:skills 成功

## Next Actions
1. 次の実装 Issue で 4 Skill を試行する
2. Finding を記録して第 2 段階へ進む
