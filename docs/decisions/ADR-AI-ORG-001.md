# ADR-AI-ORG-1: AI開発組織構成の物理配置

- ID: ADR-AI-ORG-1
- ファイル: `docs/decisions/ADR-AI-ORG-001.md`
- 状態: 承認待ち
- 作成日: 2026-08-06
- 決定日: 未定
- 正本参照: `docs/process/ai-org-onboarding-implementation-plan.md`
- 前提:
  - DEC-AI-ORG-1 は承認済み（論理分離構成を採用）
  - DEC-AI-ORG-2 は承認済み（法人内の他アプリでも再利用可能な論理モデルとして設計）
  - DEC-AI-ORG-2 merge commit: `1c9084b54a5965d44522f12bee597f9422161b51`
  - HOLD は維持。実装開始・ディレクトリ新設・既存正本移動は禁止継続

## 判断する対象

本 ADR が決める対象は、DEC-AI-ORG-1で採用した論理レイヤの物理配置のみとする。

- 人が読む正本入口を置く場所
- AIが参照・実行する定義を置く場所
- DEC / ADRを置く場所
- 検証スクリプトが参照する対象パス

## 本 ADR で決めないこと

| 対象外 | 判断文書 / 扱い |
|---|---|
| AI許可操作と人の承認境界 | DEC-AI-ORG-3 |
| MCP接続先の認証・権限設定 | 後続。現時点では実装しない |
| Skill / Agent / Command / Workflowの本文 | 後続の個別Issue / PR |
| 旧`skills/`の移行・廃止 | 後続の個別判断と移行Issue |
| 他アプリへの適用・複製・移植・共通化 | 各アプリの個別判断と実装開始承認が必要 |
| 共通リポジトリ新設・共通パッケージ化 | 本ADRでは承認しない |
| ディレクトリ新設・既存正本移動・実装着手 | 禁止継続 |
| HOLDの解除 | しない |

## 配置原則

- 既存の正本体系を優先し、同じ意味の文書を別の場所へ二重化しない
- 人向けの工程入口とAI実行実体を分離する
- ツール固有名を正本パスに使用しない
- 空ディレクトリを先行作成しない
- 新しいファイルやディレクトリは、将来の実装開始承認後に必要な単位で追加する
- 既存ファイルを移動する場合は、参照更新・検証・移行完了条件を同一の個別計画で扱う

## 選択肢

### A. 既存正本を維持したハイブリッド配置

人が読む正本入口を`docs/process/`、AI実行実体を`.agents/`、判断記録を`docs/decisions/`に置く。

```text
docs/process/
├─ ai-role.md
├─ ai-governance.md
└─ ai-workflow.md

.agents/
├─ skills/       # 既存正本を維持
├─ agents/       # 将来の実装対象
├─ commands/     # 将来の実装対象
└─ mcp/          # 将来の権限マトリクス実体

docs/decisions/
├─ DEC-AI-ORG-001.md
├─ DEC-AI-ORG-002.md
├─ ADR-AI-ORG-001.md
└─ DEC-AI-ORG-003.md
```

補足:

- `docs/process/ai-*.md`は、人が読む単一の入口とする
- `.agents/skills/`は、現行のAI実行実体の正本として維持する
- `.agents/agents/`、`.agents/commands/`、`.agents/mcp/`は、実装開始承認後に必要ファイルと同時に追加する
- `docs/development/quality-gates.md`、`docs/process/gate-definitions.md`、`docs/process/development-process.md`の内容は移動せず、`ai-governance.md`から参照する
- `scripts/verify-skills.mjs`は、後続PRで確定パスと禁止参照を検証する

### B. `docs/ai-org/`へ論理文書を集約する

Role / Governance / Workflows / Agents / Commands / MCPの説明を`docs/ai-org/`へ集約する。

AI実行実体は`.agents/skills/`に残す。

この方式は文書を一覧しやすいが、既存の`docs/process/`と工程正本が分散する。

### C. 独立した法人共通リポジトリへ正本を分離する

AI開発組織構成の正本を、本アプリとは別の共通リポジトリに置く。

DEC-AI-ORG-2は再利用可能な論理モデルを承認したが、共通リポジトリ新設や移植は承認していない。

また、`docs/decisions/0001-separate-repository.md`は、複数アプリで安定した再利用が確認されるまで共通ライブラリを作成しない方針を定めている。

したがって、現時点では選択肢Cを採用しない。

## 決定（提案）

**選択肢Aを採用する。**

既存の正本体系を維持し、次の責務で配置する。

- 人向け正本入口: `docs/process/ai-role.md`、`docs/process/ai-governance.md`、`docs/process/ai-workflow.md`
- AI実行実体: `.agents/skills/`、将来の`.agents/agents/`、`.agents/commands/`、`.agents/mcp/`
- 判断記録: `docs/decisions/`
- 構造検証: `scripts/verify-skills.mjs`

理由:

- 現行の工程正本、品質ゲート、Skill正本との対応が明確である
- 既存正本を移動せずに論理レイヤを追加できる
- 人向け文書とAI実行実体の責務を分離できる
- DEC-AI-ORG-2の法人内再利用方針を、特定ツール名や番号付きツリーに依存せず表現できる
- 選択肢Bより既存`docs/process/`との二重正本化を避けやすい
- 選択肢Cの共通リポジトリ先行を避けられる

## 本決定の効力と非効力（承認後）

### 効力

- 後続文書と実装計画で使用する配置先を固定する
- `DEC-AI-ORG-3`は、`.agents/mcp/`を将来の権限マトリクス実体候補として扱ってよい
- 後続のIssue / PRは、本ADRのパスを前提として計画してよい

### 非効力

- HOLDは維持する
- 実装開始承認にはならない
- 本ADRの承認だけでは、`docs/process/ai-*.md`や`.agents/agents|commands|mcp/`を作成しない
- ディレクトリ新設は引き続き禁止する
- 既存正本移動は引き続き禁止する
- `.agents/skills/`配下の既存Skillを移動・改名しない
- 旧`skills/`の移行・削除を承認しない
- 共通リポジトリ新設・共通パッケージ化を承認しない
- 他アプリへの適用・複製・移植・共通化を承認しない
- DEC-AI-ORG-3の内容を先取り・承認しない

## 将来の実装条件

本ADRが承認されても、次の条件が揃うまでは物理変更を行わない。

- DEC-AI-ORG-3が個別承認されている
- 実装開始について人の明示承認がある
- 追加対象ごとにIssueとPRの範囲が分離されている
- 空ディレクトリを先行作成せず、必要ファイルと同時に追加する
- 正本の二重化がないことをレビューで確認する
- 既存正本を移動する場合は、参照更新と検証を同一計画に含める

## 承認条件

次を満たしたとき、状態を`承認`に更新し、決定日を記録する。

- 人による明示承認がある
- 判断対象が物理配置だけに限定されている
- DEC-AI-ORG-1とDEC-AI-ORG-2の決定内容と矛盾しない
- DEC-AI-ORG-3の権限境界を先取りしていない
- ディレクトリ作成や既存正本移動を実行していない

## 次工程

本ADRが`承認`になった後に限り、`DEC-AI-ORG-3`を個別に作成する。

ADR-AI-ORG-1が`承認待ち`の間は、後続Decision Unitの作成や物理変更に進まない。
