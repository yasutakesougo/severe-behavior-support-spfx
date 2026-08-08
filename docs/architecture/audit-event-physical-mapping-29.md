# AuditEvent physical SharePoint definition / mapping alignment（Issue #29）

この文書は Issue `#29` の **物理定義 / mapping alignment** 設計正本（docs-only）である。

Decision-AUD-REPO-1 Accepted 後の dependency blocker に対する
AuditEvent physical definition / mapping alignment を記録する。
SharePoint 実体変更・App Catalog・Microsoft 365 変更・deploy は含まない。`#22B` コード実装は別 PR（synthetic/fake のみ）。

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
PR #108 Independent Review: 5223968989（HOLD → P1-001/P1-002 fix）
PR #108 Independent Re-review: 5224461296（HOLD → P1-003/P1-004 fix）
Decision-AUD-REPO-1: Accepted
Logical persistence: MERGED（PR #104）
Replay logical: MERGED（PR #106）
Canonicalization to main: MERGED（PR #108 / aa0e6fba7dd8abf32523c70232001b5ac78cfc1b）
Dependency blocker（#29 mapping）: CLEARED
Concrete Repository Entry Review: PASS（Issue #22 comment 5224544473）
READY_FOR_HUMAN_GO: YES（consumed）
#22B Human GO: CONFIRMED（Issue #22 comment 5224579776）
Concrete repository / #22B: REVIEW PASS（PR #110 Independent Re-review 4888201572） / Ready YES
#22B Independent Re-review PASS head: 9abfc781e84912590e8a237d362066dadeed1dc2
#22B Readyization docs head: 965bd4d151e9d625693a7c2409a906a4c0e2f421
Merge: NO（別 GO）
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

Dependency blocker（#29 mapping）: CLEARED（PR #108 MERGED）。
Concrete Repository Entry Review: PASS（Issue #22 comment 5224544473）。
READY_FOR_HUMAN_GO: YES（consumed）
#22B Human GO: CONFIRMED（Issue #22 comment 5224579776）
#22B synthetic repository: REVIEW PASS（PR #110 Independent Re-review 4888201572）
#22B Independent Re-review PASS head: 9abfc781e84912590e8a237d362066dadeed1dc2
#22B Readyization docs head: 965bd4d151e9d625693a7c2409a906a4c0e2f421
Ready: YES
Merge: NO（別 GO）
SharePoint 実環境操作 / Microsoft 365 / Deploy: NO-GO
real data: PROHIBITED

## Scope

### IN

- AuditEvent persistence store の物理定義（Site role / List / 列 / uniqueness / occurredAt）
- `findByRecordId` / `findByIdempotencyKey` の物理照会（digest key-only）
- RecordId / IdempotencyKey の物理一意性 enforcement（Decision-AUD-REPO-1）
- `PersistedAuditEventWrite` への往復写像（logical evidence のみ）
- UTF16BE_HEX_V1 / digest framing（Revision 2）
- Generic List list-level state（Revision 2）
- 取得失敗・保存失敗・競合・multi-match の物理側扱い
- 権限・事業所分離の設計メモ（実装しない）

### OUT

```text
SharePoint 本番 List / 列作成・変更
App Catalog 登録・更新
実 tenant 向け PnPjs / REST / SPFx adapter 接続
Entra ID / Microsoft 365 変更
deploy / 実データ / 物理削除
logical write-result vocabulary の再定義
Decision-AUD-REPO-1 / REPLAY-1 / IDEM-1 の再オープン
DEC-013 / DEC-014 / Issue #4 の完了扱い
```

## Mapping Rules

1. 正本で確認できない Internal Name / List 名を確定値として書かない
2. Contract 名と SP 列名を同一視しない
3. Status: `確定` / `暫定` / `未確認` / `対象外`
4. physical metadata（ListItemId / ETag / Created / Modified / Author / URL）を
   `PersistedAuditEventWrite` に含めない
