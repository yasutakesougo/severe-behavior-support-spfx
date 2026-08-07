# Handoff state mutation

## 目的

Accepted 済みの Handoff 許可辺と `GOV-AUD-02` を前提に、`HandoffState` を次状態へ変換する純粋関数の技術契約を固定する。

本契約は現在状態の組み立てだけを扱う。

永続化、SharePoint、AuditEvent 発行、UI、Entra ID group mapping は扱わない。

## 正本

```text
Decision-HO-1: Accepted (#17)
Decision-HO-EDGE-1: Accepted
GOV-AUD-02: Accepted (Issue #19 comment 5215209914)
Handoff transition: PR #90 MERGED
Handoff role policy: PR #91 MERGED
HandoffState type / validator: Issue #27
```

## 関数

```ts
mutateHandoffState({
  currentState,
  targetStatus,
  occurredAt,
  actorId,
  meetingId,
})
```

`occurredAt` と `actorId` は、前進遷移で新しく発生する状態フィールドへ使用する。

`meetingId` は `pending -> included` のときだけ必須とする。

## 前進遷移

### not_required -> pending

```text
requestedAt = occurredAt
requestedBy = actorId
```

### pending -> included

既存 `requestedAt / requestedBy` を保持する。

```text
meetingId = input.meetingId
includedAt = occurredAt
includedBy = actorId
```

### included -> acknowledged

既存の requested / included 情報を保持する。

```text
acknowledgedAt = occurredAt
acknowledgedBy = actorId
```

### acknowledged -> closed

既存の requested / included / acknowledged 情報を保持する。

```text
closedAt = occurredAt
closedBy = actorId
```

## 戻り遷移

戻り遷移では、戻った状態より後のフィールドをクリアする。

### pending -> not_required

```text
status = not_required
その他の HandoffState フィールド = なし
```

### included -> pending

```text
requestedAt / requestedBy = 保持
meetingId / includedAt / includedBy = クリア
```

### acknowledged -> included

```text
requestedAt / requestedBy = 保持
meetingId / includedAt / includedBy = 保持
acknowledgedAt / acknowledgedBy = クリア
```

戻り操作を実行した actor / timestamp は `HandoffState` に新規フィールドとして追加しない。

その履歴は後続の AuditEvent 契約で扱う。

## 時系列

前進遷移の `occurredAt` は、現在状態が保持する最新時刻より前であってはならない。

```text
pending -> included:
occurredAt >= requestedAt

included -> acknowledged:
occurredAt >= includedAt

acknowledged -> closed:
occurredAt >= acknowledgedAt
```

戻り遷移でも `occurredAt` と `actorId` は有効値を要求するが、現在状態には保存しない。

## Fail-closed

次は拒否する。

```text
currentState が validateHandoffState を通らない
許可辺でない targetStatus
occurredAt が ISO DateTime でない
actorId が空
pending -> included で meetingId が空・欠落
pending -> included 以外で meetingId が指定される
前進遷移で時刻が逆行する
```

戻り遷移で後続フィールドを残さない。

## Result

```ts
type HandoffStateMutationResult =
  | Readonly<{ ok: true; state: HandoffState }>
  | Readonly<{
      ok: false;
      code:
        | "MALFORMED_INPUT"
        | "INVALID_TRANSITION"
        | "MEETING_ID_REQUIRED"
        | "UNEXPECTED_MEETING_ID"
        | "TIMESTAMP_REGRESSION";
    }>;
```

## 対象外

```text
ロール判定そのもの
認証
Entra ID
SharePoint
repository write
AuditEvent emission
履歴テーブル
UI
real data
deploy
```
