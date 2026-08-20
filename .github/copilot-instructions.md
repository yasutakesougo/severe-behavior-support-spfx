# Copilot Adapter Instructions

このファイルは GitHub Copilot 向けの Adapter であり、新しい正本を定義しない。

実行前に `AGENTS.md` を読み、次の正本を優先する。

1. `docs/decisions/` と architecture Decision 文書
2. GitHub live Issue / PR state
3. Evidence
4. `docs/architecture/`
5. `SECURITY.md`

Agent の役割は `.agents/agents/` を正本とする。
Workflow は `docs/process/ai-workflow.md` と `docs/process/development-process.md` を正本とする。
権限境界は `docs/decisions/DEC-AI-ORG-003.md` と `.agents/mcp/permission-matrix.md` を正本とする。

`.github/agents/*.agent.md` は Copilot から既存 Agent を呼び出すための薄い Adapter として扱う。
Adapter が正本と矛盾する場合は正本を優先する。

Agent 間の引き継ぎでは `.agents/orchestration/handoff-format.md` を使う。
会話履歴全体ではなく、task、base SHA、authorization、scope、findings、validation、risk、next action を受け渡す。

Human GO が必要な操作は、正本に記載された対象・範囲・版へ拘束する。
Ready、Merge、Deploy、SharePoint / Entra / Microsoft 365 / 本番データ mutation を暗黙に許可しない。