5. DEC-6（SupportPlan Adapter Entry）と混線しない。本表は AuditEvent store 専用
6. Decision-AUD-REPO-1 の uniqueness / multi-match / race 分類を物理手段で破らない
7. Revision 2 が Display Name を定義していない列について、Display Name を推測で埋めない

## Accepted 内容（Revision 2）

Human Acceptance（Issue #29 comment `5223669583`）は
reviewed Candidate Revision 2（`5223465404`）境界をそのまま Accepted とする。
本正本はその境界を変更しない。

独立差分レビュー `5223968989` の P1-001 / P1-002 は、本版で Accepted 境界へ戻す。

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
| Provisioning key | `SBS_AUDIT_EVENTS` | 確定 |
| Display Name | `SBS Audit Events` | 確定 |
| Path | `Lists/SBSAuditEvents` | 確定 |

### Generic List list-level state（Revision 2 / P2-001）

| Setting | Accepted value |
|---|---|
| Title | logical mapping NONE / Required NO / `#22B` read-write NO / default view excluded |
| AttachmentsEnabled | `false` |
| ContentTypesEnabled | `false` |
| EnableVersioning | `true` |
| EnableMinorVersions | `false` |
| EnableModeration / content approval | `false` |
| FolderCreation | `false` |

### Logical uniqueness（変更しない / Decision-AUD-REPO-1）

```text
RecordId identity
  = (OrganizationId, auditEvent.auditEventId)

Idempotency identity
  = (OrganizationId, idempotencyKey)

SiteId:
  uniqueness key には含めない
```

OrganizationId scope は port/concrete repository instance の `boundOrganizationId` で実現する。
port signature へ OrganizationId 引数を追加しない。

### Encoding / framing（Revision 2）

raw reversible evidence:

```text
UTF16BE_HEX_V1
  = "u16h1:" + 4-hex-digits per JavaScript UTF-16 code unit
```

digest helper（OrganizationId / token のみ）:

```text
encodeJsString(value):
  U64BE(value.length)          // JavaScript UTF-16 code-unit length
  || U16BE(each code unit)

no TextEncoder / UTF-8 / normalization
```

digest material（domain tag は raw ASCII。length-prefix UTF-16 framing に入れない）:

```text
record material:
  ASCII("AUDREC1")
  || encodeJsString(OrganizationId)      // boundOrganizationId
  || encodeJsString(auditEventId)        // recordId

idempotency material:
  ASCII("AUDIDEM1")
  || encodeJsString(OrganizationId)      // boundOrganizationId
  || encodeJsString(idempotencyKey)

RecordIdentityKey
  = SHA-256(record material) as lowercase 64 hex

IdempotencyIdentityKey
  = SHA-256(idempotency material) as lowercase 64 hex
```

- domain tag `AUDREC1` / `AUDIDEM1` は raw ASCII bytes のまま連結する
- `encodeJsString` は OrganizationId と record/idempotency token にのみ適用する
- logical string 契約を狭めない
- exact round-trip を維持する（raw 列は `UTF16BE_HEX_V1`）
- raw 値に trim / normalization / case fold を適用しない

### Physical uniqueness columns

| Internal Name | Column Type | Indexed / Unique | Role |
|---|---|---|---|
| `SbsAudRecordIdentityKey` | Single line text (64) | Indexed + Unique | SHA-256(record material) |
| `SbsAudIdempotencyIdentityKey` | Single line text (64) | Indexed + Unique | SHA-256(idempotency material) |

logical composite identity をそのまま unique text 列に載せない。
SharePoint text unique は case-insensitive であり、255 文字制限もあるため、
raw と固定長 identity key を分離する。

### Collision

```text
unique collision
  -> SAVE_OUTCOME_UNKNOWN
  -> REPLAY-1 dual verification

confirmed different logical write
  -> CONFLICT

detected uniqueness violation を直ちに CONFLICT としない
```

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

