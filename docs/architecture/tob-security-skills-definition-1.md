# TOB-SECURITY-SKILLS-DEFINITION-1

この文書は、Trail of Bits Skills Marketplace を既存のセキュリティ監査工程へ追加するための exact-scope definition である。

この文書は、既存の Skill 正本、判定基準、権限境界、CI、Release Gate を変更しない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: TOB-SECURITY-SKILLS-DEFINITION-1
Kind: Exact Scope Definition (docs-only)
Definition Start: GO RECEIVED
Definition status: DRAFT / NOT YET INDEPENDENTLY REVIEWED
Marketplace installation: NOT STARTED
Security audit execution: NOT STARTED
CI integration: NOT AUTHORIZED
Finding fix: NOT AUTHORIZED
Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
```

## 1. Authority and exact basis

本Definitionのrepository basisは次のとおりとする。

```text
expected main:
  7b37f156864ac615b4fa2713ff8c949e0744ecc4

definition branch start basis:
  7b37f156864ac615b4fa2713ff8c949e0744ecc4
```

Trail of Bits Marketplace は外部参照であり、本repositoryの正本ではない。

Definition作成時に観測した upstream snapshot は次のとおりである。

```text
upstream repository:
  trailofbits/skills

observed upstream main:
  293fb74c3151cceda32a85a545fe8acd67f8f5c6
```

この upstream SHA はDefinition作成時の観測値であり、後続 Environment Pilot の installation authority ではない。

Environment Pilot は実行直前に upstream の exact SHA と対象Pluginの存在を再確認する。

## 2. Purpose

目的は、既存のAI開発品質ゲートへTrail of Bitsのセキュリティ監査知識を追加Evidenceとして接続することである。

Trail of Bits Skills は次のいずれにも昇格させない。

```text
project SSOT
internal Skill SSOT
Gate authority
Merge authority
Release authority
Deploy authority
U2 Deep Security Scan authority
```

Trail of Bitsの出力は、既存の監査・検証工程へ渡す外部Evidenceとしてのみ扱う。

## 3. Existing-system precedence

競合時の優先順位は次のとおりとする。

```text
Accepted / LOCKED Decisions
  > repository security / governance / permission SSOT
  > existing Gate definitions and shared judgement rules
  > this TOB integration definition
  > Trail of Bits raw instructions and raw findings
```

主な既存正本は次のとおりである。

```text
SECURITY.md
.agents/mcp/permission-matrix.md
.agents/skills/_shared/judgement-rules.md
.agents/skills/_shared/output-format.md
docs/development/quality-gates.md
docs/process/gate-definitions.md
docs/process/skill-catalog.md
.agents/commands/adapter-matrix.md
```

Trail of Bits側の指示が既存の禁止操作、Human GO、fail-closed、証跡規則と衝突する場合は既存正本を優先して停止する。

## 4. Integration model

Trail of Bits Skills は `.agents/skills/` の内部Skillとしてコピーまたは登録しない。

既存 `scripts/verify-skills.mjs` が内部Skill集合を固定しているため、外部Skillを同じregistryへ混在させない。

初期統合モデルは次のとおりとする。

```text
existing Logical Command / Agent / Skill workflow
              |
              v
        existing Audit process
              |
       +------+------+
       |             |
       v             v
Codex Security   Trail of Bits
                    |
                    v
             external evidence
                    |
                    v
        existing verification rules
