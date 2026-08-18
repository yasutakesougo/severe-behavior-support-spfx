# Background Agent 実行契約

- 文書: `docs/process/background-agent-contract.md`
- 位置づけ: Cursor Background / Cloud Agent がリポジトリ作業を行うときの入出力・Evidence・停止条件の正本
- 関連 Adapter: `.agents/commands/adapters/cursor-agent.md`
- Workflow: `docs/process/ai-workflow.md`
- 権限境界: `docs/decisions/DEC-AI-ORG-003.md`
- 自動 handoff: `scripts/auto-handoff.mjs`（`npm run handoff:auto`）

## 目的

Background Agent 実行を、再現可能な契約として固定する。

入力不足や証跡不足のまま完了扱いにせず、停止条件で Fail Closed する。

## 入力

必須:

| 項目 | 内容 |
|---|---|
| 対象リポジトリ | 例: `severe-behavior-support-spfx` |
| 作業目的 | 1 文。Issue / PR の範囲に拘束される |
| 起動手段 | Logical Command 名、Agent 名、または Skill 名 |
| 対象範囲 | 変更してよいパス / 主題 |
| 対象外 | 変更しないもの（本番変更、未承認仕様等） |

該当時必須:

| 項目 | 内容 |
|---|---|
| Issue | 番号または URL |
| PR | 番号または URL |
| head SHA | レビュー / 監査 / merge 判断時 |
| base SHA | 差分監査時 |
| 既知 HOLD | 継続する停止理由 |
| 承認証跡 | 実装開始承認など、対象・範囲・版付き |

不足している必須入力は推測で補完しない。`HOLD` とする。

## 出力

最低限含める:

| 項目 | 内容 |
|---|---|
| 判定 | `PASS` / `READY` / `HOLD` / `FAIL` / `NOT APPLICABLE` |
| 成果物 | Skill 出力または実装差分の要約 |
| Findings | P0 / P1 / P2 |
| HOLD | なし、または列挙 |
| Next Actions | 次の推奨作業 |
| Evidence | 下記 |

PR を扱う場合は、自動 handoff（または同等）で次を出力する。

- PR 状態
- head SHA
- CI 結果
- findings
- next action

`handoff:auto` は検証コマンドの成否を PASS/FAIL で記録してよいが、未実施・失敗・承認待ち・Draft を Gate `PASS` やプロジェクト進行 `READY` へ変換してはならない。Issue / PR / SHA 不足は引き継ぎ文書判定 `HOLD` とする。

## Evidence

Evidence は「実行したこと」と「見ていないこと」を区別して記録する。

必須 Evidence:

- 作業ブランチ
- `git rev-parse HEAD`（head SHA）
- 変更ファイル一覧（または差分要約）
- 実行した検証コマンドと結果

レビュー / 監査時の追加 Evidence:

- PR 番号と draft / open / merged などの状態
- base SHA ... head SHA
- CI: `verify:skills` / `typecheck` / `tests` / `check:contracts-boundaries` / `check:scope`
- unresolved findings 件数

禁止する偽 Evidence:

- 未実行コマンドを成功と書くこと
- 別 SHA の結果を流用すること
- HOLD を PASS と書き換えること

## 停止条件

次のいずれかで即座に停止し、次工程へ進まない。

1. 必須入力不足（対象、範囲、Issue/PR/SHA など）
2. 正本（DEC / ADR / Skill / Gate）と矛盾する要求
3. unresolved P0 または P1 がある状態での PASS / マージ推奨要求
4. Review PASS なし Merge 要求
5. merge / deploy / Ready 化の自動実行要求
6. SharePoint / Entra ID / Microsoft 365 / 本番データ変更 / 物理削除の実行要求
7. 承認証跡の対象・範囲・版が現操作と不一致
8. CI 必須チェック未実施または失敗なのに完了扱いを要求
9. 呼び出し Skill 未導入なのに当該工程の完了を要求
10. 自己参照 stale（マージ済み PR 自身の `Merge: NOT RUN` 等）だけを消す専用 sync PR の作成要求（Human 明示の hygiene-only を除く。正本: `docs/process/self-referential-gate-policy.md`）

停止時の出力は `HOLD` または `FAIL` とし、不足項目と Next Actions を残す。

## 許可されるローカル操作

実装開始承認済み、かつ承認済み Issue 範囲内:

- コード / 文書のローカル変更
- `git commit`
- 非保護 feature branch への通常 push
- `npm run typecheck` / `test` / `verify:skills` / `check:contracts-boundaries` / `check:scope` / `handoff:auto`

## 禁止操作

- マージ
- deploy
- Ready 化の自動実行
- GitHub 投稿の自動実行（案作成は可）
- 保護ブランチ / main への直接 push / force-push
- SharePoint変更 / Microsoft 365変更 / Entra ID変更
- 本番データ変更 / 物理削除

## 完了条件

Background Agent 実行が完了とみなせる条件:

1. 入力範囲内の成果物または HOLD/FAIL 理由がある
2. Evidence が揃っている
3. 停止条件に該当しない、または該当を明示して停止している
4. 自動 handoff が必要な節目では、PR 状態 / head SHA / CI / findings / next action が揃っている
5. 禁止操作を実行していない

## 関連正本

| 主題 | 正本 |
|---|---|
| Governance | `docs/process/ai-governance.md` |
| Workflow | `docs/process/ai-workflow.md` |
| 自己参照 Gate 方針 | `docs/process/self-referential-gate-policy.md` |
| Cursor Agent Adapter | `.agents/commands/adapters/cursor-agent.md` |
| Origin 評価（GitHub SSOT） | `docs/architecture/origin-evaluation-1.md` |
| handoff-builder | `.agents/skills/handoff-builder/SKILL.md` |
| auto-handoff | `scripts/auto-handoff.mjs` |
