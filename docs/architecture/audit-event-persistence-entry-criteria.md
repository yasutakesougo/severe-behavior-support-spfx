# AuditEvent 実保存 — Entry Criteria / 次工程ゲート

この文書は、Handoff AuditEvent **候補生成**（PR #96 MERGED）完了後に、
**実保存境界の設計へ進む前**に確認する Entry Criteria 正本である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main: 29b6ed2872ea475590c3c5bb8f7c946fa76f3616
PR #99 / persistence technical contract: MERGED
PR #97 / Entry Criteria 初版: MERGED
PR #98 / AUD-RET-1・AUD-WR-1 final candidates: MERGED
Decision-AUD-RET-1: Accepted (Issue #19 comment 5215844603)
Decision-AUD-WR-1: Accepted (Issue #17 comment 5215846338)
Decision-AUD-ALIGN-1: Accepted
Decision-AUD-IDEM-1: Accepted
Decision-AUD-SAN-VALUE-1: Accepted
Decision-AUD-SAN-1: HOLD（validateAuditEvent hardening 未了）
Handoff AuditEvent candidate: PR #96 MERGED
AuditEvent persistence technical contract: MERGED
Next: AuditEvent contract hardening
AuditEvent persistence implementation: HOLD
SharePoint / Microsoft 365 / Deploy: NO-GO
```

## 完了済み

| 単位 | 状態 |
|---|---|
| AuditEvent 構造・strict allowlist | DONE（Issue #27 / PR #41） |
| Handoff AuditEvent candidate builder | DONE（PR #96） |
| HANDOFF_STATUS_CHANGED | Accepted |
| Decision-AUD-RET-1 | Accepted |
| Decision-AUD-WR-1 | Accepted |
| Decision-AUD-ALIGN-1 | Accepted |
| Decision-AUD-IDEM-1 | Accepted |
| Decision-AUD-SAN-VALUE-1 | Accepted |

## Entry Criteria 表

| # | 条件 | 現状 |
|---|---|---|
| 1 | AuditEvent 構造・strict allowlist が main にある | DONE |
| 2 | Handoff candidate builder が main にある | DONE |
| 3 | HANDOFF_STATUS_CHANGED Accepted | DONE |
| 4 | 保存期間 Accepted | DONE（AUD-RET-1） |
| 5 | 書込先所有 Accepted | DONE（AUD-WR-1 / #22A） |
| 6 | 実保存技術契約（port / fail-closed / OUT） | **MERGED**（PR #99） |
| 7 | SharePoint / M365 変更方針 | **NO-GO（別 Gate）** |

```text
Entry Criteria for persistence technical contract: MET
AuditEvent persistence technical contract: MERGED（PR #99）
ALIGN / IDEM / SAN-VALUE: Accepted
Next: AuditEvent contract hardening（Decision-AUD-SAN-1 HOLD）
AuditEvent persistence implementation: HOLD
SharePoint adapter / M365 / Deploy: NO-GO
```

## 実装前に引き続き必要なこと

- `validateAuditEvent` を Decision-AUD-SAN-VALUE-1 に適合させる contract hardening
- Decision-AUD-SAN-1 クリア後の Persistence Entry Review 再実行
- physical SharePoint mapping は #29 後

正本:

- [`decision-aud-san-value-1-audit-event-value-safety.md`](./decision-aud-san-value-1-audit-event-value-safety.md)
- [`audit-event-persistence-implementation-boundary.md`](./audit-event-persistence-implementation-boundary.md)

## 禁止

- docs-only 契約 MERGED / Decision Accepted を implementation GO と読み替えること
- Decision-AUD-SAN-1 を Accepted と偽証すること
- SharePoint List / 列作成
- concrete adapter 実装
- Microsoft 365 変更
- deploy / 実データ変更
- 5年経過を自動削除トリガにすること

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
persistence code: HOLD until Decision-AUD-SAN-1 cleared
```
