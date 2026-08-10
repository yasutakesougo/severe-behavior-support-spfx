# Decision-AS-COLUMN-EG-1 — Human Column Create + VR-1 evidence return

この文書は、Decision-AS-COLUMN-EG-1（EG-1 + XB-1 + AP-1）Accepted / LOCKED 後に、
Human が PnP PowerShell で作成し、read-back した **AssessmentSnapshots custom column**
の一次 evidence 記録である。

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-column-eg-acceptance.md`](./decision-assessment-snapshot-column-eg-acceptance.md)
[`decision-assessment-snapshot-column-px-acceptance.md`](./decision-assessment-snapshot-column-px-acceptance.md)
[`decision-assessment-snapshot-column-names-acceptance.md`](./decision-assessment-snapshot-column-names-acceptance.md)
[`decision-assessment-snapshot-choice-options-acceptance.md`](./decision-assessment-snapshot-choice-options-acceptance.md)
[`decision-assessment-snapshot-column-provision-acceptance.md`](./decision-assessment-snapshot-column-provision-acceptance.md)
[`decision-assessment-snapshot-pilot-provision-vr1-evidence.md`](./decision-assessment-snapshot-pilot-provision-vr1-evidence.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Primary-evidence observation record（Human Column Create + VR-1）
Status: OBSERVED / CONFIRMED（AssessmentSnapshots CV-REQ 8 / 8；isogo + honmoku）
Decision basis:
  Decision-AS-COLUMN-EG-1 = Accepted / LOCKED / EG-1+XB-1+AP-1
  Decision-AS-COLUMN-PX-1 = Accepted / LOCKED / PX-1+XB-1+AP-1
  Decision-AS-COLUMN-NAMES-1 = Accepted / LOCKED / NM-1+CV-REQ+XB-1
  Decision-AS-CHOICE-OPTIONS-1 = Accepted / LOCKED / CO-1+CV-CHOICE-BOTH+XB-1
  Decision-AS-COLUMN-PROVISION-1 = Accepted / LOCKED / SC-AS+VR-1+FG-1（PX/EG advanced）

Observation date: 2026-08-10
Method: Human PnP PowerShell create + Human read-back（primary evidence）
Mutation by Agent: NONE
SharePoint mutation by Agent: 0
Agent environment credentials: NONE（NO_SP_ENV）
Deploy: 0

AssessmentSnapshots Human Column Create: COMPLETE
Isogo: OBSERVED / CONFIRMED
Honmoku: OBSERVED / CONFIRMED
VR-1: PASS
Intent = Observed
Mismatch = 0
Column count: 8 / 8（both sites）

MAP-AS-009 / 010 / ENV: OUT OF SCOPE（not created；not required by this unit）
SupportPlans columns: OUT OF SCOPE（SC-AS）
Implementation Start: HOLD
SharePoint adapter / schema mapping implementation: HOLD
Deploy / real data: NO-GO
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```

**本記録は AssessmentSnapshots（isogo / honmoku）の Accepted CV-REQ 8 列についての
Human create 完了と VR-1 Intent=Observed の一次 evidence である。**
Agent による SharePoint mutation は行っていない。新 Decision の Acceptance ではない。

## 1. Verification summary

| Metric | Value | Status |
|---|---|---|
| Intent = Observed | YES | **PASS** |
| Mismatch | 0 | **PASS** |
| Sites covered | isogo + honmoku = 2 / 2 | **PASS** |
| List | AssessmentSnapshots | **PASS** |
| Column count | 8 / 8（both sites） | **PASS** |
| Internal Name | match | **PASS** |
| Display Name | match | **PASS** |
| Column Type | match | **PASS** |
| periodStart DateOnly | YES | **PASS** |
| periodEnd DateOnly | YES | **PASS** |
| Choice stored/display mappings | match | **PASS** |
| VR-1 | PASS | **PASS** |
| Agent SharePoint mutation | 0 | **PASS** |
| Deploy | 0 | **PASS** |

```text
Fail-closed（FG-1）: not triggered
Alternate names / overwrite / blind retry: NONE
Agent column create: NONE
```

## 2. Intended vs Observed（columns）

Scope Lists: `AssessmentSnapshots` on `severe-support-isogo` / `severe-support-honmoku`

Accepted INTENDED 正本（verbatim；再 Decision しない）:
[`decision-assessment-snapshot-column-names-acceptance.md`](./decision-assessment-snapshot-column-names-acceptance.md)

