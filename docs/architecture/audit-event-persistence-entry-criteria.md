# AuditEvent 実保存 — Entry Criteria / 次工程ゲート

この文書は、Handoff AuditEvent **候補生成**（PR #96 MERGED）完了後に、
**実保存境界の設計へ進む前**に確認する Entry Criteria 正本である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main before this update: 52bfc478d803500845a95985c66c8892524cbc32
PR #97 / Entry Criteria 初版: MERGED
PR #98 / AUD-RET-1・AUD-WR-1 final candidates: MERGED
Decision-AUD-RET-1: Accepted (Issue #19 comment 5215844603)
Decision-AUD-WR-1: Accepted (Issue #17 comment 5215846338)
Handoff AuditEvent candidate: PR #96 MERGED
AuditEvent persistence technical contract: GO (docs-only)
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

## Entry Criteria 表

| # | 条件 | 現状 |
|---|---|---|
| 1 | AuditEvent 構造・strict allowlist が main にある | DONE |
| 2 | Handoff candidate builder が main にある | DONE |
| 3 | HANDOFF_STATUS_CHANGED Accepted | DONE |
| 4 | 保存期間 Accepted | DONE（AUD-RET-1） |
| 5 | 書込先所有 Accepted | DONE（AUD-WR-1 / #22A） |
| 6 | 実保存技術契約（port / fail-closed / OUT） | **GO: docs-only** |
| 7 | SharePoint / M365 変更方針 | **NO-GO（別 Gate）** |

```text
Entry Criteria for persistence technical contract: MET
AuditEvent persistence technical design: GO (docs-only)
AuditEvent persistence implementation: HOLD
SharePoint adapter / M365 / Deploy: NO-GO
```

## 実装前に引き続き必要なこと

- repository port 契約のレビュー・Accepted
- write result / save_outcome_unknown の既存 #22A 契約との整合
- idempotency / retry 境界の固定
- AuditEvent 値サニタイズ境界の確認
- physical SharePoint mapping は #29 後

## 禁止

- docs-only 契約を implementation GO と読み替えること
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
persistence code: HOLD until technical contract is reviewed/accepted
```
