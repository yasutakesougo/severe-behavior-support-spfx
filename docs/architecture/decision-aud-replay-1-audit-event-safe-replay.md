# Decision-AUD-REPLAY-1 — AuditEvent existing-result verification / safe replay

この文書は、AuditEvent persistence の既存結果照会・safe replay 境界に関する
**Decision-AUD-REPLAY-1** の Accepted 正本である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AUD-REPLAY-1
Status: Accepted
main before this canonicalization: dd934f389411d23b882922dfc7933493cb1ae5f7
Depends on:
  Decision-AUD-IDEM-1 Accepted
  Decision-AUD-ALIGN-1 Accepted
  Decision-AUD-SAN-VALUE-1 Accepted
  Decision-AUD-SAN-1 Accepted
Logical persistence boundary: MERGED（PR #104）
```

上位入口:

- [`decision-aud-idem-1-audit-event-idempotency.md`](./decision-aud-idem-1-audit-event-idempotency.md)
- [`decision-aud-align-1-audit-event-write-result-alignment.md`](./decision-aud-align-1-audit-event-write-result-alignment.md)
- [`audit-event-persistence-contract.md`](./audit-event-persistence-contract.md)
- [`src/domain/audit-event-persistence.ts`](../../src/domain/audit-event-persistence.ts)

## Accepted 内容

### Lookup identity

existing-result verification は dual lookup で行う。

```text
byRecordId:
  auditEvent.auditEventId

byIdempotencyKey:
  AuditEventWriteRequest.idempotencyKey
```

片側 lookup だけで新規保存を決定しない。

### Logical persisted evidence

conceptually:

```text
PersistedAuditEventWrite
├─ auditEvent
└─ idempotencyKey
```

physical storage metadata は logical / domain evidence に含めない。

OUT:

```text
SharePoint ListItemId
internal column names
ETag
REST response
PnPjs object
physical URL
```

### Semantic payload equality

PayloadFingerprint は使用しない。

```text
semantic equality
=
validated AuditEvent field-wise equality
```

`auditEventId` は RecordId identity として別軸で比較するため、
semantic payload field comparison から除外する。

比較対象:

```text
OrganizationId
SiteId
actorStaffId
actionCode
targetType
targetRecordId
result
occurredAt
correlationId
reasonCode
appVersion
ruleSetVersion
```

各値は exact equality。

禁止:

```text
trim then compare
normalize
NFKC
case folding
coercion
```

optional field:

```text
absent == undefined
```

一方:

```text
absent vs defined
different defined values
```

は different semantic payload。

IdempotencyKey は AuditEvent field ではないため semantic payload に含めない。

### Safe replay

```text
same auditEventId
+ same IdempotencyKey
+ same semantic payload
```

の場合:

```text
existing replay confirmed
external AuditEventWriteResult = SAVED
new write = NO
```

7番目の write result を追加しない。
内部 classifier で `EXISTING_REPLAY` 等を区別することは後続実装で可能。

### Conflict

次はすべて `CONFLICT`:

```text
same RecordId + different IdempotencyKey
different RecordId + same IdempotencyKey
same RecordId + same IdempotencyKey + different semantic payload
incompatible dual-lookup evidence
```

外部 `AuditEventWriteResult` へ reason field を追加しない。
内部 classifier reason は後続 implementation detail。

### Pre-save lookup failure

#### FORBIDDEN

```text
lookup: FORBIDDEN
result: FORBIDDEN
save attempt: NO
```

#### Retrieval / malformed / unusable evidence

```text
lookup: RETRIEVAL_FAILED
  or malformed persisted evidence
  or unusable persisted evidence
result: SAVE_FAILED
save attempt: NO
```

これは write attempt 後の outcome unknown ではないため
`SAVE_OUTCOME_UNKNOWN` を使用しない。

### New save eligibility

dual lookup が正常完了し、

```text
byRecordId: NOT_FOUND
byIdempotencyKey: NOT_FOUND
```

の場合だけ新規 save へ進める。

### SAVE_OUTCOME_UNKNOWN recovery

initial save が `SAVE_OUTCOME_UNKNOWN` の場合、blind retry は禁止。
existing-result verification を行う。

| Verification outcome | External result |
|---|---|
| Found same（same RecordId + Key + semantic payload） | `SAVED` |
| Found conflict | `CONFLICT` |
| NOT_FOUND | `SAVE_OUTCOME_UNKNOWN`（維持） |
| Verification FORBIDDEN | `SAVE_OUTCOME_UNKNOWN`（維持） |
| Verification RETRIEVAL_FAILED | `SAVE_OUTCOME_UNKNOWN`（維持） |
| Malformed / unusable verification evidence | `SAVE_OUTCOME_UNKNOWN`（維持） |

NOT_FOUND だけを根拠に「保存失敗だった」と断定しない。
verification FORBIDDEN / RETRIEVAL_FAILED で過去の save outcome を上書きしない。
`SAVE_FAILED` へ縮退しない。

### Retry

```text
automatic retry: NO
blind retry: NO
```

retry 可否・回数・backoff は別 Decision。

### Fingerprint

```text
PayloadFingerprint: NOT USED
```

決めないこと:

```text
hash algorithm
canonical JSON encoding
serialization order
```

AuditEvent domain field へ PayloadFingerprint を追加しない。

### Write-result vocabulary

変更なし（Decision-AUD-ALIGN-1）:

```text
SAVED
VALIDATION_FAILED
FORBIDDEN
CONFLICT
SAVE_FAILED
SAVE_OUTCOME_UNKNOWN
```

### SharePoint boundary

```text
SharePoint: OUT
PnPjs: OUT
REST: OUT
ETag: OUT
physical mapping: OUT
provisioning: OUT
Microsoft 365: OUT
Deploy: OUT
```

## 決めないこと

- TypeScript 型名・ファイル配置の最終確定
- concrete lookup / repository 実装（`#22B`）
- retry policy / count / backoff
- PayloadFingerprint algorithm
- SharePoint / Microsoft 365 / deploy

## Gate

```text
Decision-AUD-REPLAY-1: Accepted
Logical AuditEvent persistence boundary: MERGED（PR #104）
Next: Replay Implementation Entry Review
Replay implementation: HOLD pending Entry PASS + separate human GO
Concrete repository: HOLD
SharePoint adapter: NO-GO
Microsoft 365 / Deploy: NO-GO
```

PR #104 の Human Persistence GO は logical boundary 実装で消費済み。
Replay 実装には別の明示的 human GO が必要。