| Mapping ID | Internal Name | Display Name | Intended Type | Observed Type | Match | Status |
|---|---|---|---|---|---|---|
| MAP-AS-001 | snapshotId | スナップショットID | 1行テキスト | Text | YES | OBSERVED / CONFIRMED |
| MAP-AS-002 | recordStatus | 記録状態 | 選択肢 | Choice | YES | OBSERVED / CONFIRMED |
| MAP-AS-003 | result | 判定結果 | 選択肢 | Choice | YES | OBSERVED / CONFIRMED |
| MAP-AS-004 | reasonCodes | 理由コード | 複数行テキスト | Note | YES | OBSERVED / CONFIRMED |
| MAP-AS-005 | ruleSetVersion | ルールセットバージョン | 1行テキスト | Text | YES | OBSERVED / CONFIRMED |
| MAP-AS-006 | periodStart | 対象期間開始日 | 日付のみ | DateTime / DateOnly | YES | OBSERVED / CONFIRMED |
| MAP-AS-007 | periodEnd | 対象期間終了日 | 日付のみ | DateTime / DateOnly | YES | OBSERVED / CONFIRMED |
| MAP-AS-008 | inputFingerprint | 入力フィンガープリント | 1行テキスト | Text | YES | OBSERVED / CONFIRMED |

```text
Both sites:
  severe-support-isogo / AssessmentSnapshots = 8 / 8 OBSERVED / CONFIRMED
  severe-support-honmoku / AssessmentSnapshots = 8 / 8 OBSERVED / CONFIRMED
INTENDED → OBSERVED / CONFIRMED
```

## 3. Choice mappings（Intent = Observed）

Accepted INTENDED 正本（verbatim；再 Decision しない）:
[`decision-assessment-snapshot-choice-options-acceptance.md`](./decision-assessment-snapshot-choice-options-acceptance.md)

### recordStatus

| Stored value | Display label | Match | Status |
|---|---|---|---|
| draft | 下書き | YES | OBSERVED / CONFIRMED |
| finalized | 確定 | YES | OBSERVED / CONFIRMED |

### result

| Stored value | Display label | Match | Status |
|---|---|---|---|
| NO_FINDINGS | 該当なし | YES | OBSERVED / CONFIRMED |
| FINDINGS_PRESENT | 該当あり | YES | OBSERVED / CONFIRMED |
| NOT_APPLICABLE | 適用外 | YES | OBSERVED / CONFIRMED |

## 4. Explicitly NOT confirmed / NOT closed by this evidence

```text
NOT closed by Human Column Create + VR-1 PASS:
  MAP-AS-009 findingIds
  MAP-AS-010 supersedesSnapshotId
  MAP-AS-ENV-001〜003 DTO envelope
  Read / Write conversion completeness
  mapping-complete claim
  SupportPlans column provisioning
  Implementation Start
  SharePoint adapter / schema mapping code start
  Deploy / real data
  FindingCode / A-5
  Agent tenant mutation permission
  new Decision Acceptance
```

## 5. Recording boundary

```text
This evidence record:
  records Human create COMPLETE for AssessmentSnapshots CV-REQ 8 columns
  records VR-1 PASS with Intent = Observed / Mismatch = 0
  sets Isogo / Honmoku = OBSERVED / CONFIRMED
  preserves Accepted Internal Names / Display Names / types / Choice mappings exactly
  does NOT invent additional required columns
  does NOT Accept a new Decision
  does NOT authorize Implementation Start
  does NOT authorize adapter / schema mapping implementation
  does NOT authorize Deploy / real data write
  does NOT authorize Agent SharePoint mutation（AP-1 remains）
```

## 6. Explicit non-authorization

```text
VR-1 PASS / Human Column Create COMPLETE does NOT authorize:
  SharePoint adapter implementation start
  schema-mapping TypeScript / application code start
  treating mapping-complete as true
  MAP-AS-009/010 / ENV column creation
  SupportPlans column creation
  Deploy / real data
  FindingCode / A-5
  Agent SharePoint / M365 / Entra mutation
  Ready / Merge without separate Human authorization
```

## 7. Next

```text
AssessmentSnapshots Human Column Create: COMPLETE
VR-1: PASS
Isogo: OBSERVED / CONFIRMED
Honmoku: OBSERVED / CONFIRMED
SharePoint mutation by Agent: 0
Deploy: 0
INTENDED → OBSERVED / CONFIRMED（CV-REQ 8 + Choice options）

Next gate detail:
  decision-assessment-snapshot-column-provision-next-gate.md

Next substantive residual: NOT SELECTED by this closeout
Active parallel process residual（already SELECTED）:
  Thirty-sixth — Issue Status Reconciliation Phase ②（#6 / #8 body resync）
Column-path candidates（separate units；NOT auto-started）:
  CV extension（MAP-AS-009/010 / ENV）
  conversion / mapping-complete determination（docs residual；≠ impl start）

Implementation Start: HOLD
SharePoint adapter / schema mapping implementation: HOLD
Deploy / real data: NO-GO
```
