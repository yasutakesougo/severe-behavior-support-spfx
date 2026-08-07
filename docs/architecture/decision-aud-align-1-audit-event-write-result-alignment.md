# Decision-AUD-ALIGN-1 — AuditEvent persistence / #22A write-result alignment

この文書は、AuditEvent persistence technical contract と Issue `#22A`
write-result / idempotency 境界の整合に関する **Decision-AUD-ALIGN-1** の
Accepted 正本である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main before this decision-doc update: 29b6ed2872ea475590c3c5bb8f7c946fa76f3616
Decision ID: Decision-AUD-ALIGN-1
Status: Accepted
Owner: Issue #22A（Decision-AUD-WR-1）
Related: Issue #22 body / comment 5190198003（FX-IDEM）
Persistence technical contract: MERGED（PR #99）
Alignment gate docs: audit-event-persistence-22a-alignment-gate.md
```

上位入口:

- [`audit-event-persistence-22a-alignment-gate.md`](./audit-event-persistence-22a-alignment-gate.md)
- [`audit-event-persistence-contract.md`](./audit-event-persistence-contract.md)
- [`decision-aud-wr-1-audit-write-ownership.md`](./decision-aud-wr-1-audit-write-ownership.md)
- [`decision-aud-idem-1-audit-event-idempotency.md`](./decision-aud-idem-1-audit-event-idempotency.md)

## Accepted 内容

```text
Status: Accepted

#22A write-result vocabulary と AuditEvent persistence write-result は
意味的に 1:1 対応する。
```

| #22A | Persistence |
|---|---|
| `saved` | `SAVED` |
| `validation_failed` | `VALIDATION_FAILED` |
| `forbidden` | `FORBIDDEN` |
| `conflict` | `CONFLICT` |
| `save_failed` | `SAVE_FAILED` |
| `save_outcome_unknown` | `SAVE_OUTCOME_UNKNOWN` |

命名形式（大文字・小文字）の差は不一致としない。

整合レビュー結果（再オープンしない）:

```text
ALIGN-01 Result vocabulary: PASS
ALIGN-02 Failure preservation: PASS
ALIGN-03 Unknown outcome: PASS
ALIGN-04 Idempotency identity: PASS
ALIGN-05 Same key / different payload: PASS
ALIGN-06 Same request replay: PASS
ALIGN-07 Conflict semantics: PASS
ALIGN-08 Boundary ownership: PASS
Blocking findings: 0
```

## 維持する fail-closed 境界

```text
SAVE_OUTCOME_UNKNOWN
  -> success にしない
  -> SAVE_FAILED へ縮退しない
  -> blind retry / 自動新規再送しない
  -> 既存結果確認へ接続する

FORBIDDEN
  -> not_found / success にしない

CONFLICT
  -> VALIDATION_FAILED / success にしない
```

## 決めないこと / 後続

- AuditEvent identity 写像の詳細 → [`decision-aud-idem-1-audit-event-idempotency.md`](./decision-aud-idem-1-audit-event-idempotency.md)
- 値安全性 hardening → [`decision-aud-san-value-1-audit-event-value-safety.md`](./decision-aud-san-value-1-audit-event-value-safety.md)
- `validateAuditEvent` 実装 hardening → MERGED（PR #102）/ Decision-AUD-SAN-1 Accepted
- TypeScript persistence port / repository 実装
- SharePoint adapter（`#22B`）/ 物理構成（`#29`）
- Microsoft 365 / deploy

## Gate

```text
Decision-AUD-ALIGN-1: Accepted
Persistence technical contract: MERGED
Decision-AUD-IDEM-1: Accepted（別正本）
Decision-AUD-SAN-VALUE-1: Accepted（別正本）
Decision-AUD-SAN-1: Accepted
AuditEvent contract hardening: MERGED（PR #102）
Next: Persistence Entry Review final rerun
Persistence implementation: HOLD pending final Entry Review PASS + human GO
SharePoint adapter: NO-GO
Microsoft 365 / Deploy: NO-GO
```
