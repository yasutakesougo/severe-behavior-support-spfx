# Handoff AuditEvent candidate

## 目的

Handoff 状態変更に対応する `AuditEvent` 候補を純粋関数で生成する。

本契約は候補生成だけを扱う。
保存先、保存期間、SharePoint 書込み、adapter、UI、deploy は扱わない。

## 正本

```text
Handoff AuditEvent actionCode: HANDOFF_STATUS_CHANGED
Issue #17 Accepted comment: 5215557663
Handoff transition: PR #90 MERGED
Handoff role policy: PR #91 MERGED
Handoff state mutation: PR #93 MERGED
AuditEvent structure / strict allowlist: Issue #27
```

## actionCode

```text
HANDOFF_STATUS_CHANGED
```

前進・戻りのいずれも同じ actionCode を使用する。

## reasonCode

遷移方向は `reasonCode` へ非個人情報の固定コードとして格納する。

```text
HANDOFF_NOT_REQUIRED_TO_PENDING
HANDOFF_PENDING_TO_NOT_REQUIRED
HANDOFF_PENDING_TO_INCLUDED
HANDOFF_INCLUDED_TO_PENDING
HANDOFF_INCLUDED_TO_ACKNOWLEDGED
HANDOFF_ACKNOWLEDGED_TO_INCLUDED
HANDOFF_ACKNOWLEDGED_TO_CLOSED
```

reasonCode は許可辺から機械的に導出する。
未許可辺から監査イベント候補を生成しない。

## Function

```ts
buildHandoffStatusChangedAuditEventCandidate({
  auditEventId,
  OrganizationId,
  SiteId,
  actorStaffId,
  targetRecordId,
  currentStatus,
  targetStatus,
  occurredAt,
  correlationId,
  appVersion?,
  ruleSetVersion?,
})
```

## Output

成功時は既存 `AuditEvent` 契約を満たす候補を返す。

```text
actionCode: HANDOFF_STATUS_CHANGED
targetType: HandoffState
result: success
reasonCode: 遷移方向コード
```

## Fail-closed

次を拒否する。

```text
必須IDが空
SiteIdが空
actorStaffIdが空
targetRecordIdが空
occurredAtが不正ISO DateTime
correlationIdが空
currentStatus / targetStatusが不正
許可されていない状態遷移
生成結果が validateAuditEvent を通らない
```

## Privacy boundary

監査イベントへ次を格納しない。

```text
利用者氏名
支援計画本文
ABC本文
観察本文
会議本文
Password / Token / Secret
```

`targetRecordId` は業務レコード識別子だけを扱う。

## 対象外

```text
AuditLog保存期間
SharePoint列mapping
adapter write
retry
監査イベントID採番方式
correlationId採番方式
UI
real data
deploy
```
