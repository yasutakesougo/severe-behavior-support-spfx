# AUTO-1 — AUTONOMY-POLICY-V1

- 文書: `docs/process/autonomy-policy-v1.md`
- Unit: **AUTO-1 — AUTONOMY-POLICY-V1**
- 位置づけ: AI Development OS レーンの **自律実行ポリシー契約正本（機械判定可能な契約）**
- 状態: **CANDIDATE / READY_FOR_HUMAN_ACCEPTANCE**
- Human Decision: **PENDING**（推奨 Option = **AP1-A**）
- Machine-readable SoT: [`autonomy-policy-v1.json`](./autonomy-policy-v1.json)
- 上位正本（緩和・上書きしない）:
  - `docs/decisions/DEC-AI-ORG-003.md`
  - `docs/decisions/DEC-AA-001.md`
  - `docs/decisions/DEC-AA-003.md`
  - `docs/process/routine-aug-v1.md`
  - `docs/process/process-optimization-v1.md`
  - `docs/process/low-auto-pilot-v1.md`
- 関連:
  - Selection: [`../architecture/decision-autonomy-policy-v1-selection.md`](../architecture/decision-autonomy-policy-v1-selection.md)
  - Packet: [`../architecture/decision-autonomy-policy-v1-packet.md`](../architecture/decision-autonomy-policy-v1-packet.md)
  - Independent Review: [`../architecture/decision-autonomy-policy-v1-independent-review.md`](../architecture/decision-autonomy-policy-v1-independent-review.md)

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](./self-referential-gate-policy.md)）。

## Human scope fixation（本 unit で固定する契約）

```text
AUTO-1 — AUTONOMY-POLICY-V1
Kind: docs-only / machine-decidable policy contract
Status: CANDIDATE / READY_FOR_HUMAN_ACCEPTANCE
Recommended Option: AP1-A
Policy Accepted: NO
Implementation: DO NOT START
Capability Registry impl: NOT THIS UNIT
Action Gateway impl: NOT THIS UNIT
Cursor execution backend impl: NOT THIS UNIT（AUTO-8 以降）
Authorization effect: NONE
Permission expansion: NONE
Ready: HUMAN-ONLY
Merge: HUMAN-ONLY
SharePoint / M365: UNCHANGED / FORBIDDEN
Deploy: FORBIDDEN
```

```text
Agent recommendation / Independent Review: NOT Human Acceptance evidence
This document fixes the AUTO-1 contract surface for Human Acceptance.
AUTO-1 Candidate ≠ Policy Accepted
AUTO-1 Candidate ≠ Implementation Start
AUTO-1 Candidate ≠ LOW-AUTO-PILOT execution enablement
AUTO-1 Candidate ≠ AssessmentSnapshot EC-3 / EC-4 skip
```

## Lane separation（厳守）

```text
Lane A — 法人アプリ本体
└─ AssessmentSnapshot adapter
   └─ Decision-AS-ADAPTER-START-1 = AIS-1-B ACCEPTED / LOCKED
   └─ Implementation Start = HOLD
   └─ Next residual = EC-3 + EC-4 Decision
      （adapter client / transport + P2-002 exact clear/omit mechanics）

Lane B — AI Development OS
└─ AUTO-1 AUTONOMY-POLICY-V1（本 unit）
   ↓
   AUTO-2 Capability Registry
   ↓
   AUTO-3 Task Packet Schema
   ↓
   AUTO-4 Action Gateway contract
   ↓
   …
   ↓
   AUTO-8 Cursor execution backend（TypeScript SDK first; language-agnostic until then）
```

```text
AUTO-1 MUST NOT skip, close, or authorize AssessmentSnapshot EC-3 / EC-4.
AUTO-1 MUST NOT start adapter / DTO / schema / SharePoint code.
Two lanes progress independently; neither substitutes for the other.
```

## 目的

会話上のルール（prompt 上の「Merge 禁止」等）を、**Action Gateway が機械判定で強制できる契約**へ移す。

