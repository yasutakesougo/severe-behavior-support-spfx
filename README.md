# 強度行動障害支援アプリ

## Purpose

同一法人・同一 Microsoft 365 テナント内の複数事業所で利用する、強度行動障害支援アプリの開発リポジトリです。

支援に必要な情報を、アセスメントから日々の記録と見直しまで一貫して扱うことを目標にしています。

## Target

| 対象 | 内容 |
|---|---|
| 利用者 | 同一法人内の支援職員（現場 / 計画 / 管理・監査） |
| 実行環境 | SharePoint Online 上の SPFx アプリ |
| 開発者 | このリポジトリを clone して、ローカル検証まで再現したい人 |

旧システムの fork、複製、Git 履歴の継承は行いません。

## Status

SPFx の実装基盤は構築済みです。

現場職員向け UI、計画担当者向け UI、管理・監査向け UI を、役割ごとの利用場面に合わせて段階的に実装しています。

現在の `main` には、合成 fixture を使った現場職員向け画面と Planning PC の支援計画管理デモを含みます。

```text
実装済み画面・デモがある
  ≠ LIVE WRITE 許可
  ≠ Production Binding 許可
  ≠ Deploy / App Catalog 許可
```

個別の Decision、Acceptance、Evidence、Gate、Handoff の最新状態は `docs/` と GitHub の live state を確認してください。

リポジトリの配布ライセンス（`LICENSE`）選定は別 Gate です。本 README の整備だけではライセンスは確定しません。

## Scope

概念上の主な流れは次のとおりです。

```text
Assessment
  ↓
SupportPlan
  ↓
Procedure
  ↓
ProcedureRecord
  ↓
Review
```

計画や手順と、その手順に基づいて行った記録を分離して保持します。

過去の計画・手順と当時の記録の関係を失わないことを重視します。

## Role / Device

1つのアプリ内で、役割に応じて入口と情報の優先順位を変えます。

| Role | 主な利用場面 | 主な端末 | UI の重点 |
|---|---|---|---|
| `FIELD_STAFF` | 日々の支援・記録 | Tablet | 今日の支援、未記録、利用者、手順確認、記録入力 |
| `PLANNER` | アセスメント・計画・モニタリング | PC | Assessment、SupportPlan、観察、見直し |
| `ADMIN_AUDIT` | 運用状況・制度適合の確認 | PC | 状態確認、証跡、監査・管理上の確認 |

役割ごとに別アプリへ分割するのではなく、共通の domain / contract を使いながら presentation を分けます。

## Technology

| 項目 | 現行構成 |
|---|---|
| SharePoint Framework | SPFx `1.23.2` |
| Node.js | root `22.23.1`（`.node-version`） / SPFx `>=22.14.0 <23.0.0` |
| React / React DOM | `17.0.1` |
| SPFx TypeScript | `~5.8.3` |
| root TypeScript | `5.9.2` |
| Build | Heft + SPFx build rig |
| UI | React + Fluent UI v8 |
| Host | SharePoint Online |

SPFx 固有の依存関係と build 境界は `spfx/` に分離しています。詳細は `spfx/README.md` を参照してください。

## Data and environment boundaries

開発・テスト・デモでは、実在情報を加工したデータではなく、合成 fixture を使用します。

実在情報または匿名化状態を確認できない情報は持ち込みません。

| 境界 | 扱い |
|---|---|
| synthetic fixture | 許可（`tests/fixtures/`、`synthetic-*`） |
| 本番データ / 個人情報 | 禁止（repository / fixture / log / Evidence へ持ち込まない） |
| SharePoint read と write | 同一権限として扱わない |
| LIVE WRITE / schema 変更 | 明示的な Human GO が必要 |
| Microsoft 365 / Entra ID mutation | 明示的な Human GO が必要 |
| App Catalog Deploy | 明示的な Human GO が必要（Deploy GO は Human-only） |

README の記述だけを根拠に、本番接続や本番変更を開始しません。

## Getting Started

外部利用者が、このリポジトリだけでローカル検証まで再現するための入口です。

live tenant I/O、Production Binding、Deploy は含みません。

### Prerequisites

- Node.js `22.23.1`（ルート。正本は `.node-version` と `package.json` の `engines`）
- npm（`package-lock.json` に合わせた `npm ci`）
- Git

SPFx 境界を触る場合は、追加で Node.js `>=22.14.0 <23.0.0` を満たすこと（通常はルートと同じ 22.x で問題ありません）。

### 1. Clone

```bash
git clone https://github.com/yasutakesougo/severe-behavior-support-spfx.git
cd severe-behavior-support-spfx
```

### 2. Install（root）

ルートの contracts / domain / CI を使う場合:

```bash
npm ci
```

### 3. Verify（root）

```bash
npm test
npm run typecheck
npm run lint
npm run verify:ci
```

