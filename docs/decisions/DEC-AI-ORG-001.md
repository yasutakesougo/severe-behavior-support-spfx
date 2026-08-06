# DEC-AI-ORG-1: AI開発組織構成の採用可否

- ID: DEC-AI-ORG-1
- ファイル: `docs/decisions/DEC-AI-ORG-001.md`
- 状態: 承認
- 作成日: 2026-08-06
- 決定日: 2026-08-06
- 正本参照: `docs/process/ai-org-onboarding-implementation-plan.md`
- 前提: PR #45（merge `996cd4719bcdbb457675dbac55f303eb092d0855`）は HOLD 付き実装計画の正本であり、実装開始承認を含まない

## 判断する対象

本 DEC が決める対象は次のみとする。

- 強度行動障害支援アプリの開発プロセスに、次の論理分離を持つ AI開発組織構成を採用するか
  - Role
  - Governance
  - Skills
  - Agents
  - Commands
  - Workflows
  - MCP

本 DEC は、現行の最小実用セット Skill（`implementation-plan` / `implementation-review` / `merge-audit` / `handoff-builder`）と `docs/process/` の工程正本を前提とする。

## 本 DEC で決めないこと

次は本 DEC の対象外とする。別文書で個別に判断する。

| 対象外 | 判断文書 |
|---|---|
| 本リポジトリ専用か、法人内他アプリでも再利用するか | DEC-AI-ORG-2 |
| ファイルとディレクトリの物理配置 | ADR-AI-ORG-1 |
| AI に許可する操作と人の承認境界（MCP 権限マトリクス） | DEC-AI-ORG-3 |

加えて、本 DEC は次を承認しない。

- ディレクトリ新設
- 既存正本の移動
- Skill / Agent / Command / MCP の実装着手
- SharePoint / Microsoft 365 / Entra ID / 本番変更
- HOLD の解除
- DEC-AI-ORG-2 以降の内容

## 背景

現行資産は次のように分散している。

- 工程・Gate・カタログ: `docs/process/`
- 品質ゲート: `docs/development/quality-gates.md`
- Skill 実行実体: `.agents/skills/`
- 決定記録: `docs/decisions/`

論理レイヤ（役割・ルール・手順・担当・実行順・接続権限）が文書上で分離されていないと、AI オンボーディング時に判断単位が混ざる。

PR #45 の計画は、この論理分離を導入手順として固定したが、採用そのものは未決のまま HOLD としている。

## 選択肢

### A. 採用する

Role / Governance / Skills / Agents / Commands / Workflows / MCP の論理分離を、本リポジトリの AI 開発組織構成として採用する。

### B. 採用しない

現行の `docs/process/` + `.agents/skills/` 構成を維持し、AI開発組織構成という追加レイヤは導入しない。

## 決定

**選択肢 A を承認する。**

Role / Governance / Skills / Agents / Commands / Workflows / MCP の論理分離構成を採用する。

理由:

- 現行工程の責務（要件・設計・実装計画・レビュー・監査）と対応しやすい
- Skill・Agent・Command・Workflow を独立に拡張できる
- 特定ツール（Codex / Cursor / Claude Code 等）に依存しない論理モデルを先に固定できる
- PR #45 でレビュー済みの計画と整合する

## 承認記録

- 承認内容: 選択肢 A（論理分離構成の採用）
- 承認日: 2026-08-06
- 承認範囲の上限:
  - HOLD は維持する
  - 実装開始は承認しない
  - ディレクトリ新設は承認しない
  - 既存正本移動は承認しない
  - DEC-AI-ORG-2 以降の内容は承認しない

## 本決定の効力と非効力

### 効力

- AI開発組織構成の論理分離を採用済みとして扱う
- 計画正本 `docs/process/ai-org-onboarding-implementation-plan.md` の「採用」判断単位を閉じる
- 以降の Decision Units（DEC-AI-ORG-2 / ADR-AI-ORG-1 / DEC-AI-ORG-3）を、この論理構成を前提に**個別作成**してよい（各文書の内容承認は別途）

### 非効力

- HOLD は維持する
- 実装開始承認にはならない
- ディレクトリ新設は引き続き禁止する
- 既存正本移動は引き続き禁止する
- DEC-AI-ORG-2 / ADR-AI-ORG-1 / DEC-AI-ORG-3 の内容を先取り・承認しない

## 次工程

本 DEC は `承認` 済みである。次を個別に作成・承認する。

```text
DEC-AI-ORG-2
→ ADR-AI-ORG-1
→ DEC-AI-ORG-3
```

後続文書の作成は本 DEC の論理採用を前提とするが、各文書の決定内容は個別承認が必要である。
