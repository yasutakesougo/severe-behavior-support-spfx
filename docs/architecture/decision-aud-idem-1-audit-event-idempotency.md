# Decision-AUD-IDEM-1 — AuditEvent persistence idempotency identity

この文書は、AuditEvent 実保存の冪等 identity に関する
**Decision-AUD-IDEM-1** の Accepted 正本である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main before this decision-doc update: 29b6ed2872ea475590c3c5bb8f7c946fa76f3616
Decision ID: Decision-AUD-IDEM-1
Status: Accepted
Depends on: Decision-AUD-ALIGN-1 Accepted
#22A supporting evidence: Issue #22 comment 5190198003（FX-IDEM-001〜007）
```

上位入口:

- [`decision-aud-align-1-audit-event-write-result-alignment.md`](./decision-aud-align-1-audit-event-write-result-alignment.md)
- [`audit-event-persistence-contract.md`](./audit-event-persistence-contract.md)
- [`decision-aud-wr-1-audit-write-ownership.md`](./decision-aud-wr-1-audit-write-ownership.md)

## Accepted 内容

### RecordId

```text
RecordId = auditEvent.auditEventId
```

`targetRecordId` を AuditEvent 自身の RecordId として使用しない。

### IdempotencyKey

`IdempotencyKey` は AuditEvent domain object へ追加しない。

write operation metadata として保持する。

概念（TypeScript 名は後続実装で決定可）:

```text
AuditEventWriteRequest
├─ auditEvent
└─ idempotencyKey
```

同一論理送信の retry では同じ Key を使う。
異なる論理送信では新しい Key を使う。

### correlationId

```text
correlationId
  = 一連の業務・技術処理を追跡するための相関 ID

idempotencyKey
  = 同一 write submission を識別するための ID

correlationId MUST NOT be used as IdempotencyKey
```

一つの `correlationId` 配下で複数の異なる AuditEvent が発生し得る。

### targetRecordId

```text
targetRecordId
  = 監査対象となった業務レコードの ID
```

AuditEvent 自身の保存 ID ではない。

### PayloadFingerprint

payload 比較に fingerprint を使う場合:

```text
PayloadFingerprint
  = persistence / idempotency metadata
```

AuditEvent domain field へ追加しない。

具体的 hash algorithm はこの Decision では固定しない。

必要条件:

```text
same canonical AuditEvent
  -> same comparison result

different semantic AuditEvent
  -> different comparison result
```

### Safe replay

```text
same auditEventId
+ same IdempotencyKey
+ same semantic payload
= existing result
```

新しい AuditEvent を重複作成しない。

### Conflict

```text
same IdempotencyKey
+ different semantic payload
= CONFLICT

same RecordId
+ different IdempotencyKey
= CONFLICT
```

として扱える境界を維持する。

## #22A FX-IDEM 対応

| FX | 意味 | 本 Decision |
|---|---|---|
| FX-IDEM-001 | 新規 RecordId・新規 Key → 作成 | `auditEventId` + 新規 Key |
| FX-IDEM-002 | 同一 RecordId・同一 Key・同一 payload → 既存結果 | safe replay |
| FX-IDEM-003 | 同一 RecordId・異なる Key → conflict | CONFLICT |
| FX-IDEM-004 | 異なる RecordId・同一 Key・同一 payload → conflict | CONFLICT |
| FX-IDEM-005 | 同一 Key・異なる payload → conflict | CONFLICT |
| FX-IDEM-006 | 照会失敗 → 保存へ進まない | lookup failure fail-closed |
| FX-IDEM-007 | 保存応答不明・同一 Key 再送 → 既存照会後に判定 | `SAVE_OUTCOME_UNKNOWN` 後 |

## 決めないこと

- PayloadFingerprint の具体 algorithm / encoding
- retry 回数 / backoff
- SharePoint 既存アイテム照会の concrete 実装（`#22B`）
- TypeScript 型名・ファイル配置の最終確定
- `validateAuditEvent` 値安全性 hardening（Decision-AUD-SAN-VALUE-1 / SAN-1）
- Microsoft 365 / deploy

## Gate

```text
Decision-AUD-IDEM-1: Accepted
Decision-AUD-ALIGN-1: Accepted
Decision-AUD-SAN-VALUE-1: Accepted（別正本）
Decision-AUD-SAN-1: Accepted
Decision-AUD-REPLAY-1: Accepted（別正本）
AuditEvent contract hardening: MERGED（PR #102）
Logical AuditEvent persistence boundary: MERGED（PR #104）
Decision-AUD-REPO-1: Accepted（別正本）
Replay logical implementation: MERGED（PR #106）
Technical Decision blocker: CLEARED
Issue #29 physical definition / mapping alignment: Accepted / MERGED（PR #108）
  Candidate: 5223465404 / Revision 2
  Independent Re-review: 5223625403（PASS）
  Human Acceptance: 5223669583
  main: aa0e6fba7dd8abf32523c70232001b5ac78cfc1b
Dependency blocker（#29 mapping）: CLEARED
Concrete Repository Entry Review: PASS（Issue #22 comment 5224544473）
READY_FOR_HUMAN_GO: YES
Concrete repository / #22B: MERGED（PR #110 / 62a43d7fbb5b33f69e0f4adfbba405ab00c1fb81）
READY_FOR_HUMAN_GO note: #22B PR #110 MERGED（synthetic）; 実 SharePoint は別 Gate
SharePoint adapter: NO-GO
Microsoft 365 / Deploy: NO-GO
```
