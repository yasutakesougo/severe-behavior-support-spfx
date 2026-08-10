# Decision-AS-COLUMN-PX-1 — Human Acceptance

この文書は、**Decision-AS-COLUMN-PX-1**（AssessmentSnapshots 向け
custom column creation authorization / PX）についての
**Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-column-px-packet.md`](./decision-assessment-snapshot-column-px-packet.md)

Judgment（比較用；Acceptance ではない）:
[`decision-assessment-snapshot-column-px-judgment.md`](./decision-assessment-snapshot-column-px-judgment.md)

Selected via:
[`decision-ilb-1-thirty-fourth-residual-column-px-selection.md`](./decision-ilb-1-thirty-fourth-residual-column-px-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-column-provision-acceptance.md`](./decision-assessment-snapshot-column-provision-acceptance.md)
（SC-AS + EG-HOLD + VR-1 + FG-1；PX 軸のみ本 Acceptance で PX-1 へ）
[`decision-assessment-snapshot-column-names-acceptance.md`](./decision-assessment-snapshot-column-names-acceptance.md)
（NM-1 + CV-REQ + XB-1）
[`decision-assessment-snapshot-choice-options-acceptance.md`](./decision-assessment-snapshot-choice-options-acceptance.md)
（CO-1 + CV-CHOICE-BOTH + XB-1）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-COLUMN-PX-1
Status: Accepted / LOCKED
Human Decision: PX-1 + XB-1 + AP-1
Human Acceptance: Explicit Human Decision on 2026-08-10

LOCKED:

Column creation authorization:
  PX-1 — Accepted INTENDED columns の作成を許可する
         （Human process；Agent 不可）
         ≠ Execution GO
         ≠ columns created now
         ≠ Agent may mutate

Implementation / adapter / Deploy boundary:
  XB-1 — 本 Decision ≠ Implementation Start
         ≠ adapter / schema mapping code start
         ≠ Deploy / real data

AI / Agent mutation boundary:
  AP-1 — SharePoint column mutation は本 AI foundation 手順では禁止
         実作成は別 Human process

Explicit Execution GO（本 Acceptance で変更しない）:
  EG-HOLD — Execution GO を付けない
  Execution GO = NOT GIVEN

COLUMN-PROVISION-1 axes that REMAIN:
  SC-AS — AssessmentSnapshots（isogo + honmoku）only
  EG-HOLD — unchanged
  VR-1 — post-create CN-1 re-observation required before CONFIRMED
  FG-1 — fail-closed

COLUMN-NAMES-1 / CHOICE-OPTIONS-1:
  UNCHANGED / LOCKED（INTENDED；≠ CONFIRMED）

Implementation Start:
  HOLD
SharePoint adapter / schema mapping implementation:
  HOLD
SharePoint column creation:
  FORBIDDEN until EG-1 + Human create
  （PX-1 alone ≠ create start）
Execution GO:
  NOT GIVEN
Agent SharePoint mutation:
  FORBIDDEN
Deploy / real data:
  NO-GO
INTENDED ≠ OBSERVED / CONFIRMED:
  LOCKED

Closes only:
  Decision-AS-COLUMN-PX-1（PX-1 + XB-1 + AP-1）
  Thirty-fourth residual
Does NOT close:
  Explicit Execution GO（EG-1）
  column creation Execution
  CONFIRMED Internal Names / Choice options
  CV extension（MAP-AS-009/010 / ENV）
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
Human Decision: PX-1 + XB-1 + AP-1
Decision-AS-COLUMN-PX-1: Accepted / LOCKED
EG-HOLD: MAINTAINED
Execution GO: NOT GIVEN
```

日本語正本:

```text
PX-1:
  Accepted INTENDED columns の作成を許可する。
  Human process のみ。Agent は作成しない。
  ≠ Execution GO。≠ いま列を作る。
XB-1:
  本 Acceptance だけでは Implementation / adapter / Deploy を開始しない。
AP-1:
  Agent による SharePoint mutation は禁止。実作成は別 Human process。
EG-HOLD:
  Explicit Execution GO は付けない。作成実行はまだ開始しない。
```

## Accepted 内容

```text
Decision-AS-COLUMN-PX-1: Accepted / LOCKED

Column creation authorization: PX-1
Implementation boundary:       XB-1
AI / Agent mutation:           AP-1

NOT SELECTED:
  PX-HOLD / PX-X
  EG-1 / EG-2 / EG-X
  XB-2 / XB-X
  AP-2 / AP-X
```

失敗時 MUST NOT（LOCKED）:

```text
本 Acceptance を Explicit Execution GO と同一視する
本 Acceptance だけで SharePoint column を作成する
Agent に SharePoint mutation を許可する
EG-HOLD を本 Acceptance で解除したとみなす
本 Acceptance を Implementation Start / adapter 実装開始と同一視する
INTENDED を CONFIRMED と同一視する
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-COLUMN-PX-1 Accepted = Execution GO
  Decision-AS-COLUMN-PX-1 Accepted = columns created
  Decision-AS-COLUMN-PX-1 Accepted = Agent may mutate tenant
  Decision-AS-COLUMN-PX-1 Accepted = Implementation Start
  Decision-AS-COLUMN-PX-1 Accepted = adapter / schema mapping code start
  Decision-AS-COLUMN-PX-1 Accepted = Deploy / real data GO
  Decision-AS-COLUMN-PX-1 Accepted = CONFIRMED Internal Names
```

## Acceptance boundary

```text
This Acceptance locks PX-1 + XB-1 + AP-1 only.
EG-HOLD remains.

MUST NOT start from this Acceptance alone:
  Explicit Execution GO
  SharePoint column create / rename / delete
  treating INTENDED as CONFIRMED
  TypeScript / application / persistence port / adapter code
  Implementation Start
  Deploy / real data
  GitHub Issue mutation
```

## Next

```text
Decision-AS-COLUMN-PX-1: Accepted / LOCKED / PX-1 + XB-1 + AP-1
Thirty-fourth residual: CONSUMED
EG-HOLD: MAINTAINED
Execution GO: NOT GIVEN
SharePoint column creation: FORBIDDEN（until EG-1 + Human create）
Implementation Start: HOLD
adapter / schema mapping implementation: HOLD
Agent mutation: FORBIDDEN
Deploy / real data: NO-GO
INTENDED ≠ CONFIRMED

Next substantive residual: SELECTED elsewhere — EG-1 Execution GO path
  （Decision-AS-COLUMN-EG-1；see thirty-fifth residual）
Other candidates（separate units）:
  CV extension（MAP-AS-009/010 / ENV）
  Issue Status Reconciliation（#6 / #8 / #22）

Ready: NOT RUN
Merge: NOT RUN
```
