# Decision-FC-5 — Catalog version identifier representation ownership candidate packet

この文書は、**Decision-FC-5**（Catalog version identifier representation ownership）の
**Candidate Packet** である。Accepted 正本ではない。

Decision-FC-5 は、Decision-FC-4 Accepted / Option C が未決のまま残した
`catalogVersionIdentifier` の **表現形式（representation）の決定主体と責務境界**
だけを扱う。

UUID / hash / semver / DEC-number 等の具体方式、実際の identifier 値、DEC 番号、
snapshot physical schema、storage / provider、TypeScript、validator、fixture、
FindingCode values / numbering / mapping は扱わない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FC-5
Status: CANDIDATE / NOT ACCEPTED
Selected: NONE
Human substantive-unit selection: 2026-08-08
main baseline: 192a8fb6c1bc24e151e862459e4b97b5571a0b0c
Depends on:
  Decision-FC-1 Accepted / Option B
  Decision-FC-2 Accepted / Option C
  Decision-FC-3 Accepted / Option C
  Decision-FC-4 Accepted / Option C
Catalog ownership: Issue #8 / new business DEC
Delivery boundary: versioned immutable catalog snapshot input
Snapshot logical contract: Complete logical contract surface
Identifier logical contract: Complete identifier logical contract
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
Identity assembly: UNCHANGED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / Independent Review 進行状態）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-fc-4-catalog-version-identifier-contract.md`](./decision-fc-4-catalog-version-identifier-contract.md)
- [`decision-fc-3-finding-code-catalog-snapshot-logical-contract.md`](./decision-fc-3-finding-code-catalog-snapshot-logical-contract.md)
- [`decision-fc-2-finding-code-catalog-delivery-boundary.md`](./decision-fc-2-finding-code-catalog-delivery-boundary.md)
- [`decision-fc-1-finding-code-catalog-ownership.md`](./decision-fc-1-finding-code-catalog-ownership.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

### Human unit selection（durable）

```text
Human selection: Decision-FC-5 as next substantive unit
Kind: identifier representation ownership packet first（read-only / docs-only）
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent execution evidence: NOT Human Acceptance evidence
```

本 packet は representation ownership 候補を固定する。Option の Accepted は別 Human Decision を要する。

## FC-1〜FC-4 から継承する固定境界

```text
Catalog ownership / change control:
  Issue #8 / new business DEC（FC-1 Option B）

Delivery boundary:
  versioned immutable catalog snapshot input（FC-2 Option C）

Snapshot logical contract:
  Complete logical contract surface（FC-3 Option C）

Identifier logical contract:
  Complete identifier logical contract（FC-4 Option C）

Issuance / uniqueness:
  Issue #8 business catalog change control

Opaque boundary:
  technical layer MUST NOT interpret identifier internal structure
  technical layer MUST NOT generate / re-number / infer identifier

Edition mapping:
  1 catalog edition ↔ 1 identifier
  immutable once associated

Reuse across editions:
  PROHIBITED

FindingIdentity / stable Finding ID / assembleFindingIdentity:
  UNCHANGED
```

FC-5 は ownership / delivery / snapshot logical contract / identifier logical contract を変更しない。

技術層が UUID 等を勝手に仮定して opaque boundary を上書きすることは禁止する。

## FC-5 が答える問い

```text
catalogVersionIdentifier の表現形式を誰が決め、
business DEC と technical contract の責務をどこで分け、
technical layer が許される構文検証の範囲は何か。
また representation 変更時の change-control と、
unknown / unsupported representation の fail-closed 責務は誰が担うか。
```

FC-5 は、UUID / hash / semver / DEC-number を採択しない。

## 判断単位の分離（必須）

| Unit ID | 判断単位 | 本 packet での状態 | 混ぜてはならないもの |
|---|---|---|---|
| **Decision-FC-4** | identifier logical contract | **Accepted / Option C** | representation ownership |
| **Decision-FC-5** | identifier **representation ownership** | **OPEN / CANDIDATE** | UUID/hash/semver 採択・実装 |
| Representation strategy selection | UUID / hash / semver / DEC-number 等 | **DO NOT START** | ownership 自体 |
| Snapshot materialization / schema / provider | 物理化・保存・供給 | **DO NOT START** | representation ownership |
| FindingCode 値一覧 / 採番 / mapping | business catalog 本文 | **UNDECIDED** | FC-5 |

```text
Independent acceptance: REQUIRED
Bundle FC-5 + UUID/hash/semver Accepted: FORBIDDEN
Bundle FC-5 + TypeScript / validator / fixture Accepted: FORBIDDEN
Order preference:
  FC-4 → FC-5 →（必要なら）representation strategy Decision → materialization / schema / provider
