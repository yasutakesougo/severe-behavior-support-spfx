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

Risk ordinal は `LOW = 1`、`MEDIUM = 2`、`HIGH = 3` とする。
`contextualEscalators` は versioned `riskRuleSet` の次の canonical ID のみを使う。

| Escalator ID | Minimum risk |
|---|---|
| `DEPENDENCY_CHANGE` | `MEDIUM` |
| `CROSS_MODULE_INTEGRATION` | `MEDIUM` |
| `ADAPTER_DTO_WIRING` | `MEDIUM` |
| `SCHEMA_ADJACENT_CHANGE` | `MEDIUM` |
| `NEW_BUSINESS_RULE` | `HIGH` |
| `INSTITUTIONAL_INTERPRETATION` | `HIGH` |
| `SECURITY_BOUNDARY_CHANGE` | `HIGH` |
| `PERMISSION_OR_SECRET_CHANGE` | `HIGH` |
| `PRODUCTION_DATA` | `HIGH` |
| `DESTRUCTIVE_ACTION` | `HIGH` |
| `PRODUCTION_DEPLOY` | `HIGH` |

`riskRuleSet` は trusted authority root に拘束された次の matcher manifest を持つ。

```text
dependencyManifestPaths + dependencyFieldPointers
moduleBoundaryManifest(path → moduleId)
artifactClassManifest(path/symbol → class)
symbolDependencyManifest(symbol → referenced symbols)
acceptedBehaviorRefs(symbol + authority digest + allowedChangeKind)
institutionalPolicyPathsAndSymbols
dataClassificationManifest
destructiveOperationIds
```

matcher predicates:

| Escalator ID | Deterministic predicate |
|---|---|
| `DEPENDENCY_CHANGE` | proposed diff が dependency manifest / lockfile path、または dependency field pointer を変更 |
| `CROSS_MODULE_INTEGRATION` | changed path / symbol が 2 以上の `moduleId` に属する、または proposed import / call / type-reference / export edge の source と target の `moduleId` が異なる |
| `ADAPTER_DTO_WIRING` | changed path / symbol class が `ADAPTER` または `DTO` |
| `SCHEMA_ADJACENT_CHANGE` | class が `SCHEMA`、または changed symbol が schema symbol を参照 |
| `NEW_BUSINESS_RULE` | `DOMAIN_BEHAVIOR` symbol の semantic fingerprint が exact `acceptedBehaviorRefs` の allowed change と一致しない |
| `INSTITUTIONAL_INTERPRETATION` | institutional path / symbol を変更し、exact Accepted authority digest に拘束された allowed change がない |
| `SECURITY_BOUNDARY_CHANGE` | class が `SECURITY_BOUNDARY` |
| `PERMISSION_OR_SECRET_CHANGE` | class が `PERMISSION` / `SECRET` または該当 operation ID |
| `PRODUCTION_DATA` | target data classification が `PRODUCTION_DATA` |
| `DESTRUCTIVE_ACTION` | delete / physical overwrite、または operation ID が `destructiveOperationIds` に一致 |
| `PRODUCTION_DEPLOY` | operation ID が `deploy.production` |

入力源は approved Task Packet、Capability Registry の immutable rule、
proposed preflight path / AST-symbol / semantic-fingerprint diff とする。同じ変更に
複数値がある場合は最大値を採用する。parser / symbol mapping / fingerprint が
対象言語を support しない、path / symbol が manifest 未記載、または判定結果が
競合する場合は `UNKNOWN` として DENY する。

各 language matcher は `riskRuleSet` に次を固定する。

```text
matcherPluginId / version / executableDigest
parserId / parserVersion / grammarDigest
astNormalizationVersion
symbolIdentityVersion
semanticFingerprintVersion
dependencyEdgeKinds = IMPORT | CALL | TYPE_REFERENCE | EXPORT
allowedChangeKinds =
  ADD_TEST
  | ADD_VALIDATION
  | MECHANICAL_EXPORT
  | REPRESENT_ACCEPTED_TYPE
  | IMPLEMENT_ACCEPTED_PURE_FUNCTION
```

