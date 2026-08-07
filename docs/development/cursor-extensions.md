# Cursor おすすめ拡張機能

- 文書: `docs/development/cursor-extensions.md`
- 位置づけ: 本リポジトリ（TypeScript / 将来の SPFx・React）向けの Cursor 拡張機能ガイド
- 対象: ローカル開発で Cursor を使う開発者
- 補足: Cursor は VS Code ベースのため、多くの VS Code 拡張がそのまま使える（Open VSX 経由）。一部の Microsoft 公式拡張は制限がある場合がある

ワークスペース推奨は `.vscode/extensions.json` にも定義する。Cursor でリポジトリを開くとインストール提案が表示される。

## 必須・高優先度

ほぼ全員におすすめする最小セット。

| 拡張機能 | ID / 検索名 | 用途 |
|---|---|---|
| ESLint | `dbaeumer.vscode-eslint` | コード品質チェック。Cursor の AI が Lint エラーを自動修正しやすくなる。設定正本は `eslint.config.mjs`、実行は `npm run lint` |
| Prettier | `esbenp.prettier-vscode` | コード自動フォーマット |
| GitLens | `eamodio.gitlens` | Git 履歴・Blame・比較の可視化 |
| Error Lens | `usernamehw.errorlens` | エラー・警告を行内に直接表示 |
| Japanese Language Pack | `MS-CEINTL.vscode-language-pack-ja` | UI の日本語化 |

## 本リポジトリ向け（TypeScript / React / SPFx）

現工程は contracts / domain 中心。SPFx 画面実装に入ったらフロントエンド系を追加する。

| 拡張機能 | ID / 検索名 | 用途 | いつ入れるか |
|---|---|---|---|
| Path Intellisense | `christian-kohler.path-intellisense` | ファイルパスの補完 | 今から |
| Auto Rename Tag | `formulahendry.auto-rename-tag` | HTML/JSX の開始・終了タグ同期 | SPFx / React 着手時 |
| ES7+ React/Redux/React-Native snippets | `dsznajder.es7-react-js-snippets` | React 系スニペット | SPFx / React 着手時 |
| Tailwind CSS IntelliSense | `bradlc.vscode-tailwindcss` | Tailwind クラス補完・プレビュー | Tailwind 採用時のみ |

TypeScript / JavaScript の言語サポートは Cursor 標準で十分充実している。追加の必須は ESLint + Prettier。

## 便利系・生産性

必要になったものだけ入れる。

| 拡張機能 | ID / 検索名 | 用途 |
|---|---|---|
| DotENV | `mikestead.dotenv` | `.env` のシンタックスハイライト |
| Todo Tree | `gruntfuggly.todo-tree` | TODO コメントの一覧・ジャンプ |
| Code Spell Checker | `streetsidesoftware.code-spell-checker` | スペルチェック |
| indent-rainbow | `oderwat.indent-rainbow` | インデントの視認性向上 |
| Bookmarks | `alefragnani.bookmarks` | コード内のお気に入り位置 |

## 言語別（本リポジトリ外の参考）

本リポジトリの主言語は TypeScript だが、他スタック向けの目安も残す。

| 言語 | おすすめ |
|---|---|
| Python | Python（Microsoft または Anysphere 版）、Pylance / Ruff |
| TypeScript / JS | 標準 + ESLint + Prettier |
| Go | Go（公式） |
| Rust | rust-analyzer |
| Docker | Docker |

## 注意点・避けるもの

- GitHub Copilot は Cursor の Tab 補完と競合しやすいので、基本不要（入れない方がよい）
- あまり使われていない・更新が止まっている拡張は避ける（セキュリティリスク）
- 拡張は入れすぎると重くなる。本当に必要なものだけに絞る

## インストール方法

1. `Ctrl + Shift + X`（Mac は `Cmd + Shift + X`）で拡張機能ビューを開く
2. 検索ボックスに名前または ID を入力する
3. Install をクリックする

VS Code から移行した場合は、Cursor Settings → General → Account → Import で拡張機能を一括インポートできる。

ワークスペース推奨から入れる場合は、リポジトリを開いたときに表示される「Install Recommended Extensions」を使う。