```

## Candidate Options

### Option A — Business DEC owns representation entirely

Issue #8 business catalog change control が、identifier representation の決定を含む。

```text
Representation ownership:
  Issue #8 business DEC

Technical contract role:
  opaque token を受け取るのみ
  representation strategy を採択しない

Allowed technical syntax validation:
  非空・制御文字禁止など、意味を持たない最小構造検査に限定
  UUID / hash / semver 前提の検証は禁止

Change control:
  representation 変更は Issue #8 DEC の新規採択または改訂

Fail-closed:
  unknown / unsupported representation は正常 identifier と混同しない
  判定責務の正本は business DEC / 後続契約
```

利点: FC-4 opaque boundary と ownership を強く一致させられる。

欠点: 技術層が必要とする最小構文検証の境界が弱いと、実装時に暗黙仮定が入りやすい。

### Option B — Technical contract owns representation format

Issue #27 等の technical contract が representation format を所有する。

```text
Representation ownership:
  technical contract

Business DEC role:
  edition / membership / ownership のみ
  identifier 文字列形式は technical side が決める

Allowed technical syntax validation:
  technical contract が定義する format に従う

Change control:
  technical contract 改訂

Fail-closed:
  technical contract が unknown / unsupported を定義
```

利点: 実装都合の format を早く固定できる。

欠点: 技術側が UUID 等を仮定すると、FC-4 の opaque / non-inference 境界を事実上上書きしやすい。business ownership との分離が崩れる。

### Option C — Split ownership with explicit syntax-validation ceiling

representation strategy の採択主体と、technical layer が許される構文検証の上限を分離して固定する。

```text
Representation strategy ownership:
  Issue #8 business catalog change control
  UUID / hash / semver / DEC-number 等の採択は business DEC 側
  FC-5 では具体方式を採択しない

Technical contract role:
  Accepted representation profile が存在する後に限り、
  非意味的（non-semantic）な構造検証だけを定義しうる
  identifier の版意味・edition 推定・生成・再採番は禁止

Allowed technical syntax validation ceiling:
  presence / non-empty
  disallowed control characters
  optional charset / length / delimiter shape
    （いずれも Accepted profile に明示された場合のみ）
  MUST NOT encode version precedence
  MUST NOT infer edition from syntax
  MUST NOT assume UUID / hash / semver unless business DEC Accepted that strategy

Change control:
  representation strategy 変更: Issue #8 DEC 新規採択または改訂
  technical syntax profile 変更: technical Decision / contract 改訂
  technical profile は business 未採択 strategy を先取りできない

Fail-closed responsibility:
  identifier missing / malformed / unknown: FC-4 境界を継承
  unsupported representation:
    business-Accepted strategy / profile に適合しない場合
    正常 catalog version と混同しない
  Result names / types: FC-5 では未定義
```

利点:

- FC-4 opaque boundary を維持したまま、将来の最小構文検証余地を明示できる。
- UUID / hash / semver を今決めずに ownership だけ固定できる。
- technical 側の暗黙 format 仮定を禁止できる。

欠点:

- Accepted 後も representation strategy Decision が別途必要。
- syntax profile の具体内容は後続で決める必要がある。

### Option D — HOLD

identifier representation ownership を現時点では採択しない。

```text
Decision-FC-5:
  HOLD

UUID / hash / semver / DEC-number strategy:
  DO NOT START

Implementation:
  DO NOT START
