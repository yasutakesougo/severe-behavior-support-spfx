# ORIGIN-EVALUATION-1 — Selection / Human Decision Packet

この文書は、**ORIGIN-EVALUATION-1** の選定・Human Decision パケットである。

Canonical SoT:
[`origin-evaluation-1.md`](./origin-evaluation-1.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: ORIGIN-EVALUATION-1
Kind: docs-only governance evaluation Decision packet
Status: REVIEWABLE / READY FOR HUMAN ACCEPTANCE
Human Decision: NOT YET GRANTED
Authorization effect: NONE
Origin enablement: NOT AUTHORIZED
GitHub → Origin mirror: NOT AUTHORIZED
Detach from GitHub: FORBIDDEN
Ready / Merge: HUMAN-ONLY
SharePoint / M365 / Entra / Deploy: FORBIDDEN
Baseline main: 3df1d44760343f4eaed4ad0cdfeff214ae8337eb
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`../process/self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Why this unit now

| Input | State |
|---|---|
| Cursor Origin | 公式: Compile 2026 で 「a new Git platform」。docs 上は early beta git forge |
| GitHub の現行役割 | PR / Review / Issues / CI / main SHA / Human GO 拘束の governance SSOT |
| DEC-AI-ORG-003 | 承認済み。Merge = 人の事前承認。緩和しない |
| STAFF-CONFIDENCE | 保守エージェントは read-only first。mutation 前に Human GO |
| 危険 | Origin を GitHub 代替と誤認し、ガバナンス正本を移すこと |

## Duplicate-policy assessment

```text
duplicate existing policy: NO
owns: Git hosting / governance SSOT の評価境界（既存 DEC は GitHub 操作区分のみ）
recommended handling:
  do not rewrite DEC-AI-ORG-003 / permission-matrix
  do not enable Origin
  lock GitHub authoritative + Origin shadow evaluation
recommended status:
  READY FOR HUMAN ACCEPTANCE
```

## Proposed Human Decision text（Decision 1）

Human may paste / authorize exactly:

```text
Human Decision 1 — ORIGIN-EVALUATION-1 ACCEPT

I ACCEPT ORIGIN-EVALUATION-1.

Meaning:
  GitHub remains the authoritative repository and governance SSOT.
  Origin is an evaluation candidate only, used as a shadow environment
  if a later Human GO authorizes GitHub→Origin sync.
  This is not a GitHub migration.
  Evaluation items OE-1..5 stay OPEN until evidenced on this repository.
  Detach from GitHub remains FORBIDDEN.
  DEC-AI-ORG-003 and the permission matrix are not relaxed.

Explicitly NOT authorized by this Decision:
  Origin enablement / codebase name claim
  GitHub App admin mirror / sync
  Detach from GitHub
  Origin-hosted repo as SSOT
  Origin merge / force-push / Ready
  Agent merge on Origin
  replacing GitHub PR / Issue / main SHA identifiers
  permission-matrix expansion
  SharePoint / Entra / M365 / Deploy / production
  Issue Close

Fail-closed:
  UNKNOWN → HOLD
  POST / news ≠ CONFIRMED
  5 evaluation items CONFIRMED ≠ GitHub abandonment GO
```

HOLD alternative:

```text
Human Decision 1 — ORIGIN-EVALUATION-1 HOLD

Do not lock ORIGIN-EVALUATION-1.
Keep GitHub as the only recorded source-control SSOT.
Do not add Origin as an architecture evaluation surface in this recording.
Do not enable Origin, mirror, or Detach.
```

## Accepted intent（only after Human ACCEPT）

```text
Add Origin as a shadow evaluation surface to the current architecture
without moving governance SSOT off GitHub.
```

## Boundary

```text
ACCEPT ORIGIN-EVALUATION-1 ≠ Origin already enabled
ACCEPT ≠ GitHub→Origin sync started
ACCEPT ≠ Ready / Merge of this recording PR by itself
ACCEPT ≠ Implementation Start
ACCEPT ≠ GitHub abandonment
```

## Evidence fields for later Acceptance recording

When Human ACCEPT occurs, record at minimum:

```text
Decision ID: Decision-ORIGIN-EVALUATION-1
Status: ACCEPTED / LOCKED or HOLD
Human Decision date
baseline SHA
OE-1..5 remain OPEN
Origin enablement = NOT AUTHORIZED
Detach = FORBIDDEN
permission expansion = NONE
Merge remains HUMAN-ONLY on GitHub
```

Agent は Human 文面なしに Acceptance 文書を Accepted / LOCKED で作成しない。

## Findings at packet freeze

```text
P0: 0
P1: 0
P2:
  OE-P2-1 OPEN — retention / backup / region UNKNOWN
  OE-P2-2 OPEN — GitHub Issues are not mirrored
  OE-P2-3 OPEN — Origin API does not reach GitHub-mirrored repos
```

## Next

```text
1. Human Decision 1: ORIGIN-EVALUATION-1 ACCEPT / HOLD
2. If ACCEPT: record Acceptance against this packet; do not start Origin enablement
3. Do not treat this Draft PR merge alone as Origin authorization
```
