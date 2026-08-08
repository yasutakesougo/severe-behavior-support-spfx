# AuditEvent physical SharePoint definition / mapping alignment（Issue #29）

この文書は Issue `#29` の **物理定義 / mapping alignment** 設計正本（docs-only）である。

Decision-AUD-REPO-1 Accepted 後の dependency blocker を解消するための設計草稿であり、
SharePoint 実体変更・App Catalog・Microsoft 365 変更・deploy・`#22B` 実装は含まない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Issue: #29
main before this draft: b28bfee5beea9d6eac3f239a88693c949b6e54a3
Decision-AUD-REPO-1: Accepted
  Candidate: 5219980098
  Independent Review: 5220288044（PASS）
  Human Acceptance: 5220303406
Logical persistence: MERGED（PR #104）
Replay logical: MERGED（PR #106）
Concrete Repository Entry Review: FAIL（本 Issue 未完了）
Concrete repository / #22B: HOLD
SharePoint adapter / Microsoft 365 / Deploy: NO-GO
```

上位入口:

- [`decision-aud-repo-1-audit-event-repository-uniqueness.md`](./decision-aud-repo-1-audit-event-repository-uniqueness.md)
- [`decision-aud-replay-1-audit-event-safe-replay.md`](./decision-aud-replay-1-audit-event-safe-replay.md)
- [`decision-aud-idem-1-audit-event-idempotency.md`](./decision-aud-idem-1-audit-event-idempotency.md)
- [`audit-event-persistence-contract.md`](./audit-event-persistence-contract.md)
- Contract側 mapping 様式参照: [`sharepoint-contract-mapping.md`](./sharepoint-contract-mapping.md)

## Purpose

```text
#22A logical repository / mapping contract
  → #29 physical SharePoint definition / mapping alignment  ← 本 Issue
  → #22B concrete SharePoint repository implementation
```

`#29` が揃うまで Concrete Repository Entry Review は FAIL のまま。
`#22B` は開始しない。

## Scope

### IN

- AuditEvent persistence store の物理定義候補（Site / List / 列 / 型）
- `findByRecordId` / `findByIdempotencyKey` の物理照会要件
- RecordId / IdempotencyKey の物理一意性 enforcement 要件（Decision-AUD-REPO-1）
- `PersistedAuditEventWrite` への往復写像（logical evidence のみ）
- 取得失敗・保存失敗・競合・multi-match の物理側扱い（論理結果への写像）
- 権限・事業所分離の設計メモ（実装しない）
- 手動設定 / 再現手順の要否記録（本番実行はしない）

### OUT

```text
SharePoint 本番 List / 列作成・変更
App Catalog 登録・更新
PnPjs / REST / SPFx adapter 実装（#22B）
Entra ID / Microsoft 365 変更
deploy / 実データ / 物理削除
logical write-result vocabulary の再定義
Decision-AUD-REPO-1 / REPLAY-1 / IDEM-1 の再オープン
```

## Mapping Rules

1. 正本で確認できない Internal Name / List 名を確定値として書かない
2. Contract 名と SP 列名を同一視しない
3. Status: `確定` / `暫定` / `未確認` / `対象外`
4. physical metadata（ListItemId / ETag / Created / Modified / Author / URL）を
   `PersistedAuditEventWrite` に含めない
5. DEC-6（SupportPlan Adapter Entry）と混線しない。本表は AuditEvent store 専用
6. Decision-AUD-REPO-1 の uniqueness / multi-match / race 分類を物理手段で破らない

## Logical evidence（変更しない）

```text
PersistedAuditEventWrite
├─ auditEvent: AuditEvent
└─ idempotencyKey: string
```

`AuditEvent` 許可フィールド（strict allowlist）:

```text
auditEventId
OrganizationId
SiteId?
actorStaffId?
actionCode
targetType
targetRecordId?
result
occurredAt
correlationId
reasonCode?
appVersion?
ruleSetVersion?
```

## Physical uniqueness requirements（Decision-AUD-REPO-1）

Accepted uniqueness scope（変更しない）:

```text
RecordId identity
  = (OrganizationId, auditEvent.auditEventId)

Idempotency identity
  = (OrganizationId, idempotencyKey)

SiteId:
  uniqueness key には含めない
```

| Logical identity | Uniqueness | Lookup port | Multi-match |
|---|---|---|---|
| `(OrganizationId, auditEvent.auditEventId)` | OrganizationId 空間内一意 MUST | `findByRecordId`（Org scope 内） | ≥2 → `RETRIEVAL_FAILED`（選ばない） |
| `(OrganizationId, idempotencyKey)` | 同一 OrganizationId 空間内一意 MUST | `findByIdempotencyKey`（Org scope 内） | ≥2 → `RETRIEVAL_FAILED`（選ばない） |

