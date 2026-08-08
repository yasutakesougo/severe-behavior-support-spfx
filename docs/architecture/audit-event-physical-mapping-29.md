# AuditEvent physical SharePoint definition / mapping alignment（Issue #29）

この文書は Issue `#29` の **物理定義 / mapping alignment** 設計正本（docs-only）である。

Decision-AUD-REPO-1 Accepted 後の dependency blocker に対する
AuditEvent physical definition / mapping alignment を記録する。
SharePoint 実体変更・App Catalog・Microsoft 365 変更・deploy・`#22B` 実装は含まない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Issue: #29
Status: Accepted（physical definition / mapping alignment）
main before this canonicalization: a7fbbf0336e1a446045da87a36b05faf54c99ad3
Accepted evidence:
  Candidate: Issue #29 comment 5223465404 / Revision 2
  Previous Independent Review: 5223589138（HOLD）
  Independent Re-review: Issue #29 comment 5223625403（PASS / P0/P1/P2 = 0/0/0）
  Human Acceptance: Issue #29 comment 5223669583
Decision-AUD-REPO-1: Accepted
Logical persistence: MERGED（PR #104）
Replay logical: MERGED（PR #106）
Canonicalization to main: THIS PR（docs-only）
Dependency blocker: NOT CLEARED（Merge 完了まで）
Concrete Repository Entry Review: FAIL / 未再実行
Concrete repository / #22B: HOLD
SharePoint adapter / Microsoft 365 / Deploy: NO-GO
Issue #29 full provisioning: OPEN
  DEC-013 サイト命名: Proposed
  DEC-014 グループ命名: Proposed
  Issue #4 A/B試験サイト・M365管理者確認: 未完了
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
  → #29 physical SharePoint definition / mapping alignment  ← 本 Issue（Accepted）
  → #22B concrete SharePoint repository implementation
```

Accepted ≠ dependency blocker CLEARED。
blocker は本正本の docs-only Merge 後に初めて CLEARED を検討する。
Concrete Repository Entry Review は Merge 後に再実行する（本 PR では再実行しない）。
`#22B` は開始しない。

## Scope

### IN

- AuditEvent persistence store の物理定義（Site role / List / uniqueness / occurredAt）
- `findByRecordId` / `findByIdempotencyKey` の物理照会要件
- RecordId / IdempotencyKey の物理一意性 enforcement 要件（Decision-AUD-REPO-1）
- `PersistedAuditEventWrite` への往復写像（logical evidence のみ）
- 取得失敗・保存失敗・競合・multi-match の物理側扱い（論理結果への写像）
- Generic List list-level state の明示（Revision 2）
- UTF-16 code-unit injective framing + `UTF16BE_HEX_V1`（Revision 2）
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
DEC-013 / DEC-014 / Issue #4 の完了扱い
Concrete Repository Entry Review の再実行（Merge 後）
```

## Mapping Rules

1. 正本で確認できない Internal Name / List 名を確定値として書かない
2. Contract 名と SP 列名を同一視しない
3. Status: `確定` / `暫定` / `未確認` / `対象外` / `Accepted（Issue正本）/ docs未転記`
4. physical metadata（ListItemId / ETag / Created / Modified / Author / URL）を
   `PersistedAuditEventWrite` に含めない
5. DEC-6（SupportPlan Adapter Entry）と混線しない。本表は AuditEvent store 専用
6. Decision-AUD-REPO-1 の uniqueness / multi-match / race 分類を物理手段で破らない
7. Accepted Issue コメントにのみ存在する列 Internal Name を、未取得のまま推測で埋めない

## Accepted 内容（Revision 2）

Human Acceptance（Issue #29 comment `5223669583`）は
reviewed Candidate Revision 2（`5223465404`）境界をそのまま Accepted とする。
本正本はその境界を変更しない。

Issue コメント全文の docs 転記は、環境の Issues: Read 制約により一部未完了である。
未転記セルは推測で埋めず `Accepted（Issue正本）/ docs未転記` とする。
独立差分レビューは Issue `#29` comment `5223465404` と本差分を照合すること。