AST normalization は comment / trivia / source position を除外し、literal、operator、
type、control-flow、resolved symbol edge を保持した canonical JSON とする。
symbol ID は
`language + moduleId + canonicalPath + qualifiedName + symbolKind`、
semantic fingerprint は normalized symbol AST と sorted dependency edges の
SHA-256 とする。rename / unresolved symbol / dynamic edge は UNKNOWN として DENY。
`allowedChangeKinds` にない値は受理しない。

Agent 自身の risk label は authority にしない。rule set にない escalator、入力源不明、
preflight と packet の不一致は `UNKNOWN` として DENY する。各 matcher は positive /
negative fixture を持つ。特に cross-module import / call / type-reference / export
各 edge と same-module edge を固定し、同じ proposed diff から同じ escalator set を
生成できることを Gateway implementation Gate で検証する。

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
| `pull_request.update_draft` | `LOW` | 同一 Draft の title / body metadata 更新のみ。head 更新・Ready 化を含まない |
| `ci.read` | `LOW` | CI status / logs の read-only |
| `review.request` | `LOW` | 同一 Draft の Independent Review 要求のみ。Ready、Decision Accepted、review verdict の自己生成を含まない |

`AUTO_ALLOWED` は **将来有効化時の policy classification** である。
AUTO-1 時点では `NOT ENABLED` のため、全 capability の実行結果は DENY となる。

さらに effective classification は全上位 authority との intersection（最も厳しい
分類）で決める。現行 DEC-AA-003 の GitHub 公開前 STOP / external write
permissions `NONE` が有効な間、`branch.push`、Draft PR create/update、
`review.request` は effective `HUMAN_ONLY` である。上位正本を明示的に supersede
する別 Human Decision なしに、AUTO-1 の target classification を適用しない。

### HUMAN_ONLY policy entries

次は policy 上既知だが、Gateway に executable route を持たせない。

| Operation ID | Classification |
|---|---|
| `implementation.start` | `HUMAN_ONLY` |
| `task_packet.approve` | `HUMAN_ONLY` |
| `autonomy_policy.enable` | `HUMAN_ONLY` |
| `capability_registry.write` | `HUMAN_ONLY` |
| `action_gateway.policy.write` | `HUMAN_ONLY` |
| `issue.write` | `HUMAN_ONLY` |
| `label.write` | `HUMAN_ONLY` |
| `review.publish` | `HUMAN_ONLY` |
| `pull_request.ready` | `HUMAN_ONLY` |
| `pull_request.merge` | `HUMAN_ONLY` |
| `decision.accept` | `HUMAN_ONLY` |
| `decision.lock` | `HUMAN_ONLY` |
| `branch.force_push_feature` | `HUMAN_ONLY` |
| `deploy.validation` | `HUMAN_ONLY` |
| `security_boundary.write` | `HUMAN_ONLY` |

特に `pull_request.merge` は prompt 上の禁止だけに依存しない。

```text
Action Gateway merge executor: ABSENT
Capability Registry executable merge adapter: ABSENT
Human approval supplied to Gateway: MUST NOT create either route
```

Human が別 workflow で merge を判断できることと、Gateway が merge capability を
持たないことは両立する。

Draft PR head の変更は `pull_request.update_draft` では実行しない。
commit / ref / head mutation を含む Draft update は
`DENY / POLICY_BLOCKED / DRAFT_HEAD_MUTATION` とし、head の変更は必ず
`branch.push` として
認可・`maxPushes` 計上・監査する。

### FORBIDDEN policy entries

次は承認の有無にかかわらず Gateway で実行しない。

