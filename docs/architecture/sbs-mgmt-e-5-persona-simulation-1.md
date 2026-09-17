# SBS-MGMT-E — 5 Persona Simulation 1（current-main rebaseline）

```text
STATUS: HISTORICAL / SUPERSEDED PIN
unit: SBS-MGMT-E-633-EVIDENCE-SALVAGE-1 source packet
source PR: #633 (OPEN / DRAFT / mergeable=CONFLICTING)
basis HEAD: ac6b3d665b0e514852775b5b58f5f9e254d107ae
canonical salvage: docs/architecture/sbs-mgmt-e-633-evidence-salvage-1.md
Evidence type: SIMULATION ONLY
Do not use this file as Actual Staff Value Check or current-main gate pin.
```

## Original simulation (pin ac6b3d66)

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-E (#556)
kind: 5 Persona Simulation / Process-Comprehension (SIMULATION EVIDENCE ONLY)
basis HEAD: ac6b3d665b0e514852775b5b58f5f9e254d107ae
matrix authority: docs/architecture/understanding-test-matrix-version-management-v1.md
loop-b application: docs/architecture/sbs-mgmt-loop-b-understanding-test-matrix-v1.md
rebaseline packet: docs/architecture/sbs-mgmt-e-current-main-acceptance-rebaseline-1.md
date: 2026-09-16
mode: READ-ONLY / synthetic surfaces + prior locked copy
product mutation: 0 (simulation packet only)
verdict: PASS WITH MINOR FRICTION（SIMULATION EVIDENCE ONLY）
P0 = 0
P1 = 0
P2 = 2（non-blocking）
Actual Staff Human Apply Path A: NOT SUBSTITUTED / STILL REQUIRED
CORE LOOP VALUE DISPOSITION: NOT AUTHORIZED BY THIS DOC
Deploy / LIVE WRITE: NOT AUTHORIZED
```

## 1. Scope

Closed-loop Planning-PC comprehension across:

```text
Monitoring / Human Review
→ RevisionIntent / Draft vN+1
→ explicit Human Apply
→ SupportPlan.currentVersion transition
→ Management Home current applied
```

Personas (shared vocabulary):

| ID | Persona |
|---|---|
| P1 | 経験計画担当 |
| P2 | 新人計画担当 |
| P3 | 忙しい計画担当 |
| P4 | 現場兼務 |
| P5 | 監査寄り観察 |

```text
Simulation PASS != Actual Staff Value Check PASS
Simulation != Human Apply Path A T1–T5 answers
```

## 2. Probe set

### Closed-loop probes

| ID | Question | Expect |
|---|---|---|
| L1 | 誰の・どの計画版を見直しているか | identity + planVersion visible |
| L2 | 見直し根拠は何か | Monitoring / materials factual; 0件 ≠ 実施できなかった |
| L3 | 見直し結果と判断理由は何か | Human decision + reason when CHANGE_REQUIRED |
| L4 | CHANGE_REQUIRED の次操作は何か | explicit revision-start / Draft create — not automatic Apply |
| L5 | Draft は適用済みか | NO — Draft ≠ Applied |
| L6 | Human Apply 後の現在版は何か | currentVersion advanced; prior immutable |
| L7 | Management Home の現在状態 | current applied from SupportPlan.currentVersion |

### Apply transition probes（Correction-2 Path A mirror — simulation only）

| ID | Question | Expect |
|---|---|---|
| T1 | 今使っている計画は何版か | current applied version |
| T2 | 次の版はどの状態か | Draft / 未適用 |
| T3 | 次の版を使い始めるために何が必要か | explicit Human Apply |
| T4 | Apply 後、現在版が切り替わったか | YES |
| T5 | 旧版はどうなったか | prior immutable history |

## 3. Persona results（simulation）

| Persona | L1–L5 | L6–L7 / T1–T5 | Friction | Severity |
|---|---|---|---|---|
| P1 経験計画担当 | YES | YES | low | — |
| P2 新人計画担当 | YES / PARTIAL on L4 CTA wording | PARTIAL on T3 until Apply CTA found | CTA label scan cost | P2 |
| P3 忙しい計画担当 | YES | YES / PARTIAL on T2 Draft vs Applied skim | skims Home cards | P2 |
| P4 現場兼務 | YES on L2 zero-record distinction | YES on T1/T4 after Apply | FIELD_STAFF chrome not primary surface | — |
| P5 監査寄り観察 | YES | YES on immutability / identity fail-closed | wants stronger Apply receipt wording | P2 candidate only |

Aggregate:

```text
P0 = 0
P1 = 0（現行版特定不能 / Draft を適用済みと誤認 / Apply なしで版が進む は観測せず）
P2 = 2
  - Draft create CTA / Apply CTA 語対応の探索コスト（P2）
  - Draft ≠ Applied の明示は操作後に強いが、初見スキムでは PARTIAL になりやすい（P2）
```

## 4. Case C note（STATE-DISTINCTION）

Post-`efb5ef9c` Monitoring / Human Review copy states:

```text
0件であることは、「実施できなかった」という結果を意味しません。
```

Simulation: all personas keep L2 factual for zero-record; no automatic CHANGE_REQUIRED / NOT_PERFORMED inference observed on synthetic surfaces.

## 5. Verdict

```text
5 Persona Simulation @ ac6b3d66 = PASS WITH MINOR FRICTION
Evidence type = SIMULATION ONLY
#556 Human Apply Actual Staff Path A = HOLD / REQUIRED
CORE LOOP VALUE DISPOSITION = HOLD
```

Historical only. Salvage overlay (CORR-1 copy landed after this SIM) is in [`sbs-mgmt-e-633-evidence-salvage-1.md`](./sbs-mgmt-e-633-evidence-salvage-1.md).

## 6. Boundaries

```text
This packet does not authorize:
- Actual Staff PASS
- Human Acceptance disposition
- Ready / Merge / Deploy / LIVE WRITE
- Issue close
- Merge of PR #633
```
