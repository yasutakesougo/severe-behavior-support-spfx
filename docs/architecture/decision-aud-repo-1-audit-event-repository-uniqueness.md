# Decision-AUD-REPO-1 — AuditEvent repository uniqueness / multi-match / race

この文書は、AuditEvent concrete repository 着手前の意味契約に関する
**Decision-AUD-REPO-1** の Accepted 正本である。

物理 SharePoint List / 列 / unique index / ETag は扱わない（Issue `#29`）。
concrete SharePoint adapter 実装は扱わない（Issue `#22B`）。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AUD-REPO-1
Status: Accepted
main before this canonicalization: b28bfee5beea9d6eac3f239a88693c949b6e54a3
Owner: Issue #22A（Decision-AUD-WR-1）
Accepted evidence:
  Candidate: Issue #22 comment 5219980098
  Independent Review: Issue #22 comment 5220288044（PASS / P0/P1/P2 = 0/0/0）
  Human Acceptance: Issue #22 comment 5220303406
Depends on:
  Decision-AUD-WR-1 Accepted
  Decision-AUD-ALIGN-1 Accepted
  Decision-AUD-IDEM-1 Accepted
  Decision-AUD-REPLAY-1 Accepted
Logical persistence boundary: MERGED（PR #104）
Replay logical implementation: MERGED（PR #106）
```

上位入口:

- [`decision-aud-wr-1-audit-write-ownership.md`](./decision-aud-wr-1-audit-write-ownership.md)
- [`decision-aud-idem-1-audit-event-idempotency.md`](./decision-aud-idem-1-audit-event-idempotency.md)
- [`decision-aud-replay-1-audit-event-safe-replay.md`](./decision-aud-replay-1-audit-event-safe-replay.md)
- [`audit-event-persistence-contract.md`](./audit-event-persistence-contract.md)
- [`src/domain/audit-event-persistence.ts`](../../src/domain/audit-event-persistence.ts)
- Issue `#29` physical mapping: [`audit-event-physical-mapping-29.md`](./audit-event-physical-mapping-29.md)

## Accepted 内容

Human Acceptance（Issue #22 comment `5220303406`）は
reviewed candidate boundary をそのまま Accepted とする。
本正本はその境界を変更しない。

### RecordId uniqueness

```text
RecordId identity
  = (OrganizationId, auditEvent.auditEventId)

MUST be unique within the OrganizationId uniqueness space
```

`auditEvent.auditEventId` 単独の store 全体一意ではない。

### IdempotencyKey uniqueness

```text
Idempotency identity
  = (OrganizationId, idempotencyKey)

MUST be unique within the same OrganizationId uniqueness space
```

### SiteId

```text
SiteId:
  uniqueness key には含めない
```

SiteId 別の uniqueness 空間を作らない。
SiteId の有無・値は RecordId / Idempotency identity を変えない。

### 採用しない

```text
store 全体一意（OrganizationId を無視した uniqueness）
SiteId を uniqueness key に含めること
correlationId を IdempotencyKey として使うこと
```

### OrganizationId binding（port / concrete repository）

```text
AuditEventExistingResultPort / concrete repository instance:
  target OrganizationId に bound される
```

lookup の OrganizationId scope は **boundOrganizationId** で実現する。
port signature へ OrganizationId 引数を追加しない。

```text
port signature: 変更しない

findByRecordId(recordId)
findByIdempotencyKey(idempotencyKey)
```

物理 lookup（Issue `#29` Accepted Revision 2 / `#22B`）:

OrganizationId scope は digest 入力の `boundOrganizationId` で実現する。
物理 query に `OrganizationId == boundOrganizationId` の追加 filter は付けない。
正本: [`audit-event-physical-mapping-29.md`](./audit-event-physical-mapping-29.md)

```text
findByRecordId(recordId):
  key = SHA-256(
          ASCII("AUDREC1")
          || encodeJsString(boundOrganizationId)
          || encodeJsString(recordId)
        ) as lowercase 64 hex
  query SbsAudRecordIdentityKey == key

findByIdempotencyKey(idempotencyKey):
  key = SHA-256(
          ASCII("AUDIDEM1")
          || encodeJsString(boundOrganizationId)
          || encodeJsString(idempotencyKey)
        ) as lowercase 64 hex
  query SbsAudIdempotencyIdentityKey == key
```

`encodeJsString` / domain-tag ASCII 契約の正本は
[`audit-event-physical-mapping-29.md`](./audit-event-physical-mapping-29.md)。
domain tag を length-prefix UTF-16 framing に入れない。

### Lookup match count

lookup は bound OrganizationId uniqueness space 内で数える。

| Count | Meaning |
|---|---|
| 0 | persisted evidence なし → `NOT_FOUND` |
| 1 | 単一候補 → `PersistedAuditEventWrite` として利用可能なら `FOUND` |
| ≥2 | OrganizationId uniqueness space の invariant 違反。1 行を選んではならない |