| Operation ID | Classification |
|---|---|
| `branch.push_protected` | `FORBIDDEN` |
| `branch.force_push_protected` | `FORBIDDEN` |
| `sharepoint.app_catalog.write` | `FORBIDDEN` |
| `sharepoint.schema.write` | `FORBIDDEN` |
| `sharepoint.production.write` | `FORBIDDEN` |
| `sharepoint.permission.write` | `FORBIDDEN` |
| `microsoft365.write` | `FORBIDDEN` |
| `entra.write` | `FORBIDDEN` |
| `github.permission.write` | `FORBIDDEN` |
| `secret.value.read` | `FORBIDDEN` |
| `secret.write` | `FORBIDDEN` |
| `production_data.read` | `FORBIDDEN` |
| `production_data.write` | `FORBIDDEN` |
| `data.physical_delete` | `FORBIDDEN` |
| `notion.production.write` | `FORBIDDEN` |
| `deploy.production` | `FORBIDDEN` |

この表と HUMAN_ONLY 表は上位 authority deny table の canonical v1 projection
である。Capability Registry は分類を緩和できない。未記載 operation は `UNKNOWN`
であり、`AUTO_ALLOWED` へ推定しない。

## Required authorization context

すべての Gateway request は、後続 Task Packet Schema が表現する次の値を
解決できなければならない。

```text
policyVersion
policyEnablementRef
taskPacketId
taskPacketVersion
authorityRefs[]
authoritySetVersion
authorityRootDigest
authoritySnapshotDigest
implementationStartRef (mutation when applicable)
unresolvedHolds[]
autoApprovalState
autoUntilGateState
externalWritePermissions
repository
baseRef
baselineSHA
expectedHeadSHA (mutation / external write when applicable)
expectedIndexTreeSHA (mutation when applicable)
expectedWorktreeDigest (mutation when applicable)
leaseId / leaseOwnerId / fencingToken / leaseExpiresAt (mutation when applicable)
capabilities[]
risk
riskRuleSet
allowedReadPaths[]
allowedPaths[]
deniedPaths[]
sensitivePaths[]
dataClassificationManifest
ciRedactionPolicyDigest (ci.read when applicable)
ciArtifactClassificationManifest (ci.read when applicable)
limits
approvalRef
expiresAt
```

必須値がない、形式不明、署名・発行元を検証できない、期限切れ、取消済み、
対象・操作・範囲・版が一致しない場合は DENY とする。

Agent は `policyEnablementRef`、Task Packet、approval、risk、limits、
`allowedPaths` を自分で発行・拡張・更新してはならない。

### Authority intersection

Policy enablement approval は trusted authority registry の
`authoritySetVersion + authorityRootDigest` に拘束する。Gateway は request の
`authorityRefs[]` を信頼せず、root から全 transitive authority closure を取得する。
closure は各 authority の ID、version、content digest、親 authority ID を含む
canonical sorted manifest とし、その digest が root と一致必須である。

Gateway は trusted closure と request の `authorityRefs[]` が完全一致することを
検証し、immutable authority snapshot から operation classification、kill switch、
HOLD、external write 境界を再計算する。Task Packet / request が authority を
追加・省略・置換して root を作り直すことはできない。

```text
effectiveClassification = strictest(
  upperAuthorityClassifications,
  AUTONOMY-POLICY-V1 classification,
  Task Packet restriction
)
```

- trusted root 不明、closure 取得不能、authority omission、stale / digest mismatch /
  conflict は
  `DENY / POLICY_BLOCKED / AUTHORITY_CONFLICT`
- mutation は exact-slice `implementationStartRef` が Accepted でなければ
  `DENY / POLICY_BLOCKED / IMPLEMENTATION_START_REQUIRED`
- `unresolvedHolds[]` が空でなければ
  `DENY / POLICY_BLOCKED / UNRESOLVED_HOLD`
- inherited kill switch が disabled なら
  `DENY / POLICY_BLOCKED / POLICY_NOT_ENABLED`
- external write は上位 authority の `externalWritePermissions` が対象 capability
  を明示しなければ `DENY / POLICY_BLOCKED / EXTERNAL_WRITE_NOT_ALLOWED`
- Policy enablement approval / Task Packet approval は上位 authority を
  supersede しない

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

approval issuer は trusted issuer registry に存在し、signature、issued-at、
expiry、revocation state を検証できなければならない。issuer 不明、期限切れ、
取消済みは、それぞれ canonical deny reason へ一意に mapping する。

