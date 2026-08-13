# FIELD-WORKFLOW — Contract Issue B filing packet

Status: **READY TO FILE** (GitHub Issue create may be blocked for agent token)

Filing design date: 2026-08-13

Upstream:

- Issue A `#347` / A2 SELECTED / LOCKED
- Design-FIELD-WORKFLOW-CONTRACT-A-MIN-SHAPE-1 DESIGN LOCKED
- `SupportPlanVersionProcedureBinding` MERGED（PR #350）
- observed `origin/main` tip at packet creation: `423eba2`

This packet is **docs-only**. It does **not** authorize Issue B implementation, FIELD-WORKFLOW UI, Deploy, SharePoint write, #299 Close, or #347 Close.

---

## Agent filing note

If `createIssue` returns 403, Human should paste the Issue from this packet (same path as Issue A).

Suggested assignee: `@yasutakesougo`

---

## Paste-ready Issue

### Title

```text
contracts: ProcedureRecord binding + result + dual clocks + FW-05（FIELD-WORKFLOW 契約 Issue B）
```

### Body source

Copy the full contents of:

`docs/architecture/field-workflow-contract-issue-b-body.md`

into the GitHub Issue body.

---

## Separation from Issue A

| Issue A (#347) | Issue B (this packet) |
|---|---|
| planVersion ↔ procedure link | ProcedureRecord + result + clocks |
| No procedure body (A2) | No procedure body (keep A2) |
| Binding uniqueness / alignment | Historical binding FW-05 |
| Implemented MERGED | Filing / design only until GO |

---

## After GitHub Issue exists

1. Record the new issue number on this packet or in a follow-up docs amendment.
2. Complete Domain Decisions (type / composition / result / clocks) before implementation GO.
3. Do **not** start FIELD-WORKFLOW UI until A+B contract gates allow it.
