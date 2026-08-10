# AssessmentSnapshot — SharePoint logical ↔ persistence mapping（MT-1）

この文書は、Decision-AS-SCHEMA-MAPPING-NEXT-1 Accepted（**MT-1**）に基づく
AssessmentSnapshot の **logical field → persistence field slot** 明示 mapping 表である。

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-schema-mapping-next-acceptance.md`](./decision-assessment-snapshot-schema-mapping-next-acceptance.md)
（MT-1 + IN-A + CP-1 + XB-1）
[`decision-assessment-snapshot-dec6-mapping-acceptance.md`](./decision-assessment-snapshot-dec6-mapping-acceptance.md)
（LF-1 + RW-1 + MF-1 + VR-1）
[`decision-assessment-snapshot-conversion-acceptance.md`](./decision-assessment-snapshot-conversion-acceptance.md)
（C-1-A + C-2-DERIVED + C-3-A + C-4-A + XB-1）
[`assessment-snapshot-conversion-contract.md`](./assessment-snapshot-conversion-contract.md)
[`decision-assessment-snapshot-cv-extension-acceptance.md`](./decision-assessment-snapshot-cv-extension-acceptance.md)
（M-1-A + X-1-B + X-2-A + X-3-B + X-4-B + X-5-B + XB-1）
[`decision-assessment-snapshot-map010-column-acceptance.md`](./decision-assessment-snapshot-map010-column-acceptance.md)
（N-1-A + N-2-A + T-1-A + O-1-A + R-1-A + W-1-A + XB-1）
[`assessment-snapshot-map010-column-contract.md`](./assessment-snapshot-map010-column-contract.md)
[`decision-assessment-snapshot-column-create-vr1-evidence.md`](./decision-assessment-snapshot-column-create-vr1-evidence.md)
[`decision-assessment-snapshot-map010-column-create-vr1-evidence.md`](./decision-assessment-snapshot-map010-column-create-vr1-evidence.md)
[`decision-assessment-snapshot-mapping-complete-determination.md`](./decision-assessment-snapshot-mapping-complete-determination.md)
[`decision-assessment-snapshot-cn1-readonly-observation-evidence.md`](./decision-assessment-snapshot-cn1-readonly-observation-evidence.md)
[`assessment-snapshot-complete-contract.md`](./assessment-snapshot-complete-contract.md)
[`decision-ilb-1-thirtieth-residual-mt1-mapping-table-selection.md`](./decision-ilb-1-thirtieth-residual-mt1-mapping-table-selection.md)

Contract-side precedent（SupportPlan；本表とは別）:
[`sharepoint-contract-mapping.md`](./sharepoint-contract-mapping.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: MT-1 mapping-table docs update
Status: UPDATED under MT-1 + CONVERSION-1 + CV-EXTENSION-1 + MAP010-COLUMN-1
      + MAP-AS-010 VR-1 + mapping-complete PASS / COMPLETE
Human Decision basis: MT-1 + IN-A + CP-1 + XB-1
CN-1 observation: CLOSED / DEFAULT_COLUMNS_ONLY / custom = 0（baseline）
Human Column Create + VR-1（CV-REQ 8）: COMPLETE / PASS
Human Column Create + VR-1（MAP-AS-010）: COMPLETE / PASS
Decision-AS-CONVERSION-1: Accepted / LOCKED / C-1-A+C-2-DERIVED+C-3-A+C-4-A+XB-1
  MAP-AS-001〜008 Read/Write Conversion: ACCEPTED / LOCKED
Decision-AS-CV-EXTENSION-1: Accepted / LOCKED
  / M-1-A + X-1-B + X-2-A + X-3-B + X-4-B + X-5-B + XB-1
  MAP-AS-009: EXPLICITLY OUT / 対象外
  MAP-AS-010: PERSISTED
  ENV-001〜003: DERIVED（versions = readable-set）
  Evidence: decision-assessment-snapshot-cv-extension-acceptance.md
Decision-AS-MAP010-COLUMN-1: Accepted / LOCKED
  / N-1-A + N-2-A + T-1-A + O-1-A + R-1-A + W-1-A + XB-1
  MAP-AS-010 column contract: ACCEPTED / LOCKED
  Physical column: PRESENT
  VR-1 for MAP-AS-010: PASS
  column-ready: YES
  Evidence: decision-assessment-snapshot-map010-column-acceptance.md
          + decision-assessment-snapshot-map010-column-create-vr1-evidence.md
mapping-complete: PASS / COMPLETE（M-1-A）
  Evidence: decision-assessment-snapshot-mapping-complete-determination.md

Persistence placement（OBSERVED；再 Decision しない）:
  Lists: AssessmentSnapshots
  Sites: severe-support-isogo / severe-support-honmoku
  Custom application columns（CV-REQ 8）: 8 / 8 OBSERVED / CONFIRMED
  Custom application columns（MAP-AS-010）: 1 / 1 OBSERVED / CONFIRMED（both sites）
  Observed standard Internal Name（attested）: Title
  App-field Internal Names（CV-REQ + MAP-AS-010）: OBSERVED / CONFIRMED
  Evidence: decision-assessment-snapshot-column-create-vr1-evidence.md
          + decision-assessment-snapshot-map010-column-create-vr1-evidence.md

Implementation Start: HOLD
SharePoint adapter / schema mapping implementation: HOLD
Additional SharePoint column creation: FORBIDDEN without separate GO
Internal Name invention: FORBIDDEN
P2-002 clear/omit transport API: CLOSED
  Authority: Decision-AS-ADAPTER-EC3-EC4-1 / CO-1-A under TC-1-A
Deploy / real data: NO-GO
```

