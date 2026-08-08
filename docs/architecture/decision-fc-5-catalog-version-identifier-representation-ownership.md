# Decision-FC-5 — Catalog version identifier representation ownership

この文書は、**Decision-FC-5**（Catalog version identifier representation ownership）の Accepted 正本である。

Decision-FC-5 は、Decision-FC-4 Accepted / Option C が未決のまま残した
`catalogVersionIdentifier` の **表現形式（representation）の決定主体と責務境界**
だけを固定する。

UUID / hash / semver / DEC-number 等の具体方式、実際の identifier 値、DEC 番号、
snapshot physical schema、storage / provider、TypeScript、validator、fixture、
FindingCode values / numbering / mapping は扱わない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FC-5
Status: Accepted
Selected: Option C
Human Acceptance: Explicit Human Option C selection on 2026-08-08
main baseline: 192a8fb6c1bc24e151e862459e4b97b5571a0b0c
Candidate head: fb393c66c8139d54115e039bfe3907bd23418ccb
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

Live gate（Ready / Merge / Independent Review 進行状態）は repository docs に書かない。

## Human Acceptance

```text
Human Acceptance: Explicit Human Option C selection on 2026-08-08
Decision-FC-5: Accepted
Selected: Option C
Logical contract: Split ownership with explicit syntax-validation ceiling
Implementation Start: HOLD
```

```text
Agent recommendation: Option C
Binding: NO
Agent recommendation is not Human Acceptance evidence.
```

## Accepted 内容

Option C — **Split ownership with explicit syntax-validation ceiling** を採択する。

representation strategy の採択主体と、technical layer が許される構文検証の上限を分離する。

```text
Representation strategy ownership:
  Issue #8 business catalog change control
  UUID / hash / semver / DEC-number 等の採択は business DEC 側
  本 Decision では具体方式を採択しない

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
  Result names / types: 本 Decision では未定義
```

## Representation ownership

```text
Who decides representation strategy:
  Issue #8 business catalog change control

Who may define non-semantic syntax validation:
  technical contract / Decision
  only after a business-Accepted representation strategy / profile exists
```

技術層が UUID / hash / semver 等を勝手に仮定して FC-4 opaque boundary を上書きしてはならない。

## Business DEC / technical contract 責務境界

```text
Business DEC:
  representation strategy の採択
  representation strategy の change control
  issuance / uniqueness（FC-4 継承）

Technical contract:
  Accepted profile に明示された非意味的構文検証のみ
  MUST NOT select UUID / hash / semver / DEC-number strategy in place of business DEC
  MUST NOT generate / re-number / infer identifier
```

## Allowed technical syntax validation

```text
Ceiling:
  presence / non-empty
  disallowed control characters
  optional charset / length / delimiter shape
    only when explicitly listed by an Accepted representation profile

Prohibited without business-Accepted strategy:
  UUID assumption
  hash assumption
  semver assumption
  edition inference from syntax
  version precedence encoding
```

## Change control

```text
representation strategy change:
  Issue #8 DEC の新規採択または改訂が必要

technical syntax profile change:
  technical Decision / contract 改訂が必要

technical profile must not:
  invent or front-run a business-unaccepted strategy
```

## Fail-closed boundary

後続 technical contract は、少なくとも次を正常 catalog version と混同してはならない。

```text
identifier missing
identifier malformed
identifier unknown
unsupported representation
```

Result 名、Result 型、physical schema、保存先は本 Decision では定義しない。

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

Opaque boundary:
  technical layer MUST NOT interpret identifier internal structure
  technical layer MUST NOT generate / re-number / infer identifier

FindingIdentity / stable Finding ID / assembleFindingIdentity:
  UNCHANGED
```

## 採択しなかった方式

```text
Option A:
  Business DEC owns representation entirely

Option B:
  Technical contract owns representation format

Option D:
  HOLD
```

Option A / B を将来採用する場合は、FC-5 を変更する新しい Human Decision として扱う。

## FC-5 で決めていないこと

```text
UUID / hash / semver / DEC-number strategy: UNDECIDED / DO NOT START
actual identifier values: UNDECIDED
identifier syntax concrete profile: NOT STARTED
Issue #8 FindingCode catalog DEC number: UNASSIGNED
businessOwnershipRef logical contract: Decision-FC-6 CANDIDATE（別単位）
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

`businessOwnershipRef` の論理契約は
[`decision-fc-6-business-ownership-ref-logical-contract.md`](./decision-fc-6-business-ownership-ref-logical-contract.md)
で扱う。

## Contract compatibility gate

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

## Implementation Gate

FC-5 Accepted は Implementation Start ではない。

```text
Decision-FC-5: Accepted / Option C
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
Decision-FC-5: Accepted / Option C
Next substantive unit: Decision-FC-6
  businessOwnershipRef logical contract
  （candidate packet / Human Option selection 待ち）
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

FC-5 Accepted は Implementation Start ではない。
Decision-FC-6 の Option 採択・DEC 本文 / representation strategy / materialization 着手は別 Human Decision とする。