## Mapping Table（Contract → Physical）

Status 凡例:

- `確定` = Accepted Revision 2 から転記済み
- `対象外` = logical evidence 外
- Display Name: Revision 2 が定義していない列は埋めない（—）

| Mapping ID | Logical Field | Required | Logical Type | SP List | Display Name | Internal Name | Column Type | Indexed / Unique | Read Conversion | Write Conversion | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MAP-AUD-STORE-001 | （store 自体） | 必須 | AuditEvent persistence store | `SBS_AUDIT_EVENTS` / `Lists/SBSAuditEvents` | SBS Audit Events | — | List | — | — | — | 確定 |
| MAP-AUD-KEY-001 | RecordId identity key | 必須 | derived | `SBS_AUDIT_EVENTS` | — | `SbsAudRecordIdentityKey` | Single line text (64) | Indexed + Unique | digest hex | SHA-256(record material) | 確定 |
| MAP-AUD-KEY-002 | Idempotency identity key | 必須 | derived | `SBS_AUDIT_EVENTS` | — | `SbsAudIdempotencyIdentityKey` | Single line text (64) | Indexed + Unique | digest hex | SHA-256(idempotency material) | 確定 |
| MAP-AUD-001 | auditEvent.auditEventId | 必須 | string（RecordId component） | `SBS_AUDIT_EVENTS` | — | `SbsAudAuditEventIdEncoded` | Multiple lines plain text | — | `UTF16BE_HEX_V1` → string | string → `UTF16BE_HEX_V1` | 確定 |
| MAP-AUD-002 | idempotencyKey | 必須 | string（write metadata） | `SBS_AUDIT_EVENTS` | — | `SbsAudIdempotencyKeyEncoded` | Multiple lines plain text | — | `UTF16BE_HEX_V1` → string | string → `UTF16BE_HEX_V1` | 確定 |
| MAP-AUD-003 | OrganizationId | 必須 | string（uniqueness scope） | `SBS_AUDIT_EVENTS` | — | `SbsAudOrganizationIdEncoded` | Multiple lines plain text | — | `UTF16BE_HEX_V1` → string | string → `UTF16BE_HEX_V1` | 確定 |
| MAP-AUD-004 | SiteId | 任意 | string? | `SBS_AUDIT_EVENTS` | — | `SbsAudSiteIdEncoded` | Multiple lines plain text | uniqueness key に含めない | absent↔未設定 / `UTF16BE_HEX_V1` | absent↔未設定 / `UTF16BE_HEX_V1` | 確定 |
| MAP-AUD-005 | actorStaffId | 任意 | string? | `SBS_AUDIT_EVENTS` | — | `SbsAudActorStaffIdEncoded` | Multiple lines plain text | — | absent↔未設定 / `UTF16BE_HEX_V1` | absent↔未設定 / `UTF16BE_HEX_V1` | 確定 |
| MAP-AUD-006 | actionCode | 必須 | string（actionCode） | `SBS_AUDIT_EVENTS` | — | `SbsAudActionCode` | Single line text (64) | — | 非空 | 非空 | 確定 |
| MAP-AUD-007 | targetType | 必須 | enum（初期: HandoffState） | `SBS_AUDIT_EVENTS` | — | `SbsAudTargetType` | Choice: HandoffState | — | 許可値のみ | 許可値のみ | 確定 |
| MAP-AUD-008 | targetRecordId | 任意 | string? | `SBS_AUDIT_EVENTS` | — | `SbsAudTargetRecordIdEncoded` | Multiple lines plain text | — | absent↔未設定 / `UTF16BE_HEX_V1` | absent↔未設定 / `UTF16BE_HEX_V1` | 確定 |
| MAP-AUD-009 | result | 必須 | success/denied/failed | `SBS_AUDIT_EVENTS` | — | `SbsAudResult` | Choice: success/denied/failed | — | 許可値のみ | 許可値のみ | 確定 |
| MAP-AUD-010a | occurredAt（lexical 正本） | 必須 | ISO DateTime lexical | `SBS_AUDIT_EVENTS` | — | `SbsAudOccurredAtRaw` | Single line text | — | lexical string | lexical exact | 確定 |
| MAP-AUD-010b | occurredAt（query/retention） | 必須 | derived DateTime | `SBS_AUDIT_EVENTS` | — | `SbsAudOccurredAtUtc` | Date and Time | Indexed | DateTime | derived from lexical | 確定 |
| MAP-AUD-011 | correlationId | 必須 | string | `SBS_AUDIT_EVENTS` | — | `SbsAudCorrelationIdEncoded` | Multiple lines plain text | Unique ではない | `UTF16BE_HEX_V1` → string | string → `UTF16BE_HEX_V1` | 確定 |
| MAP-AUD-012 | reasonCode | 任意 | reasonCode? | `SBS_AUDIT_EVENTS` | — | `SbsAudReasonCode` | Single line text (64) | — | absent↔未設定 | absent↔未設定 | 確定 |
| MAP-AUD-013 | appVersion | 任意 | string? | `SBS_AUDIT_EVENTS` | — | `SbsAudAppVersionEncoded` | Multiple lines plain text | — | absent↔未設定 / `UTF16BE_HEX_V1` | absent↔未設定 / `UTF16BE_HEX_V1` | 確定 |
| MAP-AUD-014 | ruleSetVersion | 任意 | string? | `SBS_AUDIT_EVENTS` | — | `SbsAudRuleSetVersionEncoded` | Multiple lines plain text | — | absent↔未設定 / `UTF16BE_HEX_V1` | absent↔未設定 / `UTF16BE_HEX_V1` | 確定 |
| MAP-AUD-META-001 | ListItemId | — | physical | — | — | — | — | — | logical evidence に含めない | — | 対象外 |
| MAP-AUD-META-002 | ETag | — | physical | — | — | — | — | — | logical evidence に含めない | race/条件付書込は手段として別記 | 対象外（logical） |
| MAP-AUD-META-003 | Created / Modified / Author | — | physical | — | — | — | — | — | logical evidence に含めない | — | 対象外 |

