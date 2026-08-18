# UI-AGENT-SYSTEM-V1 — Design Issue filing packet

Status: **FILED BLOCKED** (this agent token cannot create GitHub Issues)

Filing date: 2026-08-18

Program: **UI-AGENT-SYSTEM-V1**（Product UI Contract + Agent Skills + Deterministic Gates）

Design docs landed:

```text
PR #424: MERGED
Design HEAD: 2f3167612728d16a6ce61a3637bf3fcea85c4790
merge commit (then current main): f25e8e29b32971dce93c4d223e06d42586a41b73
```

Authority upstream:

```text
Decision-DADS-ADOPTION-V1
docs/architecture/dads-application-style-guide-v1.md
docs/process/skill-catalog.md
docs/architecture/contracts-v1.md
```

This packet is **docs-only**. It does **not** authorize ESLint rule implementation, Storybook, Figma MCP connection, Deploy, SharePoint write, Visual Acceptance, or #299 Close.

UI-AGENT-IMPL-1 Skill 導入は **別 PR**（Human GO: Issue 起票後に IMPL-1 へ進む）。Issue 番号未着でも設計正本は main の本文書群を使う。

---

## Agent filing attempt

| Channel | Result |
|---|---|
| GitHub MCP `issue_write` | **403** Resource not accessible by personal access token |
| `gh issue create` | **403** GraphQL: Resource not accessible by integration (`createIssue`) |

Human action required: Cursor 側 GitHub 接続の `create_issue` で下記 Issue を作成し、番号を本 packet に追記する。

Suggested labels: `documentation`, `enhancement`（repo に `design` / `architecture` ラベルは未作成）

Suggested assignee: `@yasutakesougo`

GitHub Issue number: **未採番**

---

## Rationale（1 paragraph）

一般的な Token 同期パイプラインより、本プロジェクトでは **業務意味の UI 表現ズレ**（status vocabulary / save 5-state / procedure binding / role entry 等）が先に危険。1 人開発中心の体制では SaaS を増やしすぎず、repository SSOT + Agent Skills + deterministic test が最も費用対効果が高い。本 Issue はその設計境界を固定する。

---

## Paste-ready Issue

### Title

```text
design: UI-AGENT-SYSTEM-V1 — Product UI Contract + Agent Skills + deterministic gates
```

### Body source

Copy the full contents of:

`docs/architecture/ui-agent-system-v1-design-issue-body.md`

into the GitHub Issue body. Prepend:

```text
Design PR: #424 MERGED
Design HEAD: 2f3167612728d16a6ce61a3637bf3fcea85c4790
merge commit: f25e8e29b32971dce93c4d223e06d42586a41b73
```

---

## After GitHub Issue exists

1. Record the new issue number in this packet.
2. UI-AGENT-IMPL-1 は `design-context` + `design-review` に限定する。
3. Catalog / ESLint / Storybook は別 GO。

---

## Planned follow-on Issues（design lock 後）

| Unit | Scope |
|---|---|
| UI-AGENT-IMPL-1 | `design-context` + `design-review` Skill 導入 |
| UI-AGENT-IMPL-2 | Component Catalog v1 docs + verify hook |
| UI-AGENT-IMPL-3 | ESLint UI semantic rules |
| UI-AGENT-IMPL-4 | Screen template / pattern docs |
| UI-AGENT-OPT-1 | Storybook（Catalog viewer 限定；要否判断後） |
| UI-AGENT-OPT-2 | Figma MCP pilot（Visual Decision 正本化後） |
