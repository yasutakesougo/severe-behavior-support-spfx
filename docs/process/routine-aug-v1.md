# Routine AUTO-UNTIL-GATE v1 — Operating Model

- 文書: `docs/process/routine-aug-v1.md`
- 位置づけ: **Routine AUG v1** の標準運用モデル正本（Human Adoption 記録）
- 状態: **ACCEPTED / LOCKED / ADOPTED**
- Human Decision: **Option R1 — ACCEPTED / LOCKED**（2026-08-10）
- 上位正本（緩和しない）:
  - `docs/decisions/DEC-AA-001.md`（Auto-Approval Policy v1 / Option A）
  - `docs/decisions/DEC-AA-003.md`（AUTO-UNTIL-GATE Policy v1 / Option A3-1）
  - `docs/decisions/DEC-AI-ORG-003.md`
- 入力: AUG-PILOT-1 PASS；Routine AUG v1 Human Adoption Decision；Canonical Recording GO
- 前提:
  - `AUTO_APPROVAL` 運用状態 = **ENABLED**（DEC-AA-001 Option A scope のみ）
  - `AUTO_UNTIL_GATE` 運用状態 = **ENABLED**（別 Human GO 済み）
  - **Project-wide Implementation Start = NOT GRANTED**
  - **Per-slice Implementation Start = REQUIRED**
  - Phase ② / Issue #6 / #8 = OUT OF SCOPE

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](./self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Routine AUG v1: ACCEPTED / LOCKED / ADOPTED
Option: R1 — Adopt Routine AUG
Qualification evidence: AUG-PILOT-1 / OP-3-DOMAIN-LOGICAL-SCHEMA-V1 / COMPLETE
Resulting main: c58440c8840dee1c5a65fc5158ef13d93bb2d726
```

```text
Agent recommendation / Independent Review: NOT Human Acceptance evidence
This document records the Human Decision only.
```

## 本記録が決める対象

Routine AUG v1 は、**eligibility gate を独立に満たす implementation slice** に対する標準運用モデルである。

DEC-AA-001 / DEC-AA-003 の action class を **拡張しない**。
既存 workflow の **標準化** のみを記録する。

## 本記録が決めない / 承認しないこと

| 対象外 | 扱い |
|---|---|
| Project-wide Implementation Start | **NOT GRANTED** |
| 次 slice の自動選定 | HUMAN-ONLY |
| eligibility 未充足 slice の AUG 実行 | FORBIDDEN |
| GitHub publication / branch / commit / push / Draft PR | HUMAN-ONLY（別 GO） |
| Ready / Merge | HUMAN-ONLY（別 GO） |
| Issue mutation / Decision Acceptance | HUMAN-ONLY |
| M365 / SharePoint / schema / permission / Deploy | FORBIDDEN |
| AA3-P2-1 / AA3-P2-2 / AA3-P2-3 の解消 | OPEN のまま |

```text
Routine AUG ADOPTED ≠ project-wide Implementation Start
AUTO_UNTIL_GATE_ENABLED ≠ Implementation Start
Routine AUG adoption ≠ eligibility condition 12（exact-slice Start）
Independent Review PASS ≠ GitHub publication authorization
CI PASS ≠ Ready
Ready ≠ Merge authorization
```

## Standard workflow

eligible slice に限り:

```text
Human:
  select exact substantive slice
        ↓
Human:
  Exact-slice Implementation Start GO
        ↓
Agent:
  scoped local implementation
        ↓
  mechanical verification
        ↓
  bounded repair <= 3
        ↓
  re-verification
        ↓
  Independent Review
        ↓
  STOP
        ↓
Human:
  GitHub publication decision
        ↓
Human:
  Ready decision
        ↓
Human:
  Merge decision
```

approved envelope 内の local Agent loop 中に、**繰り返し Human GO は不要**。

## Routine AUG eligibility gate（12 条件すべて必須）

future slice が Routine AUG に入れるのは、次が **すべて** 独立に真の場合のみ。

| # | Condition |
|---|---|
| 1 | Accepted specification exists |
| 2 | exact implementation slice is explicit |
| 3 | acceptance criteria are testable |
| 4 | no unresolved HOLD blocks the exact slice |
| 5 | no new Decision is required |
| 6 | allowed_paths are explicit |
| 7 | base_sha is bound |
| 8 | no M365 / production write is required |
| 9 | no schema mutation is required |
| 10 | no security-boundary mutation is required |
| 11 | external_write_permissions = NONE |
| 12 | exact-slice Human Implementation Start exists |

```text
any failed condition → HOLD
any uncertain condition → UNKNOWN → HOLD
Agent must not reinterpret an ineligible slice as eligible
Routine AUG adoption does NOT satisfy condition 12
```

## Implementation Start semantics

Every substantive slice still requires:

```text
Human Explicit Implementation Start GO
```

bound to:

- exact unit
- exact base SHA
- allowed paths
- governing Accepted authority
- acceptance tests
- stop gate

Completed slice Start authority is **consumed on completion**.
It must **not** be reused for another unit.

## Agent autonomous boundary

valid exact-slice Start 後、Agent が自律実行してよいのは次のみ:

```text
scoped local repository edits
mechanical verification
bounded implementation-local repair
re-verification
Independent Review execution
```

```text
max_repair_cycles = 3
then STOP → Human GitHub publication decision
```

## Human boundaries（HUMAN-ONLY）

```text
substantive slice selection
exact-slice Implementation Start
GitHub publication
branch / commit / push authorization
Draft PR creation/update authorization
Ready for Review
Merge
Issue mutation
Decision creation / Acceptance
scope expansion
security-boundary change
```

Routine AUG v1 does not relax these boundaries.

## Mandatory exclusions

Routine AUG v1 must not be used for:

```text
Phase ② recovery
Issue #6 / #8 reconciliation
Issue mutation
Decision creation or Acceptance
new policy decisions
SharePoint schema mutation
Microsoft 365 write
permission / tenant mutation
secret / credential mutation
production data access/write
Deploy / production release
security-boundary changes
```

These remain separately governed unless a later Human-Accepted policy says otherwise.

## GitHub publication boundary

Routine AUG local execution **stops before GitHub publication**.

Publication, Ready, and Merge remain **separate Human decisions**.

## Pilot qualification evidence（AUG-PILOT-1）

```text
Pilot: OP-3-DOMAIN-LOGICAL-SCHEMA-V1
Result: COMPLETE
Resulting main: c58440c8840dee1c5a65fc5158ef13d93bb2d726
Success criteria: 16 / 16 PASS
Repair cycles: 1 / 3
Independent Review: PASS
P0=0 / P1=0 / P2=0
M365 writes: 0
Deploy: 0
Phase ② mutation: 0
```

Do not generalize this evidence beyond the Routine eligibility gate.
Higher-risk slice classes may require additional qualification or Human policy decisions later.

## Existing policy relationship

| Policy | Relationship |
|---|---|
| DEC-AA-001 Option A | AUTO scope の上位。Routine AUG はこれを緩和しない |
| DEC-AA-003 Option A3-1 | AUG loop / repair / stop-before-GitHub の上位。Routine AUG はこれを緩和しない |
| DEC-AI-ORG-003 | 最上位。矛盾時は **HOLD**。本 recording では解消しない |

## OPEN P2（解消しない）

```text
AA3-P2-1: OPEN — DEC-AI-ORG-003 vs AA-3 v1 path priority
AA3-P2-2: OPEN — background-agent-contract verification vs Start wording
AA3-P2-3: OPEN — development-process vs DEC-AI-ORG-003 M365 wording
```

Routine AUG adoption does not close, downgrade, or silently rewrite these findings.

## Independent Review

正本: [`../architecture/decision-routine-aug-v1-independent-review.md`](../architecture/decision-routine-aug-v1-independent-review.md)
