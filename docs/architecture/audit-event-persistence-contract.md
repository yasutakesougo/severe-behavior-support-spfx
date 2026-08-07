# AuditEvent persistence technical contract

## Purpose

Accepted 済みの `Decision-AUD-RET-1` と `Decision-AUD-WR-1` を前提に、AuditEvent 実保存の技術境界を docs-only で固定する。

本書は repository port と fail-closed な保存結果契約までを扱う。

SharePoint List / 列、concrete adapter、Microsoft 365 変更、deploy は扱わない。

## Governance / ownership

```text
Decision-AUD-RET-1: Accepted
  evidence: Issue #19 comment 5215844603
  minimum retention: 5 years
  clock start: AuditEvent.occurredAt
  elapsed 5 years alone MUST NOT trigger automatic deletion

Decision-AUD-WR-1: Accepted
  evidence: Issue #17 comment 5215846338
  technical owner: Issue #22A

Decision-AUD-ALIGN-1: Accepted
  → decision-aud-align-1-audit-event-write-result-alignment.md

Decision-AUD-IDEM-1: Accepted
  → decision-aud-idem-1-audit-event-idempotency.md

Decision-AUD-SAN-VALUE-1: Accepted
  → decision-aud-san-value-1-audit-event-value-safety.md

Decision-AUD-SAN-1: HOLD
  （validateAuditEvent が SAN-VALUE 契約に未適合）

AuditEvent type / validator: Issue #27
Physical SharePoint structure: Issue #29
Concrete SharePoint adapter: Issue #22B
```

## Boundary

Persistence は既存 `AuditEvent` 候補を受け取り、保存結果だけを返す。

candidate builder に保存 side effect を追加しない。

```text
AuditEvent candidate
    ↓ validate
AuditEventPersistencePort.save(event)
    ↓
write result
```

## Proposed port

将来の実装候補は次の論理契約とする。

```ts
interface AuditEventPersistencePort {
  save(event: AuditEvent): Promise<AuditEventWriteResult>;
}
```

本 PR では TypeScript interface を追加しない。

## Write result

保存結果は少なくとも次を区別する。

```text
SAVED
VALIDATION_FAILED
FORBIDDEN
CONFLICT
SAVE_FAILED
SAVE_OUTCOME_UNKNOWN
```

### SAVED

保存完了を確認できた場合だけ返す。

### VALIDATION_FAILED

`validateAuditEvent` を満たさないイベントは保存境界へ渡さない。

### FORBIDDEN

書込権限拒否を成功や not-found に変換しない。

### CONFLICT

同一識別子等の競合を成功へ変換しない。

### SAVE_FAILED

保存失敗を `SAVED` と表示しない。

### SAVE_OUTCOME_UNKNOWN

保存結果が確定できない場合に使用する。

`SAVE_OUTCOME_UNKNOWN` で直ちに新規再送しない。

既存結果照会・冪等 identity は Decision-AUD-IDEM-1 Accepted 正本に従う。

```text
RecordId = auditEvent.auditEventId
IdempotencyKey = write request metadata（AuditEvent domain に追加しない）
correlationId MUST NOT be used as IdempotencyKey
```

正本: [`decision-aud-idem-1-audit-event-idempotency.md`](./decision-aud-idem-1-audit-event-idempotency.md)

## Validation boundary

保存前に既存 `validateAuditEvent` を必須とする。

値安全性の契約正本は Decision-AUD-SAN-VALUE-1（Accepted）。
**現行 `validateAuditEvent` はその契約に未適合**であり、hardening 後に Decision-AUD-SAN-1 をクリアするまで
persistence 実装は HOLD とする。

次は fail-closed で拒否する。

```text
unknown key
forbidden audit key
invalid actionCode format
invalid reasonCode format
invalid occurredAt
empty auditEventId
empty OrganizationId
empty correlationId
IDENTIFIER / VERSION token 不正（SAN-VALUE-1）
未知 targetType（初期許可: HandoffState のみ）
```

Handoff 固有 candidate は既存 `buildHandoffStatusChangedAuditEventCandidate` の成功結果だけを渡す。

正本: [`decision-aud-san-value-1-audit-event-value-safety.md`](./decision-aud-san-value-1-audit-event-value-safety.md)

## Retention boundary

```text
minimum retention: 5 years from occurredAt
```

保存 port は「5年経過したから削除する」責務を持たない。

物理削除・retention cleanup は `GOV-AUD-05` / `DEC-012` 等の別 Decision とする。

## Privacy boundary

AuditEvent に次を複製しない。

```text
利用者氏名
生年月日
住所
支援計画本文
ABC本文
観察本文
会議本文
Password
Token
Cookie
Client Secret
```

## Idempotency / retry

identity / replay / conflict 境界は Decision-AUD-IDEM-1 Accepted に従う。

最低境界:

```text
SAVE_OUTCOME_UNKNOWN
  -> automatic blind retry: prohibited
  -> existing-result verification: required before retry

same auditEventId + same IdempotencyKey + same semantic payload
  -> existing result（重複新規作成しない）

same IdempotencyKey + different semantic payload
  -> CONFLICT
```

`auditEventId` / `correlationId` の採番方式、PayloadFingerprint algorithm、retry 回数は後続とする。

## Out of scope

```text
SharePoint List name
SharePoint internal column names
SharePoint REST / PnP implementation
Entra ID / SharePoint permissions
retry count
backoff algorithm
physical deletion job
retention cleanup job
UI
real data
deploy
```

## Implementation gate

```text
AUD-RET-1: Accepted
AUD-WR-1: Accepted
AUD-ALIGN-1: Accepted
AUD-IDEM-1: Accepted
AUD-SAN-VALUE-1: Accepted
AUD-SAN-1: HOLD（validateAuditEvent hardening 未了）
Persistence technical contract: MERGED（PR #99）
Next: AuditEvent contract hardening
Persistence implementation: HOLD
SharePoint adapter: NO-GO
Microsoft 365 changes: NO-GO
Deploy: NO-GO
```

本契約 MERGED および ALIGN/IDEM/SAN-VALUE Accepted だけでは implementation GO にしない。
Decision-AUD-SAN-1 クリア（hardening）後に Entry Review を再実行する。