```

Phase 1では新しいLogical Commandを追加しない。

既存の `review-pr`、`audit`、`release-check` の意味も変更しない。

Trail of Bits専用AdapterやCommandが必要かどうかはOperational Pilot後の別Decisionとする。

## 5. Initial Plugin set

初期評価対象は次の5 Pluginに限定する。

| Plugin | 役割 | 初期位置づけ |
|---|---|---|
| `differential-review` | PR / commit / diff のsecurity-focused review | Advisory evidence |
| `insecure-defaults` | fail-open、不安全なdefault、弱い設定の候補検出 | Advisory evidence |
| `static-analysis` | CodeQL / Semgrep / SARIFを用いた静的解析支援 | Advisory evidence |
| `supply-chain-risk-auditor` | direct dependencyの供給網リスク評価 | Advisory evidence |
| `fp-check` | security candidateのfalse-positive / exploitability検証 | On-demand verification only |

C / C++、Rust、smart contract、YARAなど、現在のTypeScript / SPFx application scopeに直接必要でないPluginは初期対象外とする。

`agentic-actions-auditor` は、AI coding agentをGitHub Actionsへ導入する別工程が発生した場合に再評価する。

## 6. Execution authority boundary

Trail of Bits実行時の `read-only` は、外部正本と製品worktreeに対する非mutationを意味する。

一部Pluginはreport、scratch directory、SARIF、PoC補助物などの生成を前提とするため、解析用一時領域への書込みまで禁止しない。

許可候補は次に限定する。

```text
isolated audit workspace read
isolated scratch write
local temporary report generation
local static-analysis output
local SARIF output
local git history read
public upstream metadata read
read-only GitHub metadata query
```

次は許可しない。

```text
main / Product RC tracked-file mutation
existing unrelated worktree mutation
GitHub Issue / PR / review mutation
Ready / Merge
force-push
SharePoint / Graph / Microsoft 365 / Entra mutation
App Catalog mutation
page mutation
schema / permission mutation
Production Binding
LIVE WRITE
Deploy
production data access or mutation
secret / token / cookie / credential recording
PII or real service-user data ingestion
```

Pluginが許可境界外の操作を要求した場合は、そのPlugin実行を `HOLD` とする。

## 7. Workspace isolation

Baseline Auditと後続監査は、authoritative worktreeとは分離したworkspaceで実行する。

```text
exact source SHA
    |
    v
isolated audit workspace
    |
    +-- repository read corpus
    +-- temporary reports
    +-- SARIF / scan output
    +-- plugin scratch files
```

監査の前後で次を確認する。

```text
source SHA unchanged
Product RC tracked files unchanged
unrelated worktree untouched
main unchanged
```

監査によって生成された一時物は、それ自体をrepository正本へ自動昇格させない。

## 8. Exact-SHA evidence rule

すべてのBaseline AuditとPR単位監査はsource basisを明示する。

最低限のEvidenceは次のとおりとする。

```text
repository
expected source SHA
observed source SHA
shaMatch
Trail of Bits upstream exact SHA
plugin name
plugin version or plugin content identity when exposed
runtime / Codex or Claude Code version when relevant
execution scope
excluded scope
result artifact path
result artifact hash when retained
execution limitations
```

`shaMatch=false` またはsource basis不明の場合、監査結果をcurrent-basis evidenceへ使用しない。

upstreamが更新された場合も、古いTrail of Bits実行結果を新しいPlugin revisionの結果として扱わない。

## 9. Finding lifecycle

Trail of Bitsのraw resultは、直ちに既存P0 / P1 / P2へ変換しない。

Finding lifecycleは次のとおりとする。

```text
TOB raw result
  -> TOB-CANDIDATE
  -> existing SECURITY.md verification
  -> reproduced / reasoned / unverified
  -> verified security finding or dismissed candidate
  -> existing P0 / P1 / P2 Gate judgement
