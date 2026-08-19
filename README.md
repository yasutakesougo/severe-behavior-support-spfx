# 強度行動障害支援アプリ

同一法人・同一 Microsoft 365 テナント内の複数事業所で利用する、強度行動障害支援アプリの開発リポジトリです。

このリポジトリは Private で運用します。

旧システムの fork、複製、Git 履歴の継承は行いません。

## このアプリが扱う範囲

支援に必要な情報を、アセスメントから日々の記録と見直しまで一貫して扱うことを目標にしています。

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

## 現在の開発段階

SPFx の実装基盤は構築済みです。

現場職員向け UI、計画担当者向け UI、管理・監査向け UI を、役割ごとの利用場面に合わせて段階的に実装しています。

現在の `main` には、合成 fixture を使った現場職員向け画面と Planning PC の支援計画管理デモを含みます。

実装済みの画面やデモが存在していても、それだけで SharePoint の LIVE WRITE、Production Binding、Deploy が許可されたことにはなりません。

個別の Decision、Acceptance、Evidence、Gate、Handoff の最新状態は `docs/` と GitHub の live state を確認してください。

## Role / Device 方針

1つのアプリ内で、役割に応じて入口と情報の優先順位を変えます。

| Role | 主な利用場面 | 主な端末 | UI の重点 |
|---|---|---|---|
| `FIELD_STAFF` | 日々の支援・記録 | Tablet | 今日の支援、未記録、利用者、手順確認、記録入力 |
| `PLANNER` | アセスメント・計画・モニタリング | PC | Assessment、SupportPlan、観察、見直し |
| `ADMIN_AUDIT` | 運用状況・制度適合の確認 | PC | 状態確認、証跡、監査・管理上の確認 |

役割ごとに別アプリへ分割するのではなく、共通の domain / contract を使いながら presentation を分けます。

## 技術構成

主要な技術境界は次のとおりです。

| 項目 | 現行構成 |
|---|---|
| SharePoint Framework | SPFx `1.23.2` |
| Node.js | root `22.23.1` / SPFx `>=22.14.0 <23.0.0` |
| React / React DOM | `17.0.1` |
| SPFx TypeScript | `~5.8.3` |
| root TypeScript | `5.9.2` |
| Build | Heft + SPFx build rig |
| UI | React + Fluent UI v8 |
| Host | SharePoint Online |

SPFx 固有の依存関係と build 境界は `spfx/` に分離しています。

## データと実環境の境界

開発・テスト・デモでは、実在情報を加工したデータではなく、合成 fixture を使用します。

実在情報または匿名化状態を確認できない情報は持ち込みません。

SharePoint の read と write は同じ権限として扱いません。

LIVE WRITE、schema 変更、Microsoft 365 / Entra ID の mutation、App Catalog への Deploy は、それぞれ明示的な Human GO が必要です。

README の記述だけを根拠に、本番接続や本番変更を開始しません。

## 再利用境界

旧システムからは、確認済みの業務上の意味と境界条件だけを参照します。

旧システムの画面、保存処理、SharePoint 列、権限設定、公開処理、利用者識別子、事業所固有値を、そのまま新実装へ持ち込みません。

旧実装の schema や Internal Name を、新しい SharePoint schema の根拠として自動採用しません。

必要な情報は、このリポジトリ内の Accepted / LOCKED Decision と確認済み Evidence に基づいて再構成します。

## リポジトリ内の正本

README は、プロジェクトの目的、開発入口、現在の大きな境界を確認するための索引です。

README 自体を、個別 Decision や最新 Gate の正本にはしません。

状態や許可を判断するときは、原則として次の順で確認します。

1. Accepted / LOCKED Decision
2. GitHub Issue / Pull Request の live state
3. 観測 Evidence
4. `docs/architecture/`
5. `SECURITY.md` と関連する security 文書

個別 Decision、Acceptance、観測証跡、Gate、Handoff の詳細は `docs/` 配下を参照してください。

エージェント向けの短い入口は `AGENTS.md` です。

## 主なディレクトリ

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

## セットアップ

ルートの contract / domain / CI を使う場合は、ルートで依存関係をインストールします。

```bash
npm ci
```

SPFx を扱う場合は、`spfx/` 側でも依存関係をインストールします。

```bash
cd spfx
npm ci
```

Node.js の基準は `.node-version` と各 `package.json` を正本としてください。

## 検証

ルートの主要な検証は次のコマンドで実行できます。

```bash
npm test
npm run typecheck
npm run lint
npm run verify:ci
```

`verify:ci` は、skills、UI catalog / templates、lint、format、typecheck、unit test、contract boundary、scope、accessibility gate をまとめて確認します。

SPFx 側の主要な検証は次のとおりです。

```bash
cd spfx
npx heft test --clean
npx heft test --clean --production
npx heft package-solution --production
```

これらのローカル検証は、live tenant I/O や Deploy の許可を意味しません。

## Security

セキュリティ境界の入口は `SECURITY.md` です。

Secret、token、Cookie、個人情報を repository、fixture、log、Evidence へ記録しません。

Security finding は、candidate、verified、fix authorization、production GO を分離して扱います。

## 参照元

旧 `audit-management-system-mvp` は、一次棚卸しと移行判断の参照元の一つです。

旧リポジトリの特定 SHA、画面、保存処理、schema、fixture、実装を、そのまま現在の正本またはコピー元として扱いません。

現在の設計・実装判断は、このリポジトリ内で Accepted された Decision と確認済みの一次情報に基づきます。
