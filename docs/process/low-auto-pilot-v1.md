# LOW-AUTO-PILOT-V1 — Limited LOW Auto-Loop Pilot

- 文書: `docs/process/low-auto-pilot-v1.md`
- Unit: **LOW-AUTO-PILOT-V1**
- 位置づけ: PROCESS-OPT-V1 の下位 **限定試行 enablement Decision 正本（Human Acceptance 記録）**
- 状態: **ACCEPTED**（LA1-A Option A）
- Human Decision: **LA1-A — Option A = ACCEPT**（2026-08-10）
- 上位正本（グローバル本文を書き換えない）:
  - `docs/decisions/DEC-AI-ORG-003.md`
  - `docs/decisions/DEC-AA-001.md`
  - `docs/decisions/DEC-AA-003.md`
  - `docs/process/routine-aug-v1.md`
  - `docs/process/process-optimization-v1.md`（PROCESS-OPT-V1 / ACCEPTED / LOCKED）
- 関連:
  - Selection: [`../architecture/decision-low-auto-pilot-v1-selection.md`](../architecture/decision-low-auto-pilot-v1-selection.md)
  - Independent Review: [`../architecture/decision-low-auto-pilot-v1-independent-review.md`](../architecture/decision-low-auto-pilot-v1-independent-review.md)

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](./self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
LA1-A — Option A
= ACCEPT
```

```text
LOW-AUTO-PILOT-V1:
LA1-A Option A = ACCEPTED
Pilot policy:
ACCEPTED
Pilot execution:
NOT STARTED
Implementation:
DO NOT START YET
Ready:
HUMAN-ONLY
Merge:
HUMAN-ONLY
SharePoint / M365:
UNCHANGED / FORBIDDEN
Deploy:
FORBIDDEN
```

```text
Agent recommendation / Independent Review: NOT Human Acceptance evidence
This document records the Human Decision only.
LA1-A ACCEPT ≠ pilot execution started
LA1-A ACCEPT ≠ Ready / Merge of this recording PR
LA1-A ACCEPT ≠ Routine AUG / DEC-AA global rewrite
```

## Accepted intent

```text
Enable a limited LOW auto-loop pilot
for pure-domain implementation slices only.
```

## Accepted pilot envelope

### Eligible（すべて必須）

```text
Accepted / LOCKED authority
LOW classification
domain type
runtime validator
pure domain function
domain / contract tests
mechanical export wiring
```

### Pilot capacity

```text
2–4 LOW slices
1 batch maximum
post-pilot Human review required
巨大 PR 禁止
slice 単位の failure attribution 維持
```

### Auto within pilot envelope（execution 開始後のみ）

```text
eligible next LOW slice selection when unique
per-slice Implementation Start
scoped implementation
mechanical verification
bounded repair (max 3)
Independent Review
```

### Explicitly excluded from eligible / auto

```text
DTO wiring
adapter logic
SupportPlan union/schema wiring
MEDIUM / HIGH work
SharePoint / M365
permission mutation
real data
Deploy
destructive action
制度解釈 / 新規業務語彙 / FindingCode value invention
project-wide Implementation Start
Ready auto
Merge auto
```

## Scoped exceptions accepted（pilot only）

Routine AUG に対する **限定例外**（本 pilot のみ）:

```text
next slice selection:
HUMAN-ONLY
→ pilot-scoped AUTO when exactly one eligible LOW slice exists

per-slice Implementation Start:
HUMAN REQUIRED
→ pilot-scoped AUTO for eligible LOW slices
```

```text
These are pilot-scoped exceptions only.
They do NOT rewrite Routine AUG globally.
Routine AUG / DEC-AA 本文は本 Acceptance で上書きしない。
```

## Human-only remains

```text
Ready:
HUMAN-ONLY
Merge:
HUMAN-ONLY
HIGH decisions:
HUMAN-ONLY
permission expansion:
HUMAN-ONLY / outside pilot
Issue mutation:
HUMAN-ONLY
new Decision Acceptance:
HUMAN-ONLY
SharePoint / M365 mutation:
FORBIDDEN
Deploy:
FORBIDDEN
```

```text
Ready auto is explicitly NOT accepted by this Decision.
Merge auto is explicitly NOT accepted.
```

## Mandatory STOP / HOLD

Pilot must stop immediately on:

```text
UNKNOWN
authority conflict
scope ambiguity
non-unique next slice
P0
P1
semantic failure
SharePoint / M365 dependency
permission change
real data
destructive action
MEDIUM / HIGH scope
DTO / adapter / schema-adjacent expansion
new business-rule interpretation
FindingCode value invention
```

Rule:

```text
UNKNOWN → HOLD
```

## Explicit exclusions（本 Acceptance が認可しないこと）

```text
implementation now
pilot execution now
Ready
Merge
SharePoint / M365
Deploy
real data
permission mutation
DTO wiring
adapter logic
SupportPlan union/schema wiring
MEDIUM / HIGH work
project-wide Implementation Start
Routine AUG global rewrite
DEC-AA global rewrite
```

## Conflict register

| ID | Current authority | After LA1-A ACCEPT | Handling |
|---|---|---|---|
| LA1-C1 | Routine AUG: next slice selection = HUMAN-ONLY | pilot-scoped AUTO when unique eligible LOW | **ACCEPTED SCOPED EXCEPTION** — 全体上書きしない |
| LA1-C2 | Routine AUG: per-slice Human Start REQUIRED | pilot-scoped AUTO for eligible LOW | **ACCEPTED SCOPED EXCEPTION** |
| LA1-C3 | PROCESS-OPT-V1: LOW auto-loop NOT ENABLED | pilot policy ACCEPTED；execution NOT STARTED | **pilot enablement path** |
| LA1-C4 | Ready HUMAN-ONLY | Ready HUMAN-ONLY | **NO CHANGE** — Ready auto NOT accepted |
| LA1-C5 | Merge HUMAN-ONLY | Merge HUMAN-ONLY | **NO CONFLICT** |

## P2 disposition

Preserve all six P2 findings as OPEN.

```text
P0 = 0
P1 = 0
P2 = 6 OPEN
```

```text
LA1-P2-1: OPEN — scoped exception operational inheritance（記録済み；偽クローズしない）
POV1-P2-1: OPEN — may be exercised only as accepted pilot-scoped next-slice exception
POV1-P2-2: OPEN — may be exercised only as accepted pilot-scoped Start exception；Ready 部分は未採択
AA3-P2-1: OPEN carry-forward / unresolved
AA3-P2-2: OPEN carry-forward / unresolved
AA3-P2-3: OPEN carry-forward / unresolved
```

Acceptance does not falsely close them.

## 効力 / 非効力

### 効力

- LA1-A Option A pilot **policy** = ACCEPTED
- pure-domain LOW envelope + STOP / Human-only / capacity を固定
- Routine AUG に対する 2 つの pilot-scoped exceptions を Accepted として記録

### 非効力

```text
Pilot execution: NOT STARTED
Implementation: DO NOT START YET
Ready / Merge authorization for recording PR: NOT granted by Acceptance alone
GLOBAL Routine AUG rewrite: NO
GLOBAL DEC-AA rewrite: NO
```

## 次工程（Human only）

1. 本 Acceptance recording の Independent Review / verification（本 unit）
2. Human Ready Decision for PR #203（自動 Ready しない）
3. Human Merge Decision（自動 Merge しない）
4. 別 Human GO: pilot execution / first eligible slice Start（Acceptance ≠ execution）

## Independent Review

正本: [`../architecture/decision-low-auto-pilot-v1-independent-review.md`](../architecture/decision-low-auto-pilot-v1-independent-review.md)