```

`TOB-CANDIDATE` はverified vulnerabilityではない。

Trail of Bits側のseverity、risk label、TRUE POSITIVE等の語彙を既存P0 / P1 / P2へ自動変換しない。

verified security findingに昇格するには、少なくとも既存 `SECURITY.md` の到達可能性、入力制御、trust boundary / invariant侵害、source-to-sink path evidenceを満たす必要がある。

証跡不足は推測で補わず `unverified` とする。

## 10. fp-check special boundary

`fp-check` は通常のscannerではなくcandidate verification専用として扱う。

初期状態では常時有効化しない。

使用条件は次のとおりとする。

```text
existing security candidate exists
candidate identity is fixed
source SHA is fixed
verification scope is explicit
isolated plugin/session profile is used
PoC work remains local and synthetic
no external mutation is required
```

Trail of Bits repositoryで `fp-check` のStop hookが無関係なClaude Code sessionにも作用し得るという未解決Issueが存在するため、Environment Pilotではhook scopeを再確認する。

問題が未解決または影響範囲を隔離できない場合、`fp-check` は `HOLD / DISABLED BY DEFAULT` とする。

`fp-check` がTRUE POSITIVEと判定しても、既存 `SECURITY.md` verificationとP0 / P1 / P2判定を省略しない。

## 11. Supply-chain boundary

`supply-chain-risk-auditor` はactive vulnerability scannerの代替として扱わない。

dependency health、maintainer状況、upstream maintenance、advisory、publisher concentration、install-script等の供給網リスクEvidenceとして扱う。

既存または後続の脆弱性scanner結果とは別Evidenceとして保持する。

外部dependency repositoryへのwrite、Issue作成、PR作成は行わない。

## 12. Static-analysis boundary

`static-analysis` がCodeQL、Semgrep、SARIFその他の追加toolingを必要とする場合、未導入toolを暗黙にsystem-wide installしない。

追加toolのinstall、version pin、network requirement、cache、license、CI導入はEnvironment Pilotまたは別Definitionで評価する。

必要toolがない場合は結果を捏造せず、該当部分を `HOLD / NOT EXECUTED` とする。

## 13. Existing CI boundary

Phase 1からBaseline Auditまでは `.github/workflows/contracts-ci.yml` と `package.json` を変更しない。

現在の必須CIをTrail of Bits実行へ置き換えない。

初期状態は次のとおりとする。

```text
Trail of Bits execution mode: MANUAL / ADVISORY
Required CI check: NO
Merge Gate prerequisite: NO
Release Gate prerequisite: NO
Automatic fix: NO
Automatic issue creation: NO
Automatic PR creation: NO
```

CI統合はOperational Pilot後の `TOB-SECURITY-SKILLS-CI-INTEGRATION-DECISION-1` で別判断する。

## 14. Relationship to Codex Security and U2

Trail of Bits audit、Codex Security、U2 exact-SHA Deep Security Scanは独立したEvidence source / Gateとして扱う。

```text
Trail of Bits PASS
  != Codex Security PASS
  != U2 PASS
  != Release PASS
  != Deploy GO
```

Trail of Bitsでfindingが0件でもU2をclearしない。

Codex Securityでfindingが0件でもTrail of Bitsの実行済みとは扱わない。

複数系統で同一findingが出た場合はduplicate evidenceとして関連付け、finding件数を水増ししない。

## 15. Relationship to Limited Demo

本Definitionは `LIMITED-DEMO-DEPLOY-GATE-DEFINITION-1` の状態を変更しない。

Trail of Bitsの導入またはPASSはLimited Demo Deploy Precondition、Deploy GO、Post-Deploy Acceptanceを代替しない。

Limited Demo側のfixture-only、synthetic-only、no application-data I/O、no Production Binding、LIVE WRITE HOLDを維持する。

## 16. External data and prompt boundary

Trail of Bits Pluginへ渡す入力はrepository source、synthetic fixture、公開dependency metadataに限定する。

次は入力しない。

```text
real service-user data
production records
private authentication tokens
cookies
credentials
tenant secrets
unredacted production logs
personal information
```

外部LLM、subagent、CLI、network queryへ情報が渡る可能性があるPluginは、Environment Pilotでdata flowを確認できるまで実行しない。

## 17. Adoption phases

採用工程は次の順序に固定する。

```text
TOB-SECURITY-SKILLS-DEFINITION-1
  -> Independent Definition Review
  -> Human Environment Pilot GO
  -> TOB-SECURITY-SKILLS-ENVIRONMENT-PILOT-1
  -> Environment Verification
  -> Human Baseline Audit GO
  -> TOB-SECURITY-SKILLS-BASELINE-AUDIT-1
  -> Finding Reconciliation
  -> Independent Security Review
  -> Operational Pilot
  -> TOB-SECURITY-SKILLS-CI-INTEGRATION-DECISION-1
