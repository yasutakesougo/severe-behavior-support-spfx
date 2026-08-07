# AuditEvent persistence — #22A alignment gate

この文書は、PR #99（persistence technical contract）MERGED 後の
**実装前 Gate** 正本である。

実保存コード・SharePoint adapter は開始しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main: 199217ce2aaf2fec3d47cb7cb1f312c7e9c444d6
PR #99 / persistence technical contract: MERGED
final head before merge: dba52254de5f1212d99bf6601862ec83a510f0fe
CI run #120: SUCCESS
Decision-AUD-RET-1: Accepted（#19 / 5215844603）
Decision-AUD-WR-1: Accepted（#17 / 5215846338 / owner #22A）
Persistence Entry Criteria: MET
Persistence technical contract: MERGED
Persistence implementation: HOLD
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

## 次の判断単位（実装前）

本 Gate は **整合レビュー** を要求する。実装 GO ではない。

### Decision-AUD-ALIGN-1 — #22A write-result / idempotency 整合

| 項目 | 内容 |
|---|---|
| 問い | PR #99 の write-result / `SAVE_OUTCOME_UNKNOWN` 境界は、Issue `#22A` の既存 write-result・idempotency 境界と矛盾しないか |
| Owner | Issue `#22A`（AUD-WR-1 Accepted） |
| 現状 | **Pending**（レビュー未了） |
| 混ぜない | SharePoint List/列、concrete adapter（#22B）、物理構成（#29）、値サニタイズ本体 |

レビュー観点:

```text
1. write-result 区分（6値）が #22A 既存境界と衝突しないか
2. SAVE_OUTCOME_UNKNOWN の fail-closed 意味が維持されるか
3. blind retry 禁止 / existing-result verification 必須と #22A idempotency が矛盾しないか
4. auditEventId / correlationId lookup の未決を実装前に明示できるか
5. 矛盾がある場合、契約改訂か #22A 側判断のどちらで解くか
```

### 分離して後続（本 Gate で採択しない）

```text
値サニタイズ境界（Issue #22 / audit-write-boundary）
idempotency の具体 lookup key / retry 回数 / backoff
physical SharePoint mapping（#29）
concrete SharePoint adapter（#22B）
TypeScript port / repository 実装
```

## Gate 表

| # | 条件 | 現状 |
|---|---|---|
| 1 | Persistence technical contract MERGED | DONE（PR #99） |
| 2 | #22A write-result / idempotency 整合レビュー Accepted | **未** |
| 3 | idempotency / existing-result verification 判断単位固定 | **未**（ALIGN-1 後または同時） |
| 4 | 値サニタイズ境界明示 | **未**（別単位） |
| 5 | TypeScript port / repository 実装 | **HOLD** |
| 6 | SharePoint adapter / M365 / Deploy | **NO-GO** |

```text
Next gate: Decision-AUD-ALIGN-1（#22A 整合レビュー）
Persistence implementation: HOLD
SharePoint adapter: NO-GO
Microsoft 365 / Deploy: NO-GO
```

## 禁止

- PR #99 MERGED を implementation GO と読み替えること
- #22A 整合前に `src/**` / `tests/**` へ persistence port を追加すること
- SharePoint List / 列 / adapter 実装
- blind retry の許可化
- `SAVE_OUTCOME_UNKNOWN` の success 変換
- deploy / 実データ変更

## 人向け確認案（Pending・未投稿）

```text
Status: Pending Decision
ID: Decision-AUD-ALIGN-1
Owner: Issue #22A

Question:
  Confirm PR #99 AuditEvent persistence contract is consistent with
  existing #22A write-result / idempotency boundaries.

Must keep:
  - SAVE_OUTCOME_UNKNOWN is not success
  - no blind retry
  - existing-result verification before retry

OUT:
  SharePoint adapter / M365 / deploy / persistence code
```

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** / tests/**: 本 Gate では変更しない
persistence implementation: HOLD
```
