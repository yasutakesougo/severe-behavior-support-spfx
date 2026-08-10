# AUTO-1 — AUTONOMY-POLICY-V1 Selection / Decision Packet

この文書は、**AUTO-1 — AUTONOMY-POLICY-V1** の選定パケットである。

Canonical process SoT: [`../process/autonomy-policy-v1.md`](../process/autonomy-policy-v1.md)  
Machine-readable SoT: [`../process/autonomy-policy-v1.json`](../process/autonomy-policy-v1.json)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: AUTO-1 — AUTONOMY-POLICY-V1
Kind: docs-only machine-decidable policy contract / Human Acceptance candidate
Status: SELECTED / CANDIDATE / READY_FOR_HUMAN_ACCEPTANCE
Recommended Option: AP1-A
Human Decision: PENDING
Policy Accepted: NO
Implementation: DO NOT START
Authorization effect: NONE
Permission expansion: NONE
Ready: HUMAN-ONLY
Merge: HUMAN-ONLY
SharePoint / M365: UNCHANGED / FORBIDDEN
Deploy: FORBIDDEN
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

観察:

- LOW-AUTO-PILOT 成功は「会話上のルール」で安全を担保している
- 次段階は Capability / Gateway による **システム強制**
- ただし法人アプリ本体の EC-3 / EC-4 を飛ばしてはならない

## Selected unit

```text
AUTO-1 — AUTONOMY-POLICY-V1
= machine-decidable autonomy policy contract only
≠ Cursor SDK Runner implementation
≠ AssessmentSnapshot adapter EC-3 / EC-4
```

## Options disposition（Candidate）

| Option | Content | Result |
|---|---|---|
| **AP1-A** | AUTONOMY-POLICY-V1 契約を本正本どおり固定（taxonomy / risk / baseline / paths / limits / fail-closed / UNKNOWN→DENY / approval / audit / Gateway flow / negative tests） | **RECOMMENDED** |
| AP1-B | Cursor SDK Runner を先に実装 | NOT SELECTED（契約なき実行は禁止） |
| AP1-C | AssessmentSnapshot EC-3/EC-4 を AUTO-1 に混在 | NOT SELECTED（レーン分離違反） |
| AP1-HOLD | OS レーンを進めない | available |

## Lane separation（selection constraint）

```text
Lane A — AssessmentSnapshot adapter
  Decision-AS-ADAPTER-START-1 = AIS-1-B ACCEPTED / LOCKED
  Implementation Start = HOLD
  Next = EC-3 + EC-4 Decision

Lane B — AI Development OS
  Next = AUTO-1 AUTONOMY-POLICY-V1（本 selection）
```

```text
Selecting AUTO-1 does NOT close EC-3 / EC-4.
Selecting AUTO-1 does NOT authorize adapter Implementation Start.
```

## Deliverables（本 unit）

| File | Role |
|---|---|
| `docs/process/autonomy-policy-v1.md` | process SoT |
| `docs/process/autonomy-policy-v1.json` | machine-readable normative contract |
| `docs/architecture/decision-autonomy-policy-v1-selection.md` | 本 selection packet |
| `docs/architecture/decision-autonomy-policy-v1-packet.md` | compare / options packet |
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
```

## Done criteria（Candidate recording）

- AUTO-1 scope 10 面が正本化されている
- initial capability set が AUTO_ALLOWED / HUMAN_ONLY / FORBIDDEN に分離されている
- `pull_request.merge` が Gateway 非搭載（FORBIDDEN）として明示されている
- Gateway decision flow と DENY reason codes が固定されている
- Cursor execution backend が言語非依存で抽象化されている
- Lane A（EC-3/EC-4）非侵食が明示されている
- negative test 5 件が LOW-AUTO-PILOT-V2 前要件として固定されている
- Authorization effect = NONE
- Human Option Acceptance は未了（PENDING）として明示されている

## Next

```text
1. Human Decision: AP1-A ACCEPT or HOLD
2. Parallel Lane A: EC-3 + EC-4 Decision（do not skip）
3. After AP1-A Acceptance: AUTO-2 Capability Registry（separate unit）
```
