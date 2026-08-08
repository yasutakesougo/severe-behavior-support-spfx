# AuditEvent persistence — #22A alignment gate

この文書は、PR #99（persistence technical contract）MERGED 後の
**実装前 Gate** 正本である。

**Decision-AUD-ALIGN-1 は Accepted。** 実保存コード・SharePoint adapter は開始しない。

Accepted 正本:

- [`decision-aud-align-1-audit-event-write-result-alignment.md`](./decision-aud-align-1-audit-event-write-result-alignment.md)
- [`decision-aud-idem-1-audit-event-idempotency.md`](./decision-aud-idem-1-audit-event-idempotency.md)
- [`decision-aud-san-value-1-audit-event-value-safety.md`](./decision-aud-san-value-1-audit-event-value-safety.md)
- [`decision-aud-replay-1-audit-event-safe-replay.md`](./decision-aud-replay-1-audit-event-safe-replay.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main before this canonicalization: b28bfee5beea9d6eac3f239a88693c949b6e54a3
PR #99 / persistence technical contract: MERGED
PR #104 / logical persistence boundary: MERGED
PR #106 / replay logical implementation: MERGED
Decision-AUD-RET-1: Accepted（#19 / 5215844603）
Decision-AUD-WR-1: Accepted（#17 / 5215846338 / owner #22A）
Decision-AUD-ALIGN-1: Accepted
Decision-AUD-IDEM-1: Accepted
Decision-AUD-SAN-VALUE-1: Accepted
Decision-AUD-SAN-1: Accepted
Decision-AUD-REPLAY-1: Accepted
Decision-AUD-REPO-1: Accepted（#22 / 5219980098 / 5220288044 / 5220303406）
Persistence Entry Criteria: MET
Persistence technical contract: MERGED
AuditEvent contract hardening: MERGED（PR #102）
Persistence Entry Review: PASS
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
| Logical persistence boundary | MERGED（PR #104） |
| Decision-AUD-REPLAY-1 | Accepted |
| Replay logical implementation | MERGED（PR #106） |
| Decision-AUD-REPO-1 | Accepted |

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
  -> success 扱いしない
  -> blind retry しない
  -> existing-result verification を行う
  -> retry 可否・回数・backoff は別 Decision（verification 後も自動 retry を許可しない）
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
Issue #29 physical mapping: Accepted（canonicalization PENDING）
Concrete Repository Entry Review 再実行（Merge 後）
concrete repository / SharePoint adapter（#22B）
  （Entry PASS + separate human GO 後のみ）
```

## Gate 表

| # | 条件 | 現状 |
|---|---|---|
| 1 | Persistence technical contract MERGED | DONE（PR #99） |
| 2 | #22A write-result / idempotency 整合レビュー Accepted | **DONE（Decision-AUD-ALIGN-1）** |
| 3 | idempotency / existing-result verification 判断単位固定 | **DONE（Decision-AUD-IDEM-1）** |
| 4 | 値安全性契約明示 | **DONE（Decision-AUD-SAN-VALUE-1）** |
| 5 | `validateAuditEvent` が SAN-VALUE 契約に適合 | **DONE（Decision-AUD-SAN-1 Accepted / PR #102）** |
| 6 | Logical persistence boundary | **DONE（PR #104）** |
| 7 | Decision-AUD-REPLAY-1 Accepted | **DONE** |
| 8 | Replay logical implementation | **DONE**（PR #106） |
| 9 | Decision-AUD-REPO-1 Accepted | **DONE** |
| 10 | Issue #29 physical mapping | **Accepted**（canonicalization PENDING） |
| 11 | Concrete Repository Entry Review | **FAIL** / 未再実行 |
| 12 | Concrete repository / #22B | **HOLD** |
| 13 | SharePoint adapter / M365 / Deploy | **NO-GO** |

```text
Issue #29 physical definition / mapping alignment: Accepted
Canonicalization to main: PENDING / THIS PR（docs-only）
Dependency blocker: NOT CLEARED
Next: Merge 後に Concrete Repository Entry Review 再実行
Decision-AUD-REPO-1: Accepted
Technical Decision blocker: CLEARED
Issue #29 physical definition / mapping alignment: Accepted
Canonicalization to main: PENDING / THIS PR（docs-only）
Dependency blocker: NOT CLEARED
Concrete Repository Entry Review: FAIL / 未再実行
Concrete repository: HOLD
READY_FOR_HUMAN_GO: NO
SharePoint adapter: NO-GO
Microsoft 365 / Deploy: NO-GO
```

## 禁止

- ALIGN-1 / IDEM-1 / SAN-VALUE-1 / SAN-1 / REPLAY-1 / REPO-1 Accepted、hardening MERGED、logical/replay MERGED を concrete repository GO と読み替えること
- PR #104 / PR #106 Human GO を `#22B` GO として流用すること
- Issue `#29` 未完了のまま Concrete Repository Entry Review を PASS 扱いすること
- SharePoint List / 列 / adapter 実装（`#22B`）を先取りすること
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
Issue #29: physical mapping docs only（実変更禁止）
Concrete repository / #22B: HOLD
```