## Purpose

LF-1 / MT-1 に従い、AssessmentSnapshot logical fields と persistence field slot の
対応を明示する。未確認の Internal Name / Display Name / Column Type は推測で埋めず、
`未確認` / `NOT PRESENT` のまま残す。

## Mapping Rules（LOCKED）

1. 正本で確認できない値を推測で埋めない
2. Internal Name 未作成 / 未観測なら仮名を確定値として書かない（MT-1 / IN-A / CN-1）
3. Status: `確定` / `暫定` / `未確認` / `NOT PRESENT` / `対象外`
4. Contract / Domain 名と SP 列名を同一視しない
5. Schema ID は SP List 名 / TS 型名と同一視しない
6. DEFAULT_COLUMNS_ONLY ≠ mapping-complete
7. CV-REQ / MAP-AS-010 names/types may be recorded as OBSERVED / CONFIRMED only after Human create + VR-1
   MAP-AS-001〜008 conversion = ACCEPTED / LOCKED via Decision-AS-CONVERSION-1
   mapping-complete disposition model = M-1-A（CV-EXTENSION-1）:
     each applicable row needs PERSISTED | DERIVED | EXPLICITLY OUT
     physical column for every logical/DTO field is NOT required
   mapping-complete = PASS / COMPLETE（determination recorded）
   正本 Acceptance = Decision-AS-COLUMN-NAMES-1 / CHOICE-OPTIONS-1 / CONVERSION-1
                   / CV-EXTENSION-1 / MAP010-COLUMN-1
   Evidence = decision-assessment-snapshot-column-create-vr1-evidence.md
            + decision-assessment-snapshot-conversion-acceptance.md
            + decision-assessment-snapshot-cv-extension-acceptance.md
            + decision-assessment-snapshot-map010-column-acceptance.md
            + decision-assessment-snapshot-map010-column-create-vr1-evidence.md
            + decision-assessment-snapshot-mapping-complete-determination.md

## Failure Behavior（DEC-6 / adapter；再 Decision しない）

```text
MF-1: 必須欠落・型不正・未知必須列は fail-closed
RW-1: 変換失敗は成功へ倒さない（adapter 内 CV-1）
VR-1: schemaVersion / dtoVersion = 1.0.0 / 1.0.0（または明示 readable set）
EM-1: adapter → FR-1
UP-1: PERSISTENCE_UNAVAILABLE
```

