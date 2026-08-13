# FIELD-WORKFLOW — UI Issue C filing packet

Status: **FILING COMPLETE**

Filing date: 2026-08-13

GitHub Issue: **#356** — OPEN  
URL: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/356  
Title match: CONFIRMED（filing packet と一致）

Upstream:

- FIELD-WORKFLOW-1 assessment MERGED（PR #345）
- Issue A `#347` / A2 SELECTED / LOCKED / binding MERGED（PR #350）
- Issue B `#352` / B-PKG-1 SELECTED / LOCKED / ProcedureRecord MERGED（PR #354）
- observed `origin/main` tip at packet creation: `7c8880acccbecb4171c13dcbbe9454c3df13f505`

This packet is **docs-only**. It does **not** authorize Implementation Start, Deploy, SharePoint write, or auto-close of `#68` / `#69` / `#299` / `#347` / `#352`.

---

## Agent filing attempt（historical）

| Channel | Result |
|---|---|
| GitHub MCP `issue_write` | **403** Resource not accessible by personal access token |
| `gh issue create` | **403** GraphQL: Resource not accessible by integration (`createIssue`) |
| Human paste-create | **COMPLETE** → Issue `#356` OPEN |

---

## Filed Issue

### Title

```text
ui: field-workflow presentation（FIELD-WORKFLOW UI Issue C / FW-01・02・03・07・08・09）
```

### Body source

`docs/architecture/field-workflow-contract-issue-c-body.md`

### Assignee

`@yasutakesougo`

---

## Separation from related Issues

| Issue | Scope | Relation to C |
|---|---|---|
| #68 field-ui | 利用者→支援手順閲覧 | related only / no auto-close |
| #69 recording-ui | ABC・観察保存 | related only / no auto-close |
| #347 Contract A | plan↔procedure binding | upstream contract |
| #352 Contract B | ProcedureRecord + result + clocks + FW-05 | upstream contract |
| **#356 Issue C** | ProcedureRecord field presentation/flow | UI 正本 |

---

## After filing（STOP conditions）

1. Issue number `#356` recorded on this packet. **DONE**
2. Do **not** start Implementation without explicit Human GO on `#356`.
3. Do **not** Deploy / SharePoint write / close related Issues.
4. PR `#355` Ready / Merge は docs 正本反映の別ゲート（Implementation Start とは独立）。

## Current gate

```text
FIELD-WORKFLOW UI Issue C:
  Issue C Filing: COMPLETE（#356 OPEN）
  A/B 契約: MERGED
  UI 設計境界: FIXED
  Implementation Start: AUTHORIZED（Human GO）
  Implementation PR: field-workflow-ui（Ready/Merge = HUMAN-ONLY）
  Deploy / SharePoint / M365 / Entra / production write: NO-GO
  #68 / #69 / #299 / #347 / #352 auto-close: NO-GO
```
