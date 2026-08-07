# AuditEvent 実保存 — Entry Criteria / 次工程ゲート

この文書は、Handoff AuditEvent **候補生成**（PR #96 MERGED）完了後に、
**実保存境界の設計へ進む前**に確認する Entry Criteria 正本である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main before this canonicalization: dd934f389411d23b882922dfc7933493cb1ae5f7
PR #99 / persistence technical contract: MERGED
PR #97 / Entry Criteria 初版: MERGED
PR #98 / AUD-RET-1・AUD-WR-1 final candidates: MERGED
PR #104 / logical persistence boundary: MERGED
Decision-AUD-RET-1: Accepted (Issue #19 comment 5215844603)
Decision-AUD-WR-1: Accepted (Issue #17 comment 5215846338)
Decision-AUD-ALIGN-1: Accepted
Decision-AUD-IDEM-1: Accepted
Decision-AUD-SAN-VALUE-1: Accepted
Decision-AUD-SAN-1: Accepted
Decision-AUD-REPLAY-1: Accepted
AuditEvent contract hardening: MERGED（PR #102）
Handoff AuditEvent candidate: PR #96 MERGED
AuditEvent persistence technical contract: MERGED
Persistence Entry Review: PASS（ENTRY-00〜12 ALL PASS）
Human Persistence GO: Accepted / consumed by PR #104
Logical AuditEvent persistence boundary: MERGED（PR #104）
Next: Replay Implementation Entry Review
Replay implementation: HOLD pending Entry PASS + separate human GO
Concrete repository: HOLD
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
| Decision-AUD-SAN-1 | Accepted |
| Decision-AUD-REPLAY-1 | Accepted |
| Logical persistence boundary | MERGED（PR #104） |

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
ALIGN / IDEM / SAN-VALUE / SAN-1 / REPLAY-1: Accepted
AuditEvent contract hardening: MERGED（PR #102）
Persistence Entry Review: PASS
Human Persistence GO: Accepted / consumed by PR #104
Logical AuditEvent persistence boundary: MERGED（PR #104）
Next: Replay Implementation Entry Review
Replay implementation: HOLD pending Entry PASS + separate human GO
Concrete repository: HOLD
SharePoint adapter / M365 / Deploy: NO-GO
```

## 実装前に引き続き必要なこと

- Replay Implementation Entry Review
- Replay 実装向けの別の明示的 human GO（PR #104 GO とは別）
- physical SharePoint mapping は #29 後

正本:

- [`decision-aud-replay-1-audit-event-safe-replay.md`](./decision-aud-replay-1-audit-event-safe-replay.md)
- [`decision-aud-san-value-1-audit-event-value-safety.md`](./decision-aud-san-value-1-audit-event-value-safety.md)
- [`audit-event-persistence-implementation-boundary.md`](./audit-event-persistence-implementation-boundary.md)

## 禁止

- docs-only 契約 MERGED / Decision Accepted / hardening MERGED / logical boundary MERGED を replay または repository GO と読み替えること
- PR #104 Human GO を Replay implementation GO として流用すること
- Replay Implementation Entry Review と別 human GO を省略すること
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
Replay implementation: HOLD pending Entry PASS + separate human GO
Concrete repository: HOLD
```