### Store / Site

```text
Store role:
  法人共通 site role

actual site URL:
  configuration で与える
  DEC-013 Accepted 前に /sites/... を hard-code しない
```

### List

| Role | Value | Status |
|---|---|---|
| Provisioning key | `SBS_AUDIT_EVENTS` | Accepted |
| Display Name | `SBS Audit Events` | Accepted |
| Path | `Lists/SBSAuditEvents` | Accepted |

### Logical uniqueness（変更しない / Decision-AUD-REPO-1）

```text
RecordId identity
  = (OrganizationId, auditEvent.auditEventId)

Idempotency identity
  = (OrganizationId, idempotencyKey)

SiteId:
  uniqueness key には含めない
```

### Physical uniqueness

```text
derived SHA-256 physical key × 2
  → Single line text / 64 chars（lowercase hex）
  → Indexed + Unique
```

理由（Accepted Candidate）:

- SharePoint の unique constraint は列単位で、一意列には index が必要
- text unique は大文字小文字を区別しない
- そのため logical composite identity をそのまま 2 列 unique としない
- exact input から生成した固定長 lowercase SHA-256 physical key へ落とす
- Single line text は最大 255 文字のため、max length 未定義の logical token を
  勝手に 255 へ切り詰めない
- raw 値と固定長 identity key を分離する

### Raw value preservation

```text
raw values: exact 保存
trim / normalization / case fold: なし
```

### String framing（Revision 2 / P1-001）

```text
UTF-16 code-unit injective framing
+ UTF16BE_HEX_V1 reversible storage
```

- logical string 契約を狭めない
- exact round-trip を維持する

### occurredAt（dual columns）

| Internal Name | Role | Status |
|---|---|---|
| `SbsAudOccurredAtRaw` | lexical value 正本 | Accepted |
| `SbsAudOccurredAtUtc` | query / retention 用 derived DateTime | Accepted |

### Collision

```text
unique collision
  -> SAVE_OUTCOME_UNKNOWN
  -> REPLAY-1 dual verification

confirmed different logical write
  -> CONFLICT

detected uniqueness violation を直ちに CONFLICT としない
```

### Generic List list-level state（Revision 2 / P2-001）

Revision 2 で次を明示する（具体 on/off 値の docs 転記は Issue 正本照合が必要）:

```text
Title
attachments
content types
versioning
moderation
folder creation
```

未転記の具体値は推測で埋めない。Issue `#29` comment `5223465404` を正本とする。

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

| Logical identity | Uniqueness | Lookup port | Multi-match |
|---|---|---|---|
| `(OrganizationId, auditEvent.auditEventId)` | OrganizationId 空間内一意 MUST | `findByRecordId`（Org scope 内） | ≥2 → `RETRIEVAL_FAILED`（選ばない） |
| `(OrganizationId, idempotencyKey)` | 同一 OrganizationId 空間内一意 MUST | `findByIdempotencyKey`（Org scope 内） | ≥2 → `RETRIEVAL_FAILED`（選ばない） |

物理 unique 手段は Accepted どおり **derived SHA-256 key × 2（Indexed + Unique）**。
store 全体一意や SiteId 込み uniqueness へ広げない。

## Mapping Table（Contract → Physical）

Status 凡例:

- `確定` = 本 docs に転記済みの Accepted 値
- `Accepted（Issue正本）/ docs未転記` = Issue `#29` comment `5223465404` Rev2 で Accepted 済みだが、本環境では全文未取得のため Internal Name 等を推測転記しない
- `対象外` = logical evidence 外

