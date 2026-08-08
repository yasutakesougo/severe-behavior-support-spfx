# AuditEvent 実保存 — Entry Criteria / 次工程ゲート

この文書は、Handoff AuditEvent **候補生成**（PR #96 MERGED）完了後に、
**実保存境界の設計へ進む前**に確認する Entry Criteria 正本である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main before this canonicalization: b28bfee5beea9d6eac3f239a88693c949b6e54a3
PR #99 / persistence technical contract: MERGED
PR #97 / Entry Criteria 初版: MERGED
PR #98 / AUD-RET-1・AUD-WR-1 final candidates: MERGED
PR #104 / logical persistence boundary: MERGED
PR #106 / replay logical implementation: MERGED
Decision-AUD-RET-1: Accepted (Issue #19 comment 5215844603)
Decision-AUD-WR-1: Accepted (Issue #17 comment 5215846338)
Decision-AUD-ALIGN-1: Accepted
Decision-AUD-IDEM-1: Accepted
Decision-AUD-SAN-VALUE-1: Accepted
Decision-AUD-SAN-1: Accepted
Decision-AUD-REPLAY-1: Accepted
Decision-AUD-REPO-1: Accepted (Issue #22 comments 5219980098 / 5220288044 / 5220303406)
AuditEvent contract hardening: MERGED（PR #102）
Handoff AuditEvent candidate: PR #96 MERGED
AuditEvent persistence technical contract: MERGED
Persistence Entry Review: PASS（ENTRY-00〜12 ALL PASS）
Human Persistence GO: Accepted / consumed by PR #104
Logical AuditEvent persistence boundary: MERGED（PR #104）
Replay Implementation Entry Review: PASS
Human Replay GO: Accepted / consumed by PR #106
Replay logical implementation: MERGED（PR #106）
Technical Decision blocker: CLEARED
Issue #29 physical definition / mapping alignment: Accepted
  Candidate: 5223465404 / Revision 2
  Independent Re-review: 5223625403（PASS）
  Human Acceptance: 5223669583
Canonicalization to main: PENDING / THIS PR（docs-only）
Dependency blocker: NOT CLEARED
Concrete Repository Entry Review: FAIL / 未再実行
Concrete repository: HOLD
READY_FOR_HUMAN_GO: NO
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
| Replay logical implementation | MERGED（PR #106） |
| Decision-AUD-REPO-1 | Accepted |

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
ALIGN / IDEM / SAN-VALUE / SAN-1 / REPLAY-1 / REPO-1: Accepted
AuditEvent contract hardening: MERGED（PR #102）
Persistence Entry Review: PASS
Human Persistence GO: Accepted / consumed by PR #104
Logical AuditEvent persistence boundary: MERGED（PR #104）
Replay logical implementation: MERGED（PR #106）
Technical Decision blocker: CLEARED
Issue #29 physical definition / mapping alignment: Accepted
  Candidate: 5223465404 / Revision 2
  Independent Re-review: 5223625403（PASS）
  Human Acceptance: 5223669583
Canonicalization to main: PENDING / THIS PR（docs-only）
Dependency blocker: NOT CLEARED
Concrete Repository Entry Review: FAIL / 未再実行
Concrete repository: HOLD
READY_FOR_HUMAN_GO: NO
SharePoint adapter / M365 / Deploy: NO-GO
```

## 実装前に引き続き必要なこと

- Issue `#29` physical definition / mapping alignment Accepted の docs canonicalization Merge
- Concrete Repository Entry Review 再実行 PASS
- `#22B` 向けの別の明示的 human GO（PR #104 / #106 GO とは別）

正本:

- [`decision-aud-repo-1-audit-event-repository-uniqueness.md`](./decision-aud-repo-1-audit-event-repository-uniqueness.md)
- [`audit-event-physical-mapping-29.md`](./audit-event-physical-mapping-29.md)
- [`decision-aud-replay-1-audit-event-safe-replay.md`](./decision-aud-replay-1-audit-event-safe-replay.md)
- [`audit-event-persistence-implementation-boundary.md`](./audit-event-persistence-implementation-boundary.md)

## 禁止

- docs-only 契約 MERGED / Decision Accepted / hardening MERGED / logical/replay MERGED を repository GO と読み替えること
- PR #104 / PR #106 Human GO を `#22B` GO として流用すること
- Issue `#29` 未完了のまま Concrete Repository Entry Review を PASS 扱いすること
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
Issue #29: physical mapping docs only（実変更禁止）
Concrete repository / #22B: HOLD
```
