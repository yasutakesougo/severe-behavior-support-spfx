# AUTO-1 — AUTONOMY-POLICY-V1 Human Decision Packet

この文書は、AI Development OS の最初の substantive unit として
**AUTONOMY-POLICY-V1（機械判定可能な自律実行ポリシー契約）** を採択するかの
比較パケットである。

Selected via:
[`decision-autonomy-policy-v1-selection.md`](./decision-autonomy-policy-v1-selection.md)

Acceptance:
[`decision-autonomy-policy-v1-acceptance.md`](./decision-autonomy-policy-v1-acceptance.md)

Canonical:
[`../process/autonomy-policy-v1.md`](../process/autonomy-policy-v1.md)

Machine-readable:
[`../process/autonomy-policy-v1.json`](../process/autonomy-policy-v1.json)

IR:
[`decision-autonomy-policy-v1-independent-review.md`](./decision-autonomy-policy-v1-independent-review.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: AUTO-1 — AUTONOMY-POLICY-V1
Status: CONSUMED / ACCEPTED / LOCKED
Human Decision: AP1-A = ACCEPT
Baseline main at Candidate:
  5bbe912d0e5e127cf1846bb0edf5ddff24ca99a0
Initial Candidate HEAD: cff443813a9dade839f1e06a0af88bb6a6da3ece
Implementation Start: NOT GRANTED
Authorization effect: NONE
```

## 問い

LOW-AUTO-PILOT 以降の自律開発を、Prompt 上の約束ではなく
**Capability + Action Gateway で強制できる契約**として先に固定するか。

## 再 Decision しない前提

```text
DEC-AI-ORG-003 = 承認済み（権限境界上位；緩和しない）
DEC-AA-001 = Accepted / LOCKED / Option A
DEC-AA-003 = Accepted / LOCKED / Option A3-1
PROCESS-OPT-V1 = ACCEPTED / LOCKED；LOW auto-loop DEFINED / NOT ENABLED
LOW-AUTO-PILOT-V1 = LA1-A ACCEPTED；Pilot execution NOT STARTED
Decision-AS-ADAPTER-START-1 = AIS-1-B ACCEPTED / LOCKED
AssessmentSnapshot Implementation Start = HOLD（EC-3 / EC-4 未充足）
```

## 比較結果

| ID | 判定 | 内容 | Human result |
|---|---|---|---|
| **AP1-A** | 契約先固定 | taxonomy / class / risk / baseline / paths / limits / fail-closed / UNKNOWN→DENY / approval / audit / Gateway flow / negative tests を docs + JSON で固定。実装は後続 | **ACCEPTED / LOCKED** |
| AP1-B | Runner 先 | Cursor SDK Runner を契約前に実装 | NOT SELECTED |
| AP1-C | レーン混在 | EC-3/EC-4 を AUTO-1 に含める | NOT SELECTED |
| AP1-HOLD | 延期 | OS レーンを進めない | not selected |

## AP1-A が LOCK した契約

### 1. Capability taxonomy

明示 id のみ有効。未記載 = UNKNOWN → DENY。

### 2. Classification

| class | 意味 |
|---|---|
| AUTO_ALLOWED | Gateway に載せうる候補（enablement 別） |
| HUMAN_ONLY | 人の承認が必要；auto capability として露出させない |
| FORBIDDEN | Gateway に capability 自体を持たない |

### 3. Initial capability set

AUTO_ALLOWED 候補（taxonomy only；≠ enabled）:

```text
repo.read
code.edit
test.run
branch.create
commit.create
branch.push
pull_request.create_draft
pull_request.update_draft
ci.read
review.request
```

HUMAN_ONLY:

```text
pull_request.ready
decision.accept
decision.lock
```

Gateway-forbidden（capability 非搭載 / FORBIDDEN）:

```text
pull_request.merge
sharepoint.schema.write
sharepoint.permission.write
github.permission.write
secret.write
deploy.production
```

### 4. risk

```text
LOW | MEDIUM | HIGH
UNKNOWN risk → DENY
```

### 5–10. Enforcement surfaces

```text
baseline SHA binding
allowedPaths enforcement
limits
fail-closed rules
UNKNOWN → DENY
Approval requirement
Audit requirement
```

### Gateway flow

```text
request
→ capability exists?
→ task packet allows?
→ risk permits?
→ approval valid?
→ baseline matches?
→ path within scope?
→ idempotency valid?
→ ALLOW
else DENY（UNKNOWN | POLICY_MISMATCH | BASELINE_MOVED | HUMAN_ONLY | OUT_OF_SCOPE | POLICY_BLOCKED）
```

### Design rule（核）

```text
Prompt に「Merge 禁止」と書くだけでは不十分。
Action Gateway は pull_request.merge capability を持たない。
```

### Backend abstraction

```text
Cursor execution backend（language-agnostic in AUTO-1）
AUTO-8: TypeScript SDK (@cursor/sdk) first — NOT STARTED
Python SDK: not a basis for AUTO-1
```

### Negative tests（要件のみ；実装しない）

```text
N1 merge → POLICY_BLOCKED
N2 SharePoint schema → POLICY_BLOCKED
N3 Decision accept → POLICY_BLOCKED or HUMAN_ONLY
N4 allowedPaths 外 → OUT_OF_SCOPE
N5 stale baseline → BASELINE_MOVED
```

LOW-AUTO-PILOT-V2 前に 5 件すべて必須。

## Lane separation（packet 拘束）

```text
法人アプリ本体レーン:
  AssessmentSnapshot adapter
  EC-3 / EC-4 = PENDING / UNCHANGED
  AUTO-1 does not satisfy or skip them

AI Development OS レーン:
  AUTO-1 ACCEPTED / LOCKED
  → Registry → Task Packet → Gateway → Cursor backend（各別 GO）
```

## 非効力

```text
AP1-A ACCEPT:
  Implementation Start = NOT GRANTED
  Gateway / Registry / Runner code = NOT STARTED
  Ready / Merge = NOT AUTHORIZED
  DEC-AA / Routine AUG rewrite = NO
  adapter EC-3 / EC-4 = NOT CLOSED
  AUTO_ALLOWED candidates = NOT ENABLED
  LOW-AUTO-PILOT-V2 = NOT AUTHORIZED
```

## Human Decision recorded

```text
Human Decision: AP1-A = ACCEPT
Status: ACCEPTED / LOCKED
Date: 2026-08-10
```

## Next after Acceptance

1. Acceptance IR / mechanical verification
2. Draft PR publication（Ready / Merge は別 Human Decision）
3. Parallel: Lane A EC-3 + EC-4 Decision
4. Next OS unit: AUTO-2 Capability Registry（別 GO）