| Mapping ID | Logical Field | Required | Logical Type | SP List | Display Name | Internal Name | Column Type | Indexed / Unique | Read Conversion | Write Conversion | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MAP-AUD-STORE-001 | （store 自体） | 必須 | AuditEvent persistence store | `SBS_AUDIT_EVENTS` / `Lists/SBSAuditEvents` | SBS Audit Events | — | List | — | — | — | 確定（List） / Site URL は configuration |
| MAP-AUD-001 | auditEvent.auditEventId | 必須 | string（RecordId component） | `SBS_AUDIT_EVENTS` | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | raw + derived SHA-256 key（64） | derived key: Indexed + Unique MUST | exact raw; key=SHA-256 | exact raw; key=SHA-256 | 手段確定 / 列名 docs未転記 |
| MAP-AUD-002 | idempotencyKey | 必須 | string（write metadata） | `SBS_AUDIT_EVENTS` | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | raw + derived SHA-256 key（64） | derived key: Indexed + Unique MUST | exact raw; key=SHA-256 | exact raw; key=SHA-256 | 手段確定 / 列名 docs未転記 |
| MAP-AUD-003 | OrganizationId | 必須 | string（uniqueness scope） | `SBS_AUDIT_EVENTS` | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | uniqueness key 構成要素 | 非空 | 非空 | 論理確定 / 列名 docs未転記 |
| MAP-AUD-004 | SiteId | 任意 | string? | `SBS_AUDIT_EVENTS` | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | uniqueness key に含めない | absent↔未設定 | absent↔未設定 | 論理確定 / 列名 docs未転記 |
| MAP-AUD-005 | actorStaffId | 任意 | string? | `SBS_AUDIT_EVENTS` | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | absent↔未設定 | absent↔未設定 | 列名 docs未転記 |
| MAP-AUD-006 | actionCode | 必須 | string（actionCode） | `SBS_AUDIT_EVENTS` | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | 非空 | 非空 | 列名 docs未転記 |
| MAP-AUD-007 | targetType | 必須 | enum（初期: HandoffState） | `SBS_AUDIT_EVENTS` | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | 許可値のみ | 許可値のみ | 列名 docs未転記 |
| MAP-AUD-008 | targetRecordId | 任意 | string? | `SBS_AUDIT_EVENTS` | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | absent↔未設定 | absent↔未設定 | 列名 docs未転記 |
| MAP-AUD-009 | result | 必須 | success/denied/failed | `SBS_AUDIT_EVENTS` | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | 許可値のみ | 許可値のみ | 列名 docs未転記 |
| MAP-AUD-010 | occurredAt | 必須 | ISO DateTime（lexical + derived） | `SBS_AUDIT_EVENTS` | — | `SbsAudOccurredAtRaw` / `SbsAudOccurredAtUtc` | Raw lexical 正本 + derived DateTime | Utc は query/retention 用 | Raw=lexical 正本 | Raw exact; Utc derived | 確定（dual Internal Name） |
| MAP-AUD-011 | correlationId | 必須 | string | `SBS_AUDIT_EVENTS` | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | Unique ではない | 非空 | 非空 | 列名 docs未転記 |
| MAP-AUD-012 | reasonCode | 任意 | reasonCode? | `SBS_AUDIT_EVENTS` | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | absent↔未設定 | absent↔未設定 | 列名 docs未転記 |
| MAP-AUD-013 | appVersion | 任意 | string? | `SBS_AUDIT_EVENTS` | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | absent↔未設定 | absent↔未設定 | 列名 docs未転記 |
| MAP-AUD-014 | ruleSetVersion | 任意 | string? | `SBS_AUDIT_EVENTS` | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | Accepted（Issue正本）/ docs未転記 | absent↔未設定 | absent↔未設定 | 列名 docs未転記 |
| MAP-AUD-META-001 | ListItemId | — | physical | — | — | — | — | — | logical evidence に含めない | — | 対象外 |
| MAP-AUD-META-002 | ETag | — | physical | — | — | — | — | — | logical evidence に含めない | race/条件付書込は手段として別記 | 対象外（logical） |
| MAP-AUD-META-003 | Created / Modified / Author | — | physical | — | — | — | — | — | logical evidence に含めない | — | 対象外 |

## Physical query requirements

lookup / unique enforcement は OrganizationId uniqueness space 内で行う。
SiteId で絞って uniqueness を分けない。