本表の Status=`未確認` / `NOT PRESENT` は、adapter 実装開始を許可しない。
mapping-complete PASS も adapter Implementation Start を許可しない。

## Placement header

| Item | Value | Status |
|---|---|---|
| Logical aggregate | AssessmentSnapshot | 確定（domain） |
| Schema ID（logical） | `severe-behavior-support.assessment-snapshot.snapshot` | 確定（Accepted；ENV disposition = DERIVED；DTO/adapter code HOLD） |
| schemaVersion / dtoVersion（logical） | `1.0.0` / `1.0.0` | 確定（Accepted；ENV disposition = DERIVED / readable-set；code HOLD） |
| mapping-complete disposition model | M-1-A | 確定（CV-EXTENSION-1） |
| mapping-complete | PASS / COMPLETE | 確定（determination；≠ Implementation Start） |
| Target List name | `AssessmentSnapshots` | 確定（OBSERVED / CONFIRMED） |
| Target Sites | `severe-support-isogo` / `severe-support-honmoku` | 確定（OBSERVED / CONFIRMED） |
| Custom application columns（CV-REQ） | 8 | OBSERVED / CONFIRMED（isogo + honmoku） |
| Custom application columns（MAP-AS-010） | 1 | OBSERVED / CONFIRMED（isogo + honmoku） |
| Title（standard） | Internal Name `Title` | 確定（CN-1 attested；app field ではない） |

```text
SC-1:
  本表は logical mapping 正本（repository contract）
  tenant/site/list/internal-name 環境値の deployment config 直書きと同一視しない
```

## Mapping Table（logical → persistence slot）

