# handoff-builder — Issue Status Reconciliation Phase ①

## Summary
- 引き継ぎ文書判定: READY
- プロジェクト進行判定: HOLD（Phase ①完了；Phase ② Human resume 待ち；Implementation Start は別途 HOLD）
- 対象リポジトリ: yasutakesougo/severe-behavior-support-spfx
- main SHA: 658c790f34adb3489808121a72c6dcccbde97d2f（packet freeze；PR #194 tip may advance）
- 作業ブランチ: cursor/issue-status-reconciliation-f2c8

## References
- Issue: #5 / #10 / #11（CLOSED）；#6 / #8（OPEN；Phase ② later）
- PR: #194
- 正本リンク:
  - [`issue-status-reconciliation-packet.md`](./issue-status-reconciliation-packet.md)
  - [`issue-status-reconciliation-close-candidates-5-10-11.md`](./issue-status-reconciliation-close-candidates-5-10-11.md)
  - [`issue-status-reconciliation-phase1b-pass-handoff.md`](./issue-status-reconciliation-phase1b-pass-handoff.md)
  - [`decision-ilb-1-thirty-sixth-residual-issue-status-reconciliation-selection.md`](./decision-ilb-1-thirty-sixth-residual-issue-status-reconciliation-selection.md)

## Completed
- Thirty-sixth residual = Issue Status Reconciliation SELECTED
- 4群分類と推奨順を packet に固定
- #5 / #10 / #11 Close コメント下書き作成
- Phase ① Close 実行（Human）: #5 completed / #10 completed / #11 not_planned
- Phase ①b read-back PASS（#6 OPEN / #8 OPEN）
- #6 / #8 resync 下書き作成（未適用）
- Agent Issue mutation = 未実施（policy FORBIDDEN；Capability ≠ Authorization）

## Remaining
- Stop point: Phase ② READY / NOT STARTED
- When resumed: Phase ② #6 / #8 Current-state reconciliation（#8 OPEN 維持）
- After Phase ②: Phase ③ #4 / #9 / #12 / #15〜#19 個別再判定
- #20以降 / UI: 触らない
- EG-1 Human create: parallel；Issue 整理と混ぜない

## HOLD
- Phase ② / ③ until Human resumes / completes Phase ②
- Implementation Start
- SharePoint adapter / schema mapping implementation
- Agent GitHub Issue mutation
- Deploy / real data

## Forbidden Actions
- merge（Human / separate review）
- Agent push beyond current docs PR flow without need
- deploy
- 本番変更
- SharePoint変更
- Microsoft 365変更
- Entra ID変更
- 本番データ変更
- 物理削除
- closing #8
- batch-closing #15〜#19
- mixing EG-1 Human create into this flow

## Verification
- typecheck: N/A（docs）
- test: N/A（docs）
- audit: Phase ①b Human attestation PASS；GitHub Issue connector capability = AVAILABLE；Agent Issue mutation policy = FORBIDDEN（Capability ≠ Authorization）

## Next Actions
1. Remain stopped at Phase ② READY / NOT STARTED unless Human resumes
2. On resume: Human applies `issue-status-reconciliation-resync-6-8.md`
3. Keep #6 / #8 OPEN