## Physical query requirements

lookup / unique enforcement の OrganizationId scope は **digest 入力の `boundOrganizationId`** で実現する。
物理 query に `OrganizationId == boundOrganizationId` の追加 filter を付けない。
OrganizationId raw evidence は `SbsAudOrganizationIdEncoded`（`UTF16BE_HEX_V1`）に保存し、
取得後の Integrity verification（下記）で検証する。

```text
AuditEventExistingResultPort / concrete repository instance:
  target OrganizationId に bound される

port signature: 変更しない
  findByRecordId(recordId)
  findByIdempotencyKey(idempotencyKey)
```

Accepted Revision 2 lookup（key-only）:

```text
findByRecordId(recordId):
  key = SHA-256(
          ASCII("AUDREC1")
          || encodeJsString(boundOrganizationId)
          || encodeJsString(recordId)
        ) as lowercase 64 hex
  query SbsAudRecordIdentityKey == key
  0 rows -> NOT_FOUND
  1 row  -> read/convert + integrity verification（下記）
  >=2    -> RETRIEVAL_FAILED（1行を選ばない）

findByIdempotencyKey(idempotencyKey):
  key = SHA-256(
          ASCII("AUDIDEM1")
          || encodeJsString(boundOrganizationId)
          || encodeJsString(idempotencyKey)
        ) as lowercase 64 hex
  query SbsAudIdempotencyIdentityKey == key
  同上の count 規則
```

権限不足 → `FORBIDDEN`。
一時障害・不明 → `RETRIEVAL_FAILED`（成功や NOT_FOUND へ倒さない）。

