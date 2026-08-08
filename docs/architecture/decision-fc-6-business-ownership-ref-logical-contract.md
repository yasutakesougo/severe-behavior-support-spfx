# Decision-FC-6 — businessOwnershipRef logical contract

この文書は、**Decision-FC-6**（businessOwnershipRef logical contract）の Accepted 正本である。

Decision-FC-6 は、Decision-FC-3 Accepted / Option C が必須とした
`businessOwnershipRef` について、論理契約だけを固定する。

Issue #8 FindingCode catalog DEC 番号、DEC 本文の値一覧、採番、mapping、
UUID / hash / semver / DEC-number strategy、実際の identifier 値、
ownership ref physical string representation、snapshot physical schema、
storage / provider、TypeScript、validator、fixture は扱わない。

Result name / Result type は定義しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FC-6
Status: Accepted
Selected: Option C
Human Acceptance: Explicit Human Option C selection on 2026-08-08
main baseline: 9aced447c40bd18b698a590142aa17be79c2529c
Candidate head: 6357e95523b1d4e7d0317e283d1d8f032a327991
Depends on:
  Decision-FC-1 Accepted / Option B
  Decision-FC-2 Accepted / Option C
  Decision-FC-3 Accepted / Option C
  Decision-FC-4 Accepted / Option C
  Decision-FC-5 Accepted / Option C
FC-5 Human Acceptance: Explicit Human Option C selection on 2026-08-08
FC-5 Historical gate violation: CONFIRMED / CONTAINED / NOT ERASED
Catalog ownership: Issue #8 / new business DEC
Delivery boundary: versioned immutable catalog snapshot input
Snapshot logical contract: Complete logical contract surface
Identifier logical contract: Complete identifier logical contract
Representation ownership: Split ownership with explicit syntax-validation ceiling
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
Identity assembly: UNCHANGED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / Independent Review 進行状態）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-fc-3-finding-code-catalog-snapshot-logical-contract.md`](./decision-fc-3-finding-code-catalog-snapshot-logical-contract.md)
- [`decision-fc-4-catalog-version-identifier-contract.md`](./decision-fc-4-catalog-version-identifier-contract.md)
- [`decision-fc-5-catalog-version-identifier-representation-ownership.md`](./decision-fc-5-catalog-version-identifier-representation-ownership.md)
- [`decision-fc-1-finding-code-catalog-ownership.md`](./decision-fc-1-finding-code-catalog-ownership.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

## Human Acceptance

```text
Human Acceptance: Explicit Human Option C selection on 2026-08-08
Decision-FC-6: Accepted
Selected: Option C
Logical contract: Complete businessOwnershipRef logical contract
Implementation Start: HOLD
```

```text
Agent recommendation: Option C
Binding: NO
Agent recommendation is not Human Acceptance evidence.
```

本 Accepted は、current main `9aced447…` 基準で再構成した Candidate Packet に対する
Human Option C selection を証跡とする。旧 PR #126 の stale candidate は証跡に使わない。

## Accepted 内容

Option C — **Complete businessOwnershipRef logical contract** を採択する。

`businessOwnershipRef` は、次の論理面を一体として満たす。

```text
Required logical information:
  1. ownershipLedgerRef
     （Issue #8 business catalog change-control ledger への論理参照。
      DEC 番号を AI が推測・採番しない）
  2. catalogEditionRef
     （その snapshot が materialize する business catalog edition への論理参照。
      physical string representation は未決）
  3. optional acceptedRevisionRef
     （採択改訂を区別する必要がある場合のみ。
      使うなら opaque / immutable）

Correspondence responsibility:
  businessOwnershipRef:
    Issue #8 business catalog edition を指す
  technical layer:
    ownership ref から DEC 番号を推定しない
    ownership ref から FindingCode 値を推定しない
    ownership ref を生成しない
    ownership ref を再採番しない

Relation to catalogVersionIdentifier:
  1 catalogVersionIdentifier ↔ 1 businessOwnershipRef
  same identifier with different businessOwnershipRef: PROHIBITED
  same businessOwnershipRef logical content with conflicting membership
    under one identifier: PROHIBITED（FC-3 / FC-4 継承）

Immutable meaning:
  once a catalogVersionIdentifier is established,
  its businessOwnershipRef logical content is immutable
  in-place rewrite: PROHIBITED
  catalog revision: new catalogVersionIdentifier required

