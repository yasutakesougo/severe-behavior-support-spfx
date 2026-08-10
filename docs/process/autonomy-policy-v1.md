# AUTONOMY-POLICY-V1 — AUTO-1

- 文書: `docs/process/autonomy-policy-v1.md`
- Unit: **AUTO-1**
- 位置づけ: AI Development OS の **機械判定可能な自律実行 Policy 契約**
- 状態: **ACCEPTED / NOT ENABLED**
- Human Decision: **AUTO-1 scope を採用**（2026-08-10）
- Authorization effect: **NONE**
- Implementation: **DO NOT START YET**
- 上位正本（緩和・上書きしない）:
  - `docs/decisions/DEC-AI-ORG-003.md`
  - `docs/decisions/DEC-AA-001.md`
  - `docs/decisions/DEC-AA-003.md`
  - `docs/process/routine-aug-v1.md`
  - `docs/process/process-optimization-v1.md`
  - `docs/process/low-auto-pilot-v1.md`
- Selection / Acceptance 記録:
  [`../architecture/decision-autonomy-policy-v1-selection.md`](../architecture/decision-autonomy-policy-v1-selection.md)

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](./self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
AUTO-1 — AUTONOMY-POLICY-V1
Decision:
ACCEPTED

Policy:
DEFINED / NOT ENABLED

Authorization effect:
NONE

Implementation:
DO NOT START YET

UNKNOWN:
DENY

Ready / Merge / Decision Acceptance:
NOT EXECUTABLE BY ACTION GATEWAY

SharePoint / M365 / Entra / permission / secret / production deploy:
NOT EXECUTABLE BY ACTION GATEWAY
```

```text
Policy Accepted ≠ policy enabled
Policy Accepted ≠ Implementation Start
Policy Accepted ≠ capability implementation
Policy Accepted ≠ Task Packet approval
Policy Accepted ≠ Ready / Merge authorization
Capability ≠ Authorization
CI PASS ≠ Authorization
```

## 目的

Agent の判断能力ではなく、Agent が誤った要求を生成しても実行境界で停止する
Fail Closed 契約を固定する。

```text
Task Packet
  ↓
Capability Registry
  ↓
Action Gateway
  ↓
Cursor execution backend
```

`Cursor execution backend` は抽象名であり、SDK 言語・パッケージ・実行場所を
AUTO-1 では固定しない。最初の backend 候補の選定と実装は後続 unit で扱う。

## Scope

AUTO-1 が固定するもの:

1. capability taxonomy
2. `AUTO_ALLOWED` / `HUMAN_ONLY` / `FORBIDDEN`
3. `LOW` / `MEDIUM` / `HIGH`
4. baseline SHA binding
5. `allowedPaths` enforcement
6. limits
7. Fail Closed rules
8. `UNKNOWN → DENY`
9. approval requirement
10. audit requirement

AUTO-1 が作らないもの:

```text
Capability Registry implementation
Task Packet JSON Schema
Action Gateway implementation
Cursor execution backend implementation
SDK language binding
hooks.json
application / domain / adapter code
tests or runtime configuration
```

## Policy vocabulary（canonical enum）

### Classification

```text
AUTO_ALLOWED
HUMAN_ONLY
FORBIDDEN
```

| 値 | 意味 |
|---|---|
| `AUTO_ALLOWED` | 全 precondition を満たす場合に限り Gateway が実行可能。単独では認可ではない |
| `HUMAN_ONLY` | Human workflow でのみ扱う。Gateway に executable route を持たせない |
| `FORBIDDEN` | AI Development OS の Gateway では実行しない。承認で上書きできない |

厳格優先順:

```text
FORBIDDEN > HUMAN_ONLY > AUTO_ALLOWED
```

同一要求が複数分類に該当する場合、最も厳しい分類を採用する。

### Risk

```text
LOW
MEDIUM
HIGH
```

AUTO-1 の自動実行 ceiling は `LOW` のみとする。

```text
effectiveRisk = max(
  capability.defaultRisk,
  taskPacket.risk,
  contextualEscalators
)

effectiveRisk == LOW     → 次の policy check へ
effectiveRisk == MEDIUM  → DENY / RISK_NOT_ALLOWED
effectiveRisk == HIGH    → DENY / RISK_NOT_ALLOWED
missing or unknown risk  → DENY / UNKNOWN
```

`MEDIUM` / `HIGH` を Human が扱う場合も Action Gateway の同一要求を
override して実行させない。別 Human workflow と新しい Task Packet が必要である。

## Initial capability policy

### AUTO_ALLOWED candidates fixed by AUTO-1

すべて `effectiveRisk = LOW`、active enablement、valid approval、scope、
baseline、limits、idempotency、audit の条件付きである。

| Capability ID | Default risk | 追加条件 |
|---|---|---|
| `repo.read` | `LOW` | packet が指定する repository / refs の read-only |
| `code.edit` | `LOW` | `allowedPaths` 内のみ。対象外、symlink escape、暗黙 scope 拡張は禁止 |
| `test.run` | `LOW` | packet の command allowlist 内。deploy / publish / mutation を含まない |
| `branch.create` | `LOW` | 非保護 feature branch、baseline SHA 起点、1 task 1 branch |
| `commit.create` | `LOW` | packet scope 内。hook bypass、amend、保護 branch commit は含まない |
| `branch.push` | `LOW` | 自 feature branch への通常 push のみ。force push / protected branch は含まない |
| `pull_request.create_draft` | `LOW` | 自 branch から Draft のみ。Ready 化を含まない |
| `pull_request.update_draft` | `LOW` | 同一 Draft の title / body / branch head 更新のみ。Ready 化を含まない |
| `ci.read` | `LOW` | CI status / logs の read-only |
| `review.request` | `LOW` | 同一 Draft の Independent Review 要求のみ。Ready、Decision Accepted、review verdict の自己生成を含まない |

`AUTO_ALLOWED` は **将来有効化時の policy classification** である。
AUTO-1 時点では `NOT ENABLED` のため、全 capability の実行結果は DENY となる。

### HUMAN_ONLY policy entries

次は policy 上既知だが、Gateway に executable route を持たせない。

| Operation ID | Classification |
|---|---|
| `pull_request.ready` | `HUMAN_ONLY` |
| `pull_request.merge` | `HUMAN_ONLY` |
| `decision.accept` | `HUMAN_ONLY` |
| `decision.lock` | `HUMAN_ONLY` |

特に `pull_request.merge` は prompt 上の禁止だけに依存しない。

```text
Action Gateway merge executor: ABSENT
Capability Registry executable merge adapter: ABSENT
Human approval supplied to Gateway: MUST NOT create either route
```

Human が別 workflow で merge を判断できることと、Gateway が merge capability を
持たないことは両立する。

### FORBIDDEN policy entries

次は承認の有無にかかわらず Gateway で実行しない。

| Operation ID | Classification |
|---|---|
| `sharepoint.schema.write` | `FORBIDDEN` |
| `sharepoint.permission.write` | `FORBIDDEN` |
| `github.permission.write` | `FORBIDDEN` |
| `secret.write` | `FORBIDDEN` |
| `deploy.production` | `FORBIDDEN` |

上記は最小 deny set である。未記載 operation は `UNKNOWN` であり、
`AUTO_ALLOWED` へ推定しない。

## Required authorization context

すべての Gateway request は、後続 Task Packet Schema が表現する次の値を
解決できなければならない。

```text
policyVersion
policyEnablementRef
taskPacketId
taskPacketVersion
repository
baseRef
baselineSHA
expectedHeadSHA (mutation / external write when applicable)
capabilities[]
risk
allowedPaths[]
deniedPaths[]
limits
approvalRef
expiresAt
```

必須値がない、形式不明、署名・発行元を検証できない、期限切れ、取消済み、
対象・操作・範囲・版が一致しない場合は DENY とする。

Agent は `policyEnablementRef`、Task Packet、approval、risk、limits、
`allowedPaths` を自分で発行・拡張・更新してはならない。

## Approval requirement

実行時には次の 2 つが両方必要である。

1. **Policy enablement approval** — policy version、repository、environment、
   enablement 期間に拘束
2. **Task Packet approval** — packet ID/version、baseline SHA、capabilities、
   risk、paths、limits、期限に拘束

```text
AUTO-1 Human Acceptance alone:
  is not policy enablement approval
  is not Task Packet approval
  does not satisfy Implementation Start
```

approval の対象・操作・範囲・版が request と exact match しない場合、
広い approval として解釈しない。

## Baseline and head binding

### Baseline

- `baselineSHA` は full commit SHA とする。
- Task Packet 発行後は immutable とする。
- `baseRef` の現在値が `baselineSHA` と一致しない場合は
  `DENY / BASELINE_MOVED` とする。
- check は最初の mutation 前、および push / Draft PR create/update /
  review request の直前に再実行する。
- Agent による自動 rebase、baseline 更新、approval 流用は禁止する。

### Mutable head

- mutation / external write は直前状態を `expectedHeadSHA` に拘束する。
- branch / Draft PR head が一致しない場合は `DENY / HEAD_MOVED` とする。
- 成功した mutation の result SHA を次 request の `expectedHeadSHA` として
  明示的に引き継ぐ。

baseline は task の承認起点、expected head は task 内の逐次競合防止であり、
相互に代替しない。

## allowedPaths enforcement

`code.edit` と、変更差分を外部反映する `commit.create` / `branch.push` /
Draft PR 操作に適用する。

1. path は repository-relative POSIX path へ正規化する。
2. absolute path、`..` traversal、NUL、repository 外を拒否する。
3. symlink は real path を解決し、repository / allowed root 外なら拒否する。
4. create / modify / delete は対象 path が `allowedPaths` の少なくとも 1 条件に
   match 必須。
5. rename / move は source と destination の両方が match 必須。
6. `deniedPaths` が match した場合は常に deny し、`allowedPaths` で上書きしない。
7. generated file、lockfile、submodule pointer も暗黙許可しない。
8. path 判定不能または差分 inventory 不完全は DENY。

結果:

```text
outside allowedPaths → DENY / POLICY_BLOCKED / OUT_OF_SCOPE
```

## Limits

Task Packet は全 limit を明示し、値は次の policy ceiling 以下でなければならない。
未指定、負数、非整数、ceiling 超過は DENY とする。

| Limit | Policy ceiling |
|---|---:|
| `maxRepairCycles` | 3 |
| `maxConcurrentExecutions` | 1 |
| `maxBranchesCreated` | 1 |
| `maxOpenDraftPullRequests` | 1 |
| `maxCommits` | 4 |
| `maxPushes` | 4 |
| `maxChangedFiles` | 20 |
| `maxChangedBytes` | 200000 |
| `maxActionRequests` | 200 |

Task Packet は ceiling より小さい値を設定できる。消費量は audit ledger から
再計算可能でなければならない。超過前に DENY し、部分実行しない。

## Idempotency

- mutation / external write request は `idempotencyKey` 必須。
- key scope は `policyVersion + taskPacketId + capability + target` とする。
- 同じ key + 同じ canonical payload hash の再送は、前回結果を返して再実行しない。
- 同じ key + 異なる payload hash は `DENY / IDEMPOTENCY_CONFLICT`。
- result 不明の timeout は成功・失敗を推測せず、audit ledger を照合するまで DENY。
- adapter が idempotent execution を保証できない capability は Registry に
  executable として登録しない。

## Audit requirement

全 request（ALLOW / DENY）を監査対象とする。side effect 前に audit sink が
書込可能であることを確認する。request 受理時に `REQUESTED`、side effect 直前に
`PREPARED` を durable に記録できない場合は実行しない。各 policy check の DENY
も同じ `auditId` へ decision を追記する。

最低記録項目:

```text
auditId
timestamp
policyVersion
policyEnablementRef
taskPacketId / taskPacketVersion
repository / baseRef / baselineSHA / expectedHeadSHA
capability / classification / effectiveRisk
approvalRef
allowedPaths digest / limits snapshot
idempotencyKey / canonical payload hash
decision / code / reason
executor backend ID
result reference / result SHA
```

記録禁止:

```text
secret / token / credential value
personal data
production data payload
unredacted sensitive command output
```

実行後に completion audit を保存できなかった場合は次 action を停止し、
`AUDIT_INCOMPLETE` として Human review へ送る。audit 不能を成功扱いしない。

## Gateway decision contract

### Result

```text
decision = ALLOW | DENY
code =
  POLICY_BLOCKED
  | BASELINE_MOVED
  | HEAD_MOVED
  | IDEMPOTENCY_CONFLICT
  | LIMIT_EXCEEDED
  | AUDIT_UNAVAILABLE

reason =
  UNKNOWN
  | POLICY_MISMATCH
  | POLICY_NOT_ENABLED
  | CAPABILITY_UNAVAILABLE
  | RISK_NOT_ALLOWED
  | APPROVAL_REQUIRED
  | APPROVAL_INVALID
  | BASELINE_MOVED
  | HEAD_MOVED
  | HUMAN_ONLY
  | FORBIDDEN
  | OUT_OF_SCOPE
  | LIMIT_EXCEEDED
  | IDEMPOTENCY_CONFLICT
  | AUDIT_UNAVAILABLE
```

`ALLOW` は code / reason を持たない。`DENY` は canonical code と reason を
必ず 1 つずつ持つ。内部例外文字列を policy reason として返さない。

reason から code への mapping は次で固定する。

| Reason | Code |
|---|---|
| `UNKNOWN` / `POLICY_MISMATCH` / `POLICY_NOT_ENABLED` | `POLICY_BLOCKED` |
| `CAPABILITY_UNAVAILABLE` / `RISK_NOT_ALLOWED` | `POLICY_BLOCKED` |
| `APPROVAL_REQUIRED` / `APPROVAL_INVALID` | `POLICY_BLOCKED` |
| `HUMAN_ONLY` / `FORBIDDEN` / `OUT_OF_SCOPE` | `POLICY_BLOCKED` |
| `BASELINE_MOVED` | `BASELINE_MOVED` |
| `HEAD_MOVED` | `HEAD_MOVED` |
| `LIMIT_EXCEEDED` | `LIMIT_EXCEEDED` |
| `IDEMPOTENCY_CONFLICT` | `IDEMPOTENCY_CONFLICT` |
| `AUDIT_UNAVAILABLE` | `AUDIT_UNAVAILABLE` |

### Evaluation order

```text
1. request fields and policy version valid?
2. audit sink available and REQUESTED audit durable?
3. operation known and classified?
4. classification == AUTO_ALLOWED?
5. executable capability adapter exists?
6. policy enablement active?
7. Task Packet allows capability and target?
8. effective risk == LOW?
9. approvals valid and exact?
10. baseline and expected head match?
11. paths within scope?
12. limits available?
13. idempotency valid?
14. PREPARED audit durable?
15. ALLOW
```

各段階は前段を通過した場合のみ評価する。どこか 1 つでも false / missing /
unknown / conflicting なら実行せず DENY する。複数 deny reason が同時に判明した
場合は、上記の早い段階の reason を返し、全検出事項は audit detail に残す。

## Mandatory negative contract tests

後続 Action Gateway 実装は、少なくとも次の acceptance test を実装前 Gate とする。
各 test は対象 failure 以外の context を valid / enabled にした fixture で評価し、
先行 check の別 reason で短絡させない。

| Request | Required decision | Required code | Required reason |
|---|---|---|---|
| `pull_request.merge` | `DENY` | `POLICY_BLOCKED` | `HUMAN_ONLY` |
| `sharepoint.schema.write` | `DENY` | `POLICY_BLOCKED` | `FORBIDDEN` |
| `decision.accept` | `DENY` | `POLICY_BLOCKED` | `HUMAN_ONLY` |
| `code.edit` outside `allowedPaths` | `DENY` | `POLICY_BLOCKED` | `OUT_OF_SCOPE` |
| request after `baseRef` moved from `baselineSHA` | `DENY` | `BASELINE_MOVED` | `BASELINE_MOVED` |

追加必須:

```text
unknown capability → DENY / POLICY_BLOCKED / UNKNOWN
policy not enabled → DENY / POLICY_BLOCKED / POLICY_NOT_ENABLED
missing approval → DENY / POLICY_BLOCKED / APPROVAL_REQUIRED
idempotency key collision → DENY / IDEMPOTENCY_CONFLICT / IDEMPOTENCY_CONFLICT
audit sink unavailable → DENY / AUDIT_UNAVAILABLE / AUDIT_UNAVAILABLE
```

5 件の core negative test が PASS しない限り、
`LOW-AUTO-PILOT-V2` または同等 enablement へ進まない。

## Two-lane boundary

```text
Corporate application lane
  └─ AssessmentSnapshot adapter Entry Criteria / Human Gate

AI Development OS lane
  └─ AUTO-1 AUTONOMY-POLICY-V1
      └─ future Capability Registry
          └─ future Task Packet Schema
              └─ future Action Gateway
```

AUTO-1 は AssessmentSnapshot の Decision、Entry Criteria、Implementation Start、
adapter / DTO / schema scope を変更しない。

現行正本では Decision-AS-ADAPTER-START-1 は AIS-1-B として
`ACCEPTED / LOCKED` だが、EC-3 / EC-4 は未充足で Implementation Start は HOLD:

- [`../architecture/decision-assessment-snapshot-adapter-start-acceptance.md`](../architecture/decision-assessment-snapshot-adapter-start-acceptance.md)

AUTO-1、将来の Task Packet、CI PASS、Independent Review PASS のいずれも、
この HOLD を迂回または自動解除しない。

## Conflict register

| ID | Existing authority | AUTO-1 handling |
|---|---|---|
| AUTO1-C1 | DEC-AA-001: mutation AUTO-UNTIL-GATE is NOT ENABLED | AUTO_ALLOWED target classification を定義するだけ。**NOT ENABLED / NO OVERRIDE** |
| AUTO1-C2 | DEC-AA-003: GitHub publication 前 STOP | branch push / Draft PR capability は将来 policy 候補。**現時点では NOT ENABLED** |
| AUTO1-C3 | LOW-AUTO-PILOT-V1: pilot execution NOT STARTED | execution を開始しない。**NO CHANGE** |
| AUTO1-C4 | DEC-AI-ORG-003: PR publication requires bound Human approval | approval requirement を維持。AUTO-1 Acceptance 単独では満たさない |
| AUTO1-C5 | Merge = Human prior approval | Gateway executor を持たない。Human workflow は上位正本のまま |
| AUTO1-C6 | AssessmentSnapshot adapter EC-3 / EC-4 = unmet | application lane の HOLD を維持。**NO BYPASS** |

矛盾時は上位正本と厳しい分類を優先し、AUTO-1 を権限緩和として解釈しない。

## Done criteria

- capability taxonomy と initial policy set が一意
- risk ceiling が `LOW` に固定
- baseline / head / paths / limits / idempotency / approval / audit が判定可能
- unknown / missing / conflict がすべて DENY
- Gateway が Ready / Merge / Decision Acceptance / forbidden writes の executor を持たない
- core negative test 5 件の期待結果が固定
- SDK language に非依存
- AssessmentSnapshot adapter lane の HOLD を迂回しない
- `src/` / `tests/` / runtime configuration を変更しない
- Independent Review で P0 = 0 / P1 = 0
- mechanical verification PASS
- Draft PR のまま Human Ready Decision で停止

## Next units（AUTO-1 の非効力）

次は AUTO-1 とは別 substantive unit とする。

1. Capability Registry contract
2. Task Packet Schema
3. Action Gateway contract
4. execution backend selection
5. Action Gateway implementation + mandatory negative tests
6. `LOW-AUTO-PILOT-V2` enablement Decision

AUTO-1 の Acceptance は、上記の Implementation Start または enablement を
自動付与しない。