## Read / write conversion（Accepted Revision 2）

### Write conversion

```text
UTF16BE_HEX_V1 columns:
  string -> "u16h1:" + 4-hex-digits per JS UTF-16 code unit
  optional absent/undefined -> SharePoint 未設定
  no trim / normalization / case fold
  no TextEncoder / UTF-8 path

identity keys:
  SbsAudRecordIdentityKey = SHA-256(record material)
  SbsAudIdempotencyIdentityKey = SHA-256(idempotency material)

actionCode / reasonCode:
  Single line text (64) — exact logical token（Encoded ではない）

Choice columns:
  SbsAudTargetType: 許可値のみ（初期: HandoffState）。未知値は書込拒否
  SbsAudResult: success / denied / failed のみ。未知値は書込拒否

occurredAt:
  SbsAudOccurredAtRaw = lexical ISO DateTime string（logical 正本）
  SbsAudOccurredAtUtc = derived Date and Time（query / retention）
```

### Read conversion

```text
UTF16BE_HEX_V1 decoder（fail-closed）:
  prefix が "u16h1:" でない -> fail
  残りが 4-hex 境界でない -> fail
  non-hex -> fail
  U+FFFD 置換なし
  成功時のみ JS string を復元

optional columns:
  SharePoint 未設定 <-> logical undefined / absent

Choice columns:
  未知 choice -> fail-closed（成功へ倒さない）

occurredAt logical source:
  SbsAudOccurredAtRaw のみ
  SbsAudOccurredAtUtc は query/retention 用 derived。logical occurredAt の正本にしない
```

## Integrity verification（Accepted Revision 2）

1 行取得後、`FOUND` + `PersistedAuditEventWrite` を返す前に次をすべて満たすこと。
論理 write-result vocabulary は再定義しない。

### Pre-return checks（MUST）

```text
1. all UTF16BE_HEX_V1 columns decode successfully
2. recompute RecordIdentityKey == stored SbsAudRecordIdentityKey
3. recompute IdempotencyIdentityKey == stored SbsAudIdempotencyIdentityKey
4. validateAuditEvent(reconstructed auditEvent) == true
5. decoded idempotencyKey is string
6. SbsAudOccurredAtRaw parses to the same instant as SbsAudOccurredAtUtc
7. template / system metadata is not copied into logical evidence
   （ListItemId / ETag / Created / Modified / Author / URL 等）
```

recompute 時の OrganizationId / recordId / idempotencyKey は、
decode 済み raw 値と lookup 時の `boundOrganizationId` / 引数 token の
Accepted digest material 定義に従う。

### Failure classification

```text
identity metadata mismatch
encoding malformed
  （UTF16BE_HEX_V1 prefix / 4-hex boundary / non-hex）
derived date mismatch
  （OccurredAtRaw instant != OccurredAtUtc instant）
  -> RETRIEVAL_FAILED

logical object reconstructed but invalid
  （validateAuditEvent == false 等）
  -> existing REPLAY-1 MALFORMED boundary

template/system metadata を logical evidence に混ぜない
  （混ぜた実装は不正。canonical conversion では除外する）
```

lookup count 規則（0 / 1 / ≥2）は変更しない。
本節は 1 行取得後の conversion / integrity のみを固定する。

## Failure Behavior（physical → logical）

| Physical situation | Logical result |
|---|---|
| 0 matches（digest key） | `NOT_FOUND` |
| 1 row + integrity checks PASS | `FOUND` + `PersistedAuditEventWrite` |
| 1 row + identity metadata mismatch / encoding malformed / derived date mismatch | `RETRIEVAL_FAILED` |
| 1 row + logical object reconstructed but invalid | REPLAY-1 `MALFORMED` boundary |
| ≥2 matches（digest key） | `RETRIEVAL_FAILED` |
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

## Review fix notes（PR #108）