```

## 比較

| 観点 | Option A | Option B | Option C | Option D |
|---|---|---|---|---|
| FC-4 opaque boundary 維持 | 強い | 弱い | 強い | N/A |
| business ownership 維持 | Yes | 部分的に崩れる | Yes | Yes |
| technical が format を先取り | No | Yes | No | No |
| 最小構文検証の天井を明示 | 弱い | Yes（ただし所有が tech） | Yes | No |
| UUID/hash/semver を今決める | No | No（所有だけ tech） | No | No |
| unknown / unsupported fail-closed | 部分 | 部分 | Yes | No |
| Implementation Start | HOLD | HOLD | HOLD | HOLD |

## Agent recommendation（non-binding）

```text
Recommendation: Option C
Binding: NO
```

理由:

- FC-4 の「技術層は identifier を解釈・生成・再採番・推定しない」を維持できる。
- 将来必要な最小構文検証と、UUID 等の方式採択を混同しない。
- representation strategy の決定主体を Issue #8 business DEC に残せる。
- technical 側が勝手に UUID と仮定して opaque boundary を上書きする失敗モードを防げる。
- FindingCode 値一覧・schema・storage・provider・実装を先取りしない。

この recommendation は Human Decision ではない。

## FC-5 で決めないこと

```text
UUID / hash / semver / DEC-number strategy: UNDECIDED / DO NOT START
actual identifier values: UNDECIDED
identifier syntax concrete profile: NOT STARTED
Issue #8 FindingCode catalog DEC number: UNASSIGNED
snapshot physical schema: NOT STARTED
snapshot materialization: NOT STARTED
snapshot storage / SharePoint location: NOT STARTED / NO-GO
runtime provider: NOT STARTED
TypeScript type: NOT STARTED
validator: NOT STARTED
fixture: NOT STARTED
FindingCode values: UNDECIDED
code numbering: UNDECIDED
criterionId mapping: UNDECIDED
Implementation Start: HOLD
```

AI は上記を補完しない。

## Contract compatibility gate

どの Option を選択しても、次を満たすことを必須とする。

```text
Decision-FC-1: UNCHANGED
Decision-FC-2: UNCHANGED
Decision-FC-3: UNCHANGED
Decision-FC-4: UNCHANGED
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
assembleFindingIdentity: UNCHANGED
FindingCode remains caller-supplied
No identifier inference
No identifier generation by technical layer
No UUID/hash/semver assumption without business Accepted strategy
No catalog fallback
Contract break: NO
```

FC-5 Accepted を理由に既存 Identity 契約や FC-1〜FC-4 Accepted を変更してはならない。

## Acceptance 記録テンプレ

```text
Decision-FC-5:
  ACCEPTED | HOLD | REJECTED
Selected: A | B | C | D | (amended)

Representation ownership:
  <business DEC | technical contract | split>

Business DEC responsibility:
  <one or more sentences>

Technical contract responsibility:
  <one or more sentences>

Allowed technical syntax validation:
  <ceiling>

Change control:
  <representation change boundary>

Fail-closed:
  <unknown / unsupported representation responsibility>

FindingIdentity: UNCHANGED
FC-1〜FC-4: UNCHANGED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

## Human Decision Gate

```text
Decision-FC-5: CANDIDATE / NOT ACCEPTED
Selected: NONE
Independent Review: REQUIRED
Human Decision: REQUIRED
Implementation auto-start: FORBIDDEN
```

Independent Review が PASS しても、Option は自動採択しない。

Human が Option を明示選択するまで Candidate 状態を維持する。

## 実装ゲート

```text
Decision-FC-5: CANDIDATE / NOT ACCEPTED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN

src/** changes: prohibited
tests/** changes: prohibited
UUID / hash / semver / DEC-number selection: prohibited
identifier value invention: prohibited
DEC numbering by AI: prohibited
snapshot schema creation: prohibited
provider implementation: prohibited
storage implementation: prohibited
TypeScript type creation: prohibited
validator creation: prohibited
fixture creation: prohibited
FindingCode value invention: prohibited
```

## 継続する境界

```text
FindingSeverity: NOT ADOPTED
SEV-2-ASSIGN: N/A / DO NOT START
SharePoint changes: NO-GO
tenant changes: NO-GO
Microsoft 365 changes: NO-GO
Entra changes: NO-GO
deploy: NO-GO
real data: PROHIBITED
```

## 次の停止点

```text
Decision-FC-5: CANDIDATE / NOT ACCEPTED
→ Independent Review of this packet
→ Human Option selection
→（Accepted の場合のみ）representation strategy は別 Human Start
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Independent Review が PASS しても、Ready / Merge / Implementation / Option 採択を自動実行しない。
