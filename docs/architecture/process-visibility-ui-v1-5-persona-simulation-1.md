# PROCESS-VISIBILITY-UI-V1 — 5 Persona Simulation 1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: PROCESS-VISIBILITY-UI-V1
kind: 5 Persona Simulation（presentation prototype）
prototype: docs/architecture/process-visibility-ui-v1-presentation-prototype-1.md
acceptance probes: Definition §8 T1–T5
date: 2026-09-03
verdict: PASS WITH MINOR FRICTION（SIMULATION EVIDENCE ONLY）
Human Visual Acceptance: NOT RECEIVED
Actual Staff Process-Comprehension Check: NOT YET / NOT AUTHORIZED BY THIS DOC
Implementation Start: NOT AUTHORIZED
mutation: 0
```

## 1. Boundary

```text
5 Persona Simulation
!= Actual Staff Process-Comprehension Check
!= Human Visual Acceptance
!= Implementation Start
!= Ready / Merge / Deploy
```

## 2. Personas × T1–T5

Synthetic walkthrough against Desktop + Mobile prototype only.

| Persona | Psychological state | T1 版3適用中 | T2 ②③④区別 | T3 ⑤理由 | T4 ⑥CTA | T5 Draft≠適用 | Friction |
|---|---|---|---|---|---|---|---|
| P1 経験計画担当 | calm / scanning | YES | YES | YES | YES | YES | none |
| P2 新人計画担当 | slightly lost at first | YES | YES after nav | YES | YES | YES | looks for「計画」in old 5-item nav habit → finds 6-item |
| P3 忙しい計画担当 | time-pressured | YES | YES via nav jump | YES | YES | YES | scrolls past 履歴・詳細 if not demoted enough |
| P4 現場兼務 | field-biased | YES | PARTIAL（③④ close） | YES | YES | YES | Monitoring still near records; Header must stay strong |
| P5 監査寄り観察 | skeptical | YES | YES | YES | YES | YES | checks ADMIN_AUDIT unchanged（out of V1） |

## 3. Aggregate

```text
T1–T5 YES dominant
P2 / P3 / P4 = UI_FRICTION only（not lifecycle NO）
P0 = 0
P1 = 0（simulation）
```

```text
PASS WITH MINOR FRICTION
= Process ownership readable
= #576 lifecycle placeholders not misread as 適用中
= still requires Human Visual Acceptance + later Actual Staff Check
```

## 4. Findings（simulation）

| ID | Severity | Content | Disposition |
|---|---|---|---|
| S-PV-001 | P2 | Mobile 2×3 nav labels may truncate「モニタリング」 | Keep short labels; verify in RBA 390×844 |
| S-PV-002 | P2 | ③/④ adjacency risk if Process Header weight is weak | Scope must require distinct Process Header before MonitoringView |
| S-PV-003 | P2 | 履歴・詳細 demotion without Accordion may still feel long | Accept for V1; Accordion = V1.1 only |

## 5. NEXT

```text
Human Visual Acceptance
↓
PHASE 3 Implementation Scope → Ponytail → Independent Scope Review
↓
Human Implementation Start GO（requires #576 Merged）
```