物理 lookup 面は derived SHA-256 Indexed+Unique key（×2）を用いる。
raw logical token を unique 列に直接載せない。

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
    AND RecordId physical key == SHA-256(framed exact recordId input)
  0 rows -> NOT_FOUND
  1 row  -> FOUND（PersistedAuditEventWrite へ変換可能なら）
           変換不能なら logical MALFORMED 経路
  >=2    -> RETRIEVAL_FAILED（1行を選ばない）

findByIdempotencyKey(idempotencyKey):
  filter:
    OrganizationId == boundOrganizationId
    AND IdempotencyKey physical key == SHA-256(framed exact idempotencyKey input)
  同上の count 規則
```

framing は Revision 2 の UTF-16 code-unit injective framing + `UTF16BE_HEX_V1`。
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
| unique collision / winner が same replay / conflict か判定不能 | `SAVE_OUTCOME_UNKNOWN` → dual verification |
| commit outcome uncertain | `SAVE_OUTCOME_UNKNOWN` |

## Permissions / 事業所分離（設計メモ）

- 書込権限拒否は `FORBIDDEN`（success / not-found へ変換しない）
- OrganizationId / SiteId は AuditEvent 上の業務識別子。物理 List の権限モデルとの対応は **未確認**（DEC-014 / Issue `#4` 未完了）
- UI だけの分離に依存しないこと
- 本ドキュメントでは Entra グループ写像を確定しない

## Docs transfer / Remaining（canonicalization）

本 PR で docs へ確定転記済み:

1. Acceptance 証跡（`5223465404` / `5223625403` / `5223669583`）
2. Store role / configuration URL 方針
3. List provisioning key / Display / Path
4. Physical uniqueness 手段（SHA-256 ×2 / 64 chars / Indexed+Unique）
5. Raw exact 保存 / no trim-normalize-casefold
6. `UTF16BE_HEX_V1` framing（Revision 2）
7. `SbsAudOccurredAtRaw` / `SbsAudOccurredAtUtc`
8. Collision → `SAVE_OUTCOME_UNKNOWN` → REPLAY-1 dual verification
9. Generic List list-level axes（Revision 2）

docs 未転記（Issue 正本照合が必要。推測禁止）:

1. MAP-AUD-001〜009 / 011〜014 の Display Name / Internal Name / Column Type 全文
2. 2× SHA-256 physical key 列の Internal Name
3. Generic List list-level state の具体 on/off 値
4. race / conditional write に ETag を使うか否かの最終メモ（Issue 正本どおり）
5. framing アルゴリズム詳細ステップ（Issue 正本どおり）

仮名のまま Status を `確定` へ上げない。

## Approvals

```text
Decision-AUD-REPO-1: Accepted（意味契約）
#29 physical definition / mapping alignment: Accepted
  Candidate: 5223465404 / Revision 2
  Independent Re-review: 5223625403 / PASS
  Human Acceptance: 5223669583
#29 full provisioning（DEC-013 / DEC-014 / #4）: OPEN
#22B concrete repository: 未着手（HOLD / NO-GO）
SharePoint / M365 実変更: NO-GO
```

## Gate

```text
Decision-AUD-REPO-1: Accepted
Issue #29 physical definition / mapping alignment: Accepted
Canonicalization to main: THIS PR（docs-only / OPEN）
Dependency blocker: NOT CLEARED
Concrete Repository Entry Review: FAIL / 未再実行
Concrete repository / #22B: HOLD
READY_FOR_HUMAN_GO: NO
SharePoint adapter: NO-GO
Microsoft 365: NO-GO
Deploy: NO-GO
```

Accepted ≠ dependency blocker CLEARED。
Accepted ≠ Concrete Repository Entry Review PASS。
Accepted ≠ `#22B` / SharePoint / Microsoft 365 / Deploy GO。

## Next Actions

1. 本 docs-only PR の独立差分レビュー（Issue `#29` comment `5223465404` Rev2 と照合）
2. docs 未転記セルがある場合は Issue 本文転記を完了してから Ready / Merge
3. Merge 後に dependency blocker CLEARED を記録し、Concrete Repository Entry Review を再実行する
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
Concrete Repository Entry Review: 本 PR では再実行しない
```
