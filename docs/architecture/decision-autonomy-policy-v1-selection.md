# AUTO-1 — AUTONOMY-POLICY-V1 Selection / Decision Packet

この文書は、**AUTO-1 — AUTONOMY-POLICY-V1** の選定パケットである。

Canonical process SoT: [`../process/autonomy-policy-v1.md`](../process/autonomy-policy-v1.md)  
Machine-readable SoT: [`../process/autonomy-policy-v1.json`](../process/autonomy-policy-v1.json)  
Acceptance: [`decision-autonomy-policy-v1-acceptance.md`](./decision-autonomy-policy-v1-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: AUTO-1 — AUTONOMY-POLICY-V1
Kind: docs-only machine-decidable policy contract / Human Acceptance recording
Status: SELECTED / CONSUMED / ACCEPTED / LOCKED
Human Decision: AP1-A = ACCEPT（2026-08-10）
Policy Accepted: YES（contract only）
Implementation: DO NOT START / NOT GRANTED
Authorization effect: NONE
Permission expansion: NONE
Ready: HUMAN-ONLY / NOT AUTHORIZED by Acceptance
Merge: HUMAN-ONLY / NOT AUTHORIZED by Acceptance
SharePoint / M365: UNCHANGED / FORBIDDEN
Deploy: FORBIDDEN
LOW-AUTO-PILOT-V2: NOT AUTHORIZED
Initial Candidate HEAD: cff443813a9dade839f1e06a0af88bb6a6da3ece
Baseline main at selection:
  5bbe912d0e5e127cf1846bb0edf5ddff24ca99a0
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`../process/self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Why this unit now

| Input | State |
|---|---|
| DEC-AI-ORG-003 | 承認済み（権限境界上位） |
| DEC-AA-001 / DEC-AA-003 | Accepted / LOCKED |
| PROCESS-OPT-V1 | ACCEPTED / LOCKED；LOW auto-loop DEFINED / NOT ENABLED |
| LOW-AUTO-PILOT-V1 | LA1-A ACCEPTED；Pilot execution NOT STARTED |
| Cursor programmatic Agent runtime | TypeScript SDK 公式確認済み（backend 抽象で扱う） |
| Codex independent review path | Builder / Reviewer 分離の根拠として妥当 |
| AssessmentSnapshot adapter | AIS-1-B ACCEPTED；EC-3 / EC-4 Decision 待ち；別レーン |

## Selected unit

```text
AUTO-1 — AUTONOMY-POLICY-V1
= machine-decidable autonomy policy contract only
≠ Cursor SDK Runner implementation
≠ AssessmentSnapshot adapter EC-3 / EC-4
```

## Options disposition

| Option | Content | Result |
|---|---|---|
| **AP1-A** | AUTONOMY-POLICY-V1 契約を本正本どおり固定 | **ACCEPTED / LOCKED** |
| AP1-B | Cursor SDK Runner を先に実装 | NOT SELECTED |
| AP1-C | AssessmentSnapshot EC-3/EC-4 を AUTO-1 に混在 | NOT SELECTED |
| AP1-HOLD | OS レーンを進めない | not selected |

## Lane separation（selection constraint）

```text
Lane A — AssessmentSnapshot adapter
  Decision-AS-ADAPTER-START-1 = AIS-1-B ACCEPTED / LOCKED
  Implementation Start = HOLD
  Next = EC-3 + EC-4 Decision
  AUTO-1 effect = UNCHANGED / NOT SKIPPED

Lane B — AI Development OS
  AUTO-1 = ACCEPTED / LOCKED（contract）
  Next impl units require separate GO
```

## Deliverables（本 unit）

| File | Role |
|---|---|
| `docs/process/autonomy-policy-v1.md` | process SoT（ACCEPTED / LOCKED） |
| `docs/process/autonomy-policy-v1.json` | machine-readable normative contract |
| `docs/architecture/decision-autonomy-policy-v1-selection.md` | 本 selection packet |
| `docs/architecture/decision-autonomy-policy-v1-packet.md` | compare / options packet |
| `docs/architecture/decision-autonomy-policy-v1-acceptance.md` | Human Acceptance |
| `docs/architecture/decision-autonomy-policy-v1-independent-review.md` | Independent Review |
| `docs/process/ai-governance.md` | 最小参照追加のみ |

## Explicit non-deliverables

```text
application / domain / adapter / DTO / schema code
Capability Registry runtime
Action Gateway runtime
Cursor SDK runner
SharePoint / M365 / Entra / Deploy
Issue mutation
Ready / Merge authorization
DEC-AA / Routine AUG / LOW-AUTO-PILOT rewrite
EC-3 / EC-4 Decision packet（Lane A；別 unit）
negative test code（要件のみ固定）
LOW-AUTO-PILOT-V2 enablement
```

## Done criteria（Acceptance recording）

- Human Decision AP1-A = ACCEPT が正本化されている
- Status = ACCEPTED / LOCKED が一貫している
- `pull_request.merge` が Gateway 非搭載（FORBIDDEN）として明示されている
- UNKNOWN → DENY / baseline / allowedPaths / negative tests N1–N5 が LOCK されている
- Authorization effect = NONE / Implementation Start = NOT GRANTED
- Lane A（EC-3/EC-4）UNCHANGED
- Independent Review PASS on Acceptance recording HEAD（P0=0 / P1=0）

## Next

```text
1. Acceptance IR / Draft PR（Ready / Merge は別 Human Decision）
2. Parallel Lane A: EC-3 + EC-4 Decision（do not skip）
3. After separate GO: AUTO-2 Capability Registry
```
