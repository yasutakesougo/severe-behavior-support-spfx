# Decision-AS-MAP010-COLUMN-1 — Human Column Create + VR-1 evidence return

この文書は、Decision-AS-MAP010-COLUMN-1（N-1-A + N-2-A + T-1-A + O-1-A +
R-1-A + W-1-A + XB-1）Accepted / LOCKED 後に、Human が作成し read-back した
**MAP-AS-010 `supersedesSnapshotId` custom column** の一次 evidence 記録である。

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-map010-column-acceptance.md`](./decision-assessment-snapshot-map010-column-acceptance.md)
[`assessment-snapshot-map010-column-contract.md`](./assessment-snapshot-map010-column-contract.md)
[`decision-assessment-snapshot-cv-extension-acceptance.md`](./decision-assessment-snapshot-cv-extension-acceptance.md)
（X-2-A PERSISTED）
[`decision-assessment-snapshot-column-create-vr1-evidence.md`](./decision-assessment-snapshot-column-create-vr1-evidence.md)
（CV-REQ 8 precedent）
[`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Primary-evidence observation record（Human Column Create + VR-1）
Status: OBSERVED / CONFIRMED（MAP-AS-010；isogo + honmoku）
Decision basis:
  Decision-AS-CV-EXTENSION-1 = Accepted / LOCKED / X-2-A（PERSISTED）
  Decision-AS-MAP010-COLUMN-1 = Accepted / LOCKED
    / N-1-A + N-2-A + T-1-A + O-1-A + R-1-A + W-1-A + XB-1
Baseline main at closeout start:
  5ddb05950a2123a1fb609698b9673102a6190721

Observation date: 2026-08-10
Method: Human SharePoint column create + Human VR-1 read-back（primary evidence）
Mutation by Agent: NONE
SharePoint mutation by Agent: 0
Agent environment credentials: NONE（NO_SP_ENV）
Deploy: 0

MAP-AS-010 Human Column Create: COMPLETE
Isogo: OBSERVED / CONFIRMED
Honmoku: OBSERVED / CONFIRMED
VR-1: PASS
Intent = Observed
Mismatch = 0
Sites covered: 2 / 2
List: AssessmentSnapshots

Physical column: PRESENT
MAP-AS-010 column-ready: YES
Required: False / OPTIONAL（not escalated）

Implementation Start: HOLD
SharePoint adapter / schema mapping / DTO wiring: HOLD
P2-002 clear/omit transport API: OPEN / CARRY-FORWARD（adapter impl gate）
Deploy / real data: NO-GO
```

**本記録は AssessmentSnapshots（isogo / honmoku）の MAP-AS-010 列についての
Human create 完了と VR-1 Intent=Observed の一次 evidence である。**
Agent による SharePoint mutation は行っていない。新 Decision の Acceptance ではない。

## 1. Verification summary

| Metric | Value | Status |
|---|---|---|
| Intent = Observed | YES | **PASS** |
| Mismatch | 0 | **PASS** |
| Sites covered | isogo + honmoku = 2 / 2 | **PASS** |
| List | AssessmentSnapshots | **PASS** |
| Mapping ID | MAP-AS-010 | **PASS** |
| Internal Name | `supersedesSnapshotId` | **PASS** |
| Display Name | 訂正元スナップショットID | **PASS** |
| Column Type | Text / 1行テキスト | **PASS** |
| Required | False / OPTIONAL | **PASS** |
| VR-1 | PASS | **PASS** |
| Agent SharePoint mutation | 0 | **PASS** |
| Deploy | 0 | **PASS** |

```text
Fail-closed mismatch: not triggered
Alternate names / overwrite / blind retry: NONE
Agent column create: NONE
```

## 2. Intended vs Observed（MAP-AS-010）

Scope Lists: `AssessmentSnapshots` on `severe-support-isogo` / `severe-support-honmoku`

Accepted INTENDED 正本（verbatim；再 Decision しない）:
[`decision-assessment-snapshot-map010-column-acceptance.md`](./decision-assessment-snapshot-map010-column-acceptance.md)
[`assessment-snapshot-map010-column-contract.md`](./assessment-snapshot-map010-column-contract.md)

| Site | Mapping ID | Internal Name | Display Name | Intended Type | Observed Type | Required | Match | Status |
|---|---|---|---|---|---|---|---|---|
| severe-support-isogo | MAP-AS-010 | supersedesSnapshotId | 訂正元スナップショットID | 1行テキスト | Text / 1行テキスト | False / OPTIONAL | YES | OBSERVED / CONFIRMED |
| severe-support-honmoku | MAP-AS-010 | supersedesSnapshotId | 訂正元スナップショットID | 1行テキスト | Text / 1行テキスト | False / OPTIONAL | YES | OBSERVED / CONFIRMED |

```text
Both sites:
  severe-support-isogo / AssessmentSnapshots / MAP-AS-010 = OBSERVED / CONFIRMED
  severe-support-honmoku / AssessmentSnapshots / MAP-AS-010 = OBSERVED / CONFIRMED
INTENDED → OBSERVED / CONFIRMED
Physical column: PRESENT
column-ready: YES
```

## 3. Explicitly NOT confirmed / NOT closed by this evidence alone

```text
NOT closed by MAP-AS-010 Human Column Create + VR-1 PASS alone:
  mapping-complete claim（requires separate M-1-A determination）
  P2-002 exact SharePoint clear/omit/null transport API
  adapter / DTO / schema wiring
  Implementation Start
  Deploy / real data
  Agent tenant mutation permission
  new Decision Acceptance
  MAP-AS-009 / ENV re-open
```

## 4. Recording boundary

```text
This evidence record:
  records Human create COMPLETE for MAP-AS-010
  records VR-1 PASS with Intent = Observed / Mismatch = 0
  sets Isogo / Honmoku = OBSERVED / CONFIRMED for MAP-AS-010
  preserves Accepted Internal Name / Display Name / type / OPTIONAL exactly
  does NOT invent additional columns
  does NOT Accept a new Decision
  does NOT authorize Implementation Start
  does NOT authorize adapter / schema / DTO wiring
  does NOT authorize Deploy / real data write
  does NOT authorize Agent SharePoint mutation
  does NOT close P2-002
```

## 5. Explicit non-authorization

```text
VR-1 PASS / Human Column Create COMPLETE does NOT authorize:
  SharePoint adapter implementation start
  schema-mapping TypeScript / application / DTO code start
  treating P2-002 as closed
  Deploy / real data
  Agent SharePoint / M365 / Entra mutation
  Ready / Merge without separate Human authorization
```

## 6. Next

```text
MAP-AS-010 Human Column Create: COMPLETE
VR-1: PASS
Isogo: OBSERVED / CONFIRMED
Honmoku: OBSERVED / CONFIRMED
Physical column: PRESENT
column-ready: YES
SharePoint mutation by Agent: 0
Deploy: 0

Companion determination（same closeout unit）:
  decision-assessment-snapshot-mapping-complete-determination.md

Still HOLD:
  Implementation Start / adapter / DTO / schema wiring
  Deploy / real data
  P2-002 closure
```
