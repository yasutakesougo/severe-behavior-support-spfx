# AuditEvent persistence implementation boundary

本書は `audit-event-persistence-contract.md` と実装開始を分離する。

```text
Persistence technical contract: MERGED（PR #99）
Decision-AUD-ALIGN-1: Accepted
  → docs/architecture/decision-aud-align-1-audit-event-write-result-alignment.md
Decision-AUD-IDEM-1: Accepted
  → docs/architecture/decision-aud-idem-1-audit-event-idempotency.md
Decision-AUD-SAN-VALUE-1: Accepted
  → docs/architecture/decision-aud-san-value-1-audit-event-value-safety.md
Decision-AUD-SAN-1: HOLD
  （validateAuditEvent が SAN-VALUE 契約に未適合）
AuditEvent contract hardening: NEXT
TypeScript port implementation: HOLD
repository implementation: HOLD
SharePoint adapter: NO-GO
Microsoft 365 changes: NO-GO
Deploy: NO-GO
```

実装開始には、少なくとも次を満たす。

1. persistence technical contract が MERGED（DONE / PR #99）。
2. #22A の write-result / `SAVE_OUTCOME_UNKNOWN` 境界と矛盾しない（DONE / Decision-AUD-ALIGN-1）。
3. idempotency / existing-result verification の判断単位が固定される（DONE / Decision-AUD-IDEM-1）。
4. 値安全性契約が明示される（DONE / Decision-AUD-SAN-VALUE-1）。
5. `validateAuditEvent`（または同等の単一 hardening）が Decision-AUD-SAN-VALUE-1 に適合し、Decision-AUD-SAN-1 がクリアされる（**未**）。

この文書自体は実装を許可しない。