Selected snapshot integrity:
  selected snapshot の businessOwnershipRef は present
  ownershipLedgerRef / catalogEditionRef は defined
  selected identifier と ownership ref は矛盾しない

Fail-closed boundary:
  business provenance missing
  business provenance malformed
  ownership ledger unknown
  catalog edition unknown
  ownership ref mismatched to selected catalogVersionIdentifier
  ownership ref mismatched to membership-set provenance
```

物理 schema、DEC 番号、Issue #8 台帳追記手順の実装、Result name / Result type は本 Decision では決めない。

## FC-1〜FC-5 から継承する固定境界

```text
Catalog ownership / change control:
  Issue #8 / new business DEC（FC-1 Option B）

Delivery boundary:
  versioned immutable catalog snapshot input（FC-2 Option C）

Required logical information includes:
  catalogVersionIdentifier
  FindingCode membership set
  businessOwnershipRef（FC-3 Option C）

Representation strategy ownership:
  Issue #8 business catalog change control（FC-5 Option C）

Technical layer（FC-5 Accepted ceiling）:
  Accepted profile 後の non-semantic syntax validation のみ
  MUST NOT:
    identifier internal meaning を解釈
    identifier を生成
    identifier を再採番
    identifier を推定
    syntax から catalog edition を推定
    business DEC 未採択の UUID / hash / semver 等を仮定

FindingIdentity / stable Finding ID / assembleFindingIdentity:
  UNCHANGED

FindingCode:
  caller-supplied required input
  implicit catalog conversion: PROHIBITED
```

FC-6 は ownership / delivery / snapshot / identifier / representation ownership を変更しない。

## FC-6 で決めていないこと

```text
Issue #8 FindingCode catalog DEC number: UNASSIGNED
DEC automatic numbering: FORBIDDEN
FindingCode values: UNDECIDED
code numbering: UNDECIDED
criterionId mapping: UNDECIDED
UUID / hash / semver / DEC-number strategy: UNDECIDED / DO NOT START
actual catalogVersionIdentifier values: UNDECIDED
identifier concrete syntax profile: NOT STARTED
ownership ref physical string representation: UNDECIDED
snapshot physical schema: NOT STARTED
snapshot materialization: NOT STARTED
snapshot storage / SharePoint location: NOT STARTED / NO-GO
runtime provider: NOT STARTED
TypeScript type: NOT STARTED
validator: NOT STARTED
fixture: NOT STARTED
Result name / Result type: UNDECIDED
Implementation Start: HOLD
```

AI は上記を補完しない。

## Identity boundary

```text
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
assembleFindingIdentity: UNCHANGED
FindingCode: caller-supplied required input
implicit catalog conversion: PROHIBITED
```

## SEV boundary

```text
FindingSeverity: NOT ADOPTED
SEV-2-ASSIGN: N/A / DO NOT START
FindingSeverity values: DO NOT CREATE
FindingSeverity TypeScript: DO NOT CREATE
FindingSeverity validator / fixture / implementation: DO NOT CREATE
```

## Contract compatibility gate

```text
Decision-FC-1: UNCHANGED
Decision-FC-2: UNCHANGED
Decision-FC-3: UNCHANGED
Decision-FC-4: UNCHANGED
Decision-FC-5: UNCHANGED
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
assembleFindingIdentity: UNCHANGED
FindingCode remains caller-supplied
No DEC number invention
No FindingCode value invention
No identifier inference
No ownership-ref inference of catalog values
No catalog fallback
Contract break: NO
```

## Implementation Gate

FC-6 Accepted は Implementation Start ではない。

```text
Decision-FC-6: Accepted / Option C
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN

src/** changes: prohibited
tests/** changes: prohibited
DEC numbering by AI: prohibited
FindingCode value invention: prohibited
UUID / hash / semver selection: prohibited
ownership ref physical format invention: prohibited
snapshot schema creation: prohibited
provider implementation: prohibited
storage implementation: prohibited
TypeScript type creation: prohibited
validator creation: prohibited
fixture creation: prohibited
```

## Environment boundary

```text
SharePoint changes: NO-GO
tenant changes: NO-GO
Microsoft 365 changes: NO-GO
Entra changes: NO-GO
deploy: NO-GO
real data: PROHIBITED
```

## 次の停止点

```text
Decision-FC-6: Accepted / Option C
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
→ DEC 本文 / representation strategy / materialization は別 Human Start
→ FindingCode values / numbering / mapping は別 Human Start
```

Accepted は Ready / Merge / Implementation の自動実行を許可しない。