| Mapping ID | Logical Field | Logical Type | Required | SP List | Display Name | Internal Name | Column Type | Read Conversion | Write Conversion | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| MAP-AS-001 | snapshotId | string | 必須 | AssessmentSnapshots | スナップショットID | snapshotId | 1行テキスト | ACCEPTED / LOCKED（C-1-A） | ACCEPTED / LOCKED（C-1-A） | 確定（name/type OBSERVED / CONFIRMED；conversion ACCEPTED / LOCKED） |
| MAP-AS-002 | recordStatus | enum draft\|finalized | 必須 | AssessmentSnapshots | 記録状態 | recordStatus | 選択肢 | ACCEPTED / LOCKED（C-2-DERIVED） | ACCEPTED / LOCKED（C-2-DERIVED） | 確定（name/type/options OBSERVED / CONFIRMED；conversion ACCEPTED / LOCKED） |
| MAP-AS-003 | result | enum NO_FINDINGS\|FINDINGS_PRESENT\|NOT_APPLICABLE | 必須 | AssessmentSnapshots | 判定結果 | result | 選択肢 | ACCEPTED / LOCKED（C-2-DERIVED） | ACCEPTED / LOCKED（C-2-DERIVED） | 確定（name/type/options OBSERVED / CONFIRMED；conversion ACCEPTED / LOCKED） |
| MAP-AS-004 | reasonCodes | readonly string[] | 条件付必須 | AssessmentSnapshots | 理由コード | reasonCodes | 複数行テキスト | ACCEPTED / LOCKED（C-3-A JSON；duplicates FAIL-CLOSED） | ACCEPTED / LOCKED（C-3-A JSON） | 確定（name/type OBSERVED / CONFIRMED；conversion ACCEPTED / LOCKED） |
| MAP-AS-005 | ruleSetVersion | string | 必須 | AssessmentSnapshots | ルールセットバージョン | ruleSetVersion | 1行テキスト | ACCEPTED / LOCKED（C-1-A） | ACCEPTED / LOCKED（C-1-A） | 確定（name/type OBSERVED / CONFIRMED；conversion ACCEPTED / LOCKED） |
| MAP-AS-006 | periodStart | ISO date | 必須 | AssessmentSnapshots | 対象期間開始日 | periodStart | 日付のみ | ACCEPTED / LOCKED（C-4-A civil-date） | ACCEPTED / LOCKED（C-4-A civil-date） | 確定（name/type OBSERVED / CONFIRMED；conversion ACCEPTED / LOCKED） |
| MAP-AS-007 | periodEnd | ISO date | 必須 | AssessmentSnapshots | 対象期間終了日 | periodEnd | 日付のみ | ACCEPTED / LOCKED（C-4-A civil-date） | ACCEPTED / LOCKED（C-4-A civil-date） | 確定（name/type OBSERVED / CONFIRMED；conversion ACCEPTED / LOCKED） |
| MAP-AS-008 | inputFingerprint | string | 必須 | AssessmentSnapshots | 入力フィンガープリント | inputFingerprint | 1行テキスト | ACCEPTED / LOCKED（C-1-A） | ACCEPTED / LOCKED（C-1-A） | 確定（name/type OBSERVED / CONFIRMED；conversion ACCEPTED / LOCKED） |
| MAP-AS-009 | findingIds | readonly string[]? | 任意 | AssessmentSnapshots | 対象外 | 対象外 | 対象外 | 対象外（v1 EXPLICITLY OUT） | 対象外 | 対象外（X-1-B ACCEPTED / LOCKED；OPTIONAL / NOT REQUIRED） |
| MAP-AS-010 | supersedesSnapshotId | string? | 任意 | AssessmentSnapshots | 訂正元スナップショットID | supersedesSnapshotId | 1行テキスト | ACCEPTED / LOCKED（R-1-A） | ACCEPTED / LOCKED（W-1-A） | 確定（PERSISTED；name/type OBSERVED / CONFIRMED；column-ready YES；conversion ACCEPTED / LOCKED） |
| MAP-AS-ENV-001 | schemaId（DTO envelope） | string | DTO必須予定 | AssessmentSnapshots | 対象外（no per-item column） | 対象外（DERIVED） | 対象外 | DERIVED（DTO/adapter constant） | DERIVED（DTO/adapter constant） | DERIVED（X-3-B ACCEPTED / LOCKED） |
| MAP-AS-ENV-002 | schemaVersion（DTO envelope） | `1.0.0` | DTO必須予定 | AssessmentSnapshots | 対象外（no per-item column） | 対象外（DERIVED / readable-set） | 対象外 | DERIVED / readable-set（1.0.0） | DERIVED / readable-set（1.0.0） | DERIVED（X-4-B ACCEPTED / LOCKED） |
| MAP-AS-ENV-003 | dtoVersion（DTO envelope） | `1.0.0` | DTO必須予定 | AssessmentSnapshots | 対象外（no per-item column） | 対象外（DERIVED / readable-set） | 対象外 | DERIVED / readable-set（1.0.0） | DERIVED / readable-set（1.0.0） | DERIVED（X-5-B ACCEPTED / LOCKED） |
| MAP-AS-SYS-001 | Title（SharePoint standard） | string | SP default | AssessmentSnapshots | タイトル | Title | 未確認 | 対象外（app field ではない） | 対象外 | 確定（observed；app mapping 外） |

