# FAST-LANE-V1 — Standing LOW-Risk Execution Lane（Candidate）

- 文書: `docs/process/fast-lane-v1.md`
- Unit: **FAST-LANE-V1**
- 位置づけ: PROCESS-OPT-V1 risk model の下位 **standing LOW execution enablement 候補**
- 状態: **CANDIDATE / NOT YET ACTIVE**
- Human Decision: **NOT YET GRANTED**
- Authorization effect: **NONE**
- Standing LOW authorization: **NOT GRANTED**
- 上位正本（緩和・上書きしない — Acceptance 後も intersection で厳しい側を採用）:
  - `docs/decisions/DEC-AI-ORG-003.md`
  - `docs/decisions/DEC-AA-001.md`
  - `docs/decisions/DEC-AA-003.md`
  - `docs/process/routine-aug-v1.md`
  - `docs/process/process-optimization-v1.md`（PROCESS-OPT-V1 / ACCEPTED / LOCKED）
  - `docs/process/low-auto-pilot-v1.md`（LOW-AUTO-PILOT-V1 / LA1-A ACCEPTED）
  - `docs/process/autonomy-policy-v1.md`（AUTO-1 / ACCEPTED / NOT ENABLED）
- Selection packet:
  [`../architecture/decision-fast-lane-v1-selection.md`](../architecture/decision-fast-lane-v1-selection.md)

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](./self-referential-gate-policy.md)）。

## Status banner（固定）

```text
FAST-LANE-V1:
Status:
CANDIDATE / NOT YET ACTIVE

Standing LOW authorization:
NOT GRANTED

Human Decision:
NOT YET GRANTED

Authorization effect:
NONE

Implementation:
DO NOT START YET under FAST-LANE

Ready auto:
NOT ACCEPTED

Merge:
HUMAN-ONLY

SharePoint / M365 / Entra / Deploy / production:
FORBIDDEN under this document

Action Gateway / AUTONOMY-POLICY-V1 enablement:
NOT GRANTED by this document
```

```text
Agent recommendation / Independent Review: NOT Human Acceptance evidence
Candidate docs ≠ standing authorization
FAST-LANE-V1 ACCEPT ≠ automatic merge
FAST-LANE-V1 ACCEPT ≠ LIVE / Entra / SharePoint mutation
FAST-LANE-V1 ACCEPT ≠ Issue Close
FAST-LANE-V1 ACCEPT ≠ AUTONOMY-POLICY-V1 enablement
```

## Purpose

低リスク・repository-only 実装について、繰り返しの Human Selection / Implementation Start
を減らしつつ、MEDIUM / LIVE の Human 制御を弱めない。

目標フロー（Acceptance 後・LOW のみ）:

```text
Standing LOW-risk authorization
→ Agent selects eligible slice（unique only）
→ Agent performs Independent Review of Selection commit
→ Agent implements
→ Agent tests / CI
→ Agent creates Draft PR
→ Human Merge GO
```

## Ownership / reuse（no duplicate governance）

| Existing authority | Relation to FAST-LANE-V1 |
|---|---|
| PROCESS-OPT-V1 | **Reuse** risk model foundation（LOW / MEDIUM / HIGH）。本文書は HIGH を LIVE/HIGH として運用語彙を明示するだけ |
| LOW-AUTO-PILOT-V1 | **Supersede for standing LOW lane after Human ACCEPT**（pilot envelope より広い repository-only LOW）。pilot 本文を書き換えず、standing lane として別 Acceptance を要する |
| Routine AUG v1 | Acceptance 後も **scoped exception only**（unique LOW next-slice + per-slice Start）。global rewrite しない |
| AUTONOMY-POLICY-V1 | **Unchanged / NOT ENABLED**。Gateway 実装・enablement は別 unit |
| DEC-AA-001 / DEC-AA-003 | **Unchanged**。Ready / Merge / Decision Acceptance は HUMAN-ONLY |

```text
duplicate existing policy: NO
（same area as PROCESS-OPT / LOW-AUTO-PILOT / Routine AUG, but standing enablement candidate）
recommended status: READY FOR HUMAN ACCEPTANCE
```

## Risk classes（exactly three）

### LOW — repository-only autonomous lane

Eligible only when **ALL** are true:

```text
repository-only
synthetic data only
external I/O = 0
Graph = 0
Entra = 0
SharePoint live I/O = 0
M365 mutation = 0
Deploy = 0
Production = 0
real personal/business data = 0
Accepted / LOCKED authority already exists
no new business semantics
no new regulatory interpretation
no new role / status / vocabulary invention
no unresolved P0/P1 finding
scope is independently testable
rollback = normal PR revert
```