物理手段（unique column / indexed column / 別 List / conditional write）は
**未確認**。手段を推測で確定しない。要件だけ固定する。
store 全体一意や SiteId 込み uniqueness へ広げない。

競合作成（Decision-AUD-REPO-1 Accepted）:

```text
confirmed different logical write
  -> CONFLICT

collision したが save response だけでは
winner が same replay か conflict か判定不能
  -> SAVE_OUTCOME_UNKNOWN
  -> dual verification

detected uniqueness violation を直ちに CONFLICT としない
```

## Mapping Table（Contract → Physical）

Status 凡例: `確定` = 論理側確定 / `未確認` = 物理名未確認 / `対象外` = logical evidence 外

| Mapping ID | Logical Field | Required | Logical Type | SP List | Display Name | Internal Name | Column Type | Indexed / Unique | Read Conversion | Write Conversion | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MAP-AUD-STORE-001 | （store 自体） | 必須 | AuditEvent persistence store | 未確認 | 未確認 | 未確認 | List | — | — | — | 未確認 |
| MAP-AUD-001 | auditEvent.auditEventId | 必須 | string（RecordId component） | 未確認 | 未確認 | 未確認 | 未確認 | Unique with OrganizationId MUST | 非空 string | 非空 string | 論理確定 / 物理未確認 |
| MAP-AUD-002 | idempotencyKey | 必須 | string（write metadata） | 未確認 | 未確認 | 未確認 | 未確認 | Unique with OrganizationId MUST | 非空 string | 非空 string | 論理確定 / 物理未確認 |
| MAP-AUD-003 | OrganizationId | 必須 | string（uniqueness scope） | 未確認 | 未確認 | 未確認 | 未確認 | uniqueness key 構成要素 | 非空 | 非空 | 論理確定 / 物理未確認 |
| MAP-AUD-004 | SiteId | 任意 | string? | 未確認 | 未確認 | 未確認 | 未確認 | uniqueness key に含めない | absent↔未設定 | absent↔未設定 | 論理確定 / 物理未確認 |
| MAP-AUD-005 | actorStaffId | 任意 | string? | 未確認 | 未確認 | 未確認 | 未確認 | 未確認 | absent↔未設定 | absent↔未設定 | 論理確定 / 物理未確認 |
| MAP-AUD-006 | actionCode | 必須 | string（actionCode） | 未確認 | 未確認 | 未確認 | 未確認 | 未確認 | 非空 | 非空 | 論理確定 / 物理未確認 |
| MAP-AUD-007 | targetType | 必須 | enum（初期: HandoffState） | 未確認 | 未確認 | 未確認 | 未確認 | 未確認 | 許可値のみ | 許可値のみ | 論理確定 / 物理未確認 |
| MAP-AUD-008 | targetRecordId | 任意 | string? | 未確認 | 未確認 | 未確認 | 未確認 | 未確認 | absent↔未設定 | absent↔未設定 | 論理確定 / 物理未確認 |
| MAP-AUD-009 | result | 必須 | success/denied/failed | 未確認 | 未確認 | 未確認 | 未確認 | 未確認 | 許可値のみ | 許可値のみ | 論理確定 / 物理未確認 |
| MAP-AUD-010 | occurredAt | 必須 | ISO DateTime | 未確認 | 未確認 | 未確認 | 未確認 | 未確認 | ISO DateTime | ISO DateTime | 論理確定 / 物理未確認 |
| MAP-AUD-011 | correlationId | 必須 | string | 未確認 | 未確認 | 未確認 | 未確認 | Unique ではない | 非空 | 非空 | 論理確定 / 物理未確認 |
| MAP-AUD-012 | reasonCode | 任意 | reasonCode? | 未確認 | 未確認 | 未確認 | 未確認 | 未確認 | absent↔未設定 | absent↔未設定 | 論理確定 / 物理未確認 |
| MAP-AUD-013 | appVersion | 任意 | string? | 未確認 | 未確認 | 未確認 | 未確認 | 未確認 | absent↔未設定 | absent↔未設定 | 論理確定 / 物理未確認 |
| MAP-AUD-014 | ruleSetVersion | 任意 | string? | 未確認 | 未確認 | 未確認 | 未確認 | 未確認 | absent↔未設定 | absent↔未設定 | 論理確定 / 物理未確認 |
| MAP-AUD-META-001 | ListItemId | — | physical | — | — | — | — | — | logical evidence に含めない | — | 対象外 |
| MAP-AUD-META-002 | ETag | — | physical | — | — | — | — | — | logical evidence に含めない | race/条件付書込は #29 手段として別記 | 対象外（logical） |
| MAP-AUD-META-003 | Created / Modified / Author | — | physical | — | — | — | — | — | logical evidence に含めない | — | 対象外 |

