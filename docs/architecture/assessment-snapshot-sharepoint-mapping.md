# AssessmentSnapshot — SharePoint logical ↔ persistence mapping（MT-1）

この文書は、Decision-AS-SCHEMA-MAPPING-NEXT-1 Accepted（**MT-1**）に基づく
AssessmentSnapshot の **logical field → persistence field slot** 明示 mapping 表である。

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-schema-mapping-next-acceptance.md`](./decision-assessment-snapshot-schema-mapping-next-acceptance.md)
（MT-1 + IN-A + CP-1 + XB-1）
[`decision-assessment-snapshot-dec6-mapping-acceptance.md`](./decision-assessment-snapshot-dec6-mapping-acceptance.md)
（LF-1 + RW-1 + MF-1 + VR-1）
[`decision-assessment-snapshot-cn1-readonly-observation-evidence.md`](./decision-assessment-snapshot-cn1-readonly-observation-evidence.md)
[`assessment-snapshot-complete-contract.md`](./assessment-snapshot-complete-contract.md)
[`decision-ilb-1-thirtieth-residual-mt1-mapping-table-selection.md`](./decision-ilb-1-thirtieth-residual-mt1-mapping-table-selection.md)

Contract-side precedent（SupportPlan；本表とは別）:
[`sharepoint-contract-mapping.md`](./sharepoint-contract-mapping.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: MT-1 mapping-table docs update
Status: UPDATED under MT-1 / NOT mapping-complete
Human Decision basis: MT-1 + IN-A + CP-1 + XB-1
CN-1 observation: CLOSED / DEFAULT_COLUMNS_ONLY / custom = 0

Persistence placement（OBSERVED；再 Decision しない）:
  Lists: AssessmentSnapshots
  Sites: severe-support-isogo / severe-support-honmoku
  Custom application columns: NOT PRESENT
  Observed standard Internal Name（attested）: Title only
  App-field Internal Names: NOT PRESENT / 未確認

Implementation Start: HOLD
SharePoint adapter / schema mapping implementation: HOLD
SharePoint column creation: FORBIDDEN
Internal Name invention: FORBIDDEN
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
7. INTENDED Internal Names は本表に CONFIRMED として書かない（IN-A / VR-1）
   CV-REQ INTENDED 正本 = Decision-AS-COLUMN-NAMES-1 Acceptance（≠ CONFIRMED）

## Failure Behavior（DEC-6 / adapter；再 Decision しない）

```text
MF-1: 必須欠落・型不正・未知必須列は fail-closed
RW-1: 変換失敗は成功へ倒さない（adapter 内 CV-1）
VR-1: schemaVersion / dtoVersion = 1.0.0 / 1.0.0（または明示 readable set）
EM-1: adapter → FR-1
UP-1: PERSISTENCE_UNAVAILABLE
```

本表の Status=`未確認` / `NOT PRESENT` は、adapter 実装開始を許可しない。

## Placement header

| Item | Value | Status |
|---|---|---|
| Logical aggregate | AssessmentSnapshot | 確定（domain） |
| Schema ID（logical） | `severe-behavior-support.assessment-snapshot.snapshot` | 確定（Accepted；DTO/SP 割当 HOLD） |
| schemaVersion / dtoVersion（logical） | `1.0.0` / `1.0.0` | 確定（Accepted；DTO/SP 割当 HOLD） |
| Target List name | `AssessmentSnapshots` | 確定（OBSERVED / CONFIRMED） |
| Target Sites | `severe-support-isogo` / `severe-support-honmoku` | 確定（OBSERVED / CONFIRMED） |
| Custom application columns | none | NOT PRESENT |
| Title（standard） | Internal Name `Title` | 確定（CN-1 attested；app field ではない） |

```text
SC-1:
  本表は logical mapping 正本（repository contract）
  tenant/site/list/internal-name 環境値の deployment config 直書きと同一視しない