## Baseline and head binding

### Baseline

- `baselineSHA` は full commit SHA とする。
- Task Packet 発行後は immutable とする。
- `baseRef` の現在値が `baselineSHA` と一致しない場合は
  `DENY / BASELINE_MOVED / BASELINE_MOVED` とする。
- check は最初の mutation 前、および push / Draft PR create/update /
  review request の直前に再実行する。
- Agent による自動 rebase、baseline 更新、approval 流用は禁止する。

### Mutable head

- mutation / external write は直前状態を `expectedHeadSHA` に拘束する。
- mutation は専用 Git worktree と repository / worktree / branch 単位の
  cross-task exclusive lease を必須とする。1 worktree を複数 task で共有しない。
- trusted lease store の resource key は immutable
  `repositoryId + worktreeId + fullBranchRef` とする。acquire は compare-and-swap で
  atomic、owner は `taskPacketId + executionId`、fencing token は resource ごとの
  monotonic unsigned integer とする。
- 新規 acquire / owner 移転は fencing token を必ず増加する。renewal は同じ owner /
  token の unexpired lease のみ許可し、expiry を延長しても token を減少・再利用しない。
- 全 mutation request、limit reservation、idempotency record、`PREPARED` audit は
  `leaseId + fencingToken` に拘束する。
- mutation coordinator は apply 直前に trusted lease store と token / owner / expiry、
  head / index / worktree digest を同一 critical section で比較する。stale / expired
  token は `DENY / POLICY_BLOCKED / LEASE_STALE`。
- Agent / backend process に worktree の直接 write permission を与えず、write は
  fencing-aware mutation coordinator または token-bound sandbox mount だけが行う。
- sandbox は lease expiry / token supersession で write mount を revoke して process
  を停止する。check 後 apply 前に token が変わった場合も write を拒否する。
- task 開始時は `HEAD = baselineSHA`、index = baseline tree、mutable worktree =
  clean でなければならない。
- `expectedIndexTreeSHA` は index の canonical tree object SHA、
  `expectedWorktreeDigest` は mutable roots の canonical snapshot digest とする。
- snapshot は canonical path、mode、content SHA-256 の tuple を path byte order で
  sort して hash し、tracked / untracked file を含む。`.git`、immutable dependency
  root、packet 固有 ephemeral root だけを除外できる。
- immutable / ephemeral root の manifest と digest も Task Packet approval に拘束し、
  mutation adapter / sandbox の write target にできない。
- branch / Draft PR head が一致しない場合は
  `DENY / HEAD_MOVED / HEAD_MOVED` とする。
- index tree または worktree digest が request の expected 値と一致しない場合は
  `DENY / WORKTREE_MOVED / WORKTREE_MOVED` とする。
- 成功した mutation の result SHA を次 request の `expectedHeadSHA` として
  明示的に引き継ぎ、result index tree / worktree digest も同様に引き継ぐ。
- `code.edit` は proposed postimage を一時領域で構成し、path / risk / cumulative
  file・byte limits を検証して reservation を取得した後だけ atomic に反映する。

baseline は task の承認起点、expected head / index tree / worktree digest は
task 内の逐次・cross-task 競合防止であり、相互に代替しない。

## Read boundary

`repo.read` と `test.run.readRoots` は path ごとに effective classification を
再評価する。Task Packet の `allowedReadPaths[]` は後述の exact-file /
directory-root grammarを使い、trusted authority root に含まれる
`dataClassificationManifest` と `sensitivePaths[]` を緩和できない。

```text
read target ∈ allowedReadPaths
read target ∉ deniedPaths
read target ∉ sensitivePaths
data classification ∈ {PUBLIC, INTERNAL_SOURCE}
```

`SECRET` / `CREDENTIAL` / `PERSONAL_DATA` / `PRODUCTION_DATA` は read を DENY する。
path の data classification がない、複数分類が衝突する、manifest digest が
authority root と一致しない場合は `UNKNOWN` として DENY する。

