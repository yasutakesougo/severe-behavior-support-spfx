# Decision-AS-ADAPTER-EC3-EC4-1 — EC-4 clear / omit mechanics comparison

この文書は、AIS-1-B Entry Criterion **EC-4** / residual **P2-002**
（`supersedesSnapshotId` optional absence の exact SharePoint clear / omit transport）
についての比較・合成検証正本である。

Packet:
[`decision-assessment-snapshot-adapter-ec3-ec4-packet.md`](./decision-assessment-snapshot-adapter-ec3-ec4-packet.md)

EC-3 comparison（transport host）:
[`decision-assessment-snapshot-adapter-ec3-transport-comparison.md`](./decision-assessment-snapshot-adapter-ec3-transport-comparison.md)

Depends on（再 Decision しない）:
[`assessment-snapshot-map010-column-contract.md`](./assessment-snapshot-map010-column-contract.md)
（O-1-A / R-1-A / W-1-A）
[`decision-assessment-snapshot-map010-column-acceptance.md`](./decision-assessment-snapshot-map010-column-acceptance.md)
[`decision-assessment-snapshot-adapter-start-acceptance.md`](./decision-assessment-snapshot-adapter-start-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-EC3-EC4-1
Axis: EC-4 / CO-* + SV-*
Status: CONSUMED（Human Decision Accepted / LOCKED）
Baseline main: 5bbe912d0e5e127cf1846bb0edf5ddff24ca99a0
Internal Name under test: supersedesSnapshotId
Column Type: 1行テキスト / Text
Human Decision: ACCEPT-RECOMMENDED
Accepted: CO-1-A + SV-1-A（with TC-1-A + DP-1-A + XB-1）
EC-4: MET
P2-002: CLOSED
Human Acceptance: decision-assessment-snapshot-adapter-ec3-ec4-acceptance.md
SharePoint / M365 mutation by Agent: 0
synthetic / local evidence only: YES（SV-1-A）
```

## 1. Locked conversion semantics（NOT reopened）

| Axis | Locked rule | Authority |
|---|---|---|
| O-1-A | logical absence（`undefined`）↔ persistence blank/null/missing = success；empty / whitespace-only = invalid present → fail-closed | MAP010-COLUMN-1 |
| R-1-A | null/missing → `undefined`；valid non-empty string → exact pass-through（no trim）；empty/ws/non-string → fail-closed | MAP010-COLUMN-1 |
| W-1-A | `undefined`/absent → persistence absence semantic；valid string → Text pass-through；empty/ws/`null` logical → fail-closed | MAP010-COLUMN-1 |
| W-1-B | absent → omit only；never clear existing | **NOT SELECTED**（prior） |

```text
Therefore EC-4 must support clearing an existing Text value on update
when logical input is absent. Omit-only is insufficient.
Empty string MUST NOT be used as the absence / clear representation
because R-1-A / O-1-A treat "" as invalid present.
```

## 2. Distinctions required

| Logical / intent | Create behavior needed | Update behavior needed |
|---|---|---|
| `undefined` / absent | do not persist a present string | if prior value exists, **clear** it；result read-back = absent |
| valid non-empty string | write exact Text | write exact Text（overwrite） |
| clear existing value | N/A（no prior） | explicit clear transport（not omit） |
| empty / whitespace-only | **fail-closed before transport** | **fail-closed before transport** |
| logical `null` | **fail-closed before transport** | **fail-closed before transport** |

## 3. CO-1 — Clear / omit mechanics candidates

Assumes Accepted EC-3 **TC-1-A**（SharePoint REST List Items via SPHttpClient host language）.

| ID | Create when absent | Update when absent（must clear） | Present valid string | Empty/ws/`null` logical | Aligns O/R/W-1-A? | Result |
|---|---|---|---|---|---|---|
| **CO-1-A** | **omit** field from POST body（preferred） | include Internal Name with JSON **`null`** in MERGE/PATCH body（explicit clear）；**omit must not be used for absence-on-update** | include field with exact non-empty string（no trim） | reject in adapter conversion；do not call transport | YES | **SELECTED / Accepted** |
| CO-1-B | omit | omit only；never send clear | exact string | fail-closed | NO — cannot clear prior value；equals rejected W-1-B | NOT SELECTED |
| CO-1-C | omit | send `""` to clear | exact string | send `""` as absence | NO — `""` is invalid present under O-1-A/R-1-A | NOT SELECTED |
| CO-1-D | always send `null` on create/update when absent | always `null` | exact string | fail-closed | YES functionally；create-omit preferred for minimal payload | NOT SELECTED |
| CO-1-HOLD | undecided | undecided | — | — | blocks EC-4 | NOT SELECTED |

```text
CO-1-A REST body language（Internal Name = supersedesSnapshotId）:

Create absent:
  { "__metadata": { "type": "SP.Data.AssessmentSnapshotsListItem" },
    /* supersedesSnapshotId omitted */ }

Create / Update present:
  { ..., "supersedesSnapshotId": "<exact non-empty string>" }

Update clear（logical absent）:
  { ..., "supersedesSnapshotId": null }

Update omit field:
  means “leave existing value unchanged”
  MUST NOT be used to express W-1-A logical absence
```

Entity type string above is illustrative of REST verbose shape only；
exact `ListItemEntityTypeFullName` remains an adapter runtime discovery /
configuration concern and is **not** invented as a locked deployment constant here.

## 4. SV-1 — Verification method

| ID | Method | Tenant write? | Result |
|---|---|---|---|
| **SV-1-A** | Synthetic / local body-construction matrix + public SharePoint REST clear semantics check；no live item write | NO | **SELECTED / Accepted** |
| SV-1-B | Agent live SharePoint write/read-back on pilot lists | YES | NOT SELECTED |
| SV-1-C | Defer all verification until Implementation Start | — | NOT SELECTED |

### 4.1 Synthetic verification matrix（local evidence）

Scope: JSON field inclusion rules for `supersedesSnapshotId` only.
No HTTP is sent. No SharePoint mutation.

| Case | Logical input | Operation | Expected body field | Expected conversion gate | Pass? |
|---|---|---|---|---|---|
| S1 | `undefined` | Create | **omit** key | allow transport | **PASS**（rule） |
| S2 | `undefined` | Update（clear prior） | `"supersedesSnapshotId": null` | allow transport | **PASS**（rule） |
| S3 | `"snap-001"` | Create | `"supersedesSnapshotId": "snap-001"` | allow transport | **PASS**（rule） |
| S4 | `"snap-001"` | Update | `"supersedesSnapshotId": "snap-001"` | allow transport | **PASS**（rule） |
| S5 | `""` | Create/Update | **no body**（must not send） | fail-closed | **PASS**（rule） |
| S6 | `"   "` | Create/Update | **no body** | fail-closed | **PASS**（rule） |
| S7 | `null`（logical） | Create/Update | **no body** | fail-closed | **PASS**（rule） |
| S8 | Update omit while intending clear | Update | omit only | **FORBIDDEN** as absence expression | **PASS**（negative rule） |

```text
Synthetic evidence sources:
  1. W-1-A / O-1-A / R-1-A LOCKED tables
  2. Repository audit-event physical precedent:
     logical absent → physical null（encodeOptional）
     physical null|undefined → logical undefined
     path: src/adapters/sharepoint/audit-event/physical-mapper.ts
  3. Public SharePoint REST guidance:
     clearing a field on update uses JSON null in MERGE body；
     omitting a field on update leaves prior value
  4. ValidateUpdateListItem text clear via "" is REJECTED here
     because "" conflicts with O-1-A / R-1-A

NOT claimed by synthetic matrix alone（recorded by Acceptance）:
  live tenant round-trip PASS
  SPHttpClient package integration test
  Implementation Start
```

Living after Acceptance:
```text
EC-4: MET
P2-002: CLOSED
Acceptance 正本: decision-assessment-snapshot-adapter-ec3-ec4-acceptance.md
```

## 5. Read-back expectation after CO-1-A write

| After write | Physical observed | R-1-A logical |
|---|---|---|
| Create omit / create null | null / missing | `undefined` |
| Update null clear | null / missing | `undefined` |
| Present string | exact string | same string |
| Stored `""`（must not be written by adapter） | empty string | fail-closed |

## 6. Explicit non-claims

```text
This EC-4 comparison document does NOT by itself:
  authorize Implementation Start
  authorize adapter code mutation
  authorize SharePoint / M365 writes
  authorize Deploy / real data
  convert empty/whitespace into successful absence

EC-4 MET / P2-002 CLOSED / CO-1-A + SV-1-A LOCKED
are recorded only in Acceptance 正本.
```

## 7. Agent recommendation vs Human Decision

```text
Agent recommendation for EC-4（historical）:
  CO-1-A + SV-1-A

Human Decision（Accepted / LOCKED）:
  ACCEPT-RECOMMENDED — CO-1-A + SV-1-A
  （full set TC-1-A + DP-1-A + CO-1-A + SV-1-A + XB-1）

EC-4: MET
P2-002: CLOSED
Acceptance 正本: decision-assessment-snapshot-adapter-ec3-ec4-acceptance.md
```
