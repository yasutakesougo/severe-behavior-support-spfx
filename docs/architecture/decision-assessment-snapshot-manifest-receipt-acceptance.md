# Decision-AS-MANIFEST-RECEIPT-1 — manifest / repository read receipt Human Acceptance

この文書は、**Decision-AS-MANIFEST-RECEIPT-1**
（`MANIFEST_RECEIPT_CONTRACT`）についての **Human Acceptance 正本（LOCKED）** である。

本 Decision は、AssessmentSnapshot の評価 provenance と repository read provenance の
論理責務、結合、replay qualification を固定する。具体 Schema、port、保存原子性、
SharePoint 実装、migration、backfill は開始しない。

Depends on（再 Decision しない）:

- [`assessment-snapshot-complete-contract.md`](./assessment-snapshot-complete-contract.md)
- [`decision-dec-009-snapshot-save-timing-acceptance.md`](./decision-dec-009-snapshot-save-timing-acceptance.md)
- [`decision-assessment-snapshot-application-save-acceptance.md`](./decision-assessment-snapshot-application-save-acceptance.md)
- [`decision-assessment-snapshot-sp-adapter-acceptance.md`](./decision-assessment-snapshot-sp-adapter-acceptance.md)
- [`decision-assessment-snapshot-dec6-mapping-acceptance.md`](./decision-assessment-snapshot-dec6-mapping-acceptance.md)
- [`decision-assessment-snapshot-sp-placement-acceptance.md`](./decision-assessment-snapshot-sp-placement-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-MANIFEST-RECEIPT-1
Contract ID: MANIFEST_RECEIPT_CONTRACT
Status: Accepted / LOCKED
Human Decision: A
Accepted contract: RESP-1 + BIND-1 + REPLAY-1 + QUAL-1
Human Decision evidence: explicit Human Decision in the authorized task
Decision maker / decision date / rationale: NOT RECORDED（推測で補完しない）

Independent Re-review: PASS
Reviewed remote main: 52474cb5993b0d4b24fbdaeccf934a5e96d3d1b1
Review Findings: P0=0 / P1=0 / P2=1
  F-001 / F-002 / F-003: CLOSED
  F-004: current-main status clarification required before write

Decision Record write baseline: 78748790a442578ed138933dcc69cad05ed11bb3
F-004 write-time resolution:
  Decision-AS-DEC6-MAPPING-1 = UNCHANGED / LOCKED
  Decision-AS-SP-PLACEMENT-1 = UNCHANGED / LOCKED
  Site / List / Internal Column Name values = NOT CONFIRMED / HOLD
  TypeScript / DTO code assignment = HOLD / DO NOT START

Implementation Start: HOLD
Repository implementation: DO NOT START
SharePoint / tenant / M365 changes: NO-GO
Deploy / real data: NO-GO
```

## Human Acceptance（固定結論）

```text
Human Decision: A
Decision-AS-MANIFEST-RECEIPT-1: Accepted / LOCKED

RESP-1   = SPLIT_AUTHORITIES
BIND-1   = INDEPENDENT_READ_PLAN_CLOSURE
REPLAY-1 = PINNED_COMPLETE_READ_SET
QUAL-1   = REPLAY_QUALIFICATION_WITHOUT_SAVE_RECLASSIFICATION
```

## RESP-1 — SPLIT_AUTHORITIES

```text
finalized AssessmentSnapshot:
  保存済み判定結果の正本

immutable input manifest:
  評価で実際に使用した入力の正本

versioned evaluation read plan:
  必須 source class、repository/query unit、適用条件を定める
  receipt closure basis の正本

repository read receipt:
  original read 境界と query unit ごとの完全取得集合の正本

AuditEvent / EvidenceReference:
  manifest、read plan、receipt の代替にしない

MUST NOT:
  application が選択済み record から receipt を事後生成する
```

## BIND-1 — INDEPENDENT_READ_PLAN_CLOSURE

```text
Closure basis:
  評価開始時に version 固定された evaluation read plan を使用する
  read plan は評価処理と manifest から独立して定義・管理する
  manifest が read plan、必須 query unit、適用条件を自己定義しない

Applicability:
  query unit の適用条件は、固定された original boundary / evaluation context
  から決定論的に評価する
  manifest の内容によって適用条件を変更しない

Binding:
  manifest は read plan identity / version を参照する
  manifest と receipt は同一 read plan identity / version に結合する
  applicable query unit ごとに receipt が exactly 1 存在する
  non-applicable query unit に receipt が存在してはならない
  欠落、余剰、重複、未知 query unit、別 read-plan receipt は fail-closed
  manifest の全 source identity / version は receipt 取得集合に含まれる
```

### Cardinality

```text
all finalized AssessmentSnapshot
  1 : 0..1
immutable input manifest

replay-qualified finalized AssessmentSnapshot
  1 : exactly 1
immutable input manifest

immutable input manifest
  1 : exact receipt set required by applicable query units
      of the pinned evaluation read plan

repository read receipt
  1 : 1 logical query unit under the same pinned read plan version
```

receipt の物理 aggregate 表現は本 Decision では固定しない。
論理 query unit ごとの exactly-one を検証可能であることを要求する。

## REPLAY-1 — PINNED_COMPLETE_READ_SET

```text
receipt:
  選択済み source だけでなく、対応 query unit で repository が返した
  完全取得集合を証明する

manifest:
  validation / series resolution 後に実際に使用した
  source identity / version を固定する

formal replay:
  exact source version
  evaluationAsOf
  ruleSetVersion
  read plan identity / version
  original boundary context
  を固定して再評価する

MUST NOT fallback:
  最新版
  旧版
  現在時刻
  別 read plan
  別 receipt
  空集合

Fail-closed:
  receipt closure 未確認
  query 未完了
  source 欠落 / 重複
  boundary 不一致
  strict validation 失敗
  識別不能 record の黙示除外
```

`inputFingerprint` は Snapshot と manifest の相関確認に限定する。
canonicalization / algorithm / 改ざん防止方式が別途固定されるまで、
fingerprint 単独で内容完全性または真正性を証明したとは扱わない。

## Boundary context

```text
Original provenance comparison:
  receipt の Organization / Site / User 境界
  = source record の authoritative 境界
  = original repository read 時の authenticated context

Replay execution:
  replay 実行者の現在 context は、現在の replay 操作と source 取得の
  認可確認に使用する
  現在 context を original read 境界の証明または代用にしない
  current authorization 成功を original boundary 一致の証明にしない
```

## QUAL-1 — REPLAY_QUALIFICATION_WITHOUT_SAVE_RECLASSIFICATION

```text
replay-qualified:
  finalized Snapshot に manifest が exactly 1 結合されている
  manifest が pinned read plan identity / version を参照している
  applicable query unit と receipt 集合が完全一致する
  Snapshot / manifest / receipt / read plan 間の照合が成功する

not replay-qualified:
  manifest、read plan、または receipt が欠落する
  receipt 集合に余剰、重複、未知 query unit、別 plan 混入がある
  完全性または original boundary を確認できない

Qualification failure:
  replay は fail-closed
  保存済み Snapshot / manifest / receipt を削除または上書きしない
  保存済み Snapshot を INVALID へ再分類しない
  legacy Snapshot を自動 backfill しない
```

訂正 Snapshot は元 Snapshot のmanifest / receipt結合を継承しない。
訂正ごとに新しいmanifestと、pinned read planが要求するreceipt集合を持つ。

## Accepted済み前提（再 Decision しない）

```text
AssessmentSnapshot strict allowlist: UNCHANGED
DEC-009 save / correction semantics: UNCHANGED / LOCKED
Decision-AS-APP-SAVE-1: UNCHANGED / LOCKED
Decision-AS-SP-ADAPTER-1: UNCHANGED / LOCKED
Decision-AS-DEC6-MAPPING-1: UNCHANGED / LOCKED
  LF-1 + RW-1 + MF-1 + VR-1
Decision-AS-SP-PLACEMENT-1: UNCHANGED / LOCKED
  SV-1 + LV-1 + CN-1 + SC-1

Site / List / Internal Column Name values:
  NOT CONFIRMED / HOLD
TypeScript / DTO code assignment:
  HOLD / DO NOT START
```

manifest / receipt を既存 AssessmentSnapshot 本体またはAccepted済み
persistence port入力へ暗黙に追加しない。具体的なport分割は別Decisionとする。

## 未決・対象外

```text
read plan / manifest / receipt の具体型・フィールド名・Schema
query unit の物理表現
単一 / 複数 receipt aggregate
pagination / completion token
fingerprint canonicalization / algorithm
read plan / receipt の改ざん防止方式
read plan の承認・配布・廃止手続
保存順序・transaction・部分成功回復
repository / manifest / receipt port
DTO code assignment / concrete adapter implementation
validation result / error code
migration / backfill
fixture / test
Site / List / Internal Column Name の具体値
SharePoint / tenant / M365 change
Deploy / real data
Implementation Start
```

## Findings closure

```text
Independent Re-review: PASS

F-001: CLOSED
  independent versioned read plan が期待 receipt 集合を manifest 外で決定する

F-002: CLOSED
  all finalized = manifest 0..1
  replay-qualified = manifest exactly 1

F-003: CLOSED
  original read context と current replay authorization context を分離する

F-004: CLOSED AT WRITE BASELINE
  Decision-AS-DEC6-MAPPING-1 Accepted / LOCKED を反映
  Decision-AS-SP-PLACEMENT-1 Accepted / LOCKED を反映
  concrete values / code assignment / implementation は HOLD 維持

P0=0 / P1=0 / P2=0
```

## Acceptance boundary

```text
This Acceptance closes only:
  RESP-1 + BIND-1 + REPLAY-1 + QUAL-1 logical contract

MUST NOT derive:
  Accepted = Implementation Start
  Accepted = TypeScript / port / adapter / test start
  Accepted = Schema / DTO code assignment
  Accepted = Site / List / Internal Name concrete values
  Accepted = SharePoint / tenant / M365 change
  Accepted = migration / backfill
  Accepted = Deploy / real data
```

## Next

```text
Decision-AS-MANIFEST-RECEIPT-1: Accepted / LOCKED
Implementation Start: HOLD
Concrete implementation decisions: NOT STARTED
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。
