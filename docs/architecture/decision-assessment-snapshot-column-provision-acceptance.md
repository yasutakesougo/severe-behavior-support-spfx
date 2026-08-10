# Decision-AS-COLUMN-PROVISION-1 — Human Acceptance

この文書は、**Decision-AS-COLUMN-PROVISION-1**（pilot AssessmentSnapshots 向け
custom column provisioning / Execution GO 境界）についての
**Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-column-provision-packet.md`](./decision-assessment-snapshot-column-provision-packet.md)

Selected via:
[`decision-ilb-1-thirty-first-residual-column-provision-selection.md`](./decision-ilb-1-thirty-first-residual-column-provision-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-schema-mapping-next-acceptance.md`](./decision-assessment-snapshot-schema-mapping-next-acceptance.md)
（MT-1 + IN-A + CP-1 + XB-1）
[`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)
[`decision-assessment-snapshot-cn1-closure-determination.md`](./decision-assessment-snapshot-cn1-closure-determination.md)
[`decision-assessment-snapshot-pilot-provision-exec-acceptance.md`](./decision-assessment-snapshot-pilot-provision-exec-acceptance.md)
[`decision-assessment-snapshot-sp-placement-acceptance.md`](./decision-assessment-snapshot-sp-placement-acceptance.md)
[`../decisions/DEC-AI-ORG-003.md`](../decisions/DEC-AI-ORG-003.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-COLUMN-PROVISION-1
Status: Accepted / LOCKED
Human Decision: NM-HOLD + SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + XB-1 + AP-1
Human Acceptance: Explicit Human Decision on 2026-08-10

LOCKED:

Intended column naming:
  NM-HOLD — intended Display Name / Internal Name / Column Type をまだ決めない
            列作成 GO も出せない
            Agent による Internal Name 発明禁止

Scope:
  SC-AS — AssessmentSnapshots（isogo + honmoku）のみを本 Decision の対象にする
          SupportPlans は本 Acceptance の対象外

Column creation authorization:
  PX-HOLD — まだ作成を許可しない

Explicit Execution GO:
  EG-HOLD — Column Creation Execution GO をまだ付けない

Post-create verification:
  VR-1 — 将来作成する場合、作成後 Human read-only CN-1 再観測必須
         Intent=Observed の Internal Names のみ CONFIRMED

Failure:
  FG-1 — fail-closed（代替名発明・既存列上書き・blind retry 禁止）

Implementation / adapter / Deploy boundary:
  XB-1 — 本 Decision ≠ Implementation Start
         ≠ adapter / schema mapping code start
         ≠ Deploy / real data
         （Execution GO が将来付いても同様）

AI / Agent mutation boundary:
  AP-1 — SharePoint column mutation は本 AI foundation 手順では禁止
         実作成は別 Human process

SCHEMA-MAPPING-NEXT / DEC-6 / CN-1 / Site-List provision:
  UNCHANGED / LOCKED（再 Decision しない）

Implementation Start:
  HOLD
SharePoint adapter / schema mapping implementation:
  HOLD
SharePoint column creation:
  FORBIDDEN（NM-HOLD + PX-HOLD + EG-HOLD）
Intended Internal Names:
  NOT ADOPTED / HOLD
Deploy / real data:
  NO-GO
FindingCode / A-5:
  HOLD
Post-retention deletion:
  OPEN / AUTO-START FORBIDDEN

Closes only:
  Decision-AS-COLUMN-PROVISION-1 境界（NM/SC/PX/EG/VR/FG/XB/AP）
Does NOT close:
  concrete Internal Names（INTENDED or CONFIRMED）
  column creation Execution
  SupportPlans column provisioning
  SharePoint / adapter / application 実装
  Implementation Start
  Deploy / real data
Implementation auto-start: FORBIDDEN
Column creation auto-start: FORBIDDEN
Internal Name invention: FORBIDDEN
Agent tenant mutation: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: NM-HOLD + SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + XB-1 + AP-1
Decision-AS-COLUMN-PROVISION-1: Accepted / LOCKED

Intended column naming:      NM-HOLD
Scope:                       SC-AS
Column creation authorization: PX-HOLD
Explicit Execution GO:       EG-HOLD
Post-create verification:    VR-1
Failure:                     FG-1
Implementation boundary:     XB-1
AI / Agent mutation:         AP-1
```

日本語正本:

```text
NM-HOLD:
  intended 列名はまだ決めない。Agent は発明しない。
  naming 未定のまま列作成 GO は出さない。
SC-AS:
  本 Decision の対象は AssessmentSnapshots（isogo + honmoku）のみ。
PX-HOLD:
  custom column 作成はまだ許可しない。
EG-HOLD:
  Explicit Column Creation Execution GO はまだ付けない。
VR-1:
  将来作成するなら、作成後 Human read-only CN-1 再観測でだけ CONFIRMED にする。
FG-1:
  失敗時は fail-closed。代替名発明・上書き・blind retry 禁止。
XB-1:
  本 Decision だけでは Implementation / adapter / Deploy を開始しない。
AP-1:
  Agent による SharePoint column mutation は禁止。実作成は別 Human process。
```

```text
Agent recommendation（同セット）:
  NOT Human Acceptance evidence by itself
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-AS-COLUMN-PROVISION-1: Accepted / LOCKED

Intended column naming:        NM-HOLD
Scope:                         SC-AS
Column creation authorization: PX-HOLD
Explicit Execution GO:         EG-HOLD
Post-create verification:      VR-1
Failure:                       FG-1
Implementation boundary:       XB-1
AI / Agent mutation:           AP-1

NOT SELECTED:
  NM-1 / NM-2 / NM-X
  SC-BOTH / SC-HOLD / SC-X
  PX-1 / PX-X
  EG-1 / EG-2 / EG-X
  VR-HOLD / VR-X
  FG-HOLD / FG-X
  XB-2 / XB-X
  AP-2 / AP-X
```

失敗時 MUST NOT（LOCKED）:

```text
intended Internal Names を Agent が発明して埋める
NM-HOLD / PX-HOLD / EG-HOLD のまま列作成を開始する
本 Acceptance を Column Creation Execution GO と同一視する
本 Acceptance を Implementation Start / adapter 実装開始と同一視する
INTENDED 未採択のまま CONFIRMED Internal Names を書く
Agent による SharePoint / M365 / Entra mutation を許可する
SupportPlans を本 Acceptance 対象に勝手に含める
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-COLUMN-PROVISION-1 Accepted = column creation GO
  Decision-AS-COLUMN-PROVISION-1 Accepted = intended Internal Names Accepted
  Decision-AS-COLUMN-PROVISION-1 Accepted = Implementation Start
  Decision-AS-COLUMN-PROVISION-1 Accepted = adapter / schema mapping code start
  Decision-AS-COLUMN-PROVISION-1 Accepted = Deploy / real data GO
  Decision-AS-COLUMN-PROVISION-1 Accepted = SupportPlans column scope
  Decision-AS-COLUMN-PROVISION-1 Accepted = Agent tenant mutation 許可
```

## Acceptance boundary

```text
This Acceptance locks NM/SC/PX/EG/VR/FG/XB/AP boundary only.

MUST NOT start from this Acceptance alone:
  inventing Internal Column Names
  SharePoint column create / rename / delete
  TypeScript / application / persistence port / adapter code
  Implementation Start
  Deploy / real data
  GitHub Issue mutation
```

## Next

```text
Decision-AS-COLUMN-PROVISION-1: Accepted / LOCKED
  / NM-HOLD + SC-AS + PX-HOLD + EG-HOLD + VR-1 + FG-1 + XB-1 + AP-1
Thirty-first residual: CONSUMED
SharePoint column creation: FORBIDDEN
Intended Internal Names: NOT ADOPTED / HOLD
Implementation Start: HOLD
adapter / schema mapping implementation: HOLD
Agent mutation: FORBIDDEN
Deploy / real data: NO-GO

Next substantive residual: NOT SELECTED by this Acceptance
Candidates（separate units）:
  NM-1 Human-provided intended names Decision（later reopen/path）
  Issue Status Reconciliation（#6 / #8 / #22）
  SupportPlans column scope（SC-BOTH was NOT SELECTED）

Ready: NOT RUN
Merge: NOT RUN
```