```text
reasonCodes（MAP-AS-004）:
  Representation = JSON（COLUMN-NAMES-1）
  Read/Write Conversion = ACCEPTED / LOCKED（Decision-AS-CONVERSION-1 / C-3-A）
  duplicates = FAIL-CLOSED

findingIds（MAP-AS-009）:
  v1 = EXPLICITLY OUT / 対象外（Decision-AS-CV-EXTENSION-1 / X-1-B）
  OPTIONAL / NOT REQUIRED preserved（Entry #5）
  persistence representation / codec NOT invented

supersedesSnapshotId（MAP-AS-010）:
  disposition = PERSISTED（X-2-A ACCEPTED / LOCKED）
  column contract = ACCEPTED / LOCKED（Decision-AS-MAP010-COLUMN-1）
  Internal Name = supersedesSnapshotId（N-1-A；OBSERVED / CONFIRMED）
  Display Name = 訂正元スナップショットID（N-2-A；OBSERVED / CONFIRMED）
  Column Type = 1行テキスト（T-1-A；OBSERVED / CONFIRMED）
  Requiredness = OPTIONAL / Required=False（not escalated）
  Optional semantics = O-1-A ACCEPTED / LOCKED
  Read Conversion = R-1-A ACCEPTED / LOCKED
  Write Conversion = W-1-A ACCEPTED / LOCKED
  Physical column = PRESENT（isogo + honmoku）
  VR-1 for MAP-AS-010 = PASS
  column-ready = YES
  clear/omit transport API = P2-002 CLOSED
    （Decision-AS-ADAPTER-EC3-EC4-1 / CO-1-A；host TC-1-A）
  Evidence = decision-assessment-snapshot-map010-column-create-vr1-evidence.md

ENV-001〜003:
  disposition = DERIVED（X-3-B / X-4-B / X-5-B）
  schemaVersion / dtoVersion = explicit readable-set 1.0.0 / 1.0.0
  per-item SharePoint columns NOT REQUIRED
  DTO / adapter code assignment still HOLD

MAP-AS-SYS-001:
  CN-1 で観測された標準列の記録のみ
  AssessmentSnapshot logical fields の代替ではない
```

## mapping-complete status

```text
mapping-complete: PASS / COMPLETE（M-1-A）

Disposition completeness:
  MAP-AS-001〜008 = PERSISTED / OBSERVED / CONFIRMED + conversion ACCEPTED / LOCKED
  MAP-AS-009 = EXPLICITLY OUT
  MAP-AS-010 = PERSISTED / PRESENT / OBSERVED / CONFIRMED / column-ready YES
  ENV-001〜003 = DERIVED

Evidence:
  decision-assessment-snapshot-mapping-complete-determination.md

MUST NOT claim from mapping-complete PASS alone:
  Implementation Start
  adapter / schema / DTO wiring start
  Deploy / real data GO

P2-002 living: CLOSED by Decision-AS-ADAPTER-EC3-EC4-1（not by mapping-complete）
```

## Next

```text
MT-1 mapping-table docs update: delivered
Decision-AS-COLUMN-NAMES-1: Accepted / LOCKED / NM-1+CV-REQ+XB-1
Decision-AS-CONVERSION-1: Accepted / LOCKED / C-1-A+C-2-DERIVED+C-3-A+C-4-A+XB-1
Decision-AS-CV-EXTENSION-1: Accepted / LOCKED
  / M-1-A + X-1-B + X-2-A + X-3-B + X-4-B + X-5-B + XB-1
Decision-AS-MAP010-COLUMN-1: Accepted / LOCKED
  / N-1-A + N-2-A + T-1-A + O-1-A + R-1-A + W-1-A + XB-1
AssessmentSnapshots Human Column Create（CV-REQ 8）: COMPLETE
VR-1（CV-REQ 8）: PASS
MAP-AS-010 Human Column Create: COMPLETE
VR-1（MAP-AS-010）: PASS
MAP-AS-001〜008 conversion: ACCEPTED / LOCKED
MAP-AS-009: EXPLICITLY OUT
ENV-001〜003: DERIVED
MAP-AS-010: PERSISTED / PRESENT / OBSERVED / CONFIRMED / column-ready YES
mapping-complete: PASS / COMPLETE
P2-002: CLOSED（Decision-AS-ADAPTER-EC3-EC4-1 / CO-1-A）
EC-1..EC-8: MET（AIS-1-B）
Implementation Start: HOLD
Next gate: HUMAN IMPLEMENTATION START GO
  Gate: decision-assessment-snapshot-adapter-impl-start-gate.md
Still HOLD:
  Implementation Start / adapter impl / Deploy
```
