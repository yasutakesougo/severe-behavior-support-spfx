# AUTO-1 — AUTONOMY-POLICY-V1 Human Acceptance

この文書は、**AUTO-1 — AUTONOMY-POLICY-V1** についての Human Acceptance 正本である。

Canonical process SoT: [`../process/autonomy-policy-v1.md`](../process/autonomy-policy-v1.md)  
Machine-readable SoT: [`../process/autonomy-policy-v1.json`](../process/autonomy-policy-v1.json)  
Selection: [`decision-autonomy-policy-v1-selection.md`](./decision-autonomy-policy-v1-selection.md)  
Packet: [`decision-autonomy-policy-v1-packet.md`](./decision-autonomy-policy-v1-packet.md)  
IR: [`decision-autonomy-policy-v1-independent-review.md`](./decision-autonomy-policy-v1-independent-review.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: AUTO-1 — AUTONOMY-POLICY-V1
Human Decision: AP1-A = ACCEPT
Status: ACCEPTED / LOCKED
Human Acceptance date: 2026-08-10
Initial Candidate HEAD: cff443813a9dade839f1e06a0af88bb6a6da3ece
Kind: docs-only Acceptance recording
Authorization effect: NONE
Permission expansion: NONE
Implementation Start: NOT GRANTED
```

## Human Decision recorded

```text
AP1-A = ACCEPT
```

```text
AUTO-1 AUTONOMY-POLICY-V1:
ACCEPTED / LOCKED
```

```text
Agent recommendation / Independent Review: NOT Human Acceptance evidence
This document records the Human Decision only.
AP1-A ACCEPT ≠ Implementation Start
AP1-A ACCEPT ≠ Capability Registry / Task Packet / Action Gateway / Cursor backend code
AP1-A ACCEPT ≠ LOW-AUTO-PILOT-V2 enablement
AP1-A ACCEPT ≠ Ready / Merge of this recording PR
AP1-A ACCEPT ≠ AssessmentSnapshot EC-3 / EC-4 resolution
```

## Accepted contract surfaces

1. Capability taxonomy: `AUTO_ALLOWED` candidate / `HUMAN_ONLY` / `FORBIDDEN`
2. Initial AUTO_ALLOWED candidate set（taxonomy only；≠ enabled）
3. HUMAN_ONLY / Gateway-forbidden capability set（`pull_request.merge` 非搭載を含む）
4. Fail-closed: `UNKNOWN → DENY`；result = `ALLOW | DENY`
5. Baseline binding: exact `baselineSha`；mismatch → `BASELINE_MOVED`
6. allowedPaths enforcement；missing / outside → `OUT_OF_SCOPE`
7. Risk: `LOW | MEDIUM | HIGH`；`UNKNOWN risk → DENY`；DEC-AA / PROCESS-OPT / Routine AUG 非緩和
8. Approval: CI PASS / IR PASS / Decision Accepted ≠ Start；FORBIDDEN は approval-like でも DENY
9. Audit required fields / forbidden-to-record fields
10. Gateway evaluation order（capability → … → idempotency → ALLOW）
11. Negative tests N1–N5 required before LOW-AUTO-PILOT-V2（test code ≠ this Acceptance）

## Cursor backend boundary

```text
AUTO-1: language-agnostic execution backend contract
AUTO-8: TypeScript SDK first（NOT STARTED by this Acceptance）
```

## Lane separation（UNCHANGED）

```text
Lane A — AssessmentSnapshot
  AIS-1-B = ACCEPTED / LOCKED
  EC-3 + EC-4 = PENDING
  Implementation Start = HOLD

AUTO-1 MUST NOT:
  resolve / skip EC-3 or EC-4
  start AssessmentSnapshot adapter
  DTO / schema wiring
  SharePoint mutation
```

## Authorization effect

```text
AUTO-1 policy: ACCEPTED / LOCKED
Implementation Start: NOT GRANTED
Capability Registry implementation: NOT STARTED
Task Packet implementation: NOT STARTED
Action Gateway implementation: NOT STARTED
Cursor SDK Runner: NOT STARTED
LOW-AUTO-PILOT-V2: NOT AUTHORIZED
Ready auto: NOT AUTHORIZED
Merge auto: NOT AUTHORIZED
SharePoint / M365: UNCHANGED / FORBIDDEN
Deploy: FORBIDDEN
Permission expansion: NONE
```

## P2 disposition

```text
P0 = 0
P1 = 0
AP1-P2-1: OPEN
AP1-P2-2: OPEN
carry-forwards: remain OPEN（偽クローズしない）
```

## Next

```text
1. Acceptance IR / mechanical consistency on recording HEAD
2. Draft PR publication（Human GO already granted for Draft only）
3. Human Ready Decision（NOT authorized by Acceptance alone）
4. Human Merge Decision（NOT authorized）
5. Parallel Lane A: EC-3 + EC-4
6. Next OS unit after separate GO: AUTO-2 Capability Registry
```