LOW permits Agent execution through（Acceptance 後のみ）:

```text
Entry Criteria assessment
→ exact slice selection
→ Selection / Acceptance record
→ Independent Review
→ Implementation Start（standing, LOW only）
→ implementation
→ tests / CI
→ Draft PR
→ Ready recommendation
```

LOW does **NOT** permit:

```text
automatic merge
production deploy
M365 / SharePoint / Entra mutation
real data
Issue Close unless independently authorized
new business semantics
new governance Decision
Ready auto without Human Merge shortcut conditions
```

Human remains required for final Merge.

### MEDIUM — bounded implementation requiring explicit Human Implementation GO

Use when any of these apply:

```text
new repository architecture with material security impact
new external-provider implementation
new schema / provisioning definition that may later drive live mutation
cross-component behavior not covered by existing Accepted authority
meaningful irreversible migration design
substantial permission/security behavior
```

Progression:

```text
Agent read-only assessment
→ exact packet
→ Human Implementation GO
→ implementation
→ tests / CI
→ Draft PR
→ Human Merge GO
```

### LIVE / HIGH

Includes any:

```text
Microsoft Graph call against tenant
Entra mutation
SharePoint mutation
SharePoint permission change
App Catalog mutation
Deploy
production
real-account membership change
real tenant group creation
real list / column creation
conditional access change
secret / credential change
real data operation
```

Progression:

```text
Agent read-only assessment
→ exact mutation inventory
→ rollback plan
→ verification plan
→ Human Mutation GO
→ execute only authorized mutation
→ verify
→ evidence
→ STOP
```

No standing authorization for LIVE/HIGH.

## Fail-closed classification

```text
If ANY uncertainty exists about classification:
LOW → MEDIUM
MEDIUM → LIVE

Never downgrade risk automatically.
```

## Entry criteria（LOW standing lane）

All must be true after Human ACCEPT:

| # | Condition |
|---|---|
| E1 | FAST-LANE-V1 Human ACCEPT recorded |
| E2 | exact slice has Accepted / LOCKED authority |
| E3 | risk class = LOW under all rules above |
| E4 | unique next independent unit（selection rule） |
| E5 | dependencies satisfied |
| E6 | P0 = 0 and P1 = 0 |
| E7 | external I/O / live credential / tenant config not required |
| E8 | scope independently testable with synthetic fixtures |
| E9 | Issue ownership not crossed |

Any false / unknown → **STOP**（do not use FAST-LANE）。

## Stop conditions

Automatic LOW execution MUST stop if:

```text
P0 > 0
P1 > 0
baseline moved materially
Accepted authority is missing
Decision semantics are ambiguous
new business vocabulary would be invented
scope crosses Issue ownership
external I/O becomes necessary
live credential or tenant configuration becomes necessary
real data appears
test failure cannot be classified
more than one materially different next slice
UNKNOWN classification
```

Rule:

```text
UNKNOWN → HOLD
fail closed
```

## Selection authority

For LOW slices, Agent MAY choose the next slice without separate Human Selection
**only when all** are true（Acceptance 後）:

1. exactly one reasonable independent next unit; and
2. strictly within existing Accepted / LOCKED authority; and
3. no competing substantive business decision; and
4. dependencies already satisfied; and
5. work remains entirely repository-local.

If more than one materially different slice is available:

```text
STOP
→ Human Selection required
```

Do not use FAST-LANE to make product/business prioritization decisions.

## Implementation authority

| Class | Implementation Start |
|---|---|
| LOW（after FAST-LANE-V1 ACCEPT） | Standing authorization within Entry Criteria |
| MEDIUM | Explicit Human Implementation GO required |
| LIVE / HIGH | Explicit Human Mutation GO required；no standing auth |

```text
FAST-LANE-V1 ACCEPT ≠ MEDIUM Implementation Start
FAST-LANE-V1 ACCEPT ≠ LIVE Mutation GO
```

## Review requirements

Preferred LOW PR shape:

```text
Commit 1:
Selection / Acceptance / exact boundary

Independent Review against Commit 1

Commit 2+:
Implementation + tests + evidence

Draft PR:
full slice
```

Independent Review must identify the exact reviewed pre-implementation commit SHA.

Prefer **ONE PR per LOW implementation slice**.
Do **NOT** create separate Selection-only PR and Implementation PR unless required by
independent-review integrity.