```

各矢印は自動承認ではない。

後続工程に明示Human GOが必要な場合は既存permission matrixとGate定義を優先する。

## 18. Environment Pilot acceptance criteria

Environment Pilotを `PASS` とするには次を確認する。

```text
EP-1  upstream exact SHA recorded
EP-2  selected Plugin identities verified
EP-3  installation location is outside repository SSOT
EP-4  .agents/skills remains unchanged
EP-5  Logical Commands remain unchanged
EP-6  CI remains unchanged
EP-7  Product RC remains unchanged
EP-8  scratch write boundary confirmed
EP-9  GitHub / M365 mutation is not required
EP-10 secret / PII exposure path is not introduced
EP-11 fp-check hook scope is isolated or fp-check remains disabled
EP-12 required external tools are enumerated without implicit system mutation
```

1項目でも証跡不足なら `HOLD` とする。

## 19. Baseline Audit acceptance criteria

Baseline Auditの監査実行自体をcompleteとするには次を確認する。

```text
BA-1 exact source SHA recorded and matched
BA-2 execution scope recorded
BA-3 Plugin identity recorded
BA-4 raw report retained or reproducibly summarized
BA-5 candidate count recorded without automatic P0/P1/P2 conversion
BA-6 limitations and unexecuted checks recorded
BA-7 Product RC unchanged
BA-8 GitHub / M365 / Deploy mutation none
BA-9 candidate reconciliation handed to existing SECURITY.md process
```

`BA-*` の達成はfindingが0件であることを要求しない。

Findingが存在する場合はfinding lifecycleへ移し、Baseline Audit自体とfinding remediationを分離する。

## 20. Fail-closed conditions

次のいずれかが発生した場合は該当工程を `HOLD` とする。

- exact source SHAを固定できない。
- Trail of Bits upstream identityを確認できない。
- Pluginがrepository SSOTへ直接変更を要求する。
- PluginがGitHub mutationを必須とする。
- PluginがSharePoint / M365 / Entra / production data accessを要求する。
- secret、token、cookie、credential、PIIを外部処理へ渡す必要がある。
- isolated workspaceを確保できない。
- required toolを確認できないまま結果を推測する必要がある。
- candidateをverifiedとして自動昇格する必要がある。
- Trail of Bits severityを既存P0 / P1 / P2へ自動変換する必要がある。
- Trail of Bits PASSをU2、Release、Deployへ昇格する要求がある。
- `fp-check` hookを他作業から隔離できない。
- main、Plugin revision、対象diffの混在によりEvidence basisが再現できない。

## 21. Explicitly out of scope

```text
Marketplace installation
Plugin execution
Baseline security scan
Finding remediation
Code modification
package.json modification
package-lock modification
.github workflow modification
.agents/skills registry modification
Logical Command modification
GitHub Issue / PR / review publication
Ready / Merge
U1 / U2 / U3 clearance
Limited Demo Deploy
App Catalog mutation
SharePoint page mutation
Production Binding
LIVE WRITE
production Deploy
```

## 22. Definition deliverable and next gate

このDefinition Startの成果物は、本ファイル1件のdocs-only definitionである。

Definitionの作成はMarketplace installまたはsecurity audit executionを認可しない。

```text
Current unit:
  TOB-SECURITY-SKILLS-DEFINITION-1

Current state:
  DEFINITION DRAFT CREATED

Next gate:
  Independent Definition Review

Environment Pilot:
  NOT AUTHORIZED

Baseline Audit:
  NOT AUTHORIZED

CI Integration:
  NOT AUTHORIZED
```
