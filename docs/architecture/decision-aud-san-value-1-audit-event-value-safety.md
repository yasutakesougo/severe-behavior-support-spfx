# Decision-AUD-SAN-VALUE-1 — AuditEvent value safety contract

この文書は、AuditEvent 許可フィールドの値安全性に関する
**Decision-AUD-SAN-VALUE-1** の Accepted 正本である。

Decision-AUD-SAN-1（全体の値サニタイズ / write-boundary 完了判定）とは別である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main before this decision-doc update: 29b6ed2872ea475590c3c5bb8f7c946fa76f3616
Decision ID: Decision-AUD-SAN-VALUE-1
Status: Accepted
Related HOLD: Decision-AUD-SAN-1（validateAuditEvent hardening 未了）
```

上位入口:

- [`decision-aud-align-1-audit-event-write-result-alignment.md`](./decision-aud-align-1-audit-event-write-result-alignment.md)
- [`finding-stable-id.md`](./finding-stable-id.md)（制御文字境界の再利用正本）
- [`finding-identity-assembly.md`](./finding-identity-assembly.md)

## Accepted 内容

### Sanitization model

採用:

```text
validate
+ fail-closed reject
```

不採用:

```text
mutate
mask
truncate
replace
best-effort sanitize
```

契約外・危険な値は加工保存せず `VALIDATION_FAILED` とする。
persistence port を呼ばない。

### Field classification

```text
auditEventId: IDENTIFIER
OrganizationId: IDENTIFIER
SiteId: IDENTIFIER
actorStaffId: IDENTIFIER
actionCode: CODE
targetType: CODE
targetRecordId: IDENTIFIER
result: ENUM
occurredAt: TIMESTAMP
correlationId: IDENTIFIER
reasonCode: CODE
appVersion: VERSION
ruleSetVersion: VERSION
```

AuditEvent へ `FREE_TEXT` 分類の field を追加しない。

### IDENTIFIER safety

対象:

```text
auditEventId
OrganizationId
SiteId
actorStaffId
targetRecordId
correlationId
```

最低条件:

```text
string
non-empty
value === value.trim()
C0 control characters: prohibited
DEL: prohibited
C1 control characters: prohibited
```

既存 FindingIdentity の安全境界を再利用する。

判定パターン正本（新 regex を発明しない）:

```text
/[\u0000-\u001F\u007F-\u009F]/u
```

（[`finding-stable-id.md`](./finding-stable-id.md) / FindingIdentity と同一）

行わないこと:

```text
trim して受理
NFKC normalization
case folding
値の自動修正
```

不正値は拒否する。

最大文字数は既存正本がないため、この Decision では新規固定しない。

### targetType

`targetType` は free text ではない。

初期有限集合（FINITE_ENUM）:

```text
HandoffState
```

将来の追加は Accepted Decision で集合を拡張する。

`synthetic-target-abc-record` は fixture 専用値であり canonical targetType として採用しない。

`isReasonCode` を `targetType` へ流用しない。
（既存 canonical 値 `HandoffState` と grammar が異なるため）

### actionCode / reasonCode

既存 `isReasonCode` grammar を維持する。

### result / occurredAt

- `result`: 既存 `AUDIT_EVENT_RESULTS` enum
- `occurredAt`: 既存 `isValidIsoDateTime`

### VERSION safety

対象:

```text
appVersion
ruleSetVersion
```

SemVer を必須化しない。SAN 上は opaque token として扱う。

最低条件:

```text
string
non-empty
value === value.trim()
C0 prohibited
DEL prohibited
C1 prohibited
```

意味的 version 規則は各 owner contract へ残す。

### No free-form containers

AuditEvent へ次を追加しない:

```text
payload
metadata
message
details
context
error
stack
freeText
```

### Raw data prohibition

AuditEvent へ次をコピーしない:

```text
利用者氏名
生年月日
住所
支援計画本文
ABC本文
観察本文
会議本文
自由記載本文
エラー本文
stack trace
Password
Token
Cookie
Client Secret
```

## Decision vs implementation（混同禁止）

```text
Decision-AUD-SAN-VALUE-1: Accepted
Current validateAuditEvent: NOT YET COMPLIANT
AuditEvent contract hardening: REQUIRED / NEXT
Decision-AUD-SAN-1: HOLD
Persistence implementation: HOLD
```

値契約 Accepted ≠ validator 実装完了。

## 決めないこと

- `validateAuditEvent` のコード変更（後続 hardening Work Order）
- targetType enum への新値追加（別 Accepted Decision）
- SemVer 必須化
- 未知の max length 発明
- SharePoint / adapter sanitizer
- Microsoft 365 / deploy

## Gate

```text
Decision-AUD-SAN-VALUE-1: Accepted
Decision-AUD-SAN-1: HOLD pending contract hardening
AuditEvent contract hardening: NEXT
Persistence implementation: HOLD
SharePoint adapter: NO-GO
Microsoft 365 / Deploy: NO-GO
```
