# Decision-AS-COLUMN-EG-1 — Human Acceptance

この文書は、**Decision-AS-COLUMN-EG-1**（AssessmentSnapshots 向け
Explicit Column Creation Execution GO / EG）についての
**Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-column-eg-packet.md`](./decision-assessment-snapshot-column-eg-packet.md)

Judgment（比較用；Acceptance ではない）:
[`decision-assessment-snapshot-column-eg-judgment.md`](./decision-assessment-snapshot-column-eg-judgment.md)

Selected via:
[`decision-ilb-1-thirty-fifth-residual-column-eg-selection.md`](./decision-ilb-1-thirty-fifth-residual-column-eg-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-column-px-acceptance.md`](./decision-assessment-snapshot-column-px-acceptance.md)
（PX-1 + XB-1 + AP-1）
[`decision-assessment-snapshot-column-provision-acceptance.md`](./decision-assessment-snapshot-column-provision-acceptance.md)
（SC-AS + VR-1 + FG-1）
[`decision-assessment-snapshot-column-names-acceptance.md`](./decision-assessment-snapshot-column-names-acceptance.md)
（NM-1 + CV-REQ）
[`decision-assessment-snapshot-choice-options-acceptance.md`](./decision-assessment-snapshot-choice-options-acceptance.md)
（CO-1 + CV-CHOICE-BOTH）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-COLUMN-EG-1
Status: Accepted / LOCKED
Human Decision: EG-1 + XB-1 + AP-1
Human Acceptance: Explicit Human Decision on 2026-08-10

LOCKED:

Explicit Execution GO:
  EG-1 — Human が Explicit Column Creation Execution GO を付与する
         Execution GO = GIVEN（Human process create only）
         ≠ Agent may create
         ≠ Human create already executed
         ≠ columns CONFIRMED
         ≠ Implementation Start

Implementation / adapter / Deploy boundary:
  XB-1 — 本 Decision ≠ Implementation Start
         ≠ adapter / schema mapping code start
         ≠ Deploy / real data

AI / Agent mutation boundary:
  AP-1 — SharePoint column mutation は本 AI foundation 手順では禁止
         実作成は別 Human process

Separation rule（LOCKED）:
  EG-1 Acceptance ≠ Human create execution
  Human create = separate later Human process
  After Human create → VR-1 CN-1 re-observation for CONFIRMED

COLUMN-PX-1 / NAMES / CHOICE / PROVISION axes that REMAIN:
  PX-1 — authorization remains
  SC-AS — AssessmentSnapshots only
  VR-1 — post-create re-observation required
  FG-1 — fail-closed
  CV-REQ INTENDED names / Choice options — UNCHANGED（≠ CONFIRMED）

Implementation Start:
  HOLD
SharePoint adapter / schema mapping implementation:
  HOLD
Agent SharePoint mutation:
  FORBIDDEN
Human create:
  AUTHORIZED to proceed as separate Human process
  NOT started by this Acceptance alone
  NOT performed by Agent
Deploy / real data:
  NO-GO
INTENDED ≠ OBSERVED / CONFIRMED:
  LOCKED until Human create + VR-1

Closes only:
  Decision-AS-COLUMN-EG-1（EG-1 + XB-1 + AP-1）
  Thirty-fifth residual
Does NOT close:
  Human create completion
  CONFIRMED Internal Names / Choice options
  CV extension（MAP-AS-009/010 / ENV）
  SharePoint / adapter / application 実装
  Implementation Start
  Deploy / real data
Implementation auto-start: FORBIDDEN
Agent tenant mutation: FORBIDDEN
Agent column create: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: EG-1 + XB-1 + AP-1
Decision-AS-COLUMN-EG-1: Accepted / LOCKED
Execution GO: GIVEN（Human process create only）
Agent mutation: FORBIDDEN
Implementation Start / adapter: HOLD
EG-1 Acceptance ≠ Human create
```

日本語正本:

```text
EG-1:
  Explicit Column Creation Execution GO を付与する。
  Human process での作成を許可する。Agent は作成しない。
  Acceptance だけでは列はまだ作られない。
XB-1:
  本 Acceptance だけでは Implementation / adapter / Deploy を開始しない。
AP-1:
  Agent による SharePoint mutation は禁止。実作成は別 Human process。
```

## Accepted 内容

```text
Decision-AS-COLUMN-EG-1: Accepted / LOCKED

Explicit Execution GO:   EG-1
Implementation boundary: XB-1
AI / Agent mutation:     AP-1

NOT SELECTED:
  EG-HOLD / EG-2 / EG-X
  XB-2 / XB-X
  AP-2 / AP-X
```

失敗時 MUST NOT（LOCKED）:

```text
本 Acceptance を Human create 完了と同一視する
Agent に SharePoint column create を許可する
本 Acceptance を Implementation Start / adapter 実装開始と同一視する
INTENDED を CONFIRMED と同一視する（VR-1 前）
EG-2（docs/Agent Acceptance だけで作成）を採ったとみなす
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-COLUMN-EG-1 Accepted = Human create completed
  Decision-AS-COLUMN-EG-1 Accepted = columns exist / CONFIRMED
  Decision-AS-COLUMN-EG-1 Accepted = Agent may mutate tenant
  Decision-AS-COLUMN-EG-1 Accepted = Implementation Start
  Decision-AS-COLUMN-EG-1 Accepted = adapter / schema mapping code start
  Decision-AS-COLUMN-EG-1 Accepted = Deploy / real data GO
```

## Acceptance boundary

```text
This Acceptance locks EG-1 + XB-1 + AP-1 only.

AUTHORIZED by this Acceptance:
  Human process may proceed to create Accepted INTENDED columns
  （separate step；not executed by this document）

MUST NOT start from this Acceptance alone:
  Agent SharePoint column create / rename / delete
  treating INTENDED as CONFIRMED
  TypeScript / application / persistence port / adapter code
  Implementation Start
  Deploy / real data
  GitHub Issue mutation
```

## Next

```text
Decision-AS-COLUMN-EG-1: Accepted / LOCKED / EG-1 + XB-1 + AP-1
Thirty-fifth residual: CONSUMED
Execution GO: GIVEN（Human process only）
Agent mutation: FORBIDDEN
Implementation Start: HOLD
adapter / schema mapping implementation: HOLD
Human create: separate next Human process（NOT started here）
INTENDED ≠ CONFIRMED until create + VR-1

Next substantive residual: NOT SELECTED by this Acceptance
Candidates（separate units）:
  Human create execution record / evidence
  VR-1 CN-1 re-observation after create
  CV extension（MAP-AS-009/010 / ENV）
  Issue Status Reconciliation（#6 / #8 / #22）

Ready: NOT RUN
Merge: NOT RUN
```
