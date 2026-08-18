# UI-AGENT-SYSTEM-V1 — Design Issue filing packet

Status: **READY TO FILE** (GitHub Issue create blocked for this agent token)

Filing date: 2026-08-18

Program: **UI-AGENT-SYSTEM-V1**（Product UI Contract + Agent Skills + Deterministic Gates）

Authority upstream:

```text
Decision-DADS-ADOPTION-V1
docs/architecture/dads-application-style-guide-v1.md
docs/process/skill-catalog.md
docs/architecture/contracts-v1.md
```

This packet is **docs-only**. It does **not** authorize Skill implementation, ESLint rule implementation, Storybook, Figma MCP connection, Deploy, SharePoint write, Visual Acceptance, or #299 Close.

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

into the GitHub Issue body.

Suggested labels: `design`, `architecture`, `agent`, `ui`

Suggested assignee: `@yasutakesougo`

---

## After GitHub Issue exists

1. Record the new issue number in a follow-up comment on this filing packet or a tiny docs amendment.
2. Do **not** start Skill / ESLint / Storybook implementation without explicit Human GO on UI-AGENT-IMPL-* slices.
3. Use this design as the foundation for Visual Polish and Support Plan UI follow-on work.

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