`verify:ci` は skills、UI catalog / templates、lint、format、typecheck、unit test、contract boundary、scope、accessibility gate などをまとめて確認します。

### 4. Install / Verify（SPFx・任意）

SPFx を扱う場合のみ:

```bash
cd spfx
npm ci
npx heft test --clean
```

本番相当の package 確認が必要な場合:

```bash
cd spfx
npx heft test --clean --production
npx heft package-solution --production
```

これらのローカル検証は、live tenant I/O や Deploy の許可を意味しません。

### 5. Browser smoke（任意）

`spfx/smoke/**` 配下に slice ごとの `run-smoke.mjs` と証跡 docs があります。

smoke は synthetic / presentation 境界を維持します。本番データ・個人情報は使いません。

証跡の例: `docs/architecture/shell-ux-*-browser-smoke.md`, `docs/architecture/dashboard-ux-1-browser-smoke.md`

## Repository layout

```text
.agents/          Agent / Skill / Command / MCP policy
docs/             Decision / Architecture / Process / Evidence
src/              Domain / Contract / Application 境界
tests/            Domain / Contract / Fixture のテスト
scripts/          CI / verification / repository automation
spfx/             SharePoint Framework 固有実装
  src/            Web Part / Shell / Adapter / presentation
  smoke/          Browser smoke と slice ごとの検証
```

ディレクトリごとの詳細な責務は、各 README と `docs/` の正本を参照してください。

## Canonical sources

README は、プロジェクトの目的、開発入口、現在の大きな境界を確認するための索引です。

README 自体を、個別 Decision や最新 Gate の正本にはしません。

状態や許可を判断するときは、原則として次の順で確認します。

1. Accepted / LOCKED Decision（`docs/decisions/` など）
2. GitHub Issue / Pull Request の live state
3. 観測 Evidence
4. `docs/architecture/`
5. `SECURITY.md` と関連する security 文書

エージェント向けの短い入口は `AGENTS.md` です。

品質ゲートの入口は `docs/development/quality-gates.md`、Governance の入口は `docs/process/ai-governance.md` です。

## Security

セキュリティ境界の入口は [`SECURITY.md`](./SECURITY.md) です。

- Secret、token、Cookie、個人情報を repository、fixture、log、Evidence へ記録しない
- Security finding は candidate / verified / fix authorization / production GO を分離して扱う
- unverified finding をそのまま修正完了や本番 GO とみなさない

脆弱性報告やセキュリティ上の懸念は、Issue に個人情報・秘密情報を貼らず、`SECURITY.md` の境界を守ったうえで連絡してください。

## Issues

不具合・改善・質問は GitHub Issues を使います。

Issue を書くとき:

- 再現手順、期待結果、実際の結果を書く
- 合成 fixture / ローカル検証の範囲か、実環境の話かを明示する
- token、Cookie、Secret、個人情報、実在利用者・職員の識別子を貼らない
- LIVE WRITE / Deploy / 本番変更の依頼は、明示 Human GO 前提の別判断になる

## Contribution

貢献の入口:

1. 変更意図を Issue で共有する（可能な場合）
2. feature branch で変更する（`main` への直接 push はしない）
3. Pull Request を作成する（テンプレート: `.github/pull_request_template.md`）
4. CI（`verify:ci` など）とレビュー観点を満たす
5. Ready / Merge は Human GO（Fresh Review → Human Merge GO）が別途必要

貢献時に崩さない境界:

- synthetic fixture のみ（本番データ持ち込み禁止）
- domain / SPFx / schema / production binding を、承認されていない範囲で変更しない
- LIVE WRITE、Deploy、SharePoint / Microsoft 365 / Entra ID mutation を PR だけで開始しない

プロセスの詳細は `docs/process/ai-workflow.md`、`docs/process/ai-governance.md`、`docs/development/quality-gates.md` を参照してください。

`LICENSE` ファイルの追加・選定は別 Gate です。この Contribution 節はライセンス選定を代替しません。

## Reuse boundaries

旧システムからは、確認済みの業務上の意味と境界条件だけを参照します。

旧システムの画面、保存処理、SharePoint 列、権限設定、公開処理、利用者識別子、事業所固有値を、そのまま新実装へ持ち込みません。

旧実装の schema や Internal Name を、新しい SharePoint schema の根拠として自動採用しません。

必要な情報は、このリポジトリ内の Accepted / LOCKED Decision と確認済み Evidence に基づいて再構成します。

## Reference sources

旧 `audit-management-system-mvp` は、一次棚卸しと移行判断の参照元の一つです。

旧リポジトリの特定 SHA、画面、保存処理、schema、fixture、実装を、そのまま現在の正本またはコピー元として扱いません。

現在の設計・実装判断は、このリポジトリ内で Accepted された Decision と確認済みの一次情報に基づきます。