### Multi-match fail-closed

```text
lookup match count >= 2
  -> MUST NOT pick one row
  -> MUST NOT return FOUND
  -> port result: RETRIEVAL_FAILED
```

Decision-AUD-REPLAY-1 の写像は変更しない:

```text
pre-save RETRIEVAL_FAILED -> SAVE_FAILED（save 試行しない）
SAVE_OUTCOME_UNKNOWN recovery 中の RETRIEVAL_FAILED
  -> SAVE_OUTCOME_UNKNOWN を維持
```

単一 `FOUND` だが `PersistedAuditEventWrite` として使えない場合は
logical `MALFORMED`（multi-match とは別）。

### Concurrent create race

dual `NOT_FOUND` 後の競合作成について:

```text
1. dual NOT_FOUND は save 試行を許可するだけであり、一意成功を保証しない
2. collision / uniqueness pressure を検出した writer は
   save response だけで SAVED を返してはならない
3. confirmed different logical write -> CONFLICT
4. collision したが save response だけでは
   winner が same replay か conflict か判定不能
   -> SAVE_OUTCOME_UNKNOWN
   -> dual verification（Decision-AUD-REPLAY-1）
5. SAVE_OUTCOME_UNKNOWN を SAVE_FAILED / SAVED / CONFLICT へ縮退しない
```

`detected uniqueness violation -> CONFLICT` とはしない。
同一 replay が同時に先着保存されたが save response だけでは
winner を分類できない場合は `SAVE_OUTCOME_UNKNOWN` → dual verification を維持する。

### Layer split（維持）

| 層 | 責務 |
|---|---|
| Decision-AUD-REPLAY-1 / PR #106 | dual lookup・分類・safe replay。自動 retry loop なし |
| **Decision-AUD-REPO-1** | uniqueness 意味・multi-match・race の CONFLICT/UNKNOWN 分類 |
| Issue `#29` | 物理 unique / index / ETag / List・列 mapping |
| Issue `#22B` | `#29` 後の concrete SharePoint repository 実装 |

## 変更しない契約

```text
write-result vocabulary（6値）
AuditEventExistingLookupResult kinds
  FOUND / NOT_FOUND / FORBIDDEN / RETRIEVAL_FAILED
PersistedAuditEventWrite = { auditEvent, idempotencyKey }
AuditEventExistingResultPort / AuditEventPersistencePort signature
  （OrganizationId 引数を追加しない。instance bind で scope する）
physical metadata を logical evidence に含めない
automatic retry: prohibited
blind retry: prohibited
```

## 決めないこと / 後続

```text
SharePoint List Internal Name
Column Internal Name / Column Type
unique constraint / index の具体手段
ETag / conditional write の具体手段
List Item ID / Created / Modified / Author
PnPjs / REST / provisioning
concrete repository 実装（#22B）
retry eligibility / count / backoff（別 Decision）
Microsoft 365 / Entra ID / Deploy
```

正本へ送る先:

- 物理定義 / mapping: [`audit-event-physical-mapping-29.md`](./audit-event-physical-mapping-29.md)（Issue `#29`）
- concrete adapter: Issue `#22B`（`#29` 完了 + Concrete Repository Entry Review PASS + 別 Human GO 後）

## Gate

```text
Decision-AUD-REPO-1: Accepted
Technical Decision blocker: CLEARED
Issue #29 physical definition / mapping alignment: Accepted / MERGED（PR #108）
  Candidate: 5223465404 / Revision 2
  Independent Re-review: 5223625403（PASS）
  Human Acceptance: 5223669583
  main: aa0e6fba7dd8abf32523c70232001b5ac78cfc1b
Dependency blocker（#29 mapping）: CLEARED
Concrete Repository Entry Review: PASS（Issue #22 comment 5224544473）
READY_FOR_HUMAN_GO: YES（consumed）
#22B Human GO: CONFIRMED（Issue #22 comment 5224579776）
Concrete repository / #22B: MERGED（PR #110 / 62a43d7fbb5b33f69e0f4adfbba405ab00c1fb81）
#22B head: 9abfc781e84912590e8a237d362066dadeed1dc2
Merge: DONE（PR #110 / 62a43d7fbb5b33f69e0f4adfbba405ab00c1fb81）
READY_FOR_HUMAN_GO note: #22B PR #110 MERGED（synthetic）; 実 SharePoint は別 Gate
SharePoint adapter: NO-GO
Microsoft 365: NO-GO
Deploy: NO-GO
```

Accepted / `#22B` synthetic MERGED ≠ 実 SharePoint adapter / tenant GO。
Accepted ≠ SharePoint / Microsoft 365 / Deploy GO。
`#22B` PR #110 MERGED（62a43d7f…）。SharePoint 実環境は別 Gate / NO-GO。