minimum `sensitivePaths` は `.env` 系、secret/credential directory、private key、
production-data fixture / export とする。名前だけに依存せず、trusted
`dataClassificationManifest` の分類を優先する。

結果:

```text
repo.read / test.run sensitive target
→ DENY / POLICY_BLOCKED / SENSITIVE_READ_FORBIDDEN
```

`ci.read` は provider の raw log / artifact を Agent へ直接返さない。trusted
redaction proxy が run / job / chunk / artifact の immutable ID と content digest を
検証し、authority root に拘束された `ciRedactionPolicyDigest` で secret /
credential / personal-data / production-data marker を redact する。

- log chunk は redaction verification `PASS` の content だけ返す。
- artifact は `ciArtifactClassificationManifest` が `PUBLIC` または
  `INTERNAL_SOURCE` と分類したものだけ返す。
- manifest / content digest mismatch、分類なし、redaction status 不明、
  unredacted sensitive marker 検出は
  `DENY / POLICY_BLOCKED / SENSITIVE_READ_FORBIDDEN`。
- redaction 後 content と audit には raw sensitive value を残さない。

## test.run sandbox

`test.run` は shell command 文字列を直接受理しない。Task Packet approval に
digest-bound された `commandManifest` を必須とする。

```text
executable path + executable digest
argv[]
cwd
environment key allowlist + value digest
readRoots[]
writeRoots[]
ephemeralWriteRoots[]
network = DENY
timeoutMs
maxProcesses
```

- `cwd` / `readRoots` / `writeRoots` は repository 内の canonical path に限定する。
- `readRoots` は `allowedReadPaths` の subset とし、`deniedPaths` /
  `sensitivePaths` と交差させない。
- `writeRoots` は `allowedPaths` の subset とする。
- secret / credential を ambient environment から継承しない。
- `ephemeralWriteRoots` は packet 固有 sandbox 内に限定し、commit / push /
  artifact publish の入力にしない。
- outbound / inbound network、deploy、publish、package upload、外部 state mutation
  を sandbox で拒否する。
- executable / manifest digest、environment、filesystem policy を実行直前に検証する。
- 実行前後に repository filesystem inventory を取得し、許可外 write または
  inventory 不明を検出した場合は task を latch して次 action を DENY する。
- OS-level sandbox で上記を強制できない backend は `test.run` adapter を
  executable として登録しない。

`test.run` が repository 外 write、許可外 write、network、secret inheritance を
要求した場合は `DENY / POLICY_BLOCKED / TEST_SANDBOX_VIOLATION` とする。

## allowedPaths enforcement

`code.edit` と、変更差分を外部反映する `commit.create` / `branch.push` /
Draft PR 操作、および `test.run.writeRoots` に適用する。

pattern grammar は glob / regex を使わず、次の 2 種類だけとする。

```text
exact file:     docs/process/example.md
directory root: docs/process/
```