| Finding | Fix |
|---|---|
| P1-001 canonicalization 未完了 | Internal Name / Column Type / list-level state / framing 詳細を Accepted Revision 2 から転記。Display Name は Rev2 未定義のため埋めない |
| P1-002 lookup strategy drift | `OrganizationId == boundOrganizationId AND ...` 追加 filter を削除。digest key-only lookup に戻す |
| P1-003 digest domain-tag framing | domain tag は raw ASCII(`AUDREC1`/`AUDIDEM1`)。`encodeJsString` は OrganizationId と token のみ |
| P1-004 read/write + integrity verification | Accepted の conversion / pre-return checks / 失敗分類を正本へ転記 |

## Approvals

```text
Decision-AUD-REPO-1: Accepted（意味契約）
#29 physical definition / mapping alignment: Accepted / MERGED（PR #108）
  Candidate: 5223465404 / Revision 2
  Independent Re-review: 5223625403 / PASS
  Human Acceptance: 5223669583
  Concrete Repository Entry Review: PASS（5224544473）
PR #108 Independent Review: 5223968989（HOLD）→ P1-001/P1-002 addressed
PR #108 Independent Re-review: 5224512796（PASS） / MERGED（aa0e6fba7dd8abf32523c70232001b5ac78cfc1b）
#29 full provisioning（DEC-013 / DEC-014 / #4）: OPEN
#22B concrete repository: REVIEW PASS（PR #110 Independent Re-review 4888201572） / Ready YES
#22B Independent Re-review PASS head: 9abfc781e84912590e8a237d362066dadeed1dc2
#22B Readyization docs head: 965bd4d151e9d625693a7c2409a906a4c0e2f421
Merge: NO（別 GO）
SharePoint 実環境操作 / M365 / Deploy: NO-GO
SharePoint / M365 実変更: NO-GO
```

## Gate

```text
Decision-AUD-REPO-1: Accepted
Issue #29 physical definition / mapping alignment: Accepted / MERGED（PR #108）
Canonicalization to main: MERGED（PR #108 / aa0e6fba7dd8abf32523c70232001b5ac78cfc1b）
Dependency blocker（#29 mapping）: CLEARED
Concrete Repository Entry Review: PASS（Issue #22 comment 5224544473）
READY_FOR_HUMAN_GO: YES（consumed）
#22B Human GO: CONFIRMED（Issue #22 comment 5224579776）
Concrete repository / #22B: REVIEW PASS（PR #110 Independent Re-review 4888201572） / Ready YES
#22B Independent Re-review PASS head: 9abfc781e84912590e8a237d362066dadeed1dc2
#22B Readyization docs head: 965bd4d151e9d625693a7c2409a906a4c0e2f421
Merge: NO（別 GO）
SharePoint adapter: NO-GO
Microsoft 365: NO-GO
Deploy: NO-GO
```

#29 mapping MERGED / Entry PASS / READY_FOR_HUMAN_GO: YES（consumed）
#22B Human GO: CONFIRMED（Issue #22 comment 5224579776）
#22B implementation GO ≠ SharePoint / Microsoft 365 / Deploy GO
#22B implementation GO ≠ Merge GO

## Next Actions

1. PR #110 Ready YES（Independent Re-review PASS 済）。Merge は別の明示的 GO 後のみ
2. SharePoint 実環境操作 / Microsoft 365 / Entra / Deploy / real data は継続 NO-GO
3. 本 PASS は synthetic/fake slice のみ。実 SharePoint adapter / tenant integration 完了を意味しない

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
SharePoint List/Column/Permission 実変更: NO-GO
Microsoft 365 / Entra / Deploy / real data: NO-GO
#22B concrete repository: REVIEW PASS（PR #110 / 4888201572） / Ready YES / Merge NO
Concrete Repository Entry Review: PASS（再実行済 / 5224544473）
#22B Human GO: CONFIRMED（Issue #22 comment 5224579776）
```
