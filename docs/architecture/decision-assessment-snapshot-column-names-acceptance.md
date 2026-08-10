# Decision-AS-COLUMN-NAMES-1 — Human Acceptance

この文書は、**Decision-AS-COLUMN-NAMES-1**（AssessmentSnapshots 向け
intended Display Name / Internal Name / Column Type）についての
**Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-column-names-packet.md`](./decision-assessment-snapshot-column-names-packet.md)

Selected via:
[`decision-ilb-1-thirty-second-residual-column-names-selection.md`](./decision-ilb-1-thirty-second-residual-column-names-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-column-provision-acceptance.md`](./decision-assessment-snapshot-column-provision-acceptance.md)
（NM-HOLD + SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + XB-1 + AP-1；
 naming 軸のみ本 Acceptance で NM-1 へ進める。PX-HOLD / EG-HOLD 等は維持）
[`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)
[`decision-assessment-snapshot-cn1-closure-determination.md`](./decision-assessment-snapshot-cn1-closure-determination.md)
[`decision-assessment-snapshot-sp-placement-acceptance.md`](./decision-assessment-snapshot-sp-placement-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-COLUMN-NAMES-1
Status: Accepted / LOCKED
Human Decision: NM-1 + CV-REQ + XB-1
Human Acceptance: Explicit Human Decision on 2026-08-10

LOCKED:

Intended column naming:
  NM-1 — Human-provided intended Display Name / Internal Name / Column Type
         状態 = HUMAN-PROVIDED / INTENDED
         ≠ OBSERVED / CONFIRMED
         Agent 発明・自動採択ではない（Human 明示値）

Coverage:
  CV-REQ — MAP-AS-001〜008（必須 logical fields）のみ
           MAP-AS-009/010 / ENV-001〜003 = OUT OF THIS Acceptance

Implementation / adapter / Deploy boundary:
  XB-1 — 本 Decision ≠ column creation GO
         ≠ Execution GO
         ≠ Implementation Start
         ≠ adapter / schema mapping code start
         ≠ Deploy / real data

COLUMN-PROVISION-1 axes that REMAIN（再 Decision しない）:
  SC-AS — AssessmentSnapshots（isogo + honmoku）only
  PX-HOLD — column creation still not authorized
  EG-HOLD — Explicit Execution GO still NOT GIVEN
  VR-1 — post-create CN-1 re-observation required before CONFIRMED
  FG-1 — fail-closed
  AP-1 — Agent SharePoint mutation FORBIDDEN

SCHEMA-MAPPING-NEXT / DEC-6 / CN-1 / Site-List provision:
  UNCHANGED / LOCKED（再 Decision しない）

Implementation Start:
  HOLD
SharePoint adapter / schema mapping implementation:
  HOLD
SharePoint column creation:
  FORBIDDEN（PX-HOLD + EG-HOLD）
Execution GO:
  NOT GIVEN
Intended Internal Names（CV-REQ）:
  ADOPTED / INTENDED（see table）
CONFIRMED Internal Names:
  NOT YET（await create + VR-1 CN-1 re-observation）
Deploy / real data:
  NO-GO
FindingCode / A-5:
  HOLD
Post-retention deletion:
  OPEN / AUTO-START FORBIDDEN

Closes only:
  Decision-AS-COLUMN-NAMES-1（NM-1 + CV-REQ + XB-1）
  Thirty-second residual
Does NOT close:
  column creation Execution
  PX-1 / EG-1
  Choice option value lock（recordStatus / result）
  MAP-AS-009/010 / ENV naming
  SupportPlans column naming
  CONFIRMED Internal Names
  SharePoint / adapter / application 実装
  Implementation Start
  Deploy / real data
Implementation auto-start: FORBIDDEN
Column creation auto-start: FORBIDDEN
Agent tenant mutation: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: NM-1 + CV-REQ + XB-1
Decision-AS-COLUMN-NAMES-1: Accepted / LOCKED
```

日本語正本:

```text
NM-1:
  Human が intended Display Name / Internal Name / Column Type を明示採択した。
  状態 = HUMAN-PROVIDED / INTENDED。≠ OBSERVED / CONFIRMED。
CV-REQ:
  必須 logical fields（MAP-AS-001〜008）のみ。任意・DTO envelope は対象外。
XB-1:
  本 Acceptance だけでは column creation / Execution GO /
  Implementation / adapter / Deploy を開始しない。
```

### Accepted intended values（CV-REQ；verbatim）

Scope Lists: `AssessmentSnapshots` on `severe-support-isogo` / `severe-support-honmoku`

| Mapping ID | Logical Field | Display Name | Internal Name | Column Type | Representation | Status |
|---|---|---|---|---|---|---|
| MAP-AS-001 | snapshotId | スナップショットID | snapshotId | 1行テキスト | — | HUMAN-PROVIDED / INTENDED |
| MAP-AS-002 | recordStatus | 記録状態 | recordStatus | 選択肢 | — | HUMAN-PROVIDED / INTENDED |
| MAP-AS-003 | result | 判定結果 | result | 選択肢 | — | HUMAN-PROVIDED / INTENDED |
| MAP-AS-004 | reasonCodes | 理由コード | reasonCodes | 複数行テキスト | JSON | HUMAN-PROVIDED / INTENDED |
| MAP-AS-005 | ruleSetVersion | ルールセットバージョン | ruleSetVersion | 1行テキスト | — | HUMAN-PROVIDED / INTENDED |
| MAP-AS-006 | periodStart | 対象期間開始日 | periodStart | 日付のみ | — | HUMAN-PROVIDED / INTENDED |
| MAP-AS-007 | periodEnd | 対象期間終了日 | periodEnd | 日付のみ | — | HUMAN-PROVIDED / INTENDED |
| MAP-AS-008 | inputFingerprint | 入力フィンガープリント | inputFingerprint | 1行テキスト | — | HUMAN-PROVIDED / INTENDED |

```text
OUT OF THIS Acceptance:
  MAP-AS-009 findingIds
  MAP-AS-010 supersedesSnapshotId
  MAP-AS-ENV-001〜003 DTO envelope
  MAP-AS-SYS-001 Title（already OBSERVED / CONFIRMED standard；not app-field target）

NOT locked by this Acceptance:
  Choice option values for recordStatus / result
  （Column Type = 選択肢 only；option labels/values = separate later Human fill if needed）
```

```text
Agent recommendation（同セット）:
  NOT Human Acceptance evidence by itself
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-AS-COLUMN-NAMES-1: Accepted / LOCKED

Intended column naming: NM-1
Coverage:               CV-REQ
Boundary:               XB-1

NOT SELECTED:
  NM-HOLD / NM-2 / NM-X
  CV-ALL / CV-HOLD / CV-X
  XB-2 / XB-X
```

失敗時 MUST NOT（LOCKED）:

```text
INTENDED を OBSERVED / CONFIRMED と同一視する
本 Acceptance を Column Creation Execution GO と同一視する
本 Acceptance を Implementation Start / adapter 実装開始と同一視する
PX-HOLD / EG-HOLD を本 Acceptance で解除したとみなす
Agent が Choice option values を発明して埋める
CV-REQ 外（optional / DTO）を勝手に Accepted 扱いする
Agent による SharePoint / M365 / Entra mutation を許可する
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-COLUMN-NAMES-1 Accepted = column creation GO
  Decision-AS-COLUMN-NAMES-1 Accepted = Execution GO
  Decision-AS-COLUMN-NAMES-1 Accepted = CONFIRMED Internal Names
  Decision-AS-COLUMN-NAMES-1 Accepted = Implementation Start
  Decision-AS-COLUMN-NAMES-1 Accepted = adapter / schema mapping code start
  Decision-AS-COLUMN-NAMES-1 Accepted = Deploy / real data GO
  Decision-AS-COLUMN-NAMES-1 Accepted = Choice option values locked
  Decision-AS-COLUMN-NAMES-1 Accepted = MAP-AS-009/010 / ENV naming Accepted
  Decision-AS-COLUMN-NAMES-1 Accepted = Agent tenant mutation 許可
```

## Acceptance boundary

```text
This Acceptance locks NM-1 + CV-REQ + XB-1 and the CV-REQ intended values table only.

MUST NOT start from this Acceptance alone:
  SharePoint column create / rename / delete
  treating INTENDED as CONFIRMED
  TypeScript / application / persistence port / adapter code
  Implementation Start
  Deploy / real data
  GitHub Issue mutation
```

## Next

```text
Decision-AS-COLUMN-NAMES-1: Accepted / LOCKED / NM-1 + CV-REQ + XB-1
Thirty-second residual: CONSUMED
SharePoint column creation: FORBIDDEN（PX-HOLD + EG-HOLD）
Execution GO: NOT GIVEN
Implementation Start: HOLD
adapter / schema mapping implementation: HOLD
Agent mutation: FORBIDDEN
Deploy / real data: NO-GO
INTENDED ≠ OBSERVED / CONFIRMED

Next substantive residual: NOT SELECTED by this Acceptance
Candidates（separate units）:
  PX-1 / EG-1 column creation authorization + Execution GO
  Choice option values for recordStatus / result
  CV extension（MAP-AS-009/010 / ENV）
  Issue Status Reconciliation（#6 / #8 / #22）

Ready: NOT RUN
Merge: NOT RUN
```