```text
安全の根拠:
  「Agent が賢いから安全」ではない
  「Agent が間違えてもシステムが止めるから安全」
```

## 本 unit の効力 / 非効力

### 効力（Acceptance 後に成立する契約面のみ）

- Capability taxonomy を固定する
- `AUTO_ALLOWED` / `HUMAN_ONLY` / `FORBIDDEN` を固定する
- `risk = LOW | MEDIUM | HIGH` を固定する
- baseline SHA binding / allowedPaths / limits / fail-closed / UNKNOWN→DENY を固定する
- Approval / Audit 要件を固定する
- Gateway 判定順序と DENY reason code を固定する
- negative test 要件（LOW-AUTO-PILOT-V2 前）を固定する

### 非効力（本 unit / Candidate / 将来の Acceptance 単独でも成立しない）

```text
Policy Accepted ≠ Implementation Start
Policy Accepted ≠ Capability Registry / Action Gateway / Runner code
Policy Accepted ≠ pull_request.merge capability の付与
Policy Accepted ≠ Ready / Merge authorization change
Policy Accepted ≠ DEC-AA / Routine AUG / LOW-AUTO-PILOT rewrite
Policy Accepted ≠ AssessmentSnapshot EC-3 / EC-4 Decision
Policy Accepted ≠ adapter Implementation Start
Policy Accepted ≠ SharePoint / M365 / Deploy / secret write
Cursor SDK language choice ≠ policy contract
```

## AUTO-1 scope（固定）

| # | 契約面 | 機械判定 |
|---|---|---|
| 1 | Capability taxonomy | capability id が registry に存在するか |
| 2 | AUTO_ALLOWED / HUMAN_ONLY / FORBIDDEN | class が明示分類されているか |
| 3 | risk = LOW / MEDIUM / HIGH | task risk が許可上限以内か |
| 4 | baseline SHA binding | request baseline == current reviewed baseline か |
| 5 | allowedPaths enforcement | 変更 path ⊆ task allowedPaths か |
| 6 | limits | 回数・並列・repair 上限内か |
| 7 | fail-closed rules | 不明・欠落は DENY |
| 8 | UNKNOWN → DENY | 未分類 capability / 未記載操作は DENY |
| 9 | Approval requirement | HUMAN_ONLY / 条件付きは valid approval 必須 |
| 10 | Audit requirement | すべての ALLOW / DENY を監査記録 |

## Capability taxonomy（v1 initial set）

### AUTO_ALLOWED 候補（Gateway に載せうる最大集合）

これらは **taxonomy 上の候補**である。Authorization / enablement を意味しない。

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

### HUMAN_ONLY / FORBIDDEN（Gateway に載せない / DENY）

```text
pull_request.ready          → HUMAN_ONLY
pull_request.merge          → FORBIDDEN（capability 自体を持たない）
decision.accept             → HUMAN_ONLY
decision.lock               → HUMAN_ONLY
sharepoint.schema.write     → FORBIDDEN
sharepoint.permission.write → FORBIDDEN
github.permission.write     → FORBIDDEN
secret.write                → FORBIDDEN
deploy.production           → FORBIDDEN
```

### Capability ≠ Authorization

```text
Capability exists in taxonomy ≠ allowed now
AUTO_ALLOWED candidate ≠ enabled for a task
Task packet allow-list ⊆ taxonomy AUTO_ALLOWED
Gateway MUST NOT expose FORBIDDEN capabilities
Prompt text is NOT an enforcement mechanism
```

重要:

```text
「Merge 禁止」を Prompt に書くだけでは不十分。
Action Gateway 自体が pull_request.merge capability を持たない設計とする。
```

## Risk model

| risk | 意味（AUTO-1） | Gateway 既定 |
|---|---|---|
| LOW | Accepted/LOCKED authority に対する限定・可逆・機械検証可能な変更 | AUTO_ALLOWED 候補を task packet が許可すれば審査対象 |
| MEDIUM | 境界隣接・複数面変更・解釈余地あり | 既定 HUMAN_ONLY（別 Acceptance なしに AUTO しない） |
| HIGH | Decision / permission / production / schema / deploy 等 | HUMAN_ONLY または FORBIDDEN |

