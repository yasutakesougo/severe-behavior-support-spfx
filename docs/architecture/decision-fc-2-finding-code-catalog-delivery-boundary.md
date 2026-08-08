# Decision-FC-2 — FindingCode catalog delivery boundary

この文書は、**Decision-FC-2**（FindingCode catalog delivery boundary）の Accepted 正本である。

Decision-FC-2 は、Issue #8 の business DEC が所有する FindingCode catalog を、技術層へどの境界で渡すかだけを扱う。

FindingCode の具体値、コード番号、criterionId mapping、TypeScript enum / union、validator、fixture、実装は扱わない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FC-2
Status: Accepted
Selected: Option C
Human Acceptance: Explicit Human Option C selection on 2026-08-08
main baseline: 649a9778b7f5ab4758cc8e25be5f30c289430988
Candidate head: 1a7e86e4ebda099897a4781873dc232c5013f9ef
Depends on: Decision-FC-1 Accepted / Option B
Catalog ownership: Issue #8 / new business DEC
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
Identity assembly: UNCHANGED
Implementation Start: HOLD
```

上位入口:

- [`decision-fc-1-finding-code-catalog-ownership.md`](./decision-fc-1-finding-code-catalog-ownership.md)
- [`finding-identity-assembly.md`](./finding-identity-assembly.md)
- [`finding-stable-id.md`](./finding-stable-id.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

## Human Acceptance

```text
Human Acceptance: Explicit Human Option C selection on 2026-08-08
Decision-FC-2: Accepted
Selected: Option C
Delivery boundary: versioned immutable catalog snapshot input
Implementation Start: HOLD
```

```text
Agent recommendation: Option C
Binding: NO
Agent recommendation is not Human Acceptance evidence.
```

## Accepted 内容

Option C を採択する。

Issue #8 の Accepted business catalog を、**version を持つ immutable catalog snapshot** として delivery boundary へ渡す。

repository は FindingCode catalog の値そのものを ownership しない。

技術層は、取得済み catalog snapshot を明示的な入力として利用する。

```text
Business ownership:
  Issue #8 / new business DEC

Delivery boundary:
  versioned immutable catalog snapshot input

Catalog value ownership:
  Issue #8 DEC

Repository ownership of catalog values:
  NO

Snapshot materialization / storage:
  UNDECIDED / separate technical decision

Runtime provider:
  UNDECIDED / separate technical decision
```

この Decision は、business ownership と technical delivery を分離する。

また、将来の判定・監査で参照 catalog version を追跡できる境界を採用する。

## FC-1 から継承する固定境界

Decision-FC-1 Accepted / Option B により、FindingCode catalog の ownership / change control は Issue #8 の business DEC に置く。

FC-2 Accepted / Option C は、この ownership を変更しない。

既存 FindingIdentity 組立契約も変更しない。

```text
FindingCode:
  caller-supplied required input

Identity validation:
  isReasonCode only

Implicit catalog conversion:
  prohibited

FindingIdentity:
  UNCHANGED

stable Finding ID:
  UNCHANGED

assembleFindingIdentity:
  UNCHANGED
```

`assembleFindingIdentity` に catalog lookup、code generation、criterionId mapping を追加しない。

## Contract compatibility gate

```text
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
assembleFindingIdentity: UNCHANGED
FindingCode remains caller-supplied
isReasonCode remains structural validation boundary
No implicit code generation
No implicit criterionId mapping
No catalog fallback
Contract break: NO
```

## FC-2 で決めていないこと

```text
FindingCode values: UNDECIDED
code numbering: UNDECIDED
criterionId mapping: UNDECIDED
Issue #8 FindingCode catalog DEC number: UNASSIGNED
catalog version identifier logical contract: Decision-FC-4 Accepted / Option C（別単位）
actual catalog version string representation: UNDECIDED
snapshot logical contract: Decision-FC-3 Accepted / Option C（別単位）
snapshot schema: NOT STARTED
snapshot materialization: NOT STARTED
snapshot storage: NOT STARTED
provider interface: NOT STARTED
TypeScript enum / union: NOT STARTED
catalog validator: NOT STARTED
fixture: NOT STARTED
Implementation Start: HOLD
```

AI は上記を補完しない。

snapshot の論理契約（必須情報・version 一意識別責務・immutable の意味・
selected 整合・fail-closed 境界）は
[`decision-fc-3-finding-code-catalog-snapshot-logical-contract.md`](./decision-fc-3-finding-code-catalog-snapshot-logical-contract.md)
で扱う。

`catalogVersionIdentifier` の論理契約（一意性・opaque・edition 対応・reuse 禁止・fail-closed）は
[`decision-fc-4-catalog-version-identifier-contract.md`](./decision-fc-4-catalog-version-identifier-contract.md)
で扱う。

## 後続 technical contract の fail-closed 要件

後続 technical contract では、少なくとも次を正常 catalog と混同しない必要がある。

```text
catalog unavailable
catalog version missing
catalog version unknown
catalog malformed
multiple active snapshots
FindingCode not present in selected catalog
```

Result 名、型、schema、保存先は本 Decision では定義しない。

## 採択しなかった方式

```text
Option A:
  repository fixed catalog snapshot

Option B:
  runtime external catalog provider

Option D:
  HOLD
```

Option A / B を将来の snapshot materialization 手段として再評価する場合でも、FC-2 の delivery boundary を変更する Decision として明示的に扱う。

## Implementation Gate

FC-2 Accepted は Implementation Start ではない。

```text
Decision-FC-2: Accepted / Option C
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN

src/** changes: prohibited
 tests/** changes: prohibited
FindingCode values invention: prohibited
code numbering invention: prohibited
mapping invention: prohibited
TypeScript enum / union creation: prohibited
validator creation: prohibited
fixture creation: prohibited
Issue #8 FindingCode DEC numbering by AI: prohibited
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
Decision-FC-2: Accepted / Option C
Decision-FC-3: Accepted / Option C
Decision-FC-4: Accepted / Option C
  Catalog version identifier contract
  （complete identifier logical contract）
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

FC-2 / FC-3 / FC-4 Accepted は Implementation Start ではない。
materialization / schema / provider / identifier 物理方式の着手は別 Human Decision とする。
