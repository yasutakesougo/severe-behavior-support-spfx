# Tool Adapter: Cursor CLI

- 文書: `.agents/commands/adapters/cursor-cli.md`
- 位置づけ: Logical Command の Cursor CLI 向け Adapter
- 正本: Logical Command（`.agents/commands/*.md`）
- 対応表: `.agents/commands/adapter-matrix.md`
- 権限境界: `docs/decisions/DEC-AI-ORG-003.md`

## 対象ランタイム

- Cursor CLI（ローカルまたは CI 相当の非対話起動を含む）
- リポジトリ checkout 上で Agent / Skill 定義を読み取り実行する

## Logical Command 対応

| Logical Command | Cursor CLI での起動例 | Fallback |
|---|---|---|
| `new-feature` | CLI プロンプトで Logical Command `new-feature` を指定 | requirements 系 Skill 直接実行 |
| `review-pr` | CLI プロンプトで `review-pr` + PR URL/番号 + head SHA | review 系 Skill 直接実行 |
| `audit` | CLI プロンプトで `audit` + PR / SHA | `merge-audit` |
| `release-check` | CLI プロンプトで `release-check` | `release-review` + `handoff-builder` |

CLI 固有のサブコマンド名が未整備でも、Logical Command 名をプロンプトに含めて起動してよい。

## 入力契約

- 作業ディレクトリが対象リポジトリルートであること
- Logical Command 名
- 対象 Issue / PR / SHA（工程に応じて）
- 追加コンテキストファイルパス（任意）

## 出力契約

- stdout または指定ファイルへの Markdown 成果物
- 終了コードは「ツール実行の成否」であり、Skill 判定（PASS/HOLD/FAIL）そのものではない
- Skill 判定は出力本文の Summary に記録する

## Evidence

- 実行コマンド行
- cwd
- head SHA（`git rev-parse HEAD`）
- 関連する `npm run` 検証結果

## 停止条件

- リポジトリルート以外で実行され正本を解決できない
- 必要 SHA / PR が不明
- 禁止操作の実行要求
- Skill 未導入で完了要求

## 自動実行しないもの

- GitHub 投稿、Ready 化、マージ、deploy
- SharePoint / Entra ID / Microsoft 365 / 本番データ変更
- 保護ブランチ / main への直接 push / force-push

検証系（`typecheck` / `test` / `verify:skills` / `check:contracts-boundaries` / `check:scope`）のローカル実行は可。