1. UTF-8 を NFC normalize し、`\` を拒否して repository-relative POSIX path とする。
2. absolute path、empty segment、`.` / `..`、NUL、repository 外を拒否する。
3. exact file は byte-for-byte exact match、directory root は末尾 `/` を含む
   segment-prefix match とする。case-sensitive とする。
4. case-insensitive filesystem でも Git index の canonical case と一致必須とし、
   case collision は DENY。
5. symlink は内部向けを含め mutation target として拒否する。
6. hard link count が 1 でない既存 file は mutation target として拒否する。
7. nested worktree、submodule 内容、submodule pointer mutation を拒否する。
8. create / modify / delete は対象 path が `allowedPaths` の少なくとも 1 条件に
   match 必須。
9. rename / move は source と destination の両方が match 必須。
10. `deniedPaths` が match した場合は常に deny し、`allowedPaths` で上書きしない。
11. generated file、lockfile も暗黙許可しない。
12. path 判定不能、Unicode/case collision、diff inventory 不完全は DENY。

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

limit ledger は Task Packet ごとの transactional store とする。各 action は
side effect 前に compare-and-increment で capacity を atomic reserve し、
成功時に commit、side effect 前の失敗時に rollback する。結果不明または
side effect 後の audit failure は reservation を保持して task を latch する。
並行 request が同じ残 capacity を共有して通過してはならない。

counter semantics:

| Counter | Canonical measurement |
|---|---|
| `maxRepairCycles` | verification failure 後に発行された unique `repairCycleId`。initial attempt は含めない |
| `maxConcurrentExecutions` | unexpired execution lease の同時数 |
| `maxBranchesCreated` | successful `branch.create` target の unique 数 |
| `maxOpenDraftPullRequests` | task が作成し、close/convert されていない Draft 数 |
| `maxCommits` | baseline descendant として task が作成した successful commit 数 |
| `maxPushes` | successful remote ref update 数。retry replay は idempotency により再計上しない |
| `maxChangedFiles` | baseline tree と proposed effective snapshot（HEAD + index + uncommitted worktree + proposed postimage）の cumulative diff にある unique preimage / postimage path 数。untracked を含み、rename は両 path を数える |
| `maxChangedBytes` | 同じ effective snapshot diff の各 path について create/modify は postimage size、delete は preimage size、rename は大きい方を合計 |
| `maxActionRequests` | valid task ID を持つ `REQUESTED` audit の数。DENY も含む |

lease / reservation は期限を持つが、期限切れを成功・未実行の推測に使わない。
idempotency ledger と result audit を照合できない reservation は Human review まで
release しない。

## Idempotency

- mutation / external write request は `idempotencyKey` 必須。
- key scope は次の canonical tuple の SHA-256 とする。

```text
policyVersion
policyEnablementRef
authoritySetVersion
authorityRootDigest
taskPacketId
taskPacketVersion
approvalRef
repository
baselineSHA
capability
targetSchemaVersion
target
```

`target` は free-form string / URL を受理しない。Capability Registry が
`targetSchemaVersion` と次の canonical representation を固定する。

| Capability | Canonical target |
|---|---|
| `repo.read` | `repositoryId + commitSHA + canonicalPath` |
| `code.edit` | `repositoryId + worktreeId + sorted canonicalPaths digest` |
| `test.run` | `repositoryId + worktreeId + commandManifestDigest` |
| `branch.create` / `branch.push` | `repositoryId + remoteId + fullRef` |
| `commit.create` | `repositoryId + worktreeId + parentSHA` |
| `pull_request.create_draft` | `repositoryId + headFullRef + baseFullRef` |
| `pull_request.update_draft` | `repositoryId + immutablePrNodeId` |
| `ci.read` | `repositoryId + runId + jobId + chunkOrArtifactId` |
| `review.request` | `repositoryId + immutablePrNodeId + reviewerKind + reviewPolicyDigest` |

repository owner/name、URL、remote alias は trusted registry で immutable
`repositoryId` / `remoteId` に解決する。ref は `refs/heads/...` の full form、
path は本 policy の canonical path、PR は provider の immutable node ID を使う。
alias が複数 resource に解決、display ID と immutable ID が不一致、schema version
不明、target field 欠落は `DENY / POLICY_BLOCKED / TARGET_MISMATCH` とする。

- canonical payload hash は request body に加え、`expectedHeadSHA`、
  `expectedIndexTreeSHA`、`expectedWorktreeDigest`、`leaseId`、`fencingToken`、
  risk、paths、limits snapshot を含む。
- 同じ key + 同じ canonical payload hash の再送は、前回結果を返して再実行しない。
- 同じ key + 異なる payload hash は
  `DENY / IDEMPOTENCY_CONFLICT / IDEMPOTENCY_CONFLICT`。
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
authoritySetVersion / authorityRootDigest / authoritySnapshotDigest
repository / baseRef / baselineSHA / expectedHeadSHA
expectedIndexTreeSHA / expectedWorktreeDigest
leaseId / leaseOwnerId / fencingToken
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
`AUDIT_INCOMPLETE` として Human review へ送る。既に発生した side effect を
authorization `DENY` に書き換えず、同じ idempotency key の自動 retry を禁止する。

primary audit sink が request 受理時に unavailable の場合、Gateway は side effect
なしで `DENY / AUDIT_UNAVAILABLE / AUDIT_UNAVAILABLE` を同期応答し、
task-wide kill latch を立てる。
secondary security telemetry への記録を試みるが、durable DENY audit を保存できない
可能性は availability incident として明示する。audit 不可を理由に実行へ進まない。

## Gateway decision contract

### Authorization result

```text
decision = ALLOW | DENY
code =
  POLICY_BLOCKED
  | BASELINE_MOVED
  | HEAD_MOVED
  | WORKTREE_MOVED
  | IDEMPOTENCY_CONFLICT
  | LIMIT_EXCEEDED
  | AUDIT_UNAVAILABLE

