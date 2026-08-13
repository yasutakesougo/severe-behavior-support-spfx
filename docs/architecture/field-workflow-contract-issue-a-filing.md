# FIELD-WORKFLOW — Contract Issue A filing packet

Status: **READY TO FILE** (GitHub Issue create blocked for this agent token)

Filing date: 2026-08-13

Assessment正本: `docs/architecture/field-workflow-1-assessment.md`（PR #345 MERGED）

Observed `origin/main` tip at packet creation: `954d334`（Merge PR #345）

This packet is **docs-only**. It does **not** authorize contract implementation, Deploy, SharePoint write, FIELD-WORKFLOW UI, or #299 Close.

---

## Agent filing attempt

| Channel | Result |
|---|---|
| GitHub MCP `issue_write` | **403** Resource not accessible by personal access token |
| `gh issue create` | **403** GraphQL: Resource not accessible by integration (`createIssue`) |

Human action required: create the Issue below in `yasutakesougo/severe-behavior-support-spfx`, or grant the agent `issues: write`, then re-run filing.

Suggested assignee: `@yasutakesougo`

---

## Paste-ready Issue

### Title

```text
contracts: SupportProcedure + plan-version link（FIELD-WORKFLOW 契約 Issue A）
```

### Body source

Copy the full contents of:

`docs/architecture/field-workflow-contract-issue-a-body.md`

into the GitHub Issue body.

---

## After GitHub Issue exists

1. Record the new issue number in a follow-up comment or tiny docs amendment.
2. Do **not** start contract implementation without explicit Human GO on A1/A2/A3.
3. Only then file 契約 Issue B.
