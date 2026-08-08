# Decision-FC-5 — Catalog version identifier representation ownership

この文書は、**Decision-FC-5**（Catalog version identifier representation ownership）の Accepted 正本である。

Decision-FC-5 は、`catalogVersionIdentifier` の representation strategy の所有と、technical layer が許される syntax validation の上限だけを固定する。

UUID / hash / semver / DEC-number 等の具体方式、実際の identifier 値、DEC 番号、snapshot physical schema、storage / provider、TypeScript、validator、fixture、FindingCode values / numbering / mapping は扱わない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FC-5
Status: Accepted
Selected: Option C
Human Acceptance: Explicit Human Option C selection on 2026-08-08
Recovery baseline: 8a34a68787002e4643aae9b217138044fd919399
Historical gate violation: CONFIRMED / CONTAINED / NOT ERASED
Depends on:
  Decision-FC-1 Accepted / Option B
  Decision-FC-2 Accepted / Option C
  Decision-FC-3 Accepted / Option C
  Decision-FC-4 Accepted / Option C
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
Identity assembly: UNCHANGED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

以前の不正な Option C 記録は Human Acceptance evidence として再利用しない。

今回の `Explicit Human Option C selection on 2026-08-08` を、復旧後の新しい Human Acceptance evidence とする。

## Accepted 内容

Option C — **Split ownership with explicit syntax-validation ceiling** を採択する。

```text
Representation strategy ownership:
  Issue #8 business catalog change control

Business DEC responsibility:
  UUID / hash / semver / DEC-number 等の representation strategy の採択
  representation strategy の変更管理
  technical contract が未採択 strategy を先取りしないための正本

Technical contract responsibility:
  Accepted representation profile が存在する後に限り、
  non-semantic な構造検証を定義しうる

Allowed technical syntax validation ceiling:
  presence / non-empty
  disallowed control characters
  optional charset / length / delimiter shape
    （Accepted profile に明示された場合のみ）

Technical layer MUST NOT:
  identifier の内部意味を解釈する
  version precedence を符号化する
  syntax から catalog edition を推定する
  identifier を生成・再採番・推定する
  business DEC 未採択の UUID / hash / semver 等を仮定する

Change control:
  representation strategy change:
    Issue #8 business DEC の新規採択または改訂
  technical syntax profile change:
    separate technical Decision / contract amendment

Fail-closed:
  identifier missing / malformed / unknown は FC-4 境界を継承
  unsupported representation は正常 catalog version と混同しない
```

## FC-1〜FC-4 から継承する固定境界

```text
Catalog ownership / change control:
  Issue #8 / business DEC

Delivery boundary:
  versioned immutable catalog snapshot input

Snapshot logical contract:
  Complete logical contract surface

Identifier logical contract:
  Complete identifier logical contract

Opaque boundary:
  technical layer MUST NOT interpret / generate / re-number / infer identifier

Edition mapping:
  1 catalog edition ↔ 1 identifier
  immutable once associated

FindingIdentity:
  UNCHANGED
stable Finding ID:
  UNCHANGED
assembleFindingIdentity:
  UNCHANGED
```

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
（CANDIDATE / NOT ACCEPTED）で扱う。

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

## 次の停止点

```text
Decision-FC-5: Accepted / Option C
Next substantive unit: Decision-FC-6
  businessOwnershipRef logical contract
  （reconstituted candidate packet / Human Option selection 待ち）
Selected: NONE
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

FC-5 Accepted は Implementation Start ではない。
Decision-FC-6 の Option 採択・Accepted 化・Implementation Start は各別 Human Decision とする。
Stale PR #126 は再構成前差分として Merge しない。

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