reason =
  REQUEST_INVALID
  | UNKNOWN
  | POLICY_MISMATCH
  | POLICY_NOT_ENABLED
  | AUTHORITY_CONFLICT
  | IMPLEMENTATION_START_REQUIRED
  | UNRESOLVED_HOLD
  | EXTERNAL_WRITE_NOT_ALLOWED
  | CAPABILITY_UNAVAILABLE
  | RISK_NOT_ALLOWED
  | APPROVAL_REQUIRED
  | APPROVAL_INVALID
  | ISSUER_UNTRUSTED
  | APPROVAL_EXPIRED
  | APPROVAL_REVOKED
  | TARGET_MISMATCH
  | BASELINE_MOVED
  | HEAD_MOVED
  | WORKTREE_MOVED
  | LEASE_STALE
  | HUMAN_ONLY
  | FORBIDDEN
  | OUT_OF_SCOPE
  | SENSITIVE_READ_FORBIDDEN
  | TEST_SANDBOX_VIOLATION
  | DRAFT_HEAD_MUTATION
  | LIMIT_EXCEEDED
  | IDEMPOTENCY_CONFLICT
  | AUDIT_UNAVAILABLE
```

`ALLOW` は code / reason を持たない。`DENY` は canonical code と reason を
必ず 1 つずつ持つ。内部例外文字列を policy reason として返さない。

reason から code への mapping は次で固定する。

| Reason | Code |
|---|---|
| `REQUEST_INVALID` / `UNKNOWN` / `POLICY_MISMATCH` | `POLICY_BLOCKED` |
| `POLICY_NOT_ENABLED` / `AUTHORITY_CONFLICT` | `POLICY_BLOCKED` |
| `IMPLEMENTATION_START_REQUIRED` / `UNRESOLVED_HOLD` | `POLICY_BLOCKED` |
| `EXTERNAL_WRITE_NOT_ALLOWED` | `POLICY_BLOCKED` |
| `CAPABILITY_UNAVAILABLE` / `RISK_NOT_ALLOWED` | `POLICY_BLOCKED` |
| `APPROVAL_REQUIRED` / `APPROVAL_INVALID` | `POLICY_BLOCKED` |
| `ISSUER_UNTRUSTED` / `APPROVAL_EXPIRED` / `APPROVAL_REVOKED` | `POLICY_BLOCKED` |
| `TARGET_MISMATCH` | `POLICY_BLOCKED` |
| `HUMAN_ONLY` / `FORBIDDEN` / `OUT_OF_SCOPE` | `POLICY_BLOCKED` |
| `SENSITIVE_READ_FORBIDDEN` | `POLICY_BLOCKED` |
| `TEST_SANDBOX_VIOLATION` / `DRAFT_HEAD_MUTATION` | `POLICY_BLOCKED` |
| `BASELINE_MOVED` | `BASELINE_MOVED` |
| `HEAD_MOVED` | `HEAD_MOVED` |
| `WORKTREE_MOVED` | `WORKTREE_MOVED` |
| `LEASE_STALE` | `POLICY_BLOCKED` |
| `LIMIT_EXCEEDED` | `LIMIT_EXCEEDED` |
| `IDEMPOTENCY_CONFLICT` | `IDEMPOTENCY_CONFLICT` |
| `AUDIT_UNAVAILABLE` | `AUDIT_UNAVAILABLE` |

malformed field / unsupported enum / invalid digest or timestamp は `REQUEST_INVALID`、
signature は valid だが issuer が trust registry にない場合は `ISSUER_UNTRUSTED`、
期限切れは `APPROVAL_EXPIRED`、取消済みは `APPROVAL_REVOKED`、
repository / operation / scope / version mismatch は `TARGET_MISMATCH` とする。

### Execution result

authorization `ALLOW` 後の backend execution は別 result とする。

```text
executionStatus =
  SUCCEEDED
  | FAILED
  | UNKNOWN
  | AUDIT_INCOMPLETE