```text
PROCESS-OPT-V1 / LOW-AUTO-PILOT-V1 の risk 語彙を再利用する。
本 unit は risk 語彙を再定義して緩和しない。
UNKNOWN risk → DENY
```

## Baseline SHA binding

```text
Every autonomous action request MUST bind:
  baselineSha: reviewed / authorized HEAD

If current baseline moved:
  DENY reason = BASELINE_MOVED

Stale approval / stale task packet / stale IR:
  DENY reason = BASELINE_MOVED or POLICY_MISMATCH
```

## allowedPaths enforcement

```text
Task packet MUST declare allowedPaths（glob / exact path set）
code.edit / commit.create 等の mutation は path ⊆ allowedPaths のみ
Path outside scope:
  DENY reason = OUT_OF_SCOPE
Unspecified allowedPaths on mutation capability:
  DENY reason = UNKNOWN or POLICY_MISMATCH
```

## Limits（v1 floor）

| limit | v1 floor（契約） |
|---|---|
| maxRepairAttempts | 3 |
| maxCommitsPerTask | task packet 明示（未明示は DENY） |
| maxFilesTouched | task packet 明示（未明示は DENY） |
| maxParallelTasks | 1（v1） |
| networkEgress | deny-by-default；task packet 明示 allow のみ |
| secretAccess | FORBIDDEN |

超過:

```text
DENY reason = POLICY_MISMATCH
```

## Fail-closed / UNKNOWN → DENY

```text
Missing capability id          → DENY / UNKNOWN
Capability not in taxonomy     → DENY / UNKNOWN
Capability FORBIDDEN           → DENY / HUMAN_ONLY or POLICY_BLOCKED
Capability HUMAN_ONLY w/o appr → DENY / HUMAN_ONLY
Task packet omits allow        → DENY / POLICY_MISMATCH
Risk unknown / above permit    → DENY / POLICY_MISMATCH
Baseline mismatch              → DENY / BASELINE_MOVED
Path outside allowedPaths      → DENY / OUT_OF_SCOPE
Idempotency key invalid/replay → DENY / POLICY_MISMATCH
Approval missing/invalid       → DENY / HUMAN_ONLY
Any ambiguous state            → DENY / UNKNOWN
```

```text
UNKNOWN → DENY
HOLD（工程語）と DENY（Gateway 語）を混同しない。
Gateway 出力は ALLOW | DENY。
工程上の再開は Human Decision で行う。
```

## Approval requirement

| class | approval |
|---|---|
| AUTO_ALLOWED（enabled task） | task packet + baseline + risk 許可で足りる（別 Human GO が enable している場合のみ） |
| HUMAN_ONLY | valid Human approval bound to capability / target / baselineSha |
| FORBIDDEN | approval でも Gateway は DENY（別プロセス外） |

```text
CI PASS ≠ approval
Independent Review PASS ≠ approval
Decision Accepted ≠ Implementation Start ≠ Gateway ALLOW
```

## Audit requirement

すべての Gateway 判定で記録する:

```text
timestamp
requestId / idempotencyKey
capability
taskId
baselineSha
risk
decision = ALLOW | DENY
reasonCode（DENY 時必須）
actor / approver（該当時）
paths（mutation 時）
authority references
```

記録しない:

```text
secret / token / credential 値
production PII / real tenant data
```

## Action Gateway decision flow（契約）

```text
request
↓
capability exists?
↓
task packet allows?
↓
risk permits?
↓
approval valid?
↓
baseline matches?
↓
path within scope?
↓
idempotency valid?
↓
ALLOW
```

いずれか 1 つでも不明 / 不一致:

```text
DENY

reason:
  UNKNOWN
  | POLICY_MISMATCH
  | BASELINE_MOVED
  | HUMAN_ONLY
  | OUT_OF_SCOPE
  | POLICY_BLOCKED
```

