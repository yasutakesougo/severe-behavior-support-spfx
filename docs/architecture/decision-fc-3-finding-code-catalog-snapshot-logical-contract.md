# Decision-FC-3 — FindingCode catalog snapshot logical contract

この文書は、**Decision-FC-3**（FindingCode catalog snapshot logical contract）の Accepted 正本である。

Decision-FC-3 は、Decision-FC-2 Accepted / Option C が固定した **versioned immutable catalog snapshot input** について、技術層へ渡す snapshot の論理契約だけを固定する。

FindingCode の具体値、コード番号、criterionId mapping、version 文字列表現、物理 schema、SharePoint 保存先、runtime provider、TypeScript 実装、validator、fixture は扱わない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FC-3
Status: Accepted
Selected: Option C
Human Acceptance: Explicit Human Option C selection on 2026-08-08
main baseline: 2988c8a6247d25720ecab8aba9176d47139f7a3b
Candidate head: d54f87c75410cadf67961408a3dbc9dee68a5a23
Depends on:
  Decision-FC-1 Accepted / Option B
  Decision-FC-2 Accepted / Option C
Catalog ownership: Issue #8 / new business DEC
Delivery boundary: versioned immutable catalog snapshot input
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
Decision-FC-3: Accepted
Selected: Option C
Logical contract: Complete logical contract surface
Implementation Start: HOLD
```

```text
Agent recommendation: Option C
Binding: NO
Agent recommendation is not Human Acceptance evidence.
```

## Accepted 内容

Option C — **Complete logical contract surface** を採択する。

snapshot は、次の論理面を一体として保証する。

```text
Required logical information:
  1. catalogVersionIdentifier（opaque）
  2. FindingCode membership set
  3. businessOwnershipRef
```

`catalogVersionIdentifier` の実際の文字列表現は本 Decision では決めない。

`businessOwnershipRef` は Issue #8 の business catalog edition への論理参照であり、DEC 番号の推測採番は行わない。

論理契約の詳細は
[`decision-fc-6-business-ownership-ref-logical-contract.md`](./decision-fc-6-business-ownership-ref-logical-contract.md)
（CANDIDATE / NOT ACCEPTED）で扱う。

## Version uniqueness responsibility

```text
catalogVersionIdentifier の発行・一意性:
  business catalog change control（Issue #8 DEC 側）の責務

technical layer:
  identifier を解釈・再採番・推定しない

same identifier with different logical content:
  PROHIBITED
```

同一 identifier が異なる membership set または businessOwnershipRef を指してはならない。

## Immutable の意味

```text
同一 catalogVersionIdentifier:
  membership set: immutable
  businessOwnershipRef: immutable

in-place update:
  PROHIBITED

catalog revision:
  new catalogVersionIdentifier required
```

技術層で snapshot をコピー・再送する場合も、同一 identifier の論理内容を改変してはならない。

## Selected snapshot integrity

catalog-dependent な技術操作では、selected snapshot は論理上ちょうど 1 つでなければならない。

selected snapshot は required logical information をすべて持つ。

```text
catalogVersionIdentifier:
  present
  known

membership set:
  defined

businessOwnershipRef:
  present

selected snapshot count:
  exactly one
```

membership set の空集合可否は business catalog 側の別判断とする。

`selected` は利用時の論理選択状態を意味する。

永続 store 上の active flag や物理列設計は本 Decision では決めない。

## Fail-closed boundary

後続 technical contract は、少なくとも次を正常 snapshot と混同してはならない。

```text
catalog unavailable
catalog version missing
catalog version unknown
catalog malformed
multiple selected / active snapshots
FindingCode not present in selected catalog
business provenance missing / malformed
```

Result 名、Result 型、physical schema、保存先は本 Decision では定義しない。

## FC-1 / FC-2 から継承する固定境界

```text
Catalog ownership / change control:
  Issue #8 / new business DEC（FC-1 Option B）

Delivery boundary:
  versioned immutable catalog snapshot input（FC-2 Option C）

Repository ownership of catalog values:
  NO

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

`assembleFindingIdentity` に catalog lookup、membership 判定、code generation、criterionId mapping を追加しない。

## 採択しなかった方式

```text
Option A:
  Thin membership snapshot

Option B:
  Membership + business provenance snapshot

Option D:
  HOLD
```

Option A / B を将来採用する場合は、FC-3 を変更する新しい Human Decision として扱う。

## FC-3 で決めていないこと

```text
FindingCode values: UNDECIDED
code numbering: UNDECIDED
criterionId mapping: UNDECIDED
Issue #8 FindingCode catalog DEC number: UNASSIGNED
catalog version identifier logical contract: Decision-FC-4 Accepted / Option C（別単位）
identifier representation ownership: Decision-FC-5 Accepted / Option C（別単位）
businessOwnershipRef logical contract: Decision-FC-6 CANDIDATE（別単位）
actual catalog version string representation / concrete syntax profile: UNDECIDED
snapshot physical schema: NOT STARTED
snapshot materialization: NOT STARTED
snapshot storage / SharePoint location: NOT STARTED / NO-GO
runtime provider: NOT STARTED
TypeScript enum / union / types: NOT STARTED
catalog validator: NOT STARTED
fixture: NOT STARTED
Implementation Start: HOLD
```

AI は上記を補完しない。

`catalogVersionIdentifier` の論理契約は
[`decision-fc-4-catalog-version-identifier-contract.md`](./decision-fc-4-catalog-version-identifier-contract.md)
で扱う。representation ownership は
[`decision-fc-5-catalog-version-identifier-representation-ownership.md`](./decision-fc-5-catalog-version-identifier-representation-ownership.md)
で扱う。`businessOwnershipRef` の論理契約は
[`decision-fc-6-business-ownership-ref-logical-contract.md`](./decision-fc-6-business-ownership-ref-logical-contract.md)
（CANDIDATE）で扱う。実際の文字列表現 / 具体 syntax profile は引き続き UNDECIDED。

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
No repository ownership of catalog values
FC-1 ownership: UNCHANGED
FC-2 delivery boundary: UNCHANGED
Contract break: NO
```

## Implementation Gate

FC-3 Accepted は Implementation Start ではない。

```text
Decision-FC-3: Accepted / Option C
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN

src/** changes: prohibited
tests/** changes: prohibited
snapshot schema creation: prohibited
provider implementation: prohibited
storage implementation: prohibited
FindingCode values invention: prohibited
code numbering invention: prohibited
mapping invention: prohibited
TypeScript type creation: prohibited
validator creation: prohibited
fixture creation: prohibited
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
Decision-FC-3: Accepted / Option C
Decision-FC-4: Accepted / Option C
Decision-FC-5: Accepted / Option C
Decision-FC-6: CANDIDATE / NOT ACCEPTED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

FC-3 / FC-4 / FC-5 Accepted は Implementation Start ではない。
FC-6 Option 採択・Accepted 化・materialization / schema / provider / identifier 物理方式は別 Human Decision とする。
