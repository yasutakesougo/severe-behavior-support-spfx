# Decision-FC-4 — Catalog version identifier contract

この文書は、**Decision-FC-4**（Catalog version identifier contract）の Accepted 正本である。

Decision-FC-4 は、Decision-FC-3 Accepted / Option C が必須とした `catalogVersionIdentifier` について、論理契約だけを固定する。

実際の identifier 値、DEC 番号の自動採番、UUID / hash / semver 等の具体方式、snapshot physical schema、SharePoint storage、provider、TypeScript、validator、fixture、FindingCode values / numbering / mapping は扱わない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FC-4
Status: Accepted
Selected: Option C
Human Acceptance: Explicit Human Option C selection on 2026-08-08
main baseline: 816ba40549e4650cde90e83391b7e44ff39bd705
Candidate head: 4c7624bc6576ea5931c9a52290a4c43b81b5ddb7
Depends on:
  Decision-FC-1 Accepted / Option B
  Decision-FC-2 Accepted / Option C
  Decision-FC-3 Accepted / Option C
Catalog ownership: Issue #8 / new business DEC
Delivery boundary: versioned immutable catalog snapshot input
Snapshot logical contract: Complete logical contract surface
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
Identity assembly: UNCHANGED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / Independent Review 進行状態）は repository docs に書かない。

## Human Acceptance

```text
Human Acceptance: Explicit Human Option C selection on 2026-08-08
Decision-FC-4: Accepted
Selected: Option C
Logical contract: Complete identifier logical contract
Implementation Start: HOLD
```

```text
Agent recommendation: Option C
Binding: NO
Agent recommendation is not Human Acceptance evidence.
```

## Accepted 内容

Option C — **Complete identifier logical contract** を採択する。

`catalogVersionIdentifier` は、次の論理面を一体として満たす。

```text
Uniqueness:
  identifier は全 catalog edition 空間で一意

Edition mapping:
  1 catalog edition ↔ 1 identifier

Issuance responsibility:
  Issue #8 business catalog change control

Opaque boundary:
  technical layer は identifier の内部表現を解釈しない
  technical layer は identifier を生成・再採番・推定しない

Reuse:
  prohibited across editions

Mutation:
  once associated, edition ↔ identifier relation is immutable

Fail-closed:
  identifier missing
  identifier malformed
  identifier unknown
  duplicate identifier
  same identifier mapped to different edition
  same edition mapped to multiple identifiers
```

実際の文字列表現や生成方式（UUID / hash / semver / DEC 番号など）は本 Decision では決めない。

## Uniqueness

```text
catalogVersionIdentifier:
  unique across the catalog edition space

same identifier with different edition:
  PROHIBITED

same edition with multiple identifiers:
  PROHIBITED
```

## Opaque boundary

```text
technical layer:
  MUST NOT interpret identifier internal structure
  MUST NOT generate identifier
  MUST NOT re-number identifier
  MUST NOT infer identifier
```

技術層は identifier を opaque token として扱い、値の構文や意味から edition を推定しない。

## Edition mapping responsibility

```text
Issuance / uniqueness:
  business catalog change control（Issue #8 DEC side）

Edition ↔ identifier:
  one-to-one
  immutable once associated

catalog revision:
  new catalogVersionIdentifier required
```

## Reuse prohibition

```text
Reuse across different editions:
  PROHIBITED

Historical stability:
  once accepted, edition ↔ identifier relation MUST NOT be rewritten
```

## Fail-closed boundary

後続 technical contract は、少なくとも次を正常 identifier と混同してはならない。

```text
identifier missing
identifier malformed
identifier unknown
duplicate identifier
same identifier mapped to different edition
same edition mapped to multiple identifiers
```

Result 名、Result 型、physical schema、保存先は本 Decision では定義しない。

## FC-1〜FC-3 から継承する固定境界

```text
Catalog ownership / change control:
  Issue #8 / new business DEC（FC-1 Option B）

Delivery boundary:
  versioned immutable catalog snapshot input（FC-2 Option C）

Snapshot logical contract:
  Complete logical contract surface（FC-3 Option C）

catalogVersionIdentifier:
  required logical information
  opaque to technical layer

FindingCode:
  caller-supplied required input

Identity validation:
  isReasonCode only

Implicit catalog conversion:
  PROHIBITED

FindingIdentity:
  UNCHANGED

stable Finding ID:
  UNCHANGED

assembleFindingIdentity:
  UNCHANGED
```

`assembleFindingIdentity` に catalog lookup、membership 判定、identifier 生成、criterionId mapping を追加しない。

## 採択しなかった方式

```text
Option A:
  Minimal opaque uniqueness contract

Option B:
  Stable edition identity contract

Option D:
  HOLD
```

Option A / B を将来採用する場合は、FC-4 を変更する新しい Human Decision として扱う。

## FC-4 で決めていないこと

```text
actual identifier values: UNDECIDED
identifier syntax / string representation: UNDECIDED
UUID / hash / semver / DEC-number strategy: UNDECIDED
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

```text
Decision-FC-1: UNCHANGED
Decision-FC-2: UNCHANGED
Decision-FC-3: UNCHANGED
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
assembleFindingIdentity: UNCHANGED
FindingCode remains caller-supplied
isReasonCode remains structural validation boundary
No implicit code generation
No identifier inference
No identifier fallback
No catalog fallback
Contract break: NO
```

## Implementation Gate

FC-4 Accepted は Implementation Start ではない。

```text
Decision-FC-4: Accepted / Option C
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN

src/** changes: prohibited
tests/** changes: prohibited
identifier value invention: prohibited
identifier format selection: prohibited
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
Decision-FC-4: Accepted / Option C
→ Independent Re-review on new HEAD
→ Human Ready Decision
```

Independent Re-review が PASS しても、Ready / Merge / Implementation を自動実行しない。