`POLICY_BLOCKED` は FORBIDDEN capability 要求（例: merge / SharePoint schema write / Decision accept）に用いる。

## Cursor execution backend（抽象）

```text
AUTO-1 は特定 SDK 言語に依存しない。
抽象名: Cursor execution backend

実装段階（AUTO-8）:
  first backend = TypeScript SDK (@cursor/sdk) — 公式確認済み
  Python SDK: AUTO-1 根拠にしない（公式一次情報未確認）

Policy / Gateway / Registry は backend 実装より先に固定する。
```

## Required negative tests（before LOW-AUTO-PILOT-V2）

実装（Gateway）導入後・LOW-AUTO-PILOT-V2 前に、少なくとも次を機械検証する:

| # | request | expected |
|---|---|---|
| N1 | `pull_request.merge` | DENY / POLICY_BLOCKED |
| N2 | `sharepoint.schema.write` | DENY / POLICY_BLOCKED |
| N3 | `decision.accept` | DENY / POLICY_BLOCKED or HUMAN_ONLY |
| N4 | path ∉ allowedPaths | DENY / OUT_OF_SCOPE |
| N5 | stale baselineSha | DENY / BASELINE_MOVED |

```text
All five MUST PASS before LOW-AUTO-PILOT-V2 enablement Decision.
AUTO-1 records the requirement only; test code is NOT this unit.
```

## 後続 unit（本 Acceptance では開始しない）

| Order | Unit | Role |
|---|---|---|
| AUTO-2 | Capability Registry | taxonomy の実行レジストリ |
| AUTO-3 | Task Packet Schema | task 許可・path・risk・baseline の schema |
| AUTO-4 | Action Gateway contract | 本 decision flow の契約テスト可能仕様 |
| AUTO-5+ | audit / approval binding / limits runtime | 実行時強制 |
| AUTO-8 | Cursor execution backend | TypeScript SDK first |

## Conflict register

| ID | Current authority | AUTO-1 effect | Handling |
|---|---|---|---|
| AP1-C1 | DEC-AI-ORG-003 Merge = 人の事前承認 | Gateway に `pull_request.merge` を持たせない（より厳しい） | **NO RELAXATION** |
| AP1-C2 | DEC-AA-001 AUTO = read-only + mechanical verification（v1） | AUTO_ALLOWED 候補に mutation を列挙するが enable しない | **CANDIDATE taxonomy only** |
| AP1-C3 | LOW-AUTO-PILOT-V1 execution NOT STARTED | 本 unit は pilot execution を開始しない | **NO CHANGE** |
| AP1-C4 | AssessmentSnapshot EC-3/EC-4 pending | 本 unit は触らない / 飛ばさない | **LANE SEPARATION** |
| AP1-C5 | Ready / Merge HUMAN-ONLY | 維持 | **NO CHANGE** |

## P2 disposition

```text
P0 = 0
P1 = 0
P2 = OPEN carry-forwards remain OPEN（偽クローズしない）
```

本 unit 固有 P2（Candidate）:

```text
AP1-P2-1: OPEN — AUTO_ALLOWED 候補に mutation 系を含めることと DEC-AA-001 v1 AUTO 集合の差。taxonomy ≠ enablement で記録；enable は別 GO
AP1-P2-2: OPEN — decision.accept を HUMAN_ONLY と POLICY_BLOCKED のどちらで返すかの Gateway 細部は AUTO-4 で固定
```

## 次工程

1. Human Decision on Option **AP1-A**（本 Candidate の Acceptance）
2. Acceptance 後も Implementation Start は別 GO
3. 平行 Lane A: AssessmentSnapshot **EC-3 + EC-4** Decision（AUTO-1 と独立）
4. 次 OS unit: AUTO-2 Capability Registry（Acceptance 後）

## Independent Review

正本: [`../architecture/decision-autonomy-policy-v1-independent-review.md`](../architecture/decision-autonomy-policy-v1-independent-review.md)