## Physical query requirements

lookup / unique enforcement は OrganizationId uniqueness space 内で行う。
SiteId で絞って uniqueness を分けない。

```text
AuditEventExistingResultPort / concrete repository instance:
  target OrganizationId に bound される

port signature: 変更しない
  findByRecordId(recordId)
  findByIdempotencyKey(idempotencyKey)
```

OrganizationId は port 引数へ追加しない。instance の `boundOrganizationId` で filter する。

```text
findByRecordId(recordId):
  filter:
    OrganizationId == boundOrganizationId
    AND RecordId == recordId
  0 rows -> NOT_FOUND
  1 row  -> FOUND（PersistedAuditEventWrite へ変換可能なら）
           変換不能なら logical MALFORMED 経路
  >=2    -> RETRIEVAL_FAILED（1行を選ばない）

findByIdempotencyKey(idempotencyKey):
  filter:
    OrganizationId == boundOrganizationId
    AND IdempotencyKey == idempotencyKey
  同上の count 規則
```

権限不足 → `FORBIDDEN`。
一時障害・不明 → `RETRIEVAL_FAILED`（成功や NOT_FOUND へ倒さない）。

## Failure Behavior（physical → logical）

| Physical situation | Logical result |
|---|---|
| 0 matches（OrganizationId scope 内） | `NOT_FOUND` |
| 1 usable match | `FOUND` + `PersistedAuditEventWrite` |
| 1 unusable / malformed row | lookup `FOUND` だが verification 側 `MALFORMED` |
| ≥2 matches（OrganizationId scope 内） | `RETRIEVAL_FAILED` |
| permission denied | `FORBIDDEN` |
| transport / timeout / unknown | `RETRIEVAL_FAILED` |
| confirmed different logical write | `CONFLICT`（SAVED にしない） |
| collision したが winner が same replay / conflict か判定不能 | `SAVE_OUTCOME_UNKNOWN` → dual verification |
| commit outcome uncertain | `SAVE_OUTCOME_UNKNOWN` |

## Permissions / 事業所分離（設計メモ）

- 書込権限拒否は `FORBIDDEN`（success / not-found へ変換しない）
- OrganizationId / SiteId は AuditEvent 上の業務識別子。物理 List の権限モデルとの対応は **未確認**
- UI だけの分離に依存しないこと
- 本ドキュメントでは Entra グループ写像を確定しない

## Unresolved Items（#29 完了条件）

次が揃うまで `#29` は未完了、Concrete Repository Entry Review は FAIL:

1. AuditEvent persistence 用 SharePoint Site / List の識別（確定または明示 HOLD 理由）
2. MAP-AUD-001〜014 の Internal Name / Column Type（確定）
3. `(OrganizationId, RecordId)` / `(OrganizationId, IdempotencyKey)` の物理 unique enforcement 手段（確定）。SiteId を key に入れない
4. boundOrganizationId 付き `findByRecordId` / `findByIdempotencyKey` の物理照会手段（確定）。port signature は変更しない
5. race / conditional write に ETag 等を使う場合の手段メモ（使うなら確定、使わないなら対象外明示）
6. logical ↔ physical 変換で metadata を logical evidence へ漏らさないことの確認
7. 本番変更手順を成果物に含めないことの確認

仮名のまま Status を `確定` へ上げない。

## Approvals

```text
Decision-AUD-REPO-1: Accepted（意味契約）
#29 physical mapping: 設計中 / 物理名未確認
#22B concrete repository: 未着手（NO-GO）
SharePoint / M365 実変更: NO-GO
```

## Gate

```text
Decision-AUD-REPO-1: Accepted
Issue #29 physical definition / mapping alignment: IN PROGRESS（本 docs）
Concrete Repository Entry Review: FAIL（#29未完了）
Concrete repository: HOLD
READY_FOR_HUMAN_GO: NO
SharePoint adapter: NO-GO
Microsoft 365: NO-GO
Deploy: NO-GO
```

## Next Actions

1. 法人 / 運用側で AuditEvent store の Site / List / 列 Internal Name を確認し、本表の `未確認` を埋める
2. OrganizationId-scoped RecordId / IdempotencyKey の物理 unique 手段を確定する（SiteId は key 外）
3. `#29` 完了後に Concrete Repository Entry Review を再実行する
4. Entry PASS + 別 Human GO 後にのみ `#22B` を開始する

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** / tests/**: 本 Issue の docs 段階では変更しない
#22B concrete repository: HOLD
```