```

## Mapping Table（logical → persistence slot）

| Mapping ID | Logical Field | Logical Type | Required | SP List | Display Name | Internal Name | Column Type | Read Conversion | Write Conversion | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| MAP-AS-001 | snapshotId | string | 必須 | AssessmentSnapshots | 未確認 | NOT PRESENT | 未確認 | 未確認 | 未確認 | 未確認 |
| MAP-AS-002 | recordStatus | enum draft\|finalized | 必須 | AssessmentSnapshots | 未確認 | NOT PRESENT | 未確認 | 未確認 | 未確認 | 未確認 |
| MAP-AS-003 | result | enum NO_FINDINGS\|FINDINGS_PRESENT\|NOT_APPLICABLE | 必須 | AssessmentSnapshots | 未確認 | NOT PRESENT | 未確認 | 未確認 | 未確認 | 未確認 |
| MAP-AS-004 | reasonCodes | readonly string[] | 条件付必須 | AssessmentSnapshots | 未確認 | NOT PRESENT | 未確認 | 未確認 | 未確認 | 未確認 |
| MAP-AS-005 | ruleSetVersion | string | 必須 | AssessmentSnapshots | 未確認 | NOT PRESENT | 未確認 | 未確認 | 未確認 | 未確認 |
| MAP-AS-006 | periodStart | ISO date | 必須 | AssessmentSnapshots | 未確認 | NOT PRESENT | 未確認 | 未確認 | 未確認 | 未確認 |
| MAP-AS-007 | periodEnd | ISO date | 必須 | AssessmentSnapshots | 未確認 | NOT PRESENT | 未確認 | 未確認 | 未確認 | 未確認 |
| MAP-AS-008 | inputFingerprint | string | 必須 | AssessmentSnapshots | 未確認 | NOT PRESENT | 未確認 | 未確認 | 未確認 | 未確認 |
| MAP-AS-009 | findingIds | readonly string[]? | 任意 | AssessmentSnapshots | 未確認 | NOT PRESENT | 未確認 | 未確認 | 未確認 | 未確認 |
| MAP-AS-010 | supersedesSnapshotId | string? | 任意 | AssessmentSnapshots | 未確認 | NOT PRESENT | 未確認 | 未確認 | 未確認 | 未確認 |
| MAP-AS-ENV-001 | schemaId（DTO envelope） | string | DTO必須予定 | AssessmentSnapshots | 未確認 | NOT PRESENT | 未確認 | 未確認 | 未確認 | 未確認 |
| MAP-AS-ENV-002 | schemaVersion（DTO envelope） | `1.0.0` | DTO必須予定 | AssessmentSnapshots | 未確認 | NOT PRESENT | 未確認 | 未確認 | 未確認 | 未確認 |
| MAP-AS-ENV-003 | dtoVersion（DTO envelope） | `1.0.0` | DTO必須予定 | AssessmentSnapshots | 未確認 | NOT PRESENT | 未確認 | 未確認 | 未確認 | 未確認 |
| MAP-AS-SYS-001 | Title（SharePoint standard） | string | SP default | AssessmentSnapshots | タイトル | Title | 未確認 | 対象外（app field ではない） | 対象外 | 確定（observed；app mapping 外） |

```text
reasonCodes / findingIds:
  配列の物理表現（multi-value / JSON / 複数列）は未確認のまま
  推測で単一方式を CONFIRMED にしない

MAP-AS-SYS-001:
  CN-1 で観測された標準列の記録のみ
  AssessmentSnapshot logical fields の代替ではない
```

## Explicitly NOT complete

```text
NOT mapping-complete:
  app Internal Names still NOT PRESENT
  Display Name / Column Type / conversions still 未確認
  DTO / adapter code still HOLD
  column provisioning still FORBIDDEN without separate GO

MUST NOT claim from this docs update:
  Implementation Start
  adapter / schema mapping code start
  intended Internal Names Accepted
  CONFIRMED app Internal Names
  column creation GO
```

## Next

```text
MT-1 mapping-table docs update: SELECTED → delivered in this artifact
Thirtieth residual: CONSUMED when this table is on the working branch / PR
Next residual: NOT SELECTED
Candidates remain:
  Column provisioning Decision / Execution GO（CP-1）
  Issue Status Reconciliation
Still HOLD:
  Implementation Start / adapter impl / column creation / Deploy
```
