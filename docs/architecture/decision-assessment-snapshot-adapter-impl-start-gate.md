# AIS-1-B Implementation Start Gate — EC-5..EC-8 determination

この文書は、Decision-AS-ADAPTER-START-1（**AIS-1-B**）の
**Implementation Start gate** について、EC-5..EC-8 を判定し、
最初の AssessmentSnapshot adapter implementation slice を固定する
**gate determination 正本**である。

Skill basis: [`implementation-review`](../../.agents/skills/implementation-review/SKILL.md)
／ [`decision-review`](../../.agents/skills/decision-review/SKILL.md)

IR:
[`decision-assessment-snapshot-adapter-impl-start-gate-independent-review.md`](./decision-assessment-snapshot-adapter-impl-start-gate-independent-review.md)

Acceptance 正本:
[`decision-assessment-snapshot-adapter-implementation-start-acceptance.md`](./decision-assessment-snapshot-adapter-implementation-start-acceptance.md)

Acceptance IR:
[`decision-assessment-snapshot-adapter-implementation-start-acceptance-independent-review.md`](./decision-assessment-snapshot-adapter-implementation-start-acceptance-independent-review.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-adapter-start-acceptance.md`](./decision-assessment-snapshot-adapter-start-acceptance.md)
（AIS-1-B）
[`decision-assessment-snapshot-adapter-ec3-ec4-acceptance.md`](./decision-assessment-snapshot-adapter-ec3-ec4-acceptance.md)
（TC-1-A + DP-1-A + CO-1-A + SV-1-A + XB-1）
[`decision-assessment-snapshot-sp-adapter-acceptance.md`](./decision-assessment-snapshot-sp-adapter-acceptance.md)
（PB-1 + EM-1 + CV-1 + D6-1 + UP-1）
[`assessment-snapshot-conversion-contract.md`](./assessment-snapshot-conversion-contract.md)
[`assessment-snapshot-map010-column-contract.md`](./assessment-snapshot-map010-column-contract.md)
[`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)
[`decision-assessment-snapshot-mapping-complete-determination.md`](./decision-assessment-snapshot-mapping-complete-determination.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: AIS-1-B-IMPLEMENTATION-START-GATE
Kind: Gate determination（docs-only）
Status: CONSUMED（Human Implementation Start GO Accepted）
Baseline main: 2b21542ae1370ea9205f7c67faa874a174db1b3d
Determination date: 2026-08-10
Human Decision: GO-SLICE-1
Acceptance: Decision-AS-ADAPTER-IMPLEMENTATION-START-1 Accepted / LOCKED
PR: #214

Authority:
  Decision-AS-ADAPTER-START-1 = ACCEPTED / LOCKED as AIS-1-B
  Decision-AS-ADAPTER-EC3-EC4-1 = ACCEPTED / LOCKED
    / TC-1-A + DP-1-A + CO-1-A + SV-1-A + XB-1
  Decision-AS-ADAPTER-IMPLEMENTATION-START-1 = ACCEPTED / LOCKED / GO-SLICE-1

Entry Criteria living:
  EC-1 = MET
  EC-2 = MET
  EC-3 = MET
  EC-4 = MET
  EC-5 = MET
  EC-6 = MET
  EC-7 = MET
  EC-8 = MET
  P2-002 = CLOSED
  Entry Criteria blocker = NONE

Implementation Start: GO-SLICE-1
adapter code in this Acceptance recording PR: NOT STARTED（docs-only）
runtime dependency addition: NOT AUTHORIZED（DP-1-A / LOCKED OUT）
SharePoint / M365 / Entra mutation by Agent: FORBIDDEN
Deploy / real data: NO-GO / OUT of first slice
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Question

```text
AIS-1-B Implementation Start gate について:

1. EC-5..EC-8 は、提案する最初の AssessmentSnapshot
   adapter implementation slice に対して MET か。
2. 最初の implementation slice の正確な IN / OUT は何か。
3. Implementation Start を Human GO 候補にしてよいか。

本 determination ≠ Implementation Start GO
本 determination ≠ adapter code start
本 determination ≠ runtime dependency install
本 determination ≠ SharePoint / M365 / Deploy
```

## 2. Locked premises（NOT reopened）

| Item | Value | Authority |
|---|---|---|
| AIS-1-B | 条件付きGO；Entry Criteria 全充足後に別ゲートで Start 可 | ADAPTER-START-1 |
| Transport | SharePoint REST List Items；host = SPFx SPHttpClient when available | EC3-EC4 / TC-1-A |
| Dependency | no runtime dependency install authorized | EC3-EC4 / DP-1-A |
| Clear/omit | CO-1-A（create omit；update clear = JSON null；`""`/ws/logical null fail-closed） | EC3-EC4 |
| Port / conversion / errors | PB-1 + CV-1 + EM-1 + UP-1 | SP-ADAPTER-1 |
| MAP-AS-001〜008 conversion | ACCEPTED / LOCKED（fail-closed） | CONVERSION-1 |
| MAP-AS-009 | EXPLICITLY OUT | CV-EXTENSION-1 |
| MAP-AS-010 | R-1-A / W-1-A + CO-1-A | MAP010-COLUMN-1 + EC3-EC4 |
| ENV-001〜003 | DERIVED（no per-item SP column） | CV-EXTENSION-1 |
| mapping-complete | PASS / COMPLETE | determination |
| package.json SharePoint runtime deps | NONE | inspected baseline |

## 3. EC-5..EC-8 determination

### EC-5 — fail-closed behavior preserved

| Check | Required by slice | Result |
|---|---|---|
| RW-1 / MF-1 for MAP-AS-001〜008 | conversion failures must not become success | **MET** |
| C-1-A / C-2-DERIVED / C-3-A / C-4-A fail-closed tables | preserved verbatim；no trim-to-accept / default synthesis | **MET** |
| O-1-A / R-1-A / W-1-A for MAP-AS-010 | empty/ws/logical null fail-closed；no coerce | **MET** |
| CO-1-A transport gate | empty/ws/logical null → no transport；update omit ≠ clear | **MET** |
| EM-1 / UP-1 | SP/transport failures → FR-1；unavailable ≠ success | **MET** |
| MAP-AS-009 | must remain OUT（no invented persistence codec） | **MET** |

```text
EC-5 = MET
for the proposed first slice defined in §4,
because the slice MUST preserve the Accepted fail-closed contracts above
and MUST NOT introduce success-coercion paths.
```

### EC-6 — synthetic data only

| Check | Required by slice | Result |
|---|---|---|
| Tests / fixtures | synthetic AssessmentSnapshot values only | **MET** |
| In-memory / local store | synthetic list-store pattern allowed（audit-event precedent） | **MET** |
| Real tenant items / production exports as fixtures | FORBIDDEN in this slice | **MET**（excluded） |
| Live SharePoint read-back as test oracle | FORBIDDEN in this slice | **MET**（excluded） |

```text
EC-6 = MET
for the proposed first slice,
because implementation/test inputs are constrained to synthetic data only.
```

### EC-7 — SharePoint / M365 / Entra mutation by Agent FORBIDDEN

| Check | Required by slice | Result |
|---|---|---|
| Agent live tenant item create/update/delete | FORBIDDEN | **MET** |
| Agent SharePoint column/schema mutation | FORBIDDEN | **MET** |
| Agent M365 / Entra mutation | FORBIDDEN | **MET** |
| Live SPHttpClient calls against pilot sites | NOT AUTHORIZED in this slice | **MET** |
| Transport exercised via synthetic body builder / local harness only | REQUIRED | **MET** |

```text
EC-7 = MET
for the proposed first slice,
because no live tenant writes are authorized and Agent mutation remains FORBIDDEN.
```

### EC-8 — Deploy / real data = separate GO / OUT

| Check | Required by slice | Result |
|---|---|---|
| Deploy / App Catalog / production publish | OUT；separate Human GO | **MET** |
| Real data / pilot business records | OUT；separate Human GO | **MET** |
| First slice success ≠ Deploy GO | explicit | **MET** |

```text
EC-8 = MET
for the proposed first slice,
because Deploy / real data remain separate Human GO and OUT of this slice.
```

### Entry Criteria summary

| EC | Status | Blocker for Implementation Start GO? |
|---|---|---|
| EC-1 | MET | NO |
| EC-2 | MET | NO |
| EC-3 | MET | NO |
| EC-4 | MET | NO |
| EC-5 | **MET** | NO |
| EC-6 | **MET** | NO |
| EC-7 | **MET** | NO |
| EC-8 | **MET** | NO |

```text
Canonical Entry Criteria blocker remaining: NONE
Implementation Start remains HOLD until separate Human GO
```

## 4. Exact first implementation slice scope（IN）

```text
Slice name:
  AssessmentSnapshot adapter — synthetic persistence slice v1

Boundary:
  AssessmentSnapshot adapter boundary only（PB-1 / CV-1 / EM-1 / UP-1）

IN（authorized only after separate Human Implementation Start GO）:
  1. New adapter module under src/adapters/sharepoint/assessment-snapshot/
  2. Persistence port surface:
       input  = SC-1 vocabulary（validated AssessmentSnapshot + intent）
       output = FR-1 vocabulary
  3. Adapter-internal read/write conversion for:
       MAP-AS-001〜008 per Decision-AS-CONVERSION-1
       MAP-AS-010 per R-1-A / W-1-A + CO-1-A
  4. MAP-AS-009 = EXPLICITLY OUT（no codec / no column mapping）
  5. ENV-001〜003 = DERIVED constants inside adapter（no SP columns）
  6. SharePoint REST List Items request/response field mapping
       for List AssessmentSnapshots
       Internal Names as Accepted / OBSERVED
  7. REST body construction per TC-1-A + CO-1-A:
       create absence → omit supersedesSnapshotId preferred
       present string → exact / no trim
       update clear → "supersedesSnapshotId": null
       update omit → leave existing（not absence）
       empty / whitespace / logical null → FAIL-CLOSED / no transport
  8. Transport host seam typed for SPFx SPHttpClient when available
       WITHOUT installing @microsoft/sp-http / any new runtime dependency
  9. Synthetic in-memory list store + unit/contract tests
       （pattern precedent: src/adapters/sharepoint/audit-event/）
 10. Fail-closed tests for conversion + clear/omit + FR-1 / UP-1 mapping
```

```text
Host / dependency posture inside this slice:
  preferred host language = SPFx SPHttpClient when available
  until SPFx packages exist: synthetic harness only
  DP-1-A remains LOCKED — no npm runtime dependency install
```

## 5. Explicit OUT / forbidden scope

```text
OUT of first slice / FORBIDDEN even after Human Implementation Start GO
unless a later separate Human Decision / GO says otherwise:

  live SharePoint / M365 / Entra mutation by Agent
  live SPHttpClient calls to pilot or any tenant
  SharePoint column create / rename / delete / schema mutation
  runtime dependency install（@microsoft/sp-* / @pnp/* / Graph clients）
  SPFx scaffold / webpart / App Catalog / Deploy
  real data / production or pilot business records as fixtures
  SupportPlan / other aggregate adapters
  application UI wiring beyond adapter port tests
  new business Decision / domain rule invention
  MAP-AS-009 persistence invention
  ENV physical SharePoint columns
  Graph / PnPjs transport
  Issue bulk mutation / 一括 Close
  Ready / Merge / Deploy auto-run from this determination
```

## 6. Implementation Start recommendation vs Human Decision

```text
implementation-review Gate（Entry Criteria completeness）: PASS
  EC-1..EC-8 all MET for the proposed first slice
  no canonical Entry Criteria blocker remains

Agent recommendation（historical）:
  READY FOR HUMAN IMPLEMENTATION START GO
  option = GO-SLICE-1

Human Decision（Accepted / LOCKED）:
  GO-SLICE-1
  Decision-AS-ADAPTER-IMPLEMENTATION-START-1
  Acceptance 正本:
    decision-assessment-snapshot-adapter-implementation-start-acceptance.md

Implementation Start living status: GO-SLICE-1
This gate determination alone was NOT the Human GO.
This Acceptance recording PR remains docs-only（code NOT STARTED here）.
```

## 7. Test plan required by the slice（for later GO）

| Area | Required coverage |
|---|---|
| MAP-AS-001〜008 write/read | Accepted conversion tables；fail-closed cases |
| MAP-AS-010 | R-1-A / W-1-A + CO-1-A create omit / update null clear / omit≠clear / empty-ws-null fail-closed |
| MAP-AS-009 | remains unmapped / OUT |
| ENV-001〜003 | DERIVED constants；no SP column writes |
| FR-1 / UP-1 | conversion failure and unavailable → fail-closed |
| Synthetic only | no tenant credentials / no live HTTP to SharePoint |

## 8. Explicit non-authorization

```text
Gate determination / GO-SLICE-1 Acceptance do NOT authorize:
  live SharePoint tenant I/O
  runtime dependency install
  Deploy / real data
  expanding §4 / IN scope
  waiving §5 LOCKED OUT
  starting adapter code inside the docs-only Acceptance recording PR
```

## 9. Next

```text
EC-1..EC-8: all MET
P2-002: CLOSED
Implementation Start: GO-SLICE-1
Decision-AS-ADAPTER-IMPLEMENTATION-START-1: Accepted / LOCKED
Next（separate implementation run；not this docs recording）:
  implement GO-SLICE-1 under §5 LOCKED OUT / FORBIDDEN
Still FORBIDDEN until separate GO:
  live tenant I/O
  runtime dependency install
  Deploy / real data
Next PR process gate: HUMAN READY DECISION FOR PR #214
```