```

`UNKNOWN` / `AUDIT_INCOMPLETE` は task-wide kill latch を立て、同一 action の
自動 retry と後続 action を止める。既発生 side effect の有無を推測しない。

### Evaluation order

```text
1. request fields, trust registry, and policy version valid?
2. audit sink available and REQUESTED audit durable?
3. upper authority snapshot valid and conflict-free?
4. inherited kill switches / HOLD / Implementation Start permit?
5. operation known and effective classification == AUTO_ALLOWED?
6. executable capability adapter exists?
7. policy enablement active?
8. Task Packet allows capability and target?
9. effective risk == LOW?
10. approvals valid and exact?
11. external write permission valid when applicable?
12. lease owner / fencing token valid when applicable?
13. baseline, expected head, index tree, and worktree digest match?
14. read classification / paths / command sandbox within scope?
15. idempotency valid?
16. limits atomically reserved?
17. PREPARED audit durable and bound to fencing token?
18. ALLOW
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
missing / conflicting authority → DENY / POLICY_BLOCKED / AUTHORITY_CONFLICT
authority omitted from trusted closure → DENY / POLICY_BLOCKED / AUTHORITY_CONFLICT
missing exact-slice Implementation Start → DENY / POLICY_BLOCKED / IMPLEMENTATION_START_REQUIRED
unresolved HOLD → DENY / POLICY_BLOCKED / UNRESOLVED_HOLD
external write while upper authority says NONE → DENY / POLICY_BLOCKED / EXTERNAL_WRITE_NOT_ALLOWED
repo.read / test.run secret or production-data path → DENY / POLICY_BLOCKED / SENSITIVE_READ_FORBIDDEN
ci.read unredacted / unclassified sensitive log → DENY / POLICY_BLOCKED / SENSITIVE_READ_FORBIDDEN
test.run write/network outside sandbox → DENY / POLICY_BLOCKED / TEST_SANDBOX_VIOLATION
Draft update containing head mutation → DENY / POLICY_BLOCKED / DRAFT_HEAD_MUTATION
concurrent / uncommitted worktree mismatch → DENY / WORKTREE_MOVED / WORKTREE_MOVED
expired / superseded lease token → DENY / POLICY_BLOCKED / LEASE_STALE
lease changes between precheck and atomic apply → DENY / POLICY_BLOCKED / LEASE_STALE
uncommitted proposed diff over file/byte limit → DENY / LIMIT_EXCEEDED / LIMIT_EXCEEDED
idempotency key collision → DENY / IDEMPOTENCY_CONFLICT / IDEMPOTENCY_CONFLICT
audit sink unavailable → DENY / AUDIT_UNAVAILABLE / AUDIT_UNAVAILABLE
```

cross-module import / call / type-reference / export fixtures は
`effectiveRisk >= MEDIUM`、same-module edge fixture は当該 escalator なしとする。

同じ client idempotency key を異なる `taskPacketVersion` で送った fixture は、
旧 packet の result を replay しないことを検証する。新しい scoped key として
再評価し、current state precondition を通常どおり適用する。

HUMAN_ONLY / FORBIDDEN canonical v1 projection の全行について、
table-driven negative test を生成し、Registry に executable adapter がないことと
required classification / reason を照合する。

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
- trusted authority closure の完全性と strict intersection が判定可能
- risk escalator matcher と unsupported / unknown 時の DENY が一意
- baseline / head / index / worktree / read-write paths / atomic limits /
  idempotency / approval / audit が判定可能
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
