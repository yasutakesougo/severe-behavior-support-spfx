# Agent Collaboration Contract

- 文書: `.agents/orchestration/collaboration-contract.md`
- 位置づけ: 既存 Agent 間の協働境界を定義する Adapter 契約
- 正本変更: なし

## 目的

複数の Agent が同じ task を分担するとき、会話履歴への依存を減らし、既存の Workflow、Gate、Human GO、権限境界を維持する。

## 正本

本契約は新しい Role、Workflow、権限を定義しない。

優先する正本:

1. `AGENTS.md` が示す参照順
2. `.agents/agents/` の各 Agent 定義
3. `docs/process/ai-workflow.md` と `docs/process/development-process.md`
4. `docs/decisions/DEC-AI-ORG-003.md`
5. `.agents/mcp/permission-matrix.md`

矛盾時は上位正本を優先し、本契約で権限を拡張しない。

## 協働モデル

Agent は共有チャットを暗黙の状態保存先にしない。
Agent 間の受け渡しは `.agents/orchestration/handoff-format.md` に従う。

標準形:

```text
Human / caller
  -> canonical workflow stage
  -> responsible Agent
  -> structured handoff
  -> next responsible Agent
  -> required Gate
  -> Human GO when required
```

Agent は自分の担当外工程を代行せず、次の正規担当へ引き渡す。

## 並列実行

Read-only の調査は、同一 task / base SHA / scope を共有できる場合に並列化してよい。

並列 Agent は互いの未確定推論を前提にしない。
結果は findings と evidence として統合する。

同じ working tree の同一ファイルを複数の write Agent が並列変更しない。
Write を並列化する場合は独立 worktree または非重複ファイル境界を使い、統合時に再検証する。

## Gate

handoff は承認ではない。

次の状態は handoff により自動取得しない:

- Implementation Start GO
- GitHub mutation authorization
- Review PASS
- Ready GO
- Merge GO
- Deploy GO
- SharePoint / Entra / Microsoft 365 / production mutation authorization

承認が対象・範囲・版に拘束される場合、base/head SHA や対象が変化した時点で再確認する。

## 失敗時

必要な証跡、正本、authorization、base/head が不足する場合は `HOLD` とする。
Agent は不足情報を推測して次工程へ進めない。

## コスト境界

handoff は会話全文を複製しない。
次工程に必要な事実、証跡、差分、risk、next action だけを保持する。
モデルやツールの選択は Adapter 層の都合であり、正本の Role / Gate / permission を変更しない。
