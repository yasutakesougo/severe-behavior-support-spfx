# AuditEvent persistence — #22A alignment gate

この文書は、PR #99（persistence technical contract）MERGED 後の
**実装前 Gate** 正本である。

**Decision-AUD-ALIGN-1 は Accepted。** 実保存コード・SharePoint adapter は開始しない。

Accepted 正本:

- [`decision-aud-align-1-audit-event-write-result-alignment.md`](./decision-aud-align-1-audit-event-write-result-alignment.md)
- [`decision-aud-idem-1-audit-event-idempotency.md`](./decision-aud-idem-1-audit-event-idempotency.md)
- [`decision-aud-san-value-1-audit-event-value-safety.md`](./decision-aud-san-value-1-audit-event-value-safety.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main before this canonicalization: 2751f421e1ced3bd28b4734eb964e49f1eff95c6
PR #99 / persistence technical contract: MERGED
Decision-AUD-RET-1: Accepted（#19 / 5215844603）
Decision-AUD-WR-1: Accepted（#17 / 5215846338 / owner #22A）
Decision-AUD-ALIGN-1: Accepted
Decision-AUD-IDEM-1: Accepted
Decision-AUD-SAN-VALUE-1: Accepted
Decision-AUD-SAN-1: Accepted
Persistence Entry Criteria: MET
Persistence technical contract: MERGED
AuditEvent contract hardening: MERGED（PR #102）
Technical Persistence Entry: PASS
Canonical documentation: SYNCHRONIZED（this docs update）
Next: Persistence Entry Review final rerun
Persistence implementation: HOLD pending final Entry Review PASS + human GO
SharePoint adapter / M365 / Deploy: NO-GO
```

上位入口:

- [`audit-event-persistence-contract.md`](./audit-event-persistence-contract.md)
- [`audit-event-persistence-implementation-boundary.md`](./audit-event-persistence-implementation-boundary.md)
- [`decision-aud-wr-1-audit-write-ownership.md`](./decision-aud-wr-1-audit-write-ownership.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 完了済み（再オープンしない）

| 単位 | 状態 |
|---|---|
| AUD-RET-1 / AUD-WR-1 | Accepted |
| Persistence Entry Criteria | MET |
| Persistence technical contract | MERGED（PR #99） |
| Handoff AuditEvent candidate | MERGED（PR #96） |
| Decision-AUD-ALIGN-1 | Accepted |
| Decision-AUD-IDEM-1 | Accepted |
| Decision-AUD-SAN-VALUE-1 | Accepted |
| Decision-AUD-SAN-1 | Accepted |
| AuditEvent contract hardening | MERGED（PR #102） |

契約上すでに固定済みの最低境界（再定義しない）:

```text
Write results:
  SAVED
  VALIDATION_FAILED
  FORBIDDEN
  CONFLICT
  SAVE_FAILED
  SAVE_OUTCOME_UNKNOWN

SAVE_OUTCOME_UNKNOWN:
  -> success扱いしない
  -> blind retryしない
  -> 既存結果を確認してから再試行
```

#22A write-result との 1:1 対応は
[`decision-aud-align-1-audit-event-write-result-alignment.md`](./decision-aud-align-1-audit-event-write-result-alignment.md)
を正本とする。

## Decision-AUD-ALIGN-1 — Accepted

| 項目 | 内容 |
|---|---|
| 問い | PR #99 の write-result / `SAVE_OUTCOME_UNKNOWN` 境界は、Issue `#22A` の既存 write-result・idempotency 境界と矛盾しないか |
| Owner | Issue `#22A`（AUD-WR-1 Accepted） |
| 現状 | **Accepted** |
| 正本 | [`decision-aud-align-1-audit-event-write-result-alignment.md`](./decision-aud-align-1-audit-event-write-result-alignment.md) |

ALIGN-01〜08: PASS。Blocking findings: 0。

### 分離して後続

```text
Persistence Entry Review final rerun
concrete SharePoint adapter（#22B）
physical SharePoint mapping（#29）
TypeScript port / repository 実装（final Entry Review PASS + human GO 後）
```

## Gate 表

| # | 条件 | 現状 |
|---|---|---|
| 1 | Persistence technical contract MERGED | DONE（PR #99） |
| 2 | #22A write-result / idempotency 整合レビュー Accepted | **DONE（Decision-AUD-ALIGN-1）** |
| 3 | idempotency / existing-result verification 判断単位固定 | **DONE（Decision-AUD-IDEM-1）** |
| 4 | 値安全性契約明示 | **DONE（Decision-AUD-SAN-VALUE-1）** |
| 5 | `validateAuditEvent` が SAN-VALUE 契約に適合 | **DONE（Decision-AUD-SAN-1 Accepted / PR #102）** |
| 6 | TypeScript port / repository 実装 | **HOLD** |
| 7 | SharePoint adapter / M365 / Deploy | **NO-GO** |

```text
Next: Persistence Entry Review final rerun
Decision-AUD-SAN-1: Accepted
AuditEvent contract hardening: MERGED（PR #102）
Persistence implementation: HOLD pending final Entry Review PASS + human GO
SharePoint adapter: NO-GO
Microsoft 365 / Deploy: NO-GO
```

## 禁止

- ALIGN-1 / IDEM-1 / SAN-VALUE-1 / SAN-1 Accepted または hardening MERGED を persistence implementation GO と読み替えること
- Persistence Entry Review final rerun と明示的な human GO を省略すること
- SharePoint List / 列 / adapter 実装
- blind retry の許可化
- `SAVE_OUTCOME_UNKNOWN` の success 変換
- deploy / 実データ変更

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
persistence implementation: HOLD pending final Entry Review PASS + explicit human GO
```
