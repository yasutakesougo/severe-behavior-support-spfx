# FIELD-WORKFLOW — UI Issue C filing packet

Status: **FILING**（GitHub Issue create in progress）

Filing date: 2026-08-13

Upstream:

- FIELD-WORKFLOW-1 assessment MERGED（PR #345）
- Issue A `#347` / A2 SELECTED / LOCKED / binding MERGED（PR #350）
- Issue B `#352` / B-PKG-1 SELECTED / LOCKED / ProcedureRecord MERGED（PR #354）
- observed `origin/main` tip at packet creation: `7c8880acccbecb4171c13dcbbe9454c3df13f505`

This packet is **docs-only**. It does **not** authorize Implementation Start, Deploy, SharePoint write, or auto-close of `#68` / `#69` / `#299` / `#347` / `#352`.

---

## Paste-ready Issue

### Title

```text
ui: field-workflow presentation（FIELD-WORKFLOW UI Issue C / FW-01・02・03・07・08・09）
```

### Body source

Copy the full contents of:

`docs/architecture/field-workflow-contract-issue-c-body.md`

into the GitHub Issue body.

### Suggested assignee

`@yasutakesougo`

---

## Separation from related Issues

| Issue | Scope | Relation to C |
|---|---|---|
| #68 field-ui | 利用者→支援手順閲覧 | related only / no auto-close |
| #69 recording-ui | ABC・観察保存 | related only / no auto-close |
| #347 Contract A | plan↔procedure binding | upstream contract |
| #352 Contract B | ProcedureRecord + result + clocks + FW-05 | upstream contract |
| **Issue C (this)** | ProcedureRecord field presentation/flow | UI 正本 |

---

## After GitHub Issue exists

1. Record the new issue number on this packet.
2. Do **not** start Implementation without explicit Human GO on Issue C.
3. Do **not** Deploy / SharePoint write / close related Issues.

## Gate after filing

```text
FIELD-WORKFLOW UI Issue C:
  設計境界確定済み
  Issue 作成済み（番号を本 packet に追記）
  Implementation HOLD
  Deploy / SharePoint / production write: NO-GO
```