## CI requirements

Before Ready recommendation / Human Merge shortcut:

```text
required CI green for the PR
typecheck / tests applicable to changed paths PASS
contracts boundary checks PASS when contracts paths change
P0 = 0
P1 = 0
no live mutation commands in CI
```

## Human Merge rule

Human Merge remains required for all classes.

### Human Merge shortcut（LOW only）

For LOW PRs, when **ALL** are true:

```text
HEAD unchanged
current main unchanged or safely mergeable
CI green
P0 = 0
P1 = 0
scope matches
review threads = 0
no live mutation
```

one Human:

```text
go
```

may authorize:

```text
Ready
→ HEAD / CI re-check
→ Merge
```

No additional Ready-only Human step required under those conditions.

This shortcut must **NOT** apply to MEDIUM or LIVE/HIGH unless separately authorized.

## Issue-status synchronization policy

Do not update stale Issue bodies after every PR.

Allow stale Issue-body markers as non-blocking **P2** when current truth is already preserved in:

```text
Accepted / LOCKED repository Decision docs
merged implementation evidence
current main
live PR state
```

Bundle Issue-body reconciliation periodically, such as:

```text
after 3–5 substantive merges
at parent-Issue close
before production/live gate
when stale body could cause an unsafe decision
```

Do not let stale-body cleanup block safe LOW work.

## Rollback

| Class | Rollback |
|---|---|
| LOW | normal PR revert on `main` |
| MEDIUM | PR revert + any follow-on docs correction under separate GO if needed |
| LIVE / HIGH | exact mutation rollback plan required before Mutation GO；never rely on PR revert alone |

## Examples（LOW）

```text
Accepted / LOCKED pure contracts representation + tests
Accepted domain validator + synthetic fixtures
mechanical export wiring under Accepted authority
docs-only Selection/Acceptance recording after explicit Human Decision text
```

## Non-examples（NOT LOW）

```text
Entra / Graph / SharePoint live I/O
group naming Decision invention
new Role / AccountStatus vocabulary
#4 tenant mutation
#21 live principal provider
#22 live adapter continuation requiring tenant I/O
#23 live E2E against tenant
Deploy / App Catalog
production / real staff accounts
competing next-slice prioritization
```

## Audit / evidence fields（required on LOW Draft PR）

Final PR must clearly state:

```text
FAST-LANE class: LOW
Selection authority
Implementation authority source
Independent Review SHA
implementation HEAD
P0 / P1 / P2
tests
scope
external I/O = 0
M365 / Entra / SharePoint mutation = 0
Human Merge = REQUIRED
```

## Conflict register（candidate）

| ID | Current authority | After hypothetical ACCEPT | Handling |
|---|---|---|---|
| FL1-C1 | Routine AUG: next slice selection = HUMAN-ONLY | LOW unique-slice AUTO selection | **scoped exception only** if Human ACCEPT says so |
| FL1-C2 | Routine AUG: per-slice Start REQUIRED | LOW standing Start | **scoped exception only** if Human ACCEPT says so |
| FL1-C3 | PROCESS-OPT-V1: LOW auto-loop NOT ENABLED | standing LOW lane ACTIVE | **enablement Decision**；does not rewrite PROCESS-OPT text |
| FL1-C4 | LOW-AUTO-PILOT-V1: pilot envelope | standing lane broader than pure-domain pilot | **new Decision**；pilot doc unchanged |
| FL1-C5 | Ready HUMAN-ONLY | Merge shortcut may collapse Ready+Merge for LOW | Ready auto still NOT ACCEPTED as free-standing automation |
| FL1-C6 | Merge HUMAN-ONLY | Merge HUMAN-ONLY | **NO CHANGE** |
| FL1-C7 | AUTONOMY-POLICY-V1 NOT ENABLED | unchanged | **NO Gateway enablement** |

## Explicit non-claims（this candidate）

```text
standing authorization already granted: NO
FAST-LANE active: NO
automatic merge: NO
Entra / SharePoint / M365 mutation: NO
Deploy: NO
Issue Close: NO
AUTONOMY-POLICY-V1 enablement: NO
DEC-013 / DEC-014 acceptance: NO
```

## Next（Human only）

1. Human Decision 1: **FAST-LANE-V1 ACCEPT / HOLD**
2. If ACCEPT: record Acceptance in this document + selection packet；then first LOW slice may use standing lane
3. If HOLD: keep CANDIDATE / NOT YET ACTIVE；continue Routine AUG / explicit Start model
