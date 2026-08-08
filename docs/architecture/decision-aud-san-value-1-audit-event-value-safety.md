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
Related: Decision-AUD-SAN-1 Accepted（validateAuditEvent hardening MERGED / PR #102）
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
Current validateAuditEvent: COMPLIANT ON MAIN（PR #102）
AuditEvent contract hardening: MERGED
Decision-AUD-SAN-1: Accepted
Decision-AUD-REPLAY-1: Accepted
Logical AuditEvent persistence boundary: MERGED（PR #104）
Decision-AUD-REPO-1: Accepted（別正本）
Replay logical implementation: MERGED（PR #106）
Issue #29 physical definition / mapping alignment: Accepted
Canonicalization to main: MERGED（PR #108 / aa0e6fba7dd8abf32523c70232001b5ac78cfc1b）
Dependency blocker（#29 mapping）: CLEARED
Next: 実 SharePoint adapter / tenant integration は別 Gate（SharePoint/M365/Deploy NO-GO）
Concrete repository / #22B synthetic: MERGED（PR #110 / 62a43d7fbb5b33f69e0f4adfbba405ab00c1fb81）
実 SharePoint adapter / tenant integration: 別 Gate / NO-GO
```

値契約 Accepted / `#22B` synthetic MERGED ≠ 実 SharePoint adapter / tenant GO。
hardening MERGED / SAN-1 Accepted / logical boundary MERGED だけでは replay 実装開始しない。

## 決めないこと

- targetType enum への新値追加（別 Accepted Decision）
- SemVer 必須化
- 未知の max length 発明
- SharePoint / adapter sanitizer
- Microsoft 365 / deploy

（`validateAuditEvent` hardening は後続 Work Order / PR #102 で実施済み）

## Gate

```text
Decision-AUD-SAN-VALUE-1: Accepted
Decision-AUD-SAN-1: Accepted
Decision-AUD-REPLAY-1: Accepted
AuditEvent contract hardening: MERGED（PR #102）
Logical AuditEvent persistence boundary: MERGED（PR #104）
Decision-AUD-REPO-1: Accepted（別正本）
Replay logical implementation: MERGED（PR #106）
Technical Decision blocker: CLEARED
Issue #29 physical definition / mapping alignment: Accepted
Canonicalization to main: MERGED（PR #108 / aa0e6fba7dd8abf32523c70232001b5ac78cfc1b）
Dependency blocker（#29 mapping）: CLEARED
Concrete Repository Entry Review: PASS（Issue #22 comment 5224544473）
Concrete repository / #22B synthetic: MERGED（PR #110 / 62a43d7fbb5b33f69e0f4adfbba405ab00c1fb81）
Ready: YES（consumed）
Merge: DONE
実 SharePoint adapter / tenant integration: 別 Gate / NO-GO
READY_FOR_HUMAN_GO: YES（consumed; #22B Human GO 5224579776）
SharePoint adapter: NO-GO
Microsoft 365 / Deploy: NO-GO
```
